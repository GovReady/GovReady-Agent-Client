// Init config
let config = {};

// CMS specific
if(window.govready) {
  config = window.govready;
  if(config.isWordpress) {
    configCmsLanguage('wordpress');
    configCmsPaths('wordpress'); 
  }
  else {
    configCmsLanguage();
    configCmsPaths(); 
  }
}
else if(window.Drupal && window.Drupal.settings.govready) {
  config = window.Drupal.settings.govready;
  configCmsLanguage('drupal');
  configCmsPaths('drupal'); 
}

// Assign common props
Object.assign(config, {
  dateFormat: 'MMMM Do YYYY' // for use with moment, display
});

// @TODO change site
export function configChangeSite(siteId) {
  config.siteId = siteId;
  return config;
}

// @TODO change site
export function configChangeMode(mode) {
  config.mode = mode;
  return config;
}

// Switches CMS language fragments
export function configCmsLanguage(cms) {
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
  return config;
}

// Switches CMS endpoints
export function configCmsPaths(cms) {
  if(cms === 'wordpress') {
    let url = '/wp-admin/admin-ajax.php?';
    if(process.env.NODE_ENV === 'development') {
      url = 'http://localhost:8080/wp-admin/admin-ajax.php?';
    }
    config.apiUrl = url + 'action=govready_proxy&endpoint=/sites/' + config.siteId + '/';
    config.apiUrlNoSite = url + 'action=govready_proxy&endpoint=';
    config.apiTrigger = url + 'action=govready_v1_trigger';
  }
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