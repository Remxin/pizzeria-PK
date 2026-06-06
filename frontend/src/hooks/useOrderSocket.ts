import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  addOrderToList,
  updateOrderInLists,
} from '../features/orders/ordersSlice'
import { connectSocket, getSocket } from '../services/socket.service'
import type { Order, OrderStatus } from '../types/order.types'

interface OrderStatusChangedPayload {
  orderId: number
  status: OrderStatus
  order: Order
}

export function useOrderSocket() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    connectSocket()
    const socket = getSocket()

    const handleOrderCreated = (order: Order) => {
      if (user?.role === 'EMPLOYEE' || user?.role === 'ADMIN') {
        dispatch(addOrderToList(order))
      }
    }

    const handleStatusChanged = (payload: OrderStatusChangedPayload) => {
      dispatch(updateOrderInLists(payload.order))
    }

    socket.on('order:created', handleOrderCreated)
    socket.on('order:statusChanged', handleStatusChanged)

    return () => {
      socket.off('order:created', handleOrderCreated)
      socket.off('order:statusChanged', handleStatusChanged)
    }
  }, [dispatch, isAuthenticated, user?.role])
}
