function Ovni(context, imagem, imgExplosao) {
   this.context = context;
   this.imagem = imagem;
   this.x = 0;
   this.y = 0;
   this.velocidade = 0;
   this.imgExplosao = imgExplosao;
   this.spritesheet = new Spritesheet(context, imagem, 1, 2)
}
Ovni.prototype = {
   atualizar: function() {
      this.y += 
         this.velocidade * this.animacao.decorrido / 1000;
      
      if (this.y > this.context.canvas.height) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
      }
   },
   desenhar: function() {
      this.spritesheet.desenhar(this.x, this.y);
      this.spritesheet.proximoQuadro();
   },
   retangulosColisao: function() {
      // Estes valores vão sendo ajustados aos poucos
      var rets = 
      [ 
         {x: this.x-2, y: this.y+3, largura: 36, altura: 18},
         {x: this.x+35, y: this.y+3, largura: 33, altura: 60},
         {x: this.x+68, y: this.y+3, largura: 36, altura: 18}
      ];
      
      
      return rets;
   },
   colidiuCom: function(outro) {
      // Se colidiu com um Tiro, os dois desaparecem
      if (outro instanceof Tiro) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(outro);
         
         var explosao = new Explosao(this.context, this.imgExplosao, 
                                     this.x, this.y, 'snd/latios-cry.mp3');
         this.animacao.novoSprite(explosao);
      }
   }
}
