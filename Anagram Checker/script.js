function anagramChecker(){
  const word1 = document.querySelector('.js-word1').value.trim();
const word2 = document.querySelector('.js-word2').value.trim();

  let resultVal = document.querySelector('.js-result');

  if (word1 === '' && word2 === ''){
    resultVal.innerHTML = 'Please enter both words';
  }
  else if (word1 === ''){
    resultVal.innerHTML = 'Please enter word 1';
  }
  else if (word2 === ''){
    resultVal.innerHTML = 'Please enter word 2';
  }
  else{
    const newText1 = word1.toLowerCase().split('').sort().join('');
    const newText2 = word2.toLowerCase().split('').sort().join('');

    if(newText1 === newText2){
      resultVal.innerHTML = 'Anagrams';
      resultVal.style.color = 'green';
    }
    else{
      resultVal.innerHTML = 'Not Angrams';
      resultVal.style.color = 'red';
    }
  }
}

document.querySelector('.js-submit')
  .addEventListener('click', () => {
    anagramChecker();
  });