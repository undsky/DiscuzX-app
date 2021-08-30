/*
 * File: methods.js
 * Project: create-f7-app
 * File Created: 2018-09-18 08:12:40 am
 * Author: 姜彦汐 (jiangyanxi@live.com)
 * -----
 * Last Modified: 2019-01-31 10:28:17 am
 * Modified By: 姜彦汐 (jiangyanxi@live.com>)
 * -----
 * Copyright (c) 2019 www.undsky.com
 */
function messageHeart() {
    app.f7Net.json(api, {
        r: 'message/heart',
        accessToken: Template7.global.user.token,
        accessSecret: Template7.global.user.secret,
    }, function (data) {
        app.data.cache.heart = data.body;
        app.data.cache.heart.total = data.body.replyInfo.count + data.body.atMeInfo.count + data.body.friendInfo.count + data.body.systemInfo.count;
    });
}

methods = {
    resError: function (data) {
        // 50000000 登录授权过期
        return ('00000000' == data.head.errCode || '0000000' == data.head.errCode) ? null : data.head.errInfo;
    },
    // [mobcent_br]
    mobcentBr: function (content) {
        return _.replace(content, '/\[mobcent_br\]/g', '<br />');
    },
    // [mobcent_url=xxx(title=yyy)]
    mobcentUrl: function (content) {
        return _.replace(content, /\[mobcent_url=(.*?)\(title=(.*?)\)\]/g, '<a href="$1">$2</a>');
    },
    // [mobcent_video=xxx]
    mobcentVideo: function (content) {
        return _.replace(content, /\[mobcent_video=(.*?)\]/g, '<video controls src="$1"></video>');
    },
    // [mobcent_audio=xxx]
    mobcentAudio: function (content) {
        return _.replace(content, /\[mobcent_audio=(.*?)\]/g, '<audio controls src="$1"></audio>');
    },
    // [mobcent_attachment=xxx(title=yyy)(desc=zzz)]
    mobcentAttachment: function (content) {
        return _.replace(content, /\[mobcent_attachment=(.*?)\(title=(.*?)\)\(desc=(.*?)\)\]/g, '<a href="$1">$2</a>');
    },
    // [mobcent_image=xxx(aid=yyy)]
    mobcentImage: function (content) {
        return _.replace(content, /\[mobcent_image=(.*?)\(aid=(.*?)\)\]/g, '<img class="lazy max-width-100" data-src="$1">');
    },
    // [mobcent_phiz=xxx]
    mobcentPhiz: function (content) {
        content = _.replace(content, /\[mobcent_phiz=(.*?)\]/g, '<img class="lazy max-width-100" data-src="$1">');
        content = _.replace(content, /\[video\](.*?)\[\/video\]/g, '<video class="max-width-100" controls src="$1"></video>')
        for (var i = 0; i < app.data.emojis.length; i++) {
            var emoji = app.data.emojis[i];
            content = _.replace(content, new RegExp('\\' + emoji.substr(0, emoji.length - 1) + '\\]', 'g'), '<img src="./img/emoji/' + (i < 10 ? '0' +
                i : i) + '.png">');
        }
        return content;
    },
    heart: function () {
        return;
        if (Template7.global.user.uid && heartInterval == null) {
            messageHeart();

            heartInterval = setInterval(messageHeart, 300000);
        } else if (heartInterval) {
            clearInterval(heartInterval);
            heartInterval = null;
            app.data.cache.heart = null;
        }
    },
    nocache: function () {
        return 'time=' + (new Date()).getTime();
    },
    genEmoji: function () {
        var emojiH = '';
        for (var i = 0; i < app.data.emojis.length; i++) {
            emojiH +=
                '<div data-idx="' + i +
                '" class="messagebar-sheet-image" style="background-image:url(./img/emoji/' + (i < 10 ? '0' +
                    i : i) +
                '.png)"></div>';
        }

        return emojiH;
    },
    getTemplate: function (template) {
        return Framework7.request({
            url: './templates/' + template + '.html',
            async: false,
        }).responseText;
    },
    htmlEncode: function (html) {
        var temp = document.createElement("div");
        (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    htmlDecode: function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    htmlEncodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    htmlDecodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    }
};