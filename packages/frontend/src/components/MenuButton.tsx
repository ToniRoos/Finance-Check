import React from 'react';
import Button from "@mui/material/Button"
import { PropsWithChildren, FunctionComponent } from "react"

export interface MenuProps extends PropsWithChildren {
    routeName: string
    isActive: boolean
    to?: (routeName: string) => void
}

export const MenuButton = (props: MenuProps) => {
    const { isActive, routeName, children, to } = props

    const variant = isActive ? 'outlined' : 'text'

    return (
        <Button color="inherit" variant={variant} onClick={() => to ? to(routeName) : {}}>{children}</Button>
    )
}