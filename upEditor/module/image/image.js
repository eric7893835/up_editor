(function ($, UP) {
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    main.image = main.image || {};
    var page = window.UP.Editor.page;
    var image = main.image;
    var opt = [
        {
            "label": "选择图片",
            "name": "src"
        },
        {
            "label": "圆角",
            "name": "borderRadius"
        }
    ];
    function showPreview(source,domId) {
        var file = source;
        if(!/image\/\w+/.test(file.type)){
            alert("请确保文件为图像类型");
        }else if(window.FileReader) {
            var fr = new FileReader();
            fr.onloadend = function(e) {
                $("#"+domId).find("img").attr("src",e.target.result);
                var blanktime = null;
                clearTimeout(blanktime);
                blanktime = setTimeout(function(){
                    var length = page.length;
                    for(var i = 0;i<length;i++){//更改page默认值
                        if(page[i].parent === domId){
                            page[i].src = e.target.result;
                            break;
                        }
                    }
                },300);
                setTimeout(function(){
                    var $imgh  =$("#"+domId).find('.up-editor-image').height();
                    main.layoutOpts[domId].imgHeight = $imgh;
                    $("#changeHeight").val(main.layoutOpts[domId].imgHeight);
                    $("#"+domId).find(".widgetSelectMask").css({
                        'height':main.layoutOpts[domId].imgHeight
                    });
                },50)
            };
            fr.readAsDataURL(file);
        }
    }
    $("#optionBody").on("click","#chooseImg",function(){
        var domId = $(this).attr("data-id");
        chrome.fileSystem.chooseEntry({
            type: 'openWritableFile',
            accepts: [
                {
                    description: '图片文件',
                    mimeTypes: ["image/png","image/jpeg","image/jpg"],
                    extensions: ['jpg','png']
                }
            ]
        }, function (Entry) {
            console.log(Entry);
            Entry.file(function (file) {
                showPreview(file,domId)
            });
        });
    });
    $("#optionBody").on("change","#selRadius",function(){
        var domId = $(this).attr("data-id");
        if($(this).val()==="1"){
            $("#"+domId).find("img").css("border-radius","50%");
            $("#changeRadius").val("").attr("disabled","disabled");
            image[domId].borderR = '1';
            var blanktime = null;
            clearTimeout(blanktime);
            setTimeout(function(){
                var length = page.length;
                for(var i = 0;i<length;i++){//更改page默认值
                    if(page[i].parent === domId){
                        page[i].style['.image']['border-radius'] = '50%';
                        break;
                    }
                }
            },300);

        }else{
            $("#"+domId).find("img").css("border-radius","0");
            $("#changeRadius").val("0").removeAttr("disabled");
            image[domId].borderR = '0';
        }
    });

    $("#optionBody").on("input","#changeRadius",function(){
        var domId = $(this).prev().attr("data-id");
        var bdrv = $(this).val();
        $("#"+domId).find("img").css("border-radius",$(this).val()+"px");
        image[domId].borderRadius = bdrv;

        var blanktime = null;
        clearTimeout(blanktime);
        setTimeout(function(){
            var length = page.length;
            for(var i = 0;i<length;i++){//更改page默认值
                if(page[i].parent === domId){
                    page[i].style['.image']['border-radius'] = bdrv+'px';
                    break;
                }
            }
        },300);
    });

    define(function (){
        var dom =   "<img class='up-editor-dom up-editor-image' src='../../module/image/preview.png'/>" +
                    '<div class="widgetSelectMask">' +
                    '<span class="widgetMaskClose"></span>' +
                    '</div>';
        return {
            "options": opt,
            "dom":dom,
            "afterRender":function (id) {
                image[id] = {
                    borderRadius:'0',
                    borderR:'0'
                };

                var data = {
                    "parent": id,
                    "pageStr": "<img class='image'/>",
                    "style": {
                        ".image": {
                            "width": "100%",
                            "display":"block",
                            "border-radius":"0"
                        }
                    },
                    "src": ''
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
                        $("#optionBody [data-name='borderRadius']").val(image[id].borderR);
                        if(image[id].borderR === '1'){
                            $('#selRadius').val(image[id].borderR);
                            $("#changeRadius").val("").attr("disabled","disabled");
                        }else{
                            $('#selRadius').val(image[id].borderR);
                            $("#changeRadius").val(image[id].borderRadius).removeAttr("disabled")
                        }
                    }, 300);
                })
            }
        }
    });
})(window.Zepto || window.jQuery, window.UP = window.UP || {});


