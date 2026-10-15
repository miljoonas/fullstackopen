const { test, expect, beforeEach, describe, defineConfig } = require('@playwright/test')
const { loginWith, newBlog } = require('./helper')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'asdf',
        password: 'asdf'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog app' })).toBeVisible()
  })

  describe('Login', () => {
    test('form is shown', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByLabel('username')).toBeVisible()
      await expect(page.getByLabel('password')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(
        page.getByText('Wrong username or password')
      ).toBeVisible()

      await expect(
        page.getByRole('button', { name: 'logout' })
      ).not.toBeVisible()
    })
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

      await expect(page.getByRole('heading', { name: 'Login' })).not.toBeVisible()

      await expect(page.getByText('Matti Luukkainen logged inlogout')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()

    })

    test('a new blog can be created', async ({ page }) => {
      await newBlog(page, 'test', 'dummy', 'https://test.url')


      // await expect(
      //   page.getByText('a new blog test by dummy added')
      // ).toBeVisible()
      await expect(page.getByText('test - dummy view')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await newBlog(page, 'test2', 'dummy2', 'https://test.url2')

      // await expect(
      //   page.getByText('a new blog test by dummy added')
      // ).toBeVisible()

      const blog = page
        .locator('.blog')
        .filter({ hasText: 'test2 - dummy2' })

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByText('likes 0 like')).toBeVisible()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('likes 1 like')).toBeVisible()
    })

    test('user that created the blog can delete it', async ({ page }) => {
      await newBlog(page, 'test3', 'dummy3', 'https://test.url3')


      const blog = page
        .locator('.blog')
        .filter({ hasText: 'test3 - dummy3' })

      await blog.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => {
        dialog.accept().catch(() => { })
      })
      await page.getByRole('button', { name: 'remove' }).click();
      await page.pause()
      await expect(page.getByText('test3 - dummy3 view')).not.toBeVisible()
    })

    test('only creator sees the delete button', async ({ page }) => {
      await newBlog(page, 'test4', 'dummy4', 'https://test.url4')
      await expect(page.getByText('test4 - dummy4 view')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.pause()
      await loginWith(page, 'asdf', 'asdf')
      await expect(page.getByText('test4 - dummy4 view')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are sorted by likes, descending', async ({ page }) => {
      await newBlog(page, 'blog1', 'author1', 'https://blog1.url')
      await newBlog(page, 'blog2', 'author2', 'https://blog2.url')
      await newBlog(page, 'blog3', 'author3', 'https://blog3.url')

      const blog1 = page.locator('.blog').filter({ hasText: 'blog1 - author1' })
      const blog2 = page.locator('.blog').filter({ hasText: 'blog2 - author2' })
      const blog3 = page.locator('.blog').filter({ hasText: 'blog3 - author3' })

      await blog2.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 1 like')).toBeVisible()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 2 like')).toBeVisible()

      await blog3.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3.getByText('likes 1 like')).toBeVisible()

      const titles = await page.locator('.blog').evaluateAll(
        blogs => blogs.map(blog => blog.querySelector('button')?.parentElement?.textContent)
      )

      expect(titles[0]).toContain('blog2 - author2')
      expect(titles[1]).toContain('blog3 - author3')
      expect(titles[2]).toContain('blog1 - author1')
    })
  })
})