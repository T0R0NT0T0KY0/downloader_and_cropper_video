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
        // const workBook = XLSX.readFileSync(filepath);
        // // const worksheet = workBook.Sheets['Лист1'];
        // // workSheetJson[line][column] = value;
        // const ws = workBook.Sheets['Лист1']
        // workBook.Sheets['Лист1'] = XLSX.utils.sheet_add_json(workBook.Sheets['Лист1'],
        //     [JSON.parse(`{"${column}": "${value}"}`)])
        //
        // console.log({wsj: XLSX.utils.sheet_to_json(workBook.Sheets['Лист1'])})
        // console.log({workBook: workBook.Sheets['Лист1']})
        // // workBook.Sheets['Лист1']
        // XLSX.writeFileSync(workBook, 'filepath.xlsx');
        // return true;
        //
        console.log(column)
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filepath);
        let worksheet = workbook.getWorksheet('Лист1');
        // header id name dob
        let row = worksheet.getRow(line);
        row.getCell(column).value = value;
        row.commit();
        await workbook.xlsx.writeFile(filepath);
    } catch (e) {
        console.log({e})
        return false;
    }
}
