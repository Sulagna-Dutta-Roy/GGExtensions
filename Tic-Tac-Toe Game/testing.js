const checkWinner = (f) => {
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let result = false;
const winnerTrigger=(s)=>{
    let j;
    if(s.every((j=index)=>field[j]==='y')){
        s.forEach(num => {
            // console.log(field.indexOf(num))
            console.log(field[num])
        });
        result = true;
        console.log(s)
    }
}
let possibleCombination;
const field = ['x','x','y',
               'x','x','y',
               'y','x','y'];
winConditions
.filter((combination) => combination.includes(f))
.some((possibleCombination = possibilities)=>
    possibleCombination.every((index)=>field[index]==='y'?winnerTrigger(possibleCombination):false)
);
return result;
};
console.log(checkWinner(8))