function showbutton(){
    let button = document.getElementById("dropdown").value;
    let radius=document.getElementById("radius")
    let height=document.getElementById("height")
    let frustum1=document.getElementById("frustum1")
    let frustum2=document.getElementById("frustum2")
    let cube=document.getElementById("cube")
    let cuboid1=document.getElementById("cuboid1")
    let cuboid2=document.getElementById("cuboid2")
    radius.style.display='none';
    height.style.display='none';
    cube.style.display='none';
    cuboid1.style.display='none';
    cuboid2.style.display='none';
    frustum1.style.display='none';
    frustum2.style.display='none';
    
    radius.value = "";
            height.value = "";
            frustum1.value = "";
            frustum2.value = "";
            cube.value = "";
            cuboid1.value = "";
            cuboid2.value = "";
    if (button=="Cylinder"){
        height.style.display='block';
        radius.style.display='block';
    }
    if (button=="Cube"){
        cube.style.display='block';
    }
    if (button=="Cuboid"){
        cuboid1.style.display='block';
        cuboid2.style.display='block';
        height.style.display='block';
    }
    if (button=="Cone"){
        radius.style.display='block';
        height.style.display='block';
    }
    if (button=="Sphere"){
        radius.style.display='block';
    }
    if (button=="Hemisphere"){
        radius.style.display='block';
    }
    if (button=="Frustum"){
        frustum1.style.display='block';
        frustum2.style.display='block';
        height.style.display='block';
    }
    }
    document.getElementById("dropdown").addEventListener('change',showbutton);
    showbutton();
    function calculatevolume(){
    let radius=parseFloat(document.getElementById("radius").value);
    let height=parseFloat(document.getElementById("height").value);
    let frustum1=parseFloat(document.getElementById("frustum1").value);
    let frustum2=parseFloat(document.getElementById("frustum2").value);
    let cube=parseFloat(document.getElementById("cube").value);
    let cuboid1=parseFloat(document.getElementById("cuboid1").value);
    let cuboid2=parseFloat(document.getElementById("cuboid2").value); 
    //let Calculate=parseFloat(document.getElementById("Calculatebox").value); 
    let calculate;
    let shape=document.getElementById("dropdown").value;
        if (shape=="Cylinder"){
            calculate=(Math.PI*radius*radius*height)
        }
        if (shape=="Cube"){
            calculate=(cube*cube*cube)
        }
        if (shape=="Cuboid"){
            calculate=(height*cuboid1*cuboid2)
        }
        if (shape=="Cone"){
            calculate=(Math.PI*radius*radius*height)/3
        }
        if (shape=="Sphere"){
            calculate=(4*Math.PI*radius*radius)
        }
        if (shape=="Hemisphere"){
            calculate=(2*Math.PI*radius*radius)
        }
        if (shape=="Frustum"){
            calculate=(Math.PI*height)*(frustum1*frustum1 + frustum1*frustum2 + frustum2*frustum2)/3
        }
        document.getElementById("Calculatebox").value = "Volume: " + calculate;
    }
    document.getElementById("calculate").addEventListener('click',calculatevolume)
    document.getElementById("dropdown").dispatchEvent(new Event("change"));