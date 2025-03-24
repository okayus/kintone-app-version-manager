import { KintoneRestAPIClient } from '@kintone/rest-api-client';

export interface AppInfo {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
}

export interface AppVersion {
  app: string;
  revision: string;
  createdAt: string;
  deployedBy: string | null;
  type: 'PRESET' | 'CUSTOMIZED';
}

export interface DeployStatus {
  status: 'PROCESSING' | 'SUCCESS' | 'FAIL' | 'CANCEL';
  apps: Array<{
    app: string;
    status: 'PROCESSING' | 'SUCCESS' | 'FAIL' | 'CANCEL';
  }>;
}

export class KintoneApiClient {
  private client: KintoneRestAPIClient;

  constructor() {
    this.client = new KintoneRestAPIClient();
  }

  // アプリ情報の取得
  async getAppInfo(appId: string): Promise<AppInfo> {
    try {
      const resp = await this.client.app.getApp({ id: Number(appId) });
      return {
        appId: String(resp.appId),
        code: resp.code || '',
        name: resp.name,
        description: resp.description || '',
        spaceId: resp.spaceId ? String(resp.spaceId) : null,
        threadId: resp.threadId ? String(resp.threadId) : null,
      };
    } catch (error) {
      console.error('Error getting app info:', error);
      throw error;
    }
  }

  // アプリのバージョン履歴取得
  async getAppVersions(appId: string): Promise<AppVersion[]> {
    try {
      const resp = await this.client.app.getAppVersions({ app: Number(appId) });
      return resp.versions.map(version => ({
        app: appId,
        revision: String(version.revision),
        createdAt: version.createdAt,
        deployedBy: version.deployedBy ? version.deployedBy.code : null,
        type: version.historyType === 'IMPORT' ? 'CUSTOMIZED' : 'PRESET',
      }));
    } catch (error) {
      console.error('Error getting app versions:', error);
      throw error;
    }
  }

  // アプリバージョンのデプロイ
  async deployAppVersion(appId: string, revision: string): Promise<{ resultId: string }> {
    try {
      const resp = await this.client.app.deployAppSettings({
        apps: [{ app: Number(appId), revision: Number(revision) }]
      });
      return { resultId: resp };
    } catch (error) {
      console.error('Error deploying app version:', error);
      throw error;
    }
  }

  // デプロイ状況確認
  async getDeployStatus(resultId: string): Promise<DeployStatus> {
    try {
      const resp = await this.client.app.getDeployStatus({ resultId });
      return {
        status: resp.status as 'PROCESSING' | 'SUCCESS' | 'FAIL' | 'CANCEL',
        apps: resp.apps.map(app => ({
          app: String(app.app),
          status: app.status as 'PROCESSING' | 'SUCCESS' | 'FAIL' | 'CANCEL'
        }))
      };
    } catch (error) {
      console.error('Error getting deploy status:', error);
      throw error;
    }
  }
}
