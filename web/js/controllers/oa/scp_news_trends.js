//公司新闻 hjx
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi', 'swalApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list, requestApi, swalApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$state',
            //控制器函数
            function ($scope, $state) {

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'is_top',
                            headerName: '置顶',
                            cellRenderer: function (params) {
                                var node = params.node;
                                return $('<div>', {
                                    'css': {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        'justify-content': 'center',
                                        'align-items': 'center'
                                    },
                                    'html': [
                                        node.data.is_top != 2 ? null : $('<img>', {
                                            'class': 'iconfont hc-add',
                                            'css': {
                                                'display': 'flex',
                                                'align-items': 'center',
                                                'margin': '0 4px',
                                                'cursor': 'pointer',
                                                'color': 'green',
                                                'width': '20px'
                                            },
                                            'src': '../img/hot.png'
                                        })
                                    ]
                                })[0];
                            }
                        },
                        {
                            field: 'node',
                            headerName: '发文编码'
                        },
                        {
                            field: 'news_type',
                            headerName: '公告类型',
                            hcDictCode: 'composite_type'
                        },
                        {
                            field: 'subject',
                            headerName: '主题',
                            width:350,
                            suppressSizeToFit: true,
                            suppressAutoSize: true
                        },
                        {
                            field: 'noticewf',
                            headerName: '发布状态',
                            hcDictCode: 'new_stat'
                        },
                        {
                            field: 'tags',
                            headerName: '标签'
                        },
                        {
                            field: 'creator',
                            headerName: '制单人'
                        },
                        {
                            field: 'dept_name',
                            headerName: '制单部门'
                        },
                        {
                            field: 'create_time',
                            headerName: '制单时间'
                        },
                        {
                            field: 'pub_time',
                            headerName: '发布时间'
                        },
                        {
                            field: 'expire_date',
                            headerName: '过期时间'
                        },
                        {
                            field: 'publisher',
                            headerName: '发布人'
                        },
                        {
                            field: 'dept_name',
                            headerName: '发布部门'
                        },
                        {
                            field: 'summary',
                            headerName: '摘要'
                        }
                    ],hcPostData:{news_type:3,is_publish:5}
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.filterSetting = {
                    filters: {
                        viewnum: {
                            options: [{
                                name: '已阅读',
                                value: 2
                            }, {
                                name: '未阅读',
                                value: 1
                            }]
                        }
                    },
                    onChange: function (params) {
                        var value = params.option.value;
                        $scope.search(value);
                    }
                };

                /**
                 * 查询
                 * @param params
                 */
                $scope.search = function(value){
                    var sqlwhere = '';

                    var postData = {
                        news_type:3
                    };

                    if( value== 1){
                        postData.sqlwhere = ' vh_viewnum = 0  ';
                    }else if(value == 2){
                        postData.sqlwhere = ' vh_viewnum > 0  ';
                    }

                    requestApi.post('scp_news','search',postData).then(function(result){
                        $scope.gridOptions.hcApi.setRowData(result.scp_newss);
                    });
                };

                /**
                 * 刷新
                 */
                $scope.refresh = function(){
                    var param = $scope.filterSetting.filters.viewnum.options.find(function(cur){
                        return cur.active;
                    });
                    var value = param.value;

                    $scope.search(value);

                   
                };

                $scope.openProp = function(){
                    var id = $scope.gridOptions.hcApi.getFocusedNode().data.newsid;
                     $state.go('oa.scp_news_show', {id:id});
                    // window.open(window.location.origin + '/web/index.jsp?#/oa/scp_news_show/' + id, '_blank');
                };

                  //隐藏按钮
                  $scope.toolButtons.add.hide = true;
                  $scope.toolButtons.delete.hide = true;

                  

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
