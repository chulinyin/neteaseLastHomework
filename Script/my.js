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
 *关闭顶部通知条
 */

