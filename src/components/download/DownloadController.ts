import {getDataStream, getVideoLink} from "./DownloadResources";

export const DownloadController = async (url: string, saveTo: string) => {
    const link = await getVideoLink(url);
    return await getDataStream(link, saveTo);
}