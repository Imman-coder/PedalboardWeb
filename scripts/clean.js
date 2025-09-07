const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "dist");

try {
  if (fs.existsSync(distPath)) {
    console.log("Cleaning dist/...");
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath);
  fs.mkdirSync(path.join(distPath, "images"));
  console.log("dist/ is ready!");
} catch (err) {
  console.error("Error cleaning dist/:", err);
  process.exit(1);
}
