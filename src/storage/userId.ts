const sessionStorageUserId = 'user_id';

export const storeUserId = (userId?: string) =>
  userId
    ? sessionStorage.setItem(sessionStorageUserId, userId)
    : sessionStorage.removeItem(sessionStorageUserId);

export const getUserIdFromStorage = () =>
  sessionStorage.getItem(sessionStorageUserId);
