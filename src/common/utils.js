
const Utils = {
    getLangTag: function (vue, type) {
        // console.log('utils: vue: ', vue);
        let langTag;
        if (vue) {
            langTag = vue.$store.state.changeLanguage.language || vue.$utils.cookies.getItem('Language');
        }
        if (!langTag) {
            langTag = Utils.cookies.getItem('Language');
        }
        if (type) {
            langTag = type;
        }
        let langName = 'zhName';
        switch (langTag) {
            case 'zh-CN':
                langName = 'chName';
                break;
            case 'en-US':
                langName = 'enName';
                break;
            case 'zh-HK':
            default:  // 默认繁体
                langName = 'zhName';
                break;
        }
        return langName;
    },

    getTypeList: function (list, vue) {
        // 获取下拉选项的选项列表
        // list: ../language/checkList.js 中的选项列表； vue: vue 实例
        let rel = [], langName = Utils.getLangTag(vue);  // 这里的 Utils 不能用 this 代替
        list.forEach(val => {
            rel.push(val[langName]);
        });
        return rel;
    },
    getTypeCode: function (list, vue, type) {
        // 获取下拉选项的选项 code
        // list: ../language/checkList.js 中的选项列表； vue: vue 实例；type: 选中的类型
        let rel = '', langName = Utils.getLangTag(vue);
        for (let val of list) {
            // console.log('选择： ', type, val, val[lang]);
            if (type == val[langName]) {
                rel = val.code;
                break;
            }
        }
        return rel;
    },
    getTypeName: function (list, vue, code, type) {
        // 获取下拉选项的选项对应名称
        // list: ../language/checkList.js 中的选项列表； vue: vue 实例；code: 选中的 code
        let rel = '', langName = Utils.getLangTag(vue, type);
        for (let val of list) {
            // console.log('选择： ', code, val.code, val);
            if (val.code == code) {
                rel = val[langName];
                break;
            }
        }
        return rel;
    },
    importEnStyle: function (file) {
        if (this.cookies.getItem('Language') == 'en-US') {
            let head = document.getElementsByTagName('HEAD').item(0),
                style = document.createElement('style'),
                url = document.createTextNode('@import url("' + file + '")');
            style.type = 'text/css';
            style.appendChild(url);
            head.appendChild(style);
        }
    },
    removeEnStyle: function (file) {
        let head = document.getElementsByTagName('head')[0];
        let list = head.children;
        let target = list[list.length - 1];
        let html = target.outerHTML;
        // console.log(list);
        // console.log(target);
        // console.log(html);
        if (html.indexOf(file) > -1) {
            target.remove();
        }
    },
    cookies: {
        getItem: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            // 
            // if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            //     return false;
            // }
            // var sExpires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            // if (vEnd) {
            //     switch (vEnd.constructor) {
            //         case Number:
            //             sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            //             break;
            //         case String:
            //             sExpires = "; expires=" + vEnd;
            //             break;
            //         case Date:
            //             sExpires = "; expires=" + vEnd.toUTCString();
            //             break;
            //     }
            // }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue);
            // document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        // removeItem: function (sKey, sPath, sDomain) {
        //     if (!sKey || !this.hasItem(sKey)) {
        //         return false;
        //     }
        //     document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        //     return true;
        // },
        // hasItem: function (sKey) {
        //     return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        // },
        keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    },

    /**
     * [getUrlParam 获取url参数]
     * @param  {[type]} sName [：参数名]
     * @return {[type]}       [返回参数值（没有的时候返回空）]
     */
    getUrlParam: function (sName) {
    		let params = window.location.hash.split('?')[1];
        let reg = new RegExp("(^|&)" + sName + "=([^&]*)(&|$)", "i");
        let r = params&&params.match(reg);
        if (r != null)
            return decodeURIComponent(r[2]); // (r[2]);
        return "";
    },
    getQueryObject: function (url) {
      url = url == null ? window.location.href : url
      let search = url.substring(url.lastIndexOf('?') + 1)
      if (search.lastIndexOf('#') > -1) {
        search = search.substring(0, search.lastIndexOf('#'))
      }
      const obj = {}
      const reg = /([^?&=]+)=([^?&=]*)/g
      search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = $2
        val = String(val)
        obj[name] = val
        return rs
      })
      return obj
    },
    /**
     * [extends 合并对象]
     * @param  {[object]} target [对象]
     * @return {[object]}        [合并后对象]
     */
    extends: function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },

    /**
     * 日期转换字符串函数   Farris 2016-11-16
     * @param date  date对象(必传)
     * @param dateType   "date"(年月日) "time"(时分秒) "dateTime"(年月日时分秒)  (非必传缺省值为date)
     * @param divide  分隔线(默认以"-"分隔) (非必传)
     * @returns {*}
     */
    dateToStr: function (date, dateType, divide) {
        if (Object.prototype.toString.call(date) !== "[object Date]") {
            return date;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let second = date.getSeconds();
        let temp = null;
        switch (dateType) {
            case undefined:
            		return;
            		break;
            case "date":
                temp = [year, month, day];
                return temp && temp.map(v => v.toString()[1] ? v : "0" + v).join(divide || "-");
                break;
            case "time":
                temp = [hour, min, second];
                return temp && temp.map(v => v.toString()[1] ? v : "0" + v).join(divide || ":");
                break;
            case "min":
                temp = [hour, min];
                return temp && temp.map(v => v.toString()[1] ? v : "0" + v).join(divide || ":");
                break;
            case "dateTime":
                temp = [year, month, day, hour, min, second];
                break;
            default: ;
                break;
        }
        let dateStr = '', timeStr = '';
        if (temp) {
        	temp.map((item, index) => {
        		if (index <= 2) {
        			dateStr += (item.toString()[1] ? item : "0" + item) + '-';
        		} else {
        			timeStr += (item.toString()[1] ? item : "0" + item) + ':';
        		}
        	})
        	return dateStr.substring(0, dateStr.length-1) + ' ' + timeStr.substring(0, timeStr.length-1);
        }
    },
    /**
     * [trim 删除空格]
     * @param {[string]} str [需要处理的字符串]
     * @return {[string]} [description]
     */
    trim: function (str) {
        return str && str.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1');
    },
    /**
     * [getStrProper 返回传入对象的可枚举属性的克隆对象]
     * @param {[string]} obj [需要处理的对象]
     * @return {[string]} [description]
     */
    getStrProper: function (obj) {
        let res = {};
        Object.keys(obj).forEach(val => {
            // console.log('key: ', val, obj[val]);
            res[val] = obj[val];
        });
        // console.log('res: ', res);
        return res;
    }

};
export default Utils;