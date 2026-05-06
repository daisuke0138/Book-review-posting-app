// model User {
//   id        Int      @id @default(autoincrement())
//   username   String
//   email   String @unique
//   password   String
//   post Post[]
// }

// model Post {
//   id        Int      @id @default(autoincrement())
//   content   String
//   createdAt DateTime @default(now())
//   authorId  Int
//   author    User     @relation(fields: [authorId], references: [id])
// }

export interface UserType {
    id: number;
    username: string;
    email: string;
    password: number;
    post: PostType[];
}

export interface PostType {
    id: number;
    content: string;
    createdAt: string;
    authorId: number;
    author: UserType;
    bookId?: number;
    book?: BookType;
    likes?: LikeType[];
    _count?: {
        likes: number;
    };
}

export interface LikeType {
    id: number;
    userId: number;
    postId: number;
    createdAt: string;
}

export interface BookType {
    id: number;
    title: string;
    imageUrl?: string;
    createdAt?: string;
}

// Review一覧ページ用の型（バックエンドから最新投稿付きで取得）
export interface LatestPostType {
    content: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
    };
}

export interface BookWithLatestPostType {
    id: number;
    title: string;
    imageUrl?: string;
    latestPost?: LatestPostType;
}
