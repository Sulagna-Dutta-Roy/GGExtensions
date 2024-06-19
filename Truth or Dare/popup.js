const truths = [
    "What is your biggest fear?",
    "What is your most embarrassing moment?",
    "What is your biggest regret?",
    "What is the most childish thing you still do?",
    "Have you ever lied to get out of a situation?"
  ];
  
  const dares = [
    "Sing a song loudly.",
    "Do a silly dance.",
    "Imitate a celebrity.",
    "Act like a monkey for 1 minute.",
    "Do 10 pushups."
  ];
  
  document.getElementById('startButton').addEventListener('click', () => {
    const choice = Math.random() < 0.5 ? 'Truth' : 'Dare';
    let resultText;
  
    if (choice === 'Truth') {
      const truth = truths[Math.floor(Math.random() * truths.length)];
      resultText = `Truth: ${truth}`;
    } else {
      const dare = dares[Math.floor(Math.random() * dares.length)];
      resultText = `Dare: ${dare}`;
    }
  
    document.getElementById('result').innerText = resultText;
  });

  document.getElementById('resetButton').addEventListener('click', () => {
    document.getElementById('result').innerText = '';
  });
  