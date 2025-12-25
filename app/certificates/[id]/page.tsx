'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { Emoji } from 'react-apple-emojis';
import { motion } from 'framer-motion';

interface Certificate {
  _id: string;
  certificateId: string;
  type: string;
  title: string;
  description: string;
  issuedAt: string;
  userId: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function CertificatePage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [params.id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/certificates/${params.id}`);
      const data = await res.json();
      setCertificate(data.certificate);
    } catch (error) {
      console.error('Error fetching certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: certificate?.type,
          title: certificate?.title,
          description: certificate?.description,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate?.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = () => {
    const certificateUrl = `${window.location.origin}/certificates/${params.id}`;
    const shareText = encodeURIComponent(
      `I just earned a certificate from Batclash! 🎉\n\n${certificate?.title}\n\nCheck out my achievement:`
    );
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;
    window.open(linkedInUrl, '_blank');
  };

  if (loading) {
    return <Loading />;
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg">Certificate not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Emoji name="trophy" width={32} height={32} />
                Certificate of Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{certificate.title}</h2>
                <p className="text-lg text-muted-foreground">
                  This certificate is awarded to
                </p>
                <h3 className="text-3xl font-bold border-t border-b border-border py-4">
                  {certificate.userId.name}
                </h3>
                <p className="text-base text-muted-foreground">
                  {certificate.description}
                </p>
                <div className="text-sm text-muted-foreground mt-6">
                  Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Certificate ID: {certificate.certificateId}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 bg-foreground text-background hover:opacity-90"
                >
                  {downloading ? 'Downloading...' : (
                    <>
                      <Emoji name="page-with-curl" width={16} height={16} className="mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShareLinkedIn}
                  variant="outline"
                  className="flex-1 border-border"
                >
                  <Emoji name="link" width={16} height={16} className="mr-2" />
                  Share on LinkedIn
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Share your achievement on LinkedIn to showcase your coding skills!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

