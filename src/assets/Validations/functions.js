export const Validations = {
  validateText: async function (
    input = '',
    maxLength = null,
    minLength = null,
  ) {
    if (typeof input != 'string') return 'This is not a valid string';
    else if (!input.replace(/\s/g, '').length) return 'The text is too short';
    else if (maxLength !== null && input.length > maxLength)
      return 'The text is too long';
    else if (minLength !== null && input.length < minLength)
      return 'The text is too short';
    else return false;
  },
  validateNumber: async function (
    input = 0,
    maxNumber = null,
    minNumber = null,
  ) {
    try {
      input = parseFloat(input);
    } catch {
      return "Looks like it's not a number";
    }

    if (typeof input !== 'number') return "Looks like it's not a number";
    else if (isNaN(input)) return "Looks like it's not a number";
    else if (maxNumber !== null && input > maxNumber)
      return `The number is larger than ${maxNumber}`;
    else if (minNumber !== null && input < minNumber)
      return `The number is smaller than ${minNumer}`;
    else return false;
  },
  validateUrl: async function (input = '') {
    if (typeof input !== 'string') return "This doesn't look like a link";
    else if (!(await validateUrl(input))) return 'This link is not valid';
    else return false;
  },
  validateImage: async function (input = '') {
    if (input === '') return "This doesn't look like an image";
    else return false;
  },
  validateTags: async function (input = []) {
    if (input.length > 3) return "There's more than 3 tags";
    else return false;
  },
  validateDate: async function (input = new Date()) {
    if (typeof input !== 'object') return "Doesn't look like this is a date";
    else return false;
  },
  validateLocation: async function ({latitude, longitude}) {
    console.log(latitude, longitude);
    const ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const ck_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

    const validLat = ck_lat.test(latitude);
    const validLon = ck_lng.test(longitude);

    if (validLat && validLon) {
      return false;
    } else {
      return "This location isn't valid";
    }
  },
  validateRole: async function (
    currentUser = {},
    allExecRoles = [],
    required = false,
  ) {
    if (
      (currentUser.uid == undefined || typeof currentUser.uid !== 'string') &&
      required
    )
      return 'This role is required';
    else if (
      allExecRoles.filter((elem) => elem[1].uid == currentUser.uid).length >
        1 &&
      currentUser.uid !== undefined
    )
      return 'A person can only occupy one role';
    else return false;
  },
};

async function validateUrl(input = '') {
  input = input.replace('http://', 'https://');
  input = !input.includes('https://') ? 'https://' + input : input;
  return fetch(input)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.warn('Invalid url', err);
      return false;
    });
}
