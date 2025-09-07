const glob = require("glob");
const fs = require("fs");
const path = require("path");

const orderedFiles = [
  "src/litegraph.js",
  "src/Nodes/utils.js",
  ...glob
    .sync("src/**/*.js")
    .filter((f) => !["src\\litegraph.js", "src\\Nodes\\utils.js"].includes(f)),
];
const outputFile = "dist/bundle.min.js";

orderedFiles.map((e)=>console.log(e));

if (!fs.existsSync("./dist")){
  fs.mkdirSync("./dist");
}

fs.writeFileSync(
  outputFile,
  orderedFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n")
);
console.log(`Bundled ${orderedFiles.length} files → ${outputFile}`);
