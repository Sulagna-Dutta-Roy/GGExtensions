(function($) {
$(function() {

	if (!localStorage.options) localStorage.options = '{}';
	if (!localStorage.tasks) localStorage.tasks = '[]';

	// update to the new storage structure
	if (localStorage.task_0) {
		var tasks = [];
		for (var key in localStorage) {
			if (/task_/.test(key)) {
				tasks.push($.parseJSON(localStorage[key]));
				localStorage.removeItem(key);
			}
		}
		localStorage.tasks = JSON.stringify(tasks);
	}

	$('ul').dragsort({ dragSelector: 'div.drag', dragSelectorExclude: 'div.task, textarea.editable, div.menu', dragEnd: function() {
		update();
		outputTasks();
	}, placeHolderTemplate: '<li class="placeholder"></li>' });

	$('#options').click(function() {
		chrome.tabs.create({'url': 'options.html'});
	});

	var isChrome = false;
	if (
		(navigator.userAgent.match(/Chrome/i)) &&
		!(navigator.userAgent.match(/OPR/i)) &&
		!(navigator.userAgent.match(/YaBrowser/i))
	) isChrome = true;

	if (isChrome) {
		var getSyncData = function() {
			chrome.storage.sync.get('syncData', function(data) {
				localStorage.clear();
				localStorage.options = '{}';
				localStorage.tasks = '[]';
				var storage = data.syncData;
				for (var key in storage) {
					localStorage[key] = storage[key];
				}
				// update to the new storage structure
				if (localStorage.task_0) {
					var tasks = [];
					for (key in localStorage) {
						if (/task_/.test(key)) {
							tasks.push($.parseJSON(localStorage[key]));
							localStorage.removeItem(key);
						}
					}
					localStorage.tasks = JSON.stringify(tasks);
				}
				outputTasks();
				badge();
			});
		};
		getSyncData();
		chrome.storage.onChanged.addListener(
			function(changes, namespace) {
				getSyncData();
			}
		);
		var doSyncData = function() {
			var json = {};
			json.syncData = $.parseJSON(JSON.stringify(localStorage));
			chrome.storage.sync.set(json);
		};
	}

	function update(newItem, index, text, completed, priority, completedAll, saveItem) {
		var tasks = [];
		if (newItem) {
			tasks = $.parseJSON(localStorage.tasks);
			tasks.push({
				'text': encodeURIComponent($.trim( $('#new-task').val() )),
				'completed': 0,
				'priority': 0
			});
		} else if (completed) {
			tasks = $.parseJSON(localStorage.tasks);
			tasks[index].completed = completed;
		} else if (completedAll) {
			tasks = $.parseJSON(localStorage.tasks);
			for (var i = 0; i < tasks.length; i++) {
				tasks[i].completed = completedAll;
			}
		} else if (priority) {
			tasks = $.parseJSON(localStorage.tasks);
			tasks[index].priority = priority;
		} else if (saveItem) {
			tasks = $.parseJSON(localStorage.tasks);
			tasks[index].text = text;
		} else {
			$('li').each(function(index) {
				tasks.push({
					'text': encodeURIComponent($.trim( $(this).find('textarea.editable').val() )),
					'completed': ( $(this).is('.completed') ) ? 1 : 0,
					'priority': $(this).data('priority')
				});
			});
		}
		localStorage.tasks = JSON.stringify(tasks);
	}

	function clickableLink(text) {
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp, "<a href='$1'>$1</a>");
	}

	function setOptions() {
		var options = $.parseJSON(localStorage.options);
		var popupWidth = (options.popup_width) ? options.popup_width : 400;
		$('body').css('width', popupWidth);
		if (options.task_css) $('div.task').attr('style', decodeURIComponent(options.task_css));
		if (options.color1) {
			$('li.priority1 div.task').css('color', options.color1);
			$('div.pr[data-index="1"]').css('background', options.color1);
		}
		if (options.color2) {
			$('li.priority2 div.task').css('color', options.color2);
			$('div.pr[data-index="2"]').css('background', options.color2);
		}
		if (options.color3) {
			$('li.priority3 div.task').css('color', options.color3);
			$('div.pr[data-index="3"]').css('background', options.color3);
		}
	}

	// save edited task
	function saveTask(textarea) {
		var li = textarea.closest('li');
		textarea.hide()
			.siblings('div.save').hide()
			.siblings('div.edit').show().removeAttr('style');
		update(newItem = false, index = li.data('index'), text = encodeURIComponent($.trim(textarea.val())), completed = false, priority = false, completedAll = false, saveItem = 1);
		outputTasks();
	}

	// output tasks
	function outputTasks(newItem) {
		var tasks = '';
		var tasksArray = $.parseJSON(localStorage.tasks);
		for (var i = 0; i < tasksArray.length; i++) {
			var data = tasksArray[i];
			var	divTask = '',
					classCompleted = '',
					classNew = '',
					classPriority = '',
					active1 = '',
					active2 = '',
					active3 = '',
					active0 = '';
			if (data.completed == 1) classCompleted = ' class="completed"';
			if (newItem && i == tasksArray.length - 1) classNew = ' class="new"';
			if (data.priority !== 0) classPriority = ' class="priority' + data.priority + '"';
			if (data.priority == 1) active1 = ' active';
			if (data.priority == 2) active2 = ' active';
			if (data.priority == 3) active3 = ' active';
			if (data.priority === 0) active0 = ' active';
			var task = decodeURIComponent(data.text);
			divTask = task.replace(/\n/g, '<br>');
			divTask = clickableLink(divTask);
			tasks +='<li data-index="' + i + '" data-priority="' + data.priority + '"' + classCompleted + classNew + classPriority + '>' +
								'<div class="task">' + divTask + '</div>' +
								'<textarea class="editable">' + task + '</textarea>' +
								'<div class="checkbox"></div>' +
								'<div class="edit" title="Edit" data-i18n-title="edit"></div>' +
								'<div class="action"></div>' +
								'<div class="drag"></div>' +
								'<div class="menu">' +
									'<div class="priority" data-i18n="priority">Priority:</div>' +
									'<div class="pr' + active1 + '" data-index="1">1</div>' +
									'<div class="pr' + active2 + '" data-index="2">2</div>' +
									'<div class="pr' + active3 + '" data-index="3">3</div>' +
									'<div class="pr' + active0 + '" data-index="0">0</div>' +
									'<div class="delete" data-i18n="delete">Delete</div>' +
								'</div>' +
								'<div class="save" title="Save" data-i18n-title="save"></div>' +
							'</li>';
		}
		$('ul').empty().append(tasks);
		$('li.completed').each(function() {
			$(this).appendTo('ul');
		});
		setTimeout(function() {
			$('li.new').removeClass('new');
		}, 500);


		// priority1
		var priority1 = '';
		$('li.priority1').each(function() {
			priority1 += $('<div />').append($(this).clone()).html();
			$(this).remove();
		});
		$('ul').prepend(priority1);

		// priority2
		var priority2 = '';
		$('li.priority2').each(function() {
			priority2 += $('<div />').append($(this).clone()).html();
			$(this).remove();
		});
		if ( $('li.priority1').length ) {
			$('li.priority1:last').after(priority2);
		} else {
			$('ul').prepend(priority2);
		}

		// priority3
		var priority3 = '';
		$('li.priority3').each(function() {
			priority3 += $('<div />').append($(this).clone()).html();
			$(this).remove();
		});
		if ( $('li.priority2').length ) {
			$('li.priority2:last').after(priority3);
		} else if ( $('li.priority1').length ) {
			$('li.priority1:last').after(priority3);
		} else {
			$('ul').prepend(priority3);
		}

		if ( $('li').length && $('li').length == $('li.completed').length ) {
			$('div.check-all').addClass('checked');
		}

		setOptions();
		setTimeout(function() {
			if (isChrome) doSyncData();
		}, 500);

		$('body *').each(function() {
			translation($(this));
		});
	} // end output tasks

	// translation
	var translation = function(element) {
		var el = element;
		if ( el.attr('data-i18n') ) {
			el.text( chrome.i18n.getMessage( el.attr('data-i18n') ) );
		}
		if ( el.attr('data-i18n-title') ) {
			el.attr('title', chrome.i18n.getMessage( el.attr('data-i18n-title') ) );
		}
		if ( el.attr('placeholder') ) {
			el.text('');
			el.attr('placeholder', chrome.i18n.getMessage( el.attr('data-i18n') ) );
		}
	};

	function badge() {
		chrome.browserAction.setBadgeText({ text: '' + $('li:not(.completed)').length + '' });
	}

	chrome.browserAction.setBadgeBackgroundColor({color: '#777' });
	outputTasks();
	badge();

	if ( $('ul.tasks li').length ) $('div.check-all').show();
	if ( $('li.completed').length ) $('div.del-completed').show();

	// mark/unmark all tasks as completed
	$('div.check-all').click(function() {
		if ( $(this).is('.checked') ) {
			$(this).removeClass('checked');
			$('li').removeClass('completed');
			update(newItem = false, index = false, text = false, completed = false, priority = false, completedAll = '0', saveItem = false);
			outputTasks();
		} else {
			$(this).addClass('checked');
			$('li').addClass('completed');
			update(newItem = false, index = false, text = false, completed = false, priority = false, completedAll = '1', saveItem = false);
			outputTasks();
		}
		if ( $('li.completed').length ) $('div.del-completed').show();
			else $('div.del-completed').hide();
		badge();
	});

	// delete all completed
	$('div.del-completed').click(function() {
		$('li.completed').addClass('remove');
		setTimeout(function() {
			$('li.remove').remove();
			$('div.check-all').removeClass('checked');
			if ( $('ul.tasks li').length < 1 ) $('div.check-all').hide();
			$('div.del-completed').hide();
			update();
			outputTasks();
		}, 500);
	});

	$('ul')
		// mark/unmark task as completed
		.on('click', 'div.checkbox', function() {
			$('div.check-all').removeClass('checked');
			var li = $(this).closest('li');
			if ( li.is('.completed') ) {
				li.removeClass('completed');
				update(newItem = false, index = li.data('index'), text = false, completed = '0', priority = false, completedAll = false, saveItem = false);
				outputTasks();
				$('li.completed').appendTo('ul');
			} else {
				li.addClass('completed');
				update(newItem = false, index = li.data('index'), text = false, completed = '1', priority = false, completedAll = false, saveItem = false);
				outputTasks();
				$('li.completed').appendTo('ul');
			}
			if ( $('li.completed').length ) $('div.del-completed').show();
				else $('div.del-completed').hide();
			badge();
		})
		// show menu
		.on('click', 'div.action', function() {
			$(this).closest('li').siblings().find('div.menu').hide();
			var menu = $(this).siblings('div.menu');
			if ( menu.is(':visible') ) {
				menu.hide();
			} else {
				menu.show();
			}
		})
		// make task editable
		.on('click', 'div.edit', function() {
			var li = $(this).closest('li');
			li.find('div.task').hide();
			var ta = li.find('textarea.editable');
			var taVal = ta.val();
			ta.show().val('').focus().val(taVal).css('height', '16px').height(ta[0].scrollHeight - 3);
			li.find('div.save').show();
			li.find('div.menu').hide();
			li.find('div.edit, div.action').css('right', -50);
		})
		// save task on blur
		.on('blur', 'textarea.editable', function() {
			saveTask( $(this) );
		})
		// save task on 'Save' button click
		.on('click', 'div.save', function() {
			saveTask( $(this).siblings('textarea.editable') );
		})
		// save task
		.on('keydown', 'textarea.editable', function(e) {
			var options = $.parseJSON(localStorage.options);
			if (!options.hotkeys || options.hotkeys == '0') {
				// Enter - save task
				if (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey) {
					$(this).blur();
				// Ctrl + Enter - new line
				} else if (e.ctrlKey && e.keyCode == 13) {
					$(this).val(function(i, val){
						return val + '\n';
					});
				}
			} else if (options.hotkeys == '1') {
				// Ctrl + Enter - save task (Enter - new line)
				if (e.ctrlKey && e.keyCode == 13) {
					$(this).blur();
				}
			}
		})
		// textarea auto resize
		.on('keyup', 'textarea.editable', function(e) {
			$(this).height(0);
			$(this).height(this.scrollHeight - 3);
		})
		// delete task
		.on('click', 'div.delete', function() {
			$(this).closest('li').addClass('remove');
			setTimeout(function() {
				$('li.remove').remove();
				if ( $('ul.tasks li').length < 1 ) $('div.check-all').hide();
				update();
				outputTasks();
				badge();
			}, 500);
		})
		// change task priority
		.on('click', 'div.pr', function() {
			var li = $(this).closest('li');
			$(this).addClass('active').siblings().removeClass('active');
			li.data('priority', $(this).data('index'));
			update(newItem = false, index = li.data('index'), text = false, completed = false, priority = li.data('priority').toString(), completedAll = false, saveItem = false);
			outputTasks();
		})
		// click on a link
		.on('click', 'a', function() {
			chrome.tabs.create({'url': $(this).attr('href')});
		});

	// textarea auto resize
	function textareaResize() {
		var ta = $('#new-task');
		ta.css('height', '16px');
		ta.height(ta[0].scrollHeight);
	}
	function delayedResize() {
		window.setTimeout(textareaResize, 0);
	}
	textareaResize();

	if (localStorage.autosave) {
		setTimeout(function() {
			$('#new-task').val( decodeURIComponent(localStorage.autosave) ).keydown();
		}, 0);
	}

	$('#new-task')
		.focus()
		.on('cut paste drop keydown', function() {
			delayedResize();
		})
		// new task hotkeys
		.keydown(function(e) {
			var options = $.parseJSON(localStorage.options);
			if (!options.hotkeys || options.hotkeys == '0') {
				// Enter - add new task
				if (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey) {
					e.preventDefault();
					$('#submit').click();
				// Ctrl + Enter - new line
				} else if (e.ctrlKey && e.keyCode == 13) {
					$(this).val(function(i, val){
						return val + '\n';
					});
				}
			} else if (options.hotkeys == '1') {
				// Ctrl + Enter - add new task (Enter - new line)
				if (e.ctrlKey && e.keyCode == 13) {
					$('#submit').click();
				}
			}

		})
		.keyup(function() {
			// autosave
			var newTask = $(this).val();
			if (newTask === '') {
				localStorage.removeItem('autosave');
			} else {
				localStorage.autosave = encodeURIComponent($.trim(newTask));
			}
			if (isChrome) doSyncData();
		});

	// add new task
	$('#submit').click(function() {
		var newTask = $('#new-task');
		if (newTask.val() !== '') {
			update(newItem = 1);
			outputTasks(newItem = 1);
			newTask.val('');
			localStorage.removeItem('autosave');
			badge();
			if ( $('ul.tasks li').length ) $('div.check-all').show();
		}
	});

	$(document).on('click', function(e) {
		if (!$(e.target).is('.action')) {
			$('div.menu').hide();
		}
	});

});
})(jQuery);