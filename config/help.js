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
        group: "所有命令中的 #三角洲 都可以替换成 ^ 例如 ^帮助 和 #三角洲帮助",
    },
    {
        group: "账号管理",
        list: [
            { icon: 80, title: "#三角洲账号", desc: "查看已绑定token" },
            { icon: 71, title: "#三角洲账号切换 [序号]", desc: "激活指定序号账号" },
            { icon: 48, title: "#三角洲解绑 [序号]", desc: "解绑指定序号token" },
            { icon: 47, title: "#三角洲删除 [序号]", desc: "删除QQ/微信登录数据" },
            { icon: 49, title: "#三角洲微信刷新", desc: "刷新微信token" },
            { icon: 50, title: "#三角洲QQ刷新", desc: "刷新QQ token" },
            { icon: 76, title: "#三角洲角色绑定 [token]", desc: "手动绑定token" }
        ]
    },
    {
        group: "账号登录",
        list: [
            { icon: 64, title: "#三角洲QQ登陆", desc: "通过QQ扫码登录" },
            { icon: 63, title: "#三角洲微信登陆", desc: "通过微信扫码登录" },
            { icon: 62, title: "#三角洲WeGame登陆", desc: "通过qq扫码登陆wegame" },
            { icon: 76, title: "#三角洲wegame微信登陆", desc: "通过微信扫码登陆wegame" },
            { icon: 61, title: "#三角洲安全中心登陆", desc: "通过安全中心扫码登录" },
            { icon: 71, title: "#三角洲ck登陆", desc: "获取ck登陆帮助" },
            { icon: 80, title: "#三角洲ck登陆 [cookies]", desc: "通过cookie登陆" }
        ]
    },
    {
        group: "个人信息",
        list: [
            { icon: 78, title: "#三角洲信息", desc: "查询个人详细信息" },
            { icon: 71, title: "#三角洲UID", desc: "查询个人UID" },
        ]
    },
    {
        group: "实用工具",
        list: [
            { icon: 61, title: "#三角洲ai锐评", desc: "使用AI锐评战绩等数据" },
            { icon: 41, title: "#三角洲违规记录", desc: "登陆QQ安全中心后可查询历史违规" },
            { icon: 48, title: "#三角洲特勤处状态", desc: "查询特勤处制造状态"},
            { icon: 86, title: "#三角洲开启特勤处推送", desc: "开启制造完成推送，需主人开启配置"},
            { icon: 71, title: "#三角洲物品列表 [一级分类] [二级分类] [页码]", desc: "获取物品列表，默认props/collection"},
            { icon: 86, title: "#三角洲物品搜索 名称/ID", desc: "搜索游戏内物品"},
            { icon: 48, title: "#三角洲大红收藏 [赛季数字]", desc: "生成大红收集海报，支持赛季参数"}
        ]
    },
    {
        group: "游戏数据",
        list: [
            { icon: 41, title: "#三角洲藏品", desc: "查询个人仓库中的皮肤、饰品等非货币资产" },
            { icon: 48, title: "#三角洲货币", desc: "查询游戏内货币信息" },
            { icon: 53, title: "#三角洲流水 [类型] [页码]", desc: "查询交易流水，类型可选：设备/道具/货币" },
            { icon: 55, title: "#三角洲数据 [模式] [赛季数字]", desc: "查询个人统计数据，支持模式和赛季参数" },
            { icon: 66, title: "#三角洲战绩 [模式] [页码]", desc: "查询战绩，模式可选：全面/烽火/页码" },
            { icon: 79, title: "#三角洲出红记录", desc: "查询所有藏品解锁记录列表" },
            { icon: 79, title: "#三角洲出红记录 [物品名]", desc: "查询指定物品的解锁记录" }
        ]
    },
    {
        group: "战报统计",
        list: [
            { icon: 86, title: "#三角洲日报 [模式]", desc: "查询三角洲行动日报数据，模式可选：全面/烽火" },
            { icon: 86, title: "#三角洲周报 [模式] [日期] [展示/不展示]", desc: "查询每周战报，支持多参数" },
            { icon: 86, title: "#三角洲开启日报推送", desc: "在本群开启日报推送"},
            { icon: 37, title: "#三角洲开启周报推送", desc: "在本群开启周报推送"},
        ]
    },
    {
        group: "房间管理",
        list: [
            { icon: 28, title: "#三角洲房间列表", desc: "查询房间列表" },
            { icon: 23, title: "#三角洲创建房间", desc: "创建房间" },
            { icon: 26, title: "#三角洲加入房间 [房间号]", desc: "加入房间" },
            { icon: 37, title: "#三角洲退出房间 [房间号]", desc: "退出房间" },
            { icon: 56, title: "#三角洲踢人 [序号]", desc: "踢人" },
            { icon: 64, title: "#三角洲房间信息", desc: "查询房间信息" },
            { icon: 62, title: "#三角洲房间地图列表", desc: "查询房间地图列表" },
            { icon: 78, title: "#三角洲房间标签列表", desc: "查询房间标签列表" }
        ]
    },
    {
        group: "社区改枪码",
        list: [
            { icon: 86, title: "^改枪码上传 [改枪码] [描述] [模式] [是否公开] [配件信息]", desc: "上传改枪方案" },
            { icon: 86, title: "^改枪码列表 [武器名] ", desc: "查询改枪方案列表" },
            { icon: 86, title: "^改枪码详情 [方案ID]", desc: "查询改枪方案详情" },
            { icon: 86, title: "^改枪码点赞 [方案ID]", desc: "点赞改枪方案" },
            { icon: 86, title: "^改枪码点踩 [方案ID]", desc: "点踩改枪方案" },
            { icon: 86, title: "^改枪码收藏 [方案ID]", desc: "收藏改枪方案" },
            { icon: 86, title: "^改枪码删除 [方案ID]", desc: "删除改枪方案" },
            { icon: 78, tilte: "网站上传修改", desc: "https://df.shallow.ink/solutions"}
        ]
    },
    {
        group: "价格/利润查询",
        list: [
            { icon: 61, title: "#三角洲价格历史 [物品名/ID]", desc: "查询物品历史价格变化" },
            { icon: 61, title: "#三角洲当前价格 [物品名/ID]", desc: "查询物品当前市场价格" },
            { icon: 61, title: "#三角洲材料价格 [物品ID]", desc: "查询制造材料最低价格" },
            { icon: 61, title: "#三角洲利润历史 [物品名/ID/场所]", desc: "查询制造利润历史记录" },
            { icon: 61, title: "#三角洲利润排行 [类型] [场所] [数量]", desc: "查询利润排行榜V1" },
            { icon: 61, title: "#三角洲最高利润 [类型] [场所] [物品ID]", desc: "查询最高利润排行榜V2(今日vs昨日)" },
            { icon: 62, title: "#三角洲特勤处利润 [类型]", desc: "查询特勤处四个场所利润TOP3" }
        ]
    },
    {
        group: "语音娱乐",
        list: [
            { icon: 87, title: "#三角洲语音", desc: "随机播放语音" },
            { icon: 87, title: "#三角洲语音 [角色名/标签]", desc: "播放指定内容" },
            { icon: 87, title: "#三角洲语音 [角色] [场景]", desc: "播放指定场景语音" },
            { icon: 87, title: "#三角洲语音 [角色] [场景] [动作]", desc: "播放指定动作语音" },
            { icon: 78, title: "#三角洲语音列表", desc: "查看所有可用角色" },
            { icon: 79, title: "#三角洲标签列表", desc: "查看特殊语音标签" },
            { icon: 86, title: "#三角洲语音统计", desc: "查看音频统计信息" }
        ]
    },
    {
        group: "其他/帮助",
        list: [
            { icon: 92, title: "#三角洲(强制)更新", desc: "更新三角洲插件" },
            { icon: 92, title: "#三角洲更新日志", desc: "三角洲插件更新日志" },
            { icon: 85, title: "#三角洲帮助", desc: "显示本帮助菜单" },
            { icon: 92, title: "#三角洲服务器状态", desc: "查询后端服务器运行状态和集群信息"},
        ]
    }
]