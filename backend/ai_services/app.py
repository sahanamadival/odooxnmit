from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict_delay

app = FastAPI(title="AI Delay Predictor", version="1.0")

# Input schema for API
class WorkOrderInput(BaseModel):
    operation: str
    planned_time: int   # minutes
    actual_time: int    # minutes (so far)
    worker_experience: int  # years
    machine_efficiency: float  # 0 to 1

@app.get("/")
def root():
    return {"message": "AI Delay Predictor Running ✅"}

@app.post("/predict")
def predict(data: WorkOrderInput):
    result = predict_delay(
        operation=data.operation,
        planned_time=data.planned_time,
        actual_time=data.actual_time,
        worker_experience=data.worker_experience,
        machine_efficiency=data.machine_efficiency
    )
    return {"delay_risk": result}
