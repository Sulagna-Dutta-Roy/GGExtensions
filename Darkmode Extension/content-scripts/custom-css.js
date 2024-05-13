
extension.styles = {
	elements: {}
};

extension.styles.create = function () {
	var style = document.createElement('style');

	document.head.appendChild(style);

	return style;
};


extension.styles.update = function () {
	var global_styles = extension.storage.website.styles;

	if (satus.isString(global_styles) && global_styles.trim().length > 0) {
		if (!satus.isElement(extension.styles.elements.global)) {
			extension.styles.elements.global = extension.styles.create();
		}

		extension.styles.elements.global.textContent = global_styles;
	} else if (extension.styles.elements.global) {
		extension.styles.elements.global.remove();

		delete extension.styles.elements.global;
	}
};

extension.events.on('extension-loaded', function () {
	extension.styles.update();
});

extension.events.on('storage-changed', function () {
	extension.styles.update();
});