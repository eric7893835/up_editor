(function ($, UP) {
// 'use strict';
    var ui = window.UP.W.Ui;
    UP.W = UP.W || {};
    UP.W.Main = UP.W.Main || {};
    var main = UP.W.Main;
    var page = window.UP.Editor.page;
    var _dragToLayout;
    require(["moduleFuc"], function (dragToLayout) {
        _dragToLayout = dragToLayout;
    });
    main.layObj = {};

    main.domId = main.domId || 0;
    main.domNum = main.domNum || 0;
    var leftConfig = window.UP.W.temp;
//=========================拖拽开始==================================
    var offsetPositionX = 0;
    var offsetPositionY = 0;
    var sum = 0, flag = false;
    var insideArea = false;
    var startDrag = false;
    main.richTextId = null;
    var arrImg = [
        '<img src="../../module/blank/icon.png">',
        '<img src="../../module/image/icon.png">',
        '<img src="../../module/richText/icon.png">',
        '<img src="../../module/linkButton/icon.png">',
        // '<img src="../../module/shape/icon.png">',
        '<img src="../../module/qrCode/icon.png">'
    ];
    createDragItem(0);
    createDragItem(1);
    createDragItem(2);
    createDragItem(3);
    createDragItem(4);
    //创建左边可拖动的元素
    function createDragItem(i){
        var dragEL = $('#left p').eq(i);
        if (i > 0) {
            sum++;
            if (sum > 2) {
                flag = true;
            }
            if (!flag) {
                offsetPositionX = offsetPositionX + 100;
            }
        }
        if (i > 2) {
            offsetPositionY = 126;
            if (i === 3) {
                offsetPositionX = 0;
                offsetPositionY = 126;
            }
            if (i === 4) {
                offsetPositionX = 100;
                offsetPositionY = 126;
            }
        }
        var dragDiv = document.createElement("div");
        dragDiv.style.position = "fixed";
        dragDiv.style.width = "100px";
        dragDiv.style.height = "90px";
        dragDiv.style.left = offsetPositionX + "px";
        dragDiv.style.top = 26 + offsetPositionY + 12 + "px";
        dragDiv.style.zIndex = 100001;
        dragDiv.className = "dragDiv";

        dragDiv.dataset.nm = leftConfig[i].name;
        dragEL.append(dragDiv);
        dragEL.find('.dragDiv').myDrag({
            parent: 'body',
            direction: 'all',
            dragStart: function (x, y, el, nm) {
                startDrag = true;
                $(el).html(arrImg[i]);
                $(el).css('opacity', 0.5);
            },
            dragEnd: function (x, y, el, nm) {
                setTimeout(function () {
                    if (insideArea) {
                        if (typeof _dragToLayout[nm] === 'function') {
                            _dragToLayout[nm](main);
                        }
                    }
                }, 100);
            }
        });
    }
    // $("#left p").each(function (i, item) {
    //     if (i > 0) {
    //         sum++;
    //         if (sum > 2) {
    //             flag = true;
    //         }
    //         if (!flag) {
    //             offsetPositionX = offsetPositionX + 100;
    //         }
    //     }
    //
    //     if (i > 2) {
    //         offsetPositionY = 126;
    //         if (i === 3) {
    //             offsetPositionX = 0;
    //             offsetPositionY = 126;
    //         }
    //         if (i === 4) {
    //             offsetPositionX = 100;
    //             offsetPositionY = 126;
    //         }
    //     }
    //     var dragDiv = document.createElement("div");
    //     dragDiv.style.position = "fixed";
    //     dragDiv.style.width = "100px";
    //     dragDiv.style.height = "90px";
    //     dragDiv.style.left = offsetPositionX + "px";
    //     dragDiv.style.top = 26 + offsetPositionY + 12 + "px";
    //     dragDiv.style.zIndex = 100001;
    //     dragDiv.className = "dragDiv";
    //
    //     dragDiv.dataset.nm = leftConfig[i].name;
    //     $(this).append(dragDiv);
    //     $(this).find('.dragDiv').myDrag({
    //         parent: 'body',
    //         direction: 'all',
    //         dragStart: function (x, y, el, nm) {
    //             startDrag = true;
    //             $(el).html(arrImg[i]);
    //             $(el).css('opacity', 0.5);
    //         },
    //         dragEnd: function (x, y, el, nm) {
    //             setTimeout(function () {
    //                 if (insideArea) {
    //                     if (typeof _dragToLayout[nm] === 'function') {
    //                         _dragToLayout[nm](main);
    //                     }
    //                 }
    //             }, 100);
    //         }
    //     });
    // });
    $(document.body).on('mouseover', '#deviceBox', function () {
        insideArea = true;
    });
    $(document.body).on('mouseout', '#deviceBox', function () {
        insideArea = false;
    });

    //存背景色
    main.bgColor = {};
    var bgId = 0;
    //改变device背景色
    $("#changeInput").on('click', function () {
        main.addCl();
        main.setOpt(main.opt);
        main.setBg();
        if (!main.bgColor.colorVal) {
            $("#optionBody [data-name='backgroundColor']").next('span').find('span').css({
                'background-color': '#ffffff'
            });
            $("#optionBody [data-name='backgroundColor']").val('#ffffff');
        } else {
            $("#optionBody [data-name='backgroundColor']").next('span').find('span').css({
                'background-color': main.bgColor.colorVal
            });
            page[0].style['#makedir']['background-color']  = main.bgColor.colorVal;
            $("#optionBody [data-name='backgroundColor']").val(main.bgColor.colorVal);
        }
        $("#optionBody [data-name='backgroundColor']").removeAttr('disabled');
        $('#device > div').find('.widgetSelectMask').css('display', 'none');
        $(".minicolors").find('input').on('input', function () {
            var deviceDom = $("#layoutBody #deviceBox");
            var _colorVal = $(this).val();
            main.bgColor.colorVal = _colorVal;
            deviceDom.css("background-color", $(this).val());
            page[0].style['#makedir']['background-color'] = main.bgColor.colorVal;//将值赋给0号位
        });
    });

    //清空背景图片
    $("#optionBody").on("click", "#delBg", function () {
        $("#deviceBox").css({
            "background-image": 'none'
        });
        page[0].style['#makedir']['background-image'] = 'none';
        page[0].style['#makedir']['src'] = '';
    });

    //获取拼接html
    main.getHtml = function(id,startStr){
        var _html = '';
        var createExportDiv = document.createElement('div');
        createExportDiv.id = id;
        var layDom = createExportDiv.outerHTML;//将dom对象转换位html str
        var domId = "#"+id;
        main.layObj[domId] = layDom;
        for(var k in main.layObj){
            _html += main.layObj[k];
        }
        startStr = startStr.concat(_html);
        var endStr = '</body></html>';
        startStr = startStr.concat(endStr);
        page[0].pageStr = startStr;
    };

    //为device赋背景
    function showPreview(source) {
        var file = source;
        if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
        } else if (window.FileReader) {
            var fr = new FileReader();
            fr.onloadend = function (e) {
                $("#deviceBox").css({
                    "background-image": 'url(' + e.target.result + ')',
                    "background-repeat": "no-repeat",
                    "background-size": "100% 100%"
                });

                page[0].style['#makedir']['background-image'] = 'url(\'../image/bg.png\')';
                page[0].src = e.target.result;
            };
            fr.readAsDataURL(file);
        }
    }

    //device选择背景图片
    $("#optionBody").on("click", "[data-name=bgsrc]", function () {
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
                showPreview(file);
            });
        });
    });
    //方向背景平铺
    $("#optionBody").on("change", "[data-name=bgSet]", function () {
        var $curv;
        var bili = '100% 100%';
        $curv = $(this).val();
        $("#deviceBox").attr('data-rp', $curv);
        if ($curv === bili) {
            $("#deviceBox").css({
                "background-size": '100% 100%'
            });
            page[0].style['#makedir']['background-size'] = '100% 100%';
            $("#deviceBox").css({
                "background-repeat": 'no-repeat'
            });
            page[0].style['#makedir']['background-repeat'] = 'no-repeat';
        } else {
            $("#deviceBox").css({
                "background-size": 'auto'
            });
            page[0].style['#makedir']['background-size'] = 'auto';
            $("#deviceBox").css({
                "background-repeat": 'repeat'
            });
            page[0].style['#makedir']['background-repeat'] = 'repeat';
        }
    });


    //初始化layout的个数
    initpage();

    //初始化layout的个数
    function initpage() {
        $("#projectAmount").text(main.domNum);
    }
    //设置layout的css样式及属性值
    main.setLayoutCss = function (id, curdom) {
        var _thisVal,
            currWidth,
            currHeight,
            currOpacity,
            curDeg = 0,
            $thisValW,
            $thisValH,
            imgDomHeight,
            eleId;

        currWidth = $(curdom).width();
        currHeight = $(curdom).find('[data-minH]').attr('data-minH');
        eleId = id.slice(0, 5);
        if (eleId === 'image') {//image 作特殊处理
            setTimeout(function () {
                imgDomHeight = $(curdom).find('.up-editor-image').height();
                main.layoutOpts[id].imgHeight = imgDomHeight;
                $("#changeHeight").val(main.layoutOpts[id].imgHeight);
                $(curdom).find(".widgetSelectMask").css({
                    'height': main.layoutOpts[id].imgHeight//必须要改的高度
                });
            }, 50);
        }
        $(curdom).css({
            'height': currHeight + 'px'
        });
        currOpacity = $(curdom).attr('data-op');
        main.layoutOpts[id] = {
            width: currWidth,
            height: currHeight,
            opacity: currOpacity,
            rotateDeg: curDeg,
            wselValue: '自动',
            hselValue: '自动',
            defaultrelative: '默认定位',
            positionValX: 0,
            positionValY: 0,
            zindexVal: 1
        };

        $("#changeWidth").val(main.layoutOpts[id].width);
        $("#changeHeight").val(main.layoutOpts[id].height);
        $("#showVal").val(main.layoutOpts[id].opacity);
        $("#changeOpacity").val(main.layoutOpts[id].opacity);
        $("#showDeg").val(main.layoutOpts[id].rotateDeg);

        $("#selWidth").val(main.layoutOpts[id].wselValue);
        $("#selHeight").val(main.layoutOpts[id].hselValue);
        $("#changeX").val(main.layoutOpts[id].positionValX);
        $("#changeY").val(main.layoutOpts[id].positionValY);


        //层叠
        $(".publicAttr [data-zindex = " + id + "]").on('input', function () {
            if ($(curdom).hasClass('active') && $("#changeZindex").attr('data-zindex') === id) {
                _thisVal = $(this).val();
                $(curdom).css({
                    'z-index': _thisVal
                });
                main.layoutOpts[id].zindexVal = _thisVal;
                page[0].style['#'+id]['z-index'] = _thisVal;

            }
        });

        //x
        $(".publicAttr [data-x = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#changeX").attr('data-x') === id) {
                _thisVal = $(this).val();
                $(curdom).css({
                    'left': _thisVal + 'px'
                });
                main.layoutOpts[id].positionValX = _thisVal;
                page[0].style['#'+id].left = _thisVal+'px';
            }
        });
        //y
        $(".publicAttr [data-y = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#changeY").attr('data-y') === id) {
                _thisVal = $(this).val();
                $(curdom).css({
                    'top': _thisVal + 'px'
                });

                main.layoutOpts[id].positionValY = _thisVal;
                page[0].style['#'+id].top = _thisVal+'px';

            }
        });


        //旋转
        $(".publicAttr [data-rotate = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#changeDeg").attr('data-rotate') === id) {
                _thisVal = $(this).val();
                $(curdom).css({
                    '-webkit-transform-origin': 'center center',
                    'transform': 'rotate(' + _thisVal + 'deg)'
                });
                main.layoutOpts[id].rotateDeg = _thisVal;

                page[0].style['#'+id].transform = 'rotate('+ _thisVal +'deg)';


            }
        });

        $(".publicAttr [data-deg = " + id + "]").on('input', function () {
            if ($(curdom).hasClass('active') && $("#showDeg").attr('data-deg') === id) {
                _thisVal = $(this).val();
                $("#changeDeg").val(_thisVal);
                $(curdom).css({
                    '-webkit-transform-origin': 'center center',
                    'transform': 'rotate(' + _thisVal + 'deg)'
                });
                main.layoutOpts[id].rotateDeg = _thisVal;
            }
        });

        //透明度
        $(".publicAttr [data-opacity = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#changeOpacity").attr('data-opacity') === id) {
                _thisVal = $(this).val();
                $(curdom).attr('data-op', _thisVal);
                $(curdom).css({
                    'opacity': _thisVal / 100
                });
                main.layoutOpts[id].opacity = _thisVal;

                page[0].style['#'+id].opacity = _thisVal / 100;
            }
        });
        $(".publicAttr [data-v = " + id + "]").on('input', function (e) {
            if ($(curdom).hasClass('active') && $("#showVal").attr('data-v') === id) {
                _thisVal = $(this).val();
                $("#changeOpacity").val(_thisVal);
                $(curdom).css({
                    'opacity': _thisVal / 100
                });
            }
        });

        //select width
        $(".publicAttr [data-selW = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#selWidth").attr('data-selW') === id) {
                $thisValW = $(this).val();
                if ($(this).val() === '手动') {
                    $(".publicAttr [data-W = " + id + "]").attr('disabled', false);
                    main.layoutOpts[id].wselValue = $thisValW;
                } else {
                    $(".publicAttr [data-W = " + id + "]").attr('disabled', true);
                    main.layoutOpts[id].wselValue = $thisValW;
                }
            }
        });

        //selHeight
        $(".publicAttr [data-selH = " + id + "]").on('change', function () {
            if ($(curdom).hasClass('active') && $("#selHeight").attr('data-selH') === id) {
                $thisValH = $(this).val();
                if ($(this).val() === '手动') {
                    $(".publicAttr [data-H = " + id + "]").attr('disabled', false);
                    main.layoutOpts[id].hselValue = $thisValH;
                } else {
                    $(".publicAttr [data-H = " + id + "]").attr('disabled', true);
                    main.layoutOpts[id].hselValue = $thisValH;
                }
            }
        });


        //宽度
        $(".publicAttr [data-W = " + id + "]").on('blur', function () {
            if ($(curdom).hasClass('active') && $("#changeWidth").attr('data-W') === id) {
                _thisVal = $(this).val();
                if (parseFloat(_thisVal) > 375) {
                    _thisVal = 375;
                }
                $(curdom).css({
                    'width': _thisVal + 'px'
                });
                $("#changeWidth").val(_thisVal);
                if (main._resize[id]) {
                    main._resize[id](id, _thisVal, parseFloat($(curdom).css('height')), true);
                }

                main.layoutOpts[id].width = _thisVal;

                var _imageH = $("#" + id).find('.up-editor-image').height();//获取图片的高度
                main.layoutOpts[id].height = _imageH;
                $("#" + id).find(".widgetSelectMask").css({
                    'height': main.layoutOpts[id].height
                });
                page[0].style['#'+id].width = _thisVal+'px';
            }
        });
        //高度
        $(".publicAttr [data-H = " + id + "]").on('blur', function (e) {
            if ($(curdom).hasClass('active') && $("#changeHeight").attr('data-H') === id) {
                _thisVal = $(this).val();
                $(curdom).css({
                    'height': _thisVal + 'px'
                });
                if (main.layoutOpts[id]) {
                    main._resize[id](id, parseFloat($(curdom).css('width')), _thisVal, false);
                }
                main.layoutOpts[id].height = _thisVal;
                $("#" + id).find('.up-editor-image').height(_thisVal);//必须要改图片的高度
                $("#" + id).find(".widgetSelectMask").css({
                    'height': main.layoutOpts[id].height
                });
                 page[0].style['#'+id].height = _thisVal+'px';
            }
        });
    };
    //设置当前选中标记状态
    main.findLast = function () {
        $("#device > div").find('.widgetSelectMask').css('display', 'none');
        $("#device > div:last").find('.widgetSelectMask').css('display', 'block');
        $("#device > div").removeClass('active');
        $("#device > div:last").addClass('active');
    };
    //移除隐藏类
    main.removeCl = function () {
        $('.publicAttr').removeClass('initDn');
    };
    //添加隐藏类
    main.addCl = function () {
        $('.publicAttr').addClass('initDn');
    };
    //创建layout元素对象
    main.createDiv = function () {
        var obj = {
            layoutDiv: null
        };
        obj.layoutDiv = document.createElement('div');
        obj.layoutDiv.style.width = '375px';
        obj.layoutDiv.style.position = 'absolute';
        obj.layoutDiv.style.top = '0px';
        obj.layoutDiv.style.left = '0px';
        obj.layoutDiv.dataset.op = '100';
        return obj;
    };
    //设置自定义属性
    main.setAttr = function (id) {
        $("#changeZindex").attr('data-zindex', id);//层叠
        $("#changeX").attr('data-x', id);//x
        $("#changeY").attr('data-y', id);//y
        $("#changeWidth").attr('disabled', true);
        $("#changeHeight").attr('disabled', true);
        $("#selWidth").attr('data-selW', id);//select width
        $("#selHeight").attr('data-selH', id);//select height
        $("#changeWidth").attr('data-W', id);//宽
        $("#changeHeight").attr('data-H', id);//高
        $("#changeOpacity").attr('data-opacity', id);//透明度
        $("#showVal").attr('data-v', id);//透明度的value
        $("#changeDeg").attr('data-rotate', id);//旋转
        $("#showDeg").attr('data-deg', id);//旋转的角度value
    };
    //设置属性值
    main.setAttrVal = function (id) {
        $("#changeX").val(main.layoutOpts[id].positionValX);
        $("#changeY").val(main.layoutOpts[id].positionValY);
        $("#changeWidth").val(main.layoutOpts[id].width);
        var imgh = id.slice(0, 5);
        if (imgh === 'image') {
            $("#changeHeight").val(main.layoutOpts[id].imgHeight);
        }
        $("#changeHeight").val(main.layoutOpts[id].height);
        $("#showVal").val(main.layoutOpts[id].opacity);
        $("#changeOpacity").val(main.layoutOpts[id].opacity);
        $("#showDeg").val(main.layoutOpts[id].rotateDeg);
        $("#changeDeg").val(main.layoutOpts[id].rotateDeg);
        $("#selWidth").val(main.layoutOpts[id].wselValue);
        $("#selHeight").val(main.layoutOpts[id].hselValue);
        $("#changeZindex").val(main.layoutOpts[id].zindexVal);
    };
    //判断input是否disabled
    main.setdisabled = function (id) {
        if ($("#selWidth").val() === '自动') {
            $(".publicAttr [data-W = " + id + "]").attr('disabled', true);
        } else {
            $(".publicAttr [data-W = " + id + "]").attr('disabled', false);
        }

        if ($("#selHeight").val() === '自动') {
            $(".publicAttr [data-H = " + id + "]").attr('disabled', true);
        } else {
            $(".publicAttr [data-H = " + id + "]").attr('disabled', false);
        }
    };

    //拖拽元素进layout方向键控制
    main.setKey = function (id, e) {
        if ($('#' + id).hasClass('active')) {
            var _layH;
            var _el = $('#' + id);
            var _elW = _el.width();
            var _elH = _el.height();
            _layH = $("#device").height();
            //控制layout x的移动
            if (document.activeElement.tagName !== 'INPUT') {
                if (e.keyCode === '37') {//左键
                    main.layoutOpts[id].positionValX = main.layoutOpts[id].positionValX - 5;
                    if (main.layoutOpts[id].positionValX < 0) {//限定左方向范围
                        main.layoutOpts[id].positionValX = 0;
                    }
                    _el.css({
                        'left': main.layoutOpts[id].positionValX + 'px'
                    });
                    $(".publicAttr [data-x = " + id + "]").val(main.layoutOpts[id].positionValX);
                }
                if (e.keyCode === '39') {//右键
                    main.layoutOpts[id].positionValX = main.layoutOpts[id].positionValX + 5;
                    if (_elW >= '375') {//限定右方向范围
                        if (main.layoutOpts[id].positionValX > 0) {
                            main.layoutOpts[id].positionValX = 0;
                        }
                    } else {//宽度改变的情况下
                        if (main.layoutOpts[id].positionValX > (375 - _elW)) {
                            main.layoutOpts[id].positionValX = 375 - _elW;
                        }
                    }
                    _el.css({
                        'left': main.layoutOpts[id].positionValX + 'px'
                    });
                    $(".publicAttr [data-x = " + id + "]").val(main.layoutOpts[id].positionValX);
                }

                //控制layout y的移动
                if (e.keyCode === '38') {//上键
                    main.layoutOpts[id].positionValY = main.layoutOpts[id].positionValY - 5;
                    if (main.layoutOpts[id].positionValY < 0) {//限定上方向范围
                        main.layoutOpts[id].positionValY = 0;
                    }
                    _el.css({
                        'top': main.layoutOpts[id].positionValY + 'px'
                    });
                    $(".publicAttr [data-y = " + id + "]").val(main.layoutOpts[id].positionValY);
                }
                if (e.keyCode === '40') {//下键
                    main.layoutOpts[id].positionValY = main.layoutOpts[id].positionValY + 5;
                    if (main.layoutOpts[id].positionValY > (_layH - _elH)) {//限定下方向范围
                        main.layoutOpts[id].positionValY = _layH - _elH;

                        _layH = _layH + _elH;//超过最大限制就让device高度增加
                        $("#device").height(_layH);
                    }

                    _el.css({
                        'top': main.layoutOpts[id].positionValY + 'px'
                    });
                    $(".publicAttr [data-y = " + id + "]").val(main.layoutOpts[id].positionValY);
                }
            }
            page[0].style['#'+id].top = main.layoutOpts[id].positionValY + 'px';
            page[0].style['#'+id].left = main.layoutOpts[id].positionValX + 'px';
        }
    };
    //拖拽元素进layout改变x,y坐标
    main.dragxy = function (id) {
        var _x1, _y1, _top, _left, _laywidth, _layheight, deviceHeight, movex, movey, mEleWidth, mEleHeight,
            _flags = true,_deviceH;
        $('body').on('mousedown','#' + id+' .widgetSelectMask', function (e) {
            if (e.type === 'mousedown') {
                _flags = true;
                mEleWidth = $(this).parent().width();//获取移动原始的宽度
                mEleHeight = $(this).parent().height();//获取移动元素的高度
                deviceHeight = $("#device").height();//获取device的高度
                _laywidth = $(this).parent().width();//获取layout的宽度
                _layheight = $(this).parent().height();//获取layout高度
                _top = $("#device").offset().top;//获取device基于页面顶部的位置
                _left = $("#device").offset().left;//获取device基于页面左边的位置
                $('body').on('mousemove',"#deviceBox", function (e) {
                    if (_flags) {
                        _x1 = e.pageX;
                        _y1 = e.pageY;
                        movex = _x1 - _left - (mEleWidth / 2);//让鼠标指针在宽度中间
                        movey = _y1 - _top - (mEleHeight / 2);//让鼠标指针在高度中间
                        if (movex < 0) {//x坐标最小值限定
                            movex = 0;
                        }
                        if (mEleWidth >= 375) {
                            if (movex > 0) {//x坐标最大值限定
                                movex = 0;
                            }
                        } else {
                            if (movex > (_laywidth - mEleWidth) + (375 - mEleWidth)) {
                                movex = (_laywidth - mEleWidth) + (375 - mEleWidth);
                            }
                        }
                        if (movey < _top) {//y坐标最小值限定
                            movey = 0;
                        }
                        if (movey > (deviceHeight - mEleHeight)) {//y坐标最大值限定
                            movey = deviceHeight-mEleHeight;
                            deviceHeight = deviceHeight + mEleHeight;//超过最大限制就让device高度增加
                            $("#device").height(deviceHeight);
                        }
                        $('#' + id).css({
                            'left': movex + 'px',
                            'top': movey + 'px'
                        });
                        main.layoutOpts[id].positionValX = movex;
                        main.layoutOpts[id].positionValY = movey;
                        $("#changeX").val(main.layoutOpts[id].positionValX);
                        $("#changeY").val(main.layoutOpts[id].positionValY);


                        page[0].style['#'+id].top = movey+'px';
                        page[0].style['#'+id].left = movex+'px';
                    }
                });

                $(document).on('mouseup', function () {
                    _flags = false;
                });

            }
        });

    };

    //点击删除按钮移除page中相应的对象
    main.restDomObj = function(id,startStr){
        for (var k in main.layObj) {//这是删除对应的dom对象
            if (k === '#' + id) {
                delete  main.layObj[k];
            }
        }

        for (var i in page[0].style) {//删除对应dom的样式
            if (i === '#' + id) {
                delete  page[0].style[i];
            }
        }


        var length = page.length;
        for (var i = 0; i < length; i++) {//删除page中子对象对应的obj
            if (page[i].parent === id) {
                page.splice(i,1);
                break;
            }
        }

        var $html = '';

        for (var v in main.layObj) {//这是拼接dom对象
            $html += main.layObj[v];
        }
        startStr = startStr.concat($html);
        var endStr = '</body></html>';
        startStr = startStr.concat(endStr);
        page[0].pageStr = startStr;
    };

    //bgColor Pannel
    main.setBg = function () {
        $('.demo').minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            opacity: $(this).attr('data-opacity'),
            position: $(this).attr('data-position') || 'bottom left',
            change: function (hex, opacity) {
                if (!hex){
                    return;
                }
                if (opacity){
                    hex += ', ' + opacity;
                }
            },
            theme: 'bootstrap'
        });

        $(".minicolors").css(
            {
                'width': '200px',
                'display': 'inline-block',
                'margin-left': '5px'
            }
        );

        $(".minicolors").find('input').css({
            'width': '100%',
            'padding-left': '35px'
        });
    };
    //色板调用
    main.setBg();
    //设置宽高的监听的变化
    main.setResize = function (id, callback) {
        main._resize = main._resize || {};
        main._resize[id] = function (id, width, height, isWidth) {
            try {
                callback(id, width, height, isWidth);
            } catch (e) {
            }
        };
    };
    //设置选中后显示保存的属性值
    main.setSelected = function (id, callback) {
        main._selected = main._selected || {};
        main._selected[id] = function (id) {
            try {
                callback(id);
            } catch (e) {
            }
        };
    };
    //重置layout的宽高
    main.resetLayoutDiv = function (id, w, h) {
        var _el = $('#' + id);
        main.layoutOpts[id].width = w;
        main.layoutOpts[id].height = h;
        $(".publicAttr  [data-W = " + id + "]").val(main.layoutOpts[id].width);
        $(".publicAttr  [data-H = " + id + "]").val(main.layoutOpts[id].height);
        _el.css({
            width: w,
            height: h
        });
        _el.find('.widgetSelectMask').css({
            width: w,
            height: h
        });
    };


})(window.Zepto || window.jQuery, window.UP = window.UP || {});