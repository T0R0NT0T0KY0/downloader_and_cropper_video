import {raw} from "youtube-dl-exec";


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

export const downloadFile = async (link: string) => {
    return  await fetch(link)
        .then((response) => {
            return response.body;
        }).catch(()=> null);
}