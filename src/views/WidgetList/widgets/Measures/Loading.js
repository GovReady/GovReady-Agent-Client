import React from 'react';
import GenericLoading from 'components/loading/Generic';
import TableLoading from 'components/loading/VerticalTable';

const Loading = () => {
  return (
    <div className="loading-shim widget">
      <div className="panel-body">
        <h3>
          <span className="loading-shim-block-tiny" />
        </h3>
        <h5><span className="loading-shim-block-small" /></h5>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <TableLoading />
        </div>
        <div className="col-sm-6">
          <GenericLoading />
        </div>
      </div>
    </div>
  )
}

export default Loading;