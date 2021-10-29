/**
 * Created by zhonghaoliang on 2019/9/3.
 * 产品图册 item_gallery
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'jquery', 'directive/hcImg'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, $) {
        'use strict';

        var controller = [
            //声明依赖注入  
            '$scope', '$q', '$state',
            //控制器函数  
            function ($scope, $q, $state) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //产品大类（初始化时查询一次）
                $scope.item_class1 = {
                    type: '产品大类',
                    groupData: []
                };
                //搜索框文本内容
                $scope.keyWord = '';

                //过滤面板的内容，格式：[{type:'产品大类',gourpData:[{id:'xx',name:'xx'}]}...]
                $scope.filterPanel = [];
                //当前的过滤条件,元素来源于filterPanel的groupData,格式:[{type:'',id:'',name:''}...]
                $scope.curFilter = [];

                //多选面板中选择了的的过滤项临时数组
                $scope.multipleFilterTemp = [];
                //点击的是否[更多]按钮
                $scope.isMoreButton;

                /**
                 * 初始化
                 * @returns {*}
                 */
                $scope.doInit = function () {

                    var postdata = {
                        sqlwhere: 'item_class_level = 1'
                    };
                    return requestApi.post('item_class', 'search', postdata).then(function (result) {
                        $scope.item_class1.groupData = result.item_classs.map(function (cur) {
                            return {
                                type: '产品大类',
                                name: cur.item_class_name,
                                id: cur.item_class_id
                            };
                        });

                        //测试[更多]按钮的显隐
                        var more1 = [];
                        more1 = angular.copy($scope.item_class1.groupData)
                        more1.forEach(function (cur) {
                            cur.name += '1';
                        });

                        var more2 = [];
                        more2 = angular.copy($scope.item_class1.groupData)
                        more2.forEach(function (cur) {
                            cur.name += '2';
                        });
                        $scope.item_class1.groupData = $scope.item_class1.groupData.concat(more1).concat(more2);

                        $scope.filterPanel.push($scope.item_class1);
                    }).then(function () {
                        $scope.searchItemOrg();
                    });
                };

                /*---------------------事件定义--------------------------*/

                /**
                 * 根据curFilter内容及keyWord拼接sqlwhere,然后请求产品资料
                 */
                $scope.searchItemOrg = function () {
                    //后面的拼接全用 " and ... " , sqlwhere仅用于拼接属性条件！
                    var sqlwhere = " 1 = 1";
                    var postdata = {};

                    //拼接检索关键字（产品名称或编码）
                    if ($scope.keyWord) {
                        postdata.item_name = $scope.keyWord;
                        postdata.item_code = postdata.item_name;
                        //sqlwhere += " and (item_code like '%" + $scope.keyWord + "%' or item_name like '%" + $scope.keyWord + "%' )";
                    }

                    $scope.curFilter.forEach(function (cur) {
                        if (cur.prop_field_name) {
                            //拼接属性
                            sqlwhere += " and " + cur.prop_field_name + " = '" + cur.name + "'";
                        } else if (cur.type == '产品大类') {
                            postdata.item_class1 = cur.id;
                            //sqlwhere += " and item_class1 = " + cur.id;
                        } else if (cur.type == '产品中类') {
                            postdata.item_class2 = cur.id;
                            //sqlwhere += " and item_class2 = " + cur.id;
                        } else if (cur.type == '产品小类') {
                            postdata.item_class3 = cur.id;
                            //sqlwhere += " and item_class3 = " + cur.id;
                        }
                    });

                    postdata.sqlwhere = sqlwhere;
                    return requestApi.post('item_org', 'searchmall', postdata)
                        .then(function (result) {
                            $scope.item_orgs = result.item_orgs;
                        });
                };

                /**
                 *搜索框回车事件
                 * @param $event
                 */
                $scope.keyEnterSearch = function ($event) {
                    if ($event.keyCode == 13) {
                        $scope.searchItemOrg();
                    }
                };

                /**
                 * 当前过滤项中，小类、属性 点击[x]按钮移除过滤项
                 */
                $scope.deleteFilter = function (filter) {
                    //去除当前过滤项中被删除的项目
                    $scope.curFilter = $scope.curFilter.filter(function (cur) {
                        return cur.type != filter.type;
                    });

                    //大类或中类
                    var class1Or2 = $scope.curFilter.find(function (cur) {
                        return cur.type == '产品大类';
                    });
                    if (!class1Or2) {
                        var class1Or2 = $scope.curFilter.find(function (cur) {
                            return cur.type == '产品中类';
                        });
                    }

                    return $q
                        .when()
                        .then(function () {
                            if (class1Or2) {
                                //查出分类中所有的中类或属性
                                $scope.filterPanel.length = 0;
                                return $scope.searchItemClassAndClassProp(class1Or2);
                            } else {
                                return $scope.chooseFilter(class1Or2);
                            }
                        })
                        .finally(function(){
                            //去除面板中已存在于当前过滤项的过滤类型
                            $scope.filterPanel = $scope.filterPanel.filter(function(curOut){
                                var curFilterElement = $scope.curFilter.find(function(curIn){
                                    return curIn.type == curOut.type;
                                });
                                return !curFilterElement
                            });

                            $scope.searchItemOrg();
                        });
                };

                /**
                 * 选择过滤条件
                 * @param data 点击过滤箱传入
                 */
                $scope.chooseFilter = function (data) {

                    if (typeof data == 'object') {
                        //点击的是过滤面板中的过滤项
                        if (!(data instanceof Array) && (data.type == '产品大类' || data.type == '产品中类')) {
                            $scope.classFilter(data);
                        } else {
                            $scope.filter(data);
                        }
                    } else {
                        //[所有商品]按钮点击事件
                        $scope.curFilter = [];
                        //过滤面板内容只保留产品大类
                        $scope.filterPanel = [];
                        $scope.filterPanel.push($scope.item_class1);
                    }

                    //根据当前过滤条件条件查询产品资料
                    $scope.searchItemOrg();
                };

                /**
                 * 过滤产品分类(点击产品大类、产品中类过滤项时调用，产品小类与检索属性做相同处理)
                 * @param data
                 * @returns {*}
                 */
                $scope.classFilter = function (data) {
                    //设置当前过滤项的下拉数据
                    var dropFilter = $scope.filterPanel.find(function (cur) {
                        //从找到过滤面板中所有该类型的过滤项
                        return cur.type == data.type;
                    });

                    if (dropFilter && dropFilter.groupData) {
                        data.groupData = dropFilter.groupData;
                    } else {
                        dropFilter = $scope.curFilter.find(function (cur) {
                            //从当前过滤项下拉面板中寻找
                            return cur.type == data.type;
                        });
                        if (dropFilter && dropFilter.groupData) {
                            data.groupData = dropFilter.groupData;
                        }
                    }

                    //移除当前过滤先
                    if (data.type == '产品大类') {
                        //过滤大类时清空当前过滤项目
                        $scope.curFilter = [];
                    } else {
                        //过滤中类时移除当前过滤项目中除产品大类之外的内容
                        $scope.curFilter = $scope.curFilter.filter(function (cur) {
                            return cur.type == '产品大类';
                        });
                    }

                    //添加当前过滤项元素
                    $scope.curFilter.push(data);

                    //清空面板
                    $scope.filterPanel = [];

                    //请求：（1）、产品分类（2）、分类的的商城检索属性
                    $scope.searchItemClassAndClassProp(data);
                };

                /**
                 * 查询产品分类（大类或中类）及其属性
                 */
                $scope.searchItemClassAndClassProp = function (data) {
                    return requestApi.post('item_class', 'search', {sqlwhere: ' item_class_pid = ' + data.id})
                        .then(function (result) {
                            //存在产品中类则向过滤面板中添加
                            if (result.item_classs.length > 0) {
                                var classType
                                    = (result.item_classs[0].item_class_level == 2) ? '产品中类' : '产品小类';
                                var groupData = result.item_classs.map(function (cur) {
                                    return {
                                        type: classType,
                                        name: cur.item_class_name,
                                        id: cur.item_class_id
                                    }
                                });
                                $scope.filterPanel.push({type: classType, groupData: groupData});
                            }
                        })
                        .then(function () {
                            //查完中类再查属性
                            return requestApi.post('item_class', 'select', {item_class_id: $scope.curFilter[0].id})
                                .then(function (result) {
                                    //检索属性名称
                                    var searchProp = [];
                                    if (result.item_class_prop_sets.length > 0) {
                                        //获取商城目录检索项
                                        searchProp = result.item_class_prop_sets.filter(function (cur) {
                                            return cur.is_search_field == 2;
                                        });

                                        searchProp.forEach(function (curProp) {
                                            //一行过滤项
                                            var filterRow = {};
                                            //设置过滤项类型（属性名）
                                            filterRow.type = curProp.prop_name;
                                            filterRow.groupData = [];

                                            //将枚举值字符串转换成数组
                                            var filterItem = curProp.prop_set.split(';');
                                            //设置过滤项
                                            filterItem.forEach(function (item) {
                                                filterRow.groupData.push({
                                                    type: filterRow.type,
                                                    id: curProp.item_class_id,
                                                    prop_field_name: curProp.prop_field_name,//产品资料中的列名
                                                    name: item//产品资料中的列值
                                                });
                                            });

                                            //将一行过滤项加入到过滤面板中
                                            $scope.filterPanel.push(filterRow);
                                        });
                                    }
                                });
                        });

                };

                /**
                 * 过滤产品小类和产品属性
                 * @param data
                 */
                $scope.filter = function (data) {
                    if (data instanceof Array) {
                        //多个过滤项
                        //移除过滤面板中被点击的那一类过滤项目
                        $scope.filterPanel = $scope.filterPanel.filter(function (cur) {
                            return cur.type != data[0].type;
                        });

                        $scope.curFilter.push(data);
                    } else {
                        //单个过滤项
                        //移除过滤面板中被点击的那一类过滤项目
                        $scope.filterPanel = $scope.filterPanel.filter(function (cur) {
                            return cur.type != data.type;
                        });
                        $scope.curFilter.push(data);
                    }
                };

                /**
                 * 过滤面板[更多] 按钮事件
                 */
                $scope.showMore = function (idx) {
                    $scope.isMoreButton = true;
                    $scope.showOrHideAllRowFilter(idx);
                };

                /**
                 * 过滤面板[多选] 按钮事件
                 */
                $scope.showMultiple = function (idx) {
                    $scope.isMoreButton = false;
                    $scope.multipleFilterTemp.length = 0;
                    $scope.showOrHideAllRowFilter(idx);
                };

                /**
                 * 显示或隐藏行所有过滤项
                 * @param className
                 */
                $scope.showOrHideAllRowFilter = function(idx){
                    var className = '.allFilter'+idx;
                    var modal = $(className);
                    if (modal.is(':visible')) {
                        modal.hide();
                    } else {
                        //先隐藏所有，再显示单个
                        $(".js-toggle-modal1").hide();
                        modal.show();
                    }
                };

                /**
                 * 多选、更多 过滤面板内过滤选项点击事件
                 * 多选:仅向数组中添加过滤项
                 * 更多：过滤并查询
                 */
                $scope.chooseMultipleFilter = function (data) {
                    if ($scope.isMoreButton) {
                        $scope.chooseFilter(data);
                    } else {
                        $scope.multipleFilterTemp.push(data);
                    }
                };

                /**
                 * 多选 过滤面板内的[确定]按钮点击事件
                 */
                $scope.chooseMultipleFilterConfirm = function (idx) {
                    $scope.chooseFilter($scope.multipleFilterTemp);
                    $scope.showMultiple(idx);
                };

                /**
                 * 多选 过滤面板内的[取消]按钮点击事件
                 */
                $scope.chooseMultipleFilterCancel = function (idx) {
                    $scope.showMultiple(idx);
                };

                /*---------------------动态class--------------------------*/
                /**
                 * allFilterClass
                 * 动态生成class属性，用于点击某行的[更多]或[多选]时，弹出指定行的所有过滤项
                 */
                $scope.allFilterClass = function(idx){
                    return 'allFilter'+idx;
                };

                /*---------------------分页相关--------------------------*/
                //pagination: "pn=3,ps=10,pc=4,cn=34"
                //pn:搜索第几页内容；ps：每页数据数量：pc：共分成多少页；cn总数据数量
                $scope.pageSize = 100; //每页数量
                $scope.currPage = 1; //当前哪一页
                $scope.count = 0; //总数量
                $scope.pageCount = 1; //总页数

                /**
                 * 搜索
                 */
                $scope.search = function () {
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];

                    //调整到第一页
                    if (isFirst) {
                        $scope.currPage = 1;
                    }

                    var postdata = {
                        sqlwhere: sqlwhere
                    };
                    postdata.pagination =
                        "pn=" + $scope.currPage + ",ps=" + $scope.pageSize + ",pc=0"

                    return requestApi
                        .post('item_org', 'search', postdata)
                        .then(function (response) {
                            $scope.data.item_orgs = response.item_orgs;
                            $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.item_orgs = response.item_orgs;

                            //设置分页信息的缓存
                            var pageInfo = response.pagination.split(',');
                            pageInfo.forEach(function (cur) {
                                if (cur.indexOf('pc=') != -1) {
                                    $scope.pageCount = cur.substr(cur.indexOf('=') + 1);
                                } else if (cur.indexOf('cn=') != -1) {
                                    $scope.count = cur.substr(cur.indexOf('=') + 1);
                                    //将总数据量存入节点
                                    $scope.treeSetting.zTreeObj.getSelectedNodes()[0].count = $scope.count;
                                }
                            });
                            $scope.treeSetting.zTreeObj.getSelectedNodes()[0].pageSize = $scope.pageSize;
                            $scope.treeSetting.zTreeObj.getSelectedNodes()[0].currPage = $scope.currPage;
                        });
                };

                /**
                 *
                 * @param $event
                 */
                $scope.keyEnterSearch = function ($event) {
                    if ($event.keyCode == 13) {
                        $scope.search(true);
                    }
                };

                /**
                 * 转到首页
                 */
                $scope.firstPage = function () {
                    //已经是首页，无法再跳转
                    if ($scope.currPage === 1)
                        return;

                    $scope.search(true);
                };

                /**
                 * 转到上一页
                 */
                $scope.prevPage = function () {
                    //已经是首页，无法再跳转
                    if ($scope.currPage === 1)
                        return;

                    $scope.currPage--;

                    $scope.search();
                };

                /**
                 * 转到下一页
                 */
                $scope.nextPage = function () {
                    //已经是末页，无法再跳转
                    if ($scope.currPage >= $scope.pageCount)
                        return;

                    $scope.currPage++;

                    $scope.search();
                };

                /**
                 * 转到末页
                 */
                $scope.lastPage = function () {
                    //已经是末页，无法再跳转
                    if ($scope.currPage >= $scope.pageCount)
                        return;

                    $scope.currPage = $scope.pageCount;

                    $scope.search();
                };

                /*---------------------路由跳转--------------------------*/
                /**
                 * 跳转到【产品详情】
                 * @param item 产品数据
                 */
                $scope.goItemDetail = function (item) {
                    if ($scope.goOrRefresh('item_detail') == 'go') {
                        //记录首次打开【产品详情】时传入的item_org_id。
                        //只打开一个详情窗口，go方法第二个参数保持相同以保证跳转到已打开窗口
                        $scope.first_item_org_id = item.item_org_id;
                        return $state.go('baseman.item_detail', {item_org_id: item.item_org_id});
                    } else {
                        var promise = $q.when()
                            .then(function () {
                                //触发刷新
                                $scope.globalTrigger('item_detail'
                                    , 'baseman.item_gallery.refreshItemDetail'
                                    , [{item_org_id: item.item_org_id}])
                            }).then(function () {
                                $state.go('baseman.item_detail', {item_org_id: $scope.first_item_org_id})
                            });

                        //返回承诺
                        return promise;
                    }
                };

                /**
                 * 判断跳转跳转前是否刷新
                 * 跳转go：如果【购物车】窗口没有打开
                 * 刷新refresh，再跳转：已打开【购物车】窗口
                 * @param hrefPart top.frames[i].document.location.href的一部分，如：/js文件名称?
                 * @returns {*}
                 */
                $scope.goOrRefresh = function (hrefPart) {
                    var maxIdx = top.frames.length - 1;
                    var href = '';
                    var action = 'go';

                    while (maxIdx >= 0) {
                        href = top.frames[maxIdx].location.href;
                        if (href.indexOf('/' + hrefPart + '?') != -1) {
                            action = 'refresh';
                            break;
                        }
                        maxIdx--;
                    }

                    return action;
                };

                /**
                 * 遍历top下的所有子窗口,当窗口href包含指定字符串时，触发指定事件
                 * @param hrefPart top.frames[i].document.location.href的一部分，js文件名称
                 * @param eventName 事件名称
                 * @param eventArgs 事件参数（数组）
                 */
                $scope.globalTrigger = function (hrefPart, eventName, eventArgs) {
                    if (!hrefPart || !eventName) {
                        return console.error('没有传入预定义的参数!');
                    }

                    (function triggerEvent(theWindow) {
                        //跨域时不传播事件
                        try {
                            theWindow.document;
                        } catch (error) {
                            return;
                        }

                        if (!theWindow.$ || !theWindow.$.fn || !theWindow.$.fn.trigger) {
                            return;
                        }

                        setTimeout(function () {
                            if (theWindow.document.location.href.indexOf('/' + hrefPart + '?') != -1) {
                                //先触发事件，在跳转到窗口
                                theWindow.$(theWindow.document).trigger(eventName, eventArgs);
                            }
                        });

                        Array.prototype.forEach.call(theWindow.frames, triggerEvent);
                    })(top);
                };

                  /**
                 * 跳转到【购物车】
                 */
                $scope.goShoppingCart = function () {
                    if ($scope.goOrRefresh('shopping_cart') == 'go') {
                        return $state.go('baseman.shopping_cart');
                    } else {
                        var promise = $q.when()
                            .then(function () {
                                //触发刷新
                                $scope.globalTrigger('shopping_cart', 'baseman.item_gallery.addCartItem');
                            }).then(function () {
                                $state.go('baseman.shopping_cart')
                            });

                        //返回承诺
                        return promise;
                    }
                };

                $scope.addCartItem = function (item) {
                    var postdata = {
                        scp_shopping_cartitems: [{
                            item_id: item.item_id
                        }]
                    };

                    return requestApi.post('scp_shopping_cart', 'addcartitem', postdata)
                        .then(function () {
                            //触发刷新
                            $scope.globalTrigger('shopping_cart', 'baseman.item_gallery.addCartItem');
                            //刷新购物车商品总数量
                            $scope.getCartItemNum();
                            swalApi.info('添加成功');
                        });
                };

                     /**
                 * 查询购物车商品总数量
                 * @returns {*}
                 */
                $scope.getCartItemNum = function () {
                    return requestApi.post('scp_shopping_cart', 'getcartitemnum', {})
                        .then(function (result) {
                            $scope.itemnum = result.itemnum;
                        });
                }

            }
        ];

        //使用控制器Api注册控制器  
        //需传入require模块和控制器定义  
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);  