import {raw} from "youtube-dl-exec";
import fetch from "node-fetch";
import * as fs from "fs";

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
    const t = JSON.parse(data.stdout).formats
        .find(value => value['format_note'] === '1080p' && codecs.has(value.vcodec));
    return t.url;
}

export const getDataStream = async (link: string, saveTo: string) => {
    return new Promise(async (resolve) => {
        fetch(link)
            .then(async (response, reject) => {
                const dataStream = response.body;
                const file = fs.createWriteStream(saveTo);
                dataStream.on("data", (chunk) => {
                    file.write(chunk);
                });
                dataStream.on("end", () => {
                    return resolve(dataStream);
                });
                dataStream.on("err", (err) => {
                    return reject(err)
                });
            }).catch((e) => console.log({e}));
    })
}

const codecs = new Set().add('vp9')
    .add('avc1.4d400c')
    .add('avc1.4d401e')
    //bad   .add('av01.0.00M.08')
    .add('avc1.4d4015')
    //bad   .add('av01.0.01M.08')
    //bad   .add('av01.0.04M.08')
    .add('avc1.4d401f')
    //bad   .add('av01.0.05M.08')
    //bad   .add('av01.0.08M.08')
    .add('avc1.640028')
    .add('avc1.42001E')
//bad   .add('avc1.64001F')