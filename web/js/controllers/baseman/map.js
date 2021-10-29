

define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'promiseApi', 'async!baidu'],
    function (module, controllerApi, base_diy_page, requestApi, promiseApi) {
        'use strict';

        var controller = ['$scope', '$timeout', '$stateParams',

            function epm_map($scope, $timeout, $stateParams) {

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                $scope.map; //地图实例
                $scope.myGeo;
                $scope.myCity;
                $scope.marker;//标记
                $scope.cityName; // 当前城市名称
                $scope.ac; //一个自动完成的对象
                $scope.myValue;
                $scope.lng;
                $scope.lat;
                $scope.showInput = true;
                if ($stateParams.address != 'undefined' || $stateParams.address != undefined) {
                    $scope.address = decodeURI($stateParams.address) || '';
                }
                if ($stateParams.lng && $stateParams.lat) { // 如果传了精度和纬度 隐藏输入框 并定位到对应位置
                    $scope.showInput = false;
                    $scope.lng = $stateParams.lng;
                    $scope.lat = $stateParams.lat;
                }
                // 初始化地图
                $scope.initMap = function () {
                    promiseApi.whenTrue(function () {
                        return $('#allmap').length > 0
                    }).then(function () {
                        $('[ng-form=form]').addClass('mapContain');
                        $scope.map = new BMap.Map("allmap");
                        var point = new BMap.Point(116.331398, 39.897445);
                        $scope.map.centerAndZoom(point, 14);
                        $scope.map.enableScrollWheelZoom();
                        $scope.map.enableInertialDragging();
                        $scope.map.enableContinuousZoom();
                        $scope.myGeo = new BMap.Geocoder();
                        var size = new BMap.Size(10, 20);
                        $scope.map.addControl(new BMap.CityListControl({
                            anchor: BMAP_ANCHOR_TOP_LEFT,
                            offset: size,
                            // 切换城市之间事件
                            onChangeBefore: function () {
                            },
                            //切换城市之后事件
                            onChangeAfter: function () {
                            }
                        }));
                        $scope.myCity = new BMap.LocalCity();
                        if ($scope.showInput) {
                            $scope.ac = new BMap.Autocomplete({ //建立一个自动完成的对象
                                "input": "suggestId",
                                "location": $scope.map
                            });
                            $scope.ac.setInputValue($scope.address);
                            // $scope.getElem('suggestId').value = $scope.address;
                            $scope.ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                                var str = "";
                                var _value = e.fromitem.value;
                                var value = "";
                                if (e.fromitem.index > -1) {
                                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                                }
                                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                                value = "";
                                if (e.toitem.index > -1) {
                                    _value = e.toitem.value;
                                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                                }
                                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                                $scope.getElem("searchResultPanel").innerHTML = str;
                            });

                            $scope.ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                                var _value = e.item.value;
                                $scope.myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                                $scope.address = $scope.myValue;
                                $scope.getElem("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + $scope.myValue;

                                $scope.setPlace();
                            });
                        }

                    }).then(function () {
                        if (!$scope.showInput) { // 精度纬度定位
                            var ggPoint = new BMap.Point($scope.lng, $scope.lat);
                            $scope.marker = new BMap.Marker(ggPoint);
                            $scope.map.addOverlay($scope.marker); //添加GPS marker
                            $scope.map.centerAndZoom(ggPoint, 16);
                        } else {
                            if ($scope.address) {
                                // 有地址时 地图显示地址位置
                                $scope.changeAdd();
                            } else {
                                //没有地址市 根据ip定位到当前所在城市
                                $scope.myCity.get($scope.getcity);
                            }
                        }
                    })
                }
                $scope.initMap();
                // 地址改变时 调整地图
                $scope.changeAdd = function () {
                    var address = $scope.address || $scope.cityName;
                    $scope.myGeo.getPoint(address, function (point) {
                        if ($scope.marker) {
                            $scope.marker.remove();
                        }
                        if (point) {
                            $scope.marker = new BMap.Marker(point);
                            $scope.map.centerAndZoom(point, 16);
                            $scope.map.addOverlay($scope.marker);
                        } else {
                            console.log('没有地址')
                        }
                    }, $scope.cityName);
                }

                // 获取当前城市，如果跳转过来没有传地址 默认显示当前所在城市
                $scope.getcity = function (result) {
                    $scope.cityName = result.name;
                    $scope.map.setCenter($scope.cityName);
                }
                $scope.getElem = function (id) {
                    return document.getElementById(id);
                }
                $scope.setPlace = function () {
                    $scope.map.clearOverlays();    //清除地图上所有覆盖物
                    function myFun() {
                        if ($scope.marker) {
                            $scope.marker.remove();
                        }
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                        $scope.marker = new BMap.Marker(pp);
                        $scope.map.centerAndZoom(pp, 16);
                        $scope.map.addOverlay($scope.marker);    //添加标注
                    }
                    var local = new BMap.LocalSearch($scope.map, { //智能搜索
                        onSearchComplete: myFun
                    });
                    local.search($scope.myValue);
                }
            }]



        //加载控制器
        return controllerApi.controller({
            controller: controller,
            module: module
        });
    });