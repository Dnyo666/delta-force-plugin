# Apps 目录结构说明

本文档说明 `apps/` 目录下各功能模块的组织结构。插件启动时会自动递归加载该目录下的所有 `.js` 文件。

## 目录分类

### account/ - 账号管理
- `Account.js` - 账号管理（绑定、解绑、切换等）
- `Login.js` - 登录相关（QQ/微信/WeGame等登录方式）

### info/ - 个人信息查询
- `Info.js` - 个人信息查询
- `Data.js` - 个人数据查询
- `Stats.js` - 统计数据
- `Money.js` - 货币信息
- `Flows.js` - 交易流水
- `Collection.js` - 藏品查询
- `red.js` - 出红记录/大红收藏
- `banhistory.js` - 封号记录
- `PlaceInfo.js` - 特勤处信息查询（设施升级信息）
- `OperatorList.js` - 干员列表查询
- `Operator.js` - 干员信息查询
- `HealthInfo.js` - 健康状态信息查询（游戏内健康状态）
- `health.js` - 服务器状态查询（API服务器运行状态）
- `MapStats.js` - 地图统计查询（支持烽火地带和全面战场）

### report/ - 战报相关
- `Daily.js` - 日报
- `Weekly.js` - 周报
- `Record.js` - 战绩查询
- `RecordSubscription.js` - 战绩订阅

### push/ - 推送功能
- `DailyPush.js` - 日报推送
- `WeeklyPush.js` - 周报推送
- `PlaceTask.js` - 特勤处任务推送
- `placestatus.js` - 特勤处状态
- `Notification.js` - 广播通知
- `Task.js` - 定时任务（每日密码推送等）

### tools/ - 工具类
- `Calculator.js` - 计算器（伤害、维修计算）
- `Price.js` - 价格查询
- `Object.js` - 物品查询
- `Tools.js` - 实用工具（每日密码、文章等）
- `SolutionV2.js` - 改枪码
- `Room.js` - 房间管理
- `AIEvaluation.js` - AI评价（支持选择预设）

### entertainment/ - 娱乐功能
- `Voice.js` - 语音功能
- `TTS.js` - TTS语音合成（角色语音合成）
- `Music.js` - 音乐功能

### system/ - 系统功能
- `Help.js` - 帮助菜单
- `Update.js` - 更新功能
- `WebSocketClient.js` - WebSocket客户端

