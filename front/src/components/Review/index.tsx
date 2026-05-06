import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import { LatestReviewType } from "@/types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";

const Review: React.FC = () => {
    const [reviews, setReviews] = useState<LatestReviewType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestReviews = async () => {
            try {
                setIsLoading(true);
                // バックエンド: GET /books/latest-reviewed?limit=5
                // post.createdAt降順・bookId重複排除・最新5件を取得
                const response = await apiClient.get("/books/latest-reviewed?limit=5");
                setReviews(response.data);
                setError(null);
            } catch (err) {
                console.error("データの取得に失敗しました:", err);
                setError("データの取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestReviews();
    }, []);

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

    if (reviews.length === 0) {
        return (
            <Box className={styles.review__empty}>
                <Typography variant="body1" color="text.secondary">
                    投稿がありません
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.review}>
            <Typography variant="h5" component="h1" className={styles.review__title}>
                最新の投稿
            </Typography>

            <Box className={styles.review__list}>
                {reviews.map((review) => (
                    <Card key={review.id} className={styles.review__card}>
                        {review.book.imageUrl ? (
                            <CardMedia
                                component="img"
                                className={styles.review__cardImage}
                                image={review.book.imageUrl}
                                alt={review.book.title}
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
                                {review.book.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                className={styles.review__postContent}
                            >
                                {review.content}
                            </Typography>

                            <Box className={styles.review__postMeta}>
                                <Avatar
                                    sx={{ width: 24, height: 24, fontSize: 12, bgcolor: "#1976d2" }}
                                >
                                    {review.author.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                    {review.author.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(review.createdAt)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Review;
