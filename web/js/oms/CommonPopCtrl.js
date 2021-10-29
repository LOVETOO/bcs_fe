/**PopDrpCustController
 * CommonCtrl 公共弹窗Controller
 * 无需注册到模块，直接被调用（如果注册--继承不可用（：需要注入）-- 这里与sevices继承不一样）
 * -返回被选择对象即可
 * $scope为当前域
 * $modalInstance为必要注入选项-用于返回数据
 * Service可以为任意一个
 */

/**
 * 公共弹窗Controller？
 */
function BasePopController($scope, $modalInstance, BaseService) {
    $scope.items = []; //列表元素
    $scope.item = {}; //被选元素
    $scope.FrmInfo = BaseService.FrmInfo;
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };
    $scope.addConfirm = function (index) {

        $modalInstance.close($scope.items[index]);
    }
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    /*$scope.search = function(){
	 var sqlWhere = BaseService.getSqlWhere(["area_name"],$scope.searchtext);
	 var  postdata={sqlwhere: sqlWhere};
	 var promise = BaseService.RequestPost("base_search","searchcountry",postdata);
	 promise.then(function(data){
	 $scope.items =data.name;//返回的数据组？显示的字段？search方法不一样?
	 });
	 };*/
}

//商业发票-通知单号
function CommonAddOneController($scope, $modalInstance, BasemanService, BaseService) {
    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    };
    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere($scope.sqlwhere, $scope.searchtext);
        //var cust_id=parseInt($scope.data.currItem.cust_id);
        // if ($scope.postdata != undefined){
        // var  postdata=$scope.postdata}
        // else{
        // var  postdata={};
        // }
        if ($scope.postdata != undefined) {
            var postdata = $scope.postdata;
            postdata.sqlwhere = sqlWhere;
        } else {
            var postdata = {
                sqlwhere: sqlWhere,
            };
        }
        if ($scope.flag != undefined) {
            postdata.flag = $scope.flag;
        }
        //postdata.sqlWhere=sqlWhere;
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = "(" + postdata.sqlwhere + ") and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}
        var containers = $scope.containers || $scope.classname + "s";
        var promise = BasemanService.RequestPost($scope.classname, $scope.fun, postdata);
        promise.then(function (data) {
            //请再此处新增接收容器
            /**    if($scope.classname=='customer'){
			$scope.items = data.customers;
		    }
             else if($scope.classname=='base_search'){
			$scope.items = data.orgs;
			//$scope.items = data.outbill_types;
			}
             else if($scope.classname=='drp_item'){
				$scope.items = data.drp_items;
			}
             else if($scope.classname=='drp_gcust_saleorder_header'){
				$scope.items = data.drp_gcust_saleorder_headers;
			}
             else if($scope.classname=='drp_item_type'){
				$scope.items = data.drp_item_types;
			}
             else if($scope.classname=='drp_outbill_header'){
				$scope.items = data.drp_outbill_headers;
			}
             else if($scope.classname=='drp_parameter'){
				$scope.items = data.drp_parameters;
			}
             else if( $scope.classname=="pro_item_ysamt"){
				$scope.items = data.pro_item_ysamts;
			}
             else if( $scope.classname=="base_pro_part"){
				$scope.items = data.base_pro_parts;
			}
             else if( $scope.classname=="base_search"){
				$scope.items = data.base_pro_parts;
			}
             else if( $scope.classname=="bank"){
				$scope.items = data.banks;
			}
             if( $scope.classname=="pro_item"){
				$scope.items = data.pro_item_partofpro_items;
			}*/
            $scope.items = data[containers]; //返回的数据组？显示的字段？search方法不一样?
            if (!$scope.items.length) {
                // BaseService.notice("未有搜索记录!", "alert-warning");
            }
        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }

}

/**
 * 统一弹窗方法
 * 由于从Controller里面引发的弹窗所在的当前域与弹窗当前域的关联关系，需要定义弹窗信息 -- 占用FrmInfo对象名称
 * title -- 窗体标题
 * type -- 弹窗类型 -- 默认单选，checkbox 多选
 * thead -- 列对象定义
 * classid -- Search请求类 class 是关键字 所以就定义成classid
 * action -- 请求action 默认是search
 * postdata -- 请求数据 -- 与sqlwhere 分开处理 最后会将sqlwhere拼接
 * searchlist -- 请求参数里面请求名称数组，如 ["search_no", "search_name"]; -- 这里后台不能根据查询field来定义sqlwhere,前台部分
 * sqlBlock -- 请求添加的sql块
 * direct -- 模糊查询的方式 center，left，right
 * backdatas -- 请求返回的列表属性，默认：classid's
 * realtime -- true or false 窗口打开即查询 默认是true
 * commitRigthNow --true or false 立即执行查询语句
 */
function CommonPopController1($scope, $modalInstance, BaseService, $timeout) {
    //分页查询
    BaseService.pageInit($scope);
    $scope.addConfirm = function (params) {
        var line = $scope.options.api.getModel().getRow(params.rowIndex).data;
        line.initsqlwhere = $scope.initsqlwhere;
        line.sqlwhere = $scope.sqlwhere;
        if ($scope.FrmInfo.type != "checkbox") {
            $modalInstance.close(line);
        } else {
            $modalInstance.close([line]);
        }
    }

    $scope.search = function () {
        if ($scope.searchtype % 2 == 0) {
            var sql = $scope.sqlwhere_high;
        } else {
            var sql = getSqlWhere()
        }
        $modalInstance.close(sql)
    }
    $("body")
        .off("click")
        .on(
            "click",
            ".j_add_line",
            function () {
                // 条件类型-不值范围或值范围
                var option_flag = $(this).closest("div.tab-pane").attr('option_flag');
                var data_type = $(this).closest("div.tab-pane").attr('data_type');
                //alert('option_flag:'+option_flag);

                var _this = $(this).closest("div.tab-pane").find('table tbody tr:last');
                var html = ' <tr >'
                if (option_flag == 1 || option_flag == 3) {
                    html = html + '    <td  class="seq">或者</td>';
                    html = html + '     <td> <input type="text"  class="input-sm form-control s_value"  value=""  ></td>';
                } else {
                    html = html + '    <td  class="seq">并且</td>';
                    html = html + '     <td> <input type="text"  class="input-sm form-control s_value"  value=""  ></td>';
                }
                if (option_flag < 3) {
                    html = html
                        + '	   <td> <input type="text"  class="input-sm form-control e_value"  value=""  ></td>	'
                }
                html = html
                    + '	   <td class="text-center"><a  class="del" onclick="deleteTr(this);" style="cursor:pointer" >删除条件</a> '
                    //+ '	                <a   class="add"  style="margin-left:15px;cursor:pointer ">添加条件</a>'
                    + '		</td>' + ' </tr>';
                var $html = $(html);
                if (data_type == "date") {
                    var options = {
                        format: 'yyyy-mm-dd',
                        startView: 'day',
                        todayBtn: true,
                        forceParse: true,
                        language: "zh-CN",
                        multidate: false,
                        autoclose: true,
                        todayHighlight: true
                    };
                    $html.find("input").datepicker(options);
                }
                _this.after($html);
            });
    //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };
    //定义网格的options
    $scope.options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowDoubleClicked: $scope.addConfirm,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellRenderer: function (params) {
                return parseInt(params.node.id) + 1
            },
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options.columnDefs = $scope.columns;
    $scope.items = [];//列表元素
    $scope.item = {};//被选元素
    $scope.keys = [];//自定义的网格所有主键id["",""];
    $scope.tempArr = new Array();
    $scope.FrmInfo = $scope.$parent.FrmInfo;
    $scope.type = "default"
    $scope.cancel = function () {
        $modalInstance.dismiss({});
    };
    $scope.sqlwhere_unnull = true;
    if (typeof ($scope.FrmInfo.autoSearch) == "undefined" || $scope.FrmInfo.autoSearch == "")
        $scope.FrmInfo.autoSearch == "true"
    $scope.con = [{
        condition_name: $scope.FrmInfo.thead[0].code,
        condition_op: "center",
        type: $scope.FrmInfo.thead[0].type,
        dicts: $scope.FrmInfo.thead[0].dicts
    }, {
        condition_name: $scope.FrmInfo.thead[1].code,
        condition_op: "center",
        type: $scope.FrmInfo.thead[1].type,
        dicts: $scope.FrmInfo.thead[1].dicts
    }]

    $scope.change = function (con) {
        $.each($scope.FrmInfo.thead, function (i, item) {
            if (con == "condition_name1" && item.code == $scope.con[0].condition_name) {
                $scope.con[0].type = item.type
                $scope.con[0].dicts = item.dicts;
                $scope.con[0].condition_value = ''
            }
            else if (con == "condition_name2" && item.code == $scope.con[1].condition_name) {
                $scope.con[1].type = item.type
                $scope.con[1].dicts = item.dicts;
                $scope.con[1].condition_value = ''
            }
        })
    }

    // 高级条件
    $scope.sqlwhere_high = "";

    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };

    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (!$scope.FrmInfo.autoSearch) {
            $scope.search();
        }
    }

    if ($scope.FrmInfo.commitRigthNow) {
        $timeout(function () {
            $scope.search();
        }, 10)
    }

    function concat_cond(sqlwhere, addsql) {
        return HczyCommon.concat_sqlwhere(sqlwhere, addsql)
    }


    function getSqlWhereCommon(arr) {
        var sqlWhere = "";
        $.each(arr, function (i, item) {
            if (item.condition_value == "" || typeof (item.condition_value) == "undefined") {
                sqlWhere += "";
            } else {
                if (i == 1 && sqlWhere != "") {
                    sqlWhere += " or "
                }
                switch (item.type) {
                    case "date":
                        switch (item.condition_op) {
                            case "center":
                                sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' ";
                                break;
                            case "left":
                                sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '" + item.condition_value + "%'";
                                break;
                            case "right":
                                sqlWhere += "to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%";
                                break;
                            case  "=":
                                sqlWhere += "to_char(" + item.condition_name + ",'yyyy-mm-dd') = '" + item.condition_value + "'"
                                break;
                            default:
                                sqlWhere += " to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' ";
                        }
                        break;
                    default:
                        switch (item.condition_op) {
                            case "center":
                                sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "%') ";
                                break;
                            case "left":
                                sqlWhere += " lower(" + item.condition_name + ") like lower('" + item.condition_value + "%') ";
                                break;
                            case "right":
                                sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "') ";
                                break;
                            case  "=":
                                sqlWhere += " lower(" + item.condition_name + ") = lower('" + item.condition_value + "')";
                                break;
                            default:
                                sqlWhere += " lower(" + item.condition_name + ") like lower('%" + item.condition_value + "%') ";
                        }
                }
            }
        })
        return sqlWhere;
    }


    function getSqlWhereCommon1(arr) {
        var sqlWhere = "";
        var len = arr.length;
        $.each(arr, function (i, item) {
            if (item.condition_value == "" || typeof (item.condition_value) == "undefined") {
                sqlWhere += "";
            } else {
                item.condition_value = String(item.condition_value).toLowerCase();
                if (item.type == "date") {
                    if (item.condition_op == "center") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "%' " : " lower(" + item.condition_name + ") like '%" + item.condition_value + "%'";
                    } else if (item.condition_op == "left") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '" + item.condition_value + "%'" : " lower(" + item.condition_name + ") like '" + item.condition_value + "%' ";
                    } else if (item.condition_op == "right") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') like '%" + item.condition_value + "'" : "  lower(" + item.condition_name + ") like '%" + item.condition_value + "' ";
                    }
                    else if (item.condition_op == "=") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or to_char(" + item.condition_name + ",'yyyy-mm-dd') = '" + item.condition_value + "'" : " lower(" + arr[i] + ") = '" + item.condition_value + "' ";
                    }
                } else {
                    if (item.condition_op == "center") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '%" + item.condition_value + "%' " : " lower(" + item.condition_name + ") like '%" + item.condition_value + "%'";
                    } else if (item.condition_op == "left") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '" + item.condition_value + "%'" : " lower(" + item.condition_name + ") like '" + item.condition_value + "%' ";
                    } else if (item.condition_op == "right") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") like '%" + item.condition_value + "'" : "  lower(" + item.condition_name + ") like '%" + item.condition_value + "' ";
                    }
                    else if (item.condition_op == "=") {
                        sqlWhere += (i == 1 && sqlWhere != "") ? " or lower(" + item.condition_name + ") = '" + item.condition_value + "'" : " lower(" + arr[i] + ") = '" + item.condition_value + "' ";
                    }
                }
            }
        })
        console.log(arr)
        return sqlWhere;
    }

    // 查询
    function getSqlWhere() {
        if (!$scope.FrmInfo.searchlist) {
            var p_list = [];
            for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                if ($scope.FrmInfo.thead[i].iscond) {
                    p_list.push($scope.FrmInfo.thead[i].code);
                }
            }
            $scope.FrmInfo.searchlist = p_list;
        }
        var sqlWhere = "";
        // sqlWhere = BaseService.getSqlWhere($scope.FrmInfo.searchlist, $scope.searchtext, direct);
        sqlWhere = getSqlWhereCommon($scope.con);
        sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.sqlBlock);
        sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.initsql);
        sqlWhere = concat_cond(sqlWhere, $scope.sqlwhere_high);
        if ($scope.FrmInfo.postdata != undefined) {
            sqlWhere = concat_cond(sqlWhere, $scope.FrmInfo.postdata.sqlwhere);
        }
        return sqlWhere;
    }

    $scope.initsqlwhere = getSqlWhere();
    if ($scope.FrmInfo && $scope.FrmInfo.classid) {
        sessionStorage.setItem("frmInfo", JSON.stringify($scope.FrmInfo));
        $scope.FrmInfo.title = $scope.FrmInfo.title ? $scope.FrmInfo.title : "公共弹窗标题";
        var classid = $scope.FrmInfo.classid || "base_search";
        var action = $scope.FrmInfo.action || "search";
        var direct = $scope.FrmInfo.direct || "center";
        var _postdata = {};
        if ($scope.FrmInfo.postdata) {
            _postdata = $scope.FrmInfo.postdata;
        }
        //对网格的列进行拓展
        var str = "";
        for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
            if (str.indexOf($scope.FrmInfo.thead[i].code) > -1) {//去重复列
                $scope.FrmInfo.thead.splice(i, 1);
                i--;
                continue;
            }
            str += $scope.FrmInfo.thead[i].code;
            if ($scope.FrmInfo.thead[i].type == "list") {
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
                for (var j = 0; j < $scope.FrmInfo.thead[i].dicts.length; j++) {
                    $scope.FrmInfo.thead[i].dicts[j].value = $scope.FrmInfo.thead[i].dicts[j].id;
                    //delete $scope.FrmInfo.thead[i].dicts[j].id;
                    $scope.FrmInfo.thead[i].dicts[j].desc = $scope.FrmInfo.thead[i].dicts[j].name;
                    //delete $scope.FrmInfo.thead[i].dicts[j].name;
                }
                object.cellEditorParams = {};
                object.cellEditorParams.values = $scope.FrmInfo.thead[i].dicts;
            } else {
                var object = {
                    editable: false,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                };

                var options_name = "options_" + $scope.FrmInfo.thead[i].code;
                $scope[options_name] = {};
                $scope[options_name] = HczyCommon.copyobj($scope.options, $scope[options_name]);
                $scope[options_name].fixedGridHeight = true;
            }
            object.headerName = $scope.FrmInfo.thead[i].name;
            object.field = $scope.FrmInfo.thead[i].code;
            $scope.columns.push(object);
            $scope.keys.push(object.field);
        }
        $scope.fmax = function (e) {
            var stitle = $(e.currentTarget).attr("title");//判断是最大化还是最小化
            if (stitle == "最大化") {
                $(e.currentTarget).find("strong").html("<img src = 'images/min_pages.png'>");
                $(e.currentTarget).attr("title", "还原")
                $("#max_modal_content").parent().parent("div.modal-dialog.modal-lg").addClass("max_modal_content");//获取目标div
                $("#max_modal_content").css("height", "100%");//获取目标div
                var old_height = $("#max_slick_grid").css('height');
                var new_height = (Number(old_height.substring(0, old_height.length - 2)) + 100) + "px";
                $("#max_slick_grid").css({'height': new_height});
            } else if (stitle == "还原") {
                $(e.currentTarget).attr("title", "最大化")
                $(e.currentTarget).find("strong").html("<img src = 'images/max_pages.png'>");
                $("#max_modal_content").parent().parent("div.modal-dialog.modal-lg").removeClass("max_modal_content");
                $("#max_modal_content").css("height", "none");
                var old_height = $("#max_slick_grid").css('height');
                var new_height = (Number(old_height.substring(0, old_height.length - 2)) - 100) + "px";
                $("#max_slick_grid").css({'height': new_height});
            }
            /*window.moveTo(0,0);
             window.resizeTo(screen.availWidth,screen.availHeight);
             window.outerWidth=screen.availWidth;
             window.outerHeight=screen.availHeight;*/
        }
        if (!$scope.FrmInfo.type) {//默认弹窗为单选
            $scope.ok = function () {
                var cell = $scope.options.api.getFocusedCell();
                if (cell == null) {
                    BaseService.notice("请先选中行!")
                    return;
                }
                var line = $scope.options.api.getModel().getRow(cell.rowIndex).data;
                line.sqlwhere = $scope.sqlwhere;
                line.initsqlwhere = $scope.initsqlwhere;
                $modalInstance.close(line);
            };
        } else if ($scope.FrmInfo.type == "checkbox") {//多选
            $scope.options.selectAll = true;
            $scope.ok = function () {
                var data = $scope.options.api.getSelectedRows();
                $scope.tempArr = data;
                $modalInstance.close($scope.tempArr);
            };
        }
        var back_prop = $scope.FrmInfo.backdatas || classid + "s";
        $scope._pageLoad = function (postdata) {
            HczyCommon.copyobj(_postdata, postdata);
            postdata.sqlwhere = postdata.sqlwhere || ""
            if (getSqlWhere()) {
                postdata.sqlwhere = getSqlWhere();
            }
            if ($scope.FrmInfo.checkbox_value) {
                //隐藏掉弹出框的分页页面
                $scope.FrmInfo.hide = true;
                postdata.sqlwhere = concat_cond(postdata.sqlwhere, ' 1=1 or (' + $scope.FrmInfo.checkbox_key + ' in(' + $scope.FrmInfo.checkbox_value + '))');
            }
            if ($scope.FrmInfo.type != "sqlback") {
                if ($scope.FrmInfo.checkbox_value) {
                    // postdata.pagination="pn=1,ps=100000,pc=0,cn=0,ci=0";
                    delete postdata.pagination;
                }
                if (postdata.sqlwhere == "") {
                    postdata.sqlwhere = " 1=1 ";
                    $scope.sqlwhere_unnull = false;
                }
                BaseService.RequestPost(classid, action, postdata)
                    .then(function (data) {
                        if ($scope.sqlwhere_unnull) {
                            $scope.sqlwhere = data.sqlwhere;//记录sqlwhere
                        }
                        $scope.sqlwhere_unnull = true;
                        if ($scope.FrmInfo.type != "checkbox") {
                            $scope.items = data[back_prop];//返回的数据组？显示的字段？search方法不一样?
                            $scope.options.api.setRowData($scope.items);
                            $scope.options.columnApi.autoSizeColumns();
                        } else {
                            var _result = [];
                            var checkbox_value = [];
                            if ($scope.FrmInfo.checkbox_value) {
                                if ($scope.FrmInfo.checkbox_value.split(",")) {
                                    var checkbox_value = $scope.FrmInfo.checkbox_value.split(",");
                                }
                                for (var j = 0; j < data[back_prop].length; j++) {
                                    for (var i = 0; i < checkbox_value.length; i++) {
                                        if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i]) {
                                            _result.push(data[back_prop][j]);
                                            break;
                                        }
                                    }
                                }
                            }
                            var check_length = _result.length;
                            for (var j = 0; j < data[back_prop].length; j++) {
                                for (var i = 0; i < checkbox_value.length; i++) {
                                    if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i]) {
                                        break;
                                    }
                                }
                                if (i == checkbox_value.length) {
                                    _result.push(data[back_prop][j]);
                                }
                            }

                            $scope.options.api.setRowData(_result);
                            var nodes = $scope.options.api.getModel().rootNode.childrenAfterSort;
                            for (var j = 0; j < check_length; j++) {
                                $scope.options.api.clipboardService.selectionController.selectedNodes[nodes[j].id] = nodes[j];
                                nodes[j].selected = true
                            }
                            $scope.options.api.refreshRows(nodes);
                            $scope.options.columnApi.autoSizeColumns();
                            $scope.items = _result;//返回的数据组？显示的字段？search方法不一样?
                        }
                        if (!$scope.items.length) {
                            // BaseService.notice("未有搜索记录!", "alert-warning");
                        }
                        BaseService.pageInfoOp($scope, data.pagination);
                    });
            } else {
                $modalInstance.close(postdata);
            }
        }
        var realtime = $scope.FrmInfo.realtime || false;

        // $timeout(function () {
        //     $scope.options.columnApi.autoSizeColumns();
        //     if (realtime) {
        //         $scope.search();
        //     }
        // }, 10)
    } else {

    }
    $scope.showonetime = $scope.FrmInfo.type == "sqlback" ? true : false;
    $scope.conditions = true;
    $scope.searchtype = 1
    $scope.toggleFilter = function (e) {
        $(e.currentTarget).closest("div.modal-body").find("div.high_filter").slideToggle();
        $scope.conditions = !$scope.conditions;
        $scope.searchtype += 1;
    };

    $scope.columns_bh = [{
        headerName: "关系", field: "rel", editable: false, filter: 'set', width: 70,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "值", field: "value", editable: true, filter: 'set', width: 180,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        non_empty: true,
        floatCell: true
    }];
    $scope.cond_lines = [];
    for (var i = 0; i < 1000; i++) {
        $scope.cond_lines.push({rel: "或者"});
    }

}

/**
 * 弹窗查询用(无高级查询)
 * @param $scope
 * @param $modalInstance
 * @param BaseService
 * @param $timeout
 * @param BasemanService
 * @constructor
 */
function CommonPopController($scope, $modalInstance, BaseService, $timeout, BasemanService) {
    //分页查询
    BaseService.pageInit($scope);

    $scope.pageSize = 100;

    //如果有指定pageSize则重新赋值
    if ($scope.$parent.pageS && $scope.$parent.isSetPage == true) {
        $scope.pageSize = $scope.$parent.pageS;
    }

    $scope.addConfirm = function (params) {
        if ($scope.FrmInfo.type != "checkbox") {
            $modalInstance.close($scope.items[params.rowIndex]);
        }
    }
    $scope.sigleClick = function (params) {
        $scope.item = $scope.items[params.rowIndex]
    }
    $scope.search = function (params) {
        var postdata = {
            pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
        };
        if (params) {
            postdata.params = params;
        }
        $scope._pageLoad(postdata)
    }
    // //分组功能
    // var groupColumn = {
    //     headerName: "Group",
    //     width: 200,
    //     field: 'name',
    //     valueGetter: function (params) {
    //         if (params.node.group) {
    //             return params.node.key;
    //         } else {
    //             return params.data[params.colDef.field];
    //         }
    //     },
    //     comparator: agGrid.defaultGroupComparator,
    //     cellRenderer: 'group',
    //     cellRendererParams: function (params) {
    //     }
    // };

    // 定义网格的options
    $scope.options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: false, //one of [true, false]
        enableFilter: false, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        // rowDoubleClicked: $scope.addConfirm,
        // rowClicked: $scope.sigleClick,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        // groupColumnDef: groupColumn,
        showToolPanel: false,
        toolPanelSuppressSideButtons: true,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        },
        hcEvents: {
            rowClicked: $scope.sigleClick,
            rowDoubleClicked: $scope.addConfirm
        }
    };
    // $scope.options =
    //     {
    //         defaultColDef: {
    //             width: 100
    //         },
    //         enableColResize: true,
    //         suppressRowClickSelection: true,
    //         rowSelection: 'multiple',
    //         columnDefs: $scope.columns
    //     };

    $scope.columns = [{
        headerName: "序号",
        field: "queue",
        width: 50,
        editable: false,
        filter: 'set',
        cellEditor: "选择框",
        // enableRowGroup: true,
        // enablePivot: true,
        // enableValue: true,
        floatCell: true,
    }
    ]
    $scope.options.columnDefs = $scope.columns;
    $scope.items = []; //列表元素
    $scope.item = {}; //被选元素
    $scope.keys = []; //自定义的网格所有主键id["",""];
    $scope.tempArr = new Array();
    $scope.FrmInfo = $scope.$parent.FrmInfo;
    $scope.type = "default"

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    if ($scope.FrmInfo.type == "checkbox") {
        // $scope.columns.headerCheckboxSelection = true
        // $scope.columns.headerCheckboxSelectionFilteredOnly = false
        // $scope.columns.checkboxSelection = true
        $scope.options.cellRendererParams = {
            checkbox: true
        }
        $scope.columns[0].headerCheckboxSelection = true;
        $scope.columns[0].checkboxSelection = true;
        $scope.columns[0].width = 65,
            $scope.columns[0].headerCheckboxSelectionFilteredOnly = false;
    }

    // 高级条件
    $scope.sqlwhere_high = "";

    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };

    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.searchNow = function () {
        if ($scope.FrmInfo.autoSearch) {
            $scope.search();
        }
    }

    if ($scope.FrmInfo.commitRigthNow) {
        $timeout(function () {
            $scope.search();
        }, 10)
    }

    // 查询
    function getSqlWhere() {
        if (!$scope.FrmInfo.searchlist) {
            var p_list = [];
            for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                if ($scope.FrmInfo.thead[i].iscond) {
                    p_list.push($scope.FrmInfo.thead[i].code);
                }
            }
            $scope.FrmInfo.searchlist = p_list;
        }
        var sqlWhere = BaseService.getSqlWhere($scope.FrmInfo.searchlist, $scope.searchtext, direct);
        var sqlBlock = "";
        if ($scope.FrmInfo.sqlBlock) {
            sqlBlock = $scope.FrmInfo.sqlBlock;
        }
        if ($scope.FrmInfo.initsql) {
            sqlBlock = sqlBlock.trim() ? sqlBlock + " and " + $scope.FrmInfo.initsql : $scope.FrmInfo.initsql;
        }
        if (sqlWhere.trim() && sqlBlock.trim()) {
            sqlWhere = "(" + sqlWhere + ") and " + sqlBlock;
        } else {
            sqlBlock = sqlWhere && sqlBlock ? " and " + sqlBlock : sqlBlock;
            sqlWhere = sqlWhere + " " + sqlBlock;
        }

        if ($scope.sqlwhere_high && $.trim($("#mysql").val()) != "" && !$scope.conditions) {
            sqlWhere = $scope.sqlwhere_high;
        }
        if ($scope.FrmInfo.type == "sqlback") {
            if ($.trim($scope.sqlwhere_high)) {
                sqlWhere = sqlWhere.trim() ? sqlWhere + " and " + $scope.sqlwhere_high : $scope.sqlwhere_high;
            }
        }
        return sqlWhere.trim();
    }

    /**---------------------------------加载词汇 ----------**/
    /**
     * 查询词汇值请求
     * @param dictcode 词汇编码
     */
    function getDict(dictcode) {
        var dicts = BasemanService.RequestPostSync("base_search", "searchdict",
            {dictcode: dictcode}).dicts;

        HczyCommon.stringPropToNum(dicts);

        for (var i = 0; i < dicts.length; i++) {
            dicts[i].id = dicts[i].dictvalue;
            dicts[i].name = dicts[i].dictname;
            dicts[i].value = dicts[i].dictvalue;
            dicts[i].desc = dicts[i].dictname;
        }
        return dicts;
    }

    if ($scope.FrmInfo && $scope.FrmInfo.classid) {
        sessionStorage.setItem("frmInfo", JSON.stringify($scope.FrmInfo));
        $scope.FrmInfo.title = $scope.FrmInfo.title ? $scope.FrmInfo.title : "公共弹窗标题";
        var classid = $scope.FrmInfo.classid || "base_search";
        var action = $scope.FrmInfo.action || "search";
        var direct = $scope.FrmInfo.direct || "center";
        var _postdata = {};
        if ($scope.FrmInfo.postdata) {
            _postdata = $scope.FrmInfo.postdata;
        }

        //对网格的列进行拓展
        $scope.dictsnames = {};
        for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
            if ($scope.FrmInfo.thead[i].type == "list" || $scope.FrmInfo.thead[i].hcDictCode) {
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
                // for (var j = 0; j < $scope.FrmInfo.thead[i].dicts.length; j++) {
                //     $scope.FrmInfo.thead[i].dicts[j].value = $scope.FrmInfo.thead[i].dicts[j].id;
                //     //delete $scope.FrmInfo.thead[i].dicts[j].id;
                //     $scope.FrmInfo.thead[i].dicts[j].desc = $scope.FrmInfo.thead[i].dicts[j].name;
                //     //delete $scope.FrmInfo.thead[i].dicts[j].name;
                // }
                object.cellEditorParams = {};
                object.cellEditorParams.values = $scope.FrmInfo.thead[i].dicts ? $scope.FrmInfo.thead[i].dicts : [];
                if ($scope.FrmInfo.thead[i].hcDictCode) {
                    object.cellEditorParams.values = getDict($scope.FrmInfo.thead[i].hcDictCode);
                }
            } else {
                var object = {
                    editable: false,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                };
            }
            object.headerName = $scope.FrmInfo.thead[i].name;
            object.field = $scope.FrmInfo.thead[i].code;
            $scope.columns.push(object);
            $scope.keys.push(object.field);
        }
        if (!$scope.FrmInfo.type) { //默认弹窗为单选
            $scope.ok = function () {
                $modalInstance.close($scope.item);
            };
        } else if ($scope.FrmInfo.type == "checkbox") { //多选
            // $scope.options.selectAll = true;
            $scope.ok = function () {
                var data = $scope.options.api.getSelectedRows();
                $scope.tempArr = data;
                $modalInstance.close($scope.tempArr);
            };
        }
        var back_prop = $scope.FrmInfo.backdatas || classid + "s";
        $scope._pageLoad = function (postdata) {
            HczyCommon.copyobj(_postdata, postdata);
            postdata.sqlwhere = postdata.sqlwhere || ' 1=1 '
            if (getSqlWhere()) {
                postdata.sqlwhere = '(' + postdata.sqlwhere + ') and (' + getSqlWhere() + ')';
            }
            if ($scope.FrmInfo.checkbox_value) {
                //隐藏掉弹出框的分页页面
                $scope.FrmInfo.hide = true;
                postdata.sqlwhere += ' or (' + $scope.FrmInfo.checkbox_key + ' in(' + $scope.FrmInfo.checkbox_value + '))'
            }
            if ($scope.FrmInfo.type != "sqlback") {
                if ($scope.FrmInfo.checkbox_value) {
                    // postdata.pagination="pn=1,ps=100000,pc=0,cn=0,ci=0";
                    delete postdata.pagination;
                }
                BaseService.RequestPost(classid, action, postdata)
                    .then(function (data) {
                        if ($scope.FrmInfo.type != "checkbox") {
                            $scope.items = data[back_prop]; //返回的数据组？显示的字段？search方法不一样?
                            for (var i = 0; i < $scope.items.length; i++) {
                                $scope.items[i].queue = (i + 1);
                            }
                            $scope.options.api.setRowData($scope.items);
                            $scope.options.columnApi.autoSizeColumns($scope.keys);
                        } else {
                            var _result = [];
                            var checkbox_value = [];
                            if ($scope.FrmInfo.checkbox_value) {
                                if ($scope.FrmInfo.checkbox_value.split(",")) {
                                    var checkbox_value = $scope.FrmInfo.checkbox_value.split(",");
                                }
                                for (var j = 0; j < data[back_prop].length; j++) {
                                    for (var i = 0; i < checkbox_value.length; i++) {
                                        if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i].replace(/\'/g, '').trim()) {
                                            _result.push(data[back_prop][j]);
                                            break;
                                        }
                                    }
                                }
                            }
                            var check_length = _result.length;
                            for (var j = 0; j < data[back_prop].length; j++) {
                                for (var i = 0; i < checkbox_value.length; i++) {
                                    if (data[back_prop][j][$scope.FrmInfo.checkbox_key] == checkbox_value[i].replace(/\'/g, '').trim()) {
                                        break;
                                    }
                                }
                                if (i == checkbox_value.length) {
                                    _result.push(data[back_prop][j]);
                                }
                            }
                            for (var i = 0; i < _result.length; i++) {
                                _result[i].queue = (i + 1);
                            }
                            $scope.options.api.setRowData(_result);
                            var nodes = $scope.options.api.getModel().rootNode.childrenAfterSort;
                            for (var j = 0; j < check_length; j++) {
                                $scope.options.api.clipboardService.selectionController.selectedNodes[nodes[j].id] = nodes[j];
                                nodes[j].selected = true
                            }
                            $scope.options.api.refreshRows(nodes);
                            $scope.options.columnApi.autoSizeColumns($scope.keys);
                            $scope.items = _result; //返回的数据组？显示的字段？search方法不一样?
                        }
                        for (var i = 0; i < $scope.items.length; i++) {
                            $scope.items[i].queue = (i + 1);
                        }
                        if (!$scope.items.length) {
                            // BaseService.notice("未有搜索记录!", "alert-warning");
                        }
                        BaseService.pageInfoOp($scope, data.pagination);
                    });
            } else {
                $modalInstance.close(postdata);
            }
        }
        var realtime = $scope.FrmInfo.realtime || false;
        if (realtime) {
            $scope.search();
        }

    } else {
        BaseService.notice("Request Class Was Not Defined!", "alert-warning");
    }
    $scope.showonetime = $scope.FrmInfo.type == "sqlback" ? true : false;
    $scope.conditions = true;
    $scope.toggleFilter = function (e) {
        $(e.currentTarget).closest("div.modal-body").find("div.high_filter").slideToggle();
        $scope.conditions = !$scope.conditions;
    }
    // $scope.search();
}

function send_mail($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
    send_mail = HczyCommon.extend(send_mail, ctrl_bill_public);
    send_mail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    $scope.objconf = {
        name: "myfiles",
        key: "fileid",
        FrmInfo: {},
        grids: []
    };
    $scope.clearinformation = function () {
        $scope.data.currItem = {};
        if ($scope.$parent.file) {
            $scope.data.currItem.attachofemails1 = $scope.$parent.file;
        }
        if ($scope.$parent.sendto) {
            $scope.data.currItem.snedto = $scope.$parent.sendto;
            $timeout(function () {
                var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + $scope.data.currItem.snedto + '" addr="' + $scope.data.currItem.snedto + '" unselectable="on"><b unselectable="on" addr="' + $scope.data.currItem.snedto + '">' + $scope.data.currItem.snedto + '</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final').before(add_elem);
                $scope.addfunction();
            })
        } else {
            $scope.data.currItem.snedto = '';
            $scope.data.currItem.cc = '';
        }
    }
    $scope.addfunction = function () {
        $('.addr_base').click(function (e) {
            $(this).siblings().removeClass('attbg_focus');
            $(this).siblings().removeClass('attbg');
            $(this).siblings().addClass('attbg');
            $(this).removeClass('attbg');
            $(this).addClass('attbg_focus');
            return false
        })
    }
    //关闭查询联系人
    $scope.close_people = function () {
        if ($scope.data.is_search == 2) {
            $scope.data.is_search = 1;
            $scope.data.username = '';
        }
    }

    //查询联系人
    $scope.search_peopele = function () {
        $scope.data.is_search = 2;
        if ($scope.data.username == '' || $scope.data.username == undefined) {
            $scope.data.is_search = 1;
            return;
        }
        BasemanService.RequestPost("scpemail_contact_list", "search", {
            username: $scope.data.username,
            flag: 3,
            emailtype: 3
        }).then(function (data) {
            $scope.data.currItem.scporgs = data.scporgs;
        })
    }
    $scope.contact_people = function (e, index) {
        $scope.index = index;
        $(e.delegateTarget).siblings().removeClass("high");
        $(e.delegateTarget).addClass('high');
        //增加抄送人
        if ($scope.focus == 2) {
            if ($scope.data.flag <= 5) {
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scporgs[index]);
            } else {
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scporgs[index]);
            }

            //增加收件人
        } else {
            if ($scope.data.flag <= 5) {
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scporgs[index]);
            } else {
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scporgs[index]);
            }
        }
        //var l=$("input:focus");
    }
    //发送邮件
    $scope.deal_data = function (str) {
        var new_str = '';
        var arr = str.split(';');
        for (var i = 0; i < arr.length; i++) {

            var left = arr[i].indexOf('<');
            if (left == -1) {
                new_str += arr[i] + ';'
            } else {
                var right = arr[i].indexOf('>');
                var s = arr[i].substr(left + 1, right - left - 1);
                new_str += s + ';';
            }

        }
        return new_str;
    }
    //添加邮件的类型
    $scope.add_type = function () {
        $scope.data.currItem.totype = '';
        $scope.data.currItem.cctype = '';
        for (var i = 0; i < $('#toAreaCtrl .addr_normal').length; i++) {
            if ($('#toAreaCtrl .addr_normal')[i].attributes.addr.value == '部门') {

                $scope.data.currItem.totype += '12;';
            } else {
                $scope.data.currItem.totype += '13;';
            }
        }
        for (var i = 0; i < $('#toAreaCtrl1 .addr_normal').length; i++) {
            if ($('#toAreaCtrl1 .addr_normal')[i].attributes.addr.value == '部门') {

                $scope.data.currItem.cctype += '12;';
            } else {
                $scope.data.currItem.cctype += '13;';
            }
        }
    }
    $scope.fw_addfile = function () {
        BasemanService.openFrm("views/baseman/myfiles_frm.html", myfiles, $scope, "", "").result.then(function (res) {
            for (var i = 0; i < res.length; i++) {
                for (var j = 0; j < $scope.data.currItem.attachofemails1.length; j++) {
                    if (parseInt(res[i].docid) == parseInt($scope.data.currItem.attachofemails1[j].docid)) {
                        break;
                    }
                }
                if (j == $scope.data.currItem.attachofemails1.length) {
                    $scope.data.currItem.attachofemails1 = $scope.data.currItem.attachofemails1.concat([res[i]]);
                }
            }
        })
    }
    $scope.send_email = function (flag) {
        var postdata = {
            sysuserid: userbean.sysuserid,
            fromuser: userbean.userid,
            emailtype: 3,
            stat: 2,
            myflag: 0,
            contentid: -2
        };
        $scope.add_type();
        if ($scope.data.currItem.snedto) {
            //postdata.totype='13';
            postdata.sendtoname = ($scope.data.currItem.snedto);
            postdata.sendto = $scope.deal_data($scope.data.currItem.snedto);
            /**var arr = $scope.data.currItem.snedto.split(';');
             for(var i=1;i<arr.length;i++){
				if(arr[i]==''||arr[i]==undefined){
					continue;
				}
				postdata.totype+=';13'
			}*/
            postdata.totype = $scope.data.currItem.totype.substr(0, $scope.data.currItem.totype.length - 1);
        }
        if ($scope.data.currItem.cc) {
            //postdata.cctype='13';
            postdata.ccname = ($scope.data.currItem.cc)
            postdata.cc = $scope.deal_data($scope.data.currItem.cc)
            /**var arr = $scope.data.currItem.cc.split(';');
             for(var i=1;i<arr.length;i++){
				postdata.cctype+=';13'
			}*/
            postdata.cctype = $scope.data.currItem.cctype.substr(0, $scope.data.currItem.cctype.length - 1)
        }
        if ($scope.data.currItem.attachofemails1) {
            for (var i = 0; i < $scope.data.currItem.attachofemails1.length; i++) {
                $scope.data.currItem.attachofemails1[i].downloadcode = $scope.data.currItem.attachofemails1[i].downloadcode;
                $scope.data.currItem.attachofemails1[i].refid = $scope.data.currItem.attachofemails1[i].docid;
                $scope.data.currItem.attachofemails1[i].refname = $scope.data.currItem.attachofemails1[i].docname;
                $scope.data.currItem.attachofemails1[i].refsize = $scope.data.currItem.attachofemails1[i].oldsize;
                $scope.data.currItem.attachofemails1[i].reftype = 6;

            }
            postdata.attachofemails = $scope.data.currItem.attachofemails1;
        }

        postdata.content = $('.summernote').summernote('code');
        if (($scope.data.currItem.subject_send == '' || $scope.data.currItem.subject_send == undefined) && flag != 2) {
            var title = '主题为空，是否继续发送？';
            if (flag == 2) {
                title = '主题为空，是否存为草稿？'
            }
            ds.dialog.confirm(title, function () {
                postdata.subject = '(无主题)'
                BasemanService.RequestPost("scpemail", "insert", postdata)
                    .then(function (data) {

                        if (flag == 2) {
                            BasemanService.notice("存为草稿成功!", "alert-info");
                        } else {
                            BasemanService.notice("发送成功!", "alert-info");
                            $scope.cancel();
                        }

                    });
            }, function () {

            });

        } else {
            postdata.subject = $scope.data.currItem.subject_send;
            BasemanService.RequestPost("scpemail", "insert", postdata)
                .then(function (data) {
                    if (flag == 2) {
                        $scope.data.currItem.emailid = data.emailid;
                        BasemanService.notice("存为草稿成功!", "alert-info");

                    } else {
                        BasemanService.notice("发送成功!", "alert-info");
                        $scope.cancel();
                    }
                });

        }
    }
    $timeout(function () {
        $('.summernote').summernote({
            height: 300,
            fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
            callbacks: {
                onImageUpload: function (files, editor, welEditable) {
                    editor = $(this);
                    uploadFile(files[0], editor, welEditable); //此处定义了上传文件方法
                }
            }
        });
        $(document).on("click", function (e) {
            $('.attbg_focus').removeClass('attbg_focus');
            if ($scope.focus == 2) {
                if ($scope.data.currItem.search_linep) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + $scope.data.currItem.search_linep + '" addr="' + $scope.data.currItem.search_linep + '" unselectable="on"><b unselectable="on" addr="' + $scope.data.currItem.search_linep + '">' + $scope.data.currItem.search_linep + '</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();
                    $scope.data.currItem.cc += $scope.data.currItem.search_linep + ';'
                    $scope.data.currItem.search_linep = '';

                }


            } else {
                if ($scope.data.currItem.search_peop) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + $scope.data.currItem.search_peop + '" addr="' + $scope.data.currItem.search_peop + '" unselectable="on"><b unselectable="on" addr="' + $scope.data.currItem.search_peop + '">' + $scope.data.currItem.search_peop + '</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                    $scope.data.currItem.snedto += $scope.data.currItem.search_peop + ';'
                    $scope.data.currItem.search_peop = '';
                }
            }

        })

        $('#toAreaCtrl').click(function (e) {
            $('#toAreaCtrl .addr_text .js_input').focus();
        })
        $('#toAreaCtrl1').click(function (e) {
            $('#toAreaCtrl1 .addr_text .js_input').focus();
        })
        $('#toAreaCtrl').dblclick(function (e) {
            $('#toAreaCtrl .addr_text .js_input').select();
            $('#toAreaCtrl .addr_base').addClass('attbg_focus');
            return false;

        })
        $('#toAreaCtrl1').dblclick(function (e) {
            $('#toAreaCtrl1 .addr_text .js_input').select();
            $('#toAreaCtrl1 .addr_base').addClass('attbg_focus');
            return false;

        })
        $('#toAreaCtrl .addr_text .js_input').dblclick(function (e) {
            $('#toAreaCtrl .addr_text .js_input').select();
            if ($scope.data.currItem.search_peop == '' || $scope.data.currItem.search_peop == undefined) {

            } else {
                return false;
            }

        })
        $('#toAreaCtrl1 .addr_text .js_input').dblclick(function (e) {
            $('#toAreaCtrl1 .addr_text .js_input').select();
            if ($scope.data.currItem.search_linep == '' || $scope.data.currItem.search_linep == undefined) {

            } else {
                return false;
            }

        })
        $('#toAreaCtrl .addr_text .js_input').keydown(function (e) {
            if (e.keyCode === 8) {
                if ($scope.data.currItem.search_peop == '' || $scope.data.currItem.search_peop == undefined) {

                } else {
                    var l = e.currentTarget.selectionStart;
                    if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
                        $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l - 1;
                        e.currentTarget.selectionEnd = l - 1;
                    } else {
                        $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l;
                        e.currentTarget.selectionEnd = l;
                    }

                    return false;
                }

            } else if (e.keyCode === 186) {

                if ($scope.data.currItem.search_peop) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + $scope.data.currItem.search_peop + '" addr="' + $scope.data.currItem.search_peop + '" unselectable="on"><b unselectable="on" addr="' + $scope.data.currItem.search_peop + '">' + $scope.data.currItem.search_peop + '</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                    $scope.data.currItem.snedto += $scope.data.currItem.search_peop + ';'
                    $scope.data.currItem.search_peop = '';
                }
                $scope.$apply();
                return false;

            }
        })
        $('#toAreaCtrl1 .addr_text .js_input').keydown(function (e) {
            if (e.keyCode === 8) {
                if ($scope.data.currItem.search_linep == '' || $scope.data.currItem.search_linep == undefined) {

                } else {
                    var l = e.currentTarget.selectionStart;
                    if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
                        $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l - 1;
                        e.currentTarget.selectionEnd = l - 1
                    } else {
                        $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l
                        e.currentTarget.selectionEnd = l
                    }

                    return false;
                }

            } else if (e.keyCode === 186) {
                if ($scope.data.currItem.search_linep) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + $scope.data.currItem.search_linep + '" addr="' + $scope.data.currItem.search_linep + '" unselectable="on"><b unselectable="on" addr="' + $scope.data.currItem.search_linep + '">' + $scope.data.currItem.search_linep + '</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();
                    $scope.data.currItem.cc += $scope.data.currItem.search_linep + ';'
                    $scope.data.currItem.search_linep = '';

                }
                $scope.$apply();

                return false;

            }
        })
        $('#zuti').keydown(function (e) {
            if (e.keyCode === 8) {
                if ($scope.data.currItem.subject_send == '' || $scope.data.currItem.subject_send == undefined) {
                    return false;
                } else {
                    var l = e.currentTarget.selectionStart;
                    if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
                        $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l - 1;
                        e.currentTarget.selectionEnd = l - 1
                    } else {
                        $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length - 1);
                        $scope.$apply();
                        e.currentTarget.selectionStart = l;
                        e.currentTarget.selectionEnd = l
                    }
                    return false;
                }

            }
        })

        $('#toAreaCtrl .addr_text .js_input').click(function (e) {
            return false;
        })
        $('#toAreaCtrl1 .addr_text .js_input').click(function (e) {
            return false;
        })

        //收件人 点击
        $scope.addfunction();

        $(document).on("keydown", function (e) {
            if (e.target.className == 'note-editable panel-body') {
                return;
            }
            if (e.keyCode === 8) {
                if ($scope.focus == 2) {
                    $('#toAreaCtrl1 .attbg_focus').remove();
                    $scope.data.currItem.cc = '';
                    for (var i = 0; i < $('#toAreaCtrl1 .addr_base').length; i++) {

                        if (i == 0) {
                            $scope.data.currItem.cc = $('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
                        } else {
                            $scope.data.currItem.cc += ';' + $('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
                        }
                    }
                    $('#final1').prev().addClass('attbg_focus');
                } else {
                    $('#toAreaCtrl .attbg_focus').remove();
                    $scope.data.currItem.snedto = '';
                    for (var i = 0; i < $('#toAreaCtrl .addr_base').length; i++) {

                        if (i == 0) {
                            $scope.data.currItem.snedto = $('#toAreaCtrl .addr_base')[i].attributes.title.value;
                        } else {
                            $scope.data.currItem.snedto += ';' + $('#toAreaCtrl .addr_base')[i].attributes.title.value;
                        }
                    }
                    $('#final').prev().addClass('attbg_focus');
                }

            }
        })
        return false;

    })
    $scope.contact_man = function (e, index) {
        $(e.delegateTarget).siblings().removeClass("high");
        $(e.delegateTarget).addClass('high');
        //增加抄送人
        if ($scope.focus == 2) {
            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scpemail_contact_lists[index]);

            //增加收件人
        } else {
            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scpemail_contact_lists[index]);
        }

        //var l=$("input:focus");
    }
    $scope.addpeople_str = function (str, data, index) {
        if (str == '' || str == undefined) {
            str = ''
        }
        if (data.contactname) {
            data.username = data.contactname
        }
        if (data.contactuserid) {
            data.userid = data.contactuserid
        }
        if (data.username) {
            if (str == '') {
                str += data.username;
                if (data.userid) {
                    str += '<' + data.userid + '>'
                }
            } else {
                if (str.indexOf(data.userid) > -1) {
                    return str;
                }
                str += ';'
                str += data.username;
                if (data.userid) {
                    str += '<' + data.userid + '>'
                }

            }
            if (index) {
                //弹出窗选人的时候加的
                if (index == 2) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + data.username + '&lt;' + data.userid + '&gt;" addr="' + data.is_bumen + '" unselectable="on"><b unselectable="on" addr="' + data.is_bumen + '">' + data.username + '</b><span unselectable="on" addr="bob1987bao@163.com">&lt;' + data.userid + '&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();
                } else {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + data.username + '&lt;' + data.userid + '&gt;" addr="' + data.is_bumen + '" unselectable="on"><b unselectable="on" addr="' + data.is_bumen + '">' + data.username + '</b><span unselectable="on" addr="bob1987bao@163.com">&lt;' + data.userid + '&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                }
            } else {

                if ($scope.focus == 2) {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + data.username + '&lt;' + data.userid + '&gt;" addr="' + data.is_bumen + '" unselectable="on"><b unselectable="on" addr="' + data.is_bumen + '">' + data.username + '</b><span unselectable="on" addr="bob1987bao@163.com">&lt;' + data.userid + '&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();

                } else {
                    var add_elem = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + data.username + '&lt;' + data.userid + '&gt;" addr="' + data.is_bumen + '" unselectable="on"><b unselectable="on" addr="' + data.is_bumen + '">' + data.username + '</b><span unselectable="on" addr="bob1987bao@163.com">&lt;' + data.userid + '&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                }
            }


        }
        return str;
    }
    $scope.mousedown = function (index) {
        $scope.focus = index;
    }

    function uploadFile(file, editor, welEditable) {
        fd = new FormData();
        fd.append("docFile0", file);
        $.ajax({
            data: fd,
            type: "POST",
            url: '/web/scp/filesuploadsave2.do', //此处配置后端的上传文件，PHP，JSP或者其它
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                var obj = strToJson(res);
                //obj.data[0].downloadcode
                //'img/p1.jpg'
                editor.summernote('insertImage', '/downloadfile.do?iswb=true&docid=' + obj.data[0].docid); //完成上传后插入图片到编辑器

            }
        });
    }

    $scope.tooglass = function (e) {
        if (e.currentTarget.id == 'stationery_cmd') {
            e.currentTarget.className = 'cptab cpslt'
            $('#addr_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display = 'block'
            $('#AddrTab')[0].style.display = 'none'
        } else {
            e.currentTarget.className = 'cptab cpslt'
            $('#stationery_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display = 'none'
            $('#AddrTab')[0].style.display = 'block'
        }
    }
    var setting2 = {
        async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
                "flag": 1
            },
            dataFilter: filter
        },
        view: {
            showIcon: showIconForTree,
            selectedMulti: true
        },
        check: {
            enable: true, //设置zTree的节点上是否显示checkbox/radio框，默认值: false
            chkboxType: {
                "Y": "ps",
                "N": "ps"
            }
        },
        key: {
            checked: "checked" //zTree 节点数据中保存check状态的属性名称。默认值："checked"
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: beforeExpand,
            //onRightClick : OnRightClick,//右键事件
            onCheck: onCheck,
            onClick: onClick_tons
        }
    }

    //这个是异步
    function filter(treeId, parentNode, childNodes) {
        var treeNode = parentNode;
        if (treeNode && treeNode.children) {
            return;
        }
        if (treeNode) {
            var postdata = treeNode
        } else {
            var postdata = {};
        }
        postdata.flag = 1;
        postdata.emailtype = 3;
        postdata.orgid = parseInt(postdata.id);
        var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
        var children = obj.data.scporgs;
        if (children) {
            treeNode.children = [];
            for (var i = 0; i < children.length; i++) {
                if (parseInt(children[i].sysuserid) > 0) {
                    children[i].name = children[i].username;
                } else {
                    children[i].isParent = true;
                }

            }
        }
        return children;

    }

    function onCheck(e, treeId, treeNode) {
        if (treeNode.checked) {
            if (treeNode.isParent) {
                /**for(var i=0;i<treeNode.children.length;i++){
					//增加抄送人
					if($scope.focus==2){
					  $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,treeNode.children[i]);

					//增加收件人
					}else{
					  $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,treeNode.children[i]);
					}
				}*/
                var postdata = {};
                postdata.flag = 1;
                postdata.emailtype = 3;
                postdata.orgid = parseInt(treeNode.id);
                var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
                var children = obj.data.scporgs;
                for (var i = 0; i < children.length; i++) {
                    if (parseInt(children[i].sysuserid) > 0) {
                        if ($scope.focus == 2) {
                            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, children[i]);
                            //增加收件人
                        } else {
                            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, children[i]);
                        }
                    }

                }
            }
        }
    }

    function onCheck_fz(e, treeId, treeNode) {
        if (treeNode.checked) {
            if (treeNode.isParent) {
                for (var i = 0; i < treeNode.children.length; i++) {
                    //增加抄送人
                    if ($scope.focus == 2) {
                        $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, treeNode.children[i]);

                        //增加收件人
                    } else {
                        $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, treeNode.children[i]);
                    }
                }

            }
        }
    }

    //点击通讯录联系人
    var TimeFn = null;

    function beforeExpand() {
        //双击时取消单机事件
        if (TimeFn) {
            clearTimeout(TimeFn);
        }
    }

    function onClick_tons(treeId, treeNode) {
        // 取消上次延时未执行的方法
        clearTimeout(TimeFn);
        //执行延时
        TimeFn = setTimeout(function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
            var node = zTree.getSelectedNodes()[0];
            //机构
            if (!node.userid) {
                node.is_bumen = '部门';
                node.userid = node.id
                node.username = node.name
            }
            //增加抄送人
            if ($scope.focus == 2) {
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);

                //增加收件人
            } else {
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
            }
        }, 300)
    }

    var setting1 = {
        view: {
            showIcon: showIconForTree
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick_fz,
            onCheck: onCheck_fz
            //onDblClick: onDblClick
        }
    };

    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };

    function onClick_fz(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
        var node = zTree.getSelectedNodes()[0];
        //增加抄送人
        if ($scope.focus == 2) {
            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);

            //增加收件人
        } else {
            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
        }
    }

    BasemanService.RequestPost("scpemail_contact_list", "search", {
        emailtype: 3
    })
        .then(function (data) {
            $scope.data.currItem.scpemail_contact_lists = data.scpemail_contact_lists;
            for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                if (data.scpemail_contact_group_lists[i].contactname) {
                    data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                } else {
                    data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                    data.scpemail_contact_group_lists[i].isParent = true;
                }

            }
            $scope.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
            for (var i = 0; i < data.scporgs.length; i++) {
                data.scporgs[i].id = parseInt(data.scporgs[i].id);
                data.scporgs[i].pId = parseInt(data.scporgs[i].pid);

            }
            for (var i = 0; i < data.scporgs.length; i++) {
                if (data.scporgs[i].username) {
                    data.scporgs[i].orgname = data.scporgs[i].name;
                    data.scporgs[i].name = data.scporgs[i].username
                } else {
                    data.scporgs[i].isParent = true;
                }
            }
            $scope.data.scporgs = data.scporgs;
            $.fn.zTree.init($("#treeDemo1"), setting1, data.scpemail_contact_group_lists);
            $.fn.zTree.init($("#treeDemo2"), setting2, data.scporgs);

        })
    $scope.cancel = function (e) {
        var zTree1 = $.fn.zTree.getZTreeObj("treeDemo1");
        zTree1.destroy();
        var zTree2 = $.fn.zTree.getZTreeObj("treeDemo2");
        zTree2.destroy();
        $modalInstance.dismiss('cancel');
    }

    $scope.initdata();
}

/* *将数据放到网格中
 options
 datas
 columns
 type='checkbox'；选择框
 * */

function commonline($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $modalInstance) {
    $scope.FrmInfo = $scope.$parent.FrmInfo;
    HczyCommon.copyobj($scope.$parent.FrmInfo, $scope);
    $timeout(function () {
        $scope.FrmInfo.options.api.setRowData($scope.FrmInfo.datas);
    }, 1)

    if ($scope.FrmInfo.type == 'checkbox') {
        $scope.FrmInfo.columns[0].checkboxSelection = function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        };
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if ($scope.FrmInfo.type == 'checkbox') {
            var datas = $scope.FrmInfo.options.api.getSelectedRows();
        } else {
            var datas = $scope.FrmInfo.options.api.getSelectedRows();
        }
        $modalInstance.close(datas);
        $modalInstance.dismiss('cancel');
    };
}

function CommonHighPopController($scope, $modalInstance, BaseService) {
    CommonHighPopController = HczyCommon.extend(CommonHighPopController, CommonPopController);
    CommonHighPopController.__super__.constructor.apply(this, arguments);

    $scope.toggleFilter = function (e) {
        $(e.currentTarget).closest("div.modal-body").find("div.high_filter").slideToggle();
        $scope.conditions = !$scope.conditions;
    }

}

//增加多行
function addRows($scope, $modalInstance, BasemanService) {
    $scope.row = 1;

    $scope.ok = function () {
        $modalInstance.close($scope.row);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

//形式发票新增工厂型号编码
function item_h_code($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        $scope.pro_item.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
        return $scope.pro_item
    });
    BasemanService.pageInit($scope);
    // 类型 line_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {
        dictcode: "line_type"
    }).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            $scope.columns[2].cellEditorParams.values.push(newobj);
        }

        if (parseInt($scope.data.currItem.sale_order_type) == 5 || parseInt($scope.data.currItem.sale_order_type) == 6) {
            $scope.typelist = [{
                dictvalue: 4,
                dictname: "配件"
            }, {
                dictvalue: 6,
                dictname: "SKD"
            }, {
                dictvalue: 7,
                dictname: "CKD"
            }]
        } else {
            $scope.typelist = data.dicts;
        }
    })
    //
    $scope.ok = function () {
        $scope.options.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.options.api.getFocusedCell().rowIndex;
        var node = $scope.options.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        if ($scope.proitem.cust_item_name != undefined) {
            data[rowidx].cust_item_name = $scope.proitem.cust_item_name;
        }
        if ($scope.proitem.qty != undefined) {
            data[rowidx].qty = $scope.proitem.qty;
        }
        if ($scope.proitem.price != undefined) {
            data[rowidx].price = $scope.proitem.price;
        }
        if ($scope.proitem.brand_name != undefined) {
            data[rowidx].brand_name = $scope.proitem.brand_name;
        }
        if ($scope.proitem.pro_type != undefined) {
            data[rowidx].line_type = $scope.proitem.pro_type;
        }
        $scope.items = data[rowidx];
        $scope.tempArr = $scope.items;
        $modalInstance.close($scope.tempArr);
    };
    $scope.changetype = function () {
        if ($scope.proitem.pro_type == 1 || $scope.proitem.pro_type == 5 || $scope.proitem.pro_type == 6 || $scope.proitem.pro_type == 7) {
            $scope.proitem.checkbox2 = 3;
        } else if ($scope.proitem.pro_type == 2) {
            $scope.proitem.checkbox2 = 1;
        } else if ($scope.proitem.pro_type == 3) {
            $scope.proitem.checkbox2 = 2;
        } else if ($scope.proitem.pro_type == 4) {
            $scope.proitem.checkbox2 = 4;
            $scope.proitem.qty = 1;
            var postdata = {};
            postdata.line_type = 7;
            postdata.pro_type = 4;
            postdata.flag = 2;
            var promise = BasemanService.RequestPost("pro_item_header", "search", postdata);
            promise.then(function (data) {
                for (var i = 0; i < data.pro_item_headers.length; i++) {
                    data.pro_item_headers[i].seq = (i + 1);
                }
                $scope.options.api.setRowData(data.pro_item_headers);
                BasemanService.pageInfoOp($scope, data.pagination);
            });
        } else {
            $scope.proitem.checkbox2 = 4;
        }
        $scope.options.api.setRowData([]);
    }

    $scope.rowDoubleClicked = function () {
        $scope.options.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.options.api.getFocusedCell().rowIndex;
        var node = $scope.options.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        if ($scope.proitem.cust_item_name != undefined) {
            data[rowidx].cust_item_name = $scope.proitem.cust_item_name;
        }
        if ($scope.proitem.qty != undefined) {
            data[rowidx].qty = $scope.proitem.qty;
        }
        if ($scope.proitem.price != undefined) {
            data[rowidx].price = $scope.proitem.price;
        }
        if ($scope.proitem.brand_name != undefined) {
            data[rowidx].brand_name = $scope.proitem.brand_name;
        }
        if ($scope.proitem.pro_type != undefined) {
            data[rowidx].line_type = $scope.proitem.pro_type;
        }
        $scope.items = data[rowidx];
        $scope.tempArr = $scope.items;
        $modalInstance.close($scope.tempArr);
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.isEdit = false;
    $scope.proitem = {};
    $scope.EditStr = "新增";
    $scope.objattachs = [];

    $scope.proitem.pro_type = parseInt($scope.options_21.api.getModel().rootNode.allLeafChildren[$scope.options_21.api.getFocusedCell().rowIndex].data.line_type);
    if ($scope.proitem.pro_type == 4) {
        $scope.proitem.qty = 1;
    }
    if (parseInt($scope.data.currItem.sale_order_type) == 4) {
        $scope.proitem.pro_type = 5;
    }
    if (parseInt($scope.data.currItem.sale_order_type) == 5 || parseInt($scope.data.currItem.sale_order_type) == 6) {
        $scope.proitem.pro_type = 4;
        $scope.proitem.checkbox2 = 4;
        $scope.proitem.qty = 1;
        var postdata = {};
        postdata.line_type = 7;
        postdata.pro_type = 4;
        postdata.flag = 2;
        var promise = BasemanService.RequestPost("pro_item_header", "search", postdata);
        promise.then(function (data) {
            for (var i = 0; i < data.pro_item_headers.length; i++) {
                data.pro_item_headers[i].seq = (i + 1);
            }
            $scope.options.api.setRowData(data.pro_item_headers);
            BasemanService.pageInfoOp($scope, data.pagination);
        });
    } else {
        $scope.proitem.checkbox2 = 3;
    }
    //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };
    $scope.options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowDoubleClicked: $scope.rowDoubleClicked,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "指导价",
            field: "pdm_price2",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型类型",
            field: "pro_type",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内机名称",
            field: "item_name_nj",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "外机名称",
            field: "item_name_wj",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内机大小",
            field: "item_platform",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压缩机型号",
            field: "comp_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冷凝器规格",
            field: "condenser",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "箱体大小",
            field: "standinfo",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "截止阀规格",
            field: "jzfgg",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "工况",
            field: "gk",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "电源",
            field: "power",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冷量等级",
            field: "cool_ability",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制冷量",
            field: "item_cool",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "适用面板",
            field: "stand_conf",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "EER",
            field: "eer",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冷量等级",
            field: "cool_ability",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制热量",
            field: "item_hot",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内外机噪音",
            field: "voice",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "塑壳",
            field: "molded_case",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "认证",
            field: "authen",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内机风量",
            field: "in_air",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制冷剂",
            field: "refrigerant",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "定速/变频",
            field: "power_frequency",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注",
            field: "note",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }

    ];
    $scope.profit_stat = true;
    $scope.show_profit = function () {
        $scope.profit_stat = !$scope.profit_stat;
    }

    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };

    $scope._pageLoad = function (postdata) {
        if ($scope.FrmInfo.postdata) {
            for (var name in $scope.FrmInfo.postdata) {
                postdata[name] = $scope.FrmInfo.postdata[name];
            }
        }
        if ($scope.postdata) {
            for (var name in $scope.postdata) {
                postdata[name] = $scope.postdata[name];
            }
        }
        if ($scope.proitem.pro_type != undefined) {

            if ($scope.proitem.pro_type == 6) {
                postdata.line_type = 6;
                postdata.pro_type = 1;
                if ($scope.proitem.checkbox2 == 1) {
                    postdata.line_type = 7;
                    postdata.pro_type = 2;
                    postdata.flag = 2;
                } else if ($scope.proitem.checkbox2 == 2) {
                    postdata.line_type = 7;
                    postdata.pro_type = 3;
                    postdata.flag = 2;
                } else if ($scope.proitem.checkbox2 == 3) {
                    postdata.line_type = 7;
                    postdata.pro_type = 1;
                    postdata.flag = 2;
                } else if ($scope.proitem.checkbox2 == 4) {
                    postdata.line_type = 7;
                    postdata.pro_type = 4;
                    postdata.flag = 2;

                }
            } else if ($scope.proitem.pro_type == 7) {
                postdata.line_type = 7;
                postdata.pro_type = 1;
            } else if ($scope.proitem.pro_type == 8) {
                postdata.line_type = 8;
                postdata.pro_type = 4;
            } else if ($scope.proitem.pro_type == 5) {
                postdata.line_type = 5;
                postdata.pro_type = 1;
            } else {
                postdata.pro_type = $scope.proitem.pro_type;
            }

        }
        postdata.sqlwhere = "1=1";
        if ($scope.proitem.refrigerant != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.refrigerant) like '%" + $scope.proitem.refrigerant + "%'";
        }
        if ($scope.proitem.power_frequency != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.power_frequency) like '%" + $scope.proitem.power_frequency + "%'";
        }
        if ($scope.proitem.power != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.power) like '%" + $scope.proitem.power + "%'";
        }
        if ($scope.proitem.cool_stand != undefined) {
            postdata.sqlwhere = " and upper(pro_item_header.cool_stand) like '%" + $scope.proitem.cool_stand + "%'";
        }

        if ($scope.proitem.eer != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.eer) like '%" + $scope.proitem.eer + "%'";
        }
        if ($scope.proitem.item_hot != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.item_hot) like '%" + $scope.proitem.item_hot + "%'";
        }
        if ($scope.proitem.cop != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.cop) like '%" + $scope.proitem.cop + "%'";
        }
        if ($scope.proitem.voice != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.voice) like '%" + $scope.proitem.voice + "%'";
        }

        if ($scope.proitem.molded_case != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.molded_case) like '%" + $scope.proitem.molded_case + "%'";
        }
        if ($scope.proitem.authen != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.authen) like '%" + $scope.proitem.authen + "%'";
        }
        if ($scope.proitem.in_air != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.in_air) like '%" + $scope.proitem.in_air + "%'";
        }
        if ($scope.proitem.item_platform != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.item_platform) like '%" + $scope.proitem.item_platform + "%'";
        }

        if ($scope.proitem.item_h_code != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.item_h_code) like '%" + $scope.proitem.item_h_code + "%'";
        }
        if ($scope.proitem.item_h_name != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.item_h_name) like '%" + $scope.proitem.item_h_name + "%'";
        }
        if ($scope.proitem.item_code != undefined) {
            postdata.sqlwhere += " and  exists(select 1 from pro_item where pro_item_header.item_h_id = pro_item.item_h_id and  Upper(pro_item.item_code) like'%" + $scope.proitem.item_code + "%')";
        }
        if ($scope.proitem.item_name != undefined) {
            postdata.sqlwhere += " and  exists(select 1 from pro_item where pro_item_header.item_h_id = pro_item.item_h_id and  Upper(pro_item.item_name) like'%" + $scope.proitem.item_name + "%')";
        }

        if ($scope.proitem.condenser != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.condenser) like '%" + $scope.proitem.condenser + "%'";
        }
        if ($scope.proitem.item_cool != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.item_cool) like '%" + $scope.proitem.item_cool + "%'";
        }

        if ($scope.proitem.stand_conf != undefined) {
            postdata.sqlwhere += " and upper(pro_item_header.stand_conf) like '%" + $scope.proitem.stand_conf + "%'";
        }

        var promise = BasemanService.RequestPost("pro_item_header", "search", postdata);
        promise.then(function (data) {
            for (var i = 0; i < data.pro_item_headers.length; i++) {
                data.pro_item_headers[i].seq = (i + 1);
            }
            $scope.options.api.setRowData(data.pro_item_headers);
            BasemanService.pageInfoOp($scope, data.pagination);
        });
    }
}

//形式发票新增易损件
function part_additem($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
        return $scope.data.currItem
    });
    BasemanService.pageInit($scope);
    var post = $scope.FrmInfo.postdata;
    post.pagination = "pn=1,ps=50,pc=0,cn=0,ci=0";
    post.sqlwhere = $scope.FrmInfo.sqlBlock;
    var promise = BasemanService.RequestPost("pro_item", "search", post);
    promise.then(function (data) {
        $scope.items = [];
        $scope.items[0] = {
            sale_pi_item_h_lineofsale_pi_headers: data.sale_pi_item_h_lineofsale_pi_headers
        };
    })
    $scope.ok = function () {
        $scope.options.api.stopEditing(false);
        var pusher = $scope.options.api.getSelectedRows();
        pusher.cust_item_name = $scope.proitem.cust_item_name;
        if ($scope.items) {
            $scope.items[1] = {
                pro_item_partofpro_items: pusher
            };
        } else {
            $scope.items = [];
            $scope.items[1] = {
                pro_item_partofpro_items: pusher
            };
        }
        $scope.tempArr = $scope.items;
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.isEdit = false;
    $scope.proitem = {};
    $scope.EditStr = "新增";
    $scope.objattachs = [];
    //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };
    $scope.options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.require_qty = function () {
        var _this = $(this);
        var val = _this.val();
        var index = _this.attr('index');
        var key = ["amt"];
        var index = $scope.options.api.getFocusedCell().rowIndex;
        var nodes = $scope.options.api.getModel().rootNode.childrenAfterGroup;
        //var cell=$scope.options.api.getFocusedCell();
        if (index != undefined) {
            var amt = Number(nodes[index].data.psale_price || 0) * Number(val || 0);
            nodes[index].data.amt = amt;
        }
        $scope.options.api.refreshCells(nodes, key);
    }
    $scope.psale_price = function () {
        var _this = $(this);
        var val = _this.val();
        var index = $scope.options.api.getFocusedCell().rowIndex;
        var key = ["amt"];
        var nodes = $scope.options.api.getModel().rootNode.childrenAfterGroup;
        if (index != undefined) {
            var amt = Number(nodes[index].data.require_qty || 0) * Number(val || 0);
            nodes[index].data.amt = amt;
        }
        $scope.options.api.refreshCells(nodes, key);
    }
    $scope.columns = [{
        headerName: '序号',
        field: 'deq',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
        {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机名称",
            field: "item_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件编码",
            field: "item_p_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件描述",
            field: "part_desc",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "英文描述",
            field: "part_en_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件描述",
            field: "part_desc",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单台用量",
            field: "qty",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "需求数量",
            field: "require_qty",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "整数框",
            cellchange: $scope.require_qty,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "成本",
            field: "price",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售价格",
            field: "psale_price",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "浮点框",
            cellchange: $scope.psale_price,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额",
            field: "amt",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注",
            field: "note",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }

    ];
    $scope.profit_stat = true;
    $scope.show_profit = function () {
        $scope.profit_stat = !$scope.profit_stat;
    }
    $scope._pageLoad = function (postdata) {

        if (postdata) {
            postdata.sqlwhere = BasemanService.getSqlWhereBlock();
        }
        if ($scope.FrmInfo.postdata) {
            for (var name in $scope.FrmInfo.postdata) {
                postdata[name] = $scope.FrmInfo.postdata[name];
            }
        }

        if ($scope.postdata) {
            for (var name in $scope.postdata) {
                postdata[name] = $scope.postdata[name];
            }
        }
        if ($scope.FrmInfo.sqlBlock) {
            postdata.sqlwhere += "and" + $scope.FrmInfo.sqlBlock;
        }
        var promise = BasemanService.RequestPost("pro_item", "search", postdata);
        promise.then(function (data) {
            $scope.items = [];
            $scope.items[0] = {
                sale_pi_item_h_lineofsale_pi_headers: data.sale_pi_item_h_lineofsale_pi_headers
            };
            var list = [];
            $scope.proitem.pro_item_partofpro_items = data.pro_item_partofpro_items;
            if ($scope.proitem.pro_item_partofpro_items.length == 0) {
                BasemanService.notice("无数据返回", "alert-warning");
                return;
            }
            for (var i = 0; i < $scope.proitem.pro_item_partofpro_items.length; i++) {
                $scope.proitem.pro_item_partofpro_items[i].seq = (i + 1);
            }
            $scope.options.api.setRowData($scope.proitem.pro_item_partofpro_items);
            BasemanService.pageInfoOp($scope, data.pagination);
        });
    }
}

//生产单 长线物料申请
function ma_no($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
        return $scope.data.currItem
    });
    BasemanService.pageInit($scope);

    $scope.ok = function () {
        $scope.options.api.stopEditing(false);
        var pusher = $scope.options.api.getSelectedRows();
        $scope.items = pusher;
        $scope.tempArr = $scope.items;
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.isEdit = false;
    $scope.proitem = {};
    $scope.EditStr = "新增";
    $scope.objattachs = [];
    if ($scope.detail == 1) {

    } else {
        $scope.proitem.choose = 1;
    }

    //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };
    $scope.options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns = [{
        headerName: '序号',
        field: 'seq',
        width: 70,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
        {
            headerName: "申请人",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单号",
            field: "ma_no",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料名称",
            field: "item_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请数量",
            field: "qty",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已用数量",
            field: "prod_qty",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可用数量",
            field: "can_qty",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否已发布",
            field: "is_published",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.profit_stat = true;
    $scope.show_profit = function () {
        $scope.profit_stat = !$scope.profit_stat;
    }
    if ($scope.detail == 1) {
        var postdata = {};
        postdata.org_id = $scope.data.currItem.org_id;
        postdata.flag = 2;
        var promise = BasemanService.RequestPost("sale_material_apply_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = [];
            $scope.items = data.sale_material_apply_headers;
            for (var i = 0; i < data.sale_material_apply_headers.length; i++) {
                data.sale_material_apply_headers[i].seq = (i + 1);
            }
            $scope.options.api.setRowData(data.sale_material_apply_headers);
            if (data.sale_material_apply_headers == 0) {
                BasemanService.notice("无数据返回", "alert-warning");
                return;
            }

            BasemanService.pageInfoOp($scope, data.pagination);
        });
    }
    $scope._pageLoad = function (postdata) {

        postdata.flag = 1;
        if ($scope.proitem.choose == 1) {
            postdata.item_h_code = $scope.item_h_code;
            postdata.s_flag = 0;
            postdata.org_id = 0;
        } else if ($scope.proitem.choose == 2) {
            postdata.s_flag = 1;
            postdata.org_id = $scope.data.currItem.org_id;
        } else if ($scope.proitem.choose == 3) {
            postdata.s_flag = 2;
            postdata.org_id = 0;
        }
        var promise = BasemanService.RequestPost("sale_material_apply_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = [];
            $scope.items = data.sale_material_apply_headers;
            for (var i = 0; i < data.sale_material_apply_headers.length; i++) {
                data.sale_material_apply_headers[i].seq = (i + 1);
            }
            $scope.options.api.setRowData(data.sale_material_apply_headers);
            if (data.sale_material_apply_headers == 0) {
                BasemanService.notice("无数据返回", "alert-warning");
                return;
            }

            BasemanService.pageInfoOp($scope, data.pagination);
        });
    }
}

/**
 * 包装箱清单查询
 */
function sale_prod_packages_earch($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
    $scope.warn = {}
    $scope.data = {
        currItem: {},
    }
    localeStorageService.pageHistory($scope, function () {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
    });
    BasemanService.pageInit($scope);
    $scope.warn.package_searchColumns = [{
        headerName: "序号",
        field: "seq",
        editable: false,
        filter: 'set',
        width: 60,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "商检批号",
        field: "inspection_batchno",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "生产批次",
        field: "mo_code",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "包装箱编码",
        field: "package_code",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "包装箱条码",
        field: "package_code2",
        editable: true,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "毛重",
        field: "package_gw",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "净重",
        field: "package_nw",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "体积",
        field: "package_tj",
        editable: false,
        filter: 'set',
        width: 80,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "包装箱尺寸",
        field: "package_rule",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "散件物料编码",
        field: "item_code",
        editable: false,
        filter: 'set',
        width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "散件物料条码",
        field: "item_code2",
        editable: false,
        filter: 'set',
        width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "散件物料描述(中)",
        field: "item_desc",
        editable: false,
        filter: 'set',
        width: 230,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "散件物料描述(英)",
        field: "item_desc2",
        editable: false,
        filter: 'set',
        width: 230,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "散件物料数量",
        field: "item_qty",
        editable: false,
        filter: 'set',
        width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        headerCssClass: 'not-null',
    }, {
        headerName: "成品机客户型号",
        field: "cust_item_name",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "成品物料描述",
        field: "cust_spec",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "生产批次",
        field: "mo_code",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "包装箱数量",
        field: "qty",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "传输日期",
        field: "bill_date",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "物料客户编码",
        field: "item_cust_code",
        editable: false,
        filter: 'set',
        width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }];
    $scope.warn.package_searchoptions = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: true,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: true,
        quickFilterText: null,
        rowClicked: undefined,
        groupSelectsChildren: true, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: $scope.$parent.groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.packageoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    $scope.warn.inspection_batchno = $scope.$parent.FrmInfo.inspection_batchno;
    $scope.warn.package_code2 = $scope.$parent.FrmInfo.package_code2 || "";

    $scope._pageLoad = function (postdata) {
        postdata.inspection_batchno = $scope.warn.inspection_batchno || '';
        postdata.pi_no = $scope.warn.pi_no || '';
        postdata.payment_type_code = $scope.warn.package_code || '';
        postdata.payment_type_name = $scope.warn.package_code2 || '';
        postdata.erp_code = $scope.warn.erp_code || '';
        BasemanService.RequestPost("Sale_Prod_Header", "getpackagelist", postdata).then(function (data) {
            for (var i = 0; i < data.sale_prod_package_itemofsale_prod_headers.length; i++) {
                data.sale_prod_package_itemofsale_prod_headers[i].seq = i + 1;
            }
            if (data.pagination.length > 0) {
                BasemanService.pageInfoOp($scope, data.pagination);
            }
            $scope.warn.package_searchoptions.api.setRowData(data.sale_prod_package_itemofsale_prod_headers);
        })
    }
    $timeout(function () {
        $scope.search()
    }, 20)
    $scope.warn.closefrm = function () {
        $modalInstance.close();
    }

}

/**
 * 弹出出样商品
 */
function PopSampleController(BasemanService, $scope, $modalInstance, BasemanService) {

    var original_data = {};

    var postdata = {
        flag: 2
    };
    BasemanService.RequestPost("drp_item", "search", postdata)
        .then(function (data) {
            original_data = data.drp_items;
            $scope.data.samples = data.drp_items;
        });

    $scope.setCheck = function (e, index) {

        var grid = $scope.$parent.samoptions.grid;
        var data = grid.getData();

        var alreadyIn = false;

        for (var i = 0; i < data.length; i++) {
            if (data[i].spec == $scope.data.samples[index].spec) {
                alreadyIn = true;
            }
        }

        if (!alreadyIn) {
            //			$scope.data.samples[index].price=0;
            //			$scope.data.samples[index].type=1;
            //			$scope.data.samples[index].amount=0;
            //			$scope.data.samples[index].qty=1;
            //			data.push($scope.data.samples[index]);

            data.push({
                spec: $scope.data.samples[index].spec,
                price: 0,
                item_name: $scope.data.samples[index].item_name,
                item_id: $scope.data.samples[index].item_id,
                item_code: $scope.data.samples[index].item_code,
                type: 1,
                amount: 0,
                item_h_id: $scope.data.samples[index].item_h_id,
                volume: $scope.data.samples[index].volume,
                line_id: 0,
                qty: 1
            });
            grid.setData(data);
            grid.resizeCanvas();
        }

    };

    $scope.filter = function () {
        if ($scope.searchtext != undefined) {
            $scope.data.samples = [];
            var length = original_data.length;
            for (var i = 0; i < length; i++) {
                if (original_data[i].spec.indexOf($scope.searchtext) > -1) {
                    $scope.data.samples.push(original_data[i]);
                }
            }
        } else {
            $scope.data.samples = original_data;
        }

    };

    $scope.ok = function () {

        $modalInstance.close($scope.proitem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getProductType = function () {
        //跳转
        BasemanService.openFrm("views/popview/pop_product_type.html", PopProductTypeController, $scope, "", "lg").result.then(function (data) {
            //			$scope.data.samples = [];

            $("#filter_title").val(data.item_type_name);

            var tempdata = []

            var length = original_data.length;

            if (data.lev == 1) {
                for (var i = 0; i < length; i++) {
                    if (original_data[i].bigc_id == data.item_type_id) {
                        tempdata.push(original_data[i]);
                    }
                }
            } else if (data.lev == 2) {
                for (var i = 0; i < length; i++) {
                    if (original_data[i].smallc_id == data.item_type_id) {
                        tempdata.push(original_data[i]);
                    }
                }
            } else if (data.lev == 3) {
                for (var i = 0; i < length; i++) {
                    if (original_data[i].series_id == data.item_type_id) {
                        tempdata.push(original_data[i]);
                    }
                }
            }

            //			if (tempdata.length != 0) {
            $scope.data.samples = tempdata;
            //			}

        });

    };
}

/**
 * 弹出商品种类
 */
function PopProductTypeController(BasemanService, $scope, $modalInstance, BasemanService) {

    var producttype_original_data = {};

    var postdata = {};

    var sendData = {};
    BasemanService.RequestPost("drp_item_type", "search", postdata)
        .then(function (data) {
            producttype_original_data = data.drp_item_types;
            $scope.data.product_types = [];
            var length = producttype_original_data.length;
            for (var i = 0; i < length; i++) {
                if (producttype_original_data[i].lev == 1) {
                    $scope.data.product_types.push(producttype_original_data[i]);
                }
            }
        });

    $scope.setNext = function (index) {
        sendData = $scope.data.product_types[index];
        //		sendData.item_type_id=$scope.data.product_types[index].item_type_id;

        var tempdata = []
        var length = producttype_original_data.length;

        for (var i = 0; i < length; i++) {
            if (producttype_original_data[i].pid == sendData.item_type_id) {
                tempdata.push(producttype_original_data[i]);
            }
        }

        if (tempdata.length != 0) {
            $scope.data.product_types = tempdata;
        }

    };

    $scope.setCheck = function (index) {
        sendData = $scope.data.product_types[index];

        //		sendData.item_type_id=$scope.data.product_types[index].item_type_id;
        //		var tempdata = []
        //		var length = producttype_original_data.length;
        //
        //		for (var i = 0; i < length; i++) {
        //			if (producttype_original_data[i].pid == sendData.item_type_id) {
        //				tempdata.push(producttype_original_data[i]);
        //			}
        //		}
        //		if (tempdata.length != 0) {
        //			$scope.data.product_types = tempdata;
        //		}

    };

    $scope.filter = function () {
        if ($scope.searchtext != undefined) {
            //			$scope.data.samples = [];
            var tempdata = []
            var length = producttype_original_data.length;

            for (var i = 0; i < length; i++) {
                if (producttype_original_data[i].item_type_name.indexOf($scope.searchtext) > -1) {
                    tempdata.push(producttype_original_data[i]);
                }
            }

            if (tempdata.length != 0) {
                $scope.data.product_types = tempdata;
            }

        }

    };

    $scope.ok = function () {
        $modalInstance.close(sendData);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

/**
 * 区域选择弹窗
 */
function AreaPopController($scope, $modalInstance, BasemanService) {
    AreaPopController = HczyCommon.extend(AreaPopController, BasePopController);
    AreaPopController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["areaname", "areacode"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("base_search", "searchcountry", postdata);
        promise.then(function (data) {
            $scope.items = data.countrys;
        });
    };
}

/**
 * 弹出客户与终端
 */
function PopCusAndTerminalController($scope, $modalInstance, BasemanService) {
    var original_customers;
    var original_terminals;

    var callback;

    var postdata = {};
    BasemanService.RequestPost("drp_cust", "search", postdata)
        .then(function (data) {
            $scope.data.customers = data.drp_custs;
            original_customers = data.drp_custs;
        });

    var postdata = {};

    BasemanService.RequestPost("mkt_terminal", "search", postdata)
        .then(function (data) {
            $scope.data.terminals = data.mkt_terminals;
            original_terminals = data.mkt_terminals;
        });

    $scope.filter = function () {
        if ($scope.searchtext != undefined) {
            //			$scope.data.customers = [];
            //			$scope.data.terminals = [];
            //			var length1 = original_customers.length;
            //			var length2 = original_terminals.length;
            //
            //			for (var i1 = 0; i1 < length1; i1++) {
            //				if (original_customers[i1].cust_name.indexOf($scope.searchtext) > -1) {
            //					$scope.data.customers.push(original_customers[i1]);
            //				}
            //			}
            //
            //			for (var i2 = 0; i2 < length2; i2++) {
            //				if (original_terminals[i2].terminal_name.indexOf($scope.searchtext) > -1) {
            //					$scope.data.terminals.push(original_terminals[i2]);
            //				}
            //			}

            var postdata = {
                sqlwhere: BasemanService.getSqlWhere(["cust_name", "short_name"], $scope.searchtext)
            };
            BasemanService.RequestPost("drp_cust", "search", postdata)
                .then(function (data) {

                    $scope.data.customers = data.drp_custs;

                });

            var postdata = {
                sqlwhere: BasemanService.getSqlWhere(["terminal_name"], $scope.searchtext)
            };

            BasemanService.RequestPost("mkt_terminal", "search", postdata)
                .then(function (data) {
                    $scope.data.terminals = data.mkt_terminals;
                });

        } else {
            $scope.data.customers = original_customers;
            $scope.data.terminals = original_terminals;
        }

    };

    $scope.showCustomer = function () {
        if ($("#customers").hasClass("hide")) {
            $("#customers").removeClass("hide");
        }
        if (!$("#addresses").hasClass("hide")) {
            $("#addresses").addClass("hide");
        }
    }

    $scope.showTerminal = function () {
        if ($("#addresses").hasClass("hide")) {
            $("#addresses").removeClass("hide");
        }
        if (!$("#customers").hasClass("hide")) {
            $("#customers").addClass("hide");
        }
    }

    $scope.setCheck = function (e, index) {
        $scope.data.obj_name = $scope.data.customers[index].cust_name;
        $scope.data.Obj_Id = $scope.data.customers[index].cust_id;
        $scope.data.address = $scope.data.customers[index].address;
        $scope.data.type = 1;
        callback = $scope.data.customers[index];
    };

    $scope.setTerminal = function (e, index) {
        $scope.data.obj_name = $scope.data.terminals[index].terminal_name;
        $scope.data.Obj_Id = $scope.data.terminals[index].terminal_id;
        $scope.data.address = $scope.data.terminals[index].address;
        $scope.data.type = 2;
        callback = $scope.data.terminals[index];
    }

    $scope.ok = function () {
        //		$scope.$parent.data.cust_name = $scope.data.cust_name;
        //		$scope.$parent.data.address = $scope.data.address;
        //		$scope.$parent.data.canuse_amount = $scope.data.canuse_amount;
        //		$scope.$parent.data.take_man = $scope.data.take_man;
        //		$scope.$parent.data.phone_code = $scope.data.phone_code;
        $modalInstance.close(callback);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getORGID = function () {
        //跳转
        BasemanService.openFrm("views/popview/pop_org_id.html", PopOrgIDController, $scope, "", "lg").result.then(function (data) {
            //$scope.data.samples = [];
            $scope.areaname = data.orgname;

            var tempcus = []

            var tempter = []

            var length1 = original_customers.length;

            var length2 = original_terminals.length;

            //获得区域内客户
            for (var i1 = 0; i1 < length1; i1++) {
                if (original_customers[i1].orgid == data.orgid) {
                    tempcus.push(original_customers[i1])
                }
            }
            //			if(tempcus.length!=0){
            $scope.data.customers = tempcus;
            //			}

            //获得区域内客户
            for (var i2 = 0; i2 < length2; i2++) {
                if (original_terminals[i2].org_id == data.orgid) {
                    tempter.push(original_terminals[i1])
                }
            }
            //			if(tempter.length!=0){
            $scope.data.terminals = tempter;
            //			}

        });

    };
}

/**
 *支付条件查询
 */
function PaymentTypePopController($scope, $modalInstance, BasemanService) {

    PaymentTypePopController = HczyCommon.extend(PaymentTypePopController, BasePopController);
    PaymentTypePopController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["payment_type_name", "payment_type_code"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("payment_type", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.payment_types;
        });
    };
}

/**
 * 产品资料 -- 产品线
 */
function PopLineController($scope, $modalInstance, ProItemHeaderService) {

    PopLineController = HczyCommon.extend(PopLineController, BasePopController);
    //	PopLineController.apply(this, arguments);
    PopLineController.__super__.constructor.apply(this, arguments);

    //	angular.extend(BasePopController);

    $scope.search = function () {
        var sqlWhere = ProItemHeaderService.getSqlWhere(["item_type_name"], $scope.searchtext);
        var postdata = {
            Flag: 0,
            sqlwhere: sqlWhere
        };
        var promise = ProItemHeaderService.RequestPost("pro_item_type", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.pro_item_types;
        });

    };
}

/**
 * 产品资料 -- 新增编辑 --物料组
 */
function PopGroupController($scope, $modalInstance, ProItemHeaderService) {
    PopGroupController = HczyCommon.extend(PopGroupController, BasePopController);
    PopGroupController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = ProItemHeaderService.getSqlWhere(["item_group_name"], $scope.searchtext);
        var postdata = {
            Flag: 0,
            sqlwhere: sqlWhere
        };
        var promise = ProItemHeaderService.RequestPost("pro_item_group", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.pro_item_groups;
        });
    };
}

/**
 *  产品资料-- 配件
 */
function PopPartController($scope, $modalInstance, ProItemHeaderService) {
    PopPartController = HczyCommon.extend(PopPartController, BasePopController);
    PopPartController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = ProItemHeaderService.getSqlWhere(["item_type"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = ProItemHeaderService.RequestPost("pro_item_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.pro_item_headers;
        });
    }
}

/**
 * 基准机型
 */
function PopItemController($scope, $modalInstance, BasemanService) {
    PopItemController = HczyCommon.extend(PopItemController, BasePopController);
    PopItemController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["item_h_code", "item_h_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("pro_item_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.pro_item_headers;
        });
    }
}

/**
 * 银行
 */
function PopBankController($scope, $modalInstance, BasemanService) {
    PopBankController = HczyCommon.extend(PopBankController, BasePopController);
    PopBankController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["bank_code", "bank_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("bank", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.banks;
        });
    }
}

/**
 * 业务员
 */
function PopUserController($scope, $modalInstance, BasemanService) {
    PopUserController = HczyCommon.extend(PopUserController, BasePopController);
    PopUserController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["username"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.flag == 2) {
            postdata = {
                flag: 2,
                org_id: $scope.data.currItem.org_id
            }
        }
        var promise = BasemanService.RequestPost("scpuser", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.users;
        });
    }
}

/**
 * 客户开户
 */
function PopCustomerApplyController($scope, $modalInstance, BasemanService) {
    PopCustomerApplyController = HczyCommon.extend(PopCustomerApplyController, BasePopController);
    PopCustomerApplyController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["apply_no", "apply_date", "cust_name", "org_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("customer_apply_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.customer_apply_headers;
        });
    }
}

/**
 * 客户
 */
function PopCustController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["cust_code", "cust_name", "short_name"], $scope.searchtext, "left");

        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.flag == 2) {
            postdata = {
                flag: 2,
                org_id: $scope.data.currItem.org_id,
                cust_id: $scope.data.currItem.cust_id
            }
        }
        var promise = BasemanService.RequestPost("customer", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.customers;
        });
    }
}

/**
 * 销售部门
 */
function PopOrgController($scope, $modalInstance, BasemanService) {
    PopOrgController = HczyCommon.extend(PopOrgController, BasePopController);
    PopOrgController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //配件信息
        var sqlWhere = BasemanService.getSqlWhere(["orgname", "code"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("base_search", "searchorg", postdata);
        promise.then(function (data) {
            $scope.items = data.orgs;
        });
    }
}

/**
 * 港口
 */
function PopSeaPortController($scope, $modalInstance, BasemanService) {
    PopSeaPortController = HczyCommon.extend(PopSeaPortController, BasePopController);
    PopSeaPortController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["seaport_code", "seaport_name", "english_name", "seaport_type"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };

        postdata.seaport_type = $scope.FrmInfo.seaport_type;

        var promise = BasemanService.RequestPost("seaport", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.seaports;
        });
    }
}

/**
 * 柜型
 * @param $scope
 * @param $modalInstance
 * @param BasemanService
 */
function PopItemBoxLineController($scope, $modalInstance, BasemanService) {
    PopItemBoxLineController = HczyCommon.extend(PopItemBoxLineController, BasePopController);
    PopItemBoxLineController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["pro_item_header", "search"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 1
        };
        var promise = BasemanService.RequestPost("pro_item_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.seaports;
        });
    }
}

/**
 * 产品
 */
function PopSalePiItemLineController($scope, $modalInstance, BasemanService) {
    $scope.ok = function () {
        $scope.$parent.isLineEdit = false;
        $modalInstance.close($scope.proitem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    if ($scope.$parent.isLineEdit) {
        $scope.proitem = $scope.$parent.EditObj;
        $scope.$parent.EditObj = null;
    } else {
        $scope.proitem = {};
    }

    $scope.cal_bzcc = function (event) {
        if ($scope.proitem.discount && $scope.proitem.apply_price) {
            var reg = new RegExp("^[0-9].[0-9]*$");
            if (reg.test($scope.proitem.discount) && reg.test($scope.proitem.apply_price)) {

                var executive_price = $scope.proitem.apply_price * (100 - $scope.proitem.discount) / 100;

                $scope.proitem.executive_price = HczyCommon.toDecimal2(executive_price);
            }
        }
    }

    $scope.openProItemFrm = function () {
        var FrmInfo = {};
        FrmInfo.title = "基准机型";
        FrmInfo.thead = [{
            name: "整机编码",
            code: "item_h_code"
        },
            {
                name: "整机名称",
                code: "item_h_name"
            }
        ];
        BasemanService.openCommonFrm(PopItemController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.proitem.item_id = result.item_h_id;
            //			$scope.proitem.h_spec = result.item_h_code;
            $scope.proitem.h_spec = result.item_h_name;
        });
    }
}

/**
 * 流程审批意见
 */
function PopWFOptionController($scope, $modalInstance, BasemanService, localeStorageService, $timeout) {
    $scope.item = {
        opinion: '同意',
        archivetoname: '',
        archivetotype: '',
        archivetoid: '',
        archiveTree: [],
    };

    var treeSetting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: beforeExpand,
            onClick: treeNodeSelected
        }
    };

    function treeNodeSelected() {
        var zTree = $.fn.zTree.getZTreeObj("treeFdr");
        var node = zTree.getSelectedNodes()[0];

        $scope.item.archivetoid = node.idpath;
        $scope.item.archivetotype = node.typepath;

        var __namepath = '/' + node.name;
        while (node.parentTId != null) {
            var p = zTree.getNodeByTId(node.parentTId);
            __namepath = '/' + p.name + __namepath;

            node = p;
        }

        $scope.archivetoname = __namepath;

    }

    function beforeExpand(treeId, treeNode) {
        if (treeNode.children) {
            return;
        }

        var postdata = treeNode;
        BasemanService.RequestPost('scpfdr', 'selectref', postdata)
            .then(function (data) {
                data.children = data.fdrs;
                if (data.children) {
                    treeNode.children = [];
                    var zTree = $.fn.zTree.getZTreeObj("treeFdr");
                    for (var i = 0; i < data.children.length; i++) {
                        data.children[i].isParent = true;
                        data.children[i].name = data.children[i].fdrname
                        data.children[i].pId = parseInt(treeNode.id);
                        data.children[i].id = parseInt(data.children[i].fdrid)
                        data.children[i].item_type = 1;
                        zTree.addNodes(treeNode, data.children[i])
                    }
                    //zTree.expandNode(treeNode, true, false, false);

                }

            });
    }

    var initData = function () {
        BasemanService.RequestPost("scpworkspace", "selectref", {
            wsid: -4,
            sysuserid: userbean.sysuserid
        }).then(function (data) {
            $scope.archiveTree = data.fdrs;

            var zNodes = {};
            zNodes.name = '公司文档'
            zNodes.id = 0;
            zNodes.isParent = true;
            data.children = data.fdrs;
            for (var i = 0; i < data.children.length; i++) {
                data.children[i].isParent = true;
                data.children[i].name = data.children[i].fdrname;
                //文件夹的时候设置为1
                data.children[i].item_type = 1;
                data.children[i].id = parseInt(data.children[i].fdrid);
            }
            zNodes.children = data.children;
            zTree = $.fn.zTree.init($("#treeFdr"), treeSetting, zNodes);
            //展开根节点
            zTree.expandNode(zTree.getNodes()[0], true, false, false);
        });
    }

    var data = localeStorageService.get("wf_procusers");
    console.log(data);
    $scope.proc = localeStorageService.get("current_proc");

    if ($scope.proc) {
        if ($scope.proc.proctype == 5) {
            $scope.title = "选择发布对象";

            $scope.data = {};
            $scope.data.currItem = {};
            //用户
            $scope.data.currItem.sj_people = [];
            $scope.data.currItem.cs_people = [];
            console.log($scope.proc.wfpublishofwfprocs);
            if ($scope.proc.wfpublishofwfprocs.length > 0) {
                for (var i = 0; i < $scope.proc.wfpublishofwfprocs.length; i++) {
                    console.log($scope.proc.wfpublishofwfprocs[i]);
                    var wfid = $scope.proc.wfpublishofwfprocs[i].wfid;
                    var procid = $scope.proc.wfpublishofwfprocs[i].procid;

                    if ($scope.proc.wfpublishofwfprocs[i].publishtype == 12) {
                        //这是部门
                        var object = {};
                        object.orgname = $scope.proc.wfpublishofwfprocs[i].toname;
                        object.orgid = $scope.proc.wfpublishofwfprocs[i].publishto;
                        object.publishtype = $scope.proc.wfpublishofwfprocs[i].publishtype;
                        object.wfid = $scope.proc.wfpublishofwfprocs[i].wfid;
                        $scope.data.currItem.cs_people.push(object);
                    } else {
                        //这是人员
                        var object = {};
                        object.username = $scope.proc.wfpublishofwfprocs[i].toname;
                        object.userid = $scope.proc.wfpublishofwfprocs[i].publishto;
                        object.publishtype = $scope.proc.wfpublishofwfprocs[i].publishtype;
                        object.wfid = $scope.proc.wfpublishofwfprocs[i].wfid;
                        $scope.data.currItem.sj_people.push(object);
                    }
                }
            }

            Array.prototype.push.apply($scope.data.currItem.sj_people, $scope.arrays_user);
            //添加用户
            $scope.add_sj = function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                var node = zTree.getSelectedNodes()[0];
                if (node == undefined || node.isParent == true) {
                    BasemanService.notice("请选择人员", "alert-info");
                    return;
                }
                var object = {};
                object.username = node.name;
                object.userid = (node.userid);
                object.wfid = wfid;

                for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                    if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                        BasemanService.notice("选择人员重复", "alert-info");
                        return;
                    }
                }

                $scope.data.currItem.sj_people.push(object);
            }
            //点击当前用户加光标
            $scope.click_sj = function (e, index) {
                $scope.sj_index = index;
                $(e.delegateTarget).siblings().removeClass("high");
                $(e.delegateTarget).addClass('high');
            }
            //机构
            Array.prototype.push.apply($scope.data.currItem.cs_people, $scope.arrays_org);

            //添加机构
            $scope.add_cs = function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                var node = zTree.getSelectedNodes()[0];

                if (node == undefined || node.isParent != true) {
                    BasemanService.notice("请选择机构", "alert-info");
                    return;
                }
                var object = {};
                object.orgname = node.name;
                object.orgid = parseInt(node.id);

                for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {

                    if (object.orgid == $scope.data.currItem.cs_people[i].orgid) {
                        BasemanService.notice("选择机构重复", "alert-info");
                        return;
                    }
                }

                $scope.data.currItem.cs_people.push(object);
            }
            //删除用户
            $scope.del_sj = function () {
                $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
            }

            //删除机构
            $scope.del_cs = function () {
                $scope.data.currItem.cs_people.splice($scope.cs_index, 1);
            }
            //双击删除用户
            $scope.del_user = function () {
                $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
            }
            //双击删除机构
            $scope.del_org = function () {
                $scope.data.currItem.cs_people.splice($scope.cs_index, 1);
            }
            //点击当前机构加光标
            $scope.click_cs = function (e, index) {
                $scope.cs_index = index;
                $(e.delegateTarget).siblings().removeClass("high");
                $(e.delegateTarget).addClass('high');
            }

            function showIconForTree(treeId, treeNode) {
                return !treeNode.isParent;
            };
            BasemanService.RequestPost("scpemail_contact_list", "search", {
                emailtype: 3
            })
                .then(function (data) {
                    for (var i = 0; i < data.scporgs.length; i++) {
                        data.scporgs[i].id = parseInt(data.scporgs[i].id);
                        data.scporgs[i].pId = parseInt(data.scporgs[i].pid);
                        if (data.scporgs[i].username) {
                            data.scporgs[i].orgname = data.scporgs[i].name;
                            data.scporgs[i].name = data.scporgs[i].username
                        } else {
                            data.scporgs[i].isParent = true;
                        }
                    }
                    $scope.data.scporgs = data.scporgs;
                    $.fn.zTree.init($("#treeDemo4"), setting4, $scope.data.scporgs);
                })
            //树状结构定义
            var setting4 = {
                async: {
                    enable: true,
                    url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                    autoParam: ["id", "name=n", "level=lv"],
                    otherParam: {
                        "flag": 1
                    },
                    dataFilter: filter
                },
                view: {
                    showIcon: showIconForTree
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    //beforeExpand: beforeExpand
                    //onRightClick : OnRightClick,//右键事件
                    onDblClick: zTreeOnClick //双击事件
                }
            };

            //这个是异步
            function filter(treeId, parentNode, childNodes) {
                var treeNode = parentNode;
                if (treeNode && treeNode.children) {
                    return;
                }
                if (treeNode) {
                    var postdata = treeNode
                } else {
                    var postdata = {};
                }
                postdata.flag = 1;
                postdata.emailtype = 3;
                postdata.orgid = parseInt(postdata.id);
                var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
                var children = obj.data.scporgs;
                if (children) {
                    treeNode.children = [];
                    for (var i = 0; i < children.length; i++) {
                        if (parseInt(children[i].sysuserid) > 0) {
                            children[i].name = children[i].username;
                        } else {
                            children[i].isParent = true;
                        }

                    }
                }
                return children;

            }

            //双击选择添加用户和机构
            function zTreeOnClick(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                var node = zTree.getSelectedNodes()[0];

                if (node == undefined) {
                    BasemanService.notice("请选择参与人或参与机构", "alert-info");
                    return;
                }

                if (node.isParent == true) {
                    var object = {};
                    object.orgname = node.name;
                    object.orgid = parseInt(node.id);
                    for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
                        if (object.orgid == $scope.data.currItem.cs_people[i].orgid) {
                            BasemanService.notice("选择机构重复", "alert-info");
                            return;
                        }
                    }
                    $scope.data.currItem.cs_people.push(object);
                } else {
                    var object = {};
                    object.username = node.name;
                    object.userid = (node.userid);
                    for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                        if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                            BasemanService.notice("选择人员重复", "alert-info");
                            return;
                        }
                    }
                    $scope.data.currItem.sj_people.push(object);
                }
            };
        }
    }
    //console.log(proc)
    if (data == undefined || data.length <= 0) {
        data = [];
    }
    $scope.procusers = data;
    $scope.ok = function () {
        if ($scope.proc) {
            if ($scope.proc.proctype == 5) {

                $scope.wfpublishofwfprocs = [];
                //这是人员
                for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                    var object = {};
                    object.isselect = 2;
                    object.issigned = 0;
                    object.publishtype = 13;
                    object.procid = procid;
                    object.publishto = $scope.data.currItem.sj_people[i].userid;
                    object.toname = $scope.data.currItem.sj_people[i].username;
                    object.wfid = wfid;
                    console.log($scope.data.currItem.sj_people[i]);
                    $scope.wfpublishofwfprocs.push(object);
                }
                for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
                    var object = {};
                    object.isselect = 2;
                    object.issigned = 0;
                    object.publishtype = 12;
                    object.procid = procid;
                    object.publishto = $scope.data.currItem.cs_people[i].orgid;
                    object.toname = $scope.data.currItem.cs_people[i].orgname;
                    object.wfid = wfid;
                    console.log($scope.data.currItem.cs_people[i])
                    $scope.wfpublishofwfprocs.push(object);
                }
                $scope.item.wfpublishofwfprocs = $scope.wfpublishofwfprocs;
                if ($scope.item.wfpublishofwfprocs.length < 1) {
                    BasemanService.notice("必须选择用户或机构！！", "alert-warning");
                    return;
                }
            }
        }
        if ($scope.proc) {
            if ($scope.proc.proctype == 4 && (!$scope.item.archivetoid || $scope.item.archivetoid == '')) {

                BasemanService.notice("必须选择归档路径！！", "alert-warning");
                return;
            }
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item.procid = $scope.procusers[index].procid;
    };

    $timeout(function () {
        initData()
    }, 100)
}

/**
 * 作废
 */
function PopWFDropInController($scope, $modalInstance, BasemanService) {
    $scope.title = "作废原因";
    $scope.item = {
        opinion: ''
    };
    $scope.ok = function () {
        if (!$.trim($scope.item.opinion)) {
            BasemanService.notice("请填写作废原因", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 反审核
 */
function PopWFFackerBackController($scope, $modalInstance, BasemanService) {
    $scope.title = "反审核原因";
    $scope.item = {
        opinion: ''
    };
    $scope.ok = function () {
        if (!$.trim($scope.item.opinion)) {
            BasemanService.notice("请填写反审核原因", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 历史订单
 */
function PopHistoryOrderController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        if ($scope.replacetype) {
            $scope.$parent.replacetype = $scope.replacetype;
        } else {
            BasemanService.notice("未选择导入方式！", "alert-warning");
            return;
        }

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere(["pi_no", "prod_no", "item_code", "fd_batch_no", "std_spec", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 3
        };
        if ($scope.$parent.data.currItem && $scope.$parent.data.currItem.cust_id) {
            postdata.cust_id = $scope.$parent.data.currItem.cust_id;
        }
        if ($scope.FrmInfo.stat == 5) {
            postdata.stat = 5;
        }
        var promise = BasemanService.RequestPost("sale_pi_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_pi_headers;
        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }

}

//查询pi主表信息
function PopPiItemController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        $("#selectall")[0].checked = false;
        var sqlWhere = BasemanService.getSqlWhere(["pi_no"], $scope.searchtext);

        var postdata = {
            sqlwhere: sqlWhere,
            flag: 0,
            cust_id: $scope.data.currItem.cust_id,
            currency_id: $scope.data.currItem.currency_id,
            payment_type_id: $scope.data.currItem.payment_type_id
        };

        if ($scope.data.stat == 5) {
            postdata.stat = 5;
        }
        var promise = BasemanService.RequestPost("sale_pi_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_pi_headers;
        });
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }

        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

function PopPiItemLineController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        $("#selectall")[0].checked = false;
        var sqlWhere = BasemanService.getSqlWhere(["piheader.pi_no"], $scope.searchtext);
        var currency_id, payment_type_id, cust_id, order_type_id;

        currency_id = $scope.data.currItem.currency_id;
        cust_id = $scope.data.currItem.cust_id;
        payment_type_id = $scope.data.currItem.payment_type_id;
        order_type_id = $scope.data.currItem.order_type_id;

        var postdata = {
            sqlwhere: sqlWhere,
            flag: 2,
            item_id: 0,
            currency_id: currency_id,
            payment_type_id: payment_type_id,
            cust_id: cust_id,
            order_type_id: order_type_id
        };
        var promise = BasemanService.RequestPost("sale_pi_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_pi_headers;
        });
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

/**
 * PI单据拆分
 */
function PopSaleProdSpliceLineController($scope, $modalInstance, BasemanService) {

    $scope.item = $scope.$parent.select_item;
    $scope.ok = function () {
        if (!$scope.item.splice_num || Number($scope.item.splice_num) >= Number($scope.item.prod_qty) || Number($scope.item.splice_num) <= 0) {
            alert("拆分数量不正确!");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

/**
 * 通知单拆分
 */
function PopWarnSpliceNoticeController($scope, $modalInstance, BasemanService) {
    $scope.notice = $scope.$parent.notice;
    $scope.ok = function () {
        if (!$scope.notice.splice_num || Number($scope.notice.splice_num) >= Number($scope.notice.qty) || Number($scope.notice.splice_num) <= 0) {
            alert("拆分数量不正确!");
            return;
        }
        $modalInstance.close($scope.notice);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 查看历史库存
 */
function PopHistoryRepController($scope, $modalInstance, BasemanService) {
    $scope.repList = [];
    $scope.item = null;
    $scope.onLineActiveCellChanged = function (e, args) {
        var item = args.grid.getDataItem(args.row);
        if (item != undefined) {
            $scope.item = item;
        }
    }

    $scope.repOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //console.log($scope);
    $scope.searchhint = "正在查询...";
    BasemanService.RequestPost("drp_inventory", "search", $scope.p_item)
        .then(function (data) {
            var grid = repOptions.grid;
            grid.setDataResize(data.drp_inventorys);
            $scope.searchhint = "查询已完成";
        });
    $scope.repColumns = [{
        id: "item_code",
        name: "产品编码",
        field: "item_code",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "item_name",
        name: "型号",
        field: "item_name",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "warehouse_code",
        name: "仓库",
        field: "warehouse_code",
        width: 80,
        editor: Slick.Editors.Text
    }
        /*,{
		     id: "warehouse_name",
		     name: "仓库名称",
		     field: "warehouse_name",
		     width: 100,
		     editor: Slick.Editors.Text
		     },{
		     id: "inv_qty",
		     name: "实物库存",
		     field: "inv_qty",
		     width: 80,
		     editor: Slick.Editors.Text
		     },{
		     id: "keeped_qty",
		     name: "预占库存",
		     field: "keeped_qty",
		     width: 80,
		     editor: Slick.Editors.Text
		     }*/
        , {
            id: "canused_qty",
            name: "可用库存",
            field: "canused_qty",
            width: 80,
            editor: Slick.Editors.Text
        }, {
            id: "gsale_order_no",
            name: "定制订单号",
            field: "gsale_order_no",
            width: 120,
            editor: Slick.Editors.Text
        }, {
            id: "seq",
            name: "行号",
            field: "seq",
            width: 80,
            editor: Slick.Editors.Text
        }
    ];

}

/**
 * 配件入库中的查看库存
 */
function PopHistoryInventoryController($scope, $modalInstance, BasemanService) {
    $scope.repList = [];
    $scope.item = null;
    $scope.onLineActiveCellChanged = function (e, args) {
        var item = args.grid.getDataItem(args.row);
        if (item != undefined) {
            $scope.item = item;
        }
    }

    $scope.repOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    console.log($scope);
    $scope.searchhint = "正在查询...";
    BasemanService.RequestPost("css_inventory", "search", $scope.p_item)
        .then(function (data) {
            var grid = repOptions.grid;
            console.log(data);
            console.log($scope);
            for (var i = 0; i < data.css_inventorys.length; i++) {
                for (var j = 0; j < $scope.$parent.data.currItem.css_itemoutmove_lineofcss_itemoutmove_headers.length; j++) {
                    if (data.css_inventorys[i].css_item_id == $scope.$parent.data.currItem.css_itemoutmove_lineofcss_itemoutmove_headers[j].css_item_id) {
                        $scope.$parent.data.currItem.css_itemoutmove_lineofcss_itemoutmove_headers[j].canused_qty = data.css_inventorys[i].canused_qty;
                    }
                }
            }
            grid.setDataResize(data.css_inventorys);

            console.log($scope);
            $scope.searchhint = "查询已完成";
        });
    $scope.repColumns = [{
        id: "warehouse_name",
        name: "仓库名称",
        field: "warehouse_name",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "css_item_code",
        name: "配件编码",
        field: "css_item_code",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "css_item_name",
        name: "配件名称",
        field: "css_item_name",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "inv_qty",
        name: "实物库存",
        field: "inv_qty",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "keeped_qty",
        name: "保留库存",
        field: "keeped_qty",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "canused_qty",
        name: "可用库存",
        field: "canused_qty",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "in_keeped_qty",
        name: "在途库存",
        field: "in_keeped_qty",
        width: 80,
        editor: Slick.Editors.Text
    }];

}

/**
 * 业务受理中的查询
 */
function PopHistoryBusinessController($scope, $modalInstance, BasemanService) {
    //console.log($scope);

    $scope.repList = [];
    $scope.item = {};
    if ($scope.$parent.data.currItem.mobile) {
        $scope.item.mobile = $scope.$parent.data.currItem.mobile;
    }
    if ($scope.$parent.data.currItem.enduser_name) {
        $scope.item.enduser_name = $scope.$parent.data.currItem.enduser_name;
    }
    if ($scope.$parent.data.currItem.enduser_address) {
        $scope.item.enduser_address = $scope.$parent.data.currItem.enduser_address;
    }
    $scope.onLineActiveCellChanged = function (e, args) {
        var item = args.grid.getDataItem(args.row);
        if (item != undefined) {

            $scope.$parent.data.currItem.enduser_id = item.enduser_id;
            $scope.$parent.data.currItem.enduser_name = item.enduser_name;
            $scope.$parent.data.currItem.enduser_line_id = item.enduser_line_id;
            $scope.$parent.data.currItem.ld_enduser_name = item.contact_man;
            $scope.$parent.data.currItem.is_vip = Number(item.is_vip); //是否VIP
        }
    }

    $scope.repOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {
        $modalInstance.close($scope.$parent.data.currItem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //console.log($scope);

    $scope.search1 = function () {
        //console.log($scope);
        var postdata = {
            flag: 2,
            mobile: $scope.item.mobile,
            enduser_name: $scope.item.enduser_name,
            enduser_address: $scope.item.enduser_address
        }
        $scope.searchhint = "正在查询...";
        BasemanService.RequestPost("css_enduser", "search", postdata)
            .then(function (data) {
                var grid = repOptions.grid;
                //console.log(data);
                grid.setDataResize(data.css_endusers);
                $scope.searchhint = "查询已完成";
            });
    }

    $scope.repColumns = [{
        id: "enduser_name",
        name: "系统用户",
        field: "enduser_name",
        width: 80
    }, {
        id: "contact_man",
        name: "联系人",
        field: "contact_man",
        width: 80
    }, {
        id: "mobile",
        name: "电话一",
        field: "mobile",
        width: 100
    }, {
        id: "tel",
        name: "电话二",
        field: "tel",
        width: 100
    }, {
        id: "enduser_address",
        name: "地址",
        field: "enduser_address",
        width: 150
    }, {
        id: "org_name",
        name: "管理中心",
        field: "org_name",
        width: 120
    }, {
        id: "fix_org_name",
        name: "服务网点",
        field: "fix_org_name",
        width: 80
    }, {
        id: "enduser_code",
        name: "用户编码",
        field: "enduser_code",
        width: 120
    }];

}

/**
 * 结算单创建中的新增
 */
function PopHistoryWizardController($scope, $modalInstance, BasemanService) {
    console.log($scope);

    $scope.repList = [];
    $scope.item = {
        settle_year: $scope.data.currItem.settle_year,
        settle_month: $scope.data.currItem.settle_month,
    };

    //管理中心查询
    $scope.selectOrg1 = function (flag) {
        var FrmInfo = {
            title: "部门查询",
            initsql: "",
            thead: [{
                name: "部门编码",
                code: "org_code"
            }, {
                name: "部门名称",
                code: "org_name"
            }],
            classid: "base_search",
            action: "searchorg",
            postdata: {},
            searchlist: ["code", "orgname", "orgid"],
            backdatas: "orgs"

        };
        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.org_id = result.org_id;
            $scope.item.org_code = result.org_code;
            $scope.item.org_name = result.org_name;
        });
    };

    //网点查询
    $scope.selectToFix1 = function (flag) {
        var FrmInfo = {
            title: "网点查询",
            initsql: "",
            thead: [{
                name: "网点编码",
                code: "fix_org_code"
            }, {
                name: "网点名称",
                code: "fix_org_name"
            }],
            classid: "css_fix_org",
            action: "search",
            postdata: {},
            searchlist: ["fix_org_code", "fix_org_name", "fix_org_id"],
            backdatas: "css_fix_orgs"

        };
        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.fix_org_id = result.fix_org_id;
            $scope.item.fix_org_code = result.fix_org_code;
            $scope.item.fix_org_name = result.fix_org_name;
        });
    };

    $scope.months = [{
        id: 1,
        name: "1月"
    }, {
        id: 2,
        name: "2月"
    }, {
        id: 3,
        name: "3月"
    }, {
        id: 4,
        name: "4月"
    }, {
        id: 5,
        name: "5月"
    }, {
        id: 6,
        name: "6月"
    }, {
        id: 7,
        name: "7月"
    }, {
        id: 8,
        name: "8月"
    }, {
        id: 9,
        name: "9月"
    }, {
        id: 10,
        name: "10月"
    }, {
        id: 11,
        name: "11月"
    }, {
        id: 12,
        name: "12月"
    }];

    $scope.Modification_time = function () {
        var _this = $(this);
        var val = _this.val();
        var grid = $scope.repOptions.grid;
        var data = grid.getData();
        var index = Number(_this.attr('index'));
        var cell = Number(_this.attr('cell'));
        var field = _this.attr('field');
        $scope.itemtemp = data[index];
        console.log($scope.itemtemp);
        if ($scope.itemtemp.stat_date > val) {
            $scope.itemtemp[field] = $scope.itemtemp.stat_date + 1;
            //grid.updateRow(index);
            BasemanService.notice("结算结束日期必须大于结算开始日期", "alert-warning");
            return;
        }

        //$scope.itemtemp[field] = val;

        grid.updateNotInCell(index, cell);
    };

    //全部修改
    $scope.modification = function (e) {
        if ($scope.item.stat_date > $scope.item.end_date) {
            BasemanService.notice("开始日期不能大于结束日期！", "alert-warning");
            return;
        }
        var grid = $scope.repOptions.grid;
        var data = grid.getData();
        for (var i = 0; i < data.length; i++) {
            data[i].stat_date = $scope.item.stat_date;
            data[i].end_date = $scope.item.end_date;
            grid.updateRow(i);
        }
    }

    /*$scope.onLineActiveCellChanged = function (e, args){
	 var item = args.grid.getDataItem(args.row);
	 if (item != undefined) {

	 }
	 }*/

    $scope.repOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {
        $modalInstance.close($scope.$parent.data.currItem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //console.log($scope);

    $scope.Determine = function () {
        $scope.repList = [];
        console.log($scope);
        var sqlwhere = "1=1";
        if ($scope.item.fix_org_id > 0) {
            sqlwhere = sqlwhere + " and fix_org_id = " + Number($scope.item.fix_org_id);
        }
        if ($scope.item.org_id > 0) {
            sqlwhere = sqlwhere + " and org_id = " + Number($scope.item.org_id);
        }

        console.log(sqlwhere);
        var postdata = {
            sqlwhere: sqlwhere,
        }
        $scope.searchhint = "正在查询...";
        BasemanService.RequestPost("css_fix_org", "search", postdata)
            .then(function (data) {
                var grid = repOptions.grid;
                console.log(data);
                grid.setDataResize(data.css_fix_orgs);
                $scope.searchhint = "查询已完成";
            });
    }

    $scope.repColumns = [{
        id: "usable",
        name: "序号",
        field: "usable",
        width: 60,
        cssClass: "centerAligned",
        formatter: Slick.Formatters.Checkmark,
        editor: Slick.Editors.Checkbox
    }, {
        id: "org_name",
        name: "管理中心名称",
        field: "org_name",
        width: 120
    }, {
        id: "fix_org_code",
        name: "网点编码",
        field: "fix_org_code",
        width: 100
    }, {
        id: "fix_org_name",
        name: "网点名称",
        field: "fix_org_name",
        width: 100
    }, {
        id: "fix_org_type",
        name: "网点类型",
        field: "fix_org_type",
        width: 100,
        formatter: Slick.Formatters.SelectOption, //格式化显示，使得页面上显示男或者女，而不是显示1或者2
        //editor: Slick.Editors.SelectOption, //子表中的下拉框控件，与下面的options相对应，
        options: [{
            desc: "售前网点",
            value: 1
        }, {
            desc: "售后网点",
            value: 2
        }, {
            desc: "三位一体",
            value: 3
        }]
    }, {
        id: "fix_org_class",
        name: "网点级别",
        field: "fix_org_class",
        width: 100,
        formatter: Slick.Formatters.SelectOption, //格式化显示，使得页面上显示男或者女，而不是显示1或者2
        //editor: Slick.Editors.SelectOption, //子表中的下拉框控件，与下面的options相对应，
        options: [{
            desc: "一级网点",
            value: 1
        }, {
            desc: "二级网点",
            value: 2
        }, {
            desc: "直销网点",
            value: 3
        }]
    }, {
        id: "stat_date",
        name: "结算开始日期",
        field: "stat_date",
        width: 100,
        editor: Slick.Editors.Date,
        formatter: Slick.Formatters.Date, //格式化时间，消除时间后面的00:00:00样式
        cssClass: "centerAligned"
    }, {
        id: "end_date",
        name: "结算结束日期",
        field: "end_date",
        width: 100,
        editor: Slick.Editors.Date,
        formatter: Slick.Formatters.Date, //格式化时间，消除时间后面的00:00:00样式
        cssClass: "centerAligned",
        action: $scope.Modification_time
    }];

}

/**
 * 查看对账明细
 */
function PopHistoryCheckController($scope, $modalInstance, BasemanService) {
    $scope.repList = [];
    $scope.item = null;
    $scope.onLineActiveCellChanged = function (e, args) {
        var item = args.grid.getDataItem(args.row);
        if (item != undefined) {
            $scope.item = item;
        }
    }

    $scope.repOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //console.log($scope);
    $scope.searchhint = "正在查询...";
    BasemanService.RequestPost("drp_cust_checking_header", "select", $scope.p_item)
        .then(function (data) {
            var grid = repOptions.grid;
            grid.setDataResize(data.drp_cust_checking_lineofdrp_cust_checking_headers);
            $scope.searchhint = "查询已完成";
        });
    $scope.repColumns = [{
        id: "confirm_date",
        name: "日期",
        field: "confirm_date",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "buss_note",
        name: "业务说明",
        field: "buss_note",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "lqc_amount",
        name: "期初余额",
        field: "lqc_amount",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "lys_amount",
        name: "应收货款",
        field: "lys_amount",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "ldk_amount",
        name: "实际收款",
        field: "ldk_amount",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "lqm_amount",
        name: "期末余额",
        field: "lqm_amount",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "note",
        name: "备注",
        field: "note",
        width: 80,
        editor: Slick.Editors.Text
    }];

}

/**
 * 会计区间
 *Fin_Bud_Period_Headers PopFinBudPerdHController
 */
function PopFinBudPerdHController($scope, $modalInstance, BasemanService) {
    PopFinBudPerdHController = HczyCommon.extend(PopFinBudPerdHController, BasePopController);
    PopFinBudPerdHController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        //会计区间信息
        var sqlWhere = BasemanService.getSqlWhere(["period_type"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 4
        };
        var promise = BasemanService.RequestPost("fin_bud_period_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.fin_bud_period_headers;
        });
    }
}

/**
 * 生产单明细
 */
function PopSaleProdLineController($scope, $modalInstance, BasemanService) {
    $scope.ok = function () {
        $scope.$parent.isLineEdit = false;
        $modalInstance.close($scope.proitem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    if ($scope.$parent.isLineEdit) {
        $scope.proitem = $scope.$parent.EditObj;
        $scope.$parent.EditObj = null;
    } else {
        $scope.proitem = {};
    }

    $scope.cal_bzcc = function (event) {
        if ($scope.proitem.discount && $scope.proitem.apply_price) {
            var reg = new RegExp("^[0-9].[0-9]*$");
            if (reg.test($scope.proitem.discount) && reg.test($scope.proitem.apply_price)) {

                var executive_price = $scope.proitem.apply_price * (100 - $scope.proitem.discount) / 100;

                $scope.proitem.executive_price = HczyCommon.toDecimal2(executive_price);
            }
        }
    }
}

/**
 * 形式发票查询
 */
function PopPIController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["pi_no", "short_name", "pi_date", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.stat == 5) {
            postdata.stat = 5;
        }
        var promise = BasemanService.RequestPost("sale_pi_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_pi_headers;
        });
    }

}

/**
 * 形式发票变更查询
 */
function PopPIChgController($scope, $modalInstance, BasemanService) {
    PopPIChgController = HczyCommon.extend(PopPIChgController, BasePopController);
    PopPIChgController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["chg_no", "pi_no", "short_name", "pi_date", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("sale_pi_chg_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_pi_chg_headers;
        });
    }

}

/**
 * 生产单查询
 */
function PopProdController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["prod_no", "short_name", "create_time", "batch_nos", "cust_item_names"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.stat == 5) {
            postdata.stat = 5;
        }
        var promise = BasemanService.RequestPost("sale_prod_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_prod_headers;
        });
    }

}

//生产通知单变更查询

function PopProdChgController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["chg_no", "short_name", "create_time", "batch_nos", "cust_item_names"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("sale_prod_chg_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_prod_chg_headers;
        });
    }

}

//信用证录入查询
function PopFinLcBillController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["lc_bill_no", "lc_bill_date", "lc_no", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.flag == 2) {
            postdata = {
                flag: 2,
                cust_id: $scope.data.currItem.cust_id
            }
        }
        if ($scope.FrmInfo.stat == 5) {
            postdata.stat = 5;
        }
        var promise = BasemanService.RequestPost("fin_lc_bill", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.fin_lc_bills;
        });
    }
}

//到款录入查询
function PopFundsController($scope, $modalInstance, BasemanService) {
    PopCustController = HczyCommon.extend(PopCustController, BasePopController);
    PopCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["funds_no", "cust_name", "funds_date", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        postdata.flag = $scope.FrmInfo.flag;
        postdata.funds_type = $scope.FrmInfo.funds_type;
        var promise = BasemanService.RequestPost("fin_funds_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.fin_funds_headers;
        });
    }

}

//出货预告查询
function PopSaleWarnController($scope, $modalInstance, BasemanService) {
    PopSaleWarnController = HczyCommon.extend(PopSaleWarnController, BasePopController);
    PopSaleWarnController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["warn_no", "short_name", "seaport_in_name", "ship_date"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        var promise = BasemanService.RequestPost("sale_warn_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_warn_headers;
        });
    }
}

//商业发票查询
function PopBillInvoiceController($scope, $modalInstance, BasemanService) {
    PopBillInvoiceController = HczyCommon.extend(PopBillInvoiceController, BasePopController);
    PopBillInvoiceController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["invoice_no", "cust_name", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };

        postdata.flag = $scope.FrmInfo.flag;
        postdata.cust_id = $scope.FrmInfo.cust_id;

        var promise = BasemanService.RequestPost("bill_invoice_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.bill_invoice_headers;
        });
    }

}

//发货通知单查询
function PopShipNoticeController($scope, $modalInstance, BasemanService) {
    PopShipNoticeController = HczyCommon.extend(PopShipNoticeController, BasePopController);
    PopShipNoticeController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["invoice_no", "cust_name", "pi_date", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };

        postdata.flag = $scope.FrmInfo.flag;

        var promise = BasemanService.RequestPost("sale_shipnotice_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_shipnotice_headers;
        });
    }

}

/**
 * 落货纸明细 导入排产明细
 */
function PopWarnProdLineController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        $("#selectall")[0].checked = false;
        var sqlWhere = BasemanService.getSqlWhere(["prod_no"], $scope.searchtext);
        var cust_id, currency_id, price_type_id, ship_type, payment_type_id;

        cust_id = $scope.sale_warn_header.cust_id;
        currency_id = $scope.sale_warn_header.currency_id;
        price_type_id = $scope.sale_warn_header.price_type_id;
        ship_type = $scope.sale_warn_header.ship_type;
        payment_type_id = $scope.sale_warn_header.payment_type_id;

        var postdata = {
            sqlwhere: sqlWhere,
            flag: 6,
            //			item_id:0,
            cust_id: cust_id,
            currency_id: currency_id,
            price_type_id: price_type_id,
            ship_type: ship_type,
            payment_type_id: payment_type_id
        };
        var promise = BasemanService.RequestPost("sale_so_summary", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_so_summarys;
        });
    };
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

/**
 * 落货纸明细 产品明细拆分
 */
function PopWarnSplitLineController($scope, $modalInstance, BasemanService) {
    $scope.item.split_num = 0;
    $scope.ok = function () {
        if (!$scope.item.split_num || Number($scope.item.split_num) >= Number($scope.item.qty) || Number($scope.item.split_num) <= 0) {
            alert("拆分数量不正确!");
            return;
        }
        if (!$scope.item.box_type) {
            alert("请选择柜型!");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopAddressLineController($scope, $modalInstance, BasemanService) {
    //	$.$scope.data.currItem = {};
    $scope.items;
    $scope.tempArr = new Array();
    if ($scope.FrmInfo.flag == 2) {
        var cust_id;
        cust_id = $scope.data.currItem.cust_id;

        var postdata = {
            flag: 1,
            cust_id: cust_id,
        };
        BasemanService.RequestPost("drp_cust", "search", postdata)
            .then(function (data) {

                $scope.items = data.drp_custs;
            });
    } else if ($scope.FrmInfo.flag == 3) {
        $scope.item.address_seq = 0;
    }

    $scope.use = function () {
        var postdata = {
            cust_id: parseInt($scope.item.cust_id),
            areaid: parseInt($scope.item.areaid),
            areacode: $scope.item.areacode,
            areaname: $scope.item.areaname,
            take_man: $scope.item.take_man,
            address_seq: parseInt($scope.item.address_seq),
            phone_code: $scope.item.phone_code,
            areaname_adds: $scope.item.areaname_adds,
            addresss: $scope.item.addresss,
            address: $scope.item.areaname_adds + $scope.item.addresss
        };
        BasemanService.RequestPost("drp_cust", "custaddress", postdata)
            .then(function (data) {

            });
    };

    $scope.ok = function () {
        if (!$scope.item.areaid) {
            BasemanService.notice("未选择城市", "alert-warning");
            return;
        }
        var postdata = {
            cust_id: parseInt($scope.item.cust_id),
            areaid: parseInt($scope.item.areaid),
            areacode: $scope.item.areacode,
            areaname: $scope.item.areaname,
            take_man: $scope.item.take_man,
            address_seq: parseInt($scope.item.address_seq),
            phone_code: $scope.item.phone_code,
            areaname_adds: $scope.item.areaname_adds,
            addresss: $scope.item.addresss,
            address: $scope.item.areaname_adds + $scope.item.addresss
        };
        BasemanService.RequestPost("drp_cust", "custaddress", postdata)
            .then(function (data) {
                //$scope.items = data.drp_custs;
            });
        $scope.data.currItem.areaid = parseInt($scope.item.areaid),
            $scope.data.currItem.areacode = $scope.item.areacode,
            $scope.data.currItem.areaname = $scope.item.areaname,
            $scope.data.currItem.take_man = $scope.item.take_man,
            $scope.data.currItem.address_seq = parseInt($scope.item.address_seq),
            $scope.data.currItem.phone_code = $scope.item.phone_code,
            $scope.data.currItem.areaname_adds = $scope.item.areaname_adds,
            $scope.data.currItem.addresss = $scope.item.addresss,
            $scope.data.currItem.address = $scope.item.areaname_adds + $scope.item.addresss;
        //$scope.data.currItem.address=$scope.item.saleorder_address;
        $modalInstance.close($scope.data.currItem);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    };

    ////修改收货城市
    $scope.selectCity = function () {
        var FrmInfo = {};
        FrmInfo.title = "收货城市查询";
        FrmInfo.initsql = "areatype>=4";
        FrmInfo.thead = [{
            name: "收货城市名字",
            code: "areaname"
        }, {
            name: "收货城市编码",
            code: "areacode"
        }];
        BasemanService.openCommonFrm(PopDrpAreaCityController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.item.areaid = result.areaid;
            $scope.item.areaname = result.areaname;
            $scope.item.areacode = result.areacode;
            $scope.item.areaname_adds = result.note;
        });
    };

    // 单击明细行
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
        $scope.item.addresss = $scope.items[index].address;

    };

}

function PopAddressLine1Controller($scope, $modalInstance, BasemanService) {
    $scope.items;
    $scope.tempArr = new Array();
    $scope.item = $scope.$parent.p_item;
    $scope.item.addresss = $scope.item.address
    if ($scope.FrmInfo.flag == 2) {
        var cust_id = $scope.data.currItem.cust_id;

        var postdata = {
            flag: 1,
            cust_id: cust_id,
        };
        BasemanService.RequestPost("drp_cust", "search", postdata)
            .then(function (data) {
                $scope.items = data.drp_custs;
            });
    } else if ($scope.FrmInfo.flag == 3) {
        if ($scope.FrmInfo.clear) $scope.item.address_seq = 0;
    }

    $scope.use = function () {
        var postdata = {
            cust_id: parseInt($scope.item.cust_id),
            areaid: parseInt($scope.item.areaid),
            areacode: $scope.item.areacode,
            areaname: $scope.item.areaname,
            take_man: $scope.item.take_man,
            address_seq: parseInt($scope.item.address_seq),
            phone_code: $scope.item.phone_code,
            areaname_adds: $scope.item.areaname_adds,
            addresss: $scope.item.addresss,
            address: $scope.item.areaname_adds + $scope.item.addresss
        };
        BasemanService.RequestPost("drp_cust", "custaddress", postdata)
            .then(function (data) {

            });
    };

    $scope.ok = function () {
        var postdata = {
            cust_id: parseInt($scope.item.cust_id),
            areaid: parseInt($scope.item.areaid),
            areacode: $scope.item.areacode,
            areaname: $scope.item.areaname,
            take_man: $scope.item.take_man,
            address_seq: parseInt($scope.item.address_seq),
            phone_code: $scope.item.phone_code,
            areaname_adds: $scope.item.areaname_adds,
            addresss: $scope.item.addresss,
            address: $scope.item.areaname_adds + $scope.item.addresss
        };
        BasemanService.RequestPost("drp_cust", "custaddress", postdata)
            .then(function (data) {
                $modalInstance.close($scope.item);
            });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    };

    ////修改收货城市
    $scope.selectCity = function () {
        var FrmInfo = {};
        FrmInfo.title = "收货城市查询";
        FrmInfo.initsql = "areatype>=4";
        FrmInfo.thead = [{
            name: "收货城市名字",
            code: "areaname"
        }, {
            name: "收货城市编码",
            code: "areacode"
        }];
        BasemanService.openCommonFrm(PopDrpAreaCityController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.item.areaid = result.areaid;
            $scope.item.areaname = result.areaname;
            $scope.item.areacode = result.areacode;
            $scope.item.areaname_adds = result.note;
        });
    };

}

function PopCombineAddressLineController($scope, $modalInstance, BasemanService) {
    //	$.$scope.data.currItem = {};
    $scope.item = {};
    $scope.items = [];
    $scope.tempArr = [];
    $scope.FrmInfo = {};
    $scope.FrmInfo.title = "合并地址";
    $scope.FrmInfo.thead = [{
        name: "收货城市",
        code: "areaname"
    }, {
        name: "地址",
        code: "addresss"
    }, {
        name: "收货人",
        code: "take_man"
    }, {
        name: "电话号码",
        code: "phone_code"
    }];

    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    // 单击明细行
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };
    ////修改收货城市
    $scope.selectCity = function () {
        var FrmInfo = {};
        FrmInfo.title = "收货城市查询";
        FrmInfo.initsql = "areatype>=4";
        FrmInfo.thead = [{
            name: "收货城市名字",
            code: "areaname"
        }, {
            name: "收货城市编码",
            code: "areacode"
        }];
        BasemanService.openCommonFrm(PopDrpAreaCityController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.item.areaid = result.areaid;
            $scope.item.areaname = result.areaname;
            $scope.item.areacode = result.areacode;
            $scope.item.areaname_adds = result.note;
        });
    };
    var postdata = {
        drp_trans_loads: $scope.$parent.p_items,
    }
    BasemanService.RequestPost("drp_trans_load", "hbaddres", postdata)
        .then(function (data) {
            $scope.items = data.drp_address;
        });

}

/**
 * 查看客户资金情况
 */

function PopCustFinDetailController($scope, $modalInstance, BasemanService) {
    $scope.citems = [];
    $scope.citem = {};
    $scope.citem.cust_id = $scope.item.p_cust_id;
    $scope.citem.cust_name = $scope.item.p_cust_name;
    //客户
    $scope.openCustFrm = function () {
        //客户弹窗
        var FrmInfo = {};
        FrmInfo.title = "客户查询";
        FrmInfo.thead = [{
            name: "客户编码",
            code: "cust_code"
        },
            {
                name: "客户名称",
                code: "cust_name"
            }
        ];
        BasemanService.openCommonFrm(PopCustController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.citem.cust_id = result.cust_id;
            $scope.citem.cust_code = result.cust_code;
            $scope.citem.cust_name = result.cust_name;
        });
    }
    //销售部门
    $scope.openSalesPartFrm = function () {
        //销售部门弹窗
        var FrmInfo = {};
        FrmInfo.title = "销售部门查询";
        FrmInfo.thead = [{
            name: "部门编码",
            code: "org_code"
        },
            {
                name: "部门名称",
                code: "org_name"
            }
        ];
        BasemanService.openCommonFrm(PopOrgController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.citem.org_id = result.org_id;
            $scope.citem.org_name = result.org_name;
        });
    }
    $scope.search = function () {
        if (!$.trim($scope.citem.org_name)) {
            $scope.citem.org_id = 0;
        }
        if (!$.trim($scope.citem.cust_name)) {
            $scope.citem.cust_id = 0;
        }
        $scope.citem.flag = 7;
        BasemanService.RequestPost("sale_shipnotice_header", "search", $scope.citem)
            .then(function (data) {

                var grid = $scope.custOptions.grid;
                grid.setData(data.sale_shipnotice_headers);
                grid.invalidateAllRows();
                grid.updateRowCount();
                grid.render();

            });
    }

    $scope.custOptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        onActiveCellChanged: $scope.onLineActiveCellChanged,
        autoEdit: true
    };

    $scope.custColumns = [{
        id: "cust_name",
        name: "客户",
        field: "cust_name",
        width: 120,
    }, {
        id: "cust_type",
        name: "类型",
        field: "cust_type",
        width: 120,
    }, {
        id: "currency_name",
        name: "币种",
        field: "currency_name",
        width: 80,
    }, {
        id: "credit_no",
        name: "信用证号",
        field: "credit_no",
        width: 120,
    }, {
        id: "totalamt",
        name: "额度",
        field: "totalamt",
        width: 80,
    }, {
        id: "useramt",
        name: "已使用",
        field: "useramt",
        width: 120,
    }, {
        id: "canamt",
        name: "可使用",
        field: "canamt",
        width: 120,
    }];

    $scope.ok = function () {
        $modalInstance.close({});
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    if ($scope.citem.cust_id) {
        $scope.search();
    }
}

/**
 * 物流供应商
 */
function PopSupplierController($scope, $modalInstance, BasemanService) {
    PopSupplierController = HczyCommon.extend(PopSupplierController, BasePopController);
    PopSupplierController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["supplier_code", "supplier_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };

        postdata.supplier_type = $scope.FrmInfo.supplier_type;

        var promise = BasemanService.RequestPost("supplier", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.suppliers;
        });
    }

}

/**
 * 报关单
 */
function PopSaleCustomsController($scope, $modalInstance, BasemanService) {
    PopSaleCustomsController = HczyCommon.extend(PopSaleCustomsController, BasePopController);
    PopSaleCustomsController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["customs_no", "short_name", "apply_date", "org_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };

        postdata.flag = $scope.FrmInfo.flag;

        var promise = BasemanService.RequestPost("sale_customs_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.sale_customs_headers;
        });
    }

}

//查询 商业发票
function PopFinLineController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        $("#selectall")[0].checked = false;
        var sqlWhere = BasemanService.getSqlWhere(["invoice_no"], $scope.searchtext);

        var postdata = {
            sqlwhere: sqlWhere,
            credit_no: $scope.$parent.data.currItem.lc_bill_no,
            cust_id: $scope.$parent.data.currItem.cust_id,
            funds_type: $scope.$parent.data.currItem.funds_type
        };
        var promise = BasemanService.RequestPost("bill_invoice_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.bill_invoice_headers;
        });
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }

        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

/**
 * 查看客户资金情况
 */

function PopCustFinDetailController1($scope, $modalInstance, BasemanService) {
    $scope.citems = [];
    $scope.citem = {};
    $scope.citem.notice_id = $scope.item.notice_id;

    $scope.search = function () {
        $scope.citem.flag = 7;
        BasemanService.RequestPost("sale_shipnotice_header", "search", $scope.citem)
            .then(function (data) {

                var grid = $scope.capitaloptions.grid;
                grid.setData(data.sale_shipnotice_headers);
                grid.invalidateAllRows();
                grid.updateRowCount();
                grid.render();

            });
    }

    //生产定金明细
    $scope.capitaloptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: false,
    };

    $scope.capitalcolumns = [{
        id: "itype",
        name: "类型",
        field: "itype",
        width: 80
    }, {
        id: "pi_no",
        name: "形式发票号",
        field: "pi_no",
        width: 120,
    }, {
        id: "need_amt",
        name: "本单所需金额",
        field: "need_amt",
        width: 120,
    }, {
        id: "pre_amt",
        name: "当前可用预收款",
        field: "pre_amt",
        width: 120,
    }, {
        id: "alloted",
        name: "已分配信用证",
        field: "alloted",
        width: 120,
    }, {
        id: "used_amt",
        name: "已使用",
        field: "used_amt",
        width: 80,
    }, {
        id: "canuse_amt",
        name: "可使用",
        field: "canuse_amt",
        width: 80,
    }, {
        id: "cy_amt",
        name: "差额",
        field: "cy_amt",
        width: 80,
    }];

    $scope.ok = function () {
        $modalInstance.close({});
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    if ($scope.citem.notice_id) {
        $scope.search();
    }
}

function PopDrpItemCodeController($scope, $modalInstance, BasemanService) {
    PopDrpItemCodeController = HczyCommon.extend(PopDrpItemCodeController, BasePopController);
    PopDrpItemCodeController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["item_code", "item_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_item", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_items;
        });
    }
}

/** 高级查询  **/
function PopDrpItemHighController($scope, $modalInstance, BasemanService) {
    PopDrpItemHighController = HczyCommon.extend(PopDrpItemHighController, BasePopController);
    PopDrpItemHighController.__super__.constructor.apply(this, arguments);
    $scope.mysql = "";
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["item_code", "item_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_item", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_items;
        });
    }
}

function PopDrpItemController($scope, $modalInstance, BasemanService) {
    PopDrpItemController = HczyCommon.extend(PopDrpItemController, BasePopController);
    PopDrpItemController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["item_code", "item_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_pricelist", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_pricelists;
        });
    }
}

function FinGReturnHeaderController($scope, $modalInstance, BasemanService) {
    FinGReturnHeaderController = HczyCommon.extend(FinGReturnHeaderController, BasePopController);
    FinGReturnHeaderController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["greturn_no", "cust_name", "return_amount"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("fin_greturn_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.fin_greturn_headers;
        });
    }
}

function PopDrpCustController($scope, $modalInstance, BasemanService) {
    PopDrpCustController = HczyCommon.extend(PopDrpCustController, BasePopController);
    PopDrpCustController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["cust_code", "cust_name"], $scope.searchtext);
        //        if($scope.$parent.data.currItem.orgid){
        //        	sqlWhere = sqlWhere ?"("+ sqlWhere + ") and orgid = " + $scope.$parent.data.currItem.orgid
        //        	: " orgid = " + $scope.$parent.data.currItem.orgid;
        //			//postdata.org_id=$scope.$parent.data.currItem.org_id;
        //		}
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        if (!$scope.FrmInfo.cust_types) {

            postdata.cust_types = $scope.FrmInfo.cust_types;
        }

        var promise = BasemanService.RequestPost("drp_cust", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_custs;
        });
    }
}

function PopDrpCustpriceApplyController($scope, $modalInstance, BasemanService) {
    PopDrpCustpriceApplyController = HczyCommon.extend(PopDrpCustpriceApplyController, BasePopController);
    PopDrpCustpriceApplyController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["price_apply_no", "org_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_gcust_priceapply_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_gcust_priceapply_headers;
        });
    }
}

function PopDrpItemTypeController($scope, $modalInstance, BasemanService) {
    PopDrpItemTypeController = HczyCommon.extend(PopDrpItemTypeController, BasePopController);
    PopDrpItemTypeController.__super__.constructor.apply(this, arguments);

    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["item_type_no", "item_type_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_item_type", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_item_types;
        });
    }

}

function PopDrpCustpriceStopController($scope, $modalInstance, BasemanService) {
    PopDrpCustpriceStopController = HczyCommon.extend(PopDrpCustpriceStopController, BasePopController);
    PopDrpCustpriceStopController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["price_apply_no", "org_name"], $scope.searchtext);

        var postdata = {
            flag: 99,
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_gcust_priceapply_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_gcust_priceapply_headers;
        });
    }
}

function PopDrpAreaCityController($scope, $modalInstance, BasemanService) {
    PopDrpAreaCityController = HczyCommon.extend(PopDrpAreaCityController, BasePopController);
    PopDrpAreaCityController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["areacode", "areaname"], $scope.searchtext);

        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("scparea", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.scpareas;
        });
    }
}

function PopDrpTransFeeNormController($scope, $modalInstance, BasemanService) {
    PopDrpTransFeeNormController = HczyCommon.extend(PopDrpTransFeeNormController, BasePopController);
    PopDrpTransFeeNormController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["areacode", "areaname"], $scope.searchtext);

        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_trans_fee_norm", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_trans_fee_norms;
        });
    }
}

//订单查询

function PopGcustSaleorderController($scope, $modalInstance, BasemanService) {
    PopGcustSaleorderController = HczyCommon.extend(PopGcustSaleorderController, BasePopController);
    PopGcustSaleorderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["gsale_order_no", "cust_name", "org_name"], $scope.searchtext);

        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }
        var promise = BasemanService.RequestPost("drp_gcust_saleorder_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_gcust_saleorder_headers;
        });
    }
}

//仓库查询
function PopWarehouseController($scope, $modalInstance, BasemanService) {
    PopWarehouseController = HczyCommon.extend(PopWarehouseController, BasePopController);
    PopWarehouseController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["warehouse_code", "warehouse_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("warehouse", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.warehouses;
        });
    }
}

//系统业务参数设置查询
function PopDrpParameterController($scope, $modalInstance, BasemanService) {
    PopDrpParameterController = HczyCommon.extend(PopDrpParameterController, BasePopController);
    PopDrpParameterController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["org_name", "org_id"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_parameter", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_parameters;
        });
    }
}

//出仓单查询
function DrpdrpoutbillheaderController($scope, $modalInstance, BasemanService) {
    DrpdrpoutbillheaderController = HczyCommon.extend(DrpdrpoutbillheaderController, BasePopController);
    DrpdrpoutbillheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["outbill_no", "outbill_id"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_outbill_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_outbill_headers;
        });
    }
}

//送货通知单查询

function DrpdrpdeliverheaderController($scope, $modalInstance, BasemanService) {
    DrpdrpdeliverheaderController = HczyCommon.extend(DrpdrpdeliverheaderController, BasePopController);
    DrpdrpdeliverheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["deliver_id", "deliver_no"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("Drp_Deliver_Header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_deliver_headers;
        });
    }
}

function DrpWareHouseWatchController($scope, $modalInstance, BasemanService) {
    DrpdrpdeliverheaderController = HczyCommon.extend(DrpdrpdeliverheaderController, BasePopController);
    DrpdrpdeliverheaderController.__super__.constructor.apply(this, arguments);

    var postdata = $scope.postdata;

    var promise = BasemanService.RequestPost("drp_trans_load", "getzcinv", postdata);
    promise.then(function (data) {
        $scope.items = data.drp_inventoryofdrp_trans_loads;
    });

}

//签收单查询

function DrpdrpdiffprocbillheaderController($scope, $modalInstance, BasemanService) {
    DrpdrpdiffprocbillheaderController = HczyCommon.extend(DrpdrpdiffprocbillheaderController, BasePopController);
    DrpdrpdiffprocbillheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["deliver_id", "deliver_no"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_diffprocbill_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_diffprocbill_headers;
        });
    }
}

//退货单查询

function DrpitembackheaderController($scope, $modalInstance, BasemanService) {
    DrpitembackheaderController = HczyCommon.extend(DrpitembackheaderController, BasePopController);
    DrpitembackheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["itemback_id", "itemback_no"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_itemback_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_itemback_headers;
        });
    }
}

//红冲单出仓查询
function DrpdrpoutbillredheaderController($scope, $modalInstance, BasemanService) {
    DrpdrpoutbillredheaderController = HczyCommon.extend(DrpdrpoutbillredheaderController, BasePopController);
    DrpdrpoutbillredheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["outbill_no", "outbill_id"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 1
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_outbill_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_outbill_headers;
        });
    }
}

//红冲单查询
function DrpdrpoutbillheaderhcController($scope, $modalInstance, BasemanService) {
    DrpdrpoutbillheaderhcController = HczyCommon.extend(DrpdrpoutbillheaderhcController, BasePopController);
    DrpdrpoutbillheaderhcController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["outbill_no", "outbill_id"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_outbill_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_outbill_headers;
        });
    }
}

//客户开票申请
function DrpdrpinvoiceapplyheaderController($scope, $modalInstance, BasemanService) {
    DrpdrpinvoiceapplyheaderController = HczyCommon.extend(DrpdrpinvoiceapplyheaderController, BasePopController);
    DrpdrpinvoiceapplyheaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["invoice_apply_no", "invoice_apply_id"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("Drp_Invoice_Apply_Header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_invoice_apply_headers;
        });
    }
}

//调拨单查询
function DrpItemmoveHeaderController($scope, $modalInstance, BasemanService) {
    DrpItemmoveHeaderController = HczyCommon.extend(DrpItemmoveHeaderController, BasePopController);
    DrpItemmoveHeaderController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["item_move_no", "take_man"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_itemmove_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_itemmove_headers;
        });
    }
}

/**
 * 客户开票申请细表增加
 */
function PopInvoiceApplyController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere(["outbill_no", "invoice_no"], $scope.searchtext);
        var cust_id = parseInt($scope.data.currItem.cust_id);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 4,
            cust_id: cust_id,
            outbill_nos: $scope.$parent.data.currItem.outbill_nos,
        };
        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}

        var promise = BasemanService.RequestPost("drp_outbill_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_outbill_headers;
        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }

}

//业务员资料查询
function DrpSalesmamController($scope, $modalInstance, BasemanService) {
    DrpSalesmamController = HczyCommon.extend(DrpSalesmamController, BasePopController);
    DrpSalesmamController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["salesman_no", "salesman_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_salesman", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_salesmans;
        });
    }
}

/**
 * 客户批量新增
 */
function PopCustAddController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere(["cust_name", "cust_name"], $scope.searchtext);
        //var cust_id=parseInt($scope.data.currItem.cust_id);

        var postdata = {
            sqlwhere: sqlWhere

        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}

        var promise = BasemanService.RequestPost("drp_cust", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_custs;
        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }

}

//发货通知单查询
function drp_dviceondeliv_headersearchController($scope, $modalInstance, BasemanService) {
    drp_dviceondeliv_headersearchController = HczyCommon.extend(drp_dviceondeliv_headersearchController, BasePopController);
    drp_dviceondeliv_headersearchController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["bus_index", "trans_org_name", "dviceondeliv_no"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("drp_dviceondeliv_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_dviceondeliv_headers;
        });
    }
}

//物料申请登记表
function ctrl_fin_dj_materiel_header_search($scope, $modalInstance, BasemanService) {
    ctrl_fin_dj_materiel_header_search = HczyCommon.extend(ctrl_fin_dj_materiel_header_search, BasePopController);
    ctrl_fin_dj_materiel_header_search.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["dj_no", "org_name"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("fin_dj_materiel_header", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.fin_dj_materiel_headers;
        });
    }
}

//单位查询
function DrpUomController($scope, $modalInstance, BasemanService) {
    DrpUomController = HczyCommon.extend(DrpUomController, BasePopController);
    DrpUomController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["uom_code", "uom_name", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("uom", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.uoms;
        });
    }
}

//货币属性查询
function DrpBaseCurrecyController($scope, $modalInstance, BasemanService) {
    DrpBaseCurrecyController = HczyCommon.extend(DrpBaseCurrecyController, BasePopController);
    DrpBaseCurrecyController.__super__.constructor.apply(this, arguments);
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere(["currency_code", "currency_name", "currency_symbol", "note"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere
        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost("base_currency", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.base_currencys;
        });
    }
}

function PopItemPriceController($scope, $modalInstance, BasemanService) {
    $scope.itemList = [];
    $scope.item = null;
    //	$scope.onLineActiveCellChanged = function (e, args){
    //		var item = args.grid.getDataItem(args.row);
    //        if (item != undefined) {
    //        	$scope.item = item;
    //        }
    //	}

    $scope.itemOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        //			onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var itemOptions = $scope.itemOptions;

    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ItemColumns = [{
        id: "item_name",
        name: "产品名称",
        field: "item_name",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "item_code",
        name: "产品编码",
        field: "item_code",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "spec",
        name: "型号",
        field: "spec",
        width: 100,
        editor: Slick.Editors.Text
    }, {
        id: "start_date",
        name: "开始日期",
        field: "start_date",
        width: 100,
        editor: Slick.Editors.Text
    }, {
        id: "end_date",
        name: "结束日期",
        field: "end_date",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "price_type",
        name: "产品类型",
        field: "price_type",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "settle_price",
        name: "结算价",
        field: "settle_price",
        width: 80,
        editor: Slick.Editors.Text
    }];
}

/**
 * 客户产品货号批量新增
 */
function PopCustNoAddController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere(["item_code", "item_name"], $scope.searchtext);
        //var cust_id=parseInt($scope.data.currItem.cust_id);

        var postdata = {
            sqlwhere: sqlWhere

        };
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}

        var promise = BasemanService.RequestPost("drp_item", "search", postdata);
        promise.then(function (data) {
            $scope.items = data.drp_items;
        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }

}

function drp_cust_checking_header_print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    drp_cust_checking_header_print = HczyCommon.extend(drp_cust_checking_header_print, BasePopController);
    drp_cust_checking_header_print.__super__.constructor.apply(this, arguments);

    $timeout(function () {
        $scope.drp_cust_checking_lineofdrp_cust_checking_headers = [];
        for (var i = 0; i < $scope.p_item.length; i++) {
            BasemanService.RequestPost("drp_cust_checking_header", "select", {
                chek_id: $scope.p_item[i].chek_id,
                importdataflag: i + 1
            })
                .then(function (result) {
                    $scope.item = result;
                    $scope.drp_cust_checking_lineofdrp_cust_checking_headers =
                        $scope.drp_cust_checking_lineofdrp_cust_checking_headers
                            .concat(result.drp_cust_checking_lineofdrp_cust_checking_headers);
                    if (result.importdataflag == $scope.p_item.length) {
                        $timeout(function () {
                            if ($scope.printobj.confirm == 1) {
                                $scope.prn1_print();
                            }
                            if ($scope.printobj.confirm == 2) {
                                $scope.prn1_preview();
                            }
                        }, 100);

                    }

                })
        }

    });

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("发货通知单打印");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.ADD_PRINT_TABLE(160, "5%", "90%", 200, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(30, "5%", "90%", 130, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        //$scope.data.currItem.out_warehouse_name=document.getElementById("warehouse_name").value;
        var content = document.getElementById("div3").innerHTML;

        LODOP.ADD_PRINT_HTM(400, "5%", "90%", 440, content.trim()); //页脚
        //      LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        //      LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
        LODOP.SET_PRINT_PAGESIZE(1, 2100, 2970, "");
        // LODOP.PREVIEW();
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        //  LODOP.PRINT();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

function Drp_Dviceondeliv_print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    Drp_Dviceondeliv_print = HczyCommon.extend(Drp_Dviceondeliv_print, BasePopController);
    Drp_Dviceondeliv_print.__super__.constructor.apply(this, arguments);

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    // CheckIsInstall();
    var postdata = {
        dviceondeliv_id: $scope.printobj.dviceondeliv_id,
        flag: 3
    };
    var promise = BasemanService.RequestPost("drp_dviceondeliv_header", "select", postdata);
    promise.then(function (result) {
        $scope.data.currItem = result;

        for (var i = 0; i < $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers.length; i++) {
            if ((i + 1) % 5 == 0) {
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sel = 5
            } else {
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sel = ((i + 1) % 5)
            }
            if ($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].gw != undefined) {
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_weight =
                    ($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].out_qty * ($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].gw));
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_weight = $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_weight.toFixed(4)
            }
            if ($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].volume != undefined) {
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_volume =
                    ($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].out_qty * parseFloat($scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].volume))
                $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_volume = $scope.data.currItem.drp_dviceondeliv_lineofdrp_dviceondeliv_headers[i].sum_volume.toFixed(4)
            }
        }
        $timeout(function () {
            if ($scope.printobj.confirm == 1) {
                $scope.prn1_print();
            }
            if ($scope.printobj.confirm == 2) {
                $scope.prn1_preview();
            }

        });

        //$scope.refresh(2);
    });

    function CreateOneFormPage() {
        LODOP = getLodop();
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

        LODOP.ADD_PRINT_HTM(158, "5%", "90%", 300, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 190, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

        LODOP.SET_PRINT_PAGESIZE(1, 2167, 808, ""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    };

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("发货通知单打印");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.ADD_PRINT_TABLE(137, "5%", "90%", 100, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(30, "5%", "90%", 109, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        //$scope.data.currItem.out_warehouse_name=document.getElementById("warehouse_name").value;
        LODOP.ADD_PRINT_HTM(250, "5%", "90%", 60, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.SET_PRINT_PAGESIZE(1, 2410, 910, "");
        // LODOP.PREVIEW();
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        //  LODOP.PRINT();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

function Drp_OutBill_Print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    Drp_OutBill_Print = HczyCommon.extend(Drp_OutBill_Print, BasePopController);
    Drp_OutBill_Print.__super__.constructor.apply(this, arguments);

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    // CheckIsInstall();
    var postdata = {
        outbill_id: $scope.printobj.outbill_id
    };
    var promise = BasemanService.RequestPost("Drp_OutBill_Header", "select", postdata);
    promise.then(function (result) {

        $scope.item = result;
        for (var i = 0; i < $scope.item.drp_outbill_lineofdrp_outbill_headers.length; i++) {
            if ($scope.item.drp_outbill_lineofdrp_outbill_headers[i].actual_out_qty == "0") {
                $scope.item.drp_outbill_lineofdrp_outbill_headers.splice(i, 1);
            }
        }
        $timeout(function () {
            if ($scope.printobj.confirm == 1) {
                $scope.prn1_print();
            }
            if ($scope.printobj.confirm == 2) {
                $scope.prn1_preview();
            }

        });

        //$scope.refresh(2);
    });

    function CreateOneFormPage() {
        LODOP = getLodop();
        //LODOP.SET_PRINT_PAGESIZE(intOrient,intPageWidth,intPageHeight,strPageName)设定纸张大小
        //LODOP.PRINT_INIT("客户资料维护-打印");
        //LODOP.SET_PRINT_STYLE("FontSize",18);
        //LODOP.SET_PRINT_STYLE("Bold",1);
        //LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容"); 216.7*140mm
        //var printHtml=$("#printarea1").html();
        //r printHtml=document.getElementById("printarea").innerHTML
        //ert(printHtml);

        //DOP.ADD_PRINT_HTM(10,10,600,600,printHtml);
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

        LODOP.ADD_PRINT_HTM(158, "5%", "90%", 300, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 190, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

        LODOP.SET_PRINT_PAGESIZE(1, 2167, 808, ""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    };

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("内销成品调拨单");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.ADD_PRINT_TABLE(148, "5%", "90%", 240, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 109, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        //
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.SET_PRINT_PAGESIZE(1, 2167, 808, "");
        // LODOP.PREVIEW();
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        //  LODOP.PRINT();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

function Drp_ItemBack_Print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    Drp_ItemBack_Print = HczyCommon.extend(Drp_ItemBack_Print, BasePopController);
    Drp_ItemBack_Print.__super__.constructor.apply(this, arguments);

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    // CheckIsInstall();
    var postdata = {
        itemback_id: $scope.printobj.itemback_id
    };
    BasemanService.RequestPost("drp_itemback_header", "select", postdata)
        .then(function (result) {
            $scope.data.currItem = result;

            $timeout(function () {
                if ($scope.printobj.confirm == 1) {
                    $scope.prn1_print();
                } else if ($scope.printobj.confirm == 2) {
                    $scope.prn1_preview();
                }
            });
        });

    /*function CreateOneFormPage(){
	 LODOP=getLodop();
	 var strStyle="<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

	 LODOP.ADD_PRINT_HTM(158,"5%","90%",300,strStyle+document.getElementById("div2").innerHTML);
	 LODOP.SET_PRINT_STYLEA(0,"Vorient",3);
	 LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);

	 LODOP.ADD_PRINT_HTM(26,"5%","90%",190,document.getElementById("div1").innerHTML);  //表格页头
	 LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	 LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);

	 LODOP.ADD_PRINT_HTM(386,"5%","90%",54,document.getElementById("div3").innerHTML); //页脚
	 LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
	 LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);

	 LODOP.SET_PRINT_PAGESIZE(1,2167,808,"");//这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
	 };  */

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("成品退货单");

        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

        LODOP.ADD_PRINT_HTM(148, "5%", "90%", 240, strStyle + "<body>" + document.getElementById("div2").innerHTML + "</body>");
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 109, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        //
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

        LODOP.SET_PRINT_PAGESIZE(3, 2167, 808, "");
        // LODOP.PREVIEW();
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        //  LODOP.PRINT();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

/**
 *    活动申请单打印
 */
function Mkt_Act_Print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    Mkt_Act_Print = HczyCommon.extend(Mkt_Act_Print, BasePopController);
    Mkt_Act_Print.__super__.constructor.apply(this, arguments);

    $scope.dict_item_types = [{
        name: '总部推广活动',
        id: 1
    }, {
        name: '区域推广活动',
        id: 2
    },];

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    var postdata = {
        act_id: $scope.printobj.act_id
    };
    BasemanService.RequestPost("mkt_act", "select", postdata)
        .then(function (result) {
            $scope.item = result;
            $scope.total_num = 0;
            $timeout(function () {
                if ($scope.printobj.confirm == 1) {
                    $scope.prn1_print();
                }
                if ($scope.printobj.confirm == 2) {
                    $scope.prn1_preview();
                }
            });

        });

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("活动申请单打印");
        //	        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        //	        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}" +
            ".ibox-content{clear: both;background-color: #ffffff;color: inherit;padding: 15px 20px 20px 20px;border-color: #e7eaec;border-image: none;border-style: solid solid none;border-width: 1px 0px;}" +
            ".ibox-content>div.row{margin-top: 7px;margin-bottom: 7px;}.row{margin-right: -15px;margin-left: -15px;}" +
            ".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position: relative;min-height: 1px;padding-right: 3px;padding-left: 3px;}" +
            ".col-md-12 {width: 100%;}.col-md-11 {width: 91.66666667%;}.col-md-10 {width: 83.33333333%;}.col-md-9 {width: 75%;}.col-md-8 {width: 66.66666667%;}.col-md-7 {width: 58.33333333%;}.col-md-6 {width: 50%;}.col-md-5 {width: 41.66666667%;}.col-md-4 {width: 33.33333333%;}.col-md-3 {width: 25%;}.col-md-2 {width: 16.66666667%;}.col-md-1 {width: 8.33333333%;}</style>";
        $("#div1").show();
        var height = $("#div1").height();
        $("#div1").hide();
        LODOP.ADD_PRINT_HTM(26, "3%", "95%", height + 50, $("#div1").html()); //表格页头
        $("#div2").show();
        var s_height = $("#div2").height();
        $("#div2").hide();
        LODOP.ADD_PRINT_HTM(height + 50, "3%", "95%", s_height, $("#div2").html()); //页脚
        //	        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        //	        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

/**
 *    活动报销单打印
 */
function Mkt_Act_Bx_Print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    Mkt_Act_Bx_Print = HczyCommon.extend(Mkt_Act_Bx_Print, BasePopController);
    Mkt_Act_Bx_Print.__super__.constructor.apply(this, arguments);

    $scope.oklist = [{
        name: '否',
        id: 1
    }, {
        name: '是',
        id: 2
    },];

    $scope.zf_types = [{
        value: 1,
        desc: "转货款"
    }, {
        value: 2,
        desc: "现金"
    }, {
        value: 3,
        desc: "转票折"
    }];

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    var postdata = {
        act_bx_id: $scope.printobj.act_bx_id
    };
    BasemanService.RequestPost("mkt_act_bx_header", "select", postdata)
        .then(function (result) {
            $scope.item = result;
            $timeout(function () {
                if ($scope.printobj.confirm == 1) {
                    $scope.prn1_print();
                }
                if ($scope.printobj.confirm == 2) {
                    $scope.prn1_preview();
                }
            });

        });

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("活动报销单打印");
        //	        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        //	        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}" +
            ".ibox-content{clear: both;background-color: #ffffff;color: inherit;padding: 15px 20px 20px 20px;border-color: #e7eaec;border-image: none;border-style: solid solid none;border-width: 1px 0px;}" +
            ".ibox-content>div.row{margin-top: 7px;margin-bottom: 7px;}.row{margin-right: -15px;margin-left: -15px;}" +
            ".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position: relative;min-height: 1px;padding-right: 3px;padding-left: 3px;}" +
            ".col-md-12 {width: 100%;}.col-md-11 {width: 91.66666667%;}.col-md-10 {width: 83.33333333%;}.col-md-9 {width: 75%;}.col-md-8 {width: 66.66666667%;}.col-md-7 {width: 58.33333333%;}.col-md-6 {width: 50%;}.col-md-5 {width: 41.66666667%;}.col-md-4 {width: 33.33333333%;}.col-md-3 {width: 25%;}.col-md-2 {width: 16.66666667%;}.col-md-1 {width: 8.33333333%;}</style>";
        $("#div1").show();
        var height = $("#div1").height();
        $("#div1").hide();
        LODOP.ADD_PRINT_HTM(26, "3%", "95%", height, $("#div1").html()); //表格页头
        $("#div2").show();
        var s_height = $("#div2").height();
        $("#div2").hide();
        LODOP.ADD_PRINT_HTM(height + 30, "3%", "95%", s_height + 100, $("#div2").html()); //页脚
        //	        LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
        //	        LODOP.SET_PRINT_STYLEA(0,"LinkedItem",1);
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

function Fin_Materiel_Apply_Print($scope, $http, $rootScope, $timeout, $modal, $location, BasemanService, localeStorageService, notify, $modalInstance) {
    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    Fin_Materiel_Apply_Print = HczyCommon.extend(Fin_Materiel_Apply_Print, BasePopController);
    Fin_Materiel_Apply_Print.__super__.constructor.apply(this, arguments);

    function CheckIsInstall() {
        try {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if ((LODOP != null) && (typeof(LODOP.VERSION) != "undefined")) alert("本机已成功安装过Lodop控件!\n  版本号:" + LODOP.VERSION);
        } catch (err) {
            alert("Error:本机未安装或需要升级!");
        }
    };
    // CheckIsInstall();
    var postdata = {
        materiel_apply_id: $scope.printobj.materiel_apply_id
    };
    var promise = BasemanService.RequestPost("fin_materiel_header", "select", postdata);
    promise.then(function (result) {

        $scope.item = result;
        $scope.total_qty = 0;
        for (var i = 0; i < $scope.item.fin_materiel_lineoffin_materiel_headers.length; i++) { //实发数为零的数据不需要打印
            if ($scope.item.fin_materiel_lineoffin_materiel_headers[i].actual_out_qty == "0") {
                $scope.item.fin_materiel_lineoffin_materiel_headers.splice(i, 1);
                i--;
            }
            $scope.total_qty += parseInt($scope.item.fin_materiel_lineoffin_materiel_headers[i].qty);
        }
        $timeout(function () {
            if ($scope.printobj.confirm == 1) {
                $scope.prn1_print();
            }
            if ($scope.printobj.confirm == 2) {
                $scope.prn1_preview();
            }

        });

        //$scope.refresh(2);
    });

    function CreateOneFormPage() {
        LODOP = getLodop();
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

        LODOP.ADD_PRINT_HTM(158, "5%", "90%", 300, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 190, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

        LODOP.SET_PRINT_PAGESIZE(1, 2167, 808, ""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    };

    function PreviewMytable() {
        LODOP = getLodop();
        LODOP.PRINT_INIT("内销成品调拨单");
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
        LODOP.ADD_PRINT_TABLE(148, "5%", "90%", 240, strStyle + document.getElementById("div2").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", 109, document.getElementById("div1").innerHTML); //表格页头
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        //
        LODOP.ADD_PRINT_HTM(386, "5%", "90%", 54, document.getElementById("div3").innerHTML); //页脚
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.SET_PRINT_PAGESIZE(1, 2167, 808, "");
        // LODOP.PREVIEW();
    };
    $scope.prn1_print = function () {
        PreviewMytable();
        //  LODOP.PRINT();
        LODOP.PRINTA();
    };
    $scope.prn1_preview = function () {
        PreviewMytable();
        LODOP.PREVIEW();
    };

}

/**
 * 通用批量新增控制器
 */
function CommonAddController($scope, $modalInstance, BasemanService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {

        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere($scope.sqlwhere, $scope.searchtext);
        //var cust_id=parseInt($scope.data.currItem.cust_id);
        if ($scope.postdata != undefined) {
            var postdata = $scope.postdata
        } else {
            var postdata = {};
        }
        postdata.sqlwhere = sqlWhere;
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}

        var promise = BasemanService.RequestPost($scope.classname, $scope.fun, postdata);
        promise.then(function (data) {
            //请再此处新增接收容器
            if ($scope.classname == 'drp_cust') {
                $scope.items = data.drp_custs;
            } else if ($scope.classname == 'base_search') {
                $scope.items = data.orgs;
                //$scope.items = data.outbill_types;
            } else if ($scope.classname == 'drp_item') {
                $scope.items = data.drp_items;
            } else if ($scope.classname == 'drp_gcust_saleorder_header') {
                $scope.items = data.drp_gcust_saleorder_headers;
            } else if ($scope.classname == 'drp_item_type') {
                $scope.items = data.drp_item_types;
            } else if ($scope.classname == 'drp_outbill_header') {
                $scope.items = data.drp_outbill_headers;
            } else if ($scope.classname == 'drp_parameter') {
                $scope.items = data.drp_parameters;
            }

        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

//查询点击单个通用控制器

function CommonController($scope, $modalInstance, BasemanService) {
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };
    $scope.addConfirm = function (index) {
        $modalInstance.close($scope.items[index]);
    }
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere($scope.sqlwhere, $scope.searchtext);
        var postdata = {
            sqlwhere: sqlWhere,
            flag: 0
        };

        if ($scope.postdata != undefined) {
            var postdata = $scope.postdata
        } else {
            var postdata = {};
        }
        if ($scope.flag != undefined) {
            postdata.flag = $scope.flag;
        }
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost($scope.classname, $scope.fun, postdata);
        promise.then(function (data) {
            if ($scope.classname == "warehouse") {
                $scope.items = data.warehouses;
            }
            if ($scope.classname == "drp_cust") {
                $scope.items = data.drp_custs;
            }
            if ($scope.classname == "fin_greturn_header") {
                $scope.items = data.fin_greturn_headers;
            }

        });
    }
}

//用于显示数据的控制器，不具有查询的功能

function CommonWatchController($scope, $modalInstance, BasemanService) {
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.search_hint = "正在查询...";

    var postdata = $scope.postdata;
    var promise = BasemanService.RequestPost($scope.classname, $scope.fun, postdata);
    promise.then(function (data) {
        $scope.items = data.drp_inventoryofdrp_trans_loads;
        $scope.search_hint = "";
    });

}

/**
 * 预算调整明细 新增
 */
function FinBudAdjustAddController($scope, $modalInstance, BasemanService) {
    $scope.item = {};
    $scope.style = $scope.$parent.data.currItem.style;
    if ($scope.$parent.p_item) {
        $scope.item = $scope.$parent.p_item;
    }
    $scope.ok = function () {
        if ($scope.style == "1" && Number($scope.item.z_adjust_amt) < 0) {
            BasemanService.notice("调增金额不能小于零", "alert-warning");
            return;
        } else if ($scope.style == "2" && Number($scope.item.j_adjust_amt) > 0) {
            BasemanService.notice("调减金额不能大于零", "alert-warning");
            return;
        } else if ($scope.style == "3" && (Number($scope.item.z_adjust_amt) < 0 || Number($scope.item.j_adjust_amt) > 0)) {
            Number($scope.item.z_adjust_amt) < 0 ?
                BasemanService.notice("调增金额不能小于零", "alert-warning") :
                BasemanService.notice("调减金额不能大于零", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.budtypeInfo = {
        title: "预算类别查询",
        thead: [{
            name: "编码",
            code: "bud_type_code"
        }, {
            name: "名称",
            code: "bud_type_name"
        }],
        classid: "fin_bud_type_header",
        postdata: {},
        searchlist: ["bud_type_name", "bud_type_code"],
    };
    $scope.zopentype = function () {
        $scope.FrmInfo = $scope.budtypeInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.z_bud_type_id = result.bud_type_id;
            $scope.item.z_bud_type_name = result.bud_type_name;
            $scope.item.z_bud_type_code = result.bud_type_code;
            $scope.item.z_period_type = result.period_type;

            $scope.item.z_fee_name = "";
            $scope.item.z_fee_id = 0;
        });
    }
    $scope.jopentype = function () {
        $scope.FrmInfo = $scope.budtypeInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.j_bud_type_id = result.bud_type_id;
            $scope.item.j_bud_type_name = result.bud_type_name;
            $scope.item.j_bud_type_code = result.bud_type_code;
            $scope.item.j_period_type = result.period_type;

            $scope.item.j_fee_name = "";
            $scope.item.j_fee_id = 0;
        });
    }

    //部门查询
    $scope.OrgFrmInfo = {
        title: "部门查询",
        thead: [{
            name: "部门编码",
            code: "org_code"
        }, {
            name: "部门名称",
            code: "org_name"
        }],
        classid: "base_search",
        action: 'searchorg',
        backdatas: 'orgs',
        postdata: {},
        searchlist: ["code", "orgname"],
    };
    $scope.selectOrgZ = function () {
        $scope.FrmInfo = $scope.OrgFrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.z_org_id = result.org_id;
            $scope.item.z_org_code = result.org_code;
            $scope.item.z_org_name = result.org_name;
            $scope.item.z_idpath = result.idpath;
        });
    };
    $scope.selectOrgJ = function () {
        $scope.FrmInfo = $scope.OrgFrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.j_org_id = result.org_id;
            $scope.item.j_org_code = result.org_code;
            $scope.item.j_org_name = result.org_name;
            $scope.item.j_idpath = result.idpath;
        });
    };

    $scope.PeriodFrmInfo = {
        title: "预算期间查询",
        thead: [{
            name: "年份",
            code: "period_year"
        }, {
            name: "名称",
            code: "period_type"
        }],
        classid: "fin_bud_period_header",
        postdata: {
            flag: 2,
            period_year: $scope.$parent.data.currItem.bud_year,
            start_date: $scope.$parent.data.currItem.bill_date
        },
        searchlist: ["bud_type_name", "period_year"],
    };

    $scope.zopenperiod = function () {
        $scope.FrmInfo = $scope.PeriodFrmInfo;
        $scope.FrmInfo.postdata.period_type = $scope.item.z_period_type;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.z_period_line_id = result.period_line_id;
            $scope.item.z_dname = result.dname;
        });
    }

    $scope.jopenperiod = function () {
        $scope.FrmInfo = $scope.PeriodFrmInfo;
        $scope.FrmInfo.postdata.period_type = $scope.item.j_period_type;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.j_period_line_id = result.period_line_id;
            $scope.item.j_dname = result.dname;
        });
    }

    $scope.FeeFrmInfo = {
        title: "费用项目查询",
        thead: [{
            name: "项目编码",
            code: "fee_code"
        }, {
            name: "项目名称",
            code: "fee_name"
        }, {
            name: "备注",
            code: "note"
        }],
        classid: "fin_fee_header",
        postdata: {
            flag: 3
        },
        searchlist: ["bud_type_code", "bud_type_name", "fee_code", "fee_name"],
    };

    $scope.zopenfee = function () {
        $scope.FrmInfo = $scope.FeeFrmInfo;
        $scope.FrmInfo.postdata.bud_type_id = $scope.item.z_bud_type_id;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.z_fee_name = result.fee_name;
            $scope.item.z_fee_id = result.fee_id;
        });
    }

    $scope.jopenfee = function () {
        $scope.FrmInfo = $scope.FeeFrmInfo;
        $scope.FrmInfo.postdata.bud_type_id = $scope.item.j_bud_type_id;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.j_fee_name = result.fee_name;
            $scope.item.j_fee_id = result.fee_id;
        });
    }
}

/**
 * 弹出商品种类
 */
function PopOrgIDController(BasemanService, $scope, $modalInstance, BasemanService) {

    var orgid_original_data = {};

    var postdata = {};

    var sendData = {};
    BasemanService.RequestPost("scporg", "search", postdata)
        .then(function (data) {
            orgid_original_data = data.orgs;
            $scope.data.orgs = data.orgs;
        });

    $scope.setCheck = function (e, index) {
        sendData = $scope.data.orgs[index];
        //		sendData.item_type_id=$scope.data.product_types[index].item_type_id;

    };

    $scope.filter = function () {
        if ($scope.searchtext != undefined) {
            //			$scope.data.samples = [];
            var tempdata = []
            var length = orgid_original_data.length;

            for (var i = 0; i < length; i++) {
                if (orgid_original_data[i].orgname.indexOf($scope.searchtext) > -1) {
                    tempdata.push(orgid_original_data[i]);
                }
            }

            if (tempdata.length != 0) {
                $scope.data.orgs = tempdata;
            }

        }

    };

    $scope.ok = function () {
        $modalInstance.close(sendData);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

/**运费登记新增**/

function PopTiaoBoController($scope, $modalInstance, BasemanService) {
    $scope.item = {
        calc_trans_fee: 0,
        other_trans_fee: 0,
        kou_trans_fee: 0,
        tot_trans_fee: 0,
        outbill_id: 0,
    };
    $scope.style = $scope.$parent.data.currItem.style;
    if ($scope.$parent.p_item) {
        $scope.item = $scope.$parent.p_item;
    }
    $scope.selectRate = function () {
        $scope.item.tot_trans_fee = parseFloat($scope.item.calc_trans_fee) + parseFloat($scope.item.other_trans_fee) -
            parseFloat($scope.item.kou_trans_fee);
    };
    $scope.ok = function () {
        if ($scope.item.outbill_no == "" || !$scope.item.outbill_no) {
            BasemanService.notice("发货单号不能为空", "alert-warning");
            return;
        }
        if ($scope.item.bus_index == "" || !$scope.item.bus_index) {
            BasemanService.notice("排车号不能为空", "alert-warning");
            return;
        }
        if ($scope.item.in_warehouse_name == "" || !$scope.item.in_warehouse_name) {
            BasemanService.notice("发货仓库不能为空", "alert-warning");
            return;
        }
        if ($scope.item.out_warehouse_name == "" || !$scope.item.out_warehouse_name) {
            BasemanService.notice("收货仓库不能为空", "alert-warning");
            return;
        }
        if ($scope.item.in_area_name == "" || !$scope.item.in_area_name) {
            BasemanService.notice("到货城市不能为空", "alert-warning");
            return;
        }
        if ($scope.item.trans_org_name == "" || !$scope.item.trans_org_name) {
            BasemanService.notice("承运商不能为空", "alert-warning");
            return;
        }
        if ($scope.item.shipmode_id == "" || !$scope.item.shipmode_id) {
            BasemanService.notice("发运方式不能为空", "alert-warning");
            return;
        }
        if ($scope.item.shipment_type == "" || !$scope.item.shipment_type) {
            BasemanService.notice("装车方式不能为空", "alert-warning");
            return;
        }
        if ($scope.item.confirm_time == "" || !$scope.item.confirm_time) {
            BasemanService.notice("发运日期不能为空", "alert-warning");
            return;
        }

        $scope.item.satt_trans_fee = $scope.item.comf_pay_amount = $scope.item.tot_trans_fee

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //到货城市
    $scope.selectCity = function (flag) {
        var FrmInfo = {
            title: "城市查询",
            initsql: "areatype=5",
            thead: [{
                name: "城市名称",
                code: "areaname"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "scparea",
            action: "search",
            postdata: {},
            searchlist: ["areaname", "note"],
            backdatas: "scpareas"
        };
        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.in_area_name = result.areaname;
            $scope.item.in_area_id = result.areaid;

        });
    };

    //部门查询
    $scope.selectBusiness = function (flag) {
        $scope.FrmInfo = {
            title: "承运商查询",
            initsql: "",
            thead: [{
                name: "承运商编码",
                code: "cust_code"
            }, {
                name: "承运商名称",
                code: "cust_name"
            }],
            classid: "drp_cust",
            postdata: {},
            sqlBlock: "cust_type = 3"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.trans_org_id = result.cust_id;
            $scope.item.trans_org_code = result.cust_code;
            $scope.item.trans_org_name = result.cust_name;

        });
    };

    //发运方式
    $scope.fh_types = [{
        id: 0,
        name: "全部"
    }, {
        id: 1,
        name: "汽运"
    }, {
        id: 2,
        name: "快递"
    }, {
        id: 3,
        name: "自提"
    }];

    //装车方式
    $scope.shipment_types = [{
        id: 0,
        name: "全部"
    }, {
        id: 1,
        name: "整车"
    }, {
        id: 2,
        name: "零担"
    }, {
        id: 3,
        name: "其他"
    }];

    //仓库查询
    $scope.selectWarehouse = function (flag) {
        var FrmInfo = {};
        FrmInfo.title = "仓库查询";
        FrmInfo.initsql = "warehouse_property = 1";
        FrmInfo.thead = [{
            name: "仓库编码",
            code: "warehouse_code"
        }, {
            name: "仓库名称",
            code: "warehouse_name"
        }];
        BasemanService.openCommonFrm(PopWarehouseController, $scope, FrmInfo)
            .result.then(function (result) {

            if (flag == 1) {
                $scope.item.in_warehouse_id = result.warehouse_id;
                $scope.item.in_warehouse_code = result.warehouse_code;
                $scope.item.in_warehouse_name = result.warehouse_name;
            } else {
                $scope.item.out_warehouse_id = result.warehouse_id;
                $scope.item.out_warehouse_code = result.warehouse_code;
                $scope.item.out_warehouse_name = result.warehouse_name;

            }

        });
    };
}

/**
 * 分车拼车 -- 拆分数量
 */
function PopSpliceDrpgController($scope, $modalInstance, BasemanService) {
    $scope.item = {
        this_divided_qty: $scope.$parent.p_item.divided_qty,
    };

    $scope.ok = function () {
        if (Number($scope.item.split_num) >= Number($scope.item.this_divided_qty)) {
            BasemanService.notice("拆分数量不能大于等于本次分车数", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

/**
 * 拆分明细数量
 */
function PopSpliceItemController($scope, $modalInstance, BasemanService) {
    $scope.item = {
        wait_divided_qty: $scope.$parent.p_item.th_qty,
    };

    $scope.ok = function () {
        $scope.item.split_num = parseInt($scope.item.split_num);
        if (Number($scope.item.split_num) <= 0) {
            BasemanService.notice("拆分数量不能小于等于零", "alert-warning");
            return;
        }
        if (Number($scope.item.split_num) >= Number($scope.item.wait_divided_qty)) {
            BasemanService.notice("拆分数量不能大于等于待拆分数量", "alert-warning");
            return;
        }
        if (!$scope.item.discount || $.trim($scope.item.discount) == "") {
            BasemanService.notice("折扣未填写", "alert-warning");
            return;
        }
        if (parseInt($scope.item.discount) > 1) {
            BasemanService.notice("折扣不能大于1", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

function PopSpliceHeController($scope, $modalInstance, BasemanService) {
    $scope.item = {};
    var sum1 = 0,
        sum2 = 0,
        sum3 = 0,
        sum4 = 0;
    $scope.carno_list = [];
    for (var i = 0; i < $scope.$parent.p_items.length; i++) {
        var stat = false;
        for (var j = 0; j < $scope.carno_list.length; j++) {
            if ($scope.carno_list[j].name == $scope.$parent.p_items[i].car_no) {
                stat = true;
                break;
            }
        }
        if (!stat) {
            $scope.carno_list.push({
                id: i,
                name: $scope.$parent.p_items[i].car_no
            });
        }

        sum1 += parseFloat($scope.$parent.p_items[i].trans_amount);
        sum2 += parseFloat($scope.$parent.p_items[i].cust_amount);
    }
    sum3 = parseFloat(sum1) + parseFloat(sum2)

    if ($scope.carno_list.length) {
        $scope.item.car_id = $scope.carno_list[0].id;
    }
    $scope.item.trans_amount = sum1;
    $scope.item.cust_amount = sum2;
    $scope.item.amount = sum3;
    $scope.item.car_no = sum4;

    $scope.item.amount = Number(HczyCommon.toDecimal2($scope.item.amount));
    $scope.item.trans_amount = Number(HczyCommon.toDecimal2($scope.item.trans_amount));

    $scope.changeamount = function () {
        $scope.item.amount = Number($scope.item.trans_amount) + Number($scope.item.cust_amount);
    }

    $scope.ok = function () {
        for (var i = 0; i < $scope.carno_list.length; i++) {
            if ($scope.item.car_id == $scope.carno_list[i].id) {
                $scope.item.car_no = $scope.carno_list[i].name;
                break;
            }
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

/**
 * 流程转发/提交/驳回
 */
function PopWFTurnOptionController($scope, $modalInstance, BasemanService) {

    $scope.FrmInfo = {
        title: '转办流程'
    };
    $scope.item = {
        opinion: '同意'
    };

    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {

        var sqlwhere = BasemanService.getSqlWhere(["userid"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlwhere
        };
        BasemanService.RequestPost("base_wf", "searchuser", postdata)
            .then(function (data) {
                $scope.items = data.wfprocusers;
            });
    }
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item.userid = $scope.items[index].userid;
    };
    $scope.ok = function () {
        if (!$scope.item.userid) {
            BasemanService.notice("请选择转办用户！", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 流程转发/提交/详情
 */
function PopWFdetailController($scope, $modalInstance, BasemanService) {

    $scope.checksets = [{
        dictvalue: 1,
        dictname: "不检查"
    }, {
        dictvalue: 2,
        dictname: "提交时检查"
    }, {
        dictvalue: 3,
        dictname: "驳回时检查"
    }, {
        dictvalue: 4,
        dictname: "提交和驳回都检查"
    }]
    $scope.item = {};
    $scope.item.submitfunc = $scope.wfprocs[0].submitfunc;
    $scope.item.rejectfunc = $scope.wfprocs[0].rejectfunc;
    $scope.item.std_jzlmll = $scope.wfprocs[0].std_jzlmll;
    $scope.item.arrivefunc = $scope.wfprocs[0].arrivefunc;
    $scope.item.clientsubfunc = $scope.wfprocs[0].clientsubfunc;
    $scope.item.ctrlsubmitfunc = $scope.wfprocs[0].ctrlsubmitfunc;
    $scope.item.checkset = parseInt($scope.wfprocs[0].checkset || 0);
    $scope.item.checkfunc = $scope.wfprocs[0].checkfunc;
    $scope.ok = function () {

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopGridColumnsController($scope, $timeout, $modalInstance, BasemanService) {
    //原始列定义
    $scope.columns = $scope.$parent.grid.orgin_Columns; //可变数组的时候就没有了
    if (!$scope.columns || !$scope.columns.length) $scope.columns = $scope.$parent.grid.getColumns();
    //网格内的列
    $scope.gridcolumns = $scope.$parent.grid.getColumns();

    $timeout(function () {
        for (var i = 0; i < $scope.gridcolumns.length; i++) {
            var field = $scope.gridcolumns[i].field;
            $("#slickgrid_columns_def")
                .find("input[field='" + field + "']").each(function () {
                this.checked = true;
            });
        }
    });

    $scope.ok = function (e) {
        var columns = [];
        $(e.currentTarget).closest(".modal-content")
            .find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("li").index();
                columns.push($scope.columns[index]);
            }
        });

        $modalInstance.close(columns);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function emportexcelController($scope, $timeout, $modalInstance, BasemanService) {
    //原始列定义
    $scope.columns = $scope.$parent.sgColumns; //可变数组的时候就没有了
    //if (!$scope.columns || !$scope.columns.length)$scope.columns = $scope.$parent.grid.getColumns();
    //网格内的列
    //$scope.gridcolumns = $scope.$parent.grid.getColumns();

    $timeout(function () {
        for (var i = 0; i < $scope.columns.length; i++) {
            var field = $scope.columns[i].field;
            $("#slickgrid_columns_def")
                .find("input[field='" + field + "']").each(function () {
                this.checked = true;
            });
        }
    });

    $scope.ok = function (e) {
        var columns = [];
        $(e.currentTarget).closest(".modal-content")
            .find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("li").index();
                columns.push($scope.columns[index]);
            }
        });

        $modalInstance.close(columns);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 流程修改审核人
 */
function PopWFChgCheckerController($scope, $modalInstance, BasemanService) {

    $scope.FrmInfo = {
        title: '修改审核人',
        stype: 1, //修改审核人时需要显示的内容
    };
    $scope.item = {
        wfscpprocusers: $scope.$parent.wfscpprocusers,
        //		opinion:'同意'
    };

    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        var sqlwhere = BasemanService.getSqlWhere(["userid"], $scope.searchtext);
        var postdata = {
            sqlwhere: sqlwhere
        };
        BasemanService.RequestPost("base_wf", "searchuser", postdata)
            .then(function (data) {
                $scope.items = data.wfprocusers;
            });
    }
    $scope.dblLine = function (index) {
        var item = $scope.items[index];
        var stat = true;
        for (var i = 0; i < $scope.item.wfscpprocusers.length; i++) {
            if (item.userid == $scope.item.wfscpprocusers[i].userid) {
                stat = false;
                break;
            }
        }
        if (stat) $scope.item.wfscpprocusers.push(item);
    }
    $scope.delchecker = function (index) {
        $scope.item.wfscpprocusers.splice(index, 1);
    }
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item.userid = $scope.items[index].userid;
    };
    $scope.ok = function () {
        if (!$scope.item.wfscpprocusers.length) {
            BasemanService.notice("审批人不能少于1", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function wf_choose_options($scope, $modalInstance, BasemanService) {

    $scope.FrmInfo = {
        title: "流程步骤:" + $scope.data.wfprocs[$scope.i].proctempname + " 选择用户"
    };
    $scope.items = $scope.data.wfprocs[$scope.i].userofwfprocs

    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.delchecker = function (index) {
        $scope.item.wfscpprocusers.splice(index, 1);
    }
    $scope.dblLine = function (index, $event) {
        var object = {};
        object.userofwfprocs = [];
        object.position = $scope.data.wfprocs[$scope.$parent.i].position;
        object.procid = $scope.data.wfprocs[$scope.$parent.i].proctempid;
        object.syspositionid = $scope.data.wfprocs[$scope.$parent.i].syspositionid;
        object.userofwfprocs.push($scope.items[index]);
        $scope.$parent.procusers.push(object);
        $scope.$parent.i++;
        if ($scope.$parent.i > $scope.data.wfprocs.length - 1) {
            $modalInstance.close($scope.item);
            $scope.trigger();
            return;
        }
        while ($scope.data.wfprocs[$scope.$parent.i].userofwfprocs.length == 1) {
            if ($scope.$parent.i = $scope.data.wfprocs.length - 1) {
                $modalInstance.close($scope.item);
                $scope.trigger();
                return;
            } else {
                $scope.$parent.i++;
            }

        }
        $scope.FrmInfo = {
            title: "流程步骤 选择" + $scope.data.wfprocs[$scope.$parent.i].position
        };
        $scope.items = $scope.data.wfprocs[$scope.$parent.i].userofwfprocs;

        $modalInstance.close($scope.item);
        $scope.callback($scope.$parent.i);
    };
    $scope.ok = function () {
        if (!$scope.item.wfscpprocusers.length) {
            BasemanService.notice("审批人不能少于1", "alert-warning");
            return;
        }
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopGridColumnsController($scope, $timeout, $modalInstance, BasemanService) {
    //原始列定义
    $scope.columns = $scope.$parent.grid.orgin_Columns; //可变数组的时候就没有了
    if (!$scope.columns || !$scope.columns.length) $scope.columns = $scope.$parent.grid.getColumns();
    //网格内的列
    $scope.gridcolumns = $scope.$parent.grid.getColumns();

    $timeout(function () {
        for (var i = 0; i < $scope.gridcolumns.length; i++) {
            var field = $scope.gridcolumns[i].field;
            $("#slickgrid_columns_def")
                .find("input[field='" + field + "']").each(function () {
                this.checked = true;
            });
        }
    });

    $scope.ok = function (e) {
        var columns = [];
        $(e.currentTarget).closest(".modal-content")
            .find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("li").index();
                columns.push($scope.columns[index]);
            }
        });

        $modalInstance.close(columns);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

function PopNewCssFixStepController($scope, $modalInstance, BasemanService) {

    $scope.problems = [{
        id: 0,
        name: '全部'
    }, {
        id: 1,
        name: '售前网点'
    }, {
        id: 2,
        name: '售后网点'
    }, {
        id: 3,
        name: '三位一体'
    }];

    $scope.selectprod = function (p) {
        var FrmInfo = {};

        switch (p) {
            case 2:
                if ($scope.item.item_type_id == undefined) {
                    BasemanService.notice("请先选择大类", "alert-warning");
                    return;
                }
                ;
                FrmInfo.title = "小类查询";
                FrmInfo.initsql = "lev=" + p + " and pid=" + $scope.item.item_type_id;
                break;
            default:
                FrmInfo.title = "大类查询";
                FrmInfo.initsql = "lev=" + p;
        }
        FrmInfo.thead = [{
            name: "编码",
            code: "item_type_no"
        }, {
            name: "名称",
            code: "item_type_name"
        }];
        BasemanService.openCommonFrm(PopDrpItemTypeController, $scope, FrmInfo)
            .result.then(function (result) {
            switch (p) {
                case 2:
                    $scope.item.smallc_id = result.item_type_id;
                    $scope.item.smallc_code = result.item_type_no;
                    $scope.item.smallc_name = result.item_type_name;
                    break;
                default:
                    $scope.item.item_type_id = result.item_type_id;
                    $scope.item.item_type_no = result.item_type_no;
                    $scope.item.item_type_name = result.item_type_name;
            }
        });
    }
    $scope.item = {};
    if ($scope.$parent.p_item && $scope.$parent.p_item.is_edit) {
        $scope.item = $scope.$parent.p_item;
    }

    $scope.ok = function () {
        if ($scope.$parent.p_stat == 1) {
            if (!$.trim($scope.item.fix_step_code) || !$.trim($scope.item.fix_step_name)) {
                BasemanService.notice("编码/名称不能为空", "alert-warning");
                return;
            }
        } else if ($scope.$parent.p_stat == 2) {
            if (!$.trim($scope.item.problem_code)) {
                BasemanService.notice("故障编码不能为空", "alert-warning");
                return;
            }
        } else if ($scope.$parent.p_stat == 3) {
            if (!$.trim($scope.item.areacode) || !$.trim($scope.item.areaname)) {
                BasemanService.notice("区域编码/名称不能为空", "alert-warning");
                return;
            }
        }

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopCssEnduserController($scope, $modalInstance, BasemanService) {
    $scope.item = {};

    $scope.ok = function () {
        if (!$scope.item.enduser_name) {
            BasemanService.notice("用户名称不能为空", "alert-warning");
            return;
        }

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopCssEnduserController($scope, $modalInstance, BasemanService) {
    //单据类型，数据表里面没有属性值
    $scope.last_visit_types = [{
        id: 2,
        name: "安装单"
    }, {
        id: 3,
        name: "维修单"
    }, {
        id: 5,
        name: "保养单"
    }];

    //详细地址
    $scope.selectAdress = function (flag) {
        var FrmInfo = {
            title: "地址查询",
            initsql: "areatype=6",
            thead: [{
                name: "城市名称",
                code: "areaname"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "scparea",
            action: "search",
            postdata: {},
            searchlist: ["areaname", "note"],
            backdatas: "scpareas"
        };
        console.log($scope.data.currItem);
        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_name = result.note;
            $scope.data.currItem.area_id = result.areaid;

        });
    };

    //所属网点查询
    $scope.selectFix = function (flag) {
        var FrmInfo = {
            title: "网点查询",
            initsql: "",
            thead: [{
                name: "网点编码",
                code: "fix_org_code"
            }, {
                name: "网点名称",
                code: "fix_org_name"
            }],
            classid: "css_fix_org",
            action: "search",
            postdata: {},
            searchlist: ["fix_org_code", "fix_org_name", "fix_org_id"],
            backdatas: "css_fix_orgs"

        };

        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            console.log(result);
            $scope.data.currItem.fix_org_id = result.fix_org_id;
            $scope.data.currItem.fix_org_code = result.fix_org_code;
            $scope.data.currItem.fix_org_name = result.fix_org_name;

            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.org_name = result.org_name;

            $scope.data.currItem.s_fix_org_id = result.fix_org_id;
            $scope.data.currItem.s_fix_org_code = result.fix_org_code;
            $scope.data.currItem.s_fix_org_name = result.fix_org_name;
        });
    };

    //所属机构查询
    $scope.selectApart = function (flag) {
        var FrmInfo = {
            title: "机构查询",
            initsql: "",
            thead: [{
                name: "机构编码",
                code: "org_code"
            }, {
                name: "机构名称",
                code: "org_name"
            }],
            classid: "base_search",
            action: "searchorg",
            postdata: {},
            searchlist: ["code", "orgname", "orgid"],
            backdatas: "orgs"

        };

        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.org_name = result.org_name;
        });
    };

    //服务网点查询
    $scope.selectSFix = function (flag) {
        var sqlwhere = "";
        if ($scope.data.currItem.org_id) {
            sqlwhere = "org_id = " + $scope.data.currItem.org_id;
        }
        FrmInfo = {
            title: "服务网点查询",
            initsql: sqlwhere,
            thead: [{
                name: "服务网点编码",
                code: "fix_org_code"
            }, {
                name: "服务网点名称",
                code: "fix_org_name"
            }],
            classid: "css_fix_org",
            action: "search",
            postdata: {},
            searchlist: ["fix_org_code", "fix_org_name", "fix_org_id"],
            backdatas: "css_fix_orgs"

        };
        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            console.log(result);
            $scope.data.currItem.s_fix_org_id = result.fix_org_id;
            $scope.data.currItem.s_fix_org_code = result.fix_org_code;
            $scope.data.currItem.s_fix_org_name = result.fix_org_name;
        });
    };

    //服务代表查询
    $scope.selectGuider = function (flag) {
        FrmInfo = {
            title: "服务代表查询",
            initsql: "",
            thead: [{
                name: "服务代表ID",
                code: "fix_man_id"
            }, {
                name: "服务代表名称",
                code: "fix_man_name"
            }],
            classid: "css_fix_man",
            action: "search",
            postdata: {},
            searchlist: ["fix_man_id", "fix_man_name"],
            backdatas: "css_fix_mans"

        };

        $scope.FrmInfo = FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.guider_id = result.fix_man_id;
            $scope.data.currItem.guider_name = result.fix_man_name;
        });
    };

    //联系人明细
    $scope.teloptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    //网格的配置----联系人明细*/
    $scope.telcolumns = [{
        id: "seq",
        name: "序号",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 50,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    }, {
        id: "contact_man",
        name: "姓名",
        field: "contact_man",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "telphone",
        name: "电话一",
        field: "telphone",
        width: 120,
        editor: Slick.Editors.Number
    }, {
        id: "tel_code",
        name: "电话二",
        field: "tel_code",
        width: 120,
        editor: Slick.Editors.Number
    }, {
        id: "last_contact_time",
        name: "新增时间",
        field: "last_contact_time",
        width: 120,
        editor: Slick.Editors.Date,
        formatter: Slick.Formatters.Date, //格式化时间，消除时间后面的00:00:00样式
        cssClass: "centerAligned"
    }];

    //标签明细
    $scope.labeloptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    //网格的配置----标签明细*/
    $scope.labelcolumns = [{
        id: "label_name",
        name: "描述",
        field: "label_name",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "label_time",
        name: "新增时间",
        field: "label_time",
        width: 120,
        editor: Slick.Editors.Date,
        formatter: Slick.Formatters.Date, //格式化时间，消除时间后面的00:00:00样式
        cssClass: "centerAligned"
    }];

    //资产明细
    $scope.lineoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };
    //网格的配置----资产明细*/
    $scope.linecolumns = [{
        id: "item_code",
        name: "资产名称",
        field: "item_code",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "item_name",
        name: "资产编码",
        field: "item_name",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "barcode",
        name: "资产条码",
        field: "barcode",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "purch_date",
        name: "购买时间",
        field: "purch_date",
        width: 120,
        editor: Slick.Editors.Date,
        formatter: Slick.Formatters.Date, //格式化时间，消除时间后面的00:00:00样式
        cssClass: "centerAligned"
    }, {
        id: "buy_address",
        name: "购买地点",
        field: "buy_address",
        width: 200,
        editor: Slick.Editors.Text
    }, {
        id: "item_address",
        name: "安装地址",
        field: "item_address",
        width: 200,
        editor: Slick.Editors.Text
    }];

    $scope.item = {};

    $scope.ok = function () {
        /*if(!$scope.item.enduser_name){
		 BasemanService.notice("用户名称不能为空","alert-warning");
		 return;
		 }
		 if (!$scope.item.area_name) {
		 BasemanService.notice("详细地址不能为空","alert-warning");
		 return;
		 }
		 if (!$scope.item.mobile) {
		 BasemanService.notice("电话一不能为空","alert-warning");
		 return;
		 }
		 if (!$scope.item.fix_org_name) {
		 BasemanService.notice("所属网点不能为空","alert-warning");
		 return;
		 }
		 if (!$scope.item.s_fix_org_name) {
		 BasemanService.notice("服务网点不能为空","alert-warning");
		 return;
		 }*/

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function PopFixHeaderController($scope, $modalInstance, BasemanService) {
    $scope.repList = [];
    $scope.item = {};
    $scope.onLineActiveCellChanged = function (e, args) {
        var item = args.grid.getDataItem(args.row);
        if (item != undefined) {
            $scope.item = item;
        }
    }

    $scope.repOptions = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        onActiveCellChanged: $scope.onLineActiveCellChanged
    };
    var repOptions = $scope.repOptions;
    $scope.ok = function () {

        var grid = $scope.repOptions.grid;
        var rows = grid.getSelectedRows();
        var data = grid.getData();
        var list = [];
        for (var i = 0; i < rows.length; i++) {
            list.push(data[rows[i]]);
        }

        $modalInstance.close(list);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.searchhint = "正在查询...";
    var postdata = {};
    if ($scope.$parent.p_item.flag == 2) {
        postdata = {
            flag: 2,
            item_id: $scope.data.currItem.item_id,
            fix_org_id: $scope.data.currItem.fix_org_id
        }
    } else if ($scope.$parent.p_item.flag == 3) {
        postdata.css_item_id = $scope.$parent.p_item.css_item_id;
        postdata.flag = 3;
    }
    BasemanService.RequestPost("css_item", "search", postdata)
        .then(function (data) {
            data.css_items.genID("seq");
            var grid = repOptions.grid;
            grid.setDataResize(data.css_items);
        });

    $scope.repColumns = [{
        id: "seq",
        name: "序号",
        field: "seq",
        width: 40
    }, {
        id: "css_item_code",
        name: "配件编码",
        field: "css_item_code",
        width: 120,
        editor: Slick.Editors.Text
    }, {
        id: "css_item_name",
        name: "配件名称",
        field: "css_item_name",
        width: 140,
        editor: Slick.Editors.Text
    }, {
        id: "css_item_spec",
        name: "型号",
        field: "css_item_spec",
        width: 140,
        editor: Slick.Editors.Text
    }, {
        id: "qty",
        name: "BOM数量",
        field: "qty",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "settle_price",
        name: "单价",
        field: "settle_price",
        width: 80,
        editor: Slick.Editors.Text
    }, {
        id: "canused_qty",
        name: "库存数量",
        field: "canused_qty",
        width: 80,
        editor: Slick.Editors.Text
    }];

}

//查询点击单个通用控制器
function CommonControllerA($scope, $modalInstance, BasemanService) {
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addLine = function (index, $event) {
        $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
        $scope.item = $scope.items[index];
    };
    $scope.addConfirm = function (index) {
        $modalInstance.close($scope.items[index]);
    }
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.search = function () {
        var sqlWhere = BasemanService.getSqlWhere($scope.sqlwhere, $scope.searchtext);
        $scope.postdata.sqlWhere = sqlWhere + " " + $scope.postdata.sqlWhere;

        if ($scope.postdata != undefined) {
            var postdata = $scope.postdata
        } else {
            var postdata = {};
        }
        if ($scope.flag != undefined) {
            postdata.flag = $scope.flag;
        }
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = postdata.sqlwhere + " and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        var promise = BasemanService.RequestPost($scope.classname, $scope.fun, $scope.postdata);
        promise.then(function (data) {
            if ($scope.classname == "pro_item_ysamt") {
                $scope.items = data.pro_item_ysamts;
            }
            if ($scope.classname == "customer") {
                $scope.items = data.customers;
            }
            if ($scope.classname == "fin_greturn_header") {
                $scope.items = data.fin_greturn_headers;
            }
            if ($scope.classname == "seaport") {
                $scope.items = data.seaports;
            }
            if ($scope.classname == "sale_ship_warn_header") {
                $scope.items = data.sale_ship_warn_headers;
            }
            if ($scope.classname == "pro_item_type") {
                $scope.items = data.pro_item_types;
            }
            if ($scope.classname == "pro_item") {
                $scope.items = data.pro_items;
            }
            if ($scope.classname == "bank") {
                $scope.items = data.banks;
            }
            if ($scope.classname == "customer_core_item") {
                $scope.items = data.customer_core_items;
            }
            if ($scope.classname == "scparea") {
                $scope.items = data.scpareas;
            }
            if ($scope.classname == "scpuser") {
                $scope.items = data.users;
            }
            //生产单查询形式发票单据
            if ($scope.classname == "sale_pi_header") {
                $scope.items = data.sale_pi_headers;
            }
            if ($scope.classname == "bill_bank") {
                $scope.items = data.bill_banks;
            }
            if ($scope.classname == "fin_lc_bill") {
                $scope.items = data.fin_lc_bills;
            }
            if ($scope.classname == "scporg") {
                $scope.items = data.orgs;
            }
            if ($scope.classname == "sale_prod_header") {
                $scope.items = data.sale_prod_headers;
            }
            if ($scope.classname == "fin_lc_allot_header") {
                $scope.items = data.fin_lc_allot_headers;
            }
        });
    }
}

/**
 * 复制行数
 */
function PopCopyLineController($scope, $modalInstance, BasemanService) {

    $scope.ok = function () {

        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

//发货通知增加行
function CommonAddController($scope, $modalInstance, BasemanService, BaseService) {

    //	$scope.item = {};
    $scope.items;
    $scope.tempArr = new Array();
    $scope.ok = function () {
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                var index = $(this).closest("tr").index();
                $scope.tempArr.push($scope.items[index]);
            }
        });
        $modalInstance.close($scope.tempArr);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.enter = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.search();
        }
    }
    $scope.selectall = function () {
        var checked = $("#selectall")[0].checked;
        if (checked) {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = true;
            });
        } else {
            $("#history_table").find("input[name='item']").each(function () {
                this.checked = false;
            });
        }

    }

    $scope.search = function () {
        $("#selectall").attr("checked", false);
        var sqlWhere = BasemanService.getSqlWhere($scope.sqlwhere, $scope.searchtext);
        //var cust_id=parseInt($scope.data.currItem.cust_id);
        // if ($scope.postdata != undefined){
        // var  postdata=$scope.postdata}
        // else{
        // var  postdata={};
        // }
        if ($scope.postdata != undefined) {
            var postdata = $scope.postdata;
            postdata.sqlwhere = sqlWhere;
        } else {
            var postdata = {
                sqlwhere: sqlWhere,
            };
        }
        if ($scope.flag != undefined) {
            postdata.flag = $scope.flag;
        }
        //postdata.sqlWhere=sqlWhere;
        if ($scope.FrmInfo.initsql != undefined) {
            if (postdata.sqlwhere != "" && postdata.sqlwhere != undefined) {
                postdata.sqlwhere = "(" + postdata.sqlwhere + ") and " + $scope.FrmInfo.initsql;
            } else {
                postdata.sqlwhere = $scope.FrmInfo.initsql;
            }
        }

        //if($scope.data.currItem && $scope.data.currItem.cust_id){
        //postdata.cust_id = $scope.data.currItem.cust_id;
        //	}
        var containers = $scope.containers || $scope.classname + "s";
        var promise = BasemanService.RequestPost($scope.classname, $scope.fun, postdata);
        promise.then(function (data) {
            //请再此处新增接收容器
            /**    if($scope.classname=='customer'){
			$scope.items = data.customers;
		    }
             else if($scope.classname=='base_search'){
			$scope.items = data.orgs;
			//$scope.items = data.outbill_types;
			}
             else if($scope.classname=='drp_item'){
				$scope.items = data.drp_items;
			}
             else if($scope.classname=='drp_gcust_saleorder_header'){
				$scope.items = data.drp_gcust_saleorder_headers;
			}
             else if($scope.classname=='drp_item_type'){
				$scope.items = data.drp_item_types;
			}
             else if($scope.classname=='drp_outbill_header'){
				$scope.items = data.drp_outbill_headers;
			}
             else if($scope.classname=='drp_parameter'){
				$scope.items = data.drp_parameters;
			}
             else if( $scope.classname=="pro_item_ysamt"){
				$scope.items = data.pro_item_ysamts;
			}
             else if( $scope.classname=="base_pro_part"){
				$scope.items = data.base_pro_parts;
			}
             else if( $scope.classname=="base_search"){
				$scope.items = data.base_pro_parts;
			}
             else if( $scope.classname=="bank"){
				$scope.items = data.banks;
			}
             if( $scope.classname=="pro_item"){
				$scope.items = data.pro_item_partofpro_items;
			}*/
            $scope.items = data[containers]; //返回的数据组？显示的字段？search方法不一样?
            if (!$scope.items.length) {
                // BaseService.notice("未有搜索记录!", "alert-warning");
            }

        });
    }
    $scope.trselect = function (index, event) {
        var checkbox = $(event.currentTarget).find("input[type='checkbox']")[0];
        if ($(event.currentTarget).hasClass("info")) {
            $(event.currentTarget).removeClass("info")
            if (checkbox.checked) {
                checkbox.checked = false;
            }
            //$scope.tempArr.splice(index,1);
        } else {
            $(event.currentTarget).addClass("info")
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
        var index = 0;
        $("#history_table").find("input[name='item']").each(function () {
            if (this.checked) {
                ++index;
            }
        });
        if (index == $("#history_table").find("input[name='item']").length) {
            $("#selectall")[0].checked = true;
        } else {
            $("#selectall")[0].checked = false;
        }
    }
}

//弹出框公司文档
function company_files($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, $modalInstance) {
    //继承基类方法
    company_files = HczyCommon.extend(company_files, ctrl_bill_public);
    company_files.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $modalInstance]);

    $scope.data = {};
    $scope.data.currItem = {};
    $scope.ok = function () {
        var node = $scope.zTree.getSelectedNodes()[0];
        $modalInstance.close(node);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.rowDoubleClicked = function (e) {
        var data = $scope.gridGetRow('options');
        if (data.docid) {
            $scope.viewDoc(data);
        } else {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
            var postdata = {};
            for (name in e.data) {
                if (name != 'children') {
                    postdata[name] = e.data[name];
                }
            }
            BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                .then(function (data) {
                    data.children = data.fdrs;
                    var treeNode = $scope.zTree.getNodesByParam("id", e.data.fdrid, null);
                    $scope.zTree.selectNode(treeNode[0]);
                    if (data.children) {
                        for (var i = 0; i < data.docs.length; i++) {
                            data.docs[i].name = data.docs[i].docname;
                        }
                        for (var i = 0; i < data.fdrs.length; i++) {
                            data.fdrs[i].name = data.fdrs[i].fdrname;
                            data.fdrs[i].item_type = 1;
                        }
                        $scope.data.currItem.files = data.fdrs.concat(data.docs);
                        ;

                        for (var i = 0; i < data.children.length; i++) {
                            data.children[i].isParent = true;
                            data.children[i].name = data.children[i].fdrname
                            data.children[i].pId = parseInt(treeNode.id);
                            data.children[i].id = parseInt(data.children[i].fdrid)
                            data.children[i].item_type = 1;
                            $scope.zTree.addNodes(treeNode, data.children[i])
                        }
                        $scope.zTree.expandNode(treeNode[0], true, false, true, true);
                        $timeout(
                            function () {
                                $scope.options.api.setRowData($scope.data.currItem.files)
                            }, 250
                        )

                    }

                });
        }

    }

    $scope.options = {
        rowDoubleClicked: $scope.rowDoubleClicked,
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        rowHeight: 30,
        getNodeChildDetails: function (file) {
            if (file.group) {
                file.group = file.group;
                return file;
            } else {
                return null;
            }
        },
        enableColResize: true,
        icons: {
            groupExpanded: '<i class="fa fa-minus-square-o"/>',
            groupContracted: '<i class="fa fa-plus-square-o"/>',
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    function imageRenderer(params) {
        if (params.data.item_type == 1) {
            return "<img src='/web/img/file.png'>" + params.data[params.colDef.field];
        } else {
            var classname = HczyCommon.getAttachIcon(params.value);
            var plus = '';
            if (parseInt(params.data.wfid) > 0) {
                plus += ';background-color:#5de466';
            }
            if (parseInt(params.data.stat) == 8) {
                plus += ';background-color:#e2e20e';
            }

            var color = '';
            if (classname == 'fa-file-pdf-o') {
                color = 'style="color:#8c0404' + plus + '"';
            } else if (classname == 'fa-file-excel-o') {
                color = 'style="color:green' + plus + '"'
            } else if (classname == 'fa-file-word-o') {
                color = 'style="color:#0808de' + plus + '"'
            } else if (classname == 'fa-file-powerpoint-o') {
                color = 'style="color:red' + plus + '"'
            } else if (classname == 'fa-file-image-o') {
                color = 'style="color:blue' + plus + '"';
            } else {
                color = ''
            }

            return '<i class="fa ' + classname + ' fa-lg"' + color + '>' + '</i>' + params.data[params.colDef.field];
        }
    }

    function itemtypeRenderer(params) {
        if (parseInt(params.value) == 1) {
            return '文件夹';
        } else {
            doc = params.data;
            if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                return '图片文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
                return 'word 文件'
            } else if (doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
                return 'excel 文件'
            } else if (doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
                return '文本文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                return 'PPT 文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                return 'pdf 文件'
            } else {
                return '其它文件'
            }

        }
    }

    $scope.columns = [{
        headerName: "名称",
        field: "name",
        width: 280,
        onclick: $scope.rowClicked,
        //cellClass:function(params){return cellClassf(params)},
        cellRenderer: function (params) {
            return imageRenderer(params)
        },
        //cellClass: 'fa fa-file-excel-o'

    }, {
        headerName: "类型",
        field: "item_type",
        width: 100,
        cellEditor: "文本框",
        cellRenderer: function (params) {
            return itemtypeRenderer(params)
        }
    }, {
        headerName: "版本",
        field: "isvirtual",
        width: 80,
        cellStyle: {
            'font-style': 'normal'
        }
    }, {
        headerName: "大小",
        field: "oldsize",
        width: 100,
        cellStyle: {
            'font-style': 'normal'
        }
    }, {
        headerName: "时间",
        field: "createtime",
        width: 100,
        cellEditor: "时分秒",
        cellStyle: {
            'font-style': 'normal'
        }
    }, {
        headerName: "用户",
        field: "creator",
        width: 100,
        cellEditor: "文本框",
        cellStyle: {
            'font-style': 'normal'
        }
    }];

    var setting = {
        async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
                "id": 108
            },
            dataFilter: filter
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: beforeExpand,
            onClick: menuShowNode
        }
    };

    function beforeExpand(treeId, treeNode) {
        if (treeNode.children) {
            return;
        }
        var postdata = treeNode
        BasemanService.RequestPost('scpfdr', 'selectref', postdata)
            .then(function (data) {
                data.children = data.fdrs;
                if (data.children) {
                    treeNode.children = [];
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                    for (var i = 0; i < data.children.length; i++) {
                        data.children[i].isParent = true;
                        data.children[i].name = data.children[i].fdrname
                        data.children[i].pId = parseInt(treeNode.id);
                        data.children[i].id = parseInt(data.children[i].fdrid)
                        data.children[i].item_type = 1;
                        $scope.zTree.addNodes(treeNode, data.children[i])
                    }
                    $scope.options.api.setRowData(data.children);
                }

            });
    }

    function filter(treeId, parentNode, childNodes) {
        return null;
    }

    //单击节点 显示节点
    function menuShowNode() {
        var node = $scope.zTree.getSelectedNodes()[0];
        $scope.selectfdr(node);
    }

    //刷新节点
    $scope.selectfdr = function (node) {
        if (node.id == 0) {
            $scope['options'].api.setRowData($scope.data.fdrs_levelOne);
        } else {

            var postdata = {};
            for (name in node) {
                if (name != 'children') {
                    postdata[name] = node[name];
                }
            }
            postdata.flag = 1;
            BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                .then(function (data) {
                    //如果是文件，那么提前放到左边的父类文件夹中
                    if (data.fdrs) {
                        if (!node.children) {
                            var children = [];
                            for (var i = 0; i < data.fdrs.length; i++) {
                                data.fdrs[i].isParent = true;
                                data.fdrs[i].pId = node.id;
                                data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                                data.fdrs[i].item_type = 1;
                                data.fdrs[i].name = data.fdrs[i].fdrname;
                                children.push(data.fdrs[i]);
                            }
                            $scope.zTree.addNodes(node, [0], children, true)
                        }

                    }
                    for (var i = 0; i < data.docs.length; i++) {
                        data.docs[i].name = data.docs[i].docname;
                    }
                    for (var i = 0; i < data.fdrs.length; i++) {
                        data.fdrs[i].name = data.fdrs[i].fdrname;
                        data.fdrs[i].item_type = 1;
                    }
                    $scope.data.currItem.files = data.fdrs.concat(data.docs);
                    $scope['options'].api.setRowData($scope.data.currItem.files);
                });
        }
    }
    BasemanService.RequestPost('scpworkspace', 'selectref', {
        wsid: -4,
        sysuserid: window.userbean.sysuserid
    })
        .then(function (data) {
            var zNodes = {
                icon: '/web/img/computer.png'
            };
            if (userbean.userauth.admins) {
                zNodes.objaccess = '2222222';
            }
            zNodes.name = '公司文档'
            zNodes.id = 0;
            zNodes.isParent = true;
            zNodes.fdrid = 0;
            $scope.data.fdrs_levelOne = data.fdrs
            data.children = data.fdrs;

            for (var i = 0; i < data.children.length; i++) {
                data.children[i].isParent = true;
                data.children[i].name = data.children[i].fdrname;
                //文件夹的时候设置为1
                data.children[i].item_type = 1;
                data.children[i].id = parseInt(data.children[i].fdrid);
            }
            zNodes.children = data.children;

            zTree = $.fn.zTree.init($("#treeDemo_frm"), setting, zNodes);
            $scope.zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
            rMenu = $("#rMenu");

            //展开根节点
            zTree.expandNode(zTree.getNodes()[0], true, false, false);
        });
}

//弹出框个人文件
function myfiles($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, $modalInstance) {
    //继承基类方法
    myfiles = HczyCommon.extend(myfiles, ctrl_bill_public);
    myfiles.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $modalInstance]);

    $scope.data = {};
    $scope.data.currItem = {};
    $scope.ok = function () {
        var data = $scope.gridGetSelectedData('options');
        $modalInstance.close(data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.rowDoubleClicked = function (e) {
        var data = $scope.gridGetRow('options');
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        var postdata = {};
        for (name in e.data) {
            if (name != 'children') {
                postdata[name] = e.data[name];
            }
        }
        if (data.docid) {
            //域名
            var net = window.location.href
            $scope.viewDoc(data, net);
            BasemanService.RequestPost('file', 'getdownstatus', data)
                .then(function (res) {
                    //
                })
            //是工作去区和回收站时
        } else {
            if (e.data.wsid) {
                var classname = 'scpworkspace'
            } else {
                var classname = 'scpfdr'
            }
            BasemanService.RequestPost(classname, 'selectref', postdata)
                .then(function (data) {
                    if (data.shortcuts && data.shortcuts.length > 0) {
                        for (var i = 0; i < data.shortcuts.length; i++) {
                            data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                            data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                        }
                        data.fdrs = data.shortcuts;
                        data.children = data.shortcuts;
                    } else {
                        data.children = data.fdrs;
                    }
                    var treeNode = $scope.zTree.getNodesByParam("id", e.data.fdrid, null);
                    //var treeNode = zTree.getNodesByParam("id",e.data.id,null);
                    $scope.zTree.selectNode(treeNode[0]);
                    if (data.children) {

                        //treeNode[0].children=[];

                        for (var i = 0; i < data.fdrs.length; i++) {
                            data.fdrs[i].name = data.fdrs[i].fdrname;
                            data.fdrs[i].item_type = 1;
                            if (data.fdrs[i].creator == userbean.userid) {
                                data.fdrs[i].objaccess = '2222222';
                            }
                        }
                        if (data.docs) {
                            for (var i = 0; i < data.docs.length; i++) {
                                data.docs[i].name = data.docs[i].docname;
                                if (data.docs[i].creator == userbean.userid) {
                                    data.docs[i].objaccess = '2222222';
                                }
                            }
                            $scope.data.currItem.files = data.fdrs.concat(data.docs);
                            ;
                        } else {
                            $scope.data.currItem.files = data.fdrs;
                        }

                        if (!treeNode.children) {
                            for (var i = 0; i < data.children.length; i++) {
                                data.children[i].isParent = true;
                                data.children[i].name = data.children[i].fdrname
                                data.children[i].pId = parseInt(treeNode.id);
                                data.children[i].id = parseInt(data.children[i].fdrid)
                                data.children[i].item_type = 1;
                                //zTree.addNodes(treeNode,data.children[i])
                            }
                        }
                        $scope.zTree.expandNode(treeNode[0], true, false, true, true);
                        $timeout(
                            function () {
                                $scope.options.api.setRowData($scope.data.currItem.files)
                            }, 250
                        )

                    }

                });
        }

    }
    $scope.options = {
        rowDoubleClicked: $scope.rowDoubleClicked,
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        rowDeselection: true,
        rowHeight: 25,
        getNodeChildDetails: function (file) {
            if (file.group) {
                file.group = file.group;
                return file;
            } else {
                return null;
            }
        },
        enableColResize: true,
        icons: {
            groupExpanded: '<i class="fa fa-minus-square-o"/>',
            groupContracted: '<i class="fa fa-plus-square-o"/>',
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    function imageRenderer(params) {
        if (params.data.item_type == 1) {
            return "<img src='/web/img/file.png'>" + params.data[params.colDef.field];
        } else {
            var classname = HczyCommon.getAttachIcon(params.value);
            var plus = '';
            if (parseInt(params.data.wfid) > 0) {
                plus += ';background-color:#5de466';
            }
            if (parseInt(params.data.stat) == 8) {
                plus += ';background-color:#e2e20e';
            }

            var color = '';
            if (classname == 'fa-file-pdf-o') {
                color = 'style="color:#8c0404' + plus + '"';
            } else if (classname == 'fa-file-excel-o') {
                color = 'style="color:green' + plus + '"'
            } else if (classname == 'fa-file-word-o') {
                color = 'style="color:#0808de' + plus + '"'
            } else if (classname == 'fa-file-powerpoint-o') {
                color = 'style="color:red' + plus + '"'
            } else if (classname == 'fa-file-image-o') {
                color = 'style="color:blue' + plus + '"';
            } else {
                color = 'style="' + plus + '"';
            }
            /**if(){
						//return '<span class="fa-stack fa-lg"><i class="fa '+classname+' fa-stack-2x"></i><i class="fa fa-flag fa-stack-1x fa-inverse"'+'style="color:red"'+'></i></span>'
						return '<i '+color+' background-color: rgb(255, 255, 0) '+' class="fa '+classname+' fa-lg">'+'</i>'+params.data[params.colDef.field];
					}else{

					}*/
            return '<i class="fa ' + classname + ' fa-lg"' + color + '>' + '</i>' + params.data[params.colDef.field];

        }
    }

    function itemtypeRenderer(params) {
        if (parseInt(params.value) == 1) {
            return '文件夹';
        } else {
            doc = params.data;
            if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                return '图片文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
                return 'word 文件'
            } else if (doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
                return 'excel 文件'
            } else if (doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
                return '文本文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                return 'PPT 文件'
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                return 'pdf 文件'
            } else {
                return '其它文件'
            }

        }
    }

    /**网格配置*/
    {
        $scope.columns = [{
            headerName: "名称",
            field: "name",
            width: 280,
            onclick: $scope.rowClicked,
            //cellClass:function(params){return cellClassf(params)},
            cellRenderer: function (params) {
                return imageRenderer(params)
            },
            //cellClass: 'fa fa-file-excel-o'

        }, {
            headerName: "类型",
            field: "item_type",
            width: 100,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return itemtypeRenderer(params)
            }
        }, {
            headerName: "版本",
            field: "isvirtual",
            width: 80,
            cellStyle: {
                'font-style': 'normal'
            }
        }, {
            headerName: "大小",
            field: "oldsize",
            width: 100,
            cellStyle: {
                'font-style': 'normal'
            }
        }, {
            headerName: "时间",
            field: "createtime",
            width: 100,
            cellEditor: "时分秒",
            cellStyle: {
                'font-style': 'normal'
            }
        }, {
            headerName: "用户",
            field: "creator",
            width: 100,
            cellEditor: "文本框",
            cellStyle: {
                'font-style': 'normal'
            }
        }];
    }

    function cellClassf(params) {
        if (params.data.item_type != 1) {
            var classname = HczyCommon.getAttachIcon(params.value);
            return 'fa ' + classname;
        }
    }

    var setting = {
        async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
                "id": 108
            },
            dataFilter: filter
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeExpand: beforeExpand,
            //onAsyncSuccess: onAsyncSuccess,//回调函数，在异步的时候，进行节点处理（有时间延迟的），后续章节处理
            onClick: menuShowNode
        }
    };

    function beforeExpand(treeId, treeNode) {
        if (treeNode.children) {
            return;
        }
        if (treeNode.wsid) {
            var classname = 'scpworkspace'
        } else {
            var classname = 'scpfdr'
        }
        var postdata = treeNode;
        postdata.excluderight = 1;
        var obj = BasemanService.RequestPostNoWait(classname, 'selectref', postdata)
        var data = obj.data
        if (data.shortcuts && data.shortcuts.length > 0) {
            for (var i = 0; i < data.shortcuts.length; i++) {
                data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                data.shortcuts[i].fdrid = data.shortcuts[i].refid;
            }
            data.children = data.shortcuts;
        } else {
            data.children = data.fdrs;
        }

        if (data.children) {
            treeNode.children = [];
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
            for (var i = 0; i < data.children.length; i++) {
                data.children[i].isParent = true;
                data.children[i].name = data.children[i].fdrname
                data.children[i].pId = parseInt(treeNode.id);
                data.children[i].id = parseInt(data.children[i].fdrid)
                data.children[i].item_type = 1;
                if (data.children[i].creator == userbean.userid) {
                    data.children[i].objaccess = treeNode.objaccess;
                }

                //zTree.addNodes(treeNode,data.children[i])
            }
            $scope.zTree.addNodes(treeNode, [0], data.children, true)
            //zTree.expandNode(treeNode, true, false, false);

            $scope.options.api.setRowData(data.children);
        }
    }

    function filter(treeId, parentNode, childNodes) {
        return null;
        /**for (var i=0, l=childNodes.length; i<l; i++) {
			childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
		}
         return childNodes;*/
    }

    function ajaxGetNodes(treeNode, reloadType) {
        //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        if (reloadType == "refresh") {
            $scope.zTree.updateNode(treeNode);
        }
    }

    //单击节点 显示节点
    function menuShowNode() {
        //$scope['options'].api.setRowData([{docid:17872,docname:"600-300.png"}]);
        //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        var node = $scope.zTree.getSelectedNodes()[0];
        if (node.id == 0) {
            $scope['options'].api.setRowData($scope.data.fdrs_levelOne);
        } else if (node.wsid) {
            var postdata = {};
            for (name in node) {
                if (name != 'children') {
                    postdata[name] = node[name];
                }
            }
            postdata.excluderight = 1;
            BasemanService.RequestPost('scpworkspace', 'selectref', postdata)
                .then(function (data) {
                    //如果是文件，那么提前放到左边的父类文件夹中
                    if (data.fdrs.length > 0) {
                        if (!node.children) {
                            var children = [];
                            for (var i = 0; i < data.fdrs.length; i++) {
                                data.fdrs[i].isParent = true;
                                data.fdrs[i].pId = node.id;
                                data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                                data.fdrs[i].item_type = 1;
                                data.fdrs[i].name = data.fdrs[i].fdrname;
                                children.push(data.fdrs[i]);
                            }
                            $scope.zTree.addNodes(node, [0], children, true)
                        }
                        for (var i = 0; i < data.fdrs.length; i++) {
                            data.fdrs[i].name = data.fdrs[i].fdrname;
                            data.fdrs[i].item_type = 1;
                        }
                        $scope.data.currItem.files = data.fdrs;
                    }
                    if (data.shortcuts.length > 0) {
                        if (!node.children || node.children.length == 0) {
                            var children = [];
                            for (var i = 0; i < data.shortcuts.length; i++) {
                                data.shortcuts[i].isParent = true;
                                data.shortcuts[i].pId = node.id;
                                data.shortcuts[i].id = parseInt(data.shortcuts[i].refid);
                                data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                                data.shortcuts[i].item_type = 1;
                                data.shortcuts[i].name = data.shortcuts[i].scname;
                                data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                                children.push(data.shortcuts[i]);

                            }
                            $scope.zTree.addNodes(node, [0], children, true)
                        }
                        for (var i = 0; i < data.shortcuts.length; i++) {
                            data.shortcuts[i].name = data.shortcuts[i].scname;
                            data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                            data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                            data.shortcuts[i].item_type = 1;

                        }
                        $scope.data.currItem.files = data.shortcuts;
                    }
                    $scope['options'].api.setRowData($scope.data.currItem.files);
                });
        } else {

            $scope.selectfdr(node);
        }
    }

    $scope.selectfdr = function (node) {

        var postdata = {};
        for (name in node) {
            if (name != 'children') {
                postdata[name] = node[name];
            }
        }
        postdata.flag = 1;
        BasemanService.RequestPost('scpfdr', 'selectref', postdata)
            .then(function (data) {
                //如果是文件，那么提前放到左边的父类文件夹中
                if (data.fdrs) {
                    if (!node.children) {
                        var children = [];
                        for (var i = 0; i < data.fdrs.length; i++) {
                            data.fdrs[i].isParent = true;
                            data.fdrs[i].pId = node.id;
                            data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                            data.fdrs[i].item_type = 1;
                            data.fdrs[i].name = data.fdrs[i].fdrname;
                            children.push(data.fdrs[i]);
                            if (data.fdrs[i].creator == userbean.userid) {
                                data.fdrs[i].objaccess = node.objaccess;
                            }
                        }
                        $scope.zTree.addNodes(node, [0], children, true)
                    }

                }
                for (var i = 0; i < data.docs.length; i++) {
                    data.docs[i].name = data.docs[i].docname;
                    if (data.docs[i].creator == userbean.userid) {
                        data.docs[i].objaccess = node.objaccess;
                    }
                }
                for (var i = 0; i < data.fdrs.length; i++) {
                    data.fdrs[i].name = data.fdrs[i].fdrname;
                    data.fdrs[i].item_type = 1;
                }
                $scope.data.currItem.files = data.fdrs.concat(data.docs);
                $scope['options'].api.setRowData($scope.data.currItem.files);
            });
    }
    BasemanService.RequestPost('scpworkspace', 'selectall', {
        wstype: 4,
        userid: window.userbean.userid,
        modid: 933,
        sysuserid: window.userbean.sysuserid
    })
        .then(function (data) {
            //var  post   =data.workspaces[1]
            var zNodes = {
                icon: "/web/img/file_01.png"
            };
            zNodes.name = window.userbean.userid + "的文件管理";
            if (userbean.userauth.admins) {
                zNodes.objaccess = '2222222';
            }
            //zNodes.name = '公司文档'
            zNodes.id = 0;
            zNodes.isParent = true;
            zNodes.fdrid = 0;
            $scope.data.fdrs_levelOne = data.workspaces
            data.children = data.workspaces;

            for (var i = 0; i < data.children.length; i++) {
                data.children[i].isParent = true;
                data.children[i].name = data.children[i].wsname;
                //文件夹的时候设置为1
                data.children[i].item_type = 1;
                data.children[i].id = parseInt(i + 1);
                data.children[i].fdrid = parseInt(i + 1);
                data.children[i].icon = '/web/img/computer.png';
                data.children[i].objaccess = '2222222';
            }
            zNodes.children = data.children;
            $scope.tree_data = zNodes;
            $timeout(function () {
                if ($scope.data.currItem.tree_datas) {
                    $scope.tree_data = $scope.data.currItem.tree_datas;
                }
                zTree = $.fn.zTree.init($("#treeDemo_frm"), setting, $scope.tree_data);
                if ($scope.data.currItem.selectNode) {
                    zTree.selectNode($scope.data.currItem.selectNode[0]);
                }

                $scope.zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                //展开根节点
                zTree.expandNode(zTree.getNodes()[0], true, false, false);
            }, 100)
        });


}