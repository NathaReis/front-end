export interface RegisterDto {
  name: string;
  login: string;
  password: string;
  role: string;
}

export interface UserDto {
  id: number;
  name: string;
  login: string;
  password?: string;
  role: string;
  createdAt?: string;
}

export interface UserRoleUpdateDto {
  id: number;
  role: string;
}
