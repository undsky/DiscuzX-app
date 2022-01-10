//
//  FMAPI.h
//  bbs
//
//  Created by 姜彦汐 on 15/8/5.
//  Copyright (c) 2015年 姜彦汐. All rights reserved.
//

#ifndef bbs_FMAPI_h
#define bbs_FMAPI_h

#define FM_PREFIX @"https://bbsapi.foodmate.net/app/web/index.php?r="
#define FM_USER_PREFIX @"http://users.foodmate.net/api/app/index.php?m=member&a="
#define FM_SUFFIX @"20"
#define FM_SUFFIX_COMMAND @"11"

//发现
//好友申请列表
#define FM_FRIEND_LIST @"message/notifylist"
//提到我的
#define FM_ATME @"message/notifylist"

//登录
#define FM_LOGIN @"user/login"
//注销
#define FM_LOGOUT @"user/login&type=logout"
//用户信息
#define FM_USERINFO @"user/userinfo"
//修改密码
#define FM_PWD @"user/updateuserinfo"
//签到
#define FM_SIGN @"user/sign"
//邮件检测
#define FM_CHECK_EMAIL @"email"
//用户名检测
#define FM_CHECK_UNAME @"username"
//验证码
#define FM_YANZHENGMA @"code"
//用户注册
#define FM_ZHUCE @"register"

//更换用户头像
#define FM_AVATAR_UPDATE @"user/uploadavatarex"
#define FM_USERINFO_UPDATE @"user/updateuserinfo"

//用户中心
//TA/我的帖子 发表（topic）／回复（reply）／收藏（favorite）
#define FM_USER_TOPICLIST @"user/topiclist"
//关注（follow）／粉丝（followed））／好友（friend）／推荐（recommend）
#define FM_USERLIST @"user/userlist"
//follow关注|unfollow取消关注|black拉黑|delblack取消拉黑
#define FM_USER_ADMIN @"user/useradmin"

//首页 最新（new）／精华（marrow）
#define FM_HOME @"forum/topiclist"
//搜索
#define FM_SEARCH @"forum/search"
//帖子详情
#define FM_DETAIL @"forum/postlist"
//赞
#define FM_ZAN @"forum/support"
//收藏
#define FM_SHOUCANG @"user/userfavorite"
//举报
#define FM_JUBAO @"user/report"
//投票
#define FM_POLL @"forum/vote"

//版块
#define FM_FORUMLIST @"forum/forumlist"
//版块分类列表(all全部)／(new最新)／(marrow精华)／(top置顶)
#define FM_TOPICLIST @"forum/topiclist"

//周边(user)用户/(topic)帖子
#define FM_ROUND @"square/surrounding"

//HTML
//个人资料编辑
#define FM_ZILIAOEDIT @"user/userinfoadminview"

//评分
#define FM_PINGFEN_MY @"forum/topicrate"
//评分列表
#define FM_PINGFEN @"forum/ratelistview"
//好友act=add（加好友）ignore（删除好友）shield（屏蔽好友）add2（批准好友）
#define FM_FRIEND @"user/useradminview"

//短消息
//会话列表
#define FM_PM_LIST @"message/pmlist"
//管理
#define FM_PM_ADMIN @"message/pmadmin"
//私信列表
#define FM_PM_SESSION_LIST @"message/pmsessionlist"

//相册
//列表
#define FM_XIANGCE @"user/albumlist"
//图片列表
#define FM_XIANGCE_TUPIAN @"user/photolist"
//上传图片
#define FM_UPIMG @"user/savealbum"

//心跳
#define FM_HEART @"message/heart"

//上传[参数：type=image|audio，module=forum|album，albumId=相册ID -1 为默认相册]（服务器使用$_FILES['uploadFile']接收上传资源）
#define FM_UPLOAD @"forum/sendattachmentex"

//意见反馈
#define FM_FEEDBACK @"user/feedback"
//系统提醒
#define FM_SYS @"message/notifylist"
//评论
#define FM_RECOMMEND @"message/notifylist"

//发帖
#define FM_PUB @"forum/topicadmin"

#endif
