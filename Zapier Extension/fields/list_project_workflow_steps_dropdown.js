const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  //it's crowdin.com
  if (!bundle.authData.domain) {
    return [{ id: 0, title: 'Default for crowdin.com' }]
  }

  const { workflowsApi } = await getCrowdinConnection(z, bundle);

  return (await workflowsApi.listWorkflowSteps(bundle.inputData.project_id)).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_project_workflow_steps',
  noun: 'Workflow Step',
  display: {
    label: 'List Project Workflow Steps',
    description: 'Returns a list of project workflow steps.',
    hidden: true,
  }
}