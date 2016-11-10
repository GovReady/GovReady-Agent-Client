import React, { Component, PropTypes as PT } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import { Link } from 'react-router';
import RefreshButton from 'components/RefreshButton';
import PluginsWidget from './PluginsWidget';
import PluginsPage from './PluginsPage';

class Plugins extends Component {

  static defaultProps = {
    widget: {},
    widgetQuery: {
      url: 'plugins',
      process: (data) => {
        return {
          core: ( data.core && data.core.length ) ? data.core.pop() : {},
          plugins: ( data.plugins && data.plugins.length ) ? data.plugins : []
        }
      } 
    }
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      true
    );
  }

  render () {

    let { widget, widgetName, display } = this.props;
    
    // Return loading if not set
    if(!widget || widget.status !== 'loaded') {
      let errorDisplay = Widget.errorDisplay(widget.status, widgetName); 
      return errorDisplay ? errorDisplay : Widget.loadingDisplay();
    }

    let updates = 0;
    let totalPlugins = 0;
    let coreUpdate = (widget.data.core && widget.data.core.updates) ? widget.data.core.updates : '' ;

    // Compile data for display
    if (widget.data && widget.data.plugins && widget.data.plugins.length) {
      widget.data.plugins.map((plugin) => {
        if (plugin.updates) {
          updates++;
        }
      });
      totalPlugins = widget.data.plugins.length;
    }

    let pluginText, cmsUrl;

    // CMS Specific
    switch(config.cms) {  
      case 'wordpress':
        cmsUrl = config.siteUrl + '/wp-admin/plugins.php';
        break;
      case 'drupal': 
        cmsUrl = config.siteUrl + '/admin/modules';
        break;
    }

    if(display === 'page') {
      return (
        <PluginsPage 
          cms={config.cmsNice}
          pluginText={config.pluginText}
          cmsUrl={cmsUrl}
          pluginUrl={config.pluginUrl}
          header={Widget.titleSection(config.pluginText + 's', false, 'h2', false, true)} 
          updates={updates} 
          core={widget.data.core} 
          plugins={widget.data.plugins} />
      )
    }
    else {
      return (
        <PluginsWidget 
          cms={config.cmsNice}
          pluginText={config.pluginText}
          refreshButton={(<RefreshButton widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
          updates={updates} 
          coreUpdate={coreUpdate} 
          footer={Widget.panelFooter(totalPlugins + ' total ' + config.pluginText.toLowerCase() + 's', widgetName, false)} />
      )
    }
  }
}

Plugins.propTypes = Widget.propTypes({});

export default Widget.connect(Plugins);