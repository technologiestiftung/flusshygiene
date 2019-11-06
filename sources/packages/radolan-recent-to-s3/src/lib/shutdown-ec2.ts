// taken from https://hackernoon.com/basics-of-running-anything-on-aws-part-1-setup-running-logging-d3be42ab2094
import AWS from 'aws-sdk';
import { logger } from './logger';

const ec2 = new AWS.EC2({region: 'eu-central-1'});

export const shutDownEC2 = (instanceId: string|undefined) => {
  try {
    if (instanceId === undefined) {
      throw Error('No instance ID');
    }
    logger.info('Shutting down ec2\n');

    ec2.stopInstances({
      InstanceIds: [instanceId],
    }, (err, _data) => {
      if (err) {
        logger.error(JSON.stringify(err));
        // Trigger some alerting here
      } else {
        logger.info('Done\n');
      }
    },
    );
  } catch (err) {
    logger.error(`Could not shutdown EC2 ${JSON.stringify(err)}\n`);
  }
};
