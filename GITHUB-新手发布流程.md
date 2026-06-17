# GitHub 新手发布流程

这份文档适合第一次把本地网页项目发布到 GitHub 的用户。

适用场景：

- 你本地已经有一个项目文件夹
- 你想把它传到 GitHub
- 你还想把它发布成一个可以直接访问的网址

本文以当前这个 PPT 项目为例说明。

## 1. 你最终会得到什么

完成后，你会得到两个东西：

- 一个 GitHub 仓库地址，用来存代码
- 一个网页访问地址，用来直接打开项目

例如：

- 仓库地址：`https://github.com/你的用户名/你的仓库名`
- 网页地址：`https://你的用户名.github.io/你的仓库名/`

## 2. 发布前要准备什么

你需要先准备好这几样：

- 一个 GitHub 账号
- 本地已经有项目文件夹
- 电脑里已经安装 Git

如果你不确定 Git 有没有安装，可以在终端输入：

```bash
git --version
```

如果能看到版本号，比如 `git version 2.x.x`，说明已经安装好了。

## 3. 第一步：在 GitHub 上创建仓库

### 3.1 登录 GitHub

打开：

[https://github.com](https://github.com)

登录你的账号。

### 3.2 新建仓库

点击右上角 `+`，选择 `New repository`。

然后填写：

- `Repository name`：仓库名，比如 `ai-designer-lead-course`
- `Description`：可以不写
- `Public / Private`：
  - 如果你后面想直接用 GitHub Pages 发布网页，建议先选 `Public`
  - 如果选 `Private`，很多账号默认不能直接开 Pages

建议：

- 不要勾选 `Add a README file`
- 不要勾选 `.gitignore`
- 不要勾选 `license`

因为你的本地项目已经有文件了，保持仓库为空最简单。

然后点击 `Create repository`。

## 4. 第二步：把本地项目初始化成 Git 仓库

打开终端，进入你的项目目录。

例如：

```bash
cd "/Users/bytedance/Documents/教学用/outputs/ai-designer-lead-course-v2/ppt"
```

然后执行：

```bash
git init
git add .
git commit -m "init: first commit"
```

这三句的作用分别是：

- `git init`：让这个文件夹变成 Git 项目
- `git add .`：把当前所有文件加入待提交列表
- `git commit -m "..."`：生成第一次版本记录

## 5. 第三步：把本地项目连接到 GitHub

创建完 GitHub 仓库后，GitHub 页面会给你一段命令。

如果你是“本地已有项目”，要看这一段：

`...or push an existing repository from the command line`

然后在项目目录执行：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

例如：

```bash
git remote add origin https://github.com/kimi20180421/ai-designer-lead-course.git
git branch -M main
git push -u origin main
```

## 6. 第四步：如果推送报错，怎么处理

### 6.1 报错：`src refspec main does not match any`

意思通常是：

- 你还没有成功执行第一次 `commit`

解决方法：

```bash
git add .
git commit -m "init: first commit"
git push -u origin main
```

### 6.2 报错：需要用户名或邮箱

说明 Git 还不知道你是谁。

先执行：

```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
```

然后重新执行：

```bash
git commit -m "init: first commit"
git push -u origin main
```

### 6.3 报错：HTTP 400 / 推送大文件失败

有时项目图片较多，第一次推送会失败。

可以先执行：

```bash
git config http.version HTTP/1.1
git config http.postBuffer 157286400
git push -u origin main
```

很多时候这样就能成功。

## 7. 第五步：让项目变成可以访问的网站

如果你的项目根目录里有 `index.html`，就可以尝试发布成网页。

### 7.1 进入仓库设置

打开 GitHub 仓库页面，点击：

`Settings` → `Pages`

### 7.2 开启 GitHub Pages

在 `Build and deployment` 里选择：

- `Source`：`Deploy from a branch`
- `Branch`：`main`
- 文件夹：`/ (root)`

然后点击 `Save`。

### 7.3 访问网页地址

等几十秒到几分钟后，可以访问：

```text
https://你的用户名.github.io/你的仓库名/
```

例如：

```text
https://kimi20180421.github.io/ai-designer-lead-course/
```

## 8. 如果 Pages 页面提示不能开启怎么办

如果你看到类似下面的提示：

`Upgrade or make this repository public to enable Pages`

意思是：

- 你当前这个仓库是私有的
- 你当前账号条件下，私有仓库不能直接开启 GitHub Pages

解决办法有两个：

- 方案 A：把仓库改成 `Public`
- 方案 B：使用付费/企业能力

对大多数个人用户来说，最简单的是：

- 直接把仓库改成 `Public`

修改位置：

`Settings` → `Danger Zone` → `Change repository visibility`

## 9. 后续更新怎么做

以后你每次改完本地内容，只需要执行这三步：

```bash
git add .
git commit -m "update"
git push
```

更推荐你把提交说明写清楚一点，例如：

```bash
git add .
git commit -m "feat: update slide content"
git push
```

或者：

```bash
git add .
git commit -m "fix: adjust layout and spacing"
git push
```

推送完成后，线上仓库会更新。

如果你已经开启了 GitHub Pages，网页通常也会自动重新部署。

## 10. `.gitignore` 是干什么的

`.gitignore` 是 Git 的忽略清单。

写进去的文件，Git 默认不会再跟踪。

常见内容：

```gitignore
.DS_Store
node_modules/
dist/
.vscode/
```

它的作用是避免把这些没必要的文件一起传到 GitHub。

## 11. 一份最简单的完整命令清单

如果你是第一次上传本地项目，可以直接照这个顺序执行：

```bash
cd "/你的项目路径"
git init
git add .
git commit -m "init: first commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

如果你后面只是继续更新项目，就执行：

```bash
git add .
git commit -m "update"
git push
```

## 12. 给小白的最后提醒

- `push` 不是保存文件，它只是把“已经 commit 的版本”传到 GitHub
- 本地改了文件以后，不能只执行 `git push`
- 正确顺序永远是：`add` → `commit` → `push`

你可以把它理解成：

- `add`：准备提交
- `commit`：存一个版本
- `push`：把这个版本传到远程

如果你记不住，就记这一句：

```bash
git add .
git commit -m "update"
git push
```
