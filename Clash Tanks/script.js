var w, h, k, xo, yo,
    units = [],
    icons = [],
    bullets = [],
    enemies = [],
    explosions = [],
    dif = [' practice', ' easy', ' medium', ' hard', ' harder', ' hardcore', ' pro', ' deathmatch', ' godlike', ' impossible'],
    gameTime = 0,
    isGameOver,
    nextwave = 0,
    enemydep = 1,
    firstwave = false,
    deployarea = false,
    counter = 0,
    counter2 = 0,
    gameNum = 0,
    game_paused = false,
    lvl = 0,     // 0...9
    inf = function () {
        var popup = document.getElementById('infdiv');
        var btn = document.getElementById('info');
        if (popup.style.display !== 'block') {
            popup.style.display = 'block';
            info.style.color = 'white';
            info.style.backgroundColor = 'red';
        }
        else {
            popup.style.display = 'none';
            info.style.color = 'red';
            info.style.backgroundColor = '#f3f3f3';
        }
    },
    changeLvl = function (op) {
        if (op == 1 && lvl < 9) {
            lvl++;
        }
        if (op == 0 && lvl > 0) {
            lvl--;
        }

        var _dif = document.getElementsByClassName("dif");
        _dif[1].innerHTML = dif[lvl];
    };



(function () {
    function Sprite(url, pos, size, resized, animspeed, frames, _index, once) {
        this.pos = pos;
        this.size = size;
        this.resized = resized;
        this.url = url;
        this.animspeed = animspeed;
        this.frames = frames;
        this._index = _index;
        this.once = once;
    }

    Sprite.prototype =
    {

        update: function (dt) {

            this._index += this.animspeed * dt;


        },



        render: function (ctx) {

            var frame;



            if (this.animspeed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index); frame = this.frames[idx % max];
                if (this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            x += frame * this.size[0]; ctx.drawImage(resources.get(this.url), x, y, this.size[0], this.size[1], 0, 0, this.resized[0], this.resized[1]);


        }


    };

    window.Sprite = Sprite;
})();

(function () {
    function Unit(status, pos, hp, speed, maxspeed, range, damage, reload, angle, defaultangle, dir, sprite) {
        this.status = status;
        this.pos = pos;
        this.hp = hp;
        this.maxhp = hp;
        this.speed = speed;
        this.maxspeed = maxspeed;
        this.range = range;
        this.damage = damage;
        this.reload = reload;
        this.angle = angle;
        this.defaultangle = defaultangle;
        this.dir = dir;
        this.sprite = sprite
    }

    Unit.prototype =
    {

        getAngle: function (target) {

            var x = this.pos[0] - target[0];
            var y = this.pos[1] - target[1];
            if (x < 0) {
                return Math.floor(Math.atan(y / x) * (180 / Math.PI));
            }
            else {
                return Math.floor(Math.atan(y / x) * (180 / Math.PI) - 180);
            }
        },

        moveAhead: function (dt) {
            var rad = this.angle / (180 / Math.PI);
            this.pos[0] += Math.cos(rad) * this.speed * dt * this.dir;
            this.pos[1] += Math.sin(rad) * this.speed * dt * this.dir;

        },

        findTarget: function (t) {
            for (i = 0; i < t.length; i++) {

                var dis = this.getDistance(t[i]);
                if (dis < this.range && !t[i].destroyed && t[i].time > 0.7 && t[i].pos[1] > k) {
                    this.target = t[i];
                    this.status = "targetfound";
                    return;
                }
            }

        },

        avoidCollision: function (list, ownindx, dt) {

            var l = list;

            for (i = 0; i < l.length; i++) {
                if (i == ownindx) continue;
                if (this.getDistance(l[i]) < k * 8) {
                    for (var sec = 2; sec > 0; sec--) {

                        var ownfuturepos = [this.pos[0] + (Math.cos(this.angle / (180 / Math.PI)) * this.speed * sec * this.dir), this.pos[1] + (Math.sin(this.angle / (180 / Math.PI)) * this.speed * sec * this.dir)];

                        var allyfuturepos = [l[i].pos[0] + (Math.cos(l[i].angle / (180 / Math.PI)) * l[i].speed * sec * this.dir), l[i].pos[1] + (Math.sin(l[i].angle / (180 / Math.PI)) * l[i].speed * sec * this.dir)];
                        if (getDistance(ownfuturepos, allyfuturepos) < k * 3 && this.pos[1] * this.dir > l[i].pos[1] * l[i].dir && Math.abs(ownfuturepos[0] - allyfuturepos[0]) < this.sprite.resized[0]) {
                            this.speed -= 160 / Math.pow(sec, 4) * dt;
                        }
                    }

                }
            }


        },

        getDistance: function (t) {

            return Math.floor(Math.sqrt(Math.pow(this.pos[0] - t.pos[0], 2) + Math.pow(this.pos[1] - t.pos[1], 2)));
        },

        fireOnTarget: function () {

            var x = Math.floor(this.pos[0] + ((this.sprite.resized[1] / 2 * this.dir) * Math.cos(this.angle / (180 / Math.PI))));
            var y = Math.floor(this.pos[1] + ((this.sprite.resized[0] / 2 * this.dir) * Math.sin(this.angle / (180 / Math.PI))));
            bullets.push(
                {
                    pos: [x, y],
                    target: this.target,
                    speed: k * 12,
                    damage: this.damage,
                    angle: this.angle + getRandom(-5, 3),
                    dir: this.dir,

                });

            this.lastshot = 0;

        }
    };

    window.Unit = Unit;
})();

var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getDistance = function (own, ally) {

    return Math.floor(Math.sqrt(Math.pow(own[0] - ally[0], 2) + Math.pow(own[1] - ally[1], 2)));
};



var deployUnit = function (unit, pos) {
    var u = unit;
    units.push(new Unit(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], u[12], u[13]));
    units[units.length - 1].pos = pos;
    deployarea = false;
};

var deployEnemy = function (unit, pos) {
    var u = unit;
    enemies.push(new Unit(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], u[12], u[13]));
    enemies[enemies.length - 1].pos = pos;

};



var returnToBase = function (icon) {
    icon.pos = icon.defaultpos;
    icon.dragable = false;
};

var gameOver = function (a) {

    var _min = Math.floor(gameTime / 60);
    var _sec = ('0' + Math.floor(gameTime % 60)).slice(-2);


    switch (a) {

        case 'win':

            alert("Mission completed! Your time is " + _min + ':' + _sec + '\n\nLosses: ' + counter + ' units.\n\nEnemies destroyed: ' + counter2 + '.');

            var log_item = "<p>Game " + ++gameNum + ": &#x1F3C6; Win &#x23F2;" + _min + ':' + _sec + ' /' + dif[lvl] + ' /' + "</p>";
            if (lvl < dif.length - 1) lvl++;
            var log = document.getElementById('log');
            log.innerHTML += log_item;
            document.body.style.paddingTop = 50 - (gameNum * 3) + "%";
            log.style.display = "block";
            loader();
            break;

        case 'loss':
            alert("Mission failed!" + '\n\nLosses: ' + counter + ' units.\n\nEnemies destroyed: ' + counter2 + '.');

            var log_item = "<p>Game " + ++gameNum + ": &#x1F4A9; Fail &#x23F2;" + _min + ':' + _sec + ' /' + dif[lvl] + ' /' + "</p>";
            if (lvl > 0) lvl--;
            var log = document.getElementById('log');
            log.innerHTML += log_item;
            document.body.style.paddingTop = 50 - (gameNum * 3) + "%";
            log.style.display = "block";
            loader();
            break;

    }
}

var reset = function () {

    units = [];
    icons = [];
    bullets = [];
    enemies = [];
    explosions = [];
    isGameOver = false;
    gameTime = 0;
    enemydep = 1;
    firstwave = false;
    nextwave = 0;
    deployarea = false;
    counter = 0;
    counter2 = 0;
}

var xxx = 0,
    yyy = 0;
var mouse =
{
    x: 0,
    y: 0,
    down: false
}

/////////////////////////////

var startGame = function () {

    reset();

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var p = document.getElementsByClassName("modal-text")[0];
    span.onclick = function () {
        modal.style.display = "none";
        game_paused = !game_paused;
    }

    var log = document.getElementById('log');
    var popup = document.getElementById('infdiv');


    log.style.display = "none";
    popup.style.display = 'none';
    document.body.style.paddingTop = 0;

    var maindiv = document.getElementById("main");

    maindiv.innerHTML = '<canvas id="c"></canvas>';

    var c = document.getElementById("c");

    var ctx = c.getContext("2d");

    w = window.innerWidth;
    h = window.innerHeight;


    if (w < h) {
        c.width = w - 46;
        c.height = c.width / 0.7;
    } else {
        c.height = h - 46;
        c.width = c.height * 0.7;
    }

    k = c.width / 26;

    xo = c.offsetLeft;
    yo = c.offsetTop;


    ////

    icons = [
        {
            active: true,
            pos: [c.width / 28, c.height - c.height / 8],
            defaultpos: [c.width / 28, c.height - c.height / 8],
            respawn: false,
            respawnrate: 1,
            sprite: new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [55, 76], [194, 134], [c.width / 5.5, c.height / 10.5])
        },
        {
            active: true,
            pos: [c.width / 3.4, c.height - c.height / 8.5],
            defaultpos: [c.width / 3.4, c.height - c.height / 8.5],
            respawn: false,
            respawnrate: 3,
            sprite: new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [71, 600], [159, 130], [c.width / 6.5, c.height / 12])
        },
        {
            active: true,
            pos: [c.width / 1.85, c.height - c.height / 8.2],
            defaultpos: [c.width / 1.85, c.height - c.height / 8.2],
            respawn: false,
            respawnrate: 0.5,
            sprite: new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [52, 269], [205, 124], [c.width / 5.8, c.height / 12])
        },
        {
            active: false,
            pos: [c.width / 1.27, c.height - c.height / 8.2],
            defaultpos: [c.width / 1.27, c.height - c.height / 8.2],
            respawn: false,
            respawnrate: 0.5,
            sprite: new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [68, 434], [230 - 68, 565 - 434], [c.width / 5.8, c.height / 12])
        }];

    ///

    c.addEventListener("touchmove", function (event) {

        var touch = event.touches[0];
        xxx = touch.pageX - xo - 3;
        yyy = touch.pageY - yo - 3;

        checkIcons(xxx, yyy);

        event.preventDefault();
    }, false);

    c.addEventListener("touchend", function (event) {

        checkDeployment(xxx, yyy);

    }, false);

    c.addEventListener("mousemove", function (event) {
        mouse.x = event.pageX - xo - 3;
        mouse.y = event.pageY - yo - 3;
    }, false);

    c.addEventListener("mousedown", function () {
        mouse.down = true;
        checkIcons(mouse.x, mouse.y);

    }, false);

    c.addEventListener("mouseup", function () {
        mouse.down = false;
        checkDeployment(mouse.x, mouse.y);
    }, false);

    function checkIcons(xx, yy) {

        if (xx > icons[0].pos[0] && xx < icons[0].pos[0] + (k * 5) && yy > icons[0].pos[1] - (k * 3) && yy < icons[0].pos[1] + (k * 3) && !icons[0].respawn && !game_paused) {
            if (!icons[1].dragable && !icons[2].dragable) {
                icons[0].dragable = true;
                basictank[0] = 'readyfordeploy';
                deployarea = true;
            }
        }

        if (xx > icons[1].pos[0] && xx < icons[1].pos[0] + (k * 5) && yy > icons[1].pos[1] - (k * 3) && yy < icons[1].pos[1] + (k * 3) && !icons[1].respawn && !game_paused) {
            if (!icons[0].dragable && !icons[2].dragable) {
                icons[1].dragable = true;
                lighttank[0] = 'readyfordeploy';
                deployarea = true;

            }
        }

        if (xx > icons[2].pos[0] && xx < icons[2].pos[0] + (k * 5) && yy > icons[2].pos[1] - (k * 3) && yy < icons[2].pos[1] + (k * 3) && !icons[2].respawn && !game_paused) {
            if (!icons[0].dragable && !icons[1].dragable) {
                icons[2].dragable = true;
                ttank[0] = 'readyfordeploy';
                deployarea = true;

            }
        }

        if (xx > icons[3].pos[0] && xx < icons[3].pos[0] + (k * 5) && yy > icons[3].pos[1] - (k * 3) && yy < icons[3].pos[1] + (k * 3)) {
            game_paused = !game_paused;

            if (modal.style.display == "block") {
                modal.style.display = "none";
            } else {

                p.innerHTML = 'Its LOCKED';
                modal.style.width = c.width * 0.8 + "px";
                modal.style.marginLeft = c.width * 0.1 + xo + "px";
                modal.style.display = "block";
            }



        }
    }

    function checkDeployment(xx, yy) {

        var inside = false;

        if (xx > c.width / 100 && yy > c.height / 2 && xx < c.width - c.width / 100 - 3 && yy < c.height / 2 + c.height / 3.7) {
            inside = true;
        }

        var allies = false;
        for (var i = 0; i < units.length; i++) {
            if (getDistance([xx, yy], units[i].pos) < 2 * k) allies = true;
        }

        if (basictank[0] == 'readyfordeploy' && inside && !allies) {
            basictank[0] = ' ';
            deployUnit(basictank, [xx, yy]);
            units[units.length - 1].status = 'acceleration';
            icons[0].pos = [icons[0].defaultpos[0], icons[0].defaultpos[1] + c.width / 4];
            icons[0].dragable = false;
            icons[0].respawn = true;
            deployarea = false;
        }
        else if (basictank[0] == 'readyfordeploy' && (!inside && !icons[0].respawn || allies)) {
            returnToBase(icons[0]);
            basictank[0] = ' '
        }

        if (lighttank[0] == 'readyfordeploy' && inside && !allies) {
            lighttank[0] = ' ';
            deployUnit(lighttank, [xx, yy]);
            units[units.length - 1].status = 'acceleration';
            icons[1].pos = [icons[1].defaultpos[0], icons[1].defaultpos[1] + c.width / 4];;
            icons[1].dragable = false;
            icons[1].respawn = true;

        }
        else if (lighttank[0] == 'readyfordeploy' && (!inside && !icons[1].respawn || allies)) {
            returnToBase(icons[1]);
            lighttank[0] = " ";
        }

        if (ttank[0] == 'readyfordeploy' && inside && !allies) {
            ttank[0] = ' ';
            deployUnit(ttank, [xx, yy]);
            units[units.length - 1].status = 'acceleration';
            icons[2].pos = [icons[2].defaultpos[0], icons[2].defaultpos[1] + c.width / 4];;
            icons[2].dragable = false;
            icons[2].respawn = true;

        }
        else if (ttank[0] == 'readyfordeploy' && (!inside && !icons[2].respawn || allies)) {
            returnToBase(icons[2]);
            ttank[0] = " ";
        }

    }


    lastTime = Date.now();


    // units
    // stats -- status, pos, hp, speed, maxspeed, range, damage, reload, angle, defaultangle , dir, sprite

    var basictank = ['acceleration', [0, 0], 1500, 0, k * 1.5, k * 7, 399, 1.3, - 90, - 90, 1, new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [55, 76], [194, 135], [c.width / 11, c.height / 21])];

    var lighttank = ['acceleration', [0, 0], 300, 0, k * 5.5, k * 10, 149, 0.9, - 90, - 90, 1, new Sprite("https://opengameart.org/sites/default/files/tanks_3.png", [71, 600], [159, 130], [c.width / 13, c.height / 24])];

    var ttank = ['acceleration', [0, 0], 150, 0, k * 3.5, k * 12.5, 30, 0.05, - 90, - 90, 1, new Sprite("https://opengameart.org/sites/default/files/tanks_3.png", [52, 269], [205, 124], [c.width / 11.6, c.height / 24])];
    //enemy units
    var enemybasic = ['acceleration', [0, 0], 1500, 0, k * 1.5, k * 7, 399, 1.3, - 90, - 90, - 1, new Sprite('https://opengameart.org/sites/default/files/tanks_3.png', [365, 76], [194, 135], [c.width / 11, c.height / 21])];

    var enemylight = ['acceleration', [200, 200], 300, 0, k * 5.5, k * 10, 149, 0.7, - 90, - 90, - 1, new Sprite("https://opengameart.org/sites/default/files/tanks_3.png", [395, 600], [159, 130], [c.width / 13, c.height / 24])];

    var enemyttank = ['acceleration', [0, 0], 150, 0, k * 3.5, k * 12.5, 10, 0.05, - 90, - 90, - 1, new Sprite("https://opengameart.org/sites/default/files/tanks_3.png", [362, 269], [205, 124], [c.width / 11.6, c.height / 24])];



    main()

    // The main game loop



    function main() {


        var now = Date.now();

        if (!game_paused) {

            var dt = (now - lastTime) / 1000;

            update(dt);

            render();

        }

        lastTime = now;


        if (!isGameOver) requestAnimFrame(main);

    };

    function update(dt) {

        gameTime += dt;

        if (nextwave < 0) {
            nextwave = (enemydep * (18 - lvl) - gameTime + 2).toFixed(0)
        } else {
            nextwave -= dt;
        }

        if (Math.floor(gameTime) == 1 && firstwave == false) {

            if (lvl < 3) {

                if (lvl >= 0) {
                    deployEnemy(enemybasic, [c.width / 4, c.height / 5]);
                    deployEnemy(enemybasic, [c.width - (c.width / 4), c.height / 5]);
                }

                if (lvl >= 1) {
                    deployEnemy(enemyttank, [c.width / 2, c.height / 20]);
                }

                if (lvl >= 2) {
                    deployEnemy(enemylight, [c.width / 5, c.height / 18]);
                    deployEnemy(enemylight, [c.width - (c.width / 5), c.height / 18]);
                }
            }

            if (lvl > 2 && lvl < 6) {

                if (lvl >= 3) {
                    deployEnemy(enemybasic, [c.width / 2, c.height / 4]);
                    deployEnemy(enemylight, [c.width / 2 - c.width / 16, c.height / 7]);
                    deployEnemy(enemylight, [c.width / 2 + c.width / 16, c.height / 7]);
                    deployEnemy(enemyttank, [c.width / 2, c.height / 14]);
                    deployEnemy(enemyttank, [c.width / 2 - c.width / 8, c.height / 14]);
                    deployEnemy(enemyttank, [c.width / 2 + c.width / 8, c.height / 14]);

                    if (lvl == 3) {
                        deployEnemy(enemyttank, [c.width / 2 - c.width / 4, c.height / 14]);
                        deployEnemy(enemyttank, [c.width / 2 + c.width / 4, c.height / 14]);
                    }


                }

                if (lvl >= 4) {
                    deployEnemy(enemylight, [c.width / 8 - c.width / 11, - c.height / 4]);
                }

                if (lvl >= 5) {
                    deployEnemy(enemylight, [c.width + c.width / 64, - c.height / 2]);
                }

            }

            if (lvl > 5 && lvl < 9) {

                if (lvl >= 6) {
                    deployEnemy(enemybasic, [c.width / 2, c.height / 4]);
                    deployEnemy(enemybasic, [c.width / 2 + c.width / 8, c.height / 4]);
                    deployEnemy(enemybasic, [c.width / 2 - c.width / 8, c.height / 4]);

                    deployEnemy(enemyttank, [c.width / 2, c.height / 7]);
                    deployEnemy(enemyttank, [c.width / 2 - c.width / 8, c.height / 7]);
                    deployEnemy(enemyttank, [c.width / 2 + c.width / 8, c.height / 7]);
                }

                if (lvl >= 7) {
                    deployEnemy(enemylight, [c.width / 8 - c.width / 11, c.height / 14]);
                    deployEnemy(enemylight, [c.width - (c.width / 8 - c.width / 11), c.height / 14]);
                }

                if (lvl >= 8) {
                    deployEnemy(enemylight, [c.width / 8 - c.width / 11, - c.height / 4]);
                    deployEnemy(enemylight, [c.width - (c.width / 8 - c.width / 11), - c.height / 4]);
                }



            }

            if (lvl == 9) {

                for (var x = 0; x < 7; x++) {
                    setTimeout(deployEnemy, x * 50, enemybasic, [c.width / 8 + x * (c.width / 8), c.height / 4])
                }
                for (var x = 0; x < 6; x++) {
                    setTimeout(deployEnemy, x * 50, enemylight, [c.width / 8 + x * (c.width / 8) + c.width / 16, c.height / 7])
                }
                for (var x = 0; x < 7; x++) {
                    setTimeout(deployEnemy, x * 50, enemyttank, [c.width / 8 + x * (c.width / 8), c.height / 20])
                }

            }



            firstwave = true;

        }

        if (Math.floor(gameTime) == enemydep * (18 - lvl % 17)) {

            deployEnemy(enemybasic, [getRandom(30, c.width - 30), getRandom(-20, - 40)]);
            deployEnemy(enemylight, [getRandom(30, c.width - 30), getRandom(-20, - 40) - (k * 2)]);
            deployEnemy(enemylight, [getRandom(30, c.width - 30), getRandom(-20, - 40) - (k * 2)]);
            deployEnemy(enemyttank, [getRandom(30, c.width - 30), getRandom(-20, - 40) - (k * 4)]);
            deployEnemy(enemyttank, [getRandom(30, c.width - 30), getRandom(-20, - 40) - (k * 4)]);
            enemydep++;

        }

        updateEntities(dt, units);
        updateEntities(dt, enemies);
        updateBullets(dt);
        updateIcons(dt);

        //   checkCollisions();

    };

    function updateIcons(dt) {

        for (i = 0; i < icons.length; i++) {
            if (icons[i].pos[1] > icons[i].defaultpos[1] && icons[i].respawn == true) {
                icons[i].pos[1] -= icons[i].respawnrate * k * dt;
            }
            else {
                icons[i].respawn = false;
            }
        }
    };

    function updateEntities(dt, list) {

        // Update the tank position





        for (var i = 0; i < list.length; i++) {

            var u = list[i];
            var u2;

            list == units ? u2 = enemies : u2 = units;


            u.time = u.time + dt || 0;
            u.lastshot = u.lastshot + dt || 0;
            u.avoidCollision(list, i, dt);
            //remove 
            if (u.destroyed) {
                list.splice(i, 1);
                i--;
                if (list == units) {
                    counter++;
                }
                else {
                    counter2++;
                }
            }
            else if (list == enemies && u.pos[1] > c.height - (c.width / 4 + 2 * k)) {

                isGameOver = true;
                gameOver('loss');
                break;

            }
            else if (
                list == units && u.pos[1] < k * 2) {
                isGameOver = true;
                gameOver('win');
                break;
            }

            if (u.status == "acceleration" && u.speed < u.maxspeed) {

                u.speed += 15 * dt;
                switch (list) {
                    case units:
                        if (u.angle < u.defaultangle) {
                            u.angle += Math.floor(80 * dt * u.dir);
                        }
                        else if (u.angle > u.defaultangle) {
                            u.angle -= Math.floor(80 * dt * u.dir);
                        }
                        break;
                    case enemies:

                        u.cang = u.defaultangle;
                        if (u.cang < -90) {
                            u.cang += 180;
                        }
                        else if (u.cang > -90) {
                            u.cang -= 180;
                        }
                        if (u.cang < u.angle) {
                            u.angle -= Math.floor(75 * dt);
                        }
                        else if (u.cang > u.angle) {
                            u.angle += Math.floor(75 * dt);
                        }



                }
            }



            if (u.time > 1 && !u.target && u.pos[1] > k) {
                u.findTarget(u2);
            }

            if (u.target && u.target.destroyed) {
                u.status = 'acceleration';
                delete u.target;

            }
            else if (u.status == "targetfound" && !u.target.destroyed) {

                if (u.speed > 0) {
                    u.speed -= u.maxspeed * 2 * dt;
                }
                else {
                    u.speed = 0
                }



                u.cang = Math.floor(u.getAngle(u.target.pos));

                if (list == enemies) {
                    if (u.cang < -90) {
                        u.cang += 180;
                    }
                    else if (u.cang > -90) {
                        u.cang -= 180;
                    }
                }
                if (u.cang > u.angle && u.cang < u.angle + 3) {
                    u.angle = u.cang;
                } else if (u.cang > u.angle) {
                    u.angle += Math.floor(150 * dt);
                }
                else if (u.cang < u.angle && u.cang > u.angle - 3) {
                    u.angle = u.cang;
                } else if (u.cang < u.angle) {
                    u.angle -= Math.floor(150 * dt);
                }






                if (u.lastshot > u.reload && Math.floor(u.angle) == Math.floor(u.cang) && u.getDistance(u.target) < u.range) {

                    u.fireOnTarget();

                } else {
                    u.findTarget(u2);
                }

            }

            if (u.time > 0.7 && u.speed > 0) {

                u.moveAhead(dt);

            }

        };

    }

    function updateBullets(dt) {

        // Update all the explosions


        for (var i = 0; i < explosions.length; i++) {
            explosions[i].sprite.update(dt);

            // Remove if animation is done

            if (explosions[i].sprite.done) {
                explosions.splice(i, 1); i--;
            }
        }

        // Update all the bullets


        for (var i = 0; i < bullets.length; i++) {


            var b = bullets[i];

            var rad = b.angle / (180 / Math.PI);
            b.pos[0] += Math.cos(rad) * b.speed * dt * b.dir;
            b.pos[1] += Math.sin(rad) * b.speed * dt * b.dir;


            // Remove the bullet


            if (b.pos[1] < b.target.pos[1] + k && b.pos[1] > b.target.pos[1] - k && b.pos[0] < b.target.pos[0] + k && b.pos[0] > b.target.pos[0] - k) {
                bullets.splice(i, 1); i--;
                if (b.target.hp >= 0 && !b.target.destroyed) {
                    b.target.hp -= b.damage;
                }
                if (b.target.hp < 0) {
                    b.target.destroyed = true;
                    b.target.hp = 0; // Add an explosion
                    explosions.push(
                        {
                            pos: b.target.pos,
                            sprite: new Sprite("https://hsto.org/storage2/aeb/045/378/aeb0453784033c5b9c0a700f5952d84b.png", [0, 117], [39, 39], [k * 3.2, k * 3.2], 14, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, true)
                        });
                }
            }
        }


    }



    function render() {

        if (!isGameOver) {

            renderArea(ctx);
            renderEntities(enemies);
            renderEntities(units);
            renderBullets();
            renderEntities(explosions);


        }
    };

    function renderArea(ctx) {

        ctx.globalAlpha = 0.5;

        for (x = 0; x * 102 < c.width; x++) {
            for (y = 0; y * 102 < c.height; y++) {
                ctx.drawImage(resources.get('https://opengameart.org/sites/default/files/Ground_03.png'), 0, 0, 512, 512, x * 102, y * 102, 102, 102);
            }
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(250,250,250,0.19)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "rgba(50,200,50,0.9)";
        ctx.fillRect(0, 0, c.width, c.height / 20);
        ctx.fillStyle = " rgba(200,50,50,0.7)";
        ctx.fillRect(0, c.height - c.width / 4 - c.height / 20, c.width, c.height / 20);
        ctx.font = c.height / 24 + "px Arial";
        ctx.fillStyle = " rgba(250,250,250,0.7)";

        ctx.fillText("NEXT WAVE IN " + Math.round(nextwave), c.width / 10, c.height / 22);


        ctx.beginPath();
        for (var x = c.width / 4; x < c.width; x += c.width / 4) {

            ctx.moveTo(x + 0.1, c.height - c.width / 4);
            ctx.lineTo(x + 0.1, c.height);
        };

        ctx.moveTo(0, c.height - c.width / 4);
        ctx.lineTo(c.width, c.height - c.width / 4);
        ctx.closePath();
        ctx.strokeStyle = "#eee";
        ctx.stroke();

        if (deployarea === true) {
            drawDeployArea();
        }


    };

    function drawDeployArea() {

        ctx.beginPath();
        ctx.rect(c.width / 100 - 2, c.height / 2 - 2, c.width - c.width / 100 - 3 + 4, c.height / 3.7 + 4);
        ctx.strokeStyle = "darkgreen";
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(c.width / 100, c.height / 2, c.width - c.width / 100 - 3, c.height / 3.7);
        ctx.strokeStyle = "white";
        ctx.closePath();
        ctx.stroke();


    }

    function drawTrLights() {

        for (i = 0; i < icons.length; i++) {

            if (icons[i].respawn == true || !icons[i].active) {
                ctx.fillStyle = "red";
            }
            else {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(c.width / 4.8 + c.width / 4 * i, c.height - c.width / 4.1, c.width / 30, c.width / 30);
        };
    };


    function renderEntities(list) {


        for (var i = 0; i < list.length; i++) {

            renderEntity(list[i]);

        }

        drawTrLights();
        drawIcons(icons);

    }

    function renderBullets() {
        for (var i = 0; i < bullets.length; i++) {

            ctx.save();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(bullets[i].pos[0], bullets[i].pos[1], 1 + bullets[i].damage / 300, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }

    }


    function drawIcons(list) {
        for (var i = 0; i < list.length; i++) {

            if (!list[i].dragable) {

                ctx.save();
                ctx.translate(list[i].pos[0] + list[i].sprite.resized[0] / 2, list[i].pos[1] + list[i].sprite.resized[1] / 2);
                ctx.rotate(Math.PI / 180 * (-90));
                ctx.translate(-list[i].sprite.resized[0] / 2, - list[i].sprite.resized[1] / 2);
                if (!list[i].active) ctx.globalAlpha = 0.2;
                list[i].sprite.render(ctx);

                ctx.restore();



            }
            else {

                ctx.save();

                if (mouse.down) {
                    ctx.translate(mouse.x, mouse.y);
                }
                else {
                    ctx.translate(xxx, yyy);
                }
                ctx.rotate(Math.PI / 180 * (-90));
                ctx.translate(-list[i].sprite.resized[0] / 2, - list[i].sprite.resized[1] / 2);



                list[i].sprite.render(ctx);

                list[i].pos = [xxx, yyy]

                ctx.restore();
            }
        }
    };


    function renderEntity(entity) {


        if (!entity.destroyed) {
            ctx.save();
            ctx.translate(entity.pos[0], entity.pos[1]);

            if (entity.time && entity.time < 0.7) {
                ctx.scale(1.9 - entity.time * entity.time * 1.7, 1.9 - entity.time * entity.time * 1.7);
            }

            ctx.rotate(Math.PI / 180 * (entity.angle));

            ctx.translate(-entity.sprite.resized[0] / 2, - entity.sprite.resized[1] / 2);

            entity.sprite.render(ctx);
            renderHP(entity); ctx.restore();
        }
    }

    function renderHP(entity) {

        if (entity.time > 0.8) {
            var hp = entity.hp * 100 / entity.maxhp;
            if (hp < 0) hp = 0;
            if (entity.dir < 0) {
                var reverse = entity.sprite.resized[0];
            }
            else {
                var reverse = 0;
            }

            ctx.beginPath();
            ctx.lineWidth = k / 2.5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "black";
            ctx.moveTo(0 + reverse, 0);
            ctx.lineTo(0 + reverse, entity.sprite.resized[1]);
            ctx.stroke();


            ctx.beginPath();
            ctx.lineWidth = k / 3.2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "lightgrey";
            ctx.moveTo(0 + reverse, 0);
            ctx.lineTo(0 + reverse, entity.sprite.resized[1]);
            ctx.stroke();

            ctx.beginPath();

            ctx.lineWidth = k / 4;

            ctx.lineCap = "round";
            ctx.strokeStyle = "rgb(" + Math.floor(100 - hp * 2.56) + "," + Math.floor(hp * 2.56) + ",0)";
            ctx.moveTo(0 + reverse, 0);
            ctx.lineTo(0 + reverse, hp / 100 * entity.sprite.resized[1]);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

};






/////////////^^^^^^^^^^^^^^////////////

var requestAnimFrame = (function () {


    return window.requestAnimationFrame ||

        window.webkitRequestAnimationFrame ||

        window.mozRequestAnimationFrame ||

        window.oRequestAnimationFrame ||

        window.msRequestAnimationFrame ||


        function (callback) {

            window.setTimeout(callback, 1000 / 60);


        };
})();

///^^^^^^^///////////^^^^/////////

function loader() {

    var maindiv = document.getElementById("main");

    if (lvl < 0 || lvl > 9) {
        lvl = 0;
    }

    var startButton = document.createElement("button");
    startButton.id = "start";
    startButton.textContent = "Start Game";
    startButton.addEventListener("click", startGame);

    var infoButton = document.createElement("button");
    infoButton.id = "info";
    infoButton.textContent = "Info";
    infoButton.addEventListener("click", inf);

    var leftButton = document.createElement("button");
    leftButton.id = "btn-left";
    leftButton.textContent = "<";
    leftButton.addEventListener("click", function() {
        changeLvl(0);
    });

    var rightButton = document.createElement("button");
    rightButton.id = "btn-right";
    rightButton.textContent = ">";
    rightButton.addEventListener("click", function() {
        changeLvl(1);
    });

    var difficultySpan = document.createElement("span");
    difficultySpan.className = "dif";
    difficultySpan.textContent = "Difficulty:";

    var difficultyLevelSpan = document.createElement("span");
    difficultyLevelSpan.className = "dif";
    difficultyLevelSpan.textContent = dif[lvl];

    maindiv.innerHTML = '';
    maindiv.appendChild(startButton);
    maindiv.appendChild(infoButton);
    maindiv.appendChild(document.createElement("br"));
    maindiv.appendChild(difficultySpan);
    maindiv.appendChild(document.createElement("br"));
    maindiv.appendChild(leftButton);
    maindiv.appendChild(difficultyLevelSpan);
    maindiv.appendChild(rightButton);

    lastTime = Date.now();

};
//////////////////////////////////

(function () {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];
    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if (resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function () {
                resourceCache[url] = img;
                if (isReady()) {
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }
    window.resources =
    {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

resources.load([

    "https://opengameart.org/sites/default/files/tanks_3.png",

    "https://hsto.org/storage2/aeb/045/378/aeb0453784033c5b9c0a700f5952d84b.png",

    "https://opengameart.org/sites/default/files/Ground_03.png"
]);

resources.onReady(loader);


document.getElementById("start").addEventListener("click", startGame);
document.getElementById("info").addEventListener("click", inf);