import React from 'react';
import { Terminal, Clock, AlertCircle, CheckCircle, Settings, AlertTriangle } from 'lucide-react';
import { LogEntry } from '../utils/dataGenerator';

interface DiagnosticsPanelProps {
  logs: LogEntry[];
}

const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({ logs }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'healing':
        return <Settings className="h-4 w-4 text-amber-500 repair-icon" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'emergency':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Terminal className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'healing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'alert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-slate-600" />
          System Diagnostics
        </h2>
        <span className="text-xs text-slate-500 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Live Feed
        </span>
      </div>
      
      <div className="h-60 overflow-y-auto diagnostics-feed">
        <div className="space-y-2">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`border-l-4 p-3 rounded-r-md flex items-start animate-fadeIn ${getStatusClassName(log.status)}`}
            >
              <div className="mr-2 mt-0.5">
                {getStatusIcon(log.status)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize">
                    {log.device}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPanel;