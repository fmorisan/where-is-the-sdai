import { ChainCardWithGraph } from "@/components/chain-card-graph";
import { ChainCardWithData } from "@/components/chain-card-with-data";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useChainData, { ChainData } from "@/hooks/chainData";
import { useState } from "react";


export default function Dashboard() {
    const {chainData, isLoading} = useChainData()
    const [ordering, setOrdering] = useState<Exclude<keyof ChainData, "name">>('sdai')

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
            {isLoading?
                [...new Array(15).keys()].map(
                    () => <Skeleton className="w-[100%] h-[200px] mb-4"/>
                )
                : chainData.sort(
                    (a, b) => (a[ordering] - b[ordering]) > 0? -1: 1
                ).map(
                    data => <ChainCardWithData chainData={data} key={data.name} ordering={ordering} />
                )
            }
        </>
    )
}
