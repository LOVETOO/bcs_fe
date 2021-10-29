function IsMaxthon() { try{ window.external.max_invoke("GetHotKey"); return true; }catch(e){return false;}}

(function (window) {

    function _registerEvent(target, eventType, cb) {
        if (target.addEventListener) {
            target.addEventListener(eventType, cb);
            return {
                remove: function () {
                    target.removeEventListener(eventType, cb);
                }
            };
        } else {
            target.attachEvent(eventType, cb);
            return {
                remove: function () {
                    target.detachEvent(eventType, cb);
                }
            };
        }
    }

    function _createHiddenIframe(target, uri) {
        var iframe = document.createElement("iframe");
        iframe.src = uri;
        iframe.id = "hiddenIframe";
        iframe.style.display = "none";
        target.appendChild(iframe);
        return iframe;
    }

    function openUriWithHiddenFrame(uri, failCb) {
 
        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = _createHiddenIframe(document.body, "about:blank");
        }
 				
				iframe.onload = function(){ 
					failCb(); 
				}
        iframe.src = uri;
        
    }

    function openUriWithTimeoutHack(uri, failCb) {

        var timeout = setTimeout(function () {
            failCb();
            handler.remove();
        }, 3000);

        var handler = _registerEvent(window, "blur", onBlur);

        function onBlur() { 
            clearTimeout(timeout);
            handler.remove();
        }

        window.location = uri;
    }

    function openUriUsingFirefox(uri, failCb) {
        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = _createHiddenIframe(document.body, "about:blank");
        }
        try {
            iframe.contentWindow.location.href = uri;
        } catch (e) {
            if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                failCb();
            }
        }
    }

    function openUriUsingIE(uri, failCb) {
        //check if OS is Win 8 or 8.1
        var ua = navigator.userAgent.toLowerCase();
        var isWin8 = /windows nt 6.2/.test(ua) || /windows nt 6.3/.test(ua);

        if (isWin8 ||  navigator.msLaunchUri ) {
            openUriUsingIEInWindows8(uri, failCb);
        } else {
            if (getInternetExplorerVersion() === 10) {
                openUriUsingIE10InWindows7(uri, failCb);
            } else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
                openUriWithHiddenFrame(uri, failCb);
            } else {
                openUriInNewWindowHack(uri, failCb);
            }
        }
    }

    function openUriUsingIE10InWindows7(uri, failCb) {
        var timeout = setTimeout(failCb, 3000);
        window.addEventListener("blur", function () {
            clearTimeout(timeout);
        });

        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = _createHiddenIframe(document.body, "about:blank");
        }
        try {
            iframe.contentWindow.location.href = uri;
        } catch (e) {
            failCb();
            clearTimeout(timeout);
        }
    }

    function openUriInNewWindowHack(uri, failCb) {
        var myWindow = window.open('', '', 'width=0,height=0');

				try{
       			 myWindow.document.write("<iframe src='" + uri + "'></iframe>");
        		var t = setTimeout(function () {
         		   try {
         		   	    clearTimeout(t);
          		      myWindow.location.href; 
          		      myWindow.setTimeout("window.close()", 100);
          		      
          		  } catch (e) {
           			     myWindow.close();
           			     failCb();
          		  }
       			 }, 100);
      		}catch (e) {
                myWindow.close();
                failCb();
           }
    }
    

    function openUriUsingIEInWindows8(uri, failCb) {
        if (navigator.msLaunchUri) {
            navigator.msLaunchUri(uri,
                function () {
                    window.location = uri;
                },
                failCb
            );
        }
    }

    function checkBrowser() {
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        return {
            isOpera: isOpera,
            isFirefox: typeof InstallTrigger !== 'undefined',
            isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
            isChrome: !!window.chrome && !isOpera,
            isIE: (/*@cc_on!@*/false || !!document.documentMode) && (!IsMaxthon())   // At least IE6
        }
    }

    function getInternetExplorerVersion() {
        var rv = -1;
        if (navigator.appName === "Microsoft Internet Explorer") {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        else if (navigator.appName === "Netscape") {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }

    window.protocolCheck = function (uri, failCb,ok_callback,prompt_callback) {
        var browser = checkBrowser();

        function failCallback() {
            failCb && failCb();
        }

        if (browser.isFirefox) {
            openUriUsingFirefox(uri, failCallback);
        } else if (browser.isChrome) {
            openUriWithTimeoutHack(uri, failCallback);
        } else if (browser.isIE) {
            openUriUsingIE(uri, failCallback);
        } else {
            chkHitalk(ok_callback,prompt_callback);
        }
    }
}(window));
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,-1, 0, 1, 2, 3,  4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while(i < len) {
 c1 = str.charCodeAt(i++) & 0xff;
 if(i == len)
 {
   out += base64EncodeChars.charAt(c1 >> 2);
   out += base64EncodeChars.charAt((c1 & 0x3) << 4);
   out += "==";
   break;
 }
 c2 = str.charCodeAt(i++);
 if(i == len)
 {
   out += base64EncodeChars.charAt(c1 >> 2);
   out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
   out += base64EncodeChars.charAt((c2 & 0xF) << 2);
   out += "=";
   break;
 }
 c3 = str.charCodeAt(i++);
 out += base64EncodeChars.charAt(c1 >> 2);
 out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
 out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
 out += base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}
function base64decode(str) {
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while(i < len) {
 /* c1 */
 do {
   c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
 } while(i < len && c1 == -1);
 if(c1 == -1)
   break;
 /* c2 */
 do {
   c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
 } while(i < len && c2 == -1);
 if(c2 == -1)
   break;
 out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
 /* c3 */
 do {
   c3 = str.charCodeAt(i++) & 0xff;
   if(c3 == 61)
 return out;
   c3 = base64DecodeChars[c3];
 } while(i < len && c3 == -1);
 if(c3 == -1)
   break;
 out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
 /* c4 */
 do {
   c4 = str.charCodeAt(i++) & 0xff;
   if(c4 == 61)
 return out;
   c4 = base64DecodeChars[c4];
 } while(i < len && c4 == -1);
 if(c4 == -1)
   break;
 out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}
function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for(i = 0; i < len; i++) {
 c = str.charCodeAt(i);
 if ((c >= 0x0001) && (c <= 0x007F)) {
   out += str.charAt(i);
 } else if (c > 0x07FF) {
   out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
   out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
 } else {
   out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
 }
  }
  return out;
}
function utf8to16(str) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while(i < len) {
 c = str.charCodeAt(i++);
 switch(c >> 4)
 {
  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
   // 0xxxxxxx
   out += str.charAt(i-1);
   break;
  case 12: case 13:
   // 110x xxxx  10xx xxxx
   char2 = str.charCodeAt(i++);
   out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
   break;
  case 14:
   // 1110 xxxx 10xx xxxx 10xx xxxx
   char2 = str.charCodeAt(i++);
   char3 = str.charCodeAt(i++);
   out += String.fromCharCode(((c & 0x0F) << 12) |
    ((char2 & 0x3F) << 6) |
    ((char3 & 0x3F) << 0));
   break;
 }
  }
  return out;
}

/*
function doit() {
  var f = document.f
  f.output.value = base64encode(utf16to8(f.source.value))
  f.decode.value = utf8to16(base64decode(f.output.value))
}
*/

var UpgradeParams = (getCookie("UpgradeParams", true));
var RunParams = (getCookie("RunParams", true));
var nLoginCount = 1;
var bUpdateError = false;

function checkNavigator()
{
	//检查浏览器版本
	var ver = window.navigator.appVersion;
	var name = window.navigator.appName;
	var mainVer = "0";
	var minVer = 1;
	if(ver.length > 0){
		var i=0;
		if(name=="Netscape"){
			minVer = 4;
		}
		else{
			minVer = "5.0";
			i = ver.indexOf("MSIE ");
			if(i>0)
				i += 5;
		}

		//取出主版本号
		mainVer = "";
		for(; i<ver.length; i++){
			var c = ver.charAt(i);
			if((c>='0' && c<='9') || c == '.')
				mainVer += c;
			else if(mainVer.length>0)
				break;				
		}
	}
	if(Number(mainVer).valueOf()<minVer){
		if(minVer>1)
			alert("你的浏览器版本太低,请更新到 "+name+" "+minVer+".");
		else
			alert("你的浏览器版本太低,请更新.");
	}


}

function getCookie(name,isdel)
{
	str = document.cookie;
	value = "";
	name += "="
	i = str.indexOf(name);
	if(i>=0){
		j = str.indexOf(";",i);
		if(j<0)
			j = str.length;
		if(j>i+name.length)
			value=str.substring(i+name.length,j);
	}
	if(isdel==true)
		document.cookie = name;
	return value;
}

//解码
function DecodeCookie(str)
{
	var strArr;
	var strRtn="";
	if(str==null || str=="")
		return "";
	strArr=str.split("a");
	for (var i=strArr.length-1;i>=0;i--){
		strRtn += String.fromCharCode(eval(strArr[i]));
	}
	return strRtn;
}

function loadEvent()
{
	try
	{
		if(document.forms.length)
		{
			isOk = false;
			try
			{
				isOK = (document.all.SinoCCTools.Caption!=null);
			}
			catch(e)
			{
				isOK = false;
				//alert(e);
			}
			if(isOK)
			{
				//找到第一个form的第一个控件，设置焦点
				if(document.forms(0).elements.length>0)
					document.forms(0).elements(0).focus();
			}
			else
			{
				//禁用登录按钮
				document.forms(0).elements("CPCBtnLogin").disabled = true;
			}
		}
	}
	catch(e)
	{
	}
	try
	{
		document.all["CPCUserName"].value=unescape(getCookie("lastloginuser",false));
	}
	catch(e){}
}

function urlOpen(url)
{
	isOk = false;
	try
	{
		isOK = (document.all.SinoCCTools.Caption!=null);
	}
	catch(e)
	{
		isOK = false;
		//alert(e);
	}
	if(isOK)
	{
		try
		{
			document.all.SinoCCTools.UrlOpen(url);
			return true;
		}
		catch(e)
		{
			alert(e);
		}
	}
	return false;
}


/* 检查是更新 */
function checkClient()
{
	try
	{
		if(document.all.SinoCCTools.Caption == null)
			return "NoShell";
	}
	catch(e){
		return "NoShell";
	}
	try
	{
		return document.all.SinoCCTools.CheckUpgrade(UpgradeParams);
	}
	catch(e){
		alert("CheckUpgrade error: " + e);
		return "Call error: ";
	}
}

/* 运行客户端 */
function runClient(strParams2)
{
	try
	{
		if(document.all.SinoCCTools.Caption ==null)
			return "NoShell";
	}
	catch(e){
		return "NoShell";
	}

	try
	{
		//alert("RunHczyInstance" + RunParams + ";" + strParams2);
		return document.all.SinoCCTools.RunSinoCCInstance(RunParams, strParams2);
	}
	catch(e)
	{
		alert(e.message);
		return "Call error: ";
	}
}
 
defLoginForm = null;
var strOldInput;
var nCheckEnableLogin;

function login(loginForm)
{
	defLoginForm = loginForm;
	bSetBtn = false;
	try
	{
		loginForm.elements("CPCBtnLogin").disabled = true;
		bSetBtn = true;
	}
	catch(e)
	{
	}
	u = loginForm.CPCUserName.value;
	u = trim(u);
	if(u==null || u.length<1)
	{
		alert("请输入用户名！");
		if(bSetBtn)
			loginForm.elements("CPCBtnLogin").disabled = false;
		loginForm.elements("CPCUserName").focus();
		return false;
	}

	//编码用户名与密码
	var strParams = "userid=" + loginForm.CPCUserName.value
		+ "&userpass=" + loginForm.CPCPassword.value.replace(/\&/g,"\r");
	strParams = base64encode(utf16to8(strParams));
	runClient(strParams);
	
	try
	{
		document.cookie = "lastloginuser="+escape(loginForm.CPCUserName.value) + ";expires=Fri,31-Dec-2020 00:00:00 GMT";
	}
	catch(e){alert(e);}

	try
	{
		if(nLoginCount > 2)
		{
			loginForm.elements("CPCBtnLogin").disabled = true;
			//window.close();
			return false;
		}
		else
		{
			nLoginCount ++;
		}
	}
	catch(e)
	{
	}

	if(bSetBtn)
	{
		nCheckEnableLogin = 0;
		strOldInput = defLoginForm.CPCUserName.value+defLoginForm.CPCPassword.value;
		str = "enableLogin();"
		window.setTimeout(str, 1000);
	}

	return false;
}
/**
*新登录方法，不用插件
**/
function newlogin(loginForm, appid, entcode)
{
	defLoginForm = loginForm;
	bSetBtn = false;
	try
	{
		loginForm.elements("CPCBtnLogin").disabled = true;
		bSetBtn = true;
	}
	catch(e)
	{
	}
	u = loginForm.CPCUserName.value;
	u = trim(u);
	if(u==null || u.length<1)
	{
		alert("请输入用户名！");
		if(bSetBtn)
			loginForm.elements("CPCBtnLogin").disabled = false;
		loginForm.elements("CPCUserName").focus();
		return false;
	}

	//编码用户名与密码
	var strParams = "userid=" + loginForm.CPCUserName.value
		+ "&userpass=" + loginForm.CPCPassword.value;
	strParams = base64encode(utf16to8(strParams));
	//runClient(strParams);
	
	try
	{
		document.cookie = "lastloginuser="+escape(loginForm.CPCUserName.value) + ";expires=Fri,31-Dec-2020 00:00:00 GMT";
	}
	catch(e){alert(e);}

	try
	{
		if(nLoginCount > 2)
		{
			loginForm.elements("CPCBtnLogin").disabled = true;
			//window.close();
			return false;
		}
		else
		{
			nLoginCount ++;
		}
	}
	catch(e)
	{
	}

	if(bSetBtn)
	{
		nCheckEnableLogin = 0;
		strOldInput = defLoginForm.CPCUserName.value+defLoginForm.CPCPassword.value;
		str = "enableLogin();"
		window.setTimeout(str, 1000);
	}

	//组织数据并登录畅信
	//获取数据
	var uname = $("#CPCUserName").val();
	var upassword = $("#CPCPassword").val();
	  
  var cid = new Fingerprint({canvas: true,screen_resolution: true, ie_activex: true}).get();
	window.protocolCheck("hitalk://login/?"+base64encode(utf16to8(base64encode(utf16to8("initparam=appid="+appid+"|userid="+uname+"|password="+upassword.replace(/\&/g,"\r") + "|entcode=" + entcode+"|installed=true|cid="+cid)))),function(){
	  jConfirm('如果您还未安装，请<a id="set_up_hitalk" href="http://www.hitalk.me/touch/appstore/pc/"+setupfilename>点这里下载安装</a>成功后，点击"登录"按钮；<br/>如果您已经安装，请直接点击"登录"按钮。', '温馨提示：未检测到畅信(ID:'+cid+')',
      		    function(result){
      		      if (result){
      		          window.location.href = "hitalk://login/?"+base64encode(utf16to8(base64encode(utf16to8("initparam=appid="+appid+"|userid="+uname+"|password="+upassword.replace(/\&/g,"\r") + "|entcode=" + entcode+"|installed=false|cid="+cid))));        	  	 
      		      }	
      		    }
           );
        	
        	getHitalkSetup(function(result){
	         $("#set_up_hitalk").attr("href","http://www.hitalk.me/touch/appstore/pc/"+result);
	     	   });
         
        },function(cid){ 
		        window.location.href = "hitalk://login/?"+base64encode(utf16to8(base64encode(utf16to8("initparam=appid="+appid+"|userid="+uname+"|password="+upassword.replace(/\&/g,"\r") + "|entcode=" + entcode+"|installed=true|cid="+cid))));
	        },
	        function(cid){       	    
          	 	   window.location.href = "hitalk://login/?"+base64encode(utf16to8(base64encode(utf16to8("initparam=appid="+appid+"|userid="+uname+"|password="+upassword.replace(/\&/g,"\r") + "|entcode=" + entcode+"|installed=false|cid="+cid))));        	  	 
        	});


        
	
	return false;
}



function enableLogin()
{
	strNew = defLoginForm.elements("CPCUserName").value + defLoginForm.elements("CPCPassword").value;
	if(strOldInput != strNew || nCheckEnableLogin>20)
	{
		defLoginForm.elements("CPCBtnLogin").disabled = false;
		defLoginForm.elements("CPCPassword").focus();
	}
	else
	{
		nCheckEnableLogin ++;
		str = "enableLogin();"
		window.setTimeout(str, 1000);
	}
}

function autoLogin(loginForm)
{
	var strRet = ""
	try
	{
		//找到第一个form的第一个控件
		if(document.forms.length)
			document.forms(0).elements("CPCBtnLogin").disabled = true;

		strRet = runClient("");
	}
	catch(e)
	{
		alert(e.message);
	}


	if(window.opener!=null)
	{
		if("NoShell" == strRet)
			window.close();
		else
			window.setTimeout("window.close()", 2000);
	}
	else
	{
		if("NoShell" == strRet)
			window.history.back();
		else
			window.setTimeout("window.history.back()", 2000);
	}

}

function update(url)
{
	str = "请下载SinoCCTool_Ins.exe文件，安装下载工具：\r\n在下载窗口直接“打开”安装\r\n或保存到“c:\\”再双击安装；\r\n\r\n网址：" + url;
	if(confirm(str))
		window.location = "/activex/sinocctool_ins.exe";
}

function addBookmark(title,url) 
{
	if (window.sidebar) 
	{ 
		window.sidebar.addPanel(title, url,""); 
	}
	else if( document.all )
	{
		window.external.AddFavorite( url, title);
	}
	else if( window.opera && window.print ) 
	{
		return true;
	}
}

function addHome(url)
{
	document.body.style.behavior='url(#default#homepage)';
	document.body.setHomePage(url);
}
/* Enter登录
 * @7v
 */
//document.onkeydown = function(event){
	//var e = event || window.event || arguments.callee.caller.arguments[0];
	//if(e && e.keyCode==13){
	//	document.getElementById("login_in").click();
		
	//}
	
//}
function trim(str){ //删除左右两端的空格
　　    return str.replace(/(^\s*)|(\s*$)/g, "");
}
