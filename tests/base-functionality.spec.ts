import { match } from "ts-pattern";
import { StrictError, createStrictError, isStrictError } from "../lib";

test("pattern matching errors works", () => {
  const Err = createStrictError<"foo" | "bar">("foo");

  match(new Err({}))
    .with({ name: "foo" }, (err) => {
      expect(err).toBeInstanceOf(StrictError);
      expect(isStrictError(err)).toBe(true);
    })
    .with({ name: "bar" }, () => {
      throw new Error("should not match");
    })
    .exhaustive();
});

test("nested pattern matching errors works", () => {
  const ChildErr = createStrictError("child");
  const Err = createStrictError<"parent", InstanceType<typeof ChildErr>>(
    "parent"
  );

  match(new Err({ from: new ChildErr({}) }))
    .with({ name: "parent", cause: { name: "child" } }, (err) => {
      expect(err).toBeInstanceOf(StrictError);
      expect(isStrictError(err)).toBe(true);
    })
    .exhaustive();
});

test("union typed error causes works", () => {
  const ChildErrA = createStrictError("childA");
  const ChildErrB = createStrictError("childB");
  const ChildErrC = createStrictError("childC");

  const Err = createStrictError<
    "parent",
    | InstanceType<typeof ChildErrA>
    | InstanceType<typeof ChildErrB>
    | InstanceType<typeof ChildErrC>
  >("parent");

  match(new Err({ from: new ChildErrA({}) }))
    .with({ name: "parent", cause: { name: "childA" } }, (err) => {
      expect(err).toBeInstanceOf(StrictError);
      expect(isStrictError(err)).toBe(true);
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
  const Err = createStrictError<"foo", undefined, { foo: string }>("foo");

  const err = new Err({ context: { foo: "bar" } });
  expect(err.context.foo).toBe("bar");
});

test("context works with cause", () => {
  const ChildErr = createStrictError<"child", undefined, { foo: string }>(
    "child"
  );
  const Err = createStrictError<
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

test("the class name is correct", () => {
  const Err = createStrictError("foo");
  expect(Err.name).toBe("foo");
});
