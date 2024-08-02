import { ChainCard } from "@/components/chain-card";
import { ChainCardWithData } from "@/components/chain-card-with-data";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chains } from "@/config/chains";
import useChainData, { ChainData } from "@/hooks/chainData";
import useHistoricalData from "@/hooks/historicalData";
import { useEffect, useState } from "react";


export default function Dashboard() {
    const {chainData} = useChainData()
    const [ordering, setOrdering] = useState<Exclude<keyof ChainData, "name">>('sdai')
    const {datapointsAsString: datapoints, isLoading} = useHistoricalData({dataPointCount: 15})

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Overview</PageHeaderHeading>
            </PageHeader>
            <Card className="mb-4">
                <CardHeader><CardTitle>Order by</CardTitle></CardHeader>
                <CardContent>
                    <Button className="mx-1" onClick={() => setOrdering('sdai')}>sDAI</Button>
                    <Button className="mx-1" onClick={() => setOrdering('dai')}>DAI</Button>
                </CardContent>
            </Card>
            {chainData.sort((a, b) => (a[ordering] - b[ordering]) > 0? -1: 1).map(data => <ChainCardWithData chainData={data} key={data.name} />)}
        </>
    )
}
