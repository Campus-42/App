/**
 * Here under are all resources in relation to testing the application
 * It includes ui components and functions.
 *
 * When testing:
 * 1. The user must go to the create account screen and if they are a campus42 admin, they will
 * see an option for creating a test account. By clicking on this button they will activate the testing mode.
 * 2. If the used already has an account linked to this email, that account will be deleted and its accompanying
 * meta data. For security and performance reaons, only campus42.co.uk emails can create a testing account.
 * 3. The user will receive a verification email and will follow the usual usage for the application.
 * The app will also now show a testing badge in the drawer to notify the user that they are in testing mode.
 *
 * UI components will include:
 * - a switch to enable testing mode
 * - a badge for showing that testing is enabled
 */

import {Funcs} from './functions';
import {UI} from './ui';

export const Testing = {Funcs, UI, available: false};
