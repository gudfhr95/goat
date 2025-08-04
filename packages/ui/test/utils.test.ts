import { describe, expect, it } from "vitest";

import { cn } from "../src/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("base-class", "additional-class");
      expect(result).toBe("base-class additional-class");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", undefined, false, "active");
      expect(result).toBe("base active");
    });

    it("should merge tailwind classes correctly", () => {
      const result = cn("px-4 py-2", "px-8");
      expect(result).toBe("py-2 px-8");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle arrays", () => {
      const result = cn(["base", "additional"]);
      expect(result).toBe("base additional");
    });
  });
});
