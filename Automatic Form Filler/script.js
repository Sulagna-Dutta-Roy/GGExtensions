//Script file for the popup html page

//global variables

const validDataButton = document.querySelector(".valid-data")
const invalidDataButton = document.querySelector(".invalid-data")
const saveDataButton = document.querySelector(".save-data")

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

let tab
let port 
(async ()=>{
    tab= await getCurrentTab();
    port= chrome.tabs.connect(tab.id, {name:"popup"})
})();


//get form id from the current page
const getForms = ()=>{
    const formElements = document.querySelectorAll("form")
    const forms =[] 
    for(let i=0;i<formElements.length;i++){
        forms[i] = formElements[i].id
    }
    return forms
}

//get input fields for the selected forms
const getInputFields= (selected)=>{
    const allForms ={} 
    selected.forEach(formId=>{
        const inputs = document.querySelectorAll("#" + formId + " input")
        const inputsObject= {};
        const RadioNames = {}
        inputs.forEach(input=>{
            if(input.type==="number" && input.max!=="" && input.min!==""){
                inputsObject[input.id] = {name:input.type, max:parseInt(input.max), min:parseInt(input.min)}
            }
            else if(input.type==="radio"){
                if(RadioNames[input.name]===undefined){
                    inputsObject[input.name + "," + input.id] = input.type
                    RadioNames[input.name] = true;
                }
            }
            else if(input.type==="checkbox"){
                    inputsObject[input.name + "," + input.id] = input.type
            }
            else{
                inputsObject[input.id] = input.type
            }
        })
        allForms[formId] = inputsObject 
    })
    return allForms
}

//get input data of the selected forms for user defined data
const getInputData = (selected)=>{
    let allForms={}
    selected.forEach(formId=>{
        const inputs = document.querySelectorAll("#" + formId + " input")
        const inputsData= {};
        inputs.forEach(input=>{
            if(input.type==="radio" || input.type==="checkbox"){
                if(input.checked === true)
                    inputsData[input.name + "," + input.id] = true 
                else
                    inputsData[input.name + "," + input.id] = false
            }else{
                inputsData[input.id] = input.value;
            }
        })
        allForms[formId] = inputsData 
    })
    return allForms;
}

//get the selected forms from the extension popup
const getSelectedForm = (className)=>{
    const checkboxes = document.querySelectorAll("." + className)
    const allCheckboxes = {selected:[], unselected:[]}
    checkboxes.forEach((checkbox)=>{
        if(checkbox.checked===true){
            allCheckboxes.selected.push(checkbox.id.replace("stored-", ""))
            return
        }
        allCheckboxes.unselected.push(checkbox.id)
    })
    return allCheckboxes; 
}

//outline the forms on that need to be filled on the webpage
const outlineForms= async ()=>{
    const allForms = getSelectedForm("form_checkbox")
    port.postMessage({metaData:"form", data:allForms})
}

//display form ids on the popup window.
const displayForms = async()=>{
    const tab =await getCurrentTab()
    const forms = await chrome.scripting.executeScript({
        target:{tabId:tab.id},
        func:getForms
    })
    let checklist = ``
    const formList = document.querySelector(".forms-list")

    let isFirstElement = true
    for(const form of forms[0].result){
        if(isFirstElement){
            const checkboxhtml= `
            <p>
                <input type="checkbox" checked class="form_checkbox" id="${form}" title="select form"/>
                <label for="${form}">${form}</label>
            </p>\n
            `
            checklist += checkboxhtml
            isFirstElement = false
            continue
        }
        const checkboxhtml= `
        <p>
            <input type="checkbox" class="form_checkbox" title="select form" id="${form}" />
            <label for=${form}>${form}</label>
        </p>\n
        `
        checklist += checkboxhtml
    }
    formList.insertAdjacentHTML("beforeend", checklist) 
    const checkboxes = document.querySelectorAll(".form_checkbox")
    checkboxes.forEach((checkbox)=>{
        checkbox.addEventListener("input", (e)=>{
            outlineForms()
        })
    })
}

//display the stored data on the popup window
const displayStoredData = (data, wipe)=>{
    const dataListWrapper = document.querySelector(".data-list-wrapper")
    dataListWrapper.style.display="block";
    const dataList = document.querySelector(".data-list")
    if(wipe) dataList.innerHTML = "";
    let checklist = ``
    for(const form in data){
        const checkboxhtml= `
        <p>
            <div class="stored-form-wrapper">
                <div>
                    <input type="checkbox" class="form-stored_checkbox" id="stored-${form}" title="select this saved form" />
                    <label for=stored-${form}>${form}</label>
                </div>
                <div>
                    <button class="delete-saved-form" title="delete form" id="${form}-button">✖</button>
                </div>
            </div>
        </p>\n
        `
        checklist += checkboxhtml
    }
    dataList.insertAdjacentHTML("beforeend", checklist) 
    const deleteSavedBtn = document.querySelector(".delete-saved-form")
    if(deleteSavedBtn){
        deleteSavedBtn.addEventListener("click",async(e)=>{
            const form = e.target.id.replace("-button", "")
            const locallyStoredForms = (await chrome.storage.sync.get(tab.url))[tab.url]
            delete locallyStoredForms[form]
            await chrome.storage.sync.set({[tab.url]:locallyStoredForms})
            dataList.innerHTML=""
            if(JSON.stringify(locallyStoredForms)==="{}"){
                dataListWrapper.style.display="none";
                return
            }
            displayStoredData(locallyStoredForms)
        })
    }
}


//setup the popup on load
window.addEventListener("load", async()=>{
    
    await displayForms();
    await outlineForms();
    const savedData = await chrome.storage.sync.get(tab.url);
    if(JSON.stringify(savedData[tab.url])!=="{}"){
        displayStoredData(savedData[tab.url]) 
       return
    }
    document.querySelector(".data-list-wrapper").style.display="none";
})

//event listeners for the buttons on the popup window
validDataButton.addEventListener("click", async ()=>{
    const forms= getSelectedForm("form_checkbox");
    const storedFormsIDs = getSelectedForm("form-stored_checkbox").selected
    const formsAndInputs= await chrome.scripting.executeScript({
        target: {tabId:tab.id},
        func:getInputFields,
        args:[forms.selected]
    })
    formsAndInputs[0].metaData = "validData"
    formsAndInputs[0].storedForms = storedFormsIDs;
    chrome.runtime.sendMessage(formsAndInputs[0], (response)=>{
        port.postMessage({metaData:"fillData", formData:response})
    })
})

invalidDataButton.addEventListener("click", async()=>{
    const forms= getSelectedForm("form_checkbox");
    const formsAndInputs= await chrome.scripting.executeScript({
        target: {tabId:tab.id},
        func:getInputFields,
        args:[forms.selected]
    })
    formsAndInputs[0].metaData = "invalidData"
    chrome.runtime.sendMessage(formsAndInputs[0], (response)=>{
        port.postMessage({metaData:"fillData", formData:response})
    })
})

saveDataButton.addEventListener("click", async()=>{
    const forms= getSelectedForm("form_checkbox");
    const formsAndInputs= await chrome.scripting.executeScript({
        target: {tabId:tab.id},
        func:getInputData,
        args:[forms.selected]
    })
    const prevData = (await chrome.storage.sync.get(tab.url))[tab.url]===undefined?{}:(await chrome.storage.sync.get(tab.url))[tab.url];
    for(const formId in formsAndInputs[0].result){
        prevData[formId] = formsAndInputs[0].result[formId]
    }
    await chrome.storage.sync.set({[tab.url]:prevData});
    displayStoredData(prevData, true)
})
