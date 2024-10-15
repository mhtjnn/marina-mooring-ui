// ContactModal.tsx
import { useState } from 'react'
import { ContactModalProps } from '../../../Type/ComponentBasedType'
import InputComponent from '../../CommonComponent/InputComponent'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import TextAreaComponent from '../../CommonComponent/TextAreaComponent'

const ContactModal: React.FC<ContactModalProps> = ({ onHide, onSendEmail }) => {
  const [emailDetails, setEmailDetails] = useState({
    recipient: '',
    subject: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailDetails({ ...emailDetails, recipient: event.target.value })
  }

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailDetails({ ...emailDetails, subject: event.target.value })
  }

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailDetails({ ...emailDetails, message: event.target.value })
  }

  const handleSendEmail = () => {
    onSendEmail(emailDetails) // Pass email details to parent component
    onHide()
  }

  return (
    // <div>
    //   <h2>Contact Customer</h2>
    //   <label>
    //     Recipient:
    //     <input type="text" value={emailDetails.recipient} onChange={handleRecipientChange} />
    //   </label>
    //   <label>
    //     Subject:
    //     <input type="text" value={emailDetails.subject} onChange={handleSubjectChange} />
    //   </label>
    //   <label>
    //     Message:
    //     <textarea value={emailDetails.message} onChange={handleMessageChange} />
    //   </label>
    //   <button onClick={handleSendEmail}>Send Email</button>
    //   <button onClick={onHide}>Cancel</button>
    // </div>

    <div style={{ backgroundColor: '' }}>
      {/* right */}

      <div className="">
        <div className="flex gap-6">
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Recipient

              </div>
            </span>
            <div className="mt-2">
              <InputComponent
                // value={firstName}
                // placeholder='John Doe'
                // onChange={(e) => handleInputChangeCustomer('firstName', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="firstName">
                {fieldErrors.firstName && (
                  <small className="p-error">{fieldErrors.firstName}</small>
                )}
              </p>
            </div>
          </div>

          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Subject
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <InputComponent
                // value={firstName}
                // onChange={(e) => handleInputChangeCustomer('firstName', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="firstName">
                {fieldErrors.firstName && (
                  <small className="p-error">{fieldErrors.firstName}</small>
                )}
              </p>
            </div>


          </div>
          <div>
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Email
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <InputComponent
                // value={firstName}
                // onChange={(e) => handleInputChangeCustomer('firstName', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="firstName">
                {fieldErrors.firstName && (
                  <small className="p-error">{fieldErrors.firstName}</small>
                )}
              </p>
            </div>
          </div>

        </div>

        <div className="flex gap-6">
          <div className="mt-4">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Phone
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <InputComponent
                // value={email}
                // placeholder='Enter your Card Number'
                // onChange={(e) => handleInputChangeCustomer('email', e.target.value)}
                style={{
                  width: '230px',
                  height: '32px',
                  border: fieldErrors ? '1px solid #D5E1EA' : '',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }}
              />
              <p className="" id="phone">
                {fieldErrors.phone && <small className="p-error">{fieldErrors.phone}</small>}
              </p>
            </div>
          </div>


        </div>

        <div className="flex gap-6">
          <div className="mt-4">
            <span className="font-medium text-sm text-[#000000]">
              <div className="flex gap-1">
                Message
                <p className="text-red-600">*</p>
              </div>
            </span>
            <div className="mt-2">
              <textarea
                // value={email}
                // placeholder='Enter your Card Number'
                // onChange={(e) => handleInputChangeCustomer('email', e.target.value)}
                style={{
                  width: '750px',
                  height: '80px',
                  border: fieldErrors ? '1px solid #D5E1EA' : '',
                  borderRadius: '0.50rem',
                  fontSize: '0.8rem',
                  paddingLeft: '0.5rem',
                }} />
              <p className="" id="phone">
                {fieldErrors.phone && <small className="p-error">{fieldErrors.phone}</small>}
              </p>
            </div>
          </div>


        </div>
        {/* <div className="flex gap-6 ml-1 mt-10">
          <Button
            className='w-42 h-12 rounded-md text-sm'
            label='SUBMIT'
            raised
          />
          <Button
            className='rounded-md text-sm w-42 h-12 '
            label="CANCEL" severity="danger" text raised />

        </div> */}


      </div>
    </div>









  )
}

export default ContactModal
