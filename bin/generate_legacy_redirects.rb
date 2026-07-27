#!/usr/bin/env ruby
# frozen_string_literal: true

require "cgi"
require "date"
require "fileutils"
require "json"
require "optparse"
require "pathname"
require "set"
require "uri"
require "yaml"

module LegacyRedirects
  class Error < StandardError; end

  SLUG_PATTERN = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/
  SAFE_FRAGMENT_PATTERN = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/
  SAFE_PATH_PATTERN = %r{\A/(?:[A-Za-z0-9._~-]+/)*[A-Za-z0-9._~-]*\z}
  LOCALES = {
    "en" => {
      prefix: "",
      lang: "en",
      title: "Page moved | Weiping Yan",
      message: "This page has moved to"
    },
    "zh" => {
      prefix: "/zh",
      lang: "zh-CN",
      title: "页面已迁移 | 闫维平",
      message: "此页面已迁移至"
    },
    "ja" => {
      prefix: "/ja",
      lang: "ja",
      title: "ページが移動しました | Weiping Yan",
      message: "このページは次の場所へ移動しました"
    }
  }.freeze
  LOCALIZED_CV_PDFS = {
    "zh" => "/assets/pdf/Weiping_Yan_CV_zh-CN.pdf",
    "ja" => "/assets/pdf/Weiping_Yan_CV_ja.pdf"
  }.freeze

  Redirect = Struct.new(:source, :target, :locale, :dynamic, :asset_alias, keyword_init: true)

  class Generator
    attr_reader :written_files

    def initialize(root:, destination:, site_url: nil, baseurl: nil, cv_pdf: nil)
      @root = Pathname(root).expand_path
      @destination = Pathname(destination).expand_path
      @configuration = read_yaml(@root.join("_config.yml"))
      @site_url = normalized_site_url(site_url || @configuration["url"])
      @baseurl = normalized_baseurl(baseurl.nil? ? @configuration["baseurl"] : baseurl)
      @cv_pdfs = {
        "en" => cv_pdf || cv_pdf_from_page || "/assets/pdf/Weiping_Yan_CV_en.pdf",
        **LOCALIZED_CV_PDFS
      }
      @redirects = []
      @outputs = {}
      @written_files = []
    end

    def run
      validate_destination!
      projects = project_slugs
      catalog = catalog_slugs
      legacy = legacy_slugs

      validate_slug_set!(projects, "project")
      validate_slug_set!(catalog, "repository catalog")
      validate_slug_set!(legacy, "legacy repository")

      LOCALES.each_key do |locale|
        add_static_redirects(locale, projects, catalog, legacy)
        add_cabinet_redirect(locale, projects, catalog, legacy)
      end
      write_redirects

      puts "Generated #{@written_files.length} legacy redirect files in #{@destination}."
    end

    private

    def add_static_redirects(locale, projects, catalog, legacy)
      add(localized_path(locale, "/research/"), localized_path(locale, "/publications/"), locale)
      add(localized_path(locale, "/works/"), localized_path(locale, "/projects/"), locale)
      add(localized_path(locale, "/resume/"), localized_path(locale, "/cv/"), locale)
      add(localized_path(locale, "/resume/print/"), @cv_pdfs.fetch(locale), locale)
      add(localized_path(locale, "/resume.pdf"), @cv_pdfs.fetch(locale), locale, asset_alias: true)
      add(localized_path(locale, "/resume.html"), localized_path(locale, "/cv/"), locale)
      add(localized_path(locale, "/contact/"), "#{localized_path(locale, "/")}#contact", locale)

      legacy.each do |slug|
        target = legacy_target(locale, slug, projects, catalog)
        add(localized_path(locale, "/works/#{slug}/"), target, locale)
      end
    end

    def add_cabinet_redirect(locale, projects, catalog, legacy)
      mappings = legacy.to_h { |slug| [slug, legacy_target(locale, slug, projects, catalog)] }
      catalog_path = localized_path(locale, "/repositories/catalog/")
      add(localized_path(locale, "/cabinet/"), catalog_path, locale, cabinet_script(mappings, catalog_path))
    end

    def legacy_target(locale, slug, projects, catalog)
      if projects.include?(slug)
        localized_path(locale, "/projects/#{slug}/")
      elsif catalog.include?(slug)
        "#{localized_path(locale, "/repositories/catalog/")}##{slug}"
      else
        localized_path(locale, "/repositories/catalog/")
      end
    end

    def localized_path(locale, path)
      "#{LOCALES.fetch(locale).fetch(:prefix)}#{path}"
    end

    def add(source, target, locale, dynamic = nil, asset_alias: false)
      normalized_source = normalize_source(source)
      validated_target = validate_target!(target)
      output = output_path(normalized_source)
      output_key = output.to_s.downcase
      if @outputs.key?(output_key)
        raise Error, "duplicate redirect output #{output} from #{normalized_source} and #{@outputs.fetch(output_key)}"
      end

      @outputs[output_key] = normalized_source
      @redirects << Redirect.new(source: normalized_source, target: validated_target, locale: locale, dynamic: dynamic, asset_alias: asset_alias)
    end

    def write_redirects
      @redirects.each do |redirect|
        output = output_path(redirect.source)
        raise Error, "redirect output already exists: #{output}" if output.exist?

        output.dirname.mkpath
        if redirect.asset_alias
          source = asset_path(redirect.target)
          FileUtils.copy_file(source, output)
        else
          output.write(html_for(redirect), mode: "w", encoding: "UTF-8")
        end
        @written_files << output
      end
    end

    def html_for(redirect)
      locale = LOCALES.fetch(redirect.locale)
      target = public_url(redirect.target)
      escaped_target = CGI.escapeHTML(target)
      script = redirect.dynamic || "window.location.replace(#{target.to_json});"
      <<~HTML
        <!doctype html>
        <html lang="#{locale.fetch(:lang)}">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>#{locale.fetch(:title)}</title>
            <link rel="canonical" href="#{CGI.escapeHTML(absolute_url(redirect.target))}">
            <meta http-equiv="refresh" content="0; url=#{escaped_target}">
            <meta name="robots" content="noindex, follow">
            <script>
              #{script}
            </script>
          </head>
          <body>
            <p>#{locale.fetch(:message)} <a href="#{escaped_target}">#{escaped_target}</a>.</p>
          </body>
        </html>
      HTML
    end

    def cabinet_script(mappings, catalog_path)
      json = JSON.generate(mappings).gsub("</", "<\\/")
      <<~JS.chomp
        const project = new URLSearchParams(window.location.search).get("project");
        const redirects = #{json};
        const target = project && Object.prototype.hasOwnProperty.call(redirects, project)
          ? #{@baseurl.to_json} + redirects[project]
          : #{public_url(catalog_path).to_json};
        window.location.replace(target);
      JS
    end

    def project_slugs
      @root.glob("_projects/**/*.md").filter_map do |path|
        front_matter = read_front_matter(path)
        next unless front_matter["locale"] == "en"

        permalink = front_matter["permalink"].to_s
        match = permalink.match(%r{\A/projects/([^/]+)/\z})
        raise Error, "English project must use /projects/:slug/ permalink: #{path}" unless match

        validate_slug!(match[1], "project #{path}")
      end.sort
    end

    def catalog_slugs
      catalog = read_json(@root.join("_data/repository_catalog.json"))
      repositories = catalog["repositories"]
      raise Error, "repository catalog repositories must be an array" unless repositories.is_a?(Array)

      repositories.map do |repository|
        raise Error, "repository catalog entry must be an object" unless repository.is_a?(Hash)
        raise Error, "repository catalog contains a non-public entry" unless repository["visibility"] == "public"

        validate_slug!(repository["slug"], "repository catalog")
      end.sort
    end

    def legacy_slugs
      manifest = read_json(@root.join("_data/legacy_repository_slugs.json"))
      slugs = manifest["slugs"]
      raise Error, "legacy repository slugs must be an array" unless slugs.is_a?(Array)
      unless manifest["expected_count"] == slugs.length
        raise Error, "legacy repository slug count mismatch: expected #{manifest['expected_count'].inspect}, got #{slugs.length}"
      end

      slugs.map { |slug| validate_slug!(slug, "legacy repository") }.sort
    end

    def validate_slug_set!(slugs, label)
      duplicates = slugs.group_by(&:itself).select { |_slug, values| values.length > 1 }.keys
      raise Error, "duplicate #{label} slugs: #{duplicates.sort.join(', ')}" unless duplicates.empty?
    end

    def validate_slug!(slug, label)
      unless slug.is_a?(String) && slug.match?(SLUG_PATTERN)
        raise Error, "unsafe #{label} slug: #{slug.inspect}"
      end

      slug
    end

    def cv_pdf_from_page
      path = @root.join("_pages/cv.md")
      return nil unless path.file?

      value = read_front_matter(path)["cv_pdf"]
      return nil if value.nil? || value.to_s.strip.empty?

      value.to_s.sub(/\s+#.*\z/, "").strip
    end

    def read_front_matter(path)
      content = path.read(encoding: "UTF-8")
      match = content.match(/\A---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|\z)/m)
      raise Error, "missing YAML front matter: #{path}" unless match

      YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false) || {}
    rescue Psych::SyntaxError => e
      raise Error, "invalid YAML front matter in #{path}: #{e.message}"
    end

    def read_yaml(path)
      YAML.safe_load(path.read(encoding: "UTF-8"), permitted_classes: [Date, Time], aliases: false) || {}
    rescue Errno::ENOENT
      raise Error, "missing configuration: #{path}"
    rescue Psych::SyntaxError => e
      raise Error, "invalid configuration YAML: #{e.message}"
    end

    def read_json(path)
      JSON.parse(path.read(encoding: "UTF-8"))
    rescue Errno::ENOENT
      raise Error, "missing data file: #{path}"
    rescue JSON::ParserError => e
      raise Error, "invalid JSON in #{path}: #{e.message}"
    end

    def normalize_source(source)
      unless source.is_a?(String) && source.start_with?("/") && !source.include?("?") && !source.include?("#")
        raise Error, "unsafe redirect source: #{source.inspect}"
      end
      raise Error, "unsafe redirect source: #{source.inspect}" if source.include?("\\") || source.split("/").include?("..")
      raise Error, "unsafe redirect source: #{source.inspect}" unless source.match?(SAFE_PATH_PATTERN)

      source
    end

    def validate_target!(target)
      unless target.is_a?(String) && target.start_with?("/") && !target.start_with?("//") && !target.include?("?")
        raise Error, "unsafe redirect target: #{target.inspect}"
      end
      raise Error, "unsafe redirect target: #{target.inspect}" if target.include?("\\") || target.include?("..")

      path, fragment = target.split("#", 2)
      raise Error, "unsafe redirect target path: #{target.inspect}" unless path.match?(SAFE_PATH_PATTERN)
      if fragment && !fragment.match?(SAFE_FRAGMENT_PATTERN)
        raise Error, "unsafe redirect target fragment: #{target.inspect}"
      end

      target
    end

    def output_path(source)
      relative = source.delete_prefix("/")
      relative = "index.html" if relative.empty?
      relative = "#{relative}index.html" if relative.end_with?("/")
      relative = "#{relative}.html" if File.extname(relative).empty?

      output = @destination.join(relative).cleanpath
      unless output.to_s.start_with?("#{@destination.cleanpath}#{File::SEPARATOR}")
        raise Error, "redirect output escapes destination: #{source.inspect}"
      end

      output
    end

    def asset_path(target)
      path, fragment = target.split("#", 2)
      raise Error, "asset alias cannot target a fragment: #{target.inspect}" if fragment

      source = @destination.join(path.delete_prefix("/")).cleanpath
      unless source.to_s.start_with?("#{@destination.cleanpath}#{File::SEPARATOR}")
        raise Error, "asset alias escapes destination: #{target.inspect}"
      end
      raise Error, "asset alias target does not exist: #{target}" unless source.file?

      source
    end

    def validate_destination!
      raise Error, "site destination does not exist: #{@destination}" unless @destination.directory?
      raise Error, "site destination cannot be the repository root" if @destination == @root
      raise Error, "site destination cannot be a symbolic link" if @destination.symlink?
    end

    def normalized_site_url(value)
      uri = URI.parse(value.to_s)
      unless uri.is_a?(URI::HTTPS) && !uri.host.to_s.empty? && uri.path.to_s.match?(%r{\A/?\z}) && !uri.query && !uri.fragment
        raise Error, "site URL must be an HTTPS origin: #{value.inspect}"
      end

      "https://#{uri.host}#{uri.port == 443 ? '' : ":#{uri.port}"}"
    rescue URI::InvalidURIError
      raise Error, "invalid site URL: #{value.inspect}"
    end

    def normalized_baseurl(value)
      baseurl = value.to_s.strip
      return "" if baseurl.empty? || baseurl == "/"
      unless baseurl.match?(%r{\A/(?:[A-Za-z0-9._~-]+/)*[A-Za-z0-9._~-]+\z})
        raise Error, "unsafe baseurl: #{value.inspect}"
      end

      baseurl
    end

    def public_url(target)
      path, fragment = target.split("#", 2)
      result = "#{@baseurl}#{path}"
      fragment ? "#{result}##{fragment}" : result
    end

    def absolute_url(target)
      "#{@site_url}#{public_url(target)}"
    end
  end
end

options = {
  root: File.expand_path("..", __dir__),
  destination: nil,
  site_url: nil,
  baseurl: nil,
  cv_pdf: nil
}

OptionParser.new do |parser|
  parser.banner = "Usage: ruby bin/generate_legacy_redirects.rb [options]"
  parser.on("--root PATH", "Repository root") { |value| options[:root] = File.expand_path(value) }
  parser.on("--destination PATH", "Built Jekyll site directory (default: ROOT/_site)") { |value| options[:destination] = File.expand_path(value) }
  parser.on("--url URL", "Canonical HTTPS site origin (default: _config.yml url)") { |value| options[:site_url] = value }
  parser.on("--baseurl PATH", "Published base URL (default: _config.yml baseurl)") { |value| options[:baseurl] = value }
  parser.on("--cv-pdf PATH", "CV PDF target (default: _pages/cv.md cv_pdf)") { |value| options[:cv_pdf] = value }
end.parse!

options[:destination] ||= File.join(options.fetch(:root), "_site")

begin
  LegacyRedirects::Generator.new(**options).run
rescue LegacyRedirects::Error, Errno::EACCES, Errno::ENOENT => e
  warn "Legacy redirect generation failed: #{e.message}"
  exit 1
end
