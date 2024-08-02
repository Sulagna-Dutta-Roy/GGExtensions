chrome.runtime.onConnect.addListener((port)=>{
    if(port.name==="popup"){
        port.onMessage.addListener((message)=>{
            
            //hightlight the selected forms and remove highlight from unselected forms
            if(message.metaData==="form"){
               const { data } = message
               if(!data) return;
               data.selected.forEach((formId)=>{
                const form = document.querySelector("#" + formId)
                form.style.border = "2px dashed #87ff1f"
               })
               data.unselected.forEach((formId)=>{
                const form = document.querySelector("#" + formId)
                form.style.border = "none"
               })
               return
            }
            
            //fill the data for each selected form
            if(message.metaData==="fillData"){
                const {formData} = message
                for(const formId in formData){
                    for(const [id, data] of Object.entries(formData[formId])){
                        if(data===true){
                            const input = document.querySelector(`#${formId} #${id.replace(/.*,/, "")}`)
                            input.checked = true;
                            continue
                        }
                        if(data===false){
                            const input = document.querySelector(`#${formId} #${id.replace(/.*,/, "")}`)
                            input.checked = false;
                            continue
                        }
                        const input = document.querySelector(`#${formId} #${id}`)
                        input.value = data;
                    }
                }
            }
        })
    }
})