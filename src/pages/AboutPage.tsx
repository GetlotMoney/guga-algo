import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STACK_FRONTEND = [
  'Vite', 'React 19', 'TypeScript', 'Tailwind CSS v4',
  'shadcn/ui', 'Framer Motion', 'react-markdown', 'Shiki', 'KaTeX',
]

const STACK_DEPLOY = ['GitHub', 'Vercel']
const STACK_AUTH = ['Supabase (PostgreSQL + Auth)']

const VERSIONS = [
  {
    version: 'v1.0',
    date: '2026-06-26',
    changes: [
      '项目初始化：Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui',
      '靛紫品牌色 + 暗色模式（浅色/深色/跟随系统）',
      '首页 Hero（渐变背景 + 浮动数字装饰）+ 特性卡片 + 学习路线',
      '教程页：11 章正文 + 侧栏 scroll-spy 高亮',
      '5 个交互演示：前缀和、逐位填数、记忆化递归树、波动值、LeetCode 3753',
      '移动端侧栏抽屉',
      '首次部署到 Vercel',
    ],
  },
  {
    version: 'v1.1',
    date: '2026-06-30',
    changes: [
      '多专题架构：从数位 DP 单专题扩展为 25 个算法专题',
      '专题列表页（8 个分类 + 搜索）+ 单专题页',
      '25 个专题的完整教程内容（概述/核心思想/模板代码/例题/练习/延伸阅读）',
      '博客系统：纯 Markdown + frontmatter + 标签筛选',
      'LaTeX 公式渲染（KaTeX CSS 修复）',
      '排版增强：h2/h3 边框区分、行内代码高亮、表格样式',
      '网站改名为「咕嘎学不会算法」',
      'CHANGELOG.md 开发文档',
    ],
  },
  {
    version: 'v1.2',
    date: '2026-06-30',
    changes: [
      '侧栏重构：显示全部 25 个专题（按 8 分类折叠），当前专题 h2/h3 子目录',
      '侧栏贴左边 + 双向可拖拽调节宽度',
      '侧栏跳转：window.scrollTo + 手动 offset 计算',
      'Supabase 登录/注册系统（邮箱+密码）',
      '未登录不能查看教程内容（鉴权拦截）',
      'GitHub 仓库改名：digit-dp-tutorial → guga-algo',
      'README.md / CHANGELOG.md 全英文',
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <h1 className="text-3xl font-bold">关于本站</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        「咕嘎学不会算法」是一个交互式算法教程网站。
        不同于传统文字+代码的讲义，本站把算法的核心状态变化做成了可点可玩的演示——
        改参数、单步执行、观察变化，让抽象的概念变得直观。
      </p>
      <p className="mt-4 text-muted-foreground">
        内容参考 OI Wiki、洛谷、Codeforces 等权威来源，力求准确、简洁、由浅入深。
        如果发现错误，欢迎反馈。
      </p>

      {/* 技术栈 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>技术栈</CardTitle>
          <CardDescription>前端工程化 + Supabase 后端 + Vercel 部署</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">前端</p>
            <div className="flex flex-wrap gap-2">
              {STACK_FRONTEND.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">后端 / 数据库</p>
            <div className="flex flex-wrap gap-2">
              {STACK_AUTH.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">部署</p>
            <div className="flex flex-wrap gap-2">
              {STACK_DEPLOY.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 版本公告 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>版本更新公告</CardTitle>
          <CardDescription>记录每次版本更新的内容</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {VERSIONS.map((v) => (
            <div key={v.version} className="border-l-2 border-primary/30 pl-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="font-mono">{v.version}</Badge>
                <span className="text-sm text-muted-foreground">{v.date}</span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {v.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
