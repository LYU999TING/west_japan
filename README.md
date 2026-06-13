# 西国航路 · 日本西部14日航海图册

濑户内海 — 北九州 14 日旅行攻略网站（NAUTICAL 版）。
立体海图（three.js）、每日时刻线、逐站天气预报、风险与行李策略、JR Pass 方案、出发前清单。

## 文件结构

```
index.html            主页面（全部样式与逻辑内联，数据也在这里）
manifest.webmanifest  PWA 清单（添加到主屏幕）
sw.js                 Service Worker（离线缓存）
icons/                应用图标（鸟居 · 夜海蓝）
README.md             本文件
```

## 部署到 GitHub Pages（约 3 分钟）

1. 注册/登录 GitHub，点右上角 **+ → New repository**，仓库名如 `japan-atlas`，选 **Public**，创建。
2. 在仓库页面点 **uploading an existing file**，把本文件夹里的**全部文件**（含 `icons` 文件夹）拖进去，点 **Commit changes**。
3. 进入 **Settings → Pages**，Source 选 **Deploy from a branch**，Branch 选 `main` / `(root)`，保存。
4. 等 1–2 分钟，访问 `https://你的用户名.github.io/japan-atlas/` 即可。手机电脑通用，HTTPS 自带。

> 国内访问 github.io 时好时坏。若要发给国内亲友，把同一批文件拖进 **Cloudflare Pages** 或 **Vercel**（同样免费、拖拽部署）连通性通常更好。

## 部署后解锁的能力

- **二维码分享**：顶栏「分享」按钮会基于当前网址生成二维码，同行者扫码即得。
- **PWA 离线**：手机浏览器里「添加到主屏幕」，整站缓存到本地——直岛渡轮上、岛波海道骑行中没信号也能打开完整行程。首次打开需联网一次让缓存生效。
- **逐站天气**：每天的卡片和海图面板显示该站当日预报（Open-Meteo，免密钥）。预报窗口为未来 16 天，越接近出发数据越全；离线时自动回退到最近一次缓存。

## 修改行程数据

所有数据都在 `index.html` 内联脚本的最前面：

- `const DAYS=[...]`：14 天的标题、时刻线、风险、行李策略；
- `const OPTIONAL={...}`：熊本支线；
- `const CHECKS=[...]`：出发前清单；
- `const GEO_POINTS={...}`：各站真实经纬度（天气和海图都用它）；
- `const BOARD=[...]`（往下翻一点）：首屏发车牌的每日首班车。

改完保存，重新拖进 GitHub 仓库覆盖提交即可；勾选清单的状态保存在访问者各自的浏览器里。

## 离线与降级

- 无法加载 three.js（断网首访 / 老设备）时，海图区域显示静态回退提示，其余内容不受影响；
- `prefers-reduced-motion` 开启时自动关闭翻牌、巡航镜头与入场动画；
- 触屏设备自动降低渲染分辨率并关闭阴影以保帧率。
