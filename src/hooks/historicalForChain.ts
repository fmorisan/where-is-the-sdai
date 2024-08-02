import useHistoricalData from "./historicalData";

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
    const {isLoading, datapoints} = useHistoricalData({dataPointCount: 2})
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

    if (!isLoading) {
        if (data[1] > data[0]) {
            direction = Direction.UP
        } else if (data[0] > data[1]) {
            direction = Direction.DOWN
        }
    }

    return {isLoading, data, direction}
}
