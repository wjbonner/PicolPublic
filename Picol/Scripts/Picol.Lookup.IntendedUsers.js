$.IntendedUserHelper = {
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

$.IntendedUser = {
    CookieName: "Picol.Search.Index.IntendedUserGrid",
    GridContainer: 'IntendedUserGrid',
    CounterName: 'IntendedUserCounter',
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
        { id: "Code", name: "Code", field: "Code", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.IntendedUserHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving IntendedUsers');
        $.IntendedUser.ResizeGridContainer();

        $.IntendedUser.Clean()
            .done($.IntendedUser.Instantiate)
            .done($.IntendedUser.GetIntendedUsers)
            .done($.IntendedUser.BuildMenu)
            .done($.IntendedUser.ConfigureColumns)
            .done($.IntendedUser.InitializeGrid)
            .done($.IntendedUser.InitializeGridPlugins)
            .done($.IntendedUser.WireGridEvents)
            .done($.IntendedUser.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.IntendedUser.Grid) {
            $('#' + $.IntendedUser.CounterName).text('');
            $('#' + $.IntendedUser.CounterName).empty();
            $('#' + $.IntendedUser.CounterName + ' input').val('');

            var members = [];
            $.each($.IntendedUser.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.IntendedUser.ColumnFilters[item] = '';
            });

            $.IntendedUser.Grid.invalidateAllRows();
            $('#' + $.IntendedUser.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.IntendedUser.Data = [];
        $.IntendedUser.ColumnFilters = {};
        $.IntendedUser.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.IntendedUser.Columns.length; i++) {
            switch ($.IntendedUser.Columns[i]["id"]) {
                case 'Name':
                    $.IntendedUser.Columns[i].header = {
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

    GetIntendedUsers: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetIntendedUsers',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.IntendedUsers.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.IntendedUsers.length; i++) {
                            $.IntendedUser.Data[i] = {
                                "id": response.IntendedUsers[i]["Id"],
                                "Name": response.IntendedUsers[i]["Name"],
                                "Code": response.IntendedUsers[i]["Code"]
                            };
                        }

                        $.IntendedUser.DataView.setItems($.IntendedUser.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.IntendedUser.CookieName);

        // We set the display columns to the manually defined columns
        $.IntendedUser.DisplayColumns = $.IntendedUser.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.IntendedUser.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.IntendedUser.DisplayColumns.length; k++) {
                    if ($.IntendedUser.DisplayColumns[k].id == columnData[i].Id) {
                        $.IntendedUser.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.IntendedUser.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.IntendedUser.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.IntendedUser.ColumnFilters;
        $.CSF.globalGridReference = $.IntendedUser.Grid;
        $.IntendedUser.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.IntendedUser.Grid = new Slick.Grid("#" + $.IntendedUser.GridContainer, $.IntendedUser.DataView, $.IntendedUser.DisplayColumns, $.IntendedUser.GridOptions);

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
                    $.GUM.SaveToCookie($.IntendedUser.CookieName, JSON.stringify($.IntendedUser.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.IntendedUser.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.IntendedUser.Grid, $.IntendedUser.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.IntendedUser.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.IntendedUser.Columns, $.IntendedUser.Grid, $.IntendedUser.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.IntendedUser.Grid.registerPlugin($.IntendedUser.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.IntendedUser.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.IntendedUser.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.IntendedUser.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.IntendedUser.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.IntendedUser.Grid.updateRowCount();
            $.IntendedUser.Grid.render();
            $.IntendedUser.UpdateRecordCount();
        });

        // Row chnge event
        $.IntendedUser.DataView.onRowsChanged.subscribe(function (e, args) {
            $.IntendedUser.Grid.invalidateRows(args.rows);
            $.IntendedUser.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.IntendedUser.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.IntendedUser.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.IntendedUser.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.IntendedUser.Grid;
                $.IntendedUser.DataView.refresh();
                $.IntendedUser.UpdateRecordCount();
            }
        });

        $.IntendedUser.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.IntendedUser.DataView.setFilter($.CSF.globalFilter);
        $.IntendedUser.Grid.init();

        $.IntendedUser.UpdateRecordCount();
        $.IntendedUser.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.IntendedUser.DataView.getGroups().length * 2;
        $('#' + $.IntendedUser.CounterName).text('| ' + Number($.IntendedUser.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.IntendedUser.Grid) {
            $.IntendedUser.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.IntendedUser.GridContainer).height($(window).height() - $('#IntendedUserFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.IntendedUser.ResizeGrid();
});

$(window).load(function () {
    $.IntendedUser.ResizeGridContainer();
    $.IntendedUser.Driver();

    $('#ExportIntendedUserGrid').click(function () {
        $.GUM.ExportSlickGrid($.IntendedUser.Grid, $.IntendedUser.DataView);
    });
});