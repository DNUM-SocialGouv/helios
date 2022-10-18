import { ChangeEventHandler, ReactChild } from 'react'

import styles from './Select.module.css'
import '@gouvfr/dsfr/dist/component/select/select.min.css'

type SelectProps = Readonly<{
  label: ReactChild
  onChange: ChangeEventHandler<HTMLSelectElement>
  options: (number | string)[]
}>

export const Select = ({ label, onChange, options }: SelectProps ) => {
  return (
    <span className={'fr-select-group ' + styles['années']}>
      <label
        className={styles['invisible']}
        htmlFor="select"
      >
        {label}
      </label>
      <select
        className="fr-select"
        id="select"
        name="select"
        onChange={onChange}
      >
        {
          options.map((option) => {
            return (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          })
        }
      </select>
    </span>
  )
}
