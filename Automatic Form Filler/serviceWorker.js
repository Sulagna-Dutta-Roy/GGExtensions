const getCurrentTab = async()=>{
    const tabQuery = {active:true, lastFocusedWindow:true}
    const [tab] = await chrome.tabs.query(tabQuery);
    return tab
}

//get the form data based on the type of input for both valid and invalid data.
const getFormData = async(forms, response)=>{
    const tab = await getCurrentTab();
    const locallyStoredForms = (await chrome.storage.sync.get(tab.url))[tab.url];
    if(forms.metaData==="validData"){
        const validData = {}
        for(const form in forms.result){
            //add the user defined form data if it exists for a given form ID.
            if(forms.storedForms.includes(form)){
                validData[form] = locallyStoredForms[form];
                continue;
            }
            const inputData = {}
            const checkboxNames =  {}
            const radioButtonNames = {} 

            //add the valid data along with the id to the validData object.
            Object.entries(forms.result[form]).forEach(([id, type])=>{
                if(typeof type === "object" && type.name==="number"){
                    const validNumber = type.min+ 12;
                    inputData[id] = validNumber 
                }else{
                    switch(type){
                        case "text":
                            inputData[id] = "loreum ipsum";
                            break;
                        case "number":
                            inputData[id] = parseInt(Math.random()*347837382743947+1);
                            break;
                        case "email":
                            inputData[id] = "test@test.com"
                            break;
                        case "password":
                            inputData[id] = "34^8fjdksf%jD&FA$SDF"
                            break;
                        case "radio":
                            if(radioButtonNames[id.replace(/,.*/, "")]===undefined){
                                inputData[id] = true;
                                radioButtonNames[id.replace(/,.*/, "")] = true 
                            }
                            break;
                        case "checkbox":
                            if(checkboxNames[id.replace(/,.*/, "")]===undefined){
                                inputData[id] = true;
                                checkboxNames[id.replace(/,.*/, "")] =true 
                            }
                            break;
                    }
                }
            })
            validData[form] = inputData;
        }
        response(validData)
    }

    if(forms.metaData==="invalidData"){
        const invalidData = {}
        for(const form in forms.result){
            const inputData = {}

            //in the case of invalid data add the invalid data to the invalidData object.
            Object.entries(forms.result[form]).forEach(([id, type])=>{
                if(typeof type === "object" && type.name==="number"){
                    const valueAboveMax = type.max +1;
                    const valueBelowMin = type.min -1;
                    inputData[id] = parseInt(Math.random()*2)===0?valueAboveMax:valueBelowMin;
                }else{
                    switch(type){
                        case "text":
                            inputData[id] = parseInt(Math.random()*347837382743947+1);
                            break;
                        case "number":
                            inputData[id] = 432483748;
                            break;
                        case "email":
                            inputData[id] = "dfjksjkdatjfskjdotcom"
                            break;
                        case "password":
                            inputData[id] = "1234" 
                            break;
                        case "radio":
                            inputData[id] =false;
                            break;
                        case "checkbox":
                            inputData[id] = false;
                            break;
                    }
                }
            })
            invalidData[form] = inputData;
        }
        response(invalidData)
    }
} 

chrome.runtime.onMessage.addListener((forms, sender, response)=>{
    getFormData(forms, response)
    return true
})