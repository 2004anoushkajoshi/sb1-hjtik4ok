import React, { useEffect } from 'react';
import { Wind, Thermometer, Activity, Zap, Battery } from 'lucide-react';
import MetricGauge from './MetricGauge';
import RepairAnimation from './RepairAnimation';
import { DeviceData } from '../utils/dataGenerator';
import { sendNotifications } from '../utils/notifications';

interface DeviceCardProps {
  title: string;
  data: DeviceData;
  type: 'ventilator' | 'defibrillator';
}

const DeviceCard: React.FC<DeviceCardProps> = ({ title, data, type }) => {
  useEffect(() => {
    if (data.status === 'alert') {
      sendNotifications(type, data);
    }
  }, [data.status, type, data]);

  const getCardClassName = () => {
    const baseClass = "bg-white rounded-lg shadow-md p-5 transition-all duration-300 overflow-hidden";
    
    switch (data.status) {
      case 'normal':
        return `${baseClass} border-2 border-emerald-200 card-normal`;
      case 'healing':
        return `${baseClass} border-2 border-amber-300 card-healing`;
      case 'alert':
        return `${baseClass} border-2 border-orange-400 card-alert`;
      case 'emergency':
        return `${baseClass} border-2 border-red-500 card-emergency`;
      default:
        return baseClass;
    }
  };

  const getStatusText = () => {
    switch (data.status) {
      case 'normal':
        return <span className="text-emerald-500 font-medium">Normal Operation</span>;
      case 'healing':
        return <span className="text-amber-500 font-medium">Self-Healing Active</span>;
      case 'alert':
        return <span className="text-orange-500 font-medium">Technician Alert</span>;
      case 'emergency':
        return <span className="text-red-500 font-semibold">EMERGENCY</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  const DefibrillatorLogo = () => (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">♥</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold">+</span>
      </div>
    </div>
  );

  return (
    <div className={getCardClassName()}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          {type === 'ventilator' ? (
            <Wind className="w-5 h-5 mr-2 text-blue-500" />
          ) : (
            <div className="mr-2">
              <DefibrillatorLogo />
            </div>
          )}
          {title}
        </h2>
        <div className="flex items-center">
          {data.status === 'healing' && <RepairAnimation />}
          <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {type === 'ventilator' ? (
          <>
            <MetricGauge
              icon={<Thermometer className="w-4 h-4 text-blue-500" />}
              label="Temperature"
              value={data.metrics.temperature}
              unit="°C"
              min={15}
              max={45}
              thresholds={{ warning: 38, critical: 40 }}
              healing={data.healing?.includes('temperature')}
            />
            <MetricGauge
              icon={<Activity className="w-4 h-4 text-blue-500" />}
              label="Pressure"
              value={data.metrics.pressure}
              unit="cmH₂O"
              min={0}
              max={50}
              thresholds={{ warning: 35, critical: 40 }}
              healing={data.healing?.includes('pressure')}
            />
            <MetricGauge
              icon={<Wind className="w-4 h-4 text-blue-500" />}
              label="Oxygen Level"
              value={data.metrics.oxygenLevel}
              unit="%"
              min={70}
              max={100}
              thresholds={{ warning: 88, critical: 85, reverse: true }}
              healing={data.healing?.includes('oxygen')}
            />
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-blue-500" />
                  Firmware Status
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.metrics.firmwareStatus === 'Responsive' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {data.metrics.firmwareStatus}
                </span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${
                    data.metrics.firmwareStatus === 'Responsive' 
                      ? 'bg-emerald-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: data.metrics.firmwareStatus === 'Responsive' ? '100%' : '30%' }}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <MetricGauge
              icon={<Battery className="w-4 h-4 text-red-500" />}
              label="Battery Voltage"
              value={data.metrics.batteryVoltage}
              unit="V"
              min={8}
              max={16}
              thresholds={{ warning: 10.5, critical: 10, reverse: true }}
              healing={data.healing?.includes('battery')}
            />
            <MetricGauge
              icon={<Activity className="w-4 h-4 text-red-500" />}
              label="ECG Signal"
              value={data.metrics.ecgSignal}
              unit="mV"
              min={-1.0}
              max={1.0}
              thresholds={{ warning: 0.9, critical: 1.0 }}
              healing={data.healing?.includes('ecg')}
            />
            <MetricGauge
              icon={<Thermometer className="w-4 h-4 text-red-500" />}
              label="Device Temperature"
              value={data.metrics.temperature}
              unit="°C"
              min={15}
              max={50}
              thresholds={{ warning: 40, critical: 45 }}
              healing={data.healing?.includes('temperature')}
            />
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-red-500" />
                  Capacitor Readiness
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.metrics.capacitorStatus === 'Ready' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {data.metrics.capacitorStatus}
                </span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full">
                <div 
                  className={`h-1 rounded-full transition-all duration-1000 ${
                    data.metrics.capacitorStatus === 'Ready' 
                      ? 'bg-emerald-500' 
                      : 'bg-amber-500'
                  }`}
                  style={{ width: data.metrics.capacitorStatus === 'Ready' ? '100%' : '60%' }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;