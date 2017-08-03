/*公用方法调用*/
yx.public.navFn();
yx.public.imgLoadFn();
yx.public.backTopFn();
yx.public.shopFn();
//解析url
var anaysUrl=yx.parseUrl(window.location.href);
var pageId=anaysUrl.id;//产品id
var product=productList[pageId];//产品id对应的数据
var evalu=evaluData[pageId];//产品对应的评论
console.log(product);

//跳转404页面
//if(!pageId||!productId){
//	window.location.href='404.html';
//}

//面包屑
(function(){
	var breads=yx.g('.brandHead');
	var str='';
	for(let i=0;i<product.categoryList.length;i++){
		str+='<a href="" > '+product.categoryList[i].name+'</a> >';
	};
	breads.innerHTML+=str+product.name;
})();

//产品信息
(function(){
	
	//产品图
	var bigImg=yx.g('#product .bigImg');
	var smallImgs=yx.ga('#product .smallImg img');
	var last=smallImgs[0];
	smallImgs[0].src=bigImg.src=product.primaryPicUrl;
	for(let i=0;i<smallImgs.length;i++){
		if(i){
			//渲染图片
			smallImgs[i].src=product.itemDetail['picUrl'+i];
		};
		//切换图片
		smallImgs[i].onmouseover=function(){
			bigImg.src=this.src;
			last.className='';
			this.className='active';
			last=this;
		};
	};
	
	//产品信息
	var infor=yx.g('#product .infor');
	yx.g('#product .infor h4').innerHTML=product.name;
	yx.g('#product .infor p').innerHTML=product.simpleDesc;
	yx.ga('#product .infor .price p span')[1].innerHTML='￥'+product.retailPrice;
	
	//型号(固定两栏)；
	var type1_id=[];
	var type2_id=[];
	//存储dom
	var typeBox=yx.ga('#product .type div');
	for(let j=0;j<2;j++){
		if(product.skuSpecList[j]){
			yx.ga('#product .type .title')[j].innerHTML=product.skuSpecList[j].name;
			//生成型号栏
			for(let i=0;i<product.skuSpecList[j].skuSpecValueList.length;i++){
				if(product.skuSpecList[j].skuSpecValueList[i].picUrl){
					//有图片时显示图片
					typeBox[j].innerHTML+='<img src="'+product.skuSpecList[j].skuSpecValueList[i].picUrl+' " title="'+product.skuSpecList[j].skuSpecValueList[i].value+' " id="'+product.skuSpecList[j].skuSpecValueList[i].id+'" />	';
				}else{
					//没图片时显示型号类别名字
					typeBox[j].innerHTML+='<p " id="'+product.skuSpecList[j].skuSpecValueList[i].id+'" title="'+product.skuSpecList[j].skuSpecValueList[i].value+'">'+product.skuSpecList[j].skuSpecValueList[i].value+'</p>';
				};
				
				//将每个类型类别ID放入对应数组,用来组合id查产品余量
				if(!j){
					type1_id.push(product.skuSpecList[0].skuSpecValueList[i].id);
				}else{
					type2_id.push(product.skuSpecList[1].skuSpecValueList[i].id);
				}
			};	
		}else{
			typeBox[j].parentNode.style.display='none';
		}
	};
	
	//型号选中功能
	var types1=typeBox[0].querySelectorAll('p').length?typeBox[0].querySelectorAll('p'):typeBox[0].querySelectorAll('img');
	var types2=typeBox[1].querySelectorAll('p').length?typeBox[1].querySelectorAll('p'):typeBox[1].querySelectorAll('img');

	//添加类别栏1点击事件
	for(let i=0;i<types1.length;i++){
		types1[i].onclick=function(){
			types1[i].index=i;
			getType(types1[i],types2,type1_id,type2_id);	
		}
	}; 
	//添加类别栏2点击事件
	for(let i=0;i<types2.length;i++){
		types2[i].onclick=function(){ 
			types2[i].index=i;
			getType(types2[i],types1,type2_id,type1_id);
		}
	};
	
	//判断余量功能
	function getType(obj1,obj2,typeId1,typeId2){
		if(obj1.className=='active'){
			//当自身已经选中时：取消自身选中，兄弟元素不处理，对方类别均可点击,对方已选中不处理；
			obj1.className='';
			for(let i=0;i<obj2.length;i++){
				if(obj2[i].className!='active'){
					obj2[i].className='';
				};
			};
		}else{
			//当自身未被选中时：取消兄弟节点选中状态，不能选中的不处理，选中自身，判断对方类别是否可点击,对方已点击的不处理；
			for(let i=0;i<obj1.parentNode.children.length;i++){
				if(obj1.parentNode.children[i].className!='noclick'){
					obj1.parentNode.children[i].className='';
				};
			};
			obj1.className='active';
			//更换大图图片
			if(obj1.src){
				bigImg.src=obj1.src;
			};
			//组合当前选中类别和对方类别下的所有id，放入conectIds
			var conectIds=[];
			for(let j=0;j<typeId2.length;j++){
				var str='';
				if(typeId1[obj1.index]>typeId2[j]){
					str=''+typeId2[j]+';'+typeId1[obj1.index]+'';
				}else{
					str=''+typeId1[obj1.index]+';'+typeId2[j]+'';
				}
				conectIds.push(str);
			};
			
			//检查当前选中类下，对方型号的余量
			for(let i=0;i<typeId2.length;i++){
				
				//余量为0的不可选中
				if(!product.skuMap[''+conectIds[i]+''].sellVolume){
					obj2[i].className='noclick';
				}else{
					//余量不为0，且对方未选中时，可选中，不改变对方已选中
					if(obj2[i].className!='active'){
						obj2[i].className='';
					}					
				};
			};
		};	
		changeBtn()
	};
	function changeBtn(){
   		var actives=yx.ga('#product .type .active');
   		if(actives.length<product.skuSpecList.length){
   			btns[0].className='noclick';
   			btns[1].className='noclick';
   			max.innerHTML='';
   		}else{
   			
   			//获取库存数量，更换大图
   			var id=''
   			for(let i=0;i<actives.length;i++){
   				id+=actives[i].id+';';
   			};
   			id=id.substring(0,id.length-1);
   			
   			//获取库存数量，改变大图图片
			maxNum=product.skuMap[id].sellVolume;
			bigImg.src=product.skuMap[id].picUrl;
   			
   			//显示还剩多少件
	 		if(maxNum){
	 			max.innerHTML='仅剩'+maxNum+'件';
	 		}
   			btns[0].className='';
   			btns[1].className='';
   			num.innerHTML=1;
   		}
	};
	
	//购买数量；限制最大最小值
	var btns=yx.ga('#product .nums button');
	var num=yx.g('#product .nums div span');
	var max=yx.g('#product .nums div i');
	var maxNum;
	btns[0].onclick=function(){
		if(btns[0].className!='noclick'){
			if(num.innerHTML>1){
			num.innerHTML--;
			}else{
				alert('最低限购一件');
			}
		}else{
			alert('请选择规格');
		}
		
	};

	btns[1].onclick=function(){
		if(btns[1].className!='noclick'){
			if(num.innerHTML<maxNum){
				num.innerHTML++;
			}else{
				alert('商品数量不足');	
			}
			var actives=yx.ga('#product .type .active');
		}else{
			alert('请选择规格');
		}
	};
	
	//大家都在看功能
	var lookBoxs=yx.ga('#lookBox li');
	//生成dom
	for(let i=0;i<recommendData.length;i++){
		lookBoxs[i].innerHTML='<a href="" class="scale"><img src="'+recommendData[i].listPicUrl+'"/></a>'+
							'<div class="title">'+
								'<a href="#">'+recommendData[i].name+'</a>'+
								'<p>￥'+recommendData[i].retailPrice+'</p>'+
							'</div>';
	};
	
	//添加轮播图
	var look=new Carousel();
	look.init({
		id:'lookBox',			
		autoPlay:false,		
		intervalTime:1000,	
		loop:true,			
		totalNum:8,			
		moveNum:1,	
		showNum:4,
		circle:false,		
		moveWay:'position'	
	});
})();

//详情
(function(){
	//选项卡
	var spans=yx.ga('#detail .leftsec .toptitle span');
	//评价数量
	if(evalu.data.result.length>1000){
		spans[1].innerHTML='评价(999+)';
	}else{
		spans[1].innerHTML='评价('+evalu.data.result.length+')';
	};
	
	var boxs=yx.ga('#detail .leftsec .box');
	var last=0;
	for(let i=0;i<spans.length;i++){
		spans[i].onclick=function(){
			spans[last].className='top';
			this.className='active top';
			boxs[last].style.display='none';
			boxs[i].style.display='block';
			last=i;
		};
	};
	
	//生成规格
	var details=yx.g('#detail .details ul');
	for(let i=0;i<product.attrList.length;i++){
		details.innerHTML+='<li><span>'+product.attrList[i].attrName+'</span>'+
							'<span>'+product.attrList[i].attrValue+'</span></li>'
	};
	//大图列表
	var images=yx.g('#detail .proimg');
	images.innerHTML=product.itemDetail.detailHtml;
	
	//评价内容
	var evaluTypes=yx.ga('#detail .evalu .slect .circle');
	//筛选有图评价
	var imgEvalus=[];//存放有图评价
	var allEvalus=[];//存放所有评价
	var allData=[];
	for(let i=0;i<evalu.data.result.length;i++){
		//放入所有
		allEvalus.push(evalu.data.result[i]);
		//放入有图
		if(evalu.data.result[i].picList.length){
			imgEvalus.push(evalu.data.result[i]);
		}
	};

	//显示数量
	var nums=yx.ga('#detail .slect .num');
	nums[0].innerHTML='全部'+allEvalus.length+'';
	nums[1].innerHTML='有图'+imgEvalus.length+'';
	
	//将所有组数据放入一个数组内
	allData.push(allEvalus);
	allData.push(imgEvalus);
	var useData=allData[0];//默认使用全部数据
	for(let i=0;i<evaluTypes.length;i++){
		evaluTypes[i].onclick=function(){
			for(let j=0;j<evaluTypes.length;j++){
				evaluTypes[j].className='circle';
			};
			this.className='circle active';
			useData=allData[i];//更换使用的整组数据
			
			//生成指定组的评价数据
			showEvalu(10,1);
			cretaPage(10,useData.length);
		};
	};
	var evaluBoxs=yx.g('#detail .evaluBoxs');
	
	//生成默认评价数据
	showEvalu(10,1);
	
	//封装生成评价数据函数
	function showEvalu(pn,cn){
		//pn 每页显示条数
		//cn 当前页码
		var startData=(cn-1)*pn;	//本页开始数据
		var endData=cn*pn-1;			//本页结束数据
		//结束数据条目不能大于总条目数
		if(endData>useData.length){
			endData=useData.length-1;
		};
		
		var str='';					//存放主体结构
		for(let i=startData;i<endData+1;i++){
			var userAvatar=useData[i].frontUserAvatar?useData[i].frontUserAvatar:'images/avatar.png';
			var smallImg='';
			var bigImg='';
			//判断是否有小图和轮播图
			if(useData[i].picList.length){
				var img='';
				var li='';
				//生成评论小图
				for(let j=0;j<useData[i].picList.length;j++){
					img+='<img src="'+useData[i].picList[j]+'"/>';
					li+='<li><img src="'+useData[i].picList[j]+'"/></li>';
				};
				
				//生成小图、轮播图
				smallImg='<p>'+img+'</p>';
				bigImg='<div class="show">'+
							'<div class="showBigImg" id="show'+i+'" data-imgNum='+useData[i].picList.length+'>'+
								'<div class="animationImg clearfix">'+
									'<ul>'+li+'</ul>'+
								'</div>'+
							'</div>'+
							'<div class="close">x</div>'+ 
						'</div>';
			};
			str+='<li class="clearfix">'+
					'<div class="user left">'+
						'<img src="'+userAvatar+'"/>'+
						'<p>'+useData[i].frontUserName+'</p>'+
					'</div>'+
					'<div class="content left">'+
						'<p>型号:'+useData[i].skuInfo+'</p>'+
						'<p>'+useData[i].content+'</p>'+
						''+smallImg+''+bigImg+''+
						'<p class="createTime">'+yx.formatDate(useData[i].createTime)+'</p>'+
					'</div>'+	
				'</li>';
		};
		evaluBoxs.innerHTML=str;
		showImg();
	}
	//调用轮播图
	function showImg(){
		var smallImgs=yx.ga('#detail .content p img');
		for(let i=0;i<smallImgs.length;i++){
			smallImgs[i].parentNode.parentNode.index=0;
			smallImgs[i].onclick=function(){
				smallImgs[i].parentNode.parentNode.index++;
				var carousParent=this.parentNode.parentNode;//.content
				var carousBox=carousParent.querySelector('.show');//.show
				var carous=carousParent.querySelector('.showBigImg');//.show #showi
				carousBox.style.display='block';
				
				//生成轮播图
				if(smallImgs[i].parentNode.parentNode.index==1){
					var newCarous=new Carousel();
					newCarous.init({
							id:carous.id,
							loop:true,
							totalNum:Number(carous.getAttribute('data-imgNum')),
							moveNum:1,
							showNum:1,
							circle:false,
							moveWay:'position'
					});
					var closes=yx.ga('#detail .close');
					var carousBoxs=yx.ga('#detail .show');
					for(let i=0;i<closes.length;i++){
						closes[i].onclick=function(){
							carousBoxs[i].style.display='none';
						};
					};
				};
			}
		}
	};
	
	//生成页码框
	var pagesBox=yx.g('.pageBox');
	var nowOn=1;//存储当前显示页码
	cretaPage(10,useData.length);
	
	//封装页码框函数
	function cretaPage(pn,tn){
		pagesBox.innerHTML='';
		//pn  每页显示的评论数
		//tn  数据总数
		var totalNum=Math.ceil(tn/pn);//总页数
		var pageStart=document.createElement('a');
		var pageEnd=document.createElement('a');
		pageStart.innerHTML=1;
		creatActive(pageStart);
		pagesBox.appendChild(pageStart);
		if(totalNum>1){
			pageEnd.innerHTML=totalNum;
			creatActive(pageEnd);
			pagesBox.appendChild(pageEnd);
		};
		
		//生成当前页码前后两页、页码省略符
		for(let i=nowOn-2;i<Number(nowOn)+3;i++){
			if(i>1&&i<totalNum){
				var pageOther=document.createElement('a');
				pageOther.innerHTML=i;
				creatActive(pageOther);
				pagesBox.insertBefore(pageOther,pageEnd);
			};
		};
		//前省略符
		if(nowOn-2>1){
			console.log(1);
			var span=document.createElement('span');
			span.innerHTML='...';
			pagesBox.replaceChild(span,pageStart);
			pagesBox.insertBefore(pageStart,span);
		};
		//后省略符
		if(Number(nowOn)+3<totalNum){
			var span=document.createElement('span');
			span.innerHTML='...';
			pagesBox.insertBefore(span,pageEnd);
		};	
		showFn();
		//上下页按钮
		var pre=yx.g('.prePage');
		var next=yx.g('.nextPage');
		pre.onclick=function(){
			nowOn--;
			if(nowOn<1){
				nowOn=1;
			}
			showEvalu(10,nowOn);
			cretaPage(10,useData.length);
		};
		next.onclick=function(){
			nowOn++;
			if(nowOn>totalNum){
				nowOn=totalNum;
			};
			showEvalu(10,nowOn);
			cretaPage(10,useData.length);
		}
	};
	//点击生成某一页
	function showFn(){
		var pages=yx.ga('.pageBox a');
		for(let i=0;i<pages.length;i++){
			pages[i].onclick=function(){
				nowOn=Number(this.innerHTML);
				showEvalu(10,nowOn);
				cretaPage(10,useData.length);
			};
		};
	};
	//赋予active
	function creatActive(page){
		if(Number(page.innerHTML)==nowOn){
			page.className='active';
		};
	};
})();

(function(){
	var join=yx.g('#joinShopCar');
	join.onclick=function(){
		var actives=yx.ga('#product .type .active');//选中规格
		var num=yx.g('#product .nums div span').innerHTML;//选中数量
   		if(actives.length<product.skuSpecList.length){
   			alert('请选择规格');
   			return;
   		}else{
   			var id=''
   			var type=''
   			for(let i=0;i<actives.length;i++){
   				id+=actives[i].id+';';
   				type+=actives[i].title+' ';
   			};
   			id=id.substring(0,id.length-1);
   			
   			//存储购买信息
   			var slect={
   				'id':id,
   				'name':product.name,
   				'price':product.skuMap[id].retailPrice,
   				'number':num,
   				'img':product.skuMap[id].picUrl,
   				'type':type
   			};
   			
   			//将购买信息转成jsonp放入本地存储
   			if(localStorage.getItem(id)){
				var value=JSON.parse(localStorage.getItem(id));
				slect.number=Number(slect.number)+Number(value.number);
				localStorage.setItem(id,JSON.stringify(slect));
   			}else{
   				localStorage.setItem(id,JSON.stringify(slect));
   			}
   			
   			yx.public.shopFn();
   		};
	};
	
})();


