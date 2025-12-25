import puppeteer from 'puppeteer';
import { IUser } from '@/models/User';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate a certificate PDF for user achievements
 */
// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function generateCertificate(
  user: IUser,
  type: 'milestone' | 'rank' | 'streak' | 'achievement',
  title: string,
  description: string,
  certificateId: string
): Promise<Buffer> {
  // Read signature image and convert to base64
  const signaturePath = join(process.cwd(), 'public', 'signature.png');
  let signatureBase64 = '';
  try {
    const signatureBuffer = readFileSync(signaturePath);
    signatureBase64 = `data:image/png;base64,${signatureBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading signature:', error);
    // Continue without signature if file not found
  }

  // Escape HTML to prevent XSS and template injection
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUserName = escapeHtml(user.name);
  const safeCertificateId = escapeHtml(certificateId);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            background: #ffffff;
            padding: 80px 100px;
            text-align: center;
            width: 210mm;
            height: 297mm;
            position: relative;
            border: 3px solid #000000;
            box-sizing: border-box;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
            border: 2px solid #000000;
            pointer-events: none;
          }
          .certificate-header {
            font-size: 42px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 30px;
            letter-spacing: 4px;
            text-transform: uppercase;
          }
          .certificate-logo {
            font-size: 32px;
            font-weight: 800;
            color: #000000;
            margin-bottom: 40px;
            letter-spacing: 2px;
          }
          .certificate-title {
            font-size: 28px;
            color: #000000;
            margin: 40px 0;
            font-weight: 600;
            line-height: 1.4;
          }
          .certificate-body {
            font-size: 18px;
            color: #000000;
            margin: 30px 0;
            line-height: 1.8;
            font-weight: 400;
          }
          .certificate-name {
            font-size: 36px;
            font-weight: 700;
            color: #000000;
            margin: 40px 0;
            padding: 20px 0;
            border-top: 2px solid #000000;
            border-bottom: 2px solid #000000;
            letter-spacing: 1px;
          }
          .certificate-description {
            font-size: 16px;
            color: #000000;
            margin: 30px 0;
            line-height: 1.8;
            font-weight: 400;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          .certificate-signature {
            margin-top: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          .signature-image {
            width: 200px;
            height: auto;
            margin-bottom: 10px;
          }
          .signature-line {
            width: 250px;
            height: 2px;
            background: #000000;
            margin: 10px 0;
          }
          .signature-title {
            font-size: 14px;
            color: #000000;
            font-weight: 500;
            margin-top: 5px;
          }
          .certificate-footer {
            margin-top: 50px;
            font-size: 12px;
            color: #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 1px solid #000000;
          }
          .certificate-id {
            font-size: 10px;
            color: #666666;
            font-family: monospace;
            margin-top: 20px;
          }
          .certificate-date {
            font-size: 14px;
            color: #000000;
            font-weight: 500;
          }
          .certificate-stats {
            font-size: 12px;
            color: #000000;
            margin-top: 10px;
            font-weight: 400;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="certificate-logo">BATCLASH</div>
          <div class="certificate-header">Certificate of Achievement</div>
          <div class="certificate-title">${safeTitle}</div>
          <div class="certificate-body">
            This is to certify that
          </div>
          <div class="certificate-name">${safeUserName}</div>
          <div class="certificate-description">
            ${safeDescription}
          </div>
          <div class="certificate-signature">
            ${signatureBase64 ? `<img src="${signatureBase64}" alt="Signature" class="signature-image" />` : '<div class="signature-line"></div>'}
            <div class="signature-title">CEO and Founder of Batclash</div>
          </div>
          <div class="certificate-footer">
            <div class="certificate-stats">
              Rank: ${user.rank} | XP: ${user.xp} | Streak: ${user.streak} days
            </div>
            <div class="certificate-date">
              Issued on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div class="certificate-id">
            Certificate ID: ${safeCertificateId}
          </div>
        </div>
      </body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}


