## What is this extension?

This extension was developed to ease the form testing experience as developers may need to reenter forms again and again to test them. This extension makes it trivial to store form data and reuse it again and again. It also allows for insertion of dummy valid or invalid data. For now text, number, email, password, checkboxes and radio buttons are supported.

## Add to chrome

Steps:
- Download the zip file and extract it into any new folder.
- Click on extension icon from chrome.

![image](https://github.com/Stiffpixels/HootHoot/assets/32983571/a07bd6f2-e4e4-4094-bcde-e88d6415e564)

- Click on manage extensions.
- Turn on developer mode on the top right corner.
- Now click on load unpacked.

![image](https://github.com/Stiffpixels/HootHoot/assets/32983571/a969c8c5-f08b-47f4-b409-b9d55243d6d1)

- Go to the folder you extracted the zip file into and click on select folder.

![image](https://github.com/Stiffpixels/HootHoot/assets/32983571/fd6d58a4-e7ba-4d03-baf9-222d11430876)

- Now the extension is available in the extension tab.

![image](https://github.com/Stiffpixels/HootHoot/assets/32983571/b42b58b1-b436-4674-9fd9-ce5d7142f54f)


## Documentation

### Demo Video
[![Demo Video](https://img.youtube.com/vi/lt5AM4qV1Ks/0.jpg)](https://www.youtube.com/watch?v=lt5AM4qV1Ks)

**IMPORTANT POINTS**
- Make sure Each input has a unique id and the form also has a unique id.
- Make sure the number input has a max and min attribute so that invalid data can be more accurately generated.

### How to fill dummy invalid and valid data?

Steps:

1. Go to any website you want to test.
2. Open the extension popup to select all the forms you want to fill.
3. Click on invalid data or valid data as per the testing need.
4. Now the dummy data will be filled.

### How to fill saved data?

Steps:

1. Fill the data in the form you want to save.
2. Select the form you want to save.
3. Click on save data button.
4. Now close the popup and reopen it and your saved data should appear below saved data section associated with the form id of the data.
5. To fill the saved data select the form you want to fill and the saved data for that form (So the id of the selected and saved forms should be same).
6. Click on valid data button to fill your saved data.
7. Now the data should appear in the form.