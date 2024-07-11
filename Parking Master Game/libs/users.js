var user = {};
(async function(){
	function genKey() {
	var n = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
	var o=[];
	for (var t = 0; t < 50; t++) {
	  var r = (Math.random() * (n.length-1)).toFixed(0);
	  o[t] = n[r]
	}
	var i = o.join("");
	return i;
	}
	localStorage['session-key'] ? void(0) : localStorage.setItem('session-key', genKey());
})();
user.serverURL = 'https://5e47-134-56-126-103.ngrok.io';
var emailsent = false;
user.signUp = function(e,p,se,er) {
   var o = this;
   var _em = e;
   var _pass = p;
   let eframe = document.createElement('iframe');
   function validateEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
   }
   if (emailsent == false) {
	if (validateEmail(_em) && String(_pass).length >= 8) {
	  var uframe = document.createElement('iframe');
	  uframe.src = `${o.serverURL}/if-user-exists.service?email=${_em}`;
	  uframe.style.display = 'none';
	  document.body.appendChild(uframe);
	  window.onmessage = function(event) {
	  uframe.remove();
	  if (event.data == "false") {
	  var subject = encodeURIComponent(`${location.hostname.split('')[0].toUpperCase()+location.hostname.split('.')[0].replace(location.hostname.split('')[0], '')} - Verify email`);
	  var msg = encodeURIComponent('Verify your email (' + _em + ') by clicking the link below.\n\n' + location.protocol + '//' + location.host + location.pathname + '?email=' + _em + '&pass=' + _pass + '&redirect=' + encodeURI(location.href) + '%23verified-email\n\nRegards,\n-' + location.hostname.split('')[0].toUpperCase()+location.hostname.split('.')[0].replace(location.hostname.split('')[0], ''));
	  eframe.src = `${o.serverURL}/email-send.php?to=${_em}&subject=${subject}&msg=${msg}`;
	  eframe.style.display = 'none';
	  document.body.appendChild(eframe);
	    window.addEventListener('message', function(e){
	    if (e.data != 'Error') {
		  for(var i = 0;i < document.querySelectorAll('input').length; i++) {
		    document.querySelectorAll('input')[i].blur();
		  }
		  emailsent = true;
		  se();
	     } else {
		  for(var i = 0; i < document.querySelectorAll('input').length; i++) {
		    document.querySelectorAll('input')[i].blur();
		  }
	       er();
	     }
	    });
	    return;
	  } else if (event.data == "true") {
	    er();
	  }
	};
	} else {
	  for (var i = 0; i < document.querySelectorAll('input').length; i++) {
	    document.querySelectorAll('input')[i].blur();
	  }
	  er();
	}
   }
};
user.logIn = function(u,p,scevt,erevt){
	function setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	   }
	   function getCookie(cname) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
		    c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
		    return c.substring(name.length, c.length);
		  }
		}
		return "";
	   }
	   function deleteAllCookies() {
		  var cookies = document.cookie.split(";");
	   
		  for (var i = 0; i < cookies.length; i++) {
			 var cookie = cookies[i];
			 var eqPos = cookie.indexOf("=");
			 var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			 document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		  }
	   }
  let o = document.createElement('iframe');
  o.src = `${user.serverURL}/login.service?email=${u}&pass=${p}`;
  o.style.display = 'none';
  document.body.appendChild(o);
  window.addEventListener('message', function(e){
	if (e.data == 'Error') {
	  o.remove();
	  erevt();
	} else {
	  var em = e.data.split('user-email:').pop().split(';')[0];
	  var pass = e.data.split('user-pass:').pop().split(';')[0];
	  var pts = e.data.split('user-points:').pop().split(';')[0];
	  var name = e.data.split('user-name:').pop().split(';')[0];
	  var pic = e.data.split('user-picture:').pop().split(';')[0];
	  setCookie('user-email', em);
	  setCookie('user-pass', pass);
	  setCookie('user-name', name);
	  setCookie('user-points', pts);
	  setCookie('user-picture', pic);
	  if (e.data == 'Error') {
	    erevt();
	  } else {
	    scevt();
	  }
	}
  });
};
user.get = function(cname) {
  if (cname != 'ip') {
	function getCookie(cname) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
		    c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
		    return c.substring(name.length, c.length);
		  }
		}
		return undefined;
	   }
  if (getCookie('user-email') && getCookie('user-pass')) {
    return getCookie('user-'+cname);
  } else {
    return null;
  }
} else {
	function Get(yourUrl){
		var Httpreq = new XMLHttpRequest();
		Httpreq.open("GET",yourUrl,false);
		Httpreq.send(null);
		return Httpreq.responseText;          
	 }
  return (JSON.parse(Get('https://api.ipify.org/?format=json')).ip);
}
}
user.logOut = function(){
  (function(){
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
    	   var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
    	   var p = location.pathname.split('/');
    	   document.cookie = cookieBase + '/';
    	   while (p.length > 0) {
    		  document.cookie = cookieBase + p.join('/');
    		  p.pop();
    	   };
    	   d.shift();
        }
    }
  })();
  sessionStorage.clear();
}
user.email = function(subject, message) {
  var ue = user.get('email');
  let o = document.createElement('iframe');
  o.src = `${this.serverURL}/email-send.php?to=${ue}&subject=${subject}&msg=${message}`;
  o.style.display = 'none';
  document.body.appendChild(o); 
  o.onload = function(){
    setTimeout(function(){o.remove()},1000);
    return true;
  };
}
window.addEventListener('load', function(){
	function getCookie(cname) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
		    c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
		    return c.substring(name.length, c.length);
		  }
		}
		return undefined;
	   }
	if (user.get('email') != null && user.get('pass') != null && localStorage['reset-passcode']) {
	    if (new URLSearchParams(location.search).get('reset-passcode')) {
		 if (new URLSearchParams(location.search).get('session-key') == localStorage['session-key']) {
	      var val = prompt('Enter your new password', '')
		 if (!val) {
		   // run it again
		   return;
		 } else {
		   let eframe = document.createElement('iframe');
		   eframe.src = `${user.serverURL}/reset-passcode.server?session-key=${localStorage['session-key']}&session=1Monkey-08_260&email=${new URLSearchParams(location.search).get('email')}&pass=${val}`;
		   eframe.style.display = 'none';
		   document.body.appendChild(eframe);
		 }
	      }
	    }
	}
});
user.resetPasscode = function(val){
	localStorage.setItem('reset-passcode', 'yes');
	if (val === '') {
	  return null;
	} else if ((val) && val.includes('@') && val.includes('.') && val.length >= 6) {
		let o = document.createElement('iframe');
		var subject = encodeURIComponent(`${location.hostname.split('')[0].toUpperCase()+location.hostname.split('.')[0].replace(location.hostname.split('')[0], '')} - Password reset`);
		var msg = encodeURIComponent('Reset your passcode by clicking the link below.\n\n' + location.protocol + '//' + location.host + location.pathname + '/?reset-passcode=true&session-key=' + localStorage['session-key'] + '&email=' + val + '\n\nRegards,\n-' + location.hostname.split('')[0].toUpperCase()+location.hostname.split('.')[0].replace(location.hostname.split('')[0], ''));
		o.src = `${this.serverURL}/email-send.php?to=${val}&subject=${subject}&msg=${msg}`;
		o.style.display = 'none';
		document.body.appendChild(o); 
		o.onload = function(){
		  setTimeout(function(){o.remove()},1000);
		  return true;
		};
	}
};
