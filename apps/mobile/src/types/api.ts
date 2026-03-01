export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface MatchResponse {
  _id: string;
  userA: string;
  userB: string;
  status: string;
  expiresAt: string;
}
