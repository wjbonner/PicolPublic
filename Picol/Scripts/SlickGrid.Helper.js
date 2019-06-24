var SGH = {};

SGH.globalColumnFilters = {};

SGH.filter = function (item, args) {
    for (var columnId in globalColumnFilters) {
        if (columnId !== undefined && globalColumnFilters[columnId] !== "") {
            var c = grid.getColumns()[grid.getColumnIndex(columnId)];
            if (item[c.field] != null) {
                var field = String(item[c.field]);
                var filter = String(globalColumnFilters[columnId]);

                if (!isNaN(Date.parse(field)) && ((filter.charAt(0) == '>') || (filter.charAt(0) == '<'))) {
                    var fieldDate = new Date(Date.parse(field));
                    if (filter.charAt(0) == '>') {
                        var filterDate = new Date(Date.parse(filter.replace('>', '')));
                        if (filterDate.getTime() <= fieldDate.getTime()) {
                            return true;
                        }
                    } else {
                        var filterDate = new Date(Date.parse(filter.replace('<', '')));
                        if (filterDate.getTime() >= fieldDate.getTime()) {
                            return true;
                        }
                    }
                }

                var dateRange = filter.split('-');
                if (dateRange != filter && !isNaN(Date.parse(field))) {
                    var fieldDate = new Date(Date.parse(field));
                    if (!isNaN(Date.parse(dateRange[0])) && !isNaN(Date.parse(dateRange[1]))) {
                        var startDate = new Date(Date.parse(dateRange[0]));
                        var endDate = new Date(Date.parse(dateRange[1]));

                        if (startDate.getTime() <= fieldDate.getTime() && endDate >= fieldDate.getTime()) {
                            return true;
                        }
                    }
                }

                var multiFilter = filter.split(';');
                if (multiFilter != filter) {
                    var result = false;
                    $.each(multiFilter, function (index, value) {

                        // Check for exclusion
                        if (value.toLowerCase().indexOf('!') != -1) {
                            if (field.toLowerCase().indexOf(value.toLowerCase().replace('!', '')) != -1) {
                                return false;
                            }
                        } else {
                            // Check for inclusion
                            if (field.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                                result = true;
                            }
                        }
                    });

                    return result;
                }

                if (filter.toLowerCase().indexOf('!') != -1) {
                    if (field.toLowerCase().indexOf(filter.toLowerCase().replace('!', '')) == -1) {
                        return true;
                    }
                } else {
                    // Check for inclusion
                    if (field.toLowerCase().indexOf(filter.toLowerCase()) == -1) {
                        return false;
                    }
                }

                if (field.toLowerCase().indexOf(filter.toLowerCase()) == -1) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    return true;
}