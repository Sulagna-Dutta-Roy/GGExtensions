var SOM_EXPLOSAO = new Audio();
// SOM_EXPLOSAO.src = 'snd/explosao.mp3';
SOM_EXPLOSAO.volume = 0.4;
SOM_EXPLOSAO.load();

function Explosao(context, imagem, x, y, explosao_som) {
   this.context = context;
   this.imagem = imagem;
   this.spritesheet = new Spritesheet(context, imagem, 1, 6);
   this.spritesheet.intervalo = 75;
   this.x = x;
   this.y = y;
   this.animando = false;
   this.explosao_som = explosao_som;
   
   var explosao = this;
   this.fimDaExplosao = null;
   this.spritesheet.fimDoCiclo = function() {
      explosao.animacao.excluirSprite(explosao);
      if (explosao.fimDaExplosao) explosao.fimDaExplosao();
   }
   
   SOM_EXPLOSAO.src = this.explosao_som;
   SOM_EXPLOSAO.currentTime = 0.0;
   SOM_EXPLOSAO.play();
}
Explosao.prototype = {
   atualizar: function() {
      
   },
   desenhar: function() {
      this.spritesheet.desenhar(this.x + 16, this.y);
      this.spritesheet.proximoQuadro();
   }
}