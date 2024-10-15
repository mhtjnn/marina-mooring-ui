import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { convertBytetoUrl } from '../../Helper/Helper'
import { PreviewProps } from '../../../Type/ComponentBasedType'

const Preview: React.FC<PreviewProps> = ({ fileData, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const pdfRef = useRef<HTMLDivElement>(null)

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

  return (
    <Sidebar visible position="right" style={{ width: '40vw' }} onHide={onClose}>
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
            style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
            <div ref={pdfRef} style={{ position: 'relative', height: '100%' }}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            </div>
          </div>
        </>
      )}
    </Sidebar>
  )
}

export default Preview
