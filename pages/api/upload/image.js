const Moralis = require("moralis").default;

if (!Moralis.Core.isStarted) {
    const apiKey = process.env.MORALIS_API_KEY;
    if (!apiKey) {
        console.log("Error: MORALIS_API_KEY is not defined in the .env file");
        process.exit(1);
    }
    Moralis.start({ apiKey: apiKey });
}

// nextjs api route
export default async (req, res) => {
    const body = req.body;
    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi: body });
    return res.status(200).json(response)
}