import { Loading } from 'quasar'

import { t } from '@/locales'
import http from '@/utils/http'

export function fetchAuthingLoginUrl(url) {
  Loading.show({ message: t('sys.toLoginPage') })
  return new Promise((resolve, reject) => {
    http
      .get(`/user/authing`, { url })
      .then(res => {
        resolve(res.data.url)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function fetchTokenByCode(code, url) {
  Loading.show({ message: t('sys.logining') })
  return new Promise((resolve, reject) => {
    http
      .post(`/user/authing`, { code, url })
      .then(res => {
        resolve(res.data.id_token)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function fetchUserInfo() {
  Loading.show({ message: t('sys.gettingUserInfo') })
  return new Promise((resolve, reject) => {
    http
      .get('/user/me')
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function fetchPermissionResource() {
  Loading.show({ message: t('sys.gettingResource') })
  return new Promise((resolve, reject) => {
    http
      .get('/user/resource')
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}
