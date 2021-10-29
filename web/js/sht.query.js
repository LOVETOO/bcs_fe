/**
 * Created by LIN on 2017/2/15.
 * 查询表单专用,查询表单相对简单，效率问题，最好区分一下
 */

/******************************************************
 * 全局变量
 */
var g_nOpenProcId = 0;
var g_nShtInsRight = 0; // 权限：0/1只读；2修改；3完全
var shtCols = [];
var shtTables = null;
var shtValues = null;
var shtIns = new CPCShtIns();
var grid = new CPCShtGrid("cell_shttable");

var g_editing_text = null;
var g_editing_value = null;
var g_common_searching = false;
var g_wstype = 4;
var g_modid = 12;
var g_noEditing = false;
var g_docSelect = false;

var DATA_SEPARATOR = ""; // 数据分隔符

$(function () {
    $('#btn-search').click(function () {

        //1.结束编辑
        var dg =$('#dg');
        var selected = dg.datagrid('getRowIndex', dg.datagrid('getSelected'));
        dg.datagrid('endEdit', selected);

        //2.拼接条件语句
        var dgData=dg.datagrid('getData');
        var rows = dgData.rows;
        var total =dgData.total;

        var sqls = userSht.cpcshttableofcpcusershts[0].sqls;
        var reg = new RegExp(" where ","ig");
        var sql = reg.test(sqls)? ' and': ' where';
        var tmp,data,colType,colName,op,re;
        for (var i=0;i<total;i++) {
            tmp = rows[i];
            data = tmp.data;
            colType = tmp.coltype;
            colName = tmp.colname;
            op = tmp.op;
            re = tmp.re;
            if (!data) continue;
            switch (op) {
                case 'like':
                case 'not like':
                    data = wrapQuotedStr(data, '%');
                    break;
                case 'in':
                case 'not in':
                    data = '(' + data + ')';
                    break;
            }
            data = wrapQuotedStr(data,"'");
            sql += ' (' + colName + ' ' + op + ' ' + data + ') ' + re;
        }
        sql += ' (1=1)';

        console.log(sql);

        var newSht = userSht.clone();
        newSht.inswfid=0;
        newSht.shtinsid=0;
        newSht.cpcshttableofcpcusershts[0].sqls=sqls.replace('<where>',sql);
        var time = new Date().getTime();
        $.cpc.progressLoad();
         var d = newSht.postRequest('vquery').done(function () {
            var time2 = new Date().getTime();
            console.log('网络调用花费时间：' + (time2-time)/1000 +'s');
            $('.cpcadd').remove();
            $('.cpcvalue').removeClass('zebra').html('');
            var s = new Date().getTime();
            var table = newSht.cpcshttableofcpcusershts[0];
            table.showData();
            //斑马线显示
            if (userSht.shtfmt[9] == '1') {
                var s3 = new Date().getTime();
                table.setZebra();
                var s4= new Date().getTime();
                console.log('设置颜色花费时间：' +(s4-s3)/1000 +'s');
            }
            //支持手动调整行高
            $("tr:has('td.cpcvalue')").resizable({
                maxHeight:500,
                handles:'s'
            });
            var s2 = new Date().getTime();
            console.log('显示数据花费时间：' +(s2-s)/1000 +'s');
        }).always(function () {
             $.cpc.progressClose();
         });
         console.log(d);
    });
    $('#btn-export').click(function () {
    //   $('#cell_shttable table').tableToExcel();
        $('#cell_shttable').find('table').table2excel({
            filename: userSht.shtname
        });

    });
    $('#btn-clear').click(function () {
        $('.cpcadd').remove();
        $('.cpcvalue').removeClass('zebra').html('');
    })
});

/******************************************************
 *cpcusersht方法
 */
CPCUserSht.prototype.initQuery = function () {
    console.log(this.shtid);
    userSht.postRequest('selecttype').done(function () {
        //隐藏正在加载的遮罩
        $('#loading-mask,#loading').hide(100);

        console.log(userSht);
        var i,j,shtTable;
        shtTables = userSht.cpcshttableofcpcusershts;
        shtValues = userSht.cpcshtvaluesofcpcusershts;
        if (!shtTables || shtTables.length == 0) {
            $.cpc.showAlert('数据表没有定义');
        }

        //初始化查询条件
        shtTable = shtTables[0];
        var inputParams=shtTable.inputparams;
        var params = inputParams.split('\n');
        console.log(params.length);
        var name, op, shtCol;
        var rows = [];
        for (i=0;i<params.length;i++) {
            var tmp = params[i].split('|');
            if (tmp.length !=3) continue;
            name = tmp[0];
            op = tmp[1];

            shtCol =shtTable.getDataCol(name,true);
            if (!shtCol) continue;
            rows.push({
                colalias: name,
                colname: shtCol.colname,
                coltype: shtCol.coltype,
                op: op,
                re: 'and'
            });
        }
        console.log(rows);
        var sqlData = {
            rows: rows,
            total:rows.length
        };
        $('#dg').datagrid('enableCellEditing').datagrid('loadData',sqlData);

        if (!shtTable.inputparams){
            $('#btn-search').click();
            $('#main_contain').layout('remove', 'west');
        }
    });
};

/******************************************************
 * cpcshtcol方法
 */
/**
 * 初始化shtCol
 */
CPCShtCol.prototype.initCol = function () {

    //1.检查影响列与被影响列
    var test = /\[(.+?)]/ig;
    var r, aEffectCol, tableName, colName, shtTable, effectCol;
    //1.1检查影响列
    if (this.effectcol) {
        while (r = test.exec(this.effectcol)) {
            aEffectCol = r[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '被影响列定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            effectCol = shtTable.getDataCol(colName);
            if (effectCol) this.addEffectCol(effectCol);
        }
    }
    //1.2计算字段检查被影响列
    if (this.colval == '<COMPUTE>' && this.colstylenote) {
    //    console.log(this.colstylenote);
        while (r = test.exec(this.colstylenote)) {
            aEffectCol = r[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '样式值定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            effectCol = shtTable.getDataCol(colName);
            if (effectCol) effectCol.addEffectCol(this);
        }
    }

    //2.数据列显示模式
    if (this.hidecol == 2 || this.hidecol == 3) {
        if (this.hideprocid) {
            //关联过程不是当前过程,设置为正常模式
            if (wrapQuotedStr(this.hideprocid,',').indexOf(wrapQuotedStr(g_nOpenProcId,',')) < 0) {
                this.hidecol = 1;
            }
        }
    }
    //非授权用户或角色,设置为匿名模式
    if (this.authuser || this.authrole) {
        var authUser = this.authuser && wrapQuotedStr(this.authuser, ',').indexOf(wrapQuotedStr(g_userid, ',')) > -1;
        var authRole = this.authrole && isContainRole(g_USERROLE, this.authrole);
        if (!authUser && !authRole) {
            this.hidecol = 3;
        }
    }

    //3.数据列是否允许编辑
    this.editable  = g_nShtInsRight >=2
        && this.hidecol !=2
        && this.hidecol !=3
        && this.autocode !=2            //非自动编码字段
        && this.colval !='<COMPUTE>'
        && this.colval !='<VARIABLES>'
        && !(this.colval && this.colval.indexOf('<WF') ==0)
        && !(this.rightprocid           //TODO 要先判断整个表单有没有数据列设置了过程权限
            && wrapQuotedStr(this.rightprocid,',').indexOf(wrapQuotedStr(g_nOpenProcId,',')) < 0)
        //TODO 其他权限
        && true;
    //4.数据列是否可以为空
    this.nilable = this.colnilflag == 2 ||
        (this.colnilflag == 1
            && (!this.colnilprocid
                || wrapQuotedStr(this.colnilprocid,',').indexOf(wrapQuotedStr(g_nOpenProcId,','))<0));

    //5.数据列颜色？

    //TODO 其余初始化工作
   // console.log(this);
};
/**
 * 判断工作流过程中是否可以修改
 * @param procId    流程节点
 * @returns {boolean}
 */
CPCShtCol.prototype.hasRight = function (procId) {
    if (!this.rightprocid) return false;
    var result = (',' + this.rightprocid + ',').indexOf(',' + procId + ',') > -1;
    //TODO 权限有必要进行缓存?
    return result;
};
/**
 * 该列是否可以修改
 * @return {boolean|*}
 */
CPCShtCol.prototype.canModify = function () {
    return this.editable && true; //TODO 有一些动态条件
};
/**
 * 该列是否可以为空
 * @return {boolean|*}
 */
CPCShtCol.prototype.canBeNull = function () {

    return this.nilable && true; //TODO 有一些动态条件
};

/**
 * 获取变量值
 * @param rowNo
 * @return {string}
 */
CPCShtCol.prototype.getShtVarValue = function (rowNo) {
    if (!shtValues) return null;    //没有变量
    var varSql,dsId;
    for (var i = 0; i < shtValues.length; i++) {
        if (shtValues[i].varcode == this.varcode) {
            varSql = shtValues[i].vsql;
            dsId = shtValues[i].dsid;
            break;
        }
    }

    //替换
    //获取SQL语句
    if (!varSql) return;
    var result = varSql;
    var test = /\[(.+?)]/ig;
    var r,value;
    var shtTable,shtCol,shtTableName,shtColName,tmp;
    while (r = test.exec(varSql)) {
        tmp = r[1].split('.');
        if (tmp.length !=2) throw '变量定义错误';
        shtTableName = tmp[0];
        shtColName = tmp[1];
        shtTable = getDataTableByName(shtTableName);
        if (!shtTable) throw '数据表:' + shtTableName + '不存在';
        shtCol = shtTable.getDataCol(shtColName);
        if (!shtCol) throw '字段属性:' + shtColName + '不存在';

        if (this.colstyle == 3 || this.colstyle ==7) {
            value = shtCol.getValue(rowNo);
        } else {
            value = shtCol.getText(rowNo);
        }
        if (shtCol.coltype == 1) {//数字
            value = parseFloat(value);
            if (isNaN(value)) throw '字段为空';
        } else if (shtCol.coltype == 2){
            value = parseInt(value);
            if (isNaN(value)) throw '字段为空';
        } else {
            if (!value) throw '字段为空';
            value = wrapQuotedStr(value);
        }

//        var value = getCellSqlText(r[1]);
        console.log(r[0]);
        result = result.replace(r[0], value);
    }

    console.log(result);

    var cpcShtValues = new cpcshtvalues();
    cpcShtValues.shtid = shtIns.shtid;
    cpcShtValues.varcode = this.code;
    cpcShtValues.dsid = dsId;
    cpcShtValues.vsql = result;
    PostRequest(cpcShtValues, 'selectvar', false); // 同步处理
    return cpcShtValues.data;
};

/**
 * 计算单元格
 * @param rowNo 行号
 */
CPCShtCol.prototype.calculate = function (rowNo) {
    //计算字段
    console.log("calculate cell:" + this.colname);
    if (this.fixlen == 1) rowNo = 0;//定长表为第0行
    var value='';
    var test,r,result,shtTable,shtCol,shtTableName,shtColName,tmp;
    if ('<COMPUTE>' == this.colval) {
        // 计算表达式
    //    console.log(this.colstylenote);
        if (this.colstylenote) {
            var strTmp = this.colstylenote.toLowerCase();
            test = /sum\((.+?)\)/g;
            while  (r = test.exec(strTmp)) {
                console.log(r[1].split(','));
                result = SUM.apply(this, r[1].split(','));
                //当中可能包含特殊字符，不使用正则匹配
                strTmp = strTmp.slice(0,r.index) + result + strTmp.slice(r.index + r[0].length);
            }

        //    console.log(strTmp);
            test = /\[(.+?)]/ig;
            var newStr = strTmp;
            while (r = test.exec(strTmp)) {
                console.log(r);
                tmp = r[1].split('.');
                shtTableName = tmp[0];
                shtColName = tmp[1];
                shtTable = getDataTableByName(shtTableName);
                shtCol = shtTable.getDataCol(shtColName);
                result = parseFloat(shtCol.getText(rowNo));
                if (isNaN(result)) result = 0;
                newStr = newStr.replace(new RegExp('\\' + r[0], 'g'), result);
            }

            console.log(newStr);
            eval('value' + newStr);
        }
    } else if ('<VARIABLES>' == this.colval) {
      // 变量
        try {
            value = this.getShtVarValue(rowNo);
        } catch (e) {
        //    alert (e);
            console.log(e);
            return;
        }
        Logger.debug(value);

        if (value == null) {
            value = "";
        }

        if (value.indexOf('$') > -1) {
            var tmpArr = value.split('$');
            value = tmpArr[0];
            this.colrvalue = tmpArr[1];
        }
        else if (value.indexOf('|') > -1) {
            var tmpArr = value.split('|');
            value = tmpArr[0];
            this.colrvalue = tmpArr[1];
        }

    }
 //   if (this.fixlen == 1) {
  //      var cell = $('[cpccolid=' + this.colid + ']');
 //   } else {
        var cell = $('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
 //   }
    if (cell.length > 0) {
        this.setCellValueNew(cell, value, value, true);
    }
};


/**
 * 获取完整列名
 * @param isBracketStr  是否包含中括号
 * @return {string}
 */
CPCShtCol.prototype.getFullName = function (isBracketStr) {
    var shtTable = getDataTableById(this.tableid);
    var fullName = shtTable.tablename +  '.' + this.colname;
    if (isBracketStr) fullName = '[' + fullName + ']';
    return fullName;
};

CPCShtCol.prototype.getData = function () {
    //debugger
    var value = this.data;

    if (null == value) {
        // 取默认值
        value = this.colval;
        // clt
        if (value == null || value == "null") return "";

        //Logger.debug("getData get default value: "+value);
        if (value && '<' == value.charAt(0)) {
            // 替换变量
            if ("<TODAYTIME>" == value) value = FormatDateTime(new Date);
            else if ("<TODAY>" == value) value = FormatDate(new Date);
            else if ("<LOGINUSER>" == value) value = getLoginUser().userid;
            else if ("<LOGINUSER>|<LOGINUSERNAME>" == value) {
                value = getLoginUser().userid;
                this.colrvalue = getLoginUser().username;
            }
            else if ("<LOGINPOSITION>" == value) value = getLoginUser().position;
            else if ("<LOGINORG>" == value) value = getLoginUser().orgname;
            else if ("<LOGINORG>|<LOGINORGNAME>" == value) {
                value = getLoginUser().orgid;
                this.colrvalue = getLoginUser().orgname;
            }
            else if ("<GROUPORGID>" == value) {
                value = g_GROUPORGID;
            }
            else if ("<GROUPORGCODE>" == value) {
                value = g_GROUPORGCODE;
            }
            else if ("<GROUPORGNAME>" == value) {
                value = g_GROUPORGNAME;
            }
            else if ("<DEPTORGID>" == value) {
                value = g_DEPTORGID;
            }
            else if ("<DEPTORGCODE>" == value) {
                value = g_DEPTORGCODE;
            }
            else if ("<DEPTORGNAME>" == value) {
                value = g_DEPTORGNAME;
            }
            else if ("<ROOMORGID>" == value) {
                value = g_ROOMORGID;
            }
            else if ("<ROOMORGCODE>" == value) {
                value = g_ROOMORGCODE;
            }
            else if ("<ROOMORGNAME>" == value) {
                value = g_ROOMORGNAME;
            }
            else if ("<TEAMORGID>" == value) {
                value = g_TEAMORGID;
            }
            else if ("<TEAMORGCODE>" == value) {
                value = g_TEAMORGCODE;
            }
            else if ("<TEAMORGNAME>" == value) {
                value = g_TEAMORGNAME;
            }
            else if ("<COMPORGID>" == value) {
                value = g_COMPORGID;
            }
            else if ("<COMPORGCODE>" == value) {
                value = g_COMPORGCODE;
            }
            else if ("<COMPORGNAME>" == value) {
                value = g_COMPORGNAME;
            }
            else if ("<COMPUTE>" == value || "<VARIABLES>" == value) return "";
            else if ('>' == value.charAt(value.length - 1)) return "";
        }
        return value;
    }

    if (4 == this.coltype) {
        // 日期，过滤时间
        if (value.length > 10 && value.indexOf(DATA_SEPARATOR) == -1) value = value.substring(0, 10);
        return value;
    }

    if ((3 == this.colstyle || 4 == this.colstyle) && this.colrvalue) {

        //value=this.colrvalue;
        this.colstylenote = value + "=" + this.colrvalue;
    }
    else if (4 == this.colstyle) {
        this.colrvalue = value;
    }

    return value;
};

function clearValueNew(colId, rowNo) {
    console.log('[clearValueNew,colId:' +colId + ', rowNo:' + rowNo + ']');
    var i,shtCol;
    for (i=0;i<shtCols.length;i++) {
        if (shtCols[i].colid == colId) {
            shtCol =shtCols[i];
            break;
        }
    }
  //  console.log(shtCol);
    if (shtCol) shtCol.clearValue(rowNo);
}

/**
 * 初始化单元格数据值
 * @param shtCell
 */
CPCShtCol.prototype.initCellValue = function(shtCell) {
    if (shtCell.length ==0) return;
    var cpcValue,cpcText,tmp,tmp2,aValue,aText,i,j;
    var shtTable = shtCell.data('cpctable');
    if (this.data) {
        cpcValue = this.data.split(DATA_SEPARATOR);
        cpcText = cpcValue.slice(0);
        if (this.colstyle ==1 || this.colstyle == 2 && this.colstylenote) {//下拉框不能输入 ||下拉框可输入
            tmp = this.colstylenote.split('|');
            for (i=0;i<tmp.length;i++) {
                tmp2 = tmp[i].split('=');
                if (tmp2.length !=2) continue;
                aValue = tmp2[0];
                aText = tmp2[1];
                for (j=0;j<cpcValue.length;j++) {
                    if (cpcValue[j] == aValue) {
                        cpcText[j] = aText;
                    }
                }
            }
        } else if (this.colstyle ==3) {//选择不能输入
            cpcText = this.colrvalue.split(DATA_SEPARATOR);
        }
    } else if (this.autocode == 2 && shtTable.fixlen ==2){//不定长表自动编码字段自动编码
        cpcValue = cpcText = [];
        shtCell.each(function (index) {
            cpcValue[index] = index + 1;
        });
    } else if (this.colval){//取默认值
        switch (this.colval) {
            case "<TODAYTIME>":
                aValue = FormatDateTime(new Date);
                break;
            case "<TODAY>":
                aValue = FormatDate(new Date);
                break;
            case "<LOGINUSER>":
                aValue = getLoginUser().userid;
                break;
            case "<LOGINUSER>|<LOGINUSERNAME>":
                aValue = getLoginUser().userid;
                aText = getLoginUser().username;
                this.colrvalue = getLoginUser().username;
                break;
            case "<LOGINPOSITION>":
                aValue = getLoginUser().position;
                break;
            case "<LOGINORG>":
                aValue = getLoginUser().orgname;
                break;
            case "<LOGINORG>|<LOGINORGNAME>":
                aValue = getLoginUser().orgid;
                aText = getLoginUser().orgname;
                this.colrvalue = getLoginUser().orgname;
                break;
            case "<GROUPORGID>":
                aValue = g_GROUPORGID;
                break;
            case "<GROUPORGCODE>":
                aValue = g_GROUPORGCODE;
                break;
            case "<GROUPORGNAME>":
                aValue = g_GROUPORGNAME;
                break;
            case "<DEPTORGID>":
                aValue = g_DEPTORGID;
                break;
            case "<DEPTORGCODE>":
                aValue = g_DEPTORGCODE;
                break;
            case "<DEPTORGNAME>":
                aValue = g_DEPTORGNAME;
                break;
            case "<ROOMORGID>":
                aValue = g_ROOMORGID;
                break;
            case "<ROOMORGCODE>":
                aValue = g_ROOMORGCODE;
                break;
            case "<ROOMORGNAME>":
                aValue = g_ROOMORGNAME;
                break;
            case "<TEAMORGID>":
                aValue = g_TEAMORGID;
                break;
            case "<TEAMORGCODE>":
                aValue = g_TEAMORGCODE;
                break;
            case "<TEAMORGNAME>":
                aValue = g_TEAMORGNAME;
                break;
            case "<COMPORGID>":
                aValue = g_COMPORGID;
                break;
            case "<COMPORGCODE>":
                aValue = g_COMPORGCODE;
                break;
            case "<COMPORGNAME>":
                aValue = g_COMPORGNAME;
                break;
            default:
                aValue = '';
                break;
        }
        aText = aText || aValue;
        cpcValue = new Array(shtCell.length);
        cpcText = new Array(shtCell.length);
        for (i=0;i<shtCell.length;i++) {
            cpcValue[i] = aValue;
            cpcText[i] = aText;
        }
    } else {
        cpcValue = [];
        cpcText = [];
    }

  //  console.log(cpcValue);
  //  console.log(cpcText);

    var that = this;

    shtCell.each(function (index) {
        aValue = cpcValue[index]? cpcValue[index]: '';
        aText = cpcText[index]? cpcText[index]: '';
        that.setCellValueNew(this, aValue, aText, false);
    });
};

/**
 * 设置单元格的值
 * @param cell  对应单元格
 * @param value 内部值data
 * @param text  显示值
 * @param changed   是否需要change事件
 */
CPCShtCol.prototype.setCellValueNew = function (cell, value, text, changed) {
    var htmlText = '';
    var i,tmp,tmp2,index;
    var jQCell = $(cell);
    jQCell.attr({
        cpcvalue: value,
        cpctext: text
    });

//    var editAble = jQCell.attr('cpceditable') == 'true';
    var editAble = this.canModify();
    var colId = jQCell.attr('cpccolid');
    var rowNo = jQCell.attr('cpcrow');

    if (this.hidecol == 2) {        //2.隐藏模式
        htmlText = '';
    } else if (this.hidecol == 3){  //3.匿名模式
        htmlText = '***';
    } else {                        //1.正常模式
        //3.选择(不能输入) && 文件附件
        if (this.colstyle == 3 && this.colval == '<DOCUMENT>' && text) {
            tmp = text.split(';');
            for (i = 0; i < tmp.length; i++) {
                tmp2 = tmp[i];
                index = tmp2.split('=download');
                htmlText += "<a href='" + index[1] + "' target=_blank ''>" + index[0] + "</a>";
            }
        } else {
            htmlText = text;
        }
    }
    if (parseInt(this.coltype) == 1) {
	   //设置千分位
	   var re=/\d{1,3}(?=(\d{3})+$)/g;
　　   htmlText =htmlText.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});

	}
    jQCell.html(htmlText);
    //触发Changed事件
    if (changed) {
        jQCell.each(function () {
            onCellDataChanged(this, true);
        })
    }
};
/**
 * 从单元格中提取内容
 * @param rowNos
 */
CPCShtCol.prototype.getCellValue = function(rowNos) {
    var value;
    this.data = '';
    //定长表
    if (this.fixlen == 1) {
        value = this.getValue(0);
        //检查非空
        if (!value && !this.canBeNull()) {
            throw this.colalias + ' 不能为空';
        }
        this.data = value;
    } else {
        for (var i=0;i<rowNos.length;i++) {
            value = this.getValue(rowNos[i]);

            //检查非空
            if (!value && !this.canBeNull()) {
                throw '第' + (i+1) + '行 ' + this.colalias + ' 不能为空';
            }
            this.data = this.data + DATA_SEPARATOR + value;
        }
        this.data = this.data.slice(1);
    }
};

/**
 *清空单元格内容
 * @param rowNo
 */
CPCShtCol.prototype.clearValue = function(rowNo) {
    var cell = $('[cpccolid=' + this.colid +'][cpcrow=' + rowNo + ']');
    //TODO 这里需要change?
    this.setCellValueNew(cell, '', '', true);
};

/**
 * 获取单元格内容-数据
 * @param rowNo
 * @returns {string}
 */
CPCShtCol.prototype.getValue = function(rowNo) {
    var cell = $('[cpccolid=' + this.colid +'][cpcrow=' + rowNo + ']');
    var value = cell.attr('cpcvalue');
    if (!value) {
        if (this.coltype == 1 || this.coltype == 2) {
            value = '0';
        } else {
            value = '';
        }
    }
    return value;
};

/**
 * 获取单元格内容-文本
 * @param rowNo
 * @returns {string}
 */
CPCShtCol.prototype.getText = function(rowNo) {
    var cell = $('[cpccolid=' + this.colid +'][cpcrow=' + rowNo + ']');
    return cell.attr('cpctext');
};

CPCShtCol.prototype.canInsertRow = function () {
    var table = getDataTableById(this.tableid);
    return (table && table.fixlen == 2);
};

/**
 * 添加影响列
 * @param shtCol
 */
CPCShtCol.prototype.addEffectCol = function (shtCol) {
    if (!this.m_effectCols) {
        this.m_effectCols = [];
    }
    if (shtCol == this) return; // 死循环
    if (this.m_effectCols.indexOf(shtCol) < 0) {
        this.m_effectCols.push(shtCol);
    }
};
/**
 * 获取单元格受影响列
 * @return {Array}
 */
CPCShtCol.prototype.getEffectCol = function () {
    return this.m_effectCols;
};

/**
 * 设置网格颜色
 * @param cell
 */
CPCShtCol.prototype.setCellColor = function (cell) {
    if (!this.colformat) return;

    //  console.log(this.colformat);

    var list = this.colformat.split("=");
    if (list.length < 2) return;
    var procIds = wrapQuotedStr(list[0],',');
    var cellColor = list[1];
    if (procIds.indexOf(wrapQuotedStr(g_nOpenProcId,',')) > -1) {
        var color = CPCShtCol.cellColors[cellColor];
        //    console.log(color);
        $(cell).css("background-color", color);
    }
};

/**
 * 获取单元格所在的网格
 * @param rowNo 行号,不传取全部
 * @return {*|jQuery|HTMLElement}
 */
CPCShtCol.prototype.getColCell = function (rowNo) {
    var selected = "[cpccolid=" + this.colid + "]";
    if (typeof rowNo != 'undefined') {
        selected +="[cpcrow=" + rowNo + "]";
    }
    return $(selected);
};

/******************************************************
 * cpcshttable方法
 */
/**
 * 数据表初始化工作
 */
CPCShtTable.prototype.initTable = function () {
    console.log('初始化数据表:' + this.tablename);
    var shtCol,shtCell,k;
    var thisTable = this;
    //1.初始化数据列
    var shtTableCols = this.cpcshtcolofcpcshttables;
    if (!shtTableCols || shtTableCols.length == 0) return;
    for(k=0;k<shtTableCols.length;k++) {
        shtCol = shtTableCols[k];
        shtCol.fixlen = this.fixlen;
        shtCols.push(shtCol);
    }
    //TODO 还有什么需要初始化
};

CPCShtTable.prototype.showData = function () {
    console.log('显示数据表: ' +this.tablename);

    var m,k, shtCol,rowNo,ColNo,shtCell;
    var shtCols = this.cpcshtcolofcpcshttables;
    var shtTable = this;

    for(k=0;k<shtCols.length;k++) {
        shtCol = shtCols[k];
        //设置单元格属性值
        if (this.fixlen == 1) {
            shtCell = $('#shttd_' + shtCol.rowno + '_' + shtCol.colno);
            shtCell.attr({
                cpccolid: shtCol.colid,
                cpctableid: shtTable.tableid,
                cpctable: shtTable.tablename,
                cpcrow: 0,
                cpceditable: shtCol.canModify(),
                cpcautocode: shtCol.autocode
            });
        } else {
            var startRow = this.startrow;
            var endRow = this.endrow;
            shtCell = $('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
                //    console.log(this.id);
                var offset = getCellOffset(this.id);
                //    console.log(offset.row);
                //    console.log(startRow);
                //    console.log(endRow);
                return (offset.row >= startRow && offset.row <= endRow);
            });
            //   console.log(shtCell.length);
            shtCell.each(function (index) {
                $(this).attr({
                    cpccolid: shtCol.colid,
                    cpctableid: shtTable.tableid,
                    cpctable: shtTable.tablename,
                    cpcrow: index,
                    cpceditable: shtCol.canModify(),
                    cpcautocode: shtCol.autocode
                });
            });
            //  shtCell.addClass('zebra');

            //不定长表自动编码字段自动编码
            //  console.log('autocode:' + shtCol.colname + ' ' + shtCol.autocode);
            if (shtCol.autocode == '2') {
                console.log('自动编码' + shtCol.colname);
                shtCell.each(function (index) {
                    shtCol.setCellValueNew(this,index+1,index+1,false);
                });
            }
        }
        shtCell.addClass('cpcvalue');
        shtCell.data('cpccol', shtCol);//Cache Col
        shtCell.data('cpctable', this);//Cache Table

        shtCol.setCellColor(shtCell[0]);
    }
    var time = new Date().getTime();
    //不定长表重新计算行
    if (this.fixlen == 2) {
        var oldLength = this.endrow - this.startrow + 1;
        var dataLength = this.getDataLength(true);
        //   console.log(dataLength);
        if (dataLength > oldLength) {
            console.log(oldLength);
            console.log(dataLength);
            this.appendRow(oldLength -1,dataLength - oldLength);
        }
    }
    var time2 = new Date().getTime();
    console.log('增加行花费时间：' +(time2-time)/1000 + 's');
    //   return;

    //填充数据
    for (k = 0; k<shtCols.length; k++) {
        shtCol = shtCols[k];
        shtCell = $('[cpccolid=' + shtCol.colid +']');
        shtCol.initCellValue(shtCell);
    }
    var time3 =new Date().getTime();
    console.log('填充行数据花费时间：' +(time3-time2)/1000 + 's');
};

CPCShtTable.prototype.getCols = function () {
    return this.cpcshtcolofcpcshttables;
};

/**
 *  根据字段名获取列
 * @param colName   字段名称
 * @param isAlias   是否别名
 * @return {*}
 */
CPCShtTable.prototype.getDataCol = function (colName, isAlias) {
    var tableCols = this.cpcshtcolofcpcshttables;
    if (!tableCols) return null;
    var colLength = tableCols.length;
    var fieldName = isAlias? 'colalias': 'colname'
    for (var i = 0; i < colLength; i++) {
        if (tableCols[i][fieldName] == colName) {
            return tableCols[i];
        }
    }
    return null;
};

/**
 * 设置斑马线颜色显示
 */
CPCShtTable.prototype.setZebra =function () {
    //不定长表有效
    if (this.fixlen != 2) return;
    var shtCol;
    var tableCols = this.cpcshtcolofcpcshttables;
    var colLength = tableCols.length;
    for (var i = 0; i < colLength; i++) {
        shtCol = tableCols[i];
        var shtCell = shtCol.getColCell();
        shtCell.filter(':odd').addClass('zebra');
    }
};

/**
 * 数据表增加行
 * @param rowNo
 * @param rowNum
 */
CPCShtTable.prototype.appendRow = function (rowNo, rowNum) {

    //定长表不能增加行
    if (this.fixlen == 1) return;
    if (!rowNum) rowNum =1;
    if (!rowNo || rowNo < 0) rowNo = 0;
    var tr = $('[cpctable=' + this.tablename + '][cpcrow=' + rowNo + ']').parent('tr');
    var i,newTr,shtCol,shtCells;
    var trStr = '';
    newTr = tr.clone(true).addClass('cpcadd');
    newTr.children('td[cpctable=' + this.tablename + ']').removeAttr('id').attr({
        cpcvalue: '',
        cpctext: ''
    }).html('');
    var dd = newTr.prop('outerHTML');
  //  console.log(dd);
    while (rowNum-- > 0) {
        trStr += dd;
    }
    tr.after(trStr);

    //2.重新设定插入行后面的行号
  //  console.log(this.getDataLength(true));
    var changeRowCount = this.getDataLength(true) - rowNo - 1;
    console.log(this.tablename + ' appendRow :' + changeRowCount);
    var that = this;
    tr.nextAll('tr:lt(' + changeRowCount + ')').each(function (index) {
        $(this).children('td[cpctable=' + that.tablename + ']').attr('cpcrow',index + rowNo + 1);
    });
    
    var shtTableCols = this.cpcshtcolofcpcshttables;
    for (i=0;i<shtTableCols.length;i++) {
        shtCol = shtTableCols[i];
        shtCells = shtCol.getColCell();
        shtCells.each(function () {

        })
    }

    //TODO 3.重新缓存data

};

/**
 * 获取数据表的行数
 * @returns {number}
 */
CPCShtTable.prototype.getDataLength = function (reCalc) {
    if (!reCalc && this.rowcount && this.rowcount > 0) return this.rowcount;
    if(this.fixlen == 1) {
        this.rowcount = 1;
    } else {
        this.rowcount = this.endrow - this.startrow + 1;
        var cols = this.getCols();
        if (cols && cols.length > 0) {
            for(var i=0; i< cols.length;i++) {
                var size = cols[i].data? cols[i].data.split(DATA_SEPARATOR).length: 0;
                if (size > this.rowcount) {
                    this.rowcount = size;
                }
            }
        }
    }
    return this.rowcount;
};

/******************************************************
 * 表单操作
 */
function showShtIns() {

    userSht = new CPCUserSht();
    userSht.shtid = shtId;

    userSht.postRequest('selecttype').done(function () {
        //隐藏正在加载的遮罩
        $('#loading-mask,#loading').hide(100);
       initShtIns(userSht);
    });
}

function initShtIns(userSht) {
    console.log(userSht);
    var i,j,shtTable;
    shtTables = userSht.cpcshttableofcpcusershts;
    shtValues = userSht.cpcshtvaluesofcpcusershts;
    if (!shtTables || shtTables.length == 0) {
        $.cpc.alert('数据表没有定义');
    }
    for (i=0;i<shtTables.length;i++) {
        shtTable = shtTables[i];
        shtTable.initTable();
    }
    for (i=0; i<shtCols.length; i++) {
        shtCols[i].initCol();
    }

}

// 显示数据表
function showDataTable(dataTable) {
    console.log('显示数据表: ' +dataTable.tablename);

    var m,k, shtCol,rowNo,ColNo,shtCell;
    var cols = dataTable.cpcshtcolofcpcshttables;
    console.log(cols);

    for(k=0;k<cols.length;k++) {
        shtCol = cols[k];
        //设置单元格属性值
        if (dataTable.fixlen == 1) {
            shtCell = $('#shttd_' + shtCol.rowno + '_' + shtCol.colno);
            shtCell.attr({
                cpccolid: shtCol.colid,
                cpctableid: dataTable.tableid,
                cpctable: dataTable.tablename,
                cpcrow: 0,
                cpceditable: shtCol.canModify(),
                cpcautocode: shtCol.autocode
            });
        } else {
            var startRow = dataTable.startrow;
            var endRow = dataTable.endrow;
            shtCell = $('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
            //    console.log(this.id);
                var offset = getCellOffset(this.id);
            //    console.log(offset.row);
            //    console.log(startRow);
            //    console.log(endRow);
                return (offset.row >= startRow && offset.row <= endRow);
            });
         //   console.log(shtCell.length);
            shtCell.each(function (index) {
                $(this).attr({
                    cpccolid: shtCol.colid,
                    cpctableid: dataTable.tableid,
                    cpctable: dataTable.tablename,
                    cpcrow: index,
                    cpceditable: shtCol.canModify(),
                    cpcautocode: shtCol.autocode
                });
            });
          //  shtCell.addClass('zebra');

            //不定长表自动编码字段自动编码
            //  console.log('autocode:' + shtCol.colname + ' ' + shtCol.autocode);
            if (shtCol.autocode == '2') {
                console.log('自动编码' + shtCol.colname);
                shtCell.each(function (index) {
                    shtCol.setCellValueNew(this,index+1,index+1,false);
                });
            }
        }
        shtCell.addClass('cpcvalue');
        shtCell.data('cpccol', shtCol);//Cache Col
        shtCell.data('cpctable', dataTable);//Cache Table

        shtCol.setCellColor(shtCell[0]);
    }
    var time = new Date().getTime();
    //不定长表重新计算行
    if (dataTable.fixlen == 2) {
        var oldLength = dataTable.endrow - dataTable.startrow + 1;
        var dataLength = dataTable.getDataLength(true);
     //   console.log(dataLength);
        if (dataLength > oldLength) {
         //   appendRow(dataTable.tablename, oldLength -1, dataLength - oldLength);
            dataTable.appendRow(oldLength -1,dataLength - oldLength);
        }
    }
    var time2 = new Date().getTime();
    console.log('增加行花费时间：' +(time2-time)/1000 + 's');
 //   return;

    //填充数据
    for (k = 0; k<cols.length; k++) {
        shtCol = cols[k];
        shtCell = $('[cpccolid=' + shtCol.colid +']');
        shtCol.initCellValue(shtCell);
    }
    var time3 =new Date().getTime();
    console.log('填充行数据花费时间：' +(time3-time2)/1000 + 's');
}

/**
 * 取指定数据表
 * @param tableId   表ID
 * @return {cpcshttable}
 */
function getDataTableById(tableId) {
    if (!shtTables) return null;
    for (var i = 0; i < shtTables.length; i++) {
        if (shtTables[i].tableid == tableId) {
            return shtTables[i];
        }
    }
    return null;
}

/**
 * 取指定数据表
 * @param tableName   表名称
 * @return {cpcshttable}
 */
function getDataTableByName(tableName) {
    if (!shtTables) return null;
    for (var i = 0; i < shtTables.length; i++) {
        if (shtTables[i].tablename == tableName) {
            return shtTables[i];
        }
    }
    return null;
}

// 取指定字段
function getDataCol(id) {
    if (!shtCols) return null;
    for (var i = 0; i < shtCols.length; i++) {
        if (shtCols[i].colid == id) return shtCols[i];
    }
    return null;
}

/**
 * 不定长表插入行
 * @param shtTableName  表名
 * @param rowNo 行号
 * @param rowNum    插入行数
 */
function appendRow(shtTableName, rowNo, rowNum) {
    if (!rowNum) rowNum =1;
    if (!rowNo || rowNo < 0) rowNo = 0;
    var shtTable = getDataTableByName(shtTableName);
    if (!shtTable || shtTable.fixlen == 1) return;//定长表
    var tr = $('[cpctable=' + shtTableName + '][cpcrow=' + rowNo + ']').parent('tr');
    var i,newTr,shtCol;
    //1.循环插入行
    /**
    while (rowNum-- > 0) {
        newTr = tr.clone(true);
        newTr.children('td[cpctable=' + shtTableName + ']').each(function () {
            $(this).removeAttr('id').attr({
                cpcvalue: '',
                cpctext: ''
            }).html('');
        });
        tr.after(newTr);
    }
     */
    var trStr = '';
    newTr = tr.clone(true).addClass('cpcadd');
    newTr.children('td[cpctable=' + shtTableName + ']').removeAttr('id').attr({
        cpcvalue: '',
        cpctext: ''
    }).html('');
    var dd = newTr.prop('outerHTML');
    while (rowNum-- > 0) {
        trStr += dd;
    }
    tr.after(trStr);
  //  console.log(dd);

    //2.重新设定插入行后面的行号
    console.log(shtTable.getDataLength(true));
    var changeRowCount = shtTable.getDataLength(true) - rowNo - 1;
    console.log(shtTableName + ' appendRow :' + changeRowCount);
    tr.nextAll('tr:lt(' + changeRowCount + ')').each(function (index) {
        $(this).children('td[cpctable=' + shtTableName + ']').attr('cpcrow',index + rowNo + 1);
    });
}

/**
 * 代换变量中"<>"括号中的值
 * @param strSql    原字符串
 * @param isQuotedStr   是否包含''
 * @return {*}   替换后的字符串
 */
function replaceDefValue(strSql, isQuotedStr) {
    var defTmp;
    strSql = strSql.toUpperCase();
    if (strSql.indexOf('<LOGINUSER>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().userid);
        } else {
            defTmp = getLoginUser().userid;
        }
        strSql = strSql.replace(/<LOGINUSER>/g, defTmp);
    }
    if (strSql.indexOf('<LOGINUSERID>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().userid);
        } else {
            defTmp = getLoginUser().userid;
        }
        strSql = strSql.replace(/<LOGINUSERID>/g, defTmp);
    }
    if (strSql.indexOf('<TODAYTIME>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(FormatDateTime(new Date));
        } else {
            defTmp = FormatDateTime(new Date);
        }
        strSql = strSql.replace(/<TODAYTIME>/g, defTmp);
    }
    if (strSql.indexOf('<TODAY>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(FormatDate(new Date));
        } else {
            defTmp = FormatDate(new Date);
        }
        strSql = strSql.replace(/<TODAY>/g, defTmp);
    }
    if (strSql.indexOf('<LOGINORG>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().orgname);
        } else {
            defTmp = getLoginUser().orgname;
        }
        strSql = strSql.replace(/<LOGINORG>/g, defTmp);
    }
    return strSql.toLowerCase();
}

