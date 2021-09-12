import {getDataFromEXCEL, updateEXCEL} from './resources/excel/parser';
import {config} from "dotenv";
import {DownloadController} from "./components/download/DownloadController";
import {cropVideoController} from "./components/cropp/CropVideoController";
import {getFileURI, uploadFileToMinio} from "./resources/minio/Minio";
import * as process from "process";
import * as fs from "fs";

config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXCEL(filepath);

    for (let i = 2; i < data.length + 2; i++) {
        const d = data[i - 2];
        // const rawName = `raw_videos/raw_${d['saved file name']}`;
        // const croppedName = `crop_videos/cropped_${d['saved file name']}`;
        // const videoPath = await DownloadController(d['link to download'],
        //     rawName);
        // if (!videoPath) {
        //     updateEXCEL(filepath, i,'status', 'ERR download')
        //     return;
        // }
        // const croppedVideo = await cropVideoController(rawName, 'mp4', d['start'], d['duration'],
        //     croppedName);
        // if (!croppedVideo) {
        //     updateEXCEL(filepath, i,'status', 'ERR crop')
        //     return;
        // }
        // todo delete downloaded video
        // await uploadFileToMinio({
        //     bucket: process.env.MINIO_BUCKET,
        //     fileName: process.env.MINIO_PATH + '/' + d['saved file name'],
        //     buff: fs.readFileSync(croppedName)
        // })
        await updateEXCEL(filepath, i, 8, 'on minio');
        updateEXCEL(filepath, i, 9, getFileURI(d['saved file name']));

        //todo set file link on minio
    }
}
