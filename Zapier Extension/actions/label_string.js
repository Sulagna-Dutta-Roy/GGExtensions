const { projectInputField, labelsInputField, getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);

  let request = {
    stringIds: [bundle.inputData.string_id]
  };

  return (await labelsApi.assignLabelToString(bundle.inputData.project_id, bundle.inputData.label_id, request)).data[0]
}

module.exports = {
  key: 'label_string',
  noun: 'Label String',

  display: {
    label: 'Label String',
    description: 'Assign a label to the string'
  },

  operation: {
    perform,

    inputFields: [
      projectInputField,
      labelsInputField, {
        key: 'string_id',
        label: 'String ID',
        required: true,
        type: 'integer'
      }
    ],

    sample: {
      "data": {
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
    }
  }
}
