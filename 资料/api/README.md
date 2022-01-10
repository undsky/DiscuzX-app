# 接口

+ 接口：http://w.foodmate.net/discuz/mobcent/app/web/index.php?r=命令


应该使用 POST 方法，但是实际上 GET 方法通常也可以，参数既可以放在 URL 中也可以放在请求正文中（包括 `r` 参数）。上传附件时只能使用 POST 方法。返回结果通常为 JSON，有比较固定的格式，应该比较容易读懂。部分 API（特别是以 view 结尾的那几个）返回 HTML。

注意设置 Content-Type，普通 POST 请求一般为 `application/x-www-form-urlencoded;charset=UTF-8`，上传附件的请求必须使用 `multipart/form-data;boundary=xxxx`（但是也可用于普通 POST 请求）。

## 公用参数

### accessToken 和 accessSecret (必填)
用户登录后的认证参数。

### apphash (必填)
php版本

    public static function getAppHashValue($special='') {
        $authkey = 'appbyme_key'; // 目前是定死的, 以后应该改成由用户设置
        $hash = substr(md5(substr(time(), 0, 5).$authkey.$special), 8, 8);
        return $hash;
    }

java版本

    public static String getAppHashValue() throws NoSuchAlgorithmException {
        String timeString = String.valueOf(System.currentTimeMillis());
        String authkey = "appbyme_key";
        String authString = timeString.substring(0, 5) + authkey;
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hashkey = md.digest(authString.getBytes());
        return new BigInteger(1, hashkey).toString(16).substring(8, 16);//16进制转换字符串
    }

PHP time() 对应的 Java 版本：https://stackoverflow.com/questions/732034/getting-unixtime-in-java  
对应的Javascript版本：http://phpjs.org/functions/time/  
Java MD5：https://stackoverflow.com/a/415971/1841048

### sdkVersion (可选)
API 版本，目前为 _2.4.0.2_，大部分情况下有没有这个参数以及参数值是什么都没有影响。
grep sdkVersion 出来，只有这几个区别：

mobcent/app/components/web/ImageUtils.php

    private static function _getThumbUrlFile($image, $thumb) {
        return sprintf('%s/%s/%s/%s_%s', 
            Yii::app()->getController()->dzRootUrl,
            MOBCENT_THUMB_URL_PATH,
            self::_getThumbTempPath($image),
            (isset($_GET['sdkVersion']) && $_GET['sdkVersion'] > '1.0.0') ? 'xgsize' : 'mobcentSmallPreview',
            $thumb
        );
    }

mobcent/app/controllers/message/HeartAction.php

如果你想获得系统消息的心跳提醒，需要在 querystring 中指定 `sdkVersion` 版本。

    if($_GET['sdkVersion']>='2.4.2'){
      // 获得系统消息
      $res['body']['systemInfo'] = $this->_getSystemInfo($uid);
    }else{
      // 获取好友通知
      $res['body']['friendInfo'] = $this->_getNotifyInfo($uid, 'friend');	
    }

mobcent/app/components/web/AppUtils.php 那一段待确认，估计跟我们调用 API 没什么关系。

### forumKey （可选）
用于 mobcent 统计，区分不同论坛，清水河畔该参数的值为 _CBQJazn9Wws8Ivhr6U_。

### platType （可选，默认为1）

Android 客户端为 1，iOS 客户端为 5。

## 返回结果

如果返回 JSON，通常格式如下：

    {
      "errcode": "", // 通常成功时为空，错误则为错误码。
      "rs": 1, // 通常 1 表示成功，0 表示失败。
      "head": {
        "errCode": "00000000", // 错误码。
        "errInfo": "调用成功,没有任何错误", // 错误信息。
        "version": "2.4.0.2", // API 版本。
        "alert": 0,
        ...
      },
      "body": {
        "externInfo": {
          "padding": ""
        },
        ...
      },
      "list": { // 部分 list 请求返回该字段，例如 forum/forumlist。
      },
      ...
    }

## apis

> 测试接口：http://w.foodmate.net/discuz/mobcent/app/web/index.php?r=user/login&username=admin&password=jyx123
> 食品论坛接口：https://bbsapi.foodmate.net/app/web/index.php?r=user/login&username=ohmyga&password=123456a

### 用户

### 板块

### 消息


## demo
```
http://w.foodmate.net/discuz/mobcent/app/web/index.php?r=user/login&username=admin&password=jyx123
```
``` json
{
    "rs": 1,
    "errcode": "",
    "head": {
        "errCode": "00000000",
        "errInfo": "调用成功,没有任何错误",
        "version": "2.8.1.5",
        "alert": 0
    },
    "body": {
        "externInfo": {
            "padding": ""
        }
    },
    "isValidation": 0,
    "token": "8d5478c77477933169ab8cfde10b5",
    "secret": "b0cdcc0447d67c83bef63b1474c65",
    "score": 2,
    "uid": 1,
    "userName": "admin",
    "avatar": "http://w.foodmate.net/discuz/uc_server/avatar.php?uid=1&size=middle",
    "gender": 0,
    "userTitle": "管理员",
    "repeatList": [],
    "verify": [],
    "creditShowList": [
        {
            "type": "credits",
            "title": "积分",
            "data": 2
        },
        {
            "type": "extcredits2",
            "title": "金钱",
            "data": 2
        }
    ],
    "mobile": "",
    "groupid": 1
}
```