/**
 * 工程预订单(编辑页)
 * @since 2018-05-14
 */
HczyCommon.mainModule().controller('sa_proj_pre_order_bill', function ($scope, $stateParams, $q, BasemanService, SlickGridService, BillService, Magic, FormValidatorService) {

    $scope.head = {};
    head()[idField()] = parseInt($stateParams.id);

    /**
     * 头部对象
     * @return {Object}
     */
    function head() {
        return $scope.head;
    }

    /**
     * 头部业务类名
     * @return {string}
     */
    function classId() {
        return 'sa_out_bill_head';
    }

    /**
     * 头部主键名
     * @return {string}
     */
    function idField() {
        return 'sa_out_bill_head_id';
    }

    /**
     * 头部主键值
     * @return {number}
     */
    function id() {
        return head()[idField()];
    }

    /*/!**
     * 流程模板ID
     * @return {number}
     *!/
    function wfTempId() {
        return head().wftempid;
    }

    /!**
     * 流程实例ID
     * @return {number}
     *!/
    function wfId() {
        return head().wfid;
    }*/

    /**
     * 查询请求
     * @return {Promise}
     */
    function doSelect() {
        if (!id()) {
            var reason = '未指定主键';
            BasemanService.swal('查询数据失败', reason);
            return $q.reject(reason);
        }

        var postData = {};
        postData[idField()] = id();

        return BasemanService.RequestPost(classId(), 'select', postData);
    }

    window.currScope = $scope; //暴露这个作用域，才能被流程窗口访问到
    $scope.selectCurrenItem = refreshData; //暴露这个方法给流程窗口进行调用刷新
    //$scope.refreshData = refreshData;

    /**
     * 刷新数据
     * @return {Promise}
     */
    function refreshData() {
        return doSelect().then(setData);
    }

    /**
     * 设置数据
     * @param data
     * @return {data}
     */
    function setData(data) {
        $scope.head = data;
        if (!$scope.data) $scope.data = {};
        $scope.data.currItem = data;

        if (!canSave()) {
            productGrid.setColumns(productColumns.filter(function (column) {
                return column.name !== '操作';
            }));
        }

        angular.forEach({
            sa_out_bill_lineofsa_out_bill_heads: productGrid
        }, function (grid, dataRelation) {
            if (!data[dataRelation])
                data[dataRelation] = [];

            SlickGridService.setData({
                grid: grid,
                data: data[dataRelation]
            });
        });

        return data;
    }

    $scope.canSave = canSave;

    /**
     * 允许保存
     * @return {boolean}
     */
    function canSave() {
        return head().stat <= 1;
    }

    /**
     * 保存请求
     * @return {Promise}
     */
    function doSave() {
        var action = id() ? 'update' : 'insert';

        var postData = JSON.stringify(head());

        return BasemanService.RequestPost(classId(), action, postData);
    }

    $scope.saveData = saveData;

    /**
     * 保存数据
     * @return {Promise}
     */
    function saveData() {
        return $q
            .when({
                parent: '#headForm'
            })
            .then(FormValidatorService.emptyMsg)
            .then(function (msg) {
                if (!productGrid.getDataLength())
                    msg.push('产品表格');

                return msg;
            })
            .then(function (msg) {
                if (msg.length) {
                    FormValidatorService.noEmptyAlert(msg);
                    return $q.reject(msg);
                }
            })
            .then(doSave)
            .then(setData)
            .then(function (data) {
                BasemanService.swalSuccess('', '保存成功');
                return data;
            });
    }

    $scope.saveAndSubmit = saveAndSubmit;

    /**
     * 保存并提交
     * @return {Promise}
     */
    function saveAndSubmit() {
        return saveData().then($scope.hcWf().submitWf);
    }

    $scope.closeWindow = BillService.closeWindow;

    $scope.chooseSaleCenter = chooseSaleCenter;

    /**
     * 选择销售中心
     * @return {Promise}
     */
    function chooseSaleCenter() {
        return BasemanService
            .chooseSaleCenter({
                scope: $scope
            })
            .then(function (data) {
                head().sale_center_id = data.dept_id;
                head().sale_center_code = data.dept_code;
                head().sale_center_name = data.dept_name;
            });
    }

    $scope.chooseCustomer = chooseCustomer;

    /**
     * 选择运营中心
     * @return {Promise}
     */
    function chooseCustomer() {
        return BasemanService
            .chooseCustomer({
                scope: $scope
            })
            .then(function (data) {
                [
                    'customer_id',
                    'customer_code',
                    'customer_name'
                ]
                    .forEach(function (key) {
                        head()[key] = data[key];
                    });
            });
    }

    $scope.chooseProject = chooseProject;

    /**
     * 选择工程项目
     * @return {Promise}
     */
    function chooseProject() {
        if (!head().customer_name) {
            return Magic
                .swalInfo('请先选择客户')
                .then($q.reject);
        }

        return BasemanService
            .chooseProject({
                scope: $scope,
                sqlWhere: 'customer_id = ' + head().customer_id
            })
            .then(function (data) {
                [
                    'project_id',
                    'project_code',
                    'project_name'
                ]
                    .forEach(function (key) {
                        head()[key] = data[key];
                    });
            });
    }

    /**
     * 正在编辑的产品
     * @return {Object}
     */
    function product() {
        return $scope.product;
    }

    /**
     * 表格操作按钮
     * @return {string}
     */
    function gridButton() {
        return '<button class="btn btn-sm btn-info dropdown-toggle viewbtn"' +
            ' style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">编辑</button>' +
            '<button class="btn btn-sm btn-info dropdown-toggle delbtn"' +
            ' style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
    }

    /**
     * 产品表格的列
     * @type {Array}
     */
    var productColumns = [{
        field: 'seq',
        name: '序号',
        width: 48
    }, {
        name: '操作',
        width: 82,
        formatter: gridButton
    }, {
        field: 'item_code',
        name: '产品编码',
        width: 110
    }, {
        field: 'item_name',
        name: '产品名称',
        width: 240
    }, {
        field: 'uom',
        name: '计量单位',
        width: 80
    }, {
        field: 'qty_bill',
        name: '预订数量',
        width: 80
    }, {
        field: 'expect_deliver_date',
        name: '期望交货日期',
        width: 100,
        formatter: Slick.Formatters.Date
    }, {
        field: 'note',
        name: '备注',
        width: 200
    }];

    /**
     * 产品表格的选项
     * @type {Object}
     */
    var productOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 产品表格
     * @type {Slick.Grid}
     */
    var productGrid = new Slick.Grid('#productGrid', [], productColumns, productOptions);

    //绑定产品表格的单击事件
    productGrid.onClick.subscribe(productGridClick);
    //绑定产品表格的双击事件
    productGrid.onDblClick.subscribe(productGridDblClick);

    /**
     * 产品表格单击事件
     * @param e 事件
     * @param args 参数
     */
    function productGridClick(e, args) {
        var jqTarget = $(e.target);

        var stop = true;

        if (jqTarget.hasClass("viewbtn")) {
            editProduct(args.row);
        }
        else if (jqTarget.hasClass("delbtn")) {
            deleteProduct(args.row);
        }
        else
            stop = false;

        if (stop) e.stopImmediatePropagation();
    }

    /**
     * 产品表格双击事件
     * @param e 事件
     * @param args 参数
     */
    function productGridDblClick(e, args) {
        editProduct(args.row);
        e.stopImmediatePropagation();
    }

    /**
     * 产品模态窗口
     * @return {jQuery}
     */
    function productModal() {
        return $('#productModal');
    }

    $scope.chooseItem = chooseItem;

    /**
     * 选择产品
     * @return {Promise}
     */
    function chooseItem() {
        return BasemanService
            .chooseItem({
                scope: $scope
            })
            .then(function (data) {
                [
                    'item_id',
                    'item_code',
                    'item_name',
                    'uom_id',
                    'uom_code',
                    'uom_name'
                ]
                    .forEach(function (key) {
                        product()[key] = data[key];
                    });

                product().uom = data.uom_name
            });
    }

    $scope.chooseUom = chooseUom;

    /**
     * 选择计量单位
     * @return {Promise}
     */
    function chooseUom() {
        return BasemanService
            .chooseUom({
                scope: $scope
            })
            .then(function (data) {
                [
                    'uom_id',
                    'uom_code'
                ]
                    .forEach(function (key) {
                        product()[key] = data[key];
                    });

                product().uom = data.uom_name
            });
    }

    $scope.editProduct = editProduct;

    /**
     * 编辑产品
     * @param row 行
     */
    function editProduct(row) {
        if (row >= 0) {
            $scope.product = angular.copy(productGrid.getData()[row]);
        }
        else {
            $scope.product = {};
        }

        productModal().modal();
    }

    $scope.saveProduct = saveProduct;

    /**
     * 保存产品
     * @return {Promise}
     */
    function saveProduct() {
        return FormValidatorService.noEmptyCheck({
            parent: productModal()
        }).then(function () {
            var data = productGrid.getData();
            if (product().seq) {
                data[product().seq - 1] = product();
            }
            else {
                data.push(product());
            }

            SlickGridService.setData({
                grid: productGrid,
                data: data
            });

            productModal().modal('hide');
        });
    }

    /**
     * 删除产品
     * @param row 行
     */
    function deleteProduct(row) {
        SlickGridService.setData({
            grid: productGrid,
            type: 'splice',
            index: row,
            deleteCount: 1
        });
    }

    //有ID的话
    if (id()) {
        refreshData(); //刷新
    }
    else {
        setData({
            stat: 1,
            wfid: 0,
            wfflag: 0,

            bill_type: 3, //工程预订单
            book_date: Magic.today(),

            /*----------未知属性----------*/
            date_invbill: Magic.now(),
            bluered: 'B'
        });
    }

});