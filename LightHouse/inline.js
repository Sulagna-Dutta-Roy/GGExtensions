import assert from "assert/strict";
import fs from "fs";
import path from "path";

import * as acorn from "acorn";
import MagicString from "magic-string";
import resolve from "resolve";
import * as terser from "terser";

import { LH_ROOT } from "../../shared/root.js";

// ESTree provides much better types for AST nodes. See https://github.com/acornjs/acorn/issues/946
/** @typedef {import('estree').Node} Node */
/** @typedef {import('estree').SimpleCallExpression} SimpleCallExpression */

/** @typedef {{text: string, location: {file: string, line: number, column: number}}} Warning */

/** An error associated with a particular AST node. */
class AstError extends Error {
  /** @param {string} message @param {Node} node */
  constructor(message, node) {
    super(message);
    this.node = node;
  }
}
