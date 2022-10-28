import React from 'react';
import Button from "@mui/material/Button"
import { FC } from "react"

export interface MenuProps {
    routeName: string
    isActive: boolean
    to?: (routeName: string) => void
}

export const MenuButton: FC<MenuProps> = (props) => {
    const { isActive, routeName, children, to } = props

    const variant = isActive ? 'outlined' : 'text'

    return (
        <Button color="inherit" variant={variant} onClick={() => to ? to(routeName) : {}}>{children}</Button>
    )
}