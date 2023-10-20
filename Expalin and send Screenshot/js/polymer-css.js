"use strict";

const polymerCss = `
<custom-style>
	<style include="iron-flex iron-flex-alignment iron-positioning paper-material-styles">
		app-toolbar {
			color:#FAFAFA;
			background:#3f51b5;
			--app-toolbar-font-size: 16px;
		}
			
		paper-dialog {
			--paper-dialog-scrollable: {
				max-height:70vh; /* patch for scroll bar issue when trying to drag it */
			}
		}

		paper-icon-button {
			--iron-icon: {
				opacity:0.5;
            };
        }

        paper-icon-button:hover {
			--iron-icon: {
				opacity:1;
			};
		}

        #newsNotification {
            --iron-icon: {
                opacity:0.8;
            }
        }

        #newsNotification:hover {
            --iron-icon: {
                opacity:1;
            }
        }

		paper-icon-item {
			--paper-item-icon-width: 40px; /* dupicated value in css below also because --paper-item-icon-width should normally sufice, but when using <template> to import polyer menu the --p... was not working */
		}

		paper-drawer-panel {
			--paper-drawer-panel-left-drawer-container: { background-color: rgb(238, 238, 238) };
		}
		
		paper-tooltip {
			--paper-tooltip: {
				font-size:13px;
			};
		}
		
		paper-toast paper-spinner {
			--paper-spinner-layer-1-color: white;
			--paper-spinner-layer-2-color: white;
			--paper-spinner-layer-3-color: white;
			--paper-spinner-layer-4-color: white;
		}

		@media screen and (min-width: 1400px) {
			body:not(.popup) app-toolbar {padding:0 calc(calc(100% - 1366px) / 2)}
		}
		#middle {margin: 0 auto;max-width: 1366px}
	</style>
</custom-style>

<style>
    [unresolved] {opacity:0} /* had to extract this from common.css below or else FOUC */
</style>
`;

const template = /** @type {!HTMLTemplateElement} */document.createElement('template');
template.setAttribute('style', 'display: none;');
template.innerHTML = polymerCss;
document.head.appendChild(template.content);

const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "css/common.css";
document.head.appendChild(link);