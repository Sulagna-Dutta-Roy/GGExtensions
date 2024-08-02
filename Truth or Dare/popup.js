const truths = [
    "What is your biggest fear?",
    "What is your most embarrassing moment?",
    "What is your biggest regret?",
    "What is the most childish thing you still do?",
    "Have you ever lied to get out of a situation?",
    "What is the worst gift you have ever received?",
    "Have you ever cheated on a test?",
    "What is the most embarrassing thing you've ever done in public?",
    "What is the one secret you have never told anyone?",
    "What was your worst date ever?",
    "What is the most trouble you have ever gotten into?",
    "Who is your secret crush?",
    "What is the most ridiculous thing you have ever bought?",
    "What is your biggest insecurity?",
    "Have you ever broken a law?",
    "What is the most bizarre dream you've ever had?",
    "What is something you're glad your family doesn't know about you?",
    "Have you ever secretly disliked a gift you received?",
    "What is the most awkward conversation you've ever had?",
    "What is the scariest thing that ever happened to you?",
    "Have you ever been caught doing something you shouldn't have?",
    "What is a secret you've kept from your parents?",
    "What is the silliest thing you have an emotional attachment to?",
  ];
  
  const dares = [
    "Sing a song loudly.",
    "Do a silly dance.",
    "Imitate a celebrity.",
    "Act like a monkey for 1 minute.",
    "Do 10 pushups.",
    "Talk in a funny accent for the next 3 rounds.",
    "Wear socks on your hands until the next turn.",
    "Pretend to be a waiter/waitress and take snack orders from everyone in the group.",
    "Spin around 10 times and try to walk in a straight line.",
    "Let the person to your left draw on your face with a pen.",
    "Do an impression of your favorite celebrity.",
    "Post an embarrassing photo of yourself online.",
    "Attempt to juggle 3 items chosen by the group.",
    "Speak in a high-pitched voice until your next turn.",
    "Do an impression of someone until another player can guess who you are.",
    "Try to lick your elbow.",
    "Let another player redo your hairstyle.",
    "Hold your breath for 10 seconds.",
    "Do your best fish face.",
    "Dance with no music for 1 minute.",
    "Talk without closing your mouth.",
    "Do 15 jumping jacks."
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
  