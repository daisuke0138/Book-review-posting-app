import React, { useEffect, useState, useCallback } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import { PostType } from "@/types";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface TimelineProps {
    refreshTrigger?: number;
}

interface PostItemProps {
    post: PostType;
    currentUserId: number | null;
    onLikeToggle: (postId: number, isLiked: boolean) => void;
}

const PostItem = ({ post, currentUserId, onLikeToggle }: PostItemProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // いいね数を設定
        const count = post._count?.likes || post.likes?.length || 0;
        setLikeCount(count);

        // 現在のユーザーがいいねしているかチェック
        if (currentUserId && post.likes) {
            const userLiked = post.likes.some(
                (like) => like.userId === currentUserId
            );
            setIsLiked(userLiked);
        }
    }, [post, currentUserId]);

    const handleLikeToggle = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            if (isLiked) {
                // いいね取り消し
                await apiClient.delete(`/posts/${post.id}/like`);
                setLikeCount((prev) => Math.max(0, prev - 1));
                setIsLiked(false);
            } else {
                // いいね追加
                await apiClient.post(`/posts/${post.id}/like`);
                setLikeCount((prev) => prev + 1);
                setIsLiked(true);
            }
            onLikeToggle(post.id, !isLiked);
        } catch (err) {
            console.log("いいねの処理に失敗しました", err);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitial = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : "?";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={styles.postItem}>
            <div className={styles.postItem__header}>
                <Avatar className={styles.postItem__avatar}>
                    {getInitial(post.author?.username || "")}
                </Avatar>
                <div className={styles.postItem__userInfo}>
                    <Typography
                        variant="subtitle1"
                        className={styles.postItem__username}
                    >
                        {post.author?.username || "Unknown User"}
                    </Typography>
                    <Typography
                        variant="caption"
                        className={styles.postItem__date}
                    >
                        {formatDate(post.createdAt)}
                    </Typography>
                </div>
            </div>

            <div className={styles.postItem__content}>
                <Typography variant="body1">{post.content}</Typography>
            </div>

            <div className={styles.postItem__actions}>
                <IconButton
                    onClick={handleLikeToggle}
                    disabled={isLoading || !currentUserId}
                    className={`${styles.postItem__likeBtn} ${
                        isLiked ? styles["postItem__likeBtn--active"] : ""
                    }`}
                    size="small"
                >
                    {isLoading ? (
                        <CircularProgress size={20} />
                    ) : isLiked ? (
                        <FavoriteIcon />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                </IconButton>
                <Typography
                    variant="body2"
                    className={styles.postItem__likeCount}
                >
                    {likeCount}
                </Typography>
            </div>
        </div>
    );
};

const Timeline = ({ refreshTrigger }: TimelineProps) => {
    const [postData, setPostdata] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get("/get_post");
            console.log(res.data, "データ取得");
            setPostdata(res.data);
        } catch (err) {
            console.log(err, "err");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (token) {
                const res = await apiClient.get("/auth/me");
                setCurrentUserId(res.data.id);
            }
        } catch (err) {
            console.log("ユーザー情報の取得に失敗しました", err);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
        fetchCurrentUser();
    }, [fetchPosts, fetchCurrentUser]);

    useEffect(() => {
        if (refreshTrigger && refreshTrigger > 0) {
            fetchPosts();
        }
    }, [refreshTrigger, fetchPosts]);

    const handleLikeToggle = (postId: number, isLiked: boolean) => {
        // 必要に応じて親コンポーネントに通知
        console.log(`Post ${postId} liked: ${isLiked}`);
    };

    if (isLoading) {
        return (
            <div className={styles.timeline__loading}>
                <CircularProgress />
                <Typography variant="body2">読み込み中...</Typography>
            </div>
        );
    }

    if (postData.length === 0) {
        return (
            <div className={styles.timeline__empty}>
                <Typography variant="body1">
                    まだ投稿がありません。最初の投稿をしてみましょう!
                </Typography>
            </div>
        );
    }

    return (
        <div className={styles.timeline}>
            <Typography variant="h6" className={styles.timeline__title}>
                みんなの感想
            </Typography>
            {postData.map((item) => (
                <PostItem
                    key={item.id}
                    post={item}
                    currentUserId={currentUserId}
                    onLikeToggle={handleLikeToggle}
                />
            ))}
        </div>
    );
};

export default Timeline;
