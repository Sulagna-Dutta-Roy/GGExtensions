/*-----------ONLOAD INITIALIZATION-----------*/
window.onload = function () {
    var c = document.querySelector("canvas");
    var canvas = document.querySelector("canvas");
    c.width = 800;
    c.height = 500;
    c = c.getContext("2d");

    /*-----------MOUSE/TOUCH & CONTROLS-----------*/
    //mouse and touch objects
    function startGame() {
        mouse = {
            x: innerWidth / 2,
            y: innerHeight - 33
        };

        touch = {
            x: innerWidth / 2,
            y: innerHeight - 33
        };

        //event listener for mouse object
        canvas.addEventListener("mousemove", function (event) {
            mouse.x = event.clientX;
            //mouse.y = event.clientY;
        });
        //eventListener for touch object
        canvas.addEventListener("touchmove", function (event) {
            var rect = canvas.getBoundingClientRect();
            var root = document.documentElement;
            var touch = event.changedTouches[0];
            var touchX = parseInt(touch.clientX);
            var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
            event.preventDefault();
            mouse.x = touchX;
            //mouse.y = touchY;
        });

        /*-----------GAME VARIABLES-----------*/
        //player
        var player_width = 32;
        var player_height = 32;
        var playerImg = new Image();
        var score = 0;
        var health = 100;

        function choosePlayer() {
            var orangeShip = "https://image.ibb.co/n8rayp/rocket.png";
            var blueShip = "https://image.ibb.co/dfbD1U/heroShip.png";
            var userInput = prompt("🚀SELECT BATTLESHIP!🚀\n1 is for orange and 2 is for blue ship", 1);
            if (userInput == 1) {
                playerImg.src = orangeShip;
            }
            else if (userInput == 2) {
                playerImg.src = blueShip;
            }
            else {
                playerImg.src = orangeShip;
            }
        } choosePlayer();

        //bullet array
        var _bullets = []; //array to hold n bullets
        var bullet_width = 6;
        var bullet_height = 8;
        var bullet_speed = 8;
        //enemy array
        var _enemies = []; //array to hold n enemies
        var enemyImg = new Image();
        enemyImg.src = "https://image.ibb.co/bX9UuU/ufo_1.png"; //"https://image.ibb.co/gi6ZpU/ufo.png";
        var enemy_width = 32;
        var enemy_height = 32;
        //health array
        var _healthkits = []; //array to hold n health kits
        var healthkitImg = new Image();
        healthkitImg.src = "https://image.ibb.co/iTrjuU/hospital.png";  //"https://image.ibb.co/gFvSEU/first_aid_kit.png";
        var healthkit_width = 32;
        var healthkit_height = 32;
        //sounds
        var shot = new Audio();
        shot.src = "https://www.dropbox.com/s/w70c8hyryak6w40/Laser-SoundBible.com-602495617.mp3?dl=0";

        /*-----------GAME OBJECTS-----------*/
        //Player object
        function Player(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            this.draw = function () {
                c.beginPath();
                c.drawImage(playerImg, mouse.x - player_width, mouse.y - player_height); //draw player and center cursor
            };

            this.update = function () {
                this.draw();
            };
        }

        //Bullet object
        function Bullet(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;

            this.draw = function () {
                c.beginPath();
                c.rect(this.x, this.y, this.width, this.height);
                c.fillStyle = "#fff";
                c.fill();
                c.stroke();
            };

            this.update = function () {
                this.y -= this.speed;
                this.draw();
            };
        }

        //Enemy object
        function Enemy(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;

            this.draw = function () {
                c.beginPath();
                c.drawImage(enemyImg, this.x, this.y);
            };

            this.update = function () {
                this.y += this.speed;
                this.draw();
            };
        }

        //Health kit object  
        function Healthkit(x, y, width, height, speed) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;

            this.draw = function () {
                c.beginPath();
                c.drawImage(healthkitImg, this.x, this.y);
            };

            this.update = function () {
                this.y += this.speed;
                this.draw();
            };
        }

        /*-----------_new OBJECT-----------*/
        //draw Player
        var __player = new Player(mouse.x, mouse.y, player_width, player_height);

        //draw n enemies into enemies array
        function drawEnemies() {
            for (var _ = 0; _ < 4; _++) { //enemy with random x axis, -32 as y axis, enemy_width, enemy_height, random speed  
                var x = Math.random() * (innerWidth - enemy_width);
                var y = -enemy_height; //-height to draw above canvas for smooth income
                var width = enemy_width;
                var height = enemy_height;
                var speed = Math.random() * 4.5;
                var __enemy = new Enemy(x, y, width, height, speed);
                _enemies.push(__enemy); //push enemy to my array of enemies
            }
        } setInterval(drawEnemies, 1234);


        //draw health kits
        function drawHealthkits() {
            for (var _ = 0; _ < 1; _++) { //health with random x axis, -32 as y axis, healthkit_width, healthkit_height, random speed  
                var x = Math.random() * (innerWidth - enemy_width);
                var y = -enemy_height; //-height to draw above canvas for smooth income
                var width = healthkit_width;
                var height = healthkit_height;
                var speed = Math.random() * 2.6;
                var __healthkit = new Healthkit(x, y, width, height, speed);
                _healthkits.push(__healthkit); //push healthkit to my array of healthkits
            }
        } setInterval(drawHealthkits, 15000);

        //draw bullet
        //var __bullet = new Bullet(mouse.x-bullet_width/2, mouse.y-player_height, bullet_width, bullet_height, bullet_speed);  

        //fire bullet function
        function fire() { //fire bullet from mouse.x on x axis, y axis, width, height, speed
            for (var _ = 0; _ < 1; _++) {
                var x = mouse.x - bullet_width / 2;
                var y = mouse.y - player_height;
                var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
                _bullets.push(__bullet); //push bullet to my array of bullets
                //shot.play();
            }
        } setInterval(fire, 200);

        //event listener for fire function
        canvas.addEventListener("click", function () {
            //fire();
        });

        /*-----------COLLISION DETECTION-----------*/
        function collision(a, b) {
            return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
        }
        /*-----------SCORE-----------*/
        c.fillStyle = "white";
        c.font = "1em Arial";

        /*-----------DIRTY ERROR HANDLING-----------*/
        function stoperror() {
            return true;
        }
        window.onerror = stoperror;

        /*-----------GAME LOOP-----------*/
        function animate() {
            requestAnimationFrame(animate); //animate
            c.beginPath(); //begin
            c.clearRect(0, 0, innerWidth, innerHeight); //clear canvas
            c.fillText("Health: " + health, 5, 20); //health
            c.fillText("Score: " + score, innerWidth - 100, 20); //score

            /*-----------__player, __bullet, __enemy update, __healthkit update-----------*/
            //update _player
            __player.update();
            //update bullets from bullets array
            for (var i = 0; i < _bullets.length; i++) {
                _bullets[i].update();
                if (_bullets[i].y < 0) {
                    _bullets.splice(i, 1);
                }
            }
            //update enemies from enemies array
            for (var k = 0; k < _enemies.length; k++) {
                _enemies[k].update();
                //if enemy is below canvas, delete it
                if (_enemies[k].y > innerHeight) {
                    _enemies.splice(k, 1);
                    health -= 10;
                    if (health == 0) {
                        alert("You DIED!\nYour score was " + score);
                        startGame();
                    }
                }
            }

            //loop over both enemies and bullets to detect collisions
            for (var j = _enemies.length - 1; j >= 0; j--) {
                for (var l = _bullets.length - 1; l >= 0; l--) {
                    if (collision(_enemies[j], _bullets[l])) {
                        _enemies.splice(j, 1);
                        _bullets.splice(l, 1);
                        score++;
                    }
                }
            }

            //draw healthkits
            for (var h = 0; h < _healthkits.length; h++) {
                _healthkits[h].update();
            }
            //loop over both healthkits and bullets to detect collisions
            for (var hh = _healthkits.length - 1; hh >= 0; hh--) {
                for (var hhh = _bullets.length - 1; hhh >= 0; hhh--) {
                    if (collision(_healthkits[hh], _bullets[hhh])) {
                        _healthkits.splice(hh, 1);
                        _bullets.splice(hhh, 1);
                        health += 10;
                    }
                }
            }

        } //animate func
        animate();
    } startGame();//startGame function starts/restarts game
}; //end of onload func