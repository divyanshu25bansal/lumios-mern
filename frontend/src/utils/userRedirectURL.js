export const checkUserProfileData = (userData) => {
  return Boolean(
    userData?.firstName &&
    userData?.lastName &&
    userData?.age &&
    userData?.height &&
    userData?.weight,
  );
};

export function UserRedirectURL(user) {
  return checkUserProfileData(user) ? "/dashboard" : "/profile";
}
