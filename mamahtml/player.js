(function(f) {
    var c = {};
    var i = function(k) {
        return c[k];
    };
    var r = function(k) {
        if (!c[k]) {
            var m = {
                exports: {}
            };
            try {
                f[k].call(m.exports, m, m.exports, r, i)
            } catch (e) {};
            c[k] = m.exports;
        }
        return c[k];
    };
    return r('a');
})({
    a: function(module, exports, require, include) {
        var _ = require("A");
        var HEADHTML = require("b");
        var BODYHTML = require("B");
        var CSS = require("c");
        var firstPlayTime = 0;
        var key = "MA_MA_SHUO_YAO_BU_HE_BIE_REN_MING_MING_CHONG_FU_JIU_YAO_ZU_GOU_CHANG";

        function getOffsetLeft(el) {
            var offset = el.offsetLeft;
            if ((document.webkitIsFullScreen || document.mozFullScreen) && el.offsetParent == getNd("player")) return offset;
            if (el.offsetParent != null) offset += getOffsetLeft(el.offsetParent);
            return offset
        }

        function parseNd() {
            var nodes = [];
            _.each(document.querySelectorAll("[nd]"), function(el, nd) {
                (nodes[nd = el.getAttribute("nd")] = nodes[nd] || []).push(el)
            });
            return function(nd, beArray) {
                return beArray ? nodes[nd] : nodes[nd] && nodes[nd][0]
            }
        }

        function formatZero(num, index) {
            num = num.toString();
            while (num.length < index) {
                num = "0" + num
            }
            return num
        }

        function formatTime(time) {
            var d = new Date(time * 1e3);
            return [formatZero(d.getUTCHours(), 2), formatZero(d.getUTCMinutes(), 2), formatZero(d.getUTCSeconds(), 2)].join(":")
        }

        function inWhichNd(el) {
            return el.getAttribute("nd") || el == document.body ? el : inWhichNd(el.parentNode)
        }

        function initStorage(loadedCallback) {
            var _callback = null;
            var callList = {};

            function onmessage(e) {
                var data = {};
                try {
                    data = JSON.parse(e.data);
                    data.test
                } catch (err) {
                    data = {}
                }
                if (data.name != "MAMA_STORAGE") return;
                if (data.type == "loaded") {
                    loadedCallback && loadedCallback();
                    return
                }
                callList[data.cid] && callList[data.cid](data.value, data.key);
                delete callList[data.cid]
            }
            var s = _.cTag("iframe", {
                width: 0,
                height: 0
            }, {}, document.body);
            window.addEventListener("message", onmessage);
            s.src = _.html("/storage.html");
            return {
                get: function(key, callback) {
                    var cid = (+(new Date) + Math.random()).toString();
                    callList[cid] = callback;
                    s.contentWindow.postMessage(JSON.stringify({
                        type: "get",
                        key: key,
                        cid: cid
                    }), "*")
                },
                set: function(key, value) {
                    s.contentWindow.postMessage(JSON.stringify({
                        type: "set",
                        key: key,
                        value: value
                    }), "*")
                },
                destory: function() {
                    window.removeEventListener("message", onmessage)
                }
            }
        }
        var centerTimer;
        var centerCount = 0;
        var documentClick = {
            state: function(el) {
                video[video.paused ? "play" : "pause"]()
            },
            mute: function(el) {},
            close: function(el) {
                if (document.webkitIsFullScreen || document.mozFullScreen) {
                    document.webkitCancelFullScreen && document.webkitCancelFullScreen();
                    document.mozCancelFullScreen && document.mozCancelFullScreen();
                    return
                }
                if (parent == self) window.close();
                destory();
                if (key in parent) window.parent[key].close()
            },
            all: function(el) {
                if (_.hasClass(document.body, "allscreen")) {
                    _.removeClass(document.body, "allscreen")
                } else {
                    _.addClass(document.body, "allscreen")
                }
            },
            "new": function() {
                var width = video.width || 800;
                var height = video.height || 600;
                var newWin = window.open("about:blank", "MAMA_Player", "toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no,left=1,top=1,width=" + width + ",height=" + height);
                var newBody = newWin.document.body;
                newBody.innerHTML = '<textarea name="" id="info" style="display:none;">{info}</textarea>'.replace("{info}", _info);
                newBody.appendChild(_.cTag("script", null, {
                    src: _.js("/player/index.js"),
                    charset: "UTF-8"
                }));
                setTimeout(function() {
                    documentClick.close()
                }, 100)
            },
            hd: function(el) {
                firstPlayTime = video.currentTime;
                if (video.src.indexOf(el.getAttribute("data-src")) > -1) return;
                video.src = el.getAttribute("data-src");
                _.each(getNd("hd", true), function(nd) {
                    var fn = _[nd != el ? "addClass" : "removeClass"];
                    fn(nd, "disable"), fn(nd, "hide")
                })
            },
            cmt: function(el) {
                if (isCmtOn == true) {
                    _.addClass(el, "disable");
                    comments.hide()
                } else {
                    _.removeClass(el, "disable");
                    comments.show()
                }
            },
            full: function(el) {
                if (document.webkitIsFullScreen || document.mozFullScreen) {
                    document.webkitCancelFullScreen && document.webkitCancelFullScreen();
                    document.mozCancelFullScreen && document.mozCancelFullScreen()
                } else {
                    getNd("bottom").style.opacity = "0";
                    player.webkitRequestFullScreen && player.webkitRequestFullScreen();
                    player.mozRequestFullScreen && player.mozRequestFullScreen()
                }
            },
            center: function(el) {
                centerCount++;
                clearTimeout(centerTimer);
                centerTimer = setTimeout(function() {
                    if (centerCount == 1) documentClick["state"](el);
                    centerCount = 0
                }, 200)
            },
            showkeymap: function() {
                _[_.hasClass(getNd("keymap"), "show") ? "removeClass" : "addClass"](getNd("keymap"), "show")
            },
            closekeymap: function() {
                _.removeClass(getNd("keymap"), "show")
            },
            light: function() {
                var isDark = _.hasClass(document.body, "dark");
                store.set("MAMA_dark", !isDark ? 1 : 0);
                _[isDark ? "removeClass" : "addClass"](document.body, "dark")
            }
        };

        function onclick(evt) {
            var nd = inWhichNd(evt.target);
            var ndStr = nd.getAttribute("nd");
            if (ndStr in documentClick) {
                documentClick[ndStr](nd)
            }
        }
        var keyMap = {
            32: function(evt) {
                documentClick.state(evt)
            },
            39: function() {
                var time = video.currentTime + 10;
                video.currentTime = time < video.duration ? time : video.duration;
                videoEvents.timeupdate();
                log("移动至 " + formatTime(video.currentTime))
            },
            37: function() {
                var time = video.currentTime - 10;
                video.currentTime = time > 0 ? time : 0;
                videoEvents.timeupdate();
                log("移动至 " + formatTime(video.currentTime))
            },
            38: function() {
                var volume = video.volume + .1;
                video.volume = volume < 1 ? volume : 1;
                store.set("MAMA_volume", video.volume);
                videoEvents.timeupdate();
                log("音量至 " + parseInt(video.volume * 100, 10) + "%")
            },
            40: function() {
                var volume = video.volume - .1;
                video.volume = volume > 0 ? volume : 0;
                store.set("MAMA_volume", video.volume);
                videoEvents.timeupdate();
                log("音量至 " + parseInt(video.volume * 100, 10) + "%")
            },
            70: function() {
                documentClick.full(getNd("full"))
            },
            76: function() {
                documentClick.light()
            },
            191: function(evt) {
                if (evt.shiftKey) {
                    documentClick.showkeymap()
                }
            }
        };

        function keyDown(evt) {
            var key = evt.keyCode.toString();
            if (key in keyMap) keyMap[key](evt)
        }
        /log/;
        var logTimer;

        function log(logmsg) {
            var nd = getNd("log");
            clearTimeout(logTimer);
            _.addClass(nd, "show");
            nd.innerHTML = ["&nbsp;", "&nbsp;", logmsg, "&nbsp;", "&nbsp;"].join("");
            logTimer = setTimeout(function() {
                _.removeClass(nd, "show")
            }, 3e3)
        }

        function getPst(part, all, isString) {
            return isString ? part / all * 100 + "%" : part / all
        }
        var loading = {
            isShow: false,
            show: function() {
                if (loading.isShow == false) {
                    _.addClass(getNd("loading"), "show");
                    loading.isShow = true
                }
            },
            hide: function() {
                if (loading.isShow == true) {
                    _.removeClass(getNd("loading"), "show");
                    loading.isShow = false
                }
            }
        };
        var lastCurrentTime = 0;
        var videoEvents = {
            timeupdate: function() {
                loading[video.readyState >= 3 ? "hide" : "show"]();
                if (Math.abs(video.currentTime - lastCurrentTime) < 1) {
                    return
                }
                if (!isDragingProgress) {
                    var pst = getPst(video.currentTime, video.duration);
                    getNd("progress_timeline").style.width = pst * 100 + "%";
                    getNd("progress_timeline").setAttribute("pst", pst)
                }
                if (!isDragingVolume) {
                    getNd("volume_timeline").style.width = getPst(video.volume, 1, true)
                }
                getNd("msg").innerHTML = formatTime(video.currentTime) + ' <span class="disable">/ ' + formatTime(video.duration) + "</span>";
                lastCurrentTime = video.currentTime
            },
            play: function() {
                getNd("state").innerHTML = '<i class="icon-pause"></i>';
                _.removeClass(getNd("pausedtoplay"), "show");
                if (firstPlayTime !== false) {
                    video.currentTime = firstPlayTime;
                    firstPlayTime = false
                }
                log("播放")
            },
            pause: function() {
                _.addClass(getNd("pausedtoplay"), "show");
                getNd("state").innerHTML = '<i class="icon-play"></i>';
                log("暂停")
            },
            canplay: function() {
                var width = video.videoWidth;
                var height = video.videoHeight;
                var bottomHeight = getNd("bottom").offsetHeight;
                if (document.webkitIsFullScreen || document.mozFullScreen) return;
                var _width = 800;
                var _height = _width / width * height || 450;
                if (_height + bottomHeight > window.innerHeight - 80) {
                    _height = window.innerHeight - 80 - bottomHeight;
                    _width = _height / height * width;
                    _width = _width < 500 ? 500 : _width
                }
                getNd("layer").style.height = _height + "px";
                getNd("layer").style.paddingBottom = bottomHeight + "px";
                getNd("player").style.paddingBottom = bottomHeight + "px";
                getNd("layer").style.width = _width + "px"
            },
            seeking: function() {
                loading.show()
            },
            seeked: function() {
                loading.hide()
            }
        };
        var isDragingProgress = false;
        var isDragingVolume = false;
        var timeline = {
            mouseDown: function(evt) {
                var nd = inWhichNd(evt.target);
                if (nd == getNd("progress") || nd == getNd("progress_timeline")) {
                    isDragingProgress = true
                }
                if (nd == getNd("volume") || nd == getNd("volume_timeline")) {
                    isDragingVolume = true
                }
                timeline.mouseMove(evt)
            },
            mouseMove: function(evt) {
                if (isDragingProgress) {
                    _.addClass(getNd("player"), "draging");
                    var lineWidth = evt.pageX - getOffsetLeft(getNd("progress"));
                    lineWidth = lineWidth < 0 ? 0 : lineWidth;
                    var pst = getPst(lineWidth, getNd("progress").offsetWidth);
                    getNd("progress_timeline").style.width = pst * 100 + "%";
                    getNd("progress_timeline").setAttribute("pst", pst);
                    log("移动至 " + formatTime(pst * video.duration))
                }
                if (isDragingVolume) {
                    _.addClass(getNd("player"), "draging");
                    _.addClass(getNd("volume").parentNode, "vdraging");
                    var lineWidth = evt.pageX - getOffsetLeft(getNd("volume"));
                    lineWidth = lineWidth < 0 ? 0 : lineWidth;
                    var pst = getPst(lineWidth, getNd("volume").offsetWidth);
                    pst = pst > 1 ? 1 : pst;
                    getNd("volume_timeline").style.width = pst * 100 + "%";
                    video.volume = pst;
                    store.set("MAMA_volume", video.volume);
                    log("音量至 " + parseInt(pst * 100, 10) + "%")
                }
            },
            mouseUp: function(evt) {
                if (isDragingProgress) {
                    _.removeClass(getNd("player"), "draging");
                    video.currentTime = getNd("progress_timeline").getAttribute("pst") * video.duration;
                    isDragingProgress = false
                }
                if (isDragingVolume) {
                    _.removeClass(getNd("player"), "draging");
                    _.removeClass(getNd("volume").parentNode, "vdraging");
                    isDragingVolume = false
                }
            }
        };
        var isCmtOn = false;
        var cmts = [];
        var lastindex = 0;
        var lastTime = 0;
        var pushFArr = [];
        var comments = {
            init: function() {
                cmts = info.comments.sort(function(a, b) {
                    return parseFloat(a.p[0]) - parseFloat(b.p[0])
                });
                isCmtOn = true
            },
            hide: function() {
                isCmtOn = false;
                getNd("cbottom").innerHTML = getNd("cfloat").innerHTML = ""
            },
            show: function() {
                isCmtOn = true
            },
            pushB: function(msg, color) {
                var showTime = 4;
                var block = _.cTag("div", {}, {}, getNd("cbottom"));
                block.className = "cblock2";
                block.appendChild(document.createTextNode(msg));
                if (!getNd("cbottom").children[0]) {
                    getNd("cbottom").appendChild(block)
                } else {
                    getNd("cbottom").insertBefore(block, getNd("cbottom").children[0])
                }
                block.style.cssText += ";color:" + color + ";";
                setTimeout(function() {
                    _.rNode(block)
                }, showTime * 1e3)
            },
            pushF: function(msg, color) {
                var showTime = 8;
                var playWidth = player.offsetWidth;
                var allWidth = playWidth;
                var width = 0;
                var height = 0;
                var block = _.cTag("div", {}, {}, getNd("cfloat"));
                var index = false;
                block.className = "cblock";
                block.appendChild(document.createTextNode(msg));
                width = block.offsetWidth;
                height = block.offsetHeight;
                allWidth = allWidth + width;
                removeTime = showTime / playWidth * allWidth;
                isShowdTime = showTime / playWidth * width;
                _.each(pushFArr, function(value, i) {
                    if (value != true) {
                        index = i;
                        pushFArr[i] = true;
                        return false
                    }
                });
                if (index === false) {
                    index = pushFArr.length;
                    pushFArr.push(true)
                }
                block.style.cssText += ";-webkit-transform: translate3d(" + allWidth + "px," + index * height + "px,0);color:" + color + ";";
                setTimeout(function() {
                    block.style.cssText += ";-webkit-transform: translate3d(-" + width + "px," + index * height + "px,0);-webkit-transition:-webkit-transform " + showTime + "s linear;"
                }, 0);
                setTimeout(function() {
                    pushFArr[index] = false
                }, isShowdTime * 1e3);
                setTimeout(function() {
                    _.rNode(block)
                }, removeTime * 1e3)
            },
            push: function(aCmt) {
                var color = "#" + (aCmt.p[3] | 0).toString(16);
                var msg = aCmt.msg;
                if (aCmt.p[1] <= 3) comments.pushF(msg, color);
                if (aCmt.p[1] == 4 || aCmt.p[1] == 5) comments.pushB(msg, color)
            },
            loop: function() {
                if (!isCmtOn) return;
                var nowTime = video.currentTime;
                if (lastTime == nowTime) {
                    return
                }
                if (lastTime > nowTime || nowTime > lastTime + 3) {
                    getNd("cbottom").innerHTML = getNd("cfloat").innerHTML = "";
                    lastTime = nowTime - 1;
                    lastindex = 0
                }
                var range = [lastTime, nowTime];
                for (var i = lastindex, len = cmts.length, aCmt, cTime; i < len; i++) {
                    aCmt = cmts[i];
                    cTime = parseFloat(aCmt.p[0]);
                    if (cTime < range[0]) {
                        continue
                    } else if (cTime > range[1]) {
                        break
                    } else {
                        comments.push(aCmt)
                    }
                }
                lastTime = nowTime;
                lastindex = i - 1
            }
        };
        var playerMouseMoveTimer;
        var lastPos = {};

        function playerMouseMove(evt) {
            if (lastPos.x === evt.pageX && lastPos.y === evt.pageY) {
                return
            }
            lastPos = {
                x: evt.pageX,
                y: evt.pageY
            };
            if (getNd("bottom").style.opacity == "0") {
                getNd("bottom").style.opacity = ""
            }
            clearTimeout(playerMouseMoveTimer);
            _.addClass(getNd("player"), "mousemove");
            playerMouseMoveTimer = setTimeout(function() {
                _.removeClass(getNd("player"), "mousemove")
            }, 2e3)
        }
        var _info = _.byId("info").value;
        var info = JSON.parse(_info);
        if (info.comments) comments.init();
        document.head.innerHTML = HEADHTML({
            csshref: [_.css("/player.css")],
            cantouch: "createTouch" in document
        }) + CSS;
        document.body.innerHTML = BODYHTML(info);
        var getNd = parseNd();
        var video = getNd("video");
        var player = getNd("player");
        video.src = info.urls[info.urls.length - 1]["url"];
        var store = initStorage(function() {
            store.get("MAMA_volume", function(value, key) {
                if (key != "MAMA_volume") return;
                value = parseFloat(value);
                video.volume = isNaN(value) ? 1 : value
            });
            store.get("MAMA_dark", function(value, key) {
                if (key != "MAMA_dark") return;
                value = parseInt(value);
                value = isNaN(value) ? 0 : value;
                _[value ? "addClass" : "removeClass"](document.body, "dark")
            })
        });
        if (parent != self && parent[key]) {
            parent[key].start();
            parent[key].rlog()
        }
        if (self == parent) {
            documentClick.all();
            _.addClass(document.body, "new")
        }
        document.body.addEventListener("click", onclick);
        self != parent && parent.document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("mousedown", timeline.mouseDown);
        document.body.addEventListener("mousemove", timeline.mouseMove);
        document.body.addEventListener("mouseup", timeline.mouseUp);
        getNd("center").addEventListener("dblclick", documentClick.full);
        video.addEventListener("timeupdate", videoEvents.timeupdate);
        video.addEventListener("play", videoEvents.play);
        video.addEventListener("pause", videoEvents.pause);
        video.addEventListener("canplay", videoEvents.canplay);
        video.addEventListener("seeking", videoEvents.seeking);
        video.addEventListener("seeked", videoEvents.seeked);
        player.addEventListener("mousemove", playerMouseMove);
        video.addEventListener("timeupdate", comments.loop);

        function destory() {
            store.destory();
            document.body.removeEventListener("click", onclick);
            self != parent && parent.document.body.removeEventListener("keydown", keyDown);
            document.body.removeEventListener("keydown", keyDown);
            document.body.removeEventListener("mousedown", timeline.mouseDown);
            document.body.removeEventListener("mousemove", timeline.mouseMove);
            document.body.removeEventListener("mouseup", timeline.mouseUp);
            getNd("center").removeEventListener("dblclick", documentClick.full);
            video.removeEventListener("timeupdate", videoEvents.timeupdate);
            video.removeEventListener("play", videoEvents.play);
            video.removeEventListener("pause", videoEvents.pause);
            video.removeEventListener("canplay", videoEvents.canplay);
            video.removeEventListener("seeking", videoEvents.seeking);
            video.removeEventListener("seeked", videoEvents.seeked);
            player.removeEventListener("mousemove", playerMouseMove);
            video.removeEventListener("timeupdate", comments.loop)
        }
    },
    A: function(module, exports, require, include) {
        var _ = {};
        _.environment = "production";
        _.canPlayM3U8 = !!document.createElement("video").canPlayType("application/x-mpegURL") ? true : false;
        _.noop = function() {};
        _.each = function(arrOrObject, fn, context, i, len) {
            if (typeof arrOrObject.length == "number") {
                for (i = 0, len = arrOrObject.length; i < len; i++)
                    if (fn.call(context, arrOrObject[i], i) == false) break
            } else
                for (i in arrOrObject)
                    if (fn.call(context, arrOrObject[i], i) == false) break
        };
        _.extend = function(target) {
            var length = arguments.length,
                i = 1,
                mixin;
            while (i < length) {
                mixin = arguments[i];
                for (var name in mixin) {
                    if (mixin.hasOwnProperty(name)) {
                        target[name] = mixin[name]
                    }
                }
                i++
            }
            return target
        };
        _.queryString = function(query) {
            var arr = [];
            _.each(query, function(value, key) {
                value !== undefined && arr.push(key + "=" + value)
            });
            return arr.join("&")
        };
        _.cookie = function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return null
        };
        _.byId = function(id) {
            return document.getElementById(id)
        };
        _.rNode = function(el) {
            try {
                el.parentNode.removeChild(el)
            } catch (e) {}
        };
        _.cTag = function(tagName, styles, attrs, out) {
            var t = document.createElement(tagName),
                cssText = "";
            _.each(styles || {}, function(value, key) {
                cssText += [key, ":", value, ";"].join("")
            }), t.style.cssText = cssText;
            _.each(attrs || {}, function(value, key) {
                t.setAttribute(key, value)
            });
            return out && out.appendChild(t) || t
        };
        _.hasClass = function(el, cls) {
            return el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))
        };
        _.addClass = function(el, cls) {
            if (!_.hasClass(el, cls)) el.className += " " + cls
        };
        _.removeClass = function(el, cls) {
            if (_.hasClass(el, cls)) {
                el.className = el.className.replace(new RegExp("(\\s|^)" + cls + "(\\s|$)"), " ").trim()
            }
        };
        _.jsonp = function(url, param, callback, handler) {
            var scr, back = "HTML5PlayerBookMarkCodeByZythum" + +(new Date) + Math.random().toString().replace(".", "");
            var hasQuery = url.indexOf("?") >= 0;
            param = _.queryString(param);
            if (param.length) param = (hasQuery ? "&" : "?") + param;
            handler = [hasQuery || param.length ? "&" : "?", handler || "callback", "=", back].join("");
            window[back] = function() {
                callback && callback.apply(this, arguments);
                delete window[back];
                _.rNode(scr)
            };
            (scr = _.cTag("script", {}, {}, document.body)).src = url + param + handler
        };
        _.js = function(path, url) {
            url = _.environment == "development" ? "http://zythum.sinaapp.com:8080/youkuhtml5playerbookmark/client/development/js" : "http://2.zythum.sinaapp.com/youkuhtml5playerbookmark/client/production/js";
            return url + (path || "") + "?_t=" + +(new Date)
        };
        _.css = function(path, url) {
            url = _.environment == "development" ? "http://zythum.sinaapp.com:8080/youkuhtml5playerbookmark/client/development/static/css" : "http://2.zythum.sinaapp.com/youkuhtml5playerbookmark/client/production/static/css";
            return url + (path || "") + "?_t=" + +(new Date)
        };
        _.html = function(path, url) {
            url = _.environment == "development" ? "http://zythum.sinaapp.com:8080/youkuhtml5playerbookmark/client/development/static/html" : "http://2.zythum.sinaapp.com/youkuhtml5playerbookmark/client/production/static/html";
            return url + (path || "")
        };
        _.service = function(name) {
            return "http://2.zythum.sinaapp.com/youkuhtml5playerbookmark/service/" + (name || "") + ".php"
        };
        var _logNode = _.cTag("div", {
            position: "fixed",
            top: "0",
            left: "0",
            height: "20pt",
            "line-height": "20pt",
            padding: "2pt 5pt",
            color: "#fff",
            background: "rgb(131, 117, 91)",
            "white-space": "nowrap",
            "z-index": "999999999",
            margin: "0"
        });
        _.log = function(text) {
            window.console || window.console(text);
            document.body.appendChild(_logNode).innerHTML = text
        };
        _.rlog = function() {
            _.rNode(_logNode)
        };
        module.exports = _
    },
    b: function(module, exports, require, include) {
        module.exports = function(data, fn, hole) {
            fn = fn || function(str) {
                return str
            };
            var ret = "",
                str_0 = fn('<meta http-equiv=Content-Type content=texthtml; charset=utf-8>\n<title>妈妈再也不用担心我的macbook发烫了计划</title>\n<link href="http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">'),
                str_1 = fn("<style>\n.ctrl .btnarea .hide{max-width:300pt;opacity:1;overflow:hidden;}\n</style>");
            ret += str_0;
            if (data.cantouch) {
                ret += str_1
            }
            return ret
        }
    },
    B: function(module, exports, require, include) {
        module.exports = function(data, fn, hole) {
            fn = fn || function(str) {
                return str
            };
            var ret = "",
                str_0 = fn('<div nd="cover" class="cover"></div>\n<div class="title">\n<span>妈妈再也不用担心我的macbook发烫了计划</span>\n&nbsp;\n<span class="titlebtn" nd="showkeymap">快捷键&#91;?&#93;</span>\n&nbsp;\n<span class="titlebtn light" nd="light"></span>\n</div>\n<div nd="layer" class="layer" style="opacity:0;">\n<div nd="player" class="player">\n<video nd="video" class="video" autoplay="true"></video>\n<div class="ctrl">\n<div nd="loading" class="loading show">\n<div class="loading_l"></div>\n<div class="loading_r"></div>\n</div>\n<div nd="pausedtoplay" class="pausedtoplay show"> <i class="icon-play"></i>\n</div>\n<div nd="center" class="center"></div>\n<div nd="bottom" class="bottom" style="height:31pt">\n<div class="func">\n<div class="right">'),
                str_1 = fn('<div class="line"></div>\n<div class="btnarea btn-cmt">\n<span nd="cmt"> <i class="icon-comments"></i>\n</span>\n</div>'),
                str_2 = fn('<div class="line"></div>\n<div class="btnarea btn-hd">\n<span>\n<i class="icon-film"></i>\n</span>'),
                str_3 = fn('<span nd="hd" class="'),
                str_4 = fn("text disable hide"),
                str_5 = fn("text"),
                str_6 = fn('" data-src="'),
                str_7 = fn('">'),
                str_8 = fn("</span>"),
                str_9 = fn('</div>\n<div class="line"></div>\n<div class="btnarea btn-full">\n<span nd="full">\n<i class="icon-fullscreen"></i>\n</span>\n</div>\n</div>\n<div class="left">\n<div class="btnarea btn-state">\n<span nd="state">\n<i class="icon-pause"></i>\n</span>\n</div>\n<div class="line"></div>\n<div class="btnarea btn-volume">\n<span nd="mute">\n<i class="icon-volume-up"></i>\n</span>\n<div style="display:inline-block;height:100%;line-height:25pt;background:transparent;color:#fff;vertical-align:top;" class="hide">\n<div nd="volume" class="volume">\n<div nd="volume_timeline" class="timeline"></div>\n</div>\n</div>\n</div>\n<div class="line"></div>\n<div class="btnarea btn-msg">\n<span nd="msg" class="text"></span>\n</div>\n</div>\n</div>\n<div nd="progress" class="progress">\n<div nd="progress_timeline" class="timeline"></div>\n</div>\n</div>\n<div nd="log" class="log"></div>\n<div class="top">\n<span nd="close"><i class="icon-remove"></i></span>\n<span nd="all"><i class="icon-resize-full"></i></span>\n<span nd="new"><i class="icon-external-link"></i></span>\n</div>\n<div nd="keymap" class="keymap">\n<div class="block"><div class="mapkey"><i class="icon-arrow-right"></i></div><div class="mapfn">前进10秒</div></div><div class="block"><div class="mapkey"><i class="icon-arrow-left"></i></div><div class="mapfn">后退10秒</div></div><div class="block"><div class="mapkey"><i class="icon-arrow-up"></i></div><div class="mapfn">音量加10%</div></div><div class="block"><div class="mapkey"><i class="icon-arrow-down"></i></div><div class="mapfn">音量减10%</div></div><div class="block"><div class="mapkey">f</div><div class="mapfn">开启全屏</div></div><div class="block"><div class="mapkey">esc</div><div class="mapfn">取消全屏</div></div><div class="block"><div class="mapkey">space</div><div class="mapfn">播放/暂停</div></div><div class="block"><div class="mapkey">?</div><div class="mapfn">帮助</div></div>\n<div nd="closekeymap" class="closekeymap"><i class="icon-remove"></i></div>\n</div>\n</div>\n<div class="comment">\n<div nd="cfloat"  class="cfloat"></div>\n<div nd="cbottom" class="cbottom"></div>\n</div>\n</div>\n</div>');
            ret += str_0;
            if (data.comments) {
                ret += str_1
            }
            ret += str_2;
            for (data.urls.i = 0, data.urls.len = data.urls.length; data.urls.i < data.urls.len; data.urls.i++) {
                data.url = data.urls[data.urls.i];
                ret += str_3;
                if (data.urls.i !== data.urls.len - 1) {
                    ret += str_4
                } else {
                    ret += str_5
                }
                ret += str_6;
                ret += data.url.url;
                ret += str_7;
                ret += data.url.name;
                ret += str_8
            }
            ret += str_9;
            return ret
        }
    },
    c: function(module, exports, require, include) {
        module.exports = "<style>\n@charset \"utf-8\";\n\n *                 {margin:0; padding:0; font-family: arial, sans-serif;}\n html              {height:100%; width:100%;}\n body              {height:100%; width:100%; -webkit-user-select:none;-moz-user-select:none;font-size:10pt;overflow:hidden;}\n.cover             {position:fixed;top:0;left:0;bottom:0;right:0;background: #fff;background: rgba(255,255,255,0.9);background: -webkit-radial-gradient(50% 50%, ellipse closest-corner, rgba(255,255,255,0.65) 1%, rgba(255,255,255,1) 100%);background: -moz-radial-gradient(50% 50%, ellipse closest-corner, rgba(255,255,255,0.65) 1%, rgba(255,255,255,1) 100%);background: radial-gradient(50% 50%, ellipse closest-corner, rgba(255,255,255,0.65) 1%, rgba(255,255,255,1) 100%);}\nbody.dark\n .cover            {background:rgba(0,0,0,0.9)}\n.title             {position:fixed;top:0;left:0;height:20pt;line-height:20pt;padding:2pt 5pt;color:#fff;background:rgb(131, 117, 91);white-space:nowrap;}\n.title\n .titlebtn         {opacity:0.5;cursor:pointer;}\n.title\n .titlebtn:hover   {opacity:0.7;}\n.title\n .light:before     {content:'关灯';}\nbody.dark\n .title\n  .light:before    {content:'开灯';}\n\n.layer             {max-width:100%;max-height:100%;width:800px;height:500px;overflow:hidden; margin:auto; position:fixed;top:0; left:0; bottom:0; right:0;box-shadow:0 0 1px 1px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.7);-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1!important;}\n.player            {position:absolute;top:0;left:0;bottom:0;right:0;background:#000;-webkit-transition:padding 0.3s ease;-moz-transition:padding 0.3s ease;transition:padding 0.3s ease;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}\n.video             {width:100%;height:100%;}\n/*控制按钮*/\n.ctrl              {position:absolute;z-index:2;top:0;right:0;bottom:0;left:0;overflow:hidden;}\n.ctrl\n .bottom           {position:absolute;bottom:0;left:0;right:0;height:31pt;-webkit-transition:all 0.2s ease 0.2s;-moz-transition:all 0.2s ease 0.2s;transition:all 0.2s ease 0.2s;background:rgb(131, 117, 91);-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}\n.ctrl\n .progress         {position:absolute;top:0;left:0;right:0;height:6pt;background:rgb(147, 133, 110);cursor:pointer;padding-right:5pt;}\n.ctrl\n .timeline         {width:0%;background:rgb(158, 209, 105);height:100%;position:relative;min-width:8pt;max-width:100%;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}\n.ctrl\n .volume           {width:60pt;display:inline-block;height:5pt;margin:10pt 5pt;vertical-align:top;background:rgb(147, 133, 110);padding-right:5pt;}\n.ctrl\n .timeline:after   {content:'';position:absolute;right:-5pt;top:-3pt;bottom:-3pt;width:12pt;background:rgb(238, 238, 227);border-radius:10pt;box-shadow:0pt 0pt 2pt rgba(0,0,0,0.8);-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}\n.ctrl\n .volume\n  .timeline:after  {width:11pt;}\n.ctrl\n .func             {position:absolute;top:6pt;left:0;right:0;bottom:0;white-space:nowrap;overflow:hidden;}\n.ctrl\n .left             {position:absolute;top:0;left:0;bottom:0;text-align:left;}\n.ctrl\n .right            {position:absolute;top:0;left:0;bottom:0;right:0;text-align:right;}\n.ctrl\n .line             {display:inline-block;height:100%;width:1pt;background:#fff;opacity:0.1;}\n.ctrl\n .btnarea          {text-align:center;display:inline-block;height:100%;vertical-align:top;cursor:pointer;padding:0 5pt;}\n.ctrl\n .btnarea\n   span            {display:inline-block;height:100%;line-height:25pt;background:transparent;color:#fff;vertical-align:top;}\n.ctrl\n .btnarea\n   span.disable    {color:#aaa;}\n.ctrl\n .btnarea\n   span:before,\n.ctrl\n .btnarea\n   span:after      {content:'';display:inline-block;width:5pt;}\n.ctrl\n .btnarea\n   span\n    i              {line-height:25pt;}\n.ctrl\n .btnarea\n   span.text       {font-size:11pt; font-weight:bold;}\n.ctrl\n .btn-state        {width:60pt;font-size:13pt;}\n.ctrl\n .btn-state\n  [nd=state]       {width:100%;text-align:center;}\n.ctrl\n .btn-volume       {font-size:14pt;}\n.ctrl\n .btn-msg          {font-size:14pt;}\n.ctrl\n .btn-cmt          {font-size:14pt;}\n.ctrl\n .btn-hd           {font-size:11pt;}\n .ctrl\n .btn-full         {font-size:14pt;}\n.ctrl\n .btnarea\n  .hide            {max-width:0;opacity:0;overflow:hidden;-webkit-transition:max-width 1s ease 0.2s, opacity 1s ease 0.3s;-moz-transition:max-width 1s ease 0.2s, opacity 1s ease 0.3s;transition:max-width 1s ease 0.2s, opacity 1s ease 0.3s;}\n.btnarea\n  .hide.vdraging   {max-width:300pt;opacity:1;}\n.ctrl\n .btnarea:hover\n  .hide            {max-width:300pt;opacity:1;}\n.ctrl\n .log              {max-width:0;position:absolute;font-weight:bold;top:5pt;left:5pt;background:rgba(0, 0, 0, 0.7);white-space:nowrap;font-size:12pt;color:#fff;line-height:20pt;height:20pt;-webkit-transition:max-width 0.5s ease;-moz-transition:max-width 0.5s ease;transition:max-width 0.5s ease;overflow:hidden;letter-spacing:-1pt;}\n.ctrl\n .log.show         {max-width:300pt;}\n.ctrl\n .top              {position:absolute;top:0;right:0;background:rgba(0, 0, 0, 0.5);opacity:0;}\n.ctrl\n .top\n   span            {color:#fff;font-size:14pt;display:block;margin:0 auto;width:26pt;height:26pt;line-height:26pt;text-align:center;cursor:pointer;}\n.ctrl\n .top\n   span\n    i              {line-height:26pt;}\n\n.ctrl\n .center           {position:absolute;top:40pt;right:40pt;bottom:40pt;left:40pt;}\n\n[nd=\"hd\"]:hover,\n.btn-state:hover,\n.btn-full:hover    {background:rgba(0,0,0,0.1)!important;}\n.ctrl\n .top\n   span:hover      {background:rgba(0,0,0,0.9)!important;}\n\n\n\n/*弹幕*/\n.comment           {position: absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;}\n.comment\n .cfloat           {position: absolute; top:10px; left:0; right:0; bottom:0; pointer-events:none; }\n.comment\n .cbottom          {position: absolute; left:0; right:0; bottom:0; pointer-events:none; }\n.comment\n .cblock           {padding:3px 5px;top:0;left:0;display:inline-block; position:absolute; color:#fff; font-size:14pt; white-space: nowrap; font-weight: bold; letter-spacing: -1px; text-shadow: 1px 1px 2px #000; pointer-events:none; }\n.comment\n .cblock2          {color:#fff; width:auto; display:block; font-weight: bold; font-size:22px; letter-spacing: -1px; text-shadow: 1px 1px 2px #000; pointer-events:none; text-align: center; padding-bottom:8px; }\n\n/*loading*/\n\n\n/*满屏*/\n.allscreen \n .layer            {width:auto!important;height:auto!important;}\n.allscreen \n .player           {padding-bottom: 0px!important;}\n.allscreen\n .ctrl\n  .bottom          {opacity:0;}\n.allscreen\n .ctrl\n  .bottom:hover    {opacity:1;}\n\n.new\n  [nd=new]         {display:none!important;}\n\n.mousemove\n .ctrl\n  .top             {opacity:1!important;}\n.mousemove\n .ctrl\n  .bottom          {opacity:1!important;}\n.draging\n .ctrl\n  .bottom          {opacity:1!important;}\n\n.player:fullscreen {padding-bottom: 0px!important;}\n.player:fullscreen\n .ctrl\n  .bottom:hover    {opacity:1;}\n.player:fullscreen\n .ctrl\n  .bottom          {opacity:0;bottom:30pt;left:15%;right:15%;border:15pt solid rgb(131, 117, 91);border-width:10pt 5pt 4pt 5pt;border-radius:3pt;box-shadow:0 0 3pt #333;}\n\n.player:-webkit-full-screen {padding-bottom: 0px!important;}\n.player:-webkit-full-screen\n .ctrl\n  .bottom:hover    {opacity:1;}\n.player:-webkit-full-screen\n .ctrl\n  .bottom          {opacity:0;bottom:30pt;left:15%;right:15%;border:15pt solid rgb(131, 117, 91);border-width:10pt 5pt 4pt 5pt;border-radius:3pt;box-shadow:0 0 3pt #333;}\n\n.player:-moz-full-screen {padding-bottom: 0px!important;}\n.player:-moz-full-screen\n .ctrl\n  .bottom:hover    {opacity:1;}\n.player:-moz-full-screen\n .ctrl\n  .bottom          {opacity:0;bottom:30pt;left:15%;right:15%;border:15pt solid rgb(131, 117, 91);border-width:10pt 5pt 4pt 5pt;border-radius:3pt;box-shadow:0 0 3pt #333;}\n\n.mousemove.player:fullscreen          {cursor:auto;}\n.mousemove.player:-webkit-full-screen {cursor:auto;}\n.mousemove.player:-moz-full-screen    {cursor:auto;}\n.player:fullscreen                    {cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==);}\n.player:-webkit-full-screen           {cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==);}\n.player:-moz-full-screen              {cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==);}\n.player:fullscreen [nd=all]           {display:none}\n.player:-webkit-full-screen [nd=all]  {display:none}\n.player:-moz-full-screen [nd=all]     {display:none}\n\n/*pausedtoplay*/\n.pausedtoplay        {position:absolute;top:0;left:0;right:0;bottom:0;display:none;background:rgba(0,0,0,0.3);}\n.pausedtoplay i      {position:absolute;width:100pt;height:100pt;top:50%;left:50%;transform:translate3d(-50%, -50%, 0);-webkit-transform:translate3d(-50%, -50%, 0);-moz-transform:translate3d(-50%, -50%, 0);text-align:center;line-height:100pt;text-shadow:0 0 2pt rgba(0,0,0,0.8);font-size:50pt;color:#fff;}\n.pausedtoplay.show   {display:block;}\n\n.pausedtoplay.show + .loading.show {display:none;}\n\n/*loading*/\n.loading{width:30pt;height:30pt;position:absolute;bottom:38pt;right:8pt;opacity:0.9;display:none;}\n.loading.show{display:block;}\n.player:fullscreen .loading                 {width:80pt;height:80pt;top:50%;left:50%;transform:translate3d(-50%, -50%, 0);}\n.player:fullscreen .loading_r:after         {border-width:14pt;}\n.player:-webkit-full-screen .loading        {width:80pt;height:80pt;top:50%;left:50%;-webkit-transform:translate3d(-50%, -50%, 0);}\n.player:-webkit-full-screen .loading_r:after{border-width:14pt;}\n.player:-moz-full-screen .loading           {width:80pt;height:80pt;top:50%;left:50%;-moz-transform:translate3d(-50%, -50%, 0);}\n.player:-moz-full-screen .loading_r:after   {border-width:14pt;}\n.loading_l{width:50%; height:100%; position:absolute; top:0;left:0;overflow:hidden;\n  -moz-animation: loading_l 1.5s infinite linear;\n  -o-animation: loading_l 1.5s infinite linear;\n  -webkit-animation: loading_l 1.5s infinite linear;\n  animation: loading_l 1.5s infinite linear;\n  -moz-transform-origin:100% 50%;-webkit-transform-origin:100% 50%;-o-transform-origin:100% 50%;\n}\n.loading_l:after{content:\"\";display:block;position:absolute; top:0;left:0;bottom:0;right:-100%;border-radius:100pt;border:3pt solid #fff;}\n.loading_r{width:50%; height:100%; position:absolute; top:0;right:0;overflow:hidden;\n  -moz-animation: loading_r 1.5s infinite linear;\n  -o-animation: loading_r 1.5s infinite linear;\n  -webkit-animation: loading_r 1.5s infinite linear;\n  animation: loading_r 1.5s infinite linear;\n  -moz-transform-origin:0% 50%;-webkit-transform-origin:0% 50%;-o-transform-origin:0% 50%;\n}\n.loading_r:after{content:\"\";display:block;position:absolute; top:0;right:0;bottom:0;left:-100%;border-radius:100pt;border:8pt solid #fff;}\n\n@-moz-keyframes loading_l {\n  0% { -moz-transform: rotate(0deg); }\n  100% { -moz-transform: rotate(359deg); }\n}\n@-webkit-keyframes loading_l {\n  0% { -webkit-transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(359deg); }\n}\n@-o-keyframes loading_l {\n  0% { -o-transform: rotate(0deg); }\n  100% { -o-transform: rotate(359deg); }\n}\n@-ms-keyframes loading_l {\n  0% { -ms-transform: rotate(0deg); }\n  100% { -ms-transform: rotate(359deg); }\n}\n@keyframes loading_r {\n  0% { transform: rotate(359deg); }\n  100% { transform: rotate(0deg); }\n}\n@-moz-keyframes loading_r {\n  0% { -moz-transform: rotate(359deg); }\n  100% { -moz-transform: rotate(0deg); }\n}\n@-webkit-keyframes loading_r {\n  0% { -webkit-transform: rotate(359deg); }\n  100% { -webkit-transform: rotate(0deg); }\n}\n@-o-keyframes loading_r {\n  0% { -o-transform: rotate(359deg); }\n  100% { -o-transform: rotate(0deg); }\n}\n@-ms-keyframes loading_r {\n  0% { -ms-transform: rotate(359deg); }\n  100% { -ms-transform: rotate(0deg); }\n}\n@keyframes loading_r {\n  0% { transform: rotate(359deg); }\n  100% { transform: rotate(0deg); }\n}\n\n/*快捷键*/\n.keymap                 {position:absolute;top:0;left:0;right:0;background:rgb(131, 117, 91);padding:10pt 10pt;text-align:left;color:#fff;font-size:10pt;font-weight:bold;opacity:0.8;display:none;}\n.keymap.show            {display:block;}\n.keymap .block          {width:130pt;margin:3pt 5pt;display:inline-block;vertical-align:top;text-align:center;white-space:nowrap;line-height:140%;}\n.keymap .block .mapkey  {display:inline-block;border:1pt solid #fff; border-radius:3pt;width:40pt;height:13pt;line-height:13pt}\n.keymap .block .mapkey i{line-height:13pt;}\n.keymap .block .mapfn   {display:inline-block;margin-left:5pt;width:60pt;height:15pt;line-height:15pt}\n.keymap .closekeymap    {position:absolute;top:0;right:0;width:26pt;height:26pt;line-height:26pt;text-align:center;cursor:pointer;font-size:14pt;}\n.keymap .closekeymap i  {line-height:26pt;}	\n</style>"
    }
});