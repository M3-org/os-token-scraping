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
    const res = await fetch(nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.OPENSEA_API_KEY,
      },
    });

    const data = await res.json();
    console.log(nextPage);
    const assets = data.assets;
    for (const asset of assets) {
      metadata.push(asset.animation_original_url);
      console.log(asset);
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
