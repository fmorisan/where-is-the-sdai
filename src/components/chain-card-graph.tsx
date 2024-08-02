import { bridges, chains} from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { formatEther, parseAbi } from "viem";
import useHistoricalForChain, { Direction } from "@/hooks/historicalForChain";
import { Line, LineChart } from "recharts";

interface ChainCardProps {
    chain: typeof chains[number]
}

export function ChainCardWithGraph(props: ChainCardProps) {
    let title: string = props.chain
    const bridgeAddresses = bridges[props.chain]
    let { direction, data } = useHistoricalForChain({chain: props.chain, token: "dai"})


    if (bridgeAddresses.length === 0) {
        title = `no sources configured for ${props.chain}`
    }

    return <Card className="mb-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <LineChart width={300} height={50} data={data.map(d => ({amt: Number(formatEther(d))}))}>
                <Line type="monotone" dataKey="amt" stroke={direction == Direction.UP? "#00ff00": "#ff0000"} />
            </LineChart>
        </CardContent>
    </Card>
}
