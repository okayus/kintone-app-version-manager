import { describe, it, expect, vi } from 'vitest';
import { UIFactory } from '../uiFactory';

describe('UIFactory', () => {
  
  describe('createButton', () => {
    it('should create a button with basic props', () => {
      const button = UIFactory.createButton({ text: 'Test Button' });
      
      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toBe('Test Button');
      expect(button.classList.contains('kintoneplugin-button')).toBe(true);
    });
    
    it('should add id when specified', () => {
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        id: 'test-button-id' 
      });
      
      expect(button.id).toBe('test-button-id');
    });
    
    it('should add custom class name when specified', () => {
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        className: 'custom-class' 
      });
      
      expect(button.classList.contains('custom-class')).toBe(true);
    });
    
    it('should add submit type class when type is submit', () => {
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        type: 'submit' 
      });
      
      expect(button.classList.contains('kintoneplugin-button-dialog-ok')).toBe(true);
    });
    
    it('should add danger type class when type is danger', () => {
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        type: 'danger' 
      });
      
      expect(button.classList.contains('kintoneplugin-button-dialog-cancel')).toBe(true);
    });
    
    it('should set disabled state when specified', () => {
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        disabled: true 
      });
      
      expect(button.disabled).toBe(true);
    });
    
    it('should attach click handler when specified', () => {
      const clickHandler = vi.fn();
      const button = UIFactory.createButton({ 
        text: 'Test Button', 
        onClick: clickHandler 
      });
      
      // イベントを発火させる
      button.click();
      
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('createContainer', () => {
    it('should create a div container with basic props', () => {
      const container = UIFactory.createContainer({});
      
      expect(container.tagName).toBe('DIV');
    });
    
    it('should add id when specified', () => {
      const container = UIFactory.createContainer({ 
        id: 'test-container-id' 
      });
      
      expect(container.id).toBe('test-container-id');
    });
    
    it('should add custom class name when specified', () => {
      const container = UIFactory.createContainer({ 
        className: 'custom-class' 
      });
      
      expect(container.classList.contains('custom-class')).toBe(true);
    });
    
    it('should append child elements when specified', () => {
      const childElement1 = document.createElement('span');
      childElement1.textContent = 'Child 1';
      
      const childElement2 = document.createElement('span');
      childElement2.textContent = 'Child 2';
      
      const container = UIFactory.createContainer({ 
        children: [childElement1, childElement2] 
      });
      
      expect(container.children.length).toBe(2);
      expect(container.children[0].textContent).toBe('Child 1');
      expect(container.children[1].textContent).toBe('Child 2');
    });
  });
  
  describe('createHeading', () => {
    it('should create a heading with default level (h2)', () => {
      const heading = UIFactory.createHeading('Test Heading');
      
      expect(heading.tagName).toBe('H2');
      expect(heading.textContent).toBe('Test Heading');
      expect(heading.classList.contains('app-version-heading-2')).toBe(true);
    });
    
    it('should create a heading with specified level', () => {
      const heading = UIFactory.createHeading('Test Heading', 1);
      
      expect(heading.tagName).toBe('H1');
      expect(heading.classList.contains('app-version-heading-1')).toBe(true);
    });
  });
  
  describe('createTextDisplay', () => {
    it('should create a text display with specified id', () => {
      const display = UIFactory.createTextDisplay('test-display-id');
      
      expect(display.tagName).toBe('DIV');
      expect(display.id).toBe('test-display-id');
      expect(display.classList.contains('app-version-result-content')).toBe(true);
    });
    
    it('should add custom class name when specified', () => {
      const display = UIFactory.createTextDisplay('test-id', 'custom-class');
      
      expect(display.classList.contains('custom-class')).toBe(true);
    });
  });
  
  describe('createLoadingSpinner', () => {
    it('should create a loading spinner element', () => {
      const spinner = UIFactory.createLoadingSpinner();
      
      expect(spinner.tagName).toBe('DIV');
      expect(spinner.classList.contains('app-version-loading-spinner')).toBe(true);
      
      // 内部要素を検証
      const inner = spinner.firstChild;
      expect(inner?.nodeName).toBe('DIV');
      expect((inner as Element).classList.contains('app-version-loading-spinner-inner')).toBe(true);
      
      // バウンス要素を検証
      expect((inner as Element).children.length).toBe(3);
      Array.from((inner as Element).children).forEach(child => {
        expect(child.classList.contains('app-version-loading-bounce')).toBe(true);
      });
    });
  });
  
  describe('createResultContainer', () => {
    it('should create a result container with title and content', () => {
      const container = UIFactory.createResultContainer('Test Title', 'test-content-id');
      
      expect(container.tagName).toBe('DIV');
      expect(container.classList.contains('app-version-result-container')).toBe(true);
      
      // タイトル要素を検証
      const title = container.firstChild;
      expect(title?.nodeName).toBe('DIV');
      expect((title as Element).classList.contains('app-version-result-title')).toBe(true);
      expect((title as Element).textContent).toBe('Test Title');
      
      // コンテンツ要素を検証
      const content = container.lastChild;
      expect(content?.nodeName).toBe('DIV');
      expect((content as Element).id).toBe('test-content-id');
      expect((content as Element).classList.contains('app-version-result-content')).toBe(true);
    });
  });
});