
/**这是信息查询界面js*/
function mkt_fee_type_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {


    //设置标题
    $scope.headername = "市场费用类别";




    //zTree数据声明
    var zTreeObj;
    var zTreeNodes = [];
    var zTreeNode = {};
    var currentNode ;
    var currentNode0 ;
    var setting = {
        view: {
            selectedMulti: false,
            dblClickExpand:false,
            showIcon:false
        },
        callback: {
            onClick: zTreeOnClick,
            beforeExpand: beforeExpand,
        }
    };
    //储存一级节点
    var OneNode=[];
    //储存-增加/修改
    var btn="";


    //设置列，name为表头显示名称，field为对应域的名字
    $scope.columns = [
        {
            id: "code",
            name: "编码",
            field: "code",
            width: 100,
        }, {
            id: "name",
            name: "名称",
            field: "name",
            width:160
        }, {
            id: "type",
            name: "类型",
            field: "type",
            width:160
        }
    ];
    //设置表格参数
    $scope.options = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };

    //detail表格
    $scope.DetailColumns = [
        {
            id: "code",
            name: "费用项目编码",
            field: "code",
            minWidth: 250
        }, {
            id: "name",
            name: "费用项目名称",
            field: "name",
            minWidth: 274
        }
    ];
    //设置表格参数
    $scope.DetailOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,//可编辑
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight:false,
        //check
        multiSelect:true,
    };


    //check
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    //在表格字段前插入check
    $scope.DetailColumns.unshift(checkboxSelector.getColumnDefinition());


    //树数据初始化
    zTreeNode = {
        "id":0,
        "name" : "费用类别",
        "open" : true,
        "checked" : true,
        "isParent" : true,
        "children" : [],
        "data":{}
    };
    zTreeNode.data.fee_type_id=0;
    BasemanService.RequestPost("fin_fee_type", "select", {
        "fee_type_code": "费用类别",
        "sqlwhere": "PId = 0",
        "flag": "2"
    }).then(function (datas) {
        console.info(datas);
        OneNode=datas.fin_fee_typeoffin_fee_types;
        $.each(datas.fin_fee_typeoffin_fee_types,function (i,data) {
            $scope.data={
                "id":data.fee_type_id,
                "name":data.fee_type_code+data.fee_type_name,
                "isParent":true,//设置为父节点
                // "open" : true,//设置开合状态,默认开
                "data":data,
                "isLoadChilded" : false,
            };
            zTreeNode.children.push($scope.data);
        });
        console.log(zTreeNode);
        //初始化树
        zTreeNodes.push(zTreeNode);

        zTreeObj = $.fn.zTree.init(angular.element("#SortTree"), setting, zTreeNodes);
        currentNode = zTreeObj.getNodesByFilter(function (node) {
            return node.level == 0;
        }, true);

        currentNode0={};
        currentNode0.type=datas.fin_fee_typeoffin_fee_types;
        currentNode0.detail=datas.fin_fee_headeroffin_fee_types;
        LoadGrid(currentNode0.type,currentNode0.detail);
    });

    //初始化表格
    $scope.grid = new Slick.Grid("#SlickGrid",[], $scope.columns, $scope.options);
    $scope.DetailGrid = new Slick.Grid("#DetailGrid", [], $scope.DetailColumns, $scope.DetailOptions);

    //check
    $scope.DetailGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.DetailGrid.registerPlugin(checkboxSelector);



    //加载表格数据/树
    function LoadData(datas,bool){
        var data=datas.data;
        BasemanService.RequestPost("fin_fee_type", "select", {
            "fee_type_id": data.fee_type_id,
            "fee_type_code": data.fee_type_code,
            "fee_type_name": data.fee_type_name,
            "idpath": data.idpath,
            "lev": data.lev,
            "usable": "2",
            "sqlwhere": "PId = "+data.pid,
            "flag": "2"
        }).then(function (data) {
            console.info(data);
            if(
                datas.type!=data.fin_fee_typeoffin_fee_types
                ||
                datas.detail!=data.fin_fee_headeroffin_fee_types
            ){
                //加载表格
                LoadGrid(
                    data.fin_fee_typeoffin_fee_types,
                    data.fin_fee_headeroffin_fee_types
                );
            }
            //判断加载树
            currentNode=datas;
            if(data.fin_fee_typeoffin_fee_types.length!=0&&bool==true){
                LoadTree(data);
            }
            //标示已缓存数据
            currentNode.type=data.fin_fee_typeoffin_fee_types;
            currentNode.detail=data.fin_fee_headeroffin_fee_types;
            currentNode.isLoadChilded=true;
        });
    }


    //加载表格
    function LoadGrid(TypeDatas,DetailDatas) {
        //定义表格
        $scope.grid;
        //定义表格数据变量
        $scope.data = [];
        //生成表格数据
        $.each(TypeDatas,function (i,data) {
            $scope.row={
                "code":data.fee_type_code,
                "name":data.fee_type_name,
                "type":"类别",
                "data":data
            }
            $scope.data.push($scope.row);
        });
        $.each(DetailDatas,function (i,data) {
            $scope.row = {
                "code": data.fee_code,
                "name": data.fee_name,
                "type": "费用项目",
                "data":data
            }
            $scope.data.push($scope.row);
        })
        $scope.grid.setData([]);
        $scope.grid.setData($scope.data);
        $scope.grid.render();
    }


    //加载树
    function LoadTree(datas) {
        var zTreeNodes = [];
        $.each(datas.fin_fee_typeoffin_fee_types, function (i, item) {
            var itemNode = {
                "id":item.fee_type_id,
                "name":item.fee_type_code+item.fee_type_name,
                "isParent":true,
                "isLoadChilded" : false,
                "data":item
            };
            zTreeNodes.push(itemNode);
        });
        zTreeObj.removeChildNodes(currentNode);
        zTreeObj.addNodes(currentNode, zTreeNodes);
        currentNode.open=true;
    }


    //树单击事件-加载树/表格
    function zTreeOnClick(event, treeId, treeNode) {
        //判断是否为根基点或已加载过
        if(treeNode.id!=0&&treeNode.isLoadChilded==false){
            LoadData(treeNode,true);
        }else if(treeNode.id=0){
            LoadGrid(treeNode.type,treeNode.detail)
        }else if(treeNode!=currentNode){//判断是否点击原节点
            LoadData(treeNode,false);
        }
        if(currentNode.open==true&&event!=0){
            zTreeObj.expandNode(treeNode,false);
        }else if(currentNode.open==false&&event!=0){
            zTreeObj.expandNode(treeNode,true);
        }
        zTreeObj.selectNode(treeNode);
    };
    //树+号事件
    function beforeExpand(treeId, treeNode) {
        zTreeOnClick(0,treeId, treeNode);
    }


    //树双击事件
    /*function zTreeOnDblClick(event, treeId, treeNode) {
     return false;
     }*/


    //模态窗确定事件
    $scope.SortModal=function () {
        if(btn=="update"){
            $scope.UpdateSortModal();
        }else if(btn=="add"){
            $scope.AddSortModal();
        }
    }

    //属性按钮
    angular.element("#UpdateSortModalBtn").click(function () {
        if(currentNode.data.fee_type_id!=0){
            updateSort();
        }else{
            BasemanService.swalError("错误", "请先选择节点");
            return;
        }
    });
    //修改类别模态窗
    function updateSort() {
        btn="update";
        //接单击事件的查询数据
        $scope.AddSortCode=currentNode.data.fee_type_code;
        $scope.AddSortName=currentNode.data.fee_type_name;
        $scope.AddBusinessUnits=currentNode.data.entname;
        $scope.AddHierarchy=currentNode.data.lev;
        $scope.AddComment=currentNode.data.note;
        $scope.AddUsable=(currentNode.data.usable==2?true:false);
        $("#AddSortModal").modal("show");
        $scope.$apply();
    }
    //修改类别
    $scope.UpdateSortModal=function() {
        if($scope.AddSortCode==""||$scope.AddSortName==""){
            BasemanService.swalError("错误", "设置不能为空");
            return;
        }
        BasemanService.RequestPost("fin_fee_type", "update", {
            "fee_type_id":currentNode.data.fee_type_id,
            "fee_type_code": $scope.AddSortCode,
            "fee_type_name": $scope.AddSortName,
            "idpath": currentNode.data.idpath,
            "pid": currentNode.data.pid,
            "lev": $scope.AddHierarchy,
            "usable": ($scope.AddUsable==true?2:1),
            "note": $scope.AddComment
        }).then(function (data) {
            currentNode.name=$scope.AddSortCode+$scope.AddSortName;
            //修改本地储存的数据-修改模态窗要使用
            currentNode.data.fee_type_code=$scope.AddSortCode;
            currentNode.data.fee_type_name=$scope.AddSortName;
            currentNode.data.lev=$scope.AddHierarchy;
            currentNode.data.usable=($scope.AddUsable==true?2:1);
            currentNode.data.note=$scope.AddComment;
            //更新树
            zTreeObj.updateNode(currentNode);
            BasemanService.swalError("成功","修改成功");
            $("#AddSortModal").modal("hide");
        });
    };


    //弹出添加类别按钮
    angular.element("#AddSortModalBtn").click(function () {
        btn="add";
        $scope.AddSortCode="";
        $scope.AddSortName="";
        $scope.AddBusinessUnits="";
        $scope.AddComment="";
        $scope.AddHierarchy="";
        $scope.AddUsable=true;
        $("#AddSortModal").modal("show");
        $scope.$apply();
    });
    //添加类别
    $scope.AddSortModal=function () {
        var data = {};
        if($scope.AddSortCode==""||$scope.AddSortName==""){
            BasemanService.swalError("错误","设置不能为空");
            return;
        }
        data.fee_type_code = $scope.AddSortCode;
        data.fee_type_name = $scope.AddSortName;
        data.usable = ($scope.AddUsable == true ? 2 : 1);
        if(currentNode.data.fee_type_id!=0){
            data.pid=currentNode.data.fee_type_id;
            data.parent_idpath=currentNode.data.idpath;
        }
        BasemanService.RequestPost("fin_fee_type", "insert", data
        ).then(
            function (data) {
                if(currentNode.data.fee_type_id!=0){
                    LoadData(currentNode,true);
                }else{
                    BasemanService.RequestPost("fin_fee_type", "select", {
                        "fee_type_code": "费用类别",
                        "sqlwhere": "PId = 0",
                        "flag": "2"
                    }).then(function (data) {
                        //刷新树
                        LoadTree(data);
                        //刷新表格
                        LoadGrid(
                            data.fin_fee_typeoffin_fee_types,
                            data.fin_fee_headeroffin_fee_types
                        );
                    });
                }
                BasemanService.swalSuccess("成功","添加成功");
            }
        );
        $("#AddSortModal").modal("hide");
    };


    //弹出添加明细模态窗
    angular.element("#AddDetailModalBtn").click(function () {
        console.log(currentNode);
        if(currentNode.data.fee_type_id==0){
            BasemanService.swalError("错误","请先选择节点");
        }else{
            //获取所属类别
            $scope.DetailSort=currentNode.data.fee_type_name;
            //获取所属大类-一级类别
            $scope.DetailType="";
            if(currentNode.data.pid==0){
                $scope.DetailType=$scope.DetailSort;
            }else{
                $scope.OneId=currentNode.data.idpath.match(/[0-9]+/)[0];
                $.each(OneNode,function (i,item) {
                    if(item.fee_type_id==$scope.OneId){
                        $scope.DetailType=item.fee_type_name;
                    }
                });
            }
            //加载明细表格
            LoadDetailGrid();
            $("#AddDetailModal").modal("show");
        }
    });


    //加载明细表格
    function LoadDetailGrid(){
        $scope.DetailDatas=[];
        //定义表格数据变量
        BasemanService.RequestPost("fin_fee_type", "get_fee_info", {
            "fee_type_id": currentNode.data.fee_type_id,
            "idpath": currentNode.data.idpath
        }).then(function (result) {
            $scope.DetailDatas=result;
            $scope.DetailData=[];
            $scope.refflag1=[];
            $scope.refflag2=[];
            $.each(result.fin_fee_headeroffin_fee_types,function (i,item) {
                //refflag:2选中  0可选  1当前大类下被其他引用
                $scope.row={
                    "code":item.fee_code,
                    "name":item.fee_name,
                    "refflag":item.refflag
                };
                //设置checkbox状态
                if(item.refflag==2){
                    $scope.refflag2.push(i);
                }else if(item.refflag==1){
                    $scope.refflag1.push(i);
                }
                $scope.DetailData.push($scope.row);
            });
            //重绘网格
            $scope.DetailGrid.setData([]);

            //备用
            var dataProvider = new TotalsDataProvider($scope.DetailData, $scope.DetailColumns);
            $scope.DetailGrid.setData(dataProvider);

            // $scope.DetailGrid.setData($scope.DetailData);

            //设置勾选的行
            $scope.DetailGrid.setSelectedRows($scope.refflag2);
            $scope.DetailGrid.render();

            //设置refflag:1样式/先加载网格
            /*setTimeout(function () {
             $.each($scope.refflag1, function (i, item) {
             item = parseInt(item);
             $("#DetailGrid .slick-row:nth-child(" + (item + 1) + ")").css("background", "#ccc");
             $("#DetailGrid .slick-row:nth-child(" + (item + 1) + ") input[type="checkbox"]").attr("disabled", true);
             console.log(document.querySelector("#DetailGrid .slick-row:nth-child(" + (item + 1) + ")"));
             console.log("#DetailGrid .slick-row:nth-child(" + (item + 1) + ")");
             });
             },300);*/
        })
    }


    //添加明细
    $scope.AddDetailModal=function () {
        //获取被选择的复选框
        var selectRow = $scope.DetailGrid.getSelectedRows();
        $scope.fin_fee_headeroffin_fee_type=[];
        $.each($scope.DetailDatas.fin_fee_headeroffin_fee_types,function (i,item) {
            //新勾选的传refflag:0
            if(
                (selectRow.indexOf(i)!=-1)
                &&
                ($scope.refflag2.indexOf(i)==-1)
            ){
                $scope.row={
                    "fee_id": item.fee_id,
                    "fee_code": item.fee_code,
                    "fee_name": item.fee_name,
                    "refflag": "0"
                };
                $scope.fin_fee_headeroffin_fee_type.push($scope.row);
            }else if(
                (selectRow.indexOf(i)!=-1)
                &&
                ($scope.refflag2.indexOf(i)!=-1)
            ){//原勾选的传refflag:2
                $scope.row={
                    "fee_id": item.fee_id,
                    "fee_code": item.fee_code,
                    "fee_name": item.fee_name,
                    "refflag": "2"
                };
                $scope.fin_fee_headeroffin_fee_type.push($scope.row);
            }
            //去掉勾选的不传
        });
        var postdata={
            "fee_type_id": currentNode.data.fee_type_id,
            "idpath": currentNode.data.idpath,
        };
        postdata.fin_fee_headeroffin_fee_types=$scope.fin_fee_headeroffin_fee_type;
        BasemanService.RequestPost("fin_fee_type", "update_fee_info",
            JSON.stringify(postdata)
        ).then(function (result) {
            if(typeof(result)=="object"){//错误返回string提示
                BasemanService.swalSuccess("成功", "修改成功",function () {
                    currentNode.detail=result.fin_fee_headeroffin_fee_types;
                    LoadGrid(currentNode.type,currentNode.detail);
                });
                return;
            }
            //问题:当去掉所有勾选时,没有提示
        });
    };


    //表格双击查询
    function SlickDbClick(e, args) {
        var data=args.grid.getDataItem(args.row).data;
        var datas=args.grid.getDataItem(args.row);
        if(datas.type=="类别"){
            $scope.fee_type_code="类别编码";
            $scope.fee_type_name="类别名称";
            $scope.entname="经营单位";
            $scope.lev="层级";
            $scope.note="备注";

            $scope.LookSortCode=data.fee_type_code;
            $scope.LookSortName=data.fee_type_name;
            $scope.LookBusinessUnits=data.entname;
            $scope.LookHierarchy=data.lev;
            $scope.LookComment=data.note;
            $scope.LookUsable=(data.usable==2?true:false);
            $("#LookModal").modal("show");
            $scope.$apply();
        }else{
            $scope.fee_type_code="编码";
            $scope.fee_type_name="名称";
            $scope.entname="栏位类型";
            $scope.lev="状态";
            $scope.note="备注";

            $scope.LookSortCode=data.fee_code;
            $scope.LookSortName=data.fee_name;
            $scope.LookBusinessUnits="普通费用";
            $scope.LookHierarchy=(data.stats==2?"使用中":"未使用");
            $scope.LookComment=data.note;
            $scope.LookUsable=true;
            $("#LookModal").modal("show");
            $scope.$apply();
        }
        console.log(args.grid.getDataItem(args.row));
    }


    $scope.grid.onDblClick .subscribe(SlickDbClick);


    //网格样式控制
    function TotalsDataProvider(data, columns) {
        var totals = {};
        var totalsMetadata = {
            // Style the totals row differently.
            cssClasses: "disSelect",
            columns: {}
        };
        // Make the totals not editable.
        for (var i = 0; i < columns.length; i++) {
            totalsMetadata.columns[i] = { editor: null };
        }
        this.getLength = function() {
            return data.length;
        };
        this.getItem = function(index) {
            return (index < data.length) ? data[index] : totals;
        };
        this.updateTotals = function() {
        };
        this.getItemMetadata = function(index) {
            // return (index != data.length) ? null : totalsMetadata;
            if(index == data.length){
                return null;
            }else if(data[index].refflag==1){
                return totalsMetadata;
            }else{
                return null;
            }
        };
        this.updateTotals();
    }

    //网格自适应
    BasemanService.initGird();
    //初始化分页
    // BaseService.pageGridInit($scope);
}
//注册控制器
angular.module("inspinia")
    .controller("ctrl_mkt_fee_type_header", mkt_fee_type_header);

