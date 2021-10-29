define(
    ['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'numberApi', 'fileApi', 'swalApi', 'iconApi'],
    function (module, controllerApi, base_obj_prop, angular, requestApi, numberApi, fileApi, swalApi, iconApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                //定义数据
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.bool = false;

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //增加标签页
                /* $scope.tabs.other = {
                    title: '其他'
                }; */

                /**
                 * 新增时对业务对象的处理
                 * @param bizData 新增时的数据
                 * @override
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.menutype = 2;
                    bizData.clas = 2;
                    bizData.flag = 2;

                    bizData.modid = numberApi.toNumber($stateParams.modid);
                    bizData.menupid = numberApi.toNumber($stateParams.menuid);
                    bizData.parentidpath = $stateParams.menuidpath;

                    if ($stateParams.menuname) {
                        bizData.menucode = $stateParams.menuname;
                        bizData.menuname = $stateParams.menuname;
                    }

                    if ($stateParams.webrefaddr)
                        bizData.webrefaddr = $stateParams.webrefaddr;

                    requestApi
                        .post({
                            classId: 'scpmod',
                            action: 'select',
                            data: {
                                modid: bizData.modid
                            }
                        })
                        .then(function (mod) {
                            bizData.modpath = mod.modpath;
                        });

                    if (bizData.menupid)
                        requestApi
                            .post({
                                classId: 'scpmenu',
                                action: 'select',
                                data: {
                                    menuid: bizData.menupid
                                }
                            })
                            .then(function (menu) {
                                bizData.parentmenupath = menu.menupath;
                            });

                    bizData.sysbuiltinobj = 1;
                    bizData.usemenupass = 1;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //显示图片
                    if (bizData.docid == "0") {
                        $(".invoice_div_img").css("height", "0");
                        $scope.data.bool = false;
                    } else {
                        $(".invoice_div_img").css("height", "98px");
                        $scope.data.bool = true;
                    }

                }
                //保存数据
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                }

                /**
                 * 下拉值
                 */
                $scope.selectOptions = {
                    /**
                     * 类型
                     */
                    clas: [
                        { name: '系统内建', value: 1 },
                        { name: '自定义', value: 2 },
                        { name: '外部程序', value: 3 },
                        { name: '动态链接库', value: 4 },
                        { name: '动态运行包', value: 5 },
                        { name: '外部网页', value: 6 },
                        { name: 'CPCWeb', value: 7 }
                    ],
                    /**
                     * 客户端类型
                     */
                    menutype: [
                        { name: '客户端', value: 1 },
                        { name: 'WEB', value: 2 },
                        { name: '客户端&WEB', value: 3 }
                    ]
                };

                //上传图片
                $scope.uploadFile = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (docs) {
                        if(docs[0].oldsize/1024/1024 >1){
                            swalApi.error('图标大小不能超过1M，请重新上传');
                            return;
                        }
                        $scope.data.currItem.docid = docs[0].docid;
                        console.log($scope.data.currItem.docid)
                        $(".invoice_div_img").css("height", "98px");
                        $(".invoice_div_img").css("display", "block");
                        $scope.data.bool = true;
                    });
                }
                $scope.chooseIcon = function () {
                    iconApi.chooseIcon().then(function (icon) {
                        $scope.data.currItem.imgsrc = icon.class;
                    })
                }
                //移除图片
                $scope.del_invoice_image = function () {
                    $scope.data.currItem.docid = undefined;
                    $(".invoice_div_img").css("display", "none");
                    $scope.data.bool = false;
                }

                /**
                 * 通用查询
                 */
                $scope.commonSearch = {
                    //所属模块
                    mod: {
                        postData: {
                            modpid: -2 //找非顶层模块
                        },
                        afterOk: function (mod) {
                            $scope.data.currItem.modid = mod.modid;
                            $scope.data.currItem.modpath = mod.modpath;
                            $scope.data.currItem.menupid = 0;
                            $scope.data.currItem.parentmenupath = '';
                        }
                    },
                    //父菜单
                    parentMenu: {
                        postData: function () {
                            return {
                                modid: $scope.$eval('data.currItem.modid'),
                                menupid: -1 //找顶层菜单
                            };
                        },
                        afterOk: function (menu) {
                            $scope.data.currItem.modid = menu.modid;
                            $scope.data.currItem.modpath = menu.modpath;
                            $scope.data.currItem.menupid = menu.menuid;
                            $scope.data.currItem.parentmenupath = menu.menupath;
                        }
                    }
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);