export function useFile() {
  const downloadFileUtil = (data: string, type: string, fileName: string = '') => {
    const url = window.URL.createObjectURL(new Blob([data], { type }))
    const link = document.createElement('a')

    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (res) => {
        resolve(res.target?.result as string)
      }
      reader.onerror = (err) => {
        reject(err)
      }
    })
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        resolve(res.target?.result as string)
      }
      reader.onerror = (err) => {
        reject(err)
      }
    })
  }

  return {
    downloadFileUtil,
    readFileAsText,
    readFileAsDataURL,
  }
}
