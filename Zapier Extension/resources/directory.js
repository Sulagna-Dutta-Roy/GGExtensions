const { projectInputField, directoriesInputField, getCrowdinConnection } = require('./../_shared');

const performList = async (z, bundle) => {
  const { sourceFilesApi } = await getCrowdinConnection(z, bundle);

  let request = {};
  bundle.inputData.directory_id && (request.directoryId = bundle.inputData.directory_id);

  return (await sourceFilesApi.withFetchAll().listProjectDirectories(bundle.inputData.project_id, request)).data.map((obj) => obj.data)
}

const performSearch = async (z, bundle) => {
  const { sourceFilesApi } = await getCrowdinConnection(z, bundle);

  const directories = (await sourceFilesApi.withFetchAll().listProjectDirectories(bundle.inputData.project_id)).data;

  const search = directories.map((obj) => obj.data).find((dir) => dir.name == bundle.inputData.name);

  if (!directories || !search) {
    return []
  } else {
    return [search]
  }
}

const performCreate = async (z, bundle) => {
  const { sourceFilesApi } = await getCrowdinConnection(z, bundle);

  let request = {
    name: bundle.inputData.name
  }

  bundle.inputData.priority && (request.priority = bundle.inputData.priority);
  bundle.inputData.directory_id && (request.directoryId = bundle.inputData.directory_id);
  bundle.inputData.title && (request.title = bundle.inputData.title);

  return (await sourceFilesApi.createDirectory(bundle.inputData.project_id, request)).data
};

module.exports = {
  key: 'directory',
  noun: 'Directory',

  list: {
    display: {
      label: 'New Directory',
      description: 'Triggers when new directory is created.',
    },
    operation: {
      perform: performList,
      inputFields: [projectInputField, {
        ...directoriesInputField,
        required: false,
        label: 'Parent Directory ID',
      }]
    }
  },

  search: {
    display: {
      label: 'Find Directory',
      description: 'Finds a directory.',
    },
    operation: {
      inputFields: [projectInputField,
        { key: 'name', required: true }
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create Directory',
      description: 'Creates a new directory.'
    },
    operation: {
      inputFields: [
        projectInputField,
        { key: 'name', required: true }, {
          ...directoriesInputField,
          required: false,
          label: 'Parent Directory ID',
        }, { key: 'title', required: false }, {
          label: 'Priority',
          key: 'priority',
          required: false,
          choices: [
            { value: 'low', label: 'Low', sample: 'low' },
            { value: 'normal', label: 'Normal', sample: 'normal' },
            { value: 'high', label: 'High', sample: 'high' }
          ],
          altersDynamicFields: true,
        }
      ],
      perform: performCreate
    },
  },

  sample: {
    "id": 4,
    "projectId": 2,
    "branchId": 34,
    "directoryId": null,
    "name": "main",
    "title": "<Description materials>",
    "exportPattern": "/localization/%locale%/%file_name%",
    "priority": "normal",
    "createdAt": "2019-09-19T14:14:00+00:00",
    "updatedAt": "2019-09-19T14:14:00+00:00"
  }
}