const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file_revision')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.updated') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => {
      const file = await performSearchFile(z, bundle, 'file.updated')
      delete file[0].language;

      return file;
    },
    sample: {
      "event": "file.updated",
      "project": "web",
      "project_id": "220",
      "file_id": "4",
      "file": "index.html",
      "user_id": "1",
      "user": "peter",
      "revision": "1"
    }
  },
  key: 'file_updated',
  noun: 'File',
  display: {
    label: 'File Updated',
    description: 'Triggers when a file has been updated.',
    hidden: false,
  }
}