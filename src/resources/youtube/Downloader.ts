import {raw} from "youtube-dl-exec";

export const download = async (url: string) => {
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
    const link = JSON.parse(data.stdout).formats
        .filter(value => value['format_note'] === '1080p').url;
    console.log({link});
    fetch(link).then(r => console.log(r))
}