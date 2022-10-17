import classNames from 'classnames'
import IconCheckmark from 'src/components/icons/icon-checkmark'
import IconClose from 'src/components/icons/icon-close'
import toast, { Toast } from 'react-hot-toast'
import IconInfo from "../icons/icon-info";

export function SuccessToast(props: { t: Toast; title: string; message: string }) {
  return (
    <div onClick={() => toast.dismiss(props.t.id)} className="cursor-pointer max-w-[500px]">
      <div
        className={classNames(
          'bg-black text-white rounded-[10px] p-6 px-8',
          props.t.visible ? 'animate-in' : 'animate-out'
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-secondary-green">
              <IconCheckmark className="text-white" />
            </div>
            <p className="font-londrina text-[28px] leading-[32px]">{props.title}</p>
          </div>
          <p className="font-500 text-px20 leading-px28">{props.message}</p>
        </div>
      </div>
    </div>
  )
}

export function ErrorToast(props: { t: Toast; title: string; message: string }) {
  return (
    <div onClick={() => toast.dismiss(props.t.id)} className="cursor-pointer max-w-[500px]">
      <div
        className={classNames(
          'bg-black text-white rounded-[10px] p-6 px-8',
          props.t.visible ? 'animate-in' : 'animate-out'
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-secondary-red">
              <IconClose className="text-white w-3 h-3" />
            </div>
            <p className="font-londrina text-[28px] leading-[32px]">{props.title}</p>
          </div>
          <p className="font-500 text-px20 leading-px28">{props.message}</p>
        </div>
      </div>
    </div>
  )
}


export function InfoToast(props: { t: Toast; title: string; message: string }) {
  return (
    <div onClick={() => toast.dismiss(props.t.id)} className="cursor-pointer max-w-[500px]">
      <div
        className={classNames(
          'bg-black text-white rounded-[10px] p-6 px-8',
          props.t.visible ? 'animate-in' : 'animate-out'
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-secondary-blue">
              <IconInfo className="text-white w-3 h-3" />
            </div>
            <p className="font-londrina text-[28px] leading-[32px]">{props.title}</p>
          </div>
          <p className="font-500 text-px20 leading-px28">{props.message}</p>
        </div>
      </div>
    </div>
  )
}
