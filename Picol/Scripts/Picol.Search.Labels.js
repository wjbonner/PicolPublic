$.LabelHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
        } else {
            editCommand.execute();
        }
    },

    DetailsFormatter: function (row, cell, value, columnDef, dataContext) {
        return "<a href='javascript:void(0)' onclick='DisplayDetails(" + dataContext["id"] + ")'>Details</a>";
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
        { id: "WashingtonYear", name: "Washington Year", field: "WashingtonYear", sortable: true },
        { id: "OregonYear", name: "Oregon Year", field: "OregonYear", sortable: true },
        { id: "EpaNumber", name: "EpaNumber", field: "EpaNumber", sortable: true },
        { id: "User", name: "Intended User", field: "User", sortable: true },
        { id: "i502", name: "I502", field: "i502", sortable: true },
        { id: "Ingredients", name: "Ingredients", field: "Ingredients", sortable: true },
        { id: "Organic", name: "Organic", field: "Organic", sortable: true },
        { id: "Crops", name: "Crops", field: "Crops", sortable: true },
        { id: "Pests", name: "Pests", field: "Pests", sortable: true },
        { id: "Section18", name: "Section18", field: "Section18", sortable: true },
        { id: "SlnName", name: "SlnName", field: "SlnName", sortable: true },
        { id: "Sln", name: "Sln", field: "Sln", sortable: true },
        { id: "Usage", name: "Usage", field: "Usage", sortable: true },
        { id: "Details", name: "Details", field: "Details", sortable: false, formatter: $.LabelHelper.DetailsFormatter }
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
        $('#OverlayMessage').text('Retrieving labels');
        $.Label.ResizeGridContainer();

        $.Label.Clean()
            .done($.Label.Instantiate)
            .done($.Label.GetLabels)
            .done($.Label.BuildMenu)
            .done($.Label.ConfigureColumns)
            .done($.Label.InitializeGrid)
            .done($.Label.InitializeGridPlugins)
            .done($.Label.WireGridEvents)
            .done($.Label.ConfigureFilters);
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

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Search/GetLabels',
            data: { Washington: $("#Washington").is(':checked'), Oregon: $("#Oregon").is(':checked'), CurrentYear: $('input[name=Year]:checked').val() == "Current" ? true : false, Crop: $('#Crops').val(), Pest: $('#Pests').val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Labels.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Labels.length; i++) {
                            $.Label.Data[i] = {
                                "id": response.Labels[i]["Id"],
                                "Name": response.Labels[i]["Name"],
                                "WashingtonYear": response.Labels[i]["WashingtonYear"],
                                "OregonYear": response.Labels[i]["OregonYear"],
                                "EpaNumber": response.Labels[i]["EpaNumber"],
                                "User": response.Labels[i]["User"],
                                "i502": response.Labels[i]["i502"],
                                "Ingredients": response.Labels[i]["Ingredients"],
                                "Organic": response.Labels[i]["Organic"],
                                "Crops": response.Labels[i]["Crops"],
                                "Pests": response.Labels[i]["Pests"],
                                "Section18": response.Labels[i]["Section18"],
                                "SlnName": response.Labels[i]["SlnName"],
                                "Sln": response.Labels[i]["Sln"],
                                "Usage": response.Labels[i]["Usage"],
                                "Details": ""
                            };
                        }

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
            if (item.id == 'EpaNumber' || item.id == 'Name') {
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
        headerMenuPlugin.onCommand.subscribe(function (e, args) {
            switch (args.command) {
                case 'Save':
                    $.GUM.SaveToCookie($.Label.CookieName, JSON.stringify($.Label.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Label.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

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
        // create a deferred object
        var def = $.Deferred();

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
        this.ResizeGridContainer();

        if ($.Label.Grid) {
            $.Label.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Label.GridContainer).height($(window).height() - $('#SearchPanel').height() - 35);
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

    $('#CloseDetails').click(function () {
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
        $.GUM.SaveToCookie($.Label.CookieName, JSON.stringify($.Label.Grid.getColumns()));
        $('#OverlayDisplay').fadeOut(3000);
    });

    $('#ClearColumnOptions').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Clearing column options');
        $.GUM.ClearFromCookie($.Label.CookieName);
        $('#OverlayDisplay').fadeOut(3000);
    });

    $('#Search').click(function () {
        $.Label.Driver();
    });
});