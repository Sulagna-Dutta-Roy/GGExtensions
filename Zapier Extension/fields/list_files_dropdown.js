const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { sourceFilesApi } = await getCrowdinConnection(z, bundle);

  return (await sourceFilesApi.withFetchAll().listProjectFiles(bundle.inputData.project_id)).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_project_files',
  noun: 'File',
  display: {
    label: 'List Files',
    description: 'Returns a list of project files.',
    hidden: true,
  }
}