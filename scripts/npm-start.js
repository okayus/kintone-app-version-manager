import { spawnSync } from 'child_process';
import fs from 'fs';

// 必要なディレクトリを作成
const dirs = ['dist', 'dist/js', 'dist/css', 'dist/image'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 環境ファイルのチェック
if (!fs.existsSync('.env')) {
  console.error('Error: .env file not found');
  console.log('Please create a .env file with the following content:');
  console.log(`
KINTONE_BASE_URL=your_kintone_base_url
KINTONE_USERNAME=your_kintone_username
KINTONE_PASSWORD=your_kintone_password
  `);
  process.exit(1);
}

// 開発サーバーを起動
console.log('Starting development server...');
const devProcess = spawnSync('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
