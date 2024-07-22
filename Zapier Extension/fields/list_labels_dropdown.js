const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);

  return (await labelsApi.withFetchAll().listLabels(bundle.inputData.project_id)).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_project_labels',
  noun: 'Label',
  display: {
    label: 'List Labels',
    description: 'Returns a list of project labels.',
    hidden: true,
  }
}