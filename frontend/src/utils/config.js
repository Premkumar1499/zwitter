
const token = JSON.parse(localStorage.getItem('token'))

console.log(token)

export default {
    headers: {
        Authorization: `Bearer ${token}`,
    }
}