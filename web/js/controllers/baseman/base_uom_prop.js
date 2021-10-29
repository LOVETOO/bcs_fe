/**
 * uom属性页
 */

define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams','Magic',
            //控制器函数
            function ($scope, $stateParams,Magic) {
                /**---------------------数据定义------------------------- */   
                $scope.data = {};
                $scope.data.currItem = {};
                 /**---------------------数据定义结束---------------------- */
                /**----------------------方法开始 ------------------------*/
                /**----------------------方法结束-------------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';
                //添加'其他'标签页
                $scope.tabs.other ={
                    title:'其他'
                };
            }       
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });

// /**
//  * 模块定义
//  * 2018-2-5 by mjl
//  */
// function base_uom($scope, BasemanService) {
//     $scope.data = {};
//     $scope.data.currItem = {};

//     //添加按钮
//     var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
//         return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
//             //"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
//     };

//     //网格设置
//     $scope.headerOptions = {
//         enableCellNavigation: true,
//         enableColumnReorder: false,
//         editable: false,
//         enableAddRow: false,
//         asyncEditorLoading: false,
//         autoEdit: true,
//         autoHeight: false
//     };
//     //定义网格字段
//     $scope.headerColumns = [
//         {   id: "seq",
//             name: "序号",
//             field: "seq",
//             behavior: "select",
//             cssClass: "cell-selection",
//             width: 50,
//             cannotTriggerInsert: true,
//             resizable: false,
//             selectable: false,
//             focusable: false
//         },
//         {
//             name: "操作",
//             editable: false,
//             width: 70,
//             cellEditor: "文本框",
//             enableRowGroup: true,
//             enablePivot: true,
//             enableValue: true,
//             floatCell: true,
//             formatter: editHeaderButtons
//         },
//         {
//             id: "uom_code",
//             name: "单位编码",
//             behavior: "select",
//             field: "uom_code",
//             editable: false,
//             filter: 'set',
//             width: 100,
//             cellEditor: "文本框",
//             enableRowGroup: true,
//             enablePivot: true,
//             enableValue: true,
//             floatCell: true
//         },
//         {
//             id: "uom_name",
//             name: "单位名称",
//             behavior: "select",
//             field: "uom_name",
//             editable: false,
//             filter: 'set',
//             width: 100,
//             cellEditor: "文本框",
//             enableRowGroup: true,
//             enablePivot: true,
//             enableValue: true,
//             floatCell: true
//         },
//         {
//             id: "note",
//             name: "备注",
//             behavior: "select",
//             field: "note",
//             editable: false,
//             filter: 'set',
//             width: 100,
//             cellEditor: "文本框",
//             enableRowGroup: true,
//             enablePivot: true,
//             enableValue: true,
//             floatCell: true
//         }
//     ];

//     //网格初始化
//     $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

//     //主表清单绑定点击事件
//     $scope.headerGridView.onClick.subscribe(dgOnClick);
//     //双击事件
//     //$scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});


//     /**
//      * 事件判断
//      */
//     function dgOnClick(e, args) {
//         //点击删除按钮处理事件
//         if ($(e.target).hasClass("delbtn")) {
//             $scope.del(args);
//             e.stopImmediatePropagation();
//         }else {
//             $scope.viewDetail(args);
//             e.stopImmediatePropagation();
//         }
//     };

//     /**
//      * 查询详情
//      * @param args
//      */
//     $scope.viewDetail = function (args) {
//         var param = {
//             "uom_id": args.grid.getDataItem(args.row).uom_id
//         };
//         BasemanService.RequestPost("Uom", "select", param).then(function (data) {
//             $scope.data.currItem = data;
//         });
//     };

//     /**
//      * 加载工作区
//      */
//     $scope.init = function () {
//         BasemanService.RequestPost("Uom", "search",{}).then(function (data) {
//             setGridData($scope.headerGridView, data.uoms);
//         });
//     }


//     /**
//      * 加载网格数据
//      */
//     function setGridData(gridView, datas) {
//         gridView.setData([]);
//         //加序号
//         if (datas.length > 0) {
//             for (var i = 0; i < datas.length; i++) {
//                 datas[i].seq = i + 1;
//             }
//         }
//         //设置数据
//         gridView.setData(datas);
//         //重绘网格
//         gridView.render();
//     }


//     /**
//      * 刷新
//      */
//     $scope.refresh = function () {
//         $scope.init();
//         $scope.data.currItem = {};
//     }


//     /**
//      * 保存
//      */
//     $scope.save = function () {
//         if ($scope.data.currItem.uom_code == "" || $scope.data.currItem.uom_code == undefined) {
//             BasemanService.swal("提示", "单位编码不能为空"  );
//             return;
//         }
//         if ($scope.data.currItem.uom_name == "" || $scope.data.currItem.uom_name == undefined) {
//             BasemanService.swal("提示", "单位名称不能为空"  );
//             return;
//         }
//         if ($scope.data.currItem.uom_id > 0) {
//             BasemanService.RequestPost("Uom", "update", JSON.stringify($scope.data.currItem))
//                 .then(function (data) {
//                     BasemanService.notice("保存成功！", "alert-success");
//                 });
//         } else {
//             BasemanService.RequestPost("Uom", "insert", JSON.stringify($scope.data.currItem))
//                 .then(function (data) {
//                     BasemanService.notice("保存成功！", "alert-success");
//                 });
//         }
//         $scope.init();
//     };

//     /**
//      * 删除
//      */
//     $scope.del = function (args) {
//         var dg = $scope.headerGridView;
//         var rowidx = args.row;
//         var postData = {};
//         var row = args.grid.getDataItem(args.row);
//         postData.uom_id = row.uom_id;
//         postData.uom_name = row.uom_name;
//         BasemanService.swalDelete("删除", "确定要删除计量单位 " + postData.uom_name + " 吗？", function (bool) {
//             if (bool) {
//                 //删除数据成功后再删除网格数据
//                 BasemanService.RequestPost("Uom", "delete", JSON.stringify(postData))
//                     .then(function (data) {
//                         dg.getData().splice(rowidx, 1);
//                         dg.invalidateAllRows();
//                         dg.render();
//                         $scope.refresh();
//                     });
//             } else {
//                 return;
//             }
//         });
//     };

//     /**
//      * 添加
//      */
//     $scope.add = function () {
//         $scope.data.currItem = {};
//     };


//     //网格高度自适应 , 控制器后面调用：
//     BasemanService.initGird();
// }
// //注册控制器
// angular.module('inspinia') .controller('base_uom', base_uom)

