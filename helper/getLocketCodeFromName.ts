export default function getLocketCodeFromName(locketName: string | undefined) {
    if (!locketName) return ""
    const name = locketName.toUpperCase()
    if (name.length < 2) return name // Jika nama terlalu pendek, kembalikan apa adanya
    return `${name[0]}${name[name.length - 1]}` // Mengambil huruf pertama dan terakhir
}
