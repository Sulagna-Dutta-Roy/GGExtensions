const express = require('express');
const bodyParser = require('body-parser');
const { getChoice, getInput, scrapeHtmlFromUrl, getJsonFromHtml, getUrlFromHtml, getUrlFromJson, downloadMediaFromUrl } = require('./index');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

app.post('/download', async (req, res) => {
    const { option, link } = req.body;
    let media = [];
    try {
        const html = await scrapeHtmlFromUrl(link);
        const json = await getJsonFromHtml(html);
        if (json) {
            media = await getUrlFromJson(json);
        } else {
            media = await getUrlFromHtml(html);
        }
        if (media.length > 0) {
            await downloadMediaFromUrl(media);
        }
        res.json(media);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
