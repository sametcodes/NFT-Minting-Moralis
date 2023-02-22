import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const useWeb3 = (contractAddress, contractAbi) => {
    const [address, setAddress] = useState("")
    const [isConnecting, setIsConnecting] = useState(true);
    const [chainId, setChainId] = useState(undefined);

    let provider, signer;
    if (typeof window !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner();
    }
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const connect = async () => {
        const [account] = await provider.send("eth_requestAccounts", []);
        contract.attach(account);
        setAddress(account);
        setIsConnecting(false);
    }

    const getCurrentNetworkAndAccount = useCallback(async () => {
        const network = await provider.getNetwork();
        const [account] = await provider.send("eth_accounts", []);
        if (!account || !network) return;

        contract.attach(account);
        setAddress(account);
        setChainId(network.chainId);
        setIsConnecting(false);
    }, [connect])

    const changeAccount = useCallback(() => {
        provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
    }, []);

    useEffect(() => {
        getCurrentNetworkAndAccount();

        window.ethereum.on('accountsChanged', (accounts) => {
            setAddress(accounts[0]);
            contract.attach(accounts[0]);
        });

        window.ethereum.on('chainChanged', (chainId) => {
            // see https://chainid.network to find out all the chain IDs
            // or https://chainid.network/chains.json
            setChainId(Number(chainId));
        });

        return () => {
            if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && typeof window.ethereum.off === 'function') {
                window.ethereum.off('accountsChanged');
                window.ethereum.off('chainChanged');
            }
        }
    }, []);

    return {
        wallet: {
            address,
            changeAccount,
            connect,
            isConnecting,
            chainId
        },
        contract
    };
}

export default useWeb3;