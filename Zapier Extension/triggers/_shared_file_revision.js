const { getCrowdinConnection } = require('./../_shared');

const performSearchFile = async (z, bundle, event) => {
    const { projectsGroupsApi, sourceFilesApi, usersApi } = await getCrowdinConnection(z, bundle);

    const project = (await projectsGroupsApi.getProject(bundle.inputData.project_id)).data
    const files = (await sourceFilesApi.listProjectFiles(bundle.inputData.project_id, {
        limit: 1
    }))

    if (files.data && files.data.length) {
        const file = files.data[0].data;
        const user = (await usersApi.getAuthenticatedUser()).data

        return [{
            event: event,
            project: project.identifier,
            project_id: project.id,
            language: project.targetLanguageIds[0],
            file_id: file.id,
            file: file.name,
            user_id: user.id,
            user: user.username,
            revision: file.revisionId
        }]
    } else {
        return []
    }
}

module.exports = {
    performSearchFile
};
