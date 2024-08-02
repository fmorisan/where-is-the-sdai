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

export default function useHistoricalData({dataPointCount}: {dataPointCount: number}) {
    const [datapointsAsString, setDatapointsAsString] = useState<{time: number, data: HistoricalDataFromFile}[]>([])
    const [datapoints, setDatapoints] = useState<{time: number, data: HistoricalData}[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/historical/times.txt").then(async times => {
           const text = await times.text()
           console.log("times text:", text)
           return Promise.all(
               text.split('\n').slice(-dataPointCount, -1)
                .map(async time => ({
                    time,
                    data: await(await fetch(`/historical/${time}.json`)).json() as HistoricalDataFromFile
                })))
        }).then(datapoints => {
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
                                     console.log('k', k, 'v', v)
                                     return {
                                         ...acc, [k]: (BigInt(v) || BigInt(0))
                                     }
                                 }, {} as BridgesData<bigint>
                             ),

                            sdai: Object.entries(dp.data.sdai)
                             .reduce(
                                 (acc, [k, v]: [`0x${string}`, string]) => {
                                     console.log('k', k, 'v', v)
                                     return {
                                         ...acc, [k]: (BigInt(v) || BigInt(0))
                                     }
                                 }, {} as BridgesData<bigint>
                             ),
                            mkr: Object.entries(dp.data.mkr)
                             .reduce(
                                 (acc, [k, v]: [`0x${string}`, string]) => {
                                     console.log('k', k, 'v', v)
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
        })

    }, [])

    return {
        datapoints,
        datapointsAsString,
        isLoading
    }
}
