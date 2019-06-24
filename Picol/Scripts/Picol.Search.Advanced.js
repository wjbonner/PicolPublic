$.PageState = {
    // There are dynamically generated members
    Search: null,
    LoadedSearch: null,
    Filters: {},

    ClearInputs: function () {
        $("#AdvancedSearch [name$=RemoveTerm]").trigger("click");
        $('[id^=SearchValue]').val('');
        $('#SearchQuery').val('');
        $('#Filters select').val(-1);
        $('input[type="button"][id^=RemoveSearchGroup]').each(function (index) {
            $(this).click();
        });

        $('input[type="button"][id^=RemoveTerm]').each(function (index) {
            $(this).click();
        });
    },

    ClearHiddenInputs: function () {

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
        $.Label.Clean()
            .then($.Label.Instantiate)
            .then($.Label.GetLabels)
            .then($.Label.BuildMenu)
            .then($.Label.ConfigureColumns)
            .then($.Label.InitializeGrid)
            .then($.Label.InitializeGridPlugins)
            .then($.Label.WireGridEvents)
            .then($.Label.ConfigureFilters)
            .then($.Label.ResizeGrid);
    },

    Clean: function () {
        $('#OverlayMessage').text('Preparing view...');

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
        $('#OverlayMessage').text('Instantiating data view...');

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
        $('#OverlayMessage').text('Building menus...');
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
        $('#OverlayMessage').text('Retrieving data...');

        var states = '';

        // We get our data from the server

        $('div[id^=TermGroups]').each(function (i, item) {
            var index = i;
            $("[name$=Group]", $(this)).attr('data-termgroup', index);
            $("[name$=SearchConditional]", $(this)).attr('data-termgroup', index);
            $("[name$=SearchField]", $(this)).attr('data-termgroup', index);
            $("[name$=SearchOperator]", $(this)).attr('data-termgroup', index);
            $("[name$=SearchValue]", $(this)).attr('data-termgroup', index);
            $("[name$=RemoveTerm]", $(this)).attr('data-termgroup', index);
        });

        if ($.PageState.Search == null) {
            $.PageState.Search = $('#AdvancedSearch').serialize();
        }

        return $.ajax({
            type: 'POST',
            url: '/Search/Advanced',
            data: $.PageState.Search,
            dataType: "json",
            traditional: true,
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Labels.length == 0) {
                        alert('No results were found for your query.');
                    } else {
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
                                "Supplemental": response.Labels[i]["Supplemental"] || "",
                                "Formulation": response.Labels[i]["Formulation"] || "",
                                "SignalWord": response.Labels[i]["SignalWord"] || "",
                                "Usage": response.Labels[i]["Usage"] || "",
                                "SupplementalName": response.Labels[i]["SupplementalName"] || "",
                                "SupplementalExpiration": response.Labels[i]["SupplementalExpiration"] || "",
                                "SlnName": response.Labels[i]["SlnName"] || "",
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

                        $.Label.DataView.setItems($.Label.Data);
                    }
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                //$('#OverlayDisplay').hide();
            }
        });
    },

    ConfigureColumns: function () {
        $('#OverlayMessage').text('Configuring columns...');

        if ($("#LoggedIn").val() == "true") {
            return $.ajax({
                type: 'GET',
                url: '/Account/GetPreference',
                data: { Name: "Columns" },
                dataType: "json",
                traditional: true,
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage);
                    }
                    else {
                        if (response.Value == null || response.Value == "") {
                            var defaultColumns = [];

                            $.each($.Label.Columns, function (index, item) {
                                if (item.id == 'Epa' || item.id == 'Name' || item.id == 'IntendedUser' || item.id == 'Ingredients' || item.id == 'Concentrations' || item.id == 'RegistrantName' || item.id == 'ResistanceCode' || item.id == 'PesticideTypes' || item.id == 'Sln' || item.id == 'Supplemental' || item.id == 'CurrentRegistration' || item.id == 'Labels' || item.id == 'Actions') {
                                    defaultColumns.push(item);
                                }

                                if (!item.sortable) {
                                    $("[data-filterId='" + item.id + "']").attr('disabled', 'disabled');
                                }
                            });

                            $.Label.DisplayColumns = defaultColumns;
                        } else {
                            // Since the value exists we set the display columns to the JSON encoded column array
                            displayColumns = JSON.parse(response.Value);

                            var columnData = [];
                            var i = 0, k = 0;

                            // We need to associate the above defined formatter function handlers to the columns from the cookie, so we start by build an array of the objects from the columns above
                            for (var i = 0; i < $.Label.Columns.length; i++) {
                                if ($.Label.Columns[i].formatter) {
                                    columnData.push({ Id: $.Label.Columns[i].id, Action: "formatter", Data: $.Label.Columns[i].formatter });
                                }
                            }

                            // We now iterate through the action objects and associate them with the columns from the cookies
                            for (i = 0; i < columnData.length; i++) {
                                for (k = 0; k < displayColumns.length; k++) {
                                    if (displayColumns[k].id == columnData[i].Id) {
                                        displayColumns[k][columnData[i].Action] = columnData[i].Data;
                                    }
                                }
                            }

                            $.Label.DisplayColumns = displayColumns;
                        }
                    }
                },
                error: function (response) {
                    alert('An error has occurred communicating with the server!');
                },
                complete: function (response) {
                    //$('#OverlayDisplay').hide();
                }
            });
        } else {
            // create a deferred object
            var def = $.Deferred();
            var defaultColumns = [];

            $.each($.Label.Columns, function (index, item) {
                if (item.id == 'Epa' || item.id == 'Name' || item.id == 'IntendedUser' || item.id == 'Ingredients' || item.id == 'Concentrations' || item.id == 'RegistrantName' || item.id == 'ResistanceCode' || item.id == 'PesticideTypes' || item.id == 'Sln' || item.id == 'Supplemental' || item.id == 'CurrentRegistration' || item.id == 'Labels' || item.id == 'Actions') {
                    defaultColumns.push(item);
                }

                if (!item.sortable) {
                    $("[data-filterId='" + item.id + "']").attr('disabled', 'disabled');
                }
            });

            $.Label.DisplayColumns = defaultColumns;
            def.resolve();
            return def;
        }
    },

    ConfigureFilters: function () {
        $('#OverlayMessage').text('Configuring filters...');

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

        $('#OverlayDisplay').hide();
        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        $('#OverlayMessage').text('Initializing grid...');

        // create a deferred object
        var def = $.Deferred();

        $.Label.Grid = new Slick.Grid("#" + $.Label.GridContainer, $.Label.DataView, $.Label.DisplayColumns, $.Label.GridOptions);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGridPlugins: function () {
        $('#OverlayMessage').text('Initializing plugins...');

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

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        $('#OverlayMessage').text('Wiring grid events...');

        // create a deferred object
        var def = $.Deferred();

        $("#ExportVisibleLabelGrid").off("click");
        $("#ExportAllLabelGrid").off("click");

        $("#ExportVisibleLabelGrid").click(function () {
            var search = $("#SearchQuery").val().replace("\n\n", "\n");
            var filters = "";
            var inlineFilters = "";

            $('input[data-filterId]').each(function () {
                $.PageState.Filters[$(this).attr('data-filterId')] = $(this).val();
            });

            // Excluding filter info in the export
            $.each($.PageState.Filters, function (key, value) {
                if (value != "") {
                    inlineFilters += key + ": " + value + ";";
                }
            });

            $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView, search, inlineFilters);
        });

        $("#ExportAllLabelGrid").click(function () {
            var search = $("#SearchQuery").val().replace("\n\n", "\n");
            var filters = "";

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

        // Disable filters on non-sortable columns
        $.each($.Label.Columns, function (index, item) {
            if (!item.sortable) {
                $("[data-filterId='" + item.id + "']").attr('disabled', 'disabled');
            }
        });

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
        $('#' + $.Label.GridContainer).height($(window).height() - $('#SearchTab').height() - 38);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Label.ResizeGrid();
});

$(window).load(function () {
    $.Label.ResizeGridContainer();

    $('#Overlay').click(function () {
        $('#Overlay').hide();
        $('#Details').hide();
    });

    $('#ExportLabelGrid').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Exporting labels');
        $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView);
        $('#OverlayDisplay').fadeOut(3000);
    });

    $('#SaveColumnOptions').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving column options');
        ////$.GUM.SaveToCookie($.Label.CookieName, JSON.stringify($.Label.Grid.getColumns()));
        $('#OverlayDisplay').fadeOut(3000);
    });

    $('#ClearColumnOptions').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Clearing column options');
        ////$.GUM.ClearFromCookie($.Label.CookieName);
        $('#OverlayDisplay').fadeOut(3000);
    });

    $('#Search').click(function () {
        $('#SearchFields').hide();
        $('#SearchTab').show();
        $('#LabelGrid').show();
        $('#LabelFooter').show();
        $.Label.Driver();

        $('#SearchParameterContainer').show();
        $('#SearchParameterTruncateContainer').show();
        $('#SearchParameterTruncateSwitch').show();
        $('#SearchParameters').empty();

        var item = $('<li/>', {
            style: "border-width:0;margin:0;"
        });

        var query = $('<p/>', {
            id: "SearchText",
            text: $('#SearchQuery').val(),
            style: "border-width:0;white-space: pre;text-overflow: ellipsis;overflow: hidden;margin:0;background:white;float:left;width:100%"
        });

        $('#SearchParameters').append(item.append(query));
    });

    $('#SearchParameterTruncateSwitch').click(function () {
        if ($('#SearchParameterTruncateSwitch').is(':checked')) {
            $("#SearchText").css('text-overflow', 'unset');
            $("#SearchText").css('overflow', 'unset');
            $("#SearchText").css('width', 'auto');
        } else {
            $("#SearchText").css('text-overflow', 'ellipsis');
            $("#SearchText").css('overflow', 'hidden');
            $("#SearchText").css('width', '100%');
        }
    });

    $("#SaveColumnOptions").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving column options...');

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

    $('#ModifySearch').click(function () {
        $('#SearchFields').show();
        $('#LabelGrid').hide();
        $('#LabelFooter').hide();
        $('#SearchParameterContainer').hide();
        $('#SearchParameterTruncateContainer').hide();
        $('#SearchParameterTruncateSwitch').hide();
        $.Label.ResizeGridContainer();
        $('#SearchParameters').empty();
        $.PageState.Search = null;
    });

    $('#ClearSearch').click(function () {
        $.PageState.ClearInputs();
        $('#SearchFields').show();
        $('#LabelGrid').hide();
        $('#LabelFooter').hide();
        $.Label.ResizeGridContainer();
        $('#SearchParameters').empty();
        $.PageState.Search = null;
        location.reload();
    });

    $('#OpenSearch').click(function () {
        $('#SearchFields').show();
        $('#SearchTab').hide();
        $('#LabelGrid').hide();
        $('#LabelFooter').hide();
        $.Label.ResizeGridContainer();
    });

    $.Label.ResizeGridContainer();

    $('input[id^=AddSearchGroup').click(function () {
        AddSearchGroup.call(this);
    });

    $('input[id^=AddTermGroups]').click(function () {
        AddTermGroup.call(this);
    });

    $('input').change(function (event) {
        DrawSearch();
    });

    $('#AdvancedSearch').on('change', 'select', function () {
        DrawSearch();
    });

    $("#ShowSaveSearch").click(function () {
        $("#SaveSearchWindow").show();
        $('#Overlay').show();
    });

    $("#SaveSearch").click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Saving labels...');

        $.ajax({
            type: 'GET',
            url: '/Search/Save',
            data: { Name: $("#SearchName").val(), Parameters: $.PageState.Search, type: "advanced" },
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
    });

    $('#AdvancedSearch').on('change', "[id^='SearchOperator']", function () {

        if ($(this).val() == "Exact") {
            $('#OverlayDisplay').show();
            $('#OverlayMessage').text('Populating...');
            var parent = $(this).parent();

            var term = $(this).attr('data-termgroup');
            var search = $(this).attr('data-searchgroup');
            var field = $("#SearchField" + term, parent).val();
            var search = term
            var name = $("#SearchField" + term, parent).attr('name').split('[')[1].split(']')[0];

            $.ajax({
                type: 'GET',
                url: '/Search/GetSearchValues',
                data: { Field: field },
                dataType: "json",
                cache: false,
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage);
                    }
                    else {
                        if (response.Values.length == 0) {
                            alert('No results were found for your query.');
                        } else {
                            var SearchValue = $('<select/>', {
                                id: "SearchValue" + term,
                                name: "SearchTerms[" + name + "].SearchValue",
                                'data-termgroup': term,
                                'data-searchgroup': search
                            });

                            for (var i = 0; i < response.Values.length; i++) {
                                var display = response.Values[i];

                                if (display == true) {
                                    display = "Yes";
                                }

                                if (display == false) {
                                    display = "No";
                                }

                                SearchValue.append("<option value='" + response.Values[i] + "'>" + display + "</option>");
                            }

                            SearchValue.change(function () { DrawSearch(); })
                            $("#SearchValue" + term, parent).replaceWith(SearchValue);
                            DrawSearch();
                        }
                    }
                },
                error: function (response) {
                    //alert('An error has occurred communicating with the server!');
                },
                complete: function (response) {
                    $('#OverlayDisplay').hide();
                    $('#Overlay').hide();
                }
            });
        } else {
            var term = $(this).attr('data-termgroup');
            var search = $(this).attr('data-searchgroup');
            var field = $("#SearchField" + term, parent).val();
            var search = term
            var name = $("#SearchField" + term, parent).attr('name').split('[')[1].split(']')[0];

            var SearchValue = $('<input/>', {
                type: "text",
                id: "SearchValue" + term,
                name: "SearchTerms[" + name + "].SearchValue",
                'data-termgroup': term,
                'data-searchgroup': search
            });

            SearchValue.change(function () { DrawSearch(); })
            $("#SearchValue" + term, parent).replaceWith(SearchValue);
            DrawSearch();
        }
    });

    $('#AdvancedSearch').on('change', "[id^='SearchField']", function () {
        var term = $(this).attr('data-termgroup');
        var name = $(this).attr('name').split('[')[1].split(']')[0];
        var parent = $(this).parent();

        if ($("[name='SearchTerms\\[" + name + "\\].SearchOperator'").val() == "Exact") {
            var term = $(this).attr('data-termgroup');
            var search = $(this).attr('data-searchgroup');
            var field = $("#SearchField" + term, parent).val();
            var search = term
            var name = $("#SearchField" + term, parent).attr('name').split('[')[1].split(']')[0];

            $.ajax({
                type: 'GET',
                url: '/Search/GetSearchValues',
                data: { Field: field },
                dataType: "json",
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage);
                    }
                    else {
                        if (response.Values.length == 0) {
                            alert('No results were found for your query.');
                        } else {
                            var SearchValue = $('<select/>', {
                                id: "SearchValue" + term,
                                name: "SearchTerms[" + name + "].SearchValue",
                                'data-termgroup': term,
                                'data-searchgroup': search
                            });

                            for (var i = 0; i < response.Values.length; i++) {
                                var display = response.Values[i];

                                if (display == true) {
                                    display = "Yes";
                                }

                                if (display == false) {
                                    display = "No";
                                }

                                SearchValue.append("<option value='" + response.Values[i] + "'>" + display + "</option>");
                            }

                            $("#SearchValue" + term, parent).replaceWith(SearchValue);
                            DrawSearch();
                        }
                    }
                },
                error: function (response) {
                    //alert('An error has occurred communicating with the server!');
                },
                complete: function (response) {
                    $('#OverlayDisplay').hide();
                    $('#Overlay').hide();
                }
            });
        }
    });

    if ($("#LoadedSearch").val() != "") {
        $.PageState.LoadedSearch = $("#LoadedSearch").val();
        $.PageState.Search = $.PageState.LoadedSearch;

        // Had used a time delay originally because another ajax call was hiding the overlay display
        setTimeout(function () {
            $("#Search").click();
        }, 0);
    }

    $.ajax({
        type: 'POST',
        url: '/Search/GetSearchFields',
        data: {},
        dataType: "json",
        traditional: true,
        success: function (response) {
            if (response.Error) {
                alert(response.ErrorMessage);
            }
            else {
                if (response.SearchFields.length == 0) {
                    // No search fields
                } else {
                    $.PageState.SearchFields = response.SearchFields;
                    $.each($.PageState.SearchFields, function (index, value) {
                        $('#SearchField0').append("<option value='" + value.Key + "'>" + value.Value + "</option>");
                    });
                }
            }
        },
        error: function (response) {
            alert('An error has occurred communicating with the server!');
        },
        complete: function (response) {
            //$('#OverlayDisplay').hide();
        }
    });
});

function DrawSearch() {
    $('#SearchQuery').val('');
    var search = 'Labels where\n';

    $('[id^=SearchGroups]').each(function (index, item) {
        if (index > 0) {
            search += '\n\n' + $("#SearchGroupOperatorSelector" + index).val() + '\n\n';
        }

        search += '[';

        $('[id^=TermGroups]', item).each(function (index, item) {
            if (index > 0) {
                search += '\n' + $("#SearchConditional" + index).val() + ' ';
            }

            search += $("#SearchField" + index, $(this)).val() + ' ';
            search += $("#SearchOperator" + index, $(this)).val() == "Exact" ? '= ' : 'like ';

            if ($("#SearchValue" + index, $(this)).val() == "true" || $("#SearchValue" + index, $(this)).val() == "false") {
                search += $("#SearchValue" + index + " option:selected", $(this)).text() + ' '
            } else {
                search += $("#SearchValue" + index, $(this)).val() + ' '
            }
        });

        search += ']';
    });

    search += '\n\n';

    if ($('#State').val() != -1) {
        search += 'AND State = ' + $('#State option:selected').text();
        search += '\n';
    }

    if ($('#Year').val() != -1) {
        search += 'AND Year = CurrentYear ';
        search += '\n';
    }

    if ($('#IntendedUser').val() != -1) {
        search += 'AND IntendedUser = ' + $('#IntendedUser option:selected').text();
        search += '\n';
    }

    if ($('#I502').val() != -1) {
        search += $('#I502 option:selected').text() == "Yes" ? 'AND I502 is Yes' : 'AND I502 is No';
        search += '\n';
    }

    if ($('#Essb').val() != -1) {
        search += $('#Essb option:selected').text() == "Yes" ? 'AND Essb is Yes' : 'AND Essb is No';
        search += '\n';
    }

    if ($('#Organic').val() != -1) {
        search += $('#Organic option:selected').text() == "Yes" ? 'AND Organic is Yes' : 'AND Organic is No';
        search += '\n';
    }

    if ($('#Esa').val() != -1) {
        search += $('#Esa option:selected').text() == "Yes" ? 'AND Esa is Yes' : 'AND Esa is No';
        search += '\n';
    }

    if ($('#Ground').val() != -1) {
        search += $('#Ground option:selected').text() == "Yes" ? 'AND Ground is Yes' : 'AND Ground is No';
        search += '\n';
    }

    if ($('#Spanish').val() != -1) {
        search += $('#Spanish option:selected').text() == "Yes" ? 'AND Spanish is Yes' : 'AND Spanish is No';
    }

    $('#SearchQuery').val(search);
}

function AddSearchGroup() {
    var searchIndex = $('div[id^=SearchGroups]').length;
    var termIndex = 0;
    var nameIndex = $('div[id^=TermGroups]').length;

    var SearchGroupOperatorSelector = $('<select/>', {
        id: "SearchGroupOperatorSelector" + searchIndex,
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    SearchGroupOperatorSelector.append("<option value='AND'>AND</option>");
    SearchGroupOperatorSelector.append("<option value='OR'>OR</option>");
    SearchGroupOperatorSelector.append("<option value='NOT'>NOT</option>");

    var searchGroupDiv = $('<div/>', {
        id: "SearchGroups[" + searchIndex + "]",
        'data-term': searchIndex,
        'style': "border:solid;border-width:medium;",
        'data-searchgroup': searchIndex
    });

    var termGroupDiv = $('<div/>', {
        id: "TermGroups[" + termIndex + "]",
        'data-termgroup': termIndex
    });

    var AddTerm = $('<input/>', {
        type: "button",
        value: "Add Search Term",
        id: "AddTermGroups" + searchIndex,
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var RemoveGroup = $('<input/>', {
        type: "button",
        value: "Remove Group",
        id: "RemoveSearchGroup" + searchIndex,
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchGroup = $('<input/>', {
        type: "hidden",
        id: "SearchGroup" + searchIndex,
        name: "SearchTerms[" + nameIndex + "].SearchGroup",
        value: searchIndex,
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchGroupOperator = $('<input/>', {
        type: "hidden",
        id: "SearchGroupOperator" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchGroupOperator",
        value: 'AND',
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchConditional = $('<input/>', {
        type: "text",
        id: "SearchConditional" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchConditional",
        value: "AND",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex,
        'style': "display:none;"
    });

    var SearchField = $('<select/>', {
        id: "SearchField" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchField",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    $.each($.PageState.SearchFields, function (index, value) {
        SearchField.append("<option value='" + value.Key + "'>" + value.Value + "</option>");
    });

    var SearchOperator = $('<select/>', {
        id: "SearchOperator" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchOperator",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    SearchOperator.append("<option value='Contains'>Contains</option>");
    SearchOperator.append("<option value='Exact'>Exact</option>");

    var SearchValue = $('<input/>', {
        type: "text",
        id: "SearchValue" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchValue",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    termGroupDiv.append(SearchGroup);
    termGroupDiv.append(SearchGroupOperator);
    termGroupDiv.append(SearchConditional);
    termGroupDiv.append(SearchField);
    termGroupDiv.append(SearchOperator);
    termGroupDiv.append(SearchValue);

    searchGroupDiv.append(AddTerm);
    searchGroupDiv.append(RemoveGroup);
    searchGroupDiv.append(termGroupDiv);

    $('#AdvancedSearch').append(SearchGroupOperatorSelector);
    $('#AdvancedSearch').append(searchGroupDiv);

    setTimeout(function () {
        $('[id^=SearchGroupOperatorSelector]').off();
        $('[id^=SearchGroupOperatorSelector]').change(function (event) {
            var value = $(this).val();
            $("[id^=SearchGroupOperator]", $('#SearchGroups\\[' + $(this).attr('data-searchgroup') + '\\]')).each(function () {
                $(this).val(value);
            });
        });
    }, 50);

    $('input').not(':input[type=button]').off();
    $('input').not(':input[type=button]').change(function (event) {
        DrawSearch();
    });

    $('input[id^=AddTermGroups]').off();
    $('input[id^=AddTermGroups]').click(function () {
        AddTermGroup.call(this);
    });

    $('input[id^=RemoveSearchGroup]').click(function () {
        RemoveSearchGroup.call(this);
    });

    DrawSearch();
}

function AddTermGroup() {
    var termIndex = $('div[id^=TermGroups]', $(this).parent()).length;
    var searchIndex = $(this).parent().attr('data-searchgroup');
    var nameIndex = $('div[id^=TermGroups]').length;

    var div = $('<div/>', {
        id: "TermGroups[" + termIndex + "]",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchGroup = $('<input/>', {
        type: "hidden",
        id: "SearchGroup" + searchIndex,
        name: "SearchTerms[" + nameIndex + "].SearchGroup",
        value: searchIndex,
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchGroupOperator = $('<input/>', {
        type: "hidden",
        id: "SearchGroupOperator" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchGroupOperator",
        value: 'AND',
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var SearchConditional = $('<select/>', {
        id: "SearchConditional" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchConditional",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex,
        style: 'margin: 0 0 0 2%;'
    });

    SearchConditional.append("<option value='AND'>AND</option>");
    SearchConditional.append("<option value='OR'>OR</option>");
    SearchConditional.append("<option value='NOT'>NOT</option>");

    var lineBreak = $('<br/>');

    var SearchField = $('<select/>', {
        id: "SearchField" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchField",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    $.each($.PageState.SearchFields, function (index, value) {
        SearchField.append("<option value='" + value.Key + "'>" + value.Value + "</option>");
    });

    var SearchOperator = $('<select/>', {
        id: "SearchOperator" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchOperator",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    SearchOperator.append("<option value='Contains'>Contains</option>");
    SearchOperator.append("<option value='Exact'>Exact</option>");

    var SearchValue = $('<input/>', {
        type: "text",
        id: "SearchValue" + termIndex,
        name: "SearchTerms[" + nameIndex + "].SearchValue",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    var RemoveTerm = $('<input/>', {
        type: "button",
        value: "remove",
        id: "RemoveTerm" + termIndex,
        name: "SearchTerms[" + nameIndex + "].RemoveTerm",
        'data-termgroup': termIndex,
        'data-searchgroup': searchIndex
    });

    div.append(SearchGroup);
    div.append(SearchGroupOperator);
    div.append(lineBreak);
    div.append(SearchConditional);
    div.append(lineBreak);
    div.append(SearchField);
    div.append(SearchOperator);
    div.append(SearchValue);
    div.append(RemoveTerm);

    $('#SearchGroups\\[' + searchIndex + '\\]').append(div);

    $('input').not(':input[type=button]').not(':input[type=checkbox]').off();
    $('input').not(':input[type=button]').not(':input[type=checkbox]').change(function (event) {
        DrawSearch();
    });

    $('select').off();
    $('select').change(function (event) {
        DrawSearch();
    });

    $('[name$=RemoveTerm]').off();
    $('[name$=RemoveTerm]').click(function () {
        RemoveTermGroup.call(this);
    });

    DrawSearch();
}

function RemoveTermGroup() {
    var termIndex = $(this).attr('data-termgroup');
    var searchIndex = $(this).attr('data-searchgroup');
    $("#TermGroups\\[" + termIndex + "\\]", $('#SearchGroups\\[' + searchIndex + '\\]')).remove();

    $('div[id^=TermGroups]').each(function (i, item) {
        var index = i;
        $("[name$=SearchGroup]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchGroup');
        $("[name$=SearchGroupOperator]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchGroupOperator');
        $("[name$=SearchConditional]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchConditional');
        $("[name$=SearchField]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchField');
        $("[name$=SearchOperator]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchOperator');
        $("[name$=SearchValue]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchValue');
        $("[name$=RemoveTerm]", $(this)).attr('name', 'SearchTerms[' + index + '].RemoveTerm');
    });

    $('div[id^=TermGroups]', $('#SearchGroups\\[' + searchIndex + '\\]')).each(function (i, item) {
        var index = i;
        $(this).attr('id', 'TermGroups[' + index + ']');
        $(this).attr('data-term', index);

        $("[name$=SearchGroup]", $(this)).attr('id', 'SearchGroup' + index);
        $("[name$=SearchGroup]", $(this)).attr('data-termgroup', index);
        $("[name$=SearchGroup]", $(this)).val(index);

        $("[name$=SearchGroupOperator]", $(this)).attr('id', 'SearchGroupOperator' + index);
        $("[name$=SearchGroupOperator]", $(this)).attr('data-termgroup', index);

        $("[name$=SearchConditional]", $(this)).attr('id', 'SearchConditional' + index);
        $("[name$=SearchConditional]", $(this)).attr('data-termgroup', index);

        $("[name$=SearchField]", $(this)).attr('id', 'SearchField' + index);
        $("[name$=SearchField]", $(this)).attr('data-termgroup', index);

        $("[name$=SearchOperator]", $(this)).attr('id', 'SearchOperator' + index);
        $("[name$=SearchOperator]", $(this)).attr('data-termgroup', index);

        $("[name$=SearchValue]", $(this)).attr('id', 'SearchValue' + index);
        $("[name$=SearchValue]", $(this)).attr('data-termgroup', index);

        $("[name$=RemoveTerm]", $(this)).attr('id', 'RemoveTerm' + index);
        $("[name$=RemoveTerm]", $(this)).attr('data-termgroup', index);
    });

    DrawSearch();
}

function RemoveSearchGroup() {
    var termIndex = $(this).attr('data-termgroup');
    var searchIndex = $(this).attr('data-searchgroup');
    $("#SearchGroups\\[" + searchIndex + "\\]").remove();
    $("#SearchGroupOperatorSelector" + searchIndex).remove();

    $('div[id^=TermGroups]').each(function (i, item) {
        var index = i;
        $("[name$=SearchGroup]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchGroup');
        $("[name$=SearchGroupOperator]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchGroupOperator');
        $("[name$=SearchConditional]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchConditional');
        $("[name$=SearchField]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchField');
        $("[name$=SearchOperator]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchOperator');
        $("[name$=SearchValue]", $(this)).attr('name', 'SearchTerms[' + index + '].SearchValue');
        $("[name$=RemoveTerm]", $(this)).attr('name', 'SearchTerms[' + index + '].RemoveTerm');
    });

    DrawSearch();
}