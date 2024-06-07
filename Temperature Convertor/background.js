let btn = document.querySelector("#convert_btn");
let fromSelect = document.querySelector("#from");
let toSelect = document.querySelector("#to");
let temp;
let ip;
let from = fromSelect.value;
let to = toSelect.value;
let result = document.querySelector(".result");
fromSelect.addEventListener("change", () => {
  from = fromSelect.value;

});
toSelect.addEventListener("change", () => {
  to = toSelect.value;
});
//convert input to a number

btn.addEventListener("click", (event) => {
  event.preventDefault();
   ip = parseFloat(document.querySelector(".input").value.trim());
   
  if (from === to) {
     results(ip);
     return;
  } else if (from === "C") {
    if (to === "F") {
      temp = (ip * 9) / 5 + 32;
      results(temp);
    } else if (to === "K") {
      temp = ip + 273.15;
      results(temp);
    }
  } else if (from === "F") {
    if (to === "C") {
      temp = ((ip - 32) * 5) / 9;
      results(temp);
    } else if (to === "K") {
      temp = ((ip - 32) * 5) / 9 + 273.15;
      results(temp);
    }
  } else if (from === "K") {
    if (to === "F") {
      temp = ((ip - 273.15) * 9) / 5 + 32;
      results(temp);
    
    } else if (to === "C") {
      temp = ip - 273.15;
      results(temp);
    }
  }
  

});

function results(temp){
    result.style.display="block";
    result.innerHTML=`${ip.toFixed(2)} ${from} is ${temp.toFixed(2)} ${to}`;
}
