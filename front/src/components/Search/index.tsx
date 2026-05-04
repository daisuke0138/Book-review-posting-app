import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import apiClient from "@/lib/apiClient";
import { BookType } from "@/types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface SearchProps {
    onBookSelect: (book: BookType | null) => void;
    selectedBook: BookType | null;
}

const Search = ({ onBookSelect, selectedBook }: SearchProps) => {
    const [books, setBooks] = useState<BookType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await apiClient.get("/books");
                setBooks(res.data);
            } catch (err) {
                console.log("本のリスト取得に失敗しました", err);
                setError("本のリストを取得できませんでした");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleChange = (event: SelectChangeEvent<number>) => {
        const bookId = event.target.value as number;
        if (bookId === 0) {
            onBookSelect(null);
        } else {
            const selected = books.find((book) => book.id === bookId);
            onBookSelect(selected || null);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.search__loading}>
                <CircularProgress size={24} />
                <Typography variant="body2">本のリストを読み込み中...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.search__error}>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </div>
        );
    }

    return (
        <div className={styles.search}>
            <FormControl fullWidth variant="outlined" className={styles.search__select}>
                <InputLabel id="book-select-label">本を選択</InputLabel>
                <Select
                    labelId="book-select-label"
                    id="book-select"
                    value={selectedBook?.id || 0}
                    onChange={handleChange}
                    label="本を選択"
                >
                    <MenuItem value={0}>
                        <em>本を選んでください</em>
                    </MenuItem>
                    {books.map((book) => (
                        <MenuItem key={book.id} value={book.id}>
                            {book.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedBook && (
                <Box className={styles.search__bookInfo}>
                    {selectedBook.imageUrl ? (
                        <img
                            src={selectedBook.imageUrl}
                            alt={selectedBook.title}
                            className={styles.search__bookImage}
                        />
                    ) : (
                        <div className={styles.search__noImage}>
                            <Typography variant="body2">画像なし</Typography>
                        </div>
                    )}
                    <Typography variant="h6" className={styles.search__bookTitle}>
                        {selectedBook.title}
                    </Typography>
                </Box>
            )}
        </div>
    );
};

export default Search;
