const { getCrowdinConnection } = require('./../_shared');
const axios = require('axios')

const { projectInputField, languageInputField, filesInputField } = require('./../_shared');

async function execute(z, bundle) {
    const { translationsApi, sourceFilesApi } = await getCrowdinConnection(z, bundle);

    const project_id = bundle.inputData.project_id;
    const file_id = bundle.inputData.file_id;
    const language_id = bundle.inputData.language_id;

    const translationsLink = await translationsApi.buildProjectFileTranslation(project_id, file_id, {
        targetLanguageId: language_id
    })

    const file = (await sourceFilesApi.getFile(project_id, file_id)).data
    const fileContent = (await axios.get(translationsLink.data.url)).data

    return {
        url: translationsLink.data.url,
        name: file.name,
        content: fileContent,
    }
}

const uploadFile = {
    noun: "Download Translated File",
    display: {
        hidden: false,
        description: "Downloads the translated file.",
        label: "Download Translated File"
    },
    key: "download_file",
    operation: {
        perform: execute,
        inputFields: [
            projectInputField,
            filesInputField,
            languageInputField],
        sample: {
            url: 'https://production-enterprise-importer.downloads.crowdin.com/992000002/2/14.xliff?response-content-disposition=attachment%253B%2520filename%253D%2522APP.xliff%2522&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIGJKLQV66ZXPMMEA%252F20190920%252Fus-east-1%252Fs3%252Faws4_request&X-Amz-Date=20190920T093121Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=439ebd69a1b7e4c23e6d17891a491c94f832e0c82e4692dedb35a6cd1e624b62',
            content: 'super super',
            name: 'strings.xml'
        },
        outputFields: [
            { key: 'url', label: 'URL' },
            { key: 'name', label: 'File Name' },
            { key: 'content', label: 'File Content' }
        ],
    },
};

module.exports = uploadFile;