# 论坛

## 板块列表

```
forum/forumlist
```

### 参数

+ fid（可选）获取指定版块的子版块

### 返回值

+ list 数组。
    + board_category_name 版块名称。
    + board_category_id 相当于河畔上的 gid。
    + board_category_type
    + board_list 数组，包含分栏下的版块。
        + board_child 是否有子版块。
        + board_content 是否为空版块（不能发帖，只有子版块，例如学院在线）。
        + board_id 相当于河畔上的 fid。
        + board_img
        + board_name 版块名称。
        + description
        + forumRedirect
        + last_posts_date 最后发表时间。
        + posts_total_num 总发帖量。
        + td_posts_num 今日发帖量。
        + topic_total_num 主题总数

## 分类

```
forum/classification
```

### 参数

+ sortid 分类信息 ID

## 板块主题列表

```
forum/topiclist
```

### 参数

+ boardId 相当于 fid。
+ page
+ pageSize
sortby 'publish' == 'new', 'essence' == 'marrow', 'top', 'photo', 'all'（默+ 认）
+ filterType 'sortid', 'typeid'
+ filterId 分类 ID，只返回指定分类的主题。
+ isImageList
+ topOrder 0（不返回置顶帖，默认）, 1（返回本版置顶帖）, 2（返回分类置顶帖）, 3（返回全局置顶帖）。置顶帖包含在 topTopicList 字段中。

### 返回值

+ list 数组。
    + topic_id
    + type
    + title （包含分类信息）
    + subject （仅包含标题）
    + imageList
    + sourceWebUrl
    + user_id
    + user_nick_name
    + userAvatar
    + gender
    + last_reply_date
    + vote 是否为投票帖。
    + hot
    + hits
    + replies
    + essence
    + top
    + status
    + pic_path
    + ratio
    + recommendAdd
    + isHasRecommendAdd
    + board_id
    + board_name
+ topTopicList 数组，包含置顶帖。
    + id
    + title
+ page
+ hasNext
+ total_num
+ newTopicPanel 数组。
    + type （nomal、vote……）
    + action （空）
    + title （发表帖子、发起投票）
+ classificationTop_list 数组。
+ classificationType_list 数组。
    + classificationType_id
    + classificationType_name
+ isOnlyTopicType
+ anno_list 数组。
+ forumInfo
    + id
    + title
    + description
    + icon

## 帖子回复列表

```
forum/postlist
```

### 参数

+ topicId
+ authorId 只返回指定作者的回复，默认为 0 返回所有回复。
+ order 0 或 1（回帖倒序排列）
+ page
+ pageSize

### 返回值

+ page
+ has_next
+ total_num
+ list _数组_。回复列表，_不包含楼主_。
    + reply_id 内部使用？
    + reply_content 回复内容（结构参考发帖时的 content 字段）。
    + reply_type
    + reply_name 用户名
    + reply_posts_id 回复 pid。
    + position 楼层编号。
    + posts_date 回复时间。
    + icon 头像 URL。
    + level
    + userTitle 用户组
    + location
    + mobileSign
    + reply_status
    + status
    + role_num
    + title
    + is_quote
    + quote_pid
    + quote_content
    + quote_user_name
    + managePanel
    + extraPanel 参见 topic 字段。
+ topic 字段与 forum/topiclist 返回值中 list 项目类似
    + 两者均包含 topic_id, title, type, user_id, user_nick_name, replies, hits, essence, vote, hot, top, status, gender 这些字段，topic 字段不包含 board_id, board_name, last_reply_date, subject, pic_path, ratio, userAvatar, recommendAdd, isHasRecommendAdd, imageList, sourceWebUrl，此外还包含下列字段：
    + sortId
    + is_favor
    + create_date 发帖时间
    + icon 头像？
    + level
    + userTitle 用户组
    + content 主题帖内容（结构参考发帖时的 content 字段）。
    + poll_info
        + deadline
        + is_visible
        + voters
        + type
        + poll_status
        + poll_id 数组。
        + poll_item_list _数组_。
            + name
            + poll_item_id
            + total_num
            + percent
    + activityInfo
    + location
    + managePanel
    + extraPanel _数组_。
        + action 相当于 HTML &lt;form&gt; action 属性？
        + title 操作（例如“评分”）。
        + type 如果是评分则为 'rate'。
        + extParams
            + beforeAction 执行前请求的 URL？
    + mobileSign
    + reply_status
    + flag
    + reply_posts_id 楼主（1 楼） pid。
    + rateList
        + padding rateList 为空时包含该字段。
        + head 表头字段名
            + field1
            + field2
            + field3
        + body _数组_。相当于 &lt;tbody&gt; 每一行。
            + field1
            + field2
            + field3
        + total 总计。
            + field1
            + field2
            + field3
        + showAllUrl 显示所有评分记录的 URL（forum/ratelistview）。

## 回复支持/反对操作

```
forum/support
```

### 参数

+ tid
+ pid
+ type 'topic'（默认）== 'thread', 'post'
+ action 'support'（默认）, 'against'

## 发帖/回复

```
forum/topicadmin
```

### 参数

+ act 'new'（发帖）、'reply'（回复）、其他字符串（编辑）
+ json JSON 格式的发帖内容。

JSON 格式：

``` json
{
      "body": {
        "json": {
          "fid": 123, // 发帖时指定版块。
          "tid": 123456, // 回复时指定帖子。
          "typeOption": ...,
          "isAnonymous": 1, // 1 表示匿名发帖。
          "isOnlyAuthor": 1, // 1 表示回帖仅作者可见。
          "typeId": 1234, // 分类。
          "isQuote": 1, 是否引用之前回复的内容。
          "replyId": 123456, 回复 ID（pid）。
          "title": "Title", // 标题。
          "aid": "1,2,3", // 附件 ID，逗号隔开。
          "content": "又是一个 JSON 字符串，格式见下面。",
          "location": "TODO: 格式待确认"
        }
      }
    }
```

body.json.content 格式：

``` json
[
      {
        "type": 0, // 0：文本（解析链接）；1：图片；3：音频;4:链接;5：附件
        "infor": "发帖内容|图片 URL|音频 URL"
      },
      ...
    ]
```

javascript示例：

```javascript
fetch(url, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: `act=reply&json=${JSON.stringify(payload)}`
})
```
payload为上面的JSON格式，其中`content`字段（数组）需要再次序列化。

### 返回值

## 搜索

```
forum/search
```

### 参数

+ keyword
+ page
+ pageSize
+ searchid

### 返回值

## 附件

```
forum/sendattachmentex
```

### 参数

+ type 'image', 'audio'
+ module 'forum', 'album', 'pm'
+ albumId

### 返回值

+ body
    + attachment _数组_。
        + id 附件 ID，发帖时在 _aid_ 参数中指定。
        + urlName 附件 URL，发帖时在 _infor_ 字段中指定。


## 投票

```
forum/vote
```

### 参数

+ tid
+ options 投票选项，逗号隔开。

### 返回值

+ vote_rs _数组_。
    + name
    + pollItemId
    + totalNum

## 站点公告

```
forum/announcement
```

### 参数

+ id

## @的好友

```
forum/atuserlist
```

### 参数

+ page
+ pageSize

### 返回值

+ page
+ total_num
+ has_next
+ list
    + uid
    + name
    + role_num

## 包含图片的帖子

```
forum/photogallery
```

### 参数

+ page
+ pageSize

## 评分记录查询

```
forum/ratelistview
```

### 参数

+ tid
+ pid

### 返回值

+ **返回 HTML。**

## 活动帖参加、取消

```
forum/topicactivity
```

### 参数

+ tid
+ act 'apply'（默认）, 'cancel'
+ json JSON 字符串。

JSON 格式：

``` json
    {
      "payment": , //支付的积分
      "message": , // 附加留言
      // 其他参数（活动时填写的信息）
    }
```

## 参加活动

```
forum/topicactivityview
```

### 参数

+ tid
+ act

### 返回值

+ **返回 HTML。**

## 管理操作

```
forum/topicadminview
```

### 参数

+ fid
+ tid
+ pid
+ act
+ type 'topic'（默认）

### 返回值

+ **返回 HTML。**

## 评分

```
forum/topicrate
```

### 参数

+ tid
+ pid

### 返回值

+ **返回 HTML。**