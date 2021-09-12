const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const cropVideoController = async (filepath, format: string, skip, duration, saveTo) => {
    try {
        return  ffmpeg()
            .input(filepath)
            .audioCodec('aac')
            .videoCodec('libx264')
            .format(format)
            .seekInput(skip)
            .duration(duration)
            .on('end', () => {
                console.log(`Video ${saveTo} was cropped !`);
            })
            .on('error', () => {
                console.log(`Error with Video ${saveTo}. Wasn't cropped !`);
                return null;
            })
            .save(saveTo)
    } catch (e) {
        console.log({error: e});
    }
}