import { ErrorToast, SuccessToast } from 'components/toasts/CustomToasts'
import toast from 'react-hot-toast'

export default function useToasts() {
  const toastSuccess = (title: string, message: string) => {
    toast.custom((t) => <SuccessToast t={t} title={title} message={message} />, {
      duration: 3000
    })
  }

  const toastError = (title: string, message: string) => {
    toast.custom((t) => <ErrorToast t={t} title={title} message={message} />, {
      duration: 3000
    })
  }

  return {
    toastSuccess,
    toastError
  }
}
