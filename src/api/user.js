import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    mobile:userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'POST'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
