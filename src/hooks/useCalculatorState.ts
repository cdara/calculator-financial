import { useState, useCallback } from 'react'
import type { CalculatorInput } from '../types'

export function useCalculatorState<T extends Record<keyof T, CalculatorInput>>(
  initialState: T
) {
  const [state, setState] = useState<T>(initialState)

  const updateField = useCallback((field: keyof T, value: string) => {
    setState((prev) => {
      const fieldKey = field as string
      return {
        ...prev,
        [fieldKey]: { value, error: undefined } as T[keyof T],
      }
    })
  }, [])

  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setState((prev) => {
      const newState = { ...prev }
      Object.entries(errors).forEach(([field, error]) => {
        if (field in newState) {
          newState[field as keyof T] = {
            ...newState[field as keyof T],
            error,
          } as T[keyof T]
        }
      })
      return newState
    })
  }, [])

  const clearErrors = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((key) => {
        const fieldKey = key as keyof T
        newState[fieldKey] = { value: newState[fieldKey].value, error: undefined } as T[keyof T]
      })
      return newState
    })
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [initialState])

  return {
    state,
    updateField,
    setErrors,
    clearErrors,
    reset,
  }
}
