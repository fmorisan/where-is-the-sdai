import { createClient, createPublicClient, http, parseAbi } from "viem"
import { bridges } from "../config/chains"
import { mainnet } from "viem/chains"
import { readContract } from "viem/actions"
import fs from "fs"

const SDAI_ABI = parseAbi([
    "function balanceOf(address guy) public view returns (uint256)",
])

const SDAI_ADDRESS: `0x${string}` = "0x83F20F44975D03b1b09e64809B757c47f942BEeA"
const DAI_ADDRESS: `0x${string}` = "0x6b175474e89094c44da98b954eedeac495271d0f"
const MKR_ADDRESS: `0x${string}` = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"

const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.ALCHEMY_URL)
})

const bridgeSet = [... new Set(Object.values(bridges).flat())]
const sdaiMapping = {}
const daiMapping = {}
const mkrMapping = {}

Promise.all(bridgeSet.map((bridge: `0x${string}`) => {
    // @ts-ignore
    return readContract(client, {
        abi: SDAI_ABI,
        address: SDAI_ADDRESS,
        functionName: "balanceOf",
        args: [bridge]
    }).then((data: bigint) => {
        sdaiMapping[bridge] = data.toString()
    }).catch(err => {
        console.error(`could not get data for ${bridge}`, err)
    })
})).then(() => {
    console.log(JSON.stringify(sdaiMapping))
    const time = Date.now()
    fs.writeFileSync(`historical/${time.toString()}-sdai.json`, JSON.stringify({dai: sdaiMapping}))
    fs.writeFileSync(`historical/latest-sdai`, time.toString())
})

Promise.all(bridgeSet.map((bridge: `0x${string}`) => {
    // @ts-ignore
    return readContract(client, {
        abi: SDAI_ABI,
        address: DAI_ADDRESS,
        functionName: "balanceOf",
        args: [bridge]
    }).then((data: bigint) => {
        daiMapping[bridge] = data.toString()
    }).catch(err => {
        console.error(`could not get data for ${bridge}`, err)
    })
})).then(() => {
    console.log(JSON.stringify(daiMapping))
    const time = Date.now()
    fs.writeFileSync(`historical/${time.toString()}-dai.json`, JSON.stringify({dai: daiMapping}))
    fs.writeFileSync(`historical/latest-dai.txt`, time.toString())
})

Promise.all(bridgeSet.map((bridge: `0x${string}`) => {
    // @ts-ignore
    return readContract(client, {
        abi: SDAI_ABI,
        address: MKR_ADDRESS,
        functionName: "balanceOf",
        args: [bridge]
    }).then((data: bigint) => {
        mkrMapping[bridge] = data.toString()
    }).catch(err => {
        console.error(`could not get data for ${bridge}`, err)
    })
})).then(() => {
    console.log(JSON.stringify(mkrMapping))
    const time = Date.now()
    fs.writeFileSync(`historical/${time.toString()}-mkr.json`, JSON.stringify({dai: mkrMapping}))
    fs.writeFileSync(`historical/latest-mkr.txt`, time.toString())
})
