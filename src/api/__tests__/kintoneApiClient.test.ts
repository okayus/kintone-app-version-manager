import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KintoneApiClient } from '../kintoneApiClient';

// モックの実装
vi.mock('@kintone/rest-api-client', () => {
  const mockGetApp = vi.fn();
  const mockGetAppVersions = vi.fn();
  const mockDeployAppSettings = vi.fn();
  const mockGetDeployStatus = vi.fn();

  return {
    KintoneRestAPIClient: class {
      app = {
        getApp: mockGetApp,
        getAppVersions: mockGetAppVersions,
        deployAppSettings: mockDeployAppSettings,
        getDeployStatus: mockGetDeployStatus
      };
    }
  };
});

describe('KintoneApiClient', () => {
  let client: KintoneApiClient;
  
  // REST API クライアントのモックを取得
  const getMockClient = () => {
    const mockClient = (client as any).client;
    return mockClient.app;
  };

  beforeEach(() => {
    client = new KintoneApiClient();
    vi.clearAllMocks();
  });

  describe('getAppInfo', () => {
    it('should return formatted app info', async () => {
      // モックの設定
      getMockClient().getApp.mockResolvedValueOnce({
        appId: 123,
        code: 'test-app',
        name: 'Test App',
        description: 'Test Description',
        spaceId: 456,
        threadId: 789
      });

      // 関数の実行
      const result = await client.getAppInfo('123');

      // 引数の検証
      expect(getMockClient().getApp).toHaveBeenCalledWith({ id: 123 });

      // 結果の検証
      expect(result).toEqual({
        appId: '123',
        code: 'test-app',
        name: 'Test App',
        description: 'Test Description',
        spaceId: '456',
        threadId: '789'
      });
    });

    it('should handle missing optional fields', async () => {
      // モックの設定
      getMockClient().getApp.mockResolvedValueOnce({
        appId: 123,
        name: 'Test App',
      });

      // 関数の実行
      const result = await client.getAppInfo('123');

      // 結果の検証
      expect(result).toEqual({
        appId: '123',
        code: '',
        name: 'Test App',
        description: '',
        spaceId: null,
        threadId: null
      });
    });

    it('should handle errors', async () => {
      // モックの設定
      getMockClient().getApp.mockRejectedValueOnce(new Error('API error'));

      // 関数の実行と例外の検証
      await expect(client.getAppInfo('123')).rejects.toThrow('API error');
    });
  });

  describe('getAppVersions', () => {
    it('should return formatted app versions', async () => {
      // モックの設定
      getMockClient().getAppVersions.mockResolvedValueOnce({
        versions: [
          {
            app: 123,
            revision: 5,
            createdAt: '2025-03-01T09:00:00Z',
            deployedBy: { code: 'user1' },
            historyType: 'IMPORT'
          },
          {
            app: 123,
            revision: 4,
            createdAt: '2025-02-28T09:00:00Z',
            deployedBy: null,
            historyType: 'APP_CUSTOMIZE'
          }
        ]
      });

      // 関数の実行
      const result = await client.getAppVersions('123');

      // 引数の検証
      expect(getMockClient().getAppVersions).toHaveBeenCalledWith({ app: 123 });

      // 結果の検証
      expect(result).toEqual([
        {
          app: '123',
          revision: '5',
          createdAt: '2025-03-01T09:00:00Z',
          deployedBy: 'user1',
          type: 'CUSTOMIZED'
        },
        {
          app: '123',
          revision: '4',
          createdAt: '2025-02-28T09:00:00Z',
          deployedBy: null,
          type: 'PRESET'
        }
      ]);
    });

    it('should handle errors', async () => {
      // モックの設定
      getMockClient().getAppVersions.mockRejectedValueOnce(new Error('API error'));

      // 関数の実行と例外の検証
      await expect(client.getAppVersions('123')).rejects.toThrow('API error');
    });
  });

  describe('deployAppVersion', () => {
    it('should deploy app version and return resultId', async () => {
      // モックの設定
      getMockClient().deployAppSettings.mockResolvedValueOnce('result-id-123');

      // 関数の実行
      const result = await client.deployAppVersion('123', '5');

      // 引数の検証
      expect(getMockClient().deployAppSettings).toHaveBeenCalledWith({
        apps: [{ app: 123, revision: 5 }]
      });

      // 結果の検証
      expect(result).toEqual({ resultId: 'result-id-123' });
    });

    it('should handle errors', async () => {
      // モックの設定
      getMockClient().deployAppSettings.mockRejectedValueOnce(new Error('API error'));

      // 関数の実行と例外の検証
      await expect(client.deployAppVersion('123', '5')).rejects.toThrow('API error');
    });
  });

  describe('getDeployStatus', () => {
    it('should return deploy status', async () => {
      // モックの設定
      getMockClient().getDeployStatus.mockResolvedValueOnce({
        status: 'SUCCESS',
        apps: [
          { app: 123, status: 'SUCCESS' }
        ]
      });

      // 関数の実行
      const result = await client.getDeployStatus('result-id-123');

      // 引数の検証
      expect(getMockClient().getDeployStatus).toHaveBeenCalledWith({ resultId: 'result-id-123' });

      // 結果の検証
      expect(result).toEqual({
        status: 'SUCCESS',
        apps: [
          { app: '123', status: 'SUCCESS' }
        ]
      });
    });

    it('should handle errors', async () => {
      // モックの設定
      getMockClient().getDeployStatus.mockRejectedValueOnce(new Error('API error'));

      // 関数の実行と例外の検証
      await expect(client.getDeployStatus('result-id-123')).rejects.toThrow('API error');
    });
  });
});
