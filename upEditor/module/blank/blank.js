(function ($, UP) {
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    main.blank = main.blank || {};
    var blank = main.blank;
    var page = window.UP.Editor.page;
    var opt = [
        {
            'label':'备注说明',
            'name':'remarkText'
        },
        {
            'label':'背景色',
            'name':'blankBackground'
        },
        {
            "label": "文字颜色",
            "name": "blankfontColor"
        },
        {
            "label":"文字大小",
            "name":"blankfontSize"
        },
        {
            'label':'文字粗细',
            'name':'blankfontBold'
        },
    ]

    //由于是异步渲染dom,所以加个延时
    setTimeout(function(){
        //色板调用
        main.setBg();
    },100);

    //设置占位的样式属性
    function setblank(that,bkobj,val){
        var curId  = $(that).attr('data-id');
        if(bkobj){
            $("#"+curId).find(".blankdom").css(bkobj)
        }
    }

    // 备注说明
    $("#optionBody").on("input","[data-name=remarkText]",function(){
        var domId = $(this).attr("data-id");
        var curVal = $(this).val();
        $("#"+domId).find('.blankdom').text(curVal);
        var blanktime = null;
        clearTimeout(blanktime);
        blanktime = setTimeout(function(){
            blank[domId].remarkTxt = curVal;//本地属性值的保存
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent===domId){
                    page[i].pageStr = "<div data-minH = '42' class='blankdom'>" + curVal + "</div>";
                    break;
                }
            }
        },300);
    });

    // 背景色
    $("#optionBody").on("input","[data-name=blankBackground]",function(){
        var curVal =  $(this).val();
        var domId = $(this).attr("data-id");
        var curVal = $(this).val();
        $("#"+domId).find('.blankdom').css({
            'background-color':curVal
        });
        var blanktime = null;
        clearTimeout(blanktime);
        blanktime = setTimeout(function(){
            blank[domId].blankBackground = curVal;//本地属性值的保存
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent===domId){
                    page[i].style['.blankdom']['background-color'] = curVal;
                    break;
                }
            }
        },300);
    });

    // 文字颜色
    $("#optionBody").on("input","[data-name=blankfontColor]",function(){
        var curVal =  $(this).val();
        var domId = $(this).attr("data-id");
        var curVal = $(this).val();
        $("#"+domId).find('.blankdom').css({
            'color':curVal
        })
        var blanktime = null;
        clearTimeout(blanktime);
        blanktime = setTimeout(function(){
            blank[domId].blankfontColor = curVal;//本地属性值的保存
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent===domId){
                    page[i].style['.blankdom']['color'] = curVal;
                    break;
                }
            }
        },300);
    });

    // 文字大小
    $("#optionBody").on("input","[data-name=blankfontSize]",function(){
        var curVal =  $(this).val();
        var domId = $(this).attr("data-id");
        var curVal = $(this).val();
        $("#"+domId).find('.blankdom').css({
            'font-size':curVal+'px'
        })
        var blanktime = null;
        clearTimeout(blanktime);
        blanktime = setTimeout(function(){
            blank[domId].blankfontSize = curVal;//本地属性值的保存
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent===domId){
                    page[i].style['.blankdom']['font-size'] = curVal + 'px';
                    break;
                }
            }
        },300);
    });

    // 文字粗细
    $("#optionBody").on("change","[data-name=blankfontBold]",function(){
        var curVal =  $(this).val();
        var domId = $(this).attr("data-id");
        var curVal = $(this).val();
        $("#"+domId).find('.blankdom').css({
            'font-weight':curVal
        })
        var blanktime = null;
        clearTimeout(blanktime);
        blanktime = setTimeout(function(){
            blank[domId].blankfontBold = curVal;//本地属性值的保存
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent===domId){
                    page[i].style['.blankdom']['font-weight'] = curVal;
                    break;
                }
            }
        },300);
    });


    define(function(){
        var dom =   '<div class="blankdom" data-minH = "60" style="height:100%; ' +
                    'background-color:#ccc; ' +
                    'background-size: 0.8rem 0.8rem; ' +
                    'background-image: linear-gradient(45deg, rgba(255, 255, 255, 1) 25%, ' +
                    'transparent 25%,' +
                    ' transparent 50%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 75%, transparent 75%, transparent);' +
                    ' ">' +
                    '占位'+
                    '</div>' +
                    '<div class="widgetSelectMask" >' +
                    '<span class="widgetMaskClose"></span>' +
                    '</div>';
        return {
            "dom":dom,
            "options":opt,
            "afterRender":function (id) {
                blank[id] = {
                    remarkTxt:'占位',
                    blankBackground:'#ffffff',
                    blankfontColor:'#666666',
                    blankfontSize:'16',
                    blankfontBold:'normal',
                };
                var data = {
                    "parent": id,
                    "pageStr": "<div class='blankdom'></div>",
                    "style": {
                        ".blankdom": {
                            "width": "100%",
                            "height": "100%"
                        }
                    }
                };
                page.push(data);
                main.setResize(id,function (id,w,h) {
                    setTimeout(function(){
                        main.layoutOpts[id].width = w;
                        main.layoutOpts[id].height = h;
                    },500)
                });
                main.setSelected(id, function (id) {
                    setTimeout(function () {
                        $("#optionBody").find("[data-name=remarkText]").val(blank[id].remarkTxt);
                        $("#optionBody").find("[data-name=blankBackground]").val(blank[id].blankBackground);
                        $("#optionBody").find("[data-name=blankBackground]").next('span').find('span').css({
                            'background-color':blank[id].blankBackground
                        })
                        $("#optionBody").find("[data-name=blankfontColor]").val(blank[id].blankfontColor);
                        $("#optionBody").find("[data-name=blankfontColor]").next('span').find('span').css({
                            'background-color':blank[id].blankfontColor
                        })
                        $("#optionBody").find("[data-name=blankfontSize]").val(blank[id].blankfontSize);
                        $("#optionBody").find("[data-name=blankfontBold]").val(blank[id].blankfontBold);
                    }, 300);
                })

            }


        }

    })
})(window.Zepto || window.jQuery, window.UP = window.UP || {});

