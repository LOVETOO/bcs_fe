/**
 * 巫奕海
 * 2019-12-24.
 * 防伪防窜界面
 */
define(
    ['module', 'controllerApi', 'base_diy_page', '$q', 'requestApi', 'swalApi', 'directive/hcTab', 'async!baidu'],
    function (module, controllerApi, base_diy_page, $q, requestApi, swalApi) {

        var AntiCounterfeiting = [
            '$scope', function ($scope) {

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                //定义全局变量
                $scope.data = {
                    currItem: {
                        inners: 0,
                        outs: 0,
                        barcode: '',
                        flag: 1,
                        //初始化运行中心数组
                        operations: []
                    }
                };
                var map = new BMap.Map("aounterfeiting");
                var point;
                var provinces = [];
                //选择区域
                $scope.gridOptions = {

                    hcEvents: {
                        cellFocused: function (param) {
                            $scope.data.currItem.operat_center_org_name = $scope.data.currItem.operations[param.rowIndex] && $scope.data.currItem.operations[param.rowIndex].operat_center_org_name;
                            var citys = $scope.data.currItem.operations[param.rowIndex] && $scope.data.currItem.operations[param.rowIndex].arealines;
                            provinces = { citys: citys, color: "#C8C1E3" };
                            /**给选中的运营中心对应的省份，渲染图层 */
                            render(provinces);
                            /**当开始时间和结束时间都有的时候就点击单元格就进行查询*/
                            if ($scope.data.currItem.begintime != "" && $scope.data.currItem.begintime != undefined
                                && $scope.data.currItem.endtime != "" && $scope.data.currItem.endtime != undefined) {
                                $scope.selectOptionLines();
                            }

                        }
                    },
                    columnDefs: [
                        {
                            field: 'operat_center_org_name',
                            headerName: '运营中心',
                            suppressAutoSize: true,
                            suppressSizeToFit: true,
                            width: 250,
                            cellStyle: {
                                'text-align': 'center'
                            }
                        },
                    ]
                };
                //通过时间查找条码的销售区域以及，被查询次数，获取区域内和区域外的数据
                $scope.selectOptionLines = function () {
                    // if($scope.data.currItem.flag == "是"){
                    //     $scope.data.currItem.flag = 2;
                    // }else if($scope.data.currItem.flag == "否"){
                    //     $scope.data.currItem.flag = 1;
                    // }
                    /**用时间和id精准查询 */
                    if ($scope.data.currItem.begintime == '' || $scope.data.currItem.begintime == undefined) {
                        swalApi.info("请输入开始时间！")
                        return;
                    }
                    if ($scope.data.currItem.endtime == '' || $scope.data.currItem.endtime == undefined) {
                        swalApi.info("请输入结束时间！")
                        return;
                    }
                    var node = $scope.gridOptions.hcApi.getFocusedData();
                    var postDatas = {
                        begin_time: $scope.data.currItem.begintime,
                        end_time: $scope.data.currItem.endtime,
                        operat_center_org_id: node.operat_center_org_id,
                        jurisdiction_id: node.jurisdiction_id,
                        flag: $scope.data.currItem.flag,
                        short_barcode: $scope.data.currItem.barcode
                    };
                    var citys = []; 
                    if (node) {
                        citys = node.arealines;
                    }
                    requestApi.post({
                        classId: "bcs_search_log",
                        action: "selectoptionlines",
                        data: postDatas
                    })
                        .then(function (data) {
                            provinces = { citys: citys, color: "#C8C1E3" };
                            /**获取销售区域内和销售区域外查询的次数 */
                            $scope.data.currItem.inners = data.innercount;
                            $scope.data.currItem.outs = data.outcount;
                            var arounds = data.arounds.filter(function (res) {
                                return res.lat != "" && res.lng != "" && res.address != "";
                            });
                            /**在销售区域外添加新的标注之前先清除之前的标注 */
                            map.clearOverlays();
                            /**把显示的运行中心的位置添加覆盖物 */
                            render(provinces);
                            arounds && arounds.forEach(item => {
                                /**获取经纬度 */
                                $scope.data.currItem.lng = item.lng;
                                $scope.data.currItem.lat = item.lat;
                                /**设置是否在销售区域内 */
                                //$scope.data.currItem.flag = item.flag;
                                let flag = item.flag;
                                if ($scope.data.currItem.lng != '' && $scope.data.currItem.lat != ''
                                    && $scope.data.currItem.outs > 0 && flag == "否") {
                                    $scope.data.currItem.short_barcode = item.short_barcode;
                                    $scope.data.currItem.creation_date = item.creation_date;
                                    $scope.data.currItem.address = item.address;
                                    /**为每个区域外的查询地址添加标注 */
                                    theLocation($scope.data.currItem.lng, $scope.data.currItem.lat);
                                }
                            })
                            /**返回的数组长度就是查询过的次数 */
                            $scope.data.currItem.counts = arounds.length;
                            var aroundFilted = arounds.filter(function (filters) {
                                return filters.creation_date != "";
                            })
                            $scope.listOptions.hcApi.setRowData(aroundFilted);
                        })

                }
                //列表模式
                $scope.listOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'short_barcode',
                        headerName: '条码',
                    }, {
                        field: 'address',
                        headerName: '查询地址',
                    }, {
                        field: 'consigneeid',
                        headerName: '客户编码',
                    }, {
                        field: 'consigneename',
                        headerName: '客户名称',
                    }, {
                        field: 'creation_date',
                        headerName: '查询时间',
                        type: 'date'
                    }, {
                        field: 'flag',
                        headerName: '在销售区域内查询',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }]
                }

                //描边定义
                function render(province, data) {
                    //清除覆盖物
                    map.clearOverlays();
                    //获取当前区域
                    // theLocation($scope.data.currItem.lng, $scope.data.currItem.lat)
                    var plys = [];
                    var bdary = new BMap.Boundary();
                    var arrs = [];
                    IncRequestCount('post');
                    function getCity(city) {
                        var defer = $q.defer();
                        bdary.get(city.areaname, function (rs) {//获取省份描边点
                            var count = rs.boundaries.length;
                            //建立多边形覆盖物
                            for (var i = 0; i < count; i++) {
                                var ply = new BMap.Polygon(rs.boundaries[i], {
                                    strokeWeight: 1,
                                    strokeOpacity: 1,//描边透明度
                                    StrokeStyle: "dashed",//描边实线
                                    strokeColor: "#dc3545",//描边颜色
                                    fillColor: province.color,//填充颜色
                                    fillOpacity: 0.6,//填充透明度
                                });
                                plys.push(ply);

                            }
                            defer.resolve();
                        })
                        return defer.promise;
                    }
                    province.citys.forEach((function (city) {
                        arrs.push(getCity(city));
                    }));
                    $q.all(arrs).then(function () {
                        plys.forEach(function (ply) {
                            map.addOverlay(ply);  //添加覆盖物
                        });
                        DecRequestCount();
                    })

                }

                //判断是否在区域内
                function isInner(data, plys) {
                    $scope.data.currItem.inners = 0;
                    $scope.data.currItem.outs = 0;
                    data.forEach(function (e, index) {
                        for (var i = 0; i < plys.length; i++) {
                            var loca = new BMap.Point(e.lng, e.lat);
                            if (BMapLib.GeoUtils.isPointInPolygon(loca, plys[i])) {
                                data[index].flag = 2
                                $scope.data.currItem.inners = $scope.data.currItem.inners + 1
                            }
                        }
                    });
                    /**查询出的总数据长度减去销售区域内的就是销售区域外的 */
                    $scope.data.currItem.outs = data.length - $scope.data.currItem.inners;
                    // $scope.$apply();
                }

                //将当前地点注入地图
                function theLocation(lng, lat) {
                    if (lng != "" && lat != "") {
                        // map.clearOverlays();
                        var new_point = new BMap.Point(lng, lat);
                        var marker = new BMap.Marker(new_point);  // 创建标注    
                        map.addOverlay(marker);              // 将标注添加到地图中
                        map.panTo(new_point);

                        // 百度地图API功能
                        var opts = {
                            width: 150,     // 信息窗口宽度
                            height: 80,     // 信息窗口高度
                            title: "查询信息", // 信息窗口标题
                            enableMessage: true,//设置允许信息窗发送短息
                            // message: "条码：" + $scope.data.currItem.short_barcode + "\n"  //设置信息内容
                            //     + "查询时间：" + $scope.data.currItem.creation_date
                        }
                        var infoWindow = new BMap.InfoWindow(
                            "条码：" + $scope.data.currItem.short_barcode + "<br/>"
                            + "查询时间：" + $scope.data.currItem.creation_date + "<br/>"
                            + "查询地址：" + $scope.data.currItem.address,
                            opts);  // 创建信息窗口对象 
                        marker.addEventListener("click", function () {
                            map.openInfoWindow(infoWindow, new_point); //开启信息窗口
                        });
                    }
                }

                //tab签
                $scope.kpi_tab = {
                    map: {
                        title: "地图模式",
                        active: true
                    },
                    list: {
                        title: "列表模式",
                    }
                }

                //数据初始化
                $scope.doInit = function () {
                    return $q.when()
                        .then($scope.hcSuper.doInit)
                        .then(function () {
                            // 百度地图API功能23.1351666766,113.2708136740
                            map = new BMap.Map("aounterfeiting");
                            map.centerAndZoom(new BMap.Point(113, 23), 5);
                            map.centerAndZoom(point, 5);
                            map.enableScrollWheelZoom(true);
                            //缩放控件
                            map.addControl(new BMap.ScaleControl());
                            //概览图
                            map.addControl(new BMap.OverviewMapControl());
                            //地图类型
                            map.addControl(new BMap.MapTypeControl());
                        }).then(function () {
                            requestApi.post("bcs_search_log", "getsalearea")
                                .then(function (data) {
                                    $scope.data.currItem.operations = data.saleareas.filter(function (item) {
                                        return item.operat_center_org_name != '' && item.operat_center_org_id != 0
                                            && item.jurisdiction_id != 0 && item.province_areaname != '';
                                    });
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.operations);
                                });
                        });
                };

            }]

        return controllerApi.controller({
            module: module,
            controller: AntiCounterfeiting
        });

    });