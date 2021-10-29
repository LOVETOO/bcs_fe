/**
 * 采购价格-列表页
 *  * 2018-11-26 zhl
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi', 'numberApi'], defineFn);
})(function (module, controllerApi, base_edit_list, swalApi, requestApi, numberApi) {
    //声明依赖注入
    PurPriceEditList.$inject = ['$scope'];
    function PurPriceEditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号',
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
                width: 100
            }, {
                field: 'price_status',
                headerName: '状态',
                hcDictCode: "price_status"
            }, {
                field: 'vendor_code',
                headerName: '供应商编码'
            }, {
                field: 'vendor_name',
                headerName: '供应商名称'
            }, {
                field: 'item_code',
                headerName: '产品编码'
            }, {
                field: 'item_name',
                headerName: '产品名称'
            }, {
                field: 'price_tax',
                headerName: '含税价',
                type: '金额'
            }, {
                field: 'price_notax',
                headerName: '未税价',
                type: '金额'
            }, {
                field: 'price_type',
                headerName: '采购价格类型',
                hcDictCode: 'price_type'
            }, {
                field: 'start_date',
                headerName: '开始日期',
                type: '日期'
            }, {
                field: 'end_date',
                headerName: '结束日期',
                type: '日期'
            }, {
                field: 'qty_start',
                headerName: '开始数量',
                type: '数量'
            }, {
                field: 'qty_end',
                headerName: '结束数量',
                type: '数量'
            }, {
                field: 'created_by',
                headerName: '创建人'
            }, {
                field: 'creation_date',
                headerName: '创建时间'/*,
                 type: '日期'*/
            }, {
                field: 'remark',
                headerName: '备注'
            }]
        };

        function getCurrItem() {
            return $scope.data.currItem;
        }

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------通用查询开始------------------------*/

        //查供应商
        $scope.commonSearchSettingOfVendor = {
            sqlWhere: ' usable = 2',
            afterOk: function (result) {
                getCurrItem().vendor_id = result.vendor_id;
                getCurrItem().vendor_code = result.vendor_code;
                getCurrItem().vendor_name = result.vendor_name;
                getCurrItem().vendortaxrate_percent = result.vendortaxrate_percent;

                $scope.calculatePriceTax("price_tax");

            }
        };

        //查产品
        $scope.commonSearchSettingOfItem = {
            sqlWhere: ' item_usable = 2',
            afterOk: function (result) {
                getCurrItem().item_id = result.item_id;
                getCurrItem().item_code = result.item_code;
                getCurrItem().item_name = result.item_name;
            }
        };

        /*-------------------通用查询结束------------------------*/

        /*-------------------计算 开始------------------------*/
        /**
         *含税价=未税价*（1+税率）
         *未税价 = 含税价 除以 (1+税率)
         * @param type 计算 含税价(price_tax)/未税价(price_notax)
         */
        $scope.calculatePriceTax = function (type) {
            //如果“含税价”、“未税价”都没有声明，返回(选供应商前没输入)
            if (!getCurrItem().price_tax && !getCurrItem().price_notax)
                return;

            var rate = parseFloat(getCurrItem().vendortaxrate_percent) + 1;//（1+税率）

            //求含税价
            if (type == "price_tax") {
                getCurrItem().price_tax = numberApi.mutiply(getCurrItem().price_notax, rate);
            }

            //求未税价
            if (type == "price_notax") {
                getCurrItem().price_notax = numberApi.divide(getCurrItem().price_tax, rate).toFixed(2);
            }

        }

        /*-------------------计算 结束------------------------*/

        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            //console.log(bizData);
            bizData.start_date = bizData.start_date.substring(0, 10);
            bizData.end_date = bizData.end_date.substring(0, 10);
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            //bizData.creation_date = '';

            var date = new Date();

            bizData.start_date = date.Format('yyyy-MM-dd');//“开始日期”默认当天

            var original_end_date = new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate() + 365);//当天一年后的日期(未格式化)
            var year, month, day;
            year = original_end_date.getFullYear();//年
            month = original_end_date.getMonth() + 1;//月
            if (month <= 9)
                month = '0' + month;//个位补0
            day = original_end_date.getDate();//日
            if (day <= 9)
                day = '0' + day;//个位补0

            bizData.end_date = year + '-' + month + '-' + day + ' ';

            bizData.price_type = 1;//“采购价格类型”默认为“常规价”

        }

        $scope.toolButtons.cancel = {
            title: '作废',
            icon: 'glyphicon glyphicon-ban-circle',
            click: function () {
                $scope.cancel && $scope.cancel();
            }
        }

        //关闭
        $scope.cancel = function () {
            // 获取选中的行的数据
            var settleRow = $scope.gridOptions.api.getSelectedRows();
            // 获取选中的行的节点（包括行索引）
            var selectNodes = $scope.gridOptions.api.getSelectedNodes();

            if (settleRow.length == 0) {
                return swalApi.info("请选择要作废的价格!");
            }

            //需要检查的行
            var checkRow = [];

            //检查是否勾选了'已作废'的行
            for (var i = 0; i < settleRow.length; i++) {
                if (settleRow[i].price_status == 3) {
                    var rowNumber = selectNodes[i].rowIndex + 1;

                    checkRow.push(rowNumber);
                }
            }

            if (checkRow.length > 0)
                return swalApi.info("'已作废'的数据不能再次操作，请取消勾选以下行：[" + checkRow + "]");

            return swalApi.confirmThenSuccess({
                title: "确定要作废吗?",
                okFun: function () {
                    //函数区域
                    requestApi.post("srm_purchase_price", "cancel", {
                        srm_purchase_prices: settleRow
                    }).then(function (data) {
                        $scope.gridOptions.hcApi.search();
                    });
                },
                okTitle: '作废成功'
            });
        }

    }

    controllerApi.controller({
        module: module,
        controller: PurPriceEditList
    });
});

