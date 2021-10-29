<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="com.hczy.kernel.base.session.*"%>
<%@ page import="com.hczy.base.util.GlobalVariable"%>
<%@ page import="com.hczy.base.accesscontrol.*"%>
<%@ page import="com.hczy.base.util.Date"%>
<%@ page import="com.hczy.base.util.SCPUserBean,com.hczy.web2.SCPUserData,java.util.Hashtable"%>
<%@ page import="java.io.*"%>
<%@ page import="java.net.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.hczy.base.util.*"%>
<%@ page import="com.alibaba.fastjson.JSON"%>
<%@ page import="com.hczy.kernel.exception.*"%>
<%@ page import="com.hczy.baseman.Base_ModMenu"%>
<%
	//session.setMaxInactiveInterval(7200);
	//String strLoginGuid =  (String) session.getAttribute("syssessionid");

	Map<String, String> cookies = new HashMap<String, String>();
	for (Cookie cookie : request.getCookies()) {
		String name = cookie.getName();
		String value = URLDecoder.decode(cookie.getValue(), "utf-8");
		cookies.put(name, value);
	}

	String strLoginGuid = null;
	if(cookies.containsKey("syssessionid")){
		strLoginGuid = cookies.get("syssessionid")+"";
	}else if(cookies.containsKey("SYSSESSIONID")){
		strLoginGuid = cookies.get("SYSSESSIONID")+"";
	}

	Session s =  SessionManager.getInstance().getSessionById(strLoginGuid);
  	SCPUserBean ub = (SCPUserBean)s.getUserInfo();
    SCPClientInfo  ci=(SCPClientInfo)s.getClientInfo();
    SCPVaultBean vault = new SCPVaultBean("1");
    SysUseObject sysObj = new SysUseObject(ub.getUserId() ,vault.VaultId);

    String strUserId=ub.getUserId();

    Base_ModMenu usermod =new Base_ModMenu();
    usermod.setParent(sysObj);
   // usermod.setDao(bbsDataCentre);
    usermod.setClientInfo(ci);
    usermod.setUserBean(ub);
    usermod.getDao().setTransation(false);

    //String avatar = usermod.getDao().strSelect("select avatar from oa_user_avatar_v where userid='"+usermod.getUserBean().UserId+"'");
    //if (avatar==null || avatar.length()==0){
    	String  avatar = "img/logo_white.png";
	//}
    try {
	    //usermod.doSearch();
		//usermod.ModId=0;
		//usermod.Flag=0;
	    //usermod.doSearch();
		//usermod.doTransaction("search");
        //out.println("usermod:"+usermod.Base_ModMenus.getRelationData());
	} catch(Exception e)  {
	    out.println(e.toString());
		out.print("<p>出错了，请重试！</p>");
		e.printStackTrace();
    } finally {
		usermod.freeAllConn();
		usermod = null;
	}
%>

<div id="mymenu" class="left-nav-list">
	<div id="Popup">
		<i></i>
		<ul class="nav nav-second-level1 collapsing" id="collapsing" ng-mouseleave="mouseleave()">

			<li>
				<ul class="clearfix item-list collapse" style="display:block;color:#fff">
					<li class="subitem">
						<dl ng-repeat="c in arrs" class="\" "clearfix=" " item\"="">
							<dt>
								<span class="menuname">{{c.menuname}}</span>
								<i class="fa fa-angle-right"></i>
							</dt>
								<%--<span style="font-size: 18px;font-size: 18px;float: left;position: relative;font-weight: bold;margin: 3px 7px 0px 0px;" class="fa fa-angle-right ng-scope"></span>--%>
							<dd>
								<em ng-click="select_c(d)" ng-repeat="d in c.submenus  | orderBy:'d.sortindex'"><a  ui-sref="{{d.webrefaddr||'noop'}}" target="_self">{{d.menuname}}</a> </em>
							</dd>
						</dl>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<nav class="navbar-default navbar-static-side" role="navigation">
		<div class="sidebar-collapse">
			<ul side-navigation class="nav metismenu" id="side-menu">
				<li class="nav-header">
					<div class="user-box">
						<!-- <%
							out.println("<img alt=\"image\" src=\""+avatar+"\" class=\"navlogo\" id=\"useravatar\"/>");
						%> -->
						<img class="user-img" style="cursor:pointer"
							src={{(headimgdocid)?"/downloadfile?docid="+headimgdocid+"&viewtype=1":"img/head.png"}}
							ng-click="openMySettings()">
						<div class="user-text">
							<div class="user-name">{{userbean.username}}</div>
							<div class="user-gm" ng-bind="user.positionofusers[0].positionname"></div>
							<!-- || '系统管理员' -->
						</div>
					</div>
					<!-- <div class="logo-element">CRM</div> -->
				</li>
				<!--开始区-->
				<li class="left-nav" ng-repeat="item in mods.base_modmenus">
					<a href="#" ng-click="select_a()" title="{{item.modname}}"><i class="fa {{item.webimageurl}}"></i> <span class="nav-label ng-binding">{{item.modname}}</span> <span class="fa arrow"></span></a>
					<ul ng-repeat="a in item.submods" class="nav nav-second-level collapse" style="height: 0px;">
						<li ui-sref-active="active" class="" ng-click="onClickMod(a)">
							<a ng-if="a.submenushowstyle != '2'" id="label" ui-sref="{{a.webrefaddr||'noop'}}" target="_self" ng-mouseenter="select_b(a,$event)" ng-mouseleave="onMouseLeave($event)"  class="nv"><!--<i class="fa fa-circle-thin" style="font-size: 12px;"></i>--><!-- ui-sref="{{a.webrefaddr}}" -->
								<span id="label" class="nav-label">{{a.modname}}</span>
								<span ng-if="a.rootmenus.length>0" style="font-size: 15px;float: right;" class="fa fa-angle-right ng-scope"></span>
							</a>
							<a ng-if="a.submenushowstyle == '2'" id="label" ui-sref="{{a.webrefaddr||'noop'}}" target="_self" ng-mouseleave="onMouseLeave($event)" class="nv">
								<span id="label" class="nav-label">{{a.modname}}</span>
								<span ng-if="a.rootmenus.length>0" style="font-size: 15px;float: right;" class="fa fa-angle-right ng-scope"></span>
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div class="use-tips" id="use-tips" style="display: none;">
			<p id="use-tip-text"></p>
			<button id="use-tip-close" class="close"> 朕知道了！</button>
		</div>
	</nav>
</div>
<script>
$(document).ready(function(){
	//setInterval(function mytips(){
	//	var time = new Date();
	//	if(time.getHours() == 12
	//		&& time.getMinutes() == 0
	//		&& time.getSeconds() == 0 ){
	//		$(".use-tips,#robot-head").show();
	//		$("#use-tip-text").text("现在是午间休息时间。走，吃饭饭！");
	//		setTimeout( function(){
	//			$(".use-tips,#robot-head").hide();
	//		}, 5 * 1000 );
	//	}
	//	// if(time.getHours() == 18
	//	// 	&& time.getMinutes() == 0
	//	// 	&& time.getSeconds() == 0 ){
	//	// 	$(".use-tips,#robot-head").show();
	//	// 	$("#use-tip-text").text("");
	//	// 	setTimeout( function(){
	//	// 		$(".use-tips,#robot-head").hide();
	//	// 	}, 5 * 1000 );
	//	// }
	//	$("#use-tip-close").click(function(){
	//		$(".use-tips,#robot-head").hide();
	//	});
	//},1000);

	//window.onload = function(){
	//	setTimeout(function test(){
	//		function test(){
	//			$(".use-tips").show();
	//			$("#use-tip-text").text("您已持续工作长达2小时，请注意休息！");
	//		}
	//	},7200000);
//
	//	var time = new Date();
//
	//	if(time.getMonth() == 2
	//		&& time.getDate() == 19)  {
	//		$(".use-tips,#robot-head").show();
	//		$("#use-tip-text").text("元宵节快乐！:-D");
	//	}
	//};

	//响应从OA首页打开的链接
	(function () {
		var missionId = setInterval(function () {
			if (!('asAngularService' in String.prototype)) return;

			clearInterval(missionId);

			var modName = '$stateParams'.asAngularService.modName;
			if (!modName) return;

			$('#side-menu>li>a')
				.filter(function () {
					return $(this).scope().item.modname === modName;
				})
				.click();
		}, 500);
	})();
});
</script>
