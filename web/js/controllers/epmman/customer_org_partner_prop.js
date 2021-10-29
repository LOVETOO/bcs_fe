/**
 * 合伙人档案
 *  2019/5/20.
 *  zengjinhua
 *  update:2019/7/5
 *  update_by:zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi) {


        var controller = [
            '$scope',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "基本详情"
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'partner_contacts',
                        headerName: '联系人',
                        width:96,
                        editable: true
                    }, {
                        field: 'partner_dept',
                        headerName: '部门',
                        width:100,
                        editable: true
                    }, {
                        field: 'partner_post',
                        headerName: '职位/称呼',
                        width:120,
                        editable: true
                    }, {
                        field: 'partner_tele',
                        headerName: '联系电话',
                        width:125,
                        editable: true
                    }
                    , {
                        field: 'partner_email',
                        headerName: '电子邮箱',
                        width:170,
                        editable: true
                    }], hcPostData: {
                        search_flag: 121
                    }
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 查销售区域
                 */
                $scope.commonSearchOfScparea = {
                    postData: {
                        use_type: 2
                    },
                    sqlWhere:"isuseable = 2",
                    afterOk: function (result) {
                        $scope.data.currItem.areaid = result.sale_area_id;
                        $scope.data.currItem.areacode = result.sale_area_code;
                        $scope.data.currItem.areaname = result.sale_area_name;
                    }
                };

                /**
                 * 地址省市区 查询
                 */
                $scope.commonSearchSettingOfOrigin = {
                    title: '请选择省级行政区',
                    postData: {
                        areatype: 4
                    },
                    afterOk: function (res) {
                        $scope.data.currItem.province_name = res.areaname;//省名称
                        $scope.data.currItem.province_id = res.areaid;
                        $modal.openCommonSearch({
                            classId: 'scparea',
                            postData:{
                                areatype: 5,
                                superid : res.areaid
                            },
                            action: 'search',
                            title: '请选择市级行政区'
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.province_name += "-" + result.areaname;//拼接市名称
                                $scope.data.currItem.city_id = result.areaid;
                                return result.areaid
                            },function (line) {
                                if(line=="头部关闭"){//中途关闭查询则清空
                                    $scope.data.currItem.province_name = undefined;
                                    return -99;
                                }
                            }).then(function (id) {
                            if(id == -99){
                                return;
                            }
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                postData:{
                                    areatype: 6,
                                    superid : id
                                },
                                action: 'search',
                                title: '请选择区级行政区'
                            }).result//响应数据
                                .then(function (results) {
                                    $scope.data.currItem.province_name += "-" + results.areaname;//区名称
                                    $scope.data.currItem.district_id = results.areaid;
                                },function (line) {
                                    if(line=="头部关闭"){
                                        $scope.data.currItem.province_name = undefined;
                                    }
                                })
                        });


                    }
                };

                /**
                 * 所属部门查询
                 */
                $scope.commonSelectrefOfDept = {
                    title : '所属部门',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "部门编码",
                                field: "code"
                            },{
                                headerName: "部门名称",
                                field: "orgname"
                            }
                        ]
                    },
                    sqlWhere : ' is_contract_unit <> 2 ',
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.orgid;
                        $scope.data.currItem.dept_name = result.orgname;
                    }
                };

                /**
                 * 查业务员
                 */
                $scope.commonSearchSettingOfSaleEmployee = {
                    sqlWhere: "actived = 2",
                    afterOk: function (result) {
                        $scope.data.currItem.sale_employee_id = result.sysuserid;
                        $scope.data.currItem.employee_partner_name = result.username;
                    }
                };
                /*----------------------------------------计算方法定义-------------------------------------------*/

                /**
                 * 折扣率校验
                 */
                $scope.changeDiscount = function () {
                    if($scope.data.currItem.discount_rate!=undefined && $scope.data.currItem.discount_rate!=null){
                        if(numberApi.isNum(Number($scope.data.currItem.discount_rate))){
                            if($scope.data.currItem.discount_rate <= 0){
                                $scope.data.currItem.discount_rate=undefined;
                                swalApi.info('请输入大于0的数字');
                            }
                        }else{
                            $scope.data.currItem.discount_rate=undefined;
                            swalApi.info('输入的不是数字，请重新输入');
                        }
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.customer_org_partners = [];
                    bizData.usable = 2;
                };

                /**
                 * 保存前的数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.customer_kind = 2;//合伙人默认为2
                    bizData.base_currency_id = 1;
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置基本经历
                    $scope.gridOptions.hcApi.setRowData(bizData.customer_org_partners);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.base.active) {
                        $scope.addLine && $scope.addLine();
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return !$scope.tabs.base.active;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.base.active) {
                        $scope.delLine && $scope.delLine();
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return !$scope.tabs.base.active;
                };

                /*----------------------------------按钮方法 定义-------------------------------------------*/

                /**
                 * 添加联系人
                 */
                $scope.addLine = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.customer_org_partners.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.customer_org_partners);
                };
                /**
                 * 删除行联系人
                 */
                $scope.delLine = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_org_partners.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.customer_org_partners);
                    }
                };

            }
        ];
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });

});