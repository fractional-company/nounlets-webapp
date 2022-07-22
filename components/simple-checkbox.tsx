import { Switch } from '@headlessui/react'
import classNames from 'classnames'
import { useState } from 'react'

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
          'flex flex-shrink-0 items-center justify-center w-6 h-6 border-2 border-gray-3 rounded-px6',
          {
            '!border-primary': props.isChecked
          },
          props.className
        )}
      >
        <span
          className={`${
            props.isChecked ? 'bg-primary' : 'bg-transparent'
          } block h-4 w-4 rounded-px4`}
        />
      </Switch>
    </div>
  )
}
