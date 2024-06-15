// GFG
var secondary = document.getElementById('secondary');
var middleAds = document.getElementById('GFG_AD_InContent_Desktop_728x280');
var incontentAds = document.getElementById('GFG_AD_gfg_outstream_incontent');
var googleAds = document.getElementById('i-amphtml-fill-content i-amphtml-fit-text-content');
var articleMeta = document.getElementsByClassName('article-meta');




secondary.style.display = "none";
middleAds.style.display = "none";
incontentAds.style.display = "none";
googleAds.style.display = "none";

if (articleMeta.length >= 0) {
    for (var i = 0; i < articleMeta.length; i++) {
        articleMeta[i].style.display = "none";
    }
}