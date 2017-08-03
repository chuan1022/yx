window.yx={
	//获取元素函数
	g:function(name){
		return document.querySelector(name);
	},
	ga:function(name){
		return document.querySelectorAll(name);
	},
	
//工具类函数
	//添加事件
	addEvent:function(obj,ev,fn){
		if(obj.addEventListener){			
			obj.addEventListener(ev,fn);
		}else{
			obj.attachEvent('on'+ev,fn);
		}
	},
	
	//移除事件
	removeEvent:function(obj,ev,fn){
		if(obj.removeEventListener){
			obj.removeEventListener(ev,fn);
		}else{
			obj.detachEvent('on'+ev,fn);
		}
	},
	
	//获取元素距离html的高度
	getValueTop:function(obj){		
		var top=0;
		while(obj.offsetParent){
			top+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		return top;
	},
	
	//倒计时
	cutTime:function(target){
		var now=new Date();
		var v=Math.abs(target-now);
		return {
			d:parseInt(v/(24*3600000)),
			h:parseInt(v%(24*3600000)/3600000),
			m:parseInt(v%(24*3600000)%3600000/60000),
			s:parseInt(v%(24*3600000)%3600000%60000/1000)
		}
	},
	
	//加0
	format:function(v){
		return v<10?'0'+v:v;
	},
	
	//解析url
	parseUrl:function(url){
		var reg=/(\w+)=(\w+)/ig;
		var result={};
		
		url.replace(reg,function(a,b,c){
			result[b]=c;
		})
		return result;
	},
	//解析时间戳
	formatDate:function(time){
		var d=new Date(time)
		return d.getFullYear()+'-'+yx.format(d.getHours())+'-'+yx.format(d.getDate())+' '+yx.format(d.getHours())+'月'+yx.format(d.getMinutes())+'日';
	},
	
	//公用功能
	public:{
		
		//下拉导航、吸顶导航功能
		navFn:function(){
			var nav=yx.g('.nav');
			var lis=yx.ga('.nav .navBar li');
			var subNav=yx.g('.nav .subNav');
			var downNav=yx.ga('.nav .subNav ul');
			var downLis=[];
				var fixNon=yx.ga('.nav .fixNon');
			//筛选有下拉导航的li
			for(let i=1;i<lis.length;i++){
				downLis.push(lis[i]);
			};
			for(let i=0;i<downLis.length;i++){
				downLis[i].onmouseenter=downNav[i].onmouseenter=function(){
					for(let i=0;i<downLis.length;i++){
						downLis[i].className='';
						downNav[i].style.display='none';
					};
					//隐藏右侧两个选项
					if(window.pageYOffset>nav.offsetTop){
						for(let i=0;i<fixNon.length;i++){
							fixNon[i].style.display='none';
						}
					};
					
					downLis[i].className='active';
					downNav[i].style.display='block';
					subNav.style.opacity='1';
				};
				downLis[i].onmouseleave=downNav[i].onmouseleave=function(){
					
					//隐藏右侧两个选项
					if(window.pageYOffset>nav.offsetTop){
						for(let i=0;i<fixNon.length;i++){
							fixNon[i].style.display='none';
						}
					};
					
					downLis[i] .className='';
					downNav[i].style.display='none';
					subNav.style.opacity='0';
				};
			};	
			//吸顶导航
			fixedNav();
			yx.addEvent(window,'scroll',fixedNav);
			function fixedNav(){
				if(window.pageYOffset>nav.offsetTop){
					nav.id='navFix';
					for(let i=0;i<fixNon.length;i++){
						fixNon[i].style.display='none';
					}
				}else{
					nav.id='';
					for(let i=0;i<fixNon.length;i++){
						fixNon[i].style.display='inline-block';
					}
				}
			}
		},
		
		//图片懒加载功能
		imgLoadFn:function(){
			//当可视区距离+滚动条滚动距离=图片距离html距离时，加载实际图片；
			delayImg();
			yx.addEvent(window,'scroll',delayImg);
			function delayImg(){
				var originals=yx.ga('.original');//不断获取需要懒加载的图片
				var scrTop=window.innerHeight+window.pageYOffset;//获取可视区距离+滚动条滚动距离
				//加载图片
				for(var i=0;i<originals.length;i++){
					if(yx.getValueTop(originals[i])<scrTop){
						originals[i].src=originals[i].getAttribute('original');
						originals[i].removeAttribute('class');//同时取消class，提高性能；
					};
				};
				//当最后一张图片加载完成时，取消此事件
				if(originals.length){
					if(originals[originals.length-1].getAttribute('src')!='images/empty.gif'){
						yx.removeEvent(window,'scroll',delayImg);
					};
				};
			}
		},
		
		//返回顶部功能
		backTopFn:function(){
			var back=yx.g('.back');
			var timer;
			back.onclick=function(){
				var top=window.pageYOffset;
				timer=setInterval(function(){
					top-=100;
					if(top<=0){
						top=0;
						clearInterval(timer);
					}
					window.scrollTo(0,top);
				},16)
			};
		},
		
		//购物车功能
		shopFn:function(){
			var productNum=0;//购买商品的类数
			var totalPrice=0;
			var shopCar=yx.g('.nav .shopCar');
			var cart=yx.g('.nav .shopCar .cart');
			var shopCarBox=yx.g('.nav .shopCar ul');
			
			(function(local){
				var str='';
				if(local.length){
					for(let i=0;i<local.length;i++){
						var attr=local.key(i);
						var shopDetail=JSON.parse(local[attr]);
						str+='<li class="clearfix">'+
								'<a href="#" class="img"><img src="'+shopDetail.img+'"/></a>'+
								'<div class="message">'+
									'<p><a href="#">'+shopDetail.name+'</a></p>'+
									'<p>'+shopDetail.type+' x'+shopDetail.number+'</p>'+
								'</div>'+
								'<div class="price"> ￥'+shopDetail.price+' </div>'+
								'<div class="close">x</div>'+
							'</li>';
							productNum+=Number(shopDetail.number);
							totalPrice+=shopDetail.price*shopDetail.number;
					};
					shopCarBox.innerHTML=str;
					yx.g('.nav .shopCar i').innerHTML=productNum;
					yx.g('.nav .total span').innerHTML='￥'+totalPrice+'';
				}else{
					shopCarBox.innerHTML='';
					yx.g('.nav .shopCar i').innerHTML=0;
				};
				
				//删除商品功能
				var close=yx.ga('.nav .close');
				for(let i=0;i<close.length;i++){
					close[i].onclick=function(){
						var attr=local.key(i);
						local.removeItem(attr);
						yx.public.shopFn();
						if(!local.length){
							yx.g('.nav .shopCar i').innerHTML=0;
							cart.style.display='none';
						}
					};
				};
				
				//购物车显示隐藏
				shopCar.onmouseenter=function(){
					if(productNum){
						cart.style.display='block';
					};
				};
				shopCar.onmouseleave=function(){	
					cart.style.display='none';
				};
			})(localStorage);
		}
	}
}
