var name_display=document.getElementById('name')
var name_field=document.getElementById('name_field')
var website=document.getElementById('website')
var github=document.getElementById('github')
var linkedin=document.getElementById('linkedin')
var twitter=document.getElementById('twitter')
var instagram=document.getElementById('instagram')
var save=document.getElementById('save')

var keys=["name","website","github","linkedin","twitter","instagram"];

chrome.storage.sync.get(keys,function(links){
    if(!chrome.runtime.error){
        if(links.name){
            name_display.innerHTML = links.name;
            name_field.value=links.name;
        }
        if(links.website){
            website.value=links.website;
        }
        if(links.github){
            github.value=links.github;
        }
        if(links.linkedin){
            linkedin.value=links.linkedin;
        }
        if(links.twitter){
            twitter.value=links.twitter;
        }
        if(links.instagram){
            instagram.value=links.instagram;
        }
    }
});
save.addEventListener('click',function(){
    updateLinks();
});

function updateLinks(){
    let values={
        "name":name_field.value,
        "website":website.value,
        "github":github.value,
        "linkedin":linkedin.value,
        "twitter":twitter.value,
        "instagram":instagram.value
    }
    chrome.storage.sync.set(values,function(){
        if(!chrome.runtime.error){
            window.location.pathname='popup.html'
        }
    })
}