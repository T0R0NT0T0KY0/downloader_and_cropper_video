const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const cropVideoController = async (filepath, format: string, skip, duration, saveTo) => {
    try {
        return  ffmpeg()
            .input(filepath)
            .audioCodec('aac')
            .videoCodec('libx264')
            .format('mp4')
            .seekInput(skip)
            .duration(duration)
            .autopad(true, '#000000')
            .on('end', () => {
                console.log('Processing finished !');
            })
            .save(saveTo)
    } catch (e) {
        console.log({error: e});
    }
}