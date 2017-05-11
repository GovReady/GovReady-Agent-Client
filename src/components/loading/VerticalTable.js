import React, { PropTypes as PT } from 'react';

const VerticalTable = ({text = false, colCount = 4, rowCount = 3 }) => {
  return (
    <div className="widget loading-shim">
      <div>
        <div className="text">
          <h3><span className="loading-shim-block-small" /></h3>
        </div>
        {text && (
          <h5><span className="loading-shim-block-large" /></h5>
        )}
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                {[...Array(colCount)].map((un,i) => (
                  <th key={i.toString()}><span className="loading-shim-block-small" /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(rowCount)].map((un,i) => (
                <tr key={i.toString()}>
                  {[...Array(colCount)].map((und,j) => (
                    <td key={j.toString()}><span className="loading-shim-block-small" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VerticalTable;