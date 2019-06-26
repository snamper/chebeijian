// 配置全局接口域名
var domain; // api域名
var iconUrl; //图标网址
var platform; // 访问平台
var routing_identifier;  // 本地还是线上

const location_href = location.href;
	
if (location_href.indexOf('localhost') != -1) { // 本地
	routing_identifier = 1;
} else if (location_href.indexOf('.b.') != -1) { // b站
	routing_identifier = 3;
} else { // 线上
	routing_identifier = 2;
}

	
if (location_href.indexOf('localhost') != -1 || location_href.indexOf('.b.') != -1 ) { // 本地、b站	
	domain = 'http://api.b.autoafs.com/';
} else { // 线上
	domain = 'https://api.autoafs.com/';
}
iconUrl = 'https://api.autoafs.com/asset/img/';
platform = 'website';

export default {
	testUrl:domain,
	iconUrl:iconUrl,
	platform:platform,
	routing_identifier: routing_identifier,
}