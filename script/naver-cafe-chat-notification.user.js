// ==UserScript==
// @name         Naver cafe chat notification
// @namespace    http://xoul.kr/naver-cafe-chat-notification
// @description  Change browser's title when new chat arrive during AFK. e.g. "(3) My Chatting Room"
// @version      0.1.0
// @updateURL    https://github.com/devxoul/naver-cafe-chat-notification/raw/master/script/naver-cafe-chat-notification.user.js
// @downloadURL  https://github.com/devxoul/naver-cafe-chat-notification/raw/master/script/naver-cafe-chat-notification.user.js
// @match        https://chat.cafe.naver.com/room/*
// @copyright    2014 Suyeol Jeon (http://xoul.kr)
// ==/UserScript==

(function() {
    var _lastMessageCount;
    var _originalTitle;

    function getMessageCount() {
        return $$('div.msg:not(.my)').length;
    }

    // swizzle method
    oChatRoom._ackMsg = function(msgSn) {
        chat.RequestManager.request("AckMsg", {
            cafeId: this._oDoc.getCafeId(),
            roomId: this._oDoc.getRoomId(),
            msgSn: msgSn
        }, tick);
    }

    function tick() {
        if (!_originalTitle) {
            _originalTitle = $$.getSingle('title').innerHTML;
        }
        if (document.hasFocus()) {
            return;
        }
        var newMessageCount = getMessageCount() - _lastMessageCount;
        if (!newMessageCount) {
            return;
        }
        if (!_lastMessageCount) {
            _lastMessageCount = newMessageCount;
            return;
        }
        updateTitle(newMessageCount);
    }

    function updateTitle(count) {
        var newTitle;
        if (!count) {
            newTitle = _originalTitle;
        } else {
            newTitle = '(' + count + ') ' + _originalTitle;
        }
        $$.getSingle('title').innerHTML = newTitle;
    }

    window.onfocus = document.onfocus = function() {
        _lastMessageCount = getMessageCount();
        updateTitle(0);
    }
})();
