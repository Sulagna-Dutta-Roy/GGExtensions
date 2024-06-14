   // document
   var d = document;

   // build deck
   var deck = [];

   // build suits
   var suits = [];
   suits['spades'] = [
      // spades
      ['A','spade'],
      ['2','spade'],
      ['3','spade'],
      ['4','spade'],
      ['5','spade'],
      ['6','spade'],
      ['7','spade'],
      ['8','spade'],
      ['9','spade'],
      ['10','spade'],
      ['J','spade'],
      ['Q','spade'],
      ['K','spade']
   ];
   suits['hearts'] = [
      // hearts
      ['A','heart'],
      ['2','heart'],
      ['3','heart'],
      ['4','heart'],
      ['5','heart'],
      ['6','heart'],
      ['7','heart'],
      ['8','heart'],
      ['9','heart'],
      ['10','heart'],
      ['J','heart'],
      ['Q','heart'],
      ['K','heart']
   ];
   suits['diamonds'] = [
      // diamonds
      ['A','diamond'],
      ['2','diamond'],
      ['3','diamond'],
      ['4','diamond'],
      ['5','diamond'],
      ['6','diamond'],
      ['7','diamond'],
      ['8','diamond'],
      ['9','diamond'],
      ['10','diamond'],
      ['J','diamond'],
      ['Q','diamond'],
      ['K','diamond']
   ];
   suits['clubs'] = [
      // clubs
      ['A','club'],
      ['2','club'],
      ['3','club'],
      ['4','club'],
      ['5','club'],
      ['6','club'],
      ['7','club'],
      ['8','club'],
      ['9','club'],
      ['10','club'],
      ['J','club'],
      ['Q','club'],
      ['K','club']
   ];

   // build stock pile
   var s = [];

   // build waste pile
   var w = [];

   // build foundations
   var spades = [];
   var hearts = [];
   var diamonds = [];
   var clubs = [];

   // build tableau
   var t = [];
   t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = [];

   // build table
   var table = [];
   table['stock'] = s;
   table['waste'] = w;
   table['spades'] = spades;
   table['hearts'] = hearts;
   table['diamonds'] = diamonds;
   table['clubs'] = clubs;
   table['tab'] = t;

   // initial face up cards
   var playedCards =
   '#waste .card,' +
   '#fnd .card,' +
   '#tab .card:last-child';

   // cache selectors
   var $timer = d.querySelector('#score .timer');
   var $timerSpan = d.querySelector('#score .timer span');
   var $moveCount = d.querySelector('#score .move-count');
   var $moveCountSpan = d.querySelector('#score .move-count span');
   var $score = d.querySelector('#score .score');
   var $scoreSpan = d.querySelector('#score .score span');
   var $playPause = d.querySelector('#play-pause');
   var $table = d.querySelector('#table');
   var $upper = d.querySelector('#table .upper-row');
   var $lower = d.querySelector('#table .lower-row');
   var $stock = d.querySelector('#stock');
   var $waste = d.querySelector('#waste');
   var $fnd = d.querySelector('#fnd');
   var $tab = d.querySelector('#tab');
   var $autoWin = d.querySelector('#auto-win');

   // other global vars
   var clock = 0;
   var time = 0;
   var moves = 0;
   var score = 0;
   var bonus = 0;
   var lastEventTime = 0;
   var unplayedTabCards = [];

// 1. CREATE DECK
   deck = create(deck, suits);

// 2. SHUFFLE DECK
   deck = shuffle(deck);

// 3. DEAL DECK
   table = deal(deck, table);

// 4. RENDER TABLE
   render(table, playedCards);

// 5. START GAMEPLAY
   play(table);

// ### EVENT HANDLERS ###
   window.onresize = function(event) {
      sizeCards();
   };

// ### FUNCTIONS ###

   // create deck
      function create(deck, suits) {
         console.log('Creating Deck...');
         // loop through each suit
         for (var suit in suits) {
            suit = suits[suit];
            // loop through each card in suit
            for (var card in suit) {
               card = suit[card];
               deck.push(card); // push card to deck
            }
         }
         return deck;
      }

   // shuffle deck
      function shuffle(deck) {
         console.log('Shuffling Deck...');
         // declare vars
         var i = deck.length, temp, rand;
         // while there remain elements to shuffle
         while (0 !== i) {
            // pick a remaining element
            rand = Math.floor(Math.random() * i);
            i--;
            // and swap it with the current element
            temp = deck[i];
            deck[i] = deck[rand];
            deck[rand] = temp;
         }
         return deck;
      }

   // deal deck
      function deal(deck, table) {
         console.log('Dealing Deck...');
         // move all cards to stock
         table['stock'] = deck;
         // build tableau
            var tabs = table['tab'];
            // loop through 7 tableau rows
            for (var row = 1; row <= 7; row++) {
               // loop through 7 piles in row
               for (var pile = row; pile <= 7; pile++) {
                  // build blank pile on first row
                  if (row === 1) tabs[pile] = [];
                  // deal card to pile
                  move(table['stock'], tabs[pile], false);
               }
            }
         return table;
      }

   // move card
      function move(source, dest, pop, selectedCards = 1) {
         if (pop !== true) {
            var card = source.shift(); // take card from bottom
            dest.push(card); // push card to destination pile
         } else {
            while (selectedCards) {
               // take card from the top of selection
               var card = source[source.length - selectedCards];
               // remove it from the selected pile
               source.splice(source.length - selectedCards, 1);
               // put it in the destination pile
               dest.push(card);
               // decrement
               selectedCards--; 
            }
         }
         return;
      }

   // render table
      function render(table, playedCards) {
         console.log('Rendering Table...');

         // check for played cards
         playedCards = checkForPlayedCards(playedCards);

         // check for empty piles
         emptyPiles = checkForEmptyPiles(table);

         // update stock pile
         update(table['stock'], '#stock ul', playedCards, true);
         // update waste pile
         update(table['waste'], '#waste ul', playedCards);
         // update spades pile
         update(table['spades'], '#spades ul', playedCards);
         // update hearts pile
         update(table['hearts'], '#hearts ul', playedCards);
         // update diamonds pile
         update(table['diamonds'], '#diamonds ul', playedCards);
         // update clubs pile
         update(table['clubs'], '#clubs ul', playedCards);
         // update tableau
         var tabs = table['tab'];
         // loop through tableau piles
         for (var i = 1; i <= 7; i++) {
            // update tableau pile
            update(tabs[i], '#tab li:nth-child('+i+') ul', playedCards, true);
         }

         // get unplayed tab cards
         unplayedTabCards = getUnplayedTabCards();

         // size cards
         sizeCards();

         // show table
         $table.style.opacity = '100';

         console.log('Table Rendered:', table);
         return;
      }

   // update piles
      function update(pile, selector, playedCards, append) {
         var e = d.querySelector(selector);
         var children = e.children; // get children
         var grandParent = e.parentElement.parentElement; // get grand parent
         // reset pile
         e.innerHTML = '';
         // loop through cards in pile
         for (var card in pile) {
            card = pile[card];
            // get html template for card
            var html = getTemplate(card);
            // create card in pile
            createCard(card, selector, html, append);
         }
         // turn cards face up
         flipCards(playedCards, 'up');
         // count played cards
         var played = countPlayedCards(children);
         e.parentElement.dataset.played = played;
         // count all played cards for #tab and #fnd piles
         if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
            var playedAll = parseInt(grandParent.dataset.played);
            if ( isNaN(playedAll) ) playedAll = 0;
            grandParent.dataset.played = playedAll + played;
         }
         // count unplayed cards
         var unplayed = countUnplayedCards(children);
         e.parentElement.dataset.unplayed = unplayed;
         // count all unplayed cards for #tab and #fnd piles
         if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
            var unplayedAll = parseInt(grandParent.dataset.unplayed);
            if ( isNaN(unplayedAll) ) unplayedAll = 0;
            grandParent.dataset.unplayed = unplayedAll + unplayed;
         }
         return pile;
      }

   // get html template for card
      function getTemplate(card) {
         var r = card[0]; // get rank
         var s = card[1]; // get suit
         // get html template
         var html = d.querySelector('.template li[data-rank="'+r+'"]').innerHTML;
         // search and replace suit variable
         html = html.replace('{{suit}}', s);
         return html;
      }

   // create card in pile
      function createCard(card, selector, html, append) {
         var r = card[0]; // get rank
         var s = card[1]; // get suit
         // get pile based on selector
         if ( selector.includes('#stock') ) var p = 'stock';
         if ( selector.includes('#waste') ) var p = 'waste';
         if ( selector.includes('#spades') ) var p = 'spades';
         if ( selector.includes('#hearts') ) var p = 'hearts';
         if ( selector.includes('#diamonds') ) var p = 'diamonds';
         if ( selector.includes('#clubs') ) var p = 'clubs';
         if ( selector.includes('#tab') ) var p = 'tab';
         var e = d.createElement('li'); // create li element
         e.className = 'card'; // add .card class to element
         e.dataset.rank = r; // set rank atribute
         e.dataset.suit = s; // set suit attribute
         e.dataset.pile = p; // set pile attribute;
         e.dataset.selected = 'false'; // set selected attribute
         e.innerHTML = html; // insert html to element
         // query for pile
         var pile = d.querySelector(selector);
         // append to pile
         if (append) pile.appendChild(e);
         // or prepend to pile
         else pile.insertBefore(e, pile.firstChild);
         return;
      }

   // check for played cards
      function checkForPlayedCards(playedCards) {
         // query
         var els = d.querySelectorAll('.card[data-played="true"]');
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) {
               var r = e.dataset.rank;
               var s = e.dataset.suit;
               playedCards += ', .card[data-rank="'+r+'"][data-suit="'+s+'"]' ;
            }
         }
         return playedCards;
      }

   // check for empty piles
      function checkForEmptyPiles(table) {
         // reset empty data on all piles
         var els = d.querySelectorAll('.pile'); // query elements
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) {
               delete e.dataset.empty;
            }
         }
         // declare var with fake pile so we always have one
         var emptyPiles = '#fake.pile';
         // check spades pile
         if ( table['spades'].length === 0 ) {
            emptyPiles += ', #fnd #spades.pile';
         }
         // check hearts pile
         if ( table['hearts'].length === 0 ) {
            emptyPiles += ', #fnd #hearts.pile';
         }
         // check diamonds pile
         if ( table['diamonds'].length === 0 ) {
            emptyPiles += ', #fnd #diamonds.pile';
         }
         // check clubs pile
         if ( table['clubs'].length === 0 ) {
            emptyPiles += ', #fnd #clubs.pile';
         }
         // check tableau piles
         var tabs = table['tab'];
            // loop through tableau piles
            for (var i = 1; i <= 7; i++) {
               // check tabeau pile
               if ( tabs[i].length === 0 ) {
                  emptyPiles += ', #tab li:nth-child('+i+').pile';
               }
            }
         // mark piles as empty
         els = d.querySelectorAll(emptyPiles); // query elements
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) {
               e.dataset.empty = 'true'; // mark as empty
            }
         }
         return emptyPiles;
      }

   // count played cards
      function countPlayedCards(cards) {
         var played = 0;
            // loop through cards
            for (var card in cards) {
               card = cards[card];
               if (card.nodeType) {
                  // check if card has been played
                  if (card.dataset.played === 'true') played++;
               }
            }
         return played;
      }

   // count unplayed cards
      function countUnplayedCards(cards) {
         var unplayed = 0;
            // loop through cards
            for (var card in cards) {
               card = cards[card];
               if (card.nodeType) {
                  // check if card has been played
                  if (card.dataset.played !== 'true') unplayed++;
               }
            }
         return unplayed;
      }

   // flip cards
      function flipCards(selectors, direction) {
         var els = d.querySelectorAll(selectors); // query all elements
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) {
               switch(direction) {
                  case 'up' :
                     if (e.dataset.played !== 'true') {
                        // if flipping over tableau card
                        if (e.dataset.pile === 'tab') {
                           // loop through unplayed cards
                           for (var card in unplayedTabCards) {
                              card = unplayedTabCards[card];
                              // if rank and suit matches
                              if (  e.dataset.rank === card[0] &&
                                    e.dataset.suit === card[1] )
                              // score 5 points
                              updateScore(5);
                           }
                        }
                        e.className += ' up'; // add class
                        e.dataset.played = 'true'; // mark as played
                     }
                     break;
                  case 'down' :
                     e.className = 'card'; // reset class
                     delete e.dataset.played; // reset played data attribute
                  default : break;
               }
            }
         }
         return;
      }

   // get face down cards in tableau pile
      function getUnplayedTabCards() {
         // reset array
         unplayedTabCards = [];
         // get all face down card elements
         var els = d.querySelectorAll('#tab .card:not([data-played="true"])');
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) {
               unplayedTabCards.push( [ e.dataset.rank, e.dataset.suit ] );
            }
         }
         return unplayedTabCards;
      }

   // size cards
      function sizeCards(selector = '.pile', ratio = 1.4) {
         var s = selector;
         var r = ratio;
         var e = d.querySelector(s); // query element
         var h = e.offsetWidth * r; // get height of element
         // set row heights
         $upper.style.height = h + 10 + 'px';
         $lower.style.height = h + 120 + 'px';
         // set height of elements
         var els = d.querySelectorAll(s); // query all elements
         for (var e in els) { // loop through elements
            e = els[e];
            if (e.nodeType) e.style.height = h + 'px'; // set height in css
         }
      }

   // gameplay
      function play(table) {
         // check for winning table
         if ( checkForWin(table) ) return;
         // check for autowin
         checkForAutoWin(table);
         // bind click events
         bindClick(
            '#stock .card:first-child,' +
            '#waste .card:first-child,' +
            '#fnd .card:first-child,' +
            '#tab .card[data-played="true"]'
         );
         // bind dbl click events
         bindClick(
            '#waste .card:first-child,' +
            '#tab .card:last-child',
            'double'
         );
         console.log('Make Your Move...');
         console.log('......');
      }

   // bind click events
      function bindClick(selectors, double) {
         var elements = d.querySelectorAll(selectors); // query all elements
         // loop through elements
         for (var e in elements) {
            e = elements[e];
            // add event listener
            if (e.nodeType) {
               if (!double) e.addEventListener('click', select);
               else e.addEventListener('dblclick', select);
            }
         }
         return;
      }

   // unbind click events
      function unbindClick(selectors, double) {
         var elements = d.querySelectorAll(selectors); // query all elements
         // loop through elements
         for (var e in elements) {
            e = elements[e];
            // remove event listener
            if (e.nodeType) {
               if (!double) e.removeEventListener('click', select);
               else e.removeEventListener('dblclick', select);
            }
         }
         return;
      }

   // on click handler: select
      var clicks = 0; // set counter for counting clicks
      var clickDelay = 200; // set delay for double click
      var clickTimer = null; // set timer for timeout function
      function select(event) {

         // prevent default
         event.preventDefault();

         // start timer
         if ( $timer.dataset.action !== 'start' ) {
            timer('start');
         }

         // if timestamp matches then return false
         var time = event.timeStamp; // get timestamp
         if ( time === lastEventTime ) {
            console.log('Status: Timestamp Matches, False Click');
            return false;
         }
         else {
            lastEventTime = time; // cache timestamp
         }

         // get variables
         var e = event.target; // get element
         var isSelected = e.dataset.selected; // get selected attribute
         var rank = e.dataset.rank; // get rank attribute
         var suit = e.dataset.suit; // get suit attribute
         var pile = e.dataset.pile; // get pile attribute
         var action = e.dataset.action; // get action attribute

         // create card array
         if (rank && suit) var card = [rank,suit];

         // count clicks
         clicks++;

         // single click
         if (clicks === 1 && event.type === 'click') {
            clickTimer = setTimeout(function() {
               console.log('Single Click Detected', event);

               // reset click counter
               clicks = 0;

               // if same card is clicked
               if (e.dataset.selected === 'true') {
                  console.log('Status: Same Card Clicked');
                  // deselect card
                  delete e.dataset.selected;
                  delete $table.dataset.move;
                  delete $table.dataset.selected;
                  delete $table.dataset.source;
                  console.log('Card Deselected', card, e);
               }

               // if move is in progress
               else if ($table.dataset.move) {
                  console.log('Status: A Move Is In Progess');
                  // get selected
                  var selected = $table.dataset.selected.split(',');
                  // update table dataset with destination pile
                  $table.dataset.dest = e.closest('.pile').dataset.pile;
                  // get destination card or pile
                  if ( card ) var dest = card;
                  else var dest = $table.dataset.dest;
                  // validate move
                  if ( validateMove(selected, dest) ) {
                     // make move
                     makeMove();
                     reset(table);
                     render(table, playedCards);
                     play(table);
                  } else {
                     console.log('Move is Invalid. Try again...');
                     reset(table);
                     render(table, playedCards);
                     play(table);
                     console.log('Card Deselected', card, e);
                  }
               }

               // if stock is clicked
               else if (pile === 'stock') {
                  console.log('Status: Stock Pile Clicked');
                  // if stock isn't empty
                  if (table['stock'].length) {
                     // move card from stock to waste
                     move(table['stock'], table['waste']);
                     reset(table);
                     render(table, playedCards);
                     // if empty, then bind click to stock pile element
                     if (table['stock'].length === 0) bindClick('#stock .reload-icon');
                     // count move
                     countMove(moves++);
                     // return to play
                     play(table);
                  }
               }

               // if stock reload icon is clicked
               else if (action === 'reload') {
                  console.log('Reloading Stock Pile');
                  // remove event listener
                  unbindClick('#stock .reload-icon');
                  // reload stock pile
                  if (table['waste'].length) {
                     table['stock'] = table['waste']; // move waste to stock
                     table['waste'] = [] // empty waste
                  }
                  // render table
                  render(table, playedCards);
                  // turn all stock cards face down
                  flipCards('#stock .card', 'down');
                  // update score by -100 pts
                  updateScore(-100);
                  // return to play
                  play(table);
               }

               // if no move is in progress
               else {
                  // select card
                  e.dataset.selected = 'true';
                  $table.dataset.move = 'true';
                  $table.dataset.selected = card;
                  $table.dataset.source = e.closest('.pile').dataset.pile;
                  // if ace is selected
                  if (rank === 'A') {
                     console.log('Ace Is Selected');
                     bindClick('#fnd #'+suit+'s.pile[data-empty="true"]');
                  }
                  if (rank === 'K') {
                     console.log('King Is Selected');
                     bindClick('#tab .pile[data-empty="true"]');
                  }
               }

            }, clickDelay);
         }

         // double click
         else if (event.type === 'dblclick') {
            console.log('Double Click Detected', event);
            clearTimeout(clickTimer); // prevent single click
            clicks = 0; // reset click counter
            // select card
            e.dataset.selected = 'true';
            $table.dataset.move = 'true';
            $table.dataset.selected = card;
            $table.dataset.source = e.closest('.pile').dataset.pile;
            // get destination pile
            if ( card) var dest = card[1]+'s';
            // update table dataset with destination
            $table.dataset.dest = dest;
            // validate move
            if ( validateMove(card, dest) ) {
               // make move
               makeMove();
               reset(table);
               render(table, playedCards);
               play(table);
            } else {
               console.log('Move is Invalid. Try again...');
               reset(table);
               render(table, playedCards);
               play(table);
               console.log('Card Deselected', card, e);
            }

         }

      }

   // validate move
      function validateMove(selected, dest) {
         console.log ('Validating Move...', selected, dest);

         // if selected card exists
         if (selected) {
            var sRank = parseRankAsInt(selected[0]);
            var sSuit = selected[1];
         }

         // if destination is another card
         if (dest.constructor === Array) {
            console.log('Desitination appears to be a card');
            var dRank = parseRankAsInt(dest[0]);
            var dSuit = dest[1];
            var dPile = $table.dataset.dest;
            // if destination pile is foundation
            if (['spades','hearts','diamonds','clubs'].indexOf(dPile) >= 0) {
               // if rank isn't in sequence then return false
               if (dRank - sRank !== -1) {
                 console.log('Rank sequence invalid');
                 console.log(dRank - sRank)
                 return false;
               }
               // if suit isn't in sequence then return false
               if ( sSuit !== dSuit ) {
                  console.log('Suit sequence invalid');
                  return false;
               }
            }
            // if destination pile is tableau
            else {
               // if rank isn't in sequence then return false
               if (dRank - sRank !== 1) {
                 console.log('Rank sequence invalid');
                 return false;
               }
               // if suit isn't in sequence then return false
               if ( ( (sSuit === 'spade' || sSuit === 'club') &&
                  (dSuit === 'spade' || dSuit === 'club') ) ||
                  ( (sSuit === 'heart' || sSuit === 'diamond') &&
                  (dSuit === 'heart' || dSuit === 'diamond') ) ) {
                 console.log('Suit sequence invalid');
                 return false;
               }
            }
            // else return true
            console.log('Valid move');
            return true;

         }

         // if destination is foundation pile
         if (['spades','hearts','diamonds','clubs'].indexOf(dest) >= 0) {
            console.log('Destination appears to be empty foundation');

            // get last card in destination pile
            var lastCard = d.querySelector('#'+dest+' .card:first-child');
            if (lastCard) {
               var dRank = parseRankAsInt(lastCard.dataset.rank);
               var dSuit = lastCard.dataset.suit;
            }
            // if suit doesn't match pile then return false
            if ( sSuit + 's' !== dest ) {
               console.log('Suit sequence invalid');
               return false;
            }
            // if rank is ace then return true
            else if ( sRank === 1 ) {
               console.log('Valid Move');
               return true;
            }
            // if rank isn't in sequence then return false
            else if ( sRank - dRank !== 1 ) {
               console.log('Rank sequence invalid');
               return false;
            }
            // else return true
            else {
               console.log('Valid move');
               return true;
            }
         }

         // if destination is empty tableau pile
         if ( dest >= 1 && dest <= 7 ) {
            console.log('Destination appears tp be empty tableau');
            return true;
         }

      }

   // make move
      function makeMove() {
         console.log('Making Move...');

         // get source and dest
         var source = $table.dataset.source;
         var dest = $table.dataset.dest;
         console.log('From '+source+' pile to '+dest+' pile');

         // if pulling card from waste pile
         if ( source === 'waste') {
            // if moving card to foundation pile
            if ( isNaN(dest) ) {
               console.log('Moving To Foundation Pile');
               move(table[source], table[dest], true);
               updateScore(10); // score 10 pts
            }
            // if moving card to tableau pile
            else {
               console.log('Moving To Tableau Pile');
               move(table[source], table['tab'][dest], true);
               updateScore(5); // score 5 pts
            }
         }

         // if pulling card from foundation pile
         else if (['spades','hearts','diamonds','clubs'].indexOf(source) >= 0) {
            // only allow moves to tableau piles
            if ( isNaN(dest) ) {
               console.log('That move is not allowed');
               return false;
            }
            // if moving card to tableau pile
            else {
               console.log('Moving To Tableau Pile');
               move(table[source], table['tab'][dest], true);
               updateScore(-15); // score -15 pts
            }
         }

         // if pulling card from tableau pile
         else {
            // if moving card to foundation pile
            if ( isNaN(dest) ) {
               console.log('Moving To Foundation Pile');
               move(table['tab'][source], table[dest], true);
               updateScore(10); // score 10 pts
            }
            // if moving card to tableau pile
            else {
               console.log('Moving To Tableau Pile');
               // get selected card
               var selected = d.querySelector('.card[data-selected="true"');
               // get cards under selected card
               var selectedCards = [selected];
               while ( selected = selected['nextSibling'] ) {
                  if (selected.nodeType) selectedCards.push(selected);
               }
               // move card(s)
               move(
                  table['tab'][source],
                  table['tab'][dest],
                  true,
                  selectedCards.length
               );
            }
         }

         // unbind click events
         unbindClick(
            '#stock .card:first-child,' +
            '#waste .card:first-child,' +
            '#fnd .card:first-child,' +
            '#fnd #spades.pile[data-empty="true"],' +
            '#fnd #hearts.pile[data-empty="true"],' +
            '#fnd #diamonds.pile[data-empty="true"],' +
            '#fnd #clubs.pile[data-empty="true"],' +
            '#tab .card[data-played="true"],' +
            '#tab .pile[data-empty="true"]'
         );
         // unbind double click events
         unbindClick(
            '#waste .card:first-child' +
            '#tab .card:last-child',
            'double'
         )

         // count move
         countMove(moves++);

         // reset table
         console.log('Ending Move...');

         return;
      }

   // parse rank as integer
      function parseRankAsInt(rank) {
         // assign numerical ranks to letter cards
         switch (rank) {
            case 'A' : rank = '1'; break;
            case 'J' : rank = '11'; break;
            case 'Q' : rank = '12'; break;
            case 'K' : rank = '13'; break;
            default : break;
         }
         // return integer value for rank
         return parseInt(rank);
      }

   // parse integer as rank
      function parseIntAsRank(int) {
         // parse as integer
         rank = parseInt(int);
         // assign letter ranks to letter cards
         switch(rank) {
            case 1 : rank = 'A'; break;
            case 11 : rank = 'J'; break;
            case 12 : rank = 'Q'; break;
            case 13 : rank = 'K'; break;
            default : break;
         }
         return rank;
      }

   // reset table
      function reset(table) {
         delete $table.dataset.move;
         delete $table.dataset.selected;
         delete $table.dataset.source;
         delete $table.dataset.dest;
         delete $fnd.dataset.played;
         delete $fnd.dataset.unplayed;
         delete $tab.dataset.played;
         delete $tab.dataset.unplayed;
         console.log('Table reset');
      }

   // timer funcion
      function timer(action) {
         // declare timer vars
         var minutes = 0;
         var seconds = 0;
         var gameplay = d.body.dataset.gameplay;
         // set timer attribute
         $timer.dataset.action = action;
         // switch case
         switch (action) {
            // start timer
            case 'start' :
               console.log('Starting Timer...');
               // looping function
               clock = setInterval(function() {
                  // increment
                  time++;
                  // parse minutes and seconds
                  minutes = parseInt(time / 60, 10);
                  seconds = parseInt(time % 60, 10);
                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;
                  // output to display
                  $timerSpan.textContent = minutes + ':' + seconds;
                  // if 10 seconds has passed decrement score by 2 pts
                  if ( time % 10 === 0 ) updateScore(-2);
               }, 1000);
               // add dataset to body
               d.body.dataset.gameplay = 'active';
               // unbind click to play button
               if ( gameplay === 'paused')
               $playPause.removeEventListener('click', playTimer);
               // bind click to pause button
               $playPause.addEventListener('click', pauseTimer = function(){
                  timer('pause');
               });
            break;
            // pause timer
            case 'pause' :
               console.log('Pausing Timer...');
               clearInterval(clock);
               d.body.dataset.gameplay = 'paused';
               // unbind click to pause button
               if ( gameplay === 'active')
               $playPause.removeEventListener('click', pauseTimer);
               // bind click tp play button
               $playPause.addEventListener('click', playTimer = function(){
                  timer('start');
               });
            break;
            // stop timer
            case 'stop' :
               console.log('Stoping Timer...');
               clearInterval(clock);
               d.body.dataset.gameplay = 'over';
            break;
            // default
            default : break;
         }
         console.log(time);
         return;
      }

   // move counter
      function countMove(moves) {
         console.log('Move Counter', moves);
         // set move attribute
         $moveCount.dataset.moves = moves + 1;
         // output to display
         $moveCountSpan.textContent = moves + 1;
         return;
      }

   // scoring function
      /*
         Standard scoring is determined as follows:
         - Waste to Tableau  5
         - Waste to Foundation  10
         - Tableau to Foundation   10
         - Turn over Tableau card  5
         - Foundation to Tableau   −15
         - Recycle waste when playing by ones  −100
         (minimum score is 0)

         Moving cards directly from the Waste stack to a Foundation awards 10 points. However, if the card is first moved to a Tableau, and then to a Foundation, then an extra 5 points are received for a total of 15. Thus in order to receive a maximum score, no cards should be moved directly from the Waste to Foundation.

         For every 10 seconds of play, 2 points are taken away. Bonus points are calculated with the formula of 700,000 / (seconds to finish) if the game takes more than 30 seconds. If the game takes less than 30 seconds, no bonus points are awarded.
      */
      function updateScore(points) {
         console.log('Updating Score', points);
         // get score
         score = parseInt($score.dataset.score) + points;
         // set minimum score to 0
         score = score < 0 ? 0 : score;
         // parse as integer
         score = parseInt(score);
         // set score attribute
         $score.dataset.score = score;
         // output to display
         $score.children[1].textContent = score;
         return score;
      }

   // calculate bonus points
      function getBonus() {
         if (time >= 30) bonus = parseInt(700000 / time);
         console.log(bonus);
         return bonus;
      }

   // check for win
      function checkForWin(table) {
         // if all foundation piles are full
         if (  table['spades'].length +
               table['hearts'].length +
               table['diamonds'].length +
               table['clubs'].length
               === 52 ) {
            console.log('Game Has Been Won');
            // stop timer
            timer('stop');
            // bonus points for time
            updateScore(getBonus());
            // throw confetti
            throwConfetti();
            // return true
            return true;
         }
         else return false;
      }

   // check for auto win
      function checkForAutoWin(table) {
         // if all tableau cards are played and stock is empty
         if (  parseInt($tab.dataset.unplayed) +
               table['stock'].length +
               table['waste'].length === 0) {
            // show auto win button
            $autoWin.style.display = 'block';
            // bind click to auto win button
            $autoWin.addEventListener('click', autoWin);
         }
         return;
      }

   // auto win
      function autoWin() {
         console.log('Huzzah!');
         // hide auto win button
         $autoWin.style.display = 'none';
         // unbind click to auto win button
         $autoWin.removeEventListener('click', autoWin);
         // unbind click events
         unbindClick(
            '#stock .card:first-child,' +
            '#waste .card:first-child,' +
            '#fnd .card:first-child,' +
            '#fnd #spades.pile[data-empty="true"],' +
            '#fnd #hearts.pile[data-empty="true"],' +
            '#fnd #diamonds.pile[data-empty="true"],' +
            '#fnd #clubs.pile[data-empty="true"],' +
            '#tab .card[data-played="true"],' +
            '#tab .pile[data-empty="true"]'
         );
         // unbind double click events
         unbindClick(
            '#waste .card:first-child' +
            '#tab .card:last-child',
            'double'
         );
         // reset table
         reset(table);
         render(table);
         // animate cards to foundation piles
         autoWinAnimation(table);
         // stop timer
         timer('stop');
         // bonus points for time
         updateScore(getBonus());
      }

   // auto win animation
      function autoWinAnimation(table) {
         // set number of iterations
         var i = parseInt($tab.dataset.played);
         // create animation loop
         function animation_loop() {
            // get lowest ranking card
               var bottomCards = []; // create array for the bottom cards
               var els = d.querySelectorAll('#tab .card:last-child');
               for (var e in els) { // loop through elements
                  e = els[e];
                  if (e.nodeType)
                     bottomCards.push( parseRankAsInt(e.dataset.rank) );
               }
               // get the lowest rank from array of bottom cards
               var lowestRank = Math.min.apply(Math, bottomCards);
               // parse integer as rank
               var rank = parseIntAsRank(lowestRank);
               // get element with rank
               var e = d.querySelector('#tab .card[data-rank="'+rank+'"]');

            // setup move
               // get suit of card
               var suit = e.dataset.suit;
               // create card array with rank and suit
               var card = [rank, suit];
               // get destination pile
               var dest = suit+'s';

            // make move
               if ( validateMove(card, dest) ) {
                  // set source pile
                  var pile = e.parentElement.parentElement;
                  $table.dataset.source = pile.dataset.pile;
                  // set dest pile
                  $table.dataset.dest = dest;
                  // make move
                  makeMove();
                  reset(table);
                  render(table, playedCards);
               } else {
                  console.log('Move is Invalid. Try again...');
                  reset(table);
                  render(table, playedCards);
               }
            // let's do it again in 100ms
            setTimeout(function() {
               i--;
               if (i !== 0) animation_loop();
               // at the end lets celebrate!
               else throwConfetti();
            }, 100);
         };
         // run animation loop
         animation_loop();
      }

   // throw confetti
      /* Thanks to @gamanox
         https://codepen.io/gamanox/pen/FkEbH
      */
      function throwConfetti() {
         console.log('Confetti!');

         var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, drawCircle2, drawCircle3, i, range, xpos;

         NUM_CONFETTI = 60;

         COLORS = [[255, 255, 255], [255, 144, 0], [255, 255, 255], [255, 144, 0], [0, 277, 235]];

         PI_2 = 2 * Math.PI;

         canvas = d.getElementById("confetti");

         context = canvas.getContext("2d");

         window.w = 0;

         window.h = 0;

         window.resizeWindow = function() {
            window.w = canvas.width = window.innerWidth;
            return window.h = canvas.height = window.innerHeight;
         };

         window.addEventListener('resize', resizeWindow, false);

         window.onload = function() {
            return setTimeout(resizeWindow, 0);
         };

         range = function(a, b) {
            return (b - a) * Math.random() + a;
         };

         drawCircle = function(x, y, r, style) {
            context.beginPath();
            context.moveTo(x, y);
            context.bezierCurveTo(x - 17, y + 14, x + 13, y + 5, x - 5, y + 22);
            context.lineWidth = 3;
            context.strokeStyle = style;
            return context.stroke();
         };

         drawCircle2 = function(x, y, r, style) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + 10, y + 10);
            context.lineTo(x + 10, y);
            context.closePath();
            context.fillStyle = style;
            return context.fill();
         };

         drawCircle3 = function(x, y, r, style) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + 10, y + 10);
            context.lineTo(x + 10, y);
            context.closePath();
            context.fillStyle = style;
            return context.fill();
         };

         xpos = 0.9;

         d.onmousemove = function(e) {
            return xpos = e.pageX / w;
         };

         window.requestAnimationFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                  return window.setTimeout(callback, 100 / 20);
            };
         })();

         Confetti = (function() {
            function Confetti() {
               this.style = COLORS[~~range(0, 5)];
               this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
               this.r = ~~range(2, 6);
               this.r2 = 2 * this.r;
               this.replace();
            }

            Confetti.prototype.replace = function() {
               this.opacity = 0;
               this.dop = 0.03 * range(1, 4);
               this.x = range(-this.r2, w - this.r2);
               this.y = range(-20, h - this.r2);
               this.xmax = w - this.r;
               this.ymax = h - this.r;
               this.vx = range(0, 2) + 8 * xpos - 5;
               return this.vy = 0.7 * this.r + range(-1, 1);
            };

            Confetti.prototype.draw = function() {
               var ref;
               this.x += this.vx;
               this.y += this.vy;
               this.opacity += this.dop;
               if (this.opacity > 1) {
                 this.opacity = 1;
                 this.dop *= -1;
               }
               if (this.opacity < 0 || this.y > this.ymax) {
                 this.replace();
               }
               if (!((0 < (ref = this.x) && ref < this.xmax))) {
                 this.x = (this.x + this.xmax) % this.xmax;
               }
               drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
               drawCircle3(~~this.x * 0.5, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
               return drawCircle2(~~this.x * 1.5, ~~this.y * 1.5, this.r, this.rgb + "," + this.opacity + ")");
            };

            return Confetti;

         })();

         confetti = (function() {
            var j, ref, results;
            results = [];
            for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
               results.push(new Confetti);
            }
            return results;
         })();

         window.step = function() {
            var c, j, len, results;
            requestAnimationFrame(step);
            context.clearRect(0, 0, w, h);
            results = [];
            for (j = 0, len = confetti.length; j < len; j++) {
               c = confetti[j];
               results.push(c.draw());
            }
            return results;
         };

         step();

         // fix initial bug when firing
         resizeWindow();

         // fade in
         canvas.style.opacity = 0;
         var tick = function() {
            canvas.style.opacity = +canvas.style.opacity + 0.01;
            if ( +canvas.style.opacity < 1 ) {
               ( window.requestAnimationFrame &&
                 requestAnimationFrame(tick) ) ||
               setTimeout(tick, 100)
            }
         };
         tick();

      }
