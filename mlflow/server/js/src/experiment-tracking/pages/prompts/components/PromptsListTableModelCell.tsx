import { Typography } from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { FormattedMessage } from 'react-intl';
import type { RegisteredPrompt } from '../types';
import { PromptModelName } from './PromptModelName';

export const PromptsListTableModelCell: ColumnDef<RegisteredPrompt>['cell'] = ({ getValue }) => {
  const rawValue = getValue();
  const modelName = typeof rawValue === 'string' ? rawValue : undefined;

  if (!modelName) {
    return (
      <Typography.Text color="secondary">
        <FormattedMessage
          defaultMessage="Not specified"
          description="Fallback text shown in the Associated Model column when a prompt has no model configuration"
        />
      </Typography.Text>
    );
  }

  return <PromptModelName modelName={modelName} componentId="mlflow.prompts.list.model.tooltip" />;
};
