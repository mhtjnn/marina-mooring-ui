export const formatDate = (date: any) => {
    if (!date) return null
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return `${month}/${day}/${year}`
  }

  export const parseDate = (dateString: any) => {
    if (!dateString) return null
    const [month, day, year] = dateString?.split('/')
    return new Date(year, month - 1, day)
  }
  
  export const handleFocus = () => {
    const errorFields = document.querySelectorAll('.error')
    if (errorFields.length > 0) {
      errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      const passwordMessage = document.getElementById('mooring')
      if (passwordMessage) {
        passwordMessage.style.display = 'block'
        passwordMessage.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }


  