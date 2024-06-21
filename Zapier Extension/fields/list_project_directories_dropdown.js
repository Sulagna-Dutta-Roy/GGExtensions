const { projectInputField, getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { sourceFilesApi } = await getCrowdinConnection(z, bundle);
  return (await sourceFilesApi.withFetchAll().listProjectDirectories(bundle.inputData.project_id, {})).data.map((obj) => obj.data)
};

module.exports = {
  operation: {
    inputFields: [projectInputField],
    perform: perform
  },
  key: 'list_project_directories',
  noun: 'Directory',
  display: {
    label: 'List Directories',
    description: 'Returns a list of project directories.',
    hidden: true,
  }
}