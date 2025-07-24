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

def print_test_banner(text="TEST BANNER", width=60, colour=terminalcolours.HEADER):
    if len(text) + 2 > width:
        width = len(text) + 20  # fallback so text always fits
    padding = width - len(text) - 2
    left = padding // 2
    right = padding // 2 + (padding % 2)
    banner = f"{colour}{'#' * left} {text} {'#' * right}{terminalcolours.ENDC}"
    print(banner)

def print_test_start_banner(text="TEST STARTED", width=60, colour=terminalcolours.OKBLUE):
    print_test_banner(text, width, colour)

def print_test_end_banner(text="TEST ENDED", width=60, colour=terminalcolours.OKBLUE):
    print_test_banner(text, width, colour)

def print_zebra_table(list_passed_in):
    for id, i in enumerate(list_passed_in):
        if id % 2 == 0:
                print(f"{i}")
            
        else:
            print(f"{terminalcolours.OKBLUE}{i}{terminalcolours.ENDC}")

    print()

def pretty_print_info(text):
    print(f"{terminalcolours.OKCYAN}{text}{terminalcolours.ENDC}")

def pretty_print_result(text):
    print(f"{terminalcolours.OKGREEN}{text}{terminalcolours.ENDC}\n")