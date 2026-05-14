const Notification = ({ notification, messageType }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className='notification-message' id={messageType ? 'success' : 'error'}>
      <p>{notification}</p>
    </div>
  )
}

export default Notification