import {getDataFromEXEL} from './resources/excel/parser';
import { config } from "dotenv";
config();
const filepath = process.env.FILEPATH;

export const run = async () => {
    const data = await getDataFromEXEL(filepath);
}
