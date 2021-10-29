'use strict';
var promanControllers = angular.module('promanControllers', []);

/**
 *  产品资料 -- 第一页
 * @param $scope
 * @param $rootScope
 * @param $modal
 * @param $http
 */
function ProItemHeaderController($scope,$location, $rootScope,ProItemHeaderService) {
	
	//记录叶子节点
	 ProItemHeaderService.pushPage({url:"gallery.pro_item_header"});
     $scope.message = "";
     $scope.RecordCount = 0;
     //分页
     ProItemHeaderService.pageInit($scope);
     
     var promise = ProItemHeaderService.query();
     promise.then(function(data){
    	 $scope.proitem = data;
    	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
     });
     $scope.refresh = function(){
    	 $scope.searchtext = "";
    	 $scope.search();
 	}
    // 查询
    $scope.search = function() {
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
		var  postdata={
	          Flag:0,
	          pagination:"pn=1,ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
              sqlwhere:sqlwhere
	    };
		var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
        },function(data){
        	console.log("error");
        });
	}
	//跳转编辑
	$scope.edit = function(index,event){
		ProItemHeaderService.setEditObj({key:"pro_item_header",value:$scope.proitem.pro_item_headers[index].item_h_id});
		$(event.currentTarget).closest(".ibox-content").siblings(".ibox-title")
		.find("a[ui-sref='gallery.pro_item_headeredit']").trigger("click");
		
	}
    // 删除
    $scope.so_delete = function(index) {
		var  postdata={
             item_h_id:$scope.proitem.pro_item_headers[index].item_h_id
	    };
		var promise = ProItemHeaderService.RequestPost("pro_item_header","delete",postdata);
        promise.then(function(data){
        	alert("删除成功!");
			$scope.proitem.pro_item_headers.splice(index, 1);
			ProItemHeaderService.reloadFootable();
        },function(data){
        	console.log("error");
        	console.log(data);
        });
    };
    
    //跳转页Enter
    $scope.keyup = function(e){
    	var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
        	if($scope.oldPage != $scope.currentPage && $scope.currentPage >0 && $scope.currentPage<=$scope.pages){
        		var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
        		var  postdata={
		          Flag:0,
		          pagination:"pn="+$scope.currentPage+",ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
		          sqlwhere: sqlwhere
		  	    };
		    	
		    	var promise = ProItemHeaderService.query(postdata);
		        promise.then(function(data){
			       	 $scope.proitem = data;
			       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
		        });
        	}
        }
    }
    
    //首页
    $scope.firstpage = function (){
    	if($scope.currentPage<=1){
    		return;
    	}
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
    	var  postdata={
          Flag:0,
          pagination:"pn=1,ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
          sqlwhere: sqlwhere
  	    };
    	var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	         ProItemHeaderService.pageInfoOp($scope,data.pagination);
        });
        
    }
    //上一页
    $scope.prevpage = function(){
    	if($scope.currentPage == 1)return;
    	
    	var num = Number($scope.currentPage)-1;
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
    	var  postdata={
          Flag:0,
          pagination:"pn=" + num + ",ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
          sqlwhere: sqlwhere
  	    };
    	
    	var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
        });
    }
  //下一页
    $scope.nextpage = function(){
    	if($scope.currentPage == $scope.pages)return;
    	var num = Number($scope.currentPage)+1;
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
    	var  postdata={
          Flag:0,
          pagination:"pn=" + num + ",ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
          sqlwhere: sqlwhere
  	    };
    	
    	var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
        });
    }
    //末页
    $scope.lastpage = function(){
    	if($scope.currentPage>=$scope.pages){
    		return;
    	}
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
    	var  postdata={
          Flag:0,
          pagination:"pn="+$scope.pages+",ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
          sqlwhere: sqlwhere
  	    };
    	
    	var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
        });
          
    }
    //页数大小改变
    $scope.pschange = function(ps){
    	var sqlwhere = ProItemHeaderService.getSqlWhere(["item_h_name"],$scope.searchtext);
    	var  postdata={
    	          Flag:0,
    	          pagination:"pn=1,ps="+ps+",pc=0,cn=0,ci=0",
    	          sqlwhere: sqlwhere
    	  	    };
    	var promise = ProItemHeaderService.query(postdata);
        promise.then(function(data){
	       	 $scope.proitem = data;
	       	 ProItemHeaderService.pageInfoOp($scope,data.pagination);
        });
        
    }
    
}

//产品编辑页面
function ProItemHeaderEditController($scope,notify,$timeout,Upload,$location,ProItemHeaderService){
	
	var pageList = ProItemHeaderService.getPages();
	$scope.prevPage = {url:"#/"};
	if(pageList && pageList.length >0){
		//取出最新一个
		$scope.prevPage = pageList[pageList.length-1];
	}
	
	//如果是编辑
	$scope.isEdit = false;
	$scope.EditStr = "新增";
	$scope.objattachs = [];
	var editObj = ProItemHeaderService.getEditObj();
	if(editObj.key == "pro_item_header"){
		$scope.isEdit = true;
		$scope.EditStr = "编辑";
		var promise = ProItemHeaderService.RequestPost("pro_item_header","select",{item_h_id:editObj.value});
        promise.then(function(data){
        	$scope.proitem = data;
        	$scope.objattachs = data.objattachs;
        	$scope.proitem.item_type = String($scope.proitem.item_type);
        },function(data){
        	console.log("error");
        	console.log(data);
        });
		
		ProItemHeaderService.setEditObj({key:"",value:""})
	}else{
		$scope.proitem = {};
		$scope.proitem.pro_item_box_lineofpro_item_headers = new Array();
		$scope.proitem.pro_item_line_partofpro_item_headers = new Array();
		$scope.proitem.objattachs = new Array();
		$scope.proitem.creator = window.strUserId;
	}
	//需要查询  -- 柜型信息
	var promise = ProItemHeaderService.getProItemBoxLine();
	promise.then(function(data){
		$scope.pro_item_box_line_types = data.pro_item_headers;
	},function(data){
		$scope.pro_item_box_line_types = new Array();
	});
	
	//产品分类
	$scope.dict_item_types = [{name:'成品', value:'1'},
	                          {name:'配件', value:'2'},
	                          {name:'半成品', value:'3'},
	                          {name:'包装物料', value:'4'},
	                          {name:'半成品13', value:'13'}];
	//关闭了当前页
	$scope.closebox = function(){
		$location.path("/gallery/pro_item_header");
	}
	//配件select -- change
	$scope.check_part_type = function(){
		if($scope.proitem.item_type == 2){
			alert("产品分类不能为配件！");
			return;
		}
	}
	
	//打开产品线
	$scope.openTypeFrm = function(){
		var FrmInfo = {};
		FrmInfo.title = "产品类型查询"; 
		FrmInfo.thead = [{name:"产品类型编码",code:"item_type_no"},
		                 {name:"产品类型名称",code:"item_type_name"}];
		ProItemHeaderService.openCommonFrm(PopLineController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.proitem.item_type_id = result.item_type_id;
			$scope.proitem.item_type_no = result.item_type_no;
			$scope.proitem.item_type_name = result.item_type_name;
		});
	}
	//打开物料组
	$scope.openGroupFrm = function(){
		var FrmInfo = {};
		FrmInfo.title = "物料组查询"; 
		FrmInfo.thead = [{name:"物料组编码",code:"item_group_code"},
		                 {name:"物料组名称",code:"item_group_name"}];
		
		ProItemHeaderService.openCommonFrm(PopGroupController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.proitem.item_group_id = result.item_group_id;
			$scope.proitem.item_group_code = result.item_group_code;
			$scope.proitem.item_group_name = result.item_group_name;
		});
	}
	//打开配件信息
	$scope.openPartFrm = function($index){
		var FrmInfo = {};
		FrmInfo.title = "备件查询"; 
		FrmInfo.thead = [{name:"备件编码",code:"item_h_code"},
		                 {name:"备件名称",code:"item_h_name"}];
		
		ProItemHeaderService.openCommonFrm(PopPartController,$scope,FrmInfo)
		.result.then(function (result) {
			$scope.proitem.pro_item_line_partofpro_item_headers[$index]
			.css_item_code = result.item_h_code;
			$scope.proitem.pro_item_line_partofpro_item_headers[$index]
			.css_item_name = result.item_h_name;
		});
	}
	//增加柜型
	$scope.addType = function(){
		var newObj = {"id":$scope.proitem.pro_item_box_lineofpro_item_headers.length + 1};
		$scope.proitem.pro_item_box_lineofpro_item_headers.push(newObj);
	}
	//删除柜型
	$scope.so_delete = function(index) {
        $scope.proitem.pro_item_box_lineofpro_item_headers.splice(index, 1);
	};
	//增加配件
	$scope.addPart = function(){
		if($scope.proitem.item_type == 2){
			alert("产品类型不能为配件！");
			return;
		}
		var newObj = {"id":$scope.proitem.pro_item_line_partofpro_item_headers.length + 1,"item_h_code":"","item_h_name":"","css_item_code":""};
		$scope.proitem.pro_item_line_partofpro_item_headers.push(newObj);
	}
	//删除配件
	$scope.deletePart = function(index){
		$scope.proitem.pro_item_line_partofpro_item_headers.splice(index, 1);
	}
	//移除附件
	$scope.removeAttach = function(index){
		$scope.objattachs.splice(index,1);
	}
	
	//添加附件
	$scope.addattch = function(files){
		if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var promise = Upload.upload({
                    url: '/web/scp/filesuploadsave2.do',
                    method: 'post',
                    key: file.name,
                    data:{"scpsession" : window.strLoginGuid},
                    fields: {
                    	'scpsession': window.strLoginGuid,
                    	 'Content-Type': file.type === null || file.type === '' ? 'application/octet-stream' : file.type,
                    	 'filename': file.name
                    	},
            		fileFormDataName: 'docFile0',	
            		
                    file: file
                })
                promise.then(function(response){
                	 $timeout(function () {
                         file.result = response.data;
                     });
                },function(response){
                	alert("Failure");
                });
            }
        }
	}
	//文件上传
	$scope.$watch('files', function () {
        $scope.addattch($scope.files);
    });
	
	//产品资料保存更新
	$scope.save = function(){
		$scope.proitem.objattachs = $scope.objattachs;
		if($scope.isEdit){
			var promise = ProItemHeaderService.RequestPost("pro_item_header","update",$scope.proitem);
	        promise.then(function(data){
	        	ProItemHeaderService.notify(notify,"更新成功!","alert-info",1000);
	        },function(data){
	        	console.log("error");
	        	ProItemHeaderService.notify(notify,data.message,"alert-danger");
	        });
		}else{
			var promise = ProItemHeaderService.RequestPost("pro_item_header","insert",$scope.proitem);
	        promise.then(function(data){
	        	ProItemHeaderService.notify(notify,"保存成功!","alert-info",1000);
	        	$timeout(function(){$scope.closebox();},1000);
	        },function(data){
	        	console.error("error");
	        	ProItemHeaderService.notify(notify,data.message,"alert-danger");
	        });
		}
	}
	
}

 // 产品资料
promanControllers
	.controller('ProItemHeaderController',ProItemHeaderController)
    .controller('ProItemHeaderEditController',ProItemHeaderEditController)
 
 
 