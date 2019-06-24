$.PageState = {
    // There are dynamically generated members
    Search: null,
    LoadedSearch: null,
    Filters: {},

    ClearInputs: function () {
        $("#EpaNumber").val("")
        $("#LabelName").val("")
        $("#Ingredient").val("")
        $("#Crop").val("")
        $("#Pest").val("")
        $("#I502").val("false")
        $("#Essb").val("false")
        $("#Organic").val("false")
        $("#Sln").val("false")
        $("#UsageFed").val("false")
        $("#UsageSrup").val("false")
    },

    ClearHiddenInputs: function () {
        $("#I502").val("false")
        $("#Essb").val("false")
        $("#Organic").val("false")
        $("#Sln").val("false")
        $("#UsageFed").val("false")
        $("#UsageSrup").val("false")
    }
}

$.LabelHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
        } else {
            editCommand.execute();
        }
    },

    DetailsFormatter: function (row, cell, value, columnDef, dataContext) {
        return "<a href='javascript:void(0)' onclick='DisplayDetails(" + dataContext["id"] + ")'>Details</a>";
    },

    IngredientsFormatter: function (row, cell, value, columnDef, dataContext) {
        var output = '';

        $.each(value, function (index, item) {
            output += item + ";";
        });

        return output.substring(0, output.length - 1);
    },

    ConcentrationsFormatter: function (row, cell, value, columnDef, dataContext) {
        var output = '';

        $.each(value, function (index, item) {
            output += item + ";";
        });

        return output.substring(0, output.length - 1);
    },

    PesticideTypesFormatter: function (row, cell, value, columnDef, dataContext) {
        var output = '';

        $.each(value, function (index, item) {
            output += item + ";";
        });

        return output.substring(0, output.length - 1);
    },

    ResistanceCodeFormatter: function (row, cell, value, columnDef, dataContext) {
        var blank = true;

        $.each(value, function (index, item) {
            if (item != "") {
                blank = false;
            }
        });

        if (blank) {
            return "";
        }

        return value;
    },

    ResistanceSourceFormatter: function (row, cell, value, columnDef, dataContext) {
        var blank = true;

        $.each(value, function (index, item) {
            if (item != "") {
                blank = false;
            }
        });

        if (blank) {
            return "";
        }

        return value;
    },

    LabelsFormatter: function (row, cell, value, columnDef, dataContext) {
        var blank = true;
        var value = '';

        if (dataContext["WashingtonDownload"] != '') {
            value += "<a href='" + dataContext["WashingtonDownload"] + "' target='_blank' style='color:crimson'>WA</a>";
        }

        if (dataContext["OregonDownload"] != '') {
            if (value.length > 0) {
                value += " | ";
            }
            value += "<a href='" + dataContext["OregonDownload"] + "' target='_blank' style='color:crimson'>OR</a>";
        }

        return value;
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var value = "<a href='/Search/Details/" + dataContext["LabelId"] + "' target='_blank' style='color:crimson'>Details</a>";
        return value;
    },

    RegistrationFormatter: function (row, cell, value, columnDef, dataContext) {
        var value = '';

        if (dataContext["CurrentlyRegisteredWashington"] == true) {
            value += "WA";
        }

        if (dataContext["CurrentlyRegisteredOregon"] == true) {
            if (value.length > 0) {
                value += ", ";
            }
            value += "OR";
        }

        return value;
    }
}

$.Label = {
    CookieName: "Picol.Search.Index.LabelGrid",
    GridContainer: 'LabelGrid',
    CounterName: 'LabelCounter',
    Grid: null,
    GroupItemMetadataProvider: new Slick.Data.GroupItemMetadataProvider(),
    DataView: new Slick.Data.DataView({
        groupItemMetadataProvider: $(this).GroupItemMetadataProvider,
        inlineFilters: true
    }),
    Data: [],
    ColumnFilters: {},
    DisplayColumns: [],
    Columns: [
        { id: "Name", name: "Name", field: "Name", sortable: true },
        { id: "WsdaLineNum", name: "WSDA Line #", field: "WsdaLineNum", sortable: true },
        { id: "OrPid", name: "OR Pid", field: "OrPid", sortable: true },
        { id: "Epa", name: "EPA", field: "Epa", sortable: true },
        { id: "Essb", name: "ESSB 6206", field: "Essb", sortable: true },
        { id: "I502", name: "I502", field: "I502", sortable: true },
        { id: "IntendedUser", name: "Intended User", field: "IntendedUser", sortable: true },
        { id: "Ingredients", name: "Ingredients", field: "Ingredients", sortable: true },
        { id: "ResistanceCode", name: "Resistance Code", field: "ResistanceCode", sortable: true },
        { id: "ResistanceSource", name: "Resistance Source", field: "ResistanceSource", sortable: true },
        { id: "Concentrations", name: "Concentrations", field: "Concentrations", sortable: true },
        { id: "PesticideTypes", name: "Pesticide Types", field: "PesticideTypes", sortable: true },
        { id: "RegistrantName", name: "Registrant Name", field: "RegistrantName", sortable: true },
        { id: "Sln", name: "SLN", field: "Sln", sortable: true },
        { id: "SlnName", name: "SLN Name", field: "SlnName", sortable: true },
        { id: "Supplemental", name: "Supplemental", field: "Supplemental", sortable: true },
        { id: "Formulation", name: "Formulation", field: "Formulation", sortable: true },
        { id: "SignalWord", name: "Signal Word", field: "SignalWord", sortable: true },
        { id: "Usage", name: "Usage", field: "Usage", sortable: true },
        { id: "SupplementalName", name: "Supplemental Name", field: "SupplementalName", sortable: true },
        { id: "SupplementalExpiration", name: "Supplemental Expiration", field: "SupplementalExpiration", sortable: true },
        { id: "SlnExpiration", name: "SLN Expiration", field: "SlnExpiration", sortable: true },
        { id: "Spanish", name: "Spanish", field: "Spanish", sortable: true },
        { id: "Organic", name: "Organic", field: "Organic", sortable: true },
        { id: "EsaNotice", name: "ESA Notice", field: "EsaNotice", sortable: true },
        { id: "Section18", name: "Section 18", field: "Section18", sortable: true },
        { id: "Section18Expiration", name: "Section 18 Expiration", field: "Section18Expiration", sortable: true },
        { id: "CurrentRegistration", name: "Current Registration", field: "CurrentRegistration", sortable: false, formatter: $.LabelHelper.RegistrationFormatter },
        { id: "WashingtonRegistrationYear", name: "WA Reg. Year", field: "WashingtonRegistrationYear", sortable: true },
        { id: "OregonRegistrationYear", name: "OR Reg. Year", field: "OregonRegistrationYear", sortable: true },
        { id: "Labels", name: "Labels", field: "Labels", sortable: false, formatter: $.LabelHelper.LabelsFormatter },
        { id: "Actions", name: "Actions", field: "Actions", sortable: false, formatter: $.LabelHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.LabelHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving labels...');

        $.Label.Clean()
            .done($.Label.Instantiate)
            .done($.Label.GetLabels)
            .done($.Label.BuildMenu)
            .done($.Label.ConfigureColumns)
            .done($.Label.InitializeGrid)
            .done($.Label.InitializeGridPlugins)
            .done($.Label.WireGridEvents)
            .done($.Label.ConfigureFilters)
            .done($.Label.ResizeGrid);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Label.Grid) {
            $('#' + $.Label.CounterName).text('');
            $('#' + $.Label.CounterName).empty();
            $('#' + $.Label.CounterName + ' input').val('');

            var members = [];
            $.each($.Label.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Label.ColumnFilters[item] = '';
            });

            $.Label.Grid.invalidateAllRows();
            $('#' + $.Label.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Label.Data = [];
        $.Label.ColumnFilters = {};
        $.Label.DataView = new Slick.Data.DataView({
            groupItemMetadataProvider: $(this).GroupItemMetadataProvider,
            inlineFilters: true
        });

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    BuildMenu: function () {
        // create a deferred object
        var def = $.Deferred();

        // We define our column menu structure
        ////for (var i = 0; i < $.Label.Columns.length; i++) {
        ////    switch ($.Label.Columns[i]["id"]) {
        ////        case 'Name':
        ////            $.Label.Columns[i].header = {
        ////                menu: {
        ////                    items: [
        ////                        {
        ////                            title: "Save",
        ////                            command: "Save"
        ////                        },
        ////                        {
        ////                            title: "Clear",
        ////                            command: "Clear"
        ////                        },
        ////                        {
        ////                            title: "Export",
        ////                            command: "Export"
        ////                        }
        ////                    ]
        ////                }
        ////            };
        ////            break;
        ////        default:
        ////    }
        ////}

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    GetLabels: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        $('#SearchParameterContainer').show();
        $('#SearchParameters').empty();


        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Search/QuickResults',
            data: {
                EpaNumber: $("#EpaNumber").val(),
                EpaNumberExactMatch: $("#EpaNumberExactMatch").is(":checked"),
                PestExactMatch: $("#PestExactMatch").is(":checked"),
                LabelName: $("#LabelName").val(),
                LabelNameExactMatch: $("#LabelNameExactMatch").is(":checked"),
                Ingredient: $("#Ingredient").val(),
                IngredientExactMatch: $("#IngredientExactMatch").is(":checked"),
                Crop: $("#Crop").val(),
                CropExactMatch: $("#CropExactMatch").is(":checked"),
                Pest: $("#Pest").val(),
                PestExactMatch: $("#PestExactMatch").is(":checked"),
                State: $("#State").val(),
                IntendedUser: $("#IntendedUser").val(),
                I502: $("#I502").val(),
                Essb: $("#Essb").val(),
                Organic: $("#Organic").val(),
                Sln: $("#Sln").val(),
                UsageFed: $("#UsageFed").val(),
                UsageSrup: $("#UsageSrup").val()
            },
            dataType: "json",
            traditional: true,
            cache: false,
            success: function (response) {
                if (response.Error) {
                    alert("The server reported an error while retrieving yoru results: " + response.ErrorMessage);
                }
                else {
                    if (response.Labels.length == 0) {
                        alert('No results were found for your query.');
                    } else {
                        $.PageState.Search = response.Search;

                        for (var i = 0; i < response.Labels.length; i++) {
                            $.Label.Data[i] = {
                                "id": i,
                                "LabelId": response.Labels[i]["Id"],
                                "Name": response.Labels[i]["Name"],
                                "WsdaLineNum": response.Labels[i]["WsdaLineNum"],
                                "OrPid": response.Labels[i]["OrPid"],
                                "CurrentlyRegisteredWashington": response.Labels[i]["CurrentlyRegisteredWashington"],
                                "CurrentlyRegisteredOregon": response.Labels[i]["CurrentlyRegisteredOregon"],
                                "Epa": response.Labels[i]["Epa"] || "",
                                "EpaOne": response.Labels[i]["EpaOne"] || "",
                                "EpaTwo": response.Labels[i]["EpaTwo"] || "",
                                "EpaThree": response.Labels[i]["EpaThree"] || "",
                                "Essb": response.Labels[i]["Essb"] ? "Yes" : "No",
                                "I502": response.Labels[i]["I502"] ? "Yes" : "No",
                                "IntendedUser": response.Labels[i]["IntendedUser"] || "",
                                "Ingredients": response.Labels[i]["Ingredients"] || "",
                                "ResistanceCode": response.Labels[i]["ResistanceCode"] || "",
                                "ResistanceSource": response.Labels[i]["ResistanceSource"] || "",
                                "Concentrations": response.Labels[i]["Concentrations"] || "",
                                "PesticideTypes": response.Labels[i]["PesticideTypes"] || "",
                                "RegistrantName": response.Labels[i]["RegistrantName"] || "",
                                "Sln": response.Labels[i]["Sln"] || "",
                                "SlnName": response.Labels[i]["SlnName"] || "",
                                "Supplemental": response.Labels[i]["Supplemental"] || "",
                                "Formulation": response.Labels[i]["Formulation"] || "",
                                "SignalWord": response.Labels[i]["SignalWord"] || "",
                                "Usage": response.Labels[i]["Usage"] || "",
                                "SupplementalName": response.Labels[i]["SupplementalName"] || "",
                                "SupplementalExpiration": response.Labels[i]["SupplementalExpiration"] || "",
                                "SlnExpiration": response.Labels[i]["SlnExpiration"] || "",
                                "Spanish": response.Labels[i]["Spanish"] ? "Yes" : "No",
                                "Organic": response.Labels[i]["Organic"] ? "Yes" : "No",
                                "EsaNotice": response.Labels[i]["EsaNotice"] ? "Yes" : "No",
                                "Section18": response.Labels[i]["Section18"] || "",
                                "Section18Expiration": response.Labels[i]["Section18Expiration"] || "",
                                "CurrentRegistration": (response.Labels[i]["CurrentlyRegisteredWashington"] == true ? "WA " : "") + (response.Labels[i]["CurrentlyRegisteredOregon"] == true ? "OR" : ""),
                                "WashingtonDownload": response.Labels[i]["WashingtonDownload"],
                                "OregonDownload": response.Labels[i]["OregonDownload"],
                                "WashingtonRegistrationYear": response.Labels[i]["WashingtonRegistrationYear"],
                                "OregonRegistrationYear": response.Labels[i]["OregonRegistrationYear"],
                                "Actions": ""
                            };
                        }

                        $.each($.PageState.Search, function (key, value) {
                            var tempValue = value;

                            if (value != "") {
                                if (key == "State" && $.isNumeric(tempValue)) {
                                    tempValue = $("#State option:selected").text();
                                }

                                if (key == "IntendedUser" && $.isNumeric(tempValue)) {
                                    tempValue = $("#IntendedUser option:selected").text();
                                }

                                if (tempValue == true) {
                                    tempValue = "Yes";
                                }

                                if (tempValue == false) {
                                    tempValue = "No";
                                }

                                var item = $('<li/>', {
                                    value: tempValue,
                                    text: key + ": " + tempValue,
                                    style: "border-width:0"
                                });

                                $('#SearchParameters').append(item);
                            }
                        });

                        $.Label.DataView.setItems($.Label.Data);

                        // Call resolve on the deferred object
                        def.resolve();
                    }
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });

        // Return the deferred object
        return def;
    },

    ConfigureColumns: function () {
        // create a deferred object
        var def = $.Deferred();

        // grab the cookie that tracks the column settings like column width, order, etc...
        var cookieCols = $.GUM.GetFromCookie($.Label.CookieName);

        var defaultColumns = [];

        $.each($.Label.Columns, function (index, item) {
            if (item.id == 'Epa'
                || item.id == 'Name'
                || item.id == 'IntendedUser'
                || item.id == 'Ingredients'
                || item.id == 'Concentrations'
                || item.id == 'RegistrantName'
                || item.id == 'ResistanceCode'
                || item.id == 'PesticideTypes'
                || item.id == 'Sln'
                || item.id == 'SlnName'
                || ($.GUM.QueryString.Express != 'sln' && item.id == 'Supplemental')
                || item.id == 'Labels'
                || ($.GUM.QueryString.Express == 'srup' && item.id == 'Usage')
                || item.id == 'Actions') {
                defaultColumns.push(item);
            }
        });

        // We set the display columns to the manually defined columns
        //$.Label.DisplayColumns = $.Label.Columns;
        $.Label.DisplayColumns = defaultColumns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Label.DisplayColumns = JSON.parse(cookieCols);

            var columnData = [];
            var i = 0, k = 0;

            // We need to associate the above defined formatter function handlers to the columns from the cookie, so we start by build an array of the objects from the columns above
            for (var i = 0; i < $.Label.DisplayColumns.length; i++) {
                if ($.Label.DisplayColumns[i].formatter) {
                    columnData.push({ Id: $.Label.DisplayColumns[i].id, Action: "formatter", Data: $.Label.DisplayColumns[i].formatter });
                }

                if ($.Label.DisplayColumns[i].editor) {
                    columnData.push({ Id: $.Label.DisplayColumns[i].id, Action: "editor", Data: $.Label.DisplayColumns[i].editor });
                }

                if ($.Label.DisplayColumns[i].groupTotalsFormatter) {
                    columnData.push({ Id: $.Label.DisplayColumns[i].id, Action: "groupTotalsFormatter", Data: $.Label.DisplayColumns[i].groupTotalsFormatter });
                }
            }

            // We now iterate through the action objects and associate them with the columns from the cookies
            for (i = 0; i < columnData.length; i++) {
                for (k = 0; k < $.Label.DisplayColumns.length; k++) {
                    if ($.Label.DisplayColumns[k].id == columnData[i].Id) {
                        $.Label.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
                    }
                }
            }
        } else {

        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    ConfigureFilters: function () {
        // create a deferred object
        var def = $.Deferred();

        // Set filters
        //$.Label.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Label.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Label.ColumnFilters;
        $.CSF.globalGridReference = $.Label.Grid;
        $.Label.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Label.Grid = new Slick.Grid("#" + $.Label.GridContainer, $.Label.DataView, $.Label.DisplayColumns, $.Label.GridOptions);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGridPlugins: function () {
        // create a deferred object
        var def = $.Deferred();

        // Create our header menu and column picker objects
        var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

        // This is the handler for the different header menu commands
        ////headerMenuPlugin.onCommand.subscribe(function (e, args) {
        ////    switch (args.command) {
        ////        case 'Save':
        ////            $.GUM.SaveToCookie($.Label.CookieName, JSON.stringify($.Label.Grid.getColumns()));
        ////            break;
        ////        case 'Clear':
        ////            $.GUM.ClearFromCookie($.Label.CookieName);
        ////            break;
        ////        case 'Export':
        ////            $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView);
        ////            break;
        ////        default:
        ////            alert('Invalid menu command!');
        ////    }
        ////});

        // register the header menu plugin
        $.Label.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Label.Columns, $.Label.Grid, $.Label.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Label.Grid.registerPlugin($.Label.GroupItemMetadataProvider);

        // Enable auto tool tips
        $.Label.Grid.registerPlugin(new Slick.AutoTooltips());

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        $("#ExportVisibleLabelGrid").off("click");
        $("#ExportAllLabelGrid").off("click");

        $("#ExportVisibleLabelGrid").click(function () {
            var search = "";
            var filters = "";

            $('input[data-filterId]').each(function () {
                $.PageState.Filters[$(this).attr('data-filterId')] = $(this).val();
            });

            $.each($.PageState.Search, function (key, value) {
                if (value != "") {
                    search += key + ": " + value + ";";
                }
            });

            $.each($.PageState.Filters, function (key, value) {
                if (value != "") {
                    filters += key + ": " + value + ";";
                }
            });

            $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView, search, filters);
        });

        $("#ExportAllLabelGrid").click(function () {
            var search = "";
            var filters = "";

            $('input[data-filterId]').each(function () {
                $.PageState.Filters[$(this).attr('data-filterId')] = $(this).val();
            });

            $.each($.PageState.Search, function (key, value) {
                if (value != "") {
                    search += key + ": " + value + ";";
                }
            });

            $.GUM.ExportAllSlickGrid($.Label.Grid, $.Label.DataView, search, filters);
        });

        // Our scroll event
        $.Label.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Label.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Label.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Label.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Label.Grid.updateRowCount();
            $.Label.Grid.render();
            $.Label.UpdateRecordCount();
        });

        // Row chnge event
        $.Label.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Label.Grid.invalidateRows(args.rows);
            $.Label.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Label.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Label.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Label.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Label.Grid;
                $.Label.DataView.refresh();
                $.Label.UpdateRecordCount();
            }
        });

        $.Label.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text' class='GridFilters'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Label.DataView.setFilter($.CSF.globalFilter);
        $.Label.Grid.init();

        $.Label.UpdateRecordCount();
        $.Label.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Label.DataView.getGroups().length * 2;
        $('#' + $.Label.CounterName).text('| ' + Number($.Label.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        if (this.ResizeGridContainer) {
            this.ResizeGridContainer();
        }

        if ($.Label.Grid) {
            $.Label.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Label.GridContainer).height($(window).height() - $('#LabelFooter').height() - 5);
    },

    Source: function (request, response) {
        var filteredArray = $.map(orignalArray, function (item) {
            if (item.value.startsWith(request.term)) {
                return item;
            }
            else {
                return null;
            }
        });
        response(filteredArray);
    },
}

$(window).resize(function () {
    $.Label.ResizeGrid();
});

$(window).load(function () {
    $.ajax({
        type: 'GET',
        url: '/Search/GetEpaNumbers',
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.EpaNumbers.length == 0) {
                    // No data in report
                } else {
                    $.PageState.EpaNumbers = response.EpaNumbers;
                    $("#EpaNumber").autocomplete({
                        source: function (request, response) {
                            var filteredArray = $.map($.PageState.EpaNumbers, function (item) {
                                if (item.indexOf(request.term) == 0) {
                                    return item;
                                }
                                else {
                                    return null;
                                }
                            });
                            response(filteredArray);
                        },
                        delay: 0,
                        minLength: 3
                    });
                }
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Search/GetLabelNames',
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.LabelNames.length == 0) {
                    // No data in report
                } else {
                    $.PageState.LabelNames = response.LabelNames;
                    $("#LabelName").autocomplete({
                        source: $.PageState.LabelNames,
                        delay: 0,
                        minLength: 3
                    });
                }
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Search/GetIngredients',
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.Ingredients.length == 0) {
                    // No data in report
                } else {
                    $.PageState.Ingredients = response.Ingredients;
                    $("#Ingredient").autocomplete({
                        source: $.PageState.Ingredients,
                        delay: 0,
                        minLength: 3
                    });
                }
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Search/GetCrops',
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.Crops.length == 0) {
                    // No data in report
                } else {
                    $.PageState.Crops = response.Crops;
                    $("#Crop").autocomplete({
                        source: $.PageState.Crops,
                        delay: 0,
                        minLength: 3
                    });
                }
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
        }
    });

    $.ajax({
        type: 'GET',
        url: '/Search/GetPests',
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.Pests.length == 0) {
                    // No data in report
                } else {
                    $.PageState.Pests = response.Pests;
                    $("#Pest").autocomplete({
                        source: $.PageState.Pests,
                        delay: 0,
                        minLength: 3
                    });
                }
            }
        },
        error: function (response) {
            //alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
        }
    });

    $("#SaveColumnOptions").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving labels...');

        $.ajax({
            type: 'POST',
            url: '/Account/SetPreference',
            data: { Name: "Columns", Value: JSON.stringify($.Label.Grid.getColumns()) },
            dataType: "json",
            success: function (response) {

            },
            error: function (response) {
                //alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $("#ClearColumnOptions").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving labels...');

        $.ajax({
            type: 'GET',
            url: '/Account/SetPreference',
            data: { Name: "Columns", Value: "" },
            dataType: "json",
            success: function (response) {

            },
            error: function (response) {
                //alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $("#I502Search").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'i502'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#I502").val("true");
        $("#SearchSubmit").click();
    })

    $("#EssbSearch").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'essb6206'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#Essb").val("true");
        $("#SearchSubmit").click();
    })

    $("#OdaSearch").click(function () {

    })

    $("#OrganicSearch").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'organic'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#Organic").val("true");
        $("#SearchSubmit").click();
    })

    $("#SlnSearch").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'sln'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#Sln").val("true");
        $("#SearchSubmit").click();
    })

    $("#UsageFedSearch").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'rup'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#UsageFed").val("true");
        $("#SearchSubmit").click();
    })

    $("#UsageSrupSearch").click(function () {
        $.PageState.ClearInputs();

        $.GUM.QueryString.Express = 'srup'
        var newUrl = "?" + $.param($.GUM.QueryString);
        window.history.pushState(null, null, newUrl)

        $("#UsageSrup").val("true");
        $("#SearchSubmit").click();
    })

    $('#SearchSubmit').click(function () {
        $('#SearchFields').hide();
        $('#LabelGrid').show();
        $('#LabelFooter').show();
        $.Label.Driver();
    });

    $('#ModifySearch').click(function () {
        $.PageState.ClearHiddenInputs();
        $('#SearchFields').show();
        $('#LabelGrid').hide();
        $('#LabelFooter').hide();
        $.Label.ResizeGridContainer();
        $('#SearchParameters').empty();
        $.PageState.Search = {};
    });

    $('#ClearSearch').click(function () {
        $.PageState.ClearHiddenInputs();
        $.PageState.ClearInputs();
        $('#SearchFields').show();
        $('#LabelGrid').hide();
        $('#LabelFooter').hide();
        $.Label.ResizeGridContainer();
        $('#SearchParameters').empty();
        $.PageState.Search = {};
        location.reload();
    });

    $("#ShowSaveSearch").click(function () {
        $("#SaveSearchWindow").show();
        $('#Overlay').show();
    })

    $("#SaveSearch").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving labels...');

        $.ajax({
            type: 'GET',
            url: '/Search/Save',
            data: { Name: $("#SearchName").val(), Parameters: JSON.stringify($.PageState.Search), type: "quick" },
            dataType: "json",
            success: function (response) {

            },
            error: function (response) {
                //alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $("#SearchName").val("");
                $("#SaveSearchWindow").hide();
                $('#OverlayDisplay').hide();
                $('#Overlay').hide();
            }
        });
    })

    if ($("#LoadedSearch").val() != "") {
        $.PageState.LoadedSearch = JSON.parse($("#LoadedSearch").val());
        $.PageState.Search = $.PageState.LoadedSearch;
        $.each($.PageState.LoadedSearch, function (key, value) {
            $("#" + key + "").val(value);
        });
        $("#SearchSubmit").click();
    }

    $.Label.ResizeGridContainer();
});