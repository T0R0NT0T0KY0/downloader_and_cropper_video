const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const cropVideoController = async (filepath, format: string, skip, duration, saveTo) => {
    try {
        console.log({duration})
        const durationn = duration ? duration : await new Promise(async (resolve) => {
            ffmpeg.ffprobe(filepath, ((err, data) => resolve(data.format.duration) ))
        })
        console.log({durationn})
        return new Promise(async (resolve) => {
            console.log({saveTo})
            ffmpeg()
                .input(filepath)
                .audioCodec('aac')
                .videoCodec('libx264')
                .format(format)
                .seekInput(skip | 0)
                .duration(durationn)
                .on('end', () => {
                    console.log(`Video ${saveTo} was cropped !`);
                    return resolve('success')
                })
                .on('error', function (err) {
                    console.log('Cannot process video: ' + err.message);
                    return resolve(null)
                })
                .save(saveTo);
        })

    } catch (e) {
        console.log({cropError: e});
        return null;
    }
}