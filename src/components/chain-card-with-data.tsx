import { bridges, chains, legend } from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useReadContracts } from "wagmi";
import { formatEther, parseAbi, parseEther } from "viem";
import { ChainData } from "@/hooks/chainData";
import useHistoricalForChain, { Direction } from "@/hooks/historicalForChain";
import { Line, LineChart, Tooltip, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ChainCardProps {
    chainData: ChainData,
    ordering: ("dai" | "sdai" | "mkr")
}

const UP_COLOR = "#00ff00"
const DOWN_COLOR = "#ff0000"

export function ChainCardWithData(props: ChainCardProps) {
    let title: string = props.chainData.name
    const bridgeAddresses = bridges[props.chainData.name]
    let {data: sdaiData, direction: sdaiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "sdai"})
    let {data: daiData, direction: daiDirection} = useHistoricalForChain({chain: props.chainData.name, token: "dai"})
    let {data: mkrData, direction: mkrDirection} = useHistoricalForChain({chain: props.chainData.name, token: "mkr"})

    if (bridgeAddresses.length === 0) {
        title = `no sources configured for ${props.chainData.name}`
    }

    const formatter = Intl.NumberFormat("en-US")
    const legendSpan = legend[props.chainData.name] || ""

    let sdaiRow = <TableRow>
        <TableCell className="font-bold">sdai</TableCell>
        <TableCell>
            {formatter.format(Number(props.chainData.sdai / BigInt(1e16)) / 100 )}
        </TableCell>
        <TableCell>
            <LineChart width={100} height={30} data={sdaiData.map(d => ({amt: Number(formatEther(d))}))}>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Line type="bump" dataKey="amt" dot={false} stroke={sdaiDirection == Direction.UP? UP_COLOR: DOWN_COLOR} />
            </LineChart>
        </TableCell>
    </TableRow>

    let daiRow = <TableRow>
        <TableCell className="font-bold">dai</TableCell>
        <TableCell>
            {formatter.format(Number(props.chainData.dai / BigInt(1e16)) / 100)}
        </TableCell>
        <TableCell>
            <LineChart width={100} height={30} data={daiData.map(d => ({amt: Number(formatEther(d))}))}>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Line type="bump" dataKey="amt" dot={false} stroke={daiDirection == Direction.UP? UP_COLOR: DOWN_COLOR} />
            </LineChart>
        </TableCell>
    </TableRow>

    let mkrRow = <TableRow>
        <TableCell className="font-bold">mkr</TableCell>
        <TableCell>
            {formatter.format(Number(props.chainData.mkr / BigInt(1e16)) / 100)}
        </TableCell>
        <TableCell>
            <LineChart width={100} height={30} data={mkrData.map(d => ({amt: Number(formatEther(d))}))}>
                <YAxis hide type="number" domain={['dataMin', 'dataMax']} />
                <Line type="bump" dataKey="amt" dot={false} stroke={mkrDirection == Direction.UP? UP_COLOR: DOWN_COLOR} />
            </LineChart>
        </TableCell>
    </TableRow>

    let rows = [
        {name: "dai", amt: props.chainData.dai, row: daiRow},
        {name: "sdai", amt: props.chainData.sdai, row: sdaiRow},
        //{name: "mkr", amt: props.chainData.mkr, row: mkrRow}
    ]

    //rows.sort((a, b) => Number(formatEther(a.amt)) - Number(formatEther(b.amt)))
    rows.sort((a, _) => a.name === props.ordering? -1: 1)

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
                {rows.map(row => row.row)}
            </TableBody>
        </Table>
        </CardContent>
    </Card>
}
