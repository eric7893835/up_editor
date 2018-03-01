(function ($, UP) {
    UP.W = UP.W||{};
    UP.W.UI = UP.W.UI || {};
    var ui = UP.W.UI;
    ui.showAlert = function (title, msg, okText, cancelText, okCallback, cancelCallback) {
        var _this = this;
        var domStr = "<div class='up_ui up_ui_alert'><div class='title'>";
        domStr += title || "系统提示";
        domStr += "</div><div class='message'>";
        domStr += msg || "";
        domStr += "</div><div class='buttonarea'><div class='cancel ";
        domStr += cancelText === null ? "hide" : "";
        domStr += "'>";
        domStr += cancelText || "取消";
        domStr += "</div><div class='okey ";
        domStr += okText === null ? "hide" : "";
        domStr += "'>";
        domStr += okText || "确认";
        domStr += "</div></div>";
        $('body').append(domStr);
        $('.up_ui_alert').setFixItemMiddle();
        $('.up_ui_alert').myDrag({
            direction:'all',
            handler:'.title'
        });
        _this.showMask();
        if (typeof okCallback === 'function') {
            $('.okey').off().on('click', function () {
                okCallback();
            });
        }
        if (typeof cancelCallback === 'function') {
            $('.cancel').off().on('click', function () {
                cancelCallback();
            });
        }
    };
    ui.showToast = function (msg) {
        var _this = this;
        var domStr = "<div class='up_ui up_ui_toast'>" +
            "<div class='text'>" + msg || '系统提示' + "</div>" +
            "</div>";
        $('body').append(domStr);
        _this.showMask();
        setTimeout(function () {
            _this.dismiss();
        }, 1500);
    };
    ui.dismiss = function () {
        $('.up_mask').hide();
        $('.up_ui').remove();
    };
    ui.showMask = function () {
        var domStr = '<div class="up_mask"></div>';
        if ($('.up_mask')[0]) {
            $('.up_mask').show();
            return;
        }
        $('body').append(domStr);
    };
    ui.showProcess = function (title) {
        var _this = this;
        var domStr = "<div class='up_ui up_ui_process'>";
        domStr += "<div class='title'>";
        domStr += title || "进程进行中";
        domStr += "</div>";
        domStr += "<div class='progressarea'>";
        domStr += "<progress class='progress' id='progress' max='100' value='0s'></progress>";
        domStr += "<div class='processtext'>asdasdfjasjdfjaklashdjashdkahsjkdhjks</div>";
        domStr += "</div>"
        domStr += "</div>";
        $('body').append(domStr);
        $('.up_ui_process').setFixItemMiddle();
        $('.up_ui_process').myDrag({
            direction:'all',
            handler:'.title'
        });
        _this.showMask();
    };
    ui.updateProcess = function (text, progress, callback) {
        $('.up_ui_process .progressarea .processtext').text(text || '');
        var value = $('.up_ui_process .progressarea .progress').attr('value');
        if ((parseInt(value) + progress) >= 100) {
            $('.up_ui_process .progressarea .progress').attr('value', '100');
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            $('.up_ui_process .progressarea .progress').attr('value', parseInt(value) + progress);
        }
    };
    ui.dateFormate = function (date) {
        var _date = new Date();
        _date = date;
        console.log(date);
        return _date.getFullYear()+'-'+(_date.getMonth()+1)+'-'+_date.getDate()+' '+_date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds();
    };
    ui.base64ToBlob = function (dataUrl) {
        var arr = dataUrl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1])
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr],{type:mime});
    }


    $.fn.setFixItemMiddle = function() {
        var ele = this;
        var ele_width = parseInt(ele.css('width'))/2;
        var ele_height = parseInt(ele.css('height'))/2;
        setMiddle(ele,ele_width,ele_height);
        window.addEventListener('resize',function () {
            setMiddle(ele,ele_width,ele_height);
        },false);
        function setMiddle(ele,w,h) {
            var left = parseInt($('body').css('width'))/2 - w;
            var top = parseInt($('body').css('height'))/2 - h;
            ele.css({
                'top':top,
                'left':left
            });
        }
        return this;
    }
    
})(window.Zepto || window.jQuery, window.UP = window.UP || {});