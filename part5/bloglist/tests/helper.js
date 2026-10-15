const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).first().click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).last().click()
}

const newBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByRole('textbox', { name: 'title:' }).fill(title)
  await page.getByRole('textbox', { name: 'author:' }).fill(author)
  await page.getByRole('textbox', { name: 'url:' }).fill(url)

  await page.getByRole('button', { name: 'create' }).click()
  // await page.getByText(`${title} - ${author} view`)
}

export { loginWith, newBlog }