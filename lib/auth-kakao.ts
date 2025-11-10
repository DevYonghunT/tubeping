import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface KakaoProfile {
  id: number;
  kakao_account: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export default function KakaoProvider(
  options: OAuthUserConfig<KakaoProfile>
): OAuthConfig<KakaoProfile> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: {
      url: "https://kauth.kakao.com/oauth/authorize",
      params: {
        scope: "profile_nickname profile_image account_email",
        response_type: "code",
      },
    },
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.kakao_account?.profile?.nickname || null,
        email: profile.kakao_account?.email || null,
        image: profile.kakao_account?.profile?.profile_image_url || null,
      };
    },
    ...options,
  } as OAuthConfig<KakaoProfile>;
}

