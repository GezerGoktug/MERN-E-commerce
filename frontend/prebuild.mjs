import fs from "fs/promises"

let isExistStaticFolder = false

try {
    await fs.access("./packages/static")
    isExistStaticFolder = true;
} catch {
    isExistStaticFolder = false;
}
if (isExistStaticFolder) {
    let isExistDistFolder = false
    try {
        await fs.access("./dist")
        isExistDistFolder = true;
    } catch {
        isExistDistFolder = false;
    }
    if (!isExistDistFolder) {
        await fs.mkdir("./dist")
        await fs.mkdir("./dist/static")
    }
    await fs.cp("./packages/static", "./dist/static", { recursive: true })
}
else {
    console.warn("Static dosyasına erişilemedi")
}