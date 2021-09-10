import {getDataFromEXEL} from './resources/excel/parser';
import {config} from "dotenv";
import {DownloadController} from "./components/download/DownloadController";

config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXEL(filepath);
    for (let d of data) {
        const videoStream = await DownloadController(d['link to download']);
    }
}
