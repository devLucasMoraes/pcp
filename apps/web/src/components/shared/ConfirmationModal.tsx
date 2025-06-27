import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

export const ConfirmationModal = ({
  title,
  children,
  open,
  onClose,
  onConfirm,
}: {
  title: string
  children: React.ReactNode
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) => {
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{children}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm()
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
