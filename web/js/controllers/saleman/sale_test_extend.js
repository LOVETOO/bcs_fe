var billmanControllers = angular.module('inspinia');
function sale_test_extend($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //�̳л��෽��
    sale_test_extend = HczyCommon.extend(sale_test_extend, ctrl_bill_public);
    sale_test_extend.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    


}

//���ؿ�����
billmanControllers
    .controller('sale_test_extend', sale_test_extend)
	
	
	$scope.view_columns = [
                {
                    headerName: "���",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left",
                    width: 60,
                    checkboxSelection: function (params) {
                        return params.columnApi.getRowGroupColumns().length == 0
                    },
                }, {
                    headerName: "״̬",
                    field: "stat",
                    editable: false,
                    filter: 'set',
                    cellEditor: "������",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 60,
                    cellEditorParams: {
                        values: [],
                    },
                }, {
                    headerName: "���뵥��",
                    field: "price_apply_no",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120,
                }, {
                    headerName: "�����ͺű���",
                    field: "item_code",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 125,
                }, {
                    headerName: "�����ͺ�",
                    field: "item_name",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 220
                }, {
                    headerName: "��ʼ����",
                    field: "start_date",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "��������",
                    field: "end_date",
                    editable: false,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                },  {
                    headerName: "������׼�����(��Բ)",
                    field: "base_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "�ı���",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 130
                }];

        }
    }



        //Item_Code
        $scope.Item_Code = function () {
            $scope.FrmInfo = {
                classid: "pro_item_header",
                postdata: {},
                sqlBlock: " usable=2 ",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                if (result.item_h_id == undefined) {
                    return;
                }
                $scope.data.currItem.item_id = result.item_h_id;
                $scope.data.currItem.item_code = result.item_h_code;
                $scope.data.currItem.item_name = result.item_h_name;
            });
        }
    