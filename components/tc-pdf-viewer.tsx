'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

type Props = {
  fileUrl: string
  className?: string
}

export default function TcPdfViewer({ fileUrl, className }: Props) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [pdfReady, setPdfReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pageWidth, setPageWidth] = useState(800)

  const documentOptions = useMemo(() => ({ withCredentials: false as const }), [])

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  }, [])

  useEffect(() => {
    setNumPages(0)
    setPage(1)
    setPdfReady(false)
    setLoadError(null)
  }, [fileUrl])

  useEffect(() => {
    const update = () =>
      setPageWidth(Math.min(Math.max(window.innerWidth - 48, 280), 900))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const onLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n)
      setPdfReady(true)
      setLoadError(null)
    },
    [],
  )

  const onLoadError = useCallback(() => {
    setPdfReady(false)
    setLoadError(
      'Could not load the PDF preview. Search again to refresh the link.',
    )
  }, [])

  return (
    <div
      className={className}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none' }}
    >
      {loadError ? (
        <p className="text-center text-red-600 py-8">{loadError}</p>
      ) : (
        <>
          <Document
            key={fileUrl}
            file={fileUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            options={documentOptions}
            loading={
              <div className="flex items-center justify-center min-h-[320px] text-gray-500">
                Loading PDF…
              </div>
            }
          >
            {pdfReady && numPages > 0 ? (
              <div className="flex justify-center bg-gray-100 rounded-lg overflow-auto max-h-[70vh]">
                <Page
                  pageNumber={page}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ) : null}
          </Document>

          {pdfReady && numPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {numPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= numPages}
                onClick={() => setPage((p) => Math.min(numPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
