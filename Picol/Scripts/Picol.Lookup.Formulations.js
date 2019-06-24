$.FormulationHelper = {
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

$.Formulation = {
    CookieName: "Picol.Search.Index.FormulationGrid",
    GridContainer: 'FormulationGrid',
    CounterName: 'FormulationCounter',
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
        { id: "Name", name: "Name", field: "Name", sortable: true, maxWidth: 170 },
        { id: "Code", name: "Code", field: "Code", sortable: true, maxWidth: 60 },
        { id: "Notes", name: "Notes", field: "Notes", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.FormulationHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Formulations');
        $.Formulation.ResizeGridContainer();

        $.Formulation.Clean()
            .done($.Formulation.Instantiate)
            .done($.Formulation.GetFormulations)
            .done($.Formulation.BuildMenu)
            .done($.Formulation.ConfigureColumns)
            .done($.Formulation.InitializeGrid)
            .done($.Formulation.InitializeGridPlugins)
            .done($.Formulation.WireGridEvents)
            .done($.Formulation.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Formulation.Grid) {
            $('#' + $.Formulation.CounterName).text('');
            $('#' + $.Formulation.CounterName).empty();
            $('#' + $.Formulation.CounterName + ' input').val('');

            var members = [];
            $.each($.Formulation.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Formulation.ColumnFilters[item] = '';
            });

            $.Formulation.Grid.invalidateAllRows();
            $('#' + $.Formulation.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Formulation.Data = [];
        $.Formulation.ColumnFilters = {};
        $.Formulation.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Formulation.Columns.length; i++) {
            switch ($.Formulation.Columns[i]["id"]) {
                case 'Name':
                    $.Formulation.Columns[i].header = {
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

    GetFormulations: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetFormulations',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Formulations.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Formulations.length; i++) {
                            $.Formulation.Data[i] = {
                                "id": response.Formulations[i]["Id"],
                                "Name": response.Formulations[i]["Name"],
                                "Code": response.Formulations[i]["Code"],
                                "Notes": response.Formulations[i]["Notes"]
                            };
                        }

                        $.Formulation.DataView.setItems($.Formulation.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Formulation.CookieName);

        // We set the display columns to the manually defined columns
        $.Formulation.DisplayColumns = $.Formulation.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Formulation.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Formulation.DisplayColumns.length; k++) {
                    if ($.Formulation.DisplayColumns[k].id == columnData[i].Id) {
                        $.Formulation.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Formulation.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Formulation.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Formulation.ColumnFilters;
        $.CSF.globalGridReference = $.Formulation.Grid;
        $.Formulation.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Formulation.Grid = new Slick.Grid("#" + $.Formulation.GridContainer, $.Formulation.DataView, $.Formulation.DisplayColumns, $.Formulation.GridOptions);

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
                    $.GUM.SaveToCookie($.Formulation.CookieName, JSON.stringify($.Formulation.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Formulation.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Formulation.Grid, $.Formulation.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Formulation.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Formulation.Columns, $.Formulation.Grid, $.Formulation.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Formulation.Grid.registerPlugin($.Formulation.GroupItemMetadataProvider);

        // Enable auto tool tips
        $.Formulation.Grid.registerPlugin(new Slick.AutoTooltips());

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Formulation.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Formulation.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Formulation.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Formulation.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Formulation.Grid.updateRowCount();
            $.Formulation.Grid.render();
            $.Formulation.UpdateRecordCount();
        });

        // Row chnge event
        $.Formulation.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Formulation.Grid.invalidateRows(args.rows);
            $.Formulation.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Formulation.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Formulation.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Formulation.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Formulation.Grid;
                $.Formulation.DataView.refresh();
                $.Formulation.UpdateRecordCount();
            }
        });

        $.Formulation.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Formulation.DataView.setFilter($.CSF.globalFilter);
        $.Formulation.Grid.init();

        $.Formulation.UpdateRecordCount();
        $.Formulation.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Formulation.DataView.getGroups().length * 2;
        $('#' + $.Formulation.CounterName).text('| ' + Number($.Formulation.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Formulation.Grid) {
            $.Formulation.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Formulation.GridContainer).height($(window).height() - $('#FormulationFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Formulation.ResizeGrid();
});

$(window).load(function () {
    $.Formulation.ResizeGridContainer();
    $.Formulation.Driver();

    $('#ExportFormulationGrid').click(function () {
        $.GUM.ExportSlickGrid($.Formulation.Grid, $.Formulation.DataView);
    });
});