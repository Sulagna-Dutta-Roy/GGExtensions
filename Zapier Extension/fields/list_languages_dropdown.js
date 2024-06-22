const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { languagesApi } = await getCrowdinConnection(z, bundle);
  return (await languagesApi.withFetchAll().listSupportedLanguages()).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_languages',
  noun: 'Language',
  display: {
    label: 'List Languages',
    description: 'Returns a list of Crowdin languages.',
    hidden: true,
  }
}