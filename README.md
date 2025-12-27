![delta-force-plugin](https://socialify.git.ci/dnyo666/delta-force-plugin/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)

<img decoding="async" align=right src="resources/imgs/readme/hz.png" width="35%">

# Delta-Force-Plugin

- 一个适用于 [Yunzai 系列机器人框架](https://github.com/yhArcadia/Yunzai-Bot-plugins-index) 的三角洲行动游戏数据查询和娱乐功能插件

- 支持QQ/微信扫码登录或Token手动绑定，支持查询个人信息、日报、周报、战绩等游戏数据

- **使用中遇到问题请加QQ群咨询：932459332**

> [!TIP]
> 三角洲行动是一款由腾讯琳琅天上工作室开发的FPS游戏，本插件旨在帮助玩家更方便地查询游戏数据，提升游戏体验。支持烽火地带和全面战场两种模式的数据查询。

> [!TIP]
>  插件当前处于正式运营阶段，欢迎加入[932459332](https://qm.qq.com/q/CrYiAQxJPW)交流反馈，同时也欢迎各位提交ISSUE

> [!TIP]
>  插件采用统一后端处理，使用插件请前往管理页面进行注册登陆并获取apikey，如果需要部分功能，可选择订阅专业版（4.5元/月），费用仅供服务器维护

## 安装插件

### 1. 克隆仓库

#### Github

```
git clone https://github.com/dnyo666/delta-force-plugin.git ./plugins/delta-force-plugin
```

#### Gitee

```
git clone https://gitee.com/Dnyo666/delta-force-plugin.git ./plugins/delta-force-plugin
```

### 2. 安装依赖

```
pnpm install --filter=delta-force-plugin
```

## 插件配置

> [!WARNING]
> 非常不建议手动修改配置文件，本插件已兼容 [Guoba-plugin](https://github.com/guoba-yunzai/guoba-plugin) ，请使用锅巴插件对配置项进行修改
> 
> 配置项说明：
> - `api_key`: API密钥，在[管理页面](https://df.shallow.ink/api-keys)创建
> - `clientID`: 客户端ID，在[管理页面](https://df.shallow.ink/)的个人信息获取（用户id）

## 功能列表

请使用 `#三角洲帮助` 或 `^帮助` 获取完整帮助

### 个人类功能

- [x] QQ/微信扫码登录
- [x] QQ/微信授权登陆（网页登陆）
- [x] QQ/微信令牌手动刷新（QQ需要使用二维码登陆）
- [x] QQ/微信-wegame登陆
- [x] QQCK登陆
- [x] Token绑定与切换
- [x] 角色绑定
- [x] 个人信息查询
- [x] 日报/周报数据
- [x] 战绩查询
- [x] 战绩推送
- [x] 藏品/资产查询
- [x] 货币信息查询
- [x] 封号记录查询
- [ ] wegame每日领奖
- [ ] wegame高校排名
- [ ] wegame战区排名
- [ ] wegame个人排名
- [ ] wegame战绩列表&详情
- [ ] wegame获取30日数据
- [ ] wegame获取地图表现
- [x] 特勤处状态
- [x] 特勤处制造完成推送
- [x] 大红收藏海报
- [x] 大红收藏记录列表
- [x] 日报/周报订阅推送
- [ ] 小黑屋预测
- [x] AI锐评战绩（已支持烽火地带）

### 工具类功能

- [x] 开黑房间创建与管理
- [x] 每日密码查询
- [x] 官方文章&公告
- [ ] 官方改枪码
- [x] 社区改枪码
- [ ] CS榜（支持提交、查看、申述）
- [ ] 官方比赛排名
- [ ] 各种信息查询（干员、健康状态、特勤处）
- [x] 物品查询搜索
- [x] 物品价格历史
- [x] 特勤处利润（当前和最佳）
- [x] 特勤处制造材料价格
- [x] 每日密码定时推送
- [x] 三角洲计算器（伤害、维修计算）
- [ ] 赛季任务系统
- [ ] 部门任务系统
- [ ] 战备值获取
- [ ] 卡战备

### 娱乐类功能

- [ ] 摸金模拟器
- [ ] 每日幸运道具
- [ ] 对局模拟器
- [x] 随机音频
- [x] 鼠鼠音乐（来自Liusy）
- [ ] 随机表情包
- [ ] 随机挑战

## 命令示例

<details><summary>点击展开</summary>

| 命令             | 功能                       | 示例                                                     |
| ---------------- | -------------------------- | -------------------------------------------------------- |
| #三角洲登录      | QQ/微信扫码登录            | 提供二维码登录并绑定账号                                 |
| #三角洲角色绑定  | 绑定游戏内角色             | 绑定游戏角色，获取详细游戏数据                           |
| #三角洲信息      | 查询账号基本信息           | 显示昵称、等级、UID、资产等账号详情                      |
| #三角洲日报      | 查询当日游戏数据           | 显示当天烽火地带/全面战场的游戏数据                      |
| #三角洲周报      | 查询本周游戏数据汇总       | 显示本周游戏数据汇总，包含队友协作数据                   |
| #三角洲战绩      | 查询游戏战绩               | 可查询烽火地带/全面战场的历史战绩                        |
| #三角洲藏品      | 查询个人藏品资产           | 显示角色所有非货币类藏品资产                             |
| #三角洲账号      | 账号管理                   | 查看已绑定账号列表、切换账号等                           |
| #三角洲账号切换  | 切换当前激活的账号         | 在多个绑定账号间进行切换                                 |
| ^登录            | 简写形式登录命令           | 与#三角洲登录功能相同                                    |
| ^战绩 烽火 2     | 简写形式战绩查询           | 查询烽火地带模式第2页战绩                                |
| ^周报 全面       | 简写形式周报查询           | 查询全面战场模式的周报                                   |

</details>

## 鸣谢

- **API支持**：感谢[浅巷墨黎](https://github.com/dnyo666)整理并提供的三角洲行动API接口文档及后端
- **API功能参考**：
  - [deltaforce-酷曦科技](https://github.com/coolxitech/deltaforce) 参考QQ、微信等登陆部分
- **代码贡献**：
  - [@浅巷墨黎（Dnyo666）](https://github.com/dnyo666)：项目主要开发者
  - [@MapleLeaf](https://github.com/MapleLeaf2007)：后端基础架构开发
  - [@Admilk](https://github.com/Admilkk)：后端基础架构开发
- **特别鸣谢**：
  - [鸣潮插件(waves-plugin)](https://github.com/erzaozi/waves-plugin) 本插件基于此插件进行开发，同时参考此插件部分架构和逻辑
  - [Yunzai-Bot](https://github.com/yoimiya-kokomi/Miao-Yunzai)：Miao-Yunzai机器人框架
  - [三角洲行动官方](https://df.qq.com)：感谢官方的数据（）
  - [白狼安雅](https://www.pixiv.net/users/22723243)：授权提供readme中的麦晓雯Q版图
  - [繁星攻略组](https://space.bilibili.com/3546853731731919)：授权提供计算器算法和数据

## 其他框架

- **云崽**：[delta-force-plugin](https://github.com/Dnyo666/delta-force-plugin)
- **Nonebot2**：[nonebot-plugin-delta-force](https://github.com/Entropy-Increase-Team/nonebot-plugin-delta-force)
- **Koishi**：[koishi-plugin-delta-force](https://github.com/Entropy-Increase-Team/koishi-plugin-delta-force)
- **Karin**: [karin-plugin-delta-force](https://github.com/Entropy-Increase-Team/karin-plugin-delta-force)


## 支持与贡献

如果你喜欢这个项目，请不妨点个 Star🌟，这是对开发者最大的动力。

有意见或者建议也欢迎提交 [Issues](https://github.com/dnyo666/delta-force-plugin/issues) 和 [Pull requests](https://github.com/dnyo666/delta-force-plugin/pulls)。

## 许可证

本项目使用 [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。

