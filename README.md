# 我的日记

一款简洁温馨的个人日记工具，应用全部 code 都由 `AI Agent（Qoder）` 自动开发完成。

> 预览地址：https://nhyu.github.io/my-diary/

## 功能特性

- **日历视图** — 月历中标记有日记的日期，点击日期快速筛选当天日记
- **日记管理** — 新建、编辑、删除日记，支持分页浏览
- **天气记录** — 预设五种天气（晴天/阴天/下雨/下雪/刮风），也可自定义输入
- **本地存储** — 所有数据保存在浏览器 localStorage，无需后端服务

## 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- Lucide React（图标）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── Calendar.tsx      # 日历组件
│   ├── DiaryDialog.tsx   # 新建/编辑日记对话框
│   ├── DiaryList.tsx     # 日记列表（含分页）
│   └── Header.tsx        # 顶部导航栏
├── styles/
│   ├── tokens.css        # 设计令牌（颜色、渐变、阴影等 CSS 变量）
│   ├── base.css          # 基础样式（body、字体、滚动条）
│   ├── calendar.css      # 日历组件样式
│   └── components.css    # 通用组件样式（卡片、按钮、输入框等）
├── types/
│   └── diary.ts          # 日记数据类型定义
├── lib/
│   ├── storage.ts        # localStorage 读写与数据操作
│   └── utils.ts          # 通用工具函数
├── App.tsx               # 主页面
├── main.tsx              # 入口文件
└── index.css             # 样式入口
```
