const useConvertToJson = () => {
    const csvToJson = (csvFile: string) => {
        const lines = csvFile.split('\n')
        const headers = lines[0].split(/[;,]/)
        const data = []
        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(/[;,]/)
            if (currentLine.length === headers.length) {
                const obj: any = {}
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j].trim()] = currentLine[j].trim()
                }
                data.push(obj)
            }
        }
        return JSON.stringify(data)
    }

    return {
        csvToJson
    }
}

export default useConvertToJson
