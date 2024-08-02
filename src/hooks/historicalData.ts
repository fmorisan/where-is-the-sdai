import { useEffect, useState } from "react"

type BridgesData<T> = Record<`0x${string}`, T>

interface HistoricalDataFromFile {
    sdai: BridgesData<string>,
    dai: BridgesData<string>,
    mkr: BridgesData<string>
}

interface HistoricalData {
    sdai: BridgesData<bigint>,
    dai: BridgesData<bigint>,
    mkr: BridgesData<bigint>
}

function useTimes() {
    const [times, setTimes] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        fetch("./historical/times.txt").then(async req => {
            if (req.status !== 200) {
                setIsError(true)
                return
            }
            let text = await req.text()
            setTimes(text.split('\n').slice(0, -1))
            setIsLoading(false)
        })
    }, [])

    return {
        times,
        isLoading,
        isError
    }
}


export default function useHistoricalData() {
    const [datapointsAsString, setDatapointsAsString] = useState<{time: number, data: HistoricalDataFromFile}[]>([])
    const [datapoints, setDatapoints] = useState<{time: number, data: HistoricalData}[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const { times, isError: timesIsError } = useTimes()


    useEffect(() => {
        if (timesIsError) {
            return
        }

        Promise.all(times.map(async time => ({
            time,
            data: await (await fetch(`./historical/${time}.json`)).json() as HistoricalDataFromFile
        }))).then(datapoints => {
            setDatapointsAsString(
                datapoints.map(dp => ({
                    time: parseInt(dp.time), data: dp.data
                }))
            )
            const dps = datapoints.map(
                dp => {
                    return {
                        time: parseInt(dp.time),
                        data: {
                            dai: Object.entries(dp.data.dai)
                             .reduce(
                                 (acc, [k, v]: [`0x${string}`, string]) => {
                                     return {
                                         ...acc, [k]: (BigInt(v) || BigInt(0))
                                     }
                                 }, {} as BridgesData<bigint>
                             ),

                            sdai: Object.entries(dp.data.sdai)
                             .reduce(
                                 (acc, [k, v]: [`0x${string}`, string]) => {
                                     return {
                                         ...acc, [k]: (BigInt(v) || BigInt(0))
                                     }
                                 }, {} as BridgesData<bigint>
                             ),
                            mkr: Object.entries(dp.data.mkr)
                             .reduce(
                                 (acc, [k, v]: [`0x${string}`, string]) => {
                                     return {
                                         ...acc, [k]: (BigInt(v) || BigInt(0))
                                     }
                                 }, {} as BridgesData<bigint>
                             )
                        }
                    }
                }
            )

            setDatapoints(
                dps
            )

            setIsLoading(false)
        }).catch(err => {
            setIsError(true)
            console.error(err)
        })

    }, [times])

    return {
        datapoints,
        datapointsAsString,
        isLoading,
        isError
    }
}
