const { ArgumentParser } = require("argparse");
const { version, displayName, description } = require("../package.json");

const parser = new ArgumentParser({
  description: "Build manifest.json",
});
parser.add_argument("-m", "--manifest", { help: "Version of manifest to generate", choices: ["2", "3"] });

const args = parser.parse_args();

function createBaseManifest() {
  return {
    "manifest_version": 2,
    "name": displayName,
    "description": description,
    "version": version,
    "content_scripts": [
      {
        "matches": ["https://chat.openai.com/chat*"],
        "js": ["content-script.js"],
        "run_at": "document_end"
      }
    ]
  }
}

function createManifestV2() {
  const manifest = createBaseManifest();
  manifest["manifest_version"] = 2;
  manifest["permissions"] = [
    "webRequest",
    "https://html.duckduckgo.com/*"
  ];
  return manifest;
}

function createManifestV3() {
  const manifest = createBaseManifest();
  manifest["manifest_version"] = 3;
  manifest["host_permissions"] = [
    "https://html.duckduckgo.com/*"
  ];
  return manifest;
}

if (args.manifest === "2") {
  console.log(JSON.stringify(createManifestV2(), null, 2));
} else if (args.manifest === "3") {
  console.log(JSON.stringify(createManifestV3(), null, 2));
} else {
  console.error("Invalid manifest version");
  process.exit(1);
}