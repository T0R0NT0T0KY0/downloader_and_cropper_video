const XLSX = require('xlsx');
const Excel = require('exceljs');

/**
 * returns the contents of an Excel file
 * @param {string} filepath path to file
 */
export const getDataFromEXCEL = async (filepath: string) => {
    try {
        const workbook = XLSX.readFile(filepath);
        return XLSX.utils.sheet_to_json(workbook.Sheets['Лист1']);
    } catch (e) {
        console.log({e})
    }
}
export const updateEXCEL = async (filepath: string, line: number, column, value) => {
    try {
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filepath);
        const worksheet = workbook.getWorksheet('Лист1');
        const sheetToJson = XLSX.readFile(filepath).Sheets['Лист1'];

        const cell = Object.keys(sheetToJson)
            .find((key) => sheetToJson[key]['v'] && sheetToJson[key]['v'] === column ? key : false)
            .replace(/\d/g, '');

        const row = worksheet.getRow(line);
        row.getCell(cell).value = value;
        row.commit();
        await workbook.xlsx.writeFile(filepath);
    } catch (e) {
        console.log({e})
        return false;
    }
}
