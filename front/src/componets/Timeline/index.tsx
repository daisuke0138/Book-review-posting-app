import React from "react";
import styles from "./style.module.scss";
import Button from "@mui/material/Button";

const TimeLine = () => {
    return (
        <div className={styles.timeline}>
            <form>
                <textarea name="" id="" placeholder="本文を入力してください"></textarea>
                <Button size="large" variant="outlined">
                    送信
                </Button>
            </form>
        </div>
    );
};

export default TimeLine;