/**
 * 知识库
 * @hzj 2019-07-15
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'loopApi', 'directive/hcImg'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$state',
            //控制器函数


            function ($scope, $state) {
                /*----------------------------------数据定义-------------------------------------------*/
                //检索依据字段
                $scope.condition_field = 'subject';
                $scope.condition_field_chinese = '标题';

                $scope.data = {
                    currItem: {},
                    navi_list: [],//导航列表数据
                    knowledge_list: [],//知识列表数据
                    card_title: '最新知识'
                };

                /**
                 *继承“空白自定义页面”基础控制器
                 */
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*---------------------数据初始化、数据请求--------------------------*/

                /**
                 * 初始化数据
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {

                            //初始化导航列表
                            requestApi.post("scp_news_type", "search", {})
                                .then(function (data) {
                                    var types = data.scp_news_types;
                                    //通过$scope.indexer['pid']的方式指向navi_list数组的数据
                                    $scope.indexer = {};

                                    loopApi.forLoop(types.length, function (i) {

                                        if (types[i].pid == 0 || $scope.indexer[types[i].news_type_id]) {
                                            //子节点容器
                                            types[i].children = [];
                                            //将当前节点加入到导航列表一级节点容器
                                            $scope.data.navi_list.push(types[i]);
                                            $scope.last_element = $scope.data.navi_list[$scope.data.navi_list.length - 1];

                                            //索引已有，则将索引中的chidren属性赋值到navi_list中
                                            if ($scope.indexer[types[i].news_type_id])
                                                $scope.last_element.children = $scope.indexer[types[i].news_type_id].children;
                                            //索引尚无，则让索引[id]指向navi_list
                                            else
                                                $scope.indexer[types[i].news_type_id] = $scope.last_element;
                                        } else {
                                            if (!$scope.indexer[types[i].pid]) {
                                                $scope.indexer[types[i].pid] = {
                                                    children: []
                                                };
                                            }

                                            $scope.indexer[types[i].pid].children.push(types[i]);
                                        }
                                    });
                                });
                        }).then(function () {
                        //搜索“最新知识”
                        $scope.searchKnowledge(null, 5);
                        //查询知识排名前4条
                        $scope.searchHotRank();
                        //查询我的常用知识前4条
                        $scope.searchCommon();
                        //查询我的收藏
                        $scope.searchFavorite();
                    });
                };

                /**
                 * 键盘事件监听
                 * @param $event
                 */
                $scope.keyListener = function ($event) {
                    if ($event.key == 'Enter')
                        $scope.searchKnowledge();
                };

                /**
                 * 检索依据（下拉框）变更事件
                 * @param field 检索依据字段(subject:标题；summary：摘要)
                 */
                $scope.changeCondition = function (field) {
                    $scope.condition_field = field;

                    switch (field) {
                        case 'summary':
                            $scope.condition_field_chinese = '摘要';
                            break;
                        case 'tags':
                            $scope.condition_field_chinese = '标签';
                            break;
                        case 'content':
                            $scope.condition_field_chinese = '全文';
                            break
                    }
                    $scope.searchKnowledge();
                };

                /**
                 * 搜索知识
                 * @param element 节点数据。传入节点时认为是点击导航栏搜索数据。
                 * @param maxsearchrltcmt 查出的最大行数(为0时设置为系统默认)
                 */
                $scope.searchKnowledge = function (element, maxsearchrltcmt) {
                    console.log('searchKnowledge');
                    //sqlwhere =  检索依据字段：待被分词的文本，后台处理
                    $scope.condition = $scope.condition_field + ":" + $scope.condition_text;

                    var postdata = {
                        sqlwhere: (element) ? 'news_type_id = ' + element.news_type_id : "",//被点击链接时才赋值id
                        maxsearchrltcmt: (maxsearchrltcmt) ? maxsearchrltcmt : 0
                    };

                    //点击搜索按钮或搜索框失去焦点或按下回车搜索
                    if ($scope.condition_text && !element) {
                        postdata.sqlwhere += $scope.condition;
                        postdata.search_flag = 5;
                        $scope.data.card_title = $scope.condition_field_chinese + '检索';
                    }

                    requestApi.post('scp_news', 'search', postdata)
                        .then(function (data) {
                            //点击导航链接后，标题名称变更
                            if (element) {
                                $scope.data.card_title = element.news_type_name;
                            }
                            $scope.data.knowledge_list = data.scp_newss.map(function (cur) {
                                var now = new Date();
                                var timeDifference = now.getTime() - new Date(cur.create_time).getTime();//时间差（ms）

                                var create_time_desc = "";//时间描述
                                var create_time_format = "yyyy-MM-dd";

                                var hours = timeDifference / 3600000;//小时差
                                var days = (timeDifference / 3600000) / 24;//天数差

                                /*if(days > 7)
                                 create_time_format = 'yyyy-MM-dd';*/
                                if (days > 1 && days < 7)
                                    create_time_desc = parseInt(days + "") + "天前";
                                else if (hours > 1 && days < 1)
                                    create_time_desc = parseInt(hours + "") + "小时前";
                                else if (hours <= 1)
                                    create_time_desc = "刚刚";

                                return {
                                    newsid: cur.newsid,
                                    subject: cur.subject,
                                    summary: $scope.getTextFromHTML(cur.summary, 54),
                                    author: cur.author,
                                    tags: cur.tags,
                                    viewnum: cur.viewnum,
                                    create_time: new Date(cur.create_time),
                                    create_time_format: create_time_format,
                                    time_desc: create_time_desc
                                };
                            });
                            console.log($scope.data.knowledge_list, '$scope.data.knowledge_list');

                        });
                };

                /**
                 * 搜索知识排名
                 * @returns {*}
                 */
                $scope.searchHotRank = function () {
                    var postdata = {
                        maxsearchrltcmt: 4,
                        search_flag: 2
                    };

                    return requestApi.post("scp_news", "search", postdata)
                        .then(function (data) {
                            $scope.data.currItem.hot_rank_list = data.scp_newss;
                        });
                };

                /**
                 * 搜索我的常用知识
                 * @returns {*}
                 */
                $scope.searchCommon = function () {
                    var postdata = {
                        maxsearchrltcmt: 4,
                        search_flag: 3
                    };

                    //请求我的常用知识前4条
                    return requestApi.post("scp_news", "search", postdata)
                        .then(function (data) {
                            $scope.data.currItem.my_common_list = data.scp_newss;
                        });
                };

                /**
                 * 搜索我的收藏
                 * @returns {*}
                 */
                $scope.searchFavorite = function () {
                    var postdata = {
                        search_flag: 4
                    };

                    return requestApi.post("scp_news", "search", postdata)
                        .then(function (data) {
                            $scope.data.currItem.my_favorite_list = data.scp_newss;
                        });
                };

                /**
                 * 从html标签种提取文本内容
                 * @param htmlText 带html标签的文本
                 * @param length 提取文本的长度
                 * @returns {*} 处理好的文本
                 */
                $scope.getTextFromHTML = function (htmlText, length) {
                    //去除标签
                    var re = new RegExp('<[^<>]+>', 'g');
                    var text = htmlText.replace(re, "");
                    //去除 &nbsp;
                    text = text.replace(/&nbsp;/ig, "");
                    //截取指定长度
                    if (length)
                        text = text.substring(0, length);
                    return text;
                };

                /*---------------------导航栏事件--------------------------*/

                //记录节点的折叠
                $scope.isOff = {};
                //导航栏展开、折叠节点
                $scope.changeStatus = function (news_type_name) {
                    if (!$scope.isOff[news_type_name])
                        $scope.isOff[news_type_name] = false;
                    return $scope.isOff[news_type_name] = !$scope.isOff[news_type_name];
                };

                //导航栏高亮(或做其它突出显示)
                $scope.isHighLight = "";
                $scope.showHighLight = function (news_type_name) {
                    console.log($scope.isHighLight, 'show high light');
                    $scope.isHighLight = news_type_name;
                };

                /*---------------------页面跳转--------------------------*/

                /**
                 *  新窗口打开知识详情页面
                 * @param obj 知识id newsid 和分类名称 news_type_name
                 */
                // $scope.openDetailForKnowledge = function (obj) {
                //     var url = "index.jsp#/oa/scp_news_detail?news_id=" + obj.newsid
                //         + "&news_type_name=" + obj.news_type_name;
                //     window.open(url);
                // };

                /**
                 * 新窗口打开知识详情页面
                 * @param newsid 知识id
                 */
                $scope.openDetail = function (newsid) {
                    $state.go('oa.scp_news_detail', { news_id: newsid });
                };

                /**
                 * 新标签页打开“知识库”页面
                 */
                $scope.openKnowledge = function () {
                    $state.go('oa.knowledge');
                };

                /**
                 * 新标签页打开“发文管理”页面
                 */
                $scope.openKnowledgeManage = function () {
                    $state.go('oa.scp_news_list');
                };
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