var tcpServerSocket = null;
var version = '';
var ip = "";
var port = "";
var receive = {};
var fileEntries = {};
chrome.system.network.getNetworkInterfaces(function (data) {
    $('#ipAddress').val(data[1].address);
    $('#fileAddress').val(data[1].address);
});
//挂起服务
$('#submit').on('click', function () {
    port = parseInt($('#port').val());
    ip = $('#ipAddress').val();
    if (version === '') {
        console.log('未选择文件夹');
        return;
    }
    tcpServerSocket = new tcpServer();
    tcpServerSocket.option = {
        persistent: false
    };
    tcpServerSocket.accept = handleAccept.bind(tcpServerSocket);
    tcpServerSocket.init(function () {
        tcpServerSocket.listen(ip, port, function () {
            console.log('Listening ' + ip + ':' + port + '...');
            $('#stop').removeAttr('disabled');
        });
    });
});
//停止服务
$('#stop').on('click', function () {
    $(this).attr('disabled', 'disabled');
    tcpServerSocket.close(function () {

    });
});
//指定路径
$('#fileEntry').on('click', function () {
    chrome.fileSystem.chooseEntry({
        type: 'openDirectory'
    }, function (entry) {
        var data = getSubEntries(entry);
    });
});

function getSubEntries(Entry, path) {
    var parentName = Entry.name;
    var dirReader = Entry.createReader();
    dirReader.readEntries(function (Entries) {
        var result = 0;
        var name = '';
        for (var i = 0; i < Entries.length; i++) {
            if(Entries[i].isFile){
                if (result < getFileVersion(Entries[i].name)) {
                    result = getFileVersion(Entries[i].name);
                    name = Entries[i].name;
                }
            }
        }
        version = name.replace('upPageEditor_','').replace('.crx', '').replace(/_/g,'.');
        $('#version').val(version);
        fileEntries.name = name;
        fileEntries.path = '/' + parentName + '/' + name;
    });
}

function getFileVersion(name) {
    return parseInt(name.replace('upPageEditor_','').replace(/\_/g, '').replace('.crx', ''));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function getParam(buf) {
    var data = String.fromCharCode.apply(null, new Uint8Array(buf));
    data = data.substring(data.indexOf('{'), data.indexOf('}') + 1).replace(/%22/g, '\"');
    return JSON.parse(data);
}

function handleAccept(info) {
    if (info.socketId == this.socketId) {
        var _tcp = chrome.sockets.tcp;
        var tcpSocket = new tcp();
        tcpSocket.socketId = info.clientSocketId;
        tcpSocket.keepAlive(true, 5, function () {
            _tcp.onReceive.addListener(function (info) {
                if (info.socketId == tcpSocket.socketId) {
                    tcpSocket.receive(info);
                }
            });
            _tcp.onReceiveError.addListener(function (info) {
                if (info.socketId == tcpSocket.socketId) {
                    tcpSocket.error(info.resultCode);
                }
            });
            tcpSocket.receive = handleRequest.bind(tcpSocket);
            tcpSocket.pause(false, function () {
                console.log('Receiving data...');
            });
        });
    }
}

function handleRequest(info) {
    var header = ab2str(info);
    header = header.split("\r\n").join('<br />');
    var body = {
        "resp": "00", "msg": "", "param": {
            "version": version,
            "data": {},
            "address": ""
        }
    };
    if (parseInt(getParam(info.data).currentVersion.replace(/\./g, '')) >= parseInt(version.replace(/\./g, ''))) {
        body.resp = '01';
        body.msg = 'your customer is the lastest version';
    } else {
        body.param.data = fileEntries;
        body.param.address = 'http://' + $('#fileAddress').val() + ':' + $('#filePort').val();
    }
    body = JSON.stringify(body);
    var respondse = "HTTP/1.1 200 OK\r\n" +
        "Connection: Keep-Alive\r\n" +
        "Content-Length: " + body.length + "\r\n" +
        "Content-Type: text/plain\r\n" +
        "Access-Control-Allow-Origin:*\r\n" +
        "Connection: close\r\n\r\n" + body;
    respondse = str2ab(respondse);
    this.send(respondse, function () {
        console.log('Sent.');
        this.close(function () {
            console.log('Closed.');
        })
    }.bind(this));
}