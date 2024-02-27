import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

PendingLeaveBalance.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool
};

export default function PendingLeaveBalance({ rows, isLoading }) {
  const columns = [
    {
      field: 'leave_applied_id',
      headerName: 'Leave Application Id',
      width: 200,
      editable: false
    },
    {
      field: 'from_date',
      headerName: 'From Date',
      width: 150,
      editable: false
    },
    {
      field: 'to_date',
      headerName: 'To Date',
      width: 150,
      editable: false
    },
    {
      field: 'userComments',
      headerName: 'Reason',
      width: 200,
      editable: false
    },
    {
      field: 'submittedOn',
      headerName: 'Submitted On',
      width: 150,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
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
            getRowId={(_x) => _x.leave_applied_id}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}
