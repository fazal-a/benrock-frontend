export const setRecentChat = (data) => {
  return {
    type: 'Set_Recent_Chat',
    payload: data,
  }
}

export const setContents = (data) => {
  return {
    type: 'Set_Contents',
    payload: data,
  }
}
