import { useEffect } from 'react'
import { loadUserAsync, resetAuth, setTokensFromRefresh } from '../features/auth/authSlice'
import { setSessionExpiredHandler, setTokensRefreshedHandler } from '../services/api'
import { hasStoredSession } from '../utils/authStorage'
import { useAppDispatch, useAppSelector } from '../app/hooks'

export function useAuthInit() {
  const dispatch = useAppDispatch()
  const { isInitialized, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    setTokensRefreshedHandler((tokens) => {
      dispatch(setTokensFromRefresh(tokens))
    })

    setSessionExpiredHandler(() => {
      dispatch(resetAuth())
    })
  }, [dispatch])

  useEffect(() => {
    if (!isInitialized && hasStoredSession()) {
      dispatch(loadUserAsync())
    }
  }, [dispatch, isInitialized])

  return { isInitialized, loading }
}
