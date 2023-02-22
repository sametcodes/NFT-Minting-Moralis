const hre = require("hardhat");
const fs = require('fs')
require('dotenv').config()

async function main() {
    const Patika = await hre.ethers.getContractFactory("Patika");
    const patika = await Patika.deploy();
    await patika.deployed();
    console.log("Patika contract deployed to: ", patika.address);

    let config = `module.exports = {
        patikaadress : "${patika.address}",
    }
  `
    let data = JSON.stringify(config)
    fs.writeFileSync('config.js', JSON.parse(data))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
