//安装时候会触发
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set(userInfo, function () {
    });
});

//app入口
chrome.app.runtime.onLaunched.addListener(function () {
    var main_window = chrome.app.window.get('main');
    if (main_window) {
        main_window.show();
    }
    else {
        chrome.app.window.create('../../html/main.html', {
            'bounds': {
                'width': 1000,
                'height': 710
            },
            'resizable': false,
            'frame': 'none'
        });
    }
});