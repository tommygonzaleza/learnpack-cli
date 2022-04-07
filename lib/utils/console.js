"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
exports.default = {
  // _debug: true,
  _debug: process.env.DEBUG === "true",
  startDebug: function () {
    this._debug = true;
  },
  log: (msg, ...args) => console.log(chalk.gray(msg), ...args),
  error: (msg, ...args) => console.log(chalk.red("⨉ " + msg), ...args),
  success: (msg, ...args) => console.log(chalk.green("✓ " + msg), ...args),
  info: (msg, ...args) => console.log(chalk.blue("ⓘ " + msg), ...args),
  help: (msg) =>
    console.log(`${chalk.white.bold("⚠ help:")} ${chalk.white(msg)}`),
  debug(...args) {
    this._debug && console.log(chalk.magentaBright("⚠ debug: "), args);
  },
  warning: (msg) =>
    console.log(`${chalk.yellow("⚠ warning:")} ${chalk.yellow(msg)}`),
};