/**
 * zengjinhua
 * 2019/11/15
 * 交易公司基地财务
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', '$modal'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, $modal) {

    var controller=[
        '$scope',
        function ($scope){
            /**
             * 数据定义
             */
            $scope.data = {};
            $scope.data.currItem = {
                epm_base_financial_staffs:[]
            };

            /**
             * 定义表格
             */
            $scope.gridOptions={
                columnDefs:[{
                    type:'序号'
                },{
                    field:'division_id',
                    headerName:'事业部',
                    hcDictCode : 'epm.division',
                    width : 152,
                    suppressAutoSize: true,
                    suppressSizeToFit: true,
                    editable: function(){
                        return true;
                    }
                },{
                    field:'trading_company_code',
                    headerName:'交易公司编码',
                    onCellDoubleClicked: function (args) {
                        $scope.tradingCompany(args);
                    }
                },{
                    field:'trading_company_name',
                    headerName:'交易公司名称',
                    width : 400,
                    suppressAutoSize: true,
                    suppressSizeToFit: true,
                },{
                    field:'financial_staff_name',
                    headerName:'基地财务',
                    onCellDoubleClicked: function (args) {
                        $scope.financialStaff(args);
                    }
                }],hcAfterRequest:function(args){
                    $scope.data.currItem.epm_base_financial_staffs = args.epm_base_financial_staffs
                },
                hcRequestAction:'search',
                hcDataRelationName:'epm_base_financial_staffs',
				hcClassId:'epm_base_financial_staff'
            };

            controllerApi.extend({
                controller:base_diy_page.controller,
                scope:$scope
            });

            /**
             * 交易公司查询
             */
            $scope.tradingCompany = function (args) {
                $scope.gridOptions.api.stopEditing();
                return $modal
                    .openCommonSearch({
                        classId: 'epm_trading_company',
                        postData: {
                            search_flag : 3
                        }
                    })
                    .result
                    .then(function (data) {
                        args.data.trading_company_id = data.trading_company_id;
                        args.data.trading_company_code = data.trading_company_code;
                        args.data.trading_company_name = data.trading_company_name;
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['trading_company_code',
                                'trading_company_name'])
                        });//刷新网格视图
                    });
            };

            /**
             * 基地财务
             */
            $scope.financialStaff = function (args) {
                $scope.gridOptions.api.stopEditing();
                return $modal
                    .openCommonSearch({
                        title : "基地财务",
                        classId: 'scpuser',
                        sqlWhere : ' actived = 2 ',
                        postData: {}
                    })
                    .result
                    .then(function (data) {
                        args.data.financial_staff_id = data.userid;
                        args.data.financial_staff_name = data.username;
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['financial_staff_name'])
                        });//刷新网格视图
                    });
            };

            /**
             * 新增行
             */
            $scope.addTechnology = function(){
                $scope.gridOptions.api.stopEditing();
                $scope.data.currItem.epm_base_financial_staffs.push({});
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_base_financial_staffs);
                $scope.gridOptions.hcApi.setFocusedCell($scope.data.currItem.epm_base_financial_staffs.length-1);
            };

            /**
             * 删除行
             */
            $scope.delTechnology = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if (idx < 0) {
                    swalApi.info('请选中要删除的行');
                } else {
                    $scope.data.currItem.epm_base_financial_staffs.splice(idx, 1);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_base_financial_staffs);
                }
            };

            //添加按钮
            $scope.toolButtons = {
                save: {
                    title: '保存',
                    icon: 'iconfont hc-save',
                    click: function () {
                        $scope.save && $scope.save();
                    }
                },
                del: {
                    title: '删除',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        $scope.delTechnology && $scope.delTechnology();
                    }
                },
                add: {
                    title: '新增',
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.addTechnology && $scope.addTechnology();
                    }
                }
            };
            /**
             * 保存
             */
            $scope.save = function () {
                $scope.gridOptions.api.stopEditing();
                //定义一个参数
                var isPass = 1;
                //定义一个数据盒子
                var arr = [];
                var invalidDiv = [];
                var invalidTra = [];
                var invalidUser = [];
                $scope.data.currItem.epm_base_financial_staffs.forEach(function(val,index){
                    if(val.division_id==undefined||val.division_id==""||val.division_id==null){
                        invalidDiv.push(index + 1);
                    }
                    if(val.trading_company_code==undefined||val.trading_company_code==""||val.trading_company_code==null){
                        invalidTra.push(index + 1);
                    }
                    if(val.financial_staff_name==undefined||val.financial_staff_name==""||val.financial_staff_name==null){
                        invalidUser.push(index + 1);
                    }
                });
                //判断事业部
                if (invalidDiv.length) {
                    arr.push(
                        '',
                        '事业部不能为空，以下行不合法：',
                        '第' + invalidDiv.join('、') + '行'
                    );
                }
                //判断交易公司
                if (invalidTra.length) {
                    arr.push(
                        '',
                        '交易公司不能为空，以下行不合法：',
                        '第' + invalidTra.join('、') + '行'
                    );
                }
                //判断财务
                if (invalidUser.length) {
                    arr.push(
                        '',
                        '财务基地不能为空，以下行不合法：',
                        '第' + invalidUser.join('、') + '行'
                    );
                }
                //若盒子非空，验证不通过，弹框
                if (arr.length){
                    isPass = 0;
                    return swalApi.error(arr);
                }else{
                    //检验是否存在相同数据
                    var arrData = [];
                    $scope.data.currItem.epm_base_financial_staffs.forEach(function(val,idx){
                        $scope.data.currItem.epm_base_financial_staffs.forEach(function(value,index){
                            if(index > idx){
                                if(val.division_id == value.division_id 
                                    && val.financial_staff_id == value.financial_staff_id
                                    && val.trading_company_id == value.trading_company_id){
                                    arrData.push('第' + (idx + 1) + "行与" + (index + 1) + "存在相同的数据");
                                }
                            }
                        });
                    });
                    if(arrData.length){
                        isPass = 0;
                        return swalApi.error(arrData);
                    }
                }
                if(isPass == 1){//校验通过
                    //调用后台保存方法
                   return requestApi.post({
                        classId: 'epm_base_financial_staff',
                        action: 'save',
                        data: {
                            epm_base_financial_staffs: $scope.gridOptions.hcApi.getRowData()
                        }
                    }).then(function () {
                        return swalApi.success('保存成功!');
                    }).then($scope.serarch);
                }
            };
            /**
             * 保存按钮函数
             */
            $scope.serarch = function (){
                $scope.gridOptions.hcApi.search()
            };

        }
    ];

    return controllerApi.controller({
        module:module,
        controller:controller
    });

});