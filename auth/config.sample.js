'use strict';

module.exports = {
    google: {
      client_id: '773846261332-pggel1tng40ioeqpghcici4gep5tccmq.apps.googleusercontent.com',
      client_secret: 'REDACTED',
      scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
      oauth_url: 'https://accounts.google.com/o/oauth2/v2/auth',  //start auth
      token_url: 'https://accounts.google.com/o/oauth2/token',   //get id_token, access_token, refresh_token token
      refresh_token_url : 'https://www.googleapis.com/oauth2/v4/token',
      token_info_url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',  //validate token
    },
    facebook: { // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
      client_id: '1938013439852171', //CloudApp
      client_secret: 'REDACTED',
      scope: 'public_profile,email',
      oauth_url: 'https://www.facebook.com/v2.8/dialog/oauth',  //start auth
      token_url: 'https://graph.facebook.com/v2.8/oauth/access_token',   //get the token
      //token_info_url: 'graph.facebook.com/debug_token?input_token={token-to-inspect}&access_token={app-token-or-admin-token}',  //validate token
      token_info_url: 'https://graph.facebook.com/debug_token?input_token=',  //validate token
      //https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens
      graph_endpoint: 'https://graph.facebook.com/v2.8/me?fields=email&access_token=',
    },
      microsoft: { //https://msdn.microsoft.com/en-us/library/hh243649.aspx
      client_id: 'gsjhfghjgr43g543hjg5jh34g5j', //CloudApp - https://apps.dev.microsoft.com
      client_secret: 'jsdhfjgjh32gj4gj23j22gf2d4',
      scope: 'wl.basic,wl.sigin', //https://msdn.microsoft.com/en-us/library/hh243646.aspx
      oauth_url: 'https://login.live.com/oauth20_authorize.srf',  //start auth
      token_url: 'https://login.live.com/oauth20_token.srf',   //get the token
      token_info_url: '',  //could not find it
    },
    stage: {
      dev: {
        application_url: 'http://localhost:4200',
        redirect_url: 'https://hphixrnjn2.execute-api.us-east-1.amazonaws.com'
      },
      app: {
        application_url: 'https://vote.frac.io',
        redirect_url: 'https://f9psibjib4.execute-api.us-east-1.amazonaws.com'
      }
    },
}
