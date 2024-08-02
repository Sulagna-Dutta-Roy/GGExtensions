
function getInput() {
    /* 
    - return the string to hash
    */
    return document.querySelector("input[name='string']").value;
}

function displayHash(hash) {
    /* 
    - render the provided hash to html
    */
    document.getElementById("text").textContent = hash;
}

function bindButton(btnId, btnCb) {
    /*
    - bind the calculate hash button of current page to correct handler   
    */
    let targetBtn = document.getElementById(btnId);

    if (targetBtn) {
        targetBtn.addEventListener("click", btnCb);
    }
}


function md5() {

    const string = getInput();

    const hash = CryptoJS.MD5(string).toString();

    displayHash(hash);
}


function sha() {

    const string = getInput();
    const algo = document.getElementById("algo").value;

    let hash;

    if (algo == "sha1") {
        hash = CryptoJS.SHA1(string).toString();
    }
    else if (algo == "sha256") {
        hash = CryptoJS.SHA256(string).toString();
    }
    else if (algo == "sha512") {
        hash = CryptoJS.SHA512(string).toString();
    }

    displayHash(hash);
}


function hmac() {
    const string = getInput();
    const passphrase = document.querySelector("input[name='passphrase']").value;
    const algo = document.getElementById("algo").value;

    let hash;

    if (algo == "hmac-md5") {
        hash = CryptoJS.HmacMD5(string, passphrase);
    }
    else if (algo == "hmac-sha1") {
        hash = CryptoJS.HmacSHA1(string, passphrase);
    }
    else if (algo == "hmac-sha256") {
        hash = CryptoJS.HmacSHA256(string, passphrase);
    }
    else if (algo == "hmac-sha512") {
        hash = CryptoJS.HmacSHA256(string, passphrase);
    }

    displayHash(hash);
}

bindButton("md5-calc", md5);
bindButton("sha-calc", sha);
bindButton("hmac-calc", hmac);