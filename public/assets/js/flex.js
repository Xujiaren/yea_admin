(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
            if(clientWidth>=750){
                docEl.style.fontSize = '200px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
            }
            
        };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);