#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "net/http"
require "time"
require "uri"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
CATALOG_PATH = File.join(ROOT, "_data", "repository_catalog.json")
OUTPUT_PATH = File.join(ROOT, "assets", "img", "repository-covers", "GITHUB_OG_SOURCES.json")
GRAPHQL_URI = URI("https://api.github.com/graphql")

QUERY = <<~GRAPHQL
  query RepositoryPreviews($login: String!, $after: String) {
    user(login: $login) {
      repositories(
        first: 100
        after: $after
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: {field: NAME, direction: ASC}
      ) {
        nodes {
          name
          nameWithOwner
          openGraphImageUrl
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
GRAPHQL

def graphql(token, variables)
  request = Net::HTTP::Post.new(GRAPHQL_URI)
  request["Authorization"] = "Bearer #{token}"
  request["Content-Type"] = "application/json"
  request["User-Agent"] = "appleweiping-portfolio-cover-audit/1.0"
  request.body = JSON.generate(query: QUERY, variables: variables)

  response = Net::HTTP.start(GRAPHQL_URI.host, GRAPHQL_URI.port, use_ssl: true) do |http|
    http.open_timeout = 15
    http.read_timeout = 30
    http.request(request)
  end
  raise "GitHub GraphQL returned HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)

  payload = JSON.parse(response.body)
  raise "GitHub GraphQL error: #{payload.fetch('errors').map { |error| error['message'] }.join('; ')}" if payload["errors"]

  payload.dig("data", "user", "repositories") || raise("GitHub user was not found")
end

token = ENV["GITHUB_TOKEN"].to_s
abort "GITHUB_TOKEN is required" if token.empty?

catalog = JSON.parse(File.read(CATALOG_PATH, encoding: "UTF-8"))
owner = catalog.fetch("owner")
live_by_name = {}
cursor = nil

loop do
  page = graphql(token, login: owner, after: cursor)
  page.fetch("nodes").each { |repository| live_by_name[repository.fetch("name")] = repository }
  page_info = page.fetch("pageInfo")
  break unless page_info.fetch("hasNextPage")

  cursor = page_info.fetch("endCursor")
end

repositories = catalog.fetch("repositories").to_h do |repository|
  name = repository.fetch("repository").split("/", 2).last
  live = live_by_name.fetch(name) { raise "GitHub preview data is missing #{repository.fetch('repository')}" }
  preview_url = live.fetch("openGraphImageUrl")
  uri = URI(preview_url)
  raise "Unexpected preview URL for #{name}: #{preview_url}" unless uri.is_a?(URI::HTTPS) && uri.host == "opengraph.githubassets.com"

  [
    repository.fetch("slug"),
    {
      "repository" => live.fetch("nameWithOwner"),
      "open_graph_image_url" => preview_url
    }
  ]
end

extra_names = live_by_name.keys - catalog.fetch("repositories").map { |repository| repository.fetch("repository").split("/", 2).last }
raise "GitHub contains repositories absent from the catalog: #{extra_names.sort.join(', ')}" unless extra_names.empty?

payload = {
  "schema_version" => 1,
  "owner" => owner,
  "synced_at" => Time.now.utc.iso8601,
  "repository_count" => repositories.length,
  "repositories" => repositories
}

FileUtils.mkdir_p(File.dirname(OUTPUT_PATH)) unless Dir.exist?(File.dirname(OUTPUT_PATH))
File.write(OUTPUT_PATH, JSON.pretty_generate(payload) + "\n", mode: "w", encoding: "UTF-8")
puts "Synchronized #{repositories.length} GitHub repository preview sources."
