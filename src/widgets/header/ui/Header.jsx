import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, LogOut, User, X, Menu, Bell } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { useSearch, useUI } from '@app/providers/UIContext';
import { styles } from './Header.styles';
import { COLORS, RADIUS } from '@shared/config';
import { useTranslation } from 'react-i18next';

// Route-to-translation mapping for current page title.
const PAGE_TITLES = {
  '/dashboard':      'pageTitle.home',
  '/trips':          'pageTitle.journal',
  '/map':            'pageTitle.worldMap',
  '/explorer':       'pageTitle.hub',
  '/invitations':    'pageTitle.invitations',
  '/settings':       'pageTitle.settings',
  '/admin/curacion': 'pageTitle.curation',
};

const Header = ({ isMobile = false, invitationsCount = 0 }) => {
  const { usuario: user, login, logout } = useAuth();
  const {
    openBuscador: openTripSearch,
    openMobileDrawer,
    mobileDrawerOpen: isDrawerOpen
  } = useUI();
  const { busqueda: query, setBusqueda: setQuery, limpiarBusqueda: clearQuery } = useSearch();
  const { t } = useTranslation(['nav', 'common']);
  const [failedPhoto, setFailedPhoto] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Page title and search visibility are derived from route.
  const pageTitleKey = PAGE_TITLES[pathname] ?? (pathname.startsWith('/trips/') ? 'pageTitle.journal' : null);
  const headerTitle = pageTitleKey ? t(`nav:${pageTitleKey}`) : 'Keeptrip';
  const showSearch  = pathname === '/trips' || pathname.startsWith('/trips/');
  const searchPlaceholder = t('nav:searchJournal');

  const handleSearchIconClick = () => {
    setIsMobileSearchOpen((open) => !open);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
  };

  const initials = useMemo(
    () => user?.displayName?.trim()?.[0]?.toUpperCase() || '',
    [user?.displayName]
  );
  const photoUrl = user?.photoURL || null;
  const canShowPhoto = Boolean(photoUrl && failedPhoto !== photoUrl);

  return (
    <header role="banner" style={styles.header(isMobile)} className="app-shell-focus">
      <div style={styles.leftSide}>
        {isMobile && (
          <button
            type="button"
            style={styles.menuButton}
            onClick={openMobileDrawer}
            aria-label={t('nav:openMenu')}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-sidebar-drawer"
          >
            <Menu size={18} />
          </button>
        )}
        {!isMobile && <span style={styles.breadcrumb}>Keeptrip</span>}
        {!isMobile && <span style={styles.separator}>/</span>}
        <h2 style={styles.titulo(isMobile)}>{headerTitle}</h2>
      </div>

      <div style={styles.rightSide(isMobile)}>
        {!isMobile && showSearch && (
          <div style={styles.searchContainer(isMobile)}>
            <Search size={16} color={COLORS.textSecondary} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              aria-label={t('nav:searchJournal')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                style={styles.clearButton}
                aria-label={t('nav:clearSearch')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {isMobile && showSearch && (
          <button
            type="button"
            onClick={handleSearchIconClick}
            aria-label={isMobileSearchOpen ? t('nav:closeSearch') : t('nav:openSearch')}
            aria-expanded={isMobileSearchOpen}
            aria-controls="mobile-header-search"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textSecondary,
              width: '44px',
              height: '44px',
              borderRadius: RADIUS.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        )}

        <button type="button" style={styles.addButton(isMobile)} onClick={openTripSearch}>
          <Plus size={18} />
          {!isMobile && <span style={styles.addButtonLabel}>{t('nav:addTrip')}</span>}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              data-testid="header-invitations-button"
              onClick={() => navigate('/invitations')}
              aria-label={t('nav:invitations', { count: invitationsCount })}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: COLORS.textSecondary,
                display: 'flex',
                alignItems: 'center',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: RADIUS.md,
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
              {invitationsCount > 0 && (
                <span
                  data-testid="header-invitations-count"
                  aria-live="polite"
                  style={{
                    background: COLORS.danger,
                    color: COLORS.surface,
                    borderRadius: RADIUS.sm,
                    padding: '4px 8px',
                    fontSize: 12,
                    marginLeft: 8
                  }}
                >
                  {invitationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              data-testid="header-avatar"
              style={{ ...styles.avatar, cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
              title={t('nav:settings')}
              aria-label={t('nav:settings')}
            >
              {canShowPhoto ? (
                <img
                  src={photoUrl}
                  alt={t('nav:avatarAlt', { name: user.displayName || '' })}
                  style={{ width: '100%', height: '100%', borderRadius: RADIUS.full, objectFit: 'cover' }}
                  onError={() => setFailedPhoto(photoUrl)}
                />
              ) : initials ? (
                <span style={styles.avatarInitials}>{initials}</span>
              ) : (
                <User size={20} />
              )}
            </button>

            {!isMobile && (
              <button
                type="button"
                data-testid="header-logout-button"
                onClick={logout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={t('common:logout')}
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            data-testid="header-login-button"
            onClick={login}
            style={{ ...styles.addButton(isMobile), backgroundColor: COLORS.mutedTeal }}
          >
            {t('common:login')}
          </button>
        )}
      </div>

      {isMobile && showSearch && isMobileSearchOpen && (
        <div id="mobile-header-search" style={styles.mobileSearchPanel}>
          <div style={styles.searchContainer(true)}>
            <Search size={16} color={COLORS.textSecondary} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              aria-label={t('nav:searchJournal')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
              autoFocus
            />
            {query ? (
              <button
                type="button"
                onClick={clearQuery}
                style={styles.clearButton}
                aria-label={t('nav:clearSearch')}
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMobileSearchClose}
                style={styles.clearButton}
                aria-label={t('nav:closeSearch')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
