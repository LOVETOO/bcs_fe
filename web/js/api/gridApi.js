/**
 * agGrid表格Api
 * @since 2018-09-17
 */
define(
    [isDebug ? 'plugins/aggrid/ag-grid-enterprise.hc' : 'plugins/aggrid/ag-grid-enterprise.hc.min.js.gzjs', 'jquery', 'angular', 'requestApi', 'swalApi', 'whereApi', 'numberApi', 'loopApi', 'constant', 'openBizObj', 'cssApi', 'Decimal', 'directive/hcInput', 'directive/hcGridPaging', 'directive/hcButtons', 'datetimepicker.zh-CN', 'FileSaver', 'jquery.actual'],
    function (agGrid, $, angular, requestApi, swalApi, whereApi, numberApi, loopApi, constant, openBizObj, cssApi, Decimal, hcInput) {
        'use strict';

        cssApi.loadCss('css/hc.grid.css');

        var sysParams = {};

        //布尔型参数
        [
            'EnableVueUI'                                       //启用 VueUI
        ].forEach(function (key) {
            sysParams[key] = null;

            requestApi.getSysParam(key).then(function (sysParam) {
                var value = sysParam.param_value === 'true';

                Object.defineProperty(sysParams, key, {
                    value: value
                });

                if (key === 'EnableVueUI' && value) {
                    HcSelectCellEditor = ElSelectCellEditor;
                    HcDateCellEditor = ElDatePickerCellEditor;
                }
            });
        });

        //数字型参数
        [
            'GridPageSize'                                      //表格分页大小
        ].forEach(function (key) {
            sysParams[key] = null;

            requestApi.getSysParam(key).then(function (sysParam) {
                var value = +sysParam.param_value;

                if (value !== value) {
                    value = null;
                }

                Object.defineProperty(sysParams, key, {
                    value: value
                });
            });
        });

        agGrid.LicenseManager.outputMessage = $.noop;

        if (!agGrid.ColumnApi.prototype.getColumns) {
            /**
             * 根据列字段数组返回列数组
             * @param {string[]} keys
             * @returns {Columns[]}
             */
            agGrid.ColumnApi.prototype.getColumns = function (keys) {
                return agGrid.ColumnController.prototype.getGridColumns.apply(this.columnController, arguments);
            };
        }

        agGrid.ColumnController.prototype.autoSizeColumns = (function (autoSizeColumns) {
            return function (columns) {
                return autoSizeColumns.call(this, columns.filter(function (column) {
                    return !column.colDef.suppressAutoSize;
                }));
            };
        })(agGrid.ColumnController.prototype.autoSizeColumns);

        //取消自动显示空行标识
        agGrid.GridPanel.prototype.onRowDataChanged = function (params) {
            if (!this.paginationProxy.isEmpty()) {
                this.hideOverlay();
            }

            setTimeout(function () {
                //设置行数据后，聚焦某行
                if (params.api.hcApi) {
                    params.api.hcApi.setFocusedCell(undefined, undefined, false);
                }
            }.bind(this));
        };
        /*
        //源码32115行，更换数据后会切换显示空行标识
        GridPanel.prototype.onRowDataChanged = function () {
            this.showOrHideOverlay();
        };
        */

        /**
         * 重写 setRowData
         * @override
         */
        (function (originalSetRowData) {
            agGrid.GridApi.prototype.setRowData = function setRowData(rowData) {
                var result = originalSetRowData.apply(this, arguments);

                this.hideOverlay();

                return result;
            };
        })(agGrid.GridApi.prototype.setRowData);

        (function (refreshView) {
            agGrid.GridApi.prototype.refreshView = function () {
                setTimeout(function () {
                    this.columnController.columnApi.autoSizeAllColumns();
                }.bind(this));

                return refreshView.apply(this, arguments);
            };
        })(agGrid.GridApi.prototype.refreshView);

        //源码16051行
        // + stop editing {forceRefresh: true, suppressFlash: true}
        // + event cellChanged {}
        // + cellRenderer.params.refresh() {} -> method passes 'as is' to the cellRenderer, so params could be anything
        // + rowComp: event dataChanged {animate: update, newData: !update}
        // + rowComp: api refreshCells() {animate: true/false}
        // + rowRenderer: api softRefreshView() {}
        agGrid.CellComp.prototype.refreshCell = function (params) {
            if (this.editingCell) {
                return;
            }
            var newData = params && params.newData;
            var suppressFlash = (params && params.suppressFlash) || this.column.getColDef().suppressCellFlash;
            var forceRefresh = params && params.forceRefresh;
            var oldValue = this.value;
            this.getValueAndFormat();
            // for simple values only (not pojo's), see if the value is the same, and if it is, skip the refresh.
            // when never allow skipping after an edit, as after editing, we need to put the GUI back to the way
            // if was before the edit.
            var valuesDifferent = !this.valuesAreEqual(oldValue, this.value);
            var dataNeedsUpdating = forceRefresh || valuesDifferent;
            if (dataNeedsUpdating) {
                var cellRendererRefreshed = void 0;
                // if it's 'new data', then we don't refresh the cellRenderer, even if refresh method is available.
                // this is because if the whole data is new (ie we are showing stock price 'BBA' now and not 'SSD')
                // then we are not showing a movement in the stock price, rather we are showing different stock.
                if (newData || suppressFlash) {
                    cellRendererRefreshed = false;
                }
                else {
                    cellRendererRefreshed = this.attemptCellRendererRefresh();
                }
                // we do the replace if not doing refresh, or if refresh was unsuccessful.
                // the refresh can be unsuccessful if we are using a framework (eg ng2 or react) and the framework
                // wrapper has the refresh method, but the underlying component doesn't
                if (!cellRendererRefreshed) {
                    this.replaceContentsAfterRefresh();
                }
                if (!suppressFlash) {
                    var flashCell = this.beans.gridOptionsWrapper.isEnableCellChangeFlash()
                        || this.column.getColDef().enableCellChangeFlash;
                    if (flashCell) {
                        this.flashCell();
                    }
                }
                // need to check rules. note, we ignore colDef classes and styles, these are assumed to be static
                this.postProcessStylesFromColDef();
                this.postProcessClassesFromColDef();
            }
            this.refreshToolTip();
            // we do cellClassRules even if the value has not changed, so that users who have rules that
            // look at other parts of the row (where the other part of the row might of changed) will work.
            this.postProcessCellClassRules();

            //刷新后，重新调整适合宽度
            (function (column) {
                if (!column.hcAutoWidthTimeoutId) {
                    column.hcAutoWidthTimeoutId = setTimeout(function () {
                        column.hcAutoWidthTimeoutId = 0;
                        column.columnApi.autoSizeColumn(column);
                    });
                }
            })(this.column);
        };

        /* 自动调整行高的功能无法对看不见的表格生效，增加以下补丁应对 */
        var patchToAutoHeightCalculator = function (prototypeOfAutoHeightCalculator) {
            patchToAutoHeightCalculator = angular.noop; //防止多次执行

            if (typeof prototypeOfAutoHeightCalculator === 'function') {
                prototypeOfAutoHeightCalculator = prototypeOfAutoHeightCalculator.prototype;
            }

            prototypeOfAutoHeightCalculator.getPreferredHeightForRow = function (rowNode) {
                var _this = this;
                if (!this.eDummyContainer) {
                    this.eDummyContainer = document.createElement('div');
                    // so any styles on row also get applied in dummy, otherwise
                    // the content in dummy may differ to the real
                    //utils_1._.addCssClass(this.eDummyContainer, 'ag-row ag-row-no-focus');
                    $(this.eDummyContainer).addClass('ag-row ag-row-no-focus');
                }
                // we put the dummy into the body container, so it will inherit all the
                // css styles that the real cells are inheriting
                var eBodyContainer = this.gridPanel.getBodyContainer();
                eBodyContainer.appendChild(this.eDummyContainer);
                var cellComps = [];
                var cols = this.columnController.getAllAutoRowHeightCols();
                cols.forEach(function (col) {
                    var cellComp = new agGrid.CellComp(_this.$scope, _this.beans, col, rowNode, null, true, false);
                    cellComp.setParentRow(_this.eDummyContainer);
                    cellComps.push(cellComp);
                });
                var template = cellComps.map(function (cellComp) { return cellComp.getCreateTemplate(); }).join(' ');
                this.eDummyContainer.innerHTML = template;
                // this gets any cellComps that are using components to put the components in
                cellComps.forEach(function (cellComp) { return cellComp.afterAttached(); });
                // we should be able to just take the height of the row at this point, however
                // the row isn't expanding to cover the cell heights, i don't know why, i couldn't
                // figure it out so instead looking at the individual cells instead
                var maxCellHeight = 0;
                cellComps.forEach(function (cell) {
                    var column = cell.column;
                    var rowNode = cell.rowNode;
                    var rowNodes = rowNode.rowModel.rootNode.childrenAfterSort;

                    var eCell = cell.eGui;
                    var preferredHeight = eCell.offsetHeight;
                    if (!preferredHeight && $ && $.fn && $.fn.actual) {
                        preferredHeight = $(eCell).actual('outerHeight');
                    }

                    var rowSpan = column.getRowSpan(rowNode);
                    if (rowSpan > 1) {
                        //合并单元格的单行最适行高应该平摊给所有合并的行
                        var averageHeight = rowNode.hcSpanPreferredHeightPerRow = Math.ceil(preferredHeight / rowSpan);
                        if (averageHeight > preferredHeight) {
                            preferredHeight = averageHeight;
                        }
                        for (var i = 1; i < rowSpan; i++) {
                            var followingRowNode = rowNodes[rowNode.childIndex + i];
                            followingRowNode.hcSpanNode = rowNode;
                        }
                    }
                    else if (rowNode.hcSpanNode) {
                        //若是被合并单元格覆盖的单元格，应取合并单元格计算好的高度
                        var averageHeight = rowNode.hcSpanNode.hcSpanPreferredHeightPerRow;
                        if (averageHeight > preferredHeight) {
                            preferredHeight = averageHeight;
                        }
                    }

                    if (preferredHeight > maxCellHeight) {
                        maxCellHeight = preferredHeight;
                    }
                });
                // we are finished with the dummy container, so get rid of it
                eBodyContainer.removeChild(this.eDummyContainer);
                cellComps.forEach(function (cellComp) {
                    // dunno why we need to detach first, doing it here to be consistent with code in RowComp
                    cellComp.detach();
                    cellComp.destroy();
                });
                // in case anything left over from last time
                //utils_1._.removeAllChildren(this.eDummyContainer);
                $(this.eDummyContainer).children().remove();
                return maxCellHeight;
            };
        }

        /* 自动调整最适列宽的功能无法对看不见的表格生效，增加以下补丁应对 */
        // this is the trick: we create a dummy container and clone all the cells
        // into the dummy, then check the dummy's width. then destroy the dummy
        // as we don't need it any more.
        // drawback: only the cells visible on the screen are considered
        agGrid.AutoWidthCalculator.prototype.getPreferredWidthForColumn = function (column) {
            var eHeaderCell = this.getHeaderCellForColumn(column);
            // cell isn't visible
            if (!eHeaderCell) {
                return -1;
            }
            var eDummyContainer = document.createElement('span');
            // position fixed, so it isn't restricted to the boundaries of the parent
            eDummyContainer.style.position = 'fixed';
            // we put the dummy into the body container, so it will inherit all the
            // css styles that the real cells are inheriting
            var eBodyContainer = this.gridPanel.getBodyContainer();
            eBodyContainer.appendChild(eDummyContainer);
            // get all the cells that are currently displayed (this only brings back
            // rendered cells, rows not rendered due to row visualisation will not be here)
            this.putRowCellsIntoDummyContainer(column, eDummyContainer);
            // also put header cell in
            // we only consider the lowest level cell, not the group cell. in 99% of the time, this
            // will be enough. if we consider groups, then it gets to complicated for what it's worth,
            // as the groups can span columns and this class only considers one column at a time.
            this.cloneItemIntoDummy(eHeaderCell, eDummyContainer);
            // at this point, all the clones are lined up vertically with natural widths. the dummy
            // container will have a width wide enough just to fit the largest.

            var dummyContainerWidth = eDummyContainer.offsetWidth;
            if (!dummyContainerWidth && $ && $.fn && $.fn.actual) {
                dummyContainerWidth = $(eDummyContainer).actual('outerWidth');
            }

            // we are finished with the dummy container, so get rid of it
            eBodyContainer.removeChild(eDummyContainer);

            //若还是取不到，就不调宽度了
            if (!dummyContainerWidth) {
                return column.actualWidth;
            }

            // we add padding as I found sometimes the gui still put '...' after some of the texts. so the
            // user can configure the grid to add a few more pixels after the calculated width
            var autoSizePadding = this.gridOptionsWrapper.getAutoSizePadding();
            return dummyContainerWidth + autoSizePadding;
        };

        (function (onCtrlAndC) {
            agGrid.GridPanel.prototype.onCtrlAndC = function () {
                if (this.gridOptionsWrapper.gridOptions.hcNoCopy === true) {
                    return;
                }

                return onCtrlAndC.apply(this, arguments);
            };
        })(agGrid.GridPanel.prototype.onCtrlAndC);

        (function (getStylesForRowSpanning) {
            agGrid.CellComp.prototype.getStylesForRowSpanning = function () {
                if (this.rowSpan === 1) {
                    return '';
                }

                var singleRowHeight = this.beans.gridOptionsWrapper.getRowHeightAsNumber();

                var rowModel = this.rowNode.rowModel;
                var startRowIndex = this.rowNode.rowIndex || this.rowNode.childIndex;
                var i, rowIndex, rowNode, totalRowHeight = 0;

                if (typeof startRowIndex === 'number') {
                    for (i = 0; i < this.rowSpan; i++) {
                        rowIndex = startRowIndex + i;
                        rowNode = rowModel.rootNode.childrenAfterSort[rowIndex]; //rowModel.getRow(rowIndex);
                        totalRowHeight += rowNode.rowHeight;
                    }
                }
                else {
                    totalRowHeight = singleRowHeight * this.rowSpan;
                }

                return 'height: ' + totalRowHeight + 'px; z-index: ' + this.rowSpan + ';';
            };

            //源码15847行
            /*
            agGrid.CellComp.prototype.getStylesForRowSpanning = function () {
                if (this.rowSpan === 1) {
                    return '';
                }
                var singleRowHeight = this.beans.gridOptionsWrapper.getRowHeightAsNumber();
                var totalRowHeight = singleRowHeight * this.rowSpan;
                return "height: " + totalRowHeight + "px; z-index: 1;";
            };
            */
        })(agGrid.CellComp.prototype.getStylesForRowSpanning);

        agGrid.NumberFilter.prototype.comparator = function () {
            return function (left, right) {
                if (left == right) {
                    return 0;
                }
                if (left < right) {
                    return 1;
                }
                if (left > right) {
                    return -1;
                }
            };
        };

        var api = {};

        function Constants() { }

        Constants.STEP_EVERYTHING = 0;
        Constants.STEP_FILTER = 1;
        Constants.STEP_SORT = 2;
        Constants.STEP_MAP = 3;
        Constants.STEP_AGGREGATE = 4;
        Constants.STEP_PIVOT = 5;
        Constants.ROW_BUFFER_SIZE = 10;
        Constants.LAYOUT_INTERVAL = 500;
        Constants.BATCH_WAIT_MILLIS = 50;
        Constants.EXPORT_TYPE_DRAG_COPY = 'dragCopy';
        Constants.EXPORT_TYPE_CLIPBOARD = 'clipboard';
        Constants.EXPORT_TYPE_EXCEL = 'excel';
        Constants.EXPORT_TYPE_CSV = 'csv';
        Constants.KEY_BACKSPACE = 8;
        Constants.KEY_TAB = 9;
        Constants.KEY_NEW_LINE = 10;
        Constants.KEY_ENTER = 13;
        Constants.KEY_SHIFT = 16;
        Constants.KEY_ESCAPE = 27;
        Constants.KEY_SPACE = 32;
        Constants.KEY_LEFT = 37;
        Constants.KEY_UP = 38;
        Constants.KEY_RIGHT = 39;
        Constants.KEY_DOWN = 40;
        Constants.KEY_DELETE = 46;
        Constants.KEY_A = 65;
        Constants.KEY_C = 67;
        Constants.KEY_V = 86;
        Constants.KEY_D = 68;
        Constants.KEY_F2 = 113;
        Constants.KEY_PAGE_UP = 33;
        Constants.KEY_PAGE_DOWN = 34;
        Constants.KEY_PAGE_HOME = 36;
        Constants.KEY_PAGE_END = 35;
        Constants.ROW_MODEL_TYPE_INFINITE = 'infinite';
        Constants.ROW_MODEL_TYPE_VIEWPORT = 'viewport';
        Constants.ROW_MODEL_TYPE_CLIENT_SIDE = 'clientSide';
        Constants.ROW_MODEL_TYPE_SERVER_SIDE = 'serverSide';
        Constants.DEPRECATED_ROW_MODEL_TYPE_NORMAL = 'normal';
        Constants.ALWAYS = 'always';
        Constants.ONLY_WHEN_GROUPING = 'onlyWhenGrouping';
        Constants.PINNED_TOP = 'top';
        Constants.PINNED_BOTTOM = 'bottom';
        Constants.DOM_LAYOUT_NORMAL = 'normal';
        Constants.DOM_LAYOUT_PRINT = 'print';
        Constants.DOM_LAYOUT_AUTO_HEIGHT = 'autoHeight';

        var constants_1 = {}
        constants_1.Constants = Constants;

        /**
         * 使用 Vue 渲染的单元格编辑器
         */
        var VueCellEditor = defineClass({
            init: function (params) {
                var cellEditor = this;

                cellEditor.cellEditorParams = params;

                if (!cellEditor.vueOptions) {
                    throw new Error('缺失 Vue 选项');
                }

                // cellStartedEdit is only false if we are doing fullRow editing
                if (params.cellStartedEdit) {
                    var keyPressBackspaceOrDelete = Switch(params.keyPress)
                        .case(Constants.KEY_BACKSPACE, Constants.KEY_DELETE, true)
                        .default(false)
                        .result;

                    if (keyPressBackspaceOrDelete) {
                        cellEditor.startValue = '';
                    }
                    else if (params.charPress) {
                        cellEditor.startValue = params.charPress;
                    }
                    else {
                        cellEditor.startValue = params.value;
                    }
                }
                else {
                    cellEditor.startValue = params.value;
                }

                Switch(cellEditor.startValue).case(undefined, null, NaN, function () {
                    cellEditor.startValue = '';
                });

                return new agGrid.Promise(function (resolve) {
                    require(['vue', 'element-ui'], function (Vue) {
                        var vue = cellEditor.vue = new Vue({
                            extends: cellEditor.vueOptions,
                            cellEditor: cellEditor
                        }).$mount();

                        $(vue.$el).data('$vue', vue);

                        resolve();
                    });
                });
            },
            getGui: function () {
                return this.vue.$el;
            },
            getValue: function () {
                return validate(this.vue.value, this.cellEditorParams);
            },
            destroy: function () {
                this.vue.$destroy();
                this.vue = null;
            },
            vueOptions: {
                render: function (h) {
                    return h('el-input', {
                        value: this.value,
                        on: {
                            input: function (value) {
                                this.value = value;
                            },
                        }
                    });
                }
            }
        });

        /**
         * 使用 Vue 渲染的单元格编辑器的 Vue 混入选项
         */
        VueCellEditor.vueOptions = {
            data: function () {
                return {
                    value: this.$options.cellEditor.startValue
                };
            },
            computed: {
                cellEditor: function () {
                    return this.$options.cellEditor;
                },
                cellEditorParams: function () {
                    return this.cellEditor.cellEditorParams;
                },
                gridApi: function () {
                    return this.cellEditorParams.api;
                },
                column: function () {
                    return this.cellEditorParams.column;
                },
                colDef: function () {
                    return this.column.colDef;
                },
                rowNode: function () {
                    return this.cellEditorParams.node;
                },
                rowData: function () {
                    return this.rowNode.data;
                }
            },
            methods: {
                stopEditing: function (cancel) {
                    return this.gridApi.stopEditing(cancel);
                }
            }
        };

        /**
         * el-select
         * 单元格编辑器
         */
        var ElSelectCellEditor = defineClass(VueCellEditor, {
            vueOptions: {
                extends: VueCellEditor.vueOptions,
                computed: {
                    options: function () {
                        return this.cellEditorParams.values.map(function (value, index) {
                            return {
                                key: value,
                                value: value,
                                label: this.cellEditorParams.names[index]
                            };
                        }, this);
                    },
                    elSelect: function () {
                        return this.$refs.elSelect;
                    }
                },
                methods: {
                    handleChange: function (value) {
                        this.value = value;
                        this.stopEditing();
                    },
                    visibleChange: function (visible) {
                        if (!visible) {
                            this.stopEditing(true);
                        }
                    },
                    toggleMenu: function () {
                        this.elSelect.toggleMenu();
                    }
                },
                render: function (h) {
                    return h(
                        'el-select',
                        {
                            ref: 'elSelect',
                            props: {
                                value: this.value,
                                clearable: true
                            },
                            on: {
                                change: this.handleChange,
                                'visible-change': this.visibleChange
                            }
                        },
                        this.options.map(function (option) {
                            return h('el-option', {
                                props: option
                            });
                        })
                    );
                }
            },
            afterGuiAttached: function () {
                this.vue.toggleMenu();
            }
        });

        var HcSelectCellEditor = ElSelectCellEditor;

        /**
         * el-date-picker
         * 单元格编辑器
         */
        var ElDatePickerCellEditor = defineClass(VueCellEditor, {
            vueOptions: {
                extends: VueCellEditor.vueOptions,
                computed: {
                    elDatePicker: function () {
                        return this.$refs.elDatePicker;
                    }
                },
                methods: {
                    handleInput: function (value) {
                        this.value = value;
                        this.stopEditing();
                    },
                    handleBlur: function () {
                        this.stopEditing(true);
                    },
                    focus: function () {
                        this.elDatePicker.focus();
                    }
                },
                render: function (h) {
                    return h('el-date-picker', {
                        ref: 'elDatePicker',
                        props: {
                            value: this.value,
                            clearable: true,
                            valueFormat: 'yyyy-MM-dd'
                        },
                        on: {
                            input: this.handleInput,
                            blur: this.handleBlur
                        }
                    });
                }
            },
            afterGuiAttached: function () {
                this.vue.focus();
            }
        });

        var HcDateCellEditor = DateCellEditor;

        /**
         * 表格选项预定义
         * @param destObj
         * @param defineObj
         * @return {*}
         */
        function gridPredefine(destObj, defineObj) {
            Object.keys(defineObj).forEach(function (key) {
                var defineValue = defineObj[key];

                if (angular.isObject(defineValue) && !angular.isArray(defineValue)) {
                    var destValue;
                    if (key in destObj) {
                        destValue = destObj[key];
                    }
                    else {
                        destValue = {};
                        destObj[key] = destValue;
                    }

                    if (angular.isObject(destValue) && !angular.isArray(destValue)) {
                        gridPredefine(destValue, defineValue);
                    }
                }
                else if (!(key in destObj)) {
                    destObj[key] = defineValue;
                }
            });

            return destObj;
        }

        /**
         * 创建AgGrid
         * 原生的属性用原名，为了防止重名，自定义的属性以【hc】开头
         * @param {string|DomElement} div 表格ID或DOM元素
         * @param {Object} gridOptions 表格选项
         * @param {boolean} [returnPromise] 返回承诺，即异步创建
         * @return {Object} gridOptions 表格选项
         */
        api.create = function (div, gridOptions, returnPromise) {
            return ['$q', '$http', '$compile', '$parse', '$state', function ($q, $http, $compile, $parse, $state) {
                if (!gridOptions) {
                    handleError('表格gridOptions属性不存在');
                }

                if (gridOptions.api) {
                    throw new Error('表格选项不能共享，一个表格选项只能给一个表格用');
                }
                if (gridOptions.hcGlobalSaveGuid) {
                    var res = requestApi.syncPost('scpgridop', 'getgridoption', { gridsaveguid: gridOptions.hcGlobalSaveGuid });
                    if (res.gridoptions) {
                        var options = JSON.parse(res.gridoptions);
                        var cloneOptions = angular.copy(gridOptions.columnDefs);
                        cloneOptions.forEach(function (col) {
                            options.forEach(function (gridcol, i) {
                                if (col.type == '序号' && gridcol.colId == 'seq') {
                                    col.index = gridcol.index;
                                    col.width = gridcol.actualWidth
                                    col.left = gridcol.left;
                                } else if (col.field == gridcol.colId) {
                                    col.index = gridcol.index;
                                    col.width = gridcol.actualWidth;
                                    col.left = gridcol.left;
                                    col.suppressAutoSize = true;
                                }
                            })
                        });
                        cloneOptions.sort(function (a, b) {
                            return a.index - b.index
                        });
                        gridOptions.columnDefs = cloneOptions;
                    }
                }
                if (!gridOptions.hcReady)
                    gridOptions.hcReady = $q.deferPromise();

                if (returnPromise === true) {
                    return $q.when().then(function () {
                        return api.create(div, gridOptions, false);
                    });
                }

                var $grid; //表格DOM元素
                var gridScope; //表格作用域
                var privateData = {}; //私有数据

                /**
                 * 遍历所有的子列定义
                 * @since 2019-01-07
                 */
                function forEachChildColumnDef(callback) {
                    api.forEachChildColumnDef(gridOptions.columnDefs, callback);
                }

                /**
                 * 把函数包装为会响应 AngularJS 的函数
                 * @return {function}
                 */
                function getScopeApplyFunction(fn) {
                    if (!angular.isFunction(fn)) return angular.noop;

                    return function () {
                        try {
                            return fn.apply(this, arguments);
                        }
                        finally {
                            gridScope.$evalAsync();
                        }
                    };
                }

                /**
                 * 自定义API
                 */
                gridOptions.hcApi = {

                    /**
                     * 返回表格所在元素(jQuery元素)
                     * @return {jQuery}
                     * @since 2018-09-30
                     */
                    getDiv: function () {
                        return $grid;
                    },
                    /**
                     * 保存网格配置
                     */
                    saveGridOption: function () {
                        var postData = {
                            gridsaveguid: gridOptions.hcGlobalSaveGuid
                        };
                        var columns = gridOptions.columnApi.getAllGridColumns().map(function (item, i) {
                            var obj = {};
                            ['actualWidth', 'colId', 'fieldContainsDots', 'filterActive', 'firstRightPinned', 'lastLeftPinned', 'left', 'lockPinned', 'lockPosition', 'lockVisible', 'menuVisible', 'moving', 'oldLeft', 'pinned', 'pivotActive', 'primary', 'rowGroupActive', 'tooltipFieldContainsDots', 'visible'].forEach(function (key) {
                                obj[key] = item[key]
                            });
                            obj.index = i;
                            return obj;
                        });
                        postData.gridoptions = JSON.stringify(columns)
                        requestApi.post('scpgridop', 'save', postData).then(function (res) {
                            console.log(res);
                            swalApi.success('保存成功');
                        });
                    },
                    /**
                     * 清空网格配置
                     */
                    delectGridOption: function () {
                        requestApi.post('scpgridop', 'clear', { gridsaveguid: gridOptions.hcGlobalSaveGuid }).then(function (res) {
                            console.log(res);
                            swalApi.success('清除成功');
                        });
                    },
                    /**
                     * 返回表格所在作用域
                     * @return {Scope}
                     * @since 2018-09-30
                     */
                    getScope: function () {
                        return gridScope;
                    },

                    /**
                     * 以指定的查询对象进行查询
                     * @param {object} searchObj 查询对象
                     * @return {Promise}
                     * @since 2018-09-29
                     */
                    search: function (searchObj) {
                        searchObj = searchObj || {};

                        var sqlWheres = [];

                        function addSqlWhere(sqlWhere) {
                            if (sqlWhere) {
                                if (sqlWhere === '1 = 1' || sqlWhere === '1=1') {
                                    sqlWhere = '';
                                }
                            }
                            else {
                                sqlWhere = '';
                            }

                            if (sqlWhere) {
                                sqlWheres.push(sqlWhere);
                            }
                        }

                        //静态条件
                        var staticSqlWhere;

                        if (gridOptions.hcSqlWhere) {
                            Switch(typeof gridOptions.hcSqlWhere)
                                .case('string', function () {
                                    staticSqlWhere = gridOptions.hcSqlWhere;
                                })
                                .case('function', function () {
                                    staticSqlWhere = gridOptions.hcSqlWhere();
                                });

                            addSqlWhere(staticSqlWhere);
                        }

                        //过滤器条件
                        var filterSqlWhere = getSqlWhereFromFilterSetting();
                        addSqlWhere(filterSqlWhere);

                        function getSqlWhereFromFilterSetting() {
                            if (!gridOptions.hcFilterSetting) return '1 = 1';

                            var filterWheres = [];

                            angular.forEach(gridOptions.hcFilterSetting.filters, function (filter, filterId) {
                                var activeOption = filter.options.find(function (option) {
                                    return !option.isAll && option.active;
                                });

                                if (!activeOption) return;

                                var where;
                                if (angular.isNumber(activeOption.value))
                                    where = filterId + ' = ' + activeOption.value;
                                else
                                    where = filterId + ' = ' + "'" + activeOption.value + "'";

                                filterWheres.push(where);
                            });

                            if (filterWheres.length === 0)
                                return '1 = 1';

                            if (filterWheres.length === 1)
                                return filterWheres[0];

                            return '(' + filterWheres.reduce(result, function (where) {
                                return ') and (' + where;
                            }) + ')';
                        }

                        //动态条件
                        var dynamicSqlWhere;

                        //若有指定查询条件
                        if (searchObj.sqlwhere) {
                            //替换上次的动态条件
                            dynamicSqlWhere = searchObj.sqlwhere;
                            privateData.lastSqlWhere = dynamicSqlWhere;
                        }
                        else {
                            //取上次的动态条件
                            dynamicSqlWhere = privateData.lastSqlWhere;
                        }

                        addSqlWhere(dynamicSqlWhere);

                        Switch(sqlWheres.length)
                            .case(0, function () {
                                delete searchObj.sqlwhere;
                            })
                            .case(1, function () {
                                searchObj.sqlwhere = sqlWheres[0];
                            })
                            .default(function () {
                                searchObj.sqlwhere = '(' + sqlWheres.join(') and (') + ')';
                            });

                        if (!gridOptions.hcNoPaging) {
                            gridOptions.api.getStatusPanel('hcGridPaging').setVisible(true);
                        }

                        //若启用分页
                        if (gridScope.isPaging) {
                            //若没指定分页
                            if (!searchObj.pagination)
                                searchObj.pagination = gridOptions.hcApi.getPagination();
                        }
                        else {
                            searchObj.pagination = ''; //清除分页信息
                            searchObj.maxsearchrltcmt = 2147483647; //设置最大数量为Java整数最大值
                        }

                        if (gridOptions.hcPostData) {
                            var postData;
                            if (angular.isFunction(gridOptions.hcPostData))
                                postData = gridOptions.hcPostData();
                            else
                                postData = gridOptions.hcPostData;

                            delete postData.sqlwhere;
                            angular.extend(searchObj, postData);
                        }

                        var response, sqlWhere;

                        return $q
                            .when()
                            .then(function () {
                                sqlWhere = searchObj.sqlwhere;

                                return searchObj;
                            })
                            //在请求前对查询对象进行加工
                            //比如：赋值查询标识  searchObj.search_flag = ?
                            .then(gridOptions.hcBeforeRequest)
                            .then(function () {
                                if (searchObj.sqlwhere !== sqlWhere) {
                                    console.error('请勿通过 hcBeforeRequest 给请求数据的 sqlwhere 属性赋值');

                                    if (sqlWhere) {
                                        searchObj.sqlwhere = sqlWhere;
                                    }
                                    else {
                                        delete searchObj.sqlwhere;
                                    }
                                }

                                return requestApi({
                                    classId: gridOptions.hcClassId,
                                    action: gridOptions.hcRequestAction || 'search',
                                    data: searchObj,
                                    noShowWaiting: gridOptions.hcNoShowWaiting,
                                    noShowError: gridOptions.hcNoShowError
                                });
                            })
                            .then(function () {
                                response = arguments[0];
                                return response;
                            })
                            .then(gridOptions.hcAfterRequest)
                            .then(function () {
                                gridOptions.hcApi.setDataAfterRequest(response, gridOptions.hcDataRelationName || gridOptions.hcClassId + 's');
                                return response;
                            });
                    },

                    /**
                     * 根据表格进行查询
                     * @return {Promise}
                     * @since 2018-09-29
                     */
                    searchByGrid: function () {
                        return gridOptions.hcApi.getWhere()
                            .then(function (sqlWhere) {
                                return {
                                    sqlwhere: sqlWhere || '1 = 1',
                                    pagination: 'pn=1,ps=' + gridScope.pageSize //重新选择条件后，每页数量不变，当前页变为1
                                };
                            })
                            .then(gridOptions.hcApi.search);
                    },

                    /**
                     * 根据关键字进行搜索
                     * @param {string} keyword 关键字
                     * @param {string[]} keys 搜索字段
                     */
                    searchByKeyword: function (keyword, keys) {
                        return gridOptions.hcApi.search({
                            sqlwhere: whereApi.getWhereByGridAndKeyword(gridOptions, keyword, keys)
                        });
                    },

                    /**
                     * 根据表格产生条件
                     * @return {Promise<string>}
                     * @since 2018-10-01
                     */
                    getWhere: function () {
                        return whereApi.gridWhere({
                            gridOptions: gridOptions
                        });
                    },

                    /**
                     * 获取焦点单元格所在行号
                     * @return {number} 行号
                     */
                    getFocusedRowIndex: function () {
                        var cell = gridOptions.api.getFocusedCell();

                        if (cell && cell.rowIndex < gridOptions.api.getModel().getRowCount()) {
                            return cell.rowIndex;
                        }

                        return -1;
                    },

                    /**
                     * 获取焦点单元格所在的行节点
                     * @return {Node} 行节点
                     */
                    getFocusedNode: function () {
                        var rowIndex = gridOptions.hcApi.getFocusedRowIndex();

                        if (rowIndex >= 0)
                            return gridOptions.hcApi.getNodeOfRowIndex(rowIndex);

                        return null;
                    },

                    /**
                     * 获取焦点单元格所在的行数据
                     * @return {Object} 行数据
                     */
                    getFocusedData: function () {
                        var rowIndex = gridOptions.hcApi.getFocusedRowIndex();

                        if (rowIndex >= 0)
                            return gridOptions.hcApi.getDataOfRowIndex(rowIndex);

                        return null;
                    },

                    /**
                     * 获取焦点单元格所在的行节点，若没选中则提醒
                     * @param params = {
                     *     message: string 没选中时的提示信息 与 actionName 冲突
                     *     actionName: string 选中后续动作的名称 与 message 冲突
                     * }
                     * @return {Promise<Node>} 行节点
                     */
                    getFocusedNodeWithNotice: function (params) {
                        if (angular.isString(params))
                            if (angular.isString(params))
                                params = {
                                    message: params
                                };

                        return $q
                            .when()
                            .then(function () {
                                var focusedNode = gridOptions.hcApi.getFocusedNode();

                                if (focusedNode)
                                    return focusedNode;

                                var actualMessage = params.message ? params.message : '请先选中要' + params.actionName + '的行'

                                return swalApi.info(actualMessage).then($q.reject);
                            });
                    },

                    /**
                     * 获取勾选的行节点数组，若没勾选的则提醒
                     * @param params = {
                     *     message: string 没选中时的提示信息 与 actionName 冲突
                     *     actionName: string 选中后续动作的名称 与 message 冲突
                     * }
                     * @return {Promise<Node[]>} 行节点数组
                     */
                    getSelectedNodesWithNotice: function (params) {
                        if (angular.isString(params))
                            if (angular.isString(params))
                                params = {
                                    message: params
                                };

                        return $q
                            .when()
                            .then(function () {
                                var selectedNodes = gridOptions.api.getSelectedNodes();

                                if (selectedNodes && selectedNodes.length)
                                    return selectedNodes;

                                var actualMessage = params.message ? params.message : '请先勾选要' + params.actionName + '的行'

                                return swalApi.info(actualMessage).then($q.reject);
                            });
                    },

                    /**
                     * 根据过滤器筛选行
                     * @param { (node: RowNode) => boolean } filter 过滤器
                     * @returns {RowNode[]}
                     */
                    getNodesByFilter: function (filter) {
                        var nodes = [];

                        gridOptions.api.getModel().forEachNodeAfterFilterAndSort(function (node) {
                            if (filter(node)) nodes.push(node);
                        });

                        return nodes;
                    },

                    /**
                     * 根据行号获取行节点
                     * @param {number} rowIndex 行号
                     * @return {Node} 行节点
                     */
                    getNodeOfRowIndex: function (rowIndex) {
                        return gridOptions.api.getModel().getRow(rowIndex);
                    },

                    /**
                     * 根据行号获取行数据
                     * @param {number} rowIndex 行号
                     * @return {Object} 行数据
                     */
                    getDataOfRowIndex: function (rowIndex) {
                        var node = gridOptions.hcApi.getNodeOfRowIndex(rowIndex);
                        return node && node.data;
                    },

                    /**
                     * 遍历所有的子列定义
                     * @param {(columnDef: ColumnDef, columnIndex: number, columnDefParent: ColumnGroupDef) => void} callback 回调函数
                     * @since 2019-01-07
                     */
                    forEachChildColumnDef: forEachChildColumnDef,

                    /**
                     * 返回所有的子列定义
                     * @since 2019-01-07
                     */
                    getAllChildColumnDefs: function () {
                        var actualColumnDefs = [];

                        (function forEachChildColumnDefOfGroup(childColumnDefs) {
                            childColumnDefs.forEach(function (columnDef) {
                                if (columnDef.children && columnDef.children.length)
                                    forEachChildColumnDefOfGroup(columnDef.children);
                                else {
                                    actualColumnDefs.push(columnDef);
                                }
                            });
                        })(gridOptions.columnDefs);

                        return actualColumnDefs;
                    },

                    /**
                     * 获取行相关信息
                     * @param nodeOrIndex
                     */
                    getAboutRow: function (nodeOrIndex, key) {
                        var node, data, rowIndex;

                        if (angular.isNumber(nodeOrIndex))
                            node = gridOptions.hcApi.getNodeOfRowIndex(nodeOrIndex);
                        else if (angular.isString(nodeOrIndex)) {
                            rowIndex = numberApi.toNumber(nodeOrIndex, -1);
                            if (rowIndex >= 0)
                                node = gridOptions.hcApi.getNodeOfRowIndex(rowIndex);
                        }
                        else if (nodeOrIndex instanceof agGrid.RowNode)
                            node = nodeOrIndex;
                        else
                            throw new Error('无法找到行[' + nodeOrIndex + ']');

                        if (!node) return null;

                        data = node.data;
                        rowIndex = node.rowIndex;

                        var result = {
                            rowIndex: rowIndex,
                            data: data,
                            node: node
                        };

                        if (key) return result[key];

                        return result;
                    },

                    /**
                     * 获取列相关信息
                     * @param colOrField
                     */
                    getAboutCol: function (colOrField, key) {
                        var column, colDef, field;

                        if (angular.isString(colOrField))
                            column = gridOptions.columnApi.getColumn(colOrField);
                        else if (angular.isString(colOrField.field))
                            column = gridOptions.columnApi.getColumn(colOrField.field);
                        else if (colOrField instanceof agGrid.Column)
                            column = colOrField;
                        else
                            throw new Error('无法找到列[' + colOrField + ']');

                        if (!column) return null;

                        colDef = column.getColDef();
                        field = colDef.field;

                        var result = {
                            field: field,
                            colDef: colDef,
                            column: column
                        };

                        if (key) return result[key];

                        return result;
                    },

                    /**
                     * 使用通用查询增加行
                     * @param commonSearchSetting 通用查询设置
                     * @param option 其他选项
                     * @returns {Promise}
                     */
                    addRowByCommonSearch: function (commonSearchSetting, option) {
                        option = option || {};

                        '$modal'.asAngularService
                            .openCommonSearch(commonSearchSetting)
                            .result
                            .then(function () {
                                //
                            });
                    },

                    /**
                     * 获取格式化后的值
                     * @param nodeOrIndex
                     * @param colOrField
                     */
                    getFormattedValue: function (nodeOrIndex, colOrKey) {
                        var node = gridOptions.hcApi.getAboutRow(nodeOrIndex, 'node'),
                            aboutCol = gridOptions.hcApi.getAboutCol(colOrKey),
                            value;

                        if (node && aboutCol) {
                            value = gridOptions.api.getValue(aboutCol.column, node);

                            if (aboutCol.colDef.valueFormatter) {
                                value = gridOptions.api.gridPanel.beans.valueFormatterService.formatValue(aboutCol.column, node, null, value);
                            }
                        }

                        if (value == null)
                            value = '';
                        else if (!angular.isString(value))
                            value += '';

                        return value;
                    },

                    /**
                     * 从单元格的 DOM 获取值
                     * @param nodeOrIndex
                     * @param colOrField
                     */
                    getValueFromDom: function (nodeOrIndex, colOrKey) {
                        var rowIndex = gridOptions.hcApi.getAboutRow(nodeOrIndex, 'rowIndex'),
                            field = gridOptions.hcApi.getAboutCol(colOrKey, 'field'),
                            value = '';

                        if (rowIndex >= 0 && field) {
                            value = $grid
                                .find('[role=row][row-index=' + rowIndex + ']')
                                .find('[role=gridcell][col-id=' + field + ']')
                                .text();
                        }

                        return value;
                    },

                    /**
                     * 必填校验
                     */
                    validCheckForRequired: function (msgBox) {
                        if (!msgBox) msgBox = [];

                        if ((function () {
                            var required = false;

                            if (gridOptions.hcRequired === true) {
                                required = true;
                            }
                            else if (angular.isFunction(gridOptions.hcRequired)) {
                                required = gridOptions.hcRequired({
                                    api: gridOptions.api,
                                    hcApi: gridOptions.hcApi
                                });
                            }

                            if (required && gridOptions.hcApi.isEmpty()) {
                                msgBox.push(gridOptions.hcName);
                                return true;
                            }
                        })()) return;

                        var columns = gridOptions.columnApi.getAllDisplayedColumns();

                        function allwaysReturnTrue() {
                            return true;
                        }

                        var needPushGridName = !!gridOptions.hcName;

                        columns.forEach(function (column) {
                            var colDef = column.getColDef();

                            var hcRequired = colDef.hcRequired;

                            if (hcRequired !== true && !angular.isFunction(hcRequired))
                                return;

                            var isRequired = hcRequired === true ? allwaysReturnTrue : function (node) {
                                return !!hcRequired({
                                    node: node,
                                    data: node.data,
                                    rowIndex: node.rowIndex,
                                    column: column,
                                    colDef: colDef,
                                    field: colDef.field
                                });
                            };

                            var requiredInvalidRowNodes = [];

                            gridOptions.api.forEachNode(function (node) {
                                if (!isRequired(node)) return;

                                var value = gridOptions.hcApi.getFormattedValue(node, column);
                                if (!value) {
                                    requiredInvalidRowNodes.push(node);
                                }
                            });

                            if (requiredInvalidRowNodes.length) {
                                (function () {
                                    var title = colDef.headerName, groupTitle;

                                    var parentGroup = column;

                                    do {
                                        parentGroup = parentGroup.getParent();
                                        if (!parentGroup) break;

                                        groupTitle = parentGroup.getDefinition().headerName;

                                        if (groupTitle)
                                            title = groupTitle + ' - ' + title;
                                    } while (true);

                                    var invalidBox = title + '：第' + requiredInvalidRowNodes
                                        .map(function (node) {
                                            return node.rowIndex + 1;
                                        })
                                        .join('、') + '行';

                                    if (needPushGridName) {
                                        msgBox.push(gridOptions.hcName);
                                        needPushGridName = false;
                                    }

                                    msgBox.push(invalidBox);
                                })();
                            }
                        });

                        return msgBox;
                    },

                    /**
                     * @return {[]} 数据副本数组
                     */
                    getRowData: function () {
                        var data = [];

                        gridOptions.api.getModel().forEachNode(function (node) {
                            data.push(node.data);
                        });

                        return data;
                    },

                    /**
                     * 返回导出标题设置
                     * @returns {{}[]}
                     */
                    getExportTitleSetting: function () {
                        var columns = gridOptions.columnApi.getAllDisplayedColumns();

                        if (!columns || !columns.length) return [];

                        var allColumnTitleSettingCache = {}, allColumnTitleSetting = [];
                        columns.forEach(function (column, colIndex) {
                            var columnTitleSetting = {
                                title: gridOptions.columnApi.getDisplayNameForColumn(column),
                                rowCount: 1,
                                colCount: 1,
                                colIndex: colIndex
                            };

                            allColumnTitleSettingCache[column.getColId()] = columnTitleSetting;
                            allColumnTitleSetting.push(columnTitleSetting)
                        });

                        var allTitleSetting = [allColumnTitleSetting];

                        var groups = columns;
                        var allGroupTitleSettingCache = {}, allGroupTitleSetting;
                        do {
                            groups = groups
                                .map(function (columnOrGroup) {
                                    return columnOrGroup.getParent();
                                }).filter(function (obj) {
                                    return !!obj;
                                });

                            if (!groups.length) break;

                            allGroupTitleSetting = [];

                            //遍历列组
                            groups.forEach(function (group) {
                                var groupId = group.getGroupId();
                                if (groupId in allGroupTitleSettingCache) return;

                                var groupTitleSetting = {
                                    title: gridOptions.columnApi.getDisplayNameForColumnGroup(group),
                                    rowCount: 1,
                                    colCount: 1
                                };

                                //子列
                                var children = group.getDisplayedChildren();
                                //首个子列
                                var firstChild = children[0];
                                //首个子列的标题设置
                                var firstChildTitleSetting = getTitleSettingFromCache(firstChild);

                                //列组的位置和首个子列的位置一致
                                groupTitleSetting.colIndex = firstChildTitleSetting.colIndex;

                                //若列组没有标题，要纵向合并子列
                                if (!groupTitleSetting.title) {
                                    //列组的标题 = 子列的标题
                                    groupTitleSetting.title = firstChildTitleSetting.title;
                                    //列组的占用行数要加上子列的占用行数
                                    groupTitleSetting.rowCount += firstChildTitleSetting.rowCount;

                                    firstChildTitleSetting.title = '';
                                    firstChildTitleSetting.rowCount = 0;
                                    firstChildTitleSetting.colCount = 0;
                                }
                                //否则，要横向合并
                                else {
                                    //列组占用的列数等于子列占用的列数之和
                                    groupTitleSetting.colCount = numberApi.sum(children.map(getTitleSettingFromCache), 'colCount');
                                }

                                allGroupTitleSettingCache[groupId] = groupTitleSetting;
                                allGroupTitleSetting.push(groupTitleSetting);
                            });

                            allTitleSetting.unshift(allGroupTitleSetting);
                        } while (true);

                        return allTitleSetting;

                        /**
                         * 判断是否是列
                         * @param {Column|ColumnGroup} columnOrGroup 列或组
                         * @returns {boolean}
                         */
                        function isColumn(columnOrGroup) {
                            return !!columnOrGroup.getColId;
                        }

                        /**
                         * 从缓存取标题设置
                         * @param {Column|ColumnGroup} columnOrGroup 列或组
                         */
                        function getTitleSettingFromCache(columnOrGroup) {
                            var titleSettingCache, id;

                            if (isColumn(columnOrGroup)) {
                                titleSettingCache = allColumnTitleSettingCache;
                                id = columnOrGroup.getColId();
                            }
                            else {
                                titleSettingCache = allGroupTitleSettingCache;
                                id = columnOrGroup.getGroupId();
                            }

                            return titleSettingCache[id];
                        }
                    },

                    /**
                     * 获取导出数据
                     * @return {{}[]}
                     */
                    getExportData: function () {
                        var data = [];
                        var columns = gridOptions.columnApi.getAllDisplayedColumns();
                        gridOptions.api.getModel().forEachNodeAfterFilterAndSort(function (node) {
                            var nodeData = {};
                            data.push(nodeData);

                            columns.forEach(function (column) {
                                if (!column.colDef.field) return;

                                var value = gridOptions.hcApi.getFormattedValue(node, column);

                                nodeData[column.colDef.field] = value;
                            });
                        });

                        return data;
                    },
                    /**
                     * 获取顶部数据
                     * @returns {Array}
                     */
                    getPinnedTopData: function () {
                        var data = [];

                        var length = gridOptions.api.getPinnedTopRowCount();
                        var columns = gridOptions.columnApi.getAllDisplayedColumns();
                        if (HczyCommon.isNull(length) || length == 0) {
                            return data;
                        }
                        for (var i = 0; i < length; i++) {
                            var row = gridOptions.api.getPinnedTopRow(i);
                            var rowdata = row.data;
                            $.each(columns, function (x, column) {
                                if (rowdata[column.colDef.field]) {
                                    var value = rowdata[column.colDef.field];

                                    if (angular.isFunction(column.colDef.valueFormatter)) {
                                        value = column.colDef.valueFormatter({
                                            value: value,
                                            column: column,
                                            node: row
                                        });
                                    }
                                    rowdata[column.colDef.field] = value;
                                }
                            });
                            data.push(rowdata);
                        }
                        return data;
                    },

                    /**
                     * 获取网格底部数据
                     * @returns {Array}
                     */
                    getPinnedBottomData: function () {
                        var data = [];

                        var length = gridOptions.api.getPinnedBottomRowCount();
                        var columns = gridOptions.columnApi.getAllDisplayedColumns();
                        if (HczyCommon.isNull(length) || length == 0) {
                            return data
                        }
                        for (var i = 0; i < length; i++) {
                            var row = gridOptions.api.getPinnedBottomRow(i);
                            var rowdata = row.data;
                            $.each(columns, function (x, column) {
                                if (rowdata[column.colDef.field]) {
                                    var value = rowdata[column.colDef.field];
                                    if (angular.isFunction(column.colDef.valueFormatter)) {
                                        value = column.colDef.valueFormatter({
                                            value: value,
                                            column: column,
                                            node: row
                                        });
                                    }
                                    rowdata[column.colDef.field] = value;
                                }
                            });
                            data.push(rowdata);
                        }
                        return data;
                    },

                    /**
                     * 导出到Excel
                     * @return {Promise<undefined>}
                     */
                    exportToExcel: function () {
                        IncRequestCount();

                        var name = gridOptions.hcExcelFileName || gridOptions.hcName || (gridOptions.hcObjConf && gridOptions.hcObjConf.objtypename) || '导出数据';

                        return $q
                            .when()
                            .then(function () {
                                return {
                                    method: 'post',
                                    url: '/exportexcel',
                                    params: {
                                        id: new Date().getMilliseconds()
                                    },
                                    data: {
                                        name: name,
                                        export_title_setting: gridOptions.hcApi.getExportTitleSetting(),
                                        export_cols: gridOptions.columnApi.getAllDisplayedColumns().map(function (column) {
                                            return {
                                                field: column.colDef.field,
                                                name: column.colDef.headerName,
                                                width: column.actualWidth,
                                                type: column.colDef.type,
                                                pinned: column.pinned
                                            };
                                        }),
                                        export_datas: gridOptions.hcApi.getExportData(),
                                        export_top_datas: gridOptions.hcApi.getPinnedTopData(),
                                        export_bottom_datas: gridOptions.hcApi.getPinnedBottomData()
                                    },
                                    responseType: 'arraybuffer'
                                };
                            })
                            .then($http)
                            .finally(DecRequestCount)
                            .then(function (response) {
                                var data = new Blob([response.data], {
                                    type: 'application/vnd.ms-excel'
                                });

                                saveAs(data, name + '.xls');
                            }, function (response) {
                                console.error('导出异常', response);
                                return swalApi.error('导出异常：' + response.status).then($q.reject);
                            })
                            ;
                    },

                    /**
                     * 设置单元格值
                     * @param {*} aboutRow 行相关
                     * @param {*} aboutCol 列相关
                     * @param {*} value 值
                     */
                    setCellValue: function (aboutRow, aboutCol, value) {
                        aboutRow = gridOptions.hcApi.getAboutRow(aboutRow);
                        aboutCol = gridOptions.hcApi.getAboutCol(aboutCol);
                        return gridOptions.api.valueService.setValue(aboutRow.node, aboutCol.field, value);
                    },

                    /**
                     * 设置行数据
                     * @param {Object[]} rowData
                     */
                    setRowData: function (rowData) {
                        gridOptions.api.setRowData(rowData);
                        gridOptions.columnApi.autoSizeAllColumns();

                        gridScope.$evalAsync(function () {
                            gridScope.count = rowData ? rowData.length : 0;
                        });
                    },

                    /**
                     * 发请求后设置数据
                     * @since 2018-09-30
                     */
                    setDataAfterRequest: function (response, drName) {
                        var data = response[drName];
                        //设置数据
                        gridOptions.hcApi.setRowData(data);

                        //显示或隐藏空行标识
                        gridOptions.api.gridPanel.showOrHideOverlay();

                        //设置分页
                        if (response.pagination)
                            gridOptions.hcApi.setPagination(response.pagination);
                        else
                            gridScope.$evalAsync(function () {
                                if (data.length) gridScope.count = data.length;
                                else gridScope.count = 0;
                            });
                    },

                    /**
                     * 设置焦点单元格
                     * @param {number} rowIndex 行号
                     * @param {string} colKey 列键
                     * @param {boolean} [autoScroll=true] 是否自动滚动使单元可见
                     */
                    setFocusedCell: function (rowIndex, colKey, autoScroll) {
                        if (gridOptions.hcApi.isEmpty()) {
                            gridOptions.api.focusedCellController.clearFocusedCell();
                            gridOptions.api.rangeController.clearSelection();
                            return;
                        }

                        var oldFocusedCell = gridOptions.api.focusedCellController.getFocusedCell();

                        if (rowIndex === undefined) {
                            if (oldFocusedCell) {
                                rowIndex = oldFocusedCell.rowIndex;
                            }
                            else {
                                rowIndex = 0;
                            }
                        }

                        var rowCount = gridOptions.api.getModel().getRowCount();
                        if (rowIndex < 0) {
                            rowIndex = 0;
                        }
                        else if (rowIndex > rowCount - 1) {
                            rowIndex = rowCount - 1;
                        }

                        if (colKey === undefined) {
                            var column;

                            if (oldFocusedCell && oldFocusedCell.column) {
                                column = oldFocusedCell.column;
                            }
                            else {
                                column = gridOptions.columnApi.getAllDisplayedColumns()[0]
                            }

                            colKey = column.colDef.field;
                        }

                        //设置焦点单元格
                        gridOptions.api.focusedCellController.setFocusedCell(rowIndex, colKey, undefined, false);

                        //设置选择范围为焦点单元格
                        gridOptions.api.rangeController.setRangeToCell(gridOptions.api.getFocusedCell());

                        //滚动表格使焦点单元格可见
                        if (autoScroll !== false)
                            gridOptions.api.ensureIndexVisible(rowIndex);
                    },

                    getDefaultCellStyle: getDefaultCellStyle,

                    /**
                     * 获取分页信息，用于发请求之前
                     * @since 2018-09-30
                     */
                    getPagination: function () {
                        return 'pn=' + gridScope.currPage
                            + ',ps=' + gridScope.pageSize
                            + ',pc=' + gridScope.pageCount
                            + ',cn=' + gridScope.count;
                    },

                    /**
                     * 设置分页信息，用于发请求之后
                     * @since 2018-09-30
                     */
                    setPagination: function (pagination) {
                        if (pagination) {
                            var pageInfo = pagination.split(',');

                            gridScope.$evalAsync(function () {
                                gridScope.currPage = parseInt(pageInfo[0].split('=')[1]);
                                gridScope.pageSize = parseInt(pageInfo[1].split('=')[1]);
                                gridScope.pageCount = parseInt(pageInfo[2].split('=')[1]);
                                gridScope.count = parseInt(pageInfo[3].split('=')[1]);
                            });
                        }
                    },

                    /**
                     * 全选
                     * @since 2018-10-01
                     */
                    selectAll: function () {
                        gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                            node.setSelected(true);
                        });
                    },

                    /**
                     * 反选
                     * @since 2018-10-01
                     */
                    selectInverse: function () {
                        gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                            node.setSelected(!node.isSelected());
                        });
                    },

                    /**
                     * 返回选中的行节点组成的数组
                     * @param params = {
                     *     type: string focus - 焦点单元格所在的行、range - 范围选择的行、checkbox - 复选框勾选的行
                     * }
                     * @returns {Node[]}
                     * @since 2018-12-25
                     */
                    getSelectedNodes: function (params) {
                        if (angular.isString(params)) {
                            params = {
                                type: params
                            };
                        }
                        else
                            params = params || {};

                        if (params.type === 'auto') {
                            params.type = gridOptions.columnDefs[0].checkboxSelection ? 'checkbox' : 'range';
                        }

                        //通过焦点选择
                        if (params.type === 'focus') {
                            var node = gridOptions.hcApi.getFocusedNode();
                            return node ? [node] : [];
                        }
                        //通过范围选择
                        else if (params.type === 'range') {
                            var rangeSelections = gridOptions.api.getRangeSelections() || [];
                            var nodes = [];

                            rangeSelections.forEach(function (rangeSelection) {
                                var start = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex),
                                    end = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex) + 1;

                                loopApi.forLoop(
                                    start,
                                    end,
                                    function (rowIndex) {
                                        if (!nodes[rowIndex])
                                            nodes[rowIndex] = gridOptions.hcApi.getNodeOfRowIndex(rowIndex);
                                    }
                                );
                            });

                            nodes = nodes.filter(function (node) {
                                return !!node;
                            });

                            return nodes;
                        }
                        //通过复选框选择
                        else if (params.type === 'checkbox') {
                            return gridOptions.api.getSelectedNodes();
                        }
                        else {
                            throw new Error('必须通过参数【type】指定选择行的类型');
                        }
                    },

                    /**
                     * 返回选中的行节点的数据组成的数组
                     * @param params = {
                     *     type: string focus - 焦点单元格所在的行、range - 范围选择的行、checkbox - 复选框勾选的行
                     * }
                     * @returns {Data[]}
                     * @since 2019-03-13
                     */
                    getSelectedData: function (params) {
                        return gridOptions.hcApi.getSelectedNodes(params).map(function (node) {
                            return node.data;
                        });
                    },

                    /**
                     * 增加空行
                     * @since 2018-11-09
                     */
                    addEmptyRow: function () {
                        gridOptions.api.addItems([{}]);
                    },

                    /**
                     * 删除选中的行
                     */
                    removeSelections: function () {
                        var nodes = gridOptions.hcApi.getSelectedNodes('auto');

                        gridOptions.api.updateRowData({
                            remove: nodes.map(function (node) {
                                return node.data;
                            })
                        });

                        gridOptions.hcApi.setFocusedCell();
                    },

                    isEmpty: function () {
                        return gridOptions.api.getModel().getRowCount() === 0;
                    },

                    isNotEmpty: function () {
                        return !gridOptions.hcApi.isEmpty();
                    }
                };

                function handleError(err) {
                    console.error(err);
                    return swalApi.error(err).then($q.reject.bind($q, err));
                }

                //表格ID
                if (angular.isString(div) && div.charAt(0) !== '#')
                    div = '#' + div;

                //表格DOM元素
                $grid = $(div);
                if (!$grid.length) {
                    handleError('表格要依附的DOM元素' + div + '不存在');
                }

                //若没指定高度，也没设置自动高度，给一个默认高度
                /* if ($grid.height() <= 0 && $grid.is(':not([hc-auto-height])'))
                    $grid.height(300); */

                $grid.addClass('hc-grid');

                if (!angular.isArray(gridOptions.columnDefs)) {
                    handleError('options.columnDefs 未定义，请检查列定义和表格选项的顺序');
                }

                //重要：为表格创建独立作用域，并使DOM元素、作用域、表格选项产生关联
                if (gridOptions.hcScope)
                    gridScope = gridOptions.hcScope;
                else
                    gridScope = $grid.scope().$new(true);

                gridScope.$parent.gridCache = gridScope.$parent.gridCache || {};
                gridScope.$parent.gridCache[gridScope.$id] = gridOptions;

                //DOM元素关联 作用域 和 表格选项
                $grid.data('$scope', gridScope);
                $grid.data('gridOptions', gridOptions);
                //作用域 关联 DOM元素 和 表格选项
                gridScope.grid = $grid;
                gridScope.gridOptions = gridOptions;
                //表格选项 关联 DOM元素 和 作用域
                gridOptions.hcGrid = $grid;
                gridOptions.hcScope = gridScope;

                //表单控制器
                var $formController = $grid.controller('form');

                //停止编辑所有表格的函数，注入到父作用域
                gridScope.$parent.stopEditingAllGrid = (function () {
                    //可能会有多个表格，把每个表格的函数都执行1次
                    var fn = gridScope.$parent.stopEditingAllGrid || angular.noop;

                    return function () {
                        fn();
                        gridOptions.api.stopEditing();
                    };
                })();

                var promiseOfObjConf;
                if (gridOptions.hcObjConf) {
                    promiseOfObjConf = $q.resolve(gridOptions.hcObjConf);

                    var lastIndexOfDot = gridOptions.hcObjConf.javaname.lastIndexOf('.');

                    if (lastIndexOfDot >= 0)
                        gridOptions.hcClassId = gridOptions.hcObjConf.javaname.substr(lastIndexOfDot + 1);
                    else
                        gridOptions.hcClassId = gridOptions.hcObjConf.javaname;

                    gridOptions.hcClassId = gridOptions.hcClassId.toLowerCase();
                }
                else if (gridOptions.hcObjType) {
                    promiseOfObjConf = requestApi.getObjConf(gridOptions.hcObjType).then(function (response) {
                        if (response.javaname) {
                            gridOptions.hcObjConf = response;

                            var lastIndexOfDot = response.javaname.lastIndexOf('.');

                            if (lastIndexOfDot >= 0)
                                gridOptions.hcClassId = response.javaname.substr(lastIndexOfDot + 1);
                            else
                                gridOptions.hcClassId = response.javaname;

                            gridOptions.hcClassId = gridOptions.hcClassId.toLowerCase();
                        }
                    });
                }
                else
                    promiseOfObjConf = $q.reject();


                //取出有词汇编码的列
                // var dictColDefs = gridOptions.columnDefs.filter(function (colDef) {
                //     return colDef.hcDictCode && angular.isString(colDef.hcDictCode);
                // });

                /**
                 * 取出有词汇编码的列
                 * @param colDef
                 */
                function columnDefsfilter(colDefObj) {
                    var isArray = function isArray(obj) {
                        return Object.prototype.toString.call(obj) === '[object Array]';
                    }

                    if (isArray(colDefObj)) {
                        for (var r = 0; r < colDefObj.length; r++) {
                            columnDefsfilter(colDefObj[r]);
                        }
                    }
                    else if (colDefObj.children && isArray(colDefObj.children)) {
                        $.each(colDefObj.children, function (i, item) {
                            columnDefsfilter(item);
                        })
                    }
                    else if (!colDefObj.children) {
                        if (colDefObj.hcDictCode && angular.isString(colDefObj.hcDictCode)) {
                            dictColDefs.push(colDefObj);
                        }
                        if (colDefObj.hcCommonSearch || colDefObj.hcButtonClick) {
                            colDefObj.type = '按钮';
                        }
                    }
                }

                var dictColDefs = [];
                columnDefsfilter(gridOptions.columnDefs);//取出有词汇编码的列


                if (dictColDefs.length) {
                    dictColDefs.forEach(function (colDef) {
                        colDef.type = '词汇';

                        if (colDef.hcDictCode === '*' || colDef.hcDictCode === '.')
                            colDef.hcDictCode = colDef.field;
                    });

                    //查询词汇的承诺
                    var dictPromises = dictColDefs.map(function (colDef) {
                        var names = [], values = [];

                        //编辑器参数
                        colDef.cellEditorParams = {
                            names: names,
                            values: values,
                            cellRenderer: function (params) {
                                if (names.length && values.length && names.length === values.length) {
                                    var index = values.findIndex(function (value) {
                                        return value == params.value;
                                    });

                                    if (index >= 0)
                                        return names[index];
                                }

                                return ''/*params.value*/;
                            }
                        };

                        return requestApi.getDict(colDef.hcDictCode)
                            .then(function (dicts) {
                                dicts.forEach(function (dict) {
                                    names.push(dict.dictname);
                                    values.push(dict.dictvalue);
                                });
                            });
                    });

                    //查询完成后，刷新视图
                    $q
                        .all(dictPromises.concat(gridOptions.hcReady))
                        .then(function () {
                            gridOptions.api.refreshView();
                        })
                        ;
                }

                forEachChildColumnDef(function (colDef) {
                    if (!colDef.hcImgIdField) return;

                    if (!colDef.type) {
                        colDef.type = '图片';
                    }
                });

                forEachChildColumnDef(function (colDef) {
                    //若有行合并，禁用排序
                    if (colDef.rowSpan && gridOptions.enableSorting === undefined) {
                        gridOptions.enableSorting = false;
                    }
                });

                /**
                 * 获取默认的单元格样式，该样式在defaultColDef中定义
                 * @param {Object} params
                 * @return {Object}
                 */
                function getDefaultCellStyle(params) {
                    var style = {};

                    if (gridOptions.defaultColDef) {
                        var defaultStyle = gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }

                    return style;
                }

                //默认的表格选项
                var defaultGridOptions = {
                    suppressColumnVirtualisation: true, //表格不可见时，大部分效果不会渲染，必须关闭虚拟列技术，使其渲染所有列。但在数据较多时不建议这么做，会影响性能
                    enableRangeSelection: true, //允许范围选择
                    enableColResize: true, //允许调整列宽
                    hcTheme: 'ag-blue', //主题
                    suppressRowClickSelection: true, //禁用【点击行后选中该行】
                    suppressDragLeaveHidesColumns: true, //禁用【把列移出表格代表隐藏列】
                    suppressLoadingOverlay: true, //禁用【加载中】标识
                    // suppressNoRowsOverlay: true, //禁用【空表】标识
                    overlayNoRowsTemplate: '<div class="hc-empty"></div>', //【空表】标识自定义渲染
                    suppressAsyncEvents: true, //禁用【异步事件】
                    suppressPropertyNamesCheck: true, //禁用【属性名称检查】
                    enableFilter: true, //激活【过滤器】
                    // enableSorting: true, //激活【排序器】
                    animateRows: true, //启用行动画
                    autoSizePadding: 4, //自动调整列宽时的水平内边距
                    rowBuffer: 20, //渲染缓冲行数，默认值：10
                    processCellForClipboard: function (params) { //复制单元格的值时，对值进行处理
                        var colDef = params.column.colDef,
                            type = params.column.colDef.type,
                            typeColDef = params.api.gridOptionsWrapper.gridOptions.columnTypes[type],
                            defaultColDef = params.api.gridOptionsWrapper.gridOptions.defaultColDef,
                            useFormatter = false,
                            valueFormatter = null,
                            value;

                        [defaultColDef, typeColDef, colDef].forEach(function (def) {
                            if (!def) return;

                            if (def.hcUseFormatterWhenCopy !== undefined)
                                useFormatter = def.hcUseFormatterWhenCopy;

                            if (def.valueFormatter !== undefined)
                                valueFormatter = def.valueFormatter;
                        });

                        if (useFormatter && angular.isFunction(valueFormatter)) {
                            value = valueFormatter({
                                value: params.value,
                                node: params.node,
                                data: params.node ? params.node.data : null,
                                colDef: params.column.getColDef(),
                                column: params.column,
                                api: params.api,
                                columnApi: params.columnApi,
                                context: params.context
                            });
                        }
                        else {
                            value = params.value;
                        }

                        return value;
                    },
                    processDataFromClipboard: function (params) { //粘贴数据到表格时，对整体数据处理
                        var data = params.data;

                        (function () {
                            var row;

                            //去空格
                            if (data.length) {
                                data.forEach(function (row) {
                                    row.forEach(function (cell, col, row) {
                                        if (typeof cell !== 'string') return;

                                        row[col] = cell.trim();
                                    });
                                });
                            }

                            //裁剪尾随的空行
                            while (data.length) {
                                row = data.pop();

                                if (row.length > 1 || row[0]) {
                                    data.push(row);
                                    break;
                                }
                            }
                        })();

                        //若开启了【粘贴时自动添加行】功能
                        //计算是否需要增加行
                        //当前行号 + 粘贴行数 > 总行数时，需要增加  当前行号 + 粘贴行数 - 总行数
                        IfElse.if(gridOptions.hcAutoAddRowWhenPaste, function () {
                            var addRowCount = gridOptions.hcApi.getFocusedRowIndex() + data.length - gridOptions.api.getModel().getRowCount();

                            if (addRowCount > 0) {
                                var rows = [];

                                loopApi.forLoop(addRowCount, function () {
                                    //增加空行
                                    rows.push({});
                                });

                                gridOptions.api.updateRowData({
                                    add: rows
                                });

                                //若是有数组引用，一并加上
                                if (gridOptions.rowData)
                                    Array.prototype.push.apply(gridOptions.rowData, rows);

                                var $scope = gridOptions.hcScope.$parent;
                                if (gridOptions === $scope.$eval('data.currGridOptions')) {
                                    var gridModel = $scope.$eval('data.currGridModel');

                                    var getRowData = $parse(gridModel);
                                    var setRowData = getRowData.assign;

                                    getRowData = getRowData.bind(null, $scope);
                                    setRowData = setRowData.bind(null, $scope);

                                    if (gridModel) {
                                        var rowData = getRowData();

                                        if (!Array.isArray(rowData)) {
                                            rowData = [];
                                            setRowData(rowData);
                                        }

                                        Array.prototype.push.apply(rowData, rows);
                                    }
                                }
                            }
                        });

                        //对粘贴内容进行验证
                        IfElse.if(data.length, function () {
                            var cell = gridOptions.api.getFocusedCell();

                            var nodes = gridOptions.api.rowModel.rowsToDisplay;
                            var startRowIndex = cell.rowIndex;
                            var endRowIndex = Math.min(startRowIndex + data.length, nodes.length);

                            var columns = gridOptions.columnApi.getAllDisplayedColumns();
                            var startColIndex = columns.indexOf(cell.column);
                            var endColIndex = Math.min(startColIndex + data[0].length, columns.length);

                            loopApi.forLoop(startRowIndex, endRowIndex, function (rowIndex) {
                                var node = nodes[rowIndex];
                                var values = data[rowIndex - startRowIndex];

                                loopApi.forLoop(startColIndex, endColIndex, function (colIndex) {
                                    var column = columns[colIndex];

                                    //若单元格不可编辑，无需验证
                                    if (!column.isCellEditable(node)) {
                                        return;
                                    }

                                    var value = values[colIndex - startColIndex];
                                    var params = column.createBaseColDefParams(node);
                                    params.value = params.api.getValue(column, node);
                                    values[colIndex - startColIndex] = validate(value, params);
                                });
                            });
                        });

                        return data;
                    },
                    processCellFromClipboard: function (params) { //粘贴数据到表格时，对单个单元格的数据处理
                        var value = params.value, valueParser, valueParserParams;

                        //若有值解析器
                        if (valueParser = params.column.getColDef().valueParser) {
                            //解析粘贴值
                            value = valueParser({
                                node: params.node,
                                data: params.node ? params.node.data : null,
                                oldValue: params.api.getValue(params.column.getColId(), params.node),
                                newValue: params.value,
                                colDef: params.column.getColDef(),
                                column: params.column,
                                api: params.api,
                                columnApi: params.columnApi,
                                context: params.context
                            });
                        }

                        return value;
                    },
                    //注册组件
                    components: {
                        //==================== 单元格渲染器 ====================

                        //==================== 单元格编辑器 ====================
                        'HcSelectCellEditor': HcSelectCellEditor			//下拉
                    },
                    //列默认属性
                    defaultColDef: {
                        // headerName: '尚未定义列名',
                        tooltip: function (params) { //提示
                            return params.valueFormatted != null ? params.valueFormatted : params.value;
                        },
                        width: 120, //默认列宽
                        minWidth: 60, //最小列宽
                        maxWidth: 600, //最大列宽
                        // suppressMenu: true, //禁用头部菜单
                        menuTabs: ['filterMenuTab', 'generalMenuTab'], //头部菜单
                        headerCheckboxSelectionFilteredOnly: true, //全选时，只勾选通过过滤器的行
                        filter: 'agTextColumnFilter', //默认过滤器
                        filterParams: {
                            clearButton: true //按钮【清除过滤】
                        },
                        //值解析器
                        valueParser: function (params) {
                            var value = params.newValue;

                            //若值是字符串，去前后空格
                            if (typeof value === 'string')
                                value = value.trim();

                            return value;
                        },
                        cellClassRules: {
                            //可编辑
                            'hc-cell-editable': function (params) {
                                var editable = params.colDef.editable;

                                //若单元格是可编辑的，添加样式类
                                return (editable === true || (angular.isFunction(editable) && editable(params) === true));
                            },
                            //有合并单元格
                            'hc-cell-row-span': function (params) {
                                return !!params.colDef.rowSpan;
                            },
                            //合并单元格后只占1行
                            'hc-cell-row-span-one': function (params) {
                                if (!params.colDef.rowSpan) return false;

                                var rowSpan = +params.colDef.rowSpan(params);

                                if (rowSpan < 1) rowSpan = 1;

                                return rowSpan == 1;
                            },
                            //合并单元格后占用多行
                            'hc-cell-row-span-multi': function (params) {
                                if (!params.colDef.rowSpan) return false;

                                var rowSpan = +params.colDef.rowSpan(params);

                                if (rowSpan < 1) rowSpan = 1;


                                return rowSpan > 1;
                            },
                            'ag-cell--auto-wrap': function (params) {
                                return params.colDef.hcAutoWrap;
                            }
                        },
                        cellRenderer: DefaultCellRenderer,
                        cellEditor: DefaultCellEditor
                    },
                    //列类型
                    columnTypes: {
                        '复选框': {
                            field: '_checkbox',
                            headerName: '',
                            checkboxSelection: true, //复选框
                            headerCheckboxSelection: true, //头部复选框
                            pinned: 'left', //序号列左侧固定
                            suppressMovable: true, //禁止移动
                            width: 38, //默认序号列宽
                            minWidth: 38, //默认序号最小列宽
                            maxWidth: 38, //默认序号最大列宽
                            suppressResize: true, //禁止调宽度
                            suppressSizeToFit: true, //禁止适应宽度
                            suppressAutoSize: true, //禁止自动宽度
                            suppressMenu: true, //禁用头部菜单
                            editable: false, //不可编辑
                            hcExcludeSqlWhere: true, //不参与生成条件
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'justify-content': 'center',
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '序号': {
                            field: 'seq', //默认序号字段名
                            // headerName: '序号',  //默认序号标题
                            headerValueGetter: function (params) {
                                if (params.colDef.headerCheckboxSelection)
                                    return '';

                                return '序号';
                            },
                            pinned: 'left', //序号列左侧固定
                            suppressMovable: true, //禁止移动
                            width: 48, //默认序号列宽
                            minWidth: 48, //默认序号最小列宽
                            maxWidth: 48, //默认序号最大列宽
                            suppressResize: true, //禁止调宽度
                            suppressSizeToFit: true, //禁止适应宽度
                            suppressAutoSize: true, //禁止自动宽度
                            suppressMenu: true, //禁用头部菜单
                            editable: false, //不可编辑
                            hcExcludeSqlWhere: true, //不参与生成条件
                            filter: 'agNumberColumnFilter', //过滤器
                            valueGetter: function (params) {
                                if (params && params.node && params.node.id)
                                    return params.node.rowIndex + 1;

                                return params.node.data.seq || '';
                            }, //取值函数：行索引+1
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '金额': {
                            filter: 'agNumberColumnFilter', //过滤器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                return numberApi.toMoney(params.value);
                            },
                            valueParser: function (params) {
                                return numberApi.normalizeAsNumber(params.newValue);
                            },
                            cellEditorParams: {
                                parseValue: numberApi.normalizeAsNumber
                            }
                        },
                        '万元': {
                            hcUseFormatterWhenCopy: true,
                            filter: 'agNumberColumnFilter', //过滤器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                var value = numberApi.normalizeAsNumber(params.value);

                                if (value) {
                                    value = value / 1e4;
                                }

                                return numberApi.formatNumber(value);
                            },
                            valueParser: function (params) {
                                var value = numberApi.normalizeAsNumber(params.newValue);

                                if (value) {
                                    value = value * 1e4;
                                }

                                return value;
                            },
                            cellEditor: wanYuanEditor //编辑器
                        },
                        '百分比': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agNumberColumnFilter', //过滤器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                if (params.value === undefined || params.value !== params.value) {
                                    return '';
                                }
                                else return numberApi.mutiply(params.value, 100).toFixed(2) + "%";
                            },
                            valueParser: function (params) {
                                params.newValue = numberApi.toNumber(params.newValue);
                                if (!params.newValue || !numberApi.isNum(params.newValue)) {
                                    return 0;
                                }
                                if (0 < parseFloat(params.newValue) > 100) {
                                    return 0;
                                }

                                return numberApi.divide(params.newValue.toFixed(2), 100);
                            },
                            cellEditor: percentEditor, //编辑器
                        },
                        '百分比不转换': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                if (params.value === undefined || params.value !== params.value) {
                                    return '';
                                }
                                else return parseFloat(params.value).toFixed(2) + "%";
                            }
                        },
                        '数量': {
                            filter: 'agNumberColumnFilter', //过滤器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                return numberApi.formatNumber(params.value);
                            },
                            cellEditorParams: {
                                parseValue: numberApi.normalizeAsNumber
                            }
                        },
                        '体积': {
                            filter: 'agNumberColumnFilter', //过滤器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居中
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                return numberApi.formatNumber(params.value, 4);
                            },
                            cellEditorParams: {
                                parseValue: numberApi.normalizeAsNumber
                            }
                        },
                        '词汇': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agSetColumnFilter', //过滤器
                            cellEditor: HcSelectCellEditor, //编辑器
                            // cellEditor: 'richSelect', //编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                var cellEditorParams = params.column.colDef.cellEditorParams;

                                if (cellEditorParams
                                    && cellEditorParams.values.length
                                    && cellEditorParams.names.length
                                    && cellEditorParams.values.length === cellEditorParams.names.length) {
                                    var index = cellEditorParams.values.findIndex(function (value) {
                                        return value == params.value;
                                    });

                                    if (index >= 0)
                                        return cellEditorParams.names[index];
                                }

                                return '';
                            },

                            //值解析器
                            valueParser: function (params) {
                                var cellEditorParams = params.column.colDef.cellEditorParams;

                                var index = cellEditorParams.names.findIndex(function (name) {
                                    return name == params.newValue;
                                });

                                if (index >= 0)
                                    return cellEditorParams.values[index];

                                return undefined;
                            },

                            //过滤器参数
                            /* filterParams: {
                                //值要转为名称后过滤
                                valueGetter: function (node) {
                                    var value = node.data[this.colDef.field];

                                    //这里的  this  指向过滤器组件，过滤器组件保存了  colDef
                                    value = this.colDef.valueFormatter({
                                        value: value,
                                        column: {
                                            colDef: this.colDef
                                        }
                                    });

                                    return value;
                                }
                            }, */
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '大文本': {
                            minWidth: 300, //最小列宽
                            width: 300, //列宽
                            cellEditor: agGrid.CellEditorFactory.LARGE_TEXT //编辑器
                        },
                        '日期': {
                            filter: 'agDateColumnFilter',                           //过滤器
                            filterParams: {                                         //过滤器参数
                                inRangeInclusive: true,                             //区间是否闭区间
                                comparator: function (filterDate, cellValue) {      //比较器
                                    filterDate = filterDate.Format('yyyy-MM-dd');
                                    cellValue = (cellValue || '').substr(0, 10);
                                    if (cellValue < filterDate) {
                                        return -1;
                                    }
                                    if (cellValue > filterDate) {
                                        return 1;
                                    }
                                    return 0;
                                }
                            },
                            minWidth: 90, //最小列宽
                            width: 90, //列宽
                            cellEditor: HcDateCellEditor, //编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                if (angular.isString(params.value) && params.value.length > 10)
                                    return params.value.substr(0, 10);

                                return params.value;
                            },
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '时间': {
                            filter: 'agDateColumnFilter',                           //过滤器
                            filterParams: {                                         //过滤器参数
                                inRangeInclusive: true,                             //区间是否闭区间
                                comparator: function (filterDate, cellValue) {      //比较器
                                    filterDate = filterDate.Format('yyyy-MM-dd hh:mm:ss');
                                    if (cellValue < filterDate) {
                                        return -1;
                                    }
                                    if (cellValue > filterDate) {
                                        return 1;
                                    }
                                    return 0;
                                }
                            },
                            minWidth: 140, //最小列宽
                            width: 140, //列宽
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '是否': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agSetColumnFilter', //过滤器
                            //取值器
                            valueGetter: function (params) {
                                return params.data[params.colDef.field] == 2 ? 2 : 0;
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                return params.value == 2 ? '是' : '否';
                            },
                            //值解析器
                            valueParser: function (params) {
                                return (params.newValue === '是' || params.newValue == 2) ? 2 : 0;
                            },
                            // cellEditor: DropDownCellEditor, //编辑器
                            /* cellEditorParams: {
                                values: [2, 1],
                                names: ["是", "否"]
                            }, */
                            cellRenderer: HcCheckboxCellRenderer,
                            cellEditor: HcCheckboxCellEditor,
                            //过滤器参数
                            /* filterParams: {
                                //值要转为名称后过滤
                                valueGetter: function (node) {
                                    var value = node.data[this.colDef.field];

                                    //这里的  this  指向过滤器组件，过滤器组件保存了  colDef
                                    value = this.colDef.valueFormatter({
                                        value: value,
                                        column: {
                                            colDef: this.colDef
                                        }
                                    });

                                    return value;
                                }
                            }, */
                        },
                        '否是': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agSetColumnFilter', //过滤器
                            //取值器
                            valueGetter: function (params) {
                                return params.data[params.colDef.field] == 2 ? 2 : 0;
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                return params.value == 2 ? '否' : '是';
                            },
                            //值解析器
                            valueParser: function (params) {
                                return (params.newValue === '否' || params.newValue == 2) ? 2 : 0;
                            },
                        },
                        '下拉': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agSetColumnFilter', //过滤器
                            cellEditor: HcSelectCellEditor,//编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                var cellEditorParams = params.column.colDef.cellEditorParams;

                                if (cellEditorParams
                                    && cellEditorParams.values.length
                                    && cellEditorParams.names.length
                                    && cellEditorParams.values.length === cellEditorParams.names.length) {
                                    var index = cellEditorParams.values.findIndex(function (value) {
                                        return value == params.value;
                                    });

                                    if (index >= 0)
                                        return cellEditorParams.names[index];
                                }

                                return '';
                            },
                            //过滤器参数
                            /* filterParams: {
                                //值要转为名称后过滤
                                valueGetter: function (node) {
                                    var value = node.data[this.colDef.field];

                                    //这里的  this  指向过滤器组件，过滤器组件保存了  colDef
                                    value = this.colDef.valueFormatter({
                                        value: value,
                                        column: {
                                            colDef: this.colDef
                                        }
                                    });
                                    return value;
                                }
                            }, */
                            cellStyle: function (params) {//单元格样式
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                        },
                        '多选': {
                            hcUseFormatterWhenCopy: true, //复制时使用格式化器
                            filter: 'agSetColumnFilter', //过滤器
                            cellEditor: HcSelectCellEditor,//编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                var cellEditorParams = params.column.colDef.cellEditorParams;

                                var strarr = params.value.split(",");
                                strarr = HczyCommon.stringPropToNum(strarr);

                                if (cellEditorParams
                                    && cellEditorParams.values.length
                                    && cellEditorParams.names.length
                                    && cellEditorParams.values.length === cellEditorParams.names.length) {

                                    var indexs = [];
                                    strarr.forEach(function (str) {
                                        var index = cellEditorParams.values.findIndex(function (value) {
                                            return value == str;
                                        });
                                        indexs.push(index);
                                    })

                                    if (indexs.length >= 0) {
                                        var str = '';
                                        indexs.forEach(function (index) {
                                            str += cellEditorParams.names[index] + ",";
                                        })
                                        str = str.substring(0, str.lastIndexOf(','));
                                        return str;
                                    }
                                    return;
                                }

                                return '';
                            },
                            //过滤器参数
                            /* filterParams: {
                                //值要转为名称后过滤
                                valueGetter: function (node) {
                                    var value = node.data[this.colDef.field];

                                    //这里的  this  指向过滤器组件，过滤器组件保存了  colDef
                                    value = this.colDef.valueFormatter({
                                        value: value,
                                        column: {
                                            colDef: this.colDef
                                        }
                                    });
                                    return value;
                                }
                            }, */
                            cellStyle: function (params) {//单元格样式
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        },
                        '年月': {
                            cellEditor: YearMonthCellEditor, //编辑器
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                            minWidth: 90, //最小列宽
                            width: 90, //列宽
                            //值格式化器
                            valueFormatter: function (params) {
                                if (angular.isString(params.value) && params.value.length > 7)
                                    return params.value.substr(0, 7);

                                return params.value;
                            }
                        },
                        '单位': {
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                        },
                        '按钮': {
                            cellRenderer: HcButtonInputCellRenderer,
                            cellEditor: HcCheckboxCellEditor
                        },
                        '图片': {
                            autoHeight: true,
                            cellStyle: {
                                'justify-content': 'center',
                                'text-align': 'center'
                            },
                            cellRenderer: HcImgCellRenderer
                        },
                        'test': {
                            cellRenderer: HcButtonInputCellRenderer
                        }
                    },
                    //状态栏
                    statusBar: {
                        statusPanels: []
                    },
                    //汉化
                    localeText: {
                        // for filter panel
                        page: 'daPage',
                        more: 'daMore',
                        to: 'daTo',
                        of: 'daOf',
                        next: '下一个',
                        last: '最后一个',
                        first: '第一个',
                        previous: '前一个',
                        loadingOoo: '加载中...',

                        // for set filter
                        selectAll: '所有',
                        searchOoo: '请输入搜索内容...',
                        blanks: '空白',

                        // for number filter and text filter
                        filterOoo: '请输入过滤值',
                        applyFilter: '应用过滤',
                        clearFilter: '清除过滤',

                        and: '且',
                        or: '或',

                        // for number filter
                        equals: '等于',
                        notEqual: '不等于',
                        greaterThan: '大于',
                        greaterThanOrEqual: '大于等于',
                        lessThan: '小于',
                        lessThanOrEqual: '小于等于',
                        inRange: '区间',

                        // for text filter
                        contains: '包含',
                        notContains: '不包含',

                        startsWith: '以此开头',
                        endsWith: '以此结尾',

                        // the header of the default group column
                        group: '单列分组',

                        // tool panel
                        columns: '多列',
                        rowGroupColumns: '分组列',
                        rowGroupColumnsEmptyMessage: '拖拽分组区域',
                        valueColumns: '求值列',
                        pivotMode: '固定列模块',
                        groups: '多列分组',
                        values: '多列求值',
                        pivots: '多列固定',
                        valueColumnsEmptyMessage: '拖拽固定区域',
                        pivotColumnsEmptyMessage: '拖拽求值区域',

                        // other
                        noRowsToShow: '表格为空',

                        // enterprise menu
                        pinColumn: '固定列',
                        valueAggregation: '求平均值',
                        autosizeThiscolumn: '当前列宽度自适应',
                        autosizeAllColumns: '所有列宽度自适应',
                        groupBy: '当前列分组',
                        ungroupBy: '分组还原',
                        resetColumns: '恢复列宽',
                        expandAll: '伸展',
                        collapseAll: '收缩',
                        toolPanel: '工具版面',
                        export: '导出',
                        csvExport: 'CSV导出',
                        excelExport: 'Excel导出',

                        // enterprise menu pinning
                        pinLeft: '列左固定',
                        pinRight: '列右固定',
                        noPin: '不固定',

                        // enterprise menu aggregation and status panel
                        sum: '求和',
                        min: '最小值',
                        max: '最大值',
                        none: '空',
                        count: '次数',
                        average: '平均',

                        // standard menu
                        copy: '复制内容',
                        copyWithHeaders: '复制内容和标题',
                        ctrlC: 'Ctrl C',
                        paste: '粘贴',
                        ctrlV: 'Ctrl V'
                    },
                    icons: {
                        clipboardCopy: '<i class="iconfont hc-fuzhi" />',
                        clipboardPaste: '<i class="iconfont hc-zhantie" />'
                    },
                    //右键菜单
                    getContextMenuItems: function (params) {
                        var items = [];

                        //若没有禁止复制
                        if (params.column && !gridOptions.hcNoCopy) {
                            items.push('copy', 'copyWithHeaders', 'separator');
                        }

                        //若没有禁止Excel导出
                        if (gridOptions.suppressExcelExport !== true) {
                            var accessible = false;

                            if (userbean.isAdmin || userbean.isAdmins) {
                                accessible = true;
                            }

                            if (!accessible) {
                                accessible = gridOptions.hcScope.$parent.$eval('!data.objConf || data.objConf.isAllowed("export") === true');
                            }

                            if (!accessible && gridOptions.hcCanExportRoles) {
                                var roles = gridOptions.hcCanExportRoles.split(/[,，]+/);

                                accessible = roles.some(function (role) {
                                    role = role.trim();
                                    return role && userbean.hasRole(role, false);
                                });
                            }

                            if (accessible) {
                                items.push({
                                    name: 'Excel导出',
                                    action: gridOptions.hcApi.exportToExcel,
                                    icon: '<i class="iconfont hc-daochu" />'
                                }, 'separator');
                            }
                        }

                        if (gridOptions.hcGlobalSaveGuid) {
                            items = items.concat([
                                {
                                    name: '保存网格配置',
                                    action: gridOptions.hcApi.saveGridOption,
                                    icon: '<i class="iconfont hc-baocun" />'
                                },
                                {
                                    name: '清空网格配置',
                                    action: gridOptions.hcApi.delectGridOption,
                                    icon: '<i class="iconfont hc-delete" />'
                                }
                            ])
                        }

                        return items;
                    },
                    //列标题菜单
                    getMainMenuItems: function (params) {
                        var items = params.defaultItems.filter(function (item) {
                            return ['toolPanel'].indexOf(item) < 0; //右键菜单去除【工具面板】
                        });
                        return items;
                    }
                };

                //预定义表格选项
                gridPredefine(gridOptions, defaultGridOptions);

                //序号+复选框 拆分
                (function () {
                    var firstColDef = gridOptions.columnDefs && gridOptions.columnDefs[0];

                    if (firstColDef && firstColDef.type === '序号' && firstColDef.checkboxSelection) {
                        delete firstColDef.checkboxSelection;
                        gridOptions.columnDefs.unshift({
                            type: '复选框'
                        });
                    }
                })();

                forEachChildColumnDef(function (colDef) {
                    if (colDef.type === '序号') {
                        //序号列宽度固定
                        colDef.maxWidth = defaultGridOptions.columnTypes['序号'].maxWidth;
                        colDef.width = colDef.maxWidth;

                        if (colDef.field && !colDef.valueGetter) {
                            colDef.valueGetter = function (params) {
                                return params.node.data[colDef.field];
                            };
                        }
                    }

                    if (colDef.rowSpan && gridOptions.suppressRowTransform === undefined) {
                        gridOptions.suppressRowTransform = true;
                    }

                    if (colDef.hcAutoWrap) {
                        if (colDef.suppressAutoSize === false) {
                            console.warn('启用自动换行时，将禁用自动宽度，你设置的 suppressAutoSize = false 无效');
                        }
                        colDef.suppressAutoSize = true;

                        if (colDef.autoHeight === false) {
                            console.warn('启用自动换行时，将启用自动高度，你设置的 autoHeight = false 无效');
                        }
                        colDef.autoHeight = true;
                    }
                });

                //提示字段默认为自身
                /* forEachChildColumnDef(function (colDef) {
                    if (!colDef.tooltipField && colDef.field)
                        colDef.tooltipField = colDef.field;
                }); */

                //把默认选项也返回去
                gridOptions.hcDefaultOptions = defaultGridOptions;

                //ag-grid本该支持的列类型定义失效了，只好自己来
                //若换成了正常的ag-grid版本，可注释这段代码
                /* if (gridOptions.columnDefs.length) {
                    forEachColumnDef(function (colDef) {
                        if (angular.isString(colDef.type)) {
                            var colDefOfType = gridOptions.columnTypes[colDef.type];
                            if (angular.isObject(colDefOfType))
                                gridPredefine(colDef, colDefOfType);
                        }
                    });
                } */

                //必须确保每一列都有最小宽度，否则当表格从隐藏到显示时，列会挤在一起
                /* forEachChildColumnDef(function (colDef) {
                    if (colDef.width && !colDef.minWidth)
                        colDef.minWidth = colDef.width;

                    var colDefOfType;

                    if (colDef.type)
                        colDefOfType = gridOptions.columnTypes[colDef.type];

                    var actualColDef = angular.extend({}, gridOptions.defaultColDef, colDefOfType, colDef);

                    if (actualColDef.headerName) {
                        var headerNameVisionLength = actualColDef.headerName.length;

                        loopApi.forLoop(actualColDef.headerName.length, function (i) {
                            if (actualColDef.headerName.charCodeAt(i) > 255)
                                headerNameVisionLength++;
                        });

                        var suitableMinWidth = headerNameVisionLength * 13 / 2 + 25;
                        if (!actualColDef.minWidth || actualColDef.minWidth < suitableMinWidth)
                            colDef.minWidth = suitableMinWidth;
                    }

                    if (colDef.width && colDef.minWidth && colDef.width < colDef.minWidth)
                        colDef.width = colDef.minWidth;
                }); */

                //新版本的agGrid用的是valueFormatter，旧版本用的是cellFormatter
                //兼容旧版本的agGrid
                forEachChildColumnDef(function (colDef) {
                    if (colDef.valueFormatter)
                        colDef.cellFormatter = colDef.valueFormatter;
                });

                //和表单结合实现共性只读条件
                if ($formController) {
                    var processEditable = function (colDef) {
                        if (colDef.editable !== true && !angular.isFunction(colDef.editable)) return;

                        function formIsReadonly() {
                            return $formController.isReadonly && $formController.isReadonly();
                        }

                        function isReadonlyByObjConf() {
                            var readonlyRules = gridScope.$parent.$eval('data.objConf.readonlyRules') || [],
                                myReadonlyRules = readonlyRules.filter(function (rule) {
                                    var gridRule = rule.grids[$grid.attr('hc-grid')];

                                    if (!gridRule) return false;

                                    return gridRule.fields === 'all' || gridRule.fields.indexOf(colDef.field) >= 0;
                                });

                            if (myReadonlyRules.length) {
                                var editable = false, readonly = false;

                                myReadonlyRules.forEach(function (rule) {
                                    if (rule.readonly == 1) {
                                        editable = true;
                                    }
                                    else if (rule.readonly == 2) {
                                        readonly = true;
                                    }
                                });

                                //若有矛盾的规则，保险起见，设为只读
                                if (editable && readonly) {
                                    return true;
                                }

                                //有可编辑的规则
                                if (editable) {
                                    return false;
                                }

                                //有只读的规则
                                if (readonly) {
                                    return true;
                                }
                            }

                            return formIsReadonly();
                        }

                        if (colDef.editable === true) {
                            colDef.editable = function () {
                                if (!$formController.editing) {
                                    return false;
                                }

                                return !isReadonlyByObjConf();
                            };
                        }
                        else {
                            var editable = colDef.editable;
                            colDef.editable = function () {
                                if ($formController.isReadonly && !$formController.editing) {
                                    return false;
                                }

                                return editable.apply(this, arguments) && !isReadonlyByObjConf();
                            }
                        }
                    };

                    processEditable(gridOptions.defaultColDef);

                    forEachChildColumnDef(processEditable);
                }

                function columnHasCheckBox(colDef) {
                    return colDef.checkboxSelection === true || angular.isFunction(colDef.checkboxSelection) || colDef.type === '复选框';
                }

                forEachChildColumnDef(function (colDef) {
                    if (colDef.checkboxSelection) {
                        colDef.type = '复选框';
                    }
                });

                forEachChildColumnDef(function (colDef) {
                    if (colDef.headerCheckboxSelection === undefined && columnHasCheckBox(colDef))
                        colDef.headerCheckboxSelection = true;
                });

                //是否有勾选框
                gridScope.isCheckbox = gridOptions.columnDefs.some(columnHasCheckBox);

                if (gridScope.isCheckbox)
                    gridOptions.rowSelection = 'multiple';

                //主题
                if (gridOptions.hcTheme)
                    $grid.addClass(gridOptions.hcTheme);

                gridOptions.statusBar.statusPanels.push({
                    key: 'hcGridPaging',
                    statusPanel: HcPagingStatusPanel,
                    statusPanelParams: {
                        $scope: gridScope
                    }
                });

                if (gridOptions.hcLeftButtons) {
                    gridOptions.statusBar.statusPanels.push({
                        key: 'hcLeftButtons',
                        statusPanel: HcButtonStatusPanel,
                        statusPanelParams: {
                            $scope: gridScope,
                            buttonOptionsKey: 'hcLeftButtons'
                        },
                        align: 'left'
                    });
                }
                else if (gridOptions.hcButtons) {
                    gridOptions.statusBar.statusPanels.push({
                        key: 'hcLeftButtons',
                        statusPanel: HcButtonStatusPanel,
                        statusPanelParams: {
                            $scope: gridScope,
                            buttonOptionsKey: 'hcButtons'
                        },
                        align: 'left'
                    });
                }

                if (gridOptions.hcCenterButtons) {
                    gridOptions.statusBar.statusPanels.push({
                        key: 'hcCenterButtons',
                        statusPanel: HcButtonStatusPanel,
                        statusPanelParams: {
                            $scope: gridScope,
                            buttonOptionsKey: 'hcCenterButtons'
                        },
                        align: 'center'
                    });
                }

                if (gridOptions.hcRightButtons) {
                    gridOptions.statusBar.statusPanels.push({
                        key: 'hcRightButtons',
                        statusPanel: HcButtonStatusPanel,
                        statusPanelParams: {
                            $scope: gridScope,
                            buttonOptionsKey: 'hcRightButtons'
                        },
                        align: 'right'
                    });
                }

                (function () {
                    gridOptions.hcEvents = gridOptions.hcEvents || {};

                    angular.forEach(gridOptions.hcEvents, function (eventHandler, eventName) {
                        if (angular.isArray(eventHandler)) return;

                        eventHandler = [eventHandler];

                        gridOptions.hcEvents[eventName] = eventHandler;
                    });
                })();

                //缓存完成事件
                var onGridReady = gridOptions.onGridReady;

                if (angular.isFunction(gridOptions.hcEvents.gridReady)) {
                    gridOptions.hcEvents.gridReady = [onGridReady, gridOptions.hcEvents.gridReady];
                }
                else if (angular.isArray(gridOptions.hcEvents.gridReady)) {
                    gridOptions.hcEvents.gridReady.unshift(onGridReady);
                }
                else {
                    gridOptions.hcEvents.gridReady = [];
                }

                gridOptions.onGridReady = function (params) {
                    //把自定义Api注入原生Api中
                    gridOptions.api.hcApi = gridOptions.hcApi;

                    params.hcApi = gridOptions.hcApi;


                    //完成承诺
                    gridOptions.hcReady.resolve(gridOptions);

                    gridOptions.hcEvents.gridReady.forEach(function (eventHandler) {
                        if (angular.isFunction(eventHandler))
                            eventHandler(gridOptions);
                    });


                };

                gridOptions.hcReady
                    .then(function () {
                        if (!gridOptions.hcClassId)
                            return promiseOfObjConf;
                    })
                    //表格创建完毕后，执行搜索
                    .then(function () {
                        if (!gridOptions.hcNoPaging)
                            gridScope.showBar = true;

                        if (gridOptions.hcSearchWhenReady !== false)
                            gridOptions.hcApi.search();
                    });

                (function (eventNames) {
                    forEachChildColumnDef(function (colDef) {
                        eventNames.forEach(function (eventName) {
                            var eventHandler = colDef[eventName];
                            if (angular.isFunction(eventHandler)) {
                                colDef[eventName] = getScopeApplyFunction(eventHandler);
                            }
                        });
                    });
                })([
                    'onCellValueChanged',
                    'onCellClicked',
                    'onCellDoubleClicked',
                    'onCellContextMenu'
                ]);


                //创建表格
                new agGrid.Grid($grid[0], gridOptions);
                //给自动行高计算器打补丁
                patchToAutoHeightCalculator(Object.getPrototypeOf(gridOptions.api.gridOptionsWrapper.autoHeightCalculator));

                if (!gridOptions.hcEvents) {
                    gridOptions.hcEvents = {};
                }

                //双击打开路由界面
                if (gridOptions.hcOpenState) {
                    if (!gridOptions.hcEvents.cellDoubleClicked)
                        gridOptions.hcEvents.cellDoubleClicked = [];

                    gridOptions.hcEvents.cellDoubleClicked.push(function (params) {
                        if ((params.colDef.field in gridOptions.hcOpenState)
                            || ('*' in gridOptions.hcOpenState)) {
                            var fieldOfSetting, stateName, stateParams = {}, idField;

                            if (params.colDef.field in gridOptions.hcOpenState)
                                fieldOfSetting = params.colDef.field;
                            else
                                fieldOfSetting = '*';

                            var fieldsOfLoop = {};

                            while (angular.isString(fieldOfSetting)) {
                                if (fieldOfSetting in fieldsOfLoop)
                                    throw new Error('循环引用双击打开设置', fieldOfSetting);
                                else
                                    fieldsOfLoop[fieldOfSetting] = true;

                                fieldOfSetting = gridOptions.hcOpenState[fieldOfSetting];
                            }

                            var openStateSetting = fieldOfSetting;

                            if (openStateSetting.disabled === true)
                                return;

                            if (angular.isFunction(openStateSetting.disabled) && openStateSetting.disabled(params))
                                return;

                            if (angular.isFunction(openStateSetting.name))
                                stateName = openStateSetting.name(params);
                            else
                                stateName = openStateSetting.name;

                            if (angular.isFunction(openStateSetting.idField))
                                idField = openStateSetting.idField(params);
                            else
                                idField = openStateSetting.idField;

                            if (idField)
                                stateParams.id = params.data[idField];

                            if (angular.isFunction(openStateSetting.params))
                                angular.extend(stateParams, openStateSetting.params(params));
                            else
                                angular.extend(stateParams, openStateSetting.params);

                            //若有 ID 参数，不能为 0
                            if ('id' in stateParams) {
                                stateParams.id = numberApi.toNumber(stateParams.id);
                                if (!stateParams.id) return;
                            }

                            if (!('readonly' in stateParams))
                                stateParams.readonly = true; //表格打开的界面默认为只读

                            return openBizObj({
                                stateName: stateName,
                                params: stateParams
                            }).result;
                        }
                    });
                }

                //注册事件
                if (angular.isObject(gridOptions.hcEvents)) {
                    angular.forEach(gridOptions.hcEvents, function (eventHandler, eventName) {
                        if (angular.isFunction(eventHandler)) {
                            gridOptions.api.addEventListener(eventName, getScopeApplyFunction(eventHandler));
                        }
                        else if (angular.isArray(eventHandler)) {
                            eventHandler.forEach(function (eventHandler) {
                                if (angular.isFunction(eventHandler)) {
                                    gridOptions.api.addEventListener(eventName, getScopeApplyFunction(eventHandler));
                                }
                            });
                        }
                    });
                }

                //创建分页组件
                /* (function () {
                    //运行分页控制器
                    api.pagingController.callByAngular(null, {
                        $scope: gridScope
                    });

                    var $gridPaging = $compile('<div hc-grid-paging></div>')(gridScope);

                    gridOptions.hcPaging = $gridPaging;

                    //关联上表格的DOM元素、作用域和选项
                    $gridPaging.data('grid', $grid);
                    $gridPaging.data('$scope', gridScope);
                    $gridPaging.data('gridOptions', gridOptions);

                    $grid.after($gridPaging);
                })(); */

                //输出控制台
                (function () {
                    var name = $grid.attr('hc-grid');
                    if (!name) name = $grid.attr('id');
                    if (!name) name = $grid.attr('name');

                    console.groupCollapsed('表格：%c%s', 'color:blue', name);
                    console.log('路由：%c%s', 'color:blue', $state.current.name);
                    console.log('元素：');
                    console.log($grid[0])
                    console.log('选项：');
                    console.log(gridOptions);
                    console.groupEnd();
                })();

                //返回表格选项
                return gridOptions;
            }].callByAngular();
        };

		/**
		 * 在表格上执行指定回调，此方法对于表格创建完毕时机不清晰时比较有用。
		 * 1、若表格已创建，立即执行回调，并返回回调的执行返回值
		 * 2、若表格尚未创建，则把回调注册为表格创建完毕事件的处理函数，并返Promise，该Promise在回调的执行后resolve
		 * @param {object} gridOptions 表格选项
		 * @param {(gridOptions: object) => void} callback 回调函数
		 */
        api.execute = function (gridOptions, callback) {
            if (gridOptions.api) {
                return callback(gridOptions);
            }
            else {
                if (!gridOptions.hcEvents) {
                    gridOptions.hcEvents = {};
                }

                if (!gridOptions.hcEvents.gridReady) {
                    gridOptions.hcEvents.gridReady = [];
                }

                if (!Array.isArray(gridOptions.hcEvents.gridReady)) {
                    gridOptions.hcEvents.gridReady = [gridOptions.hcEvents.gridReady];
                }

                var deferred = '$q'.asAngularService.defer();

                gridOptions.hcEvents.gridReady.push(function () {
                    try {
                        deferred.resolve(callback(gridOptions));
                    } catch (error) {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            }
        };

        /* ============================== 表格组件的工具方法 - 开始 ============================== */
        /**
         * 定义类的函数
         * @param {function} Class 类
         * @param {object} functions 函数定义
         */
        function defineFunctionOfClass(Class, functions) {
            if (typeof Class !== 'function')
                throw 'defineFunctionOfClass(Class, functions) 的参数 Class 必须为函数';

            angular.forEach(functions, function (value, key) {
                Object.defineProperty(Class.prototype, key, {
                    value: value
                });
            });

            return Class;
        }

        /**
         * 继承类
         * @param {function} Class 类
         * @param {function} SuperClass 父类
         */
        function extendClass(Class, SuperClass) {
            if (typeof Class !== 'function' || typeof SuperClass !== 'function')
                throw 'extendClass(Class, SuperClass) 的参数 Class 和 SuperClass 都必须为函数';

            Class.prototype = Object.create(SuperClass.prototype);

            Object.defineProperty(Class.prototype, 'constructor', {
                value: Class
            });

            return Class;
        }

        /* ============================== 表格组件的工具方法 - 结束 ============================== */

        /* ============================== 表格组件的基础类 - 开始 ============================== */
        /**
         * 表格组件的基础类
         * @constructor
         */
        function HcGridComponent() {
        }

        //定义类的函数
        defineFunctionOfClass(HcGridComponent, {

            /**
             * 调用父类函数，类似 call
             * @param {string} functionName 函数名
             * @param 函数参数，逐个指定
             * @returns 目标函数的执行结果
             */
            superCall: function (functionName) {
                var theArguments = Array.prototype.slice.call(arguments, 1);
                return this.superApply(functionName, theArguments);
            },

            /**
             * 调用父类函数，类似 apply
             * @param {string} functionName 函数名
             * @param {IArguments|[]} theArguments 函数参数
             * @returns 目标函数的执行结果
             */
            superApply: function (functionName, theArguments) {
                var thisFn = this[functionName];

                var prototype = this, superFn = thisFn;

                do {
                    prototype = Object.getPrototypeOf(prototype);

                    if (!prototype)
                        throw '调用父类函数失败，父类中查无此函数: ' + functionName;

                    superFn = prototype[functionName];
                } while (!superFn || superFn === thisFn);

                if (typeof superFn !== 'function')
                    throw '调用父类函数失败，父类中此属性并非函数: ' + functionName;

                return superFn.apply(this, theArguments);
            },

            /**
             * 初始化
             */
            init: function (params) {
                this.params = params;

                if (this.isCancelBeforeStart && this.isCancelBeforeStart()) {
                    return new agGrid.Promise(angular.noop);
                }

                if (this.afterLoadTemplate) {
                    var fn = (function (resolve, reject) {
                        this.loadTemplate()
                            .then(this.afterLoadTemplate.bind(this))
                            .then(resolve, reject);
                    }).bind(this);

                    return new agGrid.Promise(fn);
                }
            },

            /**
             * 返回表格组件DOM
             * @returns {HTMLElement}
             */
            getGui: function () {
                return this.gui;
            },

            /**
             * 销毁表格组件
             */
            destroy: function () {
                this.destroyed = true;
                $(this.getGui()).remove();
            },

            /**
             * 返回模板路径
             */
            getTemplateUrl: function () {
                return 'views/grid_component/' + this.getName() + '.html';
            },

            /**
             * 加载模板
             */
            loadTemplate: function () {
                return '$templateRequest'.asAngularService(this.getTemplateUrl());
            }

        });
        /* ============================== 表格组件的基础类 - 结束 ============================== */

        /* ============================== 渲染器的基础类 - 开始 ============================== */
        function DefaultCellRenderer() { }

        defineFunctionOfClass(DefaultCellRenderer, {
            init: function (params) {
                this.$gui = $('<div>', {
                    class: 'ag-cell-content',
                    text: this.getValue(params)
                });
            },
            refresh: function (params) {
                this.$gui.text(this.getValue(params));
                return true;
            },
            getGui: function () {
                return this.$gui[0];
            },
            getValue: function (params) {
                return Switch(typeof params.valueFormatted)
                    .case('string', 'number', params.valueFormatted)
                    .default(params.value)
                    .result;
            }
        });

        function DefaultCellEditor() { }

        defineFunctionOfClass(DefaultCellEditor, {
            init: function (params) {
                this.gridParams = params;
                var startValue;
                // cellStartedEdit is only false if we are doing fullRow editing
                if (params.cellStartedEdit) {
                    this.focusAfterAttached = true;
                    var keyPressBackspaceOrDelete = params.keyPress === Constants.KEY_BACKSPACE
                        || params.keyPress === Constants.KEY_DELETE;
                    if (keyPressBackspaceOrDelete) {
                        startValue = '';
                    }
                    else if (params.charPress) {
                        startValue = params.charPress;
                    }
                    else {
                        startValue = params.value;
                        if (params.keyPress !== Constants.KEY_F2) {
                            this.highlightAllOnFocus = true;
                        }
                    }
                }
                else {
                    this.focusAfterAttached = false;
                    startValue = params.value;
                }

                Switch(startValue).case(undefined, null, NaN, function () {
                    startValue = '';
                });

                this.$gui = this.$input = $('<input>', {
                    class: 'ag-cell-edit-input',
                    val: startValue,
                    on: {
                        keydown: function (event) {
                            var isNavigationKey = [
                                Constants.KEY_LEFT,
                                Constants.KEY_RIGHT,
                                Constants.KEY_UP,
                                Constants.KEY_DOWN,
                                Constants.KEY_PAGE_DOWN,
                                Constants.KEY_PAGE_UP,
                                Constants.KEY_PAGE_HOME,
                                Constants.KEY_PAGE_END
                            ].indexOf(event.keyCode) >= 0;
                            if (isNavigationKey) {
                                // this stops the grid from executing keyboard navigation
                                event.stopPropagation();
                                // this stops the browser from scrolling up / down
                                var pageUp = event.keyCode === Constants.KEY_PAGE_UP;
                                var pageDown = event.keyCode === Constants.KEY_PAGE_DOWN;
                                if (pageUp || pageDown) {
                                    event.preventDefault();
                                }
                            }
                        }
                    }
                });
            },
            afterGuiAttached: function () {
                if (!this.focusAfterAttached) {
                    return;
                }
                this.$input.focus();
                if (this.highlightAllOnFocus) {
                    this.$input.select();
                }
                else {
                    // when we started editing, we want the carot at the end, not the start.
                    // this comes into play in two scenarios: a) when user hits F2 and b)
                    // when user hits a printable character, then on IE (and only IE) the carot
                    // was placed after the first character, thus 'apply' would end up as 'pplea'
                    var value = this.$input.val();
                    var len = value ? value.length : 0;
                    if (len > 0) {
                        this.$input[0].setSelectionRange(len, len);
                    }
                }
            },
            getGui: function () {
                return this.$gui[0];
            },
            getValue: function () {
                return this.gridParams.parseValue(this.value);
            },
            isCancelAfterEnd: function () {
                this.value = validate(this.$input.val(), this.gridParams);
            },
            destroy: function () {
                this.$gui.remove();
            }
        });

        function validate(value, cellEditorParams) {
            if (typeof value === 'string') {
                value = value.trim();
            }

            Switch(value).case(undefined, null, function () {
                value = '';
            });

            var rules = [];

            var required = cellEditorParams.column.colDef.hcRequired;
            if (typeof required === 'function') {
                required = required(cellEditorParams.column.createBaseColDefParams(cellEditorParams.node));
            }

            if (required) {
                rules.push({
                    validator: function (params) {
                        return params.value;
                    },
                    message: function (params) {
                        return params.colDef.headerName + '必填';
                    }
                });
            }

            if (value) {
                var isNumber = cellEditorParams.column.colDef.hcNumber || cellEditorParams.column.colDef.hcInteger || cellEditorParams.column.colDef.hcCompareToZero || Switch(cellEditorParams.column.colDef.type).case('金额', '万元', '数量', '体积', '百分比', '百分比不转换', true).result;

                if (isNumber) {
                    value = value.replace(/,/g, '');

                    rules.push({
                        validator: function (params) {
                            var result = /^-?\d+(\.\d+)?$/.test(params.value);
                            if (result) {
                                params.value = +params.value;
                            }
                            return result;
                        },
                        message: function (params) {
                            return '"' + params.value + '"不是合法的数字格式';
                        }
                    });
                }

                if (cellEditorParams.column.colDef.hcInteger) {
                    rules.push({
                        validator: function (params) {
                            return params.value % 1 === 0;
                        },
                        message: function (params) {
                            return params.colDef.headerName + '必须是整数';
                        }
                    });
                }

                Switch(cellEditorParams.column.colDef.hcCompareToZero)
                    .case('>', function () {
                        rules.push({
                            validator: function (params) {
                                return params.value > 0;
                            },
                            message: function (params) {
                                return params.colDef.headerName + '必须大于0';
                            }
                        });
                    })
                    .case('>=', function () {
                        rules.push({
                            validator: function (params) {
                                return params.value >= 0;
                            },
                            message: function (params) {
                                return params.colDef.headerName + '必须大于等于0';
                            }
                        });
                    })
                    .case('<', function () {
                        rules.push({
                            validator: function (params) {
                                return params.value < 0;
                            },
                            message: function (params) {
                                return params.colDef.headerName + '必须小于0';
                            }
                        });
                    })
                    .case('<=', function () {
                        rules.push({
                            validator: function (params) {
                                return params.value <= 0;
                            },
                            message: function (params) {
                                return params.colDef.headerName + '必须小于等于0';
                            }
                        });
                    });

                Switch(cellEditorParams.column.colDef.type)
                    .case('词汇', function () {
                        rules.push({
                            validator: function (params) {
                                return params.colDef.cellEditorParams.names.indexOf(params.value) >= 0 || params.colDef.cellEditorParams.values.indexOf(params.value) >= 0;
                            },
                            message: function (params) {
                                return '"' + params.value + '"不是' + params.colDef.headerName + '的有效选项';
                            }
                        });
                    })
                    .case('日期', function () {
                        rules.push({
                            validator: function (params) {
                                return /^\d{4}-\d{2}-\d{2}$/.test(params.value);
                            },
                            message: function (params) {
                                return '"' + params.value + '"不是合法的日期格式';
                            }
                        });
                    })
                    .case('时间', function () {
                        rules.push({
                            validator: function (params) {
                                return /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(params.value);
                            },
                            message: function (params) {
                                return '"' + params.value + '"不是合法的时间格式';
                            }
                        });
                    })
                    .case('年月', function () {
                        rules.push({
                            validator: function (params) {
                                return /^\d{4}-\d{2}$/.test(params.value);
                            },
                            message: function (params) {
                                return '"' + params.value + '"不是合法的年月格式';
                            }
                        });
                    });

                if (cellEditorParams.column.colDef.hcValidRules) {
                    Array.prototype.push.apply(rules, cellEditorParams.column.colDef.hcValidRules);
                }
            }

            var validatorParams = cellEditorParams.column.createBaseColDefParams(cellEditorParams.node);
            validatorParams.value = value;
            validatorParams.oldValue = cellEditorParams.value;

            if (rules && rules.length) {
                rules.forEach(function (rule) {
                    if (!rule.validator(validatorParams)) {
                        var message = rule.message;

                        if (typeof message === 'function') {
                            message = message(validatorParams);
                        }

                        setTimeout(function () {
                            swalApi.error(message);
                        });

                        throw new Error(message);
                    }
                });
            }

            return validatorParams.value;
        }

        /**
         * 渲染器的基础类
         * @constructor
         */
        function HcCellRenderer() {
        }

        //继承表格组件基础类
        extendClass(HcCellRenderer, HcGridComponent);

        //定义类的函数
        defineFunctionOfClass(HcCellRenderer, {

            /**
             * 刷新
             * @returns {boolean}
             */
            refresh: function (params) {
                this.params = params;
                return true;
            },

            /**
             * 开始编辑
             */
            startEditing: function (params) {
                return this.params.api.startEditingCell(angular.extend({
                    rowIndex: this.params.node.rowIndex,
                    colKey: this.params.colDef.field
                }, params));
            }

        });
        /* ============================== 渲染器的基础类 - 结束 ============================== */

        /* ============================== 编辑器的基础类 - 开始 ============================== */
        /**
         * 编辑器的基础类
         * @constructor
         */
        function HcCellEditor() {
        }

        //继承表格组件基础类
        extendClass(HcCellEditor, HcGridComponent);

        //定义类的函数
        defineFunctionOfClass(HcCellEditor, {

            /**
             * 是否弹出编辑器
             * @requires {boolean} 是否弹出编辑器
             */
            isPopup: function () {
                return true;
            }

        });
        /* ============================== 编辑器的基础类 - 结束 ============================== */

        /* ============================== 复选框渲染器 - 开始 ============================== */
        /**
         * 复选框渲染器
         * @constructor
         */
        function HcCheckboxCellRenderer() {
        }

        //继承渲染器基础类
        extendClass(HcCheckboxCellRenderer, HcCellRenderer);

        //定义类的函数
        defineFunctionOfClass(HcCheckboxCellRenderer, {

            /**
             * 返回组件名称
             * @returns {string}
             */
            getName: function () {
                return 'HcCheckboxCellRenderer';
            },

            /**
             * 模板加载后
             * @param {string} template 模板字符串
             */
            afterLoadTemplate: function (template) {
                this.$gui = $(template);
                this.gui = this.$gui[0];

                this.$checkbox = this.$gui.find('[role="checkbox"]');

                //开始编辑
                var startEditing = this.startEditing.bind(this);

                (function () {
                    var lastClickTime = new Date();

                    this.$checkbox
                        .on('click', function (event) {
                            event.stopPropagation();

                            var thisClickTime = new Date();

                            var interval = thisClickTime - lastClickTime;

                            lastClickTime = thisClickTime;

                            if (interval <= 300)
                                return;

                            startEditing({
                                keyPress: 'mouse_left_click'
                            });
                        })
                        .on('dblclick', function (event) {
                            event.stopPropagation();
                        });
                }).call(this);

                //更新复选框状态
                this.updateChecked();
            },

            /**
             * 刷新
             * @override
             * @returns {boolean}
             */
            refresh: function (params) {
                //调用父类方法
                this.superApply('refresh', arguments);

                //更新复选框状态
                this.updateChecked();

                return true;
            },

            /**
             * 更新复选框状态
             */
            updateChecked: function () {
                this.checked = this.params.value == 2;

                this.$checkbox[this.checked ? 'addClass' : 'removeClass']('checked');
            }

        });
        /* ============================== 复选框渲染器 - 结束 ============================== */

        /* ============================== 复选框编辑器 - 开始 ============================== */
        /**
         * 复选框编辑器
         * @constructor
         */
        function HcCheckboxCellEditor() {
        }

        //继承编辑器基础类
        extendClass(HcCheckboxCellEditor, HcCellEditor);

        //定义类的函数
        defineFunctionOfClass(HcCheckboxCellEditor, {

            /**
             * 初始化
             * @override
             */
            init: function (params) {
                //调用父类方法
                this.superApply('init', arguments);

                this.gui = $('<!-- HcCheckboxCellEditor -->')[0];
            },

            /**
             * 开始编辑前，是否取消编辑
             */
            isCancelBeforeStart: function () {
                return !this.params.keyPress && !this.params.charPress;
            },

            /**
             * 编辑器连接到表格后
             */
            afterGuiAttached: function () {
                //停止编辑
                this.params.stopEditing();
            },

            /**
             * 返回编辑后的值
             */
            getValue: function () {
                return this.params.value == 2 ? 1 : 2;
            }

        });
        /* ============================== 复选框编辑器 - 结束 ============================== */

        /* ============================== 带按钮输入框渲染器 - 开始 ============================== */
        /**
         * 带按钮输入框渲染器
         * @constructor
         */
        function HcButtonInputCellRenderer() {
        }

        //继承渲染器基础类
        extendClass(HcButtonInputCellRenderer, HcCellRenderer);

        //定义类的函数
        defineFunctionOfClass(HcButtonInputCellRenderer, {

            /**
             * 返回组件名称
             * @returns {string}
             */
            getName: function () {
                return 'HcButtonInputCellRenderer';
            },

            /**
             * 模板加载后
             * @param {string} template 模板字符串
             */
            afterLoadTemplate: function (template) {
                var params = this.params;

                this.$gui = $(template);
                this.gui = this.$gui[0];

                this.$text = this.$gui.find('.hc-grid-button-input-text');
                this.$button = this.$gui.find('.hc-grid-button-input-button');

                if (params.colDef.hcCommonSearch) {

                    this.$button.on('click', function (event) {
                        event.stopPropagation();

                        var commonSearchSetting = angular.extend({}, params.colDef.hcCommonSearch);

                        return '$q'.asAngularService
                            .when()
                            .then(commonSearchSetting.beforeOpen)
                            .then(function (canOpen) {
                                if (canOpen === false)
                                    return '$q'.asAngularService.reject('阻止打开通用查询');
                            })
                            .then(function () {
                                if (commonSearchSetting.classId == undefined || commonSearchSetting.classId == '')
                                    return '$q'.asAngularService.reject('未找到clssId');

                                if (commonSearchSetting.afterOk) {
                                    var afterOk = commonSearchSetting.afterOk;

                                    commonSearchSetting.afterOk = function () {
                                        var _this = this;
                                        var args = Array.prototype.slice.call(arguments);

                                        args.push(params);

                                        return '$q'
                                            .asAngularService
                                            .when()
                                            .then(function () {
                                                return afterOk.apply(_this, args);
                                            })
                                            .then(function () {
                                                params.api.refreshCells({
                                                    rowNodes: [params.node]
                                                });
                                            });
                                    };
                                }

                                return '$modal'.asAngularService.openCommonSearch(commonSearchSetting).result;
                            });
                    });
                }
                else {
                    this.$button.on('click', function (event) {
                        event.stopPropagation();
                        if (params.colDef.hcButtonClick) {
                            params.colDef.hcButtonClick(params);
                        } else {
                            swalApi.error('未定义按钮点击事件');
                        }
                    });
                }

                this.update();
            },

            /**
             * 刷新
             * @override
             * @returns {boolean}
             */
            refresh: function (params) {
                //调用父类方法
                this.superApply('refresh', arguments);

                this.update();

                return true;
            },

            /**
             * 更新
             */
            update: function () {
                this.$text.text(this.params.valueFormatted != null ? this.params.valueFormatted : this.params.value);
            }

        });
        /* ============================== 带按钮输入框渲染器 - 结束 ============================== */

        /* ============================== 图片渲染器 - 开始 ============================== */
		/**
		 * 图片渲染器
		 * @constructor
		 * @since 2019-06-20
		 */
        function HcImgCellRenderer() { }

        defineFunctionOfClass(HcImgCellRenderer, {
            init: function (params) {
                var renderer = this;

                [
                    'api',
                    'colDef',
                    'node',
                    'data',
                    'eGridCell'
                ].forEach(function (key) {
                    renderer[key] = params[key];
                });

                renderer.value = renderer.data[renderer.colDef.hcImgIdField];

                renderer.defaultHeight = '32px';

                renderer.$gui = $('<div>', {
                    css: {
                        height: renderer.defaultHeight,
                        display: 'flex',
                        alignItems: 'center'
                    }
                });

                renderer.gui = renderer.$gui[0];

                if (+renderer.value) {
                    renderer.$gui.html($('<i>', {
                        class: 'fa fa-spinner fa-pulse'
                    }));
                }
                else {
                    renderer.$gui.text('无');
                }

                renderer.scrollContainer = $(params.eGridCell).closest('.ag-body-viewport')[0];

                require(['vue', 'element-ui'], renderer.asyncInit.bind(renderer));
            },
            asyncInit: function (Vue) {
                var renderer = this;

                renderer.vue = new Vue({
                    el: renderer.gui,
                    render: function (createElement) {
                        if (!this.docId) {
                            return createElement('span', '无');
                        }

                        return createElement('el-image', {
                            ref: 'image',
                            style: {
                                height: renderer.defaultHeight,
                                display: 'flex',
                                alignItems: 'center'
                            },
                            props: {
                                src: this.url,
                                fit: 'contain',
                                lazy: true,
                                scrollContainer: renderer.scrollContainer
                            },
                            on: {
                                dblclick: this.handleDblclick,
                                load: this.handleLoad,
                                error: this.handleError
                            }
                        }, [
                            createElement('i', {
                                slot: 'placeholder',
                                class: 'fa fa-spinner fa-pulse'
                            }),
                            createElement('span', {
                                slot: 'error'
                            }, '加载失败')
                        ]);
                    },
                    data: {
                        docId: +renderer.value,
                        retryTimes: 0 //重试次数
                    },
                    computed: {
                        url: function () {
                            if (!this.docId) {
                                return '';
                            }

                            return '/downloadfile?viewtype=1&docid=' + this.docId;
                        },
                        maxWidth: function () {
                            return 100;
                        },
                        imageHeight: function () {
                            return this.$refs.image.imageHeight;
                        },
                        imageWidth: function () {
                            return this.$refs.image.imageWidth;
                        },
                        //最大重试次数
                        maxRetryTimes: function () {
                            return 3;
                        },
                        //重试等待时间
                        retryWaitingTime: function () {
                            return 3e3;
                        }
                    },
                    watch: {
                        docId: function () {
                            this.retryTimes = 0;
                        }
                    },
                    methods: {
                        handleDblclick: function (event) {
                            if (renderer.colDef.onCellDoubleClicked || (renderer.api.gridOptionsWrapper.gridOptions.hcEvents && renderer.api.gridOptionsWrapper.gridOptions.hcEvents.cellDoubleClicked)) {
                                return;
                            }

                            event.stopPropagation();

                            if (!this.docId) return;

                            var images = [];

                            renderer.api.hcApi.forEachChildColumnDef(function (colDef) {
                                if (!colDef.hcImgIdField) return;

                                images.push({
                                    docid: renderer.data[colDef.hcImgIdField]
                                });
                            });

                            openBizObj({
                                imageId: this.docId,
                                images: images
                            });
                        },
                        handleLoad: function () {
                            this.retryTimes = 0;
                        },
                        handleError: function () {
                            console.error('图片加载失败', this.url);

                            //若重试次数已达上限，不再尝试
                            if (this.retryTimes >= this.maxRetryTimes) {
                                return;
                            }

                            console.info(this.retryWaitingTime + '秒后重试');

                            var loadImage = this.$refs.image.loadImage.bind(this.$refs.image);

                            setTimeout(loadImage, this.retryWaitingTime);

                            this.retryTimes++;
                        }
                    },
                    mounted: function () {
                        $(this.$el).data('$vue', this);
                    }
                });
            },
            refresh: function (params) {
                var renderer = this;
                renderer.value = params.value;
                renderer.vue.docId = +renderer.value;
                return true;
            },
            getGui: function () {
                return this.gui;
            },
            destroy: function () {
                if (this.vue) {
                    this.vue.$destroy();
                    this.vue = null;
                }
            }
        });

        //继承渲染器基础类
        // extendClass(HcImgCellRenderer, HcCellRenderer);

        // //定义类的函数
        // defineFunctionOfClass(HcImgCellRenderer, {

        // 	init: function (params) {
        // 		var self = this;

        // 		self.params = params;

        // 		self.imageId = +self.params.data[self.params.colDef.hcImgIdField];

        // 		if (self.imageId) {
        //             self.$gui = $('<img>', {
        //                 css: {
        //                     height: '100%',
        //                     width: '100%',
        //                     'min-height': '32px',
        //                     'min-width': '32px',
        //                     'max-height': '100px',
        //                     'max-width': '100px',
        //                     'object-fit': 'contain'
        //                 },
        //                 src: '/downloadfile?viewtype=1&docid=' + self.imageId,
        //                 on: {
        //                     load: function (event) {
        //                         // var $img = $(this);

        //                         // var naturalHeight = $img.prop('naturalHeight');

        //                         // //若实际高度小于默认高度100，重设高度=实际高度，以免图片放大失真
        //                         // if (naturalHeight < 100) {
        //                         //     $img.height(naturalHeight);
        //                         // }

        //                         setTimeout(function () {
        //                             self.params.columnApi.autoSizeColumn(self.params.column);
        //                         });
        //                     },
        //                     dblclick: function (event) {
        //                         if (params.colDef.onCellDoubleClicked || (params.api.gridOptionsWrapper.gridOptions.hcEvents && params.api.gridOptionsWrapper.gridOptions.hcEvents.cellDoubleClicked)) {
        //                             return;
        //                         }

        //                         event.stopPropagation();

        //                         if (!self.imageId) return;

        //                         var images = [];

        //                         self.params.api.hcApi.forEachChildColumnDef(function (colDef) {
        //                             if (!colDef.hcImgIdField) return;

        //                             images.push({
        //                                 docid: self.params.data[colDef.hcImgIdField]
        //                             });
        //                         });

        //                         openBizObj({
        //                             imageId: self.imageId,
        //                             images: images
        //                         });
        //                     }
        //                 }
        //             });
        // 		}
        // 		else {
        // 			self.$gui = $('<!-- 暂无图片 -->');
        // 		}

        // 		self.gui = self.$gui[0];
        // 	},

        // 	refresh: function (params) {
        // 		var self = this;

        // 		var node = self.params.node;

        // 		if (!node.hcAutoHeightTimeoutId) {
        // 			node.hcAutoHeightTimeoutId = setTimeout(function () {
        // 				node.hcAutoHeightTimeoutId = 0;

        // 				var rowHeight = self.params.api.gridOptionsWrapper.getRowHeightForNode(node);

        // 				node.setRowHeight(rowHeight);
        // 			});
        // 		}

        // 		return false;
        // 	},

        // });
        /* ============================== 图片渲染器 - 结束 ============================== */

        /* ============================== 底部按钮状态栏组件 - 开始 ============================== */
		/**
		 * 底部按钮状态栏组件
		 * @constructor
		 * @since 2019-07-01
		 */
        function HcButtonStatusPanel() { }

        //继承表格组件基础类
        extendClass(HcButtonStatusPanel, HcGridComponent);

        //定义类的函数
        defineFunctionOfClass(HcButtonStatusPanel, {

            init: function (params) {
                var self = this,
                    $compile = '$compile'.asAngularService;

                self.params = params;

                self.$gui = $('<div>', {
                    'hc-buttons': 'gridOptions.' + params.buttonOptionsKey
                });

                self.$gui = $compile(self.$gui)(self.params.$scope);

                self.gui = self.$gui[0];
            }

        });
        /* ============================== 底部按钮状态栏组件 - 结束 ============================== */

        /* ============================== 分页状态栏组件 - 开始 ============================== */
		/**
		 * 底部按钮状态栏组件
		 * @constructor
		 * @since 2019-07-01
		 */
        function HcPagingStatusPanel() { }

        //继承表格组件基础类
        extendClass(HcPagingStatusPanel, HcGridComponent);

        //定义类的函数
        defineFunctionOfClass(HcPagingStatusPanel, {

            init: function (params) {
                var self = this,
                    $compile = '$compile'.asAngularService;

                self.params = params;

                api.pagingController.callByAngular(null, {
                    $scope: self.params.$scope
                });

                self.$gui = $compile('<hc-grid-paging class="ag-hidden">')(self.params.$scope);

                self.gui = self.$gui[0];
            },

            setVisible: function (visible) {
                if (this.visible === visible) return;

                var methodName;

                if (visible === true) {
                    methodName = 'removeClass';
                }
                else if (visible === false) {
                    methodName = 'addClass';
                }

                if (methodName) {
                    this.$gui[methodName]('ag-hidden');
                    this.visible = visible;
                }
            }

        });
        /* ============================== 分页按钮状态栏组件 - 结束 ============================== */

        /**
         * 遍历所有的子列定义
         * @param {(ColumnDef|ColumnGroupDef)[]} columnDefs 列定义
         * @param {(columnDef: ColumnDef, columnIndex: number, columnDefParent: ColumnGroupDef) => void} callback 回调函数
         * @since 2019-01-07
         */
        api.forEachChildColumnDef = function (columnDefs, callback) {
            var actualColumnDefs = [], columnDefParents = [];

            (function forEachChildColumnDefOfGroup(childColumnDefs, parentGroupDef) {
                childColumnDefs.forEach(function (columnDef) {
                    if (columnDef.children && columnDef.children.length)
                        forEachChildColumnDefOfGroup(columnDef.children, columnDef);
                    else {
                        actualColumnDefs.push(columnDef);
                        columnDefParents.push(childColumnDefs !== columnDefs ? parentGroupDef : null);
                    }
                });
            })(columnDefs, null);

            actualColumnDefs.forEach(function (columnDef, columnIndex) {
                callback(columnDef, columnIndex, columnDefParents[columnIndex]);
            });
        };

        /**
         * 分页控制器
         */
        api.pagingController = [
            '$scope',
            function ($scope) {
                //分页组件视为表格的一部分，使用表格选项的独立作用域
                if ($scope.gridOptions.showPageBtn != undefined) {
                    $scope.showPageBtn = $scope.gridOptions.showPageBtn;
                } else {
                    $scope.showPageBtn = true;
                }
                $scope.isPaging = !$scope.gridOptions.hcNoPaging; //启用分页
                $scope.pageSize = $scope.gridOptions.hcPageSize || sysParams.GridPageSize || 50; //每页数量
                $scope.currPage = 1; //当前哪一页
                $scope.count = 0; //总数量
                $scope.pageCount = 1; //总页数

                /**
                 * 查询
                 * @since 2018-10-01
                 */
                $scope.search = $scope.gridOptions.hcApi.search;

                /**
                 * 转到首页
                 * @since 2018-09-30
                 */
                $scope.firstPage = function () {
                    //已经是首页，无法再跳转
                    if ($scope.currPage === 1)
                        return;

                    $scope.currPage = 1;

                    $scope.search();
                };

                /**
                 * 转到上一页
                 * @since 2018-09-30
                 */
                $scope.prevPage = function () {
                    //已经是首页，无法再跳转
                    if ($scope.currPage === 1)
                        return;

                    $scope.currPage--;

                    $scope.search();
                };

                /**
                 * 转到下一页
                 * @since 2018-09-30
                 */
                $scope.nextPage = function () {
                    //已经是末页，无法再跳转
                    if ($scope.currPage >= $scope.pageCount)
                        return;

                    $scope.currPage++;

                    $scope.search();
                };

                /**
                 * 转到末页
                 * @since 2018-09-30
                 */
                $scope.lastPage = function () {
                    //已经是末页，无法再跳转
                    if ($scope.currPage >= $scope.pageCount)
                        return;

                    $scope.currPage = $scope.pageCount;

                    $scope.search();
                };

                /**
                 * 全选
                 * @since 2018-10-01
                 */
                $scope.selectAll = $scope.gridOptions.hcApi.selectAll;

                /**
                 * 反选
                 * @since 2018-10-01
                 */
                $scope.selectInverse = $scope.gridOptions.hcApi.selectInverse;

            }
        ];

        //某些api已随版本更名，打个兼容补丁
        (function () {
            var newNameToOldName = {
                'getPinnedTopRow': 'getFloatingTopRow',
                'getPinnedBottomRow': 'getFloatingBottomRow',
                'getPinnedTopRowCount': 'getFloatingTopRowCount',
                'getPinnedBottomRowCount': 'getFloatingBottomRowCount',
                'setPinnedTopRowData': 'setFloatingTopRowData',
                'setPinnedBottomRowData': 'setFloatingBottomRowData'
            };

            Object.keys(newNameToOldName).forEach(function (newName) {
                if (!agGrid.GridApi.prototype[newName]) {
                    var oldName = newNameToOldName[newName];
                    agGrid.GridApi.prototype[newName] = agGrid.GridApi.prototype[oldName];
                }
            });
        })();

        //日期编辑器
        function DateCellEditor() {
        }

        angular.extend(DateCellEditor.prototype, {
            init: function (params) {
                var self = this;
                return ['$compile', function ($compile) {
                    self.params = params;
                    // var $input = $('<input type="text" id ="celldatetimepicker" class="ag-cell-edit-input">');

                    var scope = params.api.hcApi.getScope().$new(true);
                    scope.Value = params.value ? self.setValue(params.value) : "";

                    scope.btnClick = function () {
                        self.$input.focus().select();
                        // $("#celldatetimepicker").datetimepicker('show');
                    };
                    var compileFn = $compile('<div class="hc-input input-group ag-cell-edit-input  ag-input-group" ng-class="ngClass()">' +
                        '<input class="form-control" ng-model="Value"  hc-required="ngRequired()"  id ="celldatetimepicker"' +
                        '   ng-readonly="false" ng-change="ngChange()" ng-focus="ngFocus($event)" ng-blur="ngBlur($event)" ng-style="ngStyle()" placeholder="{{placeholder}}">' +
                        '<span class="input-group-btn" hc-if="!ngReadonly()">' +
                        '<button class="btn hc-input-del-btn" ng-click="deleteClick()" ng-show="focused&&modelController.$viewValue">×</button>' +
                        '<button class="btn" ng-click="btnClick()">' +
                        '<i class="fa fa-angle-down"></i>' +
                        '</button>' +
                        '</span>' +
                        '<i class="star">*</i>' +
                        '</img>');

                    var $dom = compileFn(scope);
                    var $input = $($dom[0].firstElementChild);
                    if (params.column.colDef.cellchange) {
                        $input.on("change", params.column.colDef.cellchange);
                    }

                    self.$input = $input;
                    self.$dom = $dom;
                    // this.$input.val((params.value || '').substr(0, 10));

                    $input.datetimepicker(self.getDateTimePicker());
                    $input.on('focus', function (event) {  //重新绑定点击事件
                        $input.data('datetimepicker').show(event);
                    });

                    self.$input.focus().select();
                }].callByAngular();
            },
            getGui: function () {
                return this.$dom[0];
            },
            afterGuiAttached: function () {
                this.$input.focus().select();
            },
            getValue: function () {
                return (this.$input.val() || '').substr(0, 10);
            },
            setValue: function (value) {
                return value.substring(0, 10);
            },
            getDateTimePicker: function () {
                return {
                    format: 'yyyy-mm-dd',	//格式化
                    autoclose: true,		//自动关闭
                    minView: 'month',		//最小视图：月
                    todayBtn: true,			//显示【今天】按钮
                    todayHighlight: true,	//高亮今天
                    language: 'zh-CN'	//语言：简体中文
                }
            },
            destroy: function () {
                this.params.api.stopEditing(false);
                var $input = this.$input;
                $input.datetimepicker("hide");
                $input.datetimepicker("destroy");
                $input.remove();
            }
        });


        //年月编辑器
        function YearMonthCellEditor() {
        }

        angular.extend(YearMonthCellEditor.prototype, DateCellEditor.prototype);
        angular.extend(YearMonthCellEditor.prototype, {
            getValue: function () {
                return (this.$input.val() || '').substr(0, 7);
            },
            setValue: function (value) {
                return value.substring(0, 10);
            },
            getDateTimePicker: function () {
                return {
                    format: 'yyyy-mm',	//格式化
                    autoclose: true,		//自动关闭
                    startView: 'year',		//开始视图：年
                    minView: 'year',		//最小视图：年
                    todayBtn: true,			//显示【今天】按钮
                    todayHighlight: true,	//高亮今天
                    language: 'zh-CN'	//语言：简体中文
                }
            }
        });

        /**
         * 万元编辑器
         */
        function wanYuanEditor() {
        }

        angular.extend(wanYuanEditor.prototype, {
            init: function (params) {
                this.params = params;
                var dom = $('<div class="input-group ag-cell-edit-input ag-input-group"><input type="text" class="form-control">' +
                    '<span class="input-group-addon" >万元</span></div>');
                this.dom = dom;
                var $input = dom[0].getElementsByTagName('input')[0];
                this.$input = $input;
                var startValue;
                if (params.cellStartedEdit) {
                    this.focusAfterAttached = true;
                    var keyPressBackspaceOrDelete = params.keyPress === constants_1.Constants.KEY_BACKSPACE
                        || params.keyPress === constants_1.Constants.KEY_DELETE;
                    if (keyPressBackspaceOrDelete) {
                        startValue = '';
                    }
                    else if (params.charPress) {
                        startValue = params.charPress;
                    }
                    else {
                        startValue = this.getStartValue(params);
                        if (params.keyPress !== constants_1.Constants.KEY_F2) {
                            this.highlightAllOnFocus = true;
                        }
                    }
                }
                else {
                    this.focusAfterAttached = false;
                    startValue = this.getStartValue(params);
                }

                this.$input.value = startValue;
            },
            getGui: function () {
                return this.dom[0];
            },
            getInput: function () {
                return this.$input;
            },
            afterGuiAttached: function () {
                this.$input.focus();
            },
            getValue: function () {
                var eInput = this.getInput();
                var value = validate(eInput.value, this.params);
                return this.params.parseValue(value);
            },
            destroy: function () {
                this.params.api.stopEditing(false);
                var dom = this.dom;
                dom.remove();
            },
            getStartValue: function (params) {
                var value = numberApi.normalizeAsNumber(params.value);

                if (value) {
                    value = value / 1e4;
                }

                return value;
            }
        });

        /**
         * 百分比编辑器
         */
        function percentEditor() {
        }

        angular.extend(percentEditor.prototype, {
            init: function (params) {
                this.params = params;
                var dom = $('<div class="input-group ag-cell-edit-input ag-input-group"><input type="text" class="form-control">' +
                    '<span class="input-group-addon" >%</span></div>');
                this.dom = dom;
                var $input = dom[0].getElementsByTagName('input')[0];
                this.$input = $input;
                var startValue;
                if (params.cellStartedEdit) {
                    this.focusAfterAttached = true;
                    var keyPressBackspaceOrDelete = params.keyPress === constants_1.Constants.KEY_BACKSPACE
                        || params.keyPress === constants_1.Constants.KEY_DELETE;
                    if (keyPressBackspaceOrDelete) {
                        startValue = '';
                    }
                    else if (params.charPress) {
                        startValue = params.charPress;
                    }
                    else {
                        startValue = this.getStartValue(params);
                        if (params.keyPress !== constants_1.Constants.KEY_F2) {
                            this.highlightAllOnFocus = true;
                        }
                    }
                }
                else {
                    this.focusAfterAttached = false;
                    startValue = this.getStartValue(params);
                }

                this.$input.value = startValue;
            },
            getGui: function () {
                return this.dom[0];
            },
            getInput: function () {
                return this.$input;
            },
            afterGuiAttached: function () {
                this.$input.focus();
            },
            getValue: function () {
                var eInput = this.getInput();
                var value = validate(eInput.value, this.params);
                return this.params.parseValue(value);
            },
            destroy: function () {
                this.params.api.stopEditing(false);
                var dom = this.dom;
                dom.remove();
            },
            getStartValue: function (params) {
                var startValue;

                if (numberApi.isNum(params.value) || numberApi.isStrOfNum(params.value)) {
                    startValue = numberApi.mutiply(params.value, 100);
                }
                else {
                    startValue = '';
                }

                return startValue;
            }
        });

        /**
         * 下拉编辑器
         * @constructor
         */
        function DropDownCellEditor() {
        }

        DropDownCellEditor.prototype = {
            init: function (params) {
                var self = this;
                return ['$compile', function ($compile, $timeout, $parse, $q) {
                    self.params = params;
                    // var eInput = this.getGui();
                    var startValue = params.value ? params.formatValue(params.value) : "";

                    var scope = params.api.hcApi.getScope().$new(true);
                    scope.Value = startValue;
                    scope.showDelete = !(startValue == '');

                    if (params.names && params.values) {
                        scope.selectOptions = [];
                        for (var i = 0; i < params.names.length; i++) {
                            scope.selectOptions.push({
                                name: params.names[i],
                                value: params.values[i]
                            });
                        }
                    }
                    scope.params = params;

                    scope.selectClick = function (selectOption) {
                        scope.Value = selectOption.value;
                        scope.$input.value = selectOption.name;
                        scope.params.api.stopEditing(false);
                        scope.showDelete = false;
                    };

                    /**
                     * 删除按钮点击事件
                     */
                    scope.deleteClick = function () {

                        scope.Value = '';
                        scope.$input.value = '';
                        scope.showDelete = false;
                    }

                    var compileFn = $compile('<div class="hc-input input-group ag-cell-edit-input  ag-input-group" ng-class="ngClass()">' +
                        '<input class="form-control" ng-model="Value" hc-required="ngRequired()" ' +
                        'ng-style="ngStyle()" ng-change="ngChange()" ng-focus="ngFocus($event)" ng-blur="ngBlur($event)" readonly placeholder="{{placeholder}}">' +
                        '<span class="input-group-btn open" >' +
                        '<button class="btn hc-input-del-btn" ng-click="deleteClick()" ng-show="showDelete">×</button>' +
                        '<button data-toggle="dropdown" class="btn dropdown-toggle" type="button" aria-expanded="true">' +
                        '<i class="fa fa-angle-down"></i>' +
                        '</button>' +
                        '<ul class="dropdown-menu pull-right"  >' +
                        '<li ng-repeat="selectOption in selectOptions"   >' +
                        '<a ng-click="selectClick(selectOption)" ng-bind="selectOption.name"  ></a>' +
                        '</li>' +
                        '</ul>' +
                        '</span>' +
                        '<i class="star">*</i>' +
                        '</div>');

                    // 传入scope，得到编译好的dom对象(已封装为jqlite对象)
                    // 也可以用$scope.$new()创建继承的作用域
                    var $dom = compileFn(scope);

                    // if (params.cellStartedEdit) {
                    //     eInput = $compile('<div hc-input="startValue"  hc-dict-code="style" ' +
                    //         '            ></hc-grid-paging>');
                    // }
                    self.$dom = $dom;
                    scope.$dom = $dom;
                    var $input = $dom[0].getElementsByTagName('input')[0];
                    self.$input = $input;
                    scope.$input = $input;

                    // return $dom;

                }].callByAngular();
            },
            // gets called when tabbing trough cells and in full row edit mode
            focusIn: function () {
                var eInput = this.getGui();
                eInput.focus();
                eInput.select();
            },
            getInput: function () {
                return this.$input;
            },
            getValue: function () {
                var eInput = this.getInput();
                var eInputname = eInput.value;
                var params = this.params;

                if (params.values.length
                    && params.names.length
                    && params.values.length === params.names.length) {
                    var index = params.names.findIndex(function (name) {
                        return name == eInputname;
                    });
                    if (index >= 0)
                        return params.values[index];
                }

                return '';

            },
            destroy: function () {
                this.params.api.stopEditing(false);
                var $dom = this.$dom;
                $dom.remove();
            },
            getGui: function () {
                return this.$dom[0];
            }
        }

        return api;
    }
);