define(['data_map'], function (datamap) {
/**
 * @qqw 2016.5.18
 */
var FrmInfo = new Object();
/*************基础数据************/
var scporg = {
    title: "部门",
    is_high: true,
    thead: [{
        name: "机构编码",
        code: "code",
        show: true,
        iscond: true,
        type: 'string'

    }, {
        name: "机构名称",
        code: "orgname",
        show: true,
        iscond: true,
        type: 'string'

    }, {
        name: "负责人",
        code: "manager",
        show: true,
        iscond: true,
        type: 'string'


    }, {
        name: "备注",
        code: "note",
        show: true,
        iscond: true,
        type: 'string'
    }]
};
var scpuser = {
    title: "用户",
    is_high: true,
    thead: [{
        name: "用户编码",
        code: "userid"
    }, {
        name: "用户名称",
        code: "username"
    }, {
        name: "机构路径",
        code: "namepath"
    }]
};
var customer = {
    title: "客户",
    is_high: true,
    thead: [{
        name: "客户编码",
        code: "cust_code",
        show: true,
        iscond: true,
        type: 'string'

    }, {
        name: "SAP编码",
        code: "sap_code",
        show: true,
        iscond: true,
        type: 'string'

    }, {
        name: "客户名称",
        code: "cust_name",
        show: true,
        iscond: true,
        type: 'string'

    }, {
        name: "客户描述",
        code: "cust_desc",
        show: true,
        iscond: true,
        type: 'string'
    }]
};
var scparea = {
    title: "区域",
    is_high: true,
    thead: [
        {
            name: "区域编码",
            code: "areacode",
            show: true, iscond: true, type: 'string'
        },
        {
            name: "区域名称",
            code: "areaname",
            show: true, iscond: true, type: 'string'
        },
        {
            name: "助记码",
            code: "assistcode",
            show: true, iscond: true, type: 'string'
        },
        {
            name: "电话区域",
            code: "telzone",
            show: true, iscond: true, type: 'string'
        }, {
            name: "备注",
            code: "note",
            show: true, iscond: true, type: 'string'
        }],
};
var base_currency_frminfo = {
    title: "币种",
    is_high: true,
    thead: [
        {
            name: "货币编码",
            code: "currency_code",
            show: true,
            iscond: true,
            type: 'string'
        }, {
            name: "货币名称",
            code: "currency_name",
            show: true,
            iscond: true,
            type: 'string'
        }, {
            name: "币符",
            code: "currency_symbol",
            show: true,
            iscond: true,
            type: 'string'
        }],
};
var uom_frminfo = {
    title: "计量单位",
    is_high: true,
    thead: [
        {
            name: "单位编码",
            code: "uom_code",
            show: true,
            iscond: true,
            type: 'string'
        }, {
            name: "单位名称",
            code: "uom_name",
            show: true,
            iscond: true,
            type: 'string'
        }]
};

});