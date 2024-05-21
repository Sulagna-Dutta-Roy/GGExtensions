let JimCarryImages=[
    "https://i.guim.co.uk/img/media/c7017e77c9be1ebd9b311832df47b7c0f9667c3f/458_42_4409_2645/master/4409.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=fab6e9471400aab8fc5f6ca24d434c44",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX5VfvzDfsXGdI_PWL80ANKAXwQww4EwYu7MlMHiaGbA&s",
    "https://i.pinimg.com/564x/76/11/7e/76117e0de7a853fca24c74483191e814.jpg",
    "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/21/1495469326-superman-red-eyes.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVeO4z4njKGLboFrE6dqnypIjr3fGR-qm0zu8u51zY7Q&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Xg580a2geg1AHKmLZ8kSfdF1uurBpFq0KIOgAQ1saQ&s",
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fvariety.com%2F2022%2Ffilm%2Fnews%2Fhenry-cavill-interview-superman-return-joyful-1235415466%2F&psig=AOvVaw1g2H94sJN8E9CDza1KZu4v&ust=1716382611337000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIiNm__lnoYDFQAAAAAdAAAAABAI",
    "https://m.media-amazon.com/images/I/81TgiKt15vL._AC_UF894,1000_QL80_.jpg"
    

];
//to replace web images with JimCarry images
const imgs=document.getElementsByTagName("img");
for(let i=0;i<imgs.length;i++){
    const randomImg=Math.floor(Math.random()*JimCarryImages.length);
    imgs[i].src=JimCarryImages[randomImg];
}