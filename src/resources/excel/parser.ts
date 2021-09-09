import xlsx from 'node-xlsx';

export const getDataFromEXEL = async (filepath: string) => {
    try {
        const data = xlsx.parse(filepath);
        console.log({data});
        return data;
    } catch (e) {
        console.log({e})
    }
}
