/**
 * 工程师档案属性页
 * 2019/7/15.     
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', '$q', 'numberApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, $q, numberApi, fileApi, $modal) {


        var CssServiceHeaderProp = [
            '$scope',
            function ($scope) {


                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true

                };
                function getInitImg() {
                    //初始化图片
                    var array = new Array()
                    for (var i = 0; i < 4; i++) {
                        var obj = { docid: 0, img_name: '正面照', locationid: i }
                        array.push(obj)

                    }
                    //console.log(array)
                    array.forEach(function (val, index) {
                        switch (index) {
                            case 0:
                                val.img_name = '本人正面照';
                                val.locationid = 0;
                                break;
                            case 1:
                                val.img_name = '身份证正面照';
                                val.locationid = 1;
                                break;
                            case 2:
                                val.img_name = '身份证反面照';
                                val.locationid = 2;
                                break;
                            case 3:
                                val.img_name = '本人手持照片';
                                val.locationid = 3;
                                break;

                        }
                    })
                    return array;
                }

                //初始值--添加页
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.job_attributes = 1
                    bizData.qualification_level = 1


                    //初始化图片
                    var array = new Array()
                    for (var i = 0; i < 4; i++) {
                        var obj = { docid: 0, img_name: '正面照', locationid: i }
                        array.push(obj)

                    }

                    bizData.item_org_imgofitem_orgs = getInitImg();

                    /*
                    fruits[0].img_name='正面';fruits[0].img_name='反面'
                    fruits[0].img_name='身份证正面';fruits[0].img_name='身份证反面'
                	
                    */

                }
                //初始值--详情页

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.data.currItem.item_org_imgofitem_orgs = getInitImg();

                    $scope.data.currItem.item_org_imgofitem_orgs.forEach(function (v, i) {
                        $scope.data.currItem.css_archives_enginees.forEach(function (val, index) {

                            if (val.image_type == v.locationid) {
                                v.docid = val.engineer_images_id;
                                v.locationid = val.image_type;
                            }

                        })

                    });
                    //console.log($scope.data.currItem.item_org_imgofitem_orgs);
                };
                $scope.doAfterSave = function (responseData) {
                     console.log(responseData.css_archives_enginees);
                     console.log("--");
                     console.log($scope.data.currItem.item_org_imgofitem_orgs);
                    $scope.data.currItem.item_org_imgofitem_orgs.forEach(function (v, i) {
                        responseData.css_archives_enginees.forEach(function (val, index) {

                            if (val.image_type == v.locationid) {
                                v.docid = val.engineer_images_id;
                                v.locationid = val.image_type;
                            }

                        })

                    });
                };

                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    var i = 0;
                    var imgdata = [];
                    for (i = bizData.item_org_imgofitem_orgs.length - 1; i > -1; i--) {
                        if (bizData.item_org_imgofitem_orgs[i].img_name) {
                            //bizData.item_org_imgofitem_orgs.splice(i);
                            imgdata.push(bizData.item_org_imgofitem_orgs[i]);
                        }
                    }
                    bizData.item_org_imgofitem_orgs = imgdata;
                };

                //html 使用
                $scope.open = function (doc) {
                    return openBizObj({
                        imageId: doc.docid,
                        images: $scope.data.currItem.item_org_imgofitem_orgs
                    });
                };
                //图片上传
                $scope.uploadFile = function (index) {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (rspeData) {
                        $scope.data.currItem.item_org_imgofitem_orgs[index] = {
                            "docid": numberApi.toNumber(rspeData[0].docid),
                            "img_name": $scope.data.currItem.item_org_imgofitem_orgs[index].img_name,
                            "locationid": $scope.data.currItem.item_org_imgofitem_orgs[index].locationid
                        }
                        // console.log("item_org_imgofitem_orgs", $scope.data.currItem.item_org_imgofitem_orgs);
                    });
                };
                //图片删除
                $scope.del_image = function (index) {
                    $scope.data.currItem.item_org_imgofitem_orgs[index] = {
                        "img_name": $scope.data.currItem.item_org_imgofitem_orgs[index].img_name,
                        "locationid": $scope.data.currItem.item_org_imgofitem_orgs[index].locationid
                    };
                    // console.log("del_image", $scope.data.currItem.item_org_imgofitem_orgs)
                };


                ///验证start
                $scope.validCheck = function (invalidBox) {
                    //图片完整验证
                    var array = $scope.data.currItem.item_org_imgofitem_orgs;
                    var a = 1;
                    array.forEach(function (val, index) {
                        if (val.docid == 0) {
                            invalidBox.push("请上传4张身份证验证图片");
                            return invalidBox;
                        }
                    });
                    //保存身份证号验证
                    var str = $scope.data.currItem.identity_number;
                    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                    if (str.length < 18 || str.length > 18) {
                        invalidBox.push("请正确输入18位身份证号");
                        return invalidBox;
                    } else if (!p.test(str)) {
                        invalidBox.push("请输入有效的18位身份证号");
                        $scope.hcSuper.validCheck(invalidBox);
                        return invalidBox;
                    } else {
                        return requestApi.post({
                            classId: 'employee_blacklist',
                            action: 'search',
                            data: {
                                sqlwhere: "Idcard='" + $scope.data.currItem.identity_number + "' and bill_stat=1"
                            }
                        })
                            .then(function (response) {
                                if (response.employee_blacklists.length > 0) {
                                    invalidBox.push("已加入特殊名单，不能再入职");
                                }
                            }).then(function () {
                                $scope.hcSuper.validCheck(invalidBox);
                                return invalidBox;
                            });
                    }
                };

                //  验证End

            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CssServiceHeaderProp
        });
    });