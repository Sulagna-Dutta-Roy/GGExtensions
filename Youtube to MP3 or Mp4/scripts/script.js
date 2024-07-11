// this is the main file , this is the start of the extension, if we want to do anything on the website we can't do that from here , we need content scripts for that , that run in the background ,they can work on the pages. 
// as soon as the extension is clicked mainfunction is called .
let messagesent=false;
mainfunction();
 

function mainfunction(){
    messagesent=false;
    let selection='mp3'; // for default selection
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');//this gets us the reference to both mp3 and mp4 checkbox

    //this below function will run for each on those references or checkboxes that we got , what it will do is that it will change the value of selection , lets say if you select mp4 , it will make that checked and uncheck mp3
    checkboxes.forEach(function(checkbox) {
        //below we are adding eventlistner to all the checkboxes for detecting change in them , if there is not change this won't execute
      checkbox.addEventListener('change', function() {//this function executes if there is change in any one checkbox
        if (this.checked) {//if the  change is that the checkbox got checked then the further code execute
            selection=checkbox.value;// Update selection when checkbox is checked
            // Uncheck other checkboxes if one got checked 
            checkboxes.forEach(function(otherCheckbox) {
                if (otherCheckbox !== checkbox) {//it go through all the checkboxes if at particular time one is same as the one that got changed ,do nothing otherwise make their checked value false , making them unchecked
                    otherCheckbox.checked = false;
                }
            });
        }
      });
    });
    
    // this is a query for the active tab in the current window , it will return the url and tab-id of the active tab to function(tabs)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let activeTab = tabs[0];//storing the current tabs data in activeTab
        let tabUrl = activeTab.url;//storing the present tabs url in taburl
        if (tabUrl.indexOf("youtube.com") === -1) {
            // If "youtube.com" string is not found, do nothing
            return;
        }
        
        //if we are at youtube below code executes after some time ,so that one have time to modify checkboxes
        setTimeout(() => {
    
            var urlToSwitchTo = 'https://utomp3.com/*';//this is the url that we want to switch to if current tab is youtube
            //this below query is to know if the website that we want to switch to is acitve 

            //this query will get the tabs that have the url equal to urlToSwitchTo into tabs parameter of function below
            chrome.tabs.query({url: urlToSwitchTo}, function(tabs) {
                if (tabs.length > 0) {
                    // Tab with the specified URL is already open, switch to it
                    chrome.tabs.update(tabs[0].id, {active: true}, function(second) {
                        //now we inject the script of this tab using executeScript , and in execution we send message to this script to use , such as file type that we want to download ,url of youtube to which we will switch back
                        chrome.tabs.executeScript(second.id, {file: "scripts/contentScript.js"}, function() {//first we executed 
                            chrome.tabs.sendMessage(second.id, { type: "urlData", url: tabUrl, selected:selection ,messagesent:messagesent});
                        });
                    });
                } else {
                    // Tab with the specified URL is not open, create a new tab and do all the opertions same as above
                    chrome.tabs.create({url: urlToSwitchTo}, function(newTab) {
                        // Send message to the content script of the new tab
                        setTimeout(() => {
                            chrome.tabs.executeScript(newTab.id, {file: "scripts/contentScript.js"}, function() {
                                setTimeout(() => {
                                     chrome.tabs.sendMessage(newTab.id, { type: "urlData", url: tabUrl , selected:selection ,messagesent:messagesent});
                                   }, 1500);//this timeout is to wair for executeScript to properly inject the script and then send message to it using sendMessage
                           });
                        }, 1500);// this timeout is to wait for creation of tab
                        
                     });
                }
            });
        }, 3000);//this time out is to decide after how long the extension switched 
        
       
    });
}





//this is to listen for messages from injected scripts to work accordingly
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // if message type is urlData means its from content script  and the download has been intitated now this message is so that we can switch back to the youtube website
    messagesent=message.messagesent;
    if (message.type === "urlData") {
        chrome.tabs.query({url: message.url}, function(tabs) {
            if (tabs.length > 0) {
                // Tab with the specified URL is already open, switch to it and the inject its script ytubes and send a message to it changetrack   
                chrome.tabs.update(tabs[0].id, {active: true}, function(second) {
                    // //below injects content script of the youtube after the tab is made active by above line
                    // if(messagesent)//this condition makes sure that only once the script executes and message is send , see the script executes first , it gets injected, then the code in function is executed , where message gets sent.
                    //     {
                            
                    //         chrome.tabs.executeScript(second.id, {file: "scripts/ytube.js"}, function() {
                    //         //below Sends message to the content script of the youtube
                    //         chrome.tabs.sendMessage(second.id, { type: "changetrack" , messagesent:messagesent});
                    //         messagesent=false;
                    //         });
                    //     }
                });
            }
           

        });
    }
    //this is to run the extension in loop , if ytube sends message changetrack , it means we want to run the extension again
    // if(message.type==="changetrack"){
    //     mainfunction();
    // }
});