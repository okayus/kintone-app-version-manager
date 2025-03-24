import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ppkFilePath = 'private.ppk';
const ppkFileProdPath = 'private.prod.ppk';

// キーが存在するかチェック
if (!fs.existsSync(ppkFilePath)) {
  try {
    // Windows環境のチェック
    const isWindows = process.platform === 'win32';
    const command = isWindows
      ? `.\\node_modules\\.bin\\kintone-plugin-packer --ppk ${ppkFilePath} --out dist\\plugin.zip dist\\out`
      : `./node_modules/.bin/kintone-plugin-packer --ppk ${ppkFilePath} --out dist/plugin.zip dist/out`;

    console.log('Generating plugin key...');
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully generated: ${ppkFilePath}`);
    
    // 本番用キーのコピー
    fs.copyFileSync(ppkFilePath, ppkFileProdPath);
    console.log(`Successfully copied to production key: ${ppkFileProdPath}`);
  } catch (error) {
    console.error('Error generating plugin key:', error.message);
    process.exit(1);
  }
} else {
  console.log(`Plugin key already exists: ${ppkFilePath}`);
}
