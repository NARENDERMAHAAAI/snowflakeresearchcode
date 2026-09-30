import { useI18n } from '../../i18n/I18nProvider';
import { CameraIcon } from '../assistant/icons';

export function ImageReceivedBlock({ name }: { name: string }) {
  const { t } = useI18n();
  return (
    <p className="block block--image">
      <CameraIcon width={16} height={16} />
      <span>
        {t('imageReceived')}: <span className="break">{name}</span>
        <span className="muted small"> · {t('imageAnalysisPending')}</span>
      </span>
    </p>
  );
}
