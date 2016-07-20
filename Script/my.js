/*
 *通用全局函数
 */

/* 添加事件的兼容 */
function addEvent(node,event,handler){
            if (node.addEventListener){
                node.addEventListener(event,handler,false);
            }else{
                node.attachEvent('on'+event,handler);
            }
        }
/* getElementsByClassName的兼容 */
function getElementsByClassName(element, names) {
        if (element.getElementsByClassName) {
            return element.getElementsByClassName(names);
        } else {
            //获取输入元素的所有后代元素
            var elements = element.getElementsByTagName('*');
            var result = [];
            var element,
                classNameStr,
                flag;
            names = names.split(' ');
            //过滤获取具有指定类名的元素
            for (var i = 0; element = elements[i]; i++) {
                classNameStr = ' ' + element.className + ' ';
                flag = true;
                for (var j = 0, name; name = names[j]; j++) {
                    if (classNameStr.indexOf(' ' + name + '') == -1) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    result.push(element);
                }
            }
            return result;
        }
    }
/* cookie的获取、设置和删除 */
var Cookie = {
	get: function(name){
		var cookieName = encodeURIComponent(name)+ "=";
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null;
		if(cookieStart > -1){
			var cookieEnd = document.cookie.indexOf(';',cookieStart);
			if(cookieEnd == -1){
				cookieEnd = document.cookie.length;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
		}
		return cookieValue;
	},
	set: function(name,value,expires,path,domain,secure){
		var cookieText = encodeURIComponent(name)+ '=' +
						encodeURIComponent(value);
		if(expires instanceof Date){
			cookieText += "; expires=" + expires.toGMTString();
		}
		if(path){
			cookieText += "; path=" + path;
		}
		if(domain){
			cookieText += "; domain=" + domain;
		}
		if(secure){
			cookieText += "; secure";
		}
		document.cookie = cookieText;
	},
	unset: function(name,path,domain,secure){
		this.set(name,"",new Date(0),path,domain,secure)
	}
}

/* Ajax调用 */
function ajax(method,url,isAsync,senddata,callback){ 
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
	    if(xhr.readyState == 4){
	        if((xhr.status>=200&&xhr.status<300) || xhr.status ==304){
		        console.log("OK!")
		        callback(JSON.parse(xhr.responseText));
	        }else {
	            alert("Request was unsuccessful:"+ xhr.status);
	        }
	    }
	};
	xhr.open(method,url,isAsync);
	xhr.send(senddata);
}

/* 请求参数序列化
 * 传入一个请求地址，以及请求参数的对象
 * 返回添加请求参数后的请求地址
*/
function serialize(url,data){
    if(!data) return "";
    var pairs = [];
    for(var name in data){
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + "=" +value);
    }
    url += ((url.indexOf("?") == -1) ? "?" : "&");
    url += pairs.join("&");
    return url;
}


/*
 *IE8的响应式兼容
 */
function responsive(){
    if(navigator.userAgent.indexOf("MSIE 8.0")>0) {
        var g_remder = document.querySelector(".m-remder .g-remder");
        var g_nav = document.querySelector(".m-nav .g-nav");
        var g_intros = document.querySelector(".m-intros .g-intros");
        var g_intros_p = document.querySelectorAll(".m-intros .g-intros p");
        var g_courses = document.querySelector(".m-courses .g-courses");
        var g_mn = document.querySelector(".m-courses .g-mn");
        addEvent(window,"resize",function(event){
            if(document.body.clientWidth<1206){
                g_remder.style.width = "960px";
                g_nav.style.width = "960px";
                g_intros.style.width = "960px";
                g_courses.style.width = "960px";

                g_mn.style.width = "735px";
                g_intros_p[0].style.width = "155px"; 
                g_intros_p[1].style.width = "155px"; 
                g_intros_p[2].style.width = "155px"; 
            }else{
                g_remder.style.width = "";
                g_nav.style.width = "";
                g_intros.style.width = "";
                g_courses.style.width = "";

                g_mn.style.width = "";
                g_intros_p[0].style.width = ""; 
                g_intros_p[1].style.width = ""; 
                g_intros_p[2].style.width = ""; 
            }
        });    
    }
}
/*
 *功能点一
 *关闭顶部通知条
 */
function closeTips(){
	var ele =  document.querySelector(".m-remder");
	var close = ele.querySelector(".f-fr");
	if(Cookie.get("tips")=="close"){
		ele.style.display="none";
		
	} else{
		ele.style.display="block";
		addEvent(close,'click',function(event){
				ele.style.display="none";
				Cookie.set("tips","close");	
		})	
	}
}

/*
 *功能点二
 *关注登录
 */

/* 
 * 页面刷新后，判断用户是否已登录（检查登录cookie）
 * 如果已登录，再判断之前是否已经关注（检查关注cookie）
 * 如果已经登录且之前已经关注，调用关注API
*/
function ifFocused(){
	if(Cookie.get("loginSuc")=="yes"){		 
		if(Cookie.get("followSuc")=="yes"){
			focused();	
		}			
	} 		
}

/* 关注API */
function focused(){
	var focusBtn = document.querySelector(".m-nav .focus");
	var focusedBtn = document.querySelector(".m-nav .focused");	
	focusBtn.style.display="none";
	focusedBtn.style.display="";
	Cookie.set("followSuc","yes");
}
/* 取消关注API */
function cancelfocused(){
	var focusBtn = document.querySelector(".m-nav .focus");
	var focusedBtn = document.querySelector(".m-nav .focused");	
	focusBtn.style.display="";
	focusedBtn.style.display="none";
	Cookie.unset("followSuc");
}


function initFoucusEvent(){
	/* 单击关注按钮 */
	var focusBtn = document.querySelector(".m-nav .focus");
	addEvent(focusBtn,'click',function(event){
		if(!Cookie.get("loginSuc")){		 
			initLogin();		
		}else if(Cookie.get("loginSuc")=="yes"){		
			focused();
		}	
	})
	/* 单击取消关注按钮 */
	var cancelBtn = document.querySelector(".m-nav .u-cancel");
	addEvent(cancelBtn,'click',cancelfocused);
}

/* 初始化登录框 */
function initLogin (){
	var m_login = document.querySelector(".m-login");
	var loginForm = document.forms.login; 
	var closeBtn = m_login.querySelector(".u-clos");
	// 弹出登录框
	m_login.style.display="block";
	// 单击关闭登录框
	addEvent(closeBtn,'click',function(event){
	    m_login.style.display="none";
	})
	// 提交表单
	addEvent(loginForm,'submit',function(event){
		// 阻止表单默认提交
		var event = event || window.event;
		if(event.preventDefault){
            event.preventDefault();
        }
        else{
            event.returnValue = false;
        }
		
		// 账密验证登录
		var v_userName = loginForm.elements['userName'].value;
		var v_password = loginForm.elements['password'].value;
		var data ={
			userName:md5(v_userName),
			password:md5(v_password)
		}
		var loginUrl = "http://study.163.com/webDev/login.htm";
	  	loginUrl = serialize(loginUrl,data); // 添加请求参数
	  	ajax("get",loginUrl,false,null,callback); // 调用ajax验证
	  	// 处理返回数据
	  	function  callback(txt){
	         if(txt===1){
	       		m_login.style.display = "none";
				Cookie.set("loginSuc","yes");
				focused();
	       }else{
	 		m_login.querySelector(".tips").style.display="block";
	 		}
		}
	})
}

/*
 *功能点三
 *轮播图
 */

/* 淡入函数 */
function fadein(curImg,milliseconds,preImg){
    curImg.style.display="block";
    curImg.style["z-index"] = "2";
    var stepLength = 10/milliseconds;
    var step = function(){
        var nextOpacity = parseFloat(curImg.style.opacity) + stepLength;
        if(nextOpacity<1){
            curImg.style.opacity = nextOpacity;
            curImg.style.filter = 'alpha(opacity=' + nextOpacity*100 +')';
        }else{
            curImg.style.opacity = "1";
            curImg.style.filter = "alpha(opacity=100)";
            preImg.style.display = "none";
            preImg.style.opacity = "0";
            preImg.style.filter = "alpha(opacity=0)";
            clearInterval(intervalID);
        }
    }           
    var intervalID = setInterval(step,10);
}

/* 切换图片函数 */
function changeImages(pre,cur){
    var imgs = document.querySelectorAll(".m-banner .img");
    var preImg = imgs[pre];
    var curImg = imgs[cur];
    //图片淡出切换      
    preImg.style["z-index"] = "1";//必须先将前一个元素降级，否则第一个元素的淡出会有问题
    fadein(curImg,500,preImg);      

 
}
/* 切换圆点函数 */
function changePoints(pre,cur){
    var points = document.querySelectorAll(".m-banner .pointer li");
    prePoint = points[pre];
    curPoint = points[cur];
    curPoint.setAttribute("class","z-sel");         
    prePoint.setAttribute("class","");              
}

/* 轮播初始化 */
function initBanner(){
    var banners = document.querySelector(".m-banner");
    var pre = 0;
    function slideBanners(){
        var cur = (pre == 2) ? 0:pre + 1;
        changeImages(pre,cur);
        changePoints(pre,cur);   
        pre = cur ; 
    }   
    var id = setInterval(slideBanners, 5000);
    addEvent(banners,"mouseenter",function(event){
        clearInterval(id);
    });
    addEvent(banners,"mouseleave",function(event){
        id = setInterval(slideBanners, 5000);
    })
}


/*
 *功能点五
 *获取课程内容区
 */

/*
 *功能：在函数内部，将请求参数序列化，并通过ajax得到后台数据
 *      并将之转化为对象
 *输入：课程地址，以及请求参数
 *输出：课程数据组成的对象
 */
function getcourse(courseUrl,reqstData){ 
    var obj={};
    if(!!reqstData){
        courseUrl = serialize(courseUrl,reqstData);
    }   
    function callback(text){
        obj = text;
    }
    ajax("get",courseUrl,false,null,callback);  
    return obj;
}

/*
 *功能：根据传入的课程列表构建HTML
 *输入：后台返回的课程卡片数据
 *输出：课程卡片的HMTL结构
*/
function cardsHTML(data){
    var courseList = data.list;
    var courseDiv = document.querySelector(".m-courses");
    var CourseNode = courseDiv.querySelector(".mainCous");
    CourseNode.innerHTML = '';
    for(var i=0;i<courseList.length;i++){ 
        //获取每一门课程的详细信息
        var course = courseList[i];
        var price = course.price;
        if(price==0){
            price = "免费";
        }else{
            price = '￥'+ price;
        }
        var categoryName =course.categoryName;
        if(categoryName==null) categoryName = "无";

        // 将获取的数据添加到文档结构中
        var card = document.createElement('div');
        card.setAttribute('class','card');
        var html = '<div class="cardSimple"><img width="223" height="124" src=' + course.middlePhotoUrl;
        html += '><div class="u-infro"><p class="name">' + course.name;
        html += '</p><p class="provider">' + course.provider;
        html += '</p><div class="learnerCount"><span class="icon"></span>';
        html += '<span class="count">' + course.learnerCount;
        html += '</span></div><div class="price">' + price;
        html += '</div></div></div><div class="cardDetail"><img width="223" height="124" src=';
        html += course.middlePhotoUrl;
        html += '><div class="u-infro"><p class="name">' + course.name;
        html += '</p><div class="learnerCount"><span class="icon"></span>';
        html += '<span class="count">' + course.learnerCount + '人在学';
        html += '</span></div><p class="provider">' + '发布者：' + course.provider;
        html += '</p><p class="category">' + '分类：' + categoryName;
        html += '</p></div><div class="description"><p>' + course.description;
        html += '</p></div></div></div>';
        card.innerHTML = html;
        CourseNode.appendChild(card); 
    }   
}

/*
 *功能：刷新翻页器对象
 *输入：服务器返回的课程数据对象
 *输出：翻页器对象（包含当前页、起始页和结束页）
 */
function updatePageObj(reqstData,data){
    var totalPage = data.totalPage;
    if(reqstData.pageNo>totalPage){
        reqstData.pageNo = totalPage;
    }//为了适应在窄屏下选择了>27页，然后屏幕变为宽屏后出现的问题
    var obj = {
        sel: parseInt(reqstData.pageNo),
        from: 1,
        to: 8,
        total : data.totalPage      
    };
    if(obj.sel<=4){
        obj.from = 1;
        obj.to =8;
    }else if(obj.sel>=totalPage-4){
        obj.from = totalPage-7;
        obj.to = totalPage;
    }else{
        obj.from = obj.sel-3;
        obj.to = obj.sel+4;
    }
    return obj;
}

/*
 *功能：刷新页码
 *输入：翻页器对象
 *输出：新的页码
 */
function pagesHTML(page){
    var pageNode = document.querySelector(".m-courses .m-pages ul");
    pageNode.querySelector(".z-sel").removeAttribute('class');
    var selpage;
    for(var i=page.from,j=0;i<=page.to;i++){
        pageNode.querySelectorAll("li")[j].innerHTML = i;
        j++;         
    }
    if(page.sel<=4){
        selpage=pageNode.querySelectorAll("li")[page.sel-1];
    }else if(page.sel>=page.total-4){
        selpage=pageNode.querySelectorAll("li")[page.sel-(page.total-7)];
    }else{
        selpage=pageNode.querySelectorAll("li")[3];
    }
    selpage.setAttribute('class','z-sel');
}

/* 初始化课程卡片 */
function initMainCourses(){
    var courseUrl ="http://study.163.com/webDev/couresByCategory.htm";
    var reqstData = {
        pageNo: 1, 
        psize: 20,
        type: 10
    }; 
    if(document.body.clientWidth<1206){
        reqstData.psize = 15;   
    }//防止在小窗口状态下刷新页面时返回20个卡片 

    /* 初始化返回参数和页码对象 */
    var data = getcourse(courseUrl,reqstData);
    var page = updatePageObj(reqstData,data);
    /*
     *功能：根据请求参数的变化，
     *      更新翻页器(更新页码和监听)以及课程卡片
     *输入：课程地址，以及请求参数
     *输出：新的课程内容区
     */
    function changePage(courseUrl,reqstData){
        data = getcourse(courseUrl,reqstData);
        page = updatePageObj(reqstData,data);
        pagesHTML(page);
        cardsHTML(data);
    }

    /* 监听窗口大小的变化，实现响应式课程卡片 */
    (function changeWidth(){
        changePage(courseUrl,reqstData);
        addEvent(window,"resize",function(event){
            if(document.body.clientWidth<1206){
                reqstData.psize = 15;
                changePage(courseUrl,reqstData);
            }else{
                reqstData.psize = 20;
                changePage(courseUrl,reqstData);
            }
        })
    })();

    /* 监听tab的选中变化，由此切换课程 */
    (function changeTab(){
        var tab = document.querySelectorAll(".m-courses .tab li");
        var tabProduct = tab[0];
        var tabProgram = tab[1];
        addEvent(tabProduct,"click",function(event){
            tabProduct.setAttribute("class","z-sel");
            tabProgram.setAttribute("class","");
            reqstData.type = 10;
            reqstData.pageNo = 1;
            changePage(courseUrl,reqstData);
        })  
        addEvent(tabProgram,"click",function(event){
            tabProgram.setAttribute("class","z-sel");
            tabProduct.setAttribute("class","");
            reqstData.type = 20;
            reqstData.pageNo = 1;
            changePage(courseUrl,reqstData);
        })  
    })();
    
    /* 为翻页器添加单击事件 */
    (function addClickEvent(){
        var pageNode = document.querySelector(".m-courses .m-pages"); // 翻页器模块节点
        var allPages = pageNode.querySelectorAll("ul li");   // 所有页码集合节点
        var prePageNode = pageNode.querySelectorAll("img")[0]; // 前翻页节点
        var nextPageNode = pageNode.querySelectorAll("img")[1]; // 后翻页节点
        /* 为前翻页和后翻页节点添加单击事件监听 */     
        addEvent(prePageNode,"click",function(event){
            if(reqstData.pageNo>1){
                reqstData.pageNo = reqstData.pageNo-1;
                changePage(courseUrl,reqstData); 
            }                     
        });
        addEvent(nextPageNode,"click",function(event){
            if(reqstData.pageNo<page.total){
                reqstData.pageNo = parseInt(reqstData.pageNo)+1;
                changePage(courseUrl,reqstData); 
            }
        }); 
        /* 为所有页码添加单击事件监听 */ 
        for(var i=0;i<8;i++){
            (function(_i){
                addEvent(allPages[_i],"click",function(event){
                    reqstData.pageNo = allPages[_i].innerHTML;
                    changePage(courseUrl,reqstData);               
                })  
            })(i);          
        }        
    })();
}
/*
 *功能点六
 *获取热门课程推荐
 *实现5s滚动更新热门课程
 */
function initHotCourses(){
	var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
	var courseList = getcourse(url);
	var hotcouresNode = document.querySelector(".m-courses .g-sd .hotCourses");
	var from = 0; // 第一门课程的索引
	/* 传入第一门课程的索引，然后依次添加10门课程的HTML */
	function update(from){	
		hotcouresNode.innerHTML='';			
		for(var i=0;i<10;i++){
			var index = from+i; // 将要添加的课程索引
			if(index>19){index = index-19;}

			var course = courseList[index]; // 当前索引下的课程对象
			var hotcard = document.createElement('div');
			hotcard.setAttribute("class","hotcard");
			var html = '<img width="50" height="50" src=' + course.smallPhotoUrl;
			html += '><div class="u-infro"><div class="name">' + course.name;
			html += '</div><div class="learnerCount"><span class="icon"></span>';
			html += '<span class="count">' + course.learnerCount;
			html += '</span></div></div></div>';
			hotcard.innerHTML = html;
			hotcouresNode.appendChild(hotcard);	
		}
	}
	var intervalID = setInterval(function(){
		if(from>19){from = 0;}
		update(from);
		from++;
	},5000);
}

/*
 *功能点七
 *视频弹窗
 */
function initVideo(){
    var videoNode = document.querySelector(".m-video");
    var video = videoNode.querySelector("video");
    var openNode = document.querySelector(".m-courses .video img");
    var closeNode = videoNode.querySelector(".u-clos");
    var startNode = videoNode.querySelector(".u-play span");
    var progrsBar = videoNode.querySelector(".progrsBar");
    //单击图片打开视频弹窗
    addEvent(openNode,"click",function(event){
        if(navigator.userAgent.indexOf("MSIE 8.0")>0){
            alert("您的浏览器版本太低，不支持video标签，请升级后再观看，谢谢~");
        }else{
            videoNode.style.display = "block";
            video.load();
            video.play();
            // 使用闭包函数，初始化视频的控件
            (function initVideoCtrl(){
                video.removeAttribute("controls");
                startNode.setAttribute("class","pause");

                // 控制开始或暂停播放
                var playNode = videoNode.querySelector(".u-play");
                addEvent(playNode,"click",function(event){
                      (video,startNode); 
                });  
                // 更新播放进度条 
                addEvent(video,"timeupdate",function(event){
                    var played = videoNode.querySelector(".played");
                    var loaded = videoNode.querySelector(".loaded");
                    var passedTime = videoNode.querySelector(".time .passed");
                    var totalTime = videoNode.querySelector(".time .total");  
                    updateProgrs(video,played,loaded,passedTime,totalTime);    
                });
                // 单击更新播放进度条 
                addEvent(progrsBar,"click",function(event){
                    var event = event || window.event;
                    var leftlength = (document.body.clientWidth-950)/2+30;
                    var lengthTime = (event.clientX - leftlength)/886*video.duration;
                    video.currentTime = lengthTime;
                })

            })();
        }        
    });
    //单击关闭图标，关闭视频弹窗
    addEvent(closeNode,"click",function(event){
        videoNode.style.display = "none";
        video.pause();
    });
}
/*
 *功能:播放或暂停视频，同时切换按钮状态
 *输入:要控制的视频节点，切换播放或暂停状态的按钮节点
 */
function switchPlayPause(video,startNode){   
    if (video.paused || video.ended) {
        startNode.setAttribute("class","pause");
        video.play();
    }
    else {
        startNode.setAttribute("class","start");
        video.pause();
    }
}
/*
 *功能:更新进度条和缓存条，显示视频已播放时间以及总时间
 *输入:要控制的视频节点、进度条节点、缓存条节点、已播放时间
 *     的显示节点、总时间的显示节点
 */
function updateProgrs(video,played,loaded,passedTime,totalTime){     
    function changeNumber(num){
        num = parseInt(num);
        if(num<10){
            return '0'+num;
        }else{
            return num;
        }
    }
    var passedMinutes = changeNumber(video.currentTime/60);    
    var passedMilliseconds = changeNumber(video.currentTime%60);    
    var totalMinutes = changeNumber(video.duration/60);
    var totalMilliseconds = changeNumber(video.duration%60);
    
    var passed = 0; // 存进度条百分比
    var downloaded = 0; // 存缓存条百分比
    if(video.currentTime>0){
        passed = Math.floor((video.currentTime/video.duration)*100);
    }
    if(video.buffered.end(0)>0){
        downloaded = Math.floor((video.buffered.end(0)/video.duration)*100);
    }
    played.style.width = passed + '%';
    loaded.style.width = downloaded + '%';
    passedTime.innerHTML = passedMinutes +':'+ passedMilliseconds + '&nbsp;';
    totalTime.innerHTML = '/&nbsp;' + totalMinutes + ':'+ totalMilliseconds;
}


addEvent(window,"load",function(event){
    responsive(); // 兼容IE8的响应式 
	closeTips();
	ifFocused();
    initFoucusEvent();
	initBanner();
	initMainCourses();
	initHotCourses();
    initVideo();
})















