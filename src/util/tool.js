export function format(ts) {
	let _ts = Math.ceil(ts);

	let minute = Math.floor(_ts / 60);
	if (minute < 10) minute = '0' + minute;

	let second = _ts % 60;
	if (second < 10) second = '0' + second;

	return minute + ':' + second
}
export function getSearch(name) {
	var searchIndex = window.location.hash.indexOf('?');
	var str = ''
	if(searchIndex > -1){
		str = decodeURIComponent(window.location.hash).slice(searchIndex + 1,window.location.hash.length)
	}else{
		return '';
	}
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = str.match(reg);
    if (r != null) return r[2];
    return '';
}