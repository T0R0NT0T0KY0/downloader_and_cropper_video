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
        console.log(`start ${sFName}`)
        DownloadController(d['link to download'], rawName)
            .then((data) => {
                console.log(`downloaded ${sFName}`);
                if (!data) {
                    return updateEXCEL(filePathToEXCEL, i, 'status', 'ERR download')
                }
            }, err => console.log({downloadedError: err}));
    }
    //set wait
    for (let i = 2; i < data.length + 2; i++) {
        const d = data[i - 2];
        const sFName = d['saved file name'].replace(/\s/g, '_').replace(/(A-Z)/, '$1'.toLowerCase());
        const rawName = `raw_videos/raw_${sFName}`;
        const croppedName = `crop_videos/cropped_${sFName}`;
        cropVideoController(rawName, 'mp4', d['start'], d['duration'],
            croppedName)
            .then((cropped) => {
                console.log(`cropped ${sFName}`)
                updateEXCEL(filePathToEXCEL, i, 'status', cropped ? 'cropped' : 'ERR crop')
                deleteVideo(rawName);
            }, (e) => {
                console.log({e})
                updateEXCEL(filePathToEXCEL, i, 'status', 'ERR crop')
            });
    }
    //set wait
    for (let i = 2; i < data.length + 2; i++) {
        const d = data[i - 2];
        const sFName = d['saved file name'].replace(/\s/g, '_').replace(/(A-Z)/, '$1'.toLowerCase());
        const croppedName = `crop_videos/cropped_${sFName}`;
        try {
            uploadFileToMinio({
                bucket: process.env.MINIO_BUCKET,
                fileName: process.env.MINIO_PATH + '/' + sFName,
                buff: fs.readFileSync(croppedName)
            }).then(async (data) => {
                await deleteVideo(croppedName);
                return data;
            })
            updateEXCEL(filePathToEXCEL, i, 'status', 'on minio');
            updateEXCEL(filePathToEXCEL, i, 'minio link', getFileURI(sFName));
            console.log(`on minio ${sFName}`);
        } catch (e) {
            console.log(`minio err ${sFName}`);
            updateEXCEL(filePathToEXCEL, i, 'status', 'err minio');
        }
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
