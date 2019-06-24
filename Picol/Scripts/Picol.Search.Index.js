$.ResultHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
        } else {
            editCommand.execute();
        }
    },

    DetailsFormatter: function (row, cell, value, columnDef, dataContext) {
        var result = '';

        if (dataContext.SmsEnabled) {
            result += "<a href='/Search/Details/" + dataContext["LabelId"] + ">Details</a>";
        }

        return result;
    }
}

$.Result = {
    CookieName: "Picol.Search.Index.ResultGrid",
    GridContainer: 'ResultGrid',
    CounterName: 'ResultCounter',
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
        { id: "Details", name: "Details", field: "Details", sortable: true, formatter: $.ResultHelper.DetailsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ResultHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Results...');
        $.Result.ResizeGridContainer();

        $.Result.Clean()
            .done($.Result.Instantiate)
            .done($.Result.GetResults)
            .done($.Result.BuildMenu)
            .done($.Result.ConfigureColumns)
            .done($.Result.InitializeGrid)
            .done($.Result.InitializeGridPlugins)
            .done($.Result.WireGridEvents)
            .done($.Result.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Result.Grid) {
            $('#' + $.Result.CounterName).text('');
            $('#' + $.Result.CounterName).empty();
            $('#' + $.Result.CounterName + ' input').val('');

            var members = [];
            $.each($.Result.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Result.ColumnFilters[item] = '';
            });

            $.Result.Grid.invalidateAllRows();
            $('#' + $.Result.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Result.Data = [];
        $.Result.ColumnFilters = {};
        $.Result.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Result.Columns.length; i++) {
            switch ($.Result.Columns[i]["id"]) {
                case 'Name':
                    $.Result.Columns[i].header = {
                        menu: {
                            items: [
                                {
                                    title: "Save",
                                    command: "Save"
                                },
                                {
                                    title: "Clear",
                                    command: "Clear"
                                },
                                {
                                    title: "Export",
                                    command: "Export"
                                }
                            ]
                        }
                    };
                    break;
                default:
            }
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    GetResults: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Search/GetResults',
            data: { Crop: $("#Crops").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Results.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Results.length; i++) {
                            $.Result.Data[i] = {
                                "id": i,
                                "LabelId": response.Results[i]["LabelId"],
                                "Name": response.Results[i]["Name"],
                                "Details": ""
                            };
                        }

                        $.Result.DataView.setItems($.Result.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Result.CookieName);

        // We set the display columns to the manually defined columns
        $.Result.DisplayColumns = $.Result.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Result.DisplayColumns = JSON.parse(cookieCols);

            var columnData = [];
            var i = 0, k = 0;

            // We need to associate the above defined formatter function handlers to the columns from the cookie, so we start by build an array of the objects from the columns above
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].formatter) {
                    columnData.push({ Id: columns[i].id, Action: "formatter", Data: columns[i].formatter });
                }

                if (columns[i].editor) {
                    columnData.push({ Id: columns[i].id, Action: "editor", Data: columns[i].editor });
                }

                if (columns[i].groupTotalsFormatter) {
                    columnData.push({ Id: columns[i].id, Action: "groupTotalsFormatter", Data: columns[i].groupTotalsFormatter });
                }
            }

            // We now iterate through the action objects and associate them with the columns from the cookies
            for (i = 0; i < columnData.length; i++) {
                for (k = 0; k < $.Result.DisplayColumns.length; k++) {
                    if ($.Result.DisplayColumns[k].id == columnData[i].Id) {
                        $.Result.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
                    }
                }
            }
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    ConfigureFilters: function () {
        // create a deferred object
        var def = $.Deferred();

        // Set filters
        //$.Result.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Result.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Result.ColumnFilters;
        $.CSF.globalGridReference = $.Result.Grid;
        $.Result.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Result.Grid = new Slick.Grid("#" + $.Result.GridContainer, $.Result.DataView, $.Result.DisplayColumns, $.Result.GridOptions);

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
                    $.GUM.SaveToCookie($.Result.CookieName, JSON.stringify($.Result.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Result.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Result.Grid, $.Result.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Result.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Result.Columns, $.Result.Grid, $.Result.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Result.Grid.registerPlugin($.Result.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Result.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Result.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Result.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Result.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Result.Grid.updateRowCount();
            $.Result.Grid.render();
            $.Result.UpdateRecordCount();
        });

        // Row chnge event
        $.Result.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Result.Grid.invalidateRows(args.rows);
            $.Result.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Result.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Result.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Result.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Result.Grid;
                $.Result.DataView.refresh();
                $.Result.UpdateRecordCount();
            }
        });

        $.Result.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Result.DataView.setFilter($.CSF.globalFilter);
        $.Result.Grid.init();

        $.Result.UpdateRecordCount();
        $.Result.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Result.DataView.getGroups().length * 2;
        $('#' + $.Result.CounterName).text('| ' + Number($.Result.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        if ($.Result.Grid) {
            $('#' + $.Result.GridContainer).height($(window).height() - 200);
            $.Result.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Result.GridContainer).height($(window).height() - 200);
    }
   
}

$(window).resize(function () {
    $.Result.ResizeGrid();
});

$(window).load(function () {
    $('#Crops').change(function () {
        $.Result.Driver();
    });
});