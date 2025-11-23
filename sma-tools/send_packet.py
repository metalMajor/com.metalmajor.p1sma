import socket
import time
import argparse
from emeter import emeterPacket
import binascii

# Multicast address and port (SMA default)
DEFAULT_UDP_ADDRESS: str = '239.12.255.254'
DEFAULT_UDP_PORT: int = 9522
DEFAULT_SERIAL_NUMBER: int = 12345678
DEFAULT_ACTIVE_POWER: int = 1234
DEFAULT_ACTIVE_ENERGY: int = 567890
DEFAULT_TTL: int = 32

class UdpSender:
    def __init__(self, address: str, port: int) -> None:
        self.address = address
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        self.sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, DEFAULT_TTL)   

    def send(self, data: bytes) -> None:
        self.sock.sendto(data, (self.address, self.port))
        print(f"Sent {len(data)} bytes to {self.address}:{self.port}")




def main() -> None:
    parser = argparse.ArgumentParser(
        description="Send a virtual emeter packet via UDP multicast."
    )
    parser.add_argument(
        '--serial', type=int, default=DEFAULT_SERIAL_NUMBER,
        help='Serial number for the emeter device'
    )
    parser.add_argument(
        '--address', type=str, default=DEFAULT_UDP_ADDRESS,
        help='UDP multicast address'
    )
    parser.add_argument(
        '--port', type=int, default=DEFAULT_UDP_PORT,
        help='UDP port'
    )
    parser.add_argument(
        '--power', type=int, default=DEFAULT_ACTIVE_POWER,
        help='Positive active power in watts'
    )
    parser.add_argument(
        '--energy', type=int, default=DEFAULT_ACTIVE_ENERGY,
        help='Positive active energy in watt-hours'
    )

    args = parser.parse_args()

    udpSender = UdpSender(args.address, args.port)

    while True:

        packet = emeterPacket(args.serial)
        measurements = {
            "pwr_imp": 0,
            "pwr_exp": args.power,
            "enrg_imp_t1": 0,
            "enrg_imp_t2": 0,
            "enrg_exp_t1": args.energy / 2,
            "enrg_exp_t2": args.energy / 2,
            "l1_pwr_imp": 0,
            "l1_pwr_exp": args.power / 3,
            "volts_l1": 230,
            "l2_pwr_imp": 0,
            "l2_pwr_exp": args.power / 3,
            "volts_l2": 230,
            "l3_pwr_imp": 0,
            "l3_pwr_exp": args.power / 3,
            "volts_l3": 230,
            "fact_tot": 1000,
            "fact_l1": 1000,
            "fact_l2": 1000,
            "fact_l3": 1000,
            "freq": 50000,
        }
        packet.update_values(measurements)

        data = packet.get_packet(int(time.time() * 1000))
        udpSender.send(data)
        time.sleep(1)

        print(f"Length: {len(data)} bytes")
        hexs = binascii.hexlify(data).decode()
        # Pretty hexdump: 16 bytes per line
        for i in range(0, len(hexs), 32):
            off = i // 2
            chunk = hexs[i:i+32]
            bytes_chunk = ' '.join(chunk[j:j+2] for j in range(0, len(chunk), 2))
            print(f"{off:04x}: {bytes_chunk}")  

    # print(f"Length: {len(data)} bytes")
    # hexs = binascii.hexlify(data).decode()
    # # Pretty hexdump: 16 bytes per line
    # for i in range(0, len(hexs), 32):
    #     off = i // 2
    #     chunk = hexs[i:i+32]
    #     bytes_chunk = ' '.join(chunk[j:j+2] for j in range(0, len(chunk), 2))
    #     print(f"{off:04x}: {bytes_chunk}")  


if __name__ == "__main__":
    main()