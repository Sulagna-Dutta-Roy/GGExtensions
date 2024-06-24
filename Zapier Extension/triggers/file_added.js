const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file_revision')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.added') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => {
      let file = await performSearchFile(z, bundle, 'file.added')
      delete file[0].language;

      return file;
    },
    sample: {
      "event": "file.added",
      "project": "mobile",
      "project_id": "220",
      "file_id": "14",
      "file": "Localizable.strings",
      "user_id": "4",
      "user": "peter",
      "revision": "1"
    }
  },
  key: 'file_added',
  noun: 'File',
  display: {
    label: 'File Added',
    description: 'Triggers when a new file has been added to the project.',
    hidden: false,
  }
}