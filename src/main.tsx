import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HistoricalDataProvider } from './contexts/HistoricalDataContext'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <HistoricalDataProvider>
            <App />
        </HistoricalDataProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
