import { useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const BRegi = () => {
    const [title, setTitle] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // 登録ボタン押下 -> 確認ダイアログを開く
    const handleRegisterClick = () => {
        if (!title.trim()) {
            setSnackbar({
                open: true,
                message: "タイトルを入力してください",
                severity: "error",
            });
            return;
        }
        setIsConfirmOpen(true);
    };

    // 確認ダイアログでOKを押下 -> APIへ送信
    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        try {
            await apiClient.post("/books", { title: title.trim() });
            setSnackbar({
                open: true,
                message: "本のタイトルを登録しました",
                severity: "success",
            });
            setTitle("");
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("本の登録に失敗しました:", error);
            setSnackbar({
                open: true,
                message: "登録に失敗しました。もう一度お試しください。",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 確認ダイアログで中止を押下 -> ダイアログを閉じる
    const handleCancelSubmit = () => {
        setIsConfirmOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <main className={styles.container}>
            <Box className={styles.registerForm}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={styles.registerForm__title}
                >
                    本のタイトル登録
                </Typography>

                <TextField
                    fullWidth
                    label="本のタイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: 吾輩は猫である"
                    className={styles.registerForm__input}
                    disabled={isSubmitting}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegisterClick}
                    disabled={isSubmitting || !title.trim()}
                    className={styles.registerForm__button}
                    fullWidth
                >
                    登録
                </Button>
            </Box>

            {/* 確認ダイアログ */}
            <Dialog
                open={isConfirmOpen}
                onClose={handleCancelSubmit}
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle id="confirm-dialog-title">登録内容の確認</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        以下のタイトルで登録します。よろしいですか？
                    </DialogContentText>
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 1,
                            fontWeight: "bold",
                        }}
                    >
                        {title}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelSubmit}
                        color="inherit"
                        disabled={isSubmitting}
                    >
                        中止
                    </Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? "登録中..." : "登録"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 通知スナックバー */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </main>
    );
};

export default BRegi;
