import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, TextField } from '@mui/material'

import Notification from './Notification'

const LoginForm = ({ handleLogin }) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async event => {
    event.preventDefault()

    handleLogin({
      username: username,
      password: password
    })

    navigate('/') // stop going to home screen on error
    setUsername('')
    setPassword('')
  }

  const cancelLogin = async event => {
    navigate('/')
    setUsername('')
    setPassword('')
  }

  return (
    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} onSubmit={login} >
      <h3>Login Page</h3>
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
        <Button onClick={cancelLogin} variant='outlined' style={{ margin: 5 }}>
          cancel
        </Button>
        <Button type='submit' variant='contained' style={{ margin: 5 }}>
          login
        </Button>
      {/* </form> */}
    </Box>
  )
}

export default LoginForm