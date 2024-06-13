import {Player} from "./player1.js"
import { InputHandler } from "./input.1js.js";
import { Background } from "./background.js";
import { flyingEnemy,ClimbingEnemy,GroundEnemy} from "./enemies1.js";
import { UI } from "./ui.js";

window.addEventListener('load',function(){
    const canvas=document.getElementById('canvas1');
    const ctx=canvas.getContext('2d');
    canvas.width=1300;
    canvas.height=500;

    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            this.groundMargin= 40;
            this.speed=0;
            this.maxspeed=3;
            this.sound=new Audio();
        this.sound.src="orchestrawav-26158.mp3";
        this.sound.play();
         
            this.background=new Background(this)
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.UI=new UI(this)
            this.enemies=[];
            this.particles=[];
            this.collisions=[];
            this.FloatingMessages=[];

            this.maxparticles=200;
            this.enemyTimer=0;
            this.enemyInterval=800;
            this.debug=false;
            this.score=0;
            this.winningscore=50;
            this.fontColor='black';
            this.time=0;
            this.maxTime=30000;
            this.gameOver=false;
            this.lives=5;
            this.player.currentState=this.player.states[0];
        this.player.currentState.enter();
        
        
        } 
        update(deltaTime){
            if(this.time>=0)this.sound.play()
            this.time+=deltaTime;
            
            if(this.time>this.maxTime) this.gameOver=true;
            this.background.update();
            this.player.update(this.input.keys,deltaTime);
             // handle enemies
             if(this.enemyTimer>this.enemyInterval){
                this.addenemy();
                this.enemyTimer=0;
            }else{
                this.enemyTimer+=deltaTime;
            }
            this.enemies.forEach(enemy=>{
                enemy.update(deltaTime);
                if(enemy.markedForDeletion)this.enemies.splice(this.enemies.indexOf(enemy),1);
            })
            //handle messafe
             this.FloatingMessages.forEach(message=>{
                message.update(deltaTime);
            

             })
            //handle particles
            this.particles.forEach((particle,index)=>{
                particle.update();
                if(particle.markedForDeletion)this.particles.splice(index,1);
            });
            if(this.particles.length>this.maxparticles){
                this.particles=this.particles.slice(0,this.maxparticles);
            }
            //handle collision
            this.collisions.forEach((collision,index)=>{
                collision.update(deltaTime);
                if(collision.markedForDeletion)this.collisions.splice(index,1);
                
            })



        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.particles.forEach(particle=>{
                particle.draw(context);
            });
            this.collisions.forEach(collision=>{
                collision.draw(context);
            });
            this.FloatingMessages.forEach(message=>{
                message.draw(context);

             })
            this.UI.draw(context);

        }
        addenemy(){
            if(this.speed >0 && Math.random()<0.5)this.enemies.push(new GroundEnemy(this));
            else if(this.speed >0 )this.enemies.push(new ClimbingEnemy(this));
          this.enemies.push(new flyingEnemy(this));

          //console.log(this.enemies)
        }
    }
    const game=new Game(canvas.width,canvas.height);
    //console.log(game);
    let lasTime=0;

    function animate(timeStamp){
        const deltaTime=timeStamp-lasTime;
        lasTime=timeStamp
        ctx.clearRect(0,0,canvas.width,canvas.height)
        game.update(deltaTime);
       game.draw(ctx);
       if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);

});