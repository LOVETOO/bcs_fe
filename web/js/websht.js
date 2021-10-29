/**
 * Created by LIN on 2017/1/19.
 * 表单相关的类定义
 */

function CPCUserSht() {

}

CPCUserSht.prototype = CPCObject.define({
    objClass:'cpcusersht',
    objType:6,
    objName:'流程模板',
    objRelations:{
        'cpcshttableofcpcusershts': CPCShtTable,
        'cpcshtvaluesofcpcusershts': CPCShtValues,
        'cpcshtcheckofcpcusershts': CPCShtCheck
    }}, CPCUserSht);

function CPCShtIns() {

}

CPCShtIns.prototype = CPCObject.define({
    objClass:'cpcshtins',
    objType:6,
    objName:'流程模板',
    objRelations:{
        cpcshtinss: CPCShtIns,
        shtcolofshtinss: CPCShtCol
    }
},CPCShtIns);

function CPCShtValues() {

}

CPCShtValues.prototype = CPCObject.define({
    objClass:'cpcshtvalues',
    objType:6,
    objName:'表单变量定义',
    objRelations:{
    }
},CPCShtValues);

function CPCShtCheck() {

}

CPCShtCheck.prototype = CPCObject.define({
    objClass:'cpcshtcheck',
    objName:'表单审核定义',
    objRelations:{
    }
},CPCShtCheck);

function CPCShtTable() {

}

CPCShtTable.prototype = CPCObject.define({
    objClass:'cpcshttable',
    objType:6,
    objName:'表单数据表定义',
    objRelations:{
        cpcshtcolofcpcshttables: CPCShtCol
    }
},CPCShtCol);

function CPCShtCol() {

}

/**
 * 表单颜色
 */
CPCShtCol.cellColors = [];
CPCShtCol.cellColors[0] = 'black';
CPCShtCol.cellColors[8] = 'maroon';
CPCShtCol.cellColors[9] = 'green';
CPCShtCol.cellColors[11] = 'olive';
CPCShtCol.cellColors[10] = 'navy';
CPCShtCol.cellColors[12] = 'purple';
CPCShtCol.cellColors[13] = 'teal';
CPCShtCol.cellColors[15] = 'gray';
CPCShtCol.cellColors[14] = 'silver';
CPCShtCol.cellColors[2] = 'red';
CPCShtCol.cellColors[3] = 'lime';
CPCShtCol.cellColors[5] = 'yellow';
CPCShtCol.cellColors[4] = 'blue';
CPCShtCol.cellColors[6] = 'fuchsia';
CPCShtCol.cellColors[7] = 'aqua';
CPCShtCol.cellColors[57] = 'white';

CPCShtCol.prototype = CPCObject.define({
    //objClass:'cpcusercol',
    objClass:'cpcshtcol',
    objType:6,
    objName:'表单数据表字段定义',
    objRelations:[]
});

function CPCObjInfo() {

}

CPCObjInfo.prototype = CPCObject.define({
    objClass:'cpcobjinfo',
    objType:6,
    objName:'对象信息',
    objRelations:{
        cpcobjinfos: CPCObjInfo
    }
},CPCObjInfo);

function CPCWfTemp() {
    
}

CPCWfTemp.prototype = CPCObject.define({
    objClass:'cpcwftemp',
    objType:6,
    objName:'流程模板',
    objRelations:{
        cpcwftemps: CPCWfTemp
    }
},CPCWfTemp);

function CPCWorkSpace() {

}

CPCWorkSpace.prototype = CPCObject.define({
    objClass:'cpcworkspace',
    objType:0,
    objName:'工作区',
    objRelations:{
        orgoforgs: CPCOrg
    }
},CPCWorkSpace);

function CPCOrg() {

}

CPCOrg.prototype = CPCObject.define({
    objClass:'cpcworkspace',
    objType:12,
    objName:'工作区',
    objRelations:{
        orgoforgs: CPCOrg,
        useroforgs:CPCUser
    }
},CPCOrg);

function CPCUser() {
    
}

CPCUser.prototype = CPCObject.define({
    objClass:'cpcworkspace',
    objType:13,
    objName:'工作区',
    objRelations:{}
},CPCUser);
