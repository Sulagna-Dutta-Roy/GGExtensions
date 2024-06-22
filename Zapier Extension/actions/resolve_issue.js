const { issueTypeField, issueStatusField, commentTypeField, languageInputField, projectInputField, getCrowdinConnection } = require('./../_shared');

const perform = async (z, bundle) => {
  const { stringCommentsApi } = await getCrowdinConnection(z, bundle);

  let request = [{
    value: 'resolved',
    op: 'replace',
    path: `/issueStatus`
  }];

  return (await stringCommentsApi.editStringComment(bundle.inputData.project_id, bundle.inputData.comment_id, request)).data
};

module.exports = {
  key: 'resolve_issue',
  noun: 'Resolve Issue',

  display: {
    label: 'Resolve Issue',
    description: 'Set the issue resolved.'
  },

  operation: {
    perform,

    inputFields: [
      projectInputField,
      {
        key: 'comment_id',
        label: 'Comment ID',
        required: true,
        type: 'integer'
      }
    ],

    sample: {
      "data": {
        "id": 2,
        "text": "@BeMyEyes  Please provide more details on where the text will be used",
        "userId": 6,
        "stringId": 742,
        "user": {
          "id": 12,
          "username": "john_smith",
          "fullName": "John Smith",
          "avatarUrl": ""
        },
        "string": {
          "id": 123,
          "text": "HTML page example",
          "type": "text",
          "hasPlurals": false,
          "isIcu": false,
          "context": "Document Title\\r\\nXPath: /html/head/title",
          "fileId": 22
        },
        "languageId": "bg",
        "type": "issue",
        "issueType": "source_mistake",
        "issueStatus": "unresolved",
        "resolverId": 6,
        "resolver": {
          "id": 12,
          "username": "john_smith",
          "fullName": "John Smith",
          "avatarUrl": ""
        },
        "resolvedAt": "2019-09-20T11:05:24+00:00",
        "createdAt": "2019-09-20T11:05:24+00:00"
      }
    }
  }
};
