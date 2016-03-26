/*
 *通用全局函数
 *
 */
/* 添加事件的兼容 */
function addEvent(node,event,handler){
            if (node.addEventListener){
                node.addEventListener(event,handler,false);
            }else{
                node.attachEvent('on'+event,handler);
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
			cookieText += "; path" + path;
		}
		if(domain){
			cookieText += "; domain" + domain;
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
	        callback(xhr.responseText);
	        }else {
	            alert("Request was unsuccessful:"+ xhr.status);
	        }
	    }
	};
	xhr.open("get",url,isAsync);
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
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] == "function") continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + "=" +value);
    }
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += pairs.join("&");
    return url;
}


// Cookie.unset("tips");
// Cookie.unset("loginSuc");
// Cookie.unset("yes");

/*
 *功能点一
 *关闭顶部通知条
 */
(function closeTips(){
	var ele =  document.getElementsByClassName("m-remder")[0];
	var close = ele.querySelector(".f-fr");
	if(Cookie.get("tips")!=="close"){
		ele.style.display="block";
		addEvent(close,'click',function(event){
				ele.style.display="none";
				Cookie.set("tips","close");	
		})
	} else{
		ele.style.display="none";	
	}
})();

/*
 *功能点二
 *关注登录
 */

/* 判断用户是否已关注 */
(function ifFocused(){
	if(Cookie.get("followSuc")=="yes"){		 
	focused();			
	} else if(Cookie.get("followSuc")){		 
	focused();
	}			
})()	

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

/* 初始化登录框 */
function initLogin (){
	var m_login = document.getElementsByClassName("m-login")[0];
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
		event.preventDefault();
		window.event.returnValue=false;
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
	         if(txt==="1"){
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
/* 元素隐藏函数 */
function hidden(ele){   
    ele.style.display = "none";
    ele.style.opacity = "0";
}
/* 淡入函数 */
function fadein(ele,milliseconds,hiddenEle){
    ele.style.display="block";
    ele.style["z-index"] = "2";
    var stepLength = 10/milliseconds;
    var step = function(){
        var nextOpacity = parseFloat(ele.style.opacity) + stepLength;
        if(nextOpacity<1){
            ele.style.opacity = nextOpacity;
        }else{
            ele.style.opacity = "1";
            hidden(hiddenEle);          
            clearInterval(intervalID);
        }
    }           
    var intervalID = setInterval(step,10);
}

/* 切换图片函数 */
function changeImages(milliseconds){
    var flag =1;
    var banners = document.querySelector(".m-banner");
    var banner1 = banners.querySelector(".img_1");
    var banner2 = banners.querySelector(".img_2");
    var banner3 = banners.querySelector(".img_3");
	//图片淡出切换    
    function slide(){
        var length = arguments.length;
        var preImg, curImg,nextImg;
        if(flag<=0){
            preImg = arguments[length-1];
            curImg = arguments[flag];
            nextImg = arguments[flag+1];
        }else if(flag>=length-1){
            preImg = arguments[flag-1];
            curImg = arguments[flag];
            nextImg = arguments[0];
        }else{
            preImg = arguments[flag-1];
            curImg = arguments[flag];
            nextImg = arguments[flag+1];
        }
        preImg.style["z-index"] = "1";//必须先将前一个元素降级，否则第一个元素的淡出会有问题
        fadein(curImg,500,preImg);      
        if(++flag>=length){flag = 0;}
    }
    var intervalID = setInterval(function(){
        slide(banner1,banner2,banner3);
    },milliseconds);

   banners.onmouseover = function() {
		clearInterval(intervalID);
	}
/*	banners.onmouseout = function() {
		var intervalID = setInterval(function(){
        	slide(banner1,banner2,banner3);
   		},milliseconds);
	}*/
}
/* 切换圆点函数 */
function changePoints(milliseconds){
	var flag = 1;
	var banners = document.querySelector(".m-banner");
	var points = document.querySelectorAll(".m-banner .pointer li");
	point1 = points[0];
	point2 = points[1];
	point3 = points[2];
	function slide(){
		var length = arguments.length;
        var prePoint, curPoint,nextPoint;
        if(flag<=0){
            prePoint = arguments[length-1];
            curPoint = arguments[flag];
            nextPoint = arguments[flag+1];
        }else if(flag>=length-1){
            prePoint = arguments[flag-1];
            curPoint = arguments[flag];
            nextPoint = arguments[0];
        }else{
            prePoint = arguments[flag-1];
            curPoint = arguments[flag];
            nextPoint = arguments[flag+1];
        }
    	curPoint.setAttribute("class","z-sel"); 	   	
		prePoint.setAttribute("class","");       
        if(++flag>=length){flag = 0;}
	}	  
    var intervalID = setInterval(function(){
        slide(point1,point2,point3);
    },milliseconds);
   banners.onmouseover = function() {
		clearInterval(intervalID);
	}
/* 	banners.onmouseout = function() {
		var intervalID = setInterval(function(){
       		slide(point1,point2,point3);
    	},milliseconds);
	}*/
}

/* 切换图片和圆点函数 */
function slideBanners(){
	changeImages(5000);
    changePoints(5000);    
}
slideBanners();

/*var id = setInterval(autoChangeImgs, 5000);
slide.onmouseover = function() {
	clearInterval(id);
}
slide.onmouseout = function() {
	id = setInterval(autoChangeImgs, 5000);
}*/