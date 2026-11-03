import { useAuthStore } from "@/store/authStore"
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
})

let refreshPromise: Promise<void> | null = null

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config

    if (!original) return Promise.reject(error)

    const isAuthRoute = original.url?.includes("/auth/")

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh").then(() => undefined).finally(() => { refreshPromise = null })
        }

        await refreshPromise

        return api(original)
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        useAuthStore.getState().clearUser()
        window.location.replace("/login")
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
