/**
 * 银行开户申请-属性页 bank_account_application_prop
 * Created by zhl on 2019/2/11.
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                //数据定义
                $scope.data = {};
                $scope.data.currItem = {};

                //继承主控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //查业行政区域
                $scope.commonSearchSettingOfCpcarea = {
                    afterOk: function (result) {
                        getCurrItem().areaid = result.areaid;
                        getCurrItem().areacode = result.areacode;
                        getCurrItem().areaname = result.areaname;
                    }
                };

                //查询省、市
                $scope.chooseArea = function (name) {
                    var stop_endCity = false;
                    var prov_name = '';
                    var city_name = '';
                    var county_name = '';
                    /* Baseman Service.chooseArea({
                     title: '选择省份',
                     scope: $scope,
                     superid: 0,
                     areatype: 4
                     })*/
                    $modal.openCommonSearch({
                            title: '选择省份',
                            classId: 'scparea',
                            sqlWhere: "areatype = " + 4,
                            postData: {
                                search_flag: 1,
                                superid: 0
                            }
                        })
                        .then(function (prov) {
                            prov_name = prov.areaname ? prov.areaname : '';

                            return $modal.openCommonSearch({
                                title: '选择城市',
                                classId: 'scparea',
                                sqlWhere: "areatype = " + 5,
                                postData: {
                                    search_flag: 1,
                                    superid: prov.areaid
                                }
                            })
                            /*Baseman Service.chooseArea({
                             title: '选择城市',
                             scope: $scope,
                             superid: prov.areaid,
                             areatype: 5
                             })*/
                        })
                        .then(function (city) {
                            city_name = city.areaname ? ' ' + city.areaname : '';
                            if ('start_area' === name) {
                                stop_endCity = true;
                                $scope.data.currItem.city_id = city.areaid;
                                $scope.data.currItem.city_name = city.areaname;

                                if (city_name.length < 1)
                                    return swalApi.info('请选择城市');
                                $scope.data.currItem.start_addr = prov_name + city_name;
                            }
                            if ('arrival_area' === name) {
                                stop_endCity = true;
                                $scope.data.currItem.city_id = city.areaid;
                                $scope.data.currItem.city_name = city.areaname;

                                if (city_name.length < 1)
                                    return swalApi.info('请选择城市');
                                $scope.data.currItem.arrival_addr = prov_name + city_name;
                            }
                        })
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