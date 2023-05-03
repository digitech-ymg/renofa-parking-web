export type User = {
  id: string;
  nickname: string;
  photoURL: string;
  createdAt: Date;
  title: string;
  titleDescription: string;
  postTimes: number;
};

export type UserPostTime = {
  nickname: string;
  postTime: number;
};

export type MypageInfo = {
  nickname: string;
  postTimes: number;
  title: string;
  titleDescription: string;
};
