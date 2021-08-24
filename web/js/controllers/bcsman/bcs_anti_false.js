/**
 * 巫奕海
 * 2019-12-24.
 * 防伪防窜界面
 */
define(
    ['module', 'controllerApi', 'base_diy_page', '$q', 'requestApi', 'swalApi', 'directive/hcTab', 'async!baidu', "directive/hcChart"],
    function (module, controllerApi, base_diy_page, $q, requestApi, swalApi) {

        var AntiCounterfeiting = [

            '$scope', function ($scope) {

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                //定义全局变量
                // 对Date的扩展，将 Date 转化为指定格式的String
                // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
                // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
                // 例子： 
                // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
                // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
                Date.prototype.format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                        "H+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
                $scope.data = {
                    currItem: {
                        endtime: new Date().format("yyyy-MM-dd"),
                        begintime: new Date((new Date()) - 7 * 24 * 3600 * 1000).format("yyyy-MM-dd"),
                        barcode: '',
                    }
                };

                //选择区域
                $scope.gridOptions = {
                    hcEvents: {
                        cellFocused: function (params) {
                            $scope.data.currItem.short_barcode = $scope.data.currItem.bcs_search_logs[params.rowIndex] && $scope.data.currItem.bcs_search_logs[params.rowIndex].short_barcode;
                            //防伪热点图初始化
                            $scope.data.currItem.data = []
                            $scope.data.currItem.geoCoordMap = {}
                            //热点数据
                            var lines = $scope.data.currItem.bcs_search_logs[params.rowIndex] && $scope.data.currItem.bcs_search_logs[params.rowIndex].lines;
                            lines && lines.forEach(function (e) {
                                $scope.data.currItem.data.push({ name: e.address, value: e.countadd })
                                $scope.data.currItem.geoCoordMap[e.address] = [e.lng, e.lat]
                            });
                            $scope.getOption()
                        }
                    },
                    onRowClicked: event => {
                        var itxst = JSON.stringify(event.data);

                        console.log("-----------" + itxst);
                        $scope.searchbracodebyrow();

                    },
                    columnDefs: [

                        {
                            type: '序号'
                        }, {
                            field: 'short_barcode',
                            headerName: '条码'
                        }, {
                            field: 'counts',
                            headerName: '次数'
                        },
                        //  {
                        //     field: '',
                        //     headerName: '系统等级',
                        //     valueFormatter: function () {
                        //         return "是"
                        //     }
                        // }, 
                        {
                            field: "xxx",
                            headerName: '风险等级',
                            valueFormatter: function (args) {
                                var counts = args.data.counts
                                if (counts >= 5 && counts < 10) {
                                    return "*"
                                } else if (counts >= 10 && counts < 15) {
                                    return "**"
                                } else if (counts >= 15) {
                                    return "***"
                                }
                            }
                        }, {
                            field: 'mintime',
                            headerName: '首次查询时间'
                        }, {
                            field: 'maxtime',
                            headerName: '最后查询时间'
                        }]
                };

                //异地查询明细
                $scope.listOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'short_barcode',
                        headerName: '条码',
                    }, {
                        field: 'barcode_type',
                        headerName: '条码类型',
                        hcDictCode: 'barcode_type'
                    }, {
                        field: 'countadd',
                        headerName: '次数',
                    }, {
                        field: 'address',
                        headerName: '查询地址',
                    }, {
                        field: 'maxtime',
                        headerName: '最后时间',
                    }, {
                        field: '',
                        headerName: '城市',
                    }]
                }

                //条码查询明细
                $scope.bracodeOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'short_barcode',
                        headerName: '条码',
                    }, {
                        field: 'barcode_type',
                        headerName: '条码类型',
                        hcDictCode: 'barcode_type'
                    }, {
                        field: 'lng',
                        headerName: '经度',
                    }, {
                        field: 'lat',
                        headerName: '纬度',
                    }, {
                        field: 'address',
                        headerName: '查询地址',
                    }, {
                        field: 'creation_date',
                        headerName: '查询时间',
                    }]
                }

                //点击查询按钮
                $scope.searchbracode = function () {

                    requestApi.post({
                        classId: "bcs_search_log",
                        action: "search",
                        data: {
                            begin_time: $scope.data.currItem.begintime,
                            end_time: $scope.data.currItem.endtime,
                            short_barcode: $scope.data.currItem.barcode
                        }
                    }).then(function (data) {
                        $scope.data.currItem.bcs_search_logs = data.bcs_search_logs
                        $scope.gridOptions.hcApi.setRowData(data.bcs_search_logs)
                    })
                    // return $q.when()
                    // .then($scope.hcSuper.doInit)
                    // .then(function () {
                    //     requestApi.post({
                    //         classId: "bcs_search_log",
                    //         action: "search",
                    //         data: {
                    //             begin_time: $scope.data.currItem.begintime,
                    //             end_time: $scope.data.currItem.endtime

                    //         }
                    //     }).then(function (data) {
                    //         $scope.data.currItem.bcs_search_logs = data.bcs_search_logs
                    //         $scope.gridOptions.hcApi.setRowData(data.bcs_search_logs)
                    //     })
                    // })
                    // .then(function () {
                    //     $scope.getOption()
                    // });

                }
                //根据行查询明细
                $scope.searchbracodebyrow = function () {
                    if (isNaN($scope.data.currItem.begintime) && !isNaN(Date.parse($scope.data.currItem.begintime)) &&
                        isNaN($scope.data.currItem.endtime) && !isNaN(Date.parse($scope.data.currItem.endtime))
                    ) {
                        requestApi.post({
                            classId: "bcs_search_log",
                            action: "searchbracode",
                            data: {
                                begin_time: $scope.data.currItem.begintime,
                                end_time: $scope.data.currItem.endtime,
                                short_barcode: $scope.data.currItem.short_barcode
                            }
                        })
                            .then(function (data) {
                                $scope.data.currItem.data = []
                                $scope.data.currItem.geoCoordMap = {}
                                //热点数据
                                var lines = data.differentplaces;
                                lines.forEach(function (e) {
                                    $scope.data.currItem.data.push({ name: e.address, value: e.countadd })
                                    $scope.data.currItem.geoCoordMap[e.address] = [e.lng, e.lat]
                                });
                                $scope.getOption()
                                $scope.listOptions.hcApi.setRowData(data.differentplaces);
                                $scope.bracodeOptions.hcApi.setRowData(data.bracodes);
                            })
                    } else {
                        swalApi.info("请输入正确的日期格式")
                    }
                }

                //热点图数据处理
                $scope.convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = $scope.data.currItem.geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                //获取热点图
                $scope.getOption = function () {
                    return $scope.chartOption = {
                        title: {
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        bmap: {
                            center: [104.114129, 37.550339],
                            zoom: 5,
                            roam: true,
                            mapStyle: {
                                styleJson: [{
                                    'featureType': 'water',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'land',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#f3f3f3'
                                    }
                                }, {
                                    'featureType': 'railway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'highway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#fdfdfd'
                                    }
                                }, {
                                    'featureType': 'highway',
                                    'elementType': 'labels',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'geometry',
                                    'stylers': {
                                        'color': '#fefefe'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'geometry.fill',
                                    'stylers': {
                                        'color': '#fefefe'
                                    }
                                }, {
                                    'featureType': 'poi',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'green',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'subway',
                                    'elementType': 'all',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'manmade',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'local',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'arterial',
                                    'elementType': 'labels',
                                    'stylers': {
                                        'visibility': 'off'
                                    }
                                }, {
                                    'featureType': 'boundary',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#8B8B7A'
                                    }
                                }, {
                                    'featureType': 'building',
                                    'elementType': 'all',
                                    'stylers': {
                                        'color': '#d1d1d1'
                                    }
                                }, {
                                    'featureType': 'label',
                                    'elementType': 'labels.text.fill',
                                    'stylers': {
                                        'color': '#999999'
                                    }
                                }]
                            }
                        },
                        series: [
                            {
                                type: 'scatter',
                                coordinateSystem: 'bmap',
                                data: $scope.convertData($scope.data.currItem.data),
                                symbolSize: function (val) {
                                    return val[2] / 0.5;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: false
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                encode: {  //可以定义 data 的哪个维度被编码成什么
                                    tooltip: [2],     // 表示维度 3、2、4 会在 tooltip 中显示。
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#dc3545'
                                    }
                                }
                            },
                            {
                                type: 'effectScatter',
                                coordinateSystem: 'bmap',
                                data: $scope.convertData($scope.data.currItem.data.sort(function (a, b) {
                                    return b.value - a.value;
                                }).slice(0, 2)),
                                symbolSize: function (val) {
                                    return val[2] / 0.5;
                                },
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    }
                                },
                                encode: {  //可以定义 data 的哪个维度被编码成什么
                                    tooltip: [2],     // 表示维度 3、2、4 会在 tooltip 中显示。
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#dc3545',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }
                        ]
                    };
                }

                //tab签
                $scope.kpi_tab = {
                    map: {
                        title: "全国防伪地形图",
                        active: true
                    },
                    // list: {
                    //     title: "异地查询明细",
                    // },
                    barcode: {
                        title: "条码查询明细",
                    }
                }

                //数据初始化
                $scope.doInit = function () {
                    //热点数据
                    $scope.data.currItem.data = [];
                    //坐标位置
                    $scope.data.currItem.geoCoordMap = {};
                    return $q.when()
                        .then($scope.hcSuper.doInit)
                        .then(function () {
                            requestApi.post({
                                classId: "bcs_search_log",
                                action: "search",
                                data: {
                                    begin_time: $scope.data.currItem.begintime,
                                    end_time: $scope.data.currItem.endtime

                                }
                            }).then(function (data) {
                                $scope.data.currItem.bcs_search_logs = data.bcs_search_logs
                                $scope.gridOptions.hcApi.setRowData(data.bcs_search_logs)
                            })
                        })
                        .then(function () {
                            $scope.getOption()
                        });
                };
            }]

        return controllerApi.controller({
            module: module,
            controller: AntiCounterfeiting
        });

    });