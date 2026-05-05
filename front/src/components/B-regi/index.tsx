import { useState, useRef, ChangeEvent } from "react";
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
import imageCompression from 'browser-image-compression';

const BRegi = () => {
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const cameraInputRef = useRef<HTMLInputElement>(null);

    // カメラ撮影 / ファイル選択後のハンドラ 画像圧縮
    const handleImageCapture = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 圧縮オプション: 0.5MB以下、横幅最大800pxに圧縮
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            setImageFile(compressedFile);
            const previewUrl = URL.createObjectURL(compressedFile);
            setImagePreview(previewUrl);
        } catch (error) {
            console.error("画像圧縮エラー:", error);
            setSnackbar({
                open: true,
                message: "画像の圧縮に失敗しました",
                severity: "error",
            });
        }
    };

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

    // 確認ダイアログでOKを押下 -> multipart/form-data でAPIへ送信
    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            if (imageFile) {
                formData.append("image", imageFile);
            }

            await apiClient.post("/books", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSnackbar({
                open: true,
                message: "本を登録しました",
                severity: "success",
            });
            setTitle("");
            setImageFile(null);
            setImagePreview(null);
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

                {/* カメラ撮影ボタン */}
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleImageCapture}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isSubmitting}
                    className={styles.registerForm__cameraButton}
                    fullWidth
                >
                    カメラで撮影 / 画像を選択
                </Button>

                {/* 撮影プレビュー */}
                {imagePreview && (
                    <Box className={styles.registerForm__preview}>
                        <img
                            src={imagePreview}
                            alt="撮影プレビュー"
                            className={styles.registerForm__previewImage}
                        />
                        <Button
                            size="small"
                            color="inherit"
                            onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                            }}
                            className={styles.registerForm__removeImage}
                        >
                            画像を削除
                        </Button>
                    </Box>
                )}

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
                        以下の内容で登録します。よろしいですか？
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
                    {imagePreview && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <img
                                src={imagePreview}
                                alt="登録画像プレビュー"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: 200,
                                    objectFit: "contain",
                                    borderRadius: 4,
                                }}
                            />
                        </Box>
                    )}
                    {!imageFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            ※ 画像なしで登録されます
                        </Typography>
                    )}
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
