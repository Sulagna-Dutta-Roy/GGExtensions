const path = require("path");
const { locales } = require("./translate");
const jsonfile = require("jsonfile");
const parentPath = path.join(__dirname, "../src/app/_locales/");
locales.map((loc) => {
  const _path = path.join(parentPath, `/${loc}/messages.json`);
  const data = {};
  jsonfile.writeFileSync(_path, data, { flag: "w" });
});
