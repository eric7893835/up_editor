(function($, UP) {
	var ui = window.UP.W.Ui;
	UP.W = UP.W || {};
	UP.W.Main = UP.W.Main || {};
    var ui = window.UP.W.UI
	var shareData = {} //填写的数据
    var result = '';
    /*chrome.storage.local.set({"shareData":{}});*/
    //确认和关闭按钮绑定
    var current_window = chrome.app.window.current();

    if(current_window.id == "linkShareWindow") {
        result = 'stopSharing';
    }else if (current_window.id == 'rightShareWindow'){
        result = 'failure';
    }
    console.log(result);

	//进来先读取缓存里面，看看是否有设置好分享的图片title以及描述
    /*chrome.storage.local.get('shareData', function(result) {
    	if(result && result.shareData && result.shareData != {}){
    	    if(result.shareData.picUrl && result.shareData.picUrl.length > 1){
                shareData.picUrl = result.shareData.picUrl;
                $('#shareImg').text("点击更改");
            }
            $('#shareTitle').val(result.shareData.title);
            $('#shareDesc').val(result.shareData.desc);
		}
    });*/

    $("#shareImg").on("click",function () {
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
                    shareData.picUrl = e.target.result;
                	$('#shareImg').text("点击更改");
				}
                fileReader.readAsDataURL(file);
            });
        });
    });

	//确认
	document.getElementById('confirm-popup').onclick = function() {
        if(!shareData.picUrl || !$('#shareTitle').val() || !$('#shareDesc').val()){
            ui.showAlert("系统提示", "当前信息填写不完整，是否选择关闭分享？", "确认", "取消", function(){
                chrome.runtime.sendMessage(result, function(resp) {
                    if(resp === '00') {
                        current_window.close();
                    } else {
                        console.log('error');
                    }
                });
                ui.dismiss();
            },function(){
                ui.dismiss();
            });
        }else{
            chrome.runtime.sendMessage("succeed", function(resp) {
                shareData.title = $('#shareTitle').val();
                shareData.desc = $('#shareDesc').val();
                console.log(shareData);
                chrome.storage.local.set({"shareData":shareData});

                chrome.storage.local.get('shareData', function (result) {
                    console.log(result.shareData);
                });
                if(resp === '00') {
                   current_window.close();
                } else {
                    console.log('error');
                }
            });
        };
	};

	//关闭
	document.getElementById('close-popup').onclick = function() {
        ui.showAlert("系统提示", "确认要关闭当前分享功能吗？", "确认", "不关闭", function(){
            chrome.runtime.sendMessage(result, function(resp) {
                if(resp === '00') {
                    current_window.close();
                } else {
                    console.log('error');
                }
            });
            ui.dismiss();
            current_window.close();
        },function(){
            ui.dismiss();
        });
	};

})(window.Zepto || window.jQuery, window.UP = window.UP || {});