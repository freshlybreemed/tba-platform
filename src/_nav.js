export default {
  items: [
    // {
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   icon: 'icon-speedometer',
    //   badge: {
    //     variant: 'info',
    //     text: 'NEW',
    //   },
    // },
    {
      title: true,
      name: 'Manage Events',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Create Event',
      url: '/create',
      icon: 'icon-drop',
    },
    {
      name: 'Manage Events',
      url: '/myevents',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Settings',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Account Information',
      url: '/AccountSettings',
      icon: 'icon-puzzle'
    },
    {
      name: 'Payout',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Payout Methods',
          url: '/payout-settings',
          icon: 'icon-cursor'
        },
        {
          name: 'Add Bank Account',
          url: '/payout-create',
          icon: 'icon-cursor'
        }
      ]
    },
    {
      name: 'Team Members',
      url: '/charts',
      icon: 'icon-pie-chart',
    },

    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Disabled',
      url: '/dashboard',
      icon: 'icon-ban',
      attributes: { disabled: true },
    },
    {
      name: 'Apps',
      url: '/apps',
      icon: 'icon-layers',
      children: [
        {
          name: 'Invoicing',
          url: '/apps/invoicing',
          icon: 'icon-speech',
          children: [
            {
              name: 'Invoice',
              url: '/apps/invoicing/invoice',
              icon: 'icon-speech',
              badge: {
                variant: 'danger',
                text: 'PRO'
              }
            }
          ]
        },
        {
          name: 'Email',
          url: '/apps/email',
          icon: 'icon-speech',
          children: [
            {
              name: 'Inbox',
              url: '/apps/email/inbox',
              icon: 'icon-speech',
              badge: {
                variant: 'danger',
                text: 'PRO',
              },
            },
            {
              name: 'Message',
              url: '/apps/email/message',
              icon: 'icon-speech',
              badge: {
                variant: 'danger',
                text: 'PRO',
              },
            },
            {
              name: 'Compose',
              url: '/apps/email/compose',
              icon: 'icon-speech',
              badge: {
                variant: 'danger',
                text: 'PRO',
              },
            },
          ],
        },
      ]
    },
    {
      divider: true,
      class: 'm-2'
    },
    {
      title: true,
      name: 'Labels'
    },
    {
      name: 'Label danger',
      url: '',
      icon: 'fa fa-circle',
      label: {
        variant: 'danger'
      },
    },
    {
      name: 'Label info',
      url: '',
      icon: 'fa fa-circle',
      label: {
        variant: 'info'
      }
    },
    {
      name: 'Label warning',
      url: '',
      icon: 'fa fa-circle',
      label: {
        variant: 'warning'
      }
    },
  ],
};
