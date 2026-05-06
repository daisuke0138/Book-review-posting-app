import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import { BookWithLatestPostType } from "@/types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const Review: React.FC = () => {
    const [books, setBooks] = useState<BookWithLatestPostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooksWithLatestPost = async () => {
            try {
                setIsLoading(true);
                // バックエンドで最新投稿付きの本リストを取得
                const response = await apiClient.get("/books/with-latest-post");
                setBooks(response.data);
                setError(null);
            } catch (err) {
                console.error("データの取得に失敗しました:", err);
                setError("データの取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooksWithLatestPost();
    }, []);

    // 日付フォーマット
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <Box className={styles.review__loading}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    読み込み中...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={styles.review__error}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (books.length === 0) {
        return (
            <Box className={styles.review__empty}>
                <Typography variant="body1" color="text.secondary">
                    登録されている本がありません
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.review}>
            <Typography variant="h5" component="h1" className={styles.review__title}>
                レビュー一覧
            </Typography>

            <Box className={styles.review__list}>
                {books.map((book) => (
                    <Card key={book.id} className={styles.review__card}>
                        {book.imageUrl ? (
                            <CardMedia
                                component="img"
                                className={styles.review__cardImage}
                                image={book.imageUrl}
                                alt={book.title}
                            />
                        ) : (
                            <Box className={styles.review__cardImagePlaceholder}>
                                <Typography variant="body2" color="text.secondary">
                                    No Image
                                </Typography>
                            </Box>
                        )}

                        <CardContent className={styles.review__cardContent}>
                            <Typography
                                variant="h6"
                                component="h2"
                                className={styles.review__bookTitle}
                            >
                                {book.title}
                            </Typography>

                            {book.latestPost ? (
                                <Box className={styles.review__latestPost}>
                                    <Typography
                                        variant="body2"
                                        className={styles.review__postContent}
                                    >
                                        {book.latestPost.content}
                                    </Typography>

                                    <Box className={styles.review__postMeta}>
                                        <Typography variant="caption" color="text.secondary">
                                            {book.latestPost.author.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(book.latestPost.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className={styles.review__noPost}
                                >
                                    まだ感想がありません
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Review;
