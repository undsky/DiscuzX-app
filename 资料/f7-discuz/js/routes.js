/*
 * File: routes.js
 * Project: create-f7-app
 * File Created: 2018-09-17 03:46:41 pm
 * Author: 姜彦汐 (jiangyanxi@live.com)
 * -----
 * Last Modified: 2019-01-31 10:28:24 am
 * Modified By: 姜彦汐 (jiangyanxi@live.com>)
 * -----
 * Copyright (c) 2019 www.undsky.com
 */

baseRoutes = [
  {
    path: '/',
    componentUrl: './components/index.html',
    tabs: [
      {
        path: '/',
        id: 'home',
        componentUrl: './components/home.html',
      },
      {
        path: '/board/',
        id: 'board',
        async: function (routeTo, routeFrom, resolve, reject) {
          if (app.data.cache.boards.length == 0) {
            app.f7Net.json(api, {
              r: 'forum/forumlist'
            }, function (data) {
              app.data.cache.boards = data.list;
              resolve({
                componentUrl: './components/board.html',
              }, {
                  context: {
                    boards: data.list
                  }
                });
            });
          } else {
            resolve({
              componentUrl: './components/board.html',
            }, {
                context: {
                  boards: app.data.cache.boards
                }
              });
          }
        },
      },
      {
        path: '/message/',
        id: 'message',
        componentUrl: './components/message.html',
      },
      {
        path: '/find/',
        id: 'find',
        componentUrl: './components/find.html',
      },
    ],
  },
  {
    path: '/login/',
    componentUrl: './components/login.html',
  },
  {
    path: '/register/',
    componentUrl: './components/register.html',
  },
  {
    path: '/search/',
    componentUrl: './components/search.html',
  },
  {
    path: '/chat/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.f7Net.post(api, {
        r: 'message/pmlist',
        pmlist: '{"body":{"pmInfos":[{"fromUid":' + routeTo.query.fromUid + ',"startTime":"0","stopTime":"0","pmLimit":' + app.data.pageSize + '}],"externInfo":{"onlyFromUid":0}}}',
        accessToken: Template7.global.user.token,
        accessSecret: Template7.global.user.secret,
      }, function (data) {
        var res = app.methods.resError(data);
        if (res) {
          app.dialog.alert(res, function () {
            reject();
          });
        } else {
          var pmList = data.body.pmList[0];
          var fromUser = {
            avatar: pmList.avatar,
            fromUid: pmList.fromUid,
            name: pmList.name,
            plid: pmList.plid,
          };
          var toUser = data.body.userInfo;
          var chats = [];

          for (var i = 0; i < pmList.msgList.length; i++) {
            var chat = pmList.msgList[i];
            chat.sent = chat.sender == toUser.uid;
            chat.avatar = chat.sent ? toUser.avatar : fromUser.avatar;
            chat.name = chat.sent ? toUser.name : fromUser.name;
            chats.push(chat);
          }
          resolve({
            componentUrl: './components/chat.html',
          }, {
              context: {
                fromUser: fromUser,
                toUser: toUser,
                chats: chats
              }
            });
        }
      });
    },
  },
  {
    path: '/reply/',
    componentUrl: './components/reply.html',
  },
  {
    path: '/pub/',
    async: function (routeTo, routeFrom, resolve, reject) {
      if (app.data.cache.boards.length == 0) {
        app.f7Net.json(api, {
          r: 'forum/forumlist'
        }, function (data) {
          app.data.cache.boards = data.list;
          resolve({
            componentUrl: './components/pub.html',
          }, {
              context: {
                boards: data.list,
                action: routeTo.query.action
              }
            });
        });
      } else {
        resolve({
          componentUrl: './components/pub.html',
        }, {
            context: {
              boards: app.data.cache.boards,
              action: routeTo.query.action
            }
          });
      }
    },
  },
  {
    path: '/topic/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.f7Net.json(api, {
        r: 'forum/postlist',
        topicId: routeTo.query.topicId,
        authorId: 0,
        order: 0,
        page: 1,
        pageSize: app.data.pageSize
      }, function (data) {
        var res = app.methods.resError(data);
        if (res) {
          app.dialog.alert(res, function () {
            reject();
          });
        } else {
          resolve({
            componentUrl: './components/topic.html',
          }, {
              context: {
                topic: data,
                hasMore: data.list.length == app.data.pageSize
              }
            });
        }
      });
    },
  },
  {
    path: '/jubao/',
    componentUrl: './components/jubao.html',
  },
  {
    path: '/toupiao/',
    componentUrl: './components/toupiao.html',
  },
  {
    path: '/self/',
    async: function (routeTo, routeFrom, resolve, reject) {
      if (app.data.cache.user) {
        resolve({
          componentUrl: './components/self.html',
        }, {
            context: {
              user: app.data.cache.user
            }
          });
      } else {
        app.f7Net.json(api, {
          r: 'user/userinfo',
          userId: Template7.global.user.uid,
          accessToken: Template7.global.user.token,
          accessSecret: Template7.global.user.secret,
        }, function (data) {
          app.data.cache.user = data;
          resolve({
            componentUrl: './components/self.html',
          }, {
              context: {
                user: data
              }
            });
        });
      }
    },
    routes: [
      {
        path: '/ziliao/',
        componentUrl: './components/self/ziliao.html',
      },
      {
        path: '/edit/',
        componentUrl: './components/self/edit.html',
      },
      {
        path: '/pwd/',
        componentUrl: './components/self/pwd.html'
      },
      {
        path: '/about/',
        componentUrl: './components/self/about.html'
      },
      {
        path: '/xiangce/',
        componentUrl: './components/self/xiangce.html',
        routes: [
          {
            path: '/show/',
            componentUrl: './components/self/xiangce/show.html',
          },
          {
            path: '/upload/',
            componentUrl: './components/self/xiangce/upload.html',
          },
        ]
      },
      {
        path: '/haoyou/',
        componentUrl: './components/self/haoyou.html'
      },
      {
        path: '/guanzhu/',
        componentUrl: './components/self/guanzhu.html'
      },
      {
        path: '/fensi/',
        componentUrl: './components/self/fensi.html'
      },
      {
        path: '/fabiao/',
        componentUrl: './components/self/fabiao.html'
      },
      {
        path: '/huifu/',
        componentUrl: './components/self/huifu.html'
      },
      {
        path: '/shoucang/',
        componentUrl: './components/self/shoucang.html'
      },
    ],
  },

  {
    path: '/ta/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.f7Net.json(api, {
        r: 'user/userinfo',
        userId: routeTo.query.uid,
        accessToken: Template7.global.user.token,
        accessSecret: Template7.global.user.secret,
      }, function (data) {
        var res = app.methods.resError(data);
        if (res) {
          app.dialog.alert(res, function () {
            reject();
          });
        } else {
          data.taid = routeTo.query.uid;
          app.data.cache.ta = data;
          app.data.cache.taAlbums = [];
          resolve({
            componentUrl: './components/ta.html',
          }, {
              context: {
                ta: data
              }
            });
        }
      });
    },
    routes: [
      {
        path: '/ziliao/',
        componentUrl: './components/ta/ziliao.html'
      },
      {
        path: '/xiangce/',
        componentUrl: './components/ta/xiangce.html',
        routes: [
          {
            path: '/show/',
            componentUrl: './components/ta/xiangce/show.html',
          },
        ]
      },
      {
        path: '/xiangce/',
        componentUrl: './components/ta/xiangce.html'
      },
      {
        path: '/fabiao/',
        componentUrl: './components/ta/fabiao.html'
      },
      {
        path: '/huifu/',
        componentUrl: './components/ta/huifu.html'
      },
    ],
  },
  {
    path: '/board/',
    routes: [
      {
        path: '/list/',
        async: function (routeTo, routeFrom, resolve, reject) {
          app.f7Net.json(api, {
            r: 'forum/topiclist',
            boardId: routeTo.query.board_id,
            page: 1,
            pageSize: app.data.pageSize
          }, function (data) {
            var res = app.methods.resError(data);
            if (res) {
              app.dialog.alert(res, function () {
                reject();
              });
            } else {
              resolve({
                componentUrl: './components/board/list.html',
              }, {
                  context: {
                    board: data,
                    hasMore: data.list.length == app.data.pageSize
                  }
                });
            }
          });
        },
      },
    ]
  },
  {
    path: '/message/',
    routes: [
      {
        path: '/haoyou/',
        componentUrl: './components/message/haoyou.html'
      },
      {
        path: '/pinglun/',
        componentUrl: './components/message/pinglun.html'
      },
      {
        path: '/tiwo/',
        componentUrl: './components/message/tiwo.html'
      },
      {
        path: '/tixing/',
        componentUrl: './components/message/tixing.html'
      },
      {
        path: '/xiaoxi/',
        componentUrl: './components/message/xiaoxi.html'
      },
    ],
  },
  {
    path: '/find/',
    routes: [
      {
        path: '/user/',
        componentUrl: './components/find/user.html'
      },
      {
        path: '/topic/',
        componentUrl: './components/find/topic.html'
      },
      {
        path: '/recommend/',
        componentUrl: './components/find/recommend.html'
      },
      {
        path: '/setting/',
        componentUrl: './components/find/setting.html'
      },
    ]
  },
  {
    path: '(.*)',
    url: './pages/404.html',
  }
];
