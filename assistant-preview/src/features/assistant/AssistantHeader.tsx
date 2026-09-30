import { useI18n } from '../../i18n/I18nProvider';
import { localeNames } from '../../i18n/strings';
import type { FarmStatus, Locale } from '../../lib/assistant/types';
import { PanelIcon } from './icons';

interface Props {
  farm?: FarmStatus;
  showContextButton: boolean;
  onOpenContext: () => void;
}

/** Identity, farm context and subtle capability indicators — never a mode switch. */
export function AssistantHeader({ farm, showContextButton, onOpenContext }: Props) {
  const { t, locale, setLocale } = useI18n();
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <p className="app-header__name">{t('appName')}</p>
          <p className="app-header__farm">{farm ? `${farm.farmName} · ${farm.fieldName}` : t('appTagline')}</p>
        </div>
      </div>

      <ul className="capabilities" aria-label={t('capabilities')}>
        <li className="capability capability--nari">
          <span className="capability__dot" aria-hidden="true" />
          {t('nariCapability')}
          <span className="visually-hidden"> — {t('capabilityReady')}</span>
        </li>
        <li className="capability capability--maitri">
          <span className="capability__dot" aria-hidden="true" />
          {t('maitriCapability')}
          <span className="visually-hidden"> — {t('capabilityReady')}</span>
        </li>
      </ul>

      <div className="app-header__tools">
        <span className="tag tag--preview">{t('previewBadge')}</span>
        <div className="lang-switch" role="group" aria-label={t('language')}>
          {(Object.keys(localeNames) as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              aria-pressed={locale === l}
              className="lang-switch__btn"
              onClick={() => setLocale(l)}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
        {showContextButton && (
          <button type="button" className="icon-btn icon-btn--labelled" onClick={onOpenContext} aria-haspopup="dialog">
            <PanelIcon />
            <span>{t('openContext')}</span>
          </button>
        )}
      </div>
    </header>
  );
}
