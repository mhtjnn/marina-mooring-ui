import React from 'react'

const MooringInformations: React.FC<any> = ({ mooringRowData }) => {
  console.log('mooring', mooringRowData)

  return (
    <div>
      <hr className="border border-[#000000] my-0 mx-0"></hr>
      <div
        style={{
          fontSize: '14px',
          fontWeight: '300',
          color: '#000000',
        }}
        className="flex leading-[3.50rem] gap-32 p-4">
        <div>
          <p>
            <span>ID: </span> {mooringRowData?.id}
          </p>
          <p>
            <span>Mooring Number: </span>
            {mooringRowData?.mooringNumber}
          </p>
          <p>
            <span>Boat Name: </span>
            {mooringRowData?.boatName}
          </p>
          <p>
            <span>Boatyard: </span> {mooringRowData?.boatyardResponseDto?.boatyardName}
          </p>
          <p>
            <span>Size of Weight: </span>
            {mooringRowData?.sizeOfWeight}
          </p>
          <p>
            <span>Top Chain Condition: </span>
            {mooringRowData?.topChainCondition?.condition}
          </p>
          <p className="tracking-tighter">
            <span>Bottom Chain Condition: </span>
            {mooringRowData?.bottomChainCondition?.condition}
          </p>
          <p>
            <span>Pendant Condition: </span>
            {mooringRowData?.pendantCondition}
          </p>
        </div>
        <div>
          <p>
            <span>Service Area: </span> {mooringRowData?.serviceAreaResponseDto?.serviceAreaName}
          </p>
          <p>
            <span>G.P.S Coordinates: </span>
            {mooringRowData?.gpsCoordinates}
          </p>
          <p>
            <span>Boat Size: </span>
            {mooringRowData?.boatSize}
          </p>
          <p>
            <span>Boat Weight: </span> {mooringRowData?.boatWeight}
          </p>
          <p>
            <span>Type of Weight: </span>
            {mooringRowData?.typeOfWeight?.type}
          </p>
          <p>
            <span>Condition of Eye: </span>
            {mooringRowData?.eyeCondition?.condition}
          </p>
          <p>
            <span>Shackle, Swivel Condition: </span>
            {mooringRowData?.shackleSwivelCondition?.condition}
          </p>
          <p>
            <span>Depth at Mean High Water: </span>
            {mooringRowData?.depthAtMeanHighWater}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MooringInformations
