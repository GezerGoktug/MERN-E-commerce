import { useEffect, useRef } from 'react'

const useFirstRenderEffect = (action: () => void) => {
    const firstRenderRef = useRef(false);

    useEffect(() => {
        if (!firstRenderRef.current) {
            action();
            firstRenderRef.current = true;
        }
    }, [firstRenderRef,action])
}

export default useFirstRenderEffect;