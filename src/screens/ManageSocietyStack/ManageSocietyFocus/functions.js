import {db} from '../../../assets/Firebase/Firebase';
import {DateFuncs} from '../../../assets/Date';
import {getUsers} from '../../../assets/Firebase/functions';

export const ManageSocietyFuncs = {
  getAllSocietyMembers: async function (
    campusKey = String,
    societyID = String,
  ) {
    return getUsers(memberUids);
  },
};
