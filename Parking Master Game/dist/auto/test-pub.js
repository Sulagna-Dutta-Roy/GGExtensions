  const uuid = PubNub.generateUUID();
  const pubnub = new PubNub({
    publishKey: "pub-c-44d0b197-2ebf-4ca0-941f-c6272ebb2901",
    subscribeKey: "sub-c-e609faec-1b29-11ec-9ca7-5693d1c31269",
    uuid: uuid
  });
  function message(c){
    pubnub.publish({
      channel : "pubnub_onboarding_channel",
      message : {"sender": uuid, "content": c}
    }, function(status, response) {
      document.write('<pre>'+response+'</pre>');
    });
  }

  pubnub.subscribe({
    channels: ['pubnub_onboarding_channel'],
    withPresence: true
  });
  function tag(t){
  return document.querySelector(t);
  }
  function cs(c){
  return document.querySelector('.'+c);
  }
  function id(i){
  return document.getElementById(i);
  }
  pubnub.addListener({
    message: function(e,y) {
      !y||y==null||y=='undefined'||message.arguments.length===1?id('message').textContent+=e.message.content:tag(y).textContent+=e.message.content;
    }
  });

  pubnub.history({
      channel: 'pubnub_onboarding_channel',
      count: 10,
      stringifiedTimeToken: true,
    },
    function(status, response) {
      let pElement = document.createElement('h3');
      pElement.appendChild(document.createTextNode('historical messages'));
      document.body.appendChild(pElement);
      pElement = document.createElement('ul');
      let msgs = response.messages;
      for (let i in msgs) {
        msg = msgs[i];
        let pElement = document.createElement('li');
        pElement.appendChild(document.createTextNode('sender: ' + msg.entry.sender + ', content: ' + msg.entry.content));
        document.body.appendChild(pElement);
      }
    }
  );
