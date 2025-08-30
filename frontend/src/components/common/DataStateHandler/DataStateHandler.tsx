import { ReactNode } from "react";

interface IDataStateHandlerProps<T> {
    isLoading: boolean;
    isError: boolean;
    data: T[] | undefined;
    loadingFallback: ReactNode;
    errorFallback: ReactNode;
    noContentFallback: ReactNode;
    children: (data: T[]) => ReactNode;
}

const DataStateHandler = <T,>({
    isLoading,
    isError,
    data,
    loadingFallback,
    errorFallback,
    noContentFallback,
    children,
}: IDataStateHandlerProps<T>) => {
    if (isLoading) return <>{loadingFallback}</>;
    if (isError) return <>{errorFallback}</>;
    if (!data || data.length === 0) return <>{noContentFallback}</>;
    return <>{children(data)}</>;
}

export default DataStateHandler