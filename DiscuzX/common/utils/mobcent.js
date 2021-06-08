const emojis = ['[泪]', '[哈哈]', '[抓狂]', '[嘻嘻]', '[偷笑]', '[怒]', '[鼓掌]', '[心]', '[心碎了]', '[生病]', '[爱你]', '[害羞]', '[馋嘴]',
	'[可怜]',
	'[晕]', '[花心]', '[太开心]', '[亲亲]', '[鄙视]', '[呵呵]', '[挖鼻屎]', '[衰]', '[兔子]', '[good]', '[来]', '[威武]', '[围观]',
	'[萌]',
	'[送花]', '[囧]', '[酷]', '[糗大了]', '[撇嘴]', '[发呆]', '[汗]', '[睡]', '[吃惊]', '[白眼]', '[疑问]', '[阴险]', '[左哼哼]',
	'[右哼哼]',
	'[敲打]', '[委屈]', '[嘘]', '[吐]', '[做鬼脸]', '[ByeBye]', '[要哭了]', '[傲慢]', '[月亮]', '[太阳]', '[耶]', '[握手]', '[ok]',
	'[饭]',
	'[咖啡]', '[礼物]', '[猪头]', '[抱抱]', '[赞]', '[Hold]', '[神马]', '[坑爹]', '[有木有]', '[谢谢]', '[蓝心]', '[外星人]', '[魔鬼]',
	'[紫心]',
	'[绿心]', '[黄心]', '[音符]', '[闪烁]', '[星星]', '[雨滴]', '[火焰]', '[便便]', '[踩一脚]', '[下雨]', '[多云]', '[闪电]', '[雪花]',
	'[旋风]',
	'[包]', '[房子]', '[烟花]'
]

function br(content) {
	return content.replace('/\[mobcent_br\]/g', '<br />');
}

function url(content) {
	return content.replace(/\[mobcent_url=(.*?)\(title=(.*?)\)\]/g, '<a href="$1">$2</a>');
}

function video(content) {
	return content.replace(/\[mobcent_video=(.*?)\]/g, '<video controls controlslist="nodownload" src="$1"></video>');
}

function audio(content) {
	return content.replace(/\[mobcent_audio=(.*?)\]/g, '<audio controls controlslist="nodownload" src="$1"></audio>');
}

function attachment(content) {
	return content.replace(/\[mobcent_attachment=(.*?)\(title=(.*?)\)\(desc=(.*?)\)\]/g, '<a href="$1">$2</a>');
}

function image(content) {
	return content.replace(/\[mobcent_image=(.*?)\(aid=(.*?)\)\]/g, '<img style="width: 32rpx !important;height: 32rpx !important;" src="$1"/>');
}

function phiz(content) {
	content = content.replace(/\n/g, '<br/>')
	content = content.replace(/\[mobcent_phiz=(.*?)\]/g, '<img style="width: 32rpx !important;height: 32rpx !important;" src="$1"/>');
	content = content.replace(/\[video\](.*?)\[\/video\]/g,
		'<video controls controlslist="nodownload" src="$1"></video>')
	for (var i = 0; i < emojis.length; i++) {
		var emoji = emojis[i];
		content = content.replace(new RegExp('\\' + emoji.substr(0, emoji.length - 1) + '\\]', 'g'),
			'<img style="width: 32rpx !important;height: 32rpx !important;" src="/static/emoji/' +
			(i < 10 ? '0' +
				i : i) + '.png"/>');
	}
	return content;
}

function content(content) {
	let h = ''
	if (content) {
		for (let item of content) {
			if (0 == item.type && item.infor) {
				h += `<view>${mobcentPhiz(item.infor || '')}</view>`
			} else if (1 == item.type && item.infor) {
				if (item.infor.indexOf('//forum') == -1)
					h += `<img src="${item.infor}"/>`
			} else if (2 == item.type && item.infor) {
				h += `<video controls controlslist="nodownload" src="${item.infor}"></video>`
			} else if (3 == item.type && item.infor) {
				h += `<audio controls controlslist="nodownload" src="${item.infor}"></audio>`
			} else if ((4 == item.type || 5 == item.type) && item.infor) {
				if (['png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG', 'JPEG', 'GIF'].indexOf(item.infor.substr(item.infor
						.lastIndexOf('.') +
						1)) > -1) {
					// h += `<img src="${item.url}"/>`
				} else {
					h += `<a href="${item.url}">&nbsp;${item.infor}</a>`
				}
			}
		}
	}
	return h
}

export default {
	emojis,
	br,
	url,
	video,
	audio,
	attachment,
	image,
	phiz,
	content
}
