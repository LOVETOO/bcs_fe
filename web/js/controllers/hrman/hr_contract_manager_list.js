/**
 * 员工异动申请 hr_position_employee_change_list
 * Created by ljb on 2019/4/18.
 */
(function (defineFn) {
    define(['module','controllerApi', 'swalApi' ,'base_obj_list'],defineFn);
})(function(module, controllerApi, swalApi, base_obj_list){

    ObjList.$inject = ['$scope'];
    function ObjList($scope) {

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'

            },{
                field: 'employee_code',
                headerName: '人员编码'
            },{
                field: 'employee_name',
                headerName: '人员名称'
            },{
                field: 'org_name',
                headerName: '所属部门'
            },{
                field: 'position_name',
                headerName: '职位'
            },{
                field: 'stat',
                headerName: '员工状态',
                hcDictCode:"emp_stat"
            },{
                field: 'contract_no',
                headerName: '合同编码'
            },{
                field: 'contract_type',
                headerName: '合同类型',
                hcDictCode:"contract_type"
            },{
                field: 'contract_stat',
                headerName: '合同状态',
                hcDictCode:"contract_stat"
            },{
                field: 'sign_date',
                headerName: '签定时间',
                type:'日期'
            },{
                field: 'start_date',
                headerName: '生效时间',
                type:'日期'
            },{
                field: 'contract_years',
                headerName: '合同期限'
            },{
                field: 'end_date',
                headerName: '结束日期',
                type:'日期'
            },{
                field: 'realyend_date',
                headerName: '实际结束日期',
                type:'日期'
            },{
                field: 'sign_partya',
                headerName: '签订甲方'
            },{
                field: 'sign_address',
                headerName: '签订地址'
            },{
                field: 'change_remark',
                headerName: '备注说明'
            },{
                field: 'change_reason',
                headerName: '变更原因'
            }],
            hcPostData: {
                flag:190430
            }

        };


        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
        //隐藏按钮
        (function (buttonIds) {
            buttonIds.forEach(function (buttonId) {
                $scope.toolButtons[buttonId].hide = true;
            });
        })([
            'delete',
            'add',
            'openProp',
            'refresh'
        ]);

        //按钮注册
        $scope.toolButtons.终止= {
            groupId: 'base',
            title: '终止',
            icon: 'iconfont',
            click: function () {
                var stat=$scope.gridOptions.hcApi.getFocusedData().contract_stat;
                if(stat==3||stat==4||stat==5){
                    swalApi.info('该合同状态不支持修改');
                    return;
                }
                $scope.flag=3;
                return $scope.openProp && $scope.openProp();
            }
        }
        //按钮注册
        $scope.toolButtons.解除= {
            groupId: 'base',
            title: '解除',
            icon: 'iconfont',
            click: function () {
                var stat=$scope.gridOptions.hcApi.getFocusedData().contract_stat;
                if(stat==3||stat==4||stat==5){
                    swalApi.info('该合同状态不支持修改');
                    return;
                }
                $scope.flag=2;
                return $scope.openProp && $scope.openProp();
            }
        }
        //按钮注册
        $scope.toolButtons.续签= {
            groupId: 'base',
            title: '续签',
            icon: 'iconfont',
            click: function () {
                var stat=$scope.gridOptions.hcApi.getFocusedData().contract_stat;
                if(stat==3||stat==4||stat==5){
                    swalApi.info('该合同状态不支持修改');
                    return;
                }
                $scope.flag=1;
                return $scope.openProp && $scope.openProp();
            }
        }
        //按钮注册
        $scope.toolButtons.修改= {
            groupId: 'base',
            title: '修改',
            icon: 'iconfont',
            click: function () {
                var stat=$scope.gridOptions.hcApi.getFocusedData().contract_stat;
                if(stat==3||stat==4||stat==5){
                    swalApi.info('该合同状态不支持修改');
                    return;
                }
                $scope.flag=0;
                return $scope.openProp && $scope.openProp();
            }
        }
        //传递参数到属性页
        $scope.getPropRouterParams = function (args) {
                return {
                        div_show: $scope.flag,
                        clear:delete $scope.flag
                };
        };

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: ObjList
    });

});