import { useState } from "react"

import { Box, Button, TextField } from '@mui/material'
import { BorderStyle } from "@mui/icons-material"

const UserForm = ({ createUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const createAccount = async event => {
    event.preventDefault()

    createUser({
      username: username,
      password: password,
      name: name
    })

    cleanUp()
  }

  const cleanUp = () => {
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const box = {
    display: 'grid',
    border: '2px solid gray',
    borderRadius: 5,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    height: '60dvh',
    width: '70dvh',
    margin: 'auto',
    marginTop: '5%',
    placeItems: 'center'
  }

  return(
    <Box style={box}>
      <h3>Create Account</h3>
      <form onSubmit={createAccount}>
        <div style={{ margin: 5 }}>
          <TextField label='Username'
            required
            value={username}
            onChange={event => setUsername(event.target.value)}/>
        </div>
        <div style={{ margin: 5 }}>
          <TextField label='Password'
            required
            value={password}
            onChange={event => setPassword(event.target.value)}/>
        </div>
        <div style={{ margin: 5 }}>
          <TextField label='Name'
            required
            value={name}
            onChange={event => setName(event.target.value)}/>
        </div>
        <div style={{ margin: 5 }}>
          <Button variant='outlined'
            style={{ marginRight: 5 }}>cancel</Button>
          <Button variant='contained' onClick={cleanUp}>create</Button>
        </div>
      </form>
    </Box>
  )
}

export default UserForm