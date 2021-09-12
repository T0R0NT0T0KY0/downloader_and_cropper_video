import {getDataFromEXCEL} from './resources/excel/parser';
import {config} from "dotenv";
import {DownloadController} from "./components/download/DownloadController";
import {cropVideoController} from "./components/cropp/CropVideoController";
import {uploadFileToMinio} from "./resources/minio/Minio";
import * as process from "process";
import * as fs from "fs";

config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXCEL(filepath);
    for (let d of data) {
        const rawName = `raw videos\\raw_${d['saved file name']}`;
        const croppedName = `crop videos\\cropped_${d['saved file name']}`;
        const videoPath = await DownloadController(d['link to download'],
            rawName);
        if (!videoPath) {
            // todo set status "ERR download"
            return;
        }
        //todo set status "downloaded"
        const croppedVideo = await cropVideoController(rawName, 'mp4', d['start'], d['duration'],
            croppedName);
        if (!croppedVideo) {
            // todo set status "ERR crop"
            return;
        }
        //todo set status "cropped"
        // todo delete downloaded video
        await uploadFileToMinio({ bucket: process.env.MINIO_BUCKET,
            fileName: process.env.MINIO_PATH + '/' + d['saved file name'],
            buff: fs.readFileSync(croppedName)
        })
        //todo set file link on minio
    }
}
