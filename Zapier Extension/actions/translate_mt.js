const { languageInputField, mtInputField, getCrowdinConnection } = require('./../_shared');

async function execute(z, bundle) {
    const { machineTranslationApi } = await getCrowdinConnection(z, bundle);

    const data = (await machineTranslationApi.translate(bundle.inputData.mt_id, {
        languageRecognitionProvider: 'engine',
        sourceLanguageId: bundle.inputData.source_language_id,
        targetLanguageId: bundle.inputData.target_language_id,
        strings: bundle.inputData.strings
    })).data

    //array to object as Zapier likes it more
    data.strings = data.strings.reduce(function (result, item, index, array) {
        result[`string_${index}`] = item;
        return result;
    }, {})

    data.translations = data.translations.reduce(function (result, item, index, array) {
        result[`string_${index}`] = item;
        return result;
    }, {})

    return data
}

module.exports = {
    noun: "Translation",
    display: {
        hidden: false,
        description: "Auto detect source language and translate with selected MT engine.",
        label: "Translate via Machine Translation"
    },
    key: "translate_mt",
    operation: {
        perform: execute,
        inputFields: [
            mtInputField,
            { ...languageInputField, label: 'Source Language (leave empty to detect automatically)', key: 'source_language_id', required: false },
            { ...languageInputField, label: 'Target Language', key: 'target_language_id' },
            { type: 'text', list: true, key: 'strings', required: true, label: 'Text To Translate' }
        ],
        sample: {
            "languageRecognitionProvider": "crowdin",
            "sourceLanguageId": "en",
            "targetLanguageId": "de",
            "strings": [
                "Welcome!",
                "Save as...",
                "View",
                "About..."
            ]
        }
    },
};