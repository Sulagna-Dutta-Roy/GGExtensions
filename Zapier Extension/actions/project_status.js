const { projectInputField, getCrowdinConnection } = require('./../_shared');

const perform = async (z, bundle) => {
  const { translationStatusApi, languagesApi } = await getCrowdinConnection(z, bundle);

  const languages = (await languagesApi.withFetchAll().listSupportedLanguages()).data

  const status = (await translationStatusApi.withFetchAll().getProjectProgress(bundle.inputData.project_id)).data

  let result = {}

  status.forEach((languageProgress) => {
    let languageName = (languages.find(obj => obj.data.id == languageProgress.data.languageId)).data.name

    result[languageName] = {
      ...languageProgress.data,
      languageName: languageName
    }
  })

  return result
};

module.exports = {
  key: 'project_status',
  noun: 'Translation Progress',

  display: {
    label: 'Translation Progress',
    description: 'Get project languages translation progress.'
  },

  operation: {
    perform,

    inputFields: [
      projectInputField
    ],

    sample: {
      "data": [{
        "data": {
          "words": {
            "total": 7249,
            "translated": 3651,
            "approved": 3637
          },
          "phrases": {
            "total": 3041,
            "translated": 2631,
            "approved": 2622
          },
          "translationProgress": 86,
          "approvalProgress": 86,
          "languageId": "uk",
          "languageName": "Ukrainian"
        }
      }]
    }
  }
};
