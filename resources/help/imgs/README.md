# 帮助页面主题配置目录

## 目录结构

```
imgs/
├── default/              # 默认主题（必须存在）
│   ├── config.yaml       # 主题样式配置文件
│   ├── bg.jpg            # 背景图片
│   └── icon.png          # 图标精灵图
│
└── style/                 # 主题（示例）
    ├── config.yaml
    ├── bg.jpg
    └── icon.png

```

## 如何创建新主题

### 步骤1：创建主题目录

```bash
mkdir -p resources/help/imgs/mytheme
```

### 步骤2：创建配置文件

创建 `mytheme/config.yaml`：

```yaml
# 主题样式配置
fontColor: '#ffffff'
fontFamily: 'Arial, sans-serif'
titleFontSize: '48px'
groupFontSize: '20px'
commandFontSize: '17px'
descFontSize: '14px'
tableFontSize: '15px'
contBgColor: 'rgba(0, 0, 0, .5)'
contBgBlur: 5
headerBgColor: 'rgba(0, 0, 0, .6)'
rowBgColor1: 'rgba(0, 0, 0, .3)'
rowBgColor2: 'rgba(0, 0, 0, .4)'
```

### 步骤3：添加资源文件

- `bg.jpg` - 背景图片（建议尺寸：根据实际需求）
- `icon.png` - 图标精灵图（如果需要不同的图标）

### 步骤4：在配置中使用主题

在 `config/help.yaml` 中指定主题：

```yaml
helpCfg:
  themeName: "mytheme"  # 使用 mytheme 主题
  # ... 其他配置
```

如果不指定 `themeName`，将使用 `default` 主题。

## 配置文件说明

### config.yaml 配置项

所有配置项都是可选的，未配置的项将使用默认值：

- **fontColor**: 主文字颜色（CSS颜色值）
- **fontShadow**: 文字阴影（CSS shadow值或 'none'）
- **descColor**: 描述文字颜色
- **fontFamily**: 字体族（CSS font-family值）
- **titleFontSize**: 主标题字体大小
- **groupFontSize**: 组标题字体大小
- **commandFontSize**: 命令标题字体大小
- **descFontSize**: 描述文字字体大小
- **tableFontSize**: 表格单元格字体大小
- **contBgColor**: 面板整体底色（rgba值）
- **contBgBlur**: 毛玻璃效果强度（0-10）
- **headerBgColor**: 板块标题栏底色
- **rowBgColor1**: 奇数行底色
- **rowBgColor2**: 偶数行底色

## 热重载支持

修改主题的 `config.yaml` 文件后，样式会自动重新加载，无需重启插件。

## 注意事项

1. **default 主题是必需的**：如果指定的主题不存在，将自动回退到 default 主题
2. **资源文件路径**：模板中使用 `{{themePath}}` 变量来引用主题资源
3. **配置文件格式**：必须使用 YAML 格式，注意缩进和语法
4. **资源文件命名**：建议保持文件名一致（bg.jpg, icon.png），便于管理

