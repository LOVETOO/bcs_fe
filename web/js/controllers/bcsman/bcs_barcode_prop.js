/**
 * 客户单据详情
 * @since 2019-12-06
 * 巫奕海
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {


        var controller = [
            '$scope',
            function ($scope) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //下发按钮及操作
                $scope.footerLeftButtons.loweHair = {
                    title: '下发',
                    click: function () {
                        if ($scope.data.currItem.quantity == "") {
                            swalApi.info("请输入生成数量")
                        } else {
                            requestApi.post({
                                classId: "bcs_barcode_lots",
                                data: {
                                    bclotsid: $scope.data.currItem.bclotsid,
                                    stats: $scope.data.currItem.stats,
                                    code: $scope.data.currItem.code,
                                    barcode_type: $scope.data.currItem.barcode_type,
                                    brand: $scope.data.currItem.brand,
                                    factbase: $scope.data.currItem.factbase,
                                    quantity: $scope.data.currItem.quantity
                                },
                                action: "lowehair"
                            }).then(function () {
                                swalApi.info("下发成功")
                                $scope.data.currItem.isLoweHair = false;
                                $scope.data.currItem.isDownLoad = false;
                                $scope.data.currItem.for_print = "Y"
                                $scope.data.currItem.status == "running"
                            },function(data){
                                console.log(data)   
                            })
                        }
                    },
                    hide: function () {
                        return !$scope.data.currItem.isLoweHair || !$scope.form.editing
                    }
                };

 
                //下载按钮及操作
                $scope.footerLeftButtons.downLoad = {
                    title: '下载',
                    click: function () {
                        requestApi.post({
                            classId: "bcs_barcode_lots",
                            data: { 
                                bclotsid: $scope.data.currItem.bclotsid
                            },
                            action: "downloads"
                        }).then(function (data) {
                            var a = $('<a></a>');
                            a.attr('href', "../"+data.absolute_path + "/" + data.filename);
                            a.prop('download', data.filename);
                            a.get(0).click();
                        })
                    },
                    hide: function () {
                        return !$scope.data.currItem.isDownLoad || !$scope.form.editing;
                    }
                };

                //打开新增页面时执行的方法,可以用于初始化值
                $scope.newBizData = function (bizData) {
                    //数据初始化
                    $scope.data.currItem.enabled='Y';
                    $scope.data.currItem.status="create";
                    $scope.data.currItem.for_print='N';
                    $scope.data.currItem.createid=userbean.userid;
                    $scope.data.currItem.isLoweHair = false;
                    $scope.hcSuper.newBizData(bizData);
                };

                //设置数据
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    if (bizData.status == "create") {
                        $scope.data.currItem.isLoweHair = true
                        $scope.data.currItem.isDownLoad = false;
                    } else if(bizData.status == "completed"){
                        $scope.data.currItem.isLoweHair = false
                        $scope.data.currItem.isDownLoad = true;
                    } else{
                        $scope.data.currItem.isLoweHair = false
                        $scope.data.currItem.isDownLoad = false;
                    }
                }
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });