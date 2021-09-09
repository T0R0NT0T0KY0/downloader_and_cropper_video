import {getDataFromEXEL} from './resources/excel/parser';
import {config} from "dotenv";
import {download} from "./resources/youtube/Downloader";

config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXEL(filepath);
    for (let d of data) {
        const dElement = d['link to download'];
        const video = await download(dElement);

    }
}
