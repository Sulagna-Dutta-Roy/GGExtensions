/*global chrome, gsStorage, gsChrome, gsUtils */
(function(global) {
  try {
    chrome.extension.getBackgroundPage().tgs.setViewGlobals(global);
  } catch (e) {
    window.setTimeout(() => window.location.reload(), 1000);
    return;
  }

  var elementPrefMap = {
    preview: gsStorage.SCREEN_CAPTURE,
    forceScreenCapture: gsStorage.SCREEN_CAPTURE_FORCE,
    cleanScreenCaptures: gsStorage.ENABLE_CLEAN_SCREENCAPS,
    suspendInPlaceOfDiscard: gsStorage.SUSPEND_IN_PLACE_OF_DISCARD,
    onlineCheck: gsStorage.IGNORE_WHEN_OFFLINE,
    batteryCheck: gsStorage.IGNORE_WHEN_CHARGING,
    unsuspendOnFocus: gsStorage.UNSUSPEND_ON_FOCUS,
    discardAfterSuspend: gsStorage.DISCARD_AFTER_SUSPEND,
    dontSuspendPinned: gsStorage.IGNORE_PINNED,
    dontSuspendForms: gsStorage.IGNORE_FORMS,
    dontSuspendAudio: gsStorage.IGNORE_AUDIO,
    dontSuspendActiveTabs: gsStorage.IGNORE_ACTIVE_TABS,
    ignoreCache: gsStorage.IGNORE_CACHE,
    addContextMenu: gsStorage.ADD_CONTEXT,
    syncSettings: gsStorage.SYNC_SETTINGS,
    noNag: gsStorage.NO_NAG,
    timeToSuspend: gsStorage.SUSPEND_TIME,
    theme: gsStorage.THEME,
    whitelist: gsStorage.WHITELIST,
  };

  function selectComboBox(element, key) {
    var i, child;

    for (i = 0; i < element.children.length; i += 1) {
      child = element.children[i];
      if (child.value === key) {
        child.selected = 'true';
        break;
      }
    }
  }

  // Used to prevent options set in managed storage from being changed
  function blockOption(element) {
    element.setAttribute('disabled', '');
  }

  //populate settings from synced storage
  function initSettings() {
    var optionEls = document.getElementsByClassName('option'),
      pref,
      element,
      i;

    for (i = 0; i < optionEls.length; i++) {
      element = optionEls[i];
      pref = elementPrefMap[element.id];
      populateOption(element, gsStorage.getOption(pref));
      if (gsStorage.isOptionManaged(pref)) {
        blockOption(element);
      }
    }

    setForceScreenCaptureVisibility(
      gsStorage.getOption(gsStorage.SCREEN_CAPTURE) !== '0'
    );
    setCleanScreenCaptureVisibility(
      gsStorage.getOption(gsStorage.SCREEN_CAPTURE) !== '0'
    );
    setAutoSuspendOptionsVisibility(
      parseFloat(gsStorage.getOption(gsStorage.SUSPEND_TIME)) > 0
    );
    setSyncNoteVisibility(!gsStorage.getOption(gsStorage.SYNC_SETTINGS));

    let searchParams = new URL(location.href).searchParams;
    if (searchParams.has('firstTime') && !gsStorage.getOption(gsStorage.NO_NAG)) {
      document
        .querySelector('.welcome-message')
        .classList.remove('reallyHidden');
      document.querySelector('#options-heading').classList.add('reallyHidden');
    }
  }

  function populateOption(element, value) {
    if (
      element.tagName === 'INPUT' &&
      element.hasAttribute('type') &&
      element.getAttribute('type') === 'checkbox'
    ) {
      element.checked = value;
    } else if (element.tagName === 'SELECT') {
      selectComboBox(element, value);
    } else if (element.tagName === 'TEXTAREA') {
      element.value = value;
    }
  }

  function getOptionValue(element) {
    if (
      element.tagName === 'INPUT' &&
      element.hasAttribute('type') &&
      element.getAttribute('type') === 'checkbox'
    ) {
      return element.checked;
    }
    if (element.tagName === 'SELECT') {
      return element.children[element.selectedIndex].value;
    }
    if (element.tagName === 'TEXTAREA') {
      return element.value;
    }
  }

  function setForceScreenCaptureVisibility(visible) {
    if (visible) {
      document.getElementById('forceScreenCaptureContainer').style.display =
        'block';
    } else {
      document.getElementById('forceScreenCaptureContainer').style.display =
        'none';
    }
  }

  function setCleanScreenCaptureVisibility(visible) {
    if (visible) {
      document.getElementById('cleanScreenCapturesContainer').style.display = 'block';
    } else {
      document.getElementById('cleanScreenCapturesContainer').style.display = 'none';
    }
  }

  function setSyncNoteVisibility(visible) {
    if (visible) {
      document.getElementById('syncNote').style.display = 'block';
    } else {
      document.getElementById('syncNote').style.display = 'none';
    }
  }

  function setAutoSuspendOptionsVisibility(visible) {
    Array.prototype.forEach.call(
      document.getElementsByClassName('autoSuspendOption'),
      function(el) {
        if (visible) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      }
    );
  }

  function handleChange(element) {
    return function() {
      let prefKey = elementPrefMap[element.id],
        interval;
      //add specific screen element listeners
      switch (prefKey) {
        case gsStorage.SCREEN_CAPTURE:
          setForceScreenCaptureVisibility(getOptionValue(element) !== '0');
          setCleanScreenCaptureVisibility(getOptionValue(element) !== '0');
          break;
        case gsStorage.SUSPEND_TIME:
          interval = getOptionValue(element);
          setAutoSuspendOptionsVisibility(interval > 0);
          break;
        case gsStorage.SYNC_SETTINGS:
          if (getOptionValue(element)) {
            setSyncNoteVisibility(false);
          }
          break;
        case gsStorage.ENABLE_CLEAN_SCREENCAPS:
          if (getOptionValue(element)) {
            chrome.runtime.sendMessage({ action: 'loadCleanScreencaptureBlocklist' })
          }
          break;
      }

      var [oldValue, newValue] = saveChange(element);
      if (oldValue !== newValue) {
        gsUtils.performPostSaveUpdates(
          [prefKey],
          { [prefKey]: oldValue },
          { [prefKey]: newValue }
        );
      }
    };
  }

  function saveChange(element) {
    var pref = elementPrefMap[element.id],
      oldValue = gsStorage.getOption(pref),
      newValue = getOptionValue(element);

    //clean up whitelist before saving
    if (pref === gsStorage.WHITELIST) {
      newValue = gsUtils.cleanupWhitelist(newValue);
    }

    //save option
    if (oldValue !== newValue) {
      gsStorage.setOptionAndSync(elementPrefMap[element.id], newValue);
    }

    return [oldValue, newValue];
  }

  gsUtils.documentReadyAndLocalisedAsPromsied(document).then(function() {
    initSettings();

    var optionEls = document.getElementsByClassName('option'),
      element,
      i;

    //add change listeners for all 'option' elements
    for (i = 0; i < optionEls.length; i++) {
      element = optionEls[i];
      if (element.tagName === 'TEXTAREA') {
        element.addEventListener(
          'input',
          gsUtils.debounce(handleChange(element), 200),
          false
        );
      } else {
        element.onchange = handleChange(element);
      }
    }

    document.getElementById('testWhitelistBtn').onclick = async e => {
      e.preventDefault();
      const tabs = await gsChrome.tabsQuery();
      const tabUrls = tabs
        .map(
          tab =>
            gsUtils.isSuspendedTab(tab)
              ? gsUtils.getOriginalUrl(tab.url)
              : tab.url
        )
        .filter(
          url => !gsUtils.isSuspendedUrl(url) && gsUtils.checkWhiteList(url)
        )
        .map(url => (url.length > 55 ? url.substr(0, 52) + '...' : url));
      if (tabUrls.length === 0) {
        alert(chrome.i18n.getMessage('js_options_whitelist_no_matches'));
        return;
      }
      const firstUrls = tabUrls.splice(0, 22);
      let alertString = `${chrome.i18n.getMessage(
        'js_options_whitelist_matches_heading'
      )}\n${firstUrls.join('\n')}`;

      if (tabUrls.length > 0) {
        alertString += `\n${chrome.i18n.getMessage(
          'js_options_whitelist_matches_overflow_prefix'
        )} ${tabUrls.length} ${chrome.i18n.getMessage(
          'js_options_whitelist_matches_overflow_suffix'
        )}`;
      }
      alert(alertString);
    };

    //hide incompatible sidebar items if in incognito mode
    if (chrome.extension.inIncognitoContext) {
      Array.prototype.forEach.call(
        document.getElementsByClassName('noIncognito'),
        function(el) {
          el.style.display = 'none';
        }
      );
      window.alert(chrome.i18n.getMessage('js_options_incognito_warning'));
    }
  });

  global.exports = {
    initSettings,
  };
})(this);
