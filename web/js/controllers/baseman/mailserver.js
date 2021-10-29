/**
 * 邮件服务器配置
 * 2019-01-21 add by qch
 */
define(['module', 'controllerApi', 'base_edit_list'],
    function (module, controllerApi, base_edit_list) {

        DemoEditList.$inject = ['$scope'];
        function DemoEditList($scope) {

            /*--------------------数据定义------------------------*/
            $scope.gridOptions = {
                columnDefs: [
                    {
                        type: '序号'
                    },
                    {
                        field: 'servertype',
                        headerName: '类型',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['外部邮件服务器', '内置邮件服务器'],
                            values: ['1', '2']
                        }
                    },
                    {
                        field: 'domain',
                        headerName: '域名'
                    },
                    {
                        field: 'pop3server',
                        headerName: 'POP3服务器'
                    },
                    {
                        field: 'pop3port',
                        headerName: 'POP3端口'
                    }, {
                        field: 'pop3ssl',
                        headerName: 'POP3加密',
                        type: '是否'
                    },
                    {
                        field: 'smtpserver',
                        headerName: 'SMTP服务器'
                    },
                    {
                        field: 'smtpport',
                        headerName: 'SMTP端口'
                    },
                    {
                        field: 'smtpssl',
                        headerName: 'SMTP加密',
                        type: '是否'
                    },
                    {
                        field: 'smtpauthtype',
                        headerName: 'SMTP服务器需要身份验证',
                        type: '是否'
                    },
                    {
                        field: 'note',
                        headerName: '备注'
                    }
                ],
                hcDataRelationName: 'mailservers'//自定义返回数据所在数组
            };

            controllerApi.extend({
                controller: base_edit_list.controller,
                scope: $scope
            });

            /**
             * 成本核算方式
             */
            $scope.data.servertype_options = [
                { name: '外部邮件服务器', value: '1' },
                { name: '内置邮件服务器', value: '2' },
            ];


            /*-------------------顶部右边按钮------------------------*/
            /* $scope.toolButtons = {
                add: {
                    title: '新增',
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add && $scope.add();
                    }
                },
                delete: {
                    title: '删除',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        $scope.delete && $scope.delete();
                    }
                },
                search: {
                    title: '筛选',
                    icon: 'fa fa-filter',
                    click: function () {
                        $scope.search && $scope.search();
                    }
                }
            }; */


        }

        return controllerApi.controller({
            module: module,
            controller: DemoEditList
        });
    }
);