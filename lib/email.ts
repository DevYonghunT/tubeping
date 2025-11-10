import { Resend } from "resend";
import { VideoSummary } from "./openai";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  channelName: string;
  videoTitle: string;
  videoUrl: string;
  summary: VideoSummary;
}

/**
 * 새 영상 알림 이메일 전송
 */
export async function sendVideoNotificationEmail(data: EmailData): Promise<boolean> {
  try {
    const { to, channelName, videoTitle, videoUrl, summary } = data;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 영상 알림 - ${videoTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🎬 Tubeping
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                새 영상 알림
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                  ${videoTitle}
                </h2>
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  채널: <strong>${channelName}</strong>
                </p>
              </div>

              <div style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                  📝 영상 요약
                </h3>
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 15px; line-height: 1.6;">
                  ${summary.summary}
                </p>
                ${summary.keyPoints.length > 0 ? `
                <ul style="margin: 15px 0 0 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                  ${summary.keyPoints.map((point: string) => `<li>${point}</li>`).join("")}
                </ul>
                ` : ""}
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${videoUrl}" 
                   style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                  영상 보기 →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">
                이 이메일은 <strong>Tubeping</strong>에서 자동으로 발송되었습니다.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                알림 설정을 변경하려면 대시보드에서 설정을 수정하세요.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: "Tubeping <noreply@tubeping.com>",
      to: [to],
      subject: `🎬 새 영상: ${videoTitle}`,
      html: htmlContent,
    });

    return !!result.data;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

