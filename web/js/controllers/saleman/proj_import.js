/**
 * 工程项目导入
 * @since 2018-08-06
 */
HczyCommon.mainModule().controller('proj_import', function ($scope, $q, $timeout, BasemanService, Magic, BillService, AgGridService) {

    console.log('控制器 proj_import 开始');

    /**====================数据定义 开始====================*/
    /**
     * 数据
     * @type {Object}
     */
    $scope.data = {
        file: '' //文件名
    };

    /**
     * 进度
     * @type {Object}
     */
    $scope.progress = {
        min: 0,
        max: 0,
        value: 0,
        percent: 0
    };

    /**
     * 状态
     * @type {Object}
     */
    $scope.status = {
        running: false, //执行中
        pause: false, //暂停
        finished: false, //已完成
        currIndex: 0 //当前索引
    };

    /**
     * 每行的导入状态
     */
    var WAITING = 0; //等待
    var RUNNING = 1; //执行
    var SUCCEEDED = 2; //成功
    var FAILED = 3; //失败
    var importStat = [
        {
            caption: '等待中',
            color: 'orange'
        }
        , {
            caption: '导入中',
            color: 'blue'
        }
        , {
            caption: '成功',
            color: 'green'
        }
        , {
            caption: '失败',
            color: 'red'
        }
    ];

    /**
     * 统计
     * @type {Object}
     */
    $scope.count = {
        all: 0, //总数
        success: 0, //成功
        fail: 0, //失败
        remain: 0 //剩余
    };
    /**====================数据定义 结束====================*/

    /**====================表格 开始====================*/
    var fixColCount = 3;

    /**
     * 表格列定义
     * @type {Object[]}
     */
    var gridColumnDefs = [
        {
            type: '序号'
        }
        , {
            field: 'import_stat',
            headerName: '状态',
            width: 80,
            pinned: 'left',
            type: '词汇',
            cellEditorParams: {
                values: importStat.map(function () {
                    return arguments[1];
                }),
                names: importStat.map(function (e) {
                    return e.caption;
                })
            },
            cellStyle: function (params) {
                return {
                    'font-weight': 'bold', //字体加粗
                    'color': importStat[params.value].color
                };
            }
        }
        , {
            field: 'import_msg',
            headerName: '反馈信息',
            width: 300,
            pinned: 'left',
            rowDrag: true
        }
    ];

    /**
     * 表格数据
     * @type {Object[]}
     */
    var gridData = [];

    /**
     * 表格选项
     * @type {Object}
     */
    var gridOptions = {
        columnDefs: gridColumnDefs,
        rowData: gridData
    };

    AgGridService.createAgGrid('grid', gridOptions);
    /**====================表格 结束====================*/

    /**====================按钮 开始====================*/
    $scope.chooseFile = chooseFile;

    /**
     * 选择文件
     * @return {Promise}
     */
    function chooseFile() {
        return $q
            .when()
            .then(Magic.chooseFile)
            .then(function (params) {
                $scope.data.file = params.files[0].name;

                var promise = Magic.deferPromise();

                IncRequestCount();

                $.ajaxFileUpload({
                    url: "/web/scp/filesuploadexcel.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: params.element.attr('id'), //file标签的id
                    dataType: 'json',//返回数据的类型
                    data: {
                        classname: "com.ajerp.saleman.Proj",
                        funcname: "doGetImportData"
                    },
                    success: function (response, status) {
                        DecRequestCount();

                        console.log(response);
                        if (response.failure === 'true')
                            promise.reject(response.msg);
                        else
                            promise.resolve(response.data);
                    },
                    error: function (response, status, e) {
                        DecRequestCount();

                        console.log(response);
                        promise.reject(eval('(' + response.responseText + ')').msg);
                    }
                });

                return promise;
            })
            .then(function (response) {
                //设置列
                gridColumnDefs.splice(fixColCount, gridColumnDefs.length - fixColCount);
                Array.prototype.push.apply(gridColumnDefs, response.title.map(function (e) {
                    angular.extend(e, {
                        editable: function (params) {
                            return (params.node.data.import_stat == WAITING || params.node.data.import_stat == FAILED) && !$scope.status.running;
                        }
                    });
                    return e;
                }));
                gridOptions.api.setColumnDefs(gridColumnDefs);

                //设置数据
                gridData = response.proj;
                gridData.forEach(function (data) {
                    //标记等待状态
                    data.import_stat = WAITING;
                });
                gridOptions.hcApi.setRowData(gridData);

                //设置统计
                $scope.count = {
                    all: response.proj.length,
                    success: 0,
                    fail: 0,
                    remain: response.proj.length
                };

                //设置进度
                setProgress({
                    max: $scope.count.remain,
                    value: 0
                });
            }, Magic.defaultCatch);
    }

    $scope.importStart = importStart;

    /**
     * 开始导入
     */
    function importStart() {
        var refreshView = gridOptions.api.refreshView.bind(gridOptions.api);

        var waitingData = gridData.filter(function (data, index) {
            var result = data.import_stat == WAITING;

            if (result)
                data.index = index;

            return result;
        });

        if (!waitingData.length) {
            waitingData = gridData.filter(function (data, index) {
                var result = data.import_stat == FAILED;

                if (result) {
                    data.index = index;
                    data.import_stat = WAITING;
                    $scope.count.fail--;
                    $scope.count.remain++;
                }

                return result;
            });

            refreshView();

            if ($scope.count.remain)
                setProgress({
                    max: $scope.count.remain,
                    value: 0
                });
        }

        if (!waitingData.length) {
            if (gridData.length)
                Magic.swalInfo('全部数据都已导入完毕');

            return;
        }

        //标记状态
        $scope.status.running = true;
        $scope.status.pause = false;

        waitingData
            .map(function (data) {
                var startPromise = Magic.deferPromise();

                var okPromise = startPromise
                    .then(function () {
                        gridOptions.hcApi.setFocusedCell(data.index, 'import_stat');

                        //标记执行状态
                        data.import_stat = RUNNING;
                    })
                    .then(refreshView)
                    .then(requestImport.bind(null, data))
                    .then(function (responseData) {
                        angular.extend(data, responseData);

                        //标记成功状态
                        if (data.import_stat == SUCCEEDED)
                            $scope.count.success++;
                        else
                            $scope.count.fail++;
                    }, function (reason) {
                        //填写失败原因
                        if (angular.isString(reason))
                            data.import_msg = reason;
                        else if (angular.isObject(reason) && reason.id)
                            data.import_msg = reason.message;
                        else
                            data.import_msg = '未知异常';

                        //标记失败状态
                        data.import_stat = FAILED;
                        $scope.count.fail++;
                    })
                    .finally(function () {
                        //剩余数量-1
                        $scope.count.remain--;
                        //进度+1
                        $scope.progress.value++;

                        setProgress({
                            value: $scope.progress.value
                        });

                        refreshView();
                    })
                ;

                return {
                    start: startPromise,
                    ok: okPromise
                };
            })
            .forEach(function (params, index, array) {
                if (index < array.length - 1)
                    params.ok.finally(function () {
                        if ($scope.status.pause)
                            $scope.status.running = false;
                        else
                            array[index + 1].start.resolve();
                    });
                else
                    params.ok.finally(function () {
                        $scope.status.running = false;
                        $scope.status.pause = false;
                        $scope.status.finished = true;
                    });

                if (index === 0)
                    params.start.resolve();
            });
    }

    /**
     * 导入请求
     * @param {Object} data
     * @return {Promise}
     */
    function requestImport(data) {
        return BasemanService
            .RequestPost('proj', 'import', {
                projs: [angular.copy(data)]
            }, true)
            .then(function (response) {
                return response.projs[0];
            })
        ;
    }

    $scope.importPause = importPause;

    /**
     * 暂停导入
     */
    function importPause() {
        //标记状态
        $scope.status.pause = true;
    }

    $scope.test = test;

    function test() {

    }

    /**
     * 关闭窗口
     */
    $scope.btnCloseClick = BillService.closeWindow;

    /**
     * 进度
     * @return {jQuery}
     */
    /*function divProgress() {
        return $('#progress');
    }*/

    /**
     * 进度条
     * @return {jQuery}
     */
    function divProgressBar() {
        return $('#progress-bar');
    }

    /**
     * 设置进度
     * @param params
     */
    function setProgress(params) {
        //最大
        if ('max' in params) {
            $scope.progress.max = params.max;
            divProgressBar().attr('aria-valuemax', params.max);
        }

        //当前
        if ('value' in params) {
            $scope.progress.value = params.value;
            divProgressBar().attr('aria-valuenow', params.value);
        }

        //百分比
        $scope.progress.percent = $scope.progress.value * 100 / $scope.progress.max;

        if (!Magic.isInt($scope.progress.percent))
            $scope.progress.percent = $scope.progress.percent.toFixed(2);

        divProgressBar().css('width', $scope.progress.percent + '%');
    }
    /**====================按钮 结束====================*/

    /**====================初始化 开始====================*/
    IncRequestCount();
    DecRequestCount();
    /**====================初始化 结束====================*/

    console.log('控制器 proj_import 结束。$scope：', $scope);

});