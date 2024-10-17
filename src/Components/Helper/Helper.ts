import { jsPDF } from 'jspdf'
import { ImageChangeProps } from '../../Type/CommonType'

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
export const dataToPdf = (data: any[], toast: any) => {
  if (!Array.isArray(data) || data.length === 0) {
    const message = 'Invalid data provided. Expected an array of objects.'
    toast?.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    })
    return
  }
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Work Orders', 14, 22)
  const headers = [
    'Customer Name',
    'Mooring Number',
    'Boatyard',
    'Assigned To',
    'Due Date',
    'Status',
  ]
  const columnWidths = [40, 40, 30, 30, 30, 50]
  const xStart = 5
  const yStart = 30
  const recordsPerPage = 20
  let yPosition = yStart
  let pageCount = 1
  const addHeaders = () => {
    let xPosition = xStart
    doc.setFontSize(12)
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition)
      xPosition += columnWidths[index]
    })
    yPosition += 5 // Space below headers
  }
  addHeaders()
  yPosition += 5 // Additional space between headers and values
  doc.setFontSize(10)
  data.forEach((item, rowIndex) => {
    let xPosition = xStart
    const row = [
      item?.customerResponseDto?.firstName && item?.customerResponseDto?.lastName
        ? `${item.customerResponseDto.firstName} ${item.customerResponseDto.lastName}`
        : 'N/A',
      item?.mooringResponseDto?.mooringNumber
        ? item.mooringResponseDto.mooringNumber.toString()
        : 'N/A',
      item?.boatyardResponseDto?.boatyardId
        ? item.boatyardResponseDto.boatyardId.toString()
        : 'N/A',
      item?.technicianUserResponseDto?.firstName && item?.technicianUserResponseDto?.lastName
        ? `${item.technicianUserResponseDto.firstName} ${item.technicianUserResponseDto.lastName}`
        : 'N/A',
      item?.dueDate ? item.dueDate.toString() : 'N/A',
      item?.workOrderStatusDto?.status ? item.workOrderStatusDto.status : 'N/A',
    ]
    row.forEach((cell, colIndex) => {
      const textLines = doc.splitTextToSize(cell.toString(), columnWidths[colIndex])
      doc.text(textLines, xPosition, yPosition)
      xPosition += columnWidths[colIndex]
    })
    yPosition += 10
    if ((rowIndex + 1) % recordsPerPage === 0 && rowIndex + 1 < data.length) {
      doc.addPage()
      yPosition = yStart
      addHeaders()
      yPosition += 5 // Space between headers and values for new page
      pageCount += 1
    }
  })
  doc.save('WorkOrders.pdf')
}
export const firstLastName = (data: any) => {
  const firstName = data?.customerResponseDto?.firstName
  const lastName = data?.customerResponseDto?.lastName
  return firstName !== null ? `${firstName} ${lastName}` : '-'
}
export const TechnicianfirstLastName = (data: any) => {
  const firstName = data?.technicianUserResponseDto?.firstName
  const lastName = data?.technicianUserResponseDto?.lastName
  return firstName !== null ? `${firstName} ${lastName}` : '-'
}
export const handleImageChange = async ({
  event,
  toastRef,
  setCustomerImages,
  setimageRequestDtoList,
}: ImageChangeProps) => {
  const fileInput = event.target
  const files = Array.from(fileInput.files || [])
  if (files.length === 0) return
  const { validFiles, invalidTypeFiles, invalidSizeFiles } = validateFiles(files, toastRef, {
    min: 5120,
    max: 5242880,
  })
  if (invalidTypeFiles.length > 0 || invalidSizeFiles.length > 0) {
    fileInput.value = ''
    return
  }
  const newBase64Strings: string[] = []
  const newImageUrls: string[] = []
  const imageRequestDtoList: { imageName: string; imageData: string }[] = []

  for (const file of validFiles) {
    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result?.split(',')[1])
          } else {
            reject(new Error('FileReader result is not a string.'))
          }
        }
        reader.onerror = () => {
          reject(new Error('Error reading file.'))
        }
        reader.readAsDataURL(file)
      })
      newBase64Strings.push(base64String)
      newImageUrls.push(`data:image/png;base64,${base64String}`)
      imageRequestDtoList.push({
        imageName: file.name,
        imageData: base64String,
      })
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  setCustomerImages((prevImages: any) => [...prevImages, ...newImageUrls])
  setimageRequestDtoList(imageRequestDtoList)
}
