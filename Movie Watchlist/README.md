# Movie Watchlist
An interactice extension to keep your movies in your watchlist grouped by your taste and criteria. Watch them, add to your favourites, and remove then when you wish to.

## Features

- Add movies and shows to custom lists directly from a google search.
- Mark titles as favorites.
- Keep track of movies you've already watched.
- Filter the lists that you are viewing.
- Drag & drop movies from one list to another to copy.
- Export / import data file and cloud backup.


## Google Drive integration
By default the application only allows you to download and upload files locally. To enable backing up to the cloud you need to create a new project at Google Cloud.

### Add the following to the manifest.json:
- "key": ""
- From chrome://extensions pack the extension
- Open the .pem file, and copy the private key and paste it onto "key" in manifest.json.
- Load the extension again in the browser and copy the new given id.
- Go to Google Cloud, create a new project to enable the Google Drive API.
- Setup an OAuth Consent Screen. 
- Add your account at Test users.
- Under APIs & Services create an OAuth Client ID. Choose 
     - Application type: Chrome App and enter the extension's id in Application ID.
    - Add to manifest.json:
"oauth2": {
    "client_id": "",
    "scopes":["https://www.googleapis.com/auth/drive.file"]
}
    - Copy the OAuth Client ID and paste it into "client_id".
    - Put the cloudbackup.js file in your extension scripts folder and add <script src="scripts/cloudbackup.js"></script> in movies.html

## Video

<!-- <video src="video/moviewatchlist.mp4"> -->

