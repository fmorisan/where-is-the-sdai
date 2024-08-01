import { bridges, chains, legend } from "@/config/chains";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useReadContracts } from "wagmi";
import { parseAbi } from "viem";

interface ChainCardProps {
    chain: typeof chains[number];
}

const SDAI_ABI = parseAbi([
    "function balanceOf(address guy) public view returns (uint256)",
])
const SDAI_ADDRESS: `0x${string}` = "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
const DAI_ADDRESS: `0x${string}` = "0x6b175474e89094c44da98b954eedeac495271d0f"
const MKR_ADDRESS: `0x${string}` = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"

export function ChainCard(props: ChainCardProps) {
    const bridgeAddresses = bridges[props.chain] || []
    const legendSpan = legend[props.chain]? <CardDescription>{legend[props.chain]}</CardDescription>: ""
    let title: string = props.chain


    const sdai_data = useReadContracts({
        // @ts-ignore
        contracts: bridgeAddresses.map(
            (address) => ({
                abi: SDAI_ABI,
                address: SDAI_ADDRESS,
                functionName: "balanceOf",
                args: [address]
            })
        ),
    })

    const dai_data = useReadContracts({
        // @ts-ignore
        contracts: bridgeAddresses.map(
            (address) => ({
                abi: SDAI_ABI,
                address: DAI_ADDRESS,
                functionName: "balanceOf",
                args: [address]
            })
        ),
    })

    const mkr_data = useReadContracts({
        // @ts-ignore
        contracts: bridgeAddresses.map(
            (address) => ({
                abi: SDAI_ABI,
                address: MKR_ADDRESS,
                functionName: "balanceOf",
                args: [address]
            })
        ),
    })

    if (! sdai_data.isSuccess ) {
        title = `${props.chain} loading...`
    }

    if (bridgeAddresses.length === 0) {
        title = `no sources configured for ${props.chain}`
    }

    const formatter = Intl.NumberFormat("en-US")
    
    const totalSdaiBalance = (
        (sdai_data.data || []).filter(data => !data.error).reduce((acc, balance) => acc + balance.result!, BigInt(0))
    )
    const totalDaiBalance = (
        (dai_data.data || []).filter(data => !data.error).reduce((acc, balance) => acc + balance.result!, BigInt(0))
    )
    const totalMkrBalance = (
        (mkr_data.data || []).filter(data => !data.error).reduce((acc, balance) => acc + balance.result!, BigInt(0))
    )

    return <Card className="mb-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {legendSpan}
        </CardHeader>
        <CardContent>
            <ul>
                <li>
                    {formatter.format(Number(totalSdaiBalance / BigInt(1e16)) / 100 )} sDAI
                </li>
                <li>
                    {formatter.format(Number(totalDaiBalance / BigInt(1e16)) / 100 )} DAI
                </li>
                <li>
                    {formatter.format(Number(totalMkrBalance / BigInt(1e16)) / 100)} MKR
                </li>
            </ul>
        </CardContent>
    </Card>
}