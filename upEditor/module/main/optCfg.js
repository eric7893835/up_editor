// define(function () {
    var optCfg = {
        "backgroundColor":"<input type='text' disabled class='demo backgroundColor' value='#ffffff' data-name='backgroundColor'>",
        "bgsrc": "<a id='chooseBg' data-name='bgsrc' href='#'>点击选择图片</a> <span id='delBg'>清除</span>",
        "bgSet":"<select data-name='bgSet'>" +
        "<option value='100% 100%'>背景拉伸</option>" +
        "<option value='repeat'>背景重复</option>" +
        "</select>",
        "remarkText":"<input type='text' data-name = 'remarkText' class='remarkText' value='占位'>",
        "blankBackground":"<input type='text'  class='demo blankBackground' value='#ffffff' data-name='blankBackground'>",
        "blankfontColor":"<input type='text'  class='demo blankfontColor' value='#666666'  data-name='blankfontColor'>",
        "blankfontSize":"<input type='number' class='blankfontSize' min='16' value='16' data-name='blankfontSize' >",
        "blankfontBold":"<select data-name='blankfontBold' class='blankfontBold'>" +
        "<option value='normal'>细</option>" +
        "<option value='bold'>粗</option>" +
        "</select>",
        "src": "<a id='chooseImg' data-name='src' href='#'>点击选择图片</a>",
        "shapeBord": "<select>" +
        "<option value='3'>3</option>" +
        "<option value='4'>4</option>" +
        "<option value='5'>5</option>" +
        "<option value='6'>6</option>" +
        "<option value='7'>7</option>" +
        "<option value='8'>8</option>" +
        "<option value='9'>9</option>" +
        "</select>",
        "fillColor": "<input type='text'  class='fillColor' data-control='fillColor' value='#ffffff' data-name='fillColor'>",
        "shapeLine": "<input type='text'  class='shapLine' data-control='shapeLine' value='#000000' data-name='shapeLine'>",
        "shapeLineWidth": "<input type='text'  class='shapeLineWidth' data-control='shapeLineWidth' value='#000000' data-name='shapeLineWidth'>",
        "qrLink": "<input type='text' class='qrText' data-name='qrLink' value='http://example.com'/>",
        "qrImg":"<a data-name='qrImg' data-name='qrImg' href='#'>点击选择图片</a>",

        "buttonText": "<input type='text' class='buttonText' placeholder='请输入文本' value='' data-control='buttonText' data-name='buttonText'/>",
        "buttonLink": "<input type='text' class='buttonLink' placeholder='请输入您的链接' value='www.example.com' data-control='buttonLink' data-name='buttonLink'/>",
        "buttonFillColor": "<input type='text' class='buttonFillColor demo' placeholder='背景色' data-control='buttonFillColor' value='#7AD80B' data-name='buttonFillColor'>",
        "buttonBgSrc": "<a class='buttonUpload' data-control='buttonUpload' data-name='buttonBgSrc' href='#'>点击选择图片</a>" +
                       "<a class='clearBgImage' data-control='clearBgImage' href='#'>清除</a>",
        "fontColor": "<input type='text'  class='demo fontColor' placeholder='字体颜色' value='#fff' data-control='fontColor' data-name='fontColor'>",
        "buttonBorderColor": "<input type='text'  class='demo buttonBorderColor' placeholder='描边颜色' value='#969696' data-control='buttonBorderColor' data-name='buttonBorderColor'>",
        "buttonBorderWidth": "<input type='number' min='0' step='1' class='buttonBorderWidth' placeholder='描边宽度' value='1' data-control='buttonBorderWidth' data-name='buttonBorderWidth'>",
        "buttonBorderRadius": "<input type='number' min='0' step='1'  class='buttonBorderRadius' placeholder='边框弧度' value='5' data-control='buttonBorderRadius' data-name='buttonBorderRadius'>",
        "fontSize": "<input type='number' min='10' step='1' class='fontSize' placeholder='字体大小' data-control='fontSize' value='16' data-name='fontSize'>",
        "buttonHeight": "<input type='number' min='20' step='1' class='buttonHeight' placeholder='高度' value='42' data-control='buttonHeight' data-name='buttonHeight'>",

        "linearGradientStyle": "<select data-control='linearGradientStyle' data-name='linearGradientStyle'>" +
                                "<option value='0'>无</option>" +
                                "<option value='1'>从上到下</option>" +
                                "<option value='2'>从左到右</option>" +
                                "<option value='3'>对角渐变</option>" +
                                "</select>",

        "linearGradientFrom": "<input type='text'  class='demo linearGradient' placeholder='从' data-control='linearGradientFrom' value='#fff' data-name='linearGradientFrom'>",
        "linearGradientTo": "<input type='text'  class='demo linearGradient' placeholder='至' data-control='linearGradientTo' value='#fff' data-name='linearGradientTo'>",

        "boxShadowOffset": "<input type='number' min='0' step='1' class='boxShadowOffset' placeholder='X轴偏移' value='0' data-control='boxShadowX' data-name='boxShadowOffset'>" +
        "<input type='number' min='0' step='1' class='boxShadowOffset' placeholder='Y轴偏移' value='0' data-control='boxShadowY' data-name='boxShadowOffset'>",

        "boxShadow": "<input type='number' min='0' step='1' class='boxShadowOffset' placeholder='虚化半径' value='0' data-control='boxShadowR' data-name='boxShadow'>",

        "boxShadowColor": "<input type='text'  class='demo boxShadowOffset' placeholder='阴影颜色' value='#fff' data-control='boxShadowColor' data-name='boxShadowColor'>",

        "buttonOpacity": "<input class=\"rangeTxt\" value=\"100\" data-control='buttonRange' data-name='buttonOpacity'/>" +
        "<input type=\"range\" value=\"100\" min=\"0\" max=\"100\" data-control='buttonOpacity' data-name='buttonOpacity'/>",
        "isShare":"<input type='checkbox' name='isShare' data-control='isShare' class='isShare' data-name='isShare'>",
        "isDownloadPage":"<input type='checkbox' name='isDownloadPage' data-control='isDownloadPage' class='isDownloadPage' data-name='isDownloadPage'>",
        //----------------------- 富文本分割线
        "editRichtext":"<button type='button' class='editRichtext' data-name='editRichtext' id='editRichtext'>编辑</button>",
        "clearFormat": "<button type='button' class='clearFormat' data-name='clearFormat' id='clearFormat'>清除格式</button>",
        "borderRadius": "<select data-name='borderRadius' id='selRadius'>" +
        "<option value='0'>手动</option>" +
        "<option value='1'>50%</option>" +
        "</select>" +
        "<input type='number' value='0' max='375' id='changeRadius'/>"
    };
//     return optCfg;
// });
