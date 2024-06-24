
var btnAlarm = document.querySelector("#btnAlarm");
var btnHome = document.querySelector("#btnHome");
var btnSetting = document.querySelector("#btnSetting");
var Alarm = document.querySelector("#Alarm");
var Home = document.querySelector("#Home");
var Setting = document.querySelector("#Setting");
var calendertable = document.querySelector(".tableCon");
var alarmtable = document.querySelector(".alarmCon");
var todaybtn = document.querySelector("#today");
var upcomingbtn = document.querySelector("#upcoming");
var fil = document.querySelector("#filter");

var host_sites=['codeforces.com','codechef.com','atcoder.jp','leetcode.com','codingninjas.com/codestudio','hackerearth.com','geeksforgeeks.org','topcoder.com'];
var hosts = `codechef.com%2Ccodeforces.com%2Cgeeksforgeeks.org%2Chackerearth.com%2Cleetcode.com%2Ctopcoder.com%2Catcoder.jp%2Ccodingninjas.com/codestudio`;
var today = false;
const iddata = new Map();
var apiData;
let dur = 24*60*60; 

if(localStorage.getItem("alarms") === null)
{
		localStorage.setItem("alarms",JSON.stringify([]));
}

fil.addEventListener('change',()=>{
    var temp = fil.value;
	if(temp === "dur3")
	  dur = 3*60*60;
	if(temp === "dur24")
	  dur = 24*60*60; 
	if(temp === "durg24")
	   dur = 365*24*60*60; 
    render();
    // console.log(dur);
})



btnAlarm.addEventListener('click',()=>{
    Home.classList.add("hidden");  
    Setting.classList.add("hidden");
    Alarm.classList.remove("hidden");
	btnAlarm.classList.add("okactive");
	btnHome.classList.remove("okactive");
	btnSetting.classList.remove("okactive");
})

btnHome.addEventListener('click',()=>{
    Alarm.classList.add("hidden");  
    Setting.classList.add("hidden");
    Home.classList.remove("hidden");
	btnAlarm.classList.remove("okactive");
	btnHome.classList.add("okactive");
	btnSetting.classList.remove("okactive");
})

btnSetting.addEventListener('click',()=>{
    Home.classList.add("hidden");  
    Alarm.classList.add("hidden");
    Setting.classList.remove("hidden");
	btnAlarm.classList.remove("okactive");
	btnHome.classList.remove("okactive");
	btnSetting.classList.add("okactive");
})

todaybtn.addEventListener('click',()=>{
    today=true;
    todaybtn.classList.add("okactive");  
    upcomingbtn.classList.remove("okactive");
    render();
})

upcomingbtn.addEventListener('click',()=>{
    today=false;
    todaybtn.classList.remove("okactive"); 
    upcomingbtn.classList.add("okactive");
    render();
})



const logo = new Map();
logo.set('atcoder.jp', 'atcoder.png');
logo.set('leetcode.com', 'leetcode.png');
logo.set('topcoder.com', 'topcoder.png');
logo.set('codechef.com', 'codechef.png');
logo.set('codeforces.com', 'codeforces.png');
logo.set('hackerearth.com', 'HackerEarth.png');
logo.set('geeksforgeeks.org', 'GeeksforGeeks.png');
logo.set('codingninjas.com/codestudio', 'codingNinja.png'); 



//host from local


var host;
if (localStorage.getItem('host-sites') === null) { host = host_sites; localStorage.setItem('host-sites', JSON.stringify(host_sites));} 
else { host = JSON.parse(localStorage.getItem('host-sites'));}
    host.forEach(function(host_site) {
		document.getElementsByName(`${host_site}`)[0].checked = true;
	})

//time

 var curr_time = new Date();
 const curr_time_api_temp = curr_time.toISOString().substring(0, 11) + curr_time.toISOString().substring(11, 19);
 var tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 tomorrow.setHours('00', '00', '00');
 var day15back = new Date();
 day15back.setDate(day15back.getDate() - 15);    // For checking atleast 15day last contests
 day15back.setHours('00', '00', '00');
 var day15back_time_api_temp = day15back.toISOString().substring(0, 11) + day15back.toISOString().substring(11, 19);



 //------------------------------- API Fetching-------------------------------------
 
 const apiUrl=`https://cp-calendar-server.vercel.app/upcomingContests/?`;
 async function FetchAPI() {
	try {
		const response = await fetch(`${(apiUrl + `&resource=${hosts}&end__gt=${curr_time_api_temp}&start__gt=${day15back_time_api_temp}`)}`);
		if (response.ok){
			const data = (await response.json());
			// console.log(data);
			console.log("Api Working Successfully");
			return data;
		}
		throw new Error('Network response was not ok.')
	} catch 
    {
        calendertable.innerHTML=`<div class="emptyAlarm red-alert">Unable to find contests!<br>This may be due to a Fail API Connection or you may be offline.</div>`;
		console.log("Api Fetching failed");
		document.querySelector(".loader").style.display="none"; 
		document.querySelector(".mainDIV").classList.remove("hidden"); 
	}
}


function plateform_localstorage() {
	for (var i = 1; i <= 8; i++) {
        document.querySelector(`#host${i}`).addEventListener("click", (btn) => {
			if (btn.target.checked) {
				if (!host.includes(btn.target.name)) 
					host.push(btn.target.name); } 
            else {
				const index = host.indexOf(btn.target.name);
				if (index > -1) 
					host.splice(index, 1);
			}
			render();
			localStorage.setItem('host-sites', JSON.stringify(host));
		});
	}
}

plateform_localstorage();


var todayStart = new Date();
todayStart.setHours('00', '00', '00');
const lastfetch = new Date(localStorage.getItem("timeUpdate"));
if (localStorage.getItem("contests") === null || localStorage.getItem("contests") === 'undefined' || lastfetch < todayStart) {
	FetchAPI().then(data => {
			apiData = data;		
			localStorage.setItem("contests", JSON.stringify(data));
			localStorage.setItem("timeUpdate", new Date());
			render();
				document.querySelector(".loader").style.display="none"; 
				document.querySelector(".mainDIV").classList.remove("hidden"); 
		})
} else {
	apiData = JSON.parse(localStorage.getItem("contests"));
	render();
	document.querySelector(".loader").style.display="none"; 
	document.querySelector(".mainDIV").classList.remove("hidden"); 
}

var alarm_object=[];
var alarm_id=[];

function render() {
	var tableItem = ``;
	alarm_id=[];
	var alreadySetAlarm = JSON.parse(localStorage.getItem('alarms'));
	apiData.objects.forEach(function (contest) {
		var start_time = new Date(contest.start + `.000Z`);
		var end_time = new Date(contest.end  + `.000Z`);
		if (today) {
			if (host.includes(contest.resource) && start_time < tomorrow && end_time > curr_time && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = ""+contest.event;
				if(conEvent.length>42)
                conEvent = conEvent.substring(0,42)+"....";
				var temp = `
				<div class="tableitem">
				<a href="${contest.href}" target="_blank">
				 <div class="details">
                  <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                  <span>${conEvent}</span>
                  <p>Started At: <strong>${date} ${time[1]}</strong></p>
                  <p>Duration: ${timeDuration} </p>
				  </div>
				  </a>
					<div class="alarm">
						${(alreadySetAlarm.includes(contest.id))?
						`<i class="fa-solid fa-check"></i>`
						:
						`<i class="fa-solid fa-bell" id="id${contest.id}"></i>`
						}
					</div>
                </div>
				`;
				if(!alreadySetAlarm.includes(contest.id))
				alarm_id.push(contest.id);
				tableItem += temp;
			}
		} else {
			if (host.includes(contest.resource) && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = ""+contest.event;
				if(conEvent.length>42)
                conEvent = conEvent.substring(0,42)+"....";
				var temp = `
				<div class="tableitem">
				<a href="${contest.href}" target="_blank">
				 <div class="details">
                  <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
                  <span>${conEvent}</span>
                  <p>Started At: <strong>${date} ${time[1]}</strong></p>
                  <p>Duration: ${timeDuration} </p>
				  </div>
				  </a>
				  <div class="alarm">
					${(alreadySetAlarm.includes(contest.id))?
					`<i class="fa-solid fa-check"></i>`
					:
					`<i class="fa-solid fa-bell" id="id${contest.id}"></i>`
					}
				  </div>
                </div>
				`;
				if(!alreadySetAlarm.includes(contest.id))
				alarm_id.push(contest.id);
				tableItem += temp;
			}
		}
	})
	fetch_idddata();
	calendertable.innerHTML = tableItem;
	alarm_object=[];
    alarm_id.forEach((id)=>{
		var temp = document.getElementById(`id${id}`);
		alarm_object.push(temp);
		temp.addEventListener('click',()=>{
			var alarmArray=[];
			 alarmArray = JSON.parse(localStorage.getItem("alarms"));
            if(!alarmArray.includes(id))
			  alarmArray.push(id);
			localStorage.setItem('alarms',JSON.stringify(alarmArray));
			fetchAlarm();
			render();
		})
	})
	fetchAlarm();
	if (tableItem === ``) {
		calendertable.innerHTML = `
		<div class="emptyAlarm">
		Empty Section<br>
		Contest details not found!
		</div>
	`
	}
}

function fetchTime(contest){
	const minutes = (parseInt(contest.duration) / 60) % 60;
	const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
	const days = parseInt((parseInt(contest.duration) / 3600) / 24);
	var timeDuration = ``;
	if (days > 0)
		timeDuration += `${days} days `;
	if (hours > 0) 
		timeDuration += `${hours} hours `;
	if (minutes > 0)
		timeDuration += `${minutes} minutes `;
	return timeDuration;
}

function fetch_idddata(){
	iddata.clear();
    apiData.objects.forEach(function (contest) {
		var timeDuration = fetchTime(contest);
		var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
		const time = start.split(', ');
		var date = time[0].split('/');
		date0 = `${date[1]}/${date[0]}/${date[2]} ${time[1]}`;
		date = `${date[2]}-${date[0]}-${date[1]}`;
		var conEvent = ""+contest.event;
		if(conEvent.length>42)
        conEvent = conEvent.substring(0,42)+"....";
		iddata.set(contest.id,[conEvent,contest.href,`${date0}`,timeDuration,contest.resource,new Date(`${date} ${time[1]}`)]);
	});
	var tempArr = JSON.parse(localStorage.getItem("alarms"));
	var tempArr1 = [];
	tempArr.forEach((e)=>{
		if(iddata.get(e) != undefined)
		{
			tempArr1.push(e);
		}
		// console.log(tempArr1);
	localStorage.setItem("alarms",JSON.stringify(tempArr1));
	});
}

var updatetimer=[];
function fetchAlarm(){
	var temp = '';
	var alarmArray1 = JSON.parse(localStorage.getItem("alarms"));
	
	if (alarmArray1.length===0) {
		alarmtable.innerHTML = `
		    <div class="emptyAlarm">
			Empty Section.<br>
			Let set your important contests here.
			</div>
		`
		return;
	}

	var tempA = [];
	var cur_time = Date.parse(new Date());
	alarmArray1.forEach((e)=>{
         tempA.push([Date.parse(iddata.get(e)[5]) - cur_time,e]);
	})
	tempA.sort((a,b)=>{
		return a[0] - b[0];
	});
	// console.log(tempA);
	for(var i = 0;i<alarmArray1.length;i++)
	{
		alarmArray1[i] = tempA[i][1];
	}
    localStorage.setItem("alarms",JSON.stringify(alarmArray1));
	alarmArray1.forEach((id)=>{
         temp +=`
		 <div class="tableitem">
		 <a href="${iddata.get(id)[1]}" target="_blank">
		  <div class="details">
		   <img class="logo" src="images/${logo.get(iddata.get(id)[4])}" alt="png">
		   <span>${iddata.get(id)[0]}</span>
		   <p>Started At: <strong>${iddata.get(id)[2]}</strong></p>
		   <p>Duration: ${iddata.get(id)[3]} </p>
		   <p> Time Left: <span class="update" id="update${id}"> </span>
		   </div>
		   </a>
		   <div class="delete">
			 <i class="fa-regular fa-circle-xmark" id="del${id}"></i> 
			</div>
		 </div>
		 `
	})
    alarmtable.innerHTML = temp;
    
	alarmArray1.forEach((id)=>{
	document.querySelector(`#del${id}`).addEventListener('click',()=>{
		var tempData = JSON.parse(localStorage.getItem("alarms"));
		chrome.alarms.clear(iddata.get(id)[1]);
		// chrome.alarms.getAll((e)=>{console.log(e)});
	    tempData = tempData.filter((e)=>{
			return e!=id;
		})
		alarmArray1 = tempData;
		localStorage.setItem("alarms",JSON.stringify(tempData));
		fetchAlarm();
		render();
	});
    })

	alarmArray1 = JSON.parse(localStorage.getItem("alarms"));
    
	updatetimer=[];
	// chrome.alarms.clearAll();
	alarmArray1.forEach((id)=>{
	var countDownDate = (iddata.get(id)[5]).getTime();
	if(alarmArray1.find((e)=>{return e === id}) && (iddata.get(id)[5]).getTime()-2*60*1000 > (new Date()).getTime())
	{ createalarm(id);}
	var x = setInterval(function() {
	var now = new Date().getTime();
	var distance = countDownDate - now;
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	alarmArray1 = JSON.parse(localStorage.getItem("alarms"));
	if(alarmArray1.find((e)=>{return e === id}))
	 {document.getElementById(`update${id}`).innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";}
	else
	 {
		 distance = -99999999999;
	 }
	if(distance === -99999999999)
	 {  clearInterval(x); }
	else if (distance < 0 ) {
	  clearInterval(x);
	  chrome.alarms.clear(iddata.get(id)[1]);
	  createnotification(id);
	  document.getElementById(`update${id}`).innerHTML = "Started";
      alarmArray1 = alarmArray1.filter(function(value){ 
        return value != id;
       });
	   localStorage.setItem("alarms",JSON.stringify(alarmArray1));
	   fetchAlarm();
	   render();
	}
	}, 1000);
    })
}




function createalarm(id){
	// chrome.alarms.getAll((e)=>{console.log(e)});
	chrome.alarms.create(iddata.get(id)[1], { when:(new Date(iddata.get(id)[5]).getTime() - 2*60*1000)});
	// console.log(new Date((iddata.get(id)[5]).getTime() - 2*60*1000));
}

function createnotification(id){
	chrome.notifications.create(""+id, {
		type: 'basic',
		iconUrl: `images/${logo.get(iddata.get(id)[4])}`,
		title: iddata.get(id)[4],
		message: iddata.get(id)[0],
		priority: 2,
		eventTime: Date.now(),
		buttons: [
			{
				title: 'Visit Now'
			},
			{
				title: 'Later'
			}
		]
	});
}


{
	var genUserID = "";
	var isNewUser = false;
	var isUnique = false;
	chrome.storage.local.get(["NCPCID"]).then((result) => {
		genUserID = result.NCPCID;
		// console.log(genUserID);
		if(localStorage.getItem("NCPCID") === null)
		{
			isNewUser = true;
			localStorage.setItem("NCPCID",genUserID);
		}else{
			genUserID = localStorage.getItem("NCPCID");
		}
		var currDay = new Date();
		var year = currDay.getFullYear();
		var month = String(currDay.getMonth() + 1).padStart(2, '0');
		var day = String(currDay.getDate()).padStart(2, '0'); 
		var currDay = `${year}-${month}-${day}`;
		if(localStorage.getItem("currDay") === null || localStorage.getItem("currDay") != currDay)
		{
			isUnique = true;
			localStorage.setItem("currDay",currDay);
		}

		fetch("https://extensions-info-api.vercel.app/api/collect", {
		method: "POST",
		body: JSON.stringify({
			"extension": "CPCalendar",
			"isNewUser": isNewUser,
			"userID": genUserID,
			"isUnique": isUnique,
			"day": currDay
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
		});
   });
}

