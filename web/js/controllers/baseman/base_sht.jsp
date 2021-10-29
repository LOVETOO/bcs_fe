<%@ page language="java" contentType="application/x-javascript; charset=UTF-8"%>
<%
    String shtid = request.getParameter("shtid");
%>

/**
 * 表单显示控制器
 * date:2019-01-16
 */
define(
    ['module', 'controllerApi' ,'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                // 初始化通过页面传递过来的参数
                $scope.data.shtid = <%=shtid%>;
                $scope.data.url = '/web/sht/sht_<%=shtid%>.jsp';

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //等页面加载完成后再执行
                $scope.doInit = function () {
                  //angular.element('#iframepage').attr('src', '/web/sht/sht_' + $scope.data.shtid + '.jsp');
                };
            }
        ];

        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);