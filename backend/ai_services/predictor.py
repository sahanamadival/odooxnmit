import random

def predict_delay(operation: str, planned_time: int, actual_time: int, worker_experience: int, machine_efficiency: float) -> str:
    """
    Simple heuristic-based delay predictor.
    Later, replace with ML model (scikit-learn, XGBoost, etc.).
    """
    # Basic rule-based scoring
    score = 0

    # If actual time already > planned, high risk
    if actual_time > planned_time:
        score += 2

    # Less experienced worker → higher risk
    if worker_experience < 2:
        score += 1

    # Low machine efficiency
    if machine_efficiency < 0.7:
        score += 1

    # Random factor (simulating real uncertainty)
    score += random.choice([0, 1])

    if score >= 3:
        return "High"
    elif score == 2:
        return "Medium"
    else:
        return "Low"




