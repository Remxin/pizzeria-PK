import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { BRAND_NAME } from '../../constants/mockData'

export function LoginPage() {
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

      <form className="flex flex-col gap-md" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email"
          type="email"
          placeholder="twoj@email.pl"
          defaultValue="jan.kowalski@email.pl"
        />
        <Input
          label="Hasło"
          type="password"
          placeholder="••••••••"
          defaultValue="password123"
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="font-label-sm text-label-sm text-primary hover:underline"
            onClick={() => console.log('Forgot password')}
          >
            Zapomniałeś hasła?
          </button>
        </div>

        <Button type="submit" fullWidth size="lg" onClick={() => console.log('Login')}>
          Zaloguj się
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

      <div className="mt-md pt-md border-t border-outline-variant">
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center mb-sm">
          Tryb developerski — podgląd panelu admina
        </p>
        <div className="flex gap-sm">
          <Link
            to="/admin/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-sm px-sm py-xs rounded-md border-2 border-secondary text-secondary font-label-sm hover:bg-secondary hover:text-on-secondary transition-colors text-center"
          >
            Admin
          </Link>
          <Link
            to="/menu"
            className="flex-1 inline-flex items-center justify-center gap-sm px-sm py-xs rounded-md text-on-surface-variant font-label-sm hover:bg-surface-container-high transition-colors text-center"
          >
            Menu
          </Link>
        </div>
      </div>
    </Card>
  )
}
