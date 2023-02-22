import { Row } from 'reactstrap';
import { useEffect, useState } from "react";
import NFT from '@/components/nft'

const NFTList = ({ contract, wallet, totalSupply, setTotalSupply }) => {

    const getTotalSupply = async () => {
        let total = await contract.totalSupply();
        setTotalSupply(total.toNumber());
    }

    useEffect(() => {
        if (!wallet.address) return;

        getTotalSupply();
    }, [wallet.address]);

    if (!wallet.address) {
        return <div>Connect your wallet to see NFTs</div>
    }

    const nftTokenIds = Array.from({ length: totalSupply }).map(((_, index) => index))
    return <div>
        <h2 style={{margin: "30px 0px"}}>NFT Lists</h2>
        <Row xs="3">
            {nftTokenIds.map((tokenId) => <NFT key={tokenId} {...{ tokenId, contract }} />)}
        </Row>
    </div>
}

export default NFTList;