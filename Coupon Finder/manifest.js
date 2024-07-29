{
    "manifest_version": 2,
    "name": "Coupon Finder",
    "version": "1.0",
    "description": "Automatically finds and applies the best coupons at checkout.",
    "permissions": [
      "activeTab",
      "tabs",
      "http://*/",
      "https://*/"
    ],
    "browser_action": {
      "default_popup": "index.html",
      "default_icon": "icon.png"
    },
    "background": {
      "scripts": ["background.js"],
      "persistent": false
    },
    "icons": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    },
    "content_scripts": [
      {
        "matches": ["http://*/*", "https://*/*"],
        "js": ["content.js"]
      }
    ]
  }
  