## nextjs-chatgpt-demo

simple chatGpt demo for [How to use stream: true?](https://github.com/openai/openai-node/issues/18)

- UI copy from [Simple chat component](https://tailwindcomponents.com/component/chat)
- Stream processing util [stream-response](./src/utils/stream-response.util.ts) copy from [Building a GPT-3 app with Next.js and Vercel Edge Functions](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions)

thanks all.

### dev

- config environment variable `OPENAI_API_KEY` at `.env` file
- config proxy to your own [httpsOverHttp](./src/app/api/hello/route.ts#L5-L10)

```bash
npm i
npm run dev
```

### deploy

Production environment variables `OPENAI_API_KEY` can be configured at [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
