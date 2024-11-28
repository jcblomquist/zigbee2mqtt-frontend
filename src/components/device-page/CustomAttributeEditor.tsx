import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceApi } from '../../actions/DeviceApi';

import { LogMessage } from '../../store';
import { Device } from '../../types';
import { LastLogResult } from './LastLogResult';
import Button from '../button';

import { AttributeInfo } from 'AttributeEditor';

export const logStartingStrings = ['Read result of', "Publish 'set' 'read' to", "Publish 'set' 'write' to", 'Wrote '];

interface CustomAttributeEditorProps extends Pick<DeviceApi, 'writeCustomDeviceAttribute' | 'readDeviceAttributes'> {
    logs: LogMessage[];
    device: Device;
}
export const CustomAttributeEditor = (props: CustomAttributeEditorProps): JSX.Element => {
    const { writeCustomDeviceAttribute, readDeviceAttributes, device, logs } = props;
    const { t } = useTranslation('zigbee');
    const [endpoint, setEndpoint] = useState<string>('');
    const [cluster, setCluster] = useState<string>('');
    const [attribute, setAttribute] = useState<string>('');
    const [data_type, setDataType] = useState<string>('');
    const [data, setData] = useState<string>('');
    const noAttributesSelected = attribute === '';
    const noSelectedCluster = cluster === '';
    const onReadClick = () => {
        const payload = [];
        payload.push(parseInt(attribute));
        readDeviceAttributes(
            device.friendly_name,
            parseInt(endpoint),
            parseInt(cluster),
            payload,
            {} // options
        );
    };
    const onWriteClick = () => {
      writeCustomDeviceAttribute(
            device.friendly_name, 
            parseInt(endpoint), 
            parseInt(cluster), 
            attribute, 
            parseInt(data_type), 
            data, 
            {} // options
        );
    };
    const logsFilterFn = (l: LogMessage) =>
        logStartingStrings.some((startString) => l.message.startsWith(startString));
    return (
        <div>
            <div className="mb-3 row">
                <div className="col-6 col-sm-1">
                  <div className="col-auto">
                      <label className="form-label">{t('endpoint')}</label>
                      <input
                          type="text"
                          value={endpoint}
                          placeholder={'example: 0x0001, 1, 123'}
                          onChange={(e) => setEndpoint(e.target.value)}
                          className="form-control"
                      />
                  </div>
                </div>
                <div className="col-6 col-sm-1">
                  <div className="col-auto">
                      <label className="form-label">{t('cluster')}</label>
                      <input
                          type="text"
                          value={cluster}
                          placeholder={'example: 0x0001, 1, 123'}
                          onChange={(e) => setCluster(e.target.value)}
                          className="form-control"
                      />
                  </div>
                </div>
                <div className="col-6 col-sm-1">
                  <div className="col-auto">
                      <label className="form-label">{t('attribute')}</label>
                      <input
                          type="text"
                          value={attribute}
                          placeholder={'example: 0x0001, 1, 123'}
                          onChange={(e) => setAttribute(e.target.value)}
                          className="form-control"
                      />
                  </div>
                </div>
                <div className="col-6 col-sm-1">
                  <div className="col-auto">
                      <label className="form-label">{t('data_type')}</label>
                      <input
                          type="text"
                          value={data_type}
                          placeholder={'example: 0x0001, 1, 123'}
                          onChange={(e) => setDataType(e.target.value)}
                          className="form-control"
                      />
                  </div>
                </div>
                <div className="col-6 col-sm-4">
                  <div className="col-auto">
                      <label className="form-label">{t('value')}</label>
                      <input
                          type="text"
                          value={data}
                          placeholder={'example: 0x0001, 123, asdf, 3.14'}
                          onChange={(e) => setData(e.target.value)}
                          className="form-control"
                      />
                  </div>
                </div>
            </div>
            <div className="mb-3 row">
                <div className="btn-group col col-3" role="group">
                    <Button<void>
                        disabled={noAttributesSelected || noSelectedCluster}
                        className="btn btn-success me-2"
                        data-testid="read-attribute"
                        onClick={onReadClick}
                    >
                        {t('read')}
                    </Button>
                    <Button<void>
                        disabled={noAttributesSelected || noSelectedCluster}
                        className="btn btn-danger"
                        data-testid="write-attribute"
                        onClick={onWriteClick}
                    >
                        {t('write')}
                    </Button>
                </div>
            </div>
            <LastLogResult logs={logs} filterFn={logsFilterFn} />
        </div>
    );
};
