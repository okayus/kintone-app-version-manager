import { KintoneApiClient, AppInfo, AppVersion } from '../api/kintoneApiClient';
import { UIFactory } from '../ui/uiFactory';

export class AppVersionManager {
  private container: HTMLElement | null = null;
  private apiClient: KintoneApiClient;
  private currentAppId: string;
  private elements: {
    versionInfo: HTMLElement | null;
    deployStatus: HTMLElement | null;
  };

  constructor(appId: string) {
    this.apiClient = new KintoneApiClient();
    this.currentAppId = appId;
    this.elements = {
      versionInfo: null,
      deployStatus: null
    };
  }

  /**
   * 初期化処理
   */
  public async initialize(): Promise<void> {
    // ヘッダー要素を取得
    const headerSpace = this.getHeaderSpace();

    if (!headerSpace) {
      console.error('Header space element not found');
      return;
    }

    // ボタン群を作成
    const buttonsContainer = this.createButtons();

    // 結果表示エリアを作成
    const resultsContainer = this.createResultsContainer();

    // メインコンテナを作成
    this.container = UIFactory.createContainer({
      id: 'app-version-manager-container',
      children: [buttonsContainer, resultsContainer]
    });

    // ヘッダーに追加
    headerSpace.appendChild(this.container);
  }

  /**
   * ヘッダー要素を取得する
   */
  private getHeaderSpace(): HTMLElement | null {
    return document.querySelector('.gaia-argoui-app-index-toolbar');
  }

  /**
   * 操作ボタンを作成する
   */
  private createButtons(): HTMLElement {
    // アプリ情報取得ボタン
    const getAppInfoButton = UIFactory.createButton({
      text: 'アプリ情報取得',
      id: 'get-app-info-button',
      className: 'app-version-manager-button',
      onClick: this.handleGetAppInfo.bind(this)
    });

    // バージョン履歴取得ボタン
    const getVersionsButton = UIFactory.createButton({
      text: 'バージョン履歴取得',
      id: 'get-versions-button',
      className: 'app-version-manager-button',
      onClick: this.handleGetAppVersions.bind(this)
    });

    // デプロイボタン
    const deployButton = UIFactory.createButton({
      text: 'バージョンをデプロイ',
      id: 'deploy-version-button',
      className: 'app-version-manager-button',
      type: 'submit',
      onClick: this.handleDeployVersion.bind(this)
    });

    // ボタン群のコンテナを作成
    return UIFactory.createContainer({
      className: 'app-version-button-container',
      children: [getAppInfoButton, getVersionsButton, deployButton]
    });
  }

  /**
   * 結果表示エリアを作成する
   */
  private createResultsContainer(): HTMLElement {
    // バージョン情報の表示エリア
    const versionInfoContainer = UIFactory.createResultContainer(
      'バージョン情報',
      'version-info-display'
    );
    this.elements.versionInfo = versionInfoContainer.querySelector('#version-info-display');

    // デプロイ状態の表示エリア
    const deployStatusContainer = UIFactory.createResultContainer(
      'デプロイ状態',
      'deploy-status-display'
    );
    this.elements.deployStatus = deployStatusContainer.querySelector('#deploy-status-display');

    // 結果表示エリアのコンテナを作成
    return UIFactory.createContainer({
      className: 'app-version-results-container',
      children: [versionInfoContainer, deployStatusContainer]
    });
  }

  /**
   * アプリ情報を取得するハンドラー
   */
  private async handleGetAppInfo(event: MouseEvent): Promise<void> {
    if (!this.elements.versionInfo) return;

    try {
      this.showLoading(this.elements.versionInfo);
      const appInfo = await this.apiClient.getAppInfo(this.currentAppId);
      this.displayAppInfo(appInfo);
    } catch (error) {
      this.displayError(this.elements.versionInfo, 'アプリ情報の取得に失敗しました', error);
    }
  }

  /**
   * バージョン履歴を取得するハンドラー
   */
  private async handleGetAppVersions(event: MouseEvent): Promise<void> {
    if (!this.elements.versionInfo) return;

    try {
      this.showLoading(this.elements.versionInfo);
      const versions = await this.apiClient.getAppVersions(this.currentAppId);
      this.displayVersions(versions);
    } catch (error) {
      this.displayError(this.elements.versionInfo, 'バージョン履歴の取得に失敗しました', error);
    }
  }

  /**
   * バージョンをデプロイするハンドラー
   */
  private async handleDeployVersion(event: MouseEvent): Promise<void> {
    if (!this.elements.deployStatus) return;

    // リビジョン番号の入力を求める
    const revision = window.prompt('デプロイするリビジョン番号を入力してください:');
    if (!revision) return;

    try {
      this.showLoading(this.elements.deployStatus);
      const { resultId } = await this.apiClient.deployAppVersion(this.currentAppId, revision);
      
      // ステータスのポーリングを開始
      this.pollDeployStatus(resultId);
    } catch (error) {
      this.displayError(this.elements.deployStatus, 'デプロイの開始に失敗しました', error);
    }
  }

  /**
   * デプロイ状態をポーリングして表示する
   */
  private async pollDeployStatus(resultId: string): Promise<void> {
    if (!this.elements.deployStatus) return;

    try {
      const status = await this.apiClient.getDeployStatus(resultId);
      
      // 状態を表示
      this.elements.deployStatus.innerHTML = JSON.stringify(status, null, 2);
      
      // 処理中の場合はポーリングを続行
      if (status.status === 'PROCESSING') {
        setTimeout(() => this.pollDeployStatus(resultId), 2000);
      }
    } catch (error) {
      this.displayError(this.elements.deployStatus, 'デプロイ状態の取得に失敗しました', error);
    }
  }

  /**
   * アプリ情報を表示する
   */
  private displayAppInfo(appInfo: AppInfo): void {
    if (!this.elements.versionInfo) return;
    
    this.elements.versionInfo.innerHTML = JSON.stringify(appInfo, null, 2);
  }

  /**
   * バージョン履歴を表示する
   */
  private displayVersions(versions: AppVersion[]): void {
    if (!this.elements.versionInfo) return;
    
    this.elements.versionInfo.innerHTML = JSON.stringify(versions, null, 2);
  }

  /**
   * エラーメッセージを表示する
   */
  private displayError(element: HTMLElement, message: string, error: unknown): void {
    element.innerHTML = `
      <div class="app-version-error">
        <div class="app-version-error-message">${message}</div>
        <div class="app-version-error-detail">${error instanceof Error ? error.message : String(error)}</div>
      </div>
    `;
  }

  /**
   * ローディング表示を行う
   */
  private showLoading(element: HTMLElement): void {
    const spinner = UIFactory.createLoadingSpinner();
    element.innerHTML = '';
    element.appendChild(spinner);
  }
}