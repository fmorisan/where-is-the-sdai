import { ChainCard } from "@/components/chain-card";
import { ChainCardWithData } from "@/components/chain-card-with-data";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chains } from "@/config/chains";
import useChainData from "@/hooks/chainData";
import { useEffect, useState } from "react";


export default function Dashboard() {
    const {chainData} = useChainData()
    
    useEffect(() => {
             console.log(chainData)
    }, [chainData])

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Overview</PageHeaderHeading>
            </PageHeader>
            {chainData.sort((a, b) => (a.sdai - b.sdai) > 0? -1: 1).map(data => <ChainCardWithData chainData={data} key={data.name} />)}
            {/*chains.map((chain) => <ChainCard chain={chain} key={chain} />)*/}
        </>
    )
}
