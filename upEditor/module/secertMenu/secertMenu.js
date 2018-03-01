define(function () {
    var ui = window.UP.W.UI;
    var countdown = 0;
    var close = true;
    var timeout = null;
    var ip = '';
    var port = 0;
    //init
    chrome.storage.local.get(['autoUpdate', 'updateAddress', 'updatePort'], function (data) {
        ip = data.updateAddress;
        port = data.updatePort;
        if (data.autoUpdate) {
            var param = {"currentVersion": chrome.runtime.getManifest().version};
            param = JSON.stringify(param);
            var url = 'http://' + ip + ':' + port;
            $.get(url, param, function (resp) {
                resp = JSON.parse(resp);
                if (resp.resp === '00') {
                    ui.showAlert('系统升级', '有新的版本:' + resp.param.version, '下载', '取消', function () {
                        updateExt(resp.param.data, resp.param.address);
                        ui.dismiss();
                    }, function () {
                        ui.dismiss();
                    });
                }
            });
        }1
    });
    //bind Event
    document.onkeydown = function (e) {
        if (close) {
            return;
        }
        var password = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 66, 65];
        if (e.which === password[countdown]) {
            countdown++;
        } else {
            countdown = 0;
            clearTimeout(timeout);
        }
        if (countdown === 12) {
            showconfig();
            countdown = 0;
            clearTimeout(timeout);
        }
    }
    $('#lastDate').on('click', function () {
        close = false;
        console.log('start input');
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            close = true;
            countdown = 0;
        }, 10000);
    });
    $('body').on('click', '.secertMenu .close', function () {
        $('.secertMenu').remove();
        ui.dismiss();
    });
    $('body').on('click', '#updateSetting', function () {
        $('#updateAddress').removeAttr('disabled');
        $('#updatePort').removeAttr('disabled');
        $('#updateSetting').hide();
        $('#updateSave').show();
    });
    $('body').on('click', '#updateSave', function () {
        chrome.storage.local.set({
            "updateAddress": $('#updateAddress').val()
        }, function () {
            chrome.storage.local.set({"updatePort": parseInt($('#updatePort').val())}, function () {
                ip = $('#updateAddress').val();
                port = parseInt($('#updatePort').val());
                $('#updateAddress').attr('disabled', 'disabled');
                $('#updatePort').attr('disabled', 'disabled');
                $('#updateSave').hide();
                $('#updateSetting').show();
            });
        });
    });
    $('body').on('click', '#update', function () {
        var param = {"currentVersion": chrome.runtime.getManifest().version};
        param = JSON.stringify(param);
        var url = 'http://' + ip + ':' + port;
        $('#serverVersion').text('查询中...');
        $.get(url, param, function (resp) {
            resp = JSON.parse(resp);
            $('#serverVersion').text(resp.param.version);
            if (resp.resp === '00') {
                ui.showAlert('系统升级', '有新的版本:' + resp.param.version, '下载', '取消', function () {
                    updateExt(resp.param.data, resp.param.address);
                    ui.dismiss();
                    console.log('startupdate');
                }, function () {
                    ui.dismiss();
                });
            }
        });
    });
    $('body').on('click', '#autoUpdate', function () {
        var auto = chrome.storage.local.get('autoUpdate', function (data) {
            if (data.autoUpdate) {
                chrome.storage.local.set({'autoUpdate': false}, function () {
                    $('#autoUpdate').text('关');
                });
            } else {
                chrome.storage.local.set({'autoUpdate': true}, function () {
                    $('#autoUpdate').text('开');
                });
            }
        });
    });

    //function
    function updateExt(data, address) {
        console.log(data);
        var path = address + data.path;
        window.open(path, '下载', '');
        chrome.management.uninstallSelf({showConfirmDialog: false}, function () {
        });
    }

    function showconfig() {
        var auto = true;
        chrome.storage.local.get(['updateAddress', 'updatePort', 'autoUpdate'], function (data) {
            if (data.updateAddress && data.updateAddress.length > 0) {
                console.log(data);
                ip = data.updateAddress;
                port = data.updatePort;
                auto = data.autoUpdate;
            }
            var dom = "<div class='secertMenu'>" +
                "<div class='title'>" +
                "<div class='titlestr'>设置</div>" +
                "<div class='close'></div>" +
                "</div>" +
                "<div class='content'>" +
                "<div class='row'>" +
                "<div class='label'>更新服务器</div>" +
                "<input type='text' id='updateAddress' value='" + ip + "' disabled>" +
                "<input type='text' id='updatePort' value='" + port + "' disabled/>" +
                "<button id='updateSetting'>设置</button>" +
                "<button id='updateSave'>保存</button>" +
                "<button id='update'>检查更新</button>" +
                "</div>" +
                "<div class='row'>" +
                "<div class='label'>当前版本</div>" +
                "<div class='text' id='currentVersion'>" +
                chrome.runtime.getManifest().version +
                "</div>" +
                "<div class='label'>服务器版本</div>" +
                "<div class='text' id='serverVersion'>-</div>" +
                "</div>" +
                "<div class='row'>" +
                "<div class='label'>自动更新</div>" +
                "<button id='autoUpdate'>";
            if (auto) {
                dom += '开';
            } else {
                dom += '关';
            }
            dom += "</button>" +
                "</div>" +
                "</div>" +
                "</div>";
            ui.showMask();
            $('body').append(dom);
            $('.secertMenu').setFixItemMiddle();
            $('.secertMenu').myDrag({
                direction:'all',
                handler:'.title',
                parent:'body'
            });
        });
    }
});