import type { ResponseBlock, TrustedPerson } from '../../lib/assistant/types';
import { PersonBlock } from '../maitri/PersonBlock';
import { ReminderBlock } from '../maitri/ReminderBlock';
import { AgriInsightBlock } from '../nari/AgriInsightBlock';
import { ImageReceivedBlock } from '../nari/ImageReceivedBlock';
import { SensorRow } from '../nari/SensorRow';
import { AlertIcon, InfoIcon } from './icons';
import { SafetyNotice } from './SafetyNotice';

interface Props {
  blocks: ResponseBlock[];
  people: TrustedPerson[];
  onConfirmReminder: (reminderId: string) => Promise<void>;
  onCancelReminder: (reminderId: string) => void;
}

/** Renders one reply as a single flow, whichever domain produced each part. */
export function ResponseBlocks({ blocks, people, onConfirmReminder, onCancelReminder }: Props) {
  const person = (id: string) => people.find((p) => p.id === id);
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'text':
            return <p key={i} className="msg__text">{block.text}</p>;
          case 'agri-insight':
            return <AgriInsightBlock key={i} title={block.title} body={block.body} evidence={block.evidence} />;
          case 'sensor':
            return (
              <div key={i} className="block block--sensor">
                <SensorRow reading={block.reading} />
              </div>
            );
          case 'reminder':
            return (
              <ReminderBlock
                key={block.reminder.id}
                reminder={block.reminder}
                person={person(block.reminder.personId)}
                onConfirm={() => onConfirmReminder(block.reminder.id)}
                onCancel={() => onCancelReminder(block.reminder.id)}
              />
            );
          case 'safety':
            return <SafetyNotice key={i} action={block.action} reason={block.reason} />;
          case 'image-received':
            return <ImageReceivedBlock key={i} name={block.attachmentName} />;
          case 'person':
            return <PersonBlock key={i} person={person(block.personId)} />;
          case 'notice': {
            const Icon = block.tone === 'warning' ? AlertIcon : InfoIcon;
            return (
              <p key={i} className={`block block--notice is-${block.tone}`}>
                <Icon width={16} height={16} />
                <span>{block.text}</span>
              </p>
            );
          }
        }
      })}
    </>
  );
}
