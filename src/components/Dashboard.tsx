import React, { useState, useEffect } from 'react';
import DeviceCard from './DeviceCard';
import DiagnosticsPanel from './DiagnosticsPanel';
import { generateDeviceData, DeviceData, LogEntry } from '../utils/dataGenerator';

const Dashboard: React.FC = () => {
  const [ventilatorData, setVentilatorData] = useState<DeviceData>(
    generateDeviceData('ventilator')
  );
  const [defibrillatorData, setDefibrillatorData] = useState<DeviceData>(
    generateDeviceData('defibrillator')
  );
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      device: 'system',
      message: 'Monitoring system initialized',
      status: 'normal',
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new data for both devices
      const newVentilatorData = generateDeviceData('ventilator', ventilatorData);
      const newDefibrillatorData = generateDeviceData('defibrillator', defibrillatorData);
      
      // Update state
      setVentilatorData(newVentilatorData);
      setDefibrillatorData(newDefibrillatorData);
      
      // Generate logs based on new data
      const newLogs: LogEntry[] = [];
      
      // Check ventilator logs
      if (newVentilatorData.status !== ventilatorData.status) {
        newLogs.push({
          id: Date.now().toString() + '-vent',
          device: 'ventilator',
          message: getStatusMessage('ventilator', newVentilatorData.status),
          status: newVentilatorData.status,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Check defibrillator logs
      if (newDefibrillatorData.status !== defibrillatorData.status) {
        newLogs.push({
          id: Date.now().toString() + '-defib',
          device: 'defibrillator',
          message: getStatusMessage('defibrillator', newDefibrillatorData.status),
          status: newDefibrillatorData.status,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Add logs if there are any
      if (newLogs.length > 0) {
        setLogs(prevLogs => [...newLogs, ...prevLogs].slice(0, 50));
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [ventilatorData, defibrillatorData]);
  
  const getStatusMessage = (device: string, status: string): string => {
    if (device === 'ventilator') {
      switch (status) {
        case 'healing':
          return 'Ventilator self-healing initiated - adjusting parameters';
        case 'alert':
          return 'Ventilator requires technician attention';
        case 'emergency':
          return 'CRITICAL: Ventilator system emergency - backup system activated';
        default:
          return 'Ventilator operating normally';
      }
    } else {
      switch (status) {
        case 'healing':
          return 'Defibrillator self-correction in progress';
        case 'alert':
          return 'Defibrillator maintenance required';
        case 'emergency':
          return 'CRITICAL: Defibrillator malfunction detected';
        default:
          return 'Defibrillator ready for use';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeviceCard 
          title="Ventilator" 
          data={ventilatorData} 
          type="ventilator"
        />
        <DeviceCard 
          title="Defibrillator" 
          data={defibrillatorData} 
          type="defibrillator"
        />
      </div>
      
      <DiagnosticsPanel logs={logs} />
    </div>
  );
};

export default Dashboard;