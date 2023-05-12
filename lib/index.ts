import { CustomError } from "ts-custom-error";

const TS_STRICT_ERROR_IDENT = Symbol("TS_STRICT_ERROR_IDENTIFIER");

abstract class StrictError<
  const Type extends string,
  const Cause extends Error | undefined = undefined,
  const Context = undefined
> extends CustomError {
  abstract readonly name: Type;

  readonly [TS_STRICT_ERROR_IDENT] = TS_STRICT_ERROR_IDENT;
  readonly cause: Cause;
  readonly context: Context;

  constructor(
    readonly message: string,
    readonly options: (Cause extends undefined ? object : { from: Cause }) &
      (Context extends undefined ? object : { context: Context })
  ) {
    super(message, {
      cause: "from" in options ? options.from : undefined,
    });

    this.cause = ("from" in options ? options.from : undefined) as Cause;
    this.context = (
      "context" in options ? options.context : undefined
    ) as Context;
  }
}

function createStrictError<
  const Type extends string,
  const Cause extends Error | undefined = undefined,
  const Context = undefined
>(
  type: Type
): new (
  ...params: [
    ConstructorParameters<typeof StrictError<Type, Cause, Context>>[1]
  ]
) => StrictError<Type, Cause, Context> {
  const c = class extends StrictError<Type, Cause, Context> {
    readonly name = type;

    constructor(
      options: (Cause extends undefined ? object : { from: Cause }) &
        (Context extends undefined ? object : { context: Context })
    ) {
      super(`StrictError of type ${type}`, options);
    }
  };
  Object.defineProperty(c, "name", {
    value: type,
    writable: false,
  });
  return c;
}

function isStrictError(
  error: unknown
): error is StrictError<string, Error | undefined, unknown> {
  return (
    typeof error === "object" &&
    error != null &&
    error instanceof Error &&
    TS_STRICT_ERROR_IDENT in error
  );
}

export { StrictError, createStrictError, isStrictError };
