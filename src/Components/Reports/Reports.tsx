import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import 'chart.js/auto'
import Header from '../Layout/LayoutComponents/Header'
import { properties } from '../Utils/MeassageProperties'
import styled from '@emotion/styled'
import { ServiceAreaData } from '../CommonComponent/MetaDataComponent/MetaDataApi'
import { MetaData } from '../../Type/CommonType'
import { useSelector } from 'react-redux'
import { selectCustomerId } from '../../Store/Slice/userSlice'
import WorkOrders from '../Moorserve/WorkOrders/workOrders'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useGetJobTypeMutation } from '../../Services/MetaDataApi'
import { ErrorResponse, WorkOrderResponse } from '../../Type/ApiTypes'
import { useGetJobLocationMutation } from '../../Services/Report/Reports'

Chart.register(ArcElement, Tooltip, Legend)

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  margin: 20px 15px;
  flex-wrap: wrap;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const ChartCard = styled.div`
 borderRadius: '5px',
 border: '1px solid #D5E1EA',
  backgroundColor: '#FFFFFF',
  marginRight: '50px',
  width: '700px',
  height: '500px',
  text-align: center;
  transition: transform 0.2s;
  margin: 10px;
  &:hover {
    transform: translateY(-10px);
  }

  h2 {
    margin-bottom: -20px;
    font-size: 1.5rem;
    color: #333;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`

const Report: React.FC = () => {
  const selectedCustomerId = useSelector(selectCustomerId)
  const [serviceAreaSelected, setServiceAreaSelected] = useState(false)
  const [jobTypeSelected, setJobTypeSelected] = useState(false)
  const [serviceArea, setServiceArea] = useState<MetaData[]>([])
  const [jobType, setJobType] = useState<MetaData[]>([])
  const workOrdersRef = useRef<HTMLDivElement>(null)
  const [getJobType] = useGetJobTypeMutation()
  const [getJobLocation] = useGetJobLocationMutation()

  const getJobTypeData = useCallback(async () => {
    // setIsLoading(true)
    try {
      const response = await getJobType({}).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200 && Array.isArray(content)) {
        setJobType(content)
        // setWorkOrderData(content)
        // setIsLoading(false)
        // setTotalRecords(totalSize)
      } else {
        // setIsLoading(false)
        // toast?.current?.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: message,
        //   life: 3000,
        // })
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      // setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [selectedCustomerId])

  const getJobLocationData = useCallback(async () => {
    // setIsLoading(true)
    try {
      const response = await getJobLocation({}).unwrap()
      const { status, content, message, totalSize } = response as WorkOrderResponse
      if (status === 200 && Array.isArray(content)) {
        setServiceArea(content)
        // setWorkOrderData(content)
        // setIsLoading(false)
        // setTotalRecords(totalSize)
      } else {
        // setIsLoading(false)
        // toast?.current?.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: message,
        //   life: 3000,
        // })
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      // setIsLoading(false)
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [selectedCustomerId])

  useEffect(() => {
    getJobTypeData()
    getJobLocationData()
  }, [selectedCustomerId])

  useEffect(() => {
    if (jobTypeSelected && workOrdersRef.current) {
      workOrdersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [jobTypeSelected])

  const getTotal = (data: MetaData[]) => {
    return data.reduce((acc, item) => acc + item.id, 0)
  }

  const jobTypeData: ChartData<'pie'> = {
    labels: jobType.map((item) => item?.type),
    datasets: [
      {
        label: 'Job Type',
        data: jobType.map((item) => item.id),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const serviceAreaData: ChartData<'pie'> = {
    labels: serviceArea.map((item) => item?.jobLocation),
    datasets: [
      {
        label: 'Service Area',
        data: serviceArea.map((item) => item.id),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const { label, raw } = tooltipItem
            const total = getTotal(jobType)
            // const percentage = ((raw / total) * 100).toFixed(2)
            return `${label}: ${40}%`
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const label = jobType[index]?.type
        setJobTypeSelected(true)
        setServiceAreaSelected(true)
      }
    },
  }

  return (
    <>
      <Header header={properties.reportHeader} />
      <div className="mt-6">
        <div className="flex justify-end mr-[54px]">
          <div className="flex gap-4 items-center">
            <div
              className="flex-auto"
              style={{
                position: 'relative',
                border: '1px solid #D5E1EA',
                borderRadius: '5px',
                display: 'flex',
                gap: '8px',
                padding: '8px',
              }}></div>
          </div>
        </div>

        <div className="flex lg:flex-row justify-around md:flex-col mt-3">
          <div
            style={{
              width: '700px',
              height: '400px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5E1EA',
              borderRadius: '5px',
              marginLeft: '3rem',
            }}>
            <div data-testid="technician-data" className="flex flex-col mt-[3px] table-container ">
              <ChartsContainer>
                <ChartCard>
                  <h2 className="ml-12">Job Type</h2>
                  <Pie data={jobTypeData} options={chartOptions} />
                </ChartCard>
              </ChartsContainer>
            </div>
          </div>

          <div
            className={`md:ml-12 md:mt-3 lg:mt-0`}
            style={{
              flexGrow: 1,
              borderRadius: '5px',
              border: '1px solid #D5E1EA',
              backgroundColor: '#FFFFFF',
              marginRight: '50px',
              width: '700px',
              height: '400px',
            }}>
            <div data-testid="workOrder" className="flex flex-col mt-[3px] table-container ">
              <div className="flex-grow ">
                <ChartsContainer>
                  <ChartCard>
                    <h2 className="ml-8">Service Area</h2>
                    <Pie data={serviceAreaData} options={chartOptions} />
                  </ChartCard>
                </ChartsContainer>
              </div>
            </div>
          </div>
        </div>

        {jobTypeSelected && (
          <div ref={workOrdersRef}>
            <WorkOrders report={true} />
          </div>
        )}
      </div>
    </>
  )
}

export default Report
