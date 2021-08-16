import {rootReducer} from './rootReducer';
import {createStore} from 'redux';

export const Store = createStore(
  rootReducer,
  {
    user: {
      first_name: '',
      last_name: '',
      email: '',
      su_admin: false,
      admin_societies: [],
      joined_societies: [],
      permissions: ['all'],
      campus: [],
      unclaimed_invitations: 0,
      event_count: 0,
    },
    app: {
      campus: {
        societies: [],
        key: 'university_of_buckingham',
        name: 'University of Buckingham',
        colors: {
          extraLight: '#cdeffe',
          light: '#9ee2ff',
          main: '#26b3f0',
        },
      },
      campus_point_system: {},
      darkModeActive: false,
      eventParticipationChange: {
        eventID: '',
        action: 'left' /** left or joined */,
      },
      invitationIDs: [],
      events: {}, // Object with the ids of events as keys, used to keep participation numbers even across app
      societies: {}, // Same as events but for societies
      unreadBubbles: [], // ids of unread bubbles
    },
    event: {
      _loading: false, // If event focus is loading
      // EVENT DATA BELOW
      title: '',
      id: 'Example',
      images: {
        preview: '',
        background: '',
      },
      pricing: {show: false, price: 0, currency: '£'},
      tags: [],
      date: {
        start: new Date(),
        end: new Date(),
        end_ms: Date.now(),
        start_ms: Date.now(),
      },
      description: '',
      repeat: {
        doesRepeat: false,
        interval: 0, // Days
      },
      link: {show: false, url: ''},
      location: {
        latitude: 51.9986,
        longitude: -0.989,
        name: '',
        address: '',
      },
      participants: [],
      number_of_participants: 0,
    },
    blog: {
      blog_content: [],
    },
    editEventFocus: {
      title: '',
      id: 'Example',
      images: {
        preview: '',
        background: '',
      },
      pricing: {show: false, price: 0, currency: '£'},
      tags: [],
      date: {
        start: new Date(),
        end: new Date(),
        end_ms: Date.now(),
        start_ms: Date.now(),
      },
      description: '',
      repeat: {
        doesRepeat: false,
        interval: 0, // Days
      },
      link: {show: false, url: ''},
      location: {
        latitude: 51.9986,
        longitude: -0.989,
        name: '',
        address: '',
      },
      participants: [],
      number_of_participants: 0,
    },
    society: {
      societyFocus: {
        images: {
          logo: '',
          background: '',
        },
        name: '',
        description: '',
        exec_roles: {
          president: {},
          secretary: {},
          social_secretary: {},
          vice_president: {},
        },
        members: [],
        pricing: {show: false, value: ''},
        exec_members: [],
        whatsapp_link: '',
        link: {show: false, url: ''},
        posted_date: Date.now(),
        posted_by: '',
      },
      manageSocietyFocus: {},
      ticketScanEventID: '', // The event that is in focus at the qr scanner
    },
    navigation: {},
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
