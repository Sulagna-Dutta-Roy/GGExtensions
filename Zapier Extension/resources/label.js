const { projectInputField, getCrowdinConnection } = require('./../_shared');

const performList = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);
  return (await labelsApi.withFetchAll().listLabels(bundle.inputData.project_id)).data.map((obj) => obj.data).map((obj) => ({ ...obj, id: obj.title }))
};

const performSearch = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);

  const result = (await labelsApi.withFetchAll().listLabels(bundle.inputData.project_id)).data.map((obj) => obj.data).find((label) => label.title == bundle.inputData.title);

  return result || []
};

const performCreate = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);

  let request = {
    title: bundle.inputData.title
  };

  return (await labelsApi.addLabel(bundle.inputData.project_id, request)).data
};

module.exports = {
  key: 'label',
  noun: 'Label',

  list: {
    display: {
      label: 'New Label',
      description: 'Triggers when new label is created.'
    },
    operation: {
      perform: performList,
      inputFields: [projectInputField]
    }
  },

  search: {
    display: {
      label: 'Find Label',
      description: 'Find label.'
    },
    operation: {
      perform: performSearch,
      inputFields: [projectInputField, { key: 'title', required: true }]
    }
  },

  create: {
    display: {
      label: 'Create Label',
      description: 'Creates a new label.'
    },
    operation: {
      inputFields: [
        projectInputField,
        { key: 'title', required: true }
      ],
      perform: performCreate
    },
  },

  sample: {
    "id": 34,
    "title": "main"
  }
}