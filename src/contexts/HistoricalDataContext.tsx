import useHistoricalData from "@/hooks/historicalData"
import { createContext, useEffect, useState } from "react"

export type BridgesData<T> = Record<`0x${string}`, T>

export interface HistoricalDataFromFile {
    sdai: BridgesData<string>,
    dai: BridgesData<string>,
    mkr: BridgesData<string>
}

export interface HistoricalData {
    sdai: BridgesData<bigint>,
    dai: BridgesData<bigint>,
    mkr: BridgesData<bigint>
}

export type HistoricalDataProviderState = {
    datapoints: {time: number, data: HistoricalData}[],
}

const initialState: HistoricalDataProviderState = {
    datapoints: [],
}

export const HistoricalDataProviderContext = createContext<HistoricalDataProviderState>(initialState)

export function HistoricalDataProvider({children, ...props}) {
    const { datapoints } = useHistoricalData()

    return (
        <HistoricalDataProviderContext.Provider {...props} value={{
            datapoints
        }}>
            {children}
        </HistoricalDataProviderContext.Provider>
    )
}
