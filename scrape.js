require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const ADDRESS = "0xa342f5D851E866E18ff98F351f2c6637f4478dB5"; // Sandbox Assets contract address
const contractEndpoint = `https://api.opensea.io/api/v1/assets?asset_contract_address=${ADDRESS}`;

async function getContractInfo() {
  const metadata = [];
  let nextPage = contractEndpoint;
  let ended = false;

  while (!ended) {
    let res;
    try {
      res = await fetch(nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.OPENSEA_API_KEY,
        },
      });
    } catch (err) {
      console.log(err);
    }

    const data = await res.json();
    console.log(nextPage);
    const assets = data.assets;
    for (const asset of assets) {
      const filtered = {
        name: asset.name,
        description: asset.description,
        image: asset.image_url,
        gltf: asset.animation_url,
        link: asset.permalink,
        tokenId: asset.token_id,
        metadata: asset.token_metadata,
        id: asset.id,
      };
      metadata.push(filtered);
      console.log(filtered);
    }
    nextPage = `${contractEndpoint}&cursor=${data.next}`;
    ended = data.next === null;
  }

  fs.writeFileSync(
    path.join(__dirname, "sandboxAssets.json"),
    JSON.stringify(metadata, null, 2)
  );
}

getContractInfo();
