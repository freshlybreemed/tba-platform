if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const withLess = require('@zeit/next-less'),
  nextConfig = {
    target: 'serverless',
    env: {
      weatherApi: '',
      mapBoxApi: 'pk.xx.x',
      stripey:"xx",
      STRIPE_CLIENT_DEV:"xx",
      DOMAIN:"tbaevents.auth0.com",
      GUEST_PASS_KEY:"xx",
      CLIENTID:"xx",
      STRIPE_SECRET_DEV:"xx",
      STRIPE_SECRET_PROD:"xx",
      Access_Key_ID:"xx",
      Secret_Access_Key:"xx/xxx"
    },
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60,
      pagesBufferLength: 5
    },
    lessLoaderOptions: {
      javascriptEnabled: true
    },
    webpack: config => config,
    

  };

module.exports = withLess(nextConfig);
