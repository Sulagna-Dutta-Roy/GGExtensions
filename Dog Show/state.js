export const states={
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT:2,
    SITTING_RIGHT:3,
    RUNING_LEFT:4,
    RUNING_RIGHT:5,
    

}

class State{
    constructor(state){
     this.state=state;
    }
}

export class StandingLeft extends State{
    constructor(player){
        super('STANDING LEFT');
        this.player=player;

    }
    enter(){
     this.player.frameY = 1;
    }
    handleInput(input){
        if(input==='Press right')this.player.setState(states.RUNING_RIGHT);
        else if(input==='Press left')this.setState(states.RUNING_LEFT);
        else if(input==='Press down')this.player.setState(states.SITTING_LEFT);

    }
}

export class StandingRight extends State{
    constructor(player){
        super('STANDING RIGHT');
        this.player=player;

    }
    enter(){
        this.player.frameY= 0;
    }
    handleInput(input){
        if(input==='Press left')this.player.setState(states.RUNING_LEFT);
        else if(input==='Press right')this.setState(states.RUNING_RIGHT);
        else if(input==='Press down')this.player.setState(states.SITTING_RIGHT);
    }
}

export class SittingLeft extends State{
    constructor(player){
        super('SITTING LEFT');
        this.player=player;

    }
    enter(){
     this.player.frameY = 9;
     this.player.speed=0;
    }
    handleInput(input){
        if(input==='Press right')this.player.setState(states.SITTING_RIGHT);
        
        else if(input==='RELEASE down')this.player.setState(states.STANDING_LEFT);

    }
}
export class SittingRight extends State{
    constructor(player){
        super('SITTING RIGHT');
        this.player=player;

    }
    enter(){
     this.player.frameY = 8;
     this.player.speed=0;
    }
    handleInput(input){
        if(input==='Press right')this.player.setState(states.SITTING_LEFT);

        else if(input==='RELEASE down')this.player.setState(states.STANDING_RIGHT);

    }
}

export class RuningLeft extends State{
    constructor(player){
        super('RUNING LEFT');
        this.player=player;

    }
    enter(){
     this.player.frameY = 7;
     this.player.speed=-this.player.maxspeed;
     this.player.speed=0;
    }
    handleInput(input){
        if(input==='Press right')this.player.setState(states.RUNING_RIGHT);
        else if(input==='RELEASE left')this.player.setState(states.STANDING_LEFT);
        if(input==='Press down')this.player.setState(states.SITTING_LEFT);
    }
}
export class RuningRight extends State{
    constructor(player){
        super('RUNING RIGHT');
        this.player=player;

    }
    enter(){
     this.player.frameY = 6;
     this.player.speed=this.player.maxspeed;
     this.player.speed=0;
    }
    handleInput(input){
        if(input==='Press left')this.player.setState(states.RUNING_LEFT);
        else if(input==='RELEASE right')this.player.setState(states.STANDING_RIGHT);
        if(input==='Press down')this.player.setState(states.SITTING_RIGHT);
    }
}