// Board and panel definitions
let board = [];
let panel = document.getElementsByName('panel');

// Panel movement direction
const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

// Panel image
let imageFile = ['p0.jpg', 'p2.jpg', 'p4.jpg', 'p8.jpg',
                 'p16.jpg', 'p32.jpg', 'p64.jpg', 'p128.jpg',
                 'p256.jpg', 'p512.jpg', 'p1024.jpg', 'p2048.jpg'];

// popup.html
// Called when popup.html is loaded.
window.onload = () => {
  if (loadBoard() == false){
    initBoard();
  }
  dispBoard();
}

// up
// Click method for up button.
document.getElementById('id_up').onclick = () => {
  onFling(UP);
}

// down
// Click method for down button.
document.getElementById('id_down').onclick = () => {
  onFling(DOWN);
}

// left
// Click method for left button.
document.getElementById('id_left').onclick = () => {
  onFling(LEFT);
}

// right
// Click method for right button.
document.getElementById('id_right').onclick = () => {
  onFling(RIGHT);
}

// restart
// Click method for restart button.
document.getElementById('id_restart').onclick = () => {
  initBoard();
  dispBoard();
}

let wait = false;


// Processing when the direction button is clicked.
//  If post-processing is scheduled, processing will be interrupted.
//  Pre-pack the panel.
//  Combine panels with the same value after pre-packing.
//  If there is a gap due to compositing, pre-pack it again.
//  Display the board.
//  Schedule post-processing after 1 second.
function onFling(direction){
  if (wait == true) return;
  prePackPanel(direction);
  combinePanel(direction);
  prePackPanel(direction);
  dispBoard();
  wait = true;
  // 1000
  // Execute afterOnFling() after 1000ms(1sec).
  setTimeout(afterOnFling, 1000); 
}

// Post-processing when the direction button is clicked.
function afterOnFling(){
  if (checkWin()){
    alert('You Win.');
    initBoard();
    dispBoard();
    wait = false;
  }
  else{
    setPanel();
    dispBoard();
    if (checkLoss()){
      // 1000
      // Execute afterOnFling() after 1000ms(1sec).
      setTimeout(youLoss, 1000); 
    }
    else{
      saveBoard();
      wait = false;
    }
  }
}

// When you lose.You need to separate the functions to see the losing board.
function youLoss(){
  alert('You Loss.');
  initBoard();
  dispBoard();
  wait = false;
}

// Initialize the board.
function initBoard(){
  for (let x = 0; x < 4; x++){
    board[x] = [];
    for (let y = 0; y < 4; y++){
      board[x][y] = 0;
    }
  }
  // for win test
  //  board[0][0] = 10;
  //  board[0][1] = 10;
  // for loss test
  //  board = [[0,2,3,4],[5,6,7,8],[9,2,3,4],[5,6,7,8]];
  setPanel();
  setPanel();
}

// Display the board.
function dispBoard(){
  for (let x = 0; x < 4; x++){
    for (let y = 0; y < 4; y++){
      panel[x * 4 + y].src = imageFile[board[x][y]];
    }
  }
}

// Pre-align the panel in the specified direction.
function prePackPanel(direction){
  let i = 0;
  if (direction == DOWN || direction == UP){
    for (let y = 0; y < 4; y++){
      let tmp = [0, 0, 0, 0];
      if (direction == DOWN){
        i = 3;
        for (let x = 3; x >= 0; x--){
          if (board[x][y] == 0){
            continue;
          }
          tmp[i--] = board[x][y];
        }
      }
      else{
        i = 0;
        for (let x = 0; x < 4; x++){
          if (board[x][y] == 0){
            continue;
          }
          tmp[i++] = board[x][y];
        }
      }
      for (let x = 0; x < 4; x++){
        board[x][y] = tmp[x];
      }
    }
  }
  else{
    for (let x = 0; x < 4; x++){
      let tmp = [0, 0, 0, 0];
      if (direction == RIGHT){
        i = 3;
        for (let y = 3; y >= 0; y--){
          if (board[x][y] == 0){
            continue;
          }
          tmp[i--] = board[x][y];
        }
      }
      else{
        i = 0;
        for (let y = 0; y < 4; y++){
          if (board[x][y] == 0){
            continue;
          }
          tmp[i++] = board[x][y];
        }
      }
      for (let y = 0; y < 4; y++){
        board[x][y] = tmp[y];
      }
    }
  }
}

// Combine the same panels.
function combinePanel(direction){
  if (direction == DOWN || direction == UP){
    for (let y = 0; y < 4; y++){
      if (direction == DOWN){
        for (let x = 3; x > 0; x--){
          if (board[x][y] == 0) continue;
          if (board[x][y] == board[x - 1][y]){
            board[x][y]++;
            board[x - 1][y] = 0;
          }
        }
      }
      else{
        i = 0;
        for (let x = 0; x < 3; x++){
          if (board[x][y] == 0) continue;
          if (board[x][y] == board[x + 1][y]){
            board[x][y]++;
            board[x + 1][y] = 0;
          }
        }
      }
    }
  }
  else{
    for (let x = 0; x < 4; x++){
      if (direction == RIGHT){
        for (let y = 3; y > 0; y--){
          if (board[x][y] == 0) continue;
          if (board[x][y] == board[x][y - 1]){
            board[x][y]++;
            board[x][y - 1]  = 0;
          }
        }
      }
      else{
        i = 0;
        for (let y = 0; y < 3; y++){
          if (board[x][y] == 0) continue;
          if (board[x][y] == board[x][y + 1]){
            board[x][y]++;
            board[x][y +1] = 0;
          }
        }
      }
    }
  }
}
// Change the randomly sampled blank panel to a 2 panel.
function setPanel(){
  let zeroX = [];
  let zeroY = [];
  for (let x = 0; x < 4; x++){
    for (let y = 0; y < 4; y++){
      if (board[x][y] == 0){
        zeroX.push(x);
        zeroY.push(y);
      }
    }
  }
  if (zeroX.length == 0) return;
  let i = Math.floor(Math.random()* zeroX.length);
  board[zeroX[i]][zeroY[i]] = 1;
}

// 
function checkWin(){
  for (let x = 0; x < 4; x++){
    for (let y = 0; y < 4; y++){
      if (board[x][y] == 11) return true;
    }
  }
  return false;
}

// 
function checkLoss(){
  for (let x = 0; x < 4; x++){
    for (let y = 0; y < 4; y++){
      if (board[x][y] == 0) return false;
    }
  }
  for (let i = 0; i < 4; i++){
    for (let j = 0; j < 3; j++){
      if (board[i][j] == board[i][j + 1]) return false;
      if (board[j][i] == board[j + 1][i]) return false;
    }
  }
  return true;
}


// Save the board.
function saveBoard(){
  localStorage['board'] = board;
}

// Load ths board.
function loadBoard(){
  let savedBoard = localStorage['board'];
  if (savedBoard == null) return false;
  savedBoard = savedBoard.split(',');
  let i = 0;
  for (let x = 0; x < 4; x++){
    board[x] = [];
    for (let y = 0; y < 4; y++){
      board[x][y] = savedBoard[i++];
    }
  }
  return true;
}