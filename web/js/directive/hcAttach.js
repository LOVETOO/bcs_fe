/**
 * 附件
 * @since 2019-02-12
 */
define(['module', 'directiveApi', 'angular', 'fileApi', 'openBizObj', 'Decimal', 'swalApi', 'requestApi', 'directive/hcButtons', 'directive/hcGrid', 'directive/hcImg'], function (module, directiveApi, angular, fileApi, openBizObj, Decimal, swalApi, requestApi) {

    /**
     * 指令
     */
    function hcAttachDirective() {
        return {
            scope: {
                getSetting: '&hcAttach'
            },
            templateUrl: directiveApi.getTemplateUrl(module),
            controller: HcAttachController
        };
    }

    /**
     * 控制器
     */
    HcAttachController.$inject = ['$scope', '$element', '$parse', '$http', '$q'];

    function HcAttachController($scope, $element, $parse, $http, $q) {

        $scope.error = true;

        var $parent = $scope.$parent,
            setting = $scope.getSetting(),
            attachGetter,
            attachSetter;

        if (!setting) {
            // console.error('附件功能初始化失败：缺少附件设置', setting);
            return;
        }

        if (typeof setting === 'string')
            setting = {
                model: setting
            };

        /**
         * 绑定模型
         */
        (function () {
            var modelParser = $parse(setting.model);

            if (!modelParser.assign) {
                console.error('附件功能初始化失败：绑定的模型不合法', setting.model);
                return;
            }

            attachGetter = (function (getter) {
                return function () {
                    var value = getter();
                    if (!value) {
                        value = [];
                        attachSetter(value);
                    }
                    return value;
                };
            })(modelParser.bind(null, $parent));

            attachSetter = modelParser.assign.bind(null, $parent);

            $scope.error = false;
        })();

        if ($scope.error) return;

        var iconMap = {};
        $http
            .get('config/file_icon.json', {
                cache: true
            })
            .then(function (response) {
                iconMap = response.data;
            });

        /**
         * 附件列表
         */
        Object.defineProperty($scope, 'docs', {
            get: attachGetter,
            set: attachSetter
        });

        /**
         * 是否有多个文件
         */
        Object.defineProperty($scope, 'moreThanOne', {
            get: function () {
                return $scope.docs && $scope.docs.length > 1;
            }
        });

        /**
         * 取图标
         */
        $scope.getIcon = function (doc) {
            var suffix = fileApi.getSuffix(doc.docname);

            if (suffix in iconMap)
                return iconMap[suffix];

            return iconMap.default;
        };

        $scope.isImage = fileApi.isImage;

        /**
         * 上传
         */
        $scope.upload = function () {
            return fileApi
                .chooseFile()
                .then(function(files){
                    //校验选择的文件与已选文件是否重名
                    var attach = attachGetter();
                    var repeatFile = [];
                    files.forEach(function (curOut) {
                        attach.forEach(function (curIn) {
                            if(curOut.name == curIn.docname){
                                repeatFile.push(curOut.name);
                            }
                        })
                    });
                    //若有上传文件与已选文件重名，提示上传失败
                    if (repeatFile.length && repeatFile.length > 0) {
                        swalApi.info('上传失败,请勿上传重名文件：\n' + repeatFile.join(';\n'));
                        return $q.reject('上传了重名文件');
                    }else{
                        return files;
                    }
                })
                .then(fileApi.uploadFile)
                .then(function (docs) {
                    Array.prototype.push.apply(attachGetter(), docs);
                });

/*
            return fileApi
                .uploadFile()
                .then(function (docs) {
                    Array.prototype.push.apply(attachGetter(), docs);
                });
*/
        };

        /**
         * 下载
         */
        $scope.download = function (doc) {
            return fileApi.downloadFile(doc);
        };

        /**
         * 批量下载
         */
        $scope.batchDownload = function () {
            return swalApi.info('批量下载功能暂未实现');
        };

        /**
         * 打开
         */
        $scope.open = function (doc) {
            if (fileApi.isImage(doc)) {
                return openBizObj({
                    imageId: doc.docid,
                    images: attachGetter()
                });
            }
            else
                return fileApi.openFile(doc);
        };

        /**
         * 删除
         */
        $scope.delete = function (doc) {
            var index = $scope.docs.indexOf(doc);
            $scope.docs.splice(index, 1);
            delete selectedDocs[doc.docid];
			$scope.selectedCount--;
			
			requestApi.post({
				classId: 'scpdoc',
				action: 'delete',
				data: {
					docid: doc.docid
				},
				noShowWaiting: true,
				noShowError: true
			});
        };

        /**
         * 批量删除
         */
        $scope.batchDelete = function () {
            angular.forEach(selectedDocs, $scope.delete);
        };

        /**
         * 选中文件集合
         */
        var selectedDocs = {};

        /**
         * 选中文件数量
         */
        $scope.selectedCount = 0;

        /**
         * 是否多选
         */
        Object.defineProperty($scope, 'multiSelected', {
            get: function () {
                return $scope.selectedCount > 1;
            }
        });

        /**
         * 选中文件
         */
        $scope.select = function (docScope) {
            if (!$scope.moreThanOne) return;

            docScope.checked = !docScope.checked;

            if (docScope.checked) {
                selectedDocs[docScope.doc.docid] = docScope.doc;
                $scope.selectedCount++;
            }
            else {
                delete selectedDocs[docScope.doc.docid];
                $scope.selectedCount--;
            }
        };

        /**
         * 展示大小
         */
        $scope.displaySize = function (size) {
            try {
                size = Decimal(size);

                var G = '1073741824',
                    M = '1048576',
                    K = '1024',
                    B = '1',
                    divisor,
                    unit;

                if (size.greaterThanOrEqualTo(G)) {
                    divisor = G;
                    unit = 'GB';
                }
                else if (size.greaterThanOrEqualTo(M)) {
                    divisor = M;
                    unit = 'MB';
                }
                else if (size.greaterThanOrEqualTo(K)) {
                    divisor = K;
                    unit = 'KB';
                }
                else {
                    divisor = B;
                    unit = 'B';
                }

                size = size.dividedBy(divisor);

                var decimalPlaces = 2, result;

                if (size.decimalPlaces() > decimalPlaces)
                    result = size.toFixed(decimalPlaces);
                else
                    result = size.toString();

                result += unit;

                return result;
            } catch (e) {
                console.error(e);
                return '未知';
            }
        };

        /**
         * 只读
         */
        Object.defineProperty($scope, 'readonly', {
            get: function () {
                var formController = $element.inheritedData('$formController');
                return formController && formController.isReadonly && formController.isReadonly();
            }
        });
    }

    //使用Api注册指令
    //需传入require模块和指令定义
    return directiveApi.directive({
        module: module,
        directive: hcAttachDirective
    });
});