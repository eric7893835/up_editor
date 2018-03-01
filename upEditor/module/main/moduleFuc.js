define(function () {
    UP.W.Main = UP.W.Main || {};
    var main = UP.W.Main;
    var page = window.UP.Editor.page;
    var str = page[0].pageStr;
    var startStr = str.substring(0, str.indexOf('</body>'));//截取文档结构上半部分
    var dragToLayout = {
        //占位
        blank: function (main) {
            var domObj = main.createDiv();
            require(['blank'], function (data) {
                addDom = $(data.dom);
                var id = 'blank' + "_" + (++main.domId);//layout创建唯一id
                domObj.layoutDiv.id = id;
                domObj.layoutDiv = $('#' + domObj.layoutDiv.id);

                main.getHtml(id, startStr);//获取拼接html结构

                var _Id = '#' + id;
                var _layId = {};
                _layId[_Id] = {
                    "width": "375px",
                    "height": "60px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "opacity": "1",
                    "z-index": "0",
                    "transform": "rotate(0deg)"
                };

                page[0].style[_Id] = _layId[_Id];

                domObj.layoutDiv.append(addDom);
                //拖拽layout改变x,y坐标
                main.dragxy(id);
                try {
                    data.afterRender(id);//监听layout宽高值得变化
                    console.log('bind success');
                } catch (e) {
                    console.log(e);
                }
                main.setAttr(id);//设置自定义属性
                main.findLast();//找最后一个layout添加当前选中标记
                main.layoutOpts[id] = {};//存储layouy属性值


                var lastdom = $("#device > div:last");
                main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件
                //控制方向键
                $(document).on('keydown', function (e) {
                    main.setKey(id, e);
                });

                $('#' + id).find('.widgetMaskClose').on("click", function () {
                    $(this).parent().parent().remove();
                    main.domNum--;
                    $("#projectAmount").text(main.domNum);
                    main.addCl();
                    main.setOpt(main.opt);//渲染公共背景色
                    main.setBg();


                    main.restDomObj(id,startStr);//重新渲染page数组

                })


                main.setOpt(data.options, id);//渲染dom

                main.setBg();//调用色板
                $('#' + id).on('click', function () {
                    $('#device > div').find('.widgetSelectMask').css('display', 'none');
                    $(this).find('.widgetSelectMask').css('display', 'block');
                    $(this).addClass('active').siblings('div').removeClass('active');
                    var curId = $(this).attr('id');
                    console.log('分割线-----------------------------aaa');
                    console.log(cur);
                    main.setAttr(id);//设置自定义属性
                    main.setAttrVal(id);//设置属性值
                    id = curId;
                    if (main._selected[curId]) {
                        main._selected[curId](curId);//选中状态时将属性值存起来
                    }
                    main.setOpt(data.options, id);//渲染dom
                    main.setBg();//调用色板

                    main.setdisabled(id);//设置input选中状态和未选中状态
                    main.removeCl();//移除隐藏类
                });
                main.removeCl();//移除隐藏类
            });

            $("#device").append(domObj.layoutDiv);

            main.domNum++;
            $("#projectAmount").text(main.domNum);

        },

        //图片
        image: function (main) {
            var domObj = main.createDiv();
            require(['image'], function (data) {
                addDom = $(data.dom);
                var id = 'image' + "_" + (++main.domId);//创建唯一id
                domObj.layoutDiv.id = id;
                domObj.layoutDiv = $('#' + domObj.layoutDiv.id);

                main.getHtml(id, startStr);//获取拼接html结构

                var _Id = '#' + id;
                var _layId = {};
                _layId[_Id] = {
                    "width": "375px",
                    "height": "60px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "opacity": "1",
                    "z-index": "0",
                    "transform": "rotate(0deg)"
                };

                page[0].style[_Id] = _layId[_Id];

                domObj.layoutDiv.append(addDom);
                //拖拽ayout改变x,y坐标
                main.dragxy(id);
                try {
                    data.afterRender(id);//监听layout宽高值得变化
                } catch (e) {

                }
                main.setAttr(id);//设置自定义属性
                main.findLast();//找最后一个layout添加当前选中标记
                var lastdom = $("#device > div:last");
                main.layoutOpts[id] = {};//存储layouy属性值
                main.layoutOpts[id].width = 375;
                main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件
                //控制方向键
                $(document).on('keydown', function (e) {
                    main.setKey(id, e);
                });


                $('#' + id).find('.widgetMaskClose').on("click", function () {
                    $(this).parent().parent().remove();
                    main.domNum--;
                    $("#projectAmount").text(main.domNum);
                    main.addCl();
                    main.setOpt(main.opt);//渲染公共背景属性
                    main.setBg();


                    main.restDomObj(id,startStr);//重新渲染page数组
                })

                main.setOpt(data.options, id);//渲染dom

                $('#' + id).on('click', function () {
                    $('#device > div').find('.widgetSelectMask').css('display', 'none');
                    $(this).find('.widgetSelectMask').css('display', 'block');
                    $(this).addClass('active').siblings('div').removeClass('active');
                    var curId = $(this).attr('id');
                    main.setAttr(id);//设置自定义属性
                    main.setAttrVal(id);//设置属性值

                    var _imgh = id.slice(0, 5);
                    if (_imgh === 'image') {
                        setTimeout(function () {
                            var _imgDomHeight = $("#" + id).find('.up-editor-image').height();//必须要get高度
                            main.layoutOpts[id].imgHeight = _imgDomHeight;
                            $("#changeHeight").val(main.layoutOpts[id].imgHeight);
                            $("#" + id).find(".widgetSelectMask").css({
                                'height': main.layoutOpts[id].imgHeight
                            });
                        }, 50);
                    }
                    if (main._selected[curId]) {
                        main._selected[curId](curId);//选中状态时将属性值存起来
                    }
                    id = curId;
                    main.setOpt(data.options, id);//渲染dom
                    main.setdisabled(id);//设置input选中状态和未选中状态
                    main.removeCl();//移除隐藏类
                });

                main.removeCl();
            });

            $("#device").append(domObj.layoutDiv);
            main.domNum++;
            $("#projectAmount").text(main.domNum);
        },

        //富文本
        richText: function (main) {
            var domObj = main.createDiv();
            require(['richText'], function (data) {
                addDom = $(data.dom);
                var id = 'richText' + "_" + (++main.domId);
                domObj.layoutDiv.id = id;
                domObj.layoutDiv.style.position = "relative";
                domObj.layoutDiv = $('#' + domObj.layoutDiv.id);

                main.getHtml(id, startStr);//获取拼接html结构

                var _Id = '#' + id;
                var _layId = {};
                _layId[_Id] = {
                    "width": "375px",
                    "height": "60px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "opacity": "1",
                    "z-index": "0",
                    "transform": "rotate(0deg)"
                };

                page[0].style[_Id] = _layId[_Id];

                domObj.layoutDiv.append(addDom);
                //拖拽layout改变x,y坐标
                main.dragxy(id);
                try {
                    data.afterRender(id);//监听宽高的变化
                } catch (e) {
                }
                main.setAttr(id);//设置自定义属性
                main.findLast();//找最后一个layout添加当前选中标记
                var lastdom = $("#device > div:last");
                main.layoutOpts[id] = {};//存储layouy属性值
                main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件
                //控制方向键
                $(document).on('keydown', function (e) {
                    main.setKey(id, e);
                });


                $('#' + id).find('.widgetMaskClose').on("click", function () {
                    $(this).parent().parent().remove();
                    main.domNum--;
                    $("#projectAmount").text(main.domNum);
                    main.addCl();
                    main.setOpt(main.opt);//渲染公共背景色
                    main.setBg();

                    main.restDomObj(id,startStr);//重新渲染page数组
                });

                main.setOpt(data.options, id);//渲染dom
                $('#' + id).on('click', function () {
                    $('#device > div').find('.widgetSelectMask').css('display', 'none');
                    $(this).find('.widgetSelectMask').css('display', 'block');
                    $(this).addClass('active').siblings('div').removeClass('active');
                    var curId = $(this).attr('id');
                    main.setAttr(id);//设置自定义属性
                    main.setAttrVal(id);//设置属性值
                    id = curId;
                    if (main._selected[curId]) {
                        main._selected[curId](curId);//选中状态时将属性值存起来
                    }
                    main.setOpt(data.options, id);//渲染dom
                    main.setdisabled(id);//设置input选中状态和未选中状态
                    main.removeCl();//移除隐藏类
                });
                main.removeCl();//移除隐藏类
            });

            $("#device").append(domObj.layoutDiv);
            main.domNum++;
            $("#projectAmount").text(main.domNum);

        },

        //链接按钮
        linkButton: function (main) {
            var domObj = main.createDiv();
            require(['linkButton'], function (data) {
                addDom = $(data.dom);
                var id = 'linkButton' + "_" + (++main.domId);//创建唯一id
                domObj.layoutDiv.id = id;
                domObj.layoutDiv = $('#' + domObj.layoutDiv.id);

                main.getHtml(id, startStr);//获取拼接html结构

                var _Id = '#' + id;
                var _layId = {};
                _layId[_Id] = {
                    "width": "375px",
                    "height": "60px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "opacity": "1",
                    "z-index": "0",
                    "transform": "rotate(0deg)"
                };

                page[0].style[_Id] = _layId[_Id];

                domObj.layoutDiv.append(addDom);
                //拖拽layout改变x,y坐标
                main.dragxy(id);
                try {
                    data.afterRender(id);//监听layout的宽高
                } catch (e) {
                }

                main.setAttr(id);//设置自定义属性
                main.findLast();//找最后一个layout添加当前选中标记
                var lastdom = $("#device > div:last");
                main.layoutOpts[id] = {};//存储layouy属性值
                main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件

                //控制方向键
                $(document).on('keydown', function (e) {
                    main.setKey(id, e);
                });

                $('#' + id).find('.widgetMaskClose').on("click", function () {
                    $(this).parent().parent().remove();
                    main.domNum--;
                    $("#projectAmount").text(main.domNum);
                    main.addCl();
                    main.setOpt(main.opt);//渲染公共背景色
                    main.setBg();


                    main.restDomObj(id,startStr);//重新渲染page数组
                });
                main.setOpt(data.options, id);//渲染dom
                main.setBg();//调用色板

                $('#' + id).on('click', function () {
                    $('#device > div').find('.widgetSelectMask').css('display', 'none');
                    $(this).find('.widgetSelectMask').css('display', 'block');
                    $(this).addClass('active').siblings('div').removeClass('active');
                    var curId = $(this).attr('id');
                    main.setAttr(id);//设置自定义属性
                    main.setAttrVal(id);//设置属性值
                    id = curId;

                    if (main._selected[curId]) {
                        main._selected[curId](curId);//选中状态时将属性值存起来
                    }

                    main.setOpt(data.options, id);//渲染dom
                    main.setBg();//调用色板

                    main.setdisabled(id);//设置input选中状态和未选中状态
                    main.removeCl();//移除隐藏类

                });

                main.removeCl();

            });

            $("#device").append(domObj.layoutDiv);
            main.domNum++;
            $("#projectAmount").text(main.domNum);
        },

        //二维码
        qrCode: function (main) {
            var domObj = main.createDiv();
            require(['qrCode'], function (data) {
                addDom = $(data.dom);
                var id = 'qrCode' + "_" + (++main.domId);//创建唯一id
                domObj.layoutDiv.id = id;
                domObj.layoutDiv = $('#' + domObj.layoutDiv.id);

                main.getHtml(id, startStr);//获取拼接html结构
                var _Id = '#' + id;
                var _layId = {};
                _layId[_Id] = {
                    "width": "375px",
                    "height": "60px",
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "opacity": "1",
                    "z-index": "0",
                    "transform": "rotate(0deg)"
                };

                page[0].style[_Id] = _layId[_Id];

                domObj.layoutDiv.append(addDom);
                //拖拽layout改变x,y坐标
                main.dragxy(id);
                try {
                    data.afterRender(id);//监听layout的宽高变化
                } catch (e) {
                }
                main.setAttr(id);//设置自定义属性
                main.findLast();//找最后一个layout添加当前选中标记
                var lastdom = $("#device > div:last");
                main.layoutOpts[id] = {};//存储layouy属性值
                main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件
                //控制方向键
                $(document).on('keydown', function (e) {
                    main.setKey(id, e);
                });

                $('#' + id).find('.widgetMaskClose').on("click", function () {
                    $(this).parent().parent().remove();
                    main.domNum--;
                    $("#projectAmount").text(main.domNum);
                    main.addCl();
                    main.setOpt(main.opt);//渲染公共背景色
                    main.setBg();


                    main.restDomObj(id,startStr);//重新渲染page数组
                });

                main.setOpt(data.options, id);//渲染dom

                $('#' + id).on('click', function () {
                    $('#device > div').find('.widgetSelectMask').css('display', 'none');
                    $(this).find('.widgetSelectMask').css('display', 'block');
                    $(this).addClass('active').siblings('div').removeClass('active');
                    var curId = $(this).attr('id');
                    main.setAttr(id);//设置自定义属性
                    main.setAttrVal(id);//设置属性值
                    id = curId;

                    if (main._selected[curId]) {
                        main._selected[curId](curId);//选中状态时将属性值存起来
                    }
                    main.setOpt(data.options, id);//渲染dom


                    main.setdisabled(id);//设置input选中状态和未选中状态
                    main.removeCl();//移除隐藏类
                });
                main.removeCl();
            });

            $("#device").append(domObj.layoutDiv);
            main.domNum++;
            $("#projectAmount").text(main.domNum);
        },

        //形状
        // shape: function (main) {
        //     var domObj = main.createDiv();
        //     require(['shape'], function (data) {
        //         addDom = $(data.dom);
        //         var id = 'shape' + "_" + (++main.domId);//创建唯一id
        //         domObj.layoutDiv.id = id;
        //         domObj.layoutDiv = $('#' + domObj.layoutDiv.id);
        //
        //
        //         main.getHtml(id, startStr);//获取拼接html结构
        //         var _Id = '#' + id;
        //         var _layId = {};
        //         _layId[_Id] = {
        //             "width": "375px",
        //             "height": "60px",
        //             "position": "absolute",
        //             "top": "0",
        //             "left": "0",
        //             "opacity": "1",
        //             "z-index": "0",
        //             "transform": "rotate(0deg)"
        //         };
        //
        //         page[0].style[_Id] = _layId[_Id];
        //
        //         domObj.layoutDiv.append(addDom);
        //         //拖拽layout改变x,y坐标
        //         main.dragxy(id);
        //         try {
        //             data.afterRender(id);
        //         } catch (e) {
        //         }
        //
        //         main.setAttr(id);//设置自定义属性
        //         main.findLast();//找最后一个layout添加当前选中标记
        //         var lastdom = $("#device > div:last");
        //         main.layoutOpts[id] = {};//存储layouy属性值
        //         main.setLayoutCss(id, lastdom);//给选中状态下的layout渲染css属性样式并绑定事件
        //         //控制方向键
        //         $(document).on('keydown', function (e) {
        //             main.setKey(id, e);
        //         });
        //
        //         $('#' + id).find('.widgetMaskClose').on("click", function () {
        //             $(this).parent().parent().remove();
        //             main.domNum--;
        //             $("#projectAmount").text(main.domNum);
        //             main.addCl();
        //             main.setOpt(main.opt);//渲染公共背景色
        //             main.setBg();
        //
        //             main.restDomObj(id,startStr);//重新渲染page数组
        //         });
        //
        //         main.setOpt(data.options, id);//渲染dom
        //
        //         $('#' + id).on('click', function () {
        //             $('#device > div').find('.widgetSelectMask').css('display', 'none');
        //             $(this).find('.widgetSelectMask').css('display', 'block');
        //             $(this).addClass('active').siblings('div').removeClass('active');
        //             var curId = $(this).attr('id');
        //             main.setAttr(id);//设置自定义属性
        //             main.setAttrVal(id);//设置属性值
        //             id = curId;
        //             main.setOpt(data.options, id);//渲染dom
        //             main.setdisabled(id);//设置input选中状态和未选中状态
        //             main.removeCl();//移除隐藏类
        //         });
        //         main.removeCl();
        //     });
        //
        //     $("#device").append(domObj.layoutDiv);
        //     main.domNum++;
        //     $("#projectAmount").text(main.domNum);
        // }

    };
    return dragToLayout;
});