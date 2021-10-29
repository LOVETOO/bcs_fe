/**
* 通讯录
* @hzj 2019-05-21
*/
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'directive/hcImg'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$timeout', '$location', '$stateParams', '$modal',
            //控制器函数


            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {},
                    userlist: [],
                    pageSize: 0,
                    pn: 1,
                    keyword: ''
                }

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 获取数据
                 */
                $scope.getData = function (bool) {
                    var sqlwhere = "";
                    if (bool) {
                        $scope.data.pn = 1;
                    }
                    if ($scope.data.keyword != "") {
                        sqlwhere += "(username like '%" + $scope.data.keyword + "%' or email like '%" + $scope.data.keyword + "%' or mobil like '%" + $scope.data.keyword + "%')";
                    }
                    var param = {
                        sqlwhere: sqlwhere,
                        pagination: "pn=" + $scope.data.pn + ",ps=10,pc=1,cn=0"
                    }
                    requestApi.post('scpuser', 'search', param).then(function (response) {
                        $scope.data.pageSize = response.pagination.split(',')[2].split('=')[1];
                        $scope.data.userlist = response.users;
                        $scope.pageinit($scope);
                    });
                }
                //$scope.getData(false);
                $scope.enter = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.getData(true);
                    }
                }
                /**
                 * 查询按钮
                 */
                $scope.search = function () {
                    $scope.getData(true);
                }
                /**
                 * 添加分页插件
                 */
                $scope.pageinit = function ($scope) {
                    var pageNumber = $scope.data.pn,//当前页
                        pageSize = 5, //每页显示的条数
                        edges = 3,//两侧显示的页码数 大于1
                        playes = 3,//主页码区显示的页码数 大于3
                        pages = $scope.data.pageSize,//总页数
                        $ul,
                        $item,
                        $prev,
                        $next;
                    if (pages == 1) {
                        playes = 1;
                    } else if (pages == 2) {
                        playes = 2;
                    } else {
                        playes = 3;
                    }
                    renderPageItem();
                    function renderPageItem() {
                        $ul = $('<ul class="pagination" style="float:right"></ul>');
                        var start = 1;
                        var end = pages;
                        if (playes % 2) {
                            //playes是奇数
                            start = pageNumber - Math.floor(playes / 2);
                            end = pageNumber + Math.floor(playes / 2);
                        } else {
                            //playes是偶数
                            start = pageNumber - (playes / 2 - 1);
                            end = pageNumber + playes / 2;
                        }

                        if (start <= edges + 1) {
                            start = 1;
                            if (end < playes && playes < pages) {
                                end = playes;
                            }
                        } else {
                            for (var i = 1; i <= edges; i++) {
                                $ul.append(renderItem(i));
                            }
                            $ul.append('<li><span>...</span></li>')
                        }
                        if (end < pages - edges) {
                            for (var i = start; i <= end; i++) {
                                $ul.append(renderItem(i));
                            }
                            $ul.append('<li><span>...</span></li>');
                            for (var i = pages - edges + 1; i <= pages; i++) {
                                $ul.append(renderItem(i));
                            }
                        } else {
                            end = pages;
                            if (start > pages - playes + 1) {
                                start = pages - playes + 1;
                            }
                            for (var i = start; i <= end; i++) {
                                $ul.append(renderItem(i));
                            }
                        }
                        $ul.prepend(renderPrevItem());
                        $ul.append(renderNextItem());
                        $('#pageBox').empty().append($ul);
                    }

                    function renderItem(i) {
                        $item = $('<li><a href="#">' + i + '</a></li>');
                        if (i == pageNumber) {
                            $item.addClass('active');
                        }
                        $item.on('click', (function (num) {
                            return function () {
                                pageNumber = num;
                                $scope.data.pn = num;
                                $scope.getData(false);
                                renderPageItem();
                            }
                        })(i));
                        return $item
                    }

                    function renderPrevItem() {
                        $prev = $('<li><a href="#">&laquo;</a></li>');
                        if (pageNumber == 1) {
                            $prev.addClass('disabled');
                        } else {
                            $prev.on('click', function () {
                                pageNumber = pageNumber - 1;
                                $scope.data.pn -= 1;
                                $scope.getData(false);
                                renderPageItem();
                            })
                        }
                        return $prev;
                    }

                    function renderNextItem() {
                        $next = $('<li><a href="#">&raquo;</a></li>');
                        if (pageNumber == pages) {
                            $next.addClass('disabled');
                        } else {
                            $next.on('click', function () {
                                pageNumber = pageNumber + 1;
                                $scope.data.pn += 1;
                                $scope.getData(false);
                                renderPageItem();
                            })
                        }
                        return $next;
                    }

                }

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