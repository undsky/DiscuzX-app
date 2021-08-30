# issues

#### 您当前的访问请求当中含有非法字符，已经被系统拒绝 

``` php
// ./source/class/discuz/discuz_application.php
// 修改 _xss_check() 方法
private function _xss_check() {
	$temp = strtoupper(urldecode(urldecode($_SERVER['REQUEST_URI'])));
	if(strpos($temp, '<') !== false || strpos($temp, '"') !== false || strpos($temp, 'CONTENT-TRANSFER-ENCODING') !== false) {
			system_error('request_tainting');
	}
	return true;
}
```

#### 板块不显示问题 

+ 论坛/板块管理，设置两级
+ 应用/小云APP手机客户端/设置/能在客户端显示的版块

#### 修改头像无效

+ 站长/UCenter设置/头像调用方式：使用静态地址调用头像