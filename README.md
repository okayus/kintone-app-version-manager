# kintone-app-version-manager

kintoneアプリのバージョン管理を行うプラグインです。

## 機能

このプラグインは、kintoneのアプリ一覧画面に以下の機能を追加します。

- アプリの基本情報を取得して表示
- アプリのバージョン履歴を取得して表示
- 指定したバージョンをデプロイ

## 初回のセットアップ

1. 依存関係のインストール
    ```sh
    npm install
    ```

2. キーの生成
    ```sh
    npm run generate-key
    ```

3. `.env`ファイルの作成
    - `.env`ファイルをプロジェクトのルートディレクトリに作成し、以下の環境変数を設定します。
        ```
        KINTONE_BASE_URL=your_kintone_base_url
        KINTONE_USERNAME=your_kintone_username
        KINTONE_PASSWORD=your_kintone_password
        ```

## 開発

開発サーバーを起動します。
```sh
npm start
```

## ビルド

プラグインをビルドします。
```sh
npm run build
```

## アップロード

ビルドしたプラグインをkintoneにアップロードします。

### Linux/Mac環境
```sh
npm run upload
```

### Windows環境
Windows環境では、直接コマンドを実行する必要があります：
```sh
set KINTONE_BASE_URL=your_kintone_base_url
set KINTONE_USERNAME=your_kintone_username
set KINTONE_PASSWORD=your_kintone_password
npx kintone-plugin-uploader plugin/plugin.zip --base-url %KINTONE_BASE_URL% --username %KINTONE_USERNAME% --password %KINTONE_PASSWORD%
```

本番環境用のプラグインをビルドしてアップロードします。
```sh
npm run build:prod
```

Windows環境では、直接コマンドを実行する必要があります：
```sh
set KINTONE_BASE_URL=your_kintone_base_url
set KINTONE_USERNAME=your_kintone_username
set KINTONE_PASSWORD=your_kintone_password
npx kintone-plugin-uploader plugin/plugin.prod.zip --base-url %KINTONE_BASE_URL% --username %KINTONE_USERNAME% --password %KINTONE_PASSWORD%
```

## テスト

テストを実行します。
```sh
npm test
```

## ディレクトリ構成

- `src/`: ソースコードディレクトリ
  - `api/`: API関連のコード
  - `desktop/`: デスクトップ用のコード
  - `ui/`: UI関連のコード
  - `types/`: 型定義ファイル
- `plugin/`: プラグインファイル
- `scripts/`: ユーティリティスクリプト

## ライセンス

MIT

## 作者

okayus