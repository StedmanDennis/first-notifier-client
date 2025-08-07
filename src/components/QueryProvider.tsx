'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function QueryProvider({children}:PropsWithChildren){
    const [client, setClient] = useState(new QueryClient())
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}