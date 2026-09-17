import { Tooltip } from '@databricks/design-system';
import { useRef, useState } from 'react';

export const PromptModelName = ({ modelName, componentId }: { modelName: string; componentId: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  return (
    <Tooltip componentId={componentId} content={isTruncated ? modelName : undefined}>
      <span
        ref={ref}
        onMouseEnter={() => ref.current && setIsTruncated(ref.current.scrollWidth > ref.current.clientWidth)}
        css={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {modelName}
      </span>
    </Tooltip>
  );
};
