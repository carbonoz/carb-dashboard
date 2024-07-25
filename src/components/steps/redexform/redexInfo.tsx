import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { FC, ReactElement } from 'react'
import PdfJsWorker from '../../../../node_modules/pdfjs-dist/build/pdf.worker?url'
import pdf from '../../../assets/redex-form/Template.pdf'

interface props {
  className?: string
  file?: Uint8Array
}

const RedexForm: FC<props> = ({ className, file }): ReactElement => {
  return (
    <Worker workerUrl={PdfJsWorker}>
      <div
        className={` ${
          className ? className : 'h-[550px] w-[900px] '
        } mx-auto scroll`}
      >
        <Viewer fileUrl={file ? file : pdf} plugins={[]} />
      </div>
    </Worker>
  )
}

export default RedexForm
