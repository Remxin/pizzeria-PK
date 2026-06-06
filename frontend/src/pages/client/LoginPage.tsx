import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { BRAND_NAME } from '../../constants/mockData'
import { clearAuthError, loginAsync } from '../../features/auth/authSlice'
import { isValidEmail } from '../../utils/validation'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/menu'

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
        navigate('/admin/dashboard', { replace: true })
        return
      }

      navigate(from, { replace: true })
    }
  }, [isAuthenticated, user, navigate, from])

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!isValidEmail(email)) {
      setFormError('Podaj prawidłowy adres email')
      return
    }

    if (password.length < 8) {
      setFormError('Hasło musi mieć co najmniej 8 znaków')
      return
    }

    await dispatch(loginAsync({ email, password }))
  }

  return (
    <Card
      elevation="level-2"
      padding="lg"
      className="w-full bg-surface-container-lowest border-outline-variant"
    >
      <div className="text-center mb-lg">
        <h1 className="font-headline-md text-headline-md font-bold text-primary mb-xs">
          {BRAND_NAME}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Zaloguj się do swojego konta
        </p>
      </div>

      <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="twoj@email.pl"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label="Hasło"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {(formError || error) && (
          <p className="font-body-sm text-body-sm text-error text-center">
            {formError ?? error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
      </form>

      <div className="text-center mt-lg">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Nie masz konta?
        </p>
        <Link
          to="/register"
          className="inline-block mt-sm font-label-lg text-label-lg text-primary hover:underline underline-offset-2"
        >
          Zarejestruj się
        </Link>
      </div>
    </Card>
  )
}
