export function drawstatusText(context , input,player){
    context.font='28px Helvetica';
    context.fillText('Last input: '+input.lastkey ,20,50);
    context.fillText('Active State :'+player.currentState.state,20,90)
}