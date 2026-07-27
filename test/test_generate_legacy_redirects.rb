#!/usr/bin/env ruby
# frozen_string_literal: true

ENV["MT_NO_PLUGINS"] = "1"

require "json"
require "fileutils"
require "minitest/autorun"
require "open3"
require "tmpdir"

class GenerateLegacyRedirectsTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  SCRIPT = File.join(ROOT, "bin/generate_legacy_redirects.rb")

  def test_generates_complete_redirect_set
    Dir.mktmpdir("legacy-redirect-fixture") do |temporary_directory|
      destination = File.join(temporary_directory, "_site")
      cv_pdfs = {
        "en" => File.join(destination, "assets/pdf/Weiping_Yan_CV_en.pdf"),
        "zh" => File.join(destination, "assets/pdf/Weiping_Yan_CV_zh-CN.pdf"),
        "ja" => File.join(destination, "assets/pdf/Weiping_Yan_CV_ja.pdf")
      }
      cv_pdfs.each do |locale, path|
        FileUtils.mkdir_p(File.dirname(path))
        File.binwrite(path, "%PDF-1.4\n#{locale} fixture\n%%EOF\n")
      end
      stdout, stderr, status = Open3.capture3(
        "ruby",
        SCRIPT,
        "--root",
        ROOT,
        "--destination",
        destination,
        "--cv-pdf",
        "/assets/pdf/Weiping_Yan_CV_en.pdf"
      )

      assert status.success?, "#{stdout}\n#{stderr}"
      generated = Dir.glob(File.join(destination, "**/*"), File::FNM_DOTMATCH).count { |path| File.file?(path) } - cv_pdfs.length
      assert_equal 516, generated

      assert_redirect(destination, "research/index.html", "/publications/", locale: "en")
      assert_redirect(destination, "works/topo-flow-limits/index.html", "/projects/topo-flow-limits/", locale: "en")
      assert_redirect(destination, "works/acecue/index.html", "/repositories/catalog/#acecue", locale: "en")
      assert_redirect(destination, "works/behavioral-auth-lab/index.html", "/repositories/catalog/", locale: "en")
      assert_redirect(destination, "resume/print/index.html", "/assets/pdf/Weiping_Yan_CV_en.pdf", locale: "en")
      assert_redirect(destination, "resume.html", "/cv/", locale: "en")
      assert_redirect(destination, "contact/index.html", "/#contact", locale: "en")

      assert_redirect(destination, "zh/research/index.html", "/zh/publications/", locale: "zh")
      assert_redirect(destination, "zh/works/topo-flow-limits/index.html", "/zh/projects/topo-flow-limits/", locale: "zh")
      assert_redirect(destination, "zh/works/acecue/index.html", "/zh/repositories/catalog/#acecue", locale: "zh")
      assert_redirect(destination, "zh/works/behavioral-auth-lab/index.html", "/zh/repositories/catalog/", locale: "zh")
      assert_redirect(destination, "zh/resume/print/index.html", "/assets/pdf/Weiping_Yan_CV_zh-CN.pdf", locale: "zh")
      assert_redirect(destination, "zh/resume.html", "/zh/cv/", locale: "zh")
      assert_redirect(destination, "zh/contact/index.html", "/zh/#contact", locale: "zh")

      assert_redirect(destination, "ja/research/index.html", "/ja/publications/", locale: "ja")
      assert_redirect(destination, "ja/works/topo-flow-limits/index.html", "/ja/projects/topo-flow-limits/", locale: "ja")
      assert_redirect(destination, "ja/works/acecue/index.html", "/ja/repositories/catalog/#acecue", locale: "ja")
      assert_redirect(destination, "ja/works/behavioral-auth-lab/index.html", "/ja/repositories/catalog/", locale: "ja")
      assert_redirect(destination, "ja/resume/print/index.html", "/assets/pdf/Weiping_Yan_CV_ja.pdf", locale: "ja")
      assert_redirect(destination, "ja/resume.html", "/ja/cv/", locale: "ja")
      assert_redirect(destination, "ja/contact/index.html", "/ja/#contact", locale: "ja")

      assert_equal File.binread(cv_pdfs.fetch("en")), File.binread(File.join(destination, "resume.pdf"))
      assert_equal File.binread(cv_pdfs.fetch("zh")), File.binread(File.join(destination, "zh/resume.pdf"))
      assert_equal File.binread(cv_pdfs.fetch("ja")), File.binread(File.join(destination, "ja/resume.pdf"))
      %w[resume.pdf zh/resume.pdf ja/resume.pdf].each do |relative_path|
        assert File.binread(File.join(destination, relative_path), 5).start_with?("%PDF-")
      end

      refute_path_exists File.join(destination, "zh/index.html")
      refute_path_exists File.join(destination, "ja/index.html")

      assert_cabinet(destination, "cabinet/index.html", "/projects/topo-flow-limits/", "/repositories/catalog/#acecue", "/repositories/catalog/", "en")
      assert_cabinet(
        destination,
        "zh/cabinet/index.html",
        "/zh/projects/topo-flow-limits/",
        "/zh/repositories/catalog/#acecue",
        "/zh/repositories/catalog/",
        "zh"
      )
      assert_cabinet(
        destination,
        "ja/cabinet/index.html",
        "/ja/projects/topo-flow-limits/",
        "/ja/repositories/catalog/#acecue",
        "/ja/repositories/catalog/",
        "ja"
      )
    end
  end

  def test_rejects_unsafe_slug_and_does_not_escape_destination
    Dir.mktmpdir("legacy-redirect-source") do |root|
      FileUtils.mkdir_p(File.join(root, "_data"))
      FileUtils.mkdir_p(File.join(root, "_projects"))
      File.write(File.join(root, "_config.yml"), "url: https://example.com\nbaseurl:\n", encoding: "UTF-8")
      catalog = {
        "repositories" => [
          { "slug" => "../escape", "visibility" => "public" }
        ]
      }
      File.write(File.join(root, "_data/repository_catalog.json"), JSON.generate(catalog), encoding: "UTF-8")
      manifest = { "expected_count" => 1, "slugs" => ["safe-slug"] }
      File.write(File.join(root, "_data/legacy_repository_slugs.json"), JSON.generate(manifest), encoding: "UTF-8")

      Dir.mktmpdir("legacy-redirect-fixture") do |temporary_directory|
        destination = File.join(temporary_directory, "_site")
        FileUtils.mkdir_p(destination)
        _stdout, stderr, status = Open3.capture3("ruby", SCRIPT, "--root", root, "--destination", destination)
        refute status.success?
        assert_includes stderr, "unsafe repository catalog slug"
      end
    end
  end

  private

  def assert_redirect(destination, relative_path, target, locale:)
    html = File.read(File.join(destination, relative_path), encoding: "UTF-8")
    assert_includes html, %(<link rel="canonical" href="https://appleweiping.github.io#{target}">)
    assert_includes html, %(<meta http-equiv="refresh" content="0; url=#{target}">)
    assert_includes html, %(window.location.replace(#{target.to_json});)
    assert_includes html, %(<a href="#{target}">#{target}</a>)

    expected = {
      "en" => ["en", "Page moved | Weiping Yan", "This page has moved to"],
      "zh" => ["zh-CN", "页面已迁移 | 闫维平", "此页面已迁移至"],
      "ja" => ["ja", "ページが移動しました | Weiping Yan", "このページは次の場所へ移動しました"]
    }.fetch(locale)
    assert_includes html, %(<html lang="#{expected[0]}">)
    assert_includes html, %(<title>#{expected[1]}</title>)
    assert_includes html, expected[2]
  end

  def assert_cabinet(destination, relative_path, project_target, catalog_target, fallback_target, locale)
    html = File.read(File.join(destination, relative_path), encoding: "UTF-8")
    assert_includes html, 'new URLSearchParams(window.location.search).get("project")'
    assert_includes html, %("topo-flow-limits":#{project_target.to_json})
    assert_includes html, %("acecue":#{catalog_target.to_json})
    assert_includes html, %("behavioral-auth-lab":#{fallback_target.to_json})
    assert_includes html, %(<meta http-equiv="refresh" content="0; url=#{fallback_target}">)
    assert_includes html, "window.location.replace(target);"

    lang = { "en" => "en", "zh" => "zh-CN", "ja" => "ja" }.fetch(locale)
    assert_includes html, %(<html lang="#{lang}">)
  end
end
