/****************************************************
 * 全局属性
 */
var IsMSIE = (window.ActiveXObject);

/****************************************************
 * 变量方法
 * CPCGetObjById根据ID取页面对象
 * isUndefined	判断变量是否定义
 */
function CPCGetObjById(id) 
{
	return document.getElementById(id);
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function GetShtIntFmt(shtFmt,fmtItem) {
    if (shtFmt.length < fmtItem) {
        return 0;
	} else {
    	return shtFmt[fmtItem];
	}
}

function GetShtBoolFmt(shtFmt, fmtItem) {
    if (GetShtIntFmt(shtFmt, fmtItem) == 0) {
    	return false;
	} else {
    	return true;
	}
}

function CPCLoginUser(str)
{
	this.sysuserid = 0;
	this.userid = null;
	this.username = null;
	this.entcode="";
	
	str = utf8to16(base64decode(str));
	
	var tmpArr = str.split(",");
	if (tmpArr[0]){
		this.sysuserid = tmpArr[0];
	}
	if (tmpArr.length>=2){
		this.userid = tmpArr[1];
	}
	if (tmpArr.length>=3){
		this.username = tmpArr[2];
	}
	
	if (tmpArr.length>=4){
		this.orgid = tmpArr[3];
	}
	if (tmpArr.length>=5){
		this.orgname = tmpArr[4];
	}
	if (tmpArr.length>=6){
		this.position = tmpArr[5];
	}
	
	if (tmpArr.length>=7){
		this.entcode = tmpArr[6];
	}
	//var idx = str.indexOf(',');
	//if(idx>0)
	//{
		//this.sysuserid = str.substring(0,idx)
		//str = str.substring(idx+1);
		//idx = str.indexOf(',');
		//if(idx>0)
		//{
		//	this.userid = str.substring(0,idx);
		//	this.username = str.substring(idx+1);
		//}
	//}
}
var g_loginuser = null;
function getLoginUser()
{
	if(!g_loginuser) g_loginuser = new CPCLoginUser(LoginUser);
	return g_loginuser;
}

/****************************************************
 * 格式化方法
 * formatDate
 * formatText
 * FormatFileSize
 * ToRound
 */
function FormatDate(d)
{
	var year,month,day;
	strFormat = "yyyy-mm-dd";
	year = d.getFullYear().toString();
	month = (d.getMonth()+1).toString();
	if(month.length < 2) month = "0" + month;
	day = d.getDate().toString();
	if(day.length < 2) day = "0" + day;
	strFormat=strFormat.replace("yyyy", year);
	strFormat=strFormat.replace("mm", month);
	strFormat=strFormat.replace("dd", day);
	return strFormat;
}
function FormatDateTime(d)
{
	var year,month,day,hour,minute,second;
	strFormat = "yyyy-mm-dd hh:mm:ss";
	year = d.getFullYear().toString();
	month = (d.getMonth()+1).toString();
	if(month.length < 2) month = "0" + month;
	day = d.getDate().toString();
	if(day.length < 2) day = "0" + day;
	hour = d.getHours().toString();
	if(hour.length<2) hour = "0"+hour;
	minute = d.getMinutes().toString();
	if(minute.length<2) minute = "0"+minute;
	second = d.getSeconds().toString();
	if(second.length<2) second = "0"+second;
	strFormat=strFormat.replace("yyyy", year);
	strFormat=strFormat.replace("mm", month);
	strFormat=strFormat.replace("dd", day);
	strFormat=strFormat.replace("hh", hour);
	strFormat=strFormat.replace("mm", minute);
	strFormat=strFormat.replace("ss", second);
	return strFormat;
}
function FormatText(str)
{
	if(null == str) return str;
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	str = str.replace(/\n/g,"<BR/>");
	return str;
}

function FormatFileSize(size)
{
	if(!size) return size;
	if(size<1024) return "1KB";
	if(size<1048576) return ToRound(size/1024,2)+"KB";
	return ToRound(size/1048576,2)+"MB";
}
function ToRound(value, digits)
{
	//if(arguments.length == 1) digits = 2;
	//if(isNaN(digits = parseInt(digits))) digits = 0;
	var factor = Math.pow(10, digits);
	var res = Math.round(factor*value).toString();
	return res.substr(0, res.length-digits) + '.' + res.substr(res.length-digits);
}   


function LinkToFunction(title, func)
{
	return LinkToFunction(title,func);
}

function LinkToFunction(title, func, params)
{
	if(isUndefined(params))
	{
		return "<A HREF=\"javascript:/\" onclick=\"" + func + "();return false;\">" + title + "</A>";
	}
	else
	{
		return "<A HREF=\"javascript:/\" onclick=\""
		+ func
		+ "("
		+ params
		+ ");return false;\">"
		+ title
		+ "</A>";
	}
}

function InsertImage(url)
{
	return "<img border='0' src='"+url+"' />";
}

/****************************************************
 * 数据字典功能
 * CPCDict			定义数据字典
 * CPCDictGetName	根据值取显示名称
 */
var cpcdicts = new Array();
var cpcdictsArray = [];//edit by llp
function CPCDict(dict,value,name)
{
	var s = [];
	s.push(value);
	s.push(name);
	if(!cpcdictsArray[dict])
		cpcdictsArray[dict] = [];
	cpcdictsArray[dict].push(s);
	
	cpcdicts[dict+'.@'+value] = name;
	if(null == cpcdicts[dict+'.@@']) cpcdicts[dict+'.@@'] = name; //设置默认
}

function CPCDictGetName(dict,value)
{
	var name = cpcdicts[dict+'.@'+value];
	if(null == name) name = cpcdicts[dict+'.@@']; //默认
	return name;
}


/****************************************************
 * 位置功能
 * GetAbsolutePos	取对象绝对位置
 * CPCPoint			点对象
 * CPCRect			区域对象
 * IsChildren		判断父子关系
 * GetPoint			取对象位置
 */

function GetAbsolutePos(el,ePro)
{
	var ePos=0;
	while(el!=null)
	{		
		ePos+=el["offset"+ePro];
		el=el.offsetParent;
	}
	return ePos;
}

function CPCPoint(x,y)
{
	this.x = x;
	this.y = y;
}

function CPCRect(left,top,right,bottom)
{
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
}
CPCRect.prototype.setDivRect = function(div)
{
	this.left = parseInt(div.style.left)+2;
	this.top = parseInt(div.style.top)+2;
	this.right = this.left + div.offsetWidth-2;
	this.bottom = this.top + div.offsetHeight-2;
};
CPCRect.prototype.isIn = function(x,y)
{
	window.status = "left="+this.left+"|x="+x+";top="+this.top+"|y="+y+"right="+this.right+"|x="+x+";bottom="+this.bottom+"|y="+y;
	if(x<0 || y<0) return true;
	if(x<=this.left || y<=this.top || x>=this.right || y>=this.bottom) return false;
	return true;
};

//计算位置
function GetPoint(obj)
{
	var point = $(obj);
	return new CPCPoint(point.offset().left, point.offset().top);
/*	var p = new CPCPoint(obj.offsetLeft, obj.offsetTop);
	while((obj = obj.offsetParent) != null)
	{
		p.x += obj.offsetLeft;
		p.y += obj.offsetTop;
	}
	return p;*/
}

function IsChildren(par,child)
{
	var obj = child;
	while((obj = obj.parentNode) != null) 
	{
		if(par == obj) return true;
	}
	return false;
}

/**
 * 获取特定字符串包裹的字符串
 * @param strTmp    源字符串
 * @param quotedStr 包裹字符串 默认"'"
 * @returns {string}
 */
function wrapQuotedStr(strTmp, quotedStr) {
    quotedStr = quotedStr || "'";
    strTmp = strTmp + '';
    if (!strTmp) return quotedStr + quotedStr;
    var resultStr = strTmp;
    if (strTmp.indexOf(quotedStr) != 0) {
        resultStr = quotedStr + resultStr;
    }
    if (strTmp.lastIndexOf(quotedStr) != strTmp.length - quotedStr.length) {
        resultStr = resultStr + quotedStr;
    }
    return resultStr;
}

function isContainRole(roleStr, roleStr2) {
    if (!roleStr2) return true;
    if (!roleStr) return false;
    var roles = roleStr.split(',');
    for (var i=0;i<roles.length;i++) {
        var role = roles[i].replace(/'/g, ',');
        if (wrapQuotedStr(roleStr2,',').indexOf(role) > -1) {
            return true;
        }
    } return false;
}

/**
 * 获取某个Cell所在的位置
 * @param id
 * @returns {{row: number, col: number}}
 */
function getCellOffset(id) {
    var offset = {row:-1,col:-1};
    var tmp = id.split('_');
    if (tmp.length == 3) {
        offset.row = parseInt(tmp[1]);
        offset.col = parseInt(tmp[2]);
    }
    return offset;
}

/****************************************************
 * 消息提示方法：
 * MessageBox		消息窗口
 */
function MessageBox(msg,title,type)
{
	if(!type) type = "ok";
	var str = null;
	if(title) str = title +"\r\n" +msg;
	else str = msg;
	alert(str);
}

/****************************************************
 * 视图控件方法：
 * CPCShowView		显示视图
 * CPCHideView		隐藏视图
 * CPCMinView		最小化视图
 * CPCRestoreView	恢复视图
 */
function CPCShowView(id, posObj, pos, posOffset)
{
	var obj = CPCGetObjById(id);
	if(!obj) return;
	if(posObj)
	{
		if(!pos) pos = "bottom";
		var p = GetPoint(posObj);
		if("bottom" == pos)
		{
			p.y += posObj.offsetHeight;
			if(posOffset) p.y += posOffset;
		}
		else if("right" == pos)
		{
			p.x += posObj.offsetWidth;
			if(posOffset) p.x += posOffset;
		}
		else if("left" == pos)
		{
			if(posOffset) p.x += posOffset;
		}
		else if("top" == pos)
		{
			if(posOffset) p.y += posOffset;
		}
		else if("bottomright" == pos)
		{
			//右下角
			p.x += posObj.offsetWidth;
			p.y += posObj.offsetHeight;
			if(posOffset) p.y += posOffset;
		}
		obj.style.left = p.x;
		obj.style.top = p.y;
		obj.style.display="";
	}
	else
	{
		obj.style.display="";
		if("center" == pos)
		{
			//居中
			obj.style.left = (document.body.clientWidth-(obj.offsetWidth))/2;
			obj.style.top = (document.body.scrollTop+document.body.clientHeight-(obj.offsetHeight))/2;
		}
	}
}

function CPCHideView(id)
{
	var obj = CPCGetObjById(id);
	if(obj) obj.style.display = "none";
}

function CPCMinView(id,text)
{
	var view = CPCGetObjById(id);
	var strTitleId = id+"_title";
	var title = CPCGetObjById(strTitleId);
	if(!title)
	{
		//创建标视图标题
		if(!text) text = view.id;
		title = document.createElement("div");
		title.id = strTitleId;
		title.className = "cpcview_title";
		title.style.width = view.offsetWidth-4;
		title.style.height = 22;
		var str ="<table class='layout100'><tr height=22><td>";
		str += text;
		str += "</td><td width='12'>";
		str += "<div class=\"button\" id=\"btn_"+id+"_restore\" onclick=\"CPCRestoreView('"+id+"','"+view.style.overflow+"')\" onMouseOver=\"CPCDivButtonContext(this, 'mouseover')\" onMouseOut=\"CPCDivButtonContext(this, 'mouseout')\">";
		str += "<img src=\"../images/btn_restore.gif\" align=\"absmiddle\" /></div>";
		str += "</td></tr></table>";
		title.innerHTML = str;
		view.appendChild(title);
	}
	view.style.overflow = "hidden";
	title.style.display="";
	view.style.height=25;
	view.scrollTop = view.scrollHeight;
}

function CPCRestoreView(id,overflow)
{
	var title = CPCGetObjById(id + "_title");
	title.style.display="none";
	var view = CPCGetObjById(id);
	view.scrollTop = 0; 
	if(overflow) view.style.overflow = overflow;
	view.style.height = "";
}

/****************************************************
 * 对话窗口控制方法：
 * CPCShowDialog		显示对话窗口
 * CPCClosePopView		关闭对话窗口
 * CPCDragDialogStart	开始拖动对话窗口
 * CPCDragDialog		拖动对话窗口
 * CPCDragDialogStop	结束对话窗口拖动
 */
var topDialog = null;
function CPCShowDialog(title, url, nWidth, nHeight)
{
	var strViewId = "div_cpcpopview";
	var div = CPCGetObjById(strViewId);
	if(!div)
	{
		if(isUndefined(nWidth)) nWidth = 650;
		if(isUndefined(nHeight)) nHeight = 500;
		div = document.createElement("div");
		div.id = strViewId;
		div.className = "cpcdialog";
		div.style.width = nWidth;
		div.style.height = nHeight;

		//居中
		div.style.left = (document.body.clientWidth-nWidth)/2;
		div.style.top = (document.body.scrollTop+document.body.clientHeight-nHeight)/2;

		var str = "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
		str += "<tr height=\"22\" class=\"cpcdialog_header\">";
		str += "<td width=\"480\"><div id=\""+strViewId+"_title\" onMousedown=\"CPCDragDialogStart(this,event)\" onMouseup=\"CPCDragDialogStop(this,event)\" onmousemove=\"CPCDragDialog(this,event)\" ></div></td>";
		str += "<td width=\"20\" align=\"center\"><div class=\"button\" id=\"btn_"+strViewId+"_close\" onclick=\"CPCCloseDialog('"+strViewId+"')\" onMouseOver=\"CPCDivButtonContext(this, 'mouseover')\" onMouseOut=\"CPCDivButtonContext(this, 'mouseout')\"><img src=\"/web/images/btn_close.gif\" align=\"absmiddle\" /></div>";
		str += "</td></tr><tr>";
		str += "<td colspan=2><iframe src=\"\" id=\""+strViewId+"_iframe\" width=\""+nWidth+"\" height=\""+(nHeight-22)+"\" scrolling=\"no\" frameborder=\"0\"></iframe></td>";
		str += "</tr></table>";
		div.innerHTML = str;
		document.body.appendChild(div);
	}
	div.style.display = "";
	div = CPCGetObjById(strViewId+"_title");
	div.innerHTML = title;
	var iframe = CPCGetObjById(strViewId+"_iframe");
	if(url != iframe.src) iframe.src = url;
	topDialog = CPCGetObjById(strViewId);
}

function CPCCloseDialog(id)
{
	if(!id)
	{
		if(topDialog) topDialog.style.display = "none";
	}
	else
	{
		var div = CPCGetObjById(id);
		div.style.display = "none";
	}
}

var CPCOnDragDialog = null; 
var CPCDragDialogOffset = new CPCPoint(0,0);
function CPCDragDialogStart(obj,event)
{
	var view = (event.srcElement ? event.srcElement : event.target);
	if(view.id.indexOf("_title"))
	{
		while((view = view.parentNode) != null) 
		{
			if(view.tagName.toUpperCase()=="DIV") break;
		}
	}
	if(event.button<=1 && view.tagName.toUpperCase()=="DIV")
	{
		if(IsMSIE) obj.setCapture();
		CPCDragDialogOffset.x = parseInt(view.style.left) - event.clientX;
		CPCDragDialogOffset.y = parseInt(view.style.top) - event.clientY;
		CPCOnDragDialog=view;
	} 
}

function CPCDragDialog(obj,event)
{
	if(CPCOnDragDialog)
	{
		CPCOnDragDialog.style.left = (event.clientX + CPCDragDialogOffset.x);
		CPCOnDragDialog.style.top = (event.clientY + CPCDragDialogOffset.y);
	}
}

function CPCDragDialogStop(obj,event)
{
	CPCOnDragDialog = null;
	if(IsMSIE) obj.releaseCapture();
} 


/****************************************************
 * 快捷视图控制方法
 * CPCShowAutoView		显示快捷视图
 * CPCHideAutoView		隐藏快捷视图
 * CPCHideAutoViewNow	立刻隐藏快捷视图
 */
var FastViewTimer = null;
var FastViewRect = new CPCRect(0,0,0,0);
var FastViewId = null;
function CPCShowFastView(viewId,ctrlId,autoHide,pos)
{
	FastViewId = viewId;
	var ctrlobj = CPCGetObjById(ctrlId);
	if(!ctrlobj) return;
	if(FastViewTimer) clearTimeout(FastViewTimer);

	CPCShowView(FastViewId, ctrlobj, pos);
	var view = CPCGetObjById(FastViewId);
	FastViewRect.setDivRect(view);
	if(!view.onmouseover)
		view.onmouseover = function(){clearTimeout(FastViewTimer);};
	if(!view.onmouseout)
	{
		if(IsMSIE)
			view.onmouseout = function(){CPCHideFastViewNow(event);};
		else
			view.onmouseout = function(event){CPCHideFastViewNow(event);};
	}
	if(autoHide) FastViewTimer = CPCHideFastView();
}

function CPCHideFastView(event)
{
	FastViewTimer = setTimeout('CPCHideFastViewNow()', 500);
}

function CPCHideFastViewNow(event)
{
	if(!isUndefined(event))
	{
		var x,y;
		if(IsMSIE)
		{
			if(x<0 || y<0) return;
			x = event.x + document.body.scrollLeft;
			y = event.y + document.body.scrollTop;
		}
		else
		{
			x = event.pageX + document.body.scrollLeft;
			y = event.pageY + document.body.scrollTop;
		}
		if(FastViewRect.isIn(x,y)) return;

		if(!IsMSIE && IsChildren(CPCGetObjById(FastViewId), event.target)) return;
	}
	if(FastViewTimer) clearTimeout(FastViewTimer);
	CPCHideView(FastViewId);
}


/****************************************************
 * 页视图控制方法
 * CPCShowTabView		显示指定页视图
 * CPCGetTabViewSelectedId 取选中页视图ID
 * CPCGetTabViewSelectedIdx 取选中页序号
 */
function CPCShowTabView(ctrlId,viewId,idx)
{
	var views = CPCGetObjById(ctrlId).childNodes;
	if(!views || views.lenght<1) return;
	
	var header = CPCGetObjById(ctrlId+"_header_table");
	var cells = header.rows[0].cells;
	for(var i=0;i<cells.length;i++)
	{
		var strClass = cells[i].className;
		if(strClass && strClass.length>0)
			cells[i].className = strClass.replace(/ selected/g,"");
	}

	idx = 0;
	for(var i=0;i<views.length;i++)
	{
		var view = views[i];
		if(!view.id || view.id == (ctrlId + '_header')) continue;
		if(view.id != viewId)
			CPCHideView(view.id);
		else
		{
			cells[idx].className += " selected";
			CPCShowView(view.id);
		}
		idx++;
	}
}

function CPCGetTabViewSelectedId(ctrlId)
{
	var views = CPCGetObjById(ctrlId).childNodes;
	if(!views || views.lenght<1) return null;

	for(var i=0;i<views.length;i++)
	{
		var view = views[i];
		if(view.id == (ctrlId + '_header')) continue;
		if(view.style && view.style.display != "none") return view.id;
	}
	return null;;
}

function CPCGetTabViewSelectedIdx(ctrlId)
{
	var views = CPCGetObjById(ctrlId).childNodes;
	if(!views || views.lenght<1) return 0;

	var header = CPCGetObjById(ctrlId+"_header_table");
	var cells = header.rows[0].cells;
	for(var i=0;i<cells.length;i++)
	{
		var strClass = cells[i].className;
		if(strClass && strClass.length>0 && strClass.indexOf("selected")>0)
			return (i+1);
	}
	return 0;
}

/****************************************************
 * cookie功能
 * CPCGetCookie		读取cookie
 */
function CPCGetCookie(name)
{
	str = document.cookie;
	value = "";
	name += "="
	i = str.indexOf(name);
	if(i>=0)
	{
		j = str.indexOf(";",i);
		if(j<0) j = str.length;
		if(j>i+name.length) value=str.substring(i+name.length,j);
	}
	return value;
}


/****************************************************
 * BASE64 编码功能
 * base64encode		编码
 * base64decode		解码
 */

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

/****************************************************
 * 调用参数集对象
 * has	判断是否有参数
 * get	取参数值
 * set	设置参数
 */

function CPCArgs()
{
	this.args = new Array();
}

CPCArgs.prototype.has = function(name)
{
	return (null != this.args[name]);
};

CPCArgs.prototype.get = function(name)
{
	return this.args[name];
};

CPCArgs.prototype.set = function(name, value)
{
	this.args[name] = value;
};

CPCArgs.prototype.hasDialog = function()
{
	return (null != this.args["dialog"]);
};

CPCArgs.prototype.getDialog = function()
{
	return this.args["dialog"];
};

CPCArgs.prototype.setDialog = function(dlg)
{
	this.args["dialog"] = dlg;
};

CPCArgs.prototype.hasCallback = function()
{
	return (null != this.args["callback"]);
};

CPCArgs.prototype.getCallback = function()
{
	return this.args["callback"];
};

CPCArgs.prototype.setCallback = function(func)
{
	this.args["callback"] = func;
};