(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'dateApi'], defineFn)
})(function (module, controllerApi, base_obj_prop, swalApi, dateApi) {

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
        $scope.changeDate = function () {

            if ($scope.div_show == 0) {
                var sy = new Date($scope.data.currItem.start_date);
                var ys = $scope.data.currItem.contract_years;
            } else if ($scope.div_show == 1) {
                var sy = new Date($scope.data.currItem.start_date1);
                var ys = $scope.data.contract_years;
            }

            var str = /^[0-9]*$/;
            if (ys < 0 || !str.test(ys)) {
                swalApi.info('期限有误，请重新填写');
                if ($scope.div_show == 0) {
                    $scope.data.currItem.contract_years = 0;
                    delete $scope.data.currItem.end_date;
                } else if ($scope.div_show == 1) {
                    $scope.data.contract_years = 0;
                    delete $scope.data.currItem.end_date1;
                }
                return
            } else {
                if ($scope.div_show == 0) {
                    // $scope.data.currItem.end_date=ey.setFullYear(parseInt(sy.getFullYear())+parseInt(ys));
                    $scope.data.currItem.end_date = sy.getFullYear() + parseInt(ys) + "-" + (sy.getMonth()+1) + "-" + (sy.getDate()-1);
                } else if ($scope.div_show == 1) {
                    $scope.data.currItem.end_date1 = sy.getFullYear() + parseInt(ys) + "-" + (sy.getMonth()+1) + "-" + (sy.getDate()-1);
                }
            }

        };
        //判断期限结束日期是否错
        $scope.showYears=function(){
            if ($scope.div_show == 0) {
                var st = new Date($scope.data.currItem.start_date)
                var sy = new Date(st.getFullYear()+"-"+parseInt(st.getMonth()+1)+"-"+st.getDate()).getTime();
                var et = new Date($scope.data.currItem.end_date);
                var ey = new Date(et.getFullYear()+"-"+parseInt(et.getMonth()+1)+"-"+et.getDate()).getTime();
            } else if ($scope.div_show == 1) {
                var st = new Date($scope.data.currItem.start_date1)
                var sy = new Date(st.getFullYear()+"-"+parseInt(st.getMonth()+1)+"-"+st.getDate()).getTime();
                var et = new Date($scope.data.currItem.end_date1);
                var ey = new Date(et.getFullYear()+"-"+parseInt(et.getMonth()+1)+"-"+et.getDate()).getTime();
            }
            if (!(ey - sy > 0)) {
                if ($scope.div_show == 0) {
                    $scope.data.currItem.contract_years ="错误结束日期"
                } else if ($scope.div_show == 1) {
                    $scope.data.contract_years ="错误结束日期"
                }
            }else{
                if ($scope.div_show == 0) {
                    if((ey - sy)%(365*24*60*60*1000)==0){
                        $scope.data.currItem.contract_years = parseInt((ey - sy)/365/24/60/60/1000);
                    }
                    $scope.data.currItem.contract_years =parseInt((ey - sy)/365/24/60/60/1000)+1;
                } else if ($scope.div_show == 1) {
                    if((ey - sy)%(365*24*60*60*1000)==0){
                        $scope.data.contract_years = parseInt((ey - sy)/365/24/60/60/1000);
                    }
                    $scope.data.contract_years =parseInt((ey - sy)/365/24/60/60/1000)+1;
                }
            }
        }




        /*----------------------------------保存前的验证-------------------------------------------*/


        //验证表头信息是否填完
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);

            if ($scope.div_show == 0) {
                var sy = new Date($scope.data.currItem.start_date);
                var ey = new Date($scope.data.currItem.end_date);
                if (ey.getTime() <= sy.getTime()) {
                    invalidBox.push("结束日期必须大于生效日期，请修改！");
                    return invalidBox;
                }
                if($scope.data.currItem.contract_years<1){
                    invalidBox.push("期限不能小于1，请修改！");
                    return invalidBox;
                }
            }

            if ($scope.div_show == 1) {
                var sy = new Date($scope.data.currItem.start_date1);
                var ey = new Date($scope.data.currItem.end_date1);
                if (ey.getTime() <= sy.getTime()) {
                    invalidBox.push("结束日期必须大于生效日期，请修改！");
                    return invalidBox;
                }
                if($scope.data.contract_years<1){
                    invalidBox.push("期限不能小于1，请修改！");
                    return invalidBox;
                }

            }
            return invalidBox;
        }


        /*----------------------------------标签定义-------------------------------------------*/

        $scope.tabs.base.title = '基本信息';
        $scope.flag_change = true;
        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            $scope.div_show = $stateParams.div_show;
            if ($scope.div_show != 0) {
                $scope.flag_change = false;
                if ($scope.div_show == 1) {
                    $scope.data.currItem.contract_stat = 5;
                    $scope.data.currItem.sign_date1 = dateApi.today();
                    var year = new Date($scope.data.currItem.end_date).getFullYear();
                    var month = new Date($scope.data.currItem.end_date).getMonth();
                    var date = new Date($scope.data.currItem.end_date).getDate();
                    $scope.data.currItem.start_date1 = year + "-0" + (month + 1) + "-" + (date + 1);
                }
                if ($scope.div_show == 2) {
                    $scope.data.currItem.contract_stat = 3;
                    $scope.data.currItem.end_date1 = dateApi.today();
                }
                if ($scope.div_show == 3) {
                    $scope.data.currItem.contract_stat = 4;
                    $scope.data.currItem.end_date1 = dateApi.today();
                }
            }


        };
        //隐藏按钮
        $scope.footerRightButtons['saveThenAdd'].hide = true;
        //根据业务逻辑调用不同方法


        $scope.doBeforeSave = function (postParams) {
            if ($scope.div_show == 1) {
                postParams.action = "continues";
                postParams.data.start_date = $scope.data.currItem.start_date1;
                postParams.data.contract_years = $scope.data.contract_years;
                postParams.data.end_date = $scope.data.currItem.end_date1;
                postParams.data.sign_date = $scope.data.currItem.sign_date1;
            } else if ($scope.div_show == 2) {
                postParams.action = "frees";
                postParams.data.end_date = $scope.data.currItem.end_date1
            } else if ($scope.div_show == 3) {
                postParams.action = "ends";
                postParams.data.end_date = $scope.data.currItem.end_date1
            } else {
                postParams.action = "changes";
            }
        };


    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrContractProp
    });

});