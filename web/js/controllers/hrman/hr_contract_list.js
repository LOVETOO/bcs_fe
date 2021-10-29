(function (defineFn) {
    define(['module','controllerApi','base_obj_list'],defineFn);
})(function(module, controllerApi, base_obj_list){

    ObjList.$inject = ['$scope'];
    function ObjList($scope) {

        function getCurrItem() {
            return $scope.data.currItem;
        }

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            },  {
                field: 'employee_code',
                headerName: '员工编码'
            }, {
                field: 'employee_name',
                headerName: '员工名称',
            }, {
                field: 'org_name',
                headerName: '所属部门',
            }, {
                field: 'position_name',
                headerName: '职位'
            }, {
                field: 'stat',
                headerName: '员工状态',
                hcDictCode:'emp_stat'
            }],
            hcPostData: {
                flag:190505
            },
            hcDataRelationName: 'employee_headerofhr_contract'

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
            'openProp'
        ]);
        //按钮注册
        $scope.toolButtons.sign={
            groupId: 'base',
            title: '签合同',
            icon: 'iconfont hc-add',
            click: function () {
                return $scope.add && $scope.add();
            }
        };
        //传递参数到属性页
        $scope.getPropRouterParams = function (args) {
            return {
                sign_partya:args.data.sign_partya,
                employee_id: args.data.employee_id,
                employee_name: args.data.employee_name,
                employee_code: args.data.employee_code,
                position_name: args.data.position_name,
                dept_name: args.data.org_name,
                stat: args.data.stat
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