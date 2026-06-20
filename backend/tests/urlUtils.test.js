const { formatUrl, isValidUrl } = require("../utils/urlUtils");

describe("URL Utilities", () => {
  test("adds https:// when missing", () => {
    expect(formatUrl("google.com")).toBe("https://google.com");
  });

  test("keeps http:// when already present", () => {
    expect(formatUrl("http://example.com")).toBe("http://example.com");
  });

  test("keeps https:// when already present", () => {
    expect(formatUrl("https://example.com")).toBe("https://example.com");
  });

  test("trims extra spaces", () => {
    expect(formatUrl("  google.com  ")).toBe("https://google.com");
  });

  test("validates good URL", () => {
    expect(isValidUrl("google.com")).toBe(true);
  });
});