/**
 * hjx
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'xss','fileApi','openBizObj', 'directive/hcChart'], defineFn);
})(function (module, controllerApi, base_diy_page, requestApi, swalApi, xss,fileApi,openBizObj) {

    /**
     * 控制器
     */
    newsDetail.$inject = ['$scope', '$stateParams', '$q', '$sce'];

    function newsDetail($scope, $stateParams, $q, $sce) {

        controllerApi.extend({
            controller: base_diy_page.controller,
            scope: $scope
        });
        $scope.data = {};
        $scope.data = {
            currItem: {

            }
        };
        $scope.wfProcs = [];
        $scope.newss=[];
        $scope.userOpinions = [];
        $scope.showpage = true;
        $scope.nowpage = 0;
        $scope.newsid = $stateParams.id;
        $scope.status=$stateParams.modify_status;
        $scope.process=$stateParams.process;
        $scope.record=$stateParams.record;
        $scope.dispatch=$stateParams.dispatch;
        $scope.html = '';
        $scope.other_tab = {
            home: {
                title: '阅读记录',
                active: true
            },
            opinion: {
                title: '审批流程'
            }
        }
        /**
         * 添加分页插件
         */
        $scope.pageinit = function ($scope) {
            var total = $scope.data.currItem.scp_news_viewhs.length,//数据总条数
                pageNumber = 1,//当前页
                pageSize = 30, //每页显示的条数
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
                $('#pageBox' + $scope.newsid).empty().append($ul);
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
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx") || doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls") || doc.docname.toLowerCase().endsWith(".txt")) || (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                url = /*window.userbean.xturl +*/ "/viewFile.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
            } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                url = /*window.userbean.xturl +*/ "/viewPDF.jsp?docid=" + doc.docid + "&filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname + "&loginguid=" + encodeURIComponent(strLoginGuid);
            } else {
                swalApi.info("文件格式不支持");
            }
            if (url.length > 1) {
                window.open(url);
            }
        };

        /**
    * 请求新闻详情
    */
        requestApi.post("scp_news", "select", { newsid: $scope.newsid, search_flag: 1 })
            .then(function (response) {
               
                    //判断是否隐藏流程
                    if(response.cannot_show_process==2 && $scope.process==1){
                        $scope.other_tab.opinion.hide=true;
                    }
                    //判断是否隐藏阅读记录
                    if(response.cannot_reading_records==2 && $scope.record==1){
                        $scope.other_tab.home.hide=true;
                        $('#home').hide(); 
                    }
                    if(response.cannot_download_attach!=2){
                        $scope.status=0;
                    }
                    if(response.cannot_download_dispatch==2 && $scope.dispatch==1){
                        $scope.toolButtons.xiazai.hide=true;  
                    }
                
                $scope.data.currItem = response;
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
                        table: ['style', 'class', 'width', 'cellpadding', 'cellspacing'],
                        td: ['style', 'class'],
                        tbody: ['style', 'class'],
                        tr: ['style', 'class'],
                        th: ['style', 'class'],
                        thead: ['style', 'class'],
                        tfoot: ['style', 'class'],
                        caption: ['style', 'class'],
                        ul: ['style', 'class'],
                        li: ['style', 'class'],
                        blockquote: ['style', 'class', "cite"],
                        section: ['powered-by', 'style', 'class'],
                        video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"],
                        audio: ["autoplay", "controls", "loop", "preload", "src"],
                        small: ['style', 'class', 'color'],
                        col: ["align", "valign", "span", "width", 'style', 'class', 'color'],
                        colgroup: ["align", "valign", "span", "width", 'style', 'class', 'color'],
                        del: ["datetime", 'style', 'class', 'color'],
                        details: ["open", 'style', 'class', 'color'],
                        abbr: ["title"],
                        address: ['style', 'class'],
                        area: ["shape", "coords", "href", "alt", 'style', 'class'],
                        article: ['style', 'class'],
                        aside: ['style', 'class'],
                        big: ['style', 'class'],
                        center: ['style', 'class'],
                        cite: ['style', 'class'],
                        code: ['style', 'class'],
                        dd: ['style', 'class'],
                        details: ["open", 'style', 'class'],
                        dl: ['style', 'class'],
                        dt: ['style', 'class'],
                        em: ['style', 'class'],
                        header: ['style', 'class'],
                        hr: ['style', 'class'],
                        mark: ['style', 'class'],
                        nav: ['style', 'class'],
                        ol: ['style', 'class'],
                        pre: ['style', 'class'],
                        s: ['style', 'class'],
                        label: ['style', 'class'],
                        style: []
                    },
                    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                        if (name.substr(0, 5) === 'data-') {
                            // 通过内置的escapeAttrValue函数来对属性值进行转义
                            console.log(name);
                            return name + '="' + xss.escapeAttrValue(value) + '"';
                        }
                    },  
                    
                };
                option.whiteList['o:p'] = [];
                var html = filterXSS($scope.data.currItem.content, option);
                $scope.html = $sce.trustAsHtml(html);
                if ($scope.data.currItem.scp_news_viewhs && $scope.data.currItem.scp_news_viewhs.length > 0) {
                    //调用分页插件
                    $scope.pageinit($scope);
                    //阅读记录分页(二维数组)
                    $scope.newsreaders = [];
                    $scope.pagesize = Math.ceil($scope.data.currItem.scp_news_viewhs.length / 30);
                    var start = 0;
                    var end = 30;
                    for (var i = 0; i < $scope.pagesize; i++) {
                        var arr = $scope.data.currItem.scp_news_viewhs.slice(start, end);
                        $scope.newsreaders.push(arr);
                        start += 30;
                        end += 30;
                    }
                    for (var i = 0; i < $scope.newsreaders.length; i++) {
                        var arr1 = $scope.newsreaders[i].slice(0, 10);
                        var arr2 = $scope.newsreaders[i].slice(10, 20);
                        var arr3 = $scope.newsreaders[i].slice(20, 30);
                        $scope.newsreaders[i] = [];
                        $scope.newsreaders[i][0] = arr1;
                        $scope.newsreaders[i][1] = arr2;
                        $scope.newsreaders[i][2] = arr3;
                    }
                    $scope.setWidth();
                   

                } else {
                    //阅读记录为0时隐藏分页插件
                    $scope.showpage = false;
                }
            }).then(function () {
                if ($scope.data.currItem.wfid) {
                    requestApi.post("scpwf", "select", { wfid: $scope.data.currItem.wfid })
                        .then(function (response) {
                            $scope.wfProcs = response.wfprocofwfs.slice(1, response.wfprocofwfs.length - 1);
                            console.log($scope.wfProcs);
                            $scope.wfProcs.forEach(function (wfProc) {
                                if (wfProc.useropinionofwfprocs) {
                                    wfProc.useropinionofwfprocs.forEach(function (userOpinion) {
                                        if (userOpinion.stat == 1) {
                                            userOpinion.statname = '未到达';
                                        }
                                        else if (userOpinion.act == 4) {
                                            userOpinion.statname = '转办';
                                        }
                                        else if (userOpinion.stat == 5) {
                                            userOpinion.statname = '驳回';
                                        }
                                        else if (userOpinion.stat == 7) {
                                            userOpinion.statname = '提交';
                                        }
                                        $scope.userOpinions.push(userOpinion);//将所有意见堆放到一个数组;
                                    });
                                }
                            })
                            console.log($scope.userOpinions);
                        });
                }

            });
        $scope.setWidth = function () {
            var t = setInterval(function () {
                if ($('.readitem').length > 0) {
                    if ($scope.newsreaders[$scope.nowpage][1].length == 0 && $scope.newsreaders[$scope.nowpage][2].length == 0) {
                        //只有10条一下数据，显示一个div时宽度100%
                        $('.readitem').css('width', '100%')
                    } else if ($scope.newsreaders[$scope.nowpage][1].length > 0 && $scope.newsreaders[$scope.nowpage][2].length == 0) {
                        //只有10条到20数据，显示两个个div时宽度45%
                        console.log(2, $('.readitem'));
                        $('.readitem').css('width', '45%');
                    } else {
                        console.log(3, $('.readitem'));
                        $('.readitem').css('width', '33%');
                    }
                    clearInterval(t);
                }
            }, 10)
        }
        /*---------------------自定义按钮方法--------------------------*/
        $scope.toolButtons.xiazai={
            title: '打印',
            groupId: 'base',
            icon: 'iconfont hc-moreunfold',
            click: function () {
                $scope.downloadDispatch();
            }

        }

        
        $scope.downloadDispatch=function(){

            //判断iframe是否存在，不存在则创建iframe
            var iframe=document.getElementById("print-iframe");
            if(!iframe){  
                    var el = document.getElementById("printcontent");
                    iframe = document.createElement('IFRAME');
                    var doc = null;
                    iframe.setAttribute("id", "print-iframe");
                    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
                    document.body.appendChild(iframe);
                    doc = iframe.contentWindow.document;
                    //这里可以自定义样式
                    //doc.write("<LINK rel="stylesheet" type="text/css" href="css/print.css">");
                    doc.write('<div>' + el.innerHTML + '</div>');
                    doc.close();
                    iframe.contentWindow.focus();            
            }
            iframe.contentWindow.print();
            if (navigator.userAgent.indexOf("MSIE") > 0){
                document.body.removeChild(iframe);
            }
        }

        /*---------------------附件相关方法--------------------------*/
        /**
         * 附件添加
         */
        $scope.addAttach = function () {
            return fileApi.uploadFile({
                multiple: true,
                accept: 'txt/doc/docx/xlsx/*'
            }).then(function (docs) {
                docs.forEach(function (value) {
                    var obj = {};
                    obj.docid = value.docid;
                    obj.docname = value.docname;
                    $scope.data.currItem.scp_news_attachs.push(obj);
                })
            });
        };

        /**
         * 附件删除
         */
        $scope.delAttach = function (idx) {
            $scope.data.currItem.scp_news_attachs.splice(idx, 1);
        };

        /**
         * 附件下载
         * @param idx
         */
        $scope.downloadAttach = function (idx) {
            fileApi.downloadFile($scope.data.currItem.scp_news_attachs[idx]);
        };

        /**
         * 附件打开
         */
        $scope.open = function (doc) {
            if (fileApi.isImage(doc)) {
                openBizObj({
                    imageId: doc.docid,
                    images: $scope.data.currItem.scp_news_attachs
                });
            } else {
                fileApi.openFile(doc);
            }
        };

        /**
         * 附件样式
         * @param idx
         * @returns {*}
         */
        $scope.attachClass = function (idx) {
            var doc = $scope.data.currItem.scp_news_attachs[idx];
            var docname = doc.docname;
            var suffix = $scope.getAttachSuffix(docname);

            if (suffix == 'doc' || suffix == 'docx') {
                return 'hc-word';
            } else if (suffix == 'xls' || suffix == 'xlsx') {
                return 'hc-excel';
            } else if (suffix == 'ppt' || suffix == 'pptx') {
                return 'hc-ppt';
            } else if(suffix == 'mp4'){
                return 'hc-file_classify_video';
            }else {
                return 'hc-file_classify_image';
            }

        };

        /**
         * 附件后缀获取
         */
        $scope.getAttachSuffix = function (docname) {
            var suffix = docname.substr(docname.lastIndexOf('.') + 1);
            return suffix;
        };

        /**
         * 是否图片格式(jpg,png,jpeg)
         */
        $scope.isImage = function (docname) {
            var picSuffix = ['jpg', 'png','jpeg'];
            var suffix = docname.substr(docname.lastIndexOf('.') + 1);

            if (picSuffix.indexOf(suffix) != -1) {
                return true;
            }

            return false;
        };

       


    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: newsDetail
    });
});