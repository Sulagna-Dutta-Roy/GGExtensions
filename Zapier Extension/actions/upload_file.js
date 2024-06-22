const { projectInputField, directoriesInputField, labelsInputField, getCrowdinConnection } = require('./../_shared');

async function execute(z, bundle) {
    const { sourceFilesApi, uploadStorageApi } = await getCrowdinConnection(z, bundle);

    const project_id = bundle.inputData.project_id;
    const file_name = bundle.inputData.file_name;
    const file_url = bundle.inputData.file_url;
    const file_contents = bundle.inputData.file_contents;

    let contents = ''
    if (file_url && file_url.length) {
        contents = (await z.request({
            url: file_url,
            method: 'GET'
        })).content;
    }

    if (file_contents && file_contents.length > 0) {
        contents = file_contents;
    }

    const sourceFileStorageId = (await uploadStorageApi.addStorage(file_name, contents)).data.id;

    const existingFile = (await sourceFilesApi.withFetchAll().listProjectFiles(project_id)).data.find((file) => (file.data.name == file_name));

    let fileResponse;

    if (existingFile) {
        fileResponse = (await sourceFilesApi.updateOrRestoreFile(project_id, existingFile.data.id, {
            storageId: sourceFileStorageId,
            attachLabelIds: bundle.inputData.label_id
        })).data;
    } else {
        let addFileRequest = {
            storageId: sourceFileStorageId,
            name: file_name,
            attachLabelIds: bundle.inputData.label_id
        }

        bundle.inputData.directory_id && (addFileRequest.directoryId = bundle.inputData.directory_id);
        bundle.inputData.title && (addFileRequest.title = bundle.inputData.title);

        fileResponse = (await sourceFilesApi.createFile(project_id, addFileRequest)).data;
    }

    return fileResponse;
}

const uploadFile = {
    noun: "File",
    display: {
        hidden: false,
        description: "Uploads a file into Crowdin project.",
        label: "Create or Update a File"
    },
    key: "upload_file",
    operation: {
        perform: execute,
        inputFields: [
            projectInputField, {
                required: true,
                label: "File Name",
                helpText: "Name of the file.",
                key: "file_name",
                type: "string",
            }, {
                required: false,
                label: "File Title",
                helpText: "How the file will be shown to translators.",
                key: "title",
                type: "string",
            }, {
                required: false,
                label: "File URL",
                helpText: "Either URL or file contents is required.",
                key: "file_url",
                type: "string",
            }, {
                required: false,
                label: "File Contents",
                helpText: "Either URL or file contents is required.",
                key: "file_contents",
                type: "string",
            }, {
                ...directoriesInputField,
                required: false,
                label: 'Parent Directory ID',
            }, {
                ...labelsInputField, required: false, list: true
            }],
        sample: {
            id: '1'
        },
        outputFields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'File Name' }
        ],
    },
};

module.exports = uploadFile;