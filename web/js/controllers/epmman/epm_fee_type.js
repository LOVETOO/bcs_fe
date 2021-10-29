/**
 * 工程费用类别 树型页
 *  2019-6-15
 */
define(
    ['module', 'controllerApi', 'base_tree_list', 'openBizObj', 'zTreeApi', 'requestApi', 'promiseApi', 'swalApi'],
    function (module, controllerApi, base_tree_list, openBizObj, zTreeApi, requestApi, promiseApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {
                //主页面的表列数据
                $scope.gridOptions = {
                    columnDefs: [{
                        headerName: "编码",
                        field: "code"
                    }, {
                        headerName: "名称",
                        field: "name"
                    }, {
                        headerName: "类型",
                        field: "type",
                        type: '词汇',
                        cellEditorParams: {
                            names: ['费用项目', '费用类别'],
                            values: [1, 2]
                        }
                    }, {
                        headerName: "会计科目编码",
                        field: "data.subject_no"
                    }, {
                        headerName: "会计科目名称",
                        field: "data.subject_name"
                    }, {
                        headerName: "报销方式",
                        field: "data.apply_type",
                        hcDictCode: "fin_fee_header_apply_type"
                    }, {
                        headerName: "状态",
                        field: "data.stat",
                        hcDictCode: "fin_fee_header_stat"
                    }, {
                        headerName: "费用类型",
                        field: "data.fee_property",
                        hcDictCode: "fee_property"
                    }, {
                        headerName: "提示",
                        field: "data.subject_desc"
                    }, {
                        headerName: "备注",
                        field: "data.note"
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.fee_type_kind = 2
                    }
                };


                //设置弹出明细列表列属性
                $scope.gridOptions1 = {
                    columnDefs: [{
                        type: "序号",
                        minWidth: 60,
                        headerCheckboxSelection: true,
                        checkboxSelection: function (prams) {
                            var flag = true;
                            if (prams.data.refflag == "1") {
                                flag = false;
                            }
                            return flag;
                        }
                    }, {
                        headerName: "费用项目编码",
                        minWidth: 210,
                        field: "fee_code"
                    }, {
                        headerName: "费用项目名称",
                        minWidth: 274,
                        field: "fee_name",
                        suppressSizeToFit: true
                    }]
                };

                $scope.treeSetting = {
                    //返回根节点或其承诺
                    hcGetRootNodes: function () {
                        return {
                            name: '费用类别',
                            data: {
                                pid: 0
                            },
                            isParent: true
                        };
                    },
                    //返回指定节点的子节点或其承诺
                    hcGetChildNodes: function (node) {
                        // console.log("当前节点数据",node)
                        return requestApi.post({
                            classId: 'fin_fee_type',
                            action: 'select',
                            data: {
                                "fee_type_id": node.data.fee_type_id,
                                "fee_type_code": node.data.fee_type_code,
                                "fee_type_name": node.data.fee_type_name,
                                "idpath": node.data.idpath,
                                "lev": node.data.lev,
                                "usable": "2",
                                "sqlwhere": "PId = " + node.data.pid,
                                "flag": "2",
                                "fee_type_kind": "2"
                            }
                        })
                            .then(function (response) {
                                node.hcGridData1 = response
                                return response.fin_fee_typeoffin_fee_types.map(function (data) {
                                    return {
                                        name: data.fee_type_name,
                                        objType: 13,
                                        isParent: true,
                                        data: data
                                    };
                                });
                            });
                    },
                    hcGetGridData: function (node) {

                        var detail = node.hcGridData1.fin_fee_headeroffin_fee_types.map(function (data) {
                            // console.log("明细数据",data)
                            return {
                                name: data.fee_name,
                                code: data.fee_code,
                                data: data,
                                type: 1
                            }
                        });
                        var sort = node.hcGridData1.fin_fee_typeoffin_fee_types.map(function (data) {
                            return {
                                name: data.fee_type_name,
                                code: data.fee_type_code,
                                data: data,
                                type: 2
                            }
                        });
                        return sort.concat(detail);
                        // });
                    }

                }
                //继承主控制器
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                //test
                /* $modal.open({
                     templateUrl: 'views/finman/fee_type_prop.html',
                     scope: $scope, //作用域
                     backdrop: 'static', //静态背景，背景灰色且不可点
                     keyboard: true, //允许按【Esc】退出
                     size: 'md' //大小：中等
                 });*/


                //重置按钮
                $scope.toolButtons = {};

                //增加类别按钮
                $scope.toolButtons.addSort = {
                    title: '增加类别',
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.addType && $scope.addType();
                    }
                }

                //删除按钮
                $scope.toolButtons.delete = {
                    title: '删除类别',
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.delete && $scope.delete();
                    }
                }
                //增加修改类别按钮
                $scope.toolButtons.openProp = {
                    title: '修改类别',
                    icon: '',
                    click: function () {
                        $scope.updateType && $scope.updateType();
                    }
                }

                //增加明细按钮
                $scope.toolButtons.addAttribute = {
                    title: '添加费用项目',
                    icon: 'fa fa-plus-square-o',
                    click: function () {
                        $scope.addAttribute && $scope.addAttribute();
                    }
                }

                //删除
                $scope.delete = function () {
                    var selectnode = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    if (selectnode.children && selectnode.children.length > 0) {
                        return swalApi.info('请先删除当前类别下的类别节点').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除类别吗?",
                        okFun: function () {
                            return requestApi.post("fin_fee_type", "delete", {
                                fee_type_id: selectnode.data.fee_type_id,
                                idpath: selectnode.data.idpath
                            }).then(function (data) {
                                var code = selectnode.data.fee_type_code
                                //选中父节点
                                var parentNode = selectnode.getParentNode()
                                $scope.treeSetting.zTreeObj.selectNode(parentNode, false);
                                // 删除节点
                                $scope.treeSetting.zTreeObj.removeNode(selectnode)
                                $scope.treeSetting.zTreeObj.updateNode($scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                                //修改缓存
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.forEach(function (node) {
                                    if (node.code == code) {
                                        $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.splice($scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.indexOf(node), 1);
                                    }
                                });
                                //放入数据
                                $scope.gridOptions.api.setRowData($scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData);
                            });
                        },
                        okTitle: '删除成功'
                    });
                }

                //修改
                $scope.sort = {};
                $scope.updateType = function () {
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    // console.log('选中节点数据', node);
                    if (node.tId === "tree_1") {
                        return swalApi.info('请先选中要修改的节点').then($q.reject);
                    }
                    //打开修改类别模态框
                    $("#AddSortModal").modal('show');

                    //等选中节点数据绑定到模态框
                    $scope.sort.AddSortCode = node.data.fee_type_code;
                    $scope.sort.AddSortName = node.data.fee_type_name;
                    $scope.sort.AddTypeKind = node.data.fee_type_kind;
                    $scope.sort.AddBusinessUnits = node.data.entname;
                    $scope.sort.AddHierarchy = node.data.lev;
                    $scope.sort.AddComment = node.data.note;
                    $scope.sort.AddUsable = node.data.usable;
                    $scope.sort.btn = "update";
                }

                //展示增加类别
                $scope.addType = function () {
                    $("#AddSortModal").modal('show');
                    $scope.sort.AddSortCode = '';
                    $scope.sort.AddSortName = '';
                    $scope.sort.AddBusinessUnits = '';
                    $scope.sort.AddHierarchy = '';
                    $scope.sort.AddComment = '';
                    $scope.sort.AddUsable = 1;
                    $scope.sort.AddTypeKind = 2;
                    $scope.sort.btn = "add";
                }

                //模态窗确定事件
                $scope.SortModal = function () {
                    if ($scope.sort.btn == "update") {
                        $scope.UpdateSortModal();
                    } else if ($scope.sort.btn == "add") {
                        $scope.AddSortModal();
                    }
                }
                //修改类别
                $scope.UpdateSortModal = function () {
                    if ($scope.sort.AddSortCode == "" || $scope.sort.AddSortName == "") {
                        return swalApi.info('类别编码或类别名称不能为空!').then($q.reject);
                    }
                    ;
                    return swalApi.confirmThenSuccess({
                        title: "确定要修改类别吗?",
                        okFun: function () {
                            return requestApi.post("fin_fee_type", "update", {
                                fee_type_id: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fee_type_id,
                                fee_type_code: $scope.sort.AddSortCode,
                                fee_type_name: $scope.sort.AddSortName,
                                fee_type_kind: $scope.sort.AddTypeKind,
                                idpath: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.idpath,
                                pid: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.pid,
                                lev: $scope.sort.AddHierarchy,
                                usable: $scope.sort.AddUsable,
                                note: $scope.sort.AddComment,
                            }).then(function (data) {
                                // console.log(data);
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].name = $scope.sort.AddSortName;
                                //修改本地储存的数据-修改模态窗要使用
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.fee_type_code = $scope.sort.AddSortCode;
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.fee_type_name = $scope.sort.AddSortName;
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.fee_type_kind = $scope.sort.AddTypeKind;
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.lev = $scope.sort.AddHierarchy;
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.usable = $scope.sort.AddUsable;
                                $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.note = $scope.sort.AddComment;
                                //更新树
                                $scope.treeSetting.zTreeObj.updateNode($scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                                $("#AddSortModal").modal("hide");
                                // BasemanService.swalError("成功","修改成功");
                                // $("#AddSortModal").modal("hide");
                            });
                        },
                        okTitle: '修改成功'
                    });
                };
                //添加类别
                $scope.AddSortModal = function () {
                    // console.log("2354",$scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                    var data = {};
                    if ($scope.sort.AddSortCode == "" || $scope.sort.AddSortName == "") {
                        return swalApi.info('类别编码或类别名称不能为空!').then($q.reject);
                    }
                    ;
                    return swalApi.confirmThenSuccess({
                        title: "确定要添加类别吗?",
                        okFun: function () {
                            data.fee_type_code = $scope.sort.AddSortCode;
                            data.fee_type_name = $scope.sort.AddSortName;
                            data.note = $scope.sort.AddComment;
                            data.usable = $scope.sort.AddUsable;
                            data.fee_type_kind = $scope.sort.AddTypeKind;
                            data.pid = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fee_type_id;
                            data.parent_idpath = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.idpath;
                            return requestApi.post("fin_fee_type", "insert", data).then(
                                function (data) {
                                    $scope.treeSetting.zTreeObj.addNodes($scope.treeSetting.zTreeObj.getSelectedNodes()[0], -1, {
                                        name: data.fee_type_name,
                                        code: data.fee_type_code,
                                        type: 2,
                                        isParent: true,
                                        data: data
                                    })
                                    //添加缓存
                                    $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.push($scope.treeSetting.zTreeObj.getSelectedNodes()[0].children[$scope.treeSetting.zTreeObj.getSelectedNodes()[0].children.length - 1]);
                                    $scope.gridOptions.api.setRowData($scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData);
                                }
                            );
                            $("#AddSortModal").modal("hide");
                        },
                        okTitle: '添加成功'
                    });
                };


                //展示增加明细
                $scope.addAttribute = function () {
                    LoadDetailGrid().then(function () {
                        $("#LookModal").modal('show');
                    });
                }
                $('#LookModal').on('shown.bs.modal', function () {

                    if (!$scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData) {
                        $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData = [];
                    }
                    var arr = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData.map(function (data) {
                        return data.data.fee_id
                    });

                    //遍历模态框中所有的表格节点,判断是否存在,如果存在则勾选
                    $scope.gridOptions1.api.forEachNode(function (node, index) {
                        if (arr.indexOf(node.data.fee_id) > -1) {
                            node.setSelected(true);
                        }
                    })
                })


                //初始化全局变量暂存原先选中的明细
                // $scope.oldDetail = {};
                //保存明细
                $scope.saveDetail = function () {
                    var arr = $scope.gridOptions1.api.getSelectedRows().map(function (item) {
                        return {
                            fee_id: item.fee_id,
                            fee_code: item.fee_code,
                            fee_name: item.fee_name,
                            refflag: "0"
                        }
                    });

                    // console.log("aar",arr)
                    return requestApi.post("fin_fee_type", "update_fee_info", {
                        fee_type_id: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fee_type_id,
                        idpath: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.idpath,
                        fin_fee_headeroffin_fee_types: arr
                    }).then(function (result) {
                        $("#LookModal").modal("hide");
                        // console.log("返回的结果", result)
                        $('#LookModal').on('hidden.bs.modal', function () {
                            $scope.treeSetting.hcGetChildNodes($scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                            $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData1.fin_fee_headeroffin_fee_types = result.fin_fee_headeroffin_fee_types;
                            var detail = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData1.fin_fee_headeroffin_fee_types.map(function (data) {
                                // console.log("明细数据",data)
                                return {
                                    name: data.fee_name,
                                    code: data.fee_code,
                                    data: data,
                                    type: 1
                                }
                            });
                            var sort = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData1.fin_fee_typeoffin_fee_types.map(function (data) {
                                return {
                                    name: data.fee_type_name,
                                    code: data.fee_type_code,
                                    data: data,
                                    type: 2
                                }
                            });
                            $scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData = sort.concat(detail);
                            $scope.gridOptions.api.setRowData(sort.concat(detail));
                        })
                    });
                }

                //加载明细表格
                function LoadDetailGrid() {
                    // console.log("树",$scope.treeSetting.zTreeObj)
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    if (node.data.fee_type_id == undefined) {
                        return swalApi.info('请选择正确节点').then($q.reject);

                    }
                    // console.log("当前选中",$scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                    $scope.fee_larType();
                    return requestApi.post({
                        classId: 'fin_fee_type',
                        action: 'get_fee_info',
                        data: {
                            fee_type_id: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fee_type_id,
                            idpath: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.idpath
                        }
                    })
                        .then(function (response) {
                            $scope.gridOptions1.hcApi.setRowData(response.fin_fee_headeroffin_fee_types);
                        });
                }

                //获取费用大类
                $scope.fee_larType = function () {
                    var a = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    // console.log("当前选中节点",a)
                    // if (a.data.pid == 0) {
                    //     return;
                    // }
                    $scope.ParentNode3 = a.name;
                    // 递归获取父节点
                    getParentNode1(a);

                    function getParentNode1(node) {
                        if (node.level == 1) {
                            $scope.ParentNode2 = node.name;
                            return;
                        }
                        var b = node.getParentNode()
                        getParentNode1(b);
                    }
                }
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);

/*
*
* $modal.open({ template: '无' });
 $modal.open({ template: 'SM', size: 'sm' });
 $modal.open({ template: 'MD', size: 'md' });
 $modal.open({ template: 'LG', size: 'lg' });
 $modal.open({ template: 'MAX', size: 'max' });
* */