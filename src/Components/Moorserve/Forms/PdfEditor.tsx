import React, { useContext, useEffect, useRef, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { convertBytetoUrl } from '../../Helper/Helper'
import { PreviewProps } from '../../../Type/ComponentBasedType'
import { Margin, Resolution, usePDF } from 'react-to-pdf'
import { InputText } from 'primereact/inputtext'
import { FormDataContext } from '../../../Services/ContextApi/FormDataContext'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Chip } from 'primereact/chip'
import { chipValues, headerToPropertyMap } from '../../../Type/CommonType'
import jsPDF from 'jspdf'

const PDFEditor: React.FC<PreviewProps> = ({ fileData, fileName, onClose, mooringResponse }) => {
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [newText, setNewText] = useState('')
  const [textSize, setTextSize] = useState<any>(16)
  const { toPDF, targetRef } = usePDF({
    filename: fileName,
    // canvas: { qualityRatio: 1 },
    // page: { format: 'letter', margin: Margin.MEDIUM },
    resolution: Resolution.NORMAL,
  })
  const [textEntries, setTextEntries] = useState<
    { text: string; x: number; y: number; size: number }[]
  >([])
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<
    { textEntries: { text: string; x: number; y: number; size: number }[] }[]
  >([])
  const [redoStack, setRedoStack] = useState<
    { textEntries: { text: string; x: number; y: number; size: number }[] }[]
  >([])
  const pdfRef = useRef<HTMLDivElement>(null)
  const [showDialog, setShowDialog] = useState(false)
  const { setFormData } = useContext(FormDataContext)
  const handleChipClick = (value: any, header: string) => {
    const propertyPath = headerToPropertyMap[header]
    let result

    if (propertyPath) {
      result = propertyPath.split('.').reduce((acc: any, key: any) => acc && acc[key], value)
      if (result) {
        setNewText(result)
      } else {
        setNewText('')
      }
    } else {
      setNewText('')
      result = 'Property not found'
    }
  }

  useEffect(() => {
    if (fileData) {
      setLoading(true)
      const dummyUrl = convertBytetoUrl(fileData)
      setPdfUrl(dummyUrl)
    }
  }, [fileData])

  useEffect(() => {
    if (pdfUrl) {
      setLoading(false)
    }
  }, [pdfUrl])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pdfRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top + 5
      setClickPosition({ x, y })
      setShowDialog(true)
    }
  }

  const handleAddText = () => {
    if (clickPosition && newText) {
      setHistory([...history, { textEntries: [...textEntries] }])
      setRedoStack([])
      const newEntry = {
        text: newText,
        x: clickPosition.x,
        y: clickPosition.y,
        size: textSize,
      }
      setTextEntries([...textEntries, newEntry])
      setNewText('')
      setTextSize(16)
      setClickPosition(null)
      setShowDialog(false)
    }
  }

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1]
      setRedoStack([...redoStack, { textEntries }])
      setTextEntries(previousState.textEntries)
      setHistory(history.slice(0, history.length - 1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setHistory([...history, { textEntries }])
      setTextEntries(nextState.textEntries)
      setRedoStack(redoStack.slice(0, redoStack.length - 1))
    }
  }

  const handleSave = async () => {
    if (pdfUrl) {
      setLoading(true) // Show loading spinner during the process
      // const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer())
      // const pdfDoc = await PDFDocument.load(existingPdfBytes)

      // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      // const pages = pdfDoc.getPages()

      // textEntries.forEach((entry) => {
      //   pages.forEach((page) => {
      //     const { height: pageHeight } = page.getSize()
      //     if (entry.y <= pageHeight) {
      //       page.drawText(entry.text, {
      //         x: entry.x,
      //         y: entry.y,
      //         size: entry.size,
      //         font: helveticaFont,
      //         color: rgb(0, 0, 0),
      //       })
      //     }

      //     entry.y = entry.y > pageHeight ? entry.y - pageHeight : entry.y
      //   })
      // })

      // toPdf().then((pdf: any) => {
      //   const reader = new FileReader()
      //   reader.readAsDataURL(pdf) // Convert the generated PDF Blob to Base64
      //   reader.onloadend = () => {
      //     const base64data = reader.result // This is the base64 encoded PDF
      //     setBase64Pdf(base64data)
      //     console.log('Base64 PDF: ', base64data) // You can store or send this
      //   }
      // })

      // const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false })
      const wrapperElement = document.getElementById('pdfWrappper')
      if (wrapperElement) {
        wrapperElement.style.height = 'auto'
      }
      toPDF()
        // @ts-expect-error
        .then(async (pdf: any) => {
          // @ts-expect-error
          window.myPdf = pdf
          // Convert to Base64 string for all pages
          const base64Pdf = pdf.output('datauristring')
          // setFormData(base64Pdf.split(',')[1])
          // const reader = new FileReader()
          // reader.readAsDataURL(pdf) // Convert the generated PDF Blob to Base64
          // reader.onloadend = () => {
          //   const base64data: any = reader.result // This is the base64 encoded PDF
          //   setFormData(base64data)
          //   console.log('Base64 PDF: ', base64data) // You can store or send this
          // }
          // Download the PDF if necessary
        })
        .finally(() => {
          setLoading(false)
          if (wrapperElement) {
            wrapperElement.style.height = '100vh'
          }
          onClose()
        })
    }
  }

  const handleDownload = async () => {
    if (pdfUrl) {
      // handleSave({})
      toPDF()

      // const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer())
      // const pdfDoc = await PDFDocument.load(existingPdfBytes)

      // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      // const pages = pdfDoc.getPages()

      // textEntries.forEach((entry) => {
      //   pages.forEach((page) => {
      //     const { height: pageHeight } = page.getSize()

      //     if (entry.y <= pageHeight) {
      //       page.drawText(entry.text, {
      //         x: entry.x,
      //         y: pageHeight - entry.y,
      //         size: entry.size,
      //         font: helveticaFont,
      //         color: rgb(0, 0, 0),
      //       })
      //     }

      //     entry.y = entry.y > pageHeight ? entry.y - pageHeight : entry.y
      //   })
      // })

      // const pdfBytes = await pdfDoc.save()

      // const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      // const link = document.createElement('a')
      // link.href = URL.createObjectURL(blob)
      // link.download = fileName
      // link.click()
    }
  }

  return (
    <Sidebar visible position="right" style={{ width: '50vw' }} onHide={onClose}>
      {loading ? (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="3"
            animationDuration="1.5s"
          />
        </div>
      ) : (
        <>
          <div
            id="pdfWrappper"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              // width: '100vw',
              padding: '20px',
            }}>
            <div
              style={{
                position: 'fixed',
                top: '20px',
                right: '80px',
                bottom: '40px',
                zIndex: 1000,
                height: '40px',
              }}>
              <Button
                label="Save & Download"
                icon="pi pi-check"
                className="p-button-rounded p-button-success"
                onClick={() => handleSave()}
              />
              {/* <Button
                label="Download PDF"
                icon="pi pi-download"
                className="p-button-rounded p-button-info"
                onClick={() => toPDF()}
                style={{ marginLeft: '10px' }}
              /> */}
              <Button
                label="Undo"
                icon="pi pi-undo"
                className="p-button-rounded p-button-secondary"
                onClick={handleUndo}
                style={{ marginLeft: '10px' }}
                disabled={history.length === 0}
              />
              <Button
                label="Redo"
                icon="pi pi-redo"
                className="p-button-rounded p-button-secondary"
                onClick={handleRedo}
                style={{ marginLeft: '10px' }}
                disabled={redoStack.length === 0}
              />
            </div>

            <div ref={targetRef} style={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
              <div ref={pdfRef}>
                <div
                  onClick={handleClick}
                  style={{
                    cursor: 'text',
                    zoom: (window.outerWidth - window.innerWidth) / window.outerWidth,
                  }}>
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={pdfUrl} />
                  </Worker>
                  {textEntries.map((entry, index) => (
                    <span
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${entry.x}px`,
                        top: `calc(${entry.y}px - ${entry.size}px)`,
                        fontSize: `${entry.size}px`,
                        color: 'black',
                        whiteSpace: 'pre-wrap',
                        transform: 'translate(-50%, -50%)',
                      }}>
                      {entry.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Dialog
            header="Enter Text"
            headerStyle={{ cursor: 'alias', color: 'black' }}
            visible={showDialog}
            draggable={false}
            style={{
              width: '700px',
              height: mooringResponse ? '450px' : '300px',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button label="Add" icon="pi pi-check" onClick={handleAddText} />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-secondary"
                  onClick={() => {
                    setShowDialog(false)
                    setNewText('')
                  }}
                />
              </div>
            }
            onHide={() => {
              setShowDialog(false)
              setNewText('')
            }}>
            <div
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <InputText
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter your text"
                  style={{
                    flexGrow: 1,
                    padding: '12px',
                    border: '2px solid #529cd7',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0056b3')}
                  onBlur={(e) => (e.target.style.borderColor = '#007BFF')}
                />
                <InputText
                  value={textSize}
                  type="number"
                  onChange={(e) => setTextSize(parseInt(e.target.value))}
                  placeholder="Font size"
                  style={{
                    width: '70px',
                    padding: '12px',
                    border: '2px solid #529cd7',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0056b3')}
                  onBlur={(e) => (e.target.style.borderColor = '#007BFF')}
                />
              </div>

              {/* Chips Container */}
              {mooringResponse && (
                <div style={{ marginTop: '20px', flexGrow: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {chipValues
                      .filter((header) => {
                        const propertyPath = headerToPropertyMap[header]
                        const value = propertyPath
                          .split('.')
                          .reduce((obj: any, key: any) => obj && obj[key], mooringResponse)
                        return value !== null && value !== undefined && value !== ''
                      })
                      .map((header, index) => (
                        <Chip
                          key={index}
                          label={header}
                          onClick={() => handleChipClick(mooringResponse, header)}
                          style={{
                            backgroundColor: '#529cd7',
                            color: '#ffffff',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            transition: '0.3s',
                            cursor: 'pointer',
                            padding: '8px 12px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2196f3'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#529cd7'
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Dialog>
        </>
      )}
    </Sidebar>
  )
}

export default PDFEditor
