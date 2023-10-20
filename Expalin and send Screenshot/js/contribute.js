"use strict";

var amount;
var licenseType = "singleUser";
var licenseSelected;
var minimumDonation = 1; // but being set overwritten when donate buttons are clicked

var donateButtonClicked = null;
var extensionName = getMessage("nameNoTM");
var email;
var stripeLiveMode = true;
var donationPageUrl = location.protocol + "//" + location.hostname + location.pathname;
const stripeCancelOrError = ["stripeCancel", "stripeError"].includes(getUrlValue("action"));

Controller();

function showLoading() {
	document.body.classList.add("processing");
}

function hideLoading() {
	document.body.classList.remove("processing");
}

if (!extensionName) {
	try {
		extensionName = chrome.runtime.getManifest().name;
	} catch (e) {
		console.error("Manifest has not been loaded yet: " + e);
	}
	
	var prefix = "__MSG_";
	// look for key name to message file
	if (extensionName?.match(prefix)) {
		var keyName = extensionName.replace(prefix, "").replace("__", "");
		extensionName = getMessage(keyName);
	}
}

function isSimilarValueToUS(currencyCode) {
	if (/USD|CAD|EUR|GBP|AUD/i.test(currencyCode)) {
		return true;
	}
}

async function initCurrencyAndMinimums(currencyCode) {
	if (licenseType == "multipleUsers") {
		byId("currency").selected = "USD"; // hard coded to USD for multipe user license
	} else {
		byId("currency").selected = currencyCode;

		if (isSimilarValueToUS(currencyCode) || currencyCode == "JPY") {
			if (isMonthly()) {
				show("#monthlyAmountSelections");
				hide("#onetimeAmountSelections");
			} else {
				hide("#monthlyAmountSelections");
				show("#onetimeAmountSelections");
			}
		} else {
			hide("#monthlyAmountSelections");
			hide("#onetimeAmountSelections");
		}
			
		if (isMonthly()) {
			if (isPayPalSubscriptionsSupported() && stripeCancelOrError) {
				show("#paypal");
			} else {
				hide("#paypal");
			}
			hide("#alipay");
			hide("#wechat-pay");
		} else {
            if (stripeCancelOrError) {
                show("#paymentMethods paper-button");
            } else {
                show("#paymentMethods paper-button:not(#paypal)");
            }
		}
				
		if (currencyCode == "BTC") {
			if (await isEligibleForReducedDonation()) {
				minimumDonation = 0.0005;
			} else {
				minimumDonation = 0.001;
			}

            hide("#paymentMethods paper-button:not(#coinbase)");
		} else {
            selectorAll("paper-button[amount]").forEach(el => {
				let amount;
				if (currencyCode == "JPY") {
					amount = convertUSDToJPY(el.getAttribute("amount"));
				} else {
					amount = el.getAttribute("amount");
				}
				el.innerText = amount;
			});

			if (await isEligibleForReducedDonation()) {
				if (currencyCode == "JPY") {
					minimumDonation = 50;
				} else if (currencyCode == "TWD") {
					minimumDonation = 15;
				} else {
					minimumDonation = 0.50;
				}
			} else {
				if (currencyCode == "JPY") {
					minimumDonation = 100;
				} else if (currencyCode == "TWD") {
					minimumDonation = 30;
				} else {			
					minimumDonation = 1;
				}
			}
		}
	}
}

function initPaymentDetails(buttonClicked) {
	donateButtonClicked = buttonClicked;

	slideUp("#multipleUserLicenseIntro");

	if (ITEM_ID == "screenshots" && !email && (isMonthly() || buttonClicked == "alipay" || buttonClicked == "wechat")) {
		let promptMessage;
		if (isMonthly()) {
			promptMessage = "Enter your email to link the other extensions";
		} else {
			promptMessage = "Enter your email for the receipt";
		}
		email = prompt(promptMessage);
		if (!email) {
			niceAlert("You must enter an email");
			return;
		}
	}

	if (licenseType == "singleUser") {
		initPaymentProcessor(amount);
	} else {
		initPaymentProcessor(licenseSelected.price);
	}
}

function isZeroDecimalCurrency(currencyCode) {
	const zeroDecimalCurrencies = ["bif", "djf", "jpy", "krw", "pyg", "vnd", "xaf", "xpf", "clp", "gnf", "kmf", "mga", "rwf", "vuv", "xof"];
	if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
		return true;
	}
}

function getAmountNumberOnly() {
	var amount = byId("amount").value;

	amount = amount.replace(",", ".");
	amount = amount.replace("$", "");
	amount = amount.replace("¥", "");
	amount = amount.replace("£", "");
	
	amount = amount.replace(/o/ig, '0');

	amount = amount.replace(/０/g, '0');
	amount = amount.replace(/１/g, '1');
	amount = amount.replace(/２/g, '2');
	amount = amount.replace(/３/g, '3');
	amount = amount.replace(/４/g, '4');
	amount = amount.replace(/５/g, '5');
	amount = amount.replace(/６/g, '6');
	amount = amount.replace(/７/g, '7');
	amount = amount.replace(/８/g, '8');
	amount = amount.replace(/９/g, '9');

	var centRegex = new RegExp('c$|cents?', 'ig');
	if (centRegex.test(amount)) {
		amount = amount.replace(centRegex, '');
		if (!amount.includes(".")) {
			amount = amount / 100 + "";
		}
	}
	
	if (amount.indexOf(".") == 0) {
		amount = "0" + amount;
	}
	
	// make sure 2 decimal positions ie. 0.5 > 0.50
	if (/\..$/.test(amount)) {
		amount += "0";
	}
	
	amount = amount.trim();
	return amount;
}

function hideBeforeSuccessfulPayment() {
	hide("#extraFeatures");
	hide("#paymentArea");
}

async function showSuccessfulPayment() {
	await Controller.processFeatures();
	hideBeforeSuccessfulPayment();

	if (DetectClient.isFirefox()) {
		byId("video").src = "contributeVideo.html";
		byId('video').addEventListener("load", function () {
            onClickReplace(this.contentDocument.querySelector("body"), function() {
                chrome.tabs.create({ url: "https://www.youtube.com/watch?v=Ue-li7gl3LM" });
            });
		});
	} else {
		byId("video").src = "https://www.youtube.com/embed/Ue-li7gl3LM?rel=0&autoplay=1&theme=light";
	}
	
	show("#extraFeaturesWrapper");
	
	if (localStorage._amountForAllExtensions) {
		show("#unlockOtherExtensions");
	}
	show("#paymentComplete");
}

function getStripeAmount(price, currencyCode) {
	var stripeAmount;

	if (isZeroDecimalCurrency(currencyCode)) {
		stripeAmount = price;
	} else {
		stripeAmount = price * 100;
	}

	stripeAmount = Math.round(stripeAmount) // round to prevent invalid integer error ie. when entering amount 1.1

	return stripeAmount;
}

async function paymentFetch(url, data, options = {}) {
    try {
        return await fetchJSON(url, data, options);
    } catch (error) {
        hideLoading();
        openGenericDialog({
            title: getMessage("theresAProblem") + " - " + error,
            content: getMessage("tryAgainLater") + " " + getMessage("or") + " " + "try another payment method."
        });
        console.error(error);
        throw error;
    }
}

async function createStripeSource(params) {
	showLoading();

	/*
		Flow:
			-Create source on server (not client side because chrome page was not https) which returns an Alipay payment page
			-Alipay page on success (and failure) returns to extensionUrl
			-Asynchronously the server will call a webhook to charge the source
	*/

    let extensionUrl;
    if (params.type == "wechat") {
        extensionUrl = "https://jasonsavard.com/contribute";
    } else {
        extensionUrl = donationPageUrl;
    }

    let data = {
        action: "createSource",
        type: params.type,
        amount: getStripeAmount(params.price, getCurrencyCode()),
        currency: getCurrencyCode(),
        email: email,
        itemId: ITEM_ID,
        itemName: extensionName,
        description: extensionName,
        extensionUrl: extensionUrl + "?action=" + params.type,
        livemode: stripeLiveMode
    };
    if (licenseType == "multipleUsers") {
        data.licenseType = licenseType;
        data.licenseNumber = licenseSelected.number;
    } else if (isMonthly()) {
        data.billingPeriod = "monthly";
    }

    try {
        data = await paymentFetch("https://apps.jasonsavard.com/paymentSystems/stripe/ajax.php", data, {method: "POST"});
        localStorage.stripeClientSecret = data.client_secret;
        return data.redirect_url;
    } catch (error) {
        sendGA(params.type, 'error with token: ' + error);
    }
}

async function validateStripeSource(type) {
	if (getUrlValue("client_secret") == localStorage.stripeClientSecret) {
		showLoading();
		// Since webhook charges are asynchronous let's wait a second before verifying the payment success
		await sleep(seconds(1));
        
        const data = await paymentFetch("https://apps.jasonsavard.com/paymentSystems/stripe/ajax.php", {
                action: "getPaymentStatus",
                sourceId: getUrlValue("source"),
                livemode: stripeLiveMode
            },
            {
                method: "POST"
            }
        );
            hideLoading();
            console.log("payment status", data);
            // possible status: failed, canceled, pending, chargeable, consumed, succeeded
            if (data.status == "failed" || data.status == "canceled") {
                
                let content = getMessage("tryAgainLater");
                if (isPayPalSubscriptionsSupported()) {
                    show("#paypal");
                    content += ` ${getMessage("or")} try PayPal instead.`
                }
    
                openGenericDialog({
                    title: "Payment " + data.status,
                    content: content
                });
                sendGA("stripe", 'failed or cancelled status: ' + data.status);
            } else {
                localStorage.removeItem("stripeClientSecret");
                showSuccessfulPayment();
                sendStats(type);
            }
	} else {
		niceAlert("JERROR: Client not matched!");
	}
}

function openMobilePayDialog(params) {
	const $dialog = initTemplate("mobilePayDialogTemplate");

    const $img = document.createElement("img");
    $img.src = `https://jasonsavard.com/qrcode?data=${encodeURIComponent(params.url)}`;

    emptyAppend($dialog.querySelector(".dialogDescription"), 
        params.message,
        document.createElement("br"),
        document.createElement("br"),
        $img
    );

    onClickReplace($dialog.querySelector(".continue"), () => {
		showLoading();
		Controller.verifyPayment(ITEM_ID, email).then(response => {
			hideLoading();
			if (response.unlocked) {
				$dialog.close();
				showSuccessfulPayment();
				sendStats(params.type);
			} else {
                const content = new DocumentFragment();

                const $link = document.createElement("a");
                $link.href = "https://jasonsavard.com/contact";
                $link.textContent = "contact";

                content.append("You must scan the code and complete the payment first.", createBR(), createBR(), "If you did this then ", $link, " the developer!");

				niceAlert(content);
			}
		}).catch(error => {
			$dialog.close();
			hideLoading();
			// show success anyways because they might just have extensions preventing access to my server
			showSuccessfulPayment();
			sendGA(params.type, 'failure ' + error + ' but show success anyways');
		});
    });
	openDialog($dialog);
}

async function initPaymentProcessor(price) {
	if (donateButtonClicked == "paypal") {
		sendGA("paypal", 'start');
		
		showLoading();

		// seems description is not used - if item name is entered, but i put it anyways
		const data = {
			itemId:			ITEM_ID,
			itemName:		extensionName,
			currency:		getCurrencyCode(),
			price:			price,
			description:	extensionName,
			successUrl:		`${donationPageUrl}?action=paypalSuccess`,
			errorUrl:		`${donationPageUrl}?action=paypalError`,
			cancelUrl:		`https://apps.jasonsavard.com/tools/redirectToExtension.php?url=${encodeURIComponent(donationPageUrl)}`
		};

		if (email) {
			data.email = email;
		}
		
		if (licenseType == "multipleUsers") {
			data.license = licenseSelected.number;
			data.action = "recurring";
		} else if (isMonthly()) {
			data.action = "recurring";
		}
		
		location.href = await paymentFetch(Controller.FULLPATH_TO_PAYMENT_FOLDERS + "paymentSystems/paypal/createPayment.php", data, {method: "POST"});
	} else if (donateButtonClicked == "stripe") {
		sendGA("stripe", 'start');
		
		function addFormField(form, name, value) {
            const $input = document.createElement("input");
            $input.name = name;
            $input.value = value;
            $input.type = "hidden";

            form.append($input);
		}

        const form = document.createElement("form");
        form.action = 'https://jasonsavard.com/payment';
        form.method = DetectClient.isChromium() ? 'post' : 'get' // seems firefox cross domain post

		addFormField(form, "amount", 		price);
		addFormField(form, "currency", 		getCurrencyCode());
		addFormField(form, "itemId", 		ITEM_ID);
		addFormField(form, "itemName",		extensionName);
		addFormField(form, "description", 	extensionName);
		addFormField(form, "livemode", 		true);
		addFormField(form, "returnUrl", 	donationPageUrl);
				
		if (email) {
			addFormField(form, "email", email);
        }

        if (licenseType == "multipleUsers") {
			addFormField(form, "license", licenseSelected.number);
			addFormField(form, "billingPeriod", "monthly");
        } else if (isMonthly()) {
			addFormField(form, "billingPeriod", "monthly");
        }

        document.body.append(form);
        form.submit();
        form.remove();
	} else if (donateButtonClicked == "alipay") {
		sendGA("alipay", 'start');

		location.href = await createStripeSource({
			type:	"alipay",
			price:	price
		});

	} else if (donateButtonClicked == "wechat") {
		sendGA("wechat", 'start');

		const url = await createStripeSource({
			type:	"wechat",
			price:	price
		});
			hideLoading();

			openMobilePayDialog({
				message:	"Use WeChat to scan this QR code.",
				url:		url,
				type:	"wechat"
			});
	} else if (donateButtonClicked == "applePay") {
		sendGA("applePay", 'start');
		
		let url = "https://jasonsavard.com/contribute?action=applePay";

		function appendParam(url, name, value) {
			return url + "&" + name + "=" + encodeURIComponent(value);
		}

		url = appendParam(url, "amount", price);	
		url = appendParam(url, "currency", getCurrencyCode());
		url = appendParam(url, "itemId", ITEM_ID);
		url = appendParam(url, "itemName", extensionName);
		url = appendParam(url, "description", extensionName);

		if (window.email) {
			url = appendParam(url, "email", window.email);
		}
		
		if (licenseType == "multipleUsers") {
			url = appendParam(url, "license", licenseSelected.number);
			url = appendParam(url, "billingPeriod", "monthly");
		} else if (isMonthly()) {
			url = appendParam(url, "billingPeriod", "monthly");
		}

		openMobilePayDialog({
			message:	"Scan this QR code with your mobile.",
			url:	url, 
			type:	"applePay"
		});
	} else if (donateButtonClicked == "coinbase") {
		sendGA("coinbase", 'start');

		var data = {
			action: "createCoinbaseCharge",
			name: extensionName,
			amount: price,
			currency: getCurrencyCode(),
			itemId: ITEM_ID,
			redirectUrl: "https://apps.jasonsavard.com/tools/redirectToExtension.php?url=" + encodeURIComponent(donationPageUrl + "?action=coinbaseSuccess")
		}
		
		if (window.email) {
			data.email = window.email;
		}

		if (licenseType == "multipleUsers") {
			data.license = licenseSelected.number;
		}

		showLoading();
		data = await paymentFetch("https://apps.jasonsavard.com/paymentSystems/coinbase/ajax.php", data, {method: "post"});
        location.href = data.url;
	} else {
		openGenericDialog({
			title: getMessage("theresAProblem"),
			content: 'invalid payment process'
		});
	}
}

function ensureEmail(closeWindow) {
	if (!email) {
		niceAlert(getMessage("mustSignInToPay")).then(function() {
			if (closeWindow) {
				window.close();
			}
		});
	}
}
		
function signOut() {
	location.href = Urls.SignOut;
}

function canHaveALicense(email) {
	return isDomainEmail(email) || getUrlValue("testlicense");
}


function isPayPalSubscriptionsSupported() {
	function isInThisLang(lang) {
        return window.navigator.language.includes(lang)
            || chrome.i18n.getUILanguage().includes(lang);
	}
	
	if (isInThisLang("de") || isInThisLang("zh")) {
		return false;
	} else {
		return true;
	}
}

function isMonthly() {
	return byId("paymentType").selected == "monthly" || isMonthlyForAllExtensions();
}

function isMonthlyForAllExtensions() {
    return byId("paymentType").selected == "monthly-all-extensions";
}

function showAmountSelections() {
	hide("#multipleUserLicenseIntro");
	slideDown("#donateAmountWrapper");
	slideUp("#paymentMethods");
}

async function sendStats(paymentProcessor) {
	if (localStorage._amountSubmitted) {
		sendGA(paymentProcessor, "success", localStorage._amountType == "monthly" ? "monthlyAmount": "amount", localStorage._amountSubmitted);

		if (localStorage._amountType == "monthly") {
			if (localStorage._minMonthlyPayscale) {
				sendGA("ABTest", "minMonthlyPayscale " + localStorage._minMonthlyPayscale, localStorage._amountSubmitted, localStorage._amountSubmitted);
	}
		} else {
			if (localStorage._minOnetimePayscale) {
				sendGA("ABTest", "minOnetimePayscale " + localStorage._minOnetimePayscale, localStorage._amountSubmitted, localStorage._amountSubmitted);
			}
		}
	}
	sendGA(paymentProcessor, "success", "daysElapsedSinceFirstInstalled", await daysElapsedSinceFirstInstalled());

}

function getCurrencyCode() {
	return byId("currency").selected;
}

function amountSelected(amount) {
	if (isSimilarValueToUS(getCurrencyCode())) {
		localStorage._amountSubmitted = amount;
		if (isMonthly()) {
			localStorage._amountType = "monthly";
		} else {
			localStorage._amountType = "onetime";
		}
        
        if (isMonthlyForAllExtensions()) {
            localStorage._amountForAllExtensions = true;
        } else {
            localStorage.removeItem("_amountForAllExtensions");
        }

		sendGA("donationAmount", isMonthly() ? 'monthlySubmitted' : 'submitted', amount);
	}
	
	if (amount == "") {
		showError(getMessage("enterAnAmount"));
		byId("amount").focus();
    } else if (isNaN(amount)) {
		showError("Invalid number");
        byId("amount").focus();
	} else if (parseFloat(amount) < minimumDonation) {
		var minAmountFormatted = minimumDonation;
		showError(getMessage("minimumAmount", byId("currency").selectedItem.getAttribute("symbol") + " " + minAmountFormatted));
		byId("amount").value = minAmountFormatted;
        byId("amount").focus();
	} else {
		slideDown("#paymentMethods");
		hide("#multipleUserLicenseIntro");
	}
}

function convertUSDToJPY(amountInUSD) {
	return amountInUSD * 100;
}

(() => {

    initUI();
	
	selectorAll("title, .titleLink").forEach(el => el.textContent = extensionName);
	
	slideUp("#multipleUserLicenseWrapper");

	if (DetectClient.isFirefox()) {
		byId("video").src = "contributeVideo.html";
		byId('video').addEventListener("load", function () {
            onClickReplace(this.contentDocument.querySelector("body"), function() {
                chrome.tabs.create({ url: "https://www.youtube.com/watch?v=fKNZRkhC3OE" });
            });
		});
	} else {
		byId("video").src = "https://www.youtube.com/embed/pN9aec4QjRQ?theme=light&enablejsapi=1";
	}

	(async () => {
		initCurrencyAndMinimums(getMessage("currencyCode"));
        /*
        var randomNumber = Math.floor(Math.random() * 2) + 1;
        if (randomNumber == 1) { // Math.random() < 0.5
            localStorage._minMonthlyPayscale = "10-5-3-2";
        } else if (randomNumber == 2) {
            localStorage._minMonthlyPayscale = "10-5-2";
            $("#monthlyAmountSelections [amount='3']").hidden();
        }
        */

		if (canHaveALicense(email)) {
			hide("#paymentType");
			
			show("#singleUserButton");
            onClick("#singleUserButton", () => {
                slideUp("#singleUserButton");
                slideDown("#paymentType");
            });
			
			hide("#multipleUserLicenseLink");
			byId("multipleUserLicenseFor").textContent = getMessage("multipleUserLicenseFor", email.split("@")[1]);
			show("#multipleUserLicenseButtonWrapper");
		} else {
		/*
			if (randomNumber == 1) { // Math.random() < 0.5
                localStorage._minOnetimePayscale = "40-20-15-10";
			} else if (randomNumber == 2) {
                localStorage._minOnetimePayscale = "40-20-10";
                $("#onetimeAmountSelections [amount='15']").hidden();
			}
		*/
		}
		
		const action = getUrlValue("action");
		
		if (action == "paypalSuccess" || action == "stripeSuccess") {
			hideBeforeSuccessfulPayment();
			
			new Promise((resolve, reject) => {
				if (ITEM_ID == "screenshots") {
					resolve();
				} else {
					showLoading();
					Controller.verifyPayment(ITEM_ID, email).then(response => {
						hideLoading();
						if (response.unlocked) {
							resolve();
						} else {
                            const content = new DocumentFragment();

                            const $link = document.createElement("a");
                            $link.href = "https://jasonsavard.com/contact";
                            $link.textContent = "contact";

                            content.append("Could not match your email, please ", $link, " the developer!");

							openGenericDialog({
								title: getMessage("theresAProblem"),
								content: content
							});
						}
					}).catch(error => {
						hideLoading();
						// show success anyways because they might just have extensions preventing access to my server
						showSuccessfulPayment();
						sendGA("paypal", 'failure ' + error + ' but show success anyways');
					});
				}
			}).then(() => {
				showSuccessfulPayment();
		if (action == "paypalSuccess") {
			sendStats("paypal");
				} else if (action == "stripeSuccess") {
					sendStats("stripe");
				}
			});
		} else if (action == "paypalError" || action == "stripeError") {
			const error = getUrlValue("error") || "";
			
			openGenericDialog({
				title: getMessage("theresAProblem") + " " + error,
				content: getMessage("tryAgainLater") + " " + getMessage("or") + " " + "try another payment method instead."
			});
			
			if (action == "paypalError") {
			sendGA("paypal", 'failure ' + error);
			} else if (action == "stripeError") {
				sendGA("stripe", 'failure ' + error);
			}
        } else if (action == "stripeCancel") {
            niceAlert("Try another payment method instead.");
            if (isPayPalSubscriptionsSupported()) {
                show("#paypal");
            }
		} else if (action == "alipay") {
			validateStripeSource(action);
		} else if (action == "coinbaseSuccess") {
			showSuccessfulPayment();
		} else {
			// nothing
		}
        
        if (getUrlValue("ref") == "reducedDonationFromNotif") {
            niceAlert(getMessage("reducedDonationAd_popup", getMessage("extraFeatures")));
        }
        
        var contributionType = getUrlValue("contributionType");
        
        if (contributionType == "monthly") {
            // nothing
        }
        
        byId("paymentType").addEventListener("paper-radio-group-changed", function() {
            initCurrencyAndMinimums(getCurrencyCode());
            
            if (window.matchMedia && window.matchMedia("(min-height: 800px)").matches) {
                showAmountSelections();
            } else {
                hide("#multipleUserLicenseIntro");
                slideUp("#extraFeaturesWrapper", 800);
                setTimeout(() => {
                    showAmountSelections();
                }, 200);
            }
            sendGA("paymentTypeClicked", this.selected);
        });
        
        byId("currency").addEventListener("iron-activate", function(e) {
            var currencyCode = e.detail.selected;
            
            initCurrencyAndMinimums(currencyCode);
            
            if (!isSimilarValueToUS(currencyCode) && currencyCode != "JPY") {
                setTimeout(() => {
                    byId("amount").removeAttribute("placeholder");
                    byId("amount").focus();
                }, 100)
            }
        });

        function attachClickToInitPayment(selector, name) {
            onClick(selector, () => {
                initPaymentDetails(name);
                sendGA("paymentProcessorClicked", name);
            });
        }

        attachClickToInitPayment("#paypal", "paypal");
        attachClickToInitPayment("#stripe, #googlePay", "stripe");
        attachClickToInitPayment("#alipay", "alipay");
        attachClickToInitPayment("#wechat-pay", "wechat");
        attachClickToInitPayment("#applePay", "applePay");

        onClick("#coinbase", () => {
            if (isMonthly()) {
                niceAlert("Coinbase doesn't support monthly payments, please try the other payment options.");
            } else {
                initPaymentDetails("coinbase");
                sendGA("paymentProcessorClicked", "coinbase");
            }
        });

        onClick(".amountSelections paper-button", event => {
            amount = event.target.getAttribute("amount");
            if (getCurrencyCode() == "JPY") {
                amount = convertUSDToJPY(amount);
            }
            
            amountSelected(amount)
        });

        onClick("#submitDonationAmount", () => {
            amount = getAmountNumberOnly();
            amountSelected(amount);
        });

        onClick("#amount", function() {
            this.removeAttribute("placeholder");
            slideUp("#paymentMethods");
        });

        byId("amount").addEventListener("keydown", event => {
            if (event.key == 'Enter' && !event.isComposing) {
                byId("submitDonationAmount").click();
            } else {
                byId("submitDonationAmount").classList.add("visible");
            }
        });
        
        onClick("#alreadyDonated", () => {
            openDialog("alreadyDonatedDialogTemplate").then(response => {
                if (response == "ok") {
                    if (!byId("alreadyDonatedEmail").value) {
                        openGenericDialog({
                            title: "You must enter an email!"
                        });
                    } else if (byId("confirmationNumber").value.length >= 8) {
                        Controller.processFeatures();
                        openGenericDialog({
                            title: "Thank you",
                            content: "The information has been sent to the developer! If it passes validation, the features will be automatically unlocked later today!"
                        });
                    } else {
                        byId("alreadyDonated").setAttribute("disabled", "");
                        openGenericDialog({
                            title: "Invalid information",
                            content: "Please retry in 30 seconds"
                        });
                        setTimeout(function() {
                            byId("alreadyDonated").removeAttribute("disabled");
                        }, 30000);
                    }
                    sendGA("verifyAlreadyDonated", byId("confirmationNumber").value, byId("alreadyDonatedEmail").value);
                } else if (response == "other") {
                    window.open("https://jasonsavard.com/wiki/Confirmation_number");
                }
            });
        });
        
        onClick("#help", () => {
            location.href = "https://jasonsavard.com/wiki/Extra_features_and_contributions";
        });

        onClick("#multipleUserLicenseLink, #multipleUserLicenseButton", () => {
            slideUp("#multipleUserLicenseIntro");
            slideUp('#donateAmountWrapper');
            if (email) {
                byId("licenseDomain").textContent = "@" + email.split("@")[1];
                if (canHaveALicense(email)) {
                    slideUp("#singleUserButton");
                    slideUp("#paymentType");
                    slideUp("#paymentMethods");
                    
                    selectorAll("#licenseOptions paper-item").forEach(el => {
                        var users = el.getAttribute("users");
                        var price = el.getAttribute("price");
                        
                        var userText;
                        var priceText;
                        
                        if (users == 1) {
                            userText = getMessage("Xuser", 1);
                            priceText = getMessage("anyAmount");
                        } else if (users == "other") {
                            // do nothing
                        } else {
                            if (users == "unlimited") {
                                userText = getMessage("Xusers", getMessage("unlimited"));
                            } else {
                                userText = getMessage("Xusers", users);
                            }
                            priceText = "$" + price + "/" + getMessage("month").toLowerCase();
                        }
                        
                        if (userText) {
                            el.querySelectorAll("div")[0].textContent = userText;
                            el.querySelectorAll("div")[1].textContent = priceText;
                        }
                        
                        onClickReplace(el, () => {
                            sendGA("license", users + "");
                            if (users == 1) {
                                slideDown("#paymentType");
                                slideUp("#paymentMethods");
                                hide("#multipleUserLicenseLink");
                                slideDown("#multipleUserLicenseIntro");
                                slideUp("#multipleUserLicenseWrapper");
                            } else if (users == "other") {
                                location.href = "https://jasonsavard.com/contact?ref=otherLicense";
                            } else {
                                if (e.ctrlKey) {
                                    price = 0.01;
                                }
                                licenseSelected = {number:users, price:price};

                                byId("paymentType").selected = "monthly";
                                licenseType = "multipleUsers";
                                initCurrencyAndMinimums(); // called only to set default currency to usd
                                
                                //if (isPayPalSubscriptionsSupported()) {
                                    //initPaymentDetails("paypal");
                                //} else {
                                    initPaymentDetails("stripe");
                                //}
                            }
                        });
                    });
                } else {
                    hide("#licenseOnlyValidFor");
                    show("#signInAsUserOfOrg");
                    hide("#licenseOptions");
                    
                    const exampleEmail = byId("exampleEmail");
                    emptyNode(exampleEmail);

                    const span = document.createElement("span");
                    span.textContent = email.split("@")[0];

                    const company = document.createElement("b");
                    company.textContent = "@mycompany.com";

                    exampleEmail.append(span, company);
                }
                slideDown("#multipleUserLicenseWrapper");
            } else {
                ensureEmail();
            }
            
            sendGA("license", "start");
        });
        
        onClick("#changeDomain", () => {
            openGenericDialog({
                content: getMessage("changeThisDomain", getMessage("changeThisDomain2")),
                otherLabel: getMessage("changeThisDomain2")
            }).then(response => {
                if (response == "other") {
                    signOut();
                }
            });
        });
        
        onClick("#options", () => {
            location.href = "options.html";
        });
        
        onClick(".signOutAndSignIn", () => {
            signOut();
        });
        
        onClick("#driveExtraFeatures", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Google-Drive?ref=contributePage"});
        });

        onClick("#gmailExtraFeatures", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Gmail?ref=contributePage"});
        });

        onClick("#calendarExtraFeatures", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Google-Calendar?ref=contributePage"});
        });

        onClick("#support", () => {
            chrome.tabs.create({url:"https://jasonsavard.com/forum/?ref=contributePage"});
        });

        // load these things at the end
        
        // prevent jumping due to anchor # and because we can't javascript:; or else content security errors appear
        onClick("a[href='#']", event => {
            event.preventDefault();
        });

    })(); // end async

})();