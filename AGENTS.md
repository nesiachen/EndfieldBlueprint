# AGENTS.md

## Project

基于 Arknights: Endfield 的蓝图规划工具。React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 3，使用 react-konva 渲染画布网格。

## 已完成内容

- 项目初始化（Vite + React + TS + Tailwind + ESLint）
- 核心类型定义 `src/types/layout.d.ts`：`Device`、`IOPort`、`GridConfig`
- 主布局 `App.tsx`：左侧设备栏 + 主画布区域 flex 布局
- `GridCanvas.tsx`：基于 Konva Stage 的网格画布，支持鼠标滚轮缩放（以指针为中心）、拖拽平移、ResizeObserver 自适应
- `EquipmentBar.tsx`：静态设备列表（组装机、传送带、起点、终点）

## 空占位文件（待实现）

- `src/components/GridLayout/Device.tsx`
- `src/components/GridLayout/PathEditor.tsx`
- `src/components/UI/PropertiesPanel.tsx`

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | Vite 开发服务器 |
| `npm run build` | `tsc -b && vite build`（类型检查 + 构建） |
| `npm run lint` | ESLint |
| `npm run preview` | Vite 预览 |

## 代码约定

- **`verbatimModuleSyntax`** 启用：类型导入必须用 `import type { ... }`
- **`erasableSyntaxOnly`** 启用：禁止 enum、namespace，用 const 对象 + type 替代
- **`noUnusedLocals` / `noUnusedParameters`** 启用：未使用的变量或参数会报错
- 编辑器配置存储在 `.vscode/`
- 构建产物输出到 `dist/`，已 gitignore

## 依赖注意

- `react-konva`：画布渲染（Konva.js React 绑定），需通过 Stage → Layer → Shape 组织
- `@use-gesture/react`：已安装但尚未使用
- 无测试框架（jest/vitest/playwright 均未安装）
- TypeScript 版本为 6.0 beta，注意与旧版本差异
