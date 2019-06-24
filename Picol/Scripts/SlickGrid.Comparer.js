// CSC = Custom Slickgrid Comparer, this is an object wrapper for the global slickgrid options, functions, filters, etc... that can be minified
$.CSC = {
    // Global slickgrid sort columns
    globalSortColumns: {},
    globalSortDir: {},
    globalSortCol: {},

    // Multi column comparer
    //***** Sample usage *****
    //grid.onSort.subscribe(function sort(e, args) {
    //    globalSortColumns = args.sortCols;
    //    dataView.sort(globalMultiColumnComparer, args.sortAsc);
    //});
    //***** Sample usage *****
    globalMultiColumnComparer: function (dataRow1, dataRow2) {
        for (var i = 0, l = $.CSC.globalSortColumns.length; i < l; i++) {
            var field = $.CSC.globalSortColumns[i].sortCol.field;
            var sign = $.CSC.globalSortColumns[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field].toString(), value2 = dataRow2[field].toString();
            var result = 0;

            if (field == "Epa") {
                value1 = Number((dataRow1["EpaOne"] || "0").toString());
                value2 = Number((dataRow2["EpaOne"] || "0").toString());

                result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
                
                value1 = Number((dataRow1["EpaTwo"] || "0").toString());
                value2 = Number((dataRow2["EpaTwo"] || "0").toString());

                result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
                
                value1 = Number((dataRow1["EpaThree"] || "0").toString());
                value2 = Number((dataRow2["EpaThree"] || "0").toString());

                result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
            }
            else {
                result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
            }
        }

        return 0;
    },

    // Single column comparer
    //***** Sample usage *****
    //grid.onSort.subscribe(function (e, args) {
    //    $.CSC.globalSortDir = args.sortAsc ? 1 : -1;
    //    $.CSC.globalSortCol = args.sortCol.field;
    //    dataView.sort($.CSC.globalSingleColumnComparer, args.sortAsc);
    //});
    //***** Sample usage *****
    globalSingleColumnComparer: function (a, b) {
        var x = a[$.CSC.globalSortCol], y = b[$.CSC.globalSortCol];
        return (x == y ? 0 : (x > y ? 1 : -1));
    },
}