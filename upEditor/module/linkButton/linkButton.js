(function ($, UP) {
    "use strict";
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    main.linkButton = main.linkButton || {};
    var linkButton = main.linkButton;
    var page = window.UP.Editor.page;
    var opt = [
        {
            'label': '按钮文本',
            'name': 'buttonText'
        },
        {
            'label': '按钮链接',
            'name': 'buttonLink'
        },
        {
            'label': '背景颜色',
            'name': 'buttonFillColor'
        },
        {
            "label": "背景图片",
            "name": "buttonBgSrc"
        },
        {
            'label': '字体颜色',
            'name': 'fontColor'
        },
        {
            'label': '边框颜色',
            'name': 'buttonBorderColor'
        },
        {
            'label': '高度',
            'name': 'buttonHeight'
        },
        {
            'label': '边框厚度',
            'name': 'buttonBorderWidth'
        },
        {
            'label': '边框弧度',
            'name': 'buttonBorderRadius'
        },
        {
            'label': '字体大小',
            'name': 'fontSize'
        },
        {
            'label': '是否分享',
            'name': 'isShare'
        },
        {
            'label': '是否下载',
            'name': 'isDownloadPage'
        },
        {
            'label': '渐变',
            'name': 'linearGradientStyle'
        },
        {
            'label': '&nbsp;',
            'name': 'linearGradientFrom'
        },
        {
            'label': '&nbsp;',
            'name': 'linearGradientTo'
        },
        {
            'label': '阴影',
            'name': 'boxShadowOffset'
        },
        {
            'label': '&nbsp;',
            'name': 'boxShadow'
        },
        {
            'label': '&nbsp;',
            'name': 'boxShadowColor'
        },
        {
            'label': '背景透明',
            'name': 'buttonOpacity'
        }
    ];

    // 渲染页面Demo
    main.setOpt(opt);

    //封装函数
    function buttonAttr(info) {
        var a = this._initObj(info);
        this._init(a);
    }

    buttonAttr.prototype = {
        constructor: buttonAttr,
        _init: function (info) {
            this.domId = info.domId;
            this.inputValue = info.inputValue;
            console.log('+++++++++++++++' + this.domId);
            console.log('+++++++++++++++' + this.inputValue);
        },
        _initObj: function (that) {
            console.log(that);
            var buttonObj = {
                domId: that.attr("data-id"),
                inputValue: that.val()
            };
            return buttonObj;
        }
    };

    //封装颜色将十六进制色值转化为RGBA的方法
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    String.prototype.colorRgb = function (opacityValue) {
        var sColor = this.toLowerCase();
        if (sColor && reg.test(sColor)) {
            //处理四位的颜色值
            if (sColor.length === 4) {
                var sColorNew = '#';
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            console.log(sColor);
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
            }
            sColorChange.push(opacityValue);
            return "rgba(" + sColorChange.join(',') + ")";
        } else {
            return sColor;
        }
    };

    //共有宽度
    $("#optionBody").on("blur", "[id=changeWidth]", function () {
        var domId = $(this).attr("data-w");
        var w = $(this).val();
        var h = $("#optionBody").find("[id='changeHeight']").val();
        console.log(w + '---' + h + '---' + domId);

        main.resetLayoutDiv(domId, w, h);
    });
    //是否分享
    $("#optionBody").on("click", ".isShare", function () {

        var linkHtml = $("#" + $(this).data('id')).find('a').text();
        var parentId = $(this).data('id');
        var _that = $(this);
        if ($(this).get(0).checked) {

            $("#" + parentId + " a").attr("data-isDownloadPage", "false");
            $("#optionBody").find("[data-control='isDownloadPage']").attr('checked', false);

            var create_window = chrome.app.window.get('rightShareWindow');
            if (create_window) {
                create_window.close();
            }
            chrome.app.window.create('../../html/shareEdit.html', {
                'id': 'linkShareWindow',
                'bounds': {
                    'width': 480,
                    'height': 320
                },
                'resizable': false,
                'frame': 'none'
            });

            chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
                if (msg == 'stopSharing') {
                    _that.attr('checked',false);
                    sendResponse('00');
                } else if (msg == 'succeed') {

                    var length = page.length;
                    for (var i = 0; i < length; i++) {
                        if (page[i].parent === parentId) {
                            page[i].pageStr = "<a class='linkButton' data-isShare='true' data-isDownloadPage='false'>" + linkHtml + "</a>";
                            break;
                        }
                    }
                    //这里要设置html 是否分享 因为第二次点击要根据html判断是否分享按钮要选中与否
                    $("#" + parentId + " a").attr("data-isshare", "true");
                    sendResponse('00');
                }
            });

        } else {
            //设置为true并且设置文本
            var length = page.length;
            for (var i = 0; i < length; i++) {
                if (page[i].parent === parentId) {
                    page[i].pageStr = "<a class='linkButton' data-isShare='false' data-isDownloadPage='false'>" + linkHtml + "</a>";
                    break;
                }
            }
            //这里要设置html 是否分享 因为第二次点击要根据html判断是否分享按钮要选中与否
            $("#" + parentId + " a").attr("data-isshare", "false");
        }
    });

    //共有高度
    $("#optionBody").on("blur", "[id=changeHeight]", function () {
        var domId = $(this).attr("data-h");

        var w = $("#optionBody").find("[id='changeWidth']").val();
        var h = $(this).val();
        var borderH = $("#optionBody").find("[data-name='buttonBorderWidth']").val() * 2;
        var buttonH = h - (borderH + 1) + 2;

        $("#optionBody").find("[data-name='buttonHeight']").val(buttonH);
        $("#" + domId).find("a").css({"height": buttonH + "px", "line-height": buttonH + "px"});

        console.log(w + '---' + h + '---' + domId);
        main.resetLayoutDiv(domId, w, h);
    });

    // 文本
    $("#optionBody").on("blur", "[data-name=buttonText]", function () {
        var _this = $(this);
        var buttonText = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + buttonText.domId).find("a").text(buttonText.inputValue);
        linkButton[buttonText.domId].buttonText = buttonText.inputValue;

        //判断是否分享，然后添加自定义属性
        var judgeIsShare = $('[data-id="' + buttonText.domId + '"].isShare');
        var judgeIsDownLoad = $('[data-id="' + buttonText.domId + '"].isDownloadPage');
        var linkA = '';
        if (judgeIsShare.get(0).checked || judgeIsDownLoad.get(0).checked) {
            if(judgeIsShare.get(0).checked){
                linkA = "<a class='linkButton' data-isShare='true' data-isDownloadPage='false'>" + buttonText.inputValue + "</a>";
            }else if(judgeIsDownLoad.get(0).checked){
                linkA = "<a class='linkButton' data-isShare='false' data-isDownloadPage='true'>" + buttonText.inputValue + "</a>";
            }
        } else {
            linkA = "<a class='linkButton' data-isShare='flase'  data-isDownloadPage='false'>" + buttonText.inputValue + "</a>";
        }

        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonText.domId) {
                page[i].pageStr = linkA;
                break;
            }
        }
    });

    // 链接
    $("#optionBody").on("blur", "[data-name=buttonLink]", function () {
        var _this = $(this);
        var buttonLink = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + buttonLink.domId).find("a").attr("href", buttonLink.inputValue);
        linkButton[buttonLink.domId].buttonLink = buttonLink.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonLink.domId) {
                page[i].href = buttonLink.inputValue;
                break;
            }
        }
    });

    //背景颜色
    $("#optionBody").on("blur", "[data-name=buttonFillColor]", function () {
        var _this = $(this);
        var buttonBgcolor = new buttonAttr(_this);
        var opacityValue = $("#optionBody").find("[data-name='buttonOpacity']").val() / 100;
        var sHex = buttonBgcolor.inputValue;

        var sRgbColor = sHex.colorRgb(opacityValue);
        console.log(sRgbColor + '----------------------------------------');
        //　操作 存储 导出
        $("#" + buttonBgcolor.domId).find("a").css("background-color", sRgbColor);
        linkButton[buttonBgcolor.domId].buttonFillColor = buttonBgcolor.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonBgcolor.domId) {
                page[i].style['.linkButton']['background-color'] = buttonBgcolor.inputValue;
                break;
            }
        }
    });

    //背景图片
    function showPreview(source, domId) {
        var file = source;
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
        } else if (window.FileReader) {
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                $("#" + domId).find("a").css({
                    "background-image": 'url(' + e.target.result + ')',
                    "background-repeat": "no-repeat",
                    "background-size": "100% 100%"
                });

                //新增开始
                linkButton[domId].buttonBgSrc = e.target.result;
                var length = page.length;
                for (var i = 0; i < length; i++) {
                    if (page[i].parent === domId) {
                        page[i].style['.linkButton']['background-image'] = 'url(\'../image/' + domId + '.png\')';
                        page[i].src = e.target.result;
                        // page[i].style['.linkButton']['background-image'] = 'url(\''+e.target.result+'\')';
                        break;
                    }
                }
                //新增结束

            };
            fileReader.readAsDataURL(file);
        }
    }

    $("#optionBody").on("click", "[data-name=buttonBgSrc]", function () {
        var domId = $(this).attr("data-id");
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
            console.log(Entry);
            Entry.file(function (file) {
                showPreview(file, domId);
            });
        });
    });
    //清除按钮
    $("#optionBody").on("click", "[data-control=clearBgImage]", function () {
        var domId = $(this).prev().attr("data-id");
        console.log(domId);
        $("#" + domId).find("a").css({"background-image": ''});
        // 把page中的src清空
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === domId) {
                page[i].style['.linkButton'].backgroundImage = '';
                break;
            }
        }
    });

    //文字颜色
    $("#optionBody").on("blur", "[data-name=fontColor]", function () {
        var _this = $(this);
        var buttonLinkColor = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + buttonLinkColor.domId).find("a").css("color", buttonLinkColor.inputValue);
        linkButton[buttonLinkColor.domId].fontColor = buttonLinkColor.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonLinkColor.domId) {
                page[i].style['.linkButton'].color = buttonLinkColor.inputValue;
                break;
            }
        }
    });

    //描边颜色
    $("#optionBody").on("blur", "[data-name=buttonBorderColor]", function () {
        var _this = $(this);
        var buttonBorderColor = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + buttonBorderColor.domId).find("a").css("border-color", buttonBorderColor.inputValue);
        linkButton[buttonBorderColor.domId].buttonBorderColor = buttonBorderColor.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonBorderColor.domId) {
                page[i].style['.linkButton']['border-color'] = buttonBorderColor.inputValue;
                break;
            }
        }
    });

    //按钮高度
    $("#optionBody").on("blur", "[data-name=buttonHeight]", function () {
        var _this = $(this);
        var buttonHeight = new buttonAttr(_this);

        var w = $("#optionBody").find("[id='changeWidth']").val();
        var borderH = $("#optionBody").find("[data-name='buttonBorderWidth']").val() * 2 - 2;
        var buttonH = buttonHeight.inputValue;
        var newH = parseInt(buttonH) + parseInt(borderH);
        console.log(w + '---' + buttonH + '---' + borderH + '---' + newH);
        main.resetLayoutDiv(buttonHeight.domId, w, newH);
        //　操作 存储 导出
        $("#" + buttonHeight.domId).find("a").css({
            "height": buttonHeight.inputValue + "px",
            "line-height": buttonHeight.inputValue + "px"
        });
        linkButton[buttonHeight.domId].buttonHeight = buttonHeight.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonHeight.domId) {
                page[i].style['.linkButton'].height = buttonHeight.inputValue + 'px';
                page[i].style['.linkButton']['line-height'] = buttonHeight.inputValue + 'px';
                break;
            }
        }
    });

    //描边宽度
    $("#optionBody").on("blur", "[data-name=buttonBorderWidth]", function () {
        var _this = $(this);
        var buttonBorderWidth = new buttonAttr(_this);
        var w = $("#optionBody").find("[id='changeWidth']").val();
        var buttonH = $("#optionBody").find("[data-name='buttonHeight']").val();
        var borderH = buttonBorderWidth.inputValue * 2;
        var newH = parseInt(buttonH) + parseInt(borderH);
        console.log(w + '---' + buttonH + '---' + borderH + '---' + newH);
        //　操作 存储 导出
        $("#" + buttonBorderWidth.domId).find("a").css("border-width", buttonBorderWidth.inputValue + "px");
        $("#" + buttonBorderWidth.domId).find("a").css({"height": buttonH + "px", "line-height": buttonH + "px"});
        main.resetLayoutDiv(buttonBorderWidth.domId, w, newH);
        linkButton[buttonBorderWidth.domId].buttonBorderWidth = buttonBorderWidth.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonBorderWidth.domId) {
                page[i].style['.linkButton']['border-width'] = buttonBorderWidth.inputValue + 'px';
                break;
            }
        }
    });

    //文字大小
    $("#optionBody").on("blur", "[data-name=fontSize]", function () {
        var _this = $(this);
        var fontSize = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + fontSize.domId).find("a").css("font-size", fontSize.inputValue + "px");
        linkButton[fontSize.domId].fontSize = fontSize.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === fontSize.domId) {
                page[i].style['.linkButton']['font-size'] = fontSize.inputValue + 'px';
                break;
            }
        }
    });

    //描边圆角
    $("#optionBody").on("blur", "[data-name=buttonBorderRadius]", function () {
        var _this = $(this);
        var buttonBorderRadius = new buttonAttr(_this);
        //　操作 存储 导出
        $("#" + buttonBorderRadius.domId).find("a").css("border-radius", buttonBorderRadius.inputValue + "px");
        linkButton[buttonBorderRadius.domId].buttonBorderRadius = buttonBorderRadius.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonBorderRadius.domId) {
                page[i].style['.linkButton']['border-radius'] = buttonBorderRadius.inputValue + 'px';
                break;
            }
        }
    });

    //渐变
    $("#optionBody").on("change", "[data-name=linearGradientStyle]", function () {
        var fromColor = $("#optionBody").find("[data-control='linearGradientFrom']").val();
        var toColor = $("#optionBody").find("[data-control='linearGradientTo']").val();
        var _this = $(this);
        var linearGradientStyle = new buttonAttr(_this);

        // 保存数据
        linkButton[linearGradientStyle.domId].linearGradientStyle = linearGradientStyle.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === linearGradientStyle.domId) {
                if ($(this).val() == 1) {
                    page[i].style['.linkButton'].background = "linear-gradient(" + fromColor + ", " + toColor + ")";
                } else if ($(this).val() == 2) {
                    page[i].style['.linkButton'].background = "linear-gradient(to right, " + fromColor + ", " + toColor + ")";
                } else if ($(this).val() == 3) {
                    page[i].style['.linkButton'].background = "linear-gradient(to bottom right, " + fromColor + ", " + toColor + ")";
                }
                break;
            }
        }
        if (fromColor && toColor) {
            if ($(this).val() == 1) {
                $("#" + linearGradientStyle.domId).find("a").css({"background": "linear-gradient(" + fromColor + ", " + toColor + ")"});
            } else if ($(this).val() == 2) {
                $("#" + linearGradientStyle.domId).find("a").css({"background": "linear-gradient(to right, " + fromColor + ", " + toColor + ")"});
            } else if ($(this).val() == 3) {
                $("#" + linearGradientStyle.domId).find("a").css({"background": "linear-gradient(to bottom right, " + fromColor + ", " + toColor + ")"});
            } else {
                var sHex = $("#optionBody").find("[data-name='buttonFillColor']").val();
                var opacityValue = $("#optionBody").find("[data-name='buttonOpacity']").val() / 100;
                var sRgbColor = sHex.colorRgb(opacityValue);
                $("#" + linearGradientStyle.domId).find("a").css("background", sRgbColor);
            }
        } else {
            return false;
        }
    });
    $("#optionBody").on("blur", "[data-control=linearGradientFrom]", function () {
        var selectValue = $("#optionBody").find("[data-name='linearGradientStyle']").val();
        var toColor = $("#optionBody").find("[data-control='linearGradientTo']").val();
        var _this = $(this);
        var linearGradientFrom = new buttonAttr(_this);

        //　操作 存储 导出
        linkButton[linearGradientFrom.domId].linearGradientFrom = linearGradientFrom.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === linearGradientFrom.domId) {
                if (selectValue == 1) {
                    page[i].style['.linkButton'].background = "linear-gradient(" + linearGradientFrom.inputValue + ", " + toColor + ")";
                } else if (selectValue == 2) {
                    page[i].style['.linkButton'].background = "linear-gradient(to right, " + linearGradientFrom.inputValue + ", " + toColor + ")";
                } else if (selectValue == 3) {
                    page[i].style['.linkButton'].background = "linear-gradient(to bottom right, " + linearGradientFrom.inputValue + ", " + toColor + ")";
                }
                break;
            }
        }
        if (linearGradientFrom.inputValue && toColor) {
            if (selectValue == 1) {
                $("#" + linearGradientFrom.domId).find("a").css({"background": "linear-gradient(" + linearGradientFrom.inputValue + ", " + toColor + ")"});
            } else if (selectValue == 2) {
                $("#" + linearGradientFrom.domId).find("a").css({"background": "linear-gradient(to right, " + linearGradientFrom.inputValue + ", " + toColor + ")"});
            } else if (selectValue == 3) {
                $("#" + linearGradientFrom.domId).find("a").css({"background": "linear-gradient(to bottom right, " + linearGradientFrom.inputValue + ", " + toColor + ")"});
            } else {
                var sHex = $("#optionBody").find("[data-name='buttonFillColor']").val();
                var opacityValue = $("#optionBody").find("[data-name='buttonOpacity']").val() / 100;
                var sRgbColor = sHex.colorRgb(opacityValue);
                $("#" + linearGradientFrom.domId).find("a").css("background", sRgbColor);
            }
        } else {
            return false;
        }
    });
    $("#optionBody").on("blur", "[data-control=linearGradientTo]", function () {
        var selectValue = $("#optionBody").find("[data-name='linearGradientStyle']").val();
        var fromColor = $("#optionBody").find("[data-control='linearGradientFrom']").val();
        console.log(selectValue);
        var _this = $(this);
        var linearGradientTo = new buttonAttr(_this);

        //　操作 存储 导出
        linkButton[linearGradientTo.domId].linearGradientTo = linearGradientTo.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === linearGradientTo.domId) {
                page[i].linearGradientTo = linearGradientTo.inputValue;

                if (page[i].parent === linearGradientTo.domId) {
                    if (selectValue == 1) {
                        page[i].style['.linkButton'].background = "linear-gradient(" + fromColor + ", " + linearGradientTo.inputValue + ")";
                    } else if (selectValue == 2) {
                        page[i].style['.linkButton'].background = "linear-gradient(to right, " + fromColor + ", " + linearGradientTo.inputValue + ")";
                    } else if (selectValue == 3) {
                        page[i].style['.linkButton'].background = "linear-gradient(to bottom right, " + fromColor + ", " + linearGradientTo.inputValue + ")";
                    }
                    break;
                }

                break;
            }
        }
        if (fromColor && linearGradientTo.inputValue) {
            if (selectValue == 1) {
                $("#" + linearGradientTo.domId).find("a").css({"background": "linear-gradient(" + fromColor + ", " + linearGradientTo.inputValue + ")"});
            } else if (selectValue == 2) {
                $("#" + linearGradientTo.domId).find("a").css({"background": "linear-gradient(to right, " + fromColor + ", " + linearGradientTo.inputValue + ")"});
            } else if (selectValue == 3) {
                $("#" + linearGradientTo.domId).find("a").css({"background": "linear-gradient(to bottom right, " + fromColor + ", " + linearGradientTo.inputValue + ")"});
            } else {
                var sHex = $("#optionBody").find("[data-name='buttonFillColor']").val();
                var opacityValue = $("#optionBody").find("[data-name='buttonOpacity']").val() / 100;
                var sRgbColor = sHex.colorRgb(opacityValue);
                $("#" + linearGradientTo.domId).find("a").css("background", sRgbColor);
            }
        } else {
            return false;
        }

    });

    //阴影
    $("#optionBody").on("blur", "[data-control=boxShadowX]", function () {
        var _this = $(this);
        var selectArray = new buttonAttr(_this);
        var boxShadowX = selectArray.inputValue + 'px';
        var boxShadowY = $("#optionBody").find("[data-control='boxShadowY']").val() + 'px';
        var boxShadowR = $("#optionBody").find("[data-name='boxShadow']").val() + 'px';
        var boxShadowColor = $("#optionBody").find("[data-control='boxShadowColor']").val();
        console.log(boxShadowX + '---' + boxShadowY + '---' + boxShadowR + '---' + boxShadowColor);
        //　操作 存储 导出
        linkButton[selectArray.domId].boxShadowX = selectArray.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === selectArray.domId) {
                page[i].style['.linkButton']['box-shadow'] = " " + boxShadowX + "  " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " ";
                break;
            }
        }
        if (selectArray.inputValue && boxShadowY && boxShadowR && boxShadowColor) {
            $("#" + selectArray.domId).find("a").css({"box-shadow": " " + boxShadowX + " " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " "});
        }

    });
    $("#optionBody").on("blur", "[data-control=boxShadowY]", function () {
        var _this = $(this);
        var selectArray = new buttonAttr(_this);
        var boxShadowX = $("#optionBody").find("[data-control='boxShadowX']").val() + 'px';
        var boxShadowY = selectArray.inputValue + 'px';
        var boxShadowR = $("#optionBody").find("[data-name='boxShadow']").val() + 'px';
        var boxShadowColor = $("#optionBody").find("[data-control='boxShadowColor']").val();
        console.log(boxShadowX + '---' + boxShadowY + '---' + boxShadowR + '---' + boxShadowColor);
        //　操作 存储 导出
        linkButton[selectArray.domId].boxShadowY = selectArray.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === selectArray.domId) {
                page[i].style['.linkButton']['box-shadow'] = " " + boxShadowX + "  " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " ";
                break;
            }
        }
        if (boxShadowX && selectArray.inputValue && boxShadowR && boxShadowColor) {
            $("#" + selectArray.domId).find("a").css({"box-shadow": " " + boxShadowX + " " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " "});
        }
    });
    $("#optionBody").on("blur", "[data-control=boxShadowR]", function () {
        var _this = $(this);
        var selectArray = new buttonAttr(_this);
        var boxShadowX = $("#optionBody").find("[data-control='boxShadowX']").val() + 'px';
        var boxShadowY = $("#optionBody").find("[data-control='boxShadowY']").val() + 'px';
        var boxShadowR = selectArray.inputValue + 'px';
        var boxShadowColor = $("#optionBody").find("[data-control='boxShadowColor']").val();
        console.log(boxShadowX + '---' + boxShadowY + '---' + boxShadowR + '---' + boxShadowColor);
        //　操作 存储 导出
        linkButton[selectArray.domId].boxShadowR = selectArray.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === selectArray.domId) {
                page[i].style['.linkButton']['box-shadow'] = " " + boxShadowX + "  " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " ";
                break;
            }
        }
        if (boxShadowX && boxShadowY && selectArray.inputValue && boxShadowColor) {
            $("#" + selectArray.domId).find("a").css({"box-shadow": " " + boxShadowX + " " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " "});
        }
    });
    $("#optionBody").on("blur", "[data-control=boxShadowColor]", function () {
        var _this = $(this);
        var selectArray = new buttonAttr(_this);
        var boxShadowX = $("#optionBody").find("[data-control='boxShadowX']").val() + 'px';
        var boxShadowY = $("#optionBody").find("[data-control='boxShadowY']").val() + 'px';
        var boxShadowR = $("#optionBody").find("[data-name='boxShadow']").val() + 'px';
        var boxShadowColor = selectArray.inputValue;
        console.log(boxShadowX + '---' + boxShadowY + '---' + boxShadowR + '---' + boxShadowColor);
        //　操作 存储 导出
        linkButton[selectArray.domId].boxShadowColor = selectArray.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === selectArray.domId) {
                page[i].style['.linkButton']['box-shadow'] = " " + boxShadowX + "  " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " ";
                break;
            }
        }
        if (boxShadowX && boxShadowY && boxShadowR && selectArray.inputValue) {
            $("#" + selectArray.domId).find("a").css({"box-shadow": " " + boxShadowX + " " + boxShadowY + " " + boxShadowR + " " + boxShadowColor + " "});
        }
    });

    //背景透明
    $("#optionBody").on("input", "[data-control=buttonOpacity]", function () {
        //16进制颜色转化为RGB格式
        var _this = $(this);
        var buttonOpacity = new buttonAttr(_this);
        var opacityValue = buttonOpacity.inputValue / 100;
        var sHex = $("#optionBody").find("[data-name='buttonFillColor']").val();
        var sRgbColor = sHex.colorRgb(opacityValue);
        $("#" + buttonOpacity.domId).find("a").css("background-color", sRgbColor);
        //　操作 存储 导出
        linkButton[buttonOpacity.domId].buttonOpacity = buttonOpacity.inputValue;
        var length = page.length;
        for (var i = 0; i < length; i++) {
            if (page[i].parent === buttonOpacity.domId) {
                page[i].style['.linkButton']['background-color'] = sRgbColor;
                break;
            }
        }
    });


    //是否下载
    $("#optionBody").on("click", "[data-control=isDownloadPage]", function () {
        var linkHtml = $("#" + $(this).data('id')).find('a').text();
        var _that = $(this);
        if ($(this).get(0).checked){
            //取消分享的选项
            $("#" + _that.data('id') + " a").attr("data-isshare","false");
            $("#" + _that.data('id') + " a").attr("data-isDownloadPage","true");
            $("#optionBody").find("[data-control='isShare']").attr('checked', false);
            //再html里面添加是否下载的标记
            for (var i = 0; i < page.length; i++) {
                if (page[i].parent === _that.data('id')) {
                    page[i].isDownloadPage = true;
                    page[i].pageStr = "<a class='linkButton' data-isShare='false' data-isDownloadPage='true'>" + linkHtml + "</a>";
                    break;
                }
            }
        }else{
            $("#" + _that.data('id') + " a").attr("data-isDownloadPage", "false");
            for (var i = 0; i < page.length; i++) {
                if (page[i].parent === _that.data('id')) {
                    page[i].isDownloadPage = false;
                    page[i].pageStr = "<a class='linkButton' data-isShare='false' data-isDownloadPage='false'>" + linkHtml + "</a>";
                    break;
                }
            }
        }
    });

    define(function () {
        var dom = "<a class='up-editor-dom up-editor-button' data-minH = '42' data-isShare='flase' data-isDownloadPage='flase' class='linkButton'> 去银联钱包查看 </a>" +
            '<div class="widgetSelectMask">' +
            '<span class="widgetMaskClose"></span>' +
            '</div>';
        return {
            "options": opt,
            "dom": dom,
            "afterRender": function (id) {
                main.setResize(id, function (id, w, h) {
                    setTimeout(function () {
                        main.layoutOpts[id].width = w;
                        main.layoutOpts[id].height = h;
                    }, 500)
                });
                //默认属性
                linkButton[id] = {
                    buttonText: '去银联钱包查看',
                    buttonLink: 'www.example.com',
                    buttonFillColor: '#7AD80B',
                    buttonBgSrc: null,
                    fontColor: '#fff',
                    buttonBorderColor: '#969696',
                    buttonBorderWidth: '1',
                    buttonBorderRadius: '5',
                    fontSize: '16',
                    buttonHeight: '42',
                    linearGradientStyle: '0',
                    linearGradientFrom: '#fff',
                    linearGradientTo: '#fff',
                    boxShadowX: '0',
                    boxShadowY: '0',
                    boxShadowR: '0',
                    boxShadowColor: '#fff',
                    buttonOpacity: '100',
                    isDownloadPage: false
                };
                // 导出
                var data = {
                    "parent": id,
                    "pageStr": "<a class='linkButton'>去银联钱包查看</a>",
                    "style": {
                        ".linkButton": {
                            "width": "100%",
                            "display": "block",
                            "padding": 0,
                            "outline": "none",
                            "text-align": "center",
                            "text-decoration": "none",
                            //按钮高度
                            "height": "42px",
                            //按钮背景
                            "background-color": "rgb(122, 216, 11)",
                            "background": "",
                            //背景图片
                            "background-image": "",
                            "background-repeat": "no-repeat",
                            "background-size": "100% 100%",
                            //描边圆角
                            "border-radius": "5px",
                            "border": "1px solid #969696",
                            //字体大小
                            "font-size": "16px",
                            "line-height": "42px",
                            //按钮颜色
                            "color": "#fff",
                            //阴影
                            "box-shadow": "0 0 0 #fff"
                        }
                    },
                    "href": "www.example.com"
                };
                page.push(data);
                //调用setSelected保存自定义属性
                main.setSelected(id, function (id) {
                    setTimeout(function () {
                        function readValue(item, text) {
                            if ((item === 'buttonFillColor') || (item === 'fontColor') || (item === 'buttonBorderColor') || (item === 'boxShadowColor') || (item === 'linearGradientFrom') || (item === 'linearGradientTo')) {
                                $("#optionBody").find("[data-control = " + item + " ]").val(text);
                                $("#optionBody").find("[data-control = " + item + " ]").next('span').find('span').css('background-color', text);
                            } else if (item === 'buttonOpacity') {
                                $("#optionBody").find("[data-control = buttonOpacity]").val(text);
                                $("#optionBody").find("[data-control = buttonRange]").val(text);
                            } else {
                                $("#optionBody").find("[data-control = " + item + " ]").val(text);
                            }
                        }

                        //将对应的data-control和对象的值保存到value对象中
                        var value = {
                            'buttonText': linkButton[id].buttonText,
                            'buttonLink': linkButton[id].buttonLink,
                            'buttonFillColor': linkButton[id].buttonFillColor,
                            'buttonBgSrc': '',
                            'fontColor': linkButton[id].fontColor,
                            'buttonBorderColor': linkButton[id].buttonBorderColor,
                            'buttonHeight': linkButton[id].buttonHeight,
                            'buttonBorderWidth': linkButton[id].buttonBorderWidth,
                            'buttonBorderRadius': linkButton[id].buttonBorderRadius,
                            'fontSize': linkButton[id].fontSize,
                            'linearGradientStyle': linkButton[id].linearGradientStyle,
                            'linearGradientFrom': linkButton[id].linearGradientFrom,
                            'linearGradientTo': linkButton[id].linearGradientTo,
                            'boxShadowX': linkButton[id].boxShadowX,
                            'boxShadowY': linkButton[id].boxShadowY,
                            'boxShadowR': linkButton[id].boxShadowR,
                            'boxShadowColor': linkButton[id].boxShadowColor,
                            'buttonOpacity': linkButton[id].buttonOpacity,
                        };

                        console.log(value);

                        //是否分享特别处理
                        if ($("#" + id + " a").attr("data-isshare") == "true") {
                            $("#optionBody").find("[data-control='isShare']").attr('checked', true);
                        }else if($("#" + id + " a").attr("data-isdownloadpage") == "true"){
                            $("#optionBody").find("[data-control='isDownloadPage']").attr('checked', true);
                        }

                        for (var item in value) {
                            readValue(item, value[item]);
                        }


                    }, 300);
                })
            }
        }
    });
})(window.Zepto || window.jQuery, window.UP = window.UP || {});