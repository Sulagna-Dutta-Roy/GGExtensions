let blockedURLs = new Set();
let blockedCount = 0;
const cache = new Map();
const TRACKER_PATTERNS = [
    "*://*.doubleclick.net/*",
    "*://*.google-analytics.com/*",
    "*://*.facebook.com/*",
    "*://*.twitter.com/*",
    "*://*.adnxs.com/*",
    "*://*.leetcode.com/*",
    "*://*.chatgpt.com/*"
];

// Load external blocklist (e.g., EasyPrivacy)
const loadExternalBlocklist = async () => {
    const response = await fetch('https://easylist.to/easylist/easyprivacy.txt');
    const text = await response.text();
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line && !line.startsWith('!') && !line.startsWith('[')) {
            TRACKER_PATTERNS.push(line);
        }
    });
};

// Call the function to load external blocklist
loadExternalBlocklist();

const isTracker = (url) => {
    // Check cache first
    if (cache.has(url)) {
        return cache.get(url);
    }

    // Check against known patterns
    for (const pattern of TRACKER_PATTERNS) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (regex.test(url)) {
            cache.set(url, true);
            return true;
        }
    }

    // Heuristic detection based on domain analysis
    const domain = (new URL(url)).hostname;
    const heuristicResult = domain.includes('ad') || domain.includes('track');
    cache.set(url, heuristicResult);
    return heuristicResult;
};

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (isTracker(details.url)) {
            blockedURLs.add(details.url);
            blockedCount++;
            return { cancel: true };
        }
        return { cancel: false };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        details.requestHeaders = details.requestHeaders.filter(header =>
            header.name.toLowerCase() !== 'user-agent'
        );
        details.requestHeaders.push({
            name: 'User-Agent',
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

chrome.cookies.onChanged.addListener((changeInfo) => {
    if (!changeInfo.removed) {
        chrome.cookies.remove({
            url: `http${changeInfo.cookie.secure ? 's' : ''}://${changeInfo.cookie.domain}${changeInfo.cookie.path}`,
            name: changeInfo.cookie.name
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "getBlockedURLs") {
        sendResponse({ blockedURLs: Array.from(blockedURLs), blockedCount });
    }
});

const calculatePrivacyScore = () => {
    // Implement a privacy score calculation
    const score = 100 - (blockedCount * 2);
    return Math.max(score, 0);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "getPrivacyScore") {
        sendResponse({ score: calculatePrivacyScore() });
    }
});