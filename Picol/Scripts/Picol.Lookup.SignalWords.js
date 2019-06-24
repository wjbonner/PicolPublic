$.SignalWordHelper = {
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

$.SignalWord = {
    CookieName: "Picol.Search.Index.SignalWordGrid",
    GridContainer: 'SignalWordGrid',
    CounterName: 'SignalWordCounter',
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
        editCommandHandler: $.SignalWordHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving SignalWords');
        $.SignalWord.ResizeGridContainer();

        $.SignalWord.Clean()
            .done($.SignalWord.Instantiate)
            .done($.SignalWord.GetSignalWords)
            .done($.SignalWord.BuildMenu)
            .done($.SignalWord.ConfigureColumns)
            .done($.SignalWord.InitializeGrid)
            .done($.SignalWord.InitializeGridPlugins)
            .done($.SignalWord.WireGridEvents)
            .done($.SignalWord.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.SignalWord.Grid) {
            $('#' + $.SignalWord.CounterName).text('');
            $('#' + $.SignalWord.CounterName).empty();
            $('#' + $.SignalWord.CounterName + ' input').val('');

            var members = [];
            $.each($.SignalWord.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.SignalWord.ColumnFilters[item] = '';
            });

            $.SignalWord.Grid.invalidateAllRows();
            $('#' + $.SignalWord.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.SignalWord.Data = [];
        $.SignalWord.ColumnFilters = {};
        $.SignalWord.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.SignalWord.Columns.length; i++) {
            switch ($.SignalWord.Columns[i]["id"]) {
                case 'Name':
                    $.SignalWord.Columns[i].header = {
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

    GetSignalWords: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetSignalWords',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.SignalWords.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.SignalWords.length; i++) {
                            $.SignalWord.Data[i] = {
                                "id": response.SignalWords[i]["Id"],
                                "Name": response.SignalWords[i]["Name"],
                                "Code": response.SignalWords[i]["Code"]
                            };
                        }

                        $.SignalWord.DataView.setItems($.SignalWord.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.SignalWord.CookieName);

        // We set the display columns to the manually defined columns
        $.SignalWord.DisplayColumns = $.SignalWord.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.SignalWord.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.SignalWord.DisplayColumns.length; k++) {
                    if ($.SignalWord.DisplayColumns[k].id == columnData[i].Id) {
                        $.SignalWord.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.SignalWord.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.SignalWord.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.SignalWord.ColumnFilters;
        $.CSF.globalGridReference = $.SignalWord.Grid;
        $.SignalWord.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.SignalWord.Grid = new Slick.Grid("#" + $.SignalWord.GridContainer, $.SignalWord.DataView, $.SignalWord.DisplayColumns, $.SignalWord.GridOptions);

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
                    $.GUM.SaveToCookie($.SignalWord.CookieName, JSON.stringify($.SignalWord.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.SignalWord.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.SignalWord.Grid, $.SignalWord.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.SignalWord.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.SignalWord.Columns, $.SignalWord.Grid, $.SignalWord.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.SignalWord.Grid.registerPlugin($.SignalWord.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.SignalWord.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.SignalWord.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.SignalWord.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.SignalWord.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.SignalWord.Grid.updateRowCount();
            $.SignalWord.Grid.render();
            $.SignalWord.UpdateRecordCount();
        });

        // Row chnge event
        $.SignalWord.DataView.onRowsChanged.subscribe(function (e, args) {
            $.SignalWord.Grid.invalidateRows(args.rows);
            $.SignalWord.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.SignalWord.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.SignalWord.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.SignalWord.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.SignalWord.Grid;
                $.SignalWord.DataView.refresh();
                $.SignalWord.UpdateRecordCount();
            }
        });

        $.SignalWord.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.SignalWord.DataView.setFilter($.CSF.globalFilter);
        $.SignalWord.Grid.init();

        $.SignalWord.UpdateRecordCount();
        $.SignalWord.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.SignalWord.DataView.getGroups().length * 2;
        $('#' + $.SignalWord.CounterName).text('| ' + Number($.SignalWord.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.SignalWord.Grid) {
            $.SignalWord.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.SignalWord.GridContainer).height($(window).height() - $('#SignalWordFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.SignalWord.ResizeGrid();
});

$(window).load(function () {
    $.SignalWord.ResizeGridContainer();
    $.SignalWord.Driver();

    $('#ExportSignalWordGrid').click(function () {
        $.GUM.ExportSlickGrid($.SignalWord.Grid, $.SignalWord.DataView);
    });
});