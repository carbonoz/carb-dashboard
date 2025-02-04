import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { FC, ReactElement } from 'react'
import PdfJsWorker from '../../../../node_modules/pdfjs-dist/build/pdf.worker?url'
import pdf from '../../../assets/redex-form/Template.pdf'

interface props {
  className?: string
  file?: Uint8Array
  noDisplay?: boolean
}

const RedexForm: FC<props> = ({ className, file, noDisplay }): ReactElement => {
  return (
    <>
      {noDisplay ? (
        <Worker workerUrl={PdfJsWorker}>
          <div
            className={`${
              className ? className : 'h-[550px] w-[900px]'
            } mx-auto scroll`}
          >
            <Viewer fileUrl={file ? file : pdf} plugins={[]} />
          </div>
        </Worker>
      ) : (
        <>
          <div className='mb-8 p-4 border border-gray-300 rounded mr-8'>
            <h2 className='text-lg font-bold mb-4'>Important Information</h2>
            <p className='mb-2'>
              Please download this form, sign it, and submit it as part of the
              REDEX process. It is an essential step to proceed further. Failure
              to sign and submit the form may result in delays in your REDEX
              submission.
            </p>
          </div>

          <Worker workerUrl={PdfJsWorker}>
            <div
              className={`${
                className ? className : 'h-[550px] w-[900px]'
              } mx-auto scroll`}
            >
              <Viewer fileUrl={file ? file : pdf} plugins={[]} />
            </div>
          </Worker>
        </>
      )}
    </>
  )
}

export default RedexForm
