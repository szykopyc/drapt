permissions = {
    "developer":{
        "developer":True,
        "can_manage_user":True,
        "can_delete_user":True,
        "can_search_user":True,
        "can_init_portfolio":True,
        "can_manage_portfolio":True,
        "can_search_portfolio":True,
        # trade stuff
        "can_book_trades":True,
        "can_search_trades":True,
        #asset stuff
        "can_query_ticker":True
    },
    "director":{
        "can_manage_user":True,
        "can_delete_user":False,
        "can_search_user":True,
        "can_init_portfolio":True,
        "can_manage_portfolio":True,
        "can_search_portfolio":True,

        "can_book_trades":False,
        "can_search_trades":True,
        "can_query_ticker":True
    },
    "vd":{
        "can_manage_user":True,
        "can_delete_user":False,
        "can_search_user":True,
        "can_init_portfolio":True,
        "can_manage_portfolio":True,
        "can_search_portfolio":True,

        "can_book_trades":False,
        "can_search_trades":True,
        "can_query_ticker":True
    },
    "pm":{
        "can_manage_user":False,
        "can_delete_user":False,
        "can_search_user":True,
        "can_init_portfolio":False,
        "can_manage_portfolio":True,
        "can_search_portfolio":True,

        "can_book_trades":True,
        "can_search_trades":True,
        "can_query_ticker":True
    },
    "senioranalyst":{
        "can_manage_user":False,
        "can_delete_user":False,
        "can_search_user":False,
        "can_init_portfolio":False,
        "can_manage_portfolio":False,
        "can_search_portfolio":True,

        "can_book_trades":False,
        "can_search_trades":False,
        "can_query_ticker":True
    },
    "analyst":{
        "can_manage_user":False,
        "can_delete_user":False,
        "can_search_user":False,
        "can_init_portfolio":False,
        "can_manage_portfolio":False,
        "can_search_portfolio":True,

        "can_book_trades":False,
        "can_search_trades":False,
        "can_query_ticker":True
    }
}
