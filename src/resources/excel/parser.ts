import xlsx from 'node-xlsx';

/**
 * returns the contents of an Excel file
 * @param {string} filepath path to file
 */
export const getDataFromEXEL = async (filepath: string) => {
    try {
        const data = xlsx.parse(filepath);
        console.log({data});
        return data;
    } catch (e) {
        console.log({e})
    }
}
