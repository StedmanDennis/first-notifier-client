'use client'

import { PropsWithChildren } from "react"

export default function ResourceTableActionColumn({ children }: PropsWithChildren) {
    return (
        <div className="grid grid-flow-row gap-1 sm:grid-flow-col">
            {children}
        </div>
    )
}