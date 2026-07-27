#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "json"
require "pathname"
require "set"
require "yaml"

root = Pathname(File.expand_path("..", __dir__))
errors = []

LOCALES = {
  "en" => { "lang" => "en", "prefix" => "" },
  "zh" => { "lang" => "zh-CN", "prefix" => "/zh" },
  "ja" => { "lang" => "ja", "prefix" => "/ja" }
}.freeze

CORE_TRANSLATION_KEYS = %w[
  about
  publications
  projects
  repositories
  repository-catalog
  cv
  news
  404
].to_set.freeze

EXPECTED_COUNTS = {
  "projects" => 12,
  "news" => 10
}.freeze

Document = Struct.new(:path, :front_matter, :body, keyword_init: true)

def read_document(path)
  content = path.read(encoding: "UTF-8")
  match = content.match(/\A---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|\z)(.*)\z/m)
  raise "missing YAML front matter" unless match

  front_matter = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false) || {}
  Document.new(path: path, front_matter: front_matter, body: match[2].strip)
rescue Psych::SyntaxError => e
  raise "invalid YAML front matter: #{e.message}"
end

def load_documents(root, glob, errors)
  root.glob(glob).sort.filter_map do |path|
    read_document(path)
  rescue StandardError => e
    errors << "#{path.relative_path_from(root)}: #{e.message}"
    nil
  end
end

def grouped_by_key(documents)
  documents.group_by { |document| document.front_matter["translation_key"].to_s }
end

def external_urls(body)
  body.scan(%r{https://[^\s\)\]>"']+}).map { |url| url.sub(/[.,;:]\z/, "") }.to_set
end

def expected_locale_path(prefix, route)
  return route if prefix.empty?
  return "#{prefix}/" if route == "/"
  return "#{prefix}#{route}" if route.start_with?("/")

  "#{prefix}/#{route}"
end

collections = {
  "pages" => load_documents(root, "_pages/**/*.md", errors),
  "projects" => load_documents(root, "_projects/**/*.md", errors),
  "news" => load_documents(root, "_news/**/*.md", errors)
}

collections.each do |collection, documents|
  documents.each do |document|
    label = document.path.relative_path_from(root)
    front_matter = document.front_matter
    locale = front_matter["locale"].to_s

    unless LOCALES.key?(locale)
      errors << "#{label}: locale must be one of #{LOCALES.keys.join(', ')}"
      next
    end

    expected_lang = LOCALES.fetch(locale).fetch("lang")
    errors << "#{label}: lang must be #{expected_lang.inspect}" unless front_matter["lang"] == expected_lang
    errors << "#{label}: translation_key is required" if front_matter["translation_key"].to_s.empty?

    permalink = front_matter["permalink"].to_s
    errors << "#{label}: an explicit absolute permalink is required" unless permalink.start_with?("/")
    expected_prefix = LOCALES.fetch(locale).fetch("prefix")
    unless expected_prefix.empty? || permalink == "#{expected_prefix}/" || permalink.start_with?("#{expected_prefix}/")
      errors << "#{label}: #{locale} permalink must remain below #{expected_prefix}/"
    end

    if locale == "en" && permalink.start_with?("/zh/", "/ja/")
      errors << "#{label}: English permalink cannot use a localized prefix"
    end

    if document.body.empty? && front_matter["translation_key"] != "cv"
      errors << "#{label}: translated document body must not be empty"
    end
  end

  routes = documents.map { |document| document.front_matter["permalink"].to_s }.reject(&:empty?)
  duplicates = routes.group_by(&:itself).select { |_route, values| values.length > 1 }.keys
  errors << "#{collection}: duplicate permalinks: #{duplicates.sort.join(', ')}" unless duplicates.empty?
end

%w[projects news].each do |collection|
  documents = collections.fetch(collection)
  by_locale = documents.group_by { |document| document.front_matter["locale"].to_s }
  LOCALES.each_key do |locale|
    count = by_locale.fetch(locale, []).length
    expected = EXPECTED_COUNTS.fetch(collection)
    errors << "#{collection}: expected #{expected} #{locale} documents, found #{count}" unless count == expected
  end

  grouped_by_key(documents).each do |translation_key, translations|
    label = "#{collection}/#{translation_key.empty? ? '(missing key)' : translation_key}"
    locales = translations.map { |document| document.front_matter["locale"] }.sort
    errors << "#{label}: expected exactly en/zh/ja translations, found #{locales.inspect}" unless locales == LOCALES.keys.sort
    next unless locales == LOCALES.keys.sort

    english = translations.find { |document| document.front_matter["locale"] == "en" }
    route = english.front_matter["permalink"]
    LOCALES.each do |locale, settings|
      translation = translations.find { |document| document.front_matter["locale"] == locale }
      expected_route = expected_locale_path(settings.fetch("prefix"), route)
      unless translation.front_matter["permalink"] == expected_route
        errors << "#{label}: #{locale} permalink should be #{expected_route}, found #{translation.front_matter['permalink'].inspect}"
      end
    end

    if collection == "projects"
      %w[importance category img related_publications].each do |field|
        values = translations.map { |document| document.front_matter[field] }.uniq
        errors << "#{label}: #{field} differs across translations" unless values.length == 1
      end

      baseline_urls = external_urls(english.body)
      translations.each do |translation|
        next if external_urls(translation.body) == baseline_urls

        errors << "#{label}: external URL set differs in #{translation.front_matter['locale']} translation"
      end
    else
      dates = translations.map { |document| document.front_matter["date"]&.to_s }.uniq
      errors << "#{label}: news date differs across translations" unless dates.length == 1
    end
  end

  key_sets = LOCALES.keys.to_h do |locale|
    [locale, by_locale.fetch(locale, []).map { |document| document.front_matter["translation_key"] }.to_set]
  end
  errors << "#{collection}: translation_key sets differ across locales" unless key_sets.values.uniq.length == 1
end

pages = collections.fetch("pages").select do |document|
  CORE_TRANSLATION_KEYS.include?(document.front_matter["translation_key"])
end
page_keys_by_locale = LOCALES.keys.to_h do |locale|
  [
    locale,
    pages
      .select { |document| document.front_matter["locale"] == locale }
      .map { |document| document.front_matter["translation_key"] }
      .to_set
  ]
end
page_keys_by_locale.each do |locale, keys|
  missing = CORE_TRANSLATION_KEYS - keys
  extra = keys - CORE_TRANSLATION_KEYS
  errors << "pages: #{locale} is missing core translation keys: #{missing.to_a.sort.join(', ')}" unless missing.empty?
  errors << "pages: #{locale} has unexpected core translation keys: #{extra.to_a.sort.join(', ')}" unless extra.empty?
end

grouped_by_key(pages).each do |translation_key, translations|
  locales = translations.map { |document| document.front_matter["locale"] }.sort
  errors << "pages/#{translation_key}: expected exactly en/zh/ja translations, found #{locales.inspect}" unless locales == LOCALES.keys.sort
end

begin
  catalog = JSON.parse(root.join("_data/repository_catalog.json").read(encoding: "UTF-8"))
  translations = JSON.parse(root.join("_data/repository_catalog_i18n.json").read(encoding: "UTF-8"))
  repository_slugs = catalog.fetch("repositories").map { |repository| repository.fetch("slug") }.to_set
  translated_slugs = translations.fetch("repositories").keys.to_set
  errors << "repository i18n slug set does not match the public catalog" unless repository_slugs == translated_slugs

  translations.fetch("repositories").each do |slug, entry|
    %w[zh ja].each do |locale|
      errors << "repository #{slug}: missing #{locale} description" if entry[locale].to_s.strip.empty?
    end
  end

  category_slugs = catalog.fetch("categories").map { |category| category.fetch("slug") }.to_set
  errors << "repository category i18n keys do not match the catalog" unless translations.fetch("categories").keys.to_set == category_slugs
  translations.fetch("categories").each do |slug, entry|
    %w[zh ja].each do |locale|
      %w[title description].each do |field|
        errors << "repository category #{slug}: missing #{locale}.#{field}" if entry.dig(locale, field).to_s.strip.empty?
      end
    end
  end

  source_kinds = catalog.fetch("repositories").map { |repository| repository.fetch("source_kind") }.to_set
  missing_source_kinds = source_kinds - translations.fetch("source_kinds").keys.to_set
  errors << "repository source-kind translations missing: #{missing_source_kinds.to_a.sort.join(', ')}" unless missing_source_kinds.empty?

  attributions = catalog.fetch("repositories").map { |repository| repository.fetch("attribution") }.to_set
  errors << "repository attribution i18n keys do not match the catalog" unless translations.fetch("attributions").keys.to_set == attributions
rescue Errno::ENOENT, JSON::ParserError, KeyError => e
  errors << "repository catalog translation data is invalid: #{e.message}"
end

forbidden_news = root.join("_news/2026-05-01-umn.md")
errors << "the false 2026-05-01 UMN-start news item still exists" if forbidden_news.exist?

errors.uniq!
if errors.empty?
  puts(
    "Translations are complete: " \
    "#{collections.fetch('projects').length} project pages, " \
    "#{collections.fetch('news').length} news items, and " \
    "#{pages.length} core pages across en/zh/ja."
  )
else
  warn "Translation validation failed with #{errors.length} error(s):"
  errors.each { |error| warn "- #{error}" }
  exit 1
end
