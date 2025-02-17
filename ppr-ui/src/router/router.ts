import Vue from 'vue'
import VueRouter from 'vue-router'
import {PositionResult, Route} from "vue-router/types/router"
import routes from './routes'
import authHelper from '@/utils/auth-helper'
import {inject, provide} from "@vue/composition-api"

Vue.use(VueRouter)

export const RouterSymbol = Symbol()

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(): PositionResult {
    // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
    return {x: 0, y: 0}
  }
})

const ENABLED = false

// if there is no saved Keycloak token, redirect to Auth URL
router.afterEach((to): void => {
  if (ENABLED) {
    try {
      console.debug('Router afterEach', to.matched)
      if (to.matched.some((record): boolean => record.meta.requiresAuth)) {
        authHelper.authRedirect()
      }
    } catch (error) {
      console.error('Router afterEach', error)
    }
  }
})

export function provideRouter(): void {
  provide(RouterSymbol, router)
}

export function useRouter(): {route: Route; router: VueRouter} {
  const router: VueRouter = inject(RouterSymbol) as VueRouter
  if (!router) {
    throw Error("Router cannot be injected, has not been provided")
  }
  const route: Route = router.currentRoute
  return { route, router }
}

export default router
