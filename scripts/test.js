const hre = require("hardhat");
const fs = require('fs')
const config = require("../config.js")

async function main() {
    console.log(config.patikaadress)
    const patikaContract = await ethers.getContractAt("Patika", config.patikaadress);
    const balance = await patikaContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log(balance);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
