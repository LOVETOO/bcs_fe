(function (defineFn) {
    define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'gridApi', 'dateApi', 'directive/hcObjList', 'directive/hcBox', 'directive/hcChart', 'directive/hcModal', 'directive/hcOrgChart'], defineFn);
})(function (module, controllerApi, base_diy_page, requestApi, swalApi, gridApi, dateApi) {
    HrEmployeeAnalyse.$inject = ['$scope', '$parse'];

    function HrEmployeeAnalyse($scope, $parse) {
        /**
         * 继承类
         */
        controllerApi.extend({
            controller: base_diy_page.controller,
            scope: $scope
        });
        /**
         * 籍贯地图省定义
         */
        $scope.pro_data = [];
        $scope.city_data = [];
        $scope.pro_name = "";
        $scope.is_pro = false;
        /**
         * 定义组织架构图
         */
        $scope.orgChartOption = {
            nodeTemplate: function (data) {
                return '<div class="title">' + data.name + '</div><div class="content">'
                    + '<div class="people"><i class="iconfont hc-renyuanguanli"></i>' + data.title + '人</div>'
                    + '<div class="ad"><i class="iconfont hc-zuzhiguanxi"></i>' + data.dept_num + '个</div>'
                    + '</div>'
                    ;
            },
            'visibleLevel': 2,
            'pan': true,
            'nodeContent': 'title',
            'data': {
                'name': 'Lao Lao',
                'title': 'general manager',
                'children': [
                    {'name': 'Bo Miao', 'title': 'department manager'},
                    {
                        'name': 'Su Miao', 'title': 'department manager',
                        'children': [
                            {'name': 'Tie Hua', 'title': 'senior engineer'},
                            {
                                'name': 'Hei Hei', 'title': 'senior engineer',
                                'children': [
                                    {'name': 'Pang Pang', 'title': 'engineer'},
                                    {
                                        'name': 'Dan Zai', 'title': 'UE engineer',
                                        'children': [
                                            {'name': 'Er Dan Zai', 'title': 'Intern'}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {'name': 'Hong Miao', 'title': 'department manager'},
                    {'name': 'Chun Miao', 'title': 'department manager'}
                ]
            }
        };

        $scope.data = {};
        $scope.data.currItem = {};
        /**
         * 定义按钮
         */
        $scope.toolButtons = {
            search: {
                title: '开始统计',
                icon: 'iconfont hc-search',
                click: function () {
                    return $scope.search && $scope.search();
                }
            },
            ageChange: {
                title: '年龄段设置',
                hide: isHideGridButtonAge,
                click: function () {
                    return $scope.ageGroupChange.open({
                        controller: ['$scope', '$q', function ($modalScope, $q) {

                            $modalScope.gridOptions_M = angular.copy($scope._gridOptions_Age);
                            $modalScope.gridOptions_M.hcReady = $q.deferPromise();
                            $modalScope.gridOptions_M.hcReady.then(function () {
                                $modalScope.gridOptions_M.hcApi.setRowData($scope.data.ageArr);
                            });
                            /**
                             * 模态框按钮定义
                             */
                            $modalScope.footerLeftButtons = {
                                addRow: {
                                    // title: '增加行',
                                    icon: 'fa fa-plus',
                                    click: function () {
                                        return $modalScope.addRow && $modalScope.addRow();
                                    }
                                },
                                deleteRow: {
                                    // title: '删除行',
                                    icon: 'fa fa-minus',
                                    click: function () {
                                        return $modalScope.deleteRow && $modalScope.deleteRow();
                                    }
                                },
                            }

                            /*底部左边按钮*/
                            /**
                             * 添加明细
                             */
                            $modalScope.addRow = function () {
                                $modalScope.gridOptions_M.api.stopEditing();
                                var data = $scope.data.ageArr;
                                if (JSON.stringify(data[data.length - 1]) != "{}") {
                                    var newLine = {};
                                    data.push(newLine);
                                }
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                            };
                            /**
                             * 删除行明细
                             */
                            $modalScope.deleteRow = function () {
                                var idx = $scope.data.ageArr.length - 1;
                                var data = $scope.data.ageArr;
                                data.splice(idx, 1);
                                if (data.length == 0) {
                                    var newLine = {};
                                    data.push(newLine);
                                }
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                            };


                            /**
                             * 修改年龄组和工龄组的关联变化
                             */
                            $scope.changeAge = function (args) {
                                var index = args.node.rowIndex;
                                var data = [];
                                data = changIng(index, $scope.data.ageArr, args);
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                                $scope.data.ageArr = data;

                            }
                        }]
                    });
                }
            },
            workAgeChange: {
                title: '工龄段设置',
                hide: isHideGridButtonWorkAge,
                click: function () {
                    return $scope.ageGroupChange.open({
                        controller: ['$scope', '$q', function ($modalScope, $q) {

                            $modalScope.gridOptions_M = angular.copy($scope._gridOptions_Work);
                            $modalScope.gridOptions_M.hcReady = $q.deferPromise();
                            $modalScope.gridOptions_M.hcReady.then(function () {
                                $modalScope.gridOptions_M.hcApi.setRowData($scope.data.workAgeArr);
                            });
                            /**
                             * 模态框按钮定义
                             */
                            $modalScope.footerLeftButtons = {
                                addRow: {
                                    // title: '增加行',
                                    icon: 'fa fa-plus',
                                    click: function () {
                                        return $modalScope.addRow && $modalScope.addRow();
                                    }
                                },
                                deleteRow: {
                                    // title: '删除行',
                                    icon: 'fa fa-minus',
                                    click: function () {
                                        return $modalScope.deleteRow && $modalScope.deleteRow();
                                    }
                                },
                            }


                            /*底部左边按钮*/
                            /**
                             * 添加明细
                             */
                            $modalScope.addRow = function () {
                                $modalScope.gridOptions_M.api.stopEditing();
                                var data = $scope.data.workAgeArr;
                                if (JSON.stringify(data[data.length - 1]) != "{}") {
                                    var newLine = {};
                                    data.push(newLine);
                                }
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                            };
                            /**
                             * 删除行明细
                             */
                            $modalScope.deleteRow = function () {
                                var idx = $scope.data.workAgeArr.length - 1;
                                var data = $scope.data.workAgeArr;
                                data.splice(idx, 1);
                                if (data.length == 0) {
                                    var newLine = {};
                                    data.push(newLine);
                                }
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                            };

                            /**
                             * 修改年龄组和工龄组的关联变化
                             */
                            $scope.changeAge = function (args) {
                                var index = args.node.rowIndex;
                                var data = [];
                                data = changIng(index, $scope.data.workAgeArr, args);
                                $modalScope.gridOptions_M.hcApi.setRowData(data);
                                $scope.data.workAgeArr = data;
                            }
                        }]
                    });
                }
            }
        }
        /**
         * 定义数据表格
         */
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                valueGetter: function (params) {
                    var key = "";
                    switch (parseInt($scope.data.currItem.objecttype)) {
                        case 1: //查询组织结构
                            key = "org_name";
                            break;
                        case 2: //查询学历
                            key = "career_new";
                            break;
                        case 3: //查询年龄
                            key = "age";
                            break;
                        case 4: //查询工龄
                            key = "intime";
                            break;
                        case 5: //查询制种
                            key = "position_group_name";
                            break;
                        case 6: //查询职类
                            key = "position_class_name";
                            break;
                        case 7: //查询职级
                            key = "position_level_code";
                            break;
                        case 8: //查询职等
                            key = "position_grade";
                            break;
                        case 9: //查询籍贯
                            key = "hometown";
                            break;
                        case 10: //查询民族
                            key = "nation";
                            break;
                        case 11: //查询性别
                            key = "sex_new";
                            break;
                    }
                    return params.data[key];
                },
                headerValueGetter: function () {
                    switch (parseInt($scope.data.currItem.objecttype)) {
                        case 1:
                            return "部门";
                        case 2:
                            return "学历";
                        case 3:
                            return "年龄";
                        case 4:
                            return "工龄";
                        case 5:
                            return "职种";
                        case 6:
                            return "职类";
                        case 7:
                            return "职级";
                        case 8:
                            return "职等";
                        case 9:
                            return "籍贯";
                        case 10:
                            return "民族";
                        case 11:
                            return "性别";
                    }
                },
                width: 300,
                cellStyle: {
                    'text-align': 'center' //文本居中
                }
            }, {
                field: 'recnum',
                headerName: '数量',
                width: 115,
                cellStyle: {
                    'text-align': 'center' //文本居中
                }
            }, {
                field: 'mix',
                headerName: '比例',
                width: 115,
                cellStyle: {
                    'text-align': 'center' //文本居中
                }
            }, {
                field: '',
                headerName: '',
                width: 200
            }]
        }
        /**
         * 定义年龄组表格
         */
        $scope.gridOptions_Age = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'group_name',
                headerName: '分段说明'
            }, {
                field: 'group_age',
                headerName: '年龄',
                editable: true,
                onCellValueChanged: function (args) {
                    if (args.oldvalue !== args.newValue) {
                        $scope.changeAge(args)
                    }
                },
                cellStyle: {
                    'text-align': 'center' //文本居中
                }
            }]
        };

        $scope._gridOptions_Age = angular.extend({}, $scope.gridOptions_Age);
        /**
         * 定义工龄组表格
         */
        $scope.gridOptions_Work = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'group_name',
                headerName: '分段说明'
            }, {
                field: 'work_age',
                headerName: '工龄',
                editable: true,
                onCellValueChanged: function (args) {
                    $scope.changeAge(args)
                },
                cellStyle: {
                    'text-align': 'center' //文本居中
                }
            }]
        }

        $scope._gridOptions_Work = angular.extend({}, $scope.gridOptions_Work);

        //部门 查询
        $scope.commonSearchSettingOfDept = {
            afterOk: function (result) {
                $scope.data.currItem.org_ids = result.dept_id;
                $scope.data.currItem.org_code = result.dept_code;
                $scope.data.currItem.org_name = result.dept_name;
            }
        };

        /**
         * 设置初始化数据
         */
        $scope.doInit = function () {
            var d = new Date(dateApi.today()).getFullYear() + "-01-01"
            $parse('data.view.chart').assign($scope, 2);
            $parse('data.view.statement').assign($scope, 2);
            $parse('data.flag.is_dept_1').assign($scope, 2);
            $parse('data.chart.chart_type').assign($scope, 0);
            // $parse('data.chart.pie_chart_2').assign($scope, 2);
            $parse('data.currItem.objecttype').assign($scope, 1);
            $parse('data.currItem.start_date').assign($scope, d);
            $parse('data.currItem.end_date').assign($scope, dateApi.today());

            $scope.ageInit();
            $scope.orgChartInit();
            $scope.workAgeInit();
            return $scope.hcSuper.doInit()
                .then($scope.getdata)
                .then($scope.setdata)
        };

        /*----------------------------------初始化组织结构-------------------------------------------*/
        /**
         * 组织结构人数初始化
         */
        $scope.chartNumInit = function () {
            return requestApi.post({
                classId: 'employee_header',
                action: 'count',
                data: {
                    objecttype: 1
                }
            })
            //设置插入图表的选项
                .then(function (response) {
                    var chart_num = [];
                    response.employee_headerofemployee_headers.forEach(function (item) {
                        chart_num.push({name: item.org_name, value: item.recnum});
                    })
                    var data = coutMix(response.employee_headerofemployee_headers);
                    $scope.gridOptions.hcApi.setRowData(data);
                    $scope.gridOptions.api.refreshHeader();
                    $scope.chart_data = chart_num;
                })

        };

        /**
         * 节点树初始化
         */
        $scope.orgChartInit = function () {
            return requestApi.post({
                classId: 'dept',
                action: 'search',
            })
                .then(function (response) {
                    $scope.root = {};
                    $scope.jiedian_arr = [];
                    response.depts.forEach(function (item) {
                        if (item.dept_pid == 0) {
                            $scope.root.name = item.dept_name;
                            $scope.root.title = 0;
                            $scope.root.s_id = 0;
                            $scope.root.t_id = item.dept_id;
                            $scope.root.children = [];
                            $scope.root.dept_num = 0;
                        } else {
                            var jiedian = {};
                            jiedian.name = item.dept_name;
                            jiedian.title = 0;
                            jiedian.s_id = item.dept_pid;
                            jiedian.t_id = item.dept_id;
                            jiedian.children = [];
                            jiedian.dept_num = 0;
                            $scope.jiedian_arr.push(jiedian);
                        }
                    })
                })
                .then($scope.chartNumInit)
                .then(function () {
                    $scope.jiedian_arr.forEach(function (item1, index1, arr1) {
                        $scope.chart_data.forEach(function (item2) {
                            if (item1.name == item2.name) {
                                arr1[index1].title = parseInt(item2.value);
                            } else if (item2.name == $scope.root.name) {
                                $scope.root.title = parseInt(item2.value);
                            }
                        })

                    })

                    $scope.root = digui($scope.root, $scope.jiedian_arr);
                })
                .then(function () {
                    $scope.orgChartOption = {
                        data: $scope.root
                    };
                })
        }

        /**
         * 节点关系设置
         */
        function digui(root, arr) {
            arr.forEach(function (item1, index1, arr1) {
                if (item1.s_id != root.t_id) {
                    arr.forEach(function (item2, index2, arr2) {
                        if (item1.s_id == item2.t_id) {
                            arr2[index2].children.push(arr1[index1]);
                            arr2[index2].dept_num += 1;
                        }
                    })
                } else {
                    root.children.push(arr1[index1]);
                    root.dept_num += 1;
                }
            })
            root = sum(root)
            return root;
        }

        /**
         * 人数递归统计
         */
        function sum(root) {
            var persum = 0;
            if (root.children.length != 0) {
                root.children.forEach(function (item) {
                    persum += sum(item);
                })
                root.title = root.title + persum;
            }
            if (root.s_id == 0) {
                return root;
            } else
                return root.title;
        }

        /*----------------------------------初始化图表数据-------------------------------------------*/
        /**
         * 年龄组初始化
         */
        $scope.ageInit = function () {
            $scope.data.ageArr = [{
                group_name: '25岁以下', group_age: 25, age_start: 25, age_end: 25
            }, {
                group_name: '25至30岁', group_age: 30, age_start: 25, age_end: 30
            }, {
                group_name: '30至35岁', group_age: 35, age_start: 30, age_end: 35
            }, {
                group_name: '35至40岁', group_age: 40, age_start: 35, age_end: 40
            }, {
                group_name: '40至45岁', group_age: 45, age_start: 40, age_end: 45
            }, {
                group_name: '45至50岁', group_age: 50, age_start: 45, age_end: 50
            }, {
                group_name: '50岁以上', group_age: undefined, age_start: undefined, age_end: undefined
            }];

            // $scope.gridOptions_Age.hcApi.setRowData($scope.data.ageArr);
        };
        /**
         * 工龄组初始化
         */
        $scope.workAgeInit = function () {
            $scope.data.workAgeArr = [{
                group_name: '1年以下', work_age: 1, work_age_start: 1, work_age_end: 1
            }, {
                group_name: '1至2年', work_age: 2, work_age_start: 1, work_age_end: 2
            }, {
                group_name: '2至3年', work_age: 3, work_age_start: 2, work_age_end: 3
            }, {
                group_name: '3至4年', work_age: 4, work_age_start: 3, work_age_end: 4
            }, {
                group_name: '4至5年', work_age: 5, work_age_start: 4, work_age_end: 5
            }, {
                group_name: '5年以上', work_age: undefined, work_age_start: undefined, work_age_end: undefined
            }];

            // $scope.gridOptions_Work.hcApi.setRowData($scope.data.workAgeArr);
        };
        /**
         * 年龄分组是否从小到大
         */
        var isInsrc = function (data) {
            var b_r = false;
            var i = 0;
            data.forEach(function (item) {
                if ($scope.data.currItem.objecttype == 3) {
                    if (item.group_age < i) {
                        b_r = true;
                    }
                    i = item.group_age;
                } else if ($scope.data.currItem.objecttype == 4) {
                    if (item.work_age < i) {
                        b_r = true;
                    }
                    i = item.work_age;
                }
            })
            return b_r;
        }
        /*----------------------------------修改图表数据-------------------------------------------*/

        /**
         * 年龄组和工龄组关联变化的逻辑
         */
        var changIng = function (index, data, args) {
            var age, start_age, end_age, unit;
            if ($scope.data.currItem.objecttype == 3) {
                age = "group_age";
                start_age = "age_start";
                end_age = "age_end";
                unit = "岁"
            } else {
                age = "work_age";
                start_age = "work_age_start";
                end_age = "work_age_end";
                unit = "年"
            }


            if (index == 0) { //第一行数据
                data[index].group_name = args.newValue + unit + "以下";
                data[index][start_age] = args.newValue;//当行开始时间
                data[index][end_age] = args.newValue;//当行结束时间

                if (data.length > 1) {
                    data[index + 1].group_name = args.newValue + "至" + data[index + 1][age] + unit;
                    data[index + 1][start_age] = args.newValue;//下一行开始时间
                }

            } else if (index == (data.length - 1) || index == (data.length - 2)) { //最后一行数据或倒数第二行数据
                data[index].group_name = data[(index - 1)][age] + "至" + args.newValue + unit;
                data[index][end_age] = args.newValue;//当行结束时间
                if (index == (data.length - 1)) {
                    var newline = {};
                    data.push(newline);
                }
                data[index + 1].group_name = args.newValue + unit + "以上";
                data[index + 1][age] = undefined;
                data[index + 1][start_age] = undefined;
                data[index + 1][end_age] = undefined;
            } else {
                data[index].group_name = data[index - 1][age] + "至" + args.newValue + unit;
                data[index][end_age] = args.newValue; //当行结束时间

                data[index + 1].group_name = args.newValue + "至" + data[index + 1][age] + unit;
                data[index + 1][start_age] = args.newValue;//下一行开始时间
            }
            return data;
        }

        /**
         * 比例和总数统计
         */
        var coutMix = function (data) {
            var sum = 0;
            data.forEach(function (item) {
                sum += parseInt(item.recnum);
            })
            data.forEach(function (item) {
                item.mix = Math.round(parseInt(item.recnum) / sum * 10000) / 100.00 + "%";
            })
            data.push({recnum: "总计：" + sum});
            return data;
        }

        /*----------------------------------按钮定义-------------------------------------------*/
        /**
         * 数据查找按钮
         */
        $scope.search = function () {
            if ($scope.data.currItem.objecttype == 3) {
                if (isInsrc($scope.data.ageArr)) {
                    swalApi.info("年龄未按从小到大排序");
                    return;
                }
                $scope.data.currItem.employee_headerofemployee_headers = $scope.data.ageArr
            } else if ($scope.data.currItem.objecttype == 4) {
                if (isInsrc($scope.data.workAgeArr)) {
                    swalApi.info("工龄未按从小到大排序");
                    return;
                }
                $scope.data.currItem.employee_headerofemployee_headers = $scope.data.workAgeArr
            }
            return requestApi.post({
                classId: 'employee_header',
                action: 'count',
                data: {
                    objecttype: $scope.data.currItem.objecttype,
                    employee_headerofemployee_headers: $scope.data.currItem.employee_headerofemployee_headers,
                    end_date: $scope.data.currItem.end_date,
                    org_ids: $scope.data.currItem.org_ids
                }
            })
            //设置插入图表的选项
                .then(function (response) {
                    //图表数据数组
                    var chart_obtion = [];
                    $scope.per_sum = 0;
                    response.employee_headerofemployee_headers.forEach(function (item) {
                        $scope.per_sum++;
                        switch (parseInt($scope.data.currItem.objecttype)) {
                            case 1:
                                chart_obtion.push({name: item.org_name, value: item.recnum});
                                break;
                            case 2:
                                chart_obtion.push({name: item.career_new, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                            case 3:
                                chart_obtion.push({name: item.age, value: item.recnum});
                                $scope.data.chart.chart_type = 1;
                                break;
                            case 4:
                                chart_obtion.push({name: item.intime, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                            case 5:
                                chart_obtion.push({name: item.position_group_name, value: item.recnum});
                                $scope.data.chart.chart_type = 1;
                                break;
                            case 6:
                                chart_obtion.push({name: item.position_class_name, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                            case 7:
                                chart_obtion.push({name: item.position_level_code, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                            case 8:
                                chart_obtion.push({name: item.position_grade, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                            case 9:
                                var is_ex = false;
                                if($scope.is_pro){
                                    $scope.city_data.forEach(function (pro_item,index,arr) {
                                        if(item.hometown.split(",")[1]==pro_item.name){
                                            arr[index].value=parseInt(arr[index].value);
                                            arr[index].value+=parseInt(item.recnum);
                                            is_ex = true;
                                        }
                                    });
                                    if(!is_ex){
                                        $scope.city_data.push({name : item.hometown.split(",")[1],value : item.recnum});
                                    }
                                }else{
                                    //籍贯数据设置
                                    $scope.pro_data.forEach(function (pro_item,index,arr) {
                                        if(item.hometown.split(",")[0]==pro_item.name){
                                            arr[index].value=parseInt(arr[index].value);
                                            arr[index].value+=parseInt(item.recnum);
                                            is_ex = true;
                                        }
                                    });
                                    if(!is_ex){
                                        $scope.pro_data.push({name : item.hometown.split(",")[0],value : item.recnum});
                                    }
                                }


                                $scope.data.chart.chart_type = 4;
                                break;
                            case 10:
                                chart_obtion.push({name: item.nation, value: item.recnum});
                                $scope.data.chart.chart_type = 1;
                                break;
                            case 11:
                                chart_obtion.push({name: item.sex_new, value: item.recnum});
                                $scope.data.chart.chart_type = 2;
                                break;
                        }
                    })
                    var data = coutMix(response.employee_headerofemployee_headers);
                    $scope.gridOptions.hcApi.setRowData(data);
                    $scope.gridOptions.api.refreshHeader();

                    $scope.data.chart_obtion = chart_obtion;
                })
                //把数据插入图表
                .then(function () {
                    $scope.dataType();
                })
        };


        /**
         * 隐藏按钮函数
         */
        function isHideGridButtonAge() {
            if ($scope.data.currItem.objecttype == 3) {
                return false;
            }
            return true;
        }

        function isHideGridButtonWorkAge() {
            if ($scope.data.currItem.objecttype == 4) {
                return false;
            }
            return true;
        }

        /*----------------------------------图表定义-------------------------------------------*/
        /**
         * 展示数据的图表类型
         */
        $scope.dataType = function () {
            var nameArr = [];
            var valueArr = [];
            $scope.data.chart_obtion.forEach(function (item) {
                nameArr.push(item.name);
                valueArr.push(item.value);
            })

            var typeName = '';
            var homeData = [];
            if($scope.is_pro){
                typeName = $scope.pro_name;
                homeData = $scope.city_data;
            }else{
                typeName = 'china';
                homeData = $scope.pro_data;
            }

            if($scope.chart!=undefined){
                $scope.chart.clear();
            }
            $scope.chartOption={};
            if ($scope.data.chart.chart_type == 1) {
                $scope.chartOption = {

                    xAxis: {
                        show: true,
                        type: 'category',
                        data: nameArr,
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        show: true,
                        type: 'value'
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    color: '#188df0',
                    series: [{
                        data: valueArr,
                        type: 'bar',
                        itemStyle: {

                            normal: {
                                label: {
                                    show: true, //开启显示
                                    position: 'top', //在上方显示
                                    formatter: '{c}',
                                    textStyle: { //数值样式
                                        color: 'black',
                                        fontSize: 16
                                    }
                                },
                            }
                        },
                    }]
                }
            } else if ($scope.data.chart.chart_type == 2) {
                $scope.chartOption = {
                    xAxis: {
                        show: false
                    },
                    yAxis: {
                        show: false
                    },

                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        bottom: '80px',
                        data: nameArr
                    },
                    color: ['#78a4ff', '#70cff7', '#fcaf5a', '#fb7372', '#f9d95c', '#6e69ed', '#eae0c4', '#83a4f4', '#e069ed', '#badf52', '#219cff', '#219cff', '#219cff', '#219cff'],
                    series: [ //系列
                        {
                            radius: ['45%', '65%'],
                            center: ["50%", "50%"],
                            type: 'pie', //饼图
                            data: $scope.data.chart_obtion,
                            minAngle: 10,//区块最小弧度
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} : {c} ({d}%)'
                                    },
                                    shadowBlur: 50,
                                    shadowColor: 'rgba(0,0,0,0.15)',
                                    // borderWidth:1,
                                    // borderColor:'#fff',
                                }
                            },
                            // roseType: 'radius',//分块层级大小
                            label: {
                                normal: {
                                    textStyle: {
                                        color: '#333'
                                    }
                                }
                            },//文字
                            labelLine: {
                                normal: {
                                    lineStyle: {
                                        color: '#333'
                                    },
                                    //smooth: 0.2,//弯曲
                                    length: 10,
                                    length2: 20
                                }
                            },//线
                        }]
                }
            } else if ($scope.data.chart.chart_type == 3) {
                $scope.chartOption = {
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: nameArr,
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        }
                    },
                    yAxis: {
                        show: true,
                        type: 'value'
                    },
                    series: [{

                        data: valueArr,
                        type: 'line', //折线图
                    }]
                }
            } else if ($scope.data.chart.chart_type == 4)  {
                $scope.chartOption = {
                    title : {
                        text: '籍贯分布',

                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data:['人数']
                    },
                    visualMap: {
                        min: 0,
                        max: $scope.per_sum,
                        left: 'left',
                        top: 'bottom',
                        text:['high','low'],           // 文本，默认为数值文本
                        calculable : true,
                        inRange: {
                            color: ['yellow', 'orangered']//颜色
                        }
                    },
                    toolbox: {
                        show: true,
                        orient : 'vertical',
                        left: 'right',
                        top: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series: [ //系列
                        {
                            name: '员工籍贯分布',
                            type: 'map', //坐标图
                            mapType: typeName,
                            itemStyle:{
                                normal:{label:{show:true}},
                                emphasis:{label:{show:true}}
                            },
                            data :homeData,
                            layoutSize : '150%'

                        }]
                }


            }
            $scope.city_data = [];
            $scope.pro_data = [];
        };


        $scope.showProvinces = function ($chart){
            $chart.on('click', function (param) {
                if($scope.is_pro){
                    $scope.is_pro = false;
                    $scope.search();
                }else{
                    $scope.pro_name = param.name;
                    $scope.is_pro = true;
                    $scope.search();
                }
            });
        };

        /*----------------------------------查询条件定义-------------------------------------------*/
        /**
         * 定义查询条件
         */
        $scope.queryChoose = function (query_name) {
            delete $scope.data.flag;
            var str = 'data.flag.' + query_name
            $parse(str).assign($scope, 2);
            var index = query_name.lastIndexOf("_");
            $scope.data.currItem.objecttype = query_name.substring(index + 1);
            if ($scope.data.currItem.objecttype == 1) {
                $scope.orgChartInit();
            } else
                $scope.search();
        };
        /**
         * 定义图表类型
         */
        $scope.chartChoose = function (chart_name) {
            delete $scope.data.chart;
            var str = 'data.chart.' + chart_name;
            $parse(str).assign($scope, 2);
            var index = chart_name.lastIndexOf("_");
            $scope.data.chart.chart_type = chart_name.substring(index + 1);
            $scope.dataType();
        };
    }


    return controllerApi.controller({
        module: module,
        controller: HrEmployeeAnalyse
    });

})