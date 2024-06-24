const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')
const { performSearchFile } = require('./_shared_file_revision')

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'file.deleted') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => {
      const file = await performSearchFile(z, bundle, 'file.deleted');
      delete file[0].revision;
      delete file[0].language;

      return file;
    },
    sample: {
      "event": "file.deleted",
      "project": "web",
      "project_id": 43,
      "file_id": 1,
      "file": "about.html",
      "user_id": 8,
      "user": "peter"
    }
  },
  key: 'file_deleted',
  noun: 'File',
  display: {
    label: 'File Deleted',
    description: 'Triggers when a file has been deleted from the project.',
    hidden: false,
  }
}