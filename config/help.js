export const helpCfg = {
    "title": "三角洲行动 帮助",
    "subTitle": "DeltaForce-Plugin HELP",
    "colWidth": 265,
    "theme": "all",
    "themeExclude": ["default"],
    "colCount": 3,
    "bgBlur": true
}
export const helpList = [
    {
        group: "所有命令统一使用 ^ 前缀，例如 ^帮助",
    },
    {
        group: "账号管理",
        list: [
            { icon: 80, title: "^账号", desc: "查看已绑定token列表" },
            { icon: 71, title: "^账号切换 [序号]", desc: "激活指定序号账号" },
            { icon: 48, title: "^解绑 [序号]", desc: "解绑指定序号token" },
            { icon: 47, title: "^删除 [序号]", desc: "删除QQ/微信登录数据" },
            { icon: 49, title: "^微信刷新", desc: "刷新微信token" },
            { icon: 50, title: "^QQ刷新", desc: "刷新QQ token" },
            { icon: 86, title: "^绑定 [token]", desc: "绑定token" }
        ]
    },
    {
        group: "账号登录",
        list: [
            { icon: 64, title: "^QQ登陆", desc: "通过QQ扫码登录" },
            { icon: 63, title: "^微信登陆", desc: "通过微信扫码登录" },
            { icon: 62, title: "^WeGame登陆", desc: "通过QQ扫码登录WeGame" },
            { icon: 76, title: "^wegame微信登陆", desc: "通过微信扫码登录WeGame" },
            { icon: 61, title: "^安全中心登陆", desc: "通过安全中心扫码登录" },
            { icon: 71, title: "^QQ授权登陆 [code]", desc: "通过QQ授权码登录" },
            { icon: 63, title: "^微信授权登陆 [code]", desc: "通过微信授权码登录" },
            { icon: 52, title: "^网页登陆", desc: "通过网页方式登录" },
            { icon: 71, title: "^ck登陆", desc: "获取ck登陆帮助" },
            { icon: 80, title: "^ck登陆 [cookies]", desc: "通过cookie登陆" }
        ]
    },
    {
        group: "个人信息",
        list: [
            { icon: 78, title: "^信息", desc: "查询个人详细信息" },
            { icon: 71, title: "^UID", desc: "查询个人UID" },
            { icon: 85, title: "^用户统计", desc: "查看用户统计数据" }
        ]
    },
    {
        group: "计算工具",
        list: [
            { icon: 61, title: "^伤害计算", desc: "开始伤害计算对话" },
            { icon: 61, title: "^伤害 [参数]", desc: "快捷伤害计算（一条指令完成）" },
            { icon: 33, title: "^战备计算", desc: "计算最低成本卡战备配装" },
            { icon: 51, title: "^维修计算", desc: "开始维修计算对话" },
            { icon: 51, title: "^修甲 [参数]", desc: "快捷维修计算（一条指令完成）" },
            { icon: 48, title: "^取消计算", desc: "取消当前计算对话" },
            { icon: 54, title: "^计算帮助", desc: "查看计算器使用帮助" },
            { icon: 55, title: "^计算映射表", desc: "查看计算映射表" }
        ]
    },
    {
        group: "游戏数据",
        list: [
            { icon: 41, title: "^藏品", desc: "查询个人仓库中的皮肤、饰品等非货币资产" },
            { icon: 48, title: "^货币", desc: "查询游戏内货币信息" },
            { icon: 53, title: "^流水 [类型] [页码]", desc: "查询交易流水，类型可选：设备/道具/货币" },
            { icon: 55, title: "^数据 [模式] [赛季数字]", desc: "查询个人统计数据，支持模式和赛季参数" },
            { icon: 66, title: "^战绩 [模式] [页码]", desc: "查询战绩，模式可选：全面/烽火/页码" },
            { icon: 79, title: "^出红记录", desc: "查询所有藏品解锁记录列表" },
            { icon: 79, title: "^出红记录 [物品名]", desc: "查询指定物品的解锁记录" },
            { icon: 42, title: "^昨日收益 [模式]", desc: "查询昨日收益和物资统计" }
        ]
    },
    {
        group: "战报统计",
        list: [
            { icon: 86, title: "^日报 [模式]", desc: "查询三角洲行动日报数据，模式可选：全面/烽火" },
            { icon: 86, title: "^周报 [模式] [日期] [展示/不展示]", desc: "查询每周战报，支持多参数" },
            { icon: 86, title: "^开启日报推送", desc: "在本群开启日报推送" },
            { icon: 37, title: "^关闭日报推送", desc: "在本群关闭日报推送" },
            { icon: 37, title: "^开启周报推送", desc: "在本群开启周报推送" },
            { icon: 37, title: "^关闭周报推送", desc: "在本群关闭周报推送" }
        ]
    },
    {
        group: "推送管理",
        list: [
            { icon: 86, title: "^开启每日密码推送", desc: "开启每日密码推送" },
            { icon: 37, title: "^关闭每日密码推送", desc: "关闭每日密码推送" },
            { icon: 86, title: "^开启特勤处推送", desc: "开启特勤处制造完成推送" },
            { icon: 37, title: "^关闭特勤处推送", desc: "关闭特勤处推送" },
            { icon: 46, title: "^每日密码", desc: "查询今日密码" }
        ]
    },
    {
        group: "广播通知",
        list: [
            { icon: 61, title: "^广播开启", desc: "开启广播通知接收（仅主人）" },
            { icon: 48, title: "^广播关闭", desc: "关闭广播通知接收（仅主人）" },
            { icon: 78, title: "^广播状态", desc: "查看广播通知设置状态（仅主人）" }
        ]
    },
    {
        group: "价格/利润查询",
        list: [
            { icon: 61, title: "^价格历史 [物品名/ID]", desc: "查询物品历史价格变化" },
            { icon: 61, title: "^当前价格 [物品名/ID]", desc: "查询物品当前市场价格" },
            { icon: 61, title: "^材料价格 [物品ID]", desc: "查询制造材料最低价格" },
            { icon: 61, title: "^利润历史 [物品名/ID/场所]", desc: "查询制造利润历史记录" },
            { icon: 61, title: "^利润排行 [类型] [场所] [数量]", desc: "查询利润排行榜V1" },
            { icon: 61, title: "^最高利润 [类型] [场所] [物品ID]", desc: "查询最高利润排行榜V2(今日vs昨日)" },
            { icon: 62, title: "^特勤处利润 [类型]", desc: "查询特勤处四个场所利润TOP3" }
        ]
    },
    {
        group: "房间管理",
        list: [
            { icon: 28, title: "^房间列表", desc: "查询房间列表" },
            { icon: 23, title: "^创建房间", desc: "创建房间" },
            { icon: 26, title: "^加入房间 [房间号]", desc: "加入房间" },
            { icon: 37, title: "^退出房间 [房间号]", desc: "退出房间" },
            { icon: 56, title: "^踢人 [序号]", desc: "踢出房间成员" },
            { icon: 64, title: "^房间信息", desc: "查询当前房间信息" },
            { icon: 62, title: "^房间地图列表", desc: "查询房间地图列表" },
            { icon: 78, title: "^房间标签列表", desc: "查询房间标签列表" }
        ]
    },
    {
        group: "社区改枪码",
        list: [
            { icon: 86, title: "^改枪码上传 [改枪码] [描述] [模式] [是否公开] [配件信息]", desc: "上传改枪方案" },
            { icon: 86, title: "^改枪码列表 [武器名]", desc: "查询改枪方案列表" },
            { icon: 86, title: "^改枪码详情 [方案ID]", desc: "查询改枪方案详情" },
            { icon: 86, title: "^改枪码点赞 [方案ID]", desc: "点赞改枪方案" },
            { icon: 86, title: "^改枪码点踩 [方案ID]", desc: "点踩改枪方案" },
            { icon: 86, title: "^改枪码收藏 [方案ID]", desc: "收藏改枪方案" },
            { icon: 86, title: "^改枪码取消收藏 [方案ID]", desc: "取消收藏改枪方案" },
            { icon: 86, title: "^改枪码收藏列表", desc: "查看已收藏的改枪方案" },
            { icon: 86, title: "^改枪码更新 [方案ID] [参数]", desc: "更新已上传的改枪方案" },
            { icon: 86, title: "^改枪码删除 [方案ID]", desc: "删除自己上传的改枪方案" },
            { icon: 78, title: "网站上传修改", desc: "https://df.shallow.ink/solutions" }
        ]
    },
    {
        group: "实用工具",
        list: [
            { icon: 61, title: "^ai锐评 [模式]", desc: "使用AI锐评烽火地带和全面战场" },
            { icon: 41, title: "^违规记录", desc: "登录QQ安全中心后可查询历史违规" },
            { icon: 48, title: "^特勤处状态", desc: "查询特勤处制造状态" },
            { icon: 71, title: "^物品列表 [一级分类] [二级分类] [页码]", desc: "获取物品列表，默认props/collection" },
            { icon: 86, title: "^物品搜索 [名称/ID]", desc: "搜索游戏内物品" },
            { icon: 48, title: "^大红收藏 [赛季数字]", desc: "生成大红收集海报，支持赛季参数" },
            { icon: 40, title: "^文章列表", desc: "查看文章列表" },
            { icon: 40, title: "^文章详情 [ID]", desc: "查看指定文章详情" }
        ]
    },
    {
        group: "语音娱乐",
        list: [
            { icon: 87, title: "^语音", desc: "随机播放语音" },
            { icon: 87, title: "^语音 [角色名/标签]", desc: "播放指定内容" },
            { icon: 87, title: "^语音 [角色] [场景]", desc: "播放指定场景语音" },
            { icon: 87, title: "^语音 [角色] [场景] [动作]", desc: "播放指定动作语音" },
            { icon: 78, title: "^语音列表", desc: "查看所有可用角色" },
            { icon: 92, title: "^语音分类", desc: "查看语音分类信息" },
            { icon: 79, title: "^标签列表", desc: "查看特殊语音标签" },
            { icon: 86, title: "^语音统计", desc: "查看音频统计信息" },
            { icon: 87, title: "^鼠鼠音乐", desc: "随机播放鼠鼠音乐" },
            { icon: 87, title: "^鼠鼠音乐 [关键词]", desc: "搜索并播放音乐" },
            { icon: 88, title: "^鼠鼠音乐列表 [页码]", desc: "查看热度排行榜" },
            { icon: 98, title: "^鼠鼠语音", desc: "播放鼠鼠语音" },
            { icon: 89, title: "^鼠鼠歌单 [名称]", desc: "查看指定歌单" },
            { icon: 90, title: "^点歌 [序号]", desc: "播放列表中的歌曲" },
            { icon: 45, title: "^歌词", desc: "查看鼠鼠音乐歌词" },
            { icon: 78, title: "^音乐缓存统计", desc: "查看音乐缓存状态" },
            { icon: 48, title: "^清理音乐缓存", desc: "清空所有缓存(主人)" }
        ]
    },
    {
        group: "战绩订阅推送",
        list: [
            { icon: 86, title: "^订阅 战绩 [模式]", desc: "订阅战绩（模式：sol/mp/both）" },
            { icon: 80, title: "^取消订阅 战绩", desc: "取消战绩订阅" },
            { icon: 78, title: "^订阅状态 战绩", desc: "查看订阅和推送状态" },
            { icon: 61, title: "^开启私信订阅推送 战绩 [筛选]", desc: "开启私信推送（可选筛选条件）" },
            { icon: 48, title: "^关闭私信订阅推送 战绩", desc: "关闭私信推送" },
            { icon: 61, title: "^开启本群订阅推送 战绩 [筛选]", desc: "开启本群推送（可选筛选条件）" },
            { icon: 48, title: "^关闭本群订阅推送 战绩", desc: "关闭本群推送" },
            { icon: 79, title: "筛选条件", desc: "百万撤离/百万战损/天才少年" }
        ]
    },
    {
        group: "WebSocket连接",
        list: [
            { icon: 64, title: "^ws连接", desc: "手动连接WebSocket" },
            { icon: 37, title: "^ws断开", desc: "断开WebSocket连接" },
            { icon: 78, title: "^ws状态", desc: "查看WebSocket连接状态" }
        ]
    },
    {
        group: "其他/帮助",
        list: [
            { icon: 92, title: "^(强制)更新", desc: "更新三角洲插件" },
            { icon: 92, title: "^更新日志", desc: "查看三角洲插件更新日志" },
            { icon: 85, title: "^帮助", desc: "显示本帮助菜单" },
            { icon: 92, title: "^服务器状态", desc: "查询后端服务器运行状态和集群信息" }
        ]
    }
]
