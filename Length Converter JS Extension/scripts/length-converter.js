function CalculateLength(){
    var fromLength = Number(document.getElementById("fromLength").value);

    if(ValidateLengthConverter(fromLength)){

        var fromUnit = document.getElementById("fromUnit").value;
        var toUnit = document.getElementById("toUnit").value;

        var outputLength = document.getElementById("outputLength");

 
        var result = ConvertLength(fromLength,fromUnit,toUnit);

        outputLength.value = result.toFixed(5);
        
    }
}

function ResetConverter(){
    if(confirm("Are you sure want to reset?")){
        document.getElementById("fromLength").value = "";
        document.getElementById("outputLength").value = "";
    }
}

function ConvertLength(fromLength,fromUnit,toUnit){
    fromLength = Number(fromLength);
    var inMillimeter = 0;
    var makeThisMillimeter = 0;
    var result;

    switch(fromUnit){
        case "Millimeter":
            makeThisMillimeter = 1;
            break;
        case "Centimeter":
            makeThisMillimeter = 10;
            break;
        case "Decimeter":
            makeThisMillimeter = 100;
            break;
        case "Meter":
            makeThisMillimeter = 1000;
            break;
        case "Kilometer":
            makeThisMillimeter = 1000000;
            break;
        case "Foot":
            makeThisMillimeter = 304.8;
            break;
        case "Inch":
            makeThisMillimeter = 25.4;
            break;
        case "Mile":
            makeThisMillimeter = 1609344;
            break;
        case "Yard":
            makeThisMillimeter = 914.4;
            break;
    }
    inMillimeter = fromLength * makeThisMillimeter;

    switch(toUnit){
        case "Millimeter":
            result = inMillimeter;
            break;
        case "Centimeter":
            result = inMillimeter / 10;
            break;
        case "Decimeter":
            result = inMillimeter / 100;
            break;
        case "Meter":
            result = inMillimeter / 1000;
            break;
        case "Kilometer":
            result = inMillimeter / 1000000;
            break;
        case "Foot":
            result = inMillimeter / 304.8;
            break;
        case "Inch":
            result = inMillimeter / 25.4;
            break;
        case "Mile":
            result = inMillimeter / 1609344;
            break;
        case "Yard":
            result = inMillimeter / 914.4;
            break;
    }
    return result;
}

function ValidateLengthConverter(fromLength){
    if(fromLength <= 0){

        _cmnShowErrorMessageBottomOfTheInputFiled("fromLength","Please enter the valid length")

        return false;
    }
    return true;
}