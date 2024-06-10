# The Great Suspender - Without Analytics Tracking

**PLEASE NOTE: If you are switching to this extension from a different version of TheGreatSuspender, first export your tabs from the plugin settings window then, after updating, re-import your suspended tabs. Alternatively unsuspend (or bookmark) your existing suspended tabs before upgrading - you can find "unsuspend all tabs" by clicking on the extension icon in the top right corner of Chrome**

**Import/Export Instructions: https://i.imgur.com/jgr0qEd.png**


Modified version of "The Great Suspender" to remove analytics tracking and rogue .js files from anonymous developer who is now in control of the GitHub source & web store versions.

This work carries no guarantees only to the best of my ability in 2 hours using notepad2 & AstroGrep. I am not a developer and do not intend to spend much time keeping this extension updated.


"The Great Suspender" is a free and open-source Google Chrome extension for people who find that chrome is consuming too much system resource or suffer from frequent chrome crashing. Once installed and enabled, this extension will automatically *suspend* tabs that have not been used for a while, freeing up memory and cpu that the tab was consuming.
 



### Chrome Web Store

This version of The Great Suspender is not available on the Chrome Web Store.




### Build from github (untested in this release)

Dependencies: openssl, npm.

Clone the repository and run these commands:
```
npm install
npm run generate-key
npm run build
```

It should say:
```
Done, without errors.
```

The extension in crx format will be inside the build/crx/ directory. You can drag it into [extensions] (chrome://extensions) to install locally.

### Integrating with another Chrome extension or app

The old extension had a small external api to allow other extensions to request the suspension of a tab. .

### Windows Group Policies / Windows Registry configuration values

Since extension version 7.1.8 it is possible to set the configuration using the system registy, which can be applied via group policies on Microsoft Windows.

The whitelist consists of a list of domains seperated by a space character, *do not include http:// or https://* Here's an example:
  `domain1.com www.domain2.com sub.domain3.com`

Configuration stored in registry can be either HKCU or HKLM at 
  `\Software\Policies\Google\Chrome\3rdparty\extensions\EXTENSION_ID\policy`

Replace the EXTENSION_ID with the correct value

- To enable function `(true)` use REG_DWORD set to 1
- To disable function `(false)` use REG_DWORD set to 0
- When using REG_SZ "quotes" are not required

*The following settings can be defined:*

* `SCREEN_CAPTURE` (string, default: '0')
* `SCREEN_CAPTURE_FORCE` (boolean, default: false)
* `SUSPEND_IN_PLACE_OF_DISCARD` (boolean, default: false)
* `DISCARD_IN_PLACE_OF_SUSPEND` (boolean, default: false)
* `USE_ALT_SCREEN_CAPTURE_LIB` (boolean, default: false)
* `DISCARD_AFTER_SUSPEND` (boolean, default: false)
* `IGNORE_WHEN_OFFLINE` (boolean, default: false)
* `IGNORE_WHEN_CHARGING` (boolean, default: false)
* `UNSUSPEND_ON_FOCUS` (boolean, default: false)
* `IGNORE_PINNED` (boolean, default: true)
* `IGNORE_FORMS` (boolean, default: true)
* `IGNORE_AUDIO` (boolean, default: true)
* `IGNORE_ACTIVE_TABS` (boolean, default: true)
* `IGNORE_CACHE` (boolean, default: false)
* `ADD_CONTEXT` (boolean, default: true)
* `SYNC_SETTINGS` (boolean, default: true)
* `ENABLE_CLEAN_SCREENCAPS` (boolean, default: false)
* `SUSPEND_TIME` (string (minutes), default: '60')
* `NO_NAG` (boolean, default: false)
* `WHITELIST` (string (one URL per line), default: '')
* `THEME` (string, default: 'light')


**Step by Step:**

*Note that config changes don't seem to apply until Chrome is restarted, sometimes requires closing/re-opening chrome for a second time*

1. Copy the extension ID from chrome://extensions
2. Create required registry keys (pick either HKLM or HKCU) obviously add your own extension ID, at:
`\Software\Policies\Google\Chrome\3rdparty\extensions\EXTENSION_ID\policy`
  - Use REG_SZ for string config values
  - Use REG_DWORD for boolean config (1 for true, 0 for false)
  - Use REG_SZ for WHITELIST, split each domain with a space char. Extension doesn't care for www.  but do not include http/s://
    `domain1.com domain2.com www.domain3.com whatever.you.want.com`
3. **Restart Chrome at least once, if not twice**
4. Go to chrome://policy and click "Reload policies" in top left, you should see your configuration listed
![Config Example](https://i.imgur.com/Vr6P7xp.png)


### Contributing to this extension

Contributions are very welcome. Feel free to submit pull requests for new features and bug fixes. For new features, ideally you would raise an issue for the proposed change first so that we can discuss ideas. This will go a long way to ensuring your pull request is accepted.
