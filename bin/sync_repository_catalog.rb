#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "optparse"
require "tempfile"
require "yaml"
require_relative "repository_catalog_support"

options = {
  owner: RepositoryCatalog::OWNER,
  output: RepositoryCatalog::DEFAULT_OUTPUT,
  snapshot: nil
}

OptionParser.new do |parser|
  parser.banner = "Usage: ruby bin/sync_repository_catalog.rb [options]"
  parser.on("--owner OWNER", "GitHub account to synchronize (default: #{RepositoryCatalog::OWNER})") { |value| options[:owner] = value }
  parser.on("--snapshot PATH", "Curated JSON/YAML snapshot to merge on the first run") { |value| options[:snapshot] = File.expand_path(value) }
  parser.on("--output PATH", "Catalog output path (default: _data/repository_catalog.json)") { |value| options[:output] = File.expand_path(value) }
end.parse!

def read_data(path)
  return nil unless path && File.file?(path)

  content = File.read(path, encoding: "UTF-8")
  case File.extname(path).downcase
  when ".json"
    JSON.parse(content)
  when ".yml", ".yaml"
    YAML.safe_load(content, permitted_classes: [Date, Time], aliases: false)
  else
    raise RepositoryCatalog::Error, "Unsupported snapshot format: #{path}"
  end
rescue JSON::ParserError, Psych::SyntaxError => e
  raise RepositoryCatalog::Error, "Could not parse #{path}: #{e.message}"
end

def curated_repositories(data)
  return [] unless data.is_a?(Hash)

  repositories = data["repositories"] || data["projects"]
  repositories.is_a?(Array) ? repositories : []
end

def index_curated(repositories)
  by_id = {}
  by_name = {}

  repositories.each do |repository|
    next unless repository.is_a?(Hash)

    repo_id = repository["repo_id"] || repository["repoId"]
    full_name = repository["repository"].to_s.downcase
    by_id[repo_id.to_i] = repository if repo_id.to_i.positive?
    by_name[full_name] = repository unless full_name.empty?
  end

  [by_id, by_name]
end

def text_from(value, *path)
  current = value
  path.each do |key|
    return nil unless current.is_a?(Hash)

    current = current[key]
  end
  current.is_a?(String) && !current.strip.empty? ? current.strip : nil
end

def curated_value(curated, snake_case, camel_case = nil)
  curated[snake_case] || (camel_case && curated[camel_case])
end

def normalize_languages(curated, api_repository)
  languages = curated["languages"]
  languages = [] unless languages.is_a?(Array)
  languages = languages.filter_map { |language| language.to_s.strip unless language.to_s.strip.empty? }
  primary = api_repository["language"].to_s.strip
  languages.unshift(primary) unless primary.empty? || languages.any? { |language| language.casecmp?(primary) }
  languages << "Documentation" if languages.empty?
  languages.uniq
end

def normalize_demo(curated, api_repository)
  curated_url = text_from(curated, "demo_url") || text_from(curated, "demo", "url")
  api_homepage = api_repository["homepage"].to_s.strip
  url = if RepositoryCatalog.https_url?(curated_url)
          curated_url
        elsif RepositoryCatalog.https_url?(api_homepage)
          api_homepage
        end
  return {} unless url

  demo = { "demo_url" => url }
  verified_at = text_from(curated, "demo_verified_at") || text_from(curated, "demo", "verifiedAt")
  demo["demo_verified_at"] = verified_at if verified_at
  demo
end

def build_entry(api_repository, curated)
  source_kind = curated_value(curated, "source_kind", "sourceKind") || "metadata-only"
  category = curated_value(curated, "category", "wing") || "new-acquisitions"
  description = text_from(curated, "description") || text_from(curated, "summary", "en") || api_repository["description"].to_s.strip
  description = "Public repository metadata for #{api_repository.fetch('name')}." if description.empty?
  attribution = text_from(curated, "attribution") || text_from(curated, "contribution", "en") || RepositoryCatalog::ATTRIBUTION_BY_SOURCE.fetch(source_kind)
  slug = text_from(curated, "slug") || RepositoryCatalog.slugify(api_repository.fetch("name"))

  {
    "repo_id" => api_repository.fetch("id"),
    "slug" => slug,
    "repository" => api_repository.fetch("full_name"),
    "title" => api_repository.fetch("name"),
    "description" => description,
    "source_kind" => source_kind,
    "category" => category,
    "topics" => Array(api_repository["topics"]).map(&:to_s).reject(&:empty?).uniq.sort,
    "languages" => normalize_languages(curated, api_repository),
    "source_url" => api_repository.fetch("html_url"),
    "created_at" => api_repository.fetch("created_at"),
    "updated_at" => api_repository.fetch("updated_at"),
    "pushed_at" => api_repository.fetch("pushed_at"),
    "archived" => api_repository.fetch("archived"),
    "fork" => api_repository.fetch("fork"),
    "visibility" => api_repository.fetch("visibility"),
    "size_kb" => api_repository.fetch("size"),
    "default_branch" => api_repository.fetch("default_branch"),
    "curation_status" => curated_value(curated, "curation_status", "curationStatus") || "metadata-only",
    "attribution" => attribution
  }.merge(normalize_demo(curated, api_repository))
end

def write_catalog(path, catalog)
  FileUtils.mkdir_p(File.dirname(path))
  output = case File.extname(path).downcase
           when ".json"
             JSON.pretty_generate(catalog) + "\n"
           when ".yml", ".yaml"
             YAML.dump(catalog)
           else
             raise RepositoryCatalog::Error, "Unsupported output format: #{path}"
           end

  Tempfile.create(["repository-catalog-", File.extname(path)], File.dirname(path), encoding: "UTF-8") do |temporary|
    temporary.write(output)
    temporary.flush
    temporary.fsync
    begin
      File.rename(temporary.path, path)
    rescue Errno::EACCES, Errno::EEXIST
      # Windows does not allow File.rename to replace an existing destination.
      # Copying the fully flushed same-directory temporary file over the exact
      # destination is reliable on Windows, where FileUtils.mv(force: true) may
      # leave the existing destination unchanged.
      FileUtils.copy_file(temporary.path, path)
    end
  end
end

begin
  require "fileutils"

  owner = options.fetch(:owner).strip
  unless owner.match?(/\A[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\z/)
    raise RepositoryCatalog::Error, "Owner is not a valid GitHub username"
  end

  output_path = File.expand_path(options.fetch(:output))
  data_directory = File.expand_path("../_data", __dir__)
  unless File.dirname(output_path) == data_directory
    raise RepositoryCatalog::Error, "Catalog output must remain inside #{data_directory}"
  end

  snapshot_path = options[:snapshot] || (File.file?(output_path) ? output_path : nil)
  curated_data = read_data(snapshot_path)
  curated = curated_repositories(curated_data)
  by_id, by_name = index_curated(curated)

  client = RepositoryCatalog::GitHubClient.new
  profile = client.profile(owner)
  api_repositories = client.public_repositories(owner)
  expected_count = profile.fetch("public_repos")

  unless api_repositories.length == expected_count
    raise RepositoryCatalog::Error,
          "GitHub pagination returned #{api_repositories.length} repositories, but the profile reports #{expected_count}"
  end

  api_repositories.each do |repository|
    raise RepositoryCatalog::Error, "Private repository returned by public endpoint: #{repository['full_name']}" if repository["private"]
    raise RepositoryCatalog::Error, "Non-public repository returned by public endpoint: #{repository['full_name']}" unless repository["visibility"] == "public"
    raise RepositoryCatalog::Error, "Repository source URL is empty: #{repository['full_name']}" if repository["html_url"].to_s.strip.empty?
  end

  repositories = api_repositories.map do |api_repository|
    existing = by_id[api_repository.fetch("id")] || by_name[api_repository.fetch("full_name").downcase] || {}
    build_entry(api_repository, existing)
  end
  repositories.sort_by! { |repository| repository.fetch("repository").downcase }

  ids = repositories.map { |repository| repository.fetch("repo_id") }
  names = repositories.map { |repository| repository.fetch("repository").downcase }
  slugs = repositories.map { |repository| repository.fetch("slug") }
  raise RepositoryCatalog::Error, "Duplicate repository IDs detected" unless ids.uniq.length == ids.length
  raise RepositoryCatalog::Error, "Duplicate repository names detected" unless names.uniq.length == names.length
  raise RepositoryCatalog::Error, "Duplicate repository slugs detected" unless slugs.uniq.length == slugs.length

  invalid_sources = repositories.map { |repository| repository.fetch("source_kind") }.uniq - RepositoryCatalog::SOURCE_KINDS
  raise RepositoryCatalog::Error, "Unknown source kinds: #{invalid_sources.join(', ')}" unless invalid_sources.empty?

  invalid_categories = repositories.map { |repository| repository.fetch("category") }.uniq - RepositoryCatalog::CATEGORY_SLUGS
  raise RepositoryCatalog::Error, "Unknown categories: #{invalid_categories.join(', ')}" unless invalid_categories.empty?

  source_counts = RepositoryCatalog::SOURCE_KINDS.to_h do |source_kind|
    [source_kind, repositories.count { |repository| repository.fetch("source_kind") == source_kind }]
  end.reject { |_source_kind, count| count.zero? }

  categories = RepositoryCatalog::CATEGORY_DEFINITIONS.map do |definition|
    definition.merge("count" => repositories.count { |repository| repository.fetch("category") == definition.fetch("slug") })
  end

  catalog = {
    "owner" => owner,
    "public_count" => repositories.length,
    "synced_at" => Time.now.utc.iso8601,
    "source_counts" => source_counts,
    "categories" => categories,
    "repositories" => repositories
  }

  write_catalog(output_path, catalog)
  removed = curated.filter_map do |repository|
    repo_id = curated_value(repository, "repo_id", "repoId").to_i
    repository["repository"] unless ids.include?(repo_id)
  end

  puts "Wrote #{repositories.length} public repositories to #{output_path}"
  puts "Excluded #{removed.length} snapshot repositories absent from the public API: #{removed.join(', ')}" unless removed.empty?
rescue KeyError, RepositoryCatalog::Error => e
  warn "Repository catalog sync failed: #{e.message}"
  exit 1
end
