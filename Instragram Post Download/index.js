const fetch = require("node-fetch");
const chalk = require("chalk");
const inquirer = require("inquirer");
const cheerio = require("cheerio");
const fs = require("fs");

const getChoice = () => new Promise((resolve, reject) => {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose a option",
            choices: ["Feed", "TV", "Reels", "Story", "Highlights", "Exit"]
        }
    ])
    .then(res => resolve(res))
    .catch(err => reject(err));
});

const getInput = (teks) => new Promise((resolve, reject) => {
    inquirer.prompt([
        {
            name: "input",
            message: teks
        }
    ])
    .then(res => {
        resolve(res)
    })
    .catch(err => reject(err));
});


const urlChecker = (url) => {
    const reg = new RegExp("(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]{11}\/)");
    const match = url.match(reg);
    return match;
}

const downloadMediaFromUrl = (urls) => new Promise((resolve, reject) => {
    console.log(chalk.blue("[*] Processing..."));
    urls.forEach((url) => {
        const fileName = new URL(url).pathname.split("/").pop();
        const res = fetch(url);
        res.then(res => {
            const folder = `downloads/`;
            const file = fs.createWriteStream(folder+fileName);
            res.body.pipe(file);
            file.on("finish", () => {
                file.close();          
            })
            file.on("error", (err) => {
                reject(err);
            });
        })
        .catch(err => reject(err));
    });
    resolve();
});

const scrapeHtmlFromUrl = async (url) => {
    const matching = await urlChecker(url);
    if(!matching){
        console.log(chalk.red("[X] URL not valid"));
        return;
    } 
    const urlApi = `${matching[0]}embed/`;
    const res = await fetch(urlApi);
    const html = await res.text();
    
    return html;
}

const getJsonFromHtml = async (html) => {
    var json = null;
    const $ = cheerio.load(html);
    $("script").each((i, el) => {
        const script = $(el).html();
        const reg = new RegExp("window\\.__additionalDataLoaded\\((.*)\\)");
        const match = script.match(reg);
        if(match){
            const res = match[1].replace("'extra',", "");
            json = JSON.parse(res);
        }
    });
    return json;
}

const getUrlFromHtml = async (html) => {
    const $ = cheerio.load(html);
    const url = $(".EmbeddedMediaImage").attr("src");
    return [url];
}

const getUrlFromJson = async (json) => {
    const data = json.shortcode_media;
    const isSingle = (data.edge_sidecar_to_children) ? false : true;

    if (isSingle) {
        if(data.is_video){
            return [data.video_url];
        } else{
            return [data.display_url];
        }
    } else{
        const urls = [];
        data.edge_sidecar_to_children.edges.forEach(edge => {
            if(edge.node.is_video){
                urls.push(edge.node.video_url);
            } else{
                urls.push(edge.node.display_url);
            }
        });
        return urls;
    }
}

(async () => {
    console.log(chalk.magenta("Starting Instagram Downloader..."));
    
    const choice = await getChoice();
    if(choice.choice == "Exit"){
        console.log(chalk.red("Exiting..."));
        return;
    }

    if(choice.choice == "Feed" || choice.choice == "TV" || choice.choice == "Reels"){
        const getInputUrl = await getInput("Enter the URL of the post: ");
        const inputUrl = getInputUrl.input;
        if (!inputUrl) {
            console.log(chalk.red("[x] URL is required"));
            return;
        }

        const html = await scrapeHtmlFromUrl(inputUrl)
        const json = await getJsonFromHtml(html);
        var urls = [];
        if(json){
            // console.log(chalk.green("[*] Found JSON"));
            urls = await getUrlFromJson(json);
        } else{
            // console.log(chalk.green("[*] Found HTML"));
            urls = await getUrlFromHtml(html);
        }
        
        if(urls.length > 0){
            console.log(chalk.green(`[!] ${urls.length} media found`));
            downloadMediaFromUrl(urls)
            .then(() => {
                console.log(chalk.green(`[+] Successfully downloaded ${urls.length} media`));
            })
            .catch(err => {
                console.log(chalk.red(`[x] ${err}`));
            });
        } else{
            console.log(chalk.red("[X] Error getting URL"));
        }
    } else{
        console.log(chalk.yellow("[!] Coming soon..."));
    }
})();
module.exports = {
    getChoice,
    getInput,
    scrapeHtmlFromUrl,
    getJsonFromHtml,
    getUrlFromHtml,
    getUrlFromJson,
    downloadMediaFromUrl
};
