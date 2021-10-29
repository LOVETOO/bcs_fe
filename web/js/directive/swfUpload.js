/**
 * 我的邮件-本地上传文件
 * @since 2018-12-28 qch
 */
define(
    ['module', 'directiveApi','swalApi','plugins/dropzone/dropzone'],
    function (module, directiveApi,swalApi) {
        //定义指令
        var directive = [
            '$timeout',
            function ($timeout) {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    scope: {
                        uploadList: '=',
                        importGrid: '=',
                        importColumns: '=',
                        importCust: '=',
                        uploadMethod: '&',
                        importComplete: '&',
                        hcMailattachsize:'=',//系统参数-限制附件大小,为0或者undefined时不限制
                        hideDelete:'='
                    },
                    link: function (scope, element, attrs, ngModel) {
                        /**
                         * 封装生成html方法
                         */
                        scope.reHtml = function (id, i, icon, fileurl, name, createtime, size,progressShow,hideDelete) {
                            var html = "<tr class='line' id=" + id + "  row=" + i + ">" +
                                "<td style='padding:10px'>" +
                                "<span style='padding-right : 8px'>" +
                                "<a class='fa " + icon + " ' href='" + fileurl + "' title='" + name + "' style='font-size:14px;' target='_blank' download></a>" +
                                name + "</span>" +
                                "<span style='color: #999;padding-right: 8px'>(" + Math.round(size / 1024) + "KB)</span>" +
                                (hideDelete?"":"<span ><a class='delete' title='删除' data-toggle='tooltip' data-placement='top' tooltip='' style='padding-right:6px;'>删除</a></span>") +
                                (progressShow ? "<div class='progress progress-mini'><div style='width: 0%;' class='progress-bar'></div>" : "") + /*上传进度*/
                                "</td>" +
                                "</tr>";
                            return html;
                        };

                        function strToJson(data) {
                            return JSON.parse(data);
                        }

                        scope.element = element;
                        var url_str = "/web/scp/filesuploadsave2.do";
                        var filed = attrs['filed']; //文件上传的区域
                        var filedstr = undefined;
                        if (filed) {
                            var filedstr = filed.replace("#", "-");
                        }
                        var flag = attrs['flag'] || 1; //上传类型
                        var fileid = ""; //文件ID 用于上传文件
                        var postdata = {
                            scpsession: window.strLoginGuid,
                            sessionid: window.strLoginGuid,
                        };
                        if (scope.importGrid) {
                            url_str = "/web/scp/filesuploadexcel.do";
                            postdata.classname = "com.dmcrm.baseman.Base_Excel";
                            postdata.funcname = "doImportFromExcel";
                            postdata.flag = flag;
                        }

                        function random4() {
                            var charactors = "1234567890";
                            var value = "";
                            for (j = 1; j <= 4; j++) {
                                i = parseInt(10 * Math.random());
                                value = value + charactors.charAt(i);
                            }
                            return value;
                        }

                        var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");

                        //columns
                        var getcolumns = function (columns) {
                            var columnsDef = [];
                            for (var i = 0; i < columns.length; i++) {
                                if (typeof columns[i].columns == 'object') {
                                    for (var j = 0; j < columns[i].columns.length; j++) {
                                        columnsDef[columnsDef.length] = columns[i].columns[j];
                                    }
                                } else {
                                    columnsDef[columnsDef.length] = columns[i];
                                }
                            }
                            return columnsDef;
                        }
                        $timeout(function () {

                            element.dropzone({
                                url: url_str,
                                maxFilesize: 1000,
                                paramName: "docFile0",
                                fallback: function () {
                                    swalApi.info("浏览器版本太低,文件上传功能将不可用！")
                                },
                                addRemoveLinks: true,
                                //acceptedFiles:'*.*',
                                params: postdata,
                                previewTemplate: tpl.prop("outerHTML"),
                                // previewsContainer: filed,
                                maxThumbnailFilesize: 5,
                                init: function () {
                                    this.on('addedfile', function (file) {
                                        //IncRequestCount();
                                        scope.importCust = scope.importCust ? scope.importCust : "";
                                        this.options.params.cust_id = scope.importCust;
                                        var list = [];
                                        if (scope.importColumns) {
                                            this.options.params.flag = 1;
                                            scope.importColumns = getcolumns(scope.importColumns);
                                            for (var i = 0; i < scope.importColumns.length; i++) {
                                                var col = scope.importColumns[i];
                                                if (col.children instanceof Array) {
                                                    this.options.params.flag = 2;
                                                    for (var j = 0; j < col.children.length; j++) {
                                                        var colchild = col.children[j]
                                                        var obj = {
                                                            field: colchild.field,
                                                            name: colchild.headerName,
                                                            pname: col.headerName,
                                                        };
                                                        if (colchild.cellEditorParams && colchild.cellEditorParams.values) {
                                                            obj.options = colchild.cellEditorParams.values;
                                                        }
                                                        if (colchild.cellEditor.name) {
                                                            if (colchild.cellEditor.name == "DateCellEditor") {
                                                                obj.type = "date";
                                                            } else if (colchild.cellEditor.name == "SelectCellEditor") {
                                                                obj.type = "number";
                                                            } else if (colchild.cellEditor.name == "NumericCellEditor" || colchild.cellEditor.name == "FloatCellEditor") {
                                                                obj.type = "number";
                                                            } else {
                                                                obj.type = "string";
                                                            }
                                                        } else {
                                                            obj.type = "string";
                                                        }
                                                        list.push(obj);
                                                    }
                                                    continue;
                                                }
                                                var obj = {
                                                    field: col.field,
                                                    name: col.headerName,
                                                };
                                                if (col.cellEditorParams && col.cellEditorParams.values) {
                                                    obj.options = col.cellEditorParams.values;
                                                }

                                                if (col.cellEditor.name) {
                                                    if (col.cellEditor.name == "DateCellEditor") {
                                                        obj.type = "date";
                                                    } else if (col.cellEditor.name == "SelectCellEditor") {
                                                        obj.type = "number";
                                                    } else if (col.cellEditor.name == "NumericCellEditor" || col.cellEditor.name == "FloatCellEditor") {
                                                        obj.type = "number";
                                                    } else {
                                                        obj.type = "string";
                                                    }
                                                } else {
                                                    obj.type = "string";
                                                }

                                                list.push(obj);
                                            }
                                        }
                                        this.options.params.columns = JSON.stringify(list);
                                        if (filed) {
                                            /**
                                             * 判断附件大小
                                             */
                                            if (scope.hcMailattachsize && (file.size / 1024 / 1024) > (scope.hcMailattachsize * 1)) {
                                                return swalApi.info("文件大小不能超过" + scope.hcMailattachsize + "M");
                                            }
                                            fileid = random4();
                                            file.id = "file_" + fileid;
                                            var icon = "fa-file-word-o";
                                            if (HczyCommon.getAttachIcon(file.name)) {
                                                icon = HczyCommon.getAttachIcon(file.name);
                                            }
                                            var filelist = scope.reHtml(file.id, i, icon, file.fileurl, file.name, new Date().Format('yyyy-MM-dd hh:mm:ss'), file.size, true);
                                                /*"<tr class='line' ng_mouseover='showActionButtons=true' ng_mouseleave='showActionButtons=false' id=" + file.id + "  row=" + i + ">" +
                                                "<td style='padding:10px' class='form-inline'>" +
                                                "<span class='block'>" +
                                                "<a class='fa " + icon + "' href='" + file.fileurl + "' title='" + file.name + "' style='font-size:14px ' target='_blank'>" + file.name + "</a>" +
                                                "</span><div class='progress progress-mini'>" +
                                                "<div style='width: 0%;' class='progress-bar'></div></div></td>" +
                                                "<td style='padding:10px' class='form-inline'>" + new Date().Format('yyyy-MM-dd hh:mm:ss') + "</td>" +
                                                "<td style='padding:10px' class='form-inline'>" + Math.round(file.size / 1024) + "KB</td>" +
                                                "<td style='padding:10px'><span ng-show='showActionButtons' class='pull-right hide'>" +
                                                "<a class='delete' title='删除' data-toggle='tooltip' data-placement='top' tooltip='' style='padding-right:6px;'><i class='fa fa-trash' style='font-size:20px'></i></a>" +
                                                "</span>" +
                                                "</td>" +
                                                "</tr>";*/
                                            $("#body" + filedstr).append(filelist);
                                            $('tr#' + file.id + ' .delete').bind('click', function () {
                                                var _this = this;
                                                /*ds.dialog.confirm("您确定删除该附件吗？", function () {
                                                    var $item = $(_this).closest(".line");
                                                    var index = $item.index();
                                                    scope.uploadList.splice(index, 1);
                                                    $item.detach();
                                                });*/
                                                swalApi.confirmThenSuccess({
                                                    title: "您确定删除该附件吗?",
                                                    okFun: function () {
                                                        var $item = $(_this).closest(".line");
                                                        var index = $item.index();
                                                        scope.uploadList.splice(index, 1);
                                                        $item.detach();
                                                    },
                                                    okTitle: '删除成功'
                                                });
                                            });
                                            $('tr#' + file.id).hover(function () {
                                                $(this).find("span.pull-right").toggleClass("hide");
                                            });

                                        } else {
                                        }

                                    })
                                        .on('dragstart', function (file) {
                                            return false;
                                        })
                                        .on('uploadprogress', function (file, percentage) {
                                            //Show Progress  // 上传进行中，显示进度
                                            file.id = "file_" + fileid;
                                            $(filed).find("tr#" + file.id).find("div.progress-bar").css('width', percentage + '%');

                                            $("#loading_text label").text(percentage + "%");
                                        })
                                        .on('success', function (file, json) {
                                            try {
                                                var obj = strToJson(json);
                                                if (obj.failure) {
                                                    swalApi.info("上传失败!")
                                                    //alert("上传失败!");
                                                    $('tr#' + file.id).detach();
                                                    return;
                                                }
                                                if (obj.success && !scope.importGrid) {
                                                    file.id = "file_" + fileid;
                                                    var attach = {};
                                                    attach.fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                                    attach.docid = obj.data[0].docid;
                                                    attach.docname = obj.data[0].docname;
                                                    attach.createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                                    attach.create_time = obj.data[0].create_time;
                                                    attach.downloadcode = obj.data[0].downloadcode;
                                                    attach.oldsize = obj.data[0].oldsize;
                                                    attach.index = obj.data[0].index;
                                                    scope.$apply(function () {
                                                        if (scope.uploadList == undefined) {
                                                            scope.uploadList = []
                                                        }
                                                        if (scope.uploadList) {
                                                            scope.uploadList.push(attach);
                                                        }
                                                    });

                                                    var fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                                    if (filed) {
                                                        //$('li#'+file.id+' a.close_delete_icon').detach();
                                                        swalApi.success("上传成功!");
                                                        $(filed).find('tr#' + file.id).attr("row", scope.uploadList.length);
                                                        $(filed).find('tr#' + file.id + ' .progress').hide();
                                                        $(filed).find('tr#' + file.id + ' td span a.fa').attr("href", fileurl);
                                                        $(filed).find('tr#' + file.id).attr("id", obj.data[0].docid);
                                                    }

                                                } else if (scope.importGrid) {

                                                    var grid = scope.importGrid.api;
                                                    var grid_data = [];
                                                    if (obj.data.base_excels) {
                                                        var len = obj.data.base_excels.length;
                                                        for (var j = 0; j < len; j++) {
                                                            grid_data.push(obj.data.base_excels[j]);
                                                        }
                                                    }
                                                    if (scope.uploadList) {
                                                        scope.uploadList = obj.data.base_excels;
                                                    } else {
                                                        grid.setRowData(grid_data);
                                                    }
                                                    if (obj.data.note_msg != undefined && obj.data.note_msg.length > 0) {
                                                        var arr = obj.data.note_msg.split(";")
                                                        arr.splice(arr.length - 1, 1);
                                                        arr.splice(0, 0, "Excel文件中存在错误");
                                                        swalApi.info(arr);
                                                    }
                                                    if (scope.importComplete) {
                                                        scope.importComplete(grid_data);
                                                    }

                                                    if (scope.importComplete) {
                                                        scope.importComplete(grid_data);
                                                    }
                                                }
                                            } catch (e) {
                                                swalApi.info("上传数据异常!");
                                            } finally {
                                                /**window.REQUESTPOST_TIMES--;
                                                 if (window.REQUESTPOST_TIMES < 1) {
									    $(".desabled-window").css("display", "none");
									}*/
                                            }

                                        })
                                        .on("error", function () {
                                            /**window.REQUESTPOST_TIMES--;
                                             if (window.REQUESTPOST_TIMES < 1) {
								    $(".desabled-window").css("display", "none");
								}
                                             console.log("File upload error");*/
                                        })
                                        .on('drop', function (file) {
                                            console.log("File Drop In");
                                        })
                                },
                            });
                        }); //end Timeout
                        function orginList() {
                            //如果本身含有附件
                            if (scope.uploadList && !scope.importGrid) {
                                var filedstr = filed.replace("#", "-")
                                /*$(filed).html("<table class='table table-hover table-striped '" +
                                    "<thead><tr >" +
                                    "<th width='50%'></th>" +
                                    "<th width='20%'></th>" +
                                    "<th width='15%'></th>" +
                                    "<th width='15%'> " +
                                    "</tr></thead>" +
                                    "<tbody id='body" + filedstr + "'></tbody>" +
                                    "</table>");*/
                                $(filed).html("<table class='table table-hover table-striped table-w'>" +
                                    "<thead><tr >" +
                                    "<th width='100%'></th>" +
                                    "</tr></thead>" +
                                    "<tbody id='body" + filedstr + "'></tbody>" +
                                    "</table>");
                                var html = "";
                                for (var i = 0; i < scope.uploadList.length; i++) {
                                    var icon = "fa-file-word-o";
                                    if (HczyCommon.getAttachIcon(scope.uploadList[i].docname)) {
                                        icon = HczyCommon.getAttachIcon(scope.uploadList[i].docname);
                                    }
                                    var fileurl = '/downloadfile.do?docid=' + scope.uploadList[i].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();

                                    html = scope.reHtml(scope.uploadList[i].docid, i, icon, fileurl, scope.uploadList[i].docname, scope.uploadList[i].createtime, scope.uploadList[i].oldsize,false,scope.hideDelete);
                                        /*"<tr class='line' ng_mouseover='showActionButtons=true' ng_mouseleave='showActionButtons=false' id=" + scope.uploadList[i].docid + "  row=" + i + "><td style='padding:10px' class='form-inline'>" +
                                        "<span class='block'>" +
                                        "<a class='fa " + icon + "' href='" + fileurl + "' title='" + scope.uploadList[i].docname + "' style='font-size:14px' target='_blank' download>" + scope.uploadList[i].docname + "</a>" +
                                        "</span></td>" +
                                        "<td style='padding:10px' class='form-inline'>" + scope.uploadList[i].createtime + "</td>" +
                                        "<td style='padding:10px' class='form-inline'>" + Math.round(scope.uploadList[i].oldsize / 1024) + "KB</td>" +
                                        "<td style='padding:10px'><span ng-show='showActionButtons' class='pull-right hide'>" +
                                        "<a class='delete' title='删除' data-toggle='tooltip' data-placement='top' tooltip='' style='padding-right:6px;'><i class='fa fa-trash' style='font-size:20px'></i></a>" +
                                        "</span>" +
                                        "</td>" +
                                        "</tr>";*/

                                    $("#body" + filedstr).append(html);
                                    $('tr#' + scope.uploadList[i].docid + ' .delete').bind('click', function () {
                                        var _this = this;
                                        /*ds.dialog.confirm("您确定删除该附件吗？", function () {
                                            var $item = $(_this).closest(".line");
                                            var index = $item.index();
                                            scope.uploadList.splice(index, 1);
                                            $item.detach();
                                        });*/
                                        swalApi.confirmThenSuccess({
                                            title: "您确定删除该附件吗?",
                                            okFun: function () {
                                                var $item = $(_this).closest(".line");
                                                var index = $item.index();
                                                scope.uploadList.splice(index, 1);
                                                $item.detach();
                                            },
                                            okTitle: '删除成功'
                                        });
                                    });
                                    var str = scope.element.attr("ng-disabled");
                                    if (str != undefined) {
                                        str = str.replace(/data./g, "scope.$parent.data.");
                                    } else {
                                        str = "scope.$parent.data.currItem.stat!=1";
                                    }
                                    var un_editable = false;
                                    try {
                                        un_editable = eval(str);
                                    } catch (error) {
                                        un_editable = false;
                                        console.log(error.message);
                                    }
                                    if (!un_editable) {
                                        $('tr#' + scope.uploadList[i].docid).hover(function () {
                                            $(this).find("span.pull-right").toggleClass("hide");
                                        });
                                    }
                                    $('tr#' + scope.uploadList[i].docid).bind("click", function () {
                                        console.log("OK");
                                    });
                                }
                            }

                        }

                        if (ngModel != undefined) {
                            ngModel.$render = function () {
                                var item = scope[attrs['ngModel']];
                                orginList();
                            }
                        }
                    }
                }
            }
        ];

        //使用Api注册指令
        //需传入require模块和指令定义
        return directiveApi.directive({
            module: module,
            directive: directive
        });
    }
);