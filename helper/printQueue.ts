import * as Print from "expo-print"
import getLocketCodeFromName from "./getLocketCodeFromName"

const printQueue = async (locketName: string, totalQueue: string) => {
    try {
        const html = `
        <html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <style>
        @media print {
            @page {
                size: 58mm 100mm;
                size: portrait;
                margin: 0;
            }
        }

        body {
            display: flex;
            flex-direction: column;
            gap: 0px;
            align-items: center;
            font-family: 'Poppins', sans-serif;
            margin: 2px;
            text-align: center;
        }

        h3 {
            margin: 0;
            font-size: 20px;
        }

        h1 {
            font-weight: 800;
            font-size: 45px;
            margin: 20px;
        }

        p {
            margin-top: 8px;
            font-size: 10px;
            margin-inline: auto;
            width: 160px;
            text-align: center;
        }

        h2 {
            font-size: 18px;
            width: 190px;
        }

        div {
            padding-block: 20px;
            padding-inline: 30px;
            border: solid 1px black;
        }
    </style>
    <body>
        <div>
            <h2>Dinas Pendidikan Kota Palangka Raya</h2>
            <hr />
            <h3>Nomor</h3>
            <h1>${totalQueue}</h1>
            <h3>Loket ${locketName}</h3>
            <p>Silahkan tunggu sampai giliran anda di panggil. Terima kasih!</p>
        </div>
    </body>
</html>
        `

        const { uri } = await Print.printToFileAsync({
            html: html,
        })

        // Optional: Buka print dialog
        await Print.printAsync({
            uri: uri,
        })

        console.log("Printing completed")
    } catch (error) {
        console.error("Error during printing:", error)
    }
}

export default printQueue
