const { projectInputField, filesInputField, labelsInputField, getCrowdinConnection } = require('./../_shared');

const performSearch = async (z, bundle) => {
  const { sourceStringsApi } = await getCrowdinConnection(z, bundle);
  const strings = (await sourceStringsApi.withFetchAll().listProjectStrings(bundle.inputData.project_id)).data.map((obj) => obj.data)

  if (bundle.inputData.text) {
    return strings.filter(string => string.text == bundle.inputData.text)
  }

  if (bundle.inputData.identifier) {
    return strings.filter(string => string.identifier == bundle.inputData.identifier)
  }

  if (bundle.inputData.context) {
    return strings.filter(string => string.context == bundle.inputData.context)
  }

  return []
};

const performCreate = async (z, bundle) => {
  const { sourceStringsApi } = await getCrowdinConnection(z, bundle);

  let request = {
    text: bundle.inputData.text,
    identifier: bundle.inputData.identifier,
    fileId: bundle.inputData.file_id
  }

  bundle.inputData.label_id && (request.labelIds = bundle.inputData.label_id)
  bundle.inputData.context && (request.context = bundle.inputData.context)
  bundle.inputData.maxLength && (request.maxLength = bundle.inputData.maxLength)

  if (bundle.inputData.hidden !== undefined) {
    request.isHidden = (bundle.inputData.hidden ? true : false)
  }

  return (await sourceStringsApi.addString(bundle.inputData.project_id, request)).data
};

module.exports = {
  key: 'string',
  noun: 'String',

  search: {
    display: {
      label: 'Find String',
      description: 'Finds a string by text.'
    },
    operation: {
      inputFields: [
        projectInputField,
        { key: 'text', required: false },
        { key: 'identifier', required: false },
        { key: 'context', required: false }
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create String',
      description: 'Creates a new string.'
    },
    operation: {
      inputFields: [
        projectInputField,
        filesInputField,
        { key: 'text', required: true },
        { key: 'identifier', required: true },
        { key: 'context' }, {
          required: false,
          label: "Is Hidden",
          helpText: "Is the string visible to translators.",
          key: "hidden",
          type: "boolean",
        }, {
          ...labelsInputField,
          list: true,
          required: false
        }, {
          type: 'integer',
          key: 'maxLength',
          required: false,
          label: 'Max. Length'
        }
      ],
      perform: performCreate
    },
  },

  sample: {
    "id": 2814,
    "projectId": 2,
    "fileId": 48,
    "branchId": 12,
    "directoryId": 13,
    "identifier": "name",
    "text": "Not all videos are shown to users. See more",
    "type": "text",
    "context": "shown on main page",
    "maxLength": 35,
    "isHidden": false,
    "isDuplicate": true,
    "masterStringId": 1,
    "revision": 1,
    "hasPlurals": false,
    "isIcu": false,
    "labelIds": [
      3
    ],
    "createdAt": "2019-09-20T12:43:57+00:00",
    "updatedAt": "2019-09-20T13:24:01+00:00"
  }
};
