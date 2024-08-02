function _cmnRemoveAllErrorMessage(){
    var allErrorBorder = document.getElementsByClassName('error-border');
    var allErrorMessage = document.getElementsByClassName('error-message');
    var i;

    for(i = (allErrorBorder.length) - 1; i>=0; i--){
        allErrorBorder[i].classList.remove("error-border");
    }

    for(i = (allErrorMessage.length) - 1; i>=0; i--){
        allErrorMessage[i].remove();
    }
}

function _cmnShowErrorMessageBottomOfTheInputFiled(fieldID,errorMessage){
    var inputField = document.getElementById(fieldID);
    inputField.classList.add("tool-error-border");
    inputField.focus();

    var errorMessageElement = document.createElement("p");
    errorMessageElement.innerHTML = errorMessage;
    errorMessageElement.classList.add("tool-error-message");
    inputField.parentNode.insertBefore(errorMessageElement, inputField.nextSibling);
}