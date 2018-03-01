define(function () {
    var editor = window.UP.Editor;
    var ui = window.UP.W.UI;
    var readJson = null;
    var shareData = '';
    //修改工程名
    $('#projectName').on('blur', function () {
        editor.projectName = $(this).val();
    });
    //读取文件
    $('#openProject').on('click', function () {
        chrome.fileSystem.chooseEntry({
            type: 'openWritableFile',
            accepts: [
                {
                    description: '*.sav',
                    mimeTypes: ["text/plain"],
                    extensions: ['sav']
                }
            ]
        }, function (fileEntry) {
            readJson = fileEntry;
            fileEntry.file(function (file) {
                var render = new FileReader();
                render.onload = function () {
                    var text = this.result;
                    editor = JSON.parse(text);
                    //加载配置
                    util.loadConfig();
                    ui.showToast('加载成功');
                    console.log('Load Config Success');
                }
                render.readAsText(file);
            });
        });
    });
    //保存配置文件
    $('#saveProject').on('click', function () {
        ui.showProcess();
        editor.lastDate = ui.dateFormate(new Date());
        if (readJson === null) {
            chrome.fileSystem.chooseEntry({
                type: 'saveFile',
                accepts: [
                    {
                        description: '*.json',
                        mimeTypes: ["text/plain"],
                        extensions: ['json']
                    }
                ]
            }, function (fileEntry) {
                fileEntry.getFile(fileEntry.name, {create: true}, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        console.log('---- Config File Saved ---');
                        fileWriter.write(new Blob([JSON.stringify(editor)]), {type: 'text/plain'});
                        ui.updateProcess('加载完成', '100');
                        setTimeout(function () {
                            ui.dismiss();
                        }, 1000);
                    });
                });
            });
        } else {
            var length = JSON.stringify(editor).length;
            readJson.createWriter(function (fileWriter) {
                fileWriter.onwrite = function () {
                    fileWriter.truncate(length);
                };
                fileWriter.write(new Blob([JSON.stringify(editor)]), {type: 'text/plain'});
                ui.updateProcess('保存完成', '100');
                setTimeout(function () {
                    ui.dismiss();
                }, 2000);
                console.log('---- Config File Saved ---');
            });
        }
    });
    //导出
    $('#importProject').on('click', function () {
        var name = '';
        if (!editor.projectName || editor.projectName === '') {
            name = '无标题';
        } else {
            name = editor.projectName;
        }
        var html = util.getDomStr(editor.page);
        console.log("----------------------------------------------------" + html);
        //此处做操作完成分享和js的添加
        var forepart = html.substring(0, html.indexOf("</body>")); //前半段
        var posterior = html.substring(html.indexOf("</body>")); //后半段

        var jsStr = '<script src="http://wallet.95516.com/s/wl/webV2/commonModule/zepto.min.js"></script>' +
            '<script src="http://wallet.95516.com/s/wl/webV2/common/commonAll.js"></script>' +
            '<script>' +
            '(function ($, UP) {' +
            '    UP.W = UP.W || {};' +
            '    var util = UP.W.Util || {};' +
            '    var env = UP.W.Env || {};' +
            '    var ui = UP.W.UI || {};' +
            '    var app = UP.W.App || {};';
        //判断是否要设置顶部右边的button
        if(shareData && shareData.title && shareData.desc ){
            if ($("#topRightShare").get(0).checked) {
                jsStr += ' app.onPluginReady(function () {\n' +
                    '       app.setNavigationBarRightButton("",env.currentPath + "./image/more_icon.png",function(){' +
                    '           app.showSharePanel({' +
                    '               title:"' + shareData.title + '",' +
                    '               desc:"' + shareData.desc + '",' +
                    '               picUrl: env.currentPath + "./image/shareIcon.png",' +
                    '               shareUrl: env.currentPath + location.href.split("/")[location.href.split("/").length - 1]' +
                    '           });' +
                    '       });' +
                    '   });';
            }
            jsStr += '$(".linkButton[data-isShare=\'true\']").on("click",function(e){' +
                '   app.onPluginReady(function () {\n' +
                '           app.showSharePanel({' +
                '               title:"' + shareData.title + '",' +
                '               desc:"' + shareData.desc + '",' +
                '               picUrl: env.currentPath + "./image/shareIcon.png",' +
                '               shareUrl: env.currentPath + location.href.split("/")[location.href.split("/").length - 1]' +
                '           });' +
                '   });' +
                '   e.preventDefault(); ' +
                '   return false;' +
                '});';
        }
        //TODO:这里的打开页面是打开什么页面？index?还是native的首页
        jsStr += '$(".linkButton[data-isdownloadpage=\'true\']").on("click",function(e){' +
            '   util.openWalletApp();' +
            '   e.preventDefault(); ' +
            '   return false;' +
            '});';

        jsStr += '})(Zepto, window.UP = window.UP || {});</script>';

        html = forepart + jsStr + posterior;
        var jsFont = util.getJavaScript(editor.page);
        editor.lastDate = ui.dateFormate(new Date());
        var exist = false;
        chrome.fileSystem.chooseEntry({
            type: 'openDirectory'
        }, function (dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(function (Entries) {
                //文件夹是否存在
                for (var i = 0; i < Entries.length; i++) {
                    if (Entries[i].name === name) {
                        exist = true;
                        name = name + '_new';
                    }
                }
                ui.showProcess('导出');
                ui.updateProcess('正在创建目录...', 0);
                dirEntry.getDirectory(name, {create: true}, function (subEntry) {
                    subEntry.getDirectory('css', {create: true}, function (cssEntry) {
                        cssEntry.getFile('index.css', {create: true}, function (fileEntry) {
                            fileEntry.createWriter(function (fileWriter) {
                                fileWriter.write(new Blob([util.getStyleStr(editor.page)]), {type: 'text/plain'});
                                ui.updateProcess('样式文件保存成功...', 10, function () {
                                    setTimeout(function () {
                                        util.loadSuccess(subEntry);
                                    }, 1000);
                                });
                                console.log('---- Style File Writed ---');
                            });
                        });
                    });
                    subEntry.getDirectory('js', {create: true}, function (JsEntry) {
                        JsEntry.getFile('resize.js', {create: true}, function (fileEntry) {
                            fileEntry.createWriter(function (fileWriter) {
                                fileWriter.write(new Blob([jsFont]), {type: 'text/plain'});
                                ui.updateProcess('RESIZE文件保存成功...', 10, function () {
                                    setTimeout(function () {
                                        util.loadSuccess(subEntry);
                                    }, 1000);
                                });
                                console.log('---- Resize.js Writed ---');
                            });
                        });
                    });
                    subEntry.getFile('index.html', {create: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.write(new Blob([html]), {type: 'text/plain'});
                            ui.updateProcess('页面文件保存成功...', 30, function () {
                                util.loadSuccess(subEntry);
                            });
                            console.log('---- Html File Writed ---');
                        });
                    });
                    subEntry.getDirectory('image', {create: true}, function (imgEntry) {
                        var length = editor.page.length;
                        var init = 1;
                        var data = new Array();
                        data = editor.page;
                        // var singleProgress = Math.floor(40 / length);
                        //先导出分享右上角的按钮，和分享出去的图片
                        if (data[0] && data[0].shareData) {
                            var rifhtTopImg = "more_icon.png";
                            var sharImg = "shareIcon.png";
                            imgEntry.getFile(rifhtTopImg, {create: true}, function (fileEntry) {
                                fileEntry.createWriter(function (fileWriter) {
                                    fileWriter.write(ui.base64ToBlob(data[0].shareData.rightBuutonImg), {type: 'text/plain'});
                                });
                            });
                            imgEntry.getFile(sharImg, {create: true}, function (fileEntry) {
                                fileEntry.createWriter(function (fileWriter) {
                                    fileWriter.write(ui.base64ToBlob(data[0].shareData.picUrl), {type: 'text/plain'});
                                });
                            });
                        }
                        if (data[0] && data[0].src && data[0].src !== '') {
                            imgEntry.getFile('bg.png', {create: true}, function (fileEntry) {
                                fileEntry.createWriter(function (fileWriter) {
                                    fileWriter.write(ui.base64ToBlob(data[0].src), {type: 'text/plain'});
                                });
                            });
                        }
                        createImage();

                        function createImage() {
                            if (init < length) {
                                if (data[init].parent.indexOf('qrCode') > -1) {
                                    var imgName = data[init].parent + '.png';
                                    imgEntry.getFile(imgName, {create: true}, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function () {
                                                init++;
                                                createImage();
                                            };
                                            console.log(data[init].src);
                                            fileWriter.write(ui.base64ToBlob(data[init].src), {type: 'text/plain'});
                                        });
                                    });
                                } else if (data[init].parent.indexOf('image') > -1) {
                                    var imgName = data[init].parent + '.png';
                                    imgEntry.getFile(imgName, {create: true}, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function () {
                                                init++;
                                                createImage();
                                            };
                                            console.log(data[init].src);
                                            fileWriter.write(ui.base64ToBlob(data[init].src), {type: 'text/plain'});
                                        });
                                    });
                                } else if (data[init].parent.indexOf('linkButton') > -1 && data[init].src) {
                                    var imgName = data[init].parent + '.png';
                                    imgEntry.getFile(imgName, {create: true}, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function () {
                                                init++;
                                                createImage();
                                            };
                                            console.log(data[init].src);
                                            fileWriter.write(ui.base64ToBlob(data[init].src), {type: 'text/plain'});
                                        });
                                    });
                                } else {
                                    init++;
                                    createImage();
                                }

                            } else {
                                ui.updateProcess('静态资源保存成功...', 40, function () {
                                    util.loadSuccess(subEntry);
                                })
                            }
                        }
                    });
                    subEntry.getFile(name + '.sav', {create: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.write(new Blob([JSON.stringify(editor)]), {type: 'text/plain'});
                            ui.updateProcess('保存配置成功...', 10, function () {
                                setTimeout(function () {
                                    util.loadSuccess(subEntry);
                                }, 2000);
                            });
                            console.log('---- Save File Writed ---')
                        });
                    });
                });
            })
        });
    });
    //是否分享
    $('#topRightShare').on('click', function () {
        if ($(this).get(0).checked) {
            var create_window = chrome.app.window.get('linkShareWindow');
            if (create_window) {
                create_window.close();
            }
            chrome.app.window.create('../../html/shareEdit.html', {
                'id': 'rightShareWindow',
                'bounds': {
                    'width': 480,
                    'height': 320
                },
                'resizable': false,
                'frame': 'none'
            });

        }
    });
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        if (msg == 'succeed') {
            setTimeout(function(){
                chrome.storage.local.get('shareData', function (result) {
                    //右上角按钮的图片
                    shareData = result.shareData;
                    shareData.rightBuutonImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAU1JREFUWAntlDtOw0AQhrNrt6RKZ7nOAfzoQPTcATpOAA2IFC5QotwClHMQic6Pa/gEdInX/LPySHaIC4o1FDPSaHfHO55f3+7ObCYmBISAEBACQkAICAEh4JCA4n+naXppjHls2zammFKq1Fpv8zz/5D1jo8tcj4rGcfwEce+YLuEXnS8h9i4IgmNd16MiXeeqJEmuIG4PUQf4Cv4GJ7uFZ3Df87zrcySnyPVB6QEi6KhXVVVtMLJtoiii+ZqOHuMPilPkar5zEMDkSBSbjfX2cNyOvbizXD2o+A8Xml5rp4vu3KnZWG/P4Hsv7izXp1bSNM0NKmfdnePj4kdiaM9AWbeYItf2QbSKZ9ynDHVPj9yA0ktZlq/nBFLMda7tg9TnwjD8QL0FfA7/grA92st9URQ7rEftr3JHBckHISAEhIAQEAJCQAgIgd8Q+AYwAv2bZ1C8hgAAAABJRU5ErkJggg==';
                    editor.page[0].shareData = shareData;
                });
            },100);
            sendResponse('00');
        } else if (msg == 'failure') {
            $("#topRightShare").attr("checked", false);
            sendResponse('00');
        } else {
            console.log(msg);
        }
    });
//工具方法
    var util = {
        //读取json
        loadConfig: function () {
            if (!editor) {
                //错误异常
            }
            $('#projectName').val(editor.projectName);
            $('#lastDate').text(editor.lastDate);
            $('#projectAmount').text(editor.projectAmount);
            //其他模块加载
        },
        getStyleStr: function (data) {
            var str = "";
            var length = data.length;
            //layout单独处理
            for (key in data[0].style) {
                str += key + "{";
                var temp = data[0].style[key];
                for (sheet in temp) {
                    str += sheet + ":" + temp[sheet] + ";";
                    console.log(sheet + '=============' + temp[sheet]);
                    if (temp[sheet] !== 0 && sheet !== 'background-image') {
                        if (temp[sheet].indexOf('px') > -1) {
                            var parseIntParentStyleVal = parseInt(temp[sheet]);
                            if (parseIntParentStyleVal == 0) {
                                temp[sheet] = 0;
                            } else {
                                temp[sheet] = parseIntParentStyleVal / 100 + 'rem';
                            }
                            console.log(sheet + '======  共有属性转化为 =======' + temp[sheet]);
                        }
                    }
                }
                str += "}";
            }
            //组件
            for (var i = 1; i < length; i++) {
                var tempComp = data[i].style;
                for (key in tempComp) {
                    str += '#' + data[i].parent + " " + key + "{";
                    var sheetTemp = tempComp[key];
                    for (sheet in sheetTemp) {
                        str += sheet + ":" + sheetTemp[sheet] + ";";
                        console.log(sheet + '=============' + sheetTemp[sheet]);
                        if (sheetTemp[sheet] !== 0 && sheet !== 'box-shadow' && sheet !== 'background-image') {
                            if (sheetTemp[sheet].indexOf('px') > -1) {
                                var parseIntStyleVal = parseInt(sheetTemp[sheet]);
                                if (parseIntStyleVal == 0) {
                                    sheetTemp[sheet] = 0;
                                } else {
                                    sheetTemp[sheet] = parseIntStyleVal / 100 + 'rem';
                                }
                                console.log(sheet + '======= 私有属性转化为 ======' + sheetTemp[sheet]);
                            }
                        }
                    }
                    str += "}";
                }
            }
            return str;
        },
        getDomStr: function (data) {
            var str = "";
            str = data[0].pageStr;
            var length = data.length;
            var title = '';
            if (!editor.projectName || editor.projectName === '') {
                title = '无标题'
            } else {
                title = editor.projectName;
            }
            str = str.replace('<title></title>', '<title>' + title + '</title>');
            for (var i = 1; i < length; i++) {
                var getDomHref = data[i].href;
                var getDomSrc = './image/' + data[i].parent + '.png';
                var subStr = data[i].pageStr;
                if (subStr.indexOf('linkButton') > -1) {
                    console.log('链接按钮');
                    var linkButtonStr = subStr.substring(0, 3) + 'href = \"' + getDomHref + '\"' + ' ' + subStr.substring(3, subStr.length);
                    str = str.replace("<div id=\"" + data[i].parent + "\"></div>", "<div id=\"" + data[i].parent + "\">" + linkButtonStr + "</div>");
                } else if (subStr.indexOf('qrCode') > -1 || subStr.indexOf('image') > -1) {
                    console.log('图片和二维码');
                    var qRcodeSrc = subStr.substring(0, 5) + 'src = \"' + getDomSrc + '\"' + ' ' + subStr.substring(5, subStr.length);
                    str = str.replace("<div id=\"" + data[i].parent + "\"></div>", "<div id=\"" + data[i].parent + "\">" + qRcodeSrc + "</div>");
                    str;
                } else {
                    str = str.replace("<div id=\"" + data[i].parent + "\"></div>", "<div id=\"" + data[i].parent + "\">" + data[i].pageStr + "</div>");
                }
            }
            return str;
        },
        getJavaScript: function (data) {
            var str = "";
            str = data[0].js;
            return str;
        },
        loadSuccess: function (subEntry) {
            ui.dismiss();
            ui.showAlert('系统提示', '导出成功', '确认', null, function () {
                ui.dismiss();
            }, null);
        }
    };
})
;