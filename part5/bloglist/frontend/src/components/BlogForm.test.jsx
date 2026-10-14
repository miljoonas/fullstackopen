import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls createBlog', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByRole('textbox', { name: /title/i })
  const authorInput = screen.getByRole('textbox', { name: /author/i })
  const urlInput = screen.getByRole('textbox', { name: /url/i })
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing React')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'https://example.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing React')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com')
})