export interface UIButtonOptions {
  text: string;
  id?: string;
  className?: string;
  type?: 'normal' | 'submit' | 'danger';
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export interface UIContainerOptions {
  id?: string;
  className?: string;
  children?: HTMLElement[];
}

export class UIFactory {
  /**
   * ボタン要素を作成する
   */
  static createButton(options: UIButtonOptions): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = options.text;
    
    if (options.id) {
      button.id = options.id;
    }
    
    // デフォルトクラスの適用
    button.classList.add('kintoneplugin-button');
    
    // 追加のクラスの適用
    if (options.className) {
      button.classList.add(options.className);
    }
    
    // ボタンタイプに応じたクラスの適用
    if (options.type === 'submit') {
      button.classList.add('kintoneplugin-button-dialog-ok');
    } else if (options.type === 'danger') {
      button.classList.add('kintoneplugin-button-dialog-cancel');
    }
    
    // 無効化状態の設定
    if (options.disabled) {
      button.disabled = true;
    }
    
    // クリックイベントの設定
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    
    return button;
  }
  
  /**
   * DIVコンテナ要素を作成する
   */
  static createContainer(options: UIContainerOptions): HTMLDivElement {
    const container = document.createElement('div');
    
    if (options.id) {
      container.id = options.id;
    }
    
    // 追加のクラスの適用
    if (options.className) {
      container.classList.add(options.className);
    }
    
    // 子要素の追加
    if (options.children && options.children.length > 0) {
      options.children.forEach(child => {
        container.appendChild(child);
      });
    }
    
    return container;
  }
  
  /**
   * 見出し要素を作成する
   */
  static createHeading(text: string, level: 1 | 2 | 3 = 2): HTMLHeadingElement {
    const tag = `h${level}`;
    const heading = document.createElement(tag) as HTMLHeadingElement;
    heading.textContent = text;
    heading.classList.add(`app-version-heading-${level}`);
    
    return heading;
  }
  
  /**
   * テキスト表示エリアを作成する
   */
  static createTextDisplay(id: string, className?: string): HTMLDivElement {
    const display = document.createElement('div');
    display.id = id;
    
    display.classList.add('app-version-result-content');
    if (className) {
      display.classList.add(className);
    }
    
    return display;
  }
  
  /**
   * 読み込み中の表示要素を作成する
   */
  static createLoadingSpinner(): HTMLDivElement {
    const spinner = document.createElement('div');
    spinner.classList.add('app-version-loading-spinner');
    
    const spinnerInner = document.createElement('div');
    spinnerInner.classList.add('app-version-loading-spinner-inner');
    
    for (let i = 0; i < 3; i++) {
      const bounce = document.createElement('div');
      bounce.classList.add('app-version-loading-bounce');
      spinnerInner.appendChild(bounce);
    }
    
    spinner.appendChild(spinnerInner);
    
    return spinner;
  }
  
  /**
   * 結果表示コンテナを作成する
   */
  static createResultContainer(title: string, contentId: string): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('app-version-result-container');
    
    const titleElement = document.createElement('div');
    titleElement.classList.add('app-version-result-title');
    titleElement.textContent = title;
    
    const content = this.createTextDisplay(contentId);
    
    container.appendChild(titleElement);
    container.appendChild(content);
    
    return container;
  }
}