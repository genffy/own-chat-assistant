# Own Chat Assistant

simple chatGpt demo for [How to use stream: true?](https://github.com/openai/openai-node/issues/18)

- UI copy from [Simple chat component](https://tailwindcomponents.com/component/chat)
- Stream processing util [stream-response](./src/utils/stream-response.util.ts) copy from [Building a GPT-3 app with Next.js and Vercel Edge Functions](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions)

thanks all.

## TODOs

- [x] markdown format
- [ ] support context
- [x] change api
- [x] change api params
- [ ] download chats
- [ ] copy content
- [ ] select chats share(image)

## Dev

- config environment variable `OPENAI_API_KEY` at `.env` file
- config proxy to your own [httpsOverHttp](./src/app/api/hello/route.ts#L5-L10)

```bash
npm i
npm run dev
```

## Usage

Fork and deploy it to Vercel.
Production environment variables `OPENAI_API_KEY` can be configured at [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
