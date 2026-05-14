import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

describe('<BlogForm />', () => {
  test('<BlogForm /> updates parents state and calls onSubmit', async () => {
    // event handler is a mock function defined with vitest
    const submitForm = vi.fn()
    const username = 'quandingly'

    // a session is started to interact with rendered content
    const user = userEvent.setup()

    render(<BlogForm createBlog={submitForm} username={username} />)

    // inputs
    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')

    const sendButton = screen.getByText('create')

    await user.type(title, '<BlogForm /> updates parents state and calls onSubmit')
    await user.type(author, 'quandingly')
    await user.type(url, 'www.quandingly.com')

    await user.click(sendButton)

    expect(submitForm.mock.calls).toHaveLength(1)
    expect(submitForm.mock.calls[0][0].title).toBe('<BlogForm /> updates parents state and calls onSubmit')
    expect(submitForm.mock.calls[0][0].author).toBe('quandingly')
    expect(submitForm.mock.calls[0][0].url).toBe('www.quandingly.com')
    expect(submitForm.mock.calls[0][0].user).toBe('quandingly')
    console.log(`${JSON.stringify(submitForm.mock.calls[0][0])}`)
  })
})