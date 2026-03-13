# Momenta 网站升级开发计划

## 进度总览

| # | 功能模块 | 状态 |
|---|---------|------|
| 1 | DB 模型扩展（Sponsor / TeamMember / Admin / HeroSlide） | ✅ 完成 |
| 2 | 类型更新 `src/lib/types.ts` | ✅ 完成 |
| 3 | Admin 认证系统（JWT + bcrypt + proxy.ts + 登录页） | ✅ 完成 |
| 4 | Admin Hero Slides 管理页 | ✅ 完成 |
| 5 | Admin Sponsors 管理页 | ✅ 完成 |
| 6 | 首页动态化（HomeHeroCarousel / PartnersCarousel / PreviousEventsWall 从 DB 读取） | ✅ 完成 |
| 7 | 3月活动数据写入 seed（9个真实活动） | ✅ 完成 |
| 8 | **Admin 活动管理**（新建 / 编辑 / 删除活动） | 🔲 待开发 |
| 9 | **Admin 报名管理**（查看报名名单 + Excel 导出） | 🔲 待开发 |
| 10 | **Admin 图库管理**（图片 / 视频 CRUD） | 🔲 待开发 |
| 11 | **Admin 团队成员管理** | 🔲 待开发 |
| 12 | **活动详情页** `/events/[slug]` | 🔲 待开发 |
| 13 | **活动日历页** `/calendar`（月视图） | 🔲 待开发 |
| 14 | **赞助商页** `/sponsors` | 🔲 待开发 |
| 15 | **关于页动态化**（团队成员从 DB 读取） | 🔲 待开发 |
| 16 | **报名页付款提示**（priceCents > 0 时显示线下付款说明） | 🔲 待开发 |
| 17 | **Header 导航更新**（加入日历、赞助商链接） | 🔲 待开发 |

---

## 背景与目标

Momenta 是悉尼华人户外运动社区的官方网站，基于 Next.js 16 + Prisma + PostgreSQL 构建。
当前 MVP 已具备活动列表、报名、图库、联系表单等基础功能，本次升级目标是补全所有缺失模块，达到可正式运营的状态。

**已确认决策：**
- 支付：暂不集成 Stripe，收费活动报名后显示"请线下付款"提示
- 媒体存储：Admin 后台通过填写外部 URL 管理图片/视频，暂不做文件上传
- Admin 账号初始化：通过 `prisma/seed.ts` 预设

---

## 现有基础（无需重建）

| 模块 | 文件 | 状态 |
|------|------|------|
| 首页框架 | `src/app/page.tsx` | ✅ 已有，需补充 |
| 活动列表 | `src/app/events/page.tsx` | ✅ 已有 |
| 活动报名 | `src/app/events/[slug]/register/page.tsx` | ✅ 已有，需加收费提示 |
| 图库 | `src/app/gallery/page.tsx` | ✅ 已有，需加视频支持 |
| 关于页 | `src/app/about/page.tsx` | ✅ 已有，需动态化团队成员 |
| 联系页 | `src/app/contact/page.tsx` | ✅ 已有，无需改动 |
| API 基础 | `src/app/api/events、registrations、gallery、inquiries` | ✅ 已有 |
| 数据模型 | `prisma/schema.prisma` | ✅ 已有，需扩展 |

---

## 阶段一：数据库模型扩展

**修改文件：** `prisma/schema.prisma`

### 新增模型

```prisma
// 赞助商
model Sponsor {
  id          String   @id @default(cuid())
  name        String
  logoUrl     String
  description String   @db.Text
  websiteUrl  String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// 团队成员（关于页动态化）
model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?  @db.Text
  avatarUrl String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
}

// 管理员账号
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

### 扩展现有模型

```prisma
// GalleryImage 新增视频支持字段
model GalleryImage {
  id        String   @id @default(cuid())
  url       String
  alt       String
  type      String   @default("image")  // "image" | "video"
  videoUrl  String?                     // 视频时填写，url 字段存封面图
  tags      String   @default("[]")
  createdAt DateTime @default(now())
}
```

> `Event` 模型已有 `coverImageUrl` 和 `priceCents`，无需修改。

**执行命令：**
```bash
npx prisma migrate dev --name add-sponsor-team-admin-video
```

**Admin 初始化：** 在 `prisma/seed.ts` 中添加默认管理员账号（bcrypt 哈希密码）。

---

## 阶段二：类型更新

**修改文件：** `src/lib/types.ts`

新增：
- `Sponsor`、`TeamMember`、`Admin` 类型（从 `@prisma/client` 导出）
- `GalleryItemType = "image" | "video"`

---

## 阶段三：前台页面升级

### 3.1 首页 `src/app/page.tsx`

**现状：** 已有 Hero、关于、Partners、PreviousEventsWall、日历、Instagram、联系表单

**补充内容：**
- `PartnersCarousel` 改为从数据库 `Sponsor` 表读取（修改 `src/components/home/PartnersCarousel.tsx` 为接收 props）
- `PreviousEventsWall` 改为从 `GalleryImage` 表读取（修改 `src/components/home/PreviousEventsWall.tsx` 为接收 props）
- 新增"最新活动预告"区块：取未来最近 3 个活动展示，含报名按钮

### 3.2 活动详情页 `src/app/events/[slug]/page.tsx` — 新建

**功能：**
- 活动封面图、标题、运动类型标签
- 活动时间、地点、详细介绍
- 已报名人数 / 剩余名额
- 报名按钮（跳转至 `/events/[slug]/register`）

### 3.3 活动报名页 `src/app/events/[slug]/register/`

**现状：** 已有基础表单

**补充：** 报名成功后，若 `priceCents > 0`，显示线下付款说明（金额、付款方式、联系方式）

### 3.4 活动日历 `src/app/calendar/page.tsx` — 新建

**功能：**
- 月视图日历，纯手写（不引入第三方库）
- 每个日期格显示当天活动标题（截断超出）
- 点击活动跳转活动详情页
- 上/下月翻页按钮
- 数据从 `/api/events` 拉取全部活动（不过滤日期范围）

### 3.5 图库页 `src/app/gallery/page.tsx`

**现状：** 只支持图片

**补充：**
- `GalleryGrid` 组件支持视频类型（`type === "video"` 时渲染 `<video>` 标签 + 播放按钮）
- 数据仍从 `/api/gallery` 获取（已按 `createdAt` 降序）

### 3.6 赞助商页 `src/app/sponsors/page.tsx` — 新建

**功能：**
- 每个赞助商：左侧 Logo 图片，右侧公司名 + 介绍文字
- 点击整行跳转赞助商网站（`target="_blank"`）
- 数据从新增 `/api/sponsors` 接口读取
- 仅显示 `isActive === true` 的赞助商，按 `sortOrder` 升序

### 3.7 关于页 `src/app/about/page.tsx`

**现状：** 团队成员硬编码数组

**补充：** 从数据库 `TeamMember` 表动态读取，按 `sortOrder` 排列

---

## 阶段四：新增 API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/sponsors` | GET | 获取所有 isActive 赞助商 |
| `/api/team` | GET | 获取所有团队成员 |
| `/api/admin/auth` | POST | Admin 登录，返回 JWT cookie |
| `/api/admin/auth` | DELETE | Admin 登出，清除 cookie |
| `/api/admin/events` | GET/POST | 活动列表 / 新建活动 |
| `/api/admin/events/[id]` | PUT/DELETE | 编辑 / 删除活动 |
| `/api/admin/registrations` | GET | 按活动筛选报名名单 |
| `/api/admin/registrations/export` | GET | 导出 Excel |
| `/api/admin/gallery` | POST/DELETE | 新增 / 删除图库项 |
| `/api/admin/sponsors` | GET/POST | 赞助商列表 / 新建 |
| `/api/admin/sponsors/[id]` | PUT/DELETE | 编辑 / 删除赞助商 |
| `/api/admin/team` | GET/POST | 团队成员列表 / 新建 |
| `/api/admin/team/[id]` | PUT/DELETE | 编辑 / 删除团队成员 |

---

## 阶段五：Admin 后台

### 5.1 认证方案

- **库：** `jose`（JWT 签名/验证）+ `bcryptjs`（密码哈希）
- **流程：** 登录 → 验证密码 → 签发 JWT → 存入 httpOnly Cookie
- **保护：** `src/middleware.ts` 拦截所有 `/admin/**` 请求，验证 Cookie

**新建文件：**
- `src/app/admin/login/page.tsx` — 登录表单页
- `src/app/api/admin/auth/route.ts` — POST 登录 / DELETE 登出
- `src/middleware.ts` — 路由保护

### 5.2 Admin 布局

- `src/app/admin/layout.tsx` — 侧边栏导航
- 侧边栏菜单项：活动管理、报名管理、图库管理、赞助商管理、团队管理、退出登录

### 5.3 活动管理 `src/app/admin/events/`

- `page.tsx` — 活动列表，含编辑/删除按钮
- `new/page.tsx` — 新建活动表单
- `[id]/edit/page.tsx` — 编辑活动表单

**表单字段：** 标题、Slug、运动类型、描述、开始/结束时间、地点名称、地址、容量、价格（分）、封面图 URL、是否精选

### 5.4 报名管理 `src/app/admin/registrations/page.tsx`

- 下拉选择活动，展示对应报名名单（姓名、邮箱、电话、备注、报名时间）
- **导出 Excel 按钮：** 调用 `/api/admin/registrations/export?eventId=xxx`，用 `xlsx` 库生成 `.xlsx` 下载

### 5.5 图库管理 `src/app/admin/gallery/page.tsx`

- 展示现有图片/视频列表（缩略图 + 类型标签）
- 新增表单：类型（图片/视频）、URL（图片或视频封面图）、视频 URL（视频类型时填写）、Alt 文字、标签
- 删除按钮

### 5.6 赞助商管理 `src/app/admin/sponsors/page.tsx`

- 列表含编辑/删除/排序字段
- 新增/编辑表单：名称、Logo URL、介绍、网站 URL、排序号、是否显示

### 5.7 团队成员管理 `src/app/admin/team/page.tsx`

- 新增/编辑/删除团队成员
- 表单：姓名、职位、简介、头像 URL、排序号

---

## 阶段六：导航更新

**修改文件：** `src/components/Header.tsx`

新增导航项：
- `活动日历` → `/calendar`
- `赞助商` → `/sponsors`

---

## 技术选型

| 需求 | 方案 | 理由 |
|------|------|------|
| Admin 认证 | `jose` + `bcryptjs` + Middleware | 轻量，无需 NextAuth |
| Excel 导出 | `xlsx` 库 | 成熟稳定 |
| 活动日历 | 纯手写月视图组件 | 避免引入大型依赖 |
| 媒体管理 | 仅填写外部 URL | 简单可靠 |
| 支付 | 不集成，显示线下付款说明 | 优先核心功能 |
| 邮件通知 | 不集成（可后续加 Resend） | 降低复杂度 |

---

## 推荐开发顺序

```
1. prisma/schema.prisma 扩展  →  migrate  →  seed（含初始 Admin 账号）
2. src/lib/types.ts 更新
3. Admin 认证（jose、middleware、login 页）
4. Admin 活动管理  →  录入真实活动数据
5. Admin 报名管理 + Excel 导出
6. Admin 图库 / 赞助商 / 团队管理
7. 前台新增页面（活动详情、日历、赞助商页）
8. 前台改造（首页动态化、图库视频支持、关于页动态化、报名付款提示）
9. 导航更新（加入日历、赞助商）
```

---

## 验证方式

- `npm run dev` 启动，逐页访问验证
- 访问 `/admin/login` 确认未登录时被重定向
- 在 Admin 创建活动后，`/events` 和 `/calendar` 应显示该活动
- 在 Admin 导出报名 Excel，检查数据完整性
- 在 Admin 新增赞助商，访问 `/sponsors` 确认显示
- 在 Admin 上传视频 URL，访问 `/gallery` 确认视频正常播放
- 在 Admin 添加团队成员，访问 `/about` 确认动态展示
