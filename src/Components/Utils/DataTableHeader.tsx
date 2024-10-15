import { InputText } from 'primereact/inputtext'

export const CustomersHeader = () => {
  return (
    <div className="flex flex-col">
      <div className="p-input-icon-left">
        <InputText
          placeholder="Search by name, ID, phone no.... "
          style={{
            width: '100%',
            height: '44px',
            padding: '0 4rem 0 3rem',
            border: '1px solid #C5D9E0',
            fontSize: '16px',
            color: '#000000',
            borderRadius: '4px',
            minHeight: '44px',
            fontWeight: 400,
            backgroundColor: 'rgb(242 242 242 / 0%)',
          }}
        />
        <img
          src="/assets/images/Search.svg"
          alt="Search Icon"
          className="p-clickable"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
          }}
        />
      </div>

      <span className="border-[1px] border-[#D5E1EA] w-[31vw] mt-3 "></span>
    </div>
  )
}

export const TechniciansHeader = () => {
  return (
    <div className="flex flex-col">
      <div className="p-input-icon-left">
        <InputText
          placeholder="Search by name, ID, Email, Role, phone no..."
          style={{
            width: '100%',
            height: '44px',
            padding: '0 4rem 0 3rem',
            border: '1px solid #C5D9E0',
            fontSize: '16px',
            color: '#000000',
            borderRadius: '4px',
            minHeight: '44px',
            fontWeight: 400,
            backgroundColor: 'rgb(242 242 242 / 0%)',
          }}
        />
        <img
          src="/assets/images/Search.svg"
          alt="Search Icon"
          className="p-clickable"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
          }}
        />
      </div>

      <span className="border-[1px] border-[#D5E1EA] w-full mt-3 "></span>
    </div>
  )
}

export const MooringsHeader = () => {
  return (
    <div className="flex flex-col">
      <div className="p-input-icon-left">
        <InputText
          placeholder="Search by name, ID, mooring no, boat name, phone no.... "
          style={{
            width: '100%',
            height: '44px',
            padding: '0 4rem 0 3rem',
            border: '1px solid #C5D9E0',
            fontSize: '16px',
            color: '#00426F',
            borderRadius: '4px',
            minHeight: '44px',
            fontWeight: 400,
            backgroundColor: 'rgb(242 242 242 / 0%)',
          }}
        />
        <img
          src="/assets/images/Search.svg"
          alt="Search Icon"
          className="p-clickable"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
          }}
        />
      </div>

      <span className="border-[1px] border-[#D5E1EA] w-full mt-3 "></span>
    </div>
  )
}
