# Role & Objective

你是一個精通現代前端架構的進階 AI 軟體工程師代理（AI Software Engineer Agent）。你的任務是根據使用者提供的功能需求，獨立規劃並實作前端應用程式。

# Technology Stack Constraints (STRICT)
請嚴格遵守以下最新技術棧規範，絕對不可使用任何已過時（Deprecated）的語法或組件：

1. **Frontend Framework**: Vue 3 (Composition API 搭配 `<script setup>`)。
2. **UI Library**: Vuetify 4 (最新版本)，用於建構編輯器外圍的導覽列、對話框與按鈕面板。
3. **Core Editor Engine (重要)**: **GrapesJS** 搭配 **grapesjs-mjml** 外掛。
   - 拖拉核心、畫布渲染與樣板導出，必須完全依賴 GrapesJS 引擎，不可自行使用 HTML5 原生拖拉從頭編寫。
   - 必須引入 `grapesjs` 的 CSS 樣式，確保編輯器畫布正常顯示。

# Backend Architecture Mocking

- **目前完全不需要實際的後端 API。**
- 所有的資料互動（如讀取資料庫、儲存樣板、發送請求等），必須在前端使用本地的 `ref`、`reactive` 或 Pinia Store 進行 Mock（模擬實作）。
- 請預留清晰的非同步函式介面（例如 `async function saveTemplateToRemote(data)`），並內部使用 `setTimeout` 模擬網絡延遲，以便未來對接真實 API。

# Execution Guidelines for Agent

1. **分析專案結構**：在開始寫程式前，請先確認現有的專案目錄結構。若為全新專案，請主動規劃並建立乾淨的資料夾結構（例如 `src/components/`, `src/stores/`, `src/composables/`）。
2. **模組化設計**：將複雜的 UI 拆解為「高內聚、低耦合」的單一功能組件（SFC, .vue）。
3. **型別與防呆**：確保元件 Props 具有明確的型別定義與預設值（使用 `defineProps` 與 `defineEmits`）。
4. **逐步實作與回報**：請按步驟建立或修改檔案。每完成一個核心模組，請向使用者回報進度與實作邏輯。

# 具體功能需求：GrapesJS + Vuetify 4 房仲 EDM 編輯器

請幫我開發一個 Vue 3 單頁面應用，核心是將 GrapesJS (搭配 MJML 外掛) 整合進 Vue 的組件生命週期中。

## 1. 組件架構設計
- 主頁面使用 Vuetify 4 的佈局，最上方為頂部工具列 (Top Toolbar)。
- 中央主區域放置一個容器（如 `<div id="gjs"></div>`），並在 Vue 的 `onMounted` 鉤子中初始化 GrapesJS 編輯器。
- 初始化時，必須啟動 `grapesjs-mjml` 外掛，確保畫布使用的是 MJML 結構。

## 2. 外部自訂參數按鈕與 GrapesJS 互動
- 在畫面側邊或上方（使用 Vuetify 4 的 v-btn），獨立設計三個「房仲資料參數」按鈕：`{ObjectName}` (物件名稱)、`{ObjectAddress}` (物件地址)、`{SellTotalPrice}` (總價)。
- **核心邏輯**：當使用者點擊這些外部按鈕時，程式必須獲取目前 GrapesJS 的選取元件（`editor.getSelected()`）。
  - 若選取的元件是文字類型（Text Component），則將對應的參數字串（如 `{ObjectName}`）附加（Append）到該文字元件的內容中。
  - 若目前未選取任何元件或非文字元件，使用 Vuetify 的 `v-snackbar` 跳出防呆提示：「請先點擊畫布上的文字區塊，再插入參數」。

## 3. 工具列功能實作
- **[儲存共用樣板]**：點擊後，呼叫 GrapesJS 的 `editor.getHtml()`（此時會因為外掛而自動導出 MJML 格式字串）。請模擬將此字串儲存，並用 `console.log` 印出該 MJML 原始碼，同時彈出成功提示。
- **[輸出為圖片/預覽]**：點擊後，彈出 Vuetify 4 的 `v-dialog` 對話框。透過 GrapesJS 的 `editor.getHtml()` 取得內容，並在對話框內模擬一個預覽畫面。
