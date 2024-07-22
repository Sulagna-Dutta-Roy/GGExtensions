const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchProject } = require('./_shared_project')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'project.translated') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => { return await performSearchProject(z, bundle, 'project.translated') },
    sample: {
      "event": "project.translated",
      "project": "aecf449472b669351cce576fc23aabd6",
      "project_id": "220",
      "language": "uk"
    }
  },
  key: 'project_translated',
  noun: 'Project',
  display: {
    label: 'Project Language Translated',
    description: 'Triggers when one of a project languages is fully translated.',
    hidden: false,
  }
};
