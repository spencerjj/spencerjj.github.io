
// 监听浏览器,针对不同分辨率计算font-size
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth<=320){
                    docEl.style.fontSize = '15.7px';
                }
                else if(clientWidth>=750){
                    docEl.style.fontSize = '37px';
                }
                else{
                    docEl.style.fontSize = 37 * (clientWidth / 750) + 'px';
                }
            };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);