const { generateGuid } = require("./src/services/guid");
const constants = {
  appConfig: {
    waitTimeInMiliSeconds: 100,
    appName: "Image to Text (OCR)",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/image-to-text/jgjlejdhmfpimggbicpffmpbnalcnhoo",
      firefox: "https://addons.mozilla.org/addon/image-to-text-pro-ocr/",
      edge:
        "https://microsoftedge.microsoft.com/addons/detail/icgbomdceijejlokdmjpmgkojiliphma",
    },
    // put extension key here if required which would only be used in development mode
    key:
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhnjCHD79hDbWfqjnP9SW\nN0AXmXHh5eVk2D0oMILadmj/2uRQm/jNpnlvjVHY+899gdYRH/k7v4f+qF6gV3Yh\nwb/2PnW9PEo2VksgiixSesccvcwRXEJSngtxNWOARYSOTqTCCum9rjFVPZL+voh7\ndUsTN45D+RBLQORYbu5NtSM6RcGhUbYvhAosKwo+lsOAjM5niQDLJi//dZ9R32tc\n6tht4XrP59CTWBo8JCpIcHT6edN2HQ2vRiO5CHVb2jfT1hrO82WZ9LWsErzo/gCr\nXyIvnnXjg1wif7++WTi5mQl05Ohv3vKazNLeFpl/2XxvJ1xw4Pfh7m2qMaBJd7ll\n3QIDAQAB\n-----END PUBLIC KEY-----",
    endpoint: "https://imagetext.xyz", // https://imagetext.xyz
  },
  contentScript: {
    mountId: generateGuid(),
  },
  browser: {
    firefox: {
      manifest: {
        browser_specific_settings: {
          gecko: {
            id: "fxnoob71@gmail.com",
            strict_min_version: "42.0",
          },
        },
      },
    },
  },
  support: {
    premium: "https://app.imagetext.xyz/login",
    terms: "https://imagetext.xyz/terms",
    privacyPolicy: "https://imagetext.xyz/privacy",
    donate: "https://www.patreon.com/fxnoob",
    howToVideoLink: "https://www.youtube.com/watch?v=c9hvz21ESys",
    uninstallFeedbackForm: "https://forms.gle/iaFrarBtMp2YDFhB6",
  },
  promotion: {
    ocrWebsite: "http://imagetext.xyz/",
    voiceTypingExtension:
      "https://chrome.google.com/webstore/detail/voice-typing/hmpihaioaacpehkghnkmnmgmihalkmdf",
  },
};

module.exports = constants;
