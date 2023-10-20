// Copyright Jason Savard
"use strict";

if (/firefox/i.test(navigator.userAgent)) {
    globalThis.chrome = globalThis.browser;
    globalThis.chrome.action = globalThis.browser.browserAction;
    globalThis.chrome.contextMenus = globalThis.browser.menus;
    globalThis.ACTION_CONTEXT = "browser_action";
} else {
    globalThis.ACTION_CONTEXT = "action";
}

// optional callback
function docReady(fn) {
    return new Promise((resolve, reject) => {
        fn ||= resolve;
        if (document.readyState === "interactive" || document.readyState === "complete") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                fn();
            });
        }
    });
}

const htmlElement = globalThis.document?.documentElement;

function createBR() {
    return document.createElement("br");
}

function emptyNode(target) {
    parseTarget(target, el => {
        while(el.firstChild) el.removeChild(el.firstChild);
    });
}

function emptyAppend(target, ...node) {
    emptyNode(target);
    parseTarget(target, el => {
        el.append(...node);
    });
}

function byId(id) {
    return document.getElementById(id);
}

function css(target, styles) {
    parseTarget(target, element => {
        Object.assign(element.style, styles);
    });
}

function selector(selector) {
    return document.querySelector(selector);
}

function selectorAll(targets) {
    if (typeof targets === "string") {
        targets = document.querySelectorAll(targets);
    }

    if (!targets.forEach) {
        targets = [targets];
    }

    return targets;
}

function getTargetArray(target) {
    if (typeof target === "string") {
        target = document.querySelectorAll(target);
    }

    if (!target.forEach) {
        target = [target];
    }

    return target;
}

function parseTarget(target, handleElement) {
    if (!target) {
        return [];
    }

    target = selectorAll(target);

    target.forEach(e => {
        handleElement(e);
    });
}

function getDefaultDisplay( elem ) {
    globalThis.defaultDisplayMap ||= {};

	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
        display = globalThis.defaultDisplayMap[ nodeName ];

    if ( display ) {
        return display;
    }
    
    // hard code some known ones because if polymer code loads only after this then we will always get the default display ie. inline whereas it polymer could set it to inline-display for paper- elements
    if (nodeName == "PAPER-ICON-BUTTON") {
        display = "inline-block";
    } else {    
	    temp = doc.body.appendChild( doc.createElement( nodeName ) );
	    display = getComputedStyle(temp).display;
	    temp.parentNode.removeChild( temp );
    }

	if ( display === "none" ) {
		display = "block";
	}

    globalThis.defaultDisplayMap[ nodeName ] = display;
    
	return display;
}

function isHiddenWithTree(el) {
    return el.style.display === "none" ||
		el.style.display === "" &&
		getComputedStyle(el).display === "none";
}

function show(target) {
    parseTarget(target, element => {
        if (element.hidden) {
            element.hidden = false;
        }

        if (element.style.display == "none") {
            element.style.display = "";
        }
        if (element.style.display === "" && isHiddenWithTree(element)) {
            element.style.display = getDefaultDisplay(element);
        }
    });
}

function hide(target) {
    parseTarget(target, element => {
        element.hidden = true;

        if (getComputedStyle(element).display !== "none") {
            element.style.display = "none";
        }
    });
}

const getNodeIndex = elm => [...elm.parentNode.children].indexOf(elm);

/* SLIDE UP */
var slideUp = (targets, duration=500) => {
    if (duration == "fast") {
        duration = 200;
    } else if (duration == "slow") {
        duration = 600;
    }

    return new Promise((resolve, reject) => {
        parseTarget(targets, target => {
            target.style.transitionProperty = 'height, margin, padding, opacity';
            target.style.transitionDuration = duration + 'ms';

            const prevBoxsizing = target.style.boxSizing;
            target.style.boxSizing = 'border-box';

            target.style.height = target.offsetHeight + 'px';

            target.offsetHeight;

            const prevOverflow = target.style.overflow;
            target.style.overflow = 'hidden';

            target.style.height = 0;

            const previousPT = target.style.paddingTop;
            target.style.paddingTop = 0;

            const previousPB = target.style.paddingBottom;
            target.style.paddingBottom = 0;

            const previousMT = target.style.marginTop
            target.style.marginTop = 0;

            const previousMB = target.style.marginBottom;
            target.style.marginBottom = 0;

            window.setTimeout( () => {
                target.style.display = 'none';
                target.style.removeProperty('height');

                target.style.boxSizing = prevBoxsizing;
                target.style.overflow = prevOverflow;

                target.style.paddingTop = previousPT;
                target.style.paddingBottom = previousPB;
                target.style.marginTop = previousMT;
                target.style.marginBottom = previousMB;

                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
            }, duration);
        });

        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/* SLIDE DOWN */
var slideDown = (targets, duration=500) => {
    if (duration == "fast") {
        duration = 200;
    } else if (duration == "slow") {
        duration = 600;
    }

    return new Promise((resolve, reject) => {
        parseTarget(targets, target => {
            const currentHeight = target.clientHeight;
            target.style.removeProperty('display');
            target.hidden = false;
            let display = window.getComputedStyle(target).display;
            if (display === 'none') display = 'block';
            target.style.display = display;

            if (!currentHeight) {

                const prevOverflow = target.style.overflow;
                target.style.overflow = 'hidden';

                target.style.height = "auto"
                let height = target.clientHeight + "px";
                target.style.height = 0;

                //target.style.paddingTop = 0;
                //target.style.paddingBottom = 0;
                //target.style.marginTop = 0;
                //target.style.marginBottom = 0;

                target.offsetHeight;

                const prevBoxsizing = target.style.boxSizing;
                target.style.boxSizing = 'border-box';

                target.style.transitionProperty = "height";
                target.style.transitionDuration = duration + 'ms';
            
                /** Do this after the 0px has applied. */
                /** It's like a delay or something. MAGIC! */
                setTimeout(() => {
                    target.style.height = height
                }, 0) 
            
                //target.style.removeProperty('padding-top');
                //target.style.removeProperty('padding-bottom');
                //target.style.removeProperty('margin-top');
                //target.style.removeProperty('margin-bottom');
                window.setTimeout( () => {
                    target.style.removeProperty('height');

                    target.style.overflow = prevOverflow;
                    target.style.boxSizing = prevBoxsizing;

                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                }, duration);
            }
        });

        setTimeout(() => {
            resolve();
        }, duration);
    });
}

var slideToggle = (targets, duration = 500) => {
    if (duration == "fast") {
        duration = 200;
    } else if (duration == "slow") {
        duration = 600;
    }

    return new Promise((resolve, reject) => {
        parseTarget(targets, target => {
            if (window.getComputedStyle(target).display === 'none') {
                return slideDown(target, duration);
            } else {
                return slideUp(target, duration);
            }
        });

        setTimeout(() => {
            resolve();
        }, duration);
    });
}

var fadeIn = (targets, duration=500) => {
    if (duration == "fast") {
        duration = 200;
    } else if (duration == "slow") {
        duration = 600;
    }

    return new Promise((resolve, reject) => {
        parseTarget(targets, target => {
            if (!isVisible(target) || window.getComputedStyle(target).opacity == "0") {
                target.style.opacity = "0";
                show(target);

                target.style.transitionProperty += ",opacity";
                target.style.transitionDuration = duration + 'ms';

                /** Do this after the 0px has applied. */
                /** It's like a delay or something. MAGIC! */
                setTimeout(() => {
                    target.style.opacity = "1";
                }, 0) 
            
                window.setTimeout( () => {
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                }, duration);
            }
        });

        setTimeout(() => {
            resolve();
        }, duration);
    });
}

var fadeOut = (targets, duration=500) => {
    if (duration == "fast") {
        duration = 200;
    } else if (duration == "slow") {
        duration = 600;
    }

    return new Promise((resolve, reject) => {
        parseTarget(targets, target => {
            if (isVisible(target) || window.getComputedStyle(target).opacity == "1") {
                target.style.transitionProperty = "opacity";
                target.style.transitionDuration = duration + 'ms';

                /** Do this after the 0px has applied. */
                /** It's like a delay or something. MAGIC! */
                setTimeout(() => {
                    target.style.opacity = "0";
                }, 0);

                setTimeout(() => {
                    hide(target);
                }, duration);
            
                window.setTimeout( () => {
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                }, duration);
            }
        });

        setTimeout(() => {
            resolve();
        }, duration);
    });
}

function isVisible(target) {
    if (typeof target === "string") {
        target = document.querySelector(target);
    }

    //return (target.offsetParent !== null) // didn't work for fixed elements like dialog boxes
    return !!( target.offsetWidth || target.offsetHeight || target.getClientRects().length );
}

function importTemplateNode(target, allFlag) {
    let nodes;
    parseTarget(target, el => {
        if (nodes) {
            return;
        } else {
            const fragment = document.importNode(el.content, true);
            if (allFlag) {
                nodes = Array.from(fragment.children);
            } else {
                nodes = fragment.firstElementChild;
            }
        }
    })
    return nodes;
}

function addEventListeners(target, type, fn, namespace, listenerOptions) {
    parseTarget(target, el => {
       	let thisListenerOptions = false;
        if (namespace) {
        	const abortControllerFnName = `_myAbortController_${namespace}_${type}`;
        	if (el[abortControllerFnName]) {
          	    console.log("abort")
          	    el[abortControllerFnName].abort();
            }
            el[abortControllerFnName] = new AbortController();
          
            if (listenerOptions === true) {
                thisListenerOptions = {
                	capture: true,
                    signal: el[abortControllerFnName].signal
                }
            } else if (typeof listenerOptions === 'object') {
                thisListenerOptions = Object.assign({}, listenerOptions);
                thisListenerOptions.signal = el[abortControllerFnName].signal;
            } else {
              	thisListenerOptions = {
                	signal: el[abortControllerFnName].signal
                }
            }
        } else if (listenerOptions) {
            thisListenerOptions = listenerOptions;
        }
        el.addEventListener(type, fn, thisListenerOptions);
    });
};

function replaceEventListeners(target, type, fn, namespace = "default", listenerOptions) {
	addEventListeners(target, type, fn, namespace, listenerOptions);
}

function onClick(target, fn, namespace, listenerOptions = false) {
    addEventListeners(target, "click", fn, namespace, listenerOptions);
}

function onClickReplace(target, fn, namespace = "default", listenerOptions = false) {
    onClick(target, fn, namespace, listenerOptions);
}

class DetectClientClass {

    constructor() {
        this.platform = "Windows"; // patch had to declaire it here instead of above to pass firefox extension compilation warning
    }

    async init() {
        if (navigator.userAgentData) {
            this.platform = (await navigator.userAgentData.getHighEntropyValues(["platform"])).platform;
        }
    }
  
    findBrand(brandString) {
        return navigator.userAgentData?.brands.some(brands => brands.brand == brandString);
    }
    
    isChrome() {
        return this.findBrand("Google Chrome");
    }

    isChromium () {
        return this.findBrand("Chromium")
             && !this.isFirefox()
             && !this.isSafari()
        ;
    }

    isEdge() {
        return this.findBrand("Microsoft Edge");
    }

    isOpera() {
        return this.findBrand("Opera");
    }

    isFirefox() {
        return /firefox/i.test(navigator.userAgent);
    }

    isSafari() {
        return /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    }

    isWindows() {
        if (navigator.userAgentData) {
            return this.platform == "Windows";
        } else {
            return /windows/i.test(navigator.userAgent);
        }
    }

    isAndroid() {
        if (navigator.userAgentData) {
            return this.platform == "Android";
        } else {
            return /android/i.test(navigator.userAgent);
        }
    }

    isMac() {
        if (navigator.userAgentData) {
            return this.platform == "macOS";
        } else {
            return /mac/i.test(navigator.userAgent);
        }
    }

    is_iPhone() {
        if (navigator.userAgentData) {
            return this.platform == "iOS";
        } else {
            return /iPhone/i.test(navigator.userAgent);
        }
    }

    isLinux() {
        if (navigator.userAgentData) {
            return this.platform == "Linux";
        } else {
            return /linux/i.test(navigator.userAgent);
        }
    }

    isChromeOS() {
        return this.platform == "Chrome OS" || this.platform == "ChromeOS";
    }

    async getChromeChannel() {
        
        if (this.isChrome() || this.isChromeOS()) {
            let platform;

            if (this.isWindows()) {
                platform = "win";
            } else if (this.isMac()) {
                platform = "mac";
            } else if (this.isLinux()) {
                platform = "linux";
            } else if (this.isChromeOS()) {
                platform = "chromeos";
            } else if (this.isAndroid()) {
                platform = "android";
            } else {
                platform = "all";
            }

            const fullVersionList = (await navigator.userAgentData.getHighEntropyValues(["fullVersionList"])).fullVersionList;
            let matchedBrand = fullVersionList.find(list => list.brand == "Google Chrome");
            if (!matchedBrand) {
                matchedBrand = fullVersionList.find(list => list.brand == "Chromium");
                if (!matchedBrand) {
                    matchedBrand = fullVersionList.find(list => !list.brand.match(/brand/i));
                }
            }

            let browserVersion = matchedBrand?.version;
            if (!browserVersion) {
                throw Error("Could not extract browser version", fullVersionList);
            }
            //browserVersion = "99.0.4844.74";

            const data = await fetchJSON(`https://versionhistory.googleapis.com/v1/chrome/platforms/${platform}/channels/all/versions/all/releases?filter=version=${browserVersion}`);
            const release = data.releases[0];
            const channel = release.name.split("/")[4];
            const startTime = new Date(release.serving.startTime);
            if (release.serving.endTime) {
                //console.log("et", new Date(release.serving.endTime));
            }

            const OLD_VERSION_THRESHOLD_IN_DAYS = 90;

            return {
                channel: channel,
                oldVersion: Math.abs(startTime.diffInDays()) > OLD_VERSION_THRESHOLD_IN_DAYS
            };
        } else {
            throw Error("Not Chrome");
        }
    }

    getFirefoxDetails() {
        return fetchJSON("https://jasonsavard.com/getBrowserDetails");
    }
}

const DetectClient = new DetectClientClass();

function customShowError(error) {
    if (globalThis.document) {
        docReady(() => {
            show(document.body);
            document.body.style.opacity = "1";

            const div = document.createElement("div");
            div.style.cssText = "background:red;color:white;padding:5px;z-index:999";
            div.textContent = error;

            document.body.prepend(div);
        });
    } else {
        showCouldNotCompleteActionNotification(error);
    }
}

function displayUncaughtError(errorStr) {
	if (globalThis.polymerPromise2?.then) {
		polymerPromise2.then(() => {
			if (globalThis.showError) {
                // must catch errors here to prevent onerror loop
                showError(errorStr).catch(e => {
                    console.error(e);
                    customShowError(errorStr);
                });
			} else {
				customShowError(errorStr);
			}
		}).catch(error => {
			customShowError(errorStr);
		});
	} else {
		customShowError(errorStr);
	}
}

globalThis.onerror = function(msg, url, line) {
	var thisUrl = removeOrigin(url).substring(1); // also remove beginning slash '/'
	var thisLine;
	if (line) {
		thisLine = " (" + line + ") ";
	} else {
		thisLine = " ";
	}
	
	var category = "JS Errors"; 
	var GAError = thisUrl + thisLine + msg;
	var label = navigator.appVersion;
	
	sendGA(category, GAError, label);
	
	var errorStr = msg + " (" + thisUrl + " " + line + ")";

    // patch for this weird error
	if (msg && msg.indexOf && msg.includes("ResizeObserver loop limit exceed")) {
		return true;
	}

    displayUncaughtError(errorStr);
	
	//return false; // false prevents default error handling.
};

globalThis.addEventListener('unhandledrejection', function (event) {
    const error = event.reason.stack ? event.reason.stack : event.reason;
    console.error("unhandledrejection", error);

    if (error.toString().includes("port closed") || error.toString().includes("channel closed before a response was received")) {
        // ignore
    } else {
        displayUncaughtError(error);
    }
  
    // Prevent the default handling (error in console)
    //event.preventDefault();
});

//usage: [url] (optional, will use location.href by default)
function removeOrigin(url) {
	var linkObject;
	if (arguments.length && url) {
		try {
			linkObject = document.createElement('a');
			linkObject.href = url;
		} catch (e) {
			console.error("jerror: could not create link object: " + e);
		}
	} else {
		linkObject = location;
	}
	
	if (linkObject) {
		return linkObject.pathname + linkObject.search + linkObject.hash;
	} else {
		return url;
	}
}

function logError(msg, o) {
	try {
		var onErrorMessage;
		if (o) {
			console.error(msg, o);
			onErrorMessage = msg + " " + o;
		} else {
			console.error(msg);
			onErrorMessage = msg;
		}
		globalThis.onerror(onErrorMessage, location.href);
	} catch (e) {
		console.error("error in onerror?", e);
	}
}

function getInternalPageProtocol() {
	var protocol;
	if (DetectClient.isFirefox()) {
		protocol = "moz-extension:";
	} else {
		protocol = "chrome-extension:";
	}
	return protocol;
}

function isInternalPage(url) {
	if (arguments.length == 0) {
		url = location.href;
	}
	return url && url.indexOf(getInternalPageProtocol()) == 0;
}

function openContributeDialog(key) {
    const content = new DocumentFragment();
    content.append(getMessage("extraFeaturesPopup1"), createBR(), getMessage("extraFeaturesPopup2"));
    
	openGenericDialog({
		title: getMessage("extraFeatures"),
		content: content,
		otherLabel: getMessage("contribute")
	}).then(function (response) {
		if (response == "other") {
			openUrl("contribute.html?action=" + key);
		}
	});
}

async function setStorage(element, params) {
	var OFF_OR_DEFAULT = DEFAULT_SETTINGS_ALLOWED_OFF.includes(params.key) && (!params.value || STORAGE_DEFAULTS[params.key] == params.value);
	
	if ((element.closest("[mustDonate]") || params.mustDonate) && !donationClickedFlagForPreventDefaults && !OFF_OR_DEFAULT) {
		params.event.preventDefault();
		openContributeDialog(params.key);
		return Promise.reject(JError.DID_NOT_CONTRIBUTE);
	} else {
		return storage.set(params.key, params.value);
	}
}

function ChromeStorage(params = {}) {
	var that = this;
	
	var storageArea;
	if (params.storageArea == "sync" && chrome.storage.sync) {
		storageArea = chrome.storage.sync;
	} else {
		storageArea = chrome.storage.local;
	}

	this.get = async function(key, raw = null) {
        const items = await storageArea.get(key);

        let value;

        if (raw) {
            value = items[key];
        } else {
            if (items[key] === undefined) {
                value = STORAGE_DEFAULTS[key];
            } else {
                value = items[key];
            }
        }

        if (value !== undefined) {
            // decouples reference to any default or cached items
            value = JSON.parse(JSON.stringify(value), dateReviver);
        }

        return value;
    }

    this.getRaw = function(key) {
        return that.get(key, true);
    }

    this.getEncodedUint8Array = async function(key) {
        const value = await that.getRaw(key);

        if (typeof value !== "undefined") {
            const ary = value.split(',');
            return Uint8Array.from(ary);
        }
    }

    this.getEncodedArrayBuffer = async function(key) {
        const uint8array = await that.getEncodedUint8Array(key);
        return uint8array?.buffer;
    }
	
	this.set = async function(key, value) {
        if (value === undefined) {
            const error = "value not set for key: " + key;
            console.error(error);
            throw error;
        }
        
        var storageValue;

        // clone any objects/dates etc. or else we could modify the object outside and the cache will also be changed
        if (value instanceof Date) {
            storageValue = value.toJSON(); // must stringify this one because chrome.storage does not serialize
        } else if (value instanceof Uint8Array) {
            storageValue = value.toString();
        } else if (value instanceof ArrayBuffer) {
            const uint8array = new Int8Array(value);
            storageValue = uint8array.toString();
        } else if (isObject(value)) {
            storageValue = JSON.parse(JSON.stringify(value));
        } else {
            storageValue = value;
        }
        
        const item = {};
        item[key] = storageValue;
        await storageArea.set(item);
	}
    
    this.setEncryptedObj = async function (key, value, replacer = null) {
        const encryptedObj = await Encryption.encryptObj(value, replacer);
        return that.set(key, encryptedObj);
    };

    this.getEncryptedObj = async function(key, reviver = null) {
        const value = await that.getEncodedArrayBuffer(key);
        try {
            return await Encryption.decryptObj(value, reviver);
        } catch (error) {
            console.log("Use default value probably not enc or first time: ", error);
            return STORAGE_DEFAULTS[key];
        }
    }
    
	this.enable = function(key) {
		return that.set(key, true);
	}

	this.disable = function(key) {
		return that.set(key, false);
	}
	
	this.setDate = function(key) {
		return that.set(key, new Date());
	}
	
	this.toggle = async function(key) {
    	if (await that.get(key)) {
    		return that.remove(key);
    	} else {
    		return that.set(key, true);
    	}
	}
	
	this.remove = async function(key) {
        await storageArea.remove(key);
	}
	
	this.clear = async function() {
        await storageArea.clear();
	}
	
	this.firstTime = async function(key) {
		if (await that.get("_" + key)) {
			return false;
		} else {
			await that.set("_" + key, new Date());
			return true;
		}
	}
}

var storage = new ChromeStorage();

var ONE_SECOND = 1000;
var ONE_MINUTE = 60000;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;

function seconds(seconds) {
	return seconds * ONE_SECOND;
}

function minutes(minutes) {
	return minutes * ONE_MINUTE;
}

function hours(hours) {
	return hours * ONE_HOUR;
}

function shallowClone(obj) {
    return Object.assign({}, obj);
}

async function _readMessagesFile(lang, region) {
    var folderName;
    if (region) {
        folderName = lang + "_" + region.toUpperCase();
    } else {
        folderName = lang;
    }
    
    return fetchJSON(chrome.runtime.getURL("_locales/" + folderName + "/messages.json"));
}

async function _loadLocaleMessagesFile() {
    const localeFormatted = locale.replace("-", "_");
    const lang = localeFormatted.split("_")[0].toLowerCase();
    const region = localeFormatted.split("_")[1];
    
    try {
        globalThis.localeMessages = await _readMessagesFile(lang, region);
    } catch (error) {
        console.warn("readMessagesFile", error);
        // if we had region then try lang only
        if (region) {
            console.log("Couldn't find region: " + region + " so try lang only: " + lang);
            try {
                globalThis.localeMessages = await _readMessagesFile(lang);
            } catch (error) {
                // always resolve
                console.warn(error);
            }
        } else {
            console.warn("Lang not found: " + lang);
        }
    }
}

async function loadLocaleMessages() {
    // only load locales from files if they are not using their browser language (because i18n.getMessage uses the browser language) 
    if (chrome.i18n.getUILanguage && (locale == chrome.i18n.getUILanguage() || locale == chrome.i18n.getUILanguage().substring(0, 2))) {
        // for english just use native calls to get i18n messages
        globalThis.localeMessages = null;
    } else {
        //console.log("loading locale: " + locale);
        // i haven't created a en-US so let's avoid the error in the console and just push the callback
        if (locale != "en-US") {
            await _loadLocaleMessagesFile();
        }
    }

    // service worker can't use getMessage so if nothing matched must load en file
    if (!globalThis.localeMessages && !chrome.i18n.getMessage) {
        localeMessages = await _readMessagesFile("en");
        console.log("localmessage", localeMessages);
    }
}

function getMessage(messageID, args, thisLocaleMessages) {
    // if localeMessage null because english is being used and we haven't loaded the localeMessage
    if (thisLocaleMessages) {
        localeMessages = thisLocaleMessages;
    }

	if (!globalThis.localeMessages) {
		try {
			localeMessages = chrome.extension.getBackgroundPage().localeMessages;
		} catch (e) {
			// might be in content_script and localMessages not defined because it's in english
			return chrome.i18n.getMessage(messageID, args);
		}				
	}
	if (localeMessages) {
		var messageObj = localeMessages[messageID];	
		if (messageObj) { // found in this language
			var str = messageObj.message;
			
			// patch: replace escaped $$ to just $ (because chrome.i18n.getMessage did it automatically)
			if (str) {
				str = str.replace(/\$\$/g, "$");
			}

			if (args != null) {
				if (args instanceof Array) {
					for (var a=0; a<args.length; a++) {
						str = str.replace("$" + (a+1), args[a]);
					}
				} else {
					str = str.replace("$1", args);
				}
			}
			return str;
		} else { // default to default language
			return chrome.i18n.getMessage(messageID, args);
		}
	} else {
		return chrome.i18n.getMessage(messageID, args);
	}
}

function analytics() {
	if (DetectClient.isChrome()) {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = '/js/analytics.js';
		// changed append logic a bit because we are in an html import context now
		var s = document.getElementsByTagName('head')[0]; s.appendChild(ga, s);
		
		docReady(() => {
			addEventListeners("a, input, button", "click", function(event) {
                const el = event.target;
				var id = el.getAttribute("ga");
				var label = null;
				if (id != "IGNORE") {
					if (!id) {
						id = el.getAttribute("id");
					}
					if (!id) {
						id = el.getAttribute("snoozeInMinutes");
						if (id) {
							label = "in minutes: " + id; 
							id = "snooze";
						}
						if (!id) {
							id = el.getAttribute("snoozeInDays");
							if (id) {
								label = "in days: " + id; 
								id = "snooze";
							}
						}
						if (!id) {
							id = el.getAttribute("msg");
						}
						if (!id) {
							id = el.getAttribute("msgTitle");
						}
						if (!id) {
							id = el.getAttribute("href");
							// don't log # so dismiss it
							if (id == "#") {
								id = null;
							}
						}
						if (id) {
							id = id.replace(/javascript\:/, "");
							// only semicolon so remove it and keep finding other ids
							if (id == ";") {
								id = "";
							}
						}
						if (!id) {
							id = el.parentElement.getAttribute("id");
						}		
					}
					if (el.getAttribute("type") != "text") {
						if (el.getAttribute("type") == "checkbox") {
							if (this.checked) {
								label = id + "_on";
							} else {
								label = id + "_off";
							}
						}
						var category = el.closest("*[gaCategory]");
						var action = null;
						// if gaCategory specified
						if (category) {
							category = category.getAttribute("gaCategory");
							action = id;
						} else {
							category = id;
							action = "click";
						}
						
						if (label != null) {
							sendGA(category, action, label);
						} else {
							sendGA(category, action);
						}
					}
				}
			});
		});		
	}
}

//usage: sendGA('category', 'action', 'label');
//usage: sendGA('category', 'action', 'label', value);  // value is a number.
//usage: sendGA('category', 'action', {'nonInteraction': 1});
function sendGA(category, action, label, etc) {
	console.log("%csendGA: " + category + " " + action + " " + label, "font-size:0.6em");

	// patch: seems arguments isn't really an array so let's create one from it
	var argumentsArray = [].splice.call(arguments, 0);

	var gaArgs = ['send', 'event'];
	// append other arguments
	gaArgs = gaArgs.concat(argumentsArray);
	
	// send to google
	if (globalThis.ga) {
		ga.apply(this, gaArgs);
	}
}

function getPaypalLC() {
	var locale = navigator.language;
	var lang = null;
	if (locale) {
		if (locale.match(/zh/i)) {
			lang = "CN"; 
		} else if (locale.match(/_GB/i)) {
			lang = "GB";
		} else if (locale.match(/ja/i)) {
			lang = "JP";
		} else {
			lang = locale.substring(0,2);
		}
		return lang;
	}
}

/*
if (isInternalPage()) {
    // For some reason including scripts for popup window slows down popup window reaction time, so only found that settimeout would work
    if (location.href.includes("popup.")
    || location.href.includes("options.")) {
        setTimeout(function() {
            analytics();
        }, 1000);
    } else {
        analytics();
    }
}
*/

function getPreferredLanguage() {
	if (navigator.languages && navigator.languages.length) {
		return navigator.languages[0];
	} else {
		return navigator.language;
	}
}

async function initUI() {
    if (await storage.get("darkMode") && !location.href.includes("contribute.")) {
        document.documentElement.setAttribute("color-scheme", "dark");
    } else {
        document.documentElement.setAttribute("color-scheme", "white");
    }

    await initMisc();
    initMessages();
}

async function initMisc(params = {}) {
    if (!globalThis.initMiscPromise) {
        console.info("initMisc");
        globalThis.initMiscPromise = new Promise(async (resolve, reject) => {
            await DetectClient.init();

            globalThis.locale = getPreferredLanguage();

            console.time("loadLocaleMessages");
            await loadLocaleMessages();
            console.timeEnd("loadLocaleMessages");

            // MUST USE promise with resolve because I could forget an await on one of these async functions above and could lead to race issue and undefined accounts or buttonIcon ref: https://jasonsavard.com/forum/discussion/comment/24170#Comment_24170
            resolve();
        });
    }
    return globalThis.initMiscPromise;
}

function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

function initPaperElement($nodes, params = {}) {
	$nodes.forEach(async element => {
		const key = element.getAttribute("storage");
		const permissions = element.getAttribute("permissions");
		
		// this "selected" attribute behaves weird with jQuery, the value gets sets to selected='selected' always, so we must use native .setAttibute
		if (key && key != "language") { // ignore lang because we use a specific logic inside the options.js
            const value = await storage.get(key);
			if (element.nodeName.equalsIgnoreCase("paper-checkbox")) {
				element.checked = toBool(value);
			} else if (element.nodeName.equalsIgnoreCase("paper-listbox")) {
				element.setAttribute("selected", value ?? "");
			} else if (element.nodeName.equalsIgnoreCase("paper-radio-group")) {
				element.setAttribute("selected", value ?? "");
			} else if (element.nodeName.equalsIgnoreCase("paper-slider")) {
				element.setAttribute("value", value);
			}
		} else if (permissions) {
			element.checked = await chrome.permissions.contains({permissions: [permissions]});
		}

		// need a 1ms pause or else setting the default above would trigger the change below?? - so make sure it is forgotten
		setTimeout(function() {
			
			var eventName;
			if (element.nodeName.equalsIgnoreCase("paper-checkbox")) {
				eventName = "change";
			} else if (element.nodeName.equalsIgnoreCase("paper-listbox")) {
				eventName = "iron-activate";
			} else if (element.nodeName.equalsIgnoreCase("paper-radio-group")) {
				eventName = "paper-radio-group-changed";
			} else if (element.nodeName.equalsIgnoreCase("paper-slider")) {
				eventName = "change";
			}
			
            element.addEventListener(eventName, async function(event) {
				if (key || params.key) {
					
					var value;
					if (element.nodeName.equalsIgnoreCase("paper-checkbox")) {
						value = element.checked;
					} else if (element.nodeName.equalsIgnoreCase("paper-listbox")) {
						value = event.detail.selected;
					} else if (element.nodeName.equalsIgnoreCase("paper-radio-group")) {
						value = element.selected;
					} else if (element.nodeName.equalsIgnoreCase("paper-slider")) {
						value = element.getAttribute("value");
					}

                    let storagePromise;
                    if (key) {
                        storagePromise = setStorage(element, {event:event, key:key, value:value});
                    } else if (params.key) {
                        params.event = event;
                        params.value = value;
                        storagePromise = setStorage(element, params);
                    }
                    
                    storagePromise.catch(error => {
                        console.error("could not save setting: " + error);
                        if (element.nodeName.equalsIgnoreCase("paper-checkbox")) {
                            element.checked = !element.checked;
                        } else if (element.nodeName.equalsIgnoreCase("paper-listbox")) {
                            element.closest("paper-dropdown-menu").close();
                        }
                        
                        if (error != JError.DID_NOT_CONTRIBUTE) {
                            showError(error);
                        }
                    });
				} else if (permissions) {
					if (element.checked) {
						element.checked = await chrome.permissions.request({permissions: [permissions]});
					} else {			
						const removed = await chrome.permissions.remove({permissions: [permissions]});
                        if (removed) {
                            element.checked = false;
                        } else {
                            // The permissions have not been removed (e.g., you tried to remove required permissions).
                            element.checked = true;
                            alert("These permissions could not be removed, they might be required!");
                        }
					}
				}
			});
		}, 500);
	});
}

function initOptions() {
	initPaperElement(selectorAll("[storage], [permissions]"));
}

function initMessages(node) {
	var selector;
	if (node) {
		selector = node;
	} else {
		selector = "*";
	}
	selectorAll(selector).forEach(el => {
		let attr = el.getAttribute("msg");
		if (attr) {
			const msgArg1 = el.getAttribute("msgArg1");
			if (msgArg1) {
				el.textContent = chrome.i18n.getMessage( attr, msgArg1 )
			} else {
				// look for inner msg nodes to replace before...
				const innerMsg = el.querySelectorAll("*[msg]");
				if (innerMsg.length) {
					initMessages(innerMsg);
                    const msgArgs = Array.from(innerMsg).map(msg => msg.outerHTML);
					el.innerHTML = chrome.i18n.getMessage(attr, msgArgs);
				} else {
					el.textContent = chrome.i18n.getMessage(attr);
				}
			}
		}
		attr = el.getAttribute("msgTitle");
		if (attr) {
			el.setAttribute("title", chrome.i18n.getMessage(attr));
		}
		attr = el.getAttribute("msgLabel");
		if (attr) {
			const msgArg1 = el.getAttribute("msgLabelArg1");
			if (msgArg1) {
				el.setAttribute("label", getMessage( el.getAttribute("msgLabel"), msgArg1 ));
			} else {
				el.setAttribute("label", getMessage(attr));
			}
		}
		attr = el.getAttribute("msgText");
		if (attr) {
			var msgArg1 = el.getAttribute("msgTextArg1");
			if (msgArg1) {
				el.setAttribute("text", getMessage( el.getAttribute("msgText"), msgArg1 ));
			} else {
				el.setAttribute("text", getMessage(attr));
			}
		}
		attr = el.getAttribute("msgSrc");
		if (attr) {
			el.setAttribute("src", chrome.i18n.getMessage(attr));
		}
		attr = el.getAttribute("msgValue");
		if (attr) {
			el.setAttribute("value", chrome.i18n.getMessage(attr));
		}
		attr = el.getAttribute("msgPlaceholder");
		if (attr) {
			el.setAttribute("placeholder", getMessage(attr));
		}
		attr = el.getAttribute("msgHTML");
		if (attr) {
			el.innerHTML = getMessage(attr);
		}
		attr = el.getAttribute("msgHALIGN");
		if (attr) {
			if (htmlElement.dir == "rtl" && attr == "right") {
				el.setAttribute("horizontal-align", "left");
			} else {
				el.setAttribute("horizontal-align", attr);
			}
		}
		attr = el.getAttribute("msgPOSITION");
		if (attr) {
			if (htmlElement.dir == "rtl" && attr == "left") {
				el.setAttribute("position", "right");
			} else {
				el.setAttribute("position", attr);
			}
		}
		
	});

    if (!DetectClient.isChromium()) {
        selectorAll("[chromium-only]").forEach(el => {
            el.hidden = true;
        });
    }

	if (!DetectClient.isChrome()) {
        selectorAll("[chrome-only]").forEach(el => {
            el.hidden = true;
        });
    }

    if (DetectClient.isEdge()) {
        selectorAll("[hide-from-edge]").forEach(el => {
            el.hidden = true;
        });
    }
}

async function donationClicked(action) {
	if (await storage.get("donationClicked")) {
		return true;
	} else {
		openContributeDialog(action);
		return false;
	}
}

function parseTime(timeString, date) {    
    if (!timeString) return null;
	timeString = timeString.toLowerCase();
    var time = timeString.match(/(\d+)(:(\d\d))?\s*(a?p?)/i); 
    if (time == null) return null;
    var hours = parseInt(time[1],10);    
    if (hours == 12) {
		// Assume noon not midnight if no existant AM/PM
		if (!time[4] || time[4] == "p") {
			hours = 12;
		} else {
			hours = 0;
		}
    } else {
        hours += (hours < 12 && time[4] == "p") ? 12 : 0;
    }
    var d = new Date();
    if (date) {
    	d = date;
    }
    d.setHours(hours);
    d.setMinutes(parseInt(time[3],10) || 0);
    d.setSeconds(0, 0);  
    return d;
}

function findElementByAttribute(array, attributeName, attributeValue) {
	for (const a in array) {
		if (array[a][attributeName] == attributeValue) {
			return array[a];
		}
	}
}

function removeNode(id) {
	var o = document.getElementById(id);
	if (o) {
		o.parentNode.removeChild(o);
	}
}

function addCSS(id, css) {
	removeNode(id);
	var s = document.createElement('style');
	s.setAttribute('id', id);
	s.setAttribute('type', 'text/css');
	s.appendChild(document.createTextNode(css));
	(document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
}

function pad(str, times, character) { 
	var s = str.toString();
	var pd = '';
	var ch = character ? character : ' ';
	if (times > s.length) { 
		for (var i=0; i < (times-s.length); i++) { 
			pd += ch; 
		}
	}
	return pd + str.toString();
}

function getBrowserVersion() {
	// Browser name = Chrome, Full version = 4.1.249.1064, Major version = 4, navigator.appName = Netscape, navigator.userAgent = Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.1.249.1064 Safari/532.5
	//																															  Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.38 Safari/533.4
	var agent = navigator.userAgent;
	var offset = agent.indexOf("Chrome");
	var version = null;
	if (offset != -1) {
		version = agent.substring(offset+7);
		offset = version.indexOf(";");
		if (offset != -1) {
			version = version.substring(0, offset);
		}
		offset = version.indexOf(" ");
		if (offset != -1) {
			version = version.substring(0, offset);
		}
	}
	if (version) {
		return parseFloat(version);
	}
}

function toBool(str) {
	if ("false" === str || str == undefined) {
		return false;
	} else if ("true" === str) {
		return true;
	} else {
		return str;
	}
}

// name case sensitive
// url (optional defaults to location.href)
function getUrlValue(name, url) {
    url ||= globalThis.location?.href;

    const urlObj = new URL(url, "https://jasondefault.com");
    return urlObj.searchParams.get(name);
}

function setUrlParam(url, name, value) {
    const DEFAULT_DOMAIN = "https://jasondefault.com";

    let urlObj;
    let origin;

    if (!url.includes("://")) {
        let domain = DEFAULT_DOMAIN;
        if (!url.startsWith("/")) {
            domain += "/";
        }

        urlObj = new URL(domain + url);
        origin = "";
    } else {
        urlObj = new URL(url, DEFAULT_DOMAIN);
        origin = urlObj.origin;
    }

    const searchParams = urlObj.searchParams;
    if (value == null || value == "") {
        searchParams.delete(name);
    } else {
        searchParams.set(name, value);
    }

    url = `${origin}${urlObj.pathname}?${searchParams}`;
    if (urlObj.hash) {
        url += urlObj.hash;
    }

    return url;
}

// Usage: getManifest(function(manifest) { display(manifest.version) });
function getManifest(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		callback(JSON.parse(xhr.responseText));
	};
	xhr.open('GET', './manifest.json', true);
	xhr.send(null);
}

function getExtensionIDFromURL(url) {
	//"chrome-extension://dlkpjianaefoochoggnjdmapfddblocd/options.html"
	return url.split("/")[2]; 
}

function getStatus(request, textStatus) {
	var status; // status/textStatus combos are: 201/success, 401/error, undefined/timeout
	try {
		status = request.status;
	} catch (e) {
		status = textStatus;
	}
	return status;
}

Date.prototype.addMinutes = function(mins) {
	return new Date(this.getTime() + minutes(mins));
}

function resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
}

class DateZeroTime extends Date {
    constructor(...dateFields) {
        super(...dateFields);
        resetTime(this);
    }
}

function today() {
	return new DateZeroTime();
}

function yesterday() {
	const yest = new DateZeroTime();
	yest.setDate(yest.getDate()-1);
	return yest;
}

function tomorrow() {
	const tom = new DateZeroTime();
	tom.setDate(tom.getDate()+1);
	return tom;
}

function normalizeDST(date1, date2) {
    if (date1.getTimezoneOffset() != date2.getTimezoneOffset()) {
        date2 = new Date(date2);
        date2 = date2.addMinutes(date1.getTimezoneOffset() - date2.getTimezoneOffset());
    }
    return date2;
}

Date.prototype.diffInMillis = function(otherDate) {
	let d1;
	if (otherDate) {
		d1 = new Date(otherDate);
	} else {
		d1 = new Date();
	}	
	var d2 = new Date(this);
    d1 = normalizeDST(d2, d1);

	return (d2.getTime() - d1.getTime());
};

Date.prototype.diffInDays = function(otherDate, forHumans) {
	var d1;
	if (otherDate) {
		d1 = new Date(otherDate);
	} else {
		d1 = today();
	}	
	var d2 = new Date(this);
    if (forHumans) {
		resetTime(d1);
		resetTime(d2);
	}

    d1 = normalizeDST(d2, d1);
    return (d2.getTime() - d1.getTime()) / ONE_DAY;
};

function addToArray(str, ary) {
	for (const a in ary) {
		if (ary[a] == str) {
			return false;
		}
	}
	ary.push(str);
	return true;
}

function removeFromArray(str, ary) {
	for (var a=0; a<ary.length; a++) {
		if (ary[a] == str) {
			ary.splice(a, 1);
			return true;
		}
	}
	return false;
}

function isInArray(str, ary) {
	for (const a in ary) {
		if (ary[a] == str) {
			return true;
		}
	}
	return false;
}

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNamesShort[D],
				dddd: dF.i18n.dayNames[D],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNamesShort[m],
				mmmm: dF.i18n.monthNames[m],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

dateFormat.i18nEnglish = dateFormat.i18n;  

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

String.prototype.equalsIgnoreCase = function(str) {
	if (this && str) {
		return this.toLowerCase() == str.toLowerCase();
	}
}

function findTag(str, name) {
	if (str) {
		var index = str.indexOf("<" + name + " ");
		if (index == -1) {
			index = str.indexOf("<" + name + ">");
		}
		if (index == -1) {
			return null;
		}
		var closingTag = "</" + name + ">";
		var index2 = str.indexOf(closingTag);
		return str.substring(index, index2 + closingTag.length);
	}
}

//return 1st active tab
async function getActiveTab() {
    const tabs = await chrome.tabs.query({'active': true, lastFocusedWindow: true});
    if (tabs) {
        return tabs[0];
    }
}

function Controller() {
	
	// apps.jasonsavard.com server
	Controller.FULLPATH_TO_PAYMENT_FOLDERS = "https://apps.jasonsavard.com/";
	
	// jasonsavard.com server
	//Controller.FULLPATH_TO_PAYMENT_FOLDERS = "https://jasonsavard.com/apps.jasonsavard.com/";

	// internal only for now
	async function callAjaxController(params) {
        return fetchJSON(Controller.FULLPATH_TO_PAYMENT_FOLDERS + "controller.php", params.data, {
            method: params.method ? params.method : "GET",
            headers: {
                misc: location.href
            }
        });
	}

	Controller.verifyPayment = function(itemID, emails) {
		var data = {
            action: "verifyPayment",
            name: itemID,
            email: emails
        };
		return callAjaxController({data:data});
	}

	Controller.processFeatures = function() {
		storage.enable("donationClicked");
		storage.enable("removeHeaderFooter");
		
		// add to sync also
		if (chrome.storage.sync) {
			chrome.storage.sync.set({"donationClicked":true, "removeHeaderFooter": true});
		}
		
		chrome.runtime.sendMessage({command: "featuresProcessed"});
	}

}

function initUndefinedObject(obj) {
    if (typeof obj == "undefined") {
        return {};
    } else {
        return obj;
    }
}

function initUndefinedCallback(callback) {
    if (callback) {
        return callback;
    } else {
        return function() {};
    }
}

function parseVersionString(str) {
    if (typeof(str) != 'string') { return false; }
    var x = str.split('.');
    // parse from string or default to 0 if can't parse
    var maj = parseInt(x[0]) || 0;
    var min = parseInt(x[1]) || 0;
    var pat = parseInt(x[2]) || 0;
    return {
        major: maj,
        minor: min,
        patch: pat
    }
}

function cloneCanvas(oldCanvas) {
    //create a new canvas
    const newCanvas = document.createElement('canvas');
    const context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function isCtrlPressed(e) {
	return e.ctrlKey || e.metaKey;
}

function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}

function insertScript(url, id) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        if (id) {
            script.id = id;
        }
        script.async = true;
        script.src = url;
        script.onload = e => {
            resolve(e);
        };
		script.onerror = function (e) {
			reject(`Coud not load script: ${url}`);
		};
        (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(script);
    });
}

function insertImport(url, id) {
	var link = document.createElement('link');
	if (id) {
		link.id = id;
	}
	link.rel = 'import';
	link.href = url;
	//link.onload = function(e) {...};
	//link.onerror = function(e) {...};
	document.head.appendChild(link);
}

//for 2nd parmeter of JSON.parse(... , dateReviver);
function dateReviver(key, value) {
    if (isStringDate(value)) {
        return new Date(value);
    } else {
    	return value;
    }
}

function dateReplacer(key, value) {
    if (value instanceof Date) {
        return value.toJSON();
    } else {
    	return value;
    }
}

function isStringDate(str) {
	return typeof str == "string" && str.length == 24 && /\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/.test(str);
}

async function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

function isDomainEmail(email) {
	if (email) {
		email = email.toLowerCase();
		var POPULAR_DOMAINS = ["zoho", "aim", "videotron", "icould", "inbox", "yandex", "rambler", "ya", "sbcglobal", "msn", "me", "facebook", "twitter", "linkedin", "email", "comcast", "gmx", "aol", "live", "google", "outlook", "yahoo", "gmail", "mail", "comcast", "googlemail", "hotmail"];
		
		var foundPopularDomainFlag = POPULAR_DOMAINS.some(function(popularDomain) {
			if (email.includes("@" + popularDomain + ".")) {
				return true;
			}
		});
		
		return !foundPopularDomainFlag;
	}
}

function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		var fileReader = new FileReader();
		fileReader.onload = function () {
			resolve(this.result);
		};
		fileReader.onabort = fileReader.onerror = function (e) {
			reject(e);
		};
		fileReader.readAsDataURL(blob);
	});
}

function showMessageNotification(title, message, error, extensionConflict) {
	var options = {
		type: "basic",
		title: title,
		message: message.toString(),
		iconUrl: NOTIFICATION_ICON_URL,
		priority: 1
	}

	var notificationId;
	if (error) {
		var buttonTitle;

		if (extensionConflict) {
			notificationId = "extensionConflict";
			buttonTitle = "Click here to resolve issue";
		} else {
			notificationId = "error";
			buttonTitle = "If this is frequent then click here to report it";
		}

		if (supportsNotificationButtons()) {
			options.contextMessage = "Error: " + error;
			options.buttons = [{ title: buttonTitle }];
		} else {
			options.message += " Error: " + error;
		}
	} else {
		notificationId = "message";
	}

	chrome.notifications.create(notificationId, options, function (notificationId) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError.message);
		} else {
			setTimeout(function () {
				chrome.notifications.clear(notificationId);
			}, error ? seconds(15) : seconds(5));
		}
	});
}

function showCouldNotCompleteActionNotification(error, extensionConflict) {
    if (extensionConflict) {
        showMessageNotification("Error with last action.", "Try again.", error, extensionConflict);
    } else {
        showMessageNotification("Error with last action.", "Try again.", error);
    }
}

function chooseDesktopMedia(params) {
	return new Promise((resolve, reject) => {
        // null, {systemAudio: "include"}
		chrome.desktopCapture.chooseDesktopMedia(params, (streamId, options) => {
			if (streamId) {
				// todo add options to resolve but resolve only accepts 1 param
				resolve(streamId);
			} else {
				const error = new Error("Cancelled desktop capture");
				error.name = "cancelledDesktopCapture";
				reject(error);
			}
		});
	});
}

async function getChromeWindows() {
    const windows = await chrome.windows.getAll();
    // keep only normal windows and not app windows like debugger etc.
    return windows.filter(thisWindow => {
        return thisWindow.type == "normal";
    });
}

async function findTab(url) {
    try {
        const tabs = await chrome.tabs.query({ url: url + "*" });
        if (tabs.length) {
            const tab = tabs.last();
            console.log("force window found")
            await chrome.tabs.update(tab.id, { active: true });
            // must do this LAST when called from the popup window because if set focus to a window the popup loses focus and disappears and code execution stops
            await chrome.windows.update(tab.windowId, { focused: true });
            return { found: true, tab: tab };
        }
    } catch (error) {
        console.error("find tab error", error);
    }
}

//usage: openUrl(url, {urlToFind:""})
async function openUrl(url, params = {}) {
    if (!globalThis.inWidget && chrome.tabs) {
        const normalWindows = await getChromeWindows();
        if (normalWindows.length == 0) { // Chrome running in background
            const createWindowParams = { url: url };
            if (DetectClient.isChromium()) {
                createWindowParams.focused = true;
            }
            await chrome.windows.create(createWindowParams);
            return findTab(url);
        } else {
            let response;

            if (params.urlToFind) {
                response = await findTab(params.urlToFind);
            }

            if (response?.found) {
                // nothing
            } else {
                await createTabAndFocusWindow(url);
            }

            if (location.href.includes("source=toolbar") && DetectClient.isFirefox() && params.autoClose !== false) {
                globalThis.close();
            }
        }
    } else {
        top.location.href = url;
    }
}

async function createTabAndFocusWindow(url) {
    let windowId;

    if (DetectClient.isFirefox()) { // required for Firefox because when inside a popup the tabs.create would open a tab/url inside the popup but we want it to open inside main browser window 
        const thisWindow = await chrome.windows.getCurrent();
        if (thisWindow?.type == "popup") {
            const windows = await chrome.windows.getAll({ windowTypes: ["normal"] });
            if (windows.length) {
                windowId = windows[0].id;
            }
        }
    }

    const createParams = { url: url };
    if (windowId != undefined) {
        createParams.windowId = windowId;
    }
    const tab = await chrome.tabs.create(createParams);
    await chrome.windows.update(tab.windowId, { focused: true });
    return tab;
}

function hexToRgb(hex) {
	var c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x' + c.join('');
		return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
	}
	//throw new Error('Bad Hex: ' + hex);
}

function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255;

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, v = max;

	var d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return [h, s, v];
}

function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function isColorTooLight(color) {
	let rgb = hexToRgb(color);
	if (rgb) {
		let l = rgbToHsl(rgb[0], rgb[1], rgb[2])[2];
		//let isYellow = rgb[0] == 255 && rgb[1] == 253 && rgb[2] == 33; // refer to https://jasonsavard.com/forum/discussion/comment/19187#Comment_19187
		if (l >= 0.85) {
			return true;
		}
	}
}

function getDataUrl(canvas) {
	return new Promise(async (resolve, reject) => {
		if ('toDataURL' in canvas) { // regular canvas element
			resolve(canvas.toDataURL());
        } else { // OffscreenCanvas
			const blob = await canvas.convertToBlob();
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				resolve(reader.result);
			});
			reader.addEventListener('error', error => {
				reject(error);
			});
			reader.readAsDataURL(blob);
		}
	});
}

function ellipsis(str, cutoffLength) {	
	if (str && str.length > cutoffLength) {
		str = str.substring(0, cutoffLength) + " ...";
	}
	return str;
}

async function fetchWrapper(url, options) {
    try {
        return await fetch(url, options);
    } catch (error) {
        console.error("fetch error: " + error);
        if (navigator.onLine) {
            throw "Network problem";
        } else {
            throw "You're offline";
        }
    }
}

async function fetchText(url) {
    const response = await fetchWrapper(url);
    if (response.ok) {
        return response.text();
    } else {
        const error = Error(response.statusText);
        error.status = response.status;
        throw error;
    }
}

async function fetchJSON(url, data, options = {}) {
    if (options.method) {
        options.method = options.method.toUpperCase();
    }

    if (data) {
        // default is get
        if (!options.method || /GET/i.test(options.method)) {
            if (!url.searchParams) {
                url = new URL(url);
            }
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    data[key].forEach(value => {
                        url.searchParams.append(key + "[]", value);
                    });
                } else {
                    url.searchParams.append(key, data[key]);
                }
            });
        } else { // must be post, patch, delete etc..
            options.headers ||= {};

            const contentType = options.headers["content-type"] || options.headers["Content-Type"];
            if (contentType && contentType.includes("application/json")) {
                options.body = JSON.stringify(data);
            } else if (contentType && contentType.includes("multipart/mixed")) {
                options.body = data;
            } else {
                var formData = new FormData();
                Object.keys(data).forEach(key => formData.append(key, data[key]));
                options.body = formData;
            }
        }
    }
    
    console.log("fetchJSON", url, options);
    const response = await fetchWrapper(url, options);
    console.log("response", response);

    let responseData = await response.text();
    if (responseData) {
        try {
            responseData = JSON.parse(responseData);
        } catch (error) {
            console.warn("Response probaby text only: " + error);
        }
    }
    if (response.ok) {
        return responseData;
    } else {
        if (responseData) {
            if (typeof responseData.code === "undefined") { // code property alread exists so let's use fetchReturnCode
                responseData.code = response.status;
            } else {
                responseData.fetchReturnCode = response.status;
            }
            throw responseData;
        } else {
            throw response.statusText;
        }
    }
}

function byId(id) {
    return document.getElementById(id);
}

// patch for issue on Linux when setting left/top outside of window - solution remove top/left settings, error: Invalid value for bounds. Bounds must be at least 50% within visible screen space.
function createWindow(params) {
    return new Promise((resolve, reject) => {
        chrome.windows.create(params, newWindow => {
            if (chrome.runtime.lastError) {
                const safeParams = shallowClone(params);
                delete safeParams.top;
                delete safeParams.left;
                chrome.windows.create(safeParams, newWindow => {
                    resolve(newWindow);
                });
            } else {
                resolve(newWindow);
            }
        });
    });
}

function supportsNotificationButtons() {
    return DetectClient.isChromium();
}

function generateRandomAlarmDelay() {
    const minHours = 2; // Minimum number of hours
    const maxHours = 8; // Maximum number of hours
  
    // Convert hours to minutes
    const minMinutes = minHours * 60;
    const maxMinutes = maxHours * 60;
  
    // Generate a random number of minutes between minMinutes and maxMinutes
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  
    return randomMinutes;
}