import {getDataFromEXCEL, updateEXCEL} from './resources/excel/parser';
import {config} from "dotenv";
import {DownloadController} from "./components/download/DownloadController";
import {cropVideoController} from "./components/cropp/CropVideoController";
import {getFileURI, uploadFileToMinio} from "./resources/minio/Minio";
import * as process from "process";
import * as fs from "fs";

config();
const filePathToEXCEL = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXCEL(filePathToEXCEL);
    for (let i = 2; i < data.length + 2; i++) {
        const d = data[i - 2];
        const sFName = d['saved file name'].replace(/\s/g, '_');
        const rawName = `raw_videos/raw_${sFName}`;
        const croppedName = `crop_videos/cropped_${sFName}`;
        console.log(`start ${sFName}`)
        const video = await (DownloadController(d['link to download'], rawName)
            .then((data) => {
                console.log(`downloaded ${sFName}`);
                return data;
            }));

        if (!video) {
            return updateEXCEL(filePathToEXCEL, i, 'status', 'ERR download')
        }

        const croppedVideo = await (cropVideoController(rawName, 'mp4', d['start'], d['duration'],
            croppedName)
            .then(async (cropped) => {
                console.log(`cropped ${sFName}`)
                console.log({cropped})
                await deleteVideo(rawName);
                return cropped;
            }));

        if (!croppedVideo) {
            return updateEXCEL(filePathToEXCEL, i, 'status', 'ERR crop')
        }
        const dt = await uploadFileToMinio({
            bucket: process.env.MINIO_BUCKET,
            fileName: process.env.MINIO_PATH + '/' + sFName,
            buff: fs.readFileSync(croppedName)
        }).then(async (data) => {
            await deleteVideo(croppedName);
            return data;
        })
        if (dt[0]) {
            updateEXCEL(filePathToEXCEL, i, 'status', 'err minio');
            return console.log(`minio err ${sFName}`);
        }
        await updateEXCEL(filePathToEXCEL, i, 'status', 'on minio');
        await updateEXCEL(filePathToEXCEL, i, 'minio link', getFileURI(sFName));
        await console.log(`finish ${sFName}`);
    }
}

const deleteVideo = async (filePath) => {
    const path = process.env.ABSOLUT_PATH_TO_DIR + '/' + filePath;
    console.log(path);
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Файл ${filePath} удалён`);
        }
    });
}
