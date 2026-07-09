import 'grapesjs/dist/css/grapes.min.css';
import grapesjs, { type Component, type Editor } from 'grapesjs';
import grapesJSMJML from 'grapesjs-mjml';
import { readonly, ref, shallowRef } from 'vue';

export interface ExportedTemplate {
  mjml: string;
  html: string;
}

export const DEFAULT_MJML_TEMPLATE = `
<mjml>
  <mj-head>
    <mj-title> EDM 樣板</mj-title>
    <mj-preview>{ObjectName} 精選物件資訊</mj-preview>
    <mj-attributes>
      <mj-all font-family="Arial, Helvetica, sans-serif" />
      <mj-text color="#134e4a" font-size="16px" line-height="1.7" />
      <mj-button background-color="#0f766e" color="#ffffff" border-radius="8px" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f0fdfa">
    <mj-section background-color="#ffffff" padding="28px 24px">
      <mj-column>
        <mj-text font-size="26px" font-weight="700" color="#0f766e">{ObjectName}</mj-text>
        <mj-text color="#64748b">{ObjectAddress}</mj-text>
        <mj-text font-size="22px" font-weight="700" color="#0369a1">總價 {SellTotalPrice}</mj-text>
        <mj-button href="https://example.com">立即查看物件</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

export const BLANK_MJML_TEMPLATE = `<mjml><mj-body></mj-body></mjml>`;

function isTextComponent(component: Component) {
  const type = String(component.get('type') ?? '').toLowerCase();
  const tagName = String(component.get('tagName') ?? '').toLowerCase();

  return type === 'text' || type === 'mj-text' || tagName === 'mj-text';
}

function componentContent(component: Component) {
  const content = component.get('content');

  if (typeof content === 'string' && content.length > 0) {
    return content;
  }

  const children = component.components();

  return children.length > 0 ? children.map((child: Component) => child.toHTML()).join('') : '';
}

export function useMjmlEditor() {
  const editor = shallowRef<Editor>();
  const isReady = ref(false);

  function initEditor(container: HTMLElement) {
    if (editor.value) {
      return editor.value;
    }

    editor.value = grapesjs.init({
      container,
      height: '100%',
      width: '100%',
      fromElement: false,
      noticeOnUnload: false,
      storageManager: false,
      components: DEFAULT_MJML_TEMPLATE,
      i18n: {
        locale: 'zh-TW',
        detectLocale: false,
        messages: {
          'zh-TW': {
            traitManager: {
              empty: '請先選取元件以編輯屬性',
              label: '屬性',
            },
            styleManager: {
              empty: '請先選取元件以編輯樣式',
              layer: '圖層',
              fileButton: '選擇檔案',
            },
            assetManager: {
              addButton: '新增圖片',
              inputPlh: 'https://example.com/image.jpg',
              modalTitle: '素材管理',
            },
            deviceManager: {
              deviceDesktop: '桌機',
              deviceTablet: '平板',
              deviceMobile: '手機',
            },
            panels: {
              buttons: {
                titles: {
                  fullscreen: '全螢幕',
                  preview: '預覽',
                  'sw-visibility': '顯示邊界',
                  'export-template': '匯出樣板',
                  'open-sm': '樣式',
                  'open-tm': '設定',
                  'open-layers': '圖層',
                  'open-blocks': '元件區塊',
                },
              },
            },
          },
        },
      },
      plugins: [grapesJSMJML],
      pluginsOpts: {
        [grapesJSMJML as unknown as string]: {
          overwriteExport: true,
          resetBlocks: true,
          resetStyleManager: true,
          resetDevices: true,
          useCustomTheme: true,
          fonts: {
            Outfit: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800',
          },
          i18n: {
            'zh-TW': {
              'grapesjs-mjml': {
                panels: {
                  buttons: {
                    import: '匯入 MJML',
                  },
                },
              },
            },
          },
        },
      },
    });

    isReady.value = true;

    return editor.value;
  }

  function insertToken(token: string) {
    const selected = editor.value?.getSelected();

    if (!selected || !isTextComponent(selected)) {
      return false;
    }

    selected.components(`${componentContent(selected)}${token}`);
    selected.view?.render();

    return true;
  }

  function loadTemplate(mjml: string) {
    const currentEditor = editor.value;

    if (!currentEditor) {
      return false;
    }

    currentEditor.setComponents(mjml);
    currentEditor.select();

    return true;
  }

  function exportTemplate(): ExportedTemplate {
    const currentEditor = editor.value;

    if (!currentEditor) {
      return { mjml: '', html: '' };
    }

    const mjml = currentEditor.getHtml();
    const canvasBody = currentEditor.Canvas.getDocument()?.body;

    return {
      mjml,
      html: canvasBody?.innerHTML ?? mjml,
    };
  }

  function destroyEditor() {
    editor.value?.destroy();
    editor.value = undefined;
    isReady.value = false;
  }

  return {
    editor: readonly(editor),
    isReady: readonly(isReady),
    initEditor,
    insertToken,
    loadTemplate,
    exportTemplate,
    destroyEditor,
  };
}