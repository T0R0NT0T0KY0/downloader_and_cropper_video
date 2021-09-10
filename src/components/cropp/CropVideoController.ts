import ffmpeg from 'fluent-ffmpeg';

export const cropVideoController = (videoStream) => {
    try {
        console.log({videoStream})
        const command = ffmpeg(videoStream)
            .inputFPS(29.7)
            .seekInput(5)
            .videoCodec('libx264')
            .format('mp4')
            .autopad(true, 'black')
            .duration(20)
            .output('testFFMPEG.mp4')
            .run();
        console.log({command})
        return command;
    } catch (e) {
        console.log({error: e.code});
    }
}