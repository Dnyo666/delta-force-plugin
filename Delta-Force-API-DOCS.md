# Delta Force API 业务测试文档

## 概述

Delta Force API 是一个基于 Koa 框架的游戏数据查询和管理系统，提供物品信息、价格历史、制造场所利润分析等功能。

**该接口由浅巷墨黎、Admilk、mapleleaf开发，任何数据请以三角洲行动官方为准，版权归属腾讯有限公司，该接口仅供技术学习使用**

**对于接口任何返回数据中不懂的部分，请看https://delta-force.apifox.cn，该接口文档由浅巷墨黎整理**

**版本号：v1.5.0**

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

#### 4. 手动刷新QQ登录状态
```http
GET /login/qq/refresh?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：登陆获取到的框架token

**功能说明**：手动刷新QQ登录的access_token，延长有效期

**响应示例：**
```json
{
  "success": true,
  "message": "access_token刷新成功",
  "data": {
    "expires_in": 7776000,
    "openid": "用户OpenID",
    "qqnumber": "2131******"
  }
}
```

#### 5. 删除QQ登录数据
```http
GET /login/qq/delete?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：登陆获取到的框架token

**功能说明**：删除指定的QQ登录数据和相关绑定信息

### QQ CK 登录

#### 1. CK 登录
```http
POST /login/qq/ck
```

#### 2. 轮询CK状态
```http
GET /login/qq/ck/status
```

#### 3. 查看CK token状态
```http
GET /login/qq/ck/token
```

### QQ OAuth 授权登录

#### 1. 获取OAuth授权URL
```http
GET /login/qq/oauth
```
**查询参数（可选）：**
- `platformID`: 平台用户ID
- `botID`: 机器人ID

**响应示例：**
```json
{
  "code": 0,
  "msg": "ok",
  "frameworkToken": "3691c0c9-7701-4496-8ddf-496fe6b9a705",
  "login_url": "https://graph.qq.com/oauth2.0/authorize?response_type=code&state=3691c0c9-7701-4496-8ddf-496fe6b9a705&client_id=101491592&redirect_uri=...",
  "expire": 1703123456789
}
```

#### 2. 提交OAuth授权信息
```http
POST /login/qq/oauth
```
**请求体说明（application/json）：**
```json
{
  "authurl": "https://milo.qq.com/comm-htdocs/login/qc_redirect.html?appid=101491592&parent_domain=https%253A%252F%252Fconnect.qq.com%26success.html&code=CB680BF17005380202A00F9AE7D89216&state=3691c0c9-7701-4496-8ddf-496fe6b9a705"
}
```
**参数说明：**
- `authurl`: 完整的回调URL（包含code和state参数）
- 或者分别提供：
  - `frameworkToken`: 框架Token
  - `authcode`: 授权码

**响应示例：**
```json
{
  "code": 0,
  "msg": "OAuth授权成功",
  "frameworkToken": "3691c0c9-7701-4496-8ddf-496fe6b9a705"
}
```

#### 3. 轮询OAuth状态
```http
GET /login/qq/oauth/status?frameworkToken=3691c0c9-7701-4496-8ddf-496fe6b9a705
```

#### 4. 查看OAuth token状态
```http
GET /login/qq/oauth/token?frameworkToken=3691c0c9-7701-4496-8ddf-496fe6b9a705
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

**响应示例：**
```json
{
  "success": true,
  "message": "access_token刷新成功",
  "data": {
    "expires_in": 7200,
    "scope": "snsapi_userinfo"
  }
}
```

#### 5. 删除微信登录数据
```http
GET /login/wechat/delete?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：登陆获取到的框架token

**功能说明**：删除指定的微信登录数据和相关绑定信息

### 微信OAuth 授权登录

#### 1. 获取OAuth授权URL
```http
GET /login/wechat/oauth
```
**查询参数（可选）：**
- `platformID`: 平台用户ID
- `botID`: 机器人ID

**响应示例：**
```json
{
  "code": 0,
  "msg": "ok",
  "frameworkToken": "403f7116-9285-4f6b-bb38-eff3f4f9f401",
  "login_url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1cd4fbe9335888fe&redirect_uri=https%3A%2F%2Fiu.qq.com%2Fcomm-htdocs%2Flogin%2Fmilosdk%2Fwx_mobile_redirect.html&response_type=code&scope=snsapi_userinfo&state=403f7116-9285-4f6b-bb38-eff3f4f9f401&md=true",
  "expire": 1703123456789
}
```

#### 2. 提交OAuth授权信息
```http
POST /login/wechat/oauth
```
**请求体说明（application/json）：**
```json
{
  "authurl": "https://connect.qq.com/comm-htdocs/login/milosdk/wx_mobile_callback.html?acctype=wx&appid=wx1cd4fbe9335888fe&s_url=https%3A%2F%2Fconnect.qq.com%2Fsuccess.html&code=021kjz1w3xAPH53SBj0w3QJYEg4kjz1w&state=403f7116-9285-4f6b-bb38-eff3f4f9f401"
}
```
**参数说明：**
- `authurl`: 完整的回调URL（包含code和state参数）
- 或者分别提供：
  - `frameworkToken`: 框架Token
  - `authcode`: 授权码

**响应示例：**
```json
{
  "code": 0,
  "msg": "OAuth授权成功",
  "frameworkToken": "403f7116-9285-4f6b-bb38-eff3f4f9f401"
}
```

#### 3. 轮询OAuth状态
```http
GET /login/wechat/oauth/status?frameworkToken=403f7116-9285-4f6b-bb38-eff3f4f9f401
```

#### 4. 查看OAuth token状态
```http
GET /login/wechat/oauth/token?frameworkToken=403f7116-9285-4f6b-bb38-eff3f4f9f401
```

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
GET /df/wegame/wechat/gift?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：登陆获取到的框架token

**功能说明**：使用WeGame微信登录凭据获取游戏内礼品

**响应示例：**
```json
{
  "success": true,
  "data": {
    "gifts": [
      {
        "id": "gift_001",
        "name": "新手礼包",
        "description": "包含基础武器和装备",
        "claimed": false
      }
    ],
    "totalGifts": 1
  }
}
```

## 统一OAuth接口

### 统一平台状态查询
```http
GET /login/oauth/platform-status?platformID=12345&botID=67890&type=qq
```
**查询参数：**
- `platformID`: 平台用户ID（必填）
- `botID`: 机器人ID（可选）
- `type`: 登录类型（可选，`qq`|`wechat`|不填表示查询全部）

**响应示例：**
```json
{
  "code": 0,
  "msg": "ok",
  "platformID": "12345",
  "botID": "67890",
  "type": "qq",
  "sessions": [
    {
      "frameworkToken": "3691c0c9-7701-4496-8ddf-496fe6b9a705",
      "status": "completed",
      "expire": 1703123456789,
      "loginUrl": "https://graph.qq.com/oauth2.0/authorize?...",
      "createdAt": 1703120000000,
      "openId": "D7AF10F0E80DD74A6844FB54A131C95D",
      "botID": "67890",
      "type": "qq",
      "oauthType": "oauth2",
      "qqNumber": ""
    }
  ],
  "count": 1,
  "breakdown": {
    "qq": 1,
    "wechat": 0
  }
}
```

### 统一Token验证
```http
GET /login/oauth/token?frameworkToken=3691c0c9-7701-4496-8ddf-496fe6b9a705
```
**查询参数：**
- `frameworkToken`: 框架Token（必填）

**功能说明**：统一验证QQ和微信的frameworkToken是否有效，返回token状态信息

**QQ Token响应示例：**
```json
{
  "code": 0,
  "msg": "token有效",
  "type": "qq",
  "frameworkToken": "3691c0c9-7701-4496-8ddf-496fe6b9a705",
  "isValid": true,
  "isBind": false,
  "hasOpenId": true,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**微信Token响应示例：**
```json
{
  "code": 0,
  "msg": "token有效",
  "type": "wechat",
  "frameworkToken": "403f7116-9285-4f6b-bb38-eff3f4f9f401",
  "isValid": true,
  "isBind": false,
  "hasOpenId": true,
  "hasUnionId": true,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Token不存在响应：**
```json
{
  "code": -2,
  "msg": "token不存在或已过期",
  "frameworkToken": "invalid-token"
}
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
**功能说明**：获取游戏健康状态相关信息

**响应示例：**
```json
{
  "success": true,
  "data": {
    "healthStatus": "normal",
    "serverTime": "2025-01-15T10:30:00.000Z",
    "gameVersion": "1.4.0"
  }
}
```

### 皮肤收藏品信息
```http
GET /df/object/collection
```
**功能说明**：获取所有皮肤收藏品的信息列表

**响应示例：**
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": 15080050001,
        "name": "经典AK-47",
        "type": "weapon_skin",
        "rare": "legendary",
        "gunType": "assault_rifle"
      }
    ],
    "totalCount": 150
  }
}
```

### 干员信息
```http
GET /df/object/operator
```
**功能说明**：获取游戏中所有干员的详细信息

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

### 弹药信息及价格历史
```http
GET /df/object/ammo?days=7
```
**参数说明:**
- `days`: 获取多少天的价格历史数据（可选，默认2天，最大30天，最小1天）

**功能说明**：获取所有弹药物品及其价格历史数据，支持指定天数的历史价格查询

**响应示例：**
```json
{
  "success": true,
  "message": "获取子弹及价格历史成功",
  "data": {
    "bullets": [
      {
        "objectID": 15010000001,
        "name": "5.56x45mm NATO",
        "primaryClass": "ammo",
        "secondClass": "rifle",
        "caliber": "5.56x45mm",
        "penetrationLevel": 3,
        "harmRatio": 100,
        "muzzleVelocity": 850,
        "priceHistory": [
          {
            "timestamp": 1703123456789,
            "avgPrice": 12.5,
            "minPrice": 10.0,
            "maxPrice": 15.0
          }
        ]
      }
    ],
    "totalCount": 25,
    "queryDays": 7,
    "currentTime": "2025-01-15T10:30:00.000Z",
    "loginInfo": {
      "type": "qc",
      "openid": "D7AF10F0E80DD74A6844FB54A131C95D"
    }
  }
}
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
GET /df/object/price/latest?id=12345
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

### 藏品解锁记录列表
```http
GET /df/person/redlist?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```
**参数说明**
- `frameworkToken`：框架Token（必填）

**功能说明**：查询用户所有藏品的解锁记录列表，包含解锁时间、物品ID、地图ID、数量和描述等信息。

**响应示例：**
```json
{
  "success": true,
  "data": {
    "records": {
      "total": 43,
      "list": [
        {
          "time": "2025-06-06 20:15:10",
          "itemId": "15080050014",
          "mapid": 3902,
          "num": 1,
          "des": "打开它，仿佛能看见过去的战场"
        }
      ]
    },
    "currentTime": "2025-01-15 10:30:25",
    "amsSerial": "AMS-DFM-11510302-ABC123",
    "loginInfo": {
      "type": "qc",
      "openid": "D7AF10F0E80DD74A6844FB54A131C95D"
    }
  },
  "message": "获取藏品解锁记录成功"
}
```

### 具体某藏品记录
```http
GET /df/person/redone?frameworkToken=xxxxx&objectid=15080050058
```
**参数说明**
- `frameworkToken`：框架Token（必填）
- `objectid`：物品ID/藏品ID（必填）

**功能说明**：查询指定藏品的详细解锁历史记录，包含该藏品的所有获取记录、时间和地图信息。

**响应示例：**
```json
{
  "success": true,
  "data": {
    "objectId": "15080050058",
    "itemData": {
      "total": 2,
      "des": "嘀~救队友速度翻倍",
      "list": [
        {
          "num": 1,
          "time": "2025-06-20 12:39:39",
          "mapid": 3902
        },
        {
          "num": 1,
          "time": "2025-06-20 14:01:53",
          "mapid": 3902
        }
      ]
    },
    "currentTime": "2025-01-15 10:30:25",
    "amsSerial": "AMS-DFM-11510302-ABC123"
  },
  "message": "获取藏品记录成功，共2条记录"
}
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

### 基础健康状态
```http
GET /health
```
**功能说明**：获取系统基础健康状态，包括节点信息、内存使用情况、运行时间等。

**响应示例：**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "nodeType": "master",
  "nodeId": "node-001",
  "uptime": 86400,
  "memory": {
    "used": 128,
    "total": 512,
    "rss": 256,
    "external": 32
  },
  "nodeInfo": {
    "version": "v20.10.0",
    "platform": "win32",
    "arch": "x64",
    "pid": 12345
  }
}
```

### 详细健康检查
```http
GET /health/detailed
```
**功能说明**：获取系统详细健康状态，包括数据库连接、Redis状态、集群信息、功能状态等。

**响应示例：**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "cluster": {
    "nodeType": "master",
    "nodeId": "node-001",
    "isReadOnlyMode": false,
    "autoSyncEnabled": true,
    "scheduledTasksEnabled": true,
    "dataSyncEnabled": true,
    "weight": 100,
    "slaveNodes": []
  },
  "system": {
    "uptime": 86400,
    "nodeVersion": "v20.10.0",
    "platform": "win32",
    "arch": "x64",
    "memory": {
      "rss": 256,
      "heapTotal": 512,
      "heapUsed": 128,
      "external": 32
    },
    "cpu": {
      "user": 1000000,
      "system": 500000
    }
  },
  "dependencies": {
    "mongodb": {
      "status": "connected",
      "dbName": "delta_force_api",
      "version": "7.0.0",
      "topology": "ReplicaSetWithPrimary",
      "servers": ["***.***.***:27017"],
      "latency": 15
    },
    "redis": {
      "status": "connected"
    }
  },
  "features": {
    "objectSync": true,
    "collectionSync": true,
    "subscriptionPoller": true,
    "tokenPoller": true,
    "loginPoolRefresh": true,
    "tradePoller": true,
    "pricePoller": true,
    "profitPoller": true
  }
}
```

## 用户统计接口

### 获取用户统计信息
```http
GET /stats/users?clientID=your_client_id
```
**参数说明：**
- `clientID`：客户端ID（必填）

**功能说明**：
- **管理员用户**：可查看全系统统计数据，包括所有用户、API密钥、订阅、登录方式等统计信息
- **普通用户**：只能查看自己的统计数据，包括绑定账号、登录方式、API密钥等

**管理员响应示例：**
```json
{
  "code": 0,
  "message": "获取全部用户统计信息成功（管理员权限）",
  "data": {
    "users": {
      "total": 1250,
      "emailVerified": 980,
      "emailUnverified": 270
    },
    "api": {
      "totalKeys": 450,
      "activeKeys": 380,
      "inactiveKeys": 70
    },
    "subscription": {
      "proUsers": 125,
      "freeUsers": 1125,
      "totalSubscriptions": 1250
    },
    "loginMethods": {
      "qq": {
        "total": 850,
        "valid": 720,
        "invalid": 130
      },
      "wechat": {
        "total": 450,
        "valid": 380,
        "invalid": 70
      },
      "wegame": {
        "total": 320,
        "valid": 280,
        "invalid": 40
      },
      "wegameWechat": {
        "total": 180,
        "valid": 150,
        "invalid": 30
      },
      "qqsafe": {
        "total": 200,
        "valid": 170,
        "invalid": 30
      },
      "qqCk": {
        "total": 100,
        "valid": 85,
        "invalid": 15
      }
    },
    "platform": {
      "totalBindings": 2500,
      "boundUsers": 2200,
      "unboundUsers": 300
    },
    "security": {
      "passwordResets24h": 15,
      "passwordResets7d": 78,
      "totalSecurityEvents": 1250,
      "recentSecurityEvents": [
        {
          "action": "password_reset",
          "count": 25,
          "severity": "medium"
        }
      ]
    }
  },
  "timestamp": "2025-01-15T10:30:00.000Z",
  "accessLevel": "admin"
}
```

**普通用户响应示例：**
```json
{
  "code": 0,
  "message": "获取用户特定统计信息成功",
  "data": {
    "userInfo": {
      "clientID": "bot_12345",
      "totalAccounts": 5,
      "boundAccounts": 4,
      "unboundAccounts": 1,
      "clientType": "qq_bot",
      "bindTime": "2024-12-01T10:00:00.000Z"
    },
    "loginMethods": {
      "qq": {
        "total": 3,
        "valid": 2,
        "invalid": 1
      },
      "wechat": {
        "total": 2,
        "valid": 2,
        "invalid": 0
      }
    },
    "api": {
      "totalKeys": 2,
      "activeKeys": 2,
      "inactiveKeys": 0
    }
  },
  "timestamp": "2025-01-15T10:30:00.000Z",
  "accessLevel": "user"
}
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

1. **OAuth授权登录推荐**：建议优先使用OAuth授权登录（`/login/qq/oauth` 和 `/login/wechat/oauth`），相比传统方式更安全稳定
2. **授权流程**：OAuth登录需要用户在授权页面登录后，将完整的回调URL提交给接口，系统会自动提取授权码和frameworkToken
3. **统一接口**：使用 `/login/oauth/platform-status` 可以同时查询QQ和微信的授权状态，支持type参数过滤
4. QQ和微信登录需要有效的游戏账号（如果显示请绑定大区，那么请使用/df/person/bind接口）
5. WeGame登录需要有效的WeGame账号
6. 价格历史数据有轮询更新机制，数据可能有一定延迟
7. 利润排行榜基于历史数据计算，需要先有相关数据
8. 改枪方案V2版本提供了更完整的功能，建议优先使用
9. AI战绩点评功能需要先绑定游戏角色并有战绩数据
10. 建议在测试环境中使用，避免影响生产数据
