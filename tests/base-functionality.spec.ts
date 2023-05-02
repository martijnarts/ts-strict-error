import { match } from "ts-pattern";
import { None, TsError, createTsError, isTsError } from "../lib";

test("pattern matching errors works", () => {
  const Err = createTsError<"foo" | "bar">("foo");

  match(new Err({}))
    .with({ name: "foo" }, (err) => {
      expect(err).toBeInstanceOf(TsError);
      expect(isTsError(err)).toBe(true);
    })
    .with({ name: "bar" }, () => {
      throw new Error("should not match");
    })
    .exhaustive();
});

test("nested pattern matching errors works", () => {
  const ChildErr = createTsError("child");
  const Err = createTsError<"parent", InstanceType<typeof ChildErr>>("parent");

  match(new Err({ from: new ChildErr({}) }))
    .with({ name: "parent", cause: { name: "child" } }, (err) => {
      expect(err).toBeInstanceOf(TsError);
      expect(isTsError(err)).toBe(true);
    })
    .exhaustive();
});

test("union typed error causes works", () => {
  const ChildErrA = createTsError("childA");
  const ChildErrB = createTsError("childB");
  const ChildErrC = createTsError("childC");

  const Err = createTsError<
    "parent",
    | InstanceType<typeof ChildErrA>
    | InstanceType<typeof ChildErrB>
    | InstanceType<typeof ChildErrC>
  >("parent");

  match(new Err({ from: new ChildErrA({}) }))
    .with({ name: "parent", cause: { name: "childA" } }, (err) => {
      expect(err).toBeInstanceOf(TsError);
      expect(isTsError(err)).toBe(true);
    })
    .with({ name: "parent", cause: { name: "childB" } }, () => {
      throw new Error("should not match");
    })
    .with({ name: "parent", cause: { name: "childC" } }, () => {
      throw new Error("should not match");
    })
    .exhaustive();
});

test("context works", () => {
  const Err = createTsError<"foo", None, { foo: string }>("foo");

  const err = new Err({ context: { foo: "bar" } });
  expect(err.context.foo).toBe("bar");
});

test("context works with cause", () => {
  const ChildErr = createTsError<"child", None, { foo: string }>("child");
  const Err = createTsError<
    "parent",
    InstanceType<typeof ChildErr>,
    { bar: string }
  >("parent");

  const err = new Err({
    from: new ChildErr({ context: { foo: "bar" } }),
    context: { bar: "baz" },
  });
  expect(err.context.bar).toBe("baz");
  expect(err.cause.context.foo).toBe("bar");
});
