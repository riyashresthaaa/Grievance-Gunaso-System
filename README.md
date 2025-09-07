This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# F1 — Architecture 

## What’s implemented

### Routing & Shell

Root layout: src/app/layout.tsx (global fonts, Carbon CSS, Providers)

App shell: src/app/(shell)/layout.tsx + ClientLayout (Header/SideNav, theme icon)

### Routes scaffold:

/ (Dashboard), /citizen/grievances, /citizen/grievances/new, /citizen/grievances/[id]

/admin/triage, /admin/grievances, /admin/categories, /admin/wards

### State management

ThemeContext (g10/g90) + header Sun/Moon icon toggle

CalendarContext (AD/BS toggle + “Nepali numerals” display flag)

### i18n wiring

i18next client init: src/i18n/index.ts

Locales: public/locales/en/common.json, public/locales/np/common.json

LangToggle component (runtime EN/NP)

### Data strategy

CSV → JSON via route handler: GET /api/grievances
src/app/api/grievances/route.ts (reads src/data/grievances.csv)

Server fetch helper: src/utils/absoluteUrl.ts (builds absolute URL on server)

### Quality

Scripts: dev, build, start, lint, typecheck, test

Vitest unit test (example): tests/unit/numerals.spec.ts

ESLint clean; TS strict

# F2 — Components 

## Shared components (Carbon-only)

###  AppDataTable 
— DataTable, Pagination, Tag
States: Loading (InlineLoading), Empty (EmptyState), Error (InlineNotification), Disabled (toolbar/actions)

### FilterBar 
— Search, Dropdown, DatePicker, Button
States: Disabled during refetch; can show skeletons if async options are added later

### FormFieldGroup 
— Form, TextInput, TextArea, Dropdown, FileUploader
States: Disabled on submit; InlineNotification on submit error; clears on success

### StatusTag / PriorityTag 
— Tag kinds for semantic status/priority with neutral fallback

### EmptyState 
— Tile with optional action

### ModalConfirm 
— Modal + InlineLoading for async confirm; locks buttons while pending

### Toaster 
— global ToastNotification provider (ToasterProvider) + useToaster() hook

### Where they live
src/components/shared/


##### for testing shared components
src/app/(shell)/dev/components
