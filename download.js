const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// read sandboxAssets.json
const data = fs.readFileSync(path.join(__dirname, "sandboxAssets.json"));
const assets = JSON.parse(data);

// remove 'ipfs://' from the beginning of each asset
const ipfsAssets = assets.map((asset) => asset.replace("ipfs://", ""));

// if any asset doesn't contain .gltf, remove it
const gltfAssets = ipfsAssets.filter((asset) => asset.includes(".gltf"));

// download through cloudflare gateway
const gateway = "https://ipfs.io/ipfs/";

// download each asset with a 5 second delay
const download = async (asset) => {
  // filename should be everything after the last slash
  const filename = asset.split("/").pop();
  console.log(`Downloading ${filename}`);
  // if file already exists in /assets, skip
  if (fs.existsSync(path.join(__dirname, "assets", filename))) {
    console.log(`Skipping ${asset}`);
    return;
  }
  try {
    const response = await fetch(gateway + asset);
    console.log(`downloading ${filename}`);
    const buffer = await response.buffer();
    console.log(`${buffer.length} bytes downloaded`);
    // save to assets folder
    fs.writeFileSync(path.join(__dirname, "assets", filename), buffer);
    console.log(`Downloaded ${asset}`);
  } catch (err) {
    console.log(err);
  }
};

const downloadAssets = async () => {
  for (const asset of gltfAssets) {
    await download(asset);
  }
};

downloadAssets();
