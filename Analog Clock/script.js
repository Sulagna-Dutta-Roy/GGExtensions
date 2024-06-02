const hourElement = document.querySelector(".hour")
const minuteElement = document.querySelector(".minute")
const secondElement = document.querySelector(".second")

console.log(hourElement);

function updateClock(){

    const currentDate = new Date();
    console.log(currentDate)

    // setTimeout(updateClock,1000);   Approach-01(using timeout method)

    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();

    const hourDegree = (hour / 12) *360;
    hourElement.style.transform = `rotate(${hourDegree}deg)`

    const minuteDegree = (minute / 60) *360;
    minuteElement.style.transform = `rotate(${minuteDegree}deg)`

    const secondDegree = (second / 60) *360;
    secondElement.style.transform = `rotate(${secondDegree}deg)`
}

// updateClock();   Approach-01

// Approach-02 >>>>>>>( using setInterval Method() )
setInterval(updateClock,1000);