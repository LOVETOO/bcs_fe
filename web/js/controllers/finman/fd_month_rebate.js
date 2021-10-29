/**
 * 客户返利结果
 * @since 2018-05-24
 */
HczyCommon.mainModule().controller('fd_month_rebate', function ($scope, $q, BasemanService, AgGridService, Magic, BillService, $state) {

    $scope.data = {
        isSearch: $state.current.name === 'finman.fd_month_rebate_search'
    };

    /**
     * 业务类名
     * @return {string} 业务类名
     */
    function classId() {
        return 'fd_month_rebate';
    }

    /**
     * ID字段名
     * @return {string}
     */
    function idField() {
        return 'mr_id';
    }

    /**
     * 关联对象名
     * @return {string}
     */
    function dataRelationName() {
        return classId() + 's';
    }

    /**
     * 取关联对象
     * @param biz
     * @return {Array}
     */
    function dataRelationOf(biz) {
        return biz[dataRelationName()];
    }

    /**
     * 设置关联对象
     * @param biz
     * @param data
     * @return {biz}
     */
    function setDataRelation(biz, data) {
        biz[dataRelationName()] = data;
        return biz;
    }

    $scope.head = {
        year: new Date().getFullYear()
    };

    function head() {
        return $scope.head;
    }

    /**
     * 列定义
     * @type {Array}
     */
    var rebateColumns = [];
    var columnOfLastBalance = null;
    var columnOfCurrBalance = null;
    //列处理
    (function () {

        /**
         * 金额格式化器
         * @param row
         * @param cell
         * @param value
         * @param column
         * @param rowData
         */
        function moneyFormatter(row, cell, value, column, rowData) {
            if (angular.isDefined(value)) {
                var result = Slick.Formatters.Money(row, cell, value, column, rowData);
                if (angular.isDefined(result)) return result;
                return value;
            }

            return '';
        }

        /**
         * 余额格式化器
         * @param row
         * @param cell
         * @param value
         * @param column
         * @param rowData
         */
        function balanceFormatter(row, cell, value, column, rowData) {
            var color;

            if (value > 0)
                color = 'green';
            else if (value < 0)
                color = 'red';
            else
                color = 'black';

            return '<span style="color:' + color + ';">'
                + moneyFormatter(row, cell, value, column, rowData)
                + '</span>';
        }

        /**
         * 金额单元格样式
         * @param {Object} params
         * @return {Object}
         */
        function moneyCellStyle(params) {
            var style = rebateOptions.hcApi.getDefaultCellStyle(params);

            angular.extend(style, rebateOptions.columnTypes['金额'].cellStyle(params));

            var numValue = Magic.toNum(params.value);
            if (numValue > 0)
                style.color = 'green';
            else if (numValue < 0)
                style.color = 'red';
            else
                style.color = 'black';

            return style;
        }

        columnOfLastBalance = {
            field: 'last_balance',
            //name: '去年返利余额',
            headerName: '去年返利余额',
            //formatter: balanceFormatter,
            width: 120,
            type: '金额',
            cellStyle: moneyCellStyle,
            pinned: 'left'
            //cssClass: 'amt'
        };

        //rebateColumns.push(SlickGridService.columnSeq());
        rebateColumns.push({
            type: '序号'
        });

        if (!$scope.data.isSearch)
            rebateColumns.push({
                //name: '操作',
                headerName: '操作',
                width: 100,
                pinned: 'left',
                //cssClass: 'uid',
                /*formatter: function () {
                    if (head().locked)
                        return '<span style="color:grey;">已关闭</span>';
                    return '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top:1px;padding-bottom:1px;margin-bottom:1px;">删除</button>';
                }*/
                cellRenderer: function (params) {
                    if (head().locked)
                        return '<span style="color:grey;">已关闭</span>';

                    var divHtml = '<div>\
                        <a style="color:#FF9F36;">删除</a>\
                        </div>';

                    var div = $(divHtml);

                    div.find(':contains(删除)').click(function (event) {
                        var node = rebateOptions.hcApi.getFocusedNode();
                        var nodeData = node.data;

                        Magic.swalConfirmThenSuccess({
                            title: '确定要删除客户/运营中心【' + nodeData.customer_name + '】的返利记录吗？',
                            //okTitle: '成功删除',
                            okFun: function () {
                                return $q
                                    .when(nodeData[idField()])
                                    .then(function (id) {
                                        //若有ID，则需发请求删除
                                        if (id) return rqDelete(id);
                                    })
                                    .then(function () {
                                        rebateData.splice(Number(node.id), 1);
                                        rebateOptions.hcApi.setRowData(rebateData);
                                    });
                            }
                        });
                    });

                    div.children().css('padding', '4px');

                    return div[0];
                }
            });

        rebateColumns.push({
            field: 'customer_name',
            //name: '名称',
            headerName: '名称',
            width: 300,
            pinned: 'left'
        }, {
            field: 'type',
            //name: '类型',
            headerName: '类型',
            //formatter: Slick.Formatters.SelectOption,
            /*options: [{
                value: '1',
                desc: '客户'
            }, {
                value: '2',
                desc: '运营中心'
            }],*/
            type: '词汇',
            cellEditorParams: {
                values: ['1', '2'],
                names: ['客户', '运营中心']
            },
            //cssClass: 'uid',
            width: 70,
            pinned: 'left'
        }, columnOfLastBalance);

        //1到12月的返利和实返
        (function () {
            var sameOption = {
                width: 100,
                type: '金额',
                cellStyle: moneyCellStyle,
                editable: function (params) {
                    return head().locked !== 2 && !$scope.data.isSearch;
                },
                onCellValueChanged: function (params) {
                    if (params.newValue == params.oldValue)
                        return;

                    params.data.changed = true; //标记该行已改变

                    //余额，从去年余额开始计算
                    var balance = Magic.toNum(params.data.last_balance);

                    Magic
                        .forMonth(function (month) {
                            var key = 'in' + month;

                            var cellValue = params.data[key];

                            //余额增加
                            if (Magic.isNum(cellValue) || Magic.isStrOfNum(cellValue)) {
                                var value = Magic.toNum(cellValue);
                                params.data[key] = value;
                                balance += value;
                            }
                            else
                                params.data[key] = '';

                            key = 'out' + month;

                            cellValue = params.data[key];

                            //余额减少
                            if (Magic.isNum(cellValue) || Magic.isStrOfNum(cellValue)) {
                                value = Magic.toNum(cellValue);
                                params.data[key] = value;
                                balance += value;
                            }
                            else
                                params.data[key] = '';
                        });

                    params.data.curr_balance = balance;

                    params.api.refreshView();
                }
                //editor: Slick.Editors.Text,
                //cssClass: 'amt'
            };

            /**
             *
             * @param {boolean} isIncome
             * @return {Function}
             */
            /*function getFormatter(isIncome) {
                return function (row, cell, value, column, rowData) {
                    return '<span style="color:'
                        + (isIncome ? 'green' : 'red')
                        + ';">'
                        + moneyFormatter(row, cell, value, column, rowData)
                        + '</span>';
                };
            }*/

            var inFormatter = balanceFormatter; //getFormatter(true); //收入格式化器
            var outFormatter = balanceFormatter; //getFormatter(false); //支出格式化器

            Magic
                .forMonth(function (month) {
                    var inColumn = angular.extend({
                        field: 'in' + month,
                        //name: month + '月返利',
                        headerName: month + '月返利'
                        //formatter: inFormatter
                    }, sameOption);

                    rebateColumns.push(inColumn);
                });

            Magic
                .forMonth(function (month) {
                    var outColumn = angular.extend({
                        field: 'out' + month,
                        //name: month + '月实返',
                        headerName: month + '月实返'
                        //formatter: outFormatter
                    }, sameOption);

                    rebateColumns.push(outColumn);
                });
        })();

        columnOfCurrBalance = {
            field: 'curr_balance',
            //name: '今年返利余额',
            headerName: '今年返利余额',
            //formatter: balanceFormatter,
            width: 120,
            type: '金额',
            cellStyle: moneyCellStyle,
            pinned: 'right'
            //cssClass: 'amt'
        };

        rebateColumns.push(columnOfCurrBalance);

        if (!$scope.data.isSearch)
            rebateColumns.push({
                field: 'creator',
                //name: '创建人',
                headerName: '创建人',
                width: 80
            }, {
                field: 'createtime',
                //name: '创建时间',
                headerName: '创建时间',
                width: 160
            }, {
                field: 'updator',
                //name: '修改人',
                headerName: '修改人',
                width: 80
            });
        
        rebateColumns.push({
            field: 'updatetime',
            //name: '修改时间',
            headerName: '修改时间',
            width: 160
        });

        //设置列ID和字段名一致
        /*rebateColumns
            .forEach(function (column) {
                if (!column.id)
                    column.id = column.field;
            });*/
    })();

    /**
     * 表格选项
     * @type {Object}
     */
    /*var rebateOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };*/

    /**
     * 表格选项
     * @type {Object}
     */
    var rebateOptions = {
        columnDefs: rebateColumns
    };

    AgGridService.createAgGrid('headerGrid', rebateOptions);

    /**
     * 表格
     * @type {Slick.Grid}
     */
    //var grid = new Slick.Grid("#headerGrid", [], rebateColumns, rebateOptions);

    /**
     * 表格单击事件
     */
    /*grid.onClick.subscribe(function (event, args) {
        var jqTarget = $(event.target);

        var stop = true;
        //删除
        if (jqTarget.hasClass('delbtn')) {
            var rowData = grid.getDataItem(args.row);

            Magic.swalConfirmThenSuccess({
                title: '确定要删除客户【' + rowData.customer_name + '】的返利记录吗？',
                //okTitle: '成功删除',
                okFun: function () {
                    return $q
                        .when(rowData[idField()])
                        .then(function (id) {
                            //若有ID，则需发请求删除
                            if (id) return rqDelete(id);
                        })
                        .then(function () {
                            //删除表格数据
                            SlickGridService.setData({
                                grid: grid,
                                type: 'splice',
                                index: args.row,
                                deleteCount: 1
                            });
                        });
                }
            });
        }
        else
            stop = false;

        if (stop) event.stopImmediatePropagation();
    });*/

    /**
     * 表格双击事件
     */
    /*grid.onDblClick.subscribe(function (event, args) {
        console.info(args.grid.getDataItem(args.row));
    });*/

    /**
     * 表格单元格改变事件
     */
    /*grid.onCellChange.subscribe(function (event, args) {
        args.item.changed = true; //标记该行已改变

        //余额，从去年余额开始计算
        var balance = Magic.toNum(args.item.last_balance);

        Magic
            .forMonth(function (month) {
                var key = 'in' + month;

                var cellValue = args.item[key];

                //余额增加
                if (Magic.isNum(cellValue) || Magic.isStrOfNum(cellValue)) {
                    var value = Magic.toNum(cellValue);
                    args.item[key] = value;
                    balance += value;
                }
                else
                    args.item[key] = '';

                key = 'out' + month;

                cellValue = args.item[key];

                //余额减少
                if (Magic.isNum(cellValue) || Magic.isStrOfNum(cellValue)) {
                    value = Magic.toNum(cellValue);
                    args.item[key] = value;
                    balance += value;
                }
                else
                    args.item[key] = '';
            });

        args.item.curr_balance = balance;

        grid.updateRow(args.row);
    });*/

    $scope.addCustomer = addCustomer;

    /**
     * 添加客户/运营中心
     * @param {number} type 类型：1=客户、2=运营中心
     * @return {Promise}
     */
    function addCustomer(type) {
        return $q
            .when()
            //选择
            .then(function () {
                var args = {
                    scope: $scope,
                    checkBox: true
                };

                //根据类型使用不同的选择器
                switch (type) {
                    case 1: //客户
                        args.sqlWhere = 'customer_type = 3'; //只选独立经销商
                        return BasemanService.chooseCustomer(args);
                    case 2: //运营中心
                        return BasemanService.chooseOpCenter(args);
                    default:
                        return $q.reject('未确定类型');
                }
            })
            .then(function (chosenCustomers) {
                if (!chosenCustomers.length)
                    return $q.reject('未选择任何客户/运营中心');

                var sType = type.toString();

                //映射字段
                chosenCustomers = chosenCustomers
                    .map(function (chosenCustomer) {
                        var obj = {
                            type: sType, //类型
                            year: head().year, //年份
                            last_balance: 0, //去年余额
                            curr_balance: 0 //当年余额
                        };

                        var assignRel; //赋值关系

                        switch (type) {
                            case 1: //客户
                                assignRel = [
                                    'customer_id',
                                    'customer_code',
                                    'customer_name'
                                ];

                                break;
                            case 2: //运营中心
                                assignRel = {
                                    'dept_id': 'customer_id',
                                    'dept_code': 'customer_code',
                                    'dept_name': 'customer_name'
                                };

                                break;
                        }

                        Magic.assignProperty(chosenCustomer, obj, assignRel);

                        return obj;
                    });

                //表格里的客户/运营中心列表
                var gridCustomers = rebateData
                    .filter(function (rowData) {
                        return rowData.type == type;
                    })
                ;

                //实际增加的客户/运营中心
                var addCustomers = chosenCustomers
                    .filter(function (chosenCustomer) {
                        //过滤掉已有的记录
                        return gridCustomers
                            .every(function (gridCustomer) {
                                //被选择的客户/运营中心不能和表格里的重复
                                return gridCustomer.customer_id != chosenCustomer.customer_id;
                            });
                    });

                if (addCustomers.length) {
                    Array.prototype.push.apply(rebateData, addCustomers);
                    rebateOptions.hcApi.setRowData(rebateData);
                }

                if (chosenCustomers.length !== addCustomers.length) {
                    var typeName;
                    switch (type) {
                        case 1:
                            typeName = '客户';
                            break;
                        case 2:
                            typeName = '运营中心';
                            break;
                    }

                    Magic.swalInfo({
                        title: '您选择了<b>' + chosenCustomers.length + '</b>个' + typeName + '<br>'
                        + '其中有<b>' + (chosenCustomers.length - addCustomers.length) + '</b>个原本就在表格中<br>'
                        + '所以，' + (addCustomers.length ? ('实际只添加了<b>' + addCustomers.length + '</b>个' + typeName) : '实际没有添加' + typeName),
                        confirmButtonText: '我知道了',
                        html: true,
                        timer: null
                    });
                }
            });
    }

    BasemanService.initGird();

    $scope.searchData = clickToSearch;

    /**
     * 主动搜索数据
     * @return {Promise}
     */
    function clickToSearch() {
        return askForSave()
            .then(searchData)
            .then(function () {
                BasemanService.notice('查询成功！');
            });
    }

    /**
     * 获取尚未保存的数据
     * @return {Promise}
     */
    function getUnSavedDataQ() {
        /*if (grid.getEditorLock().isActive()) {
            if (!grid.getEditorLock().commitCurrentEdit()) {
                Magic.swalInfo('请正确填写数据');
                return $q.reject();
            }
        }*/

        rebateOptions.api.stopEditing();

        return $q.resolve(rebateData
            .filter(function (rowData, index) {
                var result = !rowData[idField()] || rowData.changed;
                if (result) rowData.seq = index;
                return result;
            }));
    }

    /**
     * 搜索请求
     * @param postData 请求数据
     * @return {Promise}
     */
    function rqSearch(postData) {
        if(!postData) {
            postData = {};
        }
        if(!postData.year) {
            postData.year = head().year;
        }
        if(!postData.sqlwhere) {
            postData.sqlwhere = $scope.sqlwhere;
        }
        postData.searchflag = $scope.data.isSearch ? 2 : 0;
        return BasemanService.RequestPost(classId(), 'search', postData);
    }

    /**
     * 搜索数据
     * @return {Promise}
     */
    function searchData(postData) {
        return rqSearch(postData).then(setData);
    }

    /**
     * 刷新数据
     * @return {Promise}
     */
    $scope.reflashData = function(postData) {
        $scope.sqlwhere = "";
        return askForSave()
            .then(function () {
                return postData;
            })
            .then(searchData);
    };

    var rebateData;

    /**
     * 设置数据
     * @param data
     */
    function setData(data) {
        lock(data.locked === 2);

        columnOfLastBalance.name = data.year - 1 + '年返利余额';
        columnOfCurrBalance.name = data.year + '年返利余额';

        // grid.updateColumnHeader(columnOfLastBalance.id, columnOfLastBalance.name);
        // grid.updateColumnHeader(columnOfCurrBalance.id, columnOfCurrBalance.name);
        rebateOptions.api.set();

        /*SlickGridService.setData({
            grid: grid,
            data: dataRelationOf(data)
        });*/

        rebateData = dataRelationOf(data);

        rebateOptions.hcApi.setRowData(rebateData);
    }

    /**
     * 询问保存
     * @return {Promise}
     */
    function askForSave() {
        var shouldSave;

        return $q.when()
            .then(getUnSavedDataQ)
            .then(function (data) {
                shouldSave = data.length > 0;

                if (shouldSave) {
                    return Magic.swalConfirm({
                        title: '数据尚未保存，是否保存？',
                        confirmButtonText: '保存',
                        cancelButtonText: '暂不保存，继续编辑',
                        closeOnConfirm: false
                    });
                }
            })
            .then(function () {
                if (shouldSave) return saveData();
            });
    }

    /**
     * 保存请求
     * @params {Array} dataArray
     * @return {Promise}
     */
    function rqSave(dataArray) {
        var postData = setDataRelation({
            year: head().year
        }, dataArray);

        return BasemanService.RequestPost(classId(), 'save', postData);
    }

    $scope.saveData = saveData;

    /**
     * 保存数据
     * @return {Promise}
     */
    function saveData() {
        return $q.when()
            .then(getUnSavedDataQ)
            .then(function (needSaveData) {
                if (!needSaveData.length) {
                    var msg = '尚未修改任何数据，无需保存';
                    Magic.swalInfo(msg);
                    return $q.reject(msg);
                }

                return angular.copy(needSaveData);
            })
            .then(rqSave)
            .then(function (data) {
                var newData = dataRelationOf(data);

                //var gridData = grid.getData();

                newData.forEach(function (newRowData) {
                    rebateData[newRowData.seq] = newRowData;
                });

                /*SlickGridService.setData({
                    grid: grid,
                    data: gridData
                });*/
                rebateOptions.hcApi.setRowData(rebateData);

                return Magic.swalSuccess('保存成功');
            });
    }

    /**
     * 删除请求
     * @param id
     * @return {Promise}
     */
    function rqDelete(id) {
        var postData = {};
        postData[idField()] = id;
        return BasemanService.RequestPost(classId(), 'delete', postData);
    }

    $scope.lastYear = lastYear;

    /**
     * 上一年
     * @return {Promise}
     */
    function lastYear() {
        return askForSave()
            .then(function () {
                return rqLastYear(head().year);
            })
            .then(setData)
            .then(function () {
                head().year--;
            });
    }

    /**
     * 上一年的请求
     * @param year
     * @return {Promise}
     */
    function rqLastYear(year) {
        return BasemanService.RequestPost(classId(), 'last_year', {
            year: year,
            searchflag: $scope.data.isSearch ? 2 : 0
        });
    }

    $scope.nextYear = nextYear;

    /**
     * 下一年
     * @return {Promise}
     */
    function nextYear() {
        return askForSave()
            .then(function () {
                if (head().locked) return;

                return closeYear({
                    title: head().year + '年尚未关闭，必须关闭后才能开启' + (head().year + 1) + '年，确定关闭吗？'
                });
            })
            .then(function () {
                return rqNextYear(head().year);
            })
            .then(setData)
            .then(function () {
                head().year++;
            });
    }

    /**
     * 下一年的请求
     * @param year
     * @return {Promise}
     */
    function rqNextYear(year) {
        return BasemanService.RequestPost(classId(), 'next_year', {
            year: year,
            searchflag: $scope.data.isSearch ? 2 : 0
        });
    }

    /**
     * 锁定或解锁界面
     * @param locked
     */
    function lock(locked) {
        head().locked = locked ? 2 : 0;

        /*grid.setOptions({
            editable: !locked && !$scope.data.isSearch
        });

        grid.invalidate();*/
    }

    $scope.closeYear = closeYear;

    /**
     * 关闭年度
     */
    function closeYear(args) {
        if ($scope.data.isSearch){
            //Magic.swalInfo('下一年尚未开启');
            return $q.reject();
        }

        if (head().locked) {
            Magic.swalInfo('年度已关闭');
            return $q.reject();
        }

        return Magic
            .swalConfirm({
                title: args && args.title ? args.title : '确定要关闭' + head().year + '年度吗？',
                closeOnConfirm: false
            })
            .then(function () {
                lock(true); //锁定界面
            })
            .then(function () {
                return rqLockYear(head().year); //锁定当年
            })
            .then(function () {
                return rqUnlockYear(head().year + 1); //解锁下一年
            })
            .then(function () {
                return Magic.swalSuccess('成功关闭');
            });
    }

    /**
     * 锁定年份的请求
     * @param year
     * @return {Promise}
     */
    function rqLockYear(year) {
        return BasemanService.RequestPost(classId(), 'lock_year', {
            year: year
        });
    }

    /**
     * 解锁年份的请求
     * @param year
     * @return {Promise}
     */
    function rqUnlockYear(year) {
        return BasemanService.RequestPost(classId(), 'unlock_year', {
            year: year
        });
    }

    $scope.searchBySql = searchBySql;

    /**
     * 高级条件查询方法
     */
    function searchBySql() {
        return askForSave()
            .then(function () {
                return BasemanService.searchBySql($scope, rebateColumns, searchData);
            });
    }

    searchData(head());

});