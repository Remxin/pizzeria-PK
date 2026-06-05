import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { BRAND_NAME } from '../../constants/mockData'

export function RegisterPage() {
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

      <form className="flex flex-col gap-md" onSubmit={(e) => e.preventDefault()}>
        <Input label="Imię i nazwisko" placeholder="Jan Kowalski" />
        <Input label="Email" type="email" placeholder="twoj@email.pl" />
        <Input label="Hasło" type="password" placeholder="••••••••" />
        <Input label="Potwierdź hasło" type="password" placeholder="••••••••" />
        <Input label="Adres dostawy (opcjonalnie)" placeholder="ul. Piekarska 14/2, Kraków" />

        <Button type="submit" fullWidth size="lg" onClick={() => console.log('Register')}>
          Zarejestruj się
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
