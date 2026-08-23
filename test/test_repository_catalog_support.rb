# frozen_string_literal: true

require "minitest/autorun"
require_relative "../bin/repository_catalog_support"

class RepositoryCatalogSupportTest < Minitest::Test
  def test_curated_active_project_sources_are_portfolio_projects
    RepositoryCatalog::DEFAULT_PROJECT_SOURCE_KINDS.each do |source_kind|
      assert RepositoryCatalog.default_portfolio_project?(repository(source_kind: source_kind)), source_kind
    end
  end

  def test_non_project_sources_are_excluded
    %w[fork meta metadata-only].each do |source_kind|
      refute RepositoryCatalog.default_portfolio_project?(repository(source_kind: source_kind)), source_kind
    end
  end

  def test_forks_archives_and_unreviewed_entries_are_excluded
    refute RepositoryCatalog.default_portfolio_project?(repository(fork: true))
    refute RepositoryCatalog.default_portfolio_project?(repository(archived: true))
    refute RepositoryCatalog.default_portfolio_project?(repository(curation_status: "metadata-only"))
  end

  def test_curated_meta_projects_can_be_included_explicitly
    assert RepositoryCatalog.valid_portfolio_project?(repository(source_kind: "meta", portfolio_project: true))
  end

  def test_ineligible_repositories_cannot_be_included_explicitly
    refute RepositoryCatalog.valid_portfolio_project?(repository(source_kind: "fork", portfolio_project: true))
    refute RepositoryCatalog.valid_portfolio_project?(repository(fork: true, portfolio_project: true))
    refute RepositoryCatalog.valid_portfolio_project?(repository(archived: true, portfolio_project: true))
    refute RepositoryCatalog.valid_portfolio_project?(repository(curation_status: "metadata-only", portfolio_project: true))
  end

  private

  def repository(source_kind: "original", fork: false, archived: false, curation_status: "curated", portfolio_project: false)
    {
      "source_kind" => source_kind,
      "fork" => fork,
      "archived" => archived,
      "curation_status" => curation_status,
      "portfolio_project" => portfolio_project
    }
  end
end
