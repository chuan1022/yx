/*公用方法调用*/
yx.public.navFn();
yx.public.imgLoadFn();
yx.public.backTopFn();
yx.public.shopFn();
//banner轮播图
var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',			
	autoPlay:true,		
	intervalTime:3000,	
	loop:true,			
	totalNum:5,			
	moveNum:1,	
	showNum:1,
	circle:true,		
	moveWay:'opacity'	
});

//新品首发轮播图
var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',					
	loop:false,		
	intervalTime:1000,	
	totalNum:16,
	moveNum:2,	
	showNum:4,
	circle:false,		
	moveWay:'position'	
});

//大家都在说轮播图
var sayContent=new Carousel();
sayContent.init({
	id:'sayContent',			
	loop:true,
	autoPlay:true,		
	intervalTime:3000,	
	totalNum:7,			
	moveNum:1,	
	showNum:3,
	circle:false,		
	moveWay:'position'	
});

//人气推荐选项卡
(function(){
	var titles=yx.ga('.recommend .recommendList li');
	var contents=yx.ga('.recommend .recommendProduct');
	for(let i=0;i<titles.length;i++){
		titles[i].onclick=function(){
			for(let i=0;i<titles.length;i++){
				contents[i].style.display='none';
				titles[i].className='';
			}
			contents[i].style.display='block';
			titles[i].className='active';
		}
	}
})();

//限时商品
(function(){
	//倒计时
	var timeBox=yx.g('.limitProduct .timeBox');
	var spans=yx.ga('.limitProduct .timeBox span');
	var timer=setInterval(function(){
		showTime();
	},1000)
	function showTime(){
		var endTime=new Date(2017,7,26,14);
		if(endTime>new Date()){
			var restTime=yx.cutTime(endTime);
			spans[0].innerHTML=yx.format(restTime.h);
			spans[1].innerHTML=yx.format(restTime.m);
			spans[2].innerHTML=yx.format(restTime.s);
		}else{
			clearInterval(timer);
		}
	};
	
	//引入商品数据
	var limitBox=yx.ga('.limit .limitbox');
	var bar=yx.ga('.limitbox .numCon span');
	var str='';
	var item=json_promotion.itemList;
	for(let i=0;i<limitBox.length;i++){
		str='<a href="#" class="scale left">'+
			'<img original="'+item[i].listPicUrl+'" src="images/empty.gif" class="original"/>'+
			'</a>'+
			'<div class="right clearfix">'+
			'<a href="#"class="limittit">'+item[i].itemName+'</a>'+
			'<p>'+item[i].simpleDesc+'</p>'+
			'<div class="numBar clearfix">'+
				'<div class="numCon"><span style="width:'+item[i].currentSellVolume/item[i].totalSellVolume*100+'%"></span></div>'+
				'<span class="numTips">还剩'+item[i].currentSellVolume+'件</span>'+
			'</div>'+
			'<div>'+
				'<span class="limitPrice">限时价 ￥<span>'+item[i].actualPrice+'</span></span>'+
				'<span class="normalPrice">原价 <span>￥'+item[i].retailPrice+'</span></span>'+
			'</div>'+
			'<a href="#" class="buyNow">立即抢购</a>'+
			'</div>';
		limitBox[i].innerHTML=str;
	}
})();
