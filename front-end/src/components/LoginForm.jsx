import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, TextField } from '@mui/material'

import Notification from './Notification'

const LoginForm = (props) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async event => {
    event.preventDefault()

    props.handleLogin({
      username: username,
      password: password
    })

    navigate('/')
    setUsername('')
    setPassword('')
  }

  const cancelLogin = async event => {
    navigate('/')
    setUsername('')
    setPassword('')
  }

  const button = {
    margin: 10
  }

  return (
    <Box component='form' onSubmit={login} >
      <h3>Login Page</h3>
      {props.notification && <Notification notification={props.notification} messageType={props.messageType} />}
      {/* <form onSubmit={login}> */}
        <div>
          <TextField
            id='filled-required'
            autoComplete='off'
            required
            size='small'
            label='username'
            value={username}
            variant='filled'
            onChange={event => setUsername(event.target.value)}
            style={{ marginBottom: 10 }}
          />
        </div>
        <div>
          <TextField
            id='filled-required'
            autoComplete='off'
            required
            size='small'
            label='password'
            value={password}
            variant='filled'
            type='password'
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <Button onClick={cancelLogin} variant='outlined'>
          cancel
        </Button>
        <Button type='submit' variant='contained' style={button}>
          login
        </Button>
      {/* </form> */}
    </Box>
  )
}

export default LoginForm