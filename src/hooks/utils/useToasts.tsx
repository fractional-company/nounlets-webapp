import { ErrorToast, InfoToast, SuccessToast } from 'src/components/toasts/CustomToasts'
import toast from 'react-hot-toast'

const toastSuccess = (title: string, message: string, duration?: number) => {
  toast.custom((t) => <SuccessToast t={t} title={title} message={message} />, {
    duration: duration || 5000
  })
}

const toastError = (title: string, message: string, duration?: number) => {
  toast.custom((t) => <ErrorToast t={t} title={title} message={message} />, {
    duration: duration || 5000
  })
}

const toastInfo = (title: string, message: string, duration?: number) => {
  toast.custom((t) => <InfoToast t={t} title={title} message={message} />, {
    duration: duration || 5000
  })
}

export default function useToasts() {
  return {
    toastSuccess,
    toastError,
    toastInfo
  }
}
