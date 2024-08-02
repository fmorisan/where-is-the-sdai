import { bridges, chains } from "@/config/chains";
import { useEffect, useState } from "react";
import { parseAbi } from "viem";
import { readContract } from "viem/actions";
import { useClient } from "wagmi";

export interface ChainData {
    name: string;
    sdai: bigint;
    dai: bigint;
    mkr: bigint;
}

const SDAI_ABI = parseAbi([
    "function balanceOf(address guy) public view returns (uint256)",
])
const SDAI_ADDRESS: `0x${string}` = "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
const DAI_ADDRESS: `0x${string}` = "0x6b175474e89094c44da98b954eedeac495271d0f"
const MKR_ADDRESS: `0x${string}` = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"

export default function useChainData() {
    const [chainData, setChainData] = useState<ChainData[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const client = useClient()

    useEffect(() => {
        let sdaiBalanceMap: Record<`0x${string}`, bigint> = {}
        let daiBalanceMap: Record<`0x${string}`, bigint> = {}
        let mkrBalanceMap: Record<`0x${string}`, bigint> = {}
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
                        sdaiBalanceMap[bridgeAddress] = data
                    }).catch(err => {
                        console.error(err)
                        sdaiBalanceMap[bridgeAddress] = BigInt(0)
                    })
                )
                promises.push(
                    readContract(client, {
                        abi: SDAI_ABI,
                        address: DAI_ADDRESS,
                        functionName: "balanceOf",
                        args: [bridgeAddress]
                    }).then(data => {
                        daiBalanceMap[bridgeAddress] = data
                    }).catch(err => {
                        console.error(err)
                        daiBalanceMap[bridgeAddress] = BigInt(0)
                    })
                )
                promises.push(
                    readContract(client, {
                        abi: SDAI_ABI,
                        address: MKR_ADDRESS,
                        functionName: "balanceOf",
                        args: [bridgeAddress]
                    }).then(data => {
                        mkrBalanceMap[bridgeAddress] = data
                    }).catch(err => {
                        console.error(err)
                        mkrBalanceMap[bridgeAddress] = BigInt(0)
                    })
                )
            }
        }
        Promise.allSettled(promises).then(() => {
            let data: ChainData[] = []
            for (let chain of chains) {
                let sdaiTotal = BigInt(0)
                let daiTotal = BigInt(0)
                let mkrTotal = BigInt(0)
                for (let bridgeAddress of bridges[chain]) {
                    sdaiTotal += sdaiBalanceMap[bridgeAddress]
                    daiTotal += daiBalanceMap[bridgeAddress]
                    mkrTotal += mkrBalanceMap[bridgeAddress]
                }
                data.push({name: chain, sdai: sdaiTotal, dai: daiTotal, mkr: mkrTotal})
            }
            setChainData(data)
            setIsLoading(false)
        })
    }, [])

    return {
        chainData,
        isLoading
    }
}
