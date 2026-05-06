// model User {
//   id                Int      @id @default(autoincrement())
//   username          String   @unique
//   libraryCardNumber String   @unique
//   post              Post[]
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
    libraryCardNumber: string;
    post?: PostType[];
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

// Review一覧ページ用の型
// バックエンド: GET /books/latest-reviewed?limit=5
// Prisma: post.findMany({ orderBy:{createdAt:'desc'}, take:5, distinct:['bookId'], include:{author,book} })
export interface LatestReviewType {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
    };
    book: {
        id: number;
        title: string;
        imageUrl?: string;
    };
}
