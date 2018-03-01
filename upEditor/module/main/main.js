(function ($, UP) {
    var ui = window.UP.W.Ui;
    UP.W = UP.W || {};
    UP.W.Main = UP.W.Main || {};
    UP.Editor = UP.Editor || {};

    var main = UP.W.Main;
    var editor = UP.Editor;
    editor.page = [];
    var page = editor.page;
    // var optCfg;

    main.opt = [
        {
            "label": "背景色",
            "name": "backgroundColor"
        },
        {
            "label": "背景图片",
            "name": "bgsrc"
        },
        {
            "label": "背景设置",
            "name": "bgSet"
        }
    ];
    main.domOpts = {};
    main.layoutOpts = {};

    // //模块配置
    require.config({
        baseUrl: "../module",
        paths: {
            "optCfg": "main/optCfg",
            "inoutput": "inoutput/inoutput",
            "left": "main/left",
            "image": "image/image",
            "secertMenu": "secertMenu/secertMenu",
            "blank": "blank/blank",
            "richText": "richText/richText",
            "linkButton": "linkButton/linkButton",
            "shape": "shape/shape",
            "qrCode": "qrCode/qrCode",
            "jscolor": "../lib/jscolor",
            "qrCodeJs": "../lib/qrcode",
            "moduleFuc": "main/moduleFuc",
            "publicModules": "main/publicModules",
            "wangEditor": "../lib/wangEditor-3.0.8/wangEditor"
        }
    });
    require(["secertMenu"], null);
    // require(["optCfg"], function (res) {
    //     optCfg = res;
    // });
    require(["inoutput"], function () {
        //初始化全局变量
        var UP = Window.UP || {};
        UP.Editor = UP.Editor || {};
    });
    require(["left"], function (leftCfg) {
        main.setLeftBody(leftCfg);
        window.UP.W.temp = leftCfg;
    });

    require(['publicModules'], null);

    /*
    * 解决 input type = number 点击时不灵敏
    * */
    // $("body").on("mouseover","input",function () {
    //     $(this).focus();
    // })


    main.setLeftBody = function (leftCfg) {
        var leftItems = "";
        for (var i = 0, len = leftCfg.length; i < len; i++) {
            var path = main.getPath(leftCfg[i].name);
            leftItems += '<p class="left-item" data-name="' + leftCfg[i].name + '" >'
                + '<img src="' + path + 'icon.png"/>'
                + '<span>' + leftCfg[i].label + '</span>'
                + '</p>';
        }
        $("#left").html(leftItems);
        main.setOpt(main.opt);
    };
    main.setOpt = function (opt, id) {
        $(".option-item").remove();
        if (opt) {
            for (var i = 0, len = opt.length; i < len; i++) {
                var li = "<li class='option-item'>"
                    + "<label>" + opt[i].label + "</label>"
                    + optCfg[opt[i].name]
                    + "</li>";
                $("#optionBody").append(li);
                var dom = $("#optionBody [data-name=" + opt[i].name + "]");
                dom.attr("data-id", id);
                    if (opt[i].value) {
                        dom.val(opt[i].value);
                    }
                }
            }
    };

    main.getPath = function (name) {
        var path = "../../module/" + name + "/";
        return path;
    };
    $(window).resize(function () {
        var height = $(window).height();
        $("#optionBody").css("height", (height - 226) + "px")
    });

    $("#optionBody").on("change", "[type=range]", function () {
        $(this).prev().val($(this).val())
    });
    $("#optionBody").on("input", ".rangeTxt", function () {
        $(this).next().val($(this).val())
    });

    var _data = {
        "pageStr": "<!DOCTYPE html><html lang='en'><head><meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=0'><meta http-equiv='X-UA-Compatible' content='IE=11; IE=10; IE=9; IE=8; IE=EDGE'><meta name='format-detection' content='telephone=no'><meta name='visual-width' content='375'><meta charset='UTF-8'><title></title><link rel='stylesheet' href='css/index.css'><script src='js/resize.js'></script></head><body id='makedir'></body></html>",
        "style": {
            "*": {
                "padding": 0,
                "margin": 0
            },
            'html': {
                'width': "100%",
                'min-height': "100%"
            },
            "#makedir": {
                "width": "100%",
                "min-height": "100%",
                "background-color": "#ffffff",
                "background-image": "none",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat"
            }
        },
        'js': ';(function (win, UP) {\n' +
        '    "use strict";\n' +
        '\n' +
        '    UP.W = UP.W || {};\n' +
        '    UP.W.Rem = UP.W.Rem || {};\n' +
        '\n' +
        '    var timer = null;\n' +
        '    var rem = 12;\n' +
        '    var doc = win.document;\n' +
        '    var docEl = doc.documentElement;\n' +
        '    var visualWidth = 640;\n' +
        '\n' +
        '    var vEl = doc.querySelector(\'meta[name="visual-width"]\');\n' +
        '    if (vEl) {\n' +
        '        var vWidth = vEl.getAttribute(\'content\');\n' +
        '        if (vWidth) {\n' +
        '            visualWidth = parseInt(vWidth);\n' +
        '        }\n' +
        '    }\n' +
        '\n' +
        '    /**\n' +
        '     * 刷新页面REM值\n' +
        '     */\n' +
        '    function refreshRem() {\n' +
        '        var width = docEl.getBoundingClientRect().width;\n' +
        '        width = width > 768 ? visualWidth : width;\n' +
        '        rem = width / (visualWidth / 100);\n' +
        '        docEl.style.fontSize = rem + \'px\';\n' +
        '    }\n' +
        '\n' +
        '    /**\n' +
        '     * 页面缩放或重载时刷新REM\n' +
        '     */\n' +
        '    win.addEventListener(\'resize\', function () {\n' +
        '        clearTimeout(timer);\n' +
        '        timer = setTimeout(refreshRem, 300);\n' +
        '    }, false);\n' +
        '    win.addEventListener(\'pageshow\', function (e) {\n' +
        '        if (e.persisted) {\n' +
        '            clearTimeout(timer);\n' +
        '            timer = setTimeout(refreshRem, 300);\n' +
        '        }\n' +
        '    }, false);\n' +
        '\n' +
        '    // 解决font-size过大导致间距不正常，必须指定body字号为12px\n' +
        '    if (doc.readyState === \'complete\') {\n' +
        '        doc.body.style.fontSize = \'12px\';\n' +
        '    } else {\n' +
        '        doc.addEventListener(\'DOMContentLoaded\', function (e) {\n' +
        '            doc.body.style.fontSize = \'12px\';\n' +
        '        }, false);\n' +
        '    }\n' +
        '\n' +
        '    refreshRem();\n' +
        '\n' +
        '    /**\n' +
        '     * rem to px\n' +
        '     * @param d\n' +
        '     * @returns {number}\n' +
        '     */\n' +
        '    UP.W.Rem.rem2px = function (d) {\n' +
        '        var val = parseFloat(d) * rem;\n' +
        '        if (typeof d === \'string\' && d.match(/rem$/)) {\n' +
        '            val += \'px\';\n' +
        '        }\n' +
        '        return val;\n' +
        '    };\n' +
        '\n' +
        '    /**\n' +
        '     * px to rem\n' +
        '     * @param d\n' +
        '     * @returns {number}\n' +
        '     */\n' +
        '    UP.W.Rem.px2rem = function (d) {\n' +
        '        var val = parseFloat(d) / rem;\n' +
        '        if (typeof d === \'string\' && d.match(/px$/)) {\n' +
        '            val += \'rem\';\n' +
        '        }\n' +
        '        return val;\n' +
        '    };\n' +
        '\n' +
        '})(window, window.UP || (window.UP = {}));'

    };
    page.push(_data);

})(window.Zepto || window.jQuery, window.UP = window.UP || {});


