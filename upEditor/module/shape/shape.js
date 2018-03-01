(function ($, UP) {
    var util = window.UP.W.Util;
    var ui = window.UP.W.Ui;
    var main = window.UP.W.Main;
    // require(['jscolor']);

    var opt = [
        {
            'label':'边数',
            'name':'shapeBord'
        },
        {
            'label':'填充颜色',
            'name':'fillColor'
        },
        {
            'label':'边框颜色',
            'name':'shapeLine'
        },
        {
            'label':'边框厚度',
            'name':'shapeLineWidth'
        }
    ]

    define(function(){
        var dom =   '<svg id="edSvg" style="width:100%;min-height:150px;height:100%;" version="1.0" xmlns="http://www.w3.org/2000/svg">' +
            '<polygon style="fill:#ffffff;stroke:#000000;stroke-width: 1"' +
            'points="188,0 0,150 375,150"' +
            '/>' +
            '<div class="widgetSelectMask">' +
            '<span class="widgetMaskClose"></span>' +
            '</svg>';
        return {
            'options':opt,
            "dom":dom
        }
    });
})(window.Zepto || window.jQuery, window.UP = window.UP || {});

