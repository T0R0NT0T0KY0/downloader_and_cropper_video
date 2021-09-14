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
        const sFName = d['saved file name'].replace(/\s/g, '_').replace(/(A-Z)/, '$1'.toLowerCase());
        const rawName = `raw_videos/raw_${sFName}`;
        if (d['status'] === 'on minio') {
            console.log(`${sFName} was on minio already`)
            continue;
        }
        const croppedName = `crop_videos/cropped_${sFName}`;
        console.log(`start ${sFName}`)
        const video = await (DownloadController(d['link to download'], rawName)
            .then((data) => {
                console.log(`downloaded ${sFName}`);
                return data;
            }, err => console.log({downloadedError: err})));

        if (!video) {
            return updateEXCEL(filePathToEXCEL, i, 'status', 'ERR download')
        }

        const croppedVideo = await (cropVideoController(rawName, 'mp4', d['start'], d['duration'],
            croppedName)
            .then(async (cropped) => {
                console.log(`cropped ${sFName}`)
                await deleteVideo(rawName);
                return cropped;
            }));

        if (!croppedVideo) {
            return updateEXCEL(filePathToEXCEL, i, 'status', 'ERR crop')
        }
        console.log({croppedName})
        try {
            await uploadFileToMinio({
                bucket: process.env.MINIO_BUCKET,
                fileName: process.env.MINIO_PATH + '/' + sFName,
                buff: fs.readFileSync(croppedName)
            }).then(async (data) => {
                await deleteVideo(croppedName);
                return data;
            })
            await updateEXCEL(filePathToEXCEL, i, 'status', 'on minio');
            await updateEXCEL(filePathToEXCEL, i, 'minio link', getFileURI(sFName));
        } catch (e) {
            updateEXCEL(filePathToEXCEL, i, 'status', 'err minio');
            console.log(`minio err ${sFName}`);
        }
        await console.log(`finish ${sFName}`);
        await console.log(`-------------------------`);
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
