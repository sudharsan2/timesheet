import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

LeaveCurrentBalance.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function LeaveCurrentBalance({ rows, isLoading }) {
  const columns = [
    {
      field: 'category_name',
      headerName: 'Leave Type',
      width: 200,
      editable: false
    },
    {
      field: 'total_leave',
      headerName: 'Opening',
      width: 150,
      editable: false
    },
    {
      field: 'balance_leave',
      headerName: 'Closing',
      width: 150,
      editable: false
    }
  ];

  return (
    <div style={{ height: 350, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowsPerPageOptions={[5, 25, 100]}
            loading={isLoading}
            components={{
              LoadingOverlay: CustomLoadingOverlay
            }}
            getRowId={(_x) => _x.leave_master_id}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}
