(function ($, UP) {
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    var page = window.UP.Editor.page;

    var currentId;//当前ID

    var that,html; //表示要操作的元素，以及该元素的html
   	var opt = [
  		{
           "label":"文本编辑",
           "name":"editRichtext"
    	},
    	{
           "label":"清除格式",
           "name":"clearFormat"
    	}
    ];

    main.setOpt(opt);

    /**
     * 清除格式
     */
    $('#optionBody').on('click','#clearFormat',function(){
        $('.active *').css({
            "fontStyle":"normal",
            "color":"#000",
            "fontWeight":"normal",
            "fontSize":"normal",
            "linHeight":"1em",
            "backgroundColor":'rgba(0,0,0,0)',
            'textDecoration':'none'
        });

        //获取ID设置当前ID
        currentId = $(this).data("id");
        //获取清除格式之后的HTML
        var pageStr = $('#'+currentId).find('.edit-show')[0].outerHTML;

        //改变page对应的字符串
		changePageItem(currentId,pageStr);
    });

    $('#optionBody').on('click','#editRichtext',function(){

    	//获取ID设置当前ID
    	currentId = $(this).data("id");
		var id = $('.active').attr("id");
		//判断 id 里面是否包含richText 字符
		if(!(new RegExp("richText").test(id))){
			return;
		}
		//包含 richText 才做如下操作
		that = $("#"+id).find('.edit-show');
		html = $(that).html();
		
		var create_window = chrome.app.window.get('create');
		if(create_window) {
            create_window.close();
			create_window.show();
		} else {
			chrome.app.window.create('../../html/rich.html', {
				'bounds': {
					'width': 880,
					'height':420
				},
				'resizable': false,
				'frame': 'none'
			});
		}

		//阻止事件冒泡和默认事件*/
		event.stopPropagation();
		event.preventDefault();
	});
    
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		if(msg === 'getDOM'){
			var data = html;
			chrome.storage.local.set({"richDOM":data});
			sendResponse("y");
		}else if(msg === 'show'){
			chrome.storage.local.get('richDOM', function(result) {
				$(that).html(result.richDOM);
                main.resetLayoutDiv($(that).parent().attr('id'),$(that).width(),$(that).height());

                //点击确认会返回show，页面上会发生改变，应该替换page里面对应的值
				changePageItem(currentId,$(that)[0].outerHTML);
			});
			sendResponse('00');
		}else{
			console.log(msg);
		}
	});

    /**
	 *
     * @param id 父亲ID
     * @param pageStr DOM字符串
     */
    function changePageItem(id,pageStr){
    	var id = id;
    	var pageStr = pageStr;

    	console.log(id);
    	console.log(pageStr);
		setTimeout(function () {
            for(var i = 0;i<page.length;i++){
                if(page[i].parent === id){
                    page[i].pageStr = pageStr;
                    break;
                }
            }
        },100);
	}

    define(function (){
        var dom = '<div class="edit-show" data-minH = "40" ><p>普通文本</p></div>'+'<div class="widgetSelectMask">' +
            '<span class="widgetMaskClose"></span>' +
            '</div>';
        return {
            "options": opt,
            "dom":dom,
            "afterRender": function (id) {
                var data = {
                    "parent": id,
                    "pageStr": '<div class="edit-show"><p>普通文本</p></div>',
                    "style": {
                        ".edit-show": {
                            "padding": "0",
                            "margin": "0"
                        }
                    }
                };
                page.push(data);
                console.log(data);
                main.setResize(id,function (id,w,h) {
                    setTimeout(function(){
                        main.layoutOpts[id].width = w;
                        main.layoutOpts[id].height = h;
                    },500);
                });
                //调用setSelected保存自定义属性
                main.setSelected(id, function (id) {
                    console.log('选中富文本');
                })
            }
        }
    });


})(window.Zepto || window.jQuery, window.UP = window.UP || {});