const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: 'Labtronix Metrology S.A.S.',
  url: (configuredSiteUrl || 'https://labtronix1.duckdns.org').replace(/\/$/, ''),
  description:
    'Servicios de calibración metrológica y venta de instrumental de precisión en Colombia.',
  email: 'comercial1@labtronix.com.co',
  phone: '+57 312 573 0305',
  whatsapp: '+57 316 024 9528',
  address: 'Calle 69 B #90B-48, oficina 202, Bogotá D.C.',
  social: {
    facebook: 'https://www.facebook.com/LabtronixMetrology',
    linkedin: 'https://www.linkedin.com/in/labtronix-metrology-sas-28bba8244/',
    instagram: 'https://www.instagram.com/labtronix_metrologysas/',
  },
};
