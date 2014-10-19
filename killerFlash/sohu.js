addKiller("sohu", {

  "canKill": function(data) {
    return /sohu\.com/.test(data.src);
  },

  A : function(module, exports, require, include) {
    var _ = {};
    //_.environment = "production";
    //_.canPlayM3U8 = !!document.createElement("video").canPlayType("application/x-mpegURL") ? true : false;
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
    /*
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
    */
    _.log = function(text) {
      window.console || window.console(text);
      document.body.appendChild(_logNode).innerHTML = text
    };
    _.rlog = function() {
      _.rNode(_logNode)
    };
    module.exports = _
  },


  "process": function(data, callback) {

    var flashvars = parseFlashVariables(data.params.flashvars);
    var vid = flashvars.vid;
    var uid = "1406271109096937";
    //SUV 1406271109096937  .sohu.com / January 18, 2038 at 17:00:00  MST 19 B    
    //var url = "http://tyw:x12345x@hot.proxy.c70.us:5204/ipad" + vid + ".m3u8";
    var final_url;


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

    function m3u8() {
      var _ = require("A");
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

        final_url = url.replace(/ipad\d+\_/, "ipad" + vid + "_").replace("http://", "http://proxy.c70.io:5204/") + "&uid=" + uid + "&ver=" + param.quality + "&prod=h5&pt=2&pg=1&ch=" + param.cid
        return final_url;
      })
    }

    final_url = m3u8();
    safari.extension.globalPage.contentWindow.console.log(flashvars);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", data.location);
    xhr.addEventListener("load", function() {

      callback({
        "playlist": [{
          "poster": undefined,
          "sources": [{
            "url": decodeURIComponent(final_url),
            "isNative": true
          }]
        }]
      });
    }, false);
    xhr.send();
  }
});