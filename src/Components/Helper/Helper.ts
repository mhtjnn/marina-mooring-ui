export const convertBytetoUrl = (encryptedBase64: string) => {
  const mimeType = 'application/pdf'

  try {
    const binaryData = atob(encryptedBase64)
    const arrayBuffer = new ArrayBuffer(binaryData.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i)
    }
    const blob = new Blob([uint8Array], { type: mimeType })
    const pdfUrl = URL.createObjectURL(blob)
    return pdfUrl
  } catch (error) {
    console.error('Error parsing decrypted JSON:', error)
    return ''
  }
}
