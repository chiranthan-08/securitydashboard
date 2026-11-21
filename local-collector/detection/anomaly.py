import collections
import math

class DynamicSamplingEngine:
    def __init__(self, history_size=20, z_threshold=2.5):
        self.cpu_history = collections.deque(maxlen=history_size)
        self.latency_history = collections.deque(maxlen=history_size)
        self.z_threshold = z_threshold
        self.cooldown_counter = 0

    def add_sample(self, cpu: float, latency: float):
        self.cpu_history.append(cpu)
        self.latency_history.append(latency)

    def calculate_z_score(self, current: float, history: collections.deque) -> float:
        if len(history) < 5:
            return 0.0
        mean = sum(history) / len(history)
        variance = sum((x - mean) ** 2 for x in history) / len(history)
        std = math.sqrt(variance)
        if std < 1e-4:
            return 0.0
        return (current - mean) / std

    def evaluate_sampling_mode(self, health_state: str, metrics: dict) -> tuple[str, float]:
        cpu = metrics.get("cpu_pct", 0.0)
        latency = metrics.get("latency_ms", 0.0)

        cpu_z = self.calculate_z_score(cpu, self.cpu_history)
        latency_z = self.calculate_z_score(latency, self.latency_history)
        max_z = max(abs(cpu_z), abs(latency_z))

        self.add_sample(cpu, latency)

        # Anomaly or degraded health triggers high frequency or full anomaly burst
        if health_state == "POOR" or max_z > self.z_threshold:
            self.cooldown_counter = 6  # 6 cycles cooldown before returning to normal
            return "ANOMALY_BURST", max_z
        elif health_state == "FAIR":
            self.cooldown_counter = 4
            return "HIGH_FREQ_BURST", max_z
        elif self.cooldown_counter > 0:
            self.cooldown_counter -= 1
            return "STANDARD_SUMMARY", max_z
        elif health_state == "GOOD":
            return "STANDARD_SUMMARY", max_z
        else:
            return "HEARTBEAT", max_z
