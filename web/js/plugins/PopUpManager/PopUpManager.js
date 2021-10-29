
if(typeof EventFactory == "undefinded"){
	alert('aa');
}
var getClient = function(e)
{
	if (e) {
		w = e.clientWidth;
		h = e.clientHeight;
	} else {
		w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
		h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
	}
	return {w:w,h:h};
};

function removeElementById(id){
	var el = document.getElementById(id);
	if(el && el.parentNode) el.parentNode.removeChild(el);
}

var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie 6.0") != -1;
var isMacXFF = navigator.userAgent.toLowerCase().indexOf('mac')!= -1 && navigator.userAgent.toLowerCase().indexOf('firefox')!=-1;


var Alert = {
	"instance" : null,
	"show" : function(el,modal,dragTitle){
		var len = arguments.length;
		if(len==0 || !el){
			alert('温馨提示：待弹出对象不存在!\n请确认您要弹出的对象在dom中');	
			return;
		}
		if(!this.instance)
		{
			this.instance = new PopUpManager();
		}
		if(typeof el =="string")
		{
			el = document.getElementById(el);	
		}
		if(typeof dragTitle == "string")
		{
			dragTitle = document.getElementById(dragTitle);	
		}
		el.style.display='block';
		this.instance.addPopUp(el,modal,dragTitle);
	},
	"close": function(el){
		if(this.instance){
			try{
				if(el){
					el.style.display="none";
				}else{
					this.instance.removePopUp();
				}
			}catch(e){
				this.instance.currentWin.style.display="none";
			}
		}
	},
	"showIframe": function(url,width,height,modal){
		if(!this.instance)
		{
			this.instance = new PopUpManager();
		}
		this.instance.showIframe(url,width,height,modal);
	},
	"closeIframe": function(){
		if(this.instance){
			this.instance.removeIframe();
		}
	}
}
var Drag={
	"maxDepth":10,
	"currentWin":null,
	"swapList":[],
    "obj":null,
	"init":function(handle, dragBody,swapEnable){
		//自动交换深度
		if(swapEnable != false){
			this.autoSwap(dragBody);
		}
		handle.onmousedown=Drag.start;
		handle.root = dragBody;
		handle.root.onDragStart=new Function();
		handle.root.onDragEnd=new Function();
		handle.root.onDrag=new Function();
	},
	"start":function(e){
		var handle=Drag.obj=this;
		Drag.fixPos(handle.root);
		e=Drag.fixEvent(e);
		var top=parseInt(handle.root.style.top);
		var left=parseInt(handle.root.style.left);
		handle.root.onDragStart(left,top,e.pageX,e.pageY);
		handle.lastMouseX=e.pageX;
		handle.lastMouseY=e.pageY;
		document.onmousemove=Drag.drag;
		document.onmouseup=Drag.end;
		return false;
	},	
	"drag":function(e){
		e=Drag.fixEvent(e);
		var handle=Drag.obj;
		var mouseY=e.pageY;
		var mouseX=e.pageX;
		var top=parseInt(handle.root.style.top);
		var left=parseInt(handle.root.style.left);
		var currentLeft,currentTop;
		currentLeft=left+mouseX-handle.lastMouseX;
		currentTop=top+(mouseY-handle.lastMouseY);
		handle.root.style.left=currentLeft +"px";
		handle.root.style.top=currentTop+"px";
		handle.lastMouseX=mouseX;
		handle.lastMouseY=mouseY;
		handle.root.onDrag(currentLeft,currentTop,e.pageX,e.pageY);//调用外面对应的函数
		return false;
	},
	"end":function(){
		document.onmousemove=null;
		document.onmouseup=null;
		Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style.left),parseInt(Drag.obj.root.style.top));
		Drag.obj=null;
	},
	"fixEvent":function(e){
		if(typeof e=="undefined")e=window.event;
		if(typeof e.layerX=="undefined")e.layerX=e.offsetX;
		if(typeof e.layerY=="undefined")e.layerY=e.offsetY;
		if(typeof e.pageX == "undefined")e.pageX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
		if(typeof e.pageY == "undefined")e.pageY = e.clientY + document.body.scrollTop - document.body.clientTop;
		return e;
	},
	"fixPos":function(e){
		var top,left;
		if(isIE){
			top = e.currentStyle.top;
			left = e.currentStyle.left;
		}else{//此处有小BUG 未计算伪类
			top = window.getComputedStyle(e,null).top;
			left = window.getComputedStyle(e,null).left;
		}
		if(left.indexOf("%") != -1) left = getClient().w * parseInt(left) / 100 ;
		if(top.indexOf("%") != -1) top = getClient().h * parseInt(top) / 100 ;
		top = parseInt(top) || 0;
		left = parseInt(left) || 0;
		e.style.left=left+"px";
		e.style.top=top+"px";
	},
	"autoSwap":function(dragBody){
		
		var zIndex;
		if(isIE){
			zIndex = dragBody.currentStyle.zIndex;
		}else{
			zIndex = window.getComputedStyle(dragBody,null).zIndex;
		}
		if(zIndex>this.maxDepth){
			this.maxDepth = zIndex;
		}
		if(this.swapList.indexOf(dragBody) == -1){
			this.swapList.push(dragBody);
			Drag.addEventListener(dragBody,"mousedown",
				 function(){
					 if(dragBody!=Drag.currentWin && Drag.currentWin){
						 Drag.currentWin.style.zIndex = Drag.maxDepth-1;
						 dragBody.style.zIndex=Drag.maxDepth;
						 Drag.currentWin = dragBody;
					 }else{
						 Drag.currentWin = dragBody;
					 }
				});
		}
	}
};

Drag.addEventListener = function(target, eventName, handler, argsObject)
{
	var eventHandler = handler;
    if(argsObject)
    {
        eventHander = function(e)
        {
            handler.call(argsObject, e);
        }
    }
    if(window.attachEvent)
	{
		target.attachEvent("on" + eventName, eventHandler );
	}else{
		 target.addEventListener(eventName, eventHandler, false);
	}    
}

var PopUpManager = function (){
	this.overlayId = "TB_overlay";
	this.containerId = "TB_window";	
	this.iframeId = "TB_iframe";
	this.IE6OriginalStyle =null;
	if(isMacXFF){ 
		this.overlayClass = "TB_overlayMacFFBGHack";
	}else{ 
		this.overlayClass = "TB_overlayBG";
	}
};

PopUpManager.prototype.addPopUp = function(el,modal,dragTitle)
{
	var instance = this;
	if(!modal){
		this.overlayDiv = this.addLayover();	//添加遮罩层
		this.overlayDiv.onclick = function(){instance.removePopUp();}
		this.addContent(el);
		if(dragTitle)
		{
			var container = document.getElementById(this.containerId);
			Drag.init(dragTitle,container,false);
		}
	}else{
		if(this.currentWin && this.currentWin != el){
			this.currentWin.style.zIndex = Drag.maxDepth-1;
			el.style.zIndex=Drag.maxDepth;
		}
		this.currentWin = el;
		this.centerPopUp(el);
		if(dragTitle)
		{
			Drag.init(dragTitle,el);//可拖拽
		}
	}
	
}

PopUpManager.prototype.showIframe = function(url,width,height,modal)
{	
	width = width || 600;
	height = height || 400;
	var instance = this;
	this.overlayDiv = this.addLayover();	//添加遮罩层
	if(!modal){
		this.overlayDiv.onclick = function(){instance.removeIframe();}
	}
	this.iframe = this.addIframe();
	this.iframe.src = url;
	this.iframe.style.width = width+"px";
	this.iframe.style.height = height+"px";
	this.centerPopUp(this.iframe);
}

PopUpManager.prototype.centerPopUp = function(el)
{
	el.style.display = "block";
	el.style.top = "50%";
	el.style.left = "50%";
	if(isIE6){
		el.style.position = "absolute";
		el.style.marginTop = parseInt(document.documentElement.scrollTop-el.offsetHeight/2,10) + 'px';
	}else{
		el.style.position = "fixed";
		el.style.marginTop = '-'+ parseInt(el.offsetHeight/2,10) + 'px';
	}
	el.style.marginLeft = "-" + parseInt(el.offsetWidth/2,10) + "px";
}

//IE6 private  <iframe id="TB_HideSelect"></iframe>
//MacFF <div id="TB_overlay" class="TB_overlayMacFFBGHack"></div> 
//other <div id="TB_overlay" class="TB_overlayBG"></div>
PopUpManager.prototype.addLayover = function(){
	var overlay = document.getElementById(this.overlayId);
	if(!overlay){
		if(isIE6){
			this.addIE6TemStyle();
			var iframe  = document.createElement("iframe");	
			iframe.id = "TB_HideSelect";
			iframe.frameBorder=0;
			document.body.appendChild(iframe);
		}
		overlay = document.createElement("div");
		overlay.id = this.overlayId;
		overlay.className = this.overlayClass;
		document.body.appendChild(overlay);
	}
	var zIndex;
	if(isIE){
		zIndex = isIE && overlay.currentStyle.zIndex;
	}else{
		zIndex = window.getComputedStyle(overlay,null).zIndex;
	}
	if(zIndex<Drag.maxDepth)
	{
		
	}
	overlay.style.display = "block";
	return overlay;
}

//<div id="TB_window"></div>
PopUpManager.prototype.addContent = function(el){
	var container = document.getElementById(this.containerId);
	if(!container){
		container = document.createElement("div");
		container.id = this.containerId;
		document.body.appendChild(container);
	}
	container.appendChild(el);
	this.centerPopUp(container);
	document.getElementById(this.containerId).style.display = "block";
}
PopUpManager.prototype.addIframe = function()
{
	var iframe = document.getElementById(this.iframeId);
	if(!iframe)
	{
		iframe = document.createElement("iframe");
		iframe.id = this.iframeId;
		iframe.frameBorder = 0;
		document.body.appendChild(iframe);
	}
	return iframe;
}
PopUpManager.prototype.removePopUp = function()
{
		this.removeOverlay();
		this.removeContent();
}
PopUpManager.prototype.removeIframe = function(){
	
	this.removeOverlay();
	removeElementById(this.iframeId);
}

PopUpManager.prototype.removeOverlay = function()
{
	removeElementById(this.overlayId);
	if(isIE6){
		this.removeIE6TemStyle();
		removeElementById("TB_HideSelect");
	}
}

PopUpManager.prototype.removeContent = function()
{
	document.getElementById(this.containerId).style.display = "none";
	//document.body.removeChild(this.container);
}

PopUpManager.prototype.addIE6TemStyle = function()
{
	var htmlEl = document.getElementsByTagName("HTML")[0];
	var bodyEl = document.body;
	
	this.IE6OriginalStyle = {htmlHeight: htmlEl.currentStyle.height,
								htmlWidth: htmlEl.currentStyle.width,
								htmlOverflow: htmlEl.currentStyle.overflow,
								bodyHeight: bodyEl.currentStyle.height,
								bodyWidth: bodyEl.currentStyle.width};
	htmlEl.style.width  = "100%";
	htmlEl.style.height = "100%";
	htmlEl.style.overflow = "hidden";
	bodyEl.style.width = "100%";
	bodyEl.style.height = "100%";/**/
	
}
PopUpManager.prototype.removeIE6TemStyle = function()
{
	if(this.IE6OriginalStyle)
	{
		var htmlEl = document.getElementsByTagName("HTML")[0];
		var bodyEl = document.body;
		htmlEl.style.width = this.IE6OriginalStyle.htmlWidth;
		htmlEl.style.height = this.IE6OriginalStyle.htmlHeight;
		htmlEl.style.overflow = this.IE6OriginalStyle.htmlOverflow;
		bodyEl.style.width = this.IE6OriginalStyle.bodyWidth;
		bodyEl.style.height = this.IE6OriginalStyle.bodyHeight;
	}
}






