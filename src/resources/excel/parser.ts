const XLSX = require('xlsx');

/**
 * returns the contents of an Excel file
 * @param {string} filepath path to file
 */
export const getDataFromEXEL = async (filepath: string) => {
    try {
        const workbook = XLSX.readFile(filepath);
        return XLSX.utils.sheet_to_json(workbook.Sheets['Лист1']);
    } catch (e) {
        console.log({e})
    }
}
