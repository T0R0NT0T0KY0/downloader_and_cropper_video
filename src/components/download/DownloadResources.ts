import {raw} from "youtube-dl-exec";
import fetch from "node-fetch";

export const getVideoLink = async (url: string) => {
    const data = await raw(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
    });
    if (data.stderr['_hadError']) {
        console.log({stderr: data.stderr})
        return false;
    }
    //todo search min by value['filesize']
    return JSON.parse(data.stdout).formats
        .find(value => value['format_note'] === '1080p').url;
}

export const getDataStream = async (link: string) => {
    return new Promise((resolve) => {
        fetch(link)
            .then((response) => {
                const dataStream = response.body;
                const chunks = [];
                dataStream.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                dataStream.on("end", () => {
                    return resolve(Buffer.concat(chunks));
                });
                dataStream.on("error", (err) => {
                    return [err];
                });
            }).catch(() => null);
    })
}