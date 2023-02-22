import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './style.module.css'

import { Card, CardBody, CardHeader, CardFooter, Col } from 'reactstrap';

const NFT = ({ contract, tokenId }) => {
    const [nft, setNft] = useState({});
    const [loading, setLoading] = useState(true);

    const getNFT = async () => {
        let uri = await contract.tokenURI(tokenId);
        let data = await axios.get(uri);
        const owner = await contract.ownerOf(tokenId);

        setLoading(false);
        setNft({
            name: data.data.name,
            description: data.data.description,
            imageURL: data.data.imageUrl,
            owner: owner
        })
    }

    useEffect(() => {
        getNFT();
    }, [])

    if(loading) return <div>Loading...</div>

    return <Col style={{marginBottom: 25}}>
        <Card>
            <CardHeader>
                {nft.name}
            </CardHeader>
            <CardBody>
                <img className={styles.nftImage} src={nft.imageURL} />
            </CardBody>
            <CardFooter>
                {nft.description}
            </CardFooter>
        </Card>
    </Col>
}

export default NFT;