 (function ($) {
    Drupal.behaviors.sUrl = window.location.protocol + "//" + window.location.host + "/";
    Drupal.behaviors.loaderImg = '<img class="img-loader" src="' + Drupal.behaviors.sUrl + 'themes/epsops/assets/img/ajax-loader-t.gif" />';
    Drupal.behaviors.brokenImgUrl =  Drupal.behaviors.sUrl + 'themes/epsops/assets/img/broken-img.png';
     Drupal.behaviors.cardOverlay = function (id, text) {
        return '<div class="bv-overlay"><div class="content"><span><button id="btn-confirm-' + id + '" class="btn btn-secondary">' + text + '</button></span></div></div>';
    };
    let AjaxHttpSender = function () {
    };
    Drupal.behaviors.iitAjaxHttpSenders = {
        attach: function (context, settings) {
            AjaxHttpSender.prototype.sendGet = function (url, callback) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    beforeSend: function () {
                        onStartAjaxRequest();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        callback.failure(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data, textStatus) {
                        callback.success(data, textStatus);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        onEndAjaxRequest();
                    }
                });
            };

            AjaxHttpSender.prototype.sendPost = function (url, data, callback) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    beforeSend: function () {
                        onStartAjaxRequest();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        callback.failure(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data, textStatus) {
                        callback.success(data, textStatus);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        onEndAjaxRequest();
                    }
                });
            };

            AjaxHttpSender.prototype.sendPostHeader = function (url, data, callback, headers) {
                $.ajax({
                    url: url,
                    type: 'PUT',
                    data: data,
                    headers: headers,
                    beforeSend: function () {
                        onStartAjaxRequest();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        callback.failure(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data, textStatus) {
                        callback.success(data, textStatus);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        onEndAjaxRequest();
                    }
                });
            };

            function onStartAjaxRequest() {
                //console.log('onStartAjaxRequest ran');
            }

            function onEndAjaxRequest() {
                //console.log('onEndAjaxRequest ran');
            }

        }
    };

    Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall = function (url, callback) {
        let ajaxHttpSender = new AjaxHttpSender();
        ajaxHttpSender.sendGet(url, callback);
    };


    Drupal.behaviors.iitAjaxHttpSenders.postAjaxCall = function (url, data, callback) {
        let ajaxHttpSender = new AjaxHttpSender();
        ajaxHttpSender.sendPost(url, data, callback);
    };
    Drupal.behaviors.iitAjaxHttpSenders.postHeaderAjaxCall = function (url, data, callback, headers) {
        let ajaxHttpSender = new AjaxHttpSender();
        ajaxHttpSender.sendPostHeader(url, data, callback, headers);
    };

    Drupal.behaviors.iitAjaxHttpSenders.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };


})(jQuery);
