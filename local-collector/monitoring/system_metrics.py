import psutil
import time
import random

class MetricsCollector:
    def __init__(self):
        self._last_net_bytes = None
        self._last_net_time = None
        self.simulated_overrides = {}

    def set_simulation(self, cpu=None, ram=None, disk=None, latency=None, packet_loss=None):
        if cpu is not None:
            self.simulated_overrides['cpu_pct'] = float(cpu)
        if ram is not None:
            self.simulated_overrides['ram_pct'] = float(ram)
        if disk is not None:
            self.simulated_overrides['disk_pct'] = float(disk)
        if latency is not None:
            self.simulated_overrides['latency_ms'] = float(latency)
        if packet_loss is not None:
            self.simulated_overrides['packet_loss_pct'] = float(packet_loss)

    def clear_simulation(self):
        self.simulated_overrides.clear()

    def collect(self):
        now = time.time()
        
        # Real psutil metrics
        cpu = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent if hasattr(psutil, 'disk_usage') else 45.0
        
        # Network bytes per second calculation
        net = psutil.net_io_counters()
        total_bytes = net.bytes_recv + net.bytes_sent
        net_bps = 0.0
        if self._last_net_bytes is not None and self._last_net_time is not None:
            elapsed = now - self._last_net_time
            if elapsed > 0:
                net_bps = max(0.0, (total_bytes - self._last_net_bytes) / elapsed)
        self._last_net_bytes = total_bytes
        self._last_net_time = now

        # Synthetic latency simulation for healthy baseline (20-45ms)
        baseline_latency = round(random.uniform(22.0, 42.0), 1)
        packet_loss = 0.0

        # Apply simulation overrides if set
        if 'cpu_pct' in self.simulated_overrides:
            cpu = self.simulated_overrides['cpu_pct']
        if 'ram_pct' in self.simulated_overrides:
            mem = self.simulated_overrides['ram_pct']
        if 'disk_pct' in self.simulated_overrides:
            disk = self.simulated_overrides['disk_pct']
        if 'latency_ms' in self.simulated_overrides:
            baseline_latency = self.simulated_overrides['latency_ms']
        if 'packet_loss_pct' in self.simulated_overrides:
            packet_loss = self.simulated_overrides['packet_loss_pct']

        return {
            "cpu_pct": round(float(cpu), 1),
            "ram_pct": round(float(mem), 1),
            "disk_pct": round(float(disk), 1),
            "latency_ms": round(float(baseline_latency), 1),
            "packet_loss_pct": round(float(packet_loss), 1),
            "net_rx_bps": round(float(net_bps * 0.6), 1),
            "net_tx_bps": round(float(net_bps * 0.4), 1)
        }
