**The bug in a nutshell**

When using the hono devserver, then importing an image in `src` (outside of `static` or `public`), it does not work.

Bug is fixed by: Excluding `webp` in middleware.

### Get started

```sh
bun run dev:with # run the with @hono/vite-dev-server plugin
```

```sh
bun run dev:without # run without plugins, just regular vite.createServer.
```

> Bootstrapped with [Solid Hop](https://github.com/blankeos/solid-hop)
