/*********************************************
 * 单元格编辑器
 */
function CellEditor(grid) {
    //this.rowIndex = -1;
    //this.colIndex = -1;
    this.grid = grid;
    this.cell = null;
    this.jQCell = null;
    this.oldValue = null;
    this.newValue = null;
    this.oldText = null;
    this.newText = null;
    this.shtCol = null;
    this.rowNo = 0;
    this.ctrlEditing = null;
}
/**
 * 开始编辑事件
 * @param cell  要编辑的单元格
 */
CellEditor.prototype.startEdit = function(cell) {

    this.cell = cell;
    this.jQCell = $(cell);
    this.shtCol = this.jQCell.data('cpccol');
    var shtTable = this.jQCell.data('cpctable');

    this.rowNo = this.jQCell.attr('cpcrow');
    this.oldValue = this.newValue = this.jQCell.attr('cpcvalue');
    this.oldText = this.newText = this.jQCell.attr('cpctext');
    this.ctrlEditing = this.getEditCtrl();
    //  this.cell.innerHTML = this.getEditCtrl();
    //  this.ctrlEditing = this.jQCell.children('.ctrlediting');
    this.jQCell.empty().append(this.ctrlEditing);
    if (this.cell.firstChild && !this.cell.firstChild.disabled){
        this.cell.firstChild.focus();
    }

    var that = this;
    //选择按钮事件
    this.ctrlEditing.find("#btn_select").bind("click",function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (that.shtCol.colrtable){  //有关联表
            var colRTable = that.shtCol.colrtable.toLowerCase();
            if (colRTable == 'cpcdoc') {
                g_common_searching = true;
             //   g_docSelect = true;
            //    onWSDocSearch2(that.shtCol.colstyle);
/*                $('#div_doc_menu').menu('show',{
                    left:event.pageX,
                    top:event.pageY
                });*/
                that.grid.onDocUpload(that.shtCol.colstyle == 7);
            } else if (colRTable == 'cpcorg') {
                g_common_searching = true;
             //   g_wstype='org';
              //  onWSOrgSearch(3);
                that.grid.onSelectOrg(true);
            } else if (colRTable == 'cpcuser') {
                g_common_searching = true;
            //    g_wstype='user';
            //    onWSOrgSearch(3);
                that.grid.onSelectUser(false);
            } else {
                var sqlWhere = '';
                var colRCondition = that.shtCol.colrcondition;
                if (colRCondition) {
                    try {
                        sqlWhere = replaceText(colRCondition, that.rowNo);
                    } catch (e){
                        //TODO 提示错误信息
                      //  alert(e);
                        $.cpc.showAlert(e);
                        //   grid.stopEditing();
                        return;
                    }
                }
                g_common_searching = true;
                that.grid.onCommonSearch(colRTable,that.shtCol.colrcol,that.shtCol.colrdispcol,sqlWhere);
             //   onCommonSearch(that.shtCol.colrcol,that.shtCol.colrdispcol,colRTable,sqlWhere,that.cell,that.shtCol.dsid);
            }
        }
    });
    //清除按钮事件
    this.ctrlEditing.find("#btn_clear").bind("click",function (event) {
        event.preventDefault();
        event.stopPropagation();
        that.setValueNew('','');
    });

    if (shtTable.fixlen == 2) {
        this.ctrlEditing.bind('contextmenu',function (e) {
            e.preventDefault();
            $('#div_table_menu').menu('show',{
                left:e.pageX,
                top:e.pageY,
                onClick: function (item) {
                    console.log(item);
                    var rowNo = that.jQCell.attr('cpcrow');
                    var shtTable = that.jQCell.data('cpctable');
                    switch (item.id) {
                        case 'insert-one-row':
                            console.log('插入行');
                            shtTable.appendRow(rowNo,1);
                            shtTable.rowcount+= 1;
                            break;
                        case 'insert-two-row':
                            console.log('插入行(前面)');
                            shtTable.appendRow(rowNo,2);
                            shtTable.rowcount+= 2;
                            break;
                        case 'insert-custom-row':
                            console.log('插入行(自定义)');
                            $.messager.prompt('插入自定义行','输入自定义行数',function (r) {
                                if (r) {
                                    if ((/^(\+|-)?\d+$/.test(r)) && r > 0) {
                                        shtTable.appendRow(rowNo, r);
                                        shtTable.rowcount+= r;
                                    } else {
                                        $.cpc.showAlert('输入的行数无效');
                                    }
                                }
                            });
                            break;
                        case 'delete':
                            console.log('删除行');
                            shtTable.deleteRow(rowNo);
                            shtTable.rowcount-= 1;
                            break;
                        default:
                            break;
                    }
                }
            });
        })
    }
    //  return;
    /*    if (this.shtCol.colrtable){  //有关联表
     var colRTable = this.shtCol.colrtable.toLowerCase();
     if (colRTable == 'cpcdoc') {
     g_common_searching = true;
     g_docSelect = true;
     onWSDocSearch2(this.shtCol.colstyle);
     } else if (colRTable == 'cpcorg') {
     g_common_searching = true;
     g_wstype='org';
     onWSOrgSearch(3);
     } else if (colRTable == 'cpcuser') {
     g_common_searching = true;
     g_wstype='user';
     onWSOrgSearch(3);
     } else {
     var sqlWhere = '';
     var colRCondition = this.shtCol.colrcondition;
     if (colRCondition) {
     try {
     sqlWhere = replaceText(colRCondition, this.rowNo);
     } catch (e){
     alert(e);
     grid.stopEditing();
     return;
     }
     }
     g_common_searching = true;
     onCommonSearch(this.shtCol.colrcol,this.shtCol.colrdispcol,colRTable,sqlWhere,this.cell,this.shtCol.dsid);
     }
     }*/
};

/**
 * 单元格编辑完成事件
 */
CellEditor.prototype.completeEdit = function () {

    //TODO 获取相应的value&&text
    //日期时间&日期
    if (3 == this.shtCol.coltype || 4 == this.shtCol.coltype) {
        this.newText = this.newValue = this.ctrlEditing.val();
    } else if (1 == this.shtCol.colstyle) {
        // 1.下拉框不能输入
        var selected = this.ctrlEditing.find('option:selected');
        this.newValue = selected.val();
        this.newText = selected.text();
    } else if (2 == this.shtCol.colstyle) {
        // 2.下拉框能输入
        var selected = this.ctrlEditing.find('.select-input');
        this.newValue = selected.attr('cpcvalue')||selected.val();
        this.newText = selected.val();
    } else if (3 == this.shtCol.colstyle || 7 == this.shtCol.colstyle) {
        //3.单选不可输入&7多选不能输入
        //TODO 这里不需要从控件中获取
    } else if (4 == this.shtCol.colstyle || 6 == this.shtCol.colstyle) {
        //4.单选可输入&6.多选可输入
        //统一取文本值
        this.newValue = this.newText;
    } else if (8 == this.shtCol.colstyle || 9 == this.shtCol.colstyle) {
        // //8.多选下拉框(能输入)&9.多选下拉框(不可输入)
        var selected = this.ctrlEditing.find('.fe-multi-input');
        this.newValue = selected.val();
        this.newText = selected.val();
    } else if (5 == this.shtCol.colstyle) {
        //5.真假
        //TODO 前面需要确保样式值定义正确
        var items = this.shtCol.colstylenote.split('|');
        this.newText = this.newValue = this.ctrlEditing.attr('checked')? items[0]: items[1];
    } else {
        this.newText = this.newValue = this.ctrlEditing.val();
    }


    /**

     if (!this.cell.firstChild){
        this.newValue = "";
    } else {
        this.newValue = this.cell.firstChild.value;
    }

     if (this.newValue && this.newValue.toLowerCase().indexOf('<a') >-1){
        this.newValue = this.cell.getAttribute("cpcvalue");
    }

     if (this.shtCol.colstyle == 1) { //1.下拉(不能输入)
        this.newValue = this.jQCell.children('select').val();
        this.newText = this.jQCell.find('option:selected').text();
    } else {
        this.newText = this.newValue;
    }

     if (g_editing_value){
        this.newValue =g_editing_value;
        this.newText = g_editing_text;

        if (!this.shtCol.colrvalue){
            this.shtCol.colrvalue = "";
        }

        if (!this.shtCol.colstylenote){
            this.shtCol.colstylenote = "";
        }

        var tmpArray = this.shtCol.colrvalue.split(DATA_SEPARATOR);
        tmpArray[this.pos] = g_editing_text;

        this.shtCol.colrvalue=tmpArray.join(DATA_SEPARATOR);

        var nitems = [];
        var vitems =  [];

        tmpArray = this.shtCol.colstylenote.split("=");
        if (tmpArray[1]){
            nitems = tmpArray[1].split(DATA_SEPARATOR);
            vitems = tmpArray[0].split(DATA_SEPARATOR);
        }

        nitems[this.pos] =g_editing_text;
        vitems[this.pos] =g_editing_value;
        this.shtCol.colstylenote = vitems.join(DATA_SEPARATOR)+"="+nitems.join(DATA_SEPARATOR);
        g_editing_value= null;
        g_editing_text=null;
    }

     else if (this.shtCol.colstyle == 3 || this.shtCol.colstyle ==4){
        this.newValue = this.cell.getAttribute("cpcvalue");
    }
     */

    //   this.cell.pos = this.pos;
    // col.setCellValue(this.cell, this.newValue,this.cell.offsetHeight-(IsMSIE?3:1));
//    if (this.isChanged()) {
//        this.shtCol.setCellValueNew(this.cell, this.newValue, this.newText, true);
//    } else {
//        this.jQCell.html(this.oldText);
    //   }
    this.shtCol.setCellValueNew(this.cell, this.newValue, this.newText, this.isChanged());
};

/**
 * 判断网格内容是否改变
 * @returns {boolean}
 */
CellEditor.prototype.isChanged = function () {
    return (this.newValue != this.oldValue);
};

/**
 * 初始化下拉单选可输入
 * @param obj
 * @param oldText
 */
function initInputSelect(obj,oldText) {
    obj.wrap('<div id="" class="select-input-div"></div>');
    obj.closest('.select-input-div').append('<input class="select-input" style="width:'+(obj.width()-22)+'px;height:'+(obj.height()-1)+'px;">');
    console.log(oldText);
    obj.siblings('.select-input').val(obj.find("option:selected").text()||oldText).attr('cpcvalue',obj.val());
    obj.val('');
    obj.change(function(){
        var obj=$(this);
        obj.siblings('.select-input').attr('cpcvalue',obj.val());
        obj.siblings('.select-input').val(obj.find("option:selected").text());
        obj.val('');
    });
    obj.siblings('.select-input').change(function(){
        $(this).attr('cpcvalue','');
    });
    return obj.closest('.select-input-div');
}

/** 多选控件 */
/** 初始化控件 */
function initMultiSelect(obj) {
    $(obj).css('display','none')
    var newDiv=$('<div id="" class="fe-multi-select-div"></div>');

    newDiv.append(obj);
    newDiv.css({'width':$(obj).css('width'),'height':$(obj).height()+'px'});
    var fInput = $('<textarea class="fe-multi-input" style="width:'+(obj.width()-28)+'px;height:'+obj.height()+'px;"></textarea>');
    fInput.attr('readonly',obj.attr('readonly'));
    fInput.focus(function(){
        var fPanel = $(this).siblings('div.fe-multi-panel');
        if (fPanel.attr('isshow') == 2){
            fPanel.attr('isshow','1');
            fPanel.hide();
        }
    })
        .change(function(){
            var strs = $(this).val().split(';');
            var fPanel = $(this).siblings('div.fe-multi-panel');
            fPanel.find('input').prop('checked',false);
            for (var i=0;i<strs.length;i++){
                if (strs[i]) {
                    var fopcb = fPanel.find('.fe-multi-option>span:contains("'+strs[i]+'")').siblings('input');
                    fopcb.prop('checked',true);
                }
            }
        });
    newDiv.append(fInput);
    var img = $('<img src="/websht/css/img/select_ico.png" class="fe-multi-input-ico">')
    img.click(function(){
        var fInput = $(this).siblings('.fe-multi-input');
        var fPanel = $(this).siblings('div.fe-multi-panel');
        if (fPanel.attr('isshow') == 2){
            fPanel.attr('isshow','1');
            fPanel.hide();
        }
        else {
            fPanel.css({'top':'20px','width':(fInput.width()+6)+'px'});
            fPanel.attr('isshow','2');
            fPanel.show();
        }
    });
    newDiv.append(img);
    var box = '<div class="fe-multi-panel" isshow="1" style="display:none;width:50px;"></div>';
    newDiv.append($(box));
    initMultiPanel(fInput);
    return newDiv;
}
/** 初始化下拉列表 */
function initMultiPanel(obj) {
    var fSelect= $(obj).siblings('select.fe-multi-select');;
    var options = fSelect.find('option');
    var fPanel = fSelect.siblings('div.fe-multi-panel');
    fPanel.html('');
    var fInput = $(obj);
    fInput.val('');
    for (var i=0;i<options.length;i++) {
        var op = $(options[i]);
        var fop = $('<div class="fe-multi-option"></div>');
        if (op.is(':selected')) {
            fop.append($('<input type="checkbox" value="'+op.val()+'" checked><span>'+op.text()+'</span>'));
            fInput.val(fInput.val() ? (fInput.val()+';'+op.text()) : op.text());
        } else {
            fop.append($('<input type="checkbox" value="'+op.val()+'"><span>'+op.text()+'</span>'));
        }
        fop.on('click',function(){
            $(this).children('input').prop('checked',!($(this).children('input').prop('checked')));

            refreshMultiInput($(this));

        })
        .on('click','input',function(e){

            refreshMultiInput($(this).closest('.fe-multi-option'));
            e.stopPropagation();
        })
        .on('mouseover',function(){
            $(this).css('background-color','skyblue');
        })
        .on('mouseout',function(){
            $(this).css('background-color','transparent');
        });
        fPanel.append(fop);
    }
}
/** 根据选项刷新输入框内容 */
function refreshMultiInput(obj) {
    var cb = $(obj).children('input');
    var sp = $(obj).children('span');
    var fInput = $(obj).closest('.fe-multi-panel').siblings('.fe-multi-input');
    if (sp.text()) {
        if (cb.prop('checked')) {
            fInput.val(fInput.val() ? (fInput.val()+';'+sp.text()) : sp.text());
        }
        else {
            var stext = ';'+fInput.val()+';';
            stext = stext.replace(';'+sp.text()+';',';');
            if (stext != ';')
                stext=stext.substring(1,stext.length-1);
            else stext = '';
            fInput.val(stext);
        }
    }
};
/** 重新调整控件宽高 */
function f_resizeMultiSelect(obj) {
    var objs = $(obj).find('.fe-multi-input');
    for (var i=0;i<objs.length;i++){
        var ctl = $(objs[i]);
        ctl.css({'width':(ctl.siblings('.fe-multi-select').width()-26)+'px','height':(ctl.siblings('.fe-multi-select').height())+'px'});
    }
}

/**
 * 获取编辑的控件
 * @return {*|jQuery|HTMLElement}
 */
CellEditor.prototype.getEditCtrl = function () {
    var width = this.jQCell.width();
    var height = this.jQCell.height();
    var isInput = this.jQCell.children("input");
    if (isInput && isInput){
    	height = isInput.height();
    }
    
     var isTextArea = this.jQCell.children("textarea");
    if (isTextArea && isTextArea){
    	height = isTextArea.height();
    }
    
    var value = this.oldValue;
    var text = this.shtCol.getHtmlText(this.oldValue,this.oldText,false,true,height,this.jQCell.hasClass("cellWrap"));
    //TODO 高度的问题
    var browser = $.support;
    var str;
    var editCtrl;
    //3.日期时间&4.日期
    // if (3 == this.shtCol.coltype || 4 == this.shtCol.coltype) {
    //     // 日期时间
    //     str = "<input type='text' id='c_";
    //     str += this.colid;
    //     str += "' value='";
    //     str += value;
    //     str += "' class='calendar ctrlediting' style='height:" + height + ";'";
    //     str += " onclick='CPCShowCalendar(event, this, " + (3 == this.shtCol.coltype) + ")'";
    //     str += " onblur='CPCCheckCalendar(this);'";
    //     str += "/>";
    //     editCtrl = $(str);
    // }
    if (3 == this.shtCol.coltype) {
        str = '<input class="Wdate ctrlediting" type="text" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>';
        editCtrl = $(str).val(value);
    }
    else if (4 == this.shtCol.coltype) {
        str = '<input class="Wdate ctrlediting" type="text" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>';
        editCtrl = $(str).val(value);
    }
    else if (1 == this.shtCol.colstyle) {
        // 1.下拉框不能输入
        str = "<select id='c_";
        str += this.colid;
        str += "'";
        str += " value='";
        str += value;
        str += "' class='ctrlediting' style='height:" + height + ";width:" + width + ";'";
        //    str += " onblur='grid.stopEditing(this);'";
        str += ">";
        var items = this.shtCol.colstylenote.split('|');
        var idx = 0;
        //加个空行
        //str+="<option value=''/>"
        for (var i = 0; i < items.length; i++) {
            //加个空行
            if (i == 0) str += "<option value=''></option>";
            idx = items[i].indexOf('=');
            if (idx > 0) {
                str += "<option value='";
                str += items[i].substring(0, idx);
                if (value == items[i].substring(0, idx))
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i].substring(idx + 1);
                str += "</option>";
            } else {
                str += "<option value='";
                str += items[i];
                if (value == items[i])
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i];
                str += "</option>";
            }
        }
        str += "</select>";
        editCtrl = $(str).height(height);
    }
    else if (2 == this.shtCol.colstyle) {
        //2.下拉框能输入
        str = "<select id='c_";
        str += this.colid;
        str += "'";
        str += " value='";
        str += value;
        str += "' class='ctrlediting' style='height:" + height + "px;width:" + width + "px;'";
        str += ">";
        var items = this.shtCol.colstylenote.split('|');
        var idx = 0;
        for (var i = 0; i < items.length; i++) {
            //加个空行
            if (i == 0) str += "<option value=''></option>";
            idx = items[i].indexOf('=');
            if (idx > 0) {
                str += "<option value='";
                str += items[i].substring(0, idx);
                if (value == items[i].substring(0, idx))
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i].substring(idx + 1);
                str += "</option>";
            } else {
                str += "<option value='";
                str += items[i];
                if (value == items[i])
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i];
                str += "</option>";
            }
        }
        str += "</select>";
        editCtrl = $(str);
        editCtrl = initInputSelect(editCtrl,text);
        editCtrl.height(height);
    }
    else if (3 == this.shtCol.colstyle || 4 == this.shtCol.colstyle
        || 6 == this.shtCol.colstyle || 7 == this.shtCol.colstyle) {
        //3.选择(不能输入)&4.选择(可输入)&6.多选可输入&7.多选不能输入
        //3 Select 4 Ellipsis
        str = '<div style="height: 100%" '
            + 'class="cpc-select ctrlediting">'
            + '<span class="cpc-content">' + text  + '</span>'
            + '<span class="cpc-button">'
            + '<button id="btn_select">...</button>'
            + '<button id="btn_clear">&times;</button>'
            + '</span></div>';
        editCtrl = $(str);
        editCtrl.height(height);
    }
    else if (8 == this.shtCol.colstyle || 9 == this.shtCol.colstyle) {
        //8.多选下拉框(能输入)&9.多选下拉框(不可输入)
        str = "<select id='c_";
        str += this.colid;
        str += "'";
        str += " value='";
        str += value;
        str += "' class='ctrlediting fe-multi-select'"
        if (9 == this.shtCol.colstyle) str +=" readonly";
        str += " multiple style='height:" + height + "px;width:" + width + "px;'";
        str += ">";
        var items = this.shtCol.colstylenote.split('|');
        var idx = 0;
        for (var i = 0; i < items.length; i++) {
            idx = items[i].indexOf('=');
            if (idx > 0) {
                str += "<option value='";
                str += items[i].substring(0, idx);
                if (value == items[i].substring(0, idx))
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i].substring(idx + 1);
                str += "</option>";
            } else {
                str += "<option value='";
                str += items[i];
                if (value == items[i])
                    str += "' selected>";
                else
                    str += "'>";
                str += items[i];
                str += "</option>";
            }
        }
        str += "</select>";
        editCtrl = $(str);
        editCtrl = initMultiSelect(editCtrl);
        editCtrl.find('.fe-multi-input').val(text).change();
        editCtrl.height(height);
    }
    else if (this.shtCol.colstyle == 5) {
        //5.真假
        str = '<input type="checkbox"';
        var items = this.shtCol.colstylenote.split('|');
        if (items[0] == value) {
            str += ' checked="checked"';
        }
        str += "/>";
        editCtrl = $(str);
    }
    else if (!height || height < 40) {
        // 单行文本框
        str = "<input type='text' id='c_";
        str += this.shtCol.colid;
        str += "' value='";
        str += value;
        str += "' class='ctrlediting'";
        //    str += " onblur='grid.stopEditing(this);'";
        str += " onkeydown='return onKeyDown(event," + this.coltype + ");'";
        str += "/>";
        editCtrl = $(str);
        if (browser.mozilla) {
            editCtrl.height(height -2);
        } else {
            editCtrl.height(height);
        }
    }
    else {
        // 多行文本框
        str = '<textarea class="ctrlediting"';
        //    str += " onblur='grid.stopEditing();'";
        str += ">";
        str += value;
        str += "</textarea>";
        editCtrl = $(str);
     
            editCtrl.height(height);
         
    }
    return editCtrl;
};

/**
 * 为编辑控件设置新值
 * @param value
 * @param text
 */
CellEditor.prototype.setValueNew = function (value, text) {
    this.newValue = value;
    this.newText = text;
    var htmlText = this.shtCol.getHtmlText(value, text);

    //TODO 给编辑控件赋值
    //选择
    if (3 == this.shtCol.colstyle || 4 == this.shtCol.colstyle
        || 6 == this.shtCol.colstyle || 7 == this.shtCol.colstyle) {
        //3.选择(不能输入)&4.选择(可输入)&6.多选可输入&7.多选不能输入
        //3 Select 4 Ellipsis
        //TODO 文件类型的需要特殊处理
        this.ctrlEditing.children('.cpc-content').html(htmlText);
    } else if (this.shtCol.colstyle == 5) {//5.真假
        //TODO 选择
    } else {
        this.ctrlEditing.val(value);
    }
};

/*********************************************
 * 表单网格控件
 */
function CPCShtGrid(id) {
    this.tableId = id;
    this.activeEditor = null; // 当前编辑器
    this.activeCell = null; //当前编辑单元格
}

/**
 * 初始化表单控件
 */
CPCShtGrid.prototype.initGrid = function () {
    console.log('初始化shtGrid');
    var that = this;
    //获取焦点，触发开始编辑事件
    $('#' + this.tableId).delegate("td.cpcvalue", "click", function(event){
        console.log('点击单元格事件');
        that.startEditing(this);
        //阻止事件冒泡
        event.stopPropagation();
    });

    //全局点击事件
    $('#sht-wrapper').click(function (e) {
        that.stopEditing();
    });
};

// Starts editing the specified for the specified row/column
CPCShtGrid.prototype.startEditing = function(cell) {

    if(this.activeEditor && this.activeEditor.cell == cell) return;
    this.stopEditing();
    this.activeCell = cell;
    var shtCol = $(cell).data('cpccol');
    //判断能否编辑
    if (!shtCol.canModify()) return;
    this.activeEditor = new CellEditor(this);
    this.activeEditor.startEdit(cell);
};

// Stops any active editing
CPCShtGrid.prototype.stopEditing = function() {
    //console.trace('结束编辑');
    if (g_noEditing){
        return ;
    }
    // return;
    if (this.activeEditor) {
        this.activeEditor.completeEdit();
        this.activeEditor=null;
    }

};

/**
 * 获取当前编辑器
 * @return {null|CellEditor}
 */
CPCShtGrid.prototype.getCellEditor = function () {
    return this.activeEditor;
};

/**
 * 定义一些编辑器
 *
 * @type {{text: {}, textarea: {}, datebox: {}, datetimebox: {}, combobox: {}}}
 */
/**
 CPCShtGrid.prototype.editors = {
    //文本
    text: {
        init:function (container) {

        },
        getValue: function () {

        },
        getText:function () {

        },
        setValue:function (value,text) {

        }
    },
    //多行文本
    textarea: {

    },
    //日期
    datebox: {

    },
    //日期时间
    datetimebox: {

    },
    //下拉
    combobox: {

    }

};
 */

CPCShtGrid.prototype.onCommonSearch = function (tableName,colIdName,colDescName,sqlWhere) {
    var that = this;
    $('#div_common_search').dialog({
        title: '通用搜索',
        width: 330,
        height: 350,
        cache: false,
        collapsible:false,
        href: '/websht/dgCommonSearch.html',
        queryParams: { tablename: tableName,colidname:colIdName,coldescname:colDescName,sqlwhere:sqlWhere},
        modal: true,
        buttons:[{
            id:'common-search-btn-ok',
            text:'确定',
            iconCls: 'icon-ok',
            handler:function(){
                var selected= $('#common-search-grid').datagrid('getSelected');
                console.log('确定了');
                if (selected) {
                    that.activeEditor.setValueNew(selected.objid,selected.objdesc);
                }
                $('#div_common_search').dialog('close');
            }
        },{
            text:'取消',
            iconCls: 'icon-no',
            handler:function(){
                $('#div_common_search').dialog('close');
            }
        }]
    });
};

/**
 * 选择机构
 * @param isOrg 是否选择机构
 */
CPCShtGrid.prototype.onSelectOrg = function (isOrg) {
    var that = this;
    $('#div_user_search').dialog({
        title: '机构管理',
        width: 330,
        height: 350,
        top: 120,
        cache: false,
        collapsible:false,
        href: '/websht/dgUserSearch.html',
        queryParams:{isorg:isOrg},
        modal: true,
        buttons:[{
            id:'user-search-btn-ok',
            text:'确定',
            iconCls: 'icon-ok',
            handler:function(){
                var selected= $('#user-search-tree').tree('getSelected');
                console.log(selected);
                if (selected) {
                    var value,text;
                    if (isOrg && selected.orgid) {
                        value = selected.orgid;
                        text = selected.orgname;
                    } else if (selected.userid) {
                        value = selected.userid;
                        text = selected.username;
                    }
                    if (value) {
                        that.activeEditor.setValueNew(value, text);
                    }
                }
                $('#div_user_search').dialog('close');
            }
        },{
            text:'取消',
            iconCls: 'icon-no',
            handler:function(){
                $('#div_user_search').dialog('close');
            }
        }]
    });
};

/**
 * 选择用户
 * @param isOrg 是否选择机构
 */
CPCShtGrid.prototype.onSelectUser = function (isOrg) {
    var that = this;
    $('#select_user').dialog({
        title: '选择用户',
        width: 330,
        height: 350,
        top: 120,
        resizable: true,
        maximizable: true,
        closed:false,
        cache: false,
        collapsible:false,
        href: '/wf/selectuser.html',
        modal: true,
        queryParams: {isNotMulti: true},
        buttons:[{
            text:'确定',
            iconCls: 'icon-ok',
            handler:function(){
                var selectedUser=$('#selected').data('user');
                var value,text;
                value = selectedUser[0].userid;
                text = selectedUser[0].username;
                if (value) {
                    that.activeEditor.setValueNew(value, text);
                }

                $('#select_user').dialog('close');
            }
        },{
            text:'取消',
            iconCls: 'icon-no',
            handler:function(){
                $('#select_user').dialog('close');
            }
        }],
        onLoad: function () {
            var tagBox = $('#selected');
            tagBox.data('user',[]);
        }
    });
};

/**
 * 上传文件
 * @param multiFile 多文件上传
 */
CPCShtGrid.prototype.onDocUpload= function (multiFile) {
    var that = this;
    var docNum = multiFile? 5:1;

    $('#div_doc_upload').dialog({
        title: '上传文档',
        width: 330,
        height: 350,
        top: 120,
        cache: false,
        collapsible:false,
        href: '/websht/dgDocUpload.html',
        queryParams:{docnum:docNum},
        modal: true,
        buttons:[{
            id:'doc-upload-btn-ok',
            text:'确定',
            iconCls: 'icon-ok',
            handler:function(){
                $('#doc-upload-form').form({
                        onSubmit: function(param) {
                            console.log(param);
                            var validated = $(this).form('enableValidation').form('validate');
                            if (validated) {
                                $.cpc.progressLoad('文件正在上传');
                            }
                            return validated;
                        },
                        success: function(data){
                            $.cpc.progressClose();
                            var response = eval("(" + data + ")");
                            if (response.success) {
                                data = response.data;
                                var value,text,docIds=[],docNames=[];
                                for (var i=0;i<data.length;i++) {
                                    docIds[i] = data[i].docid;
                                    docNames[i] = data[i].docname + "=download/downloadfile.do?iswb=true&filecode=" + data[i].downloadcode;
                                }
                                value = docIds.join(';');
                                text = docNames.join(';');
                                if (value) {
                                    that.activeEditor.setValueNew(value, text);
                                }
                                $('#div_doc_upload').dialog('close');
                            } else {
                                $.cpc.showAlert('文件上传失败!');
                            }
                        }

                }).form('submit');
            }
        },{
            text:'取消',
            iconCls: 'icon-no',
            handler:function(){
                $('#div_doc_upload').dialog('close');
            }
        }]
    });

};

