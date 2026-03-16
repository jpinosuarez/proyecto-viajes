import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '@shared/lib/hooks/useWindowSize';
import { styles } from './Footer.styles';

const Footer = () => {
  const { t } = useTranslation('landing');
  const { isMobile } = useWindowSize();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: t('footer.terms'), href: '#terms' },
    { label: t('footer.privacy'), href: '#privacy' },
    { label: t('footer.contact'), href: '#contact' },
  ];

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.footerWrapper}>
        {/* Brand and Links Row */}
        <div style={styles.footerTop(isMobile)}>
          <div style={styles.footerBrand}>
            Keeptrip
          </div>
          <nav style={styles.footerLinks(isMobile)}>
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                style={styles.footerLink}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={styles.footerDivider} />

        {/* Copyright */}
        <div style={styles.footerBottom(isMobile)}>
          <p style={styles.copyrightText}>
            © {currentYear} Keeptrip. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
