const { handleWebhook, subscribeToCrowdin, performUnsubscribe, projectInputField } = require('../_shared')

const sampleIssue = {
  "event": "stringComment.deleted",
  "comment": {
    "id": "12",
    "text": "@BeMyEyes  Please provide more details on where the text will be used",
    "type": "issue",
    "issueType": "source_mistake",
    "issueStatus": "unresolved",
    "resolvedAt": "2019-09-20T11:05:24+00:00",
    "createdAt": "2019-09-20T11:05:24+00:00",
    "string": {
      "id": "2814",
      "identifier": "name",
      "text": "Not all videos are shown to users. See more",
      "type": "text",
      "context": "shown on main page",
      "maxLength": "35",
      "isHidden": false,
      "isDuplicate": true,
      "masterStringId": "1",
      "revision": "1",
      "hasPlurals": false,
      "labelIds": [
        3,
        8
      ],
      "url": "https://example.crowdin.com/translate/file-format-samples/1/en-uk/78#1",
      "createdAt": "2022-04-20T12:43:57+00:00",
      "updatedAt": "2022-04-20T13:24:01+00:00",
      "file": {
        "id": "44",
        "name": "umbrella_app.xliff",
        "title": "source_app_info",
        "type": "xliff",
        "path": "/directory1/directory2/filename.extension",
        "status": "active",
        "revision": "1",
        "branchId": "34",
        "directoryId": "4"
      },
      "project": {
        "id": "777",
        "userId": "1",
        "sourceLanguageId": "en",
        "targetLanguageIds": [
          "uk",
          "pl"
        ],
        "identifier": "umbrella",
        "name": "Project Name",
        "createdAt": "2022-04-20T11:05:24+00:00",
        "updatedAt": "2022-04-21T11:07:29+00:00",
        "lastActivity": "2022-04-21T11:07:29+00:00",
        "description": "Project Description",
        "url": "https://crowdin.com/project/umbrella",
        "cname": null,
        "languageAccessPolicy": "moderate",
        "visibility": "private",
        "publicDownloads": true
      }
    },
    "targetLanguage": {
      "id": "es",
      "name": "Spanish",
      "editorCode": "es",
      "twoLettersCode": "es",
      "threeLettersCode": "spa",
      "locale": "es-ES",
      "androidCode": "es-rES",
      "osxCode": "es.lproj",
      "osxLocale": "es",
      "textDirection": "ltr",
      "dialectOf": null
    },
    "user": {
      "id": "1",
      "username": "john_smith",
      "fullName": "John Smith",
      "avatarUrl": ""
    },
    "commentResolver": {
      "id": "1",
      "username": "john_smith",
      "fullName": "John Smith",
      "avatarUrl": ""
    }
  }
};

module.exports = {
  operation: {
    perform: handleWebhook,
    inputFields: [projectInputField],
    type: 'hook',
    performSubscribe: async (z, bundle) => { return await subscribeToCrowdin(z, bundle, 'stringComment.deleted') },
    performUnsubscribe: async (z, bundle) => { return await performUnsubscribe(z, bundle) },
    performList: async (z, bundle) => {
      return [sampleIssue];
    },
    sample: sampleIssue
  },
  key: 'comment_deleted',
  noun: 'Comment',
  display: {
    label: 'Comment/Issue Deleted',
    description: 'Triggers when a user deletes a comment or an issue.',
    hidden: false,
  }
}