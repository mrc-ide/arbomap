import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { BuildExcel } from "../../src/excel/buildExcel";
import { excelFilename } from "../../src/composables/useExcelDownload";
import { AdminLevel } from "../../src/utils";

XLSX.set_fs(fs);

const baseDir = `${__dirname}/../../public/dengue/may24/resources`;

// 1. Read all indicator values from json

const readResource = (resourcePath: string) => {
    return JSON.parse(fs.readFileSync(path.normalize(`${baseDir}/${resourcePath}`)));
};

const appConfig = readResource("config.json");
const countryNames = readResource("countryNames.json");

const countryIds = appConfig.countries;
console.log(`Generating Excel for ${countryIds.length} countries`);

const admin1Geojson = readResource("geojson/all_adm1_0_5pc_by_iso.json");
const admin1Indicators = readResource("indicators/admin1/global_adm1.json");

const admin2Geojson = {};
const admin2Indicators = {};
countryIds.forEach((countryId) => {
    admin2Geojson[countryId] = readResource(`geojson/admin2/gadm41_${countryId}_2_2_5pc.json`).features;
    admin2Indicators[countryId] = readResource(`indicators/admin2/${countryId}.json`);
});
console.log("Read all indicators and geojson");

//  2. Generate and save Excel files

const getFullFilename = (filename: string) => {
    return path.normalize(`${baseDir}/excel/${filename}`);
};

const builder = new BuildExcel(
    appConfig,
    countryNames,
    admin1Indicators,
    admin2Indicators,
    admin1Geojson,
    admin2Geojson
);

const writeGlobalWorkbook = (filename: string, includeAdmin2: boolean) => {
    const workbook = XLSX.utils.book_new();
    builder.buildGlobalIndicatorsWorkbook(workbook, includeAdmin2);
    XLSX.writeFile(workbook, filename, { compression: true });
    console.log(`Wrote ${filename}`);
};

const level1Filename = getFullFilename(excelFilename(null, AdminLevel.ONE));
writeGlobalWorkbook(level1Filename, false);
const level2Filename = getFullFilename(excelFilename(null, AdminLevel.TWO));
writeGlobalWorkbook(level2Filename, true);

// 3. Save file sizes to report to user

const getFileSizeMB = (filename: string) => {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;
    const fileSizeMB = fileSizeInBytes / (1000 * 1000);
    return fileSizeMB.toFixed(1);
};

const level1Size = getFileSizeMB(level1Filename);
const level2Size = getFileSizeMB(level2Filename);

const fileSizesSrc = `// NB This file is generated by generate_global_excel.ts
export default { level1: ${level1Size}, level2: ${level2Size} }`;
const sizesSrcPath = `${__dirname}/../../src/excel/globalFileSizes.ts`;
fs.writeFileSync(sizesSrcPath, fileSizesSrc);
console.log(`Wrote ${sizesSrcPath}`);
