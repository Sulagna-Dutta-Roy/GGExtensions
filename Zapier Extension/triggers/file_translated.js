const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.translated') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => { return await performSearchFile(z, bundle, 'file.translated') },
    sample: {
      "event": "file.translated",
      "project": "aecf449472b669351cce576fc23aabd6",
      "project_id": "220",
      "language": "uk",
      "file_id": "1",
      "file": "example.txt"
    }
  },
  key: 'file_translated',
  noun: 'File',
  display: {
    label: 'File Translated',
    description: 'Triggers when a file is fully translated.',
    hidden: false,
  }
}