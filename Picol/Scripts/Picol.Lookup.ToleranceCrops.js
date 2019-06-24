$.ToleranceCropHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
        } else {
            editCommand.execute();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        return "<a href='javascript:void(0)' onclick='DisplayDetails(" + dataContext["id"] + ")'>Details</a>";
    }
}

$.ToleranceCrop = {
    CookieName: "Picol.Search.Index.ToleranceCropGrid",
    GridContainer: 'ToleranceCropGrid',
    CounterName: 'ToleranceCropCounter',
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
        { id: "Code", name: "Code", field: "Code", sortable: true },
        { id: "Notes", name: "Notes", field: "Notes", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ToleranceCropHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving ToleranceCrops');
        $.ToleranceCrop.ResizeGridContainer();

        $.ToleranceCrop.Clean()
            .done($.ToleranceCrop.Instantiate)
            .done($.ToleranceCrop.GetToleranceCrops)
            .done($.ToleranceCrop.BuildMenu)
            .done($.ToleranceCrop.ConfigureColumns)
            .done($.ToleranceCrop.InitializeGrid)
            .done($.ToleranceCrop.InitializeGridPlugins)
            .done($.ToleranceCrop.WireGridEvents)
            .done($.ToleranceCrop.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.ToleranceCrop.Grid) {
            $('#' + $.ToleranceCrop.CounterName).text('');
            $('#' + $.ToleranceCrop.CounterName).empty();
            $('#' + $.ToleranceCrop.CounterName + ' input').val('');

            var members = [];
            $.each($.ToleranceCrop.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.ToleranceCrop.ColumnFilters[item] = '';
            });

            $.ToleranceCrop.Grid.invalidateAllRows();
            $('#' + $.ToleranceCrop.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ToleranceCrop.Data = [];
        $.ToleranceCrop.ColumnFilters = {};
        $.ToleranceCrop.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.ToleranceCrop.Columns.length; i++) {
            switch ($.ToleranceCrop.Columns[i]["id"]) {
                case 'Name':
                    $.ToleranceCrop.Columns[i].header = {
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

    GetToleranceCrops: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetToleranceCrops',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.ToleranceCrops.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.ToleranceCrops.length; i++) {
                            $.ToleranceCrop.Data[i] = {
                                "id": response.ToleranceCrops[i]["Id"],
                                "Name": response.ToleranceCrops[i]["Name"],
                                "Code": response.ToleranceCrops[i]["Code"],
                                "Notes": response.ToleranceCrops[i]["Notes"]
                            };
                        }

                        $.ToleranceCrop.DataView.setItems($.ToleranceCrop.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.ToleranceCrop.CookieName);

        // We set the display columns to the manually defined columns
        $.ToleranceCrop.DisplayColumns = $.ToleranceCrop.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.ToleranceCrop.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.ToleranceCrop.DisplayColumns.length; k++) {
                    if ($.ToleranceCrop.DisplayColumns[k].id == columnData[i].Id) {
                        $.ToleranceCrop.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.ToleranceCrop.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.ToleranceCrop.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.ToleranceCrop.ColumnFilters;
        $.CSF.globalGridReference = $.ToleranceCrop.Grid;
        $.ToleranceCrop.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ToleranceCrop.Grid = new Slick.Grid("#" + $.ToleranceCrop.GridContainer, $.ToleranceCrop.DataView, $.ToleranceCrop.DisplayColumns, $.ToleranceCrop.GridOptions);

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
                    $.GUM.SaveToCookie($.ToleranceCrop.CookieName, JSON.stringify($.ToleranceCrop.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.ToleranceCrop.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.ToleranceCrop.Grid, $.ToleranceCrop.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.ToleranceCrop.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.ToleranceCrop.Columns, $.ToleranceCrop.Grid, $.ToleranceCrop.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.ToleranceCrop.Grid.registerPlugin($.ToleranceCrop.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.ToleranceCrop.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.ToleranceCrop.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.ToleranceCrop.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.ToleranceCrop.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.ToleranceCrop.Grid.updateRowCount();
            $.ToleranceCrop.Grid.render();
            $.ToleranceCrop.UpdateRecordCount();
        });

        // Row chnge event
        $.ToleranceCrop.DataView.onRowsChanged.subscribe(function (e, args) {
            $.ToleranceCrop.Grid.invalidateRows(args.rows);
            $.ToleranceCrop.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.ToleranceCrop.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.ToleranceCrop.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.ToleranceCrop.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.ToleranceCrop.Grid;
                $.ToleranceCrop.DataView.refresh();
                $.ToleranceCrop.UpdateRecordCount();
            }
        });

        $.ToleranceCrop.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.ToleranceCrop.DataView.setFilter($.CSF.globalFilter);
        $.ToleranceCrop.Grid.init();

        $.ToleranceCrop.UpdateRecordCount();
        $.ToleranceCrop.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.ToleranceCrop.DataView.getGroups().length * 2;
        $('#' + $.ToleranceCrop.CounterName).text('| ' + Number($.ToleranceCrop.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.ToleranceCrop.Grid) {
            $.ToleranceCrop.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.ToleranceCrop.GridContainer).height($(window).height() - $('#ToleranceCropFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.ToleranceCrop.ResizeGrid();
});

$(window).load(function () {
    $.ToleranceCrop.ResizeGridContainer();
    $.ToleranceCrop.Driver();

    $('#ExportToleranceCropGrid').click(function () {
        $.GUM.ExportSlickGrid($.ToleranceCrop.Grid, $.ToleranceCrop.DataView);
    });
});