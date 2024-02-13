import { EnvManager } from "@src/config/EnvManager";

describe("EnvManager", () => {
  it(`Should have getAppPort property`, () => {
    expect(EnvManager.getAppPort()).toBeDefined();
  });
  it(`Should have getOrderBookTreshold property`, () => {
    expect(EnvManager.getOrderBookTreshold()).toBeDefined();
  });
});
