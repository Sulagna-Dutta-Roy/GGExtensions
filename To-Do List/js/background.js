// show badge on browser load
var counter = 0;
if (localStorage.tasks) {
	var tasks = JSON.parse(localStorage.tasks);
	if (tasks.length > 0) {
		// count the uncompleted tasks
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].completed != 1) counter += 1;
		}
	}
}
chrome.browserAction.setBadgeText({ text: '' + counter + '' });
chrome.browserAction.setBadgeBackgroundColor({color: '#777' });

// add context menu for selected text
if (localStorage.options) {
	var options = JSON.parse(localStorage.options);
	if (options.context_menu == '1') {
		chrome.contextMenus.create({
			title: chrome.i18n.getMessage('saveAsTask'),
			contexts: ["selection"],
			onclick: contextAddTask
		});

		// save new task from context menu
		function contextAddTask(info) {
			chrome.extension.sendMessage({addTask: info.selectionText}, function(response) {
				var tasks = JSON.parse(localStorage.tasks);
				tasks.push({
					'text': encodeURIComponent(info.selectionText),
					'completed': 0,
					'priority': 0
				});
				localStorage.tasks = JSON.stringify(tasks);

				var isChrome = false;
				if (
					(navigator.userAgent.match(/Chrome/i)) &&
					!(navigator.userAgent.match(/OPR/i)) &&
					!(navigator.userAgent.match(/YaBrowser/i))
				) isChrome = true;

				function doSyncData() {
					var json = {};
					json.syncData = JSON.parse(JSON.stringify(localStorage));
					chrome.storage.sync.set(json);
				}
				if (isChrome) doSyncData();

				chrome.browserAction.setBadgeText({ text: '' + JSON.parse(localStorage.tasks).length + '' });
			});
		}
	}
}