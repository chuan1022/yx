/*
 
 *轮播图组件说明
 * 1.功能：
 * 		按钮点击实现轮播；
 * 		圆点点击实现轮播；
 * 		自动播放；
 * 		是否循环播放；
 * 		是否显示圆点播放；
 * 		播放类型：opacity、position
 * 2.注意：
 * 		依赖move.js；
 * 		轮播图必须有一个父级，父级必须有一个id；
 * 		当loop为true时，自动播放为首尾循环播放；
 * 		loop为false时，自动播放到尾部时，会先运动到头部；
 * 		
 * */
;(function(window,undefined){
	var Carousel=function(){
		//默认参数，功能分析
		this.settings={
			id:'pic',			//父级ID
			autoPlay:false,		//是否自动播放
			intervalTime:1000,	//间隔时间
			loop:false,			//是否前后循环
			totalNum:5,			//图片总数量,由实际值确定；必须是moveNum的整数倍
			moveNum:1,			//单次运动图片数量，默认1；
			showNum:1,			//每版展示数量，由实际值确定；必须是moveNum的整数倍；
			circle:false,		//是否包含小圆点功能；
			moveWay:'opacity'	//运动方式：opacity:透明度运动；position:位置运动
		};
	};
	Carousel.prototype={
		constructor:Carousel,
		
		//传参
		init:function(opt){
			var opt=opt||this.settings;
			for(var attr in opt){
				this.settings[attr]=opt[attr];
			};
			this.creatDom();
			this.autoPlayFn();
		},
		
		//生成dom
		creatDom:function(){
			this.box=document.getElementById(this.settings.id);
			//创建左右按钮
			this.prev=document.createElement('div');
			this.next=document.createElement('div');
			this.prev.className='prev';
			this.next.className='next';
			this.prev.innerHTML='&lt;';
			this.next.innerHTML='&gt;';
			this.box.appendChild(this.prev);
			this.box.appendChild(this.next);
			
			var This=this;
			this.prev.onclick=function(){
				this.left=true;
				this.right=false;
				This.prevFn();
			};
			this.next.onclick=function(){
				this.left=false;
				this.right=true;
				This.nextFn();
			};
			
			//创建圆点
			if(this.settings.circle){
				this.circleBox=document.createElement('div');
				this.circleBox.className='circle';
				this.circles=[];
				for(let i=0;i<this.settings.totalNum/this.settings.moveNum;i++){
					var circle=document.createElement('span');
					circle.index=i;
					//圆点点击
					circle.onclick=function(){
						This.on=this.index;
						This[This.settings.moveWay+'Fn']();
						This.last=This.on;
						This.canClickFn();
					};
					this.circleBox.appendChild(circle);
					this.circles.push(circle);
				};
				this.circles[0].className='active';
				this.box.appendChild(this.circleBox);
			};
			
			this.moveInit();
			this.canClickFn();
			
		},
		
		//运动初始化
		moveInit:function(){
			this.on=0;  //当前版面
			this.last=0;//上一版面
			this.canClickNext=true;//是否可以点击
			this.canClickPrev=true;//是否可以点击
			this.left=false;
			this.right=false;
			this.endNum=(this.settings.totalNum-this.settings.showNum)/this.settings.moveNum+1;	//版面总数
			
			this.opacityItems=this.box.children[0].children;			//透明度变化的元素
			this.positionItem=this.box.children[0].children[0];			//变化位置的运动标签
			this.positionItems=this.positionItem.children;				//运动标签下的单个标签
			
			
			switch(this.settings.moveWay){
				case 'opacity':		
				//初始化透明度和transtion
				for(let i=0;i<this.opacityItems.length;i++){
					this.opacityItems[i].style.opacity=0;
					this.opacityItems[i].style.transition='1s opacity';
				}
				this.opacityItems[0].style.opacity=1;	
				break;
				
				case 'position':
				//初始化父级宽度
				var leftMargin=parseInt(getComputedStyle(this.positionItems[0]).marginLeft);
				var rightMargin=parseInt(getComputedStyle(this.positionItems[0]).marginRight);
				
				//单个li宽度
				this.singleWidth=this.positionItems[0].offsetWidth+leftMargin+rightMargin;
				//父级宽度
				if(this.settings.loop){
					//循环时复制一份，双倍宽度 
					this.positionItem.innerHTML+=this.positionItem.innerHTML;
				}
				
				//设置父级宽度
				this.positionItem.style.width=this.singleWidth*this.positionItems.length+'px';
				
				//位置运动循环时默认显示复制那份
				if(this.settings.loop){
					this.on=this.endNum+this.settings.showNum/this.settings.moveNum-1;
					this.beginOn=this.on;//存储初始on值循环时调用；
					this.endNum=(this.settings.totalNum*2-this.settings.showNum)/this.settings.moveNum+1;
					this.positionItem.style.left=-this.positionItem.offsetWidth/2+'px';
				};
				break;
			}
		},
		
		//透明度运动
		opacityFn:function(){
			//上一个隐藏
			this.opacityItems[this.last].style.opacity=0;
			this.circles[this.last].className='';
			//显示当前
			this.opacityItems[this.on].style.opacity=1;
			this.circles[this.on].className='active';
		},
		
		//位置运动
		positionFn:function(){
			var This=this;
			if(!this.settings.loop){
				//不能首尾循环时
				if(this.on<this.endNum){
						move(this.positionItem,{left:-this.singleWidth*this.settings.moveNum*this.on},300,'linear',function(){
						This.last=This.on;
					})
				};
				return;
			}else{
				//能够首尾循环时
				if(this.on==0){	
					//左边到头，进入循环时候，将运动框left变为一半+一个版面宽度，从中间开始循环
					if(this.left){
						this.on=this.beginOn;	
						this.positionItem.style.left=-(this.positionItem.offsetWidth/2+this.singleWidth*this.settings.moveNum)+'px';
						move(this.positionItem,{left:-this.singleWidth*this.settings.moveNum*this.on},300,'linear',function(){
							This.last=This.on;
						});
					};
					if(this.right){
						//右边到头，进入循环时候，将运动框left变为一半-一个版面宽度，从中间开始循环
						this.on=this.beginOn-(this.settings.showNum/this.settings.moveNum-1);
						this.positionItem.style.left=-(this.positionItem.offsetWidth/2-(this.settings.showNum/this.settings.moveNum)*this.singleWidth*this.settings.moveNum)+'px';
						move(this.positionItem,{left:-this.singleWidth*this.settings.moveNum*this.on},300,'linear',function(){
							This.last=This.on;
						});
					}
					
				}else{
					//不在两边时正常移动
					move(this.positionItem,{left:-this.singleWidth*this.settings.moveNum*this.on},300,'linear',function(){
						This.last=This.on;
					});
					return;
				}
			}
			
		},
		
		//上翻
		prevFn:function(){
			this.left=true;
			this.right=false;
			//可循环时，始终可以点击
			if(this.settings.loop){
				this.on--;
				if(this.on<0){
					this.on=this.endNum-1;
				};
			}else{
				//不可循环时，到两端终止运动
				if(this.on>0){
					this.on--;
				}else{
					this.on=0;
				};
			}
			
			if(this.canClickPrev){
				this[this.settings.moveWay+'Fn']();
				this.canClickNext=true;
				this.next.style.opacity=1;
				this.next.style.cursor='pointer';
				this.last=this.on;
			};
			this.canClickFn();
		},
		
		//下翻
		nextFn:function(){
			this.right=true;
			this.left=false;
			if(this.settings.loop){
				//可循环时，始终可以点击
				this.on++;
				if(this.on>this.endNum-1){
					this.on=0;
				}
			}else{
				//不可循环时，到两端终止运动
				if(this.on<this.endNum-1){
					this.on++;
				}else{
					this.on=this.endNum-1;
				};
			}
			
			if(this.canClickNext){
				this[this.settings.moveWay+'Fn']();
				this.canClickPrev=true;
				this.prev.style.opacity=1;
				this.prev.style.cursor='pointer';
				this.last=this.on;
			};
			this.canClickFn();
		},
		
		//判断不可点情况	
		canClickFn:function(){
			if(!this.settings.loop){
				if(this.on==0){
					this.canClickPrev=false;
					this.prev.style.opacity=0.5;
					this.prev.style.cursor='not-allowed';
				}else{
					this.canClickPrev=true;
					this.prev.style.opacity=1;
					this.prev.style.cursor='pointer';
				};
				if(this.on==this.endNum-1){
					this.next.style.opacity=0.5;
					this.next.style.cursor='not-allowed';
					this.canClickNext=false;
				}else{
					this.next.style.opacity=1;
					this.next.style.cursor='pointer';
					this.canClickNext=true;
				}
				
			};
		},
		//自动播放功能
		autoPlayFn:function(){
			if(this.settings.autoPlay){
			
				var This=this;
				this.timer=setInterval(function(){
					This.nextFn();
				},This.settings.intervalTime);
				this.box.onmousemove=function(){
					clearInterval(This.timer);
					This.timer=null;
				};
				this.box.onmouseleave=function(){
					This.autoPlayFn();
				};
			};
		}
	}
	
	window.Carousel=Carousel;
})(window,undefined);
