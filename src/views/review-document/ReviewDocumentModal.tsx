import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  GetApp as DownloadIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { theme } from "@/theme/theme";

interface ReviewDocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: {
    project_id?: string;
    document_type_uuid?: string;
    document_type?: string;
    organization_name?: string;
    project_name?: string;
    email?: string;
    s3_url?: string;
  } | null;
  onDownload: () => Promise<void>;
  onReturnDocument: (data: {
    project_id: string;
    document_type_uuid: string;
    feedback?: string;
    document_text?: string;
  }) => Promise<void>;
  isDownloading: boolean;
  isReturning: boolean;
}

const ReviewDocumentModal: React.FC<ReviewDocumentModalProps> = ({
  open,
  onClose,
  document,
  onDownload,
  onReturnDocument,
  isDownloading,
  isReturning,
}) => {
  const [feedback, setFeedback] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (only .docx)
    if (!file.name.endsWith(".docx")) {
      setError("Please upload only .docx files");
      return;
    }

    setUploadedFile(file);
    setError("");

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:application/...;base64, prefix
      const base64Data = base64String.split(",")[1];
      setUploadedBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!document) return;

    if (!feedback.trim() && !uploadedFile) {
      setError("Please provide feedback or upload a document");
      return;
    }

    try {
      setError("");
      await onReturnDocument({
        project_id: document.project_id ?? "",
        document_type_uuid: document.document_type_uuid ?? "",
        feedback: feedback.trim() || undefined,
        document_text: uploadedBase64 || undefined,
      });
      setSuccess("Document returned successfully!");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to return document");
    }
  };

  const handleClose = () => {
    setFeedback("");
    setUploadedFile(null);
    setUploadedBase64("");
    setError("");
    setSuccess("");
    onClose();
  };

  if (!document) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.radii.xl,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={theme.typography.fontWeight.bold}>
          Review Document Details
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Document Info */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: theme.radii.lg,
            background: "#f9fafb",
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Typography variant="body2" color={theme.colors.text.muted} gutterBottom>
            <strong>Organization:</strong> {document.organization_name || "—"}
          </Typography>
          <Typography variant="body2" color={theme.colors.text.muted} gutterBottom>
            <strong>Project:</strong> {document.project_name || "—"}
          </Typography>
          <Typography variant="body2" color={theme.colors.text.muted} gutterBottom>
            <strong>Document Type:</strong> {document.document_type || "—"}
          </Typography>
          <Typography variant="body2" color={theme.colors.text.muted}>
            <strong>Email:</strong> {document.email || "—"}
          </Typography>
        </Box>

        {/* Download Original Document */}
        <Box mb={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={onDownload}
            disabled={isDownloading}
            sx={{
              borderColor: theme.colors.border.solid,
              color: theme.colors.text.primary,
              py: 1.5,
              "&:hover": {
                background: "rgba(62, 162, 255, 0.08)",
              },
            }}
          >
            {isDownloading ? "Downloading..." : "Download Original Document"}
          </Button>
        </Box>

        {/* Feedback Input */}
        <Box mb={3}>
          <Typography
            variant="body2"
            fontWeight={theme.typography.fontWeight.semibold}
            mb={1}
            color={theme.colors.text.primary}
          >
            Feedback (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your feedback for the document..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: theme.radii.lg,
              },
            }}
          />
        </Box>

        {/* Upload Return Document */}
        <Box mb={2}>
          <Typography
            variant="body2"
            fontWeight={theme.typography.fontWeight.semibold}
            mb={1}
            color={theme.colors.text.primary}
          >
            Upload Return Document (Optional)
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<AttachFileIcon />}
            sx={{
              borderColor: theme.colors.border.solid,
              color: theme.colors.text.primary,
              py: 1.5,
              borderStyle: "dashed",
              "&:hover": {
                background: "rgba(62, 162, 255, 0.08)",
              },
            }}
          >
            {uploadedFile ? uploadedFile.name : "Choose .docx File"}
            <input
              type="file"
              hidden
              accept=".docx"
              onChange={handleFileUpload}
            />
          </Button>
          {uploadedFile && (
            <Typography variant="caption" color={theme.colors.states.success} sx={{ mt: 1, display: "block" }}>
              File ready to upload: {uploadedFile.name}
            </Typography>
          )}
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: theme.radii.md }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: theme.radii.md }}>
            {success}
          </Alert>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: theme.colors.border.solid,
            color: theme.colors.text.primary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isReturning ? <CircularProgress size={16} /> : <SendIcon />}
          disabled={isReturning || success !== ""}
          sx={{
            background: theme.colors.primary,
            color: theme.colors.text.inverse,
            fontWeight: theme.typography.fontWeight.medium,
            "&:hover": { background: theme.colors.secondary },
          }}
        >
          {isReturning ? "Returning..." : "Return Document"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDocumentModal;