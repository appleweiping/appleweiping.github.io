# frozen_string_literal: true

require "date"
require "json"
require "net/http"
require "time"
require "uri"

module RepositoryCatalog
  OWNER = "appleweiping"
  DEFAULT_OUTPUT = File.expand_path("../_data/repository_catalog.json", __dir__)

  SOURCE_KINDS = %w[research original coursework reproduction fork meta experiment metadata-only].freeze

  CATEGORY_DEFINITIONS = [
    {
      "slug" => "ai-agents",
      "title" => "AI & Agent Systems",
      "description" => "Agent systems, orchestration, language-model applications, and autonomous workflows."
    },
    {
      "slug" => "ai4s-research",
      "title" => "AI for Science & Research",
      "description" => "Research code applying machine learning, simulation, and computational methods to scientific questions."
    },
    {
      "slug" => "models-data",
      "title" => "Recommenders, Models & Data",
      "description" => "Machine-learning models, recommender systems, data analysis, and statistical computing."
    },
    {
      "slug" => "systems-security",
      "title" => "Systems, Security & Infrastructure",
      "description" => "Operating systems, compilers, networks, databases, security, and infrastructure engineering."
    },
    {
      "slug" => "robotics-hardware",
      "title" => "Robotics, Embedded & Hardware",
      "description" => "Robotics, control, signals, embedded systems, digital design, and hardware-oriented work."
    },
    {
      "slug" => "creative-computing",
      "title" => "Graphics, Games & Creative Computing",
      "description" => "Computer graphics, games, visualization, media, and other creative computing projects."
    },
    {
      "slug" => "products-tools",
      "title" => "Products & Developer Tools",
      "description" => "User-facing products, web applications, productivity software, and developer tooling."
    },
    {
      "slug" => "coursework-notes",
      "title" => "Coursework, Reproductions & Notes",
      "description" => "Coursework records, self-study implementations, reproducibility exercises, and technical notes."
    },
    {
      "slug" => "new-acquisitions",
      "title" => "New Acquisitions",
      "description" => "Recently published repositories awaiting deeper editorial classification."
    }
  ].freeze

  CATEGORY_SLUGS = CATEGORY_DEFINITIONS.map { |category| category.fetch("slug") }.freeze

  ATTRIBUTION_BY_SOURCE = {
    "research" => "Research repository; consult its documentation for collaborators, data sources, and contribution details.",
    "original" => "Independent project by Weiping Yan unless the repository documentation credits collaborators or upstream components.",
    "coursework" => "Coursework record; the repository documentation is authoritative for team and module attribution.",
    "reproduction" => "Self-study reproduction based on the named public course or source material; upstream teaching materials remain attributed in the repository.",
    "fork" => "Forked repository; original authorship belongs to the upstream project. Consult the repository for local changes.",
    "meta" => "Metadata, documentation, or resource collection; individual upstream materials retain their original attribution.",
    "experiment" => "Experimental repository; consult its documentation for methods, sources, and contribution details.",
    "metadata-only" => "Listed from public GitHub metadata; authorship and contribution details have not been independently curated."
  }.freeze

  class Error < StandardError; end

  class GitHubClient
    API_ROOT = "https://api.github.com"

    def initialize(token: ENV["GITHUB_TOKEN"], api_root: ENV.fetch("GITHUB_API_URL", API_ROOT))
      @token = token.to_s.strip
      uri = URI.parse(api_root.to_s)
      unless uri.is_a?(URI::HTTPS) &&
             uri.host == "api.github.com" &&
             [nil, "", "/"].include?(uri.path) &&
             !uri.query &&
             !uri.fragment
        raise Error, "GitHub API root must be the official HTTPS endpoint"
      end

      @api_root = API_ROOT
    rescue URI::InvalidURIError
      raise Error, "GitHub API root must be the official HTTPS endpoint"
    end

    def public_repositories(owner)
      repositories = []
      page = 1

      loop do
        batch = get_json(
          "/users/#{escape(owner)}/repos",
          "type" => "owner",
          "sort" => "full_name",
          "direction" => "asc",
          "per_page" => "100",
          "page" => page.to_s
        )
        raise Error, "GitHub repositories response was not an array" unless batch.is_a?(Array)

        repositories.concat(batch)
        break if batch.length < 100

        page += 1
      end

      repositories
    end

    def profile(owner)
      response = get_json("/users/#{escape(owner)}")
      raise Error, "GitHub profile response was not an object" unless response.is_a?(Hash)

      response
    end

    private

    def escape(value)
      URI.encode_www_form_component(value)
    end

    def get_json(path, query = {})
      uri = URI("#{@api_root}#{path}")
      uri.query = URI.encode_www_form(query) unless query.empty?

      request = Net::HTTP::Get.new(uri)
      request["Accept"] = "application/vnd.github+json"
      request["User-Agent"] = "appleweiping-repository-catalog"
      request["X-GitHub-Api-Version"] = "2022-11-28"
      request["Authorization"] = "Bearer #{@token}" unless @token.empty?

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https", open_timeout: 15, read_timeout: 45) do |http|
        http.request(request)
      end

      unless response.is_a?(Net::HTTPSuccess)
        rate_limit = response["x-ratelimit-remaining"]
        detail = begin
          JSON.parse(response.body).fetch("message", response.body)
        rescue JSON::ParserError
          response.body
        end
        suffix = rate_limit ? " (rate limit remaining: #{rate_limit})" : ""
        raise Error, "GitHub API #{response.code}: #{detail}#{suffix}"
      end

      JSON.parse(response.body)
    rescue JSON::ParserError => e
      raise Error, "GitHub API returned invalid JSON: #{e.message}"
    rescue SocketError, SystemCallError, Timeout::Error => e
      raise Error, "GitHub API request failed: #{e.message}"
    end
  end

  module_function

  def iso8601?(value)
    return false unless value.is_a?(String) && !value.empty?

    Time.iso8601(value)
    true
  rescue ArgumentError
    false
  end

  def https_url?(value)
    return false unless value.is_a?(String) && !value.empty?

    uri = URI.parse(value)
    uri.is_a?(URI::HTTPS) && !uri.host.to_s.empty?
  rescue URI::InvalidURIError
    false
  end

  def slugify(value)
    value.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/\A-|-\z/, "")
  end
end
