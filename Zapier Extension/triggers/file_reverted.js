const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file_revision')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.reverted') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => {
      const file = await performSearchFile(z, bundle, 'file.reverted')
      delete file[0].language;

      return file;
    },
    sample: {
      "event": "file.reverted",
      "project": "web",
      "project_id": 220,
      "file_id": 1,
      "file": "index.html",
      "user_id": 4,
      "user": "peter",
      "revision": 1
    }
  },
  key: 'file_reverted',
  noun: 'File',
  display: {
    label: 'File Reverted',
    description: 'Triggers when a file update has been reverted.',
    hidden: false,
  }
}