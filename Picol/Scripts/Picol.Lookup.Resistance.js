$.ResistanceCodeHelper = {
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

$.ResistanceCode = {
    CookieName: "Picol.Search.Index.ResistanceCodeGrid",
    GridContainer: 'ResistanceCodeGrid',
    CounterName: 'ResistanceCodeCounter',
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
        { id: "Source", name: "Source", field: "Source", sortable: true, maxWidth: 340 },
        { id: "Code", name: "Code", field: "Code", sortable: true, maxWidth: 100 },
        { id: "Moa", name: "Moa", field: "Moa", sortable: true },
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ResistanceCodeHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving ResistanceCodes');
        $.ResistanceCode.ResizeGridContainer();

        $.ResistanceCode.Clean()
            .done($.ResistanceCode.Instantiate)
            .done($.ResistanceCode.GetResistanceCodes)
            .done($.ResistanceCode.BuildMenu)
            .done($.ResistanceCode.ConfigureColumns)
            .done($.ResistanceCode.InitializeGrid)
            .done($.ResistanceCode.InitializeGridPlugins)
            .done($.ResistanceCode.WireGridEvents)
            .done($.ResistanceCode.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.ResistanceCode.Grid) {
            $('#' + $.ResistanceCode.CounterName).text('');
            $('#' + $.ResistanceCode.CounterName).empty();
            $('#' + $.ResistanceCode.CounterName + ' input').val('');

            var members = [];
            $.each($.ResistanceCode.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.ResistanceCode.ColumnFilters[item] = '';
            });

            $.ResistanceCode.Grid.invalidateAllRows();
            $('#' + $.ResistanceCode.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ResistanceCode.Data = [];
        $.ResistanceCode.ColumnFilters = {};
        $.ResistanceCode.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.ResistanceCode.Columns.length; i++) {
            switch ($.ResistanceCode.Columns[i]["id"]) {
                case 'Name':
                    $.ResistanceCode.Columns[i].header = {
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

    GetResistanceCodes: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetResistanceCodes',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.ResistanceCodes.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.ResistanceCodes.length; i++) {
                            $.ResistanceCode.Data[i] = {
                                "id": response.ResistanceCodes[i]["Id"],
                                "Source": response.ResistanceCodes[i]["Source"],
                                "Code": response.ResistanceCodes[i]["Code"],
                                "Moa": response.ResistanceCodes[i]["Moa"],
                            };
                        }

                        $.ResistanceCode.DataView.setItems($.ResistanceCode.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.ResistanceCode.CookieName);

        // We set the display columns to the manually defined columns
        $.ResistanceCode.DisplayColumns = $.ResistanceCode.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.ResistanceCode.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.ResistanceCode.DisplayColumns.length; k++) {
                    if ($.ResistanceCode.DisplayColumns[k].id == columnData[i].Id) {
                        $.ResistanceCode.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.ResistanceCode.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.ResistanceCode.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.ResistanceCode.ColumnFilters;
        $.CSF.globalGridReference = $.ResistanceCode.Grid;
        $.ResistanceCode.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ResistanceCode.Grid = new Slick.Grid("#" + $.ResistanceCode.GridContainer, $.ResistanceCode.DataView, $.ResistanceCode.DisplayColumns, $.ResistanceCode.GridOptions);

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
                    $.GUM.SaveToCookie($.ResistanceCode.CookieName, JSON.stringify($.ResistanceCode.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.ResistanceCode.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.ResistanceCode.Grid, $.ResistanceCode.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.ResistanceCode.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.ResistanceCode.Columns, $.ResistanceCode.Grid, $.ResistanceCode.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.ResistanceCode.Grid.registerPlugin($.ResistanceCode.GroupItemMetadataProvider);

        // Enable auto tool tips
        $.ResistanceCode.Grid.registerPlugin(new Slick.AutoTooltips());

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.ResistanceCode.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.ResistanceCode.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.ResistanceCode.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.ResistanceCode.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.ResistanceCode.Grid.updateRowCount();
            $.ResistanceCode.Grid.render();
            $.ResistanceCode.UpdateRecordCount();
        });

        // Row chnge event
        $.ResistanceCode.DataView.onRowsChanged.subscribe(function (e, args) {
            $.ResistanceCode.Grid.invalidateRows(args.rows);
            $.ResistanceCode.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.ResistanceCode.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.ResistanceCode.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.ResistanceCode.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.ResistanceCode.Grid;
                $.ResistanceCode.DataView.refresh();
                $.ResistanceCode.UpdateRecordCount();
            }
        });

        $.ResistanceCode.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.ResistanceCode.DataView.setFilter($.CSF.globalFilter);
        $.ResistanceCode.Grid.init();

        $.ResistanceCode.UpdateRecordCount();
        $.ResistanceCode.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.ResistanceCode.DataView.getGroups().length * 2;
        $('#' + $.ResistanceCode.CounterName).text('| ' + Number($.ResistanceCode.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.ResistanceCode.Grid) {
            $.ResistanceCode.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.ResistanceCode.GridContainer).height($(window).height() - $('#ResistanceCodeFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.ResistanceCode.ResizeGrid();
});

$(window).load(function () {
    $.ResistanceCode.ResizeGridContainer();
    $.ResistanceCode.Driver();

    $('#ExportResistanceCodeGrid').click(function () {
        $.GUM.ExportSlickGrid($.ResistanceCode.Grid, $.ResistanceCode.DataView);
    });
});