// 页面文档加载完成
document.addEventListener('DOMContentLoaded', function(){
	new Search('.jd_header_box');
})

var Search = function(selector){
	this.ele = document.querySelector(selector); //获取元素
	this.bh = document.querySelector('.jd_banner').offsetHeight;
	this.maxOpactiy = 0.85; //透明度
	this.init(); //调用原型方法
};

Search.prototype.init = function(){ //构造原型方法
	var that = this; //保留原对象
	this.ele.style.background = 'rgba(216, 80, 92, 0)';

	window.onscroll = function(ev){ //监听滚动事件
		var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
		if(scrollTop < that.bh){
			opacity = scrollTop/that.bh * that.maxOpactiy;
		}else{
			opacity = that.maxOpactiy;
		}
		that.ele.style.background = 'rgba(216, 80, 92,' + opacity + ')';

	}
}
