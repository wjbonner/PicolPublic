// CSF = Custom Slickgrid Filter, this is an object wrapper for the global slickgrid options, functions, filters, etc... that can't be minified
$.CSF = {
    // Custom type to hold menu child item
    globalColumnFilters: {},
    globalGridReference: {},

    globalFilter: function (item, args) {

        // We assume the record matches our search filter
        var result = true;

        // We keep track of whether or not a result has been set
        var resultSet = false;

        // Keeps track of the current column
        var currentColumn = "";

        // Keeps track of the type of search/filter that is in use for a given column
        var filterType = "";

        // These variables are used for various filters below and for performance reasons we declare them here and then compute their value once when determining filter type
        var dateRange = "",
            numericRange = "",
            multiFilter = "",
            fieldDate = "",
            startDate = "",
            endDate = "";

        // iterate through each columns filter
        for (var columnId in $.CSF.globalColumnFilters) {
            // We check to see that the column exists and is non-empty
            if (columnId !== undefined && $.CSF.globalColumnFilters[columnId] !== "") {
                var c = $.CSF.globalGridReference.getColumns()[$.CSF.globalGridReference.getColumnIndex(columnId)];

                // We check to make sure the field is not null
                if (item[c.field] != null) {
                    var field = String(item[c.field]);
                    var filter = String($.CSF.globalColumnFilters[columnId]);

                    // We check to see if the current column is the same one we have been working on
                    // if current column is new we figure out what type of filter rules to apply based on the filter text
                    if (currentColumn != columnId) {

                        currentColumn = columnId;
                        resultSet = false;
                        numericRange = filter.split('-');
                        dateRange = filter.split('-');
                        multiFilter = filter.split(';');

                        if (filter.toLowerCase().indexOf('regex:') != -1 && !resultSet) {
                            filterType = "regex";
                            var filterPattern = new RegExp(filter.replace("regex:", ""));
                        } else if (!isNaN(Number(field)) && (filter.charAt(0) == '>' || filter.charAt(0) == '<')) {
                            // We check to see if our filter type is a numeric inequality
                            filterType = "numericInequality";
                        } else if (!isNaN(Date.parse(field)) && ((filter.charAt(0) == '>') || (filter.charAt(0) == '<'))) {
                            // We check to see if our filter type is a date inequality
                            fieldDate = new Date(Date.parse(field));
                            filterType = "dateInequality";
                        } else if (numericRange != filter && !isNaN(Number(field)) && !resultSet) {
                            // We check to see if our filter type is a numeric range
                            filterType = "numericRange";
                        } else if (dateRange != filter && !isNaN(Date.parse(field)) && !resultSet) {
                            // We check to see if our filter type is a date range
                            fieldDate = new Date(Date.parse(field));
                            startDate = new Date(Date.parse(dateRange[0]));
                            endDate = new Date(Date.parse(dateRange[1]));
                            filterType = "dateRange";
                        } else if (multiFilter != filter && !resultSet) {
                            // We check to see if our filter type is a multi value filter
                            filterType = "delimited";
                        } else if (filter.toLowerCase().indexOf('!') != -1 && !resultSet) {
                            // We check to see if our filter type is a Boolean NOT
                            filterType = "booleanNot";
                        } else {
                            filterType = "substringFilter";
                        }
                    }

                    // Force filter type to be substring
                    filterType = "substringFilter";

                    // We only keep checking additional columns if we haven't excluded the record yet
                    if (!resultSet) {
                        switch (filterType) {
                            case "regex":
                                if (!filterPattern.test(field)) {
                                    result = false;
                                    resultSet = true;
                                }
                                break;
                            case "numericInequality":
                                if (filter.charAt(0) == '>') {
                                    if (Number(filter.replace('>', '')) >= Number(field)) {
                                        result = false;
                                        resultSet = true;
                                    }
                                } else {
                                    if (Number(filter.replace('<', '')) <= Number(field)) {
                                        result = false;
                                        resultSet = true;
                                    }
                                }
                                break;
                            case "dateInequality":
                                if (filter.charAt(0) == '>') {
                                    var filterDate = new Date(Date.parse(filter.replace('>', '')));
                                    if (filterDate.getTime() >= fieldDate.getTime()) {
                                        result = false;
                                        resultSet = true;
                                    }
                                } else {
                                    var filterDate = new Date(Date.parse(filter.replace('<', '')));
                                    if (filterDate.getTime() <= fieldDate.getTime()) {
                                        result = false;
                                        resultSet = true;
                                    }
                                }
                                break;
                            case "numericRange":
                                if (numericRange[0] >= Number(field) || numericRange[1] <= Number(field)) {
                                    result = false;
                                    resultSet = true;
                                }
                                break;
                            case "dateRange":
                                if (!isNaN(Date.parse(dateRange[0])) && !isNaN(Date.parse(dateRange[1]))) {
                                    if (startDate.getTime() >= fieldDate.getTime() || endDate <= fieldDate.getTime()) {
                                        result = false;
                                        resultSet = true;
                                    }
                                }
                                break;
                            case "delimited":
                                // For our inclusion patterns we construct a regex that looks like ^((305)|(306))$ by breaking up the exterior and interior components
                                var inclusionPatternExterior = "^({interior})$",
                                    inclusionPatternInterior = "({value})",
                                    inclusionPattern = "";

                                // For our exclusion patterns we construct a regex that looks like ^((305)|(306))$
                                var exclusionPatternExterior = "^({interior})$",
                                    exclusionPatternInterior = "({value})",
                                    exclusionPattern = "";

                                // We iterate through each filter value and add it to either the inclusion or exclusion pattern
                                $.each(multiFilter, function (index, value) {
                                    if (value != "") {
                                        // Check for Boolean NOT
                                        if (value.toLowerCase().indexOf('!') != -1) {
                                            if ("" != exclusionPattern) {
                                                exclusionPattern += "|" + (exclusionPatternInterior.replace("{value}", value.toLowerCase().replace("!", "")));
                                            } else {
                                                exclusionPattern += (exclusionPatternInterior.replace("{value}", value.toLowerCase().replace("!", "")));
                                            }
                                        } else {
                                            if ("" != inclusionPattern) {
                                                inclusionPattern += "|" + (inclusionPatternInterior.replace("{value}", value.toLowerCase()));
                                            } else {
                                                inclusionPattern += (inclusionPatternInterior.replace("{value}", value.toLowerCase()));
                                            }
                                        }
                                    }
                                });

                                inclusionPattern = inclusionPatternExterior.replace("{interior}", inclusionPattern);
                                exclusionPattern = exclusionPatternExterior.replace("{interior}", exclusionPattern);

                                // We don't check if there were no values added
                                if ("^()$" != inclusionPattern) {
                                    var inclusion = new RegExp(inclusionPattern);

                                    // We look for values that do not match and mark them as false
                                    if (!inclusion.test(field.toLowerCase())) {
                                        result = false;
                                        resultSet = true;
                                    }
                                }

                                // We don't check if there were no values added
                                if ("^()$" != exclusionPattern) {
                                    var exclusion = new RegExp(exclusionPattern);

                                    // We look for values that do match and mark them as false
                                    if (exclusion.test(field.toLowerCase())) {
                                        result = false;
                                        resultSet = true;
                                    }
                                }

                                break;
                            case "booleanNot":
                                if (field.toLowerCase().indexOf(filter.toLowerCase().replace('!', '')) != -1) {
                                    result = false;
                                    resultSet = true;
                                }
                                break;

                            case "substringFilter":
                                if (field.toLowerCase().indexOf(filter.toLowerCase()) == -1) {
                                    result = false;
                                    resultSet = true;
                                }
                                break;
                            default:
                        }
                    }
                } else {
                    result = false;
                    resultSet = true;
                }
            }
        }

        return result;
    }
}