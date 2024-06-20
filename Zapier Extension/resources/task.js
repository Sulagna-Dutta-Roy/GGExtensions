const { projectInputField, projectWorkflowStepField, languageInputField, filesInputField, labelsInputField, projectMembersField, getCrowdinConnection } = require('./../_shared');

const performSearch = async (z, bundle) => {
  const { tasksApi } = await getCrowdinConnection(z, bundle);

  if (bundle.inputData.id) {
    return (await tasksApi.withFetchAll().getTask(bundle.inputData.project_id, bundle.inputData.id)).data
  } else if (bundle.inputData.title) {
    return (await tasksApi.withFetchAll().listTasks(bundle.inputData.project_id)).data.map((obj) => obj.data).filter(task => task.title == bundle.inputData.title)
  } else {
    return []
  }
};

const performCreate = async (z, bundle) => {
  const { tasksApi } = await getCrowdinConnection(z, bundle);

  let request = {
    status: 'todo',
    title: bundle.inputData.title,
    languageId: bundle.inputData.language_id,
    fileIds: bundle.inputData.file_id,
  }

  if (bundle.authData.domain) {
    if (!bundle.inputData.workflow_step_id) {
      throw new Error("Workflow step is required for Crowdin Enterprise")
    }

    request.workflowStepId = bundle.inputData.workflow_step_id
  } else {
    if (bundle.inputData.task_type === undefined) {
      throw new Error("Task type is required for crowdin.com")
    }

    request.type = bundle.inputData.task_type
  }

  bundle.inputData.description && (request.description = bundle.inputData.description)
  // bundle.inputData.deadline && (request.deadline = bundle.inputData.deadline)
  bundle.inputData.skipAssignedStrings && (request.skipAssignedStrings = bundle.inputData.skipAssignedStrings)
  bundle.inputData.label_id && (request.labelIds = bundle.inputData.label_id)
  bundle.inputData.project_member && (request.assignees = bundle.inputData.project_member.map(id => { return { id } }))

  try {
    return (await tasksApi.addTask(bundle.inputData.project_id, request)).data
  } catch (e) {
    if (e.error && e.error.message) {
      throw new Error(e.error.message)
    }

    if (e.errors) {
      throw new Error(JSON.stringify(e.errors[0].error))
    }
  }
};

module.exports = {
  key: 'task',
  noun: 'Task',

  search: {
    display: {
      label: 'Find Task',
      description: 'Finds a task give.'
    },
    operation: {
      inputFields: [
        projectInputField,
        { key: 'title', required: false },
        { key: 'id', required: false }
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create Task',
      description: 'Creates a new task.'
    },
    operation: {
      inputFields: [
        projectInputField,
        { ...projectWorkflowStepField, label: 'Workflow Step (used only in Crowdin Enterprise)', required: false }, {
          key: 'task_type',
          type: 'integer',
          label: 'Task Type (used only in crowdin.com)',
          required: false,
          choices: [
            { value: '0', label: 'Translate', sample: '0' },
            { value: '1', label: 'Proofread', sample: '1' }
          ],
          altersDynamicFields: false,
        },
        { ...projectMembersField, label: 'Assignees', list: true, required: false },
        { key: 'title', required: true },
        languageInputField,
        { ...filesInputField, list: true },
        { key: 'description' },
        { ...labelsInputField, list: true, required: false },
        // { key: 'deadline', type: 'datetime' },
        { key: 'skipAssignedStrings', type: 'boolean' }
      ],
      perform: performCreate
    },
  },

  sample: {
    "data": {
      "id": 2,
      "projectId": 2,
      "creatorId": 6,
      "type": 1,
      "vendor": "gengo",
      "status": "todo",
      "title": "French",
      "assignees": [
        {
          "id": 1,
          "username": "john_smith",
          "fullName": "John Smith",
          "avatarUrl": "",
          "wordsCount": 5,
          "wordsLeft": 3
        }
      ],
      "assignedTeams": [
        {
          "id": 1,
          "wordsCount": 5
        }
      ],
      "fileIds": [
        1
      ],
      "progress": {
        "total": 24,
        "done": 15,
        "percent": 62
      },
      "translateProgress": {
        "total": 24,
        "done": 15,
        "percent": 62
      },
      "sourceLanguageId": "en",
      "targetLanguageId": "fr",
      "description": "Proofread all French strings",
      "hash": "dac37aff364d83899128e68afe0de4994",
      "translationUrl": "/proofread/9092638ac9f2a2d1b5571d08edc53763/all/en-fr/10?task=dac37aff364d83899128e68afe0de4994",
      "wordsCount": 24,
      "filesCount": 2,
      "commentsCount": 0,
      "deadline": "2019-09-27T07:00:14+00:00",
      "timeRange": "string",
      "workflowStepId": 10,
      "buyUrl": "https://www.paypal.com/cgi-bin/webscr?cmd=...",
      "createdAt": "2019-09-23T09:04:29+00:00",
      "updatedAt": "2019-09-23T09:04:29+00:00"
    }
  }
};
