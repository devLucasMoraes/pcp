import { Alert, Snackbar } from '@mui/material'

import { useAlertStore } from '../../stores/alert-store'

export const AlertManager = () => {
  const { alerts, closeSnackbar } = useAlertStore()

  return (
    <>
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          onClose={() => closeSnackbar(alert.id)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          style={{
            top: `${80 + index * 70}px`, // Stack alerts vertically
          }}
        >
          <Alert
            onClose={() => closeSnackbar(alert.id)}
            severity={alert.variant}
            variant="standard"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}
