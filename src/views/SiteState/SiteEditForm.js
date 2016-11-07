import React, { PropTypes as PT, Component } from 'react';
import { reduxForm, initialize, propTypes } from 'redux-form';
import PureInput from 'components/PureInput';
import DeleteConfirm from 'components/DeleteConfirm';
// Form fields
export const fields = [
  '_id',
  'type',
  'title',
  'url',
  'accessible',
  'application'
];

class SiteEditPage extends Component {

  editForm() {
    // Extract props
    const { fields: { 
      _id,
      type,
      title,
      url,
      accessible,
      application
    }, handleSubmit, siteSubmit, siteDelete, submitting, site, locked, appDisabled } = this.props;
    return (
      <form onSubmit={handleSubmit(siteSubmit)}>
        <fieldset disabled={submitting}>
          <div className="row">
            {!locked && (
              <div className="col-md-9">
                <div className="form-group">
                  <div><label>What type of site?</label></div>
                  <div className="radio">
                    <label>
                      <input type="radio" {...type} value="drupal" checked={!type.value || type.value === 'drupal'}/> Drupal
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" {...type} value="wordpress" checked={type.value === 'wordpress'}/> WordPress
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" {...type} value="other" checked={type.value === 'other'}/> Other
                    </label>
                  </div>
                </div>
              </div>
            )}
            {(!locked && (!type.value || type.value === 'drupal')) && (
              <div className="col-md-9">
                <div className="well">
                  <h3 className="margin-top-none">Drupal</h3>
                  <p>To create a Drupal based version of this module, you must first install the module on the Drupal site it is intended for.</p>
                  <p>Head over to the module page and follow the instructions.</p>
                  <p><a className="btn btn-success" href="https://www.drupal.org/project/govready" target="_blank">Get Started</a></p>
                </div>
              </div>
            )}
            {(!locked && type.value === 'wordpress') && (
              <div className="col-md-9">
                <div className="well">
                  <h3 className="margin-top-none">WordPress</h3>
                  <p>To create a WordPress based version of this plugin, you must first install the plugin on the WordPress site it is intended for.</p>
                  <p>Head over to the plugin page and follow the instructions.</p>
                  <p><a className="btn btn-success" href="https://github.com/GovReady/GovReady-WordPress-Agent" target="_blank">Get Started</a></p>
                </div>
              </div>
            )}
            {(locked || type.value === 'other') && (
              <div className="col-md-9">
                <div className="well">
                  <div className="form-group">
                    <div>
                      <label className="control-label">Title</label>
                      <PureInput type="text" field={title}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <label className="control-label">Url</label>
                      <PureInput type="text" field={url}/>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input {...accessible} type="checkbox" checked={accessible.value} /> Publicly Accessible?
                      </label>
                      <span className="help-block">If this box is check GovReady will attempt to collect security-related information about your domain.</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <label className="control-label">CMS / Application</label>
                      {appDisabled && (
                        <PureInput disabled="disabled" type="text" field={application}/>
                      )}
                      {!appDisabled && (
                        <PureInput type="text" field={application}/>
                      )}
                      <span className="help-block">This information allows GovReady to determine what technology stacks are using the service.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </fieldset>
        {(locked || type.value === 'other') && (
          <div className="clearfix">
            <div className="pull-left">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? <i/> : <i/>} Submit
              </button>
            </div>
            <div className="pull-left">
              {_id.value && (
                <DeleteConfirm 
                  index={_id.value} 
                  confirmDelete={Boolean(confirmDelete.value)}
                  deleteConfirm={confirmDelete.onChange}
                  deleteFunc={() => { 
                    siteDelete(this.props.fields);
                  }} />
              )}
            </div>
          </div>
        )}
      </form>
    )
  }

  render () {
    return (
      <div>
        <h2>Create New Site</h2>
        {this.editForm()}
      </div>
    );
  }
}

SiteEditPage.propTypes = {
  ...propTypes,
  site: PT.object.isRequired,
  locked: PT.bool.isRequired,
  appDisabled: PT.bool.isRequired,
  siteSubmit: PT.func.isRequired,
  siteDelete: PT.func.isRequired
};

export default reduxForm({
  form: 'siteEdit',
  fields
},
(state, ownProps) => ({
  initialValues: {
    ...ownProps.site
  }
})
)(SiteEditPage);