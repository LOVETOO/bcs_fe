/**
 * 巫奕海
 * 2019-12-25
 * 工单查询列表
 */
define(
   ['module', 'controllerApi', 'base_obj_list'],
   function (module, controllerApi, base_obj_list) {
      /**
       * 控制器
       */
      var bcs_mo = [
         '$scope',
         function ($scope) {
            $scope.gridOptions = {
               columnDefs: [{
                  type: '序号'
               }, {
                  field: 'organizationid',
                  headerName: '组织',
                  hcDictCode: 'bcs.organizationid'
               }, {
                  field: 'mono',
                  headerName: '工单号'
               }, {
                  field: 'itemcode',
                  headerName: '产品编码'
               }, {
                  field: 'itemname',
                  headerName: '产品名称'
               }, {
                  field: 'factbase',
                  headerName: '基地',
                  hcDictCode: 'bcs.factbase'
               }, {
                  field: 'motype',
                  headerName: '工单类型'
               }, {
                  field: 'mostatus',
                  headerName: '工单状态'
               },
               //  {
               //    field: 'can_print_qty',
               //    headerName: '可打印数量',
               //    type: "数量"
               // }, 
               {
                  field: 'qty',
                  headerName: '工单数量',
                  type: "数量"
               }, {
                  field: 'packqty',
                  headerName: '包件数量',
                  type: "数量"
               }
               // , {
               //    field: 'conpleted_qty',
               //    headerName: '完工数量',
               //    type: "数量"
               // }, {
               //    field: 'fdiscard_qty',
               //    headerName: '报废数量',
               //    type: "数量"
               // }, {
               //    field: 'surplus_qty',
               //    headerName: '剩余数量',
               //    type: "数量"
               // }
                  // , {
                  //    field: 'tolerant_qty',
                  //    headerName: '允差数量',
                  //    type: "数量"
                  // }
                  // , {
                  //    field: 'scan_qty',
                  //    headerName: '扫描数量',
                  //    type: "数量"
                  // }
                  , {
                  field: 'dif',
                  headerName: '差额',
                  type: "金额"
               }, {
                  field: 'creator',
                  headerName: '创建人'
               }, {
                  field: 'createtime',
                  headerName: '创建时间',
                  type: "时间"
               }, {
                  field: 'updator',
                  headerName: '更新用户'
               }, {
                  field: 'updatetime',
                  headerName: '更新时间',
                  type: "时间"
               }, {
                  field: 'description',
                  headerName: '描述'
               }
               // , {
               //    field: 'last_sync_time',
               //    headerName: '接口更新时间'
               // }
            ]
            };

            $(function () {
               var intervalId = setInterval(function () {
                  if ($scope.searchPanelVisible === false) {//符合条件
                     clearInterval(intervalId);//销毁
                     $scope.searchPanelVisible = true;
                  }
               }, 300);
            });
            /**
              * 重写方法
              */

            //继承列表页基础控制器
            controllerApi.extend({
               controller: base_obj_list.controller,
               scope: $scope
            });

            $scope.toolButtons.delete.hide = true;
            $scope.toolButtons.add.hide = true;
         }
      ];

      //使用控制器Api注册控制器
      //需传入require模块和控制器定义
      return controllerApi.controller({
         module: module,
         controller: bcs_mo
      });
   });  