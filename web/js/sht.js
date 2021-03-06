;(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true*/
    /*global define, Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                            if (!event.propagationStopped) {
                                callback(event);
                            }
                        }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {
        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function (targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }

        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function (layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        return new FastClick(layer, options);
    };


    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function () {
            return FastClick;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
}());

$(function () {
    FastClick.attach(document.body);
    window.console = window.console || {};
    console.log || (console.log = function () {
    });
});

//IsDebug = true;
/******************************************************
 * 全局变量
 */
var g_bIsOpenInWf = false;
var g_nOpenProcId = 0;
var g_nOpenWfId = 0;
var g_nShtInsRight = 0; // 权限：0/1只读；2修改；3完全
var g_bIsNew = false;
//var g_procRightSet = new ProcRightSet();
var shtCols = [];
var shtTables = null;
var shtValues = null;
var shtChecks = null;
var shtIns = new CPCShtIns();
var grid = new CPCShtGrid("cell_shttable");
g_userSht = null;

var g_editing_text = null;
var g_editing_value = null;
var g_common_searching = false;
var g_tr = null;
var g_treeObj = null;
var g_currentNode = null;
var g_wstype = 4;
var g_modid = 12;
var g_noEditing = false;
var g_docSelect = false;
var g_creator = "";
var g_wsright = "";
var g_inputParams = [];
var g_effectiframe_default = null;
var g_ueditor = [];

var DATA_SEPARATOR = ""; // 数据分隔符

/******************************************************
 * cpcshtcol方法
 */
/**
 * 初始化shtCol
 */
CPCShtCol.prototype.initCol = function () {

    //1.检查影响列与被影响列
    var test = /\[(.+?)]/ig;
    var r1, r2, r3, r4, r5, aEffectCol, aEffectTable, tableName, colName, shtTable, effectCol;
    //1.1检查影响列
    if (this.effectcol) {
        while (r1 = test.exec(this.effectcol)) {
            aEffectCol = r1[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '被影响列定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            if (!shtTable)continue;
            effectCol = shtTable.getDataCol(colName);
            if (effectCol) {
				this.addEffectCol(effectCol);
				//判断影响列属性，并初始化影响列的值
				setTimeout(function(){
				   //this.onCellDataChanged(0);
				})
				//
			}
        }
    }
    //1.2计算字段检查被影响列
    if (this.colval == '<COMPUTE>' && this.colstylenote) {
        //    console.log(this.colstylenote);
        while (r2 = test.exec(this.colstylenote)) {
            aEffectCol = r2[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '样式值定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            if (!shtTable)continue;
            effectCol = shtTable.getDataCol(colName);
            if (effectCol) effectCol.addEffectCol(this);
        }
    }
    //1.3检查影响样式列
    if (this.effectstylecol) {
        while (r3 = test.exec(this.effectstylecol)) {
            aEffectCol = r3[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '被影响样式列定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            if (!shtTable)continue;
            effectCol = shtTable.getDataCol(colName);
            effectCol.m_colstylenote = effectCol.colstylenote;
            if (effectCol) this.addEffectStyleCol(effectCol);
            if (effectCol.m_colstylenote.indexOf('sql=') == 0)
                effectCol.getColStyleValue($(this).attr('cpcrow')||0);
        }
    }
    //1.4检查影响表
    if (this.effecttable) {
        while (r4 = test.exec(this.effecttable)) {
            aEffectTable = r4[1];
            if (!aEffectTable) throw this.colalias + '被影响表定义出错';
            shtTable = getDataTableByName(aEffectTable);
            if (shtTable) this.addEffectTable(shtTable);
        }
    }

    //1.5检查影响IFrame
    if (this.effectiframe) {
        while (r5 = test.exec(this.effectiframe)) {
            aEffectCol = r5[1].split('.');
            if (aEffectCol.length < 2) throw this.colalias + '被影响IFrame定义出错';
            tableName = aEffectCol[0];
            colName = aEffectCol[1];
            shtTable = getDataTableByName(tableName);
            if (!shtTable)continue;
            effectCol = shtTable.getDataCol(colName);
            if (effectCol) this.addEffectIFrame(effectCol);
        }
        if (this.effectiframe.indexOf('^default') > 0) {
            //doAfterLodad=openIFrame(shtCol, shtCell);
            g_effectiframe_default = this;
        }
    }

    //检查富文本单元格
    if (this.colstyle == 13) {
        g_ueditor.push(this);
    }

    //2.数据列显示模式
    if (this.hidecol == 2 || this.hidecol == 3) {
        if (this.hideprocid) {
            //关联过程不是当前过程,设置为正常模式
            if (wrapQuotedStr(this.hideprocid,',').indexOf(wrapQuotedStr(g_nOpenProcId,',')) < 0) {
                this.hidecol = 1;
            }
        }
    }


    //非授权用户或角色,设置为匿名模式
    if (this.authuser || this.authrole) {
        var authUser = this.authuser && wrapQuotedStr(this.authuser, ',').indexOf(wrapQuotedStr(g_USERID, ',')) > -1;
        var authRole = this.authrole && isContainRole(g_USERROLE, this.authrole);
        if (!authUser && !authRole) {
            this.hidecol = 3;
        }
    }

    //3.数据列是否允许编辑
    this.editable = g_userSht.shttype != 7
        && g_nShtInsRight >= 2
        && this.colstyle >= 0
        && this.hidecol != 2
        && this.hidecol != 3
        && this.autocode != 2            //非自动编码字段
        && this.colval != '<COMPUTE>'
        && !(this.colval && this.colval.indexOf('<WF') == 0)
        && !(this.rightprocid           //TODO 要先判断整个表单有没有数据列设置了过程权限
        && wrapQuotedStr(this.rightprocid, ',').indexOf(wrapQuotedStr(g_nOpenProcId, ',')) < 0)
        //TODO 其他权限
        && true;

    //4.数据列是否可以为空
    var flag1, flag2;
    flag1 = (this.colnilprocid.length > 0);
    flag2 = wrapQuotedStr(this.colnilprocid, ',').indexOf(wrapQuotedStr(g_nOpenProcId, ',')) < 0;
    this.nilable = this.autocode == 2 || this.colnilflag == 2 || g_nOpenProcId > 0 ||
        (this.colnilflag == 1 && flag1 && flag2);

    //5.数据列颜色？

    //TODO 其余初始化工作
   // console.log(this);
};
/**
 * 判断工作流过程中是否可以修改，暂时没使用
 * @param procId    流程节点
 * @returns {boolean}
 */
CPCShtCol.prototype.hasRight = function (procId) {
    if (!this.rightprocid) return false;
    var result = (',' + this.rightprocid + ',').indexOf(',' + procId + ',') > -1;
    //TODO 权限有必要进行缓存?
    return result;
};
/**
 * 该列是否可以修改
 * @return {boolean|*}
 */
CPCShtCol.prototype.canModify = function () {
    return (this.editable == true || this.editable == "true") && true; //TODO 有一些动态条件
};
/**
 * 该列是否可以为空
 * @return {boolean|*}
 */
CPCShtCol.prototype.canBeNull = function () {

    return this.nilable && true; //TODO 有一些动态条件
};

/**
 * 单元格改变事件
 * @param rowNo  改变的行号
 */
CPCShtCol.prototype.onCellDataChanged = function (rowNo) {
    rowNo = rowNo || 0;
    //console.log('onCellDataChanged:' + this.getFullName());

    var cols = this.getEffectCol();
    var stylecols = this.getEffectStyleCol();
    var tables = this.getEffectTable();
    //先分一下组，将相同变量的放一起
    var aEffectCol, aEffectStyleCol, aEffectTable, colVal, colStyleNote, effectCols, varCode, i, j, variable = {};

    if (stylecols && stylecols.length > 0) {
        // 有影响单元格样式，修改相应单元格样式值
        for (i = 0; i < stylecols.length; i++) {
            // 取相应单元格
            aEffectStyleCol = stylecols[i];
            console.log(aEffectStyleCol);
            //存放之前的样式值
            if (!aEffectStyleCol.m_colstylenote) {
                aEffectStyleCol.m_colstylenote = aEffectStyleCol.colstylenote;
            }
            colStyleNote = aEffectStyleCol.m_colstylenote;
            //目前只处理了样式值为sql的
            if (colStyleNote.indexOf('sql=') == 0)
                aEffectStyleCol.getColStyleValue(rowNo);
        }
    }

    if (tables && tables.length > 0) {
        // 有影响表
        for (i = 0; i < tables.length; i++) {
            // 取相应单元格
            aEffectTable = tables[i];
            console.log(aEffectTable);
            var table_sql = aEffectTable.sqls;
            //替换变量
            var sql = replaceShtData(table_sql, rowNo, true);
            var newSht = new CPCUserSht();
            newSht.shttype = 2;
            newSht.inswfid = 0;
            newSht.shtinsid = 0;
            if (!newSht.cpcshttableofcpcusershts) newSht.cpcshttableofcpcusershts = [];
            newSht.cpcshttableofcpcusershts[0] = aEffectTable.clone();
            newSht.cpcshttableofcpcusershts[0].sqls = sql;
            //数据重置
            for (j = 0; j < newSht.cpcshttableofcpcusershts[0].cpcshtcolofcpcshttables.length; j++) {
                newSht.cpcshttableofcpcusershts[0].cpcshtcolofcpcshttables[j].data = "";
            }
            var d = newSht.postRequest('vquery').done(function () {
                var table = newSht.cpcshttableofcpcusershts[0];
                for (k = 0; k < aEffectTable.cpcshtcolofcpcshttables.length; k++) {
                    aEffectTable.cpcshtcolofcpcshttables[k].data = table.cpcshtcolofcpcshttables[k].data;
                }
                $('.cpcadd.' + table.tablename).remove();
                aEffectTable.showData();
            });
        }
    }


    if (cols && cols.length > 0) {
        // 有影响单元格，修改相应单元格
        for (i = 0; i < cols.length; i++) {
            // 取相应单元格
            aEffectCol = cols[i];
            colVal = aEffectCol.colval;
            //计算字段直接计算
            if (colVal == '<COMPUTE>') {
                //若当前单元格为定长,被当前单元格影响列为不定长...则计算所有...
                if (this.fixlen == 1 && aEffectCol.fixlen == 2) {
                    var cells = aEffectCol.getColCell();
                    var $cell,cRowNo;
                    for (var k=0;k<cells.length;k++) {
                        $cell = $(cells[k]);
                        cRowNo = $cell.attr('cpcrow');
                        if (cRowNo) {
                            aEffectCol.compute(cRowNo);
                        }
                    }
                }
                else {
                    aEffectCol.compute(rowNo);
                }
            } else if (colVal == '<VARIABLES>') {
                //console.log(aEffectCol.varcode);
                varCode = aEffectCol.varcode;
                effectCols = variable[varCode];
                if (!effectCols) effectCols = variable[varCode] = [];
                effectCols.push(aEffectCol);
            }
        }
    }
    var shtValue,returnData,type,effectRow,varFormat,datas,aData,shtCell;
    for (varCode in variable) {
        returnData = undefined;
        effectCols = variable[varCode];
        for (j=0;j<shtValues.length;j++) {
            shtValue = shtValues[j];
            if (shtValue.varcode == varCode) break;
            else shtValue = null;
        }
        if (!shtValue) continue;
        try {
            returnData = shtValue.getShtValue(rowNo);
        } catch (e) {
            console.log(e);
        }
        //console.log(returnData);
        type = (typeof returnData);
        //console.log(type);
        if ((type != 'string') && (type != 'number')) continue;
        //处理变量的值
        varFormat = shtValue.varformat;
        varCode = shtValue.varcode;
        //console.log(varCode);
        //返回多个值的情况
        if (varCode.indexOf(':1') > -1) {
            datas = returnData.split(DATA_SEPARATOR);
            for (j=0;j<effectCols.length;j++) {
                aEffectCol = effectCols[j];
                effectRow = aEffectCol.fixlen == 1?0 : rowNo;
                shtCell = aEffectCol.getColCell(effectRow);
                aData = datas[j] || '';
                if (shtCell.length > 0) {
                    aEffectCol.setCellValueNew(shtCell, aData, aData, true);
                }
            }

        } else if (varFormat == 2) {
            //包含描述信息
            datas = returnData.split('$');
            if (datas.length !=2) continue;
            for (j=0;j<effectCols.length;j++) {
                aEffectCol = effectCols[j];
                effectRow = aEffectCol.fixlen == 1 ? 0 : rowNo;
                shtCell = aEffectCol.getColCell(effectRow);
                if (shtCell.length > 0) {
                    aEffectCol.setCellValueNew(shtCell, datas[0], datas[1], true);
                }
            }
        } else {
            for (j=0;j<effectCols.length;j++) {
                for (j=0;j<effectCols.length;j++) {
                    aEffectCol = effectCols[j];
                    effectRow = aEffectCol.fixlen == 1 ? 0 : rowNo;
                    shtCell = aEffectCol.getColCell(effectRow);
                    aData = returnData || '';
                    if (shtCell.length > 0) {
                        aEffectCol.setCellValueNew(shtCell, aData, aData, true);
                    }
                }
            }
        }
    }
};

CPCShtTable.prototype.showData = function () {
    console.log('显示数据表: ' + this.tablename);

    var m, k, i, shtCol, rowNo, ColNo, shtCell;
    var shtCols = this.cpcshtcolofcpcshttables;
    var shtTable = this;

    for (k = 0; k < shtCols.length; k++) {
        shtCol = shtCols[k];
        //设置单元格属性值
        if (this.fixlen == 1) {
            return;
        } else {
            var startRow = this.startrow;
            var endRow = this.endrow;
            var bcanModify = shtCol.canModify();
            if ($('#sheet_table_' + shtCol.shtpage).length > 0)
                shtCell = $('#sheet_table_' + shtCol.shtpage).find('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
                    var offset = getCellOffset(this.id);
                    return (offset.row >= startRow && offset.row <= endRow);
                });
            else
                shtCell = $('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
                    var offset = getCellOffset(this.id);
                    return (offset.row >= startRow && offset.row <= endRow);
                });
            //   console.log(shtCell.length);
            shtCell.each(function (index) {
                $(this).attr({
                    cpccolid: shtCol.colid,
                    cpctableid: shtTable.tableid,
                    cpctable: shtTable.tablename,
                    cpcrow: index,
                    cpceditable: bcanModify,
                    cpcautocode: shtCol.autocode
                });
            });
            //  shtCell.addClass('zebra');

            //不定长表自动编码字段自动编码
            //  console.log('autocode:' + shtCol.colname + ' ' + shtCol.autocode);
            if (shtCol.autocode == '2') {
                console.log('自动编码' + shtCol.colname);
                shtCell.each(function (index) {
                    shtCol.setCellValueNew(this, index + 1, index + 1, false);
                });
            }
        }
        shtCell.addClass('cpcvalue');
        shtCell.data('cpccol', shtCol);//Cache Col
        shtCell.data('cpctable', this);//Cache Table

        shtCol.setCellColor(shtCell[0]);
    }
    //不定长表重新计算行
    if (this.fixlen == 2) {
        var oldLength = this.endrow - this.startrow + 1;
        var dataLength = this.getDataLength(true);
        //   console.log(dataLength);
        if (dataLength > oldLength) {
            // console.log(oldLength);
            // console.log(dataLength);
            this.rowcount += dataLength - oldLength;
            this.appendRow(oldLength - 1, dataLength - oldLength);
        }
        //将长度保存到对应表中，保存调用
        // for (i = 0; i < shtTables.length; i++) {
        //     if (shtTables[i].tablename == this.tablename)
        //         shtTables[i].a_datalength=dataLength;
        // }
    }
    //   return;

    //填充数据
    for (k = 0; k < shtCols.length; k++) {
        shtCol = shtCols[k];
        if ($('#sheet_table_' + shtCol.shtpage).length > 0)
            shtCell = $('#sheet_table_' + shtCol.shtpage).find('[cpccolid=' + shtCol.colid + ']');
        else
            shtCell = $('[cpccolid=' + shtCol.colid + ']');
        shtCol.initCellValue(shtCell);
    }
};
/**
 * 计算单元格的值
 * @param rowNo 触发计算的单元格行号，非当前需要计算的单元格行号
 */
CPCShtCol.prototype.compute = function (rowNo) {
    rowNo = rowNo || 0;
    //非计算字段
    if ('<COMPUTE>' != this.colval) return;
    //样式值为空
    if (!this.colstylenote) return;

    var value='';
    var test,intest,r,inr,result,shtTable,shtCol,shtTableName,shtColName,tmp,intmp;
    var strTmp = this.colstylenote;
    test = /SUM\((.+?)\)/ig;
    while  (r = test.exec(strTmp)) {
        result = SUM.apply(this, r[1].split(','));
        //当中可能包含特殊字符，不使用正则匹配
        strTmp = strTmp.slice(0,r.index) + result + strTmp.slice(r.index + r[0].length);
    }

    test = /AVERAGE\((.+?)\)/ig;
    while  (r = test.exec(strTmp)) {
        result = AVERAGE.apply(this, r[1].split(','));
        //当中可能包含特殊字符，不使用正则匹配
        strTmp = strTmp.slice(0,r.index) + result + strTmp.slice(r.index + r[0].length);
    }

    test = /left\((.+?)\)/ig;
    while  (r = test.exec(strTmp)) {
        tmp = r[1].split(',');
        if (tmp.length != 2 || !(/^\d+$/.test(tmp[1]))) throw 'left函数定义错误';
        intest = /\[(.+?)]/ig;
        var newStr1 = tmp[0];
        while (inr = intest.exec(newStr1)) {
            intmp = inr[1].split('.');
            shtTableName = intmp[0];
            shtColName = intmp[1];
            shtTable = getDataTableByName(shtTableName);
            shtCol = shtTable.getDataCol(shtColName);
            result = shtCol.getValue(rowNo);
            newStr1 = newStr1.replace(new RegExp('\\' + inr[0], 'g'), result);
        }
        newStr1 = newStr1.substring(0,tmp[1]);

        //当中可能包含特殊字符，不使用正则匹配
        strTmp = strTmp.slice(0,r.index) + newStr1 + strTmp.slice(r.index + r[0].length);
    }

    //    console.log(strTmp);
    test = /\[(.+?)]/ig;
    var newStr = strTmp;
	//时间日期正则表达式yyyy-mm-dd hh:mm:ss
	var dateTimeRegExp = /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
	var bDateTimeCompute = false;
    while (r = test.exec(strTmp)) {
        tmp = r[1].split('.');
        shtTableName = tmp[0];
        shtColName = tmp[1];
        shtTable = getDataTableByName(shtTableName);
        shtCol = shtTable.getDataCol(shtColName);
        result = shtCol.getValue(rowNo);
		//时间计算的特殊处理
		if(result && dateTimeRegExp.test(result)){
			var sdate = new Date(result.replace(/-/g, "/")); 
			result = sdate.getTime();
			bDateTimeCompute = true;
		}
        if (newStr.indexOf('=left(') == 0) return;

        result = parseFloat(result);
        if (isNaN(result)) result = 0;
        newStr = newStr.replace(new RegExp('\\' + r[0], 'g'), result);
    }

    //console.log(newStr);
    eval('value' + newStr);
    //还要进行判断 如果是存在多行数据的计算，也就是rowNo大于0时，那么除数未0的结果就应该为空不显示出来，这样避免后台多保留多余的带有0值的数据
	if(parseInt(rowNo)>0){
		if(value==0){
			value='';
		}
	}
	
    //时间计算的特殊处理 计算天数
	if(bDateTimeCompute){
		value = Number(value/(1000 * 60 * 60 * 24)).toFixed(2);
	}
	
    if (Number(value)) {    //许多小数计算后由于精度问题出现XXX.XXX000000000001等情况...所以略去小数12位后
        value = parseFloat(Number(value).toFixed(12));
    }

    //计算的数据表为定长表，行号置为0，否则为当前编辑行的行号
    if (this.fixlen == 1) rowNo = 0;

    var shtCell = this.getColCell(rowNo);
    if (shtCell.length > 0) {
		//判断是否是特殊未处理
		if(isNaN(value)||value=='Infinity'){
            value='';
        }
        this.setCellValueNew(shtCell, value, value, true);
    }
};

/**
 * 获取完整列名
 * @param isBracketStr  是否包含中括号
 * @return {string}
 */
CPCShtCol.prototype.getFullName = function (isBracketStr) {
    var shtTable = getDataTableById(this.tableid);
    var fullName = shtTable.tablename +  '.' + this.colname;
    if (isBracketStr) fullName = '[' + fullName + ']';
    return fullName;
};

/*CPCShtCol.prototype.getData = function () {
    //debugger
    var value = this.data;

    if (null == value) {
        // 取默认值
        value = this.colval;
        // clt
        if (value == null || value == "null") return "";

        //Logger.debug("getData get default value: "+value);
        if (value && '<' == value.charAt(0)) {
            // 替换变量
            if ("<TODAYTIME>" == value) value = FormatDateTime(new Date);
            else if ("<TODAY>" == value) value = FormatDate(new Date);
            else if ("<LOGINUSER>" == value) value = g_USERID;
            else if ("<LOGINUSER>|<LOGINUSERNAME>" == value) {
                value = g_USERID;
                this.colrvalue = g_USERNAME;
            }
            else if ("<LOGINPOSITION>" == value) value = getLoginUser().position;
            else if ("<LOGINORG>" == value) value = getLoginUser().orgname;
            else if ("<LOGINORG>|<LOGINORGNAME>" == value) {
                value = getLoginUser().orgid;
                this.colrvalue = getLoginUser().orgname;
            }
            else if ("<GROUPORGID>" == value) {
                value = g_GROUPORGID;
            }
            else if ("<GROUPORGCODE>" == value) {
                value = g_GROUPORGCODE;
            }
            else if ("<GROUPORGNAME>" == value) {
                value = g_GROUPORGNAME;
            }
            else if ("<DEPTORGID>" == value) {
                value = g_DEPTORGID;
            }
            else if ("<DEPTORGCODE>" == value) {
                value = g_DEPTORGCODE;
            }
            else if ("<DEPTORGNAME>" == value) {
                value = g_DEPTORGNAME;
            }
            else if ("<ROOMORGID>" == value) {
                value = g_ROOMORGID;
            }
            else if ("<ROOMORGCODE>" == value) {
                value = g_ROOMORGCODE;
            }
            else if ("<ROOMORGNAME>" == value) {
                value = g_ROOMORGNAME;
            }
            else if ("<TEAMORGID>" == value) {
                value = g_TEAMORGID;
            }
            else if ("<TEAMORGCODE>" == value) {
                value = g_TEAMORGCODE;
            }
            else if ("<TEAMORGNAME>" == value) {
                value = g_TEAMORGNAME;
            }
            else if ("<COMPORGID>" == value) {
                value = g_COMPORGID;
            }
            else if ("<COMPORGCODE>" == value) {
                value = g_COMPORGCODE;
            }
            else if ("<COMPORGNAME>" == value) {
                value = g_COMPORGNAME;
            }
            else if ("<COMPUTE>" == value || "<VARIABLES>" == value) return "";
            else if ('>' == value.charAt(value.length - 1)) return "";
        }
        return value;
    }

    if (4 == this.coltype) {
        // 日期，过滤时间
        if (value.length > 10 && value.indexOf(DATA_SEPARATOR) == -1) value = value.substring(0, 10);
        return value;
    }

    if ((3 == this.colstyle || 4 == this.colstyle) && this.colrvalue) {

        //value=this.colrvalue;
        this.colstylenote = value + "=" + this.colrvalue;
    }
    else if (4 == this.colstyle) {
        this.colrvalue = value;
    }

    return value;
};*/

/**
 * 初始化单元格数据值
 * @param shtCell
 */
CPCShtCol.prototype.initCellValue = function(shtCell) {
    if (shtCell.length ==0) return;
    var cpcValue,cpcText,tmp,tmp2,aValue,aText,i,j;
    var shtTable = shtCell.data('cpctable');
    if (this.data) {
    	  if (this.colval && this.colval == '<VARIABLES>'){
    	  	     var shtValue;
    	  	     for (j=0;j<shtValues.length;j++) {
                     shtValue = shtValues[j];
                     if (shtValue.varcode == this.varcode) break;
                     else shtValue = null;
               }
                if (shtValue && shtValue.varformat == 2){
    	  	       this.data = this.data.split('$')[0];
    	  	     }
    	  }
    	
        cpcValue = this.data.split(DATA_SEPARATOR);
        cpcText = cpcValue.slice(0);
        if (this.colstyle ==1 || this.colstyle == 2 && this.colstylenote) {//下拉框不能输入 ||下拉框可输入
            tmp = this.colstylenote.split('|');
            for (i=0;i<tmp.length;i++) {
                tmp2 = tmp[i].split('=');
                if (tmp2.length !=2) continue;
                aValue = tmp2[0];
                aText = tmp2[1];
                for (j=0;j<cpcValue.length;j++) {
                    if (cpcValue[j] == aValue) {
                        cpcText[j] = aText;
                    }
                }
            }
        } else if (this.colstyle ==3 || this.colstyle ==7) {//选择不能输入
            if (this.colrtable &&this.colrvalue)
                cpcText = this.colrvalue.split(DATA_SEPARATOR);
        } else if (this.colstyle == 14 && this.colrtable && this.colrvalue) {  //图片
                cpcText = this.colrvalue.split(DATA_SEPARATOR);
        }
    } else if (this.autocode == 2 && shtTable.fixlen ==2){//不定长表自动编码字段自动编码
        cpcValue = cpcText = [];
        shtCell.each(function (index) {
            cpcValue[index] = index + 1;
        });
    } else if (this.colval){//取默认值
	    if (this.colstyle ==1 || this.colstyle == 2 && this.colstylenote) {//下拉框不能输入 ||下拉框可输入
		    this.data = this.colstylenote;
		    tmp = this.colstylenote.split('|');
			cpcValue = this.data.split('|');
            cpcText = cpcValue.slice(0);
            for (i=0;i<tmp.length;i++) {
                tmp2 = tmp[i].split('=');
                if (tmp2.length !=2) continue;
                aValue = tmp2[0];
                aText = tmp2[1];
                for (j=0;j<cpcValue.length;j++) {
                    if (cpcValue[j] == aValue) {
                        cpcText[j] = aText;
                    }
                }
            }
		    
		}else{	    
			switch (this.colval) {
				case "<TODAYTIME>":
					aValue = FormatDateTime(new Date);
					break;
				case "<TODAY>":
					aValue = FormatDate(new Date);
					break;
				case "<LOGINUSER>":
					aValue = getLoginUser().userid;
					break;
				case "<LOGINUSER>|<LOGINUSERNAME>":
					aValue = getLoginUser().userid;
					aText = getLoginUser().username;
					this.colrvalue = getLoginUser().username;
					break;
				case "<LOGINPOSITION>":
					aValue = getLoginUser().position;
					break;
				case "<LOGINORG>":
					aValue = getLoginUser().orgname;
					break;
				case "<LOGINORG>|<LOGINORGNAME>":
					aValue = getLoginUser().orgid;
					aText = getLoginUser().orgname;
					this.colrvalue = getLoginUser().orgname;
					break;
				case "<GROUPORGID>":
					aValue = g_GROUPORGID;
					break;
				case "<GROUPORGCODE>":
					aValue = g_GROUPORGCODE;
					break;
				case "<GROUPORGNAME>":
					aValue = g_GROUPORGNAME;
					break;
				case "<DEPTORGID>":
					aValue = g_DEPTORGID;
					break;
				case "<DEPTORGCODE>":
					aValue = g_DEPTORGCODE;
					break;
				case "<DEPTORGNAME>":
					aValue = g_DEPTORGNAME;
					break;
				case "<ROOMORGID>":
					aValue = g_ROOMORGID;
					break;
				case "<ROOMORGCODE>":
					aValue = g_ROOMORGCODE;
					break;
				case "<ROOMORGNAME>":
					aValue = g_ROOMORGNAME;
					break;
				case "<TEAMORGID>":
					aValue = g_TEAMORGID;
					break;
				case "<TEAMORGCODE>":
					aValue = g_TEAMORGCODE;
					break;
				case "<TEAMORGNAME>":
					aValue = g_TEAMORGNAME;
					break;
				case "<COMPORGID>":
					aValue = g_COMPORGID;
					break;
				case "<COMPORGCODE>":
					aValue = g_COMPORGCODE;
					break;
				case "<COMPORGNAME>":
					aValue = g_COMPORGNAME;
					break;
				default:
					aValue = '';
					break;
			}
			
			aText = aText || aValue;
			cpcValue = new Array(shtCell.length);
			cpcText = new Array(shtCell.length);
			for (i=0;i<shtCell.length;i++) {
				cpcValue[i] = aValue;
				cpcText[i] = aText;
			}
		}
    } else {
        cpcValue = [];
        cpcText = [];
    }

  //  console.log(cpcValue);
  //  console.log(cpcText);

    var that = this;

    //批注
    if (this.note) {
        shtCell.addClass('cpc-note').attr('title', this.note);
  /*      shtCell.tooltip({
            position: 'right',
            backgroundColor: '#fff000',
            content:this.note

        });*/
    }

    shtCell.each(function (index) {
        aValue = cpcValue[index]? cpcValue[index]: '';
        aText = cpcText[index]? cpcText[index]: '';
        if (g_loadParams && that.paramseq && that.paramseq > 0)
            if (g_inputParams[that.paramseq - 1]) {
                aValue = g_inputParams[that.paramseq - 1];
                aText = g_inputParams[that.paramseq - 1];
            }
        that.setCellValueNew(this, aValue, aText, false);
    });
};

/**
 * 获取显示字符串
 * @param value
 * @param text
 * @param nowrap    是否替换换行符
 * @return {string}
 */
CPCShtCol.prototype.getHtmlText = function (value, text, $cell, nowrap) {
    var i, tmp, tmp2, index;
    var htmlText = '';

    if (this.hidecol == 2) {        //2.隐藏模式
        htmlText = '';
    } else if (this.hidecol == 3) {  //3.匿名模式
        htmlText = '***';
    } else {                        //1.正常模式
        //5.真假
        if (this.colstyle == 5) {
            var items = this.colstylenote.split('|');
            htmlText = '<input type="checkbox" ';
            if (items[0] == value) {
                htmlText += ' checked="checked"';
            }
            htmlText += ' onclick="$(this).parent().click()" />';
        } else if (this.colval == '<DOCUMENT>' && text) {
            //3.选择(不能输入) && 文件附件
            //   console.log(text);
            tmp = text.split(';');
            for (i = 0; i < tmp.length; i++) {
                tmp2 = tmp[i];
                index = tmp2.split('=download');
				var url= '';
				var downloadcode = index[1].split('filecode=')[1];
				if (index[0] && (index[0].toLowerCase().toString().endsWith(".jpg") || index[0].toLowerCase().endsWith(".png") || index[0].toLowerCase().endsWith(".jpeg") || index[0].toLowerCase().endsWith(".bmp"))&&parseInt(index[2])<=10*1024*1024) {
					 url = window.location.protocol + '//' + window.location.host+"/viewImage.jsp?"+ "filecode=" + downloadcode + '' + "&filename=" + index[0];
				}else if (index[0] && (((index[0].toLowerCase().endsWith(".doc") || index[0].toLowerCase().endsWith(".docx"))&&parseInt(index[2])<=10*1024*1024) || ((index[0].toLowerCase().endsWith(".xlsx") || index[0].toLowerCase().endsWith(".xls"))&&parseInt(index[2])<=5*1024*1024) || (index[0].toLowerCase().endsWith(".txt")&&parseInt(index[2])<=10*1024*1024) )||(((index[0].toLowerCase().endsWith(".ppt") )||(index[0].toLowerCase().endsWith(".pptx")))&&parseInt(index[2])<=20*1024*1024 )) {
					 url = window.location.protocol + '//' + window.location.host+"/viewFile.jsp?"+ "filecode=" + downloadcode + '' + "&filename=" + index[0];
				}else if (index[0] && (index[0].toLowerCase().endsWith(".pdf") )) {
					 url = window.location.protocol + '//' + window.location.host+"/viewPDF.jsp?"+ "filecode=" + downloadcode + '' + "&filename=" + index[0];
				}else{
					
				}
				//如果是document，那么点击下载更换成查看，不需要则可以屏蔽掉 cyb
				if(!url){
					htmlText += "<a href='" + index[1] + "' target=_blank>" + index[0] + "</a><br/>";
					
				}else{
					htmlText += "<a href='" + url + "' target=_blank>" + index[0] + "</a><br/>";
				}
                //htmlText += "<a href='" + index[1] + "' target=_blank>" + index[0] + "</a><br/>";
				
            }
        } else if ((this.colval == '<IMAGE>' || this.colstyle == 14) && text) {
            //3.选择(不能输入) && 图片
            //   console.log(text);
            tmp = text.split(';');
            for (i = 0; i < tmp.length; i++) {
                tmp2 = tmp[i];
                index = tmp2.split('=download');
                var fileInfo = index[0].split('_');
                var filecode = '';
                var idxcode = index[1].indexOf('filecode=');
                if (idxcode > 0 && index[1].indexOf('&', idxcode) > 0) {
                    filecode = index[1].substring(idxcode + 9, index[1].indexOf('&', idxcode));
                }
                else
                    filecode = index[1].substring(idxcode + 9);
                htmlText += "<img src='" + index[1] + "' style='width:100%;height:100%;'>";
                // htmlText += "<iframe style=\"border:none;margin-top:0px;margin-left:0px;border-radius:0%;height:100%;width:100%;\" src='/viewImage.jsp?filename="+fileInfo[1]+"&isthumb=true&noclick=true&filecode="+filecode+"'></iframe><br/>";
            }
        } else if ((this.coltype == 1 || this.coltype == 2) && this.clearzerovalue == 2 && parseFloat(value) == 0) {
            //1.数字&2.整数 隐藏0值
            console.log(this.colname + ' 隐藏0值');
            htmlText = '';
        } else if (this.linkobjs && this.colstyle <= 0) {//有关联信息
            var lobjs = this.linkobjs.split('\r');
            var lparams = lobjs[0].split('\t');
            var link_object = lparams[1]; //对象
            var link_type = lparams[2]; //类型
            var link_field = lparams[3]; //关联字段
            var link_param = lparams[4]; //输入参数
            var link_tempid = lparams[5]; //表单模板ID
            var link_right = lparams[6]; //权限
            var link_sql = lparams[7];  //Sql语句

            $cell.data('linkobjs', lparams);

            if (link_object == 'cpcdoc') {   //打开文件
                htmlText = '<a href="###" onclick="openLink($(this),1)" sqlcontent="/downloadfile.do?docid='
                    + link_param + '">' + this.colalias || this.colname + '</a>';
            } else if (link_object == 'hyperlink') { //打开网页
                htmlText = '<a target="_blank" href="' + link_param + '">' + this.colalias || this.colname + '</a>';
            } else if (link_object.indexOf('user_') == 0) { //打开表单
                //若有输入参数和表单模板ID，则打开表单没有实例就生成新表单并将参数输入

                htmlText = '<a href="###" onclick="openLink($(this),2)" sqlcontent="select shtinsid from ' + link_object + ' where '
                    + link_field + '">' + this.colalias || this.colname + '</a>';
            } else if (link_sql) {    //SQL查看
                htmlText = '<a href="###" onclick="openLink($(this),2)" sqlcontent="' + link_sql + '">' + this.colalias || this.colname + '</a>';
            }
        } else if (this.effectiframe) {  //IFrame
            var url = this.colalias;
            $cell.data('effectiframe', this.effectiframe);
            htmlText = '<a href="###" onclick="openIFrame(this, $(this))"  + >' + url + '</a>';
            //htmlText = '<a href="###" onclick="openIFrame(this)"  + >' + url + '</a>';
        } else if (this.colstyle == -1) {//无关联信息的超链接
            var url = this.colstylenote;
            htmlText = '<a target="_blank" href="' + url + '">' + text || value || this.colalias || this.colname + '</a>';
        } else if (this.colstyle == 12) {  //关联的IFrame
            console.log('iframe');
            htmlText = '';
        }
        else {
            htmlText = text + '';
        }
    }
    if (!nowrap) {
        htmlText = htmlText.replace(/\n/g, '<br/>');
    }
    return htmlText;
};

/**
 * 获取样式值
 * @param value
 * @param text
 * @param nowrap    是否替换换行符
 * @return {string}
 */
CPCShtCol.prototype.getColStyleValue = function (rowNo) {
    if (!this.m_colstylenote) return;
    var result = this.m_colstylenote;
    if (!(result.indexOf('select')==0) && result.indexOf('select')==-1) return;

    result = result.substring(result.indexOf('select'));

    var test = /\[(.+?)]/ig;
    var r,value;
    var shtTable,shtCol,shtTableName,shtColName,tmp;
    while (r = test.exec(this.m_colstylenote)) {
        tmp = r[1].split('.');
        if (tmp.length !=2) throw '变量定义错误';
        shtTableName = tmp[0];
        shtColName = tmp[1];
        shtTable = getDataTableByName(shtTableName);
        if (!shtTable) throw '数据表:' + shtTableName + '不存在';
        shtCol = shtTable.getDataCol(shtColName);
        if (!shtCol) throw '字段属性:' + shtColName + '不存在';

        if (this.colstyle == 3 || this.colstyle == 7) {
            value = shtCol.getValue(rowNo);
        } else {
            value = shtCol.getText(rowNo);
        }
        if (shtCol.coltype == 1) {//数字
            value = parseFloat(value);
            if (isNaN(value)) throw '字段为空';
        } else if (shtCol.coltype == 2){
            value = parseInt(value);
            if (isNaN(value)) throw '字段为空';
        } else {
            //value = wrapQuotedStr(value);
            //console.log(value);
        }

        result = result.replace(r[0], value);
    }

    //console.log(result);

    var cpcShtCol = new CPCShtCol();
    cpcShtCol.sqlwhere = result;
    cpcShtCol.postRequest('getoptionvalue',false);
    this.colstylenote = cpcShtCol.colstylenote;
};

function nextChildNode(node, clazz, tagName) {
    var count = node.childElementCount;
    for (var i = 0; i < count; i++) {
        if (node == undefined || node.children[i] == undefined) {
            continue;
        }
        if (clazz) {
            if (node.children[i].getAttribute('class') == clazz) {
                return node.children[i];
            }
        } else {
            if (node.children[i].tagName == tagName) {
                return node.children[i];
            }
        }
    }
    return null;
}

function hideAllDivbyCell($cell) {

    $cell.children().hide();
}

function showDivByCell(divid) {
    var div = document.getElementById(divid);
    if (div != null) {
        $(div).show();
    }
}

function createDivbyCell($cell, divid, width, height, url) {
    var adiv = document.createElement("div");             //创建一个div
    adiv.id = divid;
    adiv.style.cssText = "width:" + width + ";height:" + height;
    var iframe = document.createElement("iframe");          //创建一个iframe
    iframe.name = 'F';
    //iframe.style.cssText = "height=" + '100%' + "width=" + '100%';
    iframe.width = width;
    iframe.height = height;
    iframe.src = url;
    adiv.appendChild(iframe);
    $cell.append($(adiv));
}

function create_uEditor($cell, divid, width, height, value) {

    var div = document.getElementById(divid);  //找div
    var edit2 = $cell.attr('cpceditable');

    if (div == null) {
        var adiv = document.createElement("div");             //创建一个div
        adiv.id = divid;
        adiv.style.cssText = "width:" + width + ";height:" + height;
        //var ue = UE.getEditor(divid);

        if (edit2 != "true") {   //如果没权限则隐藏工具栏
            var ue = UE.getEditor(divid, {
                toolbars: [
                    []
                ],
                autoHeightEnabled: true,
                autoFloatEnabled: true
            });
        } else {
            var ue = UE.getEditor(divid);
        }

        ue.ready(function () {
            //赋值
            ue.setContent(value);

            if (edit2 != "true") {
                console.log('false');
                ue.setDisabled('fullscreen');
            }

            //设置保存按钮可用
            ue.addListener('contentchange', function () {
                var btnsave = $('#btn-save');
                if (btnsave.linkbutton('options').disabled) {
                    btnsave.linkbutton('enable');
                    btnsave.bind('click', onSave);
                }
            });
        });

        $cell.append($(adiv));
    } else {
        UE.getEditor(divid).setContent(value, false);
    }
}

/**
 * 生成表单实例Url
 * @param url
 */
function gen_ShtUrl(url) {
    var strtmp, strparam, shturl, result;
    var index = url.indexOf('sht_url');
    if (index != 0) {
        return url;
    }
    var index2 = url.indexOf('{');
    var index3 = url.indexOf('}');

    //如果有带参数
    if (index2 > 0 && index3 > 0) {
        strparam = url.substring(index2 + 1, index3);
        shturl = url.substring(8, index2 - 1);
    } else {
        shturl = url.substring(8, url.length);
    }

    var tmp = url.split(",");
    var serverurl = window.location.protocol + '//' + window.location.host;
    var entcode = g_entcode;

    var ashtid = tmp[0];
    if (ashtid.indexOf('<shtid>') >= 0) {
        ashtid = shtId;
    }
    var shtinsid = tmp[1];
    if (shtinsid.indexOf('<shtinsid>') >= 0) {
        shtinsid = shtIns.shtinsid;
    }
    result = serverurl + '/web/sht/' + entcode + '/sht_' + ashtid + '.jsp';
    if (shtinsid > 0) {
        //result = result + '?id=' +
    }
    if (strparam.length > 0) {
        var tmp2 = strparam.split(",");
        var tmp3, shtTableName, shtColName, shtTable, valueCol, sParamValue;
        sParamValue = '';
        for (var i = 0; i < tmp2.length; i++) {
            strtmp = tmp2[i];
            if (strtmp.indexOf('[') >= 0 && strtmp.indexOf(']') >= 0) {
                strtmp = strtmp.substring(1, strtmp.length - 1);
                tmp3 = strtmp.split(".");
                shtTableName = tmp3[0];
                shtColName = tmp3[1];
                var shtTable = getDataTableByName(shtTableName);
                if (!shtTable) throw '数据表:' + shtTableName + '不存在';

                var valueCol = shtTable.getDataCol(shtColName);
                if (!valueCol) throw '数据表字段:' + shtColName + '不存在';

                var valueCell = valueCol.getColCell();
                var value = valueCell.attr('cpctext');
                sParamValue = sParamValue + 'param' + (i + 1) + '=' + value + '&';
            } else {
                sParamValue = sParamValue + 'param' + (i + 1) + '=' + strtmp + '&';
            }
        }
        if (sParamValue) {
            sParamValue = sParamValue.substring(0, sParamValue.length - 1);
            result = result + '?' + sParamValue;
        }
    }
    return result;
    console.log(strparam);
    console.log(shturl);
}


/**
 * 打开IFrame
 * @param cell
 * @param url iframe对应的地址
 * @param flag
 */
function openIFrame(shtCol, cell) {
    var strtmp, strIFrame, strUrl, strDefault, tmp, strIFrame_name, strIFrame_value, strUrl_name, strUrl_value;
    var htmlText, htmlText2;
    var jcell = $(cell);
    var effectiframes = shtCol.effectiframe; //jcell.parent().data('effectiframe');
    var colid = shtCol.colid;
    if (typeof effectiframes == 'undefined') {
        effectiframes = jcell.parent().data('effectiframe');
    }
    if (typeof colid == 'undefined') {
        colid = jcell.parent().attr('cpccolid');//cell.attr('cpccolid');
    }
    if (typeof effectiframes == 'undefined') {
        return;
    }


    var effectiframe_a = effectiframes.split("|");
    var effectiframe_b;
    var shtTable, shtCol, shtTableName, shtColName;
    var shtCell;
    for (var i = 0; i < effectiframe_a.length; i++) {
        strtmp = effectiframe_a[i];
        effectiframe_b = strtmp.split("^");
        strIFrame = effectiframe_b[0];
        strUrl = effectiframe_b[1];
        strDefault = effectiframe_b[2];
        tmp = strIFrame.split('=');
        strIFrame_name = tmp[0];
        strIFrame_value = tmp[1];
        tmp = strUrl.split('=');
        strUrl_name = tmp[0];
        strUrl_value = tmp[1];

        strUrl_value = gen_ShtUrl(strUrl_value);

        strIFrame_value = strIFrame_value.substring(1, strIFrame_value.length - 1);
        tmp = strIFrame_value.split('.');

        if (tmp.length != 2) throw '变量定义错误';
        shtTableName = tmp[0];
        shtColName = tmp[1];
        shtTable = getDataTableByName(shtTableName);
        if (!shtTable) throw '数据表:' + shtTableName + '不存在';
        shtCol = shtTable.getDataCol(shtColName);

        if ($('#sheet_table_' + shtCol.shtpage).length > 0)
            shtCell = $('#sheet_table_' + shtCol.shtpage).find('[cpccolid=' + shtCol.colid + ']');
        else
            shtCell = $('[cpccolid=' + shtCol.colid + ']');

        var jQCell = $(shtCell);

        var iwidth = jQCell.width() + 'px';
        var iheight = jQCell.height() + 'px';
        var divid = 'div' + colid;

        var div = document.getElementById(divid);  //找div
        if (div == null) {   //div找不到
            console.log(div);
            if (cell != undefined) {  //点CELL触发

                hideAllDivbyCell(jQCell);
                createDivbyCell(jQCell, divid, iwidth, iheight, strUrl_value);

            }
            else {   //第一次渲染
                htmlText = '<div id="' + divid + '"' + 'style="display:inline-block; width:' + iwidth + ';height:' + iheight + '">' +
                    '<iframe name="f" height=100% width=100%  src="' + strUrl_value + '"' +
                    '</iframe></div>';
                jQCell.html(htmlText);
            }
        }
        else {  //div 找到的情况下
            //console.log('abc');
            hideAllDivbyCell(jQCell);
            showDivByCell(divid);
        }
    }
}

/**
 * 打开链接
 * @param cell
 * @param flag 1打开cpcdoc 2打开表单  3打开流程
 */
function openLink(cell, flag) {
    var jcell = $(cell);
    var cpcrow = jcell.parent().attr('cpcrow');
    var str = replaceShtData(jcell.attr('sqlcontent'), cpcrow, true);

    var lparams = jcell.parent().data('linkobjs');
    var link_object = lparams[1]; //对象
    var link_type = lparams[2]; //类型
    var link_field = lparams[3]; //关联字段
    var link_param = lparams[4]; //输入参数
    var link_param_a = link_param.split(";");
    for (var i = 0; i < link_param_a.length; i++) {
        link_param_a[i] = replaceShtData(link_param_a[i], cpcrow);
        if (!link_param_a[i])
            link_param_a[i] = "";
        else
            link_param_a[i] = link_param_a[i].substring(1, link_param_a[i].length - 1);
    }

    var link_tempid = lparams[5]; //表单模板ID
    var link_right = lparams[6]; //权限
    var link_sql = lparams[7];  //Sql语句
    var link_opentype = lparams[8];  //打开方式

    if (!str && (!link_tempid || link_tempid == 0)) {
        alert('没有符合条件的单据!');
        return;
    }
    if (flag == 1) {    //打开文档
        var wind = window.open(str);
    }
    else {
        if (str) {
            var ins = new CPCShtIns();
            ins.pksql = str;
            ins.postRequest('getdocid').done(function () {
                var ashtinsid = ins.shtinsid;
                var ashtid = ins.shtid;
                var awfid = ins.wfid;
                //若没有表单实例,有表单模板ID,则打开模板表单,并传入输入参数
                if (!ashtid || ashtid == 0) {
                    if (!link_tempid || link_tempid == 0) {
                        alert('没有符合条件的单据!');
                        return;
                    }
                    // var u = window.location.href;
                    // var oldShtId = 'sht_'+shtId+'.jsp';
                    // var newShtId = 'sht_'+link_tempid+'.jsp';
                    // u=u.replace(oldShtId,newShtId);
                    // var ur = u.lastIndexOf('?');
                    // var url = u;
                    // if (ur >= 0) {
                    //     url = u.substring(0, ur);
                    // }
                    // localStorage.shtParams = JSON.stringify(link_param_a);
                    // //console.log(url);
                    // openShtWindow(url+ "?loadparams=true");

                    var newUrl = '/web/sht/' + g_entcode + '/sht_' + link_tempid + '.jsp';
                    localStorage.shtParams = JSON.stringify(link_param_a);
                    //console.log(url);
                    openShtWindow(newUrl + "?loadparams=true", link_opentype);

                    //self.location=url+ "?id=" + encodeURIComponent(ashtinsid) + "&wfid=" + encodeURIComponent(awfid);
                }
                else {
                    // var u = window.location.href;
                    // var oldShtId = 'sht_'+shtId+'.jsp';
                    // var newShtId = 'sht_'+ashtid+'.jsp';
                    // u=u.replace(oldShtId,newShtId);
                    // var ur = u.lastIndexOf('?');
                    // var url = u;
                    // if (ur >= 0) {
                    //     url = u.substring(0, ur);
                    // }
                    //console.log(url);
                    var newUrl = '/web/sht/' + g_entcode + '/sht_' + ashtid + '.jsp';
                    openShtWindow(newUrl + "?id=" + encodeURIComponent(ashtinsid) + "&wfid=" + encodeURIComponent(awfid), link_opentype);

                    //self.location=url+ "?id=" + encodeURIComponent(ashtinsid) + "&wfid=" + encodeURIComponent(awfid);
                }

            });
        }
        else {
            //若没有表单实例,有表单模板ID,则打开模板表单,并传入输入参数
            if (!link_tempid || link_tempid == 0) {
                alert('没有符合条件的单据!');
                return;
            }
            // var u = window.location.href;
            // var oldShtId = 'sht_'+shtId+'.jsp';
            // var newShtId = 'sht_'+link_tempid+'.jsp';
            // u=u.replace(oldShtId,newShtId);
            // var ur = u.lastIndexOf('?');
            // var url = u;
            // if (ur >= 0) {
            //     url = u.substring(0, ur);
            // }
            // localStorage.shtParams = JSON.stringify(link_param_a);
            // //console.log(url);
            // openShtWindow(url+ "?loadparams=true");

            var newUrl = '/web/sht/' + g_entcode + '/sht_' + link_tempid + '.jsp';
            localStorage.shtParams = JSON.stringify(link_param_a);
            //console.log(url);
            openShtWindow(newUrl + "?loadparams=true", link_opentype);
        }
    }
}

/**
 * 打开窗口
 * @param url   相对地址
 * @param type  打开类型
 */
var openShtWindow = function (url, type) {
    if (type) {
        if (type == 'newframe') {
            var iframe = document.createElement("iframe");
            iframe.src = url + "&iframeclose=true";
            iframe.id = "shtIframe";
            iframe.width = document.body.width;
            iframe.height = document.body.height;
            iframe.frameborder = "no";
            iframe.border = "0";
            iframe.marginwidth = "0";
            iframe.marginheight = "0";
            iframe.scrolling = "no";
            //iframe.style.display = "none";
            document.body.appendChild(iframe);
        }
        else if (type == 'newtab') {
            window.parent.CreateTab('shtformsht', '关联表单', url);
            window.parent.SelectTab('shtformsht');
        }
        else if (type == 'newpage') {
            window.open(url);
        }
        else {
            //self.location = url;

            var iframe = document.createElement("iframe");
            iframe.src = url + "&iframeclose=true";
            iframe.id = "shtIframe";
            iframe.width = document.body.width;
            iframe.height = document.body.height;
            iframe.frameborder = "no";
            iframe.border = "0";
            iframe.marginwidth = "0";
            iframe.marginheight = "0";
            iframe.scrolling = "no";
            document.body.appendChild(iframe);
        }
    }
    else {
        //self.location = url;

        var iframe = document.createElement("iframe");
        iframe.src = url + "&iframeclose=true";
        iframe.id = "shtIframe";
        iframe.width = $(document).width();
        iframe.height = $(document).height();
        iframe.style = "position:absolute;top:0;left:0";
        iframe.frameborder = "no";
        iframe.border = "0";
        iframe.marginwidth = "0";
        iframe.marginheight = "0";
        iframe.scrolling = "no";
        //iframe.style.display = "none";
        document.body.appendChild(iframe);
    }
}

/**
 * 替换字符串中的表单数据
 * @param strTmp
 * @param rowNo
 * @returns {*}
 */
function replaceShtData(strTmp, rowNo, unneedQuote) {

    var test, r, result, shtTable, shtCol, shtTableName, shtColName, tmp;
    test = /\[(.+?)]/ig;
    var newStr = strTmp;
    //console.log(newStr);
    while (r = test.exec(strTmp)) {
        tmp = r[1].split('.');
        shtTableName = tmp[0];
        shtColName = tmp[1];

        shtTable = getDataTableByName(shtTableName);
        shtCol = shtTable.getDataCol(shtColName);
        if (unneedQuote)
            result = shtCol.getText(rowNo);
        else
            result = "'" + shtCol.getText(rowNo) + "'";
        if (result == "''") {
            return;
        }
        newStr = newStr.replace(new RegExp('\\' + r[0], 'g'), result);
    }

    return newStr;
}

/**
 * 设置单元格的值
 * @param cell  对应单元格
 * @param value 内部值data
 * @param text  显示值
 * @param changed   是否需要change事件
 */
CPCShtCol.prototype.setCellValueNew = function (cell, value, text, changed) {
    //迷之出现数据中包含#127，为了防止出问题，先把数据中的这个符号换掉
    var ds = new RegExp(DATA_SEPARATOR, 'g');
    value = String(value).replace(ds, "");
    text = String(text).replace(ds, "");

    //若类型为数字，将小数后位数精确到显示位数。
    if (this.coltype == 1 && Number(value)) {
　　
　
        text = Number(value).toFixed(this.showdec);
		
    }
    //  var i,tmp,tmp2,index;
    var jQCell = $(cell);
    jQCell.attr({
        cpcvalue: value,
        cpctext: text
    });

    if (this.fixlen == 1 && this.autocode == 2) {
        if (shtIns) {
            shtIns.AutoCodeValue = value;
        }
    }

    //   var editAble = this.canModify();
    //   var colId = jQCell.attr('cpccolid');
    //   var rowNo = jQCell.attr('cpcrow');
    if (this.colstyle == 11) {   //二维码
        jQCell.html('');
        if (!this.varcode && value) {
            value = window.location.protocol + '//' + window.location.host + value;
        }
        jQCell.qrcode(value);
        jQCell.height('inherit');
    }
    else if (this.colstyle == 13) {   //富文本
        var iwidth = jQCell.width() + 'px';
        var iheight = jQCell.height() + 'px';
        var divid = 'div' + this.colid;
        create_uEditor(jQCell, divid, iwidth, iheight, value);
        jQCell.height('inherit');
    }
    else if ((this.colval == '<IMAGE>' || this.colstyle == 14) && text) {
        //图片多张
        var tmp = text.split(';');
        if (tmp.length > 1) {
            var htmlText = this.getHtmlText(value, text, jQCell);
            jQCell.html(htmlText);
        }
        else {
            //图片单张，直接设为td的背景
            var tmp2 = tmp[0];
            index = tmp2.split('=download');
            var fileInfo = index[0].split('_');
            var filecode = '';
            var idxcode = index[1].indexOf('filecode=');
            if (idxcode > 0 && index[1].indexOf('&', idxcode) > 0) {
                filecode = index[1].substring(idxcode + 9, index[1].indexOf('&', idxcode));
            }
            else
                filecode = index[1].substring(idxcode + 9);
            // htmlText += "<img src='" + index[1] + "' style='width:100%;height:100%;'>";
            jQCell.css('background', 'url(' + index[1] + ') no-repeat');
            jQCell.css('-moz-background-size', '100% 100%');
            jQCell.css('background-size', '100% 100%');

        }
        //background:url(/downloadfile.do?iswb=true&amp;filecode=*173eclq9vxmymwxMCca6X1z3JjVagLmVr7tsyvb%2FNHuhDNP%2FHGd3NSKagcjh4YObf) no-repeat; -moz-background-size:100% 100%;background-size:100% 100%;
        jQCell.height('inherit');
    }
    else {
        var htmlText = this.getHtmlText(value, text, jQCell);
		
		if(isNaN(parseFloat(htmlText))){
			
		}else{
		   if (parseInt(this.coltype) == 1) {
			   //设置千分位
			   var re=/\d{1,3}(?=(\d{3})+$)/g;
	　　       htmlText =htmlText.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});

           }
		}
			
        jQCell.html(htmlText);
        jQCell.height('inherit');
    }
    //触发Changed事件
    if (changed) {
        var rowNo, that = this;
        jQCell.each(function () {
            rowNo = $(this).attr('cpcrow');
            //console.log(rowNo);
            that.onCellDataChanged(rowNo);
        })
        //允许保存
        var btnsave = $('#btn-save');
        if (btnsave.linkbutton('options').disabled) {
            btnsave.linkbutton('enable');
            btnsave.bind('click', onSave);
        }
    }
};
/**
 * 从单元格中提取内容
 * @param rowNos
 */
CPCShtCol.prototype.getCellValue = function (rowNos) {
    var value;
    this.data = '';
    //定长表
    if (this.fixlen == 1) {
        value = this.getValue(0);
        //检查非空
        if (!value && !this.canBeNull()) {
            if ($('#sheet_table_' + this.shtpage).length > 0)
                $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            else
                $('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            throw this.colalias + ' 不能为空';
        }
        //检查数字/整数
        if ((!value || (parseInt(value, 10) === value&& (this.coltype == 2 || this.coltype == 1))) && !this.canBeNull()) {
            if ($('#sheet_table_' + this.shtpage).length > 0)
                $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            else
                $('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            throw this.colalias + ' 不是有效的整数';
        }
        if (this.coltype == 1 && !(parseFloat(value) == value)) {
            if ($('#sheet_table_' + this.shtpage).length > 0)
                $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            else
                $('[cpccolid=' + this.colid + '][cpcrow=' + 0 + ']').click();
            throw this.colalias + ' 不是有效的数字';
        }

        this.data = value;
    } else {
        for (var i = 0; i < rowNos.length; i++) {
            value = this.getValue(rowNos[i]);

            //检查非空
            if (!value && !this.canBeNull()) {
                if ($('#sheet_table_' + this.shtpage).length > 0)
                    $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                else
                    $('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                throw '第' + (i + 1) + '行 ' + this.colalias + ' 不能为空';
            }
            //检查数字/整数
            if (this.coltype == 2 && !(parseInt(value) == value)) {
                if ($('#sheet_table_' + this.shtpage).length > 0)
                    $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                else
                    $('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                throw this.colalias + ' 不是有效的整数';
            }
            if (this.coltype == 1 && !(parseFloat(value) == value)) {
                if ($('#sheet_table_' + this.shtpage).length > 0)
                    $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                else
                    $('[cpccolid=' + this.colid + '][cpcrow=' + rowNos[i] + ']').click();
                throw this.colalias + ' 不是有效的数字';
            }

            this.data = this.data + DATA_SEPARATOR + value;
        }
        this.data = this.data.slice(1);
    }
};

/**
 *清空单元格内容
 * @param rowNo
 */
CPCShtCol.prototype.clearValue = function (rowNo) {
    var cell;

    if ($('#sheet_table_' + this.shtpage).length > 0)
        cell = $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
    else
        cell = $('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');

    //TODO 这里需要change?
    this.setCellValueNew(cell, '', '', true);
};

/**
 * 获取单元格内容-数据
 * @param rowNo
 * @returns {string}
 */
CPCShtCol.prototype.getValue = function (rowNo) {
    //定长表将rowNo置为0
    if (this.fixlen == 1) {
        rowNo = 0;
    }
    var divid = 'div' + this.colid;
    var cell = $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
    if (cell.length == 0) cell = $('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
    var value = cell.attr('cpcvalue');
    if (!value) {
        if (this.colstyle == 13) {  //富文本
            var div = document.getElementById(divid);
            if (div != null) {
                value = UE.getEditor(divid).getContent();
            } else {
                value = '';
            }

        } else {
            if (this.coltype == 1 || this.coltype == 2) {
                value = '0';
            } else {
                value = '';
            }
        }
    } else {
        if (this.colstyle == 13) {//富文本
            var div = document.getElementById(divid);
            if (div != null) {
                value = UE.getEditor(divid).getContent();
            } else {
                value = '';
            }
        }
    }
    return value;
};

/**
 * 获取单元格内容-文本
 * @param rowNo
 * @returns {string}
 */
CPCShtCol.prototype.getText = function (rowNo) {
    //定长表将rowNo置为0
    if (this.fixlen == 1) {
        rowNo = 0;
    }

    var cell = $('#sheet_table_' + this.shtpage).find('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
    if (cell.length == 0) cell = $('[cpccolid=' + this.colid + '][cpcrow=' + rowNo + ']');
    return cell.attr('cpctext');
};

CPCShtCol.prototype.canInsertRow = function () {
    var table = getDataTableById(this.tableid);
    return (table && table.fixlen == 2);
};

/**
 * 添加影响列
 * @param shtCol
 */
CPCShtCol.prototype.addEffectCol = function (shtCol) {
    if (!this.m_effectCols) {
        this.m_effectCols = [];
    }
    if (shtCol == this) return; // 死循环
    if (this.m_effectCols.indexOf(shtCol) < 0) {
        this.m_effectCols.push(shtCol);
    }
};
/**
 * 添加影响样式列
 * @param shtCol
 */
CPCShtCol.prototype.addEffectStyleCol = function (shtCol) {
    if (!this.m_effectStyleCols) {
        this.m_effectStyleCols = [];
    }
    if (shtCol == this) return; // 死循环
    if (this.m_effectStyleCols.indexOf(shtCol) < 0) {
        this.m_effectStyleCols.push(shtCol);
    }
};
/**
 * 添加影响表
 * @param shtTable
 */
CPCShtCol.prototype.addEffectTable = function (shtTable) {
    if (!this.m_effectTables) {
        this.m_effectTables = [];
    }
    if (shtTable == this) return; // 死循环
    if (this.m_effectTables.indexOf(shtTable) < 0) {
        this.m_effectTables.push(shtTable);
    }
};

/**
 * 添加被影响IFrame
 * @param shtCol
 */
CPCShtCol.prototype.addEffectIFrame = function (shtCol) {
    if (!this.m_effectIFrames) {
        this.m_effectIFrames = [];
    }
    if (shtCol == this) return; // 死循环
    if (this.m_effectIFrames.indexOf(shtCol) < 0) {
        this.m_effectIFrames.push(shtCol);
    }
};

/**
 * 获取单元格受影响列
 * @return {Array}
 */
CPCShtCol.prototype.getEffectCol = function () {
    return this.m_effectCols;
};
/**
 * 获取单元格受影响样式列
 * @return {Array}
 */
CPCShtCol.prototype.getEffectStyleCol = function () {
    return this.m_effectStyleCols;
};
/**
 * 获取单元格受影响样式列
 * @return {Array}
 */
CPCShtCol.prototype.getEffectTable = function () {
    return this.m_effectTables;
};
/**
 * 获取单元格受影响IFrame
 * @return {Array}
 */
CPCShtCol.prototype.getEffectIFrame = function () {
    return this.m_effectIFrames;
}

/**
 * 设置网格颜色
 * @param cell
 */
CPCShtCol.prototype.setCellColor = function (cell) {
    if (!this.colformat) return;

    //  console.log(this.colformat);

    var list = this.colformat.split("=");
    if (list.length < 2) return;
    var procIds = wrapQuotedStr(list[0],',');
    var cellColor = list[1];
    if ((procIds.indexOf(wrapQuotedStr(g_nOpenProcId,',')) > -1) &&
        !(this.colval && this.colval.indexOf('<WF') ==0)){
        var color = CPCShtCol.cellColors[cellColor];
        //    console.log(color);
        $(cell).css("background-color", color);
    }
};

/**
 * 获取单元格所在的网格
 * @param rowNo 行号,不传取全部
 * @return {*|jQuery|HTMLElement}
 */
CPCShtCol.prototype.getColCell = function (rowNo) {
    var selected = "[cpccolid=" + this.colid + "]";
    if (typeof rowNo != 'undefined') {
        selected += "[cpcrow=" + rowNo + "]";
    }
    if ($('#sheet_table_' + this.shtpage).length > 0)
        return $('#sheet_table_' + this.shtpage).find(selected);
    else
        return $(selected);
};

/******************************************************
 * 获取变量的值
 */
CPCShtValues.prototype.getShtValue = function (rowNo) {
    //获取SQL语句
    if (!this.vsql) return undefined;
    var result = this.vsql;
    var test = /\[(.+?)]/ig;
    var r, value;
    var shtTable, shtCol, shtTableName, shtColName, tmp, shtCell;
    while (r = test.exec(this.vsql)) {
        tmp = r[1].split('.');
        if (tmp.length !=2) throw '变量定义错误';
        shtTableName = tmp[0];
        shtColName = tmp[1];
        shtTable = getDataTableByName(shtTableName);
        if (!shtTable) throw '数据表:' + shtTableName + '不存在';
        shtCol = shtTable.getDataCol(shtColName);
        if (!shtCol) throw '字段属性:' + shtColName + '不存在';
        if (shtCol.fixlen == 1) {
            shtCell = shtCol.getColCell(0);
        } else {
            shtCell = shtCol.getColCell(rowNo);
        }

        // {if (this.colstyle == 3 || this.colstyle == 7) {
        //     value = shtCol.getValue(rowNo);
        // } else {
        //     value = shtCol.getText(rowNo);
        // }
        if (shtCell.attr('cpcvalue')) {
            value = shtCell.attr('cpcvalue');
        } else {
            value = shtCell.attr('cpctext');
        }
        if (shtCol.coltype == 1) {//数字
            value = parseFloat(value);
            if (isNaN(value)) throw '字段为空';
        } else if (shtCol.coltype == 2){
            value = parseInt(value);
            if (isNaN(value)) throw '字段为空';
        } else {
            value = wrapQuotedStr(value);
        }

        console.log(r[0]);
        result = result.replace(r[0], value);
    }

    console.log(result);

    var cpcShtValues = new CPCShtValues();
    cpcShtValues.shtid = this.shtid;
    cpcShtValues.varcode = this.varcode;
    cpcShtValues.dsid = this.dsid;
    cpcShtValues.vsql = result;
    cpcShtValues.postRequest('selectvar',false);
    return cpcShtValues.data;
};
/******************************************************
 * cpcshttable方法
 */
/**
 * 数据表初始化工作
 */
CPCShtTable.prototype.initTable = function () {
    console.log('初始化数据表:' + this.tablename);
    var shtCol,shtCell,k;
    var thisTable = this;
    //1.初始化数据列
    var shtTableCols = this.cpcshtcolofcpcshttables;
    if (!shtTableCols || shtTableCols.length == 0) return;
    for(k=0;k<shtTableCols.length;k++) {
        shtCol = shtTableCols[k];
        shtCol.fixlen = this.fixlen;
        shtCols.push(shtCol);
    }
    //TODO 还有什么需要初始化
};

CPCShtTable.prototype.getCols = function () {
    return this.cpcshtcolofcpcshttables;
};

CPCShtTable.prototype.getDataCol = function (colName) {
    var tableCols = this.cpcshtcolofcpcshttables;
    if (!tableCols) return null;
    var colLength = tableCols.length;
    for (var i = 0; i < colLength; i++) {
        if (tableCols[i].colname == colName) {
            return tableCols[i];
        }
    }
    return null;
};

/**
 * 获取指定行的单元格
 * @param rowNo 行号
 * @param rowNum 行数
 * @returns {*|jQuery|HTMLElement}
 */
CPCShtTable.prototype.getColCell = function (rowNo,rowNum) {
    rowNo = rowNo || 0;
    rowNum = rowNum || 1;
  //  return $("td[cpctableid=" + this.tableid + "][cpcrow="  + rowNo + "]");
    return $("td[cpctableid=" + this.tableid + "]").filter(function () {
       var aRowNo = $(this).attr('cpcrow');
        return  (aRowNo >= rowNo) && (aRowNo < rowNo + rowNum);
    });
};

/**
 * 不定长表重新设定行号
 * @param rowNo 开始的行号
 */
CPCShtTable.prototype.numbering = function (rowNo) {
    rowNo = rowNo? parseInt(rowNo): 0;
    var shtCol,shtCell;
    var shtTableCol = this.cpcshtcolofcpcshttables;
    for (var i=0;i<shtTableCol.length;i++) {
        shtCol = shtTableCol[i];
        shtCell = shtCol.getColCell().filter(function () {
            var aRowNo = $(this).attr('cpcrow');
            return aRowNo >= rowNo;
        });
        shtCell.attr('cpcrow',function (index) {
            return index + rowNo;
        })
    }
};

/**
 * 自动编码字段自动编码(不定长表)
 * @param rowNo 开始的行号
 */
CPCShtTable.prototype.autoCode = function (rowNo) {
    rowNo = rowNo? parseInt(rowNo): 0;
    var shtCol,shtCell;
    var shtTableCol = this.cpcshtcolofcpcshttables;
    for (var i=0;i<shtTableCol.length;i++) {
        shtCol = shtTableCol[i];
        if (shtCol.autocode !=2) continue;
        shtCell = shtCol.getColCell().filter(function () {
            var aRowNo = $(this).attr('cpcrow');
            return aRowNo >= rowNo;
        });

        shtCell.attr('cpcvalue',function (index) {
            return index + rowNo + 1;
        }).attr('cpctext', function (index) {
            return index + rowNo + 1;
        }).html(function (index) {
            return index + rowNo + 1;
        });
        shtCell.each(function () {
            rowNo = $(this).attr('cpcrow');
            shtCol.onCellDataChanged(rowNo);
        })
    }
};

/**
 * 数据表增加行
 * @param rowNo 行号
 * @param rowNum    增加的行数
 */
CPCShtTable.prototype.appendRow = function (rowNo, rowNum) {
    //定长表不能增加行
    if (this.fixlen == 1) return;
    if (!rowNum) rowNum =1;
    if (!rowNo || rowNo < 0) rowNo = 0;
    var shtCells = this.getColCell(rowNo);
    
    var tr = shtCells.parent('tr');
    var newTr = tr.clone(true).addClass('cpcadd').addClass(this.tablename);
    console.log(newTr.length);
    newTr.children('td[cpctable=' + this.tablename + ']').attr({
        cpcvalue: '',
        cpctext: ''
    }).html('');
    while (rowNum-- >0) {
        tr.after(newTr.clone(true));
    }

    this.numbering(rowNo);
    this.autoCode(rowNo);
};

/**
 * 不定长表删除行
 * @param rowNo 开始行号
 * @param rowNum 删除的行数，暂时没实现
 */
CPCShtTable.prototype.deleteRow = function (rowNo, rowNum) {

    if (this.fixlen == 1) return;//定长表
    var shtCol;
    var shtCell = this.getColCell(rowNo);

    shtCell.each(function () {
        shtCol = $(this).data('cpccol');
        shtCol.clearValue(rowNo);
    });

    console.log(shtCell.length);
    shtCell.parent('tr').remove();

    this.numbering(rowNo);
    this.autoCode(rowNo);
};

/**
 * 获取数据表的行数
 * @returns {number}
 */
CPCShtTable.prototype.getDataLength = function (reCalc) {
    if (!reCalc && this.rowcount && this.rowcount > 0) return this.rowcount;
    if (this.fixlen == 1) {
        this.rowcount = 1;
    } else {
        this.rowcount = this.endrow - this.startrow + 1;
        var cols = this.cpcshtcolofcpcshttables;
        if (cols && cols.length > 0) {
            for (var i = 0; i < cols.length; i++) {
                var size = cols[i].data ? cols[i].data.split(DATA_SEPARATOR).length : 0;
                if (size > this.rowcount) {
                    this.rowcount = size;
                }
            }
        }
    }
    return this.rowcount;
};

/******************************************************
 * 表单操作
 */
function showShtIns(id, wfId) {

    var method;
    var userSht = new CPCUserSht();
    userSht.shtid = shtId;
    if (!id || id.length < 1 || 'null' == id) {
        g_bIsNew = true;
        g_nOpenWfId = 0; // 新增状态
        g_nShtInsRight = 3//新增时完全控制
        userSht.shtinsid = 0;
        userSht.paramname = g_paramNames;
        userSht.paramvalue = g_paramValues;
      //  PostRequest(obj, "selecttype");
        method = 'selecttype';

    } else {
        // 查询实例
        g_bIsNew = false;
        g_nOpenWfId = wfId;
        userSht.shtinsid = id;
      //  PostRequest(obj, "selectdatabyins");
        method = 'selectdatabyins';
    }

    userSht.postRequest(method).done(function () {
        if (!g_bIsNew) {
            var pprocid=0;
            try {   //防止出现跨域报错
                pprocid = $('#procida',window.parent.document).html();
            }
            catch (e) {
            }
            g_nOpenProcId = pprocid?pprocid:userSht.inswfprocid; // 取当前过程号(表单过程号有BUG...当多个过程都为当前人时,只会返回第一个过程...导致流程中打开表单权限出错,改为优先从流程获取过程号)
            g_nShtInsRight = userSht.inswfright;  //取当前过程权限
            if (userSht.shttype == 7) g_nShtInsRight = 0;
        }
        initShtIns(userSht);
        if (g_effectiframe_default != null) {
            window.setTimeout(function () {
                openIFrame(g_effectiframe_default)
            }, 0);
        }
    });

    $('body').append('<div id="select_user" class="easyui-dialog" title="选择用户" style="width:500px;height:350px;display:none" closed="true"></div>');
}

function initShtIns(userSht) {
    if (g_loadParams && g_loadParams != 'null' && localStorage.shtParams) {
        g_inputParams = JSON.parse(localStorage.shtParams);
        console.log(g_inputParams);
        localStorage.shtParams = '';
    }
    g_userSht = userSht.clone();
    console.log(userSht);
    var i, j, shtTable;
    shtIns.parseData(userSht);
    shtIns.wfflag = userSht.wfshtflag;
    shtIns.wfright = userSht.inswfright;
    shtIns.wfid = userSht.inswfid;
    shtTables = userSht.cpcshttableofcpcusershts;
    shtValues = userSht.cpcshtvaluesofcpcusershts;
    shtChecks = userSht.cpcshtcheckofcpcusershts;

    if (!shtTables || shtTables.length == 0) {
        $.cpc.showAlert('数据表没有定义');
    }
    for (i = 0; i < shtTables.length; i++) {
        shtTable = shtTables[i];
        shtTable.initTable();
    }
    for (i = 0; i < shtCols.length; i++) {
        shtCols[i].initCol();
    }

    for (j = 0; j < shtTables.length; j++) {
        showDataTable(shtTables[j]);
    }

    if (g_bIsNew) {
        for (j = 0; j < shtCols.length; j++) {
            if (shtCols[j].getText(0)) {
                shtCols[j].onCellDataChanged(0);
            }
        }
    }

    grid.initGrid();

    setButtons();

    //若需要加载输入参数则处理
    //隐藏正在加载的遮罩
    $('#loading-mask,#loading').hide(100);
  //  $.cpc.progressLoad();

}

   function _createHiddenIframe(target, uri) {
        var iframe = document.createElement("iframe");
        iframe.src = uri;
        iframe.id = "hiddenIframe";
        iframe.width = "0";
        iframe.height = "0";
        iframe.frameborder="no"; 
        iframe.border="0";
        iframe.marginwidth="0";
        iframe.marginheight="0";
        iframe.scrolling="no";
        //iframe.style.display = "none";
        target.appendChild(iframe);
        return iframe;
    }
    
 function js_getDPI() {
    var arrDPI = new Array();
    if ( window.screen.deviceXDPI != undefined ) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement( "DIV" );
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild( tmpNode );
        arrDPI[0] = parseInt( tmpNode.offsetWidth );
        arrDPI[1] = parseInt( tmpNode.offsetHeight );
        tmpNode.parentNode.removeChild( tmpNode );
    }
    return arrDPI;
}
// 设置按钮
function setButtons() {

    var btnSearch = $('#btn-search');
    var btnSave = $('#btn-save');
	var btnNew = $('#btn-new');
    var btnReload = $('#btn-reload');
    var btnDelete = $('#btn-delete');
    var btnStartWf = $('#btn-wf-start');
    var btnOpenWf = $('#btn-wf-open');
    var btnPrint = $('#btn-print');
    var btnSaveAsExcel = $('#btn-saveasxls');

    btnSave.attr('disabled',false);

    var btnSaveAsPDF = $('#btn-saveaspdf');


    btnSearch.bind('click', onSearch);
	btnNew.bind('click', onNew);
	
    btnPrint.bind('click', function () {
        var isIE = (/*@cc_on!@*/false || !!document.documentMode);
        var printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
        var mystyles = document.getElementsByTagName("STYLE");
        for (var i =0;i<mystyles.length;i++){
            printStr += "<style>"+mystyles[i].innerHTML+"</style>" ;
        }
        printStr += "</head><body >";
		    var content = "";
		    var str = document.getElementById('table_layout').outerHTML;  //获取需要打印的页面元素 ，page1元素设置样式page-break-after:always，意思是从下一行开始分割。
		    content = content + str;
        if (isIE) {
            printStr = printStr + content + "<OBJECT ID='WebBrowser1' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></OBJECT><script>function printpr() {WebBrowser1.ExecWB(7, 2); WebBrowser1.outerHTML ='';  };printpr(); window.close();</script></body></html>";
            var pwin = window.open("", "");
            pwin.document.write(printStr);
            pwin.document.close();
        } else {
            printStr = printStr + content + "</body></html>";
            var iframe = document.querySelector("#hiddenIframe");
            if (!iframe) {
                iframe = _createHiddenIframe(document.body, "about:blank");
            }
            var pwin = iframe.contentWindow;
            //var pwin=window.open("Print.htm","print"); //如果是本地测试，需要先新建Print.htm，如果是在域中使用，则不需要
            pwin.document.write(printStr);
            pwin.document.close();                   //这句很重要，没有就无法实现
            pwin.print();
            $(iframe).remove();
        }
    });
    btnSaveAsPDF.bind('click',function(){
        var isIE = (/*@cc_on!@*/false || !!document.documentMode);
        var printStr = "<!DOCTYPE html><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
        var mystyles = document.getElementsByTagName("STYLE");
        for (var i =0;i<mystyles.length;i++){
            printStr += "<style>table {table-layout:fixed;} a{text-decoration:none;} td {word-wrap:break-word;} "+(isIE?mystyles[i].innerHTML.replace(/1px/g,"2px"):mystyles[i].innerHTML)+" td, th { letter-spacing:-0.2px ;border-collapse:collapse;padding:0px; }</style>" ;
        }
        printStr += "</head><body >";
        var content = "";
        var str = document.getElementById('table_sht').outerHTML;  //获取需要打印的页面元素 ，page1元素设置样式page-break-after:always，意思是从下一行开始分割。
        content = content + str;
        printStr = printStr+content+"</body></html>";
        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = _createHiddenIframe(document.body, "about:blank");
        }
        var pwin = iframe.contentWindow;
        //var pwin=window.open("Print.htm","print"); //如果是本地测试，需要先新建Print.htm，如果是在域中使用，则不需要
        pwin.document.write(printStr);
        pwin.document.close();                   //这句很重要，没有就无法实现

        html2canvas(pwin.document.getElementById('table_sht'), {
            background: "rgba(255,255,255,1)", letterRendering: true,
            onrendered: function (canvas) {
                var piccontent = canvas.toDataURL('image/jpeg',1.0);

                var arrDPI = js_getDPI();
                var dpiX = 96;
                var dpiY = 96;
                if(arrDPI.length>0){
                    dpiX = arrDPI[0];
                    dpiY = arrDPI[1];
                }

                var mmX = $(document.getElementById('table_sht')).width()/dpiX*2.54*10;
                var mmY = $(document.getElementById('table_sht')).height()/dpiY*2.54*10;

                var widthPDF = 210;
                var heightPDF = 297;
                if (mmX > widthPDF){
                    widthPDF = mmX;
                }
                if (mmY > heightPDF){
                    heightPDF = mmY;
                }

                var doc = new jsPDF("p", "mm", [widthPDF,heightPDF]);
                doc.addImage(piccontent, 'JPEG', 0, 0, mmX,mmY);
                doc.save((shtIns.shtinsname?shtIns.shtinsname:document.title)+(shtIns.shtinscode?"_"+shtIns.shtinscode:"")+(shtIns.refsubject?"_"+shtIns.refsubject:"")+ (shtIns.AutoCodeValue? shtIns.AutoCodeValue:"")+".pdf");
                $(iframe).remove();
            }
        });
        
    });
    btnSaveAsExcel.bind('click', function () {
        //   $('#cell_shttable table').tableToExcel();
        $('#cell_shttable').find('table:visible').table2excel({
            filename: g_userSht.shtname
        });

    });
    //btnSave.bind('click',onSave);  //在表单的onchange事件中绑定
    btnReload.bind('click',onReload);
    btnDelete.bind('click',onDelete);
    btnStartWf.bind('click',onStartWf);
    btnOpenWf.bind('click',onOpenWf);

    if (g_nShtInsRight <=1) btnSave.hide();
    if (g_bIsNew || (8 != shtIns.wfflag && 0 != shtIns.wfflag) || shtIns.creator != g_USERID) btnDelete.hide();
    if (g_bIsNew) {
        btnStartWf.hide();
        btnOpenWf.hide();
    } else if (shtIns.field2 > 0) {
        btnStartWf.hide();
    } else {
        btnOpenWf.hide();
    }
    if (typeof(g_needClose) != "undefined" && g_needClose && g_needClose == 'true') {
        $('#btn-closeIframe').show().bind('click', function () {
            $('#main_contain', parent.document).show();
            $('#shtIframe', parent.document).remove();
        });
    }
    else {
        $('#btn-closeIframe').hide();
    }

    if (g_userSht.shttype == 7) {
        btnSave.hide();
        btnSearch.hide();
        btnReload.hide();
    }

}

// 显示数据表
function showDataTable(dataTable) {
    console.log('显示数据表: ' +dataTable.tablename);

    var m,k, shtCol,rowNo,ColNo,shtCell;
    var cols = dataTable.cpcshtcolofcpcshttables;
  //  console.log(cols);

    for(k=0;k<cols.length;k++) {
        shtCol = cols[k];
        //已支持多页//忽略掉非第一页的列
        //if (shtCol.shtpage>1) continue;
        //设置单元格属性值
        if (dataTable.fixlen == 1) {
            shtCol.fixlen = 1;
            if ($('#sheet_table_' + shtCol.shtpage).length > 0)
                shtCell = $('#sheet_table_' + shtCol.shtpage).find('#shttd_' + shtCol.rowno + '_' + shtCol.colno);
            else {
                if (shtCol.shtpage > 1) continue; //非多页版表单,忽略掉非第一页的列
                shtCell = $('#shttd_' + shtCol.rowno + '_' + shtCol.colno);
            }
            shtCell.attr({
                cpccolid: shtCol.colid,
                cpctableid: dataTable.tableid,
                cpctable: dataTable.tablename,
                cpcrow: 0,
                cpceditable: shtCol.canModify(),
                cpcautocode: shtCol.autocode
            });
            // if (!shtCol.canModify() && shtCol.colstyle == 13){
            //     var divid = 'div' + shtCol.colid;
            //
            //     var div = document.getElementById(divid);
            //     if (div != null) {
            //         value = UE.getEditor(divid).getContent();
            //     }
            // }
        } else {
            shtCol.fixlen = 2;
            var startRow = dataTable.startrow;
            var endRow = dataTable.endrow;

            if ($('#sheet_table_' + shtCol.shtpage).length > 0)
                shtCell = $('#sheet_table_' + shtCol.shtpage).find('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
                    var offset = getCellOffset(this.id);
                    return (offset.row >= startRow && offset.row <= endRow);
                });
            else
                shtCell = $('td[id^=shttd_][id$=_' + shtCol.colno + ']').filter(function (index) {
                    var offset = getCellOffset(this.id);
                    return (offset.row >= startRow && offset.row <= endRow);
                });

            shtCell.each(function (index) {
                $(this).attr({
                    cpccolid: shtCol.colid,
                    cpctableid: dataTable.tableid,
                    cpctable: dataTable.tablename,
                    cpcrow: index,
                    cpceditable: shtCol.canModify(),
                    cpcautocode: shtCol.autocode
                });

                //不定长表支持粘贴表格数据
                $(this).bind('contextmenu', function (e) {
                    grid.stopEditing();
                    var $ctrl = $(e.currentTarget);
                    //console.log($ctrl);
                    e.preventDefault();
                    var pasteData;
                    $('#div_right_menu').menu('show', {
                        left: e.pageX,
                        top: e.pageY,
                        onClick: function (item) {
                            switch (item.id) {
                                case 'paste-table':
                                    $ctrl.val('zhantie');
                                    $('#paste_dialog').dialog({
                                        title: '请输入粘贴数据',
                                        modal: true,
                                        height: 300,
                                        width: 500,
                                        buttons: [{
                                            text: '确定',
                                            iconCls: 'icon-ok',
                                            handler: function () {
                                                pasteData = $('#paste_text').val();
                                                $('#paste_text').val('');
                                                $('#paste_dialog').dialog('close');
                                                dealPasteData($ctrl, pasteData);
                                            }
                                        }, {
                                            text: '取消',
                                            iconCls: 'icon-no',
                                            handler: function () {
                                                $('#paste_text').val('');
                                                $('#paste_dialog').dialog('close');
                                            }
                                        }]
                                    });
                                    break;
                                case 'delete':
                                    console.log('删除行');
                                    shtTable.deleteRow(rowNo);
                                    shtTable.rowcount -= 1;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                })
            });

            //不定长表自动编码字段自动编码
            //  console.log('autocode:' + shtCol.colname + ' ' + shtCol.autocode);
            if (shtCol.autocode == '2') {
                console.log('自动编码' + shtCol.colname);
                shtCell.each(function (index) {
                    shtCol.setCellValueNew(this,index+1,index+1,false);
                });
            }
        }
        shtCell.addClass('cpcvalue');
        shtCell.data('cpccol', shtCol);//Cache Col
        shtCell.data('cpctable', dataTable);//Cache Table

        shtCol.setCellColor(shtCell[0]);
    }

    //不定长表重新计算行
    if (dataTable.fixlen == 2) {
        var oldLength = dataTable.endrow - dataTable.startrow + 1;
        var dataLength = dataTable.getDataLength();
        if (dataLength > oldLength) {
            dataTable.appendRow(oldLength - 1, dataLength - oldLength);
        }
    }

    //填充数据
    for (k = 0; k < cols.length; k++) {
        shtCol = cols[k];
        //已支持多页//忽略掉非第一页的列
        //if (shtCol.shtpage>1) continue;

        if ($('#sheet_table_' + shtCol.shtpage).length > 0)
            shtCell = $('#sheet_table_' + shtCol.shtpage).find('[cpccolid=' + shtCol.colid + ']');
        else
            shtCell = $('[cpccolid=' + shtCol.colid + ']');
        //    console.log(shtCol.colname);
        shtCol.initCellValue(shtCell);
    }
}

/**
 * 处理粘贴表格数据
 * @param $tcell
 * @param data
 */
function dealPasteData($tcell, data) {
    if ($tcell.is('td')) {
        //当前单元格位置
        var $cells = $tcell.parent().children();
        var startCol;
        for (var i = 0; i < $cells.length; i++) {
            if ($cells[i] === $tcell[0]) {
                startCol = i;
                break;
            }
        }
        if (data) {
            //数据拆分为行
            var lines = data.split(/\n/);
            if (!lines[lines.length - 1]) {
                lines.pop();
            }
            //取要填充的行
            var $now_tr = $tcell.parent();
            var $tds;
            for (var i = 0; i < lines.length; i++) {
                //每行数据拆分为单元格
                var line = lines[i];
                var tdatas = line.split(/\t/);
                //塞数据
                $tds = $now_tr.children();
                if ($tds.length < (startCol + 1)) continue;
                $tds = $tds.slice(startCol);
                for (var j = 0; j < tdatas.length; j++) {
                    if ($tds.length === j) {
                        break;	//超出单元格了
                    }
                    //将数据放到单元格
                    setDataToTd($tds[j], tdatas[j]);
                }
                //当前行切换到下一行
                $now_tr = $now_tr.next();
                if ($now_tr.length < 1) break;
            }
        }
    } else {
        console.log('not td');
    }
}

/**
 * 粘贴的单元格数据塞入单元格
 * @param td
 * @param data
 */
function setDataToTd(td, data) {
    var shtCol = $(td).data('cpccol');
    if (!shtCol.canModify()) return;    //不可编辑的单元格不粘贴

    if (data == $(td).attr('cpctext')) return;  //值相同不处理

    //理论上似乎要判断下不可输入的是否存在对应值？...
    var items = shtCol.colstylenote.split('|');
    if (shtCol.colstyle == 1) {
        // 下拉不可输入
    } else if (shtCol.colstyle == 9) {
        // 多选下拉框(不可输入)
    } else if (shtCol.colstyle == 5) {
        // 真假
    }

    if (shtCol.colrtable && shtCol.colrcol && (shtCol.colstyle == 3 || shtCol.colstyle == 7)) {
        var text;
        var addOnId;
        //有内部Id
        if (data.indexOf('|') > -1) {

            addOnId = data.split('|')[0];
            text = data.split('|')[1];
        } else {
            var sqlTool = new WebSQLTool();

            var DisCode = shtCol.colrdispcol;
            if (DisCode.indexOf('|') > -1) {
                DisCode = DisCode.split('|')[0];
            }
            var SqlTmp = "select " + shtCol.colrcol + " from " + shtCol.colrtable + " where (" + DisCode + " = '" + data + "')";


            //老构件表
            if (shtCol.colrtable == 'cpctss') {
                // SqlTmp = SqlTmp + ' and (mrporgid = ' + IntToStr(LoginUser.CurrMrpOrgId) + ')';
            }
            //新构件表
            if (shtCol.colrtable == 'cpcitem') {
                // SqlTmp = SqlTmp + ' and (invorgid = ' + IntToStr(CurrSysVarObj.WorkInvOrgId) + ')';
            }
            //其它约束
            // if RCondition < > '' then
            // SqlTmp := SqlTmp + ' and (' + ReplaceText(RCondition, j) + ')';

            sqlTool.sql = SqlTmp;
            sqlTool.postRequest('select').done(function () {
                console.log(sqlTool.resultdatas);
            });
        }
    }

    shtCol.setCellValueNew(td, data, data, true);
}

/**
 * 取指定数据表
 * @param tableId   表ID
 * @return {cpcshttable}
 */
function getDataTableById(tableId) {
    if (!shtTables) return null;
    for (var i = 0; i < shtTables.length; i++) {
        if (shtTables[i].tableid == tableId) {
            return shtTables[i];
        }
    }
    return null;
}

/**
 * 取指定数据表
 * @param tableName   表名称
 * @return {cpcshttable}
 */
function getDataTableByName(tableName) {
    if (!shtTables) return null;
    for (var i = 0; i < shtTables.length; i++) {
        if (shtTables[i].tablename == tableName) {
            return shtTables[i];
        }
    }
    return null;
}

// 取指定字段
function getDataCol(id) {
    if (!shtCols) return null;
    for (var i = 0; i < shtCols.length; i++) {
        if (shtCols[i].colid == id) return shtCols[i];
    }
    return null;
}

// 取指定字段
function getDataColByName(tableId, name) {
    if (!shtCols) return null;
    for (var i = 0; i < shtCols.length; i++) {
        if (shtCols[i].tableid == tableId && shtCols[i].colname == name)
            return shtCols[i];
    }
    return null;
}

/**
 * 取表单字段所在单元格
 * @param shtCol
 * @param rowNo
 * @return {*}
 */
function getColCellJq(shtCol, rowNo) {
    rowNo = rowNo || 0;
    return $("[cpccolid=" + shtCol.colid + "][cpcrow="  + rowNo + "]");
}

/**
 * 取单元格值
 * col 表单字段；
 * cell 单元格；
 */
function getColCellValue(col, cell) {
    var value = col.getCellValue(cell);
    if (!value || value.length < 1) {
        // 空
        if (1 == col.coltype || 2 == col.coltype) return 0;
    }
    else {
        Logger.warning("getColCellValue " + col.colid + "='" + value + "'");
        if (2 == col.coltype) return parseInt(value);
        if (1 == col.coltype) return parseFloat(value)
    }

    Logger.debug("getColCellValue " + col.colid + "='" + value + "'");
    return value;
}

/******************************************************
 * toolbar button event
 */
// 保存
function onSave() {

    console.log('onSave');

    if (g_noEditing) {
        return;
    }
    grid.stopEditing();

    if (!shtTables || shtTables.length < 1) {
        alert("No data table.");
        return;
    }

    var i,j,k,shtTable,cols,shtCol,rowNos,autoCode,rowCell,bFind;

    //审核定义
    if (shtChecks && shtChecks.length > 0) {
        var shtCheck,expression,ckMsg,rwfProcId,r,tmp,shtTableName,shtColName,result;
        console.log(shtChecks);
        for (i=0;i<shtChecks.length;i++) {
            shtCheck = shtChecks[i];
            //非0.内容校验客户端
            if (shtCheck.cktype != 0) {
                continue;
            }

            //需要替换其中的运算符&比较符
            expression = shtCheck.sexpression
                .replace(/ and /g, ' && ').replace(/ or /g,' || ')
                .replace(/([^=><])=([^=><])/g,'$1==$2').replace(/<>/g,'!=');
            ckMsg = shtCheck.ckmsg;
            rwfProcId = shtCheck.rwfprocid;
            //不是当前过程
            if ((shtCheck.rwfprocid) && (wrapQuotedStr(rwfProcId,',').indexOf(wrapQuotedStr(g_nOpenProcId,',')) < 0)) {
                continue;
            }

            var test = /\[(.+?)]/ig;
            var newStr = expression;
            while (r = test.exec(expression)) {
                //    console.log(r);
                tmp = r[1].split('.');
                shtTableName = tmp[0];
                shtColName = tmp[1];
                shtTable = getDataTableByName(shtTableName);
                if (!shtTable) {
                    $.cpc.showAlert('审核定义[' + shtCheck.ckname  +']' + '定义出错');
                    return;
                }
                shtCol = shtTable.getDataCol(shtColName);
                if (!shtCol) {
                    $.cpc.showAlert('审核定义[' + shtCheck.ckname  +']' + '定义出错');
                    return;
                }
                //仅考虑定长表
                result = shtCol.getText(0);
                if (shtCol.coltype == 0 || shtCol.coltype == 3 || shtCol.coltype == 4) {
                    result = wrapQuotedStr(result);
                } else {
                    result = result || '0';
                }
                newStr = newStr.replace(new RegExp('\\' + r[0], 'g'), result);
            }

            try {
                if (eval(newStr)) {
                    $.cpc.showAlert(ckMsg);
                    return;
                }

            }catch (e) {
                $.cpc.showAlert('审核定义[' + shtCheck.ckname  +']' + '检查出错');
                return;
            }
        }
    }

    //先将一些属性重置为空
    shtIns.creator='';
    shtIns.updator = '';
    shtIns.createtime = '';
    shtIns.updatetime = '';
    shtIns.shtcolofshtinss=[];

    try {
        for (i = 0; i < shtTables.length; i++) {
            shtTable = shtTables[i];
            //定长表
            cols = shtTable.getCols();
            if (cols.length == 0) continue;
            if (shtTable.fixlen == 1) {
                for (j = 0; j < cols.length; j++) {
                    shtCol = cols[j];
                    shtCol.getCellValue();
                }
            } else {
                //检查数据表行数
                rowNos = [];
                var dataLength = shtTable.getDataLength();
                for (j = 0; j < dataLength; j++) {
                    bFind = false;
                    var rowCells = $('td[cpctable=' + shtTable.tablename + '][cpcrow=' + j + ']');
                    console.log(rowCells.length);
                    for (k = 0; k < rowCells.length; k++) {
                        rowCell = rowCells.eq(k);
                        autoCode = rowCell.attr('cpcautocode') == '2';
                        if (!autoCode && rowCell.text()) {
                            rowNos.push(j);
                            bFind = true;
                        }
                        if (bFind) break;
                    }
                }

                //填充值
                for (j = 0; j < cols.length; j++) {
                    shtCol = cols[j];
                    shtCol.getCellValue(rowNos);
                }
            }
            shtIns.shtcolofshtinss = shtIns.shtcolofshtinss.concat(cols);
        }
    } catch (e) {
        $.cpc.showAlert(e);
        return;
    }

  //  console.log(shtCols);

    $.cpc.progressLoad('正在保存数据');
    shtIns.postRequest('websave').always(function () {
        $.cpc.progressClose();
    }).done(function () {
        self.location = self.location.pathname + '?id=' + encodeURIComponent(shtIns.shtinsid)+((typeof g_loginguid !='undefined')?"&loginguid="+g_loginguid:"");
    });
}

function onDelete() {
    // delete
    if (g_bIsNew) {
        return;
    }
    $.messager.confirm('确认提示', '您确定要删除当前记录吗？', function(r){
        if (r){
            var obj = new CPCUserSht();
            obj.shtid = shtId;
            obj.shtinsid = shtIns.shtinsid;
            obj.postRequest('deletedatabyins').done(function () {
                self.location=self.location.pathname;
            });
        }
    });
}

function onReload() {
    location.reload();
}


function onSearch() {
    $('#div_search').dialog({
        id: 'div_search',
        title: '搜索表单',
        width: 800,
        height: 600,
        cache: false,
        collapsible: false,
        href: '/websht/dgShtSearch.html',
        queryParams: {shtid: shtId, shttablename: shtTables[0].tablename},
        modal: true,
        buttons: [{
            id: 'sht-search-btn-ok',
            text: '确定',
            iconCls: 'icon-ok',
            handler: function () {
                var selected = $('#shtinsGrid').datagrid('getSelected');
                if (selected) {
                    self.location = self.location.pathname + '?id=' + encodeURIComponent(selected.shtinsid)+((typeof g_loginguid !='undefined')?"&loginguid="+g_loginguid:"");;
                }
                $('#div_search').dialog('close');
            }
        }, {
            text: '取消',
            iconCls: 'icon-no',
            handler: function () {
                $('#div_search').dialog('close');
            }
        }]
    });
}

function onNew() {
	self.location=self.location.pathname;
}

/**
 * 启动流程
 */
function onStartWf() {

    //判断是否可以启动流程
    console.log('启动流程');
	window.parent.startwf(shtIns.shtid,shtIns.shtinsid,shtIns.wftempid,shtIns.shtname,onReload);
	 //重新加载
	location.reload();
	return;
    if (g_bIsNew ||shtIns.field2 > 0) return;

    if (!(shtIns.wftempid) || shtIns.wftempid == 0) {
        $.cpc.showAlert('未设置流程模板');
        return;
    }

    var true_wftempid=0;
    if (shtIns.wftempid.indexOf(',') > 0) {
        $('body').append('<div id="div_wftemp_select" style="display: none;"></div>');
        $('#div_wftemp_select').dialog({
            title: '选择流程',
            width: 420,
            height: 250,
            cache: false,
            resizable:true,
            maximizable:true,
            collapsible:false,
            href: '/wf/selectWfTemp.html',
            queryParams: { wftempids: shtIns.wftempid},
            modal: true,
            buttons:[{
                id:'wftemp-select-btn-ok',
                text:'确定',
                iconCls: 'icon-ok',
                handler:function(){
                    true_wftempid = $('#selected_wftempid').data('wftempid');
                    if (true_wftempid) {
                        $('#div_wftemp_select').dialog('close');
                        $('#div_wf_start').dialog({
                            title: '启动流程',
                            width: 650,
                            height: 500,
                            cache: false,
                            resizable:true,
                            maximizable:true,
                            collapsible:false,
                            href: '/websht/dgStartWf.html',
                            queryParams: { wftempid: true_wftempid,insid: shtIns.field1},
                            modal: true,
                            buttons:[{
                                id:'wf-start-btn-ok',
                                text:'确定',
                                iconCls: 'icon-ok',
                                handler:function(){
                                    document.getElementById("iframe_wf").contentWindow.submitWf();
                                }
                            },{
                                text:'取消',
                                iconCls: 'icon-no',
                                handler:function(){
                                    $('#div_wf_start').dialog('close');
                                }
                            }]
                        });
                    }
                }
            },{
                text:'取消',
                iconCls: 'icon-no',
                handler:function(){
                    $('#div_wftemp_select').dialog('close');
                }
            }]
        });

    }
    else {
        true_wftempid = shtIns.wftempid;

        if (! (true_wftempid>0)) {
            $.cpc.showAlert('未选择流程模板');
            return;
        }
        $('#div_wf_start').dialog({
            title: '启动流程',
            width: 650,
            height: 500,
            cache: false,
            resizable:true,
            maximizable:true,
            collapsible:false,
            href: '/websht/dgStartWf.html',
            queryParams: { wftempid: true_wftempid,insid: shtIns.field1},
            modal: true,
            buttons:[{
                id:'wf-start-btn-ok',
                text:'确定',
                iconCls: 'icon-ok',
                handler:function(){
                    document.getElementById("iframe_wf").contentWindow.submitWf();
                }
            },{
                text:'取消',
                iconCls: 'icon-no',
                handler:function(){
                    $('#div_wf_start').dialog('close');
                }
            }]
        });
    }
}

function onOpenWf() {
    //判断流程是否存在
    if (clientFlag && clientFlag == 'client') {
        if (shtIns.wfflag > 0) {
            window.location.href = 'cpcapp:openobj(7,' + shtIns.field2 + ',0)';
        }
    } else {
       // window.location = "/wfe.do?wfid=" + shtIns.field2 + "&clienttype=pc";
	    $.base64.utf8encode = true;
        var param = {
			 id: shtIns.field2
		}
        window.location = "/web/index.jsp#/crmman/wfsht?param=" +$.base64.btoa(JSON.stringify(param), true)+"&showmode=2";
    }
}

// 输入控制
//用途是什么？
function onKeyDown(event, dataType) {
    event = event || window.event;
    var key = event.which || event.keyCode;
    //window.status = key;
    if (8 == key || 46 == key || 35 == key || 36 == key || 37 == key || 39 == key) return true; // 退格，删除，home，end，左右光标
    if (9 == key) return true; // tab
    if (13 == key) {
        // 回车转为tab
        if (IsMSIE) {
            window.event.keyCode = 9;
            return true;
        }
        else {
            return false;
        }
    }
    if (2 == dataType) {
        if (key > 57 || key < 48) return false;
    }
    else if (1 == dataType) {
        if (110 != key && (key > 57 || key < 48) && (190 != key) && (key > 105 || key < 96)) return false;
    }
    return true;
}

/**
 * 代换变量中"<>"括号中的值
 * @param strSql    原字符串
 * @param isQuotedStr   是否包含''
 * @return {*}   替换后的字符串
 */
function replaceDefValue(strSql, isQuotedStr) {
    var defTmp;
    strSql = strSql.toUpperCase();
    if (strSql.indexOf('<LOGINUSER>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().userid);
        } else {
            defTmp = getLoginUser().userid;
        }
        strSql = strSql.replace(/<LOGINUSER>/g, defTmp);
    }
    if (strSql.indexOf('<LOGINUSERID>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().userid);
        } else {
            defTmp = getLoginUser().userid;
        }
        strSql = strSql.replace(/<LOGINUSERID>/g, defTmp);
    }
    if (strSql.indexOf('<TODAYTIME>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(FormatDateTime(new Date));
        } else {
            defTmp = FormatDateTime(new Date);
        }
        strSql = strSql.replace(/<TODAYTIME>/g, defTmp);
    }
    if (strSql.indexOf('<TODAY>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(FormatDate(new Date));
        } else {
            defTmp = FormatDate(new Date);
        }
        strSql = strSql.replace(/<TODAY>/g, defTmp);
    }
    if (strSql.indexOf('<LOGINORG>') > -1) {
        if (isQuotedStr) {
            defTmp = wrapQuotedStr(getLoginUser().orgname);
        } else {
            defTmp = getLoginUser().orgname;
        }
        strSql = strSql.replace(/<LOGINORG>/g, defTmp);
    }
    if (strSql.indexOf('<SHTINSID>') > -1) {
        defTmp = shtIns.shtinsid;
        strSql = strSql.replace(/<SHTINSID>/g, defTmp);
    }
    return strSql.toLowerCase();
}

/**
 * 代换中括号的值
 * 返回值代换后的SQl语句
 * @param aSql
 * @return {{resultSQL: string, isSelectSql: boolean}}
 */
function replaceColValue(aSql) {
    var result = {resultSQL: aSql, isSelectSql: true};

    aSql = replaceDefValue(aSql, true);

    return result;
}

/**
 * 代换其它约束中的字符串
 * @param aCondition    条件语句
 * @param rowNo    当前行
 * @return {string} 替换成功的条件SQL
 */
function replaceText(aCondition, rowNo) {
    var resultCondition = aCondition;

    var test = /\[(.+?)]/ig;
    var r, tmp, tableName, colName, shtTable, shtCol, fixLen, shtCell, colType, colStyle, colValue;
    while (r = test.exec(aCondition)) {
        tmp = r[1].split('.');
        if (tmp.length < 2) throw '约束条件定义出错';
        tableName = tmp[0];
        colName = tmp[1];
        shtTable = getDataTableByName(tableName);
        if (!shtTable) throw '约束条件定义出错,数据表:' + tableName + '不存在';
        shtCol = shtTable.getDataCol(colName);
        if (!shtCol) throw '约束条件定义出错,数据表:' + tableName + '不存在字段属性[' + colName + ']';
        if (shtCol.fixlen == 1) {
            shtCell = shtCol.getColCell(0);
        } else {
            shtCell = shtCol.getColCell(rowNo);
        }
        //shtCell = shtCol.getColCell(rowNo);
        if (shtCell.length == 0) throw '找不到字段属性所在的单元格:' + shtCol.colname;
        if (!shtCell.text()) throw '请先输入:' + shtCol.colalias;

        colType = shtCol.coltype;//列类型
        colStyle = shtCol.colstyle;//列样式
        /** 1.数字||2.整数 */
        if (colType == 1 || colType == 2) {
            /** 1.下拉单选不能输入||3.选择不能输入||7.多选不能输入*/
            if (shtCell.attr('cpcvalue')) {
                colValue = shtCell.attr('cpcvalue');
            } else {
                colValue = shtCell.attr('cpctext');
            }
        } else {
            if (shtCell.attr('cpcvalue')) {
                colValue = wrapQuotedStr(shtCell.attr('cpcvalue'));
            } else {
                colValue = wrapQuotedStr(shtCell.attr('cpctext'));
            }
        }
        //替换条件中的字符串
        resultCondition = resultCondition.replace(new RegExp('\\' + r[0], 'g'), colValue);
    }
    return resultCondition;
}

function getCellSqlText(name) {
    console.trace('getCellSqlText' + name);
    var tmp = name.split('.');
    if (tmp.length < 2) {
        throw '字段定义有错';
    }
    var tableName = tmp[0];
    var colName = tmp[1];
    var shtTable = getDataTableByName(tableName);
    if (!shtTable) throw '数据表:' + tableName + '不存在';

    var valueCol = shtTable.getDataCol(colName);
    if (!valueCol) throw '数据表字段:' + colName + '不存在';

    var valueCell = valueCol.getColCell();
    var value = valueCell.attr('cpctext');
    if (valueCol.coltype == 0 || valueCol.coltype == 3 || valueCol.coltype == 4) {
        value = "'" + value + "'";
    } else {
        if (!value) value = 0;
    }
    return value;
}

/*// 检查变量，并转换成js表达式
function checkShtVar(col) {
//	console.log(col);
    if (!shtValues) return null; // 没有变量
    var varsql = null;
    for (var i = 0; i < shtValues.length; i++) {
        if (shtValues[i].varcode == col.varcode) {
            varsql = shtValues[i].vsql;
            col.dsid = shtValues[i].dsid;
            break;
        }
    }

    //替换
    //获取SQL语句
    if (!varsql) return;
    var result = varsql;
    var test = /\[(.+?)]/ig;
    var r = null;
    while (r = test.exec(varsql)) {
        var value = getCellSqlText(r[1]);
        console.log(r[0]);
        result = result.replace(r[0], value);
    }

    console.log(result);
    return result;
}*/

/**
 * 单元格求和
 * @param shtCol
 * @return {number}
 * @constructor
 */
function SUMCol(shtCol) {
    console.log(shtCol);
    var result = 0;
    var numberTmp;
    $("[cpccolid=" + shtCol.colid + "]").each(function () {
        numberTmp = parseFloat($(this).attr('cpctext'));
        if (isNaN(numberTmp)) numberTmp = 0;
        result += numberTmp;
    });
    return result;
}

/**
 * 单元格求平均值
 * @param shtCol
 * @return {number}
 * @constructor
 */
function AVERAGECol(shtCol) {
    console.log(shtCol);
    var result = 0;
    var numberTmp;
    var count = 0;
    $("[cpccolid=" + shtCol.colid + "]").each(function () {
        numberTmp = parseFloat($(this).attr('cpctext'));
        //只取有数字的
        if (!isNaN(numberTmp)) {
            result += numberTmp;
            count++;
        }
    });
    return eval(result+'/'+count);
}

/**
 * 合计函数
 */
function SUM() {
    if (arguments.length == 0) {
        return 0;
    }

    console.log(arguments.length);
    var i,arg,value;
    var result = 0;
    for (i=0;i<arguments.length;i++) {
        arg = arguments[i];
        if (arg.indexOf('#STARTROW#') > -1 || arg.indexOf('#ENDROW#') > -1) {
            var indexS = arg.indexOf('[');
            var indexE = arg.indexOf(']');
            var tmp = arg.slice(indexS+1,indexE).split('.');
            var tableName =tmp[0];
            var colName = tmp[1];
            var shtTable = getDataTableByName(tableName);
            var shtCol = shtTable.getDataCol(colName);
            console.log(colName);
            value = SUMCol(shtCol);
            result += value;
        } else {
            value = eval(arg);
            if (isNaN(value)) value =0;
            result += value;
        }
    }

    return result;
}

/**
 * 平均函数
 */
function AVERAGE() {
    if (arguments.length == 0) {
        return 0;
    }

    console.log(arguments.length);
    var i,arg,value;
    var result = 0;
    for (i=0;i<arguments.length;i++) {
        arg = arguments[i];
        if (arg.indexOf('#STARTROW#') > -1 || arg.indexOf('#ENDROW#') > -1) {
            var indexS = arg.indexOf('[');
            var indexE = arg.indexOf(']');
            var tmp = arg.slice(indexS+1,indexE).split('.');
            var tableName =tmp[0];
            var colName = tmp[1];
            var shtTable = getDataTableByName(tableName);
            var shtCol = shtTable.getDataCol(colName);
            console.log(colName);
            value = AVERAGECol(shtCol);
            result += value;
        } else {
            value = eval(arg);
            if (isNaN(value)) value =0;
            result += value;
        }
    }

    return result;
}

/**
 * 合计函数，返回中文数字
 */
function SUMASCN() {
    if (1 == arguments.length)
        return toChineseMoney(arguments[0]);
    else
        return toChineseMoney(SUM(arguments));
}

/**
 * 转换成中文货币表示
 */
function toChineseMoney(value) {
    Logger.debug("toChineseMoney:" + value);
    if (!value || isNaN(value)) return "";
    var whole = "" + value;
    //分离整数与小数
    var num;
    var dig;
    if (whole.indexOf(".") == -1) {
        num = whole;
        dig = "";
    }
    else {
        num = whole.substr(0, whole.indexOf("."));
        dig = whole.substr(whole.indexOf(".") + 1, whole.length);
    }

    //转换整数部分
    var i = 1;
    var len = num.length;
    var dw2 = new Array("", "万", "亿");//大单位
    var dw1 = new Array("拾", "佰", "千");//小单位
    var dw = new Array("", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");//整数部分用
    var dws = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");//小数部分用
    var k1 = 0;//计小单位
    var k2 = 0;//计大单位

    var str = "";
    for (i = 1; i <= len; i++) {
        var n = num.charAt(len - i);
        if (n == "0") {
            if (k1 != 0) str = str.substr(1, str.length - 1);
        }
        str = dw[Number(n)].concat(str);//加数字
        if (len - i - 1 >= 0)//在数字范围内
        {
            if (k1 != 3)//加小单位
            {
                str = dw1[k1].concat(str);
                k1++;
            }
            else//不加小单位，加大单位
            {
                k1 = 0;
                var temp = str.charAt(0);
                if (temp == "万" || temp == "亿")//若大单位前没有数字则舍去大单位
                    str = str.substr(1, str.length - 1);
                str = dw2[k2].concat(str);
            }
        }

        if (k1 == 3)//小单位到千则大单位进一
        {
            k2++;
        }
    }

    //转换小数部分
    var strdig = "";
    for (i = 0; i < 2; i++) {
        var n = dig.charAt(i);
        strdig += dws[Number(n)];//加数字
        if (0 == i)
            strdig += "角";
        else
            strdig += "分";
    }

    str += "圆" + strdig;
    return str;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

$(function(){
    var pal='';
    try {   //防止出现跨域报错
        pal = $('#wf_container',window.parent.document);
    }
    catch (e) {
    }
    //流程页面隐藏表单按钮
    if (pal.length) {
        $('#btn-wf-open').hide();
        $('#btn-search').hide();
        $('#btn-back').hide();
    }

    $('#sht-wrapper').on('scroll',function(){
        var datep = $('#_my97DP').length?$('#_my97DP'):$(parent.document).find('#_my97DP');
        datep.hide();
    })
    //刚打开表单不允许保存
    $('#btn-save').linkbutton('disable').unbind();

    //手机端隐藏保存/删除/刷新外的按钮
    if (!IsPC()) {
        $('#btn-wf-open,#btn-wf-start,#btn-search,#btn-print,#btn-saveaspdf,#btn-back').hide();
    }

})

