/**
 *流程单据审核定义公共类
 *
 */

/**
 * 单据审核流程过程权限定义
 * @type {*[]}
 */
var auditDef = [
    // {
    //     "objtypeid": 180124,//预算审核
    //     "wftemps": [{
    //         "wftempid": 410,
    //         "procids": "2,3,"
    //     }],
    //     "controller": FeeApplyAuditController,
    //     "templete": "views/finman/fin_fee_apply_audit.html"
    // },
   {
        "objtypeid": 1280,//费用申请
        "wftemps": [{
            "wftempid": "*",
            "procids": "*"
        }],
        "controller": FeeApplyAuditController,
        "templete": "views/finman/fin_fee_apply_audit.html"
    },
    {
        "objtypeid": 1238,//费用报销
        "wftemps": [{
            "wftempid": "*",
            "procids": "*"
        }],
        "controller": FeeBxAuditController,
        "templete": "views/finman/fin_fee_bx_audit.html"
    }
    // ,
    // {
    //     "objtypeid": 180427,//工程特价申请
    //     "wftemps": [{
    //         "wftempid": "*",
    //         "procids": "2,3,4,5"
    //     }],
    //     "controller": MktLoanController,
    //     "templete": "views/finman/mkt_loan_audit.html"
    // }

];


/**
 * 单据流程修改定义检查
 * @param data
 * @returns {boolean}
 */
function doBillAuditDefCheck(data) {
    var result = null;
    //当前流程实例和过程不为空则进行权限判断
    if (data.currItem && data.currProc && auditDef.length > 0) {
        for (var i = 0; i < auditDef.length; i++) {
            //首选判断对象定义
            if (auditDef[i].objtypeid == data.objtypeid) {
                for (var j = 0; j < auditDef[i].wftemps.length; j++) {
                    //对象有定义再检查流程模版和过程是否有定义
                     if (((auditDef[i].wftemps[j].wftempid == data.currItem.wftempid) || (auditDef[i].wftemps[j].wftempid == "*")) &&
                        (auditDef[i].wftemps[j].procids.indexOf(data.currProc.procid + ",") > -1
                            || auditDef[i].wftemps[j].procids == "*")) {
                        result = auditDef[i];
                    }
                }
                //找到权限则退出循环
                if (!result) {
                    break;
                }
            }
        }
    }
    return result;
}

/**
 * 费用申请流程审核控制器
 * @param $scope
 * @param $modalInstance 模态窗体实例
 * @param BaseService
 * @param $timeout
 * @constructor
 */
function FeeApplyAuditController($scope, $modalInstance, BasemanService, $timeout) {
    $scope.data.bizObj = {};
    FeeApplyAuditController = HczyCommon.extend(FeeApplyAuditController, BasePopController);
    FeeApplyAuditController.__super__.constructor.apply(this, arguments);

    //明细表网格设置
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        rowHeight: 30
    };

    //明细表网格列属性
    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 100
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 100
        }, {
            name: "申请金额",
            id: "apply_amt",
            field: "apply_amt",
            width: 100
        }, {
            name: "批准金额",
            id: "allow_amt",
            field: "allow_amt",
            width: 100,
            editor: Slick.Editors.Number//可编辑
        }, {
            name: "备注",
            id: "note",
            field: "note",
            width: 100,
            editor: Slick.Editors.Text
        }
    ];

    /**
     * 弹窗确认响应事件
     */
    $scope.ok = function () {
        //先触发保存
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if ($scope.data.bizObj.total_allow_amt == 0) {
            BasemanService.notice("请填写批准金额！", "alert-warning");//warning
        } else if ($scope.data.bizObj.total_allow_amt > $scope.data.bizObj.total_apply_amt) {
            BasemanService.notice("批准金额不能大于申请金额！", "alert-warning");//warning
            return false;
        } else {
            //调用后台select方法查询详情
            BasemanService.RequestPost("fin_fee_apply_header", "update", JSON.stringify($scope.data.bizObj))
                .then(function (data) {
                    $modalInstance.close($scope.item);
                });
        }
    };

    /**
     * 弹窗取消按钮响应事件
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    /**
     * 网格改变事件
     */
    $scope.onCellChange = function () {
        //先触发保存
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        HczyCommon.stringPropToNum($scope.data.bizObj);
        $scope.data.bizObj.total_allow_amt = 0;
        for (var i = 0; i < $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers.length; i++) {
            $scope.data.bizObj.total_allow_amt += $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].allow_amt;
            // if ($scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].allow_amt > $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].apply_amt) {
            //     BasemanService.notice("批准金额不能大于申请金额！", "alert-warning");//warning
            //     break;
            // }
        }
    }
    /**
     * 数据初始化
     */
    $scope.search = function () {
        var postData = {"fee_apply_id": $scope.$parent.data.objid};
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_fee_apply_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);

                $scope.data.bizObj = data;

                //如果批准金额为0或者空则默认为申请金额
                if (!$scope.data.bizObj.total_allow_amt || $scope.data.bizObj.total_allow_amt == 0) {
                    $scope.data.bizObj.total_allow_amt = $scope.data.bizObj.total_apply_amt;
                }

                for (var i = 0; i < $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers.length; i++) {
                    //如果批准金额为0或者空则默认为申请金额
                    if (!$scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].allow_amt || $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].allow_amt == 0) {
                        $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].allow_amt = $scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers[i].apply_amt;
                    }
                }
                //绑定事件
                $scope.lineGridView.onCellChange.subscribe($scope.onCellChange);
                $scope.lineGridView.setData([]);

                if ($scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers) {
                    $scope.lineGridView.setData($scope.data.bizObj.fin_fee_apply_lineoffin_fee_apply_headers);
                }
                $scope.lineGridView.render();

            });
    }

    $scope.search();
}

/**
 * 费用报销审核控制器类
 * @param $scope
 * @param $modalInstance
 * @param BasemanService
 * @param $timeout
 * @constructor
 */
function FeeBxAuditController($scope, $modalInstance, BasemanService, $timeout) {
    $scope.data.bizObj = {};
    FeeBxAuditController = HczyCommon.extend(FeeBxAuditController, BasePopController);
    FeeBxAuditController.__super__.constructor.apply(this, arguments);

    //明细表网格设置
    $scope.lineOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        rowHeight: 30
    };

    $scope.lineColumns = [
        {
            name: "费用承担部门",
            id: "fee_org_name",
            field: "fee_org_name",
            width: 180
        }, {
            name: "申请报销金额",
            id: "apply_bx_amt",
            field: "apply_bx_amt",
            width: 100
        }, {
            name: "批准报销金额",
            id: "allow_bx_amt",
            field: "allow_bx_amt",
            width: 100,
            editor: Slick.Editors.Number//可编辑
        },/* {
            name: "冲销金额",
            id: "cx_amt",
            field: "cx_amt",
            width: 100
        }*/
    ];

    /**
     * 弹窗确认响应事件
     */
    $scope.ok = function () {
        //先触发保存
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if ($scope.data.bizObj.total_allow_amt == 0) {
            BasemanService.notice("请填写批准金额！", "alert-warning");//warning
        } else if ($scope.data.bizObj.total_allow_amt > $scope.data.bizObj.total_apply_amt) {
            BasemanService.notice("批准金额不能大于申请金额！", "alert-warning");//warning
            return false;
        }
        else {
            //调用后台select方法查询详情
            BasemanService.RequestPost("fin_fee_bx_header", "update", JSON.stringify($scope.data.bizObj))
                .then(function (data) {
                    $modalInstance.close($scope.item);
                });
        }
    };

    /**
     * 弹窗取消按钮响应事件
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    /**
     * 网格改变事件
     */
    $scope.onCellChange = function () {
        //先触发保存
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        HczyCommon.stringPropToNum($scope.data.bizObj);
        $scope.data.bizObj.total_allow_amt = 0;
        for (var i = 0; i < $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
            $scope.data.bizObj.total_allow_amt += $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt;
            // if ($scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt > $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt) {
            //     BasemanService.notice("批准金额不能大于申请金额！", "alert-warning");//warning
            //     break;
            // }
        }
    }
    /**
     * 数据初始化
     */
    $scope.search = function () {
        var postData = {"bx_id": $scope.$parent.data.objid};
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_fee_bx_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);
                //绑定事件
                $scope.lineGridView.onCellChange.subscribe($scope.onCellChange);
                $scope.data.bizObj = data;

                //如果批准金额为0或者空则默认为申请金额
                if (!$scope.data.bizObj.total_allow_amt || $scope.data.bizObj.total_allow_amt == 0) {
                    $scope.data.bizObj.total_allow_amt = $scope.data.bizObj.total_apply_amt;
                }

                if ($scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers) {
                    for (var i = 0; i < $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers.length; i++) {
                        //如果批准金额为0或者空则默认为申请金额
                        if (!$scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt || $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt == 0) {
                            $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].allow_bx_amt = $scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers[i].apply_bx_amt;
                        }
                    }
                }

                $scope.lineGridView.setData([]);

                if ($scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers) {
                    $scope.lineGridView.setData($scope.data.bizObj.fin_fee_bx_lineoffin_fee_bx_headers);
                }
                $scope.lineGridView.render();
            });
    }

    $scope.search();
}

/**
 * 借款申请审核控制器类
 * @param $scope
 * @param $modalInstance
 * @param BasemanService
 * @param $timeout
 * @constructor
 */
function MktLoanController($scope, $modalInstance, BasemanService, $timeout) {
    $scope.data.bizObj = {};
    MktLoanController = HczyCommon.extend(MktLoanController, BasePopController);
    MktLoanController.__super__.constructor.apply(this, arguments);


    /**
     * 弹窗确认响应事件
     */
    $scope.ok = function () {
        //调用后台select方法查询详情
        BasemanService.RequestPost("sa_saleprice_head", "update", JSON.stringify($scope.data.bizObj))
            .then(function (data) {
                $modalInstance.close($scope.item);
            });

    };

    /**
     * 弹窗取消按钮响应事件
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.setAllowAmt = function () {
        if($scope.data.bizObj.allow_rebate>$scope.data.bizObj.apply_rebate){
            BasemanService.notice("审批返利点不能大于申请返利点","alert-success");
            $scope.data.bizObj.allow_rebate = $scope.data.bizObj.apply_rebate;
        }
        if($scope.data.bizObj.allow_rebate<0){
            BasemanService.notice("审批返利点不能小于0","alert-success");
            $scope.data.bizObj.allow_rebate = 0;
        }
        $scope.data.bizObj.allow_rebate_amt = $scope.data.bizObj.prj_contract_total * $scope.data.bizObj.allow_rebate/100;
    };

    /**
     * 数据初始化
     */
    $scope.search = function () {
        var postData = {"sa_saleprice_head_id": $scope.$parent.data.objid};
        //调用后台select方法查询详情
        BasemanService.RequestPost("sa_saleprice_head", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.bizObj = data;
            });
    }

    $scope.search();
}