const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

/*
  COMMANDS
  ---
  npm run test -- --ui
    - ui mode
  npm run test -- --trace on
    - visual trace
  npm run test:report
    - shows a report
  npm test -- --project chromium
    - only run on chrome
  npm test -- -g "login fails with wrong password"
    - specifying which test to run
    - in this case the test with a description of 'login fails with wrong password
  npm test -- -g'one of those can be made nonimportant' --debug
    - for running problematic tests in debug mode
    - await page.pause() - to locate where we want to step through from
*/

describe('Blog app', () => {
  const username = 'playwrighttester123'
  const password = 'password'
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Playwright Tester',
        username: username,
        password: password
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('Login Page')
    await expect(page.getByText('Login Page')).toBeVisible()
  })

  describe('Login', () => {
    test('failed login with incorrect credentials', async ({ page }) => {
      await loginWith(page, 'playwrighttester123', 'thisisnotmypassword')
      await expect(page.getByText('invalid credentials')).toBeVisible()
    })

    test('successful login with correct credentials', async ({ page }) => {
      await loginWith(page, username, password)
      await expect(page.getByText('Welcome, Playwright Tester!')).toBeVisible()
      // await page.getByRole('button', { name: 'logout' }).click()
    })

    describe('When Logged In', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'playwrighttester123', 'password')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'creating a blog through playwright test!', 'playwrighttester123', 'www.playwright.com')
        await expect(page.getByText('creating a blog through playwright test! by playwrighttester123')).toBeVisible()
      })

      describe('Blog Has Been Created', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'creating a blog through playwright test!', 'playwrighttester123', 'www.playwright.com')
          await expect(page.getByText('creating a blog through playwright test! by playwrighttester123')).toBeVisible()
        })

        test('blogs can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: '👍🏻' }).click()
          await expect(page.getByText('likes: 1')).toBeVisible()
        })

        test('delete button can be seen for users\' blogs', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
        })

        test('clicking delete', async ({ page }) => {
          // window.confirm listener
          await page.on('dialog', dialog => {
            expect(dialog.type()).toBe('confirm')
            expect(dialog.message()).toBe('Remove blog: creating a blog through playwright test! by playwrighttester123?')
            dialog.accept()
          })

          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
          await page.getByRole('button', { name: 'delete' }).click()

          await expect(page.getByText('creating a blog through playwright test! by playwrighttester123')).not.toBeVisible()
        })

        describe('Multiple Blogs have been Created', () => {
          beforeEach(async ({ page }) => {
            await createBlog(page, 'testing 2', username, 'www.playwright.com')
            await createBlog(page, 'testing 3', username, 'www.playwright.com')
          })

          // come back to this
          test('blogs are organised according to number of likes', async ({ page }) => {

          })
        })
      })
    })
  })
})