import React, { useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import { BookType } from "@/types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

interface PostProps {
    onPostSuccess?: () => void;
    selectedBook: BookType | null;
}

const Post = ({ onPostSuccess, selectedBook }: PostProps) => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBook) {
            setErrorMessage("本を選択してください");
            setShowError(true);
            return;
        }

        if (!content.trim()) {
            setErrorMessage("投稿内容を入力してください");
            setShowError(true);
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post("/posts", {
                content: content.trim(),
                bookId: selectedBook.id,
            });

            setContent("");
            setShowSuccess(true);

            if (onPostSuccess) {
                onPostSuccess();
            }
        } catch (err: any) {
            console.log(err);
            setErrorMessage(
                err.response?.data?.message || "投稿に失敗しました"
            );
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    return (
        <div className={styles.postForm}>
            {!selectedBook ? (
                <div className={styles.postForm__placeholder}>
                    <Typography variant="body1" color="textSecondary">
                        本を選択すると感想を投稿できます
                    </Typography>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Typography variant="subtitle2" className={styles.postForm__bookLabel}>
                        「{selectedBook.title}」の感想
                    </Typography>
                    <TextField
                        label="本の感想を投稿"
                        placeholder="読んだ本の感想を共有しましょう..."
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        variant="outlined"
                        className={styles.postForm__textarea}
                        disabled={isLoading}
                    />
                    <div className={styles.postForm__actions}>
                        <span className={styles.postForm__charCount}>
                            {content.length} 文字
                        </span>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={
                                isLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <SendIcon />
                                )
                            }
                            disabled={isLoading || !content.trim()}
                            className={styles.postForm__submitBtn}
                        >
                            {isLoading ? "投稿中..." : "投稿する"}
                        </Button>
                    </div>
                </form>
            )}

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                >
                    投稿が完了しました
                </Alert>
            </Snackbar>

            <Snackbar
                open={showError}
                autoHideDuration={5000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Post;
