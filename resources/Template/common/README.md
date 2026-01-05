# Template Common 共用模板

这是 Template 文件夹内部的共用模板，用于提供所有模板共享的基础样式和布局。

## 文件说明

### common.css
包含所有模板共用的样式：
- 字体定义（ProjectD 字体）
- 基础重置样式（margin, padding, box-sizing 等）
- 兼容旧类名（.font-YS, .font-NZBZ）
- 默认字体设置

### common.html
基础布局模板，提供：
- 完整的 HTML5 结构
- 基础 meta 标签
- common.css 的自动引入
- 支持 `{{block 'css'}}` 和 `{{block 'main'}}` 扩展

## 使用方法

### 方法1：仅引用 common.css（推荐）

在模板的 HTML 文件中，在引入自己的 CSS 之前先引入 common.css：

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" href="#" />
  <link rel="stylesheet" type="text/css" href="{{_res_path}}Template/common/common.css"/>
  <link rel="stylesheet" type="text/css" href="{{_res_path}}Template/yourTemplate/yourTemplate.css"/>
  <title>delta-force-plugin</title>
</head>
<body>
  <!-- 你的内容 -->
</body>
</html>
```

### 方法2：继承 common.html 布局

如果模板需要继承基础布局，可以使用：

```html
{{extend "Template/common/common.html"}}

{{block 'css'}}
<link rel="stylesheet" type="text/css" href="{{_res_path}}Template/yourTemplate/yourTemplate.css"/>
{{/block}}

{{block 'main'}}
  <!-- 你的内容 -->
{{/block}}
```

## 优势

1. **统一管理**：字体定义和基础样式集中管理，便于维护
2. **减少重复**：避免在每个模板中重复定义字体和基础样式
3. **独立性强**：Template 文件夹内部自包含，不依赖外部 common 文件夹
4. **灵活使用**：可以选择仅引用 CSS 或继承完整布局
