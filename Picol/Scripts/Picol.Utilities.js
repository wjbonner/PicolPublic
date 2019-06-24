$.GUM = {
    DateToString: function (date, format) {
        var currentTimeZoneOffsetInHours = date.getTimezoneOffset() / 60;
        date.setHours(date.getHours() + currentTimeZoneOffsetInHours);
        if (format === 'MM/DD/YYYY') {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        } else if (format == 'MM/DD/YYYY HH:MM:SS') {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    },

    Round: function (value, digits) {
        var multiplier = Math.pow(10, digits);
        return Math.round(value * multiplier) / multiplier;
    },

    SaveToCookie: function (name, data) {
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
            cookies[i] = cookies[i].trim();
        }

        var sanitizedName = name.replace("_", ".");
        var destroy = [];
        for (var i = 0; i < cookies.length; i++) {
            var nameValuePair = cookies[i].split("=");
            if (nameValuePair[0].indexOf(sanitizedName) >= 0) {
                destroy.push(nameValuePair[0]);
            }
        }

        for (i = 0; i < destroy.length; i++) {
            $.cookie(destroy[i], '', { expires: -1 });
        }

        $.cookie.raw = true;
        var maxLength = 4000;
        var parts = [];
        if (data.length > maxLength) {
            var count = Math.ceil(data.length / maxLength);
            var i = 1;

            for (i = 1; i <= count; i++) {
                if (i == count) {
                    parts.push(data.substring(maxLength * (i - 1), data.length));
                } else {
                    parts.push(data.substring(maxLength * (i - 1), maxLength * 1));
                }
            }

            for (i = 1; i <= count; i++) {
                $.cookie(i + "_" + count + "_" + sanitizedName, parts[i - 1], { expires: 365 });
            }
        } else {
            $.cookie("1_1_" + sanitizedName, data, { expires: 365 });
        }
    },

    GetFromCookie: function (name) {
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
            cookies[i] = cookies[i].trim();
        }

        var sanitizedName = name.replace("_", ".");
        var data = "";

        for (var i = 0; i < cookies.length; i++) {
            var nameValuePair = cookies[i].split("=");
            if (nameValuePair[0].indexOf(sanitizedName) >= 0) {
                data = data.concat(nameValuePair[1]);
            }
        }

        return data == "" ? null : data;
    },

    ClearFromCookie: function (name) {
        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {
            cookies[i] = cookies[i].trim();
        }

        var sanitizedName = name.replace("_", ".");
        var destroy = [];
        for (var i = 0; i < cookies.length; i++) {
            var nameValuePair = cookies[i].split("=");
            if (nameValuePair[0].indexOf(sanitizedName) >= 0) {
                destroy.push(nameValuePair[0]);
            }
        }

        for (i = 0; i < destroy.length; i++) {
            $.cookie(destroy[i], '', { expires: -1 });
        }

        return null;
    },

    ExportSlickGrid: function exportGrid(workingGrid, workingDataView, search, filters) {
        var itemCount = workingDataView.getLength();
        var content = '';
        var columns = workingGrid.getColumns();

        if (search != "") {
            content += "Search parameters:\r\n" + search + "\r\n";
        }

        if (filters != "") {
            content += "Filters: " + filters + "\r\n\r\n";
        }

        $.each(columns, function (index, item) {
            if (index >= columns.length - 1) {
                content += '"' + item.name + '"\r\n';
            } else {
                content += '"' + item.name + '",';
            }
        });

        for (var i = 0; i < itemCount; i++) {
            var row = workingDataView.getItem(i);
            if (!row.group && !row.groupingKey) {
                $.each(columns, function (index, item) {
                    if (index == columns.length - 1) {
                        content += '"' + row[item.id] + '"\r\n';
                    } else {
                        content += '"' + row[item.id] + '",';
                    }
                });
            }
        }

        var blob = new Blob([content], { type: "text/csv;charset=utf-8" });
        saveAs(blob, document.title + ".csv");
    },

    ExportAllSlickGrid: function exportGrid(workingGrid, workingDataView, search, filters) {
        var items = workingDataView.getItems();
        var itemCount = workingDataView.getItems().length;
        var content = '';
        var columns = workingGrid.getColumns();

        if (search != "") {
            content += "Search parameters:\r\n" + search + "\r\n";
        }

        if (filters != "") {
            content += "Filters: " + filters + "\r\n\r\n";
        }

        $.each(columns, function (index, item) {
            if (index >= columns.length - 1) {
                content += '"' + item.name + '"\r\n';
            } else {
                content += '"' + item.name + '",';
            }
        });

        for (var i = 0; i < itemCount; i++) {
            var row = items[i];
            if (!row.group && !row.groupingKey) {
                $.each(columns, function (index, item) {
                    if (index == columns.length - 1) {
                        content += '"' + row[item.id] + '"\r\n';
                    } else {
                        content += '"' + row[item.id] + '",';
                    }
                });
            }
        }

        var blob = new Blob([content], { type: "text/csv;charset=utf-8" });
        saveAs(blob, document.title + ".csv");
    },

    StringPadding: function (i, l, s) {
        var o = i.toString();
        if (!s) { s = '0'; }
        while (o.length < l) {
            o = s + o;
        }
        return o;
    },

    QueryString: (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
}