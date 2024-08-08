// ==UserScript==
// @name         Advanced CSS Styling with Gradient
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply custom CSS with advanced styling and gradient background
// @author       Your Name
// @match        https://example.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @resource     CUSTOM_CSS https://yourdomain.com/style.css
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS
    const cssLink = document.createElement("link");
    cssLink.href = GM_getResourceURL("CUSTOM_CSS");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    document.head.appendChild(cssLink);

    // Example of adding custom elements or modifying the page
    $('body').prepend('<div class="custom-banner">Welcome to the Styled Page!</div>');
})();
