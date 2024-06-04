export const setFile = (file) => ({
  type: 'SET_FILE',
  payload: file,
})
export const setFileLoading = (payload) => {
  return {
    type: 'SET_LOADING',
    payload: payload,
  }
}
