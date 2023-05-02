import { CustomError } from "ts-custom-error";

const TS_STRICT_ERROR_IDENT = Symbol("TS_STRICT_ERROR_IDENTIFIER");

type None = symbol & { __type: "none" };
const isNotNone = <T>(value: T | None): value is T => true;

abstract class StrictError<
  const Type extends string,
  const Cause extends Error | None = None,
  const Context = None
> extends CustomError {
  abstract readonly name: Type;

  readonly [TS_STRICT_ERROR_IDENT] = TS_STRICT_ERROR_IDENT;
  readonly cause: Cause;
  readonly context: Context;

  constructor(
    readonly innerMessage: string,
    readonly options: (Cause extends None ? object : { from: Cause }) &
      (Context extends None ? object : { context: Context })
  ) {
    super(innerMessage, {
      cause: "from" in options ? options.from : undefined,
    });

    this.cause = ("from" in options ? options.from : undefined) as Cause;
    this.context = (
      "context" in options && isNotNone(options.context)
        ? options.context
        : undefined
    ) as typeof this.context;
  }
}

function createStrictError<
  const Type extends string,
  const Cause extends Error | None = None,
  const Context = None
>(
  type: Type
): new (
  ...params: [
    ConstructorParameters<typeof StrictError<Type, Cause, Context>>[1]
  ]
) => StrictError<Type, Cause, Context> {
  return class AnonymousStrictError extends StrictError<Type, Cause, Context> {
    readonly name = type;

    constructor(
      options: (Cause extends None ? object : { from: Cause }) &
        (Context extends None ? object : { context: Context })
    ) {
      super(`StrictError of type ${type}`, options);
    }
  };
}

function isStrictError(
  error: unknown
): error is StrictError<string, Error | None, unknown> {
  return (
    typeof error === "object" &&
    error != null &&
    error instanceof Error &&
    TS_STRICT_ERROR_IDENT in error
  );
}

export { StrictError, createStrictError, isStrictError, None };
