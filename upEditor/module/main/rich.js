(function($, UP) {
	var ui = window.UP.W.Ui;
	UP.W = UP.W || {};
	UP.W.Main = UP.W.Main || {};
	UP.Editor = UP.Editor || {};
	//--------------初始化富文本
	var E = window.wangEditor;
	var editor = new E('editWrap');

	editor.config.menus = [
        'fontsize',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        'fontfamily',
        '|',
        'quote',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        'emotion',
        '|',
        'img',
        'video'
	];

	editor.create();

	//获取传输进来的内容,显示在editor里面
	//拉取数据
	chrome.runtime.sendMessage('getDOM', function(data) {
		//拉取出来就设置
		console.log(data);
		if(data === "y") {

			chrome.storage.local.get('richDOM', function(result) {
				editor.$txt.html(result.richDOM);
			});
		}
	});

	//确认和关闭按钮绑定
	var current_window = chrome.app.window.current();

	//确认
	document.getElementById('confirm-popup').onclick = function() {
		chrome.storage.local.set({ "richDOM": editor.$txt.html() });
		//把内容传输出去
		chrome.runtime.sendMessage("show", function(resp) {
			console.log(resp);
			if(resp === '00') {
				current_window.close();
			} else {
				console.log('error');
			}
		});
	};

	//关闭
	document.getElementById('close-popup').onclick = function() {
		current_window.close();
	};

})(window.Zepto || window.jQuery, window.UP = window.UP || {});