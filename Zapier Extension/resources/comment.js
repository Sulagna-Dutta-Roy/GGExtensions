const { issueTypeField, issueStatusField, commentTypeField, languageInputField, projectInputField, getCrowdinConnection } = require('./../_shared');

const performCreate = async (z, bundle) => {
  const { stringCommentsApi } = await getCrowdinConnection(z, bundle);

  let request = {};
  request.stringId = bundle.inputData.string_id;
  request.text = bundle.inputData.text;
  request.targetLanguageId = bundle.inputData.language_id;
  bundle.inputData.type && (request.type = bundle.inputData.type);
  bundle.inputData.issue_type && (request.issueType = bundle.inputData.issue_type);

  if (bundle.inputData.type == 'comment') {
    delete request.issueType; //regular comments can't have issueType
  }

  return (await stringCommentsApi.addStringComment(bundle.inputData.project_id, request)).data
}

module.exports = {
  key: 'comment',
  noun: 'Comment',

  create: {
    display: {
      label: 'Create Comment',
      description: 'Creates a new comment or issue.'
    },
    operation: {
      inputFields: [
        projectInputField, {
          required: true,
          label: "Text",
          helpText: "Comment itself",
          key: "text",
          type: "string",
        }, {
          required: true,
          label: "String ID",
          helpText: "String ID (can be found in string events from Crowdin)",
          key: "string_id",
          type: "integer",
        },
        languageInputField,
        commentTypeField,
        issueTypeField
      ],
      perform: performCreate
    },
  },

  sample: {
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
};
