import InputComponent from '../../CommonComponent/InputComponent'
import { useState, useEffect, useCallback } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import CustomStateMap from '../../Map/CustomSelectPositionMap'
import { useAddBoatyardsMutation } from '../../../Services/MoorManage/MoormanageApi'
import { BoatYardProps } from '../../../Type/ComponentBasedType'
import useMetaData from '../../CommonComponent/MetaDataComponent'
import { Country, State } from '../../../Type/CommonType'
import { BoatYardResponse } from '../../../Type/ApiTypes'

const AddBoatyards: React.FC<BoatYardProps> = ({ closeModal, boatYardData, gpsCoordinates }) => {
  const [boatyardId, setBoatyardId] = useState('')
  const [boatyardName, setBoatyardName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [aptSuite, setAptSuite] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState()
  const [zipCode, setZipCode] = useState('')
  const [mainContact, setMainContact] = useState('')
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [addBoatyard] = useAddBoatyardsMutation()
  const { getMetaData } = useMetaData()
  const [countriesData, setCountriesData] = useState<Country[]>()
  const [statesData, setStatesData] = useState<State[]>()

  const style = {
    width: '13vw',
    height: '4vh',
    border: '1px solid gray',
    borderRadius: '0.50rem',
    fontSize: '0.80vw',
  }

  const handlePositionChange = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
  }

  const handleSave = async () => {
    const selectedState = statesData?.find((stateItem) => stateItem.name === state)
    const selectedCountry = countriesData?.find((countryItem) => countryItem.name === country)

    const payload = {
      boatyardId: boatyardId,
      boatyardName: boatyardName,
      phone: phone,
      emailAddress: emailAddress,
      street: address,
      apt: aptSuite,
      zipCode: zipCode,
      contact: mainContact,
      state: selectedState,
      country: selectedCountry,
      gpsCoordinates: gpsCoordinates,
    }
    const response = await addBoatyard({ payload }).unwrap()
    const { status } = response as BoatYardResponse
    if (status === 200) {
      closeModal()
      boatYardData()
    }
  }

  const fetchDataAndUpdate = useCallback(async () => {
    const { countriesData, statesData } = await getMetaData()
    if (countriesData !== null) {
      setCountriesData(countriesData)
    }

    if (statesData !== null) {
      setStatesData(statesData)
    }
  }, [])

  useEffect(() => {
    fetchDataAndUpdate()
  }, [fetchDataAndUpdate])

  return (
    <>
      <div className="w-full h-full  ">
        <h1 className=" text-lg font-bold">Add Boatyard</h1>

        <div className="flex gap-8 mt-3">
          <div>
            <span className="font-semibold text-sm">Boatyard ID</span>
            <div className="mt-2">
              <InputComponent
                value={boatyardId}
                onChange={(e) => setBoatyardId(e.target.value)}
                style={style}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-sm">Boatyard Name</span>
            <div className="mt-2">
              <InputComponent
                value={boatyardName}
                onChange={(e) => setBoatyardName(e.target.value)}
                style={style}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-4">
          <div>
            <div>
              <span className="font-semibold text-sm">Email Address</span>
            </div>

            <div className="mt-2">
              <InputComponent
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                style={style}
              />
            </div>
          </div>

          <div>
            <div>
              <div>
                <span className="font-semibold text-sm">Phone</span>
              </div>
              <div className="mt-2">
                <InputComponent
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={style}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <span className="font-semibold text-sm">Address</span>
        </div>
        <div className="flex gap-8 mt-4">
          <div>
            <div className="mt-2">
              <InputComponent
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street/house"
                style={style}
              />
            </div>
          </div>

          <div className="mt-2">
            <InputComponent placeholder="Apt/Suite" style={style} />
          </div>

          <div className="mt-2">
            <Dropdown
              id="stateDropdown"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              options={statesData}
              optionLabel="name"
              style={style}
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div>
            <div className="mt-2">
              <Dropdown
                id="stateDropdown"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                options={countriesData}
                optionLabel="name"
                style={style}
              />
            </div>
          </div>

          <div>
            <div>
              <div className="mt-2">
                <InputComponent
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip code"
                  style={style}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-4">
          <div>
            <div>
              <span className="font-semibold text-sm">Main Contact</span>
            </div>

            <div>
              <div>
                <div className="mt-2">
                  <InputComponent
                    value={mainContact}
                    onChange={(e) => setMainContact(e.target.value)}
                    style={style}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <CustomStateMap onPositionChange={handlePositionChange} />
          </div>
        </div>

        <div className="flex gap-3 mt-12">
          <Button
            label={'Save'}
            onClick={handleSave}
            style={{
              width: '5vw',
              backgroundColor: 'black',
              cursor: 'pointer',
              fontWeight: 'bolder',
              fontSize: '1vw',
              border: '1px solid  gray',
              color: 'white',
              borderRadius: '0.50rem',
            }}
          />
          <Button
            label={'Back'}
            text={true}
            style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default AddBoatyards
