const { projectInputField, labelsInputField, getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  const { labelsApi } = await getCrowdinConnection(z, bundle);
  return (await labelsApi.unassignLabelFromString(bundle.inputData.project_id, bundle.inputData.label_id, [bundle.inputData.string_id])).data[0]
}

module.exports = {
  key: 'remove_label',
  noun: 'Remove Label',

  display: {
    label: 'Remove Label From String',
    description: 'Unassign the label from the string'
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
