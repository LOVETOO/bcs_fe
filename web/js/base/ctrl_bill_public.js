define(
    ['controllerApi', 'module', 'fileApi', 'services'],
    function (controllerApi, module, fileApi) {

        /**
         * public @tmy 17-feb-2016
         *
         */
        var ctrl_bill_public = [
            '$rootScope', '$scope', '$location', '$modal', '$timeout', 'BasemanService', '$state',
            function ($rootScope, $scope, $location, $modal, $timeout, BasemanService, $state) {
                //当前路由
                $scope._stat_name_ = $state.current.name;

                $scope.bill_stats = [{value: 1, desc: "制单"}, {value: 2, desc: "提交"}, {value: 3, desc: "审核中"}, {
                    value: 5,
                    desc: "已审核"
                }, {value: 99, desc: "已作废"}];
                //浏览页通用
                $scope.liul = function () {
                    if ($scope.opt_liul) {
                        $scope.col_liul = [];
                        var key = $scope.objconf.name;
                        var FrmInfotemp = datamap.get(key);
                        //对网格的列进行拓展
                        for (var i = 0; i < FrmInfotemp.thead.length; i++) {
                            if (FrmInfotemp.thead[i].type == "list") {
                                var object = {
                                    editable: false,
                                    filter: 'set',
                                    width: 150,
                                    cellEditor: "下拉框",
                                    enableRowGroup: true,
                                    enablePivot: true,
                                    enableValue: true,
                                    floatCell: true
                                };
                                if (FrmInfotemp.thead[i].width) {
                                    object.width = FrmInfotemp.thead[i].width;
                                }
                                object.cellEditorParams = {};
                                if (FrmInfotemp.thead[i].inherited) {
                                    if ($scope[FrmInfotemp.thead[i].inherited]) {
                                        object.cellEditorParams.values = $scope[FrmInfotemp.thead[i].inherited]
                                    } else {
                                        object.cellEditorParams.values = [];
                                    }

                                } else {
                                    FrmInfotemp.thead[i].dicts.forEach(function (value, index, array) {
                                        value.value = value.id;
                                        value.desc = value.name;
                                    });
                                    object.cellEditorParams.values = FrmInfotemp.thead[i].dicts;

                                }
                            } else {
                                var object = {
                                    editable: false,
                                    filter: 'text',
                                    width: 150,
                                    cellEditor: "文本框",
                                    enableRowGroup: true,
                                    enablePivot: true,
                                    enableValue: true,
                                    floatCell: true
                                };
                                if (FrmInfotemp.thead[i].width) {
                                    object.width = FrmInfotemp.thead[i].width;
                                }
                            }
                            object.headerName = FrmInfotemp.thead[i].name;
                            object.field = FrmInfotemp.thead[i].code;
                            $scope.col_liul.push(object);

                        }
                    }

                }
                //上一条或下一条
                $scope.move_data = function (flag) {
                    var data = $scope.gridGetData('opt_liul');
                    for (var i = 0; i < data.length; i++) {
                        if (parseInt($scope.data.currItem[$scope.objconf.key]) == parseInt(data[i][$scope.objconf.key])) {
                            break;
                        }
                    }
                    //上一条
                    if (flag == 1) {
                        if (i == 0) {
                            return;
                        } else {
                            $scope.data.currItem[$scope.objconf.key] = data[i - 1][$scope.objconf.key];
                            $scope.refresh(2);
                        }

                    }
                    //下一条
                    if (flag == 2) {
                        if (i == data.length - 1) {
                            return;
                        } else {
                            $scope.data.currItem[$scope.objconf.key] = data[i + 1][$scope.objconf.key];
                            $scope.refresh(2);
                        }
                    }


                }
                //??
                $rootScope.currScope = $scope;
                $("div[class='popover fade top in']").remove();
                $scope.closefrm = function () {
                    var alltab = localeStorageService.showtab.concat(localeStorageService.hidetab);

                    var p = '';
                    for (var i = 0; i < alltab.length; i++) {
                        var t = alltab[i];
                        if (i == 0) p = t.state;

                        if (t.state == $scope._stat_name_) {
                            var _p = alltab[i + 1];
                            if (_p) p = _p.state;
                            break;
                        }
                    }

                    $state.go(p);
                    localeStorageService.removetab($scope._stat_name_);
                    localeStorageService.remove($scope._stat_name_);
                }
                if (window.userbean) {
                    $scope.userbean = window.userbean;
                }

                /* 基本词汇值 */
                $scope.trueorfalses = [{value: 1, desc: "否"}, {value: 2, desc: "是"}];
                //记录用户数据表
                /**BasemanService.RequestPost("base_menu_log", "insert", {'menuname': $rootScope.$state.$current.data.pageTitle,'userid':window.userbean.userid,'option_time':moment().format('YYYY-MM-DD HH:mm:ss'),'url':$scope._stat_name_})
                 .then(function (data) {

	});*/
                $scope.data = {};
                //localeStorageService.set($scope._stat_name_,$scope.data);
                //$scope.data.khj=9999;
                //console.log(localeStorageService.get($scope._stat_name_));
                //数据校验 validateForm方法未有通过，暂时替换
                $scope.validate = function () {
                    return true;
                };

                $scope.wfstart_validDate = function () {
                    var is_pass = $scope.validate();
                    return is_pass;
                }

                $scope.getmax_length = function (params) {
                    var object = params.data;
                    var allcol = params.api.columnController.allDisplayedColumns;


                    //判断显示的列中是否有该字段。有的话返回字符长度和宽度的比例，无的话就返回false colId actualWidth

                    function getCol_width(allcol, name) {
                        for (var j = 0; j < allcol.length; j++) {
                            if (allcol[j].colId == name) {
                                return allcol[j].actualWidth
                            }
                        }
                        return false
                    }

                    var index = [];
                    for (name in object) {
                        if (getCol_width(allcol, name)) {
                            var temp_name = name;
                        }
                        index.push(name);
                    }

                    for (var i = 0; i < index.length; i++) {
                        if (getCol_width(allcol, index[i])) {
                            if (((object[temp_name] + '').length / getCol_width(allcol, temp_name)) < ((object[index[i]] + '').length / getCol_width(allcol, index[i]))) {
                                temp_name = index[i];
                            }
                        }

                    }
                    return (object[temp_name] + '').length / getCol_width(allcol, temp_name) * 10;
                }
                //查询
                $scope.search = function () {
                    $scope.FrmInfo = $scope.objconf.FrmInfo;
                    $scope.FrmInfo.classid = $scope.objconf.name;
                    $scope.FrmInfo.items = [];
                    if ($scope.data.items && $scope.objconf.autosaveresults) {
                        $scope.FrmInfo.items = $scope.data.items;
                    }
                    BasemanService.open(CommonPopController, $scope)
                        .result.then(function (result) {
                        if ($scope.objconf.autosaveresults) {
                            $scope.data.items = $scope.FrmInfo.items;
                        }

                        $scope.data.currItem = result;
                        $scope.data.currItem.copy = 0;
                        if (result[$scope.objconf.key] != 0) {
                            $scope.refresh(2);
                        }
                        if ($scope.opt_liul) {
                            $scope.opt_liul.api.setRowData($scope.data.items);
                            //单前双击行勾选
                            var nodes = $scope.opt_liul.api.getModel().rootNode.childrenAfterGroup;
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].data[$scope.objconf.key] == $scope.data.currItem[$scope.objconf.key]) {
                                    nodes[i].selected = true;
                                } else {
                                    nodes[i].selected = false;
                                }
                            }
                            $scope.opt_liul.api.refreshView();
                        }
                    });
                };
                $scope.rowDoubleClicked_liul = function (event) {
                    $scope.data.currItem[$scope.objconf.key] = event.data[$scope.objconf.key];
                    $scope.refresh(2);
                    //页面切换到基础信息页
                    $("li").removeClass('active');
                    $(".tab-pane").removeClass('active');
                    $(" #tabs li:first").addClass("active");
                    $(".tab-pane:first").addClass("active");

                }
                String.prototype.endsWith = function (suffix) {
                    return this.indexOf(suffix, this.length - suffix.length) !== -1;
                };
                //文件预览
                $scope.viewDoc = fileApi.openFile; /* function (doc) {
                    var url = "";
                    if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                        url = window.location.protocol + "//" + window.location.host + "/viewImage.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
                    }
                    else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx") || doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls") || doc.docname.toLowerCase().endsWith(".txt")) || (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                        url = window.location.protocol + "//" + window.location.host + "/viewFile.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
                    }
                    else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                        url = window.location.protocol + "//" + window.location.host + "/viewPDF.jsp?docid=" + doc.docid + "&filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname + "&loginguid=" + encodeURIComponent(strLoginGuid);
                    } else {
                        BasemanService.notice("文件格式不支持", "alert-info");
                    }
                    if (url.length > 1) {

                        window.open(url);
                    }
                } */
                //浏览页双击到基础信息

                /**
                 * 将网格数据设置到对象列表
                 * data : 主表
                 * before : 获取网格数据之前的方法
                 * after : 获取网格数据之后的方法
                 */
                $scope.getitemline = function (data, before) {
                    if (before && typeof before == "function") {
                        before();
                    }
                    if (!data) return;
                    for (var i = 0; i < $scope.objconf.grids.length; i++) {
                        if ($scope.objconf.grids[i].line && $scope[$scope.objconf.grids[i].line.optionname].api) {
                            $scope[$scope.objconf.grids[i].line.optionname].api.stopEditing(false);
                        }
                        if ($scope[$scope.objconf.grids[i].optionname] && $scope[$scope.objconf.grids[i].optionname].api) {

                            if ($scope[$scope.objconf.grids[i].optionname].api.getFocusedCell()) {
                                //切换不同菜单保留光标(同时为了不传数据给后台)
                                $scope.data[$scope.objconf.grids[i].optionname] = $scope[$scope.objconf.grids[i].optionname].api.getFocusedCell();
                                var index = $scope[$scope.objconf.grids[i].optionname].api.getFocusedCell().rowIndex;
                            } else {
                                var index = 0;
                            }
                            $scope[$scope.objconf.grids[i].optionname].api.stopEditing(false);
                            var data = [];
                            if ($scope.objconf.grids[i].istree) {
                                //遍历
                                //var data=$scope.gridGetTreePostData($scope.objconf.grids[i].optionname);
                                var nodes = $scope[$scope.objconf.grids[i].optionname].api.getModel().rootNode.childrenAfterGroup;
                                for (var j = 0; j < nodes.length; j++) {
                                    data.push(nodes[j].data);
                                }


                            } else {
                                var node = $scope[$scope.objconf.grids[i].optionname].api.getModel().rootNode.allLeafChildren;
                                for (var j = 0; j < node.length; j++) {
                                    data.push(node[j].data);
                                }
                            }
                            $scope.data.currItem[$scope.objconf.grids[i].idname] = data;

                            if ($scope.objconf.grids[i].line) {
                                if ($scope.data.currItem[$scope.objconf.grids[i].idname]) {
                                    if ($scope.data.currItem[$scope.objconf.grids[i].idname].length > 0) {
                                        if ($scope.data.currItem[$scope.objconf.grids[i].idname][index] && $scope.data.currItem[$scope.objconf.grids[i].idname][index][$scope.objconf.grids[i].line.idname]) {
                                            var data = [];
                                            if ($scope.objconf.grids[i].line.istree) {
                                                data = [$scope[$scope.objconf.grids[i].line.optionname].api.getModel().getRow(0).data];
                                            } else {
                                                var node = $scope[$scope.objconf.grids[i].line.optionname].api.getModel().rootNode.allLeafChildren;
                                                for (var j = 0; j < node.length; j++) {
                                                    data.push(node[j].data);
                                                }
                                            }
                                            // $scope.data.currItem[$scope.objconf.grids[i].idname][index][$scope.objconf.grids[i].line.idname] = data;
                                        }
                                    }
                                }
                            }

                        }

                    }

                    //处理z-tree 数据
                    if ($scope.objconf.z_trees) {
                        for (var i = 0; i < $scope.objconf.z_trees.length; i++) {
                            if ($scope.objconf.z_trees[i].optionname) {
                                var treeObj = $.fn.zTree.getZTreeObj($scope.objconf.z_trees[i].optionname);
                                var data = treeObj.getNodes();
                                $scope.data.currItem[$scope.objconf.z_trees[i].idname] = data;
                                $scope.data.currItem.selectNode = treeObj.getSelectedNodes();
                                treeObj.destroy();
                            }

                        }
                    }

                };

                /**
                 *  将列表对象设置到网格
                 *  data : 主表
                 *  type : resize(default),total...
                 *  ater : 设置网格数据之后
                 */
                $scope.setitemline1 = function (data) {
                    if (!data) return;
                    for (var i = 0; i < $scope.objconf.grids.length; i++) {
                        if ($scope[$scope.objconf.grids[i].optionname].api) {
                            if ($scope[$scope.objconf.grids[i].optionname].api.getFocusedCell()) {
                                var focusCell = $scope[$scope.objconf.grids[i].optionname].api.getFocusedCell();
                                var index = focusCell.rowIndex;


                            } else {
                                var index = 0;
                            }
                            if ($scope.objconf.grids[i].line) {
                                if (data[$scope.objconf.grids[i].idname] && data[$scope.objconf.grids[i].idname][index]
                                    && data[$scope.objconf.grids[i].idname][index][$scope.objconf.grids[i].line.idname]) {
                                    var griddata = data[$scope.objconf.grids[i].idname][index][$scope.objconf.grids[i].line.idname];
                                    if (griddata == undefined) {
                                        continue;
                                    }
                                    $scope[$scope.objconf.grids[i].line.optionname].api.setRowData(griddata);
                                    $scope[$scope.objconf.grids[i].line.optionname].api.hideOverlay();
                                    ;
                                }
                            }
                            var griddata = data[$scope.objconf.grids[i].idname];
                            if (griddata == undefined) {
                                continue;
                            }
                            $scope[$scope.objconf.grids[i].optionname].api.setRowData(griddata);
                            $scope[$scope.objconf.grids[i].optionname].api.hideOverlay();
                            ;
                            //加上这一段代码是为了在切换的时候保留光标
                            if ($scope.data[$scope.objconf.grids[i].optionname]) {
                                var focusCell = $scope.data[$scope.objconf.grids[i].optionname];
                                $scope[$scope.objconf.grids[i].optionname].api.setFocusedCell(parseInt(focusCell.rowIndex), focusCell.column.colId);
                            }

                        }
                    }


                };

                /**
                 * 设置网格状态
                 */
                $scope.setgridstat = function (stat) {
                    //if(data.stat && data.stat != 1){
                    if (stat == undefined) {
                        return;
                    }
                    for (var i = 0; i < $scope.objconf.grids.length; i++) {
                        if ($scope[$scope.objconf.grids[i].optionname].columnApi) {
                            var allcol = $scope[$scope.objconf.grids[i].optionname].columnApi.getAllColumns();

                            if (parseInt(stat) > 1 || $scope.searchlist) {
                                for (var j = 0; j < allcol.length; j++) {
                                    if (allcol[j].colDef.checkEdit) {
                                        allcol[j].colDef.editable = allcol[j].colDef.checkEdit();
                                        if (!allcol[j].colDef.editable) {
                                            allcol[j].colDef.cellClass = '';
                                        } else {
                                            allcol[j].colDef.cellClass = 'good-score';
                                        }
                                    } else {
                                        allcol[j].colDef.editable = false;
                                        allcol[j].colDef.cellClass = '';
                                    }
                                }
                            } else {
                                var defaultcols = $scope[$scope.objconf.grids[i].optionname].defaultColumns;
                                if (defaultcols) {
                                    for (var j = 0; j < allcol.length; j++) {
                                        if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {

                                            allcol[j].colDef.editable = defaultcols[j].editable;
                                            if (!allcol[j].colDef.editable) {
                                                allcol[j].colDef.cellClass = '';
                                            } else {
                                                allcol[j].colDef.cellClass = 'good-score';
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        if ($scope.objconf.grids[i].line && $scope[$scope.objconf.grids[i].line.optionname].columnApi) {
                            var allcol = $scope[$scope.objconf.grids[i].line.optionname].columnApi.getAllColumns();
                            if ((stat && parseInt(stat) > 1) || $scope.searchlist) {
                                for (var j = 0; j < allcol.length; j++) {
                                    allcol[j].colDef.editable = false;
                                }
                            } else {
                                var defaultcols = $scope[$scope.objconf.grids[i].line.optionname].defaultColumns;
                                if (defaultcols) {
                                    for (var j = 0; j < allcol.length; j++) {
                                        if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {
                                            allcol[j].colDef.editable = defaultcols[j].editable;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //下拉选项是否可编辑
                    $timeout(function () {
                        if ($scope.data.currItem.stat) {
                            if ($scope.data.currItem.stat == 1) {
                                $("select.chosen-select").each(function () {
                                    var _this = $(this);
                                    var c_disbled = false;
                                    var readonly1 = this.attributes["ng-readonly"];
                                    if (readonly1 != undefined) {
                                        var str = this.attributes["ng-readonly"].value;
                                        var c_disbled = true;
                                        if (str == "true" || str == "false") {
                                            c_disbled = eval(str)
                                        } else {
                                            str = str.replace(/data./g, "$scope.data.");
                                            c_disbled = eval(str);
                                        }
                                    }
                                    _this.attr('disabled', c_disbled).trigger("chosen:updated");
                                });
                            } else {
                                $("select.chosen-select").each(function () {
                                    var c_disbled = true;
                                    var readonly1 = this.attributes["ng-readonly"];
                                    if (readonly1 != undefined) {
                                        var str = this.attributes["ng-readonly"].value;
                                        var c_disbled = true;
                                        if (str == "true" || str == "false") {
                                            c_disbled = eval(str)
                                        } else {
                                            str = str.replace(/data./g, "$scope.data.");
                                            c_disbled = eval(str);
                                        }
                                    }
                                    var _this = $(this);
                                    _this.attr('disabled', c_disbled).trigger("chosen:updated");
                                });
                            }
                        }
                    }, 1000);
                };
                /**
                 * 刷新数据
                 * 占用refresh_after 方法 在刷新之后会被调用
                 */
                $scope.refresh = function (flag) {
                    $("div[class='popover fade top in']").remove();

                    var postdata = {};
                    postdata[$scope.objconf.key] = parseInt($scope.data.currItem[$scope.objconf.key]);
                    if ($scope.objconf.postdata) {
                        for (name in $scope.objconf.postdata) {
                            postdata[name] = $scope.objconf.postdata[name];
                        }
                    }
                    $scope.data.currItem.wfid = 0;
                    if ($scope.data.currItem.sqlwhere) {
                        postdata.sqlwhere = $scope.data.currItem.sqlwhere;
                    }
                    if (isNaN(postdata[$scope.objconf.key]) || postdata[$scope.objconf.key] == 0) {
                        BasemanService.notice("数据没有保存，无法刷新", "alert-warning");

                        return;
                    }
                    ;
                    BasemanService.RequestPost($scope.objconf.name, "select", postdata)
                        .then(function (data) {
                            //复制历史
                            if ($scope.data.currItem.copy) {
                                data.copy = $scope.data.currItem.copy;
                            }
                            $scope.data.currItem = (data);
                            if ($scope.refresh_after && typeof $scope.refresh_after == "function") {
                                try {
                                    $scope.refresh_after();
                                } catch (error) {
                                    BasemanService.notice(error.message)
                                }
                            }
                            $scope.setgridstat(data.stat);
                            $scope.setitemline1($scope.data.currItem);

                            if (flag != 2) {
                                BasemanService.notice("刷新成功", "alert-info");
                            }
                            //处理网格全选
                            var ecells = $(".selectAll");
                            for (var i = 0; i < ecells.length; i++) {
                                ecells[i].children[1].attributes.style.nodeValue = "display: inline;"
                                ecells[i].children[0].attributes.style.nodeValue = "display: none;"
                            }
                        }, function (error) {

                        });
                };
                /**
                 * 单据保存方法
                 * 占用validate方法 保存前的检验
                 * 占用save_before 方法 在流程启动会被调用
                 */
                $scope.save = function (flag, e) {
                    try {
                        if (!FormValidatorService.validatorFrom($scope)) {
                            return;
                        }
                        if (e) e.currentTarget.disabled = true;


                        if ($scope.validate()) {
                            var postdata = $scope.data.currItem;
                            $scope.getitemline($scope.data.currItem);
                            if ($scope.save_before && typeof $scope.save_before == "function") {//将某个数组删除，避免出现解析xml错误
                                $scope.save_before(postdata);
                            }
                            var action = "update";
                            if (postdata[$scope.objconf.key] == undefined || postdata[$scope.objconf.key] == 0) {
                                action = "insert";
                            }
                            var promise = BasemanService.RequestPost($scope.objconf.name, action, postdata);
                            promise.then(function (data) {
                                if (flag != 2) {
                                    BasemanService.notice("保存成功!", "alert-info");
                                }
                                $scope.data.currItem = data;
                                if ($scope.save_after && typeof $scope.save_after == "function") {
                                    $scope.save_after();
                                }
                                $scope.refresh(2);
                                if (action == "insert" && $scope.data.items) $scope.data.items.push($scope.data.currItem);
                                if (e) e.currentTarget.disabled = false;
                                return true;
                            }, function (error) {
                                if (e) e.currentTarget.disabled = false;
                            });
                        } else {
                            if (e) e.currentTarget.disabled = false;
                        }
                    } catch (error) {
                        if (e) e.currentTarget.disabled = false;
                        BasemanService.notice(error.message)
                    }
                };

                /**
                 * 删除单据
                 */
                $scope.delete = function (e, note) {

                    var postdata = {};
                    postdata[$scope.objconf.key] = $scope.data.currItem[$scope.objconf.key];

                    if (postdata[$scope.objconf.key] == undefined || postdata[$scope.objconf.key] == 0) {
                        BasemanService.notice("记录不存在，不能删除", "alert-warning");
                        return;
                    }
                    ;

                    function _delete() {
                        var promise = BasemanService.RequestPost($scope.objconf.name, "delete", postdata);
                        promise.then(function (data) {
                            try {
                                $scope.clearinformation1();
                            } catch (error) {
                            }
                            BasemanService.notice("删除成功!", "alert-info");

                            if (e) e.currentTarget.disabled = false;
                        }, function (error) {
                        });
                    }

                    if (e) e.currentTarget.disabled = true;

                    ds.dialog.confirm("确定删除整单？", function () {
                        _delete();
                    }, function () {
                        if (e) e.currentTarget.disabled = false;
                    });

                };
                /**
                 * 初始化方法
                 */
                $scope.clearinformation1 = function () {
                    if ($scope.clearinformation_before && typeof $scope.clearinformation_before == "function") {
                        $scope.clearinformation_before();
                    }
                    $scope.data = {
                        currItem: {
                            stat: 1,
                            creator: window.userbean.userid,
                            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                        },
                        items: [],
                        currItenIndex: -1,
                    };
                    if ($scope.clearinformation && typeof $scope.clearinformation == "function") {
                        $scope.clearinformation();
                    }
                    for (var i = 0; i < $scope.objconf.grids.length; i++) {
                        if ($scope[$scope.objconf.grids[i].optionname].api) {
                            if ($scope.objconf.grids[i].line) {
                                $scope[$scope.objconf.grids[i].line.optionname].api.setRowData([]);
                            }
                            $scope[$scope.objconf.grids[i].optionname].api.setRowData([]);

                        }
                    }


                };
                {
                    //关闭蒙板
                    function fnPIconfBgClose() {
                        if (!document.getElementById('divPIconfBg')) {
                            return;
                        }
                        if (!document.getElementById('divPIconfBgIframe')) {
                            return;
                        }
                        document.getElementById('divPIconfBgIframe').src = '';
                        document.getElementById('divPIconfBgIframe').style.display = 'none';
                        document.getElementById('divPIconfBg').style.display = 'none';

                        $("#divPIconfBgIframe").remove();
                        $("#divPIconfBg").remove();
                        $("#divPIconfBgClose").remove();
                        $scope.closeFrm();
                    }

                    $scope.openMoreNewFrm = function (pcsurl, object) {
                        if (object != undefined) {
                            pcsurl += "?param=" + $.base64.btoa(JSON.stringify(object), true);
                            ;
                        }
                        // window.location.href = pcsurl;
                        $scope.newWindow = window.open(pcsurl, "");
                        /**$timeout(function (){
				 $scope.newWindow.onbeforeunload =function(){
				 $scope.closeFrm();
			 };
			 },1000)*/

                    }
                    $scope.openNewFrm = function (pcsurl, object) {
                        var h = document.body.offsetHeight,
                            w = document.body.offsetWidth; //获取背景窗口大小
                        if (!document.getElementById('divPIconfBg')) {
                            var div = document.createElement('div'); //创建背景蒙板
                            div.id = 'divPIconfBg';
                            div.style.backgroundColor = 'white';
                            div.style.position = 'absolute';
                            // div.style.filter = 'alpha(opacity=80)';
                            // div.style.opacity = '.80';
                            div.style.zIndex = 100001;
                            div.style.left = 0;
                            div.style.top = 0;
                            div.style.width = w + 'px';
                            div.style.height = h + 'px';
                            document.body.appendChild(div);

                        }
                        if (!document.getElementById('divPIconfBgClose')) {
                            var div = document.createElement('div'); //创建关闭按钮在蒙板上
                            div.id = 'divPIconfBgClose';
                            div.style.backgroundColor = "#1ab394";
                            //div.style.position = 'absolute';
                            //div.style.backgroundImage = 'url(img/boxy_btn.png)';
                            div.style.zIndex = 100003;
                            div.style.left = 0;
                            div.style.top = 0;
                            div.style.width = w + "px";
                            div.style.height = '36px';

                            var divClose = document.createElement("a");
                            divClose.id = "divPIconfCloseBtn";
                            divClose.style.backgroundColur = "red";
                            divClose.style.position = 'absolute';
                            divClose.style.backgroundImage = 'url(img/boxy_btn.png)';
                            divClose.style.zIndex = 100004;
                            divClose.style.right = 0;
                            divClose.style.top = 0;
                            divClose.style.width = "120px";
                            divClose.style.height = '36px';
                            divClose.style.paddingTop = '10px';
                            divClose.title = '关闭';
                            divClose.innerHTML = "<<返回";
                            divClose.style.color = 'white';
                            divClose.style.font.size = "16px";
                            divClose.style.cursor = 'hand';
                            divClose.onclick = function () { //点击时间 ，关闭蒙板
                                fnPIconfBgClose();
                            };

                            div.appendChild(divClose);

                            document.getElementById('divPIconfBg').appendChild(div);
                        }
                        if (!document.getElementById('divPIconfBgIframe')) {
                            var iframe;
                            iframe = document.createElement('IFRAME'); //创建蒙板内的内嵌iframe容器，用于嵌入显示其他网页
                            iframe.id = 'divPIconfBgIframe';
                            iframe.frameBorder = '0';
                            //iframe.scrolling = "no";
                            iframe.style.overflow = 'hidden';
                            iframe.allowTransparency = 'true';
                            iframe.style.display = 'none';
                            iframe.style.width = w + 'px'; //800
                            iframe.style.height = h - 36 + 'px'; //620
                            iframe.style.top = '36px'; //800
                            document.getElementById('divPIconfBg').appendChild(iframe);
                        }

                        document.getElementById('divPIconfBgClose').style.display = 'block';
                        document.getElementById('divPIconfBgIframe').style.display = 'block';
                        if (object != undefined) {
                            pcsurl += "?param=" + $.base64.btoa(JSON.stringify(object), true);
                            ;
                        }
                        document.getElementById('divPIconfBg').style.display = 'block';
                        document.getElementById('divPIconfBgIframe').src = pcsurl;
                    }
                    //nodeid 根节点id(需要询问后台，一般是0)。root根节点。parentcode 父类是哪个字符。datas生成树状的原始数据。key节点id
                    $scope.setTree1 = function (nodeid, parentcode, datas, root, key) {
                        //判断是否有根节点
                        function ishasRoot(nodeid, datas) {
                            for (var i = 0; i < datas.length; i++) {
                                if (parseInt(data[i][key] || 0) == nodeid) {
                                    return true
                                }
                            }
                            if (i == datas.length) {
                                return false;
                            }
                        }

                        //得到根节点
                        function getRoot(nodeid, datas) {
                            for (var i = 0; i < datas.length; i++) {
                                if (parseInt(data[i][key] || 0) == nodeid) {
                                    return [data[i]];
                                }
                            }
                        }

                        //递归遍历数组，将根据父类一一放入
                        function setdata(root, datas, parentcode, key) {
                            for (var i = 0; i < root.length; i++) {
                                for (var j = 0; j < datas.length; j++) {
                                    if (parseInt(root[i][key]) == parseInt(datas[j][parentcode])) {
                                        if (root[i].children) {
                                            root[i].children.push(datas[j]);
                                        } else {
                                            root[i].children = [];
                                            root[i].children.push(datas[j]);
                                        }
                                        root[i].haschild = true;
                                        root[i].group = true;
                                        root[i].expanded = true;
                                    }
                                }
                                if (root[i].children) {
                                    setdata(root[i].children, datas, parentcode, key);
                                }
                            }
                        }

                        //如果原始数据中没有定义根节点，则可自己传入根节点
                        if (root) {
                            root[0].haschild = true;
                            root[0].group = true;
                            root[0].expanded = false;
                            setdata(root, datas, parentcode, key);
                            return root;
                        } else {
                            //得到根节点
                            if (ishasRoot(nodeid, datas)) {
                                var root = getRoot(nodeid, datas);
                                root[0].haschild = true;
                                root[0].group = true;
                                root[0].expanded = false;
                                setdata(root[0].children, datas, parentcode, key);
                                return root;
                            } else {
                                alert("数据没有根节点，请自行设置");
                            }

                        }
                    }
                }
                $scope.setSubTree = function (parentcode, key, treeData) {

                    var root = [];

                    //判断是否有父节点,如果没有对应的父节点，那么就认为是子树的根节点，根节点可能有多个
                    function hasParentNode(treeData, jData, parentcode, key) {
                        for (var i = 0; i < treeData.length; i++) {
                            if (parseInt(treeData[i][key]) == parseInt(jData[parentcode])) {
                                return false;
                            }
                            if (treeData[i].children) {
                                for (var j = 0; j < treeData[i].children.length; j++) {
                                    if (parseInt(treeData[i].children[j][key]) == parseInt(jData[parentcode])) {
                                        return false;
                                    }
                                }
                                hasParentNode(treeData[i].children, jData, parentcode, key);
                            }
                        }
                        return true;
                    }

                    for (var i = 0; i < treeData.length; i++) {
                        if (hasParentNode(treeData, treeData[i], parentcode, key)) {
                            root.push(treeData[i]);
                        }
                    }
                    $scope.setTree1(0, parentcode, treeData, root, key);
                }
                // nodes 前台传过来的节点 field value:nodes 里面的data的field字段等于value值时，那么nodes需要勾选
                $scope.setTreeSelected = function (options, nodes, field, value) {
                    //循环遍历节点，如果节点中挂有childrenAfterGroup节点那么继续循环遍历
                    function setSelected(nodes, field, value) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].data[field] == value) {
                                nodes[i].selected = true;
                            }
                            if (nodes[i].childrenAfterGroup) {
                                setSelected(nodes[i].childrenAfterGroup, field, value);
                            }
                        }

                    }

                    setSelected(nodes, field, value);
                    $scope[options].api.refreshView();
                }
                // nodes 前台传过来的节点 field value:nodes 勾选时，nodes 里面的data的field字段等于value值
                $scope.setTreeSelectedValue = function (nodes, field, value) {
                    function setSelectedValue(nodes, field, value) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].selected == true) {
                                nodes[i].data[field] = value
                            }
                            if (nodes[i].childrenAfterGroup) {
                                setSelectedValue(nodes[i].childrenAfterGroup, field, value);
                            }
                        }

                    }

                    setSelectedValue(nodes, field, value);
                }
                //处理树状网格的数据
                $scope.setTreeDelData = function (treeData, delData, key) {
                    //找到要删除数据的父节点
                    function delTreeData(treeData, delData, key) {
                        for (var i = 0; i < treeData.length; i++) {
                            if (parseInt(treeData[i][key]) == parseInt(delData[key])) {
                                treeData.expanded = true;
                                delete treeData.splice(i, 1);
                                return treeData;

                            }
                            if (treeData[i].children) {
                                for (var j = 0; j < treeData[i].children.length; j++) {
                                    if (parseInt(treeData[i].children[j][key]) == parseInt(delData[key])) {
                                        treeData[i].expanded = true;
                                        delete treeData[i].children.splice(j, 1);
                                        return treeData;
                                    }
                                }
                                delTreeData(treeData[i].children, delData, key);
                            }
                        }
                    }

                    delTreeData(treeData, delData, key);
                }

                $scope.gridGetTreeData = function (options, edit) {
                    if (!edit) {
                        $scope[options].api.stopEditing(false);
                    }
                    var node = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                    var data = [];
                    for (var i = 0; i < node.length; i++) {
                        data[i] = node[i].data
                    }
                    return data;

                }
                $scope.gridGetTreePostData = function (options) {
                    var post = [];
                    var treeData = $scope.gridGetTreeData(options);

                    function getTreePostData(treeData) {
                        for (var i = 0; i < treeData.length; i++) {
                            object = {};
                            for (name in treeData[i]) {
                                object[name] = treeData[i][name];
                            }
                            post.push(object);
                            if (treeData[i].children) {
                                delete post[post.length - 1].children;
                                getTreePostData(treeData[i].children);
                            }
                        }
                    }

                    getTreePostData(treeData);
                    return post;
                }
                $scope.gridDelTreeItem = function (options, key) {
                    var treeData = $scope.gridGetTreeData(options);
                    var delData = $scope.gridGetRow(options);
                    $scope.setTreeDelData(treeData, delData, key);
                    $scope[options].api.setRowData(treeData);
                }
                $scope.gridAddTreeItem = function (options, parentcode, key, datas) {
                    var subTree = $scope.setSubTree(parentcode, key, datas);
                    var treeData = gridGetTreeData(options);
                    treeData.push(subTree);
                    $scope[options].api.setRowData(treeData);
                }
                /**复选网格数据操作*/
                {
                    /** 写这个方法的目的就是为了直接对angularjs scope域上的网格定义editable改变生效。但是以后要尽量避免用这种方法。记住可以直接用aggrid上getAllColumns方法，取出所有网格后重新改变editable就可以了*/
                    $scope.updateColumns = function () {
                        if ($scope.data.currItem.stat < 5) {
                            var aggrid = $(".ag-blue");
                            for (var i = 0; i < aggrid.length; i++) {
                                if (aggrid[i].attributes["sg-columns"]) {
                                    if ($scope[aggrid[i].attributes["sg-options"].value] && $scope[aggrid[i].attributes["sg-options"].value].columnApi) {
                                        var columns = $scope[aggrid[i].attributes["sg-options"].value].columnApi.getAllColumns();
                                        for (var j = 0; j < columns.length; j++) {
                                            columns[j].colDef.editable = $scope[aggrid[i].attributes["sg-columns"].value][j].editable;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $scope.getIndexByField = function (columns, field, flag) {
                        if (flag == 2) {
                            for (var i = 0; i < $scope[columns].length; i++) {
                                if ($scope[columns][i].field == field) {
                                    return $scope[columns];
                                }
                                if (!($scope[columns][i].children instanceof Array)) {
                                    continue;
                                }
                                for (var j = 0; j < $scope[columns][i].children.length; j++) {
                                    if ($scope[columns][i].children[j].field == field) {
                                        return $scope[columns][i].children[j];
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < $scope[columns].length; i++) {
                            if ($scope[columns][i].field == field) {
                                return i;
                                break;
                            }
                        }
                        return false

                    }

                }

                /**普通网格数据操作*/
                {
                    $scope.gridGetSelectedData = function (options, edit) {
                        if (!edit) {
                            $scope[options].api.stopEditing(false);
                        }
                        var allNodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                        var selectDatas = []
                        for (var i = 0; i < allNodes.length; i++) {
                            if (allNodes[i].selected) {
                                selectDatas.push(allNodes[i].data)
                            }
                        }
                        return selectDatas;
                    }

                    $scope.gridDelselectedData = function (options, seqColumn) {
                        var allNodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                        var noSelectDatas = [];
                        for (var i = 0; i < allNodes.length; i++) {
                            if (!allNodes[i].selected) {
                                noSelectDatas.push(allNodes[i].data)
                            }
                        }
                        $scope[options].api.setRowData(noSelectDatas);
                        return noSelectDatas;
                    }

                    /**获取所有数据*/
                    $scope.gridGetData = function (options, edit) {
                        if (!edit) {
                            $scope[options].api.stopEditing(false);
                        }
                        var node = $scope[options].api.getModel().rootNode.allLeafChildren;
                        var data = [];
                        for (var i = 0; i < node.length; i++) {
                            data[i] = node[i].data
                        }
                        return data;
                    }
                    /**重新设置所有数据*/
                    $scope.gridSetData = function (options, data, seqColumn, refreshSeq) {
                        if (data.length == undefined || data.length == "") {
                            data = [];
                        }
                        seqColumn = seqColumn || "seq";
                        refreshSeq = refreshSeq || true;
                        if (refreshSeq) {
                            for (var i = 0; i < data.length; i++) {
                                data[i][seqColumn] = i + 1;
                            }
                        }
                        $scope[options].api.setRowData(data);
                        $scope[options].api.refreshView()
                    }
                    /**增加行
                     * inputobj=undefined表示不需要赋值
                     * datas=undefined表示不需要赋值
                     * */
                    $scope.gridAddItem = function (options, object) {
                        var datas = $scope.gridGetData(options);
                        var data = [];
                        //初始化赋值
                        if (object == undefined) {
                            object = {};

                        }
                        data.push(object);
                        datas = datas.concat(data);
                        $scope[options].api.setRowData(datas);
                        $scope[options].api.refreshView();
                    }

                    $scope.gridAddLine = function (options, array) {
                        //初始化赋值
                        if (array == undefined) {
                            array = [];

                        }
                        array.push({});
                        $scope[options].api.setRowData(array);
                        $scope[options].api.refreshView();
                    }

                    /**删除行*/
                    $scope.gridDelItem = function (options) {
                        $scope[options].api.stopEditing(false);
                        var node = $scope[options].api.getModel().rootNode.allLeafChildren;
                        if ($scope[options].api.getFocusedCell() == null && !(canDelLast)) {
                            BasemanService.notice("请选中需要删除行");
                            return false;
                        }
                        var cell = $scope[options].api.getFocusedCell();
                        var rowIndex = $scope[options].api.getFocusedCell().rowIndex;
                        var index = parseInt($scope[options].api.getModel().rowsToDisplay[rowIndex].id);
                        var data = $scope.gridGetData(options);
                        for (var i = 0; i < node.length; i++) {
                            if (parseInt(node[i].id) == index) {
                                data.splice(i, 1);
                                break;
                            }
                        }

                        $scope[options].api.setRowData(data);
                        $scope[options].api.refreshView();

                        for (var i = 0; i < $scope.objconf.grids.length; i++) {
                            //如果删除的是主表，需要对光标的顺序和子表的数据进行处理
                            if ($scope.objconf.grids[i].optionname == options && $scope.objconf.grids[i].line) {
                                var cell = $scope[options].api.getFocusedCell();
                                var rowidx = cell.rowIndex;
                                if (rowidx > 0) {
                                    var rowidx = rowidx - 1;
                                    var colKey = $scope[options].api.getFocusedCell().column.colId
                                    $scope[options].api.setFocusedCell(rowidx, colKey);
                                    $scope[$scope.objconf.grids[i].line.optionname].api.setRowData(data[rowidx][$scope.objconf.grids[i].line.idname]);
                                } else {
                                    if ($scope[options].api.getModel().rootNode.childrenAfterSort.length == 0) {
                                        $scope[$scope.objconf.grids[i].line.optionname].api.setRowData([]);
                                    } else {
                                        var rowidx = rowidx;
                                        var colKey = $scope[options].api.getFocusedCell().column.colId
                                        $scope[options].api.setFocusedCell(rowidx, colKey);
                                        $scope[$scope.objconf.grids[i].line.optionname].api.setRowData(data[rowidx + 1][$scope.objconf.grids[i].line.idname]);
                                    }
                                }
                            }
                            //如果删除的是子表，需要对子表的数据重新赋值
                            if ($scope.objconf.grids[i].line && $scope.objconf.grids[i].line.optionname == options) {
                                if ($scope[$scope.objconf.grids[i].optionname].api.getFocusedCell()) {
                                    var cell = $scope[$scope.objconf.grids[i].optionname].api.getFocusedCell();
                                    var rowidx = cell.rowIndex;
                                } else {
                                    var rowidx = 0;
                                }

                                $scope.data.currItem[$scope.objconf.grids[i].idname][rowidx][$scope.objconf.grids[i].line.idname] = data;
                            }
                        }
                        ;
                    }
                    $scope.gridAfterFocusCell = function (options, object, isSelectd) {
                        if ($scope[options].api.getFocusedCell()) {
                            var cell = $scope[options].api.getFocusedCell();
                            var rowidx = cell.rowIndex;
                        } else {
                            return;
                        }
                        $scope[options].api.insertItemsAtIndex(rowidx + 1, [object]);
                        if (isSelectd) {
                            var nodes = $scope[options].api.getModel().rootNode.childrenAfterSort;
                            nodes[rowidx + 1].selected = true;
                            $scope[options].api.refreshRows(nodes);
                        }
                    }
                    /**获取行*/
                    $scope.gridGetRow = function (options, edit) {
                        if (!edit) {
                            $scope[options].api.stopEditing(false);
                        }
                        //改成rowsToDisplay是为了处理树状结构
                        var node = $scope[options].api.getModel().rowsToDisplay;
                        if (node.length == 0) {
                            return false;
                        }
                        var cell = $scope[options].api.getFocusedCell();
                        if(cell==null)
                            return null;
                        var rowIndex = $scope[options].api.getFocusedCell().rowIndex;
                        var index = parseInt($scope[options].api.getModel().rowsToDisplay[rowIndex].id);
                        for (var i = 0; i < node.length; i++) {
                            if (parseInt(node[i].id) == index) {
                                return node[i].data;
                            }
                        }
                    }
                    /**更新行*/
                    $scope.gridUpdateRow = function (options, updateObj, seqColumn) {
                        if ($scope[options].api.getFocusedCell() == null) {
                            return false;
                        }
                        var rowIndex = $scope[options].api.getFocusedCell().rowIndex;
                        var index = parseInt($scope[options].api.rowRenderer.renderedRows[rowIndex].rowNode.id);
                        var node = $scope[options].api.getModel().rootNode.allLeafChildren;
                        for (var i = 0; i < node.length; i++) {
                            if (parseInt(node[i].id) == index) {
                                node[i].data = updateObj;
                            }
                        }
                        $scope[options].api.refreshRows(node)
                    }
                    /** 对网格的数据根据字段由小到大排序*/
                    $scope.gridSortmin = function (options, field) {
                        var data = $scope.gridGetData(options);
                        var temp = {};
                        for (var i = data.length - 1; i > -1; i--) {
                            for (var j = 0; j < i; j++) {
                                if (parseInt(data[j][field]) > parseInt(data[j + 1][field])) {
                                    temp = data[j];
                                    data[j] = data[j + 1];
                                    data[j + 1] = temp;
                                }
                            }
                        }
                        $scope[options].api.setRowData(data);
                    }
                    /**网格数据上移*/
                    $scope.gridDataUp = function (options, field) {
                        //如果没有取中选中的数据，返回
                        if ($scope[options].api.getFocusedCell()) {
                            var cell = $scope[options].api.getFocusedCell();
                            var nodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                        } else {
                            return;
                        }
                        //最上层时返回
                        if (cell.rowIndex == 0) {
                            return;
                        } else {
                            var rowidx = cell.rowIndex;
                            var temp = {};
                            HczyCommon.copyobj(nodes[rowidx - 1].data, temp);
                            $scope[options].api.setFocusedCell(rowidx - 1, cell.column.colId);
                            if (field) {
                                temp[field] = parseInt(temp[field]) + 1;
                                nodes[rowidx].data[field] = parseInt(nodes[rowidx].data[field]) - 1;
                            }

                            nodes[rowidx - 1].data = nodes[rowidx].data;
                            nodes[rowidx].data = temp;
                            $scope[options].api.refreshView();
                        }
                    }
                    /**网格数据下移*/
                    $scope.gridDataDown = function (options, field) {
                        //如果没有取中选中的数据，返回
                        if ($scope[options].api.getFocusedCell()) {
                            var cell = $scope[options].api.getFocusedCell();
                            var nodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                        } else {
                            return;
                        }
                        //最下层时返回
                        if (cell.rowIndex == parseInt(nodes.length - 1)) {
                            return;
                        } else {
                            var rowidx = cell.rowIndex;
                            var temp = {};
                            HczyCommon.copyobj(nodes[rowidx + 1].data, temp);
                            $scope[options].api.setFocusedCell(rowidx + 1, cell.column.colId);
                            if (field) {
                                temp[field] = parseInt(temp[field]) - 1;
                                nodes[rowidx].data[field] = parseInt(nodes[rowidx].data[field]) + 1;
                            }
                            nodes[rowidx + 1].data = nodes[rowidx].data;
                            nodes[rowidx].data = temp;
                            $scope[options].api.refreshView();
                        }
                    }
                    /** 网格判断是否有该行数据*/
                    $scope.gridHasData = function (options, field, data) {
                        var nodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].data[field] == data) {
                                return true;
                            }
                        }
                        return false;

                    }
                    /**
                     切换时记录网格的勾选数据
                     1.设置两个数组index和contains,分别记录对应主表数据的是光标第几行（0为第一行）和对应的细表的节点数据。
                     2.如果是没有光标的情况下，那么对应的index为0。将其放入index数组中。将其最原始的节点放入到contains里。
                     3.如果是有关标的话。那么就要判断index里面是否有存在，如果存在的话讲contains里面的数据更新。如果不存在那么
                     index和contains要分别记录数据
                     options 父表网格options，optionsline 子表网格。
                     */
                    $scope.index = [];
                    $scope.contains = [];
                    $scope.before = 0;
                    $scope.deal_dataSelected = function (options, optionsline, data) {
                        if ($scope.index.length != 0) {
                            var index = $scope[options].api.getFocusedCell().rowIndex;
                            for (var i = 0; i < $scope.index.length; i++) {
                                if (parseInt($scope.index[i]) == parseInt(index)) {
                                    //先更新切换数据之前的数据
                                    var nodes = $scope[optionsline].api.getModel().rootNode.allLeafChildren;
                                    $scope.contains[$scope.before] = nodes;
                                    $scope.before = index;
                                    //对于切换后的网格数据进行赋值
                                    $scope[optionsline].api.setRowData(data);
                                    var nodes = $scope[optionsline].api.getModel().rootNode.allLeafChildren;
                                    for (var j = 0; j < $scope.contains[i].length; j++) {
                                        if ($scope.contains[i][j].selected == true) {
                                            $scope[optionsline].api.clipboardService.selectionController.selectedNodes[nodes[j].id] = nodes[j]
                                            nodes[j].selected = true
                                        } else {
                                            $scope[optionsline].api.clipboardService.selectionController.selectedNodes[nodes[j].id] = undefined;
                                            nodes[j].selected = false
                                        }
                                    }
                                    $scope[optionsline].api.refreshRows(nodes);
                                    break;
                                }
                            }
                            if (i == $scope.index.length) {
                                //先更新切换数据之前的数据
                                var nodes = $scope[optionsline].api.getModel().rootNode.allLeafChildren;
                                $scope.contains[$scope.contains.length - 1] = nodes;
                                //对于切换后的网格数据进行赋值
                                $scope[optionsline].api.setRowData(data);
                                var index = $scope[options].api.getFocusedCell().rowIndex;
                                $scope.before = index;
                                var nodes = $scope[optionsline].api.getModel().rootNode.allLeafChildren;
                                $scope.index.push(index);
                                $scope.contains.push(nodes);
                            }
                        } else {
                            var index = 0;
                            $scope.index.push(index);
                            var nodes = $scope[options].api.getModel().rootNode.allLeafChildren;
                            $scope.contains.push(nodes[index]);
                        }
                    }
                    //统一处理网格切换事件时的产生的光标下移的问题
                    $scope.deal_rowClicked = function (father, childrens) {
                        if ($scope[father].api.getFocusedCell()) {
                            var colid = $scope[father].api.getFocusedCell().column.colId;
                            for (var i = 0; i < childrens.length; i++) {
                                $scope[childrens[i]].api.setFocusedCell(-1, colid);
                            }
                        }
                    }
                    /**数组处理 *******/
                    //获取最大值
                    $scope.getmax = function (array, field) {
                        var temp = 0;
                        if (array == undefined || array.length == 0) {
                            return 0;
                        }
                        for (var i = 0; i < array.length; i++) {
                            if ((parseInt(array[i][field]) > temp)) {
                                temp = parseInt(array[i][field]);
                            }
                        }
                        return temp;
                    }
                    //数组判断是否有该行记录
                    $scope.arrayHasData = function (array, field, data) {
                        for (var i = 0; i < array.length; i++) {
                            if (array[i][field] == data) {
                                return true;
                            }
                        }
                        return false;
                    }
                    $scope.arrayGetIndex = function (array, field, data) {
                        for (var i = 0; i < array.length; i++) {
                            if (array[i][field] == data) {
                                return i;
                            }
                        }
                    }
                    //删除该行记录
                    $scope.arrayDelData = function (array, field, data) {
                        if ($scope.arrayHasData(array, field, data)) {
                            array.splice($scope.arrayGetIndex(array, field, data), 1);
                        }
                        return array;
                    }
                    $scope.del_icon = function () {
                        var name = event.currentTarget.parentNode.childNodes[1].attributes["ng-model"].nodeValue.substring(1000, 14);
                        if (name.indexOf("_") > -1) {
                            var pre = name.split("_")[0];
                            $scope.data.currItem[name] = "";
                            $scope.data.currItem[pre + "_name"] = "";
                            $scope.data.currItem[pre + "_id"] = "";
                            $scope.data.currItem[pre + "_code"] = "";
                        }
                    }
                    //禁用退格键
                    $scope.forbidBackSpace = function (e) {
                        var ev = e || window.event; //获取event对象
                        var obj = ev.target || ev.srcElement; //获取事件源
                        var t = obj.type || obj.getAttribute('type') || obj.getAttribute('class'); //获取事件源类型
                        //获取作为判断条件的事件类型
                        var vReadOnly = obj.readOnly;
                        var vDisabled = obj.disabled;
                        //处理undefined值情况
                        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
                        vDisabled = (vDisabled == undefined) ? true : vDisabled;
                        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
                        //并且readOnly属性为true或disabled属性为true的，则退格键失效
                        var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
                        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
                        var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number" && t != "note-editable panel-body";
                        //判断
                        if (flag2 || flag1) return false;
                    }
                    //禁止后退键 作用于Firefox、Opera
                    document.onkeypress = $scope.forbidBackSpace;
                    //禁止后退键  作用于IE、Chrome
                    document.onkeydown = $scope.forbidBackSpace;

                }
                /*下拉属性查询*/
                {
                    //下拉属性查询
                    BasemanService.getParametersK = function (scope, param) {
                        if (!param) return;
                        for (var i = 0; i < param.length; i++) {
                            this.RequestPost("base_search", "searchdict", {
                                importdataflag: i,
                                dictcode: "" + param[i].field
                            })
                                .then(function (data) {
                                    for (var j = 0; j < data.dicts.length; j++) {
                                        data.dicts[j].id = parseInt(data.dicts[j].dictvalue);
                                        data.dicts[j].name = data.dicts[j].dictname;
                                        data.dicts[j].value = parseInt(data.dicts[j].dictvalue);
                                        data.dicts[j].desc = data.dicts[j].dictname;
                                    }
                                    //根据ID排序
                                    HczyCommon.arrSortId(data.dicts);
                                    scope[param[data.importdataflag].field + "s"] = data.dicts;
                                    //根据情况放进网格
                                    if (param[data.importdataflag].is_grid) {
                                        if (!param[data.importdataflag].fieldk) {
                                            param[data.importdataflag].fieldk = param[data.importdataflag].field;
                                        }
                                        for (var t = 0; t < param[data.importdataflag].options.length; t++) {
                                            for (var p = 0; p < scope[param[data.importdataflag].options[t]].length; p++) {
                                                if (scope[param[data.importdataflag].options[t]][p].field == param[data.importdataflag].fieldk) {
                                                    scope[param[data.importdataflag].options[t]][p].cellEditorParams.values = scope[param[data.importdataflag].field + "s"];
                                                }
                                            }
                                        }

                                    }
                                });
                        }
                    };
                }

                /*清除*/
                {
                    $scope.FaTimes = function (e) {
                        var $i = $(e.currentTarget).siblings();//所有兄弟元素
                        var ngmodel = $(e.currentTarget).siblings().attr("ng-model");
                        var list = ngmodel.split(".");
                        if (!list) {
                            BasemanService.notice("找不到绑定对象，请检查ng-model属性！", "alert-info");
                            return;
                        }
                        var last = list[list.length - 1];//存放最后一个字段
                        var lastk = [];//存放转换的ID
                        if (last.indexOf("_names") >= 0) {//判断是否为多选型
                            lastk.push(last.replace("_names", "_ids"));//将_names转换为_ids
                        } else {
                            lastk.push(last.replace("_name", "_id"));//将_name转换为_id
                        }
                        if (list.length == 2) {//为$scope.item类型
                            $scope[list[0]][list[1]] = "";//只能清界面上的，无法清除ID
                            if ($scope[list[0]][lastk[0]]) {
                                $scope[list[0]][lastk[0]] = null;
                            }
                        } else if (list.length == 3) {//$scope.data.currItem类型
                            $scope[list[0]][list[1]][list[2]] = "";//只能清界面上的，无法清除ID
                            if ($scope[list[0]][list[1]][lastk[0]]) {
                                $scope[list[0]][list[1]][lastk[0]] = null;
                            }
                        }
                    }
                }


                /**
                 * 流程启动
                 * wfstart_before 方法 在流程启动会被调用{返回true[通过] 、 false[不通过]}
                 */
                $scope.wfstart = function (e) {
                    if ($scope.data.currItem[$scope.objconf.key] == 0 || $scope.data.currItem[$scope.objconf.key] == undefined) {
                        BasemanService.notice("请先保存再提交")
                        return
                    }
                    try {
                        if (!FormValidatorService.validatorFrom($scope)) {
                            return;
                        }
                        if (e) e.currentTarget.disabled = true;
                        $scope.getitemline($scope.data.currItem);

                        if ($scope.wfstart_validDate()) {
                            var postdata = $scope.data.currItem;
                            if ($scope.save_before && typeof $scope.save_before == "function") {//将某个数组删除，避免出现解析xml错误
                                $scope.save_before(postdata);
                            }
                            var action = "update";
                            if (postdata[$scope.objconf.key] == undefined || postdata[$scope.objconf.key] == 0) {
                                action = "insert";
                            }
                            var promise = BasemanService.RequestPost($scope.objconf.name, action, postdata);
                            promise.then(function (data) {
                                if ($scope.wfstart_before && typeof $scope.wfstart_before == "function") {

                                    var obj = $scope.wfstart_before();
                                    if (obj) {
                                        obj.then(function (data) {
                                            var postdata = {
                                                objtypeid: $scope.objconf.wftempid,
                                                objid: $scope.data.currItem[$scope.objconf.key]
                                            }
                                            BasemanService.RequestPost("base_wf", "getwftemplist", postdata)
                                                .then(function (re) {
                                                    $scope.data.wftemps = re.wftemps;
                                                    if (re.wftemps.length == 0) {
                                                        BasemanService.notice("无模板返回，请检查", "alert-warning");
                                                        return;
                                                    }
                                                    //如果只有单模板的返回，那么直接触发选择节点用户，如果返回多个模板，那么选择
                                                    if (re.wftemps.length == 1) {
                                                        $scope.ass_wftempid = re.wftemps[0].ass_wftempid;
                                                        $scope.triggeruser();
                                                    } else {
                                                        //弹出选择框
                                                        BasemanService.openFrm("views/wf/wf_choose_temps.html", wf_choose_temps, $scope)
                                                            .result.then(function (reline) {
                                                            //选中的模板id，然后传给后台
                                                            $scope.ass_wftempid = reline.ass_wftempid;
                                                            //选完后触发用户节点选择
                                                            $scope.triggeruser();
                                                            if (e) e.currentTarget.disabled = false;
                                                        })
                                                    }

                                                })

                                            $scope.triggeruser = function () {
                                                var postdata = {
                                                    objtypeid: parseInt($scope.objconf.wftempid),
                                                    objid: $scope.data.currItem[$scope.objconf.key],
                                                    ass_wftempid: parseInt($scope.ass_wftempid),
                                                }
                                                BasemanService.RequestPost("base_wf", "getpositionuser", postdata)
                                                    .then(function (data) {
                                                        if (e) e.currentTarget.disabled = false;
                                                        $scope.data.wfprocs = data.wfprocs;
                                                        $scope.procusers = [];
                                                        $scope.i = 0;
                                                        $scope.callback = function (i) {
                                                            BasemanService.openFrm("views/wf/wf_choose_options.html", wf_choose_options, $scope)
                                                                .result.then(function (result) {
                                                            })
                                                        }
                                                        if ($scope.data.wfprocs.length != 0) {
                                                            /**if($scope.data.wfprocs.length==1&&$scope.data.wfprocs[0].userofwfprocs.length<=1){
												 $scope.procusers = $scope.data.wfprocs;
												 $scope.procusers[0].procid=$scope.data.wfprocs[0].proctempid;
												 $scope.trigger();
												 return;

											}*/
                                                            //判断岗位是否有多个人。只要有直接弹出框，剩下的弹出框由弹出框控制器进行处理。如果没有，直接触发流程
                                                            for (var i = 0; i < $scope.data.wfprocs.length; i++) {
                                                                if ($scope.data.wfprocs[i].userofwfprocs.length == 1) {
                                                                    $scope.data.wfprocs[i].procid = $scope.data.wfprocs[i].proctempid;
                                                                    $scope.procusers.push($scope.data.wfprocs[i]);
                                                                    continue;
                                                                } else {
                                                                    $scope.i = i;
                                                                    BasemanService.openFrm("views/wf/wf_choose_options.html", wf_choose_options, $scope)
                                                                        .result.then(function (result) {

                                                                    })
                                                                    return;
                                                                    ;
                                                                }
                                                            }
                                                            $scope.procusers = $scope.data.wfprocs;
                                                            //$scope.procusers[0].procid=$scope.data.wfprocs[0].proctempid;
                                                            $scope.trigger();

                                                        } else {
                                                            $scope.trigger()
                                                        }

                                                    });
                                            }
                                            $scope.trigger = function () {
                                                if (e) e.currentTarget.disabled = true;
                                                var postdata = {
                                                    opinion: '',
                                                    objtypeid: $scope.objconf.wftempid,
                                                    objid: $scope.data.currItem[$scope.objconf.key], //单据ID
                                                    procusers: $scope.procusers,
                                                    ass_wftempid: parseInt($scope.ass_wftempid),
                                                    wfid: 0 // 流程ID
                                                };
                                                BasemanService.RequestPost("base_wf", "start", postdata)
                                                    .then(function (data) {
                                                        BasemanService.notice("启动成功", "alert-info");
                                                        $scope.data.currItem.wfid = data.wfid;
                                                        $scope.data.currItem.stat = data.stat;
                                                        if (e) e.currentTarget.disabled = false;

                                                        $scope.refresh(2);
                                                    }, function (error) {
                                                        if (e) e.currentTarget.disabled = false;
                                                    });
                                            }
                                        }, function (error) {
                                            if (e) e.currentTarget.disabled = false;
                                            return;
                                        })

                                    } else {
                                        if (e) e.currentTarget.disabled = false;
                                    }
                                } else {
                                    var postdata = {
                                        objtypeid: $scope.objconf.wftempid,
                                        objid: $scope.data.currItem[$scope.objconf.key]
                                    }
                                    BasemanService.RequestPost("base_wf", "getwftemplist", postdata)
                                        .then(function (re) {
                                            $scope.data.wftemps = re.wftemps;
                                            if (re.wftemps.length == 0) {
                                                BasemanService.notice("无模板返回，请检查", "alert-warning");
                                                return;
                                            }
                                            //如果只有单模板的返回，那么直接触发选择节点用户，如果返回多个模板，那么选择
                                            if (re.wftemps.length == 1) {
                                                $scope.ass_wftempid = re.wftemps[0].ass_wftempid;
                                                $scope.triggeruser();
                                            } else {
                                                //弹出选择框
                                                BasemanService.openFrm("views/wf/wf_choose_temps.html", wf_choose_temps, $scope)
                                                    .result.then(function (reline) {
                                                    //选中的模板id，然后传给后台
                                                    $scope.ass_wftempid = reline.ass_wftempid;
                                                    //选完后触发用户节点选择
                                                    $scope.triggeruser();
                                                    if (e) e.currentTarget.disabled = false;
                                                })
                                            }

                                        })

                                    $scope.triggeruser = function () {
                                        var postdata = {
                                            objtypeid: parseInt($scope.objconf.wftempid),
                                            objid: $scope.data.currItem[$scope.objconf.key],
                                            ass_wftempid: parseInt($scope.ass_wftempid)
                                        }
                                        BasemanService.RequestPost("base_wf", "getpositionuser", postdata)
                                            .then(function (data) {
                                                if (e) e.currentTarget.disabled = false;
                                                $scope.data.wfprocs = data.wfprocs;
                                                $scope.procusers = [];
                                                $scope.i = 0;
                                                $scope.callback = function (i) {
                                                    BasemanService.openFrm("views/wf/wf_choose_options.html", wf_choose_options, $scope)
                                                        .result.then(function (result) {
                                                    })
                                                }
                                                if ($scope.data.wfprocs.length != 0) {
                                                    BasemanService.openFrm("views/wf/wf_choose_options.html", wf_choose_options, $scope)
                                                        .result.then(function (result) {
                                                    })
                                                } else {
                                                    $scope.trigger();
                                                }
                                            });
                                    }

                                    $scope.trigger = function () {
                                        if (e) e.currentTarget.disabled = true;
                                        var postdata = {
                                            opinion: '',
                                            objtypeid: $scope.objconf.wftempid,
                                            objid: $scope.data.currItem[$scope.objconf.key], //单据ID
                                            procusers: $scope.procusers,
                                            ass_wftempid: parseInt($scope.ass_wftempid),
                                            wfid: 0 // 流程ID
                                        };
                                        BasemanService.RequestPost("base_wf", "start", postdata)
                                            .then(function (data) {
                                                BasemanService.notice("启动成功", "alert-info");
                                                $scope.data.currItem.wfid = data.wfid;
                                                $scope.data.currItem.stat = data.stat;
                                                if (e) e.currentTarget.disabled = false;
                                                $scope.refresh(2);
                                            }, function (error) {
                                                if (e) e.currentTarget.disabled = false;
                                            });
                                    }
                                }
                            }, function (error) {
                                if (e) e.currentTarget.disabled = false;
                            });
                        } else {
                            if (e) e.currentTarget.disabled = false;
                        }
                    } catch (error) {
                        if (e) e.currentTarget.disabled = false;
                        BasemanService.notice(error.message)
                    }

                    //返回即提交

                };
                /**
                 * 新建方法 -- 调用初始化方法
                 */
                $scope.new = function () {
                    $scope.clearinformation1();

                    //处理tab
                    $($("#maintabs").children("li")).removeClass('active')
                    $($("#maintabs").children("li").get(0)).addClass('active')
                    $(".main-tab-pane").removeClass('active')
                    $("#tab1").addClass('active')

                    $scope.setgridstat($scope.data.currItem.stat);
                    $timeout(function () {
                        $("select.chosen-select").each(function () {
                            var _this = $(this);
                            var c_disbled = false;
                            if (_this.chosen) {
                                if (_this.attr("readonly") && _this[0].disabled) {
                                    c_disbled = true;
                                }
                            }
                            _this.attr('disabled', c_disbled).trigger("chosen:updated");
                        });
                    }, 500);
                };

                $scope.initdata = function () {
                    $scope.liul();
                    //处理参数，参数优先
                    if ($location.search().param != undefined) {

                        //var x = $location.search().param;
                        $.base64.utf8encode = true;
                        //var y = $.base64.atob(x, true);

                        var x = JSON.parse($.base64.atob($location.search().param, true));
                        if (x) {//记录参数
                            $scope.page_param = x;
                            if ($scope.page_param.showmode != undefined) {//如果含有showmode则记录下root
                                $rootScope.showmode = $scope.page_param.showmode;
                            }
                        }
                        if (x.userid) {
                            if (x.userid != window.strUserId) {
                                console.warn("UserID Was not The same");
                                //中文乱码问题
//                    return;
                            }
                        }
                        if (x.searchlist) {
                            $scope.searchlist = x.searchlist;
                        } else {
                            $scope.searchlist = false
                        }
                        if (x.id) {
                            $scope.data = {currItem: {}};
                            $scope.data.currItem[$scope.objconf.key] = x.id;
                            $scope.refresh(2);
                        } else if (x.initsql) {
                            $scope.autosearch(x.initsql);
                        }

                        //清除参数
                    } else {


                    }
                }

                //给window对象绑定清理对象的方法，此方法会在tab标签页关闭时调用
                window.destoryObj = function () {
                    console.log("...call destoryObj function...");
                    angular.forEach($scope, function (value, key, obj) {
                        if ($.isFunction(obj[key])) {
                            obj[key] = null;
                        }
                    });
                    $scope = null;
                }
            }];

        return controllerApi.controller({
            module: module,
            controller: ctrl_bill_public
        });
    });