/*
combined files : 

gallery/hoverGetWord/1.0/index

*/
/**
 * [hoverGetWord是实现hover取词的一个小组件，目前只适应于现在浏览器，IE低版本浏览器不适用]
 * @param  {[type]} S    [description]
 * @param  {[type]} Base [description]
 * @return {[type]}      [description]
 */
KISSY.add('gallery/hoverGetWord/1.0/index',function(S, Base) {
    function HoverGetWord(config) {
        var self = this;

        HoverGetWord.superclass.constructor.call(self, config);

        self.init();
    }

    S.extend(HoverGetWord, Base, {
        /**
         * [_init 组件初始化函数，主要完成对mousemove事件的监听，然后设定一个timeout来获取定点单词]
         * @return {[type]} [description]
         */
        init: function() {
            var self = this,
                el = self.get('el'),
                maxAge = self.get('maxAge'),
                res = null,
                timer = null;


            var isFirst = true;

            S.one(window).on('mousemove', function(eo) {
                isFirst = true;
                clearInterval(timer);

                timer = setInterval(function() {
                    if (isFirst) {
                        var x = eo.pageX - S.one(window).scrollLeft(),
                            y = eo.pageY - S.one(window).scrollTop();

                        var res = self.getWordAtPoint(el.getDOMNode(), x, y);
                        self.get('callback')(res);
                        isFirst = false;
                    }

                }, self.get('timout'));
            });
        },
        /**
         * [getWordAtPoint 获取指定点的单词，如果存在返回单词，如果不存在返回null]
         * @param  {[type]} dn [domNode节点]
         * @param  {[type]} x  [鼠标相对于doc左上角的x偏移]
         * @param  {[type]} y  [鼠标相对于doc右上角的y偏移]
         * @return {[type]}    [获取到的单词]
         */
        getWordAtPoint: function(dn, x, y) {
            if (!dn) return;

            var self = this,
                i = 0,
                len = 0,
                res = null;

            if (dn.nodeType === 3) {
                res = self._getWord(dn, x, y);
            } else {
                len = dn.childNodes.length;
                for (i = 0; i < len; i++) {
                    if (self._tagFilter(dn.childNodes[i].nodeName, ['SCRIPT', 'STYLE'])) {
                        res = res || self.getWordAtPoint(dn.childNodes[i], x, y);
                    }
                }
            }

            return res;
        },
        /**
         * [_tagFilter 对于某些节点，根本不需要遍历其中的内容，直接过滤掉，比如script里面的内容]
         * @param  {[type]} nn   [nodeName]
         * @param  {[type]} tags [需要过滤掉的标签数组]
         * @return {[type]}      [description]
         */
        _tagFilter: function(nn, tags) {
            var i = 0,
                len = tags.length;

            for (i = 0; i < len; i++) {
                if (tags[i] === nn) {
                    return false;
                }
            }

            return true;
        },
        /**
         * [_getWord 获取textNode的定点单词]
         * @param  {[type]} tn [textNode]
         * @param  {[type]} x  [鼠标坐标]
         * @param  {[type]} y  [鼠标坐标]
         * @return {[type]}    [获取到的单词]
         */
        _getWord: function(tn, x, y) {
            var range = document.createRange();
            range.selectNodeContents(tn);

            var sp = 0,
                ep = 0,
                rect = null,
                str = range.toString(),
                len = str.length,
                i = 0,
                word = null;

            while (word = str.match(/\b\S+\b/)) {
                i = str.search(/\b\S+\b/);
                sp = ep + i;
                ep = sp + word[0].length;
                range.setStart(range.startContainer, sp);
                range.setEnd(range.startContainer, ep);

                rect = range.getBoundingClientRect();
                if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
                    return word[0];
                }

                str = str.slice(i + word[0].length);
            }

            return null;
        }
    }, {
        ATTRS: {
            name: {
                value: 'HoverGetWord'
            },
            timeout: {
                value: 1000
            },
            el: {
                value: null
            },
            callback: {
                value: function(res) {
                    console.log(res);
                }
            }
        }
    });
    return HoverGetWord;
}, {
    requires: ['base']
});

