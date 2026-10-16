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

## App feedback

Completed quiz results include one feedback card below the exploration actions. It accepts a satisfaction choice, a topic, and an optional message of up to 2,000 characters. The quiz itself has no site footer; results retain it.

`POST /api/feedback` validates submissions and stores them in Qdrant using the existing `QDRANT_URL` / `QDRANT_API_KEY` settings (or the existing Cloud aliases). The collection defaults to `fyp_app_feedback_v1`; set `QDRANT_FEEDBACK_COLLECTION` to override it. The collection is created on the first submission, so the configured credentials need create-collection and write access. Feedback is stored as payload-only points, separately from university records. The same submission ID is reused on retry. Quiz answers, names, and contact details are not added to the payload.

Run `npm run test:feedback` to check validation, persistence, retry IDs, and storage failures against a local mock Qdrant server, without writing to the configured database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
