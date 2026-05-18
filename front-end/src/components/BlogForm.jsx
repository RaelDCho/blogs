import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog, username }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    // stop form from submitting and thus refreshing page
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url,
      user: username,
    })

    cleanUp() // might have to move this to app component
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

  return (
    <Box style={box}>
      <h3>Create a New Blog</h3>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            required
            size='small'
            style={{ marginBottom: 10 }}
            value={title}
            variant='outlined'
            onChange={event => setTitle(event.target.value)} />
        </div>
        <div>
          <TextField
            label='author'
            required
            size='small'
            style={{ marginBottom: 10 }}
            value={author}
            variant='outlined'
            onChange={event => setAuthor(event.target.value)} />
        </div>
        <div>
          <TextField
            label='url'
            required
            size='small'
            style={{ marginBottom: 10 }}
            value={url}
            variant='outlined'
            onChange={event => setUrl(event.target.value)} />
        </div>
        <Button variant='outlined' style={{ margin: 5 }} onClick={cleanUp}>cancel</Button>
        <Button variant='contained' style={{ margin: 5 }} type='submit'>create</Button>
      </form>
    </Box>
  )
}

export default BlogForm