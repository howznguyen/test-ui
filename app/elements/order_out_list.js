export default {
    DROPDOWN_CHANGE_LENGTH_TABLE : `select[name='ordering_list_length']`,
    DROPDOW_CHANGE_TYPE_DATE : `#select_date`,

    BUTTON_NEXT_PAGE_TABLE : `#ordering_list_next > a`,
    BUTTON_PREVIOUS_PAGE_TABLE : `#ordering_list_previous > a`,
    BUTTON_SORT_PACK_NO_ASC : `div[class='DTFC_LeftHeadWrapper'] th[aria-label='P.O No: activate to sort column ascending']`,

    ORDER_DATE_FROM : `#order_date_from`,
    ORDER_DATE_TO : `#order_date_to`,

    LABEL_LOADING_TABLE_DONE : `#ordering_list_processing[style*="display: none;"]`,
    TR_PACKING_LIST : `#ordering_list tbody tr`,

    BUTTON_SEARCH: `#search_orders`,

    /////////////////////////////
    
    DETAIL_DROPDOWN_CHANGE_LENGTH_TABLE : `select[name='products_list_length']`,
    DETAIL_DROPDOW_CHANGE_TYPE_DATE : `#select_date`,

    DETAIL_BUTTON_NEXT_PAGE_TABLE : `#products_list_next > a`,
    DETAIL_BUTTON_PREVIOUS_PAGE_TABLE : `#products_list_previous > a`,
    DETAIL_BUTTON_SORT_PACK_NO_ASC : `div[class='DTFC_LeftHeadWrapper'] th[aria-label='P.O No: activate to sort column ascending']`,
    DETAIL_LABEL_LOADING_TABLE_DONE : `#products_list_processing[style*="display: none;"]`,
    DETAIL_TR_ORDER_LIST : `#products_list_tbl tbody tr`,

    DETAIL_TD_FIRST : `#products_list_tbl tbody tr.odd td:not(.dataTables_empty)`,


    BUTTON_PAGES: `#orderOutList .paginate_button`

}