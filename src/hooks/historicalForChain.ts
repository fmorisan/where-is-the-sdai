import { useContext } from "react";
import useHistoricalData from "./historicalData";
import { HistoricalDataProviderContext } from "@/contexts/HistoricalDataContext";
import { bridges } from "@/config/chains";

interface props {
    chain: string,
    token: 'dai' | 'sdai' | 'mkr'
}

export enum Direction {
    UP,
    SAME,
    DOWN
}

function entries<T>(obj: T) {
    return Object.entries(obj) as {[K in keyof T]: [K, T[K]]}[keyof T][]
}

export default function useHistoricalForChain(props: props) {
    const {datapoints} = useContext(HistoricalDataProviderContext)
    const chainBridges = bridges[props.chain]

    const data = datapoints.map(
        dp => {
            const _entries = entries(dp.data[props.token])
            const filtered = _entries
             .filter(
                 kv => {
                     return chainBridges.includes(kv[0])
                 }
            )
            return filtered.reduce(
                (acc, [_, v]) => {
                    return acc + v
                },
                BigInt(0)
            )
        }
    )

    let direction = Direction.SAME

    if (data.at(-1) > data.at(-2)) {
        direction = Direction.UP
    } else if (data.at(-1) > data.at(-2)) {
        direction = Direction.DOWN
    }

    return {data, direction}
}
