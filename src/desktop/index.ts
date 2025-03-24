import { AppVersionManager } from './appVersionManager';

// kintoneアプリ一覧画面のイベント
kintone.events.on('app.record.index.show', (event) => {
  // 現在のアプリIDを取得
  const appId = kintone.app.getId().toString();
  
  // アプリバージョン管理クラスのインスタンスを作成
  const manager = new AppVersionManager(appId);
  
  // 初期化
  manager.initialize().catch(error => {
    console.error('Failed to initialize AppVersionManager:', error);
  });
  
  return event;
});