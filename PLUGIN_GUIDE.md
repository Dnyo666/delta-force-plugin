# 三角洲行动插件使用指南（v1.0.0）

## 📖 插件概述

三角洲行动插件是基于 Yunzai-Bot 的游戏数据查询插件，支持查询三角洲行动游戏的个人信息、战绩记录、货币状态、称号信息和流水记录等功能。

## 统一信息说明
1. 插件命令前缀为`#三角洲`和`^`，示例：`#三角洲QQ登陆`，`^QQ登陆`
2. 插件向接口请求需要认证，请求头里添加`Authorization`字段，值为`Bearer <APIKey>`，其中APIKey需要机器人主人在网页管理里获取
3. 游戏模式中，`mp`为全面战场，`sol`为烽火地带；`4`为烽火地带，`5`为全面战场
4. 现在处于测试阶段，后端API临时为:https://df-api.cduestc.fun

## 🚀 快速开始

### 1. 使用插件登陆获取 frameworkToken

在使用插件前，您需要先获取 通过插件的QQ/微信登陆获取`frameworkToken`：

1. 向机器人发送#三角洲QQ登陆（#三角洲登陆 QQ）或其他登陆指令
2. 在其他设备QQ/微信扫描二维码登陆所需绑定的三角洲账号
3. 机器人自动获取`frameworkToken`并使用绑定接口绑定到发送者QQ号
4. 后续可通过 #三角洲账号 指令查询绑定的账号信息；也可以通过 #三角洲解绑 ID，来解绑在图中展示的ID的frameworkToken

### 2. 账号管理

```
#三角洲账号
```
```
#三角洲绑定 <your_frameworkToken>
```
```
#三角洲解绑 <your_frameworkToken>
```

## 🎮 功能详解

### 1. 个人信息查询（/df/person/personalinfo）

**命令：** `#三角洲信息`

**功能：** 查看玩家的基本信息和统计数据

**API调用流程：**
1. 验证用户是否已绑定 frameworkToken
2. 通过配置文件获取APIKey，并添加到请求头
3. 调用个人信息接口获取用户信息
4. 渲染个人信息模板生成图片

**返回内容：**
- 用户基本信息（昵称、等级、头像等）
- 游戏统计数据（游戏时长、击杀数、胜率等）
- 当前状态信息

**数据对照：**  
```
"userData": {
                    "type": "object",
                    "properties": {
                        "picurl": {
                            "type": "string",
                            "description": "头像url"
                        },
                        "charac_name": {
                            "type": "string",
                            "description": "用户名（需要转义）"
                        }
                    },
                    "required": [
                        "picurl",
                        "charac_name"
                    ],
                    "x-apifox-orders": [
                        "picurl",
                        "charac_name"
                    ]
                },
                "careerData": {
                    "type": "object",
                    "properties": {
                        "result": {
                            "type": "integer"
                        },
                        "error_info": {
                            "type": "integer"
                        },
                        "rankpoint": {
                            "type": "string",
                            "description": "排位分数"
                        },
                        "tdmrankpoint": {
                            "type": "string",
                            "description": "全面战场排位分"
                        },
                        "soltotalfght": {
                            "type": "string",
                            "description": "总战局数"
                        },
                        "solttotalescape": {
                            "type": "string",
                            "description": "总撤离数"
                        },
                        "solduration": {
                            "type": "string",
                            "description": "游戏时长（s）"
                        },
                        "soltotalkill": {
                            "type": "string",
                            "description": "总击杀"
                        },
                        "solescaperatio": {
                            "type": "string",
                            "description": "撤离率"
                        },
                        "avgkillperminute": {
                            "type": "string",
                            "description": "分均击杀（全面战场）"
                        },
                        "tdmduration": {
                            "type": "string",
                            "description": "全面战场游戏时长（min）"
                        },
                        "tdmsuccessratio": {
                            "type": "string",
                            "description": "全面战场胜率"
                        },
                        "tdmtotalfight": {
                            "type": "string",
                            "description": "全面战场总对局"
                        },
                        "totalwin": {
                            "type": "string",
                            "description": "全面战场胜场"
                        },
                        "tdmtotalkill": {
                            "type": "integer",
                            "description": "全面战场总击杀"
                        }
                    },
                }
```
```
 "roleInfo": {
    "_webplat_msg": "1|3550870590954844384 浅巷墨黎6 |",
    "_webplat_msg_code": "0",
    "_webplat_msg_new": "1|3550870590954844384 浅巷墨黎6 -1 |",
    "accounttype": "2",
    "accumulatechargenum": "0",
    "adultstatus": "0",
    "bindedtrianglecoinnum": "0",
    "charac_name": "浅巷墨黎6", //账号名
    "countrybelonging": "156", //国家
    "countrycode": "156", //国家代码
    "exp": "19905", //经验值
    "guildid": "0", 
    "hafcoinnum": "6709123", //哈夫币
    "isbanspeak": "0", //是否禁言
    "isbanuser": "0", //是否封禁
    "islogined": "0", //是否正在登录
    "lastlogintime": "1753184801", //最近登录时间
    "lastlogouttime": "1753188025", //最近退出时间
    "latestchargetime": "0", //最近充值时间
    "level": "58", //等级
    "loginchannel": "10430644", //登录渠道
    "logintoday": "0", //登录天数
    "mpmandelbricknum": "6", //全面战场曼德尔砖破译次数
    "openid": "3550870590954844384", //openid
    "picurl": "http://thirdqq.qlogo.cn/ek_qqapp/AQJkg7g0pCia8MzMR3n8rx9suEE2KV0X2mp6e3WAeCAhJyuq6qwZJLsbutibD965FWrtsUAJwVQwqcAtwI9gkibXich30Ibaq3EbmqHGtlNzGGpxsMhNEC8/100", //头像url
    "playerage": "0", //玩家账号年龄
    "propcapital": "64219859", //仓库总值
    "register_time": "1745162501", //注册时间
    "registerchannel": "10025553", //注册渠道
    "result": "0",
    "solmandelbricknum": "2", //烽火地带曼德尔砖破译次数
    "tdmexp": "934111", //全面战场经验值
    "tdmlevel": "36", //全面战场等级
    "trianglecoinnum": "0",
    "uid": "36449129409045155615" //游戏内uid，可加好友
  },
```

**模板位置：** `resources/Template/delta-force-user-info/`

---

### 2. 个人数据查询（/df/person/personaldata）

**命令：** `#三角洲数据`

**功能：** 查看玩家的游戏统计数据

**API调用流程：**
1. 验证用户是否已绑定 frameworkToken
2. 通过配置文件获取APIKey，并添加到请求头
3. 调用个人数据接口获取用户信息
4. 渲染个人数据模板生成图片

**返回内容：**
- 用户基本信息（昵称、等级、头像等）
- 游戏统计数据（游戏时长、击杀数、胜率等）

**数据对照：**  
```烽火地带（sol）
"data": 
{
                            "type": "object",
                            "properties": {
                                "solDetail": {
                                    "type": "object",
                                    "properties": {
                                        "redTotalMoney": {
                                            "type": "integer",
                                            "description": "收藏大红价值"
                                        },
                                        "redTotalCount": {
                                            "type": "integer",
                                            "description": "收藏大红个数"
                                        },
                                        "mapList": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "mapID": {
                                                        "type": "integer",
                                                        "description": "地图ID\n2231零号大坝-前夜\n2201零号大坝-常规\n2202零号大坝-机密\n1901长弓溪谷-常规\n1902长弓溪谷-机密\n3901航天基地-机密\n3902航天基地-绝密\n8102巴克什-机密\n8103巴克什-绝密\n80-未知\n\n"
                                                    },
                                                    "totalCount": {
                                                        "type": "integer",
                                                        "description": "地图对局数"
                                                    },
                                                    "leaveCount": {
                                                        "type": "integer",
                                                        "description": "成功撤离数"
                                                    }
                                                },
                                                "required": [
                                                    "mapID",
                                                    "totalCount",
                                                    "leaveCount"
                                                ],
                                                "x-apifox-orders": [
                                                    "mapID",
                                                    "totalCount",
                                                    "leaveCount"
                                                ]
                                            },
                                            "description": "地图列表"
                                        },
                                        "redCollectionDetail": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "objectID": {
                                                        "type": "integer",
                                                        "description": "物品ID"
                                                    },
                                                    "count": {
                                                        "type": "integer",
                                                        "description": "数量"
                                                    },
                                                    "price": {
                                                        "type": "integer",
                                                        "description": "价值"
                                                    }
                                                },
                                                "required": [
                                                    "objectID",
                                                    "count",
                                                    "price"
                                                ],
                                                "x-apifox-orders": [
                                                    "objectID",
                                                    "count",
                                                    "price"
                                                ]
                                            },
                                            "description": "收藏大红收集信息"
                                        },
                                        "levelScore": {
                                            "type": "string",
                                            "description": "排位分数（烽火）"
                                        },
                                        "majorLevel": {
                                            "type": "string"
                                        },
                                        "majorLevelMax": {
                                            "type": "string"
                                        },
                                        "profitLossRatio": {
                                            "type": "string",
                                            "description": "赚损比"
                                        },
                                        "highKillDeathRatio": {
                                            "type": "string",
                                            "description": "战损比-绝密"
                                        },
                                        "lowKillDeathRatio": {
                                            "type": "string",
                                            "description": "战损比-常规"
                                        },
                                        "medKillDeathRatio": {
                                            "type": "string",
                                            "description": "战损比-机密"
                                        },
                                        "totalEscape": {
                                            "type": "string",
                                            "description": "总撤离数（烽火）"
                                        },
                                        "totalFight": {
                                            "type": "string",
                                            "description": "总对局数（烽火）"
                                        },
                                        "totalGainedPrice": {
                                            "type": "string",
                                            "description": "总获取（哈夫币）（烽火）"
                                        },
                                        "totalGameTime": {
                                            "type": "string",
                                            "description": "总游戏时长（s）（烽火）"
                                        },
                                        "totalKill": {
                                            "type": "string",
                                            "description": "总击杀（干员）（烽火）"
                                        },
                                        "userRank": {
                                            "type": "integer",
                                            "description": "好友排行（场均带出）（烽火）"
                                        },
                                        "gunPlayList": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "objectID": {
                                                        "type": "integer",
                                                        "description": "物品ID"
                                                    },
                                                    "escapeCount": {
                                                        "type": "integer",
                                                        "description": "枪械撤离数"
                                                    },
                                                    "fightCount": {
                                                        "type": "integer",
                                                        "description": "枪械场次"
                                                    },
                                                    "totalPrice": {
                                                        "type": "integer",
                                                        "description": "枪械场均价值"
                                                    }
                                                },
                                                "required": [
                                                    "objectID",
                                                    "escapeCount",
                                                    "fightCount",
                                                    "totalPrice"
                                                ],
                                                "x-apifox-orders": [
                                                    "objectID",
                                                    "escapeCount",
                                                    "fightCount",
                                                    "totalPrice"
                                                ]
                                            },
                                            "description": "枪械使用信息"
                                        }
                                    },
                                }
```
```全面战场（mp）
"data": {
                            "type": "object",
                            "properties": {
                                "mpDetail": {
                                    "type": "object",
                                    "properties": {
                                        "avgKillPerMinute": {
                                            "type": "string",
                                            "description": "分均击杀（除以100）"
                                        },
                                        "avgScorePerMinute": {
                                            "type": "string",
                                            "description": "分均得分"
                                        },
                                        "totalFight": {
                                            "type": "string",
                                            "description": "总战局"
                                        },
                                        "totalGameTime": {
                                            "type": "string",
                                            "description": "总游戏时长"
                                        },
                                        "totalScore": {
                                            "type": "string",
                                            "description": "总得分"
                                        },
                                        "totalVehicleDestroyed": {
                                            "type": "string",
                                            "description": "总破坏载具数"
                                        },
                                        "totalVehicleKill": {
                                            "type": "string",
                                            "description": "总载具击杀数"
                                        },
                                        "totalWin": {
                                            "type": "string",
                                            "description": "总胜场"
                                        },
                                        "levelScore": {
                                            "type": "string",
                                            "description": "排位分"
                                        },
                                        "majorLevel": {
                                            "type": "string",
                                            "description": "未知"
                                        },
                                        "majorLevelMax": {
                                            "type": "string",
                                            "description": "未知"
                                        },
                                        "winRatio": {
                                            "type": "string",
                                            "description": "胜率（此处省略了小数）"
                                        },
                                        "redTotalMoney": {
                                            "type": "integer",
                                            "description": "与全面战场无关"
                                        },
                                        "redTotalCount": {
                                            "type": "integer",
                                            "description": "与全面战场无关"
                                        },
                                        "mapList": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "mapID": {
                                                        "type": "integer",
                                                        "description": "地图ID\n107-沟壕战-攻防\n108-沟壕战-占领\n302-风暴眼-攻防\n303-风暴眼-占领\n54-攀升-攻防\n103-攀升-占领\n75-临界点-攻防\n"
                                                    },
                                                    "totalCount": {
                                                        "type": "integer",
                                                        "description": "地图对局数"
                                                    },
                                                    "leaveCount": {
                                                        "type": "integer",
                                                        "description": "地图获胜数（怎么能用烽火里的leave呢）"
                                                    }
                                                },
                                                "required": [
                                                    "mapID",
                                                    "totalCount",
                                                    "leaveCount"
                                                ],
                                                "x-apifox-orders": [
                                                    "mapID",
                                                    "totalCount",
                                                    "leaveCount"
                                                ]
                                            },
                                            "description": "地图信息"
                                        },
                                        "callVehicle": {
                                            "type": "integer",
                                            "description": "呼叫载具数"
                                        },
                                        "callRebirth": {
                                            "type": "integer",
                                            "description": "部署重生信标数"
                                        },
                                        "callMissile": {
                                            "type": "integer",
                                            "description": "呼叫制导导弹数"
                                        },
                                        "callRescue": {
                                            "type": "integer",
                                            "description": "呼叫救援数（忘了）"
                                        },
                                        "operatorList": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        }
```

**模板位置：** ``

---


### 2. 战绩记录查询（/df/person/record）

**命令：**
- `#三角洲战绩` - 查看烽火地带战绩（第1页）
- `#三角洲战绩 烽火/战场`;`#三角洲战绩 烽火地带/全面战场`;`#三角洲战绩 sol/mp/4/5`（做对应的转换） - 查看全面战场或烽火地带战绩
- `#三角洲战绩 2`;`#三角洲战绩 烽火 2`（以此类推） - 查看第2页战绩

**功能：** 查看玩家的历史战绩记录

**API调用流程：**
1. 解析命令参数（模式类型、页码）
2. 验证用户是否已绑定 frameworkToken
3. 通过配置文件获取APIKey，并添加到请求头
4. 调用战绩接口获取用户信息
5. 渲染战绩模板生成图片

**支持的模式：**
- `4` - 烽火地带
- `5` - 全面战场

**返回内容：**
- 战绩列表（地图ID、游戏时间、比赛结果）
- 详细统计（击杀、死亡、助攻、伤害等）
- 队伍信息（多人模式）
- 分页信息

**数据对照：**
```烽火地带
"data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "MapId": {
                                "type": "string",
                                "description": "地图ID\n地图ID\n2231零号大坝-前夜\n2201零号大坝-常规\n2202零号大坝-机密\n1901长弓溪谷-常规\n1902长弓溪谷-机密\n3901航天基地-机密\n3902航天基地-绝密\n8102巴克什-机密\n8103巴克什-绝密\n8803-潮汐监狱-绝密"
                            },
                            "EscapeFailReason": {
                                "type": "integer",
                                "description": "撤离失败原因\n1-撤离成功\n2-撤离失败-真人击杀\n3-撤离失败-人机击杀\n"
                            },
                            "FinalPrice": {
                                "type": "string",
                                "description": "带出价值"
                            },
                            "KeyChainCarryOutPrice": {
                                "type": "string",
                                "description": "和上面一样"
                            },
                            "CarryoutSafeBoxPrice": {
                                "type": "integer",
                                "description": "0"
                            },
                            "KeyChainCarryInPrice": {
                                "type": "integer",
                                "description": "0"
                            },
                            "CarryoutSelfPrice": {
                                "type": "integer",
                                "description": "0"
                            },
                            "dtEventTime": {
                                "type": "string",
                                "description": "对局时间"
                            },
                            "ArmedForceId": {
                                "type": "integer",
                                "description": "干员ID\n10007-红狼\n10010-威龙\n10011-无名\n20003-蜂医\n20004-蛊\n30008-牧羊人\n30010-未知\n40005-露娜\n40010-骇爪"
                            },
                            "DurationS": {
                                "type": "integer",
                                "description": "存活时间"
                            },
                            "KillCount": {
                                "type": "integer",
                                "description": "击败干员"
                            },
                            "KillPlayerAICount": {
                                "type": "integer",
                                "description": "击败AI玩家（只有常规大坝2201有）"
                            },
                            "KillAICount": {
                                "type": "integer",
                                "description": "击杀其他敌方"
                            },
                            "teammateArr": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "ArmedForceId": {
                                            "type": "integer",
                                            "description": "干员ID\n10007-红狼\n10010-威龙\n10011-无名\n20003-蜂医\n20004-蛊\n30008-牧羊人\n30010-未知\n40005-露娜\n40010-骇爪\n"
                                        },
                                        "EscapeFailReason": {
                                            "type": "integer",
                                            "description": "撤离失败原因\n1-撤离成功\n2-撤离失败-真人击杀\n3-撤离失败-人机击杀\n"
                                        },
                                        "dtEventTime": {
                                            "type": "string",
                                            "description": "对局时间"
                                        },
                                        "MapId": {
                                            "type": "string",
                                            "description": "地图ID"
                                        },
                                        "FinalPrice": {
                                            "type": "string",
                                            "description": "带出价值"
                                        },
                                        "KeyChainCarryOutPrice": {
                                            "type": "string",
                                            "description": "和上面一样"
                                        },
                                        "CarryoutSafeBoxPrice": {
                                            "type": "integer",
                                            "description": "0"
                                        },
                                        "KeyChainCarryInPrice": {
                                            "type": "integer",
                                            "description": "0"
                                        },
                                        "CarryoutSelfPrice": {
                                            "type": "integer",
                                            "description": "0"
                                        },
                                        "vopenid": {
                                            "type": "boolean",
                                            "description": "是否开麦"
                                        },
                                        "TeamId": {
                                            "type": "string",
                                            "description": "队伍ID"
                                        },
                                        "DurationS": {
                                            "type": "integer",
                                            "description": "存活时间"
                                        },
                                        "KillCount": {
                                            "type": "integer",
                                            "description": "击败干员"
                                        },
                                        "KillAICount": {
                                            "type": "integer",
                                            "description": "击杀其他敌方"
                                        },
                                        "KillPlayerAICount": {
                                            "type": "integer",
                                            "description": "击败AI玩家（只有常规大坝2201有）"
                                        },
                                        "Rescue": {
                                            "type": "integer",
                                            "description": "救助次数"
                                        },
                                        "nickName": {
                                            "type": "string",
                                            "description": "昵称（均为空不展示）"
                                        }
                                    },
                                }
```
```全面战场
"data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "MapID": {
                                "type": "string",
                                "description": "地图ID\n107-沟壕战-攻防\n108-沟壕战-占领\n302-风暴眼-攻防\n303-风暴眼-占领\n54-攀升-攻防\n103-攀升-占领\n75-临界点-攻防"
                            },
                            "MatchResult": {
                                "type": "integer",
                                "description": "比赛结果（1胜利、2失败、3中途退出）"
                            },
                            "dtEventTime": {
                                "type": "string",
                                "description": "对局时间"
                            },
                            "KillNum": {
                                "type": "integer",
                                "description": "击杀数"
                            },
                            "Death": {
                                "type": "integer",
                                "description": "死亡数"
                            },
                            "Assist": {
                                "type": "integer",
                                "description": "助攻数（协助）"
                            },
                            "TotalScore": {
                                "type": "integer",
                                "description": "总得分"
                            },
                            "KillPlayer": {
                                "type": "integer",
                                "description": "击杀玩家数"
                            },
                            "KilledByPlayer": {
                                "type": "integer",
                                "description": "被玩家击杀数"
                            },
                            "RoleId": {
                                "type": "string",
                                "description": "未知（固定值为3550870590954844384）"
                            },
                            "RoomId": {
                                "type": "string",
                                "description": "房间ID"
                            },
                            "gametime": {
                                "type": "integer",
                                "description": "游戏时长（s）"
                            },
                            "RescueTeammateCount": {
                                "type": "integer",
                                "description": "救援队友数"
                            },
                            "ArmedForceId": {
                                "type": "integer",
                                "description": "最终干员ID\n10007-红狼\n10010-威龙\n10011-无名\n20003-蜂医\n20004-蛊\n30008-牧羊人\n30010-未知\n40005-露娜\n40010-骇爪"
                            }
                        },
```
```全面战场roominfo
{
              "color": 1, //阵营（1哈夫克，2GTI）
              "killNum": 0, //击杀数
              "assist": 0, //助攻数
              "death": 1, //死亡数
              "mapID": 302, //地图ID
              "gameTime": 274, //游戏时长
              "startTime": "1752410950", //开始时间
              "rescueTeammateCount": 0, //救援队友数
              "totalScore": 175, //总得分
              "matchResult": 1, //比赛结果（1胜利、2失败、3中途退出）
              "nickName": "%E6%B6%9F%E9%9B%80", //昵称
              "rank": 0, //排名
              "armedForceType": 0, //干员ID
              "isCurrentUser": false, //是否当前玩家
              "isTeamMember": false, //是否队友
            },
```

**模板位置：** `resources/Template/delta-force-user-record/`

---

### 3. 货币信息查询（/df/person/money）

**命令：** `#三角洲货币`；`#三角洲余额`

**功能：** 查看玩家的货币和道具信息

**API调用流程：**
1. 验证用户是否已绑定 frameworkToken
2. 通过配置文件获取APIKey，并添加到请求头
3. 调用货币接口获取用户信息
4. 渲染货币模板生成图片

**返回内容：**
- 各类货币数量（哈夫币、三角币、三角券等）

**模板位置：** `resources/Template/delta-force-user-money/`

---

### 4. 大红收藏海报

**命令：** `#三角洲海报`；`#三角洲大红海报`;`#三角洲藏品海报`;`#三角洲藏品`

**功能：** 查看玩家的藏品收藏情况

**实现流程**
1. 从个人数据接口中获取         
"redTotalMoney": 21453893,
"redTotalCount": 36,
"redCollectionDetail"
三个字段的数据（其中objectid需要手动调用物品查询接口进行查询/df/object/search?id=15080050042，只用获取名字即可，价格和数量都在原字段有的）
2. 从称号接口获取大红称号:/df/person/title（需要frameworkToken）
3. 拼接海报，图片中展示称号内容，以及藏品内容

**API调用流程：**
1. 验证用户是否已绑定 frameworkToken
2. 通过配置文件获取APIKey，并添加到请求头
3. 调用个人数据接口获取藏品信息
4. 调用称号接口获取大红称号
5. 渲染藏品海报模板生成图片

**模板位置：** `resources/Template/delta-force-user-red/`

---

### 5. 流水记录查询

**命令：**
- `#三角洲流水 设备` - 查看指定流水记录（type对应：1-设备、2-道具、3-货币）
- `#三角洲流水 道具 2` - 查看指定流水第二页记录（type对应：1-设备、2-道具、3-货币）

**功能：** 查看玩家的指定流水记录

**API调用流程：**
1. 解析页码和类型参数
2. 验证用户是否已绑定 frameworkToken
3. 通过配置文件获取APIKey，并添加到请求头
4. 调用流水记录接口（传入 page type参数）
5. 渲染流水模板生成图片

**返回内容：**
- 流水记录列表（类型、金额、描述、来源）
- 分类统计（收入、支出、净额）
- 时间戳信息

**模板位置：** `resources/Template/delta-force-user-flows/`

---

### 6. 帮助信息

**命令：** `#三角洲帮助`;`#三角洲菜单`；`^菜单`;`^帮助`

**功能：** 显示插件的使用帮助

**返回内容：** 图片格式的命令列表和使用说明

## 🔧 技术实现

### API 接口

插件使用以下 API 接口：

| 接口 | 路径 | 功能 |
|------|------|------|
| 登录 | `/login/qq/qr` | 获取登陆二维码（QQ） |
| 登录 | `/login/qq/status` | 登录status（QQ） |
| 登录 | `/login/wechat/qr` | 获取登陆二维码（微信） |
| 登录 | `/login/wechat/status` | 登录status（微信） |
| 个人信息 | `/df/person/personalInfo` | 获取用户基本信息 |
| 个人数据 | `/df/person/personalData` | 获取用户游戏数据 |
| 货币信息 | `/df/person/money` | 获取货币和道具 |
| 战绩记录 | `/df/person/record` | 获取战绩数据 |
| 称号信息 | `/df/person/title` | 获取称号数据 |
| 流水记录 | `/df/person/flows` | 获取流水数据 |

### 存储
1. 用户
- **Redis 键名格式：** `delta-force:token:{user_id}`
- **过期时间：** 永久
- **存储内容：** 用户的 frameworkToken

2. 静态资源
- **文件**：分为渲染元素；物品道具图片；干员图片等静态资源
- **目录**：/插件目录/resources

### 错误处理

插件包含完整的错误处理机制：

1. **Token 验证失败**
   - 提示用户重新绑定账号
   - 显示具体错误信息

2. **网络请求失败**
   - 自动重试机制
   - 超时处理
   - 代理支持

3. **API 响应错误**
   - 解析 API 返回的错误信息
   - 用户友好的错误提示

4. **渲染失败**
   - 模板渲染异常处理
   - 降级到文本回复

## 🎨 UI设计

### 模板特性（插件图片渲染）

- **puppeteer** 使用云崽通用渲染组件
- **现代化UI：** 使用组合背景和卡片布局
- **数据可视化：** 进度条、统计图表
- **品牌一致性：** 统一的色彩方案和字体

### 样式规范

- **主色调：** 白绿组合 ( #F2F2F2 → #0FF796)
- **字体：** Microsoft YaHei, Arial, sans-serif
- **圆角：** 8px-15px
- **阴影：** 0 4px 15px #636867

## ⚙️ 配置选项

### 基础配置 (config_default.yaml)

```yaml
# API 配置
delta_force:
    api_key: "sk-xxxxxxx" #在管理网页创建
    clientID: "xxxxxx" #从管理网页复制用户ID
    其他可能遇到的配置

## 🚨 常见问题

### Q1: 提示 "frameworkToken无效或已过期"
**A:** 重新获取 frameworkToken 并使用 `#三角洲登录` 命令重新绑定

### Q2: 显示 "网络问题"
**A:** 检查网络连接

### Q3: 图片生成失败
**A:** 检查模板文件是否完整，或联系管理员检查渲染服务

### Q4: 数据显示不完整
**A:** 可能是 API 返回数据异常，稍后重试或联系技术支持

## 📝 使用流程图

```
用户输入命令
    ↓
解析命令参数    ->          公共接口
    ↓                       ↓
个人数据接口             读取配置文件api_key
    ↓                       ↓
检查用户绑定状态            添加请求头
    ↓                       ↓
从redis获取 frameworkToken 向后端API请求
    ↓                       ↓
使用 frameworkToken        获得数据
    ↓                       ↓
读取配置文件api_key
    ↓                       ↓
添加请求头
    ↓                     渲染对应模板
向后端API请求
    ↓                       ↓
获得数据
    ↓                       ↓
渲染对应模板
    ↓                       ↓
返回图片或错误信息        返回图片或错误信息
```

## 🔄 更新日志

### v1.0.0
- 初始版本发布
- 支持基础的数据查询功能
- 完整的模板渲染系统
- 错误处理机制

---

**注意：** 本插件仅供学习和研究使用，请遵守相关服务条款和法律法规。