import puppeteer from 'puppeteer';
import { IUser } from '@/models/User';

/**
 * Generate a certificate PDF for user achievements
 */
export async function generateCertificate(
  user: IUser,
  type: 'milestone' | 'rank' | 'streak' | 'achievement',
  title: string,
  description: string
): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 800px;
            border: 10px solid #667eea;
          }
          .certificate-header {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
          }
          .certificate-title {
            font-size: 36px;
            color: #333;
            margin: 30px 0;
          }
          .certificate-body {
            font-size: 20px;
            color: #666;
            margin: 30px 0;
            line-height: 1.6;
          }
          .certificate-name {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
          }
          .certificate-footer {
            margin-top: 40px;
            font-size: 16px;
            color: #999;
          }
          .certificate-date {
            margin-top: 20px;
            font-size: 18px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="certificate-header">CERTIFICATE OF ACHIEVEMENT</div>
          <div class="certificate-title">${title}</div>
          <div class="certificate-body">
            This is to certify that
          </div>
          <div class="certificate-name">${user.name}</div>
          <div class="certificate-body">
            ${description}
          </div>
          <div class="certificate-footer">
            <div>Rank: ${user.rank} | XP: ${user.xp} | Streak: ${user.streak} days</div>
            <div class="certificate-date">Issued on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}


