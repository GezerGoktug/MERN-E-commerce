
export const getProductionImagePath = (path: string) => window.ENV === "development" ? path : window.APP_NAME.trim().length > 0 ? `/${window.APP_NAME}${path}` : path 