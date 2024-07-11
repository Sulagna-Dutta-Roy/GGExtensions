function Deoxys(context, imagem, imagem2, imgExplosao) {
   this.context = context;
   this.imagem = imagem;
   this.imagem2 = imagem2;
   this.x = 0;
   this.y = 0;
   this.velocidade = 0;
   this.imgExplosao = imgExplosao;
   this.spritesheet = new Spritesheet(context, imagem, 1, 2);
   this.spritesheet2 = new Spritesheet(context, imagem2, 1, 2);
   this.deoxys_vida = 8;
}
Deoxys.prototype = {
   atualizar: function() {
      this.y += 
         this.velocidade * this.animacao.decorrido / 1000;
      
      if (this.y > this.context.canvas.height) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
      }
   },
   desenhar: function() {
      if(this.deoxys_vida == 8) {
         this.spritesheet.desenhar(this.x, this.y);
         this.spritesheet.proximoQuadro();
      }
      if(this.deoxys_vida < 8) {
         this.spritesheet2.desenhar(this.x, this.y);
         this.spritesheet2.proximoQuadro();
      }
   },
   retangulosColisao: function() {
      // Estes valores vão sendo ajustados aos poucos
      var rets = 
      [ 
         {x: this.x, y: this.y, largura: 57, altura: 47}
      ];
      
      
      return rets;
   },
   colidiuCom: function(outro) {
      // Se colidiu com um Tiro, os dois desaparecem
      if (outro instanceof Tiro) {

         if(this.deoxys_vida >= 0) {

            var explosao = new Explosao(this.context, this.imgExplosao, 
               this.x, this.y, 'snd/deoxys-cry.mp3');

            this.animacao.novoSprite(explosao);

            this.deoxys_vida = this.deoxys_vida - 1;
            this.velocidade = 500;

         }
         if(this.deoxys_vida == 0) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(outro);
         
         var explosao = new Explosao(this.context, this.imgExplosao, 
                                     this.x, this.y, 'snd/explosao.mp3');
         this.animacao.novoSprite(explosao);
         }
      }
   }
}
