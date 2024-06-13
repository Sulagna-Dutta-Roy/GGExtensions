document.getElementById('tossBtn').addEventListener('click', tossCoin);
const coin=document.getElementById('coin'),
      userSelect=document.getElementById('userSelect'),
      tail_selection=document.getElementById('tail_selection'),
      head_selection=document.getElementById('head_selection'),
      userChoices=document.getElementById('userChoice');
head_selection.addEventListener('click',()=>{
  userChoices.value="heads"
  userSelect.textContent="Head"
})
tail_selection.addEventListener('click',()=>{
  userChoices.value="tails"
  userSelect.textContent="Tail"
})
function tossCoin() {
  coin.classList.add('animation')
  var userChoice = document.getElementById('userChoice').value;
  var coinSide = Math.random() < 0.5 ? 'heads' : 'tails';
  var coinElement = document.getElementById('coin');
  var winnerText = document.getElementById('winnerText');
  setTimeout(()=>{
  coin.classList.remove('animation')
  if (userChoice === coinSide) {
    winnerText.textContent = "Winner: You!";
  } else {
    winnerText.textContent = "Winner: Computer!";
  }
  if( coinSide === 'heads'){coin.style.transform="rotateX(180deg)"; }
  else{coin.style.transform="rotateX(0deg)";}
},3000)
}
