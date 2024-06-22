const { getCrowdinConnection, projectInputField } = require('./../_shared');
const axios = require('axios')

async function execute(z, bundle) {
    const { screenshotsApi, uploadStorageApi } = await getCrowdinConnection(z, bundle);

    const project_id = bundle.inputData.project_id;
    const file_name = bundle.inputData.file_name;
    const file_url = bundle.inputData.file_url;
    const file_contents = bundle.inputData.file_contents;
    const auto_tag = !!bundle.inputData.auto_tag;

    let contents = ''
    if (file_url && file_url.length) {
        contents = Buffer.from((await axios.get(file_url, { responseType: 'arraybuffer' })).data, "utf-8")
    }

    if (file_contents && file_contents.length > 0) {
        contents = Buffer.from(file_contents, "utf-8")
    }

    const sourceFileStorageId = (await uploadStorageApi.addStorage(file_name, contents)).data.id;

    const existingScreenshot = (await screenshotsApi.withFetchAll().listScreenshots(project_id)).data.find((file) => (file.data.name == file_name));

    let fileResponse;

    if (existingScreenshot) {
        fileResponse = (await screenshotsApi.updateScreenshot(project_id, existingScreenshot.data.id, {
            storageId: sourceFileStorageId,
            name: file_name
        })).data;
    } else {
        fileResponse = (await screenshotsApi.addScreenshot(project_id, {
            storageId: sourceFileStorageId,
            name: file_name,
            autoTag: auto_tag
        })).data;
    }

    return fileResponse;
}

const uploadFile = {
    noun: "Upload Screenshot",
    display: {
        hidden: false,
        description: "Adds a screenshot to Crowdin project and tags it automatically (optional).",
        label: "Upload Screenshot"
    },
    key: "upload_screenshot",
    operation: {
        perform: execute,
        inputFields: [
            projectInputField, {
                required: true,
                label: "Screenshot Name",
                helpText: "Name of the screenshot.",
                key: "file_name",
                type: "string",
            }, {
                required: true,
                label: "Auto Tag",
                helpText: "Whether Crowdin should try to find strings on the screenshot and link it with proper strings.",
                key: "auto_tag",
                type: "boolean",
            }, {
                required: false,
                label: "Screenshot URL",
                helpText: "URL of the screenshot to upload. Use the File Contents field if there's no image URL in this Zap.",
                key: "file_url",
                type: "string",
            }, {
                required: false,
                label: "Image Contents",
                helpText: "Binary data of the image. Use Screenshot URL if there's no image data in this Zap.",
                key: "file_contents",
                type: "string",
            }],
        sample: {
            "data": {
                "id": 2,
                "userId": 6,
                "url": "https://production-enterprise-screenshots.downloads.crowdin.com/992000002/6/2/middle.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIGJKLQV66ZXPMMEA%2F20190923%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190923T093016Z&X-Amz-SignedHeaders=host&X-Amz-Expires=120&X-Amz-Signature=8df06f57594f7d1804b7c037629f6916224415e9b935c4f6619fbe002fb25e73",
                "name": "translate_with_siri.jpg",
                "size": {
                    "width": 267,
                    "height": 176
                },
                "tagsCount": 0,
                "tags": [
                    {
                        "id": 98,
                        "screenshotId": 2,
                        "stringId": 2822,
                        "position": {
                            "x": 474,
                            "y": 147,
                            "width": 490,
                            "height": 99
                        },
                        "createdAt": "2019-09-23T09:35:31+00:00"
                    }
                ],
                "createdAt": "2019-09-23T09:29:19+00:00",
                "updatedAt": "2019-09-23T09:29:19+00:00"
            }
        },
        outputFields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'File Name' }
        ],
    },
};

module.exports = uploadFile;