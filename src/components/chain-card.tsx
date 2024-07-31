import { bridges, legend } from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useReadContracts } from "wagmi";
import { formatEther, parseAbi } from "viem";
import { useImperativeHandle, useState } from "react";

interface ChainCardProps {
    chain: string;
}

const SDAI_ABI = parseAbi([
    "function balanceOf(address guy) public view returns (uint256)",
])
const SDAI_ADDRESS: `0x${string}` = "0x83F20F44975D03b1b09e64809B757c47f942BEeA"

export function ChainCard(props: ChainCardProps) {
    const bridgeAddresses = bridges[props.chain] || []
    const legendSpan = legend[props.chain]? <CardDescription>{legend[props.chain]}</CardDescription>: ""

    if (bridgeAddresses.length === 0) {
        return <Card>
            <CardHeader>
                <CardTitle>
                    no sources configured for {props.chain}
                </CardTitle>
                {legendSpan}
            </CardHeader>
        </Card>
    }

    const data = useReadContracts({
        contracts: bridgeAddresses.map((address) => ({ abi: SDAI_ABI, address: SDAI_ADDRESS, functionName: "balanceOf", args: [address] })),
    })
    if (! data.isSuccess ) {
        return <Card>
            <CardHeader>
                <CardTitle>
                    {props.chain} loading...
                </CardTitle>
                {legendSpan}
            </CardHeader>
        </Card>
    }

    const formatter = Intl.NumberFormat("en-US")

    
    const totalBalance = (
        data.data.reduce((acc, balance) => acc + balance.result!, BigInt(0))
    )

    return <Card>
        <CardHeader>
            <CardTitle>{props.chain}</CardTitle>
            {legendSpan}
        </CardHeader>
        <CardContent>
            {formatter.format(Number(formatEther(totalBalance)))} sDAI
        </CardContent>
    </Card>
}