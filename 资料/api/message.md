# 消息

### message/heart
查询新提醒数目（每隔一段时间查询）。

### message/notifylist
提醒列表。

* type 'post'（帖子）, 'at'（@消息）, 'friend'（好友？）
* page
* pageSize

### message/pmlist
短消息列表。

* pmlist JSON 字符串。

JSON 格式：

    {
      "body": {
        "externInfo": {
          "onlyFromUid": 0, // 只返回收到的消息（不包括自己发出去的消息）。
        },
        "pmInfos": {
          "startTime": , // 开始时间（以毫秒为单位）。startTime 和 stopTime 均为 0 表示获取最新（未读）消息，如果要获取历史消息指定一个较早的时间。
          "stopTime": , // 结束时间（以毫秒为单位），为零表示获取晚于 startTime 的所有消息。
          "cacheCount": 1,
          "fromUid": 123, // UID，必须指定。
          "pmLimit": 10, // 最多返回几条结果，默认为 15。
        }
      }
    }

### message/pmadmin
短消息管理（发送、删除）。

* json

JSON 格式：

    {
      "action": "send", // 'send'（默认）, 'delplid'（删除和某人的所有会话）, 'delpmid'
      "toUid": 12345, // send
      "msg": {
        "type": "text", // 'text', 'image', 'audio'
        "content": "消息内容（经过 URL 编码）/图片 URL/音频 URL"
      }, // send
      "plid": 123, // delplid（并非 uid）
      "pmid": 123  // delpmid
    }

### message/pmsessionlist
获取短消息会话列表。

* json *必选。*

JSON 格式：

    {
      "page": 1, // 可选，默认为 1。
      "pageSize": 10 // 可选，默认为 10。
    }