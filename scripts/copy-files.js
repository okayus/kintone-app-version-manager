import fs from 'fs-extra';
import path from 'path';

// ビルド後のファイルをプラグインディレクトリにコピーする
try {
  // desktop.jsをplugin/jsディレクトリにコピー
  const srcPath = path.resolve('dist', 'js', 'desktop.js');
  const destPath = path.resolve('plugin', 'js', 'desktop.js');
  
  // plugin/jsディレクトリが存在しない場合は作成
  fs.ensureDirSync(path.resolve('plugin', 'js'));
  
  // ファイルをコピー
  fs.copyFileSync(srcPath, destPath);
  
  console.log(`Successfully copied: ${srcPath} -> ${destPath}`);
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}
