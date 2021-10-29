/**
 *  author: Li Meng
 *  time: 2019/7/30
 *  module:配件出库-新件&旧件 属性页
 **/
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi','numberApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi,numberApi,$modal) {

        var itemSale = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/

                function editable(args) {
                    return  $scope.data.currItem.stat == 1 && !args.node.rowPinned;
                }
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //联系人信息
                $scope.gridOptions_itemsale = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '配件编号',
                        required:true,
                        editable:function(args) {
                            return   editable(args)
                        },
                        onCellDoubleClicked:function (args) {
                            if (!$scope.data.currItem.warehouse_id){
                                swalApi.info('请先选择出库仓库');
                                return;
                            }
                            if(editable(args))
                            $scope.search_itemsale(args);
                        }
                    }, {
                        field: 'item_name',
                        headerName: '配件名称',
                        required:true,
                        editable:function(args) {
                            return  editable(args)
                        },
                        onCellDoubleClicked:function (args) {
                            if (!$scope.data.currItem.warehouse_id){
                                swalApi.info('请先选择出库仓库');
                                return;
                            }
                            if(editable(args))
                            $scope.search_itemsale(args);
                        }
                    } , {
                        field: 'qty',
                        headerName: '数量',
                        type:'数量',
                        editable:function(args) {
                            return   editable(args)
                        },
                        onCellValueChanged: function (args) {
                            if(args.data.canuse_qty){
                                if(args.newValue>args.data.canuse_qty){
                                    swalApi.info('数量已大于库存数量');
                                }
                            }
                            $scope.calTotal(args);
                        },
                        width: 150
                    }, {
                        field: 'price',
                        headerName: '销售价格',
                        editable:function(args) {
                           return editable(args)
                        },
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue)
                                return;
                            $scope.calTotal(args);
                        },
                        type:"金额",
                        width: 150
                    }, {
                        field: 'amount',
                        headerName: '金额',
                        editable: false,
                        cellStyle:{'text_align':'center'},
                        type:"金额"
                    } ,{
                        field: 'canuse_qty',
                        headerName: '可用库存',
                        type:'数量',
                        editable: false,
                        width: 200
                    },{
                        field: 'note',
                        headerName: '备注',
                        editable:function(args) {
                            return  editable(args)
                        },
                        width: 300
                    }
                    ]
                };
                /*----------------------------------通用查询-------------------------------------------*/
                //查询所属区域
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_id = result.orgid;
                        $scope.data.currItem.org_name = result.orgname;
                        $scope.data.currItem.fix_org_id = undefined;
                        $scope.data.currItem.fix_org_code = undefined;
                        $scope.data.currItem.fix_org_name = undefined;
                    }
                };
                //查询网点
                $scope.commonSearchOfFixOrg = {
                    beforeOpen: function () {
                        if($scope.data.currItem.org_code)
                            $scope.commonSearchOfFixOrg.postData =
                                {org_code: $scope.data.currItem.org_code}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_id = result.fix_org_id;
                        $scope.data.currItem.fix_org_code = result.fix_org_code;
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                        $scope.data.currItem.org_code = result.belong_org_code;
                        $scope.data.currItem.org_id = result.belong_org_id;
                        $scope.data.currItem.org_name = result.belong_org_name;
                        $scope.commonSearchOfFixOrg.postData=null;
                    }
                };
                //查询 仓库 warehouse_property=7  正品仓
                $scope.commonSearchOfWareHouse = {

                    beforeOpen: function () {
                        if($scope.data.currItem.fix_org_id)
                             $scope.commonSearchOfWareHouse.postData =
                                {
                                    search_flag: 18,
                                    fix_org_id: $scope.data.currItem.fix_org_id,
                                    warehouse_property:7
                                };
                                else{
                            swalApi.info('请先选择网点');
                            return false;
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_name = result.warehouse_name;
                    }
                };
                //查询 配件
                $scope.search_itemsale = function (args) {
                    $modal.openCommonSearch({
                        classId: 'css_item',
                        postData: {
                            flag: 20,//查询可用的配件信息
                            usable: 2
                        },
                        action: 'search',
                        title: "产品信息",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "配件编码",
                                    field: "css_item_code"
                                }, {
                                    headerName: "配件名称",
                                    field: "css_item_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            args.data.item_id = result.css_item_id;
                            args.data.item_code = result.css_item_code;
                            args.data.item_name = result.css_item_name;
                            args.api.refreshView();
                        }).then(function () {
                            requestApi.post({
                            classId: 'css_inventory',
                            action: 'search',
                            data: {
                                searchflag: 2,//配件库存  过滤条件 出库仓库
                                item_id:  args.data.item_id ,
                                warehouse_id:$scope.data.currItem.warehouse_id
                            }
                        }).then(function (response) {
                            args.data.canuse_qty = response.inv_qty;
                            args.api.refreshView();
                        });
                    });
                };

                /*----------------------------------计算逻辑开始-------------------------------------------*/
                /**
                 * 计算总额
                 */
                $scope.calTotal = function (args) {
                    if(args) {
                        args.data.amount = args.data.qty * args.data.price;
                    }
                    //发放总数量
                    $scope.data.currItem.total_qty
                        = numberApi.sum(getCurrentitems(), 'qty');
                    //发放总金额
                    $scope.data.currItem.total_amount
                        =numberApi.sum(getCurrentitems(), 'amount');

                    $scope.gridOptions_itemsale.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty: numberApi.sum(getCurrentitems(), 'qty'),
                            amount:numberApi.sum(getCurrentitems(), 'amount')
                        }
                    ]);
                    if(args)
                        args.api.refreshView();
                };
                /*----------------------------------计算逻辑结束-------------------------------------------*/

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //添加详情信息
                    bizData.css_itemsale_lineofcss_itemsale_headers = [];
                    $scope.gridOptions_itemsale.hcApi.setRowData(bizData.css_itemsale_lineofcss_itemsale_headers);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_itemsale.hcApi.setRowData(bizData.css_itemsale_lineofcss_itemsale_headers);
                    $scope.calTotal();
                };
                /**
                 * 保存之前
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };
                function getCurrentitems(){
                    return $scope.data.currItem.css_itemsale_lineofcss_itemsale_headers;
                }
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.add_itemSale && $scope.add_itemSale();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.del_itemSale && $scope.del_itemSale();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };

                $scope.footerRightButtons.save.hide=function(){
                    return  $scope.data.currItem.stat > 1;
                };
                $scope.footerRightButtons.saveThenSubmit.hide=function(){
                    return !$scope.data.currItem.stat > 1;
                };
                $scope.footerRightButtons.saveThenAdd.hide=function(){
                    return !$scope.data.currItem.stat >1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //增加配件信息
                $scope.add_itemSale = function () {
                    $scope.gridOptions_itemsale.api.stopEditing();
                    var data = getCurrentitems();
                    data.push({});
                    $scope.gridOptions_itemsale.hcApi.setRowData(data);
                };
                //删除配件信息
                $scope.del_itemSale = function () {
                    var idx = $scope.gridOptions_itemsale.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrentitems().splice(idx, 1);
                        $scope.gridOptions_itemsale.hcApi.setRowData(getCurrentitems());
                    }
                };
                /*----------------------------------顶部按钮-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.extra = {
                    title: '其他'
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: itemSale
        });

    });