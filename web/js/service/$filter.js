/**
 * 所有angular内置服务，都如下书写，
 * 只要保持文件名和服务名一致即可
 */
define(
    ['module', 'serviceApi'],
    function (module, serviceApi) {
        return serviceApi.getService(module);
    }
);