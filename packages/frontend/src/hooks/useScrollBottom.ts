import { useEffect, useState } from "react"



export const useScrollBottom = () => {

    const [bottom, setBottom] = useState(false)

    function checkIfScrolledToBottom() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setBottom(true)
        }
    }

    useEffect(() => {
        if (bottom) {
            setBottom(false)
        }
    }, [bottom])

    useEffect(() => {
        window.addEventListener('scroll', checkIfScrolledToBottom)

        return () => {
            window.removeEventListener('scroll', checkIfScrolledToBottom)
        }
    }, [])

    return {
        bottom
    }
}