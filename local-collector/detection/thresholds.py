"""
Health Classification Engine:
Evaluates metrics against configured thresholds and assigns one of 4 states:
- EXCELLENT: CPU < 50%, RAM < 60%, Latency < 80ms, 0 Auth Spikes
- GOOD: CPU 50-75% or RAM 60-75% or Latency 80-150ms
- FAIR: CPU > 80% or RAM > 80% or Latency > 200ms
- POOR: CPU > 90%, RAM > 90%, Latency > 400ms, or Auth Attack
"""
from config import (
    CPU_EXCELLENT_MAX, CPU_GOOD_MAX, CPU_FAIR_MAX, CPU_POOR_THRESHOLD,
    RAM_EXCELLENT_MAX, RAM_GOOD_MAX, RAM_FAIR_MAX, RAM_POOR_THRESHOLD,
    LATENCY_EXCELLENT_MAX, LATENCY_GOOD_MAX, LATENCY_FAIR_MAX, LATENCY_POOR_THRESHOLD
)

def classify_health(metrics: dict, attack_flag: bool = False) -> tuple[str, list[str]]:
    cpu = metrics.get("cpu_pct", 0.0)
    ram = metrics.get("ram_pct", 0.0)
    latency = metrics.get("latency_ms", 0.0)
    
    reasons = []

    if attack_flag:
        reasons.append("Credential stuffing / brute-force authentication attack detected")
        return "POOR", reasons

    if cpu >= CPU_POOR_THRESHOLD or ram >= RAM_POOR_THRESHOLD or latency >= LATENCY_POOR_THRESHOLD:
        if cpu >= CPU_POOR_THRESHOLD:
            reasons.append(f"Critical CPU saturation ({cpu}% >= {CPU_POOR_THRESHOLD}%)")
        if ram >= RAM_POOR_THRESHOLD:
            reasons.append(f"Critical Memory pressure ({ram}% >= {RAM_POOR_THRESHOLD}%)")
        if latency >= LATENCY_POOR_THRESHOLD:
            reasons.append(f"Severe Network latency spike ({latency}ms >= {LATENCY_POOR_THRESHOLD}ms)")
        return "POOR", reasons

    if cpu > CPU_FAIR_MAX or ram > RAM_FAIR_MAX or latency > LATENCY_FAIR_MAX:
        if cpu > CPU_FAIR_MAX:
            reasons.append(f"High CPU utilization ({cpu}% > {CPU_FAIR_MAX}%)")
        if ram > RAM_FAIR_MAX:
            reasons.append(f"High Memory usage ({ram}% > {RAM_FAIR_MAX}%)")
        if latency > LATENCY_FAIR_MAX:
            reasons.append(f"Elevated Network latency ({latency}ms > {LATENCY_FAIR_MAX}ms)")
        return "FAIR", reasons

    if cpu > CPU_EXCELLENT_MAX or ram > RAM_EXCELLENT_MAX or latency > LATENCY_EXCELLENT_MAX:
        if cpu > CPU_EXCELLENT_MAX:
            reasons.append(f"Moderate CPU usage ({cpu}%)")
        if ram > RAM_EXCELLENT_MAX:
            reasons.append(f"Moderate Memory usage ({ram}%)")
        if latency > LATENCY_EXCELLENT_MAX:
            reasons.append(f"Normal network latency ({latency}ms)")
        return "GOOD", reasons

    return "EXCELLENT", ["All infrastructure signals within optimal baseline"]
