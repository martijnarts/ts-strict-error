# ts-error

ts-error is an extremely simple little library that provides some nice ergonomics for creating errors in Typescript that you can [ts-pattern][ts-pattern] against.

[ts-pattern]: https://github.com/gvergnaud/ts-pattern

## Usage

```ts
import { createError, None } from "ts-error";

const NetworkError = createTsError("NetworkError");
const NonOkStatusCode = createTsError<
  "NonOkStatusCode",
  None,
  { code: number }
>("NonOkStatusCode");

const FetchError = createTsError<
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
