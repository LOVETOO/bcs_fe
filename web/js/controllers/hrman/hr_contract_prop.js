(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop',  'swalApi',   'dateApi'], defineFn)
})(function (module, controllerApi, base_obj_prop,  swalApi,   dateApi) {

    HrContractProp.$inject = ['$scope', '$stateParams'];

    function HrContractProp($scope, $stateParams) {
        /*----------------------------------数据定义-------------------------------------------*/
        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /*----------------------------------动态关联数据-------------------------------------------*/
        //动态带出结束日期
        $scope.changeDate=function(){
            var sy=new Date($scope.data.currItem.start_date);
            var ys=$scope.data.currItem.contract_years;
            var ey=new Date(sy);
            var str=/^[0-9]*$/ ;
            if(ys<0||!str.test(ys)){
                swalApi.info('期限输入有误，请重新填写');
                $scope.data.currItem.contract_years=0;
                delete $scope.data.currItem.end_date;
                return
            }else {
                $scope.data.currItem.end_date = ey.setFullYear(sy.getFullYear() + parseInt(ys));
                $scope.data.currItem.end_date = ey.setDate(sy.getDate() - 1);
            }
        };
        //动态带出期限
        $scope.changeYears=function(){
            var sy=new Date($scope.data.currItem.start_date);
            var ey=new Date($scope.data.currItem.end_date);
            if((ey.getFullYear()-sy.getFullYear())<0){
                swalApi.info('结束日期有误，请重新选择');
                $scope.data.currItem.contract_years=0;
                delete $scope.data.currItem.end_date;
                return
            }else {
                $scope.data.currItem.contract_years = ey.getFullYear() - sy.getFullYear();
            }
        };

        /*----------------------------------保存前的验证-------------------------------------------*/


        //验证表头信息是否填完
        $scope.validHead = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            if($scope.data.currItem.try_day.isNaN()){
                invalidBox.push('试用期请填写数字');
            }
            return invalidBox;
        }


        /*----------------------------------标签定义-------------------------------------------*/

        $scope.tabs.base.title = '基本信息';
        /**
         * 新增时数据
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.employee_id = $stateParams.employee_id;
            $scope.data.currItem.employee_code=$stateParams.employee_code;
            $scope.data.currItem.employee_name=$stateParams.employee_name;
            $scope.data.currItem.dept_name=$stateParams.dept_name;
            $scope.data.currItem.position_name=$stateParams.position_name;
            $scope.data.currItem.stat=$stateParams.stat;
            $scope.data.currItem.contract_stat=1;
            $scope.data.currItem.contract_type=1;
            $scope.data.currItem.sign_partya=$stateParams.sign_partya;

            $scope.data.currItem.sign_date=dateApi.today();
            $scope.data.currItem.start_date=dateApi.today();
        };



        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            $scope.data.currItem.sign_date=dateApi.today();
            $scope.data.currItem.start_date=dateApi.today();

        };
        $scope.footerRightButtons['saveThenAdd'].hide = true;

    }
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrContractProp
    });

});