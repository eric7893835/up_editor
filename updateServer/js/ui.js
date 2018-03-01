var current_window = chrome.app.window.current();
//app控件
document.getElementById('minimize').onclick = function(){
    current_window.minimize();
};

document.getElementById('close').onclick = function(){
    current_window.close();
};