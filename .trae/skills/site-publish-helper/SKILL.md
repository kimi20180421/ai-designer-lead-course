---
name: "site-publish-helper"
description: "Publishes a local project to GitHub Pages or Vercel with minimal user input. Invoke when user wants a public URL for an existing local site or asks how to publish it."
---

# Site Publish Helper

This skill helps publish an existing local project and return a public, shareable URL.

Use this skill when:

- the user already has a local project folder
- the user wants to push the project to GitHub
- the user wants a public website URL
- the user asks for a step-by-step publishing workflow
- the user is a beginner and needs guided input collection

Typical targets:

- static HTML projects with `index.html`
- simple frontend projects that can be deployed from source or build output
- projects that should be published through GitHub Pages first, with Vercel as fallback

## Goal

Complete as much of the publishing flow as possible with minimal user effort:

1. Identify the project type
2. Collect only the minimum required information
3. Set up git if needed
4. Prepare safe repo files like `.gitignore` and `README.md` when needed
5. Create or connect a remote repository
6. Push the project
7. Configure deployment
8. Return the public URL and next-step update commands

## First Principle

Ask for the minimum information needed, not everything up front.

Prefer this order:

1. infer from the workspace
2. detect from files
3. ask a short, concrete question only when required

## Information To Collect

Only ask for fields that are truly needed.

### Minimum Required

1. Repository name
2. Visibility: `public` or `private`
3. Deployment target: `GitHub Pages` or `Vercel`

### Usually Optional

Only ask these if they cannot be inferred:

1. Project root path
2. Build command
3. Output directory
4. Preferred branch name

### Authentication Confirmation

Do not ask for tokens directly unless absolutely necessary.

Instead ask one of these:

- "Have you already logged into GitHub on this machine?"
- "Would you like to use HTTPS or SSH for git remote?"
- "If Vercel is chosen, have you already connected your GitHub account there?"

## How To Ask The User

When asking questions, keep them short and use a fill-in template.

Preferred message:

```text
我来帮你自动发布，先给我这 3 项最少信息：

1. 仓库名：
2. 是否公开：public / private
3. 发布方式：GitHub Pages / Vercel

如果你不确定，可以直接这样回复我：
仓库名：my-site
是否公开：public
发布方式：GitHub Pages
```

If the user is clearly a beginner, also give examples and defaults.

Beginner-friendly variant:

```text
你只要按下面格式回复我就行：

仓库名：ai-designer-lead-course
是否公开：public
发布方式：GitHub Pages

不知道怎么选也没关系：
- 想免费、简单：选 GitHub Pages
- 不想受 GitHub Pages 限制：选 Vercel
- 想让别人直接访问：建议 public
```

## Decision Rules

### If the project is a static site

Signals:

- `index.html` exists in root
- assets are referenced directly
- no build tool is required

Preferred deployment order:

1. GitHub Pages if the repo can be public
2. Vercel if GitHub Pages is blocked or the user prefers it

### If the project needs a build step

Signals:

- `package.json` exists
- common scripts like `build`, `dev`, `preview`

Ask only if needed:

- build command
- output directory

Preferred deployment:

1. Vercel
2. GitHub Pages only if the output directory is clear and the user accepts the extra setup

## Execution Workflow

Follow this sequence.

### Phase 1: Inspect

1. Detect whether the project root is correct
2. Detect whether it is static or build-based
3. Check whether git is already initialized
4. Check whether a remote already exists
5. Check whether `README.md` or `.gitignore` should be added

### Phase 2: Collect Missing Info

If required, ask for only the missing fields.

Examples:

- missing repo name
- missing publish target
- repo is private but the user wants GitHub Pages

### Phase 3: Prepare Repository

If missing, add:

- `.gitignore`
- `README.md`

Then:

1. `git init` if needed
2. `git add .`
3. `git commit -m "init: first commit"` if there is no initial commit

### Phase 4: Connect Remote

Preferred order:

1. use existing remote if already configured and confirmed by the user
2. otherwise create or connect the correct remote

If using HTTPS:

```bash
git remote add origin https://github.com/<user>/<repo>.git
git branch -M main
git push -u origin main
```

If the push fails due to HTTP transport issues, try:

```bash
git config http.version HTTP/1.1
git config http.postBuffer 157286400
git push -u origin main
```

### Phase 5: Publish

#### GitHub Pages

Use this for public static sites.

Target output:

- repository URL
- expected Pages URL

Important:

- if the repository is private and Pages is not available, explain the limitation briefly
- then offer Vercel as the fallback

#### Vercel

Use this when:

- the repo is private
- GitHub Pages is blocked
- the project needs a build pipeline

Target output:

- Vercel project URL
- production deployment URL

## Version B: Execution Checklist

Use this section as the operational playbook. Do not skip steps just because the user sounds confident.

### B1. Preflight Checklist

Before changing anything, verify these in order:

1. project root is correct
2. publish target is known or can be inferred
3. repo name is known or missing
4. git status is understood
5. remote status is understood
6. deploy limitations are understood

If any of the above is unknown, ask only for that single missing item unless two values are tightly coupled.

### B2. Inspect In This Order

Inspect in this exact order:

1. root files: `index.html`, `package.json`, framework config files
2. git state: initialized or not, branch name, uncommitted changes
3. remote state: no remote, one remote, or multiple remotes
4. deployment shape: static source, built output, or unknown
5. release blockers: auth missing, private Pages limitation, build info missing

Never start by asking a broad question like "tell me everything about your project".

### B3. Static Site Detection Rules

Treat the project as a static site when most of these are true:

- `index.html` is present at the root
- assets are referenced directly from HTML or relative folders
- no required build command is detected
- the site can be previewed directly from static hosting

Then default to:

1. `public`
2. `GitHub Pages`

### B4. Build Project Detection Rules

Treat the project as build-based when any of these are true:

- `package.json` exists with a `build` script
- framework files such as `vite.config.*`, `next.config.*`, or similar exist
- the app depends on a generated output directory such as `dist`, `build`, or `.next`

Then default to:

1. `Vercel`
2. ask for build command only if it cannot be inferred
3. ask for output directory only if the hosting target requires it

### B5. Git Safety Decision Tree

Before any git write operation:

1. inspect whether `.git` exists
2. inspect whether there are uncommitted user changes
3. inspect whether `origin` already exists

Rules:

- if git is not initialized, initialize it
- if there are uncommitted changes, do not discard them
- if a remote exists, confirm reuse before replacing it
- if multiple remotes exist, ask which one should be used

Never remove or overwrite a remote silently.

### B6. Minimal Questioning Rules

Ask only one short question at a time unless the user is clearly ready for a fill-in template.

Preferred question order:

1. repo name
2. visibility
3. deployment target
4. auth method
5. build command
6. output directory

If the user seems overwhelmed, ask for only the first unresolved item.

### B7. Command Strategy

Use commands conservatively and only when the previous state is understood.

Typical safe sequence for a first publish:

```bash
git init
git add .
git commit -m "init: first commit"
git branch -M main
```

If a remote must be added:

```bash
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

If the project already has a valid remote:

```bash
git push
```

Never run destructive git commands like resetting, force pushing, or replacing tracked history unless the user explicitly asks.

### B8. GitHub Pages Execution Rules

Use GitHub Pages when all are true:

1. the project is static or has a simple publishable output
2. the repository can be public
3. the user accepts GitHub-hosted deployment

Expected handoff:

1. repository URL
2. expected Pages URL
3. what the user may still need to click in GitHub UI

If GitHub UI action is still required, say so explicitly instead of pretending deployment is complete.

### B9. Vercel Execution Rules

Use Vercel when any of these are true:

1. the repository should remain private
2. the project needs a build step
3. GitHub Pages is blocked
4. the user explicitly prefers Vercel

Required handoff:

1. repository URL
2. Vercel project URL
3. production URL
4. inferred or confirmed build settings

### B10. Failure Recovery Matrix

If something fails, classify it before asking the user anything.

#### Case 1: No initial commit

Symptom:

- `src refspec main does not match any`

Action:

1. check whether a commit exists
2. create the initial commit if missing
3. retry push

#### Case 2: HTTP push failure

Symptom:

- `RPC failed`
- `HTTP 400`

Action:

1. switch git HTTP transport to `HTTP/1.1`
2. increase `http.postBuffer`
3. retry push
4. if it still fails, offer SSH

#### Case 3: Pages blocked by visibility

Symptom:

- GitHub asks for upgrade or public visibility

Action:

1. explain that Pages is unavailable under current repo visibility or plan
2. offer exactly two options: make it public, or switch to Vercel

#### Case 4: Build output unknown

Symptom:

- build framework exists but output directory is unclear

Action:

1. inspect config files and scripts first
2. ask the user only if still unclear

### B11. Output Contract

A successful execution must return:

1. what was published
2. where the code lives
3. where the public site lives
4. what commands should be used next time
5. whether any manual GitHub or Vercel UI step still remains

### B12. Final Response Templates For Execution

#### Fully Completed

```text
已经处理完成。

发布方式：
GitHub Pages

仓库地址：
https://github.com/your-name/your-repo

访问地址：
https://your-name.github.io/your-repo/

你后续更新只需要：
git add .
git commit -m "update"
git push
```

#### Waiting For One Manual Step

```text
我这边已经把本地和仓库部分准备好了，还差最后一个网页平台设置步骤。

你现在只需要做这一件事：
[在 GitHub / Vercel 中的具体一步]

完成后把结果发我，我继续帮你收尾。
```

## What Success Looks Like

The final handoff must include all of these:

1. Repository URL
2. Public website URL
3. Which platform was used
4. The exact future update commands

Example final response:

```text
已完成发布。

仓库地址：
https://github.com/your-name/your-repo

访问地址：
https://your-name.github.io/your-repo/

后续更新只需要：
git add .
git commit -m "update"
git push
```

## Failure Handling

If full automation is blocked, do not stop without guidance.

Instead:

1. explain the exact blocker in one sentence
2. ask for the smallest next action from the user
3. continue automatically after the user responds

### Common blockers

#### No GitHub authentication

Ask:

```text
我已经准备好了项目，但当前机器还没完成 GitHub 登录。
请先告诉我你想用哪种方式：
1. HTTPS
2. SSH
如果不确定，直接回复：HTTPS
```

#### GitHub Pages unavailable for private repo

Ask:

```text
你当前想保留 private，但 GitHub Pages 在当前条件下不可直接用。
请选择下一步：
1. 改成 public 并继续 GitHub Pages
2. 保持 private，改用 Vercel
```

#### Unknown build output

Ask:

```text
这个项目需要构建后再发布。
请直接告诉我两项：
1. 构建命令：
2. 输出目录：

例如：
构建命令：npm run build
输出目录：dist
```

## Safety Rules

Never:

- expose or print secrets unnecessarily
- ask the user to paste tokens into public files
- overwrite an existing remote without checking
- delete user files unless explicitly required

Always:

- inspect current git state first
- prefer additive changes
- explain platform limitations in plain language

## Response Style

For beginners:

- keep instructions short
- avoid jargon where possible
- provide copyable reply templates
- show exactly one preferred next action

For advanced users:

- be concise
- show command blocks directly

## Recommended Default Strategy

When the project is a plain static site and the user has no strong preference:

1. recommend `public`
2. recommend `GitHub Pages`
3. fall back to `Vercel` only if Pages is blocked

## Copyable Intake Template

Use this whenever the user has not supplied the minimum information:

```text
我来帮你自动发布，先回复这 3 项：

仓库名：
是否公开：public / private
发布方式：GitHub Pages / Vercel
```

## Copyable Beginner Decision Help

Use this if the user says they do not know what to choose:

```text
不会选的话，直接照这个来：

仓库名：my-site
是否公开：public
发布方式：GitHub Pages

说明：
- public：别人可以直接访问
- GitHub Pages：最简单，适合静态网页
- 如果后面 GitHub Pages 受限，再改用 Vercel
```

## Beginner Conversation Templates

Use these templates when the user is inexperienced or explicitly asks for step-by-step help.

### Template 1: First Response

Use this as the default opening message for beginners:

```text
我可以帮你把本地项目发布成一个可以直接访问的网址。

你现在只要先给我这 3 项信息：

1. 仓库名：
2. 是否公开：public / private
3. 发布方式：GitHub Pages / Vercel

你可以直接复制下面这段回复我：

仓库名：my-site
是否公开：public
发布方式：GitHub Pages
```

### Template 2: If The User Does Not Know How To Choose

```text
不会选也没关系，直接按这个默认方案来就行：

仓库名：my-site
是否公开：public
发布方式：GitHub Pages

为什么这样选：
- public：最容易直接生成可访问网址
- GitHub Pages：最适合静态网页，新手最省事
- 如果后面受限，我再帮你切到 Vercel
```

### Template 3: If The User Does Not Know What "Repository Name" Means

```text
仓库名就是你这个项目在 GitHub 上显示的名字，相当于项目名。

例如你的项目如果叫：
AI 设计师课程

仓库名可以写成：
ai-designer-course

一般建议：
- 用英文
- 用短横线连接单词
- 不要有空格
```

### Template 4: If The User Does Not Know Public Or Private

```text
你可以这样理解：

- public：别人能看到这个仓库，也更容易直接开网页访问
- private：只有你自己或你授权的人能看

如果你只是想先快速发成网页，建议选：
public
```

### Template 5: If The User Does Not Know GitHub Pages Or Vercel

```text
你可以这样选：

- GitHub Pages：最简单，适合纯静态网页
- Vercel：更灵活，适合 private 仓库或需要构建的项目

如果你现在只是一个普通 HTML 网页，建议先选：
GitHub Pages
```

### Template 6: If The User Gives Incomplete Information

Use this when only part of the required info is provided:

```text
我已经收到一部分信息了，还差下面这些：

- 是否公开：public / private
- 发布方式：GitHub Pages / Vercel

你直接按这个格式补给我就行：

是否公开：
发布方式：
```

### Template 7: If GitHub Authentication Is Missing

```text
现在流程已经到推送这一步了，但这台电脑还没有完成 GitHub 登录。

你先告诉我你想用哪种方式继续：

1. HTTPS
2. SSH

如果你不确定，直接回复：
HTTPS
```

### Template 8: If GitHub Pages Is Blocked

```text
当前这个仓库在现有条件下不能直接开启 GitHub Pages。

你现在有两个选择：

1. 改成 public，继续用 GitHub Pages
2. 保持 private，我帮你改用 Vercel

你直接回复数字也可以，例如：
1
```

### Template 9: If A Build Command Is Needed

```text
这个项目不是直接用 `index.html` 发布的，它需要先构建。

请直接回复我这两项：

构建命令：
输出目录：

例如：
构建命令：npm run build
输出目录：dist
```

### Template 10: Final Delivery Message

Use this style when publication succeeds:

```text
已经发布完成。

仓库地址：
https://github.com/your-name/your-repo

访问地址：
https://your-name.github.io/your-repo/

以后你本地更新后，只要执行：
git add .
git commit -m "update"
git push
```

### Template 11: If The User Wants Only One Next Action

Use this when the user seems overwhelmed:

```text
你现在只做这一步就行：

把下面 3 项回复给我：

仓库名：
是否公开：public / private
发布方式：GitHub Pages / Vercel
```

### Template 12: If The User Says "I Still Do Not Understand"

```text
没关系，你不用一次理解所有概念。

你现在直接照抄这段发我就行：

仓库名：my-site
是否公开：public
发布方式：GitHub Pages

剩下的我会继续一步步带你做。
```

## Examples

### Example 1: Static HTML Site

User says:

```text
帮我把这个本地网页发到网上
```

You should:

1. inspect project files
2. detect `index.html`
3. ask only for repo name, visibility, deployment target
4. publish and return the URL

### Example 2: Private Repo But Needs URL

User says:

```text
我想保留 private，但还想要一个可访问链接
```

You should:

1. explain GitHub Pages limitation
2. recommend Vercel
3. ask only for confirmation
4. proceed with Vercel flow

### Example 3: User Wants Full Guidance

User says:

```text
我不会，你一步步告诉我需要给什么
```

You should:

1. send the beginner intake template
2. give one-line choice help
3. avoid overwhelming details until needed
