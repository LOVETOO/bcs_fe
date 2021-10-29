//通知公告 jds
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi', 'swalApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list, requestApi, swalApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$state',
            //控制器函数
            function ($scope, $state) {
                $scope.data = {
                    currItem: {}
                }
                $scope.newstype = 0;

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            field: 'is_top',
                            headerName: '置顶状态',
                            hcDictCode: 'is_top',
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
                                            // 'class': 'iconfont hc-add',
                                            'css': {
                                                'display': 'flex',
                                                'align-items': 'center',
                                                'margin': '0 4px',
                                                'cursor': 'pointer',
                                                'color': 'green',
                                                'width': '20px'
                                            },
                                            'src': '/web/img/hot.jpg'
                                            
                                        })
                                    ]
                                })[0];
                            }
                        },{
                            field: 'noticewf',
                            headerName: '发布状态',
                            hcDictCode: 'new_stat'
                        },
                        {
                            field: 'node',
                            headerName: '发文编码'
                        },{
                            field: 'noticetype',
                            headerName: '通知类型',
                            hcDictCode: 'noticetype'
                        },
                        
                        {
                            field: 'subject',
                            headerName: '公告主题'
                        }, 
                        {
                            field: 'pub_time',
                            headerName: '发布时间',
                            type:'日期'
                        },
                        {
                            field: 'expire_date',
                            headerName: '过期时间',
                            type:'日期'
                        },
                        {
                            field: 'publisher',
                            headerName: '发布人'
                        },
                        {
                            field: 'publish_dept',
                            headerName: '发布部门'
                        },
                        {
                            field: 'create_time',
                            headerName: '创建时间',
                            cellStyle: {
                                'text-align': 'center' //文本居中
                            }
                        },
                        {
                            field: 'creator',
                            headerName: '创建人',
                            cellStyle: {
                                'text-align': 'center' //文本居中
                            }
                        },
                        {
                            field: 'dept_name',
                            headerName: '创建部门',
                            cellStyle: {
                                'text-align': 'center' //文本居中
                            }
                        }, 
                          
                        {
                            field: 'summary',
                            headerName: '备注'
                        }
                    ], hcAfterRequest: function (searchObj) {
                        $scope.data.currItem = searchObj;
                        console.log($scope.data.currItem)
                    },
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*---------------------页签定义--------------------------*/

                // 过滤页签定义
                // $scope.filterSetting = {
                //     filters: {
                //         news_type: {
                //             options: [{
                //                 name: '通知公告',
                //                 value: 1
                //             }, {
                //                 name: '最新活动',
                //                 value: 2
                //             }, {
                //                 name: '公司新闻',
                //                 value: 3
                //             }]
                //         }
                //     },
                //     onChange: function (params) {
                //         console.log($scope.gridOptions.hcFilterSetting.filters);

                //         var activeFilter = $scope.filterSetting.filters.news_type.options.find(function(cur){
                //             return cur.active == true;
                //         });

                //         if(activeFilter){
                //             if(activeFilter.name == '通知公告'){
                //                 $scope.search(1);
                //             }else if(activeFilter.name == '最新活动'){
                //                 $scope.search(2);
                //             }else if(activeFilter.name == '公司新闻'){
                //                 $scope.search(3);
                //             }else{
                //                 $scope.search();
                //             }
                //         }else{
                //             $scope.search();
                //         }
                //     }
                // };
                
                // /**
                //  * 查询
                //  */
                // $scope.search = function(news_type){
                //     var postData = {
                //         news_type:(news_type)?news_type:0
                //     };
                    

                //     return requestApi.post('scp_news','search',postData).then(function(result){
                //         $scope.gridOptions.hcApi.setRowData(result.scp_newss);
                //     });
                // };

                /*---------------------按钮及按钮方法定义--------------------------*/

                //自定义按钮
                $scope.toolButtons.soldOut = {
                    title: '下架',
                    groupId: 'base',
                    icon: 'iconfont hc-moreunfold',
                    click: function () {
                        $scope.sold_out();
                    }
                };

                $scope.toolButtons.isTop = {
                    title: '置顶',
                    groupId: 'base',
                    icon: 'iconfont hc-less',
                    click: function () {
                        $scope.Is_Top_btn(2);
                    }
                };
                $scope.toolButtons.noTop = {
                    title: '取消置顶',
                    groupId: 'base',
                    icon: 'iconfont hc-moreunfold',
                    click: function () {
                        $scope.No_Top_btn(1);
                    }
                };

                /**
                 * 向属性页传菜单url参数
                 */
                $scope.getPropRouterParams = function () {
                    return {
                        newstype: $scope.newstype
                    };
                };

                /**
                 * [下架] 按钮事件
                 * @returns {boolean}
                 */
                $scope.sold_out = function () {
                    var checkdata = "newsid ="+$scope.currItem.newsid;
                    if($scope.currItem.noticewf==3 ||$scope.currItem.noticewf==6){
                            swalApi.info("该公告无法下架");
                            return false;
                    }else if($scope.currItem.noticewf==7 ||$scope.currItem.noticewf==8){
                        swalApi.info("该公告已下架");
                            return false;
                    }else {
                        //下架
                        requestApi.post({
                            classId: 'scp_news',
                            action: 'seleupdatenoticewfct',
                            data: {
                                sqlwhere: checkdata,
                                
                            }
                        })
                        .then(function (data) {
                            $scope.gridOptions.hcApi.search();
                        })
                    
                    }
                };

                   
                    

                /**
                 * [置顶] 按钮事件
                 * @param item
                 * @returns {boolean}
                 * @constructor
                 */
                $scope.Is_Top_btn = function (item) {
                    
                    var isTopSize = 0;
                    $scope.data.currItem.scp_newss.forEach(function (data, index) {
                         
                        if (data.is_top == 2) {
                            isTopSize++;
                        }
                    });
                   
                     var checkdata = "newsid ="+$scope.currItem.newsid;
                  
                        var sum = isTopSize ;
                        if (item == 2 && sum > 2) {
                            swalApi.info("置顶数量最多3条，请取消后再设置置顶");
                            return false;
                        }
                        if( $scope.currItem.noticewf!=5 || $scope.currItem.stat!=5  ){
                            swalApi.info("请选择已发布的公告"); 
                            return false;
                        }else {
                            //置顶
                            requestApi.post({
                                classId: 'scp_news',
                                action: 'seleupdateistop',
                                data: {
                                    sqlwhere: checkdata,
                                    is_top: item
                                }
                            })
                                .then(function (data) {
                                  
                                    $scope.gridOptions.hcApi.search();
                                  
                                })
                        }
                };


                $scope.No_Top_btn = function (item) {
                  
                    var checkdata = "newsid ="+$scope.currItem.newsid;
                    
                        if( $scope.currItem.is_top!=2){
                            swalApi.info("请选择已置顶的公告");
                            return false;
                        }else {
                            //取消置顶
                            requestApi.post({
                                classId: 'scp_news',
                                action: 'seleupdateistop',
                                data: {
                                    sqlwhere: checkdata,
                                    is_top: item
                                }
                            }).then(function (data) {
                                  
                                    $scope.gridOptions.hcApi.search();
                                  
                            })
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
