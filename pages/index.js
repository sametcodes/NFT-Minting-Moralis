import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import useConnection from '@/hooks/useConnection';
import useContract from '@/hooks/useContract';
import { patikaadress } from "../config.js"
import patikajson from "../artifacts/contracts/Patika.sol/Patika.json"
import axios from 'axios';

export default function Home() {
    const apiKey = process.env.NEXT_PUBLIC_PUBLICAPI_KEY;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageURL, setImageURL] = useState("");

    const [nfts, setNfts] = useState([]);

    const connection = useConnection();
    const contract = useContract(patikaadress, patikajson.abi)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadArray = [{
            path: `${name}.json`,
            content: {
                name: name,
                description: description,
                imageUrl: imageURL
            }
        }]

        const response = await axios({
            method: 'post',
            url: '/api/upload/metadata',
            data: uploadArray,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        let uri = response.data[0].path;
        console.log(uri)
        await contract.safeMint(uri);
    }


    const handleChange = async (e) => {
        e.preventDefault();

        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = async () => {
                const base64 = reader.result;
                const uploadArray = [{
                    path: `nftimage.png`,
                    content: base64
                }];
                try {
                    const response = await axios({
                        method: 'post',
                        url: '/api/upload/image',
                        data: uploadArray,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data[0].path);
                    setImageURL(response.data[0].path);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            };
        }
    };

    const getNfts = async () => {
        const nftCount = await contract.totalSupply();
        let nfts = [];
        for (let i = 0; i < nftCount; i++) {
            let uri = await contract.tokenURI(i);
            let data = await axios.get(uri);
            console.log(uri)
            console.log(data)
            const owner = await contract.ownerOf(i);
            console.log(owner);
            let item = {
                name: data.data.name,
                description: data.data.description,
                imageURL: data.data.imageUrl,
                owner: owner
            }
            console.log(item)
            nfts.push(item);
        }
        setNfts(nfts);
        console.log(nftCount)
    }

    useEffect(() => {
        connection.connect();
        if (connection.address) {
            getNfts();
        }
    }, [connection.address])

    return (
        <div className={styles.home} >
            <form onSubmit={handleSubmit} className={styles.nftForm}  >
                <input type={"text"} onChange={(e) => setName(e.target.value)} className={styles.textBox} placeholder="name" />
                <input type={"text"} onChange={(e) => setDescription(e.target.value)} className={styles.textBox} placeholder="description" />
                <input type={"file"} onChange={handleChange} />
                <button type='submit'>MINT</button>
            </form>
            <div className={styles.nftList}>{nfts?.map((e, i) => (
                <div className={styles.nftCard} key={i}  >
                    <h1 key={i}>{e.name}</h1>
                    <img src={e.imageURL} width={"200px"} />
                    <p>{e.description}</p>
                    <p>{e.owner}</p>
                </div>
            ))
            }</div>
        </div >
    )
}
