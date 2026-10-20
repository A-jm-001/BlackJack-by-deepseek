# BLACKJACK 21

小丑牌风格的单人 21 点网页游戏。经典扑克牌面、暗绿牌桌、粗描边与奶油纸张质感，规则保持清晰：你只需要在「要牌」和「停牌」之间做决定。

## 开始游玩

双击项目根目录的 **`start.cmd`**。脚本会自动安装依赖、启动本地服务器，并在几秒后**自动打开默认浏览器**进入游戏。

如果浏览器没有自动弹出，再访问：

```text
http://127.0.0.1:5173/
```

> **不要直接双击 `index.html`。** 它是 Vite 的入口模板，必须由本地服务器加载；直接打开只会看到启动指引，而不是游戏页面。

需要手动启动时：

```bash
pnpm install
pnpm dev
```

生产构建与预览：

```bash
pnpm build
pnpm preview
```

> 本机环境没有把 Node 加入系统 PATH，`start.cmd` 会自动回退到 DSH 自带的 Node/pnpm。换到普通开发机后，使用常规的 `pnpm dev` 即可。

## 首版规则

- 单人对庄，一副标准 52 张牌，每局重新洗牌。
- 每局各发两张牌，庄家的第二张是暗牌。
- A 自动取最有利且不超过 21 点的值；2–10 按面值；J/Q/K 都算 10 点。
- 玩家只能**要牌**或**停牌**，没有下注、加倍、分牌和保险。
- 庄家 **16 点及以下必须要牌，17 点及以上停牌**，软 17 也停牌。
- 开局两张牌凑成 21 点为 Blackjack；双方天牌为平局。
- 玩家爆牌立即结束，庄家不再补牌；双方都未爆牌则比较点数。
- 战绩保存在浏览器本地，刷新页面不会丢失；连胜会被失败或平局中断。

键盘快捷键：`H` 要牌、`S` 停牌、`Enter` 开局或下一局、`?` 打开玩法。

## 技术栈

| 层 | 选择 |
| --- | --- |
| 构建 | Vite 8 + React 19 + TypeScript strict |
| 样式 | 原生 CSS 自定义属性与响应式布局 |
| 卡牌与背景 | 完全使用 CSS 与内联 SVG 绘制，无第三方图片素材 |
| 状态 | `useReducer` 管理牌局状态机；规则为无副作用的纯函数 |
| 音效 | Web Audio API 实时合成发牌、翻牌、胜利与爆牌音效 |
| 字体 | 自托管 `@fontsource/bungee`（SIL OFL），中文使用系统字体栈 |
| 测试 | Vitest |
| 包管理 | pnpm（Windows 下使用 hoisted linker 以规避虚拟存储 junction 的 ESM 解析问题） |

游戏是纯前端静态应用，没有后端接口；洗牌、规则和战绩都在浏览器内完成。

## 目录

```text
blackjack/
├─ src/
│  ├─ game/          # 牌堆、点数、庄家策略、结算、reducer 与单元测试
│  ├─ state/         # 牌局 hook、计时、localStorage 持久化
│  ├─ hooks/         # Web Audio 合成音效
│  ├─ components/    # 牌桌、手牌、52 张原创牌面、战绩、玩法弹窗
│  ├─ ui/            # 中文文案与花色标签
│  └─ styles/        # 设计 tokens、布局与卡牌样式
├─ public/favicon.svg
├─ .artifacts/       # 本地截图与浏览器验收脚本（不参与构建）
├─ start.cmd
├─ pnpm-workspace.yaml
└─ vite.config.ts
```

## 质量检查

```bash
pnpm typecheck
pnpm test
pnpm build
```

首版通过 35 个单元测试，覆盖 A 的取值、庄家 16/17 策略、天牌、爆牌、平局、状态机防重与连胜统计；并在 Chrome 中完成 1440×900、1024×768、768×768 与 390×844 视口验收。

## 版本管理

项目在 `blackjack/` 内初始化了 Git 仓库（分支 `main`）。`node_modules`、`dist`、`.artifacts` 和 `.pnpm-store` 均已被忽略。

> Windows 默认会给 `.git` 文件夹加上隐藏属性。在文件资源管理器中打开「查看 → 显示 → 隐藏的项目」即可看到；也可以用 `git status`、`git log` 验证仓库状态。

## 本地数据

- `blackjack.stats.v1`：胜、负、和、当前连胜、最佳连胜。
- `blackjack.settings.v1`：声音开关。
- 进行中的牌局不会在刷新后恢复，这是首版的刻意取舍。

## 关于视觉

整体氛围参考经典纸牌与小丑牌式拼贴，但牌面、人头牌 SVG、牌背、图标、纹理和文案均为本项目原创，不包含《小丑牌》的美术资源。
