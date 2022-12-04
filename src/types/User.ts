export type User = {
  id: string;
  nickname: string;
  photoURL: string;
  createdAt: Date;
};

export type UserPostTime = {
  nickname: string;
  postTime: number;
};
