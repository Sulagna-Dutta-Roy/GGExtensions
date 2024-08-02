let JimCarryImages=[
    "https://wallpapers.com/images/high/jim-carrey-funny-expression-a9mv7pm39mr6oi70.webp",
    "https://cdn.mos.cms.futurecdn.net/xMKqQKvNAXqDcmD7HFcPjG-1200-80.jpg.webp",
    "https://wallpapers.com/images/high/jim-carrey-funny-expression-a9mv7pm39mr6oi70.webp",
    "https://en.wikipedia.org/wiki/File:Jim_Carrey_2008.jpg",
    "https://www.hola.com/us/images/0257-0e19a95a8fd9-f1eeab240137-1000/vertical-1150/jim-carrey-divertidas-caras03.jpg",
    "https://www.hola.com/us/images/0257-0e19a95a8fdb-275908c9437b-1000/vertical-1150/jim-carrey-divertidas-caras07.jpg",
    "https://www.hola.com/us/images/0257-0e19a95a8fdc-b66e2bcb03ab-1000/vertical-1150/jim-carrey-divertidas-caras08.jpg",
    "https://www.onthisday.com/images/people/jim-carrey.jpg?w=360"
    

];
//to replace web images with JimCarry images
const imgs=document.getElementsByTagName("img");
for(let i=0;i<imgs.length;i++){
    const randomImg=Math.floor(Math.random()*JimCarryImages.length);
    imgs[i].src=JimCarryImages[randomImg];
}