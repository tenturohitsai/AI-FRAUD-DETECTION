// Mock data for the fraud detection dashboard
export const modelMetrics = {
  xgboost: {
    name: "XGBoost",
    accuracy: 0.9985,
    precision: 0.9621,
    recall: 0.8163,
    f1Score: 0.8832,
    auc: 0.9789,
    trainTime: "12.4s",
  },
  ann: {
    name: "Neural Network (ANN)",
    accuracy: 0.9991,
    precision: 0.9412,
    recall: 0.8571,
    f1Score: 0.8972,
    auc: 0.9834,
    trainTime: "45.2s",
  },
};

export const confusionMatrix = {
  xgboost: { tp: 80, fp: 3, fn: 18, tn: 56761 },
  ann: { tp: 84, fp: 5, fn: 14, tn: 56759 },
};

export const rocCurveData = Array.from({ length: 50 }, (_, i) => {
  const fpr = i / 49;
  return {
    fpr: parseFloat(fpr.toFixed(3)),
    xgboost: parseFloat(Math.min(1, Math.pow(fpr, 0.15)).toFixed(3)),
    ann: parseFloat(Math.min(1, Math.pow(fpr, 0.12)).toFixed(3)),
    random: parseFloat(fpr.toFixed(3)),
  };
});

export const transactionTimeline = [
  { hour: "00:00", legitimate: 1245, fraud: 3 },
  { hour: "02:00", legitimate: 834, fraud: 1 },
  { hour: "04:00", legitimate: 456, fraud: 2 },
  { hour: "06:00", legitimate: 1567, fraud: 5 },
  { hour: "08:00", legitimate: 3421, fraud: 8 },
  { hour: "10:00", legitimate: 4567, fraud: 12 },
  { hour: "12:00", legitimate: 5234, fraud: 15 },
  { hour: "14:00", legitimate: 4890, fraud: 11 },
  { hour: "16:00", legitimate: 5123, fraud: 14 },
  { hour: "18:00", legitimate: 4567, fraud: 9 },
  { hour: "20:00", legitimate: 3456, fraud: 7 },
  { hour: "22:00", legitimate: 2345, fraud: 4 },
];

export const featureImportance = [
  { feature: "V14", importance: 0.182 },
  { feature: "V17", importance: 0.156 },
  { feature: "V12", importance: 0.134 },
  { feature: "V10", importance: 0.098 },
  { feature: "V16", importance: 0.087 },
  { feature: "V3", importance: 0.076 },
  { feature: "V7", importance: 0.065 },
  { feature: "V11", importance: 0.054 },
  { feature: "Amount", importance: 0.048 },
  { feature: "V4", importance: 0.041 },
];

export const recentTransactions = [
  { id: "TXN-8842", amount: 2499.99, time: "14:32:01", risk: 0.94, status: "fraud" as const },
  { id: "TXN-8841", amount: 45.00, time: "14:31:45", risk: 0.02, status: "legitimate" as const },
  { id: "TXN-8840", amount: 1200.50, time: "14:31:22", risk: 0.87, status: "fraud" as const },
  { id: "TXN-8839", amount: 89.99, time: "14:30:58", risk: 0.05, status: "legitimate" as const },
  { id: "TXN-8838", amount: 32.50, time: "14:30:41", risk: 0.01, status: "legitimate" as const },
  { id: "TXN-8837", amount: 3450.00, time: "14:30:15", risk: 0.91, status: "fraud" as const },
  { id: "TXN-8836", amount: 15.99, time: "14:29:52", risk: 0.03, status: "legitimate" as const },
  { id: "TXN-8835", amount: 678.00, time: "14:29:30", risk: 0.12, status: "legitimate" as const },
];

export const datasetStats = {
  totalTransactions: 284807,
  fraudulentCount: 492,
  legitimateCount: 284315,
  fraudPercentage: 0.173,
  features: 30,
  timeSpanHours: 48,
};
