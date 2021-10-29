/**
 * 流程相关Api
 * @since 2019-06-27
 */
define(['exports', 'angular', 'requestApi', 'swalApi', 'requireApi'], function (api, angular, requestApi, swalApi, requireApi) {

    function showError(reason) {
        if (reason) {
            swalApi.error(reason);
            throw new Error(reason);
        }
    }

    /**
     * 启动然后提交
     * @param params
     * @since 2019-07-09
     */
    api.startThenSubmit = function (params) {
        //首个节点
        var firstProc = {};
        //后续节点
        var nextProc = [];
        //后续节点id
        var nextProcId = [];
        //后续执行节点
        var nextExcuteProc = [];

        return ['$q', '$modal', function ($q, $modal) {
            return $q
                .when()
                //请求后台为启动流程准备数据
                .then(function () {
                    return requestApi.post({
                        classId: 'scpwf',
                        action: 'prepare_for_start',
                        data: {
                            objtype: params.objType,
                            objid: params.objId
                        }
                    });
                })
                //判断是否需要用户选择流程模板
                .then(function (wf) {
                    if (wf.wftempofwfs.length <= 1) {
                        return wf;
                    }

                    //若后台返回多个流程模板，则需要用户选择
                    return $modal
                        .open({
                            templateUrl: 'views/baseman/wf_temp_chooser.html',
                            controller: ['$scope', function ($scope) {
                                $scope.title = '流程模板';

                                $scope.wfTemps = wf.wftempofwfs;
                            }]
                        })
                        .result
                        .then(function (wfTemp) {
                            //已获得流程模板，再次请求后台为启动流程准备数据
                            return requestApi.post({
                                classId: 'scpwf',
                                action: 'prepare_for_start',
                                data: {
                                    objtype: params.objType,
                                    objid: params.objId,
                                    wftempid: wfTemp.wftempid
                                }
                            });
                        });
                })
                //获取首个节点、后续节点
                .then(function (wf) {
                    //首个节点设置
                    var firstProcCond = wf.proccondofwfs.find(function (cur) {
                        return cur.fromprocid == 0;
                    });
                    var firstProcId = firstProcCond.toprocid;

                    firstProc = wf.wfprocofwfs.find(function (cur) {
                        return cur.procid == firstProcId;
                    });

                    //后续节点设置
                    wf.proccondofwfs.forEach(function (cur) {
                        if (cur.fromprocid == firstProc.procid) {
                            nextProcId.push(cur.toprocid);
                        }
                    });
                    nextProc = wf.wfprocofwfs.filter(function (cur) {
                        return nextProcId.indexOf(cur.procid) != -1;
                    });

                    return wf;
                })
                //获取后续执行节点,sufproctype : 1、无条件执行 2、自动条件执 3、4、手动选择
                .then(function (wf) {
                    if (firstProc.sufproctype == 1) {
                        nextExcuteProc = nextProc;
                        return wf;
                    } else if (firstProc.sufproctype == 2) {
                        //请求到后台判断后续执行节点
                        var postData = {
                            wftempid: wf.wftempid,
                            objtype: params.objType,
                            objid: params.objId
                        };

                        return requestApi.post('scpwftemp', 'getexcuteprocafterfirstsubmit', postData)
                            .then(function (result) {
                                nextExcuteProc = wf.wfprocofwfs.filter(function (curOut) {
                                    return result.wfproctempofwftemps.find(function (curIn) {
                                        return curIn.proctempid == curOut.procid;
                                    });
                                });
                                nextExcuteProc.forEach(function (cur) {
                                    cur.wfuserrangeofwfprocs = cur.wfuserrangeofwfproctemps;
                                    cur.isBeforeStart = true;
                                });
                                return wf;
                            })
                    } else if (firstProc.sufproctype == 3 || firstProc.sufproctype == 4) {
                        //弹出模态框选择后续执行节点
                        return $modal
                            .open({
                                templateUrl: 'views/baseman/wf_submit_target_proc.html',
                                controller: ['$scope', function ($scope) {
                                    $scope.title = '请选择后续执行节点';

                                    $scope.gridOptions = {
                                        defaultColDef: {
                                            cellStyle: {
                                                'text-align': 'center'
                                            }
                                        },
                                        columnDefs: [{
                                            field: 'procid',
                                            headerName: '过程号',
                                            headerCheckboxSelection: function () {
                                                return firstProc.sufproctype == 4;
                                            },
                                            headerCheckboxSelectionFilteredOnly: function () {
                                                return firstProc.sufproctype == 4;
                                            },
                                            checkboxSelection: function () {
                                                return firstProc.sufproctype == 4;
                                            }
                                        }, {
                                            field: 'procname',
                                            headerName: '节点名称',
                                            width: 200
                                        }],
                                        rowData: nextProc,
                                        hcEvents: {
                                            cellDoubleClicked: function (params) {
                                                //手选单分支直接双击确定
                                                if (firstProc.sufproctype == 3) {
                                                    $scope.$close(params.node.data);
                                                }
                                            }
                                        }
                                    };

                                    $scope.footerRightButtons.ok.hide = false;
                                    $scope.footerRightButtons.ok.disabled = function () {
                                        if (firstProc.sufproctype == 3) {
                                            //没有焦点时禁止点击
                                            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                                            if (idx < 0) {
                                                return true;
                                            }
                                        } else if (firstProc.sufproctype == 4) {
                                            //没有勾选内容时禁止点击
                                            var nodes = $scope.gridOptions.api.getSelectedNodes('checkbox');
                                            if (!nodes.length) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    };
                                    $scope.footerRightButtons.ok.click = function () {

                                        var node;
                                        if (firstProc.sufproctype == 3) {
                                            node = $scope.gridOptions.hcApi.getFocusedData();
                                        } else {
                                            node = $scope.gridOptions.hcApi.getSelectedNodes('checkbox');
                                        }

                                        return $scope.$close(node);
                                    };

                                }]
                            })
                            .result
                            .then(function (result) {
                                if (result.length) {
                                    //手选多分支
                                    result.forEach(function (cur) {
                                        nextExcuteProc.push(cur.data);
                                    });
                                } else {
                                    //手选单分支
                                    nextExcuteProc.push(result);
                                }
                                console.log(result, 'result');
                                return wf;
                            });
                    }
                })
                //判断是否需要用户选择岗位的执行人
                .then(function (wf) {
                    //要选择岗位执行人的节点
                    var procs = [];

                    nextExcuteProc.forEach(function (proc) {
                        if (!(proc.procuserofwfprocs && proc.procuserofwfprocs.length)) return;

                        var procPositions;

                        procPositions = proc.procuserofwfprocs.filter(function (procUser) {
                            if (procUser.positionusers && procUser.positionusers.length > 1) {
                                procUser.userid = '';
                                procUser.username = '';

                                procUser.selectOptions = procUser.positionusers.map(function (user) {
                                    return {
                                        name: user.username,
                                        value: user.userid
                                    };
                                });

                                return true;
                            }
                        });

                        if (procPositions.length) {
                            procs.push({
                                procid: proc.procid,
                                procname: proc.procname,
                                procPositions: procPositions
                            });
                        }
                    });

                    if (!procs.length) {
                        return wf;
                    }

                    //从岗位候选人选取
                    return $modal
                        .open({
                            templateUrl: 'views/baseman/wf_position_user.html',
                            controller: ['$scope', function ($scope) {
                                $scope.title = '部分岗位匹配到多个用户，请从中选择';

                                $scope.procs = procs;

                                $scope.footerRightButtons.ok.hide = false;
                                $scope.footerRightButtons.ok.disabled = function () {
                                    return $scope.modalForm.$invalid;
                                };
                                $scope.footerRightButtons.ok.click = function () {
                                    $scope.$close(wf);
                                };

                                var t = setInterval(function () {
                                    if ($(window.top.document).find(".modal-body").length > 0) {
                                        $(window.top.document).find(".modal-body").css("overflow-y", "visible");
                                        clearInterval(t)
                                    }
                                });
                            }]
                        })
                        .result;
                })
                //判断首个节点的后续执行节点是否有执行人
                .then(function (wf) {
                    //后续执行节点
                    var procs = [];
                    //已有执行人节点、可跳过节点 不用选择执行人
                    procs = WfProcUserController.getProcs(nextExcuteProc);

                    procs.forEach(function (cur) {
                        cur.wfuserrangeofwfprocs = cur.wfuserrangeofwfproctemps;
                        cur.isBeforeStart = true;
                    });

                    if (procs.length) {
                        return $modal
                            .open({
                                templateUrl: 'views/baseman/wf_proc_user.html',
                                controller: WfProcUserController,
                                resolve: {
                                    procs: procs
                                }
                            })
                            .result
                            .then(function (result) {
                                return wf;
                            });
                    } else {
                        return wf;
                    }
                })
                //让用户填写提交意见
                .then(function (wf) {
                    return $modal
                        .open({
                            templateUrl: 'views/baseman/wf_opinion.html',
                            controller: WfOpinionController,
                            resolve: {
                                wf: wf,
                                isReject: false
                            }
                        })
                        .result
                        .then(function (result) {
                            wf.wfopinion = result.opinion;
                            return wf;
                        });
                })
                //请求后台启动流程并提交首个节点
                .then(function (wf) {
                    //手选分支时，设置rejectto(别被名字骗了！这里的rejectto装载的是要提交到的节点的id)
                    if (firstProc.sufproctype == 3 || firstProc.sufproctype == 4) {
                        var ids = [];
                        nextExcuteProc.forEach(function (cur) {
                            ids.push(cur.procid);
                        });
                        var idsString = ids.join();

                        wf.wfprocofwfs.forEach(function (cur, idx) {
                            if (cur.procid == firstProc.procid) {
                                wf.wfprocofwfs[idx].rejectto = idsString;
                            }
                        });
                    }

                    return requestApi.post({
                        classId: 'scpwf',
                        action: 'start_then_submit',
                        data: wf
                    });
                })
                .then(function () {
                    return swalApi.success('提交成功');
                });
        }].callByAngular();
    };

    /**
     * 启动
     * @param params
     * @since 2019-07-09
     */
    api.start = function () {

        function throwError(message) {
            swalApi.error(message);
            throw new Error(message);
        }

        //是否需要确认提示，默认为 false
        if (needConfirm !== true)
            needConfirm = false;

        var wfId = numberApi.toNumber($scope.data.currItem.wfid);
        if (wfId !== 0)
            throwError('流程已经启动，不能重复启动');

        var wfTempId = numberApi.toNumber($scope.data.currItem.wftempid);
        if (wfTempId === 0)
            throwError('缺少流程模板');

        var objType = numberApi.toNumber($scope.objConf.objtypeid);
        if (objType === 0)
            throwError('缺少对象配置');

        var objId = numberApi.toNumber($scope.data.objId);
        if (objId === 0)
            throwError('缺少流程对象');

        if (needConfirm) {
            return swalApi.confirmThenSuccess({
                title: '确定要启动流程吗？',
                okFun: doStartWf,
                okTitle: '启动成功'
            });
        }
        else {
            return doStartWf().then(function () {
                return swalApi.success('启动成功');
            });
        }

        function doStartWf() {
            /* $scope.data.currItem.wfobjofwfs = [{
             objtype: objType,
             objid: objId
             }]; */

            swalApi.close();

            return selectPositionUser()
                .then(function () {
                    //流程过程
                    $scope.data.currItem.wfprocofwfs = $scope.getWfProcData();
                    //流程过程条件
                    $scope.data.currItem.proccondofwfs = $scope.getWfCondData();

                    //新增后启动流程
                    $scope.data.currItem.flag = 2;
                })
                .then(function () {
                    //新增流程
                    return requestApi
                        .post({
                            classId: 'scpwf',
                            action: 'insert',
                            data: angular.copy($scope.data.currItem)
                        })
                })
                .then(setCurrItem)
                .then(refreshObj);
        }

    };

    /**
     * 提交
     * @param params
     * @since 2019-07-09
     */
    api.submit = function (params) {
        return submitOrReject(false, params);
    };

    /**
     * 驳回
     * @param params
     * @since 2019-07-09
     */
    api.reject = function (params) {
        return submitOrReject(true, params);
    };

    /**
     * 提交或驳回
     * @param {boolean} isReject 是否驳回
     * @param {*} params
     */
    function submitOrReject(isReject, params) {
        return ['$q', '$modal', function ($q, $modal) {
            var my, wf, currProc;
            //后续节点
            var nextProc = [];
            //后续节点id
            var nextProcId = [];
            //后续执行节点
            var nextExcuteProc = [];
            //是否跳过后续节点
            var skipNextProc = false;

            return $q
                .when()
                .then(function () {
                    if (isReject) {
                        my = {
                            name: '驳回',
                            action: 'reject',
                            reasonField: 'can_not_reject_reason'
                        };
                    }
                    else {
                        my = {
                            name: '提交',
                            action: 'submit',
                            reasonField: 'can_not_submit_reason'
                        };
                    }
                })
                .then(function () {
                    if (!params) {
                        throw new Error('调用' + my.name + '流程的方法必须传递参数');
                    }

                    if (params.wf) {
                        wf = params.wf;
                        return;
                    }

                    var wfId = +params.wfId;

                    if (!wfId) {
                        throw new Error('调用' + my.name + '流程的方法必须传递参数 wf 或 wfId');
                    }

                    return requestApi
                        .post({
                            classId: 'scpwf',
                            action: 'select',
                            data: {
                                wfid: wfId
                            }
                        })
                        .then(function (response) {
                            wf = response;
                        });
                })
                //如果当前用户有多个待审批节点，选择一个要提交的节点
                .then(function () {
                    var reason = wf[my.reasonField];

                    showError(reason);

                    Switch(wf.executable_procs.length)
                        .case(1, function () {
                            currProc = wf.executable_procs[0];
                        })
                        .case(0, function () {
                            showError('当前没有可' + my.name + '的节点');
                        })
                        .default();

                    //有多个可提交节点时选择一个提交
                    if (wf.executable_procs.length > 1) {
                        return $modal.open({
                            height: '260px',
                            templateUrl: 'views/baseman/wf_submit_proc.html',
                            controller: ['$scope', function ($scope) {
                                $scope.title = '有多个可' + my.name + '节点，请从中选择一个';

                                $scope.procs = wf.executable_procs;
                                $scope.procOptions = $scope.procs.map(function (cur) {
                                    return {
                                        name: cur.procname,
                                        value: cur.procid
                                    }
                                });

                                $scope.footerRightButtons.ok.hide = false;
                                $scope.footerRightButtons.ok.disabled = function () {
                                    if ($scope.submitProc) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                };
                                $scope.footerRightButtons.ok.click = function () {
                                    currProc = wf.executable_procs.find(function (cur) {
                                        return cur.procid == $scope.submitProc;
                                    });
                                    return $scope.$close();
                                };
                            }]
                        }).result
                    }
                })
                //如果提交的节点是被驳回到的节点，且流程中的keephistory值为2，询问是否直接提交到驳回节点
                .then(function(){
                    if(wf.keephistory == 2){
                        skipNextProc = false;

                        //找到驳回节点(3节点驳回到1节点，3节点为驳回节点)
                        var rejectFrom = wf.wfprocofwfs.find(function(cur){
                            return cur.rejectto == currProc.procid;
                        });

                        //存在驳回节点时
                        if(rejectFrom && rejectFrom.stat == 5){
                            //驳回节点是不是当前提交节点的后续节点
                            var rejectFromIsNext = wf.proccondofwfs.some(function(cur){
                                return (cur.fromprocid == currProc.procid && cur.toprocid == rejectFrom.procid);
                            });
                            if(rejectFromIsNext){
                                return;
                            }

                            return $modal.open({
                                height: '260px',
                                template: '<div style="padding: 0 16px">'
                                + '  <div class="row">'
                                + '    <strong>驳回人：</strong>{{lastOpinion.username}}'
                                + '  </div>'
                                + '  <div class="row">'
                                + '    <strong>驳回意见：</strong>{{lastOpinion.opinion}}'
                                + '  </div>'
                                + '</div>',
                                controller: ['$scope', function ($scope) {
                                    //驳回节点的最新驳回意见
                                    $scope.lastOpinion =  angular
                                        .copy(rejectFrom.useropinionofwfprocs[rejectFrom.useropinionofwfprocs.length - 1]);

                                    $scope.title = '是否直接提交到驳回节点[' + rejectFrom.procname + ']?';

                                    $scope.footerRightButtons.ok.hide = false;
                                    $scope.footerRightButtons.ok.title = '是';
                                    $scope.footerRightButtons.ok.click = function () {
                                        skipNextProc = true;
                                        //将驳回节点作为要提交到的节点
                                        nextExcuteProc.push(rejectFrom);
                                        return $scope.$close();
                                    };

                                    $scope.footerRightButtons.close.title = '否';
                                    $scope.footerRightButtons.close.click = function(){
                                        return $scope.$close();
                                    }

                                }]
                            }).result;

                           /* swalApi.confirmThenSuccess({
                                title: '是否直接提交到驳回节点【' + rejectFrom.procname + '】?',
                                okFun: function () {
                                    skipNextProc = true;
                                    //将驳回节点作为要提交到的节点
                                    nextExcuteProc.push(rejectFrom);
                                }
                            });

                            return;*/
                        }
                    }
                })
                //获取提交节点的后续节点
                .then(function () {
                    if (isReject || skipNextProc) return;
                        //后续节点设置
                        wf.proccondofwfs.forEach(function (cur) {
                            if (cur.fromprocid == currProc.procid) {
                                nextProcId.push(cur.toprocid);
                            }
                        });
                        nextProc = wf.wfprocofwfs.filter(function (cur) {
                            return nextProcId.indexOf(cur.procid) != -1;
                        });
                })
                //获取后续执行节点
                .then(function () {
                    if (isReject || skipNextProc) return;

                    if (currProc.sufproctype == 1) {
                        nextExcuteProc = angular.copy(nextProc);
                        return wf;
                    } else if (currProc.sufproctype == 2) {
                        //请求到后台判断后续执行节点
                        var postData = {
                            wfid: currProc.wfid,
                            currprocid: currProc.procid
                        };

                        return requestApi.post('scpwf', 'getnextexcute', postData)
                            .then(function (result) {
                                nextExcuteProc = result.wfprocofwfs;
                                return wf;
                            })
                    } else if (currProc.sufproctype == 3 || currProc.sufproctype == 4) {
                        //弹出模态框选择后续执行节点
                        return $modal
                            .open({
                                templateUrl: 'views/baseman/wf_submit_target_proc.html',
                                controller: ['$scope', function ($scope) {
                                    $scope.title = '请选择后续执行节点';

                                    $scope.gridOptions = {
                                        defaultColDef: {
                                            cellStyle: {
                                                'text-align': 'center'
                                            }
                                        },
                                        columnDefs: [{
                                            field: 'procid',
                                            headerName: '过程号',
                                            headerCheckboxSelection: function () {
                                                return currProc.sufproctype == 4;
                                            },
                                            headerCheckboxSelectionFilteredOnly: function () {
                                                return currProc.sufproctype == 4;
                                            },
                                            checkboxSelection: function () {
                                                return currProc.sufproctype == 4;
                                            }
                                        }, {
                                            field: 'procname',
                                            headerName: '节点名称',
                                            width: 200
                                        }],
                                        rowData: nextProc,
                                        hcEvents: {
                                            cellDoubleClicked: function (params) {
                                                //手选单分支直接双击确定
                                                if (currProc.sufproctype == 3) {
                                                    $scope.$close(params.node.data);
                                                }
                                            }
                                        }
                                    };

                                    $scope.footerRightButtons.ok.hide = false;
                                    $scope.footerRightButtons.ok.disabled = function () {
                                        if (currProc.sufproctype == 3) {
                                            //没有焦点时禁止点击
                                            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                                            if (idx < 0) {
                                                return true;
                                            }
                                        } else if (currProc.sufproctype == 4) {
                                            //没有勾选内容时禁止点击
                                            var nodes = $scope.gridOptions.api.getSelectedNodes('checkbox');
                                            if (!nodes.length) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    };
                                    $scope.footerRightButtons.ok.click = function () {

                                        var node;
                                        if (currProc.sufproctype == 3) {
                                            node = $scope.gridOptions.hcApi.getFocusedData();
                                        } else {
                                            node = $scope.gridOptions.hcApi.getSelectedNodes('checkbox');
                                        }

                                        return $scope.$close(node);
                                    };

                                }]
                            })
                            .result
                            .then(function (result) {
                                if (result.length) {
                                    //手选多分支
                                    result.forEach(function (cur) {
                                        nextExcuteProc.push(cur.data);
                                    });
                                } else {
                                    //手选单分支
                                    nextExcuteProc.push(result);
                                }
                            });
                    }
                })
                //判断是否需要用户选择岗位的执行人(后续执行节点中存在岗位syspositionid不为0时即为未确定岗位执行人)
                .then(function () {
                    if(isReject || skipNextProc) return ;

                    //要选择岗位执行人的节点
                    var procs = [];

                    nextExcuteProc.forEach(function (proc) {
                        if (!(proc.procuserofwfprocs && proc.procuserofwfprocs.length)) return;

                        var procPositions = [];

                        procPositions = proc.procuserofwfprocs.filter(function (procUser) {
                            if (procUser.positionusers && procUser.positionusers.length > 0) {
                                procUser.userid = '';
                                procUser.username = '';

                                procUser.selectOptions = procUser.positionusers.map(function (user) {
                                    return {
                                        name: user.username,
                                        value: user.userid
                                    };
                                });

                                return true;
                            }
                        });

                        if (procPositions.length) {
                            procs.push({
                                procid: proc.procid,
                                procname: proc.procname,
                                procPositions: procPositions
                            });
                        }
                    });

                    if (!procs.length) {
                        return wf;
                    }

                    //从岗位候选人选取
                    return $modal
                        .open({
                            templateUrl: 'views/baseman/wf_position_user.html',
                            controller: ['$scope', function ($scope) {
                                $scope.title = '部分岗位匹配到多个用户，请从中选择';

                                $scope.procs = procs;

                                /**
                                 * 是否显示节点
                                 * @param proc
                                 * @returns {boolean}
                                 */
                                $scope.hideProc = function (proc) {
                                    var hide = true;

                                    proc.procPositions.forEach(function (cur) {
                                        if (cur.positionusers.length > 1) {
                                            hide = false;
                                        }
                                    });

                                    return hide;
                                };

                                /**
                                 * 是否显示岗位选择
                                 * @param proc
                                 * @returns {boolean}
                                 */
                                $scope.hidePosition = function (position) {
                                    var hide = false;

                                    if (position.positionusers.length == 1) {
                                        hide = true;
                                    }

                                    return hide;
                                };

                                $scope.footerRightButtons.ok.hide = false;
                                $scope.footerRightButtons.ok.disabled = function () {
                                    return $scope.modalForm.$invalid;
                                };

                                /**
                                 * 节点去除重复的执行人
                                 * @param arr
                                 * @returns {Array}
                                 */
                                $scope.distinct = function (arr) {
                                    var result = [];
                                    var obj = {};

                                    arr.forEach(function (i) {
                                        if (!obj[i.userid]) {
                                            result.push(i);
                                            obj[i.userid] = 1;
                                        }
                                    });

                                    return result
                                };

                                $scope.footerRightButtons.ok.click = function () {
                                    var postData = {
                                        wfid: wf.wfid,
                                        wfprocs: []
                                        /*{
                                         wfid:wf.wfid,
                                         procid:'',
                                         procuserofwfprocs:
                                         }*/
                                    };

                                    $scope.procs.forEach(function (cur) {
                                        var procUserObj = {
                                            wfid: wf.wfid,
                                            procid: cur.procid,
                                            procuserofwfprocs: []
                                        };
                                        cur.procPositions.forEach(function (curPosition) {
                                            var positionUser;

                                            //如果岗位只有一个用户
                                            if (curPosition.positionusers.length && curPosition.positionusers.length == 1) {
                                                //curPosition.userid = curPosition.positionusers[0].userid;
                                                positionUser = curPosition.positionusers[0];
                                                positionUser.rate = 0;
                                                procUserObj.procuserofwfprocs.push(positionUser);
                                                return false;
                                            }

                                            //岗位有多个用户时找到选中的用户
                                            positionUser = curPosition.positionusers.find(function (user) {
                                                return user.userid == curPosition.userid;
                                            });

                                            if (positionUser) {
                                                var doPush = procUserObj.procuserofwfprocs.find(function (user) {
                                                    return user.sysuserid == positionUser.positionUser;
                                                });

                                                positionUser.rate = 0;
                                                procUserObj.procuserofwfprocs.push(positionUser);
                                            }
                                        });

                                        var procuserofwfprocsDistinct = $scope.distinct(procUserObj.procuserofwfprocs);
                                        procUserObj.procuserofwfprocs = procuserofwfprocsDistinct;

                                        postData.wfprocs.push(procUserObj);
                                    });
                                    return requestApi.post('scpwfproc', 'set_proc_user', postData)
                                        .then(function () {
                                            $scope.$close();
                                        });
                                };

                                var t = setInterval(function () {
                                    if ($(window.top.document).find(".modal-body").length > 0) {
                                        $(window.top.document).find(".modal-body").css("overflow-y", "visible");
                                        clearInterval(t)
                                    }
                                });
                            }]
                        })
                        .result;
                })
                //如果后续执行节点无执行人，为其选择执行人
                .then(function () {
                    if (isReject || skipNextProc) return;

                        var procs = [];
                        procs = WfProcUserController.getProcs(nextExcuteProc);

                        if (!procs.length) {
                            return;
                        } else {
                            //如果下一个节点中包含终点，返回
                            var hasEndProc = procs.find(function (cur) {
                                return cur.procid == 99999;
                            });
                            if (hasEndProc) {
                                return;
                            }

                            return $modal
                                .open({
                                    templateUrl: 'views/baseman/wf_proc_user.html',
                                    controller: WfProcUserController,
                                    resolve: {
                                        procs: procs
                                    }
                                })
                                .result;
                        }
                })
                .then(function () {
                    return requireApi.usePromiseToRequire('directive/hcOpinionManager');
                })
				.then(function () {
					return $modal
						.open({
                            templateUrl: 'views/baseman/wf_opinion.html',
                            controller: WfOpinionController,
                            resolve: {
                                wf: wf,
                                currProc: currProc,
                                isReject: isReject
                            }
                        })
                        .result;
                })
                .then(function (result) {
                    var postData = angular.extend({}, result, {
                        wfid: wf.wfid,
                        procid: currProc.procid
                    });

                    //提交时设置要提交到的后续节点
                    if (!isReject && (skipNextProc || currProc.sufproctype == 3 || currProc.sufproctype == 4)) {
                        var ids = [];
                        nextExcuteProc.forEach(function (cur) {
                            ids.push(cur.procid);
                        });
                        var idsString = ids.join();
                        postData.rejectto = idsString;
                    }

                    return requestApi
                        .post({
                            classId: 'scpwfproc',
                            action: my.action,
                            data: postData
                        });
                })
                .then(function () {
                    return swalApi.success(my.name + '成功');
                });
        }].callByAngular();
    }

    /**
     * 中断
     * @param params
     * @since 2019-07-09
     */
    api.break = function (params) {
        return ['$q', function ($q) {
            var wf;

            return $q
                .when()
                .then(function () {
                    if (!params) {
                        throw new Error('调用中断流程的方法必须传递参数');
                    }

                    if (params.wf) {
                        wf = params.wf;
                        return;
                    }

                    var wfId = +params.wfId;

                    if (!wfId) {
                        throw new Error('调用中断流程的方法必须传递参数 wf 或 wfId');
                    }

                    return requestApi
                        .post({
                            classId: 'scpwf',
                            action: 'select',
                            data: {
                                wfid: wfId
                            }
                        })
                        .then(function (response) {
                            wf = response;
                        });
                })
                .then(function () {
                    return swalApi.confirm('确定要中断流程吗？');
                })
                .then(function () {
                    return requestApi
                        .post({
                            classId: 'scpwf',
                            action: 'break',
                            data: {
                                wfid: wf.wfid
                            }
                        });
                })
                .then(function () {
                    return swalApi.success('中断成功');
                });
        }].callByAngular();
    };

    api.WF_STAT = {
        BREAK: 8
    };

    api.PROC_STAT = {
        START: 4
    };

    api.PROC = {
        START: 0,
        END: 99999
    };

    api.processProcBeforeRequest = function (proc) {
        proc = angular.extend(proc);

        [
            'prev_procs',
            'next_procs',
            'prev_proc_map',
            'next_proc_map',
            'prev_proc_conds',
            'next_proc_conds'
        ].forEach(function (propertyName) {
            delete proc[propertyName];
        });

        return proc;
    };

    api.processWFBeforeRequest = function (wf) {
        if (!wf.proc_map) return wf;

        var wf = angular.extend({}, wf);

        delete wf.proc_map;

        [
            'proc_map',
            'executable_procs',
            'rejectable_procs'
        ].forEach(function (propertyName) {
            delete wf[propertyName];
        });

        wf.wfprocofwfs.forEach(function (proc, index, procs) {
            proc = angular.extend({}, proc);

            procs[index] = proc;

            [
                'prev_procs',
                'next_procs',
                'prev_proc_map',
                'next_proc_map',
                'prev_proc_conds',
                'next_proc_conds'
            ].forEach(function (propertyName) {
                delete proc[propertyName];
            });
        });

        return wf;
    };

    api.processWFAfterRequest = function (wf) {
        wf.proc_map = {};		//节点映射

        //遍历节点
        wf.wfprocofwfs.forEach(function (proc) {
            wf.proc_map[proc.procid] = proc;

            proc.is_start = proc.procid == api.PROC.START;
            proc.is_end = proc.procid == api.PROC.END;

            proc.prev_procs = [];			//前置节点
            proc.next_procs = [];			//后置节点

            proc.prev_proc_map = {};		//前置节点
            proc.next_proc_map = {};		//后置节点

            proc.prev_proc_conds = [];		//前置连线
            proc.next_proc_conds = [];		//后置连线
        });

        ['executable_procs', 'rejectable_procs'].forEach(function (dataRelationName) {
            wf[dataRelationName].forEach(reassociate);
        });

        /**
         * 重新关联
         * @param {*} proc
         * @param {*} index
         * @param {*} procs
         */
        function reassociate(proc, index, procs) {
            procs[index] = wf.proc_map[proc.procid];
        }

        //遍历节点连线
        wf.proccondofwfs.forEach(function (procCond) {
            var prevProc = wf.proc_map[procCond.fromprocid];
            var nextProc = wf.proc_map[procCond.toprocid];

            if (!prevProc.is_start) {
                if (!nextProc.prev_proc_map[prevProc.procid]) {
                    nextProc.prev_proc_map[prevProc.procid] = prevProc;
                    nextProc.prev_procs.push(prevProc);
                }

                nextProc.prev_proc_conds.push(procCond);
            }

            if (!nextProc.is_end) {
                if (!prevProc.next_proc_map[nextProc.procid]) {
                    prevProc.next_proc_map[nextProc.procid] = nextProc;
                    prevProc.next_procs.push(nextProc);
                }

                prevProc.next_proc_conds.push(procCond);
            }
        });

        return wf;
    };

    /**
     * 找到后续执行节点中没有执行人且不能跳过的节点
     * @param currProc
     * @returns {Array.<T>}
     */
    WfProcUserController.getProcs = function (nextExcuteProcs) {
        var procs = nextExcuteProcs
            .filter(function (proc) {
                if (proc.isskip != 2 && (!proc.procuserofwfprocs || !proc.procuserofwfprocs.length)) {
                    return true;
                }
            });

        return procs;
    };

    WfProcUserController.$inject = ['$scope', 'procs', '$modal', '$q'];
    function WfProcUserController($scope, procs, $modal, $q) {
        $scope.title = '后续执行节点没有执行人，请选择';

        $scope.procs = procs;//angular.copy();
        $scope.procusers = [];

        //与procs数组索引同步,通过点击页签改变
        $scope.pointerOfPorcs = 0;
        //节点是否允许从用户范围外选择执行人
        $scope.canmodify = procs[0].canmodify;
        /**
         * 执行人表格
         */
        $scope.procUserGridOptions = {
            defaultColDef: {
                cellStyle: {
                    'text-align': 'center'
                }
            },
            columnDefs: [{
                type: '序号'
            }, {
                field: 'org_position_name',
                headerName: '机构岗位名称',
                hide: function (args) {
                    //节点执行人类型为机构岗位且匹配到多个用户时显示
                    return false;
                },
                width: 200,
                suppressSizeToFit: true,
                suppressAutoSize: true
            }, {
                field: 'userid',
                headerName: '用户名称',
                width: 200,
                suppressSizeToFit: true,
                suppressAutoSize: true
            }, {
                field: 'dept',
                headerName: '所属机构',
                width: 400,
                suppressSizeToFit: true,
                suppressAutoSize: true
            }],
            onCellDoubleClicked: function (args) {
                $scope.deleteProcUser();
                $scope.setRangeUserSelected();
            }
        };

        /**
         * 用户范围表格
         */
        $scope.procUserRangerGridOptions = {
            defaultColDef: {
                cellStyle: {
                    'text-align': 'center'
                }
            },
            columnDefs: [{
                type: '序号',
                checkboxSelection: true
            }, {
                field: 'userid',
                headerName: '名称',
                width: 200
            }, {
                field: 'orgpath',
                headerName: '所属机构',
                width: 320
            }],
            onCellDoubleClicked: function (args) {
                console.log(args, 'args');
                args.data.dept = args.data.orgpath;
                $scope.modifyProcUser(args.data);
            },
            //初始为第一个后续执行节点的用户范围
            rowData: ($scope.procs[0].wfuserrangeofwfprocs) ? $scope.procs[0].wfuserrangeofwfprocs : []
        };

        /**
         * 变更当前的表格数据
         * @param idx
         */
        $scope.changePointerOfPorcs = function (idx) {
            $scope.pointerOfPorcs = idx;
            $scope.procUserGridOptions.api
                .setRowData($scope.procs[$scope.pointerOfPorcs].procuserofwfprocs);
            $scope.procUserGridOptions.api.refreshCells();

            $scope.procUserRangerGridOptions.api
                .setRowData($scope.procs[$scope.pointerOfPorcs].wfuserrangeofwfprocs);
            $scope.procUserRangerGridOptions.api.refreshCells();

            $scope.canmodify = $scope.procs[$scope.pointerOfPorcs].canmodify;
        };

        /*$scope.getSearchUserSetting = function(procUser) {
         return {
         afterOk: function (user) {
         ['userid', 'username'].forEach(function (field) {
         procUser[field] = user[field];
         });
         }
         };
         };*/

        /**
         * 添加流程实例的执行人
         */
        $scope.addProcUser = function () {
            return $modal
                .openCommonSearch({
                    classId: 'scpuser',
                    checkbox: true
                }).result
                .then(function (result) {
                    $scope.modifyProcUser(result);
                });
        };

        /**
         * 从用户范围中添加执行人
         */
        $scope.addProcUserFomrRange = function () {
            var selectedRows = $scope.procUserRangerGridOptions.api.getSelectedRows();
            selectedRows.forEach(function (cur, idx) {
                selectedRows[idx].dept = selectedRows[idx].orgpath;
            });
            $scope.modifyProcUser(selectedRows);
        };

        /**
         * 删除执行人
         */
        $scope.deleteProcUser = function () {
            $scope.modifyProcUser();
        };

        /**
         *勾选用户范围中已存在于执行人中的用户
         */
        $scope.setRangeUserSelected = function () {
            if ($scope.procusers.length && $scope.procs[0].wfuserrangeofwfprocs) {
                $scope.procusers.forEach(function (cur) {
                    $scope.procUserRangerGridOptions.api.forEachNode(function (node) {
                        if (cur.userid == node.data.userid) {
                            node.setSelected(true);
                        }
                    })
                });
            }
        };

        /**
         * 增、删表格中的执行人
         * @param newRowData 新增的数据
         */
        $scope.modifyProcUser = function (newRowData) {
            if (newRowData) {
                $scope.procs[$scope.pointerOfPorcs].procuserofwfprocs
                    = $scope.procs[$scope.pointerOfPorcs].procuserofwfprocs.concat(newRowData)
                $scope.procs[$scope.pointerOfPorcs].procuserofwfprocs
                    = $scope.distinct($scope.procs[$scope.pointerOfPorcs].procuserofwfprocs);
                $scope.setRangeUserSelected();
            } else {
                var idx = $scope.procUserGridOptions.api.getFocusedCell().rowIndex;
                if (idx < 0) {
                    swalApi.info('请选中要删除的行');
                } else {
                    $scope.procs[$scope.pointerOfPorcs].procuserofwfprocs.splice(idx, 1);
                }
            }

            $scope.procUserGridOptions.api
                .setRowData($scope.procs[$scope.pointerOfPorcs].procuserofwfprocs);
            $scope.procUserGridOptions.api.refreshCells();
        };

        /**
         * 执行人数组去重
         * @param arr
         * @returns {Array}
         */
        $scope.distinct = function (arr) {
            var result = [];
            var obj = {};

            arr.forEach(function (i) {
                if (!obj[i.userid]) {
                    result.push(i);
                    obj[i.userid] = 1;
                }
            });

            return result
        };

        $scope.footerRightButtons.ok.hide = false;
        $scope.footerRightButtons.ok.disabled = function () {
            return $scope.modalForm.$invalid;
        };
        $scope.footerRightButtons.ok.click = function () {
            var postData = {};

            /*postData.wfprocs = procs.map(function (proc) {
             proc = api.processProcBeforeRequest(proc);

             proc.procuserofwfprocs = procUsers;//[proc.procUser];

             delete proc.procUser;

             return proc;
             });*/

            //验证后续执行节点是否都有了执行人,procWithoutUser记录没有执行人的节点
            var procWithoutUser = [];
            $scope.procs.forEach(function (cur) {
                if (!cur.procuserofwfprocs.length) {
                    procWithoutUser.push(cur.procname);
                }
            });
            if (procWithoutUser.length) {
                return swalApi.info('无法提交，以下节点没有选择执行人：' + procWithoutUser.join());
            } else {
                postData.wfprocs = $scope.procs;
            }

            //如果流程还没启动，则不发送请求
            if (procs[0].isBeforeStart) {
                return $scope.$close();
            }

            //设置请求数据
            postData.wfid = postData.wfprocs[0].wfid;
            postData.wfprocs = postData.wfprocs.map(function (cur) {
                return {
                    wfid: cur.wfid,
                    procid: cur.procid,
                    procuserofwfprocs: cur.procuserofwfprocs
                }
            });

            return requestApi
                .post({
                    classId: 'scpwfproc',
                    action: 'set_proc_user',
                    data: postData
                })
                .then(function () {
                    $scope.$close();
                });
        };
    }

    WfOpinionController.$inject = ['$scope', 'isReject', 'wf'];
    function WfOpinionController($scope, isReject, wf) {
        $scope.isReject = isReject;
        $scope.procs = wf.rejectable_procs;

        $scope.title = isReject ? '驳回' : '提交';

        $scope.data = {
            opinion: isReject ? '' : '同意！'
        };

        if (isReject) {
            $scope.rejectProcGridOptions = {
                columnDefs: [
                    {
                        type: '序号',
                        field: 'procid'
                    },
                    {
                        field: 'procname',
                        headerName: '过程'
                    },
                    {
                        field: 'userids',
                        headerName: '执行人'
                    }
                ],
                rowData: wf.rejectable_procs,
                hcEvents: {
                    gridReady: function () {
                        $scope.rejectProcGridOptions.columnApi.autoSizeAllColumns();

                        if (wf.rejectable_procs.length === 1) {
                            $scope.rejectProcGridOptions.hcApi.setFocusedCell();
                        }
                    }
                }
            };
        }

        $scope.footerRightButtons.ok = {
            title: '确定',
            click: function () {
                if (!$scope.data.opinion)
                    return swalApi.error('请填写' + (isReject ? '驳回原因' : '流程意见'));

                if (isReject) {
                    var nodes = $scope.rejectProcGridOptions.hcApi.getSelectedNodes('auto');

                    if (nodes && nodes.length) {
                        $scope.data.rejectto = nodes
                            .map(function (node) {
                                return node.data.procid;
                            })
                            .join(',');
                    }
                    else
                        return swalApi.error('请选中要驳回到的过程');
                }

                $scope.$close($scope.data);
            }
        };
    }

    /**
     * 监听请求成功事件
     * 满足条件时刷新
     */
    api.onRefresh = function (callback) {
        require(['jquery'], function ($) {
            $(document).on('hc.request.success', function (event, eventData) {
                Switch(eventData.classId)
                //流程
                    .case('scpwf', function () {
                        Switch(eventData.action)
                            .case(
                                'insert',				//新增
                                'start',				//启动
                                'break',				//中断
                                'start_then_submit',	//启动并提交
                                refresh
                            );
                    })
                    //流程节点
                    .case('scpwfproc', function () {
                        Switch(eventData.action)
                        //提交、驳回、转办
                            .case(
                                'submit',			//提交
                                'reject',			//驳回
                                'transto',			//转办
                                'transferto',		//转办
                                'update',			//更新
                                'set_proc_user',	//设置执行人
                                refresh
                            );
                    });

                function refresh() {
                    callback(eventData);
                }
            });
        });
    };

});