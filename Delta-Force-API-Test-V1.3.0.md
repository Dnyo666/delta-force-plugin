# Delta Force API 业务测试文档

## 概述

Delta Force API 是一个基于 Koa 框架的游戏数据查询和管理系统，提供物品信息、价格历史、制造场所利润分析等功能。

**该接口由浅巷墨黎、Admilk、mapleleaf开发，任何数据请以三角洲行动官方为准，版权归属腾讯有限公司，该接口仅供技术学习使用**

**对于接口任何返回数据中不懂的部分，请看https://df-api.apifox.cn，该接口文档由浅巷墨黎整理**

**本次测试不做任何数据保留，截止日期：2025-07-15**

## 基础信息

- **测试前端**: `https://df.cduestc.fun`（包含文档）
- **测试后端**: `https://df-api.cduestc.fun`
- **认证方式**: 注册后登陆即可使用，如需测试房间和用户绑定测试，请联系开发者进行手动邮箱验证

## 登录接口

### QQ 扫码登录

#### 1. 获取二维码
```http
GET /login/qq/qr
```

**响应示例:**
```json
{
  "code": 0,
  "msg": "ok",
  "token": "frameworkToken",
  "qr_image": "data:image/png;base64,...",
  "expire": 1703123456789
}
```

#### 2. 轮询扫码状态
```http
GET /login/qq/status?token=frameworkToken
```

**状态码说明:**
- `1`: 等待扫描
- `2`: 已扫码
- `3`: 扫码成功
- `-2`: 二维码超时
- `-3`: 扫码被拒绝

#### 3. 查看token状态
```http
GET /login/qq/token?token=frameworkToken
```

### QQ CK 登录

#### 1. CK 登录
```http
GET /login/qq/ck
```

#### 2. 轮询CK状态
```http
GET /login/qq/ck/status
```

#### 3. 查看CK token状态
```http
GET /login/qq/ck/token
```

### QQ 安全登录

#### 1. 获取安全登录二维码
```http
GET /login/qqsafe/qr
```

#### 2. 轮询安全登录状态
```http
GET /login/qqsafe/status
```

#### 3. 查看安全登录token状态
```http
GET /login/qqsafe/token
```

#### 4. 安全登录封禁检查
```http
GET /login/qqsafe/ban
```

### 微信扫码登录

#### 1. 获取二维码
```http
GET /login/wechat/qr
```

#### 2. 轮询扫码状态
```http
GET /login/wechat/status?token=frameworkToken
```

#### 3. 查看token状态
```http
GET /login/wechat/token?token=frameworkToken
```

#### 4. 手动刷新登陆状态（其实每3小时会自动检测一次）
```http
GET /login/wechat/refresh?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：登陆获取到的框架token

### WeGame 登录

#### 1. 获取WeGame二维码
```http
GET /login/wegame/qr
```

#### 2. 轮询WeGame扫码状态
```http
GET /login/wegame/status
```

#### 3. 查看WeGame token状态
```http
GET /login/wegame/token
```

#### 4. 获取WeGame礼品
```http
GET /df/wegame/gift
```

### WeGame 微信登录

#### 1. 获取WeGame微信二维码
```http
GET /login/wegame/wechat/qr
```

#### 2. 轮询WeGame微信扫码状态
```http
GET /login/wegame/wechat/status
```

#### 3. 查看WeGame微信token状态
```http
GET /login/wegame/wechat/token
```

#### 4. 获取WeGame微信礼品
```http
GET /df/wegame/wechat/gift
```

## 用户管理接口

### 绑定用户
```http
POST /user/bind
```
**参数 (body/json)**：
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- clientID：客户端ID（必填）
- clientType：客户端类型（必填）

### 解绑用户
```http
POST /user/unbind
```
**参数 (body/json)**：
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- clientID：客户端ID（必填）
- clientType：客户端类型（必填）

### 用户绑定列表
```http
GET /user/list
```
**参数说明**
- frameworkToken：框架Token（必填）
- clientID：客户端ID（必填）
- clientType：客户端类型（必填）

### 角色绑定接口
```http
GET /df/person/bind?method=query&frameworkToken=xxxxx-xxxxx
```
**参数说明**
- `frameworkTOken`：框架token，区分个人
- `method`：分为query和bind，（前者用于查询是否绑定角色，后者直接绑定角色）

## 物品信息接口

### 1. 获取物品列表
```http
GET /df/object/list?primary=props&second=consume
```

**参数说明:**
- `primary`: 一级分类 (可选)
- `second`: 二级分类 (可选)

### 2. 搜索物品
```http
GET /df/object/search?name=非洲
```

```http
GET /df/object/search?id=14060000003
```

**参数说明:**
- `name`: 物品名称 (模糊搜索)
- `id`: 物品ID (支持单个ID或逗号分隔的多个ID)（示例：14060000003；14060000003,14060000004；[14060000003,14060000004]）

### 健康状态信息
```http
GET /df/object/health
```

### 干员信息
```http
GET /df/object/operator
```

### 地图列表
```http
GET /df/object/maps
```

### 干员列表（新版）
```http
GET /df/object/operator2
```

### 段位分数对照表
```http
GET /df/object/rankscore
```

## 功能接口

### 每日密码
```http
GET /df/tools/dailykeyword
```

### 文章列表
```http
GET&POST /df/tools/article/list
```

### 文章详情
```http
GET /df/tools/article/detail?threadId=18435
```
**参数说明**
- `threadId`：由列表里获取的文章ID

### 主播巅峰赛排名
```http
GET /df/tools/race1/list?match=solo&type=kill
```
**参数说明**
- `match`：有solo和team两种（必选）（对应单人赛和组队赛）
- `type`：当match为solo时，分为kill和score（match=solo时必选）（对应击杀榜和总得分榜）

### 主播巅峰赛搜索
```http
GET /df/tools/race1/search?match=team&key=林
```
**参数说明**
- `match`：有solo和team两种（必选）（对应单人赛和组队赛）
- `type`：当match为solo时，分为kill和score（match=solo时必选）（对应击杀榜和总得分榜）（搜索时无所谓，但是得加）
- `key`：搜素词（必选）

### 改枪码列表（V1）
```http
GET /df/tools/solution/list
```

### 改枪码详细（V1）
```http
GET /df/tools/solution/detail?id=10576
```
**参数说明**
- `id`；改枪码ID

## 改枪方案 V2 接口

### 上传改枪方案
```http
POST /df/tools/solution/v2/upload
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionCode：改枪码（必填，格式：武器名-配件-编码）
- weaponId：武器ID（可选，用于精确匹配武器）
- Accessory：配件数组或JSON字符串（可选，格式：[{slotId: "xxx", objectID: 123}]）
- desc：描述（可选，不超过30字符）
- isPublic：是否公开（true/false，可选，默认false）
- type：游戏模式（sol/mp，可选，默认sol）

**功能说明**：上传新的改枪方案，支持配件信息和游戏模式设置。有频率限制：每10分钟最多5次提交/更新操作。

### 获取方案列表
```http
GET /df/tools/solution/v2/list
```
**参数说明（query）**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）  
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- weaponId：武器ID筛选（可选）
- weaponName：武器名称筛选（可选，模糊匹配）
- priceRange：价格范围筛选（可选，格式："最小值,最大值"）
- authorPlatformID：按作者筛选（可选）
- type：游戏模式筛选（sol/mp，可选）

**功能说明**：获取已过审的改枪方案列表，支持多种筛选条件。非公开方案只对作者本人可见。

### 获取方案详情
```http
GET /df/tools/solution/v2/detail
```
**参数说明（query）**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）

**功能说明**：获取指定方案的详细信息，包括武器、配件、价格等。有频率限制：每10分钟最多2次查看操作。

### 投票
```http
POST /df/tools/solution/v2/vote
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）
- voteType：投票类型（like/dislike，必填）

**功能说明**：对方案进行点赞或点踩。支持取消投票和切换投票类型。有频率限制防止刷票。

### 更新方案
```http
POST /df/tools/solution/v2/update
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）
- solutionCode：新的改枪码（可选）
- Accessory：新的配件数组（可选）
- desc：新的描述（可选，不超过30字符）
- isPublic：是否公开（true/false，可选）
- type：游戏模式（sol/mp，可选）

**功能说明**：更新已有方案，只有作者本人可以操作。更新描述后需重新审核。有频率限制：每10分钟最多5次提交/更新操作。

### 删除方案
```http
POST /df/tools/solution/v2/delete
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）

**功能说明**：删除指定方案，只有作者本人可以操作。删除后无法恢复。

### 收藏方案
```http
POST /df/tools/solution/v2/collect
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）

**功能说明**：将方案添加到个人收藏列表。重复收藏会提示已收藏。

### 取消收藏
```http
POST /df/tools/solution/v2/discollect
```
**参数 (body/json)**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）
- solutionId：方案ID（必填）

**功能说明**：从个人收藏列表中移除指定方案。

### 收藏列表
```http
GET /df/tools/solution/v2/collectlist
```
**参数说明（query）**：
- clientID：用户clientID（必填）
- clientType：客户端类型（必填）
- platformID：平台用户ID（必填）
- frameworkToken：框架Token（必填）

**功能说明**：获取当前用户的收藏方案列表，包含完整的方案信息和价格数据。

### 重要说明
1. **身份验证**：所有接口都需要完整的用户身份验证（clientID、clientType、platformID、frameworkToken）
2. **频率限制**：
   - 提交/更新操作：每10分钟最多5次
   - 查看详情：每10分钟最多2次  
   - 投票操作：每10分钟最多5次（按方案分别计算）
3. **审核机制**：新上传的方案默认为待审核状态，只有通过审核的方案才会在列表中显示
4. **隐私保护**：非公开方案的作者信息会显示为"匿名用户"
5. **权限控制**：只有方案作者本人可以更新或删除自己的方案

## 房间相关接口

### 1. 创建房间
```http
POST /df/tools/Room/creat
```
**参数（body/json）**：
- frameworkToken：用户身份token（必填）
- type：房间类型（sol 或 mp）（必填）
- tag：房间标签id（可选）
- password：房间密码（可选）
- clientID：用户clientID（必填）
- onlyCurrentlyClient：是否仅限同clientID用户加入（可选，默认false）
- mapid：地图id（可选，默认0）

**返回示例：**
```json
{
  "code": 0,
  "msg": "房间创建成功",
  "data": { "roomId": "12345678" }
}
```

### 2. 加入房间
```http
POST /df/tools/Room/join
```
**参数（body/json）**：
- frameworkToken：用户身份token（必填）
- password：房间密码（可选）
- clientID：用户clientID（必填）
- roomId：房间id（必填）

**返回示例：**
```json
{
  "code": 0,
  "msg": "加入房间成功",
  "data": { "roomId": "12345678" }
}
```

### 3. 房间列表
```http
GET /df/tools/Room/list
```
**参数（query）**：
- clientID：用户clientID（必选）（如果房间不是本clientID创建且开启仅同clientID加入，那么不展示）
- type：房间类型（可选）
- hasPassword：是否筛选有密码房间（可选）

**返回示例：**
```json
{
  "code": 0,
  "msg": "ok",
  "data": [
    {
      "roomId": "12345678",
      "tag": "10001",
      "tagText": "大神带飞",
      "ownerNickname": "房主昵称",
      "ownerAvatar": "头像url",
      "type": "sol",
      "hasPassword": false,
      "mapid": "2231",
      "currentMemberCount": 2,
      "maxMemberCount": 3
    }
  ]
}
```

### 4. 房间信息
```http
GET /df/tools/Room/info?frameworkToken=xxx&clientID=xxx&roomId=xxx
```
**参数（query/body均可）**：
- frameworkToken：用户身份token（必填）
- clientID：用户clientID（必填）

**返回示例：**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "roomId": "12345678",
    "tag": "10001",
    "type": "sol",
    "members": [
      { "nickname": "A", "avatar": "", "uid": "" },
      { "nickname": "B", "avatar": "", "uid": "" }
    ],
    "mapid": "2231",
    "currentMemberCount": 2,
    "maxMemberCount": 3
  }
}
```
**注意：只有房间内成员可查看房间信息，否则返回无权限**

### 5. 退出房间
```http
POST /df/tools/Room/quit
```
**参数（body/json）**：
- frameworkToken：用户身份token（必填）
- clientID：用户clientID（必填）
- roomId：房间id（必填）

**返回示例：**
```json
{ "code": 0, "msg": "已退出房间" }
```

### 6. 踢人
```http
POST /df/tools/Room/kick
```
**参数（body/json）**：
- frameworkToken：房主token（必填）
- clientID：房主clientID（必填）
- roomId：房间id（必填）
- targetFrameworkToken：要踢出的成员token（必填）

**返回示例：**
```json
{ "code": 0, "msg": "已踢出成员" }
```

### 7. 房间标签
```http
GET /df/tools/Room/tags
```
**返回：**
```json
{ "code": 0, "msg": "ok", "data": [ { "id": "10001", "name": "大神带飞" }, ... ] }
```

### 8. 地图列表
```http
GET /df/tools/Room/maps
```
**返回：**
```json
{ "code": 0, "msg": "ok", "data": [ { "id": "2231", "name": "零号大坝-前夜" }, ... ] }
```

### 规则说明
- sol类型房间最多3人，mp类型最多4人。
- 房间有效期：
  - 仅1人时1小时，1→2人时延长为3小时，2+人→1人时重置为1小时。
  - 房间没人时立即销毁。
  - 只有房间内成员可查看房间信息。
- 其它参数和返回字段详见实际接口。

## 特勤处接口

### 获取特勤处信息
```http
GET /df/place/info?place=storage
```

**参数说明:**
- `place`: 场所类型 (可选)
  - `storage`: 仓库
  - `control`: 指挥中心
  - `workbench`: 工作台
  - `tech`: 技术中心
  - `shoot`: 靶场
  - `training`: 训练中心
  - `pharmacy`: 制药台
  - `armory`: 防具台

## 价格接口

### 获取物品历史均价
```http
GET /df/object/price/history/v1?id=12345
```

**参数说明:**
- `id`: 物品ID (必填，单个ID)

### 获取物品历史价格（半小时精度）
```http
GET /df/object/price/history/v2?objectId=12345
```

**参数说明:**
- `objectId`: 物品ID (必填，支持数组)

### 获取物品当前均价
```http
GET /df/object/price/latest
```
**参数说明**
- `id`：物品ID（必填，支持数组）

## 制造材料价格接口

### 获取制造材料最低价格
```http
GET /df/place/materialPrice?id=12345
```

**参数说明:**
- `id`: 物品ID (可选，不传则返回所有材料)

## 利润接口

### 利润历史
```http
GET /df/place/profitHistory?place=tech
```

**参数说明:**
- `objectId`：物品ID，支持单个或数组
- `objectName`：物品名称模糊词
- `place`： 制造场所
- 以上三个参数三选一即可

### 利润排行榜 V1
```http
GET /df/place/profitRank/v1?type=hour&place=workbench&limit=10
```

**参数说明:**
- `type`: 排序类型
  - `hour`: 按小时利润排序
  - `total`: 按总利润排序
  - `hourprofit`: 按小时利润排序
  - `totalprofit`: 按总利润排序
- `place`: 制造场所类型 (可选)
- `limit`: 返回数量限制 (默认10)
- `timestamp`: 时间戳过滤 (可选)

### 利润排行榜 V2 (最高利润)
```http
GET /df/place/profitRank/v2?type=hour&place=workbench&id=12345
```

**参数说明:**
- `type`: 排序类型
  - `hour`: 按小时利润排序
  - `total`: 按总利润排序
  - `hourprofit`: 按小时利润排序
  - `totalprofit`: 按总利润排序
  - `profit`: 按总利润排序
- `place`: 制造场所类型 (可选)
- `id`: 物品ID (可选)

## 个人接口

>以下接口都需要frameworkToken作为个人身份区分，不再重复提示

### 特勤处状态
```http
GET /df/place/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**参数说明:**
- `frameworkToken`: 框架Token (必选，登陆时获取保存)

### 藏品资产查询（非货币）
```http
GET /df/person/collection?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

### 日报（或最近沾豆）
```http
GET /df/person/dailyRecord?frameworkToken=xxxxx&type=sol
```
**参数说明**
- `type`：游戏模式（sol和mp分别为烽火地带和全面战场）（可选，默认查全部）

### 周报
```http
GET /df/person/weeklyRecord?frameworkToken=xxxx&type=sol&isShowNullFriend=false&date=20250706
```
**参数说明**
- `type`：游戏模式（sol和mp分别为烽火地带和全面战场）（可选，默认查全部）
- `isShowNullFriend`：是否展示空值队友（true和false）（可选，默认为true）
- `日期`:周末日期（格式：20250622、20250706）（可选，默认最新周）

### 个人信息
```http
GET /df/person/personalinfo?frameworkToken=xxxx&seasonid=5
```
**参数说明**
- `seasonid`：赛季ID（可选，默认全部赛季合计，仅支持单赛季）（无关roleinfo）

### 个人中心数据
```http
GET /df/person/PersonalData?frameworkToken=xxxx&type=sol&seasonid=5
```
**参数说明**
- `type`：游戏模式（sol和mp分别为烽火地带和全面战场）（可选，默认查全部）
- `seasonid`：赛季ID（可选，默认全部赛季合计，仅支持单赛季）

### 流水查询
```http
GET /df/person/flows?frameworkToken=xxxx&page=1&limit=20
```
**参数说明**
- `page`：查询页数（可选，默认为1）
- `limit`：每页数量（可选，默认为20）

### 货币查询
```http
GET /df/person/money?frameworkToken=xxxx
```

### 战绩查询
```http
GET /df/person/record?frameworkToken=xxxx&type=4&page=1
```
**参数说明**
- `type`：游戏模式（4和5分别为烽火地带和全面战场）（必选）
- `page`：查询第几页（可选，默认第一页，页数大点还能查远古战绩）

### 大红称号
```http
GET /df/person/title?frameworkToken=xxxx
```

### 好友信息
```http
GET /df/person/friendinfo?frameworkToken=xxxx
```

### AI战绩点评
```http
POST /df/person/ai
```
**参数 (body/json)**：
- frameworkToken：框架Token（必填）
- type：游戏模式（sol/mp，必填）
- conversation_id：对话ID（可选，用于继续对话）


## 系统健康检查

### 系统健康状态
```http
GET /health
```

### 示例接口
```http
GET /example
```

## 错误响应格式

所有接口在发生错误时都会返回统一的错误格式：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 常见HTTP状态码

- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权 (缺少或无效的API Key)
- `404`: 资源不存在
- `408`: 请求超时
- `500`: 服务器内部错误

## 注意事项

1. QQ和微信登录需要有效的游戏账号（如果显示请绑定大区，那么请使用/df/person/bind接口
2. WeGame登录需要有效的WeGame账号
3. 价格历史数据有轮询更新机制，数据可能有一定延迟
4. 利润排行榜基于历史数据计算，需要先有相关数据
5. 改枪方案V2版本提供了更完整的功能，建议优先使用
6. AI战绩点评功能需要先绑定游戏角色并有战绩数据
7. 建议在测试环境中使用，避免影响生产数据
