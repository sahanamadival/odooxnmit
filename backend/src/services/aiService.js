import axios from "axios";

const AI_BASE_URL = process.env.AI_URL || "http://localhost:8001"; 

export const getDelayRisk = async (workOrder) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/predict`, {
      operation: workOrder.operation,
      planned_time: workOrder.duration,
      actual_time: workOrder.actualTime,
      worker_experience: workOrder.workerExperience || 2, // default
      machine_efficiency: workOrder.machineEfficiency || 0.8, // default
    });

    return response.data.delay_risk; // "Low" | "Medium" | "High"
  } catch (err) {
    console.error("AI Service Error:", err.message);
    return "Unknown"; // fallback if AI service down
  }
};
