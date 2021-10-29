/**
 * 经销商资料(详情页)
 * @since 2018-08-02
 */
HczyCommon.mainModule().controller('customer_org_pro', function ($scope, $q, $timeout, Magic, BasemanService, AgGridService, $stateParams) {

    console.log('控制器开始：customer_org_pro');
    console.log('$scope = ');
    console.log($scope);

    $scope.userbean = userbean;
    $scope.data = {}
    $scope.data.currItem = {"objattachs": [], "customer_id": $stateParams.id};

    /**
     *系统词汇池
     */
    $scope.dictPool = {
        'business_property': {},
        'business_scope': {},
        'dealer_property': {},
        'stat': {},
        'grade_market': {},
        'position_class': {},
        'branch_form': {},
        'branch_property': {},
        'nvc_acreage_class': {},
        'decoration_plan': {},
        'branch_brand': {},
    }

    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictOption, dictCode) {
        BasemanService.RequestPostAjax('base_search', 'searchdict', {dictcode: dictCode})
            .then(function (dictHead) {
                if (!dictOption.isStr) {
                    dictHead.dicts.forEach(function (dict) {
                        dict.value = parseInt(dict.value);
                    });
                }
                $scope.dictPool[dictCode] = HczyCommon.stringPropToNum(dictHead.dicts);
                // if ($scope.getIndexByField('headerColumns', dictCode)) {
                //     $scope.headerColumns[$scope.getIndexByField('headerColumns', dictCode)].options = dictHead.dicts;
                //     $scope.headerGridView.setColumns($scope.headerColumns);
                // }
            });
    });


    /**------------------- -------------点击事件--------/
     */

    //删除明细
    function delLineData(o) {
        var flag = 0;//是否空行
        var idx = $scope.gooutOptions.api.getFocusedCell().rowIndex;

        var lines = $scope.gridGetData('gooutOptions');
        var agentid = lines[idx].agentid;
        var wftempid = lines[idx].wftempid;

        if (!agentid || !wftempid) {
            flag = 1;
        }

        if (flag == 1) {
            $scope.gridDelItem('gooutOptions');
        } else { //非空行先询问
            BasemanService.swalDelete("删除", "确定删除？", function (bool) {
                if (bool) {
                    $scope.gridDelItem('gooutOptions');
                } else {
                    return;
                }
            })
        }
    }

    $scope.delLineData = delLineData

    /**
     * 报销明细删除按钮
     * @param params
     * @returns {*}
     */
    function linebuttonRenderer(params) {
        this.button = $('<div class="btn-group"></div>');
        $button = $('<button class="btn btn-white btn-xs"  style="padding-top: 0px;padding-bottom: 0px">删除</button>');
        $button.on("click", $scope.delLineData);
        this.button.append($button);
        return this.button[0];
    }

    /**
     * 明细网格点击事件
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        isEdit = 0;
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }

    function save() {
        var action = "insert";
        if ($scope.data.currItem.customer_id > 0) {
            action = "update"
        }
        BasemanService.RequestPost("customer_org", action, $scope.data.currItem).then(
            function (value) {
                $scope.searchData();
                BasemanService.swalSuccess("成功", "保存成功!");
                $("#attributeModal").modal('hide');
                //重绘网格
            })
    }

    $scope.save = save;

    /** ------------------通用查询方法 -------------------**/
    /**
     * 查询运营中心
     */
    function searchDept() {
        $scope.FrmInfo = {
            title: "运营中心",
            thead: [{
                name: "运营中心编号",
                code: "dept_code"
            }, {
                name: "运营中心名称",
                code: "dept_name"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["dept_code", "dept_name", "manager"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.dept_id = result.dept_id
            $scope.data.currItem.dept_code = result.dept_code
            $scope.data.currItem.dept_name = result.dept_name
        });
    }

    /**
     * 选择地区
     */
    $scope.searchArea = searchArea;
    function searchArea(areatype) {
        var title ="";
        var superid = 0;
        if(4==areatype){
            superid = 1;
            title = "选择省份"
        }
        if(5==areatype){
            superid = $scope.data.currItem.province_id;
            title = "选择城市"
        }
        // if(6==areatype){
        //     superid = $scope.data.currItem.city_areaid;
        //     title = "选择区县"
        // }
        if(("undefined" == typeof(superid) || 0==superid) && 4!=areatype){
            BasemanService.swalWarning("提示", "请先选择上级地区");
            return;
        }
        BasemanService.chooseArea({
            scope: $scope,
            title:title,
            areatype:areatype,
            superid:superid,
            then: function (data) {
                if(4==areatype){
                    $scope.data.currItem.province_id = data.areaid;
                    $scope.data.currItem.province_code = data.areacode;
                    $scope.data.currItem.province_name = data.areaname;

                    $scope.data.currItem.city_id = 0;
                    $scope.data.currItem.city_code = "";
                    $scope.data.currItem.city_name = "";

                    $scope.data.currItem.county_id = 0;
                    $scope.data.currItem.county_code = "";
                    $scope.data.currItem.county_name = "";
                }
                if(5==areatype){
                    $scope.data.currItem.city_id = data.areaid;
                    $scope.data.currItem.city_code = data.areacode;
                    $scope.data.currItem.city_name = data.areaname;

                    $scope.data.currItem.county_id = 0;
                    $scope.data.currItem.county_code = "";
                    $scope.data.currItem.county_name = "";
                }
                // if(6==areatype){
                //     $scope.data.currItem.county_id = 0;
                //     $scope.data.currItem.county_code = "";
                //     $scope.data.currItem.county_name = "";
                // }
            }
        });
    }
    /** --------初始化数据 -------------------**/
    function init() {
        if ($scope.data.currItem.customer_id > 0) {
            BasemanService.RequestPost("customer_org", "select", $scope.data.currItem).then(
                function (result) {
                    $scope.data.currItem = result.customers
                })
        }else {

        }
    }

    $scope.init = init;


    /**-----------------流程实例化 ------------**/
    /**
     * 流程url
     * @param {} args
     */
    function wfSrc(args) {
        //默认值
        var urlParams = {
            wftempid: '',
            wfid: $scope.data.currItem.wfid,
            objtypeid: $scope.data.objtypeid,
            objid: $scope.data.currItem.sa_saleprice_head_id,
            submit: $scope.data.bSubmit
        }

        //传入值覆盖默认值
        if (angular.isObject(args))
            angular.extend(urlParams, args);

        //0转为""
        angular.forEach(urlParams, function (value, key, obj) {
            if (value == 0)
                obj[key] = '';
        });

        return '/web/index.jsp'
            + '?t=' + randomNum               //随机数，请求唯一标识，加上这个Google浏览器才会发出请求
            + '#/crmman/wfins'
            + '/' + urlParams.wftempid        //流程模板ID
            + '/' + urlParams.wfid            //流程实例ID
            + '/' + urlParams.objtypeid       //对象类型ID
            + '/' + urlParams.objid           //对象ID
            + '/' + (urlParams.submit ? 1 : 0) //是否提交流程
            + '?showmode=2';
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.sa_saleprice_head_id && $scope.data.currItem.sa_saleprice_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                var theSrc = wfSrc();
                var theElement = angular.element('#wfinspage');

                if (theElement.attr('src') !== theSrc) {
                    theElement.attr('src', theSrc);
                }

                /* if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
                } */
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        // var tabName = $(e.target).text();
        // if ('审批流程' == tabName) {
        /* var tabName = $(e.target).text();
		if ('流程' == tabName) { */
        if ($(e.target).is('#tab-wfins')) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
    }

    /**
     * 获取流程模版ID
     * @param objtypeid
     */
    $scope.getWfTempId = function (objtypeid) {
        var iWftempId = 0;
        var postData = {
            "objtypeid": objtypeid
        }
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                    for (var i = data.objwftempofobjconfs.length - 1; i > -1; i--) {
                        //条件过滤
                        if (data.objwftempofobjconfs[i].execcond != '') {
                            //用正则表达式替换变量
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }

                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = data.objwftempofobjconfs;
                        //弹出模态框供用户选择
                        $("#selectWfTempModal").modal();
                    } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                        $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                    }
                } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                    $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                }
            });
    }

    /**
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");

        angular
            .element('#wfinspage')
            .attr('src', wfSrc({
                wftempid: wftempid
            }));

        /* if ($scope.data.bSubmit) {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
        } */
        $scope.data.bSubmit = false;
    }

    /** ---------------------------------附件服务------------------ **/
    BasemanService.getPrintService($scope)


    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

})