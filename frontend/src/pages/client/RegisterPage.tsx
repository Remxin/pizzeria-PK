import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { BRAND_NAME } from '../../constants/mockData'
import { clearAuthError, registerAsync } from '../../features/auth/authSlice'
import {
  isValidEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../utils/validation'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/menu', { replace: true })
    }
  }, [isAuthenticated, navigate])

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

    const passwordError = validatePassword(password)
    if (passwordError) {
      setFormError(passwordError)
      return
    }

    const confirmationError = validatePasswordConfirmation(password, confirmPassword)
    if (confirmationError) {
      setFormError(confirmationError)
      return
    }

    await dispatch(
      registerAsync({
        email,
        password,
        fullName: fullName || undefined,
        phone: phone || undefined,
        address: address || undefined,
      }),
    )
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
          Utwórz nowe konto klienta
        </p>
      </div>

      <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
        <Input
          label="Imię i nazwisko"
          placeholder="Jan Kowalski"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
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
        <Input
          label="Potwierdź hasło"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <Input
          label="Telefon (opcjonalnie)"
          placeholder="+48 600 123 456"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <Input
          label="Adres dostawy (opcjonalnie)"
          placeholder="ul. Piekarska 14/2, Kraków"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        {(formError || error) && (
          <p className="font-body-sm text-body-sm text-error text-center">
            {formError ?? error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </Button>
      </form>

      <div className="text-center mt-lg">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Masz już konto?
        </p>
        <Link
          to="/login"
          className="inline-block mt-sm font-label-lg text-label-lg text-primary hover:underline underline-offset-2"
        >
          Zaloguj się
        </Link>
      </div>
    </Card>
  )
}
