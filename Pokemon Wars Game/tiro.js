var SOM_TIRO = new Audio();
SOM_TIRO.src = 'snd/tiro.mp3';
SOM_TIRO.volume = 1;
SOM_TIRO.load();

var img = new Image();

// function Tiro(context, nave, imagem) {
//    this.context = context;
//    this.nave = nave;
//    this.imagem = imagem;

function Tiro(context, nave, imagem) {
   this.context = context;
   this.nave = nave;
   this.imagem = imagem;

   // Posicionar o tiro no bico da nave
   this.largura = 3;
   this.altura = 10;   
   this.x = nave.x + 18;  // 36 / 2
   this.y = nave.y - this.altura;
   this.velocidade = 400;
   
   // this.cor = 'yellow';
   SOM_TIRO.currentTime = 0.0;
   SOM_TIRO.play();
}
Tiro.prototype = {
   atualizar: function() {
      this.y -= 
         this.velocidade * this.animacao.decorrido / 1000;
      
      // Excluir o tiro quando sumir da tela
      if (this.y < -this.altura) {
         this.animacao.excluirSprite(this);
         this.colisor.excluirSprite(this);
      }
   },
   desenhar: function() {
      //var ctx = this.context;
      // ctx.save();
      //ctx.fillStyle = this.cor;
      //ctx.fillRect(this.x, this.y, this.largura, this.altura);
      //ctx.restore();

      var ctx = this.context;
      img.src = './img/tiro.png'
      ctx.drawImage(img, this.x - 6, this.y, img.width, img.height);
   },
   retangulosColisao: function() {
      return [ {x: this.x, y: this.y, largura: this.largura,
            altura: this.altura} ];
   },
   colidiuCom: function(outro) {
   
   }
}
