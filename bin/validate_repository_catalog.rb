#!/usr/bin/env ruby
# frozen_string_literal: true

require "digest"
require "json"
require "optparse"
require "set"
require "yaml"
require_relative "repository_catalog_support"

options = {
  catalog: RepositoryCatalog::DEFAULT_OUTPUT,
  covers: File.expand_path("../_data/repository_covers.json", __dir__),
  remote: true
}

OptionParser.new do |parser|
  parser.banner = "Usage: ruby bin/validate_repository_catalog.rb [options]"
  parser.on("--catalog PATH", "Catalog path (default: _data/repository_catalog.json)") { |value| options[:catalog] = File.expand_path(value) }
  parser.on("--covers PATH", "Repository cover manifest (default: _data/repository_covers.json)") { |value| options[:covers] = File.expand_path(value) }
  parser.on("--offline", "Skip comparison with the live GitHub public repository API") { options[:remote] = false }
end.parse!

def read_catalog(path)
  content = File.read(path, encoding: "UTF-8")
  case File.extname(path).downcase
  when ".json"
    JSON.parse(content)
  when ".yml", ".yaml"
    YAML.safe_load(content, permitted_classes: [Date, Time], aliases: false)
  else
    raise RepositoryCatalog::Error, "Unsupported catalog format: #{path}"
  end
rescue Errno::ENOENT
  raise RepositoryCatalog::Error, "Catalog does not exist: #{path}"
rescue JSON::ParserError, Psych::SyntaxError => e
  raise RepositoryCatalog::Error, "Could not parse catalog: #{e.message}"
end

def require_value(entry, field, errors, label)
  value = entry[field]
  errors << "#{label}: #{field} is required" if value.nil? || (value.respond_to?(:empty?) && value.empty?)
  value
end

def duplicate_values(values)
  values.group_by(&:itself).select { |_value, occurrences| occurrences.length > 1 }.keys
end

begin
  catalog = read_catalog(options.fetch(:catalog))
  raise RepositoryCatalog::Error, "Catalog root must be an object" unless catalog.is_a?(Hash)
  cover_manifest = read_catalog(options.fetch(:covers))
  raise RepositoryCatalog::Error, "Repository cover manifest root must be an object" unless cover_manifest.is_a?(Hash)

  errors = []
  owner = catalog["owner"]
  errors << "owner must be #{RepositoryCatalog::OWNER}" unless owner == RepositoryCatalog::OWNER

  repositories = catalog["repositories"]
  raise RepositoryCatalog::Error, "repositories must be an array" unless repositories.is_a?(Array)

  errors << "public_count does not match repositories length" unless catalog["public_count"] == repositories.length
  errors << "synced_at must be an ISO-8601 timestamp" unless RepositoryCatalog.iso8601?(catalog["synced_at"])

  seen_ids = []
  seen_names = []
  seen_slugs = []

  repositories.each_with_index do |repository, index|
    label = repository.is_a?(Hash) ? repository["repository"] || "repositories[#{index}]" : "repositories[#{index}]"
    unless repository.is_a?(Hash)
      errors << "#{label}: entry must be an object"
      next
    end

    repo_id = require_value(repository, "repo_id", errors, label)
    slug = require_value(repository, "slug", errors, label)
    full_name = require_value(repository, "repository", errors, label)
    require_value(repository, "title", errors, label)
    require_value(repository, "description", errors, label)
    source_kind = require_value(repository, "source_kind", errors, label)
    category = require_value(repository, "category", errors, label)
    curation_status = require_value(repository, "curation_status", errors, label)
    source_url = require_value(repository, "source_url", errors, label)
    require_value(repository, "attribution", errors, label)
    require_value(repository, "default_branch", errors, label)

    seen_ids << repo_id
    seen_names << full_name.to_s.downcase
    seen_slugs << slug

    errors << "#{label}: repo_id must be a positive integer" unless repo_id.is_a?(Integer) && repo_id.positive?
    errors << "#{label}: invalid slug #{slug.inspect}" unless slug.is_a?(String) && slug.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
    errors << "#{label}: repository must belong to #{owner}" unless full_name.is_a?(String) && full_name.match?(/\A#{Regexp.escape(owner.to_s)}\/[^\s\/]+\z/i)
    errors << "#{label}: unknown source_kind #{source_kind.inspect}" unless RepositoryCatalog::SOURCE_KINDS.include?(source_kind)
    errors << "#{label}: unknown category #{category.inspect}" unless RepositoryCatalog::CATEGORY_SLUGS.include?(category)
    errors << "#{label}: unknown curation_status #{curation_status.inspect}" unless RepositoryCatalog::CURATION_STATUSES.include?(curation_status)
    errors << "#{label}: source_url must be HTTPS" unless RepositoryCatalog.https_url?(source_url)
    errors << "#{label}: source_url does not match repository" unless source_url == "https://github.com/#{full_name}"
    errors << "#{label}: demo_url must be HTTPS" if repository.key?("demo_url") && !RepositoryCatalog.https_url?(repository["demo_url"])
    errors << "#{label}: visibility must be public" unless repository["visibility"] == "public"
    errors << "#{label}: size_kb must be a non-negative integer" unless repository["size_kb"].is_a?(Integer) && repository["size_kb"] >= 0
    errors << "#{label}: archived must be boolean" unless [true, false].include?(repository["archived"])
    errors << "#{label}: fork must be boolean" unless [true, false].include?(repository["fork"])
    errors << "#{label}: portfolio_project must be boolean" unless [true, false].include?(repository["portfolio_project"])
    if [true, false].include?(repository["portfolio_project"]) && !RepositoryCatalog.valid_portfolio_project?(repository)
      errors << "#{label}: portfolio_project violates the catalog inclusion policy"
    end

    %w[created_at updated_at pushed_at].each do |field|
      errors << "#{label}: #{field} must be an ISO-8601 timestamp" unless RepositoryCatalog.iso8601?(repository[field])
    end

    topics = repository["topics"]
    errors << "#{label}: topics must be an array of strings" unless topics.is_a?(Array) && topics.all? { |topic| topic.is_a?(String) && !topic.empty? }
    languages = repository["languages"]
    errors << "#{label}: languages must be a non-empty array of strings" unless languages.is_a?(Array) && !languages.empty? && languages.all? { |language| language.is_a?(String) && !language.empty? }
  end

  duplicate_values(seen_ids).each { |value| errors << "duplicate repo_id: #{value}" }
  duplicate_values(seen_names).each { |value| errors << "duplicate repository: #{value}" }
  duplicate_values(seen_slugs).each { |value| errors << "duplicate slug: #{value}" }

  covers = cover_manifest["covers"]
  if !covers.is_a?(Hash)
    errors << "repository cover manifest covers must be an object"
  else
    repository_slugs = seen_slugs.select { |slug| slug.is_a?(String) }.to_set
    cover_slugs = covers.keys.to_set
    (repository_slugs - cover_slugs).sort.each { |slug| errors << "repository cover manifest is missing #{slug}" }
    (cover_slugs - repository_slugs).sort.each { |slug| errors << "repository cover manifest contains unknown slug #{slug}" }
    errors << "repository cover manifest cover_count does not match repositories length" unless cover_manifest["cover_count"] == repositories.length
    errors << "repository cover manifest owner must be #{owner}" unless cover_manifest["owner"] == owner

    covers.each do |slug, cover|
      label = "repository cover #{slug}"
      unless cover.is_a?(Hash)
        errors << "#{label}: entry must be an object"
        next
      end

      expected_path = "/assets/img/repository-covers/#{slug}.webp"
      path = require_value(cover, "path", errors, label)
      errors << "#{label}: path must be #{expected_path}" unless path == expected_path
      errors << "#{label}: width must be 960" unless cover["width"] == 960
      errors << "#{label}: height must be 540" unless cover["height"] == 540
      output_sha256 = cover["output_sha256"]
      unless output_sha256.is_a?(String) && output_sha256.match?(/\A[0-9a-f]{64}\z/)
        errors << "#{label}: output_sha256 must be a lowercase SHA-256 digest"
      end

      next unless path == expected_path

      cover_file = File.expand_path("..#{path}", __dir__)
      if !File.file?(cover_file)
        errors << "#{label}: generated file is missing at #{path}"
      elsif output_sha256.is_a?(String) && output_sha256.match?(/\A[0-9a-f]{64}\z/) && Digest::SHA256.file(cover_file).hexdigest != output_sha256
        errors << "#{label}: generated file SHA-256 does not match the manifest"
      end
    end
  end

  whale = repositories.find { |repository| repository["repo_id"] == 1_245_101_224 }
  if whale
    errors << "WEIPING_WHALE must be labeled reproduction" unless whale["source_kind"] == "reproduction"
    errors << "WEIPING_WHALE attribution must identify CodeWhale" unless whale["attribution"].to_s.include?("CodeWhale")
  else
    errors << "WEIPING_WHALE is missing from the public repository catalog"
  end

  actual_source_counts = RepositoryCatalog::SOURCE_KINDS.to_h do |source_kind|
    [source_kind, repositories.count { |repository| repository["source_kind"] == source_kind }]
  end.reject { |_source_kind, count| count.zero? }
  errors << "source_counts do not match repository entries" unless catalog["source_counts"] == actual_source_counts

  project_repositories = repositories.select { |repository| repository["portfolio_project"] }
  errors << "project_count does not match portfolio project entries" unless catalog["project_count"] == project_repositories.length
  actual_project_source_counts = RepositoryCatalog::PORTFOLIO_SOURCE_KINDS.to_h do |source_kind|
    [source_kind, project_repositories.count { |repository| repository["source_kind"] == source_kind }]
  end.reject { |_source_kind, count| count.zero? }
  unless catalog["project_source_counts"] == actual_project_source_counts
    errors << "project_source_counts do not match portfolio project entries"
  end

  categories = catalog["categories"]
  if !categories.is_a?(Array)
    errors << "categories must be an array"
  else
    category_slugs = categories.filter_map { |category| category["slug"] if category.is_a?(Hash) }
    errors << "category definitions are incomplete or out of order" unless category_slugs == RepositoryCatalog::CATEGORY_SLUGS
    categories.each do |category|
      next unless category.is_a?(Hash)

      slug = category["slug"]
      actual_count = repositories.count { |repository| repository["category"] == slug }
      actual_project_count = project_repositories.count { |repository| repository["category"] == slug }
      errors << "category #{slug.inspect} count does not match repository entries" unless category["count"] == actual_count
      unless category["project_count"] == actual_project_count
        errors << "category #{slug.inspect} project_count does not match portfolio project entries"
      end
      errors << "category #{slug.inspect} needs a title" if category["title"].to_s.empty?
      errors << "category #{slug.inspect} needs a description" if category["description"].to_s.empty?
    end
  end

  if options.fetch(:remote) && errors.empty?
    client = RepositoryCatalog::GitHubClient.new
    profile = client.profile(owner)
    remote_repositories = client.public_repositories(owner)
    errors << "GitHub profile public_repos does not match API pagination" unless profile["public_repos"] == remote_repositories.length

    remote_by_id = remote_repositories.to_h { |repository| [repository.fetch("id"), repository] }
    catalog_ids = repositories.map { |repository| repository.fetch("repo_id") }.to_set
    remote_ids = remote_by_id.keys.to_set
    (catalog_ids - remote_ids).each { |repo_id| errors << "catalog repository #{repo_id} is no longer public on GitHub" }
    (remote_ids - catalog_ids).each { |repo_id| errors << "public GitHub repository #{remote_by_id.fetch(repo_id)['full_name']} is missing from the catalog" }

    repositories.each do |repository|
      remote = remote_by_id[repository.fetch("repo_id")]
      next unless remote

      label = repository.fetch("repository")
      errors << "#{label}: live repository is private" if remote["private"]
      errors << "#{label}: live repository is not public" unless remote["visibility"] == "public"
      errors << "#{label}: repository name is stale" unless repository["repository"] == remote["full_name"]
      errors << "#{label}: source URL is stale" unless repository["source_url"] == remote["html_url"]
      errors << "#{label}: updated_at is stale" unless repository["updated_at"] == remote["updated_at"]
      errors << "#{label}: archived status is stale" unless repository["archived"] == remote["archived"]
      errors << "#{label}: fork status is stale" unless repository["fork"] == remote["fork"]
    end
  end

  raise RepositoryCatalog::Error, errors.join("\n") unless errors.empty?

  mode = options.fetch(:remote) ? "including live GitHub comparison" : "offline"
  puts "Repository catalog is valid: #{repositories.length} public repositories and #{covers.length} covers (#{mode})."
rescue KeyError, RepositoryCatalog::Error => e
  warn "Repository catalog validation failed:\n#{e.message}"
  exit 1
end
