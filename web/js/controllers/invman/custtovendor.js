/**
 * 采销关系设置
 *  * 2018-11-26 zhl
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi'], defineFn);
})(function (module, controllerApi, base_edit_list, swalApi, requestApi) {
    //声明依赖注入
    custtovendor.$inject = ['$scope', '$modal'];
    function custtovendor($scope, $modal) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'dentname',
                headerName: '采购单位账套'
            }, {
                field: 'vendor_code',
                headerName: '供应商编码'
            }, {
                field: 'vendor_name',
                headerName: '供应商名称'
            }, {
                field: 'sentname',
                headerName: '供货单位账套'
            }, {
                field: 'customer_code',
                headerName: '客户编码'
            }, {
                field: 'customer_name',
                headerName: '客户名称'
            }]
        };


        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------通用查询开始------------------------*/

        //查供应商
        $scope.chooseVendor = function () {
            $modal.openCommonSearch({
                    classId: 'base_view_vendor_org',
                    postData: {
                        search_flag: 110,
                        organization_id: $scope.data.currItem.dentid
                    },
                    action: 'search',
                    title: "供应商",
                    gridOptions: {
                        columnDefs: [{
                            headerName: "供应商编码",
                            field: "vendor_code"
                        }, {
                            headerName: "供应商名称",
                            field: "vendor_name"
                        }]
                    }
                })
                .result//响应数据
                .then(function (result) {
                    $scope.data.currItem.vendor_id = result.vendor_id;
                    $scope.data.currItem.vendor_code = result.vendor_code;
                    $scope.data.currItem.vendor_name = result.vendor_name;
                    return true;
                });
        };

        /**
         * 查客户
         */
        $scope.chooseCustomer = function () {
            $modal.openCommonSearch({
                    classId: 'base_view_customer_org',
                    postData: {
                        search_flag: 111,
                        organization_id: $scope.data.currItem.sentid
                    },
                    action: 'search',
                    title: "客户资料",
                    gridOptions: {
                        columnDefs: [{
                            headerName: "编码",
                            field: "customer_code"
                        }, {
                            headerName: "名称",
                            field: "customer_name"
                        }]
                    }
                })
                .result//响应数据
                .then(function (response) {
                    $scope.data.currItem.customer_name = response.customer_name;
                    $scope.data.currItem.customer_code = response.customer_code;
                    $scope.data.currItem.customer_id = response.customer_id;
                });
        };

        /**
         * 查账套
         */
        $scope.chooseSent = function () {
            $modal.openCommonSearch({
                    classId: 'scpent',
                    title: "账套"
                })
                .result//响应数据
                .then(function (response) {
                    $scope.data.currItem.sentid = response.entid;
                    $scope.data.currItem.sentname = response.entname;
                    $scope.data.currItem.customer_name = undefined;
                    $scope.data.currItem.customer_code = undefined;
                    $scope.data.currItem.customer_id = undefined;
                });
        };

        /**
         * 查账套
         */
        $scope.chooseDent = function () {
            $modal.openCommonSearch({
                    classId: 'scpent',
                    title: "账套"
                })
                .result//响应数据
                .then(function (response) {
                    $scope.data.currItem.dentid = response.entid;
                    $scope.data.currItem.dentname = response.entname;
                    $scope.data.currItem.vendor_id = undefined;
                    $scope.data.currItem.vendor_code = undefined;
                    $scope.data.currItem.vendor_name = undefined;
                });
        };
        /*-------------------通用查询结束------------------------*/
        //保存验证
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            if ($scope.data.currItem.dentid == $scope.data.currItem.sentid) {
                invalidBox.push('采购单位账套和供货单位账套不能一致，请检查');
            }
            if ($scope.data.currItem.dentid == undefined ||
                $scope.data.currItem.vendor_id == undefined ||
                $scope.data.currItem.vendor_id == "" ||
                $scope.data.currItem.vendor_id == 0 ||
                $scope.data.currItem.dentid == 0 ||
                $scope.data.currItem.dentid == "") {
                return invalidBox;
            } else {
                return requestApi.post({
                        classId: 'custtovendor',
                        action: 'search',
                        data: {
                            sqlwhere: " dentid= " + $scope.data.currItem.dentid + " and cv.vendor_id = " + $scope.data.currItem.vendor_id
                        }
                    })
                    .then(function (response) {
                        if (response.custtovendors.length > 0) {
                            invalidBox.push("同一采购单位账套、供应商已存在，请检查");
                        }
                        /* if(response.employee_blacklists.length>0){
                         invalidBox.push("已加入特殊名单，不能再入职");
                         }*/
                    }).then(function () {
                        return invalidBox;
                    });
            }
        };


        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            seachEndid(bizData);
        };

        function seachEndid(bizData) {
            return requestApi.post({
                classId: 'scpent',
                action: 'search',
                data: {
                    sqlwhere: 'entid = ' + userbean.entid
                }
            }).then(function (data) {
                bizData.dentid = data.scpents[0].entid;
                bizData.dentname = data.scpents[0].entname;
            })
        }

        $scope.toolButtons.import.hide = true;

        $scope.toolButtons.downloadImportFormat.hide = true;


    }

    controllerApi.controller({
        module: module,
        controller: custtovendor
    });
});

