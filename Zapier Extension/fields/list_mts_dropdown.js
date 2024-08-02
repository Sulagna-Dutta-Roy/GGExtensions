const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { machineTranslationApi } = await getCrowdinConnection(z, bundle);

  return (await machineTranslationApi.withFetchAll().listMts()).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_mts',
  noun: 'Machine Translation Engine',
  display: {
    label: 'List Machine Translation Engines',
    description: 'Returns a list of machine translation engines.',
    hidden: true,
  }
}