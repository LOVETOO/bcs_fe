/**
 * Created by asus on 2019/4/20.
 */
(function(defineFn){
    define(['module','controllerApi','base_edit_list','numberApi','requestApi'],defineFn);
})(function(module,controllerApi,base_edit_list,numberApi,requestApi){
    HrPersontaxRate.$inject=['$scope'];
    function HrPersontaxRate($scope){
        $scope.gridOptions={
            columnDefs:[{
                type:'序号'
            },{
                field:'money_bottom_line',
                headerName:'应缴纳税额下限',
                type:'金额'
            },{
                field:'money_top_line',
                headerName:'应缴纳税额上限',
                type:'金额'
            },{
                field:'tax_rate',
                headerName:'税率',
                type:'百分比'
            },{
                field:'quick_deduction',
                headerName:'速算扣除数',
                type:'金额'
            },{
                field:'start_month',
                headerName:'生效年月',
                type:'年月'
            }]
        };

        controllerApi.extend({
            controller:base_edit_list.controller,
            scope:$scope
        });
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            var timeStr=new Date();
            var year = timeStr.getFullYear();
            var month = timeStr.getMonth()+1;
            if(month<10){
                month="0"+month;
            }
            bizData.start_month=year+"-"+month;
            get_money_bottom_line(bizData).then(function(val){
                bizData.money_bottom_line=val;
            });

        };

        function get_money_bottom_line(bizData) {
            return requestApi.post({
                    classId: 'hr_persontax_rate',
                    action: 'select',
                    data: {sqlwhere:110}
                })
                .then(function ( response ) {
                    return  response.attribute1;
                })
        };

        //验证表头信息是否填完
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            if($scope.data.currItem.money_bottom_line>$scope.data.currItem.money_top_line){
                invalidBox.push('应缴纳税额上限要大于下限');
            }
            return invalidBox;
        }
    }

    return controllerApi.controller({
        module:module,
        controller:HrPersontaxRate
    });

});