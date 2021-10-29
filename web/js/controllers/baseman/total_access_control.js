/**
 * 综合访问权限控制
 * 2019-03-13 total_access_control.js
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi', 'dateApi', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi, loopApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                /**===================初始化field===============**/
                var gridOptions_user_const = 'gridOptions_user';
                var gridOptions_role_const = 'gridOptions_role';

                /**网格对象名 **/
                var gridOptions_warehouse_const = 'gridOptions_warehouse';
                var gridOptions_warehouse_no_const = 'gridOptions_warehouse_no';
                var gridOptions_dept_const = 'gridOptions_dept';
                var gridOptions_dept_no_const = 'gridOptions_dept_no';
                var gridOptions_account_const = 'gridOptions_account';
                var gridOptions_account_no_const = 'gridOptions_account_no';
                var gridOptions_salearea_const = 'gridOptions_salearea';
                var gridOptions_salearea_no_const = 'gridOptions_salearea_no';
                var gridOptions_customer_const = 'gridOptions_customer';
                var gridOptions_customer_no_const = 'gridOptions_customer_no';
                var gridOptions_crment_const = 'gridOptions_crment';
                var gridOptions_crment_no_const = 'gridOptions_crment_no';
                var gridOptions_fixOrg='gridOptions_fixOrg';
                var gridOptions_fixOrg_no='gridOptions_fixOrg_no';

                /**网格数据模型名 **/
                var warehouseAccessModelNameConst = 'access_list';
                var warehouseNoAccessModelNameConst = 'no_access_list';

                $scope.data = {};
                $scope.data.currItem = {};
                $scope.accessFlag = 1;//模式 ： 按用户授权 or 按角色授权
                $scope.accessMode = '按用户授权'; //模式 ： 按用户授权 or 按角色授权

                //$scope.search_flag = 1;//标示是正在进行什么权限授权,请看$scope.tabs_access方法 1：仓库
                $scope.search_flag = 5;//用户

                $scope.currUserId = '';//当前用户id
                $scope.currUserName = '';//当前用户name
                $scope.currRoleId = '';//当前角色id
                $scope.currRoleName = '';//当前角色name
                $scope.currGridOptionName = 'gridOptions_user'; //当前的 按用户授权 或者角色的网格名；

                //$scope.currAccessGridOptionName = gridOptions_warehouse_const; //当前的 操作的 可授权列表网格名；
                //$scope.currNoAccessGridOptionName = gridOptions_warehouse_no_const; //当前的 操作的 不可授权列表网格名；
                $scope.currAccessGridOptionName = gridOptions_customer_const; //当前的 操作的 可授权列表网格名；
                $scope.currNoAccessGridOptionName = gridOptions_customer_no_const; //当前的 操作的 不可授权列表网格名；

                //$scope.currAllListName = 'allWareHouses';// 当前操作的 所有 授权数据名；
                $scope.currAllListName = 'allCustomers';

                $scope.currUser = null; //当前用户对象
                $scope.currRole = null;//当前角色对象；
                $scope.currObj = null;//当前操作对象；
                $scope.editing = false; // 是否已经编辑数据
                /**================ 数据缓存区 =================**/
                $scope.cache = {};
                $scope.cache.users = [];
                $scope.cache.roles = [];
                $scope.cache.allWareHouses = [];//所有的仓库列表;
                $scope.cache.allCustomers = [];//所有的客户列表;

                //用户网格
                $scope.gridOptions_user = {
                    columnDefs: [
                        {
                            type: "序号"
                        },
                        {

                            headerName: "用户",
                            headerClass: 'header-font-size',
                            children: [{
                                field: 'userid',
                                headerName: '编码',
                                width: 106
                            },
                                {
                                    field: 'username',
                                    headerName: '名称',
                                    minWidth: 135,
                                    width: 135
                                }]
                        }
                    ],
                    hcClassId: "total_access_control",
                    hcRequestAction: "getaccessctrlusers",
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.search_flag;
                    },
                    hcAfterRequest: function (response) {
                        $scope.cache.users = response.users;
                        $q.when()
                            .then(function () {
                                return getAllCustomer();
                                //return getAllWareHouses();
                            })
                            .then(function () {
                                setSelectRow();
                            })
                    },
                    hcDataRelationName: "users",
                    hcNoPaging: true,
                    onCellClicked: function (node) {
                        node.data.rowIndex = node.rowIndex;
                        $scope.currUser = node.data;
                        $scope.currObj = node.data;
                        $scope[$scope.currAccessGridOptionName].api.setRowData(node.data.access_list);

                        node.data.no_access_list = getNoAccessList(node.data.access_list);//取未授权的列表
                        $scope[$scope.currNoAccessGridOptionName].api.setRowData(node.data.no_access_list);
                    },
                    hcReady: $q.deferPromise()
                };

                //角色网格
                $scope.gridOptions_role = {
                    columnDefs: [
                        {
                            type: "序号"
                        },
                        {
                            headerName: "角色",
                            headerClass: 'header-font-size',
                            children: [{
                                field: 'roleid',
                                headerName: '代号',
                                width: 106,
                                cellStyle: {
                                    'text-align': 'center'
                                }
                            },
                                {
                                    field: 'rolename',
                                    headerName: '名称',
                                    width: 135,
                                    minWidth: 135,
                                    cellStyle: {
                                        'text-align': 'center'
                                    }
                                }]
                        }
                    ],
                    hcClassId: "total_access_control",
                    hcRequestAction: "getaccessctrlroles",
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.search_flag;
                    },
                    hcAfterRequest: function (response) {
                        $scope.cache.roles = response.roles;
                        setSelectRow();
                    },
                    onCellClicked: function (node) {
                        node.data.rowIndex = node.rowIndex;
                        $scope.currRole = node.data;
                        $scope.currObj = node.data;
                        $scope[$scope.currAccessGridOptionName].api.setRowData(node.data.access_list);

                        node.data.no_access_list = getNoAccessList(node.data.access_list);//取未授权的列表
                        $scope[$scope.currNoAccessGridOptionName].api.setRowData(node.data.no_access_list);
                    },
                    hcDataRelationName: "roles",
                    hcNoPaging: true
                };

                /**
                 * 仓库访问权限列表
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_warehouse = {
                    columnDefs: [
                        {
                            field: 'seq',
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [{
                                field: 'warehouse_code',

                                headerName: '仓库编码',
                                width: 106
                            },
                                {
                                    field: 'warehouse_name',

                                    headerName: '仓库名称',
                                    minWidth: 220,
                                    width: 220,
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 仓库不可访问权限列表
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_warehouse_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'warehouse_code',
                                    headerName: '仓库编码'
                                },
                                {
                                    field: 'warehouse_name',

                                    headerName: '仓库名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 部门访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_dept = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'code',
                                    headerName:
                                        '部门编码'
                                },
                                {
                                    field: 'orgname',
                                    headerName:

                                        '部门名称',
                                    minWidth: 215,
                                    width: 215

                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 部门不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_dept_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'code',
                                    headerName:
                                        '部门编码'
                                },
                                {
                                    field: 'orgname',

                                    headerName: '部门名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 资金账户访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_account = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName:
                                        '资金账户编码'
                                },
                                {
                                    field: 'fund_account_name',
                                    headerName:
                                        '资金账户名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 资金账户不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_account_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {
                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName:
                                        '资金账户编码'
                                },
                                {
                                    field: 'fund_account_name',
                                    headerName:

                                        '资金账户名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 销售区域 访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_salearea = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'sale_area_code',
                                    headerName:
                                        '销售区域编码'
                                },
                                {
                                    field: 'sale_area_name',
                                    headerName:

                                        '销售区域名称',
                                    minWidth: 215,
                                    width: 215

                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 销售区域 不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_salearea_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'sale_area_code',
                                    headerName:
                                        '销售区域编码'
                                },
                                {
                                    field: 'sale_area_name',
                                    headerName:

                                        '销售区域名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };


                /**
                 * 客户 访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_customer = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'customer_code',
                                    headerName:
                                        '客户编码'
                                },
                                {
                                    field: 'customer_name',
                                    headerName:

                                        '客户名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 客户 不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_customer_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'customer_code',
                                    headerName:
                                        '客户编码'
                                },
                                {
                                    field: 'customer_name',
                                    headerName:

                                        '客户名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 品类 访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_crment = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'crment_id',
                                    headerName:
                                        '品类编码'
                                },
                                {
                                    field: 'crment_name',
                                    headerName:

                                        '品类名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };

                /**
                 * 品类 不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_crment_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'crment_id',
                                    headerName:
                                        '品类编码'
                                },
                                {
                                    field: 'crment_name',
                                    headerName:

                                        '品类名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };


                /**
                 *  网点访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_fixOrg = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "已授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'fix_org_code',
                                    headerName:
                                        '网点编码'
                                },
                                {
                                    field: 'fix_org_name',
                                    headerName:

                                        '网点名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };


                /**
                 * 网点 不可访问权限
                 * @type {{columnDefs: *[]}}
                 */
                $scope.gridOptions_fixOrg_no = {
                    columnDefs: [
                        {
                            type: '复选框'
                        },
                        {

                            headerName: "未授权项目",
                            headerClass: 'header-font-size',
                            children: [
                                {
                                    field: 'fix_org_code',
                                    headerName:
                                        '网点编码'
                                },
                                {
                                    field: 'fix_org_name',
                                    headerName:
                                        '网点名称',
                                    minWidth: 215,
                                    width: 215
                                }]
                        }
                    ],
                    hcNoPaging: true
                };
                /** ====================== 网格选项 结束 ===============================**/
                /**
                 * 标签页
                 */
                $scope.tabs = {
                    user: {
                        title: '按用户授权',
                        active: true
                    },
                    role: {
                        title: '按角色授权'
                    }
                };

                /**
                 * 标签页
                 */
                $scope.tabs_access = {
                    warehouse: {
                        title: '仓库访问权限',
                        search_flag: 1,
                        hide : true
                    },
                    dept: {
                        title: '部门访问权限',
                        search_flag: 2,
                        hide : true
                    },
                    fd_fund_account: {
                        title: '资金账户访问权限',
                        search_flag: 3,
                        hide : true
                    },
                    salearea: {
                        title: '销售区域访问权限',
                        search_flag: 4,
                        hide : true
                    },
                    customer: {
                        title: '客户访问权限',
                        active: true,
                        search_flag: 5
                    },
                    crm_ent: {
                        title: '品类访问权限',
                        search_flag: 6,
                        hide : true
                    },
                    fixOrg: {
                        title: '网点访问权限',
                        search_flag: 7,
                        hide : true
                    }
                };

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                /*-------------------页签改变事件 开始------------------------*/
                /**
                 * 切换页签前检查并提示
                 */
                $scope.checkBeforeTabChange = function () {
                    if ($scope.editing) {
                        return $q(function (resolve, reject) {
                            swal({
                                title: "您正在切换权限操作，当前操作数据尚未保存，是否保存？",
                                type: "warning",
                                closeOnConfirm: false,
                                showCancelButton: true,
                                allowOutsideClick: false,
                                html: true,
                                confirmButtonText: "保存",
                                cancelButtonText: "不保存"
                            }, function (bool) {
                                sweetAlert.close();
                                if (bool) {
                                    return resolve($scope.save);
                                }
                                return resolve(function () {
                                    $scope.editing = false;
                                });
                            });
                        })
                    }
                };

                /**
                 * 授权对象(按用户授权 按角色授权 )页签改变事件
                 * @param params
                 */
                $scope.onObjTabChange = function (params) {
                    $q.when()
                        .then(function () {
                            $scope.accessFlag = params.tab.title == '按用户授权' ? 1 : 2;
                        })
                        .then(function () {
                            setSelectRow();
                        })
                };

                /**
                 * 授权方式页签改变事件
                 * @param params
                 */
                $scope.onAccessTabChange = function (params) {
                    $q.when()
                        .then($scope.checkBeforeTabChange)
                        // .then(function (fun) {
                        //     if (fun) {
                        //         return fun;
                        //     }
                        // })
                        .then(function (fun) {
                            if (fun) {
                                return fun();
                            }
                        })
                        .then(function () {
                            $scope.search_flag = params.tab.search_flag;
                        })
                        .then(function () {
                            $scope.refresh();
                        })
                }
                /*-------------------页签改变事件 结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                /**
                 * 查询角色
                 */
                $scope.searchRole = function () {
                    $modal
                        .openCommonSearch({
                            classId: 'scprole',
                            checkbox: true,
                            postData: {
                                entid: userbean.entid
                            }
                        })
                        .result
                        .then(function (roles) {
                            roles.forEach(function (role) {
                                var flag = true;
                                $scope.cache.roles.forEach(function (rol) {
                                    if (rol.roleid == role.roleid)
                                        flag = false;
                                })
                                if (flag) {
                                    role.access_list = [];
                                    role.no_access_list = angular.copy($scope.cache[$scope.currAllListName]);

                                    $scope.cache.roles.push(role);
                                    $scope.editing = true;
                                }
                            });
                            $scope.gridOptions_role.api.setRowData($scope.cache.roles);
                        })
                        .then(function () {
                            setSelectRow($scope.cache.roles.length - 1);
                        })
                };

                /**
                 * 查询用户
                 */
                $scope.searchUser = function () {
                    $modal
                        .openCommonSearch({
                            classId: 'scpuser',
                            checkbox: true,
                            postData: {
                                entid: userbean.entid
                            }
                        })
                        .result
                        .then(function (users) {
                            users.forEach(function (user) {
                                var flag = true;
                                $scope.cache.users.forEach(function (rol) {
                                    if (rol.userid == user.userid)
                                        flag = false;
                                })
                                if (flag) {
                                    user.access_list = [];
                                    user.no_access_list = angular.copy($scope.cache[$scope.currAllListName]);

                                    $scope.cache.users.push(user);
                                    $scope.editing = true;
                                }
                            });
                            $scope.gridOptions_user.api.setRowData($scope.cache.users);
                        })
                        .then(function () {
                            setSelectRow($scope.cache.users.length - 1);
                        })
                };

                /**
                 * 取所有的仓库
                 */
                function getAllWareHouses() {
                    var postData = {
                        classId: "warehouse",
                        action: 'search',
                        data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allWareHouses = response.warehouses;
                        })
                }

                /**
                 * 取所有的部门
                 */
                function getAllDept() {
                    var postData = {
                        classId: "dept",
                        action: 'search',
                        data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {

                            $scope.cache.allDepts = response.depts.map(function (dept) {
                                return {
                                    code: dept.dept_code,
                                    orgid: dept.dept_id,
                                    orgname: dept.dept_name
                                }
                            });
                        })
                }

                /**
                 * 资金账户
                 */
                function getAllfd_fund_account() {
                    var postData = {
                        classId: "fd_fund_account",
                        action: 'search',
                        data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allFd_fund_accounts = response.fd_fund_accounts;
                        })
                }

                /**
                 * 销售区域
                 */
                function getAllSa_salearea() {
                    var postData = {
                        classId: "sale_salearea",
                        action: 'search',
                        data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allSale_saleareas = response.sale_saleareas;
                        })
                }

                /**
                 * 客户
                 */
                function getAllCustomer() {
                    var postData = {
                        classId: "customer_org",
                        action: 'search',
                        data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allCustomers = response.customer_orgs;
                        })
                }

                /**
                 * 品类
                 */
                function getAllCrm_Ent() {
                    var postData = {
                        classId: "base_search",
                        action: 'searchdict',
                        data: {
                            dictcode: 'crm_entid'
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allCrm_ents = response.dicts.map(function (dict) {
                                return {
                                    crment_id: dict.dictvalue,
                                    crment_name: dict.dictname
                                }
                            });
                        })
                }

                /**
                 * 网点
                 */
                function getAllFixOrg() {
                    var postData = {
                        classId: "css_fix_org",
						action: 'search',
						data: {
							maxsearchrltcmt: 2147483647
						}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.cache.allFixOrgs  = response.css_fix_orgs;
                        })
                }

                /*-------------------通用查询结束------------------------*/


                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };

                $scope.footerLeftButtons = {};
                /**
                 * 增加授权对象
                 */
                $scope.footerLeftButtons.add_line = {
                    title: function () {
                        return '增加';
                    },
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                /**
                 * 删除授权对象
                 * @type {{title: title, click: click}}
                 */
                $scope.footerLeftButtons.del_line = {
                    title: function () {
                        return '删除';
                    },
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };


                $scope.footerRightButtons = {
                    save: {
                        title: '保存',
                        click: function () {
                            $scope.save && $scope.save();
                        },
                        hide: function () {
                            return !$scope.editing;
                        }
                    }
                };

                /**
                 * 增加
                 */
                $scope.add_line = function () {
                    switch ($scope.accessMode) {
                        case '按用户授权':
                            return $scope.searchUser();
                        case '按角色授权':
                            return $scope.searchRole();
                    }
                };

                /**
                 * 删除
                 */
                $scope.del_line = function () {
                    var idx = $scope[$scope.currGridOptionName].hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的' + $scope.accessMode);
                    } else {
                        var data = $scope[$scope.currGridOptionName].hcApi.getRowData();
                        data.splice(idx, 1);
                        $scope.cache[$scope.currAccessObjName] = data;
                        $scope[$scope.currGridOptionName].hcApi.setRowData($scope.cache[$scope.currAccessObjName]);
                        $scope.editing = true;
                    }
                };

                /**
                 * 保存数据
                 */
                $scope.save = function () {
                    $q.when()
                        .then(function () {
                            var postData = {
                                classId: "total_access_control",
                                action: 'update',
                                data: {
                                    "users": $scope.cache.users,
                                    "roles": $scope.cache.roles,
                                    "search_flag": $scope.search_flag
                                }
                            };
                            return requestApi.post(postData)
                                .then(function (response) {
                                    $scope.editing = false;
                                    swalApi.success("保存成功");
                                })
                                .then($scope.refresh)
                        })
                };

                /**
                 *
                 */
                $scope.checkValid = function (validBox) {

                }
                /**
                 * 初始化数据
                 */
                $scope.init = function () {
                    $q.when()
                        .then(function () {
                            // 取所有数据
                            // getAllWareHouses();
                            //getAllDept();
                            //getAllfd_fund_account();
                            //getAllSa_salearea();
                            getAllCustomer();
                            //getAllCrm_Ent();
                            //getAllFixOrg();
                        })
                };
                

                /**
                 * 刷新
                 */
                $scope.refresh = function () {
                    $q.when()
                        .then(function () {
                            var postData = { //获取所有
                                classId: "total_access_control",
                                action: 'refresh',
                                data: {
                                    "search_flag": $scope.search_flag
                                }
                            };
                            return requestApi.post(postData)
                                .then(function (response) {
                                    $scope.cache.users = response.users;
                                    $scope.cache.roles = response.roles;

                                    $scope[gridOptions_user_const].api.setRowData($scope.cache.users);
                                    $scope[gridOptions_role_const].api.setRowData($scope.cache.roles);
                                })
                                .then(setSelectRow)//设置网格
                                .then(function () {
                                    return $q.resolve();
                                })
                        })
                };

                /**
                 * 设置网格选中的行
                 */
                function setSelectRow(rowindex) {
                    if (!rowindex)
                        rowindex = 0;
                    if ($scope.accessFlag == 1) {
                        if ($scope.currUser != null) {
                            rowindex = $scope.currUser.rowIndex;
                        }
                        $scope.currUser = {};
                        $scope.currUser.access_list = [];
                        if ($scope.cache.users.length > 0) {
                            $scope.currUser = $scope.cache.users[rowindex];
                            $scope.currUser.no_access_list = [];
                            $scope.currUser.no_access_list = getNoAccessList($scope.currUser.access_list);//取未授权的列表
                        }
                        $scope.currUser.rowIndex = rowindex;
                        $scope[$scope.currNoAccessGridOptionName].api.setRowData($scope.currUser.no_access_list);
                        $scope[gridOptions_user_const].hcApi.setFocusedCell(rowindex, "userid");
                        $scope[$scope.currAccessGridOptionName].api.setRowData($scope.currUser.access_list);
                    }

                    if ($scope.accessFlag == 2) {
                        if ($scope.currRole != null) {
                            rowindex = $scope.currRole.rowIndex;
                        }
                        $scope.currRole = {};
                        $scope.currRole.access_list = [];
                        if ($scope.cache.roles.length > 0) {
                            $scope.currRole = $scope.cache.roles[rowindex];
                            $scope.currRole.no_access_list = [];
                            $scope.currRole.no_access_list = getNoAccessList($scope.currRole.access_list);//取未授权的列表
                        }
                        $scope.currRole.rowIndex = rowindex;
                        $scope[$scope.currNoAccessGridOptionName].api.setRowData($scope.currRole.no_access_list);
                        $scope[gridOptions_role_const].hcApi.setFocusedCell(rowindex, "roleid");
                        $scope[$scope.currAccessGridOptionName].api.setRowData($scope.currRole.access_list);
                    }

                }

                /**
                 * 重新查用户
                 */
                $scope.getAccessUser = function () {
                    var postData = {
                        classId: "total_access_control",
                        action: 'getaccessctrlusers',
                        data: {search_flag: $scope.search_flag}
                    };
                    return requestApi.post(postData)
                        .then(function (response) {
                            $scope.gridOptions_user.api.setRowData(response.users);
                        })
                };

                /**===========================列表数据 处理 =================**/

                /**
                 * 将已授权的数据与全部数据对比得出未授权的数据
                 */
                function getNoAccessList(access_list) {
                    var no_access_list = [];
                    $scope.cache[$scope.currAllListName].forEach(function (row, index) {
                        var flag = true;
                        for (var i = 0; i < access_list.length; i++) {
                            if (access_list[i][$scope.currIdFeild] == row[$scope.currIdFeild]) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            no_access_list.push(row);
                        }
                    })
                    return no_access_list;
                }

                /**
                 * 监视accessFlag 变化
                 */
                $scope.$watch('accessFlag', function (newVal) {
                    switch (newVal) {
                        case 1:
                            $scope.accessMode = '按用户授权';
                            $scope.currGridOptionName = gridOptions_user_const;
                            $scope.currAccessObjName = 'users';
                            break;
                        case 2:
                            $scope.accessMode = '按角色授权';
                            $scope.currGridOptionName = gridOptions_role_const;
                            $scope.currAccessObjName = 'roles';
                            break;
                    }
                });

                /**
                 * 监视search_flag变化
                 */
                $scope.$watch('search_flag', function (newVal) {
                    switch (newVal) {
                        case 1://仓库
                            $scope.currAccessGridOptionName = gridOptions_warehouse_const;
                            $scope.currNoAccessGridOptionName = gridOptions_warehouse_no_const;
                            $scope.currIdFeild = 'warehouse_id';
                            $scope.currAllListName = 'allWareHouses';
                            break;
                        case 2://部门
                            $scope.currAccessGridOptionName = gridOptions_dept_const;
                            $scope.currNoAccessGridOptionName = gridOptions_dept_no_const;
                            $scope.currIdFeild = 'orgid';
                            $scope.currAllListName = 'allDepts';
                            break;
                        case 3://资金账户
                            $scope.currAccessGridOptionName = gridOptions_account_const;
                            $scope.currNoAccessGridOptionName = gridOptions_account_no_const;
                            $scope.currIdFeild = 'fd_fund_account_id';
                            $scope.currAllListName = 'allFd_fund_accounts';
                            break;
                        case 4://销售区域
                            $scope.currAccessGridOptionName = gridOptions_salearea_const;
                            $scope.currNoAccessGridOptionName = gridOptions_salearea_no_const;
                            $scope.currIdFeild = 'sale_area_id';
                            $scope.currAllListName = 'allSale_saleareas';
                            break;
                        case 5://客户
                            $scope.currAccessGridOptionName = gridOptions_customer_const;
                            $scope.currNoAccessGridOptionName = gridOptions_customer_no_const;
                            $scope.currIdFeild = 'customer_id';
                            $scope.currAllListName = 'allCustomers';
                            break;
                        case 6://品类
                            $scope.currAccessGridOptionName = gridOptions_crment_const;
                            $scope.currNoAccessGridOptionName = gridOptions_crment_no_const;
                            $scope.currIdFeild = 'crment_id';
                            $scope.currAllListName = 'allCrm_ents';
                            break;
                        case 7://网点
                            $scope.currAccessGridOptionName = gridOptions_fixOrg;
                            $scope.currNoAccessGridOptionName = gridOptions_fixOrg_no;
                            $scope.currIdFeild = 'fix_org_id';
                            $scope.currAllListName = 'allFixOrgs';
                            break;
                    }
                });
                $scope.init();
                /**
                 * 添加选中
                 */
                $scope.addPart = function () {
                    var nodes = $scope[$scope.currNoAccessGridOptionName].hcApi.getSelectedNodes('checkbox');

                    if (!nodes.length) return;

                    $scope.editing = true;

                    var exchangeData = nodes.map(function (node) {
                        return node.data;
                    });

                    $scope[$scope.currNoAccessGridOptionName].api.updateRowData({
                        remove: exchangeData
                    });

                    $scope[$scope.currAccessGridOptionName].api.updateRowData({
                        add: exchangeData
                    });

                    $scope[$scope.currNoAccessGridOptionName].hcApi.setFocusedCell();

                    setListDataAferControl();
                };

                /**
                 * 添加全部
                 */
                $scope.addAll = function () {
                    var exchangeData = $scope[$scope.currNoAccessGridOptionName].hcApi.getRowData();

                    if (!exchangeData.length) return;

                    $scope.editing = true;

                    $scope[$scope.currNoAccessGridOptionName].api.updateRowData({
                        remove: exchangeData
                    });

                    $scope[$scope.currAccessGridOptionName].api.updateRowData({
                        add: exchangeData
                    });

                    $scope[$scope.currNoAccessGridOptionName].hcApi.setFocusedCell();

                    //更新模型
                    setListDataAferControl();
                };

                /**
                 * 删除选中
                 */
                $scope.deletePart = function () {
                    var nodes = $scope[$scope.currAccessGridOptionName].hcApi.getSelectedNodes('checkbox');

                    if (!nodes.length) return;

                    $scope.editing = true;

                    var exchangeData = nodes.map(function (node) {
                        return node.data;
                    });

                    $scope[$scope.currAccessGridOptionName].api.updateRowData({
                        remove: exchangeData
                    });

                    $scope[$scope.currNoAccessGridOptionName].api.updateRowData({
                        add: exchangeData
                    });
                    setListDataAferControl();
                };

                /**
                 * 删除全部
                 */
                $scope.deleteAll = function () {
                    var exchangeData = $scope[$scope.currAccessGridOptionName].hcApi.getRowData();

                    if (!exchangeData.length) return;

                    $scope.editing = true;

                    $scope[$scope.currAccessGridOptionName].api.updateRowData({
                        remove: exchangeData
                    });

                    $scope[$scope.currNoAccessGridOptionName].api.updateRowData({
                        add: exchangeData
                    });

                    setListDataAferControl();
                };

                /**
                 * 在添加移除完成后把数据放到对象;
                 */
                function setListDataAferControl() {
                    switch ($scope.accessFlag) {
                        case 1:
                            $scope.currUser.access_list = $scope[$scope.currAccessGridOptionName].hcApi.getRowData();
                            break;
                        case 2:
                            $scope.currRole.access_list = $scope[$scope.currAccessGridOptionName].hcApi.getRowData();
                            break;
                    }
                }

                $scope.$watch('editing', function (newVal) {
                    if (newVal == true) {
                        $('[hc-title="保存"]:first').removeClass('btn-white');
                        $('[hc-title="保存"]:first').addClass('btn-blue');
                    }
                    else {
                        $('[hc-title="保存"]:first').removeClass('btn-blue');
                        $('[hc-title="保存"]:first').addClass('btn-white');
                    }
                })


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);