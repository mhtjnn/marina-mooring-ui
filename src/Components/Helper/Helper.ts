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

export const validateFiles = (
  files: File[],
  toastRef: any,
  sizeLimits: { min: number; max: number },
): { validFiles: File[]; invalidTypeFiles: File[]; invalidSizeFiles: File[] } => {
  const validFiles = files.filter(
    (file) =>
      file.type.startsWith('image/') && file.size >= sizeLimits.min && file.size <= sizeLimits.max,
  )

  const invalidTypeFiles = files.filter((file) => !file.type.startsWith('image/'))
  const invalidSizeFiles = files.filter(
    (file) => file.size < sizeLimits.min || file.size > sizeLimits.max,
  )

  if (invalidTypeFiles.length > 0) {
    const detailMessage = `Invalid file type. Only image files are allowed.`
    toastRef?.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: detailMessage,
      life: 3000,
    })
  }

  if (invalidSizeFiles.length > 0) {
    const detailMessage = `Invalid file size. Images must be between ${sizeLimits.min / 1024} KB and ${sizeLimits.max / 1024} KB.`
    toastRef?.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: detailMessage,
      life: 3000,
    })
  }

  return { validFiles, invalidTypeFiles, invalidSizeFiles }
}

export const normalizeGpsCoordinates = (gpsCoordinatesValue: string): string => {
  return gpsCoordinatesValue.replaceAll(',', ' ').replace(/\s+/g, ' ').trim()
}

export const formatGpsCoordinates = (gpsCoordinatesValue: any): [number, number] => {
  try {
    gpsCoordinatesValue = normalizeGpsCoordinates(gpsCoordinatesValue)

    let coordinates = gpsCoordinatesValue?.split(' ')

    if (coordinates.length !== 2) {
      coordinates = coordinates.filter((coordinate: any) => coordinate)
    }

    let [lat, long]: any = coordinates

    if (lat?.split('.').length > 2) {
      const [degree, minute, second]: any = lat?.split('.').map((num: any) => parseInt(num))
      lat = degree + minute / 60 + second / 3600
    }

    if (long?.split('.').length > 2) {
      const [degree, minute, second]: any = long?.split('.').map((num: any) => parseInt(num))
      long = degree + minute / 60 + second / 3600
    }

    if (!(isNaN(lat) || isNaN(long))) {
      return [+lat, +long]
    }
  } catch (error) {
    console.log('Error In Setting Center', error)
  }

  // Return default coordinates if there's an error or invalid input
  return [39.4926173, -117.5714859]
}
