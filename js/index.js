// 页面文档加载完成
document.addEventListener('DOMContentLoaded', function(){
	new Search('.jd_header_box');
	new Banner('.jd_banner');
	new DownTime('.sk_time');
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


// 轮播图
/*
1. 自动轮播图 无缝滚动
2. 点的对应改变
3. 滑动效果
4. 当滑动的距离不超过1/3时弹回
5. 当滑动的距离超过1/3时滚动
6. 根据体感比较快的速度 进行快速切换
*/

var Banner = function(selector){
	// selector 轮播图的选择器
	this.banner = document.querySelector(selector);
	//图片容器
	this.imageBox = this.banner.querySelector('ul:first-child');
	// 点容器
	this.poinitBox = this.banner.querySelector('ul:last-child');
	//宽度
	this.width = this.banner.offsetWidth;
	//当前索引
	this.index = 1;
	//切换时间
	this.speed = 1000;
	//定时器
	this.time = null; 
	//调用初始化函数
	this.init();

};

// 初始化函数
Banner.prototype.init = function(){
	this.autoPlay();
	this.seamless();
	this.swipeAble();
};

// 自动播放
Banner.prototype.autoPlay = function(){
	var that = this;
	//根据当前索引每隔一段时间去进行切换
	that.time = setInterval(function(){
		that.index++;
		//动画的切换
		//过度
		that.addTransition();
		//位移
		that.setTranslateX(-that.index*that.width);
	}, that.speed);
};

// 无缝链接
Banner.prototype.seamless = function(){
	// 无缝滚动
	var that = this;
	// 监听到第8张到第1张切换完成 瞬间定位到第一张
	this.imageBox.addEventListener('transitionend', function(){
		if(that.index >= 9){
			that.index = 1;
			//去掉过度
			//过度
			that.removeTransition();
			//位移
			that.setTranslateX(-that.index*that.width);
		}else if(that.index <= 0){
			that.index = 8;
			//去掉过度
			//过度
			that.removeTransition();
			//位移
			that.setTranslateX(-that.index*that.width);
		}

		//切换对应的点
		that.togglePoint();


	});
};

Banner.prototype.addTransition = function(){ //添加过度
	this.imageBox.style.transition = 'all 0.2s';
	this.imageBox.style.webkitTransition = 'all 0.2s';
};

Banner.prototype.removeTransition = function(){ //删除过度
	this.imageBox.style.transition = 'none';
	this.imageBox.style.webkitTransition = 'none';	
};

Banner.prototype.setTranslateX = function(translateX){ //设置定位
	this.imageBox.style.transform = 'translateX(' + translateX + 'px';
	this.imageBox.style.webkitTransform = 'translateX(' + translateX + 'px';
};

Banner.prototype.togglePoint = function(){ //切换对于的点
	//去掉之前的背景,加上当前的背景
	this.poinitBox.querySelector('li.show').classList.remove('show');
	this.poinitBox.querySelectorAll('li')[this.index-1].classList.add('show');
};


/*
滑动的思路:
1. 记录起始点X轴坐标
2. 获取滑动过程中当前的点X轴坐标
3. 比较起始点的坐标,从而得出移动的距离

*/

Banner.prototype.swipeAble = function(){ //滑动功能
	var that = this;
	var starX = 0; //起始的X坐标
	var distanceX = 0; //滑动改变的距离
	var startTime = 0; //起始时候的当前时间
	that.imageBox.addEventListener('touchstart', function(e){ //滑动开始
		starX = e.touches[0].clientX; //获取起始点横坐标
		startTime = Date.now(); //获取开始滑动的时间
		// 清除定时器
		clearInterval(that.time);
	});

	that.imageBox.addEventListener('touchmove', function(e){ //滑动过程
		var moveX = e.touches[0].clientX; //获取移动过程中点横坐标
		distanceX = moveX - starX; //获取当前移动的距离(改变的距离)
		// 将要移动的位置 = 原来的位置 + 改变的距离
		var translateX = -that.index * that.width + distanceX;
		that.removeTransition();
		that.setTranslateX(translateX);
	});

	that.imageBox.addEventListener('touchend', function(){ //滑动结束 //吸附功能
		var t = Date.now() - startTime; //完成一次滑动用的时间(毫秒)
		var v = Math.abs(distanceX) / t;
		if(v > 0.3){
			if(Math.abs(distanceX) < that.width/3){
				// 动画的回到原来的位置
				that.addTransition();
				that.setTranslateX(-that.index * that.width);
			}else{
				if(distanceX > 0){ //右滑
					that.index--;
				}else{
					that.index++;
				}
				// 动画
				that.addTransition();
				//切换
				that.setTranslateX(-that.index * that.width);
			}
		}

		// 加定时器
		clearInterval(that.time);
		that.autoPlay();

		//重置参数
		starX = 0; //起始的X坐标
		distanceX = 0; //滑动改变的距离
		startTime = 0; //起始时候的当前时间
	});
};


// 倒计时
var DownTime = function(selector){
	this.el = document.querySelector(selector);
	this.time = 2 * 60 * 60;
	this.timer = null;
	this.init();
}

DownTime.prototype.init = function(){
	// 倒计时需求
	//1. 假设一个时间 倒计时的时间为: 2个小时
	//2. 每隔一秒修改黑色容器内的数字
	var that = this;
	var spans = that.el.querySelectorAll('span');
	this.timer = setInterval(function(){
		that.time--;
		//格式化
		var h = Math.floor(that.time/3600);
		var m = Math.floor(that.time%3600/60);
		var s = Math.floor(that.time%60);
		//小时
		spans[0].innerHTML = Math.floor(h/10);
		spans[1].innerHTML = h%10;
		//分
		spans[3].innerHTML = Math.floor(m/10);
		spans[4].innerHTML = m%10;
		//秒
		spans[6].innerHTML = Math.floor(s/10);
		spans[7].innerHTML = s%10;
		
		// 结束
		if(that.time == 0){
			clearInterval(timer);
		}
	}, 1000);
};