$.RegistrantHelper = {
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

$.Registrant = {
    CookieName: "Picol.Search.Index.RegistrantGrid",
    GridContainer: 'RegistrantGrid',
    CounterName: 'RegistrantCounter',
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
        { id: "Website", name: "Website", field: "Website", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.RegistrantHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Registrants');
        $.Registrant.ResizeGridContainer();

        $.Registrant.Clean()
            .done($.Registrant.Instantiate)
            .done($.Registrant.GetRegistrants)
            .done($.Registrant.BuildMenu)
            .done($.Registrant.ConfigureColumns)
            .done($.Registrant.InitializeGrid)
            .done($.Registrant.InitializeGridPlugins)
            .done($.Registrant.WireGridEvents)
            .done($.Registrant.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Registrant.Grid) {
            $('#' + $.Registrant.CounterName).text('');
            $('#' + $.Registrant.CounterName).empty();
            $('#' + $.Registrant.CounterName + ' input').val('');

            var members = [];
            $.each($.Registrant.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Registrant.ColumnFilters[item] = '';
            });

            $.Registrant.Grid.invalidateAllRows();
            $('#' + $.Registrant.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Registrant.Data = [];
        $.Registrant.ColumnFilters = {};
        $.Registrant.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Registrant.Columns.length; i++) {
            switch ($.Registrant.Columns[i]["id"]) {
                case 'Name':
                    $.Registrant.Columns[i].header = {
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

    GetRegistrants: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetRegistrants',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Registrants.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Registrants.length; i++) {
                            $.Registrant.Data[i] = {
                                "id": response.Registrants[i]["Id"],
                                "Name": response.Registrants[i]["Name"],
                                "Website": response.Registrants[i]["Website"]
                            };
                        }

                        $.Registrant.DataView.setItems($.Registrant.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Registrant.CookieName);

        // We set the display columns to the manually defined columns
        $.Registrant.DisplayColumns = $.Registrant.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Registrant.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Registrant.DisplayColumns.length; k++) {
                    if ($.Registrant.DisplayColumns[k].id == columnData[i].Id) {
                        $.Registrant.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Registrant.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Registrant.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Registrant.ColumnFilters;
        $.CSF.globalGridReference = $.Registrant.Grid;
        $.Registrant.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Registrant.Grid = new Slick.Grid("#" + $.Registrant.GridContainer, $.Registrant.DataView, $.Registrant.DisplayColumns, $.Registrant.GridOptions);

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
                    $.GUM.SaveToCookie($.Registrant.CookieName, JSON.stringify($.Registrant.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Registrant.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Registrant.Grid, $.Registrant.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Registrant.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Registrant.Columns, $.Registrant.Grid, $.Registrant.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Registrant.Grid.registerPlugin($.Registrant.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Registrant.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Registrant.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Registrant.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Registrant.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Registrant.Grid.updateRowCount();
            $.Registrant.Grid.render();
            $.Registrant.UpdateRecordCount();
        });

        // Row chnge event
        $.Registrant.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Registrant.Grid.invalidateRows(args.rows);
            $.Registrant.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Registrant.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Registrant.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Registrant.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Registrant.Grid;
                $.Registrant.DataView.refresh();
                $.Registrant.UpdateRecordCount();
            }
        });

        $.Registrant.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Registrant.DataView.setFilter($.CSF.globalFilter);
        $.Registrant.Grid.init();

        $.Registrant.UpdateRecordCount();
        $.Registrant.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Registrant.DataView.getGroups().length * 2;
        $('#' + $.Registrant.CounterName).text('| ' + Number($.Registrant.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Registrant.Grid) {
            $.Registrant.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Registrant.GridContainer).height($(window).height() - $('#RegistrantFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Registrant.ResizeGrid();
});

$(window).load(function () {
    $.Registrant.ResizeGridContainer();
    $.Registrant.Driver();

    $('#ExportRegistrantGrid').click(function () {
        $.GUM.ExportSlickGrid($.Registrant.Grid, $.Registrant.DataView);
    });
});