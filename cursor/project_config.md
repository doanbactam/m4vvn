# Project Configuration (LTM)

*File này chứa ngữ cảnh dài hạn, ổn định cho dự án.*
*Chỉ nên cập nhật khi có thay đổi về mục tiêu cốt lõi, công nghệ hoặc pattern.*

---

## Core Goal

Đây là một nền tảng tập trung vào việc giới thiệu và tổng hợp các giải pháp phần mềm AI 

---

## Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **UI Components:** Shadcn UI, Radix UI
* **Styling:** Tailwind CSS
* **State Management:** nuqs (URL Query State)
* **Form Validation:** Zod
* **Server Actions:** zsa (Zod Server Actions)
* **Package Manager:** Bun
* **Development:** ESLint, Prettier

---

## Critical Patterns & Conventions

* **Components:**
  * Ưu tiên React Server Components (RSC)
  * Sử dụng 'use client' chỉ khi cần thiết
  * Wrap client components trong Suspense với fallback
  * Sử dụng dynamic loading cho non-critical components

* **Naming:**
  * Thư mục: lowercase với dashes (ví dụ: components/auth-wizard)
  * Components: PascalCase với named exports
  * Biến: camelCase với auxiliary verbs (ví dụ: isLoading, hasError)

* **TypeScript:**
  * Sử dụng types thay vì interfaces
  * Tránh enums, thay bằng const maps
  * Functional components với TypeScript types

* **Server Actions:**
  * Sử dụng zsa cho mọi server action
  * Định nghĩa input schemas với Zod
  * Xử lý lỗi nhất quán

* **State Management:**
  * Sử dụng useQueryState cho URL query state
  * Tránh useState khi có thể

* **Performance:**
  * Tối ưu Web Vitals (LCP, CLS, FID)
  * Lazy loading cho images và components
  * Mobile-first responsive design

---

## Key Constraints

* Tương thích với các trình duyệt hiện đại
* Tối ưu performance cho mobile devices
* Đảm bảo accessibility standards
* Progressive enhancement