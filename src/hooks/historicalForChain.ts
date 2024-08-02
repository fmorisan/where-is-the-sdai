import { useContext } from "react";
import useHistoricalData from "./historicalData";
import { HistoricalDataProviderContext } from "@/contexts/HistoricalDataContext";

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
    const chainBridges = props.chain

    const data = datapoints.map(
        dp => entries(dp.data[props.token])
         .filter(
             ([k, _]) => chainBridges.includes(k)
        ).reduce(
            (acc, [_, v]) => {
                return acc + v
            },
            BigInt(0)
        )
    )

    let direction = Direction.SAME

    if (data[-1] > data[-2]) {
        direction = Direction.UP
    } else if (data[-2] > data[-1]) {
        direction = Direction.DOWN
    }

    return {data, direction}
}
