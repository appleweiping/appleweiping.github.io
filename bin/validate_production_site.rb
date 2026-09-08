#!/usr/bin/env ruby
# frozen_string_literal: true

require "digest"
require "json"
require "nokogiri"
require "optparse"
require "pathname"
require "set"
require "uri"
require "yaml"

options = {
  root: File.expand_path("..", __dir__),
  destination: nil
}

OptionParser.new do |parser|
  parser.banner = "Usage: ruby bin/validate_production_site.rb [options]"
  parser.on("--root PATH", "Repository root") { |value| options[:root] = File.expand_path(value) }
  parser.on("--destination PATH", "Built site directory (default: ROOT/_site)") { |value| options[:destination] = File.expand_path(value) }
end.parse!

root = Pathname(options.fetch(:root)).expand_path
destination = Pathname(options[:destination] || root.join("_site")).expand_path
errors = []

unless destination.directory?
  warn "Production site validation failed: destination does not exist: #{destination}"
  exit 1
end

def output_path(destination, route)
  relative = route.delete_prefix("/")
  return destination.join("index.html") if relative.empty?
  return destination.join(relative, "index.html") if route.end_with?("/")

  destination.join(relative)
end

def https_url?(value)
  uri = URI.parse(value.to_s)
  uri.is_a?(URI::HTTPS) && !uri.host.to_s.empty?
rescue URI::InvalidURIError
  false
end

def parse_html(path, errors, destination)
  Nokogiri::HTML5(path.read(encoding: "UTF-8"))
rescue StandardError => e
  errors << "could not parse #{path.relative_path_from(destination)}: #{e.message}"
  nil
end

def validate_repository_cover_images(document, selector, repositories, covers, errors, label, baseurl)
  images = document.css(selector)
  expected_slugs = repositories.map { |repository| repository.fetch("slug") }
  actual_slugs = images.map { |image| image["data-repository-slug"].to_s }

  if images.length != repositories.length
    errors << "#{label} should render #{repositories.length} repository covers, found #{images.length}"
  end

  (expected_slugs.to_set - actual_slugs.to_set).sort.each { |slug| errors << "#{label} is missing repository cover #{slug}" }
  (actual_slugs.to_set - expected_slugs.to_set).sort.each { |slug| errors << "#{label} includes unexpected repository cover #{slug.inspect}" }
  actual_slugs.tally.each do |slug, count|
    errors << "#{label} renders repository cover #{slug.inspect} #{count} times" if count > 1
  end

  images.each do |image|
    slug = image["data-repository-slug"].to_s
    cover = covers[slug]
    unless cover.is_a?(Hash)
      errors << "#{label} references missing cover manifest entry #{slug.inspect}"
      next
    end

    expected_src = "#{baseurl}#{cover.fetch('path')}"
    errors << "#{label} cover #{slug} has an unexpected src" unless image["src"] == expected_src
    errors << "#{label} cover #{slug} should lazy-load" unless image["loading"] == "lazy"
    errors << "#{label} cover #{slug} should decode asynchronously" unless image["decoding"] == "async"
    errors << "#{label} cover #{slug} is missing meaningful alt text" if image["alt"].to_s.strip.empty?
    errors << "#{label} cover #{slug} width does not match the manifest" unless image["width"] == cover.fetch("width").to_s
    errors << "#{label} cover #{slug} height does not match the manifest" unless image["height"] == cover.fetch("height").to_s
  end
end

config = YAML.safe_load(root.join("_config.yml").read(encoding: "UTF-8"), aliases: false) || {}
site_url = config.fetch("url").to_s.sub(%r{/+\z}, "")
baseurl = config.fetch("baseurl", "").to_s.sub(%r{/+\z}, "")
canonical_origin = "#{site_url}#{baseurl}"

locales = YAML.safe_load(root.join("_data/locales.yml").read(encoding: "UTF-8"), aliases: false)
translation_routes = YAML.safe_load(root.join("_data/translation_routes.yml").read(encoding: "UTF-8"), aliases: false)
unless locales.is_a?(Array) && locales.length == 3
  errors << "_data/locales.yml must define exactly three locales"
  locales = []
end
unless translation_routes.is_a?(Hash)
  errors << "_data/translation_routes.yml must be an object"
  translation_routes = {}
end

locale_by_code = locales.to_h { |locale| [locale.fetch("code"), locale] }
expected_codes = %w[en zh-CN ja]
errors << "locale codes must be en, zh-CN, ja in that order" unless locales.map { |locale| locale["code"] } == expected_codes

canonical_routes = translation_routes.values.flat_map(&:values).uniq
duplicate_routes = translation_routes.values.flat_map(&:values).group_by(&:itself).select { |_route, values| values.length > 1 }.keys
errors << "translation routes contain duplicate canonical paths: #{duplicate_routes.sort.join(', ')}" unless duplicate_routes.empty?

translation_routes.each do |translation_key, routes|
  unless routes.is_a?(Hash) && routes.keys.sort == expected_codes.sort
    errors << "#{translation_key}: translation routes must define en, zh-CN, and ja"
    next
  end

  routes.each do |code, route|
    expected_prefix = locale_by_code.dig(code, "home").to_s.sub(%r{/\z}, "")
    if code == "en"
      errors << "#{translation_key}: English route cannot use /zh/ or /ja/" if route.start_with?("/zh/", "/ja/")
    elsif route != "#{expected_prefix}/" && !route.start_with?("#{expected_prefix}/")
      errors << "#{translation_key}: #{code} route must remain below #{expected_prefix}/"
    end
  end
end

canonical_routes.each do |route|
  path = output_path(destination, route)
  errors << "missing canonical route #{route} (#{path})" unless path.file? && path.size.positive?
end

project_routes = translation_routes.select { |key, _routes| root.join("_projects/#{key}.md").file? }
news_routes = translation_routes.select { |key, _routes| root.join("_news").glob("**/*.md").any? { |path| path.basename(".md").to_s == key } }
errors << "expected 17 translated project route groups, found #{project_routes.length}" unless project_routes.length == 17
errors << "expected 13 translated news route groups, found #{news_routes.length}" unless news_routes.length == 13

required_pdf_assets = {
  "assets/pdf/Weiping_Yan_CV_en.pdf" => "en",
  "assets/pdf/Weiping_Yan_CV_zh-CN.pdf" => "zh-CN",
  "assets/pdf/Weiping_Yan_CV_ja.pdf" => "ja",
  "assets/pdf/Weiping_Yan_CV.pdf" => "en",
  "resume.pdf" => "en",
  "zh/resume.pdf" => "zh-CN",
  "ja/resume.pdf" => "ja"
}

%w[404.html zh/404.html ja/404.html sitemap.xml robots.txt feed.xml].each do |relative|
  path = destination.join(relative)
  errors << "missing or empty required output /#{relative}" unless path.file? && path.size.positive?
end

required_pdf_assets.each_key do |relative|
  path = destination.join(relative)
  if !path.file? || !path.size.positive?
    errors << "missing or empty required PDF /#{relative}"
  elsif !path.binread(5).start_with?("%PDF-")
    errors << "/#{relative} does not have a PDF signature"
  end
end

canonical_pdf_by_locale = {
  "en" => "assets/pdf/Weiping_Yan_CV_en.pdf",
  "zh-CN" => "assets/pdf/Weiping_Yan_CV_zh-CN.pdf",
  "ja" => "assets/pdf/Weiping_Yan_CV_ja.pdf"
}
compatibility_pdf = destination.join("assets/pdf/Weiping_Yan_CV.pdf")
english_pdf = destination.join(canonical_pdf_by_locale.fetch("en"))
if compatibility_pdf.file? && english_pdf.file? && Digest::SHA256.file(compatibility_pdf).hexdigest != Digest::SHA256.file(english_pdf).hexdigest
  errors << "Weiping_Yan_CV.pdf must be an exact English compatibility copy"
end
required_pdf_assets.each do |relative, locale|
  next if relative.start_with?("assets/pdf/")

  alias_path = destination.join(relative)
  canonical_path = destination.join(canonical_pdf_by_locale.fetch(locale))
  next unless alias_path.file? && canonical_path.file?

  if Digest::SHA256.file(alias_path).hexdigest != Digest::SHA256.file(canonical_path).hexdigest
    errors << "/#{relative} does not match the #{locale} canonical PDF"
  end
end

catalog = JSON.parse(root.join("_data/repository_catalog.json").read(encoding: "UTF-8"))
repositories = catalog.fetch("repositories")
repository_covers = JSON.parse(root.join("_data/repository_covers.json").read(encoding: "UTF-8")).fetch("covers")
%w[en zh-CN ja].each do |code|
  route = translation_routes.dig("repository-catalog", code)
  next unless route

  path = output_path(destination, route)
  next unless path.file?

  html = path.read(encoding: "UTF-8")
  document = Nokogiri::HTML(html)
  repositories.each do |repository|
    slug = repository.fetch("slug")
    errors << "#{code} repository catalog is missing anchor ##{slug}" unless html.match?(/\bid=["']#{Regexp.escape(slug)}["']/)
  end

  catalog_cards = document.css("[data-catalog-repository-card]")
  if catalog_cards.length != repositories.length
    errors << "#{code} repository catalog should render #{repositories.length} repository cards, found #{catalog_cards.length}"
  end
  validate_repository_cover_images(
    document,
    "[data-catalog-repository-card] [data-repository-cover]",
    repositories,
    repository_covers,
    errors,
    "#{code} repository catalog",
    baseurl
  )

  repositories.each do |repository|
    slug = repository.fetch("slug")
    detail_route = translation_routes.dig(slug, code)
    next unless detail_route

    card = document.at_css(%([id="#{slug}"] [data-catalog-repository-card]))
    if card.nil?
      errors << "#{code} repository catalog is missing the detail-linked card for #{slug}"
      next
    end

    expected_href = "#{baseurl}#{detail_route}"
    title_href = card.at_css("h3 a")&.[]("href")
    details_href = card.at_css("a.btn-outline-primary")&.[]("href")
    errors << "#{code} repository catalog title for #{slug} should link to #{expected_href}" unless title_href == expected_href
    errors << "#{code} repository catalog detail button for #{slug} should link to #{expected_href}" unless details_href == expected_href
  end
end

portfolio_repositories, excluded_repositories = repositories.partition { |repository| repository.fetch("portfolio_project") }
%w[en zh-CN ja].each do |code|
  route = translation_routes.dig("projects", code)
  next unless route

  path = output_path(destination, route)
  next unless path.file?

  html = path.read(encoding: "UTF-8")
  document = Nokogiri::HTML(html)
  portfolio_repositories.each do |repository|
    slug = repository.fetch("slug")
    errors << "#{code} projects page is missing portfolio project ##{slug}" unless html.match?(/\bid=["']#{Regexp.escape(slug)}["']/)
  end
  excluded_repositories.each do |repository|
    slug = repository.fetch("slug")
    errors << "#{code} projects page includes excluded repository ##{slug}" if html.match?(/\bid=["']#{Regexp.escape(slug)}["']/)
  end

  project_cards = document.css("[data-portfolio-project-card]")
  if project_cards.length != portfolio_repositories.length
    errors << "#{code} projects page should render #{portfolio_repositories.length} portfolio grid cards, found #{project_cards.length}"
  end

  category_grids = document.css(".portfolio-projects .row.row-cols-1.row-cols-md-3")
  expected_category_grids = catalog.fetch("categories").count { |category| category.fetch("project_count").positive? }
  if category_grids.length != expected_category_grids
    errors << "#{code} projects page should render #{expected_category_grids} responsive three-column category grids, found #{category_grids.length}"
  end

  validate_repository_cover_images(
    document,
    "[data-portfolio-project-card] [data-repository-cover]",
    portfolio_repositories,
    repository_covers,
    errors,
    "#{code} projects page",
    baseurl
  )

  portfolio_repositories.each do |repository|
    slug = repository.fetch("slug")
    detail_route = translation_routes.dig(slug, code)
    next unless detail_route

    expected_href = "#{baseurl}#{detail_route}"
    card_href = document.at_css(%([id="#{slug}"] > a))&.[]("href")
    errors << "#{code} project card for #{slug} should link to #{expected_href}" unless card_href == expected_href
  end
end

legacy = JSON.parse(root.join("_data/legacy_repository_slugs.json").read(encoding: "UTF-8")).fetch("slugs")
legacy_prefixes = { "en" => "", "zh-CN" => "/zh", "ja" => "/ja" }
legacy_prefixes.each do |code, prefix|
  legacy.each do |slug|
    route = "#{prefix}/works/#{slug}/"
    errors << "missing #{code} legacy redirect #{route}" unless output_path(destination, route).file?
  end

  %w[research works resume resume/print contact cabinet].each do |path|
    route = "#{prefix}/#{path}/"
    errors << "missing #{code} legacy redirect #{route}" unless output_path(destination, route).file?
  end
  errors << "missing #{code} legacy redirect #{prefix}/resume.html" unless output_path(destination, "#{prefix}/resume.html").file?
end

html_files = destination.glob("**/*.html")
documents = {}
html_files.each do |path|
  document = parse_html(path, errors, destination)
  documents[path] = document if document
end

forbidden_identity = /Albert Einstein|You R\. Name|dummy@example\.com|alshedivat\.github\.io\/al-folio/i
forbidden_sensitive = /DS-160|passport number|recovery code|恢复码|パスポート番号/i
forbidden_research_branding = /AI\s+for\s+Science/i
documents.each do |path, document|
  relative = path.relative_path_from(destination)
  html = path.read(encoding: "UTF-8")
  errors << "forbidden template identity remains in #{relative}" if html.match?(forbidden_identity)
  errors << "sensitive-document terminology leaked into #{relative}" if html.match?(forbidden_sensitive)
  errors << "obsolete AI for Science branding remains in #{relative}" if html.match?(forbidden_research_branding)

  document.css('script[type="application/ld+json"]').each do |script|
    begin
      structured_data = JSON.parse(script.text)
      Array(structured_data).each do |record|
        next unless record.is_a?(Hash) && record.key?("sameAs")

        same_as = record["sameAs"]
        unless same_as.is_a?(Array) && same_as.all? { |value| value.is_a?(String) && value.match?(%r{\A(?:https://|mailto:)}i) }
          errors << "invalid JSON-LD sameAs entries in #{relative}"
        end
      end
    rescue JSON::ParserError => e
      errors << "invalid JSON-LD in #{relative}: #{e.message}"
    end
  end
end

canonical_documents = canonical_routes.filter_map do |route|
  path = output_path(destination, route)
  document = documents[path]
  [route, document] if document
end.to_h

pinned_repositories = YAML.safe_load(root.join("_data/repositories.yml").read(encoding: "UTF-8"), aliases: false).fetch("github_repos")
expected_pinned_links = pinned_repositories.map { |repository| "https://github.com/#{repository}" }.sort
pinned_catalog_repositories = pinned_repositories.filter_map do |repository_name|
  repositories.find { |repository| repository.fetch("repository") == repository_name }
end
unless pinned_catalog_repositories.length == pinned_repositories.length
  errors << "_data/repositories.yml contains pinned repositories missing from the public catalog"
end
expected_codes.each do |code|
  route = translation_routes.dig("repositories", code)
  document = canonical_documents[route]
  next unless document

  if document.to_html.include?("github-readme-stats")
    errors << "#{code} repositories page must not depend on github-readme-stats"
  end

  cards = document.css(".repositories .repo .card")
  errors << "#{code} repositories page should render 6 pinned cards, found #{cards.length}" unless cards.length == 6

  github_links = document.css('.repositories .repo a.btn[href^="https://github.com/"]').map { |element| element["href"] }
  errors << "#{code} repositories page should render 6 pinned GitHub links, found #{github_links.length}" unless github_links.length == 6
  unless github_links.sort == expected_pinned_links
    errors << "#{code} repositories page pinned GitHub links do not match _data/repositories.yml"
  end

  validate_repository_cover_images(
    document,
    ".repositories [data-pinned-repository-card] [data-repository-cover]",
    pinned_catalog_repositories,
    repository_covers,
    errors,
    "#{code} repositories page",
    baseurl
  )
end

canonical_hrefs = canonical_documents.values.flat_map { |document| document.css("[href]").map { |element| element["href"] } }.compact.to_set
research_interest_links = [
  "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:artificial_intelligence",
  "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:natural_language_processing",
  "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:microelectronics",
  "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:electronic_design_automation"
]
openreview_url = "https://openreview.net/forum?id=UV2UJ4VHf7"
honors_url = "https://educationguide.tue.nl/programs/honors-academy"
tudelft_hpb_url = "https://www.tudelft.nl/en/student/eemcs-student-portal/education/honours-programme"
umn_calendar_url = "https://asr.umn.edu/2026-27-twin-cities-and-rochester-calendar"
kaggle_certificate_url = "https://www.kaggle.com/certification/competitions/weipingyan/santa-2025"
merged_pull_request_urls = [
  "https://github.com/PowerGridModel/power-grid-model/pull/1516",
  "https://github.com/PowerGridModel/power-grid-model/pull/1518",
  "https://github.com/PowerGridModel/power-grid-model/pull/1540",
  "https://github.com/lenskit/lkpy/pull/1209",
  "https://github.com/mstar-project/mstar/pull/235",
  "https://github.com/pisa-engine/pisa/pull/641"
]
required_public_links = [
  "https://github.com/appleweiping",
  "https://www.linkedin.com/in/weiping-yan-b62567383",
  "https://scholar.google.com/citations?user=gK6JtzsAAAAJ",
  "https://x.com/VipinYan14431",
  "https://www.instagram.com/weipingappleapple",
  "mailto:yan00944@umn.edu",
  "mailto:vipinapple986@gmail.com",
  "https://doi.org/10.54254/2753-8818/8/20240361",
  openreview_url,
  honors_url,
  tudelft_hpb_url,
  umn_calendar_url,
  kaggle_certificate_url,
  *merged_pull_request_urls,
  "https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3",
  "https://github.com/median-research-group/LibMTL/pull/97",
  *research_interest_links,
  "/assets/pdf/Weiping_Yan_CV_en.pdf",
  "/assets/pdf/Weiping_Yan_CV_zh-CN.pdf",
  "/assets/pdf/Weiping_Yan_CV_ja.pdf"
]
required_public_links.each do |required_link|
  errors << "verified public link is missing from canonical pages: #{required_link}" unless canonical_hrefs.include?(required_link)
end

about_expectations = {
  "en" => ["I am now an Electrical Engineering and Computer Science student", "University of Minnesota College of Science and Engineering", "Fall 2026 classes started on September 8, 2026", "Minnesota NLP Group", "TU/e Honors Academy", "TU Delft Honours Programme Bachelor (HPB)", "in 2025–2026 before transferring"],
  "zh-CN" => ["我现为明尼苏达大学科学与工程学院电气工程与计算机科学本科生", "明尼苏达大学 2026 年秋季课程于 9 月 8 日开始", "Minnesota NLP Group", "TU/e Honors Academy", "TU Delft 荣誉学士项目（Honours Programme Bachelor，HPB）", "2025—2026 年、转学前参加了"],
  "ja" => ["現在はミネソタ大学 College of Science and Engineering で電気工学とコンピュータサイエンスを学ぶ学部生", "2026年秋学期の授業は9月8日に始まりました", "Minnesota NLP Group", "TU/e Honors Academy", "TU Delft Honours Programme Bachelor（HPB）", "2025–2026年、編入前に"]
}
outdated_about_claims = {
  "en" => ["incoming undergraduate", "I do not claim a specific University of Minnesota major", "No specific major"],
  "zh-CN" => ["即将入学", "不声称尚未确定的具体专业", "不注明尚未确认的具体专业"],
  "ja" => ["入学予定", "未確定の専攻", "特定の専攻が確定したとは記載せず"]
}
about_expectations.each do |code, phrases|
  route = translation_routes.dig("about", code)
  document = canonical_documents[route]
  next unless document

  text = document.text.gsub(/\s+/, " ")
  phrases.each do |phrase|
    errors << "#{code} home page is missing the verified fact #{phrase.inspect}" unless text.include?(phrase)
  end
  outdated_about_claims.fetch(code).each do |phrase|
    errors << "#{code} home page contains outdated or unwanted wording #{phrase.inspect}" if text.include?(phrase)
  end
  homepage_hrefs = document.css("[href]").map { |element| element["href"] }.compact.to_set
  research_interest_links.each do |link|
    errors << "#{code} home page is missing the research-interest link #{link}" unless homepage_hrefs.include?(link)
  end
  errors << "#{code} home page is missing the official TU Delft HPB link" unless homepage_hrefs.include?(tudelft_hpb_url)
  errors << "#{code} home page is missing the official UMN Fall 2026 calendar link" unless homepage_hrefs.include?(umn_calendar_url)
  errors << "#{code} home page is missing the selected OAM-GA manuscript" unless document.at_css("#wang2026oamga")
end

cv_text_expectations = {
  "en" => [
    "Electrical Engineering and Computer Science student",
    "Fall 2026 classes began September 8, 2026",
    "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
    "the decision is pending",
    "not yet accepted or published",
    "Selected Open-Source Contributions",
    "Six merged upstream pull requests",
    "Power Grid Model",
    "LensKit",
    "M*",
    "PISA",
    "TU Delft — Honours Programme Bachelor (HPB)",
    "participant (2025–2026; participation before transfer)"
  ],
  "zh-CN" => [
    "电气工程与计算机科学本科生",
    "2026 年秋季课程于 9 月 8 日开始",
    "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
    "录用决定尚未公布",
    "尚未录用或发表",
    "精选开源贡献",
    "6 个上游拉取请求被合并",
    "Power Grid Model",
    "LensKit",
    "M*",
    "PISA",
    "TU Delft 荣誉学士项目（Honours Programme Bachelor，HPB）",
    "参与者（2025—2026；转学前参与）"
  ],
  "ja" => [
    "電気工学・コンピュータサイエンスを学ぶ学部生",
    "2026年秋学期の授業は9月8日に開始",
    "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
    "採否は未決定",
    "未採択・未発表",
    "主なオープンソース貢献",
    "6件の上流プルリクエストがマージされました",
    "Power Grid Model",
    "LensKit",
    "M*",
    "PISA",
    "TU Delft Honours Programme Bachelor（HPB）",
    "参加（2025–2026年、編入前）"
  ]
}
outdated_cv_claims = {
  "en" => ["Incoming undergraduate", "No specific major", "completed degree is claimed"],
  "zh-CN" => ["即将入学", "不宣称尚未确定的具体专业", "不注明尚未确认的具体专业"],
  "ja" => ["入学予定", "未確定の専攻", "特定の専攻が確定したとは記載せず"]
}
expected_codes.each do |code|
  route = translation_routes.dig("cv", code)
  document = canonical_documents[route]
  next unless document

  cv_hrefs = document.css("[href]").map { |element| element["href"] }.compact.to_set
  research_interest_links.each do |link|
    errors << "#{code} CV page is missing the research-interest link #{link}" unless cv_hrefs.include?(link)
  end
  cv_text = document.text.gsub(/\s+/, " ")
  cv_text_expectations.fetch(code).each do |phrase|
    errors << "#{code} CV page is missing verified current content #{phrase.inspect}" unless cv_text.include?(phrase)
  end
  outdated_cv_claims.fetch(code).each do |phrase|
    errors << "#{code} CV page contains outdated or unwanted wording #{phrase.inspect}" if cv_text.include?(phrase)
  end
  errors << "#{code} CV page is missing the official TU/e Honors Academy link" unless cv_hrefs.include?(honors_url)
  errors << "#{code} CV page is missing the official TU Delft HPB link" unless cv_hrefs.include?(tudelft_hpb_url)
  [umn_calendar_url, openreview_url, kaggle_certificate_url, *merged_pull_request_urls].each do |link|
    errors << "#{code} CV page is missing the verified source link #{link}" unless cv_hrefs.include?(link)
  end
end

publication_expectations = {
  "en" => ["one formally published paper", "one manuscript submitted to DAI 2026", "decision pending", "not yet accepted or published", "randomly generated, synthetic data"],
  "zh-CN" => ["一篇正式发表的论文", "一篇已投稿至 DAI 2026", "录用决定尚未公布", "尚未录用或发表", "合成、随机生成的数据"],
  "ja" => ["正式に発表済みの論文1報", "DAI 2026へ投稿中の原稿1報", "採否は未決定", "未採択・未発表", "ランダムに生成した合成データ"]
}
publication_expectations.each do |code, phrases|
  route = translation_routes.dig("publications", code)
  document = canonical_documents[route]
  next unless document

  text = document.text.gsub(/\s+/, " ")
  phrases.each do |phrase|
    errors << "#{code} publications page is missing the research boundary #{phrase.inspect}" unless text.include?(phrase)
  end

  publication_entries = document.css(".publications ol.bibliography > li")
  errors << "#{code} publications page should render 2 entries, found #{publication_entries.length}" unless publication_entries.length == 2
  year_headings = document.css(".publications h2.bibliography").map { |heading| heading.text.strip }
  unless year_headings == ["2026", "2023"]
    errors << "#{code} publications page should order year groups as 2026 then 2023, found #{year_headings.inspect}"
  end

  oam_entry = document.at_css("#wang2026oamga")
  if oam_entry.nil?
    errors << "#{code} publications page is missing the OAM-GA submitted manuscript"
    next
  end

  oam_text = oam_entry.text.gsub(/\s+/, " ")
  oam_required_text = [
    "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
    "Xiang Wang",
    "Xu Yan",
    "Letian Pei",
    "Weiping Yan",
    "Submitted to DAI 2026",
    "under review",
    "decision pending",
    "not yet accepted or published"
  ]
  oam_required_text.each do |value|
    errors << "#{code} OAM-GA entry is missing #{value.inspect}" unless oam_text.include?(value)
  end

  oam_hrefs = oam_entry.css("a[href]").map { |element| element["href"] }.compact
  errors << "#{code} OAM-GA entry is missing its public OpenReview link" unless oam_hrefs.include?(openreview_url)
end

news_expectations = {
  "2026-01-31-kaggle-bronze" => {
    "links" => ["https://www.kaggle.com/competitions/santa-2025", kaggle_certificate_url],
    "phrases" => {
      "en" => ["official Kaggle Bronze Medal", "186th of 3,357 teams"],
      "zh-CN" => ["官方铜牌证书", "3,357 支队伍中排名第 186"],
      "ja" => ["公式の Bronze Medal 証明書", "3,357 チーム中 186 位"]
    }
  },
  "2026-09-08-umn-cse-start" => {
    "links" => ["https://cse.umn.edu/", umn_calendar_url],
    "phrases" => {
      "en" => ["I began my undergraduate studies in Electrical Engineering and Computer Science", "Fall 2026 classes began on September 8, 2026"],
      "zh-CN" => ["我开始在明尼苏达大学科学与工程学院修读电气工程与计算机科学本科课程"],
      "ja" => ["College of Science and Engineering で電気工学とコンピュータサイエンスの学部課程を開始しました"]
    },
    "forbidden_phrases" => {
      "en" => ["No specific major", "completed degree is claimed"],
      "zh-CN" => ["不注明尚未确认的具体专业", "不将该经历表述为已获得学位"],
      "ja" => ["特定の専攻が確定したとは記載せず", "学位取得済みとも表現していません"]
    }
  },
  "2026-09-08-oamga-revision" => {
    "links" => [openreview_url],
    "phrases" => {
      "en" => ["OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars", "remains under review, with a decision pending", "has not been accepted or published"],
      "zh-CN" => ["OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars", "仍处于投稿评审阶段", "决定尚未公布", "尚未被接收或正式发表"],
      "ja" => ["OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars", "現在も査読中で決定待ち", "採択または正式出版には至っていません"]
    }
  },
  "2026-09-08-upstream-merges" => {
    "links" => merged_pull_request_urls,
    "phrases" => {
      "en" => ["Six of my pull requests were merged upstream", "Power Grid Model #1516", "LensKit #1209", "M* #235", "PISA #641", "accepted changes"],
      "zh-CN" => ["我提交的六个拉取请求被上游项目合并", "Power Grid Model #1516", "LensKit #1209", "M* #235", "PISA #641", "这些已接收的改动"],
      "ja" => ["6 件のプルリクエストがアップストリームへマージされました", "Power Grid Model #1516", "LensKit #1209", "M* #235", "PISA #641", "採用された変更"]
    }
  }
}
news_expectations.each do |translation_key, expectation|
  expected_codes.each do |code|
    route = translation_routes.dig(translation_key, code)
    if route.nil?
      errors << "#{translation_key}: missing #{code} translation route"
      next
    end

    document = canonical_documents[route]
    next unless document

    news_text = document.text.gsub(/\s+/, " ")
    expectation.fetch("phrases").fetch(code).each do |phrase|
      errors << "#{code} news #{translation_key} is missing #{phrase.inspect}" unless news_text.include?(phrase)
    end
    expectation.fetch("forbidden_phrases", {}).fetch(code, []).each do |phrase|
      errors << "#{code} news #{translation_key} contains unwanted wording #{phrase.inspect}" if news_text.include?(phrase)
    end
    news_hrefs = document.css("[href]").map { |element| element["href"] }.compact.to_set
    expectation.fetch("links").each do |link|
      errors << "#{code} news #{translation_key} is missing verified source link #{link}" unless news_hrefs.include?(link)
    end
  end
end

translation_routes.each do |translation_key, routes|
  routes.each do |code, route|
    path = output_path(destination, route)
    next unless path.file?

    document = documents[path] || parse_html(path, errors, destination)
    next unless document

    locale = locale_by_code.fetch(code)
    expected_canonical = "#{canonical_origin}#{route}"
    actual_lang = document.at_css("html")&.[]("lang")
    errors << "#{route}: html lang should be #{code}, found #{actual_lang.inspect}" unless actual_lang == code

    canonical = document.at_css('link[rel="canonical"]')&.[]("href")
    errors << "#{route}: canonical should be #{expected_canonical}, found #{canonical.inspect}" unless canonical == expected_canonical
    og_url = document.at_css('meta[property="og:url"]')&.[]("content")
    errors << "#{route}: og:url should match canonical, found #{og_url.inspect}" unless og_url == expected_canonical
    og_locale = document.at_css('meta[property="og:locale"]')&.[]("content")
    errors << "#{route}: og:locale should be #{locale['og_locale']}, found #{og_locale.inspect}" unless og_locale == locale["og_locale"]

    alternates = document.css('link[rel="alternate"][hreflang]').to_h do |element|
      [element["hreflang"], element["href"]]
    end
    expected_alternates = routes.to_h do |alternate_code, alternate_route|
      hreflang = locale_by_code.fetch(alternate_code).fetch("hreflang")
      [hreflang, "#{canonical_origin}#{alternate_route}"]
    end
    expected_alternates["x-default"] = "#{canonical_origin}#{routes.fetch('en')}"
    errors << "#{route}: hreflang alternates are incomplete or non-reciprocal" unless alternates == expected_alternates

    {
      "Open Graph image" => document.at_css('meta[property="og:image"]')&.[]("content"),
      "Twitter image" => document.at_css('meta[name="twitter:image"]')&.[]("content")
    }.each do |label, value|
      errors << "#{route}: #{label} is not an absolute HTTPS URL: #{value.inspect}" unless https_url?(value)
    end

    language_links = document.css("[data-language-code][href]").to_h do |element|
      [element["data-language-code"], element["href"]]
    end
    unless language_links.empty?
      expected_links = routes.transform_values { |target| "#{baseurl}#{target}" }
      errors << "#{route}: language-switch links do not match the translation group" unless language_links == expected_links
    end
  end
end

%w[sitemap.xml robots.txt feed.xml].each do |relative|
  path = destination.join(relative)
  next unless path.file?

  content = path.read(encoding: "UTF-8")
  errors << "#{relative} contains an /al-folio deployment path" if content.include?("/al-folio")
  errors << "#{relative} does not use canonical origin #{canonical_origin}" unless content.include?(canonical_origin)
end

if destination.join("sitemap.xml").file?
  sitemap = destination.join("sitemap.xml").read(encoding: "UTF-8")
  translation_routes.each do |translation_key, routes|
    next if translation_key == "404"

    routes.each_value do |route|
      url = "#{canonical_origin}#{route}"
      errors << "sitemap.xml is missing #{url}" unless sitemap.include?(url)
    end
  end
end

site_files = destination.glob("**/*").select(&:file?).map { |path| path.relative_path_from(destination).to_s.tr("\\", "/") }.to_set
documents.each do |path, document|
  relative = path.relative_path_from(destination)
  references = document.css("[href], [src]").flat_map { |element| [element["href"], element["src"]].compact }
  document.css("[srcset]").each do |element|
    references.concat(element["srcset"].to_s.split(",").map { |candidate| candidate.strip.split(/\s+/, 2).first })
  end

  references.each do |reference|
    next if reference.to_s.empty? || reference.start_with?("#", "mailto:", "tel:", "javascript:", "data:")

    uri = URI.parse(reference)
    next if uri.scheme || uri.host

    raw_path = URI::DEFAULT_PARSER.unescape(uri.path.to_s)
    next if raw_path.empty?
    raw_path = "." if raw_path == "."

    resolved = if raw_path.start_with?("/")
                 normalized = baseurl.empty? ? raw_path : raw_path.delete_prefix(baseurl)
                 normalized.delete_prefix("/")
               else
                 relative.dirname.join(raw_path).cleanpath.to_s
               end
    resolved = "index.html" if resolved.empty?
    resolved = relative.dirname.to_s if raw_path == "."
    candidates = [resolved]
    candidates << File.join(resolved, "index.html") if raw_path == "." || raw_path.end_with?("/")
    candidates << "#{resolved}.html" if File.extname(resolved).empty?
    unless candidates.any? { |candidate| site_files.include?(candidate.tr("\\", "/")) }
      errors << "broken internal reference #{reference.inspect} in #{relative}"
    end
  rescue URI::InvalidURIError
    errors << "invalid URI #{reference.inspect} in #{relative}"
  end
end

responsive_references = documents.values.flat_map do |document|
  document.css("[srcset]").flat_map do |element|
    element["srcset"].to_s.split(",").map { |candidate| candidate.strip.split(/\s+/, 2).first }
  end
end.select { |reference| reference.end_with?(".webp") }.uniq
errors << "no responsive WebP srcset references were rendered" if responsive_references.empty?

errors.uniq!
if errors.empty?
  puts(
    "Production site is valid: #{canonical_routes.length} canonical routes, " \
    "#{project_routes.length} project groups, #{news_routes.length} news groups, " \
    "#{repositories.length} repositories, #{catalog.fetch('project_count')} portfolio projects, " \
    "and #{legacy.length} legacy slugs."
  )
else
  warn "Production site validation failed with #{errors.length} error(s):"
  errors.each { |error| warn "- #{error}" }
  exit 1
end
