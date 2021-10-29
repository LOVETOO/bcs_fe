/**
 * 表格
 * @since 2018-10-02
 */
define(
    ['module', 'directiveApi', 'gridApi', 'directive/hcAutoHeight','plugins/aggrid/ag-grid-enterprise.hc','directive/hcGrid'],
    function (module, directiveApi, gridApi,hcAutoHeight,agGrid) {
        //定义指令
        var directive = [
            function () {
                return {
                    restrict: 'A',
                    scope: {
                        sgColumns: '=',
                        sgOptions: '=',
                        sgData: '='
                    },
                    controller: [
                        '$scope', '$element', '$attrs',
                        function (scope, element, attrs) {
                            console.log('agGridview link start');
                            /** 日期接口*/
                            function DateCellEditor() {
                                DateCellEditor.prototype.init = function (params) {
                                    this.params = params;
                                    $input = $("<INPUT type='text' class='editor-text' />");

                                    if (params.column.colDef.cellchange) {
                                        $input.on("change", params.column.colDef.cellchange);
                                    }

                                    this.textarea = $input[0];
                                    if (params.value) {
                                        params.value = params.value.substring(0, 10);
                                    }

                                    this.textarea.value = params.value;
                                    $input.datepicker({
                                        format: "yyyy-mm-dd",
                                        todayBtn: true,
                                        forceParse: true,
                                        language: "zh-CN",
                                        multidate: false,
                                        autoclose: true,
                                        todayHighlight: true,
                                        beforeShow: function () {
                                            calendarOpen = true
                                        },
                                        onClose: function () {
                                            calendarOpen = false
                                        }
                                    });
                                    $input.focus().select();
                                    if (params.value == undefined) {
                                        $input.data("datepicker").setDate("");
                                    } else {
                                        $input.data("datepicker").setDate(params.value);
                                    }

                                };
                                DateCellEditor.prototype.onKeyDown = function (event) {
                                    var key = event.which || event.keyCode;
                                    if (key == constants_1.Constants.KEY_LEFT ||
                                        key == constants_1.Constants.KEY_UP ||
                                        key == constants_1.Constants.KEY_RIGHT ||
                                        key == constants_1.Constants.KEY_DOWN ||
                                        (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                                        event.stopPropagation();
                                    }
                                };
                                DateCellEditor.prototype.getGui = function () {
                                    return this.textarea;
                                };
                                DateCellEditor.prototype.afterGuiAttached = function () {
                                    this.textarea.focus();
                                    $input.select();
                                };
                                DateCellEditor.prototype.getValue = function () {
                                    if (this.textarea.value == undefined) {
                                        return ""
                                    } else {
                                        return this.textarea.value.substring(0, 10);
                                        ;
                                    }

                                };
                                DateCellEditor.prototype.destroy = function () {
                                    this.params.api.stopEditing(false);
                                    $.datepicker.dpDiv.stop(true, true);
                                    $input.datepicker("hide");
                                    $input.datepicker("destroy");
                                    $input.remove();
                                };
                            }

                            /** 日期接口 时分秒*/
                            function DatetimeCellEditor() {
                                DatetimeCellEditor.prototype.init = function (params) {
                                    this.params = params;
                                    $input = $("<INPUT type='text' class='editor-text' />");
                                    if (params.column.colDef.cellchange) {
                                        $input.on("change", params.column.colDef.cellchange);
                                    }
                                    this.textarea = $input[0];
                                    this.textarea.value = params.value;
                                    $input.datetimepicker({
                                        format: "yyyy-mm-dd hh:ii:ss",
                                        todayBtn: true,
                                        forceParse: true,
                                        startView: "month",
                                        language: "zh-CN",
                                        multidate: false,
                                        autoclose: true,
                                        todayHighlight: true,
                                        beforeShow: function () {
                                            calendarOpen = true
                                        },
                                        onClose: function () {
                                            calendarOpen = false
                                        }
                                    });

                                };

                                DatetimeCellEditor.prototype.onKeyDown = function (event) {
                                    var key = event.which || event.keyCode;
                                    if (key == constants_1.Constants.KEY_LEFT ||
                                        key == constants_1.Constants.KEY_UP ||
                                        key == constants_1.Constants.KEY_RIGHT ||
                                        key == constants_1.Constants.KEY_DOWN ||
                                        (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                                        event.stopPropagation();
                                    }
                                };

                                DatetimeCellEditor.prototype.getGui = function () {
                                    $input.datetimepicker("show");
                                    return this.textarea;
                                };
                                DatetimeCellEditor.prototype.afterGuiAttached = function () {
                                    this.textarea.focus();
                                    $input.select();
                                };
                                DatetimeCellEditor.prototype.getValue = function () {
                                    if (this.textarea.value == undefined) {
                                        return ""
                                    } else {
                                        return this.textarea.value;
                                    }

                                };
                                DatetimeCellEditor.prototype.destroy = function () {
                                    this.params.api.stopEditing(false);
                                    //$.datetimepicker.dpDiv.stop(true, true);
                                    $input.datetimepicker("hide");
                                    $input.datetimepicker("destroy");
                                    $input.remove();
                                };
                            }

                            //年月日渲染，值保有YYYY-MM-DD
                            function DateRenderer(params) {
                                if (params.value != undefined) {
                                    params.value = params.value.substring(0, 10);
                                }
                                return params.value || '';
                            }

                            /**-----------------------*/
                            /**下拉框接口*/
                            function SelectCellEditor() {
                                SelectCellEditor.prototype.init = function (params) {
                                    this.params = params;
                                    $eSelect = $('<div class="ag-cell-edit-input"><select class="ag-cell-edit-input"/></select></div>')
                                    if (params.column.colDef.cellchange) {
                                        $eSelect.on("input", params.column.colDef.cellchange);
                                    }
                                    /**if (params.column.colDef.onclick) {
					   $eSelect.on("click", params.column.colDef.onclick);
					}*/
                                    var eSelect = this.getGui().querySelector('select');
                                    var option = document.createElement('option');
                                    option.value = 0;
                                    option.text = "";
                                    eSelect.appendChild(option);
                                    for (var i = 0; i < params.values.length; i++) {
                                        value = params.values[i];
                                        if (typeof(value) == "object") {
                                            var v = value.value;
                                            var t = value.desc;
                                        }
                                        var option = document.createElement('option');
                                        if (v == undefined || v == null) {
                                            option.value = "";
                                        } else {
                                            option.value = isNaN(v) ? v : parseInt(v);
                                        }
                                        if (t == null) {
                                            option.text = "";
                                        } else {
                                            option.text = t;
                                        }

                                        if (((params.value) == t) || (params.value) == v) {
                                            option.selected = true;
                                        }
                                        eSelect.appendChild(option);
                                    }
                                };
                                SelectCellEditor.prototype.getGui = function () {
                                    return $eSelect[0];
                                };
                                SelectCellEditor.prototype.afterGuiAttached = function () {

                                    var eSelect = this.getGui().querySelector('select');
                                    eSelect.focus();
                                };
                                SelectCellEditor.prototype.addDestroyableEventListener = function () {
                                };
                                SelectCellEditor.prototype.getValue = function () {
                                    var eSelect = this.getGui().querySelector('select');
                                    return eSelect.value;
                                };
                                SelectCellEditor.prototype.destroy = function () {
                                    this.params.api.stopEditing(false);
                                    $eSelect.remove();

                                };
                            }

                            /**下拉框渲染*/
                            function selectRenderer(params) {
                                if (params.column.colDef.onclick) {
                                    $(params.eGridCell).on("click", params.column.colDef.onclick);
                                }
                                if (params.colDef.cellEditorParams) {
                                    for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                                        if (params.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                            return params.colDef.cellEditorParams.values[i].desc;
                                        }
                                    }
                                }
                                if (params.columnApi.getRowGroupColumns()[0]) {
                                    if (params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams) {
                                        for (var i = 0; i < params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values.length; i++) {
                                            if (params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                                return params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values[i].desc;
                                            }
                                        }
                                    }
                                }
                                if (params.value != undefined) {
                                    if (parseInt(params.value) == 0) {
                                        return "";
                                    } else {
                                        if (params.value == "null") {
                                            params.value = "";
                                        }
                                        return params.value
                                    }
                                } else {
                                    return "";
                                }
                            }

                            /**多选下拉框接口*/
                            function chooseSelectCellEditor() {
                                chooseSelectCellEditor.prototype.init = function (params) {
                                    var top = $(document).scrollLeft();
                                    this.params = params;
                                    var $eSelect = $("<div class='chosen-container chosen-container-single chosen-container-multi' style='width:100%;'></div>");
                                    var $select_lists = $("<ul class='chosen-choices' style='border:none;border-bottom:1px solid #ccc;padding:0;'><a style='border-bottom:none;' class='chosen-single chosen-default multi-select'><span></span><div><b></b></div></a></ul>");
                                    var $select_drop = $("<div class='chosen-drop'><ul class='chosen-results' style='border-top:1px solid positon:fixed #ccc;position: fixed;background:white;width:" + (this.params.column.actualWidth) + "px'></ul></div>");
                                    $eSelect.append($select_lists).append($select_drop);

                                    $select_lists.on("click", function (event) {
                                        var l = $(this).offset();
                                        $select_drop[0].childNodes[0].style.width = (this.clientWidth) + "px";
                                        $eSelect.toggleClass('chosen-with-drop');
                                        if ($eSelect.attr('class').indexOf('chosen-with-drop') > -1) {
                                            $($select_drop[0].childNodes[0]).offset({
                                                left: l.left
                                            });
                                        } else {
                                            $($select_drop[0].childNodes[0]).offset({
                                                left: 1000001
                                            });
                                        }
                                        //s.left=l.left;
                                        //$select_drop[0].style.marginLeft=(l.left-s.left+1)+"px";
                                        stop(event);

                                    });

                                    function stop(event) {
                                        var e = window.event || event;
                                        if (e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器
                                            e.stopPropagation();
                                        } else {
                                            window.event.cancelBubble = true; // 兼容IE的方式来取消事件冒泡
                                        }
                                    }

                                    var list = "";
                                    for (var i = 0; i < params.values.length; i++) {
                                        list += "<li class='active-result' data-id='" + params.values[i].value + "'>" +
                                            "<i class='fa fa-check hide'></i>" +
                                            "<span title='" + params.values[i].desc + "'>" + params.values[i].desc + "</span>" +
                                            "</li>";
                                        $select_drop.children().html("").append(list);
                                        $select_drop.find("li").on("click", function (event) { //选中某一个
                                            //                      console.log($(this).attr("data-id"));
                                            all_stat = false;
                                            var select_id = $(this).attr("data-id");
                                            $(this).find("i").toggleClass("hide");
                                            var val_list = [];
                                            var desc_list = [];
                                            $select_drop.find("li.active-result").each(function () {
                                                if (!$(this).find("i").hasClass("hide")) {
                                                    val_list.push($(this).attr('data-id'));
                                                    desc_list.push($(this).find("span").html());
                                                }
                                            });
                                            var _this_val = HczyCommon.appendComma(val_list);
                                            //this.params.value = _this_val;
                                            $eSelect[0].value = _this_val;
                                            var _this_desc = HczyCommon.appendComma(desc_list);
                                            $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                                            stop(event);
                                        });
                                    }

                                    function checksel(params) {
                                        var a = params.value;
                                        if (a != undefined) {
                                            var val_list = [];
                                            if ($.trim(a)) {
                                                if (String(a).indexOf(",") > -1) val_list = a.split(",");
                                                else val_list.push(a);
                                            }
                                            $select_drop.find("li.active-result").find("i").addClass("hide");
                                            var desc_list = [];
                                            $select_drop.find("li.active-result").each(function () {
                                                var id = $(this).attr("data-id");
                                                for (var i = 0; i < val_list.length; i++) {
                                                    if (val_list[i] == id) {
                                                        $(this).find("i").removeClass("hide");
                                                    }
                                                }

                                                if (!$(this).find("i").hasClass("hide")) {
                                                    desc_list.push($(this).find("span").html());
                                                }
                                            });
                                            var _this_desc = HczyCommon.appendComma(desc_list);
                                            params.desc = _this_desc;
                                            $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                                        } else {
                                            $select_lists.find("a").find("span").attr("title", _this_desc).html("");
                                            $select_drop.find("li.active-result").find("i").addClass("hide");
                                        }
                                    }

                                    checksel(params);
                                    this.eSelect = $eSelect[0];
                                    $eSelect[0].value = params.value;

                                };
                                chooseSelectCellEditor.prototype.getGui = function () {
                                    return this.eSelect;
                                };
                                chooseSelectCellEditor.prototype.afterGuiAttached = function () {

                                    $(this.eSelect).focus();
                                };
                                chooseSelectCellEditor.prototype.addDestroyableEventListener = function () {
                                };
                                chooseSelectCellEditor.prototype.getValue = function () {
                                    return this.eSelect.value;
                                };
                                chooseSelectCellEditor.prototype.destroy = function () {
                                    this.params.api.stopEditing(false);
                                    $(this.eSelect).remove();
                                };
                            }

                            /**多选下拉框渲染*/
                            function chooseSelectRenderer(params) {
                                if (params.column.colDef.onclick) {
                                    $(params.eGridCell).on("click", params.column.colDef.onclick);
                                }
                                params.value += "";
                                if (params.value == "" || params.value == undefined) {
                                    return "";
                                }
                                var str = "";
                                if (params.colDef.cellEditorParams) {
                                    for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                                        if (params.value.indexOf(',') > -1) {
                                            var list = params.value.split(",");
                                            for (var j = 0; j < list.length; j++) {
                                                if (params.colDef.cellEditorParams.values[i].value == parseInt(list[j])) {
                                                    if (j == list.length - 1) {
                                                        str += params.colDef.cellEditorParams.values[i].desc
                                                    } else {
                                                        str += params.colDef.cellEditorParams.values[i].desc + ',';
                                                    }

                                                }
                                            }
                                        } else {
                                            if (params.colDef.cellEditorParams) {
                                                for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                                                    if (params.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                                        return params.colDef.cellEditorParams.values[i].desc;
                                                    }
                                                }
                                            }
                                        }

                                    }
                                    return str;
                                }
                            }

                            /** 弹出框*/
                            function ButtonCellEditor() {
                                ButtonCellEditor.prototype.init = function (params) {
                                    $div = $('<div  tabindex="0"><div class="input-group" style="width:100%;height:100%;"></div></div>')
                                    this.params = params;
                                    this.input = document.createElement("INPUT");
                                    this.input.className = "input-sm form-control"
                                    if (this.params.column.colDef.non_readonly) {
                                        this.input.readOnly = false;
                                    } else {
                                        this.input.readOnly = true;
                                    }
                                    if (params.value != undefined) {
                                        this.input.value = params.value;
                                    }
                                    this.input.focus();
                                    $div.select();
                                    if (params.column.colDef.cellchange) {
                                        $div.on("input", params.column.colDef.cellchange);
                                    }
                                    this.A = document.createElement("A");
                                    this.A.className = "input-group-addon"
                                    if (this.params.column.colDef.action != undefined) {
                                        this.A.addEventListener("click", this.params.column.colDef.action);
                                    }
                                    this.I = document.createElement("I");
                                    this.I.className = "fa fa-ellipsis-h"

                                    this.getGui().querySelector('.input-group').appendChild(this.input);
                                    this.getGui().querySelector('.input-group').appendChild(this.A);
                                    this.getGui().querySelector('.input-group-addon').appendChild(this.I);
                                };
                                ButtonCellEditor.prototype.getGui = function () {
                                    return $div[0];
                                };

                                ButtonCellEditor.prototype.afterGuiAttached = function () {
                                    this.input.focus();
                                    $div.select();
                                };
                                ButtonCellEditor.prototype.addDestroyableEventListener = function () {
                                };
                                ButtonCellEditor.prototype.getValue = function () {
                                    return this.input.value;
                                };
                            }

                            /**文本框*/
                            function TextCellEditor() {
                            }

                            TextCellEditor.prototype.init = function (params) {

                                this.params = params;
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                                /**this.params.api.gridPanel.eAllCellContainers.forEach(function(container){
                container.removeEventListener("keydown");
            })*/
                                    //this.params.api.gridOptionsWrapper.gridOptions.suppressCellSelection=true;
                                var temp = this.params.api.getFocusedCell();
                                $input = $('<input class="ag-cell-edit-input" index="' + temp.rowIndex + '" type="text"/>');
                                if (params.column.colDef.cellchange) {
                                    $input.on("input", params.column.colDef.cellchange);
                                }
                                if (params.column.colDef.onclick) {
                                    $input.on("click", params.column.colDef.onclick);
                                }

                                this.textarea = $input[0];
                                if (params.charPress) {
                                    this.textarea.value = params.charPress;
                                } else {
                                    if (params.value !== undefined && params.value !== null) {
                                        this.textarea.value = params.value;
                                    }
                                    if (this.params.keyPress == 2) {
                                        this.textarea.focus();
                                    } else {
                                        this.textarea.focus();
                                        $input.select();
                                    }
                                }
                            };
                            TextCellEditor.prototype.onKeyDown = function (event) {
                                var key = event.which || event.keyCode;
                                if (key == constants_1.Constants.KEY_LEFT ||
                                    key == constants_1.Constants.KEY_UP ||
                                    key == constants_1.Constants.KEY_RIGHT ||
                                    key == constants_1.Constants.KEY_DOWN ||
                                    (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                                    event.stopPropagation();
                                }
                            };
                            TextCellEditor.prototype.getGui = function () {
                                return this.textarea;
                            };
                            TextCellEditor.prototype.afterGuiAttached = function () {
                                if (this.params.keyPress == 2) {
                                    this.textarea.focus();
                                } else {
                                    this.textarea.focus();
                                    $input.select();

                                }
                            };
                            TextCellEditor.prototype.isCancelBeforeStart = function () {
                                return this.cancelBeforeStart;
                            };
                            TextCellEditor.prototype.getValue = function () {

                                return this.textarea.value;
                            };
                            TextCellEditor.prototype.destroy = function () {
                                this.params.api.stopEditing(false);
                                $input.remove();
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                                //this.params.api.gridOptionsWrapper.gridOptions.suppressCellSelection=false;
                                this.textarea.style.color = "red";
                            };

                            /**编辑框*/
                            function buttonRenderer(params) {
                                this.params = params;
                                $button = $('<button class="btn btn-sm btn-info dropdown-toggle" style="padding-top: 0px;padding-bottom: 0px">编辑</button>');
                                this.button = $button[0];
                                if (params.column.colDef.action) {
                                    this.button.addEventListener("click", params.column.colDef.action);
                                }
                                return this.button;
                            }

                            /**编辑框*/
                            function aRenderer(params) {
                                this.params = params;
                                if (this.params.data) {
                                    $button = $('<a href="#/crmman/' + this.params.data.nextStat + '?param=' + this.params.data.url_param + '"  class="text-info ng-binding">详情</a>');
                                    this.A = $button[0];
                                    return this.A;
                                }
                            }

                            /*保存框*/
                            function saveRenderer(params) {
                                this.params = params;
                                $button = $('<button class="btn btn-sm btn-info dropdown-toggle" style="padding-top: 0px;padding-bottom: 0px" type="button">保存</button>');
                                this.button = $button[0];
                                if (params.column.colDef.buttonclick) {
                                    this.button.addEventListener("click", params.column.colDef.buttonclick);
                                }
                                return this.button;
                            }

                            /**-------------整数框------------*/
                            function getCharCodeFromEvent(event) {
                                event = event || window.event;
                                return (typeof event.which == "undefined") ? event.keyCode : event.which;
                            }

                            function isCharNumeric(charStr) {
                                return /^(0|[1-9][0-9]*|-[1-9][0-9]*|-*)$/.test(charStr);
                            }

                            function isKeyPressedNumeric(event) {
                                var charCode = getCharCodeFromEvent(event);
                                var charStr = String.fromCharCode(charCode);
                                return isCharNumeric(charStr);
                            }

                            function NumericCellEditor() {
                            }

                            NumericCellEditor.prototype.init = function (params) {
                                this.params = params;
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                                var temp = this.params.api.getFocusedCell();
                                $input = $('<input class="ag-cell-edit-input" index="' + temp.rowIndex + '" type="number"/>');
                                if (params.column.colDef.cellchange) {
                                    $input.on("input", params.column.colDef.cellchange);
                                }
                                if (params.column.colDef.cellEditingStopped) {
                                    $input.on("blur", params.column.colDef.cellEditingStopped);
                                }

                                this.eInput = $input[0];
                                if (params.value != undefined) {
                                    this.eInput.value = params.value;
                                }
                                if (this.params.keyPress == 2) {
                                    this.eInput.focus();
                                } else {
                                    this.eInput.focus();
                                    $input.select();

                                }
                                var that = this;
                                this.eInput.addEventListener('keypress', function (event) {
                                    if (!isKeyPressedNumeric(event)) {
                                        that.eInput.focus();
                                        if (event.preventDefault) event.preventDefault();
                                    }
                                });
                                var charPressIsNotANumber = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
                                this.cancelBeforeStart = charPressIsNotANumber;

                            };
                            NumericCellEditor.prototype.getGui = function () {
                                return this.eInput;
                            };
                            NumericCellEditor.prototype.afterGuiAttached = function () {
                                if (this.params.keyPress == 2) {
                                    this.eInput.focus();
                                } else {
                                    this.eInput.focus();
                                    $input.select();

                                }

                            };
                            NumericCellEditor.prototype.isCancelBeforeStart = function () {
                                return this.cancelBeforeStart;
                            };
                            NumericCellEditor.prototype.isCancelAfterEnd = function () {
                                //var value = this.getValue();
                                return false;
                            };
                            NumericCellEditor.prototype.getValue = function () {
                                return parseInt(this.eInput.value || 0);

                            };
                            NumericCellEditor.prototype.isPopup = function () {
                                return false;
                            };
                            NumericCellEditor.prototype.destroy = function () {
                                this.params.api.stopEditing(false);
                                $input.remove();
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                            };

                            /**-------------------------*/

                            /**-------------浮点框------------*/
                            function FloatCellEditor() {
                            }

                            FloatCellEditor.prototype.init = function (params) {
                                this.params = params;
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                                var temp = this.params.api.getFocusedCell();
                                $input = $('<input class="ag-cell-edit-input"  index="' + temp.rowIndex + '" type="number"/>');

                                this.eInput = $input[0];
                                if (params.value != undefined) {
                                    this.eInput.value = params.value;
                                }
                                if (this.params.keyPress == 2) {
                                    this.eInput.focus();
                                } else {
                                    this.eInput.focus();
                                    $input.select();

                                }
                                var that = this;
                                $input.bind("keydown.nav", function (e) {
                                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                                        e.stopImmediatePropagation();
                                    }
                                    if ((e.keyCode == 190)) {
                                        $input.unbind("input", params.column.colDef.cellchange);
                                    } else {
                                        if (params.column.colDef.cellchange) {
                                            $input.on("input", params.column.colDef.cellchange);
                                        }
                                    }
                                });
                                $input.on('mousewheel.disableScroll', function (e) {
                                    e.preventDefault();
                                });
                                $input.on('blur', function (e) {
                                    $(this).off('mousewheel.disableScroll');
                                });
                            };
                            FloatCellEditor.prototype.getGui = function () {
                                return this.eInput;
                            };
                            FloatCellEditor.prototype.afterGuiAttached = function () {
                                if (this.params.keyPress == 2) {
                                    this.eInput.focus();
                                } else {
                                    this.eInput.focus();
                                    $input.select();

                                }
                            };
                            FloatCellEditor.prototype.isCancelBeforeStart = function () {
                                return this.cancelBeforeStart;
                            };
                            FloatCellEditor.prototype.isCancelAfterEnd = function () {
                                return false;
                            };
                            FloatCellEditor.prototype.getValue = function () {
                                return parseFloat(this.eInput.value || 0)
                            };
                            FloatCellEditor.prototype.isPopup = function () {
                                return false;
                            };
                            FloatCellEditor.prototype.destroy = function () {
                                $input.remove();
                                this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                            };

                            /**-------------------------*/

                            /**-------------复选框------------*/
                            function CheckboxCellEditor() {
                            }

                            CheckboxCellEditor.prototype.init = function (params) {

                                $checkbox = $('<input class="ag-cell-edit-input" type="checkbox" />');
                                if (params.column.colDef.cellchange) {
                                    $checkbox.on("change", params.column.colDef.cellchange);
                                }
                                this.eInput = $checkbox[0];
                                if (params.column.colDef.checkbox_value) {
                                    if (parseInt(params.value) == params.column.colDef.checkbox_value) {
                                        this.eInput.value = params.value;
                                        this.eInput.checked = true
                                    } else {
                                        this.eInput.value = params.value;
                                        this.eInput.checked = false
                                    }
                                } else {
                                    if (params.value != undefined) {
                                        if (parseInt(params.value) == 2) {
                                            this.eInput.value = params.value;
                                            this.eInput.checked = true
                                        } else {
                                            this.eInput.value = params.value;
                                            this.eInput.checked = false
                                        }
                                    }
                                }
                                var that = this;
                                CheckboxCellEditor.prototype.getValue = function () {
                                    if ($checkbox.prop('checked')) {
                                        if (params.column.colDef.checkbox_value) {
                                            return params.column.colDef.checkbox_value;
                                        } else {
                                            return 2;
                                        }
                                    } else {
                                        if (params.column.colDef.checkbox_value == 1) {
                                            return 0
                                        } else {
                                            return 1;
                                        }

                                    }
                                    ;
                                };
                            };
                            CheckboxCellEditor.prototype.getGui = function () {
                                return this.eInput;
                            };
                            CheckboxCellEditor.prototype.afterGuiAttached = function () {
                                this.eInput.focus();
                            };

                            CheckboxCellEditor.prototype.isPopup = function () {
                                return false;
                            };

                            //复选框渲染
                            function CheckboxRenderer(params) {
                                if (params.column.colDef.checkbox_value) {
                                    if (parseInt(params.value) == params.column.colDef.checkbox_value) {
                                        return "<img style='positon:center' src='../img/tick.png'>";
                                    } else {
                                        return "";
                                    }
                                } else {
                                    if (parseInt(params.value) == 2) {
                                        return "<img style='positon:center' src='../img/tick.png'>";
                                    } else {
                                        return "";
                                    }
                                }
                            }

                            function currencyCssFunc(params) {
                                return {
                                    "color": "red",
                                    "text-align": "right",
                                    "font-weight": "bold"
                                };

                            }

                            //树状结构样式
                            function innerCellRenderer(params) {
                                if (params.column.colDef.onclick) {
                                    $(params.eGridCell).on("click", params.column.colDef.onclick);
                                }
                                //return "<img style='positon:center'style='padding-left: 4px;' src='../img/tick.png'>" + params.data[params.colDef.field];
                                return params.data[params.colDef.field];
                                ;
                            }

                            //千分位
                            function NumberRenderer(params) {
                                if (params.column.colDef.dblclick) {
                                    $(params.eGridCell).on("dblclick", params.column.colDef.dblclick);
                                }
                                if (params.data && params.data[params.colDef.field] && params.data[params.colDef.field].value) {
                                    params.value = params.data[params.colDef.field].value;
                                }
                                if (params.value === null || params.value === undefined) {
                                    return null;
                                } else if (isNaN(params.value)) {
                                    return 'NaN';
                                } else {
                                    if (parseInt(params.value) == params.value)
                                        return $filter('number')(parseInt(params.value), 0);
                                    else
                                        return $filter('number')(params.value, 2);
                                }
                            }

                            /**-------------------------*/
                            //导出excel
                            function getContextMenuItems(params) {
                                var result = params.defaultItems.splice(0);
                                result.push({
                                    name: '导出excel',
                                    icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                                    //shortcut: 'Alt + M',
                                    action: function () {
                                        /**var value = params.value ? params.value : '<empty>';
                                         var filename = "导出数据.xls";

                                         var nodes = scope.sgOptions.api.getModel().rootNode.allLeafChildren;
                                         var data = [];
                                         for (var i = 0; i < nodes.length; i++) {
						    data.push(nodes[i].data);
						}

                                         var result = scope.sgOptions.columnApi.getAllGridColumns();
                                         var temp_columns = [];
                                         for (var i = 0; i < result.length; i++) {
						    temp_columns.push(result[i].colDef);
						    if (result[i].colDef.cellRenderer && result[i].colDef.cellRenderer.toString() == "function (params) {return DateRenderer(params)}") {
						        for (var j = 0; j < data.length; j++) {
						            data[j][result[i].colDef.field] = data[j][result[i].colDef.field].substring(0, 10);
						        }
						    }
						}


                                         /**if(!data.length){
						    BaseService.notice("没有需要导出的数据!","alert-warning");
						    return;
						}

                                         for (var i = 0; i < temp_columns.length; i++) {
						    temp_columns[i].name = temp_columns[i].headerName;
						    temp_columns[i].width = Math.ceil(result[i].actualWidth / 14);
						    if (temp_columns[i].cellEditor && temp_columns[i].cellEditor.name) {
						        if (temp_columns[i].cellEditor.name == "DateCellEditor") {
						            temp_columns[i].type = "date";
						        } else if (temp_columns[i].cellEditor.name == "SelectCellEditor") {
						            temp_columns[i].type = "number";
						            temp_columns[i].options = temp_columns[i].cellEditorParams.values;
						        } else if (temp_columns[i].cellEditor.name == "NumericCellEditor" || temp_columns[i].cellEditor.name == "FloatCellEditor") {
						            temp_columns[i].type = "number";
						        } else {
						            temp_columns[i].type = "string";
						        }
						    } else {
						        temp_columns[i].type = "string";
						    }
						}

                                         $http({
						        method: 'post',
						        url: '/exportexcel',
						        data: {
						            export_cols: temp_columns,
						            export_sum_cols: [],
						            export_datas: data
						        },
						        params: { id: Math.random() },
						        responseType: "arraybuffer"
						    })
                                         .success(function(response, status, xhr, config) {

						        var data = new Blob([response], { type: 'application/vnd.ms-excel' });
						        saveAs(data, filename);
						    }).error(function(response) {

						        BaseService.notice("数据处理异常!", "alert-warning");
						    });*/
                                        var params = {};
                                        params.processCellCallback = function (params) {
                                            if (params.column.colDef.cellEditorParams) {
                                                for (var i = 0; i < params.column.colDef.cellEditorParams.values.length; i++) {
                                                    if (params.column.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                                        return params.column.colDef.cellEditorParams.values[i].desc;
                                                    }
                                                }
                                            } else {
                                                return params.value
                                            }
                                        };
                                        scope.sgOptions.api.exportDataAsExcel(params);
                                    }
                                });
                                result.push({
                                    name: '选中多行',
                                    icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                                    shortcut: 'Alt + M',
                                    action: function () {
                                        var cellRanges = scope.sgOptions.api.clipboardService.rangeController.cellRanges;
                                        var nodes = scope.sgOptions.api.getModel().rootNode.childrenAfterSort;
                                        for (var i = cellRanges[0].start.rowIndex; i < cellRanges[0].end.rowIndex + 1; i++) {
                                            if (nodes[cellRanges[0].end.rowIndex].selected == true) {
                                                scope.sgOptions.api.clipboardService.selectionController.selectedNodes[nodes[i].id] = undefined;
                                                nodes[i].selected = false
                                            } else {
                                                scope.sgOptions.api.clipboardService.selectionController.selectedNodes[nodes[i].id] = nodes[i];
                                                ;
                                                nodes[i].selected = true
                                            }
                                            ;
                                        }
                                        scope.sgOptions.api.refreshRows(nodes);
                                    }
                                });
                                result.push({
                                    name: '自适应高度(还原)',
                                    icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                                    shortcut: 'Alt + L',
                                    action: function () {
                                        function getTreeL(nodes) {
                                            var L = 0;

                                            function getlength(nodesC) {
                                                for (var i = 0; i < nodesC.length; i++) {
                                                    if (nodesC[i].expanded) {
                                                        L = L + nodesC[i].childrenAfterGroup.length;
                                                        getlength(nodesC[i].childrenAfterGroup)
                                                    }
                                                }

                                            }

                                            getlength(nodes);
                                            return L;
                                        }

                                        var nodes = scope.sgOptions.api.getModel().rootNode.childrenAfterGroup;
                                        var treeL = getTreeL(nodes);
                                        var l = 25 * (nodes.length + treeL + 2);
                                        if (parseInt(element[0].style.height) != l) {
                                            scope.height = element[0].style.height;
                                            element[0].style.height = l + 'px';
                                        } else {
                                            element[0].style.height = scope.height;
                                        }
                                        scope.sgOptions.api.doLayout();
                                    }
                                });
                                if (scope.sgOptions.contextMenuArray) {
                                    for (var i = 0; i < scope.sgOptions.contextMenuArray.length; i++) {
                                        result.push(scope.sgOptions.contextMenuArray[i]);
                                    }
                                }
                                return result;
                            }

                            //选中多行
                            function doSelectRow(params) {
                                var result = params.defaultItems.splice(0);
                                result.push({
                                    name: '选中多行',
                                    icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                                    //shortcut: 'Alt + M',
                                    action: function () {

                                    }
                                });

                                return result;
                            }

                            /**刷新所有的网格值*/

                            var filename = attrs["filename"] || "导出数据.xls";

                            if (!scope.sgOptions) {
                                console.error("未定义网格列/属性");
                                return;
                            }
                            /**自定义接口框具体实现*/
                            for (var i = 0; i < scope.sgColumns.length; i++) {
                                if (scope.sgColumns[i].children) {
                                    for (var j = 0; j < scope.sgColumns[i].children.length; j++) {
                                        if (scope.sgColumns[i].children[j].cellEditor == "年月日") {
                                            scope.sgColumns[i].children[j].cellEditor = DateCellEditor;
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return DateRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "时分秒") {
                                            scope.sgColumns[i].children[j].cellEditor = DatetimeCellEditor;
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "下拉框") {
                                            scope.sgColumns[i].children[j].cellEditor = SelectCellEditor;
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return selectRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "弹出框") {
                                            scope.sgColumns[i].children[j].cellEditor = ButtonCellEditor;
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "文本框") {
                                            scope.sgColumns[i].children[j].cellEditor = TextCellEditor;
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "整数框") {
                                            scope.sgColumns[i].children[j].cellStyle = {
                                                'text-align': 'right'
                                            };
                                            scope.sgColumns[i].children[j].cellEditor = NumericCellEditor;
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return NumberRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "浮点框") {
                                            scope.sgColumns[i].children[j].cellStyle = {
                                                'text-align': 'right'
                                            };
                                            scope.sgColumns[i].children[j].cellEditor = FloatCellEditor;
                                            if (!scope.sgColumns[i].children[j].cellRenderer) {
                                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                    return NumberRenderer(params)
                                                };
                                            }

                                        } else if (scope.sgColumns[i].children[j].cellEditor == "复选框") {
                                            scope.sgColumns[i].children[j].cellEditor = CheckboxCellEditor;
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return CheckboxRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "树状结构") {
                                            //scope.sgColumns[i].children[j].cellRenderer='group';
                                            //scope.sgColumns[i].children[j].cellRendererParams.innerRenderer=function(params){return innerCellRenderer(params)};
                                        } else if (scope.sgColumns[i].children[j].cellRenderer == "编辑框渲染") {
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return buttonRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellRenderer == "链接渲染") {
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return aRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellRenderer == "保存框渲染") {
                                            scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                                return saveRenderer(params)
                                            };
                                        } else if (scope.sgColumns[i].children[j].cellEditor == "选择框") {
                                            scope.sgColumns[i].children[j].checkboxSelection = function (params) {
                                                return params.columnApi.getRowGroupColumns().length === 0
                                            };
                                            scope.sgColumns[i].children[j].headerCellTemplate = function () {
                                                var eCell = document.createElement('span');
                                                eCell.innerHTML = '<div style="text-align: left;"><span id="myMenuButton" class="ag-selection-checkbox"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRkJCRDU1MTEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRkJCRDU1MDEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+riMaEQAAAL5JREFUeNqUks0JhDAQhSd7tgtLMDUIyTXF2IdNWIE3c0ruYg9LtgcPzvpEF8SfHR8MGR75hpcwRERmrjQXCyutDKUQAkuFu2AUpsyiJ1JK0UtycRgGMsbsPBFYVRVZaw/+7Zu895znOY/j+PPWT7oGp2lirTU3TbPz/4IAAGLALeic47Ztlx7RELHrusPAAwgoy7LlrOuay7I8TXIadYOLouC+7+XgBiP2lTbw0crFGAF9ANq1kS75G8xXgAEAiqu9OeWZ/voAAAAASUVORK5CYII=" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkU1Rjk1NDExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkU1Rjk1MzExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t+CXswAAAFBJREFUeNrsksENwDAIA023a9YGNqlItkixlAFIn1VOMv5wvACAOxOZWUwsB6Gqswp36QivJNhBRHDhI0f8j9jNrCy4O2twNMobT/7QeQUYAFaKU1yE2OfhAAAAAElFTkSuQmCC" style="display: inline;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjU4MzhGQjEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMjU4MzhGQTEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2Xml2QAAAGBJREFUeNpiYGBg8ATiZ0D8n0j8DKqH4dnhw4f/EwtAakF6GEGmAAEDKYCRkZGBiYFMQH+NLNjcjw2ghwMLIQWDx48Do/H5kSNHiNZw9OhREPUCRHiBNJOQyJ+A9AAEGACqkFldNkPUwwAAAABJRU5ErkJggg==" style="display: none;"></span></div>'
                                                var eMenuButton = eCell.querySelector('#myMenuButton');
                                                eMenuButton.addEventListener('click', function () {
                                                    scope.sgOptions.api.selectAll();
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    if (scope.sgColumns[i].cellEditor == "年月日") {
                                        scope.sgColumns[i].cellEditor = DateCellEditor;
                                        scope.sgColumns[i].filter = 'date';
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return DateRenderer(params)
                                        };
                                    } else if (scope.sgColumns[i].cellEditor == "时分秒") {
                                        scope.sgColumns[i].cellEditor = DatetimeCellEditor;
                                        scope.sgColumns[i].filter = 'date';
                                    } else if (scope.sgColumns[i].cellEditor == "下拉框") {
                                        scope.sgColumns[i].cellEditor = SelectCellEditor;
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return selectRenderer(params)
                                        };
                                        scope.sgColumns[i].filter = 'set';
                                    } else if (scope.sgColumns[i].cellEditor == "多选下拉框") {
                                        scope.sgColumns[i].cellEditor = chooseSelectCellEditor;
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return chooseSelectRenderer(params)
                                        };
                                        scope.sgColumns[i].filter = 'set';
                                    } else if (scope.sgColumns[i].cellEditor == "弹出框") {
                                        scope.sgColumns[i].cellEditor = ButtonCellEditor;
                                        scope.sgColumns[i].filter = 'text';
                                        scope.sgColumns[i].filterParams = {
                                            defaultOption: 'Contains'
                                        }
                                    } else if (scope.sgColumns[i].cellEditor == "文本框") {
                                        scope.sgColumns[i].cellEditor = TextCellEditor;
                                        //scope.sgColumns[i].cellRenderer=function(params){return refreshRender(params)};;
                                        scope.sgColumns[i].filter = 'text';
                                        scope.sgColumns[i].filterParams = {};
                                        scope.sgColumns[i].filterParams.filterOptions = ['contains', 'notContains', 'startsWith', 'endsWith' /**,'equals', 'notEqual'*/];
                                        scope.sgColumns[i].filterParams.defaultoption = 'contains';
                                    } else if (scope.sgColumns[i].cellEditor == "整数框") {
                                        scope.sgColumns[i].filter = 'number';
                                        scope.sgColumns[i].cellStyle = {
                                            'text-align': 'right'
                                        };
                                        scope.sgColumns[i].cellEditor = NumericCellEditor;
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return NumberRenderer(params)
                                        };
                                        ;
                                    } else if (scope.sgColumns[i].cellEditor == "浮点框") {
                                        scope.sgColumns[i].cellStyle = {
                                            'text-align': 'right'
                                        };
                                        scope.sgColumns[i].cellEditor = FloatCellEditor;
                                        if (!scope.sgColumns[i].cellRenderer) {
                                            scope.sgColumns[i].cellRenderer = function (params) {
                                                return NumberRenderer(params)
                                            };
                                        }
                                        ;
                                        scope.sgColumns[i].filter = 'number';
                                    } else if (scope.sgColumns[i].cellEditor == "复选框") {
                                        scope.sgColumns[i].cellEditor = CheckboxCellEditor;
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return CheckboxRenderer(params)
                                        };
                                        scope.sgColumns[i].filter = 'set';
                                    } else if (scope.sgColumns[i].cellEditor == "树状结构") {
                                        scope.sgColumns[i].cellRenderer = 'group';
                                        scope.sgColumns[i].cellRendererParams = {};

                                        scope.sgColumns[i].cellRendererParams.innerRenderer = function (params) {
                                            return innerCellRenderer(params)
                                        };
                                        for (var j = 0; j < scope.sgColumns.length; j++) {
                                            scope.sgColumns[j].cellStyle = function (params) {
                                                if (!params.node.childrenAfterGroup) {
                                                    if (!params.node.parent) {
                                                        return {
                                                            fontStyle: 'normal'
                                                        };
                                                    } else {
                                                        return {
                                                            fontStyle: 'italic'
                                                        };
                                                    }

                                                } else {
                                                    return {
                                                        fontStyle: 'normal'
                                                    };
                                                }
                                            };
                                        }

                                    } else if (scope.sgColumns[i].cellRenderer == "编辑框渲染") {
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return buttonRenderer(params)
                                        };
                                        ;
                                    } else if (scope.sgColumns[i].cellRenderer == "链接渲染") {
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return aRenderer(params)
                                        };
                                        ;
                                    } else if (scope.sgColumns[i].cellRenderer == "保存框渲染") {
                                        scope.sgColumns[i].cellRenderer = function (params) {
                                            return saveRenderer(params)
                                        };
                                    }
                                }

                            }
                            // 全选
                            // if (scope.sgOptions.selectAll) {
                            //     scope.sgColumns[0].checkboxSelection = function () {
                            //         return function (params) {
                            //             return params.columnApi.getRowGroupColumns().length === 0
                            //         }
                            //     };
                            //     scope.sgColumns[0].headerCheckboxSelection = function (params) {
                            //         // we put checkbox on the name if we are not doing grouping
                            //         return params.columnApi.getRowGroupColumns().length === 0;
                            //     };
                            //     scope.sgColumns[0].headerCheckboxSelectionFilteredOnly = true;
                            //     /**scope.sgColumns[0].headerCellTemplate = function() {
                            //     var eCell = document.createElement('span');
                            //     eCell.innerHTML = '<div style="text-align: left;"><span id="myMenuButton" class="selectAll"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRkJCRDU1MTEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRkJCRDU1MDEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+riMaEQAAAL5JREFUeNqUks0JhDAQhSd7tgtLMDUIyTXF2IdNWIE3c0ruYg9LtgcPzvpEF8SfHR8MGR75hpcwRERmrjQXCyutDKUQAkuFu2AUpsyiJ1JK0UtycRgGMsbsPBFYVRVZaw/+7Zu895znOY/j+PPWT7oGp2lirTU3TbPz/4IAAGLALeic47Ztlx7RELHrusPAAwgoy7LlrOuay7I8TXIadYOLouC+7+XgBiP2lTbw0crFGAF9ANq1kS75G8xXgAEAiqu9OeWZ/voAAAAASUVORK5CYII=" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkU1Rjk1NDExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkU1Rjk1MzExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t+CXswAAAFBJREFUeNrsksENwDAIA023a9YGNqlItkixlAFIn1VOMv5wvACAOxOZWUwsB6Gqswp36QivJNhBRHDhI0f8j9jNrCy4O2twNMobT/7QeQUYAFaKU1yE2OfhAAAAAElFTkSuQmCC" style="display: inline;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjU4MzhGQjEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMjU4MzhGQTEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2Xml2QAAAGBJREFUeNpiYGBg8ATiZ0D8n0j8DKqH4dnhw4f/EwtAakF6GEGmAAEDKYCRkZGBiYFMQH+NLNjcjw2ghwMLIQWDx48Do/H5kSNHiNZw9OhREPUCRHiBNJOQyJ+A9AAEGACqkFldNkPUwwAAAABJRU5ErkJggg==" style="display: none;margin-top:3px"></span><span id="agHeaderCellLabel">' +
                            //         '      <span id="agText" ></span>' +
                            //         '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                            //         '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                            //         '      <span id="agNoSort"></span>' +
                            //         '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                            //         '    </span><div>'
                            //     var eMenuButton = eCell.querySelector('#myMenuButton');
                            //     eMenuButton.addEventListener('click', function() {
                            //         var eMenuButton = eCell.querySelector('#myMenuButton');
                            //         if (eMenuButton.children[0].attributes.style.nodeValue == "display: none;") {
                            //             scope.sgOptions.api.selectAll();
                            //             eMenuButton.children[0].attributes.style.nodeValue = "display: inline;"
                            //             eMenuButton.children[1].attributes.style.nodeValue = "display: none;"
                            //         } else {
                            //             scope.sgOptions.api.deselectAll();
                            //             eMenuButton.children[1].attributes.style.nodeValue = "display: inline;"
                            //             eMenuButton.children[0].attributes.style.nodeValue = "display: none;"
                            //         }
                            //
                            //     });
                            //     return eCell;
                            // }*/
                            // }

                            if (!scope.sgOptions.fixedGridHeight) {
                                if (element.height() < 250) element.height(250);
                            }

                            var grid;
                            var auto_height = attrs['autoheight'] || 'none';
                            if (auto_height == "auto") {
                                var old_height = element[0].offsetHeight;

                                function getTop(e) {
                                    var offset = e.offsetTop;
                                    if (e.offsetParent != null) offset += getTop(e.offsetParent);
                                    return offset;
                                }

                                var offtop = getTop(element[0]);
                                var w_height = document.body.clientHeight - 100; //浏览器可见高度
                                var new_height = old_height > (w_height - offtop) ? old_height : w_height - offtop;

                                element.css({
                                    'height': new_height
                                });
                            }

                            var type = attrs['type'] || 'grid';
                            scope.$watch(scope.sgData, function () {
                                draw_grid();
                            }, true);

                            function draw_grid() {
                                if (type == "grid") {
                                    /**ag-fresh  ag-dark ag-blue  ag-material ag-bootstrap*/
                                    element[0].className = "ag-blue";
                                    //scope.sgOptions.rowSelection = "multiple";
                                    scope.sgOptions.enableRangeSelection = true;
                                    scope.sgOptions.suppressNoRowsOverlay = true; //禁用【空表】标识
                                    scope.sgOptions.suppressLoadingOverlay = true; //禁用【加载中】标识
                                    if (angular.isUndefined(scope.sgOptions.singleClickEdit))
                                        scope.sgOptions.singleClickEdit = false;
                                    if (!scope.sgOptions.getContextMenuItems) {
                                        scope.sgOptions.getContextMenuItems = function (params) {
                                            return getContextMenuItems(params)
                                        };
                                    }

                                    //scope.sgOptions.getContextMenuItems=function(params){return doSelectRow(params)};
                                    scope.sgOptions.localeText = {

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
                                        selectAll: '选中所有',
                                        searchOoo: '请输入搜索内容...',
                                        blanks: '空白',

                                        // for number filter and text filter
                                        filterOoo: 'daFilter...',
                                        applyFilter: 'daApplyFilter...',

                                        // for number filter
                                        equals: '等于',
                                        lessThan: '小于',
                                        greaterThan: '大于',

                                        // for text filter
                                        contains: '包含',
                                        NotEquals: '不等于',
                                        startsWith: '头匹配',
                                        endsWith: '尾匹配',

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
                                        csvExport: 'CSV Export导出',
                                        excelExport: 'Excel导出',

                                        // enterprise menu pinning
                                        pinLeft: '列左固定',
                                        pinRight: '列右固定',
                                        noPin: '不固定',

                                        // enterprise menu aggregation and status panel
                                        sum: '求和',
                                        min: '最小值',
                                        max: '最大值',
                                        first: '第一个',
                                        last: '最后一个',
                                        none: '空',
                                        count: '次数',
                                        average: '平均',

                                        // standard menu
                                        copy: '复制',
                                        copyWithHeaders: '复制加上列名',
                                        ctrlC: 'ctrl n C',
                                        paste: '粘贴',
                                        ctrlV: 'ctrl n V'
                                    }

                                    new agGrid.Grid(element[0], scope.sgOptions);

                                    //设置必填项属性样式
                                    for (var i = 0; i < scope.sgColumns.length; i++) {
                                        if (scope.sgColumns[i].editable) {
                                            if (scope.sgColumns[i].cellClass) {
                                                scope.sgColumns[i].cellClass += 'good-score';
                                            } else {
                                                scope.sgColumns[i].cellClass = 'good-score';
                                            }

                                        }
                                        if (scope.sgColumns[i].non_empty) {
                                            scope.sgColumns[i].headerComponentParams = {};
                                            scope.sgColumns[i].headerCellRenderer = function (params) {
                                                var eHeader = document.createElement('span');
                                                var eTitle = document.createTextNode(params.colDef.headerName);
                                                eHeader.className = " not-null"
                                                eHeader.appendChild(eTitle);
                                                //eHeader.style.color = 'red';
                                                return eHeader;
                                            }
                                        }
                                        if (scope.sgOptions.getRowHeight) {
                                            scope.sgColumns[i].cellStyle = {
                                                'white-space': 'normal',
                                                'display': '-webkit-flex',
                                                'align-items': 'center'
                                            }
                                            if (scope.sgColumns[i].children) {
                                                for (var j = 0; j < scope.sgColumns[i].children.length; j++) {
                                                    scope.sgColumns[i].children[j].cellStyle = {
                                                        'white-space': 'normal',
                                                        'display': '-webkit-flex',
                                                        'align-items': 'center'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    scope.sgOptions.api.setColumnDefs(scope.sgColumns);
                                    var defaultcoldef = $.extend(true, {}, scope.sgColumns);

                                    scope.sgOptions.defaultColumns = defaultcoldef;
                                    //scope.sgOptions.api.showToolPanel(false);
                                    scope.sgOptions.api.onGroupExpandedOrCollapsed();
                                    if (scope.sgData == undefined) {
                                        scope.sgData = [];
                                    }
                                    scope.sgOptions.api.setRowData([]);
                                    scope.sgOptions.api.hideOverlay();
                                    //scope.sgOptions.columnApi.resetColumnState();

                                    /**var _cellclick = function(e){
                        console.log("_cellcliek");console.log(e);
                   }

                                     scope.sgOptions.api.AddEventListener('cellClicked', _cellclick);//api.startEditingCell()*/

                                    //单击事件
                                    if (scope.sgOptions.rowClicked) {
                                        scope.sgOptions.api.addEventListener('rowClicked', scope.sgOptions.rowClicked);
                                    }
                                    if (scope.sgOptions.cellClicked) {
                                        scope.sgOptions.api.addEventListener('cellClicked', scope.sgOptions.cellClicked);
                                    }
                                    //双击事件
                                    if (scope.sgOptions.rowDoubleClicked) {
                                        scope.sgOptions.api.addEventListener('rowDoubleClicked', scope.sgOptions.rowDoubleClicked);
                                    }
                                    //光标关注事件
                                    if (scope.sgOptions.cellFocused) {
                                        scope.sgOptions.api.addEventListener('cellFocused', scope.sgOptions.cellFocused);
                                    }
                                    //网格模块扰动事件
                                    if (scope.sgOptions.cellValueChanged) {
                                        scope.sgOptions.api.addEventListener('cellValueChanged', scope.sgOptions.cellValueChanged);
                                    }
                                    //停止编辑事件
                                    if (scope.sgOptions.cellEditingStopped) {
                                        scope.sgOptions.api.addEventListener('cellEditingStopped', scope.sgOptions.cellEditingStopped);
                                    }

                                    /**
                                     * 自定义API
                                     */
                                    scope.sgOptions.hcApi = {
                                        /**
                                         * 设置行数据
                                         * @param {{}[]} rowData
                                         */
                                        setRowData: function (rowData) {
                                            var seqKey = scope.sgColumns[0].field;

                                            rowData.forEach(function (e, i) {
                                                e[seqKey] = i + 1;
                                            });

                                            scope.sgOptions.api.setRowData(rowData);
                                            scope.sgOptions.columnApi.autoSizeAllColumns();
                                        },

                                        /**
                                         * 设置焦点单元格
                                         * @param rowIndex
                                         * @param colKey
                                         */
                                        setFocusedCell: function (rowIndex, colKey) {
                                            scope
                                                .sgOptions
                                                .api
                                                .setFocusedCell(rowIndex, colKey);

                                            scope
                                                .sgOptions
                                                .api
                                                .rangeController
                                                .setRangeToCell(scope
                                                    .sgOptions
                                                    .api
                                                    .getFocusedCell());
                                        }
                                    };
                                }
                            }
                            console.log('agGridview link end');
                        }

                    ]
                }
            }
        ];

        //使用Api注册指令
        //需传入require模块和指令定义
        return directiveApi.directive({
            module: module,
            directive: directive
        });
    }
);