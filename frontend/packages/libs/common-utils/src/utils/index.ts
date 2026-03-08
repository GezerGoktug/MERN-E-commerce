export const isEmptyString = (txt: string) => txt.trim().length === 0; 

export const cloudinaryImageOptimizer = (url:string) => url.replace("/upload/","/upload/f_auto,q_auto/");