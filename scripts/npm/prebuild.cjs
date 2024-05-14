// Include git commit and branch in command line args
const gitCommit = process.argv[2];
const gitBranch = process.argv[3];
const path = require("path");
const fs = require("fs");
const baseLocation = `${__dirname}/../..`;
const packageVersion = require(`${baseLocation}/package.json`).version;

const output =
`export const PACKAGE_VERSION="${packageVersion}";
export const GIT_COMMIT="${gitCommit}";
export const GIT_BRANCH="${gitBranch}";
`;

const outputLocation = path.normalize(`${baseLocation}/src/version.ts`);
fs.writeFile(outputLocation, output, (err) => {
    if (err) {
        throw err;
    }
});