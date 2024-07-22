var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 720; 
c.height = 480;
document.body.appendChild(c);

var perm = [];
while (perm.length < 255){
    while(perm.includes(val = Math.floor(Math.random()*255)));
    perm.push(val);
}

var lerp = (a,b,t) => a + (b-a) * (1-Math.cos(t*Math.PI))/2;
var noise = x=>{
    x = x * 0.01 % 254;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var Player =  function(){
    this.x = c.width/2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
    this.img = new Image();
    this.img.src = document.getElementsByTagName("template")[0].innerHTML;
    this.draw = function(){
        var p1 =  c.height - noise(t + this.x) * 0.25;
        var p2 =  c.height - noise(t+5 + this.x) * 0.25;

        var grounded = 0;
        if(p1-12 > this.y){
            this.ySpeed += 0.1;
        }else{
            this.ySpeed -= this.y - (p1-12);
            this.y = p1 - 12;
            grounded = 1;
        }

        var angle = Math.atan2((p2-12) - this.y, (this.x+5) - this.x);
        this.y += this.ySpeed;

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5;
        }

        
        if(grounded && playing){
            this.rot -= (this.rot - angle) * 0.65;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.1;
        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y - 3);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -15, -15, 30, 30);
        ctx.restore();
    }
}

var player = new Player();
var t = 0;
var speed = 0;
var playing = true;
var k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
function loop(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    t += 10 * speed;
    ctx.fillStyle = "#19f";
    ctx.fillRect(0,0,c.width, c.height);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height*0.8 - noise(t + i*5) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width; i++)
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    player.draw();
    if(player.x < 0)
        restart();
    requestAnimationFrame(loop);
}

onkeydown = d=> k[d.key] = 1;
onkeyup = d=> k[d.key] = 0;

function restart(){
    
    player = new Player();
    t = 0;
    speed = 0;
    playing = true;
    k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};

}
loop();

var instructions = document.createElement("div");

document.body.appendChild(instructions);