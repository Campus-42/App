export function parseFirebaseError(error) {
  error = error.toString();
  if (error.includes('auth/network-request-failed'))
    return "Sadly there's a bad internet connection";
  if (error.includes('auth/user-not-found'))
    return "There's no user with this email";
  else if (error.includes('auth/invalid-email'))
    return 'Hmm, this email looks weird';
  else if (error.includes('auth/email-already-in-use'))
    return 'Looks like this email already has an account';
  else if (error.includes('auth/invalid-password'))
    return "Oops, this password isn't correct";
  else if (error.includes('auth/wrong-password'))
    return "Oops, this password isn't correct";
  else return 'Something unexpected went wrong';
}
