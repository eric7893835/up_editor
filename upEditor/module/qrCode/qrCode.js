(function ($, UP) {
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    main.qrCode = main.qrCode || {};
    var qrCode = main.qrCode;
    var page = window.UP.Editor.page;
    var opt = [
        {
            'label': '链接地址',
            'name': 'qrLink'
        },
        {
            'label': 'Logo',
            'name': 'qrImg'
        }
    ];
    //bind event
    $("#optionBody").on("input", "[data-name=qrLink]", function () {
        var domId = $(this).attr("data-id");
        var value = $(this).val();
        var timedown = null;
        clearTimeout(timedown);
        setTimeout(function () {
            qrCode[domId]._htOption.text = value;
            if (qrCode[domId]._htOption.imgDataUrl) {
                qrCode[domId].makeCode(value, qrCode[domId]._htOption.imgDataUrl);
            } else {
                qrCode[domId].makeCode(value);
            }
            var length = page.length;
            for(var i = 0;i<length;i++){
                if(page[i].parent===domId){
                    page[i].href = value;
                    page[i].src = qrCode[domId].getDataUrl();
                    break;
                }
            }
        },300);
    });
    $("#optionBody").on("click", "[data-name=qrImg]", function () {
        var domId = $(this).attr("data-id");
        var value = qrCode[domId]._htOption.text;
        chrome.fileSystem.chooseEntry({
            type: 'openWritableFile',
            accepts: [
                {
                    description: '图片文件',
                    mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
                    extensions: ['jpg', 'png']
                }
            ]
        }, function (Entry) {
            Entry.file(function (file) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    qrCode[domId]._htOption.imgDataUrl = e.target.result;
                    qrCode[domId].makeCode(value, e.target.result);
                    var length = page.length;
                    for(var i = 0;i<length;i++){
                        if(page[i].parent===domId){
                            setTimeout(function () {
                                page[i].logo = e.target.result;
                                page[i].src = qrCode[domId].getDataUrl();
                            },500);
                            break;
                        }
                    }
                };
                fileReader.readAsDataURL(file);
            });
        });
    });

    define(function () {
        var dom = '<div style="width:100%;height:100%;" data-minH="375" class="qrCode"></div>' + '<div class="widgetSelectMask">' +
            '<span class="widgetMaskClose"></span>' +
            '</div>';
        return {
            'options': opt,
            "dom": dom,
            "afterRender": function (id) {
                qrCode[id] = new QRCode($('#' + id).find('.qrCode')[0], {
                    text: 'www.example.com',
                    width: 375,
                    height: 375
                });
                var data = {
                    "parent": id,
                    "pageStr": "<img class='qrCodeImg'/>",
                    "style": {
                        ".qrCodeImg": {}
                    },
                    "src": qrCode[id].getDataUrl(),
                    "logo": null,
                    "href": "www.example.com"
                };
                page.push(data);
                main.setResize(id, function (id, w, h, iswidth) {
                    var time = null;
                    if (w < 30 || h < 30) {
                        w = 30;
                        h = 30;
                    }
                    if (iswidth) {
                        h = w;
                    } else {
                        w = h;
                    }
                    $('#' + id).css({
                        width: w,
                        height: h
                    });
                    setTimeout(function(){
                        main.layoutOpts[id].width = w;
                        main.layoutOpts[id].height = h;
                    },500);
                    $('#changeHeight').val(h);
                    $('#changeWidth').val(w);
                    qrCode[id]._htOption.width = w;
                    qrCode[id]._htOption.height = h;
                    // 修复二维码循环切换的时候，外层layout不随着来回变动的问题
                    main.resetLayoutDiv(id,w,h);
                    var text = qrCode[id]._htOption.text;
                    if (qrCode[id]._htOption.imgDataUrl) {
                        qrCode[id].makeCode(text, qrCode[id]._htOption.imgDataUrl);
                    } else {
                        qrCode[id].makeCode(text);
                    }
                    var length = page.length;
                    for(var i = 0;i<length;i++){
                        if(page[i].parent===id){
                            page[i].src = qrCode[id].getDataUrl();
                            break;
                        }
                    }
                });
                main.setSelected(id, function (id) {
                    var text = qrCode[id]._htOption.text;
                    setTimeout(function () {
                        $("#optionBody").find("[data-name=qrLink]").val(text);
                    }, 500);
                })
            }
        }
    });
})(window.Zepto || window.jQuery, window.UP = window.UP || {});

