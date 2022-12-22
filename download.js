const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// read sandboxAssets.json
const data = fs.readFileSync(path.join(__dirname, "sandboxAssets.json"));
const assets = JSON.parse(data);

// for each object in assets
// download i.gltf and i.image
// save them both to ./assets/i.id (opensea unique id)

async function download() {
  console.log(assets.length);
  for (const asset of assets) {
    if (!asset.gltf || !asset.image) continue;
    try {
      const gltf = await fetch(asset.gltf);
      const image = await fetch(asset.image);
      const gltfBuffer = await gltf.buffer();
      const imageBuffer = await image.buffer();
      // remove slashes from name an replace spaces with underscores
      const name = asset.name.replace(/\//g, "").replace(/ /g, "_");

      // create directory if it doesn't exist
      if (!fs.existsSync(path.join(__dirname, "assets", `${asset.id}`))) {
        fs.mkdirSync(path.join(__dirname, "assets", `${asset.id}`));
        fs.writeFileSync(
          path.join(__dirname, "assets", `${asset.id}`, `${name}.gltf`),
          gltfBuffer
        );
        fs.writeFileSync(
          path.join(__dirname, "assets", `${asset.id}`, `${name}.png`),
          imageBuffer
        );
        console.log(`Downloaded ${name}`);
      } else {
        console.log(`${name} already exists`);
      }
    } catch (e) {
      console.log(e);
      continue;
    }
  }
}

download();
