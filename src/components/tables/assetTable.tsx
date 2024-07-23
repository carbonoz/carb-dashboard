/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import { FC, ReactElement } from 'react'
import { assetInt } from '../../lib/api/user/userEndPoints'

interface props {
  data: Array<assetInt> | undefined
  isFetching: boolean
}

const { Column } = Table

const AssetTable: FC<props> = ({ data, isFetching }): ReactElement => {
  return (
    <Table
      className='data_table w-[1030px]'
      dataSource={data}
      rowKey={(record) => {
        return record?.id
      }}
      rowClassName='shadow'
      pagination={false}
      loading={isFetching}
      bordered={false}
      scroll={{ x: 0 }}
    >
      <Column
        title='#'
        key='#'
        render={(text, record, index: number) => (
          <span className='text-gray-500 font-bold'> {index + 1}. </span>
        )}
      />
      <Column
        title='Owner'
        key='assetOwner'
        render={(record: assetInt) => (
          <span className='font-bold  text-blue-500'>{record?.assetOwner}</span>
        )}
      />
      <Column
        title='Name'
        key='assetName'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.assetName}</span>
        )}
      />
      <Column
        title='Fuel type'
        key='fuelType'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.fuelType}</span>
        )}
      />
      <Column
        title='Country'
        key='country'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.country}</span>
        )}
      />
      <Column
        title='Address'
        key='address'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.address}</span>
        )}
      />
      <Column
        title='Latitude'
        key='latitude'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.latitude}</span>
        )}
      />
      <Column
        title='Longitude'
        key='longitude'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.longitude}</span>
        )}
      />
      <Column
        title='Capacity'
        key='capacity'
        render={(record: assetInt) => (
          <span className='font-bold text-blue-500'>{record?.capacity}</span>
        )}
      />
    </Table>
  )
}

export default AssetTable
