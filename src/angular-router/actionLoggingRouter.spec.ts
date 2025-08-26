import { ActionLoggingRouter } from "./actionLoggingRouter";
import {
  type NavigationExtras,
  type UrlCreationOptions,
  type UrlTree,
} from "@angular/router";
import "@jest/globals";

jest.mock("@angular/router", () => ({
  UrlTree: class UrlTree {},
  UrlSegmentGroup: class UrlSegmentGroup {},
  NavigationExtras: {},
  UrlCreationOptions: {},
  IsActiveMatchOptions: {},
}));

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
    const tree = { commands: ["first", "second"] } as MockedTreeWithCommands;
    expect(router.serializeUrl(tree as unknown as UrlTree)).toEqual("first/second");
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
      expect(
        router.isActive({ commands: ["path", "nested"] } as unknown as UrlTree, true),
      ).toBe(true);
    });

    it("should be active when exact and routes match with options", () => {
      expect(
        router.isActive(
          { commands: ["path", "nested"] } as unknown as UrlTree,
          {
            paths: "exact",
            queryParams: "exact",
            fragment: "ignored",
            matrixParams: "ignored",
          },
        ),
      ).toBe(true);
    });

    it("should be active when not exact and routes match", () => {
      expect(
        router.isActive({ commands: ["path", "nested"] } as unknown as UrlTree, false),
      ).toBe(true);
    });

    it("should not be active when exact and routes do not match", () => {
      expect(
        router.isActive({ commands: ["path", "not"] } as unknown as UrlTree, true),
      ).toBe(false);
    });

    it("should not be active when not exact and routes do not match", () => {
      expect(
        router.isActive({ commands: ["path", "not"] } as unknown as UrlTree, false),
      ).toBe(false);
    });

    it("should be active when not exact and routes match partly", () => {
      expect(
        router.isActive(
          { commands: ["path", "nested", "deep"] } as unknown as UrlTree,
          false,
        ),
      ).toBe(true);
    });

    it("should be active when not exact and routes match partly with options", () => {
      expect(
        router.isActive(
          { commands: ["path", "nested", "deep"] } as unknown as UrlTree,
          {
            paths: "subset",
            queryParams: "exact",
            fragment: "ignored",
            matrixParams: "ignored",
          },
        ),
      ).toBe(true);
    });

    it("should not be active when exact and routes match partly", () => {
      expect(
        router.isActive(
          { commands: ["path", "nested", "deep"] } as unknown as UrlTree,
          true,
        ),
      ).toBe(false);
    });
  });

  it("should call action on navigate", () => {
    const commands = ["first", "second"];
    const extras = { option: true } as NavigationExtras;

    return expect(router.navigate(commands, extras)).resolves.toBe(true);
  });

  it("should call action on navigateByUrl", () => {
    const url = { path: "a/b/c" } as unknown as UrlTree;
    const extras = { option: true } as NavigationExtras;

    return expect(router.navigateByUrl(url, extras)).resolves.toBe(true);
  });
});