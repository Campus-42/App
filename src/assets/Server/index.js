/**
 * An access to specific functions to the Campus42 server
 *
 * The use for this in comparison to the analytics' access is
 * for non-analytic uses, such as updating bubble copies.
 */

import {db} from '../Firebase/Firebase';

const serverApiKey = 'JBJB732jksnkl68HJH';
var serverUrl = 'http://localhost:8923';

export const Server = {
  copyBubbleDoc: async function (bubble) {
    /**
     * When the user goes into the bubble then this function
     * will take a quick copy of the bubble so that we have
     * a copy on our server for financial purposes (less reads)
     */
    const endpoint = '/bubbles/copy';
    this._sendToServer(endpoint, {bubble});
  },
  reloadUrl: function (url = undefined) {
    /**
     * The url can change dynamically and this function
     * will retrieve the current url from firebase and
     * update the url used
     *
     * NOTE: this function is automatically called with a
     * url as a parameter from the analytics
     */
    if (url) serverUrl = url;
    else
      db.collection('general')
        .doc('server')
        .get()
        .then((doc) => (serverUrl = doc.data().server_url))
        .catch(console.warn);
  },
  _sendToServer: async function (endpoint = undefined, data = undefined) {
    /**
     * Send the data to the server
     * Endpoint and data are REQUIRED
     */
    if (!(typeof endpoint === 'string' && typeof data === 'object')) {
      console.warn('Invalid parameters were passed to sendToServer', arguments);
      return {sent: false, error: 'Invalid parameters'};
    }
    const url = `${serverUrl}${endpoint}?api_key=${serverApiKey}`;

    console.log('Url', url);
    // Passed test and valid parameters
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log('Server response', {res, url});
        return {sent: true, response: res};
      })
      .catch((err) => {
        console.warn('Could not send post request to server', err);
        return {sent: false, error: err};
      });
  },
};
