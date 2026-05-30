# PageForge

Vue 3 组件库 — HTML 页面编辑器，VS Code 风格布局。
双入口结构：`src/` 开发调试，`lib/` 核心库。

## 命令

```
npm run dev        # Vite 开发服务器 :9130 (host 0.0.0.0)
npm run build      # vue-tsc 类型检查 THEN vite 构建
npm run preview    # 预览生产构建
```

构建顺序有先后：`build` 先跑 `vue-tsc -b`，类型报错会阻止构建。

## 架构总览

```
PageForge (extends common-store Store)
├── data: DataManager        ← Immutable.js 状态树（app / layout / page / clipboard）
├── actions: ActionManager   ← 17 个 node:* + selection:* actions
├── plugins: PluginManager   ← 10 个内置插件 + 可扩展第三方插件
├── subscribe(path, fn)     ← 路径订阅通知
│
├── content: {              ← 7 个 ContentManager（Vue reactive，不放入 Store）
│     topBar, statusBar, functionArea, properties,
│     nodes, contextMenu, componentLibrary
│   }
│
└── (继承 Store 全部能力)
```

**继承链**：`EventListener → Store → PageForge`

```
Store (common-store)
  ├── data      → DataManager (Immutable.js)
  ├── actions   → ActionManager
  ├── plugins   → PluginManager
  └── subscribe → 路径变更通知
        ↑
PageForge extends Store
  ├── content   → ContentManagerRegistry (7个)
  └── createNodeId() → crypto.randomUUID()
```

## 启动流程

```
1. vite dev → src/main.ts
   └── createApp(App) → app.mount('#app')

2. App (src/app/index.vue)
   └── <pageForge /> → 即 lib/view/index.vue

3. lib/view/index.vue（<script setup>）
   ├── const forge = new PageForge(initialState)
   ├── forge.use(VueDevtools(app))          # Chrome DevTools 调试
   ├── plugins.forEach(p => forge.use(p))   # 加载 10 个内置插件
   │     └── 各插件 install(forge):
   │         ├── forge.actions.register(name, handler)
   │         ├── forge.content.xxx.register(id, item)
   │         └── shortcuts: 绑定 window keydown
   ├── providePageForge(forge)              # 向子组件注入
   └── 渲染布局 → TopBar / MainArea / StatusBar
```

## 运行时数据流

```
用户操作
  → dispatch(actionName, ...args)
  → Store 内部触发 action handler
  → handler 操作 store.data.set/merge/push
  → DataManager 变更 Immutable 状态
  → onDataChange 钩子触发
    ├── PluginManager.triggerDataChange(path, newVal, oldVal) → 所有插件 onDataChange
    ├── EventListener.emit(sub:<path>) → subscribe 回调
    └── Vue reactive computed 重新计算 → 组件更新
  → VueDevtools Inspector/Timeline 同步刷新
```

## 组件树

```
lib/view/index.vue                  ← 创建 PageForge → provide
├── top-bar/index.vue              ← content.topBar → left/center/right 分区
├── main-area/index.vue            ← flex row
│   ├── function-area/index.vue    ← resize handle
│   │   ├── icon-bar/index.vue     ← content.functionArea → 图标按钮列表
│   │   └── panel/index.vue        ← activeIcon → 渲染选中插件 panel
│   ├── workspace/index.vue        ← 画布 + 交互 + 框选
│   │   ├── node-element.vue       ← 递归渲染节点 DOM 树
│   │   ├── selection-handles.vue  ← 8 个缩放控制点
│   │   └── context-menu/index.vue ← 右键菜单（auto-flip）
│   └── properties-panel/index.vue ← selectedCount===1 → section 分组
└── status-bar/index.vue           ← content.statusBar → left/right 分区
```

## 布局尺寸

```
TopBar    h: 56px  flex-shrink: 0
IconBar   w: 60px
Panel     w: 220px (拖拽 200~400)
Workspace flex: 1 1 auto（属性区显示时自动收窄 300px）
Properties w: 300px, v-if: selectedCount===1
StatusBar h: 34px  flex-shrink: 0
```

## Store 状态树

```typescript
{
  app: { theme: { mode, preset, colors: ThemeColors } },
  layout: { panelWidth, activeIcon },
  page: {
    nodes: PageNode[],           // 嵌套树（递归 children）
    selectedNodeIds: string[],   // 多选；length===1 → 属性区显示
    contextMenu: { visible, x, y, nodeId },
    viewport: { x, y, zoom },   // 初始自适应视口
    width: 1920, height: 1080,
  },
  clipboard: PageNode[],
}
```

## ContentManager 体系（7 个）

| 管理器 | 注册类型 | 消费组件 | 说明 |
|--------|---------|---------|------|
| topBar | TopBarItem | TopBar | left/center/right 分区 |
| statusBar | StatusBarItem | StatusBar | left/right 分区 |
| functionArea | FunctionAreaItem | IconBar + Panel | 图标+面板组合 |
| properties | PropertiesItem | PropertiesPanel | 5 section 分组 |
| nodes | NodeItem | NodeElement | 按 type 匹配渲染器 |
| contextMenu | ContextMenuItem | ContextMenu | visible 条件过滤 |
| componentLibrary | ComponentLibraryItem | 组件库面板 | 分类网格 |

**Properties 预置 5 个 Section**：位置(10) → 尺寸(20) → 盒模型(30) → 样式(40) → 高级(50)

## 插件系统

**写入**：所有插件在 `install(forge)` 中注册，无编译时扫描。

**单个插件可注册多项**，也可注册到多个 ContentManager + 多个 Actions：
```typescript
install(forge) {
  forge.content.functionArea.register('id-a', { ... })
  forge.content.functionArea.register('id-b', { ... })  // 同管理器多 item
  forge.content.statusBar.register('id-c', { ... })     // 跨管理器
  forge.content.contextMenu.register('id-d', { ... })   // 11 项右键菜单
  forge.actions.register('node:add', handler)           // 注册 action
}
```

**卸载**：`plugin.uninstall()` 中调用 `content.*.unregister(id)` 和 `actions.unregister(name)`。

## 内置插件（10 个）

| ID | 注册区域 | 职责 |
|----|---------|------|
| builtin:shortcuts | 全局 keydown | 13 个快捷键 |
| builtin:node-manager | functionArea + contextMenu + 17 actions | 节点 CRUD + 图层 NTree |
| builtin:component-library | functionArea | 组件库网格面板 |
| builtin:theme | functionArea + statusBar + 6 actions | GitHub 风格主题 |
| builtin:rect/circle/text/image/line/group | nodes + componentLibrary + properties | 基础节点（各 3 文件） |

## Actions 清单（17 个）

```
node:add          (type, x, y, w?, h?, props?)   → 创建节点
node:update       (nodeId, partial)               → 更新节点属性
node:delete       (nodeIds[])                     → 递归删除
node:copy         (nodeIds[])                     → 深拷贝到 clipboard
node:paste        ()                              → 粘贴
node:cut          (nodeIds[])                     → copy + delete
node:duplicate    (nodeIds[])                     → 原地复制 + 偏移 20px
node:group        (nodeIds[])                     → 创建 Group 容器
node:ungroup      (groupId)                       → 解散 Group
node:moveUp       (nodeIds[])                     → 上移一层
node:moveDown     (nodeIds[])                     → 下移一层
node:toFront      (nodeIds[])                     → 置顶
node:toBack       (nodeIds[])                     → 置底
selection:set     (nodeIds[])                     → 设置选中
selection:toggle  (nodeId)                        → 切换选中
selection:clear   ()                              → 清空
selection:selectAll ()                            → 全选
```

## 交互总览

| 操作 | 行为 |
|------|------|
| 单击节点 | selection:set([id]) |
| Ctrl+单击 | selection:toggle(id) |
| 拖拽节点 | 批量移动 → node:update(x,y) |
| 拖拽空白 | 框选 → 矩形碰撞检测 → 选中 |
| 中键拖拽 | 平移视口 |
| 滚轮 | 缩放视口 (20%~500%) |
| 右键节点/空白 | contextMenu → auto-flip |
| Escape/外部点击 | 关闭菜单、取消选中 |
| 属性编辑 | dispatch('node:update', id, partial) |

## 关键约定

- **SCSS**：`<style lang="scss" src="./style.scss">`（外链文件，不用 scoped）
- **TypeScript**：`erasableSyntaxOnly: true` — 纯类型导入必须用 `import type`
- **循环类型引用**：`types.ts` 不能 import `page-forge.ts`。`MenuContext.forge` 用 common-store 的 `Store` 类型。
- **图标**：`@vicons/carbon`（PascalCase，但个别名称与 Carbon 官方不同，如 `RadioButton` 而非 `CircleOutline`，需确认）
- **自动导入**：会生成 `auto-imports.d.ts` 和 `components.d.ts` — 均在 `.gitignore`
- **common-store**：`file:../CommonStore` — 必须与本项目同级目录存在
- **Pinia**：`src/main.ts` 中保留但 lib 内未使用（暂时忽略）

## 状态更新规则

- 用 `store.data.set/merge/push` 更新状态。**禁止直接修改对象。**
- 快捷方式：`store.data.set('layout.activeIcon', id)` 完成开关面板。
- 批量操作：`store.data.merge('page', { selectedNodeIds: [], contextMenu: { visible: false } })`。
- `merge` 是浅合并，嵌套对象需逐层。
- Immutable 状态变更自动触发 `subscribe` 和插件 `onDataChange`。

## 常见陷阱

- **导入路径**：深层插件文件 `lib/plugins/nodes/<type>/` 到 `lib/core/` 需要 `../../../`
- **插件 install 参数类型**：`install(store: Store)` 的 `store` 是 common-store 的 `Store` 类型，不含 `.content`。需 `forge = store as unknown as PageForge` 转换
- **NaiveUI 组件**：通过 resolver 自动按需注册模板，仅在 props/非模板使用时才显式 import
- **NodeElement 递归**：必须传递完整 `node` 对象，不可丢失 `children` — 否则树断裂
- **框选碰撞**：用 `getBoundingClientRect` 面积重叠检测，最小 5px 视为点击空白
- **属性区显隐**：`selectedNodeIds.length === 1` 才显示，不是 `> 0`
- **右键菜单 auto-flip**：右溢出翻左，下溢出翻上 — 需在 mounted 后读取 `getBoundingClientRect`
