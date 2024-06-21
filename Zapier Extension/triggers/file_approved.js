const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.approved') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => { return await performSearchFile(z, bundle, 'file.approved') },
    sample: {
      "event": "file.approved",
      "project": "mobile",
      "project_id": 220,
      "language": "uk",
      "file_id": 254,
      "file": "strings.xml"
    }
  },
  key: 'file_approved',
  noun: 'File',
  display: {
    label: 'File Approved',
    description: 'Triggers when a file is fully translated and approved.',
    hidden: false,
  }
}