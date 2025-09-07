const fs = require("fs");

const htmlFile = "src/index.html";
let html = fs.readFileSync(htmlFile, "utf-8");

const env = process.argv[2]

// Remove all <script ...></script> lines
// html = html.replace(/<script.*<\/script>\s*/g, "");
html = html.replace(/<script[\s\S]*?<\/script>\s*/g, "");

// Insert the single bundle.js before </body>
html = html.replace("</body>", '  <script src="bundle.min.js" defer></script>\n</body>');
html = html.replace("</body>", `  <script> const ENV = "${env}" </script> \n</body>`);
// html = html.replace("</body>", '  <script src="https://cdn.jsdelivr.net/npm/elkjs/lib/elk.bundled.js"></script>\n</body>');

// Remove all <link rel="stylesheet" ...> lines
html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>\s*/g, "");

// Insert the single style.min.css before </head>
html = html.replace("</head>", '  <link rel="stylesheet" href="style.min.css">\n</head>');

// Save into dist (pre-minify)
fs.writeFileSync("dist/index.html", html, "utf-8");
console.log("✅ Replaced multiple scripts & styles with bundle.min.js and style.min.css");