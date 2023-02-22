import { useState } from 'react'
import styles from './style.module.css';

import axios from 'axios';
import { Form, Input, Button } from 'reactstrap';

const FormComponent = ({ contract, setTotalSupply }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(true);

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

        let uri = response.data[0].path;
        try {
            const tx = await contract.safeMint(uri);
            await tx.wait();
            setTotalSupply((totalSupply) => totalSupply + 1);
        } catch (err) {
            console.log(err)
        }

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
                    setSubmitDisabled(false);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            };
        }
    };

    return <div>
        <h2 style={{margin: "30px 0px"}}>Mint a new NFT</h2>
        <Form className={styles.form} onSubmit={handleSubmit}>
            <Input type="text" name="name" placeholder="Name of NFT" onChange={(e) => setName(e.target.value)} />
            <Input type="text" name="description" placeholder="Description of NFT" onChange={(e) => setDescription(e.target.value)} />
            <Input type="file" name="file" onChange={handleChange} />

            <Button type="submit" color="primary" size="lg" style={{ width: "100%" }} disabled={submitDisabled}>Mint</Button>
        </Form>
    </div>
}

export default FormComponent;