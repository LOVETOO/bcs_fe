var basemanControllers = angular.module('inspinia');
function base_tech_para_conf($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_tech_para_conf",
        key: "conf_id",
        nextStat: "base_tech_para_confEdit",
        classids: "base_tech_para_confs",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="技术参数维护";
    base_tech_para_conf = HczyCommon.extend(base_tech_para_conf,ctrl_view_public);
    base_tech_para_conf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "参数类型", field: "para_type", editable: false, filter: 'set', width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 0, desc: '制冷量'}, {value: 1, desc: '制热量'}, {
                    value: 2,
                    desc: '标配面板'
                }, {value: 3, desc: '塑壳'}, {value: 4, desc: '认证'}, {value: 5, desc: '内机风量'}, {
                    value: 6,
                    desc: '工况'
                }, {value: 7, desc: '冷媒'}, {value: 8, desc: '能效等级'}, {value: 9, desc: '单冷/冷暖'}, {
                    value: 10,
                    desc: '制冷能力'
                }, {
                    value: 11,
                    desc: '内外机噪音'
                }, {value: 12, desc: 'EER'}, {
                    value: 13,
                    desc: 'COP'
                }]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "参数ID", field: "para_id",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "参数值", field: "para_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellRenderer:"链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('base_tech_para_conf',base_tech_para_conf);

