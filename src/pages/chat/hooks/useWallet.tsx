import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import { useEffect } from "react";
import { base } from "viem/chains";

const useWallet = () => {

    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    return {connect, connectors, disconnect}
}

export default useWallet