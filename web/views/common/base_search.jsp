<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="com.sinocc.base.session.*"%>
<%@ page import="com.sinocc.base.server.CPCServer"%>
<%@ page import="com.sinocc.util.GlobalVariable"%>
<%@ page import="com.sinocc.accesscontrol.*"%>
<%@ page import="com.sinocc.util.Date"%>
<%@ page
    import="com.sinocc.util.CPCUserBean,com.sinocc.web2.CPCUserData,java.util.Hashtable"%>
<%@ page import="java.io.*"%>
<%@ page import="java.net.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.sinocc.util.*"%>
<%@ page import="com.alibaba.fastjson.JSON"%>
<%@ page import="com.sinocc.exception.*"%>
<%
 
    String ctrl_obj_name =  (String) request.getParameter("obj");

    out.println("<div class=\"wrapper wrapper-content animated fadeInRight\" ng-controller=\""+ctrl_obj_name+"\">");
%>

<div class="row row_div resource-root">
	<div class="col-lg-12" id="margins" style="height: 100%; width: 100%;">
		<div class="ibox float-e-margins">
			<div id="file" class="ibox-title" style="padding-top:8px;">
				<h5 style="margin:0;"><strong>{{headername}}</strong></h5>
				<div ibox-tools class="pull-right"></div>
			</div>
			<div class="ibox-content" style="width: 100%;">
				<!-- 搜索框 -->
				<div id="content">
					<form name="seaport_search" id="saveform" local-storage ng-model="data.currItem">
						<table class="table table-striped table-bordered table-hover">
							<tr>
								<td width="70%">
									<input ng-model="searchtext" type="text" name="keyword" placeholder="输入文本..." class="form-control">
								</td>
								<td>
									<div class="btn-group">
										<button class="btn btn-sm btn-info dropdown-toggle" ng-click="search()">查询</button>
										<button data-toggle="dropdown" class="btn btn-sm btn-info dropdown-toggle">
                                            <span class="caret"></span>
                                        </button>
										<ul class="dropdown-menu">
											<li>
												<a ng-click="init_table()">高级查询</a>
											</li>
										</ul>
									</div>
									<!--button class="btn btn-sm btn-info dropdown-toggle" ng-click="edit()">编辑</button-->
								</td>
							</tr>
						</table>
					</form>
					<button class="btn btn-sm btn-info dropdown-toggle" ng-hide="hide" ng-click="new()">新增{{headername}}</button>
				</div>
				<!-- 列表内容 -->
				<div class="ibox-content">
					<div id="grid" ag-gridview sg-options="viewOptions" style="width:100%;" sg-columns="viewColumns" sg-data="data.currItem.contains"></div>
				</div>
				<div class="ibox-content modal-open" page-pagination></div>
			</div>
		</div>
	</div>
</div>
</div>

<style type="text/css">
	div.more_news {
		flex-grow: 1;
		flex-shrink: 1;
	}
	
	.resource .ag-blue {
		width: 100%!important;
		padding-top: 1px !important;
		height: 80%!important;
	}
	
	.resource {
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 1;
		flex-grow: 1;
		background-color: #fff;
	}
	
	.resources {
		display: flex;
		flex-direction: row;
		flex-shrink: 1;
		flex-grow: 1;
		/*height: 100%;*/
		background-color: #fff;
	}
	
	div.wrap-height {
		display: flex;
	}
	
	div.wrap-height>div.ng-scope {
		width: 100%;
		flex-shrink: 1;
		flex-grow: 1;
	}
	
	.wrapper.animated.fadeInRight.ng-scope {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		flex-shrink: 1;
	}
	
	.wrapper-content {
		padding: 0px 0px 10px!important;
	}
	
	div.ibox-content {
		padding: 5px 5px 5px 5px!important;
	}
	
	.resource-root {
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 1;
		flex-grow: 1;
		background-color: #fff;
	}
	
	div.left-nav-div {
		width: 180px;
		flex-grow: 0;
		flex-shrink: 0;
		display: flex;
	}
	
	div.client-content {
		flex-grow: 1;
		flex-shrink: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	
	div.more_news {
		flex-grow: 1;
		flex-shrink: 1;
	}
	
	div.ibox-content.modal-open {
		flex-grow: 0;
		flex-shrink: 0;
	}
	
	.fadeInRight {
		z-index: 10;
	}
	
	.tab-content {
		position: initial;
	}
	
	.row_div {
		width: 100%;
		margin-right: 0px;
		margin-left: 0px;
		margin-top: 1%;
	}
	
	.wrap-height {
		height: 334px;
		margin-right: 0px !important;
		padding-right: 0px!important;
		overflow: hidden;
		outline: none;
	}
	
	.ibox {
		height: 100%;
		clear: both;
		margin-bottom: 0px;
		margin-top: 0;
		padding: 0;
	}
	
	.wrapper.animated.fadeInRight.ng-scope {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		flex-shrink: 1;
		height: 99%;
	}
</style>
<script type="text/javascript">
	setTimeout(function() {
		$('#grid').height($("#margins").height() - $("#file").height() - $("#content").height()-85);
	}, 500);

	window.onresize = function() {
		setTimeout(function() {
			$('#grid').height($("#margins").height() - $("#file").height() - $("#content").height()-85);
		}, 200);
	}
</script>