(function($) {
$(function() {

	var manifest = chrome.runtime.getManifest();
	$('#version').text(manifest.version);

	function lStorage() {
		var data = JSON.stringify(localStorage);
		data = data.replace(/\\"/g, '"');
		data = data.replace(/"{/g, '{');
		data = data.replace(/\}"/g, '}');
		data = data.replace(/"\[/g, '[');
		data = data.replace(/]"/g, ']');
		return data;
	}

	function badge() {
		var counter = 0;
		if (localStorage.tasks) {
			var tasks = $.parseJSON(localStorage.tasks);
			if (tasks.length > 0) {
				for (var i = 0; i < tasks.length; i++) {
					if (tasks[i].completed === 0) counter += 1;
				}
			}
		}
		chrome.browserAction.setBadgeText({ text: '' + counter + '' });
		chrome.browserAction.setBadgeBackgroundColor({color: '#777' });
	}

	var isChrome = false;
	if (
		(navigator.userAgent.match(/Chrome/i)) &&
		!(navigator.userAgent.match(/OPR/i)) &&
		!(navigator.userAgent.match(/YaBrowser/i))
	) isChrome = true;

	function doSyncData() {
		var json = {};
		json.syncData = $.parseJSON(JSON.stringify(localStorage));
		chrome.storage.sync.set(json);
	}

	function updateOptions() {
		var popupWidth = $('#popup-width').val();
		if (popupWidth < 300) popupWidth = 300;
		if (popupWidth > 800) popupWidth = 800;
		$('#popup-width').val(popupWidth);
		localStorage.options = '{' +
			'"popup_width": "' + popupWidth + '",' +
			'"task_css": "' + encodeURIComponent($('#task-css').val()) + '",' +
			'"color1": "' + $('#color1').val() + '",' +
			'"color2": "' + $('#color2').val() + '",' +
			'"color3": "' + $('#color3').val() + '",' +
			'"hotkeys": "' + $('#hotkeys input[name="hotkey"]:checked').val() + '",' +
			'"context_menu": "' + $('#context-menu').data('val') + '"' +
		'}';
		if (isChrome) doSyncData();
	}

	function defaultOptions(defaults) {
		$('input[type="text"], input[type="number"]').each(function() {
			$(this).val( $(this).data('default') );
		});
		if (defaults) $('input.color').minicolors('destroy');
		$('input.color').minicolors({
			letterCase: 'uppercase'
		});
		$('div.checkbox').each(function() {
			$(this).data( 'val', $(this).data('default') );
		});
		$('#hotkeys [value="0"]').prop('checked', true);
		$('#context-menu').attr( 'data-val', '0' ).removeClass('checked');
	}

	function exportAsFile() {
		var file = new Blob([ lStorage() ]);
		$('#export-link').attr({'href': URL.createObjectURL(file), 'download': 'simple-to-do-list.json'});
	}

	// load options
	if (!localStorage.options || localStorage.options == '{}') {
		defaultOptions();
	} else {
		var options = $.parseJSON(localStorage.options);
		$('#popup-width').val( options.popup_width );
		$('#task-css').val( decodeURIComponent(options.task_css) );
		$('#color1').val( options.color1 );
		$('#color2').val( options.color2 );
		$('#color3').val( options.color3 );
		if (options.hotkeys > 0) {
			$('#hotkeys [value="' + options.hotkeys + '"]').prop('checked', true);
		} else {
			$('#hotkeys [value="0"]').prop('checked', true);
		}
		if (options.context_menu == '1') {
			$('#context-menu').attr( 'data-val', options.context_menu ).addClass('checked');
		}
		$('input.color').minicolors({
			letterCase: 'uppercase'
		});
	}

	$('#popup-width').keyup(function() {
		var val = $(this).val();
		if (val.length > 3) {
			$(this).val(val.slice(0,3));
		}
	});

	// checkboxes
	$('div.checkbox').click(function() {
		if ( $(this).is('.checked') ) {
			$(this).removeClass('checked');
			$(this).attr('data-val', '0');
		} else {
			$(this).addClass('checked');
			$(this).attr('data-val', '1');
		}
	});

	// save options
	$('#save').click(function() {
		$(this).addClass('active');
		setTimeout( function() { $('#save').removeClass('active'); }, 800 );
		updateOptions();
	});

	// restore default options
	$('#defaults').click(function() {
		defaultOptions(defaults = true);
		$(this).addClass('active');
		setTimeout( function() { $('#defaults').removeClass('active'); }, 800 );
		updateOptions();
		return false;
	});

	// tabs
	$('ul.tabs__caption').on('click', 'li:not(.active)', function() {
		$(this).addClass('active').siblings().removeClass('active')
			.parents('div.tabs').find('div.tabs__content').eq($(this).index()).show().siblings('div.tabs__content').hide();

		$('#export').val( lStorage() );

		var top = ($(window).height() - $('div.modal').outerHeight()) / 2;
		var left = ($(window).width() - $('div.modal').outerWidth()) / 2;
		$('div.modal').css({top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
	});

	// translation
	$('body *').each(function() {
		if ( $(this).attr('data-i18n') ) {
			$(this).text( chrome.i18n.getMessage( $(this).attr('data-i18n') ) );
		}
		if ( $(this).attr('data-i18n-title') ) {
			$(this).attr('title', chrome.i18n.getMessage( $(this).attr('data-i18n-title') ) );
		}
		if (chrome.i18n.getMessage('@@ui_locale') == 'ru') {
			$('#developer-url').attr('href', 'http://dimox.name/');
		}
	});

	var labelWidth = 0;
	var label = $('div.option label');
	label.each(function() {
		if ( $(this).width() > labelWidth ) labelWidth = $(this).width();
	}).width(labelWidth);

	$('body').prepend('<div id="overlay"></div>');

	$('#import-button').click(function() {
		$('#overlay, #confirm-import').addClass('visible');
	});

	// import data
	$('#import-yes').on('click', function() {
		$('#confirm-import').removeClass('visible');
		var data = $('#import').val();
		$('#done div.modal__headline').hide();
		$('#done').addClass('visible');

		// check for correct JSON
		var IS_JSON = true;
		try {
			data = $.parseJSON(data);
		} catch(err) {
			IS_JSON = false;
		}
		if (IS_JSON) {
			localStorage.clear();
			for (var key in data) {
				localStorage[key] = JSON.stringify(data[key]);
			}
			$('#data-imported-successfully').show();
		} else {
			$('#could-not-be-imported').show();
		}

		if (isChrome) doSyncData();

		$('#import').val('');
		$('#export').val( lStorage() );
		badge();
		exportAsFile();
	});

	$('#clear-button').click(function() {
		$('#overlay, #confirm-clear').addClass('visible');
	});

	// clear data
	$('#clear-yes').on('click', function() {
		$('#confirm-clear').removeClass('visible');
		$('#done').addClass('visible');
		$('#done div.modal__headline').hide();
		$('#all-data-is-deleted').show();
		localStorage.clear();
		if (isChrome) doSyncData();
		$('#export').val( lStorage() );
		badge();
	});

	$('#overlay, #import-no, #clear-no, #ok').on('click', function() {
		$('#overlay, div.modal').removeClass('visible');
	});

	// export data
	$('#export').val( lStorage() ).click(function() {
		$(this).select();
	});

	// export data as file
	exportAsFile();

	$('span.current-year').text( new Date().getFullYear() );

});
})(jQuery);