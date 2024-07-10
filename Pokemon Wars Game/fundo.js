function Fundo(context, imagem) {
   this.context = context;
   this.imagem = imagem;
   this.velocidade = 0;
   this.posicaoEmenda = 0;
}
Fundo.prototype = {
   atualizar: function() {
      // Atualizar a posição de emenda
      this.posicaoEmenda += 
         this.velocidade * this.animacao.decorrido / 1000;
      
      // Emenda passou da posição
      if (this.posicaoEmenda > this.imagem.height)
         this.posicaoEmenda = 0;
   },
   desenhar: function() {
      var img = this.imagem;  // Para facilitar a escrita :D
      
      // Primeira cópia
      var posicaoY = this.posicaoEmenda - img.height;
      this.context.drawImage(img, 0, posicaoY, img.width, img.height);
      
      // Segunda cópia
      posicaoY = this.posicaoEmenda;
      this.context.drawImage(img, 0, posicaoY, img.width, img.height);     
   }
}

