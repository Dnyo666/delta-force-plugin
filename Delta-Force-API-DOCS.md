 # Delta Force API 业务测试文档

## 概述

Delta Force API 是一个基于 Koa 框架的游戏数据查询和管理系统，提供物品信息、价格历史、制造场所利润分析等功能。

> **⚠️ 重要声明**  
> 该接口由浅巷墨黎、Admilk、mapleleaf开发，任何数据请以三角洲行动官方为准，版权归属腾讯有限公司，该接口仅供技术学习使用。

> **📚 相关文档**  
> 对于接口任何返回数据中不懂的部分，请参考 [Delta Force API 文档](https://delta-force.apifox.cn)，该接口文档由浅巷墨黎整理。

**版本号：** `v2.1.6`

## WebSocket 服务

### 概述

API 提供 WebSocket 服务，用于实时推送价格更新等数据变化。客户端可以订阅特定类型的数据频道（channel），当数据更新时会自动收到推送通知。

### 连接地址

```

# 连接
ws://your-api-domain:port/ws?key=密钥

# WSS 加密连接
wss://your-api-domain:port/ws?key=密钥
```

** 注意：**`channels`（频道）是 WebSocket 消息订阅频道，与游戏房间（Room）是不同的概念，频道由插件注册，而消息类型（比如订阅）则是内部固定。

#### 连接参数

- `key`：用户自己的 API Key（**必填**，用于身份认证和权限验证）
- `clientId`/`clientID`：除 `type=price_submit` 连接外为必填，用于标识后端用户
- `platformId`/`platformID`：可选，若提供则作为该连接的默认平台用户
- `clientType`：可选，若提供则作为该连接的默认客户端类型
- `type`：可选，连接类型，如 `price_submit`

**认证说明**：
- 连接时使用 API Key 进行身份验证
- 系统会自动获取用户的订阅等级（free/pro）
- 订阅频道和发送消息时会自动检查权限
- 权限不足时会返回相应的错误消息

错误返回（HTTP Upgrade 阶段）：
```json
{ "success": false, "code": 3001, "message": "缺少必需参数 clientID" }
{ "success": false, "code": 401, "message": "API Key 无效" }
```

### 客户端消息类型

#### 1. 订阅频道 (subscribe)

```json
{
  "type": "subscribe",
  "channel": "price:gun",
  "platformId": "p1" // 可选：仅对此频道的订阅绑定平台用户
}
```

或批量订阅：

```json
{
  "type": "subscribe",
  "channels": ["price:gun", "price:ammo", "price:all"]
}
```

#### 2. 取消订阅 (unsubscribe)

```json
{
  "type": "unsubscribe",
  "channel": "price:gun"
}
```

或批量取消订阅：

```json
{
  "type": "unsubscribe",
  "channels": ["price:gun", "price:ammo"]
}
```

#### 3. 心跳 (ping)

客户端可以主动发送应用层的 ping 消息：

```json
{
  "type": "ping"
}
```

**心跳机制说明**：
- **WebSocket ping/pong（协议层）**：服务器每 30 秒自动发送 ping 帧，客户端应自动响应 pong 帧。**错过 1 次 pong 响应即断开连接**（总超时 60 秒）。这是主要的心跳机制，符合 ws 库官方标准。
- **应用层 ping 消息**：客户端可以发送 JSON 消息 `{type: 'ping'}`，服务器会返回 JSON 消息 `{type: 'pong'}`。这是应用层的心跳，与协议层 ping/pong 不同，仅用于应用层状态确认。
- **OCR 心跳**：OCR 任务管理系统使用统一的 WebSocket 协议层 ping/pong 机制，无需额外配置。

### 服务端消息类型

#### 1. 连接成功 (connected)

```json
{
  "type": "connected",
  "data": {
    "clientId": "ws_1762625000000_abc123",
    "message": "WebSocket连接成功",
    "availableChannels": [
      "price:gun",
      "price:protect",
      "price:acc",
      "price:ammo",
      "price:props",
      "price:consume",
      "price:key",
      "price:all"
    ],
    "boundClientId": null
  },
  "timestamp": 1762625000000
}
```

#### 2. 订阅成功 (subscribed)

```json
{
  "type": "subscribed",
  "channel": "price:gun",
  "data": {
    "message": "已订阅频道: price:gun",
    "platformId": "p1",
    "clientType": "bot",
    "meta": {
      "platformId": "p1",
      "clientId": "user-001",
      "clientType": "bot"
    }
  },
  "timestamp": 1762625000000
}
```

#### 3. 取消订阅成功 (unsubscribed)

```json
{
  "type": "unsubscribed",
  "channel": "price:gun",
  "data": {
    "message": "已取消订阅: price:gun"
  },
  "timestamp": 1762625000000
}
```

#### 4. 价格更新推送 (price_update)

```json
{
  "type": "price_update",
  "channel": "price:gun",
  "data": {
    "dataType": "gun",
    "type": "gun",
    "timestamp": 1762625000,
    "itemCount": 150,
    "matched": 150,
    "message": "gun类型价格数据已更新"
  },
  "timestamp": 1762625000000
}
```

#### 统一响应元信息（meta）

所有服务端回包的 `data` 中会附带：
```json
{
  "meta": {
    "platformId": "p1",      // 按优先级：频道级唯一 > 连接默认(URL/auth_user) > null
    "clientId": "user-001",  // 当前连接绑定的后端用户
    "clientType": "bot"      // 若绑定则回显
  }
}
```

#### 连接成功 (connected) 示例（含 meta）
> 说明：connected 通过统一通道下发，meta 同样包含在 data 内部
```json
{
  "type": "connected",
  "data": {
    "clientId": "ws_1762625000000_abc123",
    "message": "WebSocket连接成功",
    "availableChannels": ["price:gun","price:protect","price:acc","price:ammo","price:props","price:consume","price:key","price:all"],
    "boundClientId": "user-001",
    "clientType": "bot",
    "meta": {
      "platformId": "p1",
      "clientId": "user-001",
      "clientType": "bot"
    }
  },
  "timestamp": 1762625000000
}
```

#### 5. 价格提交结果 (price_submit_response)

**成功响应**：
```json
{
  "type": "price_submit_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "价格数据提交成功",
    "type": "protect",
    "timestamp": 1762208120,
    "timestampISO": "2025-11-03T22:15:20.000Z",
    "totalSubmitted": 171,
    "matched": 171,
    "unmatched": 0,
    "saved": 171,
    "failed": 0,
    "unmatchedItems": [],
    "processingTime": 325
  },
  "timestamp": 1762208120
}
```

**错误响应**：
```json
{
  "type": "price_submit_response",
  "data": {
    "success": false,
    "code": 5001,
    "message": "密钥认证失败，无权提交数据"
  },
  "timestamp": 1762208120
}
```

**错误码说明**：
- `5001`: 提交密钥无效或认证失败
- `5101`: 数据格式错误（缺少 items 数组）
- `5102`: 缺少时间戳字段或格式错误
- `5103`: 缺少 type 字段
- `5104`: 无效的 type 值
- `9000`: 系统内部错误

#### 6. 心跳响应 (pong)

```json
{
  "type": "pong",
  "timestamp": 1762625000000
}
```

#### 7. 错误消息 (error)

```json
{
  "type": "error",
  "data": {
    "code": 3001,
    "message": "错误描述"
  },
  "timestamp": 1762625000000
}
```

**常见错误码**：
- `3001`: 缺少必需参数 clientID
- `3002`: 消息过大被拒绝
- `3003`: 消息发送过于频繁（限流）
- `3004`: 消息格式错误
- `3005`: 缺少认证令牌
- `3006`: 无效的认证令牌
- `3007`: 无效的频道名称
- `3008`: 超过最大频道订阅数
- `3009`: 订阅/取消订阅操作过于频繁
- `3010`: 自定义权限验证失败
- `3011`: **订阅等级不足**（需要更高的订阅等级，如 pro）
- `9000`: 系统内部错误

**订阅等级错误详细说明（code: 3011）**：
```json
{
  "type": "error",
  "data": {
    "code": 3011,
    "message": "该频道需要 pro 订阅等级",
    "requiredTier": "pro",    // 需要的订阅等级
    "currentTier": "free"     // 当前用户的订阅等级
  },
  "timestamp": 1763434949364
}
```

### 可用频道列表

**重要说明**：所有频道均由插件动态注册，连接成功后会通过 `connected` 消息返回当前可用的频道列表（`availableChannels`）。

**频道命名规范**：
- 格式：`namespace:name`（使用冒号分隔）
- 任务相关频道可使用下划线命名（如：`ocr:task_task_id`）
- 所有频道必须由插件注册后才能使用

**常见频道**（由价格插件注册）：
| 频道名称 | 说明 | 推送内容 | 订阅等级 |
|---------|------|---------|---------|
| `price:gun` | 枪械价格 | 枪械价格更新时推送 | free |
| `price:protect` | 装备价格 | 装备价格更新时推送 | free |
| `price:acc` | 配件价格 | 配件价格更新时推送 | free |
| `price:ammo` | 弹药价格 | 弹药价格更新时推送 | free |
| `price:props` | 收集品价格 | 收集品价格更新时推送 | free |
| `price:consume` | 消耗品价格 | 消耗品价格更新时推送 | free |
| `price:key` | 钥匙价格 | 钥匙价格更新时推送 | free |
| `price:all` | 所有价格更新 | 任何类型价格更新时推送 | **pro** |

**公共聊天频道**（由频道插件注册）：
| 频道名称 | 说明 | 订阅等级 |
|---------|------|---------|
| `channel:lobby` | 公共大厅聊天 | none（任何人） |
| `channel:trade` | 交易区讨论 | free |
| `channel:help` | 新手帮助和问答 | free |
| `channel:vip` | VIP 专属频道 | **pro** |

**订阅等级说明**：
- `none`: 任何人都可以访问（包括未登录用户）
- `free`: 需要登录（免费用户和专业用户都可以访问）
- `pro`: 需要专业版订阅才能访问

### WebSocket 统计接口（http）

#### 管理员查询接口

```http
GET /ws/admin/stats?clientid=管理员ID
```

说明：
- 仅管理员可用；参数统一为 `clientid`。

响应示例：
```json
{
  "success": true,
  "code": "0",
  "message": "OK",
  "data": {
    "totalClients": 15,
    "totalUsers": 10,
    "totalClientIds": 10,
    "totalChannels": 5,
    "totalSubscriptions": 28,
    "totalMessages": 1000,
    "inboundMessages": 620,
    "outboundMessages": 380
  }
}
```

#### 普通用户统计接口

```http
GET /ws/user/stats?clientid=用户ID
```

说明：
- 查询参数统一为 `clientid`。

响应示例：
```json
{
  "success": true,
  "code": "0",
  "message": "OK",
  "data": {
    "userId": "u1",
    "connections": 2,
    "clientIds": ["ws_1762625000000_abc123", "ws_1762625001000_def456"],
    "subscribedChannelsCount": 3,
    "totalMessages": 120
  }
}
```

### 连接管理

#### 心跳机制

服务器实现了双重心跳检测机制，确保及时发现并断开无效连接：

**1. 服务器主动心跳（WebSocket 协议层）**
- **心跳间隔**: 每 30 秒发送一次 ping 帧（可配置，默认 30000ms）
- **超时策略**: 错过 1 次 pong 响应即断开（符合 ws 库官方标准）
- **检测流程**:
  1. 服务器每 30 秒对所有连接发送 ping 帧
  2. 发送 ping 前，先检查上一轮 ping 是否收到 pong 响应
  3. 如果上一轮 ping 未收到 pong（`isAlive = false`），立即断开连接
  4. 通过检查后，发送新的 ping 帧，并标记 `isAlive = false`（供下一轮检查使用）
  5. 收到 pong 响应时，自动设置 `isAlive = true`

**2. 客户端活动检测**
- **超时时间**: 60 秒无活动会被自动断开（可配置，默认 60000ms）
- **活动定义**: 收到客户端的任何消息（pong 响应、业务消息等）都会更新活动时间

**3. 断开条件**
客户端会在以下情况被断开：
- **心跳超时**: 错过 1 次 pong 响应（在下一轮心跳检测时断开，总超时 60 秒）
- **活动超时**: 超过 60 秒无任何消息（备用检查机制）

**4. 客户端建议**
- **自动响应 pong**: WebSocket 客户端应自动响应服务器发送的 ping 帧（大多数 WebSocket 库会自动处理）
- **主动发送消息**: 如果客户端有业务消息，发送消息也会更新活动时间，保持连接活跃
- **应用层 ping**: 客户端也可以发送应用层的 `{"type": "ping"}` 消息，服务器会返回 `{"type": "pong"}` 消息
- **自动重连**: 建议客户端实现自动重连机制，处理连接断开情况

**5. 配置参数**
- `heartbeatInterval`: 心跳间隔（毫秒），默认 30000（30秒）
- `clientTimeout`: 客户端超时时间（毫秒），默认 60000（60秒）

**6. 心跳时序示例（符合 ws 官方标准）**
```
正常流程：
T=0s:    客户端连接，isAlive = true
T=30s:   服务器发送 ping，设置 isAlive = false
T=30.1s: 客户端响应 pong，isAlive = true
T=60s:   服务器检查 isAlive = true ✓，发送新 ping，设置 isAlive = false
T=60.1s: 客户端响应 pong，isAlive = true
...

超时流程（错过 1 次即断开）：
T=0s:    客户端连接，isAlive = true
T=30s:   服务器发送 ping，设置 isAlive = false
T=30-60s: 客户端未响应 pong，isAlive 保持 false
T=60s:   服务器检查 isAlive = false ✗，立即断开连接
```

### 最佳实践

1. **实现心跳保活**: 客户端应定期发送 ping 消息保持连接活跃
2. **错误处理**: 处理连接断开和错误情况，实现自动重连
3. **选择性订阅**: 只订阅需要的频道，避免不必要的消息推送
4. **消息去重**: 可能会收到重复消息，建议根据 timestamp 去重
5. **性能考虑**: 大量客户端连接时，考虑使用连接池和负载均衡
6. **权限检查**: 
   - 订阅频道前检查用户的订阅等级
   - 收到 `code: 3011` 错误时，引导用户升级订阅
   - 前端可根据用户等级显示可用频道列表
7. **API Key 管理**: 
   - 妥善保管 API Key，避免泄露
   - 定期更新 API Key
   - 不要在客户端代码中硬编码 API Key

### 注意事项

- WebSocket 连接数有限制，请勿创建过多连接
- 价格更新推送不保证消息顺序，建议使用 timestamp 排序
- 在生产环境使用 WSS（WebSocket over TLS）保证安全性
- API Key 认证功能可用于追踪和限制连接

---

## 战绩订阅系统

### 概述

战绩订阅系统提供实时战绩推送功能，支持烽火地带（sol）和全面战场（mp）两种游戏模式。系统由两个插件协同工作：
- **RecordSubManager**：后台轮询管理，负责订阅管理和数据采集
- **RecordSubNotifier**：WebSocket 推送，负责实时推送新战绩

### HTTP API 接口

#### 1. 订阅战绩
```http
POST /df/record/subscribe
```

**请求体 (application/json)**：
```json
{
  "platformID": "12346",
  "clientID": "114514",
  "subscriptionType": "both"
}
```

**参数说明**：
- `platformID`：平台用户ID（必填）
- `clientID`：客户端ID（必填）
- `subscriptionType`：订阅类型（必填）
  - `sol`：烽火地带（游戏模式4）
  - `mp`：全面战场（游戏模式5）
  - `both`：同时订阅两种模式

**响应示例**：
```json
{
  "success": true,
  "message": "订阅成功",
  "data": {
    "platformID": "12346",
    "clientID": "114514",
    "subscriptionType": "both",
    "isActive": true
  }
}
```

#### 2. 取消订阅
```http
POST /df/record/unsubscribe
```

**请求体 (application/json)**：
```json
{
  "platformID": "12346",
  "clientID": "114514"
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "取消订阅成功"
}
```

#### 3. 查询订阅状态
```http
GET /df/record/subscription?platformID=12346&clientID=114514
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "platformID": "12346",
    "clientID": "114514",
    "subscriptionType": "both",
    "isActive": true,
    "pollInterval": 60,
    "lastPollAt": "2025-11-18T05:30:00.000Z",
    "nextPollAt": "2025-11-18T05:31:00.000Z",
    "totalPolls": 120,
    "successPolls": 118,
    "failedPolls": 2,
    "newRecordsCount": 15,
    "frameworkTokenRecords": {
      "23d950c1-52b0-42a7-a261-27e888050a27": {
        "lastSolRecordIds": ["648522568381002663_2025-11-18 02:06:50"],
        "lastMpRecordIds": ["748522568381002663_2025-11-18 02:06:50"],
        "lastPollAt": "2025-11-18T05:30:00.000Z"
      }
    },
    "createdAt": "2025-11-18T03:00:00.000Z",
    "updatedAt": "2025-11-18T05:30:00.000Z"
  }
}
```

**字段说明**：
- **注意**：战绩ID不再存储在 MongoDB 中，改为存储在 Redis（`record:last:{platformID}:{frameworkToken}:{sol|mp}`）
- `frameworkToken` 从 `api_user_binding` 实时查询，确保使用最新的账号绑定

#### 4. 获取统计信息
```http
GET /df/record/stats
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "subscriptions": {
      "total": 150,
      "active": 120,
      "inactive": 30
    },
    "polls": {
      "totalPolls": 18000,
      "successPolls": 17500,
      "failedPolls": 500,
      "newRecordsCount": 2500
    },
    "polling": {
      "isRunning": true,
      "interval": "60 秒"
    }
  }
}
```

### WebSocket 实时推送

#### 连接方式

```javascript
const ws = new WebSocket('wss://your-api-domain:port/ws?key=YOUR_API_KEY&clientID=114514');
```

#### 1. 订阅战绩推送

**客户端发送**：
```json
{
  "type": "record_subscribe",
  "platformId": "12346",
  "recordType": "both"
}
```

**参数说明**：
- `platformId`：平台用户ID（必填，WebSocket消息中使用小写id）
- `recordType`：订阅类型（可选，默认 `both`）
  - `sol`：烽火地带
  - `mp`：全面战场
  - `both`：同时订阅

**服务器响应**：

订阅成功后，服务器会立即推送缓存战绩：
```json
{
  "type": "message",
  "data": {
    "success": true,
    "code": 0,
    "message": "订阅成功，将直接推送战绩到客户端",
    "messageType": "record_subscribe_response",
    "platformId": "123456",
    "payload": {
      "platformID": "123456",
      "recordType": "both"
    },
    "meta": {
      "platformId": "123456",
      "clientId": "68734e4f5d67fecc0d4ac0b0",
      "clientType": null
    }
  },
  "timestamp": 1763463380123
}
```

#### 2. 缓存战绩推送（自动）

订阅成功后，系统会**自动推送**该 platformID 下所有游戏账号的最近 3 条战绩：

```json
{
  "type": "message",
  "data": {
    "messageType": "record_update",
    "platformId": "123456",
    "frameworkToken": "23d950c1-52b0-42a7-a261-27e888050a27",
    "recordType": "sol",
    "record": {
      "MapId": "2201",
      "EscapeFailReason": 10,
      "FinalPrice": 0,
      "KeyChainCarryOutPrice": null,
      "CarryoutSafeBoxPrice": 0,
      "KeyChainCarryInPrice": 0,
      "CarryoutSelfPrice": 0,
      "dtEventTime": "2025-11-18 17:06:17",
      "ArmedForceId": 10010,
      "DurationS": null,
      "KillCount": null,
      "KillPlayerAICount": null,
      "KillAICount": null,
      "flowCalGainedPrice": 93029,
      "RoomId": "648522555786505516"
    },
    "isRecent": true,
    "meta": {
      "platformId": "123456",
      "clientId": "68734e4f5d67fecc0d4ac0b0",
      "clientType": null
    }
  },
  "timestamp": 1763463406664
}
```

**注意**：
- **每个 frameworkToken 独立推送 3 条历史战绩**（例如：2个账号 × 6条 = 12条）
- `meta` 字段由 WebSocketManager 自动添加，包含连接元信息
- **数据过滤**：推送数据只包含**个人战绩**，不包含队友和房间信息
  - **烽火地带（sol）**：移除了 `teammateArr` 字段（v1 接口原始包含）
  - **全面战场（mp）**：不包含 `RoomInfo` 字段

#### 3. 新战绩推送（实时）

当检测到新战绩时，系统会**自动推送到订阅了该 platformID 的所有客户端**：

```json
{
  "type": "message",
  "data": {
    "messageType": "record_update",
    "platformId": "123456",
    "frameworkToken": "23d950c1-52b0-42a7-a261-27e888050a27",
    "recordType": "mp",
    "record": {
      "MapId": "3001",
      "EscapeFailReason": 1,
      "FinalPrice": 25000,
      "KeyChainCarryOutPrice": null,
      "CarryoutSafeBoxPrice": 0,
      "KeyChainCarryInPrice": 0,
      "CarryoutSelfPrice": 0,
      "dtEventTime": "2025-11-18 18:20:15",
      "ArmedForceId": 20010,
      "DurationS": 450,
      "KillCount": 8,
      "KillPlayerAICount": 0,
      "KillAICount": 12,
      "flowCalGainedPrice": 205000,
      "RoomId": "748522568381005234"
    },
    "isNew": true,
    "meta": {
      "platformId": "123456",
      "clientId": "68734e4f5d67fecc0d4ac0b0",
      "clientType": null
    }
  },
  "timestamp": 1763463506789
}
```

#### 推送消息字段说明

**业务字段**：
- **`messageType`**: 消息类型，固定为 `record_update`
- **`platformId`**: 平台用户ID
- **`frameworkToken`**: 游戏账号框架令牌（用于区分同一 platformID 下的多个游戏账号）
- **`recordType`**: 战绩类型（用于区分游戏模式）
  - `sol` - 烽火地带（type=4）
  - `mp` - 全面战场（type=5）
- **`record`**: 个人战绩对象（已过滤队友和房间数据）
  - 包含基础战绩字段（MapId, RoomId, dtEventTime, KillCount 等）
  - **不包含** `teammateArr` 字段（烽火地带的队友数据已移除）
  - **不包含** `RoomInfo` 字段（两种模式都不查询房间信息）
  - 仅包含个人战绩数据，数据更纯净
- **`isRecent`**: `true` 表示缓存战绩（订阅时推送）
- **`isNew`**: `true` 表示新战绩（实时检测到）

**元信息字段（meta）**：
- **`meta.platformId`**: 平台用户ID，从 `data.platformId` 自动提取
- **`meta.clientId`**: 客户端用户ID
- **`meta.clientType`**: 客户端类型（如 `web`、`mobile`）

**推送机制**：
- ✅ 订阅成功后，系统会**直接推送**战绩到客户端（无需订阅频道）
- ✅ 推送数据包含 `frameworkToken` 和 `recordType`，方便客户端区分账号和模式
- ✅ 一个 platformID 可能有多个游戏账号（不同的 frameworkToken）
- ✅ 客户端可根据 `recordType` 过滤订阅的游戏模式

**权限说明**：战绩订阅功能需要**专业版（pro）**订阅等级才能使用。

### 工作原理

#### 1. 后台轮询（RecordSubManager）

- **轮询间隔**：每 60 秒轮询一次
- **智能查询策略**：
  - **≤60 个账号**：顺序查询，均匀分布在 60 秒内（每个间隔约 1 秒）
  - **>60 个账号**：分批并发，每批最多 3 个账号，分散到 60 秒内
  - 避免瞬间大量并发导致 API 拦截
- **多账号支持**：
  - 一个用户可绑定多个游戏账号（多个 frameworkToken）
  - 系统从 `api_user_binding` **实时查询**当前有效的账号，确保使用最新绑定
  - 用户更新登录信息后，下次轮询会自动使用新账号
- **数据缓存**：
  - 最新 3 条战绩缓存在 Redis（`record:recent:{platformID}:{frameworkToken}:{sol|mp}`），7 天过期
  - 战绩ID存储在 Redis（`record:last:{platformID}:{frameworkToken}:{sol|mp}`），不存储在 MongoDB
- **新战绩检测**：对比 `RoomId_dtEventTime` 识别新战绩
- **战绩接口**：使用 v1 接口（iChartId: 319386）
  - 数据更准确，烽火地带直接包含队友数据
- **数据过滤**：
  - **烽火地带（sol/type=4）**：移除 `teammateArr` 字段（队友数据）
  - **全面战场（mp/type=5）**：不查询房间信息
  - 只推送个人战绩数据，减少网络传输和存储

#### 2. 实时推送（RecordSubNotifier）

- **推送频率**：每 5 秒检查一次新战绩队列
- **历史推送**：订阅时立即推送每个账号的最近 3 条战绩（独立推送，不合并）
- **数据过滤**：推送个人战绩数据（已移除 `teammateArr` 和 `RoomInfo` 字段）
- **自动清理**：推送后清空 Redis 新战绩队列
- **实时查询**：从 `api_user_binding` 实时查询 frameworkToken，确保推送的是当前绑定账号的战绩

### 注意事项

1. **订阅等级要求**：战绩订阅功能需要**专业版（pro）**订阅等级，免费用户无法使用
2. **订阅前提**：必须先通过 HTTP API 创建订阅，WebSocket 才能接收推送
3. **多账号绑定**：系统支持一个用户绑定多个游戏账号，会轮询所有账号的战绩
4. **消息去重**：建议根据 `RoomId` + `dtEventTime` 去重
5. **连接保活**：建议实现心跳和自动重连机制
5a. **推送延迟**（基于智能查询策略）：
   - **少量账号（≤60）**：0-65 秒（顺序查询分散在 60秒 + 推送检查 5秒）
   - **大量账号（>60）**：0-65 秒（分批并发分散在 60秒 + 推送检查 5秒）
   - 你的账号在队列中的位置越靠前，收到推送越快
   - 两种模式延迟相同（不再查询房间信息）
6. **权限验证**：需要有效的 API Key 和 clientID，且 API Key 对应的用户必须是 pro 订阅等级
7. **数据纯净性**：推送的 `record` 对象**仅包含个人战绩数据**，不包含队友和房间信息
8. **权限不足错误**：如果订阅等级不足，会收到错误码 `3011` 的错误消息

---

## 广播通知系统

### 概述

广播通知系统允许**管理员**通过 WebSocket 向所有在线用户或特定频道发送系统通知。普通用户只能接收通知，无法发送。

#### 1. 订阅通知频道

**客户端发送**：
```json
{
  "type": "subscribe",
  "channel": "notification:broadcast"
}
```

**服务器响应**：
```json
{
  "type": "subscribed",
  "data": {
    "channel": "notification:broadcast",
    "message": "订阅成功"
  },
  "timestamp": 1764147123456
}
```

**说明**：
- ✅ **必须先订阅**：只有订阅了频道的用户才能接收该频道的广播通知
- ✅ **任何人可订阅**：`notification:broadcast` 频道无权限限制（`requiredTier: 'none'`）
- ✅ **多频道订阅**：可以订阅多个公共频道（如 `channel:lobby`），全频道广播时都能收到
- ❌ **未订阅无推送**：如果没有订阅频道，即使管理员发送广播，也不会收到任何消息

#### 2. 管理员发送通知

**单频道广播**：
```json
{
  "type": "notification_send",
  "title": "系统维护通知",
  "content": "系统将于今晚 22:00 进行维护，预计持续 1 小时",
  "priority": "high",
  "notificationType": "warning",
  "targetChannels": "notification:broadcast"
}
```

**多频道广播**：
```json
{
  "type": "notification_send",
  "title": "活动通知",
  "content": "新活动已上线，快来参加",
  "priority": "normal",
  "notificationType": "info",
  "targetChannels": ["notification:broadcast", "channel:lobby-1", "channel:trade"]
}
```

**频道名格式说明**：
- ⚠️ **必须使用完整频道名**（包含命名空间前缀）
- ✅ 正确示例：`channel:lobby-1`, `notification:broadcast`, `price:gun`
- ❌ 错误示例：`lobby-1`（缺少 `channel:` 前缀）

**可用频道列表**：
- 广播通知：`notification:broadcast`
- 聊天子频道：`channel:lobby-1` ~ `channel:lobby-10`
- 其他频道：`channel:trade`, `channel:help`, `channel:chat`
- 价格频道：`price:gun`, `price:protect`, `price:ammo` 等
- 战绩频道：`record:sol_{platformID}`, `record:mp_{platformID}`
- 房间频道：`room:chat_{roomId}`, `room:status_{roomId}` 等

**全频道广播**：
```json
{
  "type": "notification_send",
  "title": "紧急公告",
  "content": "服务器即将重启，请保存数据",
  "priority": "urgent",
  "notificationType": "error",
  "targetChannels": "all"
}
```

### 消息格式

#### 发送参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `type` | string | ✅ | - | 固定为 `notification_send` |
| `title` | string | ✅ | - | 通知标题 |
| `content` | string | ✅ | - | 通知内容 |
| `priority` | string | ❌ | `normal` | 优先级：`low`, `normal`, `high`, `urgent` |
| `notificationType` | string | ❌ | `info` | 通知类型：`info`, `success`, `warning`, `error`, `announcement` |
| `targetChannels` | string/array | ❌ | `["notification:broadcast"]` | 目标频道：字符串（单个）、数组（多个）、或 `"all"`（全频道） |

#### 3. 成功响应（管理员接收）

**服务器响应**：
```json
{
  "type": "message",
  "data": {
    "messageType": "notification_send_success",
    "success": true,
    "message": "广播通知发送成功",
    "notification": {
      "id": "notif_1764147123456_abc123",
      "title": "系统维护通知",
      "content": "系统将于今晚 22:00 进行维护",
      "priority": "high",
      "type": "warning",
      "timestamp": 1764147123456,
      "sender": "system"
    },
    "recipientCount": 156,
    "channelsSent": [
      "notification:broadcast",
      "channel:lobby",
      "channel:trade",
      "price:gun"
    ],
    "isGlobalBroadcast": true
  },
  "timestamp": 1764147123456
}
```

**字段说明**：
- `messageType` - 消息类型标识：`notification_send_success`
- `success` - 发送是否成功
- `message` - 成功提示信息
- `notification` - 完整的通知对象
- `recipientCount` - 实际接收人数（所有频道订阅者总数）
- `channelsSent` - 实际发送到的频道列表（有订阅者的频道）
- `isGlobalBroadcast` - 是否全频道广播（`targetChannels` 为 `"all"`）

#### 4. 广播消息（所有订阅者接收）

**服务器推送**：
```json
{
  "type": "message",
  "channel": "notification:broadcast",
  "data": {
    "messageType": "notification_broadcast",
    "notification": {
      "id": "notif_1764147123456_abc123",
      "title": "系统维护通知",
      "content": "系统将于今晚 22:00 进行维护，预计持续 1 小时",
      "priority": "high",
      "type": "warning",
      "timestamp": 1764147123456,
      "sender": "system"
    }
  },
  "timestamp": 1764147123456
}
```

**字段说明**：
- `type` - 外层消息类型：`message`（表示这是一条推送消息）
- `channel` - 当前频道名称
- `messageType` - 业务消息类型：`notification_broadcast`
- `notification.id` - 通知唯一标识（可用于去重）
- `notification.type` - 通知类型（与发送时的 `notificationType` 一致）
- `notification.sender` - 发送者标识，固定为 `system`

#### 5. 错误响应

**服务器响应**：
```json
{
  "type": "error",
  "data": {
    "code": 3004,
    "message": "缺少必填字段：title 或 content",
    "messageType": "notification_send_error"
  },
  "timestamp": 1764147123456
}
```

**错误码说明**：

| 错误码 | 说明 | 触发条件 | 响应字段 |
|--------|------|---------|---------|
| `3004` | 参数错误 | 缺少必填字段 `title` 或 `content` | - |
| `3010` | 权限不足 | 非管理员用户尝试发送通知 | - |
| `4004` | 频道不存在 | 指定的频道未注册或不存在 | `invalidChannels`（无效频道列表）、`hint`（格式提示） |
| `9000` | 系统错误 | 服务器内部错误 | `error`（错误详情） |

**错误码 4004 示例**：
```json
{
  "type": "error",
  "data": {
    "code": 4004,
    "message": "部分频道不存在或未注册",
    "messageType": "notification_send_error",
    "invalidChannels": ["lobby-1", "trade"],
    "hint": "频道名格式示例：channel:lobby-1, notification:broadcast, price:gun 等"
  },
  "timestamp": 1764221893255
}
```

**说明**：
- 只有**有订阅者**的频道才会实际发送（空频道会被跳过）
- 全频道广播会遍历 `wsManager.channels` 中的所有频道
- 子频道（如 `lobby-1`）会被独立处理，每个子频道的订阅者都会收到通知

---

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
  "token": "6bb29277-4d2e-461b-86b4-c7c781c52352",
  "qr_image": "data:image/png;base64,...",
  "expire": 1703123456789
}
```



#### 2. 轮询扫码状态
```http
GET /login/qq/status?token=6bb29277-4d2e-461b-86b4-c7c781c52352
```

**状态码说明:**
- `1`: 等待扫码
- `2`: 已扫码待确认
- `0`: 授权成功
- `-2`: 二维码已过期
- `-3`: 安全风控拦截

#### 3. 查看token状态
```http
GET /login/qq/token?token=frameworkToken
```

**状态码说明:**
- `0`: token有效
- `1`: token已过期
- `2`: token不存在
- `-1`: 查询失败/缺少参数

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
GET /login/qq/ck/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**状态码说明:**
- `0`: 已登录
- `-2`: frameworkToken无效或已过期

### QQ Cookie 换 Token

#### 1. Cookie 直接换 Token
```http
POST /login/qq/cookie-exchange
```

**请求体（application/json）：**
```json
{
  "cookie": "p_skey=xxx; pt2gguin=o1234567890; uin=o1234567890; skey=xxx; ..."
}
```

**参数说明：**
- `cookie`: 完整的QQ Cookie字符串（**必填**）
  - **必需字段**：`p_skey`（用于计算g_tk的关键Cookie）等从QQ扫码登陆里获取的ck数据

**响应示例（成功）：**
```json
{
  "code": 0,
  "msg": "Cookie换Token成功",
  "frameworkToken": "550e8400-e29b-41d4-a716-446655440000",
  "qq": "1234567890",
  "openId": "1A2B3C4D5E6F...",
  "expire": 1733123456789
}
```

**响应示例（失败）：**
```json
{
  "code": -1,
  "msg": "Cookie中缺少必需的p_skey字段"
}
```

或

```json
{
  "code": -1,
  "msg": "OAuth授权失败：未获取到重定向URL，Cookie可能已过期"
}
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

**状态码说明:**
- `0`: 已完成/已授权
- `1`: 等待OAuth授权
- `2`: 正在处理授权
- `-2`: OAuth会话已过期
- `-1`: OAuth授权失败

### QQ 安全登录

#### 1. 获取安全登录二维码
```http
GET /login/qqsafe/qr
```

#### 2. 轮询安全登录状态
```http
GET /login/qqsafe/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**状态码说明:**
- `0`: 已登录/授权成功
- `1`: 等待扫码
- `2`: 已扫码待确认
- `-2`: frameworkToken无效或已过期

#### 3. 查看安全登录token状态
```http
GET /login/qqsafe/token?token=frameworkToken
```

**状态码说明:**
- `0`: token有效
- `1`: token已过期
- `2`: token不存在
- `-1`: 查询失败/缺少参数

#### 4. 安全登录封禁检查
```http
GET /login/qqsafe/ban
```

**参数说明**

- `frameworkToken`

### 微信扫码登录

#### 1. 获取二维码
```http
GET /login/wechat/qr
```

#### 2. 轮询扫码状态
```http
GET /login/wechat/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**状态码说明:**
- `0`: 已登录/授权成功
- `1`: 等待扫码
- `2`: 已扫码待确认
- `-2`: frameworkToken无效或已过期

#### 3. 查看token状态
```http
GET /login/wechat/token?token=frameworkToken
```

**状态码说明:**
- `0`: token有效
- `1`: token已过期
- `2`: token不存在
- `-1`: 查询失败/缺少参数

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

**状态码说明:**
- `0`: 已完成/已授权
- `1`: 等待OAuth授权
- `2`: 正在处理授权
- `-2`: OAuth会话已过期
- `-1`: OAuth授权失败

### WeGame 登录

#### 1. 获取WeGame二维码
```http
GET /login/wegame/qr
```

#### 2. 轮询WeGame扫码状态
```http
GET /login/wegame/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**状态码说明:**
- `0`: 已登录/授权成功
- `1`: 等待扫码
- `2`: 已扫码待确认
- `-2`: frameworkToken无效或已过期

#### 3. 查看WeGame token状态
```http
GET /login/wegame/token?token=frameworkToken
```

**状态码说明:**
- `0`: token有效
- `1`: token已过期
- `2`: token不存在
- `-1`: 查询失败/缺少参数

#### 4. 刷新Wegame登录状态
```http
GET /df/wegame/refresh?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**参数说明**
- `frameworkToken`：登陆获取到的框架token

**响应示例：**
```json
{
    "code": 0,
    "msg": "token刷新成功",
    "data": {
        "frameworkToken": "xxxxx-xxxxx-xxxxx-xxxxx",
        "tgpId": "18824*****",
        "updatedAt": "2025-12-01T10:58:16.104Z"
    }
}
```

### WeGame 微信登录

#### 1. 获取WeGame微信二维码
```http
GET /login/wegame/wechat/qr
```

#### 2. 轮询WeGame微信扫码状态
```http
GET /login/wegame/wechat/status?frameworkToken=xxxxx-xxxxx-xxxxx-xxxxx
```

**状态码说明:**
- `0`: 已登录/授权成功
- `1`: 等待扫码
- `2`: 已扫码待确认
- `-2`: frameworkToken无效或已过期

#### 3. 查看WeGame微信token状态
```http
GET /login/wegame/wechat/token?token=frameworkToken
```

**状态码说明:**
- `0`: token有效
- `1`: token已过期
- `2`: token不存在
- `-1`: 查询失败/缺少参数

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
  "code": 2,
  "msg": "token不存在",
  "frameworkToken": "invalid-token"
}
```

**Token已过期响应：**
```json
{
  "code": 1,
  "msg": "token已过期",
  "frameworkToken": "expired-token"
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
- platformId：用户ID（必填）
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

## 房间 WebSocket 聊天（RoomV2）

房间 WebSocket 功能提供实时聊天、打字状态、频道订阅等功能。

### 消息类型

#### 1. 房间聊天 (room_chat)

发送房间消息（仅房间成员可发送）：

```json
{
  "type": "room_chat",
  "roomId": "12345678",
  "frameworkToken": "your-framework-token",
  "content": "消息内容"
}
```

**参数说明**：
- `roomId`：房间ID（必填）
- `frameworkToken`：用户身份token（必填）
- `content`：消息内容（必填，最多500字符）

**发送响应 (room_chat_response)**：

成功：
```json
{
  "type": "room_chat_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "消息发送成功"
  },
  "timestamp": 1700000000000
}
```

失败（频率限制）：
```json
{
  "type": "room_chat_response",
  "data": {
    "success": false,
    "code": 429,
    "message": "发送消息过快，请稍后再试",
    "rateLimit": {
      "remaining": 0,
      "limit": 10,
      "resetTime": 1700000060000
    }
  },
  "timestamp": 1700000000000
}
```

失败（权限错误）：
```json
{
  "type": "room_chat_response",
  "data": {
    "success": false,
    "code": 403,
    "message": "您不在该房间中"
  },
  "timestamp": 1700000000000
}
```

失败（长度限制）：
```json
{
  "type": "room_chat_response",
  "data": {
    "success": false,
    "code": 400,
    "message": "❌ 消息过长！房间消息最多500字符，请缩短后重试。"
  },
  "timestamp": 1700000000000
}
```

**消息推送 (room_chat_message)**：

房间内所有成员会收到新消息推送：
```json
{
  "type": "room_chat_message",
  "data": {
    "messageId": "uuid-v4",
    "roomId": "12345678",
    "frameworkToken": "sender-token",
    "nickname": "发送者昵称",
    "avatar": "头像URL",
    "content": "消息内容",
    "type": "text",
    "timestamp": 1700000000000
  },
  "timestamp": 1700000000000
}
```

#### 2. 打字状态 (room_typing)

发送打字状态（仅房间成员）：

```json
{
  "type": "room_typing",
  "roomId": "12345678",
  "frameworkToken": "your-framework-token",
  "isTyping": true
}
```

**状态推送 (room_typing_status)**：

房间内其他成员会收到打字状态推送：
```json
{
  "type": "room_typing_status",
  "data": {
    "frameworkToken": "user-token",
    "nickname": "用户昵称",
    "isTyping": true,
    "timestamp": 1700000000000
  },
  "timestamp": 1700000000000
}
```

#### 3. 订阅房间 (room_subscribe)

订阅房间频道以接收消息和状态推送：

```json
{
  "type": "room_subscribe",
  "roomId": "12345678",
  "frameworkToken": "your-framework-token"
}
```

订阅成功后会：
1. 返回订阅成功响应
2. 推送最近50条历史消息（时间正序）
3. 开始接收实时消息和状态更新

### 频率限制

- **房间消息**：10条/分钟（每房间独立计算）
- **打字状态**：无限制（但有5秒过期时间）

### 安全特性

1. **权限验证**：只有房间成员可以发送消息和查看聊天
2. **内容安全**：
   - HTML标签转义（防止XSS）
   - 长度限制：500字符
   - 控制字符过滤
   - 保留换行符（`\n`）
3. **类型验证**：严格检查所有参数类型
4. **频率限制**：防止消息轰炸

### WebSocket 频道

房间相关频道（自动订阅）：
- `room:chat_{roomId}`：房间聊天消息
- `room:status_{roomId}`：房间状态变化
- `room:typing_{roomId}`：打字状态
- `room:lobby`：房间大厅（所有房间更新）

## 公共频道聊天（Channel）

公共频道提供全局聊天功能，支持多人在线交流。

### 可用频道

| 频道ID | 说明 | 特点 |
|--------|------|------|
| `lobby` | 大厅频道 | 自动分流（lobby-1 ~ lobby-10），每个子频道最多100人 |
| `trade` | 交易频道 | 物品交易讨论 |
| `help` | 求助频道 | 游戏求助和答疑 |
| `chat` | 闲聊频道 | 自由聊天 |

### 消息类型

#### 1. 频道分配 (channel_allocate)

请求分配子频道（仅 `lobby` 需要）：

```json
{
  "type": "channel_allocate",
  "baseChannel": "lobby"
}
```

**分配响应 (channel_allocate_response)**：

```json
{
  "type": "channel_allocate_response",
  "data": {
    "success": true,
    "code": 0,
    "allocatedChannel": "lobby-3",
    "userCount": 45,
    "maxUsers": 100
  },
  "timestamp": 1700000000000
}
```

#### 2. 频道消息 (channel_chat)

发送频道消息：

```json
{
  "type": "channel_chat",
  "channelId": "lobby-3",
  "clientID": "user-mongo-id",
  "platformID": "platform-id",
  "frameworkToken": "framework-token",
  "nickname": "自定义昵称",
  "content": "消息内容"
}
```

**参数说明**：
- `channelId`：频道ID（必填，如 `lobby-3`）
- `clientID`：用户MongoDB ID（必填）
- `platformID`：平台用户ID（可选，clientID 或 platformID 至少一个）
- `frameworkToken`：框架token（可选）
- `nickname`：自定义昵称（可选，未提供则使用账号昵称）
- `content`：消息内容（必填，最多1000字符）

**发送响应 (channel_chat_response)**：

成功：
```json
{
  "type": "channel_chat_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "消息发送成功",
    "rateLimit": {
      "remaining": 4,
      "limit": 5,
      "resetTime": 1700000060000
    }
  },
  "timestamp": 1700000000000
}
```

失败（频率限制）：
```json
{
  "type": "channel_chat_response",
  "data": {
    "success": false,
    "code": 429,
    "message": "🚫 发送过快！每分钟最多5条消息",
    "rateLimit": {
      "remaining": 0,
      "limit": 5,
      "resetTime": 1700000060000,
      "resetIn": 45
    }
  },
  "timestamp": 1700000000000
}
```

失败（未授权）：
```json
{
  "type": "channel_chat_response",
  "data": {
    "success": false,
    "code": 401,
    "message": "🔒 未授权：账号未注册或邮箱未验证"
  },
  "timestamp": 1700000000000
}
```

失败（长度限制）：
```json
{
  "type": "channel_chat_response",
  "data": {
    "success": false,
    "code": 400,
    "message": "❌ 消息过长！频道消息最多1000字符"
  },
  "timestamp": 1700000000000
}
```

**消息推送 (channel_chat_message)**：

频道内所有订阅者会收到新消息推送：
```json
{
  "type": "channel_chat_message",
  "data": {
    "messageId": "uuid-v4",
    "channelId": "lobby-3",
    "baseChannel": "lobby",
    "clientID": "user-id",
    "platformID": "platform-id",
    "nickname": "用户昵称",
    "avatar": "头像URL",
    "content": "消息内容",
    "type": "text",
    "timestamp": 1700000000000
  },
  "timestamp": 1700000000000
}
```

#### 3. 订阅频道 (subscribe)

订阅公共频道：

```json
{
  "type": "subscribe",
  "channel": "channel:lobby-3"
}
```

订阅成功后会：
1. 返回订阅成功响应
2. 推送最近50条历史消息（从MongoDB，时间正序）
3. 开始接收实时消息

#### 4. 切换子频道

先取消当前频道订阅，再分配新频道：

```json
{
  "type": "unsubscribe",
  "channel": "channel:lobby-3"
}
```

```json
{
  "type": "channel_allocate",
  "baseChannel": "lobby"
}
```

### 频率限制

- **频道消息**：5条/分钟（每用户独立计算）
- **频道切换**：10秒冷却时间

### 子频道分配策略

对于 `lobby` 频道：
1. 检查 `lobby-1` ~ `lobby-10` 的在线人数
2. 优先分配人数最少的子频道
3. 单个子频道最多100人
4. 人数 < 50 时快速返回（优化）

### 安全特性

1. **用户验证**：必须是已注册且邮箱已验证的用户
2. **内容安全**：
   - HTML标签转义（防止XSS）
   - 长度限制：1000字符
   - 控制字符过滤
   - 保留换行符（`\n`）
3. **类型验证**：严格检查所有参数类型
4. **频率限制**：防止消息轰炸
5. **断线清理**：自动清理断开连接用户的订阅记录

### 数据存储

#### Redis（短期缓存）
- `channel:messages:{channelId}`：最新50条消息（24小时TTL）
- `channel:subscribers:channel:{channelId}`：订阅人数统计（1小时TTL）
- `channel:message:rate:{clientID}`：消息频率限制
- `channel:switch:cooldown:{clientId}`：频道切换冷却

#### MongoDB（长期存储）
- **集合**：`channel_messages`
- **保留期**：30天（自动过期）
- **索引**：channelId、timestamp、clientID、baseChannel、messageId
- **同步**：每5分钟从Redis同步到MongoDB

### WebSocket 频道

公共频道（需要订阅）：
- `channel:lobby-1` ~ `channel:lobby-10`：大厅子频道
- `channel:trade`：交易频道
- `channel:help`：求助频道
- `channel:chat`：闲聊频道

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

## 物品价值接口（TapTap战备值）

### 概述

物品价值系统从TapTap官方接口获取装备、配件等物品的战备值数据，提供实时价值查询和历史趋势分析。

**数据来源**: TapTap官方战备值接口（每5分钟自动同步）

**支持分类**:
- 枪械（tab=2）
- 配件（tab=3）
- 装备-头盔（tab=4）
- 装备-护甲（tab=5）
- 装备-胸挂（tab=6）
- 装备-背包（tab=7）

### 管理员接口

**权限说明**: 所有管理员接口都需要提供 `clientID` 参数进行管理员身份验证

#### 1. 添加TapTap Session
```http
POST /admin/taptap-session/add
```

**请求体（application/json）**:
```json
{
  "clientID": "your-admin-client-id",
  "sessionToken": "your-taptap-session-token",
  "description": "Session描述（可选）"
}
```

**参数说明**:
- `clientID`: 管理员的客户端ID（必填，用于验证管理员权限）
- `sessionToken`: TapTap Session Token（必填）
- `description`: Session描述（可选）

**响应示例**:
```json
{
  "code": "0",
  "message": "添加成功",
  "data": {
    "sessionToken": "your-token",
    "isActive": true,
    "createdAt": "2025-11-03T22:15:20.000Z",
    "updatedAt": "2025-11-03T22:15:20.000Z",
    "description": "Session描述",
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

#### 2. 查看Session列表
```http
GET /admin/taptap-session/list?clientID=your-admin-client-id
```

**参数说明**:
- `clientID`: 管理员的客户端ID（必填，query参数）

**响应示例**:
```json
{
  "code": "0",
  "message": "获取成功",
  "data": {
    "sessions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "sessionToken": "12345678...",
        "isActive": true,
        "createdAt": "2025-11-03T22:15:20.000Z",
        "updatedAt": "2025-11-03T22:15:20.000Z",
        "lastUsedAt": "2025-11-03T22:20:00.000Z",
        "description": "Session描述"
      }
    ],
    "total": 5,
    "active": 3
  }
}
```

#### 3. 删除Session
```http
DELETE /admin/taptap-session/:id?clientID=your-admin-client-id
```

**参数说明**:
- `id`: Session的MongoDB ID（必填，路径参数）
- `clientID`: 管理员的客户端ID（必填，query参数或body参数）

**响应示例**:
```json
{
  "code": "0",
  "message": "删除成功"
}
```

#### 4. 切换Session状态
```http
PUT /admin/taptap-session/:id/toggle
```

**请求体（application/json）或Query参数**:
```json
{
  "clientID": "your-admin-client-id"
}
```

**参数说明**:
- `id`: Session的MongoDB ID（必填，路径参数）
- `clientID`: 管理员的客户端ID（必填，body或query参数）

**响应示例**:
```json
{
  "code": "0",
  "message": "状态切换成功",
  "data": {
    "isActive": false
  }
}
```

#### 5. 手动触发同步
```http
POST /admin/object-value/sync
```

**请求体（application/json）或Query参数**:
```json
{
  "clientID": "your-admin-client-id"
}
```

**参数说明**:
- `clientID`: 管理员的客户端ID（必填，body或query参数）

**响应示例**:
```json
{
  "code": "0",
  "message": "同步任务已启动，请稍后查看结果"
}
```

**错误响应示例**:
```json
{
  "code": "1001",
  "message": "缺少必要参数: clientID"
}
```

```json
{
  "code": "1003",
  "message": "需要管理员权限"
}
```

### 查询接口

#### 1. 获取物品价值列表
```http
GET /df/object/value/list?sort=value&order=desc&limit=100&page=1
```

**参数说明**:
- `sort`: 排序字段（可选，默认value）
  - `value`: 按价值排序
  - `sell_price`: 按售价排序
  - `diff`: 按差值排序
  - `lastUpdated`: 按更新时间排序
  - `grade`: 按等级排序
- `order`: 排序方向（可选，默认desc）
  - `asc`: 升序
  - `desc`: 降序
- `limit`: 返回数量（可选，默认100，最大500）
- `page`: 页码（可选，默认1）
- `id`/`objectid`/`objectID`: 物品ID过滤（可选，三种参数名均支持，大小写不敏感）
  - 支持单个ID或逗号分隔的多个ID
  - 支持带后缀的objectID（如 "110100060021-1"）
  - **向下兼容**：查询baseObjectID（如 "110100060021"）会匹配所有耐久度变体（-1/-2/-3）
- `name`: 物品名称过滤（可选，模糊搜索）
- `minValue`/`maxValue`: 价值范围过滤（可选）
- `minSell`/`maxSell`: 售价范围过滤（可选）
- `minDiff`/`maxDiff`: 差值范围过滤（可选）
- `minGrade`/`maxGrade`: 等级范围过滤（可选）
- `days`: 查询最近N天的数据（可选，默认全部）

**响应示例**:
```json
{
  "code": "0",
  "message": "获取成功",
  "data": {
    "list": [
      {
        "objectID": "110100060021-1",
        "baseObjectID": 110100060021,
        "objectName": "H70 精英头盔",
        "previewPic": "图片URL", //此处使用的是taptap的cdn的，可以换为腾讯的
        "grade": 3,
        "primaryClass": "protect",
        "secondClass": "helmet",
        "dataType": "protect",
        "condition": "全新",
        "latestPrice": 614447,
        "sellPrice": 500000,
        "diff": 114447,
        "timestamp": 1762208120,
        "lastUpdated": 1762208120,
        "historyCount": 720
      }
    ],
    "total": 150,
    "sort": "value",
    "order": "desc",
    "page": 1,
    "pageSize": 100
  }
}
```

#### 2. 搜索物品价值
```http
GET /df/object/value/search?name=H70
```

或

```http
GET /df/object/value/search?id=110100060021-1
```

或

```http
GET /df/object/value/search?objectID=13120000286
```

**参数说明**:
- `name`: 物品名称（模糊搜索）
- `id`/`objectid`/`objectID`: 物品ID（三种参数名均支持，大小写不敏感）
  - 支持单个ID或逗号分隔的多个ID
  - 支持带后缀的objectID（如 "110100060021-1"）
  - **向下兼容**：查询baseObjectID（如 "110100060021"）会匹配所有耐久度变体（-1/-2/-3）

**响应示例**:
```json
{
  "code": "0",
  "message": "搜索成功",
  "data": {
    "list": [
      {
        "objectID": "110100060021-1",
        "baseObjectID": 110100060021,
        "objectName": "H70 精英头盔",
        "previewPic": "图片URL",
        "grade": 3,
        "primaryClass": "protect",
        "secondClass": "helmet",
        "dataType": "protect",
        "condition": "全新",
        "latestPrice": 614447,
        "sellPrice": 500000,
        "diff": 114447,
        "timestamp": 1762208120,
        "lastUpdated": 1762208120,
        "historyCount": 720
      }
    ],
    "total": 1
  }
}
```

#### 3. 查询物品价值历史
```http
GET /df/object/value/history?id=110100060021-1&days=30
```

或

```http
GET /df/object/value/history?objectID=110100060021&days=30
```

**参数说明**:
- `id`/`objectid`/`objectID`: 物品ID（必填，三种参数名均支持，大小写不敏感）
  - 支持单个ID或逗号分隔的多个ID
  - 支持带后缀的objectID（如 "110100060021-1"）
  - **向下兼容**：查询baseObjectID（如 "110100060021"）会匹配所有耐久度变体（-1/-2/-3）
- `days`: 查询天数（可选，默认30天，范围1-365天）

**响应示例（单个物品）**:
```json
{
  "code": "0",
  "message": "查询成功",
  "data": {
    "objectID": "110100060021-1",
    "baseObjectID": 110100060021,
    "objectName": "H70 精英头盔",
    "previewPic": "图片URL",
    "grade": 3,
    "primaryClass": "protect",
    "secondClass": "helmet",
    "dataType": "protect",
    "condition": "全新",
    "history": [
      {
        "value": 614447,
        "sellPrice": 500000,
        "diff": 114447,
        "timestamp": 1762208120,
        "submittedAt": "2025-11-03T22:15:20.000Z"
      }
    ],
    "lastUpdated": 1762208120,
    "queryDays": 30,
    "dataPoints": 720
  }
}
```

**响应示例（多个物品）**:
```json
{
  "code": "0",
  "message": "查询成功",
  "data": {
    "items": [
      {
        "objectID": "110100060021-1",
        "baseObjectID": 110100060021,
        "objectName": "H70 精英头盔",
        "history": [...],
        "lastUpdated": 1762208120,
        "queryDays": 30,
        "dataPoints": 720
      }
    ],
    "totalCount": 2
  }
}
```

### 装备耐久度ID说明

**耐久度区分规则**：
- **仅头盔(tab=4)和护甲(tab=5)有耐久度区分**
- **其他物品（枪械、配件、胸挂、背包）**：`objectID = baseObjectID`（不带后缀）

**头盔/护甲 objectID格式**：`{baseObjectID}-{suffix}`
- 后缀 `-1`：全新
- 后缀 `-2`：几乎全新
- 后缀 `-3`：破损

**示例**:

**头盔/护甲（有耐久度）**：
- `110100060021-1`：H70 精英头盔（全新）
- `110100060021-2`：H70 精英头盔（几乎全新）
- `110100060021-3`：H70 精英头盔（破损）

**枪械/配件/胸挂/背包（无耐久度）**：
- `13120000286`：AK-12（objectID = baseObjectID）
- `14030000001`：红点瞄准镜（objectID = baseObjectID）

**查询兼容性**: 
- **参数名兼容**：`id`、`objectid`、`objectID` 三种参数名均支持（大小写不敏感）
- **向下兼容**：查询 baseObjectID（如 `110100060021`）会自动匹配所有耐久度变体（-1/-2/-3）
- **精确查询**：查询带后缀的 objectID（如 `110100060021-1`）只返回该耐久度的数据
- **物品名称**：头盔/护甲的名称会自动包含耐久度信息
- **分类字段**：
  - 枪械/配件：`secondClass` 为空字符串
  - 装备类：`secondClass` 显示具体分类（helmet/armor/chest/bag）

**查询示例**：
```bash
# 查询枪械（不带后缀）
GET /df/object/value/search?id=13120000286
# 返回：objectID="13120000286", secondClass=""

# 查询头盔（向下兼容，返回所有耐久度）
GET /df/object/value/search?objectID=110100060021
# 返回：
# - objectID="110100060021-1", condition="全新", secondClass="helmet"
# - objectID="110100060021-2", condition="几乎全新", secondClass="helmet"
# - objectID="110100060021-3", condition="破损", secondClass="helmet"

# 精确查询特定耐久度
GET /df/object/value/search?objectid=110100060021-1
# 返回：objectID="110100060021-1", condition="全新", secondClass="helmet"
```

### 数据更新机制

- **轮询间隔**: 每5分钟自动同步一次
- **数据保留**: 最近365天的历史数据
- **并发策略**: 支持多个TapTap Session并发请求，提高数据获取速度

### 注意事项

1. **管理员权限**: Session管理和手动同步需要管理员权限
2. **数据来源**: 所有数据来自TapTap官方接口，准确性由官方保证
3. **ID格式**: 
   - 头盔/护甲：使用带后缀的objectID（如 `110100060021-1`）
   - 其他物品：使用baseObjectID（如 `13120000286`）
   - 查询时支持向下兼容（查询baseObjectID会匹配所有耐久度变体）
4. **使用**：数据来自TapTap抓包，所以请合理使用，避免造成不良影响
5. **耐久度区分**: 
   - 只有头盔(tab=4)和护甲(tab=5)有耐久度区分
   - 其他物品不区分耐久度（objectID = baseObjectID）
   - 查询时支持精确匹配和模糊匹配
6. **参数兼容**: 所有查询接口支持 `id`/`objectid`/`objectID` 三种参数名（大小写不敏感）
7. **分类字段**: 
   - 枪械/配件：`secondClass` 为空字符串
   - 装备类：`secondClass` 显示具体分类（helmet/armor/chest/bag）

---

## 价格接口

### 获取物品历史均价（V1）
```http
GET /df/object/price/history/v1?id=12345
```

**参数说明:**
- `id`: 物品ID (必填，单个ID)

### 获取物品历史价格（V2 - 半小时精度）
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

### 提交实时价格数据（V3 - OCR识别）
```http
POST /df/object/price/submit/v3
```

**认证方式**: X-Submission-Secret（提交密钥）

**请求头**:
- `Content-Type: application/json`
- `X-Submission-Secret: 3872bd6a1739347faf07f7c80124f0a981b13e1ee88256a71d03475d7fe0d136`

**请求体示例（装备类）**:
```json
{
  "timestamp": 1762208120,
  "total_items": 171,
  "type": "protect",
  "items": [
    {
      "item_name": "H70 精英头盔（全新）",
      "original_item_name": "H70 精英头盔",
      "price": "614,447",
      "original_price": "614,447",
      "condition": "全新",
      "secondary_type": "头盔",
      "timestamp": 1762208120
    }
  ]
}
```

**请求体示例（弹药类）**:
```json
{
  "timestamp": 1762208120,
  "total_items": 90,
  "type": "ammo",
  "items": [
    {
      "item_name": ".300BLK (等级5)",
      "original_item_name": ".300 BLK",
      "price": "4,593",
      "original_price": "4,593",
      "ammo_level": "等级5",
      "secondary_type": ".300 BLK",
      "timestamp": 1762208120
    }
  ]
}
```

**参数说明:**
- `timestamp`: 数据采集时间戳（秒级，10位，必填）
- `total_items`: 总条目数
- `type`: 数据类型（必填）
  - `gun`: 枪械
  - `protect`: 装备
  - `acc`: 配件
  - `ammo`: 弹药
  - `props`: 收集品
  - `consume`: 消耗品
  - `key`: 钥匙
- `items`: 价格数据数组（必填）
  - `item_name`: 物品名称（必填）
  - `original_item_name`: 原始物品名称（必填）
  - `price`: 价格字符串（必填，可带逗号）
  - `original_price`: 原始价格字符串（必填）
  - `condition`: 装备耐久度状态（装备类可选：全新/几乎全新/破损）
  - `ammo_level`: 弹药等级（弹药类可选：等级1/等级2/等级3/等级4/等级5/等级6）
  - `secondary_type`: 二级分类（可选，如：头盔、步枪、冲锋枪、长弓溪谷、.300 BLK等）
  - `timestamp`: 单条数据时间戳（秒级，可选，默认使用批次timestamp）

**响应示例（成功）:**
```json
{
  "success": true,
  "code": "0",
  "message": "价格数据提交成功",
  "data": {
    "type": "protect",
    "timestamp": 1762208120,
    "timestampISO": "2025-11-03T22:15:20.000Z",
    "totalSubmitted": 171,
    "matched": 171,
    "unmatched": 0,
    "saved": 171,
    "failed": 0,
    "unmatchedItems": [],
    "processingTime": 325
  }
}
```

**响应示例（密钥错误）:**
```json
{
  "success": false,
  "code": "INVALID_SECRET",
  "message": "密钥认证失败，无权提交数据"
}
```

**功能说明**:
- 接收OCR系统实时提交的价格数据
- 自动匹配本地物品数据库，关联物品ID
- 支持装备耐久度状态（全新、几乎全新、破损等）
- 支持弹药等级状态（等级1-6）
- 自动过滤价格为0的无效数据
- 防止重复提交（相同时间戳去重）
- 自动清理超过365天的历史数据
- 提交成功后自动清除相关类型的Redis缓存

### 通过 WebSocket 提交价格数据（V3 - 实时推送）

**连接地址**: `ws://host:port/ws?key=your-connection-secret&type=price_submit`

**连接参数说明**:
- `key`: WebSocket 连接密钥（必需，如果服务器启用了 `requireAuth`）
- `type`: 连接类型，固定为 `price_submit`

**认证与发送流程**
1) 连接成功后先发送提交密钥认证：
```json
{ "type": "auth_submit", "secret": "your-submission-secret-key" }
```
服务端返回（成功）：
```json
{ 
  "type": "auth_submit_response", 
  "data": { 
    "success": true, 
    "message": "提交密钥认证成功" 
  }, 
  "timestamp": 1762208120 
}
```

服务端返回（失败）：
```json
{
  "type": "auth_submit_response",
  "data": {
    "success": false,
    "code": 5001,
    "message": "提交密钥无效"
  },
  "timestamp": 1762208120
}
```

**消息格式**（直接发送 POST 接口的数据格式，无需包装）:
```json
{
  "timestamp": 1762208120,
  "total_items": 171,
  "type": "protect",
  "items": [
    {
      "item_name": "H70 精英头盔（全新）",
      "original_item_name": "H70 精英头盔",
      "price": "614,447",
      "original_price": "614,447",
      "condition": "全新",
      "secondary_type": "头盔",
      "timestamp": 1762208120
    }
  ]
}
```

**参数说明**:
- 消息格式与 POST 接口的请求体完全相同
- `timestamp`: 数据采集时间戳（秒级，10位，必填）
- `type`: 数据类型（gun/protect/acc/ammo/props/consume/key）
- `items`: 价格数据数组（格式与 POST 接口相同）

**响应消息格式（成功）**:
```json
{
  "type": "price_submit_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "价格数据提交成功",
    "type": "protect",
    "timestamp": 1762208120,
    "timestampISO": "2025-11-03T22:15:20.000Z",
    "totalSubmitted": 171,
    "matched": 171,
    "unmatched": 0,
    "saved": 171,
    "failed": 0,
    "unmatchedItems": [],
    "processingTime": 325
  },
  "timestamp": 1762208120
}
```

**错误响应示例**:
```json
{
  "type": "price_submit_response",
  "data": {
    "success": false,
    "code": 5001,
    "message": "密钥认证失败，无权提交数据"
  },
  "timestamp": 1762208120
}
```

**WebSocket 价格提交错误码**：
- `5001`: 提交密钥无效或认证失败
- `5101`: 数据格式错误（缺少 items 数组）
- `5102`: 缺少时间戳字段或格式错误
- `5103`: 缺少 type 字段
- `5104`: 无效的 type 值
- `9000`: 系统内部错误

**注意事项**:
- WebSocket 连接需要在 URL 参数中提供 `key`（如果服务器启用了 `requireAuth`）与 `type=price_submit`；
- 消息格式与 POST 接口的请求体完全相同，无需额外包装
- 提交数据前，发送{ "type": "auth_submit", "secret": "your-submission-secret-key" }以验证提交密钥

### 查询价格历史（V3 - OCR识别数据）
```http
GET /df/object/price/history/v3?type=protect&condition=全新&days=30
```

**参数说明:**
- `objectId`: 物品ID（支持单个、数组、子ID格式如 10000001-1）
- `objectName`: 物品名称（模糊匹配）
- `type`: 数据类型（gun/protect/acc/ammo/props/consume/key）
- `primaryClass`: 一级分类
- `secondClass`: 二级分类（支持中文模糊匹配，如"冲锋"可匹配"冲锋枪"）
- `condition`: 装备耐久度状态（可选，装备专用）
  - `全新`: 对应子ID后缀 -1
  - `几乎全新`: 对应子ID后缀 -2
  - `破损`: 对应子ID后缀 -3
- `ammoLevel`: 弹药等级（可选，弹药专用）
  - `等级1`: 对应子ID后缀 -1
  - `等级2`: 对应子ID后缀 -2
  - `等级3`: 对应子ID后缀 -3
  - `等级4`: 对应子ID后缀 -4
  - `等级5`: 对应子ID后缀 -5
  - `等级6`: 对应子ID后缀 -6
- `days`: 查询天数（可选，默认30天，范围1-365天）

**查询优先级**: objectId > objectName > type > primaryClass > secondClass

**支持的查询组合:**
- 单独查询：`objectId`、`objectName`、`type`、`primaryClass`、`secondClass`
- 组合查询：`type` + `secondClass`、`type` + `condition`、`type` + `ammoLevel`、`primaryClass` + `secondClass`
- 多重查询：`type` + `secondClass` + `condition`、`type` + `secondClass` + `ammoLevel`

**响应示例（单个物品）:**
```json
{
  "success": true,
  "code": "0",
  "message": "查询成功",
  "data": {
    "objectID": "15040010001-1",
    "baseObjectID": 15040010001,
    "objectName": "H70 精英头盔",
    "primaryClass": "protect",
    "secondClass": "头盔",
    "dataType": "protect",
    "condition": "全新",
    "history": [
      {
        "timestamp": 1762208120,
        "price": 614447
      },
      {
        "timestamp": 1762207920,
        "price": 612000
      },
      {
        "timestamp": 1762207720,
        "price": 615000
      }
    ],
    "stats": {
      "count": 720,
      "avgPrice": 610000,
      "minPrice": 580000,
      "maxPrice": 650000,
      "priceRange": 70000,
      "latestPrice": 614447,
      "oldestPrice": 600000,
      "priceChange": 14447,
      "priceChangePercent": 2.41
    },
    "latestData": {
      "timestamp": 1762208120,
      "price": 614447
    },
    "dataRange": {
      "days": 30,
      "fromTimestamp": 1759616120,
      "toTimestamp": 1762208120
    }
  }
}
```

**响应示例（多个物品）:**
```json
{
  "success": true,
  "code": "0",
  "message": "查询成功",
  "data": {
    "items": [
      {
        "objectID": "15040010001-1",
        "baseObjectID": 15040010001,
        "objectName": "H70 精英头盔",
        "dataType": "protect",
        "condition": "全新",
        "history": [...],
        "stats": {...}
      }
    ],
    "totalCount": 10,
    "queryParams": {
      "type": "protect",
      "secondClass": "头盔"
    }
  }
}
```

**查询示例:**
```bash
# 查询所有装备（默认30天）
GET /df/object/price/history/v3?type=protect

# 查询所有全新装备的价格（7天）
GET /df/object/price/history/v3?type=protect&condition=全新&days=7

# 查询所有破损装备的价格（90天）
GET /df/object/price/history/v3?type=protect&condition=破损&days=90

# 按物品ID查询（支持子ID）
GET /df/object/price/history/v3?objectId=15040010001-1&days=30

# 按物品名称查询破损装备
GET /df/object/price/history/v3?objectName=H70&condition=破损

# 查询所有配件价格
GET /df/object/price/history/v3?type=acc&days=30

# 查询所有冲锋枪（支持中文模糊匹配）
GET /df/object/price/history/v3?secondClass=冲锋枪&days=30

# 查询枪械类中的步枪（组合查询）
GET /df/object/price/history/v3?type=gun&secondClass=步枪&days=30

# 查询长弓溪谷地图的物品
GET /df/object/price/history/v3?secondClass=长弓溪谷&days=30

# 查询所有弹药（30天）
GET /df/object/price/history/v3?type=ammo&days=30

# 查询特定弹药的等级5
GET /df/object/price/history/v3?objectName=.300BLK&ammoLevel=等级5&days=30

# 查询所有等级5的弹药
GET /df/object/price/history/v3?type=ammo&ammoLevel=等级5&days=30

# 按弹药子ID查询（等级5对应-5）
GET /df/object/price/history/v3?objectId=15010000001-5&days=30
```

### 获取最新价格（V3）
```http
GET /df/object/price/latest/v3?type=protect&condition=全新&page=1
```

**参数说明:**
- `type`: 数据类型（可选，gun/protect/acc/ammo/props/consume/key）
- `primaryClass`: 一级分类（可选）
- `secondClass`: 二级分类（可选，支持中文模糊匹配）
- `condition`: 装备耐久度状态（可选，装备专用）
- `ammoLevel`: 弹药等级（可选，弹药专用，等级1-6）
- `page`: 页码（可选，启用分页模式，每页固定100条）
- `limit`: 返回数量限制（可选，仅非分页模式有效，默认1500，最大2000）

**分页说明:**
- 提供 `page` 参数时，启用分页模式，每页固定返回100条数据
- 分页模式下返回 `currentPage`、`totalPages`、`pageSize` 信息
- 不提供 `page` 参数时，使用传统 `limit` 模式（向后兼容）
- 分页模式适合前端列表展示，传统模式适合一次性获取大量数据

**性能优化:**
- Redis缓存：每个查询结果缓存5分钟，大幅提升重复查询速度
- 缓存命中时响应带有 `cached: true` 标记
- 数据提交后自动清除相关类型的缓存，确保数据实时性

**响应示例（分页模式）:**
```json
{
  "success": true,
  "code": "0",
  "message": "查询成功",
  "data": {
    "items": [
      {
        "objectID": "15040010001-1",
        "baseObjectID": 15040010001,
        "objectName": "H70 精英头盔",
        "primaryClass": "protect",
        "secondClass": "头盔",
        "dataType": "protect",
        "condition": "全新",
        "latestPrice": 614447,
        "timestamp": 1762208120,
        "historyCount": 720
      },
      {
        "objectID": "15040020001-1",
        "baseObjectID": 15040020001,
        "objectName": "H90 战术头盔",
        "primaryClass": "protect",
        "secondClass": "头盔",
        "dataType": "protect",
        "condition": "全新",
        "latestPrice": 580000,
        "timestamp": 1762208100,
        "historyCount": 650
      }
    ],
    "totalCount": 1523,
    "currentPage": 1,
    "totalPages": 16,
    "pageSize": 100,
    "queryParams": {
      "type": "protect",
      "primaryClass": null,
      "secondClass": null,
      "condition": "全新",
      "ammoLevel": null
    }
  },
  "cached": false
}
```

**响应示例（非分页模式 - 传统模式）:**
```json
{
  "success": true,
  "code": "0",
  "message": "查询成功",
  "data": {
    "items": [
      {
        "objectID": "15040010001-1",
        "baseObjectID": 15040010001,
        "objectName": "H70 精英头盔",
        "primaryClass": "protect",
        "secondClass": "头盔",
        "dataType": "protect",
        "condition": "全新",
        "latestPrice": 614447,
        "timestamp": 1762208120,
        "historyCount": 720
      }
    ],
    "totalCount": 500,
    "queryParams": {
      "type": "protect",
      "primaryClass": null,
      "secondClass": null,
      "condition": "全新",
      "ammoLevel": null,
      "limit": 500
    }
  }
}
```

**响应示例（缓存命中）:**
```json
{
  "success": true,
  "code": "0",
  "message": "查询成功",
  "data": {
    "items": [...],
    "totalCount": 1523,
    "currentPage": 1,
    "totalPages": 16,
    "pageSize": 100,
    "queryParams": {...}
  },
  "cached": true
}
```

**查询示例:**
```bash
# ===== 分页模式（推荐，每页100条） =====

# 获取所有全新装备的第1页
GET /df/object/price/latest/v3?type=protect&condition=全新&page=1

# 获取所有全新装备的第2页
GET /df/object/price/latest/v3?type=protect&condition=全新&page=2

# 获取所有配件的第1页
GET /df/object/price/latest/v3?type=acc&page=1

# 获取所有冲锋枪的第1页（中文模糊匹配）
GET /df/object/price/latest/v3?secondClass=冲锋枪&page=1

# 获取枪械类中步枪的第1页
GET /df/object/price/latest/v3?type=gun&secondClass=步枪&page=1

# 获取所有等级5弹药的第1页
GET /df/object/price/latest/v3?type=ammo&ammoLevel=等级5&page=1

# 获取特定弹药类型的等级3（第1页）
GET /df/object/price/latest/v3?secondClass=.300BLK&ammoLevel=等级3&page=1

# ===== 传统模式（向后兼容，自定义数量） =====

# 获取所有全新装备（最多500条）
GET /df/object/price/latest/v3?type=protect&condition=全新&limit=500

# 获取所有配件（最多200条）
GET /df/object/price/latest/v3?type=acc&limit=200

# 获取所有等级5弹药（默认1500条）
GET /df/object/price/latest/v3?type=ammo&ammoLevel=等级5

# 获取最多2000条数据（上限）
GET /df/object/price/latest/v3?type=protect&limit=2000
```

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

### AI锐评
```http
POST /df/person/ai
```

**功能说明**：使用Dify AI对玩家战绩进行智能分析和点评，支持烽火地带和全面战场两种游戏模式，每种模式使用独立的AI应用。

**参数 (body/json)**：
- `frameworkToken`：框架Token（必填）
- `type`：游戏模式（必填）
  - `sol`：烽火地带（使用烽火地带专用AI应用）
  - `mp`：全面战场（使用全面战场专用AI应用）
- `conversation_id`：对话ID（可选，用于继续对话）

**请求示例（烽火地带）**：
```json
{
  "frameworkToken": "xxxxx-xxxxx-xxxxx-xxxxx",
  "type": "sol"
}
```

**请求示例（全面战场）**：
```json
{
  "frameworkToken": "xxxxx-xxxxx-xxxxx-xxxxx",
  "type": "mp"
}
```

**数据来源**：
系统会自动获取以下数据并提交给AI分析：
1. **个人数据**：基础战绩统计（击杀、死亡、KD等）
2. **日报数据**：最近一天的战绩表现
3. **周报数据**：最近一周的战绩趋势
4. **最近战绩**：最近5场对局的详细数据

## 音频语音接口

### 随机获取音频
```http
GET /df/audio/random?category=Voice&character=红狼&scene=InGame&actionType=Breath&count=1
```

**参数说明：**
- `category`：一级分类（可选）
  - `Voice`: 角色语音
  - `CutScene`: 过场动画
  - `Amb`: 环境音效
  - `Music`: 音乐
  - `SFX`: 音效
  - `Festivel`: 节日活动
- `tag`：特殊标签（可选，用于特殊语音，与目录结构参数互斥）
  - Boss语音：`boss-1`(赛伊德) / `boss-2`(雷斯) / `boss-4`(德穆兰) / `boss-5-1`(渡鸦) / `boss-5-2`(典狱长)
  - 任务语音：`task-0`(契约任务) / `task-1`(破壁) / `task-2`(铁穹) / `task-4`(飞升者) / `task-5`(黑潮) / `task-5-0`(监狱行动)
  - 撤离语音：`Evac-1`(直升机) / `Evac-2`(电梯) / `Evac-3`(火车)
  - 彩蛋语音：`eggs-1`(大战场彩蛋) / `eggs-2`(大卫语音)
  - 全面战场：`bf-1`(战场部署) / `bf-2`(战场就绪) / `BF_GTI`(GTI战场) / `BF_Haavk`(哈夫克战场)
  - 其他：`haavk`(哈夫克全兵种) / `commander`(指令) / `babel`(巴别塔) / `Beginner`(新手教程)
- `character`：**统一角色参数**（可选，支持多种格式）
  - **干员全局ID**：`20003`（蜂医）、`10007`（红狼）
  - **Voice ID**：`Voice_101`（蜂医）、`Voice_301`（红狼）
  - **皮肤Voice ID**：`Voice_301_SkinA`或`Voice_301_skinA`（红狼A皮肤，大小写不敏感）
  - **中文名**：`红狼`（基础角色）、`红狼A`（皮肤角色）
- `scene`：场景（可选，如：InGame, OutGame）
- `actionType`：动作类型（可选，如：Breath, Combat等）
- `actionDetail`：具体动作（可选）
- `count`：返回数量（可选，默认1，范围1-5）

**重要说明：**
- `tag` 参数与 `character/scene/actionType/actionDetail` 互斥
- 提供 `tag` 时，其他目录结构参数会被忽略
- `tag` 只用于获取Boss、任务、彩蛋等特殊语音
- `character` 参数已统一，支持4种格式（干员ID、Voice ID、皮肤ID、中文名），无需再使用 `characterId`

**功能说明**：随机获取符合条件的音频文件，支持多种角色查询方式和特殊标签分类，自动生成七牛云私有下载链接（带时效性，由服务器配置控制，防止恶意刷流量）

**使用示例：**
```bash
# 使用tag获取Boss语音
GET /df/audio/random?tag=boss-1&count=3

# 使用中文名获取角色语音
GET /df/audio/random?category=Voice&character=红狼&scene=InGame&count=3

# 使用干员ID获取角色语音
GET /df/audio/random?character=10007&count=3

# 使用皮肤ID获取角色皮肤语音
GET /df/audio/random?character=Voice_301_SkinA&count=3

# 使用皮肤中文名获取角色皮肤语音
GET /df/audio/random?character=红狼A&count=3
```

**响应示例：**
```json
{
  "success": true,
  "message": "成功获取3个随机音频文件",
  "data": {
    "audios": [
      {
        "fileId": "74cc3b1cfc4d2b6a",
        "fileName": "Voice_301_Breath_Pain_01",
        "category": "Voice",
        "character": {
          "voiceId": "Voice_301",
          "operatorId": 10007,
          "name": "红狼",
          "profession": "突击"
        },
        "scene": "InGame",
        "actionType": "Breath",
        "actionDetail": "Voice_301_Breath_Pain",
        "download": {
          "url": "http://df-voice.shallow.ink/Voice%2FCharacter%2FVoice_301%2FInGame%2FBreath%2FVoice_301_Breath_Pain%2Fxxx.wav?e=1729260000&token=maPJADfhLC3g9YzTR8BUUisFWqUb0mwzz6u02icM:abc123...",
          "token": "maPJADfhLC3g9YzTR8BUUisFWqUb0mwzz6u02icM:abc123...",
          "deadline": 1729260000,
          "expiresAt": "2025-10-18T12:30:00.000Z",
          "expiresIn": 120
        },
        "metadata": {
          "filePath": "Voice/Character/Voice_301/InGame/Breath/Voice_301_Breath_Pain/xxx.wav",
          "fileExtension": "wav"
        }
      }
    ],
    "query": {
      "category": "Voice",
      "character": "红狼",
      "resolved": {
        "voiceId": "Voice_301",
        "operatorId": 10007,
        "name": "红狼",
        "profession": "突击"
      },
      "scene": "InGame",
      "actionType": "Breath"
    },
    "statistics": {
      "requested": 3,
      "returned": 3,
      "totalAvailable": 150
    },
    "cdn": {
      "provider": "qiniu",
      "bucket": "delta-force-voice",
      "domain": "df-voice.shallow.ink"
    }
  }
}
```

### 获取角色随机音频
```http
GET /df/audio/character?character=红狼&scene=InGame&actionType=Breath&count=1
```

**参数说明：**
- `character`：**统一角色参数**（可选，支持多种格式）
  - **干员全局ID**：`20003`（蜂医）、`10007`（红狼）
  - **Voice ID**：`Voice_101`（蜂医）、`Voice_301`（红狼）
  - **皮肤Voice ID**：`Voice_301_SkinA`或`Voice_301_skinA`（红狼A皮肤，大小写不敏感）
  - **中文名**：`红狼`（基础角色）、`红狼A`（皮肤角色）
- `scene`：场景（可选，如：InGame, OutGame）
- `actionType`：动作类型（可选，如：Breath, Combat）
- `actionDetail`：具体动作（可选）
- `count`：返回数量（可选，默认1，范围1-5）

**功能说明**：随机获取角色语音，支持多种角色查询方式，所有参数均为可选（不指定角色则随机获取任意角色语音），下载链接有效期由服务器配置控制

**使用示例：**
```bash
# 使用中文名查询
GET /df/audio/character?character=红狼&count=3

# 使用干员ID查询
GET /df/audio/character?character=10007&count=3

# 使用皮肤ID查询（支持大小写）
GET /df/audio/character?character=Voice_301_SkinA&count=3
GET /df/audio/character?character=Voice_301_skinA&count=3

# 使用皮肤中文名查询
GET /df/audio/character?character=红狼A&count=3

# 不指定角色，随机获取任意角色语音
GET /df/audio/character?count=5
```

**响应示例：**
```json
{
  "success": true,
  "message": "成功获取3个角色随机音频",
  "data": {
    "audios": [
      {
        "fileId": "74cc3b1cfc4d2b6a",
        "fileName": "Voice_301_Breath_Pain_01",
        "category": "Voice",
        "character": {
          "voiceId": "Voice_301",
          "operatorId": 10007,
          "name": "红狼",
          "profession": "突击"
        },
        "scene": "InGame",
        "actionType": "Breath",
        "actionDetail": "Voice_301_Breath_Pain",
        "download": {
          "url": "http://df-voice.shallow.ink/...",
          "token": "...",
          "deadline": 1729260000,
          "expiresAt": "2025-10-18T12:30:00.000Z",
          "expiresIn": 120
        },
        "metadata": {
          "filePath": "Voice/Character/Voice_301/InGame/Breath/xxx.wav",
          "fileExtension": "wav"
        }
      }
    ],
    "query": {
      "character": "红狼",
      "resolved": {
        "voiceId": "Voice_301",
        "operatorId": 10007,
        "name": "红狼",
        "profession": "突击"
      },
      "scene": "InGame",
      "actionType": "Breath"
    },
    "statistics": {
      "requested": 3,
      "returned": 3,
      "totalAvailable": 150
    },
    "cdn": {
      "provider": "qiniu",
      "bucket": "delta-force-voice",
      "domain": "df-voice.shallow.ink"
    }
  }
}
```

### 获取音频分类列表
```http
GET /df/audio/categories
```

**功能说明**：获取所有可用的音频分类列表（用于查询筛选）

**响应示例：**
```json
{
  "success": true,
  "message": "获取音频分类成功",
  "data": {
    "categories": [
      { "category": "Amb" },
      { "category": "CutScene" },
      { "category": "Festivel" },
      { "category": "Music" },
      { "category": "SFX" },
      { "category": "Voice" }
    ]
  }
}
```

### 获取特殊标签列表
```http
GET /df/audio/tags
```

**功能说明**：获取所有可用的特殊标签列表（用于Voice分类下的特殊语音查询）

**响应示例：**
```json
{
  "success": true,
  "message": "获取标签列表成功",
  "data": {
    "tags": [
      { "tag": "eggs-1", "description": "大战场彩蛋语音" },
      { "tag": "eggs-2", "description": "大卫语音" },
      { "tag": "boss-1", "description": "赛伊德" },
      { "tag": "boss-2", "description": "雷斯/肘击王" },
      { "tag": "boss-4", "description": "德穆兰/老太" },
      { "tag": "task-0", "description": "契约任务/保险箱任务" },
      { "tag": "task-1", "description": "破壁行动" },
      { "tag": "Evac-1", "description": "撤离语音/直升机" },
      { "tag": "bf-1", "description": "战场部署" },
      { "tag": "commander", "description": "指令" }
    ]
  }
}
```

### 获取角色列表
```http
GET /df/audio/characters
```

**功能说明**：获取所有可用的角色列表，包含完整的角色信息（干员ID、Voice ID、皮肤ID、中文名、职业）

**响应示例：**
```json
{
  "success": true,
  "message": "获取角色列表成功",
  "data": {
    "characters": [
      {
        "operatorId": 20003,
        "voiceId": "Voice_101",
        "name": "蜂医",
        "profession": "医疗",
        "skins": [],
        "allVoiceIds": ["Voice_101"],
        "allNames": ["蜂医"]
      },
      {
        "operatorId": 20004,
        "voiceId": "Voice_102",
        "name": "蛊",
        "profession": "医疗",
        "skins": [
          { "voiceId": "Voice_102_SkinA", "name": "蛊A" }
        ],
        "allVoiceIds": ["Voice_102", "Voice_102_SkinA"],
        "allNames": ["蛊", "蛊A"]
      },
      {
        "operatorId": 10007,
        "voiceId": "Voice_301",
        "name": "红狼",
        "profession": "突击",
        "skins": [
          { "voiceId": "Voice_301_SkinA", "name": "红狼A" },
          { "voiceId": "Voice_301_SkinB", "name": "红狼B" }
        ],
        "allVoiceIds": ["Voice_301", "Voice_301_SkinA", "Voice_301_SkinB"],
        "allNames": ["红狼", "红狼A", "红狼B"]
      }
    ],
    "totalCount": 12,
    "tip": "character参数支持：干员ID(20003)、Voice ID(Voice_101)、皮肤ID(Voice_301_SkinA或skinA，大小写不敏感)、中文名(红狼/红狼A)"
  }
}
```

### 获取音频统计信息
```http
GET /df/audio/stats
```

**功能说明**：获取音频文件的基础统计信息，包括总数和各分类的文件数量

**响应示例：**
```json
{
  "success": true,
  "message": "获取音频统计成功",
  "data": {
    "totalFiles": 15436,
    "categories": [
      { "category": "Amb", "fileCount": 2500 },
      { "category": "CutScene", "fileCount": 1200 },
      { "category": "Festivel", "fileCount": 236 },
      { "category": "Music", "fileCount": 1500 },
      { "category": "SFX", "fileCount": 1500 },
      { "category": "Voice", "fileCount": 8500 }
    ]
  }
}
```

### 获取鼠鼠随机音乐
```http
GET /df/audio/shushu?count=3&playlist=10
```

**参数说明：**
- `count`：返回数量（可选，默认1，范围1-10）
- `playlist`：歌单ID或中文名称（可选，支持模糊搜索）
- `artist`：艺术家名称（可选，模糊搜索）
- `title`：歌曲名称（可选，模糊搜索）

**功能说明**：
- 随机获取鼠鼠歌曲，系统每24小时自动同步最新歌单数据
- 每次获取音乐后会自动增加歌曲热度（异步执行，不影响响应速度）
- 热度数据与远程API实时同步，确保数据准确性

**使用示例：**
```bash
# 随机获取3首歌曲
GET /df/audio/shushu?count=3

# 获取指定歌单的随机歌曲（使用ID）
GET /df/audio/shushu?playlist=10&count=5

# 获取指定歌单的随机歌曲（使用中文名称模糊搜索）
GET /df/audio/shushu?playlist=曼波
GET /df/audio/shushu?playlist=乌鲁鲁

# 搜索特定艺术家的歌曲
GET /df/audio/shushu?artist=沐源鸽&count=3

# 搜索特定歌曲名称
GET /df/audio/shushu?title=最后一哈

# 组合查询：指定歌单+艺术家
GET /df/audio/shushu?playlist=10&artist=沐源鸽&count=5
```

**响应示例：**
```json
{
  "success": true,
  "message": "成功获取3首随机音乐",
  "data": {
    "musics": [
      {
        "fileId": "100001",
        "fileName": "最后一哈",
        "category": "ShushuMusic",
        "artist": "沐源鸽",
        "playlist": {
          "id": "10",
          "name": "曼波の小曲"
        },
        "download": {
          "url": "https://s3.oss.hengj.cn/one/autoup/5e79be85-b0d2-4d8c-b128-1fdc97bc00c3/20251013/KcY2zv/%E6%9C%80%E5%90%8E%E4%B8%80%E5%93%88.mp3",
          "type": "direct",
          "expiresIn": 0
        },
        "metadata": {
          "cover": "https://s3.oss.hengj.cn/one/autoup/460a18cb-9c41-44ba-90af-b71fd35b1395/20251013/q7Lx2Z/%E6%9C%80%E5%90%8E%E4%B8%80%E5%93%88%E5%B0%81%E9%9D%A2.jpg",
          "lrc": "https://s3.oss.hengj.cn/one/autoup/b766ff7a-b60c-49b7-94d6-245fbfcf2c10/20251013/DrzPHT/%E6%9C%80%E5%90%8E%E4%B8%80%E5%93%88%E6%AD%8C%E8%AF%8D.lrc",
          "source": "bili",
          "sourceUrl": "https://www.bilibili.com/video/BV1L6uszvE5u/",
          "hot": "515170",
          "updateTime": "2025-08-10 00:25:19"
        }
      }
    ],
    "query": {
      "playlist": "10",
      "playlistType": "ID",
      "artist": null,
      "title": null
    },
    "statistics": {
      "requested": 3,
      "returned": 3,
      "totalAvailable": 50
    },
    "source": {
      "provider": "shushufan",
      "api": "https://api.df.hengj.cn",
      "syncInterval": "24小时"
    }
  }
}
```

### 获取鼠鼠音乐列表
```http
GET /df/audio/shushu/list?sortBy=hot&playlist=10
```

**参数说明：**
- `sortBy`：排序方式（可选，默认default）
  - `default`：默认顺序（数据库原始顺序）
  - `hot`：按热度降序排列（热门歌曲在前）
- `playlist`：歌单ID或中文名称（可选，支持模糊搜索）
- `artist`：艺术家名称（可选，模糊搜索）

**功能说明**：
- 获取所有符合条件的音乐列表（不分页，直接返回完整列表）
- 支持按热度排序，热度数据实时同步
- 支持歌单ID和中文名称混合查询

**使用示例：**
```bash
# 获取所有音乐（默认顺序）
GET /df/audio/shushu/list

# 按热度排序获取所有音乐
GET /df/audio/shushu/list?sortBy=hot

# 获取指定歌单的所有音乐（使用ID）
GET /df/audio/shushu/list?playlist=10

# 获取指定歌单的所有音乐（使用中文名称）
GET /df/audio/shushu/list?playlist=曼波

# 获取指定艺术家的所有音乐
GET /df/audio/shushu/list?artist=沐源鸽

# 组合查询：指定歌单+艺术家，按热度排序
GET /df/audio/shushu/list?playlist=10&artist=沐源鸽&sortBy=hot
```

**响应示例：**
```json
{
  "success": true,
  "message": "成功获取156首音乐",
  "data": [
    {
      "fileId": "100017",
      "fileName": "营销号小曲🎵MaskedHachimies🎵",
      "category": "ShushuMusic",
      "artist": "_Yurine_",
      "playlist": {
        "id": "10",
        "name": "曼波の小曲"
      },
      "download": {
        "url": "https://s3.oss.hengj.cn/one/autoup/85555cd7-429a-465c-af26-e4819b9a4de9/20251013/TmC0mW/%E5%93%88%E5%9F%BA%E7%B1%B3%E8%90%A5%E9%94%80%E5%8F%B7%E5%B0%8F%E6%9B%B2.mp3",
        "type": "direct",
        "expiresIn": 0
      },
      "metadata": {
        "cover": "https://s3.oss.hengj.cn/one/autoup/0a528eff-b6e8-443b-8341-703da82aefd0/20251013/uTFVpy/%E5%93%88%E5%9F%BA%E7%B1%B3%E8%90%A5%E9%94%80%E5%8F%B7%E5%B0%8F%E6%9B%B2%E5%B0%81%E9%9D%A2.png",
        "lrc": null,
        "source": "bili",
        "sourceUrl": "https://www.bilibili.com/video/BV1xsPMeYEGj/",
        "hot": "86928",
        "updateTime": "2025-08-11 01:44:47"
      }
    }
  ]
}
```

### 手动同步鼠鼠音乐数据（管理员）
```http
POST /df/audio/shushu/sync
```

**参数 (body/json)**：
- `clientID`：管理员的ClientID（必填）

**功能说明**：
- 从鼠鼠API同步最新的歌单和歌曲数据
- 同时同步所有歌曲的最新热度数据
- **仅限管理员操作**
- 自动同步：系统启动2秒后执行首次同步，之后每24小时自动同步

**使用示例：**
```bash
POST /df/audio/shushu/sync
Content-Type: application/json

{
  "clientID": "admin_client_id"
}
```

**响应示例（成功）：**
```json
{
  "success": true,
  "message": "鼠鼠音乐同步完成",
  "data": {
    "totalSongs": 172,
    "totalPlaylists": 5,
    "playlists": [
      {
        "playlistId": "10",
        "playlistName": "曼波の小曲",
        "songCount": 50
      },
      {
        "playlistId": "20",
        "playlistName": "乌鲁鲁金曲",
        "songCount": 45
      },
      {
        "playlistId": "11",
        "playlistName": "曼波の翻唱",
        "songCount": 35
      }
    ],
    "duration": "5.23秒",
    "source": "shushufan",
    "api": "https://api.df.hengj.cn",
    "syncTime": "2025-10-28T10:30:00.000Z",
    "triggeredBy": "admin_client_id"
  }
}
```

**响应示例（权限不足）：**
```json
{
  "success": false,
  "message": "权限不足：只有管理员可以执行同步操作"
}
```

### 同步音频文件（管理员）
```http
POST /df/audio/sync
```

**参数 (body/json)**：
- `clientID`：管理员的ClientID（必填）

**功能说明**：
- 从七牛云私有空间下载音频文件列表
- 解析文件路径，提取分类元数据
- 批量同步到MongoDB数据库
- **仅限管理员操作**
- 自动同步：启动2秒后执行首次同步，之后根据集群配置定时同步

**响应示例（成功）：**
```json
{
  "success": true,
  "message": "从七牛云同步音频文件完成",
  "data": {
    "total": 15436,
    "success": 14980,
    "skipped": 450,
    "failed": 6,
    "source": "qiniu",
    "fileKey": "audio_files_list.txt",
    "bucket": "delta-force-voice",
    "syncTime": "2025-10-18T14:01:00.000Z"
  }
}
```

**响应示例（权限不足）：**
```json
{
  "success": false,
  "message": "权限不足：只有管理员可以执行同步操作"
}
```

### 音频接口说明
1. **私有链接**：游戏音频下载链接都是七牛云私有空间的临时签名链接，有时效性；数梳梳饭音乐为直链，永久有效
2. **链接过期时间**：游戏音频由服务器配置文件控制（默认120秒，范围120-300秒），客户端无法自定义，防止恶意刷流量
3. **安全机制**：
   - Token有效期由服务器统一管理
   - 游戏音频下载链接使用HMAC-SHA1签名认证
   - 配置的过期时间会被强制限制在安全范围内
4. **两种查询方式**：
   - **目录结构查询**：使用 `character/scene/actionType` 等参数（适用于角色语音）
   - **特殊标签查询**：使用 `tag` 参数（只支持 `/df/audio/random` 接口，用于Boss、任务、彩蛋等特殊语音）
   - **互斥规则**：提供 `tag` 时会忽略目录结构参数
5. **统一角色参数**：`character` 参数已统一，支持4种查询格式
   - **干员全局ID**：`20003`（蜂医）、`10007`（红狼）
   - **Voice ID**：`Voice_101`（蜂医）、`Voice_301`（红狼）
   - **皮肤Voice ID**：`Voice_301_SkinA`或`Voice_301_skinA`（红狼A皮肤，**大小写不敏感**）
   - **中文名**：`红狼`（基础角色）、`红狼A`（皮肤角色）
6. **可选参数**：所有筛选参数均为可选，不指定角色则随机获取任意角色语音
7. **自动同步**：
   - 游戏音频：系统会自动从七牛云同步音频文件列表
   - 鼠鼠音乐：每24小时自动同步最新歌单数据
8. **权限控制**：手动同步仅限管理员，查询接口无需认证
9. **分类结构**：
   - **Voice**：角色语音（按角色ID、场景、动作类型分类）+ 特殊语音（按tag分类）
   - **CutScene**：过场动画（按游戏模式、场景分类）
   - **Amb**：环境音效
   - **Music**：背景音乐
   - **SFX**：音效
   - **Festivel**：节日活动音频
   - **ShushuMusic**：鼠鼠音乐（按歌单、艺术家、歌曲名分类）
10. **角色完整映射表**（所有可用查询格式）：
   - **医疗 (1xx)**：
     - 蜂医：干员ID `20003` / Voice ID `Voice_101` / 中文名 `蜂医`
     - 蛊：干员ID `20004` / Voice ID `Voice_102` / 皮肤 `Voice_102_SkinA` (蛊A) / 中文名 `蛊`、`蛊A`
   - **侦查 (2xx)**：
     - 露娜：干员ID `40005` / Voice ID `Voice_201` / 皮肤 `Voice_201_SkinA` (露娜A) / 中文名 `露娜`、`露娜A`
     - 骇爪：干员ID `40010` / Voice ID `Voice_202` / 皮肤 `Voice_202_SkinA` (骇爪A)、`Voice_202_SkinB` (骇爪B) / 中文名 `骇爪`、`骇爪A`、`骇爪B`
     - 银翼：干员ID `40011` / Voice ID `Voice_203` / 中文名 `银翼`
   - **突击 (3xx)**：
     - 红狼：干员ID `10007` / Voice ID `Voice_301` / 皮肤 `Voice_301_SkinA` (红狼A)、`Voice_301_SkinB` (红狼B) / 中文名 `红狼`、`红狼A`、`红狼B`
     - 威龙：干员ID `10010` / Voice ID `Voice_302` / 皮肤 `Voice_302_SkinA` (威龙A) / 中文名 `威龙`、`威龙A`
     - 无名：干员ID `10011` / Voice ID `Voice_303` / 中文名 `无名`
     - 疾风：干员ID `10012` / Voice ID `Voice_304` / 中文名 `疾风`
   - **工程 (4xx)**：
     - 深蓝：干员ID `30010` / Voice ID `Voice_401` / 中文名 `深蓝`
     - 乌鲁鲁：干员ID `30009` / Voice ID `Voice_402` / 中文名 `乌鲁鲁`
     - 牧羊人：干员ID `30008` / Voice ID `Voice_403` / 中文名 `牧羊人`

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

---

## OCR 任务管理系统 WebSocket 接口

### 概述

OCR 任务管理系统提供 WebSocket 接口，用于 OCR 服务器连接、认证、注册和任务状态更新。OCR 服务器通过 WebSocket 连接到后端，进行身份认证后可以注册服务器信息并上报任务状态。

### 连接地址

```
# 使用连接密钥（必需）
ws://your-api-domain:port/ws?type=ocr&key=your-connection-secret

# WSS 加密连接（生产环境推荐）
wss://your-api-domain:port/ws?type=ocr&key=your-connection-secret
```

**连接参数说明**：
- `type`: 连接类型，固定为 `ocr`
- `key`: WebSocket 连接密钥

**注意**：OCR 任务管理系统使用独立的认证机制，不与价格提交系统混淆。

### 连接流程

1. **建立 WebSocket 连接**：使用 `type=ocr` 参数连接
2. **接收连接成功消息**：服务器会发送 `connected` 消息，包含可用频道列表
3. **发送 OCR 认证（推荐）**：发送 `ocr_auth` 消息进行业务认证，如果提供 `hostname` 参数，可同时完成注册
4. **上报任务状态**：通过 `ocr_task_update` 消息更新任务状态

**注意**：推荐在 `ocr_auth` 时直接提供 `hostname` 参数，一次完成认证和注册，避免重复操作。

### 客户端消息类型

#### 1. OCR 认证 (ocr_auth)

连接成功后，首先需要发送 OCR 认证消息。**推荐在认证时同时提供 `hostname` 参数，一次完成认证和注册**：

```json
{
  "type": "ocr_auth",
  "serverId": "ocr_server_001",
  "secret": "your-ocr-auth-secret",
  "hostname": "my-ocr-machine"
}
```

**参数说明**：
- `serverId`: OCR 服务器唯一标识（必填）
- `secret`: OCR 认证密钥（必填，需要在服务器配置中设置）
- `hostname`: 服务器主机名（可选，如果提供则同时完成注册）

**服务端响应（成功，提供 hostname）**：
```json
{
  "type": "ocr_auth_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "OCR 认证和注册成功",
    "serverId": "ocr_server_001",
    "hostname": "my-ocr-machine",
    "registered": true
  },
  "timestamp": 1763126753000
}
```

**服务端响应（成功，未提供 hostname）**：
```json
{
  "type": "ocr_auth_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "OCR 认证成功",
    "serverId": "ocr_server_001",
    "registered": false
  },
  "timestamp": 1763126753000
}
```

**服务端响应（失败）**：
```json
{
  "type": "ocr_auth_response",
  "data": {
    "success": false,
    "code": 4001,
    "message": "缺少必需参数 serverId"
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4001`: 缺少必需参数 serverId
- `4002`: 认证密钥无效
- `9000`: 系统内部错误

#### 2. 任务状态更新 (ocr_task_update)

认证成功后，OCR 服务器可以上报任务状态更新：

```json
{
  "type": "ocr_task_update",
  "taskId": "task_001",
  "status": "running",
  "progress": 50,
  "result": {
    "items": [],
    "error": null
  }
}
```

**参数说明**：
- `taskId`: 任务唯一标识（必填）
- `status`: 任务状态（必填）
  - `pending`: 待处理
  - `running`: 运行中
  - `completed`: 已完成
  - `failed`: 失败
- `progress`: 任务进度（可选，0-100）
- `result`: 任务结果（可选，任务完成时包含结果数据）

**服务端响应（成功）**：
```json
{
  "type": "ocr_task_update_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "任务状态更新成功",
    "taskId": "task_001",
    "status": "running"
  },
  "timestamp": 1763126753000
}
```

**服务端响应（失败）**：
```json
{
  "type": "ocr_task_update_response",
  "data": {
    "success": false,
    "code": 4201,
    "message": "缺少必需参数 taskId"
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4201`: 缺少必需参数 taskId
- `4202`: 缺少必需参数 status
- `9000`: 系统内部错误

#### 3. 启动任务 (ocr_start_task) - 管理端功能

**权限要求**：必须是管理员（连接的 `clientId` 必须在 `admin.yaml` 的 `adminUsers` 列表中）

管理端可以通过此消息启动指定 OCR 服务器的任务：

```json
{
  "type": "ocr_start_task",
  "serverId": "ocr_server_001",
  "taskName": "weapon",
  "params": {
    "cycle_count": 10
  }
}
```

**参数说明**：
- `serverId`: OCR 服务器唯一标识（可选，不提供则使用当前连接的 clientId）
- `taskName`: 任务名称（必填）
  - `pipeline`: 全自动流水线
  - `auto_mission`: 游戏导航
  - `weapon`: 枪械识别
  - `ammo`: 弹药识别
  - `accessory`: 配件识别
  - `collection`: 收集品识别
  - `consumable`: 消耗品识别
  - `key`: 钥匙识别
  - `equipment`: 装备识别
- `params`: 任务参数（可选）

**服务端响应（成功）**：
```json
{
  "type": "ocr_start_task_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "任务 weapon 启动命令已发送",
    "serverId": "ocr_server_001",
    "taskName": "weapon"
  },
  "timestamp": 1763126753000
}
```

**服务端响应（失败）**：
```json
{
  "type": "ocr_start_task_response",
  "data": {
    "success": false,
    "code": 4301,
    "message": "未找到 serverId: ocr_server_001 对应的客户端"
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4301`: 未找到 serverId 对应的客户端
- `4302`: 缺少必需参数 taskName
- `4303`: 目标客户端离线或不存在
- `4600`: 权限验证失败（通用错误）
- `4601`: 客户端连接不存在
- `4603`: 权限不足：只有管理员可以执行此操作（clientId 不在管理员列表中）
- `9000`: 系统内部错误

**注意**：启动命令会发送到目标 OCR 服务器，目标服务器会收到 `ocr_task_command` 消息。

#### 4. 停止任务 (ocr_stop_task) - 管理端功能

**权限要求**：必须是管理员（连接的 `clientId` 必须在 `admin.yaml` 的 `adminUsers` 列表中）

管理端可以通过此消息停止指定 OCR 服务器的任务：

```json
{
  "type": "ocr_stop_task",
  "serverId": "ocr_server_001",
  "taskName": "weapon"
}
```

**参数说明**：
- `serverId`: OCR 服务器唯一标识（可选，不提供则使用当前连接的 clientId）
- `taskName`: 任务名称（必填）

**服务端响应（成功）**：
```json
{
  "type": "ocr_stop_task_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "任务 weapon 停止命令已发送",
    "serverId": "ocr_server_001",
    "taskName": "weapon"
  },
  "timestamp": 1763126753000
}
```

**服务端响应（失败）**：
```json
{
  "type": "ocr_stop_task_response",
  "data": {
    "success": false,
    "code": 4401,
    "message": "未找到 serverId: ocr_server_001 对应的客户端"
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4401`: 未找到 serverId 对应的客户端
- `4402`: 缺少必需参数 taskName
- `4403`: 目标客户端离线或不存在
- `4600`: 权限验证失败（通用错误）
- `4601`: 客户端连接不存在
- `4603`: 权限不足：只有管理员可以执行此操作（clientId 不在管理员列表中）
- `9000`: 系统内部错误

**注意**：停止命令会发送到目标 OCR 服务器，目标服务器会收到 `ocr_task_command` 消息。

#### 5. 查询状态 (ocr_get_status) - 管理端功能

**权限要求**：必须是管理员（连接的 `clientId` 必须在 `admin.yaml` 的 `adminUsers` 列表中）

管理端可以通过此消息查询 OCR 服务器状态：

```json
{
  "type": "ocr_get_status",
  "serverId": "ocr_server_001"
}
```

**参数说明**：
- `serverId`: OCR 服务器唯一标识（可选，不提供则返回所有客户端状态）

**服务端响应（单个客户端）**：
```json
{
  "type": "ocr_get_status_response",
  "data": {
    "success": true,
    "code": 0,
    "serverId": "ocr_server_001",
    "client": {
      "id": "ws_1763126752982_bd89ezv7jer",
      "hostname": "my-ocr-machine",
      "status": "online",
      "lastHeartbeat": 1763126753000,
      "registeredAt": "2025-01-15T10:30:00.000Z",
      "tasksCount": 2
    },
    "tasks": [
      {
        "id": "task_001",
        "name": "weapon",
        "status": "running",
        "progress": 50,
        "createdAt": "2025-01-15T10:30:00.000Z",
        "startedAt": "2025-01-15T10:30:05.000Z",
        "completedAt": null
      }
    ]
  },
  "timestamp": 1763126753000
}
```

**服务端响应（所有客户端）**：
```json
{
  "type": "ocr_get_status_response",
  "data": {
    "success": true,
    "code": 0,
    "clients": [
      {
        "serverId": "ocr_server_001",
        "client": {
          "id": "ws_1763126752982_bd89ezv7jer",
          "hostname": "my-ocr-machine",
          "status": "online",
          "lastHeartbeat": 1763126753000,
          "registeredAt": "2025-01-15T10:30:00.000Z",
          "tasksCount": 2
        },
        "tasks": [...]
      }
    ],
    "total": 1
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4501`: 未找到 serverId 对应的客户端
- `4502`: 客户端不存在
- `4600`: 权限验证失败（通用错误）
- `4601`: 客户端连接不存在
- `4603`: 权限不足：只有管理员可以执行此操作（clientId 不在管理员列表中）
- `9000`: 系统内部错误

#### 6. 删除任务 (ocr_delete_task) - 管理端功能

**权限要求**：必须是管理员（连接的 `clientId` 必须在 `admin.yaml` 的 `adminUsers` 列表中）

管理端可以通过此消息删除指定的任务记录：

```json
{
  "type": "ocr_delete_task",
  "taskId": "task_001"
}
```

**参数说明**：
- `taskId`: 任务唯一标识（必填）

**服务端响应（成功）**：
```json
{
  "type": "ocr_delete_task_response",
  "data": {
    "success": true,
    "code": 0,
    "message": "任务 task_001 已删除",
    "taskId": "task_001"
  },
  "timestamp": 1763126753000
}
```

**服务端响应（失败）**：
```json
{
  "type": "ocr_delete_task_response",
  "data": {
    "success": false,
    "code": 4410,
    "message": "缺少必需参数 taskId"
  },
  "timestamp": 1763126753000
}
```

**错误码说明**：
- `4410`: 缺少必需参数 taskId
- `4411`: 任务不存在
- `4600`: 权限验证失败（通用错误）
- `4601`: 客户端连接不存在
- `4603`: 权限不足：只有管理员可以执行此操作（clientId 不在管理员列表中）
- `9000`: 系统内部错误

**注意**：
- 删除任务只会从后端数据库中移除任务记录，不会影响 OCR 服务器上正在运行的任务
- 建议只删除已完成（completed）、失败（failed）或已取消（cancelled）的任务
- 删除操作会被记录到管理员操作日志中

### 服务端消息类型

#### 1. 连接成功 (connected)

连接建立后，服务器会发送连接成功消息：

```json
{
  "type": "connected",
  "data": {
    "clientId": "ws_1763126752982_bd89ezv7jer",
    "message": "WebSocket连接成功",
    "availableChannels": [
      "ocr:all"
    ],
    "boundClientId": null
  },
  "timestamp": 1763126753000
}
```

#### 2. 任务状态更新推送 (ocr_update)

当任务状态更新时，服务器会向订阅了 `ocr:all` 或 `ocr:task_{task_id}` 频道的客户端推送更新：

```json
{
  "type": "ocr_update",
  "channel": "ocr:all",
  "data": {
    "taskId": "task_001",
    "status": "running",
    "progress": 50,
    "result": null,
    "serverId": "ocr_server_001",
    "hostname": "my-ocr-machine",
    "timestamp": 1763126753000
  },
  "timestamp": 1763126753000
}
```

#### 3. 任务命令 (ocr_task_command) - OCR 服务器接收

当管理端发送启动或停止任务命令时，目标 OCR 服务器会收到此消息：

**启动任务命令**：
```json
{
  "type": "ocr_task_command",
  "data": {
    "command": "start",
    "taskName": "weapon",
    "params": {
      "cycle_count": 10
    }
  },
  "timestamp": 1763126753000
}
```

**停止任务命令**：
```json
{
  "type": "ocr_task_command",
  "data": {
    "command": "stop",
    "taskName": "weapon"
  },
  "timestamp": 1763126753000
}
```

**参数说明**：
- `command`: 命令类型（`start` 或 `stop`）
- `taskName`: 任务名称
- `params`: 任务参数（仅启动命令时有效）

### 可用频道

| 频道名称 | 说明 | 推送内容 |
|---------|------|---------|
| `ocr:all` | 所有 OCR 任务更新 | OCR 任务状态变化时推送 |
| `ocr:task_{task_id}` | 特定任务更新 | 指定任务的状态变化时推送（使用下划线命名） |

**注意**：
- 频道由 OCR 插件动态注册，连接成功后会通过 `connected` 消息返回可用频道列表
- 任务相关频道使用下划线命名规范：`ocr:task_{task_id}`
- 可以订阅特定任务频道以接收该任务的实时更新

### 心跳机制

OCR 任务管理系统使用统一的 WebSocket 协议层 ping/pong 机制，符合 ws 库官方标准：

**心跳机制说明**：
- **服务器心跳间隔**: 每 30 秒发送一次 ping 帧（可配置，默认 30000ms）
- **超时策略**: **错过 1 次 pong 响应即断开连接**（总超时 60 秒）
- **心跳响应**: 客户端应自动响应服务器发送的 ping 帧（大多数 WebSocket 库会自动处理）

**心跳方式**：
OCR 任务管理系统使用 WebSocket 协议层 ping/pong，无需额外配置：

- **WebSocket ping/pong（协议层）**：
  - 服务器通过 `ws.ping()` 发送 ping 帧，客户端自动回复 pong 帧
  - 大多数 WebSocket 库会自动处理，无需客户端代码
  - 当收到 pong 响应时，自动更新客户端活跃状态

**超时处理流程**：
```
正常流程：
T=0s:    客户端连接，isAlive = true
T=30s:   服务器发送 ping，设置 isAlive = false
T=30.1s: 客户端响应 pong，isAlive = true
T=60s:   服务器检查 isAlive = true ✓，发送新 ping

超时流程（错过 1 次即断开）：
T=0s:    客户端连接，isAlive = true
T=30s:   服务器发送 ping，设置 isAlive = false
T=30-60s: 客户端未响应 pong，isAlive 保持 false
T=60s:   服务器检查 isAlive = false ✗，立即断开连接
```

**客户端建议**：
- **推荐方式**：依赖 WebSocket 库自动处理协议层 ping/pong（大多数库会自动处理）
- **自动重连**：建议实现自动重连机制，处理连接断开情况

**配置参数**（在 `ocr-task-manager.yaml` 中）：
- `heartbeat.interval`: 心跳检查间隔（毫秒），默认 30000（30秒）
- `heartbeat.timeout`: 客户端超时时间（毫秒），默认 30000（30秒）

详细的心跳机制说明请参考 [连接管理 - 心跳机制](#连接管理) 章节。

### 任务管理功能

系统支持通过 WebSocket 直接管理 OCR 服务器任务，无需额外的管理端：

**管理端连接方式**：
- 使用普通 WebSocket 连接（无需 `type=ocr`）
- 连接后可以发送 `ocr_start_task`、`ocr_stop_task`、`ocr_get_status` 消息

**任务控制流程**：
1. 管理端连接到 WebSocket
2. 发送 `ocr_get_status` 查询所有 OCR 服务器状态
3. 使用 `serverId` 发送 `ocr_start_task` 或 `ocr_stop_task` 命令
4. 目标 OCR 服务器收到 `ocr_task_command` 消息并执行
5. OCR 服务器通过 `ocr_task_update` 上报任务状态
6. 管理端订阅 `ocr:all` 频道接收实时更新

**支持的任务类型**：
- `pipeline`: 全自动流水线
- `auto_mission`: 游戏导航
- `weapon`: 枪械识别
- `ammo`: 弹药识别
- `accessory`: 配件识别
- `collection`: 收集品识别
- `consumable`: 消耗品识别
- `key`: 钥匙识别
- `equipment`: 装备识别

### 注意事项

1. **认证和注册**：OCR 服务器连接后需发送 `ocr_auth` 消息进行认证，**推荐同时提供 `hostname` 参数完成注册**，一步到位
2. **serverId 唯一性**：每个 OCR 服务器应使用唯一的 `serverId` 进行识别
3. **心跳保活**：确保客户端能够自动响应服务器的 ping 帧（大多数 WebSocket 库会自动处理），保持连接活跃。**服务器采用官方标准：错过 1 次 pong 响应即断开连接**
4. **错误处理**：实现完善的错误处理和自动重连机制，处理网络波动和连接断开情况
5. **任务状态**：及时上报任务状态更新（通过 `ocr_task_update`），避免任务超时
6. **配置安全**：生产环境中务必修改默认的认证密钥（`authSecret`）和连接密钥（`connectionSecret`）
7. **管理端权限**：
   - 管理端必须使用 WebSocket 连接密钥连接（`ws://host/ws?type=ocr&key=your-connection-secret&clientId=your-admin-client-id`）
   - 提供的 `clientId` 必须在管理员列表中（`admin.yaml` 的 `adminUsers` 配置）
   - 只有管理员 clientId 才能执行任务管理操作（启动、停止、查询状态）
   - 所有管理操作都会记录到管理员操作日志中
8. **任务互斥**：建议 OCR 服务器实现任务互斥机制，确保同一时间只运行一个任务
