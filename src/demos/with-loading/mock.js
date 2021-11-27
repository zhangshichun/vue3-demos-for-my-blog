export const getBirds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...Array(5)].map((t, index) => ({ id: index, name: `t${index}` })))
    }, 1000)
  })
}

export const getCars = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('sorry'))
    }, 1000)
  })
}
