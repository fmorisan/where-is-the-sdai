import { bridges, chains, legend } from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useReadContracts } from "wagmi";
import { formatEther, parseAbi } from "viem";
import { ChainData } from "@/hooks/chainData";
import useHistoricalForChain, { Direction } from "@/hooks/historicalForChain";
import { Line, LineChart } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ChainCardProps {
    chainData: ChainData
}

export function ChainCardWithData(props: ChainCardProps) {
    let title: string = props.chainData.name
    const bridgeAddresses = bridges[props.chainData.name]
    let {data: sdaiData, direction: sdaiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "sdai"})
    let {data: daiData, direction: daiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "dai"})


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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Token</TableHead>
                    <TableHead className="w-[200px]">Current</TableHead>
                    <TableHead>Graph</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-bold">dai</TableCell>
                    <TableCell>
                        {formatter.format(Number(props.chainData.dai / BigInt(1e16)) / 100)}
                    </TableCell>
                    <TableCell>
                        <LineChart width={100} height={30} data={daiData.map(d => ({amt: Number(formatEther(d))}))}>
                            <Line type="monotone" dataKey="amt" dot={false} stroke={daiDirection == Direction.UP? "#00ff00": "#ff0000"} />
                        </LineChart>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-bold">sdai</TableCell>
                    <TableCell>
                        {formatter.format(Number(props.chainData.sdai / BigInt(1e16)) / 100 )}
                    </TableCell>
                    <TableCell>
                        <LineChart width={100} height={30} data={sdaiData.map(d => ({amt: Number(formatEther(d))}))}>
                            <Line type="monotone" dataKey="amt" dot={false} stroke={sdaiDirection == Direction.UP? "#00ff00": "#ff0000"} />
                        </LineChart>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </CardContent>
    </Card>
}
