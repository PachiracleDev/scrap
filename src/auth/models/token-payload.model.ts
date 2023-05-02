export interface PayloadToken {
  role: string;
  sub: string;
}

export type JwtPayloadWithRt = PayloadToken & { refreshToken: string };
