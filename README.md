# AI Designer Lead Course PPT

单文件 HTML 课件项目，包含课程主文件、静态图片资源和导出辅助脚本。

## 项目结构

- `index.html`: 当前主课件文件，包含页面结构、样式和交互逻辑
- `slides.html`: 相关页面输出文件
- `images/`: 课件使用的图片与 GIF 资源
- `assets/motion.min.js`: 动效依赖
- `build-slides.mjs`: 幻灯片构建脚本

## 本地预览

在项目根目录启动一个静态服务器即可预览，例如：

```bash
npx --yes live-server --port=8000 --no-browser
```

启动后在浏览器打开 `http://127.0.0.1:8000/index.html`。

## Git 使用

常用提交流程：

```bash
git add .
git commit -m "feat: update slides"
git push
```

项目已通过 `.gitignore` 忽略常见系统文件和本地开发目录。
