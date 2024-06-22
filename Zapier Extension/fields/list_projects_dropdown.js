const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { projectsGroupsApi } = await getCrowdinConnection(z, bundle);

  return (await projectsGroupsApi.withFetchAll().listProjects({
    hasManagerAccess: 1
  })).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_projects',
  noun: 'Project',
  display: {
    label: 'List Projects',
    description: 'Returns a list of user projects.',
    hidden: true,
  }
}