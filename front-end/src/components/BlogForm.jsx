import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, TextField } from '@mui/material'

const BlogForm = (props) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    // stop form from submitting and thus refreshing page
    event.preventDefault()

    props.createBlog({
      title: title,
      author: author,
      url: url,
      user: props.username,
    })

    // back to main page
    // navigate('/')

    // // clean up input fields
    // setTitle('')
    // setAuthor('')
    // setUrl('')
    cleanUp()
  }

  const cleanUp = () => {
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
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
    </>
  )
}

export default BlogForm