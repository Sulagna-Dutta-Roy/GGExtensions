<!DOCTYPE html>
<html>
<head>
  <title>Basic Frogger HTML Game</title>
  <meta charset="UTF-8">
  <style>
  html, body {
    height: 100%;
    margin: 0;
  }

  body {
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
</head>
<body>
<canvas width="624" height="720" id="game"></canvas>
<script>
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 48;
const gridGap = 10;

// a simple sprite prototype function
function Sprite(props) {
  // shortcut for assigning all object properties to the sprite
  Object.assign(this, props);
}
Sprite.prototype.render = function() {
  context.fillStyle = this.color;

  // draw a rectangle sprite
  if (this.shape === 'rect') {
    // by using a size less than the grid we can ensure there is a visual space
    // between each row
    context.fillRect(this.x, this.y + gridGap / 2, this.size, grid - gridGap);
  }
  // draw a circle sprite. since size is the diameter we need to divide by 2
  // to get the radius. also the x/y position needs to be centered instead of
  // the top-left corner of the sprite
  else {
    context.beginPath();
    context.arc(
      this.x + this.size / 2, this.y + this.size / 2,
      this.size / 2 - gridGap / 2, 0, 2 * Math.PI
    );
    context.fill();
  }
}

const frogger = new Sprite({
  x: grid * 6,
  y: grid * 13,
  color: 'greenyellow',
  size: grid,
  shape: 'circle'
});
const scoredFroggers = [];

// a pattern describes each obstacle in the row
const patterns = [
  // end bank is safe
  null,

  // log
  {
    spacing: [2],      // how many grid spaces between each obstacle
    color: '#c55843',  // color of the obstacle
    size: grid * 4,    // width (rect) / diameter (circle) of the obstacle
    shape: 'rect',     // shape of the obstacle (rect or circle)
    speed: 0.75        // how fast the obstacle moves and which direction
  },

  // turtle
  {
    spacing: [0,2,0,2,0,2,0,4],
    color: '#de0004',
    size: grid,
    shape: 'circle',
    speed: -1
  },

  // long log
  {
    spacing: [2],
    color: '#c55843',
    size: grid * 7,
    shape: 'rect',
    speed: 1.5
  },

  // log
  {
    spacing: [3],
    color: '#c55843',
    size: grid * 3,
    shape: 'rect',
    speed: 0.5
  },

  // turtle
  {
    spacing: [0,0,1],
    color: '#de0004',
    size: grid,
    shape: 'circle',
    speed: -1
  },

  // beach is safe
  null,

  // truck
  {
    spacing: [3,8],
    color: '#c2c4da',
    size: grid * 2,
    shape: 'rect',
    speed: -1
  },

  // fast car
  {
    spacing: [14],
    color: '#c2c4da',
    size: grid,
    shape: 'rect',
    speed: 0.75
  },

  // car
  {
    spacing: [3,3,7],
    color: '#de3cdd',
    size: grid,
    shape: 'rect',
    speed: -0.75
  },

  // bulldozer
  {
    spacing: [3,3,7],
    color: '#0bcb00',
    size: grid,
    shape: 'rect',
    speed: 0.5
  },

  // car
  {
    spacing: [4],
    color: '#e5e401',
    size: grid,
    shape: 'rect',
    speed: -0.5
  },

  // start zone is safe
  null
];

// rows holds all the sprites for that row
const rows = [];
for (let i = 0; i < patterns.length; i++) {
  rows[i] = [];

  let x = 0;
  let index = 0;
  const pattern = patterns[i];

  // skip empty patterns (safe zones)
  if (!pattern) {
    continue;
  }

  // allow there to be 1 extra pattern offscreen so the loop is seamless
  // (especially for the long log)
  let totalPatternWidth =
    pattern.spacing.reduce((acc, space) => acc + space, 0) * grid +
    pattern.spacing.length * pattern.size;
  let endX = 0;
  while (endX < canvas.width) {
    endX += totalPatternWidth;
  }
  endX += totalPatternWidth;

  // populate the row with sprites
  while (x < endX) {
    rows[i].push(new Sprite({
      x,
      y: grid * (i + 1),
      index,
      ...pattern
    }));

    // move the next sprite over according to the spacing
    const spacing = pattern.spacing;
    x += pattern.size + spacing[index] * grid;
    index = (index + 1) % spacing.length;
  }
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the game background
  // water
  context.fillStyle = '#000047';
  context.fillRect(0, grid, canvas.width, grid * 6);

  // end bank
  context.fillStyle = '#1ac300';
  context.fillRect(0, grid, canvas.width, 5);
  context.fillRect(0, grid, 5, grid);
  context.fillRect(canvas.width - 5, grid, 5, grid);
  for (let i = 0; i < 4; i++) {
    context.fillRect(grid + grid * 3 * i, grid, grid * 2, grid);
  }

  // beach
  context.fillStyle = '#8500da';
  context.fillRect(0, 7 * grid, canvas.width, grid);

  // start zone
  context.fillRect(0, canvas.height - grid * 2, canvas.width, grid);

  // update and draw obstacles
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    for (let i = 0; i < row.length; i++) {
      const sprite = row[i]
      sprite.x += sprite.speed;
      sprite.render();

      // loop sprite around the screen
      // sprite is moving to the left and goes offscreen
      if (sprite.speed < 0 && sprite.x < 0 - sprite.size) {

        // find the rightmost sprite
        let rightMostSprite = sprite;
        for (let j = 0; j < row.length; j++) {
          if (row[j].x > rightMostSprite.x) {
            rightMostSprite = row[j];
          }
        }

        // move the sprite to the next spot in the pattern so it continues
        const spacing = patterns[r].spacing;
        sprite.x =
          rightMostSprite.x + rightMostSprite.size +
          spacing[rightMostSprite.index] * grid;
        sprite.index = (rightMostSprite.index + 1) % spacing.length;
      }

      // sprite is moving to the right and goes offscreen
      if (sprite.speed > 0 && sprite.x > canvas.width) {

        // find the leftmost sprite
        let leftMostSprite = sprite;
        for (let j = 0; j < row.length; j++) {
          if (row[j].x < leftMostSprite.x) {
            leftMostSprite = row[j];
          }
        }

        // move the sprite to the next spot in the pattern so it continues
        const spacing = patterns[r].spacing;
        let index = leftMostSprite.index - 1;
        index = index >= 0 ? index : spacing.length - 1;
        sprite.x = leftMostSprite.x - spacing[index] * grid - sprite.size;
        sprite.index = index;
      }
    }
  }

  // draw frogger
  frogger.x += frogger.speed || 0;
  frogger.render();

  // draw scored froggers
  scoredFroggers.forEach(frog => frog.render());

  // check for collision with all sprites in the same row as frogger
  const froggerRow = frogger.y / grid - 1 | 0;
  let collision = false;
  for (let i = 0; i < rows[froggerRow].length; i++) {
    let sprite = rows[froggerRow][i];

    // axis-aligned bounding box (AABB) collision check
    // treat any circles as rectangles for the purposes of collision
    if (frogger.x < sprite.x + sprite.size - gridGap &&
        frogger.x + grid - gridGap > sprite.x &&
        frogger.y < sprite.y + grid &&
        frogger.y + grid > sprite.y) {
      collision = true;

      // reset frogger if got hit by car
      if (froggerRow > rows.length / 2) {
        frogger.x = grid * 6;
        frogger.y = grid * 13;
      }
      // move frogger along with obstacle
      else {
        frogger.speed = sprite.speed;
      }
    }
  }

  if (!collision) {
    // if fogger isn't colliding reset speed
    frogger.speed = 0;

    // frogger got to end bank (goal every 3 cols)
    const col = (frogger.x + grid / 2) / grid | 0;
    if (froggerRow === 0 && col % 3 === 0 &&
        // check to see if there isn't a scored frog already there
        !scoredFroggers.find(frog => frog.x === col * grid)) {
      scoredFroggers.push(new Sprite({
        ...frogger,
        x: col * grid,
        y: frogger.y + 5
      }));
    }

    // reset frogger if not on obstacle in river
    if (froggerRow < rows.length / 2 - 1) {
      frogger.x = grid * 6;
      frogger.y = grid * 13;
    }
  }
}

// listen to keyboard events to move frogger
document.addEventListener('keydown', function(e) {
  // left arrow key
  if (e.which === 37) {
    frogger.x -= grid;
  }
  // right arrow key
  else if (e.which === 39) {
    frogger.x += grid;
  }

  // up arrow key
  else if (e.which === 38) {
    frogger.y -= grid;
  }
  // down arrow key
  else if (e.which === 40) {
    frogger.y += grid;
  }

  // clamp frogger position to stay on screen
  frogger.x = Math.min( Math.max(0, frogger.x), canvas.width - grid);
  frogger.y = Math.min( Math.max(grid, frogger.y), canvas.height - grid * 2);
});

// start the game
requestAnimationFrame(loop);
</script>
</body>
</html>
