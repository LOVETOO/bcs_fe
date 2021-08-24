/**
 *  产品通用属性
 *  2020-03-13 15:30:00
 */
define(
   ['module', 'controllerApi', 'base_obj_list'],
   function (module, controllerApi, base_obj_list) {
      /**
       * 控制器
       */
      var bcs_item_comprop = [
         '$scope',
         function ($scope) {
            $scope.gridOptions = {
               columnDefs: [{
                  type: '序号'
               }, {
                  field: 'propfield',
                  headerName: '属性字段'
               }, {
                  field: 'propname',
                  headerName: '属性名称'
               }, {
                  field: 'creator',
                  headerName: '创建人'
               }, {
                  field: 'createtime',
                  headerName: '创建时间'
               }, {
                  field: 'updator',
                  headerName: '更新人'
               }, {
                  field: 'updatetime',
                  headerName: '更新时间'
               }]
            };


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
         controller: bcs_item_comprop
      });
   });