/**
 * zengjinhua
 * 2019/6/5.
 * 工程阶段定义
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, numberApi) {

    var EpmStageDef=[
        '$scope',
        function ($scope){
            /**
             * 数据定义
             */
            $scope.data = {};
            $scope.data.currItem = {
                epm_stage_defs:[]
            };
            $scope.data.isVerify = true;

            //是手动的
            $scope.isManual = true;
            /**
             * 定义表格
             */
            $scope.gridOptions={
                hcEvents: {
                    /**
                     * 焦点事件
                     */
                    cellFocused: function (params) {
                        if(params.rowIndex != null){
                            $scope.isManual = $scope.data.currItem.epm_stage_defs[params.rowIndex].update_mode == 1;
                        }
                    }
                },
                columnDefs:[{
                    type:'序号'
                },{
                    field:'stage_name',
                    headerName:'项目阶段名称',
                    hcRequired:true
                },{
                    field:'stage_note',
                    headerName:'项目阶段描述',
                    editable: function () {
                        return true;
                    }
                },{
                    field:'update_mode',
                    headerName:'更新方式',
                    type:'词汇',
                    cellEditorParams: {
                        names: ['手动', '自动'],
                        values: [1, 2]
                    }
                },{
                    field:'update_cycle',
                    headerName:'更新周期(天)',
                    type:'数量',
                    editable: true,
                    onCellValueChanged: function (args) {
                        if (args.oldValue == args.newValue) {
                            return;
                        }else if($scope.data.isVerify){
                            if(!numberApi.isNum(Number(args.newValue))){
                                swalApi.error('输入非法!请输入大于零的整数');
                                args.data.update_cycle = undefined;
                            }else if(args.newValue <= 0){
                                swalApi.error('输入非法!请输入大于零的整数');
                                args.data.update_cycle = undefined;
                            }
                        }
                    }
                },{
                    field:'creator_name',
                    headerName:'创建人'
                },{
                    field:'createtime',
                    headerName:'创建时间',
                    type:'time'
                },{
                    field:'updator_name',
                    headerName:'最后修改人'
                },{
                    field:'updatetime',
                    headerName:'最后修改时间',
                    type:'time'
                }],hcAfterRequest:function(args){
                    $scope.data.currItem.epm_stage_defs = args.epm_stage_defs
                },
                hcRequestAction:'search',
                hcDataRelationName:'epm_stage_defs',
				hcClassId:'epm_stage_def',
				hcPostData: {
					search_flag: 1
				},
                hcNoPaging:true
            };

            controllerApi.extend({
                controller:base_diy_page.controller,
                scope:$scope
            });

            /**
             * 新增行
             */
            $scope.addTechnology = function(){
                $scope.gridOptions.api.stopEditing();
                $scope.data.currItem.epm_stage_defs.push({
                    update_mode : 1,

                });
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                $scope.gridOptions.hcApi.setFocusedCell($scope.data.currItem.epm_stage_defs.length-1);
            };

            /**
             * 删除行
             */
            $scope.delTechnology = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if (idx < 0) {
                    swalApi.info('请选中要删除的行');
                } else {
                    $scope.data.currItem.epm_stage_defs.splice(idx, 1);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                }
            };

            /**
             * 上移
             */
            $scope.moveUp = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if(idx==0){
                    swalApi.info('该行已置顶');
                }else{
                    var data = $scope.data.currItem.epm_stage_defs.splice(idx, 1);
                    $scope.data.currItem.epm_stage_defs.splice(idx-1,0,data[0]);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                    $scope.gridOptions.hcApi.setFocusedCell(idx-1);
                }
            };

            /**
             * 下移
             */
            $scope.shiftDown = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if(idx==($scope.data.currItem.epm_stage_defs.length-1)){
                    swalApi.info('该行已置底');
                }else{
                    var data=$scope.data.currItem.epm_stage_defs.splice(idx, 1);
                    $scope.data.currItem.epm_stage_defs.splice(idx+1,0,data[0]);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                    $scope.gridOptions.hcApi.setFocusedCell(idx+1);
                }
            };

            /**
             * 置顶
             */
            $scope.stick = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if(idx==0){
                    swalApi.info('该行已置顶');
                }else{
                    var data=$scope.data.currItem.epm_stage_defs.splice(idx, 1);
                    $scope.data.currItem.epm_stage_defs.splice(0,0,data[0]);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                    $scope.gridOptions.hcApi.setFocusedCell(0);
                }
            };

            /** 
             * 置底
             */
            $scope.rear = function(){
                var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                if(idx==($scope.data.currItem.epm_stage_defs.length-1)){
                    swalApi.info('该行已置底');
                }else{
                    var data=$scope.data.currItem.epm_stage_defs.splice(idx, 1);
                    $scope.data.currItem.epm_stage_defs.splice($scope.data.currItem.epm_stage_defs.length,0,data[0]);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_stage_defs);
                    $scope.gridOptions.hcApi.setFocusedCell($scope.data.currItem.epm_stage_defs.length-1);
                }
            };

            //添加按钮
            $scope.toolButtons = {
                save: {
                    title: '保存',
                    icon: 'iconfont hc-save',
                    click: function () {
                        $scope.save && $scope.save();
                    }
                }
            };
            /**
             * 保存
             */
            $scope.save = function () {
                $scope.data.isVerify = false;
                $scope.gridOptions.api.stopEditing();
                $scope.data.isVerify = true;
                //定义一个参数
                var isPass = 1;
                //定义一个数据盒子
                var arr = [];
                var str = "";
                $scope.data.currItem.epm_stage_defs.forEach(function(val,index){
                    str = "";
                    if(val.stage_name==undefined||val.stage_name==""||val.stage_name==null){
                        str += "项目阶段名称为空";
                    }
                    if(!numberApi.isNum(Number(val.update_cycle)) && (val.update_cycle !=undefined && val.update_cycle !="")){
                        str += "更新周期请输入大于零的整数，";
                    }else if(val.update_cycle <= 0 && (val.update_cycle !=undefined && val.update_cycle !="")){
                        str += "更新周期请输入大于零的整数，";
                    }
                    if(!str == ""){
                        isPass = 0;
                        arr.push('第'+numberApi.sum(index,1)+"行输入非法！" + str);
                    }
                });
                //若盒子非空，验证不通过，弹框
                if (arr.length){
                    return swalApi.error(arr);
                }
                if(isPass == 1){//校验通过
                    //调用后台保存方法
                   return requestApi.post({
                        classId: 'epm_stage_def',
                        action: 'save',
                        data: {
                            epm_stage_defs: $scope.gridOptions.hcApi.getRowData()
                        }
                    }).then(function (data) {
                        return swalApi.success('保存成功!');
                    }).then($scope.serarch);
                }
            };

            /**
             * 保存按钮函数
             */
            $scope.serarch = function (){
                $scope.gridOptions.hcApi.search()
            };


        }
        ];

    return controllerApi.controller({
        module:module,
        controller:EpmStageDef
    });

});