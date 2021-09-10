import {getDataFromEXCEL} from './resources/excel/parser';
import {config} from "dotenv";
import {DownloadController} from "./components/download/DownloadController";
import {cropVideoController} from "./components/cropp/CropVideoController";

config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXCEL(filepath);
    for (let d of data) {
        const rawName = `raw videos\\raw_${d['new file name']}`;
        const croppedName = `crop videos\\cropped_${d['new file name']}`;
        const videoPath = await DownloadController(d['link to download'],
            rawName);
        if (videoPath) {
            // todo set in column excel that with download no problems
        }
        const croppedVideo = await cropVideoController(rawName, 'mp4', 5, 15,
            croppedName);
    }
}
