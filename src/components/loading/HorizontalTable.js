import React, { PropTypes as PT } from 'react';

const HorizontalTable = ({text = false, rowCount = 4 }) => {
  return (
    <div className="widget loading-shim">
      <div>
        <div className="text">
          <h3><span className="loading-shim-block-small" /></h3>
        </div>
        {text && (
          <h5><span className="loading-shim-block-normal" /></h5>
        )}
        <div className='table-responsive'>
          <table className='table'>
            <tbody>
              {[...Array(rowCount)].map((un,i) => (
                <tr key={i.toString()}>
                  <th><span className="loading-shim-block-small" /></th>
                  <td><span className="loading-shim-block-normal" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HorizontalTable;