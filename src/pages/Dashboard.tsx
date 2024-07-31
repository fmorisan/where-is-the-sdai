import { ChainCard } from "@/components/chain-card";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chains } from "@/config/chains";

export default function Dashboard() {
    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Overview</PageHeaderHeading>
            </PageHeader>
            {chains.map((chain) => <ChainCard chain={chain} />)}
        </>
    )
}
