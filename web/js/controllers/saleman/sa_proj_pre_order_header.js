/**
 * 工程预订单(浏览页)
 * @since 2018-05-14
 */
HczyCommon.mainModule().controller('sa_proj_pre_order_header', function ($scope, BillService) {

    BillService.decorateHead($scope, {
        title: '工程预订单',
        classId: 'sa_out_bill_head',
        idField: 'sa_out_bill_head_id',
        codeField: 'sa_salebillno',
        detailUrl: '/index.jsp#/saleman/sa_proj_pre_order_bill/',
        searchObj: function () {
            return {
                search_flag: 1
            };
        },
        headerColumns: [{
            field: 'sa_salebillno',
            name: '订单编号',
            width: 120
        }, {
            field: 'stat',
            name: '单据状态',
            dictcode: '.',
            width: 80
        }, {
            field: 'sale_center_name',
            name: '销售渠道中心',
            width: 160
        }, {
            field: 'customer_name',
            name: '运营中心',
            width: 120
        }, {
            field: 'project_code',
            name: '工程项目编码',
            width: 160
        }, {
            field: 'project_name',
            name: '工程项目名称',
            width: 300
        }, {
            field: 'book_date',
            name: '预订日期',
            width: 160
        }]
    });
    
});