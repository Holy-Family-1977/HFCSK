'use client'

import dynamic from 'next/dynamic'

const PopupModal = dynamic(() => import('@/components/popup-modal'), { ssr: false })
const PreviewFit = dynamic(() => import('@/components/preview-fit'), { ssr: false })

export default function ClientProviders() {
  return (
    <>
      <PopupModal />
      <PreviewFit />
    </>
  )
}
