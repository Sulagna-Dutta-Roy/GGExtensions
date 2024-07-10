function Nave(context, teclado, imagem, imgExplosao, imgTiro) {
   this.context = context;
   this.teclado = teclado;
   this.imagem = imagem;
   this.x = 0;
   this.y = 0;
   this.velocidade = 0;
   this.spritesheet = new Spritesheet(context, imagem, 3, 2);
   this.spritesheet.linha = 0;
   this.spritesheet.intervalo = 100;
   this.imgExplosao = imgExplosao;
   this.acabaramVidas = null;
   this.vidasExtras = 5;
   this.imgTiro = imgTiro;
}
Nave.prototype = {
   atualizar: function() {
      var incremento = 
          this.velocidade * this.animacao.decorrido / 1000;
      
      if (this.teclado.pressionada(SETA_ESQUERDA) && this.x > 0)
         this.x -= incremento;
         
      if (this.teclado.pressionada(SETA_DIREITA) && 
               this.x < this.context.canvas.width - 36)
         this.x += incremento;
         
      if (this.teclado.pressionada(SETA_ACIMA) && this.y > 0)
         this.y -= incremento;
         
      if (this.teclado.pressionada(SETA_ABAIXO) &&
               this.y < this.context.canvas.height - 48)
         this.y += incremento;
   },
   desenhar: function() {
      if (this.teclado.pressionada(SETA_ESQUERDA))
         this.spritesheet.linha = 1;
      else if (this.teclado.pressionada(SETA_DIREITA))
         this.spritesheet.linha = 2;
      else
         this.spritesheet.linha = 0;      
      
      this.spritesheet.desenhar(this.x, this.y);
      this.spritesheet.proximoQuadro();
   },
   atirar: function() {
      var t = new Tiro(this.context, this, this.imgTiro);
      this.animacao.novoSprite(t);
      this.colisor.novoSprite(t);
   },
   retangulosColisao: function() {
      // Estes valores vão sendo ajustados aos poucos

      var rets = 
      [ 
         {x: this.x-2, y: this.y+29, largura: 18, altura: 34},
         {x: this.x+17, y: this.y+3, largura: 18, altura: 60},
         {x: this.x+35, y: this.y+29, largura: 18, altura: 34}
      ];    
      
      return rets;
   },
   colidiuCom: function(outro) {
      // Se colidiu com um Ovni...
      if (outro instanceof Ovni || outro instanceof Deoxys) {
         this.animacao.excluirSprite(this);
         this.animacao.excluirSprite(outro);
         this.colisor.excluirSprite(this);
         this.colisor.excluirSprite(outro);
         
         var exp1 = new Explosao(this.context, this.imgExplosao,
                                 this.x, this.y, 'snd/explosao.mp3');
         var exp2 = new Explosao(this.context, this.imgExplosao,
                                 outro.x, outro.y, 'snd/explosao.mp3');
         
         this.animacao.novoSprite(exp1);
         this.animacao.novoSprite(exp2);
         
         var nave = this;
         exp1.fimDaExplosao = function() {
            nave.vidasExtras--;
            
            if (nave.vidasExtras < 0) {
               if (nave.acabaramVidas) nave.acabaramVidas();
            }
            else {
               // Recolocar a nave no engine
               nave.colisor.novoSprite(nave);
               nave.animacao.novoSprite(nave);
               
               nave.posicionar();
            }
         }
      }
   },
   posicionar: function() {
      var canvas = this.context.canvas;
      this.x = canvas.width / 2 - 18;  // 36 / 2
      this.y = canvas.height - 68;
   }
}
