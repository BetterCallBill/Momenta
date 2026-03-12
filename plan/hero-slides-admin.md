# Admin 管理首页图片内容计划

## 背景

当前首页有三处完全硬编码的图片数据：

| 组件 | 硬编码数组 | 对应 DB 模型 |
|------|-----------|------------|
| `HomeHeroCarousel.tsx` | `SLIDES`（图片+标题+副标题） | ❌ 无，需新建 `HeroSlide` |
| `PartnersCarousel.tsx` | `PARTNERS`（logo+网站） | ✅ 已有 `Sponsor` 表（未使用） |
| `PreviousEventsWall.tsx` | `EVENTS`（图片+标题） | ✅ 已有 `GalleryImage` 表（未使用） |

目标：三处同步改造，让 Admin 可以管理所有首页图片内容。

---

## 阶段一：数据库扩展

**修改文件：** `prisma/schema.prisma`

新增模型：

```prisma
model HeroSlide {
  id        String   @id @default(cuid())
  src       String              // 图片路径或外部URL
  headline  String              // 主标题，如 "Move Together."
  accent    String              // 金色强调词，如 "Grow Together."
  subtitle  String              // 副标题
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

执行：`npx prisma migrate dev --name add-hero-slide`

**同步更新 `prisma/seed.ts`：** 将现有三条 SLIDES 数据写入 `HeroSlide` 表。

---

## 阶段二：API 路由

### Hero Slides API（新建）
- `src/app/api/admin/hero-slides/route.ts` — `GET`（列表）/ `POST`（新建）
- `src/app/api/admin/hero-slides/[id]/route.ts` — `PUT`（编辑）/ `DELETE`（删除）
- `src/app/api/hero-slides/route.ts` — 公开 `GET`，供前台使用

### Sponsors API（新建，复用已有 Sponsor 表）
- `src/app/api/sponsors/route.ts` — 公开 `GET`
- `src/app/api/admin/sponsors/route.ts` — `GET` / `POST`
- `src/app/api/admin/sponsors/[id]/route.ts` — `PUT` / `DELETE`

### Gallery API（已有 `/api/gallery`，无需改动）

---

## 阶段三：Admin 管理页面

### 3.1 Hero Slides 管理 `src/app/admin/hero-slides/page.tsx`（新建）
- 列表展示所有幻灯片（缩略图预览 + 标题）
- 新增/编辑表单字段：图片 URL、主标题、金色强调词、副标题、排序、是否启用
- 删除按钮

### 3.2 Sponsors 管理 `src/app/admin/sponsors/page.tsx`（新建）
- 列表展示合作伙伴（logo + 名称）
- 新增/编辑：名称、Logo URL、介绍、网站 URL、排序、是否显示
- 删除按钮

### 3.3 更新 Admin 侧边栏
- **修改文件：** `src/app/admin/layout.tsx`
- 新增导航项：`Hero Slides` → `/admin/hero-slides`
- （Sponsors 已在侧边栏）

---

## 阶段四：前台组件改造

### 4.1 HomeHeroCarousel（改为服务端数据）
**修改文件：** `src/components/home/HomeHeroCarousel.tsx`

- 删除硬编码 `SLIDES` 数组
- 改为接收 `slides` props（类型 `HeroSlide[]`）
- 在 `src/app/page.tsx` 中从 DB 查询并传入

### 4.2 PartnersCarousel（改用 Sponsor 表）
**修改文件：** `src/components/home/PartnersCarousel.tsx`

- 删除硬编码 `PARTNERS` 数组
- 改为接收 `sponsors` props（类型 `Sponsor[]`）
- 在 `src/app/page.tsx` 中从 DB 查询并传入

### 4.3 PreviousEventsWall（改用 GalleryImage 表）
**修改文件：** `src/components/home/PreviousEventsWall.tsx`

- 删除硬编码 `EVENTS` 数组
- 改为接收 `images` props（类型 `GalleryImage[]`）
- 在 `src/app/page.tsx` 中查询带 `"featured"` 标签的图片传入

### 4.4 首页数据聚合
**修改文件：** `src/app/page.tsx`

新增三个并行查询：
```ts
const [slides, sponsors, featuredImages] = await Promise.all([
  prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  prisma.sponsor.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  prisma.galleryImage.findMany({ where: { tags: { contains: 'featured' } }, orderBy: { createdAt: 'desc' }, take: 8 }),
]);
```

---

## 关键文件一览

| 操作 | 文件 |
|------|------|
| 新增 | `prisma/schema.prisma` — HeroSlide 模型 |
| 更新 | `prisma/seed.ts` — 写入初始 slide 数据 |
| 新增 | `src/app/api/hero-slides/route.ts` |
| 新增 | `src/app/api/admin/hero-slides/route.ts` |
| 新增 | `src/app/api/admin/hero-slides/[id]/route.ts` |
| 新增 | `src/app/api/sponsors/route.ts` |
| 新增 | `src/app/api/admin/sponsors/route.ts` |
| 新增 | `src/app/api/admin/sponsors/[id]/route.ts` |
| 新增 | `src/app/admin/hero-slides/page.tsx` |
| 新增 | `src/app/admin/sponsors/page.tsx` |
| 修改 | `src/app/admin/layout.tsx` — 加 Hero Slides 导航 |
| 修改 | `src/components/home/HomeHeroCarousel.tsx` — 接收 props |
| 修改 | `src/components/home/PartnersCarousel.tsx` — 接收 props |
| 修改 | `src/components/home/PreviousEventsWall.tsx` — 接收 props |
| 修改 | `src/app/page.tsx` — 新增 DB 查询，传入 props |

---

## AWS 生产环境部署方案

Prisma 与本地 Docker PostgreSQL 的连接方式和 AWS RDS 完全一样——只需更换 `DATABASE_URL`。

### 推荐架构

```
用户浏览器
    │
    ▼
AWS App Runner / ECS（运行 Next.js）
    │
    ▼
AWS RDS PostgreSQL（数据库）
```

### 步骤一：创建 AWS RDS PostgreSQL

1. AWS Console → RDS → Create Database
2. 选择 PostgreSQL 16，实例类型 `db.t3.micro`（开发/小流量够用）
3. 记录连接信息：host、port、database、username、password
4. 安全组设置：允许 App Runner/ECS 的 IP 或 VPC 内访问

### 步骤二：配置 DATABASE_URL

生产环境 `.env.production`（或 AWS Secrets Manager / App Runner 环境变量）：

```env
DATABASE_URL="postgresql://USER:PASSWORD@your-rds-host.rds.amazonaws.com:5432/momenta"
JWT_SECRET="your-random-secret-here"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

> Prisma schema 无需任何改动，`provider = "postgresql"` 对本地 Docker 和 RDS 均适用。

### 步骤三：生产环境运行 Migration

**方式 A — 手动（简单）：**
```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**方式 B — GitHub Actions CI/CD（推荐）：**
```yaml
# .github/workflows/deploy.yml
- name: Run Prisma migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npx prisma migrate deploy
```

> `prisma migrate deploy` 用于生产（只应用未执行的迁移，不生成新迁移）。

### 步骤四：部署 Next.js 应用

**选项 A — AWS App Runner（最简单）：**
- 连接 GitHub 仓库，自动构建部署
- 设置环境变量（DATABASE_URL、JWT_SECRET）
- 自动 HTTPS，无需配置负载均衡

**选项 B — Vercel + AWS RDS：**
- Next.js 部署到 Vercel
- Vercel 环境变量中填入 RDS 连接串

---

## 验证方式

1. `npx prisma migrate dev` → `npm run db:seed` — 确认 hero_slide 表有默认 3 条数据
2. `npm run dev` → 访问首页，轮播图正常显示
3. 访问 `/admin/hero-slides` → 新增一条幻灯片，刷新首页确认出现
4. 在 Admin 修改排序/禁用某张幻灯片，首页应相应变化
5. 在 Admin 管理 Sponsors，首页 PartnersCarousel 应动态更新
6. 在 Admin Gallery 标记图片为 featured，首页 PreviousEventsWall 应动态更新
