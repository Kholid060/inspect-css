import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import packageJSON from '../../package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = process.env.__FIREFOX__ ? 'firefox' : 'chrome';
const appVersion = packageJSON.version;
const fileName = `${packageJSON.name}-${browser}-v${appVersion}.zip`;

const destDir = path.join(__dirname, '../../dist');
const zipDir = path.join(__dirname, '../../dist-zip', appVersion);

fs.ensureDirSync(zipDir, { recursive: true });

const archive = archiver('zip', { zlib: { level: 9 } });
const stream = fs.createWriteStream(path.join(zipDir, fileName));

archive
  .directory(destDir, false)
  .on('error', (error) => {
    console.error(error);
  })
  .pipe(stream);

stream.on('close', () => console.log('Success'));
archive.finalize();
