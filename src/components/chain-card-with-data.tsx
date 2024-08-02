import { bridges, chains, legend } from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useReadContracts } from "wagmi";
import { parseAbi } from "viem";
import { ChainData } from "@/hooks/chainData";
import useHistoricalForChain, { Direction } from "@/hooks/historicalForChain";

interface ChainCardProps {
    chainData: ChainData
}

export function ChainCardWithData(props: ChainCardProps) {
    let title: string = props.chainData.name
    const bridgeAddresses = bridges[props.chainData.name]
    let {direction: sdaiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "sdai"})
    let {direction: daiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "dai"})


    if (bridgeAddresses.length === 0) {
        title = `no sources configured for ${props.chainData.name}`
    }

    const formatter = Intl.NumberFormat("en-US")
    const legendSpan = legend[props.chainData.name] || ""

    return <Card className="mb-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{legendSpan}</CardDescription>
        </CardHeader>
        <CardContent>
            <ul>
                <li>
                    {formatter.format(Number(props.chainData.sdai / BigInt(1e16)) / 100 )} sDAI {sdaiDirection == Direction.SAME? "⛔": sdaiDirection == Direction.UP? "": "󰁅"}
                </li>
                <li>
                    {formatter.format(Number(props.chainData.dai / BigInt(1e16)) / 100 )} DAI {daiDirection == Direction.SAME? "⛔": daiDirection == Direction.UP? "": "󰁅"}
                </li>
            </ul>
        </CardContent>
    </Card>
}
