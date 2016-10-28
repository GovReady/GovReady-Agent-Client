import React, { PropTypes as PT, Component } from 'react';
import { reduxForm, initialize, propTypes } from 'redux-form';
import PureInput from 'components/PureInput';
import DeleteConfirm from 'components/DeleteConfirm';
// Form fields
export const fields = [
  '_id',
  'title',
  'url',
];

class SiteEditPage extends Component {

  editForm() {
    // Extract props
    const { fields: { 
      _id,
      title,
      url
    }, handleSubmit, siteSubmit, siteDelete, submitting, site } = this.props;
    return (
      <form onSubmit={handleSubmit(siteSubmit)}>
        <fieldset disabled={submitting}>
          <div className="row">
            <div className="col-md-9">
              <div className="form-group">
                <div>
                  <label className="control-label">Title</label>
                  <PureInput type="text" field={title}/>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <div>
                  <label className="control-label">Url</label>
                  <PureInput type="text" field={url}/>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
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