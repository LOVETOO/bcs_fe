/**
 * lodop打印api
 * @since 2019-03-05
 */
define(
    ['lodop', 'angular', '$q', '$timeout', '$modal', 'swalApi', 'requestApi'],
    function (lodop, angular, $q, $timeout, $modal, swalApi, requestApi) {
        function api(data) {
            this.data = data;
        }

        var templates = []; //所有模板
        var defaultTemplates = [];//设置了缺省的模板
        var printTemplate = {};//最后过滤出来的模板
        var data = {};
        var rows = [];
        var invalidInfoBox = [];
        var printType = 'single';//打印类型：single 单张打印 ； mutiply 多张连续打印

        api.doinit = function () {
            templates = []; //所有模板
            defaultTemplates = [];//设置了缺省的模板
            printTemplate = {};//最后过滤出来的模板
            data = {};
            rows = [];
            invalidInfoBox = [];
        }

        /**
         * 打开单据,单张打印
         * @param data  单据$scope.data
         */
        api.doSinglePrint = function (printdata) {
            api.doinit();
            printType = 'single';
            data = {
                currItem: angular.copy(printdata.currItem),
                objConf: printdata.objConf,
                classId: printdata.classId,
                idField: printdata.idField
            }

            $q.when(data.objConf.objrptconfofobjconfs.length > 0)
                .then(function () {

                    data.objConf.objrptconfofobjconfs.forEach(function (template, i) {
                        if (template.execcond != '' && getSexeccondResult(template.execcond)) {
                            templates.push(template);
                        }
                        if (parseInt(template.isdefault) == 2) {
                            defaultTemplates.push(template); //默认的
                        }
                    });

                    if (templates.length == 1) {//如果刚好匹配到一个
                        printTemplate = templates[0];
                        return true;
                    } else if (templates.length > 1 && defaultTemplates.length == 0) {//如果匹配到多个，且没有匹配到缺省的模板的条件
                        return false;
                    } else if (defaultTemplates.length > 0) {//如果没有匹配，但是有缺省
                        if (defaultTemplates.length == 1) {  //如果只有一个缺省,则取
                            printTemplate = defaultTemplates[0];
                            return false;
                        }

                        if (defaultTemplates.length > 1) {
                            templates = defaultTemplates;
                            return true;
                        }
                    }
                    return false;
                })
                .then(function (flag) {
                    if (!flag && (JSON.stringify(printTemplate) == '{}' || !printTemplate.tempurl)) {
                        invalidInfoBox.push("对不起，找不到匹配的打印模板路径,请检查对象里的打印模板配置");
                    }
                    if (flag) {
                        return selecttemplateSelectScope();//弹窗选择模板
                    }
                })
                .then(checkValid)
                .then(checkPassWord)
                // .then(function () {
                //     return getOpinions(data);
                // })
                .then(openPrintTempJs)
        }

        /**
         * 连续套打
         * @param printdata
         */
        api.doMultiplyPrint = function (printdata) {
            api.doinit();
            printType = 'mutiply';
            data = {
                objConf: printdata.objConf,
                classId: printdata.classId,
                idField: printdata.idField,
                rows: printdata.rows
            };
            rows = data.rows;

            templates = data.objConf.objrptconfofobjconfs;

            $q.when()
                .then(selecttemplateSelectScope) //弹窗选择模板
                .then(function (selectTemplate) {
                    printTemplate = selectTemplate;
                    var promises = [];//promise集合
                    rows.forEach(function (row) {
                        var postData = {
                            classId: data.classId,
                            action: 'select',
                            data: {}
                        };
                        postData.data[data.idField] = row.data[data.idField];
                        promises.push(requestApi.post(postData));//返回promise
                    })
                    $q.all(promises)//等所有的promise resolve之后执行then
                        .then(function (responses) {
                            if (JSON.stringify(printTemplate) == '{}' || !printTemplate.tempurl) {
                                invalidInfoBox.push("对不起，找不到匹配的打印模板路径,请检查对象里的打印模板配置");
                                return;
                            }
                            responses.forEach(function (response, i) {
                                data.rows[i] = response;
                                data.currItem = response;
                                if (printTemplate.execcond != '' && !getSexeccondResult(printTemplate.execcond)) {
                                    invalidInfoBox.push("所选第" + (i + 1) + "行的数据不符合打印模板条件,请检查");
                                }
                            })
                        })
                        .then(checkValid)
                        .then(checkPassWord)
                        .then(openPrintTempJs)
                })

        };

        /**
         * 打开打印模板js文件
         */
        function openPrintTempJs() {
            return require([printTemplate.tempurl, 'lodop'], function (printjs) {


                return $modal.open({
                    size: 0,
                    width: 0,
                    height: 0,
                    template: '<div ng-hide=true>' + printjs.getPrintDomStr(data) + '</div> ',
                    controller: printjs.controller,
                    resolve: {
                        printParams: function () {
                            var promise;

                            if (printType == 'mutiply') {
                                promise = $q.all(data.rows.map(function (row, index) {
                                    return $q.when(row).then(printjs.beforePrint).then(function () {
                                        data.rows[index] = arguments[0];
                                    });
                                }));
                            }
                            else {
                                promise = $q.when(data.currItem).then(printjs.beforePrint).then(function () {
                                    data.currItem = arguments[0];
                                });
                            }

                            return promise.then(function () {
                                return {
                                    data: data,
                                    printTemplate: printTemplate,
                                    printType: printType
                                };
                            });
                        }
                    }
                })
            })
        }

        /**
         * 获取审批意见
         * @param data
         */
        function getOpinions(data) {
            if (data.currItem.wfid && data.currItem.stat) {
                var postData = {
                    classId: "scpwf",
                    action: 'getopinions',
                    data: {
                        stat: data.currItem.stat,
                        wfid: data.currItem.wfid
                    }
                };
                return requestApi.post(postData)
                    .then(function (result) {
                        data.currItem.opinions = result.opinions;
                    });
            }
        }

        /**
         * 检查是否符合条件
         * @returns {void|Promise<any>}
         */
        function checkValid() {
            //若盒子非空，验证不通过，弹框
            if (invalidInfoBox.length)
                return swalApi.error(invalidInfoBox)
                    .then(function () {
                        return $q.reject(invalidInfoBox);
                    });
        }

        /**
         * 校验密码
         * @returns {Promise}
         */
        function checkPassWord() {
            //密码校验
            if (printTemplate.print_password && printTemplate.print_password != '') {
                return swalApi.input({
                    title: '请输入打印密码',
                    inputValidator: function (value) {
                        if (value != printTemplate.print_password) {
                            return '密码不正确！';
                        }
                        return ('' + value) ? '' : '密码不能为空';
                    }
                })
            }
        }

        /**获取执行表达式结果 **/
        function getSexeccondResult(execcond) {
            //用正则表达式替换变量<item>
            var regexp = new RegExp("<item>", "gm");
            var sexeccond = execcond.replace(regexp, "data.currItem");
            regexp = new RegExp("<objid>", "gm");
            //执行对象ID替换
            sexeccond = sexeccond.replace(regexp, data.currItem[data.idField]);
            //运行表达式 不符合条件的移除
            var flag = false;
            try {
                flag = eval(sexeccond);
                return flag;
            } catch (e) {
                invalidInfoBox.push("匹配条件有误");
                flag = false;
                return flag;
            }
        }

        /**
         * 选择打印模板
         * @param canSelectTemplates
         */
        function selecttemplateSelectScope() {
            var canSelectTemplates = templates;
            /**可控过程弹出选择 **/
            return $q(function (resolve, reject) {
                $modal.open({
                    template:
                    '    <div hc-box>\n' +
                    '        <div hc-grid="templateSelectOptions" style="height: 350px"/>\n' +
                    '    </div>\n' + '',
                    controller: ['$scope', function (templateSelectScope) {
                        templateSelectScope.title = '打印模板选择';

                        templateSelectScope.templateSelectOptions = {
                            columnDefs: [{
                                field: 'rptname',
                                headerName: '模板名称'
                            },
                                //     {
                                //     field: 'isdefault',
                                //     headerName: '缺省',
                                //     type: "是否"
                                // },
                                //     {
                                //     field: 'tempurl',
                                //     headerName: '打印模板路径',
                                //     editable: true,
                                //     width: 105
                                // },
                                // {
                                //     field: 'is_printnum_control',
                                //     headerName: '受打印次数控制',
                                //     type: '是否',
                                //     width: 105
                                // },
                                {
                                    field: 'node',
                                    headerName: '备注'
                                }],
                            hcReady: $q.deferPromise(),
                            onRowDoubleClicked: function (args) {
                                resolve(args.data);
                                templateSelectScope.$close(args.data);
                            }
                        };
                        templateSelectScope.templateSelectOptions.hcReady.then(function () {
                            templateSelectScope.templateSelectOptions.hcApi.setRowData(canSelectTemplates);
                        });

                        /**
                         * 【确定】按钮
                         */
                        templateSelectScope.footerRightButtons.ok.hide = false;
                        templateSelectScope.footerRightButtons.ok.click = getSelected;

                        function getSelected() {
                            var selectNode = templateSelectScope.templateSelectOptions.hcApi.getFocusedNode();
                            if (selectNode) {
                                resolve(selectNode.data);
                                templateSelectScope.$close(selectNode.data);
                            }
                            else return swalApi.info("请选择打印模板");
                        }

                        templateSelectScope.footerRightButtons.close.title = '取消';
                    }],
                    height: 450
                });
            })
        }


        return api;
    }
);