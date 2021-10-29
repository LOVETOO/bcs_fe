/**
 * Created by zhonghaoliang on 2019/9/3.
 * 购物车 shopping_cart
 */

define(
    ['module', 'controllerApi', '$filter', 'numberApi', 'base_diy_page', 'swalApi', 'requestApi', 'jquery', 'openBizObj',
        'directive/hcInput', 'directive/hcButtons', 'directive/hcImg'],
    // 加载依赖的模块
    function (module, controllerApi, $filter, numberApi, base_diy_page, swalApi, requestApi, $, openBizObj) {
        'use strict';
        // 控制器定义
        var controller = [
            // 声明依赖注入
            '$scope', '$state', '$q',

            // 控制器函数
            function ($scope, $state, $q) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*---------------------数据定义--------------------------*/
                $scope.data = {
                    currItem: {
                        scp_shopping_cartitems: [],
                        scp_shopping_cartitems_old: [],//备份的数据，验证失败时恢复原来的数据、跳转时保持勾选内容
                        total_amount: 0,//被勾选产品的总金额(优惠后,下文总金额指代优惠后总金额)
                        total_amount_undiscout: 0,//被勾选产品的总金额(未优惠)
                        total_amount_saved: 0//优惠金额
                        //twice_discount_rate: 1//折上折
                    }
                };
                $scope.setAllSelected = true;

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            $scope.search()
                                .then(function () {
                                    //设置关联数组
                                    $scope.data.currItem.scp_shopping_cartitems.forEach(function (cur, index) {
                                        //全部默认勾选
                                        if($scope.setAllSelected){
                                            $scope.data.currItem.scp_shopping_cartitems[index].isSelected = 2;
                                            $scope.data.selectedCount = $scope.data.currItem.scp_shopping_cartitems.length;
                                        }
                                        //设置仅更新数量模式为否
                                        $scope.data.currItem.scp_shopping_cartitems[index].updateqtyonly = false;
                                        //计算单行金额
                                        $scope.calAmount(index);
                                    });

                                    //计算总金额
                                    $scope.data.isSelectedAll = 2;
                                    $scope.calTotalAll();

                                    //初始化备份旧关联数组
                                    $scope.data.currItem.scp_shopping_cartitems_old
                                        = angular.copy($scope.data.currItem.scp_shopping_cartitems);

                                });
                        });
                };

                /**
                 * 搜索
                 */
                $scope.search = function () {
                    return requestApi.post('scp_shopping_cart', 'select', {}).then(function (result) {
                        angular.extend($scope.data.currItem, result);
                    });
                };

                //刷新
                //$scope.refresh = $scope.search;

                /*---------------------按钮定义、事件定义--------------------------*/

                /**
                 * 在每次取得焦点时，更新旧关联数组为当前关联数组的备份
                 * @param index
                 */
                $scope.focusThenSetOld = function (index) {
                    $scope.data.currItem.scp_shopping_cartitems_old[index]
                        = angular.copy($scope.data.currItem.scp_shopping_cartitems[index]);
                };

                /**
                 * 重新设置不规范数据为原来数据的备份
                 * @param index
                 */
                $scope.resetRowData = function (index, field) {
                    $scope.data.currItem.scp_shopping_cartitems[index][field]
                        = angular.copy($scope.data.currItem.scp_shopping_cartitems_old[index][field]);
                };

                /**
                 * 增加购买数量[+]按钮点击事件
                 * @param index
                 */
                $scope.add = function (index) {
                    $scope.data.currItem.scp_shopping_cartitems[index].qty++;
                    $scope.onRowDataChange(index);
                };

                /**
                 * 减少购买数量[-]按钮点击事件
                 * @param index
                 */
                $scope.reduce = function (index) {
                    $scope.data.currItem.scp_shopping_cartitems[index].qty--;
                    $scope.onRowDataChange(index);
                };

                /**
                 *行数据单价、数量、折扣率变更事件(或失去焦点事件)
                 * @param field 字段名称
                 * @param index
                 */
                $scope.onRowDataChange = function (index, field) {

                    var rowData = angular.copy($scope.data.currItem.scp_shopping_cartitems[index]);

                    if (field == 'qty') {
                        //验证是否正整数
                        var regex = /^[0-9]*$/;
                        if (!regex.test(rowData.qty)) {
                            $scope.resetRowData(index, field);
                            return swalApi.info('请重新输入有效的数量');
                        }
                    } else if (field == 'discount_rate') {
                        //验证折扣率是否0~1之间的数字
                        var regex = /^(1|1\.[0]*|0?\.(?!0+$)[\d]+)$/im;
                        if (!regex.test(rowData.discount_rate)) {
                            $scope.resetRowData(index, field)
                            return swalApi.info('请输入有效的折扣率(大于0，小于等于100)');
                        }
                    } else if (field == 'price') {
                        //验证是否大于0的数字
                        var regex = /^\d+(\.\d+)?$/;
                        if (!regex.test($scope.data.currItem.scp_shopping_cartitems[index].price)) {
                            $scope.resetRowData(index, field)
                            return swalApi.info('请输入有效的价格(大于0的数字)');
                        }
                    }//之后可能加入note字段
                    //计算单行金额
                    $scope.calAmount(index);

                    var postdata = {
                        scp_shopping_cartitems: [rowData]
                    };
                    //行数据变更后发送请求更新后台数据
                    return requestApi.post('scp_shopping_cart', 'update', postdata);
                };

                /**
                 * 折上折变更事件
                 */
/*                $scope.onTwiceDiscountRateChange = function () {
                    var regex = /^(1|1\.[0]*|0?\.(?!0+$)[\d]+)$/im;

                    //验证折扣率是否0~1之间的数字
                    if (!regex.test($scope.data.currItem.twice_discount_rate + '')) {
                        $scope.data.currItem.twice_discount_rate = 1;
                        return swalApi.info('请输入有效的折扣率(大于0，小于等于100)');
                    }

                    //计算“优惠金额”与“总金额”
                    $scope.calTotalAll();
                }*/;

                /**
                 * [删除]按钮点击事件
                 * @param index
                 */
                $scope.deleteItem = function (index) {
                    return swalApi.confirmThenSuccess({
                        title: '确定要删除吗？',
                        okFun: function () {
                            var postdata = {
                                scp_shopping_cartitems: [$scope.data.currItem.scp_shopping_cartitems[index]]
                            };

                            requestApi.post('scp_shopping_cart', 'delcartitem', postdata).then(function () {
                                //移除该商品
                                $scope.data.currItem.scp_shopping_cartitems.splice(index, 1);
                                //设置备份数组
                                $scope.data.currItem.scp_shopping_cartitems_old
                                    = angular.copy($scope.data.currItem.scp_shopping_cartitems);
                                //重新计算总金额
                                $scope.calTotalAll();
                            })
                        },
                        okTitle: '删除成功'
                    });

                };

                /**
                 *  复选框值变更事件
                 */
                $scope.onSelectionChange = function () {
                    //设置全选框的勾选和总勾选商品数量
                    $scope.data.selectedCount = 0;
                    $scope.data.currItem.scp_shopping_cartitems.forEach(function (cur) {
                        if (cur.isSelected == 2) {
                            $scope.data.selectedCount++;
                        }
                    });
                    if ($scope.data.selectedCount == $scope.data.currItem.scp_shopping_cartitems.length) {
                        $scope.data.isSelectedAll = 2;
                    } else {
                        $scope.data.isSelectedAll = 1;
                    }

                    //计算“优惠金额”与“总金额”
                    $scope.calTotalAll();
                };

                /**
                 * 设置所有产品的勾选
                 * @param allSelected 是否全部勾选
                 */
                $scope.setShoppingCartSelectedAll = function () {
                    $scope.data.currItem.scp_shopping_cartitems.forEach(function (cur, idx) {
                        $scope.data.currItem.scp_shopping_cartitems[idx].isSelected
                            = ($scope.data.isSelectedAll == 2)?2:1;
                    });
                    $scope.onSelectionChange();
                };

                /**
                 * 打开报价单模态框
                 */
                $scope.genQuotedPrice = function () {

                    if($scope.data.currItem.scp_shopping_cartitems.length == 0){
                        return swalApi.info('请先为您的购物车添加一件商品');
                    }
                    localStorage.removeItem('shoppingCart');
                    localStorage.setItem('shoppingCart',JSON.stringify($scope.data.currItem.scp_shopping_cartitems));

                    var modalResultPromise = openBizObj({
                        stateName: 'epmman.epm_pdt_quoted_price_prop',
                        params: {
                            cart_id: $scope.data.currItem.cart_id
                        }
                    }).result;

                    //关闭模态框时清空本地存储，并刷新
                    modalResultPromise.finally(function(){
                        localStorage.removeItem('shoppingCart');
                        console.log('epm_pdt_quoted_price_prop closed!');
                        /*requestApi.post("scpallwf", "webwf", JSON.stringify({ "flag": $scope.data.currItem.workstat }))
                            .then(function (data) {
                                $scope.data.currItem.works = data.wfs;
                            });*/
                    });

                    return modalResultPromise;


                    /*return requestApi.post('scp_shopping_cart', 'genquotedprice', $scope.data.currItem)
                        .then(function (result) {
                            console.log(result,'result');
                        })*/
                };

                /**
                 * 产品图库[加入购物车]点击事件
                 */
                $(document).on('baseman.item_gallery.addCartItem', function (event, eventData) {
                    $scope.setAllSelected = false;
                    return $scope.doInit();
                });

                /**
                 * [返回图库]按钮点击事件
                 */
                $scope.backToGallery = function () {
                    $state.go('baseman.item_gallery');
                };

                /*---------------------计算逻辑--------------------------*/

                /**
                 * 计算单行金额
                 * @param index
                 * @param qty
                 * @param price
                 */
                $scope.calAmount = function (index) {
                    var rowData = $scope.data.currItem.scp_shopping_cartitems[index];
                    $scope.data.currItem.scp_shopping_cartitems[index].amount = numberApi
                        .mutiply(numberApi.mutiply(rowData.qty, rowData.price), rowData.discount_rate).toFixed(2);
                    //如果是勾选行，计算“优惠金额”与“总金额”
                    if (rowData.isSelected) {
                        $scope.calTotalAll();
                    }

                    return $scope.data.currItem.scp_shopping_cartitems[index].amount;
                };

                /**
                 * 计算“优惠金额”与“总金额”
                 */
                $scope.calTotalAll = function () {

                    //重置总金额
                    $scope.data.currItem.total_amount = 0;
                    //重置未优惠总金额
                    $scope.data.currItem.total_amount_undiscout = 0;

                    $scope.data.currItem.scp_shopping_cartitems.forEach(function (cur) {
                        if (cur.isSelected == 2) {
                            //计算总金额
                            $scope.data.currItem.total_amount
                                = numberApi.sum(cur.amount, $scope.data.currItem.total_amount).toFixed(2);
                            //计算未优惠的总金额
                            $scope.data.currItem.total_amount_undiscout
                                = numberApi.sum(numberApi.mutiply(cur.qty, cur.price), $scope.data.currItem.total_amount_undiscout).toFixed(2);
                        }
                    });

                    //计算二次折扣后的总金额
                    //$scope.data.currItem.total_amount
                    //    = numberApi.mutiply($scope.data.currItem.twice_discount_rate, $scope.data.currItem.total_amount);

                    //计算优惠金额
                    $scope.data.currItem.total_amount_saved = ($scope.data.currItem.total_amount_undiscout
                    - $scope.data.currItem.total_amount).toFixed(2);
                };
            }

        ];


        // 使用注册控制器Api注册控制器
        // 需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
)
;

