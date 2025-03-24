import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppVersionManager } from '../appVersionManager';
import { KintoneApiClient } from '../../api/kintoneApiClient';

// KintoneApiClientのモック
vi.mock('../../api/kintoneApiClient', () => {
  const KintoneApiClientMock = vi.fn(() => ({
    getAppInfo: vi.fn(),
    getAppVersions: vi.fn(),
    deployAppVersion: vi.fn(),
    getDeployStatus: vi.fn()
  }));
  
  return {
    KintoneApiClient: KintoneApiClientMock
  };
});

// ブラウザAPIのモック
vi.spyOn(window, 'prompt').mockImplementation(() => '10');

describe('AppVersionManager', () => {
  let manager: AppVersionManager;
  let mockHeaderSpace: HTMLElement;
  
  beforeEach(() => {
    // DOM環境をセットアップ
    document.body.innerHTML = '';
    mockHeaderSpace = document.createElement('div');
    mockHeaderSpace.className = 'gaia-argoui-app-index-toolbar';
    document.body.appendChild(mockHeaderSpace);
    
    manager = new AppVersionManager('123');
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('initialize', () => {
    it('should add UI elements to the header space', async () => {
      await manager.initialize();
      
      // コンテナが追加されていることを確認
      const container = mockHeaderSpace.querySelector('#app-version-manager-container');
      expect(container).not.toBeNull();
      
      // ボタンが追加されていることを確認
      const buttons = container?.querySelector('.app-version-button-container');
      expect(buttons).not.toBeNull();
      expect(buttons?.querySelectorAll('button').length).toBe(3);
      
      // 結果表示エリアが追加されていることを確認
      const results = container?.querySelector('.app-version-results-container');
      expect(results).not.toBeNull();
      expect(results?.querySelectorAll('.app-version-result-container').length).toBe(2);
    });
    
    it('should handle missing header space', async () => {
      // ヘッダースペースを削除
      mockHeaderSpace.remove();
      
      // コンソールエラーをスパイ
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await manager.initialize();
      
      // エラーログが出力されていることを確認
      expect(consoleSpy).toHaveBeenCalledWith('Header space element not found');
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('handleGetAppInfo', () => {
    it('should fetch and display app info', async () => {
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const mockAppInfo = {
        appId: '123',
        code: 'test-app',
        name: 'Test App',
        description: 'Test Description',
        spaceId: '456',
        threadId: '789'
      };
      
      const apiClient = new KintoneApiClient();
      (apiClient.getAppInfo as any).mockResolvedValueOnce(mockAppInfo);
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#get-app-info-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 非同期処理を待機
      await vi.waitFor(() => {
        const displayEl = document.querySelector('#version-info-display');
        expect(displayEl?.textContent).toContain('Test App');
      });
      
      // API呼び出しが正しいパラメータで実行されたことを確認
      expect(apiClient.getAppInfo).toHaveBeenCalledWith('123');
    });
    
    it('should display error when API call fails', async () => {
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const apiClient = new KintoneApiClient();
      (apiClient.getAppInfo as any).mockRejectedValueOnce(new Error('API Error'));
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#get-app-info-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 非同期処理を待機
      await vi.waitFor(() => {
        const displayEl = document.querySelector('#version-info-display');
        expect(displayEl?.innerHTML).toContain('アプリ情報の取得に失敗しました');
        expect(displayEl?.innerHTML).toContain('API Error');
      });
    });
  });
  
  describe('handleGetAppVersions', () => {
    it('should fetch and display app versions', async () => {
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const mockVersions = [
        {
          app: '123',
          revision: '5',
          createdAt: '2025-03-01T09:00:00Z',
          deployedBy: 'user1',
          type: 'CUSTOMIZED'
        }
      ];
      
      const apiClient = new KintoneApiClient();
      (apiClient.getAppVersions as any).mockResolvedValueOnce(mockVersions);
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#get-versions-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 非同期処理を待機
      await vi.waitFor(() => {
        const displayEl = document.querySelector('#version-info-display');
        expect(displayEl?.textContent).toContain('revision');
        expect(displayEl?.textContent).toContain('5');
      });
      
      // API呼び出しが正しいパラメータで実行されたことを確認
      expect(apiClient.getAppVersions).toHaveBeenCalledWith('123');
    });
  });
  
  describe('handleDeployVersion', () => {
    it('should deploy app version and poll status', async () => {
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const apiClient = new KintoneApiClient();
      (apiClient.deployAppVersion as any).mockResolvedValueOnce({ resultId: 'deploy-123' });
      (apiClient.getDeployStatus as any).mockResolvedValueOnce({
        status: 'SUCCESS',
        apps: [{ app: '123', status: 'SUCCESS' }]
      });
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#deploy-version-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 非同期処理を待機
      await vi.waitFor(() => {
        const displayEl = document.querySelector('#deploy-status-display');
        expect(displayEl?.textContent).toContain('SUCCESS');
      });
      
      // API呼び出しが正しいパラメータで実行されたことを確認
      expect(apiClient.deployAppVersion).toHaveBeenCalledWith('123', '10');
      expect(apiClient.getDeployStatus).toHaveBeenCalledWith('deploy-123');
    });
    
    it('should continue polling if status is PROCESSING', async () => {
      // 非同期タイマーをモック
      vi.useFakeTimers();
      
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const apiClient = new KintoneApiClient();
      (apiClient.deployAppVersion as any).mockResolvedValueOnce({ resultId: 'deploy-123' });
      (apiClient.getDeployStatus as any)
        .mockResolvedValueOnce({
          status: 'PROCESSING',
          apps: [{ app: '123', status: 'PROCESSING' }]
        })
        .mockResolvedValueOnce({
          status: 'SUCCESS',
          apps: [{ app: '123', status: 'SUCCESS' }]
        });
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#deploy-version-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 最初のステータス取得を待機
      await vi.runAllTimersAsync();
      
      // この時点でPROCESSINGステータスが表示されていることを確認
      const displayEl = document.querySelector('#deploy-status-display');
      expect(displayEl?.textContent).toContain('PROCESSING');
      
      // 次のポーリングのためにタイマーを進める
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
      
      // SUCCESSステータスに更新されていることを確認
      expect(displayEl?.textContent).toContain('SUCCESS');
      
      // 2回のAPI呼び出しがあったことを確認
      expect(apiClient.getDeployStatus).toHaveBeenCalledTimes(2);
      
      // リアルタイマーに戻す
      vi.useRealTimers();
    });
    
    it('should not deploy if no revision is provided', async () => {
      // 初期化
      await manager.initialize();
      
      // promptが空の値を返すようにモック
      vi.spyOn(window, 'prompt').mockImplementationOnce(() => null);
      
      // APIクライアントのモック設定
      const apiClient = new KintoneApiClient();
      (apiClient.deployAppVersion as any).mockResolvedValueOnce({ resultId: 'deploy-123' });
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#deploy-version-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // API呼び出しがないことを確認
      expect(apiClient.deployAppVersion).not.toHaveBeenCalled();
    });
    
    it('should display error when deploy fails', async () => {
      // 初期化
      await manager.initialize();
      
      // APIクライアントのモック設定
      const apiClient = new KintoneApiClient();
      (apiClient.deployAppVersion as any).mockRejectedValueOnce(new Error('Deploy Error'));
      (manager as any).apiClient = apiClient;
      
      // ボタンクリックをシミュレート
      const button = document.querySelector('#deploy-version-button');
      button?.dispatchEvent(new MouseEvent('click'));
      
      // 非同期処理を待機
      await vi.waitFor(() => {
        const displayEl = document.querySelector('#deploy-status-display');
        expect(displayEl?.innerHTML).toContain('デプロイの開始に失敗しました');
        expect(displayEl?.innerHTML).toContain('Deploy Error');
      });
    });
  });
});