const buildQuery = (params: Record<string, number | string | Array<string | number>>) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
        } else {
            searchParams.append(key, value.toString());
        }
    });

    searchParams.sort();

    return searchParams.toString();
}

export default buildQuery;