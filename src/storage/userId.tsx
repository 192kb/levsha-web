const sessionStorageUserId = 'user_id';

export const storeUserId = (userId: string) =>
  sessionStorage.setItem(sessionStorageUserId, userId);

export const getUserIdFromStorage = () =>
  sessionStorage.getItem(sessionStorageUserId);
