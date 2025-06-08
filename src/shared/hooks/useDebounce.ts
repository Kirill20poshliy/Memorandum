import { useEffect } from "react";

function useDebounce(delay = 700) {
    let timer: ReturnType<typeof setTimeout>;

    const debouncedFunction = <T extends unknown[]>(
        callback: (...args: T) => void,
        ...args: T
    ) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return debouncedFunction;
}

export default useDebounce;
