const { getCrowdinConnection } = require('./../_shared');

const performSearchFile = async (z, bundle, event) => {
    const { projectsGroupsApi, sourceFilesApi } = await getCrowdinConnection(z, bundle);

    const project = (await projectsGroupsApi.getProject(bundle.inputData.project_id)).data
    const files = (await sourceFilesApi.listProjectFiles(bundle.inputData.project_id, {
        limit: 1
    }))

    if (files.data && files.data.length) {
        const file = files.data[0].data;

        return [{
            event: event,
            project: project.identifier,
            project_id: project.id,
            language: project.targetLanguageIds[0],
            file_id: file.id,
            file: file.name
        }]
    } else {
        return []
    }
}

module.exports = {
    performSearchFile
};
