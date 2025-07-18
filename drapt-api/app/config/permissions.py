# lowest permissions
ANALYST_PERMS = {
    "can_search_portfolio",
    "can_query_ticker"
}

SENIOR_ANALYST_PERMS = ANALYST_PERMS.copy()

# PMs get all analyst perms plus these:
PM_PERMS = SENIOR_ANALYST_PERMS | {
    "can_manage_portfolio",
    "can_book_trades",
    "can_search_trades"
}

# Vice Directors get all PM perms plus user management (but not delete or book trades)
VD_PERMS = PM_PERMS | {
    "can_manage_user",
    "can_init_portfolio",
    "can_search_user"
}
# Remove perms PMs have that VDs should not have
VD_PERMS -= {"can_book_trades"}

# Directors are similar to VDs
DIRECTOR_PERMS = VD_PERMS.copy()

# Developers get everything
DEVELOPER_PERMS = {
    "developer",
    "can_manage_user",
    "can_delete_user",
    "can_search_user",
    "can_init_portfolio",
    "can_manage_portfolio",
    "can_search_portfolio",
    "can_book_trades",
    "can_search_trades",
    "can_query_ticker"
}

permissions = {
    "analyst": ANALYST_PERMS,
    "senioranalyst": SENIOR_ANALYST_PERMS,
    "pm": PM_PERMS,
    "vd": VD_PERMS,
    "director": DIRECTOR_PERMS,
    "developer": DEVELOPER_PERMS
}

def permission_check_util(user, permission_required: str) -> bool:
    perms = permissions.get(user.role, set())
    return permission_required in perms
