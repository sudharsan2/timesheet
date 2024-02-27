import React from 'react';
import {
  Container,
  CardContent,
  Card,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {
  getPendingLeaveForApproval,
  getLeavePendingList,
  getApproveorRejectLeaveApproval
} from '../../redux/slices/leaveSlice';
import CustomLoadingOverlay from '../../components/CustomLoadingOverlay';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import { MIconButton } from '../../components/@material-extend';

export default function LeaveApproval() {
  const { themeStretch } = useSettings();
  const title = 'Leave Approval';
  const rows = useSelector(getLeavePendingList);
  // const rows = useSelector(getkkmasterDetailsFromTimesheetSettings);
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState('');
  const [text, setText] = React.useState('');
  const [value, setValue] = React.useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleClickOpen = (e, row) => {
    if (e === 'Approve') {
      setText('Do yo want to Approve ?');
    }
    if (e === 'Reject') {
      setText('Do yo want to Reject ?');
    }
    setRow(row.leave_applied_id);
    setValue(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlApproveReject = async (e) => {
    // navigate(`${PATH_DASHBOARD.timesheet.kpiKraMasterEdit}/${values.id}`);
    let status = '';
    if (e === 'Do yo want to Approve ?') {
      status = 'APPROVED';
    } else {
      status = 'REJECTED';
    }
    const _payload = [
      {
        leave_applied_id: row,
        status,
        managerComments: value
      }
    ];
    await dispatch(getApproveorRejectLeaveApproval(_payload))
      .then(() => {
        enqueueSnackbar('Success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        handleClose();
        dispatch(getPendingLeaveForApproval());
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          variant: 'Failed',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  const columns = [
    {
      field: '',
      headerName: 'Actions',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Approve">
            <IconButton
              color="primary"
              aria-label="approve group"
              onClick={() => handleClickOpen('Approve', params.row)}
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton color="primary" aria-label="reject group" onClick={() => handleClickOpen('Reject', params.row)}>
              <ThumbDownOffAltIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    },
    {
      field: 'empId',
      headerName: 'Employee Id',
      width: 120,
      editable: false
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      width: 200,
      editable: false
    },
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

  React.useEffect(() => {
    dispatch(getPendingLeaveForApproval());
    // dispatch(getAllKpiKraActionAsync());
  }, [dispatch]);

  return (
    // <span>LeaveApproval</span>
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={title}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.general.root }, { name: 'Leave Approval' }]}
        />
        <Page title={title}>
          <Card>
            <CardContent>
              <div style={{ height: 550, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      rowsPerPageOptions={[5, 25, 100]}
                      getRowId={(_x) => _x.leave_applied_id}
                      // loading={isLoading}
                      components={{
                        LoadingOverlay: CustomLoadingOverlay
                      }}
                      disableSelectionOnClick
                      // selectionModel={selectionModel}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Dialog open={open} maxWidth="md">
            <DialogTitle align="center" display="flex">
              Do you want to delete ?{' '}
            </DialogTitle>
            <DialogContent />
            <DialogActions>
              <Button variant="contained" color="inherit" size="medium" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                size="medium"
                // disabled={isLoading}
                // onClick={() => handleMultipleDelete()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog> */}
          <Dialog
            fullWidth
            open={open}
            maxWidth="md"
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" align="center" display="flex">
              {text}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                value={value}
                onChange={(e) => setValue(e.target.value)}
                id="outlined-basic"
                label="Your Comments"
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Button variant="contained" color="inherit" size="medium" onClick={handleClose}>
                    Cancel
                  </Button>{' '}
                  {/* </Grid>
                <Grid item xs={4} align="center"> */}
                  <Button variant="contained" size="medium" onClick={() => handlApproveReject(text)}>
                    {text === 'Do yo want to Approve ?' ? 'Approve' : 'Reject'}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Page>
      </Container>
    </Page>
  );
}
