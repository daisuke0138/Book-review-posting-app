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
}