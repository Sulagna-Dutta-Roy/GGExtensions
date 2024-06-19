const { getCrowdinConnection } = require('../_shared');

module.exports = {
  operation: {
    inputFields: [{
      required: false,
      label: "Code",
      helpText: "Crowdin Language Code (sometimes called language ID, i.e. 'fr', 'uk').",
      key: "code",
      type: "string",
    }, {
      required: false,
      label: "Name",
      helpText: "Crowdin Language Name.",
      key: "name",
      type: "string",
    }, {
      required: false,
      label: "Locale",
      helpText: "Crowdin Language Locale.",
      key: "locale",
      type: "string",
    }],
    perform: async (z, bundle) => {
      const { languagesApi } = await getCrowdinConnection(z, bundle);

      const data = (await languagesApi.withFetchAll().listSupportedLanguages()).data.map((obj) => obj.data)

      var result = null

      if (bundle.inputData.code) {
        result = data.find((lng) => lng.id == bundle.inputData.code)
      } else if (bundle.inputData.name) {
        result = data.find((lng) => lng.name == bundle.inputData.name)
      } else if (bundle.inputData.locale) {
        result = data.find((lng) => lng.locale == bundle.inputData.locale)
      } else {
        result = data[0]
      }

      return [result]
    },
    sample: {
      "id": "es",
      "name": "Spanish",
      "editorCode": "es",
      "twoLettersCode": "es",
      "threeLettersCode": "spa",
      "locale": "es-ES",
      "androidCode": "es-rES",
      "osxCode": "es.lproj",
      "osxLocale": "es",
      "pluralCategoryNames": [],
      "pluralRules": "(n != 1)",
      "pluralExamples": [],
      "textDirection": "ltr",
      "dialectOf": "string"
    },
    outputFields: [
      { key: 'id', label: 'Crowdin Language Code' },
      { key: 'name', label: 'Language Name' }
    ],
  },
  key: 'find_language',
  noun: 'Languages',
  display: {
    label: 'Find Language',
    description: 'Finds language by Crowdin code, locale or name.',
    hidden: false,
  },
};
