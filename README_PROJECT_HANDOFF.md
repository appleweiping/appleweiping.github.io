# 项目交接说明

## 项目概况

这个仓库当前承载的是 Weiping Yan 的个人学术网站，已经整理为一个轻量、可直接部署到 GitHub Pages 的静态站点。

当前版本只保留两个主页面：

- `Profile`
- `Resume`

设计重点不是“炫技动画”，而是通过排版、留白、阅读节奏和少量轻交互来建立更清晰的学术表达。

## 当前版本的设计目标

网站现在主要用于清楚传达以下信息：

- 你是谁
- 你在学什么
- 你的研究方向是什么
- 你最近做过哪些相关经历
- 别人如何联系你
- 如何查看和下载正式简历

它不是传统意义上的开发者作品集，也不是动画展示页。

## 当前技术方案

当前线上版本使用的是：

- `index.html`：个人主页
- `resume.html`：简历页
- `style.css`：视觉系统与响应式布局
- `script.js`：轻量交互逻辑
- `assets/profile.jpg`：头像
- `assets/resume.pdf`：正式简历 PDF

特点：

- 无需构建工具
- 无需 Node
- 可直接部署到 GitHub Pages
- 维护成本低

## 当前页面结构

### 1. Profile 页

包含以下内容：

- 顶部导航
- Hero 区域
- 头像与身份摘要
- About
- Research directions
- Selected experience
- Contact

### 2. Resume 页

包含以下内容：

- 页面导语
- 结构化摘要
- 联系方式与 PDF 入口
- 内嵌 PDF 浏览区

## 当前交互说明

当前版本只保留了非常轻的交互：

- 滚动出现动画
- Hero 区域跟随指针的微弱光感偏移
- 一条 SVG 导向线，用来串联首页各段内容
- 根据滚动位置高亮当前阅读段落
- 一个非常克制的微光 spirit companion，会在桌面端以明显迟滞轻轻跟随鼠标

这些交互的目标是帮助阅读，而不是制造负担。

## 文件结构

```text
.
|-- index.html
|-- resume.html
|-- style.css
|-- script.js
|-- assets/
|   |-- profile.jpg
|   `-- resume.pdf
|-- server.py
|-- README.md
|-- README_ENGLISH.md
|-- README_PROJECT_HANDOFF.md
|-- ARCHITECTURE.md
|-- IMPLEMENTATION_SUMMARY.md
|-- OPTIMIZATION_SUMMARY.md
`-- src/
```

## 后续修改位置

### 修改首页文案

编辑：

- `index.html`

### 修改简历页摘要

编辑：

- `resume.html`

### 修改样式

编辑：

- `style.css`

### 修改交互

编辑：

- `script.js`

### 更换头像

替换：

- `assets/profile.jpg`

建议使用竖版比例较好的照片。

### 更换简历 PDF

替换：

- `assets/resume.pdf`

只要文件名不变，页面里的链接和内嵌查看器就不需要额外修改。

## 本地预览

可使用以下任一方式：

```bash
python server.py
```

或：

```bash
python -m http.server 8000
```

然后访问：

- `http://localhost:8000`

## 部署方式

当前项目通过 GitHub Pages 从 `main` 分支部署。

常规更新流程：

```bash
git add .
git commit -m "..."
git push origin main
```

通常几分钟内即可在线上生效。

## 需要特别说明的点

- 当前线上站点不依赖 `src/` 目录中的旧实验代码。
- `src/` 中保留的是之前版本的探索性实现，可视为历史遗留参考代码。
- 如果未来想继续简化仓库，可以单独做一轮“旧代码归档或清理”。

## 建议的后续优化方向

- 继续压缩首页文案，让申请研究机会时的表达更精准
- 在真实手机设备上再微调一次间距与字号
- 为站点补一个 favicon 和社交分享图
- 如果确定不再使用旧实验代码，可清理 `src/` 目录
