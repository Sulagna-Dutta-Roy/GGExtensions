/*<section class="menu">
  <ul class="menu-options">
    <li onclick="if(confirm('Please confirm you want to disconnect the session.')){history.go(-1);}" class="menu-option">Back</li>
    <li onclick="if(confirm('Please confirm you want to disconnect the session.')){location.reload();}" class="menu-option">Reload</li>
    <li onclick="downloadPage('prenamed');" class="menu-option">Save</li
    <li onclick="downloadPage('custom');" class="menu-option">Save As</li>
    <li onclick="document.getElementById('console').style.display='block';" class="menu-option">Debugger</li>
    <li onclick="document.querySelector('section').style.display='none';document.getElementById('u').style.left='50px';setTimeout(function(){document.getElementById('currentElementHTML').value='';},100);" onmouseup="setTimeout(function(){document.getElementById('currentElementHTML').value='';},100);document.getElementById('u').style.left='40px';" onmouseout="document.getElementById('u').style.left='50px';" class="menu-option" id="inspect-element">This element</li>
  </ul>
</section>*/
var newMenu = document.createElement('section');
newMenu.className = 'menu';
document.body.appendChild(newMenu);
var newMenuOptions = document.createElement('ul');
newMenuOptions.className = 'menu-options';
document.getElementsByClassName('menu')[0].appendChild(newMenuOptions);
var newli1 = document.createElement('li');
var newli2 = document.createElement('li');
var newli3 = document.createElement('li');
var newli4 = document.createElement('li');
var newli5 = document.createElement('li');
var newli6 = document.createElement('li');
document.getElementsByClassName('menu-options')[0].appendChild(newli1);

const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;

const toggleMenu = command => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", e => {
  if (menuVisible) toggleMenu("hide");
});

menuOption.addEventListener("click", e => {
  console.log("mouse-option", e.target.innerHTML);
  toggleMenu('hide');
});

window.addEventListener("contextmenu", e => {
  e.preventDefault();
  const origin = {
    left: e.pageX,
    top: e.pageY
  };
  setPosition(origin);
  return false;
});
