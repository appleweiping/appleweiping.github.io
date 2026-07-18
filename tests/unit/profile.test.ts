import { describe, expect, it } from "vitest";
import { higherEducation, identity, timeline } from "../../src/data/profile";

describe("authoritative profile facts", () => {
  it("uses the approved research-first identity without a public location", () => {
    expect(identity.title.en).toBe("AI for Science Undergraduate Researcher");
    expect(identity).not.toHaveProperty("location");
  });

  it("keeps the confirmed UMN and Netherlands timelines", () => {
    expect(higherEducation.find((item) => item.id === "umn")?.dates.en).toBe("May 2026 — Present");
    expect(higherEducation.find((item) => item.id === "delft-tue")?.dates.en).toBe("September 2024 — August 2026");
    expect(timeline.find((item) => item.id === "umn-nlp")?.dates.en).toBe("July 2026 — Present");
  });

  it("describes the CMU-linked work as an independent project", () => {
    expect(timeline.find((item) => item.id === "pm25")?.organization).toBe("Independent research project");
  });
});
