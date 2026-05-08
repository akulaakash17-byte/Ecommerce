import assert from "node:assert/strict";
import test from "node:test";
import { createBaseSlug } from "../utils/slug.js";

test("createBaseSlug joins meaningful parts and normalizes text", () => {
  assert.equal(createBaseSlug(["Open Plot", "Pragnapur", "Gajwel"]), "open-plot-pragnapur-gajwel");
});

test("createBaseSlug ignores empty parts", () => {
  assert.equal(createBaseSlug(["Villa", "", null, "Siddipet"]), "villa-siddipet");
});
