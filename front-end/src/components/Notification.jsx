import { Alert } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

const Notification = ({ notification, messageType }) => {
  if (notification === null) {
    return null
  }

  return (
    // <div className='notification-message' id={messageType ? 'success' : 'error'}>
    //   <p>{notification ? notification.message : ''}</p>
    // </div>
    <Alert icon={<CheckIcon />} severity={notification.type} style={{ margin: 10 }}>
      {notification.text}
    </Alert>
  )
}

export default Notification