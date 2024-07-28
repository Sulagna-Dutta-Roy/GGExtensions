{
    "manifest_version": 3,
    "name": "VPN Extension",
    "version": "1.0",
    "description": "A simple VPN control extension",
    "icons": {
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    },
    "action": {
        "default_popup": "index.html",
    },
    "permissions": [
        "storage",
        "activeTab",
        "webRequest",
        "webRequestBlocking",
        "proxy"
    ],
    "background": {
        "service_worker": "vpn.js"
    },
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["vpn.js"]
        }
    ]
}
