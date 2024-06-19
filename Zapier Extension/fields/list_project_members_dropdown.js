const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { usersApi } = await getCrowdinConnection(z, bundle);

  return (await usersApi.listProjectMembers(bundle.inputData.project_id)).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_project_members',
  noun: 'Project Members',
  display: {
    label: 'List Project Members',
    description: 'Returns a list of project members.',
    hidden: true,
  }
}