function ctrl_mydesktop($scope, $state, $http, $rootScope, $modal, BasemanService, localeStorageService) {

    $scope.data = { wftype: 1 };
    //console.log($scope);
    //循环获得页面上待审批，我启动的，已完成的所有数据
    $scope.getwflist = function(flag) {
        $scope.data.wfcurrents = []; //所有循环的数据都放置在这里
        $scope.data.wftype = flag;
        BasemanService.RequestPost("omsworkhint", "search", { flag: flag })
            .then(function(data) {

                //$scope.data.wfcurrents = [];

                for (var i = 0; i < data.workhits.length; i++) {
                    var wf = data.workhits[i];
                    if (wf.subject == "") {
                        wf.subject = "无主题";
                    }
                    //url param
                    $.base64.utf8encode = true;
                    var param = { id: wf.objid, initsql: '', userid: window.strUserId }
                    wf.url_param = $.base64.btoa(JSON.stringify(param), true);

                    /*if (wf.delay_stat==undefined)
                    {
                        wf.delay_stat = 1;
                    }*/
                    var handed = false;
                    for (var j = 0; j < $scope.data.wfcurrents.length; j++) {
                        var wftmp = $scope.data.wfcurrents[j];
                        if (wftmp.wftempid == wf.wftempid) {
                            handed = true;
                            wftmp.wf.push(wf);
                            switch (wf.delay_stat) {
                                case "3":
                                    wftmp.overqty = wftmp.overqty + 1;
                                    break;
                                case "2":
                                    wftmp.delayqty = wftmp.delayqty + 1;
                                    break;
                                default:
                                    wftmp.normalqty = wftmp.normalqty + 1;
                                    break;
                            }
                            break;
                        }
                    };
                    if (!handed) {
                        //wf.delay_stat=3;
                        wftmp = {
                            wftempid: wf.wftempid,
                            wfname: wf.wfname,
                            normalqty: 0,
                            delayqty: 0,
                            overqty: 0,
                            wf: [],
                            hide: true,
                            normalqty: 0,
                            delayqty: 0,
                            overqty: 0
                        };

                        wftmp.wf.push(wf);

                        if ($scope.data.wfcurrents.length == 0) {
                            wftmp.hide = false;
                        }
                        switch (wf.delay_stat) {
                            case "3":
                                wftmp.overqty = 1;
                                break;
                            case "2":
                                wftmp.delayqty = 1;
                                break;
                            default:
                                wftmp.normalqty = 1;
                                break;
                        }
                        $scope.data.wfcurrents.push(wftmp);
                    };
                };

                /*for (var i=0; i <$scope.data.wfcurrents.length; i++)
                {
                    $scope.data.wfcurrents[i].chartdata = [
                        $scope.data.wfcurrents[i].normalqty, 
                        $scope.data.wfcurrents[i].delayqty,
                        $scope.data.wfcurrents[i].overqty];
                }

                console.log($scope.data.wfcurrents);*/
            });
    };

    $scope.getwflist(1);

    BasemanService.RequestPost("Base_Search", "search_home_page", { flag: 1 })
        .then(function(data) {
            console.log($scope);
            //console.log(data.base_remind_headers);
            $scope.data.reminds = data.base_remind_users;
			
			for (var i = 0; i < $scope.data.reminds.length; i++) {
                    var dph = $scope.data.reminds[i];

                    $.base64.utf8encode = true;
                    var param = { initsql: dph.sqlwhere }
                    dph.url_param = $.base64.btoa(JSON.stringify(param), true);

            }


        });
    BasemanService.RequestPost("Base_Search", "search_home_page", { flag: 2 })
        .then(function(data) {
            console.log(data);
            $scope.data.collections = data.base_collectio_users;

            console.log($scope.data.collections);
        });
    BasemanService.RequestPost("Base_Search", "search_home_page", { flag: 3 })
        .then(function(data) {
            console.log(data);
            $scope.data.pubnotice = data.base_notice_headers;

            console.log($scope.data.pubnotice);
            if (data.base_notice_header_attachs != undefined) {

                for (var i = 0; i < data.base_notice_header_attachs.length; i++) {
                    var att = data.base_notice_header_attachs[i];
                    att.url = '/downloadfile.do?docid=' + att.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    for (var j = 0; j < $scope.data.pubnotice.length; j++) {
                        if (att.notice_id == $scope.data.pubnotice[j].notice_id) {
                            if ($scope.data.pubnotice[j].attachs == undefined) {
                                $scope.data.pubnotice[j].attachs = [];
                            }
                            $scope.data.pubnotice[j].attachs.push(att);
                        }
                    }
                }
            }
        });

    //关注
    $scope.setRemind = function(index) {
        var item = $scope.data.base_remind_headers[index];
        BasemanService.RequestPost("base_remind_user", "insert", { remind_id: item.remind_id })
            .then(function(data) {
                item.is_focus = !item.is_focus;
                BasemanService.RequestPost("Base_Search", "search_home_page", { flag: 1 })
                    .then(function(data) {
                        console.log($scope);
                        //console.log(data.base_remind_headers);
                        $scope.data.reminds = data.base_remind_users;

                    });
            });
    };
    //取消关注
    $scope.setNoRemind = function(index) {
        var item = $scope.data.base_remind_headers[index];
        BasemanService.RequestPost("base_remind_user", "update", { remind_id: item.remind_id })
            .then(function(data) {
                item.is_focus = !item.is_focus;
                BasemanService.RequestPost("Base_Search", "search_home_page", { flag: 1 })
                    .then(function(data) {
                        console.log($scope);
                        //console.log(data.base_remind_headers);
                        $scope.data.reminds = data.base_remind_users;

                    });
            });
    };

    $scope.remindset = false;
    $scope.work_settings = function(e) {
        $scope.remindset = !$scope.remindset;
        if ($scope.remindset) {
            //关注列表
            BasemanService.RequestPost("base_remind_header", "search", { flag: 2 })
                .then(function(data) {
                    $scope.data.base_remind_headers = data.base_remind_headers;

                    for (var i = 0; i < $scope.data.base_remind_headers.length; i++) {
                        for (var j = 0; j < $scope.data.reminds.length; j++) {
                            $scope.data.base_remind_headers[i].is_focus = false;
                            if ($scope.data.base_remind_headers[i].remind_id == $scope.data.reminds[j].remind_id) {

                                $scope.data.base_remind_headers[i].is_focus = true;
                                break;
                            }
                        }
                    };

                    console.log($scope.data);
                });
        }
    };

    //跳转编辑
    $scope.edit = function(wf, event) {

        console.log(event);

    }

    $scope.wftempcheck = function(index) {

        $scope.data.wfcurrents[index].hide = !$scope.data.wfcurrents[index].hide;
    }


}

angular
    .module('inspinia')
    .controller('ctrl_mydesktop', ctrl_mydesktop)
