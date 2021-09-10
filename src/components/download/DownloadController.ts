import {downloadFile, getVideoLink} from "./DownloadResources";

export const DownloadController = async (url: string) => {
    const link = await getVideoLink(url);
    return downloadFile(link);
}