import { ActionLoggingRouter } from "./actionLoggingRouter";
import {
  type NavigationExtras,
  type UrlCreationOptions,
  type UrlTree,
} from "@angular/router";
import "@jest/globals";

jest.mock("@angular/router", () => {
  class UrlTree {
    commands?: string[];
    path?: string;

    constructor(init?: { commands?: string[]; path?: string }) {
      Object.assign(this, init);
    }
  }

  class UrlSegmentGroup {}

  return {
    UrlTree,
    UrlSegmentGroup,
    NavigationExtras: {},
    UrlCreationOptions: {},
    IsActiveMatchOptions: {},
  };
});

const makeUrlTree = (init?: { commands?: string[]; path?: string }): UrlTree => {
  const { UrlTree: UrlTreeClass } = jest.requireMock("@angular/router") as {
    UrlTree: new (init?: { commands?: string[]; path?: string }) => UrlTree;
  };
  return new UrlTreeClass(init);
};

const action = jest.fn();
const mockedAction = action as jest.MockedFunction<typeof action>;

interface MockedTreeWithCommands {
  commands: string[];
  path?: string;
}

describe("ActionLoggingRouter", () => {
  let router: ActionLoggingRouter;
  const actionCallback = jest.fn();

  beforeAll(() => {
    mockedAction.mockReturnValue(actionCallback);
  });

  beforeEach(() => {
    router = new ActionLoggingRouter("path/nested");
  });

  it("should be created", () => {
    expect(router).toBeTruthy();
  });

  it("should return object as router state", () => {
    expect(router.routerState).toBeTruthy();
  });

  it("should return navigated", () => {
    expect(router.navigated).toBe(true);
  });

  it("should return events", () => {
    expect(router.events).toBeTruthy();
  });

  it("should return concatenated url", () => {
    const tree = makeUrlTree({ commands: ["first", "second"] });
    expect(router.serializeUrl(tree)).toEqual("first/second");
  });

  it("should return activePath as url", () => {
    expect(router.url).toEqual("path/nested");
  });

  it("should return parameters as tree", () => {
    expect(
      router.createUrlTree(["first", "second"], {
        option: true,
      } as UrlCreationOptions),
    ).toStrictEqual({
      commands: ["first", "second"],
      extras: { option: true },
    });
  });

  describe("isActive", () => {
    it("should be active when exact and routes match", () => {
      const tree = makeUrlTree({ commands: ["path", "nested"] });
      expect(router.isActive(tree, true)).toBe(true);
    });

    it("should be active when exact and routes match with options", () => {
      const tree = makeUrlTree({ commands: ["path", "nested"] });
      expect(
        router.isActive(tree, {
          paths: "exact",
          queryParams: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
        }),
      ).toBe(true);
    });

    it("should be active when not exact and routes match", () => {
      const tree = makeUrlTree({ commands: ["path", "nested"] });
      expect(router.isActive(tree, false)).toBe(true);
    });

    it("should not be active when exact and routes do not match", () => {
      const tree = makeUrlTree({ commands: ["path", "not"] });
      expect(router.isActive(tree, true)).toBe(false);
    });

    it("should not be active when not exact and routes do not match", () => {
      const tree = makeUrlTree({ commands: ["path", "not"] });
      expect(router.isActive(tree, false)).toBe(false);
    });

    it("should be active when not exact and routes match partly", () => {
      const tree = makeUrlTree({ commands: ["path", "nested", "deep"] });
      expect(router.isActive(tree, false)).toBe(true);
    });

    it("should be active when not exact and routes match partly with options", () => {
      const tree = makeUrlTree({ commands: ["path", "nested", "deep"] });
      expect(
        router.isActive(tree, {
          paths: "subset",
          queryParams: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
        }),
      ).toBe(true);
    });

    it("should not be active when exact and routes match partly", () => {
      const tree = makeUrlTree({ commands: ["path", "nested", "deep"] });
      expect(router.isActive(tree, true)).toBe(false);
    });
  });

  it("should call action on navigate", () => {
    const commands = ["first", "second"];
    const extras = { option: true } as NavigationExtras;

    return expect(router.navigate(commands, extras)).resolves.toBe(true);
  });

  it("should call action on navigateByUrl", () => {
    const url = makeUrlTree({ path: "a/b/c" });
    const extras = { option: true } as NavigationExtras;

    return expect(router.navigateByUrl(url, extras)).resolves.toBe(true);
  });
});