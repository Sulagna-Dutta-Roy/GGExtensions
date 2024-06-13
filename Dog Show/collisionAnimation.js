export class CollisionAnimation{
    constructor(game,x,y){
        this.game=game;
        this.image=document.getElementById('collisionAnimation')
        this.spritewidth=100;
        this.spriteheight=90;
        this.sizeModifier=Math.random()+0.5;
        this.width=this.spritewidth*this.sizeModifier;
        this.height=this.spriteheight*this.sizeModifier;
        this.x = x-this.width * 0.5;
        this.y = y- this.width*0.5;
        this.frameX=0;
        this.maxFrame=4;
        this.sound=new Audio();
        this.sound.src="Ice attack 2.wav";
        this.markedDorDeletion=false;
        this.fps=Math.random()*10+5;
        this.frameInterval=1000/this.fps;
        this.frameTimer=0;
    }
    draw(context){
        context.drawImage(this.image,this.frameX*this.spritewidth
        ,0,this.spritewidth,this.spriteheight,this.x,this.y,
        this.width,this.height);
    }
    update(deltaTime){
        if(this.frameX==0)this.sound.play()
        this.x-=this.game.speed;
        if(this.frameTimer>this.frameInterval){
        this.frameX++;
        this.frameTimer=0;
        }
        else{
            this.frameTimer+=deltaTime;
        }
        if(this.frameX >this.maxFrame)this.markedDorDeletion=true;

    }


} 