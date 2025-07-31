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
            { icon: 49, title: "#三角洲微信刷新", desc: "刷新微信token" },
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
            { icon: 61, title: "#三角洲ai锐评", desc: "使用AI锐评战绩等数据" }
        ]
    },
    {
        group: "游戏数据",
        list: [
            { icon: 41, title: "#三角洲藏品", desc: "查询个人仓库中的皮肤、饰品等非货币资产" },
            { icon: 48, title: "#三角洲货币", desc: "查询游戏内货币信息" },
            { icon: 53, title: "#三角洲流水 [类型] [页码]", desc: "查询交易流水，类型可选：设备/道具/货币" },
            { icon: 55, title: "#三角洲数据 [模式] [赛季数字]", desc: "查询个人统计数据，支持模式和赛季参数" },
            { icon: 66, title: "#三角洲战绩 [模式] [页码]", desc: "查询战绩，模式可选：全面/烽火/页码" }
        ]
    },
    {
        group: "战报统计",
        list: [
            { icon: 86, title: "#三角洲日报 [模式]", desc: "查询三角洲行动日报数据，模式可选：全面/烽火" },
            { icon: 86, title: "#三角洲周报 [模式] [日期] [展示/不展示]", desc: "查询每周战报，支持多参数" }
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
        group: "其他/帮助",
        list: [
            { icon: 92, title: "#三角洲(强制)更新", desc: "更新三角洲插件" },
            { icon: 85, title: "#三角洲帮助", desc: "显示本帮助菜单" }
        ]
    }
]