import { bridges, chains } from "@/config/chains";
import { useEffect, useState } from "react";
import { parseAbi } from "viem";
import { readContract } from "viem/actions";
import { useClient } from "wagmi";

export interface ChainData {
    name: string;
    sdai: bigint;
}

const SDAI_ABI = parseAbi([
    "function balanceOf(address guy) public view returns (uint256)",
])
const SDAI_ADDRESS: `0x${string}` = "0x83F20F44975D03b1b09e64809B757c47f942BEeA"

export default function useChainData() {
    const [chainData, setChainData] = useState<ChainData[]>([])
    const client = useClient()

    useEffect(() => {
        let balanceMap: Record<`0x${string}`, bigint> = {}
        let promises = []

        for (let chain of chains) {
            let bridgeAddresses = bridges[chain]
            for (let bridgeAddress of bridgeAddresses) {
                promises.push(
                    readContract(client, {
                        abi: SDAI_ABI,
                        address: SDAI_ADDRESS,
                        functionName: "balanceOf",
                        args: [bridgeAddress]
                    }).then(data => {
                        balanceMap[bridgeAddress] = data
                    }).catch(err => {
                        console.error(err)
                        balanceMap[bridgeAddress] = BigInt(0)
                    })
                )
            }
        }
        Promise.allSettled(promises).then(() => {
            let data: ChainData[] = []
            for (let chain of chains) {
                let total = BigInt(0)
                for (let bridgeAddress of bridges[chain]) {
                    total += balanceMap[bridgeAddress]
                }
                data.push({name: chain, sdai: total})
            }
            setChainData(data)
        })
    }, [])

    return {
        chainData
    }
}
