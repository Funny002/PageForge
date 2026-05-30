# PageForge — 架构与数据流

## 🧱 组件树

```
PageForgeApp (src/app/index.vue)
└─ <PageForge /> → PageForgeLayout (lib/view/index.vue)  ← 主题在此注入
    ├─ PageForgeTopBar — 画布宽×高输入框 (NInputNumber)
    ├─ .pf-middle
    │   ├─ PageForgeLeftPanel — 侧边图标标签 + 动态面板
    │   │   ├─ .pf-sidebar-icons (48px) — 插件贡献
    │   │   └─ .pf-sidebar-panel → <component :is="activeView.render" />
    │   │       ├─ ExplorerPanel (占位)
    │   │       └─ ComponentPalette → 触发 stage.addNode
    │   ├─ PageForgeStage
    │   │   └─ PageForgeStageCanvas
    │   │       ├─ PageForgeStageRuler × 2 (Canvas 渲染标尺)
    │   │       ├─ PageForgeStageToolbar (可拖拽浮动工具栏)
    │   │       └─ .pf-stage-content
    │   │           ├─ PageForgeStageGrid (SVG pattern: 点阵/线条/棋盘/十字)
    │   │           └─ .pf-stage-surface ← 指针事件在此
    │   │               ├─ PageForgeStageNode × n → <component :is="renderer" />
    │   │               │   ├─ TextRenderer   (文本)
    │   │               │   ├─ RectRenderer   (矩形)
    │   │               │   └─ ImageRenderer  (图片)
    │   │               ├─ PageForgeStageHandle × n (8 向缩放手柄)
    │   │               └─ PageForgeStageMarquee (框选矩形)
    │   └─ PageForgeRightPanel (300px — 空)
    └─ PageForgeBottomBar (40px — 空)
```

## 📦 Store 数据流 (`common-store`)

| 路径 | 类型 | 默认值 | 读 | 写 |
|------|------|--------|-----|-----|
| `canvasWidth` | number | 1920 | TopBar, Stage, Interaction | `canvas.resize` |
| `canvasHeight` | number | 1080 | TopBar, Stage | `canvas.resize` |
| `scale` | number | 1 | Stage, Canvas, Toolbar, Grid, Ruler | `stage.setScale` |
| `viewportX` | number | 0 | Stage, Canvas, Grid, Ruler | `stage.setOffset` + `stage.pan` |
| `viewportY` | number | 0 | 同上 | 同上 |
| `tool` | ToolType | select | Toolbar, Stage, Interaction | `stage.setTool` |
| `showRuler` | boolean | true | Canvas | ⚠️ 注册但从未调用 |
| `nodes` | PageNode[] | [] | Stage, Interaction, Palette | `addNode/moveNodes/resizeNode` + 拖拽中直接写入 |
| `selectedNodeIds` | string[] | [] | Stage, Interaction | `selectNodes/clearSelection` |
| `grid` | GridConfig | {type:dot,…} | Grid | ⚠️ 注册但从未调用 |

### Action 注册与调用对照

| Action | 注册 | 调用 | 状态 |
|--------|------|------|------|
| `canvas.resize` | ✅ | TopBar 输入变更 | 活跃 |
| `stage.setTool` | ✅ | Toolbar 工具按钮 | 活跃 |
| `stage.setScale` | ✅ | Toolbar 缩放 + Stage 自适应 | 活跃 |
| `stage.setOffset` | ✅ | Stage 自适应居中 | 活跃 |
| `stage.pan` | ✅ | 手型工具拖拽 | 活跃 |
| `stage.addNode` | ✅ | ComponentPalette 点击 | 活跃 |
| `stage.moveNodes` | ✅ | 拖拽松手提交 | 活跃 |
| `stage.resizeNode` | ✅ | 缩放拖拽松手提交 | 活跃 |
| `stage.selectNodes` | ✅ | 点击/框选 | 活跃 |
| `stage.clearSelection` | ✅ | 点击空白区域 | 活跃 |
| `stage.toggleRuler` | ✅ | 无调用方 | ❌ 死代码 |
| `stage.setGrid` | ✅ | 无调用方 | ❌ 死代码 |

## 🔌 插件系统

### 注册生命周期

```
模块加载: builtinPlugins → registerPlugin() → PluginRegistry (全局单例)
运行时: createPageStore(app, { plugins: [...] }) → 逐个注册
消费方: import { registerPlugin } from 'page_forge'
```

### 插件形态

```ts
interface PageForgePlugin {
  name: string;
  nodeTypes?: Record<string, NodeTypeConfig>;  // 节点渲染器
  views?: {
    sidebar?: SidebarView[];                     // 左侧面板贡献
  };
}
```

### 内置插件清单

| 名称 | 类型 | 贡献 |
|------|------|------|
| `builtin:text` | 节点 | 文本渲染器 (fontSize/color/align) |
| `builtin:rectangle` | 节点 | 矩形渲染器 (fill/border/radius) |
| `builtin:image` | 节点 | 图片渲染器 (src/objectFit) |
| `builtin:explorer` | 侧边栏 | 节点树面板 (TreeViewAlt 图标) |
| `builtin:components` | 侧边栏 | 组件面板 (Rocket 图标, 可创建节点) |

### 节点类型 → 渲染流程

```
Plugin.nodeTypes → Registry.types
  ComponentPalette: registry.getAll() → 点击 → createNode(type) → dispatch stage.addNode
  StageNode: registry.get(node.type)?.renderer → <component :is="renderer" />
```

### 侧边栏贡献流程

```
Plugin.views.sidebar → Registry.getSidebarViews()
  LeftPanel: 图标标签 → 点击切换 → <component :is="activeView.render" />
```

### 外部插件注入示例

```ts
const store = createPageStore(app, {
  plugins: [{
    name: 'my-plugin',
    nodeTypes: {
      button: { label: '按钮', defaultProps: {...}, renderer: MyBtn },
    },
    views: {
      sidebar: [{ id: 'my-panel', title: '我的面板', icon: MyIcon, render: MyPanel }],
    },
  }],
});
```

## 🖱️ 交互流程

| 工具 | 操作 | 行为 |
|------|------|------|
| **选择** | 空白拖拽 | 框选 → `stage.selectNodes` |
| | 拖拽节点 | 移动 (Shift 追加选择) → `stage.moveNodes` |
| | 拖拽手柄 | 缩放 → `stage.resizeNode` |
| **手型** | 任意拖拽 | 平移视口 → `stage.pan` |

坐标转换: `surfaceX = (clientX - rect.left) / (rect.width / canvasWidth)`

## 🎨 主题

CSS 自定义属性通过 `applyTheme(el, theme)` 以内联样式设置在根节点 `.pf-layout` 上。内置两套主题：`githubLight` / `githubDark`。定义 14 个 `--pf-*` 变量，其中 4 个暂未消费（`accent-hover`, `success`, `danger`, `warning`）。

## 📤 构建

- **入口**: `lib/index.ts`（导入时自动注册内置插件）
- **格式**: ES + CJS (`dist/index.es.js`, `dist/index.cjs.js`)
- **外部依赖**: vue, naive-ui, pinia, common-store
- **类型检查**: `vue-tsc -b` 先于构建（错误会阻塞构建）

---

## ✅ 已满足的需求

| 需求 | 实现 |
|------|------|
| 插件节点类型 (文本/矩形/图片) | 内置 + 外部通过 `registerPlugin()` |
| VS Code 风格侧边栏 | LeftPanel + `views.sidebar` 贡献机制 |
| 插件渲染器注入 | StageNode → `<component :is="renderer" />` |
| 画布交互 (选择/移动/缩放/平移) | `useStageInteraction` 组合函数 |
| 缩放 + 标尺 | StageToolbar + StageRuler |
| 网格背景 (可配置) | StageGrid (点阵/线条/棋盘/十字) |
| 主题系统 (明/暗) | ThemeConfig + `applyTheme()` |
| 外部插件注入 | `createPageStore(app, { plugins })` |
| 自适应画布 | Stage.onMounted 自动适配视口 |

---

## ❌ 待实现（下一步）

| 功能 | 状态 | 说明 |
|------|------|------|
| **属性面板** | 右侧面板为空 | 需对接插件系统，提供每种节点类型的属性编辑器 |
| **节点删除** | 无 UI 触发 | Delete 键 + 右键菜单 |
| **节点属性编辑** | 创建后不可修改文本/颜色 | 需右侧面板配合 |
| **撤销/重做 UI** | History 中间件存在但无按钮 | 工具栏按钮或 Ctrl+Z/Y |
| **网格/标尺开关 UI** | Action 存在但未连接 | 设置面板或工具栏切换 |
| **资源管理器** | 仅占位文字 | 真正的节点树 + 拖拽排序 |
| **状态栏** | 底部栏为空 | 缩放比例、光标坐标、提示信息 |
| **复制/粘贴/重复** | 缺失 | 剪贴板 + 对应 action |
| **键盘快捷键** | 无 keydown 处理 | Delete, Ctrl+Z/Y/C/V, 方向键微调 |
| **吸附/对齐线** | 缺失 | 网格吸附 + 拖拽时对齐辅助线 |
| **导出/保存** | 缺失 | PageState → JSON 序列化 |
| **主题切换 UI** | 主题仅为 prop | 设置面板或顶部切换按钮 |
| **触摸优化** | 仅 Pointer Events | 双指缩放、触摸手柄适配 |

---

## 🏗 架构技术债

| 问题 | 影响 |
|------|------|
| `stageCanvas/style.scss` 未 scoped | 全局 CSS 泄漏风险 |
| `.pf-toolbar-dot` 未使用的 CSS | 维护负担 |
| `canvas.resize` 与 `stage.*` 命名不一致 | 混淆 |
| `usePlugin` 为 `registerPlugin` 的冗余别名 | API 膨胀 |
| PluginRegistry 全局单例 | 多实例冲突 |
| `common-store` file 依赖 | 需要 `../CommonStore` 目录存在 |
| 拖拽帧直接写入 Store | 每帧一条历史记录，淹没撤销栈 |
