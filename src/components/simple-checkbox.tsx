import { Switch } from '@headlessui/react'
import classNames from 'classnames'
import { useState } from 'react'
import IconCheckmark from "./icons/icon-checkmark";

type ComponentProps = {
  isChecked: boolean
  onChange?: (value: boolean) => void
  className?: string
}

export default function SimpleCheckbox(props: ComponentProps): JSX.Element {
  return (
    <div className="simple-checkbox">
      <Switch
        checked={props.isChecked}
        onChange={(value: boolean) => props?.onChange?.(value)}
        className={classNames(
          'flex flex-shrink-0 items-center justify-center w-5 h-5 border-[3px] border-gray-2 rounded-px6 bg-white',
          {
            '!border-primary': props.isChecked
          },
          props.className
        )}
      >
        <span
          className={`flex items-center ${
            props.isChecked ? 'bg-primary' : 'bg-transparent'
          } block h-4 w-4 rounded-px4`}
        >
            {props.isChecked && <IconCheckmark />}
        </span>
      </Switch>
    </div>
  )
}
