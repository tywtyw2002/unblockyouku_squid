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
        var loader = require("b");
        _.log("&#x52A0;&#x8F7D;&#x5988;&#x5988;&#x8BA1;&#x5212;&#x4E2D;...");

        function t(init, reg, fid) {
            return {
                reg: reg,
                call: function(c) {
                    return init(function(u, m) {
                        return c({
                            urls: u,
                            flashElementId: fid,
                            comment: m
                        })
                    })
                }
            }
        }
        var sites = {
            "163open": t.apply(_, require("c")),
            acfun: t.apply(_, require("C")),
            iqiyi: t.apply(_, require("d")),
            qq: t.apply(_, require("D")),
            sohu: t.apply(_, require("e")),
            56: t.apply(_, require("E")),
            bilibili: t.apply(_, require("f")),
            letv: t.apply(_, require("F")),
            tudou: t.apply(_, require("g")),
            youku: t.apply(_, require("G")),
            noop: {
                reg: true,
                call: function() {
                    _.log("&#x8FD9;&#x4E2A;&#x9875;&#x9762;&#x4E0D;&#x5728;&#x5988;&#x5988;&#x8BA1;&#x5212;&#x7684;&#x6D89;&#x53CA;&#x8303;&#x56F4;&#x4E2D;");
                    setTimeout(function() {
                        _.rlog()
                    }, 5e3)
                }
            }
        };
        _.each(sites, function(handler) {
            if (handler.reg) {
                handler.call(loader);
                return false
            }
        })
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
        require("B")();
        var key = "MA_MA_SHUO_YAO_BU_HE_BIE_REN_MING_MING_CHONG_FU_JIU_YAO_ZU_GOU_CHANG";
        var _ = require("A");
        var styles = {
            position: "fixed",
            width: "100%",
            height: "100%",
            display: "block",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            "z-index": "9999999",
            border: "none",
            background: "transparent"
        };
        var attrs = {
            src: "about:blank",
            frameborder: "0",
            scrolling: "no",
            allowtransparency: "yes",
            mozallowfullscreen: "mozallowfullscreen",
            webkitallowfullscreen: "webkitallowfullscreen"
        };
        var playerPath = _.js("/player/index.js");
        var iframeContent = '<textarea name="" id="info" style="display:none;">{info}</textarea>';

        function parseUrls(urls) {
            var rs = [];
            _.each(urls, function(url, name) {
                rs.push({
                    name: name,
                    url: url
                })
            });
            return rs
        }
        module.exports = function(videoInfo, iframe, iwindow, ibody) {
            var cacheBodyStyle;
            if (key in window) return;
            window[key] = {
                close: function() {
                    iframe && (iframe.src = "");
                    _.rNode(iframe);
                    delete window[key];
                    try {
                        document.body.style.cssText = cacheBodyStyle;
                        flashPlaceHoder.parentNode.insertBefore(flash, flashPlaceHoder);
                        _.rNode(flashPlaceHoder)
                    } catch (e) {}
                },
                start: function() {
                    cacheBodyStyle = document.body.style.cssText;
                    document.body.style.cssText += ";overflow:hidden;"
                },
                rlog: function() {
                    _.rlog()
                }
            };
            ibody = (iwindow = (iframe = _.cTag("iframe", styles, attrs, document.body)).contentWindow).document.body;
            ibody.innerHTML = iframeContent.replace("{info}", JSON.stringify({
                urls: parseUrls(videoInfo.urls) || [],
                comments: videoInfo.comment
            }));
            ibody.appendChild(_.cTag("script", null, {
                src: playerPath,
                charset: "UTF-8"
            }));
            try {
                var flash = _.byId(videoInfo.flashElementId);
                var flashPlaceHoder = _.cTag("span", null, null);
                flash.parentNode.insertBefore(flashPlaceHoder, flash);
                _.rNode(flash)
            } catch (e) {}
        }
    },
    B: function(module, exports, require, include) {
        var flashText = '<div style="text-shadow:0 0 2px #eee;letter-spacing:-1px;background:#eee;font-weight:bold;padding:0;font-family:arial,sans-serif;font-size:30px;color:#ccc;width:152px;height:52px;border:4px solid #ccc;border-radius:12px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -80px;text-align:center;line-height:52px;">Flash</div>';
        var count = 0;
        var flashBlocks = {};
        var click2ShowFlash = function(e) {
            var index = this.getAttribute("data-flash-index");
            var flash = flashBlocks[index];
            flash.setAttribute("data-flash-show", "isshow");
            this.parentNode.insertBefore(flash, this);
            this.parentNode.removeChild(this);
            this.removeEventListener("click", click2ShowFlash, false)
        };
        var createAPlaceHolder = function(flash, width, height) {
            var index = count++;
            var style = document.defaultView.getComputedStyle(flash, null);
            var positionType = style.position;
            positionType = positionType === "static" ? "relative" : positionType;
            var margin = style["margin"];
            var display = style["display"] == "inline" ? "inline-block" : style["display"];
            var style = ["", "width:" + width + "px", "height:" + height + "px", "position:" + positionType, "margin:" + margin, "display:" + display, "margin:0", "padding:0", "border:0", "border-radius:1px", "cursor:pointer", "background:-webkit-linear-gradient(top, rgba(240,240,240,1)0%,rgba(220,220,220,1)100%)", ""];
            flashBlocks[index] = flash;
            var placeHolder = document.createElement("div");
            placeHolder.setAttribute("title", "&#x70B9;&#x6211;&#x8FD8;&#x539F;Flash");
            placeHolder.setAttribute("data-flash-index", "" + index);
            flash.parentNode.insertBefore(placeHolder, flash);
            flash.parentNode.removeChild(flash);
            placeHolder.addEventListener("click", click2ShowFlash, false);
            placeHolder.style.cssText += style.join(";");
            placeHolder.innerHTML = flashText;
            return placeHolder
        };
        var parseFlash = function(target) {
            if (target instanceof HTMLObjectElement) {
                if (target.innerHTML.trim() == "") return;
                if (target.getAttribute("classid") && !/^java:/.test(target.getAttribute("classid"))) return
            } else if (!(target instanceof HTMLEmbedElement)) return;
            var width = target.offsetWidth;
            var height = target.offsetHeight;
            if (width > 160 && height > 60) {
                createAPlaceHolder(target, width, height)
            }
        };
        var handleBeforeLoadEvent = function(e) {
            var target = e.target;
            if (target.getAttribute("data-flash-show") == "isshow") return;
            parseFlash(target)
        };
        module.exports = function() {
            var embeds = document.getElementsByTagName("embed");
            var objects = document.getElementsByTagName("object");
            for (var i = 0, len = objects.length; i < len; i++) objects[i] && parseFlash(objects[i]);
            for (var i = 0, len = embeds.length; i < len; i++) embeds[i] && parseFlash(embeds[i])
        }
    },
    c: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                callback({
                    "&#x9AD8;&#x6E05;": window.openCourse.getCurrentMovie().appsrc
                })
            }, /open\.163\.com/.test(window.location.host), "FPlayer"
        ]
    },
    C: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                function sina(vid, callback, commentInfo) {
                    callback({
                        sina: "http://edge.v.iask.com.sinastorage.com/" + vid + ".mp4"
                    }, commentInfo)
                }

                function youku(vid, callback, commentInfo) {
                    _.jsonp(_.service("getyoukuid"), {
                        id: vid
                    }, function(param) {
                        var mk_a3 = "b4et";
                        var mk_a4 = "boa4";
                        var userCache_a1 = "4";
                        var userCache_a2 = "1";
                        var rs;
                        var sid;
                        var token;

                        function na(a) {
                            if (!a) return "";
                            var a = a.toString(),
                                c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
                            i = a.length;
                            f = 0;
                            for (e = ""; f < i;) {
                                do c = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == c);
                                if (-1 == c) break;
                                do b = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == b);
                                if (-1 == b) break;
                                e += String.fromCharCode(c << 2 | (b & 48) >> 4);
                                do {
                                    c = a.charCodeAt(f++) & 255;
                                    if (61 == c) return e;
                                    c = h[c]
                                } while (f < i && -1 == c);
                                if (-1 == c) break;
                                e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
                                do {
                                    b = a.charCodeAt(f++) & 255;
                                    if (61 == b) return e;
                                    b = h[b]
                                } while (f < i && -1 == b);
                                if (-1 == b) break;
                                e += String.fromCharCode((c & 3) << 6 | b)
                            }
                            return e
                        }

                        function D(a) {
                            if (!a) return "";
                            var a = a.toString(),
                                c, b, f, e, g, h;
                            f = a.length;
                            b = 0;
                            for (c = ""; b < f;) {
                                e = a.charCodeAt(b++) & 255;
                                if (b == f) {
                                    c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                                    c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
                                    c += "==";
                                    break
                                }
                                g = a.charCodeAt(b++);
                                if (b == f) {
                                    c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                                    c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
                                    c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2);
                                    c += "=";
                                    break
                                }
                                h = a.charCodeAt(b++);
                                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
                                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
                                c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
                            }
                            return c
                        }

                        function E(a, c) {
                            for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
                            for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
                            for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
                            return e
                        }

                        function F(a, c) {
                            for (var b = [], f = 0; f < a.length; f++) {
                                for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
                                    if (c[e] == i) {
                                        i = e;
                                        break
                                    }
                                b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
                            }
                            return b.join("")
                        }

                        function T(a, c) {
                            this._sid = sid;
                            this._seed = a.seed;
                            this._fileType = c;
                            var b = new U(this._seed);
                            this._streamFileIds = a.streamfileids;
                            this._videoSegsDic = {};
                            for (c in a.segs) {
                                for (var f = [], i = 0, g = 0; g < a.segs[c].length; g++) {
                                    var h = a.segs[c][g],
                                        q = {};
                                    q.no = h.no;
                                    q.size = h.size;
                                    q.seconds = h.seconds;
                                    h.k && (q.key = h.k);
                                    q.fileId = this.getFileId(a.streamfileids, c, parseInt(g), b);
                                    q.type = c;
                                    q.src = this.getVideoSrc(h.no, a, c, q.fileId);
                                    f[i++] = q
                                }
                                this._videoSegsDic[c] = f
                            }
                        }

                        function U(a) {
                            this._randomSeed = a;
                            this.cg_hun()
                        }
                        U.prototype = {
                            cg_hun: function() {
                                this._cgStr = "";
                                for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", c = a.length, b = 0; b < c; b++) {
                                    var f = parseInt(this.ran() * a.length);
                                    this._cgStr += a.charAt(f);
                                    a = a.split(a.charAt(f)).join("")
                                }
                            },
                            cg_fun: function(a) {
                                for (var a = a.split("*"), c = "", b = 0; b < a.length - 1; b++) c += this._cgStr.charAt(a[b]);
                                return c
                            },
                            ran: function() {
                                this._randomSeed = (211 * this._randomSeed + 30031) % 65536;
                                return this._randomSeed / 65536
                            }
                        };
                        T.prototype = {
                            getFileId: function(a, c, b, f) {
                                for (var i in a)
                                    if (i == c) {
                                        streamFid = a[i];
                                        break
                                    }
                                if ("" == streamFid) return "";
                                c = f.cg_fun(streamFid);
                                a = c.slice(0, 8);
                                b = b.toString(16);
                                1 == b.length && (b = "0" + b);
                                b = b.toUpperCase();
                                c = c.slice(10, c.length);
                                return a + b + c
                            },
                            getVideoSrc: function(a, c, d, f, i, g) {
                                if (!c.videoid || !d) return "";
                                var h = {
                                        flv: 0,
                                        flvhd: 0,
                                        mp4: 1,
                                        hd2: 2,
                                        "3gphd": 1,
                                        "3gp": 0
                                    }[d],
                                    q = {
                                        flv: "flv",
                                        mp4: "mp4",
                                        hd2: "flv",
                                        "3gphd": "mp4",
                                        "3gp": "flv"
                                    }[d],
                                    k = a.toString(16);
                                1 == k.length && (k = "0" + k);
                                var l = c.segs[d][a].seconds,
                                    a = c.segs[d][a].k;
                                if ("" == a || -1 == a) a = c.key2 + c.key1;
                                d = "";
                                c.show && (d = c.show.show_paid ? "&ypremium=1" : "&ymovie=1");
                                c = "/player/getFlvPath/sid/" + sid + "_" + k + "/st/" + q + "/fileid/" + f + "?K=" + a + "&hd=" + h + "&myp=0&ts=" + l + "&ypp=0" + d;
                                f = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + f + "_" + token)));
                                c = c + ("&ep=" + f) + "&ctype=12&ev=1" + ("&token=" + token);
                                c += "&oip=" + rs.data[0].ip;
                                return "http://k.youku.com" + (c + ((i ? "/password/" + i : "") + (g ? g : "")))
                            }
                        };
                        rs = param;
                        var a = param.data[0],
                            _id = a.videoid,
                            c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), na(a.ep));
                        c = c.split("_");
                        sid = c[0];
                        token = c[1];
                        if (_.canPlayM3U8) {
                            var ep = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
                            var oip = a.ip;
                            callback({
                                "YOUKU&#x6807;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
                                "YOUKU&#x9AD8;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=mp4&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
                                "YOUKU&#x8D85;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=hd2&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
                            })
                        } else {
                            var t = new T(a);
                            callback({
                                YOUKU: t._videoSegsDic["3gphd"][0].src
                            })
                        }
                    })
                }

                function qq(vid, callback, commentInfo) {
                    _.jsonp("http://vv.video.qq.com/geturl", {
                        otype: "json",
                        vid: vid,
                        charge: 0
                    }, function(param) {
                        callback({
                            QQ: param.vd.vi[0].url
                        }, commentInfo)
                    })
                }

                function tudou(vid, callback, commentInfo) {
                    if (_.canPlayM3U8) {
                        callback({
                            "TUDOU&#x9AD8;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + vid + "&st=3",
                            "TUDOU&#x8D85;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + vid + "&st=4",
                            "TUDOU&#x539F;&#x753B;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + vid + "&st=5",
                            "TUDOU&#x6807;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + vid + "&st=2"
                        }, commentInfo)
                    } else {
                        _.jsonp("http://vr.tudou.com/v2proxy/v2.js?", {
                            it: vid,
                            st: "52%2C53%2C54"
                        }, function(param) {
                            if (param.code == -1) return;
                            for (var urls = {}, i = 0, len = param.urls.length; i < len; i++) {
                                urls[i] = param.urls[i]
                            }
                            return callback(urls, commentInfo)
                        }, "jsonp")
                    }
                }
                _.jsonp(_.service("acfun"), {
                    vid: document.querySelectorAll("[data-vid].active")[0].getAttribute("data-vid")
                }, function(vid, videoInfo, commentInfo) {
                    console.log(vid, videoInfo);
                    videoInfo.toLowerCase() == "sina" ? sina(vid, callback, commentInfo) : videoInfo.toLowerCase() == "youku" ? youku(vid, callback, commentInfo) : videoInfo.toLowerCase() == "qq" ? qq(vid, callback, commentInfo) : videoInfo.toLowerCase() == "tudou" ? tudou(vid, callback, commentInfo) : "false"
                })
            }, /acfun\./.test(window.location.host), "area-player"
        ]
    },
    d: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                _.jsonp("http://passport.iqiyi.com/apis/user/info.action", {
                    qyid: _.cookie("QC006")
                }, function(param) {
                    var vid = _.byId("flashbox").getAttribute("data-player-videoid");
                    var vinfo = Q.PageInfo.playPageInfo;
                    _.jsonp("http://cache.m.iqiyi.com/jp/tmts/" + vinfo.tvId + "/" + vid + "/", _.extend({
                        uid: param.data ? param.data.userinfo.uid : "",
                        cupid: Q.PageInfo.adPlayerId,
                        type: _.canPlayM3U8 ? "m3u8" : "mp4",
                        platForm: "h5"
                    }, window.weorjjigh(vinfo.tvId)), function(param) {
                        callback({
                            "&#x9AD8;&#x6E05;": param.data.m3u
                        })
                    })
                })
            }, /iqiyi\.com/.test(window.location.host), "flash"
        ]
    },
    D: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var vid = location.search.match(/vid=([0-9a-zA-Z]+)/);
                if (vid) {
                    vid = vid[1]
                } else {
                    vid = location.href.match(/\/([0-9a-zA-Z]+).html/);
                    if (vid) {
                        vid = vid[1];
                        if (window.COVER_INFO && window.COVER_INFO.id == vid) {
                            vid = window.VIDEO_INFO.vid
                        }
                    }
                }
                _.jsonp("http://vv.video.qq.com/geturl", {
                    otype: "json",
                    vid: vid,
                    charge: 0
                }, function(param) {
                    console.log(param);
                    callback({
                        "&#x9AD8;&#x6E05;": param.vd.vi[0].url
                    })
                })
            }, /v\.qq\.com/.test(window.location.host), "mod_player"
        ]
    },
    e: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var vid = window.vid;
                var uid = _.cookie("SUV");

                function shift_en(i) {
                    var t = i.length,
                        e = 0;
                    return this.replace(/[0-9a-zA-Z]/g, function(s) {
                        var a = s.charCodeAt(0),
                            n = 65,
                            o = 26;
                        a >= 97 ? n = 97 : 65 > a && (n = 48, o = 10);
                        var r = a - n;
                        return String.fromCharCode((r + i[e++ % t]) % o + n)
                    })
                }

                function m3u8(callback) {
                    _.jsonp("http://proxy.c70.io:5204/pad.tv.sohu.com/playinfo", {
                        vid: vid,
                        playlistid: 0,
                        sig: shift_en.call("" + (new Date).getTime(), [23, 12, 131, 1321]),
                        key: shift_en.call(vid, [23, 12, 131, 1321]),
                        uid: uid
                    }, function(param) {
                        var url = "";
                        switch (param.quality) {
                            case 2:
                                url = param.norVid;
                                break;
                            case 1:
                                url = param.highVid;
                                break;
                            case 21:
                                url = param.superVid;
                                break;
                            case 31:
                                url = param.oriVid;
                                break;
                            default:
                                url = param.highVid
                        }
                        callback({
                            "&#x9AD8;&#x6E05;": url.replace(/ipad\d+\_/, "ipad" + vid + "_").replace("http://", "http://proxy.c70.io:5204/") + "&uid=" + uid + "&ver=" + param.quality + "&prod=h5&pt=2&pg=1&ch=" + param.cid
                        })
                    })
                }

                function mp4(callback) {
                    _.jsonp("http://proxy.c70.io:5204/api.tv.sohu.com/v4/video/info/" + vid + ".json", {
                        site: 1,
                        api_key: "695fe827ffeb7d74260a813025970bd5",
                        sver: 1,
                        partner: 1
                    }, function(param) {
                        callback({
                            "&#x9AD8;&#x6E05;": param.data.url_high_mp4
                        })
                    })
                }
                _.canPlayM3U8 ? m3u8(callback) : mp4(callback)
            }, /sohu\.com/.test(window.location.host), "player"
        ]
    },
    E: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var page = window._page_;
                if (page.channel == "view") {
                    var vid = location.href.match(/v\_([0-9a-zA-Z]+)\.html/);
                    if (vid) {
                        vid = vid[1];
                        callback({
                            "&#x9AD8;&#x6E05;": "http://vxml.56.com/m3u8/" + vid + "/"
                        })
                    }
                } else {
                    _.jsonp("http://vxml.56.com/h5json/" + (window.oFlv.o.id || window._oFlv_c.id) + "/", {
                        r: "",
                        src: "m"
                    }, function(param) {
                        urlList = param.df;
                        var urls = {};
                        for (var i = 0; i < param.df.length; i++) {
                            urls[param.df[i]["type"]] = param.df[i]["url"]
                        }
                        callback(urls)
                    })
                }
            }, /56\.com/.test(window.location.host), "mod_player"
        ]
    },
    f: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                _.jsonp(_.service("bilibili"), {
                    aid: window.aid,
                    page: window.pageno
                }, function(src, commentInfo) {
                    callback({
                        bilibili: src
                    }, commentInfo)
                })
            }, /bilibili/.test(window.location.host), "bofqi"
        ]
    },
    F: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var urls = {};
                var mmsid = window.__INFO__.video.mmsid;
                var vid = window.__INFO__.video.vid;
                var auth = LTK.require("video.auth");
                var a = new auth;
                var tkey = a.getKey(Date.now() / 1e3 | 0);
                _.jsonp("http://proxy.c70.io:5204/api.letv.com/mms/out/common/geturl", {
                    platid: 3,
                    splatid: 301,
                    playid: 0,
                    vtype: "9,13,21",
                    version: "2.0",
                    tss: "ios",
                    mmsid: mmsid,
                    vid: vid,
                    tkey: tkey,
                    retry: 1
                }, function(rs) {
                    var i = 0;
                    _.each(rs.data[0]["infos"], function(item) {
                        var type = item.vtype;
                        switch (item.vtype) {
                            case "9":
                                type = "标清";
                                break;
                            case "13":
                                type = "高清";
                                break;
                            case "21":
                                type = "超清";
                                break
                        }
                        i++;~

                        function(type) {
                            _.jsonp(_.canPlayM3U8 ? item.mainUrl.replace("&tss=ios", "") : item.mainUrl, {
                                expect: 3,
                                format: 1,
                                termid: LTK.require("extend.detect").isLetv ? 4 : 2,
                                type: _.canPlayM3U8 ? undefined : "ad_m_gapqing_mp4"
                            }, function(rs) {
                                urls[type] = rs.location;
                                i--;
                                if (i == 0) urls && callback(urls)
                            }, "jsonp")
                        }(type)
                    })
                })
            }, /letv\.com/.test(window.location.host), "fla_box"
        ]
    },
    g: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var _id = window.iid || window.pageConfig && window.pageConfig.iid || window.itemData && window.itemData.iid;
                var youkuCode = window.itemData && window.itemData.vcode;
                var m3u8 = function(callback) {
                    var urls = {
                        "&#x6807;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=2",
                        "&#x9AD8;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=3",
                        "&#x8D85;&#x6E05;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=4",
                        "&#x539F;&#x753B;": "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=5"
                    };
                    var _s;
                    if (window.itemData && window.itemData.segs) {
                        urls = {};
                        _s = JSON.parse(window.itemData.segs);
                        if (_s[2]) urls["&#x6807;&#x6E05;"] = "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=2";
                        if (_s[3]) urls["&#x9AD8;&#x6E05;"] = "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=3";
                        if (_s[4]) urls["&#x8D85;&#x6E05;"] = "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=4";
                        if (_s[5]) urls["&#x539F;&#x753B;"] = "http://vr.tudou.com/v2proxy/v2.m3u8?it=" + _id + "&st=5"
                    }
                    return !youkuCode ? callback(urls) : callback({
                        "&#x6807;&#x6E05;": "http://v.youku.com/player/getM3U8/vid/" + youkuCode + "/type/flv/ts/" + (new Date).getTime().toString().substring(0, 10) + "/sc/2/useKeyframe/0/v.m3u8",
                        "&#x539F;&#x753B;": "http://v.youku.com/player/getM3U8/vid/" + youkuCode + "/type/hd2/ts/" + (new Date).getTime().toString().substring(0, 10) + "/sc/2/useKeyframe/0/v.m3u8"
                    })
                };
                var mp4 = function(callback) {
                    if (!youkuCode) {
                        _.jsonp("http://vr.tudou.com/v2proxy/v2.js", {
                            it: _id,
                            st: "52%2C53%2C54"
                        }, function(param) {
                            if (param.code == -1) return;
                            for (var urls = {}, i = 0, len = param.urls.length; i < len; i++) {
                                urls[i] = param.urls[i]
                            }
                            return callback(urls)
                        }, "jsonp")
                    } else {
                        _.jsonp("https://openapi.youku.com/v2/videos/files.json", {
                            client_id: "513edb6cf9833ca7&client_secret=eaf151ffdbf1383d934ab4cb91250fa6",
                            type: "play",
                            video_id: youkuCode,
                            _: +(new Date).getTime().toString()
                        }, function(param) {
                            return callback({
                                "&#x6807;&#x6E05;": param.files["3gphd"].segs[0].url
                            })
                        })
                    }
                };
                _.canPlayM3U8 ? m3u8(callback) : mp4(callback)
            }, /tudou\.com/.test(window.location.host), "playerObject"
        ]
    },
    G: function(module, exports, require, include) {
        var _ = require("A");
        module.exports = [
            function(callback) {
                var _id = window.videoId;
                var mk_a3 = "b4et";
                var mk_a4 = "boa4";
                var userCache_a1 = "4";
                var userCache_a2 = "1";
                var rs;
                var sid;
                var token;

                function na(a) {
                    if (!a) return "";
                    var a = a.toString(),
                        c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
                    i = a.length;
                    f = 0;
                    for (e = ""; f < i;) {
                        do c = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == c);
                        if (-1 == c) break;
                        do b = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == b);
                        if (-1 == b) break;
                        e += String.fromCharCode(c << 2 | (b & 48) >> 4);
                        do {
                            c = a.charCodeAt(f++) & 255;
                            if (61 == c) return e;
                            c = h[c]
                        } while (f < i && -1 == c);
                        if (-1 == c) break;
                        e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
                        do {
                            b = a.charCodeAt(f++) & 255;
                            if (61 == b) return e;
                            b = h[b]
                        } while (f < i && -1 == b);
                        if (-1 == b) break;
                        e += String.fromCharCode((c & 3) << 6 | b)
                    }
                    return e
                }

                function D(a) {
                    if (!a) return "";
                    var a = a.toString(),
                        c, b, f, e, g, h;
                    f = a.length;
                    b = 0;
                    for (c = ""; b < f;) {
                        e = a.charCodeAt(b++) & 255;
                        if (b == f) {
                            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
                            c += "==";
                            break
                        }
                        g = a.charCodeAt(b++);
                        if (b == f) {
                            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
                            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2);
                            c += "=";
                            break
                        }
                        h = a.charCodeAt(b++);
                        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
                        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
                        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
                        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
                    }
                    return c
                }

                function E(a, c) {
                    for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
                    for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
                    for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
                    return e
                }

                function F(a, c) {
                    for (var b = [], f = 0; f < a.length; f++) {
                        for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
                            if (c[e] == i) {
                                i = e;
                                break
                            }
                        b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
                    }
                    return b.join("")
                }

                function T(a, c) {
                    this._sid = sid;
                    this._seed = a.seed;
                    this._fileType = c;
                    var b = new U(this._seed);
                    this._streamFileIds = a.streamfileids;
                    this._videoSegsDic = {};
                    for (c in a.segs) {
                        for (var f = [], i = 0, g = 0; g < a.segs[c].length; g++) {
                            var h = a.segs[c][g],
                                q = {};
                            q.no = h.no;
                            q.size = h.size;
                            q.seconds = h.seconds;
                            h.k && (q.key = h.k);
                            q.fileId = this.getFileId(a.streamfileids, c, parseInt(g), b);
                            q.type = c;
                            q.src = this.getVideoSrc(h.no, a, c, q.fileId);
                            f[i++] = q
                        }
                        this._videoSegsDic[c] = f
                    }
                }

                function U(a) {
                    this._randomSeed = a;
                    this.cg_hun()
                }
                U.prototype = {
                    cg_hun: function() {
                        this._cgStr = "";
                        for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", c = a.length, b = 0; b < c; b++) {
                            var f = parseInt(this.ran() * a.length);
                            this._cgStr += a.charAt(f);
                            a = a.split(a.charAt(f)).join("")
                        }
                    },
                    cg_fun: function(a) {
                        for (var a = a.split("*"), c = "", b = 0; b < a.length - 1; b++) c += this._cgStr.charAt(a[b]);
                        return c
                    },
                    ran: function() {
                        this._randomSeed = (211 * this._randomSeed + 30031) % 65536;
                        return this._randomSeed / 65536
                    }
                };
                T.prototype = {
                    getFileId: function(a, c, b, f) {
                        for (var i in a)
                            if (i == c) {
                                streamFid = a[i];
                                break
                            }
                        if ("" == streamFid) return "";
                        c = f.cg_fun(streamFid);
                        a = c.slice(0, 8);
                        b = b.toString(16);
                        1 == b.length && (b = "0" + b);
                        b = b.toUpperCase();
                        c = c.slice(10, c.length);
                        return a + b + c
                    },
                    getVideoSrc: function(a, c, d, f, i, g) {
                        if (!c.videoid || !d) return "";
                        var h = {
                                flv: 0,
                                flvhd: 0,
                                mp4: 1,
                                hd2: 2,
                                "3gphd": 1,
                                "3gp": 0
                            }[d],
                            q = {
                                flv: "flv",
                                mp4: "mp4",
                                hd2: "flv",
                                "3gphd": "mp4",
                                "3gp": "flv"
                            }[d],
                            k = a.toString(16);
                        1 == k.length && (k = "0" + k);
                        var l = c.segs[d][a].seconds,
                            a = c.segs[d][a].k;
                        if ("" == a || -1 == a) a = c.key2 + c.key1;
                        d = "";
                        c.show && (d = c.show.show_paid ? "&ypremium=1" : "&ymovie=1");
                        c = "/player/getFlvPath/sid/" + sid + "_" + k + "/st/" + q + "/fileid/" + f + "?K=" + a + "&hd=" + h + "&myp=0&ts=" + l + "&ypp=0" + d;
                        f = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + f + "_" + token)));
                        c = c + ("&ep=" + f) + "&ctype=12&ev=1" + ("&token=" + token);
                        c += "&oip=" + rs.data[0].ip;
                        return "http://k.youku.com" + (c + ((i ? "/password/" + i : "") + (g ? g : "")))
                    }
                };
                _.jsonp("http://v.youku.com/player/getPlaylist/VideoIDS/" + _id + "/Pf/4/ctype/12/ev/1", {}, function(param) {
                    rs = param;
                    var a = param.data[0],
                        c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), na(a.ep));
                    c = c.split("_");
                    sid = c[0];
                    token = c[1];
                    if (!/PlayStation/.test(window.navigator.userAgent) && _.canPlayM3U8) {
                        var ep = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
                        var oip = a.ip;
                        callback({
                            "&#x6807;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
                            "&#x9AD8;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=mp4&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
                            "&#x8D85;&#x6E05;": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=hd2&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
                        })
                    } else {
                        var t = new T(a);
                        callback({
                            "&#x6807;&#x6E05;": t._videoSegsDic["3gphd"][0].src
                        })
                    }
                }, "__callback")
            }, /youku\.com/.test(window.location.host), "movie_player"
        ]
    }
});