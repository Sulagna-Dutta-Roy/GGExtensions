const { projectInputField, filesInputField, getCrowdinConnection } = require('../_shared');

module.exports = {
  operation: {
    inputFields: [projectInputField, filesInputField, {
      required: false,
      label: "Name",
      helpText: "File Name.",
      key: "name",
      type: "string",
    }],
    perform: async (z, bundle) => {
      const { sourceFilesApi } = await getCrowdinConnection(z, bundle);

      const data = (await sourceFilesApi.withFetchAll().listProjectFiles(bundle.inputData.project_id)).data.map((obj) => obj.data)

      var result = null

      if (bundle.inputData.file_id) {
        result = data.find((file) => file.id == bundle.inputData.file_id)
      } else if (bundle.inputData.name) {
        result = data.find((file) => file.name == bundle.inputData.name)
      } else {
        result = data[0]
      }

      return [result]
    },
    sample: {
      "id": 44,
      "projectId": 2,
      "branchId": 34,
      "directoryId": 4,
      "name": "umbrella_app.xliff",
      "title": "source_app_info",
      "type": "xliff",
      "path": "/directory1/directory2/filename.extension",
      "status": "active"
    }
  },
  key: 'find_file',
  noun: 'File',
  display: {
    label: 'Find File',
    description: 'Finds file by id or name.',
    hidden: false,
  },
};
