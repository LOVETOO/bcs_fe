<%@ page import="com.sinocc.util.GlobalVariable"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="/tags/struts-html" prefix="html"%>
<%@ taglib uri="/tags/cpc" prefix="cpc"%>
<%
	//request.setCharacterEncoding("ISO8859-1");
	request.getSession().setAttribute("syssessionid", null);
	request.setAttribute("entcode","cpctest");
	boolean bAspAdmin = "true".equals(request.getParameter("aspadmin"));
%>
<%--<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"--%>
     <%--"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">--%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta name="renderer" content="webkit|ie-comp|ie-stand">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>新锦成EBS费用预算管理系统</title>
		<link rel="shortcut icon" href="img/logo_ico.ico">
		<link href="/web2/resources/css/cpc_login.css" rel="stylesheet" type="text/css" charset="utf-8">
		<SCRIPT LANGUAGE="JavaScript" src="images/newindex.js"></script>
		<!--<script src="js/login/login.js"></script> -->
		<link rel="stylesheet" href="css/reset.css">
		<link rel="stylesheet" href="css/login.css">
		<link rel="stylesheet" href="css/hitalklogin.css">
	</head>
	<body class="gray-bg">
		<div class="header">
			<div class="content">
				<div class="logo ellipsis">
					<%--<img src="img/logo_w.png" alt="华彩智云科技有限公司" style="width:70px;margin-top:6px;">--%>
					<img src="img/logo_w.png" alt="新锦成EBS费用预算管理系统">
					<h1 title="新锦成EBS费用预算管理系统">EBS费用预算管理系统</h1>
				</div>
				<div class="lg-sign pull-right"></div>
			</div>
		</div>
        <div class="img_centent"><img src="img/login_bg_pc3.jpg" alt="华彩智云"></div>
		<!--<div class="login_text"></div>-->
		<form class="m-t" role="form" name="form11" id="form11" method="post" action="/SubmitLogon4.do">
			<div class="form_con">
				<form action="" method="post" name="form1" id="form1">
					<div class="item1">
						<span style='background-position:center 10px;'></span>
						<input type="text" class="username" id="CPCUserName" name="value(userName)" tabindex="1" placeholder='请输入用户名' style="font-family: '微软雅黑'"></div>
					<div class="item1">
						<span style='background-position:center -68px;'></span>
						<input type="password" class="username" id="CPCPassword" name="value(password)" tabindex="2" placeholder='请输入密码' style="font-family: '微软雅黑'"></div>

					<%
						String nologin=(String)request.getParameter("nologin");
						
						if (nologin != null){
							out.print("<div class='item2' style='color:red;display:block;'><label>无效的用户名或密码</label></div>");
						}
					%>

					<div class="item2">
						<!--style=" color: aliceblue;"-->
						<label><input type="checkbox" id="remember_me" checked="checked" name="rememberme" tabindex="3" >记住密码</label>

						<div class="item3"> <input type="submit" class="sub_btn" value="登录" name="CPCLogin" alt="Login" title="Login" tabindex="4"></div>
					</div>

				</form>
			</div>
			<!-- footer -->
			<div class="footer">
				<p>Copyright © 2017 新进成公司版权所有</p>
			</div>

			<!--<script src="fingerprint/fingerprint.js"></script>-->
			<script src="js/jquery/jquery-2.1.1.min.js"></script>
			<script src="images/newindex.js"></script>
            <script src="images/newindex.js"></script>
            <script src="images/newindex.js"></script>

			<FORM method="post" name="webform" id="webform" action="/web/SubmitLogon2.do">
				<input type="hidden" id="wf_userName" name="value(userName)">
				<input type="hidden" id="wf_password" name="value(password)">
			</FORM>

			<SCRIPT LANGUAGE="JavaScript">
				document.onkeydown = function(event) {
					e = event ? event : (window.event ? window.event : null);
					if(e.keyCode == 13 || e.keyCode == 32) {
						//执行的方法  
						document.form11.submit();
					}
				}
			</SCRIPT>
			</span>
			<span class="STYLE5">

  
	<script type="text/javascript">
		function getCookie(name){
				var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
				if(arr=document.cookie.match(reg))
				return unescape(arr[2]);
				else
				return null;
			}

			var cookie = getCookie("username");
			if (cookie != null && cookie != "") {
				document.getElementById("CPCUserName").value = unescape(cookie);
			}
			function setCookie(name,value){
				var Days = 30;
				var exp = new Date();
				exp.setTime(exp.getTime() + Days*24*60*60*1000);
				document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
			}
			function delCookie(name){
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval=getCookie(name);
				if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
			}
			/**function delCookie(name){
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval=getCookie(name);
				if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
			}*/
			if(window.location.pathname == "/logout.do")
				window.location.href = "/web/login.jsp";
			var loginret = window.location.hash;
			//alert("aaa"+loginret);
			if(loginret){
				setCookie("loginret",loginret);
			}else{
				loginret = getCookie("loginret");
				if(loginret && loginret != "undefined")delCookie("loginret");
			}

			</script>
		  </span>
		</form>

	</body>

</html>