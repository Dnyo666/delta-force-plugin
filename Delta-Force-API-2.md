---
title: Delta-Force-API
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Delta-Force-API

Base URLs:

# Authentication

# 业务/登陆

## GET QQ登陆-获取二维码

GET /login/qq/qr

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok",
  "token": "e5189938-1075-46f5-8986-d6d39c223d15",
  "qr_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABvAQAAAADKvqPNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVQ4jbXVMY6EMAwFUCOKdDMXQMo16LgSuQCBCyxXoss1IuUCS5fCwvszw+xqi4kpdkcUeUgosR17SH796A/JRN3N2KOPI5HX6KWjXpZMTljlaOwu7ET2rbvA7r7Zg+w1YmE/e3YX6MUumUfwPGSNiNeF8nyH/55IH/vAzU9iK8QW7dy35VQ5eoXIoawh3kxacqeRfSbq+Z4jUdQoa45Yu2DnnlV+DHYJacYdeHxb50zcBL4NeFpRiMxQE+LU22OwGmUP2Isn6vBGI9+FXO7wNJtKpJHJRIeXW1KJSF1OaylrqxF1T+tm14D2SSrvWAylQGcIVY6Gm4zMR5+fXVahHMbOZNdM00Aq15DQX9OAayCikCeMBRNRKaKyb5WlF5qNEIV/ZLLK0mUeNxCZD6ISMwelH8vLc0BVOJZ4cU+IzBWioDhY90qswgadu6FxnjWqETPns1xFTJJzBFWIeInSntv9Na7f89/+Jr4AIVqIAKNY7rMAAAAASUVORK5CYII=",
  "expire": 1753061367458
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» token|string|true|none||框架token，用于个人身份标识|
|» qr_image|string|true|none||登陆二维码base64|
|» expire|integer|true|none||none|

## GET QQ登陆-获取登陆状态

GET /login/qq/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "查询成功",
  "status": "pending",
  "qq": "",
  "expire": 1753061367458,
  "frameworkToken": "e5189938-1075-46f5-8986-d6d39c223d15"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» status|string|true|none||状态|
|» qq|string|true|none||扫码的QQ|
|» expire|integer|true|none||none|
|» frameworkToken|string|true|none||当前框架token|

## GET QQ登陆-token状态

GET /login/qq/token

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||ok|

## GET 微信登陆-获取二维码

GET /login/wechat/qr

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok",
  "frameworkToken": "b75c7ae7-6e3c-4904-84ee-aa92b1290fd4",
  "qr_image": "https://open.weixin.qq.com/connect/qrcode/071xV29w3uH1000o",
  "expire": 1753061548262
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» frameworkToken|string|true|none||框架token，用于个人身份标识|
|» qr_image|string|true|none||登陆二维码url|
|» expire|integer|true|none||none|

## GET 微信登陆-获取登陆状态

GET /login/wechat/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "查询成功",
  "status": "pending",
  "qq": "",
  "expire": 1753061367458,
  "frameworkToken": "e5189938-1075-46f5-8986-d6d39c223d15"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» status|string|true|none||状态|
|» qq|string|true|none||扫码的QQ|
|» expire|integer|true|none||none|
|» frameworkToken|string|true|none||当前框架token|

## GET 微信登陆-token状态

GET /login/wechat/token

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||ok|

## GET QQ安全中心登陆-获取二维码

GET /login/qqsafe/qr

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok",
  "frameworkToken": "b75c7ae7-6e3c-4904-84ee-aa92b1290fd4",
  "qr_image": "https://open.weixin.qq.com/connect/qrcode/071xV29w3uH1000o",
  "expire": 1753061548262
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» frameworkToken|string|true|none||框架token，用于个人身份标识|
|» qr_image|string|true|none||登陆二维码url|
|» expire|integer|true|none||none|

## GET QQ安全中心登陆-获取登陆状态

GET /login/qqsafe/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "查询成功",
  "status": "pending",
  "qq": "",
  "expire": 1753061367458,
  "frameworkToken": "e5189938-1075-46f5-8986-d6d39c223d15"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» status|string|true|none||状态|
|» qq|string|true|none||扫码的QQ|
|» expire|integer|true|none||none|
|» frameworkToken|string|true|none||当前框架token|

## GET QQ安全中心登陆-token状态

GET /login/qqsafe/token

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||ok|

## GET wegame登陆-获取二维码

GET /login/wegame/qr

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok",
  "frameworkToken": "b75c7ae7-6e3c-4904-84ee-aa92b1290fd4",
  "qr_image": "https://open.weixin.qq.com/connect/qrcode/071xV29w3uH1000o",
  "expire": 1753061548262
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» frameworkToken|string|true|none||框架token，用于个人身份标识|
|» qr_image|string|true|none||登陆二维码url|
|» expire|integer|true|none||none|

## GET wegame登陆-获取登陆状态

GET /login/wegame/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "查询成功",
  "status": "pending",
  "qq": "",
  "expire": 1753061367458,
  "frameworkToken": "e5189938-1075-46f5-8986-d6d39c223d15"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||none|
|» status|string|true|none||状态|
|» qq|string|true|none||扫码的QQ|
|» expire|integer|true|none||none|
|» frameworkToken|string|true|none||当前框架token|

## GET wegame登陆-token状态

GET /login/wegame/token

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "msg": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» msg|string|true|none||ok|

# 业务/房间

## GET 房间列表

GET /df/tools/Room/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|clientID|query|string| 否 |none|
|type|query|string| 否 |none|
|hasPassword|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 房间信息

GET /df/tools/Room/info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|clientID|query|string| 否 |none|
|roomId|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 创建房间

POST /df/tools/Room/creat

> Body 请求参数

```yaml
frameworkToken: 329f3e5d-5597-4d0d-b3e3-876764bf9f7b
clientID: 68734e4f5d67fecc0d4ac0b0
tag: ""
password: ""
onlyCurrentlyClient: "false"
mapid: "0"
type: sol

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» tag|body|string| 否 |none|
|» password|body|string| 否 |none|
|» onlyCurrentlyClient|body|string| 否 |none|
|» mapid|body|string| 否 |none|
|» type|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 加入房间

POST /df/tools/Room/join

> Body 请求参数

```yaml
frameworkToken: 329f3e5d-5597-4d0d-b3e3-876764bf9f7b
clientID: 68734e4f5d67fecc0d4ac0b0
password: ""
roomId: "80893947"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» password|body|string| 否 |none|
|» roomId|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 退出房间&房主解散

POST /df/tools/Room/quit

> Body 请求参数

```yaml
frameworkToken: 329f3e5d-5597-4d0d-b3e3-876764bf9f7b
clientID: 68734e4f5d67fecc0d4ac0b0
roomId: "80893947"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» roomId|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 房间踢人

POST /df/tools/Room/kick

> Body 请求参数

```yaml
frameworkToken: 329f3e5d-5597-4d0d-b3e3-876764bf9f7b
clientID: 68734e4f5d67fecc0d4ac0b0
roomId: "80893947"
targetFrameworkToken: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» roomId|body|string| 否 |none|
|» targetFrameworkToken|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 业务/用户管理

## POST 终端用户绑定frameworkToken

POST /user/bind

> Body 请求参数

```yaml
frameworkToken: 87d0f15b-f6a7-47af-ad65-485cb5ee310b
platformID: "2315823357"
clientID: 68734e4f5d67fecc0d4ac0b0
clientType: test

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» platformID|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» clientType|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 终端用户解绑frameworkToken

POST /user/unbind

> Body 请求参数

```yaml
frameworkToken: 87d0f15b-f6a7-47af-ad65-485cb5ee310b
platformID: "2315823357"
clientID: 68734e4f5d67fecc0d4ac0b0
clientType: test

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» frameworkToken|body|string| 否 |none|
|» platformID|body|string| 否 |none|
|» clientID|body|string| 否 |none|
|» clientType|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 终端用户frameworkToken列表

GET /user/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|platformID|query|string| 否 |none|
|clientID|query|string| 否 |none|
|clientType|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 业务/object

## GET 物品列表

GET /df/object/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|primary|query|string| 否 |一级分类（可选）|
|second|query|string| 否 |二级分类（可选）（前提是一级）|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "objectID": 14060000003,
        "avgPrice": 282784,
        "desc": "针对6级装备的局内维修工具，能快速修复头盔耐久度。每块插板消耗工具包25点耐久；启用时间4.5秒。",
        "grade": 6,
        "id": 10087,
        "length": 2,
        "objectName": "高级头盔维修组合",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 100,
          "repairArea": "头盔",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复头盔耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "3",
        "width": 2
      },
      {
        "objectID": 14060000004,
        "avgPrice": 553239,
        "desc": "针对6级装备的局内维修工具，能快速修复护甲耐久度。每块插板消耗工具包50点耐久；启用时间4.5秒。",
        "grade": 6,
        "id": 10032,
        "length": 2,
        "objectName": "高级护甲维修组合",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000004.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 200,
          "repairArea": "胸甲",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复护甲耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "3.8",
        "width": 2
      },
      {
        "objectID": 14020000006,
        "avgPrice": 107160,
        "desc": "拥有800耐久度，每秒可以回复30点生命值启用时间3.5秒，能消耗25点耐久治疗一处伤口，还可以消耗25耐久获得60秒止痛效果。",
        "grade": 5,
        "id": 10091,
        "length": 2,
        "objectName": "战地医疗箱",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000006.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3.5秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "1.2",
        "width": 2
      },
      {
        "objectID": 14060000001,
        "avgPrice": 138881,
        "desc": "针对5级装备的局内维修工具，能快速修复头盔耐久度。每块插板消耗工具包25点耐久；启用时间4.5秒。",
        "grade": 5,
        "id": 10085,
        "length": 3,
        "objectName": "精密头盔维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 75,
          "repairArea": "头盔",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复头盔耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "2.2",
        "width": 1
      },
      {
        "objectID": 14060000002,
        "avgPrice": 190529,
        "desc": "针对5级装备的局内维修工具，能快速修复护甲耐久度。每块插板消耗工具包40点耐久；启用时间4.5秒。",
        "grade": 5,
        "id": 10089,
        "length": 2,
        "objectName": "精密护甲维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000002.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000002.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 120,
          "repairArea": "胸甲",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复护甲耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "3",
        "width": 2
      },
      {
        "objectID": 14020000005,
        "avgPrice": 45250,
        "desc": "拥有350耐久度，每秒可以回复20点生命值，启用时间4秒，能消耗25点耐久治疗一处伤口，还可以消耗25耐久获得30秒止痛效果。",
        "grade": 4,
        "id": 10031,
        "length": 3,
        "objectName": "户外医疗箱",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000005.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "4秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.7",
        "width": 1
      },
      {
        "objectID": 14030000003,
        "avgPrice": 25169,
        "desc": "启用后可以修复1个部位上所有异常状态，最多可以使用7次；启用时间5秒。",
        "grade": 4,
        "id": 10092,
        "length": 3,
        "objectName": "DEK野战手术包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14030000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14030000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 7,
          "activeTime": "5秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.7",
        "width": 1
      },
      {
        "objectID": 14050000003,
        "avgPrice": 22548,
        "desc": "获得止痛效果360秒，能屏蔽疼痛、骨折带来的视觉影响，最多可以使用5次；使用时间3秒。",
        "grade": 4,
        "id": 10096,
        "length": 1,
        "objectName": "DVE止疼片",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14050000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14050000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 5,
          "activeTime": "3秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.3",
        "width": 1
      },
      {
        "objectID": 14060000005,
        "avgPrice": 38941,
        "desc": "针对4级装备的局内维修工具，能快速修复头盔耐久度。每块插板消耗工具包25点耐久；启用时间4.5秒。",
        "grade": 4,
        "id": 10086,
        "length": 2,
        "objectName": "标准头盔维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000005.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 50,
          "repairArea": "头盔",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复头盔耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "1.7",
        "width": 1
      },
      {
        "objectID": 14060000006,
        "avgPrice": 74436,
        "desc": "针对4级装备的局内维修工具，能快速修复护甲耐久度。每块插板消耗工具包40点耐久；启用时间4.5秒。",
        "grade": 4,
        "id": 10090,
        "length": 3,
        "objectName": "标准护甲维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000006.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 75,
          "repairArea": "胸甲",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复护甲耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "2.3",
        "width": 1
      },
      {
        "objectID": 14070000003,
        "avgPrice": 26847,
        "desc": "提升负重能力，持续300秒。",
        "grade": 4,
        "id": 10082,
        "length": 1,
        "objectName": "M2肌肉注射剂",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "bearEnhance": "负重提升"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000005,
        "avgPrice": 38779,
        "desc": "提升听力范围，持续300秒。",
        "grade": 4,
        "id": 10081,
        "length": 1,
        "objectName": "感知强化剂",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000005.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "hearEnhance": "听力增强"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000007,
        "avgPrice": 78061,
        "desc": "提升体力上限，提升体力恢复速度，持续300秒。",
        "grade": 4,
        "id": 10035,
        "length": 1,
        "objectName": "体能强化剂",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000007.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000007.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "replyEffect": "大幅度提升体力属性"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14020000004,
        "avgPrice": 13003,
        "desc": "拥有220耐久度；每秒可以回复20点生命值，启用时间6秒。",
        "grade": 3,
        "id": 10098,
        "length": 2,
        "objectName": "野战急救包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000004.png",
        "primaryClass": "props",
        "propsDetail": {
          "durability": 220,
          "activeTime": "6秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.5",
        "width": 1
      },
      {
        "objectID": 14060000007,
        "avgPrice": 12377,
        "desc": "针对3级装备的局内维修工具，能快速修复头盔耐久度。每块插板消耗工具包15点耐久；启用时间4.5秒。",
        "grade": 3,
        "id": 10033,
        "length": 2,
        "objectName": "自制头盔维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000007.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000007.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 30,
          "repairArea": "头盔",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复头盔耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "1",
        "width": 1
      },
      {
        "objectID": 14060000008,
        "avgPrice": 14287,
        "desc": "针对3级装备的局内维修工具，能快速修复护甲耐久度。每块插板消耗工具包25点耐久；启用时间4.5秒。",
        "grade": 3,
        "id": 10088,
        "length": 2,
        "objectName": "自制护甲维修包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000008.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000008.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 50,
          "repairArea": "胸甲",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复护甲耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "1.3",
        "width": 1
      },
      {
        "objectID": 14070000001,
        "avgPrice": 7803,
        "desc": "提升负重能力，持续180秒。",
        "grade": 3,
        "id": 10079,
        "length": 1,
        "objectName": "M1肌肉强化针",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "bearEnhance": "负重提升"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000004,
        "avgPrice": 16918,
        "desc": "提升听力范围，持续180秒。",
        "grade": 3,
        "id": 10080,
        "length": 1,
        "objectName": "感知激活针",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000004.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "hearEnhance": "听力增强"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000006,
        "avgPrice": 23417,
        "desc": "提升体力上限，提升体力恢复速度，持续180秒。",
        "grade": 3,
        "id": 10034,
        "length": 1,
        "objectName": "体能激活针",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000006.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "replyEffect": "提升体力属性"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000008,
        "avgPrice": 23660,
        "desc": "在紧急情况用于回复体力的注射剂，能在短时间内回复大量体力，单次使用。",
        "grade": 3,
        "id": 10084,
        "length": 1,
        "objectName": "OE2战斗兴奋剂",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000008.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000008.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14070000009,
        "avgPrice": 5363,
        "desc": "可有效增加肌肉耐力的注射剂，能提升体力上限，持续120秒。",
        "grade": 3,
        "id": 10083,
        "length": 1,
        "objectName": "去甲肾上腺素",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000009.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000009.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "3",
          "bodyCapacity": "体力容量增加"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14020000003,
        "avgPrice": 7001,
        "desc": "拥有60耐久度；每秒可以回复12点生命值启用时间3秒。",
        "grade": 2,
        "id": 10097,
        "length": 1,
        "objectName": "强效注射器",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "durability": 60,
          "activeTime": "3秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.4",
        "width": 1
      },
      {
        "objectID": 14030000002,
        "avgPrice": 8571,
        "desc": "启用后可以修复1个部位上所有异常状态，最多可以使用4次；启用时间7秒。",
        "grade": 2,
        "id": 10095,
        "length": 2,
        "objectName": "战术快拆手术包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14030000002.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14030000002.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 4,
          "activeTime": "7秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.2",
        "width": 1
      },
      {
        "objectID": 14050000002,
        "avgPrice": 6544,
        "desc": "获得止痛效果240秒，能屏蔽疼痛、骨折带来的视觉影响，最多可以使用3次；使用时间4秒。",
        "grade": 2,
        "id": 10093,
        "length": 1,
        "objectName": "瓶装抗生素",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14050000002.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14050000002.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 3,
          "activeTime": "4秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14020000001,
        "avgPrice": 1588,
        "desc": "拥有30耐久度；每秒可以回复5点生命值；启用时间3.5秒。",
        "grade": 1,
        "id": 10094,
        "length": 1,
        "objectName": "简易注射器",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "durability": 30,
          "activeTime": "3.5秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14020000002,
        "avgPrice": 3041,
        "desc": "拥有90耐久度，每秒可以回复6点生命值，启用时间5秒。",
        "grade": 1,
        "id": 10030,
        "length": 1,
        "objectName": "车载急救包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14020000002.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14020000002.png",
        "primaryClass": "props",
        "propsDetail": {
          "activeTime": "5秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.2",
        "width": 1
      },
      {
        "objectID": 14030000001,
        "avgPrice": 2352,
        "desc": "启用后可以修复1处受伤部位，最多可以使用2次；启用时间10秒。",
        "grade": 1,
        "id": 10099,
        "length": 1,
        "objectName": "简易手术包",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14030000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14030000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 2,
          "activeTime": "10秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14040000001,
        "avgPrice": 2508,
        "desc": "启用后可以治疗1处伤口，最多可以使用4次；启用时间2.5秒。",
        "grade": 1,
        "id": 10100,
        "length": 1,
        "objectName": "CAT止血带",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14040000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14040000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 4,
          "activeTime": "2.5秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14040000002,
        "avgPrice": 1041,
        "desc": "启用后可以治疗1处伤口，最多可以使用2次；启用时间3秒。",
        "grade": 1,
        "id": 10943,
        "length": 1,
        "objectName": "弹力绷带",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14040000002.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14040000002.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 2,
          "activeTime": "3秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      },
      {
        "objectID": 14050000001,
        "avgPrice": 1960,
        "desc": "获得止痛效果200秒，能屏蔽疼痛、骨折带来的视觉影响，最多可以使用1次；使用时间4秒。",
        "grade": 1,
        "id": 10101,
        "length": 1,
        "objectName": "缓释止痛片",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14050000001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14050000001.png",
        "primaryClass": "props",
        "propsDetail": {
          "availableCount": 1,
          "activeTime": "4秒"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "drug",
        "thirdClassCN": "药品",
        "weight": "0.1",
        "width": 1
      }
    ],
    "currentTime": "2025-07-21 06:03:22",
    "configID": 10001,
    "amsSerial": "AMS-DFM-72114322-XDC66E",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T06:03:22.914Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T06:03:22.914Z"
    }
  },
  "message": "获取物品信息成功",
  "__typeComment": "物品类型注释：props: consume(消耗品)",
  "__fieldMeta": {
    "objectID": {
      "label": "物品ID",
      "type": "integer"
    },
    "avgPrice": {
      "label": "平均价格",
      "type": "integer"
    },
    "desc": {
      "label": "描述",
      "type": "string"
    },
    "grade": {
      "label": "等级",
      "type": "integer"
    },
    "id": {
      "label": "顺序ID",
      "type": "integer"
    },
    "length": {
      "label": "长",
      "type": "integer"
    },
    "objectName": {
      "label": "物品名",
      "type": "string"
    },
    "pic": {
      "label": "图片",
      "type": "string"
    },
    "prePic": {
      "label": "预览图",
      "type": "string"
    },
    "primaryClass": {
      "label": "一级分类",
      "type": "string"
    },
    "propsDetail": {
      "label": "物品信息",
      "type": "object"
    },
    "secondClass": {
      "label": "二级分类",
      "type": "string"
    },
    "secondClassCN": {
      "label": "二级分类中文名",
      "type": "string"
    },
    "thirdClass": {
      "label": "三级分类",
      "type": "string"
    },
    "thirdClassCN": {
      "label": "三级分类中文名",
      "type": "string"
    },
    "weight": {
      "label": "重量",
      "type": "string"
    },
    "width": {
      "label": "宽",
      "type": "integer"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||接口请求是否成功|
|» data|object|true|none||none|
|»» keywords|[object]|true|none||关键词匹配的物品列表|
|»»» objectID|integer|true|none||物品唯一ID|
|»»» avgPrice|integer|true|none||平均价格|
|»»» desc|string|true|none||物品描述|
|»»» grade|integer|true|none||物品等级|
|»»» id|integer|true|none||记录ID|
|»»» length|integer|true|none||物品长度|
|»»» objectName|string|true|none||品名称|
|»»» pic|string|true|none||物品图片URL|
|»»» prePic|string|true|none||物品预览图URL|
|»»» primaryClass|string|true|none||一级分类（英文）|
|»»» propsDetail|object|true|none||物品属性详情|
|»»»» repairPoints|integer|false|none||修复点数|
|»»»» repairArea|string|false|none||修复范围|
|»»»» repairEfficiency|string|false|none||修复效率|
|»»»» activeTime|string|true|none||生效时间|
|»»»» replyEffect|string|false|none||回复效果|
|»»»» availableCount|integer|true|none||可用次数|
|»»»» bearEnhance|string|false|none||承载增强效果|
|»»»» hearEnhance|string|false|none||听力增强效果|
|»»»» durability|integer|false|none||耐久度|
|»»»» bodyCapacity|string|false|none||躯体容量|
|»»» secondClass|string|true|none||二级分类（英文）|
|»»» secondClassCN|string|true|none||二级分类（中文）|
|»»» thirdClass|string|true|none||三级分类（英文）|
|»»» thirdClassCN|string|true|none||三级分类（中文）|
|»»» weight|string|true|none||物品重量（单位：KG）|
|»»» width|integer|true|none||物品宽度|
|»» currentTime|string|true|none||当前时间（时间戳或格式化字符串）|
|»» configID|integer|true|none||配置ID|
|»» amsSerial|string|true|none||AMS序列号|
|»» loginInfo|object|true|none||登录信息|
|»»» type|string|true|none||登录类型|
|»»» openid|string|true|none||用户唯一标识|
|»»» timestamp|string|true|none||登录时间戳|
|»» requestInfo|object|true|none||请求信息元数据|
|»»» apiUrl|string|true|none||请求接口URL|
|»»» chartId|string|true|none||图表ID|
|»»» timestamp|string|true|none||请求时间戳|
|» message|string|true|none||接口返回消息（成功/失败描述）|
|» __typeComment|string|true|none||类型注释说明|
|» __fieldMeta|object|true|none||字段元数据（标签与类型说明）|
|»» objectID|object|true|none||none|
|»»» label|string|true|none||字段标签名称|
|»»» type|string|true|none||字段数据类型|
|»» avgPrice|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» desc|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» grade|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» id|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» length|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» objectName|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» pic|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» prePic|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» primaryClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» propsDetail|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» secondClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» secondClassCN|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» thirdClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» thirdClassCN|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» weight|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» width|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|

## GET 物品搜索

GET /df/object/search

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |二选一|
|id|query|string| 否 |二选一|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "objectID": 14060000003,
        "avgPrice": 282784,
        "desc": "针对6级装备的局内维修工具，能快速修复头盔耐久度。每块插板消耗工具包25点耐久；启用时间4.5秒。",
        "grade": 6,
        "id": 10087,
        "length": 2,
        "objectName": "高级头盔维修组合",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14060000003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14060000003.png",
        "primaryClass": "props",
        "propsDetail": {
          "repairPoints": 100,
          "repairArea": "头盔",
          "repairEfficiency": "低",
          "activeTime": "4.5",
          "replyEffect": "回复头盔耐久度"
        },
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "repair",
        "thirdClassCN": "维修套件",
        "weight": "3",
        "width": 2
      }
    ],
    "currentTime": "2025-07-21 02:07:12",
    "configID": 10001,
    "amsSerial": "AMS-DFM-72110712-944KZE",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:07:12.961Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:07:12.961Z"
    }
  },
  "message": "获取物品信息成功",
  "__typeComment": "物品类型注释：props: consume(消耗品)",
  "__fieldMeta": {
    "objectID": {
      "label": "物品ID",
      "type": "integer"
    },
    "avgPrice": {
      "label": "平均价格",
      "type": "integer"
    },
    "desc": {
      "label": "描述",
      "type": "string"
    },
    "grade": {
      "label": "等级",
      "type": "integer"
    },
    "id": {
      "label": "顺序ID",
      "type": "integer"
    },
    "length": {
      "label": "长",
      "type": "integer"
    },
    "objectName": {
      "label": "物品名",
      "type": "string"
    },
    "pic": {
      "label": "图片",
      "type": "string"
    },
    "prePic": {
      "label": "预览图",
      "type": "string"
    },
    "primaryClass": {
      "label": "一级分类",
      "type": "string"
    },
    "propsDetail": {
      "label": "物品信息",
      "type": "object"
    },
    "secondClass": {
      "label": "二级分类",
      "type": "string"
    },
    "secondClassCN": {
      "label": "二级分类中文名",
      "type": "string"
    },
    "thirdClass": {
      "label": "三级分类",
      "type": "string"
    },
    "thirdClassCN": {
      "label": "三级分类中文名",
      "type": "string"
    },
    "weight": {
      "label": "重量",
      "type": "string"
    },
    "width": {
      "label": "宽",
      "type": "integer"
    }
  }
}
```

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "objectID": 15080050006,
        "avgPrice": 13088362,
        "desc": "世界上最大的钻石，璀璨夺目，象征永恒的爱。",
        "grade": 6,
        "id": 10159,
        "length": 1,
        "objectName": "非洲之心",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050006.png",
        "primaryClass": "props",
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        },
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "weight": "0.62",
        "width": 1
      },
      {
        "objectID": 15080010003,
        "avgPrice": 4266,
        "desc": "敲击起来有低沉的声音。",
        "grade": 2,
        "id": 10173,
        "length": 1,
        "objectName": "非洲鼓",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080010003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080010003.png",
        "primaryClass": "props",
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        },
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "weight": "4.5",
        "width": 2
      },
      {
        "objectID": 15080040005,
        "avgPrice": 4169,
        "desc": "一种独特的艺术品，雕刻得非常精致，展现了非洲文化的魅力。",
        "grade": 2,
        "id": 10153,
        "length": 1,
        "objectName": "非洲木雕",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080040005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080040005.png",
        "primaryClass": "props",
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        },
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "weight": "1.4",
        "width": 2
      }
    ],
    "currentTime": "2025-07-21 02:07:31",
    "configID": 10001,
    "amsSerial": "AMS-DFM-72110731-TTRXRF",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:07:31.846Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:07:31.846Z"
    }
  },
  "message": "获取物品信息成功",
  "__typeComment": "物品类型注释：props: collection(收集品)",
  "__fieldMeta": {
    "objectID": {
      "label": "物品ID",
      "type": "integer"
    },
    "avgPrice": {
      "label": "平均价格",
      "type": "integer"
    },
    "desc": {
      "label": "描述",
      "type": "string"
    },
    "grade": {
      "label": "等级",
      "type": "integer"
    },
    "id": {
      "label": "顺序ID",
      "type": "integer"
    },
    "length": {
      "label": "长",
      "type": "integer"
    },
    "objectName": {
      "label": "物品名",
      "type": "string"
    },
    "pic": {
      "label": "图片",
      "type": "string"
    },
    "prePic": {
      "label": "预览图",
      "type": "string"
    },
    "primaryClass": {
      "label": "一级分类",
      "type": "string"
    },
    "propsDetail": {
      "label": "物品信息",
      "type": "object"
    },
    "secondClass": {
      "label": "二级分类",
      "type": "string"
    },
    "secondClassCN": {
      "label": "二级分类中文名",
      "type": "string"
    },
    "weight": {
      "label": "重量",
      "type": "string"
    },
    "width": {
      "label": "宽",
      "type": "integer"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» keywords|[object]|true|none||none|
|»»» objectID|integer|false|none||none|
|»»» avgPrice|integer|false|none||none|
|»»» desc|string|false|none||none|
|»»» grade|integer|false|none||none|
|»»» id|integer|false|none||none|
|»»» length|integer|false|none||none|
|»»» objectName|string|false|none||none|
|»»» pic|string|false|none||none|
|»»» prePic|string|false|none||none|
|»»» primaryClass|string|false|none||none|
|»»» propsDetail|object|false|none||none|
|»»»» repairPoints|integer|true|none||none|
|»»»» repairArea|string|true|none||none|
|»»»» repairEfficiency|string|true|none||none|
|»»»» activeTime|string|true|none||none|
|»»»» replyEffect|string|true|none||none|
|»»» secondClass|string|false|none||none|
|»»» secondClassCN|string|false|none||none|
|»»» thirdClass|string|false|none||none|
|»»» thirdClassCN|string|false|none||none|
|»»» weight|string|false|none||none|
|»»» width|integer|false|none||none|
|»» currentTime|string|true|none||none|
|»» configID|integer|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|
|» __typeComment|string|true|none||none|
|» __fieldMeta|object|true|none||none|
|»» objectID|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» avgPrice|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» desc|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» grade|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» id|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» length|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» objectName|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» pic|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» prePic|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» primaryClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» propsDetail|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» secondClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» secondClassCN|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» thirdClass|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» thirdClassCN|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» weight|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|
|»» width|object|true|none||none|
|»»» label|string|true|none||none|
|»»» type|string|true|none||none|

## GET 健康状态

GET /df/object/health

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 10042,
      "type": "healthy",
      "place": "",
      "level": 0,
      "detail": "",
      "healthyDetail": {
        "deBuffList": [
          {
            "area": "头",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-head-daze.png",
                "status": "晕眩",
                "title": "头部晕眩",
                "trigger": "被命中头部未防护部位触发",
                "effect": "视野模糊，持续3s"
              },
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-head-pain.png",
                "status": "疼痛",
                "title": "头部疼痛",
                "trigger": "头部健康值为零时触发",
                "effect": "血量上限降低（-10）",
                "shield": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ],
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          },
          {
            "area": "胸",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-chest-pain.png",
                "status": "疼痛",
                "title": "胸痛",
                "trigger": "胸部健康值为零时触发",
                "effect": "血量上限降低（-10）",
                "shield": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ],
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          },
          {
            "area": "腹",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-abdominal-pain.png",
                "status": "疼痛",
                "title": "腹部痛",
                "trigger": "腹部健康值为零时触发",
                "effect": "血量上限降低（-10）",
                "shield": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ],
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          },
          {
            "area": "腿",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-leg-broken.png",
                "status": "骨折",
                "title": "腿部骨折",
                "trigger": "腿部健康值为零时触发",
                "effect": "跳跃高度降低（-10%），移动速度降低（-15%），无法滑铲",
                "shield": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ],
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              },
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-leg-broken.png",
                "status": "骨裂",
                "title": "腿部骨裂",
                "trigger": "骨折状态下冲刺、跳跃概率触发",
                "effect": "跳跃高度降低（-10%），移动速度降低（-15%），无法滑铲，不可被屏蔽",
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          },
          {
            "area": "手",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-hand-broken.png",
                "status": "骨折",
                "title": "手部骨折",
                "trigger": "手臂健康值为零时触发",
                "effect": "使用物品、开镜、换弹速度降低（-20%）",
                "shield": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ],
                "cure": [
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          },
          {
            "area": "全身",
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/debuff-blood.png",
                "status": "伤口",
                "title": "流血",
                "trigger": "子弹命中概率触发",
                "effect": "持续掉血（-1/5s），效果可叠加",
                "cure": [
                  {
                    "objectID": 14040000001
                  },
                  {
                    "objectID": 14040000002
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  },
                  {
                    "objectID": 14030000001
                  },
                  {
                    "objectID": 14030000002
                  },
                  {
                    "objectID": 14030000003
                  }
                ]
              }
            ]
          }
        ],
        "buffList": [
          {
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/buff-pain-limit.png",
                "title": "止痛",
                "effect": "暂时屏蔽所有异常状态",
                "require": [
                  {
                    "objectID": 14050000001
                  },
                  {
                    "objectID": 14050000002
                  },
                  {
                    "objectID": 14050000003
                  },
                  {
                    "objectID": 14020000005
                  },
                  {
                    "objectID": 14020000006
                  }
                ]
              }
            ]
          },
          {
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/buff-weigth-strong.png",
                "title": "负重提升",
                "effect": "提升基础负重和超重的数值上限",
                "require": [
                  {
                    "objectID": 14070000001
                  },
                  {
                    "objectID": 14070000003
                  }
                ]
              }
            ]
          },
          {
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/buff-hear-strong.png",
                "title": "听力增强",
                "effect": "提升听力距离",
                "require": [
                  {
                    "objectID": 14070000004
                  },
                  {
                    "objectID": 14070000005
                  }
                ]
              }
            ]
          },
          {
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/buff-prop-strong.png",
                "title": "提升体力属性",
                "effect": "提升体力恢复速度 减少体力消耗速度",
                "require": [
                  {
                    "objectID": 14070000006
                  },
                  {
                    "objectID": 14070000007
                  }
                ]
              }
            ]
          },
          {
            "list": [
              {
                "pic": "https://playerhub.df.qq.com/playerhub/60004/healthy/buff-capital-strong.png",
                "title": "增加体力容量",
                "effect": "增加10点体力容量",
                "require": [
                  {
                    "objectID": 14070000009
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  "message": "succ",
  "amsSerial": "AMS-DFM-0721101050-oD6DxT-661959-316968",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:10:50.214Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» ret|integer|true|none||none|
|» iRet|integer|true|none||none|
|» message|string|true|none||succ|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|
|» data|[object]|true|none||none|
|»» code|integer|true|none||none|
|»» msg|string|true|none||ok|
|»» list|[object]|true|none||none|
|»»» id|integer|true|none||状态ID|
|»»» type|string|true|none||类型|
|»»» place|string|true|none||地点（无）|
|»»» level|integer|true|none||等级（0）|
|»»» detail|string|true|none||无|
|»»» healthyDetail|object|true|none||状态信息|
|»»»» deBuffList|[object]|true|none||none|
|»»»»» area|string|true|none||区域（头身体。。。）|
|»»»»» list|[object]|true|none||none|
|»»»»»» pic|string|true|none|图片|none|
|»»»»»» status|string|true|none|状态名|none|
|»»»»»» title|string|true|none|完整名|none|
|»»»»»» trigger|string|true|none|触发条件|none|
|»»»»»» effect|string|true|none|效果|none|
|»»»»»» shield|[object]|true|none|预防|none|
|»»»»»»» objectID|integer|true|none|物品ID|none|
|»»»»»» cure|[object]|true|none|治疗|none|
|»»»»»»» objectID|integer|true|none|物品ID|none|
|»»»» buffList|[object]|true|none||none|
|»»»»» list|[object]|true|none||none|
|»»»»»» pic|string|true|none|图片|none|
|»»»»»» title|string|true|none|状态名|none|
|»»»»»» effect|string|true|none|效果|none|
|»»»»»» require|[object]|true|none|需求（吃什么药打什么针）|none|
|»»»»»»» objectID|integer|true|none|物品ID|none|
|»» relateMap|object|true|none||物品映射表|
|»»» 14020000005|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14020000006|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14030000001|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14030000002|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14030000003|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14040000001|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14040000002|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14050000001|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14050000002|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14050000003|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» availableCount|integer|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»» 14070000001|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» bearEnhance|string|true|none||none|
|»»» 14070000003|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» bearEnhance|string|true|none||none|
|»»» 14070000004|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» hearEnhance|string|true|none||none|
|»»» 14070000005|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» hearEnhance|string|true|none||none|
|»»» 14070000006|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» replyEffect|string|true|none||none|
|»»» 14070000007|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» replyEffect|string|true|none||none|
|»»» 14070000009|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» thirdClass|string|true|none||none|
|»»»» thirdClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» activeTime|string|true|none||none|
|»»»»» bodyCapacity|string|true|none||none|

## GET 干员信息

GET /df/object/operator

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 10017,
      "operatorID": 88000000035,
      "operator": "乌鲁鲁",
      "fullName": "大卫·费莱尔",
      "armyType": "工程",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000035.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000035.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10038.png",
      "armyTypeDesc": "工程兵是道具使用专家，可用喷枪进行切割和维修。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "巡飞弹",
          "abilityDesc": "开镜后发射一枚图像制导巡飞弹，爆炸时会额外霰射出四枚炸弹。腰射时，巡飞弹会启用预设制导",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10001.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "cover",
          "positionCN": "掩体",
          "abilityName": "速凝掩体",
          "abilityDesc": "投掷出快速凝固混凝土喷射系统，生成能够阻挡伤害的掩体",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10002.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "复合型燃烧弹",
          "abilityDesc": "投掷一枚接触地面时爆炸的燃烧弹，能快速烧毁速凝掩体",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10003.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "久经沙场",
          "abilityDesc": "对骨折和兵种装备造成的减速效果拥有更强的抗性",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10004.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135667",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135674",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10007,
      "operatorID": 88000000025,
      "operator": "威龙",
      "fullName": "王宇昊",
      "armyType": "突击",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000025.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000025.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10028.png",
      "armyTypeDesc": "突击兵有更强的战斗能力，在举镜瞄准状态下拥有更快的移动速度。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "knock",
          "positionCN": "击退",
          "abilityName": "虎蹲炮",
          "abilityDesc": "发射压缩空气弹，爆炸时将附近的敌人击倒在地",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10029.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "push",
          "positionCN": "推进",
          "abilityName": "动力推进",
          "abilityDesc": "激活动能辅助装置，朝指定方向进行推进。击倒敌人时可减少冷却时间",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10030.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "磁吸炸弹",
          "abilityDesc": "投掷能吸附在硬表面上的大威力炸弹，倒计时结束后爆炸",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10031.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "动能辅助系统",
          "abilityDesc": "使用技能或从高处坠落时，短暂增加系统功率，减少坠落伤害并增加移动速度",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10032.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135665",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135672",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10020,
      "operatorID": 88000000038,
      "operator": "无名",
      "fullName": "埃利·德·孟贝尔",
      "armyType": "突击",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000038.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000038.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10028.png",
      "armyTypeDesc": "突击兵有更强的战斗能力，在举镜瞄准状态下拥有更快的移动速度。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "silence",
          "positionCN": "静音",
          "abilityName": "静默潜袭",
          "abilityDesc": "无名启动身上携带的各种干扰器，附近的敌人受到声波干扰的影响，无名的声音传播范围被大大缩小，提升无名机动性的同时，在此期间的敌方侦察道具只会检测到无名启动干扰器时的起始位置。战场模式中无名不会被侦察到",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10047.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "旋刃飞行器",
          "abilityDesc": "旋刃飞行器会锁定前方的敌人，锁定后丢出即可自动追踪敌人并爆开，释放内部的刀片，伤害并减速敌人，同时附加流血状态。从背后锁定敌人时，能更快速的完成锁定。不锁定直接投掷时，会在接触到墙体的短时间后爆炸。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10048.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "flash",
          "positionCN": "闪光",
          "abilityName": "突破型闪光弹",
          "abilityDesc": "向前投掷一颗闪光弹，闪光弹会在接触到墙体的短暂延迟后爆炸，对附近所有\n的敌人进行闪光震撼",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10049.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "重伤延滞",
          "abilityDesc": "被无名伤害的敌人需要花更长时间使用药品，倒地的敌人也需要更久的时间才\n能扶起。战场模式中减缓呼吸回血时间",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10050.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "138207",
          "tagType": "oneMinute"
        },
        {
          "tagID": "138208",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10019,
      "operatorID": 88000000037,
      "operator": "深蓝",
      "fullName": "阿列克谢.彼得罗夫",
      "armyType": "工程",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000037.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000037.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10038.png",
      "armyTypeDesc": "工程兵是道具使用专家，可用喷枪进行切割和维修。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "protect",
          "positionCN": "防护",
          "abilityName": "防爆套装",
          "abilityDesc": "装备重型防爆套装和全身盾，大幅降低受到的所有伤害。防爆盾的观察窗可被破坏。防爆盾攻击可以击倒敌人或击回投掷物。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10043.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "decelerate",
          "positionCN": "减速",
          "abilityName": "刀片刺网手雷",
          "abilityDesc": "落地后生成刀片刺网，敌人在铁丝网内移动时，会减速，受到伤害并发出声音。可被爆炸和近战摧毁。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10044.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "control",
          "positionCN": "控制",
          "abilityName": "多功能钩爪枪",
          "abilityDesc": "发射钩爪，命中后拉回敌人，倒地队友或装备箱。钩爪枪的绳索可被破坏。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10045.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "后方防护",
          "abilityDesc": "防爆盾未使用时会挂在角色后部，抵挡从后方射来的子弹",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10046.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "136854",
          "tagType": "oneMinute"
        },
        {
          "tagID": "136855",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10002,
      "operatorID": 88000000029,
      "operator": "牧羊人",
      "fullName": "泰瑞·缪萨",
      "armyType": "工程",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000029.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000029.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10038.png",
      "armyTypeDesc": "工程兵是道具使用专家，可用喷枪进行切割和维修。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "suppress",
          "positionCN": "压制",
          "abilityName": "声波震慑",
          "abilityDesc": "向前部署声波无人机，压制无人机30m半径内的敌方，并影响声压减少敌方武器射速。无人机会摧毁与其共振的敌方声波设备，并干扰电子侦察设备",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10016.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "trap",
          "positionCN": "陷阱",
          "abilityName": "声波陷阱",
          "abilityDesc": "部署可黏着在硬表面的声波陷阱，陷阱会被4m内的敌方单位触发，触发时对更大范围内的敌人造成伤害和减速效果",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10017.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "强化型破片手雷",
          "abilityDesc": "破片手雷，能较好地破坏护甲和裸露的四肢",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10021.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "减振防御",
          "abilityDesc": "利用手部设备输出反相位声波，降低受到的爆炸冲击伤害",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10018.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135666",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135673",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10021,
      "operatorID": 88000000039,
      "operator": "疾风",
      "fullName": "克莱尔·安·拜尔斯",
      "armyType": "突击",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000039.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000039.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10028.png",
      "armyTypeDesc": "突击兵有更强的战斗能力，在举镜瞄准状态下拥有更快的移动速度。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "pull",
          "positionCN": "拉回",
          "abilityName": "紧急回避装置",
          "abilityDesc": "安装气罐后装置发射安全绳的锚点。疾风再次激活或受到致命伤害时，会被拉回到锚点位置。期间倒地时可激活辅助脊椎放电除颤，进行1次倒地自救。安全绳在疾风坠落一定距离时会启动悬挂模式，上限时间为1分钟。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10051.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "roll",
          "positionCN": "翻滚",
          "abilityName": "战术翻滚",
          "abilityDesc": "激活背部辅助脊椎增强核心力量，向多方向快速翻滚。击倒敌人时可减少冷却时间。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10052.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "disarm",
          "positionCN": "缴械",
          "abilityName": "钻墙电刺",
          "abilityDesc": "向前投掷出电刺，电刺将用钻头破开硬表面，并释放导电粉末和能击穿掩体的电流，击飞敌人手中的武器并使人短暂麻痹。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10053.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "爆发性辅助脊椎",
          "abilityDesc": "附近有子弹或爆炸威胁时，疾风背部的辅助脊椎会释放电流而爆发性地增强核心肌群，提升疾跑速度。常态下可加快游泳速度。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10054.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "138793",
          "tagType": "oneMinute"
        },
        {
          "tagID": "138794",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10000,
      "operatorID": 88000000030,
      "operator": "红狼",
      "fullName": "凯·席尔瓦",
      "armyType": "突击",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000030.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000030.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10028.png",
      "armyTypeDesc": "突击兵有更强的战斗能力，在举镜瞄准状态下拥有更快的移动速度。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "speed",
          "positionCN": "加速",
          "abilityName": "动力外骨骼",
          "abilityDesc": "激活腕部启动器让外骨骼功率超载，加快冲刺移动速度。击倒敌人时会恢复生命值并增加持续时间",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10012.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "三联装手炮",
          "abilityDesc": "装备三联装发射器，通过食指拉环发射爆炸榴弹。命中载具时可吸附在载具上",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10013.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "smoke",
          "positionCN": "烟雾",
          "abilityName": "突破型烟雾弹",
          "abilityDesc": "低装药型突破用烟雾弹，爆炸后生成会快速消散的烟雾",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10014.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "战术滑铲",
          "abilityDesc": "利用外骨骼进行快速战术滑铲",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10015.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135663",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135670",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10018,
      "operatorID": 88000000036,
      "operator": "蛊",
      "fullName": "佐娅·庞琴科娃",
      "armyType": "支援",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000036.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000036.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10023.png",
      "armyTypeDesc": "支援兵有多样化的辅助手段，能以更快的速度救起同阵营友军。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "smoke",
          "positionCN": "烟雾",
          "abilityName": "致盲毒雾",
          "abilityDesc": "投掷一枚“致盲瓦斯弹”，可使范围内的敌方致盲",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10042.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "buff",
          "positionCN": "增益",
          "abilityName": "肾上腺素激活",
          "abilityDesc": "释放无人机，为身边的友方进行增益，提高友方操控速度和降低受击上抬，友方在增益期间参与击杀或助攻将增强下一次增益的强度",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10041.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "disturb",
          "positionCN": "干扰",
          "abilityName": "“流荧”集群系统",
          "abilityDesc": "使用“流荧”集群装置，向前释放无人机群，短暂激活路线上友方的肾上腺素，并且干扰无人机路线上的敌方，使敌方获得短暂干扰效果，将持续干扰敌方听觉、视觉以及降低玩家血量上限。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10039.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "高效治疗",
          "abilityDesc": "烽火地带中缩短身边队友使用消耗品的时间，全面战场中缩短身边队友受伤后开始恢复的所需时间。",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10040.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "136295",
          "tagType": "oneMinute"
        },
        {
          "tagID": "136296",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10001,
      "operatorID": 88000000027,
      "operator": "蜂医",
      "fullName": "罗伊·斯米",
      "armyType": "支援",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000027.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000027.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10023.png",
      "armyTypeDesc": "支援兵有多样化的辅助手段，能以更快的速度救起同阵营友军。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "cure",
          "positionCN": "治疗",
          "abilityName": "激素枪",
          "abilityDesc": "装备发射多目标追踪子弹的激素枪，可缓慢治疗友军并抑制其疼痛感受。开镜时，仅会锁定一个目标",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10024.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "smoke",
          "positionCN": "烟雾",
          "abilityName": "烟幕",
          "abilityDesc": "控制手势感应无人机向前飞行并喷射烟幕。长按开火键引导无人机转向",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10025.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "smoke",
          "positionCN": "烟雾",
          "abilityName": "蜂巢科技烟雾弹",
          "abilityDesc": "投掷蜂巢烟雾弹，烟雾被激素枪命中时可被染色为治疗烟雾",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10026.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "专业救援",
          "abilityDesc": "利用激素枪进行更加灵活的倒地救援，并且为被救者恢复更多生命值。烽火地带中能够移除血量上限减少的负面效果",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10027.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135664",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135671",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10006,
      "operatorID": 88000000028,
      "operator": "露娜",
      "fullName": "金卢娜",
      "armyType": "侦察",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000028.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000028.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10033.png",
      "armyTypeDesc": "侦察兵精通战场情报收集，可用侦察电台获得战区信息。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "detect",
          "positionCN": "侦查",
          "abilityName": "侦察箭矢",
          "abilityDesc": "使用弓射出侦查箭矢，暴露箭矢下方的敌人，并在轨迹上留下探测移动生物的微型传感器",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10020.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "click",
          "positionCN": "点击",
          "abilityName": "电击箭矢",
          "abilityDesc": "使用弓射出电击箭矢，箭头产生的电流会持续造成伤害",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10019.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "增强型破片手雷",
          "abilityDesc": "防御型破片手雷，能较好地破坏护甲和裸露的四肢",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10021.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "敌情分析",
          "abilityDesc": "受到露娜伤害的敌方目标会被短暂标记",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10022.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135668",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135675",
          "tagType": "god"
        }
      ]
    },
    {
      "id": 10016,
      "operatorID": 88000000026,
      "operator": "骇爪",
      "fullName": "麦晓雯",
      "armyType": "侦察",
      "pic": "https://playerhub.df.qq.com/playerhub/60004/object/88000000026.png",
      "sort": 0,
      "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_88000000026.png",
      "armyTypePic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10033.png",
      "armyTypeDesc": "侦察兵精通战场情报收集，可用侦察电台获得战区信息。",
      "abilitiesList": [
        {
          "abilityType": "gear",
          "abilityTypeCN": "战术装备",
          "position": "detect",
          "positionCN": "侦查",
          "abilityName": "信号破译器",
          "abilityDesc": "使用破译器周期性扫描前方60m最多六个敌方电子信号，并在隐形眼镜显示这些信号的追踪轨迹线。距离最近的轨迹线会显示为红色。敌方收到的警示等级会随骇爪距离接近而增强",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10034.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "flash",
          "positionCN": "闪光",
          "abilityName": "闪光巡飞器",
          "abilityDesc": "丢出向前飞行的巡飞器，用闪光灯致盲范围内的敌人。用准星选中破译器的轨迹线时，巡飞器会跟随选中的黄色轨迹线飞行",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10035.png",
          "sort": 0
        },
        {
          "abilityType": "props",
          "abilityTypeCN": "战术道具",
          "position": "harm",
          "positionCN": "伤害",
          "abilityName": "数据飞刀",
          "abilityDesc": "投掷数据飞刀，停止时会骇入附近10m的电子设备并使其暂时失效。直接命中敌人时会造成大量伤害",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10036.png",
          "sort": 0
        },
        {
          "abilityType": "forte",
          "abilityTypeCN": "干员特长",
          "position": "passive",
          "positionCN": "被动",
          "abilityName": "隐匿消声",
          "abilityDesc": "静步走路和蹲下移动速度更快，同时发出的声音也更小",
          "abilityPic": "https://playerhub.df.qq.com/playerhub/60004/operator/abilities/10037.png",
          "sort": 0
        }
      ],
      "strategyList": [
        {
          "tagID": "135669",
          "tagType": "oneMinute"
        },
        {
          "tagID": "135676",
          "tagType": "god"
        }
      ]
    }
  ],
  "message": "succ",
  "amsSerial": "AMS-DFM-0721101034-GMBnYE-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:10:34.928Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|[object]|true|none||none|
|»» code|integer|true|none||none|
|»» msg|string|true|none||none|
|»» list|[object]|true|none||none|
|»»» id|integer|true|none||ID（不可用于战绩对照）|
|»»» operatorID|integer|true|none||干员ID（用于静态资源）|
|»»» operator|string|true|none||干员代号|
|»»» fullName|string|true|none||干员名|
|»»» armyType|string|true|none||兵种|
|»»» pic|string|true|none||头图|
|»»» sort|integer|true|none||权重（均为0）|
|»»» prePic|string|true|none||预览头图|
|»»» armyTypePic|string|true|none||兵种图标|
|»»» armyTypeDesc|string|true|none||兵种描述|
|»»» abilitiesList|[object]|true|none||none|
|»»»» abilityType|string|true|none||技能类型<br />gear-战术装备<br />props-战术道具<br />forte-干员特长|
|»»»» abilityTypeCN|string|true|none||技能类型中文|
|»»»» position|string|true|none||作用类型<br />harm-伤害<br />cover-掩体<br />passive-被动能力|
|»»»» positionCN|string|true|none||作用类型中文|
|»»»» abilityName|string|true|none||技能名称|
|»»»» abilityDesc|string|true|none||技能描述|
|»»»» abilityPic|string|true|none||技能图片|
|»»»» sort|integer|true|none||权重（均为0）|
|»»» strategyList|[object]|true|none||none|
|»»»» tagID|string|true|none||标签ID（对应干员攻略）|
|»»»» tagType|string|true|none||标签类型|
|» message|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 官方历史成交价（V1）

GET /df/object/price/history/v1

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "date": "2025-07-15",
        "avgPrice": 299617,
        "count": 187
      },
      {
        "date": "2025-07-16",
        "avgPrice": 296101,
        "count": 218
      },
      {
        "date": "2025-07-17",
        "avgPrice": 292615,
        "count": 207
      },
      {
        "date": "2025-07-18",
        "avgPrice": 287812,
        "count": 223
      },
      {
        "date": "2025-07-19",
        "avgPrice": 292745,
        "count": 217
      },
      {
        "date": "2025-07-20",
        "avgPrice": 279541,
        "count": 209
      },
      {
        "date": "2025-07-21",
        "avgPrice": 306897,
        "count": 58
      }
    ],
    "currentTime": "2025-07-21 02:21:42",
    "amsSerial": "AMS-DFM-0721102142-O5Vowz-661959-316969",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:21:42.712Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:21:42.712Z"
    }
  },
  "message": "获取物品历史价格成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» objectPriceRecent|object|true|none||物品最近价格|
|»»» objectID|integer|true|none||物品ID|
|»»» list|[object]|true|none||none|
|»»»» date|string|true|none||日期|
|»»»» avgPrice|integer|true|none||当天平均价|
|»»»» count|integer|true|none||成交数|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» code|integer|true|none||none|
|»» msg|string|true|none||none|

## GET 框架历史成交价（V2）

GET /df/object/price/history/v2

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|objectId|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "objectID": 14060000003,
    "history": [
      {
        "timestamp": 1753063200000,
        "avgPrice": 282784
      },
      {
        "timestamp": 1752982200000,
        "avgPrice": 263764
      },
      {
        "timestamp": 1752980400000,
        "avgPrice": 263764
      },
      {
        "timestamp": 1752978600000,
        "avgPrice": 290371
      },
      {
        "timestamp": 1752976800000,
        "avgPrice": 290371
      },
      {
        "timestamp": 1752975000000,
        "avgPrice": 311993
      },
      {
        "timestamp": 1752973200000,
        "avgPrice": 311993
      },
      {
        "timestamp": 1752971400000,
        "avgPrice": 324337
      },
      {
        "timestamp": 1752969600000,
        "avgPrice": 324337
      },
      {
        "timestamp": 1752966000000,
        "avgPrice": 323235
      },
      {
        "timestamp": 1752964200000,
        "avgPrice": 321145
      },
      {
        "timestamp": 1752962400000,
        "avgPrice": 321145
      },
      {
        "timestamp": 1752960600000,
        "avgPrice": 310093
      },
      {
        "timestamp": 1752958800000,
        "avgPrice": 310093
      },
      {
        "timestamp": 1752957000000,
        "avgPrice": 300858
      },
      {
        "timestamp": 1752930000000,
        "avgPrice": 289784
      },
      {
        "timestamp": 1752928200000,
        "avgPrice": 291089
      },
      {
        "timestamp": 1752926400000,
        "avgPrice": 291089
      },
      {
        "timestamp": 1752924600000,
        "avgPrice": 292815
      },
      {
        "timestamp": 1752922800000,
        "avgPrice": 292815
      },
      {
        "timestamp": 1752921000000,
        "avgPrice": 285838
      },
      {
        "timestamp": 1752919200000,
        "avgPrice": 285838
      },
      {
        "timestamp": 1752917400000,
        "avgPrice": 271635
      },
      {
        "timestamp": 1752915600000,
        "avgPrice": 271635
      },
      {
        "timestamp": 1752913800000,
        "avgPrice": 268410
      },
      {
        "timestamp": 1752912000000,
        "avgPrice": 268410
      },
      {
        "timestamp": 1752910200000,
        "avgPrice": 262594
      },
      {
        "timestamp": 1752908400000,
        "avgPrice": 262594
      },
      {
        "timestamp": 1752906600000,
        "avgPrice": 267007
      },
      {
        "timestamp": 1752904800000,
        "avgPrice": 267007
      },
      {
        "timestamp": 1752903000000,
        "avgPrice": 265519
      },
      {
        "timestamp": 1752901200000,
        "avgPrice": 265519
      },
      {
        "timestamp": 1752899400000,
        "avgPrice": 267953
      },
      {
        "timestamp": 1752897600000,
        "avgPrice": 267953
      },
      {
        "timestamp": 1752895800000,
        "avgPrice": 272506
      },
      {
        "timestamp": 1752894000000,
        "avgPrice": 272506
      },
      {
        "timestamp": 1752892200000,
        "avgPrice": 305465
      },
      {
        "timestamp": 1752890400000,
        "avgPrice": 305465
      },
      {
        "timestamp": 1752888600000,
        "avgPrice": 330527
      },
      {
        "timestamp": 1752886800000,
        "avgPrice": 330527
      },
      {
        "timestamp": 1752885000000,
        "avgPrice": 331637
      },
      {
        "timestamp": 1752883200000,
        "avgPrice": 331637
      },
      {
        "timestamp": 1752881400000,
        "avgPrice": 337337
      },
      {
        "timestamp": 1752867000000,
        "avgPrice": 301087
      },
      {
        "timestamp": 1752865200000,
        "avgPrice": 301087
      },
      {
        "timestamp": 1752863400000,
        "avgPrice": 300514
      },
      {
        "timestamp": 1752861600000,
        "avgPrice": 300514
      },
      {
        "timestamp": 1752858000000,
        "avgPrice": 297313
      },
      {
        "timestamp": 1752856200000,
        "avgPrice": 293175
      },
      {
        "timestamp": 1752854400000,
        "avgPrice": 293175
      },
      {
        "timestamp": 1752852600000,
        "avgPrice": 286808
      },
      {
        "timestamp": 1752850800000,
        "avgPrice": 286808
      },
      {
        "timestamp": 1752849000000,
        "avgPrice": 283968
      },
      {
        "timestamp": 1752847200000,
        "avgPrice": 283968
      },
      {
        "timestamp": 1752845400000,
        "avgPrice": 282523
      },
      {
        "timestamp": 1752843600000,
        "avgPrice": 282523
      },
      {
        "timestamp": 1752841800000,
        "avgPrice": 284026
      },
      {
        "timestamp": 1752840000000,
        "avgPrice": 284026
      },
      {
        "timestamp": 1752838200000,
        "avgPrice": 284836
      },
      {
        "timestamp": 1752836400000,
        "avgPrice": 284836
      },
      {
        "timestamp": 1752834600000,
        "avgPrice": 279245
      },
      {
        "timestamp": 1752832800000,
        "avgPrice": 279245
      },
      {
        "timestamp": 1752831000000,
        "avgPrice": 271959
      },
      {
        "timestamp": 1752829200000,
        "avgPrice": 271959
      },
      {
        "timestamp": 1752827400000,
        "avgPrice": 261529
      },
      {
        "timestamp": 1752825600000,
        "avgPrice": 261529
      },
      {
        "timestamp": 1752823800000,
        "avgPrice": 259435
      },
      {
        "timestamp": 1752822000000,
        "avgPrice": 259435
      },
      {
        "timestamp": 1752820200000,
        "avgPrice": 257166
      },
      {
        "timestamp": 1752818400000,
        "avgPrice": 257166
      },
      {
        "timestamp": 1752816600000,
        "avgPrice": 254453
      },
      {
        "timestamp": 1752814800000,
        "avgPrice": 254453
      },
      {
        "timestamp": 1752813000000,
        "avgPrice": 261351
      },
      {
        "timestamp": 1752811200000,
        "avgPrice": 261351
      },
      {
        "timestamp": 1752809400000,
        "avgPrice": 270395
      },
      {
        "timestamp": 1752807600000,
        "avgPrice": 270395
      },
      {
        "timestamp": 1752805800000,
        "avgPrice": 287098
      },
      {
        "timestamp": 1752804000000,
        "avgPrice": 287098
      },
      {
        "timestamp": 1752802200000,
        "avgPrice": 317889
      },
      {
        "timestamp": 1752800400000,
        "avgPrice": 317889
      },
      {
        "timestamp": 1752798600000,
        "avgPrice": 333819
      },
      {
        "timestamp": 1752796800000,
        "avgPrice": 333819
      },
      {
        "timestamp": 1752795000000,
        "avgPrice": 336762
      },
      {
        "timestamp": 1752793200000,
        "avgPrice": 336762
      },
      {
        "timestamp": 1752791400000,
        "avgPrice": 335408
      },
      {
        "timestamp": 1752789600000,
        "avgPrice": 335408
      },
      {
        "timestamp": 1752787800000,
        "avgPrice": 324014
      },
      {
        "timestamp": 1752786000000,
        "avgPrice": 324014
      },
      {
        "timestamp": 1752784200000,
        "avgPrice": 311846
      },
      {
        "timestamp": 1752782400000,
        "avgPrice": 311846
      },
      {
        "timestamp": 1752780600000,
        "avgPrice": 300832
      },
      {
        "timestamp": 1752778800000,
        "avgPrice": 300832
      },
      {
        "timestamp": 1752777000000,
        "avgPrice": 300484
      },
      {
        "timestamp": 1752775200000,
        "avgPrice": 300484
      },
      {
        "timestamp": 1752773400000,
        "avgPrice": 295950
      },
      {
        "timestamp": 1752771600000,
        "avgPrice": 295950
      },
      {
        "timestamp": 1752769800000,
        "avgPrice": 293208
      },
      {
        "timestamp": 1752768000000,
        "avgPrice": 293208
      },
      {
        "timestamp": 1752766200000,
        "avgPrice": 291872
      },
      {
        "timestamp": 1752764400000,
        "avgPrice": 291872
      },
      {
        "timestamp": 1752762600000,
        "avgPrice": 284780
      },
      {
        "timestamp": 1752760800000,
        "avgPrice": 284780
      },
      {
        "timestamp": 1752759000000,
        "avgPrice": 283808
      },
      {
        "timestamp": 1752757200000,
        "avgPrice": 283808
      },
      {
        "timestamp": 1752755400000,
        "avgPrice": 286176
      },
      {
        "timestamp": 1752753600000,
        "avgPrice": 286176
      },
      {
        "timestamp": 1752751800000,
        "avgPrice": 291907
      },
      {
        "timestamp": 1752750000000,
        "avgPrice": 291907
      },
      {
        "timestamp": 1752748200000,
        "avgPrice": 286306
      },
      {
        "timestamp": 1752746400000,
        "avgPrice": 286306
      },
      {
        "timestamp": 1752744600000,
        "avgPrice": 276052
      },
      {
        "timestamp": 1752742800000,
        "avgPrice": 276052
      },
      {
        "timestamp": 1752741000000,
        "avgPrice": 263715
      },
      {
        "timestamp": 1752739200000,
        "avgPrice": 263715
      },
      {
        "timestamp": 1752737400000,
        "avgPrice": 259989
      },
      {
        "timestamp": 1752735600000,
        "avgPrice": 259989
      },
      {
        "timestamp": 1752733800000,
        "avgPrice": 256581
      },
      {
        "timestamp": 1752732000000,
        "avgPrice": 256581
      },
      {
        "timestamp": 1752730200000,
        "avgPrice": 256057
      },
      {
        "timestamp": 1752728400000,
        "avgPrice": 256057
      },
      {
        "timestamp": 1752726600000,
        "avgPrice": 256934
      },
      {
        "timestamp": 1752724800000,
        "avgPrice": 256934
      },
      {
        "timestamp": 1752723000000,
        "avgPrice": 279523
      },
      {
        "timestamp": 1752721200000,
        "avgPrice": 279523
      },
      {
        "timestamp": 1752719400000,
        "avgPrice": 300985
      },
      {
        "timestamp": 1752717600000,
        "avgPrice": 300985
      },
      {
        "timestamp": 1752715800000,
        "avgPrice": 323261
      },
      {
        "timestamp": 1752714000000,
        "avgPrice": 323261
      },
      {
        "timestamp": 1752712200000,
        "avgPrice": 337072
      },
      {
        "timestamp": 1752710400000,
        "avgPrice": 337072
      },
      {
        "timestamp": 1752708600000,
        "avgPrice": 340675
      },
      {
        "timestamp": 1752706800000,
        "avgPrice": 340675
      },
      {
        "timestamp": 1752705000000,
        "avgPrice": 337500
      },
      {
        "timestamp": 1752703200000,
        "avgPrice": 337500
      },
      {
        "timestamp": 1752701400000,
        "avgPrice": 332793
      },
      {
        "timestamp": 1752699600000,
        "avgPrice": 332793
      },
      {
        "timestamp": 1752697800000,
        "avgPrice": 317667
      },
      {
        "timestamp": 1752696000000,
        "avgPrice": 317667
      },
      {
        "timestamp": 1752694200000,
        "avgPrice": 302640
      },
      {
        "timestamp": 1752692400000,
        "avgPrice": 302640
      },
      {
        "timestamp": 1752690600000,
        "avgPrice": 300524
      },
      {
        "timestamp": 1752688800000,
        "avgPrice": 300524
      },
      {
        "timestamp": 1752687000000,
        "avgPrice": 300941
      },
      {
        "timestamp": 1752685200000,
        "avgPrice": 300941
      },
      {
        "timestamp": 1752683400000,
        "avgPrice": 300646
      },
      {
        "timestamp": 1752679800000,
        "avgPrice": 293214
      },
      {
        "timestamp": 1752678000000,
        "avgPrice": 293214
      },
      {
        "timestamp": 1752676200000,
        "avgPrice": 292598
      },
      {
        "timestamp": 1752674400000,
        "avgPrice": 292598
      },
      {
        "timestamp": 1752672600000,
        "avgPrice": 292114
      },
      {
        "timestamp": 1752670800000,
        "avgPrice": 292114
      },
      {
        "timestamp": 1752669000000,
        "avgPrice": 292114
      },
      {
        "timestamp": 1752667200000,
        "avgPrice": 292114
      },
      {
        "timestamp": 1752665400000,
        "avgPrice": 292395
      },
      {
        "timestamp": 1752663600000,
        "avgPrice": 292395
      },
      {
        "timestamp": 1752661800000,
        "avgPrice": 291954
      },
      {
        "timestamp": 1752660000000,
        "avgPrice": 291954
      },
      {
        "timestamp": 1752658200000,
        "avgPrice": 279938
      },
      {
        "timestamp": 1752656400000,
        "avgPrice": 279938
      },
      {
        "timestamp": 1752654600000,
        "avgPrice": 267628
      },
      {
        "timestamp": 1752652800000,
        "avgPrice": 267628
      },
      {
        "timestamp": 1752651000000,
        "avgPrice": 267614
      },
      {
        "timestamp": 1752649200000,
        "avgPrice": 267614
      },
      {
        "timestamp": 1752647400000,
        "avgPrice": 264146
      },
      {
        "timestamp": 1752645600000,
        "avgPrice": 264146
      },
      {
        "timestamp": 1752643800000,
        "avgPrice": 264048
      },
      {
        "timestamp": 1752642000000,
        "avgPrice": 264048
      },
      {
        "timestamp": 1752640200000,
        "avgPrice": 265806
      },
      {
        "timestamp": 1752638400000,
        "avgPrice": 265806
      },
      {
        "timestamp": 1752636600000,
        "avgPrice": 271566
      },
      {
        "timestamp": 1752634800000,
        "avgPrice": 271566
      },
      {
        "timestamp": 1752633000000,
        "avgPrice": 292229
      },
      {
        "timestamp": 1752631200000,
        "avgPrice": 292229
      },
      {
        "timestamp": 1752629400000,
        "avgPrice": 320302
      },
      {
        "timestamp": 1752627600000,
        "avgPrice": 320302
      },
      {
        "timestamp": 1752625800000,
        "avgPrice": 339202
      },
      {
        "timestamp": 1752624000000,
        "avgPrice": 339202
      },
      {
        "timestamp": 1752622200000,
        "avgPrice": 340316
      },
      {
        "timestamp": 1752620400000,
        "avgPrice": 340316
      },
      {
        "timestamp": 1752618600000,
        "avgPrice": 342713
      },
      {
        "timestamp": 1752616800000,
        "avgPrice": 342713
      },
      {
        "timestamp": 1752615000000,
        "avgPrice": 339852
      },
      {
        "timestamp": 1752613200000,
        "avgPrice": 339852
      },
      {
        "timestamp": 1752611400000,
        "avgPrice": 327896
      },
      {
        "timestamp": 1752609600000,
        "avgPrice": 327896
      },
      {
        "timestamp": 1752607800000,
        "avgPrice": 307703
      },
      {
        "timestamp": 1752606000000,
        "avgPrice": 307703
      },
      {
        "timestamp": 1752604200000,
        "avgPrice": 300909
      },
      {
        "timestamp": 1752602400000,
        "avgPrice": 300909
      },
      {
        "timestamp": 1752600600000,
        "avgPrice": 301049
      },
      {
        "timestamp": 1752598800000,
        "avgPrice": 301049
      },
      {
        "timestamp": 1752597000000,
        "avgPrice": 300963
      },
      {
        "timestamp": 1752595200000,
        "avgPrice": 300963
      },
      {
        "timestamp": 1752593400000,
        "avgPrice": 300579
      },
      {
        "timestamp": 1752591600000,
        "avgPrice": 300579
      },
      {
        "timestamp": 1752589800000,
        "avgPrice": 292997
      },
      {
        "timestamp": 1752588000000,
        "avgPrice": 292997
      },
      {
        "timestamp": 1752586200000,
        "avgPrice": 290594
      },
      {
        "timestamp": 1752584400000,
        "avgPrice": 290594
      },
      {
        "timestamp": 1752582600000,
        "avgPrice": 293839
      },
      {
        "timestamp": 1752580800000,
        "avgPrice": 293839
      },
      {
        "timestamp": 1752579000000,
        "avgPrice": 298667
      },
      {
        "timestamp": 1752577200000,
        "avgPrice": 298667
      },
      {
        "timestamp": 1752575400000,
        "avgPrice": 291824
      },
      {
        "timestamp": 1752573600000,
        "avgPrice": 291824
      },
      {
        "timestamp": 1752571800000,
        "avgPrice": 279944
      },
      {
        "timestamp": 1752570000000,
        "avgPrice": 279944
      },
      {
        "timestamp": 1752568200000,
        "avgPrice": 273259
      },
      {
        "timestamp": 1752566400000,
        "avgPrice": 273259
      },
      {
        "timestamp": 1752564600000,
        "avgPrice": 267781
      },
      {
        "timestamp": 1752562800000,
        "avgPrice": 267781
      },
      {
        "timestamp": 1752561000000,
        "avgPrice": 265583
      },
      {
        "timestamp": 1752559200000,
        "avgPrice": 265583
      },
      {
        "timestamp": 1752557400000,
        "avgPrice": 269943
      },
      {
        "timestamp": 1752555600000,
        "avgPrice": 269943
      },
      {
        "timestamp": 1752553800000,
        "avgPrice": 271464
      },
      {
        "timestamp": 1752552000000,
        "avgPrice": 271464
      },
      {
        "timestamp": 1752550200000,
        "avgPrice": 280126
      },
      {
        "timestamp": 1752548400000,
        "avgPrice": 280126
      },
      {
        "timestamp": 1752546600000,
        "avgPrice": 292095
      },
      {
        "timestamp": 1752544800000,
        "avgPrice": 292095
      },
      {
        "timestamp": 1752543000000,
        "avgPrice": 320058
      },
      {
        "timestamp": 1752541200000,
        "avgPrice": 320058
      },
      {
        "timestamp": 1752539400000,
        "avgPrice": 337562
      },
      {
        "timestamp": 1752537600000,
        "avgPrice": 337562
      },
      {
        "timestamp": 1752535800000,
        "avgPrice": 340988
      },
      {
        "timestamp": 1752534000000,
        "avgPrice": 340988
      },
      {
        "timestamp": 1752532200000,
        "avgPrice": 339487
      },
      {
        "timestamp": 1752530400000,
        "avgPrice": 339487
      },
      {
        "timestamp": 1752528600000,
        "avgPrice": 338492
      },
      {
        "timestamp": 1752526800000,
        "avgPrice": 338492
      },
      {
        "timestamp": 1752525000000,
        "avgPrice": 326558
      },
      {
        "timestamp": 1752523200000,
        "avgPrice": 326558
      },
      {
        "timestamp": 1752521400000,
        "avgPrice": 310715
      },
      {
        "timestamp": 1752519600000,
        "avgPrice": 310715
      },
      {
        "timestamp": 1752517800000,
        "avgPrice": 302780
      },
      {
        "timestamp": 1752516000000,
        "avgPrice": 302780
      },
      {
        "timestamp": 1752514200000,
        "avgPrice": 301240
      },
      {
        "timestamp": 1752512400000,
        "avgPrice": 301240
      },
      {
        "timestamp": 1752510600000,
        "avgPrice": 301153
      },
      {
        "timestamp": 1752508800000,
        "avgPrice": 301153
      },
      {
        "timestamp": 1752507000000,
        "avgPrice": 300583
      },
      {
        "timestamp": 1752505200000,
        "avgPrice": 300583
      },
      {
        "timestamp": 1752503400000,
        "avgPrice": 299686
      },
      {
        "timestamp": 1752501600000,
        "avgPrice": 299686
      },
      {
        "timestamp": 1752499800000,
        "avgPrice": 298619
      },
      {
        "timestamp": 1752498000000,
        "avgPrice": 298619
      },
      {
        "timestamp": 1752496200000,
        "avgPrice": 297947
      },
      {
        "timestamp": 1752494400000,
        "avgPrice": 297947
      },
      {
        "timestamp": 1752492600000,
        "avgPrice": 299509
      },
      {
        "timestamp": 1752490800000,
        "avgPrice": 299509
      },
      {
        "timestamp": 1752489000000,
        "avgPrice": 297461
      },
      {
        "timestamp": 1752487200000,
        "avgPrice": 297461
      },
      {
        "timestamp": 1752485400000,
        "avgPrice": 285518
      },
      {
        "timestamp": 1752483600000,
        "avgPrice": 285518
      },
      {
        "timestamp": 1752481800000,
        "avgPrice": 278286
      },
      {
        "timestamp": 1752480000000,
        "avgPrice": 278286
      },
      {
        "timestamp": 1752478200000,
        "avgPrice": 274895
      },
      {
        "timestamp": 1752476400000,
        "avgPrice": 274895
      },
      {
        "timestamp": 1752474600000,
        "avgPrice": 274961
      },
      {
        "timestamp": 1752472800000,
        "avgPrice": 274961
      },
      {
        "timestamp": 1752471000000,
        "avgPrice": 273155
      },
      {
        "timestamp": 1752469200000,
        "avgPrice": 273155
      },
      {
        "timestamp": 1752467400000,
        "avgPrice": 276720
      },
      {
        "timestamp": 1752465600000,
        "avgPrice": 276720
      },
      {
        "timestamp": 1752463800000,
        "avgPrice": 284914
      },
      {
        "timestamp": 1752462000000,
        "avgPrice": 284914
      },
      {
        "timestamp": 1752460200000,
        "avgPrice": 298060
      }
    ],
    "stats": {
      "count": 268,
      "avgPrice": 294519,
      "minPrice": 254453,
      "maxPrice": 342713,
      "priceRange": 88260,
      "latestPrice": 282784,
      "oldestPrice": 298060,
      "priceChange": -15276,
      "priceChangePercent": -5.13
    },
    "latestData": {
      "timestamp": 1753063200000,
      "avgPrice": 282784
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» objectID|integer|true|none||物品ID|
|»» history|[object]|true|none||历史数据组|
|»»» timestamp|integer|true|none||时间戳|
|»»» avgPrice|integer|true|none||价格|
|»» stats|object|true|none||统计信息|
|»»» count|integer|true|none||价格数量|
|»»» avgPrice|integer|true|none||平均价格|
|»»» minPrice|integer|true|none||最低价格|
|»»» maxPrice|integer|true|none||最高价格|
|»»» priceRange|integer|true|none||价格变动|
|»»» latestPrice|integer|true|none||最新价格|
|»»» oldestPrice|integer|true|none||最老价格|
|»»» priceChange|integer|true|none||价格变化（最早到最新）|
|»»» priceChangePercent|number|true|none||价格变化率|
|»» latestData|object|true|none||none|
|»»» timestamp|integer|true|none||none|
|»»» avgPrice|integer|true|none||none|

## GET 官方物品最新价格

GET /df/object/price/latest

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |支持数组（必填）|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "objectID": "14060000003",
        "avgPrice": 282784
      }
    ],
    "currentTime": "2025-07-21 02:23:50",
    "amsSerial": "AMS-DFM-0721102350-NB0Byd-661959-316969",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:23:50.303Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:23:50.303Z"
    }
  },
  "message": "获取物品价格成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» prices|[object]|true|none||价格|
|»»» objectID|string|false|none||物品ID|
|»»» avgPrice|integer|false|none||最新价格|
|»» currentTime|string|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

# 业务/tools

## GET 每日密码

GET /df/tools/dailykeyword

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "id": 100010,
        "desc": "零号大坝:3839;\n长弓溪谷:3424;\n巴克什:6379;\n航天基地:8214;\n潮汐监狱:6900",
        "skipType": 6,
        "skipURL": "18226"
      }
    ],
    "currentTime": "2025-07-21 10:13:33",
    "configID": 10001,
    "amsSerial": "AMS-DFM-0721101333-t67ESn-661959-384918",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:13:33.356Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "384918",
      "timestamp": "2025-07-21T02:13:33.356Z"
    }
  },
  "message": "获取每日密码成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» keywords|[object]|true|none||密码|
|»»» id|integer|false|none||none|
|»»» desc|string|false|none||从这里提取即可|
|»»» skipType|integer|false|none||none|
|»»» skipURL|string|false|none||none|
|»» currentTime|string|true|none||none|
|»» configID|integer|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

## GET 文章列表

GET /df/tools/article/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "articles": {
      "currentTime": "2025-07-21 10:14:12",
      "list": {
        "135654": [
          {
            "threadID": 18174,
            "dataID": "3733524465458203779",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/a2d012d25476f0fbab0cd661a3aa83f0/0/?width=40&height=40",
            "title": "11月21日更新公告丨新赛季聚变即将开启！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/4c5884596df77aad8ec69504e4e3be58/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 57,
            "viewCount": 8044,
            "createdAt": "2024-11-20 14:45:52",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 18173,
            "dataID": "2942732043475736193",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/a2d012d25476f0fbab0cd661a3aa83f0/0/?width=40&height=40",
            "title": "《三角洲行动》聚变赛季版本更新福利一览！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/35ae66e5099c8f1c641ad6961063eab0/0/?width=500&height=277",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 48,
            "viewCount": 6564,
            "createdAt": "2024-11-20 10:25:25",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655,
              135656
            ]
          },
          {
            "threadID": 18153,
            "dataID": "14297646779657261073",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/da2228f4b8b98022a132aa0535699778/0/?width=40&height=40",
            "title": "11月7日更新公告丨特战干员&战场道具平衡性调整",
            "cover": "//img.crawler.qq.com/cfwebcap/0/597a59eb65d4f1aa680ebd08345e9f79/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 44,
            "viewCount": 7394,
            "createdAt": "2024-11-06 20:21:23",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 18141,
            "dataID": "14333806279709113567",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d7657ea9f6b571ec08447e6de5edae3e/0/?width=40&height=40",
            "title": "10月31日更新公告丨平衡性调整&周末福利上新",
            "cover": "//img.crawler.qq.com/cfwebcap/0/b48181a8ff61cb5889d3e02d108e4bfc/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 34,
            "viewCount": 4642,
            "createdAt": "2024-10-31 17:31:09",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 18129,
            "dataID": "18381993570680128765",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/45f66837d397c932071c04b49afd2aa2/0/?width=40&height=40",
            "title": "10月24日更新公告丨新活动黑鹰补给&战场闪击限时开启",
            "cover": "//img.crawler.qq.com/cfwebcap/0/25fc743930451df0b00e5c29f21a135e/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 148,
            "viewCount": 12243,
            "createdAt": "2024-10-23 18:13:46",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135654
            ]
          },
          {
            "threadID": 18105,
            "dataID": "3528769779693908445",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/0dc84b0b4110b9164f6e06776c76023e/0/?width=40&height=40",
            "title": "10月17日更新公告丨全面战场闪击玩法限时开启",
            "cover": "//img.crawler.qq.com/cfwebcap/0/0df9d477c3017fa306b795f0f6a650f0/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 175,
            "viewCount": 13717,
            "createdAt": "2024-10-16 17:20:13",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 18093,
            "dataID": "1770194767102775667",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/5c268bb8520bc422bd6467653952bda1/0/?width=40&height=40",
            "title": "10月10日更新公告丨新干员乌鲁鲁报道&绝密行动即将开启！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/14a8a13163ca4680b277054f9a7b3f97/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 198,
            "viewCount": 12648,
            "createdAt": "2024-10-09 18:32:04",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 18078,
            "dataID": "17156746706874538508",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "【蚀金玫瑰】系列外观现已上线！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/104d988985828bba506517a01fbeee3b/0/?width=694&height=1269",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 52,
            "viewCount": 6128,
            "createdAt": "2024-10-03 00:01:04",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131532,
              131531,
              131533,
              127223,
              127222,
              127225,
              135654,
              135149,
              135148,
              135656
            ]
          },
          {
            "threadID": 18077,
            "dataID": "7054790090683829099",
            "author": "三角洲",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/f3fdaf7c18f103fc6725b5fc215b6c77/0/?width=40&height=40",
            "title": "全体PC玩家注意丨福利指南请查收！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/b836d487e1e5007cc8786b75214fab6b/0/?width=694&height=1269",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 39,
            "viewCount": 9500,
            "createdAt": "2024-09-30 23:57:38",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              127223,
              127222,
              127224,
              131532,
              131531,
              135656,
              135149,
              135148,
              135654
            ]
          },
          {
            "threadID": 18053,
            "dataID": "556694506455921941",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "G.T.I.起源补给丨登录直送物流十连抽及进阶安全箱！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/e83e055ea62c37915d5ad0d20cd03495/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 894,
            "viewCount": 56455,
            "createdAt": "2024-09-29 17:39:03",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135656
            ]
          },
          {
            "threadID": 18020,
            "dataID": "287888812267696328",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "《三角洲行动》开服活动福利一览",
            "cover": "//img.crawler.qq.com/cfwebcap/0/2149d9d1287e5944980018d64dda26d2/0/?width=500&height=270",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 1592,
            "viewCount": 135611,
            "createdAt": "2024-09-24 21:13:09",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135654,
              135149,
              135148,
              135656
            ]
          },
          {
            "threadID": 18021,
            "dataID": "9356251434274533672",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "《三角洲行动》9月26日开服公告",
            "cover": "//img.crawler.qq.com/cfwebcap/0/c722349cdfee4d970a68abb1eb030ce3/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 229,
            "viewCount": 12635,
            "createdAt": "2024-09-24 21:00:31",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135654,
              135149,
              135148,
              135655
            ]
          },
          {
            "threadID": 17985,
            "dataID": "15891103060241859462",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "《三角洲行动》9月26日正式上线PC及移动端！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/ca9def1adb991ba501d08b8e0f485d57/0/?width=300&height=153",
            "summary": "是时候玩一点好画面、好玩法、好体验、好手感、好刺激、好热血、好细节、好有趣、好带感……\n真国产自研，来自琳琅天上：2024年9月26日，是时候，玩点好的了！",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 148,
            "viewCount": 6976,
            "createdAt": "2024-09-13 11:35:01",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135142,
              135135,
              135134
            ]
          }
        ],
        "135655": [
          {
            "threadID": 18226,
            "dataID": "1050294968085403203",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/372f27f7fd761542e7b6543312074368/0/?width=40&height=40",
            "title": "每日彩蛋门密码位置——7月21日（每天0点更新，已更新潮汐监狱）",
            "cover": "//static.gametalk.qq.com/image/423/1738082279_59d1aded2f0e1a303a6cc89c986c890b.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": true,
            "likedCount": 266075,
            "viewCount": 13925693,
            "createdAt": "2025-07-21 00:00:28",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135655,
              135149,
              135148,
              135140
            ]
          },
          {
            "threadID": 18396,
            "dataID": "7082681177711511335",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1752476320_a546328c599e604d2888645e7bb7150c.png",
            "title": "新鳄鱼巢穴活动 地图详细位置",
            "cover": "//static.gametalk.qq.com/image/423/1752809441_1301fc0aa126b6b6751617409f7b909f.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 842,
            "viewCount": 140021,
            "createdAt": "2025-07-18 11:32:01",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135812,
              135811,
              135141,
              135135,
              135134
            ]
          },
          {
            "threadID": 18395,
            "dataID": "11983309974963033353",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1752476320_a546328c599e604d2888645e7bb7150c.png",
            "title": "(7.18-7.25)集市：家居风尚兑换物品",
            "cover": "//static.gametalk.qq.com/image/423/1752805132_be1105502172e686c980856fe5b939ed.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 85,
            "viewCount": 40579,
            "createdAt": "2025-07-18 10:19:21",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135812,
              135811,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18394,
            "dataID": "8660869231826822853",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1752476320_a546328c599e604d2888645e7bb7150c.png",
            "title": "罗德岛特殊补给箱点位一览",
            "cover": "//static.gametalk.qq.com/image/423/1752722439_be1105502172e686c980856fe5b939ed.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 178,
            "viewCount": 67568,
            "createdAt": "2025-07-17 11:22:02",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135812,
              135811
            ]
          },
          {
            "threadID": 18393,
            "dataID": "17600634207793562360",
            "author": "三角洲行动",
            "avatar": "https://shp.qpic.cn/cfwebcap/0/1bb25e4cc7551d1017cce1a880608b93/0/?width=40&height=40",
            "title": "7月17日更新公告丨新武器KC17解锁＆活动上新！",
            "cover": "//static.gametalk.qq.com/image/423/1752657109_36655d848ffa32582f082c0adb7b2cf3.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 108,
            "viewCount": 103619,
            "createdAt": "2025-07-16 18:00:24",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131532,
              131531,
              131533,
              127224,
              127222,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18391,
            "dataID": "3802990564400140745",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1752476320_a546328c599e604d2888645e7bb7150c.png",
            "title": "(7.11-7.18)集市：电子科技兑换物品",
            "cover": "//static.gametalk.qq.com/image/423/1752476392_be1105502172e686c980856fe5b939ed.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 153,
            "viewCount": 87163,
            "createdAt": "2025-07-14 15:01:17",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135812,
              135811
            ]
          },
          {
            "threadID": 18384,
            "dataID": "11450340588294401127",
            "author": "三角洲行动",
            "avatar": "https://static.gametalk.qq.com/image/423/1747403189_89a249e1e4d8b931318fe180e048b0a6.png",
            "title": "7月11日更新公告丨方舟联动&赠礼活动即将开启！",
            "cover": "//static.gametalk.qq.com/image/423/1752129798_f045be56c9530d76777f9024d318466a.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 237,
            "viewCount": 138659,
            "createdAt": "2025-07-10 18:00:44",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131532,
              131531,
              131533,
              127224,
              127222,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18379,
            "dataID": "17188722162446913727",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1751965833_a546328c599e604d2888645e7bb7150c.png",
            "title": "\"破壁\"赛季新检视动作及新增大红",
            "cover": "//static.gametalk.qq.com/image/423/1752048169_8024da063f88e7590f4f20f85e19a2e1.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 218,
            "viewCount": 133180,
            "createdAt": "2025-07-09 16:25:19",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135136,
              135135,
              135134,
              135812,
              135811
            ]
          },
          {
            "threadID": 18378,
            "dataID": "4591696574043520041",
            "author": "三角洲社区小助手",
            "avatar": "https://static.gametalk.qq.com/image/423/1751965833_a546328c599e604d2888645e7bb7150c.png",
            "title": "零号大坝快速安全获取\"隐秘协议箱\"各位置路线",
            "cover": "//static.gametalk.qq.com/image/423/1751965889_91785181d38a58c711739902dbab00aa.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 349,
            "viewCount": 55658,
            "createdAt": "2025-07-08 17:12:16",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135655,
              135149,
              135148,
              135812,
              135811
            ]
          },
          {
            "threadID": 18377,
            "dataID": "14655301398692293811",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "【破壁】赛季通行证内容展示 ｜ 内含蜂医x送葬人·无题密令联动传说外观",
            "cover": "//static.gametalk.qq.com/image/423/1751520749_3a387339e7bb09b30bc507b737587203.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 484,
            "viewCount": 112835,
            "createdAt": "2025-07-03 13:33:03",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18376,
            "dataID": "4457414567447208299",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "《三角洲行动》全新破壁赛季故事短片",
            "cover": "//static.gametalk.qq.com/image/423/1751520483_997b0cf4f3b9fffbc8ce868de606df24.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 1270,
            "viewCount": 33477,
            "createdAt": "2025-07-03 13:28:58",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18372,
            "dataID": "12865861906607067641",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/372f27f7fd761542e7b6543312074368/0/?width=40&height=40",
            "title": "战备物流新赛季变化及核心奖励",
            "cover": "//static.gametalk.qq.com/image/423/1751449701_465fe911e9f6323f69ac8b2465134e44.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 135,
            "viewCount": 63616,
            "createdAt": "2025-07-02 17:48:51",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18371,
            "dataID": "823504128084060659",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/372f27f7fd761542e7b6543312074368/0/?width=40&height=40",
            "title": "\"破壁\"赛季通行证主要奖励一览",
            "cover": "//static.gametalk.qq.com/image/423/1751449164_465fe911e9f6323f69ac8b2465134e44.png",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 127,
            "viewCount": 73028,
            "createdAt": "2025-07-02 17:39:54",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18364,
            "dataID": "8062603049116942394",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/372f27f7fd761542e7b6543312074368/0/?width=40&height=40",
            "title": "“欢迎你，我的新玩具”",
            "cover": "//static.gametalk.qq.com/image/423/1751288796_4d28a080513aa675e7de4965a0a8c922.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 266,
            "viewCount": 85956,
            "createdAt": "2025-06-30 21:08:09",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18365,
            "dataID": "3809114716087673402",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "7月3日全新赛季【破壁】丨更新内容速览！",
            "cover": "//static.gametalk.qq.com/image/423/1751258486_579ef48d8117ec1de84d9bdcb3541f31.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 273,
            "viewCount": 187159,
            "createdAt": "2025-06-30 12:42:49",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135136,
              135135,
              135134,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18363,
            "dataID": "16509087684563454970",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "7月3日更新公告丨新赛季【破壁】即将开启！",
            "cover": "//static.gametalk.qq.com/image/423/1751254845_36655d848ffa32582f082c0adb7b2cf3.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 339,
            "viewCount": 322557,
            "createdAt": "2025-06-30 11:59:52",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131533,
              131531,
              131532,
              127224,
              127222,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18370,
            "dataID": "3730988649531454279",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "【超算纪元】系列外观实录 | 超算狙击，难掩锋芒",
            "cover": "//static.gametalk.qq.com/image/423/1751254951_91813292ece919a569c87744ad37245b.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 54,
            "viewCount": 13090,
            "createdAt": "2025-06-30 11:42:57",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18362,
            "dataID": "10076960478550682276",
            "author": "三角洲行动",
            "avatar": "https://static.gametalk.qq.com/image/423/1747403189_89a249e1e4d8b931318fe180e048b0a6.png",
            "title": "全新赛季「破壁」7月3日正式开启！方洲行动特别赠礼活动预告！",
            "cover": "//static.gametalk.qq.com/image/423/1751108557_85c6960faeb499fb2dc283d590d275ab.jpg",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 65,
            "viewCount": 48522,
            "createdAt": "2025-06-28 19:12:42",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131532,
              131531,
              131533,
              127223,
              127222,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18368,
            "dataID": "4584801777311686804",
            "author": "三角洲行动",
            "avatar": "https://static.gametalk.qq.com/image/423/1747403189_89a249e1e4d8b931318fe180e048b0a6.png",
            "title": "露娜 X 黑·天际线 联动短片「以箭之名，向你问候」",
            "cover": "//static.gametalk.qq.com/image/423/1751043053_5508a56717a212e1121b5f8c7368bdd6.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 125,
            "viewCount": 29254,
            "createdAt": "2025-06-28 00:52:36",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135655,
              135149,
              135148
            ]
          },
          {
            "threadID": 18369,
            "dataID": "13421878989768595178",
            "author": "三角洲行动",
            "avatar": "https://static.gametalk.qq.com/image/423/1747403189_89a249e1e4d8b931318fe180e048b0a6.png",
            "title": "三角洲行动 X 明日方舟 联动官宣短片「方洲行动」",
            "cover": "//static.gametalk.qq.com/image/423/1751043952_aea1e6463c006f47e0814b413697113e.jpg",
            "summary": "",
            "iInfoType": 2,
            "isLiked": false,
            "likedCount": 70,
            "viewCount": 15645,
            "createdAt": "2025-06-28 00:52:11",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135873,
              135872,
              135655,
              135149,
              135148
            ]
          }
        ],
        "135656": [
          {
            "threadID": 18173,
            "dataID": "2942732043475736193",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/a2d012d25476f0fbab0cd661a3aa83f0/0/?width=40&height=40",
            "title": "《三角洲行动》聚变赛季版本更新福利一览！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/35ae66e5099c8f1c641ad6961063eab0/0/?width=500&height=277",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 48,
            "viewCount": 6564,
            "createdAt": "2024-11-20 10:25:25",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135655,
              135656
            ]
          },
          {
            "threadID": 18078,
            "dataID": "17156746706874538508",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/d66386b248be9d038d1a7345521ee81a/0/?width=40&height=40",
            "title": "【蚀金玫瑰】系列外观现已上线！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/104d988985828bba506517a01fbeee3b/0/?width=694&height=1269",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 52,
            "viewCount": 6128,
            "createdAt": "2024-10-03 00:01:04",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              131532,
              131531,
              131533,
              127223,
              127222,
              127225,
              135654,
              135149,
              135148,
              135656
            ]
          },
          {
            "threadID": 18077,
            "dataID": "7054790090683829099",
            "author": "三角洲",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/f3fdaf7c18f103fc6725b5fc215b6c77/0/?width=40&height=40",
            "title": "全体PC玩家注意丨福利指南请查收！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/b836d487e1e5007cc8786b75214fab6b/0/?width=694&height=1269",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 39,
            "viewCount": 9500,
            "createdAt": "2024-09-30 23:57:38",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              127223,
              127222,
              127224,
              131532,
              131531,
              135656,
              135149,
              135148,
              135654
            ]
          },
          {
            "threadID": 18053,
            "dataID": "556694506455921941",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "G.T.I.起源补给丨登录直送物流十连抽及进阶安全箱！",
            "cover": "//img.crawler.qq.com/cfwebcap/0/e83e055ea62c37915d5ad0d20cd03495/0/?width=474&height=279",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 894,
            "viewCount": 56455,
            "createdAt": "2024-09-29 17:39:03",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135654,
              135149,
              135148,
              135656
            ]
          },
          {
            "threadID": 18020,
            "dataID": "287888812267696328",
            "author": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/ce4ca944e16c6e01214f89522933aac7/0/?width=40&height=40",
            "title": "《三角洲行动》开服活动福利一览",
            "cover": "//img.crawler.qq.com/cfwebcap/0/2149d9d1287e5944980018d64dda26d2/0/?width=500&height=270",
            "summary": "",
            "iInfoType": 1,
            "isLiked": false,
            "likedCount": 1592,
            "viewCount": 135611,
            "createdAt": "2024-09-24 21:13:09",
            "collectCount": 0,
            "astc": "",
            "gicpTags": [
              135136,
              135135,
              135134,
              135654,
              135149,
              135148,
              135656
            ]
          }
        ]
      }
    },
    "amsSerial": "AMS-DFM-0721101412-Fbvy7x-661959-316968",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:14:12.816Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316968",
      "timestamp": "2025-07-21T02:14:12.816Z"
    }
  },
  "message": "succ"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» ret|integer|true|none||none|
|» iRet|integer|true|none||none|
|» message|string|true|none||none|
|» sMsg|string|true|none||none|
|» sAmsSerial|string|true|none||none|
|» data|object|true|none||none|
|»» articles|object|true|none||none|
|»»» currentTime|string|true|none||当前时间|
|»»» list|object|true|none||列表|
|»»»» 135654|[object]|true|none||搜索的标签ID|
|»»»»» threadID|integer|true|none||文章ID|
|»»»»» dataID|string|true|none||数据ID|
|»»»»» author|string|true|none||作者|
|»»»»» avatar|string|true|none||头像url|
|»»»»» title|string|true|none||标题|
|»»»»» cover|string|true|none||封面（需要拼接https:）|
|»»»»» summary|string|true|none||简介|
|»»»»» iInfoType|integer|true|none||信息类型|
|»»»»» isLiked|boolean|true|none||是否喜欢（true/false）|
|»»»»» likedCount|integer|true|none||点赞数量|
|»»»»» viewCount|integer|true|none||浏览数量|
|»»»»» createdAt|string|true|none||创建时间|
|»»»»» collectCount|integer|true|none||收藏数量|
|»»»»» astc|string|true|none||未知（无）|
|»»»»» gicpTags|[integer]|true|none||tag标签ID|
|»»»» 135655|[object]|true|none||搜索的标签ID|
|»»»»» threadID|integer|true|none||文章ID|
|»»»»» dataID|string|true|none||数据ID|
|»»»»» author|string|true|none||作者|
|»»»»» avatar|string|true|none||头像url|
|»»»»» title|string|true|none||标题|
|»»»»» cover|string|true|none||封面（需要拼接https:）|
|»»»»» summary|string|true|none||简介|
|»»»»» iInfoType|integer|true|none||信息类型|
|»»»»» isLiked|boolean|true|none||是否喜欢（true/false）|
|»»»»» likedCount|integer|true|none||点赞数量|
|»»»»» viewCount|integer|true|none||浏览数量|
|»»»»» createdAt|string|true|none||创建时间|
|»»»»» collectCount|integer|true|none||收藏数量|
|»»»»» astc|string|true|none||未知（无）|
|»»»»» gicpTags|[integer]|true|none||tag标签ID|
|»»»» 135656|[object]|true|none||搜索的标签ID|
|»»»»» threadID|integer|true|none||文章ID|
|»»»»» dataID|string|true|none||数据ID|
|»»»»» author|string|true|none||作者|
|»»»»» avatar|string|true|none||头像url|
|»»»»» title|string|true|none||标题|
|»»»»» cover|string|true|none||封面（需要拼接https:）|
|»»»»» summary|string|true|none||简介|
|»»»»» iInfoType|integer|true|none||信息类型|
|»»»»» isLiked|boolean|true|none||是否喜欢（true/false）|
|»»»»» likedCount|integer|true|none||点赞数量|
|»»»»» viewCount|integer|true|none||浏览数量|
|»»»»» createdAt|string|true|none||创建时间|
|»»»»» collectCount|integer|true|none||收藏数量|
|»»»»» astc|string|true|none||未知（无）|
|»»»»» gicpTags|[integer]|true|none||tag标签ID|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» code|integer|true|none||none|
|»» msg|string|true|none||none|

## GET 文章详情

GET /df/tools/article/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|threadID|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "article": {
      "id": 18174,
      "author": {
        "uin": "",
        "nickname": "三角洲行动",
        "avatar": "https://img.crawler.qq.com/cfwebcap/0/a2d012d25476f0fbab0cd661a3aa83f0/0/?width=40&height=40",
        "userRegion": "未知",
        "gender": 0,
        "userLevelTitle": "",
        "userLevel": 0
      },
      "isFollow": false,
      "isMutual": false,
      "isLiked": false,
      "isCollect": false,
      "title": "11月21日更新公告丨新赛季聚变即将开启！",
      "contentType": 0,
      "categoryID": 0,
      "threadType": 1,
      "DataID": "3733524465458203779",
      "cover": "//img.crawler.qq.com/cfwebcap/0/4c5884596df77aad8ec69504e4e3be58/0/?width=474&height=279",
      "summary": "",
      "infoType": 1,
      "content": {
        "text": "<p><img src=\"https://img.crawler.qq.com/cfwebcap/0/29bf4d97b4048a4e935f2e75080f1555/0/?width=542&amp;height=14430\" alt=\"\" width=\"500\" height=\"13312\" style=\"display: block; margin-left: auto; margin-right: auto;\" /></p>"
      },
      "createdAt": "2024-11-20 14:45:52",
      "editedAt": "2024-11-20 14:45:52",
      "postCount": 0,
      "viewCount": 8044,
      "shareCount": 0,
      "likedCount": 57,
      "collectCount": 0,
      "tryCount": 0,
      "isApproved": 1,
      "isStick": 0,
      "isEssence": 0,
      "isHot": 0,
      "isLock": 0,
      "isRecommend": 0,
      "isDisplay": 1,
      "isDeleted": 0,
      "sort": 0,
      "ext": {
        "gicpTags": [
          135654,
          135655
        ]
      },
      "machineReviewStatus": 1,
      "visibleRange": 0
    },
    "currentTime": "2025-07-21T02:15:21.856Z",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:15:21.856Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:15:21.856Z"
    }
  },
  "message": "succ",
  "raw": {
    "ret": 0,
    "iRet": 0,
    "sMsg": "succ",
    "jData": {
      "data": {
        "code": 0,
        "data": {
          "id": 18174,
          "author": {
            "uin": "",
            "nickname": "三角洲行动",
            "avatar": "https://img.crawler.qq.com/cfwebcap/0/a2d012d25476f0fbab0cd661a3aa83f0/0/?width=40&height=40",
            "userRegion": "未知",
            "gender": 0,
            "userLevelTitle": "",
            "userLevel": 0
          },
          "isFollow": false,
          "isMutual": false,
          "isLiked": false,
          "isCollect": false,
          "title": "11月21日更新公告丨新赛季聚变即将开启！",
          "contentType": 0,
          "categoryID": 0,
          "threadType": 1,
          "DataID": "3733524465458203779",
          "cover": "//img.crawler.qq.com/cfwebcap/0/4c5884596df77aad8ec69504e4e3be58/0/?width=474&height=279",
          "summary": "",
          "infoType": 1,
          "content": {
            "text": "<p><img src=\"https://img.crawler.qq.com/cfwebcap/0/29bf4d97b4048a4e935f2e75080f1555/0/?width=542&amp;height=14430\" alt=\"\" width=\"500\" height=\"13312\" style=\"display: block; margin-left: auto; margin-right: auto;\" /></p>"
          },
          "createdAt": "2024-11-20 14:45:52",
          "editedAt": "2024-11-20 14:45:52",
          "postCount": 0,
          "viewCount": 8044,
          "shareCount": 0,
          "likedCount": 57,
          "collectCount": 0,
          "tryCount": 0,
          "isApproved": 1,
          "isStick": 0,
          "isEssence": 0,
          "isHot": 0,
          "isLock": 0,
          "isRecommend": 0,
          "isDisplay": 1,
          "isDeleted": 0,
          "sort": 0,
          "ext": {
            "gicpTags": [
              135654,
              135655
            ]
          },
          "machineReviewStatus": 1,
          "visibleRange": 0
        },
        "msg": "ok"
      }
    },
    "sAmsSerial": "AMS-DFM-0721101521-0q5TcE-661959-316969"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» ret|integer|true|none||none|
|» iRet|integer|true|none||none|
|» message|string|true|none||none|
|» sMsg|string|true|none||none|
|» sAmsSerial|string|true|none||none|
|» data|object|true|none||none|
|»» article|object|true|none||none|
|»»» id|integer|true|none||文章ID|
|»»» author|object|true|none||作者信息|
|»»»» uin|string|true|none||uin|
|»»»» nickname|string|true|none||昵称|
|»»»» avatar|string|true|none||头像url|
|»»»» userRegion|string|true|none||未知|
|»»»» gender|integer|true|none||未知|
|»»»» userLevelTitle|string|true|none||用户等级称号|
|»»»» userLevel|integer|true|none||用户等级|
|»»» isFollow|boolean|true|none||是否订阅|
|»»» isMutual|boolean|true|none||是否互关|
|»»» isLiked|boolean|true|none||是否点赞|
|»»» isCollect|boolean|true|none||是否收藏|
|»»» title|string|true|none||标题|
|»»» contentType|integer|true|none||内容类型|
|»»» categoryID|integer|true|none||分类ID|
|»»» threadType|integer|true|none||文档类型|
|»»» DataID|string|true|none||数据ID|
|»»» cover|string|true|none||封面url（需要拼接https）|
|»»» summary|string|true|none||简介|
|»»» infoType|integer|true|none||信息类型|
|»»» content|object|true|none||内容|
|»»»» text|string|true|none||html格式，需要转换|
|»»» createdAt|string|true|none||创建时间|
|»»» editedAt|string|true|none||编辑时间|
|»»» postCount|integer|true|none||评论数|
|»»» viewCount|integer|true|none||浏览数|
|»»» shareCount|integer|true|none||分享数|
|»»» likedCount|integer|true|none||点赞数|
|»»» collectCount|integer|true|none||收藏数|
|»»» tryCount|integer|true|none||未知|
|»»» isApproved|integer|true|none||是否过审|
|»»» isStick|integer|true|none||是否置顶|
|»»» isEssence|integer|true|none||是否精华|
|»»» isHot|integer|true|none||是否热门|
|»»» isLock|integer|true|none||是否锁定|
|»»» isRecommend|integer|true|none||是否推荐|
|»»» isDisplay|integer|true|none||是否展示|
|»»» isDeleted|integer|true|none||是否删除|
|»»» sort|integer|true|none||分类|
|»»» ext|object|true|none||none|
|»»»» gicpTags|[integer]|true|none||标签TAG|
|»»» machineReviewStatus|integer|true|none||机器审核状态|
|»»» visibleRange|integer|true|none||可见范围|
|»» currentTime|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» code|integer|true|none||none|
|»» msg|string|true|none||none|

## GET 主播巅峰赛排名（个人赛）

GET /df/tools/race1/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|match|query|string| 否 |none|
|type|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "rankList": [
      {
        "openid": "4915423564576162526",
        "plat": "抖音",
        "name": "yolo（三角洲行动）",
        "pic": "NULL",
        "teamId": "1",
        "score": 0,
        "killNum": 238,
        "crackNum": "11",
        "matchNum": 149,
        "rank": 1,
        "killNum ": 238
      },
      {
        "openid": "2428231936064635457",
        "plat": "抖音",
        "name": "陈凌（三角洲行动）",
        "pic": "NULL",
        "teamId": "72",
        "score": 0,
        "killNum": 235,
        "crackNum": "10",
        "matchNum": 133,
        "rank": 2,
        "killNum ": 235
      },
      {
        "openid": "14656620655903709637",
        "plat": "虎牙",
        "name": "QN小源",
        "pic": "NULL",
        "teamId": "19",
        "score": 0,
        "killNum": 230,
        "crackNum": "14",
        "matchNum": 119,
        "rank": 3,
        "killNum ": 230
      },
      {
        "openid": "12762967056360128935",
        "plat": "抖音",
        "name": "一霖(三角洲行动）",
        "pic": "NULL",
        "teamId": "1",
        "score": 0,
        "killNum": 221,
        "crackNum": "12",
        "matchNum": 129,
        "rank": 4,
        "killNum ": 221
      },
      {
        "openid": "7222860452150461215",
        "plat": "B站",
        "name": "触类旁通YaY",
        "pic": "NULL",
        "teamId": "44",
        "score": 0,
        "killNum": 200,
        "crackNum": "16",
        "matchNum": 123,
        "rank": 5,
        "killNum ": 200
      },
      {
        "openid": "704868037461544187",
        "plat": "抖音",
        "name": "青年天赋OvO（三角洲行动）",
        "pic": "NULL",
        "teamId": "39",
        "score": 0,
        "killNum": 194,
        "crackNum": "8",
        "matchNum": 119,
        "rank": 6,
        "killNum ": 194
      },
      {
        "openid": "4192159576744720787",
        "plat": "B站",
        "name": "千言Yann",
        "pic": "NULL",
        "teamId": "2",
        "score": 0,
        "killNum": 192,
        "crackNum": "10",
        "matchNum": 127,
        "rank": 7,
        "killNum ": 192
      },
      {
        "openid": "10586793113459645917",
        "plat": "B站",
        "name": "文七Wen7",
        "pic": "NULL",
        "teamId": "44",
        "score": 0,
        "killNum": 191,
        "crackNum": "16",
        "matchNum": 112,
        "rank": 8,
        "killNum ": 191
      },
      {
        "openid": "8222099790560380512",
        "plat": "抖音",
        "name": "王中中（三角洲行动）",
        "pic": "NULL",
        "teamId": "46",
        "score": 0,
        "killNum": 189,
        "crackNum": "9",
        "matchNum": 125,
        "rank": 9,
        "killNum ": 189
      },
      {
        "openid": "4124279242585208795",
        "plat": "B站",
        "name": "贱徐",
        "pic": "NULL",
        "teamId": "32",
        "score": 0,
        "killNum": 189,
        "crackNum": "13",
        "matchNum": 111,
        "rank": 10,
        "killNum ": 189
      },
      {
        "openid": "7076649528370066089",
        "plat": "B站",
        "name": "成语小凤凰",
        "pic": "NULL",
        "teamId": "2",
        "score": 0,
        "killNum": 188,
        "crackNum": "10",
        "matchNum": 120,
        "rank": 11,
        "killNum ": 188
      },
      {
        "openid": "8950549339335200284",
        "plat": "抖音",
        "name": "林树（三角洲行动）",
        "pic": "NULL",
        "teamId": "1",
        "score": 0,
        "killNum": 184,
        "crackNum": "12",
        "matchNum": 111,
        "rank": 12,
        "killNum ": 184
      },
      {
        "openid": "7729587075093955497",
        "plat": "抖音",
        "name": "Mad98",
        "pic": "NULL",
        "teamId": "43",
        "score": 0,
        "killNum": 184,
        "crackNum": "10",
        "matchNum": 108,
        "rank": 13,
        "killNum ": 184
      },
      {
        "openid": "5441163421866268318",
        "plat": "抖音",
        "name": "08King（三角洲行动）",
        "pic": "NULL",
        "teamId": "56",
        "score": 0,
        "killNum": 179,
        "crackNum": "0",
        "matchNum": 130,
        "rank": 14,
        "killNum ": 179
      },
      {
        "openid": "7580778478350044403",
        "plat": "抖音",
        "name": "虾仁（三角洲行动）",
        "pic": "NULL",
        "teamId": "74",
        "score": 0,
        "killNum": 177,
        "crackNum": "4",
        "matchNum": 123,
        "rank": 15,
        "killNum ": 177
      },
      {
        "openid": "18050837278525548085",
        "plat": "虎牙",
        "name": "Mo丷",
        "pic": "NULL",
        "teamId": "54",
        "score": 0,
        "killNum": 177,
        "crackNum": "17",
        "matchNum": 121,
        "rank": 16,
        "killNum ": 177
      },
      {
        "openid": "16838354437351482062",
        "plat": "抖音",
        "name": "Nothing（三角洲行动）",
        "pic": "NULL",
        "teamId": "73",
        "score": 0,
        "killNum": 177,
        "crackNum": "6",
        "matchNum": 147,
        "rank": 17,
        "killNum ": 177
      },
      {
        "openid": "5080002603237016706",
        "plat": "抖音",
        "name": "luv(三角洲行动)",
        "pic": "NULL",
        "teamId": "4",
        "score": 0,
        "killNum": 175,
        "crackNum": "10",
        "matchNum": 146,
        "rank": 18,
        "killNum ": 175
      },
      {
        "openid": "6432633398874200693",
        "plat": "斗鱼",
        "name": "小铭XiaoMing阿",
        "pic": "NULL",
        "teamId": "96",
        "score": 0,
        "killNum": 174,
        "crackNum": "8",
        "matchNum": 132,
        "rank": 19,
        "killNum ": 174
      },
      {
        "openid": "16183440034833641446",
        "plat": "抖音",
        "name": "A4n4白毛（三角洲行动）",
        "pic": "NULL",
        "teamId": "32",
        "score": 0,
        "killNum": 174,
        "crackNum": "13",
        "matchNum": 124,
        "rank": 20,
        "killNum ": 174
      }
    ],
    "match": "solo",
    "type": "kill",
    "totalPage": 25,
    "currentTime": "2025-07-21T02:16:56.127Z",
    "amsSerial": "AMS-DFM-0721101655-vAG8eg-682187-402340",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:16:56.127Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "402340",
      "timestamp": "2025-07-21T02:16:56.127Z"
    }
  },
  "message": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» ret|integer|true|none||none|
|» iRet|integer|true|none||none|
|» message|string|true|none||none|
|» sMsg|string|true|none||ok|
|» sAmsSerial|string|true|none||none|
|» data|object|true|none||none|
|»» list|[oneOf]|true|none||个人信息列表|
|»»» openid|string|true|none||唯一OpenID|
|»»» plat|string|true|none||平台|
|»»» name|string|true|none||昵称|
|»»» pic|string|true|none||图片（默认NULL）|
|»»» teamId|string|true|none||组队赛所属队伍ID|
|»»» score|integer|true|none||仓库总价值|
|»»» killNum|integer|true|none||击杀数|
|»»» crackNum|string|true|none||破译数|
|»»» matchNum|integer|true|none||对局数|
|»»» rank|integer|true|none||排名|
|»»» killNum|integer|true|none||击杀数|
|»» match|string|true|none||类型（solo）|
|»» type|string|true|none||none|
|»» totalPage|integer|true|none||总页数（可对应在param中）|
|»» currentTime|string|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» jData_iRet|string|true|none||none|
|»» jData_sMsg|string|true|none||ok|

## GET 主播巅峰赛搜索

GET /df/tools/race1/search

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|match|query|string| 否 |none|
|key|query|string| 否 |none|
|type|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "searchResults": [
      {
        "openid": "8950549339335200284",
        "plat": "抖音",
        "name": "林树（三角洲行动）",
        "pic": "NULL",
        "teamId": "1",
        "score": 0,
        "killNum": 184,
        "crackNum": "12",
        "matchNum": 111,
        "rank": 12
      },
      {
        "openid": "2700000039669291149",
        "plat": "快手",
        "name": "林枫",
        "pic": "NULL",
        "teamId": "53",
        "score": 0,
        "killNum": 103,
        "crackNum": "0",
        "matchNum": 114,
        "rank": 124
      },
      {
        "openid": "5638016085274595100",
        "plat": "抖音",
        "name": "林中雨（三角洲行动）",
        "pic": "NULL",
        "teamId": "80",
        "score": 0,
        "killNum": 102,
        "crackNum": "3",
        "matchNum": 128,
        "rank": 129
      },
      {
        "openid": "16250692309942869045",
        "plat": "抖音",
        "name": "林克三角洲（大坝的神）",
        "pic": "NULL",
        "teamId": "0",
        "score": 0,
        "killNum": 36,
        "crackNum": "0",
        "matchNum": 68,
        "rank": 312
      },
      {
        "openid": "747855305780038484",
        "plat": "抖音",
        "name": "枫林（三角洲行动）",
        "pic": "NULL",
        "teamId": "0",
        "score": 0,
        "killNum": 13,
        "crackNum": "0",
        "matchNum": 57,
        "rank": 417
      },
      {
        "openid": "9819632092612656942",
        "plat": "虎牙",
        "name": "林柒-三角洲行动",
        "pic": "NULL",
        "teamId": "0",
        "score": 0,
        "killNum": 0,
        "crackNum": "0",
        "matchNum": 0,
        "rank": 467
      }
    ],
    "match": "solo",
    "type": "kill",
    "key": "林",
    "totalResults": 6,
    "totalPage": 1,
    "currentTime": "2025-07-21T02:18:04.404Z",
    "amsSerial": "AMS-DFM-0721101804-T1Ei6X-682187-402340",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:18:04.404Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "402340",
      "timestamp": "2025-07-21T02:18:04.404Z"
    }
  },
  "message": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» searchResults|[object]|true|none||none|
|»»» openid|string|true|none||唯一openid|
|»»» plat|string|true|none||平台|
|»»» name|string|true|none||昵称|
|»»» pic|string|true|none||图片（默认为NULL）|
|»»» teamId|string|true|none||组队赛所属队伍ID|
|»»» score|integer|true|none||仓库总价值|
|»»» killNum|integer|true|none||击杀数|
|»»» crackNum|string|true|none||破译数|
|»»» matchNum|integer|true|none||对局数|
|»»» rank|integer|true|none||排名|
|»» match|string|true|none||none|
|»» type|string|true|none||none|
|»» key|string|true|none||none|
|»» totalResults|integer|true|none||none|
|»» totalPage|integer|true|none||none|
|»» currentTime|string|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

## GET 改枪码列表

GET /df/tools/solution/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 10641,
        "name": "15W性价比M1014霰弹枪",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/ab2cb37f-cd94-42a2-903d-29087184bbea.png",
        "solutionCode": "M1014霰弹枪-烽火地带-6GQTRE4095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250717/a111aeb3-de58-43a9-8bb3-3186f752e4e0.png",
        "authorComment": "<p>腰射属性优秀，非常具有<span style=\"color: rgb(244, 207, 103);\">性价比！</span></p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10054,10037",
        "armsID": 18030000001,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000184,\"slotID\":\"6\"},{\"objectID\":13020000453,\"slotID\":\"2\"},{\"objectID\":13320000015,\"slotID\":\"19\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13050000188,\"slotID\":\"4\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000028,\"slotID\":\"8\"},{\"objectID\":13040000133,\"slotID\":\"3\"}]",
        "price": 163997,
        "sort": 172,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/p_ab2cb37f-cd94-42a2-903d-29087184bbea.png",
        "isLiked": false,
        "likeNum": 301,
        "applyNum": 54178,
        "armsDetail": {
          "id": 10772,
          "objectID": 18030000001,
          "objectName": "M1014霰弹枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "3.62",
          "primaryClass": "gun",
          "secondClass": "gunShotgun",
          "secondClassCN": "霰弹枪",
          "desc": "可靠且功能全面的12号口径半自动霰弹枪，每次发射8颗弹丸。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18030000001.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18030000001.png",
          "avgPrice": 33796
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10054,
            "tagName": "洲末品枪",
            "tagPic": "https://playerhub.df.qq.com/playerhub/cfde4982-da61-4beb-98b9-298555ecd251.png",
            "color": "#BDEDA0"
          },
          {
            "tagID": 10037,
            "tagName": "15w低配",
            "tagPic": "https://playerhub.df.qq.com/playerhub/48f0807f-4689-43ef-89eb-cd049d9b804d.png",
            "color": "#8492ED"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 14,
            "shootDistance": 12,
            "recoil": 28,
            "control": 53,
            "stable": 45,
            "hipShot": 52,
            "armorHarm": 16,
            "fireSpeed": 261
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 24,
            "control": -5,
            "stable": 0,
            "hipShot": 24,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000184
          },
          {
            "slotID": "2",
            "objectID": 13020000453
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "19",
            "objectID": 13320000015
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "4",
            "objectID": 13050000188
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000028
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3",
            "objectID": 13040000133
          },
          {
            "slotID": "29"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000184,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+5",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000453,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+12",
                    "batteryValue": 6,
                    "batteryColor": "green"
                  },
                  {
                    "value": "扩展弹仓容量",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "瞄准时弹丸集中度",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-8",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13050000188,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000028,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+12",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000133,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+5",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+12",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10640,
        "name": "28W独头弹M1014霰弹枪",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/eacc7d38-44d3-410f-8c67-9ccc555be3f5.png",
        "solutionCode": "M1014霰弹枪-烽火地带-6GQTR10095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250717/b051fee8-793c-4d02-aad1-e33dfd1f7421.png",
        "authorComment": "<p>适合<span style=\"color: rgb(244, 207, 103);\">贴脸猛攻，</span>管你几套统统不好使！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10054,10032",
        "armsID": 18030000001,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000190,\"slotID\":\"6\"},{\"objectID\":13020000453,\"slotID\":\"2\"},{\"objectID\":13320000015,\"slotID\":\"19\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13050000188,\"slotID\":\"4\"},{\"objectID\":13110000073,\"slotID\":\"11\"},{\"objectID\":13140000035,\"slotID\":\"8\"},{\"objectID\":13040000185,\"slotID\":\"3\"}]",
        "price": 268100,
        "sort": 171,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/p_eacc7d38-44d3-410f-8c67-9ccc555be3f5.png",
        "isLiked": false,
        "likeNum": 94,
        "applyNum": 45153,
        "armsDetail": {
          "id": 10772,
          "objectID": 18030000001,
          "objectName": "M1014霰弹枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "3.62",
          "primaryClass": "gun",
          "secondClass": "gunShotgun",
          "secondClassCN": "霰弹枪",
          "desc": "可靠且功能全面的12号口径半自动霰弹枪，每次发射8颗弹丸。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18030000001.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18030000001.png",
          "avgPrice": 33796
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10054,
            "tagName": "洲末品枪",
            "tagPic": "https://playerhub.df.qq.com/playerhub/cfde4982-da61-4beb-98b9-298555ecd251.png",
            "color": "#BDEDA0"
          },
          {
            "tagID": 10032,
            "tagName": "众生平等",
            "tagPic": "https://playerhub.df.qq.com/playerhub/61c98c82-5a9b-411d-94d9-d82159825f46.png",
            "color": "#E8989B"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 14,
            "shootDistance": 12,
            "recoil": 28,
            "control": 53,
            "stable": 45,
            "hipShot": 52,
            "armorHarm": 16,
            "fireSpeed": 261
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 19,
            "control": -14,
            "stable": 0,
            "hipShot": -12,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000190
          },
          {
            "slotID": "2",
            "objectID": 13020000453
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "19",
            "objectID": 13320000015
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "4",
            "objectID": 13050000188
          },
          {
            "slotID": "11",
            "objectID": 13110000073
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000035
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3",
            "objectID": 13040000185
          },
          {
            "slotID": "29"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000190,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "枪声抑制效果[弱]",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "瞄准时弹丸集中度",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000453,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+12",
                    "batteryValue": 6,
                    "batteryColor": "green"
                  },
                  {
                    "value": "扩展弹仓容量",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "瞄准时弹丸集中度",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-8",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13050000188,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000073,
            "list": [
              {
                "effectList": [
                  {
                    "value": "中等倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000035,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+8",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外水平后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000185,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-16",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10639,
        "name": "7W性价比M1014霰弹枪",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/6b6397da-61df-4136-85d2-0e6019f9e9f2.png",
        "solutionCode": "M1014霰弹枪-烽火地带-6GQTQL4095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250717/552f4d40-a67a-4b54-a542-18947a506224.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">腰射</span>专用，价格便宜适合<span style=\"color: rgb(244, 207, 103);\">猛攻！</span></p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10054,10026",
        "armsID": 18030000001,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000184,\"slotID\":\"6\"},{\"objectID\":13320000015,\"slotID\":\"19\"},{\"objectID\":13320000015,\"slotID\":\"20\"},{\"objectID\":13050000188,\"slotID\":\"4\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000028,\"slotID\":\"8\"},{\"objectID\":13040000106,\"slotID\":\"3\"}]",
        "price": 66970,
        "sort": 170,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250717/p_6b6397da-61df-4136-85d2-0e6019f9e9f2.png",
        "isLiked": false,
        "likeNum": 66,
        "applyNum": 36807,
        "armsDetail": {
          "id": 10772,
          "objectID": 18030000001,
          "objectName": "M1014霰弹枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "3.62",
          "primaryClass": "gun",
          "secondClass": "gunShotgun",
          "secondClassCN": "霰弹枪",
          "desc": "可靠且功能全面的12号口径半自动霰弹枪，每次发射8颗弹丸。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18030000001.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18030000001.png",
          "avgPrice": 33796
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10054,
            "tagName": "洲末品枪",
            "tagPic": "https://playerhub.df.qq.com/playerhub/cfde4982-da61-4beb-98b9-298555ecd251.png",
            "color": "#BDEDA0"
          },
          {
            "tagID": 10026,
            "tagName": "性价比高",
            "tagPic": "https://playerhub.df.qq.com/playerhub/ab24f311-ad56-4636-95e5-201d33afa15c.png",
            "color": "#F3DA94"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 14,
            "shootDistance": 12,
            "recoil": 28,
            "control": 53,
            "stable": 45,
            "hipShot": 52,
            "armorHarm": 16,
            "fireSpeed": 261
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 7,
            "control": -1,
            "stable": 0,
            "hipShot": 24,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000184
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "19",
            "objectID": 13320000015
          },
          {
            "slotID": "20",
            "objectID": 13320000015
          },
          {
            "slotID": "4",
            "objectID": 13050000188
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000028
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3",
            "objectID": 13040000106
          },
          {
            "slotID": "29"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000184,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+5",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13050000188,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000028,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+12",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000106,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外举镜瞄准时移速",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10638,
        "name": "67W满配SR-25",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/0e1e7b7f-7504-41ec-b36e-93ad3f3a0d0d.png",
        "solutionCode": "SR-25射手步枪-烽火地带-6GRBG6K04QRQQL6OOBF6G",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/ddffb3ec-e3b8-4eb3-880d-a53d7177a2c9.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">适合对枪，</span>所有属性基本拉满！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10010,10052",
        "armsID": 18050000007,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000168,\"slotID\":\"6\"},{\"objectID\":13020000397,\"slotID\":\"2\"},{\"objectID\":13320000010,\"slotID\":\"19\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13320000010,\"slotID\":\"32\"},{\"objectID\":13320000010,\"slotID\":\"34\"},{\"objectID\":13320000010,\"slotID\":\"35\"},{\"objectID\":13110000057,\"slotID\":\"11\"},{\"objectID\":13370000001,\"slotID\":\"45\"},{\"objectID\":13140000034,\"slotID\":\"8\"},{\"objectID\":13120000331,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000185,\"slotID\":\"3\"},{\"objectID\":13030000111,\"slotID\":\"1\"}]",
        "price": 631056,
        "sort": 169,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_0e1e7b7f-7504-41ec-b36e-93ad3f3a0d0d.png",
        "isLiked": false,
        "likeNum": 109,
        "applyNum": 19608,
        "armsDetail": {
          "id": 10762,
          "objectID": 18050000007,
          "objectName": "SR-25射手步枪",
          "length": 6,
          "width": 2,
          "grade": 0,
          "weight": "4.88",
          "primaryClass": "gun",
          "secondClass": "gunMP",
          "secondClassCN": "精确射手步枪",
          "desc": "采用AR系统的7.62×51mm半自动步枪，人机工效上乘，精准度不俗。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18050000007.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18050000007.png",
          "avgPrice": 139577
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10010,
            "tagName": "满改神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2c2d0a43-1ce9-429b-8122-aa34d485bb16.png",
            "color": "#56DEB1"
          },
          {
            "tagID": 10052,
            "tagName": "修脚神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/c497648a-1939-43e2-b5df-ac8f78f4a94f.png",
            "color": "#5768E5"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 50,
            "shootDistance": 90,
            "recoil": 56,
            "control": 56,
            "stable": 59,
            "hipShot": 40,
            "armorHarm": 55,
            "fireSpeed": 364
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 16,
            "recoil": 13,
            "control": -6,
            "stable": 5,
            "hipShot": -16,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000168
          },
          {
            "slotID": "2",
            "objectID": 13020000397
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19",
            "objectID": 13320000010
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "32",
            "objectID": 13320000010
          },
          {
            "slotID": "34",
            "objectID": 13320000010
          },
          {
            "slotID": "35",
            "objectID": 13320000010
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000057
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45",
            "objectID": 13370000001
          },
          {
            "slotID": "8",
            "objectID": 13140000034
          },
          {
            "slotID": "5",
            "objectID": 13120000331
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3",
            "objectID": 13040000185
          },
          {
            "slotID": "1",
            "objectID": 13030000111
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000397,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+18%",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+5",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000057,
            "list": [
              {
                "effectList": [
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "高倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "多段光学放大倍率切换",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "举镜瞄准时敌人可见反光[中]",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13370000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "大幅缩减瞄准镜反光可见性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000034,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000331,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-12",
                    "batteryValue": -6,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000185,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-16",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000111,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10637,
        "name": "41W高配SR-25",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/2e586689-7763-4912-a63b-5b3c0e660196.png",
        "solutionCode": "SR-25射手步枪-烽火地带-6GRAP2S0AV5BVPK0VDMCD",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/b164b5c9-48e8-4cdd-bb16-33ddc620b5c5.png",
        "authorComment": "<p>适合日常使用，各<span style=\"color: rgb(244, 207, 103);\">属性均衡，</span>无明显短板！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10033,10023",
        "armsID": 18050000007,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13320000010,\"slotID\":\"17\"},{\"objectID\":13320000010,\"slotID\":\"19\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13320000010,\"slotID\":\"32\"},{\"objectID\":13320000010,\"slotID\":\"34\"},{\"objectID\":13320000010,\"slotID\":\"35\"},{\"objectID\":13050000178,\"slotID\":\"4\"},{\"objectID\":13110000057,\"slotID\":\"11\"},{\"objectID\":13140000025,\"slotID\":\"8\"},{\"objectID\":13120000150,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000109,\"slotID\":\"3\"},{\"objectID\":13030000187,\"slotID\":\"1\"}]",
        "price": 383088,
        "sort": 168,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_2e586689-7763-4912-a63b-5b3c0e660196.png",
        "isLiked": false,
        "likeNum": 49,
        "applyNum": 18895,
        "armsDetail": {
          "id": 10762,
          "objectID": 18050000007,
          "objectName": "SR-25射手步枪",
          "length": 6,
          "width": 2,
          "grade": 0,
          "weight": "4.88",
          "primaryClass": "gun",
          "secondClass": "gunMP",
          "secondClassCN": "精确射手步枪",
          "desc": "采用AR系统的7.62×51mm半自动步枪，人机工效上乘，精准度不俗。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18050000007.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18050000007.png",
          "avgPrice": 139577
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10033,
            "tagName": "后座力稳",
            "tagPic": "https://playerhub.df.qq.com/playerhub/a7a66087-1b9e-4564-b9fc-45fe7603f4ef.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10023,
            "tagName": "架枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/16106b3d-4856-4b3f-be4c-c276fb7e9f3a.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 50,
            "shootDistance": 90,
            "recoil": 56,
            "control": 56,
            "stable": 59,
            "hipShot": 40,
            "armorHarm": 55,
            "fireSpeed": 364
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 12,
            "control": -6,
            "stable": 10,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17",
            "objectID": 13320000010
          },
          {
            "slotID": "19",
            "objectID": 13320000010
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "32",
            "objectID": 13320000010
          },
          {
            "slotID": "34",
            "objectID": 13320000010
          },
          {
            "slotID": "35",
            "objectID": 13320000010
          },
          {
            "slotID": "4",
            "objectID": 13050000178
          },
          {
            "slotID": "11",
            "objectID": 13110000057
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000025
          },
          {
            "slotID": "5",
            "objectID": 13120000150
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3",
            "objectID": 13040000109
          },
          {
            "slotID": "1",
            "objectID": 13030000187
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13050000178,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000057,
            "list": [
              {
                "effectList": [
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "高倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "多段光学放大倍率切换",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "举镜瞄准时敌人可见反光[中]",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000025,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000150,
            "list": [
              {
                "effectList": [
                  {
                    "value": "20 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-9",
                    "batteryValue": -5,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000109,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外举镜瞄准时移速",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000187,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10636,
        "name": "49W架枪M250",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/02050cc0-2a33-43b3-848f-c92ab48ee2ad.png",
        "solutionCode": "M250通用机枪-烽火地带-6GQTATS095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/fba2c5d1-7666-4c1f-b70a-7c8a2f126002.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">适合架枪，</span>后坐力控制拉满！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10023,10010",
        "armsID": 18040000003,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000168,\"slotID\":\"6\"},{\"objectID\":13020000524,\"slotID\":\"2\"},{\"objectID\":13320000010,\"slotID\":\"17\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000043,\"slotID\":\"50\"},{\"objectID\":13140000040,\"slotID\":\"8\"},{\"objectID\":13120000332,\"slotID\":\"5\"},{\"objectID\":13040000107,\"slotID\":\"3\"},{\"objectID\":13030000111,\"slotID\":\"1\"}]",
        "price": 498286,
        "sort": 167,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_02050cc0-2a33-43b3-848f-c92ab48ee2ad.png",
        "isLiked": false,
        "likeNum": 62,
        "applyNum": 23102,
        "armsDetail": {
          "id": 11022,
          "objectID": 18040000003,
          "objectName": "M250通用机枪",
          "length": 6,
          "width": 2,
          "grade": 0,
          "weight": "6.8",
          "primaryClass": "gun",
          "secondClass": "gunLMG",
          "secondClassCN": "轻机枪",
          "desc": "发射6.8×51mm全威力弹药的弹链供弹机枪，受弹盖经过特殊设计可保证开合后不影响瞄具归零。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18040000003.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18040000003.png",
          "avgPrice": 148104
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10023,
            "tagName": "架枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/16106b3d-4856-4b3f-be4c-c276fb7e9f3a.png",
            "color": "#85E0E6"
          },
          {
            "tagID": 10010,
            "tagName": "满改神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2c2d0a43-1ce9-429b-8122-aa34d485bb16.png",
            "color": "#56DEB1"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 55,
            "shootDistance": 40,
            "recoil": 45,
            "control": 38,
            "stable": 50,
            "hipShot": 55,
            "armorHarm": 53,
            "fireSpeed": 550
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 2,
            "recoil": 27,
            "control": 7,
            "stable": 0,
            "hipShot": -3,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000168
          },
          {
            "slotID": "2",
            "objectID": 13020000524
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "17",
            "objectID": 13320000010
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50",
            "objectID": 13110000043
          },
          {
            "slotID": "8",
            "objectID": 13140000040
          },
          {
            "slotID": "5",
            "objectID": 13120000332
          },
          {
            "slotID": "3",
            "objectID": 13040000107
          },
          {
            "slotID": "1",
            "objectID": 13030000111
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000524,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+5%",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+9",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-7",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000043,
            "list": [
              {
                "effectList": [
                  {
                    "value": "清晰镜内视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000040,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000332,
            "list": [
              {
                "effectList": [
                  {
                    "value": "75 载弹容量",
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+8",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000107,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000111,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10634,
        "name": "43W高配P90",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/3f8dbf84-bdb0-4f05-8e95-e0771497d1f5.png",
        "solutionCode": "P90冲锋枪-烽火地带-6GQTNFK095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/1ad90d20-8fc7-41bb-9a2a-df9067787721.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">后坐力</span>控制的较为稳定，同时其他属性也能够均衡！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10033,10030",
        "armsID": 18020000002,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000172,\"slotID\":\"6\"},{\"objectID\":13020000472,\"slotID\":\"2\"},{\"objectID\":13160000010,\"slotID\":\"14\"},{\"objectID\":13320000010,\"slotID\":\"19\"},{\"objectID\":13320000010,\"slotID\":\"20\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000043,\"slotID\":\"41\"},{\"objectID\":13210000012,\"slotID\":\"50\"},{\"objectID\":13140000026,\"slotID\":\"8\"},{\"objectID\":13240000002,\"slotID\":\"3\"},{\"objectID\":13290000001,\"slotID\":\"29\"}]",
        "price": 387693,
        "sort": 166,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_3f8dbf84-bdb0-4f05-8e95-e0771497d1f5.png",
        "isLiked": false,
        "likeNum": 141,
        "applyNum": 27400,
        "armsDetail": {
          "id": 10752,
          "objectID": 18020000002,
          "objectName": "P90冲锋枪",
          "length": 4,
          "width": 2,
          "grade": 0,
          "weight": "2.87",
          "primaryClass": "gun",
          "secondClass": "gunSMG",
          "secondClassCN": "冲锋枪",
          "desc": "使用5.7×28mm子弹的全自动无托式冲锋枪，采用了独特的顶置弹匣射击，可容纳更多弹药。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18020000002.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18020000002.png",
          "avgPrice": 88243
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10033,
            "tagName": "后座力稳",
            "tagPic": "https://playerhub.df.qq.com/playerhub/a7a66087-1b9e-4564-b9fc-45fe7603f4ef.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10030,
            "tagName": "压枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/db866a0a-af06-49de-8883-1664dbf62b0e.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 32,
            "shootDistance": 20,
            "recoil": 48,
            "control": 56,
            "stable": 45,
            "hipShot": 60,
            "armorHarm": 35,
            "fireSpeed": 898
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 12,
            "recoil": 23,
            "control": -5,
            "stable": 4,
            "hipShot": -12,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000172
          },
          {
            "slotID": "2",
            "objectID": 13020000472
          },
          {
            "slotID": "14",
            "objectID": 13160000010
          },
          {
            "slotID": "19",
            "objectID": 13320000010
          },
          {
            "slotID": "20",
            "objectID": 13320000010
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41",
            "objectID": 13110000043
          },
          {
            "slotID": "50",
            "objectID": 13210000012
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000026
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3",
            "objectID": 13240000002
          },
          {
            "slotID": "29",
            "objectID": 13290000001
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000172,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+30%",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+7",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "枪声抑制效果[弱]",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-10",
                    "batteryValue": -5,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000472,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+30%",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-7",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-12",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000010,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000043,
            "list": [
              {
                "effectList": [
                  {
                    "value": "清晰镜内视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000012,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000026,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13240000002,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13290000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10635,
        "name": "27W性价比M250",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/e68ff682-3e31-4d25-aa25-58c153498908.png",
        "solutionCode": "M250通用机枪-烽火地带-6GQT9G0095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/0d5e3120-e30b-4191-b5f0-ad20d84034e8.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">操控速度</span>相当稳定，非常不错！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10033,10024",
        "armsID": 18040000003,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000036,\"slotID\":\"8\"},{\"objectID\":13120000332,\"slotID\":\"5\"},{\"objectID\":13040000105,\"slotID\":\"3\"},{\"objectID\":13030000112,\"slotID\":\"1\"}]",
        "price": 263729,
        "sort": 165,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_e68ff682-3e31-4d25-aa25-58c153498908.png",
        "isLiked": false,
        "likeNum": 83,
        "applyNum": 37933,
        "armsDetail": {
          "id": 11022,
          "objectID": 18040000003,
          "objectName": "M250通用机枪",
          "length": 6,
          "width": 2,
          "grade": 0,
          "weight": "6.8",
          "primaryClass": "gun",
          "secondClass": "gunLMG",
          "secondClassCN": "轻机枪",
          "desc": "发射6.8×51mm全威力弹药的弹链供弹机枪，受弹盖经过特殊设计可保证开合后不影响瞄具归零。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18040000003.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18040000003.png",
          "avgPrice": 148104
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10033,
            "tagName": "后座力稳",
            "tagPic": "https://playerhub.df.qq.com/playerhub/a7a66087-1b9e-4564-b9fc-45fe7603f4ef.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10024,
            "tagName": "火力压制",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2a204c75-55f2-42be-a4aa-39e8e9d0d497.png",
            "color": "#56DEB1"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 55,
            "shootDistance": 40,
            "recoil": 45,
            "control": 38,
            "stable": 50,
            "hipShot": 55,
            "armorHarm": 53,
            "fireSpeed": 550
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 13,
            "control": 5,
            "stable": -1,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "8",
            "objectID": 13140000036
          },
          {
            "slotID": "5",
            "objectID": 13120000332
          },
          {
            "slotID": "3",
            "objectID": 13040000105
          },
          {
            "slotID": "1",
            "objectID": 13030000112
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000036,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外水平后坐力控制",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平枪身稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平视野稳定性",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000332,
            "list": [
              {
                "effectList": [
                  {
                    "value": "75 载弹容量",
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+8",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000105,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000112,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10633,
        "name": "17W性价比P90",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/e20bfd40-2965-4932-a688-504adbe76a2d.png",
        "solutionCode": "P90冲锋枪-烽火地带-6GQTMSS095HC4609S9G3Q",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/731c55a3-80e3-4c37-97e9-f2a255e88118.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">近战适用，</span>腰射能够有较好的后坐力控制！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10009,10030",
        "armsID": 18020000002,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000025,\"slotID\":\"8\"},{\"objectID\":13290000001,\"slotID\":\"29\"}]",
        "price": 155572,
        "sort": 164,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_e20bfd40-2965-4932-a688-504adbe76a2d.png",
        "isLiked": false,
        "likeNum": 101,
        "applyNum": 54957,
        "armsDetail": {
          "id": 10752,
          "objectID": 18020000002,
          "objectName": "P90冲锋枪",
          "length": 4,
          "width": 2,
          "grade": 0,
          "weight": "2.87",
          "primaryClass": "gun",
          "secondClass": "gunSMG",
          "secondClassCN": "冲锋枪",
          "desc": "使用5.7×28mm子弹的全自动无托式冲锋枪，采用了独特的顶置弹匣射击，可容纳更多弹药。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18020000002.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18020000002.png",
          "avgPrice": 88243
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10009,
            "tagName": "近战适用",
            "tagPic": "https://playerhub.df.qq.com/playerhub/781dc793-0d94-41c3-8b60-ab63b8aa74f6.png",
            "color": "#87E1E5"
          },
          {
            "tagID": 10030,
            "tagName": "压枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/db866a0a-af06-49de-8883-1664dbf62b0e.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 32,
            "shootDistance": 20,
            "recoil": 48,
            "control": 56,
            "stable": 45,
            "hipShot": 60,
            "armorHarm": 35,
            "fireSpeed": 898
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 7,
            "control": -2,
            "stable": 2,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000025
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3"
          },
          {
            "slotID": "29",
            "objectID": 13290000001
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000025,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13290000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10632,
        "name": "40W高配Vector",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/61e3fa9b-c309-492b-9356-182629bb2b54.png",
        "solutionCode": "Vector冲锋枪-烽火地带-6GQ1AIS0FIAS4OUQQ081T",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/21cd5b69-9dd9-4318-ae96-4d9c17c9d06a.png",
        "authorComment": "<p>适用近战，<span style=\"color: rgb(244, 207, 103);\">超高射速</span>配合<span style=\"color: rgb(244, 207, 103);\">低后坐力，</span>可以瞬间融化对手！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10013,10009",
        "armsID": 18020000003,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000208,\"slotID\":\"6\"},{\"objectID\":13020000419,\"slotID\":\"2\"},{\"objectID\":13160000005,\"slotID\":\"17\"},{\"objectID\":13320000015,\"slotID\":\"19\"},{\"objectID\":13320000015,\"slotID\":\"20\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000065,\"slotID\":\"50\"},{\"objectID\":13140000040,\"slotID\":\"8\"},{\"objectID\":13120000272,\"slotID\":\"5\"},{\"objectID\":13340000002,\"slotID\":\"44\"},{\"objectID\":13040000107,\"slotID\":\"3\"}]",
        "price": 394133,
        "sort": 163,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_61e3fa9b-c309-492b-9356-182629bb2b54.png",
        "isLiked": false,
        "likeNum": 52,
        "applyNum": 12958,
        "armsDetail": {
          "id": 10747,
          "objectID": 18020000003,
          "objectName": "Vector冲锋枪",
          "length": 4,
          "width": 2,
          "grade": 0,
          "weight": "2.9",
          "primaryClass": "gun",
          "secondClass": "gunSMG",
          "secondClassCN": "冲锋枪",
          "desc": ".45口径的全自动冲锋枪，超高射速可以在近距离表现出强大爆发力。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18020000003.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18020000003.png",
          "avgPrice": 124242
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10013,
            "tagName": "超高射速",
            "tagPic": "https://playerhub.df.qq.com/playerhub/3eb3f694-c421-4566-b802-4c385807eef0.png",
            "color": "#E8989B"
          },
          {
            "tagID": 10009,
            "tagName": "近战适用",
            "tagPic": "https://playerhub.df.qq.com/playerhub/781dc793-0d94-41c3-8b60-ab63b8aa74f6.png",
            "color": "#87E1E5"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 32,
            "shootDistance": 20,
            "recoil": 38,
            "control": 69,
            "stable": 42,
            "hipShot": 52,
            "armorHarm": 28,
            "fireSpeed": 1091
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 1,
            "recoil": 9,
            "control": -10,
            "stable": -3,
            "hipShot": 8,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000208
          },
          {
            "slotID": "2",
            "objectID": 13020000419
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17",
            "objectID": 13160000005
          },
          {
            "slotID": "19",
            "objectID": 13320000015
          },
          {
            "slotID": "20",
            "objectID": 13320000015
          },
          {
            "slotID": "32"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50",
            "objectID": 13110000065
          },
          {
            "slotID": "8",
            "objectID": 13140000040
          },
          {
            "slotID": "5",
            "objectID": 13120000272
          },
          {
            "slotID": "44",
            "objectID": 13340000002
          },
          {
            "slotID": "3",
            "objectID": 13040000107
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000208,
            "list": [
              {
                "effectList": [
                  {
                    "value": "枪声抑制效果[弱]",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000419,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+6%",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000005,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000040,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000272,
            "list": [
              {
                "effectList": [
                  {
                    "value": "40 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000002,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000107,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10631,
        "name": "29W性价比Vector",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/da64560a-0a9f-4657-9636-2496aa0c6f9a.png",
        "solutionCode": "Vector冲锋枪-烽火地带-6GOFEC8032SF8AON69MFA",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/716f33fa-daa7-4a4b-a443-a61cbe9f46d0.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">高腰射高射速，</span>兼顾操控速度，非常具有性价比！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10035,10013",
        "armsID": 18020000003,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13020000419,\"slotID\":\"2\"},{\"objectID\":13160000005,\"slotID\":\"17\"},{\"objectID\":13320000015,\"slotID\":\"19\"},{\"objectID\":13320000015,\"slotID\":\"20\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000035,\"slotID\":\"8\"},{\"objectID\":13120000272,\"slotID\":\"5\"},{\"objectID\":13340000002,\"slotID\":\"44\"},{\"objectID\":13040000173,\"slotID\":\"3\"}]",
        "price": 290409,
        "sort": 162,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_da64560a-0a9f-4657-9636-2496aa0c6f9a.png",
        "isLiked": false,
        "likeNum": 78,
        "applyNum": 19803,
        "armsDetail": {
          "id": 10747,
          "objectID": 18020000003,
          "objectName": "Vector冲锋枪",
          "length": 4,
          "width": 2,
          "grade": 0,
          "weight": "2.9",
          "primaryClass": "gun",
          "secondClass": "gunSMG",
          "secondClassCN": "冲锋枪",
          "desc": ".45口径的全自动冲锋枪，超高射速可以在近距离表现出强大爆发力。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18020000003.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18020000003.png",
          "avgPrice": 124242
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10035,
            "tagName": "腰射专用",
            "tagPic": "https://playerhub.df.qq.com/playerhub/40bc80b1-60ca-448a-a214-284d1a0cc847.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10013,
            "tagName": "超高射速",
            "tagPic": "https://playerhub.df.qq.com/playerhub/3eb3f694-c421-4566-b802-4c385807eef0.png",
            "color": "#E8989B"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 32,
            "shootDistance": 20,
            "recoil": 38,
            "control": 69,
            "stable": 42,
            "hipShot": 52,
            "armorHarm": 28,
            "fireSpeed": 1091
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 1,
            "recoil": -1,
            "control": 0,
            "stable": -8,
            "hipShot": 28,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2",
            "objectID": 13020000419
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17",
            "objectID": 13160000005
          },
          {
            "slotID": "19",
            "objectID": 13320000015
          },
          {
            "slotID": "20",
            "objectID": 13320000015
          },
          {
            "slotID": "32"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "8",
            "objectID": 13140000035
          },
          {
            "slotID": "5",
            "objectID": 13120000272
          },
          {
            "slotID": "44",
            "objectID": 13340000002
          },
          {
            "slotID": "3",
            "objectID": 13040000173
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000419,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+6%",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000005,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000035,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+8",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外水平后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-3",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000272,
            "list": [
              {
                "effectList": [
                  {
                    "value": "40 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000002,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000173,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+12",
                    "batteryValue": 6,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+12",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-10",
                    "batteryValue": -5,
                    "batteryColor": "red"
                  },
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10630,
        "name": "39W中配SCAR",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/79035c95-46ab-4c99-8bcd-f9b2295b8e75.png",
        "solutionCode": "SCAR-H战斗步枪-烽火地带-6FR8FBS04QRQQL6OOBF6G",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/50bf64d3-8929-4e4d-9b6a-e521c4808979.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">后坐力控制</span>极为优秀，同时兼顾了其他属性！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10021,10030",
        "armsID": 18010000021,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000209,\"slotID\":\"6\"},{\"objectID\":13020000391,\"slotID\":\"2\"},{\"objectID\":13320000001,\"slotID\":\"17\"},{\"objectID\":13320000001,\"slotID\":\"19\"},{\"objectID\":13160000005,\"slotID\":\"20\"},{\"objectID\":13110000082,\"slotID\":\"11\"},{\"objectID\":13140000040,\"slotID\":\"8\"},{\"objectID\":13120000250,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000107,\"slotID\":\"3\"},{\"objectID\":13030000187,\"slotID\":\"1\"}]",
        "price": 387348,
        "sort": 161,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_79035c95-46ab-4c99-8bcd-f9b2295b8e75.png",
        "isLiked": false,
        "likeNum": 129,
        "applyNum": 29379,
        "armsDetail": {
          "id": 10737,
          "objectID": 18010000021,
          "objectName": "SCAR-H战斗步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.29",
          "primaryClass": "gun",
          "secondClass": "gunRifle",
          "secondClassCN": "步枪",
          "desc": "SCAR-H是一款由比利时生产的7.62×51mm口径战斗步枪，具有高精度和可靠性，采用模块化设计，可根据需求进行改装，被广泛应用于军警部队。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000021.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000021.png",
          "avgPrice": 112279
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10021,
            "tagName": "无后座",
            "tagPic": "https://playerhub.df.qq.com/playerhub/f4dfdd8e-a9c1-4162-80d7-0375853e2135.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10030,
            "tagName": "压枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/db866a0a-af06-49de-8883-1664dbf62b0e.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 40,
            "shootDistance": 40,
            "recoil": 40,
            "control": 58,
            "stable": 55,
            "hipShot": 45,
            "armorHarm": 38,
            "fireSpeed": 585
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 2,
            "recoil": 14,
            "control": -17,
            "stable": 4,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000209
          },
          {
            "slotID": "2",
            "objectID": 13020000391
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17",
            "objectID": 13320000001
          },
          {
            "slotID": "19",
            "objectID": 13320000001
          },
          {
            "slotID": "20",
            "objectID": 13160000005
          },
          {
            "slotID": "32"
          },
          {
            "slotID": "34"
          },
          {
            "slotID": "35"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000082
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000040
          },
          {
            "slotID": "5",
            "objectID": 13120000250
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3",
            "objectID": 13040000107
          },
          {
            "slotID": "1",
            "objectID": 13030000187
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000209,
            "list": [
              {
                "effectList": [
                  {
                    "value": "据枪稳定性+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "枪口火光抑制",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000391,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+6%",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000005,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000082,
            "list": [
              {
                "condition": "主动锁定目标后",
                "effectList": [
                  {
                    "value": "自动目标水平移动提前量预测",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "自动弹道下坠点预测",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "高倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  },
                  {
                    "value": "举镜瞄准时敌人可见反光[中]",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000040,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000250,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000107,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000187,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10629,
        "name": "24W性价比SCAR",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/6a7a78ea-c467-489f-aeb4-0103835ee354.png",
        "solutionCode": "SCAR-H战斗步枪-烽火地带-6GQ1F2O0FIAS4OUQQ081T",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/d08c5956-2b79-46bd-a94b-8705d40f8cc8.png",
        "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">后坐力控制</span>稳定，各方面属性较为均衡！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10026,10023",
        "armsID": 18010000021,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13020000391,\"slotID\":\"2\"},{\"objectID\":13320000001,\"slotID\":\"17\"},{\"objectID\":13320000001,\"slotID\":\"19\"},{\"objectID\":13160000010,\"slotID\":\"20\"},{\"objectID\":13110000065,\"slotID\":\"11\"},{\"objectID\":13140000036,\"slotID\":\"8\"},{\"objectID\":13120000250,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000105,\"slotID\":\"3\"},{\"objectID\":13030000110,\"slotID\":\"1\"}]",
        "price": 240643,
        "sort": 160,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_6a7a78ea-c467-489f-aeb4-0103835ee354.png",
        "isLiked": false,
        "likeNum": 187,
        "applyNum": 29271,
        "armsDetail": {
          "id": 10737,
          "objectID": 18010000021,
          "objectName": "SCAR-H战斗步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.29",
          "primaryClass": "gun",
          "secondClass": "gunRifle",
          "secondClassCN": "步枪",
          "desc": "SCAR-H是一款由比利时生产的7.62×51mm口径战斗步枪，具有高精度和可靠性，采用模块化设计，可根据需求进行改装，被广泛应用于军警部队。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000021.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000021.png",
          "avgPrice": 112279
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10026,
            "tagName": "性价比高",
            "tagPic": "https://playerhub.df.qq.com/playerhub/ab24f311-ad56-4636-95e5-201d33afa15c.png",
            "color": "#F3DA94"
          },
          {
            "tagID": 10023,
            "tagName": "架枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/16106b3d-4856-4b3f-be4c-c276fb7e9f3a.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 40,
            "shootDistance": 40,
            "recoil": 40,
            "control": 58,
            "stable": 55,
            "hipShot": 45,
            "armorHarm": 38,
            "fireSpeed": 585
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 2,
            "recoil": 17,
            "control": -13,
            "stable": -1,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2",
            "objectID": 13020000391
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17",
            "objectID": 13320000001
          },
          {
            "slotID": "19",
            "objectID": 13320000001
          },
          {
            "slotID": "20",
            "objectID": 13160000010
          },
          {
            "slotID": "32"
          },
          {
            "slotID": "34"
          },
          {
            "slotID": "35"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000065
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000036
          },
          {
            "slotID": "5",
            "objectID": 13120000250
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3",
            "objectID": 13040000105
          },
          {
            "slotID": "1",
            "objectID": 13030000110
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000391,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+6%",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000036,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外水平后坐力控制",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平枪身稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平视野稳定性",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000250,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000105,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000110,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10628,
        "name": "35W高配G3",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/5fd48060-8588-440d-ac0e-f96d3bd01bf9.png",
        "solutionCode": "G3战斗步枪-烽火地带-6GS7P7O0DP3VS1UERAHQE",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250716/bf087364-ce67-4f7a-8808-ac785f85a34e.png",
        "authorComment": "<p>优秀的<span style=\"color: rgb(244, 207, 103);\">后坐力</span>和<span style=\"color: rgb(244, 207, 103);\">据枪稳定性</span>控制，你值得拥有！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10033,10030",
        "armsID": 18010000023,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000168,\"slotID\":\"6\"},{\"objectID\":13020000486,\"slotID\":\"2\"},{\"objectID\":13160000005,\"slotID\":\"20\"},{\"objectID\":13320000001,\"slotID\":\"34\"},{\"objectID\":13320000001,\"slotID\":\"35\"},{\"objectID\":13110000073,\"slotID\":\"11\"},{\"objectID\":13140000040,\"slotID\":\"8\"},{\"objectID\":13120000173,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000185,\"slotID\":\"3\"},{\"objectID\":13030000172,\"slotID\":\"1\"}]",
        "price": 361331,
        "sort": 159,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250716/p_5fd48060-8588-440d-ac0e-f96d3bd01bf9.png",
        "isLiked": false,
        "likeNum": 46,
        "applyNum": 10378,
        "armsDetail": {
          "id": 10739,
          "objectID": 18010000023,
          "objectName": "G3战斗步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.38",
          "primaryClass": "gun",
          "secondClass": "gunRifle",
          "secondClassCN": "步枪",
          "desc": "使用7.62×51mm子弹的经典、可靠全威力弹战斗步枪。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000023.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000023.png",
          "avgPrice": 47477
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10033,
            "tagName": "后座力稳",
            "tagPic": "https://playerhub.df.qq.com/playerhub/a7a66087-1b9e-4564-b9fc-45fe7603f4ef.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10030,
            "tagName": "压枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/db866a0a-af06-49de-8883-1664dbf62b0e.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 39,
            "shootDistance": 55,
            "recoil": 32,
            "control": 51,
            "stable": 62,
            "hipShot": 45,
            "armorHarm": 42,
            "fireSpeed": 533
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 17,
            "recoil": 19,
            "control": -5,
            "stable": 6,
            "hipShot": -28,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000168
          },
          {
            "slotID": "2",
            "objectID": 13020000486
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20",
            "objectID": 13160000005
          },
          {
            "slotID": "34",
            "objectID": 13320000001
          },
          {
            "slotID": "35",
            "objectID": 13320000001
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000073
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "8",
            "objectID": 13140000040
          },
          {
            "slotID": "5",
            "objectID": 13120000173
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3",
            "objectID": 13040000185
          },
          {
            "slotID": "1",
            "objectID": 13030000172
          },
          {
            "slotID": "43"
          },
          {
            "slotID": "30"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000486,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+30%",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-7",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-12",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000005,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000073,
            "list": [
              {
                "effectList": [
                  {
                    "value": "中等倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000040,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000173,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000185,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "后坐力控制-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-16",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000172,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10626,
        "name": "26W性价比PSG",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250711/57767e3f-8baa-4b9f-9264-c7285ed314f5.png",
        "solutionCode": "PSG-1射手步枪-烽火地带-6FEHRNG0AV5BVPK0VDMCD",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250711/9644cbba-4010-4bdf-80d5-946ab6205370.png",
        "authorComment": "<p>各方面属性都非常优秀，非常有<span style=\"color: rgb(244, 207, 103);\">性价比！</span></p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10054,10026",
        "armsID": 18050000031,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000158,\"slotID\":\"6\"},{\"objectID\":13110000057,\"slotID\":\"11\"},{\"objectID\":13140000025,\"slotID\":\"8\"},{\"objectID\":13120000173,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13040000129,\"slotID\":\"3\"},{\"objectID\":13030000172,\"slotID\":\"1\"}]",
        "price": 255544,
        "sort": 157,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250711/p_57767e3f-8baa-4b9f-9264-c7285ed314f5.png",
        "isLiked": false,
        "likeNum": 743,
        "applyNum": 164571,
        "armsDetail": {
          "id": 10810,
          "objectID": 18050000031,
          "objectName": "PSG-1射手步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "1.5",
          "primaryClass": "gun",
          "secondClass": "gunMP",
          "secondClassCN": "精确射手步枪",
          "desc": "使用7.62×51mm弹药的高精度的半自动狙击步枪,通用部分G3改装部件。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18050000031.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18050000031.png",
          "avgPrice": 107021
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10054,
            "tagName": "洲末品枪",
            "tagPic": "https://playerhub.df.qq.com/playerhub/cfde4982-da61-4beb-98b9-298555ecd251.png",
            "color": "#BDEDA0"
          },
          {
            "tagID": 10026,
            "tagName": "性价比高",
            "tagPic": "https://playerhub.df.qq.com/playerhub/ab24f311-ad56-4636-95e5-201d33afa15c.png",
            "color": "#F3DA94"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 50,
            "shootDistance": 90,
            "recoil": 60,
            "control": 49,
            "stable": 66,
            "hipShot": 34,
            "armorHarm": 55,
            "fireSpeed": 300
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 12,
            "control": -2,
            "stable": 3,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000158
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20"
          },
          {
            "slotID": "34"
          },
          {
            "slotID": "35"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000057
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "8",
            "objectID": 13140000025
          },
          {
            "slotID": "5",
            "objectID": 13120000173
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "49"
          },
          {
            "slotID": "3",
            "objectID": 13040000129
          },
          {
            "slotID": "1",
            "objectID": 13030000172
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000158,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000057,
            "list": [
              {
                "effectList": [
                  {
                    "value": "据枪稳定性+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "高倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "多段光学放大倍率切换",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "举镜瞄准时敌人可见反光[中]",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000025,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000173,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000129,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000172,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10593,
        "name": "46W满改AKM",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/d3c13087-56b9-4e95-b398-827016eb2375.png",
        "solutionCode": "AKM突击步枪-烽火地带-6GREKMK0AGKBQQUCGH41Q",
        "authorNickname": "尚阳Gamer",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250710/6f60ed55-6635-4623-a31d-31e8dd3b7433.png",
        "authorComment": "<p>完美解决AKM超大后坐力带来的枪身抖动，改装后能做到<span style=\"color: rgb(244, 207, 103);\">百米精准打击</span>！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10021,10010",
        "armsID": 18010000006,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000167,\"slotID\":\"6\"},{\"objectID\":13020000490,\"slotID\":\"2\"},{\"objectID\":13160000010,\"slotID\":\"14\"},{\"objectID\":13320000001,\"slotID\":\"17\"},{\"objectID\":13320000001,\"slotID\":\"34\"},{\"objectID\":13320000001,\"slotID\":\"35\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000043,\"slotID\":\"50\"},{\"objectID\":13140000040,\"slotID\":\"8\"},{\"objectID\":13120000239,\"slotID\":\"5\"},{\"objectID\":13340000011,\"slotID\":\"44\"},{\"objectID\":13040000113,\"slotID\":\"3\"},{\"objectID\":13030000167,\"slotID\":\"1\"},{\"objectID\":13330000001,\"slotID\":\"43\"},{\"objectID\":13430000001,\"slotID\":\"54\"}]",
        "price": 393265,
        "sort": 156,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/p_d3c13087-56b9-4e95-b398-827016eb2375.png",
        "isLiked": false,
        "likeNum": 493,
        "applyNum": 76271,
        "armsDetail": {
          "id": 10741,
          "objectID": 18010000006,
          "objectName": "AKM突击步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.3",
          "primaryClass": "gun",
          "secondClass": "gunRifle",
          "secondClassCN": "步枪",
          "desc": "7.62×39mm口径经典全自动突击步枪，拥有强大火力但需要足够的技巧。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000006.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000006.png",
          "avgPrice": 84426
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10021,
            "tagName": "无后座",
            "tagPic": "https://playerhub.df.qq.com/playerhub/f4dfdd8e-a9c1-4162-80d7-0375853e2135.png",
            "color": "#8492ED"
          },
          {
            "tagID": 10010,
            "tagName": "满改神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2c2d0a43-1ce9-429b-8122-aa34d485bb16.png",
            "color": "#56DEB1"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 40,
            "shootDistance": 40,
            "recoil": 39,
            "control": 54,
            "stable": 55,
            "hipShot": 53,
            "armorHarm": 42,
            "fireSpeed": 600
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 23,
            "control": -12,
            "stable": 10,
            "hipShot": 12,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000167
          },
          {
            "slotID": "2",
            "objectID": 13020000490
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14",
            "objectID": 13160000010
          },
          {
            "slotID": "17",
            "objectID": 13320000001
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20"
          },
          {
            "slotID": "34",
            "objectID": 13320000001
          },
          {
            "slotID": "35",
            "objectID": 13320000001
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50",
            "objectID": 13110000043
          },
          {
            "slotID": "8",
            "objectID": 13140000040
          },
          {
            "slotID": "5",
            "objectID": 13120000239
          },
          {
            "slotID": "44",
            "objectID": 13340000011
          },
          {
            "slotID": "3",
            "objectID": 13040000113
          },
          {
            "slotID": "28"
          },
          {
            "slotID": "1",
            "objectID": 13030000167
          },
          {
            "slotID": "43",
            "objectID": 13330000001
          },
          {
            "slotID": "54",
            "objectID": 13430000001
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000167,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外水平后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时水平视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000490,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+8",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+8",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000043,
            "list": [
              {
                "effectList": [
                  {
                    "value": "清晰镜内视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000040,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000239,
            "list": [
              {
                "effectList": [
                  {
                    "value": "40 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000011,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000113,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+8",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000167,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13330000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+7",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-5",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13430000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10594,
        "name": "59W腰射100 SR-3M",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/808a21fc-7773-4aaf-b158-cc3fe8f97054.png",
        "solutionCode": "SR-3M紧凑突击步枪-烽火地带-6GQIQIG01B4TIOG2NGDU8",
        "authorNickname": "松松很棒哟",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250710/e1cd9796-e913-4bed-b233-f947543fbff0.png",
        "authorComment": "<p>可打<span style=\"color: rgb(244, 207, 103);\">中距离，</span>再带一把裸狙中远近三距都可打！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10010,10035",
        "armsID": 18020000008,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000202,\"slotID\":\"6\"},{\"objectID\":13020000522,\"slotID\":\"2\"},{\"objectID\":13160000010,\"slotID\":\"19\"},{\"objectID\":13320000015,\"slotID\":\"20\"},{\"objectID\":13110000093,\"slotID\":\"11\"},{\"objectID\":13120000254,\"slotID\":\"5\"},{\"objectID\":13340000011,\"slotID\":\"44\"},{\"objectID\":13040000184,\"slotID\":\"3\"},{\"objectID\":13030000168,\"slotID\":\"1\"},{\"objectID\":13430000001,\"slotID\":\"54\"}]",
        "price": 478056,
        "sort": 156,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/p_808a21fc-7773-4aaf-b158-cc3fe8f97054.png",
        "isLiked": false,
        "likeNum": 300,
        "applyNum": 48233,
        "armsDetail": {
          "id": 10753,
          "objectID": 18020000008,
          "objectName": "SR-3M紧凑突击步枪",
          "length": 4,
          "width": 2,
          "grade": 0,
          "weight": "4.15",
          "primaryClass": "gun",
          "secondClass": "gunSMG",
          "secondClassCN": "冲锋枪",
          "desc": "SR-3M是一款俄罗斯制造的紧凑突击步枪。该枪使用9x39mm特种子弹，具有紧凑的尺寸和强大的火力，主要用于城市战和特种作战任务。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18020000008.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18020000008.png",
          "avgPrice": 116672
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10010,
            "tagName": "满改神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2c2d0a43-1ce9-429b-8122-aa34d485bb16.png",
            "color": "#56DEB1"
          },
          {
            "tagID": 10035,
            "tagName": "腰射专用",
            "tagPic": "https://playerhub.df.qq.com/playerhub/40bc80b1-60ca-448a-a214-284d1a0cc847.png",
            "color": "#8492ED"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 36,
            "shootDistance": 19,
            "recoil": 45,
            "control": 68,
            "stable": 43,
            "hipShot": 68,
            "armorHarm": 48,
            "fireSpeed": 747
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 1,
            "recoil": 10,
            "control": 5,
            "stable": -7,
            "hipShot": 24,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000202
          },
          {
            "slotID": "2",
            "objectID": 13020000522
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "19",
            "objectID": 13160000010
          },
          {
            "slotID": "20",
            "objectID": 13320000015
          },
          {
            "slotID": "11",
            "objectID": 13110000093
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "5",
            "objectID": 13120000254
          },
          {
            "slotID": "44",
            "objectID": 13340000011
          },
          {
            "slotID": "3",
            "objectID": 13040000184
          },
          {
            "slotID": "1",
            "objectID": 13030000168
          },
          {
            "slotID": "43"
          },
          {
            "slotID": "54",
            "objectID": 13430000001
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000202,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+12",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000522,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+3%",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+5",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000015,
            "list": [
              {
                "effectList": [
                  {
                    "value": "腰际射击精度+4",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000093,
            "list": [
              {
                "effectList": [
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "中等倍率光学放大视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000254,
            "list": [
              {
                "effectList": [
                  {
                    "value": "45 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000011,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000184,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+10",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度+8",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外举镜瞄准时移速",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-4",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13430000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10597,
        "name": "16W性价比PKM",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/e964fcfc-f285-4104-98ab-f1128033f07e.png",
        "solutionCode": "PKM通用机枪-烽火地带-6GRGCR007GMVM2B973KSJ",
        "authorNickname": "米尔Miru",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250710/5888209e-ac66-442d-85a6-6edc5b6d4844.png",
        "authorComment": "<p>数值稳定无需屏息，非常具有<span style=\"color: rgb(244, 207, 103);\">性价比！</span></p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10026,10030",
        "armsID": 18040000001,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000175,\"slotID\":\"6\"},{\"objectID\":13110000085,\"slotID\":\"11\"},{\"objectID\":13040000112,\"slotID\":\"3\"},{\"objectID\":13030000117,\"slotID\":\"1\"}]",
        "price": 146709,
        "sort": 156,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/p_e964fcfc-f285-4104-98ab-f1128033f07e.png",
        "isLiked": false,
        "likeNum": 505,
        "applyNum": 103973,
        "armsDetail": {
          "id": 10759,
          "objectID": 18040000001,
          "objectName": "PKM通用机枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "6.8",
          "primaryClass": "gun",
          "secondClass": "gunLMG",
          "secondClassCN": "轻机枪",
          "desc": "全自动机枪，采用7.62x54mmR全威力弹药，中等射速且具备强大压制力。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18040000001.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18040000001.png",
          "avgPrice": 82557
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10026,
            "tagName": "性价比高",
            "tagPic": "https://playerhub.df.qq.com/playerhub/ab24f311-ad56-4636-95e5-201d33afa15c.png",
            "color": "#F3DA94"
          },
          {
            "tagID": 10030,
            "tagName": "压枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/db866a0a-af06-49de-8883-1664dbf62b0e.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 45,
            "shootDistance": 40,
            "recoil": 36,
            "control": 42,
            "stable": 59,
            "hipShot": 45,
            "armorHarm": 42,
            "fireSpeed": 669
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 15,
            "control": 6,
            "stable": -8,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000175
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14"
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20"
          },
          {
            "slotID": "4"
          },
          {
            "slotID": "11",
            "objectID": 13110000085
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50"
          },
          {
            "slotID": "8"
          },
          {
            "slotID": "5"
          },
          {
            "slotID": "3",
            "objectID": 13040000112
          },
          {
            "slotID": "1",
            "objectID": 13030000117
          },
          {
            "slotID": "43"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000175,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+7",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  },
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000085,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000112,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+6",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13030000117,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10625,
        "name": "27W性价比M14",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/a5ca0eec-296e-4926-a806-97d86e505053.png",
        "solutionCode": "M14射手步枪-烽火地带-6GQ0VK00FIAS4OUQQ081T",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250710/421a4fcb-d48e-4271-a8b4-8d7de5a1a967.png",
        "authorComment": "<p>具备不错的<span style=\"color: rgb(244, 207, 103);\">据枪稳定性</span>和<span style=\"color: rgb(244, 207, 103);\">操控速度，</span>适合远程作战！</p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10041,10023",
        "armsID": 18050000005,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000168,\"slotID\":\"6\"},{\"objectID\":13160000010,\"slotID\":\"14\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000065,\"slotID\":\"50\"},{\"objectID\":13120000049,\"slotID\":\"5\"},{\"objectID\":13340000004,\"slotID\":\"44\"},{\"objectID\":13290000001,\"slotID\":\"29\"}]",
        "price": 283568,
        "sort": 156,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/p_a5ca0eec-296e-4926-a806-97d86e505053.png",
        "isLiked": false,
        "likeNum": 596,
        "applyNum": 118958,
        "armsDetail": {
          "id": 10740,
          "objectID": 18050000005,
          "objectName": "M14射手步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.2",
          "primaryClass": "gun",
          "secondClass": "gunMP",
          "secondClassCN": "精确射手步枪",
          "desc": "7.62×51mm口径的全威力步枪，切换至全自动射击模式有强大的火力，经典设计传承。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18050000005.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18050000005.png",
          "avgPrice": 114861
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10041,
            "tagName": "远程作战",
            "tagPic": "https://playerhub.df.qq.com/playerhub/1ad5388f-84a6-4e4c-bb81-3df2e790e861.png",
            "color": "#F3DA94"
          },
          {
            "tagID": 10023,
            "tagName": "架枪稳定",
            "tagPic": "https://playerhub.df.qq.com/playerhub/16106b3d-4856-4b3f-be4c-c276fb7e9f3a.png",
            "color": "#85E0E6"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 40,
            "shootDistance": 40,
            "recoil": 26,
            "control": 58,
            "stable": 55,
            "hipShot": 48,
            "armorHarm": 41,
            "fireSpeed": 727
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 0,
            "recoil": 10,
            "control": -11,
            "stable": 3,
            "hipShot": 0,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000168
          },
          {
            "slotID": "2"
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14",
            "objectID": 13160000010
          },
          {
            "slotID": "17"
          },
          {
            "slotID": "19"
          },
          {
            "slotID": "20"
          },
          {
            "slotID": "32"
          },
          {
            "slotID": "34"
          },
          {
            "slotID": "35"
          },
          {
            "slotID": "37"
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41"
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50",
            "objectID": 13110000065
          },
          {
            "slotID": "8"
          },
          {
            "slotID": "5",
            "objectID": 13120000049
          },
          {
            "slotID": "44",
            "objectID": 13340000004
          },
          {
            "slotID": "3"
          },
          {
            "slotID": "1"
          },
          {
            "slotID": "29",
            "objectID": 13290000001
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000065,
            "list": [
              {
                "effectList": [
                  {
                    "value": "红点镜内视野",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000049,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000004,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13290000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+3",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10624,
        "name": "71W满改M14",
        "solutionType": "gun",
        "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/1bf5bc5a-9067-4191-aa14-f9cb6635b052.png",
        "solutionCode": "M14射手步枪-烽火地带-6GPJH8404QRQQL6OOBF6G",
        "authorNickname": "洋洋",
        "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250710/70e7ed9d-b97e-4e1f-a9ca-4c176da4c2e9.png",
        "authorComment": "<p>各种属性都可兼顾，适用<span style=\"color: rgb(244, 207, 103);\">远程作战！</span></p>",
        "maps": "10001,10002,10003,10004,10013",
        "tags": "10041,10010",
        "armsID": 18050000005,
        "primary": 0,
        "primaryArmsID": 0,
        "secondary": 0,
        "secondaryArmsID": 0,
        "accessory": "[{\"objectID\":13130000168,\"slotID\":\"6\"},{\"objectID\":13020000388,\"slotID\":\"2\"},{\"objectID\":13160000010,\"slotID\":\"14\"},{\"objectID\":13320000001,\"slotID\":\"17\"},{\"objectID\":13320000001,\"slotID\":\"19\"},{\"objectID\":13160000007,\"slotID\":\"20\"},{\"objectID\":13320000001,\"slotID\":\"32\"},{\"objectID\":13050000183,\"slotID\":\"37\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13110000043,\"slotID\":\"41\"},{\"objectID\":13210000012,\"slotID\":\"50\"},{\"objectID\":13140000034,\"slotID\":\"8\"},{\"objectID\":13120000049,\"slotID\":\"5\"},{\"objectID\":13340000012,\"slotID\":\"44\"},{\"objectID\":13040000007,\"slotID\":\"3\"}]",
        "price": 765007,
        "sort": 155,
        "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250710/p_1bf5bc5a-9067-4191-aa14-f9cb6635b052.png",
        "isLiked": false,
        "likeNum": 338,
        "applyNum": 109869,
        "armsDetail": {
          "id": 10740,
          "objectID": 18050000005,
          "objectName": "M14射手步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.2",
          "primaryClass": "gun",
          "secondClass": "gunMP",
          "secondClassCN": "精确射手步枪",
          "desc": "7.62×51mm口径的全威力步枪，切换至全自动射击模式有强大的火力，经典设计传承。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18050000005.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18050000005.png",
          "avgPrice": 114861
        },
        "mapDetail": [
          {
            "mapID": 10001,
            "mapName": "长弓溪谷"
          },
          {
            "mapID": 10002,
            "mapName": "零号大坝"
          },
          {
            "mapID": 10003,
            "mapName": "航天基地"
          },
          {
            "mapID": 10004,
            "mapName": "巴克什"
          },
          {
            "mapID": 10013,
            "mapName": "潮汐监狱"
          }
        ],
        "tagDetail": [
          {
            "tagID": 10041,
            "tagName": "远程作战",
            "tagPic": "https://playerhub.df.qq.com/playerhub/1ad5388f-84a6-4e4c-bb81-3df2e790e861.png",
            "color": "#F3DA94"
          },
          {
            "tagID": 10010,
            "tagName": "满改神器",
            "tagPic": "https://playerhub.df.qq.com/playerhub/2c2d0a43-1ce9-429b-8122-aa34d485bb16.png",
            "color": "#56DEB1"
          }
        ],
        "propertiesDetail": {
          "origin": {
            "meatHarm": 40,
            "shootDistance": 40,
            "recoil": 26,
            "control": 58,
            "stable": 55,
            "hipShot": 48,
            "armorHarm": 41,
            "fireSpeed": 727
          },
          "change": {
            "meatHarm": 0,
            "shootDistance": 12,
            "recoil": 32,
            "control": -7,
            "stable": -2,
            "hipShot": -12,
            "armorHarm": 0,
            "fireSpeed": 0
          }
        },
        "accessoryDetail": [
          {
            "slotID": "6",
            "objectID": 13130000168
          },
          {
            "slotID": "2",
            "objectID": 13020000388
          },
          {
            "slotID": "10"
          },
          {
            "slotID": "14",
            "objectID": 13160000010
          },
          {
            "slotID": "17",
            "objectID": 13320000001
          },
          {
            "slotID": "19",
            "objectID": 13320000001
          },
          {
            "slotID": "20",
            "objectID": 13160000007
          },
          {
            "slotID": "32",
            "objectID": 13320000001
          },
          {
            "slotID": "34"
          },
          {
            "slotID": "35"
          },
          {
            "slotID": "37",
            "objectID": 13050000183
          },
          {
            "slotID": "11",
            "objectID": 13210000013
          },
          {
            "slotID": "40"
          },
          {
            "slotID": "31"
          },
          {
            "slotID": "41",
            "objectID": 13110000043
          },
          {
            "slotID": "45"
          },
          {
            "slotID": "50",
            "objectID": 13210000012
          },
          {
            "slotID": "8",
            "objectID": 13140000034
          },
          {
            "slotID": "5",
            "objectID": 13120000049
          },
          {
            "slotID": "44",
            "objectID": 13340000012
          },
          {
            "slotID": "3",
            "objectID": 13040000007
          },
          {
            "slotID": "1"
          },
          {
            "slotID": "29"
          }
        ],
        "accObjectEffect": [
          {
            "objectID": 13130000168,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "枪焰干扰瞄准视野",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13020000388,
            "list": [
              {
                "effectList": [
                  {
                    "value": "有效射程与枪口初速+30%",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "后坐力控制+9",
                    "batteryValue": 5,
                    "batteryColor": "green"
                  },
                  {
                    "value": "据枪稳定性+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-7",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "腰际射击精度-12",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000010,
            "list": [
              {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13160000007,
            "list": [
              {
                "effectList": [
                  {
                    "value": "战术手电照明(泛光）",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  },
                  {
                    "value": "主动爆闪致盲",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13320000001,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13050000183,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+4",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  },
                  {
                    "value": "拓展改装平台",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000013,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13110000043,
            "list": [
              {
                "effectList": [
                  {
                    "value": "清晰镜内视野",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-2",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13210000012,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+2",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "额外开火时枪身稳定性",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13140000034,
            "list": [
              {
                "effectList": [
                  {
                    "value": "额外垂直后坐力控制",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直枪身稳定性",
                    "batteryValue": 3,
                    "batteryColor": "green"
                  },
                  {
                    "value": "额外开火时垂直视野稳定性",
                    "batteryValue": 2,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-1",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13120000049,
            "list": [
              {
                "effectList": [
                  {
                    "value": "30 发容弹量",
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "操控速度-8",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "换弹时间惩罚",
                    "batteryValue": -1,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13340000012,
            "list": [
              {
                "effectList": [
                  {
                    "value": "操控速度+1",
                    "batteryValue": 1,
                    "batteryColor": "green"
                  }
                ]
              }
            ]
          },
          {
            "objectID": 13040000007,
            "list": [
              {
                "effectList": [
                  {
                    "value": "后坐力控制+7",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "操控速度+7",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              {
                "effectList": [
                  {
                    "value": "据枪稳定性-6",
                    "batteryValue": -3,
                    "batteryColor": "red"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "page": 1,
    "limit": 20,
    "totalCount": 268,
    "currentTime": "2025-07-21T02:18:38.749Z",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:18:38.749Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:18:38.749Z"
    }
  },
  "message": "succ"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» list|[object]|true|none||none|
|»»» id|integer|true|none||改枪码ID|
|»»» name|string|true|none||名称|
|»»» solutionType|string|true|none||gun|
|»»» previewPic|string|true|none||预览图|
|»»» solutionCode|string|true|none||改枪码|
|»»» authorNickname|string|true|none||作者名|
|»»» authorAvatar|string|true|none||作者头像|
|»»» authorComment|string|true|none||作者改枪描述|
|»»» maps|string|true|none||地图列表|
|»»» tags|string|true|none||改枪标签|
|»»» armsID|integer|true|none||枪械ID|
|»»» primary|integer|true|none||0|
|»»» primaryArmsID|integer|true|none||0|
|»»» secondary|integer|true|none||0|
|»»» secondaryArmsID|integer|true|none||0|
|»»» accessory|string|true|none||配件信息（物品ID+配件槽ID）|
|»»» price|integer|true|none||总价格|
|»»» sort|integer|true|none||排序ID|
|»»» prePreviewPic|string|true|none||预览图|
|»»» isLiked|boolean|true|none||是否点赞|
|»»» likeNum|integer|true|none||点赞数|
|»»» applyNum|integer|true|none||使用数（复制点击数）|
|»»» armsDetail|object|true|none||武器信息（此处对照物品那面的接口数据）|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»» mapDetail|[object]|true|none||地图信息（对照之前的地图ID）|
|»»»» mapID|integer|true|none||none|
|»»»» mapName|string|true|none||none|
|»»» tagDetail|[object]|true|none||标签信息|
|»»»» tagID|integer|true|none||none|
|»»»» tagName|string|true|none||none|
|»»»» tagPic|string|true|none||none|
|»»»» color|string|true|none||none|
|»»» propertiesDetail|object|true|none||属性详情|
|»»»» origin|object|true|none||none|
|»»»»» meatHarm|integer|true|none||none|
|»»»»» shootDistance|integer|true|none||none|
|»»»»» recoil|integer|true|none||none|
|»»»»» control|integer|true|none||none|
|»»»»» stable|integer|true|none||none|
|»»»»» hipShot|integer|true|none||none|
|»»»»» armorHarm|integer|true|none||none|
|»»»»» fireSpeed|integer|true|none||none|
|»»»» change|object|true|none||none|
|»»»»» meatHarm|integer|true|none||none|
|»»»»» shootDistance|integer|true|none||none|
|»»»»» recoil|integer|true|none||none|
|»»»»» control|integer|true|none||none|
|»»»»» stable|integer|true|none||none|
|»»»»» hipShot|integer|true|none||none|
|»»»»» armorHarm|integer|true|none||none|
|»»»»» fireSpeed|integer|true|none||none|
|»»» accessoryDetail|[object]|true|none||配件安装情况|
|»»»» slotID|string|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»» accObjectEffect|[object]|true|none||配件效果|
|»»»» objectID|integer|true|none||none|
|»»»» list|[object]|true|none||none|
|»»»»» effectList|[object]|true|none||none|
|»»»»»» value|string|true|none||none|
|»»»»»» batteryValue|integer|true|none||none|
|»»»»»» batteryColor|string|true|none||none|
|»»»»» condition|string|true|none||none|
|»» page|integer|true|none||页数|
|»» limit|integer|true|none||单页限制|
|»» totalCount|integer|true|none||总数|
|»» currentTime|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

## GET 改枪码详情

GET /df/tools/solution/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "detail": {
      "page": 1,
      "limit": 5,
      "totalCount": 1,
      "list": [
        {
          "id": 10576,
          "name": "43W腰射As Val监狱用",
          "solutionType": "gun",
          "previewPic": "https://playerhub.df.qq.com/playerhub/60004/250704/a8dc3b27-9dbc-497d-a3ca-ed52acd741a1.png",
          "solutionCode": "As Val突击步枪-烽火地带- 6GNJSFC 0FUH1E5MQ63E4O",
          "authorNickname": "萌少",
          "authorAvatar": "https://playerhub.df.qq.com/playerhub/60004/250704/1c34a991-078a-4742-9206-e2f2dbd7b20b.png",
          "authorComment": "<p><span style=\"color: rgb(244, 207, 103);\">主打近战腰射，</span>拉高腰射准度和操控速度，大幅降低跑射延迟！</p>",
          "maps": "10013,10001,10002,10003,10004",
          "tags": "10035,10009",
          "armsID": 18010000037,
          "primary": 0,
          "primaryArmsID": 0,
          "secondary": 0,
          "secondaryArmsID": 0,
          "accessory": "[{\"objectID\":13020000410,\"slotID\":\"2\"},{\"objectID\":13160000009,\"slotID\":\"14\"},{\"objectID\":13210000013,\"slotID\":\"11\"},{\"objectID\":13140000028,\"slotID\":\"8\"},{\"objectID\":13120000254,\"slotID\":\"5\"},{\"objectID\":13340000003,\"slotID\":\"44\"},{\"objectID\":13040000194,\"slotID\":\"3\"},{\"objectID\":13030000167,\"slotID\":\"1\"},{\"objectID\":13330000002,\"slotID\":\"43\"},{\"objectID\":13430000001,\"slotID\":\"54\"}]",
          "price": 401235,
          "sort": 141,
          "prePreviewPic": "https://playerhub.df.qq.com/playerhub/60004/250704/p_a8dc3b27-9dbc-497d-a3ca-ed52acd741a1.png",
          "isLiked": true,
          "likeNum": 1242,
          "applyNum": 111546,
          "armsDetail": {
            "id": 10745,
            "objectID": 18010000037,
            "objectName": "AS Val突击步枪",
            "length": 5,
            "width": 2,
            "grade": 0,
            "weight": "4.7",
            "primaryClass": "gun",
            "secondClass": "gunRifle",
            "secondClassCN": "步枪",
            "desc": "发射9×39mm特种弹药的俄式微声突击步枪，穿透性能强大。",
            "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000037.png",
            "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000037.png",
            "avgPrice": 122514
          },
          "mapDetail": [
            {
              "mapID": 10013,
              "mapName": "潮汐监狱"
            },
            {
              "mapID": 10001,
              "mapName": "长弓溪谷"
            },
            {
              "mapID": 10002,
              "mapName": "零号大坝"
            },
            {
              "mapID": 10003,
              "mapName": "航天基地"
            },
            {
              "mapID": 10004,
              "mapName": "巴克什"
            }
          ],
          "tagDetail": [
            {
              "tagID": 10035,
              "tagName": "腰射专用",
              "tagPic": "https://playerhub.df.qq.com/playerhub/40bc80b1-60ca-448a-a214-284d1a0cc847.png",
              "color": "#8492ED"
            },
            {
              "tagID": 10009,
              "tagName": "近战适用",
              "tagPic": "https://playerhub.df.qq.com/playerhub/781dc793-0d94-41c3-8b60-ab63b8aa74f6.png",
              "color": "#87E1E5"
            }
          ],
          "propertiesDetail": {
            "origin": {
              "meatHarm": 29,
              "shootDistance": 27,
              "recoil": 43,
              "control": 62,
              "stable": 51,
              "hipShot": 57,
              "armorHarm": 48,
              "fireSpeed": 972
            },
            "change": {
              "meatHarm": 0,
              "shootDistance": 6,
              "recoil": 3,
              "control": 6,
              "stable": -2,
              "hipShot": 23,
              "armorHarm": 0,
              "fireSpeed": 0
            }
          },
          "accessoryDetail": [
            {
              "slotID": "2",
              "objectID": 13020000410
            },
            {
              "slotID": "10"
            },
            {
              "slotID": "14",
              "objectID": 13160000009
            },
            {
              "slotID": "17"
            },
            {
              "slotID": "19"
            },
            {
              "slotID": "20"
            },
            {
              "slotID": "11",
              "objectID": 13210000013
            },
            {
              "slotID": "40"
            },
            {
              "slotID": "31"
            },
            {
              "slotID": "41"
            },
            {
              "slotID": "50"
            },
            {
              "slotID": "45"
            },
            {
              "slotID": "8",
              "objectID": 13140000028
            },
            {
              "slotID": "5",
              "objectID": 13120000254
            },
            {
              "slotID": "44",
              "objectID": 13340000003
            },
            {
              "slotID": "3",
              "objectID": 13040000194
            },
            {
              "slotID": "1",
              "objectID": 13030000167
            },
            {
              "slotID": "43",
              "objectID": 13330000002
            },
            {
              "slotID": "22"
            },
            {
              "slotID": "54",
              "objectID": 13430000001
            }
          ],
          "accObjectEffect": [
            {
              "objectID": 13020000410,
              "list": [
                {
                  "effectList": [
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13160000009,
              "list": [
                {
                  "condition": "开启激光镭指时",
                  "effectList": [
                    "[Object]",
                    "[Object]",
                    "[Object]"
                  ]
                },
                {
                  "condition": "关闭激光镭指时",
                  "effectList": [
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13210000013,
              "list": [
                {
                  "effectList": [
                    "[Object]"
                  ]
                },
                {
                  "effectList": [
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13140000028,
              "list": [
                {
                  "effectList": [
                    "[Object]"
                  ]
                },
                {
                  "effectList": [
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13120000254,
              "list": [
                {
                  "effectList": [
                    "[Object]"
                  ]
                },
                {
                  "effectList": [
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13340000003,
              "list": [
                {
                  "effectList": [
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13040000194,
              "list": [
                {
                  "effectList": [
                    "[Object]",
                    "[Object]"
                  ]
                },
                {
                  "effectList": [
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13030000167,
              "list": [
                {
                  "effectList": [
                    "[Object]",
                    "[Object]",
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13330000002,
              "list": [
                {
                  "effectList": [
                    "[Object]",
                    "[Object]",
                    "[Object]",
                    "[Object]"
                  ]
                }
              ]
            },
            {
              "objectID": 13430000001,
              "list": [
                {
                  "effectList": [
                    "[Object]"
                  ]
                }
              ]
            }
          ]
        }
      ],
      "relateMap": {
        "13020000410": {
          "id": 10582,
          "objectID": 13020000410,
          "objectName": "VSS海啸长枪管组合",
          "length": 2,
          "width": 1,
          "grade": 4,
          "weight": "0.35",
          "primaryClass": "acc",
          "secondClass": "accBarrel",
          "secondClassCN": "枪管",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13020000410.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13020000410.png",
          "avgPrice": 98996,
          "accDetail": {
            "shotDistancePercent": 24,
            "recoil": 12,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "有效射程与枪口初速+24%",
                  "batteryValue": 4,
                  "batteryColor": "green"
                },
                {
                  "value": "后坐力控制+12",
                  "batteryValue": 6,
                  "batteryColor": "green"
                }
              ]
            }
          }
        },
        "13030000167": {
          "id": 10485,
          "objectID": 13030000167,
          "objectName": "AK重塔握把",
          "length": 1,
          "width": 1,
          "grade": 4,
          "weight": "0.22",
          "primaryClass": "acc",
          "secondClass": "accBackGrip",
          "secondClassCN": "后握把",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13030000167.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13030000167.png",
          "avgPrice": 38669,
          "accDetail": {
            "recoil": 1,
            "hipShot": 4,
            "controlSpeed": 1,
            "controlStable": 1,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "后坐力控制+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "操控速度+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "据枪稳定性+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "腰际射击精度+4",
                  "batteryValue": 1,
                  "batteryColor": "green"
                }
              ]
            }
          }
        },
        "13040000194": {
          "id": 11003,
          "objectID": 13040000194,
          "objectName": "AS Val枪托尾盖",
          "length": 1,
          "width": 1,
          "grade": 3,
          "weight": "0.1",
          "primaryClass": "acc",
          "secondClass": "accStock",
          "secondClassCN": "枪托",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13040000194.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13040000194.png",
          "avgPrice": 7552,
          "accDetail": {
            "recoil": -10,
            "hipShot": 3,
            "controlSpeed": 12,
            "controlStable": -4,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "操控速度+12",
                  "batteryValue": 6,
                  "batteryColor": "green"
                },
                {
                  "value": "腰际射击精度+3",
                  "batteryValue": 3,
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "effectList": [
                {
                  "value": "后坐力控制-10",
                  "batteryValue": -5,
                  "batteryColor": "red"
                },
                {
                  "value": "据枪稳定性-4",
                  "batteryValue": -2,
                  "batteryColor": "red"
                }
              ]
            }
          }
        },
        "13120000254": {
          "id": 10424,
          "objectID": 13120000254,
          "objectName": "VSS 45发弹匣",
          "length": 1,
          "width": 2,
          "grade": 4,
          "weight": "0.21",
          "primaryClass": "acc",
          "secondClass": "accMagazine",
          "secondClassCN": "弹匣",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13120000254.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13120000254.png",
          "avgPrice": 57937,
          "accDetail": {
            "bombCapacity": 45,
            "controlSpeed": -8,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "45 发容弹量",
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "effectList": [
                {
                  "value": "操控速度-8",
                  "batteryValue": -4,
                  "batteryColor": "red"
                },
                {
                  "value": "换弹时间惩罚",
                  "batteryValue": -1,
                  "batteryColor": "red"
                }
              ]
            }
          }
        },
        "13140000028": {
          "id": 10014,
          "objectID": 13140000028,
          "objectName": "ZFSG战术握把",
          "length": 1,
          "width": 1,
          "grade": 2,
          "weight": "0.17",
          "primaryClass": "acc",
          "secondClass": "accForeGrip",
          "secondClassCN": "前握把",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13140000028.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13140000028.png",
          "avgPrice": 3393,
          "accDetail": {
            "recoil": -1,
            "hipShot": 12,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "腰际射击精度+12",
                  "batteryValue": 2,
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "effectList": [
                {
                  "value": "后坐力控制-1",
                  "batteryValue": -1,
                  "batteryColor": "red"
                }
              ]
            }
          }
        },
        "13160000009": {
          "id": 10442,
          "objectID": 13160000009,
          "objectName": "PERST-7蓝色激光镭指",
          "length": 1,
          "width": 1,
          "grade": 4,
          "weight": "0.2",
          "primaryClass": "acc",
          "secondClass": "accFunctional",
          "secondClassCN": "功能性配件",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13160000009.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13160000009.png",
          "avgPrice": 23048,
          "accDetail": {
            "controlSpeed": -4,
            "quickSeparate": 1,
            "advantage": {
              "condition": "开启激光镭指时",
              "effectList": [
                {
                  "value": "操控速度",
                  "batteryValue": 4,
                  "batteryColor": "green"
                },
                {
                  "value": "腰际射击精度",
                  "batteryValue": 4,
                  "batteryColor": "green"
                },
                {
                  "value": "允许战术据枪姿态",
                  "batteryValue": 4,
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "condition": "关闭激光镭指时",
              "effectList": [
                {
                  "value": "激光镭射开启时敌人可见",
                  "batteryValue": -4,
                  "batteryColor": "red"
                },
                {
                  "value": "操控速度",
                  "batteryValue": -2,
                  "batteryColor": "red"
                }
              ]
            }
          }
        },
        "13210000013": {
          "id": 10524,
          "objectID": 13210000013,
          "objectName": "多用途战术增高架",
          "length": 1,
          "width": 1,
          "grade": 3,
          "weight": "0.2",
          "primaryClass": "acc",
          "secondClass": "accScope",
          "secondClassCN": "瞄具",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13210000013.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13210000013.png",
          "avgPrice": 17731,
          "accDetail": {
            "controlSpeed": 2,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "操控速度+2",
                  "batteryValue": 1,
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "effectList": [
                {
                  "value": "额外开火时枪身稳定性",
                  "batteryValue": -1,
                  "batteryColor": "red"
                }
              ]
            }
          }
        },
        "13330000002": {
          "id": 10477,
          "objectID": 13330000002,
          "objectName": "平衡握把底座",
          "length": 1,
          "width": 1,
          "grade": 4,
          "weight": "0.1",
          "primaryClass": "acc",
          "secondClass": "accBackGrip",
          "secondClassCN": "后握把",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13330000002.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13330000002.png",
          "avgPrice": 24322,
          "accDetail": {
            "recoil": 1,
            "hipShot": 4,
            "controlSpeed": 1,
            "controlStable": 1,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "后坐力控制+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "操控速度+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "据枪稳定性+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                },
                {
                  "value": "腰际射击精度+4",
                  "batteryValue": 1,
                  "batteryColor": "green"
                }
              ]
            }
          }
        },
        "13340000003": {
          "id": 10456,
          "objectID": 13340000003,
          "objectName": "郊狼中间威力口径快拔套(黑)",
          "length": 1,
          "width": 1,
          "grade": 2,
          "weight": "0.2",
          "primaryClass": "acc",
          "secondClass": "accFunctional",
          "secondClassCN": "功能性配件",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13340000003.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13340000003.png",
          "avgPrice": 5384,
          "accDetail": {
            "controlSpeed": 1,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "操控速度+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                }
              ]
            }
          }
        },
        "13430000001": {
          "id": 11127,
          "objectID": 13430000001,
          "objectName": "泽宁特拉机柄帽",
          "length": 1,
          "width": 1,
          "grade": 2,
          "weight": "0.1",
          "primaryClass": "acc",
          "secondClass": "accFunctional",
          "secondClassCN": "功能性配件",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13430000001.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13430000001.png",
          "avgPrice": 1689,
          "accDetail": {
            "controlSpeed": 1,
            "quickSeparate": 1,
            "advantage": {
              "effectList": [
                {
                  "value": "操控速度+1",
                  "batteryValue": 1,
                  "batteryColor": "green"
                }
              ]
            }
          }
        },
        "18010000037": {
          "id": 10745,
          "objectID": 18010000037,
          "objectName": "AS Val突击步枪",
          "length": 5,
          "width": 2,
          "grade": 0,
          "weight": "4.7",
          "primaryClass": "gun",
          "secondClass": "gunRifle",
          "secondClassCN": "步枪",
          "desc": "发射9×39mm特种弹药的俄式微声突击步枪，穿透性能强大。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/18010000037.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_18010000037.png",
          "avgPrice": 122514,
          "gunDetail": {
            "meatHarm": 29,
            "shootDistance": 27,
            "recoil": 43,
            "control": 62,
            "stable": 51,
            "hipShot": 57,
            "armorHarm": 48,
            "fireSpeed": 972,
            "capacity": 15,
            "fireMode": "全自动,单发",
            "muzzleVelocity": 330,
            "soundDistance": 100,
            "caliber": "ammo9x39",
            "ammo": [
              {
                "objectID": 37140500001
              },
              {
                "objectID": 37140400001
              },
              {
                "objectID": 37140300001
              }
            ],
            "accessory": [
              {
                "slotID": "2"
              },
              {
                "slotID": "19"
              },
              {
                "slotID": "20"
              },
              {
                "slotID": "11"
              },
              {
                "slotID": "31"
              },
              {
                "slotID": "8"
              },
              {
                "slotID": "5"
              },
              {
                "slotID": "44"
              },
              {
                "slotID": "3"
              },
              {
                "slotID": "1"
              }
            ],
            "allAccessory": [
              {
                "slotID": "2"
              },
              {
                "slotID": "10"
              },
              {
                "slotID": "14"
              },
              {
                "slotID": "17"
              },
              {
                "slotID": "19"
              },
              {
                "slotID": "20"
              },
              {
                "slotID": "11"
              },
              {
                "slotID": "40"
              },
              {
                "slotID": "31"
              },
              {
                "slotID": "41"
              },
              {
                "slotID": "50"
              },
              {
                "slotID": "45"
              },
              {
                "slotID": "8"
              },
              {
                "slotID": "5"
              },
              {
                "slotID": "44"
              },
              {
                "slotID": "3"
              },
              {
                "slotID": "1"
              },
              {
                "slotID": "43"
              },
              {
                "slotID": "22"
              },
              {
                "slotID": "54"
              }
            ]
          }
        }
      }
    },
    "currentTime": "2025-07-21T02:19:09.031Z",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:19:09.031Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:19:09.031Z"
    }
  },
  "message": "succ"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» detail|object|true|none||数据|
|»»» page|integer|true|none||页数|
|»»» limit|integer|true|none||单页限制|
|»»» totalCount|integer|true|none||总数|
|»»» list|[object]|true|none||详情|
|»»»» id|integer|false|none||改枪码ID|
|»»»» name|string|false|none||名称|
|»»»» solutionType|string|false|none||gun|
|»»»» previewPic|string|false|none||图片|
|»»»» solutionCode|string|false|none||改枪码|
|»»»» authorNickname|string|false|none||作者昵称|
|»»»» authorAvatar|string|false|none||作者头像|
|»»»» authorComment|string|false|none||作者改枪描述|
|»»»» maps|string|false|none||地图列表|
|»»»» tags|string|false|none||改枪标签|
|»»»» armsID|integer|false|none||枪械ID|
|»»»» primary|integer|false|none||0|
|»»»» primaryArmsID|integer|false|none||0|
|»»»» secondary|integer|false|none||0|
|»»»» secondaryArmsID|integer|false|none||0|
|»»»» accessory|string|false|none||配件信息（物品ID+配件槽ID）|
|»»»» price|integer|false|none||总价格|
|»»»» sort|integer|false|none||排序|
|»»»» prePreviewPic|string|false|none||预览图|
|»»»» isLiked|boolean|false|none||是否点赞|
|»»»» likeNum|integer|false|none||点赞数|
|»»»» applyNum|integer|false|none||使用数（复制点击数）|
|»»»» armsDetail|object|false|none||武器信息|
|»»»»» id|integer|true|none||none|
|»»»»» objectID|integer|true|none||none|
|»»»»» objectName|string|true|none||none|
|»»»»» length|integer|true|none||none|
|»»»»» width|integer|true|none||none|
|»»»»» grade|integer|true|none||none|
|»»»»» weight|string|true|none||none|
|»»»»» primaryClass|string|true|none||none|
|»»»»» secondClass|string|true|none||none|
|»»»»» secondClassCN|string|true|none||none|
|»»»»» desc|string|true|none||none|
|»»»»» pic|string|true|none||none|
|»»»»» prePic|string|true|none||none|
|»»»»» avgPrice|integer|true|none||none|
|»»»» mapDetail|[object]|false|none||地图信息|
|»»»»» mapID|integer|true|none||none|
|»»»»» mapName|string|true|none||none|
|»»»» tagDetail|[object]|false|none||标签信息|
|»»»»» tagID|integer|true|none||none|
|»»»»» tagName|string|true|none||none|
|»»»»» tagPic|string|true|none||none|
|»»»»» color|string|true|none||none|
|»»»» propertiesDetail|object|false|none||属性详情|
|»»»»» origin|object|true|none||none|
|»»»»»» meatHarm|integer|true|none||none|
|»»»»»» shootDistance|integer|true|none||none|
|»»»»»» recoil|integer|true|none||none|
|»»»»»» control|integer|true|none||none|
|»»»»»» stable|integer|true|none||none|
|»»»»»» hipShot|integer|true|none||none|
|»»»»»» armorHarm|integer|true|none||none|
|»»»»»» fireSpeed|integer|true|none||none|
|»»»»» change|object|true|none||none|
|»»»»»» meatHarm|integer|true|none||none|
|»»»»»» shootDistance|integer|true|none||none|
|»»»»»» recoil|integer|true|none||none|
|»»»»»» control|integer|true|none||none|
|»»»»»» stable|integer|true|none||none|
|»»»»»» hipShot|integer|true|none||none|
|»»»»»» armorHarm|integer|true|none||none|
|»»»»»» fireSpeed|integer|true|none||none|
|»»»» accessoryDetail|[object]|false|none||配件安装情况|
|»»»»» slotID|string|true|none||none|
|»»»»» objectID|integer|true|none||none|
|»»»» accObjectEffect|[object]|false|none||配件效果|
|»»»»» objectID|integer|true|none||none|
|»»»»» list|[object]|true|none||none|
|»»»»»» effectList|[object]|true|none||none|
|»»»»»»» value|string|true|none||none|
|»»»»»»» batteryValue|integer|true|none||none|
|»»»»»»» batteryColor|string|true|none||none|
|»»»»»» condition|string|true|none||none|
|»» currentTime|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

# 业务/place

## GET 特勤处信息

GET /df/place/info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|place|query|string| 否 |place: 场所类型 (可选)|
|Authorization|header|string| 否 |none|

#### 详细说明

**place**: place: 场所类型 (可选)
storage: 仓库
control: 指挥中心
workbench: 工作台
tech: 技术中心
shoot: 靶场
training: 训练中心
pharmacy: 制药台
armory: 防具台

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "places": [
      {
        "placeId": 10022,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 1,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 0,
          "condition": "默认解锁"
        },
        "upgradeRequired": [],
        "unlockInfo": null
      },
      {
        "placeId": 10023,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 2,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 5000,
          "condition": "解锁等级4"
        },
        "upgradeRequired": [
          {
            "objectID": 15090010041,
            "count": 2
          },
          {
            "objectID": 15080050096,
            "count": 1
          },
          {
            "objectID": 15020050008,
            "count": 3
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+18",
              "仓库扩容箱的槽位+1"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10024,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 3,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 10000,
          "condition": "解锁等级9"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050037,
            "count": 2
          },
          {
            "objectID": 15020010016,
            "count": 1
          },
          {
            "objectID": 15040010022,
            "count": 2
          },
          {
            "objectID": 15080050075,
            "count": 3
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+2"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10025,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 4,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 20000,
          "condition": "解锁等级14"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050037,
            "count": 2
          },
          {
            "objectID": 15080050045,
            "count": 2
          },
          {
            "objectID": 15060080005,
            "count": 4
          },
          {
            "objectID": 15020050008,
            "count": 6
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+45",
              "仓库扩容箱的槽位+3"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10026,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 5,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 40000,
          "condition": "解锁等级20"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050004,
            "count": 1
          },
          {
            "objectID": 15060040003,
            "count": 2
          },
          {
            "objectID": 15080050045,
            "count": 3
          },
          {
            "objectID": 15030040005,
            "count": 6
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+4"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10027,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 6,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 80000,
          "condition": "解锁等级28;2级战术部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050083,
            "count": 1
          },
          {
            "objectID": 15080050090,
            "count": 4
          },
          {
            "objectID": 15030040007,
            "count": 6
          },
          {
            "objectID": 15030040006,
            "count": 10
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+72",
              "仓库扩容箱的槽位+5"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10028,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 7,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 160000,
          "condition": "解锁等级36"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050062,
            "count": 1
          },
          {
            "objectID": 15080050033,
            "count": 3
          },
          {
            "objectID": 15080050037,
            "count": 10
          },
          {
            "objectID": 15030040005,
            "count": 10
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+6"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10029,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 8,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 320000,
          "condition": "解锁等级42;技术中心3级；3级战术部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15020010033,
            "count": 1
          },
          {
            "objectID": 15010050001,
            "count": 2
          },
          {
            "objectID": 15080050010,
            "count": 3
          },
          {
            "objectID": 15080050089,
            "count": 5
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+108",
              "仓库扩容箱的槽位+7"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10030,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 9,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 640000,
          "condition": "解锁等级52"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050097,
            "count": 1
          },
          {
            "objectID": 15020010031,
            "count": 1
          },
          {
            "objectID": 15030050012,
            "count": 1
          },
          {
            "objectID": 15080050067,
            "count": 1
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+8"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10031,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 10,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 1280000,
          "condition": "解锁等级60;4级战斗部门声望;4级医疗部门声望;4级后勤部门声望;4级战术部门声望;4级研发部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050006,
            "count": 1
          },
          {
            "objectID": 15060080015,
            "count": 1
          },
          {
            "objectID": 15060040003,
            "count": 1
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+144",
              "仓库扩容箱的槽位+9"
            ]
          },
          "props": []
        }
      }
    ],
    "relateMap": {
      "15010050001": {
        "id": 10165,
        "objectID": 15010050001,
        "objectName": "黄金瞪羚",
        "length": 2,
        "width": 2,
        "grade": 6,
        "weight": "2.9",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "黄金瞪羚，约300年历史，被阿萨拉王子用于追求潜在伴侣。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15010050001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15010050001.png",
        "avgPrice": 431607,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15020010016": {
        "id": 10109,
        "objectID": 15020010016,
        "objectName": "一桶油漆",
        "length": 2,
        "width": 2,
        "grade": 3,
        "weight": "4.5199999999999996",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，覆盖在物体表面起保护、装饰、标志和其他特殊用途的化学混合物涂料。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010016.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010016.png",
        "avgPrice": 21231,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15020010031": {
        "id": 10134,
        "objectID": 15020010031,
        "objectName": "强化碳纤维板",
        "length": 3,
        "width": 3,
        "grade": 6,
        "weight": "3.73",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，一种轻量、高强度、高刚性的先进复合材料，广泛应用于航空航天、建筑等领域。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010031.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010031.png",
        "avgPrice": 2269505,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15020010033": {
        "id": 10141,
        "objectID": 15020010033,
        "objectName": "火箭燃料",
        "length": 3,
        "width": 4,
        "grade": 6,
        "weight": "21.72",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "尚未开封的20升高性能航空燃料，专为火箭发动机所设计，提供澎湃动力。\n【用途】解锁仓库7级必要材料。\n【来源】仅限航天城产出，禁止交易。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010033.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010033.png",
        "avgPrice": 0,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "航天基地-核心区,航天基地-工业区"
        }
      },
      "15020050008": {
        "id": 10862,
        "objectID": 15020050008,
        "objectName": "继电器",
        "length": 1,
        "width": 1,
        "grade": 3,
        "weight": "0.36",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，其特点为寿命长、半永久性、微小电流驱动信号等。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020050008.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020050008.png",
        "avgPrice": 10026,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040005": {
        "id": 10875,
        "objectID": 15030040005,
        "objectName": "固态硬盘",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "0.04",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，SSD，用固态电子存储芯片阵列制成的硬盘。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040005.png",
        "avgPrice": 33572,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040006": {
        "id": 10876,
        "objectID": 15030040006,
        "objectName": "内存条",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "7.0000000000000007E-2",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，是与CPU直接交换数据的内部存储器。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040006.png",
        "avgPrice": 26121,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040007": {
        "id": 10877,
        "objectID": 15030040007,
        "objectName": "ASOS电脑主板",
        "length": 2,
        "width": 2,
        "grade": 4,
        "weight": "2.31",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，是计算机最基本同时也是最重要的部件之一。主板一般为矩形电路板，上面安装有组成计算机的主要电路系统。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040007.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040007.png",
        "avgPrice": 47197,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030050012": {
        "id": 10892,
        "objectID": 15030050012,
        "objectName": "高速磁盘阵列",
        "length": 4,
        "width": 3,
        "grade": 6,
        "weight": "4.71",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，存储加密数据，可为军用，带自毁功能。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030050012.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030050012.png",
        "avgPrice": 1625832,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15040010022": {
        "id": 10113,
        "objectID": 15040010022,
        "objectName": "转换插座",
        "length": 1,
        "width": 1,
        "grade": 3,
        "weight": "0.12",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "杂物，各种插口的转换插座，包括变压功能和USB/type c 输出。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15040010022.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15040010022.png",
        "avgPrice": 10135,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15060040003": {
        "id": 10226,
        "objectID": 15060040003,
        "objectName": "血氧仪",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "1.46",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "医疗道具，用于无创测量血氧饱和度，操作简单便捷。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060040003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060040003.png",
        "avgPrice": 62085,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15060080005": {
        "id": 10221,
        "objectID": 15060080005,
        "objectName": "生津柠檬茶",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "0.27",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "将柠檬在热水中稍微浸泡，然后切片泡水添加蜂蜜、茶叶冲制而成的高级饮料。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060080005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060080005.png",
        "avgPrice": 14893,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15060080015": {
        "id": 10212,
        "objectID": 15060080015,
        "objectName": "奥莉薇娅香槟",
        "length": 1,
        "width": 2,
        "grade": 6,
        "weight": "0.8",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "是一种产自法国香槟地区的气泡酒，以其独特的口感和气泡而闻名，常被用于庆祝重要场合和佳节。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060080015.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060080015.png",
        "avgPrice": 336841,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050004": {
        "id": 10151,
        "objectID": 15080050004,
        "objectName": "功绩勋章",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "0.11",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "华贵的功绩勋章，似乎是用于表彰某位曾为阿萨拉建筑事业耗费心血，做出过杰出贡献的人士。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050004.png",
        "avgPrice": 81380,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050006": {
        "id": 10159,
        "objectID": 15080050006,
        "objectName": "非洲之心",
        "length": 1,
        "width": 1,
        "grade": 6,
        "weight": "0.62",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "世界上最大的钻石，璀璨夺目，象征永恒的爱。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050006.png",
        "avgPrice": 13088362,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050010": {
        "id": 10167,
        "objectID": 15080050010,
        "objectName": "万足金条",
        "length": 1,
        "width": 2,
        "grade": 6,
        "weight": "4.25",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "一整根金条，可以拿去卖钱。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050010.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050010.png",
        "avgPrice": 329785,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050033": {
        "id": 10904,
        "objectID": 15080050033,
        "objectName": "军用卫星通讯仪",
        "length": 2,
        "width": 2,
        "grade": 5,
        "weight": "1.99",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这台军用卫星通讯仪，具有高速传输和实时通讯功能，能在全球范围内与军事基地实现无缝联系。其高度加密和抗干扰设计，确保通讯内容的安全和机密性。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050033.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050033.png",
        "avgPrice": 236217,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050037": {
        "id": 10908,
        "objectID": 15080050037,
        "objectName": "广角镜头",
        "length": 2,
        "width": 1,
        "grade": 4,
        "weight": "0.63",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这款广角镜头拥有宽广的视角范围，适合拍摄大场景照片。紧凑轻便的设计，便于携带，是摄影爱好者记录广阔天地的得力助手。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050037.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050037.png",
        "avgPrice": 52454,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050045": {
        "id": 10255,
        "objectID": 15080050045,
        "objectName": "加密路由器",
        "length": 2,
        "width": 2,
        "grade": 4,
        "weight": "2.17",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这台加密路由器内置多重加密算法保护数据。其储存的情报信息，仅授权人员可解密查阅。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050045.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050045.png",
        "avgPrice": 44405,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050062": {
        "id": 10912,
        "objectID": 15080050062,
        "objectName": "阵列服务器",
        "length": 4,
        "width": 3,
        "grade": 5,
        "weight": "10",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "阵列服务器通过集成多硬盘，并采用了RAID技术，进而获得了更强的数据存储及处理能力。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050062.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050062.png",
        "avgPrice": 1029946,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050067": {
        "id": 10915,
        "objectID": 15080050067,
        "objectName": "强力吸尘器",
        "length": 2,
        "width": 3,
        "grade": 6,
        "weight": "4.8",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "哈夫克家居产品，采用智能光学探测系统，快速扫清顽垢，居家首选。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050067.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050067.png",
        "avgPrice": 1507766,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050075": {
        "id": 10922,
        "objectID": 15080050075,
        "objectName": "木雕烟斗",
        "length": 2,
        "width": 1,
        "grade": 3,
        "weight": "0.2",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "由阿萨拉匠人选用优质木材，手工雕刻，实用轻便，纹理美观。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050075.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050075.png",
        "avgPrice": 50221,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050083": {
        "id": 10930,
        "objectID": 15080050083,
        "objectName": "座钟",
        "length": 2,
        "width": 2,
        "grade": 5,
        "weight": "3",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "实木材质的报时座钟，表面有一层使用碎矿石制成的岩绘具所涂制的漆面，尽显禅意。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050083.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050083.png",
        "avgPrice": 203674,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050089": {
        "id": 10935,
        "objectID": 15080050089,
        "objectName": "军用弹道计算机",
        "length": 2,
        "width": 1,
        "grade": 5,
        "weight": "2.5",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "高精度计算设备，用于预测和调整制导兵器弹道，确保我们每一次远程打击都能痛击敌人的要冲。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050089.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050089.png",
        "avgPrice": 91174,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050090": {
        "id": 10936,
        "objectID": 15080050090,
        "objectName": "高速固态硬盘",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "0.3",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，采用闪存技术，拥有极快的读写速度，耐用且安静。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050090.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050090.png",
        "avgPrice": 74709,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050096": {
        "id": 10941,
        "objectID": 15080050096,
        "objectName": "军情录音",
        "length": 1,
        "width": 3,
        "grade": 3,
        "weight": "1",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "存有某次作战中指挥系统绝密通信录音的通信终端。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050096.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050096.png",
        "avgPrice": 28267,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050097": {
        "id": 10942,
        "objectID": 15080050097,
        "objectName": "复苏呼吸机",
        "length": 3,
        "width": 3,
        "grade": 6,
        "weight": "5",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "医疗道具，专为体征已经极度衰弱，自主呼吸已经消失的病患设计的辅助呼吸设备，生命的最终防线。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050097.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050097.png",
        "avgPrice": 9209869,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15090010041": {
        "id": 10231,
        "objectID": 15090010041,
        "objectName": "医疗无人机",
        "length": 2,
        "width": 2,
        "grade": 3,
        "weight": "1.0900000000000001",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "利用无线电遥控设备和自备的程序控制装置操纵的不载人飞机，用于运载医疗物品。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15090010041.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15090010041.png",
        "avgPrice": 33420,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      }
    },
    "requestParams": {
      "placeType": "storage",
      "hasParam": true
    },
    "amsSerial": "AMS-DFM-0721102059-p09e7d-661959-316969",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:20:59.503Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:20:59.503Z"
    }
  },
  "message": "获取特勤处信息成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 场所制造利润

GET /df/place/profitHistory

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|place|query|array[string]| 否 |place: 场所类型 (可选)|
|Authorization|header|string| 否 |none|

#### 详细说明

**place**: place: 场所类型 (可选)
storage: 仓库
control: 指挥中心
workbench: 工作台
tech: 技术中心
shoot: 靶场
training: 训练中心
pharmacy: 制药台
armory: 防具台

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "places": [
      {
        "placeId": 10022,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 1,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 0,
          "condition": "默认解锁"
        },
        "upgradeRequired": [],
        "unlockInfo": null
      },
      {
        "placeId": 10023,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 2,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 5000,
          "condition": "解锁等级4"
        },
        "upgradeRequired": [
          {
            "objectID": 15090010041,
            "count": 2
          },
          {
            "objectID": 15080050096,
            "count": 1
          },
          {
            "objectID": 15020050008,
            "count": 3
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+18",
              "仓库扩容箱的槽位+1"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10024,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 3,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 10000,
          "condition": "解锁等级9"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050037,
            "count": 2
          },
          {
            "objectID": 15020010016,
            "count": 1
          },
          {
            "objectID": 15040010022,
            "count": 2
          },
          {
            "objectID": 15080050075,
            "count": 3
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+2"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10025,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 4,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 20000,
          "condition": "解锁等级14"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050037,
            "count": 2
          },
          {
            "objectID": 15080050045,
            "count": 2
          },
          {
            "objectID": 15060080005,
            "count": 4
          },
          {
            "objectID": 15020050008,
            "count": 6
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+45",
              "仓库扩容箱的槽位+3"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10026,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 5,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 40000,
          "condition": "解锁等级20"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050004,
            "count": 1
          },
          {
            "objectID": 15060040003,
            "count": 2
          },
          {
            "objectID": 15080050045,
            "count": 3
          },
          {
            "objectID": 15030040005,
            "count": 6
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+4"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10027,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 6,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 80000,
          "condition": "解锁等级28;2级战术部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050083,
            "count": 1
          },
          {
            "objectID": 15080050090,
            "count": 4
          },
          {
            "objectID": 15030040007,
            "count": 6
          },
          {
            "objectID": 15030040006,
            "count": 10
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+72",
              "仓库扩容箱的槽位+5"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10028,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 7,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 160000,
          "condition": "解锁等级36"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050062,
            "count": 1
          },
          {
            "objectID": 15080050033,
            "count": 3
          },
          {
            "objectID": 15080050037,
            "count": 10
          },
          {
            "objectID": 15030040005,
            "count": 10
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+6"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10029,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 8,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 320000,
          "condition": "解锁等级42;技术中心3级；3级战术部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15020010033,
            "count": 1
          },
          {
            "objectID": 15010050001,
            "count": 2
          },
          {
            "objectID": 15080050010,
            "count": 3
          },
          {
            "objectID": 15080050089,
            "count": 5
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+108",
              "仓库扩容箱的槽位+7"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10030,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 9,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 640000,
          "condition": "解锁等级52"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050097,
            "count": 1
          },
          {
            "objectID": 15020010031,
            "count": 1
          },
          {
            "objectID": 15030050012,
            "count": 1
          },
          {
            "objectID": 15080050067,
            "count": 1
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库扩容箱的槽位+8"
            ]
          },
          "props": []
        }
      },
      {
        "placeId": 10031,
        "placeType": "storage",
        "placeName": "仓库",
        "level": 10,
        "detail": "",
        "upgradeInfo": {
          "hafCount": 1280000,
          "condition": "解锁等级60;4级战斗部门声望;4级医疗部门声望;4级后勤部门声望;4级战术部门声望;4级研发部门声望"
        },
        "upgradeRequired": [
          {
            "objectID": 15080050006,
            "count": 1
          },
          {
            "objectID": 15060080015,
            "count": 1
          },
          {
            "objectID": 15060040003,
            "count": 1
          }
        ],
        "unlockInfo": {
          "properties": {
            "list": [
              "仓库空间+144",
              "仓库扩容箱的槽位+9"
            ]
          },
          "props": []
        }
      }
    ],
    "relateMap": {
      "15010050001": {
        "id": 10165,
        "objectID": 15010050001,
        "objectName": "黄金瞪羚",
        "length": 2,
        "width": 2,
        "grade": 6,
        "weight": "2.9",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "黄金瞪羚，约300年历史，被阿萨拉王子用于追求潜在伴侣。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15010050001.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15010050001.png",
        "avgPrice": 431607,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15020010016": {
        "id": 10109,
        "objectID": 15020010016,
        "objectName": "一桶油漆",
        "length": 2,
        "width": 2,
        "grade": 3,
        "weight": "4.5199999999999996",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，覆盖在物体表面起保护、装饰、标志和其他特殊用途的化学混合物涂料。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010016.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010016.png",
        "avgPrice": 21231,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15020010031": {
        "id": 10134,
        "objectID": 15020010031,
        "objectName": "强化碳纤维板",
        "length": 3,
        "width": 3,
        "grade": 6,
        "weight": "3.73",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，一种轻量、高强度、高刚性的先进复合材料，广泛应用于航空航天、建筑等领域。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010031.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010031.png",
        "avgPrice": 2269505,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15020010033": {
        "id": 10141,
        "objectID": 15020010033,
        "objectName": "火箭燃料",
        "length": 3,
        "width": 4,
        "grade": 6,
        "weight": "21.72",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "尚未开封的20升高性能航空燃料，专为火箭发动机所设计，提供澎湃动力。\n【用途】解锁仓库7级必要材料。\n【来源】仅限航天城产出，禁止交易。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010033.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020010033.png",
        "avgPrice": 0,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "航天基地-核心区,航天基地-工业区"
        }
      },
      "15020050008": {
        "id": 10862,
        "objectID": 15020050008,
        "objectName": "继电器",
        "length": 1,
        "width": 1,
        "grade": 3,
        "weight": "0.36",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "工具&材料，其特点为寿命长、半永久性、微小电流驱动信号等。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020050008.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15020050008.png",
        "avgPrice": 10026,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040005": {
        "id": 10875,
        "objectID": 15030040005,
        "objectName": "固态硬盘",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "0.04",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，SSD，用固态电子存储芯片阵列制成的硬盘。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040005.png",
        "avgPrice": 33572,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040006": {
        "id": 10876,
        "objectID": 15030040006,
        "objectName": "内存条",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "7.0000000000000007E-2",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，是与CPU直接交换数据的内部存储器。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040006.png",
        "avgPrice": 26121,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030040007": {
        "id": 10877,
        "objectID": 15030040007,
        "objectName": "ASOS电脑主板",
        "length": 2,
        "width": 2,
        "grade": 4,
        "weight": "2.31",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，是计算机最基本同时也是最重要的部件之一。主板一般为矩形电路板，上面安装有组成计算机的主要电路系统。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030040007.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030040007.png",
        "avgPrice": 47197,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15030050012": {
        "id": 10892,
        "objectID": 15030050012,
        "objectName": "高速磁盘阵列",
        "length": 4,
        "width": 3,
        "grade": 6,
        "weight": "4.71",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，存储加密数据，可为军用，带自毁功能。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15030050012.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15030050012.png",
        "avgPrice": 1625832,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15040010022": {
        "id": 10113,
        "objectID": 15040010022,
        "objectName": "转换插座",
        "length": 1,
        "width": 1,
        "grade": 3,
        "weight": "0.12",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "杂物，各种插口的转换插座，包括变压功能和USB/type c 输出。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15040010022.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15040010022.png",
        "avgPrice": 10135,
        "propsDetail": {
          "type": "工具材料",
          "propsSource": "零号大坝-水泥厂,航天基地-工业区"
        }
      },
      "15060040003": {
        "id": 10226,
        "objectID": 15060040003,
        "objectName": "血氧仪",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "1.46",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "医疗道具，用于无创测量血氧饱和度，操作简单便捷。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060040003.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060040003.png",
        "avgPrice": 62085,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15060080005": {
        "id": 10221,
        "objectID": 15060080005,
        "objectName": "生津柠檬茶",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "0.27",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "将柠檬在热水中稍微浸泡，然后切片泡水添加蜂蜜、茶叶冲制而成的高级饮料。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060080005.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060080005.png",
        "avgPrice": 14893,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15060080015": {
        "id": 10212,
        "objectID": 15060080015,
        "objectName": "奥莉薇娅香槟",
        "length": 1,
        "width": 2,
        "grade": 6,
        "weight": "0.8",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "是一种产自法国香槟地区的气泡酒，以其独特的口感和气泡而闻名，常被用于庆祝重要场合和佳节。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15060080015.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15060080015.png",
        "avgPrice": 336841,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050004": {
        "id": 10151,
        "objectID": 15080050004,
        "objectName": "功绩勋章",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "0.11",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "华贵的功绩勋章，似乎是用于表彰某位曾为阿萨拉建筑事业耗费心血，做出过杰出贡献的人士。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050004.png",
        "avgPrice": 81380,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050006": {
        "id": 10159,
        "objectID": 15080050006,
        "objectName": "非洲之心",
        "length": 1,
        "width": 1,
        "grade": 6,
        "weight": "0.62",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "世界上最大的钻石，璀璨夺目，象征永恒的爱。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050006.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050006.png",
        "avgPrice": 13088362,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050010": {
        "id": 10167,
        "objectID": 15080050010,
        "objectName": "万足金条",
        "length": 1,
        "width": 2,
        "grade": 6,
        "weight": "4.25",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "一整根金条，可以拿去卖钱。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050010.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050010.png",
        "avgPrice": 329785,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050033": {
        "id": 10904,
        "objectID": 15080050033,
        "objectName": "军用卫星通讯仪",
        "length": 2,
        "width": 2,
        "grade": 5,
        "weight": "1.99",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这台军用卫星通讯仪，具有高速传输和实时通讯功能，能在全球范围内与军事基地实现无缝联系。其高度加密和抗干扰设计，确保通讯内容的安全和机密性。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050033.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050033.png",
        "avgPrice": 236217,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050037": {
        "id": 10908,
        "objectID": 15080050037,
        "objectName": "广角镜头",
        "length": 2,
        "width": 1,
        "grade": 4,
        "weight": "0.63",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这款广角镜头拥有宽广的视角范围，适合拍摄大场景照片。紧凑轻便的设计，便于携带，是摄影爱好者记录广阔天地的得力助手。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050037.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050037.png",
        "avgPrice": 52454,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050045": {
        "id": 10255,
        "objectID": 15080050045,
        "objectName": "加密路由器",
        "length": 2,
        "width": 2,
        "grade": 4,
        "weight": "2.17",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "这台加密路由器内置多重加密算法保护数据。其储存的情报信息，仅授权人员可解密查阅。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050045.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050045.png",
        "avgPrice": 44405,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050062": {
        "id": 10912,
        "objectID": 15080050062,
        "objectName": "阵列服务器",
        "length": 4,
        "width": 3,
        "grade": 5,
        "weight": "10",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "阵列服务器通过集成多硬盘，并采用了RAID技术，进而获得了更强的数据存储及处理能力。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050062.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050062.png",
        "avgPrice": 1029946,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050067": {
        "id": 10915,
        "objectID": 15080050067,
        "objectName": "强力吸尘器",
        "length": 2,
        "width": 3,
        "grade": 6,
        "weight": "4.8",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "哈夫克家居产品，采用智能光学探测系统，快速扫清顽垢，居家首选。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050067.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050067.png",
        "avgPrice": 1507766,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050075": {
        "id": 10922,
        "objectID": 15080050075,
        "objectName": "木雕烟斗",
        "length": 2,
        "width": 1,
        "grade": 3,
        "weight": "0.2",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "由阿萨拉匠人选用优质木材，手工雕刻，实用轻便，纹理美观。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050075.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050075.png",
        "avgPrice": 50221,
        "propsDetail": {
          "type": "家居物品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-宿舍区"
        }
      },
      "15080050083": {
        "id": 10930,
        "objectID": 15080050083,
        "objectName": "座钟",
        "length": 2,
        "width": 2,
        "grade": 5,
        "weight": "3",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "实木材质的报时座钟，表面有一层使用碎矿石制成的岩绘具所涂制的漆面，尽显禅意。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050083.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050083.png",
        "avgPrice": 203674,
        "propsDetail": {
          "type": "工艺藏品",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15080050089": {
        "id": 10935,
        "objectID": 15080050089,
        "objectName": "军用弹道计算机",
        "length": 2,
        "width": 1,
        "grade": 5,
        "weight": "2.5",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "高精度计算设备，用于预测和调整制导兵器弹道，确保我们每一次远程打击都能痛击敌人的要冲。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050089.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050089.png",
        "avgPrice": 91174,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050090": {
        "id": 10936,
        "objectID": 15080050090,
        "objectName": "高速固态硬盘",
        "length": 1,
        "width": 1,
        "grade": 5,
        "weight": "0.3",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "电子物品，采用闪存技术，拥有极快的读写速度，耐用且安静。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050090.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050090.png",
        "avgPrice": 74709,
        "propsDetail": {
          "type": "电子物品",
          "propsSource": "长弓溪谷-哈夫克雷达站,航天基地-核心区"
        }
      },
      "15080050096": {
        "id": 10941,
        "objectID": 15080050096,
        "objectName": "军情录音",
        "length": 1,
        "width": 3,
        "grade": 3,
        "weight": "1",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "存有某次作战中指挥系统绝密通信录音的通信终端。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050096.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050096.png",
        "avgPrice": 28267,
        "propsDetail": {
          "type": "资料情报",
          "propsSource": "零号大坝-行政辖区,航天基地-核心区"
        }
      },
      "15080050097": {
        "id": 10942,
        "objectID": 15080050097,
        "objectName": "复苏呼吸机",
        "length": 3,
        "width": 3,
        "grade": 6,
        "weight": "5",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "医疗道具，专为体征已经极度衰弱，自主呼吸已经消失的病患设计的辅助呼吸设备，生命的最终防线。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050097.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15080050097.png",
        "avgPrice": 9209869,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      },
      "15090010041": {
        "id": 10231,
        "objectID": 15090010041,
        "objectName": "医疗无人机",
        "length": 2,
        "width": 2,
        "grade": 3,
        "weight": "1.0900000000000001",
        "primaryClass": "props",
        "secondClass": "collection",
        "secondClassCN": "收集品",
        "desc": "利用无线电遥控设备和自备的程序控制装置操纵的不载人飞机，用于运载医疗物品。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15090010041.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_15090010041.png",
        "avgPrice": 33420,
        "propsDetail": {
          "type": "医疗道具",
          "propsSource": "长弓溪谷-钻石皇后酒店,航天基地-核心区"
        }
      }
    },
    "requestParams": {
      "placeType": "storage",
      "hasParam": true
    },
    "amsSerial": "AMS-DFM-0721102059-p09e7d-661959-316969",
    "loginInfo": {
      "type": "qc",
      "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
      "timestamp": "2025-07-21T02:20:59.503Z"
    },
    "requestInfo": {
      "apiUrl": "https://comm.ams.game.qq.com/ide/",
      "chartId": "316969",
      "timestamp": "2025-07-21T02:20:59.503Z"
    }
  },
  "message": "获取特勤处信息成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» places|[object]|true|none||none|
|»»» placeId|integer|true|none||none|
|»»» placeType|string|true|none||none|
|»»» placeName|string|true|none||none|
|»»» level|integer|true|none||none|
|»»» detail|string|true|none||none|
|»»» upgradeInfo|object|true|none||none|
|»»»» hafCount|integer|true|none||none|
|»»»» condition|string|true|none||none|
|»»» upgradeRequired|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» count|integer|true|none||none|
|»»» unlockInfo|object|true|none||none|
|»»»» properties|object|true|none||none|
|»»»»» list|[string]|true|none||none|
|»»»» props|[string]|true|none||none|
|»» relateMap|object|true|none||none|
|»»» 15010050001|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15020010016|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15020010031|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15020010033|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15020050008|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15030040005|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15030040006|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15030040007|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15030050012|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15040010022|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15060040003|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15060080005|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15060080015|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050004|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050006|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050010|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050033|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050037|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050045|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050062|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050067|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050075|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050083|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050089|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050090|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050096|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15080050097|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»»» 15090010041|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» propsDetail|object|true|none||none|
|»»»»» type|string|true|none||none|
|»»»»» propsSource|string|true|none||none|
|»» requestParams|object|true|none||none|
|»»» placeType|string|true|none||none|
|»»» hasParam|boolean|true|none||none|
|»» amsSerial|string|true|none||none|
|»» loginInfo|object|true|none||none|
|»»» type|string|true|none||none|
|»»» openid|string|true|none||none|
|»»» timestamp|string|true|none||none|
|»» requestInfo|object|true|none||none|
|»»» apiUrl|string|true|none||none|
|»»» chartId|string|true|none||none|
|»»» timestamp|string|true|none||none|
|» message|string|true|none||none|

## GET 特勤处制造材料价格

GET /df/place/materialPrice

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|string| 否 |物品id，不选为全部|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "objectID": 15010010004,
        "objectName": "含氟牙膏",
        "minPrice": 2157,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14070000004,
            "objectName": "感知激活针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010003,
        "objectName": "布基胶带",
        "minPrice": 1215,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13140000029,
            "objectName": "RK-0前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11080004005,
            "objectName": "穿山甲通用战术包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005001,
            "objectName": "ALS背负系统",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005002,
            "objectName": "HLS-2重型背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005004,
            "objectName": "GT5野战背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 13030000112,
            "objectName": "侵袭后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000026,
            "objectName": "斜角阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000024,
            "objectName": "竞赛阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000008,
            "objectName": "SR-3M紧凑突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11080006003,
            "objectName": "D7战术背包",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010005,
        "objectName": "螺丝刀",
        "minPrice": 2738,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13160000018,
            "objectName": "OLIGHT WARRIOR 3S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11010004003,
            "objectName": "DICH 训练头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010004004,
            "objectName": "GT1 战术头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070004004,
            "objectName": "GIR野战胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005003,
            "objectName": "D3战术登山包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005004,
            "objectName": "GT5野战背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005003,
            "objectName": "黑鹰野战胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005004,
            "objectName": "DAR突击手胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 13030000112,
            "objectName": "侵袭后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010006,
        "objectName": "工具刀",
        "minPrice": 2292,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13110000052,
            "objectName": "侦察1.5/5可调瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000113,
            "objectName": "416稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000006,
            "objectName": "闪电导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000112,
            "objectName": "416轻型枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13330000002,
            "objectName": "平衡握把底座",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13330000001,
            "objectName": "稳固握把底座",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010007,
        "objectName": "电动爆破锤",
        "minPrice": 4009,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37250300001,
            "objectName": "12 Gauge 箭形弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160300001,
            "objectName": "12.7x55mm PS12A",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37120300001,
            "objectName": "5.45x39mm PS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270300001,
            "objectName": "玻纤柳叶箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37230400001,
            "objectName": ".50 AE FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250400002,
            "objectName": "12 Gauge独头 AP-20",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160400001,
            "objectName": "12.7x55mm PS12",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150400001,
            "objectName": "6.8x51mm FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010008,
        "objectName": "原木木板",
        "minPrice": 4024,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13370000001,
            "objectName": "蜂网遮光罩",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000005,
            "objectName": "PEQ-2红色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000006,
            "objectName": "LA-3C绿色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000064,
            "objectName": "Cobra准直式瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000062,
            "objectName": "微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000063,
            "objectName": "战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000043,
            "objectName": "全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000082,
            "objectName": "M157火控光学系统",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000091,
            "objectName": "灵眼3/7测距狙击瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000029,
            "objectName": "RK-0前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000159,
            "objectName": "炽火抑制器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000209,
            "objectName": "薪火螺旋消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000108,
            "objectName": "侵掠核心枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000038,
            "objectName": "腾龙突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11050004003,
            "objectName": "DT-AVS防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050004004,
            "objectName": "MK-2战术背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010004001,
            "objectName": "D6 战术头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010004002,
            "objectName": "MHS 战术头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005010,
            "objectName": "GN 久战重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070004003,
            "objectName": "DRC先进侦察胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070004004,
            "objectName": "GIR野战胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005001,
            "objectName": "ALS背负系统",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005002,
            "objectName": "HLS-2重型背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005003,
            "objectName": "D3战术登山包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005004,
            "objectName": "GT5野战背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005001,
            "objectName": "精英防弹背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005002,
            "objectName": "Hvk-2防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005003,
            "objectName": "FS复合防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005004,
            "objectName": "重型突击背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005001,
            "objectName": "Mask-1铁壁头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005002,
            "objectName": "H09 防暴头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005004,
            "objectName": "GN 重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005003,
            "objectName": "DICH-1战术头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005009,
            "objectName": "GN 重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005001,
            "objectName": "飓风战术胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005003,
            "objectName": "黑鹰野战胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005004,
            "objectName": "DAR突击手胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 14060000001,
            "objectName": "精密头盔维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 13160000010,
            "objectName": "DBAL-X2紫色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000009,
            "objectName": "PERST-7蓝色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000014,
            "objectName": "OLIGHT Baldr Pro R多功能手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000044,
            "objectName": "XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000061,
            "objectName": "okp-7反射瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000076,
            "objectName": "侧置全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000077,
            "objectName": "侧置XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000078,
            "objectName": "侧置微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000079,
            "objectName": "侧置战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000026,
            "objectName": "斜角阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000024,
            "objectName": "竞赛阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000041,
            "objectName": "破晓垂直手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000042,
            "objectName": "黎明三角手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000038,
            "objectName": "伸缩脚架握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000165,
            "objectName": "海神消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000169,
            "objectName": "死寂消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000167,
            "objectName": "堡垒水平补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000168,
            "objectName": "沙暴垂直补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000208,
            "objectName": "先进多口径消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000004,
            "objectName": "SVD狙击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000031,
            "objectName": "PSG-1射手步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18060000009,
            "objectName": "M700狙击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000006,
            "objectName": "AKM突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 14060000003,
            "objectName": "高级头盔维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14060000004,
            "objectName": "高级护甲维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 13110000053,
            "objectName": "XCOG突击3.5倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000073,
            "objectName": "视点3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000072,
            "objectName": "1p-29俄制3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000093,
            "objectName": "棱镜通用二倍光学瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000066,
            "objectName": "先进热融合全息瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000033,
            "objectName": "幻影垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000022,
            "objectName": "相位战斗前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000034,
            "objectName": "共振人体工程握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000160,
            "objectName": "钛金竞赛制退器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000164,
            "objectName": "轻语战术消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000184,
            "objectName": "影袭托芯枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000110,
            "objectName": "UR特种战术枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000007,
            "objectName": "影袭导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000008,
            "objectName": "SR-3M紧凑突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000011,
            "objectName": "QCQ171冲锋枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000002,
            "objectName": "P90冲锋枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000021,
            "objectName": "SCAR-H战斗步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000015,
            "objectName": "AUG突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000001,
            "objectName": "M4A1突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000001,
            "objectName": "PKM通用机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000004,
            "objectName": "QJB201轻机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000002,
            "objectName": "M249轻机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11080006004,
            "objectName": "GTO重型战术包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006007,
            "objectName": "H70 夜视精英头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010012,
        "objectName": "电线",
        "minPrice": 1959,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13140000027,
            "objectName": "战术三角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000036,
            "objectName": "K1精英斜角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010019,
        "objectName": "尖嘴钳",
        "minPrice": 2467,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13030000169,
            "objectName": "RK3后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000032,
            "objectName": "战术垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000107,
            "objectName": "枢机稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000056,
            "objectName": "光学狙击8倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000160,
            "objectName": "钛金竞赛制退器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000164,
            "objectName": "轻语战术消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000183,
            "objectName": "MRGS镂空枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000184,
            "objectName": "影袭托芯枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000110,
            "objectName": "UR特种战术枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010021,
        "objectName": "角磨机",
        "minPrice": 3900,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37220300001,
            "objectName": ".357 Magnum JHP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37190300001,
            "objectName": ".45 ACP FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37230300001,
            "objectName": ".50 AE JHP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37110300001,
            "objectName": "7.62x39mm PS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170300001,
            "objectName": "7.62x51mm BPZ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180300001,
            "objectName": "7.62x54R T46M",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 11050004003,
            "objectName": "DT-AVS防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050004004,
            "objectName": "MK-2战术背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 37220400001,
            "objectName": ".357 Magnum FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37190400001,
            "objectName": ".45 ACP AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37230400001,
            "objectName": ".50 AE FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160400002,
            "objectName": "12.7x55mm PD12双头弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37120400001,
            "objectName": "5.45x39mm BT",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37100400001,
            "objectName": "5.56x45mm M855A1",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37210400001,
            "objectName": "5.7x28mm SS193",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150400001,
            "objectName": "6.8x51mm FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37110400001,
            "objectName": "7.62x39mm BP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180400001,
            "objectName": "7.62x54R LPS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37200400001,
            "objectName": "9x19mm PBP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 13140000033,
            "objectName": "幻影垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000006,
            "objectName": "SKS射手步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 37280500001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37260500001,
            "objectName": "4.6x30mm AP SX",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37120500001,
            "objectName": "5.45x39mm BS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37100500001,
            "objectName": "5.56x45mm M995",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37210500001,
            "objectName": "5.7x28mm SS190",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37130500001,
            "objectName": "5.8x42mm DVC12",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010023,
        "objectName": "高精数显卡尺",
        "minPrice": 14603,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13160000018,
            "objectName": "OLIGHT WARRIOR 3S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13370000001,
            "objectName": "蜂网遮光罩",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000016,
            "objectName": "OLIGHT Odin S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000007,
            "objectName": "耀斑战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000005,
            "objectName": "PEQ-2红色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000006,
            "objectName": "LA-3C绿色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000082,
            "objectName": "M157火控光学系统",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000091,
            "objectName": "灵眼3/7测距狙击瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11070005004,
            "objectName": "DAR突击手胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 13160000010,
            "objectName": "DBAL-X2紫色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000009,
            "objectName": "PERST-7蓝色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000014,
            "objectName": "OLIGHT Baldr Pro R多功能手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000051,
            "objectName": "HAMR组合瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000052,
            "objectName": "侦察1.5/5可调瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000056,
            "objectName": "光学狙击8倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000057,
            "objectName": "3/7可调倍率狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000070,
            "objectName": "6/12神射手变倍狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000042,
            "objectName": "黎明三角手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000038,
            "objectName": "伸缩脚架握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000039,
            "objectName": "共振二代前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 37270400001,
            "objectName": "碳纤维刺骨箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 13110000093,
            "objectName": "棱镜通用二倍光学瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000067,
            "objectName": "先进白热成像战斗瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000033,
            "objectName": "幻影垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000030,
            "objectName": "密令斜角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11080006004,
            "objectName": "GTO重型战术包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050006003,
            "objectName": "特里克MAS2.0装甲",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050006001,
            "objectName": "金刚防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 37160500001,
            "objectName": "12.7x55mm PS12B",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37260500001,
            "objectName": "4.6x30mm AP SX",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010024,
        "objectName": "高出力粉碎钳",
        "minPrice": 43673,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13160000016,
            "objectName": "OLIGHT Odin S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000007,
            "objectName": "耀斑战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11010005010,
            "objectName": "GN 久战重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005001,
            "objectName": "精英防弹背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005002,
            "objectName": "Hvk-2防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005003,
            "objectName": "FS复合防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005003,
            "objectName": "DICH-1战术头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005009,
            "objectName": "GN 重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 14060000004,
            "objectName": "高级护甲维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 11050006003,
            "objectName": "特里克MAS2.0装甲",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050006001,
            "objectName": "金刚防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006004,
            "objectName": "GT5 指挥官头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006003,
            "objectName": "DICH-9重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006007,
            "objectName": "H70 夜视精英头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010026,
        "objectName": "波纹软管",
        "minPrice": 2140,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13030000169,
            "objectName": "RK3后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13210000013,
            "objectName": "多用途战术增高架",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13210000012,
            "objectName": "微型瞄具增高架",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000076,
            "objectName": "侧置全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000077,
            "objectName": "侧置XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000078,
            "objectName": "侧置微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000079,
            "objectName": "侧置战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000088,
            "objectName": "侧置Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010030,
        "objectName": "喷漆",
        "minPrice": 3734,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 14060000001,
            "objectName": "精密头盔维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 13110000088,
            "objectName": "侧置Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010032,
        "objectName": "LED灯管",
        "minPrice": 3187,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13160000005,
            "objectName": "PEQ-2红色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000006,
            "objectName": "LA-3C绿色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000042,
            "objectName": "俄式准直二倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13210000013,
            "objectName": "多用途战术增高架",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000064,
            "objectName": "Cobra准直式瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000062,
            "objectName": "微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000087,
            "objectName": "Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000063,
            "objectName": "战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000043,
            "objectName": "全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000069,
            "objectName": "LPVO多倍率战斗瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000082,
            "objectName": "M157火控光学系统",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000091,
            "objectName": "灵眼3/7测距狙击瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11010005010,
            "objectName": "GN 久战重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 13160000010,
            "objectName": "DBAL-X2紫色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000009,
            "objectName": "PERST-7蓝色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000014,
            "objectName": "OLIGHT Baldr Pro R多功能手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13210000012,
            "objectName": "微型瞄具增高架",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000044,
            "objectName": "XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000061,
            "objectName": "okp-7反射瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000076,
            "objectName": "侧置全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000077,
            "objectName": "侧置XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000078,
            "objectName": "侧置微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000079,
            "objectName": "侧置战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000088,
            "objectName": "侧置Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000089,
            "objectName": "ACOG精准六倍镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000051,
            "objectName": "HAMR组合瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000052,
            "objectName": "侦察1.5/5可调瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000056,
            "objectName": "光学狙击8倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000057,
            "objectName": "3/7可调倍率狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000070,
            "objectName": "6/12神射手变倍狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000053,
            "objectName": "XCOG突击3.5倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000073,
            "objectName": "视点3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000072,
            "objectName": "1p-29俄制3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000066,
            "objectName": "先进热融合全息瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020010034,
        "objectName": "低级燃料",
        "minPrice": 13396,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37230300001,
            "objectName": ".50 AE JHP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250300002,
            "objectName": "12 Gauge独头 FTX",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180300001,
            "objectName": "7.62x54R T46M",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37140300001,
            "objectName": "9x39mm SP5",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270300001,
            "objectName": "玻纤柳叶箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37280400001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37190400001,
            "objectName": ".45 ACP AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37130400001,
            "objectName": "5.8x42mm DBP10",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150400001,
            "objectName": "6.8x51mm FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37110400001,
            "objectName": "7.62x39mm BP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170400001,
            "objectName": "7.62x51mm M80",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180400001,
            "objectName": "7.62x54R LPS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37140400001,
            "objectName": "9x39mm SP6",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37280500001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160500001,
            "objectName": "12.7x55mm PS12B",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37260500001,
            "objectName": "4.6x30mm AP SX",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37120500001,
            "objectName": "5.45x39mm BS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150600001,
            "objectName": "6.8x51mm AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37110500001,
            "objectName": "7.62x39mm AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170500001,
            "objectName": "7.62x51mm M62",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180500001,
            "objectName": "7.62x54R BT",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37140500001,
            "objectName": "9x39mm BP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020040002,
        "objectName": "芳纶纤维",
        "minPrice": 23658,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 11050005002,
            "objectName": "Hvk-2防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050005004,
            "objectName": "重型突击背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005002,
            "objectName": "H09 防暴头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005004,
            "objectName": "GN 重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010005009,
            "objectName": "GN 重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 14060000003,
            "objectName": "高级头盔维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 11080006003,
            "objectName": "D7战术背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080006004,
            "objectName": "GTO重型战术包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006004,
            "objectName": "GT5 指挥官头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006003,
            "objectName": "DICH-9重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11010006007,
            "objectName": "H70 夜视精英头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020040003,
        "objectName": "压力计",
        "minPrice": 4109,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37170300001,
            "objectName": "7.62x51mm BPZ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 11010005004,
            "objectName": "GN 重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020040004,
        "objectName": "水平仪",
        "minPrice": 4218,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37200300001,
            "objectName": "9x19mm AP6.3",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020050001,
        "objectName": "自旋型手锯",
        "minPrice": 60801,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37240700001,
            "objectName": ".338 Lap Mag AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170600001,
            "objectName": "7.62x51mm M61",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180600001,
            "objectName": "7.62x54R SNB",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270500001,
            "objectName": "碳纤维穿甲箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020050002,
        "objectName": "无线便携电钻",
        "minPrice": 30157,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14060000002,
            "objectName": "精密护甲维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 37280400001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 14060000003,
            "objectName": "高级头盔维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14060000004,
            "objectName": "高级护甲维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 37170600001,
            "objectName": "7.62x51mm M61",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270500001,
            "objectName": "碳纤维穿甲箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020050003,
        "objectName": "聚乙烯纤维",
        "minPrice": 37562,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 11080005001,
            "objectName": "ALS背负系统",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005002,
            "objectName": "HLS-2重型背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005003,
            "objectName": "D3战术登山包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11080005004,
            "objectName": "GT5野战背包",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005001,
            "objectName": "飓风战术胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005003,
            "objectName": "黑鹰野战胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11070005004,
            "objectName": "DAR突击手胸挂",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020050005,
        "objectName": "特种钢",
        "minPrice": 44407,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 14060000001,
            "objectName": "精密头盔维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14060000002,
            "objectName": "精密护甲维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15030010008,
        "objectName": "音频播放器",
        "minPrice": 9285,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37160400001,
            "objectName": "12.7x55mm PS12",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15030010011,
        "objectName": "电源",
        "minPrice": 5713,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37100400001,
            "objectName": "5.56x45mm M855A1",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15030040001,
        "objectName": "镜头",
        "minPrice": 186788,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 11010005009,
            "objectName": "GN 重型夜视头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15030040014,
        "objectName": "电子干扰器",
        "minPrice": 11982,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 11010006003,
            "objectName": "DICH-9重型头盔",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15040010017,
        "objectName": "火药",
        "minPrice": 18956,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37270300001,
            "objectName": "玻纤柳叶箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160400002,
            "objectName": "12.7x55mm PD12双头弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37210400001,
            "objectName": "5.7x28mm SS193",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170400001,
            "objectName": "7.62x51mm M80",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180400001,
            "objectName": "7.62x54R LPS",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37200400001,
            "objectName": "9x19mm PBP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270400001,
            "objectName": "碳纤维刺骨箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37240700001,
            "objectName": ".338 Lap Mag AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37210500001,
            "objectName": "5.7x28mm SS190",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37130500001,
            "objectName": "5.8x42mm DVC12",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150500001,
            "objectName": "6.8x51mm Hybrid",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150600001,
            "objectName": "6.8x51mm AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170500001,
            "objectName": "7.62x51mm M62",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180600001,
            "objectName": "7.62x54R SNB",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15040010021,
        "objectName": "枪械零件",
        "minPrice": 16934,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13370000001,
            "objectName": "蜂网遮光罩",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000016,
            "objectName": "OLIGHT Odin S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000007,
            "objectName": "耀斑战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000005,
            "objectName": "PEQ-2红色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000006,
            "objectName": "LA-3C绿色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13030000169,
            "objectName": "RK3后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000069,
            "objectName": "LPVO多倍率战斗瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000082,
            "objectName": "M157火控光学系统",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000091,
            "objectName": "灵眼3/7测距狙击瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000029,
            "objectName": "RK-0前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000032,
            "objectName": "战术垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000027,
            "objectName": "战术三角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000159,
            "objectName": "炽火抑制器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000196,
            "objectName": "M7实用消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000209,
            "objectName": "薪火螺旋消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000185,
            "objectName": "骨架狙击枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000108,
            "objectName": "侵掠核心枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000107,
            "objectName": "枢机稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000018,
            "objectName": "AK-12突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000005,
            "objectName": "M14射手步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000038,
            "objectName": "腾龙突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000010,
            "objectName": "DBAL-X2紫色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000009,
            "objectName": "PERST-7蓝色激光镭指",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000014,
            "objectName": "OLIGHT Baldr Pro R多功能手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13030000112,
            "objectName": "侵袭后握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000089,
            "objectName": "ACOG精准六倍镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000051,
            "objectName": "HAMR组合瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000052,
            "objectName": "侦察1.5/5可调瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000056,
            "objectName": "光学狙击8倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000057,
            "objectName": "3/7可调倍率狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000070,
            "objectName": "6/12神射手变倍狙击镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000026,
            "objectName": "斜角阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000036,
            "objectName": "K1精英斜角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000024,
            "objectName": "竞赛阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000035,
            "objectName": "X25U斜侧战斗握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000040,
            "objectName": "CR棱镜阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000041,
            "objectName": "破晓垂直手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000042,
            "objectName": "黎明三角手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000038,
            "objectName": "伸缩脚架握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000039,
            "objectName": "共振二代前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000165,
            "objectName": "海神消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000169,
            "objectName": "死寂消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000167,
            "objectName": "堡垒水平补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000168,
            "objectName": "沙暴垂直补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000208,
            "objectName": "先进多口径消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000113,
            "objectName": "416稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000006,
            "objectName": "闪电导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000112,
            "objectName": "416轻型枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000004,
            "objectName": "SVD狙击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18050000031,
            "objectName": "PSG-1射手步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18060000009,
            "objectName": "M700狙击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000006,
            "objectName": "AKM突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13330000002,
            "objectName": "平衡握把底座",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13330000001,
            "objectName": "稳固握把底座",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000053,
            "objectName": "XCOG突击3.5倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000073,
            "objectName": "视点3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000072,
            "objectName": "1p-29俄制3倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000093,
            "objectName": "棱镜通用二倍光学瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000066,
            "objectName": "先进热融合全息瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000067,
            "objectName": "先进白热成像战斗瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000033,
            "objectName": "幻影垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000022,
            "objectName": "相位战斗前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000034,
            "objectName": "共振人体工程握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000030,
            "objectName": "密令斜角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000160,
            "objectName": "钛金竞赛制退器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000164,
            "objectName": "轻语战术消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000183,
            "objectName": "MRGS镂空枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000184,
            "objectName": "影袭托芯枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000110,
            "objectName": "UR特种战术枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000007,
            "objectName": "影袭导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000008,
            "objectName": "SR-3M紧凑突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000011,
            "objectName": "QCQ171冲锋枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18020000002,
            "objectName": "P90冲锋枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000021,
            "objectName": "SCAR-H战斗步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000015,
            "objectName": "AUG突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18010000001,
            "objectName": "M4A1突击步枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000001,
            "objectName": "PKM通用机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000004,
            "objectName": "QJB201轻机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 18040000002,
            "objectName": "M249轻机枪",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15040010023,
        "objectName": "移动电缆",
        "minPrice": 434394,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14060000003,
            "objectName": "高级头盔维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14060000004,
            "objectName": "高级护甲维修组合",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15040050003,
        "objectName": "已损坏的热像仪",
        "minPrice": 46634,
        "minPriceTime": 1752980400000,
        "usedBy": [
          {
            "objectID": 13110000066,
            "objectName": "先进热融合全息瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000067,
            "objectName": "先进白热成像战斗瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15060010002,
        "objectName": "手术镊子",
        "minPrice": 2387,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14070000006,
            "objectName": "体能激活针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15060010003,
        "objectName": "小药瓶",
        "minPrice": 2594,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14070000009,
            "objectName": "去甲肾上腺素",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000001,
            "objectName": "M1肌肉强化针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000004,
            "objectName": "感知激活针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000008,
            "objectName": "OE2战斗兴奋剂",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000006,
            "objectName": "体能激活针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15060010006,
        "objectName": "听诊器",
        "minPrice": 16234,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14020000006,
            "objectName": "战地医疗箱",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15060080002,
        "objectName": "酸奶",
        "minPrice": 899,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14070000009,
            "objectName": "去甲肾上腺素",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000001,
            "objectName": "M1肌肉强化针",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14070000008,
            "objectName": "OE2战斗兴奋剂",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15060080006,
        "objectName": "纯净水",
        "minPrice": 2101,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14070000008,
            "objectName": "OE2战斗兴奋剂",
            "placeType": "pharmacy",
            "placeName": "制药台"
          },
          {
            "objectID": 14020000006,
            "objectName": "战地医疗箱",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15070010002,
        "objectName": "存储卡",
        "minPrice": 7391,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37220400001,
            "objectName": ".357 Magnum FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15070040001,
        "objectName": "资料：设计图纸",
        "minPrice": 67108,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 13160000016,
            "objectName": "OLIGHT Odin S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13160000007,
            "objectName": "耀斑战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 11050006003,
            "objectName": "特里克MAS2.0装甲",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050006001,
            "objectName": "金刚防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050006004,
            "objectName": "泰坦防弹装甲",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15070050003,
        "objectName": "情报文件",
        "minPrice": 15125,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 13110000089,
            "objectName": "ACOG精准六倍镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000041,
            "objectName": "破晓垂直手电握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000022,
            "objectName": "相位战斗前握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000034,
            "objectName": "共振人体工程握把",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050023,
        "objectName": "初级子弹生产零件",
        "minPrice": 19407,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37280300001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160300001,
            "objectName": "12.7x55mm PS12A",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37220400001,
            "objectName": ".357 Magnum FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37230400001,
            "objectName": ".50 AE FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250400002,
            "objectName": "12 Gauge独头 AP-20",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250400003,
            "objectName": "12 Gauge 龙息弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160400001,
            "objectName": "12.7x55mm PS12",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37160400002,
            "objectName": "12.7x55mm PD12双头弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37260400001,
            "objectName": "4.6x30mm FMJ SX",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37120400001,
            "objectName": "5.45x39mm BT",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37100400001,
            "objectName": "5.56x45mm M855A1",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270400001,
            "objectName": "碳纤维刺骨箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37280500001,
            "objectName": ".300BLK",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37240700001,
            "objectName": ".338 Lap Mag AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37100500001,
            "objectName": "5.56x45mm M995",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37130500001,
            "objectName": "5.8x42mm DVC12",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37150500001,
            "objectName": "6.8x51mm Hybrid",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37110500001,
            "objectName": "7.62x39mm AP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37170500001,
            "objectName": "7.62x51mm M62",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180500001,
            "objectName": "7.62x54R BT",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37180600001,
            "objectName": "7.62x54R SNB",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37140500001,
            "objectName": "9x39mm BP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37270500001,
            "objectName": "碳纤维穿甲箭矢",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050056,
        "objectName": "资料残页",
        "minPrice": 903,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13110000042,
            "objectName": "俄式准直二倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000087,
            "objectName": "Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000069,
            "objectName": "LPVO多倍率战斗瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050057,
        "objectName": "无菌敷料包",
        "minPrice": 18563,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 14020000006,
            "objectName": "战地医疗箱",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050077,
        "objectName": "调料套组",
        "minPrice": 6777,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 11050004002,
            "objectName": "突击手防弹背心",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050004003,
            "objectName": "DT-AVS防弹衣",
            "placeType": "armory",
            "placeName": "防具台"
          },
          {
            "objectID": 11050004004,
            "objectName": "MK-2战术背心",
            "placeType": "armory",
            "placeName": "防具台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050080,
        "objectName": "强力胶",
        "minPrice": 2931,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13110000064,
            "objectName": "Cobra准直式瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000062,
            "objectName": "微型红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000087,
            "objectName": "Osight微型瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000032,
            "objectName": "战术垂直握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000027,
            "objectName": "战术三角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000209,
            "objectName": "薪火螺旋消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000185,
            "objectName": "骨架狙击枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000107,
            "objectName": "枢机稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000044,
            "objectName": "XRO快速反应瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000061,
            "objectName": "okp-7反射瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000036,
            "objectName": "K1精英斜角握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000035,
            "objectName": "X25U斜侧战斗握把",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13140000040,
            "objectName": "CR棱镜阻手器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000208,
            "objectName": "先进多口径消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000053,
            "objectName": "XCOG突击3.5倍瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050084,
        "objectName": "石工锤",
        "minPrice": 12944,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13130000165,
            "objectName": "海神消焰器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000169,
            "objectName": "死寂消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000208,
            "objectName": "先进多口径消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000160,
            "objectName": "钛金竞赛制退器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000164,
            "objectName": "轻语战术消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000183,
            "objectName": "MRGS镂空枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000184,
            "objectName": "影袭托芯枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000110,
            "objectName": "UR特种战术枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050085,
        "objectName": "羊角锤",
        "minPrice": 3632,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13130000196,
            "objectName": "M7实用消音器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000183,
            "objectName": "MRGS镂空枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000007,
            "objectName": "影袭导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050086,
        "objectName": "一盒钉子",
        "minPrice": 2663,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13110000063,
            "objectName": "战斗红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000043,
            "objectName": "全景红点瞄准镜",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13110000069,
            "objectName": "LPVO多倍率战斗瞄具",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000113,
            "objectName": "416稳固枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000006,
            "objectName": "闪电导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000112,
            "objectName": "416轻型枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15080050087,
        "objectName": "手锯",
        "minPrice": 12122,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13370000001,
            "objectName": "蜂网遮光罩",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000167,
            "objectName": "堡垒水平补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13130000168,
            "objectName": "沙暴垂直补偿器",
            "placeType": "tech",
            "placeName": "技术中心"
          },
          {
            "objectID": 13040000007,
            "objectName": "影袭导轨枪托",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15200000044,
        "objectName": "OLIGHT WARRIOR 3S联名手电",
        "minPrice": 19715,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 13160000018,
            "objectName": "OLIGHT WARRIOR 3S战术手电",
            "placeType": "tech",
            "placeName": "技术中心"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37100200001,
        "objectName": "5.56x45mm FMJ",
        "minPrice": 77,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37100300001,
            "objectName": "5.56x45mm M855",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37110200001,
        "objectName": "7.62x39mm T45M",
        "minPrice": 108,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37110400001,
            "objectName": "7.62x39mm BP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37120200001,
        "objectName": "5.45x39mm T",
        "minPrice": 98,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37120300001,
            "objectName": "5.45x39mm PS",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37130200001,
        "objectName": "5.8x42mm DBP87",
        "minPrice": 93,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37130300001,
            "objectName": "5.8x42mm DVP88",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37130400001,
            "objectName": "5.8x42mm DBP10",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37190200001,
        "objectName": ".45 ACP JHP",
        "minPrice": 109,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37190000001,
            "objectName": ".45 ACP RIP",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37190300001,
            "objectName": ".45 ACP FMJ",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37190400001,
            "objectName": ".45 ACP AP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37200200001,
        "objectName": "9x19mm Pst",
        "minPrice": 82,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37200400001,
            "objectName": "9x19mm PBP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37210200001,
        "objectName": "5.7x28mm SS197SR",
        "minPrice": 96,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 37210300001,
            "objectName": "5.7x28mm L191",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37210400001,
            "objectName": "5.7x28mm SS193",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37220200001,
        "objectName": ".357 Magnum HP",
        "minPrice": 108,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37220300001,
            "objectName": ".357 Magnum JHP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37230200001,
        "objectName": ".50 AE HP",
        "minPrice": 119,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37230300001,
            "objectName": ".50 AE JHP",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 37250200002,
        "objectName": "12 Gauge独头 GT",
        "minPrice": 44,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 37250300001,
            "objectName": "12 Gauge 箭形弹",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250300002,
            "objectName": "12 Gauge独头 FTX",
            "placeType": "workbench",
            "placeName": "工作台"
          },
          {
            "objectID": 37250400002,
            "objectName": "12 Gauge独头 AP-20",
            "placeType": "workbench",
            "placeName": "工作台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      }
    ],
    "total": 58,
    "currentTime": "2025-07-21T02:29:57.423Z",
    "query": {}
  },
  "message": "制造材料最低价格查询成功"
}
```

```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "objectID": 15020050002,
        "objectName": "无线便携电钻",
        "minPrice": 30157,
        "minPriceTime": 1752978600000,
        "usedBy": [
          {
            "objectID": 14060000002,
            "objectName": "精密护甲维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      },
      {
        "objectID": 15020050005,
        "objectName": "特种钢",
        "minPrice": 44407,
        "minPriceTime": 1753063200000,
        "usedBy": [
          {
            "objectID": 14060000002,
            "objectName": "精密护甲维修包",
            "placeType": "pharmacy",
            "placeName": "制药台"
          }
        ],
        "todaySaleCount": 57,
        "yesterdaySaleCount": 71,
        "dayBeforeSaleCount": 110
      }
    ],
    "total": 2,
    "currentTime": "2025-07-21T02:29:45.219Z",
    "query": {
      "id": 14060000002
    }
  },
  "message": "制造材料最低价格查询成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» materials|[object]|true|none||none|
|»»» objectID|integer|true|none||none|
|»»» objectName|string|true|none||none|
|»»» minPrice|integer|true|none||none|
|»»» minPriceTime|integer|true|none||none|
|»»» usedBy|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» placeType|string|true|none||none|
|»»»» placeName|string|true|none||none|
|»»» todaySaleCount|integer|true|none||none|
|»»» yesterdaySaleCount|integer|true|none||none|
|»»» dayBeforeSaleCount|integer|true|none||none|
|»» total|integer|true|none||none|
|»» currentTime|string|true|none||none|
|»» query|object|true|none||none|
|» message|string|true|none||none|

## GET 利润排行榜V1

GET /df/place/profitRank/v1

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|place|query|array[string]| 否 |place: 场所类型 (可选)（不选默认所有场所前limit）|
|type|query|string| 否 |类型（hour小时利润，total总利润）|
|limit|query|string| 否 |数量限制|
|Authorization|header|string| 否 |none|

#### 详细说明

**place**: place: 场所类型 (可选)（不选默认所有场所前limit）
storage: 仓库
control: 指挥中心
workbench: 工作台
tech: 技术中心
shoot: 靶场
training: 训练中心
pharmacy: 制药台
armory: 防具台

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "place": "workbench",
    "type": "hour",
    "items": [
      {
        "objectID": 37210400001,
        "objectName": "5.7x28mm SS193",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 2,
        "hourProfit": 31420,
        "profit": 219940,
        "timestamp": 1753065000000,
        "hourRank": 1,
        "totalRank": 5
      },
      {
        "objectID": 37130400001,
        "objectName": "5.8x42mm DBP10",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 2,
        "hourProfit": 30129,
        "profit": 210903,
        "timestamp": 1753065000000,
        "hourRank": 2,
        "totalRank": 8
      },
      {
        "objectID": 37100500001,
        "objectName": "5.56x45mm M995",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 3,
        "hourProfit": 29549.75,
        "profit": 236398,
        "timestamp": 1753065000000,
        "hourRank": 3,
        "totalRank": 1
      },
      {
        "objectID": 37140500001,
        "objectName": "9x39mm BP",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 3,
        "hourProfit": 29487.13,
        "profit": 235897,
        "timestamp": 1753065000000,
        "hourRank": 4,
        "totalRank": 2
      },
      {
        "objectID": 37170500001,
        "objectName": "7.62x51mm M62",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 3,
        "hourProfit": 28874.75,
        "profit": 230998,
        "timestamp": 1753065000000,
        "hourRank": 5,
        "totalRank": 3
      },
      {
        "objectID": 37140400001,
        "objectName": "9x39mm SP6",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 2,
        "hourProfit": 28542.14,
        "profit": 199795,
        "timestamp": 1753065000000,
        "hourRank": 6,
        "totalRank": 9
      },
      {
        "objectID": 37280500001,
        "objectName": ".300BLK",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 3,
        "hourProfit": 28316.5,
        "profit": 226532,
        "timestamp": 1753065000000,
        "hourRank": 7,
        "totalRank": 4
      },
      {
        "objectID": 37250400003,
        "objectName": "12 Gauge 龙息弹",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 2,
        "hourProfit": 27487.43,
        "profit": 192412,
        "timestamp": 1753065000000,
        "hourRank": 8,
        "totalRank": 10
      },
      {
        "objectID": 37180400001,
        "objectName": "7.62x54R LPS",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 2,
        "hourProfit": 27269.14,
        "profit": 190884,
        "timestamp": 1753065000000,
        "hourRank": 9,
        "totalRank": 11
      },
      {
        "objectID": 37130500001,
        "objectName": "5.8x42mm DVC12",
        "placeType": "workbench",
        "placeName": "工作台",
        "level": 3,
        "hourProfit": 27243.63,
        "profit": 217949,
        "timestamp": 1753065000000,
        "hourRank": 10,
        "totalRank": 6
      }
    ],
    "total": 59,
    "currentTime": "2025-07-21T02:31:04.799Z"
  },
  "message": "利润排行榜获取成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 利润排行榜 V2 (最高利润)

GET /df/place/profitRank/v2

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|place|query|array[string]| 否 |place: 场所类型 (可选)（不选默认所有场所前limit）|
|type|query|string| 否 |类型（hour小时利润，total总利润）|
|limit|query|string| 否 |数量限制|
|id|query|string| 否 |指定制造物品（可选）|
|Authorization|header|string| 否 |none|

#### 详细说明

**place**: place: 场所类型 (可选)（不选默认所有场所前limit）
storage: 仓库
control: 指挥中心
workbench: 工作台
tech: 技术中心
shoot: 靶场
training: 训练中心
pharmacy: 制药台
armory: 防具台

> 返回示例

```json
{
  "success": true,
  "data": {
    "place": "all",
    "groups": {
      "workbench": [
        {
          "objectID": 37170500001,
          "objectName": "7.62x51mm M62",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 582000,
            "bestSaleTime": 1753063200000,
            "minCost": 251749,
            "minCostTime": 1752957000000,
            "profit": 330251,
            "hourProfit": 41281.375,
            "fee": 58200,
            "bail": 17460,
            "profitRank": 1,
            "hourProfitRank": 1
          },
          "yesterday": {
            "bestSalePrice": 574440,
            "bestSaleTime": 1752957000000,
            "minCost": 251749,
            "minCostTime": 1752957000000,
            "profit": 322691,
            "hourProfit": 40336.375,
            "fee": 57444,
            "bail": 17233,
            "profitRank": 4,
            "hourProfitRank": 5
          }
        },
        {
          "objectID": 37140500001,
          "objectName": "9x39mm BP",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 491040,
            "bestSaleTime": 1753063200000,
            "minCost": 162130,
            "minCostTime": 1752957000000,
            "profit": 328910,
            "hourProfit": 41113.75,
            "fee": 49595,
            "bail": 14731,
            "profitRank": 2,
            "hourProfitRank": 2
          },
          "yesterday": {
            "bestSalePrice": 498840,
            "bestSaleTime": 1752957000000,
            "minCost": 162130,
            "minCostTime": 1752957000000,
            "profit": 336710,
            "hourProfit": 42088.75,
            "fee": 50382,
            "bail": 14965,
            "profitRank": 2,
            "hourProfitRank": 2
          }
        },
        {
          "objectID": 37100500001,
          "objectName": "5.56x45mm M995",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 485280,
            "bestSaleTime": 1753063200000,
            "minCost": 163356,
            "minCostTime": 1752957000000,
            "profit": 321924,
            "hourProfit": 40240.5,
            "fee": 54788,
            "bail": 14558,
            "profitRank": 3,
            "hourProfitRank": 3
          },
          "yesterday": {
            "bestSalePrice": 488400,
            "bestSaleTime": 1752971400000,
            "minCost": 163356,
            "minCostTime": 1752957000000,
            "profit": 325044,
            "hourProfit": 40630.5,
            "fee": 48840,
            "bail": 14652,
            "profitRank": 3,
            "hourProfitRank": 4
          }
        },
        {
          "objectID": 37210400001,
          "objectName": "5.7x28mm SS193",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 2,
          "today": {
            "bestSalePrice": 342000,
            "bestSaleTime": 1753063200000,
            "minCost": 68949,
            "minCostTime": 1752957000000,
            "profit": 273051,
            "hourProfit": 39007.28571428572,
            "fee": 34200,
            "bail": 10260,
            "profitRank": 8,
            "hourProfitRank": 4
          },
          "yesterday": {
            "bestSalePrice": 350820,
            "bestSaleTime": 1752982200000,
            "minCost": 68949,
            "minCostTime": 1752957000000,
            "profit": 281871,
            "hourProfit": 40267.28571428572,
            "fee": 35082,
            "bail": 10524,
            "profitRank": 9,
            "hourProfitRank": 6
          }
        },
        {
          "objectID": 37130500001,
          "objectName": "5.8x42mm DVC12",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 493200,
            "bestSaleTime": 1753063200000,
            "minCost": 181481,
            "minCostTime": 1752957000000,
            "profit": 311719,
            "hourProfit": 38964.875,
            "fee": 55682,
            "bail": 14796,
            "profitRank": 4,
            "hourProfitRank": 5
          },
          "yesterday": {
            "bestSalePrice": 499920,
            "bestSaleTime": 1752971400000,
            "minCost": 181481,
            "minCostTime": 1752957000000,
            "profit": 318439,
            "hourProfit": 39804.875,
            "fee": 56440,
            "bail": 14997,
            "profitRank": 5,
            "hourProfitRank": 7
          }
        },
        {
          "objectID": 37140400001,
          "objectName": "9x39mm SP6",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 2,
          "today": {
            "bestSalePrice": 353880,
            "bestSaleTime": 1753063200000,
            "minCost": 87192,
            "minCostTime": 1752957000000,
            "profit": 266688,
            "hourProfit": 38098.28571428572,
            "fee": 39953,
            "bail": 10616,
            "profitRank": 9,
            "hourProfitRank": 6
          },
          "yesterday": {
            "bestSalePrice": 360720,
            "bestSaleTime": 1752982200000,
            "minCost": 87192,
            "minCostTime": 1752957000000,
            "profit": 273528,
            "hourProfit": 39075.42857142857,
            "fee": 40725,
            "bail": 10821,
            "profitRank": 10,
            "hourProfitRank": 8
          }
        },
        {
          "objectID": 37260500001,
          "objectName": "4.6x30mm AP SX",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 468750,
            "bestSaleTime": 1753063200000,
            "minCost": 165328,
            "minCostTime": 1752957000000,
            "profit": 303422,
            "hourProfit": 37927.75,
            "fee": 52921,
            "bail": 14062,
            "profitRank": 5,
            "hourProfitRank": 7
          },
          "yesterday": {
            "bestSalePrice": 504600,
            "bestSaleTime": 1752964200000,
            "minCost": 165328,
            "minCostTime": 1752957000000,
            "profit": 339272,
            "hourProfit": 42409,
            "fee": 50460,
            "bail": 15138,
            "profitRank": 1,
            "hourProfitRank": 1
          }
        },
        {
          "objectID": 37130400001,
          "objectName": "5.8x42mm DBP10",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 2,
          "today": {
            "bestSalePrice": 343980,
            "bestSaleTime": 1753063200000,
            "minCost": 80500,
            "minCostTime": 1752957000000,
            "profit": 263480,
            "hourProfit": 37640,
            "fee": 38835,
            "bail": 10319,
            "profitRank": 10,
            "hourProfitRank": 8
          },
          "yesterday": {
            "bestSalePrice": 369360,
            "bestSaleTime": 1752982200000,
            "minCost": 80500,
            "minCostTime": 1752957000000,
            "profit": 288860,
            "hourProfit": 41265.71428571428,
            "fee": 36936,
            "bail": 11080,
            "profitRank": 8,
            "hourProfitRank": 3
          }
        },
        {
          "objectID": 37150400001,
          "objectName": "6.8x51mm FMJ",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 2,
          "today": {
            "bestSalePrice": 374400,
            "bestSaleTime": 1753063200000,
            "minCost": 111878,
            "minCostTime": 1752957000000,
            "profit": 262522,
            "hourProfit": 37503.142857142855,
            "fee": 42269,
            "bail": 11232,
            "profitRank": 11,
            "hourProfitRank": 9
          },
          "yesterday": {
            "bestSalePrice": 381960,
            "bestSaleTime": 1752982200000,
            "minCost": 111878,
            "minCostTime": 1752957000000,
            "profit": 270082,
            "hourProfit": 38583.142857142855,
            "fee": 43123,
            "bail": 11458,
            "profitRank": 13,
            "hourProfitRank": 11
          }
        },
        {
          "objectID": 37280500001,
          "objectName": ".300BLK",
          "placeType": "workbench",
          "placeName": "工作台",
          "level": 3,
          "today": {
            "bestSalePrice": 472800,
            "bestSaleTime": 1753065000000,
            "minCost": 178888,
            "minCostTime": 1752957000000,
            "profit": 293912,
            "hourProfit": 36739,
            "fee": 47280,
            "bail": 14184,
            "profitRank": 6,
            "hourProfitRank": 10
          },
          "yesterday": {
            "bestSalePrice": 488160,
            "bestSaleTime": 1752957000000,
            "minCost": 178888,
            "minCostTime": 1752957000000,
            "profit": 309272,
            "hourProfit": 38659,
            "fee": 48816,
            "bail": 14644,
            "profitRank": 6,
            "hourProfitRank": 10
          }
        }
      ],
      "tech": [
        {
          "objectID": 13140000034,
          "objectName": "共振人体工程握把",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 3,
          "today": {
            "bestSalePrice": 75170,
            "bestSaleTime": 1753063200000,
            "minCost": 43483,
            "minCostTime": 1752969600000,
            "profit": 31687,
            "hourProfit": 7921.75,
            "fee": 7517,
            "bail": 2255,
            "profitRank": 19,
            "hourProfitRank": 1
          },
          "yesterday": {
            "bestSalePrice": 76696,
            "bestSaleTime": 1752975000000,
            "minCost": 43483,
            "minCostTime": 1752969600000,
            "profit": 33213,
            "hourProfit": 8303.25,
            "fee": 7669,
            "bail": 2300,
            "profitRank": 20,
            "hourProfitRank": 1
          }
        },
        {
          "objectID": 13140000039,
          "objectName": "共振二代前握把",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 2,
          "today": {
            "bestSalePrice": 76096,
            "bestSaleTime": 1753063200000,
            "minCost": 45890,
            "minCostTime": 1752969600000,
            "profit": 30206,
            "hourProfit": 7551.5,
            "fee": 8591,
            "bail": 2282,
            "profitRank": 21,
            "hourProfitRank": 2
          },
          "yesterday": {
            "bestSalePrice": 78113,
            "bestSaleTime": 1752982200000,
            "minCost": 45890,
            "minCostTime": 1752969600000,
            "profit": 32223,
            "hourProfit": 8055.75,
            "fee": 8818,
            "bail": 2343,
            "profitRank": 21,
            "hourProfitRank": 2
          }
        },
        {
          "objectID": 13160000014,
          "objectName": "OLIGHT Baldr Pro R多功能手电",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 2,
          "today": {
            "bestSalePrice": 157212,
            "bestSaleTime": 1753065000000,
            "minCost": 126922,
            "minCostTime": 1752969600000,
            "profit": 30290,
            "hourProfit": 6731.111111111111,
            "fee": 15721,
            "bail": 4716,
            "profitRank": 20,
            "hourProfitRank": 3
          },
          "yesterday": {
            "bestSalePrice": 153092,
            "bestSaleTime": 1752957000000,
            "minCost": 126922,
            "minCostTime": 1752969600000,
            "profit": 26170,
            "hourProfit": 5815.555555555556,
            "fee": 15309,
            "bail": 4592,
            "profitRank": 34,
            "hourProfitRank": 11
          }
        },
        {
          "objectID": 13040000007,
          "objectName": "影袭导轨枪托",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 3,
          "today": {
            "bestSalePrice": 77518,
            "bestSaleTime": 1753063200000,
            "minCost": 40605,
            "minCostTime": 1752969600000,
            "profit": 36913,
            "hourProfit": 6152.166666666667,
            "fee": 7984,
            "bail": 2325,
            "profitRank": 11,
            "hourProfitRank": 4
          },
          "yesterday": {
            "bestSalePrice": 78522,
            "bestSaleTime": 1752982200000,
            "minCost": 40605,
            "minCostTime": 1752969600000,
            "profit": 37917,
            "hourProfit": 6319.5,
            "fee": 8166,
            "bail": 2355,
            "profitRank": 15,
            "hourProfitRank": 8
          }
        },
        {
          "objectID": 13110000073,
          "objectName": "视点3倍瞄准镜",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 3,
          "today": {
            "bestSalePrice": 67039,
            "bestSaleTime": 1753065000000,
            "minCost": 30397,
            "minCostTime": 1752969600000,
            "profit": 36642,
            "hourProfit": 6107,
            "fee": 7568,
            "bail": 2011,
            "profitRank": 12,
            "hourProfitRank": 5
          },
          "yesterday": {
            "bestSalePrice": 68864,
            "bestSaleTime": 1752982200000,
            "minCost": 30397,
            "minCostTime": 1752969600000,
            "profit": 38467,
            "hourProfit": 6411.166666666667,
            "fee": 7774,
            "bail": 2065,
            "profitRank": 13,
            "hourProfitRank": 6
          }
        },
        {
          "objectID": 13130000168,
          "objectName": "沙暴垂直补偿器",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 2,
          "today": {
            "bestSalePrice": 78809,
            "bestSaleTime": 1753063200000,
            "minCost": 36973,
            "minCostTime": 1752969600000,
            "profit": 41836,
            "hourProfit": 5976.571428571428,
            "fee": 8117,
            "bail": 2364,
            "profitRank": 8,
            "hourProfitRank": 6
          },
          "yesterday": {
            "bestSalePrice": 80112,
            "bestSaleTime": 1752960600000,
            "minCost": 36973,
            "minCostTime": 1752969600000,
            "profit": 43139,
            "hourProfit": 6162.714285714285,
            "fee": 8251,
            "bail": 2403,
            "profitRank": 8,
            "hourProfitRank": 9
          }
        },
        {
          "objectID": 13040000183,
          "objectName": "MRGS镂空枪托",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 3,
          "today": {
            "bestSalePrice": 74752,
            "bestSaleTime": 1753063200000,
            "minCost": 39465,
            "minCostTime": 1752969600000,
            "profit": 35287,
            "hourProfit": 5881.166666666667,
            "fee": 8439,
            "bail": 2242,
            "profitRank": 14,
            "hourProfitRank": 7
          },
          "yesterday": {
            "bestSalePrice": 77451,
            "bestSaleTime": 1752969600000,
            "minCost": 39465,
            "minCostTime": 1752969600000,
            "profit": 37986,
            "hourProfit": 6331,
            "fee": 8744,
            "bail": 2323,
            "profitRank": 14,
            "hourProfitRank": 7
          }
        },
        {
          "objectID": 13370000001,
          "objectName": "蜂网遮光罩",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 1,
          "today": {
            "bestSalePrice": 92764,
            "bestSaleTime": 1753063200000,
            "minCost": 68327,
            "minCostTime": 1752969600000,
            "profit": 24437,
            "hourProfit": 5430.444444444444,
            "fee": 9276,
            "bail": 2782,
            "profitRank": 28,
            "hourProfitRank": 8
          },
          "yesterday": {
            "bestSalePrice": 97972,
            "bestSaleTime": 1752969600000,
            "minCost": 68327,
            "minCostTime": 1752969600000,
            "profit": 29645,
            "hourProfit": 6587.777777777777,
            "fee": 9895,
            "bail": 2939,
            "profitRank": 28,
            "hourProfitRank": 5
          }
        },
        {
          "objectID": 13130000164,
          "objectName": "轻语战术消音器",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 3,
          "today": {
            "bestSalePrice": 75162,
            "bestSaleTime": 1753063200000,
            "minCost": 40249,
            "minCostTime": 1752969600000,
            "profit": 34913,
            "hourProfit": 4987.571428571428,
            "fee": 7741,
            "bail": 2254,
            "profitRank": 15,
            "hourProfitRank": 9
          },
          "yesterday": {
            "bestSalePrice": 80034,
            "bestSaleTime": 1752969600000,
            "minCost": 40249,
            "minCostTime": 1752969600000,
            "profit": 39785,
            "hourProfit": 5683.571428571428,
            "fee": 8243,
            "bail": 2401,
            "profitRank": 12,
            "hourProfitRank": 13
          }
        },
        {
          "objectID": 13130000169,
          "objectName": "死寂消音器",
          "placeType": "tech",
          "placeName": "技术中心",
          "level": 2,
          "today": {
            "bestSalePrice": 71357,
            "bestSaleTime": 1753063200000,
            "minCost": 37803,
            "minCostTime": 1752969600000,
            "profit": 33554,
            "hourProfit": 4793.428571428572,
            "fee": 7135,
            "bail": 2140,
            "profitRank": 17,
            "hourProfitRank": 10
          },
          "yesterday": {
            "bestSalePrice": 71630,
            "bestSaleTime": 1752964200000,
            "minCost": 37803,
            "minCostTime": 1752969600000,
            "profit": 33827,
            "hourProfit": 4832.428571428572,
            "fee": 7163,
            "bail": 2148,
            "profitRank": 19,
            "hourProfitRank": 19
          }
        }
      ],
      "pharmacy": [
        {
          "objectID": 14060000004,
          "objectName": "高级护甲维修组合",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 3,
          "today": {
            "bestSalePrice": 568625,
            "bestSaleTime": 1753063200000,
            "minCost": 472965,
            "minCostTime": 1752964200000,
            "profit": 95660,
            "hourProfit": 11957.5,
            "fee": 57431,
            "bail": 17058,
            "profitRank": 1,
            "hourProfitRank": 1
          },
          "yesterday": {
            "bestSalePrice": 574204,
            "bestSaleTime": 1752960600000,
            "minCost": 472965,
            "minCostTime": 1752964200000,
            "profit": 101239,
            "hourProfit": 12654.875,
            "fee": 57994,
            "bail": 17226,
            "profitRank": 1,
            "hourProfitRank": 1
          }
        },
        {
          "objectID": 14020000006,
          "objectName": "战地医疗箱",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 2,
          "today": {
            "bestSalePrice": 122758,
            "bestSaleTime": 1753063200000,
            "minCost": 46985,
            "minCostTime": 1752969600000,
            "profit": 75773,
            "hourProfit": 9471.625,
            "fee": 12644,
            "bail": 3682,
            "profitRank": 2,
            "hourProfitRank": 2
          },
          "yesterday": {
            "bestSalePrice": 118791,
            "bestSaleTime": 1752971400000,
            "minCost": 46985,
            "minCostTime": 1752969600000,
            "profit": 71806,
            "hourProfit": 8975.75,
            "fee": 12116,
            "bail": 3563,
            "profitRank": 2,
            "hourProfitRank": 2
          }
        },
        {
          "objectID": 14060000002,
          "objectName": "精密护甲维修包",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 2,
          "today": {
            "bestSalePrice": 212072,
            "bestSaleTime": 1753063200000,
            "minCost": 152750,
            "minCostTime": 1752969600000,
            "profit": 59322,
            "hourProfit": 7415.25,
            "fee": 21207,
            "bail": 6362,
            "profitRank": 3,
            "hourProfitRank": 3
          },
          "yesterday": {
            "bestSalePrice": 215386,
            "bestSaleTime": 1752960600000,
            "minCost": 152750,
            "minCostTime": 1752969600000,
            "profit": 62636,
            "hourProfit": 7829.5,
            "fee": 21753,
            "bail": 6461,
            "profitRank": 3,
            "hourProfitRank": 3
          }
        },
        {
          "objectID": 14060000001,
          "objectName": "精密头盔维修包",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 2,
          "today": {
            "bestSalePrice": 154879,
            "bestSaleTime": 1753063200000,
            "minCost": 101215,
            "minCostTime": 1752969600000,
            "profit": 53664,
            "hourProfit": 6708,
            "fee": 17485,
            "bail": 4646,
            "profitRank": 4,
            "hourProfitRank": 4
          },
          "yesterday": {
            "bestSalePrice": 159400,
            "bestSaleTime": 1752969600000,
            "minCost": 101215,
            "minCostTime": 1752969600000,
            "profit": 58185,
            "hourProfit": 7273.125,
            "fee": 15940,
            "bail": 4782,
            "profitRank": 4,
            "hourProfitRank": 4
          }
        },
        {
          "objectID": 14070000008,
          "objectName": "OE2战斗兴奋剂",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 1,
          "today": {
            "bestSalePrice": 23660,
            "bestSaleTime": 1753065000000,
            "minCost": 8095,
            "minCostTime": 1752960600000,
            "profit": 15565,
            "hourProfit": 1297.0833333333333,
            "fee": 2366,
            "bail": 709,
            "profitRank": 5,
            "hourProfitRank": 5
          },
          "yesterday": {
            "bestSalePrice": 24161,
            "bestSaleTime": 1752982200000,
            "minCost": 8095,
            "minCostTime": 1752960600000,
            "profit": 16066,
            "hourProfit": 1338.8333333333333,
            "fee": 2416,
            "bail": 724,
            "profitRank": 5,
            "hourProfitRank": 5
          }
        },
        {
          "objectID": 14070000006,
          "objectName": "体能激活针",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 1,
          "today": {
            "bestSalePrice": 23430,
            "bestSaleTime": 1753063200000,
            "minCost": 10009,
            "minCostTime": 1752971400000,
            "profit": 13421,
            "hourProfit": 1118.4166666666667,
            "fee": 2343,
            "bail": 702,
            "profitRank": 6,
            "hourProfitRank": 6
          },
          "yesterday": {
            "bestSalePrice": 23481,
            "bestSaleTime": 1752971400000,
            "minCost": 10009,
            "minCostTime": 1752971400000,
            "profit": 13472,
            "hourProfit": 1122.6666666666667,
            "fee": 2348,
            "bail": 704,
            "profitRank": 6,
            "hourProfitRank": 6
          }
        },
        {
          "objectID": 14070000004,
          "objectName": "感知激活针",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 1,
          "today": {
            "bestSalePrice": 17259,
            "bestSaleTime": 1753063200000,
            "minCost": 7334,
            "minCostTime": 1752971400000,
            "profit": 9925,
            "hourProfit": 827.0833333333334,
            "fee": 1743,
            "bail": 517,
            "profitRank": 7,
            "hourProfitRank": 7
          },
          "yesterday": {
            "bestSalePrice": 17768,
            "bestSaleTime": 1752971400000,
            "minCost": 7334,
            "minCostTime": 1752971400000,
            "profit": 10434,
            "hourProfit": 869.5,
            "fee": 1794,
            "bail": 533,
            "profitRank": 7,
            "hourProfitRank": 7
          }
        },
        {
          "objectID": 14070000001,
          "objectName": "M1肌肉强化针",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 1,
          "today": {
            "bestSalePrice": 8332,
            "bestSaleTime": 1753063200000,
            "minCost": 6077,
            "minCostTime": 1752971400000,
            "profit": 2255,
            "hourProfit": 187.91666666666666,
            "fee": 940,
            "bail": 249,
            "profitRank": 8,
            "hourProfitRank": 8
          },
          "yesterday": {
            "bestSalePrice": 12811,
            "bestSaleTime": 1752971400000,
            "minCost": 6077,
            "minCostTime": 1752971400000,
            "profit": 6734,
            "hourProfit": 561.1666666666666,
            "fee": 1319,
            "bail": 384,
            "profitRank": 8,
            "hourProfitRank": 8
          }
        },
        {
          "objectID": 14070000009,
          "objectName": "去甲肾上腺素",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 1,
          "today": {
            "bestSalePrice": 5715,
            "bestSaleTime": 1753063200000,
            "minCost": 3488,
            "minCostTime": 1752971400000,
            "profit": 2227,
            "hourProfit": 185.58333333333334,
            "fee": 666,
            "bail": 171,
            "profitRank": 9,
            "hourProfitRank": 9
          },
          "yesterday": {
            "bestSalePrice": 6150,
            "bestSaleTime": 1752957000000,
            "minCost": 3488,
            "minCostTime": 1752971400000,
            "profit": 2662,
            "hourProfit": 221.83333333333334,
            "fee": 694,
            "bail": 184,
            "profitRank": 9,
            "hourProfitRank": 9
          }
        },
        {
          "objectID": 14060000003,
          "objectName": "高级头盔维修组合",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 3,
          "today": {
            "bestSalePrice": 307634,
            "bestSaleTime": 1753063200000,
            "minCost": 444694,
            "minCostTime": 1752960600000,
            "profit": -137060,
            "hourProfit": -17132.5,
            "fee": 34731,
            "bail": 9229,
            "profitRank": 10,
            "hourProfitRank": 10
          },
          "yesterday": {
            "bestSalePrice": 324337,
            "bestSaleTime": 1752971400000,
            "minCost": 444694,
            "minCostTime": 1752960600000,
            "profit": -120357,
            "hourProfit": -15044.625,
            "fee": 32433,
            "bail": 9730,
            "profitRank": 10,
            "hourProfitRank": 10
          }
        }
      ],
      "armory": [
        {
          "objectID": 11050005001,
          "objectName": "精英防弹背心",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 348116,
            "bestSaleTime": 1753063200000,
            "minCost": 112439,
            "minCostTime": 1752969600000,
            "profit": 235677,
            "hourProfit": 29459.625,
            "fee": 39302,
            "bail": 10443,
            "profitRank": 1,
            "hourProfitRank": 1
          },
          "yesterday": {
            "bestSalePrice": 353998,
            "bestSaleTime": 1752971400000,
            "minCost": 112439,
            "minCostTime": 1752969600000,
            "profit": 241559,
            "hourProfit": 30194.875,
            "fee": 39966,
            "bail": 10619,
            "profitRank": 3,
            "hourProfitRank": 3
          }
        },
        {
          "objectID": 11050005003,
          "objectName": "FS复合防弹衣",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 379232,
            "bestSaleTime": 1753063200000,
            "minCost": 146632,
            "minCostTime": 1752969600000,
            "profit": 232600,
            "hourProfit": 29075,
            "fee": 44256,
            "bail": 11376,
            "profitRank": 2,
            "hourProfitRank": 2
          },
          "yesterday": {
            "bestSalePrice": 392528,
            "bestSaleTime": 1752969600000,
            "minCost": 146632,
            "minCostTime": 1752969600000,
            "profit": 245896,
            "hourProfit": 30737,
            "fee": 45808,
            "bail": 11775,
            "profitRank": 2,
            "hourProfitRank": 2
          }
        },
        {
          "objectID": 11050005004,
          "objectName": "重型突击背心",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 409901,
            "bestSaleTime": 1753063200000,
            "minCost": 178538,
            "minCostTime": 1752969600000,
            "profit": 231363,
            "hourProfit": 28920.375,
            "fee": 46277,
            "bail": 12297,
            "profitRank": 3,
            "hourProfitRank": 3
          },
          "yesterday": {
            "bestSalePrice": 425803,
            "bestSaleTime": 1752960600000,
            "minCost": 178538,
            "minCostTime": 1752969600000,
            "profit": 247265,
            "hourProfit": 30908.125,
            "fee": 48073,
            "bail": 12774,
            "profitRank": 1,
            "hourProfitRank": 1
          }
        },
        {
          "objectID": 11050005002,
          "objectName": "Hvk-2防弹衣",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 357778,
            "bestSaleTime": 1753063200000,
            "minCost": 143124,
            "minCostTime": 1752969600000,
            "profit": 214654,
            "hourProfit": 26831.75,
            "fee": 40393,
            "bail": 10733,
            "profitRank": 4,
            "hourProfitRank": 4
          },
          "yesterday": {
            "bestSalePrice": 370183,
            "bestSaleTime": 1752971400000,
            "minCost": 143124,
            "minCostTime": 1752969600000,
            "profit": 227059,
            "hourProfit": 28382.375,
            "fee": 41793,
            "bail": 11105,
            "profitRank": 4,
            "hourProfitRank": 4
          }
        },
        {
          "objectID": 11010005003,
          "objectName": "DICH-1战术头盔",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 284212,
            "bestSaleTime": 1753063200000,
            "minCost": 112439,
            "minCostTime": 1752969600000,
            "profit": 171773,
            "hourProfit": 21471.625,
            "fee": 33167,
            "bail": 8526,
            "profitRank": 5,
            "hourProfitRank": 5
          },
          "yesterday": {
            "bestSalePrice": 292190,
            "bestSaleTime": 1752969600000,
            "minCost": 112439,
            "minCostTime": 1752969600000,
            "profit": 179751,
            "hourProfit": 22468.875,
            "fee": 34098,
            "bail": 8765,
            "profitRank": 5,
            "hourProfitRank": 5
          }
        },
        {
          "objectID": 11010005004,
          "objectName": "GN 重型头盔",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 258876,
            "bestSaleTime": 1753063200000,
            "minCost": 107225,
            "minCostTime": 1752969600000,
            "profit": 151651,
            "hourProfit": 18956.375,
            "fee": 30210,
            "bail": 7766,
            "profitRank": 6,
            "hourProfitRank": 6
          },
          "yesterday": {
            "bestSalePrice": 265024,
            "bestSaleTime": 1752964200000,
            "minCost": 107225,
            "minCostTime": 1752969600000,
            "profit": 157799,
            "hourProfit": 19724.875,
            "fee": 30928,
            "bail": 7950,
            "profitRank": 6,
            "hourProfitRank": 6
          }
        },
        {
          "objectID": 11010005002,
          "objectName": "H09 防暴头盔",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 219037,
            "bestSaleTime": 1753065000000,
            "minCost": 99071,
            "minCostTime": 1752969600000,
            "profit": 119966,
            "hourProfit": 14995.75,
            "fee": 26678,
            "bail": 6571,
            "profitRank": 8,
            "hourProfitRank": 7
          },
          "yesterday": {
            "bestSalePrice": 229455,
            "bestSaleTime": 1752982200000,
            "minCost": 99071,
            "minCostTime": 1752969600000,
            "profit": 130384,
            "hourProfit": 16298,
            "fee": 26777,
            "bail": 6883,
            "profitRank": 9,
            "hourProfitRank": 8
          }
        },
        {
          "objectID": 11010005009,
          "objectName": "GN 重型夜视头盔",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 372800,
            "bestSaleTime": 1753063200000,
            "minCost": 255343,
            "minCostTime": 1752969600000,
            "profit": 117457,
            "hourProfit": 14682.125,
            "fee": 43505,
            "bail": 11184,
            "profitRank": 9,
            "hourProfitRank": 8
          },
          "yesterday": {
            "bestSalePrice": 388212,
            "bestSaleTime": 1752971400000,
            "minCost": 255343,
            "minCostTime": 1752969600000,
            "profit": 132869,
            "hourProfit": 16608.625,
            "fee": 43829,
            "bail": 11646,
            "profitRank": 8,
            "hourProfitRank": 7
          }
        },
        {
          "objectID": 11080005004,
          "objectName": "GT5野战背包",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 145021,
            "bestSaleTime": 1753065000000,
            "minCost": 42840,
            "minCostTime": 1752969600000,
            "profit": 102181,
            "hourProfit": 12772.625,
            "fee": 16372,
            "bail": 4350,
            "profitRank": 12,
            "hourProfitRank": 9
          },
          "yesterday": {
            "bestSalePrice": 151079,
            "bestSaleTime": 1752982200000,
            "minCost": 42840,
            "minCostTime": 1752969600000,
            "profit": 108239,
            "hourProfit": 13529.875,
            "fee": 17056,
            "bail": 4532,
            "profitRank": 10,
            "hourProfitRank": 9
          }
        },
        {
          "objectID": 11010005001,
          "objectName": "Mask-1铁壁头盔",
          "placeType": "armory",
          "placeName": "防具台",
          "level": 2,
          "today": {
            "bestSalePrice": 167898,
            "bestSaleTime": 1753065000000,
            "minCost": 76434,
            "minCostTime": 1752969600000,
            "profit": 91464,
            "hourProfit": 11433,
            "fee": 19593,
            "bail": 5036,
            "profitRank": 15,
            "hourProfitRank": 10
          },
          "yesterday": {
            "bestSalePrice": 174369,
            "bestSaleTime": 1752982200000,
            "minCost": 76434,
            "minCostTime": 1752969600000,
            "profit": 97935,
            "hourProfit": 12241.875,
            "fee": 20348,
            "bail": 5231,
            "profitRank": 13,
            "hourProfitRank": 10
          }
        }
      ]
    },
    "currentTime": "2025-07-21T02:33:20.563Z"
  },
  "message": "最高利润排行榜获取成功"
}
```

```json
{
  "success": true,
  "data": {
    "place": "all",
    "groups": {
      "pharmacy": [
        {
          "objectID": 14060000002,
          "objectName": "精密护甲维修包",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "level": 2,
          "today": {
            "bestSalePrice": 212072,
            "bestSaleTime": 1753063200000,
            "minCost": 152750,
            "minCostTime": 1752969600000,
            "profit": 59322,
            "hourProfit": 7415.25,
            "fee": 21207,
            "bail": 6362,
            "profitRank": 1,
            "hourProfitRank": 1
          },
          "yesterday": {
            "bestSalePrice": 215386,
            "bestSaleTime": 1752960600000,
            "minCost": 152750,
            "minCostTime": 1752969600000,
            "profit": 62636,
            "hourProfit": 7829.5,
            "fee": 21753,
            "bail": 6461,
            "profitRank": 1,
            "hourProfitRank": 1
          }
        }
      ]
    },
    "currentTime": "2025-07-21T02:33:01.823Z"
  },
  "message": "最高利润排行榜获取成功"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» place|string|true|none||none|
|»» groups|object|true|none||none|
|»»» workbench|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» placeType|string|true|none||none|
|»»»» placeName|string|true|none||none|
|»»»» level|integer|true|none||none|
|»»»» today|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»»» yesterday|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»» tech|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» placeType|string|true|none||none|
|»»»» placeName|string|true|none||none|
|»»»» level|integer|true|none||none|
|»»»» today|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»»» yesterday|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»» pharmacy|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» placeType|string|true|none||none|
|»»»» placeName|string|true|none||none|
|»»»» level|integer|true|none||none|
|»»»» today|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»»» yesterday|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»» armory|[object]|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» placeType|string|true|none||none|
|»»»» placeName|string|true|none||none|
|»»»» level|integer|true|none||none|
|»»»» today|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»»»» yesterday|object|true|none||none|
|»»»»» bestSalePrice|integer|true|none||none|
|»»»»» bestSaleTime|integer|true|none||none|
|»»»»» minCost|integer|true|none||none|
|»»»»» minCostTime|integer|true|none||none|
|»»»»» profit|integer|true|none||none|
|»»»»» hourProfit|number|true|none||none|
|»»»»» fee|integer|true|none||none|
|»»»»» bail|integer|true|none||none|
|»»»»» profitRank|integer|true|none||none|
|»»»»» hourProfitRank|integer|true|none||none|
|»» currentTime|string|true|none||none|
|» message|string|true|none||none|

# 业务/person

## GET 特勤处状态

GET /df/place/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "places": [
      {
        "id": "1007",
        "status": "闲置中",
        "level": 3,
        "name": "LOC_SafeHouseDevice,1007_Name",
        "placeType": "workbench",
        "placeName": "工作台",
        "objectDetail": null
      },
      {
        "id": "1005",
        "status": "生产210505004中——倒计时21076\n",
        "level": 3,
        "name": "LOC_SafeHouseDevice,1005_Name",
        "placeType": "armory",
        "placeName": "防具台",
        "leftTime": 21076,
        "pushTime": 1753086466,
        "objectId": 11050005004,
        "objectDetail": {
          "id": 10790,
          "objectID": 11050005004,
          "objectName": "重型突击背心",
          "length": 4,
          "width": 4,
          "grade": 5,
          "weight": "9.83",
          "primaryClass": "protect",
          "secondClass": "armor",
          "secondClassCN": "护甲",
          "desc": "GTI研发部门对全包围防护装甲的初代实验产品，符合5级防弹标准，同时会严重影响穿戴者的移动速度和武器操控性。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/11050005004.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_11050005004.png",
          "avgPrice": 389347,
          "protectDetail": {
            "durability": 125,
            "protectLevel": 5,
            "aimSpeed": {
              "percent": -10,
              "batteryValue": 4,
              "batteryColor": "red"
            },
            "moveSpeed": {
              "percent": -5,
              "batteryValue": 2,
              "batteryColor": "red"
            },
            "repairEfficiency": "中",
            "protectArea": "胸部,腹部,肩部",
            "durableLoss": "中"
          }
        }
      },
      {
        "id": "1006",
        "status": "生产240700008中——倒计时35464\n",
        "level": 3,
        "name": "LOC_SafeHouseDevice,1006_Name",
        "placeType": "pharmacy",
        "placeName": "制药台",
        "leftTime": 35464,
        "pushTime": 1753100854,
        "objectId": 14070000008,
        "objectDetail": {
          "id": 10084,
          "objectID": 14070000008,
          "objectName": "OE2战斗兴奋剂",
          "length": 1,
          "width": 1,
          "grade": 3,
          "weight": "0.1",
          "primaryClass": "props",
          "secondClass": "consume",
          "secondClassCN": "消耗品",
          "thirdClass": "inject",
          "thirdClassCN": "针剂",
          "desc": "在紧急情况用于回复体力的注射剂，能在短时间内回复大量体力，单次使用。",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000008.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000008.png",
          "avgPrice": 23660,
          "propsDetail": {
            "activeTime": "3"
          }
        }
      },
      {
        "id": "1002",
        "status": "生产231600010中——倒计时8451\n",
        "level": 3,
        "name": "LOC_SafeHouseDevice,1002_Name",
        "placeType": "tech",
        "placeName": "技术中心",
        "leftTime": 8451,
        "pushTime": 1753073841,
        "objectId": 13160000010,
        "objectDetail": {
          "id": 10461,
          "objectID": 13160000010,
          "objectName": "DBAL-X2紫色激光镭指",
          "length": 1,
          "width": 1,
          "grade": 4,
          "weight": "0.2",
          "primaryClass": "acc",
          "secondClass": "accFunctional",
          "secondClassCN": "功能性配件",
          "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13160000010.png",
          "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13160000010.png",
          "avgPrice": 22907,
          "accDetail": {
            "controlSpeed": -4,
            "quickSeparate": 1,
            "advantage": {
              "condition": "开启激光镭指时",
              "effectList": [
                {
                  "value": "操控速度",
                  "batteryValue": 4,
                  "batteryColor": "green"
                },
                {
                  "value": "腰际射击精度",
                  "batteryValue": 4,
                  "batteryColor": "green"
                },
                {
                  "value": "允许战术据枪姿态",
                  "batteryValue": 4,
                  "batteryColor": "green"
                }
              ]
            },
            "disadvantage": {
              "condition": "关闭激光镭指时",
              "effectList": [
                {
                  "value": "激光镭射开启时敌人可见",
                  "batteryValue": -4,
                  "batteryColor": "red"
                },
                {
                  "value": "操控速度",
                  "batteryValue": -2,
                  "batteryColor": "red"
                }
              ]
            }
          }
        }
      }
    ],
    "placeGroups": {
      "workbench": [
        {
          "id": "1007",
          "status": "闲置中",
          "level": 3,
          "name": "LOC_SafeHouseDevice,1007_Name",
          "placeType": "workbench",
          "placeName": "工作台",
          "objectDetail": null
        }
      ],
      "armory": [
        {
          "id": "1005",
          "status": "生产210505004中——倒计时21076\n",
          "level": 3,
          "name": "LOC_SafeHouseDevice,1005_Name",
          "placeType": "armory",
          "placeName": "防具台",
          "leftTime": 21076,
          "pushTime": 1753086466,
          "objectId": 11050005004,
          "objectDetail": {
            "id": 10790,
            "objectID": 11050005004,
            "objectName": "重型突击背心",
            "length": 4,
            "width": 4,
            "grade": 5,
            "weight": "9.83",
            "primaryClass": "protect",
            "secondClass": "armor",
            "secondClassCN": "护甲",
            "desc": "GTI研发部门对全包围防护装甲的初代实验产品，符合5级防弹标准，同时会严重影响穿戴者的移动速度和武器操控性。",
            "pic": "https://playerhub.df.qq.com/playerhub/60004/object/11050005004.png",
            "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_11050005004.png",
            "avgPrice": 389347,
            "protectDetail": {
              "durability": 125,
              "protectLevel": 5,
              "aimSpeed": {
                "percent": -10,
                "batteryValue": 4,
                "batteryColor": "red"
              },
              "moveSpeed": {
                "percent": -5,
                "batteryValue": 2,
                "batteryColor": "red"
              },
              "repairEfficiency": "中",
              "protectArea": "胸部,腹部,肩部",
              "durableLoss": "中"
            }
          }
        }
      ],
      "pharmacy": [
        {
          "id": "1006",
          "status": "生产240700008中——倒计时35464\n",
          "level": 3,
          "name": "LOC_SafeHouseDevice,1006_Name",
          "placeType": "pharmacy",
          "placeName": "制药台",
          "leftTime": 35464,
          "pushTime": 1753100854,
          "objectId": 14070000008,
          "objectDetail": {
            "id": 10084,
            "objectID": 14070000008,
            "objectName": "OE2战斗兴奋剂",
            "length": 1,
            "width": 1,
            "grade": 3,
            "weight": "0.1",
            "primaryClass": "props",
            "secondClass": "consume",
            "secondClassCN": "消耗品",
            "thirdClass": "inject",
            "thirdClassCN": "针剂",
            "desc": "在紧急情况用于回复体力的注射剂，能在短时间内回复大量体力，单次使用。",
            "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000008.png",
            "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000008.png",
            "avgPrice": 23660,
            "propsDetail": {
              "activeTime": "3"
            }
          }
        }
      ],
      "tech": [
        {
          "id": "1002",
          "status": "生产231600010中——倒计时8451\n",
          "level": 3,
          "name": "LOC_SafeHouseDevice,1002_Name",
          "placeType": "tech",
          "placeName": "技术中心",
          "leftTime": 8451,
          "pushTime": 1753073841,
          "objectId": 13160000010,
          "objectDetail": {
            "id": 10461,
            "objectID": 13160000010,
            "objectName": "DBAL-X2紫色激光镭指",
            "length": 1,
            "width": 1,
            "grade": 4,
            "weight": "0.2",
            "primaryClass": "acc",
            "secondClass": "accFunctional",
            "secondClassCN": "功能性配件",
            "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13160000010.png",
            "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13160000010.png",
            "avgPrice": 22907,
            "accDetail": {
              "controlSpeed": -4,
              "quickSeparate": 1,
              "advantage": {
                "condition": "开启激光镭指时",
                "effectList": [
                  {
                    "value": "操控速度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "腰际射击精度",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  },
                  {
                    "value": "允许战术据枪姿态",
                    "batteryValue": 4,
                    "batteryColor": "green"
                  }
                ]
              },
              "disadvantage": {
                "condition": "关闭激光镭指时",
                "effectList": [
                  {
                    "value": "激光镭射开启时敌人可见",
                    "batteryValue": -4,
                    "batteryColor": "red"
                  },
                  {
                    "value": "操控速度",
                    "batteryValue": -2,
                    "batteryColor": "red"
                  }
                ]
              }
            }
          }
        }
      ]
    },
    "stats": {
      "total": 4,
      "idle": 1,
      "producing": 3,
      "totalLevel": 12,
      "averageLevel": 3
    },
    "nowTime": 1753065390,
    "appletRecord": [],
    "relateMap": {
      "11050005004": {
        "id": 10790,
        "objectID": 11050005004,
        "objectName": "重型突击背心",
        "length": 4,
        "width": 4,
        "grade": 5,
        "weight": "9.83",
        "primaryClass": "protect",
        "secondClass": "armor",
        "secondClassCN": "护甲",
        "desc": "GTI研发部门对全包围防护装甲的初代实验产品，符合5级防弹标准，同时会严重影响穿戴者的移动速度和武器操控性。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/11050005004.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_11050005004.png",
        "avgPrice": 389347,
        "protectDetail": {
          "durability": 125,
          "protectLevel": 5,
          "aimSpeed": {
            "percent": -10,
            "batteryValue": 4,
            "batteryColor": "red"
          },
          "moveSpeed": {
            "percent": -5,
            "batteryValue": 2,
            "batteryColor": "red"
          },
          "repairEfficiency": "中",
          "protectArea": "胸部,腹部,肩部",
          "durableLoss": "中"
        }
      },
      "13160000010": {
        "id": 10461,
        "objectID": 13160000010,
        "objectName": "DBAL-X2紫色激光镭指",
        "length": 1,
        "width": 1,
        "grade": 4,
        "weight": "0.2",
        "primaryClass": "acc",
        "secondClass": "accFunctional",
        "secondClassCN": "功能性配件",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/13160000010.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_13160000010.png",
        "avgPrice": 22907,
        "accDetail": {
          "controlSpeed": -4,
          "quickSeparate": 1,
          "advantage": {
            "condition": "开启激光镭指时",
            "effectList": [
              {
                "value": "操控速度",
                "batteryValue": 4,
                "batteryColor": "green"
              },
              {
                "value": "腰际射击精度",
                "batteryValue": 4,
                "batteryColor": "green"
              },
              {
                "value": "允许战术据枪姿态",
                "batteryValue": 4,
                "batteryColor": "green"
              }
            ]
          },
          "disadvantage": {
            "condition": "关闭激光镭指时",
            "effectList": [
              {
                "value": "激光镭射开启时敌人可见",
                "batteryValue": -4,
                "batteryColor": "red"
              },
              {
                "value": "操控速度",
                "batteryValue": -2,
                "batteryColor": "red"
              }
            ]
          }
        }
      },
      "14070000008": {
        "id": 10084,
        "objectID": 14070000008,
        "objectName": "OE2战斗兴奋剂",
        "length": 1,
        "width": 1,
        "grade": 3,
        "weight": "0.1",
        "primaryClass": "props",
        "secondClass": "consume",
        "secondClassCN": "消耗品",
        "thirdClass": "inject",
        "thirdClassCN": "针剂",
        "desc": "在紧急情况用于回复体力的注射剂，能在短时间内回复大量体力，单次使用。",
        "pic": "https://playerhub.df.qq.com/playerhub/60004/object/14070000008.png",
        "prePic": "https://playerhub.df.qq.com/playerhub/60004/object/p_14070000008.png",
        "avgPrice": 23660,
        "propsDetail": {
          "activeTime": "3"
        }
      }
    }
  },
  "requestParams": {
    "frameworkToken": "474dec03-1947-4b4f-b5d0-9ef0118a1a37",
    "hasToken": true
  },
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:36:30.455Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» places|[object]|true|none||场所列表数据（对应第二个Schema中的placeData）|
|»»» id|string|true|none||特勤处分类ID（技术中心、防具台、工作台、制药台）|
|»»» status|string|true|none||状态（闲置中、生产中——倒计时{时间s}）|
|»»» level|integer|true|none||当前等级|
|»»» name|string|true|none||none|
|»»» placeType|string|true|none||对应类型（英文ID）|
|»»» placeName|string|true|none||对应中文名|
|»»» objectDetail|object¦null|true|none||none|
|»»»» id|integer|true|none||未知ID|
|»»»» objectID|integer|true|none||物品ID|
|»»»» objectName|string|true|none||物品名称|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||物品等级|
|»»»» weight|string|true|none||物品重量（KG）|
|»»»» primaryClass|string|true|none||一级分类（如：acc配件、ammo子弹）|
|»»»» secondClass|string|true|none||二级分类|
|»»»» secondClassCN|string|true|none||二级分类中文名|
|»»»» desc|string|false|none||描述|
|»»»» pic|string|true|none||图片|
|»»»» prePic|string|true|none||预览图|
|»»»» avgPrice|integer|true|none||平均价格|
|»»»» protectDetail|object|false|none||none|
|»»»»» durability|integer|true|none||none|
|»»»»» protectLevel|integer|true|none||none|
|»»»»» aimSpeed|object|true|none||none|
|»»»»»» percent|integer|true|none||none|
|»»»»»» batteryValue|integer|true|none||值|
|»»»»»» batteryColor|string|true|none||值对应颜色（如：green/red）|
|»»»»» moveSpeed|object|true|none||none|
|»»»»»» percent|integer|true|none||none|
|»»»»»» batteryValue|integer|true|none||值|
|»»»»»» batteryColor|string|true|none||值对应颜色（如：green/red）|
|»»»»» repairEfficiency|string|true|none||none|
|»»»»» protectArea|string|true|none||none|
|»»»»» durableLoss|string|true|none||none|
|»»»» thirdClass|string|false|none||三级分类|
|»»»» thirdClassCN|string|false|none||三级分类中文名|
|»»»» propsDetail|object|false|none||药剂信息|
|»»»»» activeTime|string|true|none||持续时间|
|»»»» accDetail|object|false|none||配件信息|
|»»»»» controlSpeed|integer|true|none||操控速度|
|»»»»» quickSeparate|integer|true|none||none|
|»»»»» advantage|object|true|none||buff|
|»»»»»» condition|string|true|none||条件（如：开启激光镭射时）|
|»»»»»» effectList|[object]|true|none||效果列表|
|»»»»»»» value|string|true|none||none|
|»»»»»»» batteryValue|integer|true|none||值|
|»»»»»»» batteryColor|string|true|none||值对应颜色（如：green）|
|»»»»» disadvantage|object|true|none||debuff|
|»»»»»» condition|string|true|none||条件（如：开启激光镭射时）|
|»»»»»» effectList|[object]|true|none||none|
|»»»»»»» value|string|true|none||none|
|»»»»»»» batteryValue|integer|true|none||值|
|»»»»»»» batteryColor|string|true|none||值对应颜色（如：red）|
|»»» leftTime|integer|true|none||剩余时间时间戳|
|»»» pushTime|integer|true|none||生产开始时间戳|
|»»» objectId|integer|true|none||制造物品ID|
|»» placeGroups|object|true|none||none|
|»»» workbench|[object]|true|none||none|
|»»»» id|string|false|none||none|
|»»»» status|string|false|none||none|
|»»»» level|integer|false|none||none|
|»»»» name|string|false|none||none|
|»»»» placeType|string|false|none||none|
|»»»» placeName|string|false|none||none|
|»»»» objectDetail|object¦null|false|none||none|
|»»» armory|[object]|true|none||none|
|»»» pharmacy|[object]|true|none||none|
|»»» tech|[object]|true|none||none|
|»» stats|object|true|none||none|
|»»» total|integer|true|none||none|
|»»» idle|integer|true|none||none|
|»»» producing|integer|true|none||none|
|»»» totalLevel|integer|true|none||none|
|»»» averageLevel|integer|true|none||none|
|»» nowTime|integer|true|none||当前时间|
|»» appletRecord|[string]|true|none||none|
|»» relateMap|object|true|none||物品映射表|
|»»» 11050005004|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» objectID|integer|true|none||none|
|»»»» objectName|string|true|none||none|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||none|
|»»»» weight|string|true|none||none|
|»»»» primaryClass|string|true|none||none|
|»»»» secondClass|string|true|none||none|
|»»»» secondClassCN|string|true|none||none|
|»»»» desc|string|true|none||none|
|»»»» pic|string|true|none||none|
|»»»» prePic|string|true|none||none|
|»»»» avgPrice|integer|true|none||none|
|»»»» protectDetail|object|true|none||none|
|»»» 13160000010|object|true|none||物品ID映射|
|»»»» id|integer|true|none||未知ID|
|»»»» objectID|integer|true|none||物品ID|
|»»»» objectName|string|true|none||物品名称|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||物品等级|
|»»»» weight|string|true|none||物品重量（KG）|
|»»»» primaryClass|string|true|none||一级分类|
|»»»» secondClass|string|true|none||二级分类|
|»»»» secondClassCN|string|true|none||二级分类中文名|
|»»»» pic|string|true|none||图片|
|»»»» prePic|string|true|none||预览图|
|»»»» avgPrice|integer|true|none||平均价格|
|»»»» accDetail|object|true|none||配件信息|
|»»» 14070000008|object|true|none||物品ID映射|
|»»»» id|integer|true|none||未知ID|
|»»»» objectID|integer|true|none||物品ID|
|»»»» objectName|string|true|none||物品名|
|»»»» length|integer|true|none||none|
|»»»» width|integer|true|none||none|
|»»»» grade|integer|true|none||物品等级|
|»»»» weight|string|true|none||重量（KG）|
|»»»» primaryClass|string|true|none||一级分类|
|»»»» secondClass|string|true|none||二级分类|
|»»»» secondClassCN|string|true|none||二级分类中文名|
|»»»» thirdClass|string|true|none||三级分类|
|»»»» thirdClassCN|string|true|none||三级分类中文名|
|»»»» desc|string|true|none||描述|
|»»»» pic|string|true|none||图片|
|»»»» prePic|string|true|none||预览图|
|»»»» avgPrice|integer|true|none||平均价格|
|»»»» propsDetail|object|true|none||药剂信息|
|» requestParams|object|true|none||none|
|»» frameworkToken|string|true|none||none|
|»» hasToken|boolean|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 藏品资产查询（非货币）

GET /df/person/collection

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "iRet": "0",
    "sMsg": "ok",
    "userData": [
      {
        "ItemId": "88000000038",
        "ItemName": "LOC%5FGameItem%2C88000000038%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000050012",
        "ItemName": "LOC%5FGameItem%2C30000050012%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "30000020011",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000027",
        "ItemName": "LOC%5FGameItem%2C88000000027%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020002",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000030",
        "ItemName": "LOC%5FGameItem%2C88000000030%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020005",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000026",
        "ItemName": "LOC%5FGameItem%2C88000000026%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020007",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000028",
        "ItemName": "LOC%5FGameItem%2C88000000028%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020003",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000036",
        "ItemName": "LOC%5FGameItem%2C88000000036%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020009",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000039",
        "ItemName": "LOC%5FGameItemForHero%2C88000000039%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020012",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000037",
        "ItemName": "LOC%5FGameItem%2C88000000037%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020010",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000025",
        "ItemName": "LOC%5FGameItem%2C88000000025%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020006",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000035",
        "ItemName": "LOC%5FGameItem%2C88000000035%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020008",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "88000000029",
        "ItemName": "LOC%5FGameItem%2C88000000029%5FName",
        "ItemGid": "0",
        "ItemQuality": "0"
      },
      {
        "ItemId": "30000020004",
        "ItemName": "LOC%5FGameItem%2C30000020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020008",
        "ItemName": "LOC%5FGameItem%2C38050020008%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030020003",
        "ItemName": "LOC%5FGameItem%2C38030020003%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030030020",
        "ItemName": "LOC%5FGameItemForHero%2C38030030020%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040015",
        "ItemName": "LOC%5FGameItem%2C38020040015%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020104",
        "ItemName": "LOC%5FGameItem%2C38050020104%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030055",
        "ItemName": "LOC%5FGameItemForHero%2C38010030055%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020030",
        "ItemName": "LOC%5FGameItem%2C38050020030%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020169",
        "ItemName": "LOC%5FGameItem%2C38050020169%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030170",
        "ItemName": "LOC%5FGameItemForHero%2C38020030170%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020072",
        "ItemName": "LOC%5FGameItem%2C38050020072%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020098",
        "ItemName": "LOC%5FGameItem%2C38050020098%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030002",
        "ItemName": "LOC%5FGameItem%2C38020030002%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030152",
        "ItemName": "LOC%5FGameItem%2C38050030152%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020131",
        "ItemName": "LOC%5FGameItem%2C38050020131%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38070050004",
        "ItemName": "LOC%5FHeroDFWatchData%2C38070050004%5FDFWatchName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38070030001",
        "ItemName": "LOC%5FGameItem%2C38070030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050008",
        "ItemName": "LOC%5FGameItem%2C38050050008%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020230",
        "ItemName": "LOC%5FHeroLinesData%2C38050020230%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040045",
        "ItemName": "LOC%5FGameItemForHero%2C38020040045%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38020030102",
        "ItemName": "LOC%5FGameItem%2C38020030102%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040027",
        "ItemName": "LOC%5FGameItem%2C38020040027%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38020030046",
        "ItemName": "LOC%5FGameItem%2C38020030046%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030147",
        "ItemName": "LOC%5FGameItemForHero%2C38020030147%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020095",
        "ItemName": "LOC%5FGameItem%2C38050020095%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040001",
        "ItemName": "LOC%5FGameItem%2C38020040001%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38030030009",
        "ItemName": "LOC%5FGameItem%2C38030030009%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050003",
        "ItemName": "LOC%5FGameItem%2C38050050003%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050050006",
        "ItemName": "LOC%5FGameItem%2C38050050006%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020018",
        "ItemName": "LOC%5FGameItem%2C38050020018%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030057",
        "ItemName": "LOC%5FGameItem%2C38050030057%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030012",
        "ItemName": "LOC%5FGameItem%2C38030030012%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020115",
        "ItemName": "LOC%5FGameItem%2C38050020115%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030029",
        "ItemName": "LOC%5FGameItem%2C38020030029%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030137",
        "ItemName": "LOC%5FGameItem%2C38020030137%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020234",
        "ItemName": "LOC%5FHeroLinesData%2C38050020234%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020130",
        "ItemName": "LOC%5FGameItem%2C38050020130%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030097",
        "ItemName": "LOC%5FGameItem%2C38050030097%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040006",
        "ItemName": "LOC%5FGameItem%2C38020040006%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020154",
        "ItemName": "LOC%5FGameItem%2C38050020154%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38080212005",
        "ItemName": "LOC%5FGameItem%2C38080212005%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020149",
        "ItemName": "LOC%5FGameItem%2C38050020149%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040043",
        "ItemName": "LOC%5FGameItemForHero%2C38020040043%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020237",
        "ItemName": "LOC%5FHeroLinesData%2C38050020237%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030043",
        "ItemName": "LOC%5FGameItemForHero%2C38010030043%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020216",
        "ItemName": "LOC%5FHeroLinesData%2C38050020216%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030002",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020082",
        "ItemName": "LOC%5FGameItem%2C38050020082%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020226",
        "ItemName": "LOC%5FHeroLinesData%2C38050020226%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030006",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030014",
        "ItemName": "LOC%5FGameItem%2C38030030014%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020084",
        "ItemName": "LOC%5FGameItem%2C38050020084%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030030011",
        "ItemName": "LOC%5FGameItem%2C38030030011%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010030004",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020171",
        "ItemName": "LOC%5FGameItem%2C38050020171%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030058",
        "ItemName": "LOC%5FGameItem%2C38050030058%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010040037",
        "ItemName": "LOC%5FGameItemForHero%2C38010040037%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020160",
        "ItemName": "LOC%5FGameItem%2C38050020160%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020049",
        "ItemName": "LOC%5FGameItem%2C38050020049%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040020006",
        "ItemName": "LOC%5FGameItem%2C38040020006%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020114",
        "ItemName": "LOC%5FGameItem%2C38050020114%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040040003",
        "ItemName": "LOC%5FGameItem%2C38040040003%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020223",
        "ItemName": "LOC%5FHeroLinesData%2C38050020223%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010050002",
        "ItemName": "LOC%5FGameItem%2C38010050002%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38020040037",
        "ItemName": "LOC%5FGameItem%2C38020040037%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020059",
        "ItemName": "LOC%5FGameItem%2C38050020059%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020043",
        "ItemName": "LOC%5FGameItem%2C38050020043%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020241",
        "ItemName": "LOC%5FHeroLinesData%2C38050020241%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020036",
        "ItemName": "LOC%5FGameItem%2C38050020036%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020050004",
        "ItemName": "LOC%5FGameItem%2C38020050004%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38010030045",
        "ItemName": "LOC%5FGameItemForHero%2C38010030045%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010030001",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030017",
        "ItemName": "LOC%5FGameItem%2C38020030017%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030010",
        "ItemName": "LOC%5FGameItem%2C38020030010%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020079",
        "ItemName": "LOC%5FGameItem%2C38050020079%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010050004",
        "ItemName": "LOC%5FGameItemForHero%2C38010050004%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38060020001",
        "ItemName": "LOC%5FGameItem%2C38060020001%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020157",
        "ItemName": "LOC%5FGameItem%2C38050020157%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040020001",
        "ItemName": "LOC%5FGameItem%2C38040020001%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020103",
        "ItemName": "LOC%5FGameItem%2C38050020103%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38100030002",
        "ItemName": "LOC%5FGameItem%2C38100030002%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020221",
        "ItemName": "LOC%5FHeroLinesData%2C38050020221%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030121",
        "ItemName": "LOC%5FGameItem%2C38020030121%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38040030005",
        "ItemName": "LOC%5FGameItemForHero%2C38040030005%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38040020002",
        "ItemName": "LOC%5FGameItem%2C38040020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020162",
        "ItemName": "LOC%5FGameItem%2C38050020162%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020139",
        "ItemName": "LOC%5FGameItem%2C38050020139%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040052",
        "ItemName": "LOC%5FGameItemForHero%2C38020040052%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38010030050",
        "ItemName": "LOC%5FGameItemForHero%2C38010030050%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040003",
        "ItemName": "LOC%5FGameItem%2C38020040003%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020053",
        "ItemName": "LOC%5FGameItem%2C38050020053%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040004",
        "ItemName": "LOC%5FGameItem%2C38020040004%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38100030003",
        "ItemName": "LOC%5FGameItem%2C38100030003%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020050",
        "ItemName": "LOC%5FGameItem%2C38050020050%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030153",
        "ItemName": "LOC%5FGameItem%2C38050030153%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030016",
        "ItemName": "LOC%5FGameItemForHero%2C38030030016%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38080212037",
        "ItemName": "LOC%5FGameItem%2C38080212037%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030087",
        "ItemName": "LOC%5FGameItem%2C38050030087%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030118",
        "ItemName": "LOC%5FGameItem%2C38020030118%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030003",
        "ItemName": "LOC%5FGameItem%2C38030030003%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020080",
        "ItemName": "LOC%5FGameItem%2C38050020080%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020210",
        "ItemName": "LOC%5FHeroLinesData%2C38050020210%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030013",
        "ItemName": "LOC%5FGameItem%2C38020030013%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010030052",
        "ItemName": "LOC%5FGameItemForHero%2C38010030052%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020142",
        "ItemName": "LOC%5FGameItem%2C38050020142%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020156",
        "ItemName": "LOC%5FGameItem%2C38050020156%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030200",
        "ItemName": "LOC%5FGameItemForHero%2C38020030200%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040066",
        "ItemName": "LOC%5FGameItemForHero%2C38020040066%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020179",
        "ItemName": "LOC%5FGameItem%2C38050020179%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020240",
        "ItemName": "LOC%5FHeroLinesData%2C38050020240%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020025",
        "ItemName": "LOC%5FGameItem%2C38050020025%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040020010",
        "ItemName": "LOC%5FGameItem%2C38040020010%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38040020009",
        "ItemName": "LOC%5FGameItem%2C38040020009%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020040029",
        "ItemName": "LOC%5FGameItem%2C38020040029%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38010030024",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030060",
        "ItemName": "LOC%5FGameItem%2C38020030060%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050016",
        "ItemName": "LOC%5FHeroLinesData%2C38050050016%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38020030221",
        "ItemName": "LOC%5FGameItemForHero%2C38020030221%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030040027",
        "ItemName": "LOC%5FGameItemForHero%2C38030040027%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38030050001",
        "ItemName": "LOC%5FGameItem%2C38030050001%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38020030171",
        "ItemName": "LOC%5FGameItemForHero%2C38020030171%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020164",
        "ItemName": "LOC%5FGameItem%2C38050020164%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030100",
        "ItemName": "LOC%5FGameItem%2C38050030100%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030136",
        "ItemName": "LOC%5FGameItem%2C38020030136%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050007",
        "ItemName": "LOC%5FGameItem%2C38050050007%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38020030168",
        "ItemName": "LOC%5FGameItemForHero%2C38020030168%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030172",
        "ItemName": "LOC%5FGameItemForHero%2C38020030172%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020148",
        "ItemName": "LOC%5FGameItem%2C38050020148%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030030001",
        "ItemName": "LOC%5FGameItem%2C38030030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020013",
        "ItemName": "LOC%5FGameItem%2C38050020013%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030007",
        "ItemName": "LOC%5FGameItem%2C38020030007%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030108",
        "ItemName": "LOC%5FGameItem%2C38050030108%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020093",
        "ItemName": "LOC%5FGameItem%2C38050020093%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020123",
        "ItemName": "LOC%5FGameItem%2C38050020123%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050050004",
        "ItemName": "LOC%5FGameItem%2C38050050004%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020066",
        "ItemName": "LOC%5FGameItem%2C38050020066%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030218",
        "ItemName": "LOC%5FGameItemForHero%2C38020030218%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030089",
        "ItemName": "LOC%5FGameItem%2C38020030089%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030206",
        "ItemName": "LOC%5FHeroLinesData%2C38050030206%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030040",
        "ItemName": "LOC%5FGameItem%2C38050030040%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020068",
        "ItemName": "LOC%5FGameItem%2C38050020068%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030019",
        "ItemName": "LOC%5FGameItem%2C38020030019%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020099",
        "ItemName": "LOC%5FGameItem%2C38050020099%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030003",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030016",
        "ItemName": "LOC%5FGameItem%2C38020030016%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020120",
        "ItemName": "LOC%5FGameItem%2C38050020120%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020145",
        "ItemName": "LOC%5FGameItem%2C38050020145%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040002",
        "ItemName": "LOC%5FGameItem%2C38020040002%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020215",
        "ItemName": "LOC%5FHeroLinesData%2C38050020215%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030050002",
        "ItemName": "LOC%5FGameItemForHero%2C38030050002%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020006",
        "ItemName": "LOC%5FGameItem%2C38050020006%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020118",
        "ItemName": "LOC%5FGameItem%2C38050020118%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050050015",
        "ItemName": "LOC%5FHeroLinesData%2C38050050015%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38080112001",
        "ItemName": "LOC%5FGameItem%2C38080112001%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030034",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020083",
        "ItemName": "LOC%5FGameItem%2C38050020083%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030011",
        "ItemName": "LOC%5FGameItem%2C38020030011%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030122",
        "ItemName": "LOC%5FGameItem%2C38050030122%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020065",
        "ItemName": "LOC%5FGameItem%2C38050020065%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020129",
        "ItemName": "LOC%5FGameItem%2C38050020129%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030027",
        "ItemName": "LOC%5FGameItem%2C38050030027%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020167",
        "ItemName": "LOC%5FGameItem%2C38050020167%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020116",
        "ItemName": "LOC%5FGameItem%2C38050020116%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040040002",
        "ItemName": "LOC%5FGameItem%2C38040040002%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020231",
        "ItemName": "LOC%5FHeroLinesData%2C38050020231%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030004",
        "ItemName": "LOC%5FGameItem%2C38020030004%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020024",
        "ItemName": "LOC%5FGameItem%2C38050020024%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010040005",
        "ItemName": "LOC%5FGameItem%2C38010040005%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38030030010",
        "ItemName": "LOC%5FGameItem%2C38030030010%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020048",
        "ItemName": "LOC%5FGameItem%2C38050020048%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030229",
        "ItemName": "LOC%5FGameItemForHero%2C38020030229%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020028",
        "ItemName": "LOC%5FGameItem%2C38050020028%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020074",
        "ItemName": "LOC%5FGameItem%2C38050020074%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030020005",
        "ItemName": "LOC%5FGameItem%2C38030020005%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020135",
        "ItemName": "LOC%5FGameItem%2C38050020135%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030054",
        "ItemName": "LOC%5FGameItem%2C38050030054%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020004",
        "ItemName": "LOC%5FGameItem%2C38050020004%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030030018",
        "ItemName": "LOC%5FGameItemForHero%2C38030030018%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030008",
        "ItemName": "LOC%5FGameItem%2C38030030008%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020233",
        "ItemName": "LOC%5FHeroLinesData%2C38050020233%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020056",
        "ItemName": "LOC%5FGameItem%2C38050020056%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020138",
        "ItemName": "LOC%5FGameItem%2C38050020138%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020041",
        "ItemName": "LOC%5FGameItem%2C38050020041%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010040038",
        "ItemName": "LOC%5FGameItemForHero%2C38010040038%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020181",
        "ItemName": "LOC%5FGameItem%2C38050020181%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030001",
        "ItemName": "LOC%5FGameItem%2C38020030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38080222012",
        "ItemName": "LOC%5FGameItem%2C38080222012%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38080212012",
        "ItemName": "LOC%5FGameItem%2C38080212012%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020128",
        "ItemName": "LOC%5FGameItem%2C38050020128%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020050012",
        "ItemName": "LOC%5FGameItemForHero%2C38020050012%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020212",
        "ItemName": "LOC%5FHeroLinesData%2C38050020212%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040020004",
        "ItemName": "LOC%5FGameItem%2C38040020004%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020016",
        "ItemName": "LOC%5FGameItem%2C38050020016%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020213",
        "ItemName": "LOC%5FHeroLinesData%2C38050020213%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030169",
        "ItemName": "LOC%5FGameItemForHero%2C38020030169%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030020004",
        "ItemName": "%23%23%23TEST",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020009",
        "ItemName": "LOC%5FGameItem%2C38050020009%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38040020005",
        "ItemName": "LOC%5FGameItem%2C38040020005%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020151",
        "ItemName": "LOC%5FGameItem%2C38050020151%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030143",
        "ItemName": "LOC%5FGameItem%2C38050030143%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050030037",
        "ItemName": "LOC%5FGameItem%2C38050030037%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020055",
        "ItemName": "LOC%5FGameItem%2C38050020055%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030109",
        "ItemName": "LOC%5FGameItem%2C38050030109%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030014",
        "ItemName": "LOC%5FGameItem%2C38020030014%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030145",
        "ItemName": "LOC%5FGameItemForHero%2C38020030145%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010030042",
        "ItemName": "LOC%5FGameItem%2C38010030042%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020060",
        "ItemName": "LOC%5FGameItem%2C38050020060%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020045",
        "ItemName": "LOC%5FGameItem%2C38050020045%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030107",
        "ItemName": "LOC%5FGameItem%2C38020030107%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38100030001",
        "ItemName": "LOC%5FGameItem%2C38100030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38030030013",
        "ItemName": "LOC%5FGameItem%2C38030030013%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020075",
        "ItemName": "LOC%5FGameItem%2C38050020075%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030005",
        "ItemName": "LOC%5FGameItem%2C38020030005%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020063",
        "ItemName": "LOC%5FGameItem%2C38050020063%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020225",
        "ItemName": "LOC%5FHeroLinesData%2C38050020225%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020070",
        "ItemName": "LOC%5FGameItem%2C38050020070%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020019",
        "ItemName": "LOC%5FGameItem%2C38050020019%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020208",
        "ItemName": "LOC%5FHeroLinesData%2C38050020208%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020030220",
        "ItemName": "LOC%5FGameItemForHero%2C38020030220%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030061",
        "ItemName": "LOC%5FGameItem%2C38020030061%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030130",
        "ItemName": "LOC%5FGameItem%2C38020030130%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050002",
        "ItemName": "LOC%5FGameItem%2C38050050002%5FName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38050020111",
        "ItemName": "LOC%5FGameItem%2C38050020111%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020176",
        "ItemName": "LOC%5FGameItem%2C38050020176%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030222",
        "ItemName": "LOC%5FHeroLinesData%2C38050030222%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020178",
        "ItemName": "LOC%5FGameItem%2C38050020178%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020137",
        "ItemName": "LOC%5FGameItem%2C38050020137%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030020002",
        "ItemName": "LOC%5FGameItem%2C38030020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020021",
        "ItemName": "LOC%5FGameItem%2C38050020021%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020180",
        "ItemName": "LOC%5FGameItem%2C38050020180%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020219",
        "ItemName": "LOC%5FHeroLinesData%2C38050020219%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030021",
        "ItemName": "LOC%5FGameItem%2C38010030021%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020110",
        "ItemName": "LOC%5FGameItem%2C38050020110%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020174",
        "ItemName": "LOC%5FGameItem%2C38050020174%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020020002",
        "ItemName": "LOC%5FGameItem%2C38020020002%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040051",
        "ItemName": "LOC%5FGameItemForHero%2C38020040051%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38030020006",
        "ItemName": "LOC%5FGameItem%2C38030020006%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050030220",
        "ItemName": "LOC%5FHeroLinesData%2C38050030220%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050020033",
        "ItemName": "LOC%5FGameItem%2C38050020033%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020218",
        "ItemName": "LOC%5FHeroLinesData%2C38050020218%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020039",
        "ItemName": "LOC%5FGameItem%2C38050020039%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030012",
        "ItemName": "LOC%5FGameItem%2C38010030008%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38010030007",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38020030030",
        "ItemName": "LOC%5FGameItem%2C38020030030%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38050050014",
        "ItemName": "LOC%5FHeroLinesData%2C38050050014%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "5"
      },
      {
        "ItemId": "38020030067",
        "ItemName": "LOC%5FGameItem%2C38020030067%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38080212003",
        "ItemName": "LOC%5FGameItem%2C38080212003%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020034",
        "ItemName": "LOC%5FGameItem%2C38050020034%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020085",
        "ItemName": "LOC%5FGameItem%2C38050020085%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040044",
        "ItemName": "LOC%5FGameItemForHero%2C38020040044%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020227",
        "ItemName": "LOC%5FHeroLinesData%2C38050020227%5FLinesName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020020001",
        "ItemName": "LOC%5FGameItem%2C38020020001%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040059",
        "ItemName": "LOC%5FGameItemForHero%2C38020040059%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38040020003",
        "ItemName": "LOC%5FGameItem%2C38040020003%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020012",
        "ItemName": "LOC%5FGameItem%2C38050020012%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38010030005",
        "ItemName": "LOC%5FGameItem%2C38010030001%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      },
      {
        "ItemId": "38040040010",
        "ItemName": "LOC%5FGameItemForHero%2C38040040010%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38020040007",
        "ItemName": "LOC%5FGameItem%2C38020040007%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38030020001",
        "ItemName": "LOC%5FGameItem%2C38030020001%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38050020106",
        "ItemName": "LOC%5FGameItem%2C38050020106%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38020040005",
        "ItemName": "LOC%5FGameItem%2C38020040005%5FName",
        "ItemGid": "0",
        "ItemQuality": "4"
      },
      {
        "ItemId": "38050020144",
        "ItemName": "LOC%5FGameItem%2C38050020144%5FName",
        "ItemGid": "0",
        "ItemQuality": "2"
      },
      {
        "ItemId": "38030030006",
        "ItemName": "LOC%5FGameItem%2C38030030006%5FName",
        "ItemGid": "0",
        "ItemQuality": "3"
      }
    ],
    "weponData": [
      {
        "ItemId": "13460030028",
        "ItemName": "LOC%5FGameItem%2C13460030028%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13460030066",
        "ItemName": "LOC%5FGameItem%2C13460030066%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13460030073",
        "ItemName": "LOC%5FGameItem%2C13460030073%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13460030092",
        "ItemName": "LOC%5FGameItem%2C13460030092%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927189",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927976",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930698",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930699",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930700",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930701",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930705",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918308704417",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918308704427",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918310833053",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466430116",
        "ItemName": "LOC%5FGameItem%2C13466430116%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918310838264",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440106",
        "ItemName": "LOC%5FGameItem%2C13460040106%5FName",
        "ItemNum": "1",
        "ItemGid": "648519351374720444",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918299628623",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927717",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927904",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927973",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930697",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930702",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930704",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440114",
        "ItemName": "LOC%5FGameItem%2C13466440114%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918308704448",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927184",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927187",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927551",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927552",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927720",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927906",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927912",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304927972",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307929159",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307929162",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307929163",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307929165",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307929167",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930696",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466440115",
        "ItemName": "LOC%5FGameItem%2C13466440115%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918307930703",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466450105",
        "ItemName": "LOC%5FGameItem%2C13460050105%5FName",
        "ItemNum": "1",
        "ItemGid": "648519351368881063",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "13466450113",
        "ItemName": "LOC%5FGameItem%2C13466450113%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918304928046",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010120003",
        "ItemName": "LOC%5FGameItem%2C28010120003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010120005",
        "ItemName": "LOC%5FGameItem%2C28010120005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010120008",
        "ItemName": "LOC%5FGameItem%2C28010120008%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010620003",
        "ItemName": "LOC%5FGameItem%2C28010620003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010630004",
        "ItemName": "LOC%5FGameItem%2C28010630004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010640003",
        "ItemName": "LOC%5FGameItem%2C28010640003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010820003",
        "ItemName": "LOC%5FGameItem%2C28010820003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010820004",
        "ItemName": "LOC%5FGameItem%2C28010820004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010820005",
        "ItemName": "LOC%5FGameItem%2C28010820005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010820007",
        "ItemName": "LOC%5FGameItem%2C28010820007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28010840001",
        "ItemName": "LOC%5FGameItem%2C28010840001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011230002",
        "ItemName": "LOC%5FGameItem%2C28011230002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011240003",
        "ItemName": "LOC%5FGameItem%2C28011240003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011320004",
        "ItemName": "LOC%5FGameItem%2C28011320004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011320007",
        "ItemName": "LOC%5FGameItem%2C28011320007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011420009",
        "ItemName": "LOC%5FGameItem%2C28011420009%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011430001",
        "ItemName": "LOC%5FGameItem%2C28011430001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011430004",
        "ItemName": "LOC%5FGameItem%2C28011430004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011430005",
        "ItemName": "LOC%5FGameItem%2C28011430005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011520002",
        "ItemName": "LOC%5FGameItem%2C28011520002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011520006",
        "ItemName": "LOC%5FGameItem%2C28011520006%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011610001",
        "ItemName": "LOC%5FGameItem%2C28011610001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011620003",
        "ItemName": "LOC%5FGameItem%2C28011620003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011720001",
        "ItemName": "LOC%5FGameItem%2C28011720001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011720003",
        "ItemName": "LOC%5FGameItem%2C28011720003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011720004",
        "ItemName": "LOC%5FGameItem%2C28011720004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011730004",
        "ItemName": "LOC%5FGameItem%2C28011730004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011740003",
        "ItemName": "LOC%5FGameItem%2C28011740003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011740004",
        "ItemName": "LOC%5FGameItem%2C28011740004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011820002",
        "ItemName": "LOC%5FGameItem%2C28011820002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011820003",
        "ItemName": "LOC%5FGameItem%2C28011820003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28011850002",
        "ItemName": "LOC%5FGameItem%2C28011850002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012120004",
        "ItemName": "LOC%5FGameItem%2C28012120004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012130007",
        "ItemName": "LOC%5FGameItem%2C28012130007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012130008",
        "ItemName": "LOC%5FGameItem%2C28012130008%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012130010",
        "ItemName": "LOC%5FGameItem%2C28012130010%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012150002",
        "ItemName": "LOC%5FGameItem%2C28012150002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012320001",
        "ItemName": "LOC%5FGameItem%2C28012320001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012330004",
        "ItemName": "LOC%5FGameItem%2C28012330004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012420001",
        "ItemName": "LOC%5FGameItem%2C28012420001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012420002",
        "ItemName": "LOC%5FGameItem%2C28012420002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28012430003",
        "ItemName": "LOC%5FGameItem%2C28012430003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28013740002",
        "ItemName": "LOC%5FGameItem%2C28013740002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28013820001",
        "ItemName": "LOC%5FGameItem%2C28013820001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020020002",
        "ItemName": "LOC%5FGameItem%2C28020020002%5FName",
        "ItemNum": "1",
        "ItemGid": "648519351369640729",
        "ItemQuality": "2",
        "IsCollectibles": "1"
      },
      {
        "ItemId": "28020120012",
        "ItemName": "LOC%5FGameItem%2C28020120012%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020120013",
        "ItemName": "LOC%5FGameItem%2C28020120013%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020120014",
        "ItemName": "LOC%5FGameItem%2C28020120014%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020130005",
        "ItemName": "LOC%5FGameItem%2C28020130005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020220003",
        "ItemName": "LOC%5FGameItem%2C28020220003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020220004",
        "ItemName": "LOC%5FGameItem%2C28020220004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020230007",
        "ItemName": "LOC%5FGameItem%2C28020230007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020230008",
        "ItemName": "LOC%5FGameItem%2C28020230008%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020320001",
        "ItemName": "LOC%5FGameItem%2C28020320001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020330007",
        "ItemName": "LOC%5FGameItem%2C28020330007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020330014",
        "ItemName": "LOC%5FGameItem%2C28020330014%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020420007",
        "ItemName": "LOC%5FGameItem%2C28020420007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020420008",
        "ItemName": "LOC%5FGameItem%2C28020420008%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020520003",
        "ItemName": "LOC%5FGameItem%2C28020520003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020530002",
        "ItemName": "LOC%5FGameItem%2C28020530002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020630006",
        "ItemName": "LOC%5FGameItem%2C28020630006%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020630007",
        "ItemName": "LOC%5FGameItem%2C28020630007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020650004",
        "ItemName": "LOC%5FGameItem%2C28020650004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020830002",
        "ItemName": "LOC%5FGameItem%2C28020830002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020920002",
        "ItemName": "LOC%5FGameItem%2C28020920002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28020940001",
        "ItemName": "LOC%5FGameItem%2C28020940001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28021030002",
        "ItemName": "LOC%5FGameItem%2C28021030002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030120001",
        "ItemName": "LOC%5FGameItem%2C28030120001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030120003",
        "ItemName": "LOC%5FGameItem%2C28030120003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030130006",
        "ItemName": "LOC%5FGameItem%2C28030130006%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030130007",
        "ItemName": "LOC%5FGameItem%2C28030130007%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030140001",
        "ItemName": "LOC%5FGameItem%2C28030140001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030240001",
        "ItemName": "LOC%5FGameItem%2C28030240001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28030550002",
        "ItemName": "LOC%5FGameItem%2C28030550002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040140004",
        "ItemName": "LOC%5FGameItem%2C28040140004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040220004",
        "ItemName": "LOC%5FGameItem%2C28040220004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040230006",
        "ItemName": "LOC%5FGameItem%2C28040230006%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040330002",
        "ItemName": "LOC%5FGameItem%2C28040330002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040330003",
        "ItemName": "LOC%5FGameItem%2C28040330003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040340001",
        "ItemName": "LOC%5FGameItem%2C28040340001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28040430002",
        "ItemName": "LOC%5FGameItem%2C28040430002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050030005",
        "ItemName": "LOC%5FGameItem%2C28050030005%5FName",
        "ItemNum": "1",
        "ItemGid": "648519918309951172",
        "ItemQuality": "3",
        "IsCollectibles": "1"
      },
      {
        "ItemId": "28050230003",
        "ItemName": "LOC%5FGameItem%2C28050230003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050330004",
        "ItemName": "LOC%5FGameItem%2C28050330004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050440002",
        "ItemName": "LOC%5FGameItem%2C28050440002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050440003",
        "ItemName": "LOC%5FGameItem%2C28050440003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050520002",
        "ItemName": "LOC%5FGameItem%2C28050520002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050620001",
        "ItemName": "LOC%5FGameItem%2C28050620001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050630002",
        "ItemName": "LOC%5FGameItem%2C28050630002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050720003",
        "ItemName": "LOC%5FGameItem%2C28050720003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050740003",
        "ItemName": "LOC%5FGameItem%2C28050740003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28050820001",
        "ItemName": "LOC%5FGameItem%2C28050820001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28053140001",
        "ItemName": "LOC%5FGameItem%2C28053140001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060025604",
        "ItemName": "LOC%5FGameItem%2C28060025604%5FName",
        "ItemNum": "1",
        "ItemGid": "648519351367568180",
        "ItemQuality": "2",
        "IsCollectibles": "1"
      },
      {
        "ItemId": "28060710001",
        "ItemName": "LOC%5FGameItem%2C28060710001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060740002",
        "ItemName": "LOC%5FGameItem%2C28060740002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060740003",
        "ItemName": "LOC%5FGameItem%2C28060740003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060830002",
        "ItemName": "LOC%5FGameItem%2C28060830002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060920003",
        "ItemName": "LOC%5FGameItem%2C28060920003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060940003",
        "ItemName": "LOC%5FGameItem%2C28060940003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28060940005",
        "ItemName": "LOC%5FGameItem%2C28060940005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28070420002",
        "ItemName": "LOC%5FGameItem%2C28070420002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28070440001",
        "ItemName": "LOC%5FGameItem%2C28070440001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28070530003",
        "ItemName": "LOC%5FGameItem%2C28070530003%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28073320001",
        "ItemName": "LOC%5FGameItem%2C28073320001%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28101200002",
        "ItemName": "LOC%5FGameItem%2C18100000002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "0",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "28101250009",
        "ItemName": "LOC%5FGameItem%2C18100000009%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "0",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32210000001",
        "ItemName": "LOC%5FGameItem%2C32210000001%5FName",
        "ItemNum": "32",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32210000002",
        "ItemName": "LOC%5FGameItem%2C32210000002%5FName",
        "ItemNum": "40",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32210000003",
        "ItemName": "LOC%5FGameItem%2C32210000003%5FName",
        "ItemNum": "127",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32210000004",
        "ItemName": "LOC%5FGameItem%2C32210000004%5FName",
        "ItemNum": "132",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32230000003",
        "ItemName": "LOC%5FGameItem%2C32230000003%5FName",
        "ItemNum": "2",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32230000010",
        "ItemName": "LOC%5FGameItem%2C32230000010%5FName",
        "ItemNum": "7",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32230000011",
        "ItemName": "LOC%5FGameItem%2C32230000011%5FName",
        "ItemNum": "4",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32230000013",
        "ItemName": "LOC%5FGameItem%2C32230000013%5FName",
        "ItemNum": "21",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32230000018",
        "ItemName": "LOC%5FGameItem%2C32230000018%5FName",
        "ItemNum": "19",
        "ItemGid": "0",
        "ItemQuality": "0",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32239000020",
        "ItemName": "LOC%5FGameItem%2C32239000020%5FName",
        "ItemNum": "12",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32239000021",
        "ItemName": "LOC%5FGameItem%2C32239000021%5FName",
        "ItemNum": "49",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32240000028",
        "ItemName": "LOC%5FGameItem%2C32240000028%5FName",
        "ItemNum": "2",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32240000032",
        "ItemName": "LOC%5FGameItem%2C32240000032%5FName",
        "ItemNum": "3",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32240000034",
        "ItemName": "LOC%5FGameItem%2C32240000034%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32250000012",
        "ItemName": "LOC%5FGameItem%2C32250000012%5FName",
        "ItemNum": "2",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32259000011",
        "ItemName": "LOC%5FGameItem%2C32259000011%5FName",
        "ItemNum": "2",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32260000001",
        "ItemName": "LOC%5FGameItem%2C32260000001%5FName",
        "ItemNum": "14",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32280000001",
        "ItemName": "LOC%5FGameItem%2C32280000001%5FName",
        "ItemNum": "35",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32300000041",
        "ItemName": "LOC%5FGameItem%2C32300000041%5FName",
        "ItemNum": "11",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32300000051",
        "ItemName": "LOC%5FGameItem%2C32300000051%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32300000061",
        "ItemName": "LOC%5FGameItem%2C32300000061%5FName",
        "ItemNum": "2",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32300000101",
        "ItemName": "LOC%5FGameItem%2C32300000031%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32300000183",
        "ItemName": "LOC%5FGameItem%2C32300000043%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32320000001",
        "ItemName": "LOC%5FGameItem%2C32320000001%5FName",
        "ItemNum": "3",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32330000001",
        "ItemName": "LOC%5FGameItem%2C32330000001%5FName",
        "ItemNum": "10",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32330000002",
        "ItemName": "LOC%5FGameItem%2C32330000002%5FName",
        "ItemNum": "5",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32330000003",
        "ItemName": "LOC%5FGameItem%2C32330000003%5FName",
        "ItemNum": "5",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32370000002",
        "ItemName": "LOC%5FGameItem%2C32370000002%5FName",
        "ItemNum": "6",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "32380000001",
        "ItemName": "LOC%5FGameItem%2C32380000001%5FName",
        "ItemNum": "14",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001120025",
        "ItemName": "LOC%5FVehicleSkin%2C41001120025%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001120026",
        "ItemName": "LOC%5FVehicleSkin%2C41001120026%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001120027",
        "ItemName": "LOC%5FVehicleSkin%2C41001120027%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001120034",
        "ItemName": "LOC%5FVehicleSkin%2C41001120034%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130027",
        "ItemName": "LOC%5FVehicleSkin%2C41001130027%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130033",
        "ItemName": "LOC%5FVehicleSkin%2C41001130033%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130035",
        "ItemName": "LOC%5FVehicleSkin%2C41001130035%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130036",
        "ItemName": "LOC%5FVehicleSkin%2C41001130036%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130040",
        "ItemName": "LOC%5FVehicleSkin%2C41001130040%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001130041",
        "ItemName": "LOC%5FVehicleSkin%2C41001130041%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001140013",
        "ItemName": "LOC%5FVehicleSkin%2C41001140013%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001140023",
        "ItemName": "LOC%5FVehicleSkin%2C41001140023%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001140025",
        "ItemName": "LOC%5FVehicleSkin%2C41001140025%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001140027",
        "ItemName": "LOC%5FVehicleSkin%2C41001140027%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001320009",
        "ItemName": "LOC%5FVehicleSkin%2C41001320009%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "2",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001340002",
        "ItemName": "LOC%5FVehicleSkin%2C41001340002%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001340010",
        "ItemName": "LOC%5FVehicleSkin%2C41001340010%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001340011",
        "ItemName": "LOC%5FVehicleSkin%2C41001340011%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "41001340013",
        "ItemName": "LOC%5FVehicleSkin%2C41001340013%5FSkinName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030002",
        "ItemName": "LOC%5FGameItem%2C42010030002%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030005",
        "ItemName": "LOC%5FGameItem%2C42010030005%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030006",
        "ItemName": "LOC%5FGameItem%2C42010030006%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030008",
        "ItemName": "LOC%5FGameItem%2C42010030008%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030046",
        "ItemName": "LOC%5FGameItem%2C42010030046%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030057",
        "ItemName": "LOC%5FGameItem%2C42010030057%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030061",
        "ItemName": "LOC%5FGameItemForHero%2C42010030061%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030062",
        "ItemName": "LOC%5FGameItemForHero%2C42010030062%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030073",
        "ItemName": "LOC%5FGameItem%2C42010030073%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030083",
        "ItemName": "LOC%5FGameItemForHero%2C42010030083%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030084",
        "ItemName": "LOC%5FGameItemForHero%2C42010030084%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030089",
        "ItemName": "LOC%5FGameItemForHero%2C42010030089%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030123",
        "ItemName": "LOC%5FGameItem%2C42010030123%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030125",
        "ItemName": "LOC%5FGameItem%2C42010030125%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030156",
        "ItemName": "LOC%5FGameItem%2C42010030156%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030302",
        "ItemName": "LOC%5FGameItem%2C42010030302%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030307",
        "ItemName": "LOC%5FGameItem%2C42010030307%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010030309",
        "ItemName": "LOC%5FGameItem%2C42010030309%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010040093",
        "ItemName": "LOC%5FGameItemForHero%2C42010040093%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010040094",
        "ItemName": "LOC%5FGameItemForHero%2C42010040094%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010040149",
        "ItemName": "LOC%5FGameItemForHero%2C42010040149%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010040199",
        "ItemName": "LOC%5FGameItem%2C42010040199%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42010040303",
        "ItemName": "LOC%5FGameItem%2C42010040303%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030022",
        "ItemName": "LOC%5FGameItem%2C42020030022%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030034",
        "ItemName": "LOC%5FGameItem%2C42020030034%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030054",
        "ItemName": "LOC%5FGameItem%2C42020030054%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030055",
        "ItemName": "LOC%5FGameItem%2C42020030055%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030070",
        "ItemName": "LOC%5FGameItemForHero%2C42020030070%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030071",
        "ItemName": "LOC%5FGameItemForHero%2C42020030071%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030072",
        "ItemName": "LOC%5FGameItemForHero%2C42020030072%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030073",
        "ItemName": "LOC%5FGameItemForHero%2C42020030073%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030086",
        "ItemName": "LOC%5FGameItemForHero%2C42020030086%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030092",
        "ItemName": "LOC%5FGameItem%2C42020030092%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030100",
        "ItemName": "LOC%5FGameItem%2C42020030100%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030115",
        "ItemName": "LOC%5FGameItem%2C42020030115%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030123",
        "ItemName": "LOC%5FGameItem%2C42020030123%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030125",
        "ItemName": "LOC%5FGameItem%2C42020030125%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030156",
        "ItemName": "LOC%5FGameItem%2C42020030156%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020030302",
        "ItemName": "LOC%5FGameItem%2C42020030302%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "3",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020040078",
        "ItemName": "LOC%5FGameItemForHero%2C42020040078%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020040149",
        "ItemName": "LOC%5FGameItemForHero%2C42020040149%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42020040199",
        "ItemName": "LOC%5FGameItem%2C42020040199%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "4",
        "IsCollectibles": "0"
      },
      {
        "ItemId": "42030050004",
        "ItemName": "LOC%5FGameItem%2C42030050004%5FName",
        "ItemNum": "1",
        "ItemGid": "0",
        "ItemQuality": "5",
        "IsCollectibles": "0"
      }
    ],
    "dCData": [
      {
        "PropID": "28020020002",
        "Rarity": "0",
        "Wear": "334928616",
        "UniqueNo": "0",
        "KillCnter": "0",
        "CustomName": "",
        "AppearanceId": "0",
        "AppearanceSeed": "0",
        "Name": "LOC%5FGameItem%2C28020020002%5FName"
      },
      {
        "PropID": "28050030005",
        "Rarity": "0",
        "Wear": "1140412041",
        "UniqueNo": "0",
        "KillCnter": "0",
        "CustomName": "",
        "AppearanceId": "0",
        "AppearanceSeed": "0",
        "Name": "LOC%5FGameItem%2C28050030005%5FName"
      },
      {
        "PropID": "28060025604",
        "Rarity": "0",
        "Wear": "4393787645",
        "UniqueNo": "0",
        "KillCnter": "0",
        "CustomName": "",
        "AppearanceId": "0",
        "AppearanceSeed": "0",
        "Name": "LOC%5FGameItem%2C28060025604%5FName"
      }
    ]
  },
  "message": "ok",
  "amsSerial": "AMS-DFM-0721103725-51rguY-661959-318948",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:37:26.120Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» iRet|string|true|none||none|
|»» sMsg|string|true|none||none|
|»» userData|[object]|true|none||none|
|»»» ItemId|string|true|none||none|
|»»» ItemName|string|true|none||none|
|»»» ItemGid|string|true|none||none|
|»»» ItemQuality|string|true|none||none|
|»» weponData|[object]|true|none||none|
|»»» ItemId|string|true|none||none|
|»»» ItemName|string|true|none||none|
|»»» ItemNum|string|true|none||none|
|»»» ItemGid|string|true|none||none|
|»»» ItemQuality|string|true|none||none|
|»»» IsCollectibles|string|true|none||none|
|»» dCData|[object]|true|none||none|
|»»» PropID|string|true|none||none|
|»»» Rarity|string|true|none||none|
|»»» Wear|string|true|none||none|
|»»» UniqueNo|string|true|none||none|
|»»» KillCnter|string|true|none||none|
|»»» CustomName|string|true|none||none|
|»»» AppearanceId|string|true|none||none|
|»»» AppearanceSeed|string|true|none||none|
|»»» Name|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 日报

GET /df/person/dailyRecord

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |none|
|type|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": {
    "mp": {
      "data": {
        "code": 0,
        "data": {
          "mpDetail": {
            "totalKillNum": 218,
            "totalWinNum": 3,
            "totalFightNum": 7,
            "totalScore": 108618,
            "mostUseForceType": 40005,
            "recentDate": "2025-07-20",
            "bestMatch": {
              "assist": 20,
              "death": 30,
              "isWinner": 0,
              "gameTime": 1378,
              "killNum": 54,
              "mapID": 111,
              "score": 26191,
              "startTime": "1753020737",
              "dtEventTime": "2025-07-20 22:34:35"
            }
          },
          "currentTime": "2025-07-21 10:38:22"
        },
        "msg": "ok"
      }
    },
    "sol": {
      "data": {
        "code": 0,
        "data": {
          "solDetail": {
            "recentGain": 189966,
            "recentGainDate": "2025-07-14",
            "userCollectionTop": {
              "date": "20250714",
              "list": [
                {
                  "objectID": "15080050035",
                  "count": "1",
                  "price": "93491.0",
                  "objectName": "军用望远镜",
                  "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050035.png"
                },
                {
                  "objectID": "15080050009",
                  "count": "1",
                  "price": "57607.0",
                  "objectName": "亮闪闪的海盗金币",
                  "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050009.png"
                },
                {
                  "objectID": "15020010024",
                  "count": "1",
                  "price": "53793.0",
                  "objectName": "高出力粉碎钳",
                  "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010024.png"
                }
              ]
            }
          },
          "currentTime": "2025-07-21 10:38:22"
        },
        "msg": "ok"
      }
    }
  },
  "message": "获取日报成功",
  "amsSerial": "AMS-DFM-0721103821-fRtHE9-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:38:22.516Z"
  }
}
```

```json
{
  "success": true,
  "data": {
    "data": {
      "code": 0,
      "data": {
        "solDetail": {
          "recentGain": 189966,
          "recentGainDate": "2025-07-14",
          "userCollectionTop": {
            "date": "20250714",
            "list": [
              {
                "objectID": "15080050035",
                "count": "1",
                "price": "93491.0",
                "objectName": "军用望远镜",
                "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050035.png"
              },
              {
                "objectID": "15080050009",
                "count": "1",
                "price": "57607.0",
                "objectName": "亮闪闪的海盗金币",
                "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15080050009.png"
              },
              {
                "objectID": "15020010024",
                "count": "1",
                "price": "53793.0",
                "objectName": "高出力粉碎钳",
                "pic": "https://playerhub.df.qq.com/playerhub/60004/object/15020010024.png"
              }
            ]
          }
        },
        "currentTime": "2025-07-21 10:38:10"
      },
      "msg": "ok"
    }
  },
  "message": "succ",
  "amsSerial": "AMS-DFM-0721103810-4NtUHB-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:38:10.387Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» mp|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» mpDetail|object|true|none||none|
|»»»»»» totalKillNum|integer|true|none||none|
|»»»»»» totalWinNum|integer|true|none||none|
|»»»»»» totalFightNum|integer|true|none||none|
|»»»»»» totalScore|integer|true|none||none|
|»»»»»» mostUseForceType|integer|true|none||none|
|»»»»»» recentDate|string|true|none||none|
|»»»»»» bestMatch|object|true|none||none|
|»»»»»»» assist|integer|true|none||none|
|»»»»»»» death|integer|true|none||none|
|»»»»»»» isWinner|integer|true|none||none|
|»»»»»»» gameTime|integer|true|none||none|
|»»»»»»» killNum|integer|true|none||none|
|»»»»»»» mapID|integer|true|none||none|
|»»»»»»» score|integer|true|none||none|
|»»»»»»» startTime|string|true|none||none|
|»»»»»»» dtEventTime|string|true|none||none|
|»»»»» currentTime|string|true|none||none|
|»»»» msg|string|true|none||none|
|»» sol|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» solDetail|object|true|none||none|
|»»»»»» recentGain|integer|true|none||none|
|»»»»»» recentGainDate|string|true|none||none|
|»»»»»» userCollectionTop|object|true|none||none|
|»»»»»»» date|string|true|none||none|
|»»»»»»» list|[object]|true|none||none|
|»»»»»»»» objectID|string|true|none||none|
|»»»»»»»» count|string|true|none||none|
|»»»»»»»» price|string|true|none||none|
|»»»»»»»» objectName|string|true|none||none|
|»»»»»»»» pic|string|true|none||none|
|»»»»» currentTime|string|true|none||none|
|»»»» msg|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 周报

GET /df/person/weeklyRecord

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|type|query|string| 否 |模式（可选）|
|isShowNullFriend|query|string| 否 |选择是否显示空数据队友|
|date|query|string| 否 |指定周末日期|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": {
    "mp": {
      "data": {
        "code": 0,
        "data": {
          "Consume_Bullet_Num": "3016",
          "DeployArmedForceType_KillNum": "347",
          "DeployArmedForceType_gametime": "7768",
          "DeployArmedForceType_inum": "7",
          "Hit_Bullet_Num": "1189",
          "Kill_Num": "347",
          "Kill_type1_Num": "1",
          "Rank_Match_Score": "1174",
          "Rescue_Campmate_Count": "9",
          "Rescue_Teammate_Count": "4",
          "SBattle_Support_CostScore": "81000.0",
          "SBattle_Support_UseNum": "6.0",
          "Teammate_Reborn_Num": "3",
          "Used_Time": "87",
          "by_Rescue_num": "31",
          "continuous_Kill_Num": "4.0",
          "max_inum_DeployArmedForceType": "10010",
          "max_inum_mapid": "{'MapId':303,'inum':1}#{'MapId':107,'inum':1}#{'MapId':54,'inum':1}#{'MapId':103,'inum':1}#{'MapId':302,'inum':1}#{'MapId':75,'inum':1}#{'MapId':108,'inum':1}",
          "total_Occupy": "11",
          "total_gametime": "7768",
          "total_num": "7",
          "total_score": "132217",
          "win_num": "5",
          "teammates": []
        },
        "message": "ok"
      }
    },
    "sol": {
      "data": {
        "code": 0,
        "data": {
          "CarryOut_highprice_list": "{'itemid':37140300001,'inum':1,'auctontype':弹药,'quality':4.0,'iPrice':304.0}#{'itemid':14030000003,'inum':1,'auctontype':药品,'quality':3.0,'iPrice':17500.0}#{'itemid':13030000187,'inum':1,'auctontype':配件,'quality':4.0,'iPrice':19222.0}#{'itemid':11050005001,'inum':1,'auctontype':护甲,'quality':5.0,'iPrice':143170.0}#{'itemid':15030040005,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':45648.0}#{'itemid':15060040002,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':48941.0}#{'itemid':15020010034,'inum':4,'auctontype':收集品,'quality':3.0,'iPrice':39648.0}#{'itemid':15020010036,'inum':1,'auctontype':收集品,'quality':5.0,'iPrice':389546.0}#{'itemid':14020000006,'inum':1,'auctontype':药品,'quality':5.0,'iPrice':56601.0}#{'itemid':15060080013,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':12536.0}#{'itemid':13140000035,'inum':1,'auctontype':配件,'quality':4.0,'iPrice':19294.0}#{'itemid':37200300001,'inum':1,'auctontype':弹药,'quality':4.0,'iPrice':246.0}#{'itemid':15030010001,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':9016.0}#{'itemid':11010005009,'inum':1,'auctontype':装备,'quality':5.0,'iPrice':261320.0}#{'itemid':15080050103,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':45252.0}#{'itemid':15080050136,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':30814.0}#{'itemid':15030040002,'inum':2,'auctontype':收集品,'quality':3.0,'iPrice':17696.0}#{'itemid':15080050009,'inum':1,'auctontype':收集品,'quality':5.0,'iPrice':61304.0}#{'itemid':13120000260,'inum':1,'auctontype':配件,'quality':5.0,'iPrice':35698.0}#{'itemid':13240000005,'inum':1,'auctontype':配件,'quality':5.0,'iPrice':25739.0}#{'itemid':15070010001,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':9380.0}#{'itemid':15040010022,'inum':2,'auctontype':收集品,'quality':3.0,'iPrice':19394.0}#{'itemid':15020050005,'inum':2,'auctontype':收集品,'quality':4.0,'iPrice':22974.0}#{'itemid':15040010015,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':28456.0}#{'itemid':15020040002,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':16945.0}#{'itemid':13320000005,'inum':3,'auctontype':配件,'quality':2.0,'iPrice':15357.0}#{'itemid':15090010041,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':26070.0}#{'itemid':14060000001,'inum':1,'auctontype':维修套件,'quality':5.0,'iPrice':63525.0}#{'itemid':15060010004,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':8241.0}#{'itemid':15080050018,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':27580.0}#{'itemid':15080050016,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':33394.0}#{'itemid':15080050127,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':75843.0}#{'itemid':15080050001,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':17806.0}#{'itemid':15080040004,'inum':1,'auctontype':收集品,'quality':2.0,'iPrice':3025.0}",
          "GainedPrice_overmillion_num": "1",
          "Gained_Price": "1921305",
          "Kill_ByCrocodile_num": "0",
          "Mandel_brick_num": "0",
          "Rank_Score": "4449",
          "TeammatePrice_overzero_num": "0",
          "Total_Mileage": "786946",
          "Total_Price": "Monday-20250630-62681140,Tuesday-20250701-64070252,Wednesday-20250702-63702497,Thursday-20250703-59941678,Friday-20250704-66568813,Saturday-20250705-66305959,Sunday-20250706-69510373",
          "consume_Price": "3242627",
          "rise_Price": "6829233",
          "search_Birdsnest_num": "0",
          "total_ArmedForceId_num": "{'ArmedForceId':20003,'inum':3}",
          "total_Death_Count": "1",
          "total_Kill_AI": "7",
          "total_Kill_Boss": "0",
          "total_Kill_Count": "0",
          "total_Kill_Player": "0",
          "total_Online_Time": "33211",
          "total_Quest_num": "1",
          "total_Rescue_num": "0",
          "total_exacuation_num": "2",
          "total_mapid_num": "{'MapId':8803,'inum':1}#{'MapId':2202,'inum':2}",
          "total_sol_num": "3",
          "use_Keycard_num": "0",
          "teammates": [
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "2285676443914538305"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "1190884437026057398"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "2316253127679116054"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12431699724384705694"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "14599117269113199386"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "4656845560778630864"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "2992219381370082759"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "11745788708302174026"
            },
            {
              "Friend_Escape1_consume_Price": 403577,
              "Friend_Escape2_consume_Price": 413193,
              "Friend_Sum_Escape1_Gained_Price": 478776,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 816770,
              "Friend_is_Escape1_num": 1,
              "Friend_is_Escape2_num": 1,
              "Friend_max_price_itemid": 13050000328,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 1,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 2,
              "friend_openid": "8254344178742794608"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12770990409624463064"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "537871962287549115"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "4673187879798583078"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "16434406749427517744"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12009357514221337513"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "7366198934644390727"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "6046997435025272434"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "8199326502726027322"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "1506321819179348811"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "8871867644228691165"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "8395899366839634720"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "2919938910831333466"
            },
            {
              "Friend_Escape1_consume_Price": 881690,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 838148,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 881690,
              "Friend_is_Escape1_num": 1,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 15050401005,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 1,
              "friend_openid": "17958595570320463127"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "8810899572678917280"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "4560191223478572402"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12277234194499075305"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "10859648672742710142"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "16747683356143081700"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "13963257036113148406"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "1749395388358987749"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "6554699116471024232"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "10313910076482097029"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "14168257241556192178"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "1116115816012670704"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "15590015185885968762"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "1408971732660495424"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "3690632125646182775"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12039298455669872290"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "11750825431277225085"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "12001973576092350650"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "5335046591640342396"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "10873349058413270012"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "8262825204227483448"
            },
            {
              "Friend_Escape1_consume_Price": 0,
              "Friend_Escape2_consume_Price": 0,
              "Friend_Sum_Escape1_Gained_Price": 0,
              "Friend_Sum_Escape2_Gained_Price": 0,
              "Friend_consume_Price": 0,
              "Friend_is_Escape1_num": 0,
              "Friend_is_Escape2_num": 0,
              "Friend_max_price_itemid": 0,
              "Friend_total_sol_AssistCnt": 0,
              "Friend_total_sol_DeathCount": 0,
              "Friend_total_sol_KillPlayer": 0,
              "Friend_total_sol_num": 0,
              "friend_openid": "9883216135398468047"
            }
          ]
        },
        "message": "ok"
      }
    }
  },
  "message": "获取周报成功",
  "amsSerial": "AMS-DFM-0721104009-PZs3VQ-661959-316968",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:40:09.866Z"
  }
}
```

```json
{
  "success": true,
  "data": {
    "data": {
      "code": 0,
      "data": {
        "CarryOut_highprice_list": "{'itemid':37140300001,'inum':1,'auctontype':弹药,'quality':4.0,'iPrice':304.0}#{'itemid':14030000003,'inum':1,'auctontype':药品,'quality':3.0,'iPrice':17500.0}#{'itemid':13030000187,'inum':1,'auctontype':配件,'quality':4.0,'iPrice':19222.0}#{'itemid':11050005001,'inum':1,'auctontype':护甲,'quality':5.0,'iPrice':143170.0}#{'itemid':15030040005,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':45648.0}#{'itemid':15060040002,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':48941.0}#{'itemid':15020010034,'inum':4,'auctontype':收集品,'quality':3.0,'iPrice':39648.0}#{'itemid':15020010036,'inum':1,'auctontype':收集品,'quality':5.0,'iPrice':389546.0}#{'itemid':14020000006,'inum':1,'auctontype':药品,'quality':5.0,'iPrice':56601.0}#{'itemid':15060080013,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':12536.0}#{'itemid':13140000035,'inum':1,'auctontype':配件,'quality':4.0,'iPrice':19294.0}#{'itemid':37200300001,'inum':1,'auctontype':弹药,'quality':4.0,'iPrice':246.0}#{'itemid':15030010001,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':9016.0}#{'itemid':11010005009,'inum':1,'auctontype':装备,'quality':5.0,'iPrice':261320.0}#{'itemid':15080050103,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':45252.0}#{'itemid':15080050136,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':30814.0}#{'itemid':15030040002,'inum':2,'auctontype':收集品,'quality':3.0,'iPrice':17696.0}#{'itemid':15080050009,'inum':1,'auctontype':收集品,'quality':5.0,'iPrice':61304.0}#{'itemid':13120000260,'inum':1,'auctontype':配件,'quality':5.0,'iPrice':35698.0}#{'itemid':13240000005,'inum':1,'auctontype':配件,'quality':5.0,'iPrice':25739.0}#{'itemid':15070010001,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':9380.0}#{'itemid':15040010022,'inum':2,'auctontype':收集品,'quality':3.0,'iPrice':19394.0}#{'itemid':15020050005,'inum':2,'auctontype':收集品,'quality':4.0,'iPrice':22974.0}#{'itemid':15040010015,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':28456.0}#{'itemid':15020040002,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':16945.0}#{'itemid':13320000005,'inum':3,'auctontype':配件,'quality':2.0,'iPrice':15357.0}#{'itemid':15090010041,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':26070.0}#{'itemid':14060000001,'inum':1,'auctontype':维修套件,'quality':5.0,'iPrice':63525.0}#{'itemid':15060010004,'inum':1,'auctontype':收集品,'quality':3.0,'iPrice':8241.0}#{'itemid':15080050018,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':27580.0}#{'itemid':15080050016,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':33394.0}#{'itemid':15080050127,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':75843.0}#{'itemid':15080050001,'inum':1,'auctontype':收集品,'quality':4.0,'iPrice':17806.0}#{'itemid':15080040004,'inum':1,'auctontype':收集品,'quality':2.0,'iPrice':3025.0}",
        "GainedPrice_overmillion_num": "1",
        "Gained_Price": "1921305",
        "Kill_ByCrocodile_num": "0",
        "Mandel_brick_num": "0",
        "Rank_Score": "4449",
        "TeammatePrice_overzero_num": "0",
        "Total_Mileage": "786946",
        "Total_Price": "Monday-20250630-62681140,Tuesday-20250701-64070252,Wednesday-20250702-63702497,Thursday-20250703-59941678,Friday-20250704-66568813,Saturday-20250705-66305959,Sunday-20250706-69510373",
        "consume_Price": "3242627",
        "rise_Price": "6829233",
        "search_Birdsnest_num": "0",
        "total_ArmedForceId_num": "{'ArmedForceId':20003,'inum':3}",
        "total_Death_Count": "1",
        "total_Kill_AI": "7",
        "total_Kill_Boss": "0",
        "total_Kill_Count": "0",
        "total_Kill_Player": "0",
        "total_Online_Time": "33211",
        "total_Quest_num": "1",
        "total_Rescue_num": "0",
        "total_exacuation_num": "2",
        "total_mapid_num": "{'MapId':8803,'inum':1}#{'MapId':2202,'inum':2}",
        "total_sol_num": "3",
        "use_Keycard_num": "0",
        "teammates": [
          {
            "Friend_Escape1_consume_Price": 403577,
            "Friend_Escape2_consume_Price": 413193,
            "Friend_Sum_Escape1_Gained_Price": 478776,
            "Friend_Sum_Escape2_Gained_Price": 0,
            "Friend_consume_Price": 816770,
            "Friend_is_Escape1_num": 1,
            "Friend_is_Escape2_num": 1,
            "Friend_max_price_itemid": 13050000328,
            "Friend_total_sol_AssistCnt": 0,
            "Friend_total_sol_DeathCount": 1,
            "Friend_total_sol_KillPlayer": 0,
            "Friend_total_sol_num": 2,
            "friend_openid": "8254344178742794608"
          },
          {
            "Friend_Escape1_consume_Price": 881690,
            "Friend_Escape2_consume_Price": 0,
            "Friend_Sum_Escape1_Gained_Price": 838148,
            "Friend_Sum_Escape2_Gained_Price": 0,
            "Friend_consume_Price": 881690,
            "Friend_is_Escape1_num": 1,
            "Friend_is_Escape2_num": 0,
            "Friend_max_price_itemid": 15050401005,
            "Friend_total_sol_AssistCnt": 0,
            "Friend_total_sol_DeathCount": 0,
            "Friend_total_sol_KillPlayer": 0,
            "Friend_total_sol_num": 1,
            "friend_openid": "17958595570320463127"
          }
        ]
      },
      "message": "ok"
    }
  },
  "message": "succ",
  "amsSerial": "AMS-DFM-0721103927-Q4eEWe-661959-316968",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:39:27.772Z"
  }
}
```

```json
{
  "success": true,
  "data": {
    "data": {
      "code": 0,
      "data": {
        "Consume_Bullet_Num": "3016",
        "DeployArmedForceType_KillNum": "347",
        "DeployArmedForceType_gametime": "7768",
        "DeployArmedForceType_inum": "7",
        "Hit_Bullet_Num": "1189",
        "Kill_Num": "347",
        "Kill_type1_Num": "1",
        "Rank_Match_Score": "1174",
        "Rescue_Campmate_Count": "9",
        "Rescue_Teammate_Count": "4",
        "SBattle_Support_CostScore": "81000.0",
        "SBattle_Support_UseNum": "6.0",
        "Teammate_Reborn_Num": "3",
        "Used_Time": "87",
        "by_Rescue_num": "31",
        "continuous_Kill_Num": "4.0",
        "max_inum_DeployArmedForceType": "10010",
        "max_inum_mapid": "{'MapId':303,'inum':1}#{'MapId':107,'inum':1}#{'MapId':54,'inum':1}#{'MapId':103,'inum':1}#{'MapId':302,'inum':1}#{'MapId':75,'inum':1}#{'MapId':108,'inum':1}",
        "total_Occupy": "11",
        "total_gametime": "7768",
        "total_num": "7",
        "total_score": "132217",
        "win_num": "5",
        "teammates": []
      },
      "message": "ok"
    }
  },
  "message": "succ",
  "amsSerial": "AMS-DFM-0721103947-a93sa5-661959-316968",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:39:47.606Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» mp|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» Consume_Bullet_Num|string|true|none||none|
|»»»»» DeployArmedForceType_KillNum|string|true|none||none|
|»»»»» DeployArmedForceType_gametime|string|true|none||none|
|»»»»» DeployArmedForceType_inum|string|true|none||none|
|»»»»» Hit_Bullet_Num|string|true|none||none|
|»»»»» Kill_Num|string|true|none||none|
|»»»»» Kill_type1_Num|string|true|none||none|
|»»»»» Rank_Match_Score|string|true|none||none|
|»»»»» Rescue_Campmate_Count|string|true|none||none|
|»»»»» Rescue_Teammate_Count|string|true|none||none|
|»»»»» SBattle_Support_CostScore|string|true|none||none|
|»»»»» SBattle_Support_UseNum|string|true|none||none|
|»»»»» Teammate_Reborn_Num|string|true|none||none|
|»»»»» Used_Time|string|true|none||none|
|»»»»» by_Rescue_num|string|true|none||none|
|»»»»» continuous_Kill_Num|string|true|none||none|
|»»»»» max_inum_DeployArmedForceType|string|true|none||none|
|»»»»» max_inum_mapid|string|true|none||none|
|»»»»» total_Occupy|string|true|none||none|
|»»»»» total_gametime|string|true|none||none|
|»»»»» total_num|string|true|none||none|
|»»»»» total_score|string|true|none||none|
|»»»»» win_num|string|true|none||none|
|»»»»» teammates|[string]|true|none||none|
|»»»» message|string|true|none||none|
|»» sol|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» CarryOut_highprice_list|string|true|none||none|
|»»»»» GainedPrice_overmillion_num|string|true|none||none|
|»»»»» Gained_Price|string|true|none||none|
|»»»»» Kill_ByCrocodile_num|string|true|none||none|
|»»»»» Mandel_brick_num|string|true|none||none|
|»»»»» Rank_Score|string|true|none||none|
|»»»»» TeammatePrice_overzero_num|string|true|none||none|
|»»»»» Total_Mileage|string|true|none||none|
|»»»»» Total_Price|string|true|none||none|
|»»»»» consume_Price|string|true|none||none|
|»»»»» rise_Price|string|true|none||none|
|»»»»» search_Birdsnest_num|string|true|none||none|
|»»»»» total_ArmedForceId_num|string|true|none||none|
|»»»»» total_Death_Count|string|true|none||none|
|»»»»» total_Kill_AI|string|true|none||none|
|»»»»» total_Kill_Boss|string|true|none||none|
|»»»»» total_Kill_Count|string|true|none||none|
|»»»»» total_Kill_Player|string|true|none||none|
|»»»»» total_Online_Time|string|true|none||none|
|»»»»» total_Quest_num|string|true|none||none|
|»»»»» total_Rescue_num|string|true|none||none|
|»»»»» total_exacuation_num|string|true|none||none|
|»»»»» total_mapid_num|string|true|none||none|
|»»»»» total_sol_num|string|true|none||none|
|»»»»» use_Keycard_num|string|true|none||none|
|»»»»» teammates|[object]|true|none||none|
|»»»»»» Friend_Escape1_consume_Price|integer|true|none||none|
|»»»»»» Friend_Escape2_consume_Price|integer|true|none||none|
|»»»»»» Friend_Sum_Escape1_Gained_Price|integer|true|none||none|
|»»»»»» Friend_Sum_Escape2_Gained_Price|integer|true|none||none|
|»»»»»» Friend_consume_Price|integer|true|none||none|
|»»»»»» Friend_is_Escape1_num|integer|true|none||none|
|»»»»»» Friend_is_Escape2_num|integer|true|none||none|
|»»»»»» Friend_max_price_itemid|integer|true|none||none|
|»»»»»» Friend_total_sol_AssistCnt|integer|true|none||none|
|»»»»»» Friend_total_sol_DeathCount|integer|true|none||none|
|»»»»»» Friend_total_sol_KillPlayer|integer|true|none||none|
|»»»»»» Friend_total_sol_num|integer|true|none||none|
|»»»»»» friend_openid|string|true|none||none|
|»»»» message|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 个人信息

GET /df/person/personalInfo

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|seasonid|query|string| 否 |可选（不选则是全部赛季）|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "iRet": "0",
    "sMsg": "ok",
    "userData": {
      "picurl": "http%3A%2F%2Fthirdqq%2Eqlogo%2Ecn%2Fek%5Fqqapp%2FAQP5brQ0TKFWlVPeaMJIg0iaBRRWyPh6rYW9Q8APF8bQUINgdQBEHUqtUQuniaXVHTtB8s9zRGzo37laoz1vzjhmj6Xs2m9lKEjqBy0pPOJzKicJfIOcoo%2F100",
      "charac_name": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6"
    },
    "careerData": {
      "result": 0,
      "error_info": 0,
      "rankpoint": "2900",
      "tdmrankpoint": "2309",
      "soltotalfght": "15",
      "solttotalescape": "7",
      "solduration": "9680",
      "soltotalkill": "6",
      "solescaperatio": "46%",
      "avgkillperminute": "216",
      "tdmduration": "479",
      "tdmsuccessratio": "55%",
      "tdmtotalfight": "27",
      "totalwin": "15",
      "tdmtotalkill": 899
    }
  },
  "roleInfo": {
    "_webplat_msg": "1|3550870590954844384 浅巷墨黎6 |",
    "_webplat_msg_code": "0",
    "_webplat_msg_new": "1|3550870590954844384 浅巷墨黎6 -1 |",
    "accounttype": "2",
    "accumulatechargenum": "0",
    "adultstatus": "0",
    "bindedtrianglecoinnum": "0",
    "charac_name": "浅巷墨黎6",
    "countrybelonging": "156",
    "countrycode": "156",
    "exp": "19905",
    "guildid": "0",
    "hafcoinnum": "5915274",
    "isbanspeak": "0",
    "isbanuser": "0",
    "islogined": "0",
    "lastlogintime": "1753057575",
    "lastlogouttime": "1753057676",
    "latestchargetime": "0",
    "level": "58",
    "loginchannel": "10025553",
    "logintoday": "1",
    "mpmandelbricknum": "5",
    "openid": "3550870590954844384",
    "picurl": "http://thirdqq.qlogo.cn/ek_qqapp/AQP5brQ0TKFWlVPeaMJIg0iaBRRWyPh6rYW9Q8APF8bQUINgdQBEHUqtUQuniaXVHTtB8s9zRGzo37laoz1vzjhmj6Xs2m9lKEjqBy0pPOJzKicJfIOcoo/100",
    "playerage": "0",
    "propcapital": "64273540",
    "register_time": "1745162501",
    "registerchannel": "10025553",
    "result": "0",
    "solmandelbricknum": "2",
    "tdmexp": "878422",
    "tdmlevel": "35",
    "trianglecoinnum": "0",
    "uid": "36449129409045155615"
  },
  "message": "获取个人信息成功",
  "amsSerial": "AMS-DFM-0721104208-t4uKa6-661959-317814",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:42:09.218Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» iRet|string|true|none||none|
|»» sMsg|string|true|none||none|
|»» userData|object|true|none||none|
|»»» picurl|string|true|none||none|
|»»» charac_name|string|true|none||none|
|»» careerData|object|true|none||none|
|»»» result|integer|true|none||none|
|»»» error_info|integer|true|none||none|
|»»» rankpoint|string|true|none||none|
|»»» tdmrankpoint|string|true|none||none|
|»»» soltotalfght|string|true|none||none|
|»»» solttotalescape|string|true|none||none|
|»»» solduration|string|true|none||none|
|»»» soltotalkill|string|true|none||none|
|»»» solescaperatio|string|true|none||none|
|»»» avgkillperminute|string|true|none||none|
|»»» tdmduration|string|true|none||none|
|»»» tdmsuccessratio|string|true|none||none|
|»»» tdmtotalfight|string|true|none||none|
|»»» totalwin|string|true|none||none|
|»»» tdmtotalkill|integer|true|none||none|
|» roleInfo|object|true|none||none|
|»» _webplat_msg|string|true|none||none|
|»» _webplat_msg_code|string|true|none||none|
|»» _webplat_msg_new|string|true|none||none|
|»» accounttype|string|true|none||none|
|»» accumulatechargenum|string|true|none||none|
|»» adultstatus|string|true|none||none|
|»» bindedtrianglecoinnum|string|true|none||none|
|»» charac_name|string|true|none||none|
|»» countrybelonging|string|true|none||none|
|»» countrycode|string|true|none||none|
|»» exp|string|true|none||none|
|»» guildid|string|true|none||none|
|»» hafcoinnum|string|true|none||none|
|»» isbanspeak|string|true|none||none|
|»» isbanuser|string|true|none||none|
|»» islogined|string|true|none||none|
|»» lastlogintime|string|true|none||none|
|»» lastlogouttime|string|true|none||none|
|»» latestchargetime|string|true|none||none|
|»» level|string|true|none||none|
|»» loginchannel|string|true|none||none|
|»» logintoday|string|true|none||none|
|»» mpmandelbricknum|string|true|none||none|
|»» openid|string|true|none||none|
|»» picurl|string|true|none||none|
|»» playerage|string|true|none||none|
|»» propcapital|string|true|none||none|
|»» register_time|string|true|none||none|
|»» registerchannel|string|true|none||none|
|»» result|string|true|none||none|
|»» solmandelbricknum|string|true|none||none|
|»» tdmexp|string|true|none||none|
|»» tdmlevel|string|true|none||none|
|»» trianglecoinnum|string|true|none||none|
|»» uid|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 个人中心数据

GET /df/person/personalData

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|seasonid|query|string| 否 |可选（不选则是全部赛季）|
|type|query|string| 否 |可选（不选则是双模式数据）|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "sol": {
      "data": {
        "code": 0,
        "data": {
          "solDetail": {
            "redTotalMoney": 23317001,
            "redTotalCount": 41,
            "mapList": [
              {
                "mapID": 1901,
                "totalCount": 71,
                "leaveCount": 23
              },
              {
                "mapID": 2231,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 3901,
                "totalCount": 44,
                "leaveCount": 15
              },
              {
                "mapID": 8102,
                "totalCount": 11,
                "leaveCount": 2
              },
              {
                "mapID": 2202,
                "totalCount": 24,
                "leaveCount": 8
              },
              {
                "mapID": 2201,
                "totalCount": 63,
                "leaveCount": 28
              },
              {
                "mapID": 1902,
                "totalCount": 115,
                "leaveCount": 46
              },
              {
                "mapID": 3902,
                "totalCount": 109,
                "leaveCount": 57
              },
              {
                "mapID": 8803,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 80,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 8103,
                "totalCount": 2,
                "leaveCount": 1
              }
            ],
            "redCollectionDetail": [
              {
                "objectID": 15070040003,
                "count": 4,
                "price": 227605
              },
              {
                "objectID": 15030050018,
                "count": 1,
                "price": 386743
              },
              {
                "objectID": 15010050001,
                "count": 1,
                "price": 431607
              },
              {
                "objectID": 15080050014,
                "count": 2,
                "price": 214066
              },
              {
                "objectID": 15030050017,
                "count": 1,
                "price": 1447283
              },
              {
                "objectID": 15080040001,
                "count": 2,
                "price": 345854
              },
              {
                "objectID": 15030050008,
                "count": 1,
                "price": 1420939
              },
              {
                "objectID": 15080050032,
                "count": 1,
                "price": 915778
              },
              {
                "objectID": 15030050004,
                "count": 1,
                "price": 1010690
              },
              {
                "objectID": 15080050058,
                "count": 2,
                "price": 1666777
              },
              {
                "objectID": 15020010033,
                "count": 1,
                "price": 1498562
              },
              {
                "objectID": 15030050001,
                "count": 1,
                "price": 331739
              },
              {
                "objectID": 15030050013,
                "count": 4,
                "price": 471504
              },
              {
                "objectID": 15070050001,
                "count": 4,
                "price": 274058
              },
              {
                "objectID": 15060080015,
                "count": 5,
                "price": 336841
              },
              {
                "objectID": 15080050040,
                "count": 1,
                "price": 2126742
              },
              {
                "objectID": 15080050031,
                "count": 1,
                "price": 2110143
              },
              {
                "objectID": 15080050131,
                "count": 2,
                "price": 174001
              },
              {
                "objectID": 15080050042,
                "count": 6,
                "price": 209751
              }
            ],
            "levelScore": "4428",
            "majorLevel": "1",
            "majorLevelMax": "5",
            "profitLossRatio": "64130015",
            "highKillDeathRatio": "13",
            "lowKillDeathRatio": "149",
            "medKillDeathRatio": "99",
            "totalEscape": "182",
            "totalFight": "441",
            "totalGainedPrice": "166096739",
            "totalGameTime": "357976",
            "totalKill": "253",
            "userRank": 23,
            "gunPlayList": [
              {
                "objectID": 18060000008,
                "escapeCount": 1,
                "fightCount": 16,
                "totalPrice": 553865
              },
              {
                "objectID": 18020000001,
                "escapeCount": 17,
                "fightCount": 40,
                "totalPrice": 16507876
              },
              {
                "objectID": 18010000015,
                "escapeCount": 1,
                "fightCount": 4,
                "totalPrice": 726140
              },
              {
                "objectID": 18010000017,
                "escapeCount": 2,
                "fightCount": 10,
                "totalPrice": 1935561
              },
              {
                "objectID": 18010000031,
                "escapeCount": 9,
                "fightCount": 17,
                "totalPrice": 3270525
              },
              {
                "objectID": 18060000009,
                "escapeCount": 6,
                "fightCount": 18,
                "totalPrice": 4498619
              },
              {
                "objectID": 18010000037,
                "escapeCount": 0,
                "fightCount": 2,
                "totalPrice": 0
              },
              {
                "objectID": 18070000005,
                "escapeCount": 7,
                "fightCount": 20,
                "totalPrice": 2771401
              },
              {
                "objectID": 18020000002,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18010000010,
                "escapeCount": 5,
                "fightCount": 14,
                "totalPrice": 2999631
              },
              {
                "objectID": 18010000006,
                "escapeCount": 5,
                "fightCount": 17,
                "totalPrice": 3571308
              },
              {
                "objectID": 18070000003,
                "escapeCount": 14,
                "fightCount": 50,
                "totalPrice": 16498350
              },
              {
                "objectID": 18010000040,
                "escapeCount": 3,
                "fightCount": 8,
                "totalPrice": 5727092
              },
              {
                "objectID": 18020000008,
                "escapeCount": 3,
                "fightCount": 11,
                "totalPrice": 2116804
              },
              {
                "objectID": 18020000006,
                "escapeCount": 7,
                "fightCount": 19,
                "totalPrice": 4859220
              },
              {
                "objectID": 18020000005,
                "escapeCount": 9,
                "fightCount": 13,
                "totalPrice": 7165188
              },
              {
                "objectID": 18040000004,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18050000002,
                "escapeCount": 1,
                "fightCount": 4,
                "totalPrice": 192374
              },
              {
                "objectID": 18010000021,
                "escapeCount": 0,
                "fightCount": 5,
                "totalPrice": 0
              },
              {
                "objectID": 18010000016,
                "escapeCount": 2,
                "fightCount": 8,
                "totalPrice": 2658102
              },
              {
                "objectID": 18020000003,
                "escapeCount": 5,
                "fightCount": 14,
                "totalPrice": 3385815
              },
              {
                "objectID": 18010000013,
                "escapeCount": 7,
                "fightCount": 22,
                "totalPrice": 7769661
              },
              {
                "objectID": 18020000011,
                "escapeCount": 1,
                "fightCount": 2,
                "totalPrice": 1826594
              },
              {
                "objectID": 18010000001,
                "escapeCount": 12,
                "fightCount": 19,
                "totalPrice": 8489283
              },
              {
                "objectID": 18010000038,
                "escapeCount": 1,
                "fightCount": 22,
                "totalPrice": 330085
              },
              {
                "objectID": 18010000018,
                "escapeCount": 13,
                "fightCount": 32,
                "totalPrice": 9283058
              },
              {
                "objectID": 18040000002,
                "escapeCount": 2,
                "fightCount": 4,
                "totalPrice": 288135
              },
              {
                "objectID": 18020000009,
                "escapeCount": 4,
                "fightCount": 12,
                "totalPrice": 1971512
              },
              {
                "objectID": 18020000010,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18060000007,
                "escapeCount": 1,
                "fightCount": 5,
                "totalPrice": 666651
              },
              {
                "objectID": 18010000008,
                "escapeCount": 3,
                "fightCount": 9,
                "totalPrice": 2362591
              },
              {
                "objectID": 18010000024,
                "escapeCount": 4,
                "fightCount": 14,
                "totalPrice": 2368038
              },
              {
                "objectID": 18020000004,
                "escapeCount": 24,
                "fightCount": 53,
                "totalPrice": 27479928
              },
              {
                "objectID": 18030000002,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              }
            ]
          }
        },
        "msg": "ok"
      }
    },
    "mp": {
      "data": {
        "code": 0,
        "data": {
          "mpDetail": {
            "avgKillPerMinute": "188",
            "avgScorePerMinute": "78918",
            "totalFight": "43",
            "totalGameTime": "791",
            "totalScore": "624243",
            "totalVehicleDestroyed": "12",
            "totalVehicleKill": "28",
            "totalWin": "19",
            "levelScore": "2309",
            "majorLevel": "0",
            "majorLevelMax": "4",
            "winRatio": "44",
            "redTotalMoney": 23433646,
            "redTotalCount": 42,
            "mapList": [
              {
                "mapID": 210,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 107,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 114,
                "totalCount": 1,
                "leaveCount": 0
              },
              {
                "mapID": 303,
                "totalCount": 2,
                "leaveCount": 2
              },
              {
                "mapID": 75,
                "totalCount": 4,
                "leaveCount": 0
              },
              {
                "mapID": 111,
                "totalCount": 2,
                "leaveCount": 0
              },
              {
                "mapID": 113,
                "totalCount": 4,
                "leaveCount": 3
              },
              {
                "mapID": 33,
                "totalCount": 5,
                "leaveCount": 1
              },
              {
                "mapID": 121,
                "totalCount": 4,
                "leaveCount": 2
              },
              {
                "mapID": 103,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 34,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 54,
                "totalCount": 3,
                "leaveCount": 2
              },
              {
                "mapID": 112,
                "totalCount": 1,
                "leaveCount": 0
              },
              {
                "mapID": 108,
                "totalCount": 4,
                "leaveCount": 2
              },
              {
                "mapID": 302,
                "totalCount": 4,
                "leaveCount": 3
              },
              {
                "mapID": 801,
                "totalCount": 1,
                "leaveCount": 0
              }
            ],
            "redCollectionList": [
              {
                "objectID": 15030050013,
                "count": 4,
                "price": 471504
              },
              {
                "objectID": 15060080015,
                "count": 5,
                "price": 358645
              },
              {
                "objectID": 15080050031,
                "count": 1,
                "price": 2154765
              },
              {
                "objectID": 15030050004,
                "count": 1,
                "price": 759856
              },
              {
                "objectID": 15080050014,
                "count": 2,
                "price": 228246
              },
              {
                "objectID": 15070040003,
                "count": 4,
                "price": 240258
              },
              {
                "objectID": 15080050131,
                "count": 2,
                "price": 184852
              },
              {
                "objectID": 15090910088,
                "count": 1,
                "price": 75000
              },
              {
                "objectID": 15080050032,
                "count": 1,
                "price": 905135
              },
              {
                "objectID": 15030050001,
                "count": 1,
                "price": 352858
              },
              {
                "objectID": 15080050058,
                "count": 2,
                "price": 1401546
              },
              {
                "objectID": 15080040001,
                "count": 2,
                "price": 368465
              },
              {
                "objectID": 15080050042,
                "count": 6,
                "price": 223654
              },
              {
                "objectID": 15030050008,
                "count": 1,
                "price": 1516045
              },
              {
                "objectID": 15030050018,
                "count": 1,
                "price": 409050
              },
              {
                "objectID": 15010050001,
                "count": 1,
                "price": 455560
              },
              {
                "objectID": 15020010033,
                "count": 1,
                "price": 1498562
              },
              {
                "objectID": 15030050017,
                "count": 1,
                "price": 1535984
              },
              {
                "objectID": 15070050001,
                "count": 4,
                "price": 291888
              },
              {
                "objectID": 15080050040,
                "count": 1,
                "price": 2254864
              }
            ],
            "callVehicle": 0,
            "callRebirth": 0,
            "callMissile": 0,
            "callRescue": 0,
            "operatorList": []
          }
        },
        "msg": "ok"
      }
    }
  },
  "message": "获取个人中心数据成功",
  "amsSerial": "AMS-DFM-0721104408-E6QK8R-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:44:08.952Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» sol|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» solDetail|object|true|none||none|
|»»»»»» redTotalMoney|integer|true|none||none|
|»»»»»» redTotalCount|integer|true|none||none|
|»»»»»» mapList|[object]|true|none||none|
|»»»»»»» mapID|integer|true|none||none|
|»»»»»»» totalCount|integer|true|none||none|
|»»»»»»» leaveCount|integer|true|none||none|
|»»»»»» redCollectionDetail|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» count|integer|true|none||none|
|»»»»»»» price|integer|true|none||none|
|»»»»»» levelScore|string|true|none||none|
|»»»»»» majorLevel|string|true|none||none|
|»»»»»» majorLevelMax|string|true|none||none|
|»»»»»» profitLossRatio|string|true|none||none|
|»»»»»» highKillDeathRatio|string|true|none||none|
|»»»»»» lowKillDeathRatio|string|true|none||none|
|»»»»»» medKillDeathRatio|string|true|none||none|
|»»»»»» totalEscape|string|true|none||none|
|»»»»»» totalFight|string|true|none||none|
|»»»»»» totalGainedPrice|string|true|none||none|
|»»»»»» totalGameTime|string|true|none||none|
|»»»»»» totalKill|string|true|none||none|
|»»»»»» userRank|integer|true|none||none|
|»»»»»» gunPlayList|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» escapeCount|integer|true|none||none|
|»»»»»»» fightCount|integer|true|none||none|
|»»»»»»» totalPrice|integer|true|none||none|
|»»»» msg|string|true|none||none|
|»» mp|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» mpDetail|object|true|none||none|
|»»»»»» avgKillPerMinute|string|true|none||none|
|»»»»»» avgScorePerMinute|string|true|none||none|
|»»»»»» totalFight|string|true|none||none|
|»»»»»» totalGameTime|string|true|none||none|
|»»»»»» totalScore|string|true|none||none|
|»»»»»» totalVehicleDestroyed|string|true|none||none|
|»»»»»» totalVehicleKill|string|true|none||none|
|»»»»»» totalWin|string|true|none||none|
|»»»»»» levelScore|string|true|none||none|
|»»»»»» majorLevel|string|true|none||none|
|»»»»»» majorLevelMax|string|true|none||none|
|»»»»»» winRatio|string|true|none||none|
|»»»»»» redTotalMoney|integer|true|none||none|
|»»»»»» redTotalCount|integer|true|none||none|
|»»»»»» mapList|[object]|true|none||none|
|»»»»»»» mapID|integer|true|none||none|
|»»»»»»» totalCount|integer|true|none||none|
|»»»»»»» leaveCount|integer|true|none||none|
|»»»»»» redCollectionList|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» count|integer|true|none||none|
|»»»»»»» price|integer|true|none||none|
|»»»»»» callVehicle|integer|true|none||none|
|»»»»»» callRebirth|integer|true|none||none|
|»»»»»» callMissile|integer|true|none||none|
|»»»»»» callRescue|integer|true|none||none|
|»»»»»» operatorList|[string]|true|none||none|
|»»»» msg|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 流水查询

GET /df/person/flows

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|page|query|string| 否 |none|
|limit|query|string| 否 |none|
|type|query|string| 否 |1-设备、2-道具、3-货币|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": [
    {
      "vRoleName": "浅巷墨黎6",
      "loginDay": "91",
      "Level": 58,
      "LoginArr": [
        {
          "indtEventTime": "2025-07-15 07:53:18",
          "outdtEventTime": "2025-07-15 07:54:38",
          "vClientIP": "171.*.*.184",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-15 07:50:45",
          "outdtEventTime": "2025-07-15 07:52:21",
          "vClientIP": "171.*.*.184",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-14 22:18:00",
          "outdtEventTime": "2025-07-14 22:58:06",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "AuthenticAMDAMD Ryzen 7 7745HX with Radeon Graphics"
        },
        {
          "indtEventTime": "2025-07-14 20:16:17",
          "outdtEventTime": "2025-07-14 20:42:47",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "AuthenticAMDAMD Ryzen 7 7745HX with Radeon Graphics"
        },
        {
          "indtEventTime": "2025-07-14 20:02:20",
          "outdtEventTime": "2025-07-14 20:05:08",
          "vClientIP": "171.*.*.184",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-14 07:32:26",
          "outdtEventTime": "2025-07-14 07:36:45",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-13 20:43:37",
          "outdtEventTime": "2025-07-13 22:33:04",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "AuthenticAMDAMD Ryzen 7 7745HX with Radeon Graphics"
        },
        {
          "indtEventTime": "2025-07-13 15:52:20",
          "outdtEventTime": "2025-07-13 15:58:02",
          "vClientIP": "110.*.*.254",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-13 07:36:22",
          "outdtEventTime": "2025-07-13 07:37:48",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-13 07:35:52",
          "outdtEventTime": "2025-07-13 07:35:59",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-13 07:35:12",
          "outdtEventTime": "2025-07-13 07:35:46",
          "vClientIP": "182.*.*.37",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-12 15:05:28",
          "outdtEventTime": "2025-07-12 15:08:42",
          "vClientIP": "182.*.*.35",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-12 07:44:21",
          "outdtEventTime": "2025-07-12 07:46:48",
          "vClientIP": "182.*.*.35",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-11 19:29:06",
          "outdtEventTime": "2025-07-11 19:31:43",
          "vClientIP": "39.*.*.135",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-11 19:24:48",
          "outdtEventTime": "2025-07-11 19:25:31",
          "vClientIP": "39.*.*.135",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-11 16:48:50",
          "outdtEventTime": "2025-07-11 16:52:12",
          "vClientIP": "39.*.*.174",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-11 16:38:03",
          "outdtEventTime": "2025-07-11 16:40:25",
          "vClientIP": "39.*.*.174",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-11 07:34:20",
          "outdtEventTime": "2025-07-11 07:37:03",
          "vClientIP": "118.*.*.96",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-10 21:41:22",
          "outdtEventTime": "2025-07-10 21:43:40",
          "vClientIP": "118.*.*.96",
          "SystemHardware": "AuthenticAMDAMD Ryzen 7 7745HX with Radeon Graphics"
        },
        {
          "indtEventTime": "2025-07-10 19:54:19",
          "outdtEventTime": "2025-07-10 19:56:05",
          "vClientIP": "110.*.*.65",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-10 15:37:21",
          "outdtEventTime": "2025-07-10 15:38:03",
          "vClientIP": "110.*.*.65",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-10 15:33:42",
          "outdtEventTime": "2025-07-10 15:35:24",
          "vClientIP": "110.*.*.65",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-10 09:39:03",
          "outdtEventTime": "2025-07-10 09:41:12",
          "vClientIP": "110.*.*.65",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        },
        {
          "indtEventTime": "2025-07-09 20:14:46",
          "outdtEventTime": "2025-07-09 20:19:22",
          "vClientIP": "118.*.*.96",
          "SystemHardware": "AuthenticAMDAMD Ryzen 7 7745HX with Radeon Graphics"
        },
        {
          "indtEventTime": "2025-07-09 16:26:41",
          "outdtEventTime": "2025-07-09 16:30:42",
          "vClientIP": "110.*.*.65",
          "SystemHardware": "Xiaomi24129PN74CAdreno TM 830"
        }
      ]
    }
  ],
  "message": "ok",
  "amsSerial": "AMS-DFM-0721104631-EDAMJO-661959-319386",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:46:32.018Z"
  }
}
```

```json
{
  "success": true,
  "data": {
    "sol": {
      "data": {
        "code": 0,
        "data": {
          "solDetail": {
            "redTotalMoney": 23317001,
            "redTotalCount": 41,
            "mapList": [
              {
                "mapID": 1901,
                "totalCount": 71,
                "leaveCount": 23
              },
              {
                "mapID": 2231,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 3901,
                "totalCount": 44,
                "leaveCount": 15
              },
              {
                "mapID": 8102,
                "totalCount": 11,
                "leaveCount": 2
              },
              {
                "mapID": 2202,
                "totalCount": 24,
                "leaveCount": 8
              },
              {
                "mapID": 2201,
                "totalCount": 63,
                "leaveCount": 28
              },
              {
                "mapID": 1902,
                "totalCount": 115,
                "leaveCount": 46
              },
              {
                "mapID": 3902,
                "totalCount": 109,
                "leaveCount": 57
              },
              {
                "mapID": 8803,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 80,
                "totalCount": 1,
                "leaveCount": 1
              },
              {
                "mapID": 8103,
                "totalCount": 2,
                "leaveCount": 1
              }
            ],
            "redCollectionDetail": [
              {
                "objectID": 15070040003,
                "count": 4,
                "price": 227605
              },
              {
                "objectID": 15030050018,
                "count": 1,
                "price": 386743
              },
              {
                "objectID": 15010050001,
                "count": 1,
                "price": 431607
              },
              {
                "objectID": 15080050014,
                "count": 2,
                "price": 214066
              },
              {
                "objectID": 15030050017,
                "count": 1,
                "price": 1447283
              },
              {
                "objectID": 15080040001,
                "count": 2,
                "price": 345854
              },
              {
                "objectID": 15030050008,
                "count": 1,
                "price": 1420939
              },
              {
                "objectID": 15080050032,
                "count": 1,
                "price": 915778
              },
              {
                "objectID": 15030050004,
                "count": 1,
                "price": 1010690
              },
              {
                "objectID": 15080050058,
                "count": 2,
                "price": 1666777
              },
              {
                "objectID": 15020010033,
                "count": 1,
                "price": 1498562
              },
              {
                "objectID": 15030050001,
                "count": 1,
                "price": 331739
              },
              {
                "objectID": 15030050013,
                "count": 4,
                "price": 471504
              },
              {
                "objectID": 15070050001,
                "count": 4,
                "price": 274058
              },
              {
                "objectID": 15060080015,
                "count": 5,
                "price": 336841
              },
              {
                "objectID": 15080050040,
                "count": 1,
                "price": 2126742
              },
              {
                "objectID": 15080050031,
                "count": 1,
                "price": 2110143
              },
              {
                "objectID": 15080050131,
                "count": 2,
                "price": 174001
              },
              {
                "objectID": 15080050042,
                "count": 6,
                "price": 209751
              }
            ],
            "levelScore": "4428",
            "majorLevel": "1",
            "majorLevelMax": "5",
            "profitLossRatio": "64130015",
            "highKillDeathRatio": "13",
            "lowKillDeathRatio": "149",
            "medKillDeathRatio": "99",
            "totalEscape": "182",
            "totalFight": "441",
            "totalGainedPrice": "166096739",
            "totalGameTime": "357976",
            "totalKill": "253",
            "userRank": 23,
            "gunPlayList": [
              {
                "objectID": 18060000008,
                "escapeCount": 1,
                "fightCount": 16,
                "totalPrice": 553865
              },
              {
                "objectID": 18020000001,
                "escapeCount": 17,
                "fightCount": 40,
                "totalPrice": 16507876
              },
              {
                "objectID": 18010000015,
                "escapeCount": 1,
                "fightCount": 4,
                "totalPrice": 726140
              },
              {
                "objectID": 18010000017,
                "escapeCount": 2,
                "fightCount": 10,
                "totalPrice": 1935561
              },
              {
                "objectID": 18010000031,
                "escapeCount": 9,
                "fightCount": 17,
                "totalPrice": 3270525
              },
              {
                "objectID": 18060000009,
                "escapeCount": 6,
                "fightCount": 18,
                "totalPrice": 4498619
              },
              {
                "objectID": 18010000037,
                "escapeCount": 0,
                "fightCount": 2,
                "totalPrice": 0
              },
              {
                "objectID": 18070000005,
                "escapeCount": 7,
                "fightCount": 20,
                "totalPrice": 2771401
              },
              {
                "objectID": 18020000002,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18010000010,
                "escapeCount": 5,
                "fightCount": 14,
                "totalPrice": 2999631
              },
              {
                "objectID": 18010000006,
                "escapeCount": 5,
                "fightCount": 17,
                "totalPrice": 3571308
              },
              {
                "objectID": 18070000003,
                "escapeCount": 14,
                "fightCount": 50,
                "totalPrice": 16498350
              },
              {
                "objectID": 18010000040,
                "escapeCount": 3,
                "fightCount": 8,
                "totalPrice": 5727092
              },
              {
                "objectID": 18020000008,
                "escapeCount": 3,
                "fightCount": 11,
                "totalPrice": 2116804
              },
              {
                "objectID": 18020000006,
                "escapeCount": 7,
                "fightCount": 19,
                "totalPrice": 4859220
              },
              {
                "objectID": 18020000005,
                "escapeCount": 9,
                "fightCount": 13,
                "totalPrice": 7165188
              },
              {
                "objectID": 18040000004,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18050000002,
                "escapeCount": 1,
                "fightCount": 4,
                "totalPrice": 192374
              },
              {
                "objectID": 18010000021,
                "escapeCount": 0,
                "fightCount": 5,
                "totalPrice": 0
              },
              {
                "objectID": 18010000016,
                "escapeCount": 2,
                "fightCount": 8,
                "totalPrice": 2658102
              },
              {
                "objectID": 18020000003,
                "escapeCount": 5,
                "fightCount": 14,
                "totalPrice": 3385815
              },
              {
                "objectID": 18010000013,
                "escapeCount": 7,
                "fightCount": 22,
                "totalPrice": 7769661
              },
              {
                "objectID": 18020000011,
                "escapeCount": 1,
                "fightCount": 2,
                "totalPrice": 1826594
              },
              {
                "objectID": 18010000001,
                "escapeCount": 12,
                "fightCount": 19,
                "totalPrice": 8489283
              },
              {
                "objectID": 18010000038,
                "escapeCount": 1,
                "fightCount": 22,
                "totalPrice": 330085
              },
              {
                "objectID": 18010000018,
                "escapeCount": 13,
                "fightCount": 32,
                "totalPrice": 9283058
              },
              {
                "objectID": 18040000002,
                "escapeCount": 2,
                "fightCount": 4,
                "totalPrice": 288135
              },
              {
                "objectID": 18020000009,
                "escapeCount": 4,
                "fightCount": 12,
                "totalPrice": 1971512
              },
              {
                "objectID": 18020000010,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              },
              {
                "objectID": 18060000007,
                "escapeCount": 1,
                "fightCount": 5,
                "totalPrice": 666651
              },
              {
                "objectID": 18010000008,
                "escapeCount": 3,
                "fightCount": 9,
                "totalPrice": 2362591
              },
              {
                "objectID": 18010000024,
                "escapeCount": 4,
                "fightCount": 14,
                "totalPrice": 2368038
              },
              {
                "objectID": 18020000004,
                "escapeCount": 24,
                "fightCount": 53,
                "totalPrice": 27479928
              },
              {
                "objectID": 18030000002,
                "escapeCount": 0,
                "fightCount": 1,
                "totalPrice": 0
              }
            ]
          }
        },
        "msg": "ok"
      }
    },
    "mp": {
      "data": {
        "code": 0,
        "data": {
          "mpDetail": {
            "avgKillPerMinute": "188",
            "avgScorePerMinute": "78918",
            "totalFight": "43",
            "totalGameTime": "791",
            "totalScore": "624243",
            "totalVehicleDestroyed": "12",
            "totalVehicleKill": "28",
            "totalWin": "19",
            "levelScore": "2309",
            "majorLevel": "0",
            "majorLevelMax": "4",
            "winRatio": "44",
            "redTotalMoney": 23433646,
            "redTotalCount": 42,
            "mapList": [
              {
                "mapID": 210,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 107,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 114,
                "totalCount": 1,
                "leaveCount": 0
              },
              {
                "mapID": 303,
                "totalCount": 2,
                "leaveCount": 2
              },
              {
                "mapID": 75,
                "totalCount": 4,
                "leaveCount": 0
              },
              {
                "mapID": 111,
                "totalCount": 2,
                "leaveCount": 0
              },
              {
                "mapID": 113,
                "totalCount": 4,
                "leaveCount": 3
              },
              {
                "mapID": 33,
                "totalCount": 5,
                "leaveCount": 1
              },
              {
                "mapID": 121,
                "totalCount": 4,
                "leaveCount": 2
              },
              {
                "mapID": 103,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 34,
                "totalCount": 2,
                "leaveCount": 1
              },
              {
                "mapID": 54,
                "totalCount": 3,
                "leaveCount": 2
              },
              {
                "mapID": 112,
                "totalCount": 1,
                "leaveCount": 0
              },
              {
                "mapID": 108,
                "totalCount": 4,
                "leaveCount": 2
              },
              {
                "mapID": 302,
                "totalCount": 4,
                "leaveCount": 3
              },
              {
                "mapID": 801,
                "totalCount": 1,
                "leaveCount": 0
              }
            ],
            "redCollectionList": [
              {
                "objectID": 15030050013,
                "count": 4,
                "price": 471504
              },
              {
                "objectID": 15060080015,
                "count": 5,
                "price": 358645
              },
              {
                "objectID": 15080050031,
                "count": 1,
                "price": 2154765
              },
              {
                "objectID": 15030050004,
                "count": 1,
                "price": 759856
              },
              {
                "objectID": 15080050014,
                "count": 2,
                "price": 228246
              },
              {
                "objectID": 15070040003,
                "count": 4,
                "price": 240258
              },
              {
                "objectID": 15080050131,
                "count": 2,
                "price": 184852
              },
              {
                "objectID": 15090910088,
                "count": 1,
                "price": 75000
              },
              {
                "objectID": 15080050032,
                "count": 1,
                "price": 905135
              },
              {
                "objectID": 15030050001,
                "count": 1,
                "price": 352858
              },
              {
                "objectID": 15080050058,
                "count": 2,
                "price": 1401546
              },
              {
                "objectID": 15080040001,
                "count": 2,
                "price": 368465
              },
              {
                "objectID": 15080050042,
                "count": 6,
                "price": 223654
              },
              {
                "objectID": 15030050008,
                "count": 1,
                "price": 1516045
              },
              {
                "objectID": 15030050018,
                "count": 1,
                "price": 409050
              },
              {
                "objectID": 15010050001,
                "count": 1,
                "price": 455560
              },
              {
                "objectID": 15020010033,
                "count": 1,
                "price": 1498562
              },
              {
                "objectID": 15030050017,
                "count": 1,
                "price": 1535984
              },
              {
                "objectID": 15070050001,
                "count": 4,
                "price": 291888
              },
              {
                "objectID": 15080050040,
                "count": 1,
                "price": 2254864
              }
            ],
            "callVehicle": 0,
            "callRebirth": 0,
            "callMissile": 0,
            "callRescue": 0,
            "operatorList": []
          }
        },
        "msg": "ok"
      }
    }
  },
  "message": "获取个人中心数据成功",
  "amsSerial": "AMS-DFM-0721104408-E6QK8R-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:44:08.952Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» sol|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» solDetail|object|true|none||none|
|»»»»»» redTotalMoney|integer|true|none||none|
|»»»»»» redTotalCount|integer|true|none||none|
|»»»»»» mapList|[object]|true|none||none|
|»»»»»»» mapID|integer|true|none||none|
|»»»»»»» totalCount|integer|true|none||none|
|»»»»»»» leaveCount|integer|true|none||none|
|»»»»»» redCollectionDetail|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» count|integer|true|none||none|
|»»»»»»» price|integer|true|none||none|
|»»»»»» levelScore|string|true|none||none|
|»»»»»» majorLevel|string|true|none||none|
|»»»»»» majorLevelMax|string|true|none||none|
|»»»»»» profitLossRatio|string|true|none||none|
|»»»»»» highKillDeathRatio|string|true|none||none|
|»»»»»» lowKillDeathRatio|string|true|none||none|
|»»»»»» medKillDeathRatio|string|true|none||none|
|»»»»»» totalEscape|string|true|none||none|
|»»»»»» totalFight|string|true|none||none|
|»»»»»» totalGainedPrice|string|true|none||none|
|»»»»»» totalGameTime|string|true|none||none|
|»»»»»» totalKill|string|true|none||none|
|»»»»»» userRank|integer|true|none||none|
|»»»»»» gunPlayList|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» escapeCount|integer|true|none||none|
|»»»»»»» fightCount|integer|true|none||none|
|»»»»»»» totalPrice|integer|true|none||none|
|»»»» msg|string|true|none||none|
|»» mp|object|true|none||none|
|»»» data|object|true|none||none|
|»»»» code|integer|true|none||none|
|»»»» data|object|true|none||none|
|»»»»» mpDetail|object|true|none||none|
|»»»»»» avgKillPerMinute|string|true|none||none|
|»»»»»» avgScorePerMinute|string|true|none||none|
|»»»»»» totalFight|string|true|none||none|
|»»»»»» totalGameTime|string|true|none||none|
|»»»»»» totalScore|string|true|none||none|
|»»»»»» totalVehicleDestroyed|string|true|none||none|
|»»»»»» totalVehicleKill|string|true|none||none|
|»»»»»» totalWin|string|true|none||none|
|»»»»»» levelScore|string|true|none||none|
|»»»»»» majorLevel|string|true|none||none|
|»»»»»» majorLevelMax|string|true|none||none|
|»»»»»» winRatio|string|true|none||none|
|»»»»»» redTotalMoney|integer|true|none||none|
|»»»»»» redTotalCount|integer|true|none||none|
|»»»»»» mapList|[object]|true|none||none|
|»»»»»»» mapID|integer|true|none||none|
|»»»»»»» totalCount|integer|true|none||none|
|»»»»»»» leaveCount|integer|true|none||none|
|»»»»»» redCollectionList|[object]|true|none||none|
|»»»»»»» objectID|integer|true|none||none|
|»»»»»»» count|integer|true|none||none|
|»»»»»»» price|integer|true|none||none|
|»»»»»» callVehicle|integer|true|none||none|
|»»»»»» callRebirth|integer|true|none||none|
|»»»»»» callMissile|integer|true|none||none|
|»»»»»» callRescue|integer|true|none||none|
|»»»»»» operatorList|[string]|true|none||none|
|»»»» msg|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 货币查询

GET /df/person/money

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|item|query|string| 否 |17020000010-哈夫币（不加就是全部）|
|Authorization|header|string| 否 |none|

#### 详细说明

**item**: 17020000010-哈夫币（不加就是全部）
17888808889-三角券
17888808888-三角币

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "item": "17020000010",
      "name": "哈夫币",
      "totalMoney": "5915274"
    },
    {
      "item": "17888808889",
      "name": "三角券",
      "totalMoney": "609"
    },
    {
      "item": "17888808888",
      "name": "三角币",
      "totalMoney": "113"
    }
  ],
  "message": "获取货币资产成功",
  "amsSerial": "AMS-DFM-0721104843-gi5ajX-661959-319386",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:48:43.790Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|[object]|true|none||none|
|»» item|string|true|none||none|
|»» name|string|true|none||none|
|»» totalMoney|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 战绩查询

GET /df/person/record

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|type|query|string| 否 |4烽火5全面|
|page|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": [
    {
      "MapId": "1902",
      "EscapeFailReason": 1,
      "FinalPrice": "469497",
      "KeyChainCarryOutPrice": "469497",
      "CarryoutSafeBoxPrice": 0,
      "KeyChainCarryInPrice": 0,
      "CarryoutSelfPrice": 0,
      "dtEventTime": "2025-07-14 22:54:26",
      "ArmedForceId": 20003,
      "DurationS": 1469,
      "KillCount": 1,
      "KillPlayerAICount": 0,
      "KillAICount": 4,
      "teammateArr": [
        {
          "ArmedForceId": 20003,
          "EscapeFailReason": 1,
          "dtEventTime": "2025-07-14 22:54:26",
          "MapId": "1902",
          "FinalPrice": "469497",
          "KeyChainCarryOutPrice": "469497",
          "CarryoutSafeBoxPrice": 0,
          "KeyChainCarryInPrice": 0,
          "CarryoutSelfPrice": 0,
          "vopenid": true,
          "TeamId": "1",
          "DurationS": 1469,
          "KillCount": 1,
          "KillAICount": 4,
          "KillPlayerAICount": 0,
          "Rescue": 0,
          "nickName": ""
        },
        {
          "ArmedForceId": 40005,
          "EscapeFailReason": 1,
          "dtEventTime": "2025-07-14 22:54:43",
          "MapId": "1902",
          "FinalPrice": "666101",
          "KeyChainCarryOutPrice": "666101",
          "CarryoutSafeBoxPrice": 0,
          "KeyChainCarryInPrice": 0,
          "CarryoutSelfPrice": 0,
          "vopenid": false,
          "TeamId": "1",
          "DurationS": 1486,
          "KillCount": 1,
          "KillAICount": 6,
          "KillPlayerAICount": 0,
          "Rescue": 0,
          "nickName": ""
        },
        {
          "ArmedForceId": 20003,
          "EscapeFailReason": 7,
          "dtEventTime": "2025-07-14 22:36:30",
          "MapId": "1902",
          "FinalPrice": "347651",
          "KeyChainCarryOutPrice": "347651",
          "CarryoutSafeBoxPrice": 0,
          "KeyChainCarryInPrice": 0,
          "CarryoutSelfPrice": 0,
          "vopenid": false,
          "TeamId": "1",
          "DurationS": 393,
          "KillCount": 0,
          "KillAICount": 5,
          "KillPlayerAICount": 0,
          "Rescue": 0,
          "nickName": ""
        }
      ],
      "flowCalGainedPrice": 189966
    }
  ],
  "message": "ok",
  "amsSerial": "AMS-DFM-0721105041-lz0e6e-661959-319386",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:50:42.024Z"
  }
}
```

```json
{
  "success": true,
  "data": [
    {
      "MapID": "108",
      "MatchResult": 2,
      "dtEventTime": "2025-07-14 20:35:57",
      "KillNum": 0,
      "Death": 5,
      "Assist": 0,
      "TotalScore": 6804,
      "KillPlayer": 0,
      "KilledByPlayer": 1,
      "RoleId": "3550870590954844384",
      "RoomId": "648521219674520209",
      "gametime": 1059,
      "RescueTeammateCount": 0,
      "ArmedForceId": 10010,
      "RoomInfo": {
        "code": 0,
        "data": {
          "mpDetailList": [
            {
              "color": 2,
              "killNum": 0,
              "assist": 0,
              "death": 2,
              "mapID": 108,
              "gameTime": 83,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 150,
              "matchResult": 3,
              "nickName": "MarSJZ",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 34,
              "assist": 9,
              "death": 5,
              "mapID": 108,
              "gameTime": 802,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 15077,
              "matchResult": 1,
              "nickName": "A%E5%92%96ak",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 30,
              "assist": 10,
              "death": 6,
              "mapID": 108,
              "gameTime": 1058,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 14364,
              "matchResult": 1,
              "nickName": "%E8%9B%87%E5%AE%89X",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 19,
              "assist": 4,
              "death": 5,
              "mapID": 108,
              "gameTime": 561,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 8171,
              "matchResult": 3,
              "nickName": "%E8%A6%81%E5%A4%A7%E7%BA%A2%E4%B9%9F%E6%83%B3%E8%A6%81%E5%A5%B9",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 0,
              "assist": 0,
              "death": 1,
              "mapID": 108,
              "gameTime": 11,
              "startTime": "0",
              "rescueTeammateCount": 0,
              "totalScore": 0,
              "matchResult": 3,
              "nickName": "Taran34",
              "rank": 0,
              "armedForceType": 0,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 37,
              "assist": 13,
              "death": 5,
              "mapID": 108,
              "gameTime": 823,
              "startTime": "1752495540",
              "rescueTeammateCount": 1,
              "totalScore": 18205,
              "matchResult": 1,
              "nickName": "%E7%B3%B8%E8%89%B2%E6%9C%9B%E3%81%AE%E5%B9%B3%E5%87%A1",
              "rank": 0,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 14,
              "assist": 0,
              "death": 3,
              "mapID": 108,
              "gameTime": 864,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 11641,
              "matchResult": 2,
              "nickName": "%E7%88%B1%E7%94%9F%E7%85%8E%E5%8C%85%E7%9A%84%E5%8C%85%E5%8C%85",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 13,
              "assist": 3,
              "death": 3,
              "mapID": 108,
              "gameTime": 933,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 10495,
              "matchResult": 1,
              "nickName": "%E9%BC%A0%E9%BC%A0%E8%82%9A%E5%AD%90%E6%89%93%E9%9B%B7%E5%98%9E",
              "rank": 0,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 20,
              "assist": 4,
              "death": 5,
              "mapID": 108,
              "gameTime": 856,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 15061,
              "matchResult": 2,
              "nickName": "%E7%9F%B3%E6%A3%BA%E6%B4%9E%E8%B5%A6%E9%BE%99%E7%BB%84",
              "rank": 0,
              "armedForceType": 10011,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 22,
              "assist": 6,
              "death": 7,
              "mapID": 108,
              "gameTime": 686,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 9993,
              "matchResult": 2,
              "nickName": "jJJccccc",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 4,
              "assist": 2,
              "death": 1,
              "mapID": 108,
              "gameTime": 817,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 5479,
              "matchResult": 2,
              "nickName": "%E5%90%AC%E5%B3%B0%E8%AF%B4%E9%9B%BE",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 61,
              "assist": 5,
              "death": 4,
              "mapID": 108,
              "gameTime": 1056,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 21742,
              "matchResult": 1,
              "nickName": "%E5%A8%81%E9%A3%8E%E4%B9%8B%E9%BE%99%E9%95%87%E9%AD%82%E6%9B%B2",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 1,
              "assist": 1,
              "death": 12,
              "mapID": 108,
              "gameTime": 912,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 4891,
              "matchResult": 3,
              "nickName": "%E4%BF%BA%E5%B0%B1%E6%98%AF%E4%B8%96%E4%B8%80%E6%AD%A5",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 0,
              "assist": 0,
              "death": 5,
              "mapID": 108,
              "gameTime": 1059,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 6804,
              "matchResult": 2,
              "nickName": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": true,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 2,
              "assist": 0,
              "death": 3,
              "mapID": 108,
              "gameTime": 150,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 1327,
              "matchResult": 3,
              "nickName": "%E5%A8%81%E5%BB%89%E5%93%A5%E5%93%A5gt",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 26,
              "assist": 3,
              "death": 0,
              "mapID": 108,
              "gameTime": 535,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 12260,
              "matchResult": 1,
              "nickName": "%E5%90%B4%E5%BD%A6%E7%A5%96%E6%9C%AC%E7%A5%96%E8%AF%B6",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 3,
              "assist": 2,
              "death": 7,
              "mapID": 108,
              "gameTime": 1057,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 4389,
              "matchResult": 1,
              "nickName": "TroubleV",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 21,
              "assist": 3,
              "death": 6,
              "mapID": 108,
              "gameTime": 934,
              "startTime": "1752495540",
              "rescueTeammateCount": 1,
              "totalScore": 12304,
              "matchResult": 1,
              "nickName": "MikuMikuOeO",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 23,
              "assist": 2,
              "death": 4,
              "mapID": 108,
              "gameTime": 934,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 12590,
              "matchResult": 1,
              "nickName": "%E9%BC%A0%E9%BC%A0%E6%88%91%E5%91%80%E7%B1%B3%E8%A5%BF%E4%BA%86",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 15,
              "assist": 3,
              "death": 7,
              "mapID": 108,
              "gameTime": 1057,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 9177,
              "matchResult": 1,
              "nickName": "NALXG",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 4,
              "assist": 8,
              "death": 10,
              "mapID": 108,
              "gameTime": 726,
              "startTime": "1752495540",
              "rescueTeammateCount": 1,
              "totalScore": 7687,
              "matchResult": 3,
              "nickName": "%E7%91%9F%E7%89%B9%E5%85%8B%E6%96%AF",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 11,
              "assist": 4,
              "death": 0,
              "mapID": 108,
              "gameTime": 1058,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 10749,
              "matchResult": 1,
              "nickName": "%E9%AA%91%E8%BD%A6%E7%BF%BB%E6%B2%9F%E9%87%8C",
              "rank": 0,
              "armedForceType": 30010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 2,
              "assist": 6,
              "death": 4,
              "mapID": 108,
              "gameTime": 761,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 4923,
              "matchResult": 2,
              "nickName": "%E9%BB%8D%E9%BB%8D%E5%A3%B0%E5%A3%B0MAN",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 14,
              "assist": 3,
              "death": 8,
              "mapID": 108,
              "gameTime": 714,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 8094,
              "matchResult": 3,
              "nickName": "NingingingingL",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 4,
              "assist": 2,
              "death": 1,
              "mapID": 108,
              "gameTime": 514,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 2517,
              "matchResult": 3,
              "nickName": "daiyao235",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 16,
              "assist": 14,
              "death": 9,
              "mapID": 108,
              "gameTime": 935,
              "startTime": "1752495540",
              "rescueTeammateCount": 0,
              "totalScore": 15219,
              "matchResult": 2,
              "nickName": "%E6%B5%81%E5%B9%B4%E6%B2%BE%E6%9F%93%E9%9D%92%E6%98%A5",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 19,
              "assist": 5,
              "death": 14,
              "mapID": 108,
              "gameTime": 831,
              "startTime": "1752495540",
              "rescueTeammateCount": 4,
              "totalScore": 11156,
              "matchResult": 2,
              "nickName": "%E8%81%AA%E6%98%8E%E8%80%81%E8%B5%84",
              "rank": 0,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            }
          ]
        },
        "msg": "ok"
      }
    },
    {
      "MapID": "108",
      "MatchResult": 1,
      "dtEventTime": "2025-07-13 22:31:30",
      "KillNum": 21,
      "Death": 8,
      "Assist": 8,
      "TotalScore": 13439,
      "KillPlayer": 21,
      "KilledByPlayer": 8,
      "RoleId": "3550870590954844384",
      "RoomId": "648521219674508720",
      "gametime": 1478,
      "RescueTeammateCount": 1,
      "ArmedForceId": 10010,
      "RoomInfo": {
        "code": 0,
        "data": {
          "mpDetailList": [
            {
              "color": 2,
              "killNum": 11,
              "assist": 8,
              "death": 9,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 12554,
              "matchResult": 2,
              "nickName": "%E6%B5%85%E8%93%9DF",
              "rank": 838,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 28,
              "assist": 6,
              "death": 7,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 15285,
              "matchResult": 1,
              "nickName": "Pig%E4%B8%BFTao",
              "rank": 740,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 42,
              "assist": 12,
              "death": 6,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 25652,
              "matchResult": 1,
              "nickName": "%E9%98%BF%E7%89%B9%E6%8B%89%E6%96%AF%E5%B7%B4%E8%BE%BE",
              "rank": 1913,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 31,
              "assist": 12,
              "death": 10,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 27040,
              "matchResult": 1,
              "nickName": "%E5%B0%8F%E6%9F%90%E4%B8%8D%E5%98%BB%E5%98%BB",
              "rank": 1533,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 26,
              "assist": 9,
              "death": 9,
              "mapID": 108,
              "gameTime": 1494,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 19058,
              "matchResult": 1,
              "nickName": "%E5%A4%9C%E5%B0%86%E9%9B%A8",
              "rank": 1377,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 27,
              "assist": 11,
              "death": 14,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 19819,
              "matchResult": 1,
              "nickName": "%E8%BE%A3%E9%BA%BB%E5%A4%A7%E7%8E%8B%E5%AD%90",
              "rank": 750,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 16,
              "assist": 5,
              "death": 10,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 31845,
              "matchResult": 1,
              "nickName": "Barcarolle",
              "rank": 2742,
              "armedForceType": 30008,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 23,
              "assist": 3,
              "death": 10,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 24130,
              "matchResult": 2,
              "nickName": "%E5%9C%86%E9%80%9A%E5%B1%B1%E8%BD%A6%E7%A5%9E",
              "rank": 3364,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 27,
              "assist": 8,
              "death": 20,
              "mapID": 108,
              "gameTime": 1493,
              "startTime": "1752415650",
              "rescueTeammateCount": 4,
              "totalScore": 20750,
              "matchResult": 2,
              "nickName": "2%E6%B2%903",
              "rank": 2799,
              "armedForceType": 20004,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 28,
              "assist": 4,
              "death": 18,
              "mapID": 108,
              "gameTime": 1493,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 18832,
              "matchResult": 1,
              "nickName": "%E5%93%AA%E6%9C%89%E5%8D%9A%E5%BC%88%E6%AC%A1%E6%AC%A1%E8%BE%93",
              "rank": 1563,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 21,
              "assist": 8,
              "death": 8,
              "mapID": 108,
              "gameTime": 1478,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 13439,
              "matchResult": 1,
              "nickName": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6",
              "rank": 1638,
              "armedForceType": 10010,
              "isCurrentUser": true,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 24,
              "assist": 6,
              "death": 9,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 15068,
              "matchResult": 1,
              "nickName": "%E5%88%AB%E7%8E%A9%E4%BA%86%E5%BF%AB%E5%8E%BB%E7%93%A6",
              "rank": 76,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 36,
              "assist": 9,
              "death": 7,
              "mapID": 108,
              "gameTime": 1497,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 18023,
              "matchResult": 2,
              "nickName": "%E9%A6%99%E9%86%8B%E9%95%87%E8%85%A5",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 26,
              "assist": 13,
              "death": 12,
              "mapID": 108,
              "gameTime": 1477,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 17250,
              "matchResult": 2,
              "nickName": "%E4%BC%B8%E4%B8%AA%E6%87%92%E8%85%B0S",
              "rank": 907,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 17,
              "assist": 6,
              "death": 11,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 23650,
              "matchResult": 2,
              "nickName": "%E6%88%98%E6%96%97%E7%88%BDxy",
              "rank": 3893,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 30,
              "assist": 5,
              "death": 8,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 19410,
              "matchResult": 2,
              "nickName": "%E5%8D%B1%E9%99%A9%E7%9A%84%E8%9D%B0%E8%9B%871101",
              "rank": 104,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 23,
              "assist": 6,
              "death": 8,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 14264,
              "matchResult": 1,
              "nickName": "%E4%B8%87%E8%B1%A10",
              "rank": 100,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 33,
              "assist": 7,
              "death": 8,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 18302,
              "matchResult": 1,
              "nickName": "%E4%BD%A0%E6%84%81%E5%95%A5%E8%80%81%E5%BC%9F",
              "rank": 150,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 17,
              "assist": 3,
              "death": 12,
              "mapID": 108,
              "gameTime": 1494,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 15279,
              "matchResult": 2,
              "nickName": "renjikimmy",
              "rank": 1989,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 16,
              "assist": 9,
              "death": 5,
              "mapID": 108,
              "gameTime": 1481,
              "startTime": "1752415650",
              "rescueTeammateCount": 1,
              "totalScore": 16191,
              "matchResult": 2,
              "nickName": "%E5%86%85%E6%95%9B%E4%BA%BA%E6%9C%BA512",
              "rank": 2522,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 25,
              "assist": 12,
              "death": 11,
              "mapID": 108,
              "gameTime": 1492,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 20243,
              "matchResult": 2,
              "nickName": "%E3%81%8F%E3%81%90",
              "rank": 2902,
              "armedForceType": 30010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 27,
              "assist": 2,
              "death": 9,
              "mapID": 108,
              "gameTime": 1496,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 16833,
              "matchResult": 2,
              "nickName": "%E5%A4%9A%E8%BF%9C%E7%9A%84%E4%B8%96%E7%95%8C",
              "rank": 632,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 39,
              "assist": 7,
              "death": 12,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 31479,
              "matchResult": 2,
              "nickName": "%E6%8B%BE%E8%B4%B0%E4%B8%B6%E5%A7%8B",
              "rank": 3729,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 26,
              "assist": 7,
              "death": 8,
              "mapID": 108,
              "gameTime": 1495,
              "startTime": "1752415650",
              "rescueTeammateCount": 0,
              "totalScore": 21866,
              "matchResult": 1,
              "nickName": "%E5%B0%8F%E6%9D%B0%E5%88%87",
              "rank": 1780,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": true
            }
          ]
        },
        "msg": "ok"
      }
    },
    {
      "MapID": "75",
      "MatchResult": 2,
      "dtEventTime": "2025-07-13 22:04:01",
      "KillNum": 7,
      "Death": 16,
      "Assist": 11,
      "TotalScore": 2914,
      "KillPlayer": 7,
      "KilledByPlayer": 6,
      "RoleId": "3550870590954844384",
      "RoomId": "648521211084870619",
      "gametime": 767,
      "RescueTeammateCount": 0,
      "ArmedForceId": 10010,
      "RoomInfo": {
        "code": 0,
        "data": {
          "mpDetailList": [
            {
              "color": 1,
              "killNum": 27,
              "assist": 29,
              "death": 7,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 10576,
              "matchResult": 2,
              "nickName": "%E5%A4%9C%E6%A8%B1%E5%85%AB%E9%87%8D%E4%BC%BC%E4%BA%91%E9%9C%9E",
              "rank": 3384,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 13,
              "assist": 19,
              "death": 11,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 4357,
              "matchResult": 2,
              "nickName": "%E9%99%88%E5%97%B2%E4%B8%89%E5%8F%B7",
              "rank": 3134,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 22,
              "assist": 25,
              "death": 10,
              "mapID": 75,
              "gameTime": 767,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 12019,
              "matchResult": 1,
              "nickName": "%E6%AF%94%E8%B5%9B%E8%BF%9B%E4%B8%8D%E5%8E%BB%E4%BA%86aa",
              "rank": 1621,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 22,
              "assist": 14,
              "death": 15,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 7281,
              "matchResult": 2,
              "nickName": "ai%E5%90%83%E6%8B%BC%E5%A5%BDfan",
              "rank": 1325,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 17,
              "assist": 21,
              "death": 13,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 4,
              "totalScore": 5985,
              "matchResult": 2,
              "nickName": "%E6%9C%89%E6%A2%A6%E6%83%B3%E7%9A%84%E8%BD%AF%E9%A5%AD%E7%94%B7",
              "rank": 3226,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 11,
              "assist": 26,
              "death": 8,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 3,
              "totalScore": 7570,
              "matchResult": 1,
              "nickName": "JUNLONGT2",
              "rank": 722,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 14,
              "assist": 9,
              "death": 7,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 2,
              "totalScore": 7851,
              "matchResult": 1,
              "nickName": "%E4%B8%B6%E7%83%AD%E5%BF%83%E5%B8%82%E6%B0%91%E5%B0%8F%E5%91%A8",
              "rank": 3019,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 7,
              "assist": 6,
              "death": 15,
              "mapID": 75,
              "gameTime": 721,
              "startTime": "1752414721",
              "rescueTeammateCount": 6,
              "totalScore": 4043,
              "matchResult": 3,
              "nickName": "%E8%80%81%E9%B3%96%E4%B8%B6",
              "rank": 975,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 19,
              "assist": 34,
              "death": 14,
              "mapID": 75,
              "gameTime": 767,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 7355,
              "matchResult": 2,
              "nickName": "2%E5%AE%81%E9%9D%99%E7%9A%84e%E5%B0%86%E5%86%9B",
              "rank": 1850,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 14,
              "assist": 9,
              "death": 12,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 4526,
              "matchResult": 2,
              "nickName": "Hi%E6%83%B3%E6%88%91%E4%BA%86%E5%98%9B",
              "rank": 875,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 36,
              "assist": 35,
              "death": 12,
              "mapID": 75,
              "gameTime": 766,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 13487,
              "matchResult": 1,
              "nickName": "%E6%8A%8A%E6%88%91%E5%B8%A6%E8%B5%B0",
              "rank": 2226,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 25,
              "assist": 45,
              "death": 2,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 16874,
              "matchResult": 1,
              "nickName": "%E8%BE%B9%E7%96%86%E5%AE%88%E5%8D%AB%E4%BA%BA",
              "rank": 1892,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 22,
              "assist": 41,
              "death": 12,
              "mapID": 75,
              "gameTime": 767,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 11094,
              "matchResult": 1,
              "nickName": "%E8%80%B6%E6%A2%A6%E5%8A%A0%E5%BE%97%E3%81%AE%E8%8C%A7",
              "rank": 1083,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 8,
              "assist": 4,
              "death": 18,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 3660,
              "matchResult": 2,
              "nickName": "%E6%B3%84%E5%86%8D%E8%AE%A9%E6%88%91%E6%95%91%E4%B8%80%E4%B8%AA",
              "rank": 900,
              "armedForceType": 10012,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 11,
              "assist": 18,
              "death": 11,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 8426,
              "matchResult": 2,
              "nickName": "%E5%A4%B8%E7%88%B6%E6%B0%B8%E4%B8%8D%E7%86%AC%E5%A4%9C%E5%97%B7",
              "rank": 1664,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 20,
              "assist": 25,
              "death": 6,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 10219,
              "matchResult": 1,
              "nickName": "WbestW",
              "rank": 1609,
              "armedForceType": 10012,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 21,
              "assist": 20,
              "death": 8,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 11030,
              "matchResult": 1,
              "nickName": "%E5%92%95%E5%92%95%E5%92%95%E5%92%95%E5%92%95%E5%92%95%E4%B8%B6",
              "rank": 1992,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 28,
              "assist": 39,
              "death": 12,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 12971,
              "matchResult": 1,
              "nickName": "%E7%99%BD%E5%A2%A8%E8%86%8F%E6%89%8B",
              "rank": 1865,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 29,
              "assist": 30,
              "death": 10,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 12,
              "totalScore": 14370,
              "matchResult": 1,
              "nickName": "%E7%8B%99%E9%98%BF%E5%93%A5",
              "rank": 4416,
              "armedForceType": 10011,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 26,
              "assist": 36,
              "death": 6,
              "mapID": 75,
              "gameTime": 767,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 8525,
              "matchResult": 2,
              "nickName": "%E8%A3%81%E5%91%98%E6%BB%9A%E6%BB%9A",
              "rank": 1241,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 25,
              "assist": 15,
              "death": 15,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 10344,
              "matchResult": 2,
              "nickName": "mieua",
              "rank": 1063,
              "armedForceType": 10012,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 7,
              "assist": 11,
              "death": 16,
              "mapID": 75,
              "gameTime": 767,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 2914,
              "matchResult": 2,
              "nickName": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6",
              "rank": 1630,
              "armedForceType": 10010,
              "isCurrentUser": true,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 28,
              "assist": 18,
              "death": 11,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 9084,
              "matchResult": 1,
              "nickName": "%E5%B9%B8%E5%A5%BD%E5%BC%B9",
              "rank": 1250,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 20,
              "assist": 29,
              "death": 7,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 6120,
              "matchResult": 2,
              "nickName": "%E6%88%91%E5%8D%9F%E6%9D%8E%E8%A7%A3",
              "rank": 1550,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 34,
              "assist": 19,
              "death": 6,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 12895,
              "matchResult": 1,
              "nickName": "JumpMach1ne",
              "rank": 2758,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 12,
              "assist": 22,
              "death": 10,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 9,
              "totalScore": 8376,
              "matchResult": 1,
              "nickName": "%E8%AF%B4%E6%9D%A5%E5%90%AC",
              "rank": 673,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 35,
              "assist": 21,
              "death": 10,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 12887,
              "matchResult": 2,
              "nickName": "%E9%A6%99%E9%A6%99%E7%BE%8A%E8%82%89%E7%B2%89",
              "rank": 1939,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 38,
              "assist": 38,
              "death": 3,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 14906,
              "matchResult": 1,
              "nickName": "%E6%A2%A6%E5%86%A5%E5%88%9D%E5%BF%83",
              "rank": 3134,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 10,
              "assist": 20,
              "death": 15,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 2,
              "totalScore": 4048,
              "matchResult": 2,
              "nickName": "Ninox",
              "rank": 2618,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 21,
              "assist": 32,
              "death": 5,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 4,
              "totalScore": 9952,
              "matchResult": 1,
              "nickName": "%E5%B0%8F%E9%9B%A8%E6%B7%87i",
              "rank": 4537,
              "armedForceType": 20004,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 16,
              "assist": 30,
              "death": 6,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 7782,
              "matchResult": 1,
              "nickName": "%E6%88%90%E5%8A%9F%E7%9A%84k%E5%8F%B8%E6%9C%BA0",
              "rank": 2435,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 18,
              "assist": 16,
              "death": 10,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 0,
              "totalScore": 6059,
              "matchResult": 2,
              "nickName": "%C3%97%E6%8D%A3%E8%9B%8B%E9%AC%BC",
              "rank": 2363,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 11,
              "assist": 13,
              "death": 13,
              "mapID": 75,
              "gameTime": 768,
              "startTime": "1752414721",
              "rescueTeammateCount": 1,
              "totalScore": 5963,
              "matchResult": 2,
              "nickName": "Po1ar12",
              "rank": 2907,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            }
          ]
        },
        "msg": "ok"
      }
    },
    {
      "MapID": "113",
      "MatchResult": 1,
      "dtEventTime": "2025-07-13 21:48:58",
      "KillNum": 23,
      "Death": 19,
      "Assist": 20,
      "TotalScore": 10646,
      "KillPlayer": 23,
      "KilledByPlayer": 10,
      "RoleId": "3550870590954844384",
      "RoomId": "648521211084867080",
      "gametime": 1107,
      "RescueTeammateCount": 0,
      "ArmedForceId": 10010,
      "RoomInfo": {
        "code": 0,
        "data": {
          "mpDetailList": [
            {
              "color": 1,
              "killNum": 18,
              "assist": 34,
              "death": 11,
              "mapID": 113,
              "gameTime": 1106,
              "startTime": "1752413476",
              "rescueTeammateCount": 2,
              "totalScore": 7200,
              "matchResult": 2,
              "nickName": "%E7%A6%BB%E7%92%83%E6%BC%93",
              "rank": 3165,
              "armedForceType": 30010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 9,
              "assist": 27,
              "death": 29,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 10615,
              "matchResult": 1,
              "nickName": "%E5%85%AB%E5%AE%9D%E7%B2%A5%E5%A5%BD%E7%8E%A9%E6%8D%8F",
              "rank": 3341,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 44,
              "assist": 29,
              "death": 17,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 23,
              "totalScore": 16555,
              "matchResult": 2,
              "nickName": "%E5%81%8F%E5%81%8F%E7%88%B1%E5%AE%B3%E7%BE%9E",
              "rank": 1371,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 24,
              "assist": 23,
              "death": 20,
              "mapID": 113,
              "gameTime": 1109,
              "startTime": "1752413476",
              "rescueTeammateCount": 5,
              "totalScore": 12114,
              "matchResult": 1,
              "nickName": "%E6%97%A9%E6%BF%91%E8%90%BD%E6%99%96",
              "rank": 2176,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 27,
              "assist": 27,
              "death": 15,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 11340,
              "matchResult": 1,
              "nickName": "%E5%8F%AF%E6%A2%A8%E5%AE%B3%E5%88%AB",
              "rank": 1803,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 25,
              "assist": 16,
              "death": 22,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 11245,
              "matchResult": 1,
              "nickName": "%E6%91%B8%E9%87%91%E6%A0%A1%E5%B0%89%E8%AF%A1%E7%9E%B3",
              "rank": 1904,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 63,
              "assist": 56,
              "death": 21,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 17567,
              "matchResult": 2,
              "nickName": "%E7%89%B9%E7%A7%8D%E9%92%A2%E6%89%B9%E5%8F%91%E6%9D%8E%E5%93%A5",
              "rank": 2030,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 22,
              "assist": 41,
              "death": 10,
              "mapID": 113,
              "gameTime": 1109,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 6935,
              "matchResult": 2,
              "nickName": "Roamings",
              "rank": 2306,
              "armedForceType": 10011,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 20,
              "assist": 18,
              "death": 19,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 6988,
              "matchResult": 2,
              "nickName": "%E7%A6%80%E5%B0%86",
              "rank": 2151,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 28,
              "assist": 8,
              "death": 16,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 10328,
              "matchResult": 1,
              "nickName": "%E7%A5%9E%E6%9B%B2%E5%A6%82%E9%A3%8E",
              "rank": 2541,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 18,
              "assist": 23,
              "death": 21,
              "mapID": 113,
              "gameTime": 904,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 14440,
              "matchResult": 1,
              "nickName": "%E6%88%91%E7%9A%84%E9%BE%9F%E9%BE%9F1",
              "rank": 3339,
              "armedForceType": 10012,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 26,
              "assist": 44,
              "death": 15,
              "mapID": 113,
              "gameTime": 873,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 11924,
              "matchResult": 1,
              "nickName": "%E5%81%A5%E4%B8%80%E7%9A%84%E4%B8%80",
              "rank": 1573,
              "armedForceType": 30008,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 25,
              "assist": 22,
              "death": 16,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 6873,
              "matchResult": 2,
              "nickName": "Copilot",
              "rank": 1538,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 10,
              "assist": 26,
              "death": 11,
              "mapID": 113,
              "gameTime": 883,
              "startTime": "1752413476",
              "rescueTeammateCount": 8,
              "totalScore": 10272,
              "matchResult": 1,
              "nickName": "21QWQ12",
              "rank": 2109,
              "armedForceType": 30010,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 39,
              "assist": 32,
              "death": 17,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 10854,
              "matchResult": 2,
              "nickName": "%E9%9B%92%E5%A4%A9%E9%93%B1",
              "rank": 3517,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 38,
              "assist": 45,
              "death": 21,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 11279,
              "matchResult": 2,
              "nickName": "%E5%90%9B%E4%B8%B6%E4%B8%83%E5%AE%89",
              "rank": 1630,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 1,
              "assist": 2,
              "death": 3,
              "mapID": 113,
              "gameTime": 196,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 859,
              "matchResult": 3,
              "nickName": "%E5%88%9D%E7%A4%BC%E6%B6%B5%E5%A4%8F",
              "rank": 2225,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 36,
              "assist": 36,
              "death": 19,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 2,
              "totalScore": 13742,
              "matchResult": 2,
              "nickName": "%E7%8F%A9%E5%AE%89%E8%B5%B4",
              "rank": 2905,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 6,
              "assist": 1,
              "death": 4,
              "mapID": 113,
              "gameTime": 204,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 1872,
              "matchResult": 3,
              "nickName": "%E6%9F%92%E7%8E%96%E5%BE%97%E4%BA%86MVP",
              "rank": 1694,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 17,
              "assist": 39,
              "death": 3,
              "mapID": 113,
              "gameTime": 1062,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 7274,
              "matchResult": 2,
              "nickName": "a%E4%BA%AC%E4%BA%AC",
              "rank": 3603,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 34,
              "assist": 43,
              "death": 19,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 11667,
              "matchResult": 2,
              "nickName": "Berserke",
              "rank": 2026,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 0,
              "assist": 0,
              "death": 1,
              "mapID": 113,
              "gameTime": 13,
              "startTime": "0",
              "rescueTeammateCount": 0,
              "totalScore": 0,
              "matchResult": 3,
              "nickName": "%E4%B8%A8%E5%AD%90%E5%BC%A5%E4%B8%A8",
              "rank": 1604,
              "armedForceType": 0,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 18,
              "assist": 21,
              "death": 12,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 7744,
              "matchResult": 2,
              "nickName": "%E6%A2%A6%E5%90%9Bking",
              "rank": 2058,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 0,
              "assist": 0,
              "death": 1,
              "mapID": 113,
              "gameTime": 53,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 0,
              "matchResult": 3,
              "nickName": "%E6%AE%8B%E8%8A%B1%E9%80%90%E6%B0%B4%E7%A7%8B%E6%A2%A6%E5%AF%92",
              "rank": 1225,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 21,
              "assist": 54,
              "death": 12,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 16597,
              "matchResult": 1,
              "nickName": "%E6%A2%93%E6%BD%BC%E5%BD%A6%E7%A5%96%E7%88%B7",
              "rank": 3084,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 43,
              "assist": 32,
              "death": 18,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 14607,
              "matchResult": 2,
              "nickName": "%E5%A7%9C%E7%A7%A7",
              "rank": 4649,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 33,
              "assist": 43,
              "death": 11,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 13712,
              "matchResult": 2,
              "nickName": "Darkhazes%E4%B8%B6",
              "rank": 2972,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 27,
              "assist": 9,
              "death": 11,
              "mapID": 113,
              "gameTime": 562,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 10637,
              "matchResult": 1,
              "nickName": "%E6%88%91%E6%98%AF%E5%B0%8F%E8%8C%B6%E4%BD%A0%E8%AE%B0%E4%BD%8F",
              "rank": 997,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 23,
              "assist": 20,
              "death": 19,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 10646,
              "matchResult": 1,
              "nickName": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6",
              "rank": 1533,
              "armedForceType": 10010,
              "isCurrentUser": true,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 39,
              "assist": 44,
              "death": 10,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 13542,
              "matchResult": 2,
              "nickName": "%E7%83%9F%E6%99%AFaa",
              "rank": 1635,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 32,
              "assist": 33,
              "death": 12,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 12,
              "totalScore": 14181,
              "matchResult": 2,
              "nickName": "%E6%A2%A6%E5%86%B0%E5%B0%98",
              "rank": 1767,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 29,
              "assist": 23,
              "death": 10,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 8,
              "totalScore": 10786,
              "matchResult": 2,
              "nickName": "%E4%BA%BA%E7%BE%8E%E5%BF%83%E5%96%84%E8%92%8B%E5%AE%9D%E5%AE%9D",
              "rank": 1565,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 39,
              "assist": 20,
              "death": 16,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 13873,
              "matchResult": 1,
              "nickName": "%E4%B8%80%E7%AD%89%E5%85%B5%E6%91%A9%E5%B0%94",
              "rank": 1982,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 17,
              "assist": 19,
              "death": 10,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 5406,
              "matchResult": 2,
              "nickName": "%E7%85%9C%E4%B8%A8%E7%A8%8B",
              "rank": 3223,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 34,
              "assist": 28,
              "death": 22,
              "mapID": 113,
              "gameTime": 1109,
              "startTime": "1752413476",
              "rescueTeammateCount": 2,
              "totalScore": 12440,
              "matchResult": 2,
              "nickName": "Sinos152",
              "rank": 4586,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 4,
              "assist": 8,
              "death": 9,
              "mapID": 113,
              "gameTime": 515,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 2457,
              "matchResult": 3,
              "nickName": "%E4%BB%8A%E5%A4%A9%E7%9A%84p%E8%AD%A6%E5%8D%AB5",
              "rank": 2153,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 20,
              "assist": 40,
              "death": 23,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 14738,
              "matchResult": 1,
              "nickName": "%E6%B7%B1%E6%84%8F%E6%98%AF%E9%A3%8E",
              "rank": 2015,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 44,
              "assist": 33,
              "death": 12,
              "mapID": 113,
              "gameTime": 864,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 16401,
              "matchResult": 1,
              "nickName": "%E9%81%93%E6%B3%95%E8%87%AA%E7%84%B6%E4%B8%BF%E6%97%A0%E4%B8%BA",
              "rank": 1599,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 21,
              "assist": 25,
              "death": 12,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 16,
              "totalScore": 15257,
              "matchResult": 1,
              "nickName": "%E8%87%AD%E9%85%B8Du%E5%A4%A7%E8%82%A0",
              "rank": 2353,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 0,
              "assist": 0,
              "death": 1,
              "mapID": 113,
              "gameTime": 13,
              "startTime": "0",
              "rescueTeammateCount": 0,
              "totalScore": 0,
              "matchResult": 3,
              "nickName": "AAA%E9%A5%B2%E6%96%99%E9%99%88%E5%93%A5",
              "rank": 4791,
              "armedForceType": 0,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 2,
              "assist": 3,
              "death": 4,
              "mapID": 113,
              "gameTime": 208,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 964,
              "matchResult": 3,
              "nickName": "%E5%B0%91%E5%BA%9F%E8%AF%9D%E4%B8%8D%E6%9C%8D%E5%B0%B1%E5%B9%B2",
              "rank": 1185,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 33,
              "assist": 21,
              "death": 28,
              "mapID": 113,
              "gameTime": 1107,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 12771,
              "matchResult": 1,
              "nickName": "%E9%85%92%E8%88%9E%E6%97%A0%E9%85%92%E5%90%A7",
              "rank": 1040,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 1,
              "assist": 2,
              "death": 4,
              "mapID": 113,
              "gameTime": 173,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 910,
              "matchResult": 3,
              "nickName": "%E5%80%9A%E7%AB%B9%E5%90%AC%E8%AF%97%E9%9B%85",
              "rank": 1078,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 23,
              "assist": 28,
              "death": 24,
              "mapID": 113,
              "gameTime": 1109,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 10909,
              "matchResult": 1,
              "nickName": "%E5%87%8C%E6%99%A8%E7%9A%84%E7%B2%A5110",
              "rank": 1641,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 41,
              "assist": 29,
              "death": 20,
              "mapID": 113,
              "gameTime": 1108,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 14844,
              "matchResult": 1,
              "nickName": "PLA%E8%92%8B%E5%B0%8F%E9%B1%BC",
              "rank": 2486,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 62,
              "assist": 58,
              "death": 18,
              "mapID": 113,
              "gameTime": 1109,
              "startTime": "1752413476",
              "rescueTeammateCount": 0,
              "totalScore": 20003,
              "matchResult": 2,
              "nickName": "%E7%8B%97%E7%88%B7%E4%B8%B6",
              "rank": 2253,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 23,
              "assist": 46,
              "death": 17,
              "mapID": 113,
              "gameTime": 1063,
              "startTime": "1752413476",
              "rescueTeammateCount": 30,
              "totalScore": 17272,
              "matchResult": 1,
              "nickName": "%E5%B0%8F%E7%99%BD%E5%88%AB%E9%AA%82",
              "rank": 4162,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 38,
              "assist": 25,
              "death": 17,
              "mapID": 113,
              "gameTime": 1025,
              "startTime": "1752413476",
              "rescueTeammateCount": 1,
              "totalScore": 15097,
              "matchResult": 1,
              "nickName": "%E9%9C%96%E7%A7%8B%E7%9A%87%E5%B8%9D",
              "rank": 2919,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            }
          ]
        },
        "msg": "ok"
      }
    },
    {
      "MapID": "302",
      "MatchResult": 1,
      "dtEventTime": "2025-07-13 21:27:15",
      "KillNum": 53,
      "Death": 27,
      "Assist": 15,
      "TotalScore": 19763,
      "KillPlayer": 53,
      "KilledByPlayer": 23,
      "RoleId": "3550870590954844384",
      "RoomId": "648521193905965615",
      "gametime": 2334,
      "RescueTeammateCount": 0,
      "ArmedForceId": 10010,
      "RoomInfo": {
        "code": 0,
        "data": {
          "mpDetailList": [
            {
              "color": 1,
              "killNum": 84,
              "assist": 20,
              "death": 32,
              "mapID": 302,
              "gameTime": 2334,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 31362,
              "matchResult": 2,
              "nickName": "%E5%90%9B%E5%AD%90%E5%B8%83%E5%86%B7%E9%94%8B",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 61,
              "assist": 37,
              "death": 32,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 22,
              "totalScore": 26599,
              "matchResult": 2,
              "nickName": "unified15",
              "rank": 0,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 65,
              "assist": 32,
              "death": 22,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 23854,
              "matchResult": 1,
              "nickName": "%E6%97%A0%E6%95%8C%E7%9A%84h9%E7%89%A7%E7%BE%8A%E4%BA%BA",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 108,
              "assist": 23,
              "death": 17,
              "mapID": 302,
              "gameTime": 1927,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 37555,
              "matchResult": 2,
              "nickName": "ShuangJian",
              "rank": 0,
              "armedForceType": 10011,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 2,
              "assist": 2,
              "death": 3,
              "mapID": 302,
              "gameTime": 381,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 1326,
              "matchResult": 3,
              "nickName": "waio",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 68,
              "assist": 45,
              "death": 33,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 26092,
              "matchResult": 2,
              "nickName": "%E6%9E%AB%E9%9C%9C%E8%90%BD%E9%9B%AA",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 32,
              "assist": 24,
              "death": 25,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 15,
              "totalScore": 17710,
              "matchResult": 2,
              "nickName": "%E6%9C%9D%E5%A4%95%E8%8B%A6%E7%BB%83%E5%90%8D%E6%88%90%E5%BD%92",
              "rank": 0,
              "armedForceType": 20003,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 71,
              "assist": 31,
              "death": 29,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 28043,
              "matchResult": 1,
              "nickName": "%E5%85%A8%E6%B7%B7%E5%AD%90",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 108,
              "assist": 51,
              "death": 35,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 3,
              "totalScore": 33579,
              "matchResult": 2,
              "nickName": "%E7%94%B2%E5%AD%90%E8%B7%AF%E5%AD%A4%E7%8B%BC",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 42,
              "assist": 29,
              "death": 26,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 2,
              "totalScore": 22834,
              "matchResult": 2,
              "nickName": "%E7%A2%93%E8%87%BC%E6%9D%91lcl",
              "rank": 0,
              "armedForceType": 40010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 91,
              "assist": 32,
              "death": 14,
              "mapID": 302,
              "gameTime": 2334,
              "startTime": "1752410950",
              "rescueTeammateCount": 4,
              "totalScore": 35319,
              "matchResult": 2,
              "nickName": "%E6%A0%96%E5%AD%90%E5%AE%89",
              "rank": 0,
              "armedForceType": 10012,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 80,
              "assist": 21,
              "death": 43,
              "mapID": 302,
              "gameTime": 2333,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 32534,
              "matchResult": 2,
              "nickName": "WatCHER",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 73,
              "assist": 35,
              "death": 15,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 30255,
              "matchResult": 1,
              "nickName": "%E7%A5%9E%E5%9C%A3%E8%8B%8F%E7%BB%B4%E5%9F%83%E7%BD%97%E9%A9%AC",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 75,
              "assist": 26,
              "death": 20,
              "mapID": 302,
              "gameTime": 1745,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 27025,
              "matchResult": 3,
              "nickName": "my011",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 53,
              "assist": 15,
              "death": 27,
              "mapID": 302,
              "gameTime": 2334,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 19763,
              "matchResult": 1,
              "nickName": "%E6%B5%85%E5%B7%B7%E5%A2%A8%E9%BB%8E6",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": true,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 110,
              "assist": 46,
              "death": 27,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 37861,
              "matchResult": 1,
              "nickName": "%E8%BA%B2%E8%8D%89%E8%BE%93%E5%87%BA",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 74,
              "assist": 41,
              "death": 31,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 26048,
              "matchResult": 1,
              "nickName": "%E5%A8%B1%E4%B9%90%E4%BA%A1%E9%95%93",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 55,
              "assist": 23,
              "death": 23,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 23493,
              "matchResult": 1,
              "nickName": "orz%E9%87%8D%E4%BC%A4%E5%80%92%E5%9C%B0",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 27,
              "assist": 11,
              "death": 16,
              "mapID": 302,
              "gameTime": 2026,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 12438,
              "matchResult": 2,
              "nickName": "%E5%AD%90%E8%9B%8B%E8%B4%B9%E5%AD%90%E5%BC%B9",
              "rank": 0,
              "armedForceType": 10011,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 43,
              "assist": 32,
              "death": 28,
              "mapID": 302,
              "gameTime": 2334,
              "startTime": "1752410950",
              "rescueTeammateCount": 11,
              "totalScore": 19961,
              "matchResult": 2,
              "nickName": "%E4%BC%8A%E6%8B%89%E5%85%8B%E5%B0%8F%E9%A3%9E%E7%8C%AA",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 52,
              "assist": 41,
              "death": 20,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 2,
              "totalScore": 21806,
              "matchResult": 1,
              "nickName": "%E9%97%AD%E7%9C%BC%E4%B9%9F%E6%9A%B4%E6%89%93",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 1,
              "killNum": 109,
              "assist": 56,
              "death": 41,
              "mapID": 302,
              "gameTime": 2336,
              "startTime": "1752410950",
              "rescueTeammateCount": 3,
              "totalScore": 42191,
              "matchResult": 2,
              "nickName": "EvCoal",
              "rank": 0,
              "armedForceType": 10010,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 74,
              "assist": 41,
              "death": 24,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 29360,
              "matchResult": 1,
              "nickName": "%E6%97%B6%E6%BC%A0Lin",
              "rank": 0,
              "armedForceType": 40005,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 1,
              "killNum": 0,
              "assist": 0,
              "death": 1,
              "mapID": 302,
              "gameTime": 274,
              "startTime": "1752410950",
              "rescueTeammateCount": 0,
              "totalScore": 175,
              "matchResult": 1,
              "nickName": "%E6%B6%9F%E9%9B%80",
              "rank": 0,
              "armedForceType": 0,
              "isCurrentUser": false,
              "isTeamMember": false
            },
            {
              "color": 2,
              "killNum": 87,
              "assist": 32,
              "death": 25,
              "mapID": 302,
              "gameTime": 2334,
              "startTime": "1752410950",
              "rescueTeammateCount": 6,
              "totalScore": 34531,
              "matchResult": 1,
              "nickName": "%E6%88%91%E7%9F%A5%E6%BD%AD%E6%B0%B4%E4%BB%8D%E6%B8%85z",
              "rank": 0,
              "armedForceType": 30009,
              "isCurrentUser": false,
              "isTeamMember": true
            },
            {
              "color": 2,
              "killNum": 102,
              "assist": 32,
              "death": 21,
              "mapID": 302,
              "gameTime": 2335,
              "startTime": "1752410950",
              "rescueTeammateCount": 1,
              "totalScore": 32537,
              "matchResult": 1,
              "nickName": "F8AD2",
              "rank": 0,
              "armedForceType": 10007,
              "isCurrentUser": false,
              "isTeamMember": false
            }
          ]
        },
        "msg": "ok"
      }
    }
  ],
  "message": "ok",
  "amsSerial": "AMS-DFM-0721105055-c4ugok-661959-319386",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:50:57.444Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|[object]|true|none||none|
|»» item|string|true|none||none|
|»» name|string|true|none||none|
|»» totalMoney|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

## GET 大红称号

GET /df/person/title

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|frameworkToken|query|array[string]| 否 |必须|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "title": "血色会计",
    "subtitle": "能把肾上腺素换算成子弹汇率的鬼才",
    "unlockDesc": "总价值突破800万且持有医疗/能源类大红藏品",
    "objectCount": 19,
    "totalCount": 41,
    "totalMoney": 23317001
  },
  "message": "ok",
  "amsSerial": "AMS-DFM-0721105151-JEmVUN-661959-316969",
  "loginInfo": {
    "type": "qc",
    "openid": "C2DE7D79A3A9F934EE08F95B747E054E",
    "timestamp": "2025-07-21T02:51:51.659Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|[object]|true|none||none|
|»» item|string|true|none||none|
|»» name|string|true|none||none|
|»» totalMoney|string|true|none||none|
|» message|string|true|none||none|
|» amsSerial|string|true|none||none|
|» loginInfo|object|true|none||none|
|»» type|string|true|none||none|
|»» openid|string|true|none||none|
|»» timestamp|string|true|none||none|

# 数据模型

