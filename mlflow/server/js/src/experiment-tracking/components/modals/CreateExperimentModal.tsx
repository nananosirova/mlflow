/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { NavigateFunction } from '../../../common/utils/RoutingUtils';
import debounce from 'lodash/debounce';

import Routes from '../../routes';
import { GenericInputModal } from './GenericInputModal';
import { CreateExperimentForm, EXP_NAME_FIELD, ARTIFACT_LOCATION } from './CreateExperimentForm';
import { getExperimentNameValidator } from '../../../common/forms/validations';

import { createExperimentApi } from '../../actions';
import { getExperiments } from '../../reducers/Reducers';
import { withRouterNext } from '../../../common/utils/withRouterNext';
import { fireFormTrackingEvent, getTrackingError } from '../../../odh/analytics/segmentUtils';
import { TrackingOutcome, MLflowEventNames } from '../../../odh/analytics/trackingProperties';

type CreateExperimentModalImplProps = {
  isOpen?: boolean;
  onClose: (...args: any[]) => any;
  experimentNames: string[];
  createExperimentApi: (...args: any[]) => any;
  onExperimentCreated: () => void;
  navigate: NavigateFunction;
};

export class CreateExperimentModalImpl extends Component<CreateExperimentModalImplProps> {
  handleCreateExperiment = async (values: any) => {
    const experimentName = values[EXP_NAME_FIELD];
    const artifactLocation = values[ARTIFACT_LOCATION];

    try {
      const response = await this.props.createExperimentApi(experimentName, artifactLocation);
      fireFormTrackingEvent(MLflowEventNames.EXPERIMENT_CREATED, {
        outcome: TrackingOutcome.submit,
        success: true,
      });
      this.props.onExperimentCreated();

      const {
        value: { experiment_id: newExperimentId },
      } = response;

      if (newExperimentId) {
        this.props.navigate(Routes.getExperimentPageRoute(newExperimentId));
      }
    } catch (e: any) {
      fireFormTrackingEvent(MLflowEventNames.EXPERIMENT_CREATED, {
        outcome: TrackingOutcome.submit,
        success: false,
        error: getTrackingError(e),
      });
      throw e;
    }
  };

  debouncedExperimentNameValidator = debounce(
    getExperimentNameValidator(() => this.props.experimentNames),
    400,
  );

  render() {
    const { isOpen } = this.props;
    return (
      <GenericInputModal
        title="Create Experiment"
        okText="Create"
        isOpen={isOpen}
        handleSubmit={this.handleCreateExperiment}
        onClose={this.props.onClose}
        onCancel={() => {
          fireFormTrackingEvent(MLflowEventNames.EXPERIMENT_CREATED, {
            outcome: TrackingOutcome.cancel,
          });
        }}
      >
        {/* @ts-expect-error TS(2322): Type '{ validator: ((rule: any, value: any, callba... Remove this comment to see the full error message */}
        <CreateExperimentForm validator={this.debouncedExperimentNameValidator} />
      </GenericInputModal>
    );
  }
}

const mapStateToProps = (state: any) => {
  const experiments = getExperiments(state);
  const experimentNames = experiments.map((e) => e.name);
  return { experimentNames };
};

const mapDispatchToProps = {
  createExperimentApi,
};

const ConnectedCreateExperimentModal = connect(mapStateToProps, mapDispatchToProps)(CreateExperimentModalImpl);

export const CreateExperimentModal = withRouterNext(ConnectedCreateExperimentModal);
