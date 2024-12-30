import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomDialog = ({ open, onClose, title, content }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ paddingRight: "16px", position: "relative" }}>
        {title}
        {/* Custom close button */}
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000",
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      
    </Dialog>
  );

  export default CustomDialog
  