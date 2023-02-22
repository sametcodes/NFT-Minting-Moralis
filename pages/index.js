import Form from "@/components/form";
import Layout from "@/components/layout";
import useWeb3 from "@/hooks/useWeb3";
import { useState } from "react";

import { patikaadress } from "@/config.js";
import patikajson from "@/artifacts/contracts/Patika.sol/Patika.json";
import NFTList from "@/components/nftlist";

export default function Home() {
    const { contract, wallet } = useWeb3(patikaadress, patikajson.abi);
    const [totalSupply, setTotalSupply] = useState(0);

    if (!wallet.address) {
        return <Layout wallet={wallet}>
            <div>Connect your wallet to use the application.</div>
        </Layout>
    }

    return <div>
        <Layout wallet={wallet}>
            <Form contract={contract} wallet={wallet} setTotalSupply={setTotalSupply} />

            <NFTList contract={contract} wallet={wallet} setTotalSupply={setTotalSupply} totalSupply={totalSupply} />
        </Layout>
    </div>
}
