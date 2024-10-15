import React from 'react'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'
import { GoArrowUpRight, GoArrowDown, GoArrowDownLeft, GoArrowDownRight } from 'react-icons/go'
import { StatCardProps } from '../../Type/ComponentBasedType'

const StatCard: React.FC<StatCardProps> = ({ items }) => {
  const color1 = items[0].percentage < 0 ? 'red' : '#01BF2E'
  const color2 = 'rgba(255, 255, 255, 0)'

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <div className="font-[400] text-[#10293A] text-[24px]">{items[0].title}</div>
        <div className="text-gray-600 text-lg flex gap-3">
          <h1
            className={`text-[2rem] font-bold ${items[0].percentage < 0 ? 'text-red-500' : 'text-[#01BF2E]'}`}>
            {items[0].percentage}%
          </h1>
          {items[0].percentage < 0 ? (
            <GoArrowDownRight style={{ color: 'red', fontSize: '2rem' }} />
          ) : (
            <GoArrowUpRight style={{ color: '#01BF2E', fontSize: '2rem' }} />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <div className="font-extrabold text-[3rem]" style={{ color: '##10293A' }}>
          {items[0].count}
        </div>
        <div style={{ width: '50%', height: 100 }}>
          <ResponsiveContainer>
            <AreaChart
              data={
                items[0].percentage < 0
                  ? [{ value: 0 }, { value: -100 }]
                  : [{ value: 1 }, { value: 100 }]
              }
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={'abc'} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={items[0].percentage < 0 ? 'red' : '#01BF2E'}
                    stopOpacity={0.4}
                  />
                  <stop offset="75%" stopColor="rgba(255, 255, 255, 0)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={items[0].percentage < 0 ? 'red' : '#01BF2E'}
                activeDot={{ r: 8 }}
                fill="url(#abc)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StatCard
