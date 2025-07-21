class terminalcolours:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def pretty_print_position(pos, title, colour=terminalcolours.OKCYAN):
    print(f"{colour}{title}{terminalcolours.ENDC}")
    for key, value in dict(pos).items():
        print(f"{terminalcolours.BOLD}{key}{terminalcolours.ENDC}: {value}")
    print()  # single newline

def print_test_start_banner(text="TEST STARTED", width=60, colour=terminalcolours.HEADER):
    banner = f"{colour}{'#' * ((width - len(text) - 2) // 2)} {text} {'#' * ((width - len(text) - 2) // 2)}{terminalcolours.ENDC}"
    print(banner)

def print_test_end_banner(text="TEST ENDED", width=60, colour=terminalcolours.HEADER):
    banner = f"{colour}{'#' * ((width - len(text) - 2) // 2)} {text} {'#' * ((width - len(text) - 2) // 2)}{terminalcolours.ENDC}"
    print(banner)