const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchProject } = require('./_shared_project')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'project.approved') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => { return await performSearchProject(z, bundle, 'project.approved') },
    sample: {
      "event": "project.approved",
      "project": "aecf449472b669351cce576fc23aabd6",
      "project_id": "220",
      "language": "uk"
    }
  },
  key: 'project_approved',
  noun: 'Project',
  display: {
    label: 'Project Language Approved',
    description: 'Triggers when one of a project languages is fully translated and approved.',
    hidden: false,
  }
};
