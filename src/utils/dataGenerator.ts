// Types for device data and log entries
export interface DeviceData {
  id: string;
  status: 'normal' | 'healing' | 'alert' | 'emergency';
  metrics: {
    // Common metrics
    temperature: number;
    
    // Ventilator specific
    pressure?: number;
    oxygenLevel?: number;
    firmwareStatus?: 'Responsive' | 'Unresponsive';
    
    // Defibrillator specific
    batteryVoltage?: number;
    ecgSignal?: number;
    capacitorStatus?: 'Ready' | 'Not Ready';
  };
  healing?: string[]; // Array of metrics currently being healed
  lastUpdated: Date;
}

export interface LogEntry {
  id: string;
  device: string;
  message: string;
  status: 'normal' | 'healing' | 'alert' | 'emergency';
  timestamp: string;
}

// Utility function to get a random number within a range
const getRandomValue = (min: number, max: number, precision: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
};

// Function to create small fluctuations in values for realistic data
const createFluctuation = (
  currentValue: number, 
  min: number, 
  max: number, 
  maxChange: number = 0.3
): number => {
  // Generate a random change amount, smaller than maxChange
  const change = (Math.random() * maxChange * 2) - maxChange;
  
  // Apply the change to the current value
  let newValue = currentValue + change;
  
  // Ensure the new value is within the min-max range
  newValue = Math.max(min, Math.min(max, newValue));
  
  return parseFloat(newValue.toFixed(1));
};

// Determine if a metric needs healing based on thresholds
const needsHealing = (
  value: number, 
  warningThreshold: number, 
  criticalThreshold: number, 
  isReversed: boolean = false
): boolean => {
  if (isReversed) {
    // For metrics where lower is worse (like oxygen or battery)
    return value <= warningThreshold + 1 && value > criticalThreshold;
  } else {
    // For metrics where higher is worse (like temperature)
    return value >= warningThreshold - 1 && value < criticalThreshold;
  }
};

// Heal a metric gradually toward normal range
const healMetric = (
  value: number, 
  targetValue: number, 
  healingRate: number = 0.5
): number => {
  // Move the value toward the target at the healing rate
  if (value < targetValue) {
    value = Math.min(value + healingRate, targetValue);
  } else if (value > targetValue) {
    value = Math.max(value - healingRate, targetValue);
  }
  
  return parseFloat(value.toFixed(1));
};

// Generate or update device data
export const generateDeviceData = (
  deviceType: 'ventilator' | 'defibrillator',
  previousData?: DeviceData
): DeviceData => {
  // If we have previous data, update it with fluctuations
  // Otherwise create new data
  if (previousData) {
    return updateDeviceData(deviceType, previousData);
  } else {
    return createInitialDeviceData(deviceType);
  }
};

// Create initial data for a device
const createInitialDeviceData = (deviceType: 'ventilator' | 'defibrillator'): DeviceData => {
  // Common base data
  const baseData: DeviceData = {
    id: `${deviceType}-${Date.now()}`,
    status: 'normal',
    metrics: {
      temperature: getRandomValue(deviceType === 'ventilator' ? 25 : 30, 35),
    },
    lastUpdated: new Date()
  };
  
  // Add device-specific metrics
  if (deviceType === 'ventilator') {
    baseData.metrics = {
      ...baseData.metrics,
      pressure: getRandomValue(10, 25),
      oxygenLevel: getRandomValue(92, 98),
      firmwareStatus: Math.random() > 0.1 ? 'Responsive' : 'Unresponsive'
    };
  } else {
    baseData.metrics = {
      ...baseData.metrics,
      batteryVoltage: getRandomValue(12, 13.5),
      ecgSignal: getRandomValue(-0.8, 0.8),
      capacitorStatus: Math.random() > 0.1 ? 'Ready' : 'Not Ready'
    };
  }
  
  return baseData;
};

// Update existing device data with realistic fluctuations
const updateDeviceData = (
  deviceType: 'ventilator' | 'defibrillator',
  previousData: DeviceData
): DeviceData => {
  // Clone previous data to avoid mutations
  const newData: DeviceData = JSON.parse(JSON.stringify(previousData));
  newData.lastUpdated = new Date();
  
  // Initialize healing array if it doesn't exist
  if (!newData.healing) {
    newData.healing = [];
  }
  
  // Occasionally introduce a mild problem to demonstrate healing
  const introduceProblem = Math.random() < 0.1;
  
  // Update device-specific metrics with realistic fluctuations
  if (deviceType === 'ventilator') {
    // Update temperature with natural fluctuation
    newData.metrics.temperature = createFluctuation(
      newData.metrics.temperature!, 
      20, 
      45
    );
    
    // Update pressure with natural fluctuation
    newData.metrics.pressure = createFluctuation(
      newData.metrics.pressure!, 
      5, 
      50
    );
    
    // Update oxygen level with natural fluctuation
    newData.metrics.oxygenLevel = createFluctuation(
      newData.metrics.oxygenLevel!, 
      80, 
      100,
      0.2
    );
    
    // Occasionally change firmware status
    if (Math.random() < 0.03) {
      newData.metrics.firmwareStatus = newData.metrics.firmwareStatus === 'Responsive' 
        ? 'Unresponsive' 
        : 'Responsive';
    }
    
    // Introduce random problem for demo purposes
    if (introduceProblem) {
      const problemType = Math.floor(Math.random() * 3);
      
      switch (problemType) {
        case 0:
          // Temperature problem
          newData.metrics.temperature = getRandomValue(38, 39.5);
          break;
        case 1:
          // Pressure problem
          newData.metrics.pressure = getRandomValue(30, 34);
          break;
        case 2:
          // Oxygen problem
          newData.metrics.oxygenLevel = getRandomValue(86, 89);
          break;
      }
    }
    
    // Check for metrics that need healing
    const tempNeedsHealing = needsHealing(newData.metrics.temperature, 38, 40);
    const pressureNeedsHealing = needsHealing(newData.metrics.pressure!, 35, 40);
    const oxygenNeedsHealing = needsHealing(newData.metrics.oxygenLevel!, 88, 85, true);
    
    // Apply healing to problematic metrics
    if (tempNeedsHealing) {
      newData.metrics.temperature = healMetric(newData.metrics.temperature, 36);
      if (!newData.healing.includes('temperature')) {
        newData.healing.push('temperature');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'temperature');
    }
    
    if (pressureNeedsHealing) {
      newData.metrics.pressure = healMetric(newData.metrics.pressure!, 28);
      if (!newData.healing.includes('pressure')) {
        newData.healing.push('pressure');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'pressure');
    }
    
    if (oxygenNeedsHealing) {
      newData.metrics.oxygenLevel = healMetric(newData.metrics.oxygenLevel!, 92, 0.8);
      if (!newData.healing.includes('oxygen')) {
        newData.healing.push('oxygen');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'oxygen');
    }
    
  } else {
    // Defibrillator updates
    
    // Update temperature with natural fluctuation
    newData.metrics.temperature = createFluctuation(
      newData.metrics.temperature!, 
      25, 
      50
    );
    
    // Update battery voltage with natural fluctuation (slight drain over time)
    newData.metrics.batteryVoltage = createFluctuation(
      newData.metrics.batteryVoltage!, 
      8, 
      14,
      0.15
    );
    
    // Update ECG signal with more pronounced fluctuations
    newData.metrics.ecgSignal = createFluctuation(
      newData.metrics.ecgSignal!, 
      -1.0, 
      1.0,
      0.2
    );
    
    // Occasionally change capacitor status
    if (Math.random() < 0.05) {
      newData.metrics.capacitorStatus = newData.metrics.capacitorStatus === 'Ready' 
        ? 'Not Ready' 
        : 'Ready';
    }
    
    // Introduce random problem for demo purposes
    if (introduceProblem) {
      const problemType = Math.floor(Math.random() * 3);
      
      switch (problemType) {
        case 0:
          // Temperature problem
          newData.metrics.temperature = getRandomValue(39, 42);
          break;
        case 1:
          // Battery problem
          newData.metrics.batteryVoltage = getRandomValue(10.2, 10.8);
          break;
        case 2:
          // ECG problem
          newData.metrics.ecgSignal = getRandomValue(0.9, 1.0);
          break;
      }
    }
    
    // Check for metrics that need healing
    const tempNeedsHealing = needsHealing(newData.metrics.temperature, 40, 45);
    const batteryNeedsHealing = needsHealing(newData.metrics.batteryVoltage!, 10.5, 10, true);
    const ecgNeedsHealing = needsHealing(Math.abs(newData.metrics.ecgSignal!), 0.9, 1.0);
    
    // Apply healing to problematic metrics
    if (tempNeedsHealing) {
      newData.metrics.temperature = healMetric(newData.metrics.temperature, 37);
      if (!newData.healing.includes('temperature')) {
        newData.healing.push('temperature');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'temperature');
    }
    
    if (batteryNeedsHealing) {
      newData.metrics.batteryVoltage = healMetric(newData.metrics.batteryVoltage!, 11.5, 0.3);
      if (!newData.healing.includes('battery')) {
        newData.healing.push('battery');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'battery');
    }
    
    if (ecgNeedsHealing) {
      newData.metrics.ecgSignal = healMetric(newData.metrics.ecgSignal!, 0, 0.2);
      if (!newData.healing.includes('ecg')) {
        newData.healing.push('ecg');
      }
    } else {
      newData.healing = newData.healing.filter(item => item !== 'ecg');
    }
  }
  
  // Determine overall device status based on metrics and healing
  const determineStatus = (): 'normal' | 'healing' | 'alert' | 'emergency' => {
    // Check for critical conditions first (emergency)
    if (deviceType === 'ventilator') {
      if (
        newData.metrics.temperature! >= 40 ||
        newData.metrics.pressure! >= 40 ||
        newData.metrics.oxygenLevel! <= 85
      ) {
        return 'emergency';
      }
      
      // Check for alert conditions
      if (
        (newData.metrics.temperature! >= 38 && !newData.healing.includes('temperature')) ||
        (newData.metrics.pressure! >= 35 && !newData.healing.includes('pressure')) ||
        (newData.metrics.oxygenLevel! <= 88 && !newData.healing.includes('oxygen')) ||
        newData.metrics.firmwareStatus === 'Unresponsive'
      ) {
        return 'alert';
      }
    } else {
      // Defibrillator critical conditions
      if (
        newData.metrics.temperature! >= 45 ||
        newData.metrics.batteryVoltage! <= 10 ||
        Math.abs(newData.metrics.ecgSignal!) >= 1.0
      ) {
        return 'emergency';
      }
      
      // Check for alert conditions
      if (
        (newData.metrics.temperature! >= 40 && !newData.healing.includes('temperature')) ||
        (newData.metrics.batteryVoltage! <= 10.5 && !newData.healing.includes('battery')) ||
        (Math.abs(newData.metrics.ecgSignal!) >= 0.9 && !newData.healing.includes('ecg')) ||
        newData.metrics.capacitorStatus === 'Not Ready'
      ) {
        return 'alert';
      }
    }
    
    // If any healing is in progress, status is 'healing'
    if (newData.healing.length > 0) {
      return 'healing';
    }
    
    // Default status is normal
    return 'normal';
  };
  
  // Set the overall status
  newData.status = determineStatus();
  
  return newData;
};