# PageForge

Vue 3 组件库 — 可视化 HTML 页面编辑器，VS Code 风格布局。

## 快速开始

```bash
npm install
npm run dev        # 开发服务器 → http://localhost:9130
npm run build      # 生产构建（类型检查 + Vite）
npm run preview    # 预览生产构建
```

## 架构

PageForge 由 **数据** + **插件** + **渲染** 三部分组成：

```
PageForge (extends common-store Store)
├── data: DataManager        ← Immutable.js 状态树
├── actions: ActionManager   ← 17 个 node/selection actions
├── plugins: PluginManager   ← 10 个内置插件 + 可扩展第三方
├── subscribe(path, fn)     ← 路径订阅通知
└── content: {              ← 7 个 ContentManager (Vue reactive)
      topBar, statusBar, functionArea, properties,
      nodes, contextMenu, componentLibrary
    }
```

### 数据驱动

所有状态在 `Store` 中通过 Immutable.js 管理，UI 层通过 `subscribe` 和 Vue `computed` 消费。状态变更 → 自动通知 → 组件重渲染。

### 插件系统

插件是功能扩展的唯一方式。每个插件在 `install(forge)` 中：

- 注册 Actions（`forge.actions.register`）
- 注册 UI 内容到 7 个 ContentManager（`forge.content.xxx.register`）
- 绑定快捷键（`window.addEventListener('keydown', ...)`）

单个插件可同时注册到多个管理器，也可在同一管理器注册多项。

### 渲染层

Workspace 通过 Vue 组件递归渲染多节点树。DOM 定位（position: absolute），CSS transform 实现视口缩放与平移。

## 布局

```
┌─────────────────────────────────────────────────────────┐
│  TopBar                              h: 56px             │
├────────┬───────────────┬─────────────────────────────────┤
│ IconBar│  Panel        │        Workspace                │
│  60px  │  220~400px    │        flex: 1 1 auto           │
├────────┴───────────────┴─────────────────────────────────┤
│  StatusBar                           h: 34px             │
└─────────────────────────────────────────────────────────┘
```

属性区（300px）选中单个节点时在右侧显示，Workspace 自动收窄。

## 功能

- **6 种基础节点**：矩形、圆形、文本、图片、线条、编组（Group）
- **交互**：单选 / Ctrl 多选 / 框选 / 拖拽移动 / 8 控制点缩放
- **右键菜单**：剪切、复制、粘贴、编组、取消编组、上下移动、置顶/底、删除（自动翻转防溢出）
- **快捷键**（13 组）：Ctrl+C/X/V/D/G, Delete, Ctrl+A, 方向/层级操作, Escape
- **图层管理**：NaiveUI NTree 树形组件（双击重命名、可见性/锁定切换）
- **组件库**：分类网格面板，点击添加到视口中心
- **属性编辑**：5 个 section（位置/尺寸/盒模型/样式/高级），按节点类型动态过滤
- **主题**：GitHub Light / Dark 预设 + 17 种颜色自定义 + JSON 导入/导出
- **视口**：滚轮缩放（20%~500%）、中键拖拽平移、初始自适应
- **调试**：Chrome Vue DevTools 集成（Inspector 状态树 + Timeline 时间线 + 在线编辑）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 + TypeScript 6.0 |
| 构建 | Vite 8（ES + CJS 双格式输出） |
| UI | NaiveUI 2 + @vicons/carbon |
| 状态管理 | common-store（Immutable.js） |
| 样式 | SCSS（外链文件，非 scoped） |
| 调试 | VueDevtools（common-store/vue-devtools） |

## 目录结构

```
lib/                             # 核心库
├── index.ts                     # 统一导出
├── core/
│   ├── types.ts                 # 全部类型定义
│   ├── content-manager.ts       # 7 个 ContentManager
│   └── page-forge.ts            # PageForge 类 (extends Store)
├── composables/
│   ├── usePageForge.ts          # provide/inject
│   └── useResize.ts             # 拖拽调整
├── utils/
│   ├── tree.ts                  # 节点树操作
│   └── shortcut.ts              # 快捷键匹配
├── themes/                      # GitHub 预设配色
├── plugins/                     # 10 个内置插件
│   ├── shortcuts/               # 快捷键
│   ├── node-manager/            # 节点管理 + 17 actions
│   ├── component-library/       # 组件库
│   ├── theme/                   # 主题
│   └── nodes/                   # 6 种基础节点
└── view/                        # 布局组件
    ├── top-bar/
    ├── main-area/
    │   ├── function-area/       # 图标栏 + 面板
    │   ├── workspace/           # 画布 + 交互
    │   └── properties-panel/    # 属性编辑
    └── status-bar/

src/                             # 开发入口（仅用于调试）
├── main.ts
└── app/
```

## 开发

**注意**：`build` 命令先执行 `vue-tsc -b` 做类型检查，报错会阻止构建。

**本地依赖**：`common-store` 使用 `file:../CommonStore`，需确保与本项目同级目录存在。

**样式约定**：`<style lang="scss" src="./style.scss">` — 统一使用外链 SCSS 文件，不使用 scoped。

**类型导入**：配置 `erasableSyntaxOnly: true`，纯类型导入必须使用 `import type`。

## 扩展

第三方插件实现 `PageForgePlugin` 接口：

```typescript
export const myPlugin: PageForgePlugin = {
  name: 'my:plugin',
  install(forge) {
    forge.content.functionArea.register('my-icon', {
      icon: MyIcon,
      label: '我的工具',
      panel: MyPanel,
    })
    forge.actions.register('my:action', (store, ...args) => {
      store.data.set('some.path', value)
    })
  },
  uninstall() {
    // 清理注册
  },
}
```

使用：

```typescript
const forge = new PageForge()
forge.use(myPlugin)
```
