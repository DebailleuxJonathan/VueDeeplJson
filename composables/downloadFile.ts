const useDownloadFile = () => {
    const downloadFile = (json: string) => {
        const data = JSON.stringify(json, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'data.json')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return {
        downloadFile
    }
}

export default useDownloadFile
