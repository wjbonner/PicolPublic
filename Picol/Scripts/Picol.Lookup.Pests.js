$.PestHelper = {
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

$.Pest = {
    CookieName: "Picol.Search.Index.PestGrid",
    GridContainer: 'PestGrid',
    CounterName: 'PestCounter',
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
        { id: "Name", name: "Name", field: "Name", sortable: true, maxWidth: 340 },
        { id: "Code", name: "Code", field: "Code", sortable: true, maxWidth: 100 },
        { id: "Notes", name: "Notes", field: "Notes", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.PestHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Pests');
        $.Pest.ResizeGridContainer();

        $.Pest.Clean()
            .done($.Pest.Instantiate)
            .done($.Pest.GetPests)
            .done($.Pest.BuildMenu)
            .done($.Pest.ConfigureColumns)
            .done($.Pest.InitializeGrid)
            .done($.Pest.InitializeGridPlugins)
            .done($.Pest.WireGridEvents)
            .done($.Pest.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Pest.Grid) {
            $('#' + $.Pest.CounterName).text('');
            $('#' + $.Pest.CounterName).empty();
            $('#' + $.Pest.CounterName + ' input').val('');

            var members = [];
            $.each($.Pest.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Pest.ColumnFilters[item] = '';
            });

            $.Pest.Grid.invalidateAllRows();
            $('#' + $.Pest.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Pest.Data = [];
        $.Pest.ColumnFilters = {};
        $.Pest.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Pest.Columns.length; i++) {
            switch ($.Pest.Columns[i]["id"]) {
                case 'Name':
                    $.Pest.Columns[i].header = {
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

    GetPests: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetPests',
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
                        for (var i = 0; i < response.Pests.length; i++) {
                            $.Pest.Data[i] = {
                                "id": response.Pests[i]["Id"],
                                "Name": response.Pests[i]["Name"],
                                "Code": response.Pests[i]["Code"],
                                "Notes": response.Pests[i]["Notes"]
                            };
                        }

                        $.Pest.DataView.setItems($.Pest.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Pest.CookieName);

        // We set the display columns to the manually defined columns
        $.Pest.DisplayColumns = $.Pest.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Pest.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Pest.DisplayColumns.length; k++) {
                    if ($.Pest.DisplayColumns[k].id == columnData[i].Id) {
                        $.Pest.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Pest.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Pest.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Pest.ColumnFilters;
        $.CSF.globalGridReference = $.Pest.Grid;
        $.Pest.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Pest.Grid = new Slick.Grid("#" + $.Pest.GridContainer, $.Pest.DataView, $.Pest.DisplayColumns, $.Pest.GridOptions);

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
                    $.GUM.SaveToCookie($.Pest.CookieName, JSON.stringify($.Pest.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Pest.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Pest.Grid, $.Pest.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Pest.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Pest.Columns, $.Pest.Grid, $.Pest.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Pest.Grid.registerPlugin($.Pest.GroupItemMetadataProvider);

        // Enable auto tool tips
        $.Pest.Grid.registerPlugin(new Slick.AutoTooltips());

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Pest.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Pest.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Pest.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Pest.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Pest.Grid.updateRowCount();
            $.Pest.Grid.render();
            $.Pest.UpdateRecordCount();
        });

        // Row chnge event
        $.Pest.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Pest.Grid.invalidateRows(args.rows);
            $.Pest.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Pest.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Pest.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Pest.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Pest.Grid;
                $.Pest.DataView.refresh();
                $.Pest.UpdateRecordCount();
            }
        });

        $.Pest.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Pest.DataView.setFilter($.CSF.globalFilter);
        $.Pest.Grid.init();

        $.Pest.UpdateRecordCount();
        $.Pest.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Pest.DataView.getGroups().length * 2;
        $('#' + $.Pest.CounterName).text('| ' + Number($.Pest.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Pest.Grid) {
            $.Pest.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Pest.GridContainer).height($(window).height() - $('#PestFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Pest.ResizeGrid();
});

$(window).load(function () {
    $.Pest.ResizeGridContainer();
    $.Pest.Driver();

    $('#ExportPestGrid').click(function () {
        $.GUM.ExportSlickGrid($.Pest.Grid, $.Pest.DataView);
    });
});