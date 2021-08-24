/**
 * 王照峰
 * 2020-03-20
 * 条码补打列表
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
                  field: 'reprintno',
                  headerName: '补打单号'
               }, {
                  field: 'oldbarcode',
                  headerName: '旧条码'
               }, {
                  field: 'itemcode',
                  headerName: '产品编码'
               }, {
                  field: 'itemname',
                  headerName: '产品名称'
               }, {
                  field: 'warehouse',
                  headerName: '仓库'
               }, {
                  field: 'slot',
                  headerName: '货位'
               }, {
                  field: 'factbase',
                  headerName: '基地',
                  hcDictCode:'bcs.factbase'
               }, {
                  field: 'reprintqty',
                  headerName: '补打数量',
                  type: "数量"
               }, {
                  field: 'packqty',
                  headerName: '包件数量',
                  type: "数量"
               }, {
                  field: 'creator',
                  headerName: '补打人'
               }, {
                  field: 'createtime',
                  headerName: '补打时间'
               }, {
                  field: 'updator',
                  headerName: '更新人'
               }, { 
                  field: 'updatetime',
                  headerName: '更新时间',
                  type: "时间"
               }, {
                  field: 'reprintnote',
                  headerName: '补打原因'
               }]
            };
            /**
              * 重写方法
              */

            //继承列表页基础控制器
            controllerApi.extend({
               controller: base_obj_list.controller,
               scope: $scope
            });
         }
      ];

      //使用控制器Api注册控制器
      //需传入require模块和控制器定义
      return controllerApi.controller({
         module: module,
         controller: bcs_mo
      });
   });  