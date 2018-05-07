import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { default as config } from 'config';
import Widget from '../Widget';
import { Link } from 'react-router';
import RefreshButton from 'components/RefreshButton';
import PluginsWidget from './PluginsWidget';
import PluginsPage from './PluginsPage';
import Loading from 'components/loading/Panel';

export const pluginsDef = {
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

class Plugins extends Component {

  static defaultProps = pluginsDef

  componentWillMount () {
    Widget.registerWidget(
      this, 
      true
    );
  }

  render () {

    let { widget, widgetName, display } = this.props;
    
    // Return loading if not set
    if (!widget.status || widget.status !== 'loaded') {
      let errorDisplay = Widget.errorDisplay(widget.status, widgetName); 
      if (errorDisplay) {
        return errorDisplay;
      } else if (display === 'page') {
        return Widget.loadingDisplay()
      } else {
        return <Loading />;
      }
    }

    const updates = {
      reg: 0,
      sec: 0,
    }
    let totalPlugins;
    let coreUpdate = (widget.data.core && widget.data.core.updates) ? widget.data.core.updates : '' ;

    // Compile data for display
    if (widget.data && widget.data.plugins && widget.data.plugins.length) {
      widget.data.plugins.map((plugin) => {
        if (plugin.updates) {
          if(plugin.updates === 'security' ){
            updates.sec++;
          } else {
            updates.reg++;
          }
          
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
          refreshButton={(<RefreshButton status={widget.data.lastStatus} widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
          updates={updates} 
          coreUpdate={coreUpdate} 
          footer={Widget.panelFooter(totalPlugins + ' total ' + config.pluginText.toLowerCase() + 's', widgetName, false)} />
      )
    }
  }
}

Plugins.propTypes = Widget.propTypes({});

export default Widget.connect(Plugins);