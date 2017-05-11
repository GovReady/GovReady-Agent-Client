// Init config
let config = {};

// CMS specific
if(window.govready) {
  config = window.govready;
  if(config.application === 'wordpress') {
    configCmsSettings('wordpress');
    configCmsPaths('wordpress'); 
  }
  else {
    configCmsSettings();
    configCmsPaths(); 
  }
}
else if(window.Drupal && window.Drupal.settings.govready) {
  config = window.Drupal.settings.govready;
  configCmsSettings('drupal');
  configCmsPaths('drupal'); 
}

// Assign common props
config.dateFormat = 'MMMM Do YYYY';
// Current client url
config.clientUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
// Callback for logout
config.authUrl = 'https://govready.auth0.com/';
config.logoutUrl = `${config.authUrl}v2/logout?returnTo=' + encodeURIComponent(config.clientUrl)`;

// @TODO change site
export function configChangeSite(siteId) {
  // Active siteId
  config.siteId = siteId;
}

// @TODO change site
export function configChangeMode(mode) {
  // Mode of site 
  // standalone, agent, local, remote
  config.mode = mode;
}

// Switches CMS language fragments
export function configCmsSettings(cms, url = '') {
  config.siteUrl = url;
  if(cms === 'wordpress') {
    config.cms = 'wordpress';
    config.pluginText = 'Plugin';
    config.cmsNice = 'Wordpress';
    config.pluginUrl = 'https://wordpress.org/plugins/';
  }
  else if(cms === 'drupal') {
    config.cms = 'drupal';
    config.pluginText = 'Module';
    config.cmsNice = 'Drupal';
    config.pluginUrl = 'https://drupal.org/project/';
  }
}

// Switches CMS endpoints
export function configCmsPaths(cms) {
  // WP
  if(cms === 'wordpress') {
    let url = '/wp-admin/admin-ajax.php?';
    if(process.env.NODE_ENV === 'development') {
      url = 'http://localhost:8080/wp-admin/admin-ajax.php?';
    }
    config.apiUrl = url + 'action=govready_proxy&endpoint=/sites/' + config.siteId + '/';
    config.apiUrlNoSite = url + 'action=govready_proxy&endpoint=';
    config.apiTrigger = url + 'action=govready_v1_trigger';
  }
  // Drupal
  else if(cms === 'drupal') {
    let url = '/govready/api?';
    config.apiTrigger = '/govready/trigger?endpoint=/sites/' + config.siteId + '/';
    if(process.env.NODE_ENV === 'development') {
      url = 'http://govready.local/govready/api?';
      config.apiTrigger = 'http://govready.local/govready/trigger?endpoint=/sites/' + config.siteId + '/';
    }
    config.apiUrl = url + 'action=govready_proxy&endpoint=/sites/' + config.siteId + '/';
    config.apiUrlNoSite = url + 'action=govready_proxy&endpoint=';
  }
  // Agent + Standalone
  else {
    let url = 'https://plugin.govready.com/v1.0';
    config.apiUrl = url + '/sites/' + config.siteId + '/';
    config.apiUrlNoSite = url;
  }
}

// Updates CMS token
export function configUpdateNonce(nonce) {
  config.govready_nonce = nonce;
}

export default config;