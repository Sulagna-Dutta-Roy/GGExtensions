export class UI{
    constructor(game){
        this.game=game;
        this.livesImage=document.getElementById('lives')
        

    }
    draw(context){
        context.save();
    
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.shadowColor='white';
        context.shadowBlur=0;
        context.font="30px Creepster";
        context.textAlign='left';
        context.fillStyle=this.game.fontColor;
        //score
        context.fillText('Score: '+this.game.score,20,50);
        //timer
        context.font="25px Creepster";
        context.fillText('Time: '+(this.game.time*0.001).toFixed(1),20,80);
        //lives
        for(let i=0;i<this.game.lives;i++){
        context.drawImage(this.livesImage,25* i + 20,95,25,25);
        }
        //game msg
        if(this.game.gameOver){
            context.textAlign='center';
            
            if(this.game.score >this.game.winningscore){
                context.font="80px Creepster";
                
                context.fillText('BOO-YAH ',this.game.width*0.5,this.game.height*0.5-40);
            context.font="41px Creepster";
            context.fillText('What are creatures of the Night afraid of? YOU!!',this.game.width*0.5,this.game.height*0.5+40);
        }
        else{
            context.font="60px Creepster";
            
            context.fillText('LOVE AT FIRST BITE?',this.game.width*0.5,this.game.height*0.5);
        context.font="41px Creepster";
        context.fillText('Nope,better luck next time!',this.game.width*0.5,this.game.height*0.5+40);
    }
            
        }
        context.restore();
    }
}