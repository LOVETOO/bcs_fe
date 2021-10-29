/**
 * 演示 - 新闻通知详情页
 * @hzj 2019-05-21
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'xss', 'directive/hcChart'], defineFn);
})(function (module, controllerApi, base_diy_page, requestApi, swalApi, xss) {

    /**
     * 控制器
     */
    newsDetail.$inject = ['$scope', 'BasemanService', '$stateParams', '$q'];
    function newsDetail($scope, BasemanService, $stateParams, $q) {

        controllerApi.extend({
            controller: base_diy_page.controller,
            scope: $scope
        });
        $scope.data = {
            currItem: {
                attachofemails: [],
                hot_rank_list: [],//知识排名
                my_common_list: [],//我的常用知识
                my_favorite_list: []//我的收藏
            }
        };

        function getCurrItem() {
            return $scope.data.currItem;
        };

        $scope.showpage = true;
        $scope.nowpage = 0;
        $scope.newsid = $stateParams.news_id

        /**
         * 添加分页插件
         */
        $scope.pageinit = function ($scope) {
            var total = $scope.data.currItem.scp_news_viewhs.length,//数据总条数
                pageNumber = 1,//当前页
                pageSize = 5, //每页显示的条数
                edges = 2,//两侧显示的页码数 大于1
                playes = 3,//主页码区显示的页码数 大于3
                pages = Math.ceil(total / pageSize);//总页数
            if (pages == 1) {
                playes = 1
            } else if (pages == 2) {
                playes = 2
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
                        start = pages - playes + 1
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
                        $scope.nowpage = num - 1;
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
                        $scope.nowpage -= 1;
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
                        $scope.nowpage += 1;
                        renderPageItem();
                    })
                }
                return $next;
            }

        }
        $scope.viewDoc = function (doc) {
            doc.docname = doc.docname;
            doc.docid = doc.docid;
            var url = "";
            if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                url = /*window.userbean.xturl +*/ "/viewImage.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
            }
            else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx") || doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls") || doc.docname.toLowerCase().endsWith(".txt")) || (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                url = /*window.userbean.xturl +*/ "/viewFile.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
            }
            else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                url = /*window.userbean.xturl +*/ "/viewPDF.jsp?docid=" + doc.docid + "&filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname + "&loginguid=" + encodeURIComponent(strLoginGuid);
            } else {
                swalApi.info("文件格式不支持");
            }
            if (url.length > 1) {
                window.open(url);
            }
        };

        /*---------------------执行业务--------------------------*/

        /**
         * 发表评论
         */
        $scope.publishDiscuss = function () {
            var postdata = {
                newsid: getCurrItem().newsid,
                discuss_content: getCurrItem().discuss_content
            };

            return requestApi.post("scp_news", "insertdiscuss", postdata)
                .then(function (data) {
                    getCurrItem().discuss_content = "";
                    swalApi.info("发表成功");
                }).then(function () {
                    $scope.searchDetail("refreshDiscuss");
                    //$scope.$digest();
                });
        };

        /**
         * 添加到收藏
         * @param newsid
         */
        $scope.insertFavorite = function (newsid) {
            return requestApi.post("scp_news", "insertfavorite", {newsid: $scope.data.currItem.newsid})
                .then(function (data) {
                    $scope.data.currItem.isfavorite = data.isfavorite;
                });
        };

        /*---------------------数据初始化、数据请求--------------------------*/

        $scope.doInit = function () {
            console.log("执行初始化");
            /**
             * 请求新闻详情
             */

           /* requestApi.post({
                classId: 'scp_news',
                action: 'select',
                data: {
                    newsid: $scope.newsid,
                    search_flag: 1
                }
            })*/
            $scope.searchDetail()
                .then(function () {
                //$scope.data.currItem = response;

                if($scope.data.currItem.subject==''){
                    $scope.noRight = true;//无权阅读，隐藏收藏按钮与发表评论按钮
                    swalApi.info('抱歉，当前账号所属的组织无阅读该文的权限！');
                    return $q.reject();
                }


                var option = {
                    whiteList: {
                        p: ['style', 'class', 'color'],
						div: ['class', 'style', 'color'],
						span: ['style', 'class', 'color'],
						img: ['src', 'alt', 'style', 'color'],
						b: ['style', 'class', 'color'],
						h1: ['style', 'class', 'color'],
						h2: ['style', 'class', 'color'],
						h3: ['style', 'class', 'color'],
						h4: ['style', 'class', 'color'],
						h5: ['style', 'class', 'color'],
						h6: ['style', 'class', 'color'],
						font: ['color', 'style', 'class', 'color'],
						br: ['style', 'class', 'color'],
						i: ['style', 'class', 'color'],
						u: ['style', 'class', 'color'],
						sup: ['style', 'class', 'color'],
						sub: ['style', 'class', 'color'],
						a: ['href', 'title', 'target', 'style', 'class', 'color'],
						strong: ['style', 'class', 'color'],
						ins: ['style', 'class', 'color'],
						table: ['style', 'class','width','cellpadding','cellspacing'],
						td: ['style', 'class'],
						tbody: ['style', 'class'],
						tr: ['style', 'class'],
						th: ['style', 'class'],
						thead: ['style', 'class'],
						tfoot: ['style', 'class'],
						caption: ['style', 'class'],
						ul: ['style', 'class'],
						li: ['style', 'class'],
						blockquote : ['style', 'class',"cite"],
						section : ['powered-by','style', 'class'],
						video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"],
						audio: ["autoplay", "controls", "loop", "preload", "src"],
						small: ['style', 'class', 'color'],
						col: ["align", "valign", "span", "width",'style', 'class', 'color'],
						colgroup: ["align", "valign", "span", "width",'style', 'class', 'color'],
						del: ["datetime",'style', 'class', 'color'],
						details: ["open",'style', 'class', 'color'],
						abbr: ["title"],
						address: ['style', 'class'],
						area: ["shape", "coords", "href", "alt",'style', 'class'],
						article: ['style', 'class'],
						aside: ['style', 'class'],
						big: ['style', 'class'],
						center: ['style', 'class'],
						cite: ['style', 'class'],
						code: ['style', 'class'],
						dd: ['style', 'class'],
						details: ["open",'style', 'class'],
						dl: ['style', 'class'],
						dt: ['style', 'class'],
						em: ['style', 'class'],
						header: ['style', 'class'],
						hr: ['style', 'class'],
						mark: ['style', 'class'],
						nav: ['style', 'class'],
						ol: ['style', 'class'],
						pre: ['style', 'class'],
						s: ['style', 'class']
                    },
                    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                        if (name.substr(0, 5) === 'data-') {
                            // 通过内置的escapeAttrValue函数来对属性值进行转义
                            return name + '="' + xss.escapeAttrValue(value) + '"';
                        }
                    }
                };
                var html = xss($scope.data.currItem.content, option);
                $('#content').html(html);
                $scope.data.currItem.attachofemails = $scope.data.currItem.scp_news_attachs;
                //将时间字符串转成Date格式
                $scope.data.currItem.pub_time = new Date($scope.data.currItem.pub_time);

                //初始化附件图标
                /*for (var i = 0; i < $scope.data.currItem.attachofemails.length; i++) {
                 $scope.data.currItem.attachofemails[i].icon_file = BasemanService.getAttachIcon($scope.data.currItem.attachofemails[i].docname);
                 }*/
                //初始化附件大小
                /* $scope.data.currItem.attachofemails.map((item) = > {
                 item.oldsize = parseInt((item.oldsize / 1024));
                 })
                 ;*/
                //
                if ($scope.data.currItem.scp_news_viewhs && $scope.data.currItem.scp_news_viewhs.length > 0) {
                    //调用分页插件
                    $scope.pageinit($scope);
                    //阅读记录分页(二维数组)
                    $scope.newsreaders = [];
                    $scope.pagesize = Math.ceil($scope.data.currItem.scp_news_viewhs.length / 5);
                    var start = 0;
                    var end = 5;
                    for (var i = 0; i < $scope.pagesize; i++) {
                        var arr = $scope.data.currItem.scp_news_viewhs.slice(start, end);
                        $scope.newsreaders.push(arr);
                        start += 5;
                        end += 5;
                    }
                } else {
                    //阅读记录为0时隐藏分页插件
                    $scope.showpage = false;
                }
            }).then(function () {
                //查询知识排名前4条
                $scope.searchHotRank();
                //查询我的常用知识前4条
                $scope.searchCommon();
                //查询我的收藏
                $scope.searchFavorite();
            });
        };

        /**
         * 搜索
         * @result 响应结果
         */
        $scope.searchDetail = function (exaction) {
            var postdata = {
                newsid: $scope.newsid,
                search_flag: 1
            };

            return requestApi.post("scp_news", "select", postdata)
                .then(function (data) {
                    $scope.data.currItem = data;
                    getCurrItem().pub_time = new Date(getCurrItem().pub_time);

                    //处理文章发表时间
                    var now = new Date();
                    var timeDifference = now.getTime() - new Date(getCurrItem().pub_time).getTime();//时间差（ms）

                    getCurrItem().pub_time_desc = "";
                    getCurrItem().pub_time_format = 'yyyy-MM-dd'

                    var hours = timeDifference/3600000;//小时差
                    var days = (timeDifference/3600000)/24;//天数差

                    if(days>1 && days <7)
                        getCurrItem().pub_time_desc =parseInt(days+"") +"天前";
                    else if(hours > 1 && days < 1)
                        getCurrItem().pub_time_desc =parseInt(hours+"") + "小时前";
                    else if(hours <= 1)
                        getCurrItem().pub_time_desc ="刚刚";

                    //处理评论时间
                    getCurrItem().scp_news_discusss = data.scp_news_discusss.map(function(cur){
                        timeDifference = now.getTime() - new Date(cur.create_time).getTime();//时间差（ms）
                        var create_time_desc ="";
                        var create_time_format = 'yyyy-MM-dd'
                        hours = timeDifference/3600000;//小时差
                        days = (timeDifference/3600000)/24;//天数差

                        if(days>1 && days <7)
                            create_time_desc =parseInt(days+"") +"天前";
                        else if(hours > 1 && days < 1)
                            create_time_desc =parseInt(hours+"") + "小时前";
                        else if(hours <= 1)
                            create_time_desc ="刚刚";

                        console.log(parseInt(days+"") +":"+days);
                        return{
                            headimgdocid:cur.headimgdocid,
                            reader_name:cur.reader_name,
                            discuss_content:cur.discuss_content,
                            create_time:new Date(cur.create_time),
                            create_time_format:create_time_format,
                            time_desc:create_time_desc
                        }
                    });

                    //搜索完后更新评论
/*
                    if (exaction == 'refreshDiscuss') {
                        getCurrItem().scp_news_discusss = data.scp_news_discusss.map(function(cur){
                            timeDifference = now.getTime() - new Date(cur.create_time).getTime();//时间差（ms）
                            var timeString ="";
                            hours = timeDifference/3600000;//小时差
                            days = (timeDifference/3600000)/24;//天数差

                            if(days > 7)
                                timeString=new Date(cur.create_time);
                            else if(hours >= 1 && days <7)
                                timeString ="7天内";
                            else if(hours < 1)
                                timeString ="1小时内";

                            return{
                                headimgdocid:cur.headimgdocid,
                                reader_name:cur.reader_name,
                                discuss_content:cur.discuss_content,
                                create_time:timeString
                            }
                        });
                    }
*/
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

        /*---------------------页面跳转--------------------------*/


        /**
         * 新窗口打开知识详情页面
         * @param newsid 知识id
         */
        $scope.detail = function (newsid) {
            var url = "index.jsp#/oa/scp_news_detail?news_id=" + newsid;
            window.open(url);
        }

        /**
         * 新标签页打开“知识库”页面
         */
        $scope.openKnowledge = function () {
            var url = "index.jsp#/oa/knowledge?title=知识库";
            window.open(url);
        };

        /**
         * 新标签页打开“发文管理”页面
         */
        $scope.openKnowledgeManage = function () {
            var url = "index.jsp#/oa/scp_news_list?title=发文管理";
            window.open(url);
        };

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: newsDetail
    });
});