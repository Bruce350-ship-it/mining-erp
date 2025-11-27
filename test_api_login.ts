import { cookies } from 'next/headers'

async function testLogin() {
    const baseUrl = 'http://localhost:3000'

    // 1. Get CSRF Token
    console.log('Fetching CSRF token...')
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`)
    if (!csrfRes.ok) {
        console.error('Failed to fetch CSRF token:', csrfRes.status, csrfRes.statusText)
        return
    }
    const csrfData = await csrfRes.json()
    const csrfToken = csrfData.csrfToken
    console.log('CSRF Token:', csrfToken)

    // Get cookies from response to send back
    const setCookie = csrfRes.headers.get('set-cookie')
    console.log('Set-Cookie:', setCookie)

    // 2. Login
    console.log('Attempting login...')
    const params = new URLSearchParams()
    params.append('email', 'admin@example.com')
    params.append('password', 'ChangeMe123!')
    params.append('csrfToken', csrfToken)
    params.append('json', 'true')

    const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': setCookie || ''
        },
        body: params
    })

    console.log('Login Status:', loginRes.status)
    const text = await loginRes.text()
    console.log('Login Response:', text)
}

testLogin()
