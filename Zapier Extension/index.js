const authentication = require('./authentication')

//Actions
const uploadFileAction = require('./actions/upload_file')
const downloadFileAction = require('./actions/download_file')
const uploadScreenshotAction = require('./actions/upload_screenshot')
const createResolveIssueAction = require("./actions/resolve_issue")
const labelStringAction = require("./actions/label_string")
const removeStringLabelAction = require("./actions/remove_string_label")
const translateMtAction = require("./actions/translate_mt")
const projectStatusAction = require('./actions/project_status')

//Searches
const findLanguageSearch = require('./searches/find_language')
const findFileSearch = require('./searches/find_file')

//Fields
const listProjectsDropdown = require('./fields/list_projects_dropdown')
const listLanguagesDropdown = require('./fields/list_languages_dropdown')
const listProjectDirectoriesDropdown = require('./fields/list_project_directories_dropdown')
const listWorkflowsDropdown = require('./fields/list_workflows')
const listFilesDropdown = require('./fields/list_files_dropdown')
const listLabelsDropdown = require('./fields/list_labels_dropdown')
const listProjectWorkflowStepsDropdown = require('./fields/list_project_workflow_steps_dropdown')
const listProjectMembersDropdown = require('./fields/list_project_members_dropdown')
const listMtsDropdown = require('./fields/list_mts_dropdown')
const listVendorsDropdown = require('./fields/list_vendors_dropdown')

//Triggers
const projectTranslatedTrigger = require('./triggers/project_translated')
const projectApprovedTrigger = require('./triggers/project_approved')
const fileTranslatedTrigger = require('./triggers/file_translated')
const fileApprovedTrigger = require('./triggers/file_approved')
const fileAddedTrigger = require('./triggers/file_added')
const fileUpdatedTrigger = require('./triggers/file_updated')
const fileRevertedTrigger = require('./triggers/file_reverted')
const fileDeletedTrigger = require('./triggers/file_deleted')
const commentCreatedTrigger = require('./triggers/comment_created')
const commentUpdatedTrigger = require('./triggers/comment_updated')
const commentDeletedTrigger = require('./triggers/comment_deleted')
const commentRestoredTrigger = require('./triggers/comment_restored')

//Resources
const directoryResource = require("./resources/directory")
const commentResource = require("./resources/comment")
const labelResource = require("./resources/label")
const projectResource = require("./resources/project")
const stringResource = require("./resources/string")
const taskResource = require("./resources/task")

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  creates: {
    [uploadFileAction.key]: uploadFileAction,
    [downloadFileAction.key]: downloadFileAction,
    [uploadScreenshotAction.key]: uploadScreenshotAction,
    [createResolveIssueAction.key]: createResolveIssueAction,
    [labelStringAction.key]: labelStringAction,
    [removeStringLabelAction.key]: removeStringLabelAction,
    [translateMtAction.key]: translateMtAction,
    [projectStatusAction.key]: projectStatusAction,
  },

  flags: { skipThrowForStatus: true },

  searches: {
    [findLanguageSearch.key]: findLanguageSearch,
    [findFileSearch.key]: findFileSearch
  },

  triggers: {
    [listProjectsDropdown.key]: listProjectsDropdown,
    [listLanguagesDropdown.key]: listLanguagesDropdown,
    [listProjectDirectoriesDropdown.key]: listProjectDirectoriesDropdown,
    [listWorkflowsDropdown.key]: listWorkflowsDropdown,
    [listFilesDropdown.key]: listFilesDropdown,
    [listLabelsDropdown.key]: listLabelsDropdown,
    [listProjectWorkflowStepsDropdown.key]: listProjectWorkflowStepsDropdown,
    [listProjectMembersDropdown.key]: listProjectMembersDropdown,
    [listMtsDropdown.key]: listMtsDropdown,
    [listVendorsDropdown.key]: listVendorsDropdown,

    [projectTranslatedTrigger.key]: projectTranslatedTrigger,
    [projectApprovedTrigger.key]: projectApprovedTrigger,
    [fileTranslatedTrigger.key]: fileTranslatedTrigger,
    [fileApprovedTrigger.key]: fileApprovedTrigger,
    [fileAddedTrigger.key]: fileAddedTrigger,
    [fileUpdatedTrigger.key]: fileUpdatedTrigger,
    [fileRevertedTrigger.key]: fileRevertedTrigger,
    [fileDeletedTrigger.key]: fileDeletedTrigger,
    [commentCreatedTrigger.key]: commentCreatedTrigger,
    [commentUpdatedTrigger.key]: commentUpdatedTrigger,
    [commentRestoredTrigger.key]: commentRestoredTrigger,
    [commentDeletedTrigger.key]: commentDeletedTrigger,
  },

  resources: {
    [directoryResource.key]: directoryResource,
    [commentResource.key]: commentResource,
    [labelResource.key]: labelResource,
    [projectResource.key]: projectResource,
    [stringResource.key]: stringResource,
    [taskResource.key]: taskResource
  }
}