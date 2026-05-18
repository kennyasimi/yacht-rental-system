export class AuthResponseDto {
  access_token!: string;
  user!: {
    user_id: number;
    email: string;
    name: string | null;
    role: string;
  };
}