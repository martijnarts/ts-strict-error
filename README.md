# ts-strict-error

![NPM badge](https://img.shields.io/npm/v/ts-strict-error)

ts-strict-error is an extremely simple little library that provides some nice
ergonomics for creating errors in Typescript that you can
[ts-pattern][ts-pattern] against.

[ts-pattern]: https://github.com/gvergnaud/ts-pattern

## Motivation

Typescript's built-in `Error` class is very simple and extremely hard to handle.
Most libraries don't add the required context to find out what's happening
easily, if at all. Many libraries don't document the errors they throw either.
This library provides a simple way to create complex errors, with typed context
and causes. Together with ts-pattern, it somewhat mirrors the ergonomics of
Rust's [thiserror][thiserror] and `match` statements.

Also check out [my blog post][blog-post].

[thiserror]: https://github.com/dtolnay/thiserror
[blog-post]: https://blog.martijnarts.com/p/517d43a0-5809-462c-bd01-0192f7e57569/

This repository also contains some converters to convert between `Error` and
`StrictError` types, so you can use this library in combination with other
libraries that throw `Error`s. There's an open discussion about those
[here][converters-disc].

[converters-disc]: https://github.com/martijnarts/ts-strict-error/discussions/1

## Installation

This library is available on NPM and needs to be installed and packaged with
your code:

```sh
# with npm
npm i -S ts-strict-error

# or yarn
yarn add ts-strict-error
```

## Usage

```ts
import { createStrictError } from "ts-strict-error";

const NetworkError = createStrictError("NetworkError");
const NonOkStatusCode = createStrictError<
  "NonOkStatusCode",
  undefined,
  { code: number }
>("NonOkStatusCode");

const FetchError = createStrictError<
  "Fetch",
  InstanceType<typeof NetworkError> | InstanceType<typeof NonOkStatusCode>
>("Fetch");

match(new FetchErr({ from: new NonOkStatusCode({ context: { code: 500 } }) }))
  .with({ name: "Fetch", cause: { name: "NetworkError" } }, () => {
    console.log("No network connection available");
  })
  .with({ name: "Fetch", cause: { name: "NonOkStatusCode" } }, ({ cause }) => {
    console.log(`Received non-OK status code: ${cause.context.code}`);
  })
  .exhaustive();
```
