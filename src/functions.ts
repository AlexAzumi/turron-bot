interface UserData {
  /**
   * UUID of the user
   */
  id: string;
  /**
   * Name of the user
   */
  name: string;
}
/**
 * Gets the string of user samples
 * @param users - sample of users online in the server
 * @param  size - Amount of samples that will be shown
 */
export const getUserSample = (users: UserData[], size: number) => {
  if (!users || !users.length) {
    return 'None';
  }

  let samplesInText = '';
  const sampleToUse = users.slice(0, size);

  sampleToUse.forEach((user) => {
    if (!samplesInText) {
      samplesInText = user.name;
    } else {
      samplesInText += `, ${user.name}`;
    }
  });

  return samplesInText;
};
