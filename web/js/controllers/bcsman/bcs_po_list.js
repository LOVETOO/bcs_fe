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
                  field: 'pono',
                  headerName: '采购单号',
               }, {
                  field: 'organizationid',
                  headerName: '组织',
               }, {
                  field: 'custno',
                  headerName: '客户编码',
               }, {
                  field: 'custname',
                  headerName: '客户名称',
               }, {
                  field: 'itemcode',
                  headerName: '产品编码',
               }, {
                  field: 'itemname',
                  headerName: '产品名称',
               }, {
                  field: 'factbase',
                  headerName: '基地',
                  hcDictCode: 'bcs.factbase'
               }, {
                  field: 'qty',
                  headerName: '数量',
                  type: "数量"
               }, {
                  field: 'packqty',
                  headerName: '包件数量',
                  type: "数量"
               }, {
                  field: 'deliver_date',
                  headerName: '预计送货日期' 
               }
               // , {
               //    field: 'can_print_qty',
               //    headerName: '可打印数量',
               //    type: "数量"
               // }
               // , {
               //    field: 'barcode',
               //    headerName: '防伪码',
               // }
               // , {
               //    field: 'printno',
               //    headerName: '打印条码',
               // }
               // , {
               //    field: 'printnum',
               //    headerName: '打印数量',
               //    type: "数量"
               // }
               , {
                  field: 'printor',
                  headerName: '打印人',
               }
               // , {
               //    field: 'custid',
               //    headerName: '客户id',
               // }
               , {
                  field: 'createtime',
                  headerName: '创建时间',
               }, {
                  field: 'updatetime',
                  headerName: '更新时间',
               }]
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