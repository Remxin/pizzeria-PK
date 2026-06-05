import { BRAND_NAME } from '../../constants/mockData'

export function Footer() {
  return (
    <footer className="hidden md:block bg-surface-container-low border-t border-outline-variant mt-xl">
      <div className="max-w-container-max mx-auto px-lg py-lg flex justify-between items-center">
        <p className="font-label-lg text-label-lg text-primary font-bold">{BRAND_NAME}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          &copy; {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </div>
    </footer>
  )
}
