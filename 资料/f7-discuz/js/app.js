/*
 * File: app.js
 * Project: create-f7-app
 * File Created: 2019-01-28 10:08:02 am
 * Author: 姜彦汐 (jiangyanxi@live.com)
 * -----
 * Last Modified: 2019-01-31 10:28:02 am
 * Modified By: 姜彦汐 (jiangyanxi@live.com>)
 * -----
 * Copyright (c) 2019 www.undsky.com
 */
var timeago = timeago();
timeago.setLocale('zh_CN');

var lastTimeBackPress = 0;
var timePeriodToExit = 2000;

var $$ = Dom7;

var app = new Framework7({
  root: '#app',
  id: 'com.undsky.jiscuz',
  name: 'jiscuz',
  theme: 'ios',
  view: {
    stackPages: true,
    // preloadPreviousPage: false, //https://github.com/framework7io/Framework7/issues/1194#issuecomment-262267836
  },
  sheet: {
    backdrop: true,
  },
  dialog: {
    title: '提示',
    buttonOk: '确定',
    buttonCancel: '取消',
  },
  picker: {
    toolbarCloseText: '完成',
    openIn: 'popover',
  },
  calendar: {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  },
  data: function () {
    return baseData; //_.assign(baseData, xxxData);
  },
  methods: methods,
  routes: baseRoutes, //_.concat(xxxRoutes, baseRoutes),
});

function initialize() {
  Framework7.utils.nextTick(function () {
    // http://idangero.us/template7/#.W0f3R9gzYlm
    Template7.global = {
      user: {},
      setting: {},
      position: {},
    };

    var url = 0 == location.search.indexOf('?route=') ? location.search.substr(7) : '/';

    async.parallel([
        function (callback) {
          app.f7Storage.getCache(app.name + 'user', function (data) {
            if (data) {
              _.assign(Template7.global.user, data);
              app.methods.heart();
            }
            callback(null);
          }, function () {
            callback(null);
          });
        },
        function (callback) {
          app.f7Storage.getCache(app.name + 'setting', function (data) {
            if (data) {
              _.assign(Template7.global.setting, data);
            }
            callback(null);
          }, function () {
            callback(null);
          });
        },
        function (callback) {
          app.f7Storage.getCache(app.name + 'theme', function (data) {
            if (data) {
              app.root.removeClass('theme-dark theme-light').addClass('theme-' + data);
            }
            callback(null);
          }, function () {
            callback(null);
          });
        },
        function (callback) {
          app.f7Storage.getCache(app.name + 'color', function (data) {
            if (data) {
              var currentColorClass = app.root[0].className.match(/color-theme-([a-z]*)/);
              if (currentColorClass) app.root.removeClass(currentColorClass[0])
              app.root.addClass('color-theme-' + data);
            }
            callback(null);
          }, function () {
            callback(null);
          });
        },
      ],
      function (err, results) {
        app.views.create('.view-main', {
          url: url,
        });
      });

    if (Framework7.device.cordova) {
      app.f7Location.get(function (data) {
        _.assign(Template7.global.position, data);
      });
    }
  });
}

// var domain = 'w.foodmate.net';
var domain = 'bbsapi.foodmate.net';
// var api = mobcent = 'http://' + domain + '/discuz/mobcent/app/web/index.php';
var api = mobcent = 'https://' + domain + '/app/web/index.php';
var debug = location.href.indexOf(domain) == -1;
if ('undefined' != typeof cordova) {
  document.addEventListener('deviceready', initialize, false);
} else {
  api = location.href.indexOf(domain) > -1 ? api : '/api/index.php';
  window.addEventListener('load', function () {
    setTimeout(function () {
      if ('undefined' != typeof cordova) {
        Framework7.device.cordova = true;
      }
      initialize();
    }, 2000);
  }, false);
}

document.addEventListener('chcp_updateLoadFailed', function (err) {
  if (err && err.detail && err.detail.error && err.detail.error.code === chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
    app.dialog.confirm('点击确定下载最新版本', '版本更新', function () {
      app.f7Browser.system('android' == cordova.platformId ?
        'https://www.pgyer.com/5uTc' : 'https://www.pgyer.com/VCGI');
    });
  }
}, false);

document.addEventListener("backbutton", function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
    navigator.app.exitApp();
  } else {
    app.f7Popup.toast('再按一次退出应用');
    lastTimeBackPress = new Date().getTime();
  }
}, false);