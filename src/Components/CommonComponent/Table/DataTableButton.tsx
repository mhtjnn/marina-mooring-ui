import { ButtonProps } from '../../../Type/Components/TableTypes'
import { bgColor, textColors } from '../../Utils/Properties'

const DataTableButton: React.FC<ButtonProps> = ({
  underline = false,
  color = 'black',
  filled = false,
  disabled = false,
  hidden = false,
  onClick,
  label,
}) => {
  let klassName = textColors[color] + ' cursor-pointer'

  if (underline) {
    klassName += ' underline'
  }

  if (filled) {
    klassName += ` ${bgColor[color]}`
  }

  return (
    <button className={klassName} disabled={disabled} hidden={hidden} onClick={onClick}>
      {label}
    </button>
  )
}

export default DataTableButton
