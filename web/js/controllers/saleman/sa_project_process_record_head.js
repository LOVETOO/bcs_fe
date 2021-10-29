/**
 * 工程进度登记(浏览页)
 * @since 2018-05-22
 */
HczyCommon.mainModule().controller('sa_project_process_record_head', function ($scope, BasemanService, BillService) {

    var columnCompletePercent = {
        field: 'complete_percent',
        name: '项目跟进进度',
        width: 300,
        formatter: Slick.Formatters.SelectOption
    };

    /**
     * 查询项目跟进进度说明
     */
    BasemanService
        .RequestPost('crm_project', 'select_process_note', {})
        .then(function (data) {
            columnCompletePercent.options = data.crm_project_process_notes.map(function (e) {
                return {
                    value: e.value,
                    desc: e.name + (e.note ? ('：' + e.note) : '')
                }
            });
        })
        .then(function () {
            BillService.decorateHead($scope, {
                title: '项目进度更新',
                classId: 'sa_project_process_record',
                idField: 'process_record_id',
                codeField: 'process_record_code',
                detailUrl: function (id) {
                    return '/index.jsp#/saleman/sa_project_process_record_bill/' + id; // + '/' + $scope.project_id;
                },//'/index.jsp#/saleman/sa_project_process_record_bill/',
                headerColumns: [{
                    field: 'process_record_code',
                    name: '更新单号',
                    width: 120
                }, {
                    field: 'stat',
                    name: '单据状态',
                    dictcode: '.',
                    width: 80
                }, {
                    field: 'project_code',
                    name: '工程项目编码',
                    width: 160
                }, {
                    field: 'project_name',
                    name: '工程项目名称',
                    width: 300
                }, columnCompletePercent, {
                    field: 'customer_name',
                    name: '操作方',
                    width: 160
                }, {
                    field: 'sale_center_name',
                    name: '归属方',
                    width: 160
                }, {
                    field: 'project_sale_center_name',
                    name: '项目所属销售中心',
                    width: 160
                }, {
                    field: 'project_type',
                    name: '项目类型',
                    dictcode: '.',
                    width: 120
                }, {
                    field: 'project_period',
                    name: '项目当前阶段',
                    dictcode: '.',
                    width: 120
                }, {
                    field: 'city',
                    name: '工程所在城市',
                    width: 100
                }, {
                    field: 'project_address',
                    name: '工程详细地址',
                    width: 300
                }, {
                    field: 'proposer',
                    name: '申请人',
                    width: 90
                }, {
                    field: 'proposer_phone',
                    name: '联系电话',
                    width: 110
                }, {
                    field: 'manager',
                    name: '项目跟进人',
                    width: 90
                }, {
                    field: 'manager_phone',
                    name: '跟进人电话',
                    width: 110
                }]
            });
        })
        .then(function () {
            var oldEditData = $scope.editData;

            $scope.editData = function (row) {
                if (row >= 0)
                    return oldEditData(row);

                return BasemanService
                    .chooseProject({
                        scope: $scope,
                        title: '请选择需要登记进度的工程项目'
                    })
                    .then(function (project) {
                        return BasemanService.RequestPost('sa_project_process_record', 'insert', {
                            project_id: project.project_id
                        });
                    })
                    .then(function (process_record) {
                        return process_record.process_record_id;
                    })
                    .then($scope.editDataById);
            };
        });

});