var launch_all = document.getElementById('launch-all');

launch_all.addEventListener('click', function() {
    UpdateLinks();
});

var urls = [];

function UpdateLinks() {
    for (var i in urls) {
        window.open(urls[i]);
    }
}

function copyURL(field) {
    chrome.storage.sync.get(field, (url) => {
        var copyText = url[field];
        if (copyText) {
            const el = document.createElement('textarea');
            el.value = copyText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    });
}

function openURL(field) {
    chrome.storage.sync.get(field, (url) => {
        var link = url[field];
        if (link) {
            window.open(link);
        }
    });
}

document.querySelectorAll('.copy_btn').forEach(item => {
    var name = item.getAttribute("name");
    item.addEventListener('click', e => {
        copyURL(name);
    });
});

document.querySelectorAll('.open_btn').forEach(item => {
    var name = item.getAttribute("name");
    item.addEventListener('click', e => {
        openURL(name);
    });
});

var name_field = document.getElementById('name');
var website = document.getElementById('website');
var github = document.getElementById('github');
var linkedin = document.getElementById('linkedin');
var twitter = document.getElementById('twitter');
var instagram = document.getElementById('instagram');
var edit_btn = document.getElementById('edit');

var keys = ["name", "website", "github", "linkedin", "twitter", "instagram"];
chrome.storage.sync.get(keys, function(links) {
    if (!chrome.runtime.error) {
        if (links.name) {
            name_field.innerHTML = links.name;
        }
        if (links.website) {
            website.href = links.website;
            urls.push(links.website);
        } else {
            website.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
        if (links.github) {
            github.href = links.github;
            urls.push(links.github);
        } else {
            github.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
        if (links.linkedin) {
            linkedin.href = links.linkedin;
            urls.push(links.linkedin);
        } else {
            linkedin.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
        if (links.twitter) {
            twitter.href = links.twitter;
            urls.push(links.twitter);
        } else {
            twitter.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
        if (links.instagram) {
            instagram.href = links.instagram;
            urls.push(links.instagram);
        } else {
            instagram.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
    }
});
