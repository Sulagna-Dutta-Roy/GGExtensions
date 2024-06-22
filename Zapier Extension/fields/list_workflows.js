const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  //it's crowdin.com
  if (!bundle.authData.domain) {
    return [{ id: 0, title: 'Default for crowdin.com' }]
  }

  const { workflowsApi } = await getCrowdinConnection(z, bundle);

  return (await workflowsApi.withFetchAll().listWorkflowTemplates()).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_workflows',
  noun: 'Workflow',
  display: {
    label: 'List Workflows',
    description: 'Returns a list of user workflows.',
    hidden: true,
  }
}