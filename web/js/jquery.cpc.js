/**
 * Created by LIN on 2017/1/19.
 * 业务对象基类以及JQuery扩展
 */
function CPCObject() {
}

//这里的一些字段目前可能没有用到。
CPCObject.prototype.optionDef = {
    dd: this.constructor,
    objClass:'',
    objType:0,
    objName:'CPC业务对象',
    objRelations:{}
};

/**
 * 定义对象原型
 * @param option    配置选项
 * @param constructor   构造器
 * @return {CPCObject}
 */
CPCObject.define = function (option, constructor) {
    var proto = new CPCObject();
    proto.option = jQuery.extend({}, proto.optionDef, option || {});
    if (constructor) {
        proto.constructor = constructor;
    }
    return proto;
};

/**
 * 对象反序列化
 * @param objectData
 */
CPCObject.prototype.parseData = function (objectData) {
    var objRelation,subObject,newRelation,objName,objCls,j,key,value;
    for (key in objectData) {
        if (!objectData.hasOwnProperty(key)) {
            continue;
        }
        value = objectData[key];
        //TODO 需要细化处理
        if ($.isArray(value) || $.isFunction(value)) {
            continue;
        }
        this[key] = value;
    }

    for(objName in this.option.objRelations){
        if (!this.option.objRelations.hasOwnProperty(objName)) {
            continue;
        }
        objCls = this.option.objRelations[objName];
        objRelation = objectData[objName] || [];

        newRelation = new Array(objRelation.length);
        for (j=0;j<objRelation.length;j++) {
            subObject = new objCls();
            subObject.parseData(objRelation[j]);
            newRelation[j] = subObject;
        }
        this[objName] = newRelation;
    }
};

/**
 * 对象拷贝
 * @return {CPCObject}
 */
CPCObject.prototype.clone = function () {
    var copy = new this.constructor;
    var value,valueTmp,aValue;
    for (var attr in this) {
        if (!this.hasOwnProperty(attr)) continue;
        value = this[attr];
        switch (typeof value) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'function':
                copy[attr] = value;
                break;
            case 'object':
                if ($.isArray(value)) {
                    valueTmp = new Array(value.length);
                    for (var i=0;i<value.length;i++) {
                        aValue = value[i];
                        if (aValue instanceof CPCObject) {
                            valueTmp[i] = aValue.clone();
                        } else {
                            valueTmp[i] = $.extend({}, aValue);
                        }
                    }
                    copy[attr] = valueTmp;
                }
                break;
            default:
                break;
        }
    }
    return copy;
};

/**
 * 序列化CPCObject
 * @return {string}
 */
CPCObject.prototype.stringify = function () {
    //TODO 部分序列化
    return JSON.stringify(this);
};

/**
 * 网络请求
 * @param method    调用方法
 * @param async     异步请求，默认true
 * @return {*}
 */
CPCObject.prototype.postRequest = function (method, async) {
    var postData = this.stringify();
    var clsName = this.option.objClass;
    var that = this;
    if (async == undefined) {
        async = true;
    }
    return $.cpc.ajaxPostBase(postData, clsName, method, async)
        .done(function (respData) {
                that.parseData(respData);
            }
        );
};

jQuery.cpc = {
    /**
     * 继承CPC业务基类
     * @param constructor    构造函数
     * @param option        配置选项
     */
    extendCPC: function (constructor,option) {
        option = option || {};
        var proto = new CPCObject();
        jQuery.extend(proto, proto.optionDef, option);
        constructor.prototype = proto;
        proto.constructor = constructor;
    },
    getUrl: function (clsName, method) {
        return '/jsp/authman.jsp?classid=' + clsName + '&action=' + method + '&format=mjson';
    },

    ajaxPostBase: function (postData, clas, method, async) {

        var header = {
            ajax:'1.01'
        };
        if (method == 'login') {
            header.loginguid= 'CPC';
        }
        return $.ajax({
            headers: header,
            contentType: "application/json; charset=utf-8",
            type: "POST",
            url: this.getUrl(clas, method),
            dataType: 'json',
            data: postData,
            async: async
        }).fail(function (data) {
            //TODO 显示错误信息，需要细化处理
            var respData = data.responseJSON;
            if (!respData) {
                respData = JSON.parse(data.responseText);
            }
            var errMsg='';
            if (respData) {
                errMsg = respData.message;
            } else {
                errMsg = '网络连接失败!';
            }
            $.messager.alert('错误', errMsg, 'info');
        });
    },

    ajaxPost: function (object, clas, method) {

        var postData;
        if (object instanceof CPCObject) {
            postData = object.stringify();
        } else {
            postData = JSON.stringify(object);
        }
        return this.ajaxPostBase(postData,clas,method,true).done(function (respData) {
            if (object instanceof CPCObject) {
                object.parseData(respData);
            } else {
                $.extend(object, respData);
            }
        });
    },

    showAlert: function (content) {
        $.messager.alert('错误提示',content,'info');
    },
    showPrompt: function (content,title) {
      //  $.messager.prompt
    },
    /**
     * 数据加载提示
     * @param content   提示字符串
     */
    progressLoad: function (content) {
        content = content || '正在处理，请稍候...';
        $("<div class=\"datagrid-mask\" style=\"position:absolute;z-index: 9999;\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");
        $("<div class=\"datagrid-mask-msg\" style=\"position:absolute;z-index: 9999;\"></div>").html(content).appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
    },
    /**
     * 隐藏数据加载提示
     */
    progressClose: function () {
        $(".datagrid-mask,.datagrid-mask-msg").remove();
    },
    datagridLoader: function (param, success, error) {
           var that = $(this);
        //   var opts = that.datagrid("options");
        //   console.log(param);
        var object = param.objectCls;
        var method = param.method;
        var dataRelation = param.relation;

        if (!object || !method || !dataRelation) return false;
        object.postRequest(method).done(function () {
            console.log(object);
            var buildData = {};
            var tempRows = object[dataRelation];
            buildData.rows = tempRows;
            buildData.total = tempRows.length;
            success(buildData);
        }).fail(function () {
            error.apply(that,arguments);
        });
    },
    /**
     * 字符串格式化
     * var s = '<span class="{0}">{1}</span>';
     * var as = $.cpc.stringFormat(s,'icon-search','搜索')
     * as == '<span class="icon-search">搜索</span>' //True
     * @return {*}
     */
    stringFormat: function() {
    var format = arguments[0];
    if (!format) return format;
    var args = Array.prototype.slice.call(arguments,1);
    return format.replace(/{(\d{1})}/g, function() {
        return args[arguments[1]];
    });
}
};

//EasyUI扩展
$.extend($.fn.datagrid.methods, {
    editCell: function(jq,param){
        return jq.each(function(){
            var opts = $(this).datagrid('options');
            var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
            for(var i=0; i<fields.length; i++){
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor1 = col.editor;
                if (fields[i] != param.field){
                    col.editor = null;
                }
            }
            $(this).datagrid('beginEdit', param.index);
            var ed = $(this).datagrid('getEditor', param);
            console.log(ed);
            if (ed){
                if ($(ed.target).hasClass('textbox-f')){
                    $(ed.target).textbox('textbox').focus();
                } else {
                    $(ed.target).focus();
                }
            }
            for(var i=0; i<fields.length; i++){
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor = col.editor1;
            }
        });
    },
    enableCellEditing: function(jq){
        return jq.each(function(){
            var dg = $(this);
            var opts = dg.datagrid('options');
            opts.oldOnClickCell = opts.onClickCell;
            opts.onClickCell = function(index, field){
                if (opts.editIndex != undefined){
                    if (dg.datagrid('validateRow', opts.editIndex)){
                        dg.datagrid('endEdit', opts.editIndex);
                        opts.editIndex = undefined;
                    } else {
                        return;
                    }
                }
                dg.datagrid('selectRow', index).datagrid('editCell', {
                    index: index,
                    field: field
                });
                opts.editIndex = index;
                opts.oldOnClickCell.call(this, index, field);
            }
        });
    }
});

$.modalDialog = function(options) {
    if ($.modalDialog.handler == undefined) {// 避免重复弹出
        var opts = $.extend({
            title : '',
            width : 840,
            height : 680,
            modal : true,
            onClose : function() {
                $.modalDialog.handler = undefined;
                $(this).dialog('destroy');
            },
            onOpen : function() {
            }
        }, options);
        opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数
        return $.modalDialog.handler = $('<div/>').dialog(opts);
    }
};

(function ($, window, document) {
    var pluginName = "table2excel",

        defaults = {
            exclude: ".noExl",
            name: "Table2Excel",
            filename: '下载',
            fileext: '.xls'
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        //
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this.init();
    }

    Plugin.prototype = {
        getFileName : function () {
            var fileName = this.settings.filename || this._defaults.filename;
            var fileExt = this.settings.fileext || this._defaults.fileext;
            return fileName + fileExt;
        },
        init: function () {
            var e = this;

            var utf8Heading = "<meta http-equiv=\"content-type\" content=\"application/vnd.ms-excel; charset=UTF-8\">";
            e.template = {
                head: "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">" + utf8Heading + "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>",
                sheet: {
                    head: "<x:ExcelWorksheet><x:Name>",
                    tail: "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>"
                },
                mid: "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>",
                table: {
                    head: "<table>",
                    tail: "</table>"
                },
                foot: "</body></html>"
            };

            e.tableRows = [];
             
            // get contents of table except for exclude
            $(e.element).each( function(i,o) {
                var tempRows = "";
                $(o).find("tr").not(e.settings.exclude).each(function (i,p) {
                    tempRows += "<tr>";
                    $(p).find("td").not(e.settings.exclude).each(function (i,q) { // p did not exist, I corrected
                        var flag = $(q).find(e.settings.exclude); // does this <td> have something with an exclude class
                        if(flag.length >= 1) {
                            tempRows += "<td> </td>"; // exclude it!!
                        } else {

							   tempRows += "<td x:str='"+$(q).html()+"'>" + $(q).html()+' ' + "</td>";
							
                           
                        }
                    });

                    tempRows += "</tr>";
                });
                e.tableRows.push(tempRows);
            });

            e.tableToExcel(e.tableRows, e.settings.name, e.settings.sheetName);
        },

        tableToExcel: function (table, name, sheetName) {
            var e = this, fullTemplate="", i, link, a;

            e.format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };

            sheetName = typeof sheetName === "undefined" ? "Sheet" : sheetName;

            e.ctx = {
                worksheet: name || "Worksheet",
                table: table,
                sheetName: sheetName
            };

            fullTemplate= e.template.head;

            if ( $.isArray(table) ) {
                for (i in table) {
                    //fullTemplate += e.template.sheet.head + "{worksheet" + i + "}" + e.template.sheet.tail;
                    fullTemplate += e.template.sheet.head + sheetName + i + e.template.sheet.tail;
                }
            }

            fullTemplate += e.template.mid;

            if ( $.isArray(table) ) {
                for (i in table) {
                    fullTemplate += e.template.table.head + "{table" + i + "}" + e.template.table.tail;
                }
            }

            fullTemplate += e.template.foot;

            for (i in table) {
                e.ctx["table" + i] = table[i];
            }
            delete e.ctx.table;

            var isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)
            if (isIE)
            //if (typeof msie !== "undefined" && msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // this works ONLY with IE 11!!!
            {
                if (typeof Blob == 'function') {
                    //use blobs if we can
                    fullTemplate = e.format(fullTemplate, e.ctx); // with this, works with IE
                    fullTemplate = [fullTemplate];
                    //convert to array
                    var blob1 = new Blob(fullTemplate, { type: "text/html" });
                    window.navigator.msSaveBlob(blob1, e.getFileName());
                } else {
                    //otherwise use the iframe and save
                    //requires a blank iframe on page called txtArea1
                    //TODO IE9中下载文件
                    var txtArea1 = window.open('','','width=100,height=100');
                    txtArea1.document.open("text/html", "replace");
                    txtArea1.document.write(e.format(fullTemplate, e.ctx));
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, e.getFileName());
                    txtArea1.close();
                }

            } else {
                var blob = new Blob([e.format(fullTemplate, e.ctx)], {type: 'application/vnd.ms-excel'});
                window.URL = window.URL || window.webkitURL;
                link = window.URL.createObjectURL(blob);
                a = document.createElement("a");
                a.download = e.getFileName();
                a.href = link;

                document.body.appendChild(a);

                a.click();

                document.body.removeChild(a);
            }

            return true;
        }
    };

    $.fn[pluginName] = function (options) {
        var e = this;
        e.each(function() {
            if (!$.data(e, "plugin_" + pluginName)) {
                $.data(e, "plugin_" + pluginName, new Plugin(this, options));
            }
        });

        // chain jQuery functions
        return e;
    };

})(jQuery, window, document);