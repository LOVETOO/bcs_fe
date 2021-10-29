var billmanControllers = angular.module('inspinia');
function mail($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService,$sce) {

    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "scpemail",
        key: "emailid",
        //wftempid: 10003,
        FrmInfo: {},
        grids: []
    };

    //继承基类方法
    mail = SinoccCommon.extend(mail, ctrl_view_public);
    mail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    $scope.data.currItem={
        attachofemails1:[]
    };
    var TimeFn = null;
    /**if(parseInt($location.search().flag)==2){
		$scope.data.title="已发邮件";
	}else if(parseInt($location.search().flag)==3){
		$scope.data.title="重要邮件";
	}else if(parseInt($location.search().flag)==4){
		$scope.data.title="草稿";
	}else if(parseInt($location.search().flag)==5){
		$scope.data.title="垃圾箱";
	}else{
        $scope.data.title="邮箱";
	}*/
    if (window.userbean) {
        $scope.userbean = window.userbean;
        if(!$scope.userbean.avatar){
            $scope.userbean.avatar = 'img/aux-48px.jpg';
        }

    }
    $scope.data.show=1;
    $scope.fw_addfile = function(){
        BasemanService.openFrm("views/baseman/myfiles_frm.html", myfiles, $scope, "", "").result.then(function (res) {
            for(var i=0;i<res.length;i++){
                for(var j=0;j<$scope.data.currItem.attachofemails1.length;j++){
                    if(parseInt(res[i].docid) == parseInt($scope.data.currItem.attachofemails1[j].docid)){
                        break;
                    }
                }
                if(j==$scope.data.currItem.attachofemails1.length){
                    $scope.data.currItem.attachofemails1 = $scope.data.currItem.attachofemails1.concat([res[i]]);
                }
            }
        })
    }


    $scope.open_setting =function(){
        BasemanService.openFrm("views/baseman/mail_setting.html", mail_setting, $scope, "", "").result.then(function (res) {
        })
    }
    //
    $scope.follow_mail =function(){
        var postdata={};
        $scope.emailofemails =[];
        for(var i=$scope.data.emails.length-1;i>-1;i--){
            if($scope.data.emails[i].checkbox==2){
                $scope.emailofemails.push($scope.data.emails[i]);
            }
        }
        if($scope.emailofemails.length!=1){
            BasemanService.notice("跟踪只能是一条邮件", "alert-info");
            return;
        }



        BasemanService.openFrm("views/baseman/follow_mail.html", follow_mail, $scope, "", "").result.then(function (res) {


        })
    }
    // 跟踪邮件
    var follow_mail = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        follow_mail = SinoccCommon.extend(follow_mail, ctrl_bill_public);
        follow_mail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={
            subject:$scope.$parent.emailofemails[0].subject
        };

        BasemanService.RequestPost("scpemail", "selecttrk", {emailid:parseInt($scope.$parent.emailofemails[0].emailid)}).then(function (data) {
            $scope.data.currItem.emailtrkofemails = data.emailtrkofemails;
            $scope.options_acl.api.setRowData($scope.data.currItem.emailtrkofemails);
        })


        $scope.ok =function(){
            $modalInstance.close($scope.data.currItem);
        }
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }
        //权限列表
        $scope.options_acl = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            // selectAll:true,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            showToolPanel: false,
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_acl = [{
            headerName: "阅读状态",
            field: "flag",
            width: 120,
            cellEditor: "下拉框",
            editable: false,
            cellEditorParams: {
                values: [{
                    value: 1,
                    desc: "未阅"
                }, {
                    value: 2,
                    desc: "已阅"
                }, {
                    value: 9,
                    desc: "已撤回"
                }]
            }
        }, {
            headerName: "收件人",
            field: "sendto",
            width: 100,
            cellEditor: "文本框",
            editable: false
        }, {
            headerName: "阅读时间",
            field: "readtime",
            width: 140,
            cellEditor: "文本框",
            editable: false
        }];
    }
    //回撤
    $scope.retreat_mail = function(){
        var postdata={};
        emailofemails =[];
        for(var i=$scope.data.emails.length-1;i>-1;i--){
            if($scope.data.emails[i].checkbox==2){
                emailofemails.push($scope.data.emails[i]);
            }
        }
        if(emailofemails.length!=1){
            BasemanService.notice("回撤只能是一条邮件", "alert-info");
            return;
        }

        postdata.emailid = parseInt(emailofemails[0].emailid);
        postdata.subject = (emailofemails[0].subject);
        ds.dialog.confirm("确定撤回邮件吗?\n 1.仅支持撤回OA邮件 \n 2.如果撤回成功,对方看到的邮件被清除 \n 3.对方已阅读,不予撤回 \n 4.撤回结果可点邮件跟踪查看", function () {
            BasemanService.RequestPost("scpemail", "revoke", postdata).then(function (data) {

                BasemanService.notice("回撤成功!", "alert-info");
                $scope.follow_mail();
            })
        })


    }
    $scope.scroll =function(){

        $('.mail-attachment')[0].scrollIntoView(true);

    }
    //文件预览
    $scope.viewDoc = function (doc) {
        doc.docname = doc.refname;
        doc.docid = doc.refid
        var url = "";
        if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
            url = window.userbean.xturl+ "/viewImage.jsp?" +"filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
        }
        else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx") || doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls") || doc.docname.toLowerCase().endsWith(".txt") )||(doc.docname.toLowerCase().endsWith(".ppt") )||(doc.docname.toLowerCase().endsWith(".pptx") )) {
            url =  window.userbean.xturl + "/viewFile.jsp?"+ "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
        }
        else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf") )) {
            url = window.userbean.xturl + "/viewPDF.jsp?docid=" + doc.docid + "&filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname + "&loginguid=" + encodeURIComponent(strLoginGuid);
        }else{
            BasemanService.notice("文件格式不支持", "alert-info");
        }
        if (url.length > 1) {

            window.open(url);
        }
    }

    BasemanService.RequestPost("scpusermail", "search", {}).then(function (data) {
        $scope.data.usermails = data.usermails;
        for(var i=0;i<$scope.data.usermails.length;i++){
            if(parseInt($scope.data.usermails[i].isdefault)==2){
                $scope.data.email = $scope.data.usermails[i].email
                $scope.data.usermailid = $scope.data.usermails[i].usermailid
            }
        }
        $scope.mailserverids=[];
        for(var i=0;i<data.dicts.length;i++){
            data.dicts[i].value = parseInt(data.dicts[i].value);
        }
        $scope.mailserverids = data.dicts;
    })
    //
    $scope.add_outmail =function(){

        $(".desabled-window").css("display", "flex");
        BasemanService.RequestPost("scpusermail", "receive", {flag:99}).then(function (data) {
            BasemanService.notice("收信成功", "alert-info");
            $scope.show_box(6);
            $(".desabled-window").css("display", "none");
        },function(){
            $(".desabled-window").css("display", "none");
        })
    }
    $scope.tooglass =function(e){
        if(e.currentTarget.id=='stationery_cmd'){
            e.currentTarget.className='cptab cpslt'
            $('#addr_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display='block'
            $('#AddrTab')[0].style.display='none'
        }else{
            e.currentTarget.className='cptab cpslt'
            $('#stationery_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display='none'
            $('#AddrTab')[0].style.display='block'
        }
    }
    $scope.tooglass_out =function(e){
        if(e.currentTarget.id=='addr_cmdin'){
            e.currentTarget.className='cptab cpslt'
            $('#addr_cmdout').removeClass('cpslt');
            $('#addr_in')[0].style.display='block'
            $('#addr_out')[0].style.display='none'
        }else{
            e.currentTarget.className='cptab cpslt'
            $('#addr_cmdin').removeClass('cpslt');
            $('#addr_in')[0].style.display='none'
            $('#addr_out')[0].style.display='block'
        }
    }

    //添加联系人
    $scope.addpeople =function(e){
        //内部邮箱
        if($scope.data.flag<=5){
            $scope.addpeople_in();
        }else{
            //外部邮箱加联系人
            $scope.addpeople_out();
        }
    }

    $scope.addpeople_in =function(){
        BasemanService.openFrm("views/baseman/addpeople.html", addpeople, $scope, "", "").result.then(function (res) {
            if(res.cs_people){
                if($scope.data.currItem.cc==undefined){
                    $scope.data.currItem.cc='';

                }
                for(var i=0;i<res.cs_people.length;i++){
                    if($scope.data.currItem.cc==''){
                        $scope.data.currItem.cc=$scope.addpeople_str($scope.data.currItem.cc,res.cs_people[i],1)
                    }else{
                        if($scope.data.currItem.cc.indexOf($scope.data.currItem.cc+res.cs_people[i].username)>-1){
                            continue;
                        }else{
                            $scope.data.currItem.cc=$scope.addpeople_str($scope.data.currItem.cc,res.cs_people[i],1)
                        }

                    }
                }
            }

            if(res.sj_people){
                if($scope.data.currItem.snedto==undefined){
                    $scope.data.currItem.snedto='';
                }
                for(var i=0;i<res.sj_people.length;i++){
                    if($scope.data.currItem.snedto==''){
                        $scope.data.currItem.snedto=$scope.addpeople_str($scope.data.currItem.snedto,res.sj_people[i],2);
                    }else{
                        if($scope.data.currItem.snedto.indexOf($scope.data.currItem.snedto+res.sj_people[i].username)>-1){
                            continue;
                        }else{
                            $scope.data.currItem.snedto=$scope.addpeople_str($scope.data.currItem.snedto,res.sj_people[i],2)
                        }

                    }
                }
            }
        })
    }

    $scope.addpeople_out =function(){
        BasemanService.openFrm("views/baseman/addpeople_out.html", addpeople_out, $scope, "", "").result.then(function (res) {
            if(res.cs_people){
                if($scope.data.currItem.cc==undefined){
                    $scope.data.currItem.cc='';

                }
                for(var i=0;i<res.cs_people.length;i++){
                    if($scope.data.currItem.cc==''){
                        $scope.data.currItem.cc=$scope.addpeople_str($scope.data.currItem.cc,res.cs_people[i],1)
                    }else{
                        if($scope.data.currItem.cc.indexOf($scope.data.currItem.cc+res.cs_people[i].username)>-1){
                            continue;
                        }else{
                            $scope.data.currItem.cc=$scope.addpeople_str($scope.data.currItem.cc,res.cs_people[i],1)
                        }

                    }
                }
            }

            if(res.sj_people){
                if($scope.data.currItem.snedto==undefined){
                    $scope.data.currItem.snedto='';
                }
                for(var i=0;i<res.sj_people.length;i++){
                    if($scope.data.currItem.snedto==''){
                        $scope.data.currItem.snedto=$scope.addpeople_str($scope.data.currItem.snedto,res.sj_people[i],2)
                    }else{
                        if($scope.data.currItem.snedto.indexOf($scope.data.currItem.snedto+res.sj_people[i].username)>-1){
                            continue;
                        }else{
                            $scope.data.currItem.snedto=$scope.addpeople_str($scope.data.currItem.snedto,res.sj_people[i],2)
                        }

                    }
                }
            }
        })
    }
    $scope.choose_mailbox =function(usermailid,email){
        $scope.data.usermailid = usermailid;
        $scope.data.email = email;

    }
    //关闭查询联系人
    $scope.close_people = function(){
        if($scope.data.is_search == 2){
            $scope.data.is_search = 1;
            $scope.data.username='';
        }
    }

    //查询联系人
    $scope.search_peopele = function(flag){
        $scope.data.is_search = 2;
        if($scope.data.username==''||$scope.data.username==undefined){
            $scope.data.is_search = 1;
            return;
        }
        if(flag==2){
            var emailtype = 4;
        }else{
            var emailtype = 3;
        }
        BasemanService.RequestPost("scpemail_contact_list", "search", {username:$scope.data.username,flag:3,emailtype:emailtype}).then(function (data) {
            $scope.data.currItem.scporgs = data.scporgs;
        })
    }
    $scope.contact_people =function(e,index){
        $scope.index = index;
        $(e.delegateTarget).siblings().removeClass("high");
        $(e.delegateTarget).addClass('high');
        //增加抄送人
        if($scope.focus==2){
            if($scope.data.flag<=5){
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,$scope.data.currItem.scporgs[index]);
            }else{
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,$scope.data.currItem.scporgs[index]);
            }


            //增加收件人
        }else{
            if($scope.data.flag<=5){
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,$scope.data.currItem.scporgs[index]);
            }else{

                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,$scope.data.currItem.scporgs[index]);
            }
        }
        //var l=$("input:focus");
    }
    //点击通讯录联系人
    $scope.contact_man =function(e,index){
        $scope.index = index;
        $(e.delegateTarget).siblings().removeClass("high");
        $(e.delegateTarget).addClass('high');
        //增加抄送人
        if($scope.focus==2){
            if($scope.data.flag<=5){
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,$scope.data.currItem.scpemail_contact_lists[index]);
            }else{
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,$scope.data.currItem.scpemail_contact_wb_lists[index]);
            }


            //增加收件人
        }else{
            if($scope.data.flag<=5){
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,$scope.data.currItem.scpemail_contact_lists[index]);
            }else{
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,$scope.data.currItem.scpemail_contact_wb_lists[index]);
            }
        }

        //var l=$("input:focus");
    }
    $scope.add_contact_man = function(){
        $scope.add_index =true;
        BasemanService.openFrm("views/baseman/addgrouppeop_out.html", cha_contact_man, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype =4;
            BasemanService.RequestPost("scpemail_contact_list", "add_contact", postdata)
                .then(function(data) {
                    $scope.data.currItem.scpemail_contact_wb_lists.push(data);
                    BasemanService.notice("新增成功", "alert-info");
                })
        })
    }

    $scope.del_contact_man = function(){
        if(($scope.index==''||$scope.index==undefined)&&$scope.index!=0){
            BasemanService.notice("请选中一行", "alert-info");
            return;
        }
        var postdata ={};
        postdata.list_id=parseInt($scope.data.currItem.scpemail_contact_wb_lists[$scope.index].list_id)
        BasemanService.RequestPost("scpemail_contact_list", "del_contact", postdata)
            .then(function(data) {
                BasemanService.notice("删除成功", "alert-info");
                $scope.data.currItem.scpemail_contact_wb_lists.splice($scope.index,1);
            })
    }
    $scope.cha_contact_man = function(){
        $scope.add_index =false;
        if(!$scope.add_index){
            if(($scope.index==''||$scope.index==undefined)&&($scope.index!=0)){
                BasemanService.notice("请选中一行联系人", "alert-info");
                return;
            }
        }
        BasemanService.openFrm("views/baseman/addgrouppeop_out.html", cha_contact_man, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype =4;
            BasemanService.RequestPost("scpemail_contact_list", "add_contact", postdata)
                .then(function(data) {
                    BasemanService.notice("修改成功", "alert-info");
                })
        })
    }
    var cha_contact_man = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        cha_contact_man = SinoccCommon.extend(cha_contact_man, ctrl_bill_public);
        cha_contact_man.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={};
        if($scope.add_index){

        }else{
            $scope.data.currItem = $scope.$parent.data.currItem.scpemail_contact_wb_lists[$scope.$parent.index];
        }

        $scope.ok =function(){
            if($scope.data.currItem.contactname ==undefined||$scope.data.currItem.contactname ==''){
                BasemanService.notice("名称为空", "alert-info");
                return;
            }
            if($scope.data.currItem.contactuserid ==undefined||$scope.data.currItem.contactuserid ==''){
                BasemanService.notice("邮箱为空", "alert-info");
                return;
            }
            $modalInstance.close($scope.data.currItem);
        }
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }
    }

    $scope.addpeople_str =function(str,data,index){
        if(str==''||str==undefined){
            str=''
        }
        if(data.contactname){
            data.username = data.contactname
        }
        if(data.contactuserid){
            data.userid = data.contactuserid
        }
        if(data.username){
            if(str==''){
                str+=data.username;
                if(data.userid){
                    str+='<'+data.userid+'>'
                }
            }else{
                if(str.indexOf(data.userid)>-1){
                    return str;
                }
                str+=';'
                str+=data.username;
                if(data.userid){
                    str+='<'+data.userid+'>'
                }

            }
            if(index){
                //弹出窗选人的时候加的
                if(index==2){
                    var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+data.username+'&lt;'+data.userid+'&gt;" addr="'+data.is_bumen+'" unselectable="on"><b unselectable="on" addr="'+data.is_bumen+'">'+data.username+'</b><span unselectable="on" addr="bob1987bao@163.com">&lt;'+data.userid+'&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();
                }else{
                    var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+data.username+'&lt;'+data.userid+'&gt;" addr="'+data.is_bumen+'" unselectable="on"><b unselectable="on" addr="'+data.is_bumen+'">'+data.username+'</b><span unselectable="on" addr="bob1987bao@163.com">&lt;'+data.userid+'&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                }
            }else{

                if($scope.focus==2){
                    var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+data.username+'&lt;'+data.userid+'&gt;" addr="'+data.is_bumen+'" unselectable="on"><b unselectable="on" addr="'+data.is_bumen+'">'+data.username+'</b><span unselectable="on" addr="bob1987bao@163.com">&lt;'+data.userid+'&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final1').before(add_elem);
                    $scope.addfunction();

                }else{
                    var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+data.username+'&lt;'+data.userid+'&gt;" addr="'+data.is_bumen+'" unselectable="on"><b unselectable="on" addr="'+data.is_bumen+'">'+data.username+'</b><span unselectable="on" addr="bob1987bao@163.com">&lt;'+data.userid+'&gt;</span><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                    $('#final').before(add_elem);
                    $scope.addfunction();
                }
            }



        }
        return str;
    }

    $scope.mousedown =function(index){
        $scope.focus = index;
    }
    // 条件设置
    var addpeople = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        addpeople = SinoccCommon.extend(addpeople, ctrl_bill_public);
        addpeople.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={};
        //$scope.data.currItem.scpemail_contact_lists = $scope.$parent.data.currItem.scpemail_contact_lists
        //收件人
        $scope.data.currItem.sj_people=[];
        $scope.add_sj =function(){
            if($scope.index==undefined){
                BasemanService.notice("请选择人员", "alert-info");
            }
            var object={};
            object=$scope.data.scporgs[$scope.index];
            for(var i=0;i<$scope.data.currItem.sj_people.length;i++){
                if(object.userid==$scope.data.currItem.sj_people[i].userid){
                    return;
                }
            }
            if(object.username){
                $scope.data.currItem.sj_people.push(object);
            }
        }
        $scope.click_sj =function(e,index){
            $scope.sj_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }
        $scope.del_sj =function(){
            $scope.data.currItem.sj_people.splice($scope.sj_index,1);
        }
        //抄送人
        $scope.data.currItem.cs_people=[];
        $scope.add_cs =function(){
            if($scope.index==undefined){
                BasemanService.notice("请选择人员", "alert-info");
            }
            var object={};
            object=$scope.data.scporgs[$scope.index];
            for(var i=0;i<$scope.data.currItem.cs_people.length;i++){
                if(object.userid==$scope.data.currItem.cs_people[i].userid){
                    return;
                }
            }
            if(object.username){
                $scope.data.currItem.cs_people.push(object);
            }
        }
        $scope.click_cs =function(e,index){
            $scope.cs_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }

        $scope.del_cs =function(){
            $scope.data.currItem.cs_people.splice($scope.cs_index,1);
        }
        //公司同事
        $scope.data.scporgs_h = $scope.$parent.data.scporgs
        //联系分组
        $scope.data.currItem.scpemail_contact_group_lists =$scope.$parent.data.currItem.scpemail_contact_group_lists
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }

        $scope.ok =function(){
            $modalInstance.close($scope.data.currItem);
        }
        var setting4 = {
            view: {
                showIcon: showIconForTree
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback : {
                //beforeExpand: beforeExpand
                //onRightClick : OnRightClick,//右键事件
                onClick :onClick
            }
        };
        var setting3 = {
            view: {
                showIcon: showIconForTree
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback : {
                onClick: onClick1,
                //onRightClick : OnRightClick,//右键事件
                //onClick : menuShowNode
                onDblClick:onDblClick
            }
        };

        //联系人弹出公司同事单击
        function onClick1(treeId,treeNode){

            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for(name in node){
                if(name!='children'){
                    postdata[name]=node[name];
                }
            }
            postdata.emailtype =3
            postdata.flag=2;
            postdata.list_id = postdata.id
            BasemanService.RequestPost('scpemail_contact_list', 'search', postdata)
                .then(function(data) {
                    $scope.data.scporgs = data.scpemail_contact_group_lists;
                    //$scope.options.api.setRowData(data.scporgs) ;
                });
        }
        function onDblClick(treeId, treeNode){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            if(node.contactname){
                return;
            }
            $scope.node = node;
            BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
                var postdata = res;
                postdata.emailtype =3;
                BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                    .then(function(data) {

                        BasemanService.notice("分组创建成功", "alert-info");

                    })
            })
        }
        $scope.addcolor =function(e,index){
            $scope.index=index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }
        //联系人弹出公司同事单击
        function onClick(treeId,treeNode){

            var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for(name in node){
                if(name!='children'){
                    postdata[name]=node[name];
                }
            }
            postdata.emailtype =3
            postdata.flag=1;
            postdata.orgid = postdata.id
            BasemanService.RequestPost('scpemail_contact_list', 'search', postdata)
                .then(function(data) {
                    $scope.data.scporgs = data.scporgs;
                    //$scope.options.api.setRowData(data.scporgs) ;
                });
        }
        //联系人增加分组
        $scope.addgroup =function(flag){
            $scope.flag=flag;
            BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
                var postdata = res;
                postdata.emailtype =3;
                BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                    .then(function(data) {
                        data.name = data.list_name;
                        data.id = data.list_id
                        data.isParent = true;
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                        zTree.addNodes(null, data);
                        $scope.$parent.treeDemo_in.addNodes(null, data);
                        var node_parent = $scope.$parent.treeDemo_in.getNodesByParam("id",data.id);
                        for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                            data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                            data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                            data.scpemail_contact_group_lists[i].pId = data.id;
                        }
                        $scope.$parent.treeDemo_in.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                        $scope.$parent.data.currItem.scpemail_contact_group_lists = $scope.$parent.data.currItem.scpemail_contact_group_lists.concat(data.scpemail_contact_group_lists);
                        $scope.$parent.data.currItem.scpemail_contact_group_lists.push(data);
                        BasemanService.notice("分组创建成功", "alert-info");
                    })
            })
        }
        //联系人 分组
        var addgroup = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            addgroup = SinoccCommon.extend(addgroup, ctrl_bill_public);
            addgroup.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
            $scope.data={};
            $scope.data.currItem={};

            //分组联系人列表
            if($scope.flag!=2){
                $scope.data.currItem.scpemail_contact_group_lists = $scope.$parent.node.children;
                $scope.data.currItem.list_name = $scope.$parent.node.list_name;
                $scope.data.currItem.list_id = $scope.$parent.node.list_id;
            }else{
                $scope.data.currItem.scpemail_contact_group_lists = [];
                $scope.data.currItem.list_name = '';
                $scope.data.currItem.list_id =0;
            }

            $scope.ok =function(){
                if($scope.data.currItem.list_name ==undefined||$scope.data.currItem.list_name ==''){
                    BasemanService.notice("分组名称为空", "alert-info");
                    return;
                }
                $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel =function(){
                $modalInstance.dismiss(close);
            }
            //删除联系人
            $scope.del =function(index){
                $scope.data.currItem.scpemail_contact_group_lists.splice(index,1);
            }
            var setting = {
                view: {
                    showIcon: showIconForTree
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback : {
                    onDblClick: onDblClick
                    //onRightClick : OnRightClick,//右键事件
                    //onClick : menuShowNode
                }
            };

            function onDblClick(treeId,treeNode){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
                var node = zTree.getSelectedNodes();
                var object ={};
                if(node[0].orgname){
                    object.orgname = node[0].orgname;
                    object.contactid = node[0].sysuserid;
                    object.contactname  = node[0].username;
                    object.contactuserid  = node[0].userid;
                    if($scope.data.currItem.list_id){
                        object.list_id = $scope.data.currItem.list_id;
                    }
                }
                for(var i=0;i<$scope.data.currItem.scpemail_contact_group_lists.length;i++){
                    if($scope.data.currItem.scpemail_contact_group_lists[i].contactuserid==object.contactuserid){
                        return;
                    }
                }
                if(object.contactname){
                    $scope.data.currItem.scpemail_contact_group_lists.push(object);
                }

            }
            function showIconForTree(treeId, treeNode) {
                return !treeNode.isParent;
            };
            $timeout(function(){
                $.fn.zTree.init($("#treeDemo2"), setting, $scope.$parent.$parent.data.scporgs);
            })

        }
        $scope.delgroup =function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if((node[0]==undefined||node[0].list_id==undefined||node[0].list_id=='')||(node[0].contactuserid)){
                BasemanService.notice("请选中一组!", "alert-info");
                return;
            }
            ds.dialog.confirm("是否删除该组？", function () {
                BasemanService.RequestPost("scpemail_contact_list", "del_contact_group", {list_id:parseInt(node[0].list_id)})
                    .then(function(data) {
                        zTree.removeNode(node[0]);
                        var node_parent = $scope.$parent.treeDemo_in.getNodesByParam("id",node[0].id);
                        $scope.$parent.treeDemo_in.removeNode(node_parent[0]);
                        //最近联系人
                        BasemanService.RequestPost("scpemail_contact_list", "search", {emailtype:3})
                            .then(function(data) {
                                //内部邮件通讯显示
                                for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                                    data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                                    data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                                    if(data.scpemail_contact_group_lists[i].contactname){
                                        data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                                    }else{
                                        data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                                        data.scpemail_contact_group_lists[i].isParent = true;
                                    }
                                }
                                $scope.$parent.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
                            })
                        BasemanService.notice("删除成功!", "alert-info");

                    })
            }, function () {

            });
        }

        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        };

        $timeout(function(){
            //联系人 公司同事
            $.fn.zTree.init($("#treeDemo4"), setting4, $scope.data.scporgs_h);
            //联系人分组
            $.fn.zTree.init($("#treeDemo3"), setting3, $scope.data.currItem.scpemail_contact_group_lists);
        })

    }


    var addpeople_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        addpeople_out = SinoccCommon.extend(addpeople_out, ctrl_bill_public);
        addpeople_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={};
        //$scope.data.currItem.scpemail_contact_lists = $scope.$parent.data.currItem.scpemail_contact_lists
        //收件人
        $scope.data.currItem.sj_people=[];
        $scope.add_sj =function(){
            if($scope.index==undefined){
                BasemanService.notice("请选择人员", "alert-info");
            }
            var object={};
            object=$scope.data.scporgs[$scope.index];
            for(var i=0;i<$scope.data.currItem.sj_people.length;i++){
                if(object.userid==$scope.data.currItem.sj_people[i].userid){
                    return;
                }
            }
            if(object.username){
                $scope.data.currItem.sj_people.push(object);
            }
        }
        $scope.click_sj =function(e,index){
            $scope.sj_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }
        $scope.del_sj =function(){
            $scope.data.currItem.sj_people.splice($scope.sj_index,1);
        }
        //抄送人
        $scope.data.currItem.cs_people=[];
        $scope.add_cs =function(){
            if($scope.index==undefined){
                BasemanService.notice("请选择人员", "alert-info");
            }
            var object={};
            object=$scope.data.scporgs[$scope.index];
            for(var i=0;i<$scope.data.currItem.cs_people.length;i++){
                if(object.userid==$scope.data.currItem.cs_people[i].userid){
                    return;
                }
            }
            if(object.username){
                $scope.data.currItem.cs_people.push(object);
            }
        }
        $scope.click_cs =function(e,index){
            $scope.cs_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }

        $scope.del_cs =function(){
            $scope.data.currItem.cs_people.splice($scope.cs_index,1);
        }
        //联系分组
        $scope.data.currItem.scpemail_contact_group_wb_lists =$scope.$parent.data.currItem.scpemail_contact_group_wb_lists
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }
        $scope.ok =function(){
            $modalInstance.close($scope.data.currItem);
        }
        var setting3 = {
            view: {
                showIcon: showIconForTree
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback : {
                onClick: onClick1
            }
        };

        //联系人弹出公司同事单击
        function onClick1(treeId,treeNode){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for(name in node){
                if(name!='children'){
                    postdata[name]=node[name];
                }
            }
            postdata.emailtype =4
            postdata.flag=2;
            postdata.list_id = postdata.id
            BasemanService.RequestPost('scpemail_contact_list', 'search', postdata)
                .then(function(data) {
                    $scope.data.scporgs = data.scpemail_contact_group_wb_lists;
                });
        }
        $scope.addcolor =function(e,index){
            $scope.index=index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
        }
        //增加分组 外部邮箱
        $scope.addgroup =function(flag){
            $scope.flag=flag;
            BasemanService.openFrm("views/baseman/addgroup_out.html", addgroup_out, $scope, "", "").result.then(function (res) {
                var postdata = res;
                postdata.emailtype =4;
                BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                    .then(function(data) {
                        data.name = data.list_name;
                        data.id = data.list_id
                        data.isParent = true;
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                        zTree.addNodes(null, data);
                        $scope.$parent.treeDemo_out.addNodes(null, data);
                        $scope.$parent.data.currItem.scpemail_contact_group_wb_lists.push(data);
                        BasemanService.notice("分组创建成功", "alert-info");
                    })
            })
        }
        //增加分组成员
        $scope.addgrouppeop_out =function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if(node.length==0){
                BasemanService.notice("请选择一个分组", "alert-info");
                return;
            }
            $scope.change_index = 0;
            BasemanService.openFrm("views/baseman/addgrouppeop_out.html", addgrouppeop_out, $scope, "", "").result.then(function (res) {
                var postdata = res;
                postdata.emailtype =4;
                postdata.list_pid  = node[0].id;
                postdata.list_name  = node[0].name;

                BasemanService.RequestPost("scpemail_contact_list", "add_contact", postdata)
                    .then(function(data) {
                        data.name = data.contactname;
                        data.id = data.list_id;
                        $scope.data.scporgs.push(data);
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                        var node = zTree.getSelectedNodes();
                        var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id",node[0].id);
                        data.Pid = node_parent[0].id;
                        $scope.$parent.treeDemo_out.addNodes(node_parent[0],1,data);
                        BasemanService.notice("新增成功", "alert-info");
                    })
            })
        }

        $scope.delgrouppeop_out =function(){
            var postdata =  $scope.data.scporgs[$scope.index];
            BasemanService.RequestPost("scpemail_contact_list", "del_contact", postdata)
                .then(function(data) {
                    $scope.data.scporgs.splice($scope.index,1);
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                    var node = zTree.getSelectedNodes();
                    var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id",data.list_id);
                    $scope.$parent.treeDemo_out.removeNode(node_parent[0]);

                    BasemanService.notice("删除成功", "alert-info");
                })
        }
        $scope.chagrouppeop_out = function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if(node.length==0){
                BasemanService.notice("请选择一个分组", "alert-info");
                return;
            }
            $scope.change_index = 2;
            BasemanService.openFrm("views/baseman/addgrouppeop_out.html", addgrouppeop_out, $scope, "", "").result.then(function (res) {
                var postdata = res;
                postdata.emailtype =4;
                postdata.list_pid  = node[0].id;
                postdata.list_name  = node[0].name;

                BasemanService.RequestPost("scpemail_contact_list", "add_contact", postdata)
                    .then(function(data) {
                        var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id",data.list_id);
                        node_parent[0].list_name = data.list_name;
                        node_parent[0].contactuserid = data.contactuserid;
                        $scope.$parent.treeDemo_out.refresh();
                        BasemanService.notice("修改成功", "alert-info");
                    })
            })
        }
        var addgrouppeop_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            addgrouppeop_out = SinoccCommon.extend(addgrouppeop_out, ctrl_bill_public);
            addgrouppeop_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
            $scope.data={};
            $scope.data.currItem={};
            if($scope.$parent.change_index ==2){
                $scope.data.currItem = $scope.$parent.data.scporgs[$scope.$parent.index]
            }else{
                $scope.data.currItem.list_name = '';
                $scope.data.currItem.list_id =0;
            }

            $scope.ok =function(){
                if($scope.data.currItem.contactname ==undefined||$scope.data.currItem.contactname ==''){
                    BasemanService.notice("名称为空", "alert-info");
                    return;
                }
                if($scope.data.currItem.contactuserid ==undefined||$scope.data.currItem.contactuserid ==''){
                    BasemanService.notice("邮箱为空", "alert-info");
                    return;
                }
                $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel =function(){
                $modalInstance.dismiss(close);
            }
        }
        //联系人 分组
        var addgroup_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            addgroup_out = SinoccCommon.extend(addgroup_out, ctrl_bill_public);
            addgroup_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
            $scope.data={};
            $scope.data.currItem={};
            $scope.data.currItem.scpemail_contact_group_lists = [];
            $scope.data.currItem.list_name = '';
            $scope.data.currItem.list_id =0;
            $scope.ok =function(){
                if($scope.data.currItem.list_name ==undefined||$scope.data.currItem.list_name ==''){
                    BasemanService.notice("分组名称为空", "alert-info");
                    return;
                }
                $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel =function(){
                $modalInstance.dismiss(close);
            }
        }
        $scope.delgroup =function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if((node[0]==undefined||node[0].list_id==undefined||node[0].list_id=='')||(node[0].contactuserid)){
                BasemanService.notice("请选中一组!", "alert-info");
                return;
            }
            ds.dialog.confirm("是否删除该组？", function () {
                BasemanService.RequestPost("scpemail_contact_list", "del_contact_group", {list_id:parseInt(node[0].list_id)})
                    .then(function(data) {
                        zTree.removeNode(node[0]);
                        var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id",node[0].id);
                        $scope.$parent.treeDemo_out.removeNode(node_parent[0]);
                        BasemanService.RequestPost("scpemail_contact_list", "search", {emailtype:3})
                            .then(function(data) {
                                //外部邮箱分组
                                for(var i=0;i<data.scpemail_contact_group_wb_lists.length;i++){
                                    data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
                                    data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
                                    if(data.scpemail_contact_group_wb_lists[i].contactname){
                                        data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
                                    }else{
                                        data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                                        data.scpemail_contact_group_wb_lists[i].isParent = true;
                                    }

                                }
                                $scope.$parent.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;
                            })
                        BasemanService.notice("删除成功!", "alert-info");

                    })
            }, function () {

            });
        }

        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        };

        $timeout(function(){
            //联系人分组
            $.fn.zTree.init($("#treeDemo3"), setting3, $scope.data.currItem.scpemail_contact_group_wb_lists);
        })

    }
    //增加分组 内部邮箱
    $scope.addgroup =function(flag){
        if($scope.node){
            delete $scope.node;
        }
        BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
            var postdata = res;
            if(flag==2){
                postdata.emailtype =4;
            }else{
                postdata.emailtype =3;
            }
            BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                .then(function(data) {
                    data.name = data.list_name;
                    data.id = data.list_id
                    data.isParent = true;
                    if(flag==2){
                        $scope.treeDemo_out.addNodes(null, data);
                        var node_parent = $scope.treeDemo_out.getNodesByParam("id",data.id);
                        for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                            data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                            data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                            data.scpemail_contact_group_lists[i].pId = data.id;
                        }
                        $scope.treeDemo_out.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                        $scope.data.currItem.scpemail_contact_group_wb_lists = $scope.data.currItem.scpemail_contact_group_wb_lists.concat(data.scpemail_contact_group_lists);
                        $scope.data.currItem.scpemail_contact_group_wb_lists.push(data);
                    }else{
                        $scope.treeDemo_in.addNodes(null, data);
                        var node_parent = $scope.treeDemo_in.getNodesByParam("id",data.id);
                        for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                            data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                            data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                            data.scpemail_contact_group_lists[i].pId = data.id;
                        }
                        $scope.treeDemo_in.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                        $scope.data.currItem.scpemail_contact_group_lists = $scope.data.currItem.scpemail_contact_group_lists.concat(data.scpemail_contact_group_lists);
                        $scope.data.currItem.scpemail_contact_group_lists.push(data);
                    }

                    BasemanService.notice("分组创建成功", "alert-info");
                })
        })
    }
    $scope.delgroup =function(flag){
        if(flag==2){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_out");
        }else{
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
        }

        var node = zTree.getSelectedNodes();
        if((node[0]==undefined||node[0].list_id==undefined||node[0].list_id=='')||(node[0].contactuserid)){
            BasemanService.notice("请选中一组!", "alert-info");
            return;
        }
        ds.dialog.confirm("是否删除该组？", function () {
            BasemanService.RequestPost("scpemail_contact_list", "del_contact_group", {list_id:parseInt(node[0].list_id)})
                .then(function(data) {
                    if(flag==2){
                        $scope.treeDemo_out.removeNode(node[0]);
                        var postdata = {emailtype:4}
                    }else{
                        $scope.treeDemo_in.removeNode(node[0]);
                        var postdata = {emailtype:3}
                    }
                    BasemanService.RequestPost("scpemail_contact_list", "search", postdata)
                        .then(function(data) {

                            if(flag==2){
                                //内部邮件通讯显示
                                for(var i=0;i<data.scpemail_contact_group_wb_lists.length;i++){
                                    data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
                                    data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
                                    if(data.scpemail_contact_group_wb_lists[i].contactname){
                                        data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
                                    }else{
                                        data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                                        data.scpemail_contact_group_wb_lists[i].isParent = true;
                                    }
                                }
                                $scope.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;
                            }else{
                                //内部邮件通讯显示
                                for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                                    data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                                    data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                                    if(data.scpemail_contact_group_lists[i].contactname){
                                        data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                                    }else{
                                        data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                                        data.scpemail_contact_group_lists[i].isParent = true;
                                    }
                                }
                                $scope.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
                            }

                        })
                    BasemanService.notice("删除成功!", "alert-info");

                })
        }, function () {

        });
    }
    // 分组
    var addgroup = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        addgroup = SinoccCommon.extend(addgroup, ctrl_bill_public);
        addgroup.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={};
        //分组联系人列表
        if($scope.$parent.node){
            $scope.data.currItem.scpemail_contact_group_lists = $scope.$parent.node.children;
            $scope.data.currItem.list_name = $scope.$parent.node.list_name;
            $scope.data.currItem.list_id = $scope.$parent.node.list_id;
        }else{
            $scope.data.currItem.scpemail_contact_group_lists = [];
            $scope.data.currItem.list_name = '';
            $scope.data.currItem.list_id =0;
        }

        $scope.ok =function(){
            if($scope.data.currItem.list_name ==undefined||$scope.data.currItem.list_name ==''){
                BasemanService.notice("分组名称为空", "alert-info");
                return;
            }
            $modalInstance.close($scope.data.currItem);
        }
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }
        //删除联系人
        $scope.del =function(index){
            $scope.data.currItem.scpemail_contact_group_lists.splice(index,1);
        }
        var setting = {
            async: {
                enable: true,
                url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                autoParam: ["id", "name=n", "level=lv"],
                otherParam: {
                    "flag": 1
                },
                dataFilter: filter
            },
            view: {
                showIcon: showIconForTree
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback : {
                onDblClick: onDblClick
                //onRightClick : OnRightClick,//右键事件
                //onClick : menuShowNode
            }
        };
        //这个是异步
        function filter(treeId, parentNode, childNodes) {
            var treeNode = parentNode;
            if(treeNode && treeNode.children) {
                return;
            }
            if(treeNode) {
                var postdata = treeNode
            } else {
                var postdata = {};
            }
            postdata.flag=1;
            postdata.emailtype =3;
            postdata.orgid = parseInt(postdata.id);
            var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
            var children = obj.data.scporgs;
            if(children) {
                treeNode.children = [];
                for(var i = 0; i < children.length; i++) {
                    if(parseInt(children[i].sysuserid)>0){
                        children[i].name = children[i].username;
                    }else{
                        children[i].isParent =  true;
                    }

                }
            }
            return children;

        }
        function onDblClick(treeId,treeNode){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
            var node = zTree.getSelectedNodes();
            var object ={};
            if(node[0].username){
                //object.orgname = node[0].orgname;
                object.contactid = node[0].sysuserid;
                object.contactname  = node[0].username;
                object.contactuserid  = node[0].userid;
                object.name = object.contactname;
                object.id = object.contactid;
                if($scope.data.currItem.list_id){
                    object.list_id = $scope.data.currItem.list_id;
                }
            }
            for(var i=0;i<$scope.data.currItem.scpemail_contact_group_lists.length;i++){
                if($scope.data.currItem.scpemail_contact_group_lists[i].contactuserid==object.contactuserid){
                    return;
                }
            }
            if(object.contactname){
                $scope.data.currItem.scpemail_contact_group_lists.push(object);
            }

        }
        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        };
        $timeout(function(){
            $.fn.zTree.init($("#treeDemo2"), setting, $scope.$parent.data.scporgs);
        })

    }
    // 条件设置
    var mail_setting = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        mail_setting = SinoccCommon.extend(mail_setting, ctrl_bill_public);
        mail_setting.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.data={};
        $scope.data.currItem={};
        $scope.mailserverids =[];
        $scope.accounts =[];
        $timeout(function(){
            $('#contents3').summernote({
                height: 300,
                fontNames: ["微软雅黑","华文细黑",'Arial','sans-serif',"宋体", "Times New Roman", 'Times', 'serif',"华文细黑",'Courier New', 'Courier','华文仿宋','Georgia', "Times New Roman", 'Times',"黑体", 'Verdana', 'sans-seri',"方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
                callbacks: {
                    onImageUpload: function(files, editor, welEditable) {
                        editor=$(this);
                        uploadFile(files[0],editor,welEditable); //此处定义了上传文件方法
                    }
                }
            });
        })

        BasemanService.RequestPost("scpusermail", "search", {}).then(function (data) {
            $scope.data.usermails = data.usermails;

            for(var i=0;i<data.dicts.length;i++){
                data.dicts[i].value = parseInt(data.dicts[i].value);
            }
            $scope.mailserverids = data.dicts;
            for(var i=0;i<$scope.data.usermails.length;i++){
                var object ={};
                object.value = $scope.data.usermails[i].email;
                object.desc = $scope.data.usermails[i].email;
                $scope.accounts.push(object);
            }
            $scope.accounts.push({value:'内部邮箱',desc:'内部邮箱'})


            for(var i=0;i<$scope.data.usermails.length;i++){
                if($scope.data.usermails[i].isdefault==2){
                    $scope.data.currItem.isdefault=1;
                    $scope.isdefault=1;
                    return;
                }
            }
            $scope.data.currItem.isdefault=2;
            $scope.isdefault=2;

        })
        $scope.del_mail =function(){
            if($scope.out_index==undefined){
                BasemanService.notice("请选择删除明细", "alert-info");
                return;
            }
            BasemanService.RequestPost("scpusermail", "delete", {usermailid:$scope.data.usermails[$scope.out_index].usermailid}).then(function (data) {
                BasemanService.notice("删除成功", "alert-info");
                $scope.data.usermails.splice($scope.out_index,1);
                $scope.new_mail();
            })
        }

        $scope.new_mail =function(){
            //var isdefault = $scope.data.currItem.isdefault;
            $scope.data.currItem={
                isdefault:$scope.isdefault
            };
        }
        $scope.out_mail =function(e,index){
            if($scope.out_index==undefined){

            }else{
                $scope.data.usermails[$scope.out_index].mail_autograph = $('#contents3').summernote('code');
            }
            $scope.out_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
            BasemanService.RequestPost("scpusermail", "select", {usermailid:$scope.data.usermails[index].usermailid}).then(function (data) {
                $scope.data.currItem.smtppsw = data.smtppsw;
            })
            $scope.data.currItem.usermailid = parseInt($scope.data.usermails[index].usermailid);
            $scope.data.currItem.email = $scope.data.usermails[index].email;
            //$scope.data.currItem.smtppsw = $scope.data.usermails[index].smtppsw;
            $scope.data.currItem.username = $scope.data.usermails[index].username;
            $scope.data.currItem.to_email = $scope.data.usermails[index].to_email;
            $scope.data.currItem.mailserverid = parseInt($scope.data.usermails[index].mailserverid);
            $scope.data.currItem.isdefault = parseInt($scope.data.usermails[index].isdefault);
            $scope.data.currItem.mail_autograph = ($scope.data.usermails[index].mail_autograph);
            if($scope.data.currItem.email=="内部邮箱"){
                $('#maintabs').children().removeClass('active');
                $('#maintabs').children().eq(1).addClass('active');

                $('#main-tab-content').children().removeClass('active');
                $('#main-tab-content').children().eq(1).addClass('active');
            }
            $('#contents3').summernote('code',$scope.data.usermails[index].mail_autograph);

        }
        $scope.ok =function(){
            $scope.data.currItem.mail_autograph = $('#contents3').summernote('code');
            var postdata = $scope.data.currItem;
            var action='update';
            if($scope.data.currItem.usermailid){

            }else{
                action='insert';
            }
            BasemanService.RequestPost("scpusermail", action, postdata).then(function (data) {
                BasemanService.notice("新建成功!", "alert-info");
                $modalInstance.close($scope.data.currItem);
            })
        }
        $scope.cancel =function(){
            $modalInstance.dismiss(close);
        }
    }
    //全选
    $scope.selectall =function(){
        if($scope.data.type==2){
            for(var i=0;i<$scope.data.emails.length;i++){
                $scope.data.emails[i].checkbox=2;
            }
        }else{
            for(var i=0;i<$scope.data.emails.length;i++){
                $scope.data.emails[i].checkbox=1;
            }
        }
    }
    //点击未读邮件
    $scope.unread =function(){
        $scope.search(100);
    }
    //刷新
    $scope.refresh_emails =function(){
        $scope.show_box($scope.data.flag||99);
    }
    //星标邮件
    $scope.batchstar =function(){
        postdata={};
        postdata.emailofemails =[];
        for(var i=$scope.data.emails.length-1;i>-1;i--){
            if($scope.data.emails[i].checkbox==2){
                postdata.emailofemails.push($scope.data.emails[i]);
            }
        }
        $scope.readstep=0;
        star_email(postdata.emailofemails[$scope.readstep].emailid);
        function star_email(id){
            BasemanService.RequestPost("scpemailtrk", "addmyflag", {emailid:parseInt(id),myflag:999})
                .then(function(data) {
                    $scope.readstep=$scope.readstep+1;
                    if($scope.readstep==postdata.emailofemails.length){
                        for(var i=0;i<postdata.emailofemails.length;i++){
                            postdata.emailofemails[i].myflag = 999;
                        }
                        return;
                    }
                    star_email(postdata.emailofemails[$scope.readstep].emailid);

                })
        }

    }
    //批量未读
    $scope.batchunread =function(){
        postdata={emailtype:3};
        postdata.emailofemails =[];
        for(var i=0;i<$scope.data.emails.length;i++){
            if($scope.data.emails[i].checkbox==2){
                postdata.emailofemails.push($scope.data.emails[i]);
            }
        }
        BasemanService.RequestPost("scpemail", "update_wd_email", postdata)
            .then(function(data) {
                for(var i=0;i<postdata.emailofemails.length;i++){
                    postdata.emailofemails[i].flag = 1;
                }
                $scope.data.receivenew = data.receivenew;
            })
    }
    //删除
    $scope.delete_emails =function(){
        postdata={};
        postdata.emailofemails =[];
        for(var i=$scope.data.emails.length-1;i>-1;i--){
            if($scope.data.emails[i].checkbox==2){
                postdata.emailofemails.push($scope.data.emails[i]);
            }
        }
        if($scope.data.flag==5||$scope.data.flag==10){
            ds.dialog.confirm("邮件将永久删除，是否继续", function () {
                BasemanService.RequestPost("scpemail", "batchdelete", postdata)
                    .then(function(data) {
                        BasemanService.notice("删除成功!", "alert-info");
                        $scope.show_box($scope.data.flag);

                    })
            }, function () {

            });

        }else{
            BasemanService.RequestPost("scpemail", "batchhide", postdata)
                .then(function(data) {
                    BasemanService.notice("删除成功!", "alert-info");
                    $scope.show_box($scope.data.flag);

                })
        }


    }
    $scope.is_read =function(){
        var postdata ={};
        postdata.read_email=[];
        for(var i=0;i<$scope.data.emails.length;i++){
            if($scope.data.emails[i].checkbox==2){
                postdata.read_email.push($scope.data.emails[i]);
            }
        }
        $scope.readstep=0;
        read_email(postdata.read_email[$scope.readstep].emailid);
        function read_email(id){
            BasemanService.RequestPost("scpemail", "select", {emailid:parseInt(id)})
                .then(function(data) {
                    $scope.readstep=$scope.readstep+1;
                    if($scope.readstep==postdata.read_email.length){
                        $scope.show_box($scope.data.flag);
                        return;
                    }
                    read_email(postdata.read_email[$scope.readstep].emailid);
                })
        }
    }
    //清空发件内容
    $scope.clearsend_email =function(){
        $('.high').removeClass('high');
        $scope.index ='';
        $scope.data.is_search=1;
        $scope.data.username = '';
        $scope.data.currItem.search_peop='';
        $scope.data.currItem.search_linep='';
        //$scope.data.currItem.emailid = 0;
        $scope.data.currItem.snedto ='';
        $scope.data.currItem.totype = '';
        $scope.data.currItem.cc ='';
        $scope.data.currItem.subject_send='';
        $scope.data.currItem.attachofemails1 =[];
        $scope.data.currItem.cctype = '';

        var str ='';
        if($scope.data.flag<=5){
            for(var i=0;i<$scope.data.usermails.length;i++){
                if($scope.data.usermails[i].email=='内部邮箱'){
                    if($scope.data.usermails[i].mail_autograph){
                        str='<p><br></br></p><p><br></br></p><p><br></br></p><p><br>——————————————</br></p>'+$scope.data.usermails[i].mail_autograph;
                    }
                }
            }
            $('.summernote').summernote('code',str);
        }else{

            for(var i=0;i<$scope.data.usermails.length;i++){
                if(parseInt($scope.data.usermails[i].isdefault)==2){
                    if($scope.data.usermails[i].mail_autograph){
                        str = '<p><br></br></p><p><br></br></p><p><br></br></p><p><br>——————————————</br></p>'+$scope.data.usermails[i].mail_autograph;
                    }
                }
            }
            $('.summernote').summernote('code',str);
        }
        //清空收件人
        $('#toAreaCtrl .addr_base').remove();
        $('#toAreaCtrl1 .addr_base').remove();
    }
    //
    $scope.is_draft =function(){
        //
        if($scope.data.show !=2){
            return;
        }else{
            //如果是有emailid的那么要判断该数据是否已经被改变了；如果没有，那么直接提示是否保存草稿
            if($scope.data.currItem.emailid!=undefined&&($scope.data.currItem.emailid!=0)){
                BasemanService.RequestPost("scpemail", "select", {emailid:parseInt($scope.data.currItem.emailid)})
                    .then(function(data) {
                        var jud1 = ($scope.data.currItem.snedto.indexOf(data.sendtoname)>-1?true:false)&&(data.sendtoname.indexOf($scope.data.currItem.snedto)>-1?true:false);
                        var jud2 = ($scope.data.currItem.cc.indexOf(data.ccname)>-1?true:false)&&(data.ccname.indexOf($scope.data.currItem.cc)>-1?true:false);
                        var content = $('.summernote').summernote('code');;
                        var jud3 = (content.indexOf(data.content)>-1?true:false)&&(data.content.indexOf(content)>-1?true:false);
                        if(jud1&&jud2&&jud3){
                            return;
                        }else{

                            ds.dialog.confirm('数据已改变是否保存草稿？', function () {
                                $scope.send_email(2);
                            }, function () {
                                $scope.clearsend_email();
                                /**$scope.data.show =2;
                                 $scope.clearsend_email();
                                 $scope.$apply();*/
                            });
                        }
                    })
            }else{
                var content = $('.summernote').summernote('code');
                var jud = ($scope.data.currItem.emailid==undefined||$scope.data.currItem.emailid==0)&&($scope.data.currItem.snedto ==undefined||$scope.data.currItem.snedto=='')&&($scope.data.currItem.cc ==undefined||$scope.data.currItem.cc =='')&&(content=='')
                if(jud){
                    return;
                }
                ds.dialog.confirm('是否保存草稿？', function () {
                    $scope.send_email(2);
                }, function () {
                    $scope.clearsend_email();
                    /**$scope.data.show =2;
                     $scope.clearsend_email();
                     $scope.$apply();*/
                });
            }
        }
    }
    //在离开之前要判断是否是发件箱，如果是发件箱在离开的时候如果数据要提醒是否保存草稿
    $scope.show_box =function(flag,e){
        $scope.is_draft();

        $scope.data.show=1;
        $scope.data.flag=flag;
        if(e){
            $(e.currentTarget).parent().siblings().removeClass("high");
            $(e.currentTarget).parent().addClass("high");
        }
        if($scope.data.flag>5){
            $('#inn_mail').children().siblings().removeClass("high");
        }else{
            $('#out_mail').children().siblings().removeClass("high");
        }

        if(parseInt(flag)==1||parseInt(flag)==6){
            $scope.data.title="收件箱";
            $scope.search(99);
        }else if(parseInt(flag)==2||parseInt(flag)==7){
            $scope.data.title="已发邮件";
            $scope.search(88);
        }else if(parseInt(flag)==3||parseInt(flag)==8){
            $scope.data.title="重要邮件";
            $scope.search(999);
        }else if(parseInt(flag)==4||parseInt(flag)==9){
            $scope.data.title="草稿";
            $scope.search(77);
        }else if(parseInt(flag)==5||parseInt(flag)==10){
            $scope.data.title="垃圾箱";
            $scope.search(66);
        }else{
            $scope.data.title="收件箱";
        }
    }

    $scope.sizeshow =function(flag){
        $scope.data.sizeshow = flag;
    }

    //服务端另存
    $scope.server_save =function(docid,reftype){
        var l=0;
        /***BasemanService.openFrm("views/baseman/company_files_frm.html", company_files, $scope, "", "").result.then(function (res) {
			BasemanService.RequestPost('scpfdrref', 'insert', {refid:docid,fdrid:res.fdrid,reftype:6,wsid:-4,idpath:res.idpath})
		    .then(function(data) {
			 })
			 BasemanService.RequestPost('scpfdr', 'upwebscpdoc', {wsid:-4,idpath:res.idpath,typepath:res.typepath,docid:docid})
			 .then(function(data) {
				 BasemanService.notice("另存成功", "alert-info");
			 })
		})*/
        BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function(res) {
            BasemanService.RequestPost('scpdoc_web_rev', 'copy_to', {
                docid: docid,
                fdrid: res.fdrid,
                idpath: res.idpath,
                typepath: res.typepath
            })
                .then(function(data) {
                    BasemanService.notice("复制成功", "alert-info");
                })
        })
    }
    var file_structure = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        file_structure = SinoccCommon.extend(file_structure, ctrl_bill_public);
        file_structure.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.objconf = {
            name: "myfiles",
            key: "fileid",
            FrmInfo: {},
            grids: []
        };
        var setting = {
            async: {
                enable: true,
                url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                autoParam: ["id", "name=n", "level=lv"],
                otherParam: {
                    "id": 108
                },
                dataFilter: filter
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeExpand: beforeExpand
            }
        };


        function beforeExpand(treeId, treeNode) {
            if(treeNode.children) {
                return;
            }
            if(treeNode.wsid) {
                var classname = 'scpworkspace'
            } else {
                var classname = 'scpfdr'
            }
            var postdata = treeNode;
            postdata.excluderight = 1;
            var obj = BasemanService.RequestPostNoWait(classname, 'selectref', postdata)
            var data = obj.data
            if(data.shortcuts && data.shortcuts.length > 0) {
                for(var i = 0; i < data.shortcuts.length; i++) {
                    data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                    data.shortcuts[i].fdrid = data.shortcuts[i].refid;
                }
                data.children = data.shortcuts;
            } else {
                data.children = data.fdrs;
            }

            if(data.children) {
                treeNode.children = [];
                var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                for(var i = 0; i < data.children.length; i++) {
                    data.children[i].isParent = true;
                    data.children[i].name = data.children[i].fdrname
                    data.children[i].pId = parseInt(treeNode.id);
                    data.children[i].id = parseInt(data.children[i].fdrid)
                    data.children[i].item_type = 1;
                    if(data.children[i].creator == userbean.userid) {
                        data.children[i].objaccess = treeNode.objaccess;
                    }

                    //zTree.addNodes(treeNode,data.children[i])
                }
                zTree.addNodes(treeNode, data.children)
            }
        }
        function filter(treeId, parentNode, childNodes) {
            return null;
        }
        $scope.clearinformation = function() {
            $timeout(function() {
                BasemanService.RequestPost('scpworkspace', 'selectall', {
                    wstype: 4,
                    userid: window.userbean.userid,
                    modid: 933,
                    sysuserid: window.userbean.sysuserid
                })
                    .then(function(data) {
                        //var  post   =data.workspaces[1]
                        var zNodes = {
                            icon: "/web/img/file_01.png"
                        };
                        zNodes.name = window.userbean.userid + "的文件管理";
                        if(userbean.userauth.admins) {
                            zNodes.objaccess = '2222222';
                        }
                        //zNodes.name = '公司文档'
                        zNodes.id = 0;
                        zNodes.isParent = true;
                        zNodes.fdrid = 0;
                        $scope.data.fdrs_levelOne = data.workspaces
                        data.children = data.workspaces;

                        for(var i = 0; i < data.children.length; i++) {
                            data.children[i].isParent = true;
                            data.children[i].name = data.children[i].wsname;
                            //文件夹的时候设置为1
                            data.children[i].item_type = 1;
                            data.children[i].id = parseInt(i + 1);
                            data.children[i].fdrid = parseInt(i + 1);
                            data.children[i].icon = '/web/img/computer.png';
                            data.children[i].objaccess = '2222222';
                        }
                        zNodes.children = [];
                        zNodes.children.push(data.children[0]);
                        $scope.zTree = $.fn.zTree.init($("#treeDemo_frm"), setting, zNodes)
                    });

            });
        }

        $scope.ok = function() {
            if($scope.validate()) {
                var node = $scope.zTree.getSelectedNodes();
                $modalInstance.close(node[0]);
            }
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
        $scope.validate = function() {
            var node = $scope.zTree.getSelectedNodes();
            if(node == '' || node == undefined) {
                BasemanService.notice('请选中一行');
                return false;
            }
            return true;
        }
        $scope.initdata();
    }
    $scope.sendReceive_email =function(flag){
        var postdata ={};
        $scope.data.show=1;
        if(flag==1){
            if($scope.data.sqlwhere==undefined||$scope.data.sqlwhere==''){
                $scope.data.sqlwhere = '';
            }
            postdata.sendtoname = $scope.data.sqlwhere;
            if($scope.data.flag>5){
                postdata.emailtype = 4;
            }else{
                postdata.emailtype = 3;
            }

        }else{
            postdata.sendtoname = $scope.data.currItem.email_name;
        }

        BasemanService.RequestPost("scpallemail", "select_name_all", postdata)
            .then(function(data) {
                $scope.data.emails = data.emails;
                for(var i=0;i<$scope.data.emails.length;i++){
                    if($scope.data.emails[i].receivetime==''||$scope.data.emails[i].receivetime==undefined){
                        $scope.data.emails[i].receivetime = $scope.data.emails[i].sendtime;
                    }
                }
                //星期一
                $scope.data.xq1_emails=[];
                //星期二
                $scope.data.xq2_emails=[];
                //星期三
                $scope.data.xq3_emails=[];
                //星期四
                $scope.data.xq4_emails=[];
                //星期五
                $scope.data.xq5_emails=[];
                //星期六
                $scope.data.xq6_emails=[];
                //今天
                $scope.data.today_emails=[];
                //上周
                $scope.data.lastweek_emails=[];
                //更早
                $scope.data.early_emails=[];
                var today =new Date().toDateString()
                var j=0;
                //1.判断今天是星期几
                if(today.indexOf('Mon')>-1){
                    //星期1
                    j=1;
                }
                if(today.indexOf('Tue')>-1){
                    //星期2
                    j=2;
                }
                if(today.indexOf('Wed')>-1){
                    //星期3
                    j=3;
                }
                if(today.indexOf('Thu')>-1){
                    //星期4
                    j=4;
                }
                if(today.indexOf('Fri')>-1){
                    //星期5
                    j=5;
                }
                if(today.indexOf('Sat')>-1){
                    //星期6
                    j=6;
                }
                if(today.indexOf('Sun')>-1){
                    //星期天
                    j=7;
                }
                for(var i=0;i<$scope.data.emails.length;i++){
                    //今天
                    if( new Date($scope.data.emails[i].receivetime).toDateString()===new Date().toDateString()){
                        $scope.data.today_emails.push($scope.data.emails[i]);
                    }
                    var day=getDays(new Date($scope.data.emails[i].receivetime).Format('yyyy-MM-dd'),new Date().Format('yyyy-MM-dd'))
                    //console.warn(-);
                    //var day = Math.abs(new Date($scope.data.emails[i].receivetime)-new Date());
                    //星期6
                    if(day<=(j-6)&&day>(j-7)&&(j-6)!=0){
                        $scope.data.xq6_emails.push($scope.data.emails[i]);
                    }
                    if(day<=(j-5)&&day>(j-6)&&(j-5)!=0){
                        $scope.data.xq5_emails.push($scope.data.emails[i]);
                    }
                    if(day<=(j-4)&&day>(j-5)&&(j-4)!=0){
                        $scope.data.xq4_emails.push($scope.data.emails[i]);
                    }
                    if(day<=(j-3)&&day>(j-4)&&(j-3)!=0){
                        $scope.data.xq3_emails.push($scope.data.emails[i]);
                    }
                    if(day<=(j-2)&&day>(j-3)&&(j-2)!=0){
                        $scope.data.xq2_emails.push($scope.data.emails[i]);
                    }
                    if(day<=(j-1)&&day>(j-2)&&(j-1)!=0){
                        $scope.data.xq1_emails.push($scope.data.emails[i]);
                    }

                    //昨天
                    /**if(new Date($scope.data.emails[i].receivetime).toDateString() === new Date(new Date()-24*3600*1000).toDateString()){
					  $scope.data.yesterday_emails.push($scope.data.emails[i]);
				  }*/
                    //上周
                    if(day<=(j+6)&&day>(j)){
                        $scope.data.lastweek_emails.push($scope.data.emails[i]);
                    }
                    //更早
                    if(day>(j+6)){
                        $scope.data.early_emails.push($scope.data.emails[i]);
                    }
                    $.base64.utf8encode = true;
                    var param = { id: parseInt($scope.data.emails[i][$scope.objconf.key]), userid: window.strUserId }
                    $scope.data.emails[i].url_param = $.base64.btoa(JSON.stringify(param), true);
                }
                if (data.pagination.length > 0) {
                    BasemanService.pageInfoOp($scope, data.pagination);
                }
            })
    }

    //点击查看详情(草稿是特殊情况)
    $scope.show = function(flag,id){
        //记录上次的路
        $scope.data.last_show = $scope.data.show;
        if(flag==2){
            $scope.clearsend_email();
        }

        //点击写信的时候有用
        $scope.data.show = flag;
        if($scope.data.title=='草稿'&&id){
            $scope.data.show=2;
        }
        if(id){
            var postdata = {emailid:parseInt(id)};
            if($scope.data.flag>5){
                postdata.emailtype=4;
            }else{
                postdata.emailtype=3;
            }
            postdata.flag=99;
            BasemanService.RequestPost("scpemail", "select", postdata)
                .then(function(data) {
                    /**for(name in data){
				   $scope.data.currItem[name] =data[name];
				}*/
                    $scope.data.currItem = $.extend({}, $scope.data.currItem, data)
                    var left = $scope.data.currItem.fromuser.indexOf('<');
                    var right = $scope.data.currItem.fromuser.indexOf('>');
                    $scope.data.currItem.email = $scope.data.currItem.fromuser.substr(left+1,right-left-1);
                    $scope.data.currItem.sendtoname_array = $scope.data.currItem.sendtoname.split(';');
                    if( $scope.data.currItem.ccname){
                        $scope.data.currItem.ccname_array = $scope.data.currItem.ccname.split(';');
                    }
                    if($scope.data.title!='草稿'){
                        for(var i=0;i<$scope.data.currItem.attachofemails.length;i++){
                            $scope.data.currItem.attachofemails[i].icon_file = SinoccCommon.getAttachIcon($scope.data.currItem.attachofemails[i].refname);
                        }
                        if(data.contentid<0){
                            $scope.data.contentHtml = $sce.trustAsHtml($scope.data.currItem.content);
                        }
                        if($scope.data.title=='收件箱'){
                            $scope.search(99);
                            $scope.data.show = flag;
                        }
                        //处理显示收件人和抄送人

                    }else{

                        $scope.data.currItem.snedto = $scope.data.currItem.sendtoname;
                        if($scope.data.currItem.ccname){
                            $scope.data.currItem.cc = $scope.data.currItem.ccname
                        }
                        $scope.show_people();
                        $scope.data.currItem.subject_send = $scope.data.currItem.subject;
                        if($scope.data.currItem.content){
                            $('.summernote').summernote('code',$scope.data.currItem.content)
                        }else{
                            var empty = '';
                            $('.summernote').summernote('code',empty);
                        }
                        //深度拷贝附件
                        $scope.data.currItem.attachofemails1 = []
                        if($scope.data.currItem.attachofemails){
                            for(var i=0;i<$scope.data.currItem.attachofemails.length;i++){
                                var object ={};
                                $scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
                                $scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
                                $scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
                                $scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                for(name in $scope.data.currItem.attachofemails[i]){
                                    object[name] = $scope.data.currItem.attachofemails[i][name];
                                }
                                $scope.data.currItem.attachofemails1.push(object);
                            }

                        }
                    }

                })
        }
    }
    $scope.show_people =function(){
        if($scope.data.currItem.snedto){
            var array = $scope.data.currItem.snedto.split(';');
            for(var i=0;i<array.length;i++){
                if(array[i]==''||array[i]==undefined){
                    continue;
                }
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+toTxt(array[i])+'" addr="'+array[i]+'" unselectable="on"><b unselectable="on" addr="'+array[i]+'">'+toTxt(array[i])+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final').before(add_elem);
                $scope.addfunction();
            }
        }
        if($scope.data.currItem.cc){
            var array = $scope.data.currItem.cc.split(';');
            for(var i=0;i<array.length;i++){
                if(array[i]==''||array[i]==undefined){
                    continue;
                }
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+toTxt(array[i])+'" addr="'+array[i]+'" unselectable="on"><b unselectable="on" addr="'+array[i]+'">'+toTxt(array[i])+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final1').before(add_elem);
                $scope.addfunction();
            }
        }
    }
    function toTxt(str) {
        var RexStr = /\<|\>|\"|\'|\&/g
        str = str.replace(RexStr, function(MatchStr) {
            switch (MatchStr) {
                case "<":
                    return "&lt;";
                    break;
                case ">":
                    return "&gt;";
                    break;
                case "\"":
                    return "&quot;";
                    break;
                case "'":
                    return "&#39;";
                    break;
                case "&":
                    return "&amp;";
                    break;
                default:
                    break;
            }
        })
        return str;
    }
    //删除
    $scope.delete_email = function(){
        postdata={};
        postdata.emailofemails =[];
        for(var i=$scope.data.emails.length-1;i>-1;i--){
            if(parseInt($scope.data.emails[i].emailid)==parseInt($scope.data.currItem.emailid)){
                postdata.emailofemails.push($scope.data.emails[i]);
            }
        }
        BasemanService.RequestPost("scpemail", "batchhide", postdata)
            .then(function(data) {
                BasemanService.notice("删除成功!", "alert-info");
                $scope.show_box($scope.data.flag);

            })
    }
    $scope.back =function(){
        var temp = $scope.data.show;
        $scope.data.show = $scope.data.last_show;
        $scope.data.last_show = temp;
    }
    //返回
    $scope.reply_common =function(){
        $scope.clearsend_email();
        $scope.data.last_show = $scope.data.show;
        $scope.data.show=2;
        var email =$scope.deal_data($scope.data.currItem.sendtoname);
        $scope.data.currItem.email = email.substr(0,email.length-1);
        $scope.data.currItem.subject_send = '回复:'+$scope.data.currItem.subject;
        $scope.data.currItem.snedto = $scope.data.currItem.fromuser;
        //新加附件
        /**if($scope.data.currItem.attachofemails!=undefined&&$scope.data.currItem.attachofemails.length>0){
			for(var i=0;i<$scope.data.currItem.attachofemails.length;i++){
				$scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
				$scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
				$scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
				$scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
			}
            $scope.data.currItem.attachofemails1 = $scope.data.currItem.attachofemails;
		}*/

            //$scope.data.currItem.cc = $scope.data.currItem.ccname;
        var head = '<div style="background:#efefef"><div>主题:'+$scope.data.currItem.subject+'</div>';
        if($scope.data.currItem.fromuser){
            head+='<div>发件人:'+$scope.data.currItem.fromuser+'</div>'
        }
        if($scope.data.currItem.sendtime){
            head+='<div>发送时间:'+$scope.data.currItem.sendtime+'</div>'
        }
        if($scope.data.currItem.sendtoname){
            head+='<div>收件人:'+$scope.data.currItem.sendtoname+'</div>'
        }
        if($scope.data.currItem.ccname){
            head+='<div>抄送人:'+$scope.data.currItem.ccname+'</div>'
        }
        head+='</div>'

        var str ='';
        if($scope.data.flag<=5){
            for(var i=0;i<$scope.data.usermails.length;i++){
                if($scope.data.usermails[i].email=='内部邮箱'){
                    if($scope.data.usermails[i].mail_autograph){
                        str='<br>——————————————</br>'+$scope.data.usermails[i].mail_autograph;
                    }
                }
            }
        }else{

            for(var i=0;i<$scope.data.usermails.length;i++){
                if(parseInt($scope.data.usermails[i].isdefault)==2){
                    if($scope.data.usermails[i].mail_autograph){
                        str = '<br>——————————————</br>'+$scope.data.usermails[i].mail_autograph;
                    }
                }
            }
        }
        var code = '<br></br><br></br>'+str+'<div>—————————————— 原始邮件 ——————————————</div>'+head+$scope.data.currItem.content;
        $('.summernote').summernote('code',code);
    }
    //转发

    $scope.tansfer =function(){
        $scope.clearsend_email();
        $scope.data.last_show = $scope.data.show;
        $scope.data.show=2;
        $scope.data.currItem.subject_send = '转发:'+$scope.data.currItem.subject;
        var head = '<div style="background:#efefef"><div>主题:'+$scope.data.currItem.subject+'</div>';
        if($scope.data.currItem.fromuser){
            head+='<div>发件人:'+$scope.data.currItem.fromuser+'</div>'
        }
        if($scope.data.currItem.sendtime){
            head+='<div>发送时间:'+$scope.data.currItem.sendtime+'</div>'
        }
        if($scope.data.currItem.sendtoname){
            head+='<div>收件人:'+$scope.data.currItem.sendtoname+'</div>'
        }
        if($scope.data.currItem.ccname){
            head+='<div>抄送人:'+$scope.data.currItem.ccname+'</div>'
        }
        head+='</div>'
        if($scope.data.flag<=5){
            for(var i=0;i<$scope.data.usermails.length;i++){
                if($scope.data.usermails[i].email=='内部邮箱'){
                    var str='<br>——————————————</br>'+$scope.data.usermails[i].mail_autograph;
                }
            }
        }else{
            var str ='';
            for(var i=0;i<$scope.data.usermails.length;i++){
                if(parseInt($scope.data.usermails[i].isdefault)==2){
                    str = '<br>——————————————</br>'+$scope.data.usermails[i].mail_autograph;
                }
            }
        }

        //拷贝附件
        $scope.data.currItem.attachofemails1 = []
        if($scope.data.currItem.attachofemails){
            for(var i=0;i<$scope.data.currItem.attachofemails.length;i++){
                var object ={};
                $scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
                $scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
                $scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
                $scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                for(name in $scope.data.currItem.attachofemails[i]){
                    object[name] = $scope.data.currItem.attachofemails[i][name];
                }
                $scope.data.currItem.attachofemails1.push(object);
            }

        }
        var code = '<br></br><br></br>'+str+'<div>——————————————原始邮件——————————————</div>'+head+$scope.data.currItem.content;
        $('.summernote').summernote('code',code);

    }
    $scope.reply =function(){

        $scope.data.currItem.cc="";
        $scope.reply_common();
        $scope.show_people();
    }
    //全部回复
    $scope.reply_all =function(){
        $scope.reply_common();
        $scope.data.currItem.cc = $scope.data.currItem.ccname;

        //抄送人
        if($scope.data.currItem.sendtoname!=undefined&&$scope.data.currItem.sendtoname!=''){
            var send_array = $scope.data.currItem.sendtoname.split(';');
            for(var i=0;i<send_array.length;i++){
                if(send_array[i].indexOf(userbean.userid)>-1){
                    continue;
                }else{
                    $scope.data.currItem.snedto+=';'+send_array[i];
                }
            }
        }
        $scope.show_people();

    }
    function getDays(strDateStart,strDateEnd){
        var strSeparator = "-"; //日期分隔符
        var oDate1;
        var oDate2;
        var iDays;
        oDate1= strDateStart.split(strSeparator);
        oDate2= strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
        return iDays ;
    }
    $scope._pageLoad = function (postdata) {
        if($scope.data.sqlwhere){
            postdata.sqlwhere = " a.subject like '%"+$scope.data.sqlwhere+"%' or a.fromusername like '%"+$scope.data.sqlwhere+"%'"
        }
        if(postdata.params){
            if(postdata.params==999){
                postdata.stat =99;
                postdata.flag =99;
                postdata.myflag = 999;
            }else{
                //未读邮件
                if(postdata.params==100){
                    postdata.stat =99;
                    postdata.flag =1;
                }else{
                    postdata.stat =postdata.params;
                    postdata.flag =postdata.params;
                }

            }

        }else{
            postdata.stat =99;
            postdata.flag =99;
        }

        /**if(postdata.flag==99){
			$scope.data.title="收件箱";
		}else{
			//$scope.data.title="收件箱";
		}*/
        //内部邮箱
        postdata.emailtype = 3;
        if(parseInt($scope.data.flag||0)>5){
            postdata.emailtype = 4;
        }
        BasemanService.RequestPost("scpemail", "selectall", postdata)
            .then(function(data) {
                console.warn(data);
                //未读
                if(postdata.params==99||postdata.params==77){
                    $scope.data.receivenew_out = parseInt(data.receivenew_out||0);
                    $scope.data.receivenew = parseInt(data.receivenew||0);
                    $scope.data.receivedraft_out = parseInt(data.receivedraft_out||0);
                    $scope.data.receivedraft = parseInt(data.receivedraft||0);
                }

                //总共多少封
                if(data.emails.length>0){
                    $scope.data.receivetotal = parseInt(data.emails[0].receivetotal||0);
                }else{
                    $scope.data.receivetotal=0;
                }

                //$scope.data.emails=data.emails;
                BasemanService.RequestPost("scpemail", "selectref", postdata)
                    .then(function(data) {
                        $scope.data.emails=data.emails;
                        for(var i=0;i<$scope.data.emails.length;i++){
                            if($scope.data.emails[i].receivetime==''||$scope.data.emails[i].receivetime==undefined){
                                $scope.data.emails[i].receivetime = $scope.data.emails[i].sendtime;
                            }
                        }
                        //星期一
                        $scope.data.xq1_emails=[];
                        //星期二
                        $scope.data.xq2_emails=[];
                        //星期三
                        $scope.data.xq3_emails=[];
                        //星期四
                        $scope.data.xq4_emails=[];
                        //星期五
                        $scope.data.xq5_emails=[];
                        //星期六
                        $scope.data.xq6_emails=[];
                        //今天
                        $scope.data.today_emails=[];
                        //上周
                        $scope.data.lastweek_emails=[];
                        //更早
                        $scope.data.early_emails=[];
                        var today =new Date().toDateString()
                        var j=0;
                        //1.判断今天是星期几
                        if(today.indexOf('Mon')>-1){
                            //星期1
                            j=1;
                        }
                        if(today.indexOf('Tue')>-1){
                            //星期2
                            j=2;
                        }
                        if(today.indexOf('Wed')>-1){
                            //星期3
                            j=3;
                        }
                        if(today.indexOf('Thu')>-1){
                            //星期4
                            j=4;
                        }
                        if(today.indexOf('Fri')>-1){
                            //星期5
                            j=5;
                        }
                        if(today.indexOf('Sat')>-1){
                            //星期6
                            j=6;
                        }
                        if(today.indexOf('Sun')>-1){
                            //星期天
                            j=7;
                        }
                        for(var i=0;i<$scope.data.emails.length;i++){
                            //今天
                            if( new Date($scope.data.emails[i].receivetime).toDateString()===new Date().toDateString()){
                                $scope.data.today_emails.push($scope.data.emails[i]);
                            }
                            var day=getDays(new Date($scope.data.emails[i].receivetime).Format('yyyy-MM-dd'),new Date().Format('yyyy-MM-dd'))
                            //console.warn(-);
                            //var day = Math.abs(new Date($scope.data.emails[i].receivetime)-new Date());
                            //星期6
                            if(day<=(j-6)&&day>(j-7)&&(j-6)!=0){
                                $scope.data.xq6_emails.push($scope.data.emails[i]);
                            }
                            if(day<=(j-5)&&day>(j-6)&&(j-5)!=0){
                                $scope.data.xq5_emails.push($scope.data.emails[i]);
                            }
                            if(day<=(j-4)&&day>(j-5)&&(j-4)!=0){
                                $scope.data.xq4_emails.push($scope.data.emails[i]);
                            }
                            if(day<=(j-3)&&day>(j-4)&&(j-3)!=0){
                                $scope.data.xq3_emails.push($scope.data.emails[i]);
                            }
                            if(day<=(j-2)&&day>(j-3)&&(j-2)!=0){
                                $scope.data.xq2_emails.push($scope.data.emails[i]);
                            }
                            if(day<=(j-1)&&day>(j-2)&&(j-1)!=0){
                                $scope.data.xq1_emails.push($scope.data.emails[i]);
                            }

                            //昨天
                            /**if(new Date($scope.data.emails[i].receivetime).toDateString() === new Date(new Date()-24*3600*1000).toDateString()){
							  $scope.data.yesterday_emails.push($scope.data.emails[i]);
						  }*/
                            //上周
                            if(day<=(j+6)&&day>=(j)){
                                $scope.data.lastweek_emails.push($scope.data.emails[i]);
                            }
                            //更早
                            if(day>(j+6)){
                                $scope.data.early_emails.push($scope.data.emails[i]);
                            }
                            $.base64.utf8encode = true;
                            var param = { id: parseInt($scope.data.emails[i][$scope.objconf.key]), userid: window.strUserId }
                            $scope.data.emails[i].url_param = $.base64.btoa(JSON.stringify(param), true);
                        }
                        data.pagination = data.pg;
                        if (data.pagination.length > 0) {
                            BasemanService.pageInfoOp($scope, data.pagination);
                        }

                    });

            });

    }
    $scope.star =function(e,id){
        var postdata = {emailid:id};
        if(e.currentTarget.attributes.class.value=='lightstar'){
            e.currentTarget.attributes.class.value='star';
            postdata.myflag=1;

        }else{
            e.currentTarget.attributes.class.value='lightstar'
            postdata.myflag=999;
        }
        BasemanService.RequestPost("scpemailtrk", "addmyflag", postdata)
            .then(function(data) {
            })
    }
    $scope.show_box(1);

    setInterval(function() {
        if($scope.data.flag==1||$scope.data.flag==6){
            //$scope.search(99);
        }
        BasemanService.RequestPost("scpallemail", "email_wdqty", {},true)
            .then(function(data) {
                $scope.data.receivenew_out = parseInt(data.receivenew_out||0);
                $scope.data.receivenew = parseInt(data.receivenew||0);
                $scope.data.receivedraft_out = parseInt(data.receivedraft_out||0);
                $scope.data.receivedraft = parseInt(data.receivedraft||0);
            })
    }, 4000);
    //自适应高度
    setInterval(function() {

        if($scope.data.flag>5){
            $('#addwidth1').height($(document).height()-$('#addwidth1')[0].offsetTop*2+$scope.data.currItem.attachofemails1.length*30-30);
            $('#lm150338581407203951792705359891tree').height($(document).height()-$('#addwidth1')[0].offsetTop*2+$scope.data.currItem.attachofemails1.length*30-80-30);
            $('#main .panel-body').height($('#addwidth1').height()-$('#contents').parent().parent()[0].offsetTop-$('#addwidth1')[0].offsetTop-20);
        }else{
            $('#addwidth').height($(document).height()-$('#addwidth')[0].offsetTop*2+$scope.data.currItem.attachofemails1.length*30-30);
            $('#lm150338581407203951792705359891tree').height($(document).height()-$('#addwidth')[0].offsetTop*2+$scope.data.currItem.attachofemails1.length*30-80-30);
            $('#main .panel-body').height($('#addwidth').height()-$('#contents').parent().parent()[0].offsetTop-$('#addwidth')[0].offsetTop-20);

        }
        //
        if($('#mail_content').height()>($(document).height()-120-30)){

        }else{
            //$('#mail_content').height($(document).height()-120-30);
        }

        $('.limit').height($(document).height()-$('.limit')[0].offsetTop);



    }, 200);
    $(document).on("click",function (e) {
        $('.attbg_focus').removeClass('attbg_focus');
        if($scope.focus==2){
            if($scope.data.currItem.search_linep){
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+$scope.data.currItem.search_linep+'" addr="'+$scope.data.currItem.search_linep+'" unselectable="on"><b unselectable="on" addr="'+$scope.data.currItem.search_linep+'">'+$scope.data.currItem.search_linep+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final1').before(add_elem);
                $scope.addfunction();
                $scope.data.currItem.cc +=$scope.data.currItem.search_linep+';'
                $scope.data.currItem.search_linep='';

            }


        }else{
            if($scope.data.currItem.search_peop){
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+$scope.data.currItem.search_peop+'" addr="'+$scope.data.currItem.search_peop+'" unselectable="on"><b unselectable="on" addr="'+$scope.data.currItem.search_peop+'">'+$scope.data.currItem.search_peop+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final').before(add_elem);
                $scope.addfunction();
                $scope.data.currItem.snedto +=$scope.data.currItem.search_peop+';'
                $scope.data.currItem.search_peop='';
            }
        }

    })

    $('#toAreaCtrl').click(function(e){
        $('#toAreaCtrl .addr_text .js_input').focus();
    })
    $('#toAreaCtrl1').click(function(e){
        $('#toAreaCtrl1 .addr_text .js_input').focus();
    })
    $('#toAreaCtrl').dblclick(function(e){
        $('#toAreaCtrl .addr_text .js_input').select();
        $('#toAreaCtrl .addr_base').addClass('attbg_focus');
        return false;

    })
    $('#toAreaCtrl1').dblclick(function(e){
        $('#toAreaCtrl1 .addr_text .js_input').select();
        $('#toAreaCtrl1 .addr_base').addClass('attbg_focus');
        return false;

    })
    $('#toAreaCtrl .addr_text .js_input').dblclick(function(e){
        $('#toAreaCtrl .addr_text .js_input').select();
        if($scope.data.currItem.search_peop==''||$scope.data.currItem.search_peop==undefined){

        }else{
            return false;
        }

    })
    $('#toAreaCtrl1 .addr_text .js_input').dblclick(function(e){
        $('#toAreaCtrl1 .addr_text .js_input').select();
        if($scope.data.currItem.search_linep==''||$scope.data.currItem.search_linep==undefined){

        }else{
            return false;
        }

    })
    $('#toAreaCtrl .addr_text .js_input').keydown(function(e){
        if(e.keyCode === 8){
            if($scope.data.currItem.search_peop==''||$scope.data.currItem.search_peop==undefined){

            }else{
                var l = e.currentTarget.selectionStart;
                if(e.currentTarget.selectionStart==e.currentTarget.selectionEnd){
                    $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0,e.currentTarget.selectionStart-1)+$scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l-1;
                    e.currentTarget.selectionEnd = l-1;
                }else{
                    $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0,e.currentTarget.selectionStart)+$scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l;
                    e.currentTarget.selectionEnd = l;
                }



                return false;
            }

        }else if(e.keyCode===186){

            if($scope.data.currItem.search_peop){
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+$scope.data.currItem.search_peop+'" addr="'+$scope.data.currItem.search_peop+'" unselectable="on"><b unselectable="on" addr="'+$scope.data.currItem.search_peop+'">'+$scope.data.currItem.search_peop+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final').before(add_elem);
                $scope.addfunction();
                $scope.data.currItem.snedto +=$scope.data.currItem.search_peop+';'
                $scope.data.currItem.search_peop='';
            }
            $scope.$apply();
            return false;

        }
    })
    $('#toAreaCtrl1 .addr_text .js_input').keydown(function(e){
        if(e.keyCode === 8){
            if($scope.data.currItem.search_linep==''||$scope.data.currItem.search_linep==undefined){

            }else{
                var l = e.currentTarget.selectionStart;
                if(e.currentTarget.selectionStart==e.currentTarget.selectionEnd){
                    $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0,e.currentTarget.selectionStart-1)+$scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l-1;
                    e.currentTarget.selectionEnd = l-1
                }else{
                    $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0,e.currentTarget.selectionStart)+$scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l
                    e.currentTarget.selectionEnd = l
                }



                return false;
            }

        }else if(e.keyCode===186){
            if($scope.data.currItem.search_linep){
                var add_elem ='<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="'+$scope.data.currItem.search_linep+'" addr="'+$scope.data.currItem.search_linep+'" unselectable="on"><b unselectable="on" addr="'+$scope.data.currItem.search_linep+'">'+$scope.data.currItem.search_linep+'</b><span class="semicolon">;</span><a href="javascript:;" class="addr_del" name="del"></a></div>'
                $('#final1').before(add_elem);
                $scope.addfunction();
                $scope.data.currItem.cc +=$scope.data.currItem.search_linep+';'
                $scope.data.currItem.search_linep='';


            }
            $scope.$apply();

            return false;

        }
    })
    $('#zuti').keydown(function(e){
        if(e.keyCode === 8){
            if($scope.data.currItem.subject_send==''||$scope.data.currItem.subject_send==undefined){
                return false;
            }else{
                var l = e.currentTarget.selectionStart;
                if(e.currentTarget.selectionStart==e.currentTarget.selectionEnd){
                    $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0,e.currentTarget.selectionStart-1)+$scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l-1;
                    e.currentTarget.selectionEnd = l-1
                }else{
                    $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0,e.currentTarget.selectionStart)+$scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length-1);
                    $scope.$apply();
                    e.currentTarget.selectionStart = l;
                    e.currentTarget.selectionEnd = l
                }
                return false;
            }

        }
    })

    $('#toAreaCtrl .addr_text .js_input').click(function(e){
        return false;
    })
    $('#toAreaCtrl1 .addr_text .js_input').click(function(e){
        return false;
    })
    $scope.addfunction =function(){
        $('.addr_base').click(function(e){
            $(this).siblings().removeClass('attbg_focus');
            $(this).siblings().removeClass('attbg');
            $(this).siblings().addClass('attbg');
            $(this).removeClass('attbg');
            $(this).addClass('attbg_focus');
            if(this.parentNode.attributes.id.value=='toAreaCtrl'){
                $('#toAreaCtrl1').children().removeClass('attbg_focus');
            }else{
                $('#toAreaCtrl').children().removeClass('attbg_focus');
            }

            return false
        })
    }
    //收件人 点击
    $scope.addfunction();
    $scope.one_click =function(){
        $(document).one("keydown",function (e) {
            if(e.target && e.target.id=='lm15034559988030725050352368402searchtext'){
                return ;
            }
            if(e.keyCode === 8){
                if($scope.focus==2){
                    $('#toAreaCtrl1 .attbg_focus').remove();
                    $scope.data.currItem.cc ='';
                    for(var i=0;i<$('#toAreaCtrl1 .addr_base').length;i++){

                        if(i==0){
                            $scope.data.currItem.cc=$('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
                        }else{
                            $scope.data.currItem.cc+=';'+$('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
                        }
                    }
                    $('#final1').prev().addClass('attbg_focus');
                }else{
                    $('#toAreaCtrl .attbg_focus').remove();
                    $scope.data.currItem.snedto ='';
                    for(var i=0;i<$('#toAreaCtrl .addr_base').length;i++){

                        if(i==0){
                            $scope.data.currItem.snedto=$('#toAreaCtrl .addr_base')[i].attributes.title.value;
                        }else{
                            $scope.data.currItem.snedto+=';'+$('#toAreaCtrl .addr_base')[i].attributes.title.value;
                        }
                    }
                    $('#final').prev().addClass('attbg_focus');
                }

            }
            $scope.one_click();
        })
    }
    $scope.one_click();
    //$scope.search(99)
    $scope.viewColumns=[];
    //界面初始化
    $scope.clearinformation = function () {
        if (!$scope.data) $scope.data = {

        }
        $scope.data.title="收件箱";
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            usable:2,
            seaport_type:1,
            attachofemails1:[]
        };
    };
    /**--------系统词汇词------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "seaport_type"}).then(function (data) {
        $scope.seaport_types = data.dicts;
    });
    /**----弹出框区域*---------------*/
    //收件人查询
    $scope.openuserFrm = function () {
        $scope.FrmInfo = {
            classid: "scpuser",
            backdatas: "users",
            sqlBlock: "1=1 ",
            type:'checkbox'
        };
        BasemanService.open(CommonPopController, $scope).result.then(function(data) {
            //判断用户是否已经重复多选，如果重复的话就不给他加入。
            if($scope.data.currItem.snedto==''||$scope.data.currItem.snedto==undefined){
                $scope.data.currItem.snedto='';
                $scope.data.currItem.totype='';
                for(var i=0;i<data.length;i++){
                    if($scope.data.currItem.snedto.indexOf(data[i].username)==-1){
                        if(i==data.length-1){
                            $scope.data.currItem.snedto+=data[i].username;
                            $scope.data.currItem.totype+='13';
                        }else{
                            $scope.data.currItem.snedto+=data[i].username+';';
                            $scope.data.currItem.totype+='13'+';';
                        }
                    }
                }
            }else{
                for(var i=0;i<data.length;i++){
                    $scope.data.currItem.snedto+=';'+data[i].username;
                    $scope.data.currItem.totype+=';'+'13';
                }
            }

        });
    };
    //抄送
    $scope.sendTo =function(){
        $scope.FrmInfo = {
            classid: "scpuser",
            backdatas: "users",
            sqlBlock: "1=1 ",
            type:'checkbox'
        };
        BasemanService.open(CommonPopController, $scope).result.then(function(data) {
            //判断用户是否已经重复多选，如果重复的话就不给他加入。
            if($scope.data.currItem.cc==''||$scope.data.currItem.cc==undefined){
                $scope.data.currItem.cc='';
                for(var i=0;i<data.length;i++){
                    if($scope.data.currItem.cc.indexOf(data[i].username)==-1){
                        if(i==data.length-1){
                            $scope.data.currItem.cc+=data[i].username;
                            $scope.data.currItem.cctype+='13';
                        }else{
                            $scope.data.currItem.cc+=data[i].username+';';
                            $scope.data.currItem.cctype+='13'+';';
                        }
                    }
                }
            }else{
                for(var i=0;i<data.length;i++){
                    $scope.data.currItem.cc+=';'+data[i].username;
                    $scope.data.currItem.cctype+=';'+'13';
                }
            }

        });
    }
    //将
    $scope.deal_data =function(str){
        var new_str='';
        var arr = str.split(';');
        for(var i=0;i<arr.length;i++){
            if(arr[i]==''||arr[i]==undefined){
                continue;
            }
            var left = arr[i].indexOf('<');
            if(left==-1){
                new_str+=arr[i]+';'
            }else{
                var right = arr[i].indexOf('>');
                var s=arr[i].substr(left+1,right-left-1);
                new_str+=s+';';
            }

        }
        return new_str;
    }
    $scope.send_cancel =function(){
        //$scope.clearsend_email();
        var temp = 0;
        temp = $scope.data.show;
        $scope.data.show = $scope.data.last_show;
        $scope.data.last_show = temp;
    }
    //添加邮件的类型
    $scope.add_type =function(){
        $scope.data.currItem.totype = "";
        for(var i=0;i<$('#toAreaCtrl .addr_normal').length;i++){
            if($('#toAreaCtrl .addr_normal')[i].attributes.addr.value=='部门'){

                $scope.data.currItem.totype+='12;';
            }else{
                $scope.data.currItem.totype+='13;';
            }
        }
        for(var i=0;i<$('#toAreaCtrl1 .addr_normal').length;i++){
            if($('#toAreaCtrl1 .addr_normal')[i].attributes.addr.value=='部门'){

                $scope.data.currItem.cctype+='12;';
            }else{
                $scope.data.currItem.cctype+='13;';
            }
        }
    }
    //发送邮件
    $scope.send_email =function(flag){
        var postdata={
            sysuserid:userbean.sysuserid,
            fromuser:userbean.userid,
            emailtype:3,
            stat:2,
            myflag:0,
            contentid:-2
        };
        //外部邮箱
        if($scope.data.flag>5){
            postdata.emailtype =4;
            if($scope.data.mailserverid)
            //是什么类型邮件
                postdata.mailserverid =$scope.data.mailserverid;
            postdata.email = $scope.data.email;
            postdata.usermailid = $scope.data.usermailid;
        }
        //草稿
        if(flag==2){
            postdata.stat=1;
        }
        $scope.add_type();
        if($scope.data.currItem.snedto){
            //postdata.totype='13';
            postdata.sendtoname = ($scope.data.currItem.snedto);
            postdata.sendto = $scope.deal_data($scope.data.currItem.snedto);
            /**var arr = $scope.data.currItem.snedto.split(';');
             for(var i=1;i<arr.length;i++){
				if(arr[i]==''||arr[i]==undefined){
					continue;
				}
				postdata.totype+=';13'
			}*/
            postdata.totype = $scope.data.currItem.totype.substr(0,$scope.data.currItem.totype.length-1);
        }
        if($scope.data.currItem.cc){
            //postdata.cctype='13';
            postdata.ccname = ($scope.data.currItem.cc)
            postdata.cc = $scope.deal_data($scope.data.currItem.cc)
            /**var arr = $scope.data.currItem.cc.split(';');
             for(var i=1;i<arr.length;i++){
				postdata.cctype+=';13'
			}*/
            postdata.cctype = $scope.data.currItem.cctype.substr(0,$scope.data.currItem.cctype.length-1)
        }


        if($scope.data.currItem.attachofemails1){
            for(var i=0;i<$scope.data.currItem.attachofemails1.length;i++){
                $scope.data.currItem.attachofemails1[i].downloadcode = $scope.data.currItem.attachofemails1[i].downloadcode;
                $scope.data.currItem.attachofemails1[i].refid = $scope.data.currItem.attachofemails1[i].docid;
                $scope.data.currItem.attachofemails1[i].refname = $scope.data.currItem.attachofemails1[i].docname;
                $scope.data.currItem.attachofemails1[i].refsize = $scope.data.currItem.attachofemails1[i].oldsize;
                $scope.data.currItem.attachofemails1[i].reftype = 6;

            }
            postdata.attachofemails = $scope.data.currItem.attachofemails1;
        }

        postdata.content=$('.summernote').summernote('code');
        if(($scope.data.currItem.subject_send==''||$scope.data.currItem.subject_send==undefined)&&flag!=2){
            var title ='主题为空，是否继续发送？';
            if(flag==2){
                title = '主题为空，是否存为草稿？'
            }
            ds.dialog.confirm(title, function () {
                postdata.subject = '(无主题)'
                BasemanService.RequestPost("scpemail", "insert", postdata)
                    .then(function(data) {
                        //清空发件内容
                        $scope.clearsend_email();
                        if(flag==2){
                            BasemanService.notice("存为草稿成功!", "alert-info");
                        }else{
                            BasemanService.notice("发送成功!", "alert-info");
                            //返回收件箱
                            $scope.search(99);
                        }

                    });
            }, function () {

            });

        }else{
            postdata.subject = $scope.data.currItem.subject_send;
            BasemanService.RequestPost("scpemail", "insert", postdata)
                .then(function(data) {
                    //清空发件内容
                    $scope.clearsend_email();
                    if(flag==2){
                        $scope.data.currItem.emailid = data.emailid;
                        BasemanService.notice("存为草稿成功!", "alert-info");

                    }else{
                        BasemanService.notice("发送成功!", "alert-info");
                        //返回收件箱
                        $scope.search(99);
                    }
                });

        }
    }
    $('.summernote').summernote({
        height: 300,
        lang: 'zh-CN',
        fontNames: ["微软雅黑","华文细黑",'Arial','sans-serif',"宋体", "Times New Roman", 'Times', 'serif',"华文细黑",'Courier New', 'Courier','华文仿宋','Georgia', "Times New Roman", 'Times',"黑体", 'Verdana', 'sans-seri',"方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
        callbacks: {
            onImageUpload: function(files, editor, welEditable) {
                editor=$(this);
                uploadFile(files[0],editor,welEditable); //此处定义了上传文件方法
            }
        }

    });
    function uploadFile(file,editor,welEditable) {
        fd = new FormData();
        fd.append("docFile0", file);
        $.ajax({
            data: fd,
            type: "POST",
            url: '/web/scp/filesuploadsave2.do', //此处配置后端的上传文件，PHP，JSP或者其它
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                var obj = strToJson(res);
                //obj.data[0].downloadcode
                //'img/p1.jpg'
                editor.summernote('insertImage','/downloadfile.do?iswb=true&docid='+ obj.data[0].docid); //完成上传后插入图片到编辑器

            }
        });
    }
    $('.note-editing-area').keydown(function(event){
        event.stopPropagation();
        console.warn(event);
    })
    var setting = {
        async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
                "flag": 1
            },
            dataFilter: filter
        },
        view: {
            //dblClickExpand: false,
            showIcon: showIconForTree,
            selectedMulti:true
        },
        check: {
            enable: true,//设置zTree的节点上是否显示checkbox/radio框，默认值: false
            chkboxType: { "Y": "ps", "N": "ps" }
        },
        key:{
            checked:"checked"//zTree 节点数据中保存check状态的属性名称。默认值："checked"
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback : {
            beforeExpand: beforeExpand,
            //onRightClick : OnRightClick,//右键事件
            onCheck:onCheck,
            onClick:onClick_tons
            //dblClick:dblClick_ts
        }
    };
    var setting_in = {
        async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
                "flag": 1
            },
            dataFilter: filter
        },
        view: {
            showIcon: showIconForTree,
            selectedMulti:true
        },
        check: {
            enable: true,//设置zTree的节点上是否显示checkbox/radio框，默认值: false
            chkboxType: { "Y": "ps", "N": "ps" }
        },
        key:{
            checked:"checked"//zTree 节点数据中保存check状态的属性名称。默认值："checked"
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback : {
            //beforeExpand: beforeExpand,
            //onRightClick : OnRightClick,//右键事件
            onCheck:onCheck_in,
            onClick:onClick_in_tons
        }
    };

    function beforeExpand(){
        //双击时取消单机事件
        if(TimeFn){
            clearTimeout(TimeFn);
        }
    }
    //这个是异步
    function filter(treeId, parentNode, childNodes) {

        var treeNode = parentNode;
        if(treeNode && treeNode.children) {
            return;
        }
        if(treeNode) {
            var postdata = treeNode
        } else {
            var postdata = {};
        }
        postdata.flag=1;
        postdata.emailtype =3;
        postdata.orgid = parseInt(postdata.id);
        var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
        var children = obj.data.scporgs;
        if(children) {
            treeNode.children = [];
            for(var i = 0; i < children.length; i++) {
                if(parseInt(children[i].sysuserid)>0){
                    children[i].name = children[i].username;
                }else{
                    children[i].isParent =  true;
                }

            }
        }
        return children;

    }
    function onCheck(e, treeId, treeNode) {
        if(treeNode.checked){
            if(treeNode.isParent){
                /**for(var i=0;i<treeNode.children.length;i++){
					//增加抄送人
					if($scope.focus==2){
					  $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,treeNode.children[i]);

					//增加收件人
					}else{
					  $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,treeNode.children[i]);
					}
				}*/
                var postdata = {};
                postdata.flag=1;
                postdata.emailtype =3;
                postdata.orgid = parseInt(treeNode.id);
                var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
                var children = obj.data.scporgs;
                for(var i = 0; i < children.length; i++) {
                    if(parseInt(children[i].sysuserid)>0){
                        if($scope.focus==2){
                            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,children[i]);
                            //增加收件人
                        }else{
                            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,children[i]);
                        }
                    }

                }
            }
        }
    }
    function onCheck_in(e, treeId, treeNode) {
        if(treeNode.checked){
            if(treeNode.isParent){
                /**for(var i=0;i<treeNode.children.length;i++){
					//增加抄送人
					if($scope.focus==2){
					  $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,treeNode.children[i]);

					//增加收件人
					}else{
					  $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,treeNode.children[i]);
					}
				}*/
                var postdata = {};
                postdata.flag=1;
                postdata.emailtype =3;
                postdata.orgid = parseInt(treeNode.id);
                var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
                var children = $.extend(true, [], obj.data.scporgs);
                for(var i = 0; i < children.length; i++) {
                    if(parseInt(children[i].sysuserid)>0){
                        if($scope.focus==2){
                            if(children[i].email){
                                children[i].userid=children[i].email;
                                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,children[i]);
                            }
                            //增加收件人
                        }else{
                            if(children[i].email){
                                children[i].userid=children[i].email;
                                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,children[i]);
                            }
                        }
                    }

                }
            }
        }
    }
    function onCheck_fz(e, treeId, treeNode) {
        if(treeNode.checked){
            if(treeNode.isParent){
                for(var i=0;i<treeNode.children.length;i++){
                    //增加抄送人
                    if($scope.focus==2){
                        $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,treeNode.children[i]);

                        //增加收件人
                    }else{
                        $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,treeNode.children[i]);
                    }
                }

            }
        }
    }
    function onClick_tons(treeId, treeNode){
        // 取消上次延时未执行的方法
        clearTimeout(TimeFn);
        //执行延时
        TimeFn = setTimeout(function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var node = zTree.getSelectedNodes()[0];
            //机构
            if(!node.userid){
                node.is_bumen='部门';
                node.userid = node.id
                node.username = node.name
            }
            //增加抄送人
            if($scope.focus==2){
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,node);

                //增加收件人
            }else{
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,node);
            }
        },300)
    }
    function onClick_in_tons(treeId, treeNode){
        // 取消上次延时未执行的方法
        clearTimeout(TimeFn);
        //执行延时
        TimeFn = setTimeout(function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_in");
            var node = zTree.getSelectedNodes()[0];
            //增加抄送人
            if($scope.focus==2){
                if(node.email){
                    node.userid = node.email;
                    $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,node);
                }

                //增加收件人
            }else{
                if(node.email){
                    node.userid = node.email;
                    $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,node);
                }
            }
        },300)
    }
    var setting1 = {
        view: {
            showIcon: showIconForTree
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback : {
            onClick:onClick_fz,
            onCheck:onCheck_fz
            //onDblClick: onDblClick
        }
    };
    var setting1_out = {
        view: {
            showIcon: showIconForTree
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback : {
            onClick:onClick_fz,
            onCheck:onCheck_fz
            //onDblClick: onDblClick
        }
    };
    /**function filter(treeId, parentNode, childNodes) {
			return null;

		}*/

    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };
    function onClick_fz(treeId, treeNode){
        var zTree = $.fn.zTree.getZTreeObj(treeNode);
        var node = zTree.getSelectedNodes()[0];
        //增加抄送人
        if($scope.focus==2){
            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,node);

            //增加收件人
        }else{
            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,node);
        }
    }
    function onDblClick(treeId, treeNode){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
        var node = zTree.getSelectedNodes()[0];
        if(node.contactname){
            return;
        }
        $scope.node = node;
        BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype =3;
            BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                .then(function(data) {

                    BasemanService.notice("分组创建成功", "alert-info");

                })
        })
    }
    $scope.group_change =function(flag){
        if(flag==2){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_out");
            var node = zTree.getSelectedNodes()[0];
            if(node.contactname){
                return;
            }
        }else{
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
            var node = zTree.getSelectedNodes()[0];
            if(node.contactname){
                return;
            }
        }

        $scope.node = node;
        BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
            var postdata = res;
            if(flag==2){
                postdata.emailtype =4;
            }else{
                postdata.emailtype =3;
            }
            BasemanService.RequestPost("scpemail_contact_list", "add_contact_group", postdata)
                .then(function(data) {
                    if(flag==2){
                        $scope.treeDemo_out.refresh();
                    }else{
                        $scope.treeDemo_in.refresh();
                    }

                    BasemanService.notice("分组创建成功", "alert-info");

                })
        })
    }

    //最近联系人
    BasemanService.RequestPost("scpemail_contact_list", "search", {emailtype:3})
        .then(function(data) {
            //内部邮件通讯显示
            $scope.data.currItem.scpemail_contact_lists = data.scpemail_contact_lists;
            for(var i=0;i<data.scpemail_contact_group_lists.length;i++){
                data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                if(data.scpemail_contact_group_lists[i].contactname){
                    data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                }else{
                    data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                    data.scpemail_contact_group_lists[i].isParent = true;
                }

            }
            $scope.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
            for(var i=0;i<data.scporgs.length;i++){
                data.scporgs[i].id = parseInt(data.scporgs[i].id);
                data.scporgs[i].pId = parseInt(data.scporgs[i].pid);


            }
            for(var i=0;i<data.scporgs.length;i++){
                if(data.scporgs[i].username){
                    data.scporgs[i].orgname = data.scporgs[i].name;
                    data.scporgs[i].name=data.scporgs[i].username;
                }else{
                    data.scporgs[i].isParent = true;
                }
            }

            $scope.data.scporgs = data.scporgs;
            $scope.treeDemo_in = $.fn.zTree.init($("#treeDemo1"), setting1, data.scpemail_contact_group_lists);
            $.fn.zTree.init($("#treeDemo"), setting, data.scporgs);
            $.fn.zTree.init($("#treeDemo_in"), setting_in, data.scporgs);
            //外部邮箱通讯显示 联系人

            $scope.data.currItem.scpemail_contact_wb_lists = data.scpemail_contact_wb_lists;
            //分组
            for(var i=0;i<data.scpemail_contact_group_wb_lists.length;i++){
                data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
                data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
                if(data.scpemail_contact_group_wb_lists[i].contactname){
                    data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
                }else{
                    data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                    data.scpemail_contact_group_wb_lists[i].isParent = true;
                }

            }
            //外部邮箱分组
            $scope.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;

            $scope.treeDemo_out = $.fn.zTree.init($("#treeDemo_out"), setting1_out, data.scpemail_contact_group_wb_lists);


        })
    $('#send_people').mouseover(function(body) {////body可以随便
        $scope.data.currItem.fromuser_name = $scope.data.currItem.fromuser;
        var left = $scope.data.currItem.fromuser_name.indexOf('<');
        var right = $scope.data.currItem.fromuser_name.indexOf('>');
        $scope.data.currItem.email_name= $scope.data.currItem.fromuser_name.substr(left+1,right-left-1);
        $('.profileTip').css({'display':'block','top':50+'px',left:(body.pageX-300)+'px'});
        $scope.$apply();
    });
    $('#send_people').mouseout(function(body) {////body可以随便
        $('.profileTip').css('display','none');
    })
    $('#sj_people').mouseover(function(body) {////body可以随便
        $('.profileTip').css({'display':'block','top':88+'px'});
    });
    $('#sj_people').mouseout(function(body) {////body可以随便
        $('#send_people .profileTip').css('display','none');
    })
    $('.profileTip').mouseover(function(){
        $('.profileTip').css({'display':'block'});
    })
    $('.profileTip').mouseout(function(){
        $('.profileTip').css({'display':'none'});
    })
    $scope.mouseover_sj =function(item,index,e){
        $scope.data.currItem.fromuser_name = item;
        var left = $scope.data.currItem.fromuser_name.indexOf('<');
        var right = $scope.data.currItem.fromuser_name.indexOf('>');
        $scope.data.currItem.email_name= $scope.data.currItem.fromuser_name.substr(left+1,right-left-1);
        $('.profileTip').css({'display':'block','top':88+'px',left:(e.pageX-300)+'px'});
    }
    //增加高度
    $scope.addheight =function(){
        $('#addwidth').height(480+$scope.data.currItem.attachofemails1.length*29);
        $('#lm150338581407203951792705359891tree').height(400+$scope.data.currItem.attachofemails1.length*29)
    }
    var watch=$scope.$watch('data.currItem.attachofemails1', function(newValue, oldValue) {
        if (newValue === oldValue) {return;}
        $scope.addheight();
    },true);

    $scope.mail=[];
    //初始化邮箱列表
    //$scope.mail = ["sina.com","126.com","163.com","gmail.com","qq.com","vip.qq.com","hotmail.com","sohu.com","139.com","vip.sina.com","21cn.cn","189.cn","sina.cn"]

    /**
     for(var i=0;i<$scope.mail.length;i++){
			var $liElement = $("<li class=\"autoli\"><span class=\"ex\"></span><span class=\"at\">@</span><span class=\"step\">"+$scope.mail[i]+"</span></li>");
			$liElement.appendTo("ul.autoul");
		}*/
    $("#mail").keyup(function(){
        console.warn('1111111111111111111');
        var postdata={};
        postdata.clas=2;
        if($scope.focus==2){
            postdata.sqlwhere = " userid like '%"+$scope.data.currItem.cc +"%' or  username like '%"+$scope.data.currItem.cc+"%'";
        }

        BasemanService.RequestPost("scpuser", "search", postdata)
            .then(function(data) {
                $("ul.autoul li").detach();
                for(var i=0;i<data.users.length;i++){
                    var strname = '';
                    strname = data.users[i].username +'<'+data.users[i].userid +'>';
                    //把邮箱列表加入下拉
                    //将取出的数据清空

                    var $liElement = $("<li class=\"autoli\"><span class=\"ex\"></span><span class=\"at\">@</span><span class=\"step\">"+strname+"</span></li>");
                    $liElement.appendTo("ul.autoul");

                }
                //下拉显示
                $(".autoul").show();
                //同时去掉原先的高亮，把第一条提示高亮
                if($(".autoul li.lihover").hasClass("lihover")) {
                    $(".autoul li.lihover").removeClass("lihover");
                }
                $(".autoul li:visible:eq(0)").addClass("lihover");
                if(event.keyCode == 8 || event.keyCode == 46){

                    $(this).next().children().removeClass("lihover");
                    $(this).next().children("li:visible:eq(0)").addClass("lihover");
                }//删除事件结束

                if(event.keyCode == 38){
                    //使光标始终在输入框文字右边
                    $(this).val($(this).val());
                }//方向键↑结束

                if(event.keyCode == 13){
                    if($("ul.autoul li").is(".lihover")) {
                        $("#mail").val($("ul.autoul li.lihover").children(".ex").text() + "@" + $("ul.autoul li.lihover").children(".step").text());
                    }
                    $(".autoul").children().hide();
                    $(".autoul").children().removeClass("lihover");
                    $("#mail").focus();//回车后输入栏获得焦点
                }
            })
    })
    //下拉菜单初始隐藏
    $(".autoul").hide();
    /**$("#mail").keyup(function(){

             if(event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){

		          //菜单展现，需要排除空格开头和"@"开头
				  if( $.trim($(this).val())!="" && $.trim(this.value).match(/^@/)==null ) {

					$(".autoul").show();
					//同时去掉原先的高亮，把第一条提示高亮
					if($(".autoul li.lihover").hasClass("lihover")) {
					  $(".autoul li.lihover").removeClass("lihover");
					}
					$(".autoul li:visible:eq(0)").addClass("lihover");
				  }else{//如果为空或者"@"开头
					$(".autoul").hide();
					$(".autoul li:eq(0)").removeClass("lihover");
				  }

				  //把输入的字符填充进提示，有两种情况：1.出现"@"之前，把"@"之前的字符进行填充；2.出现第一次"@"时以及"@"之后还有字符时，不填充
				  //出现@之前
				  if($.trim(this.value).match(/[^@]@/)==null){//输入了不含"@"的字符或者"@"开头

					if($.trim(this.value).match(/^@/)==null){
					  //不以"@"开头
					  $(this).next().children("li").children(".ex").text($(this).val());
					}
				  }else{

					//输入字符后，第一次出现了不在首位的"@"
					//当首次出现@之后，有2种情况：1.继续输入；2.没有继续输入
					//当继续输入时
					var str = this.value;//输入的所有字符
					var strs = new Array();
					strs = str.split("@");//输入的所有字符以"@"分隔
					$(".ex").text(strs[0]);//"@"之前输入的内容
					var len = strs[0].length;//"@"之前输入内容的长度
					if(this.value.length>len+1){

					  //截取出@之后的字符串,@之前字符串的长度加@的长度,从第(len+1)位开始截取
					  var strright = str.substr(len+1);

					  //正则屏蔽匹配反斜杠"\"
					  if(strright.match(/[\\]/)!=null){
						strright.replace(/[\\]/,"");
						return false;
					  }

					  //遍历li
					  $("ul.autoul li").each(function(){

						//遍历span
						//$(this) li
						$(this).children("span.step").each(function(){

						  //@之后的字符串与邮件后缀进行比较
						  //当输入的字符和下拉中邮件后缀匹配并且出现在第一位出现
						  //$(this) span.step
						  if($("ul.autoul li").children("span.step").text().match(strright)!=null && $(this).text().indexOf(strright)==0){
							//class showli是输入框@后的字符和邮件列表对比匹配后给匹配的邮件li加上的属性
							$(this).parent().addClass("showli");
							//如果输入的字符和提示菜单完全匹配，则去掉高亮和showli，同时提示隐藏
							if(strright.length>=$(this).text().length){
							  $(this).parent().removeClass("showli").removeClass("lihover").hide();
							}
						  }else{
							$(this).parent().removeClass("showli");
						  }
						  if($(this).parent().hasClass("showli")){
							$(this).parent().show();
							$(this).parent("li").parent("ul").children("li.showli:eq(0)").addClass("lihover");
						  }else{
							$(this).parent().hide();
							$(this).parent().removeClass("lihover");
						  }
						});
					  });
					}else{
					  //"@"后没有继续输入时
					  $(".autoul").children().show();
					  $("ul.autoul li").removeClass("showli");
					  $("ul.autoul li.lihover").removeClass("lihover");
					  $("ul.autoul li:eq(0)").addClass("lihover");
					}
				  }
			}//有效输入按键事件结束




	    })*/
    $("#mail").keydown(function(){
        if(event.keyCode == 40){
            //当键盘按下↓时,如果已经有li处于被选中的状态,则去掉状态,并把样式赋给下一条(可见的)li
            if ($("ul.autoul li").is(".lihover")) {
                //如果还存在下一条(可见的)li的话
                if ($("ul.autoul li.lihover").nextAll().is("li:visible")) {

                    if ($("ul.autoul li.lihover").nextAll().hasClass("showli")) {

                        $("ul.autoul li.lihover").removeClass("lihover")
                            .nextAll(".showli:eq(0)").addClass("lihover");
                    } else {

                        $("ul.autoul li.lihover").removeClass("lihover").removeClass("showli")
                            .next("li:visible").addClass("lihover");
                        $("ul.autoul").children().show();
                    }
                } else {

                    $("ul.autoul li.lihover").removeClass("lihover");
                    $("ul.autoul li:visible:eq(0)").addClass("lihover");
                }
            }
        }
        if(event.keyCode == 38){

            //当键盘按下↓时,如果已经有li处于被选中的状态,则去掉状态,并把样式赋给下一条(可见的)li
            if($("ul.autoul li").is(".lihover")){

                //如果还存在上一条(可见的)li的话
                if($("ul.autoul li.lihover").prevAll().is("li:visible")){


                    if($("ul.autoul li.lihover").prevAll().hasClass("showli")){

                        $("ul.autoul li.lihover").removeClass("lihover")
                            .prevAll(".showli:eq(0)").addClass("lihover");
                    }else{

                        $("ul.autoul li.lihover").removeClass("lihover").removeClass("showli")
                            .prev("li:visible").addClass("lihover");
                        $("ul.autoul").children().show();
                    }
                }else{

                    $("ul.autoul li.lihover").removeClass("lihover");
                    $("ul.autoul li:visible:eq("+($("ul.autoul li:visible").length-1)+")").addClass("lihover");
                }
            }else{

                //当键盘按下↓时,如果之前没有一条li被选中的话,则第一条(可见的)li被选中
                $("ul.autoul li:visible:eq("+($("ul.autoul li:visible").length-1)+")").addClass("lihover");
            }
        }

    })

    $(".autoli").click(function(){
        $("#mail").val($(this).children(".ex").text()+$(this).children(".at").text()+$(this).children(".step").text());
        $(".autoul").hide();
    });//鼠标点击下拉菜单具体内容事件结束
    $("body").click(function(){
        $(".autoul").hide();
    });//鼠标点击document事件结束
    $("ul.autoul li").hover(function(){

        if($("ul.autoul li").hasClass("lihover")){

            $("ul.autoul li").removeClass("lihover");
        }
        $(this).addClass("lihover");
    });//鼠标滑动时
    //数据缓存
    $scope.initData();

};


angular.module('inspinia')
    .controller('mail', mail)
