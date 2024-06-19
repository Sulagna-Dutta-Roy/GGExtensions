let signedIn = false;
let fileID, modifiedTime;

const ID = chrome.runtime.id;

$(window).on("load", () => {
    $("#drive-login").css("display", "flex");
    chrome.identity.getAuthToken({interactive: false}, async (token) => {
        if(!chrome.runtime.lastError)
            signedIn = true;
        else
            signedIn = false;
        
        toggleDriveMenu();

        if(signedIn){
            ([fileID, modifiedTime] = await searchFile(token));
            $("#drive-last-backup span").text(new Date(modifiedTime).toLocaleString());
        }
    });
});

$("#drive-download").on("click", function(){
    if(!fileID)
        alert("File not found in google drive");
    else{
        chrome.identity.getAuthToken({interactive: false}, async (token) => {
            getFile(token, fileID);
        });
    }
});

$("#drive-upload").on("click", function(){
    chrome.identity.getAuthToken({interactive: false}, async (token) => {
        if(fileID)
            backupFile(token, fileID, DATA);
        else
            uploadFile(token, DATA);
    });
});

$("#drive-login").on("click", function(){
    if(!signedIn){
        chrome.identity.getAuthToken({interactive: true}, (token) => {
            if(!chrome.runtime.lastError)
                signedIn = true;
            else
                signedIn = false;
            
            window.location.reload();
        });
    }
    else{
        chrome.identity.getAuthToken({'interactive': false}, function(token) {
            window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`).then(res => {
                chrome.identity.clearAllCachedAuthTokens(function (){
                    window.location.reload();
                });
            });
        });
    }
});

function toggleDriveMenu(){
    if(signedIn){
        $("#drive-login span").text("Sign Out");
        $("#drive-menu").addClass("is-active");
    }
    else{
        $("#drive-login span").text("Sign In");
        $("#drive-menu").removeClass("is-active");
    }
}

async function searchFile(token){
    return new Promise(resolve => {
        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/drive/v3/files",
            headers:{
                Authorization: `Bearer ${token}`,
            },
            data: {q: `name = 'MoviesWatchlist_${ID}.json'`, fields: "files(id, name, modifiedTime)"},
            success: resolve
        });
    }).then(res => {
        console.log("File search result", res);
        return [res.files[0]?.id, res.files[0]?.modifiedTime];
    });
}

function getFile(token, fileID){
    console.log("Downloading file...", fileID);
    $.ajax({
        type: "GET",
        url: `https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`,
        headers:{
            Authorization: `Bearer ${token}`,
        },
        success: function(res){
            console.log("File fetched from google drive", res);
            DATA = res;
            DataManager.saveData();
            window.location.reload();
        },
        error: function(xhr, options, error){
            console.error(xhr, error);
            alert("Error while downloading data");
        }
    });
}

function backupFile(token, fileID, data){
    console.log("uploading ", data);

    fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileID}?uploadType=media`, {
        method: "PATCH",
        headers: new Headers({Authorization: `Bearer ${token}`, 'Content-Type': "application/json"}),
        body: JSON.stringify(data),
    }).then(res => res.json())
    .then(res => {
        console.log(res);
        if(res.error)
            alert(res.error.message);
        else
            alert("File saved successfuly");
    })
}

function uploadFile(token, data){
    console.log("uploading ", data);
    let metadata = {
        mimeType: "application/json",
        name: `MoviesWatchlist_${ID}.json`
    }

    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: "application/json"}));
    form.append('file', new Blob([JSON.stringify(data)], {type: "application/json"}));

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: new Headers({Authorization: `Bearer ${token}`}),
        body: form,
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if(res.error)
            alert(res.error.message);
        else{
            alert("File saved successfuly");
            window.location.reload();
        }
    });
}